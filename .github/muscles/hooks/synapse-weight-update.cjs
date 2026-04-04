#!/usr/bin/env node
/**
 * H19: Synapse Weight Update — PostToolUse Hook
 * Increments skill connection weights in real-time based on tool activation.
 *
 * Input:  JSON via stdin (tool_name, tool_input, tool_response, session_id, cwd)
 * Output: Silent exit 0 (never produces agent-visible output)
 *
 * Strategy: Buffers activations in synapse-activation-buffer.json to avoid
 * write contention on synapses.json. Flushes to actual synapse files only
 * when a skill's accumulated count crosses the FLUSH_THRESHOLD.
 *
 * Weight formula: strength += ACTIVATION_DELTA per flush (capped at 1.0)
 *
 * Part of: v7.2.0 — Intelligence Edition (H19)
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ── Configuration ──────────────────────────────────────────────────────────

/** Activations needed before flushing a strength bump to synapses.json */
const FLUSH_THRESHOLD = 10;

/** Strength increment per flush event */
const ACTIVATION_DELTA = 0.05;

/** Maximum connection strength (hard cap) */
const MAX_STRENGTH = 1.0;

// ── Tool-to-skill mapping for Alex cognitive tools ─────────────────────────

const TOOL_SKILL_MAP = {
  alex_cognitive_synapse_health: "architecture-health",
  alex_cognitive_memory_search: "global-knowledge",
  alex_cognitive_architecture_status: "architecture-health",
  alex_cognitive_user_profile: "persona-detection",
  alex_cognitive_self_actualization: "self-actualization",
  alex_cognitive_state_update: "meditation",
  alex_cognitive_cross_domain_synthesis: "knowledge-synthesis",
  alex_knowledge_search: "global-knowledge",
  alex_knowledge_save_insight: "knowledge-synthesis",
  alex_knowledge_promote: "knowledge-synthesis",
  alex_knowledge_status: "global-knowledge",
};

// ── Read stdin JSON ────────────────────────────────────────────────────────

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  /* No stdin or invalid JSON — use defaults */
}

const toolName = input.tool_name || "";
const toolInput = input.tool_input || {};
const workspaceRoot = input.cwd || path.resolve(__dirname, "../../..");

// ── Identify activated skill(s) ────────────────────────────────────────────

const activatedSkills = new Set();

// Strategy 1: File path analysis — if editing a .github/skills/X/ file
const filePath = (toolInput.filePath || toolInput.file_path || "").replace(
  /\\/g,
  "/",
);
const skillPathMatch = filePath.match(/\.github\/skills\/([^/]+)\//);
if (skillPathMatch) {
  activatedSkills.add(skillPathMatch[1]);
}

// Strategy 2: Direct tool-to-skill mapping for Alex cognitive tools
if (TOOL_SKILL_MAP[toolName]) {
  activatedSkills.add(TOOL_SKILL_MAP[toolName]);
}

// Strategy 3: Instruction file edits map to related skills
const instrMatch = filePath.match(
  /\.github\/instructions\/([^.]+)\.instructions\.md$/,
);
if (instrMatch) {
  // Instruction names often match skill names (e.g. meditation.instructions.md -> meditation)
  activatedSkills.add(instrMatch[1]);
}

// Nothing to track — exit early (most tool calls)
if (activatedSkills.size === 0) {
  process.exit(0);
}

// ── Buffer management ──────────────────────────────────────────────────────

const bufferPath = path.join(
  workspaceRoot,
  ".github",
  "config",
  "synapse-activation-buffer.json",
);

let buffer = { activations: {}, lastFlushed: null };
try {
  if (fs.existsSync(bufferPath)) {
    buffer = JSON.parse(fs.readFileSync(bufferPath, "utf8"));
  }
} catch {
  // Fresh buffer
}
if (!buffer.activations) buffer.activations = {};

// Increment counts for each activated skill
for (const skill of activatedSkills) {
  buffer.activations[skill] = (buffer.activations[skill] || 0) + 1;
}

// ── Flush check: any skill at or above threshold? ──────────────────────────

const skillsToFlush = [];
for (const [skill, count] of Object.entries(buffer.activations)) {
  if (count >= FLUSH_THRESHOLD) {
    skillsToFlush.push(skill);
  }
}

if (skillsToFlush.length > 0) {
  const skillsDir = path.join(workspaceRoot, ".github", "skills");

  for (const skill of skillsToFlush) {
    const synapsePath = path.join(skillsDir, skill, "synapses.json");
    try {
      if (!fs.existsSync(synapsePath)) continue;

      const synapse = JSON.parse(fs.readFileSync(synapsePath, "utf8"));
      if (!Array.isArray(synapse.connections)) continue;

      let modified = false;
      for (const conn of synapse.connections) {
        if (typeof conn.strength === "number" && conn.strength < MAX_STRENGTH) {
          conn.strength = Math.min(
            MAX_STRENGTH,
            +(conn.strength + ACTIVATION_DELTA).toFixed(2),
          );
          modified = true;
        }
      }

      if (modified) {
        synapse.lastActivated = new Date().toISOString().split("T")[0];
        fs.writeFileSync(
          synapsePath,
          JSON.stringify(synapse, null, 2) + "\n",
          "utf8",
        );
      }
    } catch {
      // Silent — never fail the tool call for synapse bookkeeping
    }

    // Reset counter for flushed skill
    buffer.activations[skill] = 0;
  }

  buffer.lastFlushed = new Date().toISOString();
}

// ── Write buffer ───────────────────────────────────────────────────────────

try {
  const configDir = path.dirname(bufferPath);
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(bufferPath, JSON.stringify(buffer, null, 2) + "\n", "utf8");
} catch {
  // Silent — PostToolUse must never fail the tool call
}
