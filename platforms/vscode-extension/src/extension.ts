import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { initializeArchitecture, resetArchitecture } from './commands/initialize';
import { runDreamProtocol } from './commands/dream';
import { upgradeArchitecture } from './commands/upgrade';
import { runSelfActualization } from './commands/self-actualization';
import { runExportForM365 } from './commands/exportForM365';
import { registerContextMenuCommands } from './commands/contextMenu';
import { 
    initializeSessionStatusBar, 
    startSession, 
    endSession, 
    togglePauseSession, 
    showSessionActions,
    disposeSession 
} from './commands/session';
import { registerGoalsCommands } from './commands/goals';
import { registerChatParticipant, resetSessionState } from './chat/participant';
import { registerLanguageModelTools } from './chat/tools';
import { registerGlobalKnowledgeTools, ensureGlobalKnowledgeDirectories, registerCurrentProject } from './chat/globalKnowledge';
import { registerCloudSyncTools, syncWithCloud, pushToCloud, pullFromCloud, getCloudUrl, startBackgroundSync } from './chat/cloudSync';
import { checkHealth, getStatusBarDisplay, clearHealthCache, HealthStatus } from './shared/healthCheck';
import { registerWelcomeView } from './views/welcomeView';
import { registerHealthDashboard } from './views/healthDashboard';

// Operation lock to prevent concurrent modifications
let operationInProgress = false;

// Status bar item for Alex health
let statusBarItem: vscode.StatusBarItem;

async function withOperationLock<T>(
    operationName: string,
    operation: () => Promise<T>
): Promise<T | undefined> {
    if (operationInProgress) {
        vscode.window.showWarningMessage(
            `Another Alex operation is already in progress. Please wait for it to complete before running "${operationName}".`
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
    console.log('Alex Cognitive Architecture is now active!');

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
    ensureGlobalKnowledgeDirectories().then(() => {
        // Register current project in the global registry
        registerCurrentProject().catch(err => {
            console.warn('Failed to register current project:', err);
        });
    }).catch(err => {
        console.warn('Failed to initialize global knowledge directories:', err);
    });

    let initDisposable = vscode.commands.registerCommand('alex.initialize', async () => {
        await withOperationLock('Initialize', async () => {
            await initializeArchitecture(context);
            // Refresh status bar after initialization
            clearHealthCache();
            await updateStatusBar(context, true);
        });
    });

    let resetDisposable = vscode.commands.registerCommand('alex.reset', async () => {
        await withOperationLock('Reset', async () => {
            await resetArchitecture(context);
            // Refresh status bar after reset
            clearHealthCache();
            await updateStatusBar(context, true);
        });
    });

    let dreamDisposable = vscode.commands.registerCommand('alex.dream', async () => {
        await withOperationLock('Dream Protocol', async () => {
            await runDreamProtocol(context);
            // Refresh status bar after dream (synapses may have been repaired)
            clearHealthCache();
            await updateStatusBar(context, true);
        });
    });

    let upgradeDisposable = vscode.commands.registerCommand('alex.upgrade', async () => {
        await withOperationLock('Upgrade', async () => {
            await upgradeArchitecture(context);
            // Refresh status bar after upgrade
            clearHealthCache();
            await updateStatusBar(context, true);
        });
    });

    let selfActualizeDisposable = vscode.commands.registerCommand('alex.selfActualize', async () => {
        await withOperationLock('Self-Actualization', async () => {
            await runSelfActualization(context);
            // Refresh status bar after self-actualization
            clearHealthCache();
            await updateStatusBar(context, true);
        });
    });

    // M365 export command
    let exportM365Disposable = vscode.commands.registerCommand('alex.exportForM365', async () => {
        await runExportForM365(context);
    });

    // Session timer commands
    initializeSessionStatusBar(context);
    
    // Register learning goals commands
    registerGoalsCommands(context);
    
    const startSessionDisposable = vscode.commands.registerCommand('alex.startSession', async () => {
        await startSession();
    });
    
    const endSessionDisposable = vscode.commands.registerCommand('alex.endSession', async () => {
        await endSession(true);
    });
    
    const togglePauseDisposable = vscode.commands.registerCommand('alex.togglePauseSession', async () => {
        await togglePauseSession();
    });
    
    const sessionActionsDisposable = vscode.commands.registerCommand('alex.sessionActions', async () => {
        await showSessionActions();
    });

    // Cloud sync commands
    const syncDisposable = vscode.commands.registerCommand('alex.syncKnowledge', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Syncing Global Knowledge...',
            cancellable: false
        }, async () => {
            const result = await syncWithCloud();
            if (result.success) {
                const url = await getCloudUrl();
                const viewButton = url ? 'View Gist' : undefined;
                const selection = await vscode.window.showInformationMessage(
                    `✅ ${result.message}`,
                    ...(viewButton ? [viewButton] : [])
                );
                if (selection === 'View Gist' && url) {
                    vscode.env.openExternal(vscode.Uri.parse(url));
                }
            } else {
                vscode.window.showErrorMessage(`❌ ${result.message}`);
            }
        });
    });

    const pushDisposable = vscode.commands.registerCommand('alex.pushKnowledge', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Pushing to Cloud...',
            cancellable: false
        }, async () => {
            const result = await pushToCloud();
            if (result.success) {
                vscode.window.showInformationMessage(`✅ ${result.message}`);
            } else {
                vscode.window.showErrorMessage(`❌ ${result.message}`);
            }
        });
    });

    const pullDisposable = vscode.commands.registerCommand('alex.pullKnowledge', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Pulling from Cloud...',
            cancellable: false
        }, async () => {
            const result = await pullFromCloud();
            if (result.success) {
                vscode.window.showInformationMessage(`✅ ${result.message}`);
            } else {
                vscode.window.showErrorMessage(`❌ ${result.message}`);
            }
        });
    });

    // Documentation command - opens alex_docs folder
    const openDocsDisposable = vscode.commands.registerCommand('alex.openDocs', async () => {
        const docsPath = vscode.Uri.joinPath(context.extensionUri, 'alex_docs', 'README.md');
        try {
            await vscode.commands.executeCommand('markdown.showPreview', docsPath);
        } catch {
            // Fallback to opening as text if preview fails
            const doc = await vscode.workspace.openTextDocument(docsPath);
            await vscode.window.showTextDocument(doc);
        }
    });

    // Status bar command - show quick status
    const showStatusDisposable = vscode.commands.registerCommand('alex.showStatus', async () => {
        const items: vscode.QuickPickItem[] = [
            { label: '$(pulse) Run Dream Protocol', description: 'Neural maintenance and synapse validation', detail: 'Ctrl+Alt+D' },
            { label: '$(sparkle) Self-Actualize', description: 'Deep meditation and assessment', detail: 'Ctrl+Alt+S' },
            { label: '$(sync) Sync Knowledge', description: 'Sync global knowledge with GitHub', detail: 'Ctrl+Alt+K' },
            { label: '$(package) Export for M365', description: 'Package memory for M365 Copilot' },
            { label: '$(book) Open Documentation', description: 'View Alex documentation', detail: 'Ctrl+Alt+H' },
            { label: '$(arrow-up) Upgrade Architecture', description: 'Update workspace to latest version' },
            { label: '$(comment-discussion) Chat with @alex', description: 'Open Copilot Chat' }
        ];

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Alex Cognitive Architecture - Quick Actions',
            title: '🧠 Alex Status'
        });

        if (selected) {
            if (selected.label.includes('Dream')) {
                vscode.commands.executeCommand('alex.dream');
            } else if (selected.label.includes('Self-Actualize')) {
                vscode.commands.executeCommand('alex.selfActualize');
            } else if (selected.label.includes('Sync')) {
                vscode.commands.executeCommand('alex.syncKnowledge');
            } else if (selected.label.includes('Export for M365')) {
                vscode.commands.executeCommand('alex.exportForM365');
            } else if (selected.label.includes('Documentation')) {
                vscode.commands.executeCommand('alex.openDocs');
            } else if (selected.label.includes('Upgrade')) {
                vscode.commands.executeCommand('alex.upgrade');
            } else if (selected.label.includes('Chat')) {
                vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
            }
        }
    });

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'alex.showStatus';
    statusBarItem.tooltip = 'Alex Cognitive Architecture - Click for quick actions';
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
        })
    );
    
    // Watch for changes in Alex memory files and refresh status
    const memoryWatcher = vscode.workspace.createFileSystemWatcher(
        '**/.github/{copilot-instructions.md,instructions/*.md,prompts/*.md,domain-knowledge/*.md}'
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
}

/**
 * Update the status bar item based on workspace health
 */
async function updateStatusBar(context: vscode.ExtensionContext, forceRefresh: boolean = false): Promise<void> {
    try {
        const health = await checkHealth(forceRefresh);
        const display = getStatusBarDisplay(health);
        
        statusBarItem.text = display.text;
        statusBarItem.tooltip = display.tooltip;
        statusBarItem.backgroundColor = display.backgroundColor;
        statusBarItem.show();
    } catch (err) {
        // Fallback if health check fails
        statusBarItem.text = '$(brain) Alex';
        statusBarItem.tooltip = 'Alex Cognitive Architecture - Click for quick actions';
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
        dispose: () => clearInterval(intervalId)
    });
}

/**
 * Check if the extension was upgraded and notify the user
 */
async function checkVersionUpgrade(context: vscode.ExtensionContext): Promise<void> {
    const LAST_VERSION_KEY = 'alex.lastKnownVersion';
    
    // Get current version from package.json
    const extension = vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture');
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
    const [lastMajor] = lastVersion.split('.').map(Number);
    const [currentMajor] = currentVersion.split('.').map(Number);
    
    const isMajorUpgrade = currentMajor > lastMajor;
    
    // Show upgrade notification
    const upgradeButton = 'Run Upgrade';
    const changelogButton = 'View Changelog';
    const dismissButton = 'Dismiss';
    
    const message = isMajorUpgrade
        ? `🎉 Alex upgraded to v${currentVersion}! This is a major release with new features. Run the upgrade to update your workspace files.`
        : `✨ Alex updated to v${currentVersion}. Run the upgrade to sync your workspace with the latest improvements.`;
    
    const selection = await vscode.window.showInformationMessage(
        message,
        upgradeButton,
        changelogButton,
        dismissButton
    );
    
    if (selection === upgradeButton) {
        vscode.commands.executeCommand('alex.upgrade');
    } else if (selection === changelogButton) {
        // Open changelog in browser or show in editor
        const changelogUri = vscode.Uri.joinPath(extension.extensionUri, 'CHANGELOG.md');
        vscode.commands.executeCommand('markdown.showPreview', changelogUri);
    }
}

/**
 * Clean up resources when extension is deactivated
 * Note: Background sync timer cleanup is handled via context.subscriptions
 */
export function deactivate() {
    // Reset chat participant session state to prevent state bleeding
    resetSessionState();
    // Clean up session timer
    disposeSession();
    console.log('Alex Cognitive Architecture deactivated');
}
