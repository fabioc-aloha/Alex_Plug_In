import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function initializeArchitecture(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage(
            'No workspace folder open. Please open a project folder first (File → Open Folder), then run this command again.'
        );
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');

    if (await fs.pathExists(markerFile)) {
        const result = await vscode.window.showWarningMessage(
            'Alex is already installed in this workspace.\n\n• To update to a new version, use "Alex: Upgrade"\n• To completely reinstall, choose Reset below',
            'Upgrade Instead',
            'Reset Architecture',
            'Cancel'
        );

        if (result === 'Upgrade Instead') {
            await vscode.commands.executeCommand('alex.upgrade');
        } else if (result === 'Reset Architecture') {
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
        '⚠️ RESET will permanently delete all Alex memory files!\n\nThis includes:\n• All learned domain knowledge\n• Custom instructions and prompts\n• Synaptic network connections\n\nConsider using "Alex: Upgrade" instead to preserve your knowledge.',
        { modal: true },
        'Yes, Delete Everything',
        'Upgrade Instead',
        'Cancel'
    );

    if (confirm === 'Upgrade Instead') {
        await vscode.commands.executeCommand('alex.upgrade');
        return;
    }
    if (confirm !== 'Yes, Delete Everything') {
        return;
    }

    // Delete existing folders
    const pathsToDelete = [
        path.join(rootPath, '.github', 'copilot-instructions.md'),
        path.join(rootPath, '.github', 'instructions'),
        path.join(rootPath, '.github', 'prompts'),
        path.join(rootPath, 'domain-knowledge'),
        path.join(rootPath, '.alex-manifest.json')  // Clean up manifest too
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

    // Validate extension has required files
    const requiredSource = path.join(extensionPath, '.github', 'copilot-instructions.md');
    if (!await fs.pathExists(requiredSource)) {
        vscode.window.showErrorMessage(
            'Extension installation appears corrupted - missing core files.\n\n' +
            'Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.'
        );
        return;
    }

    // Define source and destination paths
    const sources = [
        { src: path.join(extensionPath, '.github', 'copilot-instructions.md'), dest: path.join(rootPath, '.github', 'copilot-instructions.md') },
        { src: path.join(extensionPath, '.github', 'instructions'), dest: path.join(rootPath, '.github', 'instructions') },
        { src: path.join(extensionPath, '.github', 'prompts'), dest: path.join(rootPath, '.github', 'prompts') },
        { src: path.join(extensionPath, '.github', 'agents'), dest: path.join(rootPath, '.github', 'agents') },
        { src: path.join(extensionPath, 'domain-knowledge'), dest: path.join(rootPath, 'domain-knowledge') }
    ];

    try {
        // Test write permissions first
        const testDir = path.join(rootPath, '.github');
        await fs.ensureDir(testDir);
        const testFile = path.join(testDir, '.write-test');
        try {
            await fs.writeFile(testFile, 'test');
            await fs.remove(testFile);
        } catch (permError: any) {
            throw new Error(`Cannot write to workspace - check folder permissions: ${permError.message}`);
        }

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

        const result = await vscode.window.showInformationMessage(
            '✅ Alex Cognitive Architecture initialized!\n\nNext steps:\n1. Open any file and start chatting with your AI assistant\n2. Run "Alex: Dream" periodically to maintain neural health\n3. Ask Alex to learn new domains as needed',
            'Open Main Brain File',
            'Run Dream Protocol',
            'Close'
        );
        
        if (result === 'Open Main Brain File') {
            const brainFile = path.join(rootPath, '.github', 'copilot-instructions.md');
            const doc = await vscode.workspace.openTextDocument(brainFile);
            await vscode.window.showTextDocument(doc);
        } else if (result === 'Run Dream Protocol') {
            await vscode.commands.executeCommand('alex.dream');
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to initialize Alex: ${error.message}\n\nTry closing VS Code, deleting the .github folder, and running initialize again.`);
    }
}
