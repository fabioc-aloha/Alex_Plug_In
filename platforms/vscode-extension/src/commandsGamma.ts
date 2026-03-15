/**
 * commandsGamma.ts - Gamma presentation generation commands
 *
 * Extracted from commandsPresentation.ts to reduce file size.
 * Contains: topic-based generation, file-based generation, advanced options.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as telemetry from './shared/telemetry';

/**
 * Resolve gamma-generator.cjs: workspace first, then extension bundle fallback.
 */
async function resolveGammaScript(workspacePath: string, extensionPath: string): Promise<string | undefined> {
  const candidates = [
    path.join(workspacePath, ".github", "muscles", "gamma-generator.cjs"),
    path.join(extensionPath, ".github", "muscles", "gamma-generator.cjs"),
  ];
  for (const candidate of candidates) {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(candidate));
      return candidate;
    } catch {
      // try next
    }
  }
  return undefined;
}

export function registerGammaCommands(context: vscode.ExtensionContext): void {
  const generateGammaPresentationDisposable = vscode.commands.registerCommand(
    "alex.generateGammaPresentation",
    async () => {
      const endLog = telemetry.logTimed("command", "generate_gamma_presentation");
      try {
        // Check for GAMMA_API_KEY
        const { getToken } = await import("./services/secretsManager");
        const gammaApiKey = getToken("GAMMA_API_KEY");
        if (!gammaApiKey) {
          const result = await vscode.window.showWarningMessage(
            "Gamma API Key not configured. Set your API key to use presentation generation.",
            "Configure API Key",
            "Get API Key",
            "Continue Anyway"
          );
          if (result === "Configure API Key") {
            vscode.commands.executeCommand("alex.manageSecrets");
            endLog(true);
            return;
          }
          if (result === "Get API Key") {
            vscode.env.openExternal(vscode.Uri.parse("https://gamma.app/settings"));
            endLog(true);
            return;
          }
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("Please open a workspace folder.");
          endLog(true);
          return;
        }

        const gammaScript = await resolveGammaScript(workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!gammaScript) {
          vscode.window.showErrorMessage(
            "gamma-generator.cjs not found. Please ensure Alex architecture is initialized."
          );
          endLog(false);
          return;
        }

        // Get topic from user
        const topic = await vscode.window.showInputBox({
          prompt: "Enter presentation topic",
          placeHolder: "e.g., Introduction to Machine Learning",
          validateInput: (value) => {
            if (!value || value.trim().length === 0) {
              return "Topic cannot be empty";
            }
            return null;
          },
        });

        if (!topic) {
          endLog(true);
          return;
        }

        vscode.window.showInformationMessage("🎨 Generating Gamma presentation...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Gamma Generation",
          cwd: workspaceFolder.uri.fsPath,
        });
        terminal.show();
        terminal.sendText(`node "${gammaScript}" --topic "${topic}" --export pptx --open`);

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(
          `Gamma generation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Generate Gamma from File - Context menu for .md files
  const generateGammaFromFileDisposable = vscode.commands.registerCommand(
    "alex.generateGammaFromFile",
    async (uri: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "generate_gamma_from_file");
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          endLog(true);
          return;
        }

        // Check for Node.js
        try {
          const { execSync } = await import("child_process");
          execSync("node --version", { stdio: "ignore" });
        } catch {
          const result = await vscode.window.showErrorMessage(
            "Node.js is required for Gamma generation but was not found.",
            "Download Node.js",
            "Cancel"
          );
          if (result === "Download Node.js") {
            vscode.env.openExternal(vscode.Uri.parse("https://nodejs.org/"));
          }
          endLog(false);
          return;
        }

        // Check for GAMMA_API_KEY
        const { getToken } = await import("./services/secretsManager");
        const gammaApiKey = getToken("GAMMA_API_KEY");
        if (!gammaApiKey) {
          const result = await vscode.window.showWarningMessage(
            "Gamma API Key not configured. Set your API key to use presentation generation.",
            "Configure API Key",
            "Get API Key",
            "Continue Anyway"
          );
          if (result === "Configure API Key") {
            vscode.commands.executeCommand("alex.manageSecrets");
            endLog(true);
            return;
          }
          if (result === "Get API Key") {
            vscode.env.openExternal(vscode.Uri.parse("https://gamma.app/settings"));
            endLog(true);
            return;
          }
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          endLog(true);
          return;
        }

        const gammaScript = await resolveGammaScript(workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!gammaScript) {
          vscode.window.showErrorMessage(
            "gamma-generator.cjs not found. Please ensure Alex architecture is initialized."
          );
          endLog(false);
          return;
        }

        vscode.window.showInformationMessage("🎨 Generating Gamma presentation from file...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Gamma Generation",
          cwd: path.dirname(uri.fsPath),
        });
        terminal.show();
        terminal.sendText(`node "${gammaScript}" --file "${uri.fsPath}" --export pptx --open`);

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(
          `Gamma generation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Generate Gamma with Options - Advanced customization
  const generateGammaWithOptionsDisposable = vscode.commands.registerCommand(
    "alex.generateGammaWithOptions",
    async (uri: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "generate_gamma_with_options");
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          endLog(true);
          return;
        }

        // Check for Node.js
        try {
          const { execSync } = await import("child_process");
          execSync("node --version", { stdio: "ignore" });
        } catch {
          const result = await vscode.window.showErrorMessage(
            "Node.js is required for Gamma generation but was not found.",
            "Download Node.js",
            "Cancel"
          );
          if (result === "Download Node.js") {
            vscode.env.openExternal(vscode.Uri.parse("https://nodejs.org/"));
          }
          endLog(false);
          return;
        }

        // Check for GAMMA_API_KEY
        const { getToken } = await import("./services/secretsManager");
        const gammaApiKey = getToken("GAMMA_API_KEY");
        if (!gammaApiKey) {
          const result = await vscode.window.showWarningMessage(
            "Gamma API Key not configured. Set your API key to use presentation generation.",
            "Configure API Key",
            "Get API Key",
            "Continue Anyway"
          );
          if (result === "Configure API Key") {
            vscode.commands.executeCommand("alex.manageSecrets");
            endLog(true);
            return;
          }
          if (result === "Get API Key") {
            vscode.env.openExternal(vscode.Uri.parse("https://gamma.app/settings"));
            endLog(true);
            return;
          }
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          endLog(true);
          return;
        }

        const gammaScript = await resolveGammaScript(workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!gammaScript) {
          vscode.window.showErrorMessage(
            "gamma-generator.cjs not found. Please ensure Alex architecture is initialized."
          );
          endLog(false);
          return;
        }

        // Show options quick pick
        const formatOption = await vscode.window.showQuickPick(
          [
            {
              label: "$(presentation) Presentation",
              description: "Full slide deck (default)",
              value: "presentation",
            },
            {
              label: "$(file-text) Document",
              description: "Long-form document",
              value: "document",
            },
            {
              label: "$(mention) Social Media",
              description: "Social media carousel",
              value: "social",
            },
            {
              label: "$(globe) Webpage",
              description: "Web page layout",
              value: "webpage",
            },
          ],
          {
            placeHolder: "Select output format",
            title: "Gamma Presentation Options - Step 1/4",
          }
        );

        if (!formatOption) {
          endLog(true);
          return;
        }

        // Get number of slides
        const slidesInput = await vscode.window.showInputBox({
          prompt: "Number of slides/cards (1-75)",
          value: "10",
          validateInput: (value) => {
            const num = parseInt(value, 10);
            if (isNaN(num) || num < 1 || num > 75) {
              return "Enter a number between 1 and 75";
            }
            return null;
          },
          title: "Gamma Presentation Options - Step 2/4",
        });

        if (!slidesInput) {
          endLog(true);
          return;
        }

        // Image model selection with accurate credit costs
        const imageModelOption = await vscode.window.showQuickPick(
          [
            {
              label: "$(zap) flux-quick",
              description: "~2 credits/image - Fast testing",
              value: "flux-quick",
            },
            {
              label: "$(star) flux-pro",
              description: "~15 credits/image - Recommended",
              value: "flux-pro",
            },
            {
              label: "$(star-full) ideogram",
              description: "~20 credits/image - Premium quality",
              value: "ideogram",
            },
            {
              label: "$(symbol-color) dalle3",
              description: "~33 credits/image - DALL-E 3",
              value: "dalle3",
            },
            {
              label: "$(image) imagen-pro",
              description: "~12 credits/image - Google Imagen",
              value: "imagen-pro",
            },
            {
              label: "$(flame) flux-ultra",
              description: "~40 credits/image - Highest quality",
              value: "flux-ultra",
            },
          ],
          {
            placeHolder: "Select AI image model (affects credits)",
            title: "Gamma Presentation Options - Step 3/4",
          }
        );

        if (!imageModelOption) {
          endLog(true);
          return;
        }

        // Export format
        const exportOption = await vscode.window.showQuickPick(
          [
            {
              label: "$(file-powerpoint) PPTX",
              description: "PowerPoint format (editable)",
              value: "pptx",
            },
            {
              label: "$(file-pdf) PDF",
              description: "PDF format (shareable)",
              value: "pdf",
            },
            {
              label: "$(globe) Web Only",
              description: "No export, view online",
              value: "",
            },
          ],
          {
            placeHolder: "Select export format",
            title: "Gamma Presentation Options - Step 4/4",
          }
        );

        if (!exportOption) {
          endLog(true);
          return;
        }

        vscode.window.showInformationMessage("🎨 Generating Gamma presentation with custom options...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Gamma Generation",
          cwd: path.dirname(uri.fsPath),
        });
        terminal.show();

        let command = `node "${gammaScript}" --file "${uri.fsPath}" --format ${formatOption.value} --slides ${slidesInput} --image-model ${imageModelOption.value}`;
        
        if (exportOption.value) {
          command += ` --export ${exportOption.value}`;
        }
        
        command += ` --open`;
        
        terminal.sendText(command);

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(
          `Gamma generation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(
    generateGammaPresentationDisposable,
    generateGammaFromFileDisposable,
    generateGammaWithOptionsDisposable,
  );
}
