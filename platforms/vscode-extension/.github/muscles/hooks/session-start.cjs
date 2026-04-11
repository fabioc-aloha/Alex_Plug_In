#!/usr/bin/env node
/**
 * Alex Cognitive Architecture -- SessionStart Hook
 * Runs when a VS Code agent session begins.
 *
 * Input:  JSON via stdin (session_id, cwd, hook_event_name, source, model)
 * Output: JSON to stdout with hookSpecificOutput.additionalContext
 *         (injected into the agent's starting context)
 *
 * Part of: v6.5.0 -- API-Compliant Hooks (F1-F6)
 */

"use strict";

const fs = require("fs");
const path = require("path");

// -- Read stdin JSON --------------------------------------------------------

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  /* No stdin or invalid JSON -- use defaults */
}

// Use cwd from hook input when available, fall back to relative path
const workspaceRoot = input.cwd || path.resolve(__dirname, "../../..");
const ghPath = path.join(workspaceRoot, ".github");

// -- Helpers ----------------------------------------------------------------

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function daysSince(isoDate) {
  if (!isoDate) return null;
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// -- Load user profile (AI-Memory first, workspace fallback) ----------------

const os = require("os");

function resolveAIMemoryProfile() {
  // Check cloud storage roots for AI-Memory/user-profile.json
  const candidates = [];

  // OneDrive variants from env
  for (const envKey of ["OneDrive", "OneDriveConsumer", "OneDriveCommercial"]) {
    if (process.env[envKey]) candidates.push(process.env[envKey]);
  }

  // Scan home for OneDrive*, iCloud, Google Drive, Dropbox
  const homeDir = os.homedir();
  try {
    const entries = fs.readdirSync(homeDir);
    for (const entry of entries) {
      if (/^OneDrive/i.test(entry) || /iCloud/i.test(entry) || /Google Drive/i.test(entry) || /Dropbox/i.test(entry)) {
        const full = path.join(homeDir, entry);
        if (fs.statSync(full).isDirectory() && !candidates.includes(full)) {
          candidates.push(full);
        }
      }
    }
  } catch { /* ignore */ }

  // Check each candidate for AI-Memory/user-profile.json
  for (const root of candidates) {
    const profileFile = path.join(root, "AI-Memory", "user-profile.json");
    if (fs.existsSync(profileFile)) {
      return readJson(profileFile);
    }
  }

  // Local fallback
  const localProfile = path.join(homeDir, ".alex", "AI-Memory", "user-profile.json");
  if (fs.existsSync(localProfile)) {
    return readJson(localProfile);
  }

  return null;
}

const profile = resolveAIMemoryProfile()
  || readJson(path.join(ghPath, "config", "user-profile.json"));
const userName = profile?.name?.split(" ")[0] || "there";
const preferredModel = profile?.preferredModel || "auto";
const persona = profile?.currentPersona || "Developer";

// -- Load active goals ------------------------------------------------------

const goalsPath = path.join(ghPath, "config", "goals.json");
const goals = readJson(goalsPath);
const activeGoals = goals?.goals?.filter((g) => g.status === "active") || [];
const topGoal = activeGoals[0]?.title || null;

// -- Check meditation recency -----------------------------------------------

const cogConfigPath = path.join(ghPath, "config", "cognitive-config.json");
const cogConfig = readJson(cogConfigPath);
const lastMeditationDate = cogConfig?.lastMeditation || null;
const daysSinceMeditation = daysSince(lastMeditationDate);
const meditationOverdue =
  daysSinceMeditation !== null && daysSinceMeditation >= 7;

// -- Build context output ---------------------------------------------------

const lines = [
  `[Alex SessionStart] Hello, ${userName}.`,
  `Persona: ${persona} | Model preference: ${preferredModel}`,
];

if (topGoal) {
  lines.push(`Active goal: "${topGoal}"`);
}

if (activeGoals.length > 1) {
  lines.push(
    `${activeGoals.length - 1} more active goal(s) in .github/config/goals.json`,
  );
}

if (meditationOverdue) {
  lines.push(
    `[!]  Meditation overdue -- last: ${lastMeditationDate} (${daysSinceMeditation}d ago). Consider /meditate after this session.`,
  );
}

lines.push(`Session started: ${new Date().toISOString()}`);

// -- Reset correlation vector for new session -------------------------------

const cvPath = path.join(ghPath, "config", "correlation-vector.json");
try {
  // Preserve metadata keys (_notes) while resetting active state
  let cv = { activeId: null, chain: [] };
  if (fs.existsSync(cvPath)) {
    const existing = JSON.parse(fs.readFileSync(cvPath, "utf8"));
    cv = { ...existing, activeId: null, chain: [] };
  }
  fs.writeFileSync(cvPath, JSON.stringify(cv, null, 2) + "\n", "utf8");
} catch {
  /* degrade gracefully */
}

// -- Output structured JSON -------------------------------------------------

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: lines.join("\n"),
    },
  }),
);
