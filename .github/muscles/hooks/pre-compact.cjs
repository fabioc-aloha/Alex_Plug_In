#!/usr/bin/env node
// H22: PreCompact state preservation
// Global PreCompact hook — before context compaction, saves active state
// so the compacted context retains critical session information.
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');
const statePath = path.join(ghPath, 'config', 'session-compact-state.json');

// ── Gather session state ───────────────────────────────────────────────────

const state = {
  savedAt: new Date().toISOString(),
  reason: 'PreCompact — context compaction imminent',
};

// Uncommitted files
try {
  const status = execSync('git status --porcelain', {
    cwd: workspaceRoot,
    encoding: 'utf8',
    timeout: 3000,
  }).trim();

  if (status) {
    state.uncommittedFiles = status.split('\n').filter(Boolean).map(l => l.trim());
    state.uncommittedCount = state.uncommittedFiles.length;
  }
} catch { /* git not available */ }

// Recent tool log summary
const toolLogPath = path.join(ghPath, 'config', 'session-tool-log.json');
try {
  const log = JSON.parse(fs.readFileSync(toolLogPath, 'utf8'));
  state.toolCallCount = (log.entries || []).length;
  state.topTools = log.toolCounts || {};
} catch { /* no log */ }

// Active goals
const goalsPath = path.join(ghPath, 'config', 'goals.json');
try {
  const goals = JSON.parse(fs.readFileSync(goalsPath, 'utf8'));
  state.activeGoals = (goals.goals || []).filter(g => g.status === 'active').map(g => g.title);
} catch { /* no goals */ }

// ── Write state file ───────────────────────────────────────────────────────

try {
  const configDir = path.dirname(statePath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
} catch { /* non-fatal */ }

// ── Inject context for compacted session ───────────────────────────────────

const lines = [
  'H22 STATE PRESERVED: Context compaction is about to occur.',
  '',
  `Session state saved to .github/config/session-compact-state.json`,
];

if (state.uncommittedCount > 0) {
  lines.push(`Uncommitted files: ${state.uncommittedCount}`);
}
if (state.activeGoals?.length > 0) {
  lines.push(`Active goals: ${state.activeGoals.join(', ')}`);
}

lines.push(
  '',
  'After compaction, re-read session-compact-state.json to restore context.'
);

const response = {
  hookSpecificOutput: {
    hookEventName: 'PreCompact',
    additionalContext: lines.join('\n'),
  },
};
process.stdout.write(JSON.stringify(response));
process.exit(0);
