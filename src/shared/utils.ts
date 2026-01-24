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

    for (const pattern of MEMORY_FILE_PATTERNS) {
        const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
        const files = await vscode.workspace.findFiles(relativePattern);

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
                        
                        const found = await vscode.workspace.findFiles(
                            new vscode.RelativePattern(workspaceFolder, `**/${targetName}`)
                        );
                        
                        if (found.length === 0) {
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
