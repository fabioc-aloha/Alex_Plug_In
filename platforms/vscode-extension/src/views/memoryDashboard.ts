import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../shared/workspaceFs';
import { checkHealth, HealthCheckResult, HealthStatus } from '../shared/healthCheck';
import { getGlobalKnowledgeSummary, detectGlobalKnowledgeRepo } from '../chat/globalKnowledge';
import { escapeHtml, getNonce } from '../shared/sanitize';
import { detectPersona, loadUserProfile, PersonaDetectionResult } from '../chat/personaDetection';
import { openChatPanel } from '../shared/utils';

/**
 * Memory Architecture Dashboard - Premium visualization of Alex's cognitive memory structure
 * 
 * Features:
 * - Neuroanatomical brain mapping diagram
 * - Memory type breakdown (Procedural, Episodic, Skills, Synapses, GK)
 * - Active Context status (persona, focus trifectas, objective)
 * - Real-time memory file counts
 * - Interactive exploration
 * 
 * NOTE: P1-P7 slot visualization is deprecated and will be replaced with Active Context visualization in a future release.
 */

let currentPanel: vscode.WebviewPanel | undefined;
let extensionUri: vscode.Uri | undefined;

interface MemoryStats {
    instructions: number;
    prompts: number;
    skills: number;
    episodic: number;
    synapses: number;
    globalPatterns: number;
    globalInsights: number;
}

interface WorkingMemorySlot {
    id: string;
    name: string;
    type: 'Core' | 'Domain';
    description: string;
    active: boolean;
}

/**
 * Open or focus the memory dashboard
 */
export async function openMemoryDashboard(context: vscode.ExtensionContext): Promise<void> {
    const column = vscode.window.activeTextEditor 
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
    
    // If panel already exists, reveal it
    if (currentPanel) {
        currentPanel.reveal(column);
        await refreshDashboard();
        return;
    }
    
    extensionUri = context.extensionUri;
    
    // Create a new panel
    currentPanel = vscode.window.createWebviewPanel(
        'alexMemoryDashboard',
        'Alex Memory Architecture',
        column || vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [context.extensionUri]
        }
    );
    
    // Set up message handling
    currentPanel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case 'refresh':
                    await refreshDashboard();
                    break;
                case 'openSkillCatalog':
                    vscode.commands.executeCommand('alex.generateSkillCatalog');
                    break;
                case 'openHealthDashboard':
                    vscode.commands.executeCommand('alex.openHealthDashboard');
                    break;
                case 'dream':
                    vscode.commands.executeCommand('alex.dream');
                    break;
                case 'meditate':
                    openChatPanel();
                    break;
                case 'openFile':
                    if (message.filePath) {
                        const doc = await vscode.workspace.openTextDocument(message.filePath);
                        await vscode.window.showTextDocument(doc);
                    }
                    break;
                case 'openFolder':
                    if (message.folderPath) {
                        const uri = vscode.Uri.file(message.folderPath);
                        vscode.commands.executeCommand('revealInExplorer', uri);
                    }
                    break;
                case 'deepBrainQA':
                    vscode.commands.executeCommand('alex.deepBrainQA');
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
    
    currentPanel.onDidDispose(
        () => {
            currentPanel = undefined;
        },
        undefined,
        context.subscriptions
    );
    
    await refreshDashboard();
}

/**
 * Refresh dashboard content
 */
async function refreshDashboard(): Promise<void> {
    if (!currentPanel || !extensionUri) {
        return;
    }
    
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const rootPath = workspaceFolders?.[0]?.uri.fsPath || '';
        
        const [health, memoryStats, gkRepo, gkSummary] = await Promise.all([
            checkHealth(false),
            getMemoryStats(rootPath),
            detectGlobalKnowledgeRepo(),
            getGlobalKnowledgeSummary()
        ]);
        
        // Detect persona for UI accent
        let personaResult: PersonaDetectionResult | null = null;
        if (workspaceFolders) {
            const userProfile = await loadUserProfile(workspaceFolders[0].uri.fsPath);
            personaResult = await detectPersona(userProfile ?? undefined, workspaceFolders);
        }
        
        const workingMemory = getWorkingMemorySlots();
        
        currentPanel.webview.html = await getWebviewContent(
            currentPanel.webview,
            extensionUri,
            health,
            memoryStats,
            workingMemory,
            gkRepo,
            gkSummary,
            personaResult
        );
    } catch (err) {
        currentPanel.webview.html = getErrorContent(err);
    }
}

/**
 * Get memory file statistics
 */
async function getMemoryStats(rootPath: string): Promise<MemoryStats> {
    const stats: MemoryStats = {
        instructions: 0,
        prompts: 0,
        skills: 0,
        episodic: 0,
        synapses: 0,
        globalPatterns: 0,
        globalInsights: 0
    };
    
    if (!rootPath) {
        return stats;
    }
    
    const githubPath = path.join(rootPath, '.github');
    
    try {
        // Instructions
        const instrPath = path.join(githubPath, 'instructions');
        if (await workspaceFs.pathExists(instrPath)) {
            const files = await workspaceFs.readDirectory(instrPath);
            stats.instructions = files.filter(([name, _]) => name.endsWith('.md')).length;
        }
        
        // Prompts
        const promptsPath = path.join(githubPath, 'prompts');
        if (await workspaceFs.pathExists(promptsPath)) {
            const files = await workspaceFs.readDirectory(promptsPath);
            stats.prompts = files.filter(([name, _]) => name.endsWith('.md')).length;
        }
        
        // Skills
        const skillsPath = path.join(githubPath, 'skills');
        if (await workspaceFs.pathExists(skillsPath)) {
            const entries = await workspaceFs.readDirectory(skillsPath);
            stats.skills = entries.filter(([_, fileType]) => fileType === vscode.FileType.Directory).length;
        }
        
        // Episodic
        const episodicPath = path.join(githubPath, 'episodic');
        if (await workspaceFs.pathExists(episodicPath)) {
            const files = await workspaceFs.readDirectory(episodicPath);
            stats.episodic = files.filter(([name, _]) => name.endsWith('.md')).length;
        }
        
        // Count synapses
        if (await workspaceFs.pathExists(skillsPath)) {
            const entries = await workspaceFs.readDirectory(skillsPath);
            for (const [name, fileType] of entries) {
                if (fileType === vscode.FileType.Directory) {
                    const synapsePath = path.join(skillsPath, name, 'synapses.json');
                    if (await workspaceFs.pathExists(synapsePath)) {
                        stats.synapses++;
                    }
                }
            }
        }
        
        // Global Knowledge
        const gkRepo = await detectGlobalKnowledgeRepo();
        if (gkRepo) {
            const patternsPath = path.join(gkRepo, 'patterns');
            const insightsPath = path.join(gkRepo, 'insights');
            
            if (await workspaceFs.pathExists(patternsPath)) {
                const files = await workspaceFs.readDirectory(patternsPath);
                stats.globalPatterns = files.filter(([name, _]) => name.endsWith('.md')).length;
            }
            if (await workspaceFs.pathExists(insightsPath)) {
                const files = await workspaceFs.readDirectory(insightsPath);
                stats.globalInsights = files.filter(([name, _]) => name.endsWith('.md')).length;
            }
        }
    } catch (err) {
        console.error('Error getting memory stats:', err);
    }
    
    return stats;
}

/**
 * Get working memory slot definitions
 */
function getWorkingMemorySlots(): WorkingMemorySlot[] {
    return [
        { id: 'P1', name: 'meta-cognitive-awareness', type: 'Core', description: 'Self-monitoring, model awareness, adaptive behavior', active: true },
        { id: 'P2', name: 'bootstrap-learning', type: 'Core', description: 'Domain-agnostic knowledge acquisition', active: true },
        { id: 'P3', name: 'worldview-integration', type: 'Core', description: 'Ethical reasoning, moral psychology, constitutional AI', active: true },
        { id: 'P4a', name: 'grounded-factual-processing', type: 'Core', description: 'Evidence-based, precise language, verify claims', active: true },
        { id: 'P4b', name: 'meditation-consolidation', type: 'Core', description: 'Memory file persistence, synapse enhancement', active: true },
        { id: 'P4c', name: 'dream-automation', type: 'Core', description: 'Unconscious processing, neural maintenance', active: true },
        { id: 'P4d', name: 'self-actualization', type: 'Core', description: 'Deep assessment, architecture optimization', active: true },
        // P5-P7 slots deprecated - replaced by Active Context Focus Trifectas
        { id: 'P5', name: '*(deprecated)', type: 'Domain', description: 'Now managed via Active Context - Focus Trifectas', active: false },
        { id: 'P6', name: '*(deprecated)', type: 'Domain', description: 'Now managed via Active Context - Focus Trifectas', active: false },
        { id: 'P7', name: '*(deprecated)', type: 'Domain', description: 'Now managed via Active Context - Focus Trifectas', active: false }
    ];
}

/**
 * Persona accent color mapping - use hex colors for Mermaid compatibility
 */
const personaAccentMap: Record<string, string> = {
    'developer': '#3794ff',      // VS Code blue
    'academic': '#2aa198',       // Teal
    'researcher': '#2aa198',     // Teal
    'technical-writer': '#89d185', // VS Code green
    'architect': '#f0883e',      // Orange
    'data-engineer': '#f0883e',  // Orange
    'devops': '#89d185',         // VS Code green
    'content-creator': '#cca700', // VS Code yellow
    'fiction-writer': '#2aa198', // Teal
    'project-manager': '#3794ff', // VS Code blue
    'security': '#f14c4c',       // VS Code red
    'student': '#2aa198',        // Teal
    'job-seeker': '#89d185',     // VS Code green
    'presenter': '#cca700',      // VS Code yellow
    'power-user': '#3794ff'      // VS Code blue
};

/**
 * Generate webview content
 */
async function getWebviewContent(
    webview: vscode.Webview,
    extUri: vscode.Uri,
    health: HealthCheckResult,
    stats: MemoryStats,
    workingMemory: WorkingMemorySlot[],
    gkRepo: string | null,
    gkSummary: { totalPatterns: number; totalInsights: number } | null,
    personaResult: PersonaDetectionResult | null
): Promise<string> {
    const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(extUri, 'assets', 'logo.svg'));
    const isHealthy = health.status === HealthStatus.Healthy;
    const healthColor = isHealthy ? '#4CAF50' : '#FF9800';
    
    // Get persona accent color
    const persona = personaResult?.persona;
    const personaAccent = persona ? personaAccentMap[persona.id] || '#2aa198' : '#2aa198';
    
    const totalMemory = stats.instructions + stats.prompts + stats.skills + stats.episodic;
    const totalGK = stats.globalPatterns + stats.globalInsights;
    const hasIssues = !isHealthy || health.brokenSynapses > 0;
    
    const nonce = getNonce();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval' https://cdn.jsdelivr.net/npm/mermaid@10/; img-src ${webview.cspSource} https: data:; font-src ${webview.cspSource};">
    <title>Alex Memory Architecture</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        :root {
            --bg-primary: var(--vscode-editor-background);
            --bg-secondary: var(--vscode-sideBar-background);
            --text-primary: var(--vscode-foreground);
            --text-secondary: var(--vscode-descriptionForeground);
            --border: var(--vscode-widget-border);
            --accent: var(--vscode-textLink-foreground);
            --success: #4CAF50;
            --warning: #FF9800;
            --error: #F44336;
            --premium: ${personaAccent};
            --persona-accent: ${personaAccent};
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--text-primary);
            background: var(--bg-primary);
            padding: 20px;
            line-height: 1.6;
        }
        
        .dashboard { max-width: 1400px; margin: 0 auto; }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .logo { width: 48px; height: 48px; }
        
        .title-block h1 {
            font-size: 24px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .premium-badge {
            font-size: 10px;
            background: var(--premium);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
        }
        
        .subtitle {
            font-size: 13px;
            color: var(--text-secondary);
        }
        
        .header-actions { display: flex; gap: 8px; }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .btn:hover { background: var(--vscode-button-hoverBackground); }
        
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .btn-accent {
            background: var(--persona-accent);
            color: white;
        }
        
        .btn-accent:hover {
            filter: brightness(1.1);
            background: var(--persona-accent);
        }
        
        .btn-fix {
            background: linear-gradient(135deg, var(--persona-accent), color-mix(in srgb, var(--persona-accent) 80%, var(--success)));
            color: white;
            font-weight: 500;
        }
        
        .btn-fix:hover {
            filter: brightness(1.1);
            background: linear-gradient(135deg, var(--persona-accent), color-mix(in srgb, var(--persona-accent) 80%, var(--success)));
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 20px;
        }
        
        .card h2 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--persona-accent);
        }
        
        .card h2 .icon { font-size: 18px; }
        
        /* Brain Diagram - Mermaid */
        .brain-diagram {
            background: var(--bg-primary);
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            display: flex;
            justify-content: center;
        }
        
        .brain-diagram .mermaid {
            width: 100%;
        }
        
        .mermaid {
            font-family: var(--vscode-font-family) !important;
        }
        
        .mermaid .node rect,
        .mermaid .node polygon {
            fill: var(--bg-secondary) !important;
            stroke: var(--persona-accent) !important;
            stroke-width: 2px !important;
        }
        
        .mermaid .edgePath path {
            stroke: var(--text-secondary) !important;
            stroke-width: 1.5px !important;
        }
        
        .mermaid .edgeLabel {
            background-color: var(--bg-primary) !important;
            padding: 2px 6px !important;
        }
        
        /* Memory Flow Diagram */
        .flow-diagram {
            background: var(--bg-primary);
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
        }
        
        /* Memory Stats */
        .memory-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--border);
        }
        
        .memory-stat:last-child { border-bottom: none; }
        
        .memory-stat-label {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .memory-stat-icon { font-size: 16px; }
        
        .memory-stat-name { font-weight: 500; }
        
        .memory-stat-desc {
            font-size: 11px;
            color: var(--text-secondary);
        }
        
        .memory-stat-value {
            font-size: 18px;
            font-weight: 600;
            color: var(--persona-accent);
        }
        
        /* Working Memory */
        .wm-slot {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 12px;
            margin-bottom: 8px;
            background: var(--bg-primary);
            border-radius: 6px;
            border-left: 3px solid var(--border);
        }
        
        .wm-slot.active { border-left-color: var(--success); }
        .wm-slot.core { border-left-color: var(--premium); }
        .wm-slot.domain { border-left-color: var(--accent); }
        
        .wm-id {
            font-weight: 600;
            font-size: 12px;
            min-width: 32px;
        }
        
        .wm-name {
            font-size: 12px;
            font-weight: 500;
            flex: 1;
        }
        
        .wm-type {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            background: var(--bg-secondary);
        }
        
        .wm-type.core { color: var(--premium); }
        .wm-type.domain { color: var(--accent); }
        
        /* Summary Stats */
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .summary-stat {
            text-align: center;
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border);
        }
        
        .summary-stat-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--persona-accent);
        }
        
        .summary-stat-label {
            font-size: 11px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Footer */
        .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
            font-size: 11px;
            color: var(--text-secondary);
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <div class="header-left">
                <img src="${logoUri}" alt="Alex" class="logo" />
                <div class="title-block">
                    <h1>
                        Memory Architecture
                        <span class="premium-badge">⭐ PREMIUM</span>
                    </h1>
                    <div class="subtitle">Cognitive memory structure visualization</div>
                </div>
            </div>
            <div class="header-actions">
                ${hasIssues ? `<button class="btn btn-fix" data-cmd="deepBrainQA">🔧 Fix Issues</button>` : ''}
                <button class="btn btn-secondary" data-cmd="openHealthDashboard">📊 Health</button>
                <button class="btn btn-secondary" data-cmd="openSkillCatalog">📚 Skills</button>
                <button class="btn btn-accent" data-cmd="refresh">🔄 Refresh</button>
            </div>
        </div>
        
        <!-- Summary Stats -->
        <div class="summary-grid">
            <div class="summary-stat">
                <div class="summary-stat-value">${totalMemory}</div>
                <div class="summary-stat-label">Memory Files</div>
            </div>
            <div class="summary-stat">
                <div class="summary-stat-value">${stats.skills}</div>
                <div class="summary-stat-label">Skills</div>
            </div>
            <div class="summary-stat">
                <div class="summary-stat-value">${stats.synapses}</div>
                <div class="summary-stat-label">Synapses</div>
            </div>
            <div class="summary-stat">
                <div class="summary-stat-value">${totalGK}</div>
                <div class="summary-stat-label">Global Knowledge</div>
            </div>
        </div>
        
        <div class="grid">
            <!-- Neuroanatomical Mapping -->
            <div class="card" style="grid-column: span 2;">
                <h2><span class="icon">🧠</span> Neuroanatomical Mapping</h2>
                <div class="brain-diagram">
                    <pre class="mermaid">
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '${personaAccent}', 'primaryTextColor': '#fff', 'primaryBorderColor': '${personaAccent}', 'lineColor': '#888', 'secondaryColor': '#1e1e1e', 'tertiaryColor': '#252526' }}}%%
flowchart TB
    subgraph Executive["🧠 EXECUTIVE FUNCTION"]
        LLM["<b>LLM<\/b><br/>Claude / GPT<br/><i>Prefrontal Cortex<\/i>"]
    end
    
    subgraph Memory["📚 LONG-TERM MEMORY"]
        direction LR
        subgraph Procedural["📜 Procedural"]
            INS["${stats.instructions} .instructions.md<br/><i>Basal Ganglia<\/i>"]
        end
        subgraph Episodic["💬 Episodic"]
            PRM["${stats.prompts} .prompt.md<br/><i>Hippocampus<\/i>"]
        end
        subgraph Skills["🎯 Skills"]
            SKL["${stats.skills} skill domains<br/><i>Neocortex<\/i>"]
        end
    end
    
    subgraph Neural["🔗 NEURAL PATHWAYS"]
        SYN["⚡ ${stats.synapses} Synapses<br/><i>Connection Mapping<\/i>"]
    end
    
    subgraph Global["🌐 GLOBAL KNOWLEDGE"]
        GK["${stats.globalPatterns} Patterns + ${stats.globalInsights} Insights<br/><i>Cross-Project Memory<\/i>"]
    end
    
    LLM --> |"reasons with"| INS
    LLM --> |"recalls"| PRM
    LLM --> |"applies"| SKL
    INS --> SYN
    PRM --> SYN
    SKL --> SYN
    SYN --> |"syncs"| GK
                    </pre>
                </div>
                
                <!-- Memory Flow -->
                <div class="flow-diagram">
                    <pre class="mermaid">
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '${personaAccent}', 'lineColor': '#888' }}}%%
flowchart LR
    subgraph Input["📥 Input"]
        Q["User Query"]
    end
    
    subgraph Process["⚙️ Processing"]
        SSO["Skill Selection<br/>Optimization"]
        WM["Working Memory<br/>P1-P7 Slots"]
    end
    
    subgraph Retrieval["📤 Retrieval"]
        INS2["Instructions"]
        SKL2["Skills"]
        GK2["Global Knowledge"]
    end
    
    subgraph Output["💡 Output"]
        R["Response"]
    end
    
    Q --> SSO
    SSO --> WM
    WM --> INS2
    WM --> SKL2
    WM --> GK2
    INS2 --> R
    SKL2 --> R
    GK2 --> R
                    </pre>
                </div>
            </div>
            
            <!-- Memory Files Breakdown -->
            <div class="card">
                <h2><span class="icon">📁</span> Memory Files</h2>
                
                <div class="memory-stat">
                    <div class="memory-stat-label">
                        <span class="memory-stat-icon">📜</span>
                        <div>
                            <div class="memory-stat-name">Instructions</div>
                            <div class="memory-stat-desc">.instructions.md (Procedural)</div>
                        </div>
                    </div>
                    <div class="memory-stat-value">${stats.instructions}</div>
                </div>
                
                <div class="memory-stat">
                    <div class="memory-stat-label">
                        <span class="memory-stat-icon">💬</span>
                        <div>
                            <div class="memory-stat-name">Prompts</div>
                            <div class="memory-stat-desc">.prompt.md (Episodic)</div>
                        </div>
                    </div>
                    <div class="memory-stat-value">${stats.prompts}</div>
                </div>
                
                <div class="memory-stat">
                    <div class="memory-stat-label">
                        <span class="memory-stat-icon">🎯</span>
                        <div>
                            <div class="memory-stat-name">Skills</div>
                            <div class="memory-stat-desc">SKILL.md + synapses.json</div>
                        </div>
                    </div>
                    <div class="memory-stat-value">${stats.skills}</div>
                </div>
                
                <div class="memory-stat">
                    <div class="memory-stat-label">
                        <span class="memory-stat-icon">📅</span>
                        <div>
                            <div class="memory-stat-name">Episodic Archive</div>
                            <div class="memory-stat-desc">Session records</div>
                        </div>
                    </div>
                    <div class="memory-stat-value">${stats.episodic}</div>
                </div>
                
                ${gkRepo ? `
                <div class="memory-stat" style="border-top: 2px solid var(--premium); margin-top: 8px; padding-top: 12px;">
                    <div class="memory-stat-label">
                        <span class="memory-stat-icon">🌐</span>
                        <div>
                            <div class="memory-stat-name">Global Knowledge</div>
                            <div class="memory-stat-desc">${stats.globalPatterns} patterns + ${stats.globalInsights} insights</div>
                        </div>
                    </div>
                    <div class="memory-stat-value">${totalGK}</div>
                </div>
                ` : ''}
            </div>
            
            <!-- Working Memory Slots -->
            <div class="card">
                <h2><span class="icon">🧩</span> Working Memory (7±2 Rule)</h2>
                
                ${workingMemory.map(slot => `
                    <div class="wm-slot ${slot.type.toLowerCase()} ${slot.active ? 'active' : ''}">
                        <div class="wm-id">${slot.id}</div>
                        <div class="wm-name">${slot.name}</div>
                        <div class="wm-type ${slot.type.toLowerCase()}">${slot.type}</div>
                    </div>
                `).join('')}
                
                <div style="margin-top: 12px; font-size: 11px; color: var(--text-secondary);">
                    <strong>Core slots</strong> (P1-P4d): Always active<br>
                    <strong>Domain slots</strong>: Managed via Active Context Focus Trifectas (3 skills for current work)
                </div>
            </div>
        </div>
        
        <div class="footer">
            Alex Cognitive Architecture v5.0.0 • Memory Dashboard • 
            Health: <span style="color: ${healthColor};">${isHealthy ? '✓ Healthy' : '⚠ Issues'}</span>
            ${gkRepo ? ' • <span style="color: var(--premium);">🌐 Global Knowledge Active</span>' : ''}
        </div>
    </div>
    
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // Initialize Mermaid with dark theme
        try {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                securityLevel: 'loose',
                flowchart: {
                    htmlLabels: true,
                    curve: 'basis',
                    padding: 15
                },
                themeVariables: {
                    primaryColor: '${personaAccent}',
                    primaryTextColor: '#e0e0e0',
                    primaryBorderColor: '${personaAccent}',
                    lineColor: '#666',
                    secondaryColor: '#1e1e1e',
                    tertiaryColor: '#252526',
                    background: '#1e1e1e',
                    mainBkg: '#252526',
                    nodeBorder: '${personaAccent}',
                    clusterBkg: '#1e1e1e',
                    clusterBorder: '#444',
                    titleColor: '#e0e0e0',
                    edgeLabelBackground: '#1e1e1e'
                }
            });
            
            // Explicitly run mermaid rendering
            mermaid.run({
                querySelector: '.mermaid'
            });
        } catch (e) {
            console.error('Mermaid initialization failed:', e);
        }
        
        function cmd(command, data) {
            vscode.postMessage({ command, ...data });
        }
        
        // Event delegation for all data-cmd clicks (CSP-compliant)
        document.addEventListener('click', function(e) {
            const el = e.target.closest('[data-cmd]');
            if (el) {
                e.preventDefault();
                const command = el.getAttribute('data-cmd');
                cmd(command);
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Error content
 */
function getErrorContent(err: unknown): string {
    const message = err instanceof Error ? err.message : String(err);
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
</head>
<body style="padding: 20px; font-family: var(--vscode-font-family);">
    <h2>⚠️ Error Loading Dashboard</h2>
    <p>${escapeHtml(message)}</p>
    <button id="retryBtn">Retry</button>
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        document.getElementById('retryBtn').addEventListener('click', () => {
            vscode.postMessage({ command: 'refresh' });
        });
    </script>
</body></html>`;
}

/**
 * Register the memory dashboard command
 */
export function registerMemoryDashboard(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.openMemoryDashboard', async () => {
            await openMemoryDashboard(context);
        })
    );
}
