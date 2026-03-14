import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../../shared/workspaceFs';
import { searchGlobalKnowledge } from '../globalKnowledge';
import { IMemorySearchParams } from './types';

/**
 * Memory Search Tool - Searches Alex's memory files for relevant information
 */
export class MemorySearchTool implements vscode.LanguageModelTool<IMemorySearchParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IMemorySearchParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Searching Alex memory for: ${options.input.query}`,
            confirmationMessages: {
                title: 'Search Alex Memory',
                message: new vscode.MarkdownString(
                    `Search Alex cognitive architecture memory files for: **${options.input.query}**?\n\n` +
                    `Memory type: ${options.input.memoryType || 'all'}`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IMemorySearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        // Update welcome view avatar — memory search = learning state
        vscode.commands.executeCommand('alex.setCognitiveState', 'learning');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open.')
            ]);
        }

        const query = options.input.query.toLowerCase();
        const memoryType = options.input.memoryType || 'all';
        
        const patterns: string[] = [];
        if (memoryType === 'all' || memoryType === 'procedural') {
            patterns.push('.github/instructions/*.md');
        }
        if (memoryType === 'all' || memoryType === 'episodic') {
            patterns.push('.github/prompts/*.md');
            patterns.push('.github/episodic/*.md');
        }
        if (memoryType === 'all' || memoryType === 'domain') {
            patterns.push('.github/skills/*/SKILL.md');
            patterns.push('.github/domain-knowledge/*.md');  // Legacy
        }

        const results: { file: string; matches: string[] }[] = [];

        for (const pattern of patterns) {
            // Check for cancellation
            if (token.isCancellationRequested) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart('Operation cancelled.')
                ]);
            }

            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern);
            
            for (const file of files) {
                // Check for cancellation before processing each file
                if (token.isCancellationRequested) {
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart('Operation cancelled.')
                    ]);
                }
                try {
                    const content = await workspaceFs.readFile(file.fsPath);
                    const lines = content.split('\n');
                    const matches: string[] = [];
                    
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].toLowerCase().includes(query)) {
                            // Get context (line before and after)
                            const start = Math.max(0, i - 1);
                            const end = Math.min(lines.length - 1, i + 1);
                            const context = lines.slice(start, end + 1).join('\n');
                            matches.push(`Line ${i + 1}:\n${context}`);
                        }
                    }
                    
                    if (matches.length > 0) {
                        results.push({
                            file: path.basename(file.fsPath),
                            matches: matches.slice(0, 3) // Limit to first 3 matches per file
                        });
                    }
                } catch (err) {
                    // Skip unreadable files
                }
            }
        }

        // === UNCONSCIOUS MIND: Auto-fallback to Global Knowledge ===
        // If local search found nothing, automatically search global knowledge
        let globalResults: { entry: { title: string; type: string; category: string; tags: string[]; summary: string }; relevance: number }[] = [];
        if (results.length === 0) {
            try {
                globalResults = await searchGlobalKnowledge(options.input.query, { limit: 5 });
            } catch {
                // Silently continue if global search fails
            }
        }

        if (results.length === 0 && globalResults.length === 0) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`No matches found for "${options.input.query}" in local ${memoryType} memory or global knowledge base.`)
            ]);
        }

        let resultText = '';
        
        // Local results
        if (results.length > 0) {
            resultText += `## Local Memory Results for "${options.input.query}"\n\n`;
            resultText += `Found ${results.length} file(s) with matches:\n\n`;

            for (const result of results.slice(0, 5)) { // Limit to 5 files
                resultText += `### ${result.file}\n`;
                for (const match of result.matches) {
                    resultText += `\`\`\`\n${match}\n\`\`\`\n`;
                }
                resultText += '\n';
            }
        }

        // Global knowledge results (automatic fallback or supplement)
        if (globalResults.length > 0) {
            if (results.length === 0) {
                resultText += `## 🌐 Global Knowledge Results (Unconscious Retrieval)\n\n`;
                resultText += `*Local search found nothing. Automatically searched cross-project knowledge:*\n\n`;
            } else {
                resultText += `## 🌐 Related Global Knowledge\n\n`;
            }
            
            for (const { entry } of globalResults.slice(0, 3)) {
                const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
                resultText += `### ${typeEmoji} ${entry.title}\n`;
                resultText += `- **Type**: ${entry.type} | **Category**: ${entry.category}\n`;
                resultText += `- **Tags**: ${entry.tags.join(', ')}\n`;
                resultText += `- **Summary**: ${entry.summary}\n\n`;
            }
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(resultText)
        ]);
    }
}
