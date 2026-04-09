/**
 * UX Excellence Features v5.2.0
 *
 * Implements the v5.2.0 UX Excellence roadmap items:
 * - Quick Command Palette
 * - Daily Briefing
 */

import * as vscode from "vscode";
import { detectCognitiveLevel } from "../shared/cognitiveTier";

/**
 * Quick command definitions
 */
interface QuickCommand {
  label: string;
  description: string;
  command: string;
  detail?: string;
  icon: string;
}

const QUICK_COMMANDS: QuickCommand[] = [
  {
    label: "$(sparkle) Self-Actualize",
    description: "Deep architecture assessment",
    command: "alex.selfActualize",
    icon: "$(sparkle)",
  },
  {
    label: "$(pulse) Dream",
    description: "Neural maintenance",
    command: "alex.dream",
    icon: "$(pulse)",
  },
  {
    label: "$(sync) Sync Knowledge",
    description: "Sync with Global Knowledge",
    command: "alex.syncKnowledge",
    icon: "$(sync)",
  },
  {
    label: "$(calendar) Daily Briefing",
    description: "Get your daily summary",
    command: "alex.dailyBriefing",
    icon: "$(calendar)",
  },
  {
    label: "$(dashboard) Mind Dashboard",
    description: "View cognitive health & memory",
    command: "alex.showCognitiveDashboard",
    icon: "$(dashboard)",
  },
  {
    label: "$(gear) Setup Environment",
    description: "Configure workspace",
    command: "alex.setupEnvironment",
    icon: "$(gear)",
  },
];

/**
 * Initialize all UX features
 */
export function initializeUXFeatures(_context: vscode.ExtensionContext): void {
  // Detect cognitive level on activation (populates cache for welcome view badges)
  detectCognitiveLevel()
    .then(() => {
      // Refresh welcome view once detection is done so tier badges reflect actual level
      vscode.commands
        .executeCommand("alex.refreshWelcomeView")
        .then(undefined, () => {
          /* view may not exist yet */
        });
    })
    .catch(() => {
      /* non-critical */
    });
}

/**
 * Quick Commands picker
 */
export async function showQuickCommands(): Promise<void> {
  const items: vscode.QuickPickItem[] = QUICK_COMMANDS.map((cmd) => ({
    label: cmd.label,
    description: cmd.description,
    detail: cmd.detail,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "Select an Alex command...",
    title: "Alex Quick Commands",
  });

  if (selected) {
    const command = QUICK_COMMANDS.find((cmd) => cmd.label === selected.label);
    if (command) {
      await vscode.commands.executeCommand(command.command);
    }
  }
}

/**
 * Daily Briefing data structure
 */
interface DailyBriefingData {
  date: string;
  recentMeditation: string | null;
  synapseHealth: string;
  skillCount: number;
}

/**
 * Generate daily briefing
 */
export async function generateDailyBriefing(
  _context: vscode.ExtensionContext,
): Promise<string> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    return "Good morning! Open a workspace with Alex architecture to get your personalized briefing.";
  }

  // Collect briefing data
  const data = await collectBriefingData(workspaceFolder.uri);

  // Format briefing
  const greeting = getTimeBasedGreeting();
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let briefing = `## ${greeting}\n\n`;
  briefing += `**${dateStr}**\n\n`;

  // Architecture health
  briefing += `### Architecture\n`;
  briefing += `- 🧠 ${data.skillCount} skills available\n`;
  briefing += `- ${data.synapseHealth}\n`;

  if (data.recentMeditation) {
    briefing += `- 🧘 Last meditation: ${data.recentMeditation}\n`;
  }

  briefing += `\n---\n*Ready to work? Start a conversation with @alex*`;

  return briefing;
}

/**
 * Collect data for daily briefing
 */
async function collectBriefingData(
  workspaceUri: vscode.Uri,
): Promise<DailyBriefingData> {
  const data: DailyBriefingData = {
    date: new Date().toISOString().split("T")[0],
    recentMeditation: null,
    synapseHealth: "💚 Healthy",
    skillCount: 0,
  };

  try {
    // Count skills
    const skillsUri = vscode.Uri.joinPath(workspaceUri, ".github", "skills");
    try {
      const skillDirs = await vscode.workspace.fs.readDirectory(skillsUri);
      data.skillCount = skillDirs.filter(
        ([_, type]) => type === vscode.FileType.Directory,
      ).length;
    } catch {
      // Skills directory doesn't exist
    }

    // Check for recent meditation in episodic memory
    const episodicUri = vscode.Uri.joinPath(
      workspaceUri,
      ".github",
      "episodic",
    );
    try {
      const files = await vscode.workspace.fs.readDirectory(episodicUri);
      const meditationFiles = files
        .filter(
          ([name]) => name.includes("meditation") || name.includes("session"),
        )
        .sort((a, b) => b[0].localeCompare(a[0]));

      if (meditationFiles.length > 0) {
        const lastMeditation = meditationFiles[0][0];
        const dateMatch = lastMeditation.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          data.recentMeditation = dateMatch[1];
        }
      }
    } catch {
      // Episodic directory doesn't exist
    }
  } catch (error) {
    console.warn("[Alex UX] Error collecting briefing data:", error);
  }

  return data;
}

/**
 * Get time-based greeting
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning!";
  }
  if (hour < 17) {
    return "Good afternoon!";
  }
  if (hour < 21) {
    return "Good evening!";
  }
  return "Working late?";
}

/**
 * Show Daily Briefing in a new editor
 */
export async function showDailyBriefing(
  context: vscode.ExtensionContext,
): Promise<void> {
  const briefing = await generateDailyBriefing(context);

  // Create a new untitled document with the briefing
  const doc = await vscode.workspace.openTextDocument({
    content: briefing,
    language: "markdown",
  });

  await vscode.window.showTextDocument(doc, {
    preview: true,
    viewColumn: vscode.ViewColumn.Beside,
  });

  // Also send to chat if Alex participant is available
  try {
    await openChatPanel(`/status\n\n${briefing}`);
  } catch {
    // Chat panel not available, document is shown instead
  }
}

/**
 * Open chat panel helper
 */
async function openChatPanel(_message: string): Promise<void> {
  // This is a placeholder - actual implementation would use VS Code Chat API
  // For now, we show the briefing in a document
}

/**
 * Register all UX Excellence v5.2.0 commands
 */
export function registerUXCommands(context: vscode.ExtensionContext): void {
  // Initialize UX features (status bars, etc.)
  initializeUXFeatures(context);

  // Quick Commands palette
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.quickCommands", () =>
      showQuickCommands(),
    ),
  );

  // Daily Briefing command
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.dailyBriefing", () =>
      showDailyBriefing(context),
    ),
  );

  // Show Cognitive Dashboard command — redirected to Settings tab in Command Center (Wave 5.2)
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.showCognitiveDashboard", async () => {
      // Redirect to Settings tab in the Command Center welcome view
      await vscode.commands.executeCommand("alex.switchToTab", "settings");
    }),
  );
}
