#!/usr/bin/env node
/**
 * audit-skill-activation-index.cjs
 * Validates that .github/skills/memory-activation/SKILL.md includes all skills present in .github/skills.
 * 
 * Usage: node scripts/audit-skill-activation-index.cjs [--json]
 * Alex-first: Use --json for machine-consumable output
 */

const fs = require('fs');
const path = require('path');

// Alex-first: JSON output mode
const JSON_MODE = process.argv.includes('--json');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, '.github', 'skills');
const ACTIVATION_SKILL = path.join(SKILLS_DIR, 'memory-activation', 'SKILL.md');

function getSkillDirs() {
  return fs.readdirSync(SKILLS_DIR).filter((name) => {
    const full = path.join(SKILLS_DIR, name);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'SKILL.md'));
  });
}

function extractActivationEntries(markdown) {
  const lines = markdown.split(/\r?\n/);
  const ids = new Set();
  const skillRegex = /`([^`]+)`/g; // inline code entries if present
  for (const line of lines) {
    // Extract table rows: | skill | keywords |
    if (line.trim().startsWith('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 1) {
        const skillCol = cols[0];
        const normalized = skillCol.replace(/^[[*]\s]*/, '').toLowerCase();
        if (/^[a-z0-9-]+$/.test(normalized)) {
          ids.add(normalized);
        }
      }
    }
    let m;
    while ((m = skillRegex.exec(line)) !== null) {
      ids.add(m[1]);
    }
  }
  return ids;
}

function main() {
  if (!fs.existsSync(ACTIVATION_SKILL)) {
    if (JSON_MODE) {
      console.log(JSON.stringify({ passed: false, error: 'missing activation skill file' }));
    } else {
      console.error(`[audit-skill-activation] missing file: ${ACTIVATION_SKILL}`);
    }
    process.exit(1);
  }
  const skillDirs = getSkillDirs();
  const activationMd = fs.readFileSync(ACTIVATION_SKILL, 'utf8');
  const activationIds = extractActivationEntries(activationMd);

  // skillId equals directory name
  const missing = [];
  for (const dir of skillDirs) {
    if (!activationIds.has(dir)) {
      missing.push(dir);
    }
  }

  if (JSON_MODE) {
    const jsonResult = {
      passed: missing.length === 0,
      totalSkills: skillDirs.length,
      indexedSkills: activationIds.size,
      missing
    };
    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(missing.length > 0 ? 1 : 0);
  }

  if (missing.length > 0) {
    console.error('[audit-skill-activation] Missing skills in memory-activation/SKILL.md:');
    missing.forEach((id) => console.error(`  - ${id}`));
    console.error('\nAdd entries to memory-activation/SKILL.md (inline code ticks).');
    process.exit(1);
  }

  console.log(`[audit-skill-activation] [PASS] All ${skillDirs.length} skills present in memory-activation index.`);
}

main();
