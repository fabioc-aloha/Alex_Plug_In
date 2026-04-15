#!/usr/bin/env node
/**
 * @muscle audit-token-waste
 * @inheritance inheritable
 * @description Scan cognitive architecture for token waste patterns with auto-fix
 * @version 1.0.0
 * @skill token-waste-elimination
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Token Waste Audit Muscle
 *
 * Scans .github/ cognitive architecture files for token waste patterns
 * and optionally auto-fixes safe patterns.
 *
 * Trifecta: token-waste-elimination (skill + instruction + prompt + this muscle)
 *
 * Usage:
 *   node .github/muscles/audit-token-waste.cjs           # Report only
 *   node .github/muscles/audit-token-waste.cjs --fix     # Auto-fix safe patterns
 *   node .github/muscles/audit-token-waste.cjs --json    # Machine-readable output
 */
const fs = require("fs");
const path = require("path");

const FIX_MODE = process.argv.includes("--fix");
const JSON_MODE = process.argv.includes("--json");
const base = process.cwd();
const ghDir = path.join(base, ".github");

// -- Results ----------------------------------------------------
const findings = [];
let fixCount = 0;

function finding(severity, file, pattern, message, fixable) {
  findings.push({
    severity,
    file: path.relative(base, file),
    pattern,
    message,
    fixable: !!fixable,
  });
}

// -- Helpers ----------------------------------------------------
function readDir(dir, ext) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => path.join(dir, f));
}

function countLines(file) {
  return fs.readFileSync(file, "utf8").split("\n").length;
}

function extractFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

// -- Phase 1: Baseline Measurement -----------------------------
// Main entry point wrapped in try/catch for error handling
try {
if (!JSON_MODE) {
  console.log("\n=== TOKEN WASTE AUDIT ===\n");
}

const instrDir = path.join(ghDir, "instructions");
const promptDir = path.join(ghDir, "prompts");
const skillDir = path.join(ghDir, "skills");

const instrFiles = readDir(instrDir, ".md");
const promptFiles = readDir(promptDir, ".md");
const skillDirs = fs.existsSync(skillDir)
  ? fs
      .readdirSync(skillDir)
      .filter((d) => fs.statSync(path.join(skillDir, d)).isDirectory())
  : [];

let totalInstrLines = 0;
let totalPromptLines = 0;
let totalSkillLines = 0;
const oversizedInstr = [];
const oversizedPrompts = [];
const oversizedSkills = [];

for (const f of instrFiles) {
  const lc = countLines(f);
  totalInstrLines += lc;
  if (lc > 150) {
    oversizedInstr.push({ file: path.basename(f), lines: lc });
  }
}

for (const f of promptFiles) {
  const lc = countLines(f);
  totalPromptLines += lc;
  if (lc > 80) {
    oversizedPrompts.push({ file: path.basename(f), lines: lc });
  }
}

for (const d of skillDirs) {
  const skillFile = path.join(skillDir, d, "SKILL.md");
  if (fs.existsSync(skillFile)) {
    const lc = countLines(skillFile);
    totalSkillLines += lc;
    if (lc > 400) {
      oversizedSkills.push({ file: d, lines: lc });
    }
  }
}

if (!JSON_MODE) {
  console.log(
    `Instructions: ${instrFiles.length} files, ${totalInstrLines} total lines`,
  );
  console.log(
    `Prompts:      ${promptFiles.length} files, ${totalPromptLines} total lines`,
  );
  console.log(
    `Skills:       ${skillDirs.length} dirs, ${totalSkillLines} total lines`,
  );
  if (oversizedInstr.length) {
    console.log(`\nOversized instructions (>150 lines):`);
    for (const o of oversizedInstr) {
      console.log(`  ${o.lines}  ${o.file}`);
    }
  }
  if (oversizedPrompts.length) {
    console.log(`\nOversized prompts (>80 lines):`);
    for (const o of oversizedPrompts) {
      console.log(`  ${o.lines}  ${o.file}`);
    }
  }
  if (oversizedSkills.length) {
    console.log(`\nOversized skills (>400 lines):`);
    for (const o of oversizedSkills) {
      console.log(`  ${o.lines}  ${o.file}`);
    }
  }
}

// -- Phase 2: Instruction-Skill Overlap ------------------------
if (!JSON_MODE) {
  console.log("\n--- Instruction-Skill Overlap ---");
}

let overlapCount = 0;
for (const f of instrFiles) {
  const name = path.basename(f, ".md").replace(".instructions", "");
  const skillPath = path.join(skillDir, name, "SKILL.md");
  if (fs.existsSync(skillPath)) {
    const instrLines = countLines(f);
    if (instrLines > 50) {
      finding(
        "WARN",
        f,
        "overlap",
        `${instrLines} lines with matching skill (target: <50)`,
        false,
      );
      overlapCount++;
      if (!JSON_MODE) {
        console.log(`  ${instrLines}  ${path.basename(f)} -> skill exists`);
      }
    }
  }
}
if (!JSON_MODE && overlapCount === 0) {
  console.log("  All overlapping instructions are <=50 lines. Clean!");
}

// -- Phase 3: Waste Pattern Scan -------------------------------
if (!JSON_MODE) {
  console.log("\n--- Waste Pattern Scan ---");
}

const PATTERNS = [
  {
    name: "Mermaid %%{init}",
    regex: /%%\{init/g,
    fixable: true,
    fix: (line) => null,
  },
  {
    name: "Azure AD (not Entra ID)",
    regex: /Azure AD(?! ->)/g,
    fixable: true,
    fix: (line) => line.replace(/Azure AD/g, "Microsoft Entra ID"),
  },
  {
    name: "Meta-block Classification:",
    regex: /^\*\*Classification\*\*:/gm,
    fixable: false,
  },
  {
    name: "Meta-block Activation:",
    regex: /^\*\*Activation\*\*:/gm,
    fixable: false,
  },
  {
    name: "Meta-block Priority:",
    regex: /^\*\*Priority\*\*:/gm,
    fixable: false,
  },
];

// Scan all .md files under .github/
function walkMd(dir) {
  const results = [];
  if (!fs.existsSync(dir)) {
    return results;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(full));
    } else if (entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

const allMdFiles = walkMd(ghDir);
const patternCounts = {};
for (const p of PATTERNS) {
  patternCounts[p.name] = 0;
}

for (const f of allMdFiles) {
  const content = fs.readFileSync(f, "utf8");
  for (const p of PATTERNS) {
    const matches = content.match(p.regex);
    if (matches) {
      patternCounts[p.name] += matches.length;
      finding("WARN", f, p.name, `${matches.length} hit(s)`, p.fixable);

      if (FIX_MODE && p.fixable && p.fix) {
        const lines = content.split("\n");
        const fixed = [];
        let changed = false;
        for (const line of lines) {
          if (p.regex.test(line)) {
            const result = p.fix(line);
            if (result === null) {
              changed = true;
              continue;
            } // Delete line
            if (result !== line) {
              changed = true;
            }
            fixed.push(result);
          } else {
            fixed.push(line);
          }
          // Reset regex lastIndex for global patterns
          p.regex.lastIndex = 0;
        }
        if (changed) {
          fs.writeFileSync(f, fixed.join("\n"));
          fixCount++;
        }
      }
    }
  }
}

if (!JSON_MODE) {
  for (const [name, count] of Object.entries(patternCounts)) {
    const status = count === 0 ? "[OK]" : "[X]";
    console.log(`  ${status} ${name}: ${count} hits`);
  }
}

// -- Phase 4: Inline Synapses Check ----------------------------
if (!JSON_MODE) {
  console.log("\n--- Inline Synapses (skills with synapses.json) ---");
}

let inlineSynapseCount = 0;
for (const d of skillDirs) {
  const skillFile = path.join(skillDir, d, "SKILL.md");
  const synFile = path.join(skillDir, d, "synapses.json");
  if (fs.existsSync(skillFile) && fs.existsSync(synFile)) {
    const content = fs.readFileSync(skillFile, "utf8");
    if (/^## Synapses/m.test(content)) {
      finding(
        "WARN",
        skillFile,
        "inline-synapses",
        "Has inline ## Synapses AND synapses.json",
        true,
      );
      inlineSynapseCount++;
      if (!JSON_MODE) {
        console.log(`  ${d}/SKILL.md: has inline ## Synapses`);
      }

      if (FIX_MODE) {
        // Remove ## Synapses section
        const lines = content.split("\n");
        let synStart = -1;
        let synEnd = lines.length;
        for (let i = 0; i < lines.length; i++) {
          if (/^## Synapses/.test(lines[i])) {
            synStart = i;
          } else if (
            synStart >= 0 &&
            i > synStart &&
            /^## /.test(lines[i]) &&
            !/^## Synapses/.test(lines[i])
          ) {
            synEnd = i;
            break;
          }
        }
        if (synStart >= 0) {
          const before = lines.slice(0, synStart);
          const after = synEnd < lines.length ? lines.slice(synEnd) : [];
          while (before.length > 0 && before[before.length - 1].trim() === "") {
            before.pop();
          }
          fs.writeFileSync(skillFile, [...before, ...after].join("\n"));
          fixCount++;
        }
      }
    }
  }
}
if (!JSON_MODE && inlineSynapseCount === 0) {
  console.log("  Clean -- no inline synapses found.");
}

// -- Phase 5: applyTo Coverage ---------------------------------
if (!JSON_MODE) {
  console.log("\n--- Instructions Without applyTo ---");
}

let noApplyToCount = 0;
for (const f of instrFiles) {
  const content = fs.readFileSync(f, "utf8");
  const fm = extractFrontmatter(content);
  if (!fm.includes("applyTo:")) {
    const lines = countLines(f);
    // Only flag large files without applyTo as potential issues
    if (lines > 30) {
      noApplyToCount++;
      if (!JSON_MODE) {
        console.log(`  ${lines}  ${path.basename(f)}`);
      }
    }
  }
}
if (!JSON_MODE) {
  console.log(
    `  ${noApplyToCount} instructions >30 lines without applyTo (body loaded at agent discretion)`,
  );
}

// -- Phase 6: Always-On Cost Estimate --------------------------
if (!JSON_MODE) {
  console.log("\n--- Always-On Token Cost Estimate ---");
}

let descChars = 0;
for (const f of instrFiles) {
  const content = fs.readFileSync(f, "utf8");
  const m = content.match(/^description:\s*"?(.+?)"?\s*$/m);
  if (m) {
    descChars += m[1].length;
  }
}

let skillDescChars = 0;
for (const d of skillDirs) {
  const skillFile = path.join(skillDir, d, "SKILL.md");
  if (fs.existsSync(skillFile)) {
    const content = fs.readFileSync(skillFile, "utf8");
    const m = content.match(/^description:\s*(.+)$/m);
    if (m) {
      skillDescChars += m[1].length;
    }
  }
}

const ciFile = path.join(ghDir, "copilot-instructions.md");
const ciChars = fs.existsSync(ciFile)
  ? fs.readFileSync(ciFile, "utf8").length
  : 0;

if (!JSON_MODE) {
  console.log(
    `  Instruction descriptions: ~${Math.round(descChars / 4)} tokens (${descChars} chars)`,
  );
  console.log(
    `  Skill descriptions:       ~${Math.round(skillDescChars / 4)} tokens (${skillDescChars} chars)`,
  );
  console.log(
    `  copilot-instructions.md:  ~${Math.round(ciChars / 4)} tokens (${ciChars} chars)`,
  );
  console.log(
    `  Estimated always-on:      ~${Math.round((descChars + skillDescChars + ciChars) / 4)} tokens per request`,
  );
}

// -- Summary ---------------------------------------------------
const bugs = findings.filter((f) => f.severity === "BUG").length;
const warns = findings.filter((f) => f.severity === "WARN").length;

if (JSON_MODE) {
  console.log(
    JSON.stringify(
      {
        baseline: {
          instructions: {
            count: instrFiles.length,
            totalLines: totalInstrLines,
            oversized: oversizedInstr,
          },
          prompts: {
            count: promptFiles.length,
            totalLines: totalPromptLines,
            oversized: oversizedPrompts,
          },
          skills: {
            count: skillDirs.length,
            totalLines: totalSkillLines,
            oversized: oversizedSkills,
          },
        },
        alwaysOnTokens: Math.round((descChars + skillDescChars + ciChars) / 4),
        findings,
        fixesApplied: fixCount,
        summary: { total: findings.length, bugs, warnings: warns },
      },
      null,
      2,
    ),
  );
} else {
  console.log(
    `\n=== SUMMARY (${findings.length}: ${bugs} bugs, ${warns} warnings) ===`,
  );
  if (FIX_MODE) {
    console.log(`  Auto-fixed: ${fixCount} files`);
  }
  if (findings.length === 0) {
    console.log("  All clean! No token waste detected.");
  }
}

process.exit(bugs > 0 ? 1 : 0);
} catch (err) {
  console.error('[ERROR] Token waste audit failed:', err.message);
  process.exit(1);
}
