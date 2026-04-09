import * as vscode from "vscode";
import * as path from "path";
import { updateAlexInstalledStatus } from "./telemetry";
import { createSynapseRegex } from "./utils";

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
 * Build a set of known markdown file basenames for fast synapse target lookup
 */
async function buildMarkdownFileIndex(
  workspaceFolders: readonly vscode.WorkspaceFolder[],
): Promise<Set<string>> {
  const targetPatterns = [
    ".github/**/*.md",
    "alex_docs/**/*.md",
    "platforms/**/.github/**/*.md",
    "*.md",
  ];

  const allResults = await Promise.all(
    targetPatterns.map((targetPattern) =>
      vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolders[0], targetPattern),
        "**/node_modules/**",
        1000,
      ),
    ),
  );
  const allMdFiles = allResults.flat();
  return new Set(allMdFiles.map((f) => path.basename(f.fsPath).toLowerCase()));
}

/**
 * Scan architecture files for synapse references and check for broken links
 */
async function scanFilesAndSynapses(
  workspaceFolders: readonly vscode.WorkspaceFolder[],
  patterns: string[],
  knownFileBasenames: Set<string>,
): Promise<{
  totalFiles: number;
  totalSynapses: number;
  brokenSynapses: number;
  issues: string[];
}> {
  let totalFiles = 0;
  let totalSynapses = 0;
  let brokenSynapses = 0;
  const issues: string[] = [];
  const synapseRegex = createSynapseRegex();

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

      for (const file of files) {
        totalFiles++;
        try {
          const content = new TextDecoder().decode(
            await vscode.workspace.fs.readFile(file),
          );
          let inCodeBlock = false;
          const lines = content.replace(/\r\n/g, "\n").split("\n");

          for (const line of lines) {
            if (line.trim().startsWith("```")) {
              inCodeBlock = !inCodeBlock;
              continue;
            }
            if (inCodeBlock) {
              continue;
            }

            synapseRegex.lastIndex = 0;
            let match;
            while ((match = synapseRegex.exec(line)) !== null) {
              totalSynapses++;
              const targetName = match[1].trim();
              const targetBasename = path.basename(targetName).toLowerCase();

              if (!knownFileBasenames.has(targetBasename)) {
                brokenSynapses++;
                if (issues.length < 5) {
                  issues.push(
                    `Broken: ${targetName} (from ${path.basename(file.fsPath)})`,
                  );
                }
              }
            }
          }
        } catch (err) {
          // File read error - continue
        }
      }
    } catch (err) {
      // Pattern search error - continue
    }
  }

  return { totalFiles, totalSynapses, brokenSynapses, issues };
}

/**
 * Classify health status from scan results
 */
function classifyHealthStatus(
  totalFiles: number,
  totalSynapses: number,
  brokenSynapses: number,
): { status: HealthStatus; summary: string } {
  if (brokenSynapses === 0 && totalFiles > 0) {
    return {
      status: HealthStatus.Healthy,
      summary: `${totalFiles} files, ${totalSynapses} synapses - all healthy`,
    };
  } else if (brokenSynapses > 0 && brokenSynapses < totalSynapses * 0.1) {
    return {
      status: HealthStatus.Warning,
      summary: `${brokenSynapses} broken synapses of ${totalSynapses}`,
    };
  } else if (brokenSynapses > 0) {
    return {
      status: HealthStatus.Error,
      summary: `${brokenSynapses} broken synapses - run Dream to repair`,
    };
  }
  return { status: HealthStatus.Healthy, summary: `${totalFiles} files ready` };
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

  const knownFileBasenames = await buildMarkdownFileIndex(workspaceFolders);
  const scanResult = await scanFilesAndSynapses(
    workspaceFolders,
    patterns,
    knownFileBasenames,
  );
  const { status, summary } = classifyHealthStatus(
    scanResult.totalFiles,
    scanResult.totalSynapses,
    scanResult.brokenSynapses,
  );

  cachedResult = {
    status,
    initialized,
    totalFiles: scanResult.totalFiles,
    totalSynapses: scanResult.totalSynapses,
    brokenSynapses: scanResult.brokenSynapses,
    issues: scanResult.issues,
    lastChecked: new Date(),
    summary,
  };
  lastCheckTime = Date.now();

  updateAlexInstalledStatus(initialized);

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
