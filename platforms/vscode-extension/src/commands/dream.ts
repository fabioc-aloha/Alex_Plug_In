import * as vscode from 'vscode';
import { getAlexWorkspaceFolder } from '../shared/utils';
import {
    DreamResult,
    runDreamCore,
    generateReportMarkdown,
    saveReport
} from '../shared/synapse-core';

// Re-export types for backwards compatibility
export { DreamResult } from '../shared/synapse-core';

/**
 * Options for running dream protocol
 */
export interface DreamOptions {
    /** If true, don't show result dialogs (for programmatic callers) */
    silent?: boolean;
}

export async function runDreamProtocol(context: vscode.ExtensionContext, options?: DreamOptions): Promise<DreamResult | undefined> {
    const silent = options?.silent ?? false;
    
    // Use smart workspace folder detection for multi-folder workspaces
    const workspaceResult = await getAlexWorkspaceFolder(true); // true = require Alex installed
    
    if (!workspaceResult.found) {
        if (workspaceResult.cancelled) {
            return undefined; // User cancelled folder selection
        }
        if (!silent) {
            vscode.window.showErrorMessage(
                workspaceResult.error || 'No workspace folder open. Please open a project with Alex installed (File → Open Folder), then run Dream Protocol.',
                { modal: true }
            );
        }
        return undefined;
    }

    const rootPath = workspaceResult.rootPath!;

    // Variables to capture result from within withProgress
    let dreamResult: DreamResult | undefined;
    let reportPath: string | undefined;

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Running Dream Protocol...",
        cancellable: false
    }, async (progress: vscode.Progress<{ message?: string; increment?: number }>) => {
        // Use the shared synapse-core module for platform-agnostic processing
        const { report } = await runDreamCore(rootPath, (message) => {
            progress.report({ message });
        });

        if (report.totalFiles === 0) {
            if (!silent) {
                const result = await vscode.window.showWarningMessage(
                    'No Alex memory files found in this workspace.\n\nWould you like to initialize Alex Cognitive Architecture now?',
                    'Initialize Alex',
                    'Cancel'
                );
                if (result === 'Initialize Alex') {
                    await vscode.commands.executeCommand('alex.initialize');
                }
            }
            dreamResult = { success: false, totalFiles: 0, totalSynapses: 0, brokenCount: 0, repairedCount: 0 };
            return;
        }

        // Save report
        reportPath = await saveReport(rootPath, report);

        // Set result for return
        dreamResult = {
            success: report.brokenSynapses.length === 0,
            totalFiles: report.totalFiles,
            totalSynapses: report.totalSynapses,
            brokenCount: report.brokenSynapses.length,
            repairedCount: report.repairedSynapses.length,
            reportPath: reportPath
        };
    });

    // 5. Show result (only if not silent)
    if (!silent && dreamResult && reportPath) {
        if (dreamResult.brokenCount > 0) {
            const result = await vscode.window.showWarningMessage(
                `⚠️ Dream Protocol found ${dreamResult.brokenCount} broken synapse${dreamResult.brokenCount > 1 ? 's' : ''}!\n\n` +
                `${dreamResult.repairedCount > 0 ? `✅ Auto-repaired: ${dreamResult.repairedCount}\n` : ''}` +
                `❌ Need manual repair: ${dreamResult.brokenCount}\n\n` +
                'Review the report for details on broken connections.',
                'View Report',
                'Close'
            );
            if (result === 'View Report') {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            }
        } else {
            const healthStatus = dreamResult.totalSynapses > 50 ? 'excellent' : dreamResult.totalSynapses > 20 ? 'good' : 'developing';
            const result = await vscode.window.showInformationMessage(
                `✅ Neural network is healthy!\n\n` +
                `📊 Statistics:\n` +
                `• ${dreamResult.totalFiles} memory files\n` +
                `• ${dreamResult.totalSynapses} active synapses\n` +
                `${dreamResult.repairedCount > 0 ? `• ${dreamResult.repairedCount} auto-repaired\n` : ''}` +
                `• Network health: ${healthStatus}`,
                'View Full Report',
                'Close'
            );
            if (result === 'View Full Report') {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            }
        }
    }

    return dreamResult;
}
