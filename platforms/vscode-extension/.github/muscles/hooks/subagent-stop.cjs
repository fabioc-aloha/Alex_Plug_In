#!/usr/bin/env node
/**
 * H17: SubagentStop -- Assignment Lifecycle Tracking
 * Records subagent invocation outcome for delegation pattern analysis.
 *
 * Input:  JSON via stdin (agent_id, agent_type, session_id, cwd, stop_hook_active)
 * Output: Silent exit 0 (telemetry only)
 *
 * Appends an assignment record to .github/config/assignment-log.json.
 * Data feeds skill-based routing and meditation delegation analysis.
 */

"use strict";

const fs = require("fs");
const path = require("path");

// -- Read stdin JSON --------------------------------------------------------

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  /* defaults */
}

const workspaceRoot = input.cwd || path.resolve(__dirname, "../../..");
const logPath = path.join(
  workspaceRoot,
  ".github",
  "config",
  "assignment-log.json",
);
const cvPath = path.join(
  workspaceRoot,
  ".github",
  "config",
  "correlation-vector.json",
);

// -- Determine agent name ---------------------------------------------------

const agentType = (
  input.agent_type ||
  input.agent_id ||
  "unknown"
).toLowerCase();

// Map agent_type values to canonical names
const AGENT_MAP = {
  builder: "builder",
  validator: "validator",
  researcher: "researcher",
  documentarian: "documentarian",
  azure: "azure",
  m365: "m365",
  alex: "alex",
};

const agent = AGENT_MAP[agentType] || agentType;

// -- Read active correlation vector -----------------------------------------

let correlationId = null;
try {
  if (fs.existsSync(cvPath)) {
    const cv = JSON.parse(fs.readFileSync(cvPath, "utf8"));
    correlationId = cv.activeId || null;
  }
} catch {
  /* no CV */
}

// -- Load or initialise assignment log --------------------------------------

let log = { assignments: [] };
try {
  if (fs.existsSync(logPath)) {
    const raw = fs.readFileSync(logPath, "utf8");
    const parsed = JSON.parse(raw);
    // Preserve full file structure (metadata keys like _schema, _notes)
    if (parsed && typeof parsed === "object") {
      log = parsed;
      if (!Array.isArray(log.assignments)) log.assignments = [];
    }
  }
} catch {
  /* fresh log */
}

// -- Create assignment record -----------------------------------------------

const now = new Date().toISOString();
const nextId = log.assignments.length + 1;

const record = {
  id: `asgn-${String(nextId).padStart(3, "0")}`,
  agent,
  outcome: "success", // Default; SubagentStop fires on normal completion
  completedAt: now,
  correlationId,
};

log.assignments.push(record);

// Prune to last 200 entries
if (log.assignments.length > 200) {
  log.assignments = log.assignments.slice(-200);
}

// -- Write ------------------------------------------------------------------

try {
  const configDir = path.dirname(logPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n", "utf8");
} catch (err) {
  process.stderr.write(
    `[H17] Warning: could not write assignment log -- ${err.message}\n`,
  );
}

process.exit(0);
