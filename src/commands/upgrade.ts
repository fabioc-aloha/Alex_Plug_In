import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import { getAlexWorkspaceFolder } from '../shared/utils';
import { runDreamProtocol, DreamResult } from './dream';

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
 * Get the manifest path (new location)
 */
function getManifestPath(rootPath: string): string {
    return path.join(rootPath, '.github', 'config', 'alex-manifest.json');
}

/**
 * Get the legacy manifest path (old location)
 */
function getLegacyManifestPath(rootPath: string): string {
    return path.join(rootPath, '.alex-manifest.json');
}

/**
 * Load manifest, migrating from old location if needed
 */
async function loadManifest(rootPath: string): Promise<Manifest | null> {
    const manifestPath = getManifestPath(rootPath);
    const legacyPath = getLegacyManifestPath(rootPath);
    
    // Check new location first
    if (await fs.pathExists(manifestPath)) {
        try {
            return await fs.readJson(manifestPath);
        } catch (error) {
            console.error('Failed to parse manifest (may be corrupted):', error);
            return null;
        }
    }
    
    // Check legacy location and migrate if found
    if (await fs.pathExists(legacyPath)) {
        try {
            const manifest = await fs.readJson(legacyPath);
            // Migrate to new location
            await fs.ensureDir(path.join(rootPath, '.github', 'config'));
            await fs.writeJson(manifestPath, manifest, { spaces: 2 });
            await fs.remove(legacyPath);
            console.log('Migrated manifest from root to .github/config/');
            return manifest;
        } catch (error) {
            console.error('Failed to parse/migrate legacy manifest:', error);
            return null;
        }
    }
    
    return null;
}

/**
 * Save manifest
 */
async function saveManifest(rootPath: string, manifest: Manifest): Promise<void> {
    const manifestPath = getManifestPath(rootPath);
    await fs.ensureDir(path.dirname(manifestPath));
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });
}

/**
 * Auto-merge brain file (copilot-instructions.md)
 * Preserves user customizations while updating system sections
 */
async function autoMergeBrainFile(
    rootPath: string,
    extensionPath: string,
    newVersion: string
): Promise<{ success: boolean; reason?: string }> {
    const userFile = path.join(rootPath, '.github', 'copilot-instructions.md');
    const newFile = path.join(extensionPath, '.github', 'copilot-instructions.md');
    
    if (!await fs.pathExists(userFile) || !await fs.pathExists(newFile)) {
        return { success: false, reason: 'File not found' };
    }
    
    try {
        const userContent = await fs.readFile(userFile, 'utf8');
        const newContent = await fs.readFile(newFile, 'utf8');
        
        // Extract user's domain slots (P5-P7 assignments)
        const domainSlotsMatch = userContent.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);
        const userDomainSlots = domainSlotsMatch ? domainSlotsMatch[0] : null;
        
        // Extract user's custom synapses (any added by user beyond defaults)
        const userSynapsesSection = userContent.match(/## Synapses[\s\S]*?(?=##|$)/);
        
        // Check for heavy user customization that requires manual merge
        const userLines = userContent.split('\n').length;
        const newLines = newContent.split('\n').length;
        
        // If user file is significantly different (>20% longer), require manual merge
        if (userLines > newLines * 1.2) {
            return { success: false, reason: 'User file has significant customizations' };
        }
        
        // Check for custom sections (user added their own ## headers)
        const userHeaders = (userContent.match(/^## [^\n]+/gm) || []) as string[];
        const newHeaders = (newContent.match(/^## [^\n]+/gm) || []) as string[];
        const customHeaders = userHeaders.filter(h => !newHeaders.includes(h));
        
        if (customHeaders.length > 2) {
            return { success: false, reason: `User has ${customHeaders.length} custom sections` };
        }
        
        // Safe to auto-merge: Start with new content
        let mergedContent = newContent;
        
        // Preserve user's domain slots if they have customized them
        if (userDomainSlots && userDomainSlots.includes('P5') && !userDomainSlots.includes('Available for')) {
            const defaultDomainSlots = mergedContent.match(/\*\*Domain Slots \(P5-P7\)\*\*:([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);
            if (defaultDomainSlots) {
                mergedContent = mergedContent.replace(defaultDomainSlots[0], userDomainSlots);
            }
        }
        
        // Update version number
        mergedContent = mergedContent.replace(
            /\*\*Version\*\*:\s*[\d.]+\s*[A-Z]*/,
            `**Version**: ${newVersion}`
        );
        
        // Write merged content
        await fs.writeFile(userFile, mergedContent, 'utf8');
        
        return { success: true };
    } catch (error: any) {
        return { success: false, reason: error.message };
    }
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
 * Relationship type migration mapping
 */
const RELATIONSHIP_TYPE_MIGRATIONS: Record<string, string> = {
    'Expression': 'Enables',
    'Embodiment': 'Enables',
    'Living': 'Validates',
    'Reflexive': 'Documents',
    'Ethical': 'Validates',
    'Unconscious': 'Enables',
    'Application': 'Enables',
    'Validation': 'Validates'
};

/**
 * Perform automatic schema migration on a file
 * Returns true if changes were made, false otherwise
 */
async function performSchemaMigration(filePath: string): Promise<{ migrated: boolean; changes: string[] }> {
    const changes: string[] = [];
    
    if (!await fs.pathExists(filePath)) {
        return { migrated: false, changes };
    }

    try {
        let content = await fs.readFile(filePath, 'utf8');
        const originalContent = content;
        
        // 1. Migrate old header: "## Embedded Synapse Network" → "## Synapses"
        if (/## Embedded Synapse Network/i.test(content)) {
            content = content.replace(/## Embedded Synapse Network/gi, '## Synapses');
            changes.push('Header: "## Embedded Synapse Network" → "## Synapses"');
        }
        
        // 2. Migrate bold subheaders: "### **Connection Mapping**" → "### Connection Mapping"
        if (/### \*\*Connection Mapping\*\*/i.test(content)) {
            content = content.replace(/### \*\*Connection Mapping\*\*/gi, '### Connection Mapping');
            changes.push('Subheader: "### **Connection Mapping**" → "### Connection Mapping"');
        }
        if (/### \*\*Activation Patterns\*\*/i.test(content)) {
            content = content.replace(/### \*\*Activation Patterns\*\*/gi, '### Activation Patterns');
            changes.push('Subheader: "### **Activation Patterns**" → "### Activation Patterns"');
        }
        
        // 3. Migrate old relationship types
        for (const [oldType, newType] of Object.entries(RELATIONSHIP_TYPE_MIGRATIONS)) {
            // Match patterns like (Critical, Expression, or (High, Embodiment,
            const regex = new RegExp(`(\\(\\s*(?:Critical|High|Medium|Low)\\s*,\\s*)${oldType}(\\s*,)`, 'gi');
            if (regex.test(content)) {
                content = content.replace(regex, `$1${newType}$2`);
                changes.push(`Relationship type: "${oldType}" → "${newType}"`);
            }
        }
        
        // 4. Simplify verbose activation patterns with date stamps
        // Old: **Bold Trigger** → Long description ✅ NEW Aug 8, 2025
        // New: Trigger → Action
        const dateStampPattern = /\*\*([^*]+)\*\*\s*→\s*([^✅\n]+)\s*✅\s*(?:NEW|CRITICAL|ENHANCED)[^\n]*/g;
        let match;
        while ((match = dateStampPattern.exec(originalContent)) !== null) {
            const trigger = match[1].trim();
            const action = match[2].trim();
            const oldLine = match[0];
            const newLine = `${trigger} → ${action}`;
            content = content.replace(oldLine, newLine);
            changes.push(`Simplified activation: "${trigger}" (removed date stamp and bold)`);
        }
        
        // 5. Remove bold from remaining activation triggers without date stamps
        // Match: **Trigger** → Action (but not already matched above)
        const boldTriggerPattern = /^\s*-\s*\*\*([^*]+)\*\*\s*→\s*(.+)$/gm;
        content = content.replace(boldTriggerPattern, (match, trigger, action) => {
            // Only change if we haven't already (check if it still has **)
            if (match.includes('**')) {
                changes.push(`Removed bold: "${trigger.trim()}"`);
                return `- ${trigger.trim()} → ${action.trim()}`;
            }
            return match;
        });
        
        // 6. Clean up any remaining date stamp patterns that might have been missed
        content = content.replace(/\s*✅\s*(?:NEW|CRITICAL|ENHANCED)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s*\d{4}/gi, '');
        
        // Write back if changes were made
        if (content !== originalContent) {
            await fs.writeFile(filePath, content, 'utf8');
            return { migrated: true, changes };
        }
        
        return { migrated: false, changes };
    } catch (error) {
        changes.push(`Error during migration: ${error}`);
        return { migrated: false, changes };
    }
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
    // Use smart workspace folder detection for multi-folder workspaces
    // Use requireInstalled=true since upgrade only works on existing installations
    const workspaceResult = await getAlexWorkspaceFolder(true);
    
    if (!workspaceResult.found) {
        if (workspaceResult.cancelled) {
            return; // User cancelled folder selection
        }
        
        // Alex not installed - offer to initialize instead
        const result = await vscode.window.showWarningMessage(
            workspaceResult.error || 'Alex is not installed in this workspace.',
            'Initialize Alex Now',
            'Cancel'
        );
        
        if (result === 'Initialize Alex Now') {
            await vscode.commands.executeCommand('alex.initialize');
        }
        return;
    }

    const rootPath = workspaceResult.rootPath!;
    const extensionPath = context.extensionPath;

    // Get versions (Alex installation already verified by getAlexWorkspaceFolder)
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
        'This is a fully automated upgrade process:\n\n' +
        '📦 What will happen:\n' +
        '• Full backup of all cognitive memory\n' +
        '• Update system files (instructions, prompts)\n' +
        '• Auto-migrate schema changes\n' +
        '• Preserve your learned knowledge\n' +
        '• Run Dream validation\n\n' +
        '⏱️ Total time: ~30 seconds',
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

            // Step 5: Auto-merge copilot-instructions.md if possible
            progress.report({ message: "Merging core brain file...", increment: 10 });
            const brainMergeResult = await autoMergeBrainFile(rootPath, extensionPath, newVersion);
            if (brainMergeResult.success) {
                report.updated.push('.github/copilot-instructions.md (auto-merged)');
            } else {
                // Only add merge task if auto-merge failed
                report.migrationTasks.push({
                    file: '.github/copilot-instructions.md',
                    type: 'merge-required',
                    description: 'Core brain file requires manual merge',
                    details: [
                        `Auto-merge failed: ${brainMergeResult.reason}`,
                        'UPDATE: Version number, Core Meta-Cognitive Rules, Essential Principles, VS Code commands',
                        'PRESERVE: Domain slot assignments (P5-P7), user-added memory file references',
                        'REVIEW: Any custom sections added by user'
                    ]
                });
            }

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
            const manifestPath = getManifestPath(rootPath);
            await fs.ensureDir(path.dirname(manifestPath));
            const tempManifestPath = manifestPath + '.tmp';
            await fs.writeJson(tempManifestPath, manifest, { spaces: 2 });
            await fs.move(tempManifestPath, manifestPath, { overwrite: true });

            // Step 9: Perform automatic schema migrations on all flagged files
            progress.report({ message: "Performing schema migrations...", increment: 10 });
            const migrationResults: { file: string; changes: string[] }[] = [];
            
            // Collect all files that need migration
            const filesToMigrate = report.migrationTasks
                .filter(task => task.type === 'schema-migration')
                .map(task => task.file);
            
            // Also include copilot-instructions.md for migration even if auto-merge succeeded
            const brainFile = '.github/copilot-instructions.md';
            if (!filesToMigrate.includes(brainFile)) {
                filesToMigrate.push(brainFile);
            }
            
            for (const relativeFile of filesToMigrate) {
                const fullPath = path.join(rootPath, relativeFile);
                const result = await performSchemaMigration(fullPath);
                if (result.migrated) {
                    migrationResults.push({ file: relativeFile, changes: result.changes });
                }
            }
            
            // Update report with migration results
            report.migrationTasks = report.migrationTasks.filter(task => task.type !== 'schema-migration');
            if (migrationResults.length > 0) {
                report.updated.push(...migrationResults.map(r => `${r.file} (schema migrated: ${r.changes.length} changes)`));
            }

            // Step 10: Generate upgrade report (but not UPGRADE-INSTRUCTIONS.md if fully automated)
            progress.report({ message: "Generating upgrade report...", increment: 5 });
            await generateUpgradeReport(rootPath, oldVersion, newVersion, report, backupDir, timestamp, migrationResults);
        });

        // Step 11: Run Dream validation automatically (in silent mode to avoid notification collision)
        let dreamResult: DreamResult | undefined;
        try {
            dreamResult = await runDreamProtocol(context, { silent: true });
        } catch (dreamError) {
            console.error('Dream validation failed:', dreamError);
            // Don't fail the upgrade if Dream fails - just note it
        }
        const dreamSuccess = dreamResult?.success ?? false;

        // Brief delay to ensure any lingering notifications are cleared
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 12: Clean up UPGRADE-INSTRUCTIONS.md if it exists (from previous incomplete upgrades)
        const instructionsPath = path.join(rootPath, 'UPGRADE-INSTRUCTIONS.md');
        if (await fs.pathExists(instructionsPath)) {
            await fs.remove(instructionsPath);
        }

        // Show completion message
        const result = await vscode.window.showInformationMessage(
            `✅ Upgrade Complete! v${oldVersion || 'unknown'} → v${newVersion}\n\n` +
            `📊 Summary:\n` +
            `• Backup created: ${report.backed_up.length} folders\n` +
            `• Files updated: ${report.updated.length}\n` +
            `• Files added: ${report.added.length}\n` +
            `• Files preserved: ${report.preserved.length}\n` +
            `• Schema migrations: ${report.migrationTasks.length === 0 ? 'All completed' : report.migrationTasks.length + ' remaining'}\n` +
            `• Dream validation: ${dreamSuccess ? '✅ Passed' : '⚠️ Check manually'}\n\n` +
            `🎉 Your cognitive architecture has been fully upgraded!`,
            'View Upgrade Report',
            'Close'
        );

        if (result === 'View Upgrade Report') {
            const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
            if (await fs.pathExists(reportPath)) {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            }
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

async function generateUpgradeReport(
    rootPath: string,
    oldVersion: string | null,
    newVersion: string,
    report: UpgradeReport,
    backupDir: string,
    timestamp: string,
    migrationResults: { file: string; changes: string[] }[]
) {
    // Generate detailed report (no longer generating UPGRADE-INSTRUCTIONS.md since upgrade is fully automated)
    const migrationSection = migrationResults.length > 0 
        ? migrationResults.map((r, i) => `
### ${i + 1}. ${r.file}

**Status**: ✅ Automatically migrated  
**Changes applied**:
${r.changes.map(c => `- ${c}`).join('\n')}
`).join('\n---\n')
        : 'No schema migrations were needed.';

    const remainingTasksSection = report.migrationTasks.length > 0
        ? report.migrationTasks.map((task, i) => `
### ${i + 1}. ${task.file}

**Type**: \`${task.type}\`  
**Description**: ${task.description}

**Details**:
${task.details.map(d => `- ${d}`).join('\n')}
`).join('\n---\n')
        : 'All tasks completed automatically.';

    const reportContent = `# Alex Cognitive Architecture Upgrade Report

**Date**: ${new Date().toISOString()}  
**From Version**: ${oldVersion || 'unknown'}  
**To Version**: ${newVersion}  
**Status**: ✅ Fully Automated Upgrade Complete  
**Backup Location**: \`${backupDir}\`

---

## Summary

| Category | Count |
|----------|-------|
| Updated | ${report.updated.length} |
| Added | ${report.added.length} |
| Preserved | ${report.preserved.length} |
| Backed Up | ${report.backed_up.length} |
| Schema Migrations | ${migrationResults.length} |
| Remaining Tasks | ${report.migrationTasks.length} |
| Errors | ${report.errors.length} |

---

## Updated Files

${report.updated.length > 0 ? report.updated.map(f => `- ✅ ${f}`).join('\n') : '- None'}

## Added Files (New in this version)

${report.added.length > 0 ? report.added.map(f => `- ➕ ${f}`).join('\n') : '- None'}

## Preserved Files (User content protected)

${report.preserved.length > 0 ? report.preserved.map(f => `- 🔒 ${f}`).join('\n') : '- None'}

## Backed Up

${report.backed_up.length > 0 ? report.backed_up.map(f => `- 📦 ${f}`).join('\n') : '- None'}

---

## Schema Migrations Performed

${migrationSection}

---

## Remaining Tasks (Manual Review Recommended)

${remainingTasksSection}

---

${report.errors.length > 0 ? `## Errors\n\n${report.errors.map(e => `- ❌ ${e}`).join('\n')}\n\n---\n\n` : ''}
## Rollback Instructions

If you need to revert:

1. Delete current \`.github/\` folder
2. Copy contents from: \`${path.relative(rootPath, backupDir)}\`
3. Run \`Alex: Dream (Neural Maintenance)\` to verify

---

*Report generated by Alex Cognitive Architecture v${newVersion}*
*Upgrade completed automatically - no manual intervention required*
`;

    const reportPath = path.join(rootPath, 'archive', 'upgrades', `upgrade-report-${timestamp}.md`);
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, reportContent, 'utf8');
}
