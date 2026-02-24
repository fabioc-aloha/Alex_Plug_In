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
 * Quality Gates (v5.9.9):
 *   Q1: Version drift — warn if publishing with version mismatch
 *   Q2: TypeScript compile reminder on .ts file edits
 *
 * If the MASTER-ALEX-PROTECTED.json marker is present in the workspace,
 * this hook warns but does NOT block — final authority rests with the user.
 *
 * Part of: v5.9.0 — VS Code API Adoption
 * Updated: v5.9.9 — Quality Gate Enforcement
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const protectedMarker = path.join(workspaceRoot, '.github', 'config', 'MASTER-ALEX-PROTECTED.json');

// ── Read tool metadata passed via env ────────────────────────────────────
const toolName = process.env.VSCODE_TOOL_NAME || '';
const toolInput = process.env.VSCODE_TOOL_INPUT || '';

// ── Q1: Version drift check — warn before publish ────────────────────────
const isPublishCommand =
  toolName === 'run_in_terminal' &&
  (toolInput.includes('vsce publish') || toolInput.includes('npm publish'));

if (isPublishCommand) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'package.json'), 'utf8'));
    const instructions = fs.readFileSync(
      path.join(workspaceRoot, '.github', 'copilot-instructions.md'), 'utf8'
    );
    const pkgVersion = pkg.version || '';
    const versionMatch = instructions.match(/Alex[^\n]*?v(\d+\.\d+\.\d+)/);
    const instructionsVersion = versionMatch ? versionMatch[1] : null;

    if (instructionsVersion && pkgVersion !== instructionsVersion) {
      console.warn(
        `[Alex PreToolUse] ⚠️  VERSION DRIFT DETECTED before publish:\n` +
        `  package.json: v${pkgVersion}\n` +
        `  copilot-instructions.md: v${instructionsVersion}\n` +
        `  Q1: Align versions before publishing. Definition of Done requires version consistency.`
      );
    }
  } catch { /* non-fatal — proceed */ }
}

// ── Q2: TypeScript compile reminder ──────────────────────────────────────
const isTsEdit =
  (toolName === 'editFile' || toolName === 'create_file' || toolName === 'str_replace_editor') &&
  (toolInput.includes('.ts"') || toolInput.includes(".ts'") || toolInput.includes('.ts '));

if (isTsEdit) {
  console.info(
    `[Alex PreToolUse] 💡 TypeScript file modified — run 'npm run compile' to verify no errors.\n` +
    `  Q2: Compile after every .ts edit. Errors surface early, not at publish time.`
  );
}

// Only enforce master-protection on master workspace
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
    `[Alex PreToolUse] ⚠️  SAFETY GATE: "${toolName}" is restricted on Master Alex.\n` +
    `  I3: NEVER run Initialize on Master Alex — overwrites living mind\n` +
    `  I4: NEVER run Reset on Master Alex — deletes architecture\n` +
    `  Use F5 + Sandbox workspace for testing. Safety Imperative active.`
  );
}

process.exit(0);
process.exit(0);
