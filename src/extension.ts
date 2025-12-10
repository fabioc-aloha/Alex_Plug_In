import * as vscode from 'vscode';
import { initializeArchitecture, resetArchitecture } from './commands/initialize';
import { runDreamProtocol } from './commands/dream';
import { upgradeArchitecture } from './commands/upgrade';

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

    context.subscriptions.push(initDisposable);
    context.subscriptions.push(resetDisposable);
    context.subscriptions.push(dreamDisposable);
    context.subscriptions.push(upgradeDisposable);
}

export function deactivate() {}
