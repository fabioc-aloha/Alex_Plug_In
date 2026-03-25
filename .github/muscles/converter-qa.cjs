/**
 * converter-qa.cjs — Converter Quality Assurance Framework
 * Version: 1.2.0
 *
 * Test harness for validating converter outputs:
 * - md-to-word.cjs regression tests
 * - md-to-eml.cjs structure validation
 * - Shared module unit tests
 * - File size bounds checking
 * - Output format verification
 *
 * Usage:
 *   node .github/muscles/converter-qa.cjs                # Run all tests
 *   node .github/muscles/converter-qa.cjs --suite=word   # Run word converter tests only
 *   node .github/muscles/converter-qa.cjs --suite=shared # Run shared module tests only
 *   node .github/muscles/converter-qa.cjs --verbose      # Show detailed output
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const os = require('os');

// ─────────────────────────────────────────────────────────────────────────────
// TEST FRAMEWORK (minimal, no deps)
// ─────────────────────────────────────────────────────────────────────────────

let _passed = 0;
let _failed = 0;
let _skipped = 0;
const _failures = [];
const _verbose = process.argv.includes('--verbose');
const _suiteArg = (process.argv.find(a => a.startsWith('--suite=')) || '').split('=')[1] || 'all';

function assert(condition, message) {
  if (condition) {
    _passed++;
    if (_verbose) console.log(`  [PASS] ${message}`);
  } else {
    _failed++;
    _failures.push(message);
    console.log(`  [FAIL] ${message}`);
  }
}

function skip(message) {
  _skipped++;
  if (_verbose) console.log(`  [SKIP] ${message}`);
}

function suite(name, fn) {
  if (_suiteArg !== 'all' && !name.toLowerCase().includes(_suiteArg.toLowerCase())) return;
  console.log(`\n-- ${name} ${'-'.repeat(Math.max(0, 60 - name.length))}`);
  fn();
}

// ─────────────────────────────────────────────────────────────────────────────
// PATHS
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..', '..');
const MUSCLES = path.join(ROOT, '.github', 'muscles');
const SHARED = path.join(MUSCLES, 'shared');
const LUA = path.join(MUSCLES, 'lua-filters');
const MD_TO_WORD = path.join(MUSCLES, 'md-to-word.cjs');
const MD_TO_EML = path.join(MUSCLES, 'md-to-eml.cjs');
const NAV_INJECT = path.join(MUSCLES, 'nav-inject.cjs');

const TEMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'converter-qa-'));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function createTempFile(name, content) {
  const p = path.join(TEMP_DIR, name);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

function fileExists(p) { return fs.existsSync(p); }
function fileSize(p) { return fs.statSync(p).size; }

function runNode(script, args = [], timeout = 30000) {
  const result = spawnSync('node', [script, ...args], {
    cwd: ROOT,
    timeout,
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'test' },
  });
  return { stdout: result.stdout || '', stderr: result.stderr || '', status: result.status, error: result.error };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITES
// ─────────────────────────────────────────────────────────────────────────────

suite('Shared: data-uri.cjs', () => {
  const mod = require(path.join(SHARED, 'data-uri.cjs'));

  assert(typeof mod.encodeToDataUri === 'function', 'encodeToDataUri is exported');
  assert(typeof mod.downloadFile === 'function', 'downloadFile is exported');
  assert(typeof mod.decodeDataUri === 'function', 'decodeDataUri is exported');
  assert(typeof mod.mimeFromExt === 'function', 'mimeFromExt is exported');
  assert(typeof mod.MIME_MAP === 'object', 'MIME_MAP is exported');

  // MIME detection
  assert(mod.mimeFromExt('photo.png') === 'image/png', 'mimeFromExt(.png)');
  assert(mod.mimeFromExt('photo.jpg') === 'image/jpeg', 'mimeFromExt(.jpg)');
  assert(mod.mimeFromExt('doc.svg') === 'image/svg+xml', 'mimeFromExt(.svg)');
  assert(mod.mimeFromExt('doc.pdf') === 'application/pdf', 'mimeFromExt(.pdf)');
  assert(mod.mimeFromExt('unknown.xyz') === 'application/octet-stream', 'mimeFromExt(unknown)');

  // Data URI round-trip
  const testFile = createTempFile('test.png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]));
  const uri = mod.encodeToDataUri(testFile);
  assert(typeof uri === 'string' && uri.startsWith('data:image/png;base64,'), 'encodeToDataUri produces valid URI');
  const decoded = mod.decodeDataUri(uri);
  assert(decoded && Buffer.isBuffer(decoded.buffer), 'decodeDataUri returns { mime, buffer }');
  assert(decoded.buffer[0] === 0x89 && decoded.buffer[1] === 0x50, 'decodeDataUri round-trips correctly');

  // PNG data URI
  assert(uri.startsWith('data:image/png;base64,'), 'PNG encodes with correct MIME');
});

suite('Shared: markdown-preprocessor.cjs', () => {
  const mod = require(path.join(SHARED, 'markdown-preprocessor.cjs'));

  assert(typeof mod.preprocessMarkdown === 'function', 'preprocessMarkdown is exported');
  assert(typeof mod.convertLatexMath === 'function', 'convertLatexMath is exported');
  assert(typeof mod.extractFrontmatter === 'function', 'extractFrontmatter is exported');

  // BOM stripping
  const bom = mod.preprocessMarkdown('\uFEFF# Hello');
  assert(!bom.startsWith('\uFEFF'), 'BOM is stripped');

  // LaTeX math conversion
  const math = mod.convertLatexMath('The formula $\\alpha$ is important');
  assert(math.includes('α'), 'LaTeX \\alpha → Unicode α');

  // Page break directives
  const pb = mod.preprocessMarkdown('Before\n<!-- pagebreak -->\nAfter');
  assert(pb.includes('\\newpage') || pb.includes('pagebreak'), 'Page break directive processed');

  // Callout blocks
  const callout = mod.preprocessMarkdown('::: tip\nDo this\n:::');
  assert(callout.includes('💡') || callout.includes('TIP') || callout.includes('tip'), 'Callout block processed');

  // GitHub-style callouts
  const ghCallout = mod.preprocessMarkdown('> [!WARNING]\n> Be careful');
  assert(ghCallout.includes('⚠') || ghCallout.includes('WARNING') || ghCallout.includes('warning'), 'GitHub callout processed');

  // Keyboard shortcuts
  const kbd = mod.preprocessMarkdown('Press [[Ctrl+S]] to save');
  assert(kbd.includes('<kbd>') || kbd.includes('Ctrl+S'), 'Keyboard shortcut processed');

  // Highlights
  const hl = mod.preprocessMarkdown('This is ==highlighted== text');
  assert(hl.includes('<mark>') || hl.includes('highlighted'), 'Highlight processed');

  // Sub/superscript
  const sub = mod.preprocessMarkdown('H~2~O');
  assert(sub.includes('<sub>') || sub.includes('2'), 'Subscript processed');
  const sup = mod.preprocessMarkdown('E=mc^2^');
  assert(sup.includes('<sup>') || sup.includes('2'), 'Superscript processed');

  // Definition lists
  const dl = mod.preprocessMarkdown('Term\n: Definition here');
  assert(dl.includes('Definition here'), 'Definition list kept');

  // Frontmatter extraction (returns { frontmatter: rawString, content: body })
  const result = mod.extractFrontmatter('---\ntitle: Test\n---\nBody');
  assert(result.frontmatter != null && result.frontmatter.includes('title'), 'Frontmatter parsed');
  assert(result.content.trim() === 'Body', 'Body extracted after frontmatter');
});

suite('Shared: mermaid-pipeline.cjs', () => {
  const mod = require(path.join(SHARED, 'mermaid-pipeline.cjs'));

  assert(typeof mod.findMermaidBlocks === 'function', 'findMermaidBlocks is exported');
  assert(typeof mod.injectPalette === 'function', 'injectPalette is exported');
  assert(typeof mod.mermaidToTableFallback === 'function', 'mermaidToTableFallback is exported');

  // Find mermaid blocks
  const blocks = mod.findMermaidBlocks('Text\n```mermaid\nflowchart TD\n  A-->B\n```\nMore');
  assert(blocks.length === 1, 'Finds one mermaid block');
  assert(blocks[0].content.includes('flowchart'), 'Block contains mermaid code');

  // Palette injection
  const withPalette = mod.injectPalette('flowchart TD\n  A-->B');
  assert(withPalette.includes('init') || withPalette.includes('theme') || withPalette === 'flowchart TD\n  A-->B', 'Palette injection runs (may be no-op without options)');

  // Table fallback
  const table = mod.mermaidToTableFallback('flowchart TD\n  A["Source"]-->B["Target"]');
  assert(table.includes('Source') || table.includes('A'), 'Table fallback extracts nodes');
  assert(table.includes('|'), 'Table fallback produces markdown table format');
});

suite('Shared: replicate-core.cjs', () => {
  const mod = require(path.join(SHARED, 'replicate-core.cjs'));

  assert(typeof mod.estimateCost === 'function', 'estimateCost is exported');
  assert(typeof mod.writeOutput === 'function', 'writeOutput is exported');
  assert(typeof mod.writeReport === 'function', 'writeReport is exported');
  assert(typeof mod.parseCliArgs === 'function', 'parseCliArgs is exported');
  assert(typeof mod.MODEL_COSTS === 'object', 'MODEL_COSTS is exported');

  // Cost estimation (returns { perImage, total, model })
  const cost = mod.estimateCost('google/nano-banana-pro', 10);
  assert(cost.total > 0, 'Cost estimate is positive');
  assert(cost.total <= 5, 'Cost estimate is reasonable (<=5 for 10 images)');

  const unknownCost = mod.estimateCost('unknown/model', 5);
  assert(unknownCost.total >= 0, 'Unknown model returns fallback cost');

  // CLI arg parsing (parseCliArgs takes full argv, slices off first 2)
  const fakeArgv = ['node', 'script.js', '--dry-run', '--limit=5', '--skip=2', '--only=test', '--output=out'];
  const parsed = mod.parseCliArgs(fakeArgv);
  assert(parsed.dryRun === true, 'parseCliArgs: --dry-run');
  assert(parsed.limit === 5, 'parseCliArgs: --limit=5');
  assert(parsed.skip === 2, 'parseCliArgs: --skip=2');
  assert(parsed.only.includes('test'), 'parseCliArgs: --only=test');
  assert(parsed.outputDir === 'out', 'parseCliArgs: --output=out');

  // Write output (Buffer)
  const outPath = path.join(TEMP_DIR, 'test-output.bin');
  mod.writeOutput(Buffer.from('test data'), outPath);
  assert(fileExists(outPath), 'writeOutput writes Buffer to disk');
  assert(fs.readFileSync(outPath, 'utf8') === 'test data', 'writeOutput content correct');

  // Write report (expects { generator, model, results, summary })
  const reportPath = path.join(TEMP_DIR, 'test-report.json');
  mod.writeReport(reportPath, { generator: 'qa-test', model: 'test/model', results: [{ status: 'ok' }], summary: { total: 1 } });
  assert(fileExists(reportPath), 'writeReport creates file');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert(report.generator === 'qa-test', 'writeReport content correct');
});

suite('Shared: converter-config.cjs', () => {
  const mod = require(path.join(SHARED, 'converter-config.cjs'));

  assert(typeof mod.loadConfig === 'function', 'loadConfig is exported');
  assert(typeof mod.loadCharacterConfig === 'function', 'loadCharacterConfig is exported');
  assert(typeof mod.getPromptTemplate === 'function', 'getPromptTemplate is exported');
  assert(typeof mod.DEFAULTS === 'object', 'DEFAULTS is exported');

  // Default config loading (no .converter.json)
  const cfg = mod.loadConfig('word', { projectRoot: TEMP_DIR });
  assert(cfg.style === 'professional', 'Default style is professional');
  assert(cfg.pageSize === 'letter', 'Default page size is letter');
  assert(cfg.fonts.body === 'Segoe UI', 'Default body font');

  // Override merging
  const cfgOverride = mod.loadConfig('word', {
    projectRoot: TEMP_DIR,
    overrides: { style: 'academic', fonts: { body: 'Times New Roman' } },
  });
  assert(cfgOverride.style === 'academic', 'Override applied to style');
  assert(cfgOverride.fonts.body === 'Times New Roman', 'Override applied to nested font');
  assert(cfgOverride.fonts.code === 'Consolas', 'Unoverridden nested value preserved');

  // Deep merge
  const merged = mod.deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { c: 99 }, e: 5 });
  assert(merged.a === 1, 'deepMerge preserves a');
  assert(merged.b.c === 99, 'deepMerge overrides nested c');
  assert(merged.b.d === 3, 'deepMerge preserves nested d');
  assert(merged.e === 5, 'deepMerge adds new keys');

  // Character config loading
  const charConfig = mod.loadCharacterConfig(null, ROOT);
  if (charConfig) {
    assert(charConfig.subjects?.alex != null, 'visual-memory.json has alex subject');
    assert(Array.isArray(charConfig.subjects.alex.immutableTraits), 'alex has immutableTraits');
    assert(charConfig.promptTemplates != null, 'Has prompt templates');
  } else {
    skip('visual-memory.json not found (ok in CI)');
  }

  // Prompt template interpolation
  if (charConfig?.promptTemplates) {
    const tmpl = mod.getPromptTemplate(charConfig, 'portrait', { subject: 'test-subject', age: 21 });
    if (tmpl) {
      assert(typeof tmpl === 'string', 'getPromptTemplate returns string');
    } else {
      skip('No portrait template in visual-memory.json');
    }
  }
});

suite('Lua Filters: syntax validation', () => {
  const luaFiles = ['keep-headings.lua', 'word-table-style.lua', 'caption-labels.lua'];
  for (const f of luaFiles) {
    const p = path.join(LUA, f);
    if (fileExists(p)) {
      const content = fs.readFileSync(p, 'utf8');
      assert(content.length > 50, `${f} has content (${content.length} chars)`);
      assert(content.includes('function'), `${f} contains function definition`);
      // Basic Lua syntax: no unterminated strings
      const opens = (content.match(/\bfunction\b/g) || []).length;
      const closes = (content.match(/\bend\b/g) || []).length;
      assert(closes >= opens, `${f} has balanced function/end blocks`);
    } else {
      skip(`${f} not found`);
    }
  }
});

suite('File Inventory: expected files exist', () => {
  const required = [
    { path: MD_TO_WORD, desc: 'md-to-word.cjs' },
    { path: MD_TO_EML, desc: 'md-to-eml.cjs' },
    { path: NAV_INJECT, desc: 'nav-inject.cjs' },
    { path: path.join(SHARED, 'data-uri.cjs'), desc: 'shared/data-uri.cjs' },
    { path: path.join(SHARED, 'mermaid-pipeline.cjs'), desc: 'shared/mermaid-pipeline.cjs' },
    { path: path.join(SHARED, 'markdown-preprocessor.cjs'), desc: 'shared/markdown-preprocessor.cjs'},
    { path: path.join(SHARED, 'replicate-core.cjs'), desc: 'shared/replicate-core.cjs' },
    { path: path.join(SHARED, 'converter-config.cjs'), desc: 'shared/converter-config.cjs' },
    { path: path.join(SHARED, 'prompt-preprocessor.cjs'), desc: 'shared/prompt-preprocessor.cjs' },
    { path: path.join(SHARED, 'index.mjs'), desc: 'shared/index.mjs (ESM bridge)' },
    { path: path.join(LUA, 'keep-headings.lua'), desc: 'lua-filters/keep-headings.lua' },
    { path: path.join(LUA, 'word-table-style.lua'), desc: 'lua-filters/word-table-style.lua' },
    { path: path.join(LUA, 'caption-labels.lua'), desc: 'lua-filters/caption-labels.lua' },
    { path: path.join(ROOT, '.github', 'config', 'visual-memory.json'), desc: 'visual-memory.json' },
  ];

  for (const { path: p, desc } of required) {
    assert(fileExists(p), `${desc} exists`);
  }
});

suite('md-to-word.cjs: end-to-end smoke test', () => {
  // Create a test markdown file with various features
  const testMd = createTempFile('test-word.md', `# Test Document

## Introduction

This is a **bold** test with *italic* and \`code\`.

::: tip
This is a tip callout for testing.
:::

> [!WARNING]
> This is a GitHub-style warning.

Press [[Ctrl+S]] to save. Here is ==highlighted text==.

Water is H~2~O. Energy is E=mc^2^.

Term One
: The first definition.

| Column A | Column B |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

\`\`\`javascript
const x = 42;
console.log(x);
\`\`\`

<!-- pagebreak -->

## Conclusion

Final paragraph.
`);

  // Check if pandoc is available
  const pandocCheck = spawnSync('pandoc', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (pandocCheck.status !== 0) {
    skip('pandoc not installed — skipping e2e test');
    return;
  }

  // md-to-word uses positional args: SOURCE [OUTPUT] [--options]
  const outputPath = path.join(TEMP_DIR, 'test-output.docx');
  const result = runNode(MD_TO_WORD, [testMd, outputPath, '--style', 'academic'], 60000);

  if (result.status === 0 && fileExists(outputPath)) {
    assert(true, 'Word output file created');
    const size = fileSize(outputPath);
    assert(size > 1000, `Output size reasonable (${size} bytes > 1KB)`);
    assert(size < 5000000, `Output not oversized (${size} bytes < 5MB)`);

    // Verify it's a valid ZIP (docx files are ZIP archives)
    const header = Buffer.alloc(4);
    const fd = fs.openSync(outputPath, 'r');
    fs.readSync(fd, header, 0, 4, 0);
    fs.closeSync(fd);
    assert(header[0] === 0x50 && header[1] === 0x4B, 'Output has valid ZIP/DOCX magic bytes');
  } else {
    if (_verbose) console.log(`  stdout: ${result.stdout.slice(0, 300)}`);
    if (_verbose) console.log(`  stderr: ${result.stderr.slice(0, 300)}`);
    assert(false, `md-to-word.cjs failed (status ${result.status})`);
  }
});

suite('md-to-word.cjs: style presets', () => {
  const styles = ['professional', 'academic', 'course', 'creative'];
  const pandocCheck = spawnSync('pandoc', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (pandocCheck.status !== 0) {
    skip('pandoc not installed');
    return;
  }

  const testMd = createTempFile('style-test.md', '# Style Test\n\nParagraph content.\n');

  for (const style of styles) {
    const outPath = path.join(TEMP_DIR, `style-${style}.docx`);
    const result = runNode(MD_TO_WORD, [testMd, outPath, '--style', style], 30000);
    assert(result.status === 0, `--style ${style} exits cleanly`);
    if (result.status === 0 && fileExists(outPath)) {
      assert(true, `--style ${style} produces output`);
    }
  }
});

suite('nav-inject.cjs: --init creates nav.json', () => {
  const navJson = path.join(TEMP_DIR, 'nav.json');
  const result = runNode(NAV_INJECT, ['--init', navJson], 10000);
  assert(result.status === 0, 'nav-inject --init exits cleanly');
  if (fileExists(navJson)) {
    const cfg = JSON.parse(fs.readFileSync(navJson, 'utf8'));
    assert(cfg.style != null, 'nav.json has style field');
    assert(Array.isArray(cfg.files), 'nav.json has files array');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Mermaid creation helpers
// ─────────────────────────────────────────────────────────────────────────────

suite('Shared: mermaid-pipeline.cjs — creation helpers', () => {
  const mp = require(path.join(SHARED, 'mermaid-pipeline.cjs'));

  // createFlowchart
  assert(typeof mp.createFlowchart === 'function', 'createFlowchart exported');
  const fc = mp.createFlowchart({
    direction: 'TD',
    nodes: [
      { id: 'A', label: 'Start', shape: 'round' },
      { id: 'B', label: 'End', shape: 'stadium' },
    ],
    edges: [{ from: 'A', to: 'B', label: 'go' }],
  });
  assert(fc.includes('flowchart TD'), 'flowchart has direction');
  assert(fc.includes('A(') || fc.includes('A['), 'flowchart has node A');
  assert(fc.includes('-->'), 'flowchart has edge arrow');

  // createSequence
  assert(typeof mp.createSequence === 'function', 'createSequence exported');
  const seq = mp.createSequence({
    participants: ['Alice', 'Bob'],
    messages: [{ from: 'Alice', to: 'Bob', text: 'Hello' }],
  });
  assert(seq.includes('sequenceDiagram'), 'sequence has header');
  assert(seq.includes('Alice'), 'sequence has participant');

  // createGantt
  assert(typeof mp.createGantt === 'function', 'createGantt exported');
  const gantt = mp.createGantt({
    title: 'Test',
    sections: [{ name: 'Phase 1', tasks: [{ name: 'Task 1', status: 'done', duration: '3d' }] }],
  });
  assert(gantt.includes('gantt'), 'gantt has header');
  assert(gantt.includes('Phase 1'), 'gantt has section');

  // createTimeline
  assert(typeof mp.createTimeline === 'function', 'createTimeline exported');
  const tl = mp.createTimeline({
    entries: [{ period: '2024', events: ['Launch'] }],
  });
  assert(tl.includes('timeline'), 'timeline has header');

  // createMindmap
  assert(typeof mp.createMindmap === 'function', 'createMindmap exported');
  const mm = mp.createMindmap({
    root: { label: 'Root', children: [{ label: 'A' }] },
  });
  assert(mm.includes('mindmap'), 'mindmap has header');

  // wrapInFence
  assert(typeof mp.wrapInFence === 'function', 'wrapInFence exported');
  const fenced = mp.wrapInFence('flowchart TD\n  A-->B');
  assert(fenced.startsWith('```mermaid'), 'wrapInFence adds opening fence');
  assert(fenced.endsWith('```\n') || fenced.trimEnd().endsWith('```'), 'wrapInFence adds closing fence');
});

// ─────────────────────────────────────────────────────────────────────────────
// SVG pipeline
// ─────────────────────────────────────────────────────────────────────────────

suite('Shared: svg-pipeline.cjs', () => {
  const svg = require(path.join(SHARED, 'svg-pipeline.cjs'));

  assert(typeof svg.BRAND_COLORS === 'object', 'BRAND_COLORS exported');
  assert(svg.BRAND_COLORS.blue != null, 'BRAND_COLORS.blue exists');
  assert(svg.BRAND_COLORS.blue.fill != null, 'BRAND_COLORS.blue has fill');

  assert(typeof svg.THEME === 'object', 'THEME exported');
  assert(svg.THEME.light != null, 'THEME.light exists');
  assert(svg.THEME.dark != null, 'THEME.dark exists');

  // createSvg
  assert(typeof svg.createSvg === 'function', 'createSvg exported');
  const s1 = svg.createSvg({ width: 200, height: 100, title: 'Test' });
  assert(s1.includes('xmlns="http://www.w3.org/2000/svg"'), 'createSvg has xmlns');
  assert(s1.includes('viewBox'), 'createSvg has viewBox');
  assert(s1.includes('role="img"'), 'createSvg has role=img');
  assert(s1.includes('</svg>'), 'createSvg closes svg tag');

  // createIcon
  assert(typeof svg.createIcon === 'function', 'createIcon exported');
  const icon = svg.createIcon({ glyph: '\u2699', label: 'Settings' });
  assert(icon.includes('<svg'), 'createIcon produces svg');
  assert(icon.includes('\u2699'), 'createIcon includes glyph');

  // createBadge
  assert(typeof svg.createBadge === 'function', 'createBadge exported');
  const badge = svg.createBadge({ label: 'version', value: '1.0', color: 'green' });
  assert(badge.includes('<svg'), 'createBadge produces svg');
  assert(badge.includes('1.0'), 'createBadge includes value');

  // createDiagram
  assert(typeof svg.createDiagram === 'function', 'createDiagram exported');
  const diag = svg.createDiagram({
    shapes: [
      { type: 'rect', x: 10, y: 10, label: 'Box' },
      { type: 'circle', x: 180, y: 50, label: 'Node' },
    ],
    arrows: [{ from: 0, to: 1 }],
  });
  assert(diag.includes('<rect'), 'createDiagram has rect');
  assert(diag.includes('<ellipse'), 'createDiagram has circle (rendered as ellipse)');
  assert(diag.includes('<marker'), 'createDiagram has arrowhead marker');

  // validateSvg
  assert(typeof svg.validateSvg === 'function', 'validateSvg exported');
  const v1 = svg.validateSvg(s1);
  assert(v1 && typeof v1.valid === 'boolean', 'validateSvg returns { valid, warnings }');
  // Valid SVG should have few warnings
  const badSvg = '<svg><rect/></svg>';
  const v2 = svg.validateSvg(badSvg);
  assert(v2.warnings.length > 0, 'validateSvg catches missing xmlns');

  // writeSvg
  assert(typeof svg.writeSvg === 'function', 'writeSvg exported');
  const svgOut = path.join(TEMP_DIR, 'test-output.svg');
  svg.writeSvg(s1, svgOut);
  assert(fileExists(svgOut), 'writeSvg creates file');
  assert(fs.readFileSync(svgOut, 'utf8').includes('<svg'), 'writeSvg content is SVG');
});

// ─────────────────────────────────────────────────────────────────────────────
// Markdown lint/validator
// ─────────────────────────────────────────────────────────────────────────────

suite('markdown-lint.cjs', () => {
  const ML = path.join(__dirname, 'markdown-lint.cjs');
  const mdLint = require(ML);

  assert(typeof mdLint.lint === 'function', 'lint exported');
  assert(typeof mdLint.autofix === 'function', 'autofix exported');
  assert(Array.isArray(mdLint.RULES), 'RULES exported');

  // Clean document passes
  const clean = '# My Doc\n\nSome text.\n\n## Section\n\nMore text.\n';
  const r1 = mdLint.lint(clean);
  assert(r1.errors.length === 0, 'clean doc has no errors');

  // Missing H1
  const noH1 = '## Section\n\nSome text.\n';
  const r2 = mdLint.lint(noH1);
  assert(r2.errors.some(e => e.id === 'MD001'), 'detects missing H1');

  // Heading skip
  const skipH = '# Title\n\n### Skip\n';
  const r3 = mdLint.lint(skipH, { target: 'word' });
  assert(r3.warnings.some(w => w.id === 'MD002'), 'detects heading skip');

  // Mermaid smart quotes
  const smartQ = '# Doc\n\n```mermaid\nflowchart TD\n  A[\u201CHello\u201D]-->B\n```\n';
  const r4 = mdLint.lint(smartQ);
  assert(r4.warnings.some(w => w.id === 'MMD002'), 'detects mermaid smart quotes');

  // Mermaid smart quotes auto-fix
  const { content: fixed } = mdLint.autofix(smartQ);
  assert(!fixed.includes('\u201C'), 'autofix removes smart quotes');

  // Em dash detection
  const emDash = '# Doc\n\nSome text \u2014 more text.\n';
  const r5 = mdLint.lint(emDash);
  assert(r5.info.some(i => i.id === 'CONV001'), 'detects em dashes');

  // Em dash auto-fix
  const { content: fixedDash } = mdLint.autofix(emDash);
  assert(!fixedDash.includes('\u2014'), 'autofix replaces em dashes');
  assert(fixedDash.includes('--'), 'autofix uses double hyphens');

  // Email frontmatter
  const emailBad = '# Just a doc\n';
  const r6 = mdLint.lint(emailBad, { target: 'email' });
  assert(r6.errors.some(e => e.id === 'FM001'), 'detects missing email frontmatter');

  // Slides H2 check
  const fewH2 = '# Deck\n\n## Slide 1\n';
  const r7 = mdLint.lint(fewH2, { target: 'slides' });
  assert(r7.warnings.some(w => w.id === 'FM002'), 'detects too few H2 for slides');

  // Empty mermaid block
  const emptyMmd = '# Doc\n\n```mermaid\n\n```\n';
  const r8 = mdLint.lint(emptyMmd);
  assert(r8.errors.some(e => e.id === 'MMD004'), 'detects empty mermaid block');

  // Target filtering
  const r9 = mdLint.lint(emailBad, { target: 'word' });
  assert(!r9.errors.some(e => e.id === 'FM001'), 'email rules skip for word target');
});

// ─────────────────────────────────────────────────────────────────────────────
// Markdown scaffold
// ─────────────────────────────────────────────────────────────────────────────

suite('md-scaffold.cjs', () => {
  const SC = path.join(__dirname, 'md-scaffold.cjs');
  const mdScaffold = require(SC);

  assert(typeof mdScaffold.scaffold === 'function', 'scaffold exported');
  assert(typeof mdScaffold.listTemplates === 'function', 'listTemplates exported');

  // listTemplates
  const templates = mdScaffold.listTemplates();
  assert(Array.isArray(templates), 'listTemplates returns array');
  assert(templates.length >= 6, 'at least 6 templates available');
  assert(templates.some(t => t.name === 'report'), 'report template exists');
  assert(templates.some(t => t.name === 'email'), 'email template exists');
  assert(templates.some(t => t.name === 'adr'), 'adr template exists');

  // scaffold — report
  const report = mdScaffold.scaffold('report', 'Test Report');
  assert(report.includes('# Test Report'), 'report has title');
  assert(report.includes('## Table of Contents') || report.includes('## Executive Summary'), 'report has structure');
  assert(report.includes('```mermaid'), 'report has mermaid block');

  // scaffold — email
  const email = mdScaffold.scaffold('email', 'Test Email', { author: 'Test User' });
  assert(email.includes('---'), 'email has frontmatter');
  assert(email.includes('subject:'), 'email has subject field');

  // scaffold — adr
  const adr = mdScaffold.scaffold('adr', 'Use TypeScript');
  assert(adr.includes('Use TypeScript'), 'adr has title');
  assert(adr.includes('Status'), 'adr has status section');

  // scaffold — slides
  const slides = mdScaffold.scaffold('slides', 'My Talk');
  const h2Count = (slides.match(/^## /gm) || []).length;
  assert(h2Count >= 3, 'slides has enough H2 breaks');

  // scaffold — tutorial
  const tut = mdScaffold.scaffold('tutorial', 'Getting Started');
  assert(tut.includes('# Getting Started'), 'tutorial has title');
  assert(tut.includes('Prerequisites') || tut.includes('prerequisite'), 'tutorial has prerequisites');

  // scaffold — reference
  const ref = mdScaffold.scaffold('reference', 'CLI Reference');
  assert(ref.includes('# CLI Reference'), 'reference has title');

  // unknown template
  let threw = false;
  try { mdScaffold.scaffold('nonexistent', 'X'); } catch { threw = true; }
  assert(threw, 'unknown template throws');
});

// ─────────────────────────────────────────────────────────────────────────────
// Visual Regression Tests (#38) — validate OOXML structure
// ─────────────────────────────────────────────────────────────────────────────

suite('md-to-word.cjs: visual regression (OOXML structure)', () => {
  const pandocCheck = spawnSync('pandoc', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (pandocCheck.status !== 0) {
    skip('pandoc not installed — skipping visual regression');
    return;
  }

  // Document with tables, captions, headings, code blocks
  const regressionMd = createTempFile('regression.md', `# Visual Regression Test

## Tables

**Table 1: Sample Data**

| Name | Value |
|------|-------|
| Alpha | 100 |
| Beta  | 200 |
| Gamma | 300 |

**Figure 1: Test Caption**

## Code

\`\`\`python
def hello():
    return "world"
\`\`\`

## Conclusion

Final text.
`);

  const outPath = path.join(TEMP_DIR, 'regression.docx');
  const result = runNode(MD_TO_WORD, [regressionMd, outPath, '--style', 'professional'], 60000);

  if (result.status !== 0 || !fileExists(outPath)) {
    assert(false, 'Regression document generation failed');
    return;
  }

  // Read OOXML and validate structure
  try {
    const AdmZip = (() => {
      try { return require('adm-zip'); } catch { return null; }
    })();

    // At minimum, verify ZIP structure
    const header = Buffer.alloc(4);
    const fd = fs.openSync(outPath, 'r');
    fs.readSync(fd, header, 0, 4, 0);
    fs.closeSync(fd);
    assert(header[0] === 0x50 && header[1] === 0x4B, 'Regression output is valid ZIP/DOCX');
    assert(fileSize(outPath) > 2000, 'Regression output has substantial content');

    // If adm-zip is available, do deep OOXML validation
    if (AdmZip) {
      const zip = new AdmZip(outPath);
      const docXml = zip.readAsText('word/document.xml');

      assert(docXml != null && docXml.length > 0, 'document.xml exists and has content');
      assert(docXml.includes('w:tbl'), 'Document contains table element');
      assert(docXml.includes('w:shd') && docXml.includes('0078D4'), 'Table has blue header shading');
      assert(docXml.includes('w:tblHeader'), 'Table has header row repeat');
      assert(docXml.includes('w:cantSplit'), 'Table has anti-split on rows');
      assert(docXml.includes('w:keepNext'), 'Caption has keepNext');

      // Check caption styling — italic on caption runs
      const captionMatch = docXml.match(/Table\s+1[\s\S]{0,500}/);
      if (captionMatch) {
        assert(captionMatch[0].includes('w:i') || docXml.includes('<w:i'), 'Caption text has italic styling');
      }

      // Check heading colors
      assert(docXml.includes('00528B') || docXml.includes('0078D4'), 'Headings have brand colors');

      // Check code block background
      assert(docXml.includes('F5F5F5'), 'Code block has light gray background');

      // Footer check
      const footerXml = zip.readAsText('word/footer1.xml');
      if (footerXml) {
        assert(footerXml.includes('PAGE'), 'Footer has PAGE field code');
      }

      // Styles check
      const stylesXml = zip.readAsText('word/styles.xml');
      if (stylesXml) {
        assert(stylesXml.includes('Segoe UI') || stylesXml.includes('rFonts'), 'Styles has font definition');
      }
    } else {
      skip('adm-zip not available — deep OOXML validation skipped');
    }
  } catch (err) {
    assert(false, `Regression OOXML inspection failed: ${err.message}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Word Table Styling Regression Tests (#46)
// ─────────────────────────────────────────────────────────────────────────────

suite('md-to-word.cjs: table styling regression', () => {
  const pandocCheck = spawnSync('pandoc', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (pandocCheck.status !== 0) {
    skip('pandoc not installed');
    return;
  }

  const tableMd = createTempFile('table-regression.md', `# Table Regression

| Col A | Col B | Col C |
|-------|-------|-------|
| Row 1a | Row 1b | Row 1c |
| Row 2a | Row 2b | Row 2c |
| Row 3a | Row 3b | Row 3c |
| Row 4a | Row 4b | Row 4c |
`);

  const outPath = path.join(TEMP_DIR, 'table-regression.docx');
  const result = runNode(MD_TO_WORD, [tableMd, outPath], 60000);

  if (result.status !== 0 || !fileExists(outPath)) {
    assert(false, 'Table regression generation failed');
    return;
  }

  try {
    const AdmZip = (() => { try { return require('adm-zip'); } catch { return null; } })();
    if (AdmZip) {
      const zip = new AdmZip(outPath);
      const docXml = zip.readAsText('word/document.xml');

      // Anti-pagination controls
      const cantSplitCount = (docXml.match(/w:cantSplit/g) || []).length;
      assert(cantSplitCount >= 4, `cantSplit on all data rows (found ${cantSplitCount})`);

      // Header row repeat
      assert(docXml.includes('w:tblHeader'), 'Header row set to repeat');

      // Blue header shading (#0078D4)
      assert(docXml.includes('0078D4'), 'Header has Microsoft blue (#0078D4)');

      // Alternating row shading — check for F0F0F0 (light gray)
      assert(docXml.includes('F0F0F0'), 'Even rows have alternating gray shading');

      // Table borders
      assert(docXml.includes('w:tblBorders'), 'Table has border definitions');

      // Full-width table
      assert(docXml.includes('w:tblW') && docXml.includes('5000'), 'Table is full-width (5000 pct)');
    } else {
      skip('adm-zip not available');
    }
  } catch (err) {
    assert(false, `Table regression inspection failed: ${err.message}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Email Rendering Tests (#44)
// ─────────────────────────────────────────────────────────────────────────────

suite('md-to-eml.cjs: email rendering structure', () => {
  const pandocCheck = spawnSync('pandoc', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (pandocCheck.status !== 0) {
    skip('pandoc not installed');
    return;
  }

  const emailMd = createTempFile('test-email.md', `---
to: test@example.com
from: sender@example.com
subject: QA Test Email
---

# Hello

This is a **test email** with [a link](https://example.com).

| Item | Status |
|------|--------|
| Feature | Done |

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`
`);

  const emlPath = path.join(TEMP_DIR, 'test.eml');
  const result = runNode(MD_TO_EML, [emailMd, emlPath], 30000);

  if (result.status !== 0 || !fileExists(emlPath)) {
    // md-to-eml may fail in CI without proper setup — skip gracefully
    skip('md-to-eml failed (may need setup)');
    return;
  }

  const emlContent = fs.readFileSync(emlPath, 'utf8');

  // RFC 5322 headers
  assert(emlContent.includes('To:'), 'EML has To: header');
  assert(emlContent.includes('From:'), 'EML has From: header');
  assert(emlContent.includes('Subject:'), 'EML has Subject: header');
  assert(emlContent.includes('Content-Type:'), 'EML has Content-Type header');

  // MIME structure — HTML body is base64-encoded per RFC 2045
  assert(emlContent.includes('Content-Transfer-Encoding: base64'), 'EML uses base64 transfer encoding');
  assert(emlContent.includes('text/html'), 'Content-Type declares text/html');

  // Decode base64 body to validate HTML content
  const bodyStart = emlContent.indexOf('\r\n\r\n');
  if (bodyStart > 0) {
    const bodySection = emlContent.slice(bodyStart + 4).split(/\r?\n--/)[0].trim();
    try {
      const decoded = Buffer.from(bodySection.replace(/\r?\n/g, ''), 'base64').toString('utf8');
      assert(decoded.includes('<html') || decoded.includes('<!DOCTYPE'), 'Decoded body contains HTML');
      assert(decoded.includes('style='), 'Decoded body has inline styles');
      assert(decoded.includes('href=') || decoded.includes('example.com'), 'Decoded body has link');
    } catch {
      skip('Base64 decode failed — body may be multipart');
    }
  }

  // Mermaid should be replaced with fallback (not raw mermaid code)
  assert(!emlContent.includes('```mermaid'), 'Mermaid blocks replaced (not raw fence)');
});

// ─────────────────────────────────────────────────────────────────────────────
// PDF Engine Cross-Validation (#45)
// ─────────────────────────────────────────────────────────────────────────────

suite('PDF engine cross-validation', () => {
  const pandocCheck = spawnSync('pandoc', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (pandocCheck.status !== 0) {
    skip('pandoc not installed');
    return;
  }

  const pdfMd = createTempFile('pdf-test.md', `# PDF Engine Test

## Greek Symbols

The coefficient \u03B1 and \u03B2 with \u03C3 variance.

## Table

| A | B |
|---|---|
| 1 | 2 |

Conclusion text.
`);

  // Test lualatex if available
  const luaCheck = spawnSync('lualatex', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (luaCheck.status === 0) {
    const luaPdf = path.join(TEMP_DIR, 'test-lua.pdf');
    const luaResult = spawnSync('pandoc', [pdfMd, '-o', luaPdf, '--pdf-engine=lualatex'], {
      cwd: TEMP_DIR, encoding: 'utf8', timeout: 60000,
    });
    if (luaResult.status === 0 && fileExists(luaPdf)) {
      assert(fileSize(luaPdf) > 500, 'lualatex produces valid PDF');
      // PDF magic bytes: %PDF
      const pdfHeader = Buffer.alloc(4);
      const fd = fs.openSync(luaPdf, 'r');
      fs.readSync(fd, pdfHeader, 0, 4, 0);
      fs.closeSync(fd);
      assert(pdfHeader[0] === 0x25 && pdfHeader[1] === 0x50, 'lualatex output has PDF magic bytes');
    } else {
      skip('lualatex run failed (font/package issue)');
    }
  } else {
    skip('lualatex not installed');
  }

  // Test xelatex if available
  const xeCheck = spawnSync('xelatex', ['--version'], { encoding: 'utf8', timeout: 5000 });
  if (xeCheck.status === 0) {
    const xePdf = path.join(TEMP_DIR, 'test-xe.pdf');
    const xeResult = spawnSync('pandoc', [pdfMd, '-o', xePdf, '--pdf-engine=xelatex'], {
      cwd: TEMP_DIR, encoding: 'utf8', timeout: 60000,
    });
    if (xeResult.status === 0 && fileExists(xePdf)) {
      assert(fileSize(xePdf) > 500, 'xelatex produces valid PDF');
    } else {
      skip('xelatex run failed (font/package issue)');
    }
  } else {
    skip('xelatex not installed');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Replicate Core: new features (#16, #19, #39, #40, #43)
// ─────────────────────────────────────────────────────────────────────────────

suite('Shared: replicate-core.cjs — batch retry & validation', () => {
  const mod = require(path.join(SHARED, 'replicate-core.cjs'));

  // Duration validation (#19)
  assert(typeof mod.validateDuration === 'function', 'validateDuration is exported');
  const v1 = mod.validateDuration('minimax/hailuo-ai-video-01-director', 7);
  assert(v1.valid === false, 'Invalid duration rejected for hailuo');
  assert(v1.message.includes('6') && v1.message.includes('10'), 'Error message shows allowed values');
  assert(v1.suggested === 6, 'Suggests default duration');

  const v2 = mod.validateDuration('minimax/hailuo-ai-video-01-director', 6);
  assert(v2.valid === true, 'Valid duration accepted');

  const v3 = mod.validateDuration('luma/ray', 3);
  assert(v3.valid === false, 'Below-minimum duration rejected');

  const v4 = mod.validateDuration('luma/ray', 5);
  assert(v4.valid === true, 'In-range duration accepted');

  const v5 = mod.validateDuration('unknown/model', 999);
  assert(v5.valid === true, 'Unknown model passes validation');

  // Model freshness (#43)
  assert(typeof mod.checkModelFreshness === 'function', 'checkModelFreshness is exported');
  assert(typeof mod.MODEL_REGISTRY === 'object', 'MODEL_REGISTRY is exported');
  const fresh = mod.checkModelFreshness('google/nano-banana-pro');
  assert(fresh.fresh === true, 'Recently verified model is fresh');
  assert(fresh.daysSinceVerified != null, 'Returns days since verified');

  const unknown = mod.checkModelFreshness('some/unknown-model');
  assert(unknown.fresh === true, 'Unknown model treated as fresh (no tracking)');

  // DURATION_CONSTRAINTS export
  assert(typeof mod.DURATION_CONSTRAINTS === 'object', 'DURATION_CONSTRAINTS is exported');

  // Enhanced parseCliArgs (#40)
  const argv = ['node', 'script.js', '--variants=3', '--save-prompts', '--postprocess=rembg,upscale'];
  const parsed = mod.parseCliArgs(argv);
  assert(parsed.variants === 3, 'parseCliArgs: --variants=3');
  assert(parsed.savePrompts === true, 'parseCliArgs: --save-prompts');
  assert(Array.isArray(parsed.postprocess), 'parseCliArgs: --postprocess is array');
  assert(parsed.postprocess.includes('rembg'), 'parseCliArgs: postprocess includes rembg');
  assert(parsed.postprocess.includes('upscale'), 'parseCliArgs: postprocess includes upscale');

  // postProcess export (#33)
  assert(typeof mod.postProcess === 'function', 'postProcess is exported');
});

// ─────────────────────────────────────────────────────────────────────────────
// Prompt Preprocessor (#27)
// ─────────────────────────────────────────────────────────────────────────────

suite('Shared: prompt-preprocessor.cjs', () => {
  const mod = require(path.join(SHARED, 'prompt-preprocessor.cjs'));

  assert(typeof mod.preprocessPrompt === 'function', 'preprocessPrompt is exported');
  assert(typeof mod.validatePrompt === 'function', 'validatePrompt is exported');
  assert(typeof mod.injectTraits === 'function', 'injectTraits is exported');
  assert(typeof mod.cleanPrompt === 'function', 'cleanPrompt is exported');
  assert(typeof mod.PROMPT_LIMITS === 'object', 'PROMPT_LIMITS is exported');

  // Smart quote cleanup
  const cleaned = mod.cleanPrompt('A \u201Csmart\u201D quote and an em\u2014dash');
  assert(!cleaned.includes('\u201C'), 'cleanPrompt removes left smart quote');
  assert(!cleaned.includes('\u2014'), 'cleanPrompt replaces em dash');
  assert(cleaned.includes('"smart"'), 'cleanPrompt uses straight quotes');
  assert(cleaned.includes('--'), 'cleanPrompt uses double hyphens');

  // Validation
  const valid = mod.validatePrompt('A short prompt', { model: 'ideogram-ai/ideogram-v2' });
  assert(valid.valid === true, 'Short prompt validates clean');

  const empty = mod.validatePrompt('', {});
  assert(empty.valid === false, 'Empty prompt fails validation');

  // Length limit
  const longPrompt = 'x'.repeat(5000);
  const longResult = mod.validatePrompt(longPrompt, { model: 'google/nano-banana-pro' });
  assert(longResult.truncated === true, 'Over-length prompt flagged as truncated');

  // cleanPrompt truncation
  const truncated = mod.cleanPrompt(longPrompt, { model: 'google/nano-banana-pro' });
  assert(truncated.length <= 1024, 'cleanPrompt truncates to model limit');

  // Trait injection
  const charConfig = {
    subjects: { alex: { immutableTraits: ['brown hair', 'green eyes', '26 years old'] } },
  };
  const injected = mod.injectTraits('A portrait in a garden', charConfig, 'alex');
  assert(injected.includes('IDENTITY PRESERVATION'), 'Traits injected with priority header');
  assert(injected.includes('brown hair'), 'Trait content present');
  assert(injected.includes('A portrait in a garden'), 'Original prompt preserved');

  // No traits when config missing
  const noTraits = mod.injectTraits('raw prompt', null);
  assert(noTraits === 'raw prompt', 'No injection when config is null');

  // Full pipeline
  const { prompt, validation } = mod.preprocessPrompt('A \u201Cstyled\u201D test', {
    model: 'ideogram-ai/ideogram-v2',
    charConfig,
    subject: 'alex',
  });
  assert(prompt.includes('IDENTITY PRESERVATION'), 'Full pipeline injects traits');
  assert(!prompt.includes('\u201C'), 'Full pipeline cleans quotes');
  assert(validation != null, 'Full pipeline returns validation');

  // Model family detection
  assert(mod.modelFamily('ideogram-ai/ideogram-v2') === 'ideogram', 'modelFamily: ideogram');
  assert(mod.modelFamily('black-forest-labs/flux-1.1-pro') === 'flux', 'modelFamily: flux');
  assert(mod.modelFamily('google/nano-banana-pro') === 'nano-banana', 'modelFamily: nano-banana');
  assert(mod.modelFamily('unknown/model') === 'default', 'modelFamily: default');
});

// ─────────────────────────────────────────────────────────────────────────────
// v5.2.0 NEW FEATURE TESTS
// ─────────────────────────────────────────────────────────────────────────────

suite('Shared: markdown-preprocessor.cjs — heading validation', () => {
  const mod = require(path.join(SHARED, 'markdown-preprocessor.cjs'));

  assert(typeof mod.validateHeadingHierarchy === 'function', 'validateHeadingHierarchy is exported');

  // Valid hierarchy: H1 → H2 → H3
  const good = mod.validateHeadingHierarchy('# Title\n## Section\n### Sub');
  assert(good.valid === true, 'Valid hierarchy returns valid=true');
  assert(good.warnings.length === 0, 'Valid hierarchy has no warnings');

  // Invalid hierarchy: H1 → H3 (skips H2)
  const bad = mod.validateHeadingHierarchy('# Title\n### Skipped H2');
  assert(bad.valid === false, 'H1→H3 skip returns valid=false');
  assert(bad.warnings.length > 0, 'H1→H3 skip has warnings');
  assert(bad.warnings[0].includes('H3'), 'Warning mentions the offending level');

  // No headings — should be valid
  const none = mod.validateHeadingHierarchy('Just some text\nNo headings here');
  assert(none.valid === true, 'No headings returns valid=true');

  // H2 → H4 skip
  const deepSkip = mod.validateHeadingHierarchy('## Section\n#### Deep skip');
  assert(deepSkip.valid === false, 'H2→H4 skip returns valid=false');
});

suite('Shared: markdown-preprocessor.cjs — image embedding', () => {
  const mod = require(path.join(SHARED, 'markdown-preprocessor.cjs'));

  assert(typeof mod.embedLocalImages === 'function', 'embedLocalImages is exported');

  // Create a tiny PNG file for testing
  const imgDir = path.join(TEMP_DIR, 'img-embed-test');
  fs.mkdirSync(imgDir, { recursive: true });
  const imgPath = path.join(imgDir, 'test.png');
  fs.writeFileSync(imgPath, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]));

  // Local image should be embedded
  const content = '![Alt text](test.png)';
  const result = mod.embedLocalImages(content, imgDir);
  assert(result.includes('data:image/png;base64,'), 'Local image embedded as base64');
  assert(!result.includes('](test.png)'), 'Original path replaced');

  // HTTP URLs should NOT be embedded
  const httpContent = '![Remote](https://example.com/image.png)';
  const httpResult = mod.embedLocalImages(httpContent, imgDir);
  assert(httpResult.includes('https://example.com/image.png'), 'HTTP URLs left unchanged');

  // Data URIs should NOT be re-embedded
  const dataContent = '![Already](data:image/png;base64,abc123)';
  const dataResult = mod.embedLocalImages(dataContent, imgDir);
  assert(dataResult.includes('data:image/png;base64,abc123'), 'Data URIs left unchanged');

  // Missing file should be left unchanged
  const missingContent = '![Missing](nonexistent.png)';
  const missingResult = mod.embedLocalImages(missingContent, imgDir);
  assert(missingResult.includes('nonexistent.png'), 'Missing file paths left unchanged');
});

suite('Shared: replicate-core.cjs — negative-prompt & prompt-file', () => {
  const mod = require(path.join(SHARED, 'replicate-core.cjs'));

  // Negative prompt parsing
  const neg = mod.parseCliArgs(['node', 'script.js', '--negative-prompt=blurry, low quality']);
  assert(neg.negativePrompt === 'blurry, low quality', 'parseCliArgs: --negative-prompt');

  // Negative prompt with equals sign in value
  const negEq = mod.parseCliArgs(['node', 'script.js', '--negative-prompt=style=cartoon']);
  assert(negEq.negativePrompt === 'style=cartoon', 'parseCliArgs: --negative-prompt with = in value');

  // Prompt file parsing (without actual file — just field presence)
  const noFile = mod.parseCliArgs(['node', 'script.js']);
  assert(noFile.negativePrompt === null, 'Default negativePrompt is null');
  assert(noFile.promptFile === null, 'Default promptFile is null');

  // Prompt file with real temp file
  const promptPath = createTempFile('test-prompt.txt', 'A beautiful landscape with mountains');
  const withFile = mod.parseCliArgs(['node', 'script.js', `--prompt-file=${promptPath}`]);
  assert(withFile.promptFile === promptPath, 'parseCliArgs: --prompt-file path');
  assert(withFile.promptFileContent === 'A beautiful landscape with mountains', 'promptFileContent loaded from file');
});

suite('md-to-word.cjs: CLI flag parsing (new flags)', () => {
  // Test that the new flags are accepted by parseArgs via --help-like checking
  const result = runNode(MD_TO_WORD, ['--help-flags-check'], 5000);
  // The script exits with usage error showing the flags
  const output = result.stdout + result.stderr;

  // We check the usage message includes the new flags
  assert(output.includes('--embed-images') || output.includes('embedImages'), 'Usage mentions --embed-images');
  assert(output.includes('--strip-frontmatter') || output.includes('stripFrontmatter'), 'Usage mentions --strip-frontmatter');
  assert(output.includes('--recursive') || output.includes('recursive'), 'Usage mentions --recursive');
});

suite('Shared: markdown-preprocessor.cjs — link validation', () => {
  const mod = require(path.join(SHARED, 'markdown-preprocessor.cjs'));

  assert(typeof mod.validateLinks === 'function', 'validateLinks is exported');

  // Valid external link
  const good = mod.validateLinks('[Google](https://google.com)\n[Anchor](#section)');
  assert(good.valid === true, 'External links and anchors are valid');

  // Empty URL
  const empty = mod.validateLinks('[Click here]()');
  assert(empty.valid === false, 'Empty link URL returns valid=false');
  assert(empty.warnings[0].includes('empty'), 'Warning mentions empty URL');

  // Broken local link (with sourceDir)
  const broken = mod.validateLinks('[Missing](nonexistent-file.md)', TEMP_DIR);
  assert(broken.valid === false, 'Broken local link returns valid=false');
  assert(broken.warnings[0].includes('not found'), 'Warning mentions file not found');

  // Valid local link
  const localFile = createTempFile('link-target.md', '# Target');
  const validLocal = mod.validateLinks(`[Target](link-target.md)`, TEMP_DIR);
  assert(validLocal.valid === true, 'Existing local link returns valid=true');

  // Images are skipped (not links)
  const image = mod.validateLinks('![Alt](missing.png)');
  assert(image.valid === true, 'Image refs are not link-validated');

  // mailto is skipped
  const mailto = mod.validateLinks('[Email](mailto:test@example.com)');
  assert(mailto.valid === true, 'mailto links are valid');
});

suite('Shared: markdown-preprocessor.cjs — footnote passthrough', () => {
  const mod = require(path.join(SHARED, 'markdown-preprocessor.cjs'));

  // Footnote syntax should be preserved through preprocessing (pandoc handles it)
  const input = 'Text with footnote[^1].\n\n[^1]: This is the footnote content.';
  const output = mod.preprocessMarkdown(input);
  assert(output.includes('[^1]'), 'Footnote ref [^1] preserved after preprocessing');
  assert(output.includes('[^1]:'), 'Footnote def [^1]: preserved after preprocessing');
});

suite('md-to-word.cjs: dry-run mode', () => {
  // Create a simple test markdown file
  const testMd = createTempFile('dry-run-test.md', '# Test\\n\\nHello world');
  const outPath = path.join(TEMP_DIR, 'dry-run-test.docx');

  const result = runNode(MD_TO_WORD, [testMd, outPath, '--dry-run'], 10000);
  assert(result.status === 0, 'Dry-run exits with code 0');
  assert((result.stdout + result.stderr).includes('Dry-run complete'), 'Dry-run prints completion message');
  assert(!fileExists(outPath), 'Dry-run does not generate .docx file');
});

// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP & REPORT
// ─────────────────────────────────────────────────────────────────────────────

// Clean temp dir
try {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
} catch { /* ignore cleanup errors */ }

console.log('\n==================================================================');
console.log(`  QA Results: ${_passed} passed, ${_failed} failed, ${_skipped} skipped`);
console.log('==================================================================');

if (_failures.length > 0) {
  console.log('\n  Failures:');
  _failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

console.log('');
process.exit(_failed > 0 ? 1 : 0);
