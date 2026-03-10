#!/usr/bin/env node
// H14: Auto-commit suggestion
// Global Stop hook — if many files are modified and uncommitted, suggest a commit.
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || require('path').resolve(__dirname, '../../..');

try {
  const status = execSync('git status --porcelain', {
    cwd: workspaceRoot,
    encoding: 'utf8',
    timeout: 3000,
  }).trim();

  if (!status) {
    process.exit(0);
  }

  const changedFiles = status.split('\n').filter(Boolean);

  if (changedFiles.length > 5) {
    const response = {
      hookSpecificOutput: {
        hookEventName: 'Stop',
        additionalContext:
          `H14 COMMIT REMINDER: ${changedFiles.length} uncommitted file(s) detected.\n` +
          `I5: COMMIT before risky operations.\n` +
          `Consider committing your work before ending this session.`,
      },
    };
    process.stdout.write(JSON.stringify(response));
  }
} catch {
  // git not available — skip silently
}

process.exit(0);
