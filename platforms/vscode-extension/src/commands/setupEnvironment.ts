import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import { detectCognitiveLevel } from "../shared/cognitiveTier";
import { applyMarkdownStyles, setExtensionPathForCss } from "./setupMarkdownCss";
export { setExtensionPathForCss, applyMarkdownStyles };

/**
 * Get the global Alex directory path (~/.alex)
 */
function getGlobalAlexDir(): string {
  return path.join(os.homedir(), ".alex");
}
// mark as used (future feature hooks)
void getGlobalAlexDir;
// ============================================================================
// RECOMMENDED EXTENSIONS
// ============================================================================

interface RecommendedExtension {
  id: string;
  name: string;
  /** Why this extension matters for Alex */
  purpose: string;
  /** Cognitive level unlocked by this extension */
  unlocksLevel: number;
  /** Is Alex usable without it? */
  required: boolean;
}

/**
 * Extensions that Alex works best with.
 * Ordered by importance — required first, then nice-to-have.
 */
const RECOMMENDED_EXTENSIONS: RecommendedExtension[] = [
  {
    id: "github.copilot",
    name: "GitHub Copilot",
    purpose: "AI language models — enables all AI-powered features (Levels 2-4)",
    unlocksLevel: 2,
    required: false, // Alex Level 1 works without it
  },
  {
    id: "github.copilot-chat",
    name: "GitHub Copilot Chat",
    purpose: "Chat interface, agent mode, @alex participant, slash commands",
    unlocksLevel: 2,
    required: false,
  },
  {
    id: "bierner.markdown-mermaid",
    name: "Markdown Preview Mermaid",
    purpose: "Mermaid diagram rendering in documentation previews",
    unlocksLevel: 0,
    required: false,
  },
];

/**
 * Check which recommended extensions are installed.
 * Returns arrays of installed and missing extensions.
 */
export function checkRecommendedExtensions(): {
  installed: RecommendedExtension[];
  missing: RecommendedExtension[];
} {
  const installed: RecommendedExtension[] = [];
  const missing: RecommendedExtension[] = [];

  for (const ext of RECOMMENDED_EXTENSIONS) {
    if (vscode.extensions.getExtension(ext.id)) {
      installed.push(ext);
    } else {
      missing.push(ext);
    }
  }

  return { installed, missing };
}

/**
 * Offer to install missing extensions with one-click install.
 * Shows a multi-select quick pick and installs all selected.
 * @returns number of extensions installed
 */
export async function offerExtensionInstall(): Promise<number> {
  const { missing } = checkRecommendedExtensions();

  if (missing.length === 0) {
    return 0;
  }

  // Build quick pick items
  interface ExtPickItem extends vscode.QuickPickItem {
    ext: RecommendedExtension;
  }

  const items: ExtPickItem[] = missing.map((ext) => ({
    label: ext.name,
    description: ext.id,
    detail: ext.purpose,
    picked: ext.unlocksLevel >= 2, // Pre-select Copilot extensions
    ext,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    placeHolder: "Select extensions to install (Copilot extensions unlock AI features)",
    title: "🧩 Recommended Extensions for Alex",
  });

  if (!selected || selected.length === 0) {
    return 0;
  }

  let installedCount = 0;
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Installing extensions for Alex...",
      cancellable: false,
    },
    async (progress) => {
      for (const item of selected) {
        progress.report({ message: `Installing ${item.ext.name}...` });
        try {
          await vscode.commands.executeCommand(
            "workbench.extensions.installExtension",
            item.ext.id,
          );
          installedCount++;
        } catch (err) {
          console.error(`[Alex] Failed to install ${item.ext.id}:`, err);
        }
      }
    },
  );

  if (installedCount > 0) {
    const reloadChoice = await vscode.window.showInformationMessage(
      `✅ Installed ${installedCount} extension${installedCount > 1 ? "s" : ""}. Reload window to activate?`,
      "Reload Now",
      "Later",
    );
    if (reloadChoice === "Reload Now") {
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    }
  }

  return installedCount;
}

// ============================================================================
// SETTINGS DEFINITIONS
// ============================================================================

/**
 * Essential settings required for Alex to function properly
 * These are verified to exist in VS Code Copilot settings
 */
const ESSENTIAL_SETTINGS: Record<string, unknown> = {
  // Custom instructions location - verified in docs
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
  },
  // Prompt files location - verified in docs (for .github/prompts)
  "chat.promptFilesLocations": {
    ".github/prompts": true,
  },
  // Enable AGENTS.md files - verified in docs  
  "chat.useAgentsMdFile": true,
  // Enable nested AGENTS.md in subfolders - experimental but documented
  "chat.useNestedAgentsMdFiles": true,
  // Auto-include copilot-instructions.md - verified in docs
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  // Skills auto-loading location
  "chat.agentSkillsLocations": [".github/skills"],
  // Skill adherence - forces LLM to read SKILL.md files before responding (A4)
  "chat.useSkillAdherencePrompt": true,
};

/**
 * Recommended settings that improve the Alex experience
 * These are verified to exist in VS Code Copilot settings
 */
const RECOMMENDED_SETTINGS: Record<string, unknown> = {
  // Thinking tool for agents - experimental but documented
  "github.copilot.chat.agent.thinkingTool": true,
  // Max agent requests - verified in docs (default 25)
  "chat.agent.maxRequests": 100,
  // Participant detection - verified in docs
  "chat.detectParticipant.enabled": true,
  // Locale override - verified in docs
  "github.copilot.chat.localeOverride": "en",
  // Command center in title bar - quick access to Copilot features
  "chat.commandCenter.enabled": true,
  // Agent mode - enables custom agents in chat dropdown
  "chat.agent.enabled": true,
  // Agent session history - view and manage agent sessions
  "chat.viewSessions.enabled": true,
  // MCP gallery - enables Model Context Protocol tools
  "chat.mcp.gallery.enabled": true,
  // Follow-up suggestions - helps discover Alex capabilities
  "github.copilot.chat.followUps": "always",
  // Agent hooks - lifecycle automation
  // NOTE: Disabled - not stable in VS Code 1.109 as of Feb 2026
  // "chat.hooks.enabled": true,
  // Copilot Memory - cross-session memory storage (persists between chats)
  "github.copilot.chat.copilotMemory.enabled": true,
  // Memory tool - access to memory tool in chat
  "github.copilot.chat.tools.memory.enabled": true,
  // Request queueing - queue messages for sequential processing
  "chat.requestQueuing.enabled": true,
  // Auto-queue by default
  "chat.requestQueuing.defaultAction": "queue",
  // Search subagent - enables web search capability in agent mode
  "github.copilot.chat.searchSubagent.enabled": true,
  // Custom agents in subagents - flexibility for specialized agents
  "chat.customAgentInSubagent.enabled": true,
  // Explore subagent model - faster model for codebase research (search_subagent)
  // Claude Sonnet 4 balances speed and quality for read-only exploration
  "chat.exploreAgent.defaultModel": "claude-sonnet-4",
  // Unified agents bar - better UI
  "chat.unifiedAgentsBar.enabled": true,
  // Progress badge - visibility into ongoing operations
  "chat.viewProgressBadge.enabled": true,
  // Session orientation - stacked layout
  "chat.viewSessions.orientation": "stacked",
  // Show file changes in checkpoints - change tracking
  "chat.checkpoints.showFileChanges": true,
  // Restore last panel session - continuity
  "chat.restoreLastPanelSession": true,
  // MCP auto-start - start new and outdated servers automatically
  "chat.mcp.autostart": "newAndOutdated",
  // Code block progress - hide for cleaner output
  "chat.agent.codeBlockProgress": false,
  // NuGet assistance - for .NET projects
  "chat.mcp.assisted.nuget.enabled": true,
  // Include referenced instructions - better context awareness
  "chat.includeReferencedInstructions": true,
  // Use Agent Skills standard
  "chat.useAgentSkills": true,
  // Alex thinking phrases - personality-driven progress messages (VS Code 1.110+)
  "chat.agent.thinking.phrases": [
    "Meditating on this...",
    "Consulting synapses...",
    "Traversing knowledge graph...",
    "Consolidating memory...",
    "Activating neural pathways...",
    "Searching episodic memory...",
    "Synthesizing knowledge...",
    "Connecting the dots...",
    "Entering focused state...",
    "Examining patterns...",
    "Following the thread...",
    "Deep in thought...",
    "Warming up neurons...",
    "Running cognitive analysis...",
    "Consulting the architecture...",
  ],
  // Terminal image support - render images inline via Kitty graphics protocol (VS Code 1.110+)
  "terminal.integrated.enableImages": true,
};

/**
 * Auto-approval settings for better workflow efficiency
 * These reduce friction for common operations while maintaining safety
 */
const AUTO_APPROVAL_SETTINGS: Record<string, unknown> = {
  // Auto-run tools - reduces manual approval prompts
  "chat.tools.autoRun": true,
  // Auto-approve file system operations
  "chat.tools.fileSystem.autoApprove": true,
  // Use custom auto-approve rules only (ignore defaults)
  "chat.tools.terminal.ignoreDefaultAutoApproveRules": true,
  // Auto-reply to terminal prompts
  "chat.tools.terminal.autoReplyToPrompts": true,
  // Allow shell history for terminal commands
  "chat.tools.terminal.preventShellHistory": false,
};

/**
 * Extended thinking settings for Anthropic models (Opus 4.5)
 * These enable deeper reasoning for complex tasks like meditation/learning
 */
const EXTENDED_THINKING_SETTINGS: Record<string, unknown> = {
  // Enable extended thinking for Opus 4.5 - deep reasoning mode
  "github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled": true,
  // Thinking budget in tokens (max 16384) - higher = deeper reasoning
  "github.copilot.chat.models.anthropic.claude-opus-4-5.thinkingBudget": 16384,
};

/**
 * Enterprise security settings (secrets scanning and audit logging)
 */
const ENTERPRISE_SETTINGS: Record<string, unknown> = {
  // Enterprise audit logging
  "alex.enterprise.audit.enabled": true,
};

// Note: Mermaid/markdown preview settings are configured via the markdown-mermaid
// skill's "Polish Mermaid Setup" prompt, not here, because they vary by VS Code
// version and installed extensions.

interface SettingCategory {
  name: string;
  description: string;
  settings: Record<string, unknown>;
  icon: string;
}

const SETTING_CATEGORIES: SettingCategory[] = [
  {
    name: "Essential",
    description: "Required for full Alex functionality",
    settings: ESSENTIAL_SETTINGS,
    icon: "🔴",
  },
  {
    name: "Recommended",
    description: "Improves the Alex experience",
    settings: RECOMMENDED_SETTINGS,
    icon: "🟡",
  },
  {
    name: "Auto-Approval",
    description: "Auto-run tools and file operations for better workflow",
    settings: AUTO_APPROVAL_SETTINGS,
    icon: "🟠",
  },
  {
    name: "Extended Thinking",
    description: "Deep reasoning for Opus 4.5 (meditation, learning)",
    settings: EXTENDED_THINKING_SETTINGS,
    icon: "🧠",
  },
  {
    name: "Enterprise (Experimental)",
    description: "Microsoft 365 integration - requires admin consent",
    settings: ENTERPRISE_SETTINGS,
    icon: "🏢",
  },
];

/**
 * Check which settings are already configured
 */
function getExistingSettings(settings: Record<string, unknown>): string[] {
  const config = vscode.workspace.getConfiguration();
  const existing: string[] = [];

  for (const key of Object.keys(settings)) {
    const currentValue = config.inspect(key);
    if (currentValue?.globalValue !== undefined) {
      existing.push(key);
    }
  }

  return existing;
}


/**
 * Apply settings to VS Code user configuration
 * @param settings - The settings to apply
 * @param force - If true, apply all settings even if already configured
 */
async function applySettings(
  settings: Record<string, unknown>,
  force: boolean = false,
): Promise<{ applied: string[]; skipped: string[]; failed: string[] }> {
  const config = vscode.workspace.getConfiguration();
  const applied: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const [key, value] of Object.entries(settings)) {
    try {
      // Check if already set (skip only if not forcing)
      if (!force) {
        const currentValue = config.inspect(key);
        if (currentValue?.globalValue !== undefined) {
          skipped.push(key);
          continue;
        }
      }

      await config.update(key, value, vscode.ConfigurationTarget.Global);
      applied.push(key);
    } catch (error) {
      console.error(`[Alex Setup] ❌ Failed to apply ${key}:`, error);
      failed.push(key);
    }
  }

  return { applied, skipped, failed };
}

/**
 * Format settings as JSON for preview
 */
function formatSettingsPreview(settings: Record<string, unknown>): string {
  return JSON.stringify(settings, null, 2);
}

interface CategoryQuickPickItem extends vscode.QuickPickItem {
  category: SettingCategory;
  needed: number;
  existing: number;
}

/**
 * Build QuickPick items for all setting categories with current status
 */
function buildSettingsCategoryItems(): CategoryQuickPickItem[] {
  const essentialExisting = getExistingSettings(ESSENTIAL_SETTINGS);
  const recommendedExisting = getExistingSettings(RECOMMENDED_SETTINGS);
  const autoApprovalExisting = getExistingSettings(AUTO_APPROVAL_SETTINGS);
  const extendedThinkingExisting = getExistingSettings(EXTENDED_THINKING_SETTINGS);
  const enterpriseExisting = getExistingSettings(ENTERPRISE_SETTINGS);

  const essentialNeeded = Object.keys(ESSENTIAL_SETTINGS).length - essentialExisting.length;
  const recommendedNeeded = Object.keys(RECOMMENDED_SETTINGS).length - recommendedExisting.length;
  const autoApprovalNeeded = Object.keys(AUTO_APPROVAL_SETTINGS).length - autoApprovalExisting.length;
  const extendedThinkingNeeded = Object.keys(EXTENDED_THINKING_SETTINGS).length - extendedThinkingExisting.length;
  const enterpriseNeeded = Object.keys(ENTERPRISE_SETTINGS).length - enterpriseExisting.length;

  const enterpriseCurrentlyEnabled = vscode.workspace.getConfiguration().get<boolean>("alex.enterprise.enabled", false);

  const statusText = (needed: number) => needed === 0 ? "✓ all configured" : `${needed} to add`;

  const enterpriseStatus = enterpriseCurrentlyEnabled
    ? "✓ enabled (uncheck to disable)"
    : statusText(enterpriseNeeded);

  return [
    { label: `${SETTING_CATEGORIES[0].icon} Essential Settings`, description: statusText(essentialNeeded), detail: SETTING_CATEGORIES[0].description, category: SETTING_CATEGORIES[0], needed: essentialNeeded, existing: essentialExisting.length, picked: true },
    { label: `${SETTING_CATEGORIES[1].icon} Recommended Settings`, description: statusText(recommendedNeeded), detail: SETTING_CATEGORIES[1].description, category: SETTING_CATEGORIES[1], needed: recommendedNeeded, existing: recommendedExisting.length, picked: true },
    { label: `${SETTING_CATEGORIES[2].icon} Auto-Approval Settings`, description: statusText(autoApprovalNeeded), detail: SETTING_CATEGORIES[2].description, category: SETTING_CATEGORIES[2], needed: autoApprovalNeeded, existing: autoApprovalExisting.length, picked: true },
    { label: `${SETTING_CATEGORIES[3].icon} Extended Thinking`, description: statusText(extendedThinkingNeeded), detail: SETTING_CATEGORIES[3].description, category: SETTING_CATEGORIES[3], needed: extendedThinkingNeeded, existing: extendedThinkingExisting.length, picked: false },
    { label: `${SETTING_CATEGORIES[4].icon} Enterprise (MS Graph)`, description: enterpriseStatus, detail: SETTING_CATEGORIES[4].description + " - enables MS Graph integration", category: SETTING_CATEGORIES[4], needed: enterpriseNeeded, existing: enterpriseExisting.length, picked: enterpriseCurrentlyEnabled },
  ];
}

/**
 * Show preview, confirm, and apply the collected settings
 */
async function previewConfirmAndApply(settingsToApply: Record<string, unknown>, categoryNames: string): Promise<void> {
  const preview = formatSettingsPreview(settingsToApply);

  const confirm = await vscode.window.showInformationMessage(
    `Apply ${Object.keys(settingsToApply).length} settings (${categoryNames})?\n\n⚠️ This will OVERWRITE existing values for these settings.\n\n• Essential: Required for Alex to read instruction files\n• Recommended: Improves agent capabilities\n• Nice-to-Have: Quality of life`,
    { modal: true, detail: `Settings to apply:\n${preview}` },
    "Apply Settings",
    "Show Preview",
    "Cancel",
  );

  if (confirm === "Show Preview") {
    const doc = await vscode.workspace.openTextDocument({
      content: `// Settings that will be APPLIED to your VS Code configuration\n// ⚠️ Existing values for these settings will be OVERWRITTEN\n\n${preview}`,
      language: "jsonc",
    });
    await vscode.window.showTextDocument(doc, { preview: true });

    const confirmAfterPreview = await vscode.window.showInformationMessage(
      "Apply these settings to your VS Code configuration?",
      "Apply Settings",
      "Cancel",
    );

    if (confirmAfterPreview !== "Apply Settings") {
      return;
    }
  } else if (confirm !== "Apply Settings") {
    return;
  }

  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Setting up Alex environment...",
      cancellable: false,
    },
    async () => {
      const settingsResult = await applySettings(settingsToApply, true);
      await applyMarkdownStyles();
      return settingsResult;
    },
  );

  if (result.applied.length > 0) {
    let message = `✅ Applied ${result.applied.length} settings`;
    if (result.failed.length > 0) {
      message += ` (${result.failed.length} failed)`;
    }
    vscode.window
      .showInformationMessage(message, "View Settings")
      .then((choice) => {
        if (choice === "View Settings") {
          vscode.commands.executeCommand("workbench.action.openSettingsJson");
        }
      });
    if (result.failed.length > 0) {
      console.error("[Alex] Failed to apply settings:", result.failed);
    }
  } else if (result.failed.length > 0) {
    vscode.window.showErrorMessage(
      `Failed to apply ${result.failed.length} settings. Check Output > Extension Host for details.`,
    );
  }
}

/**
 * Main command: Setup Alex Environment
 */
export async function setupEnvironment(): Promise<void> {
  // Phase 1: Check for missing extensions FIRST
  const { missing: missingExts } = checkRecommendedExtensions();
  if (missingExts.length > 0) {
    const copilotMissing = missingExts.some(
      (e) => e.id === "github.copilot" || e.id === "github.copilot-chat",
    );
    const extNames = missingExts.map((e) => e.name).join(", ");
    const severity = copilotMissing ? "⚠️" : "💡";
    const msg = copilotMissing
      ? `${severity} GitHub Copilot is not installed — AI features (Levels 2-4) are unavailable.\n\nMissing: ${extNames}`
      : `${severity} Optional extension${missingExts.length > 1 ? "s" : ""} not found: ${extNames}`;

    const choice = await vscode.window.showInformationMessage(
      msg,
      "Install Extensions",
      "Skip",
    );
    if (choice === "Install Extensions") {
      await offerExtensionInstall();
    }
  }

  // Phase 2: Build category items and show selection
  const items = buildSettingsCategoryItems();
  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    placeHolder: "Select categories to apply (will re-apply even if already configured)",
    title: "Alex Environment Setup",
  });

  if (!selected || selected.length === 0) {
    return;
  }

  // Phase 3: Collect settings and handle enterprise toggle
  const settingsToApply: Record<string, unknown> = {};
  for (const item of selected) {
    Object.assign(settingsToApply, item.category.settings);
  }

  const enterpriseCurrentlyEnabled = vscode.workspace.getConfiguration().get<boolean>("alex.enterprise.enabled", false);
  const enterpriseSelected = selected.some(s => s.category.name === "Enterprise (Experimental)");
  if (!enterpriseSelected && enterpriseCurrentlyEnabled) {
    for (const key of Object.keys(ENTERPRISE_SETTINGS)) {
      settingsToApply[key] = false;
    }
  }

  // Phase 4: Preview, confirm, and apply
  const categoryNames = selected.map((s) => s.category.name).join(", ");
  await previewConfirmAndApply(settingsToApply, categoryNames);
}

/**
 * Quick setup that applies essential and recommended settings with minimal prompts.
 * Used during initialization/upgrade flow.
 *
 * Flow: Check extensions → Apply settings → Done
 */
export async function offerEnvironmentSetup(): Promise<boolean> {
  // Phase 1: Check for missing Copilot extensions and offer install
  const { missing: missingExts } = checkRecommendedExtensions();
  const copilotMissing = missingExts.some(
    (e) => e.id === "github.copilot" || e.id === "github.copilot-chat",
  );

  if (copilotMissing) {
    const extChoice = await vscode.window.showInformationMessage(
      "🧩 GitHub Copilot is not installed.\n\n" +
        "Alex works at Level 1 (free) without it, but installing Copilot unlocks:\n" +
        "• AI chat, code review, debugging\n" +
        "• Agent mode with tools & skills\n" +
        "• Meditation, Dream, Self-Actualization\n\n" +
        "Install now?",
      "Install Copilot",
      "Skip (Level 1 Only)",
    );
    if (extChoice === "Install Copilot") {
      await offerExtensionInstall();
    }
  } else if (missingExts.length > 0) {
    // Only non-Copilot extensions missing — quick mention
    const names = missingExts.map((e) => e.name).join(", ");
    const extChoice = await vscode.window.showInformationMessage(
      `💡 Optional: ${names} can enhance your experience.`,
      "Install",
      "Skip",
    );
    if (extChoice === "Install") {
      await offerExtensionInstall();
    }
  }

  // Phase 1.5: Check GitHub account & frontier model access
  // Only relevant when Copilot is installed
  if (!copilotMissing) {
    try {
      const cogResult = await detectCognitiveLevel(true);
      const account = cogResult.gitHubAccount;

      if (account.signedIn && cogResult.hasModels && cogResult.bestModelTier !== 'frontier') {
        // Signed in with models but no frontier — account might be on a lower plan
        const accountMsg = account.sessionCount > 1
          ? `Signed in as "${account.label}" (${account.sessionCount} accounts detected). ` +
            `Current plan provides ${cogResult.bestModelTier}-tier models. ` +
            `Frontier models (Level 4) need Copilot Pro or Business. ` +
            `Your other account may have a higher plan — switch via the Accounts menu (bottom-left).`
          : `Signed in as "${account.label}" with ${cogResult.bestModelTier}-tier models. ` +
            `Frontier models (Level 4) require Copilot Pro or Business. ` +
            `If you have another GitHub account with a higher plan, add it via the Accounts menu (bottom-left).`;

        const acctChoice = await vscode.window.showInformationMessage(
          `🔑 ${accountMsg}`,
          "Open Accounts",
          "Check Plans",
          "OK",
        );

        if (acctChoice === "Open Accounts") {
          vscode.commands.executeCommand("workbench.action.accounts");
        } else if (acctChoice === "Check Plans") {
          vscode.env.openExternal(vscode.Uri.parse("https://github.com/settings/copilot"));
        }
      } else if (!account.signedIn && cogResult.copilotInstalled && !cogResult.hasModels) {
        // Copilot installed but not signed in
        const signInChoice = await vscode.window.showInformationMessage(
          "🔑 GitHub Copilot is installed but you're not signed in.\n\n" +
          "Sign in to activate AI models. If you have multiple GitHub accounts " +
          "(personal + work), choose the one with Copilot Pro or Business for best results.",
          "Sign In",
          "Skip",
        );

        if (signInChoice === "Sign In") {
          vscode.commands.executeCommand("workbench.action.accounts");
        }
      }
    } catch {
      // Cognitive detection unavailable — skip account check
    }
  }

  // Phase 2: Check and apply settings
  const essentialExisting = getExistingSettings(ESSENTIAL_SETTINGS);
  const recommendedExisting = getExistingSettings(RECOMMENDED_SETTINGS);
  const autoApprovalExisting = getExistingSettings(AUTO_APPROVAL_SETTINGS);
  
  const essentialNeeded =
    Object.keys(ESSENTIAL_SETTINGS).length - essentialExisting.length;
  const recommendedNeeded =
    Object.keys(RECOMMENDED_SETTINGS).length - recommendedExisting.length;
  const autoApprovalNeeded =
    Object.keys(AUTO_APPROVAL_SETTINGS).length - autoApprovalExisting.length;
  
  const totalNeeded = essentialNeeded + recommendedNeeded + autoApprovalNeeded;

  // If all critical settings are already configured, skip
  if (totalNeeded === 0) {
    return false;
  }

  const choice = await vscode.window.showInformationMessage(
    `Would you like to optimize VS Code for Alex?\n\nThis adds ${totalNeeded} settings for full Alex functionality:\n• ${essentialNeeded} essential (file locations, agent mode)\n• ${recommendedNeeded} recommended (memory, subagents, UI)\n• ${autoApprovalNeeded} auto-approval (workflow efficiency)\n\nYour existing settings will NOT be modified.`,
    "Yes, Add Settings",
    "Show Details",
    "Skip",
  );

  if (choice === "Show Details") {
    // Run the full setup flow (skips extension check since we just did it)
    await setupEnvironment();
    return true;
  } else if (choice === "Yes, Add Settings") {
    // Quick apply essential + recommended + auto-approval
    const criticalSettings = {
      ...ESSENTIAL_SETTINGS,
      ...RECOMMENDED_SETTINGS,
      ...AUTO_APPROVAL_SETTINGS,
    };
    const result = await applySettings(criticalSettings);
    // Also apply markdown styles as workspace setting
    await applyMarkdownStyles();
    if (result.applied.length > 0) {
      vscode.window.showInformationMessage(
        `✅ Added ${result.applied.length} settings for Alex (${result.applied.length - essentialNeeded} already configured)`,
      );
    }
    return true;
  }

  return false;
}
