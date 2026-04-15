#!/usr/bin/env node
/**
 * @muscle brain-qa
 * @inheritance master-only
 * @description Generate brain health quality grid for cognitive architecture
 * @version 1.0.0
 * @skill brain-qa
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Brain QA - Generates brain health quality grid
 * Location: .github/muscles/brain-qa.cjs
 * 
 * Single responsibility: Scan cognitive architecture, output quality grid.
 * Other trifectas handle fixing issues identified in the grid.
 * 
 * Scored dimensions (0 = defect, 1 = good):
 *   fm     - Frontmatter (applyTo, description) makes it visible to the brain
 *   bounds - Within line bounds (skills: 100-500, agents: 50-400)
 *   tri    - Trifecta complete (if workflow skill, has .instructions.md)
 *   muscle - Has automation component (script or pseudocode.md)
 * 
 * Informational dimensions (not scored):
 *   code   - Has pseudocode (excludes mermaid/ascii/diagrams)
 *   inh    - Inheritance (1 = master-only, 0 = synced to heirs)
 *   stale  - Stale-prone (1 = needs regular review, 0 = stable)
 * 
 * Quality Philosophy:
 *   fm      → Visibility to the brain (discoverable via applyTo/description)
 *   bounds  → Memory has structural merit (not too thin, not too bloated)
 *   tri + muscle → Goal for ANY skill (trifecta alignment + automation)
 * 
 * Skill Types:
 *   Intellectual Skill: Trifecta only (tri=1, muscle=0) - max 3/3
 *     - Requires thinking but no action (reasoning, analysis, judgment)
 *     - Examples: code-review, root-cause-analysis, security-review
 * 
 *   Agentic Skill: Trifecta + Muscle (tri=1, muscle=1) - max 4/4
 *     - Autonomous execution capability (knows AND does)
 *     - Examples: md-to-word, brain-qa, docx-to-md
 * 
 * Muscle Philosophy:
 *   Every skill should aspire to have a "muscle" (automation component):
 *   - Cross-platform possible (Node.js) → actual .cjs/.js script
 *   - Cross-platform challenging → pseudocode .md describing what to do
 *   - Intellectual skills legitimately have no muscle (tri without muscle)
 * 
 * Modern Synapses (enforced via existing dimensions):
 *   - applyTo in frontmatter → file pattern activation (part of fm)
 *   - description in frontmatter → semantic matching (part of fm)
 *   - trifecta naming → skill X links to X.instructions.md (tri)
 *   - handoffs in agents → explicit routing (agents scoring)
 * 
 * DEPRECATED: synapses.json files are no longer required.
 * Copilot's semantic search + applyTo patterns replace static connection graphs.
 * 
 * Tier-based pass thresholds (good is good enough):
 *   core      - 0 defects (must be perfect)
 *   standard  - 1 defect allowed
 *   extended  - 2 defects allowed
 *   specialist- 3 defects allowed
 * 
 * Usage:
 *   node brain-qa.cjs              # Generate grid to .github/quality/
 *   node brain-qa.cjs --stdout     # Output to stdout instead of file
 */

"use strict";

const fs = require("fs");
const path = require("path");

// --- Config ---
const ROOT = path.resolve(__dirname, "..", "..");
const GH = path.join(ROOT, ".github");
const QUALITY_DIR = path.join(GH, "quality");
const STDOUT_MODE = process.argv.includes("--stdout");

// --- Ensure quality folder exists ---
if (!fs.existsSync(QUALITY_DIR)) {
  fs.mkdirSync(QUALITY_DIR, { recursive: true });
}

// --- Read existing semantic review (sem) values from previous grid ---
// Preserves sem=1 when regenerating the grid, so manual reviews aren't lost
function readExistingSemValues() {
  const gridPath = path.join(QUALITY_DIR, "brain-health-grid.md");
  if (!fs.existsSync(gridPath)) return { skills: {}, instructions: {}, agents: {} };

  const content = fs.readFileSync(gridPath, "utf-8");
  const semValues = { skills: {}, instructions: {}, agents: {} };

  // Parse Skills table: | [skill-name](path) | ... | inh | stale | sem |
  // Table format: | [name](path) | tier | lines | fm | code | bounds | tri | muscle | Type | Score | Pass | inh | stale | sem |
  const skillsSection = content.match(/## Skills[\s\S]*?(?=## Agents|## Instructions|$)/);
  if (skillsSection) {
    const skillRows = skillsSection[0].matchAll(/^\| \[([\w-]+)\]\([^)]+\) \| \w+ \| \d+ \|.*\| (\d) \|$/gm);
    for (const match of skillRows) {
      const name = match[1];
      const sem = parseInt(match[2], 10);
      semValues.skills[name] = sem;
    }
  }

  // Parse Agents table: | [agent-name](path) | lines | ... | sem |
  const agentsSection = content.match(/## Agents[\s\S]*?(?=## Instructions|## Prompts|## Overall|$)/);
  if (agentsSection) {
    const agentRows = agentsSection[0].matchAll(/^\| \[([\w-]+)\]\([^)]+\) \| \d+ \|.*\| (\d) \|$/gm);
    for (const match of agentRows) {
      const name = match[1];
      const sem = parseInt(match[2], 10);
      semValues.agents[name] = sem;
    }
  }

  // Parse Instructions table: | [instruction-name](path) | lines | ... | sem |
  const instrSection = content.match(/## Instructions[\s\S]*?(?=## Prompts|## Overall|$)/);
  if (instrSection) {
    const instrRows = instrSection[0].matchAll(/^\| \[([\w-]+)\]\([^)]+\) \| \d+ \|.*\| (\d) \|$/gm);
    for (const match of instrRows) {
      const name = match[1];
      const sem = parseInt(match[2], 10);
      semValues.instructions[name] = sem;
    }
  }

  return semValues;
}

// Load existing sem values before generating new grid
const EXISTING_SEM = readExistingSemValues();

// --- Load master-only skills from sync-architecture.cjs ---
function getMasterOnlySkills() {
  const syncPath = path.join(GH, "muscles", "sync-architecture.cjs");
  if (!fs.existsSync(syncPath)) return new Set();

  const content = fs.readFileSync(syncPath, "utf-8");
  const masterOnly = new Set();

  // Extract SKILL_EXCLUSIONS map entries with "master-only"
  const mapMatch = content.match(/const SKILL_EXCLUSIONS = \{([\s\S]*?)\};/);
  if (mapMatch) {
    const entries = mapMatch[1].matchAll(/"([\w-]+)":\s*"master-only"/g);
    for (const entry of entries) {
      masterOnly.add(entry[1]);
    }
  }

  return masterOnly;
}

const MASTER_ONLY_SKILLS = getMasterOnlySkills();

// --- Stale-prone skills (need regular review due to external API churn) ---
const STALE_PRONE = new Set([
  'vscode-extension-patterns', 'chat-participant-patterns', 'm365-agent-debugging',
  'teams-app-patterns', 'llm-model-selection', 'git-workflow',
  'privacy-responsible-ai', 'microsoft-sfi'
]);

// --- Tier-based pass thresholds ---
// "Good is good enough" - higher tiers require higher quality
// Max score is 5 (fm, code, bounds, tri, muscle)
const TIER_THRESHOLDS = {
  core: 5,       // Must be perfect
  standard: 4,   // One defect allowed
  extended: 3,   // Two defects allowed
  specialist: 2, // Three defects allowed
};
const DEFAULT_TIER = 'standard';

function getPassThreshold(tier) {
  return TIER_THRESHOLDS[tier] || TIER_THRESHOLDS[DEFAULT_TIER];
}

// --- Check if skill has corresponding instruction (for trifecta) ---
function hasMatchingInstruction(skillName) {
  const instrPath = path.join(GH, "instructions", `${skillName}.instructions.md`);
  return fs.existsSync(instrPath);
}

// --- Check if skill describes a workflow (needs trifecta) ---
function isWorkflowSkill(content) {
  // Workflow indicators: numbered steps, phase/step terminology, procedural language
  const workflowPatterns = [
    /(?:^|\n)##?\s*(?:phase|step|stage)\s*\d/i,  // Phase 1, Step 2, etc.
    /(?:^|\n)\d+\.\s+\*\*[^*]+\*\*/,              // 1. **Bold step**
    /(?:^|\n)##?\s*workflow/i,                    // ## Workflow section
    /(?:^|\n)##?\s*procedure/i,                   // ## Procedure section
    /(?:^|\n)##?\s*process/i,                     // ## Process section
  ];
  return workflowPatterns.some(p => p.test(content));
}

// --- Check if skill has corresponding muscle (automation component) ---
// Muscle = either a script (.cjs/.js) or pseudocode markdown (.md)
// Pseudocode.md is for cross-platform challenges; script is preferred when possible
function hasMatchingMuscle(skillName) {
  const musclesDir = path.join(GH, "muscles");
  // Check for script versions (preferred: cross-platform Node.js)
  const cjsPath = path.join(musclesDir, `${skillName}.cjs`);
  const jsPath = path.join(musclesDir, `${skillName}.js`);
  // Check for pseudocode md version (for cross-platform challenges)
  const mdPath = path.join(musclesDir, `${skillName}.md`);
  
  return fs.existsSync(cjsPath) || fs.existsSync(jsPath) || fs.existsSync(mdPath);
}

// --- Skill Quality Scanner ---
function scanSkills() {
  const skillsDir = path.join(GH, "skills");
  if (!fs.existsSync(skillsDir)) return [];

  const results = [];
  const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const name of skillDirs) {
    const skillPath = path.join(skillsDir, name, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;

    const content = fs.readFileSync(skillPath, "utf-8");
    const lines = content.split("\n").length;

    // Check frontmatter completeness
    const hasName = /^name:/m.test(content);
    const hasDesc = /^description:/m.test(content);
    const hasApplyTo = /^applyTo:/m.test(content);
    const hasTier = /^tier:/m.test(content);
    const fmComplete = hasName && hasDesc && hasApplyTo && hasTier;

    // Extract tier value
    const tierMatch = content.match(/^tier:\s*(\w+)/m);
    const tier = tierMatch ? tierMatch[1].toLowerCase() : DEFAULT_TIER;

    // Check code blocks (exclude mermaid, ascii, text, diagram-type languages)
    const hasCode = /```(?!mermaid|ascii|text|txt|diagram|plantuml|graphviz|dot|chart|diff)\w+/i.test(content);

    // Check bounds (not too thin, not too bloated)
    const withinBounds = lines >= MIN_SKILL_LINES && lines <= MAX_SKILL_LINES;

    // Check trifecta (only flag if workflow skill missing instruction)
    const isWorkflow = isWorkflowSkill(content);
    const hasInstr = hasMatchingInstruction(name);
    // tri=1 means "no defect": either not a workflow, or workflow with instruction
    const triComplete = !isWorkflow || hasInstr;

    // Check muscle (automation component: script or pseudocode.md)
    const hasMuscle = hasMatchingMuscle(name);

    // Check inheritance (master-only)
    const isMasterOnly = MASTER_ONLY_SKILLS.has(name);

    // Check staleness (needs regular review)
    const isStaleProne = STALE_PRONE.has(name);

    // Quality flags (0 = defect, 1 = good)
    // Scored: fm, code, bounds, tri, muscle (max 5)
    // Informational: inh, stale
    const flags = {
      fm: fmComplete ? 1 : 0,
      code: hasCode ? 1 : 0,
      bounds: withinBounds ? 1 : 0,
      tri: triComplete ? 1 : 0,
      muscle: hasMuscle ? 1 : 0,
      inh: isMasterOnly ? 1 : 0,   // 1 = master-only, 0 = synced to heirs
      stale: isStaleProne ? 1 : 0, // 1 = needs regular review, 0 = stable
    };

    // Determine skill type and max possible score
    // Code is informational only (not scored) - just indicates pseudocode presence
    // Intellectual skills (tri=1, muscle=0): max score is 3 (fm, bounds, tri)
    // Agentic skills (tri=1, muscle=1): max score is 4 (fm, bounds, tri, muscle)
    // Incomplete skills (tri=0): max score is 4 but likely won't pass
    const agentic = triComplete && hasMuscle;
    const intellectual = triComplete && !hasMuscle;
    const maxScore = intellectual ? 3 : 4;

    // Score: sum of scored flags (code is informational, not scored)
    const score = flags.fm + flags.bounds + flags.tri + flags.muscle;
    
    // Adjust score for intellectual skills (don't penalize missing muscle)
    const adjustedScore = intellectual ? (flags.fm + flags.bounds + flags.tri) : score;

    // Tier-based pass/fail - fm is a GATE (broken without frontmatter)
    // Threshold is relative to max possible score:
    // core: max - 0 (perfect), standard: max - 1, extended: max - 2, specialist: max - 3
    const allowedDefects = { core: 0, standard: 1, extended: 2, specialist: 3 }[tier] ?? 1;
    const threshold = maxScore - allowedDefects;
    const pass = fmComplete && (adjustedScore >= threshold);

    results.push({ name, lines, flags, score: adjustedScore, tier, threshold, pass, isWorkflow, agentic, maxScore });
  }

  return results.sort((a, b) => a.score - b.score);
}

// Line bounds: minimum to justify existence, maximum for token efficiency
const MIN_SKILL_LINES = 100;
const MAX_SKILL_LINES = 500;
const MIN_AGENT_LINES = 50;
const MAX_AGENT_LINES = 400;

// --- Agent Scanner ---
function scanAgents() {
  const agentsDir = path.join(GH, "agents");
  if (!fs.existsSync(agentsDir)) return [];

  const results = [];
  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith(".agent.md"));

  for (const file of agentFiles) {
    const content = fs.readFileSync(path.join(agentsDir, file), "utf-8");
    const lines = content.split("\n").length;
    const name = file.replace(".agent.md", "");

    // Check frontmatter completeness (all 4 required)
    const hasDesc = /^description:/m.test(content);
    const hasName = /^name:/m.test(content);
    const hasModel = /^model:/m.test(content);
    const hasTools = /^tools:/m.test(content);
    const fmComplete = hasDesc && hasName && hasModel && hasTools;

    // Check handoffs
    const hasHandoffs = /^handoffs:/m.test(content);

    // Check bounds (not too thin, not too bloated)
    const withinBounds = lines >= MIN_AGENT_LINES && lines <= MAX_AGENT_LINES;

    // Check persona (has mental model / when to use / persona section)
    const hasPersona = /##\s*(mental model|when to use|persona|mindset|core directive|core identity)/i.test(content);

    // Check code examples (exclude mermaid, ascii, text, diagram-type languages)
    const hasCode = /```(?!mermaid|ascii|text|txt|diagram|plantuml|graphviz|dot|chart|diff)\w+/i.test(content);

    // Semantic review flag (preserved from previous grid, default 0)
    const sem = EXISTING_SEM.agents[name] ?? 0;

    const flags = {
      fm: fmComplete ? 1 : 0,
      handoffs: hasHandoffs ? 1 : 0,
      bounds: withinBounds ? 1 : 0,
      persona: hasPersona ? 1 : 0,
      code: hasCode ? 1 : 0,
    };

    const score = flags.fm + flags.handoffs + flags.bounds + flags.persona + flags.code;
    // fm is a GATE - agents without frontmatter are broken
    const pass = fmComplete && (score >= 4);
    results.push({ name, lines, flags, score, maxScore: 5, pass, sem });
  }

  return results.sort((a, b) => a.score - b.score);
}

// --- Instruction Scanner ---
function scanInstructions() {
  const instrDir = path.join(GH, "instructions");
  if (!fs.existsSync(instrDir)) return [];

  // Get list of existing skills for trifecta check
  const skillsDir = path.join(GH, "skills");
  const existingSkills = new Set();
  if (fs.existsSync(skillsDir)) {
    fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .forEach(d => existingSkills.add(d.name));
  }

  const results = [];
  const files = fs.readdirSync(instrDir).filter(f => f.endsWith(".instructions.md"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(instrDir, file), "utf-8");
    const lines = content.split("\n").length;
    const name = file.replace(".instructions.md", "");

    // Check frontmatter completeness (description + application for discoverability)
    const hasDesc = /^description:/m.test(content);
    const hasApplication = /^application:/m.test(content);
    const fmComplete = hasDesc && hasApplication;

    // Check depth (>50 lines for substantive content)
    const hasDepth = lines > 50;

    // Check structure (≥2 ## section headers)
    const sectionCount = (content.match(/^##\s+/gm) || []).length;
    const hasStructure = sectionCount >= 2;

    // Check code examples (exclude mermaid, ascii, text, diagram-type languages)
    const hasCode = /```(?!mermaid|ascii|text|txt|diagram|plantuml|graphviz|dot|chart|diff)\w+/i.test(content);

    // Check trifecta (has matching skill)
    const hasSkill = existingSkills.has(name);

    const flags = {
      fm: fmComplete ? 1 : 0,
      depth: hasDepth ? 1 : 0,
      sect: hasStructure ? 1 : 0,
      code: hasCode ? 1 : 0,
      skill: hasSkill ? 1 : 0,
    };

    const score = flags.fm + flags.depth + flags.sect + flags.code + flags.skill;
    // fm is a GATE - instructions without frontmatter won't be discoverable
    const pass = fmComplete && (score >= 3);
    results.push({ name, lines, flags, score, maxScore: 5, pass });
  }

  return results.sort((a, b) => a.score - b.score);
}

// --- Prompt Scanner ---
function scanPrompts() {
  const promptsDir = path.join(GH, "prompts");
  if (!fs.existsSync(promptsDir)) return [];

  const results = [];
  const files = fs.readdirSync(promptsDir).filter(f => f.endsWith(".prompt.md"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(promptsDir, file), "utf-8");
    const lines = content.split("\n").length;
    const name = file.replace(".prompt.md", "");

    const hasDesc = /^description:/m.test(content);
    const hasApp = /^application:/m.test(content);
    const flags = {
      desc: hasDesc ? 1 : 0,
      app: hasApp ? 1 : 0,
      agent: /^agent:/m.test(content) ? 1 : 0,
      over20: lines > 20 ? 1 : 0,
    };

    const score = flags.desc + flags.app + flags.agent + flags.over20;
    // desc + app are GATES - prompts need both for discoverability and routing
    const pass = hasDesc && hasApp && (score >= 3);
    results.push({ name, lines, flags, score, maxScore: 4, pass });
  }

  return results.sort((a, b) => a.score - b.score);
}

// --- Muscle Scanner ---
function scanMuscles() {
  const musclesDir = path.join(GH, "muscles");
  if (!fs.existsSync(musclesDir)) return [];

  // Helper to read @inheritance from file header
  function getInheritanceFromHeader(content) {
    const header = content.slice(0, 2000); // ~50 lines
    const match = header.match(/@inheritance\s+(master-only|inheritable)/);
    return match ? match[1] : 'inheritable'; // default
  }

  // Categorize muscles by pattern
  const CONVERTERS = ['md-to-word', 'md-to-html', 'md-to-eml', 'docx-to-md', 'md-scaffold', 'dashboard-scaffold', 'nav-inject'];
  const VALIDATION = ['brain-qa', 'brain-qa-heir', 'audit', 'validate', 'converter-qa', 'markdown-lint'];
  const ANALYSIS = ['analyze', 'chart-recommend', 'data-profile', 'data-ingest'];
  const BUILD = ['build-extension', 'sync-architecture', 'install-hooks', 'new-skill'];

  function categorize(name) {
    const base = name.replace(/\.(cjs|js|ts|ps1)$/, '');
    if (CONVERTERS.some(c => base.includes(c))) return 'converter';
    if (VALIDATION.some(v => base.includes(v))) return 'validation';
    if (ANALYSIS.some(a => base.includes(a))) return 'analysis';
    if (BUILD.some(b => base.includes(b))) return 'build';
    return 'utility';
  }

  const results = [];
  const muscleExtensions = ['.cjs', '.js', '.ts', '.ps1'];
  const files = fs.readdirSync(musclesDir)
    .filter(f => muscleExtensions.some(ext => f.endsWith(ext)))
    .filter(f => !f.includes('.bak')); // Exclude backup files

  for (const file of files) {
    const filePath = path.join(musclesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lineCount = content.split("\n").length;
    const name = file;

    // Get language from extension
    const ext = path.extname(file);
    const lang = ext === '.ps1' ? 'ps' : ext === '.ts' ? 'ts' : 'js';

    // Get inheritance from @inheritance tag in file header
    const inh = getInheritanceFromHeader(content) === 'master-only' ? 1 : 0;

    // Check for well-documented code (header + inline comments)
    // Header: JSDoc block or PowerShell comment block
    const hasHeader = /^\/\*\*[\s\S]*?\*\//m.test(content) || /^<#[\s\S]*?#>/m.test(content);
    // Inline comments: at least 5 comment lines (// or #) throughout the code
    const inlineCommentCount = (content.match(/^\s*(\/\/|#(?!!))[^\n]*/gm) || []).length;
    const hasInlineComments = inlineCommentCount >= 5;
    const isWellDocumented = hasHeader && hasInlineComments;

    // Check for error handling and resiliency
    // JS: try/catch, .catch(), throw
    // PS: try/catch, $ErrorActionPreference, -ErrorAction, throw
    const jsErrorPatterns = /try\s*\{|\.catch\s*\(|catch\s*\(/i.test(content);
    const psErrorPatterns = /\$ErrorActionPreference|\-ErrorAction|try\s*\{/i.test(content);
    const hasErrorHandling = lang === 'ps' ? psErrorPatterns : jsErrorPatterns;

    // Check bounds (reasonable size: 50-1000 lines)
    const withinBounds = lineCount >= 50 && lineCount <= 1000;

    // Check cross-platform compatibility (Windows/macOS)
    // JS: use path.join/path.resolve, avoid hardcoded separators
    // PS: use Join-Path/Split-Path, avoid hardcoded separators
    let isCrossPlatform = false;
    if (lang === 'ps') {
      // PowerShell: must use Join-Path or Split-Path for path operations
      const usesPathCmdlets = /Join-Path|Split-Path|\$PSScriptRoot/i.test(content);
      const hasHardcodedSeparators = /['"][^'"]*\\[^'"]*['"]/.test(content) && !/\\n|\\r|\\t/.test(content);
      isCrossPlatform = usesPathCmdlets && !hasHardcodedSeparators;
    } else {
      // JS/TS: must use path module for path operations
      const usesPathModule = /path\.(join|resolve|dirname|basename|sep)/i.test(content);
      const hasHardcodedSeparators = /['"][^'"]*[\\/][^'"]*['"]/.test(content) && !/\\n|\\r|\\t|https?:|file:|\/\//.test(content);
      isCrossPlatform = usesPathModule || !hasHardcodedSeparators;
    }

    // Extract code review date (format: @reviewed YYYY-MM-DD or @lastReview YYYY-MM-DD)
    const reviewMatch = content.match(/@(?:reviewed|lastReview|review)\s*:?\s*(\d{4}-\d{2}-\d{2})/i);
    const reviewDate = reviewMatch ? reviewMatch[1] : null;

    // Extract standard metadata tags from header comment
    // Format: @tag value (with optional colon)
    // Handle both CRLF and LF line endings
    const extractTag = (tag) => {
      const match = content.match(new RegExp(`@${tag}\\s*:?\\s*(.+?)(?:\\r?\\n|\\*|$)`, 'i'));
      return match ? match[1].trim() : null;
    };
    
    const meta = {
      muscle: extractTag('muscle'),           // Canonical muscle name
      description: extractTag('description'), // What it does
      skill: extractTag('skill'),             // Linked skill name
      version: extractTag('version'),         // Version number
      platform: extractTag('platform'),       // Supported platforms (windows,macos,linux)
      requires: extractTag('requires'),       // External dependencies
      reviewed: extractTag('reviewed'),       // Code review date YYYY-MM-DD
    };
    
    // Check if muscle has standard header (all required tags present)
    // Required: @muscle, @description, @reviewed, @platform, @requires
    const hasStandardHeader = !!(meta.muscle && meta.description && meta.reviewed && meta.platform && meta.requires);

    // Get category
    const category = categorize(file);

    const flags = {
      comments: isWellDocumented ? 1 : 0,
      err: hasErrorHandling ? 1 : 0,
      bounds: withinBounds ? 1 : 0,
      compat: isCrossPlatform ? 1 : 0,
    };

    const score = flags.comments + flags.err + flags.bounds + flags.compat;
    // err is GATE - muscles without error handling are fragile
    const pass = flags.err === 1 && (score >= 3);

    results.push({ name, lines: lineCount, lang, category, inh, flags, score, maxScore: 4, pass, reviewDate, meta, hasStandardHeader });
  }

  return results.sort((a, b) => a.score - b.score);
}

// --- Generate Grid ---
function generateGrid() {
  const skills = scanSkills();
  const agents = scanAgents();
  const instructions = scanInstructions();
  const prompts = scanPrompts();
  const muscles = scanMuscles();

  const date = new Date().toISOString().split("T")[0];
  const lines = [];

  lines.push("# Brain Health Grid");
  lines.push("");
  lines.push(`Generated: ${date}`);
  lines.push("");
  lines.push("## Scoring Criteria");
  lines.push("");
  lines.push("Each dimension is scored **0** (defect) or **1** (good). Score = sum of dimensions.");
  lines.push("");
  lines.push("| Dim | Name | 1 (good) | 0 (defect) | Fix |");
  lines.push("|:---:|------|----------|------------|-----|");
  lines.push("| **fm** | Frontmatter | Has `name`, `description`, `applyTo`, and `tier` | Missing any required field | Auto |");
  lines.push("| **code** | Code Examples | Has pseudocode (excludes mermaid/ascii/diagrams) | No code blocks | Info |");
  lines.push(`| **bounds** | Bounds | ${MIN_SKILL_LINES}–${MAX_SKILL_LINES} lines | <${MIN_SKILL_LINES} (stub) or >${MAX_SKILL_LINES} (bloated) | Manual |`);
  lines.push("| **tri** | Trifecta | Not a workflow skill, OR has matching `.instructions.md` | Workflow skill missing instruction file | Manual |");
  lines.push("| **muscle** | Muscle | Has `.cjs`/`.js` script OR pseudocode `.md` in muscles/ | No automation component | Manual |");
  lines.push("");
  lines.push("## Modern Synapses");
  lines.push("");
  lines.push("Static `synapses.json` files are **deprecated**. Copilot's semantic search + these mechanisms replace connection graphs:");
  lines.push("");
  lines.push("| Mechanism | Where | Purpose |");
  lines.push("|-----------|-------|---------|");
  lines.push("| `applyTo` | Frontmatter | Pattern-based activation (e.g., `**/*.ts`) |");
  lines.push("| `description` | Frontmatter | Semantic matching by Copilot |");
  lines.push("| Trifecta naming | Convention | `skill-name` → `skill-name.instructions.md` |");
  lines.push("| `handoffs` | Agent files | Explicit routing to specialists |");
  lines.push("");
  lines.push("## Tier-Based Pass Thresholds");
  lines.push("");
  lines.push("\"Good is good enough\" — higher tiers require higher quality. Max score depends on skill type:");
  lines.push("- **Agentic** (tri+muscle): 4/4 (fm, bounds, tri, muscle)");
  lines.push("- **Intellectual** (tri only): 3/3 (fm, bounds, tri)");
  lines.push("");
  lines.push("| Tier | Allowed Defects | Rationale |");
  lines.push("|------|:---------------:|-----------|");
  lines.push("| **core** | 0 | Foundation skills must be perfect |");
  lines.push("| **standard** | 1 | One defect allowed |");
  lines.push("| **extended** | 2 | Two defects allowed |");
  lines.push("| **specialist** | 3 | Niche skills, three defects allowed |");
  lines.push("");
  lines.push("**Gate requirement**: `fm=1` is mandatory for all memory types. Without frontmatter, the file is **broken** (invisible to activation), not just low quality.");
  lines.push("");
  lines.push("## Skill Types");
  lines.push("");
  lines.push("| Type | Components | Nature | Example |");
  lines.push("|------|------------|--------|--------|");
  lines.push("| **Intellectual** | tri=1, muscle=0 | Reasoning, analysis, judgment — no action | code-review, security-review |");
  lines.push("| **Agentic** | tri=1, muscle=1 | Autonomous execution — knows AND does | md-to-word, brain-qa |");
  lines.push("");
  lines.push("**Informational columns** (not scored):");
  lines.push("| Col | Meaning | 1 | 0 |");
  lines.push("|:---:|---------|---|---|");
  lines.push("| **inh** | Inheritance | Master-only | Synced to heirs |");
  lines.push("| **stale** | Staleness | Needs regular review | Stable |");
  lines.push("| **sem** | Semantic Review | Reviewed post-synapse-cleanup | Pending review |");
  lines.push("");
  lines.push("> **Semantic Review (sem)**: One-time audit to verify each brain file is clear, coherent, and not damaged by synapse removal. Files marked 0 need manual review for: broken references, orphaned content, outdated patterns, or content that should be renewed/removed.");
  lines.push("");

  // Skills table
  lines.push("## Skills");
  lines.push("");
  lines.push("| Skill | Tier | Lines | fm | code | bounds | tri | muscle | Type | Score | Pass | inh | stale | sem |");
  lines.push("|-------|:----:|------:|:--:|:----:|:------:|:---:|:------:|:----:|------:|:----:|:---:|:-----:|:---:|");

  for (const s of skills) {
    const f = s.flags;
    const tierAbbr = s.tier.substring(0, 4);  // core, stan, exte, spec
    const passIcon = s.pass ? "✓" : "✗";
    // Type: A = Agentic (tri+muscle), I = Intellectual (tri only), - = incomplete
    const typeIcon = s.agentic ? "A" : (f.tri === 1 ? "I" : "-");
    // Preserve existing sem value if available, otherwise 0 (pending review)
    const sem = EXISTING_SEM.skills[s.name] ?? 0;
    // Link to SKILL.md file
    const nameLink = `[${s.name}](../skills/${s.name}/SKILL.md)`;
    const codeIcon = f.code ? '1' : '-';
    lines.push(`| ${nameLink} | ${tierAbbr} | ${s.lines} | ${f.fm} | ${codeIcon} | ${f.bounds} | ${f.tri} | ${f.muscle} | ${typeIcon} | ${s.score}/${s.threshold} | ${passIcon} | ${f.inh} | ${f.stale} | ${sem} |`);
  }

  // Skills summary - now using tier-based pass/fail
  const passing = skills.filter(s => s.pass).length;
  const failing = skills.filter(s => !s.pass).length;
  const perfect = skills.filter(s => s.score === s.maxScore).length;
  const agenticCount = skills.filter(s => s.agentic).length;
  const intellectualCount = skills.filter(s => s.flags.tri === 1 && s.flags.muscle === 0).length;

  // Defect counts per dimension
  const defects = {
    fm: skills.filter(s => s.flags.fm === 0).length,
    code: skills.filter(s => s.flags.code === 0).length,
    bounds: skills.filter(s => s.flags.bounds === 0).length,
    tri: skills.filter(s => s.flags.tri === 0).length,
    muscle: skills.filter(s => s.flags.muscle === 0).length,
  };

  lines.push("");
  lines.push(`**Summary**: ${skills.length} skills | Passing: ${passing} | Failing: ${failing} | Perfect: ${perfect}`);
  lines.push("");
  lines.push(`**Skill Types**: Agentic(A): ${agenticCount} | Intellectual(I): ${intellectualCount} | Incomplete(-): ${skills.length - agenticCount - intellectualCount}`);
  lines.push("");
  // Semantic review progress
  const skillsReviewed = skills.filter(s => (EXISTING_SEM.skills[s.name] ?? 0) === 1).length;
  const skillsPending = skills.length - skillsReviewed;
  lines.push(`**Semantic Review**: ${skillsReviewed}/${skills.length} reviewed | ${skillsPending} pending`);
  lines.push("");
  lines.push("**Defects by dimension (informational)**:");
  lines.push(`| fm | code | bounds | tri | muscle |`);
  lines.push(`|:--:|:----:|:------:|:---:|:------:|`);
  lines.push(`| ${defects.fm} | ${defects.code} | ${defects.bounds} | ${defects.tri} | ${defects.muscle} |`);
  lines.push("");

  // Agents table
  lines.push("## Agents");
  lines.push("");
  lines.push("**Scoring Criteria**:");
  lines.push("| Dim | Name | 1 (good) | 0 (defect) |");
  lines.push("|:---:|------|----------|------------|");
  lines.push("| **fm** | Frontmatter | Has `description`, `name`, `model`, `tools` | Missing any |");
  lines.push("| **handoffs** | Handoffs | Has `handoffs:` for agent orchestration | No handoffs |");
  lines.push(`| **bounds** | Bounds | ${MIN_AGENT_LINES}–${MAX_AGENT_LINES} lines | <${MIN_AGENT_LINES} (stub) or >${MAX_AGENT_LINES} (bloated) |`);
  lines.push("| **persona** | Persona | Has `## Mental Model`, `## Core Identity`, or similar | No persona section |");
  lines.push("| **code** | Examples | Has pseudocode, templates, or diagrams | No examples |");
  lines.push("");
  lines.push("> **Code policy**: Agent examples should use **pseudocode** (language-agnostic patterns), **templates** (markdown output formats), or **diagrams** (Mermaid). Avoid language-specific syntax — agents teach patterns, not syntax.");
  lines.push("");
  lines.push("> **Semantic Review (sem)**: Audit each agent for: clear persona, appropriate examples (pseudocode not language-specific), coherent structure. Files marked 0 need optimization.");
  lines.push("");
  lines.push("**Pass criteria**: fm=1 (gate) AND score ≥4/5");
  lines.push("");
  lines.push("| Agent | Lines | fm | handoffs | bounds | persona | code | Score | Pass | sem |");
  lines.push("|-------|------:|:--:|:--------:|:------:|:-------:|:----:|------:|:----:|:---:|");

  for (const a of agents) {
    const f = a.flags;
    const passIcon = a.pass ? "✓" : "✗";
    // Link to agent file
    const nameLink = `[${a.name}](../agents/${a.name}.agent.md)`;
    lines.push(`| ${nameLink} | ${a.lines} | ${f.fm} | ${f.handoffs} | ${f.bounds} | ${f.persona} | ${f.code} | ${a.score}/5 | ${passIcon} | ${a.sem} |`);
  }

  // Agents summary
  const agentsPassing = agents.filter(a => a.pass).length;
  const agentsFailing = agents.filter(a => !a.pass).length;
  const agentsPerfect = agents.filter(a => a.score === 5).length;
  const agentsReviewed = agents.filter(a => a.sem === 1).length;
  const agentsPending = agents.length - agentsReviewed;
  lines.push("");
  lines.push(`**Summary**: ${agents.length} agents | Passing: ${agentsPassing} | Failing: ${agentsFailing} | Perfect(5/5): ${agentsPerfect}`);
  lines.push(`**Semantic Review**: ${agentsReviewed}/${agents.length} reviewed | ${agentsPending} pending`);

  lines.push("");

  // Instructions table
  lines.push("## Instructions");
  lines.push("");
  lines.push("> **Design**: Instructions are **discoverable knowledge modules** that can serve multiple skills. Frontmatter enables routing without reading the full document.");
  lines.push("");
  lines.push("**Scoring Criteria**:");
  lines.push("| Dim | Name | 1 (good) | 0 (defect) |");
  lines.push("|:---:|------|----------|------------|");
  lines.push("| **fm** | Frontmatter | Has `description` AND `application` | Missing either |");
  lines.push("| **depth** | Depth | >50 lines | ≤50 lines |");
  lines.push("| **sect** | Sections | ≥2 `##` headers | Flat structure |");
  lines.push("| **code** | Code | Has code block | No examples |");
  lines.push("| **skill** | Trifecta | Has matching skill | Standalone instruction |");
  lines.push("");
  lines.push("> **Frontmatter fields**: `description` (what it does) + `application` (when/why to use). Optional: `applyTo` (Copilot file-pattern activation).");
  lines.push("");
  lines.push("**Pass criteria**: fm=1 (gate) AND score ≥3/5");
  lines.push("");
  lines.push("| Instruction | Lines | fm | depth | sect | code | skill | Score | Pass | sem |");
  lines.push("|-------------|------:|:--:|:-----:|:----:|:----:|:-----:|------:|:----:|:---:|");

  for (const i of instructions) {
    const f = i.flags;
    const passIcon = i.pass ? "✓" : "✗";
    // Preserve existing sem value if available, otherwise 0 (pending review)
    const sem = EXISTING_SEM.instructions[i.name] ?? 0;
    // Link to instruction file
    const nameLink = `[${i.name}](../instructions/${i.name}.instructions.md)`;
    lines.push(`| ${nameLink} | ${i.lines} | ${f.fm} | ${f.depth} | ${f.sect} | ${f.code} | ${f.skill} | ${i.score}/5 | ${passIcon} | ${sem} |`);
  }

  // Instructions summary
  const instrPassing = instructions.filter(i => i.pass).length;
  const instrFailing = instructions.filter(i => !i.pass).length;
  const instrPerfect = instructions.filter(i => i.score === 5).length;
  const instrReviewed = instructions.filter(i => (EXISTING_SEM.instructions[i.name] ?? 0) === 1).length;
  const instrPending = instructions.length - instrReviewed;
  lines.push("");
  lines.push(`**Summary**: ${instructions.length} instructions | Passing: ${instrPassing} | Failing: ${instrFailing} | Perfect(5/5): ${instrPerfect}`);
  lines.push("");
  lines.push(`**Semantic Review**: ${instrReviewed}/${instructions.length} reviewed | ${instrPending} pending`);

  lines.push("");

  // Prompts table
  lines.push("## Prompts");
  lines.push("");
  lines.push("> **Design**: Prompts are **agent-loaded workflows** — user says \"run brain-qa\" and the agent matches by name/description. `application` declares WHEN to suggest this workflow.");
  lines.push("");
  lines.push("**Scoring Criteria**:");
  lines.push("| Dim | Name | 1 (good) | 0 (defect) |");
  lines.push("|:---:|------|----------|------------|");
  lines.push("| **desc** | Description | Has `description:` in frontmatter | Missing description |");
  lines.push("| **app** | Application | Has `application:` with WHEN hint | Missing application |");
  lines.push("| **agent** | Agent Routing | Has `agent:` field | No agent routing |");
  lines.push("| **>20L** | Content | >20 lines | ≤20 lines (stub) |");
  lines.push("");
  lines.push("**Pass criteria**: desc=1 AND app=1 (gates) AND score ≥3/4");
  lines.push("");
  lines.push("| Prompt | Lines | desc | app | agent | >20L | Score | Pass |");
  lines.push("|--------|------:|:----:|:---:|:-----:|:----:|------:|:----:|");

  for (const p of prompts) {
    const f = p.flags;
    const passIcon = p.pass ? "✓" : "✗";
    // Link to prompt file
    const nameLink = `[${p.name}](../prompts/${p.name}.prompt.md)`;
    lines.push(`| ${nameLink} | ${p.lines} | ${f.desc} | ${f.app} | ${f.agent} | ${f.over20} | ${p.score}/4 | ${passIcon} |`);
  }

  // Prompts summary
  const promptsPassing = prompts.filter(p => p.pass).length;
  const promptsFailing = prompts.filter(p => !p.pass).length;
  const promptsPerfect = prompts.filter(p => p.score === 4).length;
  lines.push("");
  lines.push(`**Summary**: ${prompts.length} prompts | Passing: ${promptsPassing} | Failing: ${promptsFailing} | Perfect(4/4): ${promptsPerfect}`);

  // Prompts criterion validity
  const promptDescPass = prompts.filter(p => p.flags.desc === 1).length;
  const promptAppPass = prompts.filter(p => p.flags.app === 1).length;
  const promptAgentPass = prompts.filter(p => p.flags.agent === 1).length;
  const promptOver20Pass = prompts.filter(p => p.flags.over20 === 1).length;
  lines.push("");
  lines.push("### Criterion Validity");
  lines.push("");
  lines.push("| Criterion | Pass | Rate | Validity |");
  lines.push("|-----------|-----:|-----:|----------|");
  lines.push(`| desc | ${promptDescPass}/${prompts.length} | ${Math.round(promptDescPass/prompts.length*100)}% | ✓ Valid — required for discoverability |`);
  lines.push(`| app | ${promptAppPass}/${prompts.length} | ${Math.round(promptAppPass/prompts.length*100)}% | ✓ Valid — tells agent WHEN to suggest |`);
  lines.push(`| agent | ${promptAgentPass}/${prompts.length} | ${Math.round(promptAgentPass/prompts.length*100)}% | ✓ Valid — identifies routing prompts |`);
  lines.push(`| >20L | ${promptOver20Pass}/${prompts.length} | ${Math.round(promptOver20Pass/prompts.length*100)}% | ✓ Valid — identifies workflow content |`);

  lines.push("");

  // Muscles table
  lines.push("## Muscles");
  lines.push("");
  lines.push("> **Design**: Muscles are **execution scripts** that convert cognitive decisions into real-world output. Memory files define *what* and *how*; muscles *do*.");
  lines.push("");
  lines.push("**Scoring Criteria**:");
  lines.push("| Dim | Name | 1 (good) | 0 (defect) |");
  lines.push("|:---:|------|----------|------------|");
  lines.push("| **comments** | Well Documented | Header block + ≥5 inline comments | Missing header or insufficient comments |");
  lines.push("| **err** | Error Handling | try/catch, .catch(), $ErrorActionPreference | No error handling (fragile) |");
  lines.push("| **bounds** | Bounds | 50–1000 lines | <50 (stub) or >1000 (bloated) |");
  lines.push("| **compat** | Cross-Platform | path.join/Join-Path, no hardcoded separators | Hardcoded path separators |");
  lines.push("");
  lines.push("**Pass criteria**: err=1 (gate) AND score ≥3/4");
  lines.push("");
  lines.push("**Review Date**: Add `@reviewed: YYYY-MM-DD` comment to track code review currency.");
  lines.push("");
  lines.push("### Standard Muscle Header");
  lines.push("");
  lines.push("Muscles SHOULD use the standard header format for discoverability:");
  lines.push("");
  lines.push("```javascript");
  lines.push("#!/usr/bin/env node");
  lines.push("/**");
  lines.push(" * @muscle muscle-name");
  lines.push(" * @description What this muscle does");
  lines.push(" * @version 1.0.0");
  lines.push(" * @skill linked-skill-name");
  lines.push(" * @reviewed 2026-04-15");
  lines.push(" * @platform windows,macos,linux");
  lines.push(" * @requires pandoc, mermaid-cli");
  lines.push(" */");
  lines.push("```");
  lines.push("");
  lines.push("| Tag | Required | Purpose |");
  lines.push("|-----|:--------:|---------|");
  lines.push("| `@muscle` | ✓ | Canonical muscle name |");
  lines.push("| `@description` | ✓ | What it does (for search/display) |");
  lines.push("| `@version` | | Semantic version |");
  lines.push("| `@skill` | | Linked skill name for trifecta binding |");
  lines.push("| `@reviewed` | | Code review date (YYYY-MM-DD) |");
  lines.push("| `@platform` | | Supported platforms (windows,macos,linux) |");
  lines.push("| `@requires` | | External dependencies |");
  lines.push("");
  lines.push("| Muscle | Lines | Lang | Category | comments | err | bounds | compat | Score | Pass | inh | Reviewed |");
  lines.push("|--------|------:|:----:|----------|:--------:|:---:|:------:|:------:|------:|:----:|:---:|----------|");

  for (const m of muscles) {
    const f = m.flags;
    const passIcon = m.pass ? "✓" : "✗";
    const reviewedDate = m.reviewDate || "—";
    // Link to muscle file
    const nameLink = `[${m.name}](../muscles/${m.name})`;
    lines.push(`| ${nameLink} | ${m.lines} | ${m.lang} | ${m.category} | ${f.comments} | ${f.err} | ${f.bounds} | ${f.compat} | ${m.score}/4 | ${passIcon} | ${m.inh} | ${reviewedDate} |`);
  }

  // Muscles summary
  const musclesPassing = muscles.filter(m => m.pass).length;
  const musclesFailing = muscles.filter(m => !m.pass).length;
  const musclesPerfect = muscles.filter(m => m.score === 4).length;
  const musclesReviewed = muscles.filter(m => m.reviewDate).length;
  const musclesMasterOnly = muscles.filter(m => m.inh === 1).length;
  const musclesInheritable = muscles.filter(m => m.inh === 0).length;
  const musclesWithStdHeader = muscles.filter(m => m.hasStandardHeader).length;
  const musclesWithSkillLink = muscles.filter(m => m.meta && m.meta.skill).length;
  lines.push("");
  lines.push(`**Summary**: ${muscles.length} muscles | Passing: ${musclesPassing} | Failing: ${musclesFailing} | Perfect(4/4): ${musclesPerfect}`);
  lines.push("");
  lines.push(`**Inheritance**: Master-only(1): ${musclesMasterOnly} | Inheritable(0): ${musclesInheritable}`);
  lines.push("");
  lines.push(`**Metadata Adoption**: ${musclesWithStdHeader}/${muscles.length} have standard header | ${musclesWithSkillLink}/${muscles.length} linked to skills | ${musclesReviewed}/${muscles.length} have review dates`);

  // Muscles by category
  const categories = [...new Set(muscles.map(m => m.category))];
  const categoryStats = categories.map(cat => {
    const count = muscles.filter(m => m.category === cat).length;
    return `${cat}: ${count}`;
  }).join(' | ');
  lines.push("");
  lines.push(`**Categories**: ${categoryStats}`);

  // Overall summary
  const totalItems = skills.length + agents.length + instructions.length + prompts.length + muscles.length;
  lines.push("");
  lines.push("## Overall");
  lines.push("");
  lines.push(`| Category | Count |`);
  lines.push(`|----------|------:|`);
  lines.push(`| Skills | ${skills.length} |`);
  lines.push(`| Agents | ${agents.length} |`);
  lines.push(`| Instructions | ${instructions.length} |`);
  lines.push(`| Prompts | ${prompts.length} |`);
  lines.push(`| Muscles | ${muscles.length} |`);
  lines.push(`| **Total** | **${totalItems}** |`);

  return lines.join("\n");
}

// --- Main ---
const grid = generateGrid();

if (STDOUT_MODE) {
  console.log(grid);
} else {
  const outputPath = path.join(QUALITY_DIR, "brain-health-grid.md");
  fs.writeFileSync(outputPath, grid);
  console.log(`Brain health grid written to ${path.relative(ROOT, outputPath)}`);
}
