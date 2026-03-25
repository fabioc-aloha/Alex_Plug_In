#!/usr/bin/env node
/**
 * Cognitive Architecture Consistency Audit
 * Validates instructions, agents, prompts, skills, and cross-references.
 * 
 * Usage: node scripts/audit-architecture.cjs [--json]
 * Alex-first: Use --json for machine-consumable output
 */
const fs = require('fs');
const path = require('path');

// Alex-first: JSON output mode
const JSON_MODE = process.argv.includes('--json');

const base = process.cwd();
const issues = [];

// ── Instruction Files ──────────────────────────────────────────
console.log('=== INSTRUCTION FILES AUDIT ===');
const instrDir = path.join(base, '.github/instructions');
const instrFiles = fs.readdirSync(instrDir).filter(f => f.endsWith('.md'));
console.log('Total instruction files: ' + instrFiles.length);

const instrNames = new Set();
for (const file of instrFiles) {
  const content = fs.readFileSync(path.join(instrDir, file), 'utf8');
  const name = file.replace('.instructions.md', '');
  instrNames.add(name);

  if (!content.startsWith('---')) {
    issues.push('WARN: ' + file + ': no YAML frontmatter');
  } else {
    const frontEnd = content.indexOf('---', 3);
    if (frontEnd === -1) {
      issues.push('BUG: ' + file + ': unclosed frontmatter');
    } else {
      const fm = content.substring(3, frontEnd);
      if (!fm.includes('description:')) {
        issues.push('WARN: ' + file + ': no description in frontmatter');
      }
    }
  }

  const body = content.replace(/---[\s\S]*?---/, '').trim();
  if (body.length < 50) {
    issues.push('WARN: ' + file + ': very short body (' + body.length + ' chars)');
  }
}
// ── Trifecta Name Aliases ───────────────────────────────────────
// Alias map: trifecta name → known instruction/prompt file stems (when names don't match)
const TRIFECTA_INSTR_ALIASES = {
  'dream-state': 'dream-state-automation',
  'release-process': 'release-management',
  'research-first-development': 'research-first-workflow',
  'brain-qa': 'cognitive-health-validation',
  'architecture-audit': 'semantic-audit',
  'gamma-presentations': 'gamma-presentation',
  'code-review': 'code-review-guidelines',
  'global-knowledge': 'global-knowledge-curation',
};
const TRIFECTA_PROMPT_ALIASES = {
  'meditation': 'meditate',
  'dream-state': 'dream',
  'self-actualization': 'selfactualize',
  'release-process': 'release',
  'brand-asset-management': 'brand',
  'research-first-development': 'gapanalysis',
  'brain-qa': 'brainqa',
  'architecture-audit': 'masteraudit',
  'bootstrap-learning': 'learn',
  'vscode-configuration-validation': 'validate-config',
  'ui-ux-design': 'ui-ux-audit',
  'md-to-word': 'word',
  'gamma-presentations': 'gamma',
  'secrets-management': 'secrets',
  'chat-participant-patterns': 'chat-participant',
  'vscode-extension-patterns': 'vscode-extension-audit',
  'mcp-development': 'mcp-server',
  'microsoft-graph-api': 'graph-api',
  'teams-app-patterns': 'teams-app',
  'm365-agent-debugging': 'm365-agent-debug',
  'testing-strategies': 'tdd',
  'knowledge-synthesis': 'knowledge',
  'north-star': 'northstar',
  'code-review': 'review',
  'refactoring-patterns': 'refactor',
  'debugging-patterns': 'debug',
  'global-knowledge': 'knowledge',
  'ai-writing-avoidance': 'audit-writing',
  'memory-export': 'export-memory',
};
// ── Copilot-Instructions Cross-Reference ───────────────────────
const ci = fs.readFileSync(path.join(base, '.github/copilot-instructions.md'), 'utf8');
const trifectaMatch = ci.match(/Complete trifectas \((\d+)\): ([^\n]+)/);
let trifectas = [];
if (trifectaMatch) {
  trifectas = trifectaMatch[2].split(', ').map(t => t.trim());
  const claimedCount = parseInt(trifectaMatch[1], 10);
  console.log('Trifectas listed: ' + trifectas.length + ' (claimed: ' + claimedCount + ')');
  if (trifectas.length !== claimedCount) {
    issues.push('BUG: copilot-instructions.md claims ' + claimedCount + ' trifectas but lists ' + trifectas.length);
  }

  for (const t of trifectas) {
    const alias = TRIFECTA_INSTR_ALIASES[t];
    if (!instrNames.has(t) && !(alias && instrNames.has(alias))) {
      issues.push('WARN: trifecta "' + t + '" has no matching instruction file');
    }
  }
}

// Instructions that exist but aren't in trifecta list
const trifectaSet = new Set(trifectas);
const instrOnly = [...instrNames].filter(n => !trifectaSet.has(n));
console.log('Instruction files not in trifecta list: ' + instrOnly.length);
if (instrOnly.length > 0 && instrOnly.length <= 30) {
  console.log('  -> ' + instrOnly.join(', '));
}

// ── Agent Files ────────────────────────────────────────────────
console.log('\n=== AGENT FILES AUDIT ===');
const agentDir = path.join(base, '.github/agents');
const agentFiles = fs.existsSync(agentDir)
  ? fs.readdirSync(agentDir).filter(f => f.endsWith('.md'))
  : [];
console.log('Total agent files: ' + agentFiles.length);

const agentListMatch = ci.match(/Alex \(orchestrator\)[^\n]*/);
if (agentListMatch) {
  const agentNames = agentListMatch[0]
    .split(', ')
    .map(a => a.replace(/\(.*?\)/g, '').trim().toLowerCase());
  console.log('Agents listed in copilot-instructions.md: ' + agentNames.length);

  const agentFileNames = agentFiles.map(f =>
    f.replace('.agent.md', '').toLowerCase()
  );

  for (const a of agentNames) {
    // Match either exact name or alex-{name} prefix convention
    const found = agentFileNames.includes(a) || agentFileNames.includes('alex-' + a);
    if (!found) {
      issues.push('WARN: agent "' + a + '" listed in CI but no .agent.md file');
    }
  }
  for (const af of agentFileNames) {
    // Match either exact name or strip alex- prefix
    const stripped = af.startsWith('alex-') ? af.slice(5) : af;
    const found = agentNames.includes(af) || agentNames.includes(stripped);
    if (!found) {
      issues.push('WARN: agent file "' + af + '.agent.md" exists but not listed in CI');
    }
  }
}

for (const file of agentFiles) {
  const content = fs.readFileSync(path.join(agentDir, file), 'utf8');
  if (!content.startsWith('---')) {
    issues.push('WARN: ' + file + ': no YAML frontmatter');
  } else {
    const frontEnd = content.indexOf('---', 3);
    if (frontEnd > 0) {
      const fm = content.substring(3, frontEnd);
      if (!fm.includes('description:')) {
        issues.push('WARN: ' + file + ': no description in frontmatter');
      }
    }
  }
}

// ── Prompt Files ───────────────────────────────────────────────
console.log('\n=== PROMPT FILES AUDIT ===');
const promptDir = path.join(base, '.github/prompts');
const promptFiles = fs.existsSync(promptDir)
  ? fs.readdirSync(promptDir).filter(f => f.endsWith('.md'))
  : [];
console.log('Total prompt files: ' + promptFiles.length);

for (const file of promptFiles) {
  const content = fs.readFileSync(path.join(promptDir, file), 'utf8');
  if (!content.startsWith('---')) {
    issues.push('WARN: ' + file + ': no YAML frontmatter');
  } else {
    const frontEnd = content.indexOf('---', 3);
    if (frontEnd > 0) {
      const fm = content.substring(3, frontEnd);
      if (!fm.includes('description:')) {
        issues.push('WARN: ' + file + ': no description in frontmatter');
      }
    }
  }
}

// ── Skill Directory Completeness ───────────────────────────────
console.log('\n=== SKILL DIRECTORY AUDIT ===');
const skillDir = path.join(base, '.github/skills');
const skillDirs = fs
  .readdirSync(skillDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);
console.log('Total skill directories: ' + skillDirs.length);

let missingSkillMd = 0;
let missingSynapses = 0;
for (const dir of skillDirs) {
  if (!fs.existsSync(path.join(skillDir, dir, 'SKILL.md'))) {
    issues.push('BUG: skill "' + dir + '" missing SKILL.md');
    missingSkillMd++;
  }
  if (!fs.existsSync(path.join(skillDir, dir, 'synapses.json'))) {
    issues.push('BUG: skill "' + dir + '" missing synapses.json');
    missingSynapses++;
  }
}
console.log('Missing SKILL.md: ' + missingSkillMd);
console.log('Missing synapses.json: ' + missingSynapses);

// Skills not in trifecta list
const nonTrifecta = skillDirs.filter(d => !trifectaSet.has(d));
console.log('Skill dirs not in trifecta list: ' + nonTrifecta.length);
if (nonTrifecta.length > 0 && nonTrifecta.length <= 80) {
  console.log('  -> ' + nonTrifecta.join(', '));
}

// Trifectas without skill directories
for (const t of trifectas) {
  if (!skillDirs.includes(t)) {
    issues.push('BUG: trifecta "' + t + '" has no skill directory');
  }
}

// ── Trifecta Completeness (Skill + Instruction + Prompt) ──────
console.log('\n=== TRIFECTA COMPLETENESS ===');
let completeCount = 0;
let incompleteDetails = [];
for (const t of trifectas) {
  const hasSkill = skillDirs.includes(t);
  const instrAlias = TRIFECTA_INSTR_ALIASES[t];
  const hasInstr = instrNames.has(t) || (instrAlias && instrNames.has(instrAlias));
  const promptAlias = TRIFECTA_PROMPT_ALIASES[t];
  const hasPrompt = promptFiles.some(f => f.startsWith(t)) || (promptAlias && promptFiles.some(f => f.startsWith(promptAlias)));
  const missing = [];
  if (!hasSkill) missing.push('skill');
  if (!hasInstr) missing.push('instruction');
  if (!hasPrompt) missing.push('prompt');
  if (missing.length === 0) {
    completeCount++;
  } else {
    incompleteDetails.push(t + ' (missing: ' + missing.join(', ') + ')');
  }
}
console.log('Fully complete trifectas: ' + completeCount + '/' + trifectas.length);
if (incompleteDetails.length > 0) {
  console.log('Incomplete:');
  incompleteDetails.forEach(d => console.log('  - ' + d));
}

// ── Config Files ───────────────────────────────────────────────
console.log('\n=== CONFIG FILES AUDIT ===');
const configDir = path.join(base, '.github/config');
if (fs.existsSync(configDir)) {
  const configFiles = fs.readdirSync(configDir);
  console.log('Config files: ' + configFiles.join(', '));
  
  // Validate JSON config files
  for (const cf of configFiles.filter(f => f.endsWith('.json'))) {
    try {
      JSON.parse(fs.readFileSync(path.join(configDir, cf), 'utf8'));
    } catch (e) {
      issues.push('BUG: config/' + cf + ': invalid JSON - ' + e.message);
    }
  }
} else {
  console.log('No config directory found');
}

// ── Hooks ──────────────────────────────────────────────────────
console.log('\n=== HOOKS AUDIT ===');
const hooksFile = path.join(base, '.github/hooks.json');
if (fs.existsSync(hooksFile)) {
  try {
    const hooksData = JSON.parse(fs.readFileSync(hooksFile, 'utf8'));
    // hooks.json maps event names -> arrays of hook groups -> hooks[]
    const hookMap = hooksData.hooks || hooksData;
    const hookEntries = [];
    if (typeof hookMap === 'object' && !Array.isArray(hookMap)) {
      for (const [event, groups] of Object.entries(hookMap)) {
        if (Array.isArray(groups)) {
          for (const group of groups) {
            if (group.hooks && Array.isArray(group.hooks)) {
              for (const h of group.hooks) {
                hookEntries.push({ ...h, event });
              }
            }
          }
        }
      }
    } else if (Array.isArray(hookMap)) {
      hookEntries.push(...hookMap);
    }
    console.log('Hooks defined: ' + hookEntries.length);
    
    // Check each hook references valid muscle files
    for (const hook of hookEntries) {
      if (hook.command) {
        // Extract script path from command
        const scriptMatch = hook.command.match(/(?:node|pwsh|tsx)\s+([^\s]+)/);
        if (scriptMatch) {
          const scriptPath = path.join(base, scriptMatch[1]);
          if (!fs.existsSync(scriptPath)) {
            issues.push('BUG: hook references missing script: ' + scriptMatch[1]);
          }
        }
      }
    }
  } catch (e) {
    issues.push('BUG: hooks.json invalid JSON - ' + e.message);
  }
} else {
  console.log('No hooks.json found');
}

// ── Summary ────────────────────────────────────────────────────
const bugs = issues.filter(i => i.startsWith('BUG:'));
const warns = issues.filter(i => i.startsWith('WARN:'));

// Alex-first: JSON output
if (JSON_MODE) {
    const jsonResult = {
        passed: bugs.length === 0,
        counts: {
            instructions: instrFiles.length,
            agents: agentFiles.length,
            prompts: promptFiles.length,
            skills: skillDirs.length,
            trifectas: trifectas.length,
            completeTrifectas: completeCount
        },
        bugs: bugs.map(b => b.replace('BUG: ', '')),
        warnings: warns.map(w => w.replace('WARN: ', '')),
        incompleteTrifeyctas: incompleteDetails
    };
    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(bugs.length > 0 ? 1 : 0);
}

console.log('\n=== ISSUES (' + issues.length + ': ' + bugs.length + ' bugs, ' + warns.length + ' warnings) ===');
issues.forEach(i => console.log('  ' + i));

process.exit(bugs.length > 0 ? 1 : 0);
