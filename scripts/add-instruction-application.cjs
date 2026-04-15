#!/usr/bin/env node
/**
 * add-instruction-application.cjs
 * Adds `application:` field to instruction frontmatter based on description
 * 
 * Run: node scripts/add-instruction-application.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const INSTRUCTIONS_DIR = path.join(__dirname, '..', '.github', 'instructions');
const DRY_RUN = process.argv.includes('--dry-run');

// Map description patterns to application phrases
function generateApplication(description, filename) {
  const desc = description.toLowerCase();
  const name = filename.replace('.instructions.md', '');
  
  // Pattern-based generation
  if (desc.includes('procedure') || desc.includes('protocol')) {
    return `When following ${name.replace(/-/g, ' ')} workflows or troubleshooting related issues`;
  }
  if (desc.includes('pattern')) {
    return `When implementing ${name.replace(/-/g, ' ')} or reviewing code that uses these patterns`;
  }
  if (desc.includes('review') || desc.includes('audit')) {
    return `During code reviews, quality audits, or when assessing ${name.replace(/-/g, ' ')}`;
  }
  if (desc.includes('design') || desc.includes('architecture')) {
    return `When designing systems, planning architecture, or making structural decisions`;
  }
  if (desc.includes('security') || desc.includes('safety')) {
    return `When implementing security controls, reviewing for vulnerabilities, or handling sensitive data`;
  }
  if (desc.includes('test') || desc.includes('validation')) {
    return `When writing tests, validating implementations, or ensuring quality gates pass`;
  }
  if (desc.includes('deploy') || desc.includes('release') || desc.includes('publish')) {
    return `During deployment, release preparation, or publishing workflows`;
  }
  if (desc.includes('debug') || desc.includes('error') || desc.includes('fix')) {
    return `When debugging issues, investigating errors, or troubleshooting failures`;
  }
  if (desc.includes('documentation') || desc.includes('docs')) {
    return `When writing or reviewing documentation, or ensuring docs stay current`;
  }
  if (desc.includes('configuration') || desc.includes('config') || desc.includes('settings')) {
    return `When configuring systems, validating settings, or troubleshooting configuration issues`;
  }
  if (desc.includes('migration') || desc.includes('upgrade')) {
    return `During migration projects, version upgrades, or modernization efforts`;
  }
  if (desc.includes('integration')) {
    return `When integrating systems, connecting APIs, or building cross-service workflows`;
  }
  if (desc.includes('optimization') || desc.includes('performance')) {
    return `When optimizing performance, profiling bottlenecks, or improving efficiency`;
  }
  if (desc.includes('api')) {
    return `When working with APIs, designing endpoints, or integrating external services`;
  }
  if (desc.includes('data') || desc.includes('analysis')) {
    return `When analyzing data, building visualizations, or creating reports`;
  }
  if (desc.includes('learning') || desc.includes('knowledge') || desc.includes('research')) {
    return `When exploring new domains, synthesizing knowledge, or building expertise`;
  }
  if (desc.includes('cognitive') || desc.includes('meditation') || desc.includes('dream')) {
    return `During cognitive maintenance, self-reflection, or architecture health checks`;
  }
  if (desc.includes('vs code') || desc.includes('vscode') || desc.includes('extension')) {
    return `When developing VS Code extensions or working with VS Code APIs`;
  }
  if (desc.includes('azure') || desc.includes('cloud')) {
    return `When working with Azure services, cloud deployments, or infrastructure`;
  }
  if (desc.includes('microsoft') || desc.includes('m365') || desc.includes('teams')) {
    return `When integrating with Microsoft 365, Teams, or Graph API`;
  }
  if (desc.includes('mcp')) {
    return `When building or integrating MCP servers and AI tool infrastructure`;
  }
  if (desc.includes('image') || desc.includes('visual') || desc.includes('brand')) {
    return `When generating images, managing visual assets, or maintaining brand consistency`;
  }
  if (desc.includes('emotional') || desc.includes('frustration') || desc.includes('tone')) {
    return `Always active — unconsciously adapts communication based on user signals`;
  }
  if (desc.includes('terminal') || desc.includes('command')) {
    return `When running terminal commands, especially those with special characters or long output`;
  }
  if (desc.includes('skill') || desc.includes('trifecta')) {
    return `When building, auditing, or promoting cognitive architecture skills`;
  }
  if (desc.includes('refactor')) {
    return `When restructuring code while preserving behavior — safe transformation patterns`;
  }
  if (desc.includes('root cause') || desc.includes('incident')) {
    return `When investigating production issues or performing post-incident analysis`;
  }
  if (desc.includes('secret') || desc.includes('credential') || desc.includes('token')) {
    return `When handling secrets, credentials, or sensitive configuration`;
  }
  if (desc.includes('roadmap') || desc.includes('planning') || desc.includes('north star')) {
    return `When aligning work to project vision or making strategic decisions`;
  }
  if (desc.includes('worldview') || desc.includes('ethical') || desc.includes('moral')) {
    return `When making ethical decisions or reasoning about values and principles`;
  }
  if (desc.includes('ui') || desc.includes('ux') || desc.includes('accessibility')) {
    return `When designing user interfaces or ensuring accessibility compliance`;
  }
  if (desc.includes('memory') || desc.includes('export')) {
    return `When managing cognitive memory or porting context to other surfaces`;
  }
  if (desc.includes('heir')) {
    return `When working in heir projects or managing architecture inheritance`;
  }
  if (desc.includes('conversion') || desc.includes('markdown') || desc.includes('word')) {
    return `When converting documents between formats or generating output files`;
  }
  if (desc.includes('presentation') || desc.includes('gamma') || desc.includes('slides')) {
    return `When creating presentations, slides, or visual storytelling content`;
  }
  if (desc.includes('chart') || desc.includes('visualization') || desc.includes('dashboard')) {
    return `When interpreting charts, building dashboards, or visualizing data`;
  }
  if (desc.includes('language detection')) {
    return `When processing text that may contain natural language content`;
  }
  if (desc.includes('log') || desc.includes('observability') || desc.includes('telemetry')) {
    return `When implementing logging, reviewing log patterns, or building observability`;
  }
  if (desc.includes('lucid') || desc.includes('dream')) {
    return `During hybrid processing modes or unconscious-conscious bridge operations`;
  }
  if (desc.includes('service worker') || desc.includes('offline') || desc.includes('pwa')) {
    return `When building offline-capable web apps or managing service worker lifecycles`;
  }
  if (desc.includes('synapse') || desc.includes('notebook')) {
    return `When developing Synapse notebooks or PySpark data pipelines`;
  }
  if (desc.includes('dependency') || desc.includes('package')) {
    return `When managing dependencies, upgrading packages, or auditing security`;
  }
  if (desc.includes('technical debt') || desc.includes('todo') || desc.includes('fixme')) {
    return `When tracking, prioritizing, or paying down technical debt`;
  }
  if (desc.includes('token') && desc.includes('waste')) {
    return `When auditing cognitive architecture for token efficiency`;
  }
  
  // Default fallback based on filename
  return `When ${name.replace(/-/g, ' ')} patterns are relevant to the current task`;
}

function processInstruction(filePath) {
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
    /^(description:\s*["'][^"']+["'])\s*\n/m,
    `$1\napplication: "${application}"\n`
  );
  
  if (newContent === content) {
    // Try without quotes
    const altContent = content.replace(
      /^(description:\s*[^\n]+)\n/m,
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
const files = fs.readdirSync(INSTRUCTIONS_DIR)
  .filter(f => f.endsWith('.instructions.md'))
  .map(f => path.join(INSTRUCTIONS_DIR, f));

console.log(`Processing ${files.length} instruction files...`);
if (DRY_RUN) console.log('DRY RUN - no files will be modified\n');

const results = files.map(processInstruction);

const updated = results.filter(r => r.status === 'updated');
const skipped = results.filter(r => r.status === 'skipped');
const errors = results.filter(r => r.status === 'error');

console.log(`\n=== Results ===`);
console.log(`Updated: ${updated.length}`);
console.log(`Skipped: ${skipped.length}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  ${e.file}: ${e.reason}`));
}

if (DRY_RUN && updated.length > 0) {
  console.log('\nWould update:');
  updated.slice(0, 10).forEach(u => console.log(`  ${u.file} -> "${u.application}"`));
  if (updated.length > 10) console.log(`  ... and ${updated.length - 10} more`);
}
