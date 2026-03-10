#!/usr/bin/env node
/**
 * Alex Agent Plugin — PreToolUse Hook
 * Safety gate before destructive tool operations.
 *
 * Input:  JSON via stdin (tool_name, tool_input, session_id, cwd, hook_event_name)
 * Output: Exit 2 + stderr for hard safety blocks, exit 0 otherwise
 *
 * Checks:
 *   I3: NEVER run Initialize on Master Alex
 *   I4: NEVER run Reset on Master Alex
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

const toolName = input.tool_name || '';
const toolInput = input.tool_input || {};
const workspaceRoot = input.cwd || path.resolve(__dirname, '../../..');
const protectedMarker = path.join(workspaceRoot, '.github', 'config', 'MASTER-ALEX-PROTECTED.json');

// Only enforce on Master Alex workspaces
if (!fs.existsSync(protectedMarker)) {
  process.exit(0);
}

const toolInputStr = JSON.stringify(toolInput);
const dangerousTools = ['initialize_architecture', 'reset_architecture'];
const dangerousKeywords = ['Initialize Architecture', 'Reset Architecture'];

const isDangerousCommand =
  dangerousTools.some(t => toolName.toLowerCase().includes(t)) ||
  dangerousKeywords.some(k => toolInputStr.includes(k));

if (isDangerousCommand) {
  process.stderr.write(
    `SAFETY GATE: "${toolName}" is BLOCKED on Master Alex.\n` +
    `I3: NEVER run Initialize on Master Alex — overwrites living mind\n` +
    `I4: NEVER run Reset on Master Alex — deletes architecture\n` +
    `Use a test workspace instead. This cannot be overridden.`
  );
  process.exit(2);
}

process.exit(0);
