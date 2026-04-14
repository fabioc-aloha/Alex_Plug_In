import * as vscode from "vscode";
import * as path from "path";

/**
 * Health status levels
 */
export enum HealthStatus {
  Healthy = "healthy",
  Warning = "warning",
  Error = "error",
  NotInitialized = "not-initialized",
}

/**
 * Health check result
 * Note: totalSynapses and brokenSynapses kept for API compatibility but always 0
 * Embedded synapse sections were deprecated in v7.8
 */
export interface HealthCheckResult {
  status: HealthStatus;
  initialized: boolean;
  totalFiles: number;
  totalSynapses: number;
  brokenSynapses: number;
  issues: string[];
  lastChecked: Date;
  summary: string;
}

// Cache the last health check result
let cachedResult: HealthCheckResult | null = null;
let lastCheckTime: number = 0;
const CACHE_DURATION_MS = 60000; // 1 minute cache

/**
 * Count architecture files (simplified from synapse scanning)
 * Note: Synapse scanning removed in v7.8 - embedded synapse sections deprecated
 */
async function countArchitectureFiles(
  workspaceFolders: readonly vscode.WorkspaceFolder[],
  patterns: string[],
): Promise<number> {
  let totalFiles = 0;

  for (const pattern of patterns) {
    try {
      const relativePattern = new vscode.RelativePattern(
        workspaceFolders[0],
        pattern,
      );
      const files = await vscode.workspace.findFiles(
        relativePattern,
        null,
        100,
      );
      totalFiles += files.length;
    } catch {
      // Pattern search error - continue
    }
  }

  return totalFiles;
}

/**
 * Classify health status from file count
 */
function classifyHealthStatus(totalFiles: number): {
  status: HealthStatus;
  summary: string;
} {
  if (totalFiles > 0) {
    return {
      status: HealthStatus.Healthy,
      summary: `${totalFiles} memory files ready`,
    };
  }
  return {
    status: HealthStatus.Warning,
    summary: "No memory files found",
  };
}

/**
 * Run a quick health check on Alex architecture
 */
export async function checkHealth(
  forceRefresh: boolean = false,
): Promise<HealthCheckResult> {
  if (
    !forceRefresh &&
    cachedResult &&
    Date.now() - lastCheckTime < CACHE_DURATION_MS
  ) {
    return cachedResult;
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    return {
      status: HealthStatus.NotInitialized,
      initialized: false,
      totalFiles: 0,
      totalSynapses: 0,
      brokenSynapses: 0,
      issues: ["No workspace folder open"],
      lastChecked: new Date(),
      summary: "No workspace open",
    };
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const alexPath = path.join(rootPath, ".github", "copilot-instructions.md");

  let initialized = false;
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(alexPath));
    initialized = true;
  } catch {
    initialized = false;
  }

  if (!initialized) {
    cachedResult = {
      status: HealthStatus.NotInitialized,
      initialized: false,
      totalFiles: 0,
      totalSynapses: 0,
      brokenSynapses: 0,
      issues: ["Alex architecture not initialized"],
      lastChecked: new Date(),
      summary: "Not initialized - run Alex: Initialize",
    };
    lastCheckTime = Date.now();
    return cachedResult;
  }

  const patterns = [
    ".github/copilot-instructions.md",
    ".github/instructions/*.md",
    ".github/prompts/*.md",
    ".github/skills/*/SKILL.md",
    ".github/domain-knowledge/*.md",
  ];

  const totalFiles = await countArchitectureFiles(workspaceFolders, patterns);
  const { status, summary } = classifyHealthStatus(totalFiles);

  cachedResult = {
    status,
    initialized,
    totalFiles,
    totalSynapses: 0, // Deprecated - always 0
    brokenSynapses: 0, // Deprecated - always 0
    issues: [],
    lastChecked: new Date(),
    summary,
  };
  lastCheckTime = Date.now();

  return cachedResult;
}

/**
 * Get status bar text and icon based on health
 */
export function getStatusBarDisplay(
  health: HealthCheckResult,
  isProtected?: boolean,
): { text: string; tooltip: string; backgroundColor?: vscode.ThemeColor } {
  // Special case: Not initialized - show enticing preview
  if (health.status === HealthStatus.NotInitialized) {
    return {
      text: "$(rocket) Alex ⚫ | 💡 Knowledge",
      tooltip:
        `🚀 Initialize Alex to unlock:\n\n` +
        `💡 Knowledge Base - Save insights across projects\n` +
        `🧠 Dream Protocol - Cognitive maintenance\n` +
        `✨ Self-Actualization - Deep reflection\n\n` +
        `Click to initialize and start your journey!`,
      backgroundColor: undefined,
    };
  }

  // Build status parts - use emoji for status, no background color
  // (yellow/red backgrounds look jarring in VS Code status bar)
  let statusEmoji = "🟢";
  const bgColor: vscode.ThemeColor | undefined = undefined;

  switch (health.status) {
    case HealthStatus.Warning:
      statusEmoji = "🟡";
      break;
    case HealthStatus.Error:
      statusEmoji = "🔴";
      break;
  }

  // Build text parts
  const parts: string[] = [`$(rocket) Alex ${statusEmoji}`];

  // Add protection indicator
  if (isProtected) {
    parts.push("🔒");
  }

  const text = parts.join(" | ");

  // Build tooltip
  let tooltip = "";
  switch (health.status) {
    case HealthStatus.Healthy:
      tooltip = `✅ Alex Healthy\n${health.summary}`;
      break;
    case HealthStatus.Warning:
      tooltip = `⚠️ Alex Warning\n${health.summary}\n${health.issues.join("\n")}`;
      break;
    case HealthStatus.Error:
      tooltip = `❌ Alex Error\n${health.summary}\n${health.issues.join("\n")}`;
      break;
  }

  if (isProtected) {
    tooltip += "\n\n🔒 PROTECTED: Master Alex workspace - commands blocked";
  }

  tooltip += "\n\nClick for quick actions";

  return { text, tooltip, backgroundColor: bgColor };
}

/**
 * Clear the health cache
 */
export function clearHealthCache(): void {
  cachedResult = null;
  lastCheckTime = 0;
}
