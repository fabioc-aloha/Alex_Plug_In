#!/usr/bin/env node
/**
 * strip-synapses-sections.cjs
 * 
 * Removes ## Synapses sections from all markdown files in .github/
 * These legacy sections are no longer used for routing and are purely
 * documentation artifacts that can be safely removed.
 * 
 * Usage:
 *   node scripts/strip-synapses-sections.cjs --dry-run   # Preview changes
 *   node scripts/strip-synapses-sections.cjs             # Execute removal
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

// Directories to process
const TARGET_DIRS = [
  '.github/instructions',
  '.github/episodic', 
  '.github/skills',
  '.github/prompts',
  '.github/agents',
  'alex_docs',
];

let filesProcessed = 0;
let filesModified = 0;
let synapseSectionsRemoved = 0;

/**
 * Remove ## Synapses section and everything until the next ## heading or EOF
 */
function stripSynapsesSection(content) {
  const lines = content.split(/\r?\n/);
  const result = [];
  let inSynapsesSection = false;
  let removed = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check for ## Synapses heading (with or without emoji/decoration)
    if (/^##\s+(?:🔗\s*)?Synapses?\s*$/i.test(trimmed)) {
      inSynapsesSection = true;
      removed = true;
      // Skip any blank lines immediately after the heading
      continue;
    }
    
    // Check if we hit the next ## heading (exit synapses section)
    if (inSynapsesSection && /^##\s+/.test(trimmed) && !/^##\s+(?:🔗\s*)?Synapses?\s*$/i.test(trimmed)) {
      inSynapsesSection = false;
    }
    
    if (!inSynapsesSection) {
      result.push(line);
    }
  }
  
  // Clean up trailing blank lines and ensure single newline at end
  let output = result.join('\n');
  output = output.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
  output = output.replace(/\n+$/, '\n'); // Single trailing newline
  
  return { content: output, removed };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  filesProcessed++;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const { content: newContent, removed } = stripSynapsesSection(content);
  
  if (removed) {
    synapseSectionsRemoved++;
    filesModified++;
    
    const relativePath = path.relative(process.cwd(), filePath);
    
    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would strip ## Synapses from: ${relativePath}`);
    } else {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Stripped ## Synapses from: ${relativePath}`);
    }
  }
}

/**
 * Recursively find all .md files in a directory
 */
function findMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main
console.log(DRY_RUN ? '=== DRY RUN MODE ===' : '=== EXECUTING REMOVAL ===');
console.log('');

for (const dir of TARGET_DIRS) {
  const fullDir = path.join(process.cwd(), dir);
  const files = findMarkdownFiles(fullDir);
  
  for (const file of files) {
    processFile(file);
  }
}

console.log('');
console.log('=== Summary ===');
console.log(`Files scanned: ${filesProcessed}`);
console.log(`Files modified: ${filesModified}`);
console.log(`Synapses sections removed: ${synapseSectionsRemoved}`);

if (DRY_RUN && filesModified > 0) {
  console.log('');
  console.log('Run without --dry-run to execute removal.');
}
