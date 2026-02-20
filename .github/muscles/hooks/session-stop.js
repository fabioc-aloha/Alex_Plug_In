#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — SessionStop Hook
 * Runs when a VS Code agent session ends.
 *
 * - Appends a timestamped session entry to session-metrics.json
 * - Suggests meditation if the session exceeded 30 minutes
 *
 * Part of: v5.9.0 — VS Code API Adoption
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');
const metricsPath = path.join(ghPath, 'config', 'session-metrics.json');

// ── Load or initialise metrics store ──────────────────────────────────────

let metrics = { sessions: [] };
try {
  if (fs.existsSync(metricsPath)) {
    metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  }
} catch {
  // Treat parse errors as a fresh store — don't fail the hook
}

if (!Array.isArray(metrics.sessions)) metrics.sessions = [];

// ── Record this session ────────────────────────────────────────────────────

const sessionEntry = {
  endedAt: new Date().toISOString(),
  // Hook args may pass $ALEX_SESSION_START_TIME via env if set by SessionStart
  startedAt: process.env.ALEX_SESSION_START_TIME || null,
};

// Calculate duration if start time is available
if (sessionEntry.startedAt) {
  const durationMs = Date.now() - new Date(sessionEntry.startedAt).getTime();
  sessionEntry.durationMinutes = Math.round(durationMs / 60000);
}

metrics.sessions.push(sessionEntry);
// Keep last 100 sessions to bound file size
if (metrics.sessions.length > 100) {
  metrics.sessions = metrics.sessions.slice(-100);
}

try {
  // Ensure directory exists
  const configDir = path.dirname(metricsPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2) + '\n', 'utf8');
} catch (err) {
  // Log but don't fail the hook
  console.error(`[Alex SessionStop] Warning: could not write session metrics — ${err.message}`);
}

// ── Meditation suggestion ──────────────────────────────────────────────────

const output = ['[Alex SessionStop] Session complete.'];

const duration = sessionEntry.durationMinutes;
if (duration !== undefined && duration >= 30) {
  output.push(`Session ran ${duration} minutes — consider running /meditate to consolidate learnings.`);
}

output.push(`Entry saved to .github/config/session-metrics.json`);
console.log(output.join('\n'));
