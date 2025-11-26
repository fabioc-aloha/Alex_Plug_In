import * as vscode from 'vscode';
import { initializeArchitecture, resetArchitecture } from './commands/initialize';
import { runDreamProtocol } from './commands/dream';

export function activate(context: vscode.ExtensionContext) {
    console.log('Alex Cognitive Architecture is now active!');

    let initDisposable = vscode.commands.registerCommand('alex.initialize', async () => {
        await initializeArchitecture(context);
    });

    let resetDisposable = vscode.commands.registerCommand('alex.reset', async () => {
        await resetArchitecture(context);
    });

    let dreamDisposable = vscode.commands.registerCommand('alex.dream', async () => {
        await runDreamProtocol(context);
    });

    context.subscriptions.push(initDisposable);
    context.subscriptions.push(resetDisposable);
    context.subscriptions.push(dreamDisposable);
}

export function deactivate() {}
