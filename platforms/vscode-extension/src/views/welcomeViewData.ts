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
import {
  MindTabData,
  SkillInfo,
  Nudge,
  TokenStatusInfo,
  SettingsToggle,
} from "./welcomeViewHtml";
import { getTokenStatuses, TOKEN_CONFIGS } from "../services/secretsManager";

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

/**
 * Collect token status information for the Settings tab.
 */
export function collectTokenStatuses(): TokenStatusInfo[] {
  try {
    const statuses = getTokenStatuses();
    return Object.entries(TOKEN_CONFIGS).map(([name, config]) => ({
      name,
      displayName: config.displayName,
      isSet: !!statuses[name],
    }));
  } catch {
    return [];
  }
}

/**
 * Collect current VS Code settings toggles snapshot for the Settings tab.
 */
export function collectSettingsToggles(): SettingsToggle[] {
  const chatCfg = vscode.workspace.getConfiguration("chat");
  const copilotChatCfg = vscode.workspace.getConfiguration(
    "github.copilot.chat",
  );
  return [
    // Copilot Power Settings
    {
      key: "chat.autopilot.enabled",
      label: "Autopilot Mode",
      enabled: chatCfg.get<boolean>("autopilot.enabled", false),
      group: "Copilot Power",
      tooltip:
        "Let Copilot run tools and make edits without asking for approval each time",
    },
    {
      key: "github.copilot.chat.copilotMemory.enabled",
      label: "Copilot Memory",
      enabled: copilotChatCfg.get<boolean>("copilotMemory.enabled", false),
      group: "Copilot Power",
      tooltip:
        "Persist conversation context and preferences across sessions",
    },
    {
      key: "chat.mcp.gallery.enabled",
      label: "MCP Gallery",
      enabled: chatCfg.get<boolean>("mcp.gallery.enabled", false),
      group: "Copilot Power",
      tooltip:
        "Browse and install Model Context Protocol servers from the gallery",
    },
    {
      key: "github.copilot.chat.searchSubagent.enabled",
      label: "Search Subagent",
      enabled: copilotChatCfg.get<boolean>("searchSubagent.enabled", false),
      group: "Copilot Power",
      tooltip:
        "Allow agents to spawn a fast search subagent for codebase exploration",
    },
    {
      key: "chat.requestQueuing.enabled",
      label: "Request Queuing",
      enabled: chatCfg.get<boolean>("requestQueuing.enabled", false),
      group: "Copilot Power",
      tooltip:
        "Queue multiple chat requests instead of waiting for each to finish",
    },
    {
      key: "github.copilot.chat.agent.thinkingTool",
      label: "Thinking Tool",
      enabled: copilotChatCfg.get<boolean>("agent.thinkingTool", false),
      group: "Copilot Power",
      tooltip:
        "Give agents a dedicated tool for structured reasoning before acting",
    },
    {
      key: "chat.customAgentInSubagent.enabled",
      label: "Agents in Subagents",
      enabled: chatCfg.get<boolean>("customAgentInSubagent.enabled", false),
      group: "Copilot Power",
      tooltip:
        "Allow custom agents (like Alex) to be invoked inside subagent calls",
    },
    // Agent Capabilities
    {
      key: "chat.tools.autoRun",
      label: "Auto-Run Tools",
      enabled: chatCfg.get<boolean>("tools.autoRun", false),
      group: "Agent Capabilities",
      tooltip: "Automatically execute tools without confirmation prompts",
    },
    {
      key: "chat.tools.fileSystem.autoApprove",
      label: "Auto-Approve Files",
      enabled: chatCfg.get<boolean>("tools.fileSystem.autoApprove", false),
      group: "Agent Capabilities",
      tooltip: "Skip confirmation when agents create or edit files",
    },
    {
      key: "chat.hooks.enabled",
      label: "Agent Hooks",
      enabled: chatCfg.get<boolean>("hooks.enabled", false),
      group: "Agent Capabilities",
      tooltip:
        "Run pre/post scripts around agent actions (e.g., lint after edit)",
    },
    {
      key: "chat.useCustomAgentHooks",
      label: "Agent-Scoped Hooks",
      enabled: chatCfg.get<boolean>("useCustomAgentHooks", false),
      group: "Agent Capabilities",
      tooltip: "Use project-level hooks defined in .github/hooks.json",
    },
    {
      key: "chat.restoreLastPanelSession",
      label: "Restore Last Session",
      enabled: chatCfg.get<boolean>("restoreLastPanelSession", false),
      group: "Agent Capabilities",
      tooltip: "Reopen the last chat session when VS Code starts",
    },
  ];
}
