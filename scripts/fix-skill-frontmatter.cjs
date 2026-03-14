#!/usr/bin/env node
/**
 * Normalize SKILL.md frontmatter names to match folder names.
 * Applies to .github/skills and platforms/vscode-extension/.github/skills.
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const roots = [
  path.join(process.cwd(), '.github', 'skills'),
  path.join(process.cwd(), 'platforms', 'vscode-extension', '.github', 'skills'),
];

function normalize(root) {
  if (!fs.existsSync(root)) return [];
  const mismatches = [];
  for (const dir of fs.readdirSync(root)) {
    const skillDir = path.join(root, dir);
    const skillMd = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;
    const raw = fs.readFileSync(skillMd, 'utf8');
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) continue;
    let fm;
    try {
      fm = yaml.load(m[1]) || {};
    } catch (e) {
      mismatches.push({ dir, error: e.message });
      continue;
    }
    const name = (fm.name || fm.title || fm.skill || '').trim();
    if (name !== dir) {
      mismatches.push({ dir, name, fixed: dir });
      fm.name = dir;
      const newFront = '---\n' + yaml.dump(fm, { lineWidth: 120 }) + '---';
      const updated = raw.replace(/^---[\s\S]*?---/, newFront);
      fs.writeFileSync(skillMd, updated, 'utf8');
    }
  }
  return mismatches;
}

const all = [];
for (const root of roots) {
  const mism = normalize(root);
  if (mism.length) {
    all.push({ root, mism });
  }
}

if (all.length) {
  console.log('Normalized SKILL frontmatter names:');
  all.forEach(({ root, mism }) => {
    console.log('Root:', root);
    mism.forEach(m => {
      if (m.error) {
        console.log('  -', m.dir, 'error:', m.error);
      } else {
        console.log(`  - ${m.dir} <- ${m.name}`);
      }
    });
  });
} else {
  console.log('No mismatches found.');
}
