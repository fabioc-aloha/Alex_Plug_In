import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getAlexWorkspaceFolder } from '../shared/utils';

interface Synapse {
    sourceFile: string;
    targetFile: string;
    strength: string;
    type: string;
    direction: string;
    condition: string;
    line: number;
    isValid: boolean;
    repaired?: boolean;
    newTarget?: string;
}

interface DreamReport {
    timestamp: string;
    totalFiles: number;
    totalSynapses: number;
    brokenSynapses: Synapse[];
    repairedSynapses: Synapse[];
    orphanedFiles: string[];
}

/**
 * Result returned by runDreamProtocol for programmatic callers
 */
export interface DreamResult {
    success: boolean;
    totalFiles: number;
    totalSynapses: number;
    brokenCount: number;
    repairedCount: number;
    reportPath?: string;
}

/**
 * Options for running dream protocol
 */
export interface DreamOptions {
    /** If true, don't show result dialogs (for programmatic callers) */
    silent?: boolean;
}

/* eslint-disable @typescript-eslint/naming-convention */
const consolidatedMappings: { [key: string]: string } = {
    "enhanced-meditation-protocol.prompt.md": "unified-meditation-protocols.prompt.md",
    "meditation-consolidation.prompt.md": "unified-meditation-protocols.prompt.md",
    "dream-meditation-distinction.prompt.md": "unified-meditation-protocols.prompt.md",
    "alex-finch-integration.prompt.md": "alex-identity-integration.instructions.md",
    "self-identity-integration.prompt.md": "alex-identity-integration.instructions.md",
    "character-driven-development.instructions.md": "alex-identity-integration.instructions.md",
    "unified-consciousness.instructions.md": "alex-identity-integration.instructions.md",
    "dream-protocol-integration.prompt.md": "dream-state-automation.instructions.md",
    "dream-protocol-mastery-meditation.prompt.md": "dream-state-automation.instructions.md"
};
/* eslint-enable @typescript-eslint/naming-convention */

export async function runDreamProtocol(context: vscode.ExtensionContext, options?: DreamOptions): Promise<DreamResult | undefined> {
    const silent = options?.silent ?? false;
    
    // Use smart workspace folder detection for multi-folder workspaces
    const workspaceResult = await getAlexWorkspaceFolder(true); // true = require Alex installed
    
    if (!workspaceResult.found) {
        if (workspaceResult.cancelled) {
            return undefined; // User cancelled folder selection
        }
        if (!silent) {
            vscode.window.showErrorMessage(
                workspaceResult.error || 'No workspace folder open. Please open a project with Alex installed (File → Open Folder), then run Dream Protocol.',
                { modal: true }
            );
        }
        return undefined;
    }

    const rootPath = workspaceResult.rootPath!;
    const workspaceFolder = workspaceResult.workspaceFolder!;

    // Variables to capture result from within withProgress
    let dreamResult: DreamResult | undefined;
    let reportPath: string | undefined;

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Running Dream Protocol...",
        cancellable: false
    }, async (progress: vscode.Progress<{ message?: string; increment?: number }>) => {
        progress.report({ message: "Scanning neural network..." });

        // 1. Find all memory files
        const patterns = [
            '.github/copilot-instructions.md',
            '.github/instructions/*.md',
            '.github/prompts/*.md',
            '.github/episodic/*.md',
            '.github/skills/*/SKILL.md',
            '.github/domain-knowledge/*.md'  // Legacy - kept for backward compatibility
        ];

        let allFiles: string[] = [];
        for (const pattern of patterns) {
            const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
            const files = await vscode.workspace.findFiles(relativePattern);
            allFiles = allFiles.concat(files.map(uri => uri.fsPath));
        }
        
        // Remove duplicates
        allFiles = [...new Set(allFiles)];

        if (allFiles.length === 0) {
            if (!silent) {
                const result = await vscode.window.showWarningMessage(
                    'No Alex memory files found in this workspace.\n\nWould you like to initialize Alex Cognitive Architecture now?',
                    'Initialize Alex',
                    'Cancel'
                );
                if (result === 'Initialize Alex') {
                    await vscode.commands.executeCommand('alex.initialize');
                }
            }
            dreamResult = { success: false, totalFiles: 0, totalSynapses: 0, brokenCount: 0, repairedCount: 0 };
            return;
        }

        // 2. Parse Synapses (skip code blocks to avoid false positives)
        // Performance optimization: Build a comprehensive file index ONCE upfront
        const synapses: Synapse[] = [];
        const fileSet = new Set(allFiles.map(f => path.normalize(f).toLowerCase()));
        const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

        // Pre-build comprehensive file index for fast lookups (avoid per-synapse findFiles)
        progress.report({ message: "Building file index..." });
        const allMdFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolder, '**/*.md'),
            '**/node_modules/**',
            500  // Limit to prevent scanning huge workspaces
        );
        const knownFileBasenames = new Set(allMdFiles.map(f => path.basename(f.fsPath).toLowerCase()));

        progress.report({ message: "Scanning synapses..." });
        for (const file of allFiles) {
            let content: string;
            try {
                content = await fs.readFile(file, 'utf-8');
            } catch (readError) {
                console.error(`Failed to read file ${file}:`, readError);
                continue;  // Skip unreadable files
            }
            const lines = content.split('\n');
            
            let inCodeBlock = false;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Track code block state to skip false positives
                if (line.trim().startsWith('```')) {
                    inCodeBlock = !inCodeBlock;
                    continue;
                }
                if (inCodeBlock) {
                    continue;
                }
                
                let match;
                while ((match = synapseRegex.exec(line)) !== null) {
                    const targetName = match[1].trim();
                    const targetBasename = path.basename(targetName).toLowerCase();
                    
                    // 1. Check if file is in our known memory files list
                    let targetExists = Array.from(fileSet).some(f => f.endsWith(path.normalize(targetName).toLowerCase()));

                    // 2. If not found, use pre-built index for fast lookup
                    if (!targetExists) {
                        targetExists = knownFileBasenames.has(targetBasename);
                    }

                    // 3. If still not found, check direct paths (fast fs.pathExists)
                    if (!targetExists) {
                        const absolutePath = path.join(rootPath, targetName);
                        if (await fs.pathExists(absolutePath)) {
                            targetExists = true;
                        }
                    }

                    // 4. If still not found, check relative to source file
                    if (!targetExists) {
                        const sourceDir = path.dirname(file);
                        const relativePath = path.join(sourceDir, targetName);
                        if (await fs.pathExists(relativePath)) {
                            targetExists = true;
                        }
                    }

                    // 5. Ignore known documentation placeholders
                    const ignoredFiles = ['target-file.md', 'CHANGELOG.md'];
                    if (ignoredFiles.includes(targetName)) {
                        targetExists = true;
                    }

                    synapses.push({
                        sourceFile: file,
                        targetFile: targetName,
                        strength: match[2].trim(),
                        type: match[3]?.trim() || 'association',
                        direction: match[4]?.trim() || 'unidirectional',
                        condition: match[5]?.trim(),
                        line: i + 1,
                        isValid: targetExists
                    });
                }
            }
        }

        // 3. Analyze
        let brokenSynapses = synapses.filter(s => !s.isValid);
        const referencedFiles = new Set(synapses.map(s => s.targetFile.toLowerCase()));
        
        // 3.5 Repair Synapses
        const repairedSynapses: Synapse[] = [];
        const remainingBrokenSynapses: Synapse[] = [];

        for (const synapse of brokenSynapses) {
            const targetName = path.basename(synapse.targetFile); // Handle paths if present
            if (consolidatedMappings[targetName]) {
                const newTarget = consolidatedMappings[targetName];
                try {
                    const fileContent = await fs.readFile(synapse.sourceFile, 'utf-8');
                    // Escape special characters for regex
                    const escapedTarget = synapse.targetFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`\\[${escapedTarget}\\]`, 'g');
                    
                    if (regex.test(fileContent)) {
                        const newContent = fileContent.replace(regex, `[${newTarget}]`);
                        await fs.writeFile(synapse.sourceFile, newContent, 'utf-8');
                        
                        synapse.repaired = true;
                        synapse.newTarget = newTarget;
                        repairedSynapses.push(synapse);
                    } else {
                        remainingBrokenSynapses.push(synapse);
                    }
                } catch (error) {
                    console.error(`Failed to repair synapse in ${synapse.sourceFile}:`, error);
                    remainingBrokenSynapses.push(synapse);
                }
            } else {
                remainingBrokenSynapses.push(synapse);
            }
        }
        
        brokenSynapses = remainingBrokenSynapses;

        // 4. Generate Report
        const report: DreamReport = {
            timestamp: new Date().toISOString(),
            totalFiles: allFiles.length,
            totalSynapses: synapses.length,
            brokenSynapses: brokenSynapses,
            repairedSynapses: repairedSynapses,
            orphanedFiles: []
        };

        const reportContent = generateReportMarkdown(report);
        reportPath = path.join(rootPath, '.github', 'episodic', `dream-report-${Date.now()}.md`);
        await fs.ensureDir(path.dirname(reportPath));
        await fs.writeFile(reportPath, reportContent);

        // Set result for return
        dreamResult = {
            success: brokenSynapses.length === 0,
            totalFiles: allFiles.length,
            totalSynapses: synapses.length,
            brokenCount: brokenSynapses.length,
            repairedCount: repairedSynapses.length,
            reportPath: reportPath
        };
    });

    // 5. Show result (only if not silent)
    if (!silent && dreamResult && reportPath) {
        if (dreamResult.brokenCount > 0) {
            const result = await vscode.window.showWarningMessage(
                `⚠️ Dream Protocol found ${dreamResult.brokenCount} broken synapse${dreamResult.brokenCount > 1 ? 's' : ''}!\n\n` +
                `${dreamResult.repairedCount > 0 ? `✅ Auto-repaired: ${dreamResult.repairedCount}\n` : ''}` +
                `❌ Need manual repair: ${dreamResult.brokenCount}\n\n` +
                'Review the report for details on broken connections.',
                'View Report',
                'Close'
            );
            if (result === 'View Report') {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            }
        } else {
            const healthStatus = dreamResult.totalSynapses > 50 ? 'excellent' : dreamResult.totalSynapses > 20 ? 'good' : 'developing';
            const result = await vscode.window.showInformationMessage(
                `✅ Neural network is healthy!\n\n` +
                `📊 Statistics:\n` +
                `• ${dreamResult.totalFiles} memory files\n` +
                `• ${dreamResult.totalSynapses} active synapses\n` +
                `${dreamResult.repairedCount > 0 ? `• ${dreamResult.repairedCount} auto-repaired\n` : ''}` +
                `• Network health: ${healthStatus}`,
                'View Full Report',
                'Close'
            );
            if (result === 'View Full Report') {
                const doc = await vscode.workspace.openTextDocument(reportPath);
                await vscode.window.showTextDocument(doc);
            }
        }
    }

    return dreamResult;
}

function generateReportMarkdown(report: DreamReport): string {
    return `# Dream Protocol Report
**Timestamp**: ${report.timestamp}
**Status**: ${report.brokenSynapses.length === 0 ? 'HEALTHY' : 'ATTENTION REQUIRED'}

## Statistics
- **Total Memory Files**: ${report.totalFiles}
- **Total Synapses**: ${report.totalSynapses}
- **Broken Connections**: ${report.brokenSynapses.length}
- **Repaired Connections**: ${report.repairedSynapses.length}

## Repaired Synapses
${report.repairedSynapses.length === 0 ? '_None._' : report.repairedSynapses.map(s => 
`- **Source**: ${path.basename(s.sourceFile)}:${s.line}
  - **Old Target**: ${s.targetFile}
  - **New Target**: ${s.newTarget} (Auto-repaired)`
).join('\n')}

## Broken Synapses
${report.brokenSynapses.length === 0 ? '_None detected._' : report.brokenSynapses.map(s => 
`- **Source**: ${path.basename(s.sourceFile)}:${s.line}
  - **Target**: ${s.targetFile} (Not found)
  - **Condition**: "${s.condition}"`
).join('\n')}

## Recommendations
${report.brokenSynapses.length > 0 ? '- [ ] Repair remaining broken links manually.' : '- [x] System is optimized.'}
`;
}
