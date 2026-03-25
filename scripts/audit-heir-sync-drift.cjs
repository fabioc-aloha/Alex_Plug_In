#!/usr/bin/env node
/**
 * audit-heir-sync-drift.cjs
 * Detects drift for excluded skills between master (.github/skills) and heir copy (platforms/vscode-extension/.github/skills).
 * If SKILL.md or synapses.json differ for an excluded skill, fail with instructions to manually sync.
 * 
 * Usage: node scripts/audit-heir-sync-drift.cjs [--json]
 * Alex-first: Use --json for machine-consumable output
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Alex-first: JSON output mode
const JSON_MODE = process.argv.includes('--json');

const ROOT = path.resolve(__dirname, '..');
const MASTER_SKILLS = path.join(ROOT, '.github', 'skills');
const HEIR_SKILLS = path.join(ROOT, 'platforms', 'vscode-extension', '.github', 'skills');
const SYNC_SCRIPT = path.join(ROOT, '.github', 'muscles', 'sync-architecture.cjs');

function getHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function loadExclusions() {
  const src = fs.readFileSync(SYNC_SCRIPT, 'utf8');
  // SKILL_EXCLUSIONS is an object map: { skillName: 'reason', ... }
  const match = src.match(/const\s+SKILL_EXCLUSIONS\s*=\s*\{([\s\S]*?)\}/m);
  if (!match) return [];
  const body = match[1];
  const ids = [];
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/['"]([^'"\/]+)['"]\s*:/);
    if (m) ids.push(m[1]);
  }
  return ids;
}

function skillFiles(skillDir) {
  const files = [];
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMd)) files.push(skillMd);
  const synapseJson = path.join(skillDir, 'synapses.json');
  if (fs.existsSync(synapseJson)) files.push(synapseJson);
  return files;
}

function main() {
  const exclusions = loadExclusions();
  if (!exclusions.length && !JSON_MODE) {
    console.warn('[audit-heir-sync-drift] WARN: could not parse SKILL_EXCLUSIONS from sync-architecture.cjs');
  }
  const drift = [];

  for (const skillId of exclusions) {
    const masterDir = path.join(MASTER_SKILLS, skillId);
    const heirDir = path.join(HEIR_SKILLS, skillId);
    if (!fs.existsSync(masterDir) || !fs.existsSync(heirDir)) continue; // nothing to compare

    const masterFiles = skillFiles(masterDir);
    const heirFiles = skillFiles(heirDir);
    for (const mf of masterFiles) {
      const rel = path.relative(masterDir, mf);
      const hf = path.join(heirDir, rel);
      if (!fs.existsSync(hf)) continue;
      const mh = getHash(mf);
      const hh = getHash(hf);
      if (mh !== hh) {
        drift.push({ skillId, file: rel });
      }
    }
  }

  if (JSON_MODE) {
    const jsonResult = {
      passed: drift.length === 0,
      exclusionCount: exclusions.length,
      drift
    };
    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(drift.length > 0 ? 1 : 0);
  }

  if (drift.length > 0) {
    console.error('[audit-heir-sync-drift] Drift detected for excluded skills (manual sync required):');
    drift.forEach(({ skillId, file }) => console.error(`  - ${skillId}/${file}`));
    console.error('\nRun .github/muscles/sync-architecture.cjs with a temporary whitelist or copy files manually.');
    process.exit(1);
  }

  console.log('[audit-heir-sync-drift] [PASS] No drift detected for excluded skills.');
}

main();
