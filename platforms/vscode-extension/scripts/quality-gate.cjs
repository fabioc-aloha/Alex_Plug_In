/**
 * Quality Gate — Automated Pre-Publish Validation
 * ================================================
 * Created: 2026-02-26 (RCA: prevent recurring regressions)
 *
 * Catches issues that caused v5.9.10 regressions:
 *   1. U+FFFD emoji corruption (encoding corruption)
 *   2. Command↔handler parity (orphaned commands)
 *   3. Command↔file inclusion (doc files missing from VSIX)
 *   4. Markdown table integrity (broken table formatting)
 *
 * Run: npm test
 * Wired into: vscode:prepublish (blocks packaging on failure)
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const PACKAGE_JSON = path.join(ROOT, 'package.json');
const VSCODEIGNORE = path.join(ROOT, '.vscodeignore');

// Files that should be scanned for U+FFFD (packaged files, not archives)
const SCAN_EXTENSIONS = ['.md', '.ts', '.js', '.json', '.cjs', '.mjs', '.html', '.css'];
const SCAN_EXCLUDE = ['node_modules', '.venv', '.vscode-test', '.git'];

let totalErrors = 0;
let totalWarnings = 0;

// ─── Utilities ────────────────────────────────────────────────────────────────

function header(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'═'.repeat(60)}`);
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  totalErrors++;
  console.log(`  ❌ ${msg}`);
}

function warn(msg) {
  totalWarnings++;
  console.log(`  ⚠️  ${msg}`);
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

// ─── Gate 1: U+FFFD Encoding Corruption ──────────────────────────────────────

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
      // Binary file or encoding issue — skip
    }
  }

  if (corruptedFiles === 0) {
    pass(`${files.length} files scanned — zero encoding corruption`);
  }
}

// ─── Gate 2: Command ↔ Handler Parity ────────────────────────────────────────

function checkCommandParity() {
  header('Gate 2: Command ↔ Handler Parity');

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
    pass(`${declaredCommands.size} commands declared, ${registeredCommands.size} handlers — all matched`);
  }
}

// ─── Gate 3: Doc File Inclusion ──────────────────────────────────────────────

function checkDocFileInclusion() {
  header('Gate 3: Doc File Inclusion (VSIX packaging)');

  // Parse .vscodeignore to find alex_docs whitelist
  const ignoreContent = fs.readFileSync(VSCODEIGNORE, 'utf8');
  const whitelistedDocs = new Set();

  for (const line of ignoreContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('!alex_docs/')) {
      // Convert !alex_docs/README.md → alex_docs/README.md
      whitelistedDocs.add(trimmed.substring(1));
    }
  }

  // Find all alex_docs file references in source code
  // joinPath calls span multiple lines, so we parse the full content
  const tsFiles = getAllFiles(SRC_DIR, ['.ts'], []);
  const referencedDocs = new Map(); // path → [file:line, ...]

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

// ─── Gate 4: Markdown Table Integrity ────────────────────────────────────────

function checkMarkdownTables() {
  header('Gate 4: Markdown Table Integrity');

  // Only check packaged markdown files (not archives)
  const packaged = [
    'README.md',
    'alex_docs/README.md',
    'alex_docs/WORKING-WITH-ALEX.md',
    'alex_docs/architecture/VSCODE-BRAIN-INTEGRATION.md',
    'alex_docs/guides/AGENT-VS-CHAT-COMPARISON.md',
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
          // Gap between table rows — check if non-empty lines in between
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
        // Empty line — could be end of table, keep tracking
      }
    }
  }

  if (brokenTables === 0) {
    pass(`${packaged.length} packaged markdown files — tables intact`);
  }
}

// ─── Gate 5: Walkthrough Sync Parity ─────────────────────────────────────────

function checkWalkthroughSync() {
  header('Gate 5: Walkthrough File Sync');

  // Every alex_docs file in .vscodeignore whitelist (except README.md which is maintained separately)
  // should be in the sync-architecture.cjs walkthroughFiles array
  const syncScript = path.resolve(ROOT, '..', '..', '.github', 'muscles', 'sync-architecture.cjs');

  if (!fs.existsSync(syncScript)) {
    warn('sync-architecture.cjs not found — skipping sync parity check');
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
      fail(`Whitelisted ${docPath} not found in sync-architecture.cjs — won't be synced from master`);
      syncErrors++;
    }
  }

  if (syncErrors === 0) {
    pass(`${whitelistedDocs.length} walkthrough files verified in sync script`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║         Alex Quality Gate — Pre-Publish Checks         ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  checkEncodingCorruption();
  checkCommandParity();
  checkDocFileInclusion();
  checkMarkdownTables();
  checkWalkthroughSync();

  // ─── Summary ──────────────────────────────────────────────────────────────

  header('Summary');

  if (totalErrors === 0) {
    console.log(`  ✅ All quality gates passed (${totalWarnings} warning${totalWarnings !== 1 ? 's' : ''})`);
    console.log('');
    process.exit(0);
  } else {
    console.log(`  ❌ ${totalErrors} error${totalErrors !== 1 ? 's' : ''}, ${totalWarnings} warning${totalWarnings !== 1 ? 's' : ''}`);
    console.log(`  ⛔ Packaging blocked — fix errors above before publishing`);
    console.log('');
    process.exit(1);
  }
}

main();
