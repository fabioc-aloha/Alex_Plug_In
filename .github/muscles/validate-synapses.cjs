#!/usr/bin/env node
// Validate synapse files for Alex cognitive architecture
// Location: .github/muscles/validate-synapses.cjs
// Cross-platform port of validate-synapses.ps1

'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const quiet = args.includes('--quiet');
const skillsPath = args.find(a => !a.startsWith('--')) || path.join('.github', 'skills');

const results = {
  total: 0,
  valid: 0,
  invalidJSON: [],
  missingSchema: [],
  missingSkillId: [],
  missingConnections: [],
  brokenTargets: []
};

// Find all synapses.json files recursively
function findSynapseFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findSynapseFiles(fullPath));
    } else if (entry.name === 'synapses.json') {
      files.push(fullPath);
    }
  }
  return files;
}

const synapseFiles = findSynapseFiles(skillsPath);

for (const file of synapseFiles) {
  results.total++;
  const skillName = path.basename(path.dirname(file));

  // Try to parse JSON
  let content;
  try {
    content = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    results.invalidJSON.push(skillName);
    if (!quiet) console.warn(`Warning: Invalid JSON in: ${skillName}/synapses.json`);
    continue;
  }

  let isValid = true;

  // Check required fields
  if (!content.skill && !content.skillId) {
    results.missingSkillId.push(skillName);
    isValid = false;
  }

  if (!content.schemaVersion) {
    results.missingSchema.push(skillName);
    // Not a failure, just a warning
  }

  if (!content.connections || content.connections.length === 0) {
    results.missingConnections.push(skillName);
    isValid = false;
  }

  // Validate connection targets exist (if strict mode)
  if (strict && content.connections) {
    for (const conn of content.connections) {
      if (conn.target) {
        const targetPath = path.resolve(conn.target);
        if (!fs.existsSync(targetPath)) {
          results.brokenTargets.push(`${skillName} -> ${conn.target}`);
          isValid = false;
        }
      }
    }
  }

  if (isValid) results.valid++;
}

// Output results
if (!quiet) {
  console.log('\n===== Synapse Validation Report =====');
  console.log(`Total synapse files: ${results.total}`);
  const validColor = results.valid === results.total ? '\x1b[32m' : '\x1b[33m';
  console.log(`${validColor}Valid: ${results.valid}\x1b[0m`);

  if (results.invalidJSON.length > 0) {
    console.log(`\n\x1b[31mInvalid JSON (${results.invalidJSON.length}):\x1b[0m`);
    results.invalidJSON.forEach(s => console.log(`  - ${s}`));
  }

  if (results.missingSkillId.length > 0) {
    console.log(`\n\x1b[31mMissing skill/skillId (${results.missingSkillId.length}):\x1b[0m`);
    results.missingSkillId.forEach(s => console.log(`  - ${s}`));
  }

  if (results.missingConnections.length > 0) {
    console.log(`\n\x1b[33mMissing/empty connections (${results.missingConnections.length}):\x1b[0m`);
    results.missingConnections.forEach(s => console.log(`  - ${s}`));
  }

  if (results.missingSchema.length > 0) {
    console.log(`\n\x1b[33mMissing schemaVersion (${results.missingSchema.length}):\x1b[0m`);
    results.missingSchema.forEach(s => console.log(`  - ${s}`));
  }

  if (strict && results.brokenTargets.length > 0) {
    console.log(`\n\x1b[31mBroken targets (${results.brokenTargets.length}):\x1b[0m`);
    results.brokenTargets.forEach(s => console.log(`  - ${s}`));
  }
}

// Exit with error if critical issues found
let criticalErrors = results.invalidJSON.length + results.missingSkillId.length;
if (strict) criticalErrors += results.brokenTargets.length;

if (criticalErrors > 0) {
  if (!quiet) {
    console.log(`\n\x1b[31m[ERROR] Synapse validation failed with ${criticalErrors} critical error(s)\x1b[0m`);
  }
  process.exit(1);
} else {
  if (!quiet) {
    console.log('\n\x1b[32m[OK] All synapse files valid\x1b[0m');
  }
  process.exit(0);
}
