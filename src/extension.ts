import * as vscode from 'vscode';
import { initializeArchitecture, resetArchitecture } from './commands/initialize';
import { runDreamProtocol } from './commands/dream';
import { upgradeArchitecture } from './commands/upgrade';
import { runSelfActualization } from './commands/self-actualization';
import { registerChatParticipant } from './chat/participant';
import { registerLanguageModelTools } from './chat/tools';

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

    // Register chat participant for @alex conversations
    registerChatParticipant(context);
    
    // Register language model tools for AI-powered operations
    registerLanguageModelTools(context);

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

    context.subscriptions.push(initDisposable);
    context.subscriptions.push(resetDisposable);
    context.subscriptions.push(dreamDisposable);
    context.subscriptions.push(upgradeDisposable);
    context.subscriptions.push(selfActualizeDisposable);
}

export function deactivate() {}
