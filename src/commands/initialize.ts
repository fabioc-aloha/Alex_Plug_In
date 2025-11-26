import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function initializeArchitecture(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a workspace folder to initialize Alex.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');

    if (await fs.pathExists(markerFile)) {
        const result = await vscode.window.showWarningMessage(
            'Alex Cognitive Architecture is already initialized in this workspace.',
            'Reset Architecture',
            'Cancel'
        );

        if (result === 'Reset Architecture') {
            await resetArchitecture(context);
        }
        return;
    }

    await performInitialization(context, rootPath, false);
}

export async function resetArchitecture(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a workspace folder to reset Alex.');
        return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;

    const confirm = await vscode.window.showWarningMessage(
        'Are you sure you want to reset the Alex Cognitive Architecture? This will DELETE existing memory files and re-initialize them.',
        { modal: true },
        'Yes, Reset',
        'Cancel'
    );

    if (confirm !== 'Yes, Reset') {
        return;
    }

    // Delete existing folders
    const pathsToDelete = [
        path.join(rootPath, '.github', 'copilot-instructions.md'),
        path.join(rootPath, '.github', 'instructions'),
        path.join(rootPath, '.github', 'prompts'),
        path.join(rootPath, 'domain-knowledge')
    ];

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Resetting Alex Architecture...",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Cleaning up existing files..." });
            for (const p of pathsToDelete) {
                await fs.remove(p);
            }
        });
        
        await performInitialization(context, rootPath, true);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to reset Alex: ${error.message}`);
    }
}

async function performInitialization(context: vscode.ExtensionContext, rootPath: string, overwrite: boolean) {
    const extensionPath = context.extensionPath;

    // Define source and destination paths
    const sources = [
        { src: path.join(extensionPath, '.github', 'copilot-instructions.md'), dest: path.join(rootPath, '.github', 'copilot-instructions.md') },
        { src: path.join(extensionPath, '.github', 'instructions'), dest: path.join(rootPath, '.github', 'instructions') },
        { src: path.join(extensionPath, '.github', 'prompts'), dest: path.join(rootPath, '.github', 'prompts') },
        { src: path.join(extensionPath, 'domain-knowledge'), dest: path.join(rootPath, 'domain-knowledge') }
    ];

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Initializing Alex Cognitive Architecture...",
            cancellable: false
        }, async (progress) => {
            
            for (const item of sources) {
                progress.report({ message: `Copying ${path.basename(item.dest)}...` });
                if (await fs.pathExists(item.src)) {
                    await fs.copy(item.src, item.dest, { overwrite: overwrite });
                } else {
                    console.warn(`Source not found: ${item.src}`);
                }
            }
        });

        vscode.window.showInformationMessage('Alex Cognitive Architecture initialized successfully!');
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to initialize Alex: ${error.message}`);
    }
}
