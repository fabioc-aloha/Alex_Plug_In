/**
 * Alex Cognitive Architecture - Shared Utilities
 * 
 * Common utility functions used across the extension for:
 * - Version reading
 * - File scanning
 * - Workspace validation
 */

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { 
    MEMORY_FILE_PATTERNS, 
    SYNAPSE_REGEX, 
    VERSION_EXTRACT_REGEX,
    VERSION_NUMBER_REGEX,
    getHealthStatus 
} from './constants';

/**
 * Result of workspace validation
 */
export interface WorkspaceValidation {
    isValid: boolean;
    rootPath?: string;
    workspaceFolder?: vscode.WorkspaceFolder;
    error?: string;
}

/**
 * Validate workspace is open and return root path
 * @deprecated Use getAlexWorkspaceFolder() for commands that require Alex to be installed
 */
export function validateWorkspace(): WorkspaceValidation {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return {
            isValid: false,
            error: 'No workspace folder open. Please open a project folder first (File → Open Folder).'
        };
    }
    
    return {
        isValid: true,
        rootPath: workspaceFolders[0].uri.fsPath,
        workspaceFolder: workspaceFolders[0]
    };
}

/**
 * Result of Alex workspace folder detection
 */
export interface AlexWorkspaceFolderResult {
    found: boolean;
    rootPath?: string;
    workspaceFolder?: vscode.WorkspaceFolder;
    error?: string;
    /** True if user cancelled folder selection in multi-folder workspace */
    cancelled?: boolean;
}

/**
 * Find the workspace folder that has Alex installed.
 * 
 * In single-folder mode: returns that folder if Alex is installed
 * In multi-folder workspace mode: 
 *   - If only one folder has Alex, returns it automatically
 *   - If multiple folders have Alex, prompts user to select
 *   - If no folders have Alex, returns error
 * 
 * @param requireInstalled If true (default), returns error if Alex not installed.
 *                         If false, returns first folder (for initialize command).
 */
export async function getAlexWorkspaceFolder(
    requireInstalled: boolean = true
): Promise<AlexWorkspaceFolderResult> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return {
            found: false,
            error: 'No workspace folder open. Please open a project folder first (File → Open Folder).'
        };
    }

    // Single folder mode - simple case
    if (workspaceFolders.length === 1) {
        const folder = workspaceFolders[0];
        if (requireInstalled) {
            const installed = await isAlexInstalled(folder.uri.fsPath);
            if (!installed) {
                return {
                    found: false,
                    error: 'Alex is not installed in this workspace. Run "Alex: Initialize Architecture" first.'
                };
            }
        }
        return {
            found: true,
            rootPath: folder.uri.fsPath,
            workspaceFolder: folder
        };
    }

    // Multi-folder workspace mode - check which folders have Alex installed
    const foldersWithAlex: vscode.WorkspaceFolder[] = [];
    for (const folder of workspaceFolders) {
        if (await isAlexInstalled(folder.uri.fsPath)) {
            foldersWithAlex.push(folder);
        }
    }

    if (!requireInstalled) {
        // For initialize command - prompt user to select any folder
        const selected = await vscode.window.showQuickPick(
            workspaceFolders.map(f => ({
                label: f.name,
                description: f.uri.fsPath,
                folder: f
            })),
            {
                placeHolder: 'Select a workspace folder to initialize Alex in',
                title: 'Initialize Alex - Select Folder'
            }
        );

        if (!selected) {
            return { found: false, cancelled: true };
        }

        return {
            found: true,
            rootPath: selected.folder.uri.fsPath,
            workspaceFolder: selected.folder
        };
    }

    // Commands that require Alex to be installed
    if (foldersWithAlex.length === 0) {
        return {
            found: false,
            error: 'Alex is not installed in any workspace folder. Run "Alex: Initialize Architecture" first.'
        };
    }

    if (foldersWithAlex.length === 1) {
        // Only one folder has Alex - use it automatically
        return {
            found: true,
            rootPath: foldersWithAlex[0].uri.fsPath,
            workspaceFolder: foldersWithAlex[0]
        };
    }

    // Multiple folders have Alex - prompt user to select
    const selected = await vscode.window.showQuickPick(
        foldersWithAlex.map(f => ({
            label: f.name,
            description: f.uri.fsPath,
            folder: f
        })),
        {
            placeHolder: 'Multiple folders have Alex installed. Select one:',
            title: 'Alex - Select Workspace Folder'
        }
    );

    if (!selected) {
        return { found: false, cancelled: true };
    }

    return {
        found: true,
        rootPath: selected.folder.uri.fsPath,
        workspaceFolder: selected.folder
    };
}

/**
 * Read Alex version from copilot-instructions.md
 * @param rootPath Workspace root path
 * @param numericOnly If true, returns only X.Y.Z; otherwise returns "X.Y.Z CODENAME"
 */
export async function getInstalledAlexVersion(
    rootPath: string, 
    numericOnly: boolean = false
): Promise<string | null> {
    const instructionsPath = path.join(rootPath, '.github', 'copilot-instructions.md');
    
    if (!await fs.pathExists(instructionsPath)) {
        return null;
    }

    try {
        const content = await fs.readFile(instructionsPath, 'utf8');
        const regex = numericOnly ? VERSION_NUMBER_REGEX : VERSION_EXTRACT_REGEX;
        const match = content.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

/**
 * Get extension version from package.json
 */
export async function getExtensionVersion(extensionPath: string): Promise<string> {
    try {
        const packageJson = await fs.readJson(path.join(extensionPath, 'package.json'));
        return packageJson.version || '0.0.0';
    } catch (error) {
        console.error('Failed to read extension package.json:', error);
        return '0.0.0';
    }
}

/**
 * Check if Alex is installed in the workspace
 */
export async function isAlexInstalled(rootPath: string): Promise<boolean> {
    const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');
    return fs.pathExists(markerFile);
}

/**
 * Synapse scan result
 */
export interface SynapseScanResult {
    totalFiles: number;
    totalSynapses: number;
    brokenConnections: number;
    healthStatus: string;
    issues?: string[];
}

/**
 * Scan memory files for synapse health
 * @param workspaceFolder The workspace folder to scan
 * @param collectIssues If true, collects detailed issue descriptions
 * Performance optimized: Pre-builds file index to avoid per-synapse findFiles calls
 */
export async function scanSynapseHealth(
    workspaceFolder: vscode.WorkspaceFolder,
    collectIssues: boolean = false
): Promise<SynapseScanResult> {
    const result: SynapseScanResult = {
        totalFiles: 0,
        totalSynapses: 0,
        brokenConnections: 0,
        healthStatus: 'UNKNOWN',
        issues: collectIssues ? [] : undefined
    };

    // Pre-build a set of all known markdown files for fast lookup
    // This avoids calling findFiles for each synapse (major performance fix)
    const allMdFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '**/*.md'),
        '**/node_modules/**',
        500  // Limit to prevent scanning huge workspaces
    );
    const knownFileBasenames = new Set(allMdFiles.map(f => path.basename(f.fsPath).toLowerCase()));

    for (const pattern of MEMORY_FILE_PATTERNS) {
        const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
        const files = await vscode.workspace.findFiles(relativePattern, null, 100);

        for (const file of files) {
            result.totalFiles++;
            try {
                const content = await fs.readFile(file.fsPath, 'utf-8');
                const lines = content.split('\n');
                
                let inCodeBlock = false;
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.trim().startsWith('```')) {
                        inCodeBlock = !inCodeBlock;
                        continue;
                    }
                    if (inCodeBlock) { continue; }
                    
                    // Reset regex lastIndex for each line
                    const regex = new RegExp(SYNAPSE_REGEX.source, 'g');
                    let match;
                    while ((match = regex.exec(line)) !== null) {
                        result.totalSynapses++;
                        const targetName = match[1].trim();
                        const targetBasename = path.basename(targetName).toLowerCase();
                        
                        // Fast lookup in pre-built file index instead of findFiles per synapse
                        if (!knownFileBasenames.has(targetBasename)) {
                            result.brokenConnections++;
                            if (collectIssues && result.issues) {
                                result.issues.push(
                                    `${path.basename(file.fsPath)}:${i + 1} → ${targetName} (not found)`
                                );
                            }
                        }
                    }
                }
            } catch {
                // Skip unreadable files
            }
        }
    }

    result.healthStatus = getHealthStatus(result.brokenConnections);
    return result;
}

/**
 * Memory file counts
 */
export interface MemoryFileCounts {
    procedural: number;
    episodic: number;
    domain: number;
    total: number;
}

/**
 * Count memory files in workspace
 */
export async function countMemoryFiles(
    workspaceFolder: vscode.WorkspaceFolder
): Promise<MemoryFileCounts> {
    const instructionFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/instructions/*.md')
    );
    const promptFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/prompts/*.md')
    );
    const episodicFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/episodic/*.md')
    );
    const domainFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolder, '.github/domain-knowledge/*.md')
    );

    const procedural = instructionFiles.length;
    const episodic = promptFiles.length + episodicFiles.length;
    const domain = domainFiles.length;

    return {
        procedural,
        episodic,
        domain,
        total: procedural + episodic + domain
    };
}

/**
 * Find all memory files in workspace
 */
export async function findAllMemoryFiles(
    workspaceFolder: vscode.WorkspaceFolder
): Promise<vscode.Uri[]> {
    let allFiles: vscode.Uri[] = [];
    
    for (const pattern of MEMORY_FILE_PATTERNS) {
        const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
        const files = await vscode.workspace.findFiles(relativePattern);
        allFiles = allFiles.concat(files);
    }
    
    // Remove duplicates by path
    const seen = new Set<string>();
    return allFiles.filter(file => {
        if (seen.has(file.fsPath)) { return false; }
        seen.add(file.fsPath);
        return true;
    });
}

/**
 * Result of workspace protection check
 */
export interface WorkspaceProtectionResult {
    isProtected: boolean;
    reason?: 'setting' | 'auto-detect';
    canOverride: boolean;
}

/**
 * Check if workspace is protected (Master Alex kill switch)
 * 
 * Protection layers:
 * 1. Explicit setting: alex.workspace.protectedMode = true
 * 2. Auto-detect: workspace contains platforms/vscode-extension/ (Master Alex source)
 * 
 * @param rootPath Workspace root path
 * @returns Protection status with reason
 */
export async function isWorkspaceProtected(rootPath: string): Promise<WorkspaceProtectionResult> {
    const config = vscode.workspace.getConfiguration('alex.workspace');
    
    // Layer 1: Explicit protection setting
    const explicitProtection = config.get<boolean>('protectedMode', false);
    if (explicitProtection) {
        return {
            isProtected: true,
            reason: 'setting',
            canOverride: false  // Explicit setting cannot be overridden
        };
    }
    
    // Layer 2: Auto-detect Master Alex (if enabled)
    const autoProtect = config.get<boolean>('autoProtectMasterAlex', true);
    if (autoProtect) {
        // Check for Master Alex indicators
        const masterAlexIndicators = [
            path.join(rootPath, 'platforms', 'vscode-extension'),
            path.join(rootPath, 'platforms', 'm365-copilot'),
            path.join(rootPath, 'alex_docs'),  // Unique to Master Alex
        ];
        
        for (const indicator of masterAlexIndicators) {
            if (await fs.pathExists(indicator)) {
                return {
                    isProtected: true,
                    reason: 'auto-detect',
                    canOverride: true  // Auto-detection can be overridden with confirmation
                };
            }
        }
    }
    
    return {
        isProtected: false,
        canOverride: true
    };
}

/**
 * Check protection and show appropriate message if blocked
 * 
 * @param rootPath Workspace root path
 * @param operationName Name of operation for error message
 * @param allowOverride If true, allows user to override auto-detection
 * @returns true if operation should proceed, false if blocked
 */
export async function checkProtectionAndWarn(
    rootPath: string,
    operationName: string,
    allowOverride: boolean = false
): Promise<boolean> {
    const protection = await isWorkspaceProtected(rootPath);
    
    if (!protection.isProtected) {
        return true;  // Not protected, proceed
    }
    
    if (protection.reason === 'setting') {
        // Explicit protection - cannot override
        vscode.window.showErrorMessage(
            `🛡️ ${operationName} blocked: This workspace is in protected mode.\n\n` +
            `Master Alex development environment detected. Use Extension Development Host (F5) to test.`,
            { modal: true }
        );
        return false;
    }
    
    if (protection.reason === 'auto-detect') {
        if (allowOverride) {
            // Auto-detection with override option
            const result = await vscode.window.showWarningMessage(
                `⚠️ Master Alex workspace detected!\n\n` +
                `This appears to be the Alex development environment.\n` +
                `"${operationName}" could damage the source of truth.\n\n` +
                `Use F5 (Extension Development Host) for safe testing.`,
                { modal: true },
                'Cancel (Recommended)',
                'Proceed Anyway (DANGEROUS)'
            );
            
            if (result === 'Proceed Anyway (DANGEROUS)') {
                // Double confirmation for destructive operations
                const doubleConfirm = await vscode.window.showWarningMessage(
                    `🚨 FINAL WARNING 🚨\n\n` +
                    `You are about to modify Master Alex's cognitive architecture.\n` +
                    `This cannot be easily undone.\n\n` +
                    `Are you absolutely sure?`,
                    { modal: true },
                    'Cancel',
                    'Yes, I understand the risk'
                );
                
                return doubleConfirm === 'Yes, I understand the risk';
            }
            return false;
        } else {
            // Auto-detection without override
            vscode.window.showErrorMessage(
                `🛡️ ${operationName} blocked: Master Alex workspace detected.\n\n` +
                `This workspace contains Alex source code. ` +
                `Use Extension Development Host (F5) to test the extension safely.`,
                { modal: true }
            );
            return false;
        }
    }
    
    return true;
}
