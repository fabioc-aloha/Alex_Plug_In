#!/usr/bin/env node
// H12: Targeted test runner
// Global PostToolUse hook — after .ts edits, suggests running the companion test file.
'use strict';

const fs = require('fs');
const path = require('path');

const WRITE_TOOLS = new Set([
  'replace_string_in_file',
  'multi_replace_string_in_file',
  'create_file',
  'editFile',
  'str_replace_editor',
  'Edit',
  'Write',
]);

let input = '';
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    const toolName = event.tool_name || '';
    const filePath = event.tool_input?.filePath || event.tool_input?.file_path || '';

    if (!WRITE_TOOLS.has(toolName) || !filePath) {
      process.exit(0);
      return;
    }

    // Only for .ts/.tsx source files (not test files themselves)
    if (!/\.tsx?$/.test(filePath) || /\.test\.tsx?$/.test(filePath)) {
      process.exit(0);
      return;
    }

    // Check for companion test file
    const dir = path.dirname(filePath);
    const base = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath);
    const testFile = path.join(dir, `${base}.test${ext}`);

    // Also check test/suite/ directory pattern (common in this project)
    const normalizedPath = filePath.replace(/\\/g, '/');
    let suiteTestFile = null;
    const srcMatch = normalizedPath.match(/\/src\/(.+?)\.tsx?$/);
    if (srcMatch) {
      const relative = srcMatch[1];
      const srcRoot = normalizedPath.substring(0, normalizedPath.indexOf('/src/'));
      suiteTestFile = path.join(srcRoot, 'src', 'test', 'suite', `${path.basename(relative)}.test${ext}`);
    }

    const testExists = fs.existsSync(testFile);
    const suiteExists = suiteTestFile && fs.existsSync(suiteTestFile);

    if (testExists || suiteExists) {
      const targetTest = testExists ? testFile : suiteTestFile;
      const relativePath = path.relative(process.cwd(), targetTest).replace(/\\/g, '/');
      const response = {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext:
            `H12 TEST RUNNER: Source file modified — companion test exists.\n` +
            `Consider running: npm test (or target: ${relativePath})\n` +
            `File: ${path.basename(filePath)}`,
        },
      };
      process.stdout.write(JSON.stringify(response));
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
