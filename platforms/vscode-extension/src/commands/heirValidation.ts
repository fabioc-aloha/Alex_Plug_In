import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Heir Validation Result
 */
export interface HeirValidationResult {
    success: boolean;
    filesScanned: number;
    violations: PersonalDataViolation[];
    summary: string;
}

interface PersonalDataViolation {
    file: string;
    issue: string;
    severity: 'critical' | 'warning' | 'info';
    suggestion: string;
}

/**
 * Run LLM-based heir validation to detect personal data leakage
 * This catches semantic issues that regex patterns might miss
 */
export async function runHeirValidation(): Promise<HeirValidationResult | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return undefined;
    }

    // Find the heir .github folder
    const rootPath = workspaceFolders[0].uri.fsPath;
    const heirGithubPath = path.join(rootPath, 'platforms', 'vscode-extension', '.github');
    
    if (!await fs.pathExists(heirGithubPath)) {
        vscode.window.showErrorMessage(
            'Heir .github folder not found. Run build-extension-package.ps1 first.'
        );
        return undefined;
    }

    const result: HeirValidationResult = {
        success: true,
        filesScanned: 0,
        violations: [],
        summary: ''
    };

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Validating Heir Content...",
        cancellable: true
    }, async (progress, token) => {
        progress.report({ message: "Gathering files to validate..." });

        // Get key files to validate (most likely to contain personal data)
        const keyFiles = await gatherKeyFiles(heirGithubPath);
        result.filesScanned = keyFiles.length;

        if (keyFiles.length === 0) {
            result.summary = 'No files to validate';
            return;
        }

        progress.report({ message: `Analyzing ${keyFiles.length} files with LLM...` });

        // Validate with LLM
        const violations = await validateWithLLM(keyFiles, token);
        
        if (token.isCancellationRequested) {
            result.summary = 'Validation cancelled';
            return;
        }

        result.violations = violations;
        result.success = violations.filter(v => v.severity === 'critical').length === 0;
        result.summary = violations.length === 0 
            ? `✅ ${keyFiles.length} files validated - no personal data found`
            : `⚠️ Found ${violations.length} issue(s) in ${keyFiles.length} files`;
    });

    // Show results
    if (result.violations.length > 0) {
        const doc = await vscode.workspace.openTextDocument({
            content: formatValidationReport(result),
            language: 'markdown'
        });
        await vscode.window.showTextDocument(doc);
    } else {
        vscode.window.showInformationMessage(result.summary);
    }

    return result;
}

/**
 * Gather key files that are most likely to contain personal data
 */
async function gatherKeyFiles(heirGithubPath: string): Promise<{ path: string; content: string; relativePath: string }[]> {
    const files: { path: string; content: string; relativePath: string }[] = [];
    
    // Priority files to check
    const priorityPatterns = [
        'copilot-instructions.md',           // Main identity file
        'config/USER-PROFILE.md',            // User profile
        'config/user-profile.json',          // User profile JSON
        'instructions/*.md',                 // All instruction files
        'prompts/*.md',                      // All prompt files
        'skills/*/SKILL.md',                 // All skill definitions
        'skills/*/synapses.json',            // Synapse files with metadata
        'episodic/*.md'                      // Any episodic content
    ];
    
    // Collect all matching files
    for (const pattern of priorityPatterns) {
        const fullPattern = path.join(heirGithubPath, pattern);
        const matchingFiles = await findMatchingFiles(fullPattern);
        
        for (const filePath of matchingFiles) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const relativePath = path.relative(heirGithubPath, filePath).replace(/\\/g, '/');
                
                // Only include files with content (skip empty files)
                if (content.trim().length > 0) {
                    files.push({ path: filePath, content, relativePath });
                }
            } catch {
                // Skip files that can't be read
            }
        }
    }
    
    return files;
}

/**
 * Find files matching a glob-like pattern
 */
async function findMatchingFiles(pattern: string): Promise<string[]> {
    const results: string[] = [];
    const dir = path.dirname(pattern);
    const filePattern = path.basename(pattern);
    
    if (!await fs.pathExists(dir)) {
        return results;
    }
    
    if (filePattern.includes('*')) {
        // Handle wildcards
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const regex = new RegExp('^' + filePattern.replace(/\*/g, '.*') + '$');
        
        for (const entry of entries) {
            if (entry.isFile() && regex.test(entry.name)) {
                results.push(path.join(dir, entry.name));
            } else if (entry.isDirectory() && filePattern === '*') {
                // Handle skills/*/SKILL.md pattern
                const subPattern = pattern.replace('*/', entry.name + '/');
                const subResults = await findMatchingFiles(subPattern);
                results.push(...subResults);
            }
        }
    } else {
        // Exact match
        if (await fs.pathExists(pattern)) {
            results.push(pattern);
        }
    }
    
    return results;
}

/**
 * Validate files using LLM to detect personal data
 */
async function validateWithLLM(
    files: { path: string; content: string; relativePath: string }[],
    token: vscode.CancellationToken
): Promise<PersonalDataViolation[]> {
    // Get available models
    const models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
    if (!models || models.length === 0) {
        const allModels = await vscode.lm.selectChatModels();
        if (!allModels || allModels.length === 0) {
            vscode.window.showWarningMessage(
                'No LLM models available. Falling back to regex-only validation.'
            );
            return regexFallbackValidation(files);
        }
        models.push(allModels[0]);
    }
    
    const model = models[0];
    
    // Build file summaries for the prompt (truncate long files)
    const fileSummaries = files.map(f => {
        const truncatedContent = f.content.length > 2000 
            ? f.content.substring(0, 2000) + '\n... [truncated]'
            : f.content;
        return `## ${f.relativePath}\n\`\`\`\n${truncatedContent}\n\`\`\``;
    }).join('\n\n');
    
    const prompt = `You are auditing cognitive architecture files for a VS Code extension before public distribution.

TASK: Scan these files for personal data that should NOT be in a generic distribution package.

## What to look for:
1. **Developer names** - Full names of individuals (not publisher IDs like "fabioc-aloha")
2. **Personal emails** - Email addresses (unless they are support@, help@, etc.)
3. **Locations** - City names, addresses, personal locations
4. **Personal references** - Phrases like "my wife", "our team at [company]", specific dates of personal sessions
5. **Hardcoded user data** - Any content suggesting a specific user's identity/preferences are embedded
6. **Session-specific content** - Meditation records, personal chronicles, dated session files

## What is ACCEPTABLE (ignore these):
- Publisher IDs (e.g., fabioc-aloha) - these are public identifiers
- Generic examples or templates
- Placeholder text like "<!-- Your name here -->"
- Extension metadata (version, marketplace links)
- GitHub repository URLs

## Files to analyze:
${fileSummaries}

## Response Format (JSON only)
\`\`\`json
{
  "violations": [
    {
      "file": "relative/path/to/file.md",
      "issue": "Description of the personal data found",
      "severity": "critical|warning|info",
      "suggestion": "How to fix it"
    }
  ],
  "clean": true|false
}
\`\`\`

If no violations found, return: \`\`\`json\n{"violations": [], "clean": true}\n\`\`\`

RESPOND WITH ONLY THE JSON BLOCK.`;

    try {
        const messages = [vscode.LanguageModelChatMessage.User(prompt)];
        const response = await model.sendRequest(messages, {}, token);
        
        let responseText = '';
        for await (const chunk of response.text) {
            if (token.isCancellationRequested) {
                return [];
            }
            responseText += chunk;
        }
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                          responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            console.warn('[Alex] LLM response did not contain valid JSON');
            return regexFallbackValidation(files);
        }
        
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        return (parsed.violations || []).map((v: { file: string; issue: string; severity?: string; suggestion?: string }) => ({
            file: v.file,
            issue: v.issue,
            severity: (v.severity as 'critical' | 'warning' | 'info') || 'warning',
            suggestion: v.suggestion || 'Review and remove personal data'
        }));
        
    } catch (error) {
        console.error('[Alex] LLM validation failed:', error);
        return regexFallbackValidation(files);
    }
}

/**
 * Fallback regex-based validation when LLM is unavailable
 */
function regexFallbackValidation(
    files: { path: string; content: string; relativePath: string }[]
): PersonalDataViolation[] {
    const violations: PersonalDataViolation[] = [];
    
    const patterns = [
        { regex: /Fabio\s+Correa|Fabio's/gi, issue: "Developer's full name found", severity: 'critical' as const },
        { regex: /correax@|fabiocorrea@/gi, issue: "Personal email pattern found", severity: 'critical' as const },
        { regex: /Charlotte(?!,?\s*NC)/gi, issue: "Personal location reference", severity: 'warning' as const },
        { regex: /Alex\s*\+\s*Fabio/gi, issue: "Personal collaboration credit", severity: 'warning' as const },
        { regex: /The user's name is \*\*[^*]+\*\*/gi, issue: "Hardcoded user name", severity: 'critical' as const },
        { regex: /author["']?\s*:\s*["']Alex\s*\+\s*Fabio/gi, issue: "Personal author credit in metadata", severity: 'warning' as const }
    ];
    
    for (const file of files) {
        for (const pattern of patterns) {
            const matches = file.content.match(pattern.regex);
            if (matches) {
                violations.push({
                    file: file.relativePath,
                    issue: `${pattern.issue}: "${matches[0]}"`,
                    severity: pattern.severity,
                    suggestion: 'Remove or replace with generic placeholder'
                });
            }
        }
    }
    
    return violations;
}

/**
 * Format validation report as markdown
 */
function formatValidationReport(result: HeirValidationResult): string {
    const lines = [
        '# Heir Validation Report',
        '',
        `**Date**: ${new Date().toISOString()}`,
        `**Files Scanned**: ${result.filesScanned}`,
        `**Status**: ${result.success ? '✅ PASSED' : '❌ FAILED'}`,
        '',
        '---',
        ''
    ];
    
    if (result.violations.length === 0) {
        lines.push('## ✅ No Issues Found');
        lines.push('');
        lines.push('The heir package is clean and ready for distribution.');
    } else {
        lines.push('## Issues Detected');
        lines.push('');
        
        const critical = result.violations.filter(v => v.severity === 'critical');
        const warnings = result.violations.filter(v => v.severity === 'warning');
        const info = result.violations.filter(v => v.severity === 'info');
        
        if (critical.length > 0) {
            lines.push('### 🔴 Critical (must fix before release)');
            lines.push('');
            for (const v of critical) {
                lines.push(`- **${v.file}**`);
                lines.push(`  - Issue: ${v.issue}`);
                lines.push(`  - Fix: ${v.suggestion}`);
                lines.push('');
            }
        }
        
        if (warnings.length > 0) {
            lines.push('### 🟡 Warnings (should fix)');
            lines.push('');
            for (const v of warnings) {
                lines.push(`- **${v.file}**`);
                lines.push(`  - Issue: ${v.issue}`);
                lines.push(`  - Fix: ${v.suggestion}`);
                lines.push('');
            }
        }
        
        if (info.length > 0) {
            lines.push('### 🔵 Info (review recommended)');
            lines.push('');
            for (const v of info) {
                lines.push(`- **${v.file}**: ${v.issue}`);
            }
        }
    }
    
    return lines.join('\n');
}

/**
 * Register the heir validation command
 */
export function registerHeirValidationCommand(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.validateHeir', async () => {
            await runHeirValidation();
        })
    );
}
