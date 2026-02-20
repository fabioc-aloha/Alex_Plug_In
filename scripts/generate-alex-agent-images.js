/**
 * Alex Agent Mode & Cognitive State Image Generator
 * 
 * Generates two complementary image series for the Alex Cognitive Architecture:
 * 
 * Series A — AGENT MODE BANNERS (nano-banana-pro, 1024x1024, reference-based)
 *   One image per VS Code specialized agent showing Alex in that mode.
 *   Note: Default Alex mode uses persona images instead of a banner.
 *   Output: alex_docs/alex3/agents/
 *
 * Series B — COGNITIVE STATE PORTRAITS (nano-banana-pro, 1024x1024, reference-based)
 *   Alex "Mini" Finch (age 21) in task-specific cognitive states.
 *   Uses reference image for face consistency (same as personas).
 *   Output: alex_docs/alex3/states/
 *
 * Total: 14 images | Cost estimate: $0.35 (~$0.025/image)
 *
 * Usage:
 *   $env:REPLICATE_API_TOKEN = "r8_..."
 *   node scripts/generate-alex-agent-images.js [--series=a|b|all] [--dry-run]
 *
 * Options:
 *   --series=a    Generate only agent mode banners
 *   --series=b    Generate only cognitive state portraits
 *   --series=all  Generate both series (default)
 *   --dry-run     Show prompts without calling API
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
const SERIES_ARG = (args.find(a => a.startsWith('--series=')) || '--series=all').split('=')[1];
const ONLY_ARG = args.find(a => a.startsWith('--only='));
const ONLY_FILTER = ONLY_ARG ? ONLY_ARG.split('=')[1].split(',').map(s => s.trim().toUpperCase()) : null;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Reference images
const REFERENCE_IMAGE = path.join(ROOT, 'alex_docs', 'alex3', 'alex-reference.png');
const LOGO_IMAGE = path.join(ROOT, 'platforms', 'vscode-extension', 'assets', 'logo.png');
const REFERENCE_AGE = 15;
const OPERATIONAL_AGE = 21;

// ─────────────────────────────────────────────────────────────────────────────
// SERIES A — AGENT MODE BANNERS
// Alex in specialized agent mode contexts — each visually distinct
// Model: google/nano-banana-pro ($0.025/image) with reference image
// ─────────────────────────────────────────────────────────────────────────────

const AGENT_MODES = [
  // Note: Default "Alex" orchestrator mode uses persona images instead of a banner
  {
    filename: 'AGENT-RESEARCHER.png',
    title: 'RESEARCHER',
    color: '#7c3aed',           // Deep purple — intellectual depth
    scene: 'Deep research and exploration before building anything',
    pose: 'leaning forward with curiosity, eyes scanning multiple sources, one hand on chin thinking',
    environment: 'workspace surrounded by open books, research papers, multiple browser tabs on screen showing documentation and API references, sticky notes with connections drawn between concepts',
    attire: 'gray hoodie, comfortable research mode, glasses pushed up on forehead',
    mood: 'curious, exploratory, gathering knowledge, the detective finding patterns',
    lighting: 'warm desk lamp mixed with cool monitor glow, purple ambient accent',
  },
  {
    filename: 'AGENT-BUILDER.png',
    title: 'BUILDER',
    color: '#16a34a',           // Forest green — construction, growth
    scene: 'Actively implementing code with confidence and momentum',
    pose: 'hands on keyboard typing rapidly, slight forward lean, focused but relaxed smile of flow state',
    environment: 'clean developer setup, large monitor showing code actively being written, terminal with successful build output, green checkmarks visible',
    attire: 'gray hoodie sleeves pushed up ready for work, comfortable and productive',
    mood: 'confident, optimistic, building something great, creative momentum',
    lighting: 'bright focused workspace light, green accent glow from successful builds on screen',
  },
  {
    filename: 'AGENT-VALIDATOR.png',
    title: 'VALIDATOR',
    color: '#dc2626',           // Alert red — adversarial, critical  
    scene: 'Adversarial quality assurance — finding bugs before users do',
    pose: 'leaning back slightly with arms crossed, one eyebrow raised skeptically, scrutinizing expression',
    environment: 'screen showing code with red error highlights and failing tests, checklist with items being crossed off, bug tracking interface visible',
    attire: 'gray hoodie, serious posture, reading glasses on',
    mood: 'skeptical, critical, adversarial but fair, the quality guardian who misses nothing',
    lighting: 'cool analytical light, red warning glow from error messages on screen',
  },
  {
    filename: 'AGENT-DOCUMENTARIAN.png',
    title: 'DOCUMENTARIAN',
    color: '#14b8a6',           // Electric teal — clarity, precision
    scene: 'Creating clear documentation that will help future developers',
    pose: 'thoughtfully composing text, occasionally looking up to structure thoughts, organized and methodical',
    environment: 'clean workspace with markdown files open, architecture diagrams on secondary screen, well-organized folder structure visible, API documentation being written',
    attire: 'gray hoodie, neat and organized appearance matching the work',
    mood: 'precise, helpful, creating clarity from complexity, the knowledge architect',
    lighting: 'bright even light for clear thinking, teal accent from documentation previews',
  },
  {
    filename: 'AGENT-AZURE.png',
    title: 'AZURE',
    color: '#0ea5e9',           // Sky blue — Microsoft cloud
    scene: 'Architecting cloud infrastructure and deployments on Azure',
    pose: 'gesturing at cloud architecture diagram, confident cloud architect stance, explaining or planning',
    environment: 'screens showing Azure portal with resource groups, Bicep/ARM templates, deployment pipelines, cloud architecture diagram with connected services',
    attire: 'gray hoodie with subtle Microsoft/Azure vibe, professional but comfortable',
    mood: 'authoritative, cloud-native thinking, infrastructure mastery, the cloud architect',
    lighting: 'cool blue Azure-branded lighting, professional tech environment',
  },
  {
    filename: 'AGENT-M365.png',
    title: 'M365',
    color: '#2563eb',           // Microsoft blue — M365 ecosystem
    scene: 'Building Microsoft 365 integrations and Teams experiences',
    pose: 'working on collaborative tools, engaged with Teams/M365 interfaces, building integrations',
    environment: 'screens showing Microsoft Teams app development, Graph API explorer, Copilot extensibility, adaptive cards being designed',
    attire: 'gray hoodie, Microsoft ecosystem developer vibe',
    mood: 'collaborative, integration-focused, extending the Microsoft platform, the M365 specialist',
    lighting: 'Microsoft blue accent lighting, modern collaborative workspace feel',
  },
];

function buildAgentModePrompt(agent) {
  const traits = ALEX_CHARACTER.physicalTraits.join(', ');
  const ageDelta = OPERATIONAL_AGE - REFERENCE_AGE;
  return `
TWO REFERENCE IMAGES PROVIDED:
1. FIRST IMAGE: Alex at age ${REFERENCE_AGE} — use for face/identity
2. SECOND IMAGE: Blue rocket logo — incorporate naturally into scene

IDENTITY PRESERVATION (HIGHEST PRIORITY):
- Generate THIS SAME PERSON at age ${OPERATIONAL_AGE} (${ageDelta} years older than reference)
- Preserve: exact facial bone structure, nose shape, eye shape, lip shape
- Preserve: ${traits}
- Must be immediately recognizable as the reference person

AGENT MODE — "${agent.title}":
- Activity: ${agent.scene}
- Pose: ${agent.pose}
- Environment: ${agent.environment}
- Attire: ${agent.attire}
- Mood: ${agent.mood}
- Color accent: ${agent.color} in lighting or environment

LOGO PLACEMENT (PROMINENT & MEMORABLE):
- The blue rocket logo MUST be prominently visible in the scene
- PRIMARY placement: on Alex's clothing (hoodie, t-shirt print, jacket patch)
- SECONDARY placement: flag or banner in background, large wall poster, prominent desk item
- Make the logo a memorable part of the scene, not hidden
- Logo should be crisp, clear, and unmistakable

COMPOSITION:
- Cinematic portrait capturing Alex fully in ${agent.title} mode
- Face clearly visible, expression matching the mood
- Rich environmental details that tell the story of what this agent does
- NO TEXT OR TYPOGRAPHY — let the scene speak
- Format: Square 1:1 (1024x1024)
- Style: Photorealistic, cinematic quality, shallow depth of field
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIES B — COGNITIVE STATE PORTRAITS
// Character: Alex "Mini" Finch, 21 years old, consistent appearance
// Model: google/nano-banana-pro ($0.025/image) with reference image
// ─────────────────────────────────────────────────────────────────────────────

// Immutable character definition — applied to EVERY portrait for visual consistency
// Reference: Alex at age 15 (attached image) — ginger curls, blue-green eyes, freckles
const ALEX_CHARACTER = {
  age: '21 years old',
  physicalTraits: [
    'curly ginger copper-red hair, tousled and slightly messy',
    'striking blue-green eyes, intelligent and curious',
    'fair skin with light freckles across nose and cheeks',
    'slim build, 5\'9"',
    'youthful face, natural relaxed expression',
  ],
  baseAttire: 'gray hoodie over plaid flannel shirt',
  personality: 'curious, brilliant, humble, warm, playful',
};

const COGNITIVE_STATES = [
  {
    filename: 'STATE-MEDITATION.png',
    title: 'Meditation',
    subtitle: 'Knowledge Consolidation',
    scenario: 'Deep meditation session, consolidating knowledge and strengthening synaptic connections',
    attire: 'gray hoodie with flannel peeking at collar, relaxed and comfortable',
    pose: 'seated cross-legged, eyes gently closed, hands resting on knees, slight smile, completely at peace',
    environment: 'minimalist dark room, floating translucent geometric shapes and glowing node-connection diagrams in the air around, soft ambient blue light from below',
    lighting: 'soft volumetric blue ambient light, gentle glow from floating knowledge nodes',
    mood: 'serene, deeply focused, inner calm, the mind at work organizing itself',
  },
  {
    filename: 'STATE-DEBUGGING.png',
    title: 'Debugging',
    subtitle: 'Root Cause Analysis',
    scenario: 'Intense debugging session, hunting an elusive bug with methodical focus',
    attire: 'gray hoodie over plaid flannel, slightly leaning forward',
    pose: 'leaning forward at desk, focused on screen, eyes intense and narrowed studying code intently',
    environment: 'dimly lit developer workspace, three monitors showing code with highlighted error lines in red, coffee cup to one side, dark background',
    lighting: 'cool blue-white monitor glow illuminating face from front, dramatic contrast with dark background',
    mood: 'sharp focus, analytical, puzzle-solving intensity, slight frustration transforming to determination',
  },
  {
    filename: 'STATE-DISCOVERY.png',
    title: 'Discovery',
    subtitle: 'The Eureka Moment',
    scenario: 'Eureka moment — pattern suddenly becomes clear, breakthrough insight just landed',
    attire: 'gray hoodie slightly unzipped showing flannel, energized posture',
    pose: 'sitting upright suddenly, eyes wide open with excitement, one hand pointing at screen, genuine smile breaking through, leaning slightly forward',
    environment: 'glowing monitor with visualization, scattered notes and diagrams, warm amber desk lamp, energy in the air',
    lighting: 'warm amber desk lamp, bright monitor glow, face lit with discovery energy',
    mood: 'electric excitement, genuine delight, the joy of understanding, eureka energy',
  },
  {
    filename: 'STATE-PLANNING.png',
    title: 'Planning',
    subtitle: 'Strategic Architecture',
    scenario: 'Strategic planning session, mapping out a complex system architecture',
    attire: 'gray hoodie with flannel collar visible, professional posture',
    pose: 'standing at whiteboard or large glass surface, marker in hand, gesturing at diagrams, weight on one foot, head slightly tilted in thought',
    environment: 'collaborative workspace with large whiteboard covered in flowcharts, boxes, arrows, node diagrams — the architecture taking shape',
    lighting: 'bright even workspace lighting, clean and clear, professional setting',
    mood: 'thoughtful, systematic, creative problem-solving, the architect at work',
  },
  {
    filename: 'STATE-TEACHING.png',
    title: 'Teaching',
    subtitle: 'Knowledge Transfer',
    scenario: 'Teaching and mentoring session — explaining a complex concept with clarity and warmth',
    attire: 'gray hoodie over flannel, open and welcoming posture',
    pose: 'leaning forward slightly, both hands gesturing expressively to illustrate a concept, warm open smile, eye contact forward (at camera/learner)',
    environment: 'bright friendly space with screens showing diagrams behind, warm inviting atmosphere',
    lighting: 'warm natural-ish lighting, bright and approachable, face fully lit',
    mood: 'warm, engaging, patient, the mentor who makes hard things feel accessible and exciting',
  },
  {
    filename: 'STATE-BUILDING.png',
    title: 'Building',
    subtitle: 'In The Flow State',
    scenario: 'Deep flow state — hands flying across the keyboard implementing something beautiful',
    attire: 'gray hoodie sleeves pushed up showing flannel cuffs, fully absorbed',
    pose: 'both hands on keyboard, slight forward lean, relaxed yet focused, slight smile of creative flow, eyes scanning between code and thought',
    environment: 'clean developer setup, single large monitor with code, dark theme IDE, minimal distractions, excellent ergonomics',
    lighting: 'dark room with single monitor glow, focused and immersive, the only light is the work',
    mood: 'deep flow, creative confidence, momentum, the builder in their element',
  },
  {
    filename: 'STATE-REVIEWING.png',
    title: 'Code Review',
    subtitle: 'Adversarial Quality Check',
    scenario: 'Thorough code review — reading critically, annotating, finding the edge cases',
    attire: 'gray hoodie with flannel visible at neck, focused and critical posture',
    pose: 'leaning back slightly in chair, chin resting on one hand in classic thinking pose, eyes narrowed analytically at code on screen',
    environment: 'clean workspace, screen showing PR diff with highlighted sections, thoughtful marks and annotations visible',
    lighting: 'cool focused light from monitor and desk lamp, analytical and clear',
    mood: 'critical and careful, skeptical but fair, the reviewer who misses nothing',
  },
  {
    filename: 'STATE-LEARNING.png',
    title: 'Learning',
    subtitle: 'Bootstrap Knowledge Acquisition',
    scenario: 'Deep learning absorption — reading, connecting dots, building mental models',
    attire: 'cozy gray hoodie over flannel, comfortably settled in for a long session',
    pose: 'comfortably settled in chair, book or tablet in one hand, other hand taking notes, occasionally looking up to connect ideas, expression of engaged curiosity',
    environment: 'cozy reading nook or comfortable desk, books and references nearby, warm light, a few open browser tabs on a secondary screen',
    lighting: 'warm reading lamp, cozy and focused, inviting atmosphere for deep absorption',
    mood: 'curious, open, absorbing everything, the learner in their natural habitat',
  },
  {
    filename: 'STATE-DREAM.png',
    title: 'Dream',
    subtitle: 'Neural Maintenance',
    scenario: 'Deep dream state — unconscious processing, neural maintenance, background consolidation while asleep',
    attire: 'gray hoodie with flannel peeking through, head tilted to rest on folded arms',
    pose: 'head resting on folded arms at desk, eyes closed, peaceful sleeping expression, gentle breathing, completely at rest',
    environment: 'dimly lit workspace at night, monitors in power-save mode with faint glow, soft translucent neural network patterns floating dreamlike above, scattered notes from the day\'s work, moonlight through window',
    lighting: 'very soft moonlight ambient, faint monitor standby glow, ethereal dreamlike quality with floating connections above',
    mood: 'peaceful unconscious processing, the mind working while resting, neural pathways strengthening in sleep',
  },
];

function buildPortraitPrompt(state) {
  const traits = ALEX_CHARACTER.physicalTraits.join(', ');
  const ageDelta = OPERATIONAL_AGE - REFERENCE_AGE;
  return `
TWO REFERENCE IMAGES PROVIDED:
1. FIRST IMAGE: Alex at age ${REFERENCE_AGE} — use for face/identity
2. SECOND IMAGE: Blue rocket logo — add as small clothing patch

IDENTITY PRESERVATION (HIGHEST PRIORITY):
- Generate THIS SAME PERSON at age ${OPERATIONAL_AGE} (${ageDelta} years older than reference)
- Preserve: exact facial bone structure, nose shape, eye shape, lip shape
- Preserve: ${traits}
- Must be immediately recognizable as the reference person

LOGO PLACEMENT (SUBTLE):
- Add the blue rocket logo as a small stitched patch on the hoodie or shirt
- One patch only, subtle and natural-looking
- Like a favorite brand patch on clothing

COGNITIVE STATE — "${state.title}":
- Activity: ${state.scenario}
- Attire: ${state.attire}
- Pose: ${state.pose}
- Setting: ${state.environment}
- Lighting: ${state.lighting}
- Mood: ${state.mood}

COMPOSITION:
- Face clearly visible, showing the internal cognitive experience
- NO TEXT OR TYPOGRAPHY in the image
- Format: Square 1:1 (1024x1024)
- Style: Photorealistic portrait, cinematic quality, shallow depth of field
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

async function generateIdeogram(prompt, filename) {
  if (DRY_RUN) {
    console.log(`   [DRY-RUN] Would call ideogram-ai/ideogram-v2`);
    return null;
  }
  const output = await replicate.run('ideogram-ai/ideogram-v2', {
    input: {
      prompt,
      aspect_ratio: '1:1',
      magic_prompt_option: 'On',
      style_type: 'Realistic',
      resolution: '1024x1024',
      output_format: 'png',
    },
  });

  let url;
  if (output && typeof output.url === 'function') url = output.url().toString();
  else if (Array.isArray(output)) url = output[0];
  else if (typeof output === 'string') url = output;
  else if (output?.url) url = output.url;
  if (typeof url === 'object' && url?.href) url = url.href;

  if (!url) throw new Error(`No URL in Ideogram response: ${JSON.stringify(output)}`);
  return url;
}

// Encode reference image for nano-banana-pro
async function encodeImageToDataURI(imagePath) {
  const buffer = await fs.readFile(imagePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${base64}`;
}

// Global reference data URIs (loaded once in main)
let referenceDataURI = null;
let logoDataURI = null;

async function generateNanaBanana(prompt, filename, outputPath, imageInputs = null) {
  if (DRY_RUN) {
    console.log(`   [DRY-RUN] Would call google/nano-banana-pro`);
    return null;
  }

  const images = imageInputs || [referenceDataURI];
  const output = await replicate.run('google/nano-banana-pro', {
    input: {
      prompt: prompt,
      image_input: images,
      aspect_ratio: '1:1',
      output_format: 'png',
      safety_filter_level: 'block_only_high',
    },
  });

  // Modern Replicate API: output is a FileObject, write directly
  const { writeFile } = await import('fs/promises');
  await writeFile(outputPath, output);
  
  return outputPath;
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(filepath, () => {});
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generate(item, buildPromptFn, modelFn, outputDir, costPerImage) {
  console.log(`\n  Generating: ${item.filename}`);
  console.log(`  Title: "${item.title}" — ${item.description || item.scenario?.slice(0, 60) + '...'}`);

  const prompt = buildPromptFn(item);

  if (DRY_RUN) {
    console.log('\n  --- PROMPT PREVIEW ---');
    console.log(prompt.slice(0, 400) + '...\n');
    return { filename: item.filename, status: 'dry-run', cost: 0 };
  }

  try {
    const url = await modelFn(prompt, item.filename);
    const filepath = path.join(outputDir, item.filename);
    await downloadImage(url, filepath);
    console.log(`  ✓ Saved: ${path.basename(filepath)}`);
    return { filename: item.filename, title: item.title, url, cost: costPerImage, status: 'success' };
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return { filename: item.filename, status: 'failed', error: err.message };
  }
}

// Generate with reference image (nano-banana-pro writes directly to file)
async function generateWithReference(item, buildPromptFn, outputDir, costPerImage, imageInputs = null) {
  console.log(`\n  Generating: ${item.filename}`);
  const desc = item.scenario || item.scene || item.description || '';
  console.log(`  Title: "${item.title}" — ${desc.slice(0, 60)}${desc.length > 60 ? '...' : ''}`);

  const prompt = buildPromptFn(item);

  if (DRY_RUN) {
    console.log('\n  --- PROMPT PREVIEW ---');
    console.log(prompt.slice(0, 400) + '...\n');
    return { filename: item.filename, status: 'dry-run', cost: 0 };
  }

  try {
    const filepath = path.join(outputDir, item.filename);
    await generateNanaBanana(prompt, item.filename, filepath, imageInputs);
    console.log(`  ✓ Saved: ${path.basename(filepath)}`);
    return { filename: item.filename, title: item.title, cost: costPerImage, status: 'success' };
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return { filename: item.filename, status: 'failed', error: err.message };
  }
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

  const runA = SERIES_ARG === 'all' || SERIES_ARG === 'a';
  const runB = SERIES_ARG === 'all' || SERIES_ARG === 'b';

  const agentCount = runA ? AGENT_MODES.length : 0;
  const stateCount = runB ? COGNITIVE_STATES.length : 0;
  const costPerImage = 0.025;
  const totalCost = (agentCount + stateCount) * costPerImage;

  const outBase = path.join(ROOT, 'alex_docs', 'alex3');
  const outAgents = path.join(outBase, 'agents');
  const outStates = path.join(outBase, 'states');

  await fs.ensureDir(outAgents);
  await fs.ensureDir(outStates);

  // Load reference images for nano-banana-pro
  if ((runA || runB) && !DRY_RUN) {
    if (!await fs.pathExists(REFERENCE_IMAGE)) {
      console.error(`ERROR: Reference image not found: ${REFERENCE_IMAGE}`);
      process.exit(1);
    }
    referenceDataURI = await encodeImageToDataURI(REFERENCE_IMAGE);
    console.log(`📷 Reference image loaded (${Math.round(referenceDataURI.length / 1024)} KB)`);
    
    // Load logo for both series
    if (!await fs.pathExists(LOGO_IMAGE)) {
      console.error(`ERROR: Logo image not found: ${LOGO_IMAGE}`);
      process.exit(1);
    }
    logoDataURI = await encodeImageToDataURI(LOGO_IMAGE);
    console.log(`🚀 Logo image loaded (${Math.round(logoDataURI.length / 1024)} KB)`);
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Alex Agent Mode & Cognitive State Image Generator');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Series A (agent banners): ${agentCount} images × $${costPerImage} = $${(agentCount * costPerImage).toFixed(2)}`);
  console.log(`  Series B (state portraits): ${stateCount} images × $${costPerImage} = $${(stateCount * costPerImage).toFixed(2)}`);
  console.log(`  Total estimated cost:  $${totalCost.toFixed(2)}`);
  console.log(`  Dry-run mode:  ${DRY_RUN}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];
  const startTime = Date.now();

  // ─── Series A: Agent Mode Banners ────────────────────────────────────────
  if (runA) {
    console.log('\n━━━ Series A: Agent Mode Banners (nano-banana-pro) ━━━━━━━━━━━');
    console.log('  Character: Alex "Mini" Finch, 21yo — reference-based generation');
    const filteredAgents = ONLY_FILTER 
      ? AGENT_MODES.filter(a => ONLY_FILTER.some(f => a.filename.toUpperCase().includes(f)))
      : AGENT_MODES;
    for (let i = 0; i < filteredAgents.length; i++) {
      const result = await generateWithReference(
        filteredAgents[i],
        buildAgentModePrompt,
        outAgents,
        costPerImage,
        [referenceDataURI, logoDataURI],  // Alex face + rocket logo
      );
      results.push({ series: 'A', ...result });
      if (!DRY_RUN && i < filteredAgents.length - 1) {
        process.stdout.write('  ⏳ Rate limiting (2s)...');
        await new Promise(r => setTimeout(r, 2000));
        process.stdout.write(' done\n');
      }
    }
  }

  // ─── Series B: Cognitive State Portraits ─────────────────────────────────
  if (runB) {
    console.log('\n━━━ Series B: Cognitive State Portraits (nano-banana-pro) ━━━━');
    console.log('  Character: Alex "Mini" Finch, 21yo — reference-based generation');
    const filteredStates = ONLY_FILTER
      ? COGNITIVE_STATES.filter(s => ONLY_FILTER.some(f => s.filename.toUpperCase().includes(f)))
      : COGNITIVE_STATES;
    for (let i = 0; i < filteredStates.length; i++) {
      const result = await generateWithReference(
        filteredStates[i],
        buildPortraitPrompt,
        outStates,
        costPerImage,
        [referenceDataURI, logoDataURI],  // Alex face + subtle logo patch
      );
      results.push({ series: 'B', ...result });
      if (!DRY_RUN && i < filteredStates.length - 1) {
        process.stdout.write('  ⏳ Rate limiting (2s)...');
        await new Promise(r => setTimeout(r, 2000));
        process.stdout.write(' done\n');
      }
    }
  }

  // ─── Report ────────────────────────────────────────────────────────────────
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successA = results.filter(r => r.series === 'A' && r.status === 'success').length;
  const successB = results.filter(r => r.series === 'B' && r.status === 'success').length;
  const actualCost = (successA + successB) * costPerImage;

  const report = {
    generatedAt: new Date().toISOString(),
    duration: `${duration}s`,
    dryRun: DRY_RUN,
    seriesA: { model: 'google/nano-banana-pro', count: agentCount, successful: successA, costPerImage },
    seriesB: { model: 'google/nano-banana-pro', count: stateCount, successful: successB, costPerImage },
    totalCost: `$${actualCost.toFixed(2)}`,
    outputDirs: { agents: outAgents, states: outStates },
    results,
  };

  const reportPath = path.join(outBase, 'generation-report.json');
  await fs.writeJSON(reportPath, report, { spaces: 2 });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Series A: ${successA}/${agentCount} agent banners`);
  console.log(`  Series B: ${successB}/${stateCount} state portraits`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Cost:     $${actualCost.toFixed(2)}`);
  console.log(`  Report:   ${reportPath}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
