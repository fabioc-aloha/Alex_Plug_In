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
// Confirmation
// ============================================================================

/**
 * Push a confirmation dialog to the stream.
 * Uses proposed ChatResponseConfirmationPart if available, falls back to markdown + button.
 */
export function streamConfirmation(
  stream: vscode.ChatResponseStream,
  title: string,
  message: string,
  data: unknown,
  buttons?: string[],
): void {
  const s = stream as any;
  if (typeof s.confirmation === "function") {
    s.confirmation(title, message, data, buttons);
  } else {
    stream.markdown(`\n\n> **${title}**\n> ${message}\n\n`);
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

// ============================================================================
// Progress (Stable API)
// ============================================================================

/**
 * Push a progress message for long operations.
 */
export function streamProgress(
  stream: vscode.ChatResponseStream,
  message: string,
): void {
  stream.progress(message);
}

// ============================================================================
// Safety Alert
// ============================================================================

/**
 * Push a safety imperative violation alert.
 * Uses warning() for visibility, with imperative code and description.
 */
export function streamSafetyAlert(
  stream: vscode.ChatResponseStream,
  imperative: string,
  description: string,
): void {
  streamWarning(
    stream,
    `**Safety Imperative Violation (${imperative})**: ${description}`,
  );
}
