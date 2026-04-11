/**
 * Quality Gate -- Automated Pre-Publish Validation
 * ================================================
 * Created: 2026-02-26 (RCA: prevent recurring regressions)
 *
 * Catches issues that caused v5.9.10 regressions:
 *   1. U+FFFD emoji corruption (encoding corruption)
 *   2. Command<->handler parity (orphaned commands)
 *   3. Command<->file inclusion (doc files missing from VSIX)
 *   4. Markdown table integrity (broken table formatting)
 *
 * Run: npm test
 * Wired into: vscode:prepublish (blocks packaging on failure)
 *
 * Alex-first: Use --json for machine-consumable output
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// --- Configuration ------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const PACKAGE_JSON = path.join(ROOT, 'package.json');
const VSCODEIGNORE = path.join(ROOT, '.vscodeignore');

// Files that should be scanned for U+FFFD (packaged files, not archives)
const SCAN_EXTENSIONS = ['.md', '.ts', '.js', '.json', '.cjs', '.mjs', '.html', '.css'];
const SCAN_EXCLUDE = ['node_modules', '.venv', '.vscode-test', '.git'];

// Alex-first: JSON output mode
const JSON_MODE = process.argv.includes('--json');
const jsonResult = { gates: [], errors: 0, warnings: 0, passed: true };

let totalErrors = 0;
let totalWarnings = 0;
let currentGate = null;

// --- Utilities ----------------------------------------------------------------

function header(title) {
  if (JSON_MODE) {
    currentGate = { name: title, status: 'pass', issues: [] };
    jsonResult.gates.push(currentGate);
  } else {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${title}`);
    console.log(`${'='.repeat(60)}`);
  }
}

function pass(msg) {
  if (JSON_MODE) {
    if (currentGate) currentGate.summary = msg;
  } else {
    console.log(`  [PASS] ${msg}`);
  }
}

function fail(msg) {
  totalErrors++;
  if (JSON_MODE) {
    if (currentGate) {
      currentGate.status = 'fail';
      currentGate.issues.push({ level: 'error', message: msg });
    }
  } else {
    console.log(`  [FAIL] ${msg}`);
  }
}

function warn(msg) {
  totalWarnings++;
  if (JSON_MODE) {
    if (currentGate) {
      if (currentGate.status !== 'fail') currentGate.status = 'warn';
      currentGate.issues.push({ level: 'warning', message: msg });
    }
  } else {
    console.log(`  [WARN] ${msg}`);
  }
}

function getAllFiles(dir, exts, exclude) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.some(ex => entry.name === ex)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, exts, exclude));
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// --- Gate 1: U+FFFD Encoding Corruption --------------------------------------

function checkEncodingCorruption() {
  header('Gate 1: Encoding Integrity (U+FFFD scan)');

  const files = getAllFiles(ROOT, SCAN_EXTENSIONS, SCAN_EXCLUDE);
  let corruptedFiles = 0;

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fffdRegex = /\uFFFD/g;
      const matches = [...content.matchAll(fffdRegex)];

      if (matches.length > 0) {
        corruptedFiles++;
        const relPath = path.relative(ROOT, filePath);
        const lines = content.split('\n');
        fail(`${matches.length} U+FFFD in ${relPath}`);

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('\uFFFD')) {
            const preview = lines[i].trim().substring(0, 100);
            console.log(`         L${i + 1}: ${preview}`);
          }
        }
      }
    } catch {
      // Binary file or encoding issue -- skip
    }
  }

  if (corruptedFiles === 0) {
    pass(`${files.length} files scanned -- zero encoding corruption`);
  }
}

// --- Gate 2: Command <-> Handler Parity ----------------------------------------

function checkCommandParity() {
  header('Gate 2: Command <-> Handler Parity');

  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
  const declaredCommands = new Set(
    pkg.contributes.commands.map(c => c.command)
  );

  // Also collect commands from menus, walkthroughs, keybindings, views
  const menuCommands = new Set();
  if (pkg.contributes.menus) {
    for (const menuGroup of Object.values(pkg.contributes.menus)) {
      for (const item of menuGroup) {
        if (item.command) menuCommands.add(item.command);
      }
    }
  }

  // Find all registerCommand calls in source
  const registeredCommands = new Set();
  const tsFiles = getAllFiles(SRC_DIR, ['.ts'], []);

  for (const filePath of tsFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /registerCommand\(\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      registeredCommands.add(match[1]);
    }
  }

  // Check: every declared command should have a handler
  let orphanedCount = 0;
  for (const cmd of declaredCommands) {
    if (!registeredCommands.has(cmd)) {
      fail(`Declared but no handler: ${cmd}`);
      orphanedCount++;
    }
  }

  // Check: every handler should be declared
  let undeclaredCount = 0;
  for (const cmd of registeredCommands) {
    if (cmd.startsWith('alex.') && !declaredCommands.has(cmd)) {
      fail(`Handler exists but not declared in package.json: ${cmd}`);
      undeclaredCount++;
    }
  }

  // Check: menu commands should be declared
  for (const cmd of menuCommands) {
    if (cmd.startsWith('alex.') && !declaredCommands.has(cmd)) {
      warn(`Menu references undeclared command: ${cmd}`);
    }
  }

  if (orphanedCount === 0 && undeclaredCount === 0) {
    pass(`${declaredCommands.size} commands declared, ${registeredCommands.size} handlers -- all matched`);
  }
}

// --- Gate 3: Doc File Inclusion ----------------------------------------------

function checkDocFileInclusion() {
  header('Gate 3: Doc File Inclusion (VSIX packaging)');

  // Parse .vscodeignore to find alex_docs whitelist
  const ignoreContent = fs.readFileSync(VSCODEIGNORE, 'utf8');
  const whitelistedDocs = new Set();

  for (const line of ignoreContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('!alex_docs/')) {
      // Convert !alex_docs/README.md -> alex_docs/README.md
      whitelistedDocs.add(trimmed.substring(1));
    }
  }

  // Find all alex_docs file references in source code
  // joinPath calls span multiple lines, so we parse the full content
  const tsFiles = getAllFiles(SRC_DIR, ['.ts'], []);
  const referencedDocs = new Map(); // path -> [file:line, ...]

  for (const filePath of tsFiles) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find joinPath( blocks that contain "alex_docs"
    const joinPathRegex = /Uri\.joinPath\(([^)]+)\)/gs;
    let jpMatch;
    while ((jpMatch = joinPathRegex.exec(content)) !== null) {
      const block = jpMatch[1];
      if (!block.includes('alex_docs')) continue;

      // Extract all quoted string segments from the joinPath args
      const segRegex = /["']([^"']+)["']/g;
      let seg;
      const segments = [];
      while ((seg = segRegex.exec(block)) !== null) {
        segments.push(seg[1]);
      }
      // segments = ["alex_docs", maybe "architecture", "FILE.md"]
      if (segments.length > 0 && segments[0] === 'alex_docs') {
        const docPath = segments.join('/');
        const lineNum = content.substring(0, jpMatch.index).split('\n').length;
        const relPath = path.relative(ROOT, filePath);
        if (!referencedDocs.has(docPath)) {
          referencedDocs.set(docPath, []);
        }
        referencedDocs.get(docPath).push(`${relPath}:${lineNum}`);
      }
    }
  }

  // Check: every referenced doc should be whitelisted
  let missingCount = 0;
  for (const [docPath, locations] of referencedDocs) {
    if (!whitelistedDocs.has(docPath)) {
      fail(`Referenced but NOT in .vscodeignore whitelist: ${docPath}`);
      for (const loc of locations) {
        console.log(`         Referenced at: ${loc}`);
      }
      missingCount++;
    }
  }

  // Check: every whitelisted doc should exist on disk
  for (const docPath of whitelistedDocs) {
    const fullPath = path.join(ROOT, docPath);
    if (!fs.existsSync(fullPath)) {
      fail(`Whitelisted but file missing: ${docPath}`);
    }
  }

  if (missingCount === 0) {
    pass(`${referencedDocs.size} doc references verified against .vscodeignore (${whitelistedDocs.size} whitelisted)`);
  }
}

// --- Gate 4: Markdown Table Integrity ----------------------------------------

function checkMarkdownTables() {
  header('Gate 4: Markdown Table Integrity');

  // Only check packaged markdown files (not archives)
  const packaged = [
    'README.md',
    'alex_docs/README.md',
    'alex_docs/WORKING-WITH-ALEX.md',
    'alex_docs/architecture/VSCODE-BRAIN-INTEGRATION.md',
    'alex_docs/guides/AGENT-VS-CHAT-COMPARISON.md',
    'alex_docs/guides/SKILL-DISCIPLINE-MAP.md',
  ];

  let brokenTables = 0;

  for (const relPath of packaged) {
    const fullPath = path.join(ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      warn(`Packaged markdown not found: ${relPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    // Find table rows (lines starting with |) and check for non-table content between them
    let inTable = false;
    let lastTableLine = -1;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');

      if (isTableRow) {
        if (inTable && (i - lastTableLine > 1)) {
          // Gap between table rows -- check if non-empty lines in between
          let hasContent = false;
          for (let j = lastTableLine + 1; j < i; j++) {
            if (lines[j].trim().length > 0) {
              hasContent = true;
              break;
            }
          }
          if (hasContent) {
            fail(`Broken table in ${relPath}: content between rows at L${lastTableLine + 1}-L${i + 1}`);
            brokenTables++;
          }
        }
        inTable = true;
        lastTableLine = i;
      } else if (trimmed.length > 0 && inTable) {
        // Non-table, non-empty line ends the table
        inTable = false;
      } else if (trimmed.length === 0 && inTable) {
        // Empty line -- could be end of table, keep tracking
      }
    }
  }

  if (brokenTables === 0) {
    pass(`${packaged.length} packaged markdown files -- tables intact`);
  }
}

// --- Gate 5: Walkthrough Sync Parity -----------------------------------------

function checkWalkthroughSync() {
  header('Gate 5: Walkthrough File Sync');

  // Every alex_docs file in .vscodeignore whitelist (except README.md which is maintained separately)
  // should be in the sync-architecture.cjs walkthroughFiles array
  const syncScript = path.resolve(ROOT, '..', '..', '.github', 'muscles', 'sync-architecture.cjs');

  if (!fs.existsSync(syncScript)) {
    warn('sync-architecture.cjs not found -- skipping sync parity check');
    return;
  }

  const syncContent = fs.readFileSync(syncScript, 'utf8');

  // Parse .vscodeignore whitelist (excluding README.md which has special handling)
  const ignoreContent = fs.readFileSync(VSCODEIGNORE, 'utf8');
  const whitelistedDocs = [];

  for (const line of ignoreContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('!alex_docs/') && !trimmed.includes('README.md')) {
      whitelistedDocs.push(trimmed.substring(1)); // Remove !
    }
  }

  // Check each whitelisted doc (except README) appears in sync script
  let syncErrors = 0;
  for (const docPath of whitelistedDocs) {
    // The filename should appear in the sync script
    const filename = path.basename(docPath);
    if (!syncContent.includes(filename)) {
      fail(`Whitelisted ${docPath} not found in sync-architecture.cjs -- won't be synced from master`);
      syncErrors++;
    }
  }

  if (syncErrors === 0) {
    pass(`${whitelistedDocs.length} walkthrough files verified in sync script`);
  }
}

// --- Gate 6: Skill Frontmatter Integrity -------------------------------------

function parseFrontmatter(content) {
  // Minimal frontmatter parser: expects leading --- block
  const fmMatch = content.match(/^---\s*([\s\S]*?)\n---/);
  if (!fmMatch) return {};
  const body = fmMatch[1];
  const result = {};
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    result[key] = val;
  }
  return result;
}

function collectSkillDirs(baseDir) {
  if (!fs.existsSync(baseDir)) return [];
  return fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(baseDir, d.name));
}

function checkSkillFrontmatterIntegrity() {
  header('Gate 6: Skill Frontmatter Integrity');

  const skillRoots = [
    path.resolve(ROOT, '..', '..', '.github', 'skills'),
    path.resolve(ROOT, '.github', 'skills'),
  ];

  let errors = 0;
  let checked = 0;

  for (const rootDir of skillRoots) {
    const skillDirs = collectSkillDirs(rootDir);
    for (const skillDir of skillDirs) {
      const folder = path.basename(skillDir);
      const skillMd = path.join(skillDir, 'SKILL.md');
      if (!fs.existsSync(skillMd)) {
        warn(`SKILL.md missing for ${folder} (${path.relative(ROOT, skillDir)})`);
        continue;
      }
      const content = fs.readFileSync(skillMd, 'utf8');
      const fm = parseFrontmatter(content);
      checked++;
      const fmName = fm.name || fm.Name || fm.title;
      if (!fmName) {
        fail(`Frontmatter name missing in ${path.relative(ROOT, skillMd)}`);
        errors++;
        continue;
      }
      const normA = String(fmName).trim().toLowerCase();
      const normB = folder.trim().toLowerCase();
      if (normA !== normB) {
        fail(`Frontmatter name mismatch: ${folder} -> '${fmName}' (${path.relative(ROOT, skillMd)})`);
        errors++;
      }
    }
  }

  if (errors === 0) {
    pass(`${checked} skills validated -- frontmatter names match folder names`);
  }
}

// --- Gate 7: VSIX Size Budget ----------------------------------------------

/**
 * Fallback file walker: estimates VSIX size when vsce is unavailable.
 * Walks ROOT, skips common non-packaged dirs, respects basic .vscodeignore patterns.
 */
function estimateVsixSizeFallback() {
  const ignoreContent = fs.readFileSync(VSCODEIGNORE, 'utf8');
  const ignorePatterns = [];
  const negatePatterns = [];
  for (const line of ignoreContent.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    if (t.startsWith('!')) {
      negatePatterns.push(t.substring(1));
    } else {
      ignorePatterns.push(t);
    }
  }

  const skipDirs = new Set(['node_modules', '.git', '.vscode-test', 'out']);
  let totalBytes = 0;
  let fileCount = 0;

  function shouldIgnore(relPath) {
    // Simple pattern matching: exact match, glob suffix (**), or extension glob (**)
    for (const pat of ignorePatterns) {
      if (pat === relPath) return true;
      if (pat.endsWith('/**') && relPath.startsWith(pat.slice(0, -3))) return true;
      if (pat.startsWith('**/') && relPath.endsWith(pat.slice(3))) return true;
      if (pat.startsWith('**/*') && relPath.endsWith(pat.slice(4))) return true;
      if (pat.endsWith('**') && relPath.startsWith(pat.slice(0, -2))) return true;
    }
    return false;
  }

  function shouldNegate(relPath) {
    for (const pat of negatePatterns) {
      if (pat === relPath) return true;
      if (pat.endsWith('/**') && relPath.startsWith(pat.slice(0, -3))) return true;
      if (pat.startsWith('**/') && relPath.endsWith(pat.slice(3))) return true;
    }
    return false;
  }

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (skipDirs.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        if (!shouldIgnore(rel + '/') && !shouldIgnore(rel + '/**')) {
          walk(full);
        }
      } else {
        if (!shouldIgnore(rel) || shouldNegate(rel)) {
          totalBytes += fs.statSync(full).size;
          fileCount++;
        }
      }
    }
  }

  walk(ROOT);
  return { totalBytes, fileCount };
}

function checkVsixSizeBudget() {
  header('Gate 7: VSIX Size Budget');
  let totalBytes = 0;
  let fileCount = 0;
  let method = 'vsce';

  try {
    const result = spawnSync('npx', ['vsce', 'ls'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
      shell: true,
    });
    if (result.status !== 0) {
      // vsce failed -- use fallback file walker
      warn('vsce ls failed; using fallback file walker');
      method = 'fallback';
      const est = estimateVsixSizeFallback();
      totalBytes = est.totalBytes;
      fileCount = est.fileCount;
    } else {
      const files = result.stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      fileCount = files.length;
      for (const rel of files) {
        const full = path.join(ROOT, rel);
        if (fs.existsSync(full)) {
          totalBytes += fs.statSync(full).size;
        }
      }
    }
  } catch (err) {
    // Total failure -- use fallback
    warn(`vsce unavailable (${err.message}); using fallback file walker`);
    method = 'fallback';
    const est = estimateVsixSizeFallback();
    totalBytes = est.totalBytes;
    fileCount = est.fileCount;
  }

  const mb = totalBytes / (1024 * 1024);
  if (mb > 7) {
    fail(`VSIX size ${mb.toFixed(2)} MB exceeds 7 MB budget (${fileCount} files, ${method})`);
  } else if (mb > 5.5) {
    warn(`VSIX size ${mb.toFixed(2)} MB approaching limit (${fileCount} files, ${method})`);
  } else {
    pass(`VSIX size ${mb.toFixed(2)} MB within budget (${fileCount} files, ${method})`);
  }
}

// --- Gate 8: Skill Activation Index ----------------------------------------

function checkSkillActivationIndex() {
  header('Gate 8: Skill Activation Index');
  try {
    const result = spawnSync('node', [path.resolve(ROOT, '..', '..', 'scripts', 'audit-skill-activation-index.cjs')], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    if (result.status !== 0) {
      process.stderr.write(result.stdout || '');
      process.stderr.write(result.stderr || '');
      fail('Skill activation index audit failed');
    } else {
      pass('Skill activation index audit passed');
    }
  } catch (err) {
    warn(`Skill activation audit skipped: ${err.message}`);
  }
}

// --- Main ---------------------------------------------------------------------

function main() {
  if (!JSON_MODE) {
    console.log('============================================================');
    console.log('         Alex Quality Gate -- Pre-Publish Checks            ');
    console.log('============================================================');
  }

  checkEncodingCorruption();
  checkCommandParity();
  checkDocFileInclusion();
  checkMarkdownTables();
  checkWalkthroughSync();
  checkSkillFrontmatterIntegrity();
  checkVsixSizeBudget();
  checkSkillActivationIndex();

  // --- Summary --------------------------------------------------------------

  jsonResult.errors = totalErrors;
  jsonResult.warnings = totalWarnings;
  jsonResult.passed = totalErrors === 0;

  if (JSON_MODE) {
    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(totalErrors === 0 ? 0 : 1);
  }

  header('Summary');

  if (totalErrors === 0) {
    console.log(`  [PASS] All quality gates passed (${totalWarnings} warning${totalWarnings !== 1 ? 's' : ''})`);
    console.log('');
    process.exit(0);
  } else {
    console.log(`  [FAIL] ${totalErrors} error${totalErrors !== 1 ? 's' : ''}, ${totalWarnings} warning${totalWarnings !== 1 ? 's' : ''}`);
    console.log(`  Packaging blocked -- fix errors above before publishing`);
    console.log('');
    process.exit(1);
  }
}

main();
