/**
 * extensionLifecycle.ts - Extension lifecycle utilities extracted from extension.ts
 *
 * Contains version upgrade detection, status bar management, periodic health checks,
 * and command context key management. Extracted for P5B file-size compliance.
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import {
    checkHealth,
    getStatusBarDisplay,
} from '../shared/healthCheck';
import { getCurrentSession } from '../commands/session';
import { getGoalsSummary } from '../commands/goals';
import { isWorkspaceProtected } from '../shared/utils';
import { detectGlobalKnowledgeRepo } from '../chat/globalKnowledge';

/**
 * Set VS Code context keys for when-clause filtering on slash commands.
 * These keys control visibility of commands like /sync, /m365, /forget.
 * Called at activation and after initialize/reset.
 */
export async function setCommandContextKeys(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    // alex.globalKnowledgeConfigured — true if GK repo detected
    const gkRepo = await detectGlobalKnowledgeRepo();
    await vscode.commands.executeCommand(
        'setContext',
        'alex.globalKnowledgeConfigured',
        gkRepo !== null,
    );

    // alex.hasMemoryFiles — true if .github/copilot-instructions.md exists
    let hasMemory = false;
    if (workspaceFolder) {
        const markerFile = path.join(
            workspaceFolder.uri.fsPath,
            '.github',
            'copilot-instructions.md',
        );
        hasMemory = await fs.pathExists(markerFile);
    }
    await vscode.commands.executeCommand(
        'setContext',
        'alex.hasMemoryFiles',
        hasMemory,
    );
}

/**
 * Update the status bar item based on workspace health
 */
export async function updateStatusBar(
    statusBarItem: vscode.StatusBarItem,
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
        statusBarItem.text = '$(rocket) Alex';
        statusBarItem.tooltip =
            'Alex Cognitive Architecture - Click for quick actions';
        statusBarItem.backgroundColor = undefined;
        statusBarItem.show();
    }
}

/**
 * Start periodic health checks (every 5 minutes)
 */
export function startPeriodicHealthCheck(
    context: vscode.ExtensionContext,
    statusBarItem: vscode.StatusBarItem,
): void {
    const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const intervalId = setInterval(async () => {
        await updateStatusBar(statusBarItem, true);
    }, HEALTH_CHECK_INTERVAL);

    // Clean up interval on deactivation
    context.subscriptions.push({
        dispose: () => clearInterval(intervalId),
    });
}

/**
 * Check if the extension was upgraded and notify the user
 */
export async function checkVersionUpgrade(
    context: vscode.ExtensionContext,
): Promise<void> {
    const LAST_VERSION_KEY = 'alex.lastKnownVersion';

    // Get current version from package.json
    const extension = vscode.extensions.getExtension(
        'fabioc-aloha.alex-cognitive-architecture',
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
        dismissButton,
    );

    if (selection === upgradeButton) {
        vscode.commands.executeCommand('alex.upgrade');
    } else if (selection === changelogButton) {
        // Open changelog in browser or show in editor
        const changelogUri = vscode.Uri.joinPath(
            extension.extensionUri,
            'CHANGELOG.md',
        );
        vscode.commands.executeCommand('markdown.showPreview', changelogUri);
    }
}
