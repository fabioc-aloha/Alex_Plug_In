#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — PostToolUse Hook
 * Runs after every tool execution in an agent session.
 *
 * Appends lightweight tool-usage telemetry to session-tool-log.json.
 * This data feeds synapse activation analysis during meditation sessions.
 *
 * Telemetry is LOCAL only — no data ever leaves the machine.
 *
 * Part of: v5.9.0 — VS Code API Adoption
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const logPath = path.join(workspaceRoot, '.github', 'config', 'session-tool-log.json');

// ── Read tool context from env vars ──────────────────────────────────────
// VS Code 1.109 sets these for PostToolUse hooks

const toolName = process.env.VSCODE_TOOL_NAME || 'unknown';
const toolSuccess = process.env.VSCODE_TOOL_SUCCESS !== 'false';
const timestamp = new Date().toISOString();

// ── Load or initialise log ────────────────────────────────────────────────

let log = { entries: [] };
try {
  if (fs.existsSync(logPath)) {
    log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  }
} catch {
  // Fresh log
}
if (!Array.isArray(log.entries)) log.entries = [];

// Append entry
log.entries.push({ timestamp, tool: toolName, success: toolSuccess });

// Keep last 500 entries
if (log.entries.length > 500) {
  log.entries = log.entries.slice(-500);
}

// Update top-tools summary for quick synapse analysis
if (!log.toolCounts) log.toolCounts = {};
log.toolCounts[toolName] = (log.toolCounts[toolName] || 0) + 1;

try {
  const configDir = path.dirname(logPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n', 'utf8');
} catch {
  // Silent — PostToolUse must never fail the tool call
}

process.exit(0);
