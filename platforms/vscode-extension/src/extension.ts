import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import {
  initializeArchitecture,
  resetArchitecture,
} from "./commands/initialize";
import { runDreamProtocol } from "./commands/dream";
import {
  setupEnvironment,
  offerEnvironmentSetup,
} from "./commands/setupEnvironment";
import { upgradeArchitecture, completeMigration, showMigrationCandidates } from "./commands/upgrade";
import { runSelfActualization } from "./commands/self-actualization";
import { runExportForM365 } from "./commands/exportForM365";
import { registerContextMenuCommands } from "./commands/contextMenu";
import {
  initializeSessionStatusBar,
  startSession,
  endSession,
  togglePauseSession,
  showSessionActions,
  disposeSession,
  getCurrentSession,
} from "./commands/session";
import { registerGoalsCommands, getGoalsSummary } from "./commands/goals";
import { generateSkillCatalog } from "./commands/skillCatalog";
import { registerChatParticipant, resetSessionState } from "./chat/participant";
import { registerLanguageModelTools } from "./chat/tools";
import {
  registerGlobalKnowledgeTools,
  ensureGlobalKnowledgeDirectories,
  registerCurrentProject,
} from "./chat/globalKnowledge";
import {
  registerCloudSyncTools,
  syncWithCloud,
  pushToCloud,
  pullFromCloud,
  getCloudUrl,
  startBackgroundSync,
} from "./chat/cloudSync";
import {
  checkHealth,
  getStatusBarDisplay,
  clearHealthCache,
  HealthStatus,
  registerSessionProvider,
  registerStreakProvider,
} from "./shared/healthCheck";
import { registerWelcomeView } from "./views/welcomeView";
import { registerHealthDashboard } from "./views/healthDashboard";
import * as telemetry from "./shared/telemetry";

// Operation lock to prevent concurrent modifications
let operationInProgress = false;

// Status bar item for Alex health
let statusBarItem: vscode.StatusBarItem;

/**
 * Check if an Alex operation is currently in progress
 */
export function isOperationInProgress(): boolean {
  return operationInProgress;
}

async function withOperationLock<T>(
  operationName: string,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  if (operationInProgress) {
    vscode.window.showWarningMessage(
      `Another Alex operation is already in progress. Please wait for it to complete before running "${operationName}".`,
    );
    return undefined;
  }

  operationInProgress = true;
  try {
    return await operation();
  } finally {
    operationInProgress = false;
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Get extension version for telemetry
  const extensionVersion = context.extension.packageJSON.version || "unknown";

  // Initialize beta telemetry (temporary - remove after beta)
  telemetry.initTelemetry(context, extensionVersion);
  telemetry.log("lifecycle", "extension_activate", {
    extensionVersion,
    vscodeVersion: vscode.version,
  });

  console.log("Alex Cognitive Architecture is now active!");

  // Check for version upgrade and notify user
  checkVersionUpgrade(context);

  // Register chat participant for @alex conversations
  registerChatParticipant(context);

  // Register language model tools for AI-powered operations
  registerLanguageModelTools(context);

  // Register global knowledge tools for cross-project learning
  registerGlobalKnowledgeTools(context);

  // Register cloud sync tools for GitHub Gist backup
  registerCloudSyncTools(context);

  // Register context menu commands (Ask Alex, Save to Knowledge, Search Related)
  registerContextMenuCommands(context);

  // Register welcome view in Activity Bar
  const welcomeViewProvider = registerWelcomeView(context);

  // Register health dashboard webview
  registerHealthDashboard(context);

  // === UNCONSCIOUS MIND: Start background sync ===
  // This creates Alex's transparent knowledge backup system
  startBackgroundSync(context);

  // Initialize global knowledge base directories
  ensureGlobalKnowledgeDirectories()
    .then(() => {
      // Register current project in the global registry
      registerCurrentProject().catch((err) => {
        console.warn("Failed to register current project:", err);
      });
    })
    .catch((err) => {
      console.warn("Failed to initialize global knowledge directories:", err);
    });

  let initDisposable = vscode.commands.registerCommand(
    "alex.initialize",
    async () => {
      const done = telemetry.logTimed("command", "initialize");
      await withOperationLock("Initialize", async () => {
        try {
          await initializeArchitecture(context);
          // Refresh status bar after initialization
          clearHealthCache();
          await updateStatusBar(context, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  let resetDisposable = vscode.commands.registerCommand(
    "alex.reset",
    async () => {
      const done = telemetry.logTimed("command", "reset");
      await withOperationLock("Reset", async () => {
        try {
          await resetArchitecture(context);
          // Refresh status bar after reset
          clearHealthCache();
          await updateStatusBar(context, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  let dreamDisposable = vscode.commands.registerCommand(
    "alex.dream",
    async () => {
      const done = telemetry.logTimed("command", "dream");
      await withOperationLock("Dream Protocol", async () => {
        try {
          await runDreamProtocol(context);
          // Refresh status bar after dream (synapses may have been repaired)
          clearHealthCache();
          await updateStatusBar(context, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  let upgradeDisposable = vscode.commands.registerCommand(
    "alex.upgrade",
    async () => {
      const done = telemetry.logTimed("command", "upgrade");
      await withOperationLock("Upgrade", async () => {
        try {
          await upgradeArchitecture(context);
          // Refresh status bar after upgrade
          clearHealthCache();
          await updateStatusBar(context, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  let completeMigrationDisposable = vscode.commands.registerCommand(
    "alex.completeMigration",
    async () => {
      const done = telemetry.logTimed("command", "complete_migration");
      await withOperationLock("Migration", async () => {
        try {
          await completeMigration(context);
          clearHealthCache();
          await updateStatusBar(context, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  let showMigrationDisposable = vscode.commands.registerCommand(
    "alex.showMigrationCandidates",
    async () => {
      telemetry.log("command", "show_migration_candidates");
      await showMigrationCandidates();
    },
  );

  let selfActualizeDisposable = vscode.commands.registerCommand(
    "alex.selfActualize",
    async () => {
      const done = telemetry.logTimed("command", "self_actualize");
      await withOperationLock("Self-Actualization", async () => {
        try {
          await runSelfActualization(context);
          // Refresh status bar after self-actualization
          clearHealthCache();
          await updateStatusBar(context, true);
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  // M365 export command
  let exportM365Disposable = vscode.commands.registerCommand(
    "alex.exportForM365",
    async () => {
      const endLog = telemetry.logTimed("command", "export_m365");
      try {
        await runExportForM365(context);
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Session timer commands
  initializeSessionStatusBar(context);

  // Register learning goals commands
  registerGoalsCommands(context);

  const startSessionDisposable = vscode.commands.registerCommand(
    "alex.startSession",
    async () => {
      await startSession();
    },
  );

  const endSessionDisposable = vscode.commands.registerCommand(
    "alex.endSession",
    async () => {
      await endSession(true);
    },
  );

  const togglePauseDisposable = vscode.commands.registerCommand(
    "alex.togglePauseSession",
    async () => {
      await togglePauseSession();
    },
  );

  const sessionActionsDisposable = vscode.commands.registerCommand(
    "alex.sessionActions",
    async () => {
      await showSessionActions();
    },
  );

  // Cloud sync commands
  const syncDisposable = vscode.commands.registerCommand(
    "alex.syncKnowledge",
    async () => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Syncing Global Knowledge...",
          cancellable: false,
        },
        async () => {
          const result = await syncWithCloud();
          if (result.success) {
            const url = await getCloudUrl();
            const viewButton = url ? "View Gist" : undefined;
            const selection = await vscode.window.showInformationMessage(
              `✅ ${result.message}`,
              ...(viewButton ? [viewButton] : []),
            );
            if (selection === "View Gist" && url) {
              vscode.env.openExternal(vscode.Uri.parse(url));
            }
          } else {
            vscode.window.showErrorMessage(`❌ ${result.message}`);
          }
        },
      );
    },
  );

  const pushDisposable = vscode.commands.registerCommand(
    "alex.pushKnowledge",
    async () => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Pushing to Cloud...",
          cancellable: false,
        },
        async () => {
          const result = await pushToCloud();
          if (result.success) {
            vscode.window.showInformationMessage(`✅ ${result.message}`);
          } else {
            vscode.window.showErrorMessage(`❌ ${result.message}`);
          }
        },
      );
    },
  );

  const pullDisposable = vscode.commands.registerCommand(
    "alex.pullKnowledge",
    async () => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Pulling from Cloud...",
          cancellable: false,
        },
        async () => {
          const result = await pullFromCloud();
          if (result.success) {
            vscode.window.showInformationMessage(`✅ ${result.message}`);
          } else {
            vscode.window.showErrorMessage(`❌ ${result.message}`);
          }
        },
      );
    },
  );

  // Documentation command - opens alex_docs folder
  const openDocsDisposable = vscode.commands.registerCommand(
    "alex.openDocs",
    async () => {
      const docsPath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "README.md",
      );
      try {
        await vscode.commands.executeCommand("markdown.showPreview", docsPath);
      } catch {
        // Fallback to opening as text if preview fails
        const doc = await vscode.workspace.openTextDocument(docsPath);
        await vscode.window.showTextDocument(doc);
      }
    },
  );

  // Status bar command - show quick status
  const showStatusDisposable = vscode.commands.registerCommand(
    "alex.showStatus",
    async () => {
      const items: vscode.QuickPickItem[] = [
        {
          label: "$(pulse) Run Dream Protocol",
          description: "Neural maintenance and synapse validation",
          detail: "Ctrl+Alt+D",
        },
        {
          label: "$(sparkle) Self-Actualize",
          description: "Deep meditation and assessment",
          detail: "Ctrl+Alt+S",
        },
        {
          label: "$(sync) Sync Knowledge",
          description: "Sync global knowledge with GitHub",
          detail: "Ctrl+Alt+K",
        },
        {
          label: "$(package) Export for M365",
          description: "Package memory for M365 Copilot",
          detail: "Export to ~/Alex-Memory-Export/ → upload to OneDrive",
        },
        {
          label: "$(book) Open Documentation",
          description: "View Alex documentation",
          detail: "Ctrl+Alt+H",
        },
        {
          label: "$(arrow-up) Upgrade Architecture",
          description: "Update workspace to latest version",
        },
        {
          label: "$(gear) Setup Environment",
          description: "Optimize VS Code settings for Alex",
        },
        {
          label: "$(bug) Report Issue / View Diagnostics",
          description: "View local telemetry for bug reports",
          detail: "Data stays on your machine",
        },
        {
          label: "$(comment-discussion) Chat with @alex",
          description: "Open Copilot Chat",
        },
        {
          label: "$(list-tree) Generate Skill Catalog",
          description: "Create network diagram of all skills",
        },
        {
          label: "$(search) Search Knowledge",
          description: "Quick search across global knowledge",
        },
        {
          label: "$(watch) Start Focus Session",
          description: "Pomodoro timer for focused work with breaks",
          detail: "⚖️ Work-Life Balance",
        },
        {
          label: "$(target) Manage Learning Goals",
          description: "Track progress with targets and streaks",
          detail: "⚖️ Work-Life Balance",
        },
        {
          label: "$(graph) Health Dashboard",
          description: "Visual architecture health overview",
        },
        {
          label: "$(checklist) Run Project Audit",
          description: "22-point audit: security, dependencies, UI, tests",
          detail: "🔍 Comprehensive project health check",
        },
        // --- Developer Tools ---
        { label: "", kind: vscode.QuickPickItemKind.Separator },
        {
          label: "$(rocket) Release Preflight",
          description: "Pre-release checklist and verification",
          detail: "🚀 Ready to ship?",
        },
        {
          label: "$(code) Code Review Selection",
          description: "Review selected code for issues",
          detail: "📋 Requires text selection",
        },
        {
          label: "$(bug) Debug This",
          description: "Analyze selection for bugs/issues",
          detail: "🐛 Requires text selection",
        },
        {
          label: "$(symbol-structure) Generate Diagram",
          description: "Create Mermaid diagrams",
          detail: "📊 Class, sequence, flowchart, ER, etc.",
        },
        {
          label: "$(beaker) Generate Tests",
          description: "Generate tests for selected code",
          detail: "🧪 Jest, Mocha, pytest, etc.",
        },
      ];

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Alex Cognitive Architecture - Quick Actions",
        title: "🧠 Alex Status",
      });

      if (selected) {
        if (selected.label.includes("Dream")) {
          vscode.commands.executeCommand("alex.dream");
        } else if (selected.label.includes("Self-Actualize")) {
          vscode.commands.executeCommand("alex.selfActualize");
        } else if (selected.label.includes("Sync")) {
          vscode.commands.executeCommand("alex.syncKnowledge");
        } else if (selected.label.includes("Export for M365")) {
          vscode.commands.executeCommand("alex.exportForM365");
        } else if (selected.label.includes("Documentation")) {
          vscode.commands.executeCommand("alex.openDocs");
        } else if (selected.label.includes("Upgrade")) {
          vscode.commands.executeCommand("alex.upgrade");
        } else if (selected.label.includes("Setup Environment")) {
          vscode.commands.executeCommand("alex.setupEnvironment");
        } else if (selected.label.includes("Report Issue")) {
          vscode.commands.executeCommand("alex.viewBetaTelemetry");
        } else if (selected.label.includes("Chat")) {
          vscode.commands.executeCommand(
            "workbench.panel.chat.view.copilot.focus",
          );
        } else if (selected.label.includes("Goals")) {
          vscode.commands.executeCommand("alex.showGoals");
        } else if (selected.label.includes("Skill Catalog")) {
          vscode.commands.executeCommand("alex.generateSkillCatalog");
        } else if (selected.label.includes("Search Knowledge")) {
          vscode.commands.executeCommand("alex.knowledgeQuickPick");
        } else if (selected.label.includes("Focus Session")) {
          vscode.commands.executeCommand("alex.startSession");
        } else if (selected.label.includes("Health Dashboard")) {
          vscode.commands.executeCommand("alex.openHealthDashboard");
        } else if (selected.label.includes("Project Audit")) {
          vscode.commands.executeCommand("alex.runAudit");
        } else if (selected.label.includes("Release Preflight")) {
          vscode.commands.executeCommand("alex.releasePreflight");
        } else if (selected.label.includes("Code Review")) {
          vscode.commands.executeCommand("alex.codeReview");
        } else if (selected.label.includes("Debug This")) {
          vscode.commands.executeCommand("alex.debugThis");
        } else if (selected.label.includes("Generate Diagram")) {
          vscode.commands.executeCommand("alex.generateDiagram");
        } else if (selected.label.includes("Generate Tests")) {
          vscode.commands.executeCommand("alex.generateTests");
        }
      }
    },
  );

  // Setup environment command
  const setupEnvDisposable = vscode.commands.registerCommand(
    "alex.setupEnvironment",
    async () => {
      const endLog = telemetry.logTimed("command", "setup_environment");
      try {
        await setupEnvironment();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Run Project Audit command
  const runAuditDisposable = vscode.commands.registerCommand(
    "alex.runAudit",
    async () => {
      const endLog = telemetry.logTimed("command", "run_audit");
      try {
        // Show audit options
        const auditOptions = [
          { label: "$(checklist) Full Audit", description: "Run all 22 audit checks", detail: "Comprehensive project health assessment" },
          { label: "$(shield) Security Audit", description: "Secrets, CSP, input sanitization", detail: "High priority" },
          { label: "$(package) Dependency Audit", description: "npm audit, outdated packages", detail: "High priority" },
          { label: "$(code) Code Quality", description: "TypeScript errors, ESLint, dead code", detail: "High priority" },
          { label: "$(browser) UI Audit", description: "Dead buttons, WebView issues", detail: "Medium priority" },
          { label: "$(file-binary) Bundle Size", description: "Extension size, package estimate", detail: "Medium priority" },
          { label: "$(git-branch) Git Hygiene", description: "Uncommitted changes, large files", detail: "Medium priority" },
          { label: "$(note) Changelog Audit", description: "Format, version alignment", detail: "Medium priority" },
          { label: "$(beaker) Test Coverage", description: "Test files, framework, gaps", detail: "Medium priority" },
          { label: "$(eye) Accessibility", description: "ARIA, keyboard, colors", detail: "Low priority" },
          { label: "$(globe) Localization", description: "i18n setup, hardcoded strings", detail: "Low priority" },
          { label: "$(file-media) Asset Integrity", description: "Icons, missing/unused assets", detail: "Low priority" },
          { label: "$(settings-gear) Configuration", description: "launch.json, tsconfig, vscodeignore", detail: "Low priority" },
        ];

        const selected = await vscode.window.showQuickPick(auditOptions, {
          placeHolder: "Select audit type to run",
          title: "🔍 Alex Project Audit",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        // Open chat with audit prompt
        const auditType = selected.label.replace(/\$\([^)]+\)\s*/, '');
        vscode.commands.executeCommand(
          "workbench.panel.chat.view.copilot.focus"
        );
        
        // Show info about what to type
        vscode.window.showInformationMessage(
          `🔍 ${auditType}: Ask @alex to run this audit. Try: "@alex run ${auditType.toLowerCase()}"`,
          "Copy Prompt"
        ).then(action => {
          if (action === "Copy Prompt") {
            vscode.env.clipboard.writeText(`@alex run ${auditType.toLowerCase()} on this project`);
            vscode.window.showInformationMessage("Prompt copied! Paste it in Copilot Chat.");
          }
        });
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(`Audit failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  );

  // Release Preflight command
  const releasePreflightDisposable = vscode.commands.registerCommand(
    "alex.releasePreflight",
    async () => {
      const endLog = telemetry.logTimed("command", "release_preflight");
      try {
        const preflightChecks = [
          { label: "$(rocket) Full Preflight", description: "Complete release readiness check", detail: "All checks before publishing" },
          { label: "$(versions) Version Alignment", description: "Check version consistency across files", detail: "package.json, changelog, docs" },
          { label: "$(git-commit) Git Status", description: "Uncommitted changes, branch status", detail: "Clean working directory" },
          { label: "$(package) Build Verification", description: "Compile, bundle, package check", detail: "Extension builds successfully" },
          { label: "$(checklist) Changelog Entry", description: "Verify changelog has entry for this version", detail: "Keep a Changelog format" },
          { label: "$(shield) Security Scan", description: "npm audit, secrets check", detail: "No vulnerabilities" },
          { label: "$(beaker) Test Suite", description: "Run tests, check coverage", detail: "All tests passing" },
        ];

        const selected = await vscode.window.showQuickPick(preflightChecks, {
          placeHolder: "Select preflight check to run",
          title: "🚀 Release Preflight",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
        const checkType = selected.label.replace(/\$\([^)]+\)\s*/, '');
        vscode.window.showInformationMessage(
          `🚀 ${checkType}: Ask @alex to run preflight. Try: "@alex run release preflight"`,
          "Copy Prompt"
        ).then(action => {
          if (action === "Copy Prompt") {
            vscode.env.clipboard.writeText(`@alex run ${checkType.toLowerCase()} check for release`);
            vscode.window.showInformationMessage("Prompt copied! Paste it in Copilot Chat.");
          }
        });

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Code Review command
  const codeReviewDisposable = vscode.commands.registerCommand(
    "alex.codeReview",
    async () => {
      const endLog = telemetry.logTimed("command", "code_review");
      try {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
          vscode.window.showWarningMessage("Select code to review first.");
          endLog(true);
          return;
        }

        const selectedText = editor.document.getText(editor.selection);
        const fileName = editor.document.fileName.split(/[/\\]/).pop();
        
        // Copy context to clipboard
        const prompt = `@alex review this code for issues, improvements, and best practices:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        await vscode.env.clipboard.writeText(prompt);
        
        vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
        vscode.window.showInformationMessage(
          `📋 Code from ${fileName} copied. Paste in Copilot Chat for review.`
        );
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Debug This command
  const debugThisDisposable = vscode.commands.registerCommand(
    "alex.debugThis",
    async () => {
      const endLog = telemetry.logTimed("command", "debug_this");
      try {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
          vscode.window.showWarningMessage("Select code or error message to debug.");
          endLog(true);
          return;
        }

        const selectedText = editor.document.getText(editor.selection);
        const fileName = editor.document.fileName.split(/[/\\]/).pop();
        
        const prompt = `@alex help me debug this. Analyze for potential issues, suggest fixes, and explain root cause:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        await vscode.env.clipboard.writeText(prompt);
        
        vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
        vscode.window.showInformationMessage(
          `🐛 Code from ${fileName} copied. Paste in Copilot Chat to debug.`
        );
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Generate Diagram command
  const generateDiagramDisposable = vscode.commands.registerCommand(
    "alex.generateDiagram",
    async () => {
      const endLog = telemetry.logTimed("command", "generate_diagram");
      try {
        const diagramTypes = [
          { label: "$(type-hierarchy) Class Diagram", description: "UML class relationships", detail: "Classes, interfaces, inheritance" },
          { label: "$(git-merge) Sequence Diagram", description: "Interaction flow", detail: "Method calls, messages" },
          { label: "$(workflow) Flowchart", description: "Process flow", detail: "Decision trees, algorithms" },
          { label: "$(database) ER Diagram", description: "Entity relationships", detail: "Database schema" },
          { label: "$(server) Architecture Diagram", description: "System components", detail: "Services, connections" },
          { label: "$(symbol-state-machine) State Diagram", description: "State transitions", detail: "FSM, lifecycle" },
        ];

        const selected = await vscode.window.showQuickPick(diagramTypes, {
          placeHolder: "Select diagram type to generate",
          title: "📊 Generate Mermaid Diagram",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        const editor = vscode.window.activeTextEditor;
        let context = "";
        if (editor && !editor.selection.isEmpty) {
          context = `\n\nContext code:\n\`\`\`${editor.document.languageId}\n${editor.document.getText(editor.selection)}\n\`\`\``;
        }

        const diagramType = selected.label.replace(/\$\([^)]+\)\s*/, '');
        const prompt = `@alex generate a Mermaid ${diagramType} for this project/code. Output valid Mermaid syntax I can paste into a markdown file.${context}`;
        await vscode.env.clipboard.writeText(prompt);
        
        vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
        vscode.window.showInformationMessage(
          `📊 ${diagramType} prompt copied. Paste in Copilot Chat.`
        );
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Generate Tests command
  const generateTestsDisposable = vscode.commands.registerCommand(
    "alex.generateTests",
    async () => {
      const endLog = telemetry.logTimed("command", "generate_tests");
      try {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
          vscode.window.showWarningMessage("Select code to generate tests for.");
          endLog(true);
          return;
        }

        const testFrameworks = [
          { label: "$(beaker) Auto-detect", description: "Let Alex choose based on project", detail: "Recommended" },
          { label: "$(beaker) Jest", description: "JavaScript/TypeScript testing", detail: "Popular for React, Node.js" },
          { label: "$(beaker) Mocha", description: "Flexible test framework", detail: "Often with Chai assertions" },
          { label: "$(beaker) Vitest", description: "Vite-native testing", detail: "Fast, ESM-first" },
          { label: "$(beaker) pytest", description: "Python testing", detail: "Fixtures, parametrize" },
          { label: "$(beaker) xUnit/NUnit", description: ".NET testing", detail: "C#, F#" },
        ];

        const framework = await vscode.window.showQuickPick(testFrameworks, {
          placeHolder: "Select test framework",
          title: "🧪 Generate Tests",
        });

        if (!framework) {
          endLog(true);
          return;
        }

        const selectedText = editor.document.getText(editor.selection);
        const fileName = editor.document.fileName.split(/[/\\]/).pop();
        const frameworkName = framework.label.replace(/\$\([^)]+\)\s*/, '');
        
        const prompt = `@alex generate comprehensive tests for this code using ${frameworkName}. Include edge cases, error handling, and meaningful assertions:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        await vscode.env.clipboard.writeText(prompt);
        
        vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
        vscode.window.showInformationMessage(
          `🧪 Test prompt for ${fileName} copied. Paste in Copilot Chat.`
        );
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Beta telemetry commands (temporary - remove after beta)
  const viewTelemetryDisposable = vscode.commands.registerCommand(
    "alex.viewBetaTelemetry",
    async () => {
      const sessions = await telemetry.getAllTelemetryData();
      const summary = telemetry.getSessionSummary();
      const aggregate = await telemetry.getAllSessionsAggregate();
      const alexSettings = telemetry.getAlexSettings();
      const health = await checkHealth();
      const extensionVersion =
        context.extension.packageJSON.version || "unknown";

      const panel = vscode.window.createWebviewPanel(
        "alexBetaTelemetry",
        "Alex Diagnostics & Bug Report",
        vscode.ViewColumn.One,
        { enableScripts: true },
      );

      panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); max-width: 900px; margin: 0 auto; }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { margin-top: 24px; border-bottom: 1px solid var(--vscode-textSeparator-foreground); padding-bottom: 8px; }
        h3 { margin-top: 16px; margin-bottom: 8px; font-size: 14px; }
        .summary { background: var(--vscode-textBlockQuote-background); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .stat { display: inline-block; margin-right: 24px; margin-bottom: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; color: var(--vscode-textLink-foreground); }
        .stat-label { font-size: 12px; color: var(--vscode-descriptionForeground); }
        pre { background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 11px; max-height: 300px; overflow-y: auto; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 8px; margin-bottom: 8px; font-size: 13px; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        button.primary { background: var(--vscode-button-prominentBackground, #0066b8); }
        button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
        .privacy-box { background: var(--vscode-inputValidation-infoBackground); border: 1px solid var(--vscode-inputValidation-infoBorder); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .privacy-box h3 { margin-top: 0; color: var(--vscode-textLink-foreground); }
        .privacy-list { margin: 8px 0; padding-left: 20px; }
        .privacy-list li { margin: 4px 0; }
        .bug-report-box { background: var(--vscode-inputValidation-warningBackground); border: 1px solid var(--vscode-inputValidation-warningBorder); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .bug-report-box h3 { margin-top: 0; }
        .check { color: #4caf50; }
        .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 12px 0; }
        .info-label { font-weight: bold; color: var(--vscode-descriptionForeground); }
        .health-box { background: var(--vscode-textBlockQuote-background); padding: 12px 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid ${health.status === 'healthy' ? '#4caf50' : health.status === 'warning' ? '#ff9800' : health.status === 'error' ? '#f44336' : '#9e9e9e'}; }
        .settings-box { background: var(--vscode-textBlockQuote-background); padding: 12px 16px; border-radius: 8px; margin: 12px 0; }
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; font-size: 12px; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .two-column { grid-template-columns: 1fr; } }
        h2 { margin-top: 24px; border-bottom: 1px solid var(--vscode-textSeparator-foreground); padding-bottom: 8px; }
        .summary { background: var(--vscode-textBlockQuote-background); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .stat { display: inline-block; margin-right: 24px; margin-bottom: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; color: var(--vscode-textLink-foreground); }
        .stat-label { font-size: 12px; color: var(--vscode-descriptionForeground); }
        pre { background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 11px; max-height: 300px; overflow-y: auto; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 8px; margin-bottom: 8px; font-size: 13px; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        button.primary { background: var(--vscode-button-prominentBackground, #0066b8); }
        button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
        .privacy-box { background: var(--vscode-inputValidation-infoBackground); border: 1px solid var(--vscode-inputValidation-infoBorder); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .privacy-box h3 { margin-top: 0; color: var(--vscode-textLink-foreground); }
        .privacy-list { margin: 8px 0; padding-left: 20px; }
        .privacy-list li { margin: 4px 0; }
        .bug-report-box { background: var(--vscode-inputValidation-warningBackground); border: 1px solid var(--vscode-inputValidation-warningBorder); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .bug-report-box h3 { margin-top: 0; }
        .check { color: #4caf50; }
        .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 12px 0; }
        .info-label { font-weight: bold; color: var(--vscode-descriptionForeground); }
    </style>
</head>
<body>
    <h1>🔬 Alex Diagnostics & Bug Report</h1>
    
    <div class="privacy-box">
        <h3>🔒 Privacy Guarantee</h3>
        <p><strong>Your data NEVER leaves your machine.</strong> This diagnostic data is:</p>
        <ul class="privacy-list">
            <li><span class="check">✓</span> Stored <strong>only</strong> in VS Code's local extension storage</li>
            <li><span class="check">✓</span> <strong>Never</strong> transmitted over any network</li>
            <li><span class="check">✓</span> <strong>Never</strong> sent to Microsoft, GitHub, or any third party</li>
            <li><span class="check">✓</span> Automatically redacts sensitive data (tokens, passwords, full paths)</li>
            <li><span class="check">✓</span> Completely under your control - export or delete at any time</li>
        </ul>
        <p style="margin-bottom: 0; font-style: italic;">To file a bug report, export the data below and attach it to your GitHub issue.</p>
    </div>
    
    <h2>📊 Session Summary</h2>
    <div class="summary">
        <div class="stat"><div class="stat-value">${summary.totalEvents || 0}</div><div class="stat-label">Events This Session</div></div>
        <div class="stat"><div class="stat-value">${summary.errorCount || 0}</div><div class="stat-label">Errors</div></div>
        <div class="stat"><div class="stat-value">${summary.avgDuration || 0}ms</div><div class="stat-label">Avg Duration</div></div>
        <div class="stat"><div class="stat-value">${sessions.length}</div><div class="stat-label">Total Sessions</div></div>
    </div>
    
    <div class="info-grid">
        <span class="info-label">Extension Version:</span><span>${extensionVersion}</span>
        <span class="info-label">VS Code Version:</span><span>${vscode.version}</span>
        <span class="info-label">Session ID:</span><span>${summary.sessionId || "unknown"}</span>
        <span class="info-label">Started:</span><span>${summary.startedAt || "unknown"}</span>
    </div>
    
    <div class="bug-report-box">
        <h3>🐛 Filing a Bug Report?</h3>
        <p>To help us fix your issue quickly:</p>
        <ol>
            <li>Click <strong>"Export for Bug Report"</strong> below to save the diagnostic data</li>
            <li>Go to <a href="https://github.com/fabiocosta-cw/Alex_Plug_In/issues/new" style="color: var(--vscode-textLink-foreground);">GitHub Issues</a></li>
            <li>Describe what happened and what you expected</li>
            <li>Attach the exported JSON file</li>
        </ol>
        <button class="primary" onclick="exportData()">📤 Export for Bug Report</button>
        <button class="secondary" onclick="copyToClipboard()">📋 Copy to Clipboard</button>
    </div>
    
    <h2>🔧 Actions</h2>
    <button onclick="showLog()">📜 Show Live Log</button>
    <button onclick="refreshData()">🔄 Refresh</button>
    <button class="secondary" onclick="clearData()">🗑️ Clear All Data</button>
    
    <h2>🏥 Architecture Health</h2>
    <div class="health-box">
        <div class="info-grid">
            <span class="info-label">Status:</span><span>${health.status === 'healthy' ? '✅ Healthy' : health.status === 'warning' ? '⚠️ Warning' : health.status === 'error' ? '❌ Error' : '⚫ Not Initialized'}</span>
            <span class="info-label">Initialized:</span><span>${health.initialized ? 'Yes' : 'No'}</span>
            <span class="info-label">Total Files:</span><span>${health.totalFiles}</span>
            <span class="info-label">Total Synapses:</span><span>${health.totalSynapses}</span>
            <span class="info-label">Broken Synapses:</span><span>${health.brokenSynapses}</span>
            <span class="info-label">Summary:</span><span>${health.summary}</span>
        </div>
        ${health.issues.length > 0 ? `<p style="margin-top: 8px; margin-bottom: 0; font-size: 12px;"><strong>Issues:</strong> ${health.issues.slice(0, 5).join(', ')}${health.issues.length > 5 ? ` (+${health.issues.length - 5} more)` : ''}</p>` : ''}
    </div>
    
    <div class="two-column">
        <div>
            <h2>📈 This Session</h2>
            <pre>${((summary.topEvents as string[]) || []).join("\\n") || "No events yet"}</pre>
        </div>
        <div>
            <h2>📊 All Sessions (${aggregate.totalSessions})</h2>
            <pre>${((aggregate.topEventsAllTime as string[]) || []).join("\\n") || "No events yet"}</pre>
        </div>
    </div>
    
    <h2>⚙️ Settings</h2>
    <div class="settings-box">
        <div class="settings-grid">
            <span><strong>workspace.protectedMode:</strong> ${alexSettings['workspace.protectedMode'] ?? 'undefined'}</span>
            <span><strong>m365.enabled:</strong> ${alexSettings['m365.enabled'] ?? 'undefined'}</span>
            <span><strong>cloudSync.enabled:</strong> ${alexSettings['cloudSync.enabled'] ?? 'undefined'}</span>
            <span><strong>cloudSync.autoSync:</strong> ${alexSettings['cloudSync.autoSync'] ?? 'undefined'}</span>
        </div>
    </div>
    
    <h2>📁 Raw Session Data</h2>
    <p style="color: var(--vscode-descriptionForeground); font-size: 12px;">This is the complete diagnostic data that would be included in a bug report:</p>
    <pre id="sessionData">${JSON.stringify(sessions, null, 2)}</pre>
    
    <script>
        const vscode = acquireVsCodeApi();
        function showLog() { vscode.postMessage({ command: 'showLog' }); }
        function exportData() { vscode.postMessage({ command: 'export' }); }
        function clearData() { vscode.postMessage({ command: 'clear' }); }
        function refreshData() { vscode.postMessage({ command: 'refresh' }); }
        function copyToClipboard() { 
            const data = document.getElementById('sessionData').textContent;
            navigator.clipboard.writeText(data).then(() => {
                vscode.postMessage({ command: 'copied' });
            });
        }
    </script>
</body>
</html>`;

      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === "showLog") {
          telemetry.showTelemetryLog();
        } else if (message.command === "export") {
          const data = await telemetry.getAllTelemetryData();
          const currentHealth = await checkHealth();
          const currentSettings = telemetry.getAlexSettings();
          const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, "-")
            .slice(0, 19);
          const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(`alex-bug-report-${timestamp}.json`),
            filters: { JSON: ["json"] },
          });
          if (uri) {
            const exportData = {
              exportedAt: new Date().toISOString(),
              extensionVersion,
              vscodeVersion: vscode.version,
              platform: process.platform,
              arch: process.arch,
              health: {
                status: currentHealth.status,
                initialized: currentHealth.initialized,
                totalFiles: currentHealth.totalFiles,
                totalSynapses: currentHealth.totalSynapses,
                brokenSynapses: currentHealth.brokenSynapses,
                summary: currentHealth.summary,
                issues: currentHealth.issues.slice(0, 10), // Limit issues
              },
              settings: currentSettings,
              sessions: data,
            };
            const content = new TextEncoder().encode(
              JSON.stringify(exportData, null, 2),
            );
            await vscode.workspace.fs.writeFile(uri, content);
            vscode.window.showInformationMessage(
              "Diagnostics exported! Attach this file to your GitHub issue.",
            );
          }
        } else if (message.command === "clear") {
          const confirm = await vscode.window.showWarningMessage(
            "Clear all diagnostic data?",
            { modal: true },
            "Yes, Clear",
          );
          if (confirm === "Yes, Clear") {
            await telemetry.clearTelemetryData();
            vscode.window.showInformationMessage("Diagnostic data cleared!");
            panel.dispose();
          }
        } else if (message.command === "copied") {
          vscode.window.showInformationMessage(
            "Diagnostic data copied to clipboard!",
          );
        } else if (message.command === "refresh") {
          // Re-run the command to refresh the panel
          panel.dispose();
          vscode.commands.executeCommand("alex.viewBetaTelemetry");
        }
      });
    },
  );

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.command = "alex.showStatus";
  statusBarItem.tooltip =
    "Alex Cognitive Architecture - Click for quick actions";
  context.subscriptions.push(statusBarItem);

  // Update status bar based on workspace health
  updateStatusBar(context);

  // Start periodic health checks (every 5 minutes)
  startPeriodicHealthCheck(context);

  // Re-check status when workspace folders change
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearHealthCache();
      updateStatusBar(context, true);
    }),
  );

  // Watch for changes in Alex memory files and refresh status
  const memoryWatcher = vscode.workspace.createFileSystemWatcher(
    "**/.github/{copilot-instructions.md,instructions/*.md,prompts/*.md,skills/*/SKILL.md,domain-knowledge/*.md}",
  );
  memoryWatcher.onDidChange(() => {
    clearHealthCache();
    updateStatusBar(context, true);
  });
  memoryWatcher.onDidCreate(() => {
    clearHealthCache();
    updateStatusBar(context, true);
  });
  memoryWatcher.onDidDelete(() => {
    clearHealthCache();
    updateStatusBar(context, true);
  });
  context.subscriptions.push(memoryWatcher);

  context.subscriptions.push(initDisposable);
  context.subscriptions.push(resetDisposable);
  context.subscriptions.push(dreamDisposable);
  context.subscriptions.push(upgradeDisposable);
  context.subscriptions.push(completeMigrationDisposable);
  context.subscriptions.push(showMigrationDisposable);
  context.subscriptions.push(selfActualizeDisposable);
  context.subscriptions.push(exportM365Disposable);
  context.subscriptions.push(startSessionDisposable);
  context.subscriptions.push(endSessionDisposable);
  context.subscriptions.push(togglePauseDisposable);
  context.subscriptions.push(sessionActionsDisposable);
  context.subscriptions.push(syncDisposable);
  context.subscriptions.push(pushDisposable);
  context.subscriptions.push(pullDisposable);
  context.subscriptions.push(openDocsDisposable);
  context.subscriptions.push(showStatusDisposable);
  context.subscriptions.push(setupEnvDisposable);
  context.subscriptions.push(runAuditDisposable);
  context.subscriptions.push(viewTelemetryDisposable);
  context.subscriptions.push(releasePreflightDisposable);
  context.subscriptions.push(codeReviewDisposable);
  context.subscriptions.push(debugThisDisposable);
  context.subscriptions.push(generateDiagramDisposable);
  context.subscriptions.push(generateTestsDisposable);

  // Skill Catalog command
  const skillCatalogDisposable = vscode.commands.registerCommand(
    "alex.generateSkillCatalog",
    async () => {
      const endLog = telemetry.logTimed("command", "generate_skill_catalog");
      try {
        await generateSkillCatalog();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );
  context.subscriptions.push(skillCatalogDisposable);
}

/**
 * Update the status bar item based on workspace health
 */
async function updateStatusBar(
  context: vscode.ExtensionContext,
  forceRefresh: boolean = false,
): Promise<void> {
  try {
    const health = await checkHealth(forceRefresh);
    
    // Get session info
    const session = getCurrentSession();
    const sessionInfo = session ? {
      active: true,
      remaining: session.remaining,
      isBreak: session.isBreak
    } : null;
    
    // Get streak info
    let streakDays = 0;
    try {
      const goalsSummary = await getGoalsSummary();
      streakDays = goalsSummary.streakDays;
    } catch { /* ignore */ }
    
    const display = getStatusBarDisplay(health, sessionInfo, streakDays);

    statusBarItem.text = display.text;
    statusBarItem.tooltip = display.tooltip;
    statusBarItem.backgroundColor = display.backgroundColor;
    statusBarItem.show();
  } catch (err) {
    // Fallback if health check fails
    statusBarItem.text = "$(brain) Alex";
    statusBarItem.tooltip =
      "Alex Cognitive Architecture - Click for quick actions";
    statusBarItem.backgroundColor = undefined;
    statusBarItem.show();
  }
}

/**
 * Start periodic health checks (every 5 minutes)
 */
function startPeriodicHealthCheck(context: vscode.ExtensionContext): void {
  const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  const intervalId = setInterval(async () => {
    await updateStatusBar(context, true);
  }, HEALTH_CHECK_INTERVAL);

  // Clean up interval on deactivation
  context.subscriptions.push({
    dispose: () => clearInterval(intervalId),
  });
}

/**
 * Check if the extension was upgraded and notify the user
 */
async function checkVersionUpgrade(
  context: vscode.ExtensionContext,
): Promise<void> {
  const LAST_VERSION_KEY = "alex.lastKnownVersion";

  // Get current version from package.json
  const extension = vscode.extensions.getExtension(
    "fabioc-aloha.alex-cognitive-architecture",
  );
  if (!extension) {
    return;
  }

  const currentVersion = extension.packageJSON.version as string;
  const lastVersion = context.globalState.get<string>(LAST_VERSION_KEY);

  // Store current version for next time
  await context.globalState.update(LAST_VERSION_KEY, currentVersion);

  // First install - no notification needed (they'll run initialize)
  if (!lastVersion) {
    return;
  }

  // Same version - no action needed
  if (lastVersion === currentVersion) {
    return;
  }

  // Version changed - check if it's a major upgrade
  const [lastMajor] = lastVersion.split(".").map(Number);
  const [currentMajor] = currentVersion.split(".").map(Number);

  const isMajorUpgrade = currentMajor > lastMajor;

  // Show upgrade notification
  const upgradeButton = "Run Upgrade";
  const changelogButton = "View Changelog";
  const dismissButton = "Dismiss";

  const message = isMajorUpgrade
    ? `🎉 Alex upgraded to v${currentVersion}! This is a major release with new features. Run the upgrade to update your workspace files.`
    : `✨ Alex updated to v${currentVersion}. Run the upgrade to sync your workspace with the latest improvements.`;

  const selection = await vscode.window.showInformationMessage(
    message,
    upgradeButton,
    changelogButton,
    dismissButton,
  );

  if (selection === upgradeButton) {
    vscode.commands.executeCommand("alex.upgrade");
  } else if (selection === changelogButton) {
    // Open changelog in browser or show in editor
    const changelogUri = vscode.Uri.joinPath(
      extension.extensionUri,
      "CHANGELOG.md",
    );
    vscode.commands.executeCommand("markdown.showPreview", changelogUri);
  }
}

/**
 * Clean up resources when extension is deactivated
 * Note: Background sync timer cleanup is handled via context.subscriptions
 */
export function deactivate() {
  // Save beta telemetry session
  telemetry.log("lifecycle", "extension_deactivate");
  telemetry.saveSession().catch((err) => {
    console.warn("Failed to save telemetry session:", err);
  });

  // Reset chat participant session state to prevent state bleeding
  resetSessionState();
  // Clean up session timer
  disposeSession();
  console.log("Alex Cognitive Architecture deactivated");
}
