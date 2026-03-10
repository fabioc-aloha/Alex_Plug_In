#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — PostToolUse Hook
 * Runs after every tool execution in an agent session.
 *
 * Input:  JSON via stdin (tool_name, tool_input, tool_response, session_id, cwd)
 * Output: Silent exit 0 (telemetry only — no agent-visible output)
 *
 * Appends lightweight tool-usage telemetry to session-tool-log.json.
 * This data feeds synapse activation analysis during meditation sessions.
 * Telemetry is LOCAL only — no data ever leaves the machine.
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

const toolName = input.tool_name || 'unknown';
const toolResponse = input.tool_response || {};
const toolSuccess = toolResponse.success !== false;
const timestamp = new Date().toISOString();

const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const logPath = path.join(workspaceRoot, '.github', 'config', 'session-tool-log.json');

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
