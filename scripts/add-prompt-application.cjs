#!/usr/bin/env node
/**
 * add-prompt-application.cjs
 * Adds `application:` field to prompt frontmatter based on description
 * 
 * Run: node scripts/add-prompt-application.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, '..', '.github', 'prompts');
const DRY_RUN = process.argv.includes('--dry-run');

// Map description patterns to application phrases
function generateApplication(description, filename) {
  const desc = description.toLowerCase();
  const name = filename.replace('.prompt.md', '');
  
  // Prompt-specific patterns (workflows user invokes)
  if (desc.includes('meditation') || desc.includes('consolidat')) {
    return 'When requesting knowledge consolidation, neural maintenance, or reflective sessions';
  }
  if (desc.includes('dream') || desc.includes('sleep') || desc.includes('unconscious')) {
    return 'When requesting dream-state processing or background neural maintenance';
  }
  if (desc.includes('audit') || desc.includes('health') || desc.includes('brain-qa')) {
    return 'When requesting architecture health checks, quality audits, or validation';
  }
  if (desc.includes('release') || desc.includes('publish') || desc.includes('deploy')) {
    return 'When preparing releases, publishing artifacts, or deployment workflows';
  }
  if (desc.includes('research') || desc.includes('learn') || desc.includes('bootstrap')) {
    return 'When starting research sessions or learning new domains';
  }
  if (desc.includes('review') || desc.includes('code review')) {
    return 'When requesting code reviews, PR feedback, or quality assessment';
  }
  if (desc.includes('debug') || desc.includes('troubleshoot') || desc.includes('investigate')) {
    return 'When debugging issues, investigating failures, or root cause analysis';
  }
  if (desc.includes('refactor') || desc.includes('restructure')) {
    return 'When requesting code restructuring or architecture improvements';
  }
  if (desc.includes('document') || desc.includes('docs') || desc.includes('readme')) {
    return 'When generating documentation, READMEs, or technical writing';
  }
  if (desc.includes('test') || desc.includes('spec') || desc.includes('validation')) {
    return 'When generating tests, test plans, or validation strategies';
  }
  if (desc.includes('scaffold') || desc.includes('create') || desc.includes('new project')) {
    return 'When scaffolding new projects, files, or architecture components';
  }
  if (desc.includes('migration') || desc.includes('upgrade') || desc.includes('moderniz')) {
    return 'When planning migrations, upgrades, or modernization efforts';
  }
  if (desc.includes('security') || desc.includes('vulnerability') || desc.includes('threat')) {
    return 'When conducting security reviews, threat modeling, or vulnerability assessment';
  }
  if (desc.includes('performance') || desc.includes('optimize') || desc.includes('profil')) {
    return 'When optimizing performance or investigating bottlenecks';
  }
  if (desc.includes('api') || desc.includes('endpoint') || desc.includes('integration')) {
    return 'When designing APIs, integrations, or service interfaces';
  }
  if (desc.includes('data') || desc.includes('analysis') || desc.includes('visual')) {
    return 'When analyzing data, creating visualizations, or building reports';
  }
  if (desc.includes('presentation') || desc.includes('slide') || desc.includes('deck')) {
    return 'When creating presentations, slides, or visual narratives';
  }
  if (desc.includes('skill') || desc.includes('trifecta') || desc.includes('capability')) {
    return 'When building, assessing, or promoting cognitive skills';
  }
  if (desc.includes('prompt') || desc.includes('instruction') || desc.includes('agent')) {
    return 'When developing prompts, instructions, or agent configurations';
  }
  if (desc.includes('heir') || desc.includes('inherit') || desc.includes('bootstrap')) {
    return 'When configuring heir projects or managing architecture inheritance';
  }
  if (desc.includes('convert') || desc.includes('transform') || desc.includes('export')) {
    return 'When converting between formats or exporting content';
  }
  if (desc.includes('image') || desc.includes('banner') || desc.includes('visual') || desc.includes('character')) {
    return 'When generating images, banners, or visual assets';
  }
  if (desc.includes('plan') || desc.includes('roadmap') || desc.includes('strategy')) {
    return 'When creating plans, roadmaps, or strategic documents';
  }
  if (desc.includes('feedback') || desc.includes('retrospective') || desc.includes('retro')) {
    return 'When conducting retrospectives or gathering feedback';
  }
  if (desc.includes('onboard') || desc.includes('welcome') || desc.includes('intro')) {
    return 'When onboarding to projects or introducing workflows';
  }
  if (desc.includes('self-') || desc.includes('actuali') || desc.includes('assess')) {
    return 'When performing self-assessment or actualization workflows';
  }
  if (desc.includes('cognitive') || desc.includes('architecture') || desc.includes('neural')) {
    return 'When maintaining cognitive architecture or neural systems';
  }
  if (desc.includes('sync') || desc.includes('reconcil') || desc.includes('drift')) {
    return 'When synchronizing systems or detecting drift';
  }
  if (desc.includes('fix') || desc.includes('repair') || desc.includes('heal')) {
    return 'When repairing issues or healing system inconsistencies';
  }
  if (desc.includes('github') || desc.includes('pr') || desc.includes('issue')) {
    return 'When working with GitHub PRs, issues, or repository operations';
  }
  if (desc.includes('azure') || desc.includes('cloud') || desc.includes('deploy')) {
    return 'When deploying to Azure or managing cloud resources';
  }
  if (desc.includes('vscode') || desc.includes('extension')) {
    return 'When developing or maintaining VS Code extensions';
  }
  if (desc.includes('mcp') || desc.includes('tool')) {
    return 'When building MCP servers or AI tool integrations';
  }
  if (desc.includes('observ') || desc.includes('monitor') || desc.includes('log')) {
    return 'When setting up observability, monitoring, or logging';
  }
  
  // Default fallback based on filename
  const friendlyName = name.replace(/-/g, ' ');
  return `When requesting ${friendlyName} workflows`;
}

function processPrompt(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  // Skip if already has application
  if (/^application:/m.test(content)) {
    return { file: filename, status: 'skipped', reason: 'already has application' };
  }
  
  // Skip if no frontmatter
  if (!content.startsWith('---')) {
    return { file: filename, status: 'skipped', reason: 'no frontmatter' };
  }
  
  // Extract description
  const descMatch = content.match(/^description:\s*["']?([^"'\n]+)/m);
  if (!descMatch) {
    return { file: filename, status: 'skipped', reason: 'no description' };
  }
  
  const description = descMatch[1].trim();
  const application = generateApplication(description, filename);
  
  // Insert application after description
  const newContent = content.replace(
    /^(description:\s*["'][^"']+["'])\s*\r?\n/m,
    `$1\napplication: "${application}"\n`
  );
  
  if (newContent === content) {
    // Try without quotes around description
    const altContent = content.replace(
      /^(description:\s*[^\n]+)\r?\n/m,
      `$1\napplication: "${application}"\n`
    );
    if (altContent === content) {
      return { file: filename, status: 'error', reason: 'failed to insert application' };
    }
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, altContent, 'utf8');
    }
    return { file: filename, status: 'updated', application };
  }
  
  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
  return { file: filename, status: 'updated', application };
}

// Main
const files = fs.readdirSync(PROMPTS_DIR)
  .filter(f => f.endsWith('.prompt.md'))
  .map(f => path.join(PROMPTS_DIR, f));

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Processing ${files.length} prompts...\n`);

const results = files.map(processPrompt);

const updated = results.filter(r => r.status === 'updated');
const skipped = results.filter(r => r.status === 'skipped');
const errors = results.filter(r => r.status === 'error');

console.log('=== UPDATED ===');
updated.forEach(r => console.log(`  ✓ ${r.file}`));

console.log('\n=== SKIPPED ===');
skipped.forEach(r => console.log(`  - ${r.file}: ${r.reason}`));

if (errors.length > 0) {
  console.log('\n=== ERRORS ===');
  errors.forEach(r => console.log(`  ✗ ${r.file}: ${r.reason}`));
}

console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Summary: ${updated.length} updated, ${skipped.length} skipped, ${errors.length} errors`);
