/**
 * upgradeGapAnalysis.ts — Gap Analysis for Architecture Upgrades
 *
 * Extracted from upgrade.ts to reduce file size.
 * Compares backup to new install and finds migration candidates.
 */
import * as fs from "fs-extra";
import * as path from "path";
import type { LegacyDetection, MigrationCandidate } from "./upgrade";

/** Stale threshold: items not modified in >90 days need manual review */
const STALE_THRESHOLD_MS = 90 * 24 * 60 * 60 * 1000;

/** NASA R1: Bounded recursion with maxDepth */
const MAX_WALK_DEPTH = 10;

/**
 * Compare backup to new install and find migration candidates
 */
export async function runGapAnalysis(
  backupPath: string,
  rootPath: string,
  _detection: LegacyDetection,
): Promise<MigrationCandidate[]> {
  const candidates: MigrationCandidate[] = [];
  const now = new Date();

  // 1. Legacy DK files (from root)
  const rootDKPath = path.join(backupPath, "root-dk-files");
  if (await fs.pathExists(rootDKPath)) {
    const files = await fs.readdir(rootDKPath);
    for (const file of files) {
      const filePath = path.join(rootDKPath, file);
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, "utf8");
      const firstLine =
        content
          .replace(/\r\n/g, "\n")
          .split("\n")
          .find((l) => l.startsWith("#"))
          ?.replace(/^#+\s*/, "") || file;

      candidates.push({
        type: "legacy-dk",
        sourcePath: `root-dk-files/${file}`,
        targetPath: `.github/skills/${file.replace("DK-", "").replace(".md", "").toLowerCase()}/SKILL.md`,
        description: firstLine,
        sizeKB: Math.round(stats.size / 1024),
        lastModified: stats.mtime,
        recommended: true,
        stale: now.getTime() - stats.mtime.getTime() > STALE_THRESHOLD_MS,
      });
    }
  }

  // 2. DK files from .github/domain-knowledge
  const dkBackupPath = path.join(backupPath, ".github", "domain-knowledge");
  if (await fs.pathExists(dkBackupPath)) {
    const files = await fs.readdir(dkBackupPath);
    for (const file of files) {
      if (!file.endsWith(".md")) {
        continue;
      }

      const filePath = path.join(dkBackupPath, file);
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, "utf8");
      const firstLine =
        content
          .replace(/\r\n/g, "\n")
          .split("\n")
          .find((l) => l.startsWith("#"))
          ?.replace(/^#+\s*/, "") || file;

      candidates.push({
        type: "user-dk",
        sourcePath: `.github/domain-knowledge/${file}`,
        targetPath: `.github/skills/${file.replace("DK-", "").replace(".md", "").toLowerCase()}/SKILL.md`,
        description: firstLine,
        sizeKB: Math.round(stats.size / 1024),
        lastModified: stats.mtime,
        recommended: true,
        stale: now.getTime() - stats.mtime.getTime() > STALE_THRESHOLD_MS,
      });
    }
  }

  // 3. User-created skills
  const skillsBackupPath = path.join(backupPath, ".github", "skills");
  const skillsNewPath = path.join(rootPath, ".github", "skills");

  if (await fs.pathExists(skillsBackupPath)) {
    const backupEntries = await fs.readdir(skillsBackupPath, {
      withFileTypes: true,
    });
    const backupSkills = backupEntries
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    const newEntries = (await fs.pathExists(skillsNewPath))
      ? await fs.readdir(skillsNewPath, { withFileTypes: true })
      : [];
    const newSkills = newEntries
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    for (const skill of backupSkills) {
      if (!newSkills.includes(skill)) {
        const skillPath = path.join(skillsBackupPath, skill);
        const stats = await fs.stat(skillPath);

        // Read SKILL.md for description
        const skillMdPath = path.join(skillPath, "SKILL.md");
        let description = skill;
        if (await fs.pathExists(skillMdPath)) {
          const content = await fs.readFile(skillMdPath, "utf8");
          description =
            content
              .replace(/\r\n/g, "\n")
              .split("\n")
              .find((l) => l.startsWith("#"))
              ?.replace(/^#+\s*/, "") || skill;
        }

        candidates.push({
          type: "user-skill",
          sourcePath: `.github/skills/${skill}`,
          targetPath: `.github/skills/${skill}`,
          description,
          sizeKB: await getFolderSize(skillPath),
          lastModified: stats.mtime,
          recommended: true,
          stale: now.getTime() - stats.mtime.getTime() > STALE_THRESHOLD_MS,
        });
      }
    }
  }

  // 4. User profile (migrate to AI-Memory if found in backup)
  const profilePath = path.join(
    backupPath,
    ".github",
    "config",
    "user-profile.json",
  );
  if (await fs.pathExists(profilePath)) {
    const stats = await fs.stat(profilePath);
    candidates.push({
      type: "profile",
      sourcePath: ".github/config/user-profile.json",
      targetPath: ".github/config/user-profile.json",
      description:
        "Your preferences (will migrate to AI-Memory if not already there)",
      sizeKB: Math.round(stats.size / 1024),
      lastModified: stats.mtime,
      recommended: true,
      stale: false,
    });
  }

  // 5. Episodic records (always recommend)
  const episodicBackupPath = path.join(backupPath, ".github", "episodic");
  if (await fs.pathExists(episodicBackupPath)) {
    const entries = await fs.readdir(episodicBackupPath, {
      withFileTypes: true,
    });
    const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".md"));
    const subdirs = entries.filter((e) => e.isDirectory());

    if (mdFiles.length > 0 || subdirs.length > 0) {
      const stats = await fs.stat(episodicBackupPath);
      const parts: string[] = [];
      if (mdFiles.length > 0) {
        parts.push(`${mdFiles.length} session record(s)`);
      }
      if (subdirs.length > 0) {
        parts.push(`${subdirs.length} subsystem(s)`);
      }

      candidates.push({
        type: "episodic",
        sourcePath: ".github/episodic",
        targetPath: ".github/episodic",
        description: parts.join(", "),
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
export async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0;

  async function walk(dir: string, depth: number = 0) {
    if (depth >= MAX_WALK_DEPTH) {
      console.warn(`[NASA] Max walk depth reached at: ${dir}`);
      return;
    }
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) {
      totalSize += stat.size;
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
