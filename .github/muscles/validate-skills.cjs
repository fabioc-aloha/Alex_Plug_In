#!/usr/bin/env node
/**
 * @muscle validate-skills
 * @inheritance inheritable
 * @description Validate Alex skills for VS Code Agent Skills compliance
 * @version 1.0.0
 * @skill skill-building
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Validate Alex skills for VS Code Agent Skills compliance.
 * Cross-platform port of validate-skills.ps1.
 *
 * Location: .github/muscles/validate-skills.cjs
 *
 * Usage:
 *   node validate-skills.cjs [skills-path] [--fix]
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Parse CLI arguments for --fix flag and optional skills path
const args = process.argv.slice(2);
const fix = args.includes('--fix');
const skillsPath = args.find(a => !a.startsWith('--')) || path.join('.github', 'skills');

// Results accumulator for validation report
const results = {
  total: 0,
  valid: 0,
  missingName: [],
  missingDescription: [],
  missingApplyTo: [],
  noFrontmatter: []
};

/**
 * Main validation function with error handling wrapper.
 */
function main() {
  // Verify skills directory exists before scanning
  if (!fs.existsSync(skillsPath)) {
    console.error(`[ERROR] Skills directory not found: ${skillsPath}`);
    process.exit(1);
  }

  // Get all skill directories (each skill is a folder)
  const skillDirs = fs.readdirSync(skillsPath, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of skillDirs) {
    const skillFile = path.join(skillsPath, dir.name, 'SKILL.md');

    // Skip directories without SKILL.md
    if (!fs.existsSync(skillFile)) {
      console.warn(`Warning: No SKILL.md in: ${dir.name}`);
      continue;
    }

    results.total++;
    const content = fs.readFileSync(skillFile, 'utf8');

    // Extract YAML frontmatter (handles both LF and CRLF)
    const fmMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);

    if (!fmMatch) {
      // No frontmatter = fails all field checks
      results.noFrontmatter.push(dir.name);
      results.missingName.push(dir.name);
      results.missingDescription.push(dir.name);
      results.missingApplyTo.push(dir.name);
      continue;
    }

    const frontmatter = fmMatch[1];

    // Check required VS Code Agent Skills fields
    const hasName = /^name:\s*['"]?.+['"]?\s*$/m.test(frontmatter);
    const hasDescription = /^description:\s*['"]?.+['"]?\s*$/m.test(frontmatter);
    const hasApplyTo = /^applyTo:\s*['"]?.+['"]?\s*$/m.test(frontmatter);

    if (!hasName) results.missingName.push(dir.name);
    if (!hasDescription) results.missingDescription.push(dir.name);
    if (!hasApplyTo) results.missingApplyTo.push(dir.name);

    // VS Code requires name + description minimum
    if (hasName && hasDescription) {
      results.valid++;
    }
  }

  // Output colorized results report
  printReport();
}

/**
 * Print validation report with ANSI colors.
 */
function printReport() {
  console.log('\n===== Skill Validation Report =====');
  console.log(`Total skills: ${results.total}`);
  const validColor = results.valid === results.total ? '\x1b[32m' : '\x1b[33m';
  console.log(`${validColor}Valid (name + description): ${results.valid}\x1b[0m`);

  if (results.noFrontmatter.length > 0) {
    console.log(`\n\x1b[31mNo frontmatter (${results.noFrontmatter.length}):\x1b[0m`);
    results.noFrontmatter.forEach(s => console.log(`  - ${s}`));
  }

  if (results.missingName.length > 0) {
    console.log(`\n\x1b[33mMissing 'name' (${results.missingName.length}):\x1b[0m`);
    results.missingName.forEach(s => console.log(`  - ${s}`));
  }

  if (results.missingDescription.length > 0) {
    console.log(`\n\x1b[33mMissing 'description' (${results.missingDescription.length}):\x1b[0m`);
    results.missingDescription.forEach(s => console.log(`  - ${s}`));
  }

  if (results.missingApplyTo.length > 0) {
    console.log(`\n\x1b[90mMissing 'applyTo' (${results.missingApplyTo.length}):\x1b[0m`);
    results.missingApplyTo.forEach(s => console.log(`  - ${s}`));
  }

  // Summary with compliance rate calculation
  const complianceRate = results.total > 0
    ? Math.round((results.valid / results.total) * 1000) / 10
    : 0;
  const rateColor = complianceRate === 100 ? '\x1b[32m' : complianceRate >= 80 ? '\x1b[33m' : '\x1b[31m';

  console.log('\n===== Summary =====');
  console.log(`${rateColor}Compliance rate: ${complianceRate}%\x1b[0m`);

  // Exit with appropriate code for CI integration
  if (results.valid < results.total) {
    process.exit(1);
  } else {
    console.log('\n\x1b[32mAll skills are VS Code Agent Skills compliant!\x1b[0m');
    process.exit(0);
  }
}

// Main entry point with error handling
try {
  main();
} catch (err) {
  console.error('[ERROR] Skill validation failed:', err.message);
  process.exit(1);
}
