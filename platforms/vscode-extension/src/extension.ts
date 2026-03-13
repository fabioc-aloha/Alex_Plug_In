import * as vscode from "vscode";
import {
  setExtensionPathForCss,
  applyMarkdownStyles,
} from "./commands/setupEnvironment";
import { registerContextMenuCommands } from "./commands/contextMenu";
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
} from "./services/secretsManager";
import { initOutcomeTracker } from "./services/outcomeTracker";
import { initExpertiseModel } from "./services/expertiseModel";
import { flushEpisodicDraft } from "./services/episodicMemory";
import { ensureGlobalKnowledgeSetup } from "./commands/setupGlobalKnowledge";
import {
  clearHealthCache,
} from "./shared/healthCheck";
import { detectCognitiveLevel, invalidateCognitiveLevelCache } from "./shared/cognitiveTier";
import { registerWelcomeView } from "./views/welcomeView";
import { registerHealthDashboard } from "./views/healthDashboard";
import { logInfo, disposeLog } from './shared/logger';

import { CognitiveTaskProvider } from "./tasks/cognitiveTaskProvider";
import * as telemetry from "./shared/telemetry";
import {
  isOperationInProgress,
} from "./shared/operationLock";
import { registerPresentationCommands } from "./commandsPresentation";
import { registerDeveloperCommands } from "./commandsDeveloper";
import { registerCoreCommands } from "./commandsCore";
import { setCommandContextKeys, updateStatusBar, startPeriodicHealthCheck, checkVersionUpgrade } from "./services/extensionLifecycle";

// Re-export for backward compatibility (other modules may import from extension.ts)
export { isOperationInProgress };

// Status bar item for Alex health
let statusBarItem: vscode.StatusBarItem;

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

  // Phase 1: Initialize services and tools
  telemetry.initTelemetry(context, extensionVersion);
  telemetry.log("lifecycle", "extension_activate", {
    extensionVersion,
    vscodeVersion: vscode.version,
  });

  setExtensionPathForCss(context.extensionPath);

  checkVersionUpgrade(context).catch(err =>
    console.warn('[Alex] Version upgrade check failed:', err)
  );

  registerChatParticipant(context);

  const workspaceRootForWatcher = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  if (workspaceRootForWatcher) {
    context.subscriptions.push(registerFileWatcher(context, workspaceRootForWatcher));
  }

  registerLanguageModelTools(context);

  // Initialize secrets in parallel (GK secrets + secrets manager are independent)
  await Promise.all([
    initGlobalKnowledgeSecrets(context).catch(err =>
      console.warn('[Alex] Failed to initialize GK secrets:', err)
    ),
    initSecretsManager(context).then(() =>
      logInfo('[Alex] Secrets manager initialized')
    ).catch(err =>
      console.warn('[Alex] Failed to initialize secrets manager:', err)
    ),
  ]);

  initOutcomeTracker(context);
  initExpertiseModel(context);
  context.subscriptions.push({ dispose: () => { flushEpisodicDraft().catch(() => {}); } });
  
  ensureGlobalKnowledgeSetup().catch(err => {
    console.warn('[Alex] Global Knowledge auto-setup skipped:', err);
  });
  
  registerGlobalKnowledgeTools(context);
  registerContextMenuCommands(context);

  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(CognitiveTaskProvider.type, new CognitiveTaskProvider())
  );

  registerWelcomeView(context);
  registerHealthDashboard(context);

  ensureGlobalKnowledgeDirectories()
    .then(() => {
      registerCurrentProject().catch((err) => {
        console.warn("Failed to register current project:", err);
      });
    })
    .catch((err) => {
      console.warn("Failed to initialize global knowledge directories:", err);
    });

  setCommandContextKeys().catch((err) => {
    console.warn("Failed to set command context keys:", err);
  });

  applyMarkdownStyles().catch((err) => {
    console.warn("Failed to apply markdown styles on activation:", err);
  });

  // Phase 2: Register all commands
  registerCoreCommands(context, statusBarItem);
  registerPresentationCommands(context);
  registerDeveloperCommands(context, extensionVersion);

  // Phase 3: Configure status bar and watchers
  statusBarItem.command = "alex.showStatus";
  statusBarItem.tooltip =
    "Alex Cognitive Architecture - Click for quick actions";

  // Defer heavy status bar update (checkHealth does file I/O scans)
  // Show a ready indicator immediately, then update asynchronously
  statusBarItem.text = "$(rocket) Alex";
  setTimeout(() => updateStatusBar(statusBarItem), 200);
  startPeriodicHealthCheck(context, statusBarItem);

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearHealthCache();
      updateStatusBar(statusBarItem, true);
    }),
  );

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

  const configChangeListener = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('alex.workspace')) {
      clearHealthCache();
      updateStatusBar(statusBarItem, true);
    }
    if (e.affectsConfiguration('alex.m365')) {
      // Silent - no action needed
    }
    if (e.affectsConfiguration('chat.agent') ||
        e.affectsConfiguration('chat.extendedThinking') ||
        e.affectsConfiguration('chat.mcp') ||
        e.affectsConfiguration('claude-opus') ||
        e.affectsConfiguration('github.copilot.chat') ||
        e.affectsConfiguration('github.copilot.chat.models')) {
      invalidateCognitiveLevelCache();
      detectCognitiveLevel(true).then(() => {
        vscode.commands.executeCommand('alex.refreshWelcomeView').then(undefined, () => {});
      }).catch(() => {});
    }
  });
  context.subscriptions.push(configChangeListener);
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
  logInfo('Alex Cognitive Architecture deactivated');
  disposeLog();
}
