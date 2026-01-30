import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Health status levels
 */
export enum HealthStatus {
    Healthy = 'healthy',
    Warning = 'warning',
    Error = 'error',
    NotInitialized = 'not-initialized'
}

/**
 * Health check result
 */
export interface HealthCheckResult {
    status: HealthStatus;
    initialized: boolean;
    totalFiles: number;
    totalSynapses: number;
    brokenSynapses: number;
    issues: string[];
    lastChecked: Date;
    summary: string;
}

// Cache the last health check result
let cachedResult: HealthCheckResult | null = null;
let lastCheckTime: number = 0;
const CACHE_DURATION_MS = 60000; // 1 minute cache

/**
 * Get cached health result if still valid
 */
export function getCachedHealth(): HealthCheckResult | null {
    if (cachedResult && (Date.now() - lastCheckTime) < CACHE_DURATION_MS) {
        return cachedResult;
    }
    return null;
}

/**
 * Run a quick health check on Alex architecture
 */
export async function checkHealth(forceRefresh: boolean = false): Promise<HealthCheckResult> {
    // Return cached result if valid and not forcing refresh
    if (!forceRefresh && cachedResult && (Date.now() - lastCheckTime) < CACHE_DURATION_MS) {
        return cachedResult;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (!workspaceFolders) {
        return {
            status: HealthStatus.NotInitialized,
            initialized: false,
            totalFiles: 0,
            totalSynapses: 0,
            brokenSynapses: 0,
            issues: ['No workspace folder open'],
            lastChecked: new Date(),
            summary: 'No workspace open'
        };
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const alexPath = path.join(rootPath, '.github', 'copilot-instructions.md');
    
    // Check if Alex is initialized
    const initialized = await fs.pathExists(alexPath);
    
    if (!initialized) {
        cachedResult = {
            status: HealthStatus.NotInitialized,
            initialized: false,
            totalFiles: 0,
            totalSynapses: 0,
            brokenSynapses: 0,
            issues: ['Alex architecture not initialized'],
            lastChecked: new Date(),
            summary: 'Not initialized - run Alex: Initialize'
        };
        lastCheckTime = Date.now();
        return cachedResult;
    }

    // Quick scan for memory files and synapses
    const patterns = [
        '.github/copilot-instructions.md',
        '.github/instructions/*.md',
        '.github/prompts/*.md',
        '.github/domain-knowledge/*.md'
    ];

    let totalFiles = 0;
    let totalSynapses = 0;
    let brokenSynapses = 0;
    const issues: string[] = [];

    // Synapse pattern
    const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

    // Pre-build a set of all known markdown files for fast lookup
    // This avoids calling findFiles for each synapse (major performance fix)
    const allMdFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceFolders[0], '**/*.md'),
        '**/node_modules/**',
        500  // Limit to prevent scanning huge workspaces
    );
    const knownFileBasenames = new Set(allMdFiles.map(f => path.basename(f.fsPath).toLowerCase()));

    for (const pattern of patterns) {
        try {
            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern, null, 100);
            
            for (const file of files) {
                totalFiles++;
                try {
                    const content = await fs.readFile(file.fsPath, 'utf-8');
                    
                    // Skip code blocks
                    let inCodeBlock = false;
                    const lines = content.split('\n');
                    
                    for (const line of lines) {
                        if (line.trim().startsWith('```')) {
                            inCodeBlock = !inCodeBlock;
                            continue;
                        }
                        if (inCodeBlock) continue;
                        
                        // Reset regex state
                        synapseRegex.lastIndex = 0;
                        let match;
                        while ((match = synapseRegex.exec(line)) !== null) {
                            totalSynapses++;
                            const targetName = match[1].trim();
                            const targetBasename = path.basename(targetName).toLowerCase();
                            
                            // Fast lookup in pre-built file index instead of findFiles per synapse
                            if (!knownFileBasenames.has(targetBasename)) {
                                brokenSynapses++;
                                if (issues.length < 5) {
                                    issues.push(`Broken: ${targetName} (from ${path.basename(file.fsPath)})`);
                                }
                            }
                        }
                    }
                } catch (err) {
                    // File read error - continue
                }
            }
        } catch (err) {
            // Pattern search error - continue
        }
    }

    // Determine status
    let status: HealthStatus;
    let summary: string;

    if (brokenSynapses === 0 && totalFiles > 0) {
        status = HealthStatus.Healthy;
        summary = `${totalFiles} files, ${totalSynapses} synapses - all healthy`;
    } else if (brokenSynapses > 0 && brokenSynapses < totalSynapses * 0.1) {
        status = HealthStatus.Warning;
        summary = `${brokenSynapses} broken synapses of ${totalSynapses}`;
    } else if (brokenSynapses > 0) {
        status = HealthStatus.Error;
        summary = `${brokenSynapses} broken synapses - run Dream to repair`;
    } else {
        status = HealthStatus.Healthy;
        summary = `${totalFiles} files ready`;
    }

    cachedResult = {
        status,
        initialized,
        totalFiles,
        totalSynapses,
        brokenSynapses,
        issues,
        lastChecked: new Date(),
        summary
    };
    lastCheckTime = Date.now();
    
    return cachedResult;
}

/**
 * Get status bar text and icon based on health
 */
export function getStatusBarDisplay(health: HealthCheckResult): { text: string; tooltip: string; backgroundColor?: vscode.ThemeColor } {
    switch (health.status) {
        case HealthStatus.Healthy:
            return {
                text: '$(brain) Alex 🟢',
                tooltip: `✅ Alex Healthy\n${health.summary}\n\nClick for quick actions`,
                backgroundColor: undefined
            };
        case HealthStatus.Warning:
            return {
                text: '$(brain) Alex 🟡',
                tooltip: `⚠️ Alex Warning\n${health.summary}\n${health.issues.join('\n')}\n\nClick to run diagnostics`,
                backgroundColor: new vscode.ThemeColor('statusBarItem.warningBackground')
            };
        case HealthStatus.Error:
            return {
                text: '$(brain) Alex 🔴',
                tooltip: `❌ Alex Error\n${health.summary}\n${health.issues.join('\n')}\n\nClick to repair`,
                backgroundColor: new vscode.ThemeColor('statusBarItem.errorBackground')
            };
        case HealthStatus.NotInitialized:
        default:
            return {
                text: '$(brain) Alex ⚫',
                tooltip: `Alex not initialized in this workspace\n\nClick to initialize`,
                backgroundColor: undefined
            };
    }
}

/**
 * Clear the health cache
 */
export function clearHealthCache(): void {
    cachedResult = null;
    lastCheckTime = 0;
}
