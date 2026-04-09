/**
 * Stream Enrichment Utilities - v7.1.0
 *
 * Rich response stream helpers for Alex's chat participant.
 * Uses stable VS Code APIs where available (filetree, progress, button)
 * and provides graceful fallbacks for proposed APIs (warning, confirmation,
 * thinkingProgress) that render as formatted markdown until promoted to stable.
 *
 * Inspired by Copilot Chat's stream enrichment: warning(), confirmation(),
 * thinkingProgress(), filetree(), hookProgress().
 */

import * as vscode from "vscode";

// ============================================================================
// Warning
// ============================================================================

/**
 * Push a warning to the stream.
 * Uses proposed ChatResponseWarningPart if available, falls back to markdown.
 */
export function streamWarning(
  stream: vscode.ChatResponseStream,
  message: string,
): void {
  // Proposed API check: stream.warning exists at runtime in VS Code 1.113+
  const s = stream as any;
  if (typeof s.warning === "function") {
    s.warning(message);
  } else {
    stream.markdown(`\n\n> **⚠️ Warning**: ${message}\n\n`);
  }
}

// ============================================================================
// Filetree (Stable API)
// ============================================================================

/**
 * Build a ChatResponseFileTree from the cognitive architecture structure.
 * Useful for /status and architecture health reports.
 */
export function buildCognitiveFileTree(
  workspaceRoot: string,
): vscode.ChatResponseFileTree[] {
  return [
    {
      name: ".github",
      children: [
        {
          name: "instructions",
          children: [{ name: "*.instructions.md" }],
        },
        {
          name: "skills",
          children: [{ name: "*/SKILL.md" }],
        },
        {
          name: "prompts",
          children: [{ name: "*.prompt.md" }],
        },
        {
          name: "agents",
          children: [{ name: "*.agent.md" }],
        },
        {
          name: "episodic",
          children: [{ name: "*.md" }],
        },
        {
          name: "config",
          children: [{ name: "synapses.json" }, { name: "user-profile.json" }],
        },
      ],
    },
  ];
}

/**
 * Push a cognitive architecture filetree to the stream.
 */
export function streamCognitiveTree(
  stream: vscode.ChatResponseStream,
  workspaceRoot: string,
): void {
  const tree = buildCognitiveFileTree(workspaceRoot);
  const baseUri = vscode.Uri.file(workspaceRoot);
  stream.filetree(tree, baseUri);
}
