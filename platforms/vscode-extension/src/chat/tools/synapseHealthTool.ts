import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../../shared/workspaceFs';
import { createSynapseRegex } from '../../shared/utils';
import { assertDefined } from '../../shared/assertions';
import { ISynapseHealthParams } from './types';

/**
 * Synapse Health Tool - Validates synaptic connections in Alex memory files
 */
export class SynapseHealthTool implements vscode.LanguageModelTool<ISynapseHealthParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ISynapseHealthParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Scanning synaptic connections...',
            confirmationMessages: {
                title: 'Synapse Health Check',
                message: new vscode.MarkdownString(
                    `Scan Alex cognitive architecture for synaptic connection health?\n\n` +
                    `This will:\n` +
                    `- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)\n` +
                    `- Validate synapse connections\n` +
                    `- Report broken or orphaned links`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ISynapseHealthParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        // NASA R5: Validate inputs
        assertDefined(options, 'Tool invocation options required');
        assertDefined(token, 'CancellationToken required');
        
        // Update welcome view avatar — synapse health = reviewing state
        vscode.commands.executeCommand('alex.setCognitiveState', 'reviewing');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Cannot scan for synaptic connections.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        
        // Scan for memory files
        const patterns = [
            '.github/copilot-instructions.md',
            '.github/instructions/*.md',
            '.github/prompts/*.md',
            '.github/episodic/*.md',
            '.github/skills/*/SKILL.md',
            '.github/domain-knowledge/*.md'  // Legacy - kept for backward compatibility
        ];

        let totalFiles = 0;
        let totalSynapses = 0;
        let brokenSynapses = 0;
        const issues: string[] = [];

        // Create fresh regex instance to avoid state leakage
        const synapseRegex = createSynapseRegex();

        // Pre-build a set of all known markdown files for fast lookup
        // This avoids calling findFiles for each synapse (major performance fix)
        // Use targeted patterns to avoid hitting limits on large workspaces (2000+ files)
        const targetPatterns = [
            '.github/**/*.md',           // Memory files, config
            'alex_docs/**/*.md',         // Documentation
            'platforms/**/.github/**/*.md', // Heir memory files
            '*.md'                        // Root-level files
        ];
        
        const allMdFiles: vscode.Uri[] = [];
        for (const targetPattern of targetPatterns) {
            const files = await vscode.workspace.findFiles(
                new vscode.RelativePattern(workspaceFolders[0], targetPattern),
                '**/node_modules/**',
                1000  // Per-pattern limit
            );
            allMdFiles.push(...files);
        }
        const knownFileBasenames = new Set(allMdFiles.map(f => path.basename(f.fsPath).toLowerCase()));

        for (const pattern of patterns) {
            // Check for cancellation
            if (token.isCancellationRequested) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart('Operation cancelled.')
                ]);
            }

            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern, null, 100);
            
            for (const file of files) {
                // Check for cancellation before processing each file
                if (token.isCancellationRequested) {
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart('Operation cancelled.')
                    ]);
                }
                totalFiles++;
                try {
                    const content = await workspaceFs.readFile(file.fsPath);
                    const lines = content.split('\n');
                    
                    let inCodeBlock = false;
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (line.trim().startsWith('```')) {
                            inCodeBlock = !inCodeBlock;
                            continue;
                        }
                        if (inCodeBlock) { continue; }
                        
                        let match;
                        while ((match = synapseRegex.exec(line)) !== null) {
                            totalSynapses++;
                            const targetName = match[1].trim();
                            const targetBasename = path.basename(targetName).toLowerCase();
                            
                            // Fast lookup in pre-built file index instead of findFiles per synapse
                            if (!knownFileBasenames.has(targetBasename)) {
                                brokenSynapses++;
                                if (options.input.detailed) {
                                    issues.push(`- ${path.basename(file.fsPath)}:${i + 1} → ${targetName} (not found)`);
                                }
                            }
                        }
                    }
                } catch (err) {
                    // Skip unreadable files
                }
            }
        }

        const healthStatus = brokenSynapses === 0 ? 'EXCELLENT' : 
                            brokenSynapses < 5 ? 'GOOD' : 
                            brokenSynapses < 10 ? 'NEEDS ATTENTION' : 'CRITICAL';

        let result = `## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${totalFiles} |
| Total Synapses | ${totalSynapses} |
| Broken Connections | ${brokenSynapses} |
| Health Status | ${healthStatus} |
`;

        if (options.input.detailed && issues.length > 0) {
            result += `\n### Issues Found\n${issues.join('\n')}`;
        }

        if (brokenSynapses > 0) {
            result += `\n\n**Recommendation**: Run \`Alex: Dream (Neural Maintenance)\` to auto-repair broken connections.`;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}
