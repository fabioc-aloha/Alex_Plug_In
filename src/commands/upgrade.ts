import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';

interface FileManifestEntry {
    type: 'system' | 'hybrid' | 'user-created';
    originalChecksum: string;
    currentChecksum?: string;
    modified?: boolean;
    createdAt?: string;
}

interface Manifest {
    version: string;
    installedAt: string;
    upgradedAt?: string;
    files: Record<string, FileManifestEntry>;
}

interface MigrationTask {
    file: string;
    type: 'schema-migration' | 'merge-required' | 'review-recommended';
    description: string;
    details: string[];
}

interface UpgradeReport {
    updated: string[];
    added: string[];
    preserved: string[];
    backed_up: string[];
    migrationTasks: MigrationTask[];
    errors: string[];
}

/**
 * Calculate MD5 checksum of file content
 */
function calculateChecksum(content: string): string {
    return crypto.createHash('md5').update(content.replace(/\r\n/g, '\n')).digest('hex');
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
 * Load or create manifest
 */
async function loadManifest(rootPath: string): Promise<Manifest | null> {
    const manifestPath = path.join(rootPath, '.alex-manifest.json');
    if (await fs.pathExists(manifestPath)) {
        return await fs.readJson(manifestPath);
    }
    return null;
}

/**
 * Save manifest
 */
async function saveManifest(rootPath: string, manifest: Manifest): Promise<void> {
    const manifestPath = path.join(rootPath, '.alex-manifest.json');
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

/**
 * Scan file for old synapse patterns that need migration
 */
async function scanForMigrationNeeds(filePath: string): Promise<string[]> {
    const issues: string[] = [];
    
    if (!await fs.pathExists(filePath)) {
        return issues;
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check for old headers
        if (/## Embedded Synapse Network/i.test(content)) {
            issues.push('Old header: "## Embedded Synapse Network" → should be "## Synapses"');
        }
        if (/### \*\*Connection Mapping\*\*/i.test(content)) {
            issues.push('Old subheader: "### **Connection Mapping**" → should be "### Connection Mapping"');
        }
        if (/### \*\*Activation Patterns/i.test(content)) {
            issues.push('Old subheader: "### **Activation Patterns" → should be "### Activation Patterns"');
        }
        
        // Check for old relationship types
        const oldTypes = ['Expression', 'Embodiment', 'Living', 'Reflexive', 'Ethical', 'Unconscious', 'Application', 'Validation'];
        for (const type of oldTypes) {
            const regex = new RegExp(`\\(\\s*(Critical|High|Medium|Low)\\s*,\\s*${type}\\s*,`, 'i');
            if (regex.test(content)) {
                issues.push(`Old relationship type: "${type}" → needs migration to standard type`);
            }
        }
        
        // Check for verbose activation patterns with dates
        if (/✅\s*(NEW|CRITICAL|ENHANCED).*20[0-9]{2}/.test(content)) {
            issues.push('Verbose activation patterns with date stamps → should be simplified');
        }
        
        // Check for bold activation triggers
        if (/\*\*[A-Z][^*]+\*\*\s*→/.test(content)) {
            issues.push('Bold activation triggers → should be plain text');
        }
        
    } catch (error) {
        issues.push(`Error scanning file: ${error}`);
    }
    
    return issues;
}

/**
 * Scan for user-created files not in manifest
 */
async function findUserCreatedFiles(rootPath: string, manifest: Manifest | null): Promise<string[]> {
    const userFiles: string[] = [];
    const dkPath = path.join(rootPath, 'domain-knowledge');
    
    if (await fs.pathExists(dkPath)) {
        const files = await fs.readdir(dkPath);
        for (const file of files) {
            if (file.endsWith('.md')) {
                const relativePath = `domain-knowledge/${file}`;
                if (!manifest?.files[relativePath]) {
                    userFiles.push(relativePath);
                }
            }
        }
    }
    
    return userFiles;
}

/**
 * Main upgrade function
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
        `Upgrade Alex from v${installedVersion || 'unknown'} to v${extensionVersion}?\n\nThis is a hybrid upgrade process:\n1. Phase 1 (automated): Backup & system files\n2. Phase 2 (AI-assisted): Schema migration\n\nYour learned knowledge will be preserved.`,
        { modal: true },
        'Start Upgrade',
        'Cancel'
    );

    if (confirm !== 'Start Upgrade') {
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
        migrationTasks: [],
        errors: []
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.join(rootPath, 'archive', 'upgrades', `backup-${oldVersion || 'unknown'}-${timestamp}`);

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Phase 1: Preparing Upgrade...",
            cancellable: false
        }, async (progress) => {

            // Step 1: Create full backup
            progress.report({ message: "Creating complete backup...", increment: 15 });
            await fs.ensureDir(backupDir);
            
            // Backup .github folder
            const githubSrc = path.join(rootPath, '.github');
            if (await fs.pathExists(githubSrc)) {
                await fs.copy(githubSrc, path.join(backupDir, '.github'));
                report.backed_up.push('.github/');
            }
            
            // Backup domain-knowledge folder
            const dkSrc = path.join(rootPath, 'domain-knowledge');
            if (await fs.pathExists(dkSrc)) {
                await fs.copy(dkSrc, path.join(backupDir, 'domain-knowledge'));
                report.backed_up.push('domain-knowledge/');
            }

            // Step 2: Load or create manifest
            progress.report({ message: "Analyzing installed files...", increment: 10 });
            let manifest = await loadManifest(rootPath);
            
            if (!manifest) {
                manifest = {
                    version: oldVersion || 'unknown',
                    installedAt: new Date().toISOString(),
                    files: {}
                };
            }

            // Step 3: Scan for migration needs in ALL markdown files
            progress.report({ message: "Scanning for schema migration needs...", increment: 15 });
            
            const filesToScan: string[] = [];
            
            // Add copilot-instructions.md
            const mainInstructions = path.join(rootPath, '.github', 'copilot-instructions.md');
            if (await fs.pathExists(mainInstructions)) {
                filesToScan.push(mainInstructions);
            }
            
            // Add domain-knowledge files
            const dkPath = path.join(rootPath, 'domain-knowledge');
            if (await fs.pathExists(dkPath)) {
                const dkFiles = await fs.readdir(dkPath);
                for (const file of dkFiles) {
                    if (file.endsWith('.md')) {
                        filesToScan.push(path.join(dkPath, file));
                    }
                }
            }
            
            for (const filePath of filesToScan) {
                const issues = await scanForMigrationNeeds(filePath);
                if (issues.length > 0) {
                    const relativePath = path.relative(rootPath, filePath);
                    report.migrationTasks.push({
                        file: relativePath,
                        type: 'schema-migration',
                        description: `Synapse schema migration needed`,
                        details: issues
                    });
                }
            }

            // Step 4: Find user-created files
            progress.report({ message: "Identifying user-created files...", increment: 10 });
            const userFiles = await findUserCreatedFiles(rootPath, manifest);
            for (const file of userFiles) {
                report.preserved.push(`${file} (user-created)`);
                
                // Scan user files for migration too
                const fullPath = path.join(rootPath, file);
                const issues = await scanForMigrationNeeds(fullPath);
                if (issues.length > 0) {
                    report.migrationTasks.push({
                        file: file,
                        type: 'schema-migration',
                        description: 'User-created file needs schema migration',
                        details: issues
                    });
                }
            }

            // Step 5: Add copilot-instructions.md merge task
            progress.report({ message: "Preparing merge tasks...", increment: 10 });
            report.migrationTasks.push({
                file: '.github/copilot-instructions.md',
                type: 'merge-required',
                description: 'Core brain file requires intelligent merge',
                details: [
                    'UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands',
                    'PRESERVE: Domain slot assignments (P5-P7), user-added memory file references',
                    'REVIEW: Any custom sections added by user'
                ]
            });

            // Step 6: Update system files (instructions and prompts)
            progress.report({ message: "Updating system files...", increment: 20 });
            
            // Update instructions
            const instructionsSrc = path.join(extensionPath, '.github', 'instructions');
            const instructionsDest = path.join(rootPath, '.github', 'instructions');
            if (await fs.pathExists(instructionsSrc)) {
                const files = await fs.readdir(instructionsSrc);
                for (const file of files) {
                    const srcFile = path.join(instructionsSrc, file);
                    const destFile = path.join(instructionsDest, file);
                    if ((await fs.stat(srcFile)).isFile()) {
                        const existed = await fs.pathExists(destFile);
                        await fs.copy(srcFile, destFile, { overwrite: true });
                        
                        const content = await fs.readFile(srcFile, 'utf8');
                        manifest.files[`.github/instructions/${file}`] = {
                            type: 'system',
                            originalChecksum: calculateChecksum(content)
                        };
                        
                        if (existed) {
                            report.updated.push(`.github/instructions/${file}`);
                        } else {
                            report.added.push(`.github/instructions/${file}`);
                        }
                    }
                }
            }
            
            // Update prompts
            const promptsSrc = path.join(extensionPath, '.github', 'prompts');
            const promptsDest = path.join(rootPath, '.github', 'prompts');
            if (await fs.pathExists(promptsSrc)) {
                const files = await fs.readdir(promptsSrc);
                for (const file of files) {
                    const srcFile = path.join(promptsSrc, file);
                    const destFile = path.join(promptsDest, file);
                    if ((await fs.stat(srcFile)).isFile()) {
                        const existed = await fs.pathExists(destFile);
                        await fs.copy(srcFile, destFile, { overwrite: true });
                        
                        const content = await fs.readFile(srcFile, 'utf8');
                        manifest.files[`.github/prompts/${file}`] = {
                            type: 'system',
                            originalChecksum: calculateChecksum(content)
                        };
                        
                        if (existed) {
                            report.updated.push(`.github/prompts/${file}`);
                        } else {
                            report.added.push(`.github/prompts/${file}`);
                        }
                    }
                }
            }

            // Step 7: Handle domain-knowledge files carefully
            progress.report({ message: "Processing domain knowledge...", increment: 10 });
            const extDkSrc = path.join(extensionPath, 'domain-knowledge');
            const extDkDest = path.join(rootPath, 'domain-knowledge');
            
            if (await fs.pathExists(extDkSrc)) {
                await fs.ensureDir(extDkDest);
                const files = await fs.readdir(extDkSrc);
                
                for (const file of files) {
                    const srcFile = path.join(extDkSrc, file);
                    const destFile = path.join(extDkDest, file);
                    
                    if ((await fs.stat(srcFile)).isFile()) {
                        const srcContent = await fs.readFile(srcFile, 'utf8');
                        const srcChecksum = calculateChecksum(srcContent);
                        
                        if (!await fs.pathExists(destFile)) {
                            // New file - add it
                            await fs.copy(srcFile, destFile);
                            manifest.files[`domain-knowledge/${file}`] = {
                                type: 'system',
                                originalChecksum: srcChecksum
                            };
                            report.added.push(`domain-knowledge/${file}`);
                        } else {
                            // Existing file - check if modified
                            const destContent = await fs.readFile(destFile, 'utf8');
                            const destChecksum = calculateChecksum(destContent);
                            const originalChecksum = manifest.files[`domain-knowledge/${file}`]?.originalChecksum;
                            
                            if (originalChecksum && destChecksum !== originalChecksum) {
                                // User modified - preserve and provide new version
                                const newVersionPath = destFile.replace(/\.md$/, `.v${newVersion}.md`);
                                await fs.copy(srcFile, newVersionPath);
                                report.preserved.push(`domain-knowledge/${file} (modified by user, new version: ${path.basename(newVersionPath)})`);
                                
                                // Add review task
                                report.migrationTasks.push({
                                    file: `domain-knowledge/${file}`,
                                    type: 'review-recommended',
                                    description: 'User-modified system file - review new version',
                                    details: [
                                        `Your version preserved: ${file}`,
                                        `New version available: ${path.basename(newVersionPath)}`,
                                        'Review and merge changes as needed'
                                    ]
                                });
                            } else {
                                // Not modified - safe to update
                                await fs.copy(srcFile, destFile, { overwrite: true });
                                manifest.files[`domain-knowledge/${file}`] = {
                                    type: 'system',
                                    originalChecksum: srcChecksum
                                };
                                report.updated.push(`domain-knowledge/${file}`);
                            }
                        }
                    }
                }
            }

            // Step 8: Update manifest
            progress.report({ message: "Saving manifest...", increment: 5 });
            manifest.version = newVersion;
            manifest.upgradedAt = new Date().toISOString();
            await saveManifest(rootPath, manifest);

            // Step 9: Generate upgrade tasks and instructions
            progress.report({ message: "Generating upgrade instructions...", increment: 5 });
            await generateUpgradeInstructions(rootPath, oldVersion, newVersion, report, backupDir, timestamp);
        });

        // Show completion message with instructions
        const result = await vscode.window.showWarningMessage(
            `Phase 1 Complete! ${report.migrationTasks.length} tasks require AI assistance.\n\nPlease read UPGRADE-INSTRUCTIONS.md and ask your AI assistant to complete the upgrade.`,
            'Open Instructions',
            'View Full Report'
        );

        if (result === 'Open Instructions') {
            const instructionsPath = path.join(rootPath, 'UPGRADE-INSTRUCTIONS.md');
            const doc = await vscode.workspace.openTextDocument(instructionsPath);
            await vscode.window.showTextDocument(doc);
        } else if (result === 'View Full Report') {
            const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
            const doc = await vscode.workspace.openTextDocument(reportPath);
            await vscode.window.showTextDocument(doc);
        }

    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to upgrade Alex: ${error.message}`);
        report.errors.push(error.message);
    }
}

async function generateUpgradeInstructions(
    rootPath: string,
    oldVersion: string | null,
    newVersion: string,
    report: UpgradeReport,
    backupDir: string,
    timestamp: string
) {
    // Generate user-facing instructions file
    const instructionsContent = `# 🔄 Alex Upgrade: Phase 2 Required

**Upgrade**: v${oldVersion || 'unknown'} → v${newVersion}  
**Date**: ${new Date().toISOString()}  
**Status**: ⚠️ Phase 1 Complete - AI Assistance Required

---

## What Just Happened (Phase 1 - Automated)

✅ Full backup created: \`${path.relative(rootPath, backupDir)}\`  
✅ System files updated: ${report.updated.length} files  
✅ New files added: ${report.added.length} files  
✅ User files preserved: ${report.preserved.length} files  
✅ Migration tasks identified: ${report.migrationTasks.length} tasks  

---

## What You Need To Do (Phase 2 - AI Assisted)

### Step 1: Ask Your AI Assistant

Copy and paste this prompt to your AI assistant (GitHub Copilot, Claude, etc.):

\`\`\`
Alex, please complete the upgrade to v${newVersion} by:

1. Reading the upgrade tasks in archive/upgrades/upgrade-report-${timestamp}.md
2. Performing schema migrations on flagged files:
   - Change "## Embedded Synapse Network" headers to "## Synapses"
   - Migrate old relationship types (Expression→Enables, Embodiment→Enables, Living→Validates, etc.)
   - Simplify verbose activation patterns (remove date stamps, bold formatting)
3. For copilot-instructions.md, merge carefully:
   - UPDATE: version number, system sections
   - PRESERVE: my domain slot assignments, custom memory file references
4. Run "Alex: Dream (Neural Maintenance)" to validate the upgrade
5. Delete UPGRADE-INSTRUCTIONS.md when complete
\`\`\`

### Step 2: Review Changes

After the AI completes migrations, review:
- Check that your learned domains are still referenced
- Verify any custom files you created are intact
- Run \`Alex: Dream (Neural Maintenance)\` to validate synaptic network

### Step 3: Clean Up

Once satisfied:
- Delete this file (UPGRADE-INSTRUCTIONS.md)
- Delete any \`.v${newVersion}.md\` reference files after merging
- The upgrade is complete!

---

## Migration Tasks Summary

${report.migrationTasks.length > 0 ? report.migrationTasks.map((task, i) => `
### Task ${i + 1}: ${task.file}

**Type**: ${task.type}  
**Description**: ${task.description}

${task.details.map(d => `- ${d}`).join('\n')}
`).join('\n') : 'No migration tasks required.'}

---

## Rollback Instructions

If anything goes wrong:

1. Delete current \`.github/\` and \`domain-knowledge/\` folders
2. Copy contents from: \`${path.relative(rootPath, backupDir)}\`
3. Delete \`.alex-manifest.json\`
4. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${timestamp}.md\`
- Upgrade protocol docs: \`UPGRADE-PROTOCOL.md\`
- Backup location: \`${path.relative(rootPath, backupDir)}\`

---

*This file will be deleted after successful upgrade completion.*
`;

    await fs.writeFile(path.join(rootPath, 'UPGRADE-INSTRUCTIONS.md'), instructionsContent, 'utf8');

    // Generate detailed report
    const reportContent = `# Alex Cognitive Architecture Upgrade Report

**Date**: ${new Date().toISOString()}  
**From Version**: ${oldVersion || 'unknown'}  
**To Version**: ${newVersion}  
**Backup Location**: \`${backupDir}\`

---

## Summary

| Category | Count |
|----------|-------|
| Updated | ${report.updated.length} |
| Added | ${report.added.length} |
| Preserved | ${report.preserved.length} |
| Backed Up | ${report.backed_up.length} |
| Migration Tasks | ${report.migrationTasks.length} |
| Errors | ${report.errors.length} |

---

## Updated Files (System)

${report.updated.length > 0 ? report.updated.map(f => `- ✅ ${f}`).join('\n') : '- None'}

## Added Files (New in this version)

${report.added.length > 0 ? report.added.map(f => `- ➕ ${f}`).join('\n') : '- None'}

## Preserved Files (User content protected)

${report.preserved.length > 0 ? report.preserved.map(f => `- 🔒 ${f}`).join('\n') : '- None'}

## Backed Up

${report.backed_up.length > 0 ? report.backed_up.map(f => `- 📦 ${f}`).join('\n') : '- None'}

---

## Migration Tasks (Require AI Assistance)

${report.migrationTasks.length > 0 ? report.migrationTasks.map((task, i) => `
### ${i + 1}. ${task.file}

**Type**: \`${task.type}\`  
**Description**: ${task.description}

**Details**:
${task.details.map(d => `- ${d}`).join('\n')}
`).join('\n---\n') : 'No migration tasks required.'}

---

${report.errors.length > 0 ? `## Errors\n\n${report.errors.map(e => `- ❌ ${e}`).join('\n')}` : ''}

## Next Steps

1. Read \`UPGRADE-INSTRUCTIONS.md\` in workspace root
2. Ask AI assistant to complete Phase 2 migration
3. Run \`Alex: Dream (Neural Maintenance)\` to validate
4. Delete \`UPGRADE-INSTRUCTIONS.md\` when complete

---

*Report generated by Alex Cognitive Architecture v${newVersion}*
`;

    const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, reportContent, 'utf8');
}
