/**
 * Alex Agent Mode & Cognitive State Image Generator
 * 
 * Generates two complementary image series for the Alex Cognitive Architecture:
 * 
 * Series A — AGENT MODE BANNERS (Ideogram v2, 1024x1024, rocket template)
 *   One image per VS Code specialized agent. Consistent with the alex2/ series.
 *   Note: Default Alex mode uses persona images instead of a banner.
 *   Output: alex_docs/alex3/agents/
 *
 * Series B — COGNITIVE STATE PORTRAITS (FLUX 1.1 Pro, 768x1024, character portrait)
 *   Alex "Mini" Finch (age 21) in task-specific cognitive states.
 *   Shows what Alex is actively doing / focused on right now.
 *   Output: alex_docs/alex3/states/
 *
 * Total: 14 images | Cost estimate: $0.48 (Series A) + $0.32 (Series B) = ~$0.80
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

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// ─────────────────────────────────────────────────────────────────────────────
// SERIES A — AGENT MODE BANNERS
// Template: same rocket composition as alex2/, title = agent mode name
// Model: ideogram-ai/ideogram-v2 ($0.08/image)
// ─────────────────────────────────────────────────────────────────────────────

const AGENT_MODES = [
  // Note: Default "Alex" orchestrator mode uses persona images instead of a banner
  {
    filename: 'AGENT-RESEARCHER.png',
    title: 'RESEARCH',
    subtitle: 'Explore Before You Build',
    color: '#7c3aed',           // Deep purple — intellectual depth
    description: 'Research mode — deep domain exploration, Phase 0',
  },
  {
    filename: 'AGENT-BUILDER.png',
    title: 'BUILD',
    subtitle: 'Implement With Confidence',
    color: '#16a34a',           // Forest green — construction, growth
    description: 'Builder mode — optimistic implementation, confident execution',
  },
  {
    filename: 'AGENT-VALIDATOR.png',
    title: 'VALIDATE',
    subtitle: 'Break It Before Users Do',
    color: '#dc2626',           // Alert red — adversarial, critical
    description: 'Validator mode — skeptical QA, adversarial review',
  },
  {
    filename: 'AGENT-DOCUMENTARIAN.png',
    title: 'DOCUMENT',
    subtitle: 'Knowledge That Lasts',
    color: '#14b8a6',           // Electric teal — clarity, precision
    description: 'Documentarian mode — drift-free docs, complete coverage',
  },
  {
    filename: 'AGENT-AZURE.png',
    title: 'AZURE',
    subtitle: 'Cloud Architecture Mastery',
    color: '#0ea5e9',           // Sky blue — Microsoft cloud
    description: 'Azure agent mode — cloud infra, deployment, MCP tools',
  },
  {
    filename: 'AGENT-M365.png',
    title: 'M365',
    subtitle: 'Microsoft 365 Expertise',
    color: '#2563eb',           // Microsoft blue — M365 ecosystem
    description: 'M365 agent mode — Teams, Copilot extensibility, Graph API',
  },
];

function buildAgentModePrompt(agent) {
  return `
Professional technology banner with crisp typography (1:1 square format, 1024x1024).

CRITICAL: Text must be EXACTLY as specified with no errors or artifacts.

TITLE TEXT (MAIN FOCUS - HUGE):
"${agent.title}"
Massive bold sans-serif, all caps, centered horizontally
Positioned in upper-center area
Color: ${agent.color} with bright glow effect
Crystal clear edges, highly legible

SUBTITLE TEXT:
"${agent.subtitle}"
Clean modern sans-serif, positioned below title, centered
White (#ffffff) with soft glow, smaller but readable

VISUAL:
- Center-left: Sleek modern rocket at 30° upward diagonal
- Rocket: ${agent.color} metallic finish, prominent but not overwhelming
- Thrust flame: Bright orange-yellow (#ff6b35), energetic
- Subtle "A" negative-space cutout on rocket body
- Large radial glow behind rocket matching ${agent.color}

BACKGROUND:
- Deep space gradient: top #0a0e1a → bottom #050810
- Scattered minimal white stars
- Soft particle effects in thrust trail
- Clean, professional, not cluttered

STYLE: Photorealistic 3D, Blender/Cinema4D quality, sharp focus, cinematic, premium corporate

MOOD: Empowering, confident, upward trajectory
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIES B — COGNITIVE STATE PORTRAITS
// Character: Alex "Mini" Finch, 21 years old, consistent appearance
// Model: black-forest-labs/flux-1.1-pro ($0.04/image)
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
    pose: 'leaning forward at desk, left elbow on table, chin resting on hand, right hand hovering over keyboard, eyes intense and narrowed at multiple screens',
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
    pose: 'leaning back slightly, arms crossed while reading, one finger tapping chin in thought, eyes narrowed analytically at code on screen',
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
];

function buildPortraitPrompt(state) {
  const traits = ALEX_CHARACTER.physicalTraits.join(', ');
  return `
Cinematic portrait photograph, professional lighting, shallow depth of field, 85mm lens.

SUBJECT: Young man named Alex, ${ALEX_CHARACTER.age}.
PHYSICAL TRAITS: ${traits}.
ATTIRE: ${state.attire}.

SCENARIO: ${state.scenario}

POSE AND COMPOSITION:
${state.pose}

ENVIRONMENT: ${state.environment}

LIGHTING: ${state.lighting}

MOOD AND EXPRESSION: ${state.mood}

TECHNICAL:
- Portrait orientation 3:4 (768x1024)
- Photorealistic, cinematic quality
- Bokeh background, sharp subject
- Professional grade photography
- Ultra-detailed face, accurate expression
- No text overlays
- Authentic, not stock-photo-generic

STYLE: Cinematic realism, professional portrait photography, high production value
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

async function generateFlux(prompt, filename) {
  if (DRY_RUN) {
    console.log(`   [DRY-RUN] Would call black-forest-labs/flux-1.1-pro`);
    return null;
  }
  const output = await replicate.run('black-forest-labs/flux-1.1-pro', {
    input: {
      prompt,
      aspect_ratio: '3:4',
      output_format: 'png',
      output_quality: 90,
      safety_tolerance: 2,
      prompt_upsampling: true,
    },
  });

  let url;
  if (Array.isArray(output)) url = output[0];
  else if (typeof output === 'string') url = output;
  else if (output && typeof output.url === 'function') url = output.url().toString();
  else if (output?.url) url = output.url;
  if (typeof url === 'object' && url?.href) url = url.href;

  if (!url) throw new Error(`No URL in FLUX response: ${JSON.stringify(output)}`);
  return url;
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
  const totalCost = agentCount * 0.08 + stateCount * 0.04;

  const outBase = path.join(ROOT, 'alex_docs', 'alex3');
  const outAgents = path.join(outBase, 'agents');
  const outStates = path.join(outBase, 'states');

  await fs.ensureDir(outAgents);
  await fs.ensureDir(outStates);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Alex Agent Mode & Cognitive State Image Generator');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Series A (agent banners): ${agentCount} images × $0.08 = $${(agentCount * 0.08).toFixed(2)}`);
  console.log(`  Series B (state portraits): ${stateCount} images × $0.04 = $${(stateCount * 0.04).toFixed(2)}`);
  console.log(`  Total estimated cost:  $${totalCost.toFixed(2)}`);
  console.log(`  Dry-run mode:  ${DRY_RUN}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];
  const startTime = Date.now();

  // ─── Series A: Agent Mode Banners ────────────────────────────────────────
  if (runA) {
    console.log('\n━━━ Series A: Agent Mode Banners (Ideogram v2) ━━━━━━━━━━━━━━━');
    for (let i = 0; i < AGENT_MODES.length; i++) {
      const result = await generate(
        AGENT_MODES[i],
        buildAgentModePrompt,
        generateIdeogram,
        outAgents,
        0.08,
      );
      results.push({ series: 'A', ...result });
      if (!DRY_RUN && i < AGENT_MODES.length - 1) {
        process.stdout.write('  ⏳ Rate limiting (2s)...');
        await new Promise(r => setTimeout(r, 2000));
        process.stdout.write(' done\n');
      }
    }
  }

  // ─── Series B: Cognitive State Portraits ─────────────────────────────────
  if (runB) {
    console.log('\n━━━ Series B: Cognitive State Portraits (FLUX 1.1 Pro) ━━━━━━━');
    console.log('  Character: Alex "Mini" Finch, 21yo — consistent across all portraits');
    for (let i = 0; i < COGNITIVE_STATES.length; i++) {
      const result = await generate(
        COGNITIVE_STATES[i],
        buildPortraitPrompt,
        generateFlux,
        outStates,
        0.04,
      );
      results.push({ series: 'B', ...result });
      if (!DRY_RUN && i < COGNITIVE_STATES.length - 1) {
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
  const actualCost = successA * 0.08 + successB * 0.04;

  const report = {
    generatedAt: new Date().toISOString(),
    duration: `${duration}s`,
    dryRun: DRY_RUN,
    seriesA: { model: 'ideogram-ai/ideogram-v2', count: agentCount, successful: successA, costPerImage: 0.08 },
    seriesB: { model: 'black-forest-labs/flux-1.1-pro', count: stateCount, successful: successB, costPerImage: 0.04 },
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
