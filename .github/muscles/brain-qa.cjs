#!/usr/bin/env node
/**
 * Brain QA - Generates brain health quality grid
 * Location: .github/muscles/brain-qa.cjs
 * 
 * Single responsibility: Scan cognitive architecture, output quality grid.
 * Other trifectas handle fixing issues identified in the grid.
 * 
 * Dimensions (0 = defect, 1 = good):
 *   fm     - Frontmatter (applyTo, description) makes it visible to the brain
 *   code   - Has ≥1 fenced code block with language tag (code merit)
 *   bounds - Within line bounds (skills: 100-500, agents: 50-400)
 *   tri    - Trifecta complete (if workflow skill, has .instructions.md)
 *   muscle - Has automation component (script or pseudocode.md)
 *   inh    - Inheritance (1 = master-only, 0 = synced to heirs) [informational]
 *   stale  - Stale-prone (1 = needs regular review, 0 = stable) [informational]
 * 
 * Quality Philosophy:
 *   fm      → Visibility to the brain (discoverable via applyTo/description)
 *   code, bounds → Memory has structural merit
 *   tri + muscle → Goal for ANY skill (trifecta alignment + automation)
 * 
 * Skill Types:
 *   Intellectual Skill: Trifecta only (tri=1, muscle=0)
 *     - Requires thinking but no action (reasoning, analysis, judgment)
 *     - Examples: code-review, root-cause-analysis, security-review
 * 
 *   Agentic Skill: Trifecta + Muscle (tri=1, muscle=1)
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
 *   core      - 5/5 required (must be perfect)
 *   standard  - 4/5 required (one defect allowed)
 *   extended  - 3/5 required (two defects allowed)
 *   specialist- 2/5 required (three defects allowed)
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

  // Parse Skills table: | skill-name | ... | inh | stale | sem |
  // Table format: | name | tier | lines | fm | code | bounds | tri | muscle | Type | Score | Pass | inh | stale | sem |
  const skillsSection = content.match(/## Skills[\s\S]*?(?=## Agents|## Instructions|$)/);
  if (skillsSection) {
    const skillRows = skillsSection[0].matchAll(/^\| ([\w-]+) \| \w+ \| \d+ \|.*\| (\d) \|$/gm);
    for (const match of skillRows) {
      const name = match[1];
      const sem = parseInt(match[2], 10);
      semValues.skills[name] = sem;
    }
  }

  // Parse Agents table: | agent-name | lines | ... | sem |
  const agentsSection = content.match(/## Agents[\s\S]*?(?=## Instructions|## Prompts|## Overall|$)/);
  if (agentsSection) {
    const agentRows = agentsSection[0].matchAll(/^\| ([\w-]+) \| \d+ \|.*\| (\d) \|$/gm);
    for (const match of agentRows) {
      const name = match[1];
      const sem = parseInt(match[2], 10);
      semValues.agents[name] = sem;
    }
  }

  // Parse Instructions table: | instruction-name | lines | ... | sem |
  const instrSection = content.match(/## Instructions[\s\S]*?(?=## Prompts|## Overall|$)/);
  if (instrSection) {
    const instrRows = instrSection[0].matchAll(/^\| ([\w-]+) \| \d+ \|.*\| (\d) \|$/gm);
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

    // Check code blocks
    const hasCode = /```\w+/.test(content);

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

    // Score: sum of scored flags (max 5)
    const score = flags.fm + flags.code + flags.bounds + flags.tri + flags.muscle;

    // Tier-based pass/fail - fm is a GATE (broken without frontmatter)
    const threshold = getPassThreshold(tier);
    const pass = fmComplete && (score >= threshold);

    // Agentic = trifecta + muscle (autonomous execution capability)
    // Intellectual skills have tri=1, muscle=0 (reasoning without action)
    const agentic = triComplete && hasMuscle;

    results.push({ name, lines, flags, score, tier, threshold, pass, isWorkflow, agentic });
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

    // Check code examples
    const hasCode = /```\w+/.test(content);

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

    // Check code examples
    const hasCode = /```\w+/.test(content);

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
    const flags = {
      desc: hasDesc ? 1 : 0,
      agent: /^agent:/m.test(content) ? 1 : 0,
      over20: lines > 20 ? 1 : 0,
    };

    const score = flags.desc + flags.agent + flags.over20;
    // desc is a GATE - prompts without description won't be discoverable
    const pass = hasDesc && (score >= 2);
    results.push({ name, lines, flags, score, maxScore: 3, pass });
  }

  return results.sort((a, b) => a.score - b.score);
}

// --- Generate Grid ---
function generateGrid() {
  const skills = scanSkills();
  const agents = scanAgents();
  const instructions = scanInstructions();
  const prompts = scanPrompts();

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
  lines.push("| **code** | Code Examples | Has ≥1 fenced code block with language tag | No code blocks | Manual |");
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
  lines.push("\"Good is good enough\" — higher tiers require higher quality:");
  lines.push("");
  lines.push("| Tier | Min Score | Rationale |");
  lines.push("|------|:---------:|-----------|");
  lines.push("| **core** | 5/5 | Foundation skills must be perfect |");
  lines.push("| **standard** | 4/5 | One defect allowed |");
  lines.push("| **extended** | 3/5 | Two defects allowed |");
  lines.push("| **specialist** | 2/5 | Niche skills, three defects allowed |");
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
    lines.push(`| ${s.name} | ${tierAbbr} | ${s.lines} | ${f.fm} | ${f.code} | ${f.bounds} | ${f.tri} | ${f.muscle} | ${typeIcon} | ${s.score}/${s.threshold} | ${passIcon} | ${f.inh} | ${f.stale} | ${sem} |`);
  }

  // Skills summary - now using tier-based pass/fail
  const passing = skills.filter(s => s.pass).length;
  const failing = skills.filter(s => !s.pass).length;
  const perfect = skills.filter(s => s.score === 5).length;
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
  lines.push(`**Summary**: ${skills.length} skills | Passing: ${passing} | Failing: ${failing} | Perfect(5/5): ${perfect}`);
  lines.push("");
  lines.push(`**Skill Types**: Agentic(A): ${agenticCount} | Intellectual(I): ${intellectualCount} | Incomplete(-): ${skills.length - agenticCount - intellectualCount}`);
  lines.push("");
  // Semantic review progress
  const skillsReviewed = skills.filter(s => (EXISTING_SEM.skills[s.name] ?? 0) === 1).length;
  const skillsPending = skills.length - skillsReviewed;
  lines.push(`**Semantic Review**: ${skillsReviewed}/${skills.length} reviewed | ${skillsPending} pending`);
  lines.push("");
  lines.push("**Defects by dimension**:");
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
    lines.push(`| ${a.name} | ${a.lines} | ${f.fm} | ${f.handoffs} | ${f.bounds} | ${f.persona} | ${f.code} | ${a.score}/5 | ${passIcon} | ${a.sem} |`);
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
    lines.push(`| ${i.name} | ${i.lines} | ${f.fm} | ${f.depth} | ${f.sect} | ${f.code} | ${f.skill} | ${i.score}/5 | ${passIcon} | ${sem} |`);
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
  lines.push("**Scoring Criteria**:");
  lines.push("| Dim | Name | 1 (good) | 0 (defect) |");
  lines.push("|:---:|------|----------|------------|");
  lines.push("| **desc** | Description | Has `description:` in frontmatter | Missing description |");
  lines.push("| **agent** | Agent Routing | Has `agent:` field | No agent routing |");
  lines.push("| **>20L** | Content | >20 lines | ≤20 lines (stub) |");
  lines.push("");
  lines.push("**Pass criteria**: desc=1 (gate) AND score ≥2/3");
  lines.push("");
  lines.push("| Prompt | Lines | desc | agent | >20L | Score | Pass |");
  lines.push("|--------|------:|:----:|:-----:|:----:|------:|:----:|");

  for (const p of prompts) {
    const f = p.flags;
    const passIcon = p.pass ? "✓" : "✗";
    lines.push(`| ${p.name} | ${p.lines} | ${f.desc} | ${f.agent} | ${f.over20} | ${p.score}/3 | ${passIcon} |`);
  }

  // Prompts summary
  const promptsPassing = prompts.filter(p => p.pass).length;
  const promptsFailing = prompts.filter(p => !p.pass).length;
  const promptsPerfect = prompts.filter(p => p.score === 3).length;
  lines.push("");
  lines.push(`**Summary**: ${prompts.length} prompts | Passing: ${promptsPassing} | Failing: ${promptsFailing} | Perfect(3/3): ${promptsPerfect}`);

  // Prompts criterion validity
  const promptDescPass = prompts.filter(p => p.flags.desc === 1).length;
  const promptAgentPass = prompts.filter(p => p.flags.agent === 1).length;
  const promptOver20Pass = prompts.filter(p => p.flags.over20 === 1).length;
  lines.push("");
  lines.push("### Criterion Validity");
  lines.push("");
  lines.push("| Criterion | Pass | Rate | Validity |");
  lines.push("|-----------|-----:|-----:|----------|");
  lines.push(`| desc | ${promptDescPass}/${prompts.length} | ${Math.round(promptDescPass/prompts.length*100)}% | ✓ Valid — required for discoverability |`);
  lines.push(`| agent | ${promptAgentPass}/${prompts.length} | ${Math.round(promptAgentPass/prompts.length*100)}% | ✓ Valid — identifies routing prompts |`);
  lines.push(`| >20L | ${promptOver20Pass}/${prompts.length} | ${Math.round(promptOver20Pass/prompts.length*100)}% | ✓ Valid — identifies workflow content |`);

  // Overall summary
  const totalItems = skills.length + agents.length + instructions.length + prompts.length;
  lines.push("## Overall");
  lines.push("");
  lines.push(`| Category | Count |`);
  lines.push(`|----------|------:|`);
  lines.push(`| Skills | ${skills.length} |`);
  lines.push(`| Agents | ${agents.length} |`);
  lines.push(`| Instructions | ${instructions.length} |`);
  lines.push(`| Prompts | ${prompts.length} |`);
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
