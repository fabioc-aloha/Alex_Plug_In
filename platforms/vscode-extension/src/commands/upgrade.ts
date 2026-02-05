/**
 * Alex Upgrade Command - v2 (Plan-Based Implementation)
 * 
 * Follows UPGRADE-MIGRATION-PLAN.md:
 * Phase 1: Backup + Fresh Install
 * Phase 2: Gap Analysis + Migration Candidates
 * 
 * Philosophy: "Backup → Fresh Install → Gap Analysis → User Decides"
 */

import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as crypto from "crypto";
import { getAlexWorkspaceFolder, checkProtectionAndWarn } from "../shared/utils";
import { runDreamProtocol } from "./dream";
import { offerEnvironmentSetup } from "./setupEnvironment";
import { initializeArchitecture } from "./initialize";

// ============================================================================
// TYPES
// ============================================================================

type LegacyVersion = 'legacy' | 'transitional' | 'current' | 'unknown';

interface LegacyDetection {
  version: LegacyVersion;
  dkLocations: string[];  // All places where DK files were found
  hasSkills: boolean;
  manifestLocation: string | null;
  installedVersion: string | null;
}

interface MigrationCandidate {
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
  } catch {
    // Ignore errors reading root
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
  } catch {
    // Ignore errors
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
  } catch {
    // Ignore errors
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
        /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/,           // Standard: **Version**: 3.7.6
        /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)-[\w-]+/,    // With suffix: **Version**: 3.5.3-PENT-TRI
        /Version:\s*(\d+\.\d+\.\d+)/i,                  // Plain: Version: 3.7.6
      ];
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          result.installedVersion = match[1];
          break;
        }
      }
    } catch {
      // Ignore
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
    } catch {
      // Ignore
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
    { src: 'copilot-instructions.md', dest: 'copilot-instructions.md' },
    { src: 'instructions', dest: 'instructions' },
    { src: 'prompts', dest: 'prompts' },
    { src: 'episodic', dest: 'episodic' },
    { src: 'config', dest: 'config' },
    { src: 'agents', dest: 'agents' },
    { src: 'skills', dest: 'skills' },
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
    files: {} as Record<string, { type: string; checksum: string }>,
  };

  // Calculate checksums for system files
  const githubPath = path.join(rootPath, '.github');
  const systemFiles = await collectSystemFiles(githubPath);

  for (const file of systemFiles) {
    const content = await fs.readFile(file, 'utf8');
    const relativePath = path.relative(rootPath, file).replace(/\\/g, '/');
    manifest.files[relativePath] = {
      type: 'system',
      checksum: crypto.createHash('md5').update(content.replace(/\r\n/g, '\n')).digest('hex'),
    };
  }

  const manifestPath = path.join(rootPath, '.github', 'config', 'alex-manifest.json');
  await fs.ensureDir(path.dirname(manifestPath));
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

/**
 * Collect all system files for manifest
 */
async function collectSystemFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string) {
    if (!await fs.pathExists(currentDir)) return;
    
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.json')) {
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
  const staleThreshold = 90 * 24 * 60 * 60 * 1000; // 90 days

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
        stale: (now.getTime() - stats.mtime.getTime()) > staleThreshold,
      });
    }
  }

  // 2. DK files from .github/domain-knowledge
  const dkBackupPath = path.join(backupPath, '.github', 'domain-knowledge');
  if (await fs.pathExists(dkBackupPath)) {
    const files = await fs.readdir(dkBackupPath);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
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
        stale: (now.getTime() - stats.mtime.getTime()) > staleThreshold,
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
          stale: (now.getTime() - stats.mtime.getTime()) > staleThreshold,
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

  const profileMdPath = path.join(backupPath, '.github', 'config', 'USER-PROFILE.md');
  if (await fs.pathExists(profileMdPath)) {
    const stats = await fs.stat(profileMdPath);
    candidates.push({
      type: 'profile',
      sourcePath: '.github/config/USER-PROFILE.md',
      targetPath: '.github/config/USER-PROFILE.md',
      description: 'Your profile document',
      sizeKB: Math.round(stats.size / 1024),
      lastModified: stats.mtime,
      recommended: true,
      stale: false,
    });
  }

  // 5. Episodic records (always recommend)
  const episodicBackupPath = path.join(backupPath, '.github', 'episodic');
  if (await fs.pathExists(episodicBackupPath)) {
    const files = await fs.readdir(episodicBackupPath);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    if (mdFiles.length > 0) {
      const stats = await fs.stat(episodicBackupPath);
      candidates.push({
        type: 'episodic',
        sourcePath: '.github/episodic',
        targetPath: '.github/episodic',
        description: `${mdFiles.length} session records (meditation, dreams)`,
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
 */
async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0;

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
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
// MIGRATION CANDIDATES DOCUMENT
// ============================================================================

/**
 * Generate the MIGRATION-CANDIDATES.md document
 */
async function generateMigrationCandidates(
  rootPath: string,
  backupPath: string,
  candidates: MigrationCandidate[],
  detection: LegacyDetection,
  newVersion: string
): Promise<string> {
  const timestamp = new Date().toISOString().split('T')[0];
  const relativeBackupPath = path.relative(rootPath, backupPath).replace(/\\/g, '/');

  let content = `# Migration Candidates

> Generated by Alex Upgrade on ${timestamp}
> Review and check items you want to migrate from your previous installation.
>
> **Previous version:** ${detection.installedVersion || 'unknown'} (${detection.version} structure)
> **New version:** ${newVersion}

## Instructions

1. Review each section below
2. Check the boxes \`[x]\` for items you want to keep
3. Run **"Alex: Complete Migration"** when ready
4. Or manually copy files from \`${relativeBackupPath}/\`

---

`;

  // Group candidates by type
  const legacyDK = candidates.filter(c => c.type === 'legacy-dk');
  const userDK = candidates.filter(c => c.type === 'user-dk');
  const userSkills = candidates.filter(c => c.type === 'user-skill');
  const profiles = candidates.filter(c => c.type === 'profile');
  const episodic = candidates.filter(c => c.type === 'episodic');

  // Legacy DK section
  if (legacyDK.length > 0) {
    content += `## 🏛️ Legacy Domain Knowledge (from project root)

These DK files were in your project root. They can be converted to skills:

`;
    for (const c of legacyDK) {
      const staleWarning = c.stale ? ' ⚠️ Stale (>90 days)' : '';
      const checked = c.recommended && !c.stale ? 'x' : ' ';
      content += `- [${checked}] \`${c.sourcePath}\` → \`${c.targetPath}\`${staleWarning}\n`;
      content += `  - ${c.description} (${c.sizeKB} KB)\n\n`;
    }
  }

  // User DK section
  if (userDK.length > 0) {
    content += `## 📚 Domain Knowledge Files

These DK files can be converted to skills:

`;
    for (const c of userDK) {
      const staleWarning = c.stale ? ' ⚠️ Stale (>90 days)' : '';
      const checked = c.recommended && !c.stale ? 'x' : ' ';
      content += `- [${checked}] \`${c.sourcePath}\` → \`${c.targetPath}\`${staleWarning}\n`;
      content += `  - ${c.description} (${c.sizeKB} KB)\n\n`;
    }
  }

  // User Skills section
  if (userSkills.length > 0) {
    content += `## 🎓 User-Created Skills

These skills were created by you and don't exist in the new version:

`;
    for (const c of userSkills) {
      const staleWarning = c.stale ? ' ⚠️ Stale (>90 days)' : '';
      const checked = c.recommended && !c.stale ? 'x' : ' ';
      content += `- [${checked}] \`${c.sourcePath}/\`${staleWarning}\n`;
      content += `  - ${c.description} (${c.sizeKB} KB)\n\n`;
    }
  }

  // Profile section
  if (profiles.length > 0) {
    content += `## 👤 User Profile

Your personal settings and preferences:

`;
    for (const c of profiles) {
      content += `- [x] \`${c.sourcePath}\` — ${c.description}\n`;
    }
    content += '\n';
  }

  // Episodic section
  if (episodic.length > 0) {
    content += `## 📜 Session History

Your meditation sessions, dream reports, and other episodic records:

`;
    for (const c of episodic) {
      content += `- [x] \`${c.sourcePath}/\` — ${c.description} (${c.sizeKB} KB)\n`;
    }
    content += '\n';
  }

  // Backup location
  content += `---

## Backup Location

All original files available at:
\`${relativeBackupPath}/\`

You can manually copy any files from this location.

## Need Help?

Ask Alex: "Help me migrate my previous settings"
`;

  const candidatesPath = path.join(rootPath, '.github', 'MIGRATION-CANDIDATES.md');
  await fs.writeFile(candidatesPath, content, 'utf8');

  return candidatesPath;
}

// ============================================================================
// MAIN UPGRADE COMMAND
// ============================================================================

/**
 * Main upgrade function - follows the plan
 */
export async function upgradeArchitecture(context: vscode.ExtensionContext): Promise<void> {
  // Get workspace
  const workspaceResult = await getAlexWorkspaceFolder(true);

  if (!workspaceResult.found) {
    if (workspaceResult.cancelled) return;

    const result = await vscode.window.showWarningMessage(
      workspaceResult.error || "Alex is not installed in this workspace.",
      "Initialize Alex Now",
      "Cancel"
    );

    if (result === "Initialize Alex Now") {
      // Call function directly instead of command to avoid lock conflict
      // (upgradeArchitecture already holds the operation lock)
      await initializeArchitecture(context);
    }
    return;
  }

  const rootPath = workspaceResult.rootPath!;
  const extensionPath = context.extensionPath;

  // Kill switch check
  const canProceed = await checkProtectionAndWarn(rootPath, "Alex: Upgrade", true);
  if (!canProceed) return;

  // Get versions
  const packageJson = await fs.readJson(path.join(extensionPath, 'package.json'));
  const extensionVersion = packageJson.version || '0.0.0';

  // Detect legacy structure
  const detection = await detectLegacyStructure(rootPath);

  // Check if already at latest version
  if (detection.installedVersion === extensionVersion) {
    await vscode.window.showInformationMessage(
      `✅ Alex is already at the latest version (v${extensionVersion}).\n\n` +
      'No upgrade needed. Your cognitive architecture is up to date!',
      { modal: true },
      'OK'
    );
    return;
  }

  // Confirm upgrade (loop to allow viewing What's New and returning to dialog)
  const versionInfo = detection.installedVersion 
    ? `v${detection.installedVersion} → v${extensionVersion}`
    : `${detection.version} structure → v${extensionVersion}`;

  let confirm: string | undefined;
  while (true) {
    confirm = await vscode.window.showInformationMessage(
      `🔄 Upgrade: ${versionInfo}\n\n` +
      "This upgrade will:\n\n" +
      "1️⃣ Backup everything (nothing is lost)\n" +
      "2️⃣ Fresh install of new version\n" +
      "3️⃣ Show you what can be migrated\n" +
      "4️⃣ You decide what to keep\n\n" +
      "Your data is safe - review and migrate at your pace.",
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
      // Continue loop to show dialog again
      continue;
    }
    
    // Exit loop for Start Upgrade or Cancel
    break;
  }

  if (confirm !== "Start Upgrade") return;

  // Execute upgrade
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // Variables to capture from progress callback
  let upgradeBackupPath = '';
  let upgradeCandidates: MigrationCandidate[] = [];

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Upgrading Alex...",
        cancellable: false,
      },
      async (progress) => {
        // Step 1: Backup
        progress.report({ message: "Creating backup...", increment: 20 });
        const backupPath = await createVersionAwareBackup(rootPath, detection, timestamp);
        upgradeBackupPath = backupPath; // Capture for use after callback

        // Step 2: Clean old structure
        progress.report({ message: "Cleaning old installation...", increment: 20 });
        await cleanOldStructure(rootPath, detection);

        // Step 3: Fresh install
        progress.report({ message: "Installing new version...", increment: 20 });
        await freshInstall(extensionPath, rootPath);

        // Step 4: Gap analysis
        progress.report({ message: "Analyzing migration candidates...", increment: 20 });
        const candidates = await runGapAnalysis(backupPath, rootPath, detection);
        upgradeCandidates = candidates; // Capture for use after callback

        // Step 5: Generate migration candidates document
        progress.report({ message: "Generating migration guide...", increment: 20 });
        
        if (candidates.length > 0) {
          const candidatesPath = await generateMigrationCandidates(
            rootPath,
            backupPath,
            candidates,
            detection,
            extensionVersion
          );

          // Auto-restore profile and episodic (recommended)
          const autoRestore = candidates.filter(c => 
            (c.type === 'profile' || c.type === 'episodic') && c.recommended
          );

          for (const item of autoRestore) {
            const src = path.join(backupPath, item.sourcePath);
            const dest = path.join(rootPath, item.targetPath);
            if (await fs.pathExists(src)) {
              await fs.copy(src, dest, { overwrite: true });
            }
          }
        }
      }
    );

    // Run Dream to validate
    let dreamSuccess = false;
    try {
      const dreamResult = await runDreamProtocol(context, { silent: true });
      dreamSuccess = dreamResult?.success ?? false;
    } catch {
      // Dream failure is not fatal
    }

    // Offer environment setup
    await offerEnvironmentSetup();

    // Use candidates captured from progress callback (no redundant re-computation)
    const userCandidates = upgradeCandidates.filter(c => c.type !== 'profile' && c.type !== 'episodic');

    // Show completion message
    const healthIcon = dreamSuccess ? '💚' : '⚠️';
    const healthText = dreamSuccess ? 'healthy' : 'needs attention';
    
    if (userCandidates.length > 0) {
      const result = await vscode.window.showInformationMessage(
        `✅ Upgrade Complete! v${detection.installedVersion || 'unknown'} → v${extensionVersion}\n\n` +
        `${healthIcon} Health: ${healthText} • 👤 Profile restored\n` +
        `📋 ${userCandidates.length} custom item(s) need your review`,
        "Review Items",
        "OK"
      );

      if (result === "Review Items") {
        const candidatesPath = path.join(rootPath, '.github', 'MIGRATION-CANDIDATES.md');
        const doc = await vscode.workspace.openTextDocument(candidatesPath);
        await vscode.window.showTextDocument(doc);
      }
    } else {
      await vscode.window.showInformationMessage(
        `✅ Upgrade Complete! v${detection.installedVersion || 'unknown'} → v${extensionVersion}\n\n` +
        `${healthIcon} Health: ${healthText} • 👤 Profile restored\n` +
        `No migration needed - you're all set!`,
        "OK"
      );
    }

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      `Upgrade failed: ${errorMessage}\n\n` +
      "Your backup is safe in archive/upgrades/",
      { modal: true }
    );
  }
}

// ============================================================================
// COMPLETE MIGRATION COMMAND
// ============================================================================

/**
 * Process checked items from MIGRATION-CANDIDATES.md
 */
export async function completeMigration(context: vscode.ExtensionContext): Promise<void> {
  const workspaceResult = await getAlexWorkspaceFolder(true);
  if (!workspaceResult.found) {
    vscode.window.showErrorMessage("No workspace with Alex found.");
    return;
  }

  const rootPath = workspaceResult.rootPath!;
  const candidatesPath = path.join(rootPath, '.github', 'MIGRATION-CANDIDATES.md');

  if (!await fs.pathExists(candidatesPath)) {
    vscode.window.showInformationMessage(
      "No migration candidates found. Run 'Alex: Upgrade' first if you need to migrate.",
      "OK"
    );
    return;
  }

  const content = await fs.readFile(candidatesPath, 'utf8');
  
  // Parse checked items: - [x] `path`
  const checkedPattern = /- \[x\] `([^`]+)`/gi;
  const checkedItems: string[] = [];
  let match;
  
  while ((match = checkedPattern.exec(content)) !== null) {
    checkedItems.push(match[1]);
  }

  if (checkedItems.length === 0) {
    const result = await vscode.window.showInformationMessage(
      "No items are checked for migration.\n\n" +
      "Edit MIGRATION-CANDIDATES.md and check [x] the items you want to keep, then run this command again.",
      "Open Migration Guide",
      "Delete Migration Guide",
      "Cancel"
    );

    if (result === "Open Migration Guide") {
      const doc = await vscode.workspace.openTextDocument(candidatesPath);
      await vscode.window.showTextDocument(doc);
    } else if (result === "Delete Migration Guide") {
      await fs.remove(candidatesPath);
      vscode.window.showInformationMessage("Migration guide deleted.");
    }
    return;
  }

  // Find backup path from the document
  const backupMatch = content.match(/`(archive\/upgrades\/backup-[^`]+)`/);
  if (!backupMatch) {
    vscode.window.showErrorMessage("Could not find backup path in migration document.");
    return;
  }

  const backupPath = path.join(rootPath, backupMatch[1]);
  if (!await fs.pathExists(backupPath)) {
    vscode.window.showErrorMessage(`Backup not found: ${backupMatch[1]}`);
    return;
  }

  // Confirm migration
  const confirm = await vscode.window.showInformationMessage(
    `Migrate ${checkedItems.length} item(s)?`,
    { modal: true },
    "Yes, Migrate",
    "Cancel"
  );

  if (confirm !== "Yes, Migrate") return;

  // Execute migration
  const migrated: string[] = [];
  const errors: string[] = [];

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Migrating...",
      cancellable: false,
    },
    async (progress) => {
      for (const item of checkedItems) {
        progress.report({ message: path.basename(item) });

        try {
          // Handle the → syntax for DK to skill conversion
          const arrowMatch = item.match(/^(.+?)\s*→\s*(.+)$/);
          let src: string;
          let dest: string;

          if (arrowMatch) {
            src = path.join(backupPath, arrowMatch[1].trim());
            dest = path.join(rootPath, arrowMatch[2].trim());
          } else {
            src = path.join(backupPath, item);
            dest = path.join(rootPath, item);
          }

          if (await fs.pathExists(src)) {
            await fs.ensureDir(path.dirname(dest));
            await fs.copy(src, dest, { overwrite: true });
            
            // For DK → skill migration, create a minimal synapses.json if it doesn't exist
            if (arrowMatch && dest.endsWith('SKILL.md') && dest.includes('.github/skills/')) {
              const skillDir = path.dirname(dest);
              const synapsesPath = path.join(skillDir, 'synapses.json');
              if (!await fs.pathExists(synapsesPath)) {
                // Extract skill name from directory path
                const skillName = path.basename(skillDir);
                const minimalSynapses = {
                  schemaVersion: "1.0.0",
                  skillName: skillName,
                  description: `Migrated from DK file: ${path.basename(arrowMatch[1].trim())}`,
                  connections: [],
                  activationPatterns: [],
                  metadata: {
                    migratedFrom: arrowMatch[1].trim(),
                    migratedAt: new Date().toISOString()
                  }
                };
                await fs.writeJson(synapsesPath, minimalSynapses, { spaces: 2 });
              }
            }
            
            migrated.push(item);
          } else {
            errors.push(`Not found: ${item}`);
          }
        } catch (err: any) {
          errors.push(`${item}: ${err.message}`);
        }
      }
    }
  );

  // Delete migration candidates file
  await fs.remove(candidatesPath);

  // Show results
  let message = `✅ Migration complete!\n\n` +
    `Migrated: ${migrated.length} item(s)`;

  if (errors.length > 0) {
    message += `\n⚠️ Errors: ${errors.length}`;
  }

  const result = await vscode.window.showInformationMessage(
    message,
    "Run Dream Check",
    "OK"
  );

  if (result === "Run Dream Check") {
    await vscode.commands.executeCommand("alex.dream");
  }
}

/**
 * Show migration candidates document
 */
export async function showMigrationCandidates(): Promise<void> {
  const workspaceResult = await getAlexWorkspaceFolder(true);
  if (!workspaceResult.found) {
    vscode.window.showErrorMessage("No workspace with Alex found.");
    return;
  }

  const candidatesPath = path.join(workspaceResult.rootPath!, '.github', 'MIGRATION-CANDIDATES.md');

  if (!await fs.pathExists(candidatesPath)) {
    vscode.window.showInformationMessage(
      "No migration candidates found. Run 'Alex: Upgrade' first if you need to migrate."
    );
    return;
  }

  const doc = await vscode.workspace.openTextDocument(candidatesPath);
  await vscode.window.showTextDocument(doc);
}
