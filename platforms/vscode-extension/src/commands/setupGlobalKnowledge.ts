import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import { AI_MEMORY_PATHS, AI_MEMORY_FILES } from "../shared/constants";
import {
  detectOneDrivePath,
  resolveAIMemoryRoot,
  getAllCloudStorageRoots,
  detectCloudStorageWithAIMemory,
  promptForCloudStorageRoot,
  setAIMemoryRoot,
} from "../chat/globalKnowledge";

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
 * Resolve the AI-Memory folder with OneDrive detection metadata.
 * Uses the shared resolveAIMemoryRoot() for path, adds isOneDrive flag.
 */
export function resolveAIMemoryLocation(): AIMemoryLocation {
  const folderPath = resolveAIMemoryRoot();
  const isOneDrive = detectOneDrivePath() !== null;
  return { folderPath, isOneDrive };
}

/**
 * Check whether the AI-Memory folder exists and contains the expected files.
 */
export async function isAIMemorySetup(): Promise<boolean> {
  const { folderPath } = resolveAIMemoryLocation();
  if (!(await fs.pathExists(folderPath))) {
    return false;
  }
  // Accept if insights/ or global-knowledge.md or index.json exists
  return (
    (await fs.pathExists(path.join(folderPath, AI_MEMORY_PATHS.insights))) ||
    (await fs.pathExists(path.join(folderPath, AI_MEMORY_PATHS.globalKnowledge))) ||
    (await fs.pathExists(path.join(folderPath, AI_MEMORY_PATHS.index)))
  );
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

  // AI-Memory doesn't exist yet — check for multiple cloud options
  const cloudRoots = getAllCloudStorageRoots();
  let targetFolder: string;

  if (cloudRoots.length > 1 && !detectCloudStorageWithAIMemory()) {
    // Multiple cloud services, none has AI-Memory yet — ask user
    const chosenRoot = await promptForCloudStorageRoot();
    if (!chosenRoot) {
      return false; // User cancelled
    }
    targetFolder = path.join(chosenRoot, AI_MEMORY_PATHS.folderName);
    await setAIMemoryRoot(targetFolder);
  } else {
    targetFolder = resolveAIMemoryRoot();
  }

  const isCloud = cloudRoots.some((r) => targetFolder.startsWith(r.path));
  const locationLabel = isCloud
    ? `cloud storage (${targetFolder})`
    : `local disk (${targetFolder})`;

  const syncNote = isCloud
    ? "Files will sync across devices via cloud storage."
    : "No cloud storage detected — files will be stored locally only.";

  const choice = await vscode.window.showInformationMessage(
    `AI-Memory folder not found.\n\nCreate it in ${locationLabel}?\n\n${syncNote}`,
    { modal: false },
    "Create AI-Memory",
    "Skip",
  );

  if (choice === "Create AI-Memory") {
    try {
      await scaffoldAIMemory(targetFolder);
      await setAIMemoryRoot(targetFolder);
      vscode.window.showInformationMessage(
        `AI-Memory created at ${targetFolder}`,
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
