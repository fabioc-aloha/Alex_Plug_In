/**
 * shared/replicate-core.cjs - Shared Replicate API utilities
 *
 * Consolidates duplicated patterns from 6+ generator scripts:
 * - Client initialization with .env loading
 * - CLI argument parsing (--dry-run, --limit, --skip, --only, --reference)
 * - Cost estimation per model
 * - Batch execution with retry and rate limiting
 * - Generation report creation
 * - Output file handling (FileObject vs URL response normalization)
 *
 * Usage:
 *   const { initReplicate, parseCliArgs, runBatch, estimateCost } = require('./shared/replicate-core.cjs');
 *   const client = initReplicate();
 *   const args = parseCliArgs(process.argv);
 *   const results = await runBatch(client, jobs, { dryRun: args.dryRun, rateLimit: 3000 });
 */

const fs = require('fs');
const path = require('path');

// Approximate cost per run by model (USD, as of 2026-03)
const MODEL_COSTS = {
  'google/nano-banana-pro': 0.05,
  'ideogram-ai/ideogram-v2': 0.08,
  'ideogram-ai/ideogram-v2-turbo': 0.04,
  'ideogram-ai/ideogram-v3-quality': 0.09,
  'black-forest-labs/flux-1.1-pro': 0.04,
  'black-forest-labs/flux-1.1-pro-ultra': 0.06,
  'black-forest-labs/flux-schnell': 0.003,
  'black-forest-labs/flux-dev': 0.025,
  'stability-ai/sdxl': 0.01,
  'stability-ai/stable-diffusion-3': 0.035,
  'lucataco/remove-bg': 0.005,
  'nightmareai/real-esrgan': 0.01,
};

// Duration constraints per model (seconds) -- fail fast on invalid durations
const DURATION_CONSTRAINTS = {
  'minimax/hailuo-ai-video-01-director': { allowed: [6, 10], default: 6 },
  'minimax/hailuo-ai-video-01-live': { allowed: [6, 10], default: 6 },
  'luma/ray': { min: 4, max: 8, default: 5 },
  'luma/photon-flash-1': { min: 3, max: 8, default: 5 },
  'kling-ai/v1-5/pro/image-to-video': { allowed: [5, 10], default: 5 },
  'kling-ai/v2/image-to-video': { allowed: [5, 10], default: 5 },
  'stability-ai/stable-video-diffusion': { min: 2, max: 5, default: 4 },
};

// Model freshness tracking -- when each model was last verified
const MODEL_REGISTRY = {
  // Video models (also in DURATION_CONSTRAINTS)
  'minimax/hailuo-ai-video-01-director':  { verified: '2026-03-25', status: 'active' },
  'minimax/hailuo-ai-video-01-live':      { verified: '2026-03-25', status: 'active' },
  'luma/ray':                             { verified: '2026-03-25', status: 'active' },
  'luma/photon-flash-1':                  { verified: '2026-03-25', status: 'active' },
  'kling-ai/v1-5/pro/image-to-video':     { verified: '2026-03-25', status: 'active' },
  'kling-ai/v2/image-to-video':           { verified: '2026-03-25', status: 'active' },
  'stability-ai/stable-video-diffusion':  { verified: '2026-03-25', status: 'active' },
  // Image models
  'google/nano-banana-pro':               { verified: '2026-03-25', status: 'active' },
  'ideogram-ai/ideogram-v2':              { verified: '2026-03-25', status: 'active' },
  'ideogram-ai/ideogram-v2-turbo':        { verified: '2026-03-25', status: 'active' },
  'ideogram-ai/ideogram-v3-quality':      { verified: '2026-03-25', status: 'active' },
  'black-forest-labs/flux-1.1-pro':       { verified: '2026-03-25', status: 'active' },
  'black-forest-labs/flux-1.1-pro-ultra': { verified: '2026-03-25', status: 'active' },
  'black-forest-labs/flux-schnell':       { verified: '2026-03-25', status: 'active' },
  'black-forest-labs/flux-dev':           { verified: '2026-03-25', status: 'active' },
  'stability-ai/sdxl':                    { verified: '2026-03-25', status: 'active' },
  'stability-ai/stable-diffusion-3':      { verified: '2026-03-25', status: 'active' },
  'lucataco/remove-bg':                   { verified: '2026-03-25', status: 'active' },
  'nightmareai/real-esrgan':              { verified: '2026-03-25', status: 'active' },
};

/**
 * Validate duration parameter against model constraints.
 * @param {string} model - Replicate model identifier
 * @param {number} duration - Requested duration in seconds
 * @returns {{ valid: boolean, message?: string, suggested?: number }}
 */
function validateDuration(model, duration) {
  const constraint = DURATION_CONSTRAINTS[model];
  if (!constraint) return { valid: true };

  if (constraint.allowed) {
    if (!constraint.allowed.includes(duration)) {
      return {
        valid: false,
        message: `${model} only accepts durations: ${constraint.allowed.join('s, ')}s (you requested ${duration}s)`,
        suggested: constraint.default,
      };
    }
  } else if (constraint.min != null && constraint.max != null) {
    if (duration < constraint.min || duration > constraint.max) {
      return {
        valid: false,
        message: `${model} accepts ${constraint.min}-${constraint.max}s (you requested ${duration}s)`,
        suggested: constraint.default,
      };
    }
  }
  return { valid: true };
}

/**
 * Check model freshness -- warn if model was verified more than `maxAgeDays` ago.
 * @param {string} model - Replicate model identifier
 * @param {number} [maxAgeDays=90] - Stale threshold in days
 * @returns {{ fresh: boolean, daysSinceVerified?: number, status?: string }}
 */
function checkModelFreshness(model, maxAgeDays = 90) {
  const entry = MODEL_REGISTRY[model];
  if (!entry) return { fresh: true }; // Unknown models aren't tracked
  const days = Math.floor((Date.now() - new Date(entry.verified).getTime()) / 86400000);
  return {
    fresh: days <= maxAgeDays,
    daysSinceVerified: days,
    status: entry.status,
  };
}

/**
 * Initialize Replicate client. Loads .env from project root if available.
 * Returns a lazy-init function (actual require('replicate') is deferred for ESM compat).
 */
function initReplicate(envPath) {
  // Load .env file
  try {
    const dotenv = require('dotenv');
    const defaultEnvPath = envPath || path.join(process.cwd(), '.env');
    if (fs.existsSync(defaultEnvPath)) {
      dotenv.config({ path: defaultEnvPath });
    }
  } catch { /* dotenv not available, rely on env vars */ }

  if (!process.env.REPLICATE_API_TOKEN) {
    const hint = process.platform === 'win32'
      ? '$env:REPLICATE_API_TOKEN = "r8_..."'
      : 'export REPLICATE_API_TOKEN="r8_..."';
    console.error('ERROR: REPLICATE_API_TOKEN not set.');
    console.error(`Set via: .env file or ${hint}`);
    process.exit(1);
  }

  // Return config object -- caller creates the Replicate instance
  return {
    auth: process.env.REPLICATE_API_TOKEN,
  };
}

/**
 * Parse common CLI arguments for Replicate generator scripts.
 */
function parseCliArgs(argv) {
  const args = argv.slice(2);
  const result = {
    dryRun: false,
    limit: Infinity,
    skip: 0,
    only: null,
    reference: null,
    outputDir: null,
    variants: 1,
    savePrompts: false,
    postprocess: null,
    negativePrompt: null,
    promptFile: null,
    extras: [],
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg.startsWith('--limit=')) {
      result.limit = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--skip=')) {
      result.skip = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--only=')) {
      result.only = arg.split('=')[1].split(',').map(s => s.trim());
    } else if (arg.startsWith('--reference=')) {
      result.reference = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      result.outputDir = arg.split('=')[1];
    } else if (arg.startsWith('--variants=')) {
      result.variants = Math.max(1, parseInt(arg.split('=')[1], 10));
    } else if (arg === '--save-prompts') {
      result.savePrompts = true;
    } else if (arg.startsWith('--postprocess=')) {
      result.postprocess = arg.split('=')[1].split(',').map(s => s.trim());
    } else if (arg.startsWith('--negative-prompt=')) {
      result.negativePrompt = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--prompt-file=')) {
      result.promptFile = arg.split('=').slice(1).join('=');
    } else {
      result.extras.push(arg);
    }
  }

  // Load prompts from external file if specified
  if (result.promptFile) {
    const resolved = path.resolve(result.promptFile);
    if (!fs.existsSync(resolved)) {
      console.error(`Prompt file not found: ${resolved}`);
      process.exit(1);
    }
    result.promptFileContent = fs.readFileSync(resolved, 'utf8').trim();
  }

  return result;
}

/**
 * Estimate cost for a batch of jobs.
 * @param {string} model - Replicate model identifier
 * @param {number} count - Number of images to generate
 * @returns {{ perImage: number, total: number, model: string }}
 */
function estimateCost(model, count) {
  const perImage = MODEL_COSTS[model] || 0.05;
  return {
    perImage,
    total: perImage * count,
    model,
  };
}

/**
 * Normalize Replicate output -- handles both FileObject (modern) and URL (legacy) responses.
 * Writes the result to outputPath.
 * @param {*} output - Replicate.run() output (Buffer, FileObject, URL string, or array)
 * @param {string} outputPath - Destination file path
 */
async function writeOutput(output, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Modern API: output is a Buffer/FileObject -- write directly
  if (Buffer.isBuffer(output)) {
    fs.writeFileSync(outputPath, output);
    return;
  }

  // Array output (some models return [url])
  if (Array.isArray(output) && output.length > 0) {
    return writeOutput(output[0], outputPath);
  }

  // String URL output -- download it
  if (typeof output === 'string' && output.startsWith('http')) {
    const { downloadFile } = require('./data-uri.cjs');
    await downloadFile(output, outputPath);
    return;
  }

  // FileObject with arrayBuffer() method
  if (output && typeof output.arrayBuffer === 'function') {
    const buf = Buffer.from(await output.arrayBuffer());
    fs.writeFileSync(outputPath, buf);
    return;
  }

  // Last resort: try writing as-is (handles ReadableStream from newer API)
  const { writeFile } = require('fs/promises');
  await writeFile(outputPath, output);
}

/**
 * Run a batch of Replicate generation jobs with retry and rate limiting.
 *
 * @param {object} replicateClient - Initialized Replicate instance
 * @param {Array} jobs - [{ id, model, input, outputPath, label? }]
 * @param {object} options - { dryRun, rateLimit (ms), maxRetries, onProgress }
 * @returns {Array} results - [{ id, status, outputPath?, error?, duration? }]
 */
async function runBatch(replicateClient, jobs, options = {}) {
  const { dryRun = false, rateLimit = 3000, maxRetries = 4, onProgress, savePrompts = false } = options;
  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const label = job.label || job.id || `Job ${i + 1}`;

    if (onProgress) onProgress({ index: i, total: jobs.length, label, phase: 'start' });

    if (dryRun) {
      console.log(`  [${i + 1}/${jobs.length}] [DRY-RUN] ${label}`);
      if (job.input && job.input.prompt) {
        console.log(`  Prompt: ${String(job.input.prompt).slice(0, 200)}...`);
      }
      results.push({ id: job.id, status: 'dry-run', prompt: job.input?.prompt });
      continue;
    }

    // #19: Duration constraint validation -- fail fast before API call
    if (job.input && job.input.duration != null) {
      const check = validateDuration(job.model, job.input.duration);
      if (!check.valid) {
        console.error(`  [${i + 1}/${jobs.length}] \u2717 ${label}: ${check.message}`);
        results.push({ id: job.id, status: 'failed', error: check.message, prompt: job.input?.prompt });
        continue;
      }
    }

    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const jobStart = Date.now();
        const output = await replicateClient.run(job.model, { input: job.input });
        await writeOutput(output, job.outputPath);
        const duration = ((Date.now() - jobStart) / 1000).toFixed(1);

        // #39: Save prompt text alongside output for reproducibility
        if (savePrompts && job.input?.prompt && job.outputPath) {
          const promptPath = job.outputPath.replace(/\.[^.]+$/, '.prompt.txt');
          fs.writeFileSync(promptPath, `Model: ${job.model}\nDate: ${new Date().toISOString()}\n\n${job.input.prompt}`, 'utf8');
        }

        console.log(`  [${i + 1}/${jobs.length}] \u2713 ${label} (${duration}s)`);
        results.push({
          id: job.id, status: 'success', outputPath: job.outputPath,
          duration: parseFloat(duration), prompt: job.input?.prompt,
        });
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        const msg = err.message || '';
        const isRateLimit = msg.includes('429') || msg.includes('rate') || msg.includes('Too Many');
        const isServerError = /5\d{2}/.test(msg);
        if ((isRateLimit || isServerError) && attempt < maxRetries) {
          const backoff = isRateLimit ? rateLimit * Math.pow(2, attempt) : 2000;
          const reason = isRateLimit ? 'Rate limited' : `Server error (${msg.slice(0, 40)})`;
          console.log(`  [${i + 1}/${jobs.length}] \u26A0 ${reason}, retry ${attempt + 1}/${maxRetries} in ${(backoff / 1000).toFixed(0)}s...`);
          await new Promise(r => setTimeout(r, backoff));
        } else if (attempt < maxRetries) {
          console.log(`  [${i + 1}/${jobs.length}] \u26A0 Attempt ${attempt + 1} failed: ${msg}, retrying...`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }

    if (lastError) {
      console.error(`  [${i + 1}/${jobs.length}] \u2717 ${label}: ${lastError.message}`);
      results.push({ id: job.id, status: 'failed', error: lastError.message, prompt: job.input?.prompt });
    }

    // Rate limiting between jobs
    if (!dryRun && i < jobs.length - 1) {
      await new Promise(r => setTimeout(r, rateLimit));
    }

    if (onProgress) onProgress({ index: i, total: jobs.length, label, phase: 'complete' });
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;

  return {
    results,
    summary: {
      total: jobs.length,
      successful,
      failed,
      dryRun: results.filter(r => r.status === 'dry-run').length,
      duration: parseFloat(totalDuration),
    },
  };
}

/**
 * Generate a JSON report file for a batch run.
 */
function writeReport(reportPath, data) {
  const report = {
    generator: data.generator || 'unknown',
    model: data.model || 'unknown',
    timestamp: new Date().toISOString(),
    ...data.summary,
    results: data.results,
  };

  const dir = path.dirname(reportPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n  \u{1F4CB} Report: ${reportPath}`);
  return report;
}

/**
 * Run image post-processing pipeline (RemBG, upscale, format convert).
 * @param {object} replicateClient - Initialized Replicate instance
 * @param {string} imagePath - Path to source image
 * @param {string[]} steps - Pipeline steps: ['rembg', 'upscale']
 * @param {object} [opts] - { outputDir, scale }
 * @returns {string} Final output path
 */
async function postProcess(replicateClient, imagePath, steps, opts = {}) {
  const PIPELINE_MODELS = {
    rembg: 'lucataco/remove-bg',
    upscale: 'nightmareai/real-esrgan',
  };

  let currentPath = imagePath;
  for (const step of steps) {
    const model = PIPELINE_MODELS[step];
    if (!model) {
      console.warn(`  (x) Unknown post-process step: ${step} (available: ${Object.keys(PIPELINE_MODELS).join(', ')})`);
      continue;
    }

    const ext = path.extname(currentPath);
    const base = currentPath.replace(ext, '');
    const outPath = `${base}_${step}${ext}`;

    const input = { image: fs.readFileSync(currentPath) };
    if (step === 'upscale' && opts.scale) input.scale = opts.scale;

    try {
      const output = await replicateClient.run(model, { input });
      await writeOutput(output, outPath);
      console.log(`  [OK] Post-process ${step}: ${path.basename(outPath)}`);
      currentPath = outPath;
    } catch (err) {
      console.error(`  [X] Post-process ${step} failed: ${err.message}`);
      break;
    }
  }
  return currentPath;
}

module.exports = {
  initReplicate,
  parseCliArgs,
  estimateCost,
  writeOutput,
  runBatch,
  writeReport,
  postProcess,
  validateDuration,
  checkModelFreshness,
  MODEL_COSTS,
  MODEL_REGISTRY,
  DURATION_CONSTRAINTS,
};
