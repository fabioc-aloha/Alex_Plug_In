#!/usr/bin/env node
/**
 * @muscle normalize-paths
 * @inheritance inheritable
 * @description Unified path normalization for Alex memory file references
 * @version 1.0.0
 * @skill refactoring-patterns
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Unified path normalization for all Alex memory file types.
 * Cross-platform port of normalize-paths.ps1.
 *
 * Consolidates path normalization into a single script.
 * Ensures all references use canonical .github/ prefixed paths.
 *
 * Usage:
 *   node normalize-paths.cjs [--target <all|instructions|skills|synapses>]
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex >= 0 ? args[targetIndex + 1] : 'all';

const validTargets = ['all', 'instructions', 'skills', 'synapses'];
if (!validTargets.includes(target)) {
  console.error(`[ERROR] Invalid target: ${target}`);
  console.error(`Valid targets: ${validTargets.join(', ')}`);
  process.exit(1);
}

const scriptDir = __dirname;
const repoRoot = path.resolve(scriptDir, '..', '..');
const instructionsPath = path.join(repoRoot, '.github', 'instructions');
const promptsPath = path.join(repoRoot, '.github', 'prompts');
const skillsPath = path.join(repoRoot, '.github', 'skills');

let totalUpdated = 0;
let totalSkipped = 0;

/**
 * Normalize instruction and prompt file paths
 */
function normalizeInstructionPaths() {
  console.log('\n📄 Normalizing instruction & prompt file paths...');
  let updated = 0;
  let skipped = 0;

  // Process instruction files
  if (fs.existsSync(instructionsPath)) {
    const files = fs.readdirSync(instructionsPath).filter(f => f.endsWith('.md'));
    for (const fileName of files) {
      const filePath = path.join(instructionsPath, fileName);
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // [file.instructions.md] -> [.github/instructions/file.instructions.md]
      content = content.replace(/\[([^\[\]]+\.instructions\.md)\](?!\()/g, '[.github/instructions/$1]');
      // [file.prompt.md] -> [.github/prompts/file.prompt.md]
      content = content.replace(/\[([^\[\]]+\.prompt\.md)\](?!\()/g, '[.github/prompts/$1]');
      // [skill-name/SKILL.md] -> [.github/skills/skill-name/SKILL.md]
      content = content.replace(/\[([^\[\]\/]+)\/SKILL\.md\](?!\()/g, '[.github/skills/$1/SKILL.md]');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Updated: instructions/${fileName}`);
        updated++;
      } else {
        skipped++;
      }
    }
  }

  // Process prompt files
  if (fs.existsSync(promptsPath)) {
    const files = fs.readdirSync(promptsPath).filter(f => f.endsWith('.md'));
    for (const fileName of files) {
      const filePath = path.join(promptsPath, fileName);
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      content = content.replace(/\[([^\[\]]+\.instructions\.md)\](?!\()/g, '[.github/instructions/$1]');
      content = content.replace(/\[([^\[\]]+\.prompt\.md)\](?!\()/g, '[.github/prompts/$1]');
      content = content.replace(/\[([^\[\]\/]+)\/SKILL\.md\](?!\()/g, '[.github/skills/$1/SKILL.md]');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Updated: prompts/${fileName}`);
        updated++;
      } else {
        skipped++;
      }
    }
  }

  const color = updated > 0 ? '\x1b[32m' : '\x1b[90m';
  console.log(`${color}  Instructions/Prompts: ${updated} updated, ${skipped} skipped\x1b[0m`);
  return { updated, skipped };
}

/**
 * Normalize SKILL.md embedded paths
 */
function normalizeSkillPaths() {
  console.log('\n📦 Normalizing SKILL.md paths...');
  let updated = 0;
  let skipped = 0;

  if (!fs.existsSync(skillsPath)) {
    console.log('  Skills path not found');
    return { updated, skipped };
  }

  const skillDirs = fs.readdirSync(skillsPath, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of skillDirs) {
    const skillFile = path.join(skillsPath, dir.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    let content = fs.readFileSync(skillFile, 'utf8');
    const original = content;

    // [Name](../skill-name/SKILL.md) -> [Name](.github/skills/skill-name/SKILL.md)
    content = content.replace(/\]\(\.\.\/([^\/]+)\/SKILL\.md\)/g, '](.github/skills/$1/SKILL.md)');
    // [Name](../instructions/file.md) -> [Name](.github/instructions/file.md)
    content = content.replace(/\]\(\.\.\/instructions\/([^\)]+)\)/g, '](.github/instructions/$1)');

    if (content !== original) {
      fs.writeFileSync(skillFile, content, 'utf8');
      const relativePath = path.relative(repoRoot, skillFile);
      console.log(`  Updated: ${relativePath}`);
      updated++;
    } else {
      skipped++;
    }
  }

  const color = updated > 0 ? '\x1b[32m' : '\x1b[90m';
  console.log(`${color}  SKILL.md files: ${updated} updated, ${skipped} skipped\x1b[0m`);
  return { updated, skipped };
}

/**
 * Normalize synapses.json target fields
 */
function normalizeSynapsePaths() {
  console.log('\n🔗 Normalizing synapses.json targets...');
  let updated = 0;
  let skipped = 0;

  if (!fs.existsSync(skillsPath)) {
    console.log('  Skills path not found');
    return { updated, skipped };
  }

  const skillDirs = fs.readdirSync(skillsPath, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of skillDirs) {
    const synapsesFile = path.join(skillsPath, dir.name, 'synapses.json');
    if (!fs.existsSync(synapsesFile)) continue;

    try {
      const content = fs.readFileSync(synapsesFile, 'utf8');
      const json = JSON.parse(content);
      let modified = false;

      // Process both "connections" and "synapses" array formats
      for (const arrayName of ['connections', 'synapses']) {
        const array = json[arrayName];
        if (!array) continue;

        for (const entry of array) {
          const target = entry.target;
          if (!target || target.startsWith('.github/')) continue;

          // ../instructions/file.md -> .github/instructions/file.md
          const instrMatch = target.match(/^\.\.\/instructions\/(.+)$/);
          if (instrMatch) {
            entry.target = `.github/instructions/${instrMatch[1]}`;
            modified = true;
            continue;
          }

          // skill-name/SKILL.md -> .github/skills/skill-name/SKILL.md
          const skillMatch = target.match(/^([^\/]+)\/SKILL\.md$/);
          if (skillMatch) {
            entry.target = `.github/skills/${skillMatch[1]}/SKILL.md`;
            modified = true;
            continue;
          }

          // Bare skill name -> .github/skills/name/SKILL.md
          if (!target.includes('/') && !target.endsWith('.md')) {
            entry.target = `.github/skills/${target}/SKILL.md`;
            modified = true;
            continue;
          }
        }
      }

      if (modified) {
        fs.writeFileSync(synapsesFile, JSON.stringify(json, null, 2) + '\n', 'utf8');
        const relativePath = path.relative(repoRoot, synapsesFile);
        console.log(`  Updated: ${relativePath}`);
        updated++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`  Error processing ${synapsesFile}: ${err.message}`);
    }
  }

  const color = updated > 0 ? '\x1b[32m' : '\x1b[90m';
  console.log(`${color}  synapses.json: ${updated} updated, ${skipped} skipped\x1b[0m`);
  return { updated, skipped };
}

// Main execution
console.log('===========================================');
console.log(`  Alex Path Normalizer (Target: ${target})`);
console.log('===========================================');
console.log(`Repo: ${repoRoot}`);

const targets = target === 'all' ? ['instructions', 'skills', 'synapses'] : [target];

for (const t of targets) {
  let result;
  switch (t) {
    case 'instructions':
      result = normalizeInstructionPaths();
      break;
    case 'skills':
      result = normalizeSkillPaths();
      break;
    case 'synapses':
      result = normalizeSynapsePaths();
      break;
  }
  totalUpdated += result.updated;
  totalSkipped += result.skipped;
}

const color = totalUpdated > 0 ? '\x1b[32m' : '\x1b[90m';
console.log('\n===========================================');
console.log(`${color}  Total: ${totalUpdated} updated, ${totalSkipped} skipped\x1b[0m`);
console.log('===========================================');
