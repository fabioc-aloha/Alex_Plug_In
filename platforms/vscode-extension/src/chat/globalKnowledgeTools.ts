/**
 * globalKnowledgeTools.ts - VS Code Language Model Tool implementations
 *
 * Contains LM tool classes for global knowledge search, save insight,
 * and promote knowledge operations.
 */
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
    GlobalKnowledgeCategory,
} from '../shared/constants';
import {
    ensureGlobalKnowledgeDirectories,
    ensureProjectRegistry,
    getAlexGlobalPath,
    getRemoteRepoConfig,
} from './globalKnowledge';
import {
    searchGlobalKnowledge,
    createGlobalInsight,
    promoteToGlobalKnowledge,
    getGlobalKnowledgeSummary,
} from './globalKnowledgeOps';

/**
 * Input parameters for Global Knowledge Search tool
 */
export interface IGlobalKnowledgeSearchParams {
    query: string;
    type?: 'pattern' | 'insight' | 'all';
    category?: string;
    tags?: string;
}

/**
 * Global Knowledge Search Tool - Search across all projects' accumulated wisdom
 */
export class GlobalKnowledgeSearchTool implements vscode.LanguageModelTool<IGlobalKnowledgeSearchParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IGlobalKnowledgeSearchParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Searching global knowledge for: ${options.input.query}`,
            confirmationMessages: {
                title: 'Search Global Knowledge',
                message: new vscode.MarkdownString(
                    `Search Alex's global knowledge base across all projects for: **${options.input.query}**?\n\n` +
                    `This searches patterns and insights learned from all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IGlobalKnowledgeSearchParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const { query, type, category, tags } = options.input;
        
        const results = await searchGlobalKnowledge(query, {
            type: type as 'pattern' | 'insight' | 'all' | undefined,
            category: category as GlobalKnowledgeCategory | undefined,
            tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
            limit: 10
        });

        if (results.length === 0) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `No global knowledge found matching "${query}".\n\n` +
                    `You can save new knowledge using:\n` +
                    `- \`@alex /saveinsight\` to save a learning from the current project\n` +
                    `- \`@alex /promote\` to promote project-local knowledge to global`
                )
            ]);
        }

        let result = `## Global Knowledge Search Results\n\n`;
        result += `Found **${results.length}** relevant entries for "${query}":\n\n`;

        for (const { entry /*, relevance*/ } of results) {
            const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
            result += `### ${typeEmoji} ${entry.title}\n`;
            result += `- **Type**: ${entry.type} | **Category**: ${entry.category}\n`;
            result += `- **Tags**: ${entry.tags.join(', ')}\n`;
            if (entry.sourceProject) {
                result += `- **Source**: ${entry.sourceProject}\n`;
            }
            result += `- **Summary**: ${entry.summary}\n`;
            result += `- **File**: \`${entry.filePath}\`\n\n`;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Input parameters for Save Insight tool
 */
export interface ISaveInsightParams {
    title: string;
    insight: string;
    category?: string;
    tags?: string;
    problem?: string;
    solution?: string;
}

/**
 * Save Insight Tool - Save a new learning to global knowledge base
 */
export class SaveInsightTool implements vscode.LanguageModelTool<ISaveInsightParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ISaveInsightParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Saving insight: ${options.input.title}`,
            confirmationMessages: {
                title: 'Save Global Insight',
                message: new vscode.MarkdownString(
                    `Save this insight to Alex's global knowledge base?\n\n` +
                    `**Title**: ${options.input.title}\n\n` +
                    `This will be available across all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ISaveInsightParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const { title, insight, category, tags, problem, solution } = options.input;
        
        // Get current project name
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const sourceProject = workspaceFolders 
            ? path.basename(workspaceFolders[0].uri.fsPath)
            : undefined;

        const entry = await createGlobalInsight(
            title,
            insight,
            (category || 'general') as GlobalKnowledgeCategory,
            tags ? tags.split(',').map(t => t.trim()) : [],
            sourceProject,
            problem,
            solution
        );

        const result = `## ✅ Insight Saved to Global Knowledge

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(', ')}  
**Source Project**: ${entry.sourceProject || 'Unknown'}  
**File**: \`${entry.filePath}\`

This insight is now available across all your projects.
*🧠 Unconscious sync triggered - backing up to cloud automatically.*
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Input parameters for Promote Knowledge tool
 */
export interface IPromoteKnowledgeParams {
    filePath: string;
    category?: string;
    additionalTags?: string;
}

/**
 * Promote Knowledge Tool - Promote project-local DK file to global knowledge
 */
export class PromoteKnowledgeTool implements vscode.LanguageModelTool<IPromoteKnowledgeParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IPromoteKnowledgeParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Promoting ${path.basename(options.input.filePath)} to global knowledge`,
            confirmationMessages: {
                title: 'Promote to Global Knowledge',
                message: new vscode.MarkdownString(
                    `Promote this project-local knowledge file to global knowledge?\n\n` +
                    `**File**: ${options.input.filePath}\n\n` +
                    `This will make it searchable and available across all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IPromoteKnowledgeParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const { filePath, category, additionalTags } = options.input;
        
        // Verify file exists
        if (!await fs.pathExists(filePath)) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`❌ File not found: ${filePath}`)
            ]);
        }

        const entry = await promoteToGlobalKnowledge(
            filePath,
            (category || 'general') as GlobalKnowledgeCategory,
            additionalTags ? additionalTags.split(',').map(t => t.trim()) : []
        );

        if (!entry) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`❌ Failed to promote file to global knowledge.`)
            ]);
        }

        const result = `## ✅ Knowledge Promoted to Global

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(', ')}  
**Global File**: \`${entry.filePath}\`

This knowledge is now available across all your projects!
*🧠 Unconscious sync triggered - backing up to cloud automatically.*
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Global Knowledge Status Tool - Show summary of the global knowledge base
 */
export class GlobalKnowledgeStatusTool implements vscode.LanguageModelTool<Record<string, never>> {
    
    async prepareInvocation(
        _options: vscode.LanguageModelToolInvocationPrepareOptions<Record<string, never>>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Retrieving global knowledge status...'
        };
    }

    async invoke(
        _options: vscode.LanguageModelToolInvocationOptions<Record<string, never>>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const summary = await getGlobalKnowledgeSummary();
        const registry = await ensureProjectRegistry();

        // Remote GK status indicator
        const remoteConfigured = getRemoteRepoConfig() !== null;
        const syncStatusStr = remoteConfigured 
            ? `| GitHub Access | ✅ Remote configured |\n`
            : `| GitHub Access | ⚪ Local only |\n`;

        let result = `## 🧠 Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${summary.totalPatterns} |
| Global Insights | ${summary.totalInsights} |
| Known Projects | ${registry.projects.length} |
${syncStatusStr}
### Knowledge by Category
`;
        
        for (const [cat, count] of Object.entries(summary.categories)) {
            result += `- **${cat}**: ${count}\n`;
        }

        if (summary.topTags.length > 0) {
            result += `\n### Top Tags\n`;
            for (const { tag, count } of summary.topTags) {
                result += `- ${tag}: ${count}\n`;
            }
        }

        if (summary.recentEntries.length > 0) {
            result += `\n### Recent Entries\n`;
            for (const entry of summary.recentEntries) {
                const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
                result += `- ${typeEmoji} **${entry.title}** (${entry.category})\n`;
            }
        }

        if (registry.projects.length > 0) {
            result += `\n### Known Projects\n`;
            for (const project of registry.projects.slice(0, 5)) {
                result += `- **${project.name}** - ${project.knowledgeFiles} knowledge files\n`;
            }
        }

        result += `\n### Global Knowledge Location\n\`${getAlexGlobalPath()}\`\n`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Register all global knowledge tools
 */
export function registerGlobalKnowledgeTools(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.lm.registerTool('alex_knowledge_search', new GlobalKnowledgeSearchTool()),
        vscode.lm.registerTool('alex_knowledge_save_insight', new SaveInsightTool()),
        vscode.lm.registerTool('alex_knowledge_promote', new PromoteKnowledgeTool()),
        vscode.lm.registerTool('alex_knowledge_status', new GlobalKnowledgeStatusTool())
    );
}
