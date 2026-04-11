#!/usr/bin/env node
// H16: SubagentStart context injection + correlation vector
// Global SubagentStart hook -- injects parent session context so subagents
// don't start cold. Reads Active Context from copilot-instructions.md.
// Also generates/propagates correlation vectors for cross-agent tracing.
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function extractActiveContext() {
  const ciPath = path.resolve(__dirname, "..", "..", "copilot-instructions.md");
  try {
    const content = fs.readFileSync(ciPath, "utf-8");
    // Extract Active Context section
    const match = content.match(
      /## Active Context\s*\n<!-- [^>]* -->\s*\n([\s\S]*?)(?=\n## )/,
    );
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch {
    // File not found or unreadable -- degrade gracefully
  }
  return null;
}

function getOrCreateCorrelationId(workspaceRoot) {
  const cvPath = path.join(
    workspaceRoot,
    ".github",
    "config",
    "correlation-vector.json",
  );
  try {
    let cv = { activeId: null, chain: [] };
    if (fs.existsSync(cvPath)) {
      cv = JSON.parse(fs.readFileSync(cvPath, "utf8"));
    }
    // Generate a new ID if none exists for this request
    if (!cv.activeId) {
      cv.activeId = "req-" + crypto.randomBytes(4).toString("hex");
      cv.chain = [];
    }
    return cv.activeId;
  } catch {
    return "req-" + crypto.randomBytes(4).toString("hex");
  }
}

function appendToChain(workspaceRoot, correlationId, agentType) {
  const cvPath = path.join(
    workspaceRoot,
    ".github",
    "config",
    "correlation-vector.json",
  );
  try {
    let cv = { activeId: correlationId, chain: [] };
    if (fs.existsSync(cvPath)) {
      cv = JSON.parse(fs.readFileSync(cvPath, "utf8"));
    }
    cv.activeId = correlationId;
    const entry = `${correlationId}.${agentType || "unknown"}.start`;
    cv.chain.push(entry);
    // Keep last 50 chain entries
    if (cv.chain.length > 50) {
      cv.chain = cv.chain.slice(-50);
    }
    const configDir = path.dirname(cvPath);
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(cvPath, JSON.stringify(cv, null, 2) + "\n", "utf8");
  } catch {
    /* degrade gracefully */
  }
}

let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const event = JSON.parse(input);
    const workspaceRoot = event.cwd || path.resolve(__dirname, "../../..");
    const agentType = (
      event.agent_type ||
      event.agent_id ||
      "unknown"
    ).toLowerCase();

    // Generate or propagate correlation vector
    const correlationId = getOrCreateCorrelationId(workspaceRoot);
    appendToChain(workspaceRoot, correlationId, agentType);

    const contextParts = [];

    // Inject Active Context
    const context = extractActiveContext();
    if (context) {
      contextParts.push(
        "Parent session context (from Active Context):\n" + context,
      );
    }

    // Inject correlation vector
    contextParts.push("Correlation Vector: " + correlationId);

    if (contextParts.length > 0) {
      const response = {
        hookSpecificOutput: {
          hookEventName: "SubagentStart",
          additionalContext: contextParts.join("\n\n"),
        },
      };
      process.stdout.write(JSON.stringify(response));
    }
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
