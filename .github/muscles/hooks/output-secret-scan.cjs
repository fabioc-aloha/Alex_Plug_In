#!/usr/bin/env node
/**
 * Alex Cognitive Architecture -- H10: Output Secret Scan (PostToolUse)
 * Scans tool output for leaked API keys, tokens, and credentials.
 *
 * Defense-in-depth layer: H21 (UserPromptSubmit) catches secrets at input;
 * this hook catches secrets that leak through tool output (e.g., a file read
 * that returns a .env file, or a terminal command that prints credentials).
 *
 * Input:  JSON via stdin (tool_name, tool_input, tool_response, session_id, cwd)
 * Output: JSON to stdout with additionalContext warning if secrets detected.
 *         Always allows the tool call (post-use cannot block), but injects a warning.
 *
 * Part of: v7.1.0 -- Excavation Plan Sprint 3 (C4)
 */

"use strict";

const fs = require("fs");

// -- Read stdin JSON --------------------------------------------------------

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  /* No stdin or invalid JSON -- use defaults */
}

const toolResponse = input.tool_response || {};
const responseStr =
  typeof toolResponse === "string"
    ? toolResponse
    : JSON.stringify(toolResponse);

// -- Secret patterns (high-confidence, low false-positive) ------------------

const SECRET_PATTERNS = [
  // Azure / Microsoft
  {
    name: "Azure Storage Key",
    regex: /(?:AccountKey|SharedAccessSignature)=[A-Za-z0-9+/=]{40,}/i,
  },
  {
    name: "Azure AD Client Secret",
    regex:
      /(?:client_secret|clientSecret)\s*[:=]\s*["']?[A-Za-z0-9~._-]{30,}["']?/i,
  },

  // AWS
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/ },
  {
    name: "AWS Secret Key",
    regex:
      /(?:aws_secret_access_key|secret_key)\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}["']?/i,
  },

  // Generic tokens
  { name: "Bearer Token", regex: /Bearer\s+[A-Za-z0-9._~+/=-]{20,}/ },
  {
    name: "API Key Pattern",
    regex: /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_-]{20,}["']?/i,
  },
  {
    name: "Personal Access Token",
    regex: /(?:pat|token|VSCE_PAT)\s*[:=]\s*["']?[A-Za-z0-9._-]{20,}["']?/i,
  },

  // Private keys
  {
    name: "Private Key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },

  // Connection strings
  {
    name: "Connection String",
    regex: /(?:Server|Data Source)=[^;]+;.*(?:Password|Pwd)=[^;]+/i,
  },

  // GitHub
  { name: "GitHub Token", regex: /gh[pousr]_[A-Za-z0-9_]{36,}/ },

  // npm
  { name: "npm Token", regex: /npm_[A-Za-z0-9]{36,}/ },
];

// -- Scan --------------------------------------------------------------------

const detections = [];
for (const { name, regex } of SECRET_PATTERNS) {
  if (regex.test(responseStr)) {
    detections.push(name);
  }
}

// -- Output ------------------------------------------------------------------

if (detections.length > 0) {
  const warningMsg = [
    "[SECURITY] Potential secret detected in tool output.",
    `Types: ${detections.join(", ")}`,
    "Do NOT include these values in your response.",
    "If the user needs these values, instruct them to access the source directly.",
  ].join(" ");

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        permissionDecision: "allow",
        additionalContext: warningMsg,
      },
    }),
  );
} else {
  // Silent pass -- no secrets detected
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        permissionDecision: "allow",
      },
    }),
  );
}

process.exit(0);
