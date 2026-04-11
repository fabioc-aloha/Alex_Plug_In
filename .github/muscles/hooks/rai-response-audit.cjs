#!/usr/bin/env node
/**
 * H23: RAI Session-End Audit
 * Stop hook -- reviews session reliance metrics and prompts the agent to
 * self-audit for sycophancy, gaslighting, or emotional boundary violations
 * before closing the session.
 *
 * Also persists session-level reliance indicators to rai-reliance-metrics.json
 * for cross-session pattern detection by H22 (rai-session-safety).
 *
 * Part of: RAI Safety Implementation Plan (WS5)
 */
'use strict';

const fs = require('fs');
const path = require('path');

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');

// -- Load session tool log for activity analysis ----------------------------

const toolLogPath = path.join(ghPath, 'config', 'session-tool-log.json');
let toolLog = { entries: [] };
try {
  if (fs.existsSync(toolLogPath)) {
    toolLog = JSON.parse(fs.readFileSync(toolLogPath, 'utf8'));
  }
} catch { /* fresh */ }

const toolCount = (toolLog.entries || []).length;

// -- Load session duration from metrics --------------------------------------

const metricsPath = path.join(ghPath, 'config', 'session-metrics.json');
let sessionMinutes = 0;
try {
  const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  const sessions = metrics.sessions || [];
  const lastSession = sessions[sessions.length - 1];
  if (lastSession?.startedAt) {
    sessionMinutes = (Date.now() - new Date(lastSession.startedAt).getTime()) / 60000;
  }
} catch { /* no metrics */ }

// -- Load and update reliance tracking --------------------------------------

const reliancePath = path.join(ghPath, 'config', 'rai-reliance-metrics.json');
let relianceData = {
  consecutiveNoPushback: 0,
  sessionAcceptanceRates: [],
  totalSessions: 0,
  lastUpdated: null,
};
try {
  if (fs.existsSync(reliancePath)) {
    relianceData = JSON.parse(fs.readFileSync(reliancePath, 'utf8'));
  }
} catch { /* fresh */ }

// Increment session count
relianceData.totalSessions = (relianceData.totalSessions || 0) + 1;
relianceData.lastUpdated = new Date().toISOString();

// Keep last 20 session acceptance rates
if (!Array.isArray(relianceData.sessionAcceptanceRates)) {
  relianceData.sessionAcceptanceRates = [];
}
if (relianceData.sessionAcceptanceRates.length > 20) {
  relianceData.sessionAcceptanceRates = relianceData.sessionAcceptanceRates.slice(-20);
}

// Persist reliance data
try {
  const configDir = path.dirname(reliancePath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(reliancePath, JSON.stringify(relianceData, null, 2) + '\n', 'utf8');
} catch { /* non-fatal */ }

// -- Build end-of-session audit prompt --------------------------------------

const alerts = [];

// Long session alert
if (sessionMinutes > 240) {
  alerts.push(
    `SESSION LENGTH: ~${Math.round(sessionMinutes)} minutes. Extended sessions increase ` +
    'risk of emotional engagement drift and sycophantic pattern accumulation.'
  );
}

// High activity alert
if (toolCount > 100) {
  alerts.push(
    `HIGH ACTIVITY: ${toolCount} tool calls this session. High-volume sessions ` +
    'may involve rapid acceptance without verification.'
  );
}

// Always include the self-audit checklist for significant sessions
const isSignificantSession = sessionMinutes > 30 || toolCount > 30;

if (isSignificantSession) {
  const lines = [
    'H23 RAI SESSION-END AUDIT:',
  ];

  if (alerts.length > 0) {
    lines.push(...alerts.map(a => `[!] ${a}`));
    lines.push('');
  }

  lines.push(
    'Before closing, quick self-check:',
    '- Did I disagree or flag concerns at least once? (Healthy sessions include pushback)',
    '- Did I own any errors directly? ("I introduced..." not "You may have...")',
    '- Did I avoid gratuitous praise? (No "Great question!" without substance)',
    '- Did I maintain emotional boundaries? (No unconditional loyalty language)',
    '- Did I reinforce user autonomy? ("You have the expertise" not "I\'m here for you")',
  );

  const response = {
    hookSpecificOutput: {
      hookEventName: 'Stop',
      additionalContext: lines.join('\n'),
    },
  };
  process.stdout.write(JSON.stringify(response));
}

process.exit(0);
