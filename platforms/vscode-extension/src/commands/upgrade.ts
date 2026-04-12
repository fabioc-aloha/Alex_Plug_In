/**
 * Alex Upgrade Command - v3 (Automatic Preservation)
 *
 * Philosophy: "Never lose heir-created work"
 *
 * Process:
 * 1. Backup everything (archive/upgrades/)
 * 2. Fresh install of new version
 * 3. Auto-restore user-created skills, profile, episodic records
 * 4. Normalize all synapses to current schema
 * 5. Only stale items (>90 days) require manual review
 *
 * Synapse normalization handles:
 * - String strengths → numeric (strong→0.9, moderate→0.7)
 * - synapses[] → connections[]
 * - activationKeywords → activationContexts
 * - context → when + yields
 * - Adds $schema, skillId, inheritance, lastUpdated
 */

import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as crypto from "crypto";
import {
  getAlexWorkspaceFolder,
  checkProtectionAndWarn,
  readUpgradePolicy,
} from "../shared/utils";
import { runDreamProtocol } from "./dream";
import { offerEnvironmentSetup } from "./setupEnvironment";
import { initializeArchitecture } from "./initialize";
import { detectAndUpdateProjectPersona } from "../chat/personaDetection";
import { migrateSecretsFromEnvironment } from "../services/secretsManager";
import { normalizeAllSynapses } from "./upgradeSynapseNormalization";
import { generateMigrationCandidates } from "./upgradeMigration";
import { runGapAnalysis } from "./upgradeGapAnalysis";

// ============================================================================
// TYPES
// ============================================================================

type LegacyVersion = "legacy" | "transitional" | "current" | "unknown";

export interface LegacyDetection {
  version: LegacyVersion;
  dkLocations: string[]; // All places where DK files were found
  hasSkills: boolean;
  manifestLocation: string | null;
  installedVersion: string | null;
}

export interface MigrationCandidate {
  type:
    | "legacy-dk"
    | "user-dk"
    | "user-skill"
    | "modified-system"
    | "profile"
    | "episodic";
  sourcePath: string; // Path in backup
  targetPath: string; // Path in new install
  description: string;
  sizeKB: number;
  lastModified: Date;
  recommended: boolean;
  stale: boolean; // Not modified in > 90 days
}

interface UpgradeResult {
  success: boolean;
  backupPath: string;
  migrationCandidatesPath: string | null;
  candidateCount: number;
  errors: string[];
}
// mark interface as used for TS
const _upgradeResultMarker: UpgradeResult = {
  success: false,
  backupPath: "",
  migrationCandidatesPath: null,
  candidateCount: 0,
  errors: [],
};
void _upgradeResultMarker;

/** Stats captured during upgrade for completion message */
interface UpgradeStats {
  restoredCount: number;
  normalizedCount: number;
  staleCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Single source of truth for architecture deploy sources.
 * Used by: initialize.ts (deployArchitectureFiles, createInitialManifest),
 *          upgrade.ts (freshInstall, createFreshManifest).
 * Root files are individual files; directories are copied recursively.
 */
export const ARCHITECTURE_ROOT_FILES = [
  "copilot-instructions.md",
  "hooks.json",
];
export const ARCHITECTURE_DIRECTORIES = [
  "instructions",
  "prompts",
  "config",
  "agents",
  "skills",
  "muscles",
  "assets",
];
export const ARCHITECTURE_EMPTY_FOLDERS = ["episodic"];

/** File extensions tracked in manifests */
export const MANIFEST_EXTENSIONS = [".md", ".json", ".cjs"];

// ============================================================================
// DETECTION
// ============================================================================

/**
 * Detect what version structure exists in the workspace
 */
async function detectLegacyStructure(
  rootPath: string,
): Promise<LegacyDetection> {
  const result: LegacyDetection = {
    version: "unknown",
    dkLocations: [],
    hasSkills: false,
    manifestLocation: null,
    installedVersion: null,
  };

  // Check for DK files in root (legacy < 3.0)
  try {
    const rootFiles = await fs.readdir(rootPath);
    const rootDKFiles = rootFiles.filter(
      (f) => f.startsWith("DK-") && f.endsWith(".md"),
    );
    if (rootDKFiles.length > 0) {
      result.dkLocations.push("root");
    }
  } catch (err) {
    // Ignore - non-critical
  }

  // Check for DK files in .github/ directly (some old versions)
  const githubPath = path.join(rootPath, ".github");
  try {
    if (await fs.pathExists(githubPath)) {
      const githubFiles = await fs.readdir(githubPath);
      const githubDKFiles = githubFiles.filter(
        (f) => f.startsWith("DK-") && f.endsWith(".md"),
      );
      if (githubDKFiles.length > 0) {
        result.dkLocations.push(".github");
      }
    }
  } catch (err) {
    // Ignore - non-critical
  }

  // Check for DK files in .github/domain-knowledge/ (3.0+)
  const dkFolderPath = path.join(rootPath, ".github", "domain-knowledge");
  try {
    if (await fs.pathExists(dkFolderPath)) {
      const dkFiles = await fs.readdir(dkFolderPath);
      if (dkFiles.some((f) => f.endsWith(".md"))) {
        result.dkLocations.push(".github/domain-knowledge");
      }
    }
  } catch (err) {
    // Ignore - non-critical
  }

  // Check for skills (3.4+)
  const skillsPath = path.join(rootPath, ".github", "skills");
  result.hasSkills = await fs.pathExists(skillsPath);

  // Check for manifest locations
  const newManifest = path.join(
    rootPath,
    ".github",
    "config",
    "alex-manifest.json",
  );
  const oldManifest = path.join(rootPath, ".alex-manifest.json");

  if (await fs.pathExists(newManifest)) {
    result.manifestLocation = ".github/config/alex-manifest.json";
  } else if (await fs.pathExists(oldManifest)) {
    result.manifestLocation = ".alex-manifest.json";
  }

  // Get installed version from copilot-instructions.md
  const instructionsPath = path.join(
    rootPath,
    ".github",
    "copilot-instructions.md",
  );
  if (await fs.pathExists(instructionsPath)) {
    try {
      const content = await fs.readFile(instructionsPath, "utf8");
      // Try multiple patterns for version detection
      const patterns = [
        /^# Alex v(\d+\.\d+\.\d+)/m, // v6+ ADR-010: # Alex v6.4.6
        /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/, // Legacy: **Version**: 3.7.6
        /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)-[\w-]+/, // Legacy suffix: **Version**: 3.5.3-PENT-TRI
        /Version:\s*(\d+\.\d+\.\d+)/i, // Plain: Version: 3.7.6
      ];
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          result.installedVersion = match[1];
          break;
        }
      }
    } catch (err) {
      // Ignore - fallback to manifest
    }
  }

  // Also try manifest file as fallback
  if (!result.installedVersion && result.manifestLocation) {
    try {
      const manifestPath = path.join(rootPath, result.manifestLocation);
      if (await fs.pathExists(manifestPath)) {
        const manifest = await fs.readJson(manifestPath);
        if (manifest.version) {
          result.installedVersion = manifest.version;
        }
      }
    } catch (err) {
      // Ignore - non-critical
    }
  }

  // Determine version category
  if (result.dkLocations.includes("root")) {
    result.version = "legacy";
  } else if (result.manifestLocation === ".alex-manifest.json") {
    result.version = "transitional";
  } else if (result.hasSkills) {
    result.version = "current";
  } else if (result.dkLocations.length > 0) {
    result.version = "transitional";
  }

  return result;
}

// ============================================================================
// BACKUP
// ============================================================================

/**
 * Create a complete backup of everything
 */
async function createVersionAwareBackup(
  rootPath: string,
  detection: LegacyDetection,
  timestamp: string,
): Promise<string> {
  const versionLabel = detection.installedVersion || detection.version;
  const backupDir = path.join(
    rootPath,
    "archive",
    "upgrades",
    `backup-${versionLabel}-${timestamp}`,
  );

  await fs.ensureDir(backupDir);

  // Backup .github folder
  const githubSrc = path.join(rootPath, ".github");
  if (await fs.pathExists(githubSrc)) {
    await fs.copy(githubSrc, path.join(backupDir, ".github"));
  }

  // Backup root DK files (legacy)
  if (detection.dkLocations.includes("root")) {
    const rootDKDir = path.join(backupDir, "root-dk-files");
    await fs.ensureDir(rootDKDir);

    const rootFiles = await fs.readdir(rootPath);
    for (const file of rootFiles) {
      if (file.startsWith("DK-") && file.endsWith(".md")) {
        await fs.copy(path.join(rootPath, file), path.join(rootDKDir, file));
      }
    }
  }

  // Backup old manifest location
  const oldManifest = path.join(rootPath, ".alex-manifest.json");
  if (await fs.pathExists(oldManifest)) {
    await fs.copy(oldManifest, path.join(backupDir, ".alex-manifest.json"));
  }

  // Save detection report
  await fs.writeJson(
    path.join(backupDir, "detection-report.json"),
    {
      ...detection,
      backupCreatedAt: new Date().toISOString(),
    },
    { spaces: 2 },
  );

  return backupDir;
}

// ============================================================================
// ACTIVE CONTEXT MIGRATION
// ============================================================================

/**
 * Active Context fields that are heir-specific runtime state.
 * These are written by the extension during the heir's sessions
 * and should be preserved across upgrades.
 */
const ACTIVE_CONTEXT_FIELDS = [
  "Persona",
  "Objective",
  "Focus Trifectas",
  "Priorities",
  "Principles",
  "Recent",
  "North Star",
  "Guidelines",
  "Last Assessed",
];

/**
 * Placeholder patterns that indicate the field was never set by the user.
 * Fields still at their default/placeholder value are NOT migrated.
 */
const PLACEHOLDER_PATTERNS = [
  /^\(.*\)$/, // (placeholder)
  /^\*\(.*\)\*$/, // *(placeholder)*
  /^_\(.*\)_$/, // _(placeholder)_
  /^never$/i, // never
];

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value.trim()));
}

/**
 * Migrate heir's runtime Active Context values from backup to fresh install.
 *
 * The fresh install deploys the extension's template copilot-instructions.md
 * (already decontaminated of Master values by sync). This function reads the
 * heir's old Active Context fields — which may have been customized at runtime —
 * and applies non-placeholder values to the fresh file.
 */
async function migrateActiveContext(
  backupPath: string,
  rootPath: string,
): Promise<void> {
  const backupFile = path.join(
    backupPath,
    ".github",
    "copilot-instructions.md",
  );
  const freshFile = path.join(rootPath, ".github", "copilot-instructions.md");

  if (!(await fs.pathExists(backupFile)) || !(await fs.pathExists(freshFile))) {
    return;
  }

  const backupContent = await fs.readFile(backupFile, "utf8");
  let freshContent = await fs.readFile(freshFile, "utf8");

  for (const field of ACTIVE_CONTEXT_FIELDS) {
    const fieldRegex = new RegExp(
      `^(${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:) (.+)$`,
      "m",
    );
    const backupMatch = backupContent.match(fieldRegex);
    if (!backupMatch) {
      continue;
    }

    const backupValue = backupMatch[2].trim();
    if (isPlaceholder(backupValue)) {
      continue;
    }

    // Replace the field value in the fresh file with the heir's runtime value
    freshContent = freshContent.replace(fieldRegex, `$1 ${backupValue}`);
  }

  await fs.writeFile(freshFile, freshContent, "utf8");
}

// ============================================================================
// CLEAN + FRESH INSTALL
// ============================================================================

/**
 * Items inside .github/ that belong to Alex and should be removed during upgrade.
 * Everything NOT in this list is preserved (e.g. workflows/, ISSUE_TEMPLATE/, FUNDING.yml).
 */
const ALEX_OWNED_ITEMS = [
  ...ARCHITECTURE_ROOT_FILES, // copilot-instructions.md, hooks.json
  ...ARCHITECTURE_DIRECTORIES, // instructions, prompts, config, agents, skills, muscles, assets
  ...ARCHITECTURE_EMPTY_FOLDERS, // episodic
  "domain-knowledge", // legacy DK folder (pre-skills era)
  "MIGRATION-CANDIDATES.md", // upgrade artifact
];

/**
 * Remove old Alex structure while preserving non-Alex .github/ content
 * (GitHub Actions workflows, issue templates, PR templates, FUNDING.yml, etc.)
 */
async function cleanOldStructure(
  rootPath: string,
  detection: LegacyDetection,
): Promise<void> {
  const githubPath = path.join(rootPath, ".github");

  if (await fs.pathExists(githubPath)) {
    // Only delete Alex-owned items, not the entire .github/ folder
    for (const item of ALEX_OWNED_ITEMS) {
      const itemPath = path.join(githubPath, item);
      if (await fs.pathExists(itemPath)) {
        await fs.remove(itemPath);
      }
    }
  }

  // Delete root DK files (legacy)
  if (detection.dkLocations.includes("root")) {
    const rootFiles = await fs.readdir(rootPath);
    for (const file of rootFiles) {
      if (file.startsWith("DK-") && file.endsWith(".md")) {
        await fs.remove(path.join(rootPath, file));
      }
    }
  }

  // Delete old manifest
  const oldManifest = path.join(rootPath, ".alex-manifest.json");
  if (await fs.pathExists(oldManifest)) {
    await fs.remove(oldManifest);
  }
}

/**
 * Install fresh from extension package
 */
async function freshInstall(
  extensionPath: string,
  rootPath: string,
): Promise<void> {
  const sources = [
    ...ARCHITECTURE_ROOT_FILES.map((f) => ({ src: f, dest: f })),
    ...ARCHITECTURE_DIRECTORIES.map((d) => ({ src: d, dest: d })),
  ];

  const extGithub = path.join(extensionPath, ".github");
  const destGithub = path.join(rootPath, ".github");

  await fs.ensureDir(destGithub);

  for (const item of sources) {
    const srcPath = path.join(extGithub, item.src);
    const destPath = path.join(destGithub, item.dest);

    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath, { overwrite: true });
    }
  }

  // Create empty runtime folders
  for (const folder of ARCHITECTURE_EMPTY_FOLDERS) {
    await fs.ensureDir(path.join(destGithub, folder));
  }

  // Create fresh manifest
  await createFreshManifest(extensionPath, rootPath);
}

/**
 * Create manifest for fresh install
 * Preserves upgradePolicy from any existing manifest so user's lock survives upgrades.
 */
async function createFreshManifest(
  extensionPath: string,
  rootPath: string,
): Promise<void> {
  const packageJson = await fs.readJson(
    path.join(extensionPath, "package.json"),
  );
  const version = packageJson.version || "0.0.0";

  const manifestPath = path.join(
    rootPath,
    ".github",
    "config",
    "alex-manifest.json",
  );

  // Preserve upgradePolicy from existing manifest if present
  let existingPolicy: Record<string, unknown> | undefined;
  try {
    if (await fs.pathExists(manifestPath)) {
      const existing = await fs.readJson(manifestPath);
      if (
        existing.upgradePolicy &&
        typeof existing.upgradePolicy === "object"
      ) {
        existingPolicy = existing.upgradePolicy;
      }
    }
  } catch {
    // Ignore read errors; policy will not be preserved
  }

  const files: Record<string, { type: string; originalChecksum: string }> = {};

  const manifest: Record<string, unknown> = {
    version,
    installedAt: new Date().toISOString(),
    files,
  };

  if (existingPolicy) {
    manifest.upgradePolicy = existingPolicy;
  } else {
    // Default heir policy: always confirm before upgrading
    manifest.upgradePolicy = {
      mode: "prompt",
      pinnedVersion: version,
      reason: "Default heir policy: confirm before upgrading",
    };
  }

  // Calculate checksums for system files
  const githubPath = path.join(rootPath, ".github");
  const systemFiles = await collectSystemFiles(githubPath);

  for (const file of systemFiles) {
    const content = await fs.readFile(file, "utf8");
    const relativePath = path.relative(rootPath, file).replace(/\\/g, "/");
    files[relativePath] = {
      type: "system",
      originalChecksum: crypto
        .createHash("md5")
        .update(content.replace(/\r\n/g, "\n"))
        .digest("hex"),
    };
  }

  await fs.ensureDir(path.dirname(manifestPath));
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

/**
 * Collect all system files for manifest
 * NASA R1: Bounded recursion with maxDepth
 */
const MAX_WALK_DEPTH = 10;

async function collectSystemFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string, depth: number = 0) {
    if (depth >= MAX_WALK_DEPTH) {
      console.warn(`[NASA] Max walk depth reached at: ${currentDir}`);
      return;
    }
    if (!(await fs.pathExists(currentDir))) {
      return;
    }

    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
      } else if (MANIFEST_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

// ============================================================================
// MAIN UPGRADE COMMAND
// ============================================================================

async function confirmUpgradeDialog(
  detection: LegacyDetection,
  extensionVersion: string,
  extensionPath: string,
): Promise<boolean> {
  const MAX_DIALOG_ITERATIONS = 100;
  const versionInfo = detection.installedVersion
    ? `v${detection.installedVersion} → v${extensionVersion}`
    : `${detection.version} structure → v${extensionVersion}`;

  let confirm: string | undefined;
  let dialogIterations = 0;
  while (dialogIterations++ < MAX_DIALOG_ITERATIONS) {
    confirm = await vscode.window.showInformationMessage(
      `🔄 Upgrade: ${versionInfo}\n\n` +
        "This upgrade will:\n\n" +
        "1️⃣ Backup everything (nothing is lost)\n" +
        "2️⃣ Fresh install of new version\n" +
        "3️⃣ Auto-restore your skills & settings\n" +
        "4️⃣ Normalize synapses to current schema\n\n" +
        "Your work is preserved automatically!",
      { modal: true },
      "Start Upgrade",
      "What's New?",
      "Cancel",
    );

    if (confirm === "What's New?") {
      const changelogPath = path.join(extensionPath, "CHANGELOG.md");
      if (await fs.pathExists(changelogPath)) {
        const doc = await vscode.workspace.openTextDocument(changelogPath);
        await vscode.window.showTextDocument(doc);
      }
      continue;
    }
    break;
  }

  return confirm === "Start Upgrade";
}

async function executeUpgradePhases(
  rootPath: string,
  extensionPath: string,
  detection: LegacyDetection,
  timestamp: string,
  extensionVersion: string,
): Promise<UpgradeStats> {
  let stats: UpgradeStats = {
    restoredCount: 0,
    normalizedCount: 0,
    staleCount: 0,
  };

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Upgrading Alex...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: "Creating backup...", increment: 20 });
      const backupPath = await createVersionAwareBackup(
        rootPath,
        detection,
        timestamp,
      );

      progress.report({
        message: "Cleaning old installation...",
        increment: 20,
      });
      await cleanOldStructure(rootPath, detection);

      // Critical phase: fresh install. If this fails, rollback from backup.
      try {
        progress.report({
          message: "Installing new version...",
          increment: 20,
        });
        await freshInstall(extensionPath, rootPath);
      } catch (installErr) {
        progress.report({
          message: "Install failed, rolling back from backup...",
        });
        const backupGithub = path.join(backupPath, ".github");
        if (await fs.pathExists(backupGithub)) {
          await fs.copy(backupGithub, path.join(rootPath, ".github"), {
            overwrite: true,
          });
        }
        throw new Error(
          `Fresh install failed (rolled back from backup): ${installErr instanceof Error ? installErr.message : String(installErr)}`,
        );
      }

      progress.report({
        message: "Preserving your session context...",
        increment: 5,
      });
      await migrateActiveContext(backupPath, rootPath);

      progress.report({
        message: "Analyzing migration candidates...",
        increment: 15,
      });
      const candidates = await runGapAnalysis(backupPath, rootPath, detection);

      progress.report({
        message: "Restoring your skills and settings...",
        increment: 15,
      });

      if (candidates.length > 0) {
        const autoRestore = candidates.filter((c) => c.recommended && !c.stale);
        const restoredItems: string[] = [];
        for (const item of autoRestore) {
          const src = path.join(backupPath, item.sourcePath);
          const dest = path.join(rootPath, item.targetPath);
          if (await fs.pathExists(src)) {
            await fs.ensureDir(path.dirname(dest));
            await fs.copy(src, dest, { overwrite: true });
            restoredItems.push(item.description);
          }
        }

        progress.report({
          message: "Normalizing synapses to current schema...",
          increment: 5,
        });
        const skillsDir = path.join(rootPath, ".github", "skills");
        let synapseNormalized = 0;
        if (await fs.pathExists(skillsDir)) {
          const synapseResult = await normalizeAllSynapses(skillsDir);
          synapseNormalized = synapseResult.normalized;
        }

        const staleItems = candidates.filter((c) => c.stale);
        if (staleItems.length > 0) {
          await generateMigrationCandidates(
            rootPath,
            backupPath,
            staleItems,
            detection,
            extensionVersion,
          );
        }

        stats = {
          restoredCount: restoredItems.length,
          normalizedCount: synapseNormalized,
          staleCount: staleItems.length,
        };
      } else {
        const skillsDir = path.join(rootPath, ".github", "skills");
        if (await fs.pathExists(skillsDir)) {
          await normalizeAllSynapses(skillsDir);
        }
      }
    },
  );

  return stats;
}

interface PostUpgradeResult {
  dreamSuccess: boolean;
  warnings: string[];
}

async function runPostUpgradeTasks(
  context: vscode.ExtensionContext,
  rootPath: string,
): Promise<PostUpgradeResult> {
  const result: PostUpgradeResult = { dreamSuccess: false, warnings: [] };

  try {
    const dreamResult = await runDreamProtocol(context, { silent: true });
    result.dreamSuccess = dreamResult?.success ?? false;
  } catch (err) {
    result.warnings.push(
      `Dream validation failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  await offerEnvironmentSetup();

  try {
    await detectAndUpdateProjectPersona(rootPath, { updateSlots: false });
  } catch (err) {
    result.warnings.push(
      `Persona detection failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  try {
    await migrateSecretsFromEnvironment();
  } catch (err) {
    result.warnings.push(
      `Secrets migration failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return result;
}

async function showUpgradeCompletion(
  rootPath: string,
  detection: LegacyDetection,
  extensionVersion: string,
  stats: UpgradeStats,
  postResult: PostUpgradeResult,
): Promise<void> {
  const { restoredCount, normalizedCount, staleCount } = stats;
  const healthIcon = postResult.dreamSuccess ? "💚" : "⚠️";
  const healthText = postResult.dreamSuccess ? "healthy" : "needs attention";

  const summaryParts: string[] = [];
  if (restoredCount > 0) {
    summaryParts.push(`📦 ${restoredCount} item(s) restored`);
  }
  if (normalizedCount > 0) {
    summaryParts.push(`🔧 ${normalizedCount} synapse(s) normalized`);
  }
  if (postResult.warnings.length > 0) {
    summaryParts.push(`⚠️ ${postResult.warnings.length} warning(s)`);
  }
  const summaryLine =
    summaryParts.length > 0 ? summaryParts.join(" • ") : "Fresh install";

  const base =
    `Upgrade Complete! v${detection.installedVersion || "unknown"} → v${extensionVersion}\n\n` +
    `${healthIcon} Health: ${healthText}\n${summaryLine}\n`;

  if (postResult.warnings.length > 0) {
    for (const w of postResult.warnings) {
      console.warn("[Alex] Post-upgrade warning:", w);
    }
  }

  if (staleCount > 0) {
    const result = await vscode.window.showInformationMessage(
      base +
        `⏰ ${staleCount} stale item(s) (>90 days) available for optional review`,
      "Review Stale Items",
      "OK",
    );
    if (result === "Review Stale Items") {
      const candidatesPath = path.join(
        rootPath,
        ".github",
        "MIGRATION-CANDIDATES.md",
      );
      if (await fs.pathExists(candidatesPath)) {
        const doc = await vscode.workspace.openTextDocument(candidatesPath);
        await vscode.window.showTextDocument(doc);
      }
    }
  } else {
    await vscode.window.showInformationMessage(
      base + "All your work preserved automatically!",
      "OK",
    );
  }
}

/**
 * Main upgrade function - follows the plan
 */
export async function upgradeArchitecture(
  context: vscode.ExtensionContext,
): Promise<void> {
  const workspaceResult = await getAlexWorkspaceFolder(true);

  if (!workspaceResult.found) {
    if (workspaceResult.cancelled) {
      return;
    }
    const result = await vscode.window.showWarningMessage(
      workspaceResult.error || "Alex is not installed in this workspace.",
      "Initialize Alex Now",
      "Cancel",
    );
    if (result === "Initialize Alex Now") {
      await initializeArchitecture(context);
    }
    return;
  }

  const rootPath = workspaceResult.rootPath!;
  const extensionPath = context.extensionPath;

  const canProceed = await checkProtectionAndWarn(
    rootPath,
    "Alex: Upgrade",
    true,
  );
  if (!canProceed) {
    return;
  }

  // Upgrade policy gate
  const policy = await readUpgradePolicy(rootPath);
  if (policy.mode === "locked") {
    vscode.window.showWarningMessage(
      `Upgrade blocked: this workspace has upgradePolicy "locked"` +
        (policy.reason ? ` (${policy.reason})` : "") +
        `.\n\nTo unlock, edit .github/config/alex-manifest.json and change "mode" to "auto" or remove upgradePolicy.`,
      { modal: true },
    );
    return;
  }
  if (policy.mode === "prompt") {
    const proceed = await vscode.window.showWarningMessage(
      `This workspace has upgradePolicy "prompt"` +
        (policy.reason ? `: ${policy.reason}` : "") +
        `.\n\nAre you sure you want to upgrade?`,
      { modal: true },
      "Upgrade Anyway",
      "Cancel",
    );
    if (proceed !== "Upgrade Anyway") {
      return;
    }
  }

  const packageJson = await fs.readJson(
    path.join(extensionPath, "package.json"),
  );
  const extensionVersion = packageJson.version || "0.0.0";
  const detection = await detectLegacyStructure(rootPath);

  if (detection.installedVersion === extensionVersion) {
    const choice = await vscode.window.showInformationMessage(
      `Alex is already at v${extensionVersion}.\n\n` +
        'Choose "Force Repair" to re-deploy architecture files (fixes corrupted installations).',
      { modal: true },
      "Force Repair",
      "OK",
    );
    if (choice !== "Force Repair") {
      return;
    }
  }

  const confirmed = await confirmUpgradeDialog(
    detection,
    extensionVersion,
    extensionPath,
  );
  if (!confirmed) {
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  try {
    const stats = await executeUpgradePhases(
      rootPath,
      extensionPath,
      detection,
      timestamp,
      extensionVersion,
    );
    const postResult = await runPostUpgradeTasks(context, rootPath);
    await showUpgradeCompletion(
      rootPath,
      detection,
      extensionVersion,
      stats,
      postResult,
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      `Upgrade failed: ${errorMessage}\n\nYour backup is safe in archive/upgrades/`,
      { modal: true },
    );
  }
}
