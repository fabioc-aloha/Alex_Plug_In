/**
 * welcomeViewData.ts — Data collection helpers for the Welcome View
 *
 * Extracted from welcomeView.ts to reduce file size.
 * These are pure data-collection functions that read from disk/config.
 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { HealthCheckResult } from "../shared/healthCheck";
import { MindTabData, SkillInfo, Nudge } from "./welcomeViewHtml";

/**
 * Collect Mind tab data from workspace.
 * Accepts pre-collected agent/skill counts to avoid redundant disk reads.
 */
export async function collectMindData(
  wsRoot: string | undefined,
  lastDreamDate: Date | null,
  health: HealthCheckResult,
  agentCount: number,
  skillCount: number,
  globalStorageFsPath: string | undefined,
): Promise<MindTabData> {
  const data: MindTabData = {
    skillCount,
    instructionCount: 0,
    promptCount: 0,
    agentCount,
    episodicCount: 0,
    chatMemoryLines: 0,
    synapseHealthPct:
      health.totalSynapses > 0
        ? Math.round(
            ((health.totalSynapses - health.brokenSynapses) /
              health.totalSynapses) *
              100,
          )
        : 0,
    lastDreamDate: lastDreamDate
      ? lastDreamDate.toISOString().slice(0, 10)
      : null,
    lastMeditationDate: null,
    meditationCount: 0,
  };

  if (!wsRoot) {
    return data;
  }

  const githubPath = path.join(wsRoot, ".github");
  try {
    // Only count modalities not already provided
    const instDir = path.join(githubPath, "instructions");
    if (fs.existsSync(instDir)) {
      data.instructionCount = fs
        .readdirSync(instDir)
        .filter((f) => f.endsWith(".instructions.md")).length;
    }
    const promptDir = path.join(githubPath, "prompts");
    if (fs.existsSync(promptDir)) {
      data.promptCount = fs
        .readdirSync(promptDir)
        .filter((f) => f.endsWith(".prompt.md")).length;
    }
    const episodicDir = path.join(githubPath, "episodic");
    if (fs.existsSync(episodicDir)) {
      const episodicFiles = fs
        .readdirSync(episodicDir)
        .filter((f) => f.endsWith(".md"));
      data.episodicCount = episodicFiles.length;
      // Find last meditation date from episodic
      const medFiles = episodicFiles
        .filter((f) => f.startsWith("meditation-"))
        .sort()
        .reverse();
      data.meditationCount = medFiles.length;
      if (medFiles.length > 0) {
        const match = medFiles[0].match(/meditation-(\d{4}-\d{2}-\d{2})/);
        if (match) {
          data.lastMeditationDate = match[1];
        }
      }
    }
    // Count lines in Copilot Chat user memory files
    try {
      // Derive sibling globalStorage path for github.copilot-chat from our own globalStorageUri
      const memDir = globalStorageFsPath
        ? path.join(
            path.dirname(globalStorageFsPath),
            "github.copilot-chat",
            "memory-tool",
            "memories",
          )
        : undefined;
      if (memDir && fs.existsSync(memDir)) {
        let totalLines = 0;
        for (const f of fs
          .readdirSync(memDir)
          .filter((f) => f.endsWith(".md"))) {
          totalLines += fs
            .readFileSync(path.join(memDir, f), "utf-8")
            .replace(/\r\n/g, "\n")
            .split("\n").length;
        }
        data.chatMemoryLines = totalLines;
      }
    } catch {
      /* non-fatal */
    }
  } catch (err) {
    console.error(
      "[Alex][WelcomeView] collectMindData failed (non-fatal):",
      err,
    );
  }
  return data;
}

/**
 * Count agents on disk for Mind tab display
 */
export function countAgents(wsRoot: string | undefined): number {
  if (!wsRoot) {
    return 0;
  }
  const agentDir = path.join(wsRoot, ".github", "agents");
  if (!fs.existsSync(agentDir)) {
    return 0;
  }
  try {
    return fs.readdirSync(agentDir).filter((f) => f.endsWith(".agent.md"))
      .length;
  } catch {
    return 0;
  }
}

/**
 * Collect installed skill summaries
 */
export function collectSkills(wsRoot: string | undefined): SkillInfo[] {
  const skills: SkillInfo[] = [];
  if (!wsRoot) {
    return skills;
  }

  const skillsDir = path.join(wsRoot, ".github", "skills");
  if (!fs.existsSync(skillsDir)) {
    return skills;
  }

  try {
    const dirs = fs.readdirSync(skillsDir).filter((d) => {
      const fullPath = path.join(skillsDir, d);
      return (
        fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, "SKILL.md"))
      );
    });

    for (const dir of dirs) {
      const synapsePath = path.join(skillsDir, dir, "synapses.json");
      let description = "";
      let category = "general";

      // Read description from synapses.json if available
      if (fs.existsSync(synapsePath)) {
        try {
          const synapses = JSON.parse(fs.readFileSync(synapsePath, "utf8"));
          description = synapses.description || "";
          category = synapses.category || "general";
        } catch {
          /* skip */
        }
      }

      skills.push({
        id: dir,
        displayName: dir
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        description,
        category,
        hasSynapses: fs.existsSync(synapsePath),
      });
    }
  } catch (err) {
    console.error(
      "[Alex][WelcomeView] collectSkills failed (non-fatal):",
      err,
    );
  }
  return skills.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * Get the last dream report date from episodic folder
 */
export async function getLastDreamDate(): Promise<Date | null> {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return null;
    }

    const episodicPath = path.join(
      workspaceFolders[0].uri.fsPath,
      ".github",
      "episodic",
    );
    if (!fs.existsSync(episodicPath)) {
      return null;
    }

    const files = fs
      .readdirSync(episodicPath)
      .filter((f) => f.startsWith("dream-report-") && f.endsWith(".md"))
      .sort()
      .reverse();

    if (files.length === 0) {
      return null;
    }

    // Parse timestamp from filename: dream-report-1738456789123.md
    const match = files[0].match(/dream-report-(\d+)\.md/);
    if (match) {
      return new Date(parseInt(match[1], 10));
    }
  } catch {
    // Silent fail - not critical
  }
  return null;
}

/**
 * Generate contextual nudges based on current state
 * Returns max 3 nudges (mission + up to 2 contextual)
 */
export function generateNudges(
  _health: HealthCheckResult,
  _lastDreamDate: Date | null,
  workspaceName?: string,
): Nudge[] {
  const nudges: Nudge[] = [];
  if (workspaceName) {
    nudges.push({
      type: "tip",
      icon: "🗂️",
      message: `Workspace: ${workspaceName}`,
      priority: 5,
    });
  }

  // Sort by priority and return top 3 (mission + up to 2 contextual)
  return nudges.sort((a, b) => a.priority - b.priority).slice(0, 3);
}
