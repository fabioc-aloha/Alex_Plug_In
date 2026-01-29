import * as vscode from 'vscode';
import { checkHealth, HealthCheckResult, HealthStatus } from '../shared/healthCheck';
import { getGlobalKnowledgeSummary } from '../chat/globalKnowledge';
import { getSyncStatus } from '../chat/cloudSync';
import { getCurrentSession, isSessionActive } from '../commands/session';
import { getGoalsSummary, LearningGoal } from '../commands/goals';
import { escapeHtml } from '../shared/sanitize';

/**
 * Welcome View Provider - Activity Bar panel with health, quick actions, and recent activity
 */
export class WelcomeViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'alex.welcomeView';
    
    private _view?: vscode.WebviewView;
    private _extensionUri: vscode.Uri;
    
    constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }
    
    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        
        webviewView.webview.html = this._getLoadingHtml();
        
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case 'startSession':
                    vscode.commands.executeCommand('alex.startSession');
                    break;
                case 'meditate':
                    vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
                    // Could auto-type @alex /meditate
                    break;
                case 'dream':
                    vscode.commands.executeCommand('alex.dream');
                    break;
                case 'syncKnowledge':
                    vscode.commands.executeCommand('alex.syncKnowledge');
                    break;
                case 'openDocs':
                    vscode.commands.executeCommand('alex.openDocs');
                    break;
                case 'showStatus':
                    vscode.commands.executeCommand('alex.showStatus');
                    break;
                case 'showGoals':
                    vscode.commands.executeCommand('alex.showGoals');
                    break;
                case 'createGoal':
                    vscode.commands.executeCommand('alex.createGoal');
                    break;
                case 'refresh':
                    this.refresh();
                    break;
            }
        });
        
        // Initial content load
        this.refresh();
    }
    
    /**
     * Refresh the welcome view content
     */
    public async refresh(): Promise<void> {
        if (!this._view) {
            return;
        }
        
        try {
            // Gather all status data in parallel
            const [health, knowledgeSummary, syncStatus, goalsSummary] = await Promise.all([
                checkHealth(false),
                getGlobalKnowledgeSummary(),
                getSyncStatus(),
                getGoalsSummary()
            ]);
            
            const session = getCurrentSession();
            
            this._view.webview.html = this._getHtmlContent(
                health,
                knowledgeSummary,
                syncStatus,
                session,
                goalsSummary
            );
        } catch (err) {
            this._view.webview.html = this._getErrorHtml(err);
        }
    }
    
    private _getLoadingHtml(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 12px;
            margin: 0;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="loading">Loading...</div>
</body>
</html>`;
    }
    
    private _getErrorHtml(err: unknown): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 12px;
            margin: 0;
        }
        .error {
            color: var(--vscode-errorForeground);
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="error">
        <p>Failed to load Alex status</p>
        <p style="font-size: 12px; opacity: 0.7;">${err}</p>
        <button onclick="vscode.postMessage({command: 'refresh'})">Retry</button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
    </script>
</body>
</html>`;
    }
    
    private _getHtmlContent(
        health: HealthCheckResult,
        knowledge: { totalPatterns: number; totalInsights: number } | null,
        syncStatus: { status: string; message: string },
        session: ReturnType<typeof getCurrentSession>,
        goals: { activeGoals: LearningGoal[]; completedToday: number; streakDays: number; totalCompleted: number }
    ): string {
        // Health indicator
        const isHealthy = health.status === HealthStatus.Healthy;
        const healthIcon = isHealthy ? '🟢' : (health.brokenSynapses > 5 ? '🔴' : '🟡');
        const healthText = isHealthy ? 'Healthy' : `${health.brokenSynapses} issues`;
        
        // Knowledge stats
        const patterns = knowledge?.totalPatterns ?? 0;
        const insights = knowledge?.totalInsights ?? 0;
        
        // Sync status
        const syncIcon = syncStatus.status === 'up-to-date' ? '✅' : (syncStatus.status === 'error' ? '❌' : '🔄');
        const lastSyncText = syncStatus.message;
        
        // Session status
        const sessionHtml = session ? `
            <div class="session-card">
                <div class="session-header">
                    <span class="session-icon">${session.isBreak ? '☕' : '🎯'}</span>
                    <span class="session-title">${this._escapeHtml(session.topic)}</span>
                </div>
                <div class="session-timer">${this._formatTime(session.remaining)}</div>
                <div class="session-status">${session.isPaused ? '⏸️ Paused' : '▶️ Active'}${session.pomodoroCount > 0 ? ` • 🍅×${session.pomodoroCount}` : ''}</div>
            </div>
        ` : '';
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 0;
            margin: 0;
        }
        .container {
            padding: 12px;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .header-icon {
            font-size: 24px;
        }
        .header-title {
            font-size: 14px;
            font-weight: 600;
        }
        .refresh-btn {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            opacity: 0.7;
            font-size: 14px;
        }
        .refresh-btn:hover {
            opacity: 1;
        }
        
        .section {
            margin-bottom: 16px;
        }
        .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .status-item {
            background: var(--vscode-editor-background);
            border-radius: 4px;
            padding: 8px;
        }
        .status-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 2px;
        }
        .status-value {
            font-size: 13px;
            font-weight: 500;
        }
        
        .session-card {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            border-left: 3px solid var(--vscode-charts-blue);
        }
        .session-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        .session-icon {
            font-size: 16px;
        }
        .session-title {
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .session-timer {
            font-size: 20px;
            font-weight: 600;
            font-family: monospace;
            color: var(--vscode-charts-blue);
        }
        .session-status {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
        }
        
        .action-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            text-align: left;
            transition: background 0.1s;
        }
        .action-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .action-btn.primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        .action-btn.primary:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .action-icon {
            font-size: 14px;
            width: 18px;
            text-align: center;
        }
        .action-text {
            flex: 1;
        }
        .action-shortcut {
            font-size: 10px;
            opacity: 0.6;
            font-family: monospace;
        }
        
        .goals-stats {
            display: flex;
            gap: 16px;
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
        }
        .goal-item {
            background: var(--vscode-editor-background);
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 6px;
        }
        .goal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .goal-title {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
        }
        .goal-progress-text {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            margin-left: 8px;
        }
        .goal-bar {
            height: 4px;
            background: var(--vscode-progressBar-background);
            border-radius: 2px;
            overflow: hidden;
        }
        .goal-bar-fill {
            height: 100%;
            background: var(--vscode-charts-green);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="header-icon">🦖</span>
            <span class="header-title">Alex Cognitive</span>
            <button class="refresh-btn" onclick="refresh()" title="Refresh">↻</button>
        </div>
        
        ${sessionHtml}
        
        <div class="section">
            <div class="section-title">Status</div>
            <div class="status-grid">
                <div class="status-item">
                    <div class="status-label">Health</div>
                    <div class="status-value">${healthIcon} ${healthText}</div>
                </div>
                <div class="status-item">
                    <div class="status-label">Sync</div>
                    <div class="status-value">${syncIcon} ${lastSyncText}</div>
                </div>
                <div class="status-item">
                    <div class="status-label">Patterns</div>
                    <div class="status-value">📁 ${patterns}</div>
                </div>
                <div class="status-item">
                    <div class="status-label">Insights</div>
                    <div class="status-value">💡 ${insights}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Quick Actions</div>
            <div class="action-list">
                <button class="action-btn primary" onclick="cmd('startSession')">
                    <span class="action-icon">🎯</span>
                    <span class="action-text">Start Learning Session</span>
                    <span class="action-shortcut">⌃⌥P</span>
                </button>
                <button class="action-btn" onclick="cmd('dream')">
                    <span class="action-icon">💭</span>
                    <span class="action-text">Dream (Neural Maintenance)</span>
                    <span class="action-shortcut">⌃⌥D</span>
                </button>
                <button class="action-btn" onclick="cmd('syncKnowledge')">
                    <span class="action-icon">☁️</span>
                    <span class="action-text">Sync to Cloud</span>
                    <span class="action-shortcut">⌃⌥K</span>
                </button>
                <button class="action-btn" onclick="cmd('showStatus')">
                    <span class="action-icon">📊</span>
                    <span class="action-text">All Actions</span>
                </button>
                <button class="action-btn" onclick="cmd('showGoals')">
                    <span class="action-icon">🎯</span>
                    <span class="action-text">Manage Goals</span>
                </button>
                <button class="action-btn" onclick="cmd('openDocs')">
                    <span class="action-icon">📚</span>
                    <span class="action-text">Documentation</span>
                    <span class="action-shortcut">⌃⌥H</span>
                </button>
            </div>
        </div>
        
        ${this._getGoalsHtml(goals)}
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function cmd(command) {
            vscode.postMessage({ command });
        }
        
        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }
        
        // Auto-refresh every 30 seconds
        setInterval(refresh, 30000);
    </script>
</body>
</html>`;
    }
    
    private _escapeHtml(text: string): string {
        // Delegate to centralized sanitization
        return escapeHtml(text);
    }
    
    private _formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    private _formatRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) { return 'Just now'; }
        if (diffMins < 60) { return `${diffMins}m ago`; }
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) { return `${diffHours}h ago`; }
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
    
    private _getGoalsHtml(goals: { activeGoals: LearningGoal[]; completedToday: number; streakDays: number; totalCompleted: number }): string {
        if (goals.activeGoals.length === 0 && goals.streakDays === 0) {
            // No goals yet - show prompt to create one
            return `
        <div class="section">
            <div class="section-title">Learning Goals</div>
            <div style="text-align: center; padding: 12px; opacity: 0.7;">
                <p style="margin: 0 0 8px 0;">Set goals to track your progress</p>
                <button class="action-btn primary" onclick="cmd('createGoal')" style="display: inline-flex; width: auto;">
                    <span class="action-icon">➕</span>
                    <span class="action-text">Create Goal</span>
                </button>
            </div>
        </div>`;
        }
        
        // Build goals list
        const goalsListHtml = goals.activeGoals.slice(0, 3).map(goal => {
            const progress = Math.round((goal.currentCount / goal.targetCount) * 100);
            const progressWidth = Math.min(progress, 100);
            return `
            <div class="goal-item">
                <div class="goal-header">
                    <span class="goal-title">${this._escapeHtml(goal.title)}</span>
                    <span class="goal-progress-text">${goal.currentCount}/${goal.targetCount}</span>
                </div>
                <div class="goal-bar">
                    <div class="goal-bar-fill" style="width: ${progressWidth}%;"></div>
                </div>
            </div>`;
        }).join('');
        
        return `
        <div class="section">
            <div class="section-title">Learning Goals ${goals.streakDays > 0 ? `<span style="float: right;">🔥 ${goals.streakDays} day streak</span>` : ''}</div>
            <div class="goals-stats">
                <span>✅ ${goals.completedToday} today</span>
                <span>🏆 ${goals.totalCompleted} total</span>
            </div>
            ${goalsListHtml || '<div style="text-align: center; padding: 8px; opacity: 0.6;">No active goals</div>'}
        </div>`;
    }
}

/**
 * Register the welcome view provider
 */
export function registerWelcomeView(context: vscode.ExtensionContext): WelcomeViewProvider {
    const provider = new WelcomeViewProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            WelcomeViewProvider.viewType,
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );
    
    // Register refresh command
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.refreshWelcomeView', () => {
            provider.refresh();
        })
    );
    
    return provider;
}
