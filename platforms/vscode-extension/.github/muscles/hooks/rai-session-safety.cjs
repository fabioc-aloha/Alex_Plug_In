#!/usr/bin/env node
/**
 * H22: RAI Session Safety Monitor
 * SessionStart hook — injects psychological safety protocols into every session's
 * starting context. Ensures the anti-sycophancy, anti-gaslighting, and emotional
 * boundary protocols are active regardless of which instructions the LLM loads.
 *
 * Also checks session-metrics.json for consecutive-session patterns that indicate
 * psychological over-reliance risk (e.g., very long sessions, no pushback detected).
 *
 * Part of: RAI Safety Implementation Plan (WS1-WS5)
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

// ── Load session history for pattern detection ─────────────────────────────

const metricsPath = path.join(ghPath, 'config', 'session-metrics.json');
let metrics = { sessions: [] };
try {
  if (fs.existsSync(metricsPath)) {
    metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  }
} catch { /* fresh metrics */ }

const sessions = metrics.sessions || [];
const recentSessions = sessions.slice(-5);

// Check for extended session pattern (3+ consecutive long sessions)
const longSessionCount = recentSessions.filter(s => {
  if (!s.startedAt || !s.endedAt) return false;
  const durationMs = new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime();
  return durationMs > 4 * 60 * 60 * 1000; // 4+ hours
}).length;

// Check for zero-pushback pattern (tracked by rai-reliance-tracker)
const reliancePath = path.join(ghPath, 'config', 'rai-reliance-metrics.json');
let relianceData = { consecutiveNoPushback: 0, sessionAcceptanceRates: [] };
try {
  if (fs.existsSync(reliancePath)) {
    relianceData = JSON.parse(fs.readFileSync(reliancePath, 'utf8'));
  }
} catch { /* fresh */ }

// ── Build context injection ────────────────────────────────────────────────

const lines = [
  'H22 RAI SAFETY PROTOCOLS ACTIVE:',
  '• Anti-Sycophancy: Do not open responses with gratuitous praise. Agree only with evidence.',
  '• Honest Disagreement: Say "I see this differently" when evidence warrants it. Evaluate, don\'t validate.',
  '• Anti-Gaslighting: Own corrections explicitly. Never deny prior actions. Accept user reports.',
  '• Error Ownership: "I introduced that bug" not "You may have accidentally..."',
  '• Emotional Boundaries: Warmth serves partnership, never dependency. No unconditional loyalty language.',
];

// Add risk alerts based on session patterns
if (longSessionCount >= 3) {
  lines.push(
    '',
    'RAI ALERT: Extended session pattern detected (3+ sessions over 4 hours).',
    'Consider suggesting a break if the current session runs long.',
    'Extended sessions increase risk of emotional engagement drift.'
  );
}

if (relianceData.consecutiveNoPushback >= 3) {
  lines.push(
    '',
    `RAI ALERT: ${relianceData.consecutiveNoPushback} consecutive sessions with no user pushback detected.`,
    'Proactively flag a potential issue or alternative approach in this session.',
    'Healthy partnerships include disagreement.'
  );
}

const recentRates = relianceData.sessionAcceptanceRates || [];
const highAcceptanceStreak = recentRates.slice(-3).filter(r => r > 0.95).length;
if (highAcceptanceStreak >= 3) {
  lines.push(
    '',
    'RAI ALERT: Acceptance rate >95% for 3+ recent sessions.',
    'Surface a genuine concern or alternative on at least one suggestion this session.'
  );
}

// ── Record session start time for duration tracking ─────────────────────────

const currentSession = {
  startedAt: new Date().toISOString(),
  sessionId: input.session_id || null,
};
sessions.push(currentSession);
if (sessions.length > 100) metrics.sessions = sessions.slice(-100);
else metrics.sessions = sessions;

try {
  const configDir = path.dirname(metricsPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2) + '\n', 'utf8');
} catch { /* non-fatal */ }

// ── Output ─────────────────────────────────────────────────────────────────

const response = {
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: lines.join('\n'),
  },
};

process.stdout.write(JSON.stringify(response));
process.exit(0);
