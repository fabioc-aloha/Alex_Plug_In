import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

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

export async function runDreamProtocol(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a workspace folder to run Dream Protocol.');
        return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;

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
            'domain-knowledge/*.md'
        ];

        let allFiles: string[] = [];
        for (const pattern of patterns) {
            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern);
            allFiles = allFiles.concat(files.map(uri => uri.fsPath));
        }
        
        // Remove duplicates
        allFiles = [...new Set(allFiles)];

        if (allFiles.length === 0) {
            vscode.window.showWarningMessage("No memory files found. Did you initialize Alex?");
            return;
        }

        // 2. Parse Synapses
        const synapses: Synapse[] = [];
        const fileSet = new Set(allFiles.map(f => path.normalize(f).toLowerCase()));
        const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

        for (const file of allFiles) {
            const content = await fs.readFile(file, 'utf-8');
            const lines = content.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                let match;
                while ((match = synapseRegex.exec(line)) !== null) {
                    const targetName = match[1].trim();
                    // Resolve target path relative to current file or root? 
                    // The architecture seems to use relative paths or filenames. 
                    // We'll search for the filename in our fileSet.
                    
                    // 1. Check if file is in our known memory files list
                    let targetExists = Array.from(fileSet).some(f => f.endsWith(path.normalize(targetName).toLowerCase()));

                    // 2. If not found, check if it exists on disk (relative to workspace root)
                    if (!targetExists) {
                        // Direct check in root
                        const absolutePath = path.join(rootPath, targetName);
                        if (await fs.pathExists(absolutePath)) {
                            targetExists = true;
                        } else {
                            // Use VS Code's findFiles to search recursively
                            // We use a glob pattern to find the file anywhere
                            const found = await vscode.workspace.findFiles(new vscode.RelativePattern(workspaceFolders[0], `**/${targetName}`));
                            if (found.length > 0) {
                                targetExists = true;
                            }
                        }
                    }

                    // 3. If still not found, check relative to source file
                    if (!targetExists) {
                        const sourceDir = path.dirname(file);
                        const relativePath = path.join(sourceDir, targetName);
                        if (await fs.pathExists(relativePath)) {
                            targetExists = true;
                        }
                    }

                    // 4. Ignore known documentation placeholders
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
        const reportPath = path.join(rootPath, 'archive', `dream-report-${Date.now()}.md`);
        await fs.ensureDir(path.dirname(reportPath));
        await fs.writeFile(reportPath, reportContent);

        // 5. Show result
        if (brokenSynapses.length > 0) {
            vscode.window.showWarningMessage(`Dream Protocol complete. Found ${brokenSynapses.length} broken synapses. See report in archive.`);
        } else {
            vscode.window.showInformationMessage(`Dream Protocol complete. Neural network healthy (${synapses.length} synapses).`);
        }
        
        const doc = await vscode.workspace.openTextDocument(reportPath);
        await vscode.window.showTextDocument(doc);
    });
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
