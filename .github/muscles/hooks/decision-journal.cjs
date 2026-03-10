#!/usr/bin/env node
// H18: Decision journal
// Global Stop hook — on long sessions (>30 min), reminds agent to journal key decisions.
// Checks session start time from session-metrics.json.
'use strict';

const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');
const metricsPath = path.join(ghPath, 'config', 'session-metrics.json');

// ── Check session duration ─────────────────────────────────────────────────

let sessionMinutes = 0;
try {
  const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  const sessions = metrics.sessions || [];
  // The most recent session should have a startedAt from session-start hook
  const lastSession = sessions[sessions.length - 1];
  if (lastSession?.startedAt) {
    sessionMinutes = (Date.now() - new Date(lastSession.startedAt).getTime()) / 60000;
  }
} catch { /* no metrics or malformed */ }

// Also check tool log for activity volume
const toolLogPath = path.join(ghPath, 'config', 'session-tool-log.json');
let toolCount = 0;
try {
  const log = JSON.parse(fs.readFileSync(toolLogPath, 'utf8'));
  toolCount = (log.entries || []).length;
} catch { /* no log */ }

// Trigger on: long session (>30 min) or high activity (>50 tool calls)
const isSignificantSession = sessionMinutes > 30 || toolCount > 50;

if (isSignificantSession) {
  const response = {
    hookSpecificOutput: {
      hookEventName: 'Stop',
      additionalContext:
        `H18 DECISION JOURNAL: This was a significant session` +
        (sessionMinutes > 0 ? ` (~${Math.round(sessionMinutes)} min)` : '') +
        (toolCount > 0 ? `, ${toolCount} tool calls` : '') +
        `.\nBefore ending, consider documenting key decisions made:\n` +
        `- Architecture decisions → alex_docs/decisions/\n` +
        `- Implementation notes → session memory or CHANGELOG\n` +
        `- Unresolved questions → ROADMAP-UNIFIED.md Research Findings`,
    },
  };
  process.stdout.write(JSON.stringify(response));
}

process.exit(0);
