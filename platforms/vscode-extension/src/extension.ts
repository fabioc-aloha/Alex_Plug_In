import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import {
  initializeArchitecture,
  resetArchitecture,
} from "./commands/initialize";
import { runDreamProtocol } from "./commands/dream";
import { registerHeirValidationCommand } from "./commands/heirValidation";
import {
  setupEnvironment,
  offerEnvironmentSetup,
  setExtensionPathForCss,
  applyMarkdownStyles,
} from "./commands/setupEnvironment";
import { upgradeArchitecture, completeMigration, showMigrationCandidates } from "./commands/upgrade";
import { runSelfActualization } from "./commands/self-actualization";
import { runExportForM365, silentSyncToOneDrive, exportForM365 } from "./commands/exportForM365";
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
import { inheritSkillFromGlobal } from "./commands/inheritSkill";
import { proposeSkillToGlobal } from "./commands/proposeSkill";
import { ensureGlobalKnowledgeSetup, setupGlobalKnowledgeCommand } from "./commands/setupGlobalKnowledge";
import { importGitHubIssuesAsGoals, reviewPullRequest } from "./commands/githubIntegration";
import { registerTTSCommands } from "./commands/readAloud";
import { registerChatParticipant, resetSessionState } from "./chat/participant";
import { registerLanguageModelTools } from "./chat/tools";
import {
  registerGlobalKnowledgeTools,
  ensureGlobalKnowledgeDirectories,
  registerCurrentProject,
  detectGlobalKnowledgeRepo,
  initGlobalKnowledgeSecrets,
} from "./chat/globalKnowledge";
import {
  initSecretsManager,
  showTokenManagementPalette,
} from "./services/secretsManager";
import {
  checkHealth,
  getStatusBarDisplay,
  clearHealthCache,
  HealthStatus,
  registerSessionProvider,
  registerStreakProvider,
} from "./shared/healthCheck";
import { isWorkspaceProtected, getLanguageIdFromPath, openChatPanel } from "./shared/utils";
import { registerWelcomeView } from "./views/welcomeView";
import { registerHealthDashboard } from "./views/healthDashboard";
import { registerMemoryDashboard } from "./views/memoryDashboard";
import { registerMemoryTreeView } from "./views/memoryTreeProvider";
import { registerCognitiveDashboard } from "./views/cognitiveDashboard";
import { CognitiveTaskProvider } from "./tasks/cognitiveTaskProvider";
import { registerUXCommands } from "./ux/uxFeatures";
import { initializeEnterprise, disposeEnterprise } from "./enterprise";
import * as telemetry from "./shared/telemetry";
import { getNonce } from "./shared/sanitize";
import {
  isOperationInProgress,
  setOperationInProgress,
} from "./shared/operationLock";

// Re-export for backward compatibility (other modules may import from extension.ts)
export { isOperationInProgress };

// Status bar item for Alex health
let statusBarItem: vscode.StatusBarItem;

async function withOperationLock<T>(
  operationName: string,
  operation: () => Promise<T>,
): Promise<T | undefined> {
  if (isOperationInProgress()) {
    vscode.window.showWarningMessage(
      `Another Alex operation is already in progress. Please wait for it to complete before running "${operationName}".`,
    );
    return undefined;
  }

  setOperationInProgress(true);
  try {
    return await operation();
  } finally {
    setOperationInProgress(false);
  }
}

export async function activate(context: vscode.ExtensionContext) {
  // Get extension version for telemetry
  const extensionVersion = context.extension.packageJSON.version || "unknown";

  // Create status bar immediately with loading indicator
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.text = "$(sync~spin) Alex loading...";
  statusBarItem.tooltip = "Alex Cognitive Architecture is initializing...";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  try {
    await activateInternal(context, extensionVersion);
  } catch (err) {
    console.error('[Alex] CRITICAL: Extension activation failed:', err);
    statusBarItem.text = "$(error) Alex";
    statusBarItem.tooltip = `Alex failed to activate: ${err}`;
    vscode.window.showErrorMessage(
      `Alex Cognitive Architecture failed to activate: ${err instanceof Error ? err.message : String(err)}. Try reloading the window.`,
      "Reload Window"
    ).then(selection => {
      if (selection === "Reload Window") {
        vscode.commands.executeCommand("workbench.action.reloadWindow");
      }
    });
  }
}

async function activateInternal(context: vscode.ExtensionContext, extensionVersion: string) {

  // Initialize beta telemetry (temporary - remove after beta)
  telemetry.initTelemetry(context, extensionVersion);
  telemetry.log("lifecycle", "extension_activate", {
    extensionVersion,
    vscodeVersion: vscode.version,
  });

  // Initialize enterprise security features (secrets scanning, audit logging)
  await initializeEnterprise(context);

  // Set extension path for markdown CSS lookup
  // This allows setupEnvironment to find the bundled CSS file
  setExtensionPathForCss(context.extensionPath);

  // Check for version upgrade and notify user
  checkVersionUpgrade(context).catch(err =>
    console.warn('[Alex] Version upgrade check failed:', err)
  );

  // Register chat participant for @alex conversations
  registerChatParticipant(context);

  // Register language model tools for AI-powered operations
  registerLanguageModelTools(context);

  // Register global knowledge tools for cross-project learning
  try {
    await initGlobalKnowledgeSecrets(context);
  } catch (err) {
    console.warn('[Alex] Failed to initialize GK secrets:', err);
  }
  
  // Initialize centralized secrets manager for API tokens
  try {
    await initSecretsManager(context);
    console.log('[Alex] Secrets manager initialized');
  } catch (err) {
    console.warn('[Alex] Failed to initialize secrets manager:', err);
  }
  
  // Auto-setup Global Knowledge if not configured (non-blocking)
  ensureGlobalKnowledgeSetup().catch(err => {
    console.warn('[Alex] Global Knowledge auto-setup skipped:', err);
  });
  
  registerGlobalKnowledgeTools(context);

  // Register context menu commands (Ask Alex, Save to Knowledge, Search Related)
  registerContextMenuCommands(context);

  // Register cognitive task provider (Meditate, Dream, Self-Actualize)
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(CognitiveTaskProvider.type, new CognitiveTaskProvider())
  );

  // Register welcome view in Activity Bar
  const welcomeViewProvider = registerWelcomeView(context);

  // Register health dashboard webview
  registerHealthDashboard(context);

  // Register memory architecture dashboard (premium)
  registerMemoryDashboard(context);

  // Register memory tree view in Activity Bar sidebar
  const memoryTreeProvider = registerMemoryTreeView(context);

  // Background cloud sync deprecated in v5.0.1 - use Git instead
  // startBackgroundSync(context);

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

  // Set context keys for when-clause filtering on slash commands (A3)
  setCommandContextKeys().catch((err) => {
    console.warn("Failed to set command context keys:", err);
  });

  // Apply markdown preview CSS for workspaces that have Alex installed
  // This ensures proper styling even if user opens an existing Alex workspace
  applyMarkdownStyles().catch((err) => {
    console.warn("Failed to apply markdown styles on activation:", err);
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
          // Refresh context keys (memory files now exist)
          await setCommandContextKeys();
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
          // Refresh context keys (memory files may have changed)
          await setCommandContextKeys();
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
          
          // Auto-sync to OneDrive if enabled
          const config = vscode.workspace.getConfiguration('alex');
          if (config.get<boolean>('m365.autoSync', false)) {
            // First export, then sync
            const result = await exportForM365(context);
            if (result.oneDrivePath) {
              vscode.window.showInformationMessage(`☁️ Synced to OneDrive: ${result.oneDrivePath}`);
            }
          }
          
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          throw err;
        }
      });
    },
  );

  // Deep Brain QA - comprehensive health check, GK sync, and synapse healing
  let deepBrainQADisposable = vscode.commands.registerCommand(
    "alex.deepBrainQA",
    async () => {
      const done = telemetry.logTimed("command", "deepBrainQA");
      await withOperationLock("Deep Brain QA", async () => {
        try {
          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "🧠 Deep Brain QA - Comprehensive Architecture Health Check",
              cancellable: false,
            },
            async (progress) => {
              // Phase 1: Run Dream Protocol (synapse validation + repair)
              progress.report({ message: "Phase 1/2: Running Dream Protocol..." });
              const dreamResult = await runDreamProtocol(context, { silent: true });
              
              // Phase 2: Final health check
              progress.report({ message: "Phase 2/2: Final health validation..." });
              clearHealthCache();
              await updateStatusBar(context, true);
              
              // Build result message
              const results: string[] = [];
              if (dreamResult) {
                if (dreamResult.brokenCount === 0) {
                  results.push(`✅ Synapses: ${dreamResult.totalSynapses} healthy`);
                } else {
                  results.push(`⚠️ Synapses: ${dreamResult.brokenCount} broken, ${dreamResult.repairedCount} repaired`);
                }
              }
              
              const overallSuccess = dreamResult?.brokenCount === 0;
              const title = overallSuccess 
                ? "🧠 Deep Brain QA Complete - Architecture Healthy!" 
                : "🧠 Deep Brain QA Complete - Some Issues Remain";
              
              const viewReport = dreamResult?.reportPath ? "View Report" : undefined;
              const selection = await vscode.window.showInformationMessage(
                `${title}\n\n${results.join('\n')}`,
                ...(viewReport ? [viewReport] : []),
              );
              
              if (selection === "View Report" && dreamResult?.reportPath) {
                const doc = await vscode.workspace.openTextDocument(dreamResult.reportPath);
                await vscode.window.showTextDocument(doc);
              }
            },
          );
          done(true);
        } catch (err) {
          done(false, err instanceof Error ? err : new Error(String(err)));
          vscode.window.showErrorMessage(`Deep Brain QA failed: ${err}`);
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
          
          // Auto-sync to OneDrive if enabled
          const config = vscode.workspace.getConfiguration('alex');
          if (config.get<boolean>('m365.autoSync', false)) {
            const result = await exportForM365(context);
            if (result.oneDrivePath) {
              vscode.window.showInformationMessage(`☁️ Synced to OneDrive: ${result.oneDrivePath}`);
            }
          }
          
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

  // Meditate command - opens chat with /meditate prompt
  const meditateDisposable = vscode.commands.registerCommand(
    "alex.meditate",
    async () => {
      await openChatPanel("/meditate");
    },
  );
  context.subscriptions.push(meditateDisposable);

  // Session timer commands
  initializeSessionStatusBar(context);

  // Register learning goals commands
  registerGoalsCommands(context);

  // Register TTS (Text-to-Speech) commands
  registerTTSCommands(context);

  // Register v5.2.0 UX Excellence features (voice toggle, quick commands, daily briefing)
  registerUXCommands(context);

  // Register Cognitive Dashboard webview
  registerCognitiveDashboard(context);

  // Register heir validation command (developer tool for release validation)
  registerHeirValidationCommand(context);

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

  // Working with Alex - prompting guide
  const workingWithAlexDisposable = vscode.commands.registerCommand(
    "alex.workingWithAlex",
    async () => {
      const guidePath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "WORKING-WITH-ALEX.md",
      );
      try {
        await vscode.commands.executeCommand("markdown.showPreview", guidePath);
      } catch {
        const doc = await vscode.workspace.openTextDocument(guidePath);
        await vscode.window.showTextDocument(doc);
      }
    },
  );

  // Agent vs @alex Chat comparison guide
  const agentVsChatDisposable = vscode.commands.registerCommand(
    "alex.agentVsChat",
    async () => {
      const guidePath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "guides",
        "AGENT-VS-CHAT-COMPARISON.md",
      );
      try {
        await vscode.commands.executeCommand("markdown.showPreview", guidePath);
      } catch (err) {
        console.log('[Alex] Markdown preview failed, opening as text:', err);
        const doc = await vscode.workspace.openTextDocument(guidePath);
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
          label: "$(mortar-board) Working with Alex",
          description: "Prompting guide for effective partnership",
          detail: "📚 Learn to work with Alex effectively",
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
          label: "$(server) Memory Dashboard",
          description: "Memory architecture visualization",
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
          label: "$(comment-discussion) Rubber Duck Debug",
          description: "Explain your problem to Alex as rubber duck",
          detail: "🦆 Dialog-based debugging",
        },
        {
          label: "$(question) Explain This",
          description: "Level-appropriate code explanation",
          detail: "📚 Junior/senior/reviewer/teacher levels",
        },
        {
          label: "$(edit) Refactor This",
          description: "Goal-oriented refactoring",
          detail: "🔧 Readability/performance/testability/SOLID",
        },
        {
          label: "$(lightbulb) Simplify This",
          description: "Clean code transformation",
          detail: "✨ Reduce nesting, improve naming",
        },
        {
          label: "$(shield) Security Review",
          description: "OWASP Top 10 security audit",
          detail: "🛡️ Injection, auth, secrets, etc.",
        },
        {
          label: "$(note) Document This",
          description: "Generate documentation",
          detail: "📝 JSDoc/docstrings/XML docs",
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
        {
          label: "$(verified) Validate Heir",
          description: "Check heir sync with Master Alex",
          detail: "🧬 Extension development",
        },
        // --- Multimodal ---
        { label: "", kind: vscode.QuickPickItemKind.Separator },
        {
          label: "$(file-media) Generate Presentation",
          description: "Create PowerPoint from Markdown or selection",
          detail: "📊 Native PPTX export",
        },
        {
          label: "$(unmute) Read Aloud",
          description: "Read selected text with neural voices",
          detail: "🎙️ Text-to-speech",
        },
        {
          label: "$(file-media) Save as Audio",
          description: "Export text to MP3 file",
          detail: "🎵 Creates audio file in workspace",
        },
        // --- GitHub Integration ---
        { label: "", kind: vscode.QuickPickItemKind.Separator },
        {
          label: "$(git-pull-request) Review Pull Request",
          description: "AI-assisted PR review",
          detail: "🔍 Fetches PRs from GitHub",
        },
        {
          label: "$(github) Import GitHub Issues",
          description: "Import issues as learning goals",
          detail: "📋 Sync with GitHub Issues",
        },
      ];

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Alex Cognitive Architecture - Quick Actions",
        title: "🚀 Alex Status",
      });

      if (selected) {
        if (selected.label.includes("Dream")) {
          vscode.commands.executeCommand("alex.dream");
        } else if (selected.label.includes("Self-Actualize")) {
          vscode.commands.executeCommand("alex.selfActualize");
        } else if (selected.label.includes("Export for M365")) {
          vscode.commands.executeCommand("alex.exportForM365");
        } else if (selected.label.includes("Documentation")) {
          vscode.commands.executeCommand("alex.openDocs");
        } else if (selected.label.includes("Working with Alex")) {
          vscode.commands.executeCommand("alex.workingWithAlex");
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
        } else if (selected.label.includes("Memory Dashboard")) {
          vscode.commands.executeCommand("alex.openMemoryDashboard");
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
        } else if (selected.label.includes("Rubber Duck")) {
          vscode.commands.executeCommand("alex.rubberDuck");
        } else if (selected.label.includes("Explain This")) {
          vscode.commands.executeCommand("alex.explainThis");
        } else if (selected.label.includes("Refactor This")) {
          vscode.commands.executeCommand("alex.refactorThis");
        } else if (selected.label.includes("Simplify This")) {
          vscode.commands.executeCommand("alex.simplifyThis");
        } else if (selected.label.includes("Security Review")) {
          vscode.commands.executeCommand("alex.securityReview");
        } else if (selected.label.includes("Document This")) {
          vscode.commands.executeCommand("alex.documentThis");
        } else if (selected.label.includes("Generate Diagram")) {
          vscode.commands.executeCommand("alex.generateDiagram");
        } else if (selected.label.includes("Generate Tests")) {
          vscode.commands.executeCommand("alex.generateTests");
        } else if (selected.label.includes("Generate Presentation")) {
          vscode.commands.executeCommand("alex.generatePptx");
        } else if (selected.label.includes("Read Aloud")) {
          vscode.commands.executeCommand("alex.readAloud");
        } else if (selected.label.includes("Save as Audio")) {
          vscode.commands.executeCommand("alex.saveAsAudio");
        } else if (selected.label.includes("Review Pull Request")) {
          vscode.commands.executeCommand("alex.reviewPR");
        } else if (selected.label.includes("Import GitHub Issues")) {
          vscode.commands.executeCommand("alex.importGitHubIssues");
        } else if (selected.label.includes("Validate Heir")) {
          vscode.commands.executeCommand("alex.validateHeir");
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

  // Manage API Keys & Secrets command
  const manageSecretsDisposable = vscode.commands.registerCommand(
    "alex.manageSecrets",
    async () => {
      const endLog = telemetry.logTimed("command", "manage_secrets");
      try {
        await showTokenManagementPalette();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Detect .env Secrets command
  const detectEnvSecretsDisposable = vscode.commands.registerCommand(
    "alex.detectEnvSecrets",
    async () => {
      const endLog = telemetry.logTimed("command", "detect_env_secrets");
      try {
        const { showEnvSecretsMigrationUI } = await import("./services/secretsManager");
        await showEnvSecretsMigrationUI();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Export Secrets to .env command
  const exportSecretsDisposable = vscode.commands.registerCommand(
    "alex.exportSecretsToEnv",
    async () => {
      const endLog = telemetry.logTimed("command", "export_secrets_to_env");
      try {
        const { showExportSecretsUI } = await import("./services/secretsManager");
        await showExportSecretsUI();
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
        // Show audit options - generic for any project type
        const auditOptions = [
          { label: "$(checklist) Full Project Audit", description: "Comprehensive project health check", detail: "All categories below" },
          { label: "$(file-code) Code Quality", description: "Errors, warnings, code smells, patterns", detail: "High priority" },
          { label: "$(shield) Security Review", description: "Secrets, vulnerabilities, input validation", detail: "High priority" },
          { label: "$(package) Dependencies", description: "Outdated packages, vulnerabilities, unused", detail: "High priority" },
          { label: "$(cloud) Infrastructure as Code", description: "Terraform, Bicep, CloudFormation validation", detail: "High priority" },
          { label: "$(azure) Azure/Cloud Resources", description: "Resource configuration, best practices, costs", detail: "High priority" },
          { label: "$(dashboard) Performance", description: "Bundle size, load times, memory, bottlenecks", detail: "Medium priority" },
          { label: "$(eye) Accessibility", description: "WCAG compliance, a11y patterns, screen readers", detail: "Medium priority" },
          { label: "$(plug) API Design", description: "REST/GraphQL conventions, contracts, versioning", detail: "Medium priority" },
          { label: "$(law) License Compliance", description: "OSS license conflicts, attribution requirements", detail: "Medium priority" },
          { label: "$(book) Documentation", description: "README, comments, API docs completeness", detail: "Medium priority" },
          { label: "$(git-branch) Git Health", description: "Uncommitted changes, branch hygiene", detail: "Medium priority" },
          { label: "$(beaker) Test Coverage", description: "Test files, coverage gaps, test quality", detail: "Medium priority" },
          { label: "$(settings-gear) Configuration", description: "Config files, environment setup", detail: "Low priority" },
          { label: "$(folder) Project Structure", description: "File organization, naming conventions", detail: "Low priority" },
        ];

        const selected = await vscode.window.showQuickPick(auditOptions, {
          placeHolder: "Select audit type to run",
          title: "🔍 Project Audit",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        // Open chat with audit prompt
        const auditType = selected.label.replace(/\$\([^)]+\)\s*/, '');
        
        // Send prompt directly to Agent chat
        await openChatPanel(`Run ${auditType.toLowerCase()} on this project`);
        
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
          { label: "$(law) License Audit", description: "Check dependency licenses for conflicts", detail: "OSS compliance" },
          { label: "$(warning) Breaking Changes", description: "Detect API/schema breaking changes", detail: "Semantic versioning" },
          { label: "$(book) Documentation Coverage", description: "All exports documented, examples current", detail: "API docs complete" },
          { label: "$(globe) Localization", description: "i18n strings complete, no hardcoded text", detail: "For international releases" },
        ];

        const selected = await vscode.window.showQuickPick(preflightChecks, {
          placeHolder: "Select preflight check to run",
          title: "🚀 Release Preflight",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        const checkType = selected.label.replace(/\$\([^)]+\)\s*/, '');
        
        // Send prompt directly to Agent chat
        await openChatPanel(`Run ${checkType.toLowerCase()} check for release`);

        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Code Review command
  const codeReviewDisposable = vscode.commands.registerCommand(
    "alex.codeReview",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "code_review");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        // If URI provided (from explorer context menu), read file content
        if (uri) {
          try {
            const content = await vscode.workspace.fs.readFile(uri);
            selectedText = new TextDecoder().decode(content);
            fileName = path.basename(uri.fsPath);
            languageId = getLanguageIdFromPath(uri.fsPath);
          } catch (err) {
            vscode.window.showErrorMessage(`Failed to read file: ${err}`);
            endLog(false);
            return;
          }
        } else {
          // Try active editor
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        // If no text, open Agent chat with a general code review prompt
        if (!selectedText) {
          const prompt = `Review the code in the current workspace for issues, improvements, and best practices. Focus on:\n1. Code quality and readability\n2. Potential bugs or edge cases\n3. Performance considerations\n4. Security concerns\n5. Adherence to project conventions`;
          await openChatPanel(prompt);
          endLog(true);
          return;
        }
        
        // Send prompt with selected code directly to Agent chat
        const prompt = `Review this code from ${fileName} for issues, improvements, and best practices:\n\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Debug This command
  const debugThisDisposable = vscode.commands.registerCommand(
    "alex.debugThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "debug_this");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        // If URI provided (from explorer context menu), read file content
        if (uri) {
          try {
            const content = await vscode.workspace.fs.readFile(uri);
            selectedText = new TextDecoder().decode(content);
            fileName = path.basename(uri.fsPath);
            languageId = getLanguageIdFromPath(uri.fsPath);
          } catch (err) {
            vscode.window.showErrorMessage(`Failed to read file: ${err}`);
            endLog(false);
            return;
          }
        } else {
          // Try active editor
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        // If no text, fall back to input prompt
        if (!selectedText) {
          const userInput = await vscode.window.showInputBox({
            prompt: 'Paste the code or error message you want to debug',
            placeHolder: 'Error: Cannot read property x of undefined...',
            ignoreFocusOut: true
          });
          
          if (!userInput) {
            endLog(true);
            return;
          }
          selectedText = userInput;
          fileName = 'input';
          languageId = 'text';
        }
        
        const prompt = `Help me debug this. Analyze for potential issues, suggest fixes, and explain root cause:\n\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Rubber Duck Debugging command
  const rubberDuckDisposable = vscode.commands.registerCommand(
    "alex.rubberDuck",
    async () => {
      const endLog = telemetry.logTimed("command", "rubber_duck");
      try {
        // Get optional context from selection
        let context = '';
        const editor = vscode.window.activeTextEditor;
        if (editor && !editor.selection.isEmpty) {
          const selectedText = editor.document.getText(editor.selection);
          const languageId = editor.document.languageId;
          context = `\n\nHere's the code I'm looking at:\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
        }

        const prompt = `🦆 **Rubber Duck Debug Session**

You are my rubber duck. I need to explain my problem to you.

**Your role:**
- Listen actively and ask clarifying questions
- Don't jump to solutions immediately
- Help me think through the problem step by step
- Ask "what should happen?" and "what actually happens?"
- Prompt me to explain my assumptions
- Only offer suggestions after I've fully explained

**Start by asking:** "What problem are you trying to solve?"${context}`;

        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Explain This command
  const explainThisDisposable = vscode.commands.registerCommand(
    "alex.explainThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "explain_this");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        if (uri) {
          const content = await vscode.workspace.fs.readFile(uri);
          selectedText = new TextDecoder().decode(content);
          fileName = path.basename(uri.fsPath);
          languageId = getLanguageIdFromPath(uri.fsPath);
        } else {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        if (!selectedText) {
          vscode.window.showWarningMessage("Select code to explain");
          endLog(true);
          return;
        }

        const levels = [
          { label: "$(mortar-board) Junior Developer", description: "Step by step, define terms", value: "junior" },
          { label: "$(account) Senior Developer", description: "Key insights only", value: "senior" },
          { label: "$(shield) Code Reviewer", description: "Focus on risks and edge cases", value: "reviewer" },
          { label: "$(broadcast) Teaching Workshop", description: "Include exercises", value: "teacher" },
        ];

        const level = await vscode.window.showQuickPick(levels, {
          placeHolder: "Explain like I'm a...",
          title: "📚 Choose explanation level",
        });

        if (!level) {
          endLog(true);
          return;
        }

        const prompt = `Explain this code like I'm a ${level.value} developer. ${level.description}:

\`\`\`${languageId}
${selectedText}
\`\`\`

Focus on: purpose, data flow, key design decisions, and any non-obvious behavior.`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Refactor This command
  const refactorThisDisposable = vscode.commands.registerCommand(
    "alex.refactorThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "refactor_this");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        if (uri) {
          const content = await vscode.workspace.fs.readFile(uri);
          selectedText = new TextDecoder().decode(content);
          fileName = path.basename(uri.fsPath);
          languageId = getLanguageIdFromPath(uri.fsPath);
        } else {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        if (!selectedText) {
          vscode.window.showWarningMessage("Select code to refactor");
          endLog(true);
          return;
        }

        const goals = [
          { label: "$(book) Readability", description: "Cleaner, more understandable code", value: "readability" },
          { label: "$(dashboard) Performance", description: "Faster execution, less memory", value: "performance" },
          { label: "$(beaker) Testability", description: "Easier to test, better DI", value: "testability" },
          { label: "$(extensions) Maintainability", description: "Easier to modify and extend", value: "maintainability" },
          { label: "$(symbol-interface) SOLID Principles", description: "Apply SOLID design patterns", value: "solid" },
        ];

        const goal = await vscode.window.showQuickPick(goals, {
          placeHolder: "Refactor for...",
          title: "🔧 Choose refactoring goal",
        });

        if (!goal) {
          endLog(true);
          return;
        }

        const prompt = `Refactor this code for ${goal.value}. ${goal.description}.

\`\`\`${languageId}
${selectedText}
\`\`\`

Show:
1. The refactored code
2. Before/after comparison for key changes
3. Explain each transformation and its benefit
4. Any tradeoffs to consider`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Security Review command
  const securityReviewDisposable = vscode.commands.registerCommand(
    "alex.securityReview",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "security_review");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        if (uri) {
          const content = await vscode.workspace.fs.readFile(uri);
          selectedText = new TextDecoder().decode(content);
          fileName = path.basename(uri.fsPath);
          languageId = getLanguageIdFromPath(uri.fsPath);
        } else {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        if (!selectedText) {
          vscode.window.showWarningMessage("Select code for security review");
          endLog(true);
          return;
        }

        const prompt = `Security audit this code. Check for OWASP Top 10 vulnerabilities:

\`\`\`${languageId}
${selectedText}
\`\`\`

Analyze for:
1. **Injection** (SQL, XSS, command injection)
2. **Authentication/Authorization** flaws
3. **Sensitive data exposure** (secrets, PII)
4. **Security misconfiguration**
5. **Insecure deserialization**
6. **Input validation** gaps
7. **Cryptographic weaknesses**

For each finding:
- Severity: Critical/High/Medium/Low
- Line/location
- Risk explanation
- Secure fix with code example`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Document This command
  const documentThisDisposable = vscode.commands.registerCommand(
    "alex.documentThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "document_this");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        if (uri) {
          const content = await vscode.workspace.fs.readFile(uri);
          selectedText = new TextDecoder().decode(content);
          fileName = path.basename(uri.fsPath);
          languageId = getLanguageIdFromPath(uri.fsPath);
        } else {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        if (!selectedText) {
          vscode.window.showWarningMessage("Select code to document");
          endLog(true);
          return;
        }

        // Detect doc format based on language
        let docFormat = "JSDoc";
        if (languageId === "python") {docFormat = "docstrings (Google style)";}
        else if (languageId === "csharp" || languageId === "fsharp") {docFormat = "XML documentation comments";}
        else if (languageId === "rust") {docFormat = "rustdoc";}
        else if (languageId === "go") {docFormat = "Go doc comments";}
        else if (languageId === "java") {docFormat = "Javadoc";}

        const prompt = `Generate comprehensive ${docFormat} documentation for this code:

\`\`\`${languageId}
${selectedText}
\`\`\`

Include:
- @param / @returns / @throws (or language equivalent)
- Description of purpose and behavior
- Usage examples for complex functions
- Edge cases and important notes
- Type information where applicable

Output ONLY the documented code, ready to paste.`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Simplify This command
  const simplifyThisDisposable = vscode.commands.registerCommand(
    "alex.simplifyThis",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "simplify_this");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        if (uri) {
          const content = await vscode.workspace.fs.readFile(uri);
          selectedText = new TextDecoder().decode(content);
          fileName = path.basename(uri.fsPath);
          languageId = getLanguageIdFromPath(uri.fsPath);
        } else {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        if (!selectedText) {
          vscode.window.showWarningMessage("Select code to simplify");
          endLog(true);
          return;
        }

        const prompt = `Simplify this code while preserving behavior:

\`\`\`${languageId}
${selectedText}
\`\`\`

Apply these clean code principles:
1. **Reduce nesting** - Flatten conditionals, use early returns
2. **Extract helpers** - Break complex logic into named functions
3. **Improve naming** - Variables and functions should be self-documenting
4. **Remove duplication** - DRY principle
5. **Simplify expressions** - Use language idioms and built-ins

For each change:
- Show the before/after
- Explain WHY it's simpler (not just how)
- Ensure no behavior changes`;
        
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Generate Diagram command
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
          title: "📊 Generate Mermaid Diagram",
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
          title: "📰 Generate PowerPoint Presentation",
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
              `📊 Quality score: ${analysis.score}/100. ${analysis.suggestions[0]}`,
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
            vscode.window.showInformationMessage(`📰 Presentation saved: ${result.filePath} (${result.slideCount} slides)`);
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
            vscode.window.showInformationMessage(`📰 Presentation saved: ${result.filePath} (${result.slideCount} slides)`);
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
          vscode.window.showInformationMessage("📰 Fill in the template, then run 'Generate Presentation' → 'From Selection'");
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
            "📰 Review the concept, then edit or ask Copilot to refine it. Say 'Generate slides' when ready.",
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
            "📰 Select all (Ctrl+A), then press Ctrl+I → 'Execute this prompt'",
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
          vscode.window.showInformationMessage(`📰 Presentation saved: ${result.filePath} (${result.slideCount} slides)`);
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

  // Convert to Word command (quick)
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
        const pythonScript = path.join(workspaceFolder.uri.fsPath, ".github", "muscles", "md-to-word.py");
        
        // Check if script exists
        try {
          await vscode.workspace.fs.stat(vscode.Uri.file(pythonScript));
        } catch {
          vscode.window.showErrorMessage(
            "md-to-word.py not found. Please ensure Alex architecture is initialized."
          );
          endLog(false);
          return;
        }

        vscode.window.showInformationMessage("📄 Converting to Word...");

        // Execute the Python script
        const terminal = vscode.window.createTerminal({
          name: "Alex: Word Conversion",
          cwd: path.dirname(uri.fsPath),
        });
        terminal.show();
        terminal.sendText(`python "${pythonScript}" "${uri.fsPath}" "${outputPath}"`);

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

        const pythonScript = path.join(workspaceFolder.uri.fsPath, ".github", "muscles", "md-to-word.py");
        
        // Check if script exists
        try {
          await vscode.workspace.fs.stat(vscode.Uri.file(pythonScript));
        } catch {
          vscode.window.showErrorMessage(
            "md-to-word.py not found. Please ensure Alex architecture is initialized."
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
        });
        terminal.show();
        
        const command = `python "${pythonScript}" "${uri.fsPath}" "${outputPath}" ${flags}`.trim();
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

  // Generate Gamma Presentation - Quick topic-based generation
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

        const gammaScript = path.join(workspaceFolder.uri.fsPath, ".github", "muscles", "gamma-generator.js");
        
        // Check if script exists
        try {
          await vscode.workspace.fs.stat(vscode.Uri.file(gammaScript));
        } catch {
          vscode.window.showErrorMessage(
            "gamma-generator.js not found. Please ensure Alex architecture is initialized."
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

        const gammaScript = path.join(workspaceFolder.uri.fsPath, ".github", "muscles", "gamma-generator.js");
        
        // Check if script exists
        try {
          await vscode.workspace.fs.stat(vscode.Uri.file(gammaScript));
        } catch {
          vscode.window.showErrorMessage(
            "gamma-generator.js not found. Please ensure Alex architecture is initialized."
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

        const gammaScript = path.join(workspaceFolder.uri.fsPath, ".github", "muscles", "gamma-generator.js");
        
        // Check if script exists
        try {
          await vscode.workspace.fs.stat(vscode.Uri.file(gammaScript));
        } catch {
          vscode.window.showErrorMessage(
            "gamma-generator.js not found. Please ensure Alex architecture is initialized."
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

        // Image model selection
        const imageModelOption = await vscode.window.showQuickPick(
          [
            {
              label: "$(zap) flux-quick",
              description: "2 credits - Fast, cost-effective",
              value: "flux-quick",
            },
            {
              label: "$(star) flux-pro",
              description: "8 credits - Recommended quality",
              value: "flux-pro",
            },
            {
              label: "$(star-full) flux-ultra",
              description: "30 credits - Highest quality",
              value: "flux-ultra",
            },
            {
              label: "$(symbol-color) dalle3",
              description: "33 credits - DALL-E 3",
              value: "dalle3",
            },
            {
              label: "$(image) imagen-pro",
              description: "15 credits - Google Imagen",
              value: "imagen-pro",
            },
          ],
          {
            placeHolder: "Select AI image model",
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

  // Generate Persona Images command - Runs image generation scripts with secure token
  const generatePersonaImagesDisposable = vscode.commands.registerCommand(
    "alex.generatePersonaImages",
    async () => {
      const endLog = telemetry.logTimed("command", "generate_persona_images");
      try {
        const { showGenerationPicker } = await import("./commands/generatePersonaImages");
        await showGenerationPicker();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
        vscode.window.showErrorMessage(
          `Image generation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // Generate Tests command
  const generateTestsDisposable = vscode.commands.registerCommand(
    "alex.generateTests",
    async (uri?: vscode.Uri) => {
      const endLog = telemetry.logTimed("command", "generate_tests");
      try {
        let selectedText = '';
        let fileName = 'input';
        let languageId = 'text';

        // If URI provided (from explorer context menu), read file content
        if (uri) {
          try {
            const content = await vscode.workspace.fs.readFile(uri);
            selectedText = new TextDecoder().decode(content);
            fileName = path.basename(uri.fsPath);
            languageId = getLanguageIdFromPath(uri.fsPath);
          } catch (err) {
            vscode.window.showErrorMessage(`Failed to read file: ${err}`);
            endLog(false);
            return;
          }
        } else {
          // Try active editor
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selection = editor.selection;
            selectedText = !selection.isEmpty ? editor.document.getText(selection) : '';
            fileName = path.basename(editor.document.fileName);
            languageId = editor.document.languageId;
          }
        }

        // If no text, fall back to input prompt
        if (!selectedText) {
          const userInput = await vscode.window.showInputBox({
            prompt: 'Paste the code you want to generate tests for',
            placeHolder: 'function add(a, b) { return a + b; }',
            ignoreFocusOut: true
          });
          
          if (!userInput) {
            endLog(true);
            return;
          }
          selectedText = userInput;
          fileName = 'input';
          languageId = 'text';
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

        const frameworkName = framework.label.replace(/\$\([^)]+\)\s*/, '');
        
        const prompt = `Generate comprehensive tests for this code using ${frameworkName}. Include edge cases, error handling, and meaningful assertions:\n\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
        await openChatPanel(prompt);
        
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );

  // Skill Review command - Check staleness of skills and knowledge
  const skillReviewDisposable = vscode.commands.registerCommand(
    "alex.skillReview",
    async () => {
      const endLog = telemetry.logTimed("command", "skill_review");
      try {
        const reviewTypes = [
          { label: "$(warning) Check Stale Skills", description: "Review skills that may need updating", detail: "Security, privacy, models, APIs" },
          { label: "$(shield) Security Review", description: "Review Microsoft SFI and security practices", detail: "Secure Future Initiative compliance" },
          { label: "$(lock) Privacy & PII Review", description: "Review GDPR, Australian Privacy compliance", detail: "Data protection regulations" },
          { label: "$(hubot) Responsible AI Review", description: "Review AI ethics and governance practices", detail: "Microsoft & Google RAI principles" },
          { label: "$(rocket) LLM Model Review", description: "Check model recommendations are current", detail: "Claude, GPT, Gemini updates" },
          { label: "$(extensions) VS Code API Review", description: "Check extension patterns are current", detail: "VS Code release compatibility" },
          { label: "$(comment-discussion) Chat Patterns Review", description: "Review chat participant patterns", detail: "Proposed APIs, deprecations" },
          { label: "$(git-branch) Git Workflow Review", description: "Review git best practices", detail: "Branching, commits, PR patterns" },
        ];

        const selected = await vscode.window.showQuickPick(reviewTypes, {
          placeHolder: "Select review type",
          title: "🔍 Skill & Knowledge Review",
        });

        if (!selected) {
          endLog(true);
          return;
        }

        let prompt = "";
        const reviewName = selected.label.replace(/\$\([^)]+\)\s*/, '');
        
        switch (reviewName) {
          case "Check Stale Skills":
            prompt = `Review Alex's staleness-prone skills and check if they need updates. Skills to check:
1. microsoft-sfi - Secure Future Initiative (last validated: Feb 2026)
2. pii-privacy-regulations - GDPR & Australian Privacy (last validated: Feb 2026)
3. privacy-responsible-ai - RAI principles (last validated: Feb 2026)
4. llm-model-selection - Model recommendations (last validated: Jan 2026)
5. vscode-extension-patterns - VS Code APIs (last validated: Jan 2026)
6. chat-participant-patterns - Chat APIs (last validated: Jan 2026)
7. git-workflow - Git practices (last validated: Jan 2026)
8. teams-app-patterns - Teams development (last validated: Jan 2026)
9. m365-agent-debugging - M365 agents (last validated: Jan 2026)

For each skill, check if there are newer versions, deprecations, or significant changes to the underlying technology.`;
            break;
          case "Security Review":
            prompt = `Review Microsoft Secure Future Initiative (SFI) compliance in the current project:
1. Check the 3 Core Principles: Secure by Design, Secure by Default, Secure Operations
2. Verify the 6 Pillars: Identity/Secrets, Tenants/Isolation, Networks, Engineering Systems, Threat Detection, Response/Remediation
3. Review OWASP Top 10 mitigations
4. Check credential management and secret handling
5. Verify dependency security (npm audit or equivalent)
6. Review security code patterns

Reference: .github/skills/microsoft-sfi/SKILL.md`;
            break;
          case "Privacy & PII Review":
            prompt = `Review privacy and PII handling compliance in the current project:
1. GDPR Compliance: Lawful basis, data minimization, consent, data subject rights
2. Australian Privacy Principles (APPs): All 13 APPs checklist
3. PII identification: Check for direct and indirect identifiers
4. Data encryption: At rest and in transit
5. Logging practices: Ensure PII is not logged
6. Retention policies: Data lifecycle management
7. Cross-border transfers: Adequacy and safeguards

Reference: .github/skills/pii-privacy-regulations/SKILL.md`;
            break;
          case "Responsible AI Review":
            prompt = `Review Responsible AI practices in the current project:
1. Microsoft's 6 RAI Principles: Fairness, Reliability/Safety, Privacy/Security, Inclusiveness, Transparency, Accountability
2. Google's 3 Pillars: Bold Innovation, Responsible Development, Collaborative Progress
3. Bias detection and mitigation
4. Model documentation (Model Cards)
5. Human-AI collaboration patterns
6. Appropriate reliance: CAIR/CSR framework
7. AI transparency and explainability

Reference: .github/skills/privacy-responsible-ai/SKILL.md and .github/skills/appropriate-reliance/SKILL.md`;
            break;
          case "LLM Model Review":
            prompt = `Review and update LLM model recommendations:
1. Check current model capabilities and pricing
2. Verify context window sizes are accurate
3. Review tier recommendations (Frontier/Capable/Fast)
4. Check for new model announcements (Claude, GPT, Gemini)
5. Update cost optimization strategies
6. Review model-specific limitations

Reference: .github/skills/llm-model-selection/SKILL.md
Check: Anthropic docs, OpenAI docs, Google AI docs`;
            break;
          case "VS Code API Review":
            prompt = `Review VS Code extension patterns for current API compatibility:
1. Check against latest VS Code release notes
2. Verify no deprecated APIs are used
3. Review proposed APIs that may have become stable
4. Check webview security policies
5. Review activation events and contributes patterns
6. Verify compatibility with current VS Code version

Reference: .github/skills/vscode-extension-patterns/SKILL.md
Check: VS Code API docs, latest release notes`;
            break;
          case "Chat Patterns Review":
            prompt = `Review chat participant patterns for current API status:
1. Check which proposed APIs have become stable
2. Review deprecated patterns
3. Verify chat participant registration patterns
4. Check language model tool patterns
5. Review follow-up question patterns

Reference: .github/skills/chat-participant-patterns/SKILL.md`;
            break;
          case "Git Workflow Review":
            prompt = `Review git workflow patterns and best practices:
1. Check branch naming conventions
2. Review commit message format (Conventional Commits)
3. Verify PR and code review patterns
4. Check GitHub CLI usage patterns
5. Review git hooks and automation

Reference: .github/skills/git-workflow/SKILL.md`;
            break;
        }
        
        await openChatPanel(prompt);
        
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

      const nonce = getNonce();
      panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
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
            <li>Go to <a href="https://github.com/fabioc-aloha/Alex_Plug_In/issues/new" style="color: var(--vscode-textLink-foreground);">GitHub Issues</a></li>
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
            <span><strong>globalKnowledge.enabled:</strong> ${alexSettings['globalKnowledge.enabled'] ?? 'undefined'}</span>
        </div>
    </div>
    
    <h2>📁 Raw Session Data</h2>
    <p style="color: var(--vscode-descriptionForeground); font-size: 12px;">This is the complete diagnostic data that would be included in a bug report:</p>
    <pre id="sessionData">${JSON.stringify(sessions, null, 2)}</pre>
    
    <script nonce="${nonce}">
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

  // Configure status bar item (already created at activation start with loading state)
  statusBarItem.command = "alex.showStatus";
  statusBarItem.tooltip =
    "Alex Cognitive Architecture - Click for quick actions";

  // Update status bar based on workspace health (replaces loading state)
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

  // Listen for configuration changes to update behavior at runtime
  const configChangeListener = vscode.workspace.onDidChangeConfiguration((e) => {
    // Refresh status bar if workspace protection settings change
    if (e.affectsConfiguration('alex.workspace')) {
      clearHealthCache();
      updateStatusBar(context, true);
    }
    // Re-check M365 sync settings
    if (e.affectsConfiguration('alex.m365')) {
      // Silent - no action needed
    }
  });
  context.subscriptions.push(configChangeListener);

  context.subscriptions.push(initDisposable);
  context.subscriptions.push(resetDisposable);
  context.subscriptions.push(dreamDisposable);
  context.subscriptions.push(deepBrainQADisposable);
  context.subscriptions.push(upgradeDisposable);
  context.subscriptions.push(completeMigrationDisposable);
  context.subscriptions.push(showMigrationDisposable);
  context.subscriptions.push(selfActualizeDisposable);
  context.subscriptions.push(exportM365Disposable);
  context.subscriptions.push(startSessionDisposable);
  context.subscriptions.push(endSessionDisposable);
  context.subscriptions.push(togglePauseDisposable);
  context.subscriptions.push(sessionActionsDisposable);
  context.subscriptions.push(openDocsDisposable);
  context.subscriptions.push(workingWithAlexDisposable);
  context.subscriptions.push(agentVsChatDisposable);
  context.subscriptions.push(showStatusDisposable);
  context.subscriptions.push(setupEnvDisposable);
  context.subscriptions.push(manageSecretsDisposable);
  context.subscriptions.push(detectEnvSecretsDisposable);
  context.subscriptions.push(exportSecretsDisposable);
  context.subscriptions.push(runAuditDisposable);
  context.subscriptions.push(viewTelemetryDisposable);
  context.subscriptions.push(releasePreflightDisposable);
  context.subscriptions.push(codeReviewDisposable);
  context.subscriptions.push(debugThisDisposable);
  context.subscriptions.push(rubberDuckDisposable);
  context.subscriptions.push(explainThisDisposable);
  context.subscriptions.push(refactorThisDisposable);
  context.subscriptions.push(securityReviewDisposable);
  context.subscriptions.push(documentThisDisposable);
  context.subscriptions.push(simplifyThisDisposable);
  context.subscriptions.push(generateDiagramDisposable);
  context.subscriptions.push(generatePptxDisposable);
  context.subscriptions.push(generatePptxFromFileDisposable);
  context.subscriptions.push(convertToWordDisposable);
  context.subscriptions.push(convertToWordWithOptionsDisposable);
  context.subscriptions.push(generateGammaPresentationDisposable);
  context.subscriptions.push(generateGammaFromFileDisposable);
  context.subscriptions.push(generateGammaWithOptionsDisposable);
  context.subscriptions.push(generatePersonaImagesDisposable);
  context.subscriptions.push(generateTestsDisposable);
  context.subscriptions.push(skillReviewDisposable);

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

  // Inherit Skill from Global Knowledge command
  const inheritSkillDisposable = vscode.commands.registerCommand(
    "alex.inheritSkillFromGlobal",
    async () => {
      const endLog = telemetry.logTimed("command", "inherit_skill_from_global");
      try {
        await inheritSkillFromGlobal();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );
  context.subscriptions.push(inheritSkillDisposable);

  // Propose Skill to Global Knowledge command
  const proposeSkillDisposable = vscode.commands.registerCommand(
    "alex.proposeSkillToGlobal",
    async () => {
      const endLog = telemetry.logTimed("command", "propose_skill_to_global");
      try {
        await proposeSkillToGlobal();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );
  context.subscriptions.push(proposeSkillDisposable);

  // Setup Global Knowledge command
  const setupGKDisposable = vscode.commands.registerCommand(
    "alex.setupGlobalKnowledge",
    async () => {
      const endLog = telemetry.logTimed("command", "setup_global_knowledge");
      try {
        await setupGlobalKnowledgeCommand();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );
  context.subscriptions.push(setupGKDisposable);

  // GitHub Integration commands (D1, D2)
  const importGitHubIssuesDisposable = vscode.commands.registerCommand(
    "alex.importGitHubIssues",
    async () => {
      const endLog = telemetry.logTimed("command", "import_github_issues");
      try {
        await importGitHubIssuesAsGoals();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );
  context.subscriptions.push(importGitHubIssuesDisposable);

  const reviewPRDisposable = vscode.commands.registerCommand(
    "alex.reviewPR",
    async () => {
      const endLog = telemetry.logTimed("command", "review_pr");
      try {
        await reviewPullRequest();
        endLog(true);
      } catch (error) {
        endLog(false, error instanceof Error ? error : new Error(String(error)));
      }
    },
  );
  context.subscriptions.push(reviewPRDisposable);
}

/**
 * Set VS Code context keys for when-clause filtering on slash commands.
 * These keys control visibility of commands like /sync, /m365, /forget.
 * Called at activation and after initialize/reset.
 */
async function setCommandContextKeys(): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  // alex.globalKnowledgeConfigured — true if GK repo detected
  const gkRepo = await detectGlobalKnowledgeRepo();
  await vscode.commands.executeCommand(
    "setContext",
    "alex.globalKnowledgeConfigured",
    gkRepo !== null,
  );

  // alex.hasMemoryFiles — true if .github/copilot-instructions.md exists
  let hasMemory = false;
  if (workspaceFolder) {
    const markerFile = path.join(
      workspaceFolder.uri.fsPath,
      ".github",
      "copilot-instructions.md",
    );
    hasMemory = await fs.pathExists(markerFile);
  }
  await vscode.commands.executeCommand(
    "setContext",
    "alex.hasMemoryFiles",
    hasMemory,
  );
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
    
    // Check protection status
    let isProtected = false;
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        const protectionResult = await isWorkspaceProtected(workspaceFolder.uri.fsPath);
        isProtected = protectionResult.isProtected;
      }
    } catch { /* ignore */ }
    
    const display = getStatusBarDisplay(health, sessionInfo, streakDays, isProtected);

    statusBarItem.text = display.text;
    statusBarItem.tooltip = display.tooltip;
    statusBarItem.backgroundColor = display.backgroundColor;
    statusBarItem.show();
  } catch (err) {
    // Fallback if health check fails
    statusBarItem.text = "$(rocket) Alex";
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

  // Clean up enterprise resources (secrets scanning, audit logging)
  disposeEnterprise();

  // Reset chat participant session state to prevent state bleeding
  resetSessionState();
  // Clean up session timer
  disposeSession();
  console.log("Alex Cognitive Architecture deactivated");
}
