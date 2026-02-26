import * as vscode from 'vscode';
import * as path from 'path';
import { checkHealth, getCachedHealth, HealthCheckResult } from '../shared/healthCheck';
import { getAlexGlobalPath, getGlobalKnowledgePath } from '../chat/globalKnowledge';
import * as workspaceFs from '../shared/workspaceFs';

/**
 * Alex Memory Tree Provider
 * 
 * Provides a tree view of the cognitive architecture:
 * - Memory Files (Procedural, Episodic, Skills)
 * - Synaptic Network (Healthy/Broken connections)
 * - Global Knowledge (Patterns, Insights)
 */

type TreeItemType = 'root' | 'category' | 'file' | 'status';

interface MemoryTreeItemData {
    type: TreeItemType;
    label: string;
    category?: string;
    filePath?: string;
    count?: number;
    icon?: string;
    healthStatus?: 'healthy' | 'broken';
}

export class MemoryTreeProvider implements vscode.TreeDataProvider<MemoryTreeItemData> {
    
    private _onDidChangeTreeData = new vscode.EventEmitter<MemoryTreeItemData | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private rootPath: string | undefined;
    
    // Cache for file listings (avoid repeated disk reads)
    private cache = new Map<string, { data: MemoryTreeItemData[]; timestamp: number }>();
    private readonly CACHE_TTL = 30000; // 30 seconds

    constructor() {
        this.rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    }

    refresh(): void {
        this.rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        this.cache.clear(); // Clear cache on explicit refresh
        this._onDidChangeTreeData.fire();
    }

    private getCached(key: string): MemoryTreeItemData[] | null {
        const entry = this.cache.get(key);
        if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
            return entry.data;
        }
        return null;
    }

    private setCache(key: string, data: MemoryTreeItemData[]): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    getTreeItem(element: MemoryTreeItemData): vscode.TreeItem {
        const collapsible = element.type === 'root' || element.type === 'category'
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;

        const item = new vscode.TreeItem(element.label, collapsible);

        // Set icons
        if (element.icon) {
            item.iconPath = new vscode.ThemeIcon(element.icon);
        }

        // Set description (count)
        if (element.count !== undefined) {
            item.description = `${element.count}`;
        }

        // Clickable files open in editor
        if (element.filePath) {
            item.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [vscode.Uri.file(element.filePath)],
            };
            item.tooltip = element.filePath;
            item.contextValue = 'memoryFile';
        }

        // Status items
        if (element.healthStatus === 'broken') {
            item.iconPath = new vscode.ThemeIcon('warning', new vscode.ThemeColor('list.warningForeground'));
        } else if (element.healthStatus === 'healthy') {
            item.iconPath = new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
        }

        return item;
    }

    async getChildren(element?: MemoryTreeItemData): Promise<MemoryTreeItemData[]> {
        if (!element) {
            return this.getRootNodes();
        }

        switch (element.category) {
            case 'memory':
                return this.getMemoryCategories();
            case 'procedural':
                return this.getProceduralFiles();
            case 'episodic':
                return this.getEpisodicFiles();
            case 'skills':
                return this.getSkillFiles();
            case 'synapses':
                return this.getSynapseStatus();
            case 'globalKnowledge':
                return this.getGlobalKnowledgeCategories();
            case 'patterns':
                return this.getGlobalFiles('patterns');
            case 'insights':
                return this.getGlobalFiles('insights');
            default:
                return [];
        }
    }

    private getRootNodes(): MemoryTreeItemData[] {
        return [
            {
                type: 'root',
                label: 'Memory Files',
                category: 'memory',
                icon: 'file-text',
            },
            {
                type: 'root',
                label: 'Synaptic Network',
                category: 'synapses',
                icon: 'pulse',
            },
            {
                type: 'root',
                label: 'Global Knowledge',
                category: 'globalKnowledge',
                icon: 'globe',
            },
        ];
    }

    private getMemoryCategories(): MemoryTreeItemData[] {
        return [
            {
                type: 'category',
                label: 'Procedural',
                category: 'procedural',
                icon: 'gear',
            },
            {
                type: 'category',
                label: 'Episodic',
                category: 'episodic',
                icon: 'history',
            },
            {
                type: 'category',
                label: 'Skills',
                category: 'skills',
                icon: 'mortar-board',
            },
        ];
    }

    private async getProceduralFiles(): Promise<MemoryTreeItemData[]> {
        return this.listFiles('.github/instructions', '*.instructions.md');
    }

    private async getEpisodicFiles(): Promise<MemoryTreeItemData[]> {
        return this.listFiles('.github/prompts', '*.prompt.md');
    }

    private async getSkillFiles(): Promise<MemoryTreeItemData[]> {
        const cacheKey = 'skills';
        const cached = this.getCached(cacheKey);
        if (cached) { return cached; }
        
        if (!this.rootPath) { return []; }
        const skillsDir = path.join(this.rootPath, '.github', 'skills');
        // v5.9.10: Use workspace.fs for workspace files (ADR-008)
        if (!await workspaceFs.pathExists(skillsDir)) { return []; }

        const entries = await workspaceFs.readDirectory(skillsDir);
        const items: MemoryTreeItemData[] = [];

        for (const [name, fileType] of [...entries].sort((a, b) => a[0].localeCompare(b[0]))) {
            if (fileType !== vscode.FileType.Directory) { continue; }
            const skillFile = path.join(skillsDir, name, 'SKILL.md');
            if (await workspaceFs.pathExists(skillFile)) {
                items.push({
                    type: 'file',
                    label: name,
                    filePath: skillFile,
                    icon: 'book',
                });
            }
        }
        this.setCache(cacheKey, items);
        return items;
    }

    private async getSynapseStatus(): Promise<MemoryTreeItemData[]> {
        const health = getCachedHealth() ?? await checkHealth();

        return [
            {
                type: 'status',
                label: 'Healthy Connections',
                count: health.totalSynapses - health.brokenSynapses,
                healthStatus: 'healthy',
            },
            {
                type: 'status',
                label: 'Broken Connections',
                count: health.brokenSynapses,
                healthStatus: health.brokenSynapses > 0 ? 'broken' : 'healthy',
            },
        ];
    }

    private getGlobalKnowledgeCategories(): MemoryTreeItemData[] {
        return [
            {
                type: 'category',
                label: 'Patterns',
                category: 'patterns',
                icon: 'symbol-structure',
            },
            {
                type: 'category',
                label: 'Insights',
                category: 'insights',
                icon: 'lightbulb',
            },
        ];
    }

    private async getGlobalFiles(subfolder: 'patterns' | 'insights'): Promise<MemoryTreeItemData[]> {
        const cacheKey = `global-${subfolder}`;
        const cached = this.getCached(cacheKey);
        if (cached) { return cached; }
        
        const gkPath = getGlobalKnowledgePath(subfolder);
        // v5.9.10: Global knowledge uses fs-extra (global path, ADR-008)
        // but we can still use workspaceFs for path checking
        if (!await workspaceFs.pathExists(gkPath)) { return []; }

        const entries = await workspaceFs.readDirectory(gkPath);
        const files = entries
            .filter(([f]) => f.endsWith('.md'))
            .map(([f]) => f)
            .sort();

        const items = files.map(f => ({
            type: 'file' as TreeItemType,
            label: f.replace(/\.md$/, ''),
            filePath: path.join(gkPath, f),
            icon: subfolder === 'patterns' ? 'symbol-structure' : 'lightbulb',
        }));
        this.setCache(cacheKey, items);
        return items;
    }

    private async listFiles(relDir: string, glob: string): Promise<MemoryTreeItemData[]> {
        const cacheKey = `list-${relDir}`;
        const cached = this.getCached(cacheKey);
        if (cached) { return cached; }
        
        if (!this.rootPath) { return []; }
        const dirPath = path.join(this.rootPath, relDir);
        if (!await workspaceFs.pathExists(dirPath)) { return []; }

        const entries = await workspaceFs.readDirectory(dirPath);
        const files = entries
            .filter(([f]) => {
                // Simple glob match for *.ext pattern
                const ext = glob.replace('*', '');
                return f.endsWith(ext);
            })
            .map(([f]) => f)
            .sort();

        const items = files.map(f => ({
            type: 'file' as TreeItemType,
            label: f,
            filePath: path.join(dirPath, f),
            icon: 'file-text',
        }));
        this.setCache(cacheKey, items);
        return items;
    }
}

/**
 * Register the memory tree view in the Alex sidebar
 */
export function registerMemoryTreeView(context: vscode.ExtensionContext): MemoryTreeProvider {
    const provider = new MemoryTreeProvider();

    const treeView = vscode.window.createTreeView('alex.memoryTree', {
        treeDataProvider: provider,
        showCollapseAll: true,
    });

    // Refresh command
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.refreshMemoryTree', () => provider.refresh())
    );

    context.subscriptions.push(treeView);
    return provider;
}
