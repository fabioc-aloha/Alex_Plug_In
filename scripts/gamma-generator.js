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
const { exec } = require('child_process');

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = 'https://public-api.gamma.app';
const API_VERSION = 'v1.0';
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
    if (this.options.imageModel || this.options.imageStyle || this.options.imageSource) {
      request.imageOptions = {
        source: this.options.imageSource || 'aiGenerated',
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

    // Add additional instructions
    if (this.options.instructions) {
      request.additionalInstructions = this.options.instructions;
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
      case '--image-source':
        options.imageSource = value;
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
      case '--open':
        options.open = true;
        break;
      case '--instructions':
      case '-i':
        options.instructions = value;
        i++;
        break;
      case '--draft':
        options.draft = true;
        break;
      case '--draft-output':
        options.draftOutput = value;
        i++;
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
  --image-source <type>    Image source: aiGenerated, pexels, pictographic, giphy, etc.
  --instructions, -i <text> Additional instructions for the AI (max 2000 chars)
  --dimensions, -d <size>  Card dimensions (16x9, 4x3, 1x1, 4x5, 9x16)
  --export, -e <type>      Export format: pptx, pdf
  --output, -o <dir>       Output directory for exports (default: ./exports)
  --timeout <seconds>      Generation timeout in seconds (default: 180)
  --quiet, -q              Suppress progress messages
  --open                   Open the exported file after generation
  --draft                  Generate markdown content file only (no API call)
  --draft-output <path>    Output path for draft markdown file
  --help, -h               Show this help

Examples:
  # Simple presentation from topic
  node scripts/gamma-generator.js --topic "Introduction to AI"

  # Presentation from file with export
  node scripts/gamma-generator.js --file README.md --export pptx

  # Two-step workflow: Draft → Edit → Generate
  node scripts/gamma-generator.js --topic "AI Ethics" --slides 10 --draft --draft-output ./my-deck.md
  # ... edit my-deck.md ...
  node scripts/gamma-generator.js --file ./my-deck.md --export pptx --open

  # Full customization
  node scripts/gamma-generator.js \\
    --topic "Climate Change Solutions" \\
    --slides 12 \\
    --tone "inspiring and actionable" \\
    --audience "business leaders" \\
    --instructions "Include a call-to-action on the final slide" \\
    --image-model flux-pro \\
    --dimensions 16x9 \\
    --export pptx \\
    --open

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

function openFile(filePath) {
  const platform = process.platform;
  // Normalize path separators for Windows
  const normalizedPath = filePath.replace(/\\/g, '/');

  if (platform === 'win32') {
    // On Windows, spawn with shell: true handles paths better
    const { spawn } = require('child_process');
    spawn('cmd', ['/c', 'start', '', normalizedPath], { shell: true, detached: true, stdio: 'ignore' }).unref();
  } else if (platform === 'darwin') {
    exec(`open "${filePath}"`, (err) => {
      if (err) {
        error(`Failed to open file: ${err.message}`);
      }
    });
  } else {
    exec(`xdg-open "${filePath}"`, (err) => {
      if (err) {
        error(`Failed to open file: ${err.message}`);
      }
    });
  }
}

function generateDraftMarkdown(topic, options) {
  const slides = options.slides || 10;
  const tone = options.tone || 'professional';
  const audience = options.audience || 'general audience';
  const format = options.format || 'presentation';
  const imageStyle = options.imageStyle || 'modern, professional illustrations';
  
  let content = `# ${topic}\n\n`;
  content += `## Target Audience\n${audience}\n\n`;
  content += `## Presentation Overview\nA ${tone} ${format} about "${topic}" for ${audience}.\n\n`;
  content += `---\n\n`;
  
  // Generate topic-aware slide structure
  const slideStructure = getSlideStructure(slides, topic);
  
  for (let i = 0; i < slideStructure.length; i++) {
    const slide = slideStructure[i];
    content += `## Slide ${i + 1}: ${slide.title}\n\n`;
    content += `**${slide.keyPoint}**\n\n`;
    for (const bullet of slide.bullets) {
      content += `- ${bullet}\n`;
    }
    content += `\n*Illustration: ${slide.visual}*\n\n`;
    content += `---\n\n`;
  }
  
  content += `## Visual Style Guidance\n\n`;
  content += `- **Illustration style**: ${imageStyle}\n`;
  content += `- **Tone**: ${tone}\n`;
  content += `- **Audience**: ${audience}\n`;
  content += `- **Tip**: Replace placeholder text with your actual content, keep the structure\n`;
  
  return content;
}

function getSlideStructure(numSlides, topic) {
  // Create a topic-aware presentation structure
  const structures = {
    // Standard presentation arc for various slide counts
    short: [ // 5-7 slides
      { title: `Title`, keyPoint: topic, bullets: ['Subtitle or tagline', 'Your name / organization', 'Date'], visual: 'Bold, attention-grabbing image representing the core theme' },
      { title: 'The Challenge', keyPoint: 'Why this matters now', bullets: ['Current state or problem', 'Impact on the audience', 'Urgency or opportunity'], visual: 'Visual metaphor showing the challenge or tension' },
      { title: 'The Approach', keyPoint: 'How we address this', bullets: ['Key insight or method', 'What makes this different', 'Core principle'], visual: 'Diagram or illustration of the approach' },
      { title: 'Key Benefits', keyPoint: 'What you gain', bullets: ['Benefit 1 with evidence', 'Benefit 2 with evidence', 'Benefit 3 with evidence'], visual: 'Icons or illustrations representing each benefit' },
      { title: 'How It Works', keyPoint: 'The mechanism or process', bullets: ['Step or component 1', 'Step or component 2', 'Step or component 3'], visual: 'Process flow or system diagram' },
      { title: 'Real Results', keyPoint: 'Evidence this works', bullets: ['Example, case study, or data point', 'Quote or testimonial', 'Measurable outcome'], visual: 'Chart, graph, or success story imagery' },
      { title: 'Next Steps', keyPoint: 'Your call to action', bullets: ['Immediate action they can take', 'Resources or support available', 'How to get started'], visual: 'Forward-looking, inspiring image' },
    ],
    medium: [ // 8-12 slides
      { title: `Title`, keyPoint: topic, bullets: ['Subtitle or tagline', 'Your name / organization', 'Date'], visual: 'Bold, attention-grabbing image representing the core theme' },
      { title: 'Why This Matters', keyPoint: 'The context and urgency', bullets: ['Current landscape or trend', 'The problem or opportunity', 'Stakes for the audience'], visual: 'Visual showing the landscape or challenge' },
      { title: 'The Core Problem', keyPoint: 'What needs to change', bullets: ['Specific pain point 1', 'Specific pain point 2', 'Root cause or insight'], visual: 'Illustration of the problem state' },
      { title: 'Our Perspective', keyPoint: 'A new way of thinking', bullets: ['Key insight or reframe', 'What others miss', 'The principle behind our approach'], visual: 'Conceptual illustration of the insight' },
      { title: 'The Solution', keyPoint: 'How we address this', bullets: ['Overview of the approach', 'Key differentiator', 'Why it works'], visual: 'Solution overview diagram' },
      { title: 'Component 1', keyPoint: 'First key element', bullets: ['What it is', 'How it works', 'Why it matters'], visual: 'Detailed illustration of component 1' },
      { title: 'Component 2', keyPoint: 'Second key element', bullets: ['What it is', 'How it works', 'Why it matters'], visual: 'Detailed illustration of component 2' },
      { title: 'Component 3', keyPoint: 'Third key element', bullets: ['What it is', 'How it works', 'Why it matters'], visual: 'Detailed illustration of component 3' },
      { title: 'Evidence & Results', keyPoint: 'Proof this works', bullets: ['Data point or metric', 'Case study or example', 'Testimonial or quote'], visual: 'Charts, graphs, or success imagery' },
      { title: 'Implementation', keyPoint: 'How to make it happen', bullets: ['Getting started steps', 'Resources needed', 'Timeline or milestones'], visual: 'Roadmap or implementation visual' },
      { title: 'Summary', keyPoint: 'Key takeaways', bullets: ['Main point 1', 'Main point 2', 'Main point 3'], visual: 'Synthesis visual bringing themes together' },
      { title: 'Call to Action', keyPoint: 'What to do next', bullets: ['Primary action', 'Secondary action', 'Contact or resources'], visual: 'Inspiring, forward-looking image' },
    ],
    long: [ // 13+ slides
      { title: `Title`, keyPoint: topic, bullets: ['Subtitle or tagline', 'Your name / organization', 'Date'], visual: 'Bold, attention-grabbing image representing the core theme' },
      { title: 'Agenda', keyPoint: 'What we will cover', bullets: ['Section 1 overview', 'Section 2 overview', 'Section 3 overview'], visual: 'Clean agenda or journey visual' },
      { title: 'Context & Background', keyPoint: 'Setting the stage', bullets: ['Historical context', 'Current state', 'Why now'], visual: 'Timeline or landscape illustration' },
      { title: 'The Challenge', keyPoint: 'What we face', bullets: ['Challenge dimension 1', 'Challenge dimension 2', 'Challenge dimension 3'], visual: 'Problem visualization' },
      { title: 'Research & Insights', keyPoint: 'What we learned', bullets: ['Key finding 1', 'Key finding 2', 'Key finding 3'], visual: 'Research or data visualization' },
      { title: 'Framework Overview', keyPoint: 'Our approach', bullets: ['Framework principle 1', 'Framework principle 2', 'Framework principle 3'], visual: 'Framework diagram' },
      { title: 'Deep Dive: Area 1', keyPoint: 'First focus area', bullets: ['Detail 1', 'Detail 2', 'Detail 3'], visual: 'Detailed illustration for area 1' },
      { title: 'Deep Dive: Area 2', keyPoint: 'Second focus area', bullets: ['Detail 1', 'Detail 2', 'Detail 3'], visual: 'Detailed illustration for area 2' },
      { title: 'Deep Dive: Area 3', keyPoint: 'Third focus area', bullets: ['Detail 1', 'Detail 2', 'Detail 3'], visual: 'Detailed illustration for area 3' },
      { title: 'Integration', keyPoint: 'How it all connects', bullets: ['Connection point 1', 'Connection point 2', 'Synergies'], visual: 'Integration or synthesis diagram' },
      { title: 'Case Study', keyPoint: 'Real-world application', bullets: ['Context', 'Approach', 'Results'], visual: 'Case study imagery' },
      { title: 'Lessons Learned', keyPoint: 'What we discovered', bullets: ['Lesson 1', 'Lesson 2', 'Lesson 3'], visual: 'Insights visualization' },
      { title: 'Recommendations', keyPoint: 'What we suggest', bullets: ['Recommendation 1', 'Recommendation 2', 'Recommendation 3'], visual: 'Recommendation icons or pathway' },
      { title: 'Implementation Roadmap', keyPoint: 'How to proceed', bullets: ['Phase 1', 'Phase 2', 'Phase 3'], visual: 'Roadmap or timeline visual' },
      { title: 'Summary & Key Takeaways', keyPoint: 'Remember these', bullets: ['Takeaway 1', 'Takeaway 2', 'Takeaway 3'], visual: 'Summary visual' },
      { title: 'Questions & Discussion', keyPoint: 'Let\'s explore together', bullets: ['Contact information', 'Resources', 'Next meeting'], visual: 'Collaborative or discussion imagery' },
    ]
  };
  
  let template;
  if (numSlides <= 7) {
    template = structures.short;
  } else if (numSlides <= 12) {
    template = structures.medium;
  } else {
    template = structures.long;
  }
  
  // Adjust to exact slide count
  if (numSlides < template.length) {
    return template.slice(0, numSlides);
  } else if (numSlides > template.length) {
    // Add extra content slides
    const extra = numSlides - template.length;
    const result = [...template];
    for (let i = 0; i < extra; i++) {
      result.splice(-1, 0, {
        title: `Additional Point ${i + 1}`,
        keyPoint: 'Supporting content',
        bullets: ['Detail or example', 'Evidence or data', 'Implication or insight'],
        visual: 'Relevant illustration for this point'
      });
    }
    return result;
  }
  return template;
}

async function main() {
  const options = parseArgs();

  if (!options.topic && !options.file) {
    error('Either --topic or --file is required');
    printHelp();
    process.exit(1);
  }

  // Draft mode: Generate markdown template without calling Gamma API
  if (options.draft && options.topic) {
    const draftContent = generateDraftMarkdown(options.topic, options);
    const outputPath = options.draftOutput || path.join(options.outputDir || './exports', `${options.topic.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-draft.md`);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, draftContent, 'utf-8');
    
    console.log('\n' + '='.repeat(60));
    console.log('📝 DRAFT CREATED');
    console.log('='.repeat(60));
    console.log(`File: ${outputPath}`);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Edit the markdown file with your content');
    console.log('  2. Run: node scripts/gamma-generator.js --file "' + outputPath + '" --export pptx --open');
    console.log('='.repeat(60) + '\n');
    
    if (options.open) {
      openFile(outputPath);
    }
    
    process.exit(0);
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

  // Open the exported file if --open flag is set
  if (result.success && options.open && result.localFile) {
    log('Opening file...', options.verbose !== false);
    openFile(result.localFile);
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
