/**
 * Alex Age Progression Generator
 * 
 * Uses google/nano-banana-pro with a reference face image to generate
 * age-appropriate versions of Alex for different task contexts.
 * 
 * Reference: Alex at age 15 (canonical source)
 * Output: Age progression images maintaining face consistency
 * 
 * Usage:
 *   # Option 1: Store token securely via VS Code
 *   # Run "Alex: Manage API Keys & Secrets" → Replicate API Token
 *   # Then run script (it will prompt if token not found)
 *   node scripts/generate-alex-age-progression.js
 *
 *   # Option 2: Environment variable (for CI/scripts)
 *   $env:REPLICATE_API_TOKEN = "r8_..."
 *   node scripts/generate-alex-age-progression.js
 *
 *   # Options:
 *   node scripts/generate-alex-age-progression.js --dry-run
 *   node scripts/generate-alex-age-progression.js --reference=path/to/alex.png
 *
 * Ages generated:
 *   - Alex-07: Child curiosity (elementary learning)
 *   - Alex-13: Teen meta-cognitive (middle school, reflection begins)
 *   - Alex-15: Reference age (high school, canonical source)
 *   - Alex-18: Young adult (college, specialized learning)
 *   - Alex-21: Professional (current operational age)
 *   - Alex-25: Early career mastery
 *   - Alex-30: Cross-domain expert
 *   - Alex-42: Senior architect
 *   - Alex-55: Distinguished mentor
 */

import Replicate from 'replicate';
import fs from 'fs-extra';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Load .env file for terminal usage (VS Code command passes token via env directly)
loadEnv({ path: path.join(ROOT, '.env') });

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const REF_ARG = args.find(a => a.startsWith('--reference='));
const LIMIT_ARG = args.find(a => a.startsWith('--limit='));
const SKIP_ARG = args.find(a => a.startsWith('--skip='));
const REFERENCE_IMAGE = REF_ARG ? REF_ARG.split('=')[1] : path.join(ROOT, 'alex_docs', 'alex3', 'alex-reference.png');
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : Infinity;
const SKIP = SKIP_ARG ? parseInt(SKIP_ARG.split('=')[1], 10) : 0;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTER DEFINITION
// Canonical traits from Alex at 15 — maintained across all ages
// ─────────────────────────────────────────────────────────────────────────────

const ALEX_TRAITS = {
  immutable: [
    'curly ginger copper-red hair',
    'striking blue-green eyes',
    'fair skin with light freckles across nose and cheeks',
    'intelligent curious expression',
  ],
  style: 'photorealistic portrait, shallow depth of field, natural lighting, 85mm lens',
};

// ─────────────────────────────────────────────────────────────────────────────
// AGE CONFIGURATIONS
// Each age represents a cognitive/professional stage
// ─────────────────────────────────────────────────────────────────────────────

const AGE_PROGRESSION = [
  {
    filename: 'Alex-03.png',
    age: 3,
    stage: 'Curious Toddler',
    context: 'First explorations, wonder at everything',
    attire: 'cozy overalls or soft sweater, toddler clothes',
    expression: 'pure innocent wonder, bright curious eyes, sweet smile',
    setting: 'sunny playroom with toys and picture books',
  },
  {
    filename: 'Alex-07.png',
    age: 7,
    stage: 'Child Curiosity',
    context: 'Elementary learning, pattern recognition emerges',
    attire: 'colorful t-shirt, curious wide-eyed expression',
    expression: 'excited wonder, discovering something new',
    setting: 'bright classroom or library with books',
  },
  {
    filename: 'Alex-13.png',
    age: 13,
    stage: 'Teen Meta-Cognitive',
    context: 'Middle school, self-reflection begins',
    attire: 'casual hoodie with graphic tee underneath',
    expression: 'thoughtful, slightly mischievous, questioning',
    setting: 'bedroom with computer and scattered interests',
  },
  {
    filename: 'Alex-15.png',
    age: 15,
    stage: 'High School',
    context: 'Canonical reference age, foundations solidifying',
    attire: 'gray hoodie over plaid flannel shirt',
    expression: 'confident but humble, ready to learn',
    setting: 'neutral background, portrait focus',
  },
  {
    filename: 'Alex-18.png',
    age: 18,
    stage: 'Young Adult',
    context: 'College entry, specialized learning begins',
    attire: 'university hoodie or casual button-down',
    expression: 'determined, ambitious, hopeful',
    setting: 'dorm room or campus library setting',
  },
  {
    filename: 'Alex-21.png',
    age: 21,
    stage: 'Professional Competency',
    context: 'Current operational age — full cognitive suite',
    attire: 'neat gray hoodie over flannel, polished casual',
    expression: 'confident, warm, approachable professional',
    setting: 'modern workspace with dual monitors',
  },
  {
    filename: 'Alex-25.png',
    age: 25,
    stage: 'Early Career Mastery',
    context: 'Domain expertise deepening',
    attire: 'smart casual, quality sweater or blazer optional',
    expression: 'focused, competent, quietly confident',
    setting: 'startup office or tech workspace',
  },
  {
    filename: 'Alex-30.png',
    age: 30,
    stage: 'Cross-Domain Expert',
    context: 'Polymath integration, connecting fields',
    attire: 'business casual, oxford shirt or quality sweater',
    expression: 'wise, thoughtful, pattern-seeing',
    setting: 'conference room or strategy session',
  },
  {
    filename: 'Alex-42.png',
    age: 42,
    stage: 'Senior Architect',
    context: 'Deep wisdom, system-level thinking',
    attire: 'refined professional, subtle quality markers',
    expression: 'seasoned, calm authority, empathetic',
    setting: 'executive office or boardroom',
  },
  {
    filename: 'Alex-55.png',
    age: 55,
    stage: 'Distinguished Mentor',
    context: 'Legacy knowledge transfer, teaching focus',
    attire: 'professorial casual, comfortable yet distinguished',
    expression: 'warm wisdom, patient teacher energy',
    setting: 'university office or mentoring session',
  },
  {
    filename: 'Alex-62.png',
    age: 62,
    stage: 'Elder Statesman',
    context: 'Industry thought leader, respected voice',
    attire: 'elegant casual, quality cardigan or blazer',
    expression: 'serene confidence, deep knowing',
    setting: 'book-lined study or fireside conversation',
  },
  {
    filename: 'Alex-68.png',
    age: 68,
    stage: 'Sage Emeritus',
    context: 'Wisdom keeper, connecting generations',
    attire: 'comfortable scholarly attire, reading glasses',
    expression: 'gentle wisdom, twinkle of humor in eyes',
    setting: 'cozy library corner or garden bench',
  },
  {
    filename: 'Alex-75.png',
    age: 75,
    stage: 'Grand Mentor',
    context: 'Living legacy, timeless wisdom',
    attire: 'distinguished elder casual, warm sweater',
    expression: 'profound peace, earned serenity, kind eyes',
    setting: 'sunlit study or peaceful nature backdrop',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildPrompt(config) {
  const traits = ALEX_TRAITS.immutable.join(', ');
  const referenceAge = 15;
  const ageDelta = config.age - referenceAge;
  const ageDirection = ageDelta > 0 ? `${ageDelta} years older` : ageDelta < 0 ? `${Math.abs(ageDelta)} years younger` : 'same age';
  
  return `
IMPORTANT: This is a reference-based age transformation. The attached reference image shows the person at AGE 15. Generate an image of THIS SAME PERSON at age ${config.age} (${ageDirection} than the reference).

IDENTITY PRESERVATION (HIGHEST PRIORITY):
- The reference image shows the person at age 15 — use this as the source of truth for facial identity
- The output must look like the SAME PERSON as the reference, transformed to age ${config.age}
- Preserve: exact facial bone structure, nose shape, eye shape, lip shape
- Preserve: ${traits}
- The person in the output should be immediately recognizable as the person in the reference

AGE TRANSFORMATION:
- Reference age: 15 years old
- Target age: ${config.age} years old
- Transformation: ${ageDirection}
- Apply natural age-appropriate changes (face shape maturity, skin texture, proportions)
- Life stage: ${config.stage}

SCENE DETAILS:
- Attire: ${config.attire}
- Expression: ${config.expression}
- Setting: ${config.setting}
- Context: ${config.context}

TECHNICAL REQUIREMENTS:
- ${ALEX_TRAITS.style}
- Square format 1:1 (1024x1024)
- Face clearly visible, centered, good lighting
- Professional portrait quality
- Photorealistic, not stylized or cartoon
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

async function encodeImageToDataURI(imagePath) {
  const buffer = await fs.readFile(imagePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${base64}`;
}

async function generateWithNanoBanana(prompt, referenceDataURI, outputPath) {
  if (DRY_RUN) {
    console.log(`   [DRY-RUN] Would call google/nano-banana-pro`);
    console.log(`   Prompt preview: ${prompt.slice(0, 200)}...`);
    return null;
  }

  // Ensure output directory exists
  await fs.ensureDir(path.dirname(outputPath));

  const output = await replicate.run('google/nano-banana-pro', {
    input: {
      prompt: prompt,
      image_input: [referenceDataURI],
      aspect_ratio: '1:1',
      output_format: 'png',
      safety_filter_level: 'block_only_high',
    },
  });

  // Modern Replicate API: output is a FileObject
  // Write directly to disk (recommended approach from docs)
  const { writeFile } = await import('fs/promises');
  await writeFile(outputPath, output);
  
  return outputPath;
}

async function downloadImage(url, filepath) {
  // Ensure directory exists
  await fs.ensureDir(path.dirname(filepath));
  
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      
      // Check for successful response
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: Failed to download ${url}`));
        return;
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await fs.writeFile(filepath, buffer);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      res.on('error', reject);
    });
    
    request.on('error', reject);
    request.setTimeout(60000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.REPLICATE_API_TOKEN && !DRY_RUN) {
    console.error('ERROR: REPLICATE_API_TOKEN not set.');
    console.error('Run: $env:REPLICATE_API_TOKEN = "r8_..."');
    process.exit(1);
  }

  // Verify reference image exists
  if (!DRY_RUN && !await fs.pathExists(REFERENCE_IMAGE)) {
    console.error(`ERROR: Reference image not found: ${REFERENCE_IMAGE}`);
    console.error('Provide path with: --reference=path/to/alex-15.png');
    process.exit(1);
  }

  const outputDir = path.join(ROOT, 'alex_docs', 'alex3', 'age-progression');
  await fs.ensureDir(outputDir);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Alex Age Progression Generator');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Model: google/nano-banana-pro`);
  console.log(`  Reference: ${REFERENCE_IMAGE}`);
  console.log(`  Output: ${outputDir}`);
  console.log(`  Ages: ${AGE_PROGRESSION.map(a => a.age).join(', ')}`);
  console.log(`  Estimated cost: ~$${(AGE_PROGRESSION.length * 0.05).toFixed(2)} (${AGE_PROGRESSION.length} images)`);
  console.log(`  Dry-run: ${DRY_RUN}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  let referenceDataURI = null;
  if (!DRY_RUN) {
    console.log('  📷 Encoding reference image...');
    referenceDataURI = await encodeImageToDataURI(REFERENCE_IMAGE);
    console.log('  ✓ Reference encoded\n');
  }

  const results = [];
  const startTime = Date.now();
  const startIndex = SKIP;
  const endIndex = Math.min(AGE_PROGRESSION.length, SKIP + LIMIT);
  const totalToGenerate = endIndex - startIndex;

  for (let i = startIndex; i < endIndex; i++) {
    const config = AGE_PROGRESSION[i];
    console.log(`\n  [${i - startIndex + 1}/${totalToGenerate}] Generating: ${config.filename}`);
    console.log(`  Age ${config.age} — ${config.stage}`);
    console.log(`  Context: ${config.context}`);

    const prompt = buildPrompt(config);

    if (DRY_RUN) {
      console.log('\n  --- PROMPT PREVIEW ---');
      console.log(prompt.slice(0, 300) + '...\n');
      results.push({ filename: config.filename, age: config.age, status: 'dry-run' });
      continue;
    }

    try {
      const filepath = path.join(outputDir, config.filename);
      await generateWithNanoBanana(prompt, referenceDataURI, filepath);
      console.log(`  ✓ Saved: ${config.filename}`);
      results.push({ filename: config.filename, age: config.age, stage: config.stage, status: 'success' });
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      results.push({ filename: config.filename, age: config.age, status: 'failed', error: err.message });
    }

    // Rate limiting
    if (!DRY_RUN && i < endIndex - 1) {
      process.stdout.write('  ⏳ Rate limiting (3s)...');
      await new Promise(r => setTimeout(r, 3000));
      process.stdout.write(' done\n');
    }
  }

  // Report
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successful = results.filter(r => r.status === 'success').length;

  const report = {
    generatedAt: new Date().toISOString(),
    model: 'google/nano-banana-pro',
    referenceImage: REFERENCE_IMAGE,
    duration: `${duration}s`,
    dryRun: DRY_RUN,
    successful,
    total: AGE_PROGRESSION.length,
    estimatedCost: `$${(successful * 0.05).toFixed(2)}`,
    outputDir,
    results,
  };

  const reportPath = path.join(outputDir, 'generation-report.json');
  await fs.writeJSON(reportPath, report, { spaces: 2 });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Generated: ${successful}/${AGE_PROGRESSION.length} images`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Output: ${outputDir}`);
  console.log(`  Report: ${reportPath}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
