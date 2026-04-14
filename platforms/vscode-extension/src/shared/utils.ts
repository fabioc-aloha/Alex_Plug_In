/**
 * Alex Cognitive Architecture - Shared Utilities
 *
 * Common utility functions used across the extension for:
 * - Version reading
 * - File scanning
 * - Workspace validation
 */

import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import {
  VERSION_EXTRACT_REGEX,
  VERSION_NUMBER_REGEX,
} from "./constants";
import * as workspaceFs from "./workspaceFs";

/**
 * Singleton output channel for kill switch logging
 * Prevents creating a new channel on every protection check (every 5 min + file changes)
 */
let killSwitchOutputChannel: vscode.LogOutputChannel | null = null;

function getKillSwitchOutputChannel(): vscode.LogOutputChannel {
  if (!killSwitchOutputChannel) {
    killSwitchOutputChannel = vscode.window.createOutputChannel(
      "Alex Kill Switch",
      { log: true },
    );
  }
  return killSwitchOutputChannel;
}

/**
 * Result of workspace validation
 */
export interface WorkspaceValidation {
  isValid: boolean;
  rootPath?: string;
  workspaceFolder?: vscode.WorkspaceFolder;
  error?: string;
}

/**
 * Validate workspace is open and return root path
 * @deprecated Use getAlexWorkspaceFolder() for commands that require Alex to be installed
 */
export function validateWorkspace(): WorkspaceValidation {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return {
      isValid: false,
      error:
        "No workspace folder open. Please open a project folder first (File → Open Folder).",
    };
  }

  return {
    isValid: true,
    rootPath: workspaceFolders[0].uri.fsPath,
    workspaceFolder: workspaceFolders[0],
  };
}

/**
 * Result of Alex workspace folder detection
 */
export interface AlexWorkspaceFolderResult {
  found: boolean;
  rootPath?: string;
  workspaceFolder?: vscode.WorkspaceFolder;
  error?: string;
  /** True if user cancelled folder selection in multi-folder workspace */
  cancelled?: boolean;
}

/**
 * Find the workspace folder that has Alex installed.
 *
 * In single-folder mode: returns that folder if Alex is installed
 * In multi-folder workspace mode:
 *   - If only one folder has Alex, returns it automatically
 *   - If multiple folders have Alex, prompts user to select
 *   - If no folders have Alex, returns error
 *
 * @param requireInstalled If true (default), returns error if Alex not installed.
 *                         If false, returns first folder (for initialize command).
 */
export async function getAlexWorkspaceFolder(
  requireInstalled: boolean = true,
): Promise<AlexWorkspaceFolderResult> {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    return {
      found: false,
      error:
        "No workspace folder open. Please open a project folder first (File → Open Folder).",
    };
  }

  // Single folder mode - simple case
  if (workspaceFolders.length === 1) {
    const folder = workspaceFolders[0];
    if (requireInstalled) {
      const installed = await isAlexInstalled(folder.uri.fsPath);
      if (!installed) {
        return {
          found: false,
          error:
            'Alex is not installed in this workspace. Run "Alex: Initialize Architecture" first.',
        };
      }
    }
    return {
      found: true,
      rootPath: folder.uri.fsPath,
      workspaceFolder: folder,
    };
  }

  // Multi-folder workspace mode - check which folders have Alex installed
  const foldersWithAlex: vscode.WorkspaceFolder[] = [];
  for (const folder of workspaceFolders) {
    if (await isAlexInstalled(folder.uri.fsPath)) {
      foldersWithAlex.push(folder);
    }
  }

  if (!requireInstalled) {
    // For initialize command - prompt user to select any folder
    const selected = await vscode.window.showQuickPick(
      workspaceFolders.map((f) => ({
        label: f.name,
        description: f.uri.fsPath,
        folder: f,
      })),
      {
        placeHolder: "Select a workspace folder to initialize Alex in",
        title: "Initialize Alex - Select Folder",
      },
    );

    if (!selected) {
      return { found: false, cancelled: true };
    }

    return {
      found: true,
      rootPath: selected.folder.uri.fsPath,
      workspaceFolder: selected.folder,
    };
  }

  // Commands that require Alex to be installed
  if (foldersWithAlex.length === 0) {
    return {
      found: false,
      error:
        'Alex is not installed in any workspace folder. Run "Alex: Initialize Architecture" first.',
    };
  }

  if (foldersWithAlex.length === 1) {
    // Only one folder has Alex - use it automatically
    return {
      found: true,
      rootPath: foldersWithAlex[0].uri.fsPath,
      workspaceFolder: foldersWithAlex[0],
    };
  }

  // Multiple folders have Alex - prompt user to select
  const selected = await vscode.window.showQuickPick(
    foldersWithAlex.map((f) => ({
      label: f.name,
      description: f.uri.fsPath,
      folder: f,
    })),
    {
      placeHolder: "Multiple folders have Alex installed. Select one:",
      title: "Alex - Select Workspace Folder",
    },
  );

  if (!selected) {
    return { found: false, cancelled: true };
  }

  return {
    found: true,
    rootPath: selected.folder.uri.fsPath,
    workspaceFolder: selected.folder,
  };
}

/**
 * Read Alex version from copilot-instructions.md
 * @param rootPath Workspace root path
 * @param numericOnly If true, returns only X.Y.Z; otherwise returns "X.Y.Z CODENAME"
 */
export async function getInstalledAlexVersion(
  rootPath: string,
  numericOnly: boolean = false,
): Promise<string | null> {
  const instructionsPath = path.join(
    rootPath,
    ".github",
    "copilot-instructions.md",
  );

  if (!(await workspaceFs.pathExists(instructionsPath))) {
    return null;
  }

  try {
    const content = await workspaceFs.readFile(instructionsPath);
    const regex = numericOnly ? VERSION_NUMBER_REGEX : VERSION_EXTRACT_REGEX;
    const match = content.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Check if Alex is installed in the workspace
 */
export async function isAlexInstalled(rootPath: string): Promise<boolean> {
  const markerFile = path.join(rootPath, ".github", "copilot-instructions.md");
  return workspaceFs.pathExists(markerFile);
}

/**
 * Result of workspace protection check
 */
export interface WorkspaceProtectionResult {
  isProtected: boolean;
  reason?: "setting" | "auto-detect";
  canOverride: boolean;
}

/**
 * Check if workspace is protected (Master Alex kill switch)
 *
 * Protection layers:
 * 0. HARDCODED FAILSAFE: Block AlexMaster / Alex_Plug_In path (cannot be bypassed)
 * 1. Explicit setting: alex.workspace.protectedMode = true
 * 2. Auto-detect: workspace contains platforms/vscode-extension/ (Master Alex source)
 *
 * @param rootPath Workspace root path
 * @returns Protection status with reason
 */
export async function isWorkspaceProtected(
  rootPath: string,
): Promise<WorkspaceProtectionResult> {
  // Get output channel for debugging
  const outputChannel = getKillSwitchOutputChannel();
  outputChannel.info(`🛡️ Protection check for: ${rootPath}`);

  // Layer 0: HARDCODED FAILSAFE - Check for AlexMaster / Alex_Plug_In in path
  // This cannot be overridden by any setting and protects against all bypass attempts
  const normalizedPath = rootPath.replace(/\\/g, "/").toLowerCase();
  const masterAlexPatterns = [
    "alexmaster",
    "alex_plug_in",
    "alex-plug-in",
    "alexplug",
    "gcx_master",
    "gcx_copilot",
  ];

  for (const pattern of masterAlexPatterns) {
    if (normalizedPath.includes(pattern)) {
      outputChannel.warn(
        `🚨 HARDCODED FAILSAFE TRIGGERED: Path contains '${pattern}'`,
      );
      outputChannel.info(`Full path: ${rootPath}`);
      return {
        isProtected: true,
        reason: "setting", // Treat as explicit setting (no override)
        canOverride: false,
      };
    }
  }

  // Layer 0.5: PROTECTION MARKER FILES
  // Check for Master Alex marker and GCX workspace markers
  const protectionMarkers = [
    {
      file: "MASTER-ALEX-PROTECTED.json",
      field: "master-alex",
      label: "MASTER ALEX",
    },
    {
      file: "GCX-MASTER-PROTECTED.json",
      field: "gcx-master",
      label: "GCX MASTER",
    },
    {
      file: "GCX-COPILOT-PROTECTED.json",
      field: "gcx-copilot",
      label: "GCX COPILOT",
    },
  ];
  for (const marker of protectionMarkers) {
    const markerPath = path.join(rootPath, ".github", "config", marker.file);
    if (await workspaceFs.pathExists(markerPath)) {
      try {
        const markerContent = (await workspaceFs.readJson(markerPath)) as {
          protected?: boolean;
          workspace?: string;
        };
        if (
          markerContent.protected === true &&
          markerContent.workspace === marker.field
        ) {
          outputChannel.warn(
            `🚨 ${marker.label} MARKER DETECTED: ${markerPath}`,
          );
          return {
            isProtected: true,
            reason: "setting", // No override allowed
            canOverride: false,
          };
        }
      } catch {
        // If file exists but can't be read, assume protected
        outputChannel.warn(
          `🚨 ${marker.label} MARKER EXISTS (unreadable): ${markerPath}`,
        );
        return {
          isProtected: true,
          reason: "setting",
          canOverride: false,
        };
      }
    }
  }

  const config = vscode.workspace.getConfiguration("alex.workspace");

  // Layer 1: Explicit protection setting
  const explicitProtection = config.get<boolean>("protectedMode", false);
  outputChannel.info(`protectedMode setting: ${explicitProtection}`);

  if (explicitProtection) {
    outputChannel.info(`✅ Protected by explicit setting`);
    return {
      isProtected: true,
      reason: "setting",
      canOverride: false, // Explicit setting cannot be overridden
    };
  }

  // Layer 2: Auto-detect Master Alex (if enabled)
  const autoProtect = config.get<boolean>("autoProtectMasterAlex", true);
  outputChannel.info(`autoProtectMasterAlex setting: ${autoProtect}`);

  if (autoProtect) {
    // Check for Master Alex indicators
    // NOTE: alex_docs/ is NOT unique to Master Alex — heirs can also have it.
    // Only the platforms/ structure reliably identifies the Master Alex monorepo.
    const masterAlexIndicators = [
      path.join(rootPath, "platforms", "vscode-extension"),
      path.join(rootPath, "platforms", "m365-copilot"),
    ];

    for (const indicator of masterAlexIndicators) {
      const exists = await workspaceFs.pathExists(indicator);
      outputChannel.info(`Checking indicator ${indicator}: ${exists}`);
      if (exists) {
        outputChannel.info(`✅ Protected by auto-detect: ${indicator}`);
        return {
          isProtected: true,
          reason: "auto-detect",
          canOverride: true, // Auto-detection can be overridden with confirmation
        };
      }
    }
  }

  outputChannel.info(`⚠️ Workspace NOT protected`);
  return {
    isProtected: false,
    canOverride: true,
  };
}

/**
 * Check protection and show appropriate message if blocked
 *
 * @param rootPath Workspace root path
 * @param operationName Name of operation for error message
 * @param allowOverride If true, allows user to override auto-detection
 * @returns true if operation should proceed, false if blocked
 */
export async function checkProtectionAndWarn(
  rootPath: string,
  operationName: string,
  allowOverride: boolean = false,
): Promise<boolean> {
  const protection = await isWorkspaceProtected(rootPath);

  // Get output channel for user visibility
  const outputChannel = getKillSwitchOutputChannel();
  outputChannel.info(
    `🛡️ ${operationName} - Protection result: isProtected=${protection.isProtected}, reason=${protection.reason}, canOverride=${protection.canOverride}`,
  );

  if (!protection.isProtected) {
    outputChannel.info(
      `✅ ${operationName} proceeding - workspace not protected`,
    );
    return true; // Not protected, proceed
  }

  outputChannel.warn(`🛑 ${operationName} BLOCKED - workspace is protected`);
  outputChannel.show(true); // Show output channel so user can see logs

  if (protection.reason === "setting") {
    // Explicit protection (or hardcoded failsafe) - cannot override
    // Using await to ensure the dialog is shown before returning
    // No action buttons - user can only close/escape to dismiss
    await vscode.window.showErrorMessage(
      `🛡️ ${operationName} BLOCKED!\n\n` +
        `This is the Master Alex development environment.\n\n` +
        `⚠️ Running this command here would corrupt the source of truth.\n\n` +
        `✅ To test safely:\n` +
        `1. Press F5 to launch Extension Development Host\n` +
        `2. Open Alex_Sandbox folder in the new window\n` +
        `3. Run the command there`,
      { modal: true },
      "I Understand",
    );
    // ALWAYS return false regardless of how dialog was dismissed
    return false;
  }

  if (protection.reason === "auto-detect") {
    if (allowOverride) {
      // Auto-detection with override option
      // Only show the dangerous action button - closing/escape = cancel
      const result = await vscode.window.showWarningMessage(
        `⚠️ Master Alex workspace detected!\n\n` +
          `This appears to be the Alex development environment.\n` +
          `"${operationName}" could damage the source of truth.\n\n` +
          `Use F5 (Extension Development Host) for safe testing.`,
        { modal: true },
        "Proceed Anyway (DANGEROUS)",
      );

      if (result === "Proceed Anyway (DANGEROUS)") {
        // Double confirmation for destructive operations
        const doubleConfirm = await vscode.window.showWarningMessage(
          `🚨 FINAL WARNING 🚨\n\n` +
            `You are about to modify Master Alex's cognitive architecture.\n` +
            `This cannot be easily undone.\n\n` +
            `Are you absolutely sure?`,
          { modal: true },
          "Yes, I understand the risk",
        );

        return doubleConfirm === "Yes, I understand the risk";
      }
      return false;
    } else {
      // Auto-detection without override
      vscode.window.showErrorMessage(
        `🛡️ ${operationName} blocked: Master Alex workspace detected.\n\n` +
          `This workspace contains Alex source code. ` +
          `Use Extension Development Host (F5) to test the extension safely.`,
        { modal: true },
      );
      return false;
    }
  }

  return true;
}

// ============================================================================
// UPGRADE POLICY
// ============================================================================

/**
 * Upgrade policy modes:
 * - "auto"   : Default. Extension shows upgrade notifications and allows upgrades.
 * - "prompt" : Always shows confirmation, warns workspace is pinned.
 * - "locked" : Blocks all upgrades and suppresses notifications.
 */
export type UpgradePolicyMode = "auto" | "prompt" | "locked";

export interface UpgradePolicy {
  mode: UpgradePolicyMode;
  pinnedVersion?: string;
  reason?: string;
}

/**
 * Read upgradePolicy from the workspace's alex-manifest.json.
 * Returns { mode: "auto" } if not set or unreadable (backward-compatible default).
 */
export async function readUpgradePolicy(
  rootPath: string,
): Promise<UpgradePolicy> {
  const DEFAULT_POLICY: UpgradePolicy = { mode: "auto" };
  try {
    const manifestPath = path.join(
      rootPath,
      ".github",
      "config",
      "alex-manifest.json",
    );
    if (!(await fs.pathExists(manifestPath))) {
      return DEFAULT_POLICY;
    }
    const manifest = await fs.readJson(manifestPath);
    if (
      manifest.upgradePolicy &&
      typeof manifest.upgradePolicy === "object" &&
      ["auto", "prompt", "locked"].includes(manifest.upgradePolicy.mode)
    ) {
      return manifest.upgradePolicy as UpgradePolicy;
    }
    return DEFAULT_POLICY;
  } catch {
    return DEFAULT_POLICY;
  }
}

/**
 * Get language ID from file extension for clipboard/chat commands
 *
 * Centralised utility - used by extension.ts and contextMenu.ts
 */
export function getLanguageIdFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const extMap: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "typescriptreact",
    ".js": "javascript",
    ".jsx": "javascriptreact",
    ".py": "python",
    ".rb": "ruby",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".cs": "csharp",
    ".cpp": "cpp",
    ".c": "c",
    ".h": "c",
    ".md": "markdown",
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".sql": "sql",
    ".sh": "shellscript",
    ".ps1": "powershell",
    ".xml": "xml",
  };
  return extMap[ext] || "text";
}

// Note: createSynapseRegex removed in v7.8 - embedded synapse sections have been deprecated
// The cognitive architecture no longer uses markdown synapse declarations

/**
 * Open the Copilot Agent/Chat panel with fallback.
 * Tries Agent mode first, falls back to chat panel if unavailable.
 */
/**
 * Open the Copilot Chat panel, optionally pre-filling a prompt.
 * When query is provided, it is typed directly into the chat input —
 * no clipboard copy/paste needed. Falls back gracefully.
 */
export async function openChatPanel(query?: string): Promise<void> {
  const opts = query ? { query } : undefined;
  try {
    await vscode.commands.executeCommand(
      "workbench.action.chat.openAgent",
      opts,
    );
  } catch {
    try {
      if (query) {
        await vscode.commands.executeCommand(
          "workbench.action.chat.open",
          opts,
        );
      } else {
        await vscode.commands.executeCommand(
          "workbench.panel.chat.view.copilot.focus",
        );
      }
    } catch {
      // Last resort: copy to clipboard so the user can paste manually
      if (query) {
        await vscode.env.clipboard.writeText(query);
        vscode.window.showInformationMessage(
          "Prompt copied to clipboard. Paste in Copilot Chat (Ctrl+V) and press Enter.",
        );
      }
      vscode.window.showWarningMessage(
        "Could not open Copilot Chat. Make sure GitHub Copilot Chat extension is installed and up to date.",
      );
    }
  }
}

/**
 * Resolve a muscle script from workspace .github/muscles/ first, then extension bundle.
 */
export async function resolveMuscleScript(
  scriptName: string,
  workspacePath: string,
  extensionPath: string,
): Promise<string | undefined> {
  const candidates = [
    path.join(workspacePath, ".github", "muscles", scriptName),
    path.join(extensionPath, ".github", "muscles", scriptName),
  ];
  for (const candidate of candidates) {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(candidate));
      return candidate;
    } catch {
      // try next
    }
  }
  return undefined;
}
