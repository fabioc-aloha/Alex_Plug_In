#!/usr/bin/env node
// Brain QA - Deep semantic validation of Alex cognitive architecture
// Location: .github/muscles/brain-qa.cjs (master-only)
// Cross-platform port of brain-qa.ps1
// Skill: brain-qa

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

// ─── Argument parsing ───────────────────────────────────────
const args = process.argv.slice(2);
let mode = "all";
let phaseFilter = null;
let fix = false;
let skipSync = false;
let detail = false;
let quiet = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--fix") fix = true;
  else if (a === "--skip-sync") skipSync = true;
  else if (a === "--detail") detail = true;
  else if (a === "--quiet") quiet = true;
  else if (a === "--mode" && args[i + 1]) mode = args[++i];
  else if (a === "--phase" && args[i + 1]) {
    phaseFilter = args[++i].split(",").map(Number);
  } else if (["all", "quick", "sync", "schema", "llm"].includes(a)) mode = a;
}

// ─── Paths ──────────────────────────────────────────────────
const rootPath = path.resolve(__dirname, "..", "..");
const ghPath = path.join(rootPath, ".github");
const heirBase = path.join(rootPath, "platforms", "vscode-extension");

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
  M = "\x1b[35m",
  X = "\x1b[0m";

const issues = [];
const warnings = [];
const fixed = [];

function writePhase(n, name) {
  if (!quiet) console.log(`  ${C}[${n}] ${name}${X}`);
}
function pass(msg) {
  if (detail && !quiet) console.log(`  ${G}[OK] ${msg}${X}`);
}
function warn(msg) {
  if (detail && !quiet) console.log(`  ${Y}[WARN] ${msg}${X}`);
  warnings.push(msg);
}
function fail(msg) {
  if (!quiet) console.log(`  ${R}[ERROR] ${msg}${X}`);
  issues.push(msg);
}

// ─── Phase groups ───────────────────────────────────────────
const quickPhases = [1, 2, 3, 4, 5, 6];
const syncPhases = [5, 7, 8, 13, 14, 15, 27, 28, 33, 34];
const schemaPhases = [2, 6, 11, 16, 17];
const llmPhases = [10, 20, 21];

let runPhases;
switch (mode) {
  case "quick":
    runPhases = quickPhases;
    break;
  case "sync":
    runPhases = syncPhases;
    break;
  case "schema":
    runPhases = schemaPhases;
    break;
  case "llm":
    runPhases = llmPhases;
    break;
  default:
    runPhases = Array.from({ length: 35 }, (_, i) => i + 1);
}
if (phaseFilter) runPhases = phaseFilter;

if (!quiet)
  console.log(
    `${GR}Brain QA — Mode: ${mode} | Phases: ${runPhases.join(",")} | Use --detail for verbose output${X}`,
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

function fileHash(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

function grepFiles(dir, nameRx, contentRx) {
  return findRecursive(dir, (n) => nameRx.test(n)).filter((f) =>
    contentRx.test(fs.readFileSync(f, "utf8")),
  );
}

function setDiff(a, b) {
  const bs = new Set(b);
  return a.filter((x) => !bs.has(x));
}

function readHead(filePath, lines) {
  const content = fs.readFileSync(filePath, "utf8");
  return content.split(/\r?\n/).slice(0, lines);
}

// ─── PRE-SYNC ───────────────────────────────────────────────
const needsSync = (mode === "all" || mode === "sync") && !skipSync;
if (needsSync) {
  if (!quiet)
    console.log(`  ${M}[Pre-Sync] Master -> Heir Synchronization${X}`);

  const syncScript = path.join(ghPath, "muscles", "sync-architecture.cjs");
  if (fs.existsSync(syncScript)) {
    try {
      execSync(`node "${syncScript}"`, {
        cwd: rootPath,
        stdio: detail ? "inherit" : "pipe",
      });
      pass("Architecture synchronized");
    } catch (e) {
      warn(`sync-architecture.cjs returned exit code ${e.status || "unknown"}`);
    }
  } else {
    warn("sync-architecture.cjs not found");
  }

  if (!quiet) console.log(`   ${M}Synapse sync...${X}`);
  const heirSkillsDir = path.join(heirBase, ".github", "skills");
  if (fs.existsSync(heirSkillsDir)) {
    // Detect master-only skills
    const masterOnlySkills = dirs(path.join(ghPath, "skills")).filter(
      (s) => !fs.existsSync(path.join(heirSkillsDir, s)),
    );

    let synapseSyncCount = 0;
    for (const skill of dirs(heirSkillsDir)) {
      const masterSyn = path.join(ghPath, "skills", skill, "synapses.json");
      const heirSyn = path.join(heirSkillsDir, skill, "synapses.json");
      if (fs.existsSync(masterSyn) && fs.existsSync(heirSyn)) {
        if (fileHash(masterSyn) !== fileHash(heirSyn)) {
          const mj = readJSON(masterSyn);
          if (mj && mj.connections) {
            mj.connections = mj.connections.filter(
              (c) =>
                !masterOnlySkills.some(
                  (mo) => c.target && c.target.includes(mo),
                ),
            );
            fs.writeFileSync(heirSyn, JSON.stringify(mj, null, 2) + "\n");
            synapseSyncCount++;
          }
        }
      }
    }
    if (synapseSyncCount > 0)
      pass(`Synced ${synapseSyncCount} synapse file(s)`);
    else pass("All synapses already in sync");
  }
} else if (skipSync && !quiet) {
  console.log(`  ${Y}[Pre-Sync] SKIPPED (--skip-sync flag)${X}`);
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
  const stale = [];
  for (const skill of dirs(path.join(ghPath, "skills"))) {
    const syn = path.join(ghPath, "skills", skill, "synapses.json");
    if (fs.existsSync(syn)) {
      const j = readJSON(syn);
      if (j && j.inheritance) stale.push(skill);
    }
  }
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
    const lines = fs.readFileSync(indexPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\|\s*([a-z-]+)\s*\|\s*(.+?)\s*\|$/);
      if (m) {
        const skill = m[1];
        for (const kw of m[2].split(",").map((k) => k.trim())) {
          if (triggers[kw]) triggers[kw] += `,${skill}`;
          else triggers[kw] = skill;
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

// ════════════════════════════════════════════════════════════
// PHASE 5: Master-Heir Skill Sync
// ════════════════════════════════════════════════════════════
if (runPhases.includes(5)) {
  writePhase(5, "Master-Heir Skill Sync");
  const heirSkillsDir = path.join(heirBase, ".github", "skills");
  if (fs.existsSync(heirSkillsDir)) {
    const master = dirs(path.join(ghPath, "skills")).sort();
    const heir = dirs(heirSkillsDir).sort();
    pass(`Master: ${master.length} skills | Heir: ${heir.length} skills`);
    const missingInHeir = setDiff(master, heir);
    const extraInHeir = setDiff(heir, master);
    if (missingInHeir.length > 0)
      warn(`Missing in heir: ${missingInHeir.join(", ")}`);
    if (extraInHeir.length > 0)
      warn(`Extra in heir: ${extraInHeir.join(", ")}`);
    if (missingInHeir.length === 0 && extraInHeir.length === 0)
      pass("Skill directories match");
  } else {
    warn("Heir folder not found - skipping sync check");
  }
}

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
    // Case-sensitive check for deprecated capitalized strength
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
// PHASE 7: Synapse File Sync
// ════════════════════════════════════════════════════════════
if (runPhases.includes(7)) {
  writePhase(7, "Synapse File Sync");
  const heirSkillsDir = path.join(heirBase, ".github", "skills");
  if (fs.existsSync(heirSkillsDir)) {
    const masterOnlySkills = dirs(path.join(ghPath, "skills")).filter(
      (s) => !fs.existsSync(path.join(heirSkillsDir, s)),
    );

    const diffs = [];
    for (const skill of dirs(path.join(ghPath, "skills"))) {
      const mSyn = path.join(ghPath, "skills", skill, "synapses.json");
      const hSyn = path.join(heirSkillsDir, skill, "synapses.json");
      if (fs.existsSync(mSyn) && fs.existsSync(hSyn)) {
        if (fileHash(mSyn) !== fileHash(hSyn)) {
          const mj = readJSON(mSyn);
          const hj = readJSON(hSyn);
          if (mj && hj) {
            mj.connections = (mj.connections || []).filter(
              (c) =>
                !masterOnlySkills.some(
                  (mo) => c.target && c.target.includes(mo),
                ),
            );
            const expectedNorm = JSON.stringify(mj);
            const heirNorm = JSON.stringify(hj);
            if (expectedNorm !== heirNorm) {
              diffs.push(skill);
              if (fix) {
                fs.writeFileSync(hSyn, JSON.stringify(mj, null, 2) + "\n");
                fixed.push(`Synced ${skill}/synapses.json`);
              }
            }
          }
        }
      }
    }
    if (diffs.length === 0) pass("All synapses in sync");
    else fail(`Out of sync: ${diffs.join(", ")}`);
  } else {
    warn("Heir folder not found - skipping sync check");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 8: Memory-Activation Index Sync
// ════════════════════════════════════════════════════════════
if (runPhases.includes(8)) {
  writePhase(8, "Memory-Activation Index Sync");
  const masterIdx = path.join(
    ghPath,
    "skills",
    "memory-activation",
    "SKILL.md",
  );
  const heirIdx = path.join(
    heirBase,
    ".github",
    "skills",
    "memory-activation",
    "SKILL.md",
  );
  if (fs.existsSync(masterIdx) && fs.existsSync(heirIdx)) {
    if (fileHash(masterIdx) === fileHash(heirIdx)) pass("Index in sync");
    else {
      fail("Index out of sync");
      if (fix) {
        fs.copyFileSync(masterIdx, heirIdx);
        fixed.push("Synced memory-activation/SKILL.md");
      }
    }
  } else {
    warn("Heir memory-activation not found");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 9: Catalog Accuracy Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(9)) {
  writePhase(9, "Catalog Accuracy Validation");
  const actual = dirs(path.join(ghPath, "skills")).length;
  const catPath = path.join(
    rootPath,
    "alex_docs",
    "skills",
    "SKILLS-CATALOG.md",
  );
  if (fs.existsSync(catPath)) {
    const content = fs.readFileSync(catPath, "utf8");
    const m = content.match(/## Skill Count:\s*(\d+)/);
    if (m) {
      const catCount = parseInt(m[1], 10);
      if (actual === catCount) pass(`Catalog count accurate: ${actual} skills`);
      else
        fail(`Count mismatch: Catalog says ${catCount}, actual is ${actual}`);
    } else {
      warn("Could not parse skill count from catalog");
    }
  } else {
    warn("SKILLS-CATALOG.md not found");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 10: Core File Token Budget
// ════════════════════════════════════════════════════════════
if (runPhases.includes(10)) {
  writePhase(10, "Core File Token Budget");
  const budgetWarnings = [];
  const coreFiles = [
    path.join(ghPath, "copilot-instructions.md"),
    path.join(heirBase, ".github", "copilot-instructions.md"),
  ];
  for (const f of coreFiles) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, "utf8");
    const lineCount = content.split("\n").length;
    const charCount = content.length;
    const id = path.basename(path.dirname(f)) + "/" + path.basename(f);
    if (lineCount > 500) {
      budgetWarnings.push(
        `${id} is ${lineCount} lines (${charCount} chars) - consider trimming (auto-loaded every session)`,
      );
    }
    if (/[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]/.test(content)) {
      budgetWarnings.push(
        `${id} contains ASCII box-drawing art (use Mermaid or tables instead)`,
      );
    }
  }
  if (budgetWarnings.length === 0) pass("Core files within token budget");
  else budgetWarnings.forEach((w) => warn(w));
}

// ════════════════════════════════════════════════════════════
// PHASE 11: Boilerplate Skill Descriptions
// ════════════════════════════════════════════════════════════
if (runPhases.includes(11)) {
  writePhase(11, "Boilerplate Skill Descriptions");
  const boilerplate = [];
  for (const skill of dirs(path.join(ghPath, "skills"))) {
    const skillMd = path.join(ghPath, "skills", skill, "SKILL.md");
    if (fs.existsSync(skillMd)) {
      const content = fs.readFileSync(skillMd, "utf8");
      if (/description:\s*"Skill for alex .+ skill"/.test(content))
        boilerplate.push(skill);
    }
  }
  if (boilerplate.length === 0) pass("No boilerplate descriptions");
  else warn(`Boilerplate (${boilerplate.length}): ${boilerplate.join(", ")}`);
}

// ════════════════════════════════════════════════════════════
// PHASE 12: Heir Reset Validation (Pre-Publish)
// ════════════════════════════════════════════════════════════
if (runPhases.includes(12)) {
  writePhase(12, "Heir Reset Validation (Pre-Publish)");
  const heirGh = path.join(heirBase, ".github");
  if (fs.existsSync(heirGh)) {
    const resetIssues = [];

    const profilePath = path.join(heirGh, "config", "user-profile.json");
    if (fs.existsSync(profilePath)) {
      const prof = readJSON(profilePath);
      if (prof && prof.name && prof.name !== "")
        resetIssues.push("user-profile.json has non-empty name (PII leak)");
      if (prof && prof.nickname && prof.nickname !== "")
        resetIssues.push("user-profile.json has non-empty nickname (PII leak)");
    }
    if (
      !fs.existsSync(path.join(heirGh, "config", "user-profile.template.json"))
    ) {
      resetIssues.push(
        "user-profile.template.json missing (needed for runtime profile creation)",
      );
    }

    const copilotPath = path.join(heirGh, "copilot-instructions.md");
    if (fs.existsSync(copilotPath)) {
      const copilot = fs.readFileSync(copilotPath, "utf8");
      if (!copilot.includes("## Identity"))
        resetIssues.push("Missing Identity section (v3 format)");
      if (!copilot.includes("## Active Context"))
        resetIssues.push("Missing Active Context section");
      if (/Focus Trifectas:\s*master-heir-management/.test(copilot))
        resetIssues.push("Focus Trifectas has master-only values");
      if (/Last Assessed:\s*\d{4}-/.test(copilot))
        resetIssues.push('Last Assessed should be "never" in heir');
      if (/Fabio|Correa|Calefato|Cardoso/.test(copilot))
        resetIssues.push("Found hardcoded names in copilot-instructions.md");
    }

    if (resetIssues.length === 0) pass("Heir properly reset for publication");
    else resetIssues.forEach((r) => fail(r));
  } else {
    warn("Heir .github not found");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 13: Instructions/Prompts Sync
// ════════════════════════════════════════════════════════════
if (runPhases.includes(13)) {
  writePhase(13, "Instructions/Prompts Sync");
  const excludedTypes = ["master-only", "heir:m365"];

  function getExcludedByFrontmatter(dir) {
    const excluded = [];
    if (!fs.existsSync(dir)) return excluded;
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".md"))) {
      const head = readHead(path.join(dir, f), 10);
      if (head[0] === "---") {
        for (let i = 1; i < head.length; i++) {
          if (head[i] === "---") break;
          const m = head[i].match(/^\s*inheritance:\s*['"]?([^'"]+)['"]?\s*$/);
          if (m && excludedTypes.includes(m[1].trim())) {
            excluded.push(f);
            break;
          }
        }
      }
    }
    return excluded;
  }

  const moInstr = getExcludedByFrontmatter(path.join(ghPath, "instructions"));
  const moPrompts = getExcludedByFrontmatter(path.join(ghPath, "prompts"));
  const heirInstrDir = path.join(heirBase, ".github", "instructions");
  const heirPromptDir = path.join(heirBase, ".github", "prompts");

  if (fs.existsSync(heirInstrDir)) {
    const mi = files(path.join(ghPath, "instructions"), ".md")
      .filter((f) => !moInstr.includes(f))
      .sort();
    const hi = files(heirInstrDir, ".md").sort();
    const mp = files(path.join(ghPath, "prompts"), ".md")
      .filter((f) => !moPrompts.includes(f))
      .sort();
    const hp = files(heirPromptDir, ".md").sort();

    const missing = [];
    setDiff(mi, hi).forEach((f) => missing.push(`instructions/${f}`));
    setDiff(mp, hp).forEach((f) => missing.push(`prompts/${f}`));

    if (missing.length === 0) pass("Instructions/Prompts in sync");
    else {
      fail(`Missing from heir: ${missing.join(", ")}`);
      if (fix) {
        for (const m of missing) {
          const src = path.join(ghPath, m);
          const dst = path.join(heirBase, ".github", m);
          fs.copyFileSync(src, dst);
          fixed.push(`Synced ${m}`);
        }
      }
    }
  } else {
    warn("Heir instructions folder not found");
  }
}

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

  const heirAgentsDir = path.join(heirBase, ".github", "agents");
  if (fs.existsSync(heirAgentsDir)) {
    const ma = agents.sort();
    const ha = fs
      .readdirSync(heirAgentsDir)
      .filter((f) => f.endsWith(".md"))
      .sort();
    if (ma.length !== ha.length)
      agentIssues.push(
        `Agent count mismatch: Master=${ma.length}, Heir=${ha.length}`,
      );
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
  const heirCfg = path.join(heirBase, ".github", "config");

  for (const cfg of required) {
    const p = path.join(heirCfg, cfg);
    if (!fs.existsSync(p)) configIssues.push(`Missing: ${cfg}`);
    else if (cfg.endsWith(".json") && !readJSON(p))
      configIssues.push(`Invalid JSON: ${cfg}`);
  }
  for (const cfg of masterOnly) {
    if (fs.existsSync(path.join(heirCfg, cfg)))
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
      const content = fs.readFileSync(skillMd, "utf8");
      if (!/user-invokable:\s*false/.test(content))
        viIssues.push(`${skill} should have user-invokable: false`);
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
      if (fs.existsSync(f)) {
        if (!fs.readFileSync(f, "utf8").includes("applyTo:")) {
          atIssues.push(`${name} - Missing applyTo pattern`);
        }
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
    const arrowLines = content
      .split("\n")
      .filter((l) => /^\s*[│↓↑<\->]/.test(l));
    if (arrowLines.length > 5) {
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
    const dreams = allEp.filter(
      (f) => f.startsWith("dream-report-") || f.startsWith("dream-"),
    );
    const meds = allEp.filter((f) => f.startsWith("meditation-"));
    const selfAct = allEp.filter((f) => f.startsWith("self-actualization-"));
    pass(
      `Episodic files: ${allEp.length} total (${dreams.length} dreams, ${meds.length} meditations, ${selfAct.length} self-actualizations)`,
    );

    const legacyPrompts = allEp.filter((f) => f.endsWith(".prompt.md"));
    if (legacyPrompts.length > 0) {
      fail(
        `Episodic has ${legacyPrompts.length} legacy .prompt.md files - archive to archive/upgrades/`,
      );
    }

    const undated = allEp.filter(
      (f) => !/\d{4}-\d{2}-\d{2}/.test(f) && f !== ".markdownlint.json",
    );
    if (undated.length > 0)
      warn(`Episodic has ${undated.length} undated files`);

    const invalidNames = allEp.filter(
      (f) =>
        f !== ".markdownlint.json" &&
        !/^(dream-report-|dream-|meditation-|self-actualization-|session-|chronicle-)/.test(
          f,
        ),
    );
    if (invalidNames.length > 0) {
      fail(
        `Episodic has ${invalidNames.length} files with non-standard naming`,
      );
    }
  } else {
    pass("No episodic/ folder (normal for heirs)");
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
    for (const expected of ["bug_report.md", "feature_request.md"]) {
      if (!fs.existsSync(path.join(itDir, expected)))
        warn(`Missing issue template: ${expected}`);
    }
    pass(
      `Issue templates present (${fs.readdirSync(itDir).filter((f) => f.endsWith(".md")).length} templates)`,
    );
  } else {
    warn("ISSUE_TEMPLATE/ not found");
  }
  if (fs.existsSync(path.join(ghPath, "pull_request_template.md")))
    pass("PR template present");
  else warn("pull_request_template.md not found");
}

// ════════════════════════════════════════════════════════════
// PHASE 25: .github/ Root Files Completeness
// ════════════════════════════════════════════════════════════
if (runPhases.includes(25)) {
  writePhase(25, ".github/ Root Files Completeness");
  const rootFiles = ["copilot-instructions.md", "README.md"];
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
    "ISSUE_TEMPLATE",
  ];
  const missingDirs = expectedDirs.filter(
    (d) => !fs.existsSync(path.join(ghPath, d)),
  );
  if (missingDirs.length > 0)
    missingDirs.forEach((m) => warn(`Missing .github/ subfolder: ${m}`));
  else pass(`All .github/ subfolders present (${expectedDirs.length} folders)`);
}

// ════════════════════════════════════════════════════════════
// PHASE 26: alex_docs/ Architecture Docs Freshness
// ════════════════════════════════════════════════════════════
if (runPhases.includes(26)) {
  writePhase(26, "alex_docs/ Architecture Docs Freshness");
  const docsPath = path.join(rootPath, "alex_docs");
  if (fs.existsSync(docsPath)) {
    const archPath = path.join(docsPath, "architecture");
    const expected = [
      "TRIFECTA-CATALOG.md",
      "COGNITIVE-ARCHITECTURE.md",
      "MEMORY-SYSTEMS.md",
      "NEUROANATOMICAL-MAPPING.md",
      "AGENT-CATALOG.md",
    ];
    const missing = expected.filter(
      (d) => !fs.existsSync(path.join(archPath, d)),
    );
    if (missing.length > 0)
      missing.forEach((m) => fail(`Missing architecture doc: ${m}`));

    if (fs.existsSync(archPath)) {
      const staleVersions = [];
      for (const f of fs
        .readdirSync(archPath)
        .filter((f) => f.endsWith(".md"))) {
        const content = fs.readFileSync(path.join(archPath, f), "utf8");
        if (/Alex v[23]\.\d+\.\d+/.test(content))
          staleVersions.push(`${f} references pre-v5 Alex version`);
      }
      if (staleVersions.length > 0) staleVersions.forEach((s) => warn(s));
    }

    const catPath = path.join(docsPath, "skills", "SKILLS-CATALOG.md");
    if (fs.existsSync(catPath)) {
      const content = fs.readFileSync(catPath, "utf8");
      const masterCount = findRecursive(
        path.join(ghPath, "skills"),
        (n) => n === "SKILL.md",
      ).length;
      const m = content.match(
        /(?:Skill Count[:\s]+|Total[^\n]*?)(\d+)\s*skills?/i,
      );
      if (m) {
        const catCount = parseInt(m[1], 10);
        if (catCount !== masterCount)
          warn(
            `SKILLS-CATALOG.md says ${catCount} skills, actual: ${masterCount}`,
          );
        else pass(`SKILLS-CATALOG.md count matches (${masterCount})`);
      }
    }

    if (missing.length === 0) pass("Architecture docs present");
  } else {
    warn("alex_docs/ folder not found (expected in master)");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 27: M365 Heir Health
// ════════════════════════════════════════════════════════════
if (runPhases.includes(27)) {
  writePhase(27, "M365 Heir Health");
  const m365Path = path.join(rootPath, "platforms", "m365-copilot");
  if (fs.existsSync(m365Path)) {
    const m365Pkg = readJSON(path.join(m365Path, "package.json"));
    const vscPkg = readJSON(
      path.join(rootPath, "platforms", "vscode-extension", "package.json"),
    );
    if (m365Pkg && vscPkg && m365Pkg.version !== vscPkg.version) {
      warn(
        `M365 heir version (${m365Pkg.version}) != VS Code heir (${vscPkg.version})`,
      );
    } else if (m365Pkg && vscPkg) {
      pass(`M365 heir version aligned (${m365Pkg.version})`);
    }

    const m365Required = [
      "teamsapp.yml",
      path.join("appPackage", "declarativeAgent.json"),
      "README.md",
    ];
    const m365Missing = m365Required.filter(
      (f) => !fs.existsSync(path.join(m365Path, f)),
    );
    if (m365Missing.length > 0)
      m365Missing.forEach((f) => fail(`M365 heir missing: ${f}`));
    else pass("M365 heir essential files present");
  } else {
    pass("M365 heir not present (skipped)");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 28: Codespaces Heir Health
// ════════════════════════════════════════════════════════════
if (runPhases.includes(28)) {
  writePhase(28, "Codespaces Heir Health");
  const csPath = path.join(rootPath, "platforms", "codespaces");
  if (fs.existsSync(csPath)) {
    const csRequired = ["devcontainer.json", "README.md"];
    const csMissing = csRequired.filter(
      (f) => !fs.existsSync(path.join(csPath, f)),
    );
    if (csMissing.length > 0)
      csMissing.forEach((f) => fail(`Codespaces heir missing: ${f}`));
    else pass("Codespaces heir essential files present");
  } else {
    pass("Codespaces heir not present (skipped)");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 29: Global Knowledge Sync Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(29)) {
  writePhase(29, "Global Knowledge Sync Validation");
  const gkPath = path.join(path.dirname(rootPath), "Alex-Global-Knowledge");
  if (fs.existsSync(gkPath)) {
    const indexPath = path.join(gkPath, "index.json");
    if (fs.existsSync(indexPath)) {
      const index = readJSON(indexPath);
      if (index && index.entries) {
        const indexPatterns = index.entries.filter(
          (e) => e.type === "pattern",
        ).length;
        const indexInsights = index.entries.filter(
          (e) => e.type === "insight",
        ).length;
        const patternsDir = path.join(gkPath, "patterns");
        const insightsDir = path.join(gkPath, "insights");
        const actualPatterns = fs.existsSync(patternsDir)
          ? fs.readdirSync(patternsDir).filter((f) => f.startsWith("GK-"))
              .length
          : 0;
        const actualInsights = fs.existsSync(insightsDir)
          ? fs.readdirSync(insightsDir).filter((f) => f.startsWith("GI-"))
              .length
          : 0;

        if (indexPatterns !== actualPatterns)
          warn(
            `GK index patterns (${indexPatterns}) != actual files (${actualPatterns})`,
          );
        if (indexInsights !== actualInsights)
          warn(
            `GK index insights (${indexInsights}) != actual files (${actualInsights})`,
          );
        if (
          indexPatterns === actualPatterns &&
          indexInsights === actualInsights
        ) {
          pass(
            `GK index matches disk: ${actualPatterns} patterns, ${actualInsights} insights`,
          );
        }
      }
    } else {
      warn("Global Knowledge index.json not found");
    }
  } else {
    pass("Global Knowledge repo not found (skipped)");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 30: Release Scripts & Muscles Integrity
// ════════════════════════════════════════════════════════════
if (runPhases.includes(30)) {
  writePhase(30, "Release Scripts & Muscles Integrity");
  const musclesDir = path.join(ghPath, "muscles");
  const expectedMuscles = [
    "audit-master-alex.ps1",
    "brain-qa.ps1",
    "brain-qa-heir.ps1",
    "build-extension-package.ps1",
    "dream-cli.ts",
    "fix-fence-bug.ps1",
    "gamma-generator.cjs",
    "normalize-paths.ps1",
    "pptxgen-cli.ts",
    "sync-architecture.cjs",
    "validate-skills.ps1",
    "validate-synapses.ps1",
  ];
  const missingMuscles = expectedMuscles.filter(
    (m) => !fs.existsSync(path.join(musclesDir, m)),
  );
  if (missingMuscles.length > 0)
    missingMuscles.forEach((m) => fail(`Missing muscle: ${m}`));
  else
    pass(`All trifecta-referenced muscles present (${expectedMuscles.length})`);

  const scriptsDir = path.join(rootPath, "scripts");
  if (fs.existsSync(scriptsDir)) {
    const releaseScripts = ["release-vscode.ps1", "release-preflight.ps1"];
    const missingRelease = releaseScripts.filter(
      (s) => !fs.existsSync(path.join(scriptsDir, s)),
    );
    if (missingRelease.length > 0)
      missingRelease.forEach((m) => warn(`Missing release script: ${m}`));
    else pass("Release scripts present");
  }
}

// ════════════════════════════════════════════════════════════
// PHASE 31: ROADMAP & Root Doc Version Consistency
// ════════════════════════════════════════════════════════════
if (runPhases.includes(31)) {
  writePhase(31, "ROADMAP & Root Doc Version Consistency");
  const vscPkg = readJSON(
    path.join(rootPath, "platforms", "vscode-extension", "package.json"),
  );
  const currentVersion = vscPkg ? vscPkg.version : "unknown";

  const roadmapPath = path.join(rootPath, "ROADMAP.md");
  if (fs.existsSync(roadmapPath)) {
    const rmContent = fs.readFileSync(roadmapPath, "utf8");
    const rmMatch = rmContent.match(/Current Master Version.*?(\d+\.\d+\.\d+)/);
    if (rmMatch) {
      if (rmMatch[1] !== currentVersion)
        warn(
          `ROADMAP says master version ${rmMatch[1]}, package.json says ${currentVersion}`,
        );
      else pass(`ROADMAP master version matches (${currentVersion})`);
    }
  }

  const configPath = path.join(ghPath, "config", "cognitive-config.json");
  if (fs.existsSync(configPath)) {
    const config = readJSON(configPath);
    if (config && config.version !== currentVersion)
      warn(
        `cognitive-config.json version (${config.version}) != ${currentVersion}`,
      );
    else if (config)
      pass(`cognitive-config.json version matches (${currentVersion})`);
  }

  const ciPath = path.join(ghPath, "copilot-instructions.md");
  if (fs.existsSync(ciPath)) {
    const ciContent = fs.readFileSync(ciPath, "utf8");
    const ciMatch = ciContent.match(/# Alex v(\d+\.\d+\.\d+)/);
    if (ciMatch && ciMatch[1] !== currentVersion)
      warn(
        `copilot-instructions.md version (${ciMatch[1]}) != ${currentVersion}`,
      );
    else if (ciMatch)
      pass(`copilot-instructions.md version matches (${currentVersion})`);
  }

  const clPath = path.join(rootPath, "CHANGELOG.md");
  if (fs.existsSync(clPath)) {
    const clContent = fs.readFileSync(clPath, "utf8");
    if (!clContent.includes(`[${currentVersion}]`))
      warn(`CHANGELOG.md missing entry for ${currentVersion}`);
    else pass(`CHANGELOG.md has entry for ${currentVersion}`);
  }

  const heirClPath = path.join(
    rootPath,
    "platforms",
    "vscode-extension",
    "CHANGELOG.md",
  );
  if (fs.existsSync(heirClPath)) {
    const heirCl = fs.readFileSync(heirClPath, "utf8");
    if (!heirCl.includes(`[${currentVersion}]`))
      warn(`Heir CHANGELOG.md missing entry for ${currentVersion}`);
    else pass(`Heir CHANGELOG.md has entry for ${currentVersion}`);
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
      const missing = setDiff(diskAgents, listed);
      const extra = setDiff(listed, diskAgents);
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

    // Trifecta validation
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

      // Instruction/prompt matching with aliases
      const instrAliases = {
        "dream-state": "dream-state-automation",
        "release-process": "release-management",
        "research-first-development": "research-first-workflow",
        "brain-qa": "semantic-audit",
        "architecture-audit": "semantic-audit",
        "code-review": "code-review-guidelines",
        "global-knowledge": "global-knowledge-curation",
        "gamma-presentations": "gamma-presentation",
      };
      const promptAliases = {
        meditation: "meditate",
        "dream-state": "dream",
        "self-actualization": "selfactualize",
        "release-process": "release",
        "brand-asset-management": "brand",
        "research-first-development": "gapanalysis",
        "brain-qa": "brainqa",
        "architecture-audit": "masteraudit",
        "bootstrap-learning": "learn",
        "vscode-configuration-validation": "validate-config",
        "ui-ux-design": "ui-ux-audit",
        "gamma-presentations": "gamma",
        "secrets-management": "secrets",
        "chat-participant-patterns": "chat-participant",
        "vscode-extension-patterns": "vscode-extension-audit",
        "mcp-development": "mcp-server",
        "microsoft-graph-api": "graph-api",
        "teams-app-patterns": "teams-app",
        "m365-agent-debugging": "m365-agent-debug",
        "testing-strategies": "tdd",
        "knowledge-synthesis": "cross-domain-transfer",
        "north-star": "northstar",
        "md-to-word": "word",
        "debugging-patterns": "debug",
        "refactoring-patterns": "refactor",
        "code-review": "review",
        "global-knowledge": "knowledge",
        "ai-writing-avoidance": "audit-writing",
      };

      const instrFiles = files(path.join(ghPath, "instructions"), ".md").map(
        (f) => f.replace(".instructions.md", ""),
      );
      const promptFiles = files(path.join(ghPath, "prompts"), ".md").map((f) =>
        f.replace(".prompt.md", ""),
      );

      const noInstr = listedNames.filter(
        (n) =>
          !instrFiles.includes(n) &&
          !(instrAliases[n] && instrFiles.includes(instrAliases[n])),
      );
      const noPrompt = listedNames.filter(
        (n) =>
          !promptFiles.includes(n) &&
          !(promptAliases[n] && promptFiles.includes(promptAliases[n])),
      );

      if (noInstr.length > 0)
        warn(
          `Listed trifectas with no matching instruction: ${noInstr.join(", ")}`,
        );
      else pass("All listed trifectas have matching instructions");
      if (noPrompt.length > 0)
        warn(
          `Listed trifectas with no matching prompt: ${noPrompt.join(", ")}`,
        );
      else pass("All listed trifectas have matching prompts");
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
// PHASE 33: Pre-Sync Master Validation
// ════════════════════════════════════════════════════════════
if (runPhases.includes(33)) {
  writePhase(33, "Pre-Sync Master Validation");

  // 1. All skills must have YAML frontmatter
  const missingFM = dirs(path.join(ghPath, "skills")).filter((skill) => {
    const skillMd = path.join(ghPath, "skills", skill, "SKILL.md");
    return (
      fs.existsSync(skillMd) &&
      !/^---\s*\n/.test(fs.readFileSync(skillMd, "utf8"))
    );
  });
  if (missingFM.length > 0) {
    fail(
      `Master has ${missingFM.length} skills without YAML frontmatter - will break heir`,
    );
    missingFM.forEach((s) => fail(`  Missing frontmatter: ${s}`));
  } else {
    pass("All master skills have YAML frontmatter");
  }

  // 2. No legacy .prompt.md in episodic
  const epDir = path.join(ghPath, "episodic");
  if (fs.existsSync(epDir)) {
    const legacy = fs
      .readdirSync(epDir)
      .filter((f) => f.endsWith(".prompt.md"));
    if (legacy.length > 0)
      fail(
        `Master episodic has ${legacy.length} legacy .prompt.md files - archive before sync`,
      );
    else pass("No legacy .prompt.md files in episodic");
  }

  // 3. No PII in master user-profile.json
  const profilePath = path.join(ghPath, "config", "user-profile.json");
  if (fs.existsSync(profilePath)) {
    const prof = readJSON(profilePath);
    let hasPII = false;
    if (prof && prof.name && prof.name.trim() !== "") {
      warn(
        `Master user-profile.json contains name: '${prof.name}' (will be excluded from heir)`,
      );
      hasPII = true;
    }
    if (prof && prof.contact && prof.contact.email) {
      warn(
        "Master user-profile.json contains email (will be excluded from heir)",
      );
      hasPII = true;
    }
    if (!hasPII) pass("Master user-profile.json is PII-free");
  }

  // 4. Synapse references to non-existent files
  const brokenRefs = [];
  for (const skill of dirs(path.join(ghPath, "skills"))) {
    const synPath = path.join(ghPath, "skills", skill, "synapses.json");
    if (!fs.existsSync(synPath)) continue;
    const syn = readJSON(synPath);
    if (!syn || !syn.connections) continue;
    for (const conn of syn.connections) {
      const t = conn.target;
      if (!t || /^(external:|global-knowledge:\/\/|https?:\/\/)/.test(t))
        continue;
      let fullPath;
      if (/^\.github\//.test(t)) fullPath = path.join(rootPath, t);
      else if (t.startsWith("../"))
        fullPath = path.resolve(path.join(ghPath, "skills", skill), t);
      else fullPath = path.join(ghPath, "skills", skill, t);
      if (!fs.existsSync(fullPath)) brokenRefs.push(`${skill}: ${t}`);
    }
  }
  if (brokenRefs.length > 0) {
    fail(
      `Master has ${brokenRefs.length} broken synapse references - fix before sync`,
    );
    brokenRefs.slice(0, 10).forEach((r) => fail(`  ${r}`));
    if (brokenRefs.length > 10)
      fail(`  ... and ${brokenRefs.length - 10} more`);
  } else {
    pass("All master synapse references are valid");
  }

  // 5. Master-only paths in inheritable skills
  const exclusions = [
    "heir-sync-management",
    "m365-agent-debugging",
    "teams-app-patterns",
    "azure-devops-automation",
    "chat-participant-patterns",
    "vscode-configuration-validation",
    "vscode-extension-patterns",
    "azure-architecture-patterns",
    "enterprise-integration",
    "persona-detection",
  ];
  const contaminated = [];
  for (const skill of dirs(path.join(ghPath, "skills"))) {
    if (exclusions.includes(skill)) continue;
    const synPath = path.join(ghPath, "skills", skill, "synapses.json");
    if (!fs.existsSync(synPath)) continue;
    const syn = readJSON(synPath);
    if (!syn || !syn.connections) continue;
    for (const conn of syn.connections) {
      if (
        conn.target &&
        /(ROADMAP\.md|alex_docs\/|platforms\/|MASTER-ALEX-PROTECTED|episodic\/)/.test(
          conn.target,
        )
      ) {
        contaminated.push(
          `${skill}: references master-only path '${conn.target}'`,
        );
      }
    }
  }
  if (contaminated.length > 0) {
    fail("Inheritable skills reference master-only paths - will break in heir");
    contaminated.forEach((c) => fail(`  ${c}`));
  } else {
    pass("No inheritable skills reference master-only paths");
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
    if (/^[a-zA-Z]:\\|^\//.test(target)) return target; // absolute path
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
      /* skip parse errors */
    }
  }

  // 2. Markdown link targets
  const linkRx = /\[([^\]]*)\]\(([^)]+)\)/g;
  for (const f of findRecursive(ghPath, (n) => n.endsWith(".md"))) {
    const short = f.replace(ghPath + path.sep, "");
    if (isExcepted(short)) continue;
    let content = fs.readFileSync(f, "utf8");
    // Strip code fences and inline code
    content = content.replace(/```[\s\S]*?```/g, "");
    content = content.replace(/`[^`]+`/g, "");
    let m;
    while ((m = linkRx.exec(content)) !== null) {
      const href = m[2];
      if (/^(https?:\/\/|#|mailto:)/.test(href)) continue;
      const escaped = testSelfContained(f, href);
      if (escaped !== null) scIssues.push(`[md-link] ${short} -> ${escaped}`);
    }
    // Double-slash typo
    if (/\.\.\/\//.test(fs.readFileSync(f, "utf8"))) {
      scIssues.push(`[..// typo] ${short}`);
    }
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
// PHASE 35: API Key Availability Warnings
// ════════════════════════════════════════════════════════════
if (runPhases.includes(35)) {
  writePhase(35, "API Key Availability Check");
  const keyMap = {};
  for (const f of findRecursive(
    path.join(ghPath, "skills"),
    (n) => n === "synapses.json",
  )) {
    const j = readJSON(f);
    if (!j || !j.apiKeys) continue;
    const skill = path.basename(path.dirname(f));
    for (const req of j.apiKeys) {
      const k = req.envVar;
      if (!keyMap[k])
        keyMap[k] = {
          skills: [],
          purpose: req.purpose,
          required: req.required,
          getUrl: req.getUrl,
        };
      keyMap[k].skills.push(skill);
    }
  }

  if (Object.keys(keyMap).length === 0) {
    pass("No skills declare API key requirements");
  } else {
    const missingKeys = [];
    for (const envVar of Object.keys(keyMap).sort()) {
      const entry = keyMap[envVar];
      if (process.env[envVar]) {
        pass(`${envVar} — set (skills: ${entry.skills.join(", ")})`);
      } else {
        const tag = entry.required ? "required" : "optional";
        const hint = entry.getUrl ? ` | Get it: ${entry.getUrl}` : "";
        warn(
          `${envVar} not set (${tag}) — needed by: ${entry.skills.join(", ")} | ${entry.purpose}${hint}`,
        );
        missingKeys.push(envVar);
      }
    }
    if (missingKeys.length === 0)
      pass(`All ${Object.keys(keyMap).length} declared API key(s) are present`);
    else {
      warn(
        `${missingKeys.length} API key(s) missing — affected skills will fail at runtime`,
      );
      warn(
        "Keys may also be stored in VS Code SecretStorage (not checkable from Node.js)",
      );
    }
  }
}

// ════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════
console.log(`\n${C}========================================${X}`);
console.log(`${C} BRAIN QA SUMMARY${X}`);
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
  console.log(`\n${G}[OK] All phases passed!${X}`);
}

process.exit(issues.length > 0 ? 1 : 0);
