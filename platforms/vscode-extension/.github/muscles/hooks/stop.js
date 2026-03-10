#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — Stop Hook
 * Runs when a session ends (replaces former SessionStop / session-stop.js).
 *
 * Input:  JSON via stdin (session_id, cwd, hook_event_name, stop_hook_active, last_assistant_message)
 * Output: Exit 0 to allow session to end (does not block).
 *         Optionally outputs JSON for verbose/debug visibility.
 *
 * Records session end in session-metrics.json for meditation analysis.
 *
 * Part of: v6.5.0 — API-Compliant Hooks (F1–F6)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Read stdin JSON ────────────────────────────────────────────────────────

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
} catch { /* No stdin or invalid JSON — use defaults */ }

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');
const metricsPath = path.join(ghPath, 'config', 'session-metrics.json');

// ── Load or initialise metrics store ──────────────────────────────────────

let metrics = { sessions: [] };
try {
  if (fs.existsSync(metricsPath)) {
    metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  }
} catch {
  // Treat parse errors as a fresh store
}

if (!Array.isArray(metrics.sessions)) metrics.sessions = [];

// ── Record this session ────────────────────────────────────────────────────

const sessionEntry = {
  sessionId: input.session_id || null,
  endedAt: new Date().toISOString(),
};

metrics.sessions.push(sessionEntry);

// Keep last 100 sessions to bound file size
if (metrics.sessions.length > 100) {
  metrics.sessions = metrics.sessions.slice(-100);
}

try {
  const configDir = path.dirname(metricsPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2) + '\n', 'utf8');
} catch (err) {
  process.stderr.write(`[Alex Stop] Warning: could not write session metrics — ${err.message}\n`);
}

// ── Exit 0 — allow session to end normally ─────────────────────────────────

process.exit(0);
