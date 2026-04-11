#!/usr/bin/env node
/**
 * Analyze assignment-log.json for delegation patterns.
 * Run during meditation or on-demand to surface routing intelligence.
 *
 * Output: JSON summary of agent success rates, task frequency, and recommendations.
 * Usage: node .github/muscles/analyze-assignments.cjs
 */

"use strict";

const fs = require("fs");
const path = require("path");

const workspaceRoot = process.argv[2] || path.resolve(__dirname, "../..");
const logPath = path.join(
  workspaceRoot,
  ".github",
  "config",
  "assignment-log.json",
);

// -- Load assignment log ----------------------------------------------------

let log = { assignments: [] };
try {
  if (fs.existsSync(logPath)) {
    log = JSON.parse(fs.readFileSync(logPath, "utf8"));
  }
} catch {
  console.log(
    JSON.stringify({ error: "Cannot read assignment log", path: logPath }),
  );
  process.exit(0);
}

const assignments = log.assignments || [];

if (assignments.length === 0) {
  console.log(
    JSON.stringify({
      message: "No assignments recorded yet. Use agents to accumulate data.",
    }),
  );
  process.exit(0);
}

// -- Compute per-agent stats ------------------------------------------------

const agentStats = {};
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const now = Date.now();

for (const a of assignments) {
  const name = a.agent || "unknown";
  if (!agentStats[name]) {
    agentStats[name] = {
      total: 0,
      success: 0,
      failed: 0,
      recent: 0,
      recentSuccess: 0,
    };
  }
  const stats = agentStats[name];
  stats.total++;
  if (a.outcome === "success") stats.success++;
  else stats.failed++;

  // Recency weighting
  if (a.completedAt) {
    const age = now - new Date(a.completedAt).getTime();
    if (age < THIRTY_DAYS_MS) {
      stats.recent++;
      if (a.outcome === "success") stats.recentSuccess++;
    }
  }
}

// -- Build summary ----------------------------------------------------------

const summary = {
  totalAssignments: assignments.length,
  agents: {},
  recommendations: [],
};

for (const [name, stats] of Object.entries(agentStats)) {
  const successRate =
    stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
  const recentRate =
    stats.recent > 0
      ? Math.round((stats.recentSuccess / stats.recent) * 100)
      : null;

  summary.agents[name] = {
    total: stats.total,
    successRate: `${successRate}%`,
    recentSuccessRate: recentRate !== null ? `${recentRate}%` : "n/a",
    failed: stats.failed,
  };

  // Flag agents with declining recent performance
  if (
    recentRate !== null &&
    stats.recent >= 5 &&
    recentRate < successRate - 10
  ) {
    summary.recommendations.push(
      `${name}: recent success rate (${recentRate}%) is declining vs overall (${successRate}%). Investigate recent failures.`,
    );
  }

  // Flag agents with insufficient data for Tier 2 routing
  if (stats.total < 5) {
    summary.recommendations.push(
      `${name}: only ${stats.total} assignments. Need 5+ for Tier 2 routing to activate.`,
    );
  }
}

// -- Correlation vector analysis --------------------------------------------

const cvPath = path.join(
  workspaceRoot,
  ".github",
  "config",
  "correlation-vector.json",
);
try {
  if (fs.existsSync(cvPath)) {
    const cv = JSON.parse(fs.readFileSync(cvPath, "utf8"));
    summary.correlationChainLength = (cv.chain || []).length;
  }
} catch {
  /* skip */
}

console.log(JSON.stringify(summary, null, 2));
