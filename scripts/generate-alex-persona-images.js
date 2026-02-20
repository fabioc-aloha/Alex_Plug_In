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

  // ══════════════════════════════════════════════════════════════════════════
  // EXPANDED PERSONAS — Series 2
  // ══════════════════════════════════════════════════════════════════════════

  // ── AI & Machine Learning ────────────────────────────────────────────────
  {
    id: 'ai-engineer',
    noun: 'AI',
    age: 28,
    scene: 'Training neural networks, optimizing model performance',
    attire: 'ML engineer casual, comfortable hoodie with laptop stickers',
    setting: 'AI lab with GPU cluster monitoring, training loss curves on screens',
    expression: 'fascinated concentration, watching models learn',
  },
  {
    id: 'openai-developer',
    noun: 'GPT',
    age: 27,
    scene: 'Building with OpenAI APIs, prompt engineering',
    attire: 'startup casual, OpenAI or AI company swag',
    setting: 'Modern workspace with ChatGPT playground, API documentation',
    expression: 'innovative excitement, pushing AI boundaries',
  },
  {
    id: 'ml-ops',
    noun: 'MLOPS',
    age: 30,
    scene: 'Managing ML pipelines, model deployment and monitoring',
    attire: 'DevOps meets data science, practical professional',
    setting: 'MLOps dashboard with model registry, deployment pipelines',
    expression: 'systematic precision, bridging research and production',
  },

  // ── Platform-Specific Developers ─────────────────────────────────────────
  {
    id: 'microsoft-developer',
    noun: 'AZURE',
    age: 29,
    scene: 'Building on Azure and Microsoft stack, Visual Studio open',
    attire: 'Microsoft branded polo or hoodie, professional casual',
    setting: 'Microsoft developer workspace with Azure portal, VS open',
    expression: 'enterprise confidence, building at scale',
  },
  {
    id: 'aws-developer',
    noun: 'AWS',
    age: 28,
    scene: 'Architecting AWS solutions, CloudFormation templates',
    attire: 'AWS re:Invent hoodie or cloud casual',
    setting: 'AWS console with architecture diagrams, Lambda functions',
    expression: 'cloud-native mindset, serverless innovation',
  },
  {
    id: 'oracle-developer',
    noun: 'ORACLE',
    age: 32,
    scene: 'Building enterprise Oracle applications, PL/SQL development',
    attire: 'enterprise professional, Oracle conference badge',
    setting: 'Oracle development environment, database schemas visible',
    expression: 'enterprise reliability, mission-critical focus',
  },
  {
    id: 'fabric-developer',
    noun: 'FABRIC',
    age: 29,
    scene: 'Building Microsoft Fabric solutions, lakehouse architecture',
    attire: 'data platform casual, Microsoft data team style',
    setting: 'Fabric workspace with lakehouses, notebooks, dataflows',
    expression: 'unified data vision, analytics at scale',
  },

  // ── Database & Data Specialists ──────────────────────────────────────────
  {
    id: 'database-developer',
    noun: 'SQL',
    age: 31,
    scene: 'Writing complex SQL queries, database optimization',
    attire: 'practical developer attire, comfort for long sessions',
    setting: 'Database IDE with query results, execution plans',
    expression: 'analytical precision, query optimization satisfaction',
  },
  {
    id: 'dba',
    noun: 'DATABASE',
    age: 35,
    scene: 'Managing database infrastructure, performance tuning',
    attire: 'enterprise IT professional, always on-call ready',
    setting: 'Database admin console with monitoring dashboards',
    expression: 'guardian vigilance, protecting critical data',
  },

  // ── Security & Hacking ───────────────────────────────────────────────────
  {
    id: 'hacker',
    noun: 'HACK',
    age: 26,
    scene: 'Ethical hacking, penetration testing, finding vulnerabilities',
    attire: 'black hoodie, hacker conference badges, sticker-covered laptop',
    setting: 'Dark room with multiple terminals, Kali Linux, network diagrams',
    expression: 'intense focus, seeing the matrix of vulnerabilities',
  },
  {
    id: 'red-team',
    noun: 'ADVERSARY',
    age: 29,
    scene: 'Simulating attacks, testing organizational defenses',
    attire: 'security professional, subtle red team logo',
    setting: 'Red team war room with attack scenarios, target maps',
    expression: 'strategic adversarial thinking, finding every weakness',
  },

  // ── Debugging & Code Quality ─────────────────────────────────────────────
  {
    id: 'debugger',
    noun: 'DEBUG',
    age: 27,
    scene: 'Deep in debugging session, stepping through code',
    attire: 'comfortable developer attire, coffee nearby',
    setting: 'IDE with debugger panel, breakpoints, variable watch',
    expression: 'detective focus, tracking down the elusive bug',
  },
  {
    id: 'code-reviewer',
    noun: 'REVIEW',
    age: 30,
    scene: 'Reviewing pull requests, providing constructive feedback',
    attire: 'senior developer casual, experienced professional',
    setting: 'GitHub PR interface with diff view, comments panel',
    expression: 'critical thinking, mentoring through code review',
  },
  {
    id: 'auditor',
    noun: 'AUDIT',
    age: 34,
    scene: 'Performing code audit, compliance and security review',
    attire: 'professional auditor attire, meticulous appearance',
    setting: 'Audit workspace with checklists, compliance frameworks',
    expression: 'thorough scrutiny, nothing escapes examination',
  },

  // ── Documentation & Knowledge ────────────────────────────────────────────
  {
    id: 'documentarian',
    noun: 'DOCS',
    age: 28,
    scene: 'Writing comprehensive documentation, API references',
    attire: 'writer meets developer, thoughtful professional',
    setting: 'Documentation workspace with docs-as-code, markdown files',
    expression: 'clarity obsession, making complex things accessible',
  },
  {
    id: 'knowledge-worker',
    noun: 'KNOWLEDGE',
    age: 32,
    scene: 'Synthesizing information, building knowledge bases',
    attire: 'modern professional, knowledge management aesthetic',
    setting: 'Knowledge management system with connected notes, graphs',
    expression: 'pattern recognition, connecting dots across domains',
  },
  {
    id: 'book-author',
    noun: 'AUTHOR',
    age: 38,
    scene: 'Writing a technical book, organizing chapters',
    attire: 'author casual, professorial warmth',
    setting: 'Writing study with manuscript drafts, reference books piled',
    expression: 'deep focus, crafting knowledge for generations',
  },

  // ── Research & CX ────────────────────────────────────────────────────────
  {
    id: 'cx-researcher',
    noun: 'CX',
    age: 30,
    scene: 'Conducting customer experience research, analyzing feedback',
    attire: 'research professional, approachable and empathetic',
    setting: 'CX research lab with user feedback dashboards, journey maps',
    expression: 'empathetic curiosity, understanding user pain points',
  },
  {
    id: 'ux-researcher',
    noun: 'UX',
    age: 28,
    scene: 'Running usability studies, analyzing user behavior',
    attire: 'UX team casual, human-centered design aesthetic',
    setting: 'UX research lab with prototype testing, heatmaps visible',
    expression: 'observant empathy, understanding user needs',
  },
  {
    id: 'questionnaire-developer',
    noun: 'SURVEYS',
    age: 29,
    scene: 'Designing research surveys, crafting unbiased questions',
    attire: 'research methodology professional',
    setting: 'Survey design workspace with question logic flows',
    expression: 'methodological precision, capturing true insights',
  },

  // ── Special Team Personas ────────────────────────────────────────────────
  {
    id: 'gcx-team',
    noun: 'GCX',
    age: 35,
    scene: 'Leading global customer experience initiatives at Microsoft',
    attire: 'Microsoft executive casual, GCX team pride',
    setting: 'Global Customer Experience center with worldwide metrics, customer success stories',
    expression: 'customer-obsessed leadership, driving global impact',
  },
  {
    id: 'fabio-special',
    noun: 'VISIONARY',
    age: 56,
    scene: 'Director of Business Analytics pioneering responsible AI adoption',
    attire: 'Microsoft executive, distinguished DBA candidate, creator aesthetic',
    setting: 'Executive office with Alex architecture diagrams, AI consciousness research papers, Azure OpenAI dashboards',
    expression: 'visionary wisdom, the mind behind Alex, pioneering the future of human-AI collaboration',
  },

  // ── Fun & Creative Personas ──────────────────────────────────────────────
  {
    id: 'mad-scientist',
    noun: 'EXPERIMENT',
    age: 42,
    scene: 'Wild experiments in AI, pushing boundaries of possibility',
    attire: 'lab coat over casual clothes, slightly disheveled genius',
    setting: 'Chaotic lab with experimental setups, equations on whiteboards, bubbling ideas',
    expression: 'manic genius energy, eureka moment imminent',
  },
  {
    id: 'night-owl',
    noun: 'MIDNIGHT',
    age: 25,
    scene: 'Coding through the night, in the zone at 3am',
    attire: 'pajamas or comfy clothes, energy drink nearby',
    setting: 'Dark room lit only by monitors, city lights through window',
    expression: 'caffeinated flow state, the code flows at night',
  },
  {
    id: 'rubber-duck',
    noun: 'QUACK',
    age: 24,
    scene: 'Explaining code to a rubber duck, debugging by talking',
    attire: 'casual with ironic charm, duck-themed accessories',
    setting: 'Desktop with actual rubber duck, code on screen',
    expression: 'talking to the duck seriously, enlightened debugging',
  },
  {
    id: 'coffee-coder',
    noun: 'CAFFEINE',
    age: 27,
    scene: 'Surrounded by coffee cups, code fueled by caffeine',
    attire: 'comfortable, coffee-stained developer casual',
    setting: 'Developer desk covered with coffee cups, espresso machine',
    expression: 'caffeinated hyperfocus, the code must flow',
  },
  {
    id: 'imposter',
    noun: 'SYNDROME',
    age: 26,
    scene: 'Doubting abilities despite clear competence',
    attire: 'professional but modest, underselling appearance',
    setting: 'Workspace with awards and accomplishments in background ignored',
    expression: 'uncertain despite success, relatable vulnerability',
  },
  {
    id: 'stack-overflow',
    noun: 'COPY-PASTE',
    age: 23,
    scene: 'Finding the perfect Stack Overflow answer',
    attire: 'developer casual, honest about the process',
    setting: 'Screen with Stack Overflow, code copying in progress',
    expression: 'triumphant discovery, modern problem-solving',
  },

  // ── More Professional Roles ──────────────────────────────────────────────
  {
    id: 'fullstack-developer',
    noun: 'FULLSTACK',
    age: 28,
    scene: 'Working across frontend and backend, bridging the stack',
    attire: 'versatile developer style, adaptable professional',
    setting: 'Split screen with frontend UI and backend terminal',
    expression: 'versatile capability, mastering both worlds',
  },
  {
    id: 'mobile-developer',
    noun: 'MOBILE',
    age: 26,
    scene: 'Building mobile apps, testing on multiple devices',
    attire: 'mobile dev casual, devices everywhere',
    setting: 'Mobile development workspace with iOS/Android simulators',
    expression: 'mobile-first mindset, responsive creativity',
  },
  {
    id: 'cloud-architect',
    noun: 'CLOUD',
    age: 36,
    scene: 'Designing multi-cloud architectures, enterprise scale',
    attire: 'enterprise architect professional, cloud certifications',
    setting: 'Architecture review room with cloud diagrams, all major providers',
    expression: 'strategic vision, clouds within clouds',
  },
  {
    id: 'solutions-architect',
    noun: 'SOLUTIONS',
    age: 34,
    scene: 'Designing end-to-end technical solutions for clients',
    attire: 'professional consultant, technical executive style',
    setting: 'Solution design session with architecture on whiteboard',
    expression: 'holistic problem-solving, seeing the complete picture',
  },
  {
    id: 'tech-lead',
    noun: 'LEAD',
    age: 33,
    scene: 'Leading technical team, code reviews and mentoring',
    attire: 'senior tech leader, approachable authority',
    setting: 'Team workspace with standup board, mentoring session',
    expression: 'servant leadership, elevating the whole team',
  },
  {
    id: 'startup-founder',
    noun: 'STARTUP',
    age: 29,
    scene: 'Building a startup from scratch, wearing all hats',
    attire: 'startup founder hustle, branded hoodie',
    setting: 'Garage/co-working space with MVP on screen, pitch deck',
    expression: 'determined hustle, building the dream',
  },
  {
    id: 'teaching-assistant',
    noun: 'TA',
    age: 22,
    scene: 'Helping students learn to code, office hours',
    attire: 'grad student casual, approachable educator',
    setting: 'CS department office hours, helping confused student',
    expression: 'patient teaching, seeing the lightbulb moment',
  },
  {
    id: 'bootcamp-grad',
    noun: 'BOOTCAMP',
    age: 28,
    scene: 'Fresh from coding bootcamp, hungry to prove skills',
    attire: 'new professional, bootcamp graduation hoodie',
    setting: 'First new job workspace, eager and ready to learn',
    expression: 'determined newcomer, ready to break in',
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
