import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
  checkHealth,
  HealthCheckResult,
  HealthStatus,
} from "../shared/healthCheck";
import { detectGlobalKnowledgeRepo } from "../chat/globalKnowledge";
import { detectPersona, loadUserProfile, Persona, PersonaDetectionResult } from "../chat/personaDetection";
// Knowledge summary moved to Health Dashboard - see globalKnowledge.ts
import { getSyncStatus, getLastSyncTimestamp } from "../chat/cloudSync";
import { getCurrentSession, isSessionActive, Session } from "../commands/session";
import { getGoalsSummary, LearningGoal } from "../commands/goals";
import { escapeHtml } from "../shared/sanitize";
import { isOperationInProgress } from "../extension";

/**
 * Nudge types for contextual reminders
 */
interface Nudge {
  type: 'dream' | 'sync' | 'streak' | 'health' | 'tip' | 'focus';
  icon: string;
  message: string;
  action?: string;
  actionLabel?: string;
  priority: number; // Lower = higher priority
}

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
          // Open Agent mode directly (no clipboard clutter)
          vscode.commands.executeCommand("workbench.action.chat.openAgent");
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
        case "runAudit":
          vscode.commands.executeCommand("alex.runAudit");
          break;
        case "releasePreflight":
          vscode.commands.executeCommand("alex.releasePreflight");
          break;
        case "debugThis":
          vscode.commands.executeCommand("alex.debugThis");
          break;
        case "generateDiagram":
          vscode.commands.executeCommand("alex.generateDiagram");
          break;
        case "readAloud":
          vscode.commands.executeCommand("alex.readAloud");
          break;
        case "skillReview":
          vscode.commands.executeCommand("alex.skillReview");
          break;
        case "openMarketplace":
          vscode.env.openExternal(vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture"));
          break;
        case "openGitHub":
          vscode.env.openExternal(vscode.Uri.parse("https://github.com/fabioc-aloha/Alex_Plug_In"));
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
      const [health, syncStatus, goalsSummary, lastSyncDate, lastDreamDate, gkRepoPath] =
        await Promise.all([
          checkHealth(false),
          getSyncStatus(),
          getGoalsSummary(),
          getLastSyncTimestamp(),
          this._getLastDreamDate(),
          detectGlobalKnowledgeRepo(),
        ]);

      const session = getCurrentSession();
      const hasGlobalKnowledge = gkRepoPath !== null;
      
      // Detect persona from user profile
      let personaResult: PersonaDetectionResult | null = null;
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders) {
        const userProfile = await loadUserProfile(workspaceFolders[0].uri.fsPath);
        personaResult = await detectPersona(userProfile, workspaceFolders);
      }
      
      // Get extension version
      const extension = vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture');
      const version = extension?.packageJSON?.version || '0.0.0';

      // Generate nudges based on current state
      const nudges = this._generateNudges(health, syncStatus, goalsSummary, lastSyncDate, lastDreamDate, session);

      this._view.webview.html = this._getHtmlContent(
        this._view.webview,
        health,
        syncStatus,
        session,
        goalsSummary,
        version,
        nudges,
        hasGlobalKnowledge,
        personaResult,
      );
    } catch (err) {
      this._view.webview.html = this._getErrorHtml(err);
    }
  }

  /**
   * Get the last dream report date from episodic folder
   */
  private async _getLastDreamDate(): Promise<Date | null> {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {return null;}
      
      const episodicPath = path.join(workspaceFolders[0].uri.fsPath, ".github", "episodic");
      if (!fs.existsSync(episodicPath)) {return null;}

      const files = fs.readdirSync(episodicPath)
        .filter(f => f.startsWith('dream-report-') && f.endsWith('.md'))
        .sort()
        .reverse();

      if (files.length === 0) {return null;}

      // Parse timestamp from filename: dream-report-1738456789123.md
      const match = files[0].match(/dream-report-(\d+)\.md/);
      if (match) {
        return new Date(parseInt(match[1], 10));
      }
    } catch {
      // Ignore errors
    }
    return null;
  }

  /**
   * Generate contextual nudges based on current state
   * Returns max 2 nudges to avoid overwhelming the user
   */
  private _generateNudges(
    health: HealthCheckResult,
    syncStatus: { status: string; message: string },
    goals: { activeGoals: LearningGoal[]; streakDays: number; completedToday: number },
    lastSyncDate: Date | null,
    lastDreamDate: Date | null,
    session: Session | null
  ): Nudge[] {
    const nudges: Nudge[] = [];
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    // Active focus session reminder (high priority)
    if (session && !session.isPaused && !session.isBreak) {
      const remainingMins = Math.floor(session.remaining / 60);
      const goalReminder = goals.activeGoals.length > 0 
        ? ` (🎯 ${goals.activeGoals[0].title})` 
        : '';
      nudges.push({
        type: 'focus',
        icon: '🎯',
        message: `Focus: "${session.topic}" — ${remainingMins}m left${goalReminder}`,
        action: 'sessionActions',
        actionLabel: 'Actions',
        priority: 0  // Highest priority — keep user focused
      });
    }

    // Check health issues (highest priority)
    if (health.status !== HealthStatus.Healthy && health.brokenSynapses > 3) {
      nudges.push({
        type: 'health',
        icon: '⚠️',
        message: `${health.brokenSynapses} broken synapses need repair`,
        action: 'dream',
        actionLabel: 'Run Dream',
        priority: 1
      });
    }

    // Check streak at risk (high priority)
    if (goals.streakDays > 0 && goals.completedToday === 0) {
      nudges.push({
        type: 'streak',
        icon: '🔥',
        message: `${goals.streakDays}-day streak at risk! Complete a goal today.`,
        action: 'showGoals',
        actionLabel: 'View Goals',
        priority: 2
      });
    }

    // Check last dream date (medium priority)
    if (lastDreamDate) {
      const daysSinceDream = Math.floor((now.getTime() - lastDreamDate.getTime()) / dayMs);
      if (daysSinceDream >= 7) {
        nudges.push({
          type: 'dream',
          icon: '💭',
          message: `Haven't dreamed in ${daysSinceDream} days. Neural maintenance recommended.`,
          action: 'dream',
          actionLabel: 'Dream',
          priority: 3
        });
      }
    } else {
      // Never dreamed in this workspace
      nudges.push({
        type: 'dream',
        icon: '💭',
        message: 'Run Dream to validate your cognitive architecture.',
        action: 'dream',
        actionLabel: 'Dream',
        priority: 5
      });
    }

    // Check sync status (medium priority)
    if (syncStatus.status === 'needs-push' || syncStatus.status === 'needs-pull') {
      nudges.push({
        type: 'sync',
        icon: '☁️',
        message: syncStatus.status === 'needs-push' ? 'Local changes not synced to cloud.' : 'Cloud has updates to pull.',
        action: 'syncKnowledge',
        actionLabel: 'Sync',
        priority: 4
      });
    } else if (lastSyncDate) {
      const daysSinceSync = Math.floor((now.getTime() - lastSyncDate.getTime()) / dayMs);
      if (daysSinceSync >= 14) {
        nudges.push({
          type: 'sync',
          icon: '☁️',
          message: `Last synced ${daysSinceSync} days ago.`,
          action: 'syncKnowledge',
          actionLabel: 'Sync',
          priority: 6
        });
      }
    }

    // Sort by priority and return top 2
    return nudges.sort((a, b) => a.priority - b.priority).slice(0, 2);
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
    syncStatus: { status: string; message: string },
    session: ReturnType<typeof getCurrentSession>,
    goals: {
      activeGoals: LearningGoal[];
      completedToday: number;
      streakDays: number;
      totalCompleted: number;
    },
    version: string,
    nudges: Nudge[],
    hasGlobalKnowledge: boolean,
    personaResult: PersonaDetectionResult | null,
  ): string {
    // Logo URI for webview
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "assets", "logo.svg")
    );

    // Persona display
    const persona = personaResult?.persona;
    const personaBannerNoun = persona?.bannerNoun || 'CODE';
    const personaDisplay = persona ? `<span class="header-persona" title="Detected persona: ${persona.name}">${persona.icon} ${persona.name}</span>` : '';

    // Get workspace/folder name (vscode.workspace.name works for both workspaces and folders)
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceName = vscode.workspace.name || workspaceFolders?.[0]?.name || "No folder open";

    // Count skills in workspace
    let skillCount = 0;
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

    // Health indicator
    const isHealthy = health.status === HealthStatus.Healthy;
    const healthText = isHealthy
      ? "Healthy"
      : `${health.brokenSynapses} issues`;

    // Sync status
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
            gap: 10px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .header-icon {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
        }
        .header-title-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .header-title {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: -0.2px;
        }
        .header-tagline {
            font-size: 10px;
            color: var(--vscode-textLink-foreground);
            font-style: italic;
            letter-spacing: 0.3px;
            opacity: 0.9;
        }
        .header-workspace {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 140px;
        }
        .header-persona {
            font-size: 10px;
            color: var(--vscode-textPreformat-foreground);
            background: var(--vscode-badge-background);
            padding: 2px 6px;
            border-radius: 8px;
            opacity: 0.9;
        }
        .header-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            flex: 1;
        }
        .version-badge {
            background: var(--vscode-badge-background, #4d4d4d);
            color: var(--vscode-badge-foreground, white);
            font-size: 10px;
            font-weight: 500;
            padding: 3px 7px;
            border-radius: 10px;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .version-badge:hover {
            opacity: 0.85;
            transform: scale(1.02);
        }
        .refresh-btn {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            opacity: 0.5;
            font-size: 14px;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.15s ease;
        }
        .refresh-btn:hover {
            opacity: 1;
            background: var(--vscode-toolbar-hoverBackground);
        }
        
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 10px;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .status-item {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 10px;
            border-left: 3px solid transparent;
            transition: border-color 0.15s ease;
        }
        .status-item:hover {
            border-left-color: var(--vscode-focusBorder);
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
            box-shadow: 0 0 4px currentColor;
        }
        .dot-green { background: var(--vscode-charts-green); color: var(--vscode-charts-green); }
        .dot-yellow { background: var(--vscode-charts-yellow); color: var(--vscode-charts-yellow); }
        .dot-red { background: var(--vscode-charts-red); color: var(--vscode-charts-red); }
        .status-num {
            font-weight: 600;
            font-size: 18px;
            color: var(--vscode-foreground);
            line-height: 1;
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
            margin-top: 12px;
            margin-bottom: 6px;
            padding-left: 4px;
            opacity: 0.8;
        }
        .action-group-label:first-child {
            margin-top: 0;
        }
        .action-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            text-align: left;
            transition: all 0.12s ease;
        }
        .action-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            transform: translateX(2px);
        }
        .action-btn.primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        .action-btn.primary:hover {
            background: var(--vscode-button-hoverBackground);
            transform: translateX(2px);
        }
        .action-icon {
            font-size: 14px;
            width: 20px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .action-icon svg {
            width: 16px;
            height: 16px;
        }
        .action-text {
            flex: 1;
        }
        .action-shortcut {
            font-size: 10px;
            opacity: 0.5;
            font-family: var(--vscode-editor-font-family), monospace;
            background: var(--vscode-badge-background);
            padding: 2px 5px;
            border-radius: 3px;
        }
        .premium-badge {
            font-size: 10px;
            margin-left: auto;
            opacity: 0.8;
            animation: pulse-star 2s ease-in-out infinite;
        }
        @keyframes pulse-star {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .action-btn.premium {
            border-left: 2px solid var(--vscode-charts-yellow);
        }
        .action-btn.premium:hover .premium-badge {
            animation: none;
            opacity: 1;
        }
        
        .goals-stats {
            display: flex;
            gap: 16px;
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 10px;
        }
        .goal-item {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 6px;
            transition: transform 0.12s ease;
        }
        .goal-item:hover {
            transform: translateX(2px);
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
        
        /* Nudges Section Styles */
        .nudges-section {
            margin-bottom: 16px;
        }
        .nudge-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: var(--vscode-editor-background);
            border-radius: 6px;
            margin-bottom: 6px;
            border-left: 3px solid var(--vscode-charts-yellow);
            transition: all 0.12s ease;
        }
        .nudge-card:hover {
            transform: translateX(2px);
            border-left-color: var(--vscode-charts-blue);
        }
        .nudge-card.nudge-health {
            border-left-color: var(--vscode-charts-red);
        }
        .nudge-card.nudge-streak {
            border-left-color: var(--vscode-charts-orange, #f0883e);
        }
        .nudge-icon {
            font-size: 16px;
            flex-shrink: 0;
        }
        .nudge-content {
            flex: 1;
            min-width: 0;
        }
        .nudge-message {
            font-size: 12px;
            line-height: 1.3;
        }
        .nudge-action {
            font-size: 11px;
            color: var(--vscode-textLink-foreground);
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.12s ease;
            white-space: nowrap;
        }
        .nudge-action:hover {
            background: var(--vscode-toolbar-hoverBackground);
        }
        
        /* Features Section Styles */
        .features-section details {
            margin: 0;
        }
        .features-section summary {
            cursor: pointer;
            list-style: none;
            user-select: none;
            padding: 4px 0;
            border-radius: 4px;
            transition: color 0.12s ease;
        }
        .features-section summary:hover {
            color: var(--vscode-textLink-foreground);
        }
        .features-section summary::-webkit-details-marker {
            display: none;
        }
        .features-section summary::before {
            content: '▸ ';
            font-size: 11px;
            margin-right: 6px;
            transition: transform 0.15s ease;
            display: inline-block;
        }
        .features-section details[open] summary::before {
            content: '▾ ';
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
            gap: 8px;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid var(--vscode-widget-border);
        }
        .feature-link-btn {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 11px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.12s ease;
        }
        .feature-link-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUri}" alt="Alex" class="header-icon" />
            <div class="header-text">
                <div class="header-title-row">
                    <span class="header-title">Alex Cognitive</span>
                    <span class="version-badge" onclick="cmd('reportIssue')" title="Click to view diagnostics">v${version}</span>
                </div>
                <span class="header-tagline">Take Your ${personaBannerNoun} to New Heights</span>
                ${personaDisplay}
                <span class="header-workspace" title="${this._escapeHtml(workspaceName)}">${this._escapeHtml(workspaceName)}</span>
            </div>
            <button class="refresh-btn" onclick="refresh()" title="Refresh">↻</button>
        </div>
        
        ${sessionHtml}
        
        ${this._getNudgesHtml(nudges)}
        
        <div class="section">
            <div class="section-title clickable" onclick="cmd('healthDashboard')" title="Click to open Health Dashboard">Status</div>
            <div class="status-grid" onclick="cmd('healthDashboard')" style="cursor: pointer;" title="Click to open Health Dashboard">
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
        </div>
        
        <div class="section">
            <div class="section-title">Quick Actions</div>
            <div class="action-list">
                <div class="action-group-label">🧠 Core</div>
                <button class="action-btn primary" onclick="cmd('openChat')">
                    <span class="action-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.25 9a.75.75 0 0 1 .75.75v1.5a.25.25 0 0 0 .25.25h1.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 8.75 13h-1.5A1.75 1.75 0 0 1 5.5 11.25v-1.5A.75.75 0 0 1 6.25 9Z"/><path d="M7.25 1a.75.75 0 0 1 .75.75V3h.5a3.25 3.25 0 0 1 3.163 4.001l.087.094 1.25 1.25a.75.75 0 0 1-1.06 1.06l-.94-.94-.251.228A3.25 3.25 0 0 1 8.5 9.5h-.5v.75a.75.75 0 0 1-1.5 0V9.5h-.5A3.25 3.25 0 0 1 6 3h.5V1.75A.75.75 0 0 1 7.25 1ZM8.5 4.5h-3a1.75 1.75 0 0 0 0 3.5h3a1.75 1.75 0 0 0 0-3.5Z"/><path d="M6.75 6a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm2.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"/></svg></span>
                    <span class="action-text">Chat with GitHub Copilot</span>
                </button>
                <button class="action-btn" onclick="cmd('upgrade')">
                    <span class="action-icon">${hasGlobalKnowledge ? '🌐' : '⬆️'}</span>
                    <span class="action-text">Initialize / Update</span>
                    ${hasGlobalKnowledge ? '<span class="premium-badge" title="Global Knowledge enabled">🌐</span>' : ''}
                </button>
                <button class="action-btn" onclick="cmd('dream')">
                    <span class="action-icon">💭</span>
                    <span class="action-text">Dream (Neural Maintenance)</span>
                    <span class="action-shortcut">⌃⌥D</span>
                </button>
                <button class="action-btn" onclick="cmd('selfActualize')">
                    <span class="action-icon">✨</span>
                    <span class="action-text">Self-Actualize</span>
                    <span class="action-shortcut">⌃⌥S</span>
                </button>
                
                ${hasGlobalKnowledge ? `<div class="action-group-label">📚 Knowledge</div>
                <button class="action-btn" onclick="cmd('syncKnowledge')">
                    <span class="action-icon">☁️</span>
                    <span class="action-text">Sync Knowledge</span>
                    <span class="action-shortcut">⌃⌥K</span>
                </button>
                <button class="action-btn premium" onclick="cmd('knowledgeQuickPick')" title="⭐ Premium feature: Requires Global Knowledge repository">
                    <span class="action-icon">🔎</span>
                    <span class="action-text">Search Knowledge</span>
                    <span class="premium-badge">⭐</span>
                </button>` : ''}
                
                <div class="action-group-label">🛠️ Developer Tools</div>
                <button class="action-btn" onclick="cmd('runAudit')">
                    <span class="action-icon">🔍</span>
                    <span class="action-text">Run Project Audit</span>
                </button>
                <button class="action-btn" onclick="cmd('releasePreflight')">
                    <span class="action-icon">🚀</span>
                    <span class="action-text">Release Preflight</span>
                </button>
                <button class="action-btn" onclick="cmd('debugThis')" title="Select code or error message, then click to generate a debug prompt. Opens Copilot chat - paste to get AI debugging assistance.">
                    <span class="action-icon">🐛</span>
                    <span class="action-text">Debug This (selected code)</span>
                </button>
                <button class="action-btn" onclick="cmd('generateDiagram')">
                    <span class="action-icon">📊</span>
                    <span class="action-text">Generate Diagram</span>
                </button>
                <button class="action-btn" onclick="cmd('readAloud')" title="Read selected text or document aloud using Microsoft Edge neural voices">
                    <span class="action-icon">🔊</span>
                    <span class="action-text">Read Aloud</span>
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
                
                <div class="action-group-label">⚙️ System</div>
                <button class="action-btn" onclick="cmd('exportM365')" title="Package your global knowledge, profile, and insights for M365 Copilot. Auto-syncs to OneDrive/Alex-Memory/ if detected. Enable 'alex.m365.autoSync' for automatic sync after Dream operations.">
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
                <button class="action-btn" onclick="cmd('reportIssue')" title="View diagnostics, telemetry data, and report bugs">
                    <span class="action-icon">🩺</span>
                    <span class="action-text">Diagnostics</span>
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
   * Generate the Nudges section HTML (contextual reminders)
   * Only shows when there are actionable nudges
   */
  private _getNudgesHtml(nudges: Nudge[]): string {
    if (nudges.length === 0) {
      return '';
    }

    const nudgesHtml = nudges.map(nudge => {
      const typeClass = `nudge-${nudge.type}`;
      const actionHtml = nudge.action 
        ? `<button class="nudge-action" onclick="cmd('${nudge.action}')">${nudge.actionLabel}</button>`
        : '';
      
      return `
        <div class="nudge-card ${typeClass}">
            <span class="nudge-icon">${nudge.icon}</span>
            <div class="nudge-content">
                <span class="nudge-message">${this._escapeHtml(nudge.message)}</span>
            </div>
            ${actionHtml}
        </div>`;
    }).join('');

    return `
        <div class="nudges-section">
            ${nudgesHtml}
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
                            <li><strong>Skill Library</strong> - 54 portable skills with triggers and synaptic connections</li>
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
                        <button class="feature-link-btn" onclick="cmd('openMarketplace')">🏪 Marketplace</button>
                        <button class="feature-link-btn" onclick="cmd('openGitHub')">🐙 GitHub</button>
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
