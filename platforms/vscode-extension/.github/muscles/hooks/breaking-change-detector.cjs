#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — H13: Breaking Change Detector (PreToolUse)
 * Warns when editing exported API surfaces or critical extension entry points.
 *
 * Does NOT block (permissionDecision: 'allow') but injects additionalContext
 * warning the agent to be careful with public API changes.
 *
 * Input:  JSON via stdin (tool_name, tool_input, session_id, cwd)
 * Output: JSON to stdout with additionalContext warning if editing critical files.
 *
 * Part of: v7.1.0 — Excavation Plan Sprint 3 (C4)
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ── Read stdin JSON ────────────────────────────────────────────────────────

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  /* No stdin or invalid JSON — use defaults */
}

const toolName = input.tool_name || "";
const toolInput = input.tool_input || {};

// Only check file-editing tools
const EDIT_TOOLS = [
  "replace_string_in_file",
  "create_file",
  "edit_notebook_file",
  "multi_replace_string_in_file",
];

if (!EDIT_TOOLS.includes(toolName)) {
  // Not a file edit tool — pass through silently
  process.exit(0);
}

// ── Extract file path from tool input ──────────────────────────────────────

const filePath = toolInput.filePath || toolInput.path || "";
const normalizedPath = filePath.replace(/\\/g, "/").toLowerCase();

// ── Critical file patterns ─────────────────────────────────────────────────

const CRITICAL_PATTERNS = [
  {
    pattern: "/extension.ts",
    reason: "Extension entry point (activate/deactivate)",
  },
  { pattern: "/participanttypes.ts", reason: "Public chat result interface" },
  {
    pattern: "/package.json",
    reason: "Extension manifest (commands, activation, contributions)",
  },
  {
    pattern: "/shared/constants.ts",
    reason: "Shared constants used across modules",
  },
  { pattern: "/shared/types.ts", reason: "Shared type definitions" },
  {
    pattern: "/commands/register",
    reason: "Command registration (public API)",
  },
  {
    pattern: "copilot-instructions.md",
    reason: "Root identity file (affects all agents)",
  },
];

// ── Exported API surface detection ─────────────────────────────────────────

const warnings = [];

for (const { pattern, reason } of CRITICAL_PATTERNS) {
  if (normalizedPath.includes(pattern)) {
    warnings.push(`${reason}`);
  }
}

// ── Check for export modifications in the edit content ─────────────────────

const editContent = toolInput.newString || toolInput.content || "";
const oldContent = toolInput.oldString || "";

// Detect changes to exported symbols
if (/export\s+(interface|type|class|function|const|enum)\s+/.test(oldContent)) {
  warnings.push("Modifying an exported symbol (may break consumers)");
}

// Detect removal of exports
if (
  /export\s+/.test(oldContent) &&
  !/export\s+/.test(editContent) &&
  editContent.length > 0
) {
  warnings.push("Removing an export (breaking change for consumers)");
}

// ── Output ──────────────────────────────────────────────────────────────────

if (warnings.length > 0) {
  const warningMsg = [
    "[BREAKING CHANGE RISK] Editing critical API surface.",
    `Concerns: ${warnings.join("; ")}`,
    "Verify: (1) No downstream consumers break, (2) Tests still pass, (3) Version bump needed if public API changed.",
  ].join(" ");

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
        additionalContext: warningMsg,
      },
    }),
  );
} else {
  // Silent pass
  process.exit(0);
}

process.exit(0);
