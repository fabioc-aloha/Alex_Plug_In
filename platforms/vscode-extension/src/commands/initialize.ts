import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as crypto from "crypto";
import { getAlexWorkspaceFolder, isAlexInstalled, checkProtectionAndWarn } from "../shared/utils";
import { offerEnvironmentSetup } from "./setupEnvironment";
import * as telemetry from "../shared/telemetry";

interface FileManifestEntry {
  type: "system" | "hybrid" | "user-created";
  originalChecksum: string;
}

interface Manifest {
  version: string;
  installedAt: string;
  upgradedAt?: string;
  files: Record<string, FileManifestEntry>;
}

/**
 * Calculate MD5 checksum of file content
 */
function calculateChecksum(content: string): string {
  return crypto
    .createHash("md5")
    .update(content.replace(/\r\n/g, "\n"))
    .digest("hex");
}

/**
 * Get the manifest path
 */
function getManifestPath(rootPath: string): string {
  return path.join(rootPath, ".github", "config", "alex-manifest.json");
}

export async function initializeArchitecture(context: vscode.ExtensionContext) {
  telemetry.log("command", "initialize_start_detailed", {
    workspaceFolderCount: vscode.workspace.workspaceFolders?.length ?? 0,
  });

  // Use smart workspace folder detection - don't require Alex installed yet
  const workspaceResult = await getAlexWorkspaceFolder(false);

  if (!workspaceResult.found) {
    telemetry.log("command", "initialize_no_workspace", {
      cancelled: workspaceResult.cancelled,
      error: workspaceResult.error,
    });
    if (workspaceResult.cancelled) {
      return; // User cancelled folder selection
    }
    vscode.window.showErrorMessage(
      workspaceResult.error ||
        "No workspace folder open. Please open a project folder first (File → Open Folder), then run this command again.",
      { modal: true },
    );
    return;
  }

  const rootPath = workspaceResult.rootPath!;
  telemetry.log("command", "initialize_workspace_found", {
    rootPath: path.basename(rootPath),
  });

  // 🛡️ KILL SWITCH: Check if workspace is protected (Master Alex)
  const canProceed = await checkProtectionAndWarn(
    rootPath,
    "Alex: Initialize",
    true  // Allow override with double confirmation
  );
  if (!canProceed) {
    telemetry.log("command", "initialize_blocked_protected_workspace");
    return;
  }

  const markerFile = path.join(rootPath, ".github", "copilot-instructions.md");

  if (await fs.pathExists(markerFile)) {
    telemetry.log("command", "initialize_already_exists");
    const result = await vscode.window.showWarningMessage(
      'Alex is already installed in this workspace.\n\n• To update to a new version, use "Alex: Upgrade"\n• To completely reinstall, choose Reset below',
      "Upgrade Instead",
      "Reset Architecture",
      "Cancel",
    );

    telemetry.log("command", "initialize_existing_choice", { choice: result });
    if (result === "Upgrade Instead") {
      await vscode.commands.executeCommand("alex.upgrade");
    } else if (result === "Reset Architecture") {
      await resetArchitecture(context);
    }
    return;
  }

  await performInitialization(context, rootPath, false);
}

export async function resetArchitecture(context: vscode.ExtensionContext) {
  // Use smart workspace folder detection - require Alex installed for reset
  const workspaceResult = await getAlexWorkspaceFolder(true);

  if (!workspaceResult.found) {
    if (workspaceResult.cancelled) {
      return; // User cancelled folder selection
    }
    vscode.window.showErrorMessage(
      workspaceResult.error ||
        "Please open a workspace folder with Alex installed to reset.",
      { modal: true },
    );
    return;
  }

  const rootPath = workspaceResult.rootPath!;

  // 🛡️ KILL SWITCH: Check if workspace is protected (Master Alex)
  // Reset is VERY dangerous - only allow with double confirmation
  const canProceed = await checkProtectionAndWarn(
    rootPath,
    "Alex: Reset Architecture",
    true  // Allow override with double confirmation
  );
  if (!canProceed) {
    telemetry.log("command", "reset_blocked_protected_workspace");
    return;
  }

  const confirm = await vscode.window.showWarningMessage(
    '⚠️ RESET will permanently delete all Alex memory files!\n\nThis includes:\n• All learned domain knowledge\n• Custom instructions and prompts\n• Synaptic network connections\n\nConsider using "Alex: Upgrade" instead to preserve your knowledge.',
    { modal: true },
    "Yes, Delete Everything",
    "Upgrade Instead",
    "Cancel",
  );

  if (confirm === "Upgrade Instead") {
    await vscode.commands.executeCommand("alex.upgrade");
    return;
  }
  if (confirm !== "Yes, Delete Everything") {
    return;
  }

  // Delete existing folders
  const pathsToDelete = [
    path.join(rootPath, ".github", "copilot-instructions.md"),
    path.join(rootPath, ".github", "instructions"),
    path.join(rootPath, ".github", "prompts"),
    path.join(rootPath, ".github", "episodic"),
    path.join(rootPath, ".github", "domain-knowledge"),
    path.join(rootPath, ".github", "config"), // Includes alex-manifest.json
    path.join(rootPath, ".alex-manifest.json"), // Clean up legacy manifest location too
  ];

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Resetting Alex Architecture...",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: "Cleaning up existing files..." });
        for (const p of pathsToDelete) {
          await fs.remove(p);
        }
      },
    );

    await performInitialization(context, rootPath, true);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Reset failed:", error);
    vscode.window.showErrorMessage(
      `Failed to reset Alex: ${errorMessage || "Unknown error"}`,
      { modal: true },
    );
  }
}

async function performInitialization(
  context: vscode.ExtensionContext,
  rootPath: string,
  overwrite: boolean,
) {
  const done = telemetry.logTimed("command", "perform_initialization", {
    overwrite,
  });
  const extensionPath = context.extensionPath;

  // Validate extension has required files
  const requiredSource = path.join(
    extensionPath,
    ".github",
    "copilot-instructions.md",
  );
  if (!(await fs.pathExists(requiredSource))) {
    telemetry.logError(
      "initialize_corrupted_extension",
      new Error("Missing core files"),
      {
        requiredSource,
      },
    );
    vscode.window.showErrorMessage(
      "Extension installation appears corrupted - missing core files.\n\n" +
        "Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.",
      { modal: true },
    );
    done(false, new Error("Extension corrupted"));
    return;
  }

  telemetry.log("command", "initialize_extension_valid", {
    extensionPath: path.basename(extensionPath),
  });

  // Define source and destination paths
  // Note: domain-knowledge is deprecated - DK files are now migrated to skills
  const sources = [
    {
      src: path.join(extensionPath, ".github", "copilot-instructions.md"),
      dest: path.join(rootPath, ".github", "copilot-instructions.md"),
    },
    {
      src: path.join(extensionPath, ".github", "instructions"),
      dest: path.join(rootPath, ".github", "instructions"),
    },
    {
      src: path.join(extensionPath, ".github", "prompts"),
      dest: path.join(rootPath, ".github", "prompts"),
    },
    {
      src: path.join(extensionPath, ".github", "episodic"),
      dest: path.join(rootPath, ".github", "episodic"),
    },
    {
      src: path.join(extensionPath, ".github", "config"),
      dest: path.join(rootPath, ".github", "config"),
    },
    {
      src: path.join(extensionPath, ".github", "agents"),
      dest: path.join(rootPath, ".github", "agents"),
    },
    {
      src: path.join(extensionPath, ".github", "skills"),
      dest: path.join(rootPath, ".github", "skills"),
    },
  ];

  try {
    // Test write permissions first
    telemetry.log("command", "initialize_testing_permissions");
    const testDir = path.join(rootPath, ".github");
    await fs.ensureDir(testDir);
    const testFile = path.join(testDir, ".write-test");
    try {
      await fs.writeFile(testFile, "test");
      await fs.remove(testFile);
      telemetry.log("command", "initialize_permissions_ok");
    } catch (permError: any) {
      const permErrorMessage =
        permError instanceof Error ? permError.message : String(permError);
      telemetry.logError("initialize_permission_denied", permError);
      throw new Error(
        `Cannot write to workspace - check folder permissions: ${permErrorMessage || "Permission denied"}`,
      );
    }

    let copiedCount = 0;
    let skippedCount = 0;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Initializing Alex Cognitive Architecture...",
        cancellable: false,
      },
      async (progress) => {
        for (const item of sources) {
          progress.report({
            message: `Copying ${path.basename(item.dest)}...`,
          });
          if (await fs.pathExists(item.src)) {
            try {
              await fs.copy(item.src, item.dest, { overwrite: overwrite });
              copiedCount++;
              telemetry.log("command", "initialize_copied", {
                item: path.basename(item.dest),
              });
            } catch (copyErr) {
              telemetry.logError("initialize_copy_failed", copyErr, {
                item: path.basename(item.dest),
              });
              throw copyErr;
            }
          } else {
            skippedCount++;
            telemetry.log("command", "initialize_source_missing", {
              item: path.basename(item.src),
            });
            console.warn(`Source not found: ${item.src}`);
          }
        }

        // Create manifest with checksums of all deployed files
        progress.report({ message: "Creating manifest..." });
        try {
          await createInitialManifest(context, rootPath);
          telemetry.log("command", "initialize_manifest_created");
        } catch (manifestErr) {
          telemetry.logError("initialize_manifest_failed", manifestErr);
          throw manifestErr;
        }
      },
    );

    telemetry.log("command", "initialize_copy_complete", {
      copiedCount,
      skippedCount,
    });

    // Offer environment setup (non-blocking)
    telemetry.log("command", "initialize_offering_setup");
    await offerEnvironmentSetup();

    const result = await vscode.window.showInformationMessage(
      '✅ Alex Cognitive Architecture initialized!\n\nNext steps:\n1. Open any file and start chatting with your AI assistant\n2. Run "Alex: Dream" periodically to maintain neural health\n3. Ask Alex to learn new domains as needed',
      "Getting Started",
      "Open Main Brain File",
      "Run Dream Protocol",
    );

    if (result === "Getting Started") {
      // Show detailed getting started panel
      const panel = vscode.window.createWebviewPanel(
        "alexGettingStarted",
        "Alex - Getting Started",
        vscode.ViewColumn.One,
        { enableScripts: false },
      );

      panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); line-height: 1.6; }
        h1 { color: var(--vscode-textLink-foreground); border-bottom: 1px solid var(--vscode-textSeparator-foreground); padding-bottom: 10px; }
        h2 { color: var(--vscode-textLink-activeForeground); margin-top: 24px; }
        .step { background: var(--vscode-textBlockQuote-background); border-left: 3px solid var(--vscode-textLink-foreground); padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
        .step-number { display: inline-block; background: var(--vscode-textLink-foreground); color: var(--vscode-editor-background); width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-weight: bold; }
        code { background: var(--vscode-textCodeBlock-background); padding: 2px 6px; border-radius: 3px; font-family: var(--vscode-editor-font-family); }
        .tip { background: var(--vscode-inputValidation-infoBackground); border: 1px solid var(--vscode-inputValidation-infoBorder); padding: 12px; border-radius: 4px; margin: 16px 0; }
        .important { background: var(--vscode-inputValidation-warningBackground); border: 1px solid var(--vscode-inputValidation-warningBorder); padding: 12px; border-radius: 4px; margin: 16px 0; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid var(--vscode-textSeparator-foreground); padding: 8px 12px; text-align: left; }
        th { background: var(--vscode-textBlockQuote-background); }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
    </style>
</head>
<body>
    <h1>🧠 Welcome to Alex Cognitive Architecture!</h1>
    <p>Alex is now installed and ready to be your cognitive learning partner.</p>
    
    <h2>🚀 Two Ways to Use Alex</h2>
    
    <div class="important">
        <strong>Key Concept:</strong> Alex works in two modes - both are valid, choose based on your needs!
    </div>
    
    <table>
        <tr>
            <th>Feature</th>
            <th>Agent (default)</th>
            <th>@alex</th>
        </tr>
        <tr>
            <td>Alex personality & memory</td>
            <td>✅ Automatic</td>
            <td>✅ Automatic</td>
        </tr>
        <tr>
            <td>Alex tools (synapse health, etc.)</td>
            <td>✅ Available</td>
            <td>✅ Available</td>
        </tr>
        <tr>
            <td>Slash commands (/meditate, /dream)</td>
            <td>❌</td>
            <td>✅</td>
        </tr>
        <tr>
            <td>Sticky conversation mode</td>
            <td>❌</td>
            <td>✅</td>
        </tr>
    </table>
    
    <h2>📋 Getting Started</h2>
    
    <div class="step">
        <span class="step-number">1</span>
        <strong>Open Copilot Chat</strong>
        <p>Press <code>Ctrl+Alt+I</code> (or <code>Cmd+Alt+I</code> on Mac) to open GitHub Copilot Chat.</p>
    </div>
    
    <div class="step">
        <span class="step-number">2</span>
        <strong>Just Start Chatting!</strong>
        <p>With <strong>Agent (default)</strong> mode, Alex's personality and capabilities are already active. Just type your question!</p>
    </div>
    
    <div class="step">
        <span class="step-number">3</span>
        <strong>Or Use @alex for Commands</strong>
        <p>Type <code>@alex</code> to access slash commands like <code>/meditate</code>, <code>/dream</code>, <code>/knowledge</code>, etc.</p>
    </div>
    
    <div class="step">
        <span class="step-number">4</span>
        <strong>Introduce Yourself</strong>
        <p>Tell Alex your name and preferences! Say <em>"My name is [your name]"</em> to enable personalized interactions.</p>
    </div>
    
    <h2>🔧 Essential Commands</h2>
    <ul>
        <li><code>@alex /meditate</code> - Consolidate knowledge after learning sessions</li>
        <li><code>@alex /dream</code> - Run neural maintenance (health checks)</li>
        <li><code>@alex /knowledge [query]</code> - Search cross-project knowledge</li>
        <li><code>@alex /saveinsight</code> - Save learnings for future projects</li>
        <li><code>@alex /status</code> - Check architecture status</li>
    </ul>
    
    <div class="tip">
        <strong>💡 Pro Tip:</strong> Run <code>Alex: Dream (Neural Maintenance)</code> from the Command Palette periodically to keep your cognitive architecture healthy!
    </div>
    
    <h2>📁 What Was Installed</h2>
    <ul>
        <li><code>.github/copilot-instructions.md</code> - Alex's main brain (loaded automatically)</li>
        <li><code>.github/instructions/</code> - Procedural memory (how-to knowledge)</li>
        <li><code>.github/prompts/</code> - Episodic memory (complex workflows)</li>
        <li><code>.github/domain-knowledge/</code> - Domain expertise files</li>
        <li><code>.github/config/</code> - Your settings and profile</li>
    </ul>
    
    <p style="margin-top: 24px; color: var(--vscode-descriptionForeground);">
        <em>Questions? Just ask in Copilot Chat - Alex is ready to help!</em>
    </p>
</body>
</html>`;
    } else if (result === "Open Main Brain File") {
      const brainFile = path.join(
        rootPath,
        ".github",
        "copilot-instructions.md",
      );
      const doc = await vscode.workspace.openTextDocument(brainFile);
      await vscode.window.showTextDocument(doc);
    } else if (result === "Run Dream Protocol") {
      await vscode.commands.executeCommand("alex.dream");
    }

    telemetry.log("command", "initialize_user_choice", {
      choice: result || "dismissed",
    });
    done(true, { copiedCount, skippedCount });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Initialize failed:", error);
    telemetry.logError("initialize_failed", error);
    done(false, error instanceof Error ? error : new Error(errorMessage));
    vscode.window.showErrorMessage(
      `Failed to initialize Alex: ${errorMessage || "Unknown error"}\n\nTry closing VS Code, deleting the .github folder, and running initialize again.`,
      { modal: true },
    );
  }
}

/**
 * Get the legacy manifest path (old location)
 */
function getLegacyManifestPath(rootPath: string): string {
  return path.join(rootPath, ".alex-manifest.json");
}

/**
 * Create initial manifest with checksums of all deployed files
 */
async function createInitialManifest(
  context: vscode.ExtensionContext,
  rootPath: string,
): Promise<void> {
  const extensionPath = context.extensionPath;

  // Clean up legacy manifest if it exists
  const legacyPath = getLegacyManifestPath(rootPath);
  if (await fs.pathExists(legacyPath)) {
    await fs.remove(legacyPath);
    console.log("Removed legacy manifest from root");
  }

  // Get version from extension package.json
  let version = "0.0.0";
  try {
    const packageJson = await fs.readJson(
      path.join(extensionPath, "package.json"),
    );
    version = packageJson.version || "0.0.0";
  } catch {
    console.warn("Could not read extension version");
  }

  const manifest: Manifest = {
    version,
    installedAt: new Date().toISOString(),
    files: {},
  };

  // Directories to scan for manifest entries
  const dirsToScan = [
    {
      dir: path.join(rootPath, ".github", "instructions"),
      prefix: ".github/instructions",
    },
    {
      dir: path.join(rootPath, ".github", "prompts"),
      prefix: ".github/prompts",
    },
    {
      dir: path.join(rootPath, ".github", "domain-knowledge"),
      prefix: ".github/domain-knowledge",
    },
    { dir: path.join(rootPath, ".github", "agents"), prefix: ".github/agents" },
  ];

  // Add copilot-instructions.md
  const brainFile = path.join(rootPath, ".github", "copilot-instructions.md");
  if (await fs.pathExists(brainFile)) {
    const content = await fs.readFile(brainFile, "utf8");
    manifest.files[".github/copilot-instructions.md"] = {
      type: "system",
      originalChecksum: calculateChecksum(content),
    };
  }

  // Scan directories
  for (const { dir, prefix } of dirsToScan) {
    if (await fs.pathExists(dir)) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.endsWith(".md")) {
          const filePath = path.join(dir, file);
          const content = await fs.readFile(filePath, "utf8");
          manifest.files[`${prefix}/${file}`] = {
            type: "system",
            originalChecksum: calculateChecksum(content),
          };
        }
      }
    }
  }

  // Save manifest
  const manifestPath = getManifestPath(rootPath);
  await fs.ensureDir(path.dirname(manifestPath));
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}
