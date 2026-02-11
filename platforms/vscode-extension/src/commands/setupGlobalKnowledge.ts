import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ALEX_HOME = path.join(os.homedir(), '.alex');
const GK_PATH = path.join(ALEX_HOME, 'global-knowledge');
const SKILL_REGISTRY_PATH = path.join(GK_PATH, 'skills', 'skill-registry.json');
const GK_REPO_URL = 'https://github.com/fabioc-aloha/Alex-Global-Knowledge.git';

// Common developer paths to check for existing GK repo
const DEVELOPER_PATHS = [
    'C:\\Development\\Alex-Global-Knowledge',
    'D:\\Development\\Alex-Global-Knowledge',
    path.join(os.homedir(), 'Development', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'dev', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'repos', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'projects', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'code', 'Alex-Global-Knowledge'),
];

/**
 * Check if Global Knowledge is properly set up
 */
export async function isGlobalKnowledgeSetup(): Promise<boolean> {
    return fs.pathExists(SKILL_REGISTRY_PATH);
}

/**
 * Find existing GK repo in common developer locations
 */
async function findExistingGKRepo(): Promise<string | null> {
    for (const devPath of DEVELOPER_PATHS) {
        const registryPath = path.join(devPath, 'skills', 'skill-registry.json');
        if (await fs.pathExists(registryPath)) {
            return devPath;
        }
    }
    return null;
}

/**
 * Check if path is a symlink
 */
async function isSymlink(targetPath: string): Promise<boolean> {
    try {
        const stats = await fs.lstat(targetPath);
        return stats.isSymbolicLink();
    } catch {
        return false;
    }
}

/**
 * Create symlink (requires admin on Windows for directories)
 */
async function createSymlink(target: string, linkPath: string): Promise<void> {
    // Ensure parent directory exists
    await fs.ensureDir(path.dirname(linkPath));
    
    // Remove existing path if it exists
    if (await fs.pathExists(linkPath)) {
        const isLink = await isSymlink(linkPath);
        if (isLink) {
            await fs.unlink(linkPath);
        } else {
            // Backup existing folder
            const backupPath = `${linkPath}-backup-${Date.now()}`;
            await fs.move(linkPath, backupPath);
        }
    }
    
    // Create symlink
    await fs.symlink(target, linkPath, 'junction'); // junction works without admin on Windows
}

/**
 * Clone GK repository
 */
async function cloneGKRepo(targetPath: string): Promise<void> {
    await fs.ensureDir(path.dirname(targetPath));
    await execAsync(`git clone ${GK_REPO_URL} "${targetPath}"`);
}

/**
 * Ensure Global Knowledge is set up - called on extension activation
 * Returns true if setup is complete, false if user skipped
 */
export async function ensureGlobalKnowledgeSetup(): Promise<boolean> {
    // Already set up?
    if (await isGlobalKnowledgeSetup()) {
        return true;
    }

    // Check if GK path exists but is misconfigured
    const gkExists = await fs.pathExists(GK_PATH);
    const isLink = gkExists && await isSymlink(GK_PATH);
    
    // Try to find existing developer repo
    const existingRepo = await findExistingGKRepo();
    
    if (existingRepo) {
        // Developer mode: offer to symlink
        const choice = await vscode.window.showInformationMessage(
            `Found Global Knowledge repo at:\n${existingRepo}\n\nLink it to ~/.alex/global-knowledge?`,
            { modal: false },
            'Link Repository',
            'Clone Fresh',
            'Skip'
        );
        
        if (choice === 'Link Repository') {
            try {
                await createSymlink(existingRepo, GK_PATH);
                vscode.window.showInformationMessage(
                    `✅ Global Knowledge linked to ${existingRepo}`
                );
                return true;
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to create symlink: ${error}. Try running VS Code as administrator.`
                );
                return false;
            }
        } else if (choice === 'Clone Fresh') {
            // Fall through to clone logic
        } else {
            return false; // Skipped
        }
    }
    
    // No existing repo found OR user chose to clone fresh
    const cloneChoice = await vscode.window.showInformationMessage(
        '📚 Global Knowledge not found.\n\nClone from GitHub to unlock premium features:\n• Search Knowledge across projects\n• Save & share insights\n• Skill inheritance for heirs',
        { modal: false },
        'Clone from GitHub',
        'Skip'
    );
    
    if (cloneChoice === 'Clone from GitHub') {
        return await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Cloning Global Knowledge',
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ message: 'Cloning repository...' });
                await cloneGKRepo(GK_PATH);
                
                vscode.window.showInformationMessage(
                    `✅ Global Knowledge cloned to ~/.alex/global-knowledge\n\nPremium features unlocked!`
                );
                return true;
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to clone: ${error}\n\nMake sure git is installed and you have internet access.`
                );
                return false;
            }
        });
    }
    
    return false; // Skipped
}

/**
 * Command: Alex: Setup Global Knowledge
 * Manual trigger for GK setup
 */
export async function setupGlobalKnowledgeCommand(): Promise<void> {
    const isSetup = await isGlobalKnowledgeSetup();
    
    if (isSetup) {
        const isLink = await isSymlink(GK_PATH);
        let target = GK_PATH;
        
        if (isLink) {
            try {
                target = await fs.readlink(GK_PATH);
            } catch {
                // Ignore
            }
        }
        
        const reconfigure = await vscode.window.showInformationMessage(
            `Global Knowledge is already configured.\n\nLocation: ${target}\n\nReconfigure?`,
            'Reconfigure',
            'Open Folder',
            'Cancel'
        );
        
        if (reconfigure === 'Reconfigure') {
            // Remove existing setup and re-run
            if (isLink) {
                await fs.unlink(GK_PATH);
            } else {
                const backupPath = `${GK_PATH}-backup-${Date.now()}`;
                await fs.move(GK_PATH, backupPath);
                vscode.window.showInformationMessage(`Backed up to ${backupPath}`);
            }
            await ensureGlobalKnowledgeSetup();
        } else if (reconfigure === 'Open Folder') {
            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(target), { forceNewWindow: true });
        }
    } else {
        await ensureGlobalKnowledgeSetup();
    }
}

/**
 * Register the command
 */
export function registerSetupGlobalKnowledgeCommand(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand('alex.setupGlobalKnowledge', setupGlobalKnowledgeCommand);
}
