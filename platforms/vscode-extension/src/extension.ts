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
import { upgradeArchitecture } from "./commands/upgrade";
import { completeMigration, showMigrationCandidates } from "./commands/upgradeMigration";
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
} from "./commands/session";
import { registerGoalsCommands } from "./commands/goals";
import { generateSkillCatalog } from "./commands/skillCatalog";
import { inheritSkillFromGlobal } from "./commands/inheritSkill";
import { proposeSkillToGlobal } from "./commands/proposeSkill";
import { ensureGlobalKnowledgeSetup, setupGlobalKnowledgeCommand } from "./commands/setupGlobalKnowledge";
import { importGitHubIssuesAsGoals, reviewPullRequest } from "./commands/githubIntegration";
import { registerTTSCommands } from "./commands/readAloud";
import { registerChatParticipant, resetSessionState } from "./chat/participant";
import { registerFileWatcher } from "./chat/fileWatcher";
import { saveSessionEmotion } from "./chat/emotionalMemory";
import { registerLanguageModelTools } from "./chat/tools";
import {
  registerGlobalKnowledgeTools,
  ensureGlobalKnowledgeDirectories,
  registerCurrentProject,
  initGlobalKnowledgeSecrets,
} from "./chat/globalKnowledge";
import {
  initSecretsManager,
  showTokenManagementPalette,
} from "./services/secretsManager";
import { initOutcomeTracker, recordPositiveOutcomeCommand, recordNegativeOutcomeCommand, showOutcomeStatsCommand } from "./services/outcomeTracker";
import { initTaskDetector, showPendingTasksCommand, forceCheckTasksCommand } from "./services/taskDetector";
import { initExpertiseModel, showExpertiseModelCommand } from "./services/expertiseModel";
import { flushEpisodicDraft, recallSessionCommand, showSessionHistoryCommand } from "./services/episodicMemory";
import { runWorkflowCommand, listWorkflowsCommand } from "./services/workflowEngine";
import {
  clearHealthCache,
  HealthStatus,
  registerSessionProvider,
  registerStreakProvider,
} from "./shared/healthCheck";
import { getLanguageIdFromPath, openChatPanel } from "./shared/utils";
import { requireCognitiveLevel, detectCognitiveLevel, invalidateCognitiveLevelCache } from "./shared/cognitiveTier";
import { registerWelcomeView } from "./views/welcomeView";
import { registerHealthDashboard } from "./views/healthDashboard";

import { CognitiveTaskProvider } from "./tasks/cognitiveTaskProvider";
import { registerUXCommands } from "./ux/uxFeatures";
import * as telemetry from "./shared/telemetry";
import {
  isOperationInProgress,
  setOperationInProgress,
} from "./shared/operationLock";
import { registerPresentationCommands } from "./commandsPresentation";
import { registerDeveloperCommands } from "./commandsDeveloper";
import { showStatusQuickPick } from "./commands/statusQuickPick";
import { setCommandContextKeys, updateStatusBar, startPeriodicHealthCheck, checkVersionUpgrade } from "./services/extensionLifecycle";

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

  // Set extension path for markdown CSS lookup
  // This allows setupEnvironment to find the bundled CSS file
  setExtensionPathForCss(context.extensionPath);

  // Check for version upgrade and notify user
  checkVersionUpgrade(context).catch(err =>
    console.warn('[Alex] Version upgrade check failed:', err)
  );

  // Register chat participant for @alex conversations
  registerChatParticipant(context);

  // v5.9.8: Background file watcher — ambient workspace observation (hot files, stalled work, TODO hotspots)
  const workspaceRootForWatcher = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  if (workspaceRootForWatcher) {
    context.subscriptions.push(registerFileWatcher(context, workspaceRootForWatcher));
  }

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

  // v6.0.0: Initialize partnership services
  initOutcomeTracker(context);
  initExpertiseModel(context);
  initTaskDetector(context, vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '');
  context.subscriptions.push({ dispose: () => { flushEpisodicDraft().catch(() => {}); } });
  
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
          await updateStatusBar(statusBarItem, true);
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
          await updateStatusBar(statusBarItem, true);
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
      if (!(await requireCognitiveLevel('alex.dream'))) { return; }
      const done = telemetry.logTimed("command", "dream");
      await withOperationLock("Dream Protocol", async () => {
        try {
          await runDreamProtocol(context);
          // Refresh status bar after dream (synapses may have been repaired)
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);
          
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
              await updateStatusBar(statusBarItem, true);
              
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
          await updateStatusBar(statusBarItem, true);
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
          await updateStatusBar(statusBarItem, true);
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
      if (!(await requireCognitiveLevel('alex.selfActualize'))) { return; }
      const done = telemetry.logTimed("command", "self_actualize");
      await withOperationLock("Self-Actualization", async () => {
        try {
          await runSelfActualization(context);
          // Refresh status bar after self-actualization
          clearHealthCache();
          await updateStatusBar(statusBarItem, true);
          
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
      if (!(await requireCognitiveLevel('alex.meditate'))) { return; }
      await openChatPanel("/meditate");
    },
  );
  context.subscriptions.push(meditateDisposable);

  // North Star command - opens chat with /northstar prompt for vision definition
  const northStarDisposable = vscode.commands.registerCommand(
    "alex.northStar",
    async () => {
      if (!(await requireCognitiveLevel('alex.northStar'))) { return; }
      telemetry.log("command", "north_star");
      await openChatPanel("/northstar");
    },
  );
  context.subscriptions.push(northStarDisposable);

  // Session timer commands
  initializeSessionStatusBar(context);

  // Register learning goals commands
  registerGoalsCommands(context);

  // Register TTS (Text-to-Speech) commands
  registerTTSCommands(context);

  // Register v5.2.0 UX Excellence features (voice toggle, quick commands, daily briefing)
  registerUXCommands(context);



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

  // Cognitive Levels & Subscription Guide
  const cognitiveLevelsDisposable = vscode.commands.registerCommand(
    "alex.cognitiveLevels",
    async () => {
      const guidePath = vscode.Uri.joinPath(
        context.extensionUri,
        "alex_docs",
        "architecture",
        "VSCODE-BRAIN-INTEGRATION.md",
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
    showStatusQuickPick,
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
      if (!(await requireCognitiveLevel('alex.runAudit'))) { return; }
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
      if (!(await requireCognitiveLevel('alex.releasePreflight'))) { return; }
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

  // Configure status bar item (already created at activation start with loading state)
  statusBarItem.command = "alex.showStatus";
  statusBarItem.tooltip =
    "Alex Cognitive Architecture - Click for quick actions";

  // Update status bar based on workspace health (replaces loading state)
  updateStatusBar(statusBarItem);

  // Start periodic health checks (every 5 minutes)
  startPeriodicHealthCheck(context, statusBarItem);

  // Re-check status when workspace folders change
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearHealthCache();
      updateStatusBar(statusBarItem, true);
    }),
  );

  // Watch for changes in Alex memory files and refresh status
  const memoryWatcher = vscode.workspace.createFileSystemWatcher(
    "**/.github/{copilot-instructions.md,instructions/*.md,prompts/*.md,skills/*/SKILL.md,domain-knowledge/*.md}",
  );
  memoryWatcher.onDidChange(() => {
    clearHealthCache();
    updateStatusBar(statusBarItem, true);
  });
  memoryWatcher.onDidCreate(() => {
    clearHealthCache();
    updateStatusBar(statusBarItem, true);
  });
  memoryWatcher.onDidDelete(() => {
    clearHealthCache();
    updateStatusBar(statusBarItem, true);
  });
  context.subscriptions.push(memoryWatcher);

  // Listen for configuration changes to update behavior at runtime
  const configChangeListener = vscode.workspace.onDidChangeConfiguration((e) => {
    // Refresh status bar if workspace protection settings change
    if (e.affectsConfiguration('alex.workspace')) {
      clearHealthCache();
      updateStatusBar(statusBarItem, true);
    }
    // Re-check M365 sync settings
    if (e.affectsConfiguration('alex.m365')) {
      // Silent - no action needed
    }
    // Invalidate cognitive tier cache when relevant settings change, then re-detect
    if (e.affectsConfiguration('chat.agent') ||
        e.affectsConfiguration('chat.extendedThinking') ||
        e.affectsConfiguration('chat.mcp') ||
        e.affectsConfiguration('claude-opus') ||
        e.affectsConfiguration('github.copilot.chat') ||
        e.affectsConfiguration('github.copilot.chat.models')) {
      invalidateCognitiveLevelCache();
      // Re-detect and refresh welcome view so tier badges update immediately
      detectCognitiveLevel(true).then(() => {
        vscode.commands.executeCommand('alex.refreshWelcomeView').then(undefined, () => {});
      }).catch(() => {});
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
  context.subscriptions.push(cognitiveLevelsDisposable);
  context.subscriptions.push(agentVsChatDisposable);
  context.subscriptions.push(showStatusDisposable);
  context.subscriptions.push(setupEnvDisposable);
  context.subscriptions.push(manageSecretsDisposable);
  context.subscriptions.push(detectEnvSecretsDisposable);
  context.subscriptions.push(exportSecretsDisposable);
  context.subscriptions.push(runAuditDisposable);
  context.subscriptions.push(releasePreflightDisposable);

  // Register extracted command groups
  registerPresentationCommands(context);
  registerDeveloperCommands(context, extensionVersion);

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
      if (!(await requireCognitiveLevel('alex.inheritSkillFromGlobal'))) { return; }
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
      if (!(await requireCognitiveLevel('alex.proposeSkillToGlobal'))) { return; }
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
      if (!(await requireCognitiveLevel('alex.reviewPR'))) { return; }
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

  // v6.0.0: Partnership Release commands
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.recallSession", recallSessionCommand),
    vscode.commands.registerCommand("alex.showSessionHistory", showSessionHistoryCommand),
    vscode.commands.registerCommand("alex.recordPositiveOutcome", recordPositiveOutcomeCommand),
    vscode.commands.registerCommand("alex.recordNegativeOutcome", recordNegativeOutcomeCommand),
    vscode.commands.registerCommand("alex.showOutcomeStats", showOutcomeStatsCommand),
    vscode.commands.registerCommand("alex.showPendingTasks", showPendingTasksCommand),
    vscode.commands.registerCommand("alex.forceCheckTasks", forceCheckTasksCommand),
    vscode.commands.registerCommand("alex.runWorkflow", runWorkflowCommand),
    vscode.commands.registerCommand("alex.listWorkflows", listWorkflowsCommand),
    vscode.commands.registerCommand("alex.showExpertiseModel", showExpertiseModelCommand),
  );
}

/**
 * Clean up resources when extension is deactivated
 * Note: Background sync timer cleanup is handled via context.subscriptions
 */
export function deactivate() {
  // v5.9.3: Save emotional memory arc before shutdown
  const wsRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (wsRoot) {
    saveSessionEmotion(wsRoot).catch((err) => {
      console.warn("[Alex] Failed to save emotional memory:", err);
    });
  }

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
