import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";

/**
 * Get the global Alex directory path (~/.alex)
 */
function getGlobalAlexDir(): string {
  return path.join(os.homedir(), ".alex");
}

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
};

/**
 * Recommended settings that improve the Alex experience
 * These are verified to exist in VS Code Copilot settings
 */
const RECOMMENDED_SETTINGS: Record<string, unknown> = {
  // Thinking tool for agents - experimental but documented
  "github.copilot.chat.agent.thinkingTool": true,
  // Max agent requests - verified in docs (default 25)
  "chat.agent.maxRequests": 50,
  // Participant detection - verified in docs
  "chat.detectParticipant.enabled": true,
  // Locale override - verified in docs
  "github.copilot.chat.localeOverride": "en",
  // Command center in title bar - quick access to Copilot features
  "chat.commandCenter.enabled": true,
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

// Module-level variable to store extension path for CSS lookup
let cachedExtensionPath: string | undefined;

/**
 * Set the extension path for CSS file lookup.
 * Called during extension activation or from initialize command.
 */
export function setExtensionPathForCss(extensionPath: string): void {
  cachedExtensionPath = extensionPath;
}

/**
 * Copy the markdown preview CSS file to the workspace .vscode folder
 * 
 * VS Code has security restrictions that prevent loading CSS from arbitrary paths.
 * We must copy the CSS to each workspace's .vscode/ folder and use a relative path.
 * 
 * Priority order for CSS source:
 * 1. Workspace's .github/skills/markdown-mermaid/markdown-light.css (if Alex already deployed)
 * 2. Extension's bundled .github/skills/markdown-mermaid/markdown-light.css (master version)
 * 3. Embedded fallback CSS (last resort)
 */
async function copyMarkdownCssToWorkspace(): Promise<boolean> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    console.error("No workspace folder open");
    return false;
  }

  const workspaceRoot = workspaceFolders[0].uri;
  const vscodeFolder = vscode.Uri.joinPath(workspaceRoot, ".vscode");
  const targetCssUri = vscode.Uri.joinPath(vscodeFolder, "markdown-light.css");

  let cssContent: Uint8Array | null = null;

  // Priority 1: Try to find CSS in workspace's Alex .github/skills folder
  const githubSkillCss = vscode.Uri.joinPath(
    workspaceRoot,
    ".github",
    "skills",
    "markdown-mermaid",
    "markdown-light.css"
  );

  try {
    cssContent = await vscode.workspace.fs.readFile(githubSkillCss);
    console.log("Using markdown CSS from workspace skills folder");
  } catch {
    // CSS not found in workspace skills folder
  }

  // Priority 2: Try extension's bundled .github/skills folder
  if (!cssContent && cachedExtensionPath) {
    const extensionSkillCss = vscode.Uri.file(
      path.join(cachedExtensionPath, ".github", "skills", "markdown-mermaid", "markdown-light.css")
    );
    try {
      cssContent = await vscode.workspace.fs.readFile(extensionSkillCss);
      console.log("Using markdown CSS from extension bundle:", extensionSkillCss.fsPath);
    } catch (err) {
      console.error("Failed to read CSS from extension bundle:", extensionSkillCss.fsPath, err);
    }
  } else if (!cssContent) {
    console.error("No cachedExtensionPath set, cannot read CSS from extension bundle");
  }

  // If not found in workspace, use embedded polished version
  if (!cssContent) {
    const basicCss = `/* GitHub-flavored Markdown Preview Theme */
/* Generated by Alex Environment Setup - Polished Edition */

/* ========================================
   CSS Variables Override
   ======================================== */
:root,
body,
.vscode-body {
    --vscode-textBlockQuote-background: #f6f8fa !important;
    --vscode-textBlockQuote-border: #d1d9e0 !important;
    --vscode-editor-background: #ffffff !important;
    --vscode-editor-foreground: #1f2328 !important;
}

/* ========================================
   Base Typography
   ======================================== */
body {
    background-color: #ffffff !important;
    color: #1f2328 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif !important;
    font-size: 16px !important;
    line-height: 1.6 !important;
    max-width: 980px !important;
    margin: 0 auto !important;
    padding: 32px 45px !important;
    word-wrap: break-word !important;
}

/* ========================================
   Headings
   ======================================== */
h1, h2, h3, h4, h5, h6 {
    color: #1f2328 !important;
    font-weight: 600 !important;
    margin-top: 24px !important;
    margin-bottom: 16px !important;
    line-height: 1.25 !important;
}

h1 { font-size: 2em !important; }
h2 { font-size: 1.5em !important; }
h3 { font-size: 1.25em !important; }
h4 { font-size: 1em !important; }

h1, h2 {
    border-bottom: 1px solid #d1d9e0 !important;
    padding-bottom: 0.3em !important;
}

/* ========================================
   Links
   ======================================== */
a {
    color: #0969da !important;
    text-decoration: none !important;
}

a:hover {
    text-decoration: underline !important;
}

/* ========================================
   Code - Inline & Blocks
   ======================================== */
code {
    background-color: #eff1f3 !important;
    color: #1f2328 !important;
    padding: 0.2em 0.4em !important;
    border-radius: 6px !important;
    font-size: 85% !important;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace !important;
}

pre {
    background-color: #f6f8fa !important;
    border: 1px solid #d1d9e0 !important;
    border-radius: 6px !important;
    padding: 16px !important;
    overflow: auto !important;
    font-size: 85% !important;
    line-height: 1.45 !important;
}

pre code {
    background-color: transparent !important;
    padding: 0 !important;
    border-radius: 0 !important;
    color: #1f2328 !important;
}

/* Force readable code text */
pre code, pre code span, pre code * {
    color: #1f2328 !important;
}

/* Syntax colors */
pre code .hljs-keyword, pre code .token.keyword { color: #cf222e !important; }
pre code .hljs-string, pre code .token.string { color: #0a3069 !important; }
pre code .hljs-comment, pre code .token.comment { color: #57606a !important; font-style: italic !important; }
pre code .hljs-function, pre code .token.function { color: #8250df !important; }
pre code .hljs-number, pre code .token.number { color: #0550ae !important; }
pre code .hljs-class-name, pre code .token.class-name { color: #953800 !important; }

/* ========================================
   Blockquotes
   ======================================== */
blockquote {
    border-left: 4px solid #d1d9e0 !important;
    color: #1f2328 !important;
    margin: 0 0 16px 0 !important;
    padding: 8px 16px !important;
    background-color: #f6f8fa !important;
}

blockquote p {
    margin: 0 !important;
}

/* ========================================
   Tables
   ======================================== */
table {
    border-collapse: collapse !important;
    width: 100% !important;
    margin-bottom: 16px !important;
}

th, td {
    border: 1px solid #d1d9e0 !important;
    padding: 8px 13px !important;
}

th {
    background-color: #f6f8fa !important;
    font-weight: 600 !important;
}

tr:nth-child(even) {
    background-color: #f6f8fa !important;
}

/* ========================================
   Lists
   ======================================== */
ul, ol {
    padding-left: 2em !important;
    margin-bottom: 16px !important;
}

li + li {
    margin-top: 0.25em !important;
}

/* Task lists */
li input[type="checkbox"] {
    margin-right: 0.5em !important;
}

/* ========================================
   Horizontal Rule
   ======================================== */
hr {
    background-color: #d1d9e0 !important;
    border: 0 !important;
    height: 0.25em !important;
    margin: 24px 0 !important;
}

/* ========================================
   Images
   ======================================== */
img {
    max-width: 100% !important;
    border-radius: 6px !important;
}

/* ========================================
   Mermaid Diagrams
   ======================================== */
.mermaid, .mermaid svg {
    background-color: #ffffff !important;
    padding: 16px !important;
    border-radius: 6px !important;
    text-align: center !important;
}

.mermaid rect, .mermaid polygon {
    fill: #f6f8fa !important;
    stroke: #d1d9e0 !important;
}

.mermaid text, .mermaid tspan {
    fill: #1f2328 !important;
    color: #1f2328 !important;
}

.mermaid .edgePath path {
    stroke: #656d76 !important;
}
`;
    cssContent = new Uint8Array(Buffer.from(basicCss, "utf8"));
  }

  try {
    // Ensure .vscode folder exists
    try {
      await vscode.workspace.fs.createDirectory(vscodeFolder);
    } catch {
      // Folder may already exist
    }

    await vscode.workspace.fs.writeFile(targetCssUri, cssContent);
    return true;
  } catch (error) {
    console.error("Failed to copy markdown CSS to workspace:", error);
    return false;
  }
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
      console.log(`[Alex Setup] ✅ Applied: ${key}`);
    } catch (error) {
      console.error(`[Alex Setup] ❌ Failed to apply ${key}:`, error);
      failed.push(key);
    }
  }

  return { applied, skipped, failed };
}

/**
 * Apply markdown styles as a workspace setting with relative path
 * 
 * VS Code security prevents loading CSS from arbitrary paths (like ~/.alex/).
 * Instead, we copy the CSS to .vscode/ and use a workspace-relative path.
 */
export async function applyMarkdownStyles(): Promise<boolean> {
  console.log("[Alex] applyMarkdownStyles() called, cachedExtensionPath:", cachedExtensionPath);
  
  // Copy CSS to workspace .vscode folder
  const copied = await copyMarkdownCssToWorkspace();
  if (!copied) {
    console.error("[Alex] Failed to copy markdown CSS to workspace");
    return false;
  }

  console.log("[Alex] CSS copied successfully, now setting markdown.styles");
  
  // Set markdown.styles as a WORKSPACE setting with relative path
  // The relative path ".vscode/markdown-light.css" works within the workspace
  const config = vscode.workspace.getConfiguration();
  const currentValue = config.inspect("markdown.styles");
  
  const relativePath = ".vscode/markdown-light.css";
  
  // Check if already set correctly in workspace settings
  const workspaceArray = currentValue?.workspaceValue as string[] | undefined;
  if (workspaceArray?.includes(relativePath)) {
    return true; // Already correctly configured
  }

  try {
    await config.update(
      "markdown.styles",
      [relativePath],
      vscode.ConfigurationTarget.Workspace
    );
    return true;
  } catch (error) {
    console.error("Failed to set markdown.styles:", error);
    return false;
  }
}

/**
 * Format settings as JSON for preview
 */
function formatSettingsPreview(settings: Record<string, unknown>): string {
  return JSON.stringify(settings, null, 2);
}

/**
 * Main command: Setup Alex Environment
 */
export async function setupEnvironment(): Promise<void> {
  // Check what's already configured
  const essentialExisting = getExistingSettings(ESSENTIAL_SETTINGS);
  const recommendedExisting = getExistingSettings(RECOMMENDED_SETTINGS);

  const essentialTotal = Object.keys(ESSENTIAL_SETTINGS).length;
  const recommendedTotal = Object.keys(RECOMMENDED_SETTINGS).length;

  const essentialNeeded = essentialTotal - essentialExisting.length;
  const recommendedNeeded = recommendedTotal - recommendedExisting.length;

  // Build quick pick items - always show all categories
  interface CategoryQuickPickItem extends vscode.QuickPickItem {
    category: SettingCategory;
    needed: number;
    existing: number;
  }

  const items: CategoryQuickPickItem[] = [];

  // Essential Settings - always show, pre-checked
  const essentialStatus = essentialNeeded === 0 ? "✓ all configured" : `${essentialNeeded} to add`;
  items.push({
    label: `${SETTING_CATEGORIES[0].icon} Essential Settings`,
    description: essentialStatus,
    detail: SETTING_CATEGORIES[0].description,
    category: SETTING_CATEGORIES[0],
    needed: essentialNeeded,
    existing: essentialExisting.length,
    picked: true,
  });

  // Recommended Settings - always show, pre-checked
  const recommendedStatus = recommendedNeeded === 0 ? "✓ all configured" : `${recommendedNeeded} to add`;
  items.push({
    label: `${SETTING_CATEGORIES[1].icon} Recommended Settings`,
    description: recommendedStatus,
    detail: SETTING_CATEGORIES[1].description,
    category: SETTING_CATEGORIES[1],
    needed: recommendedNeeded,
    existing: recommendedExisting.length,
    picked: true,
  });

  // Show multi-select quick pick
  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    placeHolder:
      "Select categories to apply (will re-apply even if already configured)",
    title: "Alex Environment Setup",
  });

  if (!selected || selected.length === 0) {
    return;
  }

  // Collect all settings to apply
  const settingsToApply: Record<string, unknown> = {};
  for (const item of selected) {
    console.log(`[Alex Setup] Adding ${item.category.name} with ${Object.keys(item.category.settings).length} settings`);
    Object.assign(settingsToApply, item.category.settings);
  }
  
  const totalKeys = Object.keys(settingsToApply).length;
  console.log(`[Alex Setup] Total settings to apply: ${totalKeys}`);
  console.log(`[Alex Setup] Settings keys:`, Object.keys(settingsToApply));

  // Show preview and ask for confirmation
  const preview = formatSettingsPreview(settingsToApply);
  const categoryNames = selected.map((s) => s.category.name).join(", ");

  const confirm = await vscode.window.showInformationMessage(
    `Apply ${Object.keys(settingsToApply).length} settings (${categoryNames})?\n\n⚠️ This will OVERWRITE existing values for these settings.\n\n• Essential: Required for Alex to read instruction files\n• Recommended: Improves agent capabilities\n• Nice-to-Have: Quality of life`,
    { modal: true, detail: `Settings to apply:\n${preview}` },
    "Apply Settings",
    "Show Preview",
    "Cancel",
  );

  if (confirm === "Show Preview") {
    // Open a preview document
    const doc = await vscode.workspace.openTextDocument({
      content: `// Settings that will be APPLIED to your VS Code configuration\n// ⚠️ Existing values for these settings will be OVERWRITTEN\n\n${preview}`,
      language: "jsonc",
    });
    await vscode.window.showTextDocument(doc, { preview: true });

    // Ask again after preview
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

  // Apply settings (force = true to ensure all selected settings are applied)
  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Setting up Alex environment...",
      cancellable: false,
    },
    async () => {
      const settingsResult = await applySettings(settingsToApply, true);
      // Also apply markdown styles as workspace setting
      await applyMarkdownStyles();
      return settingsResult;
    },
  );

  // Show result
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
    
    // Log failed settings if any
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
 * Quick setup that applies essential settings with minimal prompts
 * Used during initialization/upgrade flow
 */
export async function offerEnvironmentSetup(): Promise<boolean> {
  const essentialExisting = getExistingSettings(ESSENTIAL_SETTINGS);
  const essentialNeeded =
    Object.keys(ESSENTIAL_SETTINGS).length - essentialExisting.length;

  // If essential settings are already configured, skip
  if (essentialNeeded === 0) {
    return false;
  }

  const choice = await vscode.window.showInformationMessage(
    `Would you like to optimize VS Code for Alex?\n\nThis adds ${essentialNeeded} essential settings for full Alex functionality.\nYour existing settings will NOT be modified.`,
    "Yes, Add Settings",
    "Show Details",
    "Skip",
  );

  if (choice === "Show Details") {
    // Run the full setup flow
    await setupEnvironment();
    return true;
  } else if (choice === "Yes, Add Settings") {
    // Quick apply essential only
    const result = await applySettings(ESSENTIAL_SETTINGS);
    // Also apply markdown styles as workspace setting
    await applyMarkdownStyles();
    if (result.applied.length > 0) {
      vscode.window.showInformationMessage(
        `✅ Added ${result.applied.length} essential settings for Alex`,
      );
    }
    return true;
  }

  return false;
}
