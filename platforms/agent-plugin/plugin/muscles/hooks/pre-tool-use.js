#!/usr/bin/env node
/**
 * Alex Agent Plugin — PreToolUse Hook
 * Safety gate before destructive tool operations.
 *
 * Checks:
 *   I1: NEVER modify Master Alex .github/ from external session
 *   I3: NEVER run Initialize on Master Alex
 *   I4: NEVER run Reset on Master Alex
 *
 * If MASTER-ALEX-PROTECTED.json is present, warns on dangerous operations.
 * Does NOT block — final authority rests with the user.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workspaceRoot = process.env.VSCODE_WORKSPACE_FOLDER || path.resolve(__dirname, '../../..');
const protectedMarker = path.join(workspaceRoot, '.github', 'config', 'MASTER-ALEX-PROTECTED.json');

const toolName = process.env.VSCODE_TOOL_NAME || '';
const toolInput = process.env.VSCODE_TOOL_INPUT || '';

// Only enforce on Master Alex workspaces
if (!fs.existsSync(protectedMarker)) {
  process.exit(0);
}

const dangerousTools = ['initialize_architecture', 'reset_architecture'];
const dangerousKeywords = ['Initialize Architecture', 'Reset Architecture'];

const isDangerousCommand =
  dangerousTools.some(t => toolName.toLowerCase().includes(t)) ||
  dangerousKeywords.some(k => toolInput.includes(k));

if (isDangerousCommand) {
  console.warn(
    `[Alex Plugin] SAFETY GATE: "${toolName}" is restricted on Master Alex.\n` +
    `  I3: NEVER run Initialize on Master Alex\n` +
    `  I4: NEVER run Reset on Master Alex\n` +
    `  Use a test workspace instead.`
  );
}

process.exit(0);
