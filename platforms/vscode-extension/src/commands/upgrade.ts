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
import { getAlexWorkspaceFolder, checkProtectionAndWarn } from "../shared/utils";
import { runDreamProtocol } from "./dream";
import { offerEnvironmentSetup } from "./setupEnvironment";
import { initializeArchitecture } from "./initialize";
import { detectAndUpdateProjectPersona } from "../chat/personaDetection";
import { migrateSecretsFromEnvironment } from "../services/secretsManager";
import { normalizeAllSynapses } from "./upgradeSynapseNormalization";
import { generateMigrationCandidates } from "./upgradeMigration";

// ============================================================================
// TYPES
// ============================================================================

type LegacyVersion = 'legacy' | 'transitional' | 'current' | 'unknown';

export interface LegacyDetection {
  version: LegacyVersion;
  dkLocations: string[];  // All places where DK files were found
  hasSkills: boolean;
  manifestLocation: string | null;
  installedVersion: string | null;
}

export interface MigrationCandidate {
  type: 'legacy-dk' | 'user-dk' | 'user-skill' | 'modified-system' | 'profile' | 'episodic';
  sourcePath: string;       // Path in backup
  targetPath: string;       // Path in new install
  description: string;
  sizeKB: number;
  lastModified: Date;
  recommended: boolean;
  stale: boolean;           // Not modified in > 90 days
}

interface UpgradeResult {
  success: boolean;
  backupPath: string;
  migrationCandidatesPath: string | null;
  candidateCount: number;
  errors: string[];
}

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
export const ARCHITECTURE_ROOT_FILES = ['copilot-instructions.md', 'hooks.json'];
export const ARCHITECTURE_DIRECTORIES = ['instructions', 'prompts', 'config', 'agents', 'skills', 'muscles', 'assets'];
export const ARCHITECTURE_EMPTY_FOLDERS = ['episodic'];

/** File extensions tracked in manifests */
export const MANIFEST_EXTENSIONS = ['.md', '.json', '.cjs'];

/** Stale threshold: items not modified in >90 days need manual review */
const STALE_THRESHOLD_MS = 90 * 24 * 60 * 60 * 1000;

// ============================================================================
// DETECTION
// ============================================================================

/**
 * Detect what version structure exists in the workspace
 */
async function detectLegacyStructure(rootPath: string): Promise<LegacyDetection> {
  const result: LegacyDetection = {
    version: 'unknown',
    dkLocations: [],
    hasSkills: false,
    manifestLocation: null,
    installedVersion: null,
  };

  // Check for DK files in root (legacy < 3.0)
  try {
    const rootFiles = await fs.readdir(rootPath);
    const rootDKFiles = rootFiles.filter(f => f.startsWith('DK-') && f.endsWith('.md'));
    if (rootDKFiles.length > 0) {
      result.dkLocations.push('root');
    }
  } catch (err) {
    // Ignore - non-critical
  }

  // Check for DK files in .github/ directly (some old versions)
  const githubPath = path.join(rootPath, '.github');
  try {
    if (await fs.pathExists(githubPath)) {
      const githubFiles = await fs.readdir(githubPath);
      const githubDKFiles = githubFiles.filter(f => f.startsWith('DK-') && f.endsWith('.md'));
      if (githubDKFiles.length > 0) {
        result.dkLocations.push('.github');
      }
    }
  } catch (err) {
    // Ignore - non-critical
  }

  // Check for DK files in .github/domain-knowledge/ (3.0+)
  const dkFolderPath = path.join(rootPath, '.github', 'domain-knowledge');
  try {
    if (await fs.pathExists(dkFolderPath)) {
      const dkFiles = await fs.readdir(dkFolderPath);
      if (dkFiles.some(f => f.endsWith('.md'))) {
        result.dkLocations.push('.github/domain-knowledge');
      }
    }
  } catch (err) {
    // Ignore - non-critical
  }

  // Check for skills (3.4+)
  const skillsPath = path.join(rootPath, '.github', 'skills');
  result.hasSkills = await fs.pathExists(skillsPath);

  // Check for manifest locations
  const newManifest = path.join(rootPath, '.github', 'config', 'alex-manifest.json');
  const oldManifest = path.join(rootPath, '.alex-manifest.json');

  if (await fs.pathExists(newManifest)) {
    result.manifestLocation = '.github/config/alex-manifest.json';
  } else if (await fs.pathExists(oldManifest)) {
    result.manifestLocation = '.alex-manifest.json';
  }

  // Get installed version from copilot-instructions.md
  const instructionsPath = path.join(rootPath, '.github', 'copilot-instructions.md');
  if (await fs.pathExists(instructionsPath)) {
    try {
      const content = await fs.readFile(instructionsPath, 'utf8');
      // Try multiple patterns for version detection
      const patterns = [
        /^# Alex v(\d+\.\d+\.\d+)/m,                    // v6+ ADR-010: # Alex v6.4.6
        /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,           // Legacy: **Version**: 3.7.6
        /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)-[\w-]+/,    // Legacy suffix: **Version**: 3.5.3-PENT-TRI
        /Version:\s*(\d+\.\d+\.\d+)/i,                  // Plain: Version: 3.7.6
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
  if (result.dkLocations.includes('root')) {
    result.version = 'legacy';
  } else if (result.manifestLocation === '.alex-manifest.json') {
    result.version = 'transitional';
  } else if (result.hasSkills) {
    result.version = 'current';
  } else if (result.dkLocations.length > 0) {
    result.version = 'transitional';
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
  timestamp: string
): Promise<string> {
  const versionLabel = detection.installedVersion || detection.version;
  const backupDir = path.join(
    rootPath,
    'archive',
    'upgrades',
    `backup-${versionLabel}-${timestamp}`
  );

  await fs.ensureDir(backupDir);

  // Backup .github folder
  const githubSrc = path.join(rootPath, '.github');
  if (await fs.pathExists(githubSrc)) {
    await fs.copy(githubSrc, path.join(backupDir, '.github'));
  }

  // Backup root DK files (legacy)
  if (detection.dkLocations.includes('root')) {
    const rootDKDir = path.join(backupDir, 'root-dk-files');
    await fs.ensureDir(rootDKDir);
    
    const rootFiles = await fs.readdir(rootPath);
    for (const file of rootFiles) {
      if (file.startsWith('DK-') && file.endsWith('.md')) {
        await fs.copy(
          path.join(rootPath, file),
          path.join(rootDKDir, file)
        );
      }
    }
  }

  // Backup old manifest location
  const oldManifest = path.join(rootPath, '.alex-manifest.json');
  if (await fs.pathExists(oldManifest)) {
    await fs.copy(oldManifest, path.join(backupDir, '.alex-manifest.json'));
  }

  // Save detection report
  await fs.writeJson(
    path.join(backupDir, 'detection-report.json'),
    {
      ...detection,
      backupCreatedAt: new Date().toISOString(),
    },
    { spaces: 2 }
  );

  return backupDir;
}

// ============================================================================
// CLEAN + FRESH INSTALL
// ============================================================================

/**
 * Remove old structure completely
 */
async function cleanOldStructure(rootPath: string, detection: LegacyDetection): Promise<void> {
  // Delete .github folder
  const githubPath = path.join(rootPath, '.github');
  if (await fs.pathExists(githubPath)) {
    await fs.remove(githubPath);
  }

  // Delete root DK files (legacy)
  if (detection.dkLocations.includes('root')) {
    const rootFiles = await fs.readdir(rootPath);
    for (const file of rootFiles) {
      if (file.startsWith('DK-') && file.endsWith('.md')) {
        await fs.remove(path.join(rootPath, file));
      }
    }
  }

  // Delete old manifest
  const oldManifest = path.join(rootPath, '.alex-manifest.json');
  if (await fs.pathExists(oldManifest)) {
    await fs.remove(oldManifest);
  }
}

/**
 * Install fresh from extension package
 */
async function freshInstall(extensionPath: string, rootPath: string): Promise<void> {
  const sources = [
    ...ARCHITECTURE_ROOT_FILES.map(f => ({ src: f, dest: f })),
    ...ARCHITECTURE_DIRECTORIES.map(d => ({ src: d, dest: d })),
  ];

  const extGithub = path.join(extensionPath, '.github');
  const destGithub = path.join(rootPath, '.github');

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
 */
async function createFreshManifest(extensionPath: string, rootPath: string): Promise<void> {
  const packageJson = await fs.readJson(path.join(extensionPath, 'package.json'));
  const version = packageJson.version || '0.0.0';

  const manifest = {
    version,
    installedAt: new Date().toISOString(),
    files: {} as Record<string, { type: string; originalChecksum: string }>,
  };

  // Calculate checksums for system files
  const githubPath = path.join(rootPath, '.github');
  const systemFiles = await collectSystemFiles(githubPath);

  for (const file of systemFiles) {
    const content = await fs.readFile(file, 'utf8');
    const relativePath = path.relative(rootPath, file).replace(/\\/g, '/');
    manifest.files[relativePath] = {
      type: 'system',
      originalChecksum: crypto.createHash('md5').update(content.replace(/\r\n/g, '\n')).digest('hex'),
    };
  }

  const manifestPath = path.join(rootPath, '.github', 'config', 'alex-manifest.json');
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
    if (!await fs.pathExists(currentDir)) {return;}
    
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
      } else if (MANIFEST_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

// ============================================================================
// GAP ANALYSIS
// ============================================================================

/**
 * Compare backup to new install and find migration candidates
 */
async function runGapAnalysis(
  backupPath: string,
  rootPath: string,
  detection: LegacyDetection
): Promise<MigrationCandidate[]> {
  const candidates: MigrationCandidate[] = [];
  const now = new Date();

  // 1. Legacy DK files (from root)
  const rootDKPath = path.join(backupPath, 'root-dk-files');
  if (await fs.pathExists(rootDKPath)) {
    const files = await fs.readdir(rootDKPath);
    for (const file of files) {
      const filePath = path.join(rootDKPath, file);
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, 'utf8');
      const firstLine = content.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || file;

      candidates.push({
        type: 'legacy-dk',
        sourcePath: `root-dk-files/${file}`,
        targetPath: `.github/skills/${file.replace('DK-', '').replace('.md', '').toLowerCase()}/SKILL.md`,
        description: firstLine,
        sizeKB: Math.round(stats.size / 1024),
        lastModified: stats.mtime,
        recommended: true,
        stale: (now.getTime() - stats.mtime.getTime()) > STALE_THRESHOLD_MS,
      });
    }
  }

  // 2. DK files from .github/domain-knowledge
  const dkBackupPath = path.join(backupPath, '.github', 'domain-knowledge');
  if (await fs.pathExists(dkBackupPath)) {
    const files = await fs.readdir(dkBackupPath);
    for (const file of files) {
      if (!file.endsWith('.md')) {continue;}
      
      const filePath = path.join(dkBackupPath, file);
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, 'utf8');
      const firstLine = content.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || file;

      candidates.push({
        type: 'user-dk',
        sourcePath: `.github/domain-knowledge/${file}`,
        targetPath: `.github/skills/${file.replace('DK-', '').replace('.md', '').toLowerCase()}/SKILL.md`,
        description: firstLine,
        sizeKB: Math.round(stats.size / 1024),
        lastModified: stats.mtime,
        recommended: true,
        stale: (now.getTime() - stats.mtime.getTime()) > STALE_THRESHOLD_MS,
      });
    }
  }

  // 3. User-created skills
  const skillsBackupPath = path.join(backupPath, '.github', 'skills');
  const skillsNewPath = path.join(rootPath, '.github', 'skills');
  
  if (await fs.pathExists(skillsBackupPath)) {
    const backupSkills = await fs.readdir(skillsBackupPath);
    const newSkills = await fs.pathExists(skillsNewPath) 
      ? await fs.readdir(skillsNewPath) 
      : [];

    for (const skill of backupSkills) {
      if (!newSkills.includes(skill)) {
        const skillPath = path.join(skillsBackupPath, skill);
        const stats = await fs.stat(skillPath);
        
        // Read SKILL.md for description
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        let description = skill;
        if (await fs.pathExists(skillMdPath)) {
          const content = await fs.readFile(skillMdPath, 'utf8');
          description = content.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') || skill;
        }

        candidates.push({
          type: 'user-skill',
          sourcePath: `.github/skills/${skill}`,
          targetPath: `.github/skills/${skill}`,
          description,
          sizeKB: await getFolderSize(skillPath),
          lastModified: stats.mtime,
          recommended: true,
          stale: (now.getTime() - stats.mtime.getTime()) > STALE_THRESHOLD_MS,
        });
      }
    }
  }

  // 4. User profile (always recommend)
  const profilePath = path.join(backupPath, '.github', 'config', 'user-profile.json');
  if (await fs.pathExists(profilePath)) {
    const stats = await fs.stat(profilePath);
    candidates.push({
      type: 'profile',
      sourcePath: '.github/config/user-profile.json',
      targetPath: '.github/config/user-profile.json',
      description: 'Your preferences and settings',
      sizeKB: Math.round(stats.size / 1024),
      lastModified: stats.mtime,
      recommended: true,
      stale: false,
    });
  }

  // 5. Episodic records (always recommend)
  // Includes top-level .md session records AND subdirectories:
  //   peripheral/file-observations.json, calibration/calibration-log.json, etc.
  const episodicBackupPath = path.join(backupPath, '.github', 'episodic');
  if (await fs.pathExists(episodicBackupPath)) {
    const entries = await fs.readdir(episodicBackupPath, { withFileTypes: true });
    const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md'));
    const subdirs = entries.filter(e => e.isDirectory());

    if (mdFiles.length > 0 || subdirs.length > 0) {
      const stats = await fs.stat(episodicBackupPath);
      const parts: string[] = [];
      if (mdFiles.length > 0) { parts.push(`${mdFiles.length} session record(s)`); }
      if (subdirs.length > 0) { parts.push(`${subdirs.length} subsystem(s)`); }

      candidates.push({
        type: 'episodic',
        sourcePath: '.github/episodic',
        targetPath: '.github/episodic',
        description: parts.join(', '),
        sizeKB: await getFolderSize(episodicBackupPath),
        lastModified: stats.mtime,
        recommended: true,
        stale: false,
      });
    }
  }

  return candidates;
}

/**
 * Calculate folder size in KB
 * NASA R1: Bounded recursion with maxDepth
 */
async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0;

  async function walk(dir: string, depth: number = 0) {
    if (depth >= MAX_WALK_DEPTH) {
      console.warn(`[NASA] Max walk depth reached at: ${dir}`);
      return;
    }
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
      } else {
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;
      }
    }
  }

  await walk(folderPath);
  return Math.round(totalSize / 1024);
}

// ============================================================================
// MAIN UPGRADE COMMAND
// ============================================================================

async function confirmUpgradeDialog(detection: LegacyDetection, extensionVersion: string, extensionPath: string): Promise<boolean> {
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
      "Cancel"
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
  rootPath: string, extensionPath: string, detection: LegacyDetection,
  timestamp: string, extensionVersion: string
): Promise<UpgradeStats> {
  let stats: UpgradeStats = { restoredCount: 0, normalizedCount: 0, staleCount: 0 };

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "Upgrading Alex...", cancellable: false },
    async (progress) => {
      progress.report({ message: "Creating backup...", increment: 20 });
      const backupPath = await createVersionAwareBackup(rootPath, detection, timestamp);

      progress.report({ message: "Cleaning old installation...", increment: 20 });
      await cleanOldStructure(rootPath, detection);

      progress.report({ message: "Installing new version...", increment: 20 });
      await freshInstall(extensionPath, rootPath);

      progress.report({ message: "Analyzing migration candidates...", increment: 20 });
      const candidates = await runGapAnalysis(backupPath, rootPath, detection);

      progress.report({ message: "Restoring your skills and settings...", increment: 15 });

      if (candidates.length > 0) {
        const autoRestore = candidates.filter(c => c.recommended && !c.stale);
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

        progress.report({ message: "Normalizing synapses to current schema...", increment: 5 });
        const skillsDir = path.join(rootPath, '.github', 'skills');
        let synapseNormalized = 0;
        if (await fs.pathExists(skillsDir)) {
          const synapseResult = await normalizeAllSynapses(skillsDir);
          synapseNormalized = synapseResult.normalized;
        }

        const staleItems = candidates.filter(c => c.stale);
        if (staleItems.length > 0) {
          await generateMigrationCandidates(rootPath, backupPath, staleItems, detection, extensionVersion);
        }

        stats = { restoredCount: restoredItems.length, normalizedCount: synapseNormalized, staleCount: staleItems.length };
      } else {
        const skillsDir = path.join(rootPath, '.github', 'skills');
        if (await fs.pathExists(skillsDir)) { await normalizeAllSynapses(skillsDir); }
      }
    }
  );

  return stats;
}

async function runPostUpgradeTasks(context: vscode.ExtensionContext, rootPath: string): Promise<boolean> {
  let dreamSuccess = false;
  try {
    const dreamResult = await runDreamProtocol(context, { silent: true });
    dreamSuccess = dreamResult?.success ?? false;
  } catch { /* Dream validation is optional */ }

  await offerEnvironmentSetup();

  try { await detectAndUpdateProjectPersona(rootPath, { updateSlots: false }); }
  catch { /* Persona detection is optional */ }

  try { await migrateSecretsFromEnvironment(); }
  catch (migrationErr) { console.warn("[Alex] Failed to migrate secrets:", migrationErr); }

  return dreamSuccess;
}

async function showUpgradeCompletion(
  rootPath: string, detection: LegacyDetection, extensionVersion: string,
  stats: UpgradeStats, dreamSuccess: boolean
): Promise<void> {
  const { restoredCount, normalizedCount, staleCount } = stats;
  const healthIcon = dreamSuccess ? '💚' : '⚠️';
  const healthText = dreamSuccess ? 'healthy' : 'needs attention';

  const summaryParts: string[] = [];
  if (restoredCount > 0) { summaryParts.push(`📦 ${restoredCount} item(s) restored`); }
  if (normalizedCount > 0) { summaryParts.push(`🔧 ${normalizedCount} synapse(s) normalized`); }
  const summaryLine = summaryParts.length > 0 ? summaryParts.join(' • ') : 'Fresh install';

  const base = `✅ Upgrade Complete! v${detection.installedVersion || 'unknown'} → v${extensionVersion}\n\n` +
    `${healthIcon} Health: ${healthText}\n${summaryLine}\n`;

  if (staleCount > 0) {
    const result = await vscode.window.showInformationMessage(
      base + `⏰ ${staleCount} stale item(s) (>90 days) available for optional review`,
      "Review Stale Items", "OK"
    );
    if (result === "Review Stale Items") {
      const candidatesPath = path.join(rootPath, '.github', 'MIGRATION-CANDIDATES.md');
      if (await fs.pathExists(candidatesPath)) {
        const doc = await vscode.workspace.openTextDocument(candidatesPath);
        await vscode.window.showTextDocument(doc);
      }
    }
  } else {
    await vscode.window.showInformationMessage(base + 'All your work preserved automatically!', "OK");
  }
}

/**
 * Main upgrade function - follows the plan
 */
export async function upgradeArchitecture(context: vscode.ExtensionContext): Promise<void> {
  const workspaceResult = await getAlexWorkspaceFolder(true);

  if (!workspaceResult.found) {
    if (workspaceResult.cancelled) { return; }
    const result = await vscode.window.showWarningMessage(
      workspaceResult.error || "Alex is not installed in this workspace.",
      "Initialize Alex Now", "Cancel"
    );
    if (result === "Initialize Alex Now") { await initializeArchitecture(context); }
    return;
  }

  const rootPath = workspaceResult.rootPath!;
  const extensionPath = context.extensionPath;

  const canProceed = await checkProtectionAndWarn(rootPath, "Alex: Upgrade", true);
  if (!canProceed) { return; }

  const packageJson = await fs.readJson(path.join(extensionPath, 'package.json'));
  const extensionVersion = packageJson.version || '0.0.0';
  const detection = await detectLegacyStructure(rootPath);

  if (detection.installedVersion === extensionVersion) {
    await vscode.window.showInformationMessage(
      `✅ Alex is already at the latest version (v${extensionVersion}).\n\n` +
      'No upgrade needed. Your cognitive architecture is up to date!',
      { modal: true }, 'OK'
    );
    return;
  }

  const confirmed = await confirmUpgradeDialog(detection, extensionVersion, extensionPath);
  if (!confirmed) { return; }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  try {
    const stats = await executeUpgradePhases(rootPath, extensionPath, detection, timestamp, extensionVersion);
    const dreamSuccess = await runPostUpgradeTasks(context, rootPath);
    await showUpgradeCompletion(rootPath, detection, extensionVersion, stats, dreamSuccess);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      `Upgrade failed: ${errorMessage}\n\nYour backup is safe in archive/upgrades/`,
      { modal: true }
    );
  }
}
