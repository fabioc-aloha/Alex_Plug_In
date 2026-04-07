#!/usr/bin/env node
// Brain QA (Heir) - Semantic validation for deployed Alex heir instances
// Location: .github/muscles/brain-qa-heir.cjs (inheritable, renamed to brain-qa.cjs in heir)
// Skill: brain-qa
//
// This is the heir-specific version. It omits master-only phases:
//   5 (Master-Heir Skill Sync), 7 (Synapse File Sync), 8 (Index Sync),
//   13 (Instructions/Prompts Sync), 26 (alex_docs/), 27 (M365 Heir),
//   28 (Codespaces Heir), 29 (GK Sync)
// Phase numbers are preserved for cross-reference consistency with master.

"use strict";

const fs = require("fs");
const path = require("path");

// ─── Argument parsing ───────────────────────────────────────
const args = process.argv.slice(2);
let mode = "all";
let phaseFilter = null;
let fix = false;
let quiet = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--fix") fix = true;
  else if (a === "--quiet") quiet = true;
  else if (a === "--mode" && args[i + 1]) mode = args[++i];
  else if (a === "--phase" && args[i + 1]) {
    phaseFilter = args[++i].split(",").map(Number);
  } else if (["all", "quick", "schema", "llm"].includes(a)) mode = a;
}

// ─── Paths ──────────────────────────────────────────────────
const rootPath = path.resolve(__dirname, "..", "..");
const ghPath = path.join(rootPath, ".github");

if (!fs.existsSync(ghPath)) {
  console.error(`ERROR: .github not found at ${ghPath}`);
  process.exit(1);
}

// ─── Colour helpers ─────────────────────────────────────────
const R = "\x1b[31m",
  G = "\x1b[32m",
  Y = "\x1b[33m",
  C = "\x1b[36m";
const GR = "\x1b[90m",
  X = "\x1b[0m";

const issues = [];
const warnings = [];
const fixed = [];

function writePhase(n, name) {
  if (!quiet) console.log(`  ${C}[${n}] ${name}${X}`);
}
function pass(msg) {
  if (!quiet) console.log(`  ${G}[OK] ${msg}${X}`);
}
function warn(msg) {
  if (!quiet) console.log(`  ${Y}[WARN] ${msg}${X}`);
  warnings.push(msg);
}
function fail(msg) {
  if (!quiet) console.log(`  ${R}[ERROR] ${msg}${X}`);
  issues.push(msg);
}

// ─── Phase groups ───────────────────────────────────────────
const heirPhases = [
  1, 2, 3, 4, 6, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  30, 31, 32, 34,
];
const quickPhases = [1, 2, 3, 4, 6];
const schemaPhases = [2, 6, 11, 16, 17];
const llmPhases = [10, 20, 21];

let runPhases;
switch (mode) {
  case "quick":
    runPhases = quickPhases;
    break;
  case "schema":
    runPhases = schemaPhases;
    break;
  case "llm":
    runPhases = llmPhases;
    break;
  default:
    runPhases = heirPhases;
}
if (phaseFilter) runPhases = phaseFilter.filter((p) => heirPhases.includes(p));

if (!quiet)
  console.log(
    `${GR}Brain QA (Heir) — Mode: ${mode} | Phases: ${runPhases.join(",")}${X}`,
  );

// ─── Utility functions ──────────────────────────────────────
function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function dirs(p) {
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function files(p, ext) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter((f) => !ext || f.endsWith(ext));
}

function findRecursive(dir, test) {
  const result = [];
  if (!fs.existsSync(dir)) return result;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) result.push(...findRecursive(full, test));
    else if (test(e.name)) result.push(full);
  }
  return result;
}

// ════════════════════════════════════════════════════════════
// PHASE 1: Synapse Target Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(1)) {
  writePhase(1, "Synapse Target Validation");
  const broken = new Set();
  for (const f of findRecursive(ghPath, (n) => n === "synapses.json")) {
    const j = readJSON(f);
    if (!j || !j.connections) continue;
    const sourceDir = path.dirname(f);
    for (const conn of j.connections) {
      const t = conn.target;
      if (
        !t ||
        /^(external:|global-knowledge:\/\/|https?:\/\/|mailto:)/.test(t)
      )
        continue;
      let fullPath;
      if (/^\.github\/|^[A-Z].*\.md$/.test(t))
        fullPath = path.join(rootPath, t);
      else if (t.startsWith("../")) fullPath = path.resolve(sourceDir, t);
      else fullPath = path.join(sourceDir, t);
      if (!fs.existsSync(fullPath)) broken.add(t);
    }
  }
  if (broken.size === 0) pass("All synapse targets valid");
  else [...broken].sort().forEach((b) => fail(`Broken: ${b}`));
}

// ════════════════════════════════════════════════════════════
// PHASE 2: Inheritance Centralization Check
// ════════════════════════════════════════════════════════════
if (runPhases.includes(2)) {
  writePhase(2, "Inheritance Centralization Check");
  const stale = dirs(path.join(ghPath, "skills")).filter((skill) => {
    const syn = path.join(ghPath, "skills", skill, "synapses.json");
    if (!fs.existsSync(syn)) return false;
    const j = readJSON(syn);
    return j && j.inheritance;
  });
  if (stale.length === 0)
    pass(
      "No skills have stale inheritance field (centralized in sync-architecture.cjs)",
    );
  else
    fail(
      `Stale inheritance field in synapses.json (should be removed): ${stale.join(", ")}`,
    );
}

// ════════════════════════════════════════════════════════════
// PHASE 3: Skill Index Coverage
// ════════════════════════════════════════════════════════════
if (runPhases.includes(3)) {
  writePhase(3, "Skill Index Coverage");
  const skillDirs = dirs(path.join(ghPath, "skills"));
  const indexPath = path.join(
    ghPath,
    "skills",
    "memory-activation",
    "SKILL.md",
  );
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, "utf8");
    const notIndexed = skillDirs.filter(
      (s) => s !== "memory-activation" && !indexContent.includes(`${s} |`),
    );
    if (notIndexed.length === 0) pass(`All ${skillDirs.length} skills indexed`);
    else fail(`Not indexed: ${notIndexed.join(", ")}`);
  } else {
    warn("memory-activation/SKILL.md not found");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 4: Trigger Semantic Analysis
// ════════════════════════════════════════════════════════════
if (runPhases.includes(4)) {
  writePhase(4, "Trigger Semantic Analysis");
  const indexPath = path.join(
    ghPath,
    "skills",
    "memory-activation",
    "SKILL.md",
  );
  if (fs.existsSync(indexPath)) {
    const triggers = {};
    for (const line of fs.readFileSync(indexPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\|\s*([a-z-]+)\s*\|\s*(.+?)\s*\|$/);
      if (m) {
        for (const kw of m[2].split(",").map((k) => k.trim())) {
          if (triggers[kw]) triggers[kw] += `,${m[1]}`;
          else triggers[kw] = m[1];
        }
      }
    }
    const overlaps = Object.entries(triggers).filter(([, v]) =>
      v.includes(","),
    );
    if (overlaps.length === 0) pass("No trigger overlaps");
    else {
      overlaps.forEach(([k, v]) => warn(`Overlap '${k}': ${v}`));
      pass("Review overlaps - shared triggers may be intentional");
    }
  }
}

// Phases 5, 7, 8 skipped — master-only

// ════════════════════════════════════════════════════════════
// PHASE 6: Synapse Schema Format Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(6)) {
  writePhase(6, "Synapse Schema Format Validation");
  const critical = new Set();
  const info = [];
  for (const skill of dirs(path.join(ghPath, "skills"))) {
    const synPath = path.join(ghPath, "skills", skill, "synapses.json");
    if (!fs.existsSync(synPath)) continue;
    const content = fs.readFileSync(synPath, "utf8");
    if (/"strength":\s*"(High|Medium|Critical|Low)"/.test(content))
      critical.add(skill);
    if (!content.includes('"$schema"')) critical.add(skill);
    if (
      /"synapses":\s*\[/.test(content) &&
      !/"connections":\s*\[/.test(content)
    )
      info.push(skill);
  }
  if (critical.size === 0) pass("Schema validation passed");
  else fail(`Schema issues: ${[...critical].join(", ")}`);
  if (info.length > 0)
    warn(
      `Legacy array name (works but prefer 'connections'): ${info.join(", ")}`,
    );
}

// ════════════════════════════════════════════════════════════
// PHASE 9: Catalog Accuracy Validation (Heir: count-only)
// ════════════════════════════════════════════════════════════
if (runPhases.includes(9)) {
  writePhase(9, "Catalog Accuracy Validation");
  const actualSkills = dirs(path.join(ghPath, "skills")).length;
  pass(`Heir has ${actualSkills} skills deployed`);
}

// ════════════════════════════════════════════════════════════
// PHASE 10: Core File Token Budget
// ════════════════════════════════════════════════════════════
if (runPhases.includes(10)) {
  writePhase(10, "Core File Token Budget");
  const budgetWarnings = [];
  const coreFile = path.join(ghPath, "copilot-instructions.md");
  if (fs.existsSync(coreFile)) {
    const content = fs.readFileSync(coreFile, "utf8");
    const lineCount = content.split("\n").length;
    const charCount = content.length;
    if (lineCount > 500)
      budgetWarnings.push(
        `copilot-instructions.md is ${lineCount} lines (${charCount} chars) - consider trimming`,
      );
    if (/[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]/.test(content))
      budgetWarnings.push(
        "copilot-instructions.md contains ASCII box-drawing art (use Mermaid or tables)",
      );
  }
  if (budgetWarnings.length === 0) pass("Core files within token budget");
  else budgetWarnings.forEach((w) => warn(w));
}

// ════════════════════════════════════════════════════════════
// PHASE 11: Boilerplate Skill Descriptions
// ════════════════════════════════════════════════════════════
if (runPhases.includes(11)) {
  writePhase(11, "Boilerplate Skill Descriptions");
  const boilerplate = dirs(path.join(ghPath, "skills")).filter((skill) => {
    const skillMd = path.join(ghPath, "skills", skill, "SKILL.md");
    return (
      fs.existsSync(skillMd) &&
      /description:\s*"Skill for alex .+ skill"/.test(
        fs.readFileSync(skillMd, "utf8"),
      )
    );
  });
  if (boilerplate.length === 0) pass("No boilerplate descriptions");
  else warn(`Boilerplate (${boilerplate.length}): ${boilerplate.join(", ")}`);
}

// ════════════════════════════════════════════════════════════
// PHASE 12: Reset Validation (Self-Check)
// ════════════════════════════════════════════════════════════
if (runPhases.includes(12)) {
  writePhase(12, "Reset Validation (Self-Check)");
  const resetIssues = [];

  const profilePath = path.join(ghPath, "config", "user-profile.json");
  if (fs.existsSync(profilePath)) {
    const prof = readJSON(profilePath);
    if (prof && prof.name && prof.name !== "")
      resetIssues.push("user-profile.json has non-empty name (PII leak)");
    if (prof && prof.nickname && prof.nickname !== "")
      resetIssues.push("user-profile.json has non-empty nickname (PII leak)");
  }
  if (
    !fs.existsSync(path.join(ghPath, "config", "user-profile.template.json"))
  ) {
    resetIssues.push("user-profile.template.json missing");
  }

  const copilotPath = path.join(ghPath, "copilot-instructions.md");
  if (fs.existsSync(copilotPath)) {
    const copilot = fs.readFileSync(copilotPath, "utf8");
    if (!copilot.includes("## Identity"))
      resetIssues.push("Missing Identity section (v3 format)");
    if (!copilot.includes("## Active Context"))
      resetIssues.push("Missing Active Context section");
    if (/Focus Trifectas:\s*master-heir-management/.test(copilot))
      resetIssues.push("Focus Trifectas has master-only values");
    if (/Fabio|Correa|Calefato|Cardoso/.test(copilot))
      resetIssues.push("Found hardcoded names in copilot-instructions.md");
  }

  if (resetIssues.length === 0)
    pass("Architecture properly reset for deployment");
  else resetIssues.forEach((r) => fail(r));
}

// Phase 13 skipped — master-only

// ════════════════════════════════════════════════════════════
// PHASE 14: Agents Structure Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(14)) {
  writePhase(14, "Agents Structure Validation");
  const agentIssues = [];
  const agentsDir = path.join(ghPath, "agents");
  const agents = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"))
    : [];
  if (agents.length === 0) agentIssues.push("No agents found");
  else {
    for (const a of agents) {
      const content = fs.readFileSync(path.join(agentsDir, a), "utf8");
      if (!content.startsWith("---"))
        agentIssues.push(`${a}: Missing YAML frontmatter`);
      if (!content.includes("name:"))
        agentIssues.push(`${a}: Missing name field`);
    }
  }
  if (agentIssues.length === 0) pass(`Agents valid (${agents.length} agents)`);
  else agentIssues.forEach((a) => fail(a));
}

// ════════════════════════════════════════════════════════════
// PHASE 15: Config Files Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(15)) {
  writePhase(15, "Config Files Validation");
  const required = [
    "user-profile.template.json",
    "cognitive-config-template.json",
  ];
  const masterOnly = [
    "MASTER-ALEX-PROTECTED.json",
    "cognitive-config.json",
    "user-profile.json",
  ];
  const configIssues = [];
  const cfgDir = path.join(ghPath, "config");

  for (const cfg of required) {
    const p = path.join(cfgDir, cfg);
    if (!fs.existsSync(p)) configIssues.push(`Missing: ${cfg}`);
    else if (cfg.endsWith(".json") && !readJSON(p))
      configIssues.push(`Invalid JSON: ${cfg}`);
  }
  for (const cfg of masterOnly) {
    if (fs.existsSync(path.join(cfgDir, cfg)))
      configIssues.push(`Master-only file leaked: ${cfg}`);
  }

  if (configIssues.length === 0) pass("Config files valid");
  else configIssues.forEach((c) => fail(c));
}

// ════════════════════════════════════════════════════════════
// PHASE 16: Skill YAML Frontmatter Compliance
// ════════════════════════════════════════════════════════════
if (runPhases.includes(16)) {
  writePhase(16, "Skill YAML Frontmatter Compliance");
  const fmIssues = [];
  for (const skill of dirs(path.join(ghPath, "skills"))) {
    const skillMd = path.join(ghPath, "skills", skill, "SKILL.md");
    if (!fs.existsSync(skillMd)) continue;
    const content = fs.readFileSync(skillMd, "utf8");
    if (!/^---\s*\n/.test(content)) {
      fmIssues.push(`${skill} - Missing YAML frontmatter`);
    } else {
      const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
      if (fmMatch) {
        const fm = fmMatch[1];
        if (!/name:\s*['"]?[\w-]+/.test(fm))
          fmIssues.push(`${skill} - Missing 'name' in frontmatter`);
        if (!/description:\s*['"]?.+/.test(fm))
          fmIssues.push(`${skill} - Missing 'description' in frontmatter`);
      }
    }
  }
  if (fmIssues.length === 0) pass("All skills have valid YAML frontmatter");
  else fmIssues.forEach((f) => fail(f));
}

// ════════════════════════════════════════════════════════════
// PHASE 17: Internal Skills User-Invokable Check
// ════════════════════════════════════════════════════════════
if (runPhases.includes(17)) {
  writePhase(17, "Internal Skills User-Invokable Check");
  const internalSkills = ["memory-activation"];
  const viIssues = [];
  for (const skill of internalSkills) {
    const skillMd = path.join(ghPath, "skills", skill, "SKILL.md");
    if (fs.existsSync(skillMd)) {
      if (!/user-invokable:\s*false/.test(fs.readFileSync(skillMd, "utf8"))) {
        viIssues.push(`${skill} should have user-invokable: false`);
      }
    }
  }
  if (viIssues.length === 0) pass("Internal skills properly hidden");
  else viIssues.forEach((v) => warn(v));
}

// ════════════════════════════════════════════════════════════
// PHASE 18: Agent Handoffs Completeness
// ════════════════════════════════════════════════════════════
if (runPhases.includes(18)) {
  writePhase(18, "Agent Handoffs Completeness");
  const handoffIssues = [];
  const agentsDir = path.join(ghPath, "agents");
  const agents = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"))
    : [];
  for (const a of agents) {
    const content = fs.readFileSync(path.join(agentsDir, a), "utf8");
    if (a === "alex.agent.md" && !content.includes("handoffs:")) {
      handoffIssues.push("alex.agent.md - Missing handoffs section");
    } else if (
      a !== "alex.agent.md" &&
      content.includes("handoffs:") &&
      !/agent:\s*Alex/.test(content)
    ) {
      handoffIssues.push(`${a} - No return-to-Alex handoff`);
    }
    if (content.includes("handoffs:")) {
      if (!content.includes("label:"))
        handoffIssues.push(`${a} - Handoff missing 'label'`);
      if (!content.includes("agent:"))
        handoffIssues.push(`${a} - Handoff missing 'agent'`);
    }
  }
  if (handoffIssues.length === 0) pass("Agent handoffs valid");
  else handoffIssues.forEach((h) => warn(h));
}

// ════════════════════════════════════════════════════════════
// PHASE 19: Instruction ApplyTo Pattern Coverage
// ════════════════════════════════════════════════════════════
if (runPhases.includes(19)) {
  writePhase(19, "Instruction ApplyTo Pattern Coverage");
  const shouldHaveApplyTo = [
    "dream-state-automation.instructions.md",
    "embedded-synapse.instructions.md",
    "empirical-validation.instructions.md",
    "lucid-dream-integration.instructions.md",
    "protocol-triggers.instructions.md",
  ];
  const atIssues = [];
  const instrDir = path.join(ghPath, "instructions");
  if (fs.existsSync(instrDir)) {
    for (const name of shouldHaveApplyTo) {
      const f = path.join(instrDir, name);
      if (
        fs.existsSync(f) &&
        !fs.readFileSync(f, "utf8").includes("applyTo:")
      ) {
        atIssues.push(`${name} - Missing applyTo pattern`);
      }
    }
  }
  if (atIssues.length === 0) pass("Instruction applyTo patterns present");
  else atIssues.forEach((a) => warn(a));
}

// ════════════════════════════════════════════════════════════
// PHASE 20: LLM-First Content Format Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(20)) {
  writePhase(20, "LLM-First Content Format Validation");
  const formatWarnings = [];
  const patterns = [
    path.join(ghPath, "copilot-instructions.md"),
    ...findRecursive(path.join(ghPath, "agents"), (n) => n.endsWith(".md")),
  ];
  for (const f of patterns) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, "utf8");
    const name = path.basename(f);
    if (/[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]/.test(content)) {
      formatWarnings.push(
        `${name} - Contains box-drawing ASCII art (Mermaid or tables preferred)`,
      );
    }
    if (content.split("\n").filter((l) => /^\s*[│↓↑<\->]/.test(l)).length > 5) {
      formatWarnings.push(
        `${name} - Heavy use of ASCII arrows (structured format preferred)`,
      );
    }
  }
  if (formatWarnings.length === 0) pass("Content formats are LLM-friendly");
  else formatWarnings.forEach((w) => warn(w));
}

// ════════════════════════════════════════════════════════════
// PHASE 21: Emoji Semantic Consistency
// ════════════════════════════════════════════════════════════
if (runPhases.includes(21)) {
  writePhase(21, "Emoji Semantic Consistency");
  let emojiCount = 0;
  const agentsDir = path.join(ghPath, "agents");
  if (fs.existsSync(agentsDir)) {
    for (const a of fs
      .readdirSync(agentsDir)
      .filter((f) => f.endsWith(".md"))) {
      const content = fs.readFileSync(path.join(agentsDir, a), "utf8");
      for (const e of ["[OK]", "[ERROR]", "[WARN]"]) {
        emojiCount += (
          content.match(new RegExp(e.replace(/[[\]]/g, "\\$&"), "g")) || []
        ).length;
      }
    }
  }
  pass(`Semantic markers in agents: ${emojiCount}`);
}

// ════════════════════════════════════════════════════════════
// PHASE 22: Episodic Archive Health
// ════════════════════════════════════════════════════════════
if (runPhases.includes(22)) {
  writePhase(22, "Episodic Archive Health");
  const epDir = path.join(ghPath, "episodic");
  if (fs.existsSync(epDir)) {
    const allEp = fs.readdirSync(epDir).filter((f) => f.endsWith(".md"));
    const dreams = allEp.filter((f) => /^dream-report-|^dream-/.test(f));
    const meds = allEp.filter((f) => f.startsWith("meditation-"));
    const selfAct = allEp.filter((f) => f.startsWith("self-actualization-"));
    pass(
      `Episodic files: ${allEp.length} total (${dreams.length} dreams, ${meds.length} meditations, ${selfAct.length} self-actualizations)`,
    );

    const legacy = allEp.filter((f) => f.endsWith(".prompt.md"));
    if (legacy.length > 0)
      warn(`Episodic has ${legacy.length} legacy .prompt.md files`);

    const undated = allEp.filter(
      (f) => !/\d{4}-\d{2}-\d{2}/.test(f) && f !== ".markdownlint.json",
    );
    if (undated.length > 0)
      warn(`Episodic has ${undated.length} undated files`);
  } else {
    pass("No episodic/ folder (normal for fresh installs)");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 23: .github/ Assets Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(23)) {
  writePhase(23, ".github/ Assets Validation");
  const assetsPath = path.join(ghPath, "assets");
  if (fs.existsSync(assetsPath)) {
    const allFiles = fs.readdirSync(assetsPath);
    const hasBanner = allFiles.some((f) => f.startsWith("banner."));
    if (!hasBanner) fail("Missing banner asset (banner.svg or banner.png)");
    else pass("Banner asset present");
    const svgs = allFiles.filter((f) => f.endsWith(".svg")).length;
    const pngs = allFiles.filter((f) => f.endsWith(".png")).length;
    pass(`Assets: ${allFiles.length} files (${svgs} SVG, ${pngs} PNG)`);
  } else {
    warn(".github/assets/ not found");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 24: Issue & PR Templates
// ════════════════════════════════════════════════════════════
if (runPhases.includes(24)) {
  writePhase(24, "Issue & PR Templates");
  const itDir = path.join(ghPath, "ISSUE_TEMPLATE");
  if (fs.existsSync(itDir)) {
    const templates = fs.readdirSync(itDir).filter((f) => f.endsWith(".md"));
    pass(`Issue templates present (${templates.length} templates)`);
  } else {
    pass("No ISSUE_TEMPLATE/ (normal for heir deployments)");
  }
  if (fs.existsSync(path.join(ghPath, "pull_request_template.md")))
    pass("PR template present");
  else pass("No PR template (normal for heir deployments)");
}

// ════════════════════════════════════════════════════════════
// PHASE 25: .github/ Root Files Completeness
// ════════════════════════════════════════════════════════════
if (runPhases.includes(25)) {
  writePhase(25, ".github/ Root Files Completeness");
  const rootFiles = ["copilot-instructions.md"];
  const missingRoot = rootFiles.filter(
    (f) => !fs.existsSync(path.join(ghPath, f)),
  );
  if (missingRoot.length > 0)
    missingRoot.forEach((m) => fail(`Missing .github/ root file: ${m}`));
  else pass(`All .github/ root files present (${rootFiles.length} files)`);

  const expectedDirs = [
    "agents",
    "config",
    "episodic",
    "instructions",
    "muscles",
    "prompts",
    "skills",
    "assets",
  ];
  const missingDirs = expectedDirs.filter(
    (d) => !fs.existsSync(path.join(ghPath, d)),
  );
  if (missingDirs.length > 0)
    missingDirs.forEach((m) => warn(`Missing .github/ subfolder: ${m}`));
  else pass(`All .github/ subfolders present (${expectedDirs.length} folders)`);
}

// Phases 26-29 skipped — master-only

// ════════════════════════════════════════════════════════════
// PHASE 30: Muscles Integrity
// ════════════════════════════════════════════════════════════
if (runPhases.includes(30)) {
  writePhase(30, "Muscles Integrity");
  const musclesDir = path.join(ghPath, "muscles");
  const expectedMuscles = [
    "brain-qa.ps1",
    "dream-cli.ts",
    "fix-fence-bug.ps1",
    "gamma-generator.cjs",
    "normalize-paths.ps1",
    "pptxgen-cli.ts",
    "validate-skills.ps1",
    "validate-synapses.ps1",
  ];
  const missingMuscles = expectedMuscles.filter(
    (m) => !fs.existsSync(path.join(musclesDir, m)),
  );
  if (missingMuscles.length > 0)
    missingMuscles.forEach((m) => fail(`Missing muscle: ${m}`));
  else pass(`All heir muscles present (${expectedMuscles.length})`);
}

// ════════════════════════════════════════════════════════════
// PHASE 31: Version Consistency
// ════════════════════════════════════════════════════════════
if (runPhases.includes(31)) {
  writePhase(31, "Version Consistency");
  let currentVersion = "unknown";

  const configPath = path.join(ghPath, "config", "cognitive-config.json");
  const ciPath = path.join(ghPath, "copilot-instructions.md");

  if (fs.existsSync(configPath)) {
    const config = readJSON(configPath);
    if (config && config.version) {
      currentVersion = config.version;
      pass(`Version from cognitive-config.json: ${currentVersion}`);
    }
  } else if (fs.existsSync(ciPath)) {
    const m = fs.readFileSync(ciPath, "utf8").match(/# Alex v(\d+\.\d+\.\d+)/);
    if (m) {
      currentVersion = m[1];
      pass(`Version from copilot-instructions.md: ${currentVersion}`);
    } else warn("Could not determine version");
  } else {
    warn("No version source found");
  }

  if (currentVersion !== "unknown" && fs.existsSync(ciPath)) {
    const ciMatch = fs
      .readFileSync(ciPath, "utf8")
      .match(/# Alex v(\d+\.\d+\.\d+)/);
    if (ciMatch && ciMatch[1] !== currentVersion) {
      warn(
        `copilot-instructions.md version (${ciMatch[1]}) != cognitive-config.json (${currentVersion})`,
      );
    } else if (ciMatch) {
      pass("Version consistent across config files");
    }
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 32: Prefrontal Cortex Evolution Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(32)) {
  writePhase(32, "Prefrontal Cortex Evolution Validation");
  const ciPath = path.join(ghPath, "copilot-instructions.md");
  if (fs.existsSync(ciPath)) {
    const ciContent = fs.readFileSync(ciPath, "utf8");

    if (!ciContent.includes("## Identity"))
      fail("copilot-instructions.md missing ## Identity section");
    else pass("Identity section present");

    // Agent list vs disk
    const agentFiles = fs.existsSync(path.join(ghPath, "agents"))
      ? fs
          .readdirSync(path.join(ghPath, "agents"))
          .filter((f) => f.endsWith(".agent.md"))
      : [];
    const diskAgents = [
      "Alex",
      ...agentFiles
        .map((f) => f.replace(/\.agent\.md$/, "").replace(/^alex-?/, ""))
        .filter(Boolean),
    ].sort();

    const agentMatch = ciContent.match(
      /(?:^|\n)## Agents\s*\n([\s\S]*?)(?=\n## |\n$|$)/m,
    );
    if (agentMatch) {
      const agentLine =
        agentMatch[1]
          .split("\n")
          .filter((l) => l.trim() && !l.trim().startsWith("<!--"))
          .shift() || "";
      const listed = agentLine
        .split(",")
        .map((a) => a.split("(")[0].trim())
        .filter(Boolean)
        .sort();
      const diskLower = diskAgents.map((a) => a.toLowerCase());
      const listedLower = listed.map((a) => a.toLowerCase());
      const missing = diskAgents.filter(
        (a) => !listedLower.includes(a.toLowerCase()),
      );
      const extra = listed.filter((a) => !diskLower.includes(a.toLowerCase()));
      if (missing.length > 0)
        warn(
          `Agents on disk but NOT in copilot-instructions: ${missing.join(", ")}`,
        );
      if (extra.length > 0)
        warn(
          `Agents in copilot-instructions but NOT on disk: ${extra.join(", ")}`,
        );
      if (missing.length === 0 && extra.length === 0)
        pass(`Agent list matches disk (${diskAgents.length} agents)`);
    } else {
      warn("Could not parse Agents section from copilot-instructions.md");
    }

    // Trifecta validation (simplified — no instruction/prompt alias matching in heir)
    const trifMatch = ciContent.match(/Complete trifectas \((\d+)\):\s*(.+)/);
    if (trifMatch) {
      const listedCount = parseInt(trifMatch[1], 10);
      const listedNames = trifMatch[2].split(",").map((s) => s.trim());
      const missingSkills = listedNames.filter(
        (n) => !fs.existsSync(path.join(ghPath, "skills", n)),
      );
      if (listedCount !== listedNames.length)
        warn(
          `Trifecta count (${listedCount}) doesn't match listed names (${listedNames.length})`,
        );
      else if (missingSkills.length > 0)
        warn(
          `Listed trifectas missing skill directories: ${missingSkills.join(", ")}`,
        );
      else pass(`All ${listedCount} listed trifectas have skill directories`);
    } else {
      warn("Could not parse trifecta list from copilot-instructions.md");
    }

    if (!ciContent.includes("## Active Context"))
      fail("copilot-instructions.md missing ## Active Context section");
    else pass("Active Context section present");
    if (!ciContent.includes("## User Profile"))
      fail("copilot-instructions.md missing ## User Profile section");
    else pass("User Profile section present");
  } else {
    fail("copilot-instructions.md not found");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 34: Brain Self-Containment Check
// ════════════════════════════════════════════════════════════
if (runPhases.includes(34)) {
  writePhase(34, "Brain Self-Containment Check");
  const scExceptions = ["episodic", "SUPPORT.md"];
  const scIssues = [];

  function isExcepted(shortPath) {
    return scExceptions.some((exc) => shortPath.includes(exc));
  }

  function testSelfContained(sourceFile, target) {
    if (!target || target.trim() === "") return null;
    if (/^(https?:\/\/|#|mailto:|external:|global-knowledge:\/\/)/.test(target))
      return null;
    if (target.startsWith(".github/")) return null;
    if (!/[/\\]/.test(target) && !/\./.test(target)) return null;
    if (/^[a-zA-Z]:\\|^\//.test(target)) return target;
    const resolved = path.resolve(path.dirname(sourceFile), target);
    if (resolved.toLowerCase().startsWith(ghPath.toLowerCase())) return null;
    return target;
  }

  // 1. Synapse targets
  for (const f of findRecursive(ghPath, (n) => n === "synapses.json")) {
    try {
      const j = readJSON(f);
      if (!j || !j.connections) continue;
      for (const conn of j.connections) {
        const escaped = testSelfContained(f, conn.target);
        if (escaped !== null) {
          const short = f.replace(ghPath + path.sep, "");
          if (!isExcepted(short))
            scIssues.push(`[synapse] ${short} -> ${escaped}`);
        }
      }
    } catch {
      /* skip */
    }
  }

  // 2. Markdown link targets
  const linkRx = /\[([^\]]*)\]\(([^)]+)\)/g;
  for (const f of findRecursive(ghPath, (n) => n.endsWith(".md"))) {
    const short = f.replace(ghPath + path.sep, "");
    if (isExcepted(short)) continue;
    let content = fs.readFileSync(f, "utf8");
    const rawContent = content;
    content = content.replace(/```[\s\S]*?```/g, "");
    content = content.replace(/`[^`]+`/g, "");
    let m;
    while ((m = linkRx.exec(content)) !== null) {
      const href = m[2];
      if (/^(https?:\/\/|#|mailto:)/.test(href)) continue;
      const escaped = testSelfContained(f, href);
      if (escaped !== null) scIssues.push(`[md-link] ${short} -> ${escaped}`);
    }
    if (/\.\.\/\//.test(rawContent)) scIssues.push(`[..// typo] ${short}`);
  }

  const synapseCount = findRecursive(
    ghPath,
    (n) => n === "synapses.json",
  ).length;
  const mdCount = findRecursive(ghPath, (n) => n.endsWith(".md")).length;
  if (scIssues.length === 0)
    pass(
      `Brain is fully self-contained (${synapseCount} synapse files, ${mdCount} markdown files scanned)`,
    );
  else scIssues.forEach((i) => fail(i));
}

// ════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════
console.log(`\n${C}========================================${X}`);
console.log(`${C} BRAIN QA (HEIR) SUMMARY${X}`);
console.log(`${C}========================================${X}`);

if (fixed.length > 0) {
  console.log(`\n${G}FIXED (${fixed.length}):${X}`);
  fixed.forEach((f) => console.log(`  ${G}[OK] ${f}${X}`));
}

if (warnings.length > 0) {
  console.log(`\n${Y}WARNINGS (${warnings.length}):${X}`);
  warnings.forEach((w) => console.log(`  ${Y}[WARN] ${w}${X}`));
}

if (issues.length > 0) {
  console.log(`\n${R}ISSUES (${issues.length}):${X}`);
  issues.forEach((i) => console.log(`  ${R}[ERROR] ${i}${X}`));
}

if (issues.length === 0 && warnings.length === 0) {
  console.log(`\n${G}[OK] All heir phases passed!${X}`);
}

process.exit(issues.length > 0 ? 1 : 0);
