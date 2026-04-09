import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { detectCognitiveLevel } from "../shared/cognitiveTier";
import {
  applyMarkdownStyles,
  setExtensionPathForCss,
} from "./setupMarkdownCss";
import {
  RecommendedExtension,
  RECOMMENDED_EXTENSIONS,
} from "./setupEnvironment.extensions";
import {
  ESSENTIAL_SETTINGS,
  RECOMMENDED_SETTINGS,
  AUTO_APPROVAL_SETTINGS,
  SettingCategory,
  SETTING_CATEGORIES,
} from "./setupEnvironment.settings";
export { setExtensionPathForCss, applyMarkdownStyles };

/**
 * Check which recommended extensions are installed.
 * Returns arrays of installed and missing extensions.
 */
function checkRecommendedExtensions(): {
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
    placeHolder:
      "Select extensions to install (Copilot extensions unlock AI features)",
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
  const statusText = (needed: number) =>
    needed === 0 ? "✓ all configured" : `${needed} to add`;

  return SETTING_CATEGORIES.map((cat) => {
    const existing = getExistingSettings(cat.settings);
    const needed = Object.keys(cat.settings).length - existing.length;
    return {
      label: `${cat.icon} ${cat.name} Settings`,
      description: statusText(needed),
      detail: cat.description,
      category: cat,
      needed,
      existing: existing.length,
      picked: true,
    };
  });
}

/**
 * Confirm and apply the collected settings.
 * Shows a short confirmation with category names and setting count.
 */
async function confirmAndApply(
  settingsToApply: Record<string, unknown>,
  categoryNames: string,
): Promise<void> {
  const count = Object.keys(settingsToApply).length;

  const confirm = await vscode.window.showInformationMessage(
    `Apply ${count} settings for: ${categoryNames}?`,
    "Apply",
    "Preview First",
    "Cancel",
  );

  if (confirm === "Preview First") {
    const preview = formatSettingsPreview(settingsToApply);
    const doc = await vscode.workspace.openTextDocument({
      content: `// Settings that will be applied to your VS Code user configuration\n\n${preview}`,
      language: "jsonc",
    });
    await vscode.window.showTextDocument(doc, { preview: true });

    const confirmAfterPreview = await vscode.window.showInformationMessage(
      `Apply these ${count} settings?`,
      "Apply",
      "Cancel",
    );

    if (confirmAfterPreview !== "Apply") {
      return;
    }
  } else if (confirm !== "Apply") {
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
    placeHolder:
      "Select categories to apply (will re-apply even if already configured)",
    title: "Alex Environment Setup",
  });

  if (!selected || selected.length === 0) {
    return;
  }

  // Phase 3: Collect settings from selected categories
  const settingsToApply: Record<string, unknown> = {};
  for (const item of selected) {
    Object.assign(settingsToApply, item.category.settings);
  }

  // Phase 4: Confirm and apply
  const categoryNames = selected.map((s) => s.category.name).join(", ");
  await confirmAndApply(settingsToApply, categoryNames);

  // Phase 5: Offer Bootstrap if eligible
  await offerBootstrapProject();
}

/**
 * Check if the current workspace is eligible for bootstrap and offer to run it.
 * Eligible when: workspace has .github/copilot-instructions.md, is NOT Master Alex,
 * and bootstrap hasn't completed (no state file, or state file with phase < 9).
 */
async function offerBootstrapProject(): Promise<void> {
  const wsFolder = vscode.workspace.workspaceFolders?.[0];
  if (!wsFolder) {
    return;
  }
  const wsRoot = wsFolder.uri.fsPath;

  // Must be initialized
  const markerPath = path.join(wsRoot, ".github", "copilot-instructions.md");
  if (!fs.existsSync(markerPath)) {
    return;
  }

  // Must NOT be Master Alex
  const masterProtectedPath = path.join(
    wsRoot,
    ".github",
    "config",
    "MASTER-ALEX-PROTECTED.json",
  );
  if (fs.existsSync(masterProtectedPath)) {
    return;
  }

  // Check bootstrap state
  const bootstrapStatePath = path.join(
    wsRoot,
    ".github",
    ".heir-bootstrap-state.json",
  );
  let isResume = false;
  if (fs.existsSync(bootstrapStatePath)) {
    try {
      const stateData = JSON.parse(
        fs.readFileSync(bootstrapStatePath, "utf-8"),
      );
      if (
        typeof stateData.lastCompletedPhase === "number" &&
        stateData.lastCompletedPhase >= 9
      ) {
        return; // Bootstrap already completed
      }
      isResume = true;
    } catch {
      // Corrupt state file: treat as eligible
    }
  }

  const label = isResume ? "Resume Bootstrap" : "Bootstrap Project";
  const detail = isResume
    ? "Continue tailoring Alex to this project (interrupted session detected)"
    : "Tailor Alex to this codebase: scan project, verify build/test commands, generate project-specific instructions";

  const choice = await vscode.window.showInformationMessage(
    `\uD83E\uDDEC ${label}?\n\n${detail}`,
    label,
    "Skip",
  );

  if (choice === label) {
    const prompt = isResume
      ? "I want to resume the bootstrap wizard. Check .github/.heir-bootstrap-state.json and continue from where we left off."
      : "I want to bootstrap this project. Walk me through the heir bootstrap wizard to tailor your architecture to this codebase: scan the project, verify build/test commands, mine existing AI configs, generate project-specific instructions, and set up security hooks. Check .github/.heir-bootstrap-state.json first; if it exists, resume from where we left off.";

    await vscode.commands.executeCommand("workbench.action.chat.open", {
      query: prompt,
    });
  }
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

      if (
        account.signedIn &&
        cogResult.hasModels &&
        cogResult.bestModelTier !== "frontier"
      ) {
        // Signed in with models but no frontier — account might be on a lower plan
        const accountMsg =
          account.sessionCount > 1
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
          vscode.env.openExternal(
            vscode.Uri.parse("https://github.com/settings/copilot"),
          );
        }
      } else if (
        !account.signedIn &&
        cogResult.copilotInstalled &&
        !cogResult.hasModels
      ) {
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
    // Offer Bootstrap if eligible
    await offerBootstrapProject();
    return true;
  }

  return false;
}
