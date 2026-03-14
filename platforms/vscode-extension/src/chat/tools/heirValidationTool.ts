import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../../shared/workspaceFs';
import { IHeirValidationParams } from './types';

/**
 * Heir Validation Tool - Scans heir content for personal data and quality issues
 * 
 * This tool returns structured content for the LLM (Claude) to analyze semantically.
 * Much more robust than regex-only validation as Claude can understand context.
 */
export class HeirValidationTool implements vscode.LanguageModelTool<IHeirValidationParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IHeirValidationParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        const scope = options.input.scope || 'all';
        return {
            invocationMessage: `Scanning heir content for validation (scope: ${scope})...`,
            confirmationMessages: {
                title: 'Heir Content Validation',
                message: new vscode.MarkdownString(
                    `Scan heir cognitive architecture content for quality validation?\n\n` +
                    `This will:\n` +
                    `- Gather all heir .github/ content\n` +
                    `- Check for personal data patterns\n` +
                    `- Return content for semantic analysis`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IHeirValidationParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        // Update welcome view avatar — heir validation = reviewing state
        vscode.commands.executeCommand('alex.setCognitiveState', 'reviewing');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const heirGithubPath = path.join(rootPath, 'platforms', 'vscode-extension', '.github');
        
        if (!await workspaceFs.pathExists(heirGithubPath)) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    '❌ Heir .github folder not found.\n\n' +
                    'Run `build-extension-package.ps1` first to sync Master → Heir content.'
                )
            ]);
        }

        const scope = options.input.scope || 'all';
        const includeContent = options.input.includeContent !== false;
        
        // Gather files based on scope
        const patterns: string[] = [];
        switch (scope) {
            case 'instructions':
                patterns.push('instructions/*.md');
                break;
            case 'prompts':
                patterns.push('prompts/*.md');
                break;
            case 'skills':
                patterns.push('skills/*/SKILL.md');
                patterns.push('skills/*/synapses.json');
                break;
            case 'config':
                patterns.push('config/*.json');
                patterns.push('config/*.md');
                break;
            default: // 'all'
                patterns.push('copilot-instructions.md');
                patterns.push('instructions/*.md');
                patterns.push('prompts/*.md');
                patterns.push('skills/*/SKILL.md');
                patterns.push('skills/*/synapses.json');
                patterns.push('config/*.json');
                patterns.push('config/*.md');
                patterns.push('episodic/*.md');
        }

        // Collect files
        const files: { path: string; content: string; regexViolations: string[] }[] = [];
        let totalFiles = 0;
        let totalViolations = 0;
        
        // Personal data regex patterns (quick pre-filter)
        const personalPatterns = [
            { regex: /Fabio\s+Correa|Fabio's/gi, desc: "Developer's full name" },
            { regex: /correax@|fabiocorrea@/gi, desc: "Personal email" },
            { regex: /Charlotte(?!,?\s*NC)/gi, desc: "Personal location" },
            { regex: /Alex\s*\+\s*Fabio/gi, desc: "Personal collaboration credit" },
            { regex: /The user's name is \*\*[^*]+\*\*/gi, desc: "Hardcoded user name" },
            { regex: /author["']?\s*:\s*["']Alex\s*\+\s*Fabio/gi, desc: "Personal author in metadata" }
        ];

        for (const pattern of patterns) {
            if (token.isCancellationRequested) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart('Operation cancelled.')
                ]);
            }

            const fullPattern = path.join(heirGithubPath, pattern);
            const matchingFiles = await this.findMatchingFiles(fullPattern);
            
            for (const filePath of matchingFiles) {
                totalFiles++;
                try {
                    const content = await workspaceFs.readFile(filePath);
                    const relativePath = path.relative(heirGithubPath, filePath).replace(/\\/g, '/');
                    
                    // Check regex patterns
                    const violations: string[] = [];
                    for (const p of personalPatterns) {
                        const match = content.match(p.regex);
                        if (match) {
                            violations.push(`${p.desc}: "${match[0]}"`);
                            totalViolations++;
                        }
                    }
                    
                    // Only include files with content (truncate very large files)
                    if (includeContent) {
                        const truncatedContent = content.length > 3000 
                            ? content.substring(0, 3000) + '\n\n... [truncated for LLM analysis]'
                            : content;
                        files.push({ 
                            path: relativePath, 
                            content: truncatedContent,
                            regexViolations: violations
                        });
                    } else if (violations.length > 0) {
                        files.push({ 
                            path: relativePath, 
                            content: '[content not included]',
                            regexViolations: violations
                        });
                    }
                } catch {
                    // Skip unreadable files
                }
            }
        }

        // Build result
        let result = `# Heir Validation Scan Results\n\n`;
        result += `**Scope**: ${scope}\n`;
        result += `**Files Scanned**: ${totalFiles}\n`;
        result += `**Regex Violations Found**: ${totalViolations}\n\n`;
        
        if (totalViolations > 0) {
            result += `## ⚠️ Pre-Filter Violations (Regex)\n\n`;
            result += `These were caught by quick regex patterns:\n\n`;
            for (const f of files.filter(f => f.regexViolations.length > 0)) {
                result += `### ${f.path}\n`;
                for (const v of f.regexViolations) {
                    result += `- 🔴 ${v}\n`;
                }
                result += '\n';
            }
        }
        
        result += `---\n\n`;
        result += `## Instructions for LLM Semantic Analysis\n\n`;
        result += `You are Claude analyzing heir content for a VS Code extension distribution.\n\n`;
        result += `**Scan the content below for:**\n`;
        result += `1. Personal names (not publisher IDs like "fabioc-aloha" which are OK)\n`;
        result += `2. Personal email addresses\n`;
        result += `3. Location references (city names, addresses)\n`;
        result += `4. Dated session content (meditation-2026-*, chronicle-*, etc.)\n`;
        result += `5. Personal collaboration credits ("Alex + Fabio", "with Fabio")\n`;
        result += `6. Hardcoded user preferences that should be blank\n`;
        result += `7. Any other content inappropriate for generic distribution\n\n`;
        result += `**ACCEPTABLE (do not flag):**\n`;
        result += `- Publisher IDs (fabioc-aloha)\n`;
        result += `- GitHub repo URLs\n`;
        result += `- Template placeholders (<!-- Your name -->)\n`;
        result += `- Empty/default user profile fields\n\n`;
        
        if (includeContent) {
            result += `---\n\n## File Contents for Analysis\n\n`;
            
            // Prioritize key files
            const keyFiles = ['copilot-instructions.md', 'config/user-profile.json'];
            const prioritized = files.sort((a, b) => {
                const aKey = keyFiles.findIndex(k => a.path.includes(k));
                const bKey = keyFiles.findIndex(k => b.path.includes(k));
                if (aKey >= 0 && bKey < 0) { return -1; }
                if (bKey >= 0 && aKey < 0) { return 1; }
                return a.path.localeCompare(b.path);
            });
            
            for (const f of prioritized.slice(0, 20)) {  // Limit to 20 files for context
                result += `### 📄 ${f.path}\n`;
                result += `\`\`\`\n${f.content}\n\`\`\`\n\n`;
            }
            
            if (prioritized.length > 20) {
                result += `\n*... and ${prioritized.length - 20} more files (use scope filter for detailed analysis)*\n`;
            }
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
    
    private async findMatchingFiles(pattern: string): Promise<string[]> {
        const results: string[] = [];
        const dir = path.dirname(pattern);
        const filePattern = path.basename(pattern);
        
        if (!await workspaceFs.pathExists(dir)) {
            return results;
        }
        
        if (filePattern.includes('*')) {
            const entries = await workspaceFs.readDirectory(dir);
            const regex = new RegExp('^' + filePattern.replace(/\*/g, '.*') + '$');
            
            for (const [name, fileType] of entries) {
                if (fileType === vscode.FileType.File && regex.test(name)) {
                    results.push(path.join(dir, name));
                } else if (fileType === vscode.FileType.Directory && filePattern === '*') {
                    // Handle skills/*/SKILL.md pattern
                    const subFiles = await this.findMatchingFiles(pattern.replace('*/', name + '/'));
                    results.push(...subFiles);
                }
            }
        } else {
            if (await workspaceFs.pathExists(pattern)) {
                results.push(pattern);
            }
        }
        
        return results;
    }
}
