#!/usr/bin/env node
// Install Git Hooks - Set up quality gate automation
// Location: .github/muscles/install-hooks.cjs
// Cross-platform port of install-hooks.ps1

'use strict';

const fs = require('fs');
const path = require('path');
const scriptDir = __dirname;
const rootPath = path.resolve(scriptDir, '..', '..');
const hooksSource = path.join(rootPath, '.github', 'hooks');
const hooksTarget = path.join(rootPath, '.git', 'hooks');

function main() {
  if (!fs.existsSync(hooksTarget)) {
    console.error('[ERROR] .git/hooks directory not found. Is this a Git repository?');
    process.exit(1);
  }

  console.log('Installing Git hooks...');

  const preCommitSource = path.join(hooksSource, 'pre-commit');
  const preCommitTarget = path.join(hooksTarget, 'pre-commit');

  if (!fs.existsSync(preCommitSource)) {
    console.error(`[ERROR] Hook source not found: ${preCommitSource}`);
    process.exit(1);
  }

  if (fs.existsSync(preCommitTarget)) {
    console.log('  [WARN] pre-commit hook already exists -- overwriting');
  }
  copyHook(preCommitSource, preCommitTarget);
}

function copyHook(source, target) {
  fs.copyFileSync(source, target);

  // Make executable on Unix systems
  if (process.platform !== 'win32') {
    fs.chmodSync(target, 0o755);
  }

  console.log('[OK] Git hooks installed');
  console.log('');
  console.log('Pre-commit hook will validate:');
  console.log('  - SKILL.md YAML frontmatter');
  console.log('  - synapses.json structure');
  console.log('  - Episodic file naming');
  console.log('  - Master-only contamination');
  console.log('');
  console.log('Test it now:');
  console.log('  git add .github/skills/test-skill/SKILL.md');
  console.log('  git commit -m "test"');
  console.log('');
  console.log('To bypass (use sparingly):');
  console.log('  git commit --no-verify');
}

main();
