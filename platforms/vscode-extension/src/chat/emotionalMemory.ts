/**
 * Alex Emotional Memory — Historical Reader
 *
 * Reads historical emotional session logs from .github/episodic/emotional/.
 * Used by self-actualization meditation to review past session patterns.
 *
 * NOTE: Active signal recording was removed in v7.6.0 when participant mode
 * was replaced by agent mode. Emotional intelligence is now handled by the
 * brain instruction (emotional-intelligence.instructions.md) rather than code.
 * This module retains only the disk-reading function for historical data.
 *
 * Privacy: All data stays in .github/episodic/emotional/. No telemetry.
 */

import * as workspaceFs from "../shared/workspaceFs";
import * as path from "path";

// ============================================================================
// Types (needed for reading historical log files)
// ============================================================================

interface SessionEmotionalArc {
  sessionId: string;
  startTime: string;
  endTime: string;
  exchangeCount: number;
  dominantMood:
    | "frustrated"
    | "productive"
    | "creative-flow"
    | "struggling"
    | "celebratory"
    | "neutral";
  trajectory: "improving" | "declining" | "stable" | "volatile";
  peaks: {
    highPoint?: string;
    lowPoint?: string;
  };
  scores: {
    frustration: number;
    success: number;
    flow: number;
    confusion: number;
    excitement: number;
  };
  summary: string;
}

// ============================================================================
// Constants
// ============================================================================

const EMOTIONAL_DIR = "emotional";
const SESSION_LOG_FILE = "session-emotional-log.json";
const MAX_RECENT_SESSIONS = 10;

/**
 * Get a meditation-focused emotional review.
 * Surfaces patterns for self-improvement during meditation phases.
 */
export async function getMeditationEmotionalReview(
  workspaceRoot: string,
): Promise<string | null> {
  const logPath = path.join(
    workspaceRoot,
    ".github",
    "episodic",
    EMOTIONAL_DIR,
    SESSION_LOG_FILE,
  );

  if (!(await workspaceFs.pathExists(logPath))) {
    return null;
  }

  try {
    const sessions: SessionEmotionalArc[] =
      (await workspaceFs.readJson<SessionEmotionalArc[]>(logPath)) ?? [];
    if (sessions.length < 3) {
      return null; // Need at least 3 sessions for meaningful patterns
    }

    const recent = sessions.slice(-MAX_RECENT_SESSIONS);
    const lines: string[] = ["## Emotional Pattern Review"];

    // Overall trajectory
    const avgFrustration =
      recent.reduce((s, r) => s + r.scores.frustration, 0) / recent.length;
    const avgFlow =
      recent.reduce((s, r) => s + r.scores.flow, 0) / recent.length;
    const avgSuccess =
      recent.reduce((s, r) => s + r.scores.success, 0) / recent.length;

    lines.push("");
    lines.push(`**Across ${recent.length} recent sessions**:`);
    lines.push(`- Average frustration: ${(avgFrustration * 100).toFixed(0)}%`);
    lines.push(`- Flow state frequency: ${(avgFlow * 100).toFixed(0)}%`);
    lines.push(`- Success rate: ${(avgSuccess * 100).toFixed(0)}%`);

    // Frustration trend
    if (avgFrustration > 0.4) {
      lines.push("");
      lines.push(
        `⚠️ **High frustration detected** — Last ${recent.length} sessions averaged ${(avgFrustration * 100).toFixed(0)}% frustration. Consider:`,
      );
      lines.push("  - Simplifying the current debugging workflow");
      lines.push("  - Breaking large tasks into smaller wins");
      lines.push("  - Taking more frequent breaks");
    }

    // Flow trend
    if (avgFlow > 0.3) {
      lines.push("");
      lines.push(
        `🌊 **Good flow state engagement** — ${(avgFlow * 100).toFixed(0)}% of exchanges showed flow indicators. Keep doing what works.`,
      );
    }

    // Session-by-session micro-review
    lines.push("");
    lines.push("**Session Timeline**:");
    for (const s of recent.slice(-5)) {
      const date = s.startTime.split("T")[0];
      const moodEmoji = getMoodEmoji(s.dominantMood);
      lines.push(
        `- ${date}: ${moodEmoji} ${s.dominantMood} (${s.exchangeCount} exchanges) — ${s.summary}`,
      );
    }

    return lines.join("\n");
  } catch (err) {
    console.warn(
      "[EmotionalMemory] Failed to generate meditation review:",
      err,
    );
    return null;
  }
}

// ============================================================================
// Internal Helpers
// ============================================================================

function getMoodEmoji(mood: SessionEmotionalArc["dominantMood"]): string {
  switch (mood) {
    case "creative-flow":
      return "🌊";
    case "celebratory":
      return "🎉";
    case "productive":
      return "✅";
    case "struggling":
      return "💪";
    case "frustrated":
      return "😤";
    case "neutral":
      return "😐";
    default:
      return "📝";
  }
}
