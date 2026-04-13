/**
 * commandsConvert.ts - Additional conversion commands for the converter trifecta
 *
 * Commands:
 * - alex.convertToEmail: Convert Markdown to RFC 5322 .eml files
 * - alex.convertToHtml: Convert Markdown to standalone HTML pages
 * - alex.convertDocxToMarkdown: Convert Word .docx to Markdown
 * - alex.scaffoldMarkdown: Create new Markdown file from template
 * - alex.injectNavigation: Inject navigation table from nav.json
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { resolveMuscleScript } from './shared/utils';

export function registerConvertCommands(context: vscode.ExtensionContext): void {
  // --------------------------------------------------
  // alex.convertToEmail - Convert Markdown to .eml
  // --------------------------------------------------
  const convertToEmailDisposable = vscode.commands.registerCommand(
    "alex.convertToEmail",
    async (uri: vscode.Uri) => {
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          return;
        }

        const nodeScript = await resolveMuscleScript(
          "md-to-eml.cjs",
          workspaceFolder.uri.fsPath,
          context.extensionPath
        );

        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "md-to-eml.cjs not found. Please ensure Alex architecture is initialized."
          );
          return;
        }

        // Check for test mode option
        const testMode = await vscode.window.showQuickPick(
          [
            { label: "$(mail) Production Mode", description: "Use recipients from frontmatter", value: false },
            { label: "$(beaker) Test Mode", description: "Override recipients for testing", value: true },
          ],
          { placeHolder: "Select email generation mode" }
        );

        if (testMode === undefined) {
          return;
        }

        const terminal = vscode.window.createTerminal({
          name: "Alex: Email Conversion",
          cwd: path.dirname(uri.fsPath),
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();

        const flags = testMode.value ? "--test" : "";
        terminal.sendText(`node "${nodeScript}" "${uri.fsPath}" ${flags}`.trim());
      } catch (error) {
        vscode.window.showErrorMessage(
          `Email conversion failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // --------------------------------------------------
  // alex.scaffoldMarkdown - Create Markdown from template
  // --------------------------------------------------
  const scaffoldMarkdownDisposable = vscode.commands.registerCommand(
    "alex.scaffoldMarkdown",
    async (uri?: vscode.Uri) => {
      try {
        // Determine target directory
        let targetDir: string;
        if (uri && uri.fsPath) {
          const stat = await vscode.workspace.fs.stat(uri);
          targetDir = stat.type === vscode.FileType.Directory
            ? uri.fsPath
            : path.dirname(uri.fsPath);
        } else {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage("No workspace folder open.");
            return;
          }
          targetDir = workspaceFolders[0].uri.fsPath;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(targetDir));
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("Target must be in a workspace folder.");
          return;
        }

        const nodeScript = await resolveMuscleScript(
          "md-scaffold.cjs",
          workspaceFolder.uri.fsPath,
          context.extensionPath
        );

        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "md-scaffold.cjs not found. Please ensure Alex architecture is initialized."
          );
          return;
        }

        // Select template type
        const templateType = await vscode.window.showQuickPick(
          [
            { label: "$(file-text) Report", description: "Formal report with TOC and appendix", value: "report" },
            { label: "$(book) Tutorial", description: "Step-by-step guide with exercises", value: "tutorial" },
            { label: "$(references) Reference", description: "CLI/API reference documentation", value: "reference" },
            { label: "$(preview) Slides", description: "Gamma-ready presentation", value: "slides" },
            { label: "$(mail) Email", description: "Newsletter/governance email", value: "email" },
          ],
          { placeHolder: "Select template type" }
        );

        if (!templateType) {
          return;
        }

        // Get document title
        const title = await vscode.window.showInputBox({
          prompt: "Enter document title",
          placeHolder: "My New Document",
          validateInput: (value) => {
            if (!value || value.trim().length === 0) {
              return "Title cannot be empty";
            }
            return null;
          },
        });

        if (!title) {
          return;
        }

        // Generate filename from title
        const filename = title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '.md';
        const outputPath = path.join(targetDir, filename);

        // Check if file already exists
        if (fs.existsSync(outputPath)) {
          const overwrite = await vscode.window.showWarningMessage(
            `File ${filename} already exists. Overwrite?`,
            "Yes", "No"
          );
          if (overwrite !== "Yes") {
            return;
          }
        }

        const terminal = vscode.window.createTerminal({
          name: "Alex: Scaffold Markdown",
          cwd: targetDir,
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();
        terminal.sendText(`node "${nodeScript}" --output "${outputPath}" ${templateType.value} "${title}"`);

        // Wait for file creation then open it
        setTimeout(async () => {
          try {
            const doc = await vscode.workspace.openTextDocument(outputPath);
            await vscode.window.showTextDocument(doc);
          } catch {
            // File may not exist yet if script is slow
          }
        }, 2000);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Scaffold failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // --------------------------------------------------
  // alex.injectNavigation - Inject nav table from nav.json
  // --------------------------------------------------
  const injectNavigationDisposable = vscode.commands.registerCommand(
    "alex.injectNavigation",
    async (uri: vscode.Uri) => {
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          return;
        }

        const nodeScript = await resolveMuscleScript(
          "nav-inject.cjs",
          workspaceFolder.uri.fsPath,
          context.extensionPath
        );

        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "nav-inject.cjs not found. Please ensure Alex architecture is initialized."
          );
          return;
        }

        // Look for nav.json in the file's directory or parent directories
        let navJsonPath: string | undefined;
        let searchDir = path.dirname(uri.fsPath);
        const rootDir = workspaceFolder.uri.fsPath;

        while (searchDir.startsWith(rootDir)) {
          const candidate = path.join(searchDir, "nav.json");
          if (fs.existsSync(candidate)) {
            navJsonPath = candidate;
            break;
          }
          const parent = path.dirname(searchDir);
          if (parent === searchDir) { break; }
          searchDir = parent;
        }

        if (!navJsonPath) {
          // Offer to create nav.json
          const createNav = await vscode.window.showWarningMessage(
            "No nav.json found. Create one?",
            "Create nav.json", "Cancel"
          );
          if (createNav !== "Create nav.json") {
            return;
          }

          // Run --init to create starter nav.json
          const terminal = vscode.window.createTerminal({
            name: "Alex: Navigation Init",
            cwd: path.dirname(uri.fsPath),
            env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
          });
          terminal.show();
          terminal.sendText(`node "${nodeScript}" --init`);

          vscode.window.showInformationMessage(
            "Created nav.json. Edit it, then run Inject Navigation again."
          );
          return;
        }

        // Preview or inject
        const action = await vscode.window.showQuickPick(
          [
            { label: "$(eye) Preview", description: "Dry run - show changes without modifying files", value: "--dry-run" },
            { label: "$(pencil) Inject", description: "Update navigation in all files", value: "" },
          ],
          { placeHolder: "Select action" }
        );

        if (action === undefined) {
          return;
        }

        const terminal = vscode.window.createTerminal({
          name: "Alex: Navigation Inject",
          cwd: path.dirname(navJsonPath),
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();
        terminal.sendText(`node "${nodeScript}" "${navJsonPath}" ${action.value}`.trim());
      } catch (error) {
        vscode.window.showErrorMessage(
          `Navigation injection failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // --------------------------------------------------
  // alex.convertToHtml - Convert Markdown to HTML
  // --------------------------------------------------
  const convertToHtmlDisposable = vscode.commands.registerCommand(
    "alex.convertToHtml",
    async (uri: vscode.Uri) => {
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          return;
        }

        const nodeScript = await resolveMuscleScript(
          "md-to-html.cjs",
          workspaceFolder.uri.fsPath,
          context.extensionPath
        );

        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "md-to-html.cjs not found. Please ensure Alex architecture is initialized."
          );
          return;
        }

        const styleChoice = await vscode.window.showQuickPick(
          [
            { label: "$(globe) Professional", description: "Clean business style (Segoe UI)", value: "professional" },
            { label: "$(mortar-board) Academic", description: "Serif style (Palatino)", value: "academic" },
            { label: "$(dash) Minimal", description: "Modern clean style (Inter)", value: "minimal" },
            { label: "$(color-mode) Dark", description: "Dark mode style", value: "dark" },
          ],
          { placeHolder: "Select HTML style preset" }
        );

        if (styleChoice === undefined) {
          return;
        }

        const terminal = vscode.window.createTerminal({
          name: "Alex: HTML Conversion",
          cwd: path.dirname(uri.fsPath),
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();
        terminal.sendText(`node "${nodeScript}" "${uri.fsPath}" --style ${styleChoice.value}`);
      } catch (error) {
        vscode.window.showErrorMessage(
          `HTML conversion failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // --------------------------------------------------
  // alex.convertDocxToMarkdown - Convert Word to Markdown
  // --------------------------------------------------
  const convertDocxToMarkdownDisposable = vscode.commands.registerCommand(
    "alex.convertDocxToMarkdown",
    async (uri: vscode.Uri) => {
      try {
        if (!uri || !uri.fsPath.toLowerCase().endsWith(".docx")) {
          vscode.window.showWarningMessage("Please right-click a Word (.docx) file.");
          return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage("File must be in a workspace folder.");
          return;
        }

        const nodeScript = await resolveMuscleScript(
          "docx-to-md.cjs",
          workspaceFolder.uri.fsPath,
          context.extensionPath
        );

        if (!nodeScript) {
          vscode.window.showErrorMessage(
            "docx-to-md.cjs not found. Please ensure Alex architecture is initialized."
          );
          return;
        }

        const flags: string[] = [];

        const optionChoice = await vscode.window.showQuickPick(
          [
            { label: "$(file-text) Basic", description: "Clean conversion with image extraction", value: "basic" },
            { label: "$(wrench) Full cleanup", description: "Fix headings, add frontmatter, strip comments", value: "full" },
          ],
          { placeHolder: "Select conversion options" }
        );

        if (optionChoice === undefined) {
          return;
        }

        if (optionChoice.value === "full") {
          flags.push("--fix-headings", "--add-frontmatter", "--strip-comments");
        }

        const outputPath = uri.fsPath.replace(/\.docx$/i, ".md");

        const terminal = vscode.window.createTerminal({
          name: "Alex: Word to Markdown",
          cwd: path.dirname(uri.fsPath),
          env: { NODE_PATH: path.join(context.extensionPath, 'node_modules') }
        });
        terminal.show();
        terminal.sendText(`node "${nodeScript}" "${uri.fsPath}" ${flags.join(' ')}`.trim());

        // Try to open the output file once the script likely finishes
        setTimeout(async () => {
          try {
            const doc = await vscode.workspace.openTextDocument(outputPath);
            await vscode.window.showTextDocument(doc);
          } catch {
            // Script may still be running
          }
        }, 3000);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Word conversion failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(
    convertToEmailDisposable,
    scaffoldMarkdownDisposable,
    injectNavigationDisposable,
    convertToHtmlDisposable,
    convertDocxToMarkdownDisposable,
  );
}
