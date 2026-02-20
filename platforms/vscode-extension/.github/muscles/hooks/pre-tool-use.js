#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — PreToolUse Hook
 * Runs before every tool execution in an agent session.
 *
 * Checks Safety Imperatives I1–I7:
 *   I1: NEVER modify Master Alex .github/ from a test/sandbox session
 *   I3: NEVER run Initialize on Master Alex
 *   I4: NEVER run Reset on Master Alex
 *
 * If the MASTER-ALEX-PROTECTED.json marker is present in the workspace,
 * this hook warns but does NOT block — final authority rests with the user.
 *
 * Part of: v5.9.0 — VS Code API Adoption
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const protectedMarker = path.join(workspaceRoot, '.github', 'config', 'MASTER-ALEX-PROTECTED.json');

// Only act when the workspace carries the master-protected marker
if (!fs.existsSync(protectedMarker)) {
  // Heir/sandbox workspace — no restrictions
  process.exit(0);
}

// ── Read tool metadata passed via env ────────────────────────────────────
// VS Code 1.109 sets VSCODE_TOOL_NAME and VSCODE_TOOL_INPUT env vars
// when invoking PreToolUse hooks.

const toolName = process.env.VSCODE_TOOL_NAME || '';
const toolInput = process.env.VSCODE_TOOL_INPUT || '';

const dangerousTools = ['initialize_architecture', 'reset_architecture'];
const dangerousKeywords = ['Initialize Architecture', 'Reset Architecture'];

const isDangerousCommand =
  dangerousTools.some(t => toolName.toLowerCase().includes(t)) ||
  dangerousKeywords.some(k => toolInput.includes(k));

if (isDangerousCommand) {
  console.warn(
    `[Alex PreToolUse] ⚠️  SAFETY GATE: "${toolName}" is restricted on Master Alex.\n` +
    `  I3: NEVER run Initialize on Master Alex — overwrites living mind\n` +
    `  I4: NEVER run Reset on Master Alex — deletes architecture\n` +
    `  Use F5 + Sandbox workspace for testing. Safety Imperative active.`
  );
  // Non-zero exit = warning surfaced in VS Code UI; does not hard-block the tool
  process.exit(1);
}

// No issues found
process.exit(0);
