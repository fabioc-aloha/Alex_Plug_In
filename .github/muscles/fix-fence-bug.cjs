#!/usr/bin/env node
/**
 * @muscle fix-fence-bug
 * @inheritance inheritable
 * @description Detect and fix VS Code create_file wrapping fence bug
 * @version 1.0.0
 * @skill debugging-patterns
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires node
 *
 * Detects and fixes the VS Code create_file wrapping fence bug.
 * Cross-platform port of fix-fence-bug.ps1.
 *
 * Usage:
 *   node fix-fence-bug.cjs [--fix] [--full-repo] [--path <file>]
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const fix = args.includes('--fix');
const fullRepo = args.includes('--full-repo');
const pathIndex = args.indexOf('--path');
const specificPath = pathIndex >= 0 ? args[pathIndex + 1] : null;

const scriptDir = __dirname;
const repoRoot = path.resolve(scriptDir, '..', '..');

let issuesFound = 0;
let issuesFixed = 0;

/**
 * Test if file is wrapped in code fences
 */
function testWrappingFence(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content) return false;
    
    const startsWithFence = /^```\w*\r?\n/.test(content);
    const endsWithFence = /\r?\n```\s*$/.test(content);
    
    return startsWithFence && endsWithFence;
  } catch (err) {
    return false;
  }
}

/**
 * Get the language from opening fence
 */
function getFenceLanguage(content) {
  const match = content.match(/^```(\w+)/);
  return match ? match[1] : 'unknown';
}

/**
 * Remove wrapping fences from file
 */
function removeWrappingFence(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const language = getFenceLanguage(content);
  
  // Remove opening fence (```language + newline)
  content = content.replace(/^```\w*\r?\n/, '');
  
  // Remove closing fence (newline + ``` + optional whitespace at end)
  content = content.replace(/\r?\n```\s*$/, '');
  
  // Trim trailing newlines and add single newline
  content = content.trimEnd() + '\n';
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  return language;
}

/**
 * Determine severity based on file type
 */
function getFileImpact(filePath) {
  const name = path.basename(filePath);
  
  if (/SKILL\.md$/.test(name)) {
    return { severity: 'Critical', reason: 'Frontmatter parsing breaks' };
  }
  if (/\.instructions\.md$/.test(name)) {
    return { severity: 'Critical', reason: "VS Code won't load instruction" };
  }
  if (/\.prompt\.md$/.test(name)) {
    return { severity: 'Critical', reason: "Prompt command won't register" };
  }
  if (/synapses\.json$/.test(name)) {
    return { severity: 'Critical', reason: 'Invalid JSON' };
  }
  if (/copilot-instructions\.md$/.test(name)) {
    return { severity: 'Critical', reason: 'Core personality broken' };
  }
  if (/\.json$/.test(name)) {
    return { severity: 'Critical', reason: 'Invalid JSON' };
  }
  if (/\.md$/.test(name)) {
    return { severity: 'Medium', reason: 'Visual noise in rendering' };
  }
  return { severity: 'Low', reason: 'Unknown impact' };
}

/**
 * Format severity for display
 */
function formatSeverity(severity) {
  switch (severity) {
    case 'Critical': return '[!!] Critical';
    case 'Medium': return '[! ] Medium';
    case 'Low': return '[  ] Low';
    default: return '[  ] Unknown';
  }
}

/**
 * Recursively get all .md and .json files
 */
function getTargetFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip node_modules and .git
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && /\.(md|json)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
console.log('');
console.log('+============================================================+');
console.log('|       Wrapping Fence Bug Detector/Fixer                    |');
console.log('+============================================================+');
console.log('');

let targetFiles = [];

if (specificPath) {
  // Single file mode
  const fullPath = path.isAbsolute(specificPath) ? specificPath : path.join(process.cwd(), specificPath);
  if (fs.existsSync(fullPath)) {
    targetFiles.push(fullPath);
  } else {
    console.error(`[ERROR] File not found: ${specificPath}`);
    process.exit(1);
  }
} else {
  // Determine scan root
  let scanRoot;
  if (fullRepo) {
    scanRoot = repoRoot;
    console.log(`[DIR] Scanning full repo: ${scanRoot}`);
  } else {
    scanRoot = path.join(repoRoot, '.github');
    console.log(`[DIR] Scanning: ${scanRoot}`);
  }
  console.log('');
  
  targetFiles = getTargetFiles(scanRoot);
}

const results = [];

for (const file of targetFiles) {
  if (testWrappingFence(file)) {
    issuesFound++;
    const impact = getFileImpact(file);
    const relativePath = path.relative(repoRoot, file);
    
    const result = {
      file: relativePath,
      severity: impact.severity,
      reason: impact.reason,
      fixed: false
    };
    
    if (fix) {
      const language = removeWrappingFence(file);
      result.fixed = true;
      issuesFixed++;
      console.log(`[OK] Fixed: ${relativePath} (was \`\`\`${language})`);
    } else {
      const content = fs.readFileSync(file, 'utf8');
      const language = getFenceLanguage(content);
      console.log(`${formatSeverity(impact.severity)}: ${relativePath}`);
      console.log(`     Reason: ${impact.reason}`);
      console.log(`     Language: \`\`\`${language}`);
    }
    
    results.push(result);
  }
}

// Summary
console.log('');
console.log('============================================================');
if (fix) {
  console.log(`[OK] Fixed ${issuesFixed} of ${issuesFound} issues`);
} else {
  if (issuesFound === 0) {
    console.log('[OK] No wrapping fence bugs detected');
  } else {
    console.log(`[!!] Found ${issuesFound} files with wrapping fence bug`);
    console.log('');
    console.log('To fix automatically, run:');
    console.log('  node .github/muscles/fix-fence-bug.cjs --fix');
  }
}
console.log('============================================================');

process.exit(issuesFound > 0 && !fix ? 1 : 0);
