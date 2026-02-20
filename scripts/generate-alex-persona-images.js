/**
 * Alex Persona Image Generator
 * 
 * Uses google/nano-banana-pro with a reference face image to generate
 * persona-specific welcome window images showing Alex in context-appropriate
 * professional situations.
 * 
 * Reference: Alex at age 15 (canonical source)
 * Output: Persona images with age-appropriate Alex doing profession-specific tasks
 * 
 * Usage:
 *   # Option 1: Load token from .env file
 *   node scripts/generate-alex-persona-images.js
 *
 *   # Option 2: Environment variable (for CI/scripts)
 *   $env:REPLICATE_API_TOKEN = "r8_..."
 *   node scripts/generate-alex-persona-images.js
 *
 *   # Options:
 *   node scripts/generate-alex-persona-images.js --dry-run
 *   node scripts/generate-alex-persona-images.js --limit=3
 *   node scripts/generate-alex-persona-images.js --skip=5
 *   node scripts/generate-alex-persona-images.js --only=developer,student
 */

import Replicate from 'replicate';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Load .env file for terminal usage
loadEnv({ path: path.join(ROOT, '.env') });

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const REF_ARG = args.find(a => a.startsWith('--reference='));
const LIMIT_ARG = args.find(a => a.startsWith('--limit='));
const SKIP_ARG = args.find(a => a.startsWith('--skip='));
const ONLY_ARG = args.find(a => a.startsWith('--only='));
const REFERENCE_IMAGE = REF_ARG ? REF_ARG.split('=')[1] : path.join(ROOT, 'alex_docs', 'alex3', 'alex-reference.png');
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : Infinity;
const SKIP = SKIP_ARG ? parseInt(SKIP_ARG.split('=')[1], 10) : 0;
const ONLY = ONLY_ARG ? ONLY_ARG.split('=')[1].split(',') : null;

const OUTPUT_DIR = path.join(ROOT, 'alex_docs', 'alex3', 'personas');

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
  style: 'photorealistic portrait, natural lighting, professional quality',
};

const REFERENCE_AGE = 15;

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA CONFIGURATIONS
// Maps persona IDs to visual scenes. Each persona has:
// - id: matches personaDetection.ts persona ID
// - noun: the bannerNoun displayed in welcome view (e.g., "CODE", "THESIS")
// - age: appropriate age for the professional context
// - scene: what Alex is doing in this persona context
// - attire: clothing appropriate to profession
// - setting: environment/background
// - expression: facial expression fitting the activity
// ─────────────────────────────────────────────────────────────────────────────

const PERSONA_CONFIGS = [
  // ── Core Developer Personas ──────────────────────────────────────────────
  {
    id: 'developer',
    noun: 'CODE',
    age: 21,
    scene: 'Writing code on a modern laptop, multiple browser tabs visible',
    attire: 'gray hoodie over flannel shirt, casual developer style',
    setting: 'Modern home office with dual monitors showing code, warm desk lamp lighting',
    expression: 'focused concentration, slight smile of solving a problem',
  },
  {
    id: 'architect',
    noun: 'ARCHITECTURE',
    age: 35,
    scene: 'Drawing system architecture diagrams on a whiteboard',
    attire: 'smart casual button-down shirt, sleeves rolled up',
    setting: 'Modern conference room with whiteboard covered in architecture diagrams and flow charts',
    expression: 'thoughtful strategic thinking, explaining a complex concept',
  },
  {
    id: 'devops',
    noun: 'INFRASTRUCTURE',
    age: 28,
    scene: 'Monitoring dashboard terminals, managing cloud infrastructure',
    attire: 'tech company hoodie, comfortable professional',
    setting: 'Operations center with multiple monitors showing metrics, Grafana/terminal dashboards',
    expression: 'alert and vigilant, calm under pressure',
  },
  {
    id: 'data-engineer',
    noun: 'DATA',
    age: 27,
    scene: 'Analyzing data pipelines and ETL workflows',
    attire: 'casual sweater, data science team style',
    setting: 'Data engineering workspace with Jupyter notebooks and data flow diagrams visible',
    expression: 'analytical focus, finding patterns in complexity',
  },
  {
    id: 'security',
    noun: 'SECURITY',
    age: 30,
    scene: 'Performing security audit, reviewing threat models',
    attire: 'dark professional attire, security consultant look',
    setting: 'Secure workspace with threat analysis tools, code review on screen',
    expression: 'intense scrutiny, adversarial mindset',
  },
  {
    id: 'qa-engineer',
    noun: 'TESTS',
    age: 26,
    scene: 'Running test suites, reviewing coverage reports',
    attire: 'casual tech company t-shirt, comfortable work style',
    setting: 'QA workspace with test results dashboard, green and red test indicators',
    expression: 'meticulous attention to detail, satisfaction of finding edge cases',
  },
  {
    id: 'sre',
    noun: 'INCIDENTS',
    age: 29,
    scene: 'Responding to production incident, managing runbooks',
    attire: 'on-call comfortable attire, headphones around neck',
    setting: 'Home office late at night, incident response tools and Slack visible',
    expression: 'calm systematic crisis handling, focused urgency',
  },

  // ── Research & Academic Personas ─────────────────────────────────────────
  {
    id: 'academic',
    noun: 'THESIS',
    age: 28,
    scene: 'Writing academic paper, surrounded by research materials',
    attire: 'scholarly casual, comfortable cardigan over oxford shirt',
    setting: 'University office with bookshelves, papers, and academic journals',
    expression: 'deep intellectual focus, crafting an argument',
  },
  {
    id: 'researcher',
    noun: 'RESEARCH',
    age: 32,
    scene: 'Analyzing research findings, synthesizing discoveries',
    attire: 'research lab casual, lanyard with badge',
    setting: 'Research lab with whiteboards full of hypotheses and findings',
    expression: 'eureka moment, connecting disparate findings',
  },
  {
    id: 'cognitive-scientist',
    noun: 'COGNITION',
    age: 34,
    scene: 'Studying AI models and cognitive architectures',
    attire: 'professorial smart casual, thoughtful academic',
    setting: 'AI research lab with neural network visualizations on screens',
    expression: 'fascinated by the nature of intelligence',
  },
  {
    id: 'grant-writer',
    noun: 'GRANTS',
    age: 36,
    scene: 'Drafting research proposal, organizing specific aims',
    attire: 'academic professional, blazer optional',
    setting: 'Research office with grant deadlines on calendar, proposal drafts visible',
    expression: 'persuasive determination, vision for funded research',
  },

  // ── Learning & Education Personas ────────────────────────────────────────
  {
    id: 'student',
    noun: 'LEARNING',
    age: 18,
    scene: 'Studying intently, taking notes from textbook and laptop',
    attire: 'university hoodie, comfortable study clothes',
    setting: 'College library or dorm room with textbooks, laptop, and notes',
    expression: 'eager absorption, the joy of understanding something new',
  },
  {
    id: 'presenter',
    noun: 'PRESENTATIONS',
    age: 29,
    scene: 'Delivering a conference presentation, engaging the audience',
    attire: 'professional speaker attire, confidence in posture',
    setting: 'Conference stage with presentation slides visible, audience blurred',
    expression: 'commanding presence, passionate about sharing knowledge',
  },

  // ── Content & Writing Personas ───────────────────────────────────────────
  {
    id: 'technical-writer',
    noun: 'DOCUMENTATION',
    age: 27,
    scene: 'Crafting clear technical documentation',
    attire: 'comfortable professional, writer aesthetic',
    setting: 'Clean desk with documentation tools, API reference on screen',
    expression: 'clarity-focused, making complex things simple',
  },
  {
    id: 'content-creator',
    noun: 'CONTENT',
    age: 24,
    scene: 'Creating engaging digital content, editing workflow',
    attire: 'creative casual, trendy but professional',
    setting: 'Creative studio with design tools, content calendar visible',
    expression: 'creative energy, audience engagement mindset',
  },
  {
    id: 'fiction-writer',
    noun: 'WRITING',
    age: 30,
    scene: 'Writing narrative fiction, developing characters',
    attire: 'cozy writer attire, comfortable and creative',
    setting: 'Writing nook with notebooks, story outlines, and character notes',
    expression: 'lost in creative flow, living in the story world',
  },
  {
    id: 'copywriter',
    noun: 'COPY',
    age: 26,
    scene: 'Crafting compelling headlines and marketing copy',
    attire: 'agency creative, stylish but approachable',
    setting: 'Marketing agency workspace with A/B test results, headline drafts',
    expression: 'persuasive wordsmith, understanding what converts',
  },

  // ── Business & Management Personas ───────────────────────────────────────
  {
    id: 'project-manager',
    noun: 'PROJECTS',
    age: 32,
    scene: 'Running sprint planning, organizing team workflow',
    attire: 'business casual, collaborative leader style',
    setting: 'Team workspace with Jira board, sprint planning in progress',
    expression: 'organized leadership, keeping everyone aligned',
  },
  {
    id: 'product-manager',
    noun: 'ROADMAPS',
    age: 31,
    scene: 'Building product roadmap, prioritizing features',
    attire: 'startup professional, approachable executive',
    setting: 'Product war room with roadmap on wall, user research visible',
    expression: 'strategic vision, balancing user needs and business goals',
  },
  {
    id: 'business-analyst',
    noun: 'ANALYSIS',
    age: 29,
    scene: 'Analyzing requirements, mapping business processes',
    attire: 'consultant professional, polished presentation',
    setting: 'Meeting room with process diagrams and requirements documents',
    expression: 'analytical clarity, bridging business and tech',
  },
  {
    id: 'bi-analyst',
    noun: 'INSIGHTS',
    age: 28,
    scene: 'Building dashboards, analyzing business metrics',
    attire: 'data-driven professional, modern business casual',
    setting: 'Analytics workspace with Power BI dashboards showing KPIs',
    expression: 'data storyteller, finding the insight that matters',
  },
  {
    id: 'consultant',
    noun: 'PROPOSALS',
    age: 33,
    scene: 'Presenting solution proposal to client',
    attire: 'professional consultant attire, trustworthy executive',
    setting: 'Client meeting room, professional presentation materials',
    expression: 'confident expertise, client-focused problem solving',
  },
  {
    id: 'marketer',
    noun: 'MARKETING',
    age: 27,
    scene: 'Analyzing campaign performance, optimizing funnels',
    attire: 'marketing creative professional, trend-aware',
    setting: 'Marketing workspace with analytics dashboards and campaign data',
    expression: 'data-driven creativity, growth mindset',
  },

  // ── Career & Personal Development ────────────────────────────────────────
  {
    id: 'job-seeker',
    noun: 'CAREER',
    age: 24,
    scene: 'Polishing resume, preparing for interviews',
    attire: 'interview-ready professional, first impression matters',
    setting: 'Home office preparing portfolio, LinkedIn profile visible',
    expression: 'determined hope, ready to prove worth',
  },
  {
    id: 'oss-contributor',
    noun: 'OPENSOURCE',
    age: 25,
    scene: 'Contributing to open source project, reviewing PR',
    attire: 'OSS community casual, GitHub shirt or similar',
    setting: 'Developer workspace with GitHub PR review, open source repo',
    expression: 'community spirit, collaborative improvement mindset',
  },
  {
    id: 'power-user',
    noun: 'CUSTOMIZATION',
    age: 23,
    scene: 'Customizing development environment, building extensions',
    attire: 'maker/hacker casual, comfortable tinkerer',
    setting: 'Personalized dev setup with custom tools and configurations',
    expression: 'builder excitement, making tools work perfectly',
  },

  // ── Gaming & Creative Tech ───────────────────────────────────────────────
  {
    id: 'game-developer',
    noun: 'GAMES',
    age: 26,
    scene: 'Building a game, testing mechanics',
    attire: 'game dev casual, creative tech style',
    setting: 'Game development studio with Unity/Unreal, pixel art visible',
    expression: 'playful creativity, designing fun experiences',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildPrompt(config) {
  const traits = ALEX_TRAITS.immutable.join(', ');
  const ageDelta = config.age - REFERENCE_AGE;
  const ageDirection = ageDelta > 0 ? `${ageDelta} years older` : ageDelta < 0 ? `${Math.abs(ageDelta)} years younger` : 'same age';
  
  return `
IMPORTANT: This is a reference-based age transformation. The attached reference image shows the person at AGE ${REFERENCE_AGE}. Generate an image of THIS SAME PERSON at age ${config.age} (${ageDirection} than the reference).

IDENTITY PRESERVATION (HIGHEST PRIORITY):
- The reference image shows the person at age ${REFERENCE_AGE} — use this as the source of truth for facial identity
- The output must look like the SAME PERSON as the reference, transformed to age ${config.age}
- Preserve: exact facial bone structure, nose shape, eye shape, lip shape
- Preserve: ${traits}
- The person in the output should be immediately recognizable as the person in the reference

AGE TRANSFORMATION:
- Reference age: ${REFERENCE_AGE} years old
- Target age: ${config.age} years old
- Transformation: ${ageDirection}
- Apply natural age-appropriate changes for a ${config.age}-year-old professional

SCENE — "${config.noun}" Context:
- Activity: ${config.scene}
- Attire: ${config.attire}
- Setting: ${config.setting}
- Expression: ${config.expression}

COMPOSITION:
- Show Alex from chest/shoulders up with some environment context
- Face clearly visible, welcoming and approachable
- Natural workspace lighting, warm and professional
- Format: Square 1:1 (1024x1024)
- Style: ${ALEX_TRAITS.style}
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

async function generateImage(prompt, referenceDataURI, outputPath) {
  if (DRY_RUN) {
    console.log(`   [DRY-RUN] Would call google/nano-banana-pro`);
    console.log(`   Prompt preview: ${prompt.slice(0, 300)}...`);
    return null;
  }

  const output = await replicate.run('google/nano-banana-pro', {
    input: {
      prompt: prompt,
      image_input: [referenceDataURI],
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║         ALEX PERSONA IMAGE GENERATOR                         ║');
  console.log('║         google/nano-banana-pro (Replicate)                   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // Validate API token
  if (!process.env.REPLICATE_API_TOKEN && !DRY_RUN) {
    console.error('❌ REPLICATE_API_TOKEN not set. Options:');
    console.error('   1. Create .env file with REPLICATE_API_TOKEN=r8_...');
    console.error('   2. Set environment variable: $env:REPLICATE_API_TOKEN = "r8_..."');
    console.error('   3. Run with --dry-run to preview prompts');
    process.exit(1);
  }

  // Validate reference image
  if (!await fs.pathExists(REFERENCE_IMAGE)) {
    console.error(`❌ Reference image not found: ${REFERENCE_IMAGE}`);
    process.exit(1);
  }

  console.log(`📷 Reference image: ${path.relative(ROOT, REFERENCE_IMAGE)}`);
  console.log(`📁 Output directory: ${path.relative(ROOT, OUTPUT_DIR)}`);
  console.log(`🏃 Mode: ${DRY_RUN ? 'DRY RUN (no API calls)' : 'LIVE (will charge API)'}`);
  console.log('');

  // Encode reference image
  const referenceDataURI = await encodeImageToDataURI(REFERENCE_IMAGE);
  console.log(`✅ Reference image encoded (${Math.round(referenceDataURI.length / 1024)} KB)\n`);

  // Filter configs
  let configs = PERSONA_CONFIGS;
  if (ONLY) {
    configs = configs.filter(c => ONLY.includes(c.id));
    console.log(`🎯 Filtering to: ${ONLY.join(', ')}\n`);
  }
  configs = configs.slice(SKIP, SKIP + LIMIT);

  // Ensure output directory
  await fs.ensureDir(OUTPUT_DIR);

  // Generate each persona image
  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    const filename = `PERSONA-${config.id.toUpperCase()}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    
    console.log(`[${i + 1}/${configs.length}] Generating ${config.id} (${config.noun}) — age ${config.age}...`);
    
    try {
      const prompt = buildPrompt(config);
      const result = await generateImage(prompt, referenceDataURI, outputPath);
      
      results.push({
        id: config.id,
        noun: config.noun,
        age: config.age,
        filename,
        success: true,
        prompt: prompt,
      });
      
      if (result) {
        console.log(`   ✅ Saved: ${filename}`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      results.push({
        id: config.id,
        noun: config.noun,
        age: config.age,
        filename,
        success: false,
        error: error.message,
      });
    }

    // Rate limiting pause between API calls
    if (!DRY_RUN && i < configs.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`COMPLETE: ${succeeded} succeeded, ${failed} failed in ${elapsed}s`);
  console.log(`Est. cost: ~$${(succeeded * 0.025).toFixed(3)} (google/nano-banana-pro)`);
  console.log('════════════════════════════════════════════════════════════════\n');

  // Write report
  const reportPath = path.join(OUTPUT_DIR, 'generation-report.json');
  await fs.writeJson(reportPath, {
    generated: new Date().toISOString(),
    model: 'google/nano-banana-pro',
    referenceImage: path.relative(ROOT, REFERENCE_IMAGE),
    referenceAge: REFERENCE_AGE,
    outputDir: path.relative(ROOT, OUTPUT_DIR),
    dryRun: DRY_RUN,
    results,
  }, { spaces: 2 });
  console.log(`📄 Report saved: ${path.relative(ROOT, reportPath)}`);
}

main().catch(console.error);
