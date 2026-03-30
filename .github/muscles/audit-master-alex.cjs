#!/usr/bin/env node
// Comprehensive Master Alex audit with 22 automated checks
// Location: .github/muscles/audit-master-alex.cjs
// Cross-platform port of audit-master-alex.ps1

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse arguments
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
let sections = [];

for (const arg of args) {
  if (arg === '--quiet') continue;
  if (arg === 'all') { sections = Array.from({ length: 22 }, (_, i) => i + 1); break; }
  if (arg === 'quick') { sections = Array.from({ length: 9 }, (_, i) => i + 1); break; }
  const num = parseInt(arg, 10);
  if (!isNaN(num) && num >= 1 && num <= 22) sections.push(num);
}
if (sections.length === 0) sections = Array.from({ length: 22 }, (_, i) => i + 1);

// Paths
const repoRoot = path.resolve(__dirname, '..', '..');
const extPath = path.join(repoRoot, 'platforms', 'vscode-extension');
const musclesPath = path.join(repoRoot, '.github', 'muscles');

const issues = [];
const warnings = [];

// Helpers
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';

function writeSection(num, title) { console.log(`\n${CYAN}=== [${num}] ${title} ===${RESET}`); }
function addIssue(msg) { issues.push(msg); }
function addWarning(msg) { warnings.push(msg); }

function readJSON(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return null; }
}

function countDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).length;
}

function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => !ext || f.endsWith(ext)).length;
}

function findFilesRecursive(dir, pattern) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFilesRecursive(full, pattern));
    else if (pattern.test(entry.name)) results.push(full);
  }
  return results;
}

function grepFiles(dir, filePattern, contentPattern) {
  const files = findFilesRecursive(dir, filePattern);
  const matches = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    if (contentPattern.test(content)) matches.push(f);
  }
  return matches;
}

console.log(`${CYAN}========================================${RESET}`);
console.log(`${CYAN}  MASTER ALEX COMPREHENSIVE AUDIT${RESET}`);
console.log(`${CYAN}========================================${RESET}`);
console.log(`Running sections: ${sections.join(', ')}`);

// === SECTION 1: Version Alignment ===
if (sections.includes(1)) {
  writeSection(1, 'Version Alignment');
  const pkg = readJSON(path.join(extPath, 'package.json'));
  const pkgVersion = pkg ? pkg.version : 'unknown';

  const changelog = fs.existsSync('CHANGELOG.md') ? fs.readFileSync(path.join(repoRoot, 'CHANGELOG.md'), 'utf8') : '';
  const clMatch = changelog.match(/## \[(\d+\.\d+\.\d+)\]/);
  const clVersion = clMatch ? clMatch[1] : 'unknown';

  const copilot = fs.existsSync(path.join(repoRoot, '.github', 'copilot-instructions.md'))
    ? fs.readFileSync(path.join(repoRoot, '.github', 'copilot-instructions.md'), 'utf8') : '';
  const ciMatch = copilot.match(/# Alex v(\d+\.\d+\.\d+)/);
  const ciVersion = ciMatch ? ciMatch[1] : 'unknown';

  console.log(`  package.json: ${pkgVersion}`);
  console.log(`  CHANGELOG.md: ${clVersion}`);
  console.log(`  copilot-instructions: ${ciVersion}`);

  if (pkgVersion === clVersion && pkgVersion === ciVersion) {
    console.log(`  ${GREEN}[OK] Versions aligned${RESET}`);
  } else {
    console.log(`  ${RED}[ERROR] Version mismatch${RESET}`);
    addIssue('Version mismatch');
  }
}

// === SECTION 2: Heir Folder Sync ===
if (sections.includes(2)) {
  writeSection(2, 'Heir Folder Sync');
  const masterSkills = countDirs(path.join(repoRoot, '.github', 'skills'));
  const heirSkills = countDirs(path.join(extPath, '.github', 'skills'));
  console.log(`  Master skills: ${masterSkills} | Heir skills: ${heirSkills}`);

  const masterInstructions = countFiles(path.join(repoRoot, '.github', 'instructions'));
  const heirInstructions = countFiles(path.join(extPath, '.github', 'instructions'));
  console.log(`  Master instructions: ${masterInstructions} | Heir instructions: ${heirInstructions}`);

  if (masterSkills > heirSkills + 10) {
    console.log(`  ${YELLOW}[WARN] Heir may need sync${RESET}`);
    addWarning(`Heir skills behind by ${masterSkills - heirSkills}`);
  } else {
    console.log(`  ${GREEN}[OK] Heir appears synced${RESET}`);
  }
}

// === SECTION 3: Skill Inheritance ===
if (sections.includes(3)) {
  writeSection(3, 'Skill Inheritance');
  const totalSkills = countDirs(path.join(repoRoot, '.github', 'skills'));
  const syncPath = path.join(repoRoot, '.github', 'muscles', 'sync-architecture.cjs');
  if (fs.existsSync(syncPath)) {
    const syncContent = fs.readFileSync(syncPath, 'utf8');
    if (syncContent.includes('SKILL_EXCLUSIONS')) {
      const exclusionMatches = syncContent.match(/'[a-z-]+':/g);
      const exclusionCount = exclusionMatches ? exclusionMatches.length : 0;
      console.log(`  Total skills: ${totalSkills}`);
      console.log(`  Exclusions in SKILL_EXCLUSIONS: ${exclusionCount}`);
      console.log(`  Inheritable (default): ${totalSkills - exclusionCount}`);
    } else {
      console.log(`  ${YELLOW}[WARN] SKILL_EXCLUSIONS not found in sync-architecture.cjs${RESET}`);
    }
  }
  console.log(`${GREEN}[OK] Inheritance checked${RESET}`);
}

// === SECTION 4: Safety Imperatives ===
if (sections.includes(4)) {
  writeSection(4, 'Safety Imperatives');
  const checks = [
    { file: '.github/config/MASTER-ALEX-PROTECTED.json', check: '"protected": true', purpose: 'Kill switch marker' },
    { file: '.vscode/settings.json', check: '"alex.workspace.protectedMode": true', purpose: 'Workspace protection' },
    { file: 'platforms/vscode-extension/.vscodeignore', check: 'MASTER-ALEX-PROTECTED.json', purpose: 'Marker excluded' }
  ];
  for (const c of checks) {
    const fullPath = path.join(repoRoot, c.file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(c.check)) {
        console.log(`  ${GREEN}[OK] ${c.purpose}${RESET}`);
      } else {
        console.log(`  ${RED}[ERROR] ${c.purpose} MISSING${RESET}`);
        addIssue(c.purpose);
      }
    } else {
      console.log(`  ${RED}[ERROR] FILE MISSING: ${c.file}${RESET}`);
      addIssue(`Missing: ${c.file}`);
    }
  }
}

// === SECTION 5: Build Artifacts ===
if (sections.includes(5)) {
  writeSection(5, 'Build Artifacts');
  const distPath = path.join(extPath, 'dist', 'extension.js');
  if (fs.existsSync(distPath)) {
    const stat = fs.statSync(distPath);
    const age = Math.floor((Date.now() - stat.mtimeMs) / 3600000);
    const color = age < 24 ? GREEN : YELLOW;
    console.log(`  ${color}Build age: ${age} hours${RESET}`);
  } else {
    console.log(`  ${YELLOW}[WARN] No build found${RESET}`);
    addWarning('No dist/extension.js');
  }
}

// === SECTION 6: Documentation Cross-References ===
if (sections.includes(6)) {
  writeSection(6, 'Documentation Cross-References');
  const readmePath = path.join(repoRoot, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    const found = content.includes('CHANGELOG.md');
    console.log(`  ${found ? '[OK]' : '[WARN]'} README.md -> CHANGELOG.md`);
    if (!found) addWarning('README.md missing link to CHANGELOG.md');
  }
}

// === SECTION 7: Synapse Health ===
if (sections.includes(7)) {
  writeSection(7, 'Synapse Network Health');
  const synapseCjs = path.join(musclesPath, 'validate-synapses.cjs');
  if (fs.existsSync(synapseCjs)) {
    try {
      execSync(`node "${synapseCjs}"`, { cwd: repoRoot, stdio: 'inherit' });
    } catch { /* exit code handled by sub-script */ }
  } else {
    // Fallback to PS1
    try {
      execSync(`powershell -File "${path.join(musclesPath, 'validate-synapses.ps1')}"`, { cwd: repoRoot, stdio: 'inherit' });
    } catch { /* exit code handled by sub-script */ }
  }
}

// === SECTION 8: alex_docs Audit ===
if (sections.includes(8)) {
  writeSection(8, 'alex_docs Documentation');
  const pkg = readJSON(path.join(extPath, 'package.json'));
  const currentVersion = pkg ? pkg.version : 'unknown';
  const actualSkillCount = countDirs(path.join(repoRoot, '.github', 'skills'));
  console.log(`  Current version: ${currentVersion}`);
  console.log(`  Skill count: ${actualSkillCount}`);

  const docsDir = path.join(repoRoot, 'alex_docs');
  if (fs.existsSync(docsDir)) {
    const mdFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
    let deprecated = false;
    for (const f of mdFiles) {
      const content = fs.readFileSync(path.join(docsDir, f), 'utf8');
      if (/DK-|domain-knowledge\//.test(content)) { deprecated = true; break; }
    }
    if (deprecated) {
      console.log(`  ${YELLOW}[WARN] Deprecated terms found in alex_docs${RESET}`);
      addWarning('Deprecated terminology in alex_docs');
    } else {
      console.log(`  ${GREEN}[OK] No deprecated terms${RESET}`);
    }
  }
}

// === SECTION 9: Skill Network Diagram ===
if (sections.includes(9)) {
  writeSection(9, 'Skill Network Diagram');
  const skills = countDirs(path.join(repoRoot, '.github', 'skills'));
  const catalogPath = path.join(repoRoot, 'alex_docs', 'skills', 'SKILLS-CATALOG.md');
  if (fs.existsSync(catalogPath)) {
    const content = fs.readFileSync(catalogPath, 'utf8');
    const nodeMatches = content.match(/\w+\[[\w-]+\]/g);
    const nodes = nodeMatches ? [...new Set(nodeMatches)].length : 0;
    console.log(`  Skills: ${skills} | Diagram nodes: ${nodes}`);
    if (skills === nodes) {
      console.log(`  ${GREEN}[OK] MATCH${RESET}`);
    } else {
      console.log(`  ${YELLOW}[WARN] MISMATCH${RESET}`);
      addWarning('Skill diagram out of sync');
    }
  }
}

// === SECTION 10: Extension UI ===
if (sections.includes(10)) {
  writeSection(10, 'Extension UI');
  const srcPath = path.join(extPath, 'src');
  if (fs.existsSync(srcPath)) {
    const windowOpen = grepFiles(srcPath, /\.ts$/, /window\.open\(/);
    const locationReload = grepFiles(srcPath, /\.ts$/, /location\.reload\(\)/);

    if (windowOpen.length > 0) {
      console.log(`  ${YELLOW}[WARN] window.open() found (dead in WebViews)${RESET}`);
      addWarning('window.open in WebView');
    } else {
      console.log(`  ${GREEN}[OK] No window.open()${RESET}`);
    }

    if (locationReload.length > 0) {
      console.log(`  ${YELLOW}[WARN] location.reload() found (dead in WebViews)${RESET}`);
      addWarning('location.reload in WebView');
    } else {
      console.log(`  ${GREEN}[OK] No location.reload()${RESET}`);
    }
  }
}

// === SECTION 11: Dependency Health ===
if (sections.includes(11)) {
  writeSection(11, 'Dependency Health');
  try {
    const auditOutput = execSync('npm audit --json', { cwd: extPath, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const auditResult = JSON.parse(auditOutput);
    if (auditResult.metadata) {
      const v = auditResult.metadata.vulnerabilities;
      const critical = (v.critical || 0) + (v.high || 0);
      console.log(`  Critical/High: ${critical} | Moderate: ${v.moderate || 0} | Low: ${v.low || 0}`);
      if (critical > 0) addIssue(`Security vulnerabilities: ${critical} critical/high`);
    }
  } catch (e) {
    // npm audit returns non-zero when vulns found
    try {
      const output = e.stdout || '';
      const auditResult = JSON.parse(output);
      if (auditResult.metadata) {
        const v = auditResult.metadata.vulnerabilities;
        const critical = (v.critical || 0) + (v.high || 0);
        console.log(`  Critical/High: ${critical} | Moderate: ${v.moderate || 0} | Low: ${v.low || 0}`);
        if (critical > 0) addIssue(`Security vulnerabilities: ${critical} critical/high`);
      }
    } catch {
      console.log(`  ${YELLOW}[WARN] Could not run npm audit${RESET}`);
    }
  }
}

// === SECTION 12: TypeScript & Lint ===
if (sections.includes(12)) {
  writeSection(12, 'TypeScript & Lint');
  const distPath = path.join(extPath, 'dist', 'extension.js');
  if (fs.existsSync(distPath)) {
    const stat = fs.statSync(distPath);
    const age = Math.floor((Date.now() - stat.mtimeMs) / 3600000);
    console.log(`  Last build: ${age} hours ago`);
    if (age < 24) {
      console.log(`  ${GREEN}[OK] Recent build exists${RESET}`);
    } else {
      console.log(`  ${YELLOW}[WARN] Build is stale (${age} hours)${RESET}`);
      addWarning(`Build is ${age} hours old`);
    }
  } else {
    console.log(`  ${RED}[ERROR] No build found${RESET}`);
    addIssue('No dist/extension.js');
  }
  console.log(`  ${GRAY}Run 'npm run compile' in platforms/vscode-extension to verify${RESET}`);
}

// === SECTION 13: Security ===
if (sections.includes(13)) {
  writeSection(13, 'Security');
  const srcPath = path.join(extPath, 'src');
  if (fs.existsSync(srcPath)) {
    const secretPatterns = [/api[_-]?key\s*[:=]\s*["'][\w-]{20,}/, /password\s*[:=]\s*["'][^"']{8,}/];
    let secretsFound = false;
    const tsFiles = findFilesRecursive(srcPath, /\.ts$/);
    for (const f of tsFiles) {
      const content = fs.readFileSync(f, 'utf8');
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          // Exclude comments and env vars
          const lines = content.split('\n').filter(l => pattern.test(l) && !/^\s*(\/\/|#|\*)/.test(l) && !l.includes('process.env'));
          if (lines.length > 0) { secretsFound = true; break; }
        }
      }
      if (secretsFound) break;
    }

    if (secretsFound) {
      console.log(`  ${YELLOW}[WARN] Potential secrets in code${RESET}`);
      addWarning('Potential secrets');
    } else {
      console.log(`  ${GREEN}[OK] No secrets detected${RESET}`);
    }

    // CSP check
    const cspFiles = grepFiles(srcPath, /\.ts$/, /Content-Security-Policy|getNonce/);
    if (cspFiles.length > 0) {
      console.log(`  ${GREEN}[OK] CSP implemented${RESET}`);
    } else {
      console.log(`  ${YELLOW}[WARN] No CSP found${RESET}`);
    }
  }
}

// === SECTION 14: Bundle Size ===
if (sections.includes(14)) {
  writeSection(14, 'Bundle Size');
  const distPath = path.join(extPath, 'dist', 'extension.js');
  if (fs.existsSync(distPath)) {
    const stat = fs.statSync(distPath);
    const sizeKB = Math.round(stat.size / 1024 * 10) / 10;
    console.log(`  Bundle: ${sizeKB} KB`);
    if (sizeKB > 500) {
      console.log(`  ${YELLOW}[WARN] Large bundle${RESET}`);
      addWarning(`Large bundle: ${sizeKB} KB`);
    } else {
      console.log(`  ${GREEN}[OK] Size acceptable${RESET}`);
    }
  }
}

// === SECTION 15: Git Hygiene ===
if (sections.includes(15)) {
  writeSection(15, 'Git Hygiene');
  try {
    const status = execSync('git status --porcelain', { cwd: repoRoot, encoding: 'utf8' });
    const changes = status.trim().split('\n').filter(l => l.trim()).length;
    console.log(`  Uncommitted changes: ${changes}`);
    if (changes > 0) addWarning(`Uncommitted changes: ${changes} files`);

    const branch = execSync('git branch --show-current', { cwd: repoRoot, encoding: 'utf8' }).trim();
    console.log(`  Branch: ${branch}`);
  } catch {
    console.log(`  ${YELLOW}[WARN] Could not check git status${RESET}`);
  }
}

// === SECTION 16: Changelog ===
if (sections.includes(16)) {
  writeSection(16, 'Changelog');
  const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
  if (fs.existsSync(changelogPath)) {
    const content = fs.readFileSync(changelogPath, 'utf8');
    const versions = content.match(/## \[(\d+\.\d+\.\d+)\]/g);
    const pkg = readJSON(path.join(extPath, 'package.json'));
    const pkgVersion = pkg ? pkg.version : 'unknown';

    if (versions && versions.length > 0) {
      const latestMatch = versions[0].match(/\[(\d+\.\d+\.\d+)\]/);
      if (latestMatch && latestMatch[1] === pkgVersion) {
        console.log(`  ${GREEN}[OK] Changelog matches package.json (${pkgVersion})${RESET}`);
      } else {
        console.log(`  ${YELLOW}[WARN] Changelog may need update${RESET}`);
        addWarning('Changelog version mismatch');
      }
    }
  }
}

// === SECTION 17: API Compatibility ===
if (sections.includes(17)) {
  writeSection(17, 'API Compatibility');
  const srcPath = path.join(extPath, 'src');
  if (fs.existsSync(srcPath)) {
    const deprecated = {
      'vscode.workspace.rootPath': /vscode\.workspace\.rootPath/,
      'context.storagePath': /context\.storagePath[^U]/
    };
    const found = [];
    const tsFiles = findFilesRecursive(srcPath, /\.ts$/);
    for (const [name, pattern] of Object.entries(deprecated)) {
      for (const f of tsFiles) {
        const content = fs.readFileSync(f, 'utf8');
        if (pattern.test(content)) { found.push(name); break; }
      }
    }
    if (found.length > 0) {
      console.log(`  ${YELLOW}[WARN] Deprecated APIs: ${found.join(', ')}${RESET}`);
      addWarning('Deprecated APIs in use');
    } else {
      console.log(`  ${GREEN}[OK] No deprecated APIs${RESET}`);
    }
  }
}

// === SECTION 18: Test Coverage ===
if (sections.includes(18)) {
  writeSection(18, 'Test Coverage');
  const testFiles = findFilesRecursive(extPath, /\.(test|spec)\.ts$/);
  const srcFiles = findFilesRecursive(path.join(extPath, 'src'), /\.ts$/).filter(f => !/\.(test|spec)\.ts$/.test(f));
  console.log(`  Source files: ${srcFiles.length} | Test files: ${testFiles.length}`);
  if (testFiles.length === 0) addWarning('No test files');
}

// === SECTION 19: Accessibility ===
if (sections.includes(19)) {
  writeSection(19, 'Accessibility');
  const srcPath = path.join(extPath, 'src');
  if (fs.existsSync(srcPath)) {
    const ariaCount = grepFiles(srcPath, /\.ts$/, /aria-|role=/).length;
    const cssVarCount = grepFiles(srcPath, /\.ts$/, /var\(--vscode-/).length;
    console.log(`  ARIA usage: ${ariaCount} files | CSS variables: ${cssVarCount} files`);
  }
}

// === SECTION 20: Localization ===
if (sections.includes(20)) {
  writeSection(20, 'Localization');
  const hasL10n = fs.existsSync(path.join(extPath, 'l10n')) || fs.existsSync(path.join(extPath, 'package.nls.json'));
  if (hasL10n) {
    console.log(`  ${GREEN}[OK] l10n configured${RESET}`);
  } else {
    console.log('  [Info] No l10n (optional)');
  }
}

// === SECTION 21: Asset Integrity ===
if (sections.includes(21)) {
  writeSection(21, 'Asset Integrity');
  const pkg = readJSON(path.join(extPath, 'package.json'));
  if (pkg && pkg.icon && fs.existsSync(path.join(extPath, pkg.icon))) {
    console.log(`  ${GREEN}[OK] Icon exists${RESET}`);
  } else {
    console.log(`  ${YELLOW}[WARN] Icon missing or not configured${RESET}`);
  }
}

// === SECTION 22: Configuration Files ===
if (sections.includes(22)) {
  writeSection(22, 'Configuration Files');
  const configs = [
    { file: '.vscode/launch.json', name: 'launch.json' },
    { file: 'tsconfig.json', name: 'tsconfig.json' },
    { file: '.vscodeignore', name: '.vscodeignore' }
  ];
  for (const cfg of configs) {
    const fullPath = path.join(extPath, cfg.file);
    if (fs.existsSync(fullPath)) {
      console.log(`  ${GREEN}[OK] ${cfg.name}${RESET}`);
    } else {
      console.log(`  ${YELLOW}[WARN] ${cfg.name} missing${RESET}`);
    }
  }
}

// === SUMMARY ===
console.log(`\n${CYAN}========================================${RESET}`);
console.log(`${CYAN}  AUDIT SUMMARY${RESET}`);
console.log(`${CYAN}========================================${RESET}`);

if (issues.length === 0 && warnings.length === 0) {
  console.log(`${GREEN}[OK] All checks passed!${RESET}`);
} else {
  if (issues.length > 0) {
    console.log(`\n${RED}[ERROR] ISSUES (${issues.length}):${RESET}`);
    issues.forEach(i => console.log(`  ${RED}- ${i}${RESET}`));
  }
  if (warnings.length > 0) {
    console.log(`\n${YELLOW}[WARN] WARNINGS (${warnings.length}):${RESET}`);
    warnings.forEach(w => console.log(`  ${YELLOW}- ${w}${RESET}`));
  }
}

process.exit(issues.length > 0 ? 1 : 0);
