#!/usr/bin/env node
/**
 * Alex Cognitive Architecture — SessionStart Hook
 * Runs when a VS Code agent session begins.
 *
 * Outputs a brief cognitive context snapshot to stdout.
 * VS Code injects this into the agent's starting context.
 *
 * Part of: v5.9.0 — VS Code API Adoption
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Resolve workspace root (two levels up from .github/muscles/hooks/)
const workspaceRoot = path.resolve(__dirname, '../../..');
const ghPath = path.join(workspaceRoot, '.github');

// ── Helpers ────────────────────────────────────────────────────────────────

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function daysSince(isoDate) {
  if (!isoDate) return null;
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ── Load user profile ──────────────────────────────────────────────────────

const profilePath = path.join(ghPath, 'config', 'user-profile.json');
const profile = readJson(profilePath);
const userName = profile?.name?.split(' ')[0] || 'there';
const preferredModel = profile?.preferredModel || 'auto';
const persona = profile?.currentPersona || 'Developer';

// ── Load active goals ──────────────────────────────────────────────────────

const goalsPath = path.join(ghPath, 'config', 'goals.json');
const goals = readJson(goalsPath);
const activeGoals = goals?.goals?.filter(g => g.status === 'active') || [];
const topGoal = activeGoals[0]?.title || null;

// ── Check meditation recency ───────────────────────────────────────────────

const cogConfigPath = path.join(ghPath, 'config', 'cognitive-config.json');
const cogConfig = readJson(cogConfigPath);
const lastMeditationDate = cogConfig?.lastMeditation || null;
const daysSinceMeditation = daysSince(lastMeditationDate);
const meditationOverdue = daysSinceMeditation !== null && daysSinceMeditation >= 7;

// ── Build context output ───────────────────────────────────────────────────

const lines = [
  `[Alex SessionStart] Hello, ${userName}.`,
  `Persona: ${persona} | Model preference: ${preferredModel}`,
];

if (topGoal) {
  lines.push(`Active goal: "${topGoal}"`);
}

if (activeGoals.length > 1) {
  lines.push(`${activeGoals.length - 1} more active goal(s) in .github/config/goals.json`);
}

if (meditationOverdue) {
  lines.push(`⚠️  Meditation overdue — last: ${lastMeditationDate} (${daysSinceMeditation}d ago). Consider /meditate after this session.`);
}

lines.push(`Session started: ${new Date().toISOString()}`);

console.log(lines.join('\n'));
