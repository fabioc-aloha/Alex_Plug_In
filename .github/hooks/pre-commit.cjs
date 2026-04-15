#!/usr/bin/env node
/**
 * @inheritance inheritable
 * Git Pre-Commit Hook - Quality Gates for Alex Architecture
 * Cross-platform port of pre-commit.ps1
 * 
 * Location: .git/hooks/pre-commit (installed by install-hooks.cjs)
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// Valid connection types for synapses
const validTypes = ['implements', 'extends', 'activates', 'complements', 'uses', 'feeds', 'consumes', 'relates', 'supports', 'requires'];

/**
 * Get staged files from git
 */
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f);
  } catch (err) {
    return [];
  }
}

/**
 * Categorize files by type
 */
function categorizeFiles(files) {
  return {
    skills: files.filter(f => /^\.github\/skills\/[^\/]+\/SKILL\.md$/.test(f)),
    synapses: files.filter(f => /\.github\/skills\/[^\/]+\/synapses\.json$/.test(f)),
    episodic: files.filter(f => /^\.github\/episodic\//.test(f)),
    instructions: files.filter(f => /^\.github\/instructions\//.test(f)),
    trifecta: files.filter(f => /\.(instructions|prompt)\.md$/.test(f))
  };
}

// ============================================================
// CHECK 1: SKILL.md YAML frontmatter
// ============================================================
function validateSkillFiles(files) {
  if (files.length === 0) return;
  
  console.log('  Validating SKILL.md frontmatter...');
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    
    if (/^```/.test(content)) {
      errors.push(`${file}: Wrapped in code fence -- run: node .github/muscles/fix-fence-bug.cjs --fix --path ${file}`);
    } else if (!/^---\s*\r?\n/.test(content)) {
      errors.push(`${file}: Missing YAML frontmatter (must start with ---)`);
    } else {
      const fmMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
      if (fmMatch) {
        const fm = fmMatch[1];
        if (!/name:\s*['"]?[\w\-\s]+/.test(fm)) {
          errors.push(`${file}: Missing 'name:' in frontmatter`);
        }
        if (!/description:\s*['"]?.+/.test(fm)) {
          errors.push(`${file}: Missing 'description:' in frontmatter`);
        }
      } else {
        errors.push(`${file}: Malformed YAML frontmatter (missing closing ---)`);
      }
    }
  }
}

// ============================================================
// CHECK 1b: .instructions.md and .prompt.md fence detection
// ============================================================
function validateTrifectaFiles(files) {
  if (files.length === 0) return;
  
  console.log('  Validating trifecta file headers...');
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    
    if (/^```/.test(content)) {
      errors.push(`${file}: Wrapped in code fence -- run: node .github/muscles/fix-fence-bug.cjs --fix --path ${file}`);
    } else if (!/^---\s*\r?\n/.test(content)) {
      errors.push(`${file}: Missing YAML frontmatter (must start with ---)`);
    }
  }
}

// ============================================================
// CHECK 2: synapses.json structure + connection type validation
// ============================================================
function validateSynapseFiles(files) {
  if (files.length === 0) return;
  
  console.log('  Validating synapses.json...');
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const syn = JSON.parse(content);
      
      if (syn.inheritance) {
        warnings.push(`${file}: Stale 'inheritance' field (centralized in sync-architecture.cjs)`);
      }
      
      if (!syn.skillId) {
        errors.push(`${file}: Missing 'skillId' field`);
      }
      
      if (syn.connections) {
        for (const conn of syn.connections) {
          if (conn.type && !validTypes.includes(conn.type)) {
            errors.push(`${file}: Invalid connection type '${conn.type}' -> ${conn.target}. Valid: ${validTypes.join(', ')}`);
          }
          if (conn.when && conn.reason && conn.when === conn.reason) {
            warnings.push(`${file}: when==reason duplication for target '${conn.target}' -- when should be a trigger, reason should explain why`);
          }
        }
      }
    } catch (err) {
      errors.push(`${file}: Invalid JSON - ${err.message}`);
    }
  }
}

// ============================================================
// CHECK 3: Episodic file naming
// ============================================================
function validateEpisodicFiles(files) {
  if (files.length === 0) return;
  
  console.log('  Validating episodic naming...');
  
  for (const file of files) {
    const fileName = path.basename(file);
    
    // Reject legacy .prompt.md format
    if (/\.prompt\.md$/.test(fileName)) {
      errors.push(`${file}: Legacy .prompt.md format not allowed. Use .md instead.`);
    }
    
    // Enforce naming conventions
    if (fileName !== '.markdownlint.json' && 
        !/^(dream-report-|dream-|meditation-|self-actualization-|session-|chronicle-)/.test(fileName)) {
      warnings.push(`${file}: Non-standard naming (should start with dream-, meditation-, session-, etc.)`);
    }
    
    // Require dates
    if (!/\d{4}-\d{2}-\d{2}/.test(fileName) && fileName !== '.markdownlint.json') {
      warnings.push(`${file}: Missing date in filename (YYYY-MM-DD)`);
    }
  }
}

// ============================================================
// CHECK 4: Master-only contamination prevention
// ============================================================
function validateMasterOnlyRefs(files) {
  if (files.length === 0) return;
  
  console.log('  Checking for master-only references...');
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    // Check for master-only paths in inheritable skills
    if (/synapses\.json$/.test(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const syn = JSON.parse(content);
        
        const inheritance = syn.inheritance || 'inheritable';
        if (['inheritable', 'universal'].includes(inheritance)) {
          if (syn.connections) {
            for (const conn of syn.connections) {
              const target = conn.target || '';
              if (/(ROADMAP|alex_docs\/|platforms\/(?!vscode-extension)|MASTER-ALEX-PROTECTED)/.test(target)) {
                warnings.push(`${file}: Inheritable skill references master-only path: ${target}`);
              }
            }
          }
        }
      } catch (err) {
        // Already handled in validateSynapseFiles
      }
    }
  }
}

// ============================================================
// MAIN
// ============================================================
console.log('[HOOK] Running Alex quality gates...');

const stagedFiles = getStagedFiles();
const categorized = categorizeFiles(stagedFiles);

validateSkillFiles(categorized.skills);
validateTrifectaFiles(categorized.trifecta);
validateSynapseFiles(categorized.synapses);
validateEpisodicFiles(categorized.episodic);
validateMasterOnlyRefs([...categorized.synapses, ...categorized.instructions]);

// ============================================================
// REPORT & DECISION
// ============================================================
if (warnings.length > 0) {
  console.log('');
  console.log(`\x1b[33m[WARN] WARNINGS (${warnings.length}):\x1b[0m`);
  for (const w of warnings) {
    console.log(`   ${w}`);
  }
}

if (errors.length > 0) {
  console.log('');
  console.log('\x1b[31m[ERROR] COMMIT BLOCKED - Fix these errors:\x1b[0m');
  for (const e of errors) {
    console.log(`   ${e}`);
  }
  console.log('');
  console.log('\x1b[33mRun this to validate:\x1b[0m');
  console.log('  node .github/muscles/brain-qa.cjs');
  console.log('');
  process.exit(1);
}

console.log('\x1b[32m[OK] Quality gates passed\x1b[0m');
process.exit(0);
