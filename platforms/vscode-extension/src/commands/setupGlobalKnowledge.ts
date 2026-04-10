import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { AI_MEMORY_PATHS, AI_MEMORY_FILES } from "../shared/constants";

// ============================================================================
// AI-Memory Path Resolution
// ============================================================================

/** Result of resolving the AI-Memory folder location */
export interface AIMemoryLocation {
  /** Absolute path to the AI-Memory folder */
  folderPath: string;
  /** Whether this is backed by OneDrive (true) or a local-only folder (false) */
  isOneDrive: boolean;
}

/**
 * Detect the OneDrive sync root on the current platform.
 * Returns null if OneDrive is not available.
 */
function detectOneDrivePath(): string | null {
  if (process.platform === "win32") {
    // Windows: check standard env vars set by the OneDrive client
    const candidates = [
      process.env.OneDrive,
      process.env.OneDriveConsumer,
      process.env.OneDriveCommercial,
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    // Fallback: check common Windows paths
    const userProfile = process.env.USERPROFILE || os.homedir();
    const windowsFallbacks = [
      path.join(userProfile, "OneDrive"),
      path.join(userProfile, "OneDrive - Personal"),
    ];
    for (const fb of windowsFallbacks) {
      if (fs.existsSync(fb)) {
        return fb;
      }
    }
  } else if (process.platform === "darwin") {
    // macOS: OneDrive syncs into ~/Library/CloudStorage/OneDrive-*
    const cloudStorageDir = path.join(
      os.homedir(),
      "Library",
      "CloudStorage",
    );
    if (fs.existsSync(cloudStorageDir)) {
      try {
        const entries = fs.readdirSync(cloudStorageDir);
        const oneDriveEntry = entries.find((e) =>
          e.startsWith("OneDrive"),
        );
        if (oneDriveEntry) {
          return path.join(cloudStorageDir, oneDriveEntry);
        }
      } catch {
        // Ignore read errors
      }
    }

    // macOS fallback: ~/OneDrive (legacy symlink or standalone)
    const legacyMac = path.join(os.homedir(), "OneDrive");
    if (fs.existsSync(legacyMac)) {
      return legacyMac;
    }
  }

  return null;
}

/**
 * Resolve the AI-Memory folder, preferring OneDrive with local fallback.
 *
 * Priority:
 *  1. OneDrive/<folderName>/ — if OneDrive is detected on disk
 *  2. ~/.alex/<folderName>/ — local fallback (no cloud sync)
 *
 * Does NOT create the folder; call {@link scaffoldAIMemory} for that.
 */
export function resolveAIMemoryLocation(): AIMemoryLocation {
  const oneDriveRoot = detectOneDrivePath();

  if (oneDriveRoot) {
    return {
      folderPath: path.join(oneDriveRoot, AI_MEMORY_PATHS.folderName),
      isOneDrive: true,
    };
  }

  // Local-only fallback
  return {
    folderPath: path.join(os.homedir(), AI_MEMORY_PATHS.localFallback),
    isOneDrive: false,
  };
}

/**
 * Check whether the AI-Memory folder exists and contains the expected files.
 */
export async function isAIMemorySetup(): Promise<boolean> {
  const { folderPath } = resolveAIMemoryLocation();
  if (!(await fs.pathExists(folderPath))) {
    return false;
  }
  // At minimum, global-knowledge.md must exist
  return fs.pathExists(path.join(folderPath, AI_MEMORY_PATHS.globalKnowledge));
}

// Keep legacy export name for backward compatibility during migration
export const isGlobalKnowledgeSetup = isAIMemorySetup;

// ============================================================================
// Scaffolding
// ============================================================================

/** Template content for newly created AI-Memory files */
const TEMPLATES: Record<string, string> = {
  [AI_MEMORY_PATHS.profile]: `# Profile

## Identity

- **Name**: (your name)
- **Role**: (your role)

## Preferences

(Add your working preferences here)

## Expertise

(List your areas of expertise)
`,
  [AI_MEMORY_PATHS.notes]: `# Notes

## Quick Notes

(Jot quick notes here)

## Reminders

(Active reminders)
`,
  [AI_MEMORY_PATHS.learningGoals]: `# Learning Goals

## Active Goals

(Add goals with progress tracking)
`,
  [AI_MEMORY_PATHS.globalKnowledge]: `# Global Knowledge

Cross-project insights and patterns collected across all work.

## General

(Add insights organized by category headings)
`,
};

/**
 * Create the AI-Memory folder and populate with starter templates.
 * Existing files are never overwritten.
 */
async function scaffoldAIMemory(folderPath: string): Promise<void> {
  await fs.ensureDir(folderPath);

  for (const file of AI_MEMORY_FILES) {
    const filePath = path.join(folderPath, file);
    if (!(await fs.pathExists(filePath))) {
      const template = TEMPLATES[file] ?? "";
      await fs.writeFile(filePath, template, "utf-8");
    }
  }
}

// ============================================================================
// Setup Flow (called on activation)
// ============================================================================

/**
 * Ensure AI-Memory is set up — called on extension activation.
 * If the folder doesn't exist, prompts the user to create it.
 * Returns true if setup is complete (or was already done).
 */
export async function ensureGlobalKnowledgeSetup(): Promise<boolean> {
  if (await isAIMemorySetup()) {
    return true;
  }

  const location = resolveAIMemoryLocation();
  const locationLabel = location.isOneDrive
    ? `OneDrive (${location.folderPath})`
    : `local disk (${location.folderPath})`;

  const oneDriveNote = location.isOneDrive
    ? "Files will sync across devices via OneDrive."
    : "OneDrive not detected — files will be stored locally only. Install OneDrive to enable cross-device sync.";

  const choice = await vscode.window.showInformationMessage(
    `AI-Memory folder not found.\n\nCreate it in ${locationLabel}?\n\n${oneDriveNote}`,
    { modal: false },
    "Create AI-Memory",
    "Skip",
  );

  if (choice === "Create AI-Memory") {
    try {
      await scaffoldAIMemory(location.folderPath);
      vscode.window.showInformationMessage(
        `AI-Memory created at ${location.folderPath}`,
      );
      return true;
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to create AI-Memory: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  return false;
}

// ============================================================================
// Manual Command
// ============================================================================

/**
 * Command: Alex: Setup AI-Memory
 * Manual trigger for AI-Memory setup.
 */
export async function setupGlobalKnowledgeCommand(): Promise<void> {
  const isSetup = await isAIMemorySetup();

  if (isSetup) {
    const location = resolveAIMemoryLocation();
    const syncLabel = location.isOneDrive ? " (OneDrive)" : " (local only)";
    const reconfigure = await vscode.window.showInformationMessage(
      `AI-Memory is configured at:\n${location.folderPath}${syncLabel}\n\nWhat would you like to do?`,
      "Open Folder",
      "Re-scaffold Missing Files",
      "Cancel",
    );

    if (reconfigure === "Open Folder") {
      vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(location.folderPath),
        { forceNewWindow: true },
      );
    } else if (reconfigure === "Re-scaffold Missing Files") {
      try {
        await scaffoldAIMemory(location.folderPath);
        vscode.window.showInformationMessage(
          "Missing AI-Memory files re-created (existing files preserved).",
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  } else {
    await ensureGlobalKnowledgeSetup();
  }
}
