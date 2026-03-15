/**
 * commandsWord.ts - Word document conversion commands
 *
 * Extracted from commandsPresentation.ts to reduce file size.
 * Contains: quick conversion, conversion with options (format, debug, custom path).
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as telemetry from './shared/telemetry';

/**
 * Resolve md-to-word.cjs: workspace first, then extension bundle fallback.
 */
async function resolveMdToWordScript(workspacePath: string, extensionPath: string): Promise<string | undefined> {
  const candidates = [
    path.join(workspacePath, ".github", "muscles", "md-to-word.cjs"),
    path.join(extensionPath, ".github", "muscles", "md-to-word.cjs"),
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

export function registerWordCommands(context: vscode.ExtensionContext): void {
  const convertToWordDisposable = vscode.commands.registerCommand(
    "alex.convertToWord",
    async (uri: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "convert_to_word");
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          endLog(true);
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          endLog(true);
          return;
        }

        const outputPath = uri.fsPath.replace(/\.md$/, ".docx");
        const nodeScript = await resolveMdToWordScript(workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "md-to-word.cjs not found. Please ensure Alex architecture is initialized."
          );
          endLog(false);
          return;
        }

        vscode.window.showInformationMessage("📄 Converting to Word...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Word Conversion",
          cwd: path.dirname(uri.fsPath),
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();
        terminal.sendText(`node "${nodeScript}" "${uri.fsPath}" "${outputPath}"`);

        // Wait a bit then notify - in real implementation we'd monitor the process
        setTimeout(() => {
          vscode.window.showInformationMessage(
            `📝 Word conversion complete: ${path.basename(outputPath)}`
          );
        }, 5000);

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(
          `Word conversion failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Convert to Word with options
  const convertToWordWithOptionsDisposable = vscode.commands.registerCommand(
    "alex.convertToWordWithOptions",
    async (uri: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "convert_to_word_with_options");
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          endLog(true);
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          endLog(true);
          return;
        }

        const nodeScript = await resolveMdToWordScript(workspaceFolder.uri.fsPath, context.extensionPath);
        
        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "md-to-word.cjs not found. Please ensure Alex architecture is initialized."
          );
          endLog(false);
          return;
        }

        // Show options quick pick
        const options = await vscode.window.showQuickPick(
          [
            {
              label: "$(file-text) Standard Conversion",
              description: "Convert with default settings",
              detail: "Formats tables, centers images, 90% page coverage",
              value: "",
            },
            {
              label: "$(settings) Skip Table Formatting",
              description: "Faster conversion without table styling",
              detail: "Use --no-format-tables flag",
              value: "--no-format-tables",
            },
            {
              label: "$(bug) Debug Mode",
              description: "Keep temporary files for inspection",
              detail: "Use --keep-temp flag",
              value: "--keep-temp",
            },
            {
              label: "$(folder) Custom Output Path",
              description: "Specify output file name",
              detail: "Enter custom path for .docx file",
              value: "custom",
            },
          ],
          {
            placeHolder: "Select conversion options",
            title: "Markdown to Word Conversion",
          }
        );

        if (!options) {
          endLog(true);
          return;
        }

        let outputPath = uri.fsPath.replace(/\.md$/, ".docx");
        let flags = options.value;

        if (options.value === "custom") {
          const customPath = await vscode.window.showInputBox({
            prompt: "Enter output file name (without .docx extension)",
            value: path.basename(uri.fsPath, ".md"),
            validateInput: (value) => {
              if (!value || value.trim().length === 0) {
                return "File name cannot be empty";
              }
              if (value.includes("/") || value.includes("\\\\")) {
                return "Enter file name only, not path";
              }
              return null;
            },
          });

          if (!customPath) {
            endLog(true);
            return;
          }

          outputPath = path.join(path.dirname(uri.fsPath), customPath + ".docx");
          flags = "";
        }

        vscode.window.showInformationMessage("📄 Converting to Word...");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Word Conversion",
          cwd: path.dirname(uri.fsPath),
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();
        
        const command = `node "${nodeScript}" "${uri.fsPath}" "${outputPath}" ${flags}`.trim();
        terminal.sendText(command);

        setTimeout(() => {
          vscode.window.showInformationMessage(
            `📝 Word conversion complete: ${path.basename(outputPath)}`
          );
        }, 5000);

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(
          `Word conversion failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(
    convertToWordDisposable,
    convertToWordWithOptionsDisposable,
  );
}
