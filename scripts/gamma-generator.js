/**
 * Gamma Presentation Generator
 *
 * A robust Node.js script for generating presentations, documents,
 * and social content using the Gamma API.
 *
 * Usage:
 *   node scripts/gamma-generator.js --topic "Your topic here"
 *   node scripts/gamma-generator.js --file path/to/content.md
 *   node scripts/gamma-generator.js --topic "AI Ethics" --format document --slides 15
 *
 * Environment:
 *   GAMMA_API_KEY - Required API key from gamma.app/settings
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = 'https://public-api.gamma.app';
const API_VERSION = 'v0.2';
const DEFAULT_TIMEOUT_MS = 180000; // 3 minutes
const POLL_INTERVAL_MS = 3000; // 3 seconds
const MAX_INPUT_CHARS = 400000;

const IMAGE_MODELS = {
  // Cost-effective (2 credits)
  'flux-quick': 'flux-1-quick',
  'flux-kontext': 'flux-kontext-fast',
  'imagen-flash': 'imagen-3-flash',
  'luma-flash': 'luma-photon-flash-1',
  // Standard (8-15 credits)
  'flux-pro': 'flux-1-pro',
  'imagen-pro': 'imagen-3-pro',
  'ideogram-turbo': 'ideogram-v3-turbo',
  'leonardo': 'leonardo-phoenix',
  // Premium (20-33 credits)
  'ideogram': 'ideogram-v3',
  'imagen4': 'imagen-4-pro',
  'gemini': 'gemini-2.5-flash-image',
  'recraft': 'recraft-v3',
  'gpt-image': 'gpt-image-1-medium',
  'dalle3': 'dall-e-3',
  // Ultra (30-120 credits)
  'flux-ultra': 'flux-1-ultra',
  'imagen4-ultra': 'imagen-4-ultra',
  'recraft-svg': 'recraft-v3-svg',
  'gpt-image-hd': 'gpt-image-1-high',
};

// ============================================================================
// Utility Functions
// ============================================================================

function log(message, verbose = true) {
  if (verbose) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

function error(message) {
  console.error(`[ERROR] ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getApiKey() {
  const apiKey = process.env.GAMMA_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GAMMA_API_KEY environment variable is required.\n' +
        'Get your API key from: https://gamma.app/settings\n' +
        'Set it with: $env:GAMMA_API_KEY = "sk-gamma-xxx"'
    );
  }
  return apiKey;
}

// ============================================================================
// HTTP Client
// ============================================================================

function httpRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey();
    const url = new URL(`${API_BASE_URL}/${API_VERSION}${endpoint}`);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method,
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(parsed.message || `HTTP ${res.statusCode}: ${data}`));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            file.close();
            fs.unlinkSync(outputPath);
            downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete partial file
        reject(err);
      });
  });
}

// ============================================================================
// Gamma Client Class
// ============================================================================

class GammaClient {
  constructor(verbose = true) {
    this.verbose = verbose;
  }

  async generate(request) {
    log('Starting generation...', this.verbose);

    if (request.inputText.length > MAX_INPUT_CHARS) {
      throw new Error(
        `Input text exceeds maximum length of ${MAX_INPUT_CHARS} characters. ` +
          `Current length: ${request.inputText.length}. Use textMode: "condense" for long content.`
      );
    }

    const response = await httpRequest('POST', '/generations', request);

    log(`Generation started: ${response.generationId}`, this.verbose);
    if (response.warnings) {
      log(`⚠️ Warnings: ${response.warnings}`, this.verbose);
    }

    return response;
  }

  async getStatus(generationId) {
    return httpRequest('GET', `/generations/${generationId}`);
  }

  async waitForCompletion(generationId, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const startTime = Date.now();
    let lastStatus = '';
    let dots = 0;

    while (Date.now() - startTime < timeoutMs) {
      const status = await this.getStatus(generationId);

      if (status.status !== lastStatus) {
        if (lastStatus) process.stdout.write('\n');
        log(`Status: ${status.status}`, this.verbose);
        lastStatus = status.status;
        dots = 0;
      } else if (this.verbose) {
        process.stdout.write('.');
        dots++;
        if (dots % 20 === 0) process.stdout.write('\n');
      }

      if (status.status === 'completed') {
        if (dots > 0) process.stdout.write('\n');
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(`Generation failed: ${status.error || 'Unknown error'}`);
      }

      await sleep(POLL_INTERVAL_MS);
    }

    throw new Error(`Generation timeout after ${timeoutMs / 1000} seconds`);
  }

  async downloadExport(exportUrl, outputDir, filename = null) {
    // Extract filename from URL if not provided
    if (!filename) {
      const urlParts = exportUrl.split('/');
      filename = decodeURIComponent(urlParts[urlParts.length - 1]) || 'export.pptx';
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    log(`Downloading to: ${outputPath}`, this.verbose);

    await downloadFile(exportUrl, outputPath);

    const stats = fs.statSync(outputPath);
    log(`✅ Downloaded: ${(stats.size / 1024 / 1024).toFixed(2)} MB`, this.verbose);

    return outputPath;
  }
}

// ============================================================================
// Generator Class
// ============================================================================

class GammaGenerator {
  constructor(options = {}) {
    this.options = {
      format: 'presentation',
      slides: 10,
      timeout: DEFAULT_TIMEOUT_MS,
      verbose: true,
      outputDir: './exports',
      ...options,
    };
    this.client = new GammaClient(this.options.verbose);
  }

  async fromTopic(topic) {
    return this.generate(topic);
  }

  async fromFile(filePath) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    log(`Read ${content.length} characters from ${filePath}`, this.options.verbose);

    // Use condense mode for long content
    const textMode = content.length > 10000 ? 'condense' : 'generate';
    return this.generate(content, textMode);
  }

  async generate(inputText, textMode = 'generate') {
    const request = {
      inputText,
      textMode,
      format: this.options.format,
      numCards: this.options.slides,
    };

    // Add text options
    if (this.options.tone || this.options.audience || this.options.language) {
      request.textOptions = {
        amount: 'medium',
        tone: this.options.tone,
        audience: this.options.audience,
        language: this.options.language,
      };
    }

    // Add image options
    if (this.options.imageModel || this.options.imageStyle) {
      request.imageOptions = {
        source: 'aiGenerated',
        model: IMAGE_MODELS[this.options.imageModel] || this.options.imageModel,
        style: this.options.imageStyle,
      };
    }

    // Add card options
    if (this.options.dimensions) {
      request.cardOptions = {
        dimensions: this.options.dimensions,
      };
    }

    // Add export option
    if (this.options.export) {
      request.exportAs = this.options.export;
    }

    try {
      // Start generation
      const genResponse = await this.client.generate(request);

      // Wait for completion
      const status = await this.client.waitForCompletion(
        genResponse.generationId,
        this.options.timeout
      );

      const result = {
        success: true,
        generationId: genResponse.generationId,
        gammaUrl: status.gammaUrl,
        exportUrl: status.exportUrl || status.pptxUrl || status.pdfUrl,
        credits: status.credits,
      };

      // Download export if available and output directory specified
      if (result.exportUrl && this.options.outputDir) {
        result.localFile = await this.client.downloadExport(
          result.exportUrl,
          this.options.outputDir
        );
      }

      this.printSummary(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || String(err);
      error(errorMessage);
      return {
        success: false,
        generationId: '',
        error: errorMessage,
      };
    }
  }

  printSummary(result) {
    console.log('\n' + '='.repeat(60));
    console.log('✅ GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Generation ID: ${result.generationId}`);
    if (result.gammaUrl) {
      console.log(`Gamma URL:     ${result.gammaUrl}`);
    }
    if (result.localFile) {
      console.log(`Local File:    ${result.localFile}`);
    }
    if (result.credits) {
      console.log(`Credits Used:  ${result.credits.deducted || 'N/A'}`);
      console.log(`Credits Left:  ${result.credits.remaining || 'N/A'}`);
    }
    console.log('='.repeat(60) + '\n');
  }
}

// ============================================================================
// CLI Interface
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = args[i + 1];

    switch (arg) {
      case '--topic':
      case '-t':
        options.topic = value;
        i++;
        break;
      case '--file':
      case '-f':
        options.file = value;
        i++;
        break;
      case '--format':
        options.format = value;
        i++;
        break;
      case '--slides':
      case '-n':
        options.slides = parseInt(value, 10);
        i++;
        break;
      case '--tone':
        options.tone = value;
        i++;
        break;
      case '--audience':
        options.audience = value;
        i++;
        break;
      case '--language':
      case '-l':
        options.language = value;
        i++;
        break;
      case '--image-model':
        options.imageModel = value;
        i++;
        break;
      case '--image-style':
        options.imageStyle = value;
        i++;
        break;
      case '--dimensions':
      case '-d':
        options.dimensions = value;
        i++;
        break;
      case '--export':
      case '-e':
        options.export = value;
        i++;
        break;
      case '--output':
      case '-o':
        options.outputDir = value;
        i++;
        break;
      case '--timeout':
        options.timeout = parseInt(value, 10) * 1000;
        i++;
        break;
      case '--quiet':
      case '-q':
        options.verbose = false;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Gamma Presentation Generator
============================

Usage:
  node scripts/gamma-generator.js [options]

Options:
  --topic, -t <text>       Topic or content to generate from
  --file, -f <path>        Path to file with content
  --format <type>          Output format: presentation, document, social, webpage
  --slides, -n <number>    Number of slides/cards (1-75)
  --tone <text>            Tone description (e.g., "professional", "casual")
  --audience <text>        Target audience (e.g., "executives", "developers")
  --language, -l <code>    Language code (e.g., "en", "es", "pt")
  --image-model <name>     AI image model (flux-quick, flux-pro, dalle3, etc.)
  --image-style <text>     Image style description
  --dimensions, -d <size>  Card dimensions (16x9, 4x3, 1x1, 4x5, 9x16)
  --export, -e <type>      Export format: pptx, pdf
  --output, -o <dir>       Output directory for exports (default: ./exports)
  --timeout <seconds>      Generation timeout in seconds (default: 180)
  --quiet, -q              Suppress progress messages
  --help, -h               Show this help

Examples:
  # Simple presentation from topic
  node scripts/gamma-generator.js --topic "Introduction to AI"

  # Presentation from file with export
  node scripts/gamma-generator.js --file README.md --export pptx

  # Full customization
  node scripts/gamma-generator.js \\
    --topic "Climate Change Solutions" \\
    --slides 12 \\
    --tone "inspiring and actionable" \\
    --audience "business leaders" \\
    --image-model flux-pro \\
    --dimensions 16x9 \\
    --export pptx

Image Models:
  Cost-effective (2 credits): flux-quick, flux-kontext, imagen-flash, luma-flash
  Standard (8-15 credits):    flux-pro, imagen-pro, ideogram-turbo, leonardo
  Premium (20-33 credits):    ideogram, imagen4, gemini, recraft, gpt-image, dalle3
  Ultra (30-120 credits):     flux-ultra, imagen4-ultra, recraft-svg, gpt-image-hd

Environment:
  GAMMA_API_KEY            Required. Get from https://gamma.app/settings
`);
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
  const options = parseArgs();

  if (!options.topic && !options.file) {
    error('Either --topic or --file is required');
    printHelp();
    process.exit(1);
  }

  const generator = new GammaGenerator(options);

  let result;

  if (options.file) {
    result = await generator.fromFile(options.file);
  } else if (options.topic) {
    result = await generator.fromTopic(options.topic);
  } else {
    error('No input provided');
    process.exit(1);
  }

  process.exit(result.success ? 0 : 1);
}

// Export for use as module
module.exports = { GammaGenerator, GammaClient, IMAGE_MODELS };

// Run if executed directly
if (require.main === module) {
  main().catch((err) => {
    error(err.message);
    process.exit(1);
  });
}
