import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { 
    checkHealth, 
    HealthCheckResult, 
    HealthStatus
} from '../shared/healthCheck';
import { getGlobalKnowledgeSummary } from '../chat/globalKnowledge';
import { getSyncStatus } from '../chat/cloudSync';
import { getGoalsSummary } from '../commands/goals';
import { getCurrentSession } from '../commands/session';
import { validateWorkspace, getInstalledAlexVersion } from '../shared/utils';

/**
 * Health Dashboard - Rich webview visualization of Alex cognitive architecture
 * 
 * Features:
 * - Synaptic network visualization (ASCII art)
 * - Health metrics with color-coded status
 * - Memory file breakdown
 * - Knowledge base statistics
 * - Quick action buttons
 * - Real-time updates
 */

let currentPanel: vscode.WebviewPanel | undefined;

/**
 * Open or focus the health dashboard
 */
export async function openHealthDashboard(context: vscode.ExtensionContext): Promise<void> {
    const column = vscode.window.activeTextEditor 
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
    
    // If panel already exists, reveal it
    if (currentPanel) {
        currentPanel.reveal(column);
        await refreshDashboard();
        return;
    }
    
    // Create a new panel
    currentPanel = vscode.window.createWebviewPanel(
        'alexHealthDashboard',
        '🦖 Alex Health Dashboard',
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
                case 'runDream':
                    vscode.commands.executeCommand('alex.dream');
                    break;
                case 'selfActualize':
                    vscode.commands.executeCommand('alex.selfActualize');
                    break;
                case 'syncKnowledge':
                    vscode.commands.executeCommand('alex.syncKnowledge');
                    break;
                case 'openFile':
                    if (message.filePath) {
                        const doc = await vscode.workspace.openTextDocument(message.filePath);
                        await vscode.window.showTextDocument(doc);
                    }
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
    
    // Handle panel disposal
    currentPanel.onDidDispose(
        () => {
            currentPanel = undefined;
        },
        undefined,
        context.subscriptions
    );
    
    // Load initial content
    await refreshDashboard();
}

/**
 * Refresh dashboard content
 */
async function refreshDashboard(): Promise<void> {
    if (!currentPanel) {
        return;
    }
    
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const rootPath = workspaceFolders?.[0]?.uri.fsPath || '';
        
        // Gather all data in parallel
        const [health, knowledgeSummary, syncStatus, goalsSummary, version] = await Promise.all([
            checkHealth(true), // Force fresh health check
            getGlobalKnowledgeSummary(),
            getSyncStatus(),
            getGoalsSummary(),
            rootPath ? getInstalledAlexVersion(rootPath) : Promise.resolve(null)
        ]);
        
        const session = getCurrentSession();
        
        currentPanel.webview.html = await getWebviewContent(
            health,
            knowledgeSummary,
            syncStatus,
            goalsSummary,
            session,
            version
        );
    } catch (err) {
        currentPanel.webview.html = getErrorContent(err);
    }
}

/**
 * Generate the webview HTML content
 */
async function getWebviewContent(
    health: HealthCheckResult,
    knowledge: { totalPatterns: number; totalInsights: number } | null,
    syncStatus: { status: string; message: string },
    goals: { activeGoals: any[]; completedToday: number; streakDays: number; totalCompleted: number },
    session: ReturnType<typeof getCurrentSession>,
    version: string | null
): Promise<string> {
    const isHealthy = health.status === HealthStatus.Healthy;
    const healthColor = isHealthy ? '#4CAF50' : (health.brokenSynapses > 5 ? '#F44336' : '#FF9800');
    
    // Build synapse network visualization
    const synapseViz = buildSynapseVisualization(health);
    
    // Build memory file breakdown
    const memoryCategories = await buildMemoryBreakdownAsync();
    const memoryBreakdown = buildMemoryBreakdown(memoryCategories);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex Health Dashboard</title>
    <style>
        :root {
            --bg-primary: var(--vscode-editor-background);
            --bg-secondary: var(--vscode-sideBar-background);
            --text-primary: var(--vscode-foreground);
            --text-secondary: var(--vscode-descriptionForeground);
            --border: var(--vscode-widget-border);
            --accent: var(--vscode-button-background);
            --success: #4CAF50;
            --warning: #FF9800;
            --error: #F44336;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--text-primary);
            background: var(--bg-primary);
            padding: 20px;
            line-height: 1.5;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
        }
        
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
            gap: 12px;
        }
        
        .logo {
            font-size: 48px;
        }
        
        .title-block h1 {
            font-size: 24px;
            font-weight: 600;
        }
        
        .title-block .version {
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .header-actions {
            display: flex;
            gap: 8px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: var(--accent);
            color: var(--vscode-button-foreground);
        }
        
        .btn-primary:hover {
            opacity: 0.9;
        }
        
        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .card {
            background: var(--bg-secondary);
            border-radius: 8px;
            padding: 16px;
            border: 1px solid var(--border);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        
        .card-title {
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .card-badge {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 500;
        }
        
        .badge-success {
            background: rgba(76, 175, 80, 0.2);
            color: var(--success);
        }
        
        .badge-warning {
            background: rgba(255, 152, 0, 0.2);
            color: var(--warning);
        }
        
        .badge-error {
            background: rgba(244, 67, 54, 0.2);
            color: var(--error);
        }
        
        .health-score {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 20px;
        }
        
        .health-ring {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 8px solid ${healthColor};
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }
        
        .health-percent {
            font-size: 32px;
            font-weight: 700;
            color: ${healthColor};
        }
        
        .health-label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        
        .stat-item {
            text-align: center;
            padding: 12px;
            background: var(--bg-primary);
            border-radius: 6px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: 600;
        }
        
        .stat-label {
            font-size: 11px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .synapse-viz {
            font-family: 'Cascadia Code', 'Consolas', monospace;
            font-size: 11px;
            line-height: 1.3;
            background: var(--bg-primary);
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            white-space: pre;
        }
        
        .memory-list {
            list-style: none;
        }
        
        .memory-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            transition: background 0.1s;
        }
        
        .memory-item:hover {
            background: var(--bg-primary);
        }
        
        .memory-item:last-child {
            border-bottom: none;
        }
        
        .memory-name {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .memory-icon {
            width: 20px;
            text-align: center;
        }
        
        .memory-count {
            font-size: 12px;
            color: var(--text-secondary);
            background: var(--bg-primary);
            padding: 2px 8px;
            border-radius: 10px;
        }
        
        .session-active {
            background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
            border-color: #2196F3;
        }
        
        .session-timer {
            font-size: 36px;
            font-weight: 600;
            font-family: monospace;
            text-align: center;
            color: #2196F3;
            margin: 16px 0;
        }
        
        .session-info {
            text-align: center;
            color: var(--text-secondary);
        }
        
        .goal-progress {
            margin-bottom: 12px;
        }
        
        .goal-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            font-size: 12px;
        }
        
        .goal-bar {
            height: 6px;
            background: var(--bg-primary);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .goal-fill {
            height: 100%;
            background: var(--success);
            border-radius: 3px;
            transition: width 0.3s;
        }
        
        .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
            text-align: center;
            color: var(--text-secondary);
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <div class="header-left">
                <span class="logo">🦖</span>
                <div class="title-block">
                    <h1>Alex Health Dashboard</h1>
                    <span class="version">Version ${version || 'Unknown'}</span>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn btn-secondary" onclick="refresh()">
                    🔄 Refresh
                </button>
                <button class="btn btn-secondary" onclick="cmd('runDream')">
                    💭 Dream
                </button>
                <button class="btn btn-primary" onclick="cmd('selfActualize')">
                    🧠 Self-Actualize
                </button>
            </div>
        </div>
        
        <div class="grid">
            <!-- Health Score Card -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">🏥 Architecture Health</span>
                    <span class="card-badge ${isHealthy ? 'badge-success' : (health.brokenSynapses > 5 ? 'badge-error' : 'badge-warning')}">
                        ${isHealthy ? 'Healthy' : (health.brokenSynapses > 5 ? 'Critical' : 'Needs Attention')}
                    </span>
                </div>
                <div class="health-score">
                    <div class="health-ring">
                        <span class="health-percent">${Math.round(((health.totalSynapses - health.brokenSynapses) / Math.max(health.totalSynapses, 1)) * 100)}%</span>
                    </div>
                    <span class="health-label">${health.totalSynapses - health.brokenSynapses}/${health.totalSynapses} synapses healthy</span>
                </div>
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-value">${health.totalSynapses}</div>
                        <div class="stat-label">Total Synapses</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: ${health.brokenSynapses > 0 ? 'var(--warning)' : 'var(--success)'}">${health.brokenSynapses}</div>
                        <div class="stat-label">Broken</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${health.totalFiles}</div>
                        <div class="stat-label">Memory Files</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${isHealthy ? '✓' : '!'}</div>
                        <div class="stat-label">Status</div>
                    </div>
                </div>
            </div>
            
            <!-- Knowledge Base Card -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">📚 Knowledge Base</span>
                    <span class="card-badge badge-success">${(knowledge?.totalPatterns || 0) + (knowledge?.totalInsights || 0)} Items</span>
                </div>
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-value">📁 ${knowledge?.totalPatterns || 0}</div>
                        <div class="stat-label">Patterns</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">💡 ${knowledge?.totalInsights || 0}</div>
                        <div class="stat-label">Insights</div>
                    </div>
                </div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
                    <div class="card-title" style="margin-bottom: 8px;">☁️ Cloud Sync</div>
                    <p style="font-size: 12px; color: var(--text-secondary);">
                        ${getSyncStatusIcon(syncStatus.status)} ${syncStatus.message}
                    </p>
                    <button class="btn btn-secondary" style="margin-top: 8px; width: 100%;" onclick="cmd('syncKnowledge')">
                        ☁️ Sync Now
                    </button>
                </div>
            </div>
            
            ${session ? `
            <!-- Active Session Card -->
            <div class="card session-active">
                <div class="card-header">
                    <span class="card-title">🎯 Active Session</span>
                    <span class="card-badge badge-success">${session.isPaused ? 'Paused' : 'Active'}</span>
                </div>
                <div class="session-timer">${formatTime(session.remaining)}</div>
                <div class="session-info">
                    <p><strong>${escapeHtml(session.topic)}</strong></p>
                    <p>${session.isBreak ? '☕ Break Time' : '🎯 Focus Time'}${session.pomodoroCount > 0 ? ` • 🍅×${session.pomodoroCount}` : ''}</p>
                </div>
            </div>
            ` : ''}
            
            <!-- Learning Goals Card -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">🎯 Learning Goals</span>
                    <span class="card-badge badge-success">🔥 ${goals.streakDays} day streak</span>
                </div>
                <div class="stat-grid" style="margin-bottom: 12px;">
                    <div class="stat-item">
                        <div class="stat-value">✅ ${goals.completedToday}</div>
                        <div class="stat-label">Today</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">🏆 ${goals.totalCompleted}</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>
                ${goals.activeGoals.slice(0, 3).map(goal => `
                <div class="goal-progress">
                    <div class="goal-header">
                        <span>${escapeHtml(goal.title)}</span>
                        <span>${goal.currentCount}/${goal.targetCount}</span>
                    </div>
                    <div class="goal-bar">
                        <div class="goal-fill" style="width: ${Math.min(Math.round((goal.currentCount / goal.targetCount) * 100), 100)}%;"></div>
                    </div>
                </div>
                `).join('')}
                ${goals.activeGoals.length === 0 ? '<p style="text-align: center; color: var(--text-secondary); padding: 12px;">No active goals</p>' : ''}
            </div>
        </div>
        
        <!-- Synapse Network -->
        <div class="card" style="margin-top: 20px;">
            <div class="card-header">
                <span class="card-title">🧠 Synaptic Network</span>
            </div>
            <div class="synapse-viz">${synapseViz}</div>
        </div>
        
        <!-- Memory Files -->
        <div class="card" style="margin-top: 20px;">
            <div class="card-header">
                <span class="card-title">📁 Memory Architecture</span>
            </div>
            ${memoryBreakdown}
        </div>
        
        <div class="footer">
            <p>Alex Cognitive Architecture • Last updated: ${new Date().toLocaleTimeString()}</p>
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function cmd(command, args) {
            vscode.postMessage({ command, ...args });
        }
        
        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }
        
        function openFile(filePath) {
            vscode.postMessage({ command: 'openFile', filePath });
        }
    </script>
</body>
</html>`;
}

/**
 * Build ASCII visualization of synapse network
 */
function buildSynapseVisualization(health: HealthCheckResult): string {
    if (!health.initialized || health.totalSynapses === 0) {
        return `
┌─────────────────────────────────────────────────────┐
│                  No synapses found                   │
│         Run 'Alex: Initialize' to deploy            │
└─────────────────────────────────────────────────────┘`;
    }
    
    const healthyCount = health.totalSynapses - health.brokenSynapses;
    const healthPercent = Math.round((healthyCount / health.totalSynapses) * 100);
    
    let viz = `┌${'─'.repeat(60)}┐\n`;
    viz += `│ SYNAPSE NETWORK SUMMARY                                    │\n`;
    viz += `├${'─'.repeat(60)}┤\n`;
    viz += `│                                                            │\n`;
    viz += `│   Total Connections: ${String(health.totalSynapses).padStart(4)}                                 │\n`;
    viz += `│   Healthy:          ${String(healthyCount).padStart(4)} (${String(healthPercent).padStart(3)}%)                           │\n`;
    viz += `│   Broken:           ${String(health.brokenSynapses).padStart(4)}                                  │\n`;
    viz += `│   Memory Files:     ${String(health.totalFiles).padStart(4)}                                  │\n`;
    viz += `│                                                            │\n`;
    viz += `│   Health Bar:                                              │\n`;
    
    // Build ASCII health bar
    const barWidth = 40;
    const filledWidth = Math.round((healthPercent / 100) * barWidth);
    const healthBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);
    viz += `│   [${healthBar}]   │\n`;
    viz += `│                                                            │\n`;
    
    // Show issues if any
    if (health.issues.length > 0) {
        viz += `├${'─'.repeat(60)}┤\n`;
        viz += `│ ISSUES DETECTED:                                           │\n`;
        for (const issue of health.issues.slice(0, 5)) {
            const shortIssue = issue.length > 54 ? issue.substring(0, 51) + '...' : issue;
            viz += `│   ⚠ ${shortIssue.padEnd(54)} │\n`;
        }
        if (health.issues.length > 5) {
            viz += `│   ... and ${health.issues.length - 5} more issues                                  │\n`;
        }
    }
    
    viz += `└${'─'.repeat(60)}┘`;
    return viz;
}

/**
 * Build memory file breakdown HTML
 */
async function buildMemoryBreakdownAsync(): Promise<{ icon: string; name: string; count: number }[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return [];
    }
    
    const rootPath = workspaceFolders[0].uri.fsPath;
    const categories = [
        { icon: '📋', name: 'Instructions (.instructions.md)', path: path.join(rootPath, '.github', 'instructions'), count: 0 },
        { icon: '📝', name: 'Prompts (.prompt.md)', path: path.join(rootPath, '.github', 'prompts'), count: 0 },
        { icon: '🧠', name: 'Domain Knowledge (DK-*.md)', path: path.join(rootPath, '.github', 'domain-knowledge'), count: 0 },
        { icon: '⚙️', name: 'Configuration', path: path.join(rootPath, '.github', 'config'), count: 0 }
    ];
    
    // Count files in each directory
    for (const cat of categories) {
        try {
            if (await fs.pathExists(cat.path)) {
                const files = await fs.readdir(cat.path);
                cat.count = files.filter(f => f.endsWith('.md')).length;
            }
        } catch {
            // Ignore errors
        }
    }
    
    return categories;
}

function buildMemoryBreakdown(categories: { icon: string; name: string; count: number }[]): string {
    return `
    <ul class="memory-list">
        ${categories.map(cat => `
        <li class="memory-item">
            <span class="memory-name">
                <span class="memory-icon">${cat.icon}</span>
                ${cat.name}
            </span>
            <span class="memory-count">${cat.count}</span>
        </li>
        `).join('')}
    </ul>`;
}

/**
 * Get sync status icon
 */
function getSyncStatusIcon(status: string): string {
    switch (status) {
        case 'up-to-date': return '✅';
        case 'syncing': return '🔄';
        case 'error': return '❌';
        default: return '⚪';
    }
}

/**
 * Format seconds as MM:SS
 */
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Escape HTML
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Get error content
 */
function getErrorContent(err: unknown): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 40px;
            text-align: center;
        }
        .error {
            color: var(--vscode-errorForeground);
        }
        button {
            margin-top: 20px;
            padding: 10px 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h2>⚠️ Failed to load dashboard</h2>
    <p class="error">${err}</p>
    <button onclick="location.reload()">Retry</button>
</body>
</html>`;
}

/**
 * Register the dashboard command
 */
export function registerHealthDashboard(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.openHealthDashboard', async () => {
            await openHealthDashboard(context);
        })
    );
}
