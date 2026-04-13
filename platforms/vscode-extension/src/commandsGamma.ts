/**
 * commandsGamma.ts - Gamma presentation generation commands
 *
 * Extracted from commandsPresentation.ts to reduce file size.
 * Contains: topic-based generation, file-based generation, advanced options.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import { resolveMuscleScript } from './shared/utils';

/**
 * Check for GAMMA_API_KEY and prompt configuration if missing.
 * Returns true if the user wants to proceed, false to abort.
 */
async function ensureGammaApiKey(): Promise<boolean> {
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
      return false;
    }
    if (result === "Get API Key") {
      vscode.env.openExternal(vscode.Uri.parse("https://gamma.app/settings"));
      return false;
    }
    if (!result) {
      return false;
    }
  }
  return true;
}

export function registerGammaCommands(context: vscode.ExtensionContext): void {
  const generateGammaPresentationDisposable = vscode.commands.registerCommand(
    "alex.generateGammaPresentation",
    async () => {
      try {
        if (!await ensureGammaApiKey()) {
          return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("Please open a workspace folder.");
          return;
        }

        const gammaScript = await resolveMuscleScript("gamma-generator.cjs", workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!gammaScript) {
          vscode.window.showErrorMessage(
            "gamma-generator.cjs not found. Please ensure Alex architecture is initialized."
          );
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
          return;
        }

        vscode.window.showInformationMessage("Generating Gamma presentation...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Gamma Generation",
          cwd: workspaceFolder.uri.fsPath,
        });
        terminal.show();
        terminal.sendText(`node "${gammaScript}" --topic "${topic}" --export pptx --open`);
      } catch (error) {
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
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          return;
        }

        if (!await ensureGammaApiKey()) {
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          return;
        }

        const gammaScript = await resolveMuscleScript("gamma-generator.cjs", workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!gammaScript) {
          vscode.window.showErrorMessage(
            "gamma-generator.cjs not found. Please ensure Alex architecture is initialized."
          );
          return;
        }

        vscode.window.showInformationMessage("Generating Gamma presentation from file...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Gamma Generation",
          cwd: path.dirname(uri.fsPath),
        });
        terminal.show();
        terminal.sendText(`node "${gammaScript}" --file "${uri.fsPath}" --export pptx --open`);
      } catch (error) {
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
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          return;
        }

        if (!await ensureGammaApiKey()) {
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          return;
        }

        const gammaScript = await resolveMuscleScript("gamma-generator.cjs", workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!gammaScript) {
          vscode.window.showErrorMessage(
            "gamma-generator.cjs not found. Please ensure Alex architecture is initialized."
          );
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
          return;
        }

        vscode.window.showInformationMessage("Generating Gamma presentation with custom options...");

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
      } catch (error) {
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
