import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

interface UpgradeReport {
    updated: string[];
    added: string[];
    preserved: string[];
    backed_up: string[];
    errors: string[];
}

/**
 * Extracts the version from copilot-instructions.md
 */
async function getInstalledVersion(rootPath: string): Promise<string | null> {
    const instructionsPath = path.join(rootPath, '.github', 'copilot-instructions.md');
    
    if (!await fs.pathExists(instructionsPath)) {
        return null;
    }

    try {
        const content = await fs.readFile(instructionsPath, 'utf8');
        // Match pattern: **Version**: X.Y.Z
        const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/);
        return versionMatch ? versionMatch[1] : null;
    } catch {
        return null;
    }
}

/**
 * Gets the extension's bundled version
 */
async function getExtensionVersion(extensionPath: string): Promise<string> {
    const packageJson = await fs.readJson(path.join(extensionPath, 'package.json'));
    return packageJson.version;
}

/**
 * Creates a backup of a file before upgrading
 */
async function backupFile(filePath: string, backupDir: string): Promise<string | null> {
    if (!await fs.pathExists(filePath)) {
        return null;
    }

    const relativePath = path.basename(filePath);
    const backupPath = path.join(backupDir, relativePath);
    await fs.copy(filePath, backupPath);
    return backupPath;
}

/**
 * Checks if a file has been customized by the user
 * by comparing with the extension's original version
 */
async function isCustomized(localPath: string, extensionPath: string): Promise<boolean> {
    if (!await fs.pathExists(localPath) || !await fs.pathExists(extensionPath)) {
        return false;
    }

    try {
        const localContent = await fs.readFile(localPath, 'utf8');
        const extensionContent = await fs.readFile(extensionPath, 'utf8');
        
        // Normalize line endings and compare
        const normalizedLocal = localContent.replace(/\r\n/g, '\n').trim();
        const normalizedExtension = extensionContent.replace(/\r\n/g, '\n').trim();
        
        return normalizedLocal !== normalizedExtension;
    } catch {
        return false;
    }
}

/**
 * Upgrades the cognitive architecture safely
 */
export async function upgradeArchitecture(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a workspace folder to upgrade Alex.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const extensionPath = context.extensionPath;
    const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');

    // Check if Alex is installed
    if (!await fs.pathExists(markerFile)) {
        const result = await vscode.window.showWarningMessage(
            'Alex Cognitive Architecture is not installed in this workspace.',
            'Initialize Now',
            'Cancel'
        );

        if (result === 'Initialize Now') {
            await vscode.commands.executeCommand('alex.initialize');
        }
        return;
    }

    // Get versions
    const installedVersion = await getInstalledVersion(rootPath);
    const extensionVersion = await getExtensionVersion(extensionPath);

    if (installedVersion === extensionVersion) {
        vscode.window.showInformationMessage(
            `Alex Cognitive Architecture is already at version ${extensionVersion}. No upgrade needed.`
        );
        return;
    }

    // Confirm upgrade
    const confirm = await vscode.window.showInformationMessage(
        `Upgrade Alex from v${installedVersion || 'unknown'} to v${extensionVersion}?\n\nYour customizations in domain-knowledge will be preserved.`,
        { modal: true },
        'Upgrade',
        'Cancel'
    );

    if (confirm !== 'Upgrade') {
        return;
    }

    await performUpgrade(context, rootPath, extensionPath, installedVersion, extensionVersion);
}

async function performUpgrade(
    context: vscode.ExtensionContext,
    rootPath: string,
    extensionPath: string,
    oldVersion: string | null,
    newVersion: string
) {
    const report: UpgradeReport = {
        updated: [],
        added: [],
        preserved: [],
        backed_up: [],
        errors: []
    };

    // Create backup directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.join(rootPath, 'archive', 'upgrades', `backup-${oldVersion || 'unknown'}-${timestamp}`);

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Upgrading Alex Cognitive Architecture...",
            cancellable: false
        }, async (progress) => {

            // Step 1: Backup copilot-instructions.md
            progress.report({ message: "Creating backups...", increment: 10 });
            await fs.ensureDir(backupDir);
            
            const mainInstructions = path.join(rootPath, '.github', 'copilot-instructions.md');
            const backupPath = await backupFile(mainInstructions, backupDir);
            if (backupPath) {
                report.backed_up.push('copilot-instructions.md');
            }

            // Step 2: Upgrade core file (copilot-instructions.md) - always update
            progress.report({ message: "Upgrading core framework...", increment: 20 });
            const srcMainInstructions = path.join(extensionPath, '.github', 'copilot-instructions.md');
            await fs.copy(srcMainInstructions, mainInstructions, { overwrite: true });
            report.updated.push('copilot-instructions.md');

            // Step 3: Upgrade .github/instructions/ - update all (these are system files)
            progress.report({ message: "Upgrading instruction files...", increment: 20 });
            const instructionsSrc = path.join(extensionPath, '.github', 'instructions');
            const instructionsDest = path.join(rootPath, '.github', 'instructions');
            
            if (await fs.pathExists(instructionsSrc)) {
                // Backup existing instructions folder
                if (await fs.pathExists(instructionsDest)) {
                    await fs.copy(instructionsDest, path.join(backupDir, 'instructions'));
                    report.backed_up.push('.github/instructions/');
                }
                
                const files = await fs.readdir(instructionsSrc);
                for (const file of files) {
                    const srcFile = path.join(instructionsSrc, file);
                    const destFile = path.join(instructionsDest, file);
                    
                    if ((await fs.stat(srcFile)).isFile()) {
                        const existed = await fs.pathExists(destFile);
                        await fs.copy(srcFile, destFile, { overwrite: true });
                        
                        if (existed) {
                            report.updated.push(`.github/instructions/${file}`);
                        } else {
                            report.added.push(`.github/instructions/${file}`);
                        }
                    }
                }
            }

            // Step 4: Upgrade .github/prompts/ - update all (these are system files)
            progress.report({ message: "Upgrading prompt files...", increment: 20 });
            const promptsSrc = path.join(extensionPath, '.github', 'prompts');
            const promptsDest = path.join(rootPath, '.github', 'prompts');
            
            if (await fs.pathExists(promptsSrc)) {
                // Backup existing prompts folder
                if (await fs.pathExists(promptsDest)) {
                    await fs.copy(promptsDest, path.join(backupDir, 'prompts'));
                    report.backed_up.push('.github/prompts/');
                }
                
                const files = await fs.readdir(promptsSrc);
                for (const file of files) {
                    const srcFile = path.join(promptsSrc, file);
                    const destFile = path.join(promptsDest, file);
                    
                    if ((await fs.stat(srcFile)).isFile()) {
                        const existed = await fs.pathExists(destFile);
                        await fs.copy(srcFile, destFile, { overwrite: true });
                        
                        if (existed) {
                            report.updated.push(`.github/prompts/${file}`);
                        } else {
                            report.added.push(`.github/prompts/${file}`);
                        }
                    }
                }
            }

            // Step 5: Upgrade domain-knowledge/ - PRESERVE user customizations, add new files only
            progress.report({ message: "Upgrading domain knowledge (preserving customizations)...", increment: 20 });
            const dkSrc = path.join(extensionPath, 'domain-knowledge');
            const dkDest = path.join(rootPath, 'domain-knowledge');
            
            if (await fs.pathExists(dkSrc)) {
                await fs.ensureDir(dkDest);
                
                const files = await fs.readdir(dkSrc);
                for (const file of files) {
                    const srcFile = path.join(dkSrc, file);
                    const destFile = path.join(dkDest, file);
                    
                    if ((await fs.stat(srcFile)).isFile()) {
                        if (!await fs.pathExists(destFile)) {
                            // New file - add it
                            await fs.copy(srcFile, destFile);
                            report.added.push(`domain-knowledge/${file}`);
                        } else {
                            // Existing file - check if customized
                            const customized = await isCustomized(destFile, srcFile);
                            if (customized) {
                                // Preserve user's version, but add new version with .new suffix for reference
                                const newVersionPath = destFile.replace(/\.md$/, '.new.md');
                                await fs.copy(srcFile, newVersionPath);
                                report.preserved.push(`domain-knowledge/${file} (new version saved as ${path.basename(newVersionPath)})`);
                            } else {
                                // Not customized - safe to update
                                await fs.copy(srcFile, destFile, { overwrite: true });
                                report.updated.push(`domain-knowledge/${file}`);
                            }
                        }
                    }
                }
            }

            // Step 6: Ensure archive directory exists
            progress.report({ message: "Finalizing...", increment: 10 });
            await fs.ensureDir(path.join(rootPath, 'archive'));
        });

        // Generate and show report
        await generateUpgradeReport(rootPath, oldVersion, newVersion, report, backupDir);

        vscode.window.showInformationMessage(
            `Alex upgraded to v${newVersion}! ${report.updated.length} files updated, ${report.added.length} added, ${report.preserved.length} preserved.`,
            'View Report'
        ).then(selection => {
            if (selection === 'View Report') {
                const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
                vscode.workspace.openTextDocument(reportPath).then(doc => {
                    vscode.window.showTextDocument(doc);
                });
            }
        });

    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to upgrade Alex: ${error.message}`);
        report.errors.push(error.message);
    }
}

async function generateUpgradeReport(
    rootPath: string,
    oldVersion: string | null,
    newVersion: string,
    report: UpgradeReport,
    backupDir: string
) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
    
    await fs.ensureDir(path.dirname(reportPath));

    const content = `# Alex Cognitive Architecture Upgrade Report

**Date**: ${new Date().toISOString()}
**From Version**: ${oldVersion || 'unknown'}
**To Version**: ${newVersion}

## Summary

| Category | Count |
|----------|-------|
| Updated | ${report.updated.length} |
| Added | ${report.added.length} |
| Preserved | ${report.preserved.length} |
| Backed Up | ${report.backed_up.length} |
| Errors | ${report.errors.length} |

## Backup Location

\`${backupDir}\`

## Updated Files

${report.updated.length > 0 ? report.updated.map(f => `- ${f}`).join('\n') : '- None'}

## Added Files

${report.added.length > 0 ? report.added.map(f => `- ${f}`).join('\n') : '- None'}

## Preserved (User Customizations)

${report.preserved.length > 0 ? report.preserved.map(f => `- ${f}`).join('\n') : '- None'}

## Backed Up

${report.backed_up.length > 0 ? report.backed_up.map(f => `- ${f}`).join('\n') : '- None'}

${report.errors.length > 0 ? `## Errors\n\n${report.errors.map(e => `- ${e}`).join('\n')}` : ''}

---

*Upgrade completed successfully. Run \`Alex: Dream (Neural Maintenance)\` to validate synaptic connections.*
`;

    await fs.writeFile(reportPath, content, 'utf8');
}
