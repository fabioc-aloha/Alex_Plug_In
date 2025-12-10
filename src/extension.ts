import * as vscode from 'vscode';
import { initializeArchitecture, resetArchitecture } from './commands/initialize';
import { runDreamProtocol } from './commands/dream';
import { upgradeArchitecture } from './commands/upgrade';

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

    let upgradeDisposable = vscode.commands.registerCommand('alex.upgrade', async () => {
        await upgradeArchitecture(context);
    });

    context.subscriptions.push(initDisposable);
    context.subscriptions.push(resetDisposable);
    context.subscriptions.push(dreamDisposable);
    context.subscriptions.push(upgradeDisposable);
}

export function deactivate() {}
