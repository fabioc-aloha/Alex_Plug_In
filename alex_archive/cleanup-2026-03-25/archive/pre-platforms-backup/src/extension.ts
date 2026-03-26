import * as vscode from 'vscode';
import { initializeArchitecture, resetArchitecture } from './commands/initialize';
import { runDreamProtocol } from './commands/dream';
import { upgradeArchitecture } from './commands/upgrade';
import { runSelfActualization } from './commands/self-actualization';
import { registerChatParticipant, resetSessionState } from './chat/participant';
import { registerLanguageModelTools } from './chat/tools';
import { registerGlobalKnowledgeTools, ensureGlobalKnowledgeDirectories, registerCurrentProject } from './chat/globalKnowledge';
import { registerCloudSyncTools, syncWithCloud, pushToCloud, pullFromCloud, getCloudUrl, startBackgroundSync } from './chat/cloudSync';

// Operation lock to prevent concurrent modifications
let operationInProgress = false;

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
        await withOperationLock('Initialize', () => initializeArchitecture(context));
    });

    let resetDisposable = vscode.commands.registerCommand('alex.reset', async () => {
        await withOperationLock('Reset', () => resetArchitecture(context));
    });

    let dreamDisposable = vscode.commands.registerCommand('alex.dream', async () => {
        await withOperationLock('Dream Protocol', () => runDreamProtocol(context));
    });

    let upgradeDisposable = vscode.commands.registerCommand('alex.upgrade', async () => {
        await withOperationLock('Upgrade', () => upgradeArchitecture(context));
    });

    let selfActualizeDisposable = vscode.commands.registerCommand('alex.selfActualize', async () => {
        await withOperationLock('Self-Actualization', () => runSelfActualization(context));
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

    context.subscriptions.push(initDisposable);
    context.subscriptions.push(resetDisposable);
    context.subscriptions.push(dreamDisposable);
    context.subscriptions.push(upgradeDisposable);
    context.subscriptions.push(selfActualizeDisposable);
    context.subscriptions.push(syncDisposable);
    context.subscriptions.push(pushDisposable);
    context.subscriptions.push(pullDisposable);
    context.subscriptions.push(openDocsDisposable);
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
    console.log('Alex Cognitive Architecture deactivated');
}
