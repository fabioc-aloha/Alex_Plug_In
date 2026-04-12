/**
 * commandsPresentation.ts - Presentation and content creation commands
 *
 * Extracted from extension.ts to keep the main activation file focused.
 * Contains: diagram generation, PPTX generation, Word conversion, Gamma presentations.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import { openChatPanel, getLanguageIdFromPath } from './shared/utils';
import * as telemetry from './shared/telemetry';
import { registerWordCommands } from './commandsWord';
import { registerGammaCommands } from './commandsGamma';
import { registerConvertCommands } from './commandsConvert';

export function registerPresentationCommands(context: vscode.ExtensionContext): void {
  const generateDiagramDisposable = vscode.commands.registerCommand(
    "alex.generateDiagram",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "generate_diagram");
      try {
        const diagramTypes = [
          { label: "$(type-hierarchy) Class Diagram", description: "UML class relationships", value: "classDiagram" },
          { label: "$(git-merge) Sequence Diagram", description: "Interaction flow", value: "sequenceDiagram" },
          { label: "$(workflow) Flowchart", description: "Process flow", value: "flowchart" },
          { label: "$(database) ER Diagram", description: "Entity relationships", value: "erDiagram" },
          { label: "$(server) Architecture Diagram", description: "System components", value: "architecture" },
          { label: "$(symbol-state-machine) State Diagram", description: "State transitions", value: "stateDiagram" },
        ];

        const selected = await vscode.window.showQuickPick(diagramTypes, {
          placeHolder: "Select diagram type to generate",
          title: "Generate Mermaid Diagram",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        let contextCode = "";
        let contextDescription = "";
        let languageId = "";

        // If URI provided (from explorer context menu), read file content
        if (uri) {
          try {
            const content = await vscode.workspace.fs.readFile(uri);
            contextCode = new TextDecoder().decode(content);
            languageId = getLanguageIdFromPath(uri.fsPath);
            contextDescription = `Based on ${path.basename(uri.fsPath)} (${languageId}):\n`;
          } catch (err) {
            vscode.window.showErrorMessage(`Failed to read file: ${err}`);
            endLog(false);
            return;
          }
        } else {
          // Try active editor selection
          const editor = vscode.window.activeTextEditor;
          if (editor && !editor.selection.isEmpty) {
            contextCode = editor.document.getText(editor.selection);
            languageId = editor.document.languageId;
            contextDescription = `Based on this ${languageId} code:\n`;
          }
        }

        // If no context from selection/file, ask for a description
        let userDescription = "";
        if (!contextCode) {
          const input = await vscode.window.showInputBox({
            prompt: `Describe what the ${selected.label.replace(/\$\([^)]+\)\s*/, '')} should show`,
            placeHolder: "e.g. User authentication flow with login, MFA, and session management",
            ignoreFocusOut: true,
          });
          if (!input) {
            endLog(true);
            return;
          }
          userDescription = input;
        }

        const diagramType = selected.label.replace(/\$\([^)]+\)\s*/, '');

        // Build prompt for Agent chat to generate the diagram
        const codeBlock = contextCode ? `\n\n\`\`\`${languageId}\n${contextCode}\n\`\`\`` : '';
        const description = userDescription ? `\n\nDescription: ${userDescription}` : '';
        const prompt = `Generate a Mermaid ${diagramType} (${selected.value}).${contextDescription ? `\n${contextDescription}` : ''}${codeBlock}${description}\n\nCreate the diagram in a new markdown file with the Mermaid code block. Make the diagram comprehensive and well-labeled.`;

        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Generate PPTX command
  const generatePptxDisposable = vscode.commands.registerCommand(
    "alex.generatePptx",
    async () => {
      const endLog = telemetry.logTimed("command", "generate_pptx");
      try {
        const sourceOptions = [
          { label: "$(markdown) From Structured Markdown", description: "Convert .md with layout hints to PPTX", value: "markdown" },
          { label: "$(sparkle) Consult on Plain Text File", description: "AI-assisted storytelling design (Duarte method)", value: "plaintext" },
          { label: "$(selection) From Selection (Structured)", description: "Parse selected markdown directly", value: "selection" },
          { label: "$(sparkle) Consult on Selection", description: "AI transforms selection with consulting", value: "ai-selection" },
          { label: "$(new-file) New Presentation Template", description: "Create blank template to fill in", value: "new" },
        ];

        const selected = await vscode.window.showQuickPick(sourceOptions, {
          placeHolder: "Select presentation source",
          title: "Generate PowerPoint Presentation",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        // Import the generator dynamically to avoid loading it unnecessarily
        const { generateAndSavePresentation, parseMarkdownToSlides, hasSlideStructure, analyzeSlideContent } = await import("./generators/pptxGenerator");
        
        if (selected.value === "markdown") {
          // Let user pick a markdown file
          const mdFiles = await vscode.workspace.findFiles("**/*.md", "**/node_modules/**", 50);
          if (mdFiles.length === 0) {
            vscode.window.showWarningMessage("No markdown files found in workspace.");
            endLog(true);
            return;
          }

          const fileItems = mdFiles.map(uri => ({
            label: vscode.workspace.asRelativePath(uri),
            uri,
          }));

          const selectedFile = await vscode.window.showQuickPick(fileItems, {
            placeHolder: "Select markdown file to convert",
          });

          if (!selectedFile) {
            endLog(true);
            return;
          }

          const mdContent = (await vscode.workspace.fs.readFile(selectedFile.uri)).toString();
          
          // Check if content has structure
          if (!hasSlideStructure(mdContent)) {
            const choice = await vscode.window.showWarningMessage(
              "This file appears to be plain text without slide structure. Use AI to transform it?",
              "Use AI Transformation",
              "Try Anyway"
            );
            
            if (choice === "Use AI Transformation") {
              // Redirect to AI-assisted flow
              vscode.commands.executeCommand("alex.generatePptx");
              endLog(true);
              return;
            } else if (!choice) {
              endLog(true);
              return;
            }
          }
          
          const slides = parseMarkdownToSlides(mdContent);
          
          if (slides.length === 0) {
            vscode.window.showWarningMessage("No slides parsed from markdown. Use # for titles, - for bullets.");
            endLog(true);
            return;
          }
          
          // Analyze and show quality feedback
          const analysis = analyzeSlideContent(mdContent);
          if (analysis.suggestions.length > 0 && analysis.score < 60) {
            const improve = await vscode.window.showInformationMessage(
              `Quality score: ${analysis.score}/100. ${analysis.suggestions[0]}`,
              "Continue Anyway",
              "Cancel"
            );
            if (improve === "Cancel") {
              endLog(true);
              return;
            }
          }

          const outputPath = selectedFile.uri.fsPath.replace(/\.md$/, ".pptx");
          const result = await generateAndSavePresentation(
            slides,
            { title: selectedFile.label.replace(/\.md$/, "") },
            outputPath
          );

          if (result.success) {
            vscode.window.showInformationMessage(`Presentation saved: ${result.filePath} (${result.slideCount} slides)`);
            // Open containing folder
            vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(outputPath));
          } else {
            vscode.window.showErrorMessage(`Failed to generate: ${result.error}`);
          }

        } else if (selected.value === "selection") {
          const editor = vscode.window.activeTextEditor;
          const selection = editor?.selection;
          let selectedText = editor && selection && !selection.isEmpty ? editor.document.getText(selection) : '';

          // If no editor or no selection, fall back to input prompt
          if (!selectedText) {
            const userInput = await vscode.window.showInputBox({
              prompt: 'Enter markdown-formatted text for your presentation',
              placeHolder: '# Title\n- Point 1\n- Point 2\n---\n# Slide 2',
              ignoreFocusOut: true
            });
            
            if (!userInput) {
              endLog(true);
              return;
            }
            selectedText = userInput;
          }
          
          // Smart detection - suggest AI if no structure
          if (!hasSlideStructure(selectedText)) {
            const choice = await vscode.window.showWarningMessage(
              "This text doesn't have slide structure. Use AI to transform it?",
              "Use AI Transformation",
              "Try Anyway"
            );
            
            if (choice === "Use AI Transformation") {
              // Redirect to AI-assisted flow - the selection is already there
              vscode.commands.executeCommand("alex.generatePptx");
              endLog(true);
              return;
            } else if (!choice) {
              endLog(true);
              return;
            }
          }
          
          const slides = parseMarkdownToSlides(selectedText);

          if (slides.length === 0) {
            vscode.window.showWarningMessage("No slides parsed. Use # for titles, - for bullets, --- for slide breaks.");
            endLog(true);
            return;
          }

          const outputName = await vscode.window.showInputBox({
            prompt: "Enter presentation filename",
            value: "presentation.pptx",
            validateInput: (v) => v && v.endsWith(".pptx") ? null : "Must end with .pptx",
          });

          if (!outputName) {
            endLog(true);
            return;
          }

          const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          if (!workspaceFolder) {
            vscode.window.showWarningMessage("Open a workspace folder first.");
            endLog(true);
            return;
          }

          const outputPath = path.join(workspaceFolder, outputName);
          const result = await generateAndSavePresentation(
            slides,
            { title: outputName.replace(/\.pptx$/, "") },
            outputPath
          );

          if (result.success) {
            vscode.window.showInformationMessage(`Presentation saved: ${result.filePath} (${result.slideCount} slides)`);
            vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(outputPath));
          } else {
            vscode.window.showErrorMessage(`Failed to generate: ${result.error}`);
          }

        } else if (selected.value === "new") {
          // Create a markdown template for the user to fill in
          const template = `# Presentation Title

## Subtitle or Author

---

# Section 1

- First point
- Second point
- Third point

> Speaker notes go here

---

## Section Divider [section]

---

# Conclusion

- Summary point 1
- Summary point 2
- Call to action

---

<!-- PPTX Layout Reference:
  # Title              → Title slide or main heading
  ## Subtitle          → Subtitle on current slide
  ## Title [section]   → Purple section divider
  - bullet             → Bullet point
  > text               → Speaker notes
  ---                  → Slide separator
  | col | col |        → Table slide
-->
`;
          
          const doc = await vscode.workspace.openTextDocument({
            content: template,
            language: "markdown",
          });
          await vscode.window.showTextDocument(doc);
          vscode.window.showInformationMessage("Fill in the template, then run 'Generate Presentation' from the selection.");
        } else if (selected.value === "plaintext") {
          // AI-assisted plain text transformation
          const textFiles = await vscode.workspace.findFiles("**/*.{txt,md}", "**/node_modules/**", 50);
          if (textFiles.length === 0) {
            vscode.window.showWarningMessage("No text files found in workspace.");
            endLog(true);
            return;
          }

          const fileItems = textFiles.map(uri => ({
            label: vscode.workspace.asRelativePath(uri),
            uri,
          }));

          const selectedFile = await vscode.window.showQuickPick(fileItems, {
            placeHolder: "Select text file to transform into presentation",
          });

          if (!selectedFile) {
            endLog(true);
            return;
          }

          const textContent = (await vscode.workspace.fs.readFile(selectedFile.uri)).toString();
          
          // Present concept first (Duarte methodology)
          const consultingPrompt = `You are a presentation design consultant using the Duarte methodology (Nancy Duarte, "Resonate").

## PHASE 1: CONTENT ANALYSIS
I will analyze this content and present a narrative concept for your approval.

## SOURCE CONTENT:
\`\`\`
${textContent.substring(0, 6000)}
\`\`\`

---

## PHASE 2: PRESENTATION CONCEPT

Based on my analysis, here is the proposed **narrative storyboard**:

### 📊 PRESENTATION CONCEPT

**NARRATIVE ARC (Duarte Sparkline™):**
The presentation alternates between "what is" (current state) and "what could be" (better future) to maintain engagement.

\`\`\`
HOOK → PROBLEM (what is) → VISION (what could be) → SOLUTION → PROOF → CALL TO ACTION → NEW BLISS
\`\`\`

### PROPOSED SLIDE STRUCTURE:
1. **Title slide** - Hook that speaks to audience's challenge
2. **The current state** - What is (establish stakes)
3. **Why this matters** - Urgency/relevance
4. **[Section]** - The Vision (divider)
5. **What success looks like** - What could be  
6. **The path forward** - Solution overview
7. **Key evidence** - Data/stories that prove the point
8. **[Section]** - Taking Action (divider)
9. **Recommendations** - Concrete next steps
10. **Call to action** - The New Bliss (attainable future)

### SUGGESTED S.T.A.R. MOMENT™:
(Something They'll Always Remember - a dramatic comparison, story, or visualization)

---

## YOUR FEEDBACK:
Before I create the structured markdown, please tell me:
1. Who is the **audience**? (executives, developers, students, investors, etc.)
2. What should they **do/feel/know** after this presentation?
3. Any specific **stories, data, or quotes** to emphasize?
4. Anything to **add, remove, or reorder** in the structure above?

Reply with your feedback, or say "Generate slides" to proceed with this concept.

---

*After approval, I will generate the structured markdown for final review before PPTX creation.*`;

          // Open new document with consulting prompt
          const doc = await vscode.workspace.openTextDocument({
            content: consultingPrompt,
            language: "markdown",
          });
          await vscode.window.showTextDocument(doc);
          
          vscode.window.showInformationMessage(
            "Review the concept, then edit or ask Copilot to refine it.",
            "Open Copilot Chat"
          ).then(selection => {
            if (selection === "Open Copilot Chat") {
              vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
            }
          });
          
        } else if (selected.value === "ai-selection") {
          // AI-assisted selection transformation with consulting
          const editor = vscode.window.activeTextEditor;
          const selection = editor?.selection;
          let selectedText = editor && selection && !selection.isEmpty ? editor.document.getText(selection) : '';

          // If no editor or no selection, fall back to input prompt
          if (!selectedText) {
            const userInput = await vscode.window.showInputBox({
              prompt: 'Enter the text you want to transform into a presentation',
              placeHolder: 'e.g., Our Q1 results showed 20% growth with key wins in...',
              ignoreFocusOut: true
            });
            
            if (!userInput) {
              endLog(true);
              return;
            }
            selectedText = userInput;
          }
          
          // Consulting prompt with Duarte methodology
          const consultingPrompt = `You are a presentation design consultant using the Duarte methodology (Nancy Duarte, "Resonate").

## PHASE 1: CONTENT ANALYSIS
Analyzing the selected content to create a compelling presentation...

## SOURCE CONTENT:
\`\`\`
${selectedText.substring(0, 6000)}
\`\`\`

---

## PHASE 2: PRESENTATION CONCEPT

### 📊 NARRATIVE STORYBOARD

**Framework**: Duarte Sparkline™ - alternating "what is" ↔ "what could be"

**Proposed Arc**:
1. **HOOK** - Opening that establishes stakes and speaks to audience's challenge
2. **THE PROBLEM** - Current state (what is) that needs to change
3. **THE VISION** - Better future (what could be) that's possible
4. **THE PATH** - How to get from here to there  
5. **THE PROOF** - Evidence, data, stories that validate the approach
6. **THE ASK** - Clear call to action
7. **NEW BLISS** - Vision of success achieved (the "happily ever after")

### SUGGESTED S.T.A.R. MOMENT™:
*(Something They'll Always Remember - propose a memorable element)*

---

## YOUR FEEDBACK NEEDED:

1. **Audience**: Who will see this? (Their role, expertise level, concerns)
2. **Objective**: What should they think/feel/do after?
3. **Emphasis**: Any specific points, data, or stories to highlight?
4. **Constraints**: Time limit? Number of slides?

Reply with your answers, OR type **"Generate slides"** to proceed with this structure.

---

*Once approved, I'll create the structured markdown for your review before generating the PPTX.*`;

          const doc = await vscode.workspace.openTextDocument({
            content: consultingPrompt,
            language: "markdown",
          });
          await vscode.window.showTextDocument(doc);
          
          vscode.window.showInformationMessage(
            "Select all (Ctrl+A), then press Ctrl+I to execute this prompt.",
            "Open Copilot Chat"
          ).then(selection => {
            if (selection === "Open Copilot Chat") {
              vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
            }
          });
        }

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(`PPTX generation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  );

  // Generate PPTX from file (explorer context menu)
  const generatePptxFromFileDisposable = vscode.commands.registerCommand(
    "alex.generatePptxFromFile",
    async (uri: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "generate_pptx_from_file");
      try {
        if (!uri || !uri.fsPath.endsWith(".md")) {
          vscode.window.showWarningMessage("Please right-click a markdown (.md) file.");
          endLog(true);
          return;
        }

        const { generateAndSavePresentation, parseMarkdownToSlides } = await import("./generators/pptxGenerator");
        
        const mdContent = (await vscode.workspace.fs.readFile(uri)).toString();
        const slides = parseMarkdownToSlides(mdContent);
        
        if (slides.length === 0) {
          vscode.window.showWarningMessage("No slides parsed from markdown. Use # for titles, - for bullets, --- for slide breaks.");
          endLog(true);
          return;
        }

        const outputPath = uri.fsPath.replace(/\.md$/, ".pptx");
        const fileName = path.basename(uri.fsPath, ".md") || "presentation";
        
        const result = await generateAndSavePresentation(
          slides,
          { title: fileName },
          outputPath
        );

        if (result.success) {
          vscode.window.showInformationMessage(`Presentation saved: ${result.filePath} (${result.slideCount} slides)`);
          vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(outputPath));
        } else {
          vscode.window.showErrorMessage(`Failed to generate: ${result.error}`);
        }

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(`PPTX generation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  );

  context.subscriptions.push(
    generateDiagramDisposable,
    generatePptxDisposable,
    generatePptxFromFileDisposable,
  );

  // Register extracted command modules
  registerWordCommands(context);
  registerGammaCommands(context);
  registerConvertCommands(context);
}
