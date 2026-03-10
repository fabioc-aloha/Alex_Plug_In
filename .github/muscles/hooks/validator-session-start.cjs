#!/usr/bin/env node
// H3: Validator session start
// Agent-scoped SessionStart hook for Validator mode.
// Loads adversarial checklist + recent changes summary for faster QA startup.
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const lines = ['[Validator SessionStart] Adversarial review mode active.'];

// ── Recent changes summary ─────────────────────────────────────────────────

try {
  const gitLog = execSync(
    'git log --oneline -10 --no-merges',
    { cwd: workspaceRoot, encoding: 'utf8', timeout: 3000 }
  ).trim();

  if (gitLog) {
    lines.push('', '**Recent commits (last 10):**', '```', gitLog, '```');
  }
} catch { /* git not available or not a repo */ }

try {
  const diffStat = execSync(
    'git diff --stat HEAD~3..HEAD',
    { cwd: workspaceRoot, encoding: 'utf8', timeout: 3000 }
  ).trim();

  if (diffStat) {
    lines.push('', '**Changed files (last 3 commits):**', '```', diffStat, '```');
  }
} catch { /* shallow clone or <3 commits */ }

// ── Adversarial checklist ──────────────────────────────────────────────────

lines.push(
  '',
  '**Adversarial Review Checklist:**',
  '- [ ] Security: OWASP Top 10 / secrets exposure / injection vectors',
  '- [ ] Correctness: edge cases, off-by-one, null/undefined paths',
  '- [ ] Architecture: I8 compliance, dependency direction, KISS/DRY',
  '- [ ] Tests: coverage gaps, missing negative tests, flaky risk',
  '- [ ] Docs: drift from code, stale references, broken links',
  '- [ ] Safety imperatives: I1–I8 compliance verified',
  '',
  'Start by reviewing the recent changes above. Look for what could go wrong.'
);

// ── Output ─────────────────────────────────────────────────────────────────

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: lines.join('\n')
  }
}));
