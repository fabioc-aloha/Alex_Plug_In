#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — PreToolUse Hook
 * Runs before every tool execution in an agent session.
 *
 * Input:  JSON via stdin (tool_name, tool_input, session_id, cwd, hook_event_name)
 * Output: JSON to stdout with permissionDecision (allow/deny/ask)
 *         Or exit 2 + stderr for hard safety blocks
 *
 * Safety Imperatives:
 *   I3: NEVER run Initialize on Master Alex   → exit 2 (hard block)
 *   I4: NEVER run Reset on Master Alex        → exit 2 (hard block)
 *
 * Quality Gates:
 *   Q1: Version drift — deny publish if version mismatch
 *   Q2: TypeScript compile reminder on .ts file edits
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

// Serialize tool_input for keyword matching
const toolInputStr = JSON.stringify(toolInput);

// ── Helper: emit structured JSON and exit ─────────────────────────────────

function allow(context) {
  if (context) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        additionalContext: context
      }
    }));
  }
  process.exit(0);
}

function deny(reason) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason
    }
  }));
  process.exit(0);
}

// ── Safety: Master Alex protection (hard block) ──────────────────────────

if (fs.existsSync(protectedMarker)) {
  const dangerousTools = ['initialize_architecture', 'reset_architecture'];
  const dangerousKeywords = ['Initialize Architecture', 'Reset Architecture'];

  const isDangerousCommand =
    dangerousTools.some(t => toolName.toLowerCase().includes(t)) ||
    dangerousKeywords.some(k => toolInputStr.includes(k));

  if (isDangerousCommand) {
    // Exit 2 = hard block. Stderr text is fed to the agent as error context.
    process.stderr.write(
      `SAFETY GATE: "${toolName}" is BLOCKED on Master Alex.\n` +
      `I3: NEVER run Initialize on Master Alex — overwrites living mind\n` +
      `I4: NEVER run Reset on Master Alex — deletes architecture\n` +
      `Use a Sandbox workspace for testing. This cannot be overridden.`
    );
    process.exit(2);
  }
}

// ── Q1: Version drift check — deny publish ───────────────────────────────

const isPublishCommand =
  toolName === 'run_in_terminal' &&
  (toolInputStr.includes('vsce publish') || toolInputStr.includes('npm publish'));

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
      deny(
        `VERSION DRIFT DETECTED before publish:\n` +
        `  package.json: v${pkgVersion}\n` +
        `  copilot-instructions.md: v${instructionsVersion}\n` +
        `Q1: Align versions before publishing.`
      );
    }
  } catch { /* non-fatal — proceed */ }
}

// ── Q2: TypeScript compile reminder ──────────────────────────────────────

const editTools = ['editFile', 'create_file', 'str_replace_editor', 'Edit', 'Write',
  'replace_string_in_file', 'multi_replace_string_in_file'];
const isEditTool = editTools.some(t => toolName.includes(t));
const filePath = toolInput.file_path || toolInput.filePath || '';
const isTsEdit = isEditTool && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'));

if (isTsEdit) {
  allow(
    `TypeScript file modified — run 'npm run compile' to verify no errors.\n` +
    `Q2: Compile after every .ts edit. Errors surface early, not at publish time.`
  );
}

// ── Default: allow silently ────────────────────────────────────────────────

process.exit(0);
