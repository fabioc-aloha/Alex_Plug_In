/**
 * extensionLifecycle.ts - Extension lifecycle utilities extracted from extension.ts
 *
 * Contains version upgrade detection, status bar management, periodic health checks,
 * and command context key management. Extracted for P5B file-size compliance.
 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { checkHealth, getStatusBarDisplay } from "../shared/healthCheck";
import { isWorkspaceProtected } from "../shared/utils";
import { detectGlobalKnowledgeRepo } from "../chat/globalKnowledge";

/**
 * Set VS Code context keys for when-clause filtering on slash commands.
 * These keys control visibility of commands like /sync, /m365, /forget.
 * Called at activation and after initialize/reset.
 */
export async function setCommandContextKeys(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  // alex.globalKnowledgeConfigured — true if GK repo detected
  const gkRepo = await detectGlobalKnowledgeRepo();
  await vscode.commands.executeCommand(
    "setContext",
    "alex.globalKnowledgeConfigured",
    gkRepo !== null,
  );

  // alex.hasMemoryFiles — true if .github/copilot-instructions.md exists
  let hasMemory = false;
  if (workspaceFolder) {
    const markerFile = path.join(
      workspaceFolder.uri.fsPath,
      ".github",
      "copilot-instructions.md",
    );
    hasMemory = await fs.pathExists(markerFile);
  }
  await vscode.commands.executeCommand(
    "setContext",
    "alex.hasMemoryFiles",
    hasMemory,
  );
}

/**
 * Update the status bar item based on workspace health
 */
export async function updateStatusBar(
  statusBarItem: vscode.StatusBarItem,
  forceRefresh: boolean = false,
): Promise<void> {
  try {
    // Run all async queries in parallel
    const [health, protectionResult] = await Promise.all([
      checkHealth(forceRefresh),
      (async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
          return isWorkspaceProtected(workspaceFolder.uri.fsPath).catch(() => ({
            isProtected: false,
          }));
        }
        return { isProtected: false };
      })(),
    ]);

    const display = getStatusBarDisplay(health, protectionResult.isProtected);

    statusBarItem.text = display.text;
    statusBarItem.tooltip = display.tooltip;
    statusBarItem.backgroundColor = display.backgroundColor;
    statusBarItem.show();
  } catch (err) {
    // Fallback if health check fails
    statusBarItem.text = "$(rocket) Alex";
    statusBarItem.tooltip =
      "Alex Cognitive Architecture - Click for quick actions";
    statusBarItem.backgroundColor = undefined;
    statusBarItem.show();
  }
}

/**
 * Start periodic health checks (every 5 minutes)
 */
export function startPeriodicHealthCheck(
  context: vscode.ExtensionContext,
  statusBarItem: vscode.StatusBarItem,
): void {
  const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  const intervalId = setInterval(async () => {
    await updateStatusBar(statusBarItem, true);
  }, HEALTH_CHECK_INTERVAL);

  // Clean up interval on deactivation
  context.subscriptions.push({
    dispose: () => clearInterval(intervalId),
  });
}

/**
 * Check if the extension was upgraded and notify the user.
 * On first install, proactively offers initialization.
 */
export async function checkVersionUpgrade(
  context: vscode.ExtensionContext,
): Promise<void> {
  const LAST_VERSION_KEY = "alex.lastKnownVersion";

  // Get current version from package.json
  const extension = vscode.extensions.getExtension(
    "fabioc-aloha.alex-cognitive-architecture",
  );
  if (!extension) {
    return;
  }

  const currentVersion = extension.packageJSON.version as string;
  const lastVersion = context.globalState.get<string>(LAST_VERSION_KEY);

  // Store current version for next time
  await context.globalState.update(LAST_VERSION_KEY, currentVersion);

  // Master Alex: never offer init/upgrade (source of truth, Safety Imperative I3)
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (workspaceFolder) {
    const masterProtectedPath = path.join(
      workspaceFolder.uri.fsPath,
      ".github",
      "config",
      "MASTER-ALEX-PROTECTED.json",
    );
    if (await fs.pathExists(masterProtectedPath)) {
      return;
    }
  }

  // First install: offer initialization if workspace doesn't have Alex yet
  if (!lastVersion) {
    if (workspaceFolder) {
      const markerPath = path.join(
        workspaceFolder.uri.fsPath,
        ".github",
        "copilot-instructions.md",
      );
      const hasAlex = await fs.pathExists(markerPath);
      if (!hasAlex) {
        const selection = await vscode.window.showInformationMessage(
          `Welcome to Alex v${currentVersion}! Initialize the cognitive architecture in this workspace to get started.`,
          "Initialize Now",
          "Later",
        );
        if (selection === "Initialize Now") {
          vscode.commands.executeCommand("alex.initialize");
        }
      }
    }
    return;
  }

  // Same version: no action needed
  if (lastVersion === currentVersion) {
    return;
  }

  // Version changed: classify the upgrade type
  const [lastMajor, lastMinor] = lastVersion.split(".").map(Number);
  const [currentMajor, currentMinor] = currentVersion.split(".").map(Number);

  const isMajorUpgrade = currentMajor > lastMajor;
  const isMinorUpgrade = !isMajorUpgrade && currentMinor > lastMinor;

  // Show upgrade notification
  const upgradeButton = "Run Upgrade";
  const changelogButton = "View Changelog";
  const dismissButton = "Dismiss";

  const message = isMajorUpgrade
    ? `Alex upgraded to v${currentVersion}! This is a major release with new features. Run the upgrade to update your workspace files.`
    : isMinorUpgrade
      ? `Alex updated to v${currentVersion} with new features. Run the upgrade to sync your workspace.`
      : `Alex patched to v${currentVersion}. Run the upgrade to apply latest fixes.`;

  const selection = await vscode.window.showInformationMessage(
    message,
    upgradeButton,
    changelogButton,
    dismissButton,
  );

  if (selection === upgradeButton) {
    vscode.commands.executeCommand("alex.upgrade");
  } else if (selection === changelogButton) {
    // Open changelog in browser or show in editor
    const changelogUri = vscode.Uri.joinPath(
      extension.extensionUri,
      "CHANGELOG.md",
    );
    vscode.commands.executeCommand("markdown.showPreview", changelogUri);
  }
}
