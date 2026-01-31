import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
  checkHealth,
  HealthCheckResult,
  HealthStatus,
} from "../shared/healthCheck";
import { getGlobalKnowledgeSummary } from "../chat/globalKnowledge";
import { getSyncStatus } from "../chat/cloudSync";
import { getCurrentSession, isSessionActive } from "../commands/session";
import { getGoalsSummary, LearningGoal } from "../commands/goals";
import { escapeHtml } from "../shared/sanitize";
import { isOperationInProgress } from "../extension";

/**
 * Welcome View Provider - Activity Bar panel with health, quick actions, and recent activity
 */
export class WelcomeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "alex.welcomeView";

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
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getLoadingHtml();

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      // Commands that use operation lock - check before executing
      const lockedCommands = ["dream", "syncKnowledge", "setupEnvironment"];

      if (lockedCommands.includes(message.command) && isOperationInProgress()) {
        vscode.window.showWarningMessage(
          "Another Alex operation is already in progress. Please wait for it to complete.",
        );
        return;
      }

      switch (message.command) {
        case "startSession":
          vscode.commands.executeCommand("alex.startSession");
          break;
        case "meditate":
          vscode.commands.executeCommand(
            "workbench.panel.chat.view.copilot.focus",
          );
          // Could auto-type @alex /meditate
          break;
        case "dream":
          vscode.commands.executeCommand("alex.dream");
          break;
        case "selfActualize":
          vscode.commands.executeCommand("alex.selfActualize");
          break;
        case "syncKnowledge":
          vscode.commands.executeCommand("alex.syncKnowledge");
          break;
        case "exportM365":
          vscode.commands.executeCommand("alex.exportForM365");
          break;
        case "openDocs":
          vscode.commands.executeCommand("alex.openDocs");
          break;
        case "upgrade":
          vscode.commands.executeCommand("alex.upgrade");
          break;
        case "showStatus":
          vscode.commands.executeCommand("alex.showStatus");
          break;
        case "showGoals":
          vscode.commands.executeCommand("alex.showGoals");
          break;
        case "createGoal":
          vscode.commands.executeCommand("alex.createGoal");
          break;
        case "setupEnvironment":
          vscode.commands.executeCommand("alex.setupEnvironment");
          break;
        case "reportIssue":
          vscode.commands.executeCommand("alex.viewBetaTelemetry");
          break;
        case "openChat":
          vscode.commands.executeCommand("workbench.panel.chat.view.copilot.focus");
          break;
        case "generateSkillCatalog":
          vscode.commands.executeCommand("alex.generateSkillCatalog");
          break;
        case "knowledgeQuickPick":
          vscode.commands.executeCommand("alex.knowledgeQuickPick");
          break;
        case "healthDashboard":
          vscode.commands.executeCommand("alex.openHealthDashboard");
          break;
        case "refresh":
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
      const [health, knowledgeSummary, syncStatus, goalsSummary] =
        await Promise.all([
          checkHealth(false),
          getGlobalKnowledgeSummary(),
          getSyncStatus(),
          getGoalsSummary(),
        ]);

      const session = getCurrentSession();

      this._view.webview.html = this._getHtmlContent(
        this._view.webview,
        health,
        knowledgeSummary,
        syncStatus,
        session,
        goalsSummary,
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
    webview: vscode.Webview,
    health: HealthCheckResult,
    knowledge: { totalPatterns: number; totalInsights: number } | null,
    syncStatus: { status: string; message: string },
    session: ReturnType<typeof getCurrentSession>,
    goals: {
      activeGoals: LearningGoal[];
      completedToday: number;
      streakDays: number;
      totalCompleted: number;
    },
  ): string {
    // Logo URI for webview
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "assets", "logo.svg")
    );

    // Count skills in workspace
    let skillCount = 0;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      const skillsPath = path.join(workspaceFolders[0].uri.fsPath, ".github", "skills");
      try {
        if (fs.existsSync(skillsPath)) {
          skillCount = fs.readdirSync(skillsPath).filter(f => 
            fs.statSync(path.join(skillsPath, f)).isDirectory()
          ).length;
        }
      } catch { /* ignore */ }
    }

    // Goals summary
    const activeGoalCount = goals.activeGoals.length;
    const streakDays = goals.streakDays;
    const completedToday = goals.completedToday;

    // Health indicator
    const isHealthy = health.status === HealthStatus.Healthy;
    const healthIcon = isHealthy
      ? "🟢"
      : health.brokenSynapses > 5
        ? "🔴"
        : "🟡";
    const healthText = isHealthy
      ? "Healthy"
      : `${health.brokenSynapses} issues`;

    // Knowledge stats
    const patterns = knowledge?.totalPatterns ?? 0;
    const insights = knowledge?.totalInsights ?? 0;

    // Sync status
    const syncIcon =
      syncStatus.status === "up-to-date"
        ? "✅"
        : syncStatus.status === "error"
          ? "❌"
          : "🔄";
    const lastSyncText = syncStatus.message;

    // Session status
    const sessionHtml = session
      ? `
            <div class="session-card">
                <div class="session-header">
                    <span class="session-icon">${session.isBreak ? "☕" : "🎯"}</span>
                    <span class="session-title">${this._escapeHtml(session.topic)}</span>
                </div>
                <div class="session-timer">${this._formatTime(session.remaining)}</div>
                <div class="session-status">${session.isPaused ? "⏸️ Paused" : "▶️ Active"}${session.pomodoroCount > 0 ? ` • 🍅×${session.pomodoroCount}` : ""}</div>
            </div>
        `
      : "";

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
            width: 24px;
            height: 24px;
        }
        .header-title {
            font-size: 14px;
            font-weight: 600;
        }
        .beta-badge {
            background: var(--vscode-charts-purple, #a855f7);
            color: white;
            font-size: 9px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 3px;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .beta-badge:hover {
            opacity: 0.8;
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
            border-left: 2px solid transparent;
        }
        .status-item.status-good {
            border-left-color: var(--vscode-charts-green);
        }
        .status-item.status-warn {
            border-left-color: var(--vscode-charts-yellow);
        }
        .status-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 2px;
        }
        .status-value {
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .dot-green { background: var(--vscode-charts-green); }
        .dot-yellow { background: var(--vscode-charts-yellow); }
        .dot-red { background: var(--vscode-charts-red); }
        .status-num {
            font-weight: 600;
            font-size: 16px;
            color: var(--vscode-foreground);
        }
        .status-unit {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            font-weight: normal;
        }
        .status-completed {
            font-size: 10px;
            color: var(--vscode-charts-green);
            font-weight: 500;
        }
        .status-item.status-streak {
            border-left-color: var(--vscode-charts-orange, #f97316);
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
        .action-group-label {
            font-size: 10px;
            font-weight: 600;
            color: var(--vscode-descriptionForeground);
            margin-top: 10px;
            margin-bottom: 4px;
            padding-left: 2px;
        }
        .action-group-label:first-child {
            margin-top: 0;
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
        
        /* Features Section Styles */
        .features-section details {
            margin: 0;
        }
        .features-section summary {
            cursor: pointer;
            list-style: none;
            user-select: none;
        }
        .features-section summary::-webkit-details-marker {
            display: none;
        }
        .features-section summary::before {
            content: '▶ ';
            font-size: 10px;
            margin-right: 4px;
        }
        .features-section details[open] summary::before {
            content: '▼ ';
        }
        .section-title.clickable {
            cursor: pointer;
        }
        .section-title.clickable:hover {
            color: var(--vscode-textLink-foreground);
        }
        .features-content {
            margin-top: 12px;
            padding: 0 4px;
        }
        .feature-category {
            margin-bottom: 12px;
        }
        .feature-category-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--vscode-foreground);
            margin-bottom: 6px;
        }
        .feature-list {
            margin: 0;
            padding-left: 16px;
            font-size: 11px;
            line-height: 1.6;
            color: var(--vscode-descriptionForeground);
        }
        .feature-list li {
            margin-bottom: 4px;
        }
        .feature-list strong {
            color: var(--vscode-foreground);
            font-weight: 500;
        }
        .feature-links {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--vscode-widget-border);
        }
        .feature-link-btn {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .feature-link-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUri}" alt="Alex" class="header-icon" />
            <span class="header-title">Alex Cognitive</span>
            <span class="beta-badge" onclick="cmd('reportIssue')" title="Click to view diagnostics">BETA</span>
            <button class="refresh-btn" onclick="refresh()" title="Refresh">↻</button>
        </div>
        
        ${sessionHtml}
        
        <div class="section">
            <div class="section-title">Status</div>
            <div class="status-grid">
                <div class="status-item ${isHealthy ? 'status-good' : 'status-warn'}">
                    <div class="status-label">Health</div>
                    <div class="status-value"><span class="status-dot ${isHealthy ? 'dot-green' : health.brokenSynapses > 5 ? 'dot-red' : 'dot-yellow'}"></span>${healthText}</div>
                </div>
                <div class="status-item ${syncStatus.status === 'up-to-date' ? 'status-good' : ''}">
                    <div class="status-label">Sync</div>
                    <div class="status-value"><span class="status-dot ${syncStatus.status === 'up-to-date' ? 'dot-green' : syncStatus.status === 'error' ? 'dot-red' : 'dot-yellow'}"></span>${lastSyncText}</div>
                </div>
                <div class="status-item">
                    <div class="status-label">Skills</div>
                    <div class="status-value"><span class="status-num">${skillCount}</span></div>
                </div>
                <div class="status-item">
                    <div class="status-label">Synapses</div>
                    <div class="status-value"><span class="status-num">${health.totalSynapses}</span></div>
                </div>
            </div>
            <div class="status-grid" style="margin-top: 8px;">
                <div class="status-item">
                    <div class="status-label">Patterns</div>
                    <div class="status-value"><span class="status-num">${patterns}</span></div>
                </div>
                <div class="status-item">
                    <div class="status-label">Insights</div>
                    <div class="status-value"><span class="status-num">${insights}</span></div>
                </div>
                <div class="status-item ${streakDays > 0 ? 'status-streak' : ''}">
                    <div class="status-label">Streak</div>
                    <div class="status-value">${streakDays > 0 ? '🔥' : ''}<span class="status-num">${streakDays}</span> <span class="status-unit">days</span></div>
                </div>
                <div class="status-item">
                    <div class="status-label">Goals</div>
                    <div class="status-value"><span class="status-num">${activeGoalCount}</span> <span class="status-unit">active</span>${completedToday > 0 ? ` <span class="status-completed">+${completedToday} today</span>` : ''}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Quick Actions</div>
            <div class="action-list">
                <div class="action-group-label">🧠 Core</div>
                <button class="action-btn primary" onclick="cmd('dream')">
                    <span class="action-icon">💭</span>
                    <span class="action-text">Dream (Neural Maintenance)</span>
                    <span class="action-shortcut">⌃⌥D</span>
                </button>
                <button class="action-btn" onclick="cmd('selfActualize')">
                    <span class="action-icon">✨</span>
                    <span class="action-text">Self-Actualize</span>
                    <span class="action-shortcut">⌃⌥S</span>
                </button>
                <button class="action-btn" onclick="cmd('healthDashboard')">
                    <span class="action-icon">📊</span>
                    <span class="action-text">Health Dashboard</span>
                </button>
                
                <div class="action-group-label">📚 Knowledge</div>
                <button class="action-btn" onclick="cmd('syncKnowledge')">
                    <span class="action-icon">☁️</span>
                    <span class="action-text">Sync Knowledge</span>
                    <span class="action-shortcut">⌃⌥K</span>
                </button>
                <button class="action-btn" onclick="cmd('knowledgeQuickPick')">
                    <span class="action-icon">🔍</span>
                    <span class="action-text">Search Knowledge</span>
                </button>
                <button class="action-btn" onclick="cmd('generateSkillCatalog')">
                    <span class="action-icon">🌐</span>
                    <span class="action-text">Generate Skill Catalog</span>
                </button>
                
                <div class="action-group-label">⚖️ Work-Life Balance</div>
                <button class="action-btn" onclick="cmd('startSession')">
                    <span class="action-icon">🍅</span>
                    <span class="action-text">Start Focus Session</span>
                </button>
                <button class="action-btn" onclick="cmd('showGoals')">
                    <span class="action-icon">🎯</span>
                    <span class="action-text">Manage Goals</span>
                </button>
                <button class="action-btn" onclick="cmd('openChat')">
                    <span class="action-icon">💬</span>
                    <span class="action-text">Chat with @alex</span>
                </button>
                
                <div class="action-group-label">⚙️ System</div>
                <button class="action-btn" onclick="cmd('upgrade')">
                    <span class="action-icon">⬆️</span>
                    <span class="action-text">Upgrade Architecture</span>
                </button>
                <button class="action-btn" onclick="cmd('exportM365')" title="Package your global knowledge, profile, and insights for M365 Copilot. Upload the exported folder to OneDrive/Alex-Memory/ to use with the M365 Alex agent.">
                    <span class="action-icon">📦</span>
                    <span class="action-text">Export for M365</span>
                </button>
                <button class="action-btn" onclick="cmd('setupEnvironment')">
                    <span class="action-icon">⚙️</span>
                    <span class="action-text">Setup Environment</span>
                </button>
                <button class="action-btn" onclick="cmd('openDocs')">
                    <span class="action-icon">📚</span>
                    <span class="action-text">Documentation</span>
                    <span class="action-shortcut">⌃⌥H</span>
                </button>
                <button class="action-btn" onclick="cmd('reportIssue')">
                    <span class="action-icon">🐛</span>
                    <span class="action-text">Report Issue / Diagnostics</span>
                </button>
            </div>
        </div>
        
        ${this._getGoalsHtml(goals)}
        
        ${this._getFeaturesHtml()}
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  private _formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      return "Just now";
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  private _getGoalsHtml(goals: {
    activeGoals: LearningGoal[];
    completedToday: number;
    streakDays: number;
    totalCompleted: number;
  }): string {
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
    const goalsListHtml = goals.activeGoals
      .slice(0, 3)
      .map((goal) => {
        const progress = Math.round(
          (goal.currentCount / goal.targetCount) * 100,
        );
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
      })
      .join("");

    return `
        <div class="section">
            <div class="section-title">Learning Goals ${goals.streakDays > 0 ? `<span style="float: right;">🔥 ${goals.streakDays} day streak</span>` : ""}</div>
            <div class="goals-stats">
                <span>✅ ${goals.completedToday} today</span>
                <span>🏆 ${goals.totalCompleted} total</span>
            </div>
            ${goalsListHtml || '<div style="text-align: center; padding: 8px; opacity: 0.6;">No active goals</div>'}
        </div>`;
  }

  /**
   * Generate the Features/Documentation section HTML
   */
  private _getFeaturesHtml(): string {
    return `
        <div class="section features-section">
            <details>
                <summary class="section-title clickable">📖 Features & Documentation</summary>
                <div class="features-content">
                    <div class="feature-category">
                        <div class="feature-category-title">🧠 Cognitive Core</div>
                        <ul class="feature-list">
                            <li><strong>Dream Protocol</strong> - Automated neural maintenance, synapse validation, and architecture health checks</li>
                            <li><strong>Self-Actualization</strong> - Deep meditation with comprehensive architecture assessment and knowledge promotion</li>
                            <li><strong>Meditation</strong> - Conscious knowledge consolidation via chat (@alex /meditate)</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category">
                        <div class="feature-category-title">📚 Knowledge Management</div>
                        <ul class="feature-list">
                            <li><strong>Global Knowledge</strong> - Cross-project patterns and insights stored in ~/.alex/</li>
                            <li><strong>Cloud Sync</strong> - Automatic backup to GitHub Gists with conflict resolution</li>
                            <li><strong>Skill Library</strong> - 38 portable skills with triggers and synaptic connections</li>
                            <li><strong>Domain Learning</strong> - Bootstrap new domains through conversational acquisition</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category">
                        <div class="feature-category-title">⚖️ Work-Life Balance</div>
                        <ul class="feature-list">
                            <li><strong>Focus Sessions</strong> - Pomodoro-style work sessions with breaks and automatic tracking</li>
                            <li><strong>Learning Goals</strong> - Track progress with targets, streaks, and achievements</li>
                            <li><strong>Health Dashboard</strong> - Visual architecture status and cognitive metrics</li>
                            <li><strong>Streak Protection</strong> - Stay motivated with daily progress indicators</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category">
                        <div class="feature-category-title">💬 Chat Integration</div>
                        <ul class="feature-list">
                            <li><strong>@alex Chat Participant</strong> - Personality-driven conversations with memory</li>
                            <li><strong>11 Language Model Tools</strong> - Status, memory search, knowledge management</li>
                            <li><strong>Custom Agents</strong> - Specialized handoffs for meditation, dreams, Azure</li>
                            <li><strong>Slash Commands</strong> - /meditate, /status, /knowledge, /saveinsight, and more</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category">
                        <div class="feature-category-title">🌐 Cross-Platform</div>
                        <ul class="feature-list">
                            <li><strong>M365 Export</strong> - Package knowledge for Microsoft 365 Copilot integration</li>
                            <li><strong>Architecture Upgrade</strong> - Seamless migration between versions with backup</li>
                            <li><strong>User Profile</strong> - Personalized communication style and preferences</li>
                        </ul>
                    </div>
                    
                    <div class="feature-category">
                        <div class="feature-category-title">📖 Documentation Guides</div>
                        <ul class="feature-list">
                            <li><strong>Work-Life Balance</strong> - Focus sessions, goals, streaks, and sustainable productivity</li>
                            <li><strong>M365 Export</strong> - Bridge your knowledge to Microsoft 365 Copilot</li>
                            <li><strong>Global Knowledge</strong> - Cross-project patterns and insights</li>
                            <li><strong>User Manual</strong> - Complete feature reference and tutorials</li>
                        </ul>
                    </div>
                    
                    <div class="feature-links">
                        <button class="feature-link-btn" onclick="cmd('openDocs')">📚 Full Documentation</button>
                        <button class="feature-link-btn" onclick="window.open('https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture')">🏪 Marketplace</button>
                        <button class="feature-link-btn" onclick="window.open('https://github.com/fabioc-aloha/Alex_Plug_In')">🐙 GitHub</button>
                    </div>
                </div>
            </details>
        </div>`;
  }
}

/**
 * Register the welcome view provider
 */
export function registerWelcomeView(
  context: vscode.ExtensionContext,
): WelcomeViewProvider {
  const provider = new WelcomeViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WelcomeViewProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      },
    ),
  );

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand("alex.refreshWelcomeView", () => {
      provider.refresh();
    }),
  );

  return provider;
}
