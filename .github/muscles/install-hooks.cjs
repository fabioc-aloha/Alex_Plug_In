#!/usr/bin/env node
/**
 * @muscle install-hooks
 * @inheritance inheritable
 * @description Install Git hooks for quality gate automation
 * @version 1.0.0
 * @skill git-workflow
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node,git
 *
 * Set up quality gate automation by installing Git hooks.
 * Cross-platform port of install-hooks.ps1.
 *
 * Location: .github/muscles/install-hooks.cjs
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Resolve paths relative to the script location (cross-platform)
const scriptDir = __dirname;
const rootPath = path.resolve(scriptDir, '..', '..');
const hooksSource = path.join(rootPath, '.github', 'hooks');
const hooksTarget = path.join(rootPath, '.git', 'hooks');

function main() {
  // Validate Git repository structure before proceeding
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

/**
 * Copy hook file from source to target with platform-appropriate permissions.
 * @param {string} source - Source hook file path
 * @param {string} target - Target hook file path in .git/hooks/
 */
function copyHook(source, target) {
  // Perform atomic file copy to prevent partial writes
  fs.copyFileSync(source, target);

  // Make executable on Unix systems (chmod 755)
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

// Main entry point with error handling
try {
  main();
} catch (err) {
  console.error('[ERROR] Hook installation failed:', err.message);
  process.exit(1);
}
