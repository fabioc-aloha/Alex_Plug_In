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
    try {
        const packageJson = await fs.readJson(path.join(extensionPath, 'package.json'));
        return packageJson.version || '0.0.0';
    } catch (error) {
        console.error('Failed to read extension package.json:', error);
        return '0.0.0';  // Fallback version
    }
}

/**
 * Load or create manifest
 */
async function loadManifest(rootPath: string): Promise<Manifest | null> {
    const manifestPath = path.join(rootPath, '.alex-manifest.json');
    if (await fs.pathExists(manifestPath)) {
        try {
            return await fs.readJson(manifestPath);
        } catch (error) {
            console.error('Failed to parse manifest (may be corrupted):', error);
            // Return null to trigger fresh manifest creation
            return null;
        }
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
    const dkPath = path.join(rootPath, '.github', 'domain-knowledge');
    
    if (await fs.pathExists(dkPath)) {
        const files = await fs.readdir(dkPath);
        for (const file of files) {
            if (file.endsWith('.md')) {
                const relativePath = `.github/domain-knowledge/${file}`;
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
        vscode.window.showErrorMessage(
            'No workspace folder open. Please open a project with Alex installed (File → Open Folder), then run Upgrade.'
        );
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const extensionPath = context.extensionPath;
    const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');

    // Check if Alex is installed
    if (!await fs.pathExists(markerFile)) {
        const result = await vscode.window.showWarningMessage(
            'Alex is not installed in this workspace yet.\n\n' +
            'To use Alex, you need to initialize it first. This will set up the cognitive architecture files.',
            'Initialize Alex Now',
            'Cancel'
        );

        if (result === 'Initialize Alex Now') {
            await vscode.commands.executeCommand('alex.initialize');
        }
        return;
    }

    // Get versions
    const installedVersion = await getInstalledVersion(rootPath);
    const extensionVersion = await getExtensionVersion(extensionPath);

    if (installedVersion === extensionVersion) {
        const result = await vscode.window.showInformationMessage(
            `✅ Alex is already at the latest version (${extensionVersion}).\n\n` +
            'No upgrade needed. Your cognitive architecture is up to date!',
            'Run Dream Protocol',
            'Close'
        );
        if (result === 'Run Dream Protocol') {
            await vscode.commands.executeCommand('alex.dream');
        }
        return;
    }

    // Confirm upgrade
    const confirm = await vscode.window.showInformationMessage(
        `🔄 Upgrade Available: v${installedVersion || 'unknown'} → v${extensionVersion}\n\n` +
        'This is a safe, hybrid upgrade process:\n\n' +
        '📦 Phase 1 (Automated):\n' +
        '• Full backup of all files\n' +
        '• Update system files\n' +
        '• Detect what needs migration\n\n' +
        '🤖 Phase 2 (AI-Assisted):\n' +
        '• Your AI assistant completes the upgrade\n' +
        '• Preserves all your learned knowledge\n' +
        '• Migrates any schema changes\n\n' +
        '⏱️ Total time: ~2-5 minutes',
        { modal: true },
        'Start Upgrade',
        'What\'s New?',
        'Cancel'
    );

    if (confirm === 'What\'s New?') {
        // Open changelog or show version notes
        const changelogPath = path.join(extensionPath, 'CHANGELOG.md');
        if (await fs.pathExists(changelogPath)) {
            const doc = await vscode.workspace.openTextDocument(changelogPath);
            await vscode.window.showTextDocument(doc);
        }
        return;
    }
    
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
    // Validate extension has required files before starting
    const requiredSource = path.join(extensionPath, '.github', 'copilot-instructions.md');
    if (!await fs.pathExists(requiredSource)) {
        vscode.window.showErrorMessage(
            'Extension installation appears corrupted - missing core files.\n\n' +
            'Please reinstall the Alex Cognitive Architecture extension from the VS Code Marketplace.'
        );
        return;
    }

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
            
            // Validate we can write to archive directory
            try {
                await fs.ensureDir(backupDir);
                // Test write permissions
                const testFile = path.join(backupDir, '.write-test');
                await fs.writeFile(testFile, 'test');
                await fs.remove(testFile);
            } catch (writeError: any) {
                throw new Error(`Cannot create backup directory - check disk space and permissions: ${writeError.message}`);
            }
            
            // Backup .github folder (includes domain-knowledge, config, episodic)
            const githubSrc = path.join(rootPath, '.github');
            if (await fs.pathExists(githubSrc)) {
                await fs.copy(githubSrc, path.join(backupDir, '.github'));
                report.backed_up.push('.github/ (all cognitive memory)');
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
            const dkPath = path.join(rootPath, '.github', 'domain-knowledge');
            if (await fs.pathExists(dkPath)) {
                const dkFiles = await fs.readdir(dkPath);
                for (const file of dkFiles) {
                    if (file.endsWith('.md')) {
                        filesToScan.push(path.join(dkPath, file));
                    }
                }
            }
            
            // Add episodic files
            const episodicPath = path.join(rootPath, '.github', 'episodic');
            if (await fs.pathExists(episodicPath)) {
                const episodicFiles = await fs.readdir(episodicPath);
                for (const file of episodicFiles) {
                    if (file.endsWith('.md')) {
                        filesToScan.push(path.join(episodicPath, file));
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

            // Step 6b: Add agents folder (new in v2.0.0)
            const agentsSrc = path.join(extensionPath, '.github', 'agents');
            const agentsDest = path.join(rootPath, '.github', 'agents');
            if (await fs.pathExists(agentsSrc)) {
                await fs.ensureDir(agentsDest);
                const files = await fs.readdir(agentsSrc);
                for (const file of files) {
                    const srcFile = path.join(agentsSrc, file);
                    const destFile = path.join(agentsDest, file);
                    if ((await fs.stat(srcFile)).isFile()) {
                        const existed = await fs.pathExists(destFile);
                        await fs.copy(srcFile, destFile, { overwrite: true });
                        
                        const content = await fs.readFile(srcFile, 'utf8');
                        manifest.files[`.github/agents/${file}`] = {
                            type: 'system',
                            originalChecksum: calculateChecksum(content)
                        };
                        
                        if (existed) {
                            report.updated.push(`.github/agents/${file}`);
                        } else {
                            report.added.push(`.github/agents/${file}`);
                        }
                    }
                }
            }

            // Step 6c: Add config folder templates (new in v2.0.0)
            const configSrc = path.join(extensionPath, '.github', 'config');
            const configDest = path.join(rootPath, '.github', 'config');
            if (await fs.pathExists(configSrc)) {
                await fs.ensureDir(configDest);
                const files = await fs.readdir(configSrc);
                for (const file of files) {
                    // Only copy templates and non-user files
                    if (file.includes('template') || file === 'USER-PROFILE-TEMPLATE.md') {
                        const srcFile = path.join(configSrc, file);
                        const destFile = path.join(configDest, file);
                        if ((await fs.stat(srcFile)).isFile()) {
                            const existed = await fs.pathExists(destFile);
                            await fs.copy(srcFile, destFile, { overwrite: true });
                            
                            if (existed) {
                                report.updated.push(`.github/config/${file}`);
                            } else {
                                report.added.push(`.github/config/${file}`);
                            }
                        }
                    }
                }
            }

            // Step 7: Handle domain-knowledge files carefully
            progress.report({ message: "Processing domain knowledge...", increment: 10 });
            const extDkSrc = path.join(extensionPath, '.github', 'domain-knowledge');
            const extDkDest = path.join(rootPath, '.github', 'domain-knowledge');
            
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
                            manifest.files[`.github/domain-knowledge/${file}`] = {
                                type: 'system',
                                originalChecksum: srcChecksum
                            };
                            report.added.push(`.github/domain-knowledge/${file}`);
                        } else {
                            // Existing file - check if modified
                            const destContent = await fs.readFile(destFile, 'utf8');
                            const destChecksum = calculateChecksum(destContent);
                            const originalChecksum = manifest.files[`.github/domain-knowledge/${file}`]?.originalChecksum;
                            
                            if (originalChecksum && destChecksum !== originalChecksum) {
                                // User modified - preserve and provide new version
                                const newVersionPath = destFile.replace(/\.md$/, `.v${newVersion}.md`);
                                await fs.copy(srcFile, newVersionPath);
                                report.preserved.push(`.github/domain-knowledge/${file} (modified by user, new version: ${path.basename(newVersionPath)})`);
                                
                                // Add review task
                                report.migrationTasks.push({
                                    file: `.github/domain-knowledge/${file}`,
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
                                manifest.files[`.github/domain-knowledge/${file}`] = {
                                    type: 'system',
                                    originalChecksum: srcChecksum
                                };
                                report.updated.push(`.github/domain-knowledge/${file}`);
                            }
                        }
                    }
                }
            }

            // Step 8: Update manifest (with atomic write)
            progress.report({ message: "Saving manifest...", increment: 5 });
            manifest.version = newVersion;
            manifest.upgradedAt = new Date().toISOString();
            
            // Atomic write: write to temp file first, then rename
            const manifestPath = path.join(rootPath, '.alex-manifest.json');
            const tempManifestPath = manifestPath + '.tmp';
            await fs.writeJson(tempManifestPath, manifest, { spaces: 2 });
            await fs.move(tempManifestPath, manifestPath, { overwrite: true });

            // Step 9: Generate upgrade tasks and instructions
            progress.report({ message: "Generating upgrade instructions...", increment: 5 });
            await generateUpgradeInstructions(rootPath, oldVersion, newVersion, report, backupDir, timestamp);
        });

        // Show completion message with instructions
        const taskWord = report.migrationTasks.length === 1 ? 'task' : 'tasks';
        const result = await vscode.window.showWarningMessage(
            `✅ Phase 1 Complete!\n\n` +
            `📊 Summary:\n` +
            `• Backup created: ${report.backed_up.length} folders\n` +
            `• Files updated: ${report.updated.length}\n` +
            `• Files added: ${report.added.length}\n` +
            `• Files preserved: ${report.preserved.length}\n` +
            `• Migration ${taskWord}: ${report.migrationTasks.length}\n\n` +
            `🤖 Next Step: Open the instructions file and copy the prompt to your AI assistant (GitHub Copilot, Claude, etc.) to complete Phase 2.`,
            'Open Instructions (Recommended)',
            'View Full Report'
        );

        if (result === 'Open Instructions (Recommended)') {
            const instructionsPath = path.join(rootPath, 'UPGRADE-INSTRUCTIONS.md');
            const doc = await vscode.workspace.openTextDocument(instructionsPath);
            await vscode.window.showTextDocument(doc);
        } else if (result === 'View Full Report') {
            const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
            const doc = await vscode.workspace.openTextDocument(reportPath);
            await vscode.window.showTextDocument(doc);
        }

    } catch (error: any) {
        vscode.window.showErrorMessage(
            `❌ Upgrade failed: ${error.message}\n\n` +
            'Your original files should be intact. If you see issues:\n' +
            '1. Check the archive/upgrades folder for backups\n' +
            '2. Try running "Alex: Dream" to assess damage\n' +
            '3. You can restore from backup if needed'
        );
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

1. Delete current \`.github/\` folder
2. Copy contents from: \`${path.relative(rootPath, backupDir)}\`
3. Delete \`.alex-manifest.json\`
4. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

## Need Help?

- Full upgrade report: \`archive/upgrades/upgrade-report-${timestamp}.md\`
- Upgrade protocol docs: \`UPGRADE-INSTRUCTIONS.md\`
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
