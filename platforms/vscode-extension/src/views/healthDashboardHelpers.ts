/**
 * healthDashboardHelpers.ts — HTML fragment builders for the Health Dashboard
 *
 * Extracted from healthDashboard.ts to reduce file size.
 * Provides synapse visualization, memory breakdown, and error page builders.
 */
import * as vscode from "vscode";
import * as path from "path";
import * as workspaceFs from "../shared/workspaceFs";
import { HealthCheckResult } from "../shared/healthCheck";
import { escapeHtml, getNonce } from "../shared/sanitize";

/**
 * Build modern visualization of synapse network
 */
export function buildSynapseVisualization(health: HealthCheckResult): string {
  if (!health.initialized || health.totalSynapses === 0) {
    return `
        <div class="synapse-empty">
            <div class="synapse-empty-icon">🔗</div>
            <div class="synapse-empty-text">No synapses found</div>
            <div class="synapse-empty-hint">Run 'Alex: Initialize' to deploy architecture</div>
        </div>`;
  }

  const healthyCount = health.totalSynapses - health.brokenSynapses;
  const healthPercent = Math.round((healthyCount / health.totalSynapses) * 100);
  const healthColor =
    healthPercent >= 95
      ? "var(--success)"
      : healthPercent >= 80
        ? "var(--warning)"
        : "var(--error)";

  // Build issues HTML if any
  let issuesHtml = "";
  if (health.issues.length > 0) {
    const issueItems = health.issues
      .slice(0, 6)
      .map((issue) => {
        const sanitizedIssue = escapeHtml(issue);
        return `<div class="synapse-issue-item">⚠️ ${sanitizedIssue}</div>`;
      })
      .join("");
    const moreCount =
      health.issues.length > 6
        ? `<div class="synapse-issue-more">... and ${health.issues.length - 6} more issues</div>`
        : "";
    issuesHtml = `
        <div class="synapse-issues">
            <div class="synapse-issues-header">Issues Detected</div>
            ${issueItems}
            ${moreCount}
        </div>`;
  }

  return `
    <div class="synapse-grid">
        <div class="synapse-metric">
            <div class="synapse-metric-value">${health.totalSynapses}</div>
            <div class="synapse-metric-label">Total Connections</div>
        </div>
        <div class="synapse-metric">
            <div class="synapse-metric-value" style="color: var(--success)">${healthyCount}</div>
            <div class="synapse-metric-label">Healthy</div>
        </div>
        <div class="synapse-metric">
            <div class="synapse-metric-value" style="color: ${health.brokenSynapses > 0 ? "var(--error)" : "var(--success)"}">${health.brokenSynapses}</div>
            <div class="synapse-metric-label">Broken</div>
        </div>
        <div class="synapse-metric">
            <div class="synapse-metric-value">${health.totalFiles}</div>
            <div class="synapse-metric-label">Memory Files</div>
        </div>
    </div>
    <div class="synapse-progress-container">
        <div class="synapse-progress-header">
            <span>Network Health</span>
            <span style="color: ${healthColor}; font-weight: 600">${healthPercent}%</span>
        </div>
        <div class="synapse-progress-bar">
            <div class="synapse-progress-fill" style="width: ${healthPercent}%; background: ${healthColor}"></div>
        </div>
    </div>
    ${issuesHtml}`;
}

/**
 * Build memory file breakdown HTML
 */
export async function buildMemoryBreakdownAsync(): Promise<
  { icon: string; name: string; count: number }[]
> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return [];
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const categories = [
    {
      icon: "📋",
      name: "Instructions (.instructions.md)",
      path: path.join(rootPath, ".github", "instructions"),
      count: 0,
    },
    {
      icon: "📝",
      name: "Prompts (.prompt.md)",
      path: path.join(rootPath, ".github", "prompts"),
      count: 0,
    },
    {
      icon: "🎯",
      name: "Skills (SKILL.md)",
      path: path.join(rootPath, ".github", "skills"),
      count: 0,
    },
    {
      icon: "🧠",
      name: "Domain Knowledge (legacy)",
      path: path.join(rootPath, ".github", "domain-knowledge"),
      count: 0,
    },
    {
      icon: "⚙️",
      name: "Configuration",
      path: path.join(rootPath, ".github", "config"),
      count: 0,
    },
  ];

  // Count files in each directory
  for (const cat of categories) {
    try {
      if (await workspaceFs.pathExists(cat.path)) {
        const files = await workspaceFs.readDirectory(cat.path);
        cat.count = files.filter(([name, _]) => name.endsWith(".md")).length;
      }
    } catch {
      // Ignore errors
    }
  }

  return categories;
}

export function buildMemoryBreakdown(
  categories: { icon: string; name: string; count: number }[],
): string {
  return `
    <ul class="memory-list">
        ${categories
          .map(
            (cat) => `
        <li class="memory-item">
            <span class="memory-name">
                <span class="memory-icon">${cat.icon}</span>
                ${cat.name}
            </span>
            <span class="memory-count">${cat.count}</span>
        </li>
        `,
          )
          .join("")}
    </ul>`;
}

/**
 * Get error content for dashboard load failures
 */
export function getErrorContent(err: unknown): string {
  const nonce = getNonce();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
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
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
        }
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <h2>⚠️ Failed to load dashboard</h2>
    <p class="error">${escapeHtml(String(err))}</p>
    <button id="retryBtn">Retry</button>
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        document.getElementById('retryBtn').addEventListener('click', () => {
            vscode.postMessage({command: 'refresh'});
        });
    </script>
</body>
</html>`;
}
