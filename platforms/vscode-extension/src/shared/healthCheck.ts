import * as vscode from 'vscode';
import * as path from 'path';
import { updateAlexInstalledStatus } from './telemetry';
import { createSynapseRegex } from './utils';

// Import session info (lazy to avoid circular deps)
let getSessionInfo: (() => { active: boolean; remaining: number; isBreak: boolean } | null) | null = null;
let getStreakInfo: (() => Promise<number>) | null = null;

/**
 * Register session provider for status bar (called from extension.ts)
 */
export function registerSessionProvider(provider: () => { active: boolean; remaining: number; isBreak: boolean } | null): void {
    getSessionInfo = provider;
}

/**
 * Register streak provider for status bar (called from extension.ts)
 */
export function registerStreakProvider(provider: () => Promise<number>): void {
    getStreakInfo = provider;
}

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
 * Build a set of known markdown file basenames for fast synapse target lookup
 */
async function buildMarkdownFileIndex(workspaceFolders: readonly vscode.WorkspaceFolder[]): Promise<Set<string>> {
    const targetPatterns = [
        '.github/**/*.md',
        'alex_docs/**/*.md',
        'platforms/**/.github/**/*.md',
        '*.md'
    ];
    
    const allResults = await Promise.all(
        targetPatterns.map(targetPattern =>
            vscode.workspace.findFiles(
                new vscode.RelativePattern(workspaceFolders[0], targetPattern),
                '**/node_modules/**',
                1000
            )
        )
    );
    const allMdFiles = allResults.flat();
    return new Set(allMdFiles.map(f => path.basename(f.fsPath).toLowerCase()));
}

/**
 * Scan architecture files for synapse references and check for broken links
 */
async function scanFilesAndSynapses(
    workspaceFolders: readonly vscode.WorkspaceFolder[],
    patterns: string[],
    knownFileBasenames: Set<string>
): Promise<{ totalFiles: number; totalSynapses: number; brokenSynapses: number; issues: string[] }> {
    let totalFiles = 0;
    let totalSynapses = 0;
    let brokenSynapses = 0;
    const issues: string[] = [];
    const synapseRegex = createSynapseRegex();

    for (const pattern of patterns) {
        try {
            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern, null, 100);
            
            for (const file of files) {
                totalFiles++;
                try {
                    const content = new TextDecoder().decode(await vscode.workspace.fs.readFile(file));
                    let inCodeBlock = false;
                    const lines = content.split('\n');
                    
                    for (const line of lines) {
                        if (line.trim().startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
                        if (inCodeBlock) { continue; }
                        
                        synapseRegex.lastIndex = 0;
                        let match;
                        while ((match = synapseRegex.exec(line)) !== null) {
                            totalSynapses++;
                            const targetName = match[1].trim();
                            const targetBasename = path.basename(targetName).toLowerCase();
                            
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

    return { totalFiles, totalSynapses, brokenSynapses, issues };
}

/**
 * Classify health status from scan results
 */
function classifyHealthStatus(totalFiles: number, totalSynapses: number, brokenSynapses: number): { status: HealthStatus; summary: string } {
    if (brokenSynapses === 0 && totalFiles > 0) {
        return { status: HealthStatus.Healthy, summary: `${totalFiles} files, ${totalSynapses} synapses - all healthy` };
    } else if (brokenSynapses > 0 && brokenSynapses < totalSynapses * 0.1) {
        return { status: HealthStatus.Warning, summary: `${brokenSynapses} broken synapses of ${totalSynapses}` };
    } else if (brokenSynapses > 0) {
        return { status: HealthStatus.Error, summary: `${brokenSynapses} broken synapses - run Dream to repair` };
    }
    return { status: HealthStatus.Healthy, summary: `${totalFiles} files ready` };
}

/**
 * Run a quick health check on Alex architecture
 */
export async function checkHealth(forceRefresh: boolean = false): Promise<HealthCheckResult> {
    if (!forceRefresh && cachedResult && (Date.now() - lastCheckTime) < CACHE_DURATION_MS) {
        return cachedResult;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (!workspaceFolders) {
        return {
            status: HealthStatus.NotInitialized, initialized: false,
            totalFiles: 0, totalSynapses: 0, brokenSynapses: 0,
            issues: ['No workspace folder open'], lastChecked: new Date(),
            summary: 'No workspace open'
        };
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const alexPath = path.join(rootPath, '.github', 'copilot-instructions.md');
    
    let initialized = false;
    try { await vscode.workspace.fs.stat(vscode.Uri.file(alexPath)); initialized = true; } catch { initialized = false; }
    
    if (!initialized) {
        cachedResult = {
            status: HealthStatus.NotInitialized, initialized: false,
            totalFiles: 0, totalSynapses: 0, brokenSynapses: 0,
            issues: ['Alex architecture not initialized'], lastChecked: new Date(),
            summary: 'Not initialized - run Alex: Initialize'
        };
        lastCheckTime = Date.now();
        return cachedResult;
    }

    const patterns = [
        '.github/copilot-instructions.md',
        '.github/instructions/*.md',
        '.github/prompts/*.md',
        '.github/skills/*/SKILL.md',
        '.github/domain-knowledge/*.md'
    ];

    const knownFileBasenames = await buildMarkdownFileIndex(workspaceFolders);
    const scanResult = await scanFilesAndSynapses(workspaceFolders, patterns, knownFileBasenames);
    const { status, summary } = classifyHealthStatus(scanResult.totalFiles, scanResult.totalSynapses, scanResult.brokenSynapses);

    cachedResult = {
        status, initialized,
        totalFiles: scanResult.totalFiles, totalSynapses: scanResult.totalSynapses,
        brokenSynapses: scanResult.brokenSynapses, issues: scanResult.issues,
        lastChecked: new Date(), summary
    };
    lastCheckTime = Date.now();
    
    updateAlexInstalledStatus(initialized);
    
    return cachedResult;
}

/**
 * Get status bar text and icon based on health
 */
export function getStatusBarDisplay(health: HealthCheckResult, sessionInfo?: { active: boolean; remaining: number; isBreak: boolean } | null, streakDays?: number, isProtected?: boolean): { text: string; tooltip: string; backgroundColor?: vscode.ThemeColor } {
    // Special case: Not initialized - show enticing preview
    if (health.status === HealthStatus.NotInitialized) {
        return {
            text: '$(rocket) Alex ⚫ | 🍅 Focus | 🔥 Streaks | 💡 Knowledge',
            tooltip: `🚀 Initialize Alex to unlock:\n\n` +
                `🍅 Focus Sessions - Pomodoro timer for deep work\n` +
                `🔥 Learning Streaks - Build daily learning habits\n` +
                `💡 Knowledge Base - Save insights across projects\n` +
                `🧠 Dream Protocol - Cognitive maintenance\n` +
                `✨ Self-Actualization - Deep reflection\n\n` +
                `Click to initialize and start your journey!`,
            backgroundColor: undefined
        };
    }

    // Build status parts - use emoji for status, no background color
    // (yellow/red backgrounds look jarring in VS Code status bar)
    let statusEmoji = '🟢';
    const bgColor: vscode.ThemeColor | undefined = undefined;
    
    switch (health.status) {
        case HealthStatus.Warning:
            statusEmoji = '🟡';
            break;
        case HealthStatus.Error:
            statusEmoji = '🔴';
            break;
    }

    // Build text parts
    const parts: string[] = [`$(rocket) Alex ${statusEmoji}`];
    
    // Add protection indicator
    if (isProtected) {
        parts.push('🔒');
    }
    
    // Add session if active
    if (sessionInfo?.active) {
        const mins = Math.floor(sessionInfo.remaining / 60);
        const secs = sessionInfo.remaining % 60;
        const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
        const icon = sessionInfo.isBreak ? '☕' : '🍅';
        parts.push(`${icon} ${timeStr}`);
    }
    
    // Add streak if > 0
    if (streakDays && streakDays > 0) {
        parts.push(`🔥${streakDays}`);
    }

    const text = parts.join(' | ');
    
    // Build tooltip
    let tooltip = '';
    switch (health.status) {
        case HealthStatus.Healthy:
            tooltip = `✅ Alex Healthy\n${health.summary}`;
            break;
        case HealthStatus.Warning:
            tooltip = `⚠️ Alex Warning\n${health.summary}\n${health.issues.join('\n')}`;
            break;
        case HealthStatus.Error:
            tooltip = `❌ Alex Error\n${health.summary}\n${health.issues.join('\n')}`;
            break;
    }
    
    if (sessionInfo?.active) {
        tooltip += `\n\n${sessionInfo.isBreak ? '☕ Break' : '🍅 Focus'} session active`;
    }
    
    if (streakDays && streakDays > 0) {
        tooltip += `\n🔥 ${streakDays} day streak!`;
    }
    
    if (isProtected) {
        tooltip += '\n\n🔒 PROTECTED: Master Alex workspace - commands blocked';
    }
    
    tooltip += '\n\nClick for quick actions';

    return { text, tooltip, backgroundColor: bgColor };
}

/**
 * Clear the health cache
 */
export function clearHealthCache(): void {
    cachedResult = null;
    lastCheckTime = 0;
}
