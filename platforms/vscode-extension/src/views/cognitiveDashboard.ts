/**
 * Cognitive Dashboard v5.2.0
 * 
 * Unified dashboard consolidating:
 * - Brain Health (synapse status)
 * - Memory Architecture (skills, instructions, prompts)
 * - Goal Progress
 * - Focus Session Stats
 * - Recent Activity
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../shared/workspaceFs';
import { getNonce } from '../shared/sanitize';
import { WorkspaceGoalsData } from '../shared/constants';

/**
 * Dashboard data structure
 */
interface DashboardData {
  version: string;
  lastUpdated: string;
  health: {
    overall: 'healthy' | 'warning' | 'critical';
    synapseCount: number;
    healthySynapses: number;
    brokenSynapses: number;
  };
  memory: {
    skillCount: number;
    instructionCount: number;
    promptCount: number;
    episodicCount: number;
  };
  goals: {
    active: number;
    completed: number;
    streak: number;
  };
  focus: {
    todayMinutes: number;
    weekMinutes: number;
    sessionsToday: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

/**
 * Cognitive Dashboard Provider
 */
export class CognitiveDashboardProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'alex.cognitiveDashboard';

  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;
  private _refreshInterval?: NodeJS.Timeout;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._extensionUri = context.extensionUri;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async message => {
      switch (message.command) {
        case 'refresh':
          await this.refresh();
          break;
        case 'dream':
          await vscode.commands.executeCommand('alex.dream');
          break;
        case 'selfActualize':
          await vscode.commands.executeCommand('alex.selfActualize');
          break;
        case 'syncKnowledge':
          await vscode.commands.executeCommand('alex.syncKnowledge');
          break;
        case 'startSession':
          await vscode.commands.executeCommand('alex.startSession');
          break;
      }
    });

    // Start auto-refresh
    const refreshInterval = vscode.workspace.getConfiguration('alex.dashboard').get('refreshInterval', 30);
    this._refreshInterval = setInterval(() => this.refresh(), refreshInterval * 1000);

    // Initial data load
    this.refresh();

    // Clean up interval on dispose
    webviewView.onDidDispose(() => {
      if (this._refreshInterval) {
        clearInterval(this._refreshInterval);
      }
    });
  }

  /**
   * Refresh dashboard data
   */
  public async refresh(): Promise<void> {
    if (!this._view) {return;}

    const data = await this.collectDashboardData();
    this._view.webview.postMessage({ command: 'update', data });
  }

  /**
   * Collect all dashboard data
   */
  private async collectDashboardData(): Promise<DashboardData> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    const data: DashboardData = {
      version: this.context.extension.packageJSON.version || '5.2.0',
      lastUpdated: new Date().toISOString(),
      health: {
        overall: 'healthy',
        synapseCount: 0,
        healthySynapses: 0,
        brokenSynapses: 0,
      },
      memory: {
        skillCount: 0,
        instructionCount: 0,
        promptCount: 0,
        episodicCount: 0,
      },
      goals: {
        active: 0,
        completed: 0,
        streak: 0,
      },
      focus: {
        todayMinutes: 0,
        weekMinutes: 0,
        sessionsToday: 0,
      },
      recentActivity: [],
    };

    if (!workspaceFolder) {return data;}

    const rootPath = workspaceFolder.uri.fsPath;
    const githubPath = path.join(rootPath, '.github');

    try {
      // Count skills (async)
      const skillsPath = path.join(githubPath, 'skills');
      if (await workspaceFs.pathExists(skillsPath)) {
        const skillDirs = await workspaceFs.readDirectory(skillsPath);
        data.memory.skillCount = skillDirs.filter(([_, fileType]) => fileType === vscode.FileType.Directory).length;
      }

      // Count instructions (async)
      const instructionsPath = path.join(githubPath, 'instructions');
      if (await workspaceFs.pathExists(instructionsPath)) {
        const files = await workspaceFs.readDirectory(instructionsPath);
        data.memory.instructionCount = files.filter(([name, _]) => name.endsWith('.instructions.md')).length;
      }

      // Count prompts (async)
      const promptsPath = path.join(githubPath, 'prompts');
      if (await workspaceFs.pathExists(promptsPath)) {
        const files = await workspaceFs.readDirectory(promptsPath);
        data.memory.promptCount = files.filter(([name, _]) => name.endsWith('.prompt.md')).length;
      }

      // Count episodic memories (async)
      const episodicPath = path.join(githubPath, 'episodic');
      if (await workspaceFs.pathExists(episodicPath)) {
        const files = await workspaceFs.readDirectory(episodicPath);
        data.memory.episodicCount = files.filter(([name, _]) => name.endsWith('.md')).length;
      }

      // Read goals (async)
      const goalsPath = path.join(githubPath, 'config', 'goals.json');
      if (await workspaceFs.pathExists(goalsPath)) {
        try {
          const goalsContent = await workspaceFs.readFile(goalsPath);
          const goals: WorkspaceGoalsData = JSON.parse(goalsContent);
          if (Array.isArray(goals.goals)) {
            data.goals.active = goals.goals.filter((g) => g.status === 'in-progress').length;
            data.goals.completed = goals.goals.filter((g) => g.status === 'completed').length;
          }
          data.goals.streak = typeof goals.streak === 'number' ? goals.streak : 0;
        } catch {
          // JSON parse error
        }
      }

      // Check synapse health by scanning skill directories (async)
      let totalSynapses = 0;
      let healthySynapses = 0;
      let brokenSynapses = 0;

      if (await workspaceFs.pathExists(skillsPath)) {
        const skillDirs = (await workspaceFs.readDirectory(skillsPath))
          .filter(([_, fileType]) => fileType === vscode.FileType.Directory);

        for (const [dirName, _] of skillDirs) {
          const synapsePath = path.join(skillsPath, dirName, 'synapses.json');
          if (await workspaceFs.pathExists(synapsePath)) {
            totalSynapses++;
            try {
              const content = await workspaceFs.readFile(synapsePath);
              JSON.parse(content); // Validates JSON
              healthySynapses++;
            } catch {
              brokenSynapses++;
            }
          }
        }
      }

      data.health.synapseCount = totalSynapses;
      data.health.healthySynapses = healthySynapses;
      data.health.brokenSynapses = brokenSynapses;
      data.health.overall = brokenSynapses > 0 
        ? (brokenSynapses > 5 ? 'critical' : 'warning') 
        : 'healthy';

      // Collect recent activity from episodic (async)
      if (await workspaceFs.pathExists(episodicPath)) {
        const entries = await workspaceFs.readDirectory(episodicPath);
        const files = entries
          .map(([name, _]) => name)
          .filter(f => f.endsWith('.md'))
          .sort()
          .reverse()
          .slice(0, 5);

        for (const file of files) {
          const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
          data.recentActivity.push({
            type: file.includes('meditation') ? 'meditation' : 
                  file.includes('session') ? 'session' : 'activity',
            description: file.replace('.md', '').replace(/-/g, ' '),
            timestamp: dateMatch ? dateMatch[1] : 'Unknown',
          });
        }
      }

    } catch (error) {
      console.warn('[Alex Dashboard] Error collecting data:', error);
    }

    return data;
  }

  /**
   * Generate HTML for webview
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>Alex Cognitive Dashboard</title>
  <style>
    :root {
      --bg-primary: var(--vscode-editor-background);
      --bg-secondary: var(--vscode-sideBar-background);
      --text-primary: var(--vscode-editor-foreground);
      --text-secondary: var(--vscode-descriptionForeground);
      --border-color: var(--vscode-panel-border);
      --accent-green: #22c55e;
      --accent-yellow: #eab308;
      --accent-red: #ef4444;
      --accent-blue: #3b82f6;
    }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--text-primary);
      background: var(--bg-primary);
      padding: 16px;
      margin: 0;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .dashboard-title {
      font-size: 1.4em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .refresh-btn {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    .refresh-btn:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .card-title {
      font-size: 1.1em;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .stat-item {
      text-align: center;
      padding: 12px;
      background: var(--bg-primary);
      border-radius: 6px;
    }

    .stat-value {
      font-size: 1.8em;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.85em;
      color: var(--text-secondary);
    }

    .health-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .health-healthy { background: var(--accent-green); }
    .health-warning { background: var(--accent-yellow); }
    .health-critical { background: var(--accent-red); }

    .activity-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .activity-item {
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-type {
      font-size: 0.85em;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--accent-blue);
      color: white;
    }

    .activity-timestamp {
      font-size: 0.8em;
      color: var(--text-secondary);
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .quick-action {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
    }

    .quick-action:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }

    .streak-badge {
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    .version-info {
      font-size: 0.8em;
      color: var(--text-secondary);
      text-align: center;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="dashboard-header">
    <div class="dashboard-title">
      🧠 Cognitive Dashboard
    </div>
    <button class="refresh-btn" data-cmd="refresh">↻ Refresh</button>
  </div>

  <div class="card" id="health-card">
    <div class="card-title">
      <span class="health-indicator health-healthy" id="health-dot"></span>
      Brain Health
    </div>
    <div class="stat-grid">
      <div class="stat-item">
        <div class="stat-value" id="synapse-count">0</div>
        <div class="stat-label">Synapses</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="healthy-count">0</div>
        <div class="stat-label">Healthy</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">📚 Memory Architecture</div>
    <div class="stat-grid">
      <div class="stat-item">
        <div class="stat-value" id="skill-count">0</div>
        <div class="stat-label">Skills</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="instruction-count">0</div>
        <div class="stat-label">Instructions</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="prompt-count">0</div>
        <div class="stat-label">Prompts</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="episodic-count">0</div>
        <div class="stat-label">Episodic</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      🎯 Goals
      <span class="streak-badge" id="streak-badge" style="display:none">🔥 0 days</span>
    </div>
    <div class="stat-grid">
      <div class="stat-item">
        <div class="stat-value" id="goals-active">0</div>
        <div class="stat-label">Active</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="goals-completed">0</div>
        <div class="stat-label">Completed</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">⚡ Quick Actions</div>
    <div class="quick-actions">
      <button class="quick-action" data-cmd="dream">🌙 Dream</button>
      <button class="quick-action" data-cmd="selfActualize">✨ Self-Actualize</button>
      <button class="quick-action" data-cmd="syncKnowledge">🔄 Sync</button>
      <button class="quick-action" data-cmd="startSession">▶️ Session</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">📋 Recent Activity</div>
    <ul class="activity-list" id="activity-list">
      <li class="activity-item">
        <span>No recent activity</span>
      </li>
    </ul>
  </div>

  <div class="version-info" id="version-info">
    Alex v5.2.0
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    // Event delegation for all data-cmd clicks (CSP-compliant)
    document.addEventListener('click', function(e) {
      const el = e.target.closest('[data-cmd]');
      if (el) {
        e.preventDefault();
        const command = el.getAttribute('data-cmd');
        vscode.postMessage({ command });
      }
    });

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === 'update') {
        updateDashboard(message.data);
      }
    });

    function updateDashboard(data) {
      // Health
      document.getElementById('synapse-count').textContent = data.health.synapseCount;
      document.getElementById('healthy-count').textContent = data.health.healthySynapses;
      
      const healthDot = document.getElementById('health-dot');
      healthDot.className = 'health-indicator health-' + data.health.overall;

      // Memory
      document.getElementById('skill-count').textContent = data.memory.skillCount;
      document.getElementById('instruction-count').textContent = data.memory.instructionCount;
      document.getElementById('prompt-count').textContent = data.memory.promptCount;
      document.getElementById('episodic-count').textContent = data.memory.episodicCount;

      // Goals
      document.getElementById('goals-active').textContent = data.goals.active;
      document.getElementById('goals-completed').textContent = data.goals.completed;
      
      const streakBadge = document.getElementById('streak-badge');
      if (data.goals.streak > 0) {
        streakBadge.textContent = '🔥 ' + data.goals.streak + ' days';
        streakBadge.style.display = 'inline-block';
      } else {
        streakBadge.style.display = 'none';
      }

      // Activity
      const activityList = document.getElementById('activity-list');
      if (data.recentActivity.length > 0) {
        activityList.innerHTML = data.recentActivity.map(activity => 
          '<li class="activity-item">' +
            '<span>' + activity.description + '</span>' +
            '<span class="activity-timestamp">' + activity.timestamp + '</span>' +
          '</li>'
        ).join('');
      } else {
        activityList.innerHTML = '<li class="activity-item"><span>No recent activity</span></li>';
      }

      // Version
      document.getElementById('version-info').textContent = 'Alex v' + data.version;
    }
  </script>
</body>
</html>`;
  }
}

/**
 * Register cognitive dashboard
 */
export function registerCognitiveDashboard(context: vscode.ExtensionContext): CognitiveDashboardProvider {
  const provider = new CognitiveDashboardProvider(context);
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CognitiveDashboardProvider.viewType,
      provider
    )
  );

  return provider;
}
