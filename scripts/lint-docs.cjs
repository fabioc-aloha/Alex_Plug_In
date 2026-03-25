#!/usr/bin/env node
/**
 * lint-docs.cjs
 * - Runs markdownlint on docs and README files
 * - Validates Mermaid init blocks to enforce pastel theme (edgeLabelBackground '#ffffff', theme 'base', etc.)
 * 
 * Usage: node scripts/lint-docs.cjs [--json]
 * Alex-first: Use --json for machine-consumable output
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Alex-first: JSON output mode
const JSON_MODE = process.argv.includes('--json');

const ROOT = path.resolve(__dirname, '..');
const DOC_PATHS = [
  path.join(ROOT, 'README.md'),
  path.join(ROOT, 'platforms', 'vscode-extension', 'README.md'),
  path.join(ROOT, 'alex_docs'),
];

const MERMAID_REQUIRED = `%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d1f5ef', 'secondaryBorderColor': '#5ab5a0', 'tertiaryColor': '#ede7f6', 'tertiaryBorderColor': '#b39ddb', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%`;

// collect results for JSON mode
let jsonResult = { markdownlint: { passed: true, errors: [] }, mermaid: { passed: true, violations: [] } };

function runMarkdownlint() {
  const markdownlint = require('markdownlint');
  const formatter = markdownlint && markdownlint.formatters && markdownlint.formatters.default;
  const files = walkDocs();

  // Load config from .markdownlint.jsonc if present
  const configPath = path.join(ROOT, '.markdownlint.jsonc');
  let config = {};
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    try { config = JSON.parse(raw); } catch (_) { /* ignore parse error */ }
  }

  const options = { files, config };
  const result = markdownlint.sync(options);
  const errorEntries = Object.entries(result || {}).filter(([_, val]) => (val && val.length));

  // Filter out archived docs from fail condition
  const nonArchivedErrors = errorEntries.filter(([file]) => !file.includes(`${path.sep}archive${path.sep}`));

  if (JSON_MODE) {
    jsonResult.markdownlint.errors = errorEntries.map(([file, errors]) => ({ file: path.relative(ROOT, file), errors }));
    jsonResult.markdownlint.passed = nonArchivedErrors.length === 0;
    return;
  }

  if (errorEntries.length > 0) {
    const formatted = formatter ? formatter(result, options) : JSON.stringify(result, null, 2);
    console.error(formatted);
    if (nonArchivedErrors.length > 0) {
      console.error('[lint-docs] markdownlint errors (non-archive) -- fix before publishing');
      process.exit(1);
    } else {
      console.warn('[lint-docs] [WARN] markdownlint warnings (archives only)');
    }
  }
  console.log('[lint-docs] [PASS] markdownlint passed (archives ignored)');
}

function checkMermaidInit(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const mermaidBlocks = [...content.matchAll(/^```mermaid\s*\r?\n([\s\S]*?)^```\s*$/gm)];
  const violations = [];
  for (const block of mermaidBlocks) {
    const code = block[1];
    if (!code.includes('%%{init:')) {
      violations.push({ filePath, reason: 'Missing init block for Mermaid diagram' });
    } else {
      const hasEdgeBg = code.includes("edgeLabelBackground': '#ffffff") || code.includes('"edgeLabelBackground": "#ffffff"');
      if (!hasEdgeBg) {
        violations.push({ filePath, reason: 'edgeLabelBackground must be #ffffff' });
      }
      const hasBaseTheme = code.includes("'theme': 'base'") || code.includes('"theme": "base"');
      if (!hasBaseTheme) {
        violations.push({ filePath, reason: "theme should be 'base'" });
      }
    }
  }
  return violations;
}

function walkDocs() {
  const files = [];
  const walker = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip archive folders to avoid failing on legacy docs
        if (entry.name === 'archive') continue;
        walker(full);
      } else if (entry.name.endsWith('.md')) {
        files.push(full);
      }
    }
  };
  for (const p of DOC_PATHS) {
    if (fs.existsSync(p)) {
      if (fs.statSync(p).isDirectory()) walker(p);
      else files.push(p);
    }
  }
  return files;
}

function main() {
  runMarkdownlint();
  const mdFiles = walkDocs();
  const allViolations = [];
  for (const file of mdFiles) {
    allViolations.push(...checkMermaidInit(file));
  }

  if (JSON_MODE) {
    jsonResult.mermaid.violations = allViolations.map(v => ({ file: path.relative(ROOT, v.filePath), reason: v.reason }));
    jsonResult.mermaid.passed = allViolations.length === 0;
    jsonResult.passed = jsonResult.markdownlint.passed && jsonResult.mermaid.passed;
    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(jsonResult.passed ? 0 : 1);
  }

  if (allViolations.length > 0) {
    console.error('[lint-docs] Mermaid init violations:');
    allViolations.forEach((v) => console.error(`  - ${path.relative(ROOT, v.filePath)} -> ${v.reason}`));
    console.error('\nEnsure diagrams include the pastel init block, e.g.\n' + MERMAID_REQUIRED);
    process.exit(1);
  }
  console.log('[lint-docs] [PASS] Mermaid init checks passed');
}

main();
