/**
 * nav-inject.cjs v1.0.0 - Cross-document navigation injector
 *
 * Reads a nav.json config and stamps a navigation table into every .md file
 * in a document suite. Eliminates manual navigation maintenance across
 * multi-file documentation sets (FishbowlGovernance pattern).
 *
 * Usage:
 *   node nav-inject.cjs [nav.json]      # Default: looks for nav.json in cwd
 *   node nav-inject.cjs --init           # Create starter nav.json
 *   node nav-inject.cjs --dry-run        # Preview changes without writing
 *
 * nav.json format:
 *   {
 *     "title": "Project Documentation",
 *     "style": "table",          // "table" or "list"
 *     "position": "top",         // "top" or "bottom"
 *     "files": [
 *       { "path": "README.md", "label": "Overview", "icon": "[LIST]" },
 *       { "path": "SETUP.md", "label": "Setup Guide", "icon": "[TOOL]" }
 *     ]
 *   }
 *
 * The injector wraps navigation in sentinel comments:
 *   <!-- nav:start -->
 *   ... navigation table ...
 *   <!-- nav:end -->
 *
 * On repeated runs, only the content between sentinels is replaced.
 */

const fs = require('fs');
const path = require('path');

const NAV_START = '<!-- nav:start -->';
const NAV_END = '<!-- nav:end -->';

// ---------------------------------------------------------------------------
// Navigation generation
// ---------------------------------------------------------------------------

/**
 * Generate navigation markdown in table format.
 */
function generateNavTable(config, currentFile) {
  const title = config.title || 'Documentation Navigation';
  const files = config.files || [];

  const rows = ['', NAV_START, `**${title}**`, ''];
  rows.push('| Document | Description |');
  rows.push('|----------|-------------|');

  for (const file of files) {
    const icon = file.icon || '[DOC]';
    const label = file.label || path.basename(file.path, '.md');
    const isCurrent = normalizePath(file.path) === normalizePath(currentFile);

    if (isCurrent) {
      rows.push(`| ${icon} **${label}** (this document) | ${file.description || ''} |`);
    } else {
      const relPath = relativeTo(currentFile, file.path);
      rows.push(`| ${icon} [${label}](${relPath}) | ${file.description || ''} |`);
    }
  }

  rows.push('', NAV_END, '');
  return rows.join('\n');
}

/**
 * Generate navigation markdown in list format.
 */
function generateNavList(config, currentFile) {
  const title = config.title || 'Documentation Navigation';
  const files = config.files || [];

  const rows = ['', NAV_START, `### ${title}`, ''];

  for (const file of files) {
    const icon = file.icon || '[DOC]';
    const label = file.label || path.basename(file.path, '.md');
    const isCurrent = normalizePath(file.path) === normalizePath(currentFile);

    if (isCurrent) {
      rows.push(`- ${icon} **${label}** *(this document)*`);
    } else {
      const relPath = relativeTo(currentFile, file.path);
      rows.push(`- ${icon} [${label}](${relPath})`);
    }
  }

  rows.push('', NAV_END, '');
  return rows.join('\n');
}

/**
 * Compute relative path from one file to another.
 */
function relativeTo(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  const rel = path.relative(fromDir, toFile).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '');
}

// ---------------------------------------------------------------------------
// File injection
// ---------------------------------------------------------------------------

/**
 * Inject or replace navigation in a markdown file.
 */
function injectNav(filePath, navContent, position) {
  let content = fs.readFileSync(filePath, 'utf8');
  const startIdx = content.indexOf(NAV_START);
  const endIdx = content.indexOf(NAV_END);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing navigation block
    content = content.slice(0, startIdx) + navContent.trim() + content.slice(endIdx + NAV_END.length);
  } else if (position === 'bottom') {
    // Append to end
    content = content.trimEnd() + '\n\n' + navContent.trim() + '\n';
  } else {
    // Insert after first heading (or at top if no heading)
    const h1Match = content.match(/^#\s+.+$/m);
    if (h1Match) {
      const insertPos = h1Match.index + h1Match[0].length;
      content = content.slice(0, insertPos) + '\n' + navContent + content.slice(insertPos);
    } else {
      content = navContent + '\n' + content;
    }
  }

  return content;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function createStarterNavJson(outputPath) {
  const starter = {
    title: 'Documentation Navigation',
    style: 'table',
    position: 'top',
    files: [
      { path: 'README.md', label: 'Overview', icon: '\u{1F4CB}', description: 'Project overview and getting started' },
      { path: 'SETUP.md', label: 'Setup Guide', icon: '\u{1F527}', description: 'Installation and configuration' },
      { path: 'USAGE.md', label: 'Usage Guide', icon: '\u{1F4D6}', description: 'How to use the project' },
    ],
  };
  fs.writeFileSync(outputPath, JSON.stringify(starter, null, 2), 'utf8');
  console.log(`\u2705 Created starter nav.json at ${outputPath}`);
  console.log('Edit the file to match your documentation structure, then run:');
  console.log('  node nav-inject.cjs nav.json');
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const init = args.includes('--init');
  const configPath = args.find(a => !a.startsWith('--')) || 'nav.json';

  if (init) {
    createStarterNavJson(path.resolve(configPath));
    return;
  }

  const resolvedConfig = path.resolve(configPath);
  if (!fs.existsSync(resolvedConfig)) {
    console.error(`ERROR: nav.json not found: ${resolvedConfig}`);
    console.error('Create one with: node nav-inject.cjs --init');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(resolvedConfig, 'utf8'));
  const baseDir = path.dirname(resolvedConfig);
  const style = config.style || 'table';
  const position = config.position || 'top';
  const files = config.files || [];

  console.log(`\u{1F4C4} nav-inject: Processing ${files.length} files`);
  console.log(`  Style: ${style}, Position: ${position}`);
  if (dryRun) console.log('  \u{1F9EA} DRY RUN -- no files will be modified');

  let updated = 0;
  for (const file of files) {
    const filePath = path.resolve(baseDir, file.path);
    if (!fs.existsSync(filePath)) {
      console.log(`  \u26A0 Skipping (not found): ${file.path}`);
      continue;
    }

    const generator = style === 'list' ? generateNavList : generateNavTable;
    const navContent = generator(config, file.path);
    const newContent = injectNav(filePath, navContent, position);

    if (dryRun) {
      console.log(`  \u{1F50D} Would update: ${file.path}`);
    } else {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`  \u2713 Updated: ${file.path}`);
    }
    updated++;
  }

  console.log(`\n\u2705 ${dryRun ? 'Would update' : 'Updated'} ${updated}/${files.length} files`);
}

main();
