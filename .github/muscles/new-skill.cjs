#!/usr/bin/env node
// New Skill Scaffold - Create properly structured skill with frontmatter
// Location: .github/muscles/new-skill.cjs
// Cross-platform port of new-skill.ps1

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse arguments
const args = process.argv.slice(2);
const flags = {};
let skillNameArg = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && args[i + 1]) { skillNameArg = args[++i]; }
  else if (args[i] === '--inheritance' && args[i + 1]) { flags.inheritance = args[++i]; }
  else if (args[i] === '--description' && args[i + 1]) { flags.description = args[++i]; }
  else if (args[i] === '--domain' && args[i + 1]) { flags.domain = args[++i]; }
  else if (!args[i].startsWith('--')) { skillNameArg = args[i]; }
}

if (!skillNameArg) {
  console.error('Usage: node new-skill.cjs <skill-name> [--inheritance inheritable] [--description "..."] [--domain "..."]');
  console.error('  Inheritance: inheritable (default), universal, master-only, heir:vscode, heir:m365');
  process.exit(1);
}

const validInheritance = ['inheritable', 'universal', 'master-only', 'heir:vscode', 'heir:m365'];
const inheritance = flags.inheritance || 'inheritable';
if (!validInheritance.includes(inheritance)) {
  console.error(`[ERROR] Invalid inheritance: ${inheritance}. Must be one of: ${validInheritance.join(', ')}`);
  process.exit(1);
}

// Normalize skill name (kebab-case)
const skillName = skillNameArg
  .replace(/\s+/g, '-')
  .replace(/_/g, '-')
  .replace(/[^a-zA-Z0-9-]/g, '')
  .toLowerCase();

// Paths
const rootPath = path.resolve(__dirname, '..', '..');
const templatePath = path.join(rootPath, '.github', 'templates', 'skill-template');
const skillsPath = path.join(rootPath, '.github', 'skills');
const newSkillPath = path.join(skillsPath, skillName);

// Validation
if (fs.existsSync(newSkillPath)) {
  console.error(`[ERROR] Skill already exists: ${skillName}`);
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error(`[ERROR] Skill template not found: ${templatePath}`);
  process.exit(1);
}

// Create skill directory by copying template
console.log(`Creating skill: ${skillName}`);
fs.mkdirSync(newSkillPath, { recursive: true });

for (const file of fs.readdirSync(templatePath)) {
  fs.copyFileSync(path.join(templatePath, file), path.join(newSkillPath, file));
}

// Generate display name
const displayName = skillName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const today = new Date().toISOString().slice(0, 10);

// Update SKILL.md frontmatter
const skillMdPath = path.join(newSkillPath, 'SKILL.md');
let content = fs.readFileSync(skillMdPath, 'utf8');

content = content.replace('name: "Skill Name"', `name: "${displayName}"`);
if (flags.description) {
  content = content.replace(
    'description: "Brief description of what this skill provides"',
    `description: "${flags.description}"`
  );
}
if (flags.domain) {
  content = content.replace(/\*\*Domain\*\*: Primary domain.*/, `**Domain**: ${flags.domain}`);
}
content = content.replace(/\*\*Created\*\*: YYYY-MM-DD/g, `**Created**: ${today}`);
content = content.replace(/\*\*Last Updated\*\*: YYYY-MM-DD/g, `**Last Updated**: ${today}`);
content = content.replace('# Skill Name', `# ${displayName}`);

fs.writeFileSync(skillMdPath, content);

// Update synapses.json
const synapsePath = path.join(newSkillPath, 'synapses.json');
let synapseContent = fs.readFileSync(synapsePath, 'utf8');
synapseContent = synapseContent.replace('"skillId": "skill-name"', `"skillId": "${skillName}"`);
fs.writeFileSync(synapsePath, synapseContent);

// Register non-inheritable skills in SKILL_EXCLUSIONS
const syncArchPath = path.join(rootPath, '.github', 'muscles', 'sync-architecture.cjs');
if (inheritance !== 'inheritable' && inheritance !== 'universal' && fs.existsSync(syncArchPath)) {
  let syncContent = fs.readFileSync(syncArchPath, 'utf8');
  const pattern = /(const SKILL_EXCLUSIONS = \{[\s\S]*?)(\n\};)/;
  const match = syncContent.match(pattern);
  if (match) {
    const pad = ' '.repeat(Math.max(1, 33 - skillName.length));
    const newEntry = `\n    '${skillName}':${pad}'${inheritance}',`;
    syncContent = syncContent.replace(pattern, `$1${newEntry}$2`);
    fs.writeFileSync(syncArchPath, syncContent);
    console.log(`[LIST] Registered in SKILL_EXCLUSIONS as '${inheritance}'`);
  } else {
    console.warn('[WARN] Could not find SKILL_EXCLUSIONS in sync-architecture.cjs');
    console.warn(`   Manually add: '${skillName}': '${inheritance}'`);
  }
}

// Success output
console.log(`[OK] Created skill: ${skillName}`);
console.log(`   Location: .github/skills/${skillName}/`);
if (inheritance === 'inheritable' || inheritance === 'universal') {
  console.log(`   Inheritance: ${inheritance} (syncs to all heirs automatically)`);
} else {
  console.log(`   Inheritance: ${inheritance} (registered in SKILL_EXCLUSIONS)`);
}
console.log('');
console.log('Next steps:');
console.log(`  1. Edit .github/skills/${skillName}/SKILL.md`);
console.log('  2. Update synapses.json with connections');
console.log('  3. Run: node .github/muscles/brain-qa.cjs --mode schema');
console.log('  4. Add to memory-activation index if user-facing');
if (inheritance !== 'inheritable' && inheritance !== 'universal') {
  console.log(`  5. If creating trifecta siblings (.instructions.md, .prompt.md):`);
  console.log(`     Add 'inheritance: ${inheritance}' to their YAML frontmatter`);
  console.log('     to keep them excluded from the same heirs as the skill.');
}

// Open in VS Code if available
try {
  execSync(`code "${skillMdPath}"`, { stdio: 'ignore' });
  console.log('\nOpening in VS Code...');
} catch { /* code not available, skip */ }
