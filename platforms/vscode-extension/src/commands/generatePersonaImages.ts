/**
 * Generate Alex Persona Images Command
 * 
 * Runs image generation scripts using Replicate API with secure token handling.
 * Token is read from VS Code SecretStorage (never shown in terminal).
 */

import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';
import { getToken } from '../services/secretsManager';

type GenerationType = 'age-progression' | 'agent-images';

interface GenerationResult {
    success: boolean;
    imagesGenerated?: number;
    outputDir?: string;
    error?: string;
}

/**
 * Run a generation script with secure token handling
 */
async function runGenerationScript(
    scriptName: string,
    args: string[],
    progress: vscode.Progress<{ message?: string; increment?: number }>,
): Promise<GenerationResult> {
    // Get token from SecretStorage
    const token = getToken('REPLICATE_API_TOKEN');
    
    if (!token) {
        const action = await vscode.window.showErrorMessage(
            'Replicate API token not found. Please configure it first.',
            'Configure Token',
        );
        if (action === 'Configure Token') {
            await vscode.commands.executeCommand('alex.manageSecrets');
        }
        return { success: false, error: 'No API token configured' };
    }

    // Resolve script path
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
        return { success: false, error: 'No workspace folder open' };
    }

    const scriptPath = path.join(workspaceFolder, 'scripts', scriptName);

    return new Promise((resolve) => {
        progress.report({ message: `Starting ${scriptName}...` });

        // Spawn with token in environment (never echoed to terminal)
        const child = spawn('node', [scriptPath, ...args], {
            cwd: workspaceFolder,
            env: {
                ...process.env,
                REPLICATE_API_TOKEN: token, // Secure: only in child env
            },
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';
        let imagesGenerated = 0;

        child.stdout?.on('data', (data: Buffer) => {
            const text = data.toString();
            stdout += text;
            
            // Parse progress updates from script
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.includes('Generated:') || line.includes('✅')) {
                    imagesGenerated++;
                    progress.report({ message: line.trim() });
                } else if (line.includes('Generating') || line.includes('Processing')) {
                    progress.report({ message: line.trim() });
                }
            }
        });

        child.stderr?.on('data', (data: Buffer) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({
                    success: true,
                    imagesGenerated,
                });
            } else {
                resolve({
                    success: false,
                    error: stderr || `Script exited with code ${code}`,
                });
            }
        });

        child.on('error', (err) => {
            resolve({
                success: false,
                error: err.message,
            });
        });
    });
}

/**
 * Generate age progression images
 */
export async function generateAgeProgression(dryRun = false): Promise<void> {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: '🎨 Generating Alex Age Progression',
            cancellable: false,
        },
        async (progress) => {
            const args = dryRun ? ['--dry-run'] : [];
            const result = await runGenerationScript('generate-alex-age-progression.js', args, progress);
            
            if (result.success) {
                vscode.window.showInformationMessage(
                    `✅ Age progression complete! ${result.imagesGenerated || 'All'} images generated.`,
                    'Open Folder',
                ).then((action) => {
                    if (action === 'Open Folder') {
                        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                        if (workspaceFolder) {
                            const outputDir = path.join(workspaceFolder, 'alex_docs', 'alex3', 'age-progression');
                            vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(outputDir));
                        }
                    }
                });
            } else {
                vscode.window.showErrorMessage(`❌ Generation failed: ${result.error}`);
            }
        },
    );
}

/**
 * Generate agent mode images
 */
export async function generateAgentImages(dryRun = false): Promise<void> {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: '🎨 Generating Alex Agent Images',
            cancellable: false,
        },
        async (progress) => {
            const args = dryRun ? ['--dry-run'] : [];
            const result = await runGenerationScript('generate-alex-agent-images.js', args, progress);
            
            if (result.success) {
                vscode.window.showInformationMessage(
                    `✅ Agent images complete! ${result.imagesGenerated || 'All'} images generated.`,
                    'Open Folder',
                ).then((action) => {
                    if (action === 'Open Folder') {
                        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                        if (workspaceFolder) {
                            const outputDir = path.join(workspaceFolder, 'alex_docs', 'alex3');
                            vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(outputDir));
                        }
                    }
                });
            } else {
                vscode.window.showErrorMessage(`❌ Generation failed: ${result.error}`);
            }
        },
    );
}

/**
 * Show generation type picker and run selected generation
 */
export async function showGenerationPicker(): Promise<void> {
    const items: vscode.QuickPickItem[] = [
        {
            label: '$(person) Age Progression',
            description: 'Generate 9 age variants from reference image',
            detail: 'Ages: 7, 13, 15, 18, 21, 25, 30, 42, 55 — Uses google/nano-banana-pro',
        },
        {
            label: '$(symbol-color) Agent Mode Images',
            description: 'Generate 7 agent mode banners + 8 cognitive states',
            detail: 'Builder, Researcher, Validator, etc. — Uses ideogram-v2 + flux-1.1-pro',
        },
        {
            label: '$(beaker) Dry Run (Preview)',
            description: 'Test without calling Replicate API',
            detail: 'Shows what would be generated without spending credits',
        },
    ];

    const selection = await vscode.window.showQuickPick(items, {
        title: '🎨 Alex Persona Image Generator',
        placeHolder: 'Select what to generate...',
    });

    if (!selection) {
        return;
    }

    const label = selection.label;
    
    if (label.includes('Age Progression')) {
        await generateAgeProgression(false);
    } else if (label.includes('Agent Mode')) {
        await generateAgentImages(false);
    } else if (label.includes('Dry Run')) {
        // Show sub-picker for dry run target
        const dryRunTarget = await vscode.window.showQuickPick([
            { label: 'Age Progression (Dry Run)', value: 'age' },
            { label: 'Agent Images (Dry Run)', value: 'agent' },
        ], {
            placeHolder: 'Which generation to preview?',
        });
        
        if (dryRunTarget?.label.includes('Age')) {
            await generateAgeProgression(true);
        } else if (dryRunTarget?.label.includes('Agent')) {
            await generateAgentImages(true);
        }
    }
}
