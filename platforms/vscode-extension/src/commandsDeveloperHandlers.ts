/**
 * commandsDeveloperHandlers.ts — Extracted handler logic for developer commands
 *
 * Contains the code-context helper, skill review prompts, and telemetry panel.
 * Extracted from commandsDeveloper.ts to satisfy NASA R4 (≤60 lines per function).
 */
import * as vscode from 'vscode';
import * as path from 'path';
import { openChatPanel, getLanguageIdFromPath } from './shared/utils';
import { getNonce } from './shared/sanitize';
import { checkHealth } from './shared/healthCheck';
import * as telemetry from './shared/telemetry';

// ============================================================================
// Shared code-context helper
// ============================================================================

export interface CodeContext {
  text: string;
  fileName: string;
  languageId: string;
}

/** Read code from a URI, active editor selection, or return empty. */
export async function getCodeContext(uri?: vscode.Uri): Promise<CodeContext> {
  if (uri) {
    const content = await vscode.workspace.fs.readFile(uri);
    return {
      text: new TextDecoder().decode(content),
      fileName: path.basename(uri.fsPath),
      languageId: getLanguageIdFromPath(uri.fsPath),
    };
  }
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    return {
      text: !selection.isEmpty ? editor.document.getText(selection) : '',
      fileName: path.basename(editor.document.fileName),
      languageId: editor.document.languageId,
    };
  }
  return { text: '', fileName: 'input', languageId: 'text' };
}

/** Prompt user to paste code when no context available. */
export async function promptForCode(placeholder: string): Promise<CodeContext | null> {
  const userInput = await vscode.window.showInputBox({
    prompt: placeholder,
    placeHolder: placeholder,
    ignoreFocusOut: true,
  });
  if (!userInput) { return null; }
  return { text: userInput, fileName: 'input', languageId: 'text' };
}

// ============================================================================
// Skill Review prompt builder
// ============================================================================

const SKILL_REVIEW_PROMPTS: Record<string, string> = {
  'Check Stale Skills': `Review Alex's staleness-prone skills and check if they need updates. Skills to check:
1. microsoft-sfi - Secure Future Initiative (last validated: Feb 2026)
2. pii-privacy-regulations - GDPR & Australian Privacy (last validated: Feb 2026)
3. privacy-responsible-ai - RAI principles (last validated: Feb 2026)
4. llm-model-selection - Model recommendations (last validated: Jan 2026)
5. vscode-extension-patterns - VS Code APIs (last validated: Jan 2026)
6. chat-participant-patterns - Chat APIs (last validated: Jan 2026)
7. git-workflow - Git practices (last validated: Jan 2026)
8. teams-app-patterns - Teams development (last validated: Jan 2026)
9. m365-agent-debugging - M365 agents (last validated: Jan 2026)

For each skill, check if there are newer versions, deprecations, or significant changes to the underlying technology.`,

  'Security Review': `Review Microsoft Secure Future Initiative (SFI) compliance in the current project:
1. Check the 3 Core Principles: Secure by Design, Secure by Default, Secure Operations
2. Verify the 6 Pillars: Identity/Secrets, Tenants/Isolation, Networks, Engineering Systems, Threat Detection, Response/Remediation
3. Review OWASP Top 10 mitigations
4. Check credential management and secret handling
5. Verify dependency security (npm audit or equivalent)
6. Review security code patterns

Reference: .github/skills/microsoft-sfi/SKILL.md`,

  'Privacy & PII Review': `Review privacy and PII handling compliance in the current project:
1. GDPR Compliance: Lawful basis, data minimization, consent, data subject rights
2. Australian Privacy Principles (APPs): All 13 APPs checklist
3. PII identification: Check for direct and indirect identifiers
4. Data encryption: At rest and in transit
5. Logging practices: Ensure PII is not logged
6. Retention policies: Data lifecycle management
7. Cross-border transfers: Adequacy and safeguards

Reference: .github/skills/pii-privacy-regulations/SKILL.md`,

  'Responsible AI Review': `Review Responsible AI practices in the current project:
1. Microsoft's 6 RAI Principles: Fairness, Reliability/Safety, Privacy/Security, Inclusiveness, Transparency, Accountability
2. Google's 3 Pillars: Bold Innovation, Responsible Development, Collaborative Progress
3. Bias detection and mitigation
4. Model documentation (Model Cards)
5. Human-AI collaboration patterns
6. Appropriate reliance: CAIR/CSR framework
7. AI transparency and explainability

Reference: .github/skills/privacy-responsible-ai/SKILL.md and .github/skills/appropriate-reliance/SKILL.md`,

  'LLM Model Review': `Review and update LLM model recommendations:
1. Check current model capabilities and pricing
2. Verify context window sizes are accurate
3. Review tier recommendations (Frontier/Capable/Fast)
4. Check for new model announcements (Claude, GPT, Gemini)
5. Update cost optimization strategies
6. Review model-specific limitations

Reference: .github/skills/llm-model-selection/SKILL.md
Check: Anthropic docs, OpenAI docs, Google AI docs`,

  'VS Code API Review': `Review VS Code extension patterns for current API compatibility:
1. Check against latest VS Code release notes
2. Verify no deprecated APIs are used
3. Review proposed APIs that may have become stable
4. Check webview security policies
5. Review activation events and contributes patterns
6. Verify compatibility with current VS Code version

Reference: .github/skills/vscode-extension-patterns/SKILL.md
Check: VS Code API docs, latest release notes`,

  'Chat Patterns Review': `Review chat participant patterns for current API status:
1. Check which proposed APIs have become stable
2. Review deprecated patterns
3. Verify chat participant registration patterns
4. Check language model tool patterns
5. Review follow-up question patterns

Reference: .github/skills/chat-participant-patterns/SKILL.md`,

  'Git Workflow Review': `Review git workflow patterns and best practices:
1. Check branch naming conventions
2. Review commit message format (Conventional Commits)
3. Verify PR and code review patterns
4. Check GitHub CLI usage patterns
5. Review git hooks and automation

Reference: .github/skills/git-workflow/SKILL.md`,
};

/** Run the skill review flow: pick review type → open chat. */
export async function handleSkillReview(): Promise<boolean> {
  const reviewTypes = [
    { label: "$(warning) Check Stale Skills", description: "Review skills that may need updating", detail: "Security, privacy, models, APIs" },
    { label: "$(shield) Security Review", description: "Review Microsoft SFI and security practices", detail: "Secure Future Initiative compliance" },
    { label: "$(lock) Privacy & PII Review", description: "Review GDPR, Australian Privacy compliance", detail: "Data protection regulations" },
    { label: "$(hubot) Responsible AI Review", description: "Review AI ethics and governance practices", detail: "Microsoft & Google RAI principles" },
    { label: "$(rocket) LLM Model Review", description: "Check model recommendations are current", detail: "Claude, GPT, Gemini updates" },
    { label: "$(extensions) VS Code API Review", description: "Check extension patterns are current", detail: "VS Code release compatibility" },
    { label: "$(comment-discussion) Chat Patterns Review", description: "Review chat participant patterns", detail: "Proposed APIs, deprecations" },
    { label: "$(git-branch) Git Workflow Review", description: "Review git best practices", detail: "Branching, commits, PR patterns" },
  ];

  const selected = await vscode.window.showQuickPick(reviewTypes, {
    placeHolder: "Select review type",
    title: "🔍 Skill & Knowledge Review",
  });

  if (!selected) { return true; }

  const reviewName = selected.label.replace(/\$\([^)]+\)\s*/, '');
  const prompt = SKILL_REVIEW_PROMPTS[reviewName] ?? '';
  if (prompt) { await openChatPanel(prompt); }
  return true;
}

// ============================================================================
// Telemetry panel — HTML sections
// ============================================================================

function getTelemetryStyles(healthColor: string): string {
  return `
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); background: var(--vscode-editor-background); max-width: 900px; margin: 0 auto; }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { margin-top: 24px; border-bottom: 1px solid var(--vscode-textSeparator-foreground); padding-bottom: 8px; }
        h3 { margin-top: 16px; margin-bottom: 8px; font-size: 14px; }
        .summary { background: var(--vscode-textBlockQuote-background); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .stat { display: inline-block; margin-right: 24px; margin-bottom: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; color: var(--vscode-textLink-foreground); }
        .stat-label { font-size: 12px; color: var(--vscode-descriptionForeground); }
        pre { background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 11px; max-height: 300px; overflow-y: auto; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 8px; margin-bottom: 8px; font-size: 13px; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        button.primary { background: var(--vscode-button-prominentBackground, #0066b8); }
        button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
        .privacy-box { background: var(--vscode-inputValidation-infoBackground); border: 1px solid var(--vscode-inputValidation-infoBorder); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .privacy-box h3 { margin-top: 0; color: var(--vscode-textLink-foreground); }
        .privacy-list { margin: 8px 0; padding-left: 20px; }
        .privacy-list li { margin: 4px 0; }
        .bug-report-box { background: var(--vscode-inputValidation-warningBackground); border: 1px solid var(--vscode-inputValidation-warningBorder); padding: 16px; border-radius: 8px; margin: 16px 0; }
        .bug-report-box h3 { margin-top: 0; }
        .check { color: #4caf50; }
        .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 12px 0; }
        .info-label { font-weight: bold; color: var(--vscode-descriptionForeground); }
        .health-box { background: var(--vscode-textBlockQuote-background); padding: 12px 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid ${healthColor}; }
        .settings-box { background: var(--vscode-textBlockQuote-background); padding: 12px 16px; border-radius: 8px; margin: 12px 0; }
        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; font-size: 12px; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .two-column { grid-template-columns: 1fr; } }`;
}

function getPrivacySection(): string {
  return `
    <div class="privacy-box">
        <h3>🔒 Privacy Guarantee</h3>
        <p><strong>Your data NEVER leaves your machine.</strong> This diagnostic data is:</p>
        <ul class="privacy-list">
            <li><span class="check">✓</span> Stored <strong>only</strong> in VS Code's local extension storage</li>
            <li><span class="check">✓</span> <strong>Never</strong> transmitted over any network</li>
            <li><span class="check">✓</span> <strong>Never</strong> sent to Microsoft, GitHub, or any third party</li>
            <li><span class="check">✓</span> Automatically redacts sensitive data (tokens, passwords, full paths)</li>
            <li><span class="check">✓</span> Completely under your control - export or delete at any time</li>
        </ul>
        <p style="margin-bottom: 0; font-style: italic;">To file a bug report, export the data below and attach it to your GitHub issue.</p>
    </div>`;
}

function getBugReportSection(): string {
  return `
    <div class="bug-report-box">
        <h3>🐛 Filing a Bug Report?</h3>
        <p>To help us fix your issue quickly:</p>
        <ol>
            <li>Click <strong>"Export for Bug Report"</strong> below to save the diagnostic data</li>
            <li>Go to <a href="https://github.com/fabioc-aloha/Alex_Plug_In/issues/new" style="color: var(--vscode-textLink-foreground);">GitHub Issues</a></li>
            <li>Describe what happened and what you expected</li>
            <li>Attach the exported JSON file</li>
        </ol>
        <button class="primary" onclick="exportData()">📤 Export for Bug Report</button>
        <button class="secondary" onclick="copyToClipboard()">📋 Copy to Clipboard</button>
    </div>`;
}

export interface TelemetryData {
  sessions: unknown[];
  summary: Record<string, unknown>;
  aggregate: Record<string, unknown>;
  alexSettings: Record<string, unknown>;
  health: Awaited<ReturnType<typeof checkHealth>>;
  extensionVersion: string;
}

function getSessionSummarySection(d: TelemetryData): string {
  const s = d.summary;
  return `
    <h2>📊 Session Summary</h2>
    <div class="summary">
        <div class="stat"><div class="stat-value">${s['totalEvents'] || 0}</div><div class="stat-label">Events This Session</div></div>
        <div class="stat"><div class="stat-value">${s['errorCount'] || 0}</div><div class="stat-label">Errors</div></div>
        <div class="stat"><div class="stat-value">${s['avgDuration'] || 0}ms</div><div class="stat-label">Avg Duration</div></div>
        <div class="stat"><div class="stat-value">${d.sessions.length}</div><div class="stat-label">Total Sessions</div></div>
    </div>
    <div class="info-grid">
        <span class="info-label">Extension Version:</span><span>${d.extensionVersion}</span>
        <span class="info-label">VS Code Version:</span><span>${vscode.version}</span>
        <span class="info-label">Session ID:</span><span>${s['sessionId'] || "unknown"}</span>
        <span class="info-label">Started:</span><span>${s['startedAt'] || "unknown"}</span>
    </div>`;
}

function getHealthSection(d: TelemetryData): string {
  const h = d.health;
  const issues = (h['issues'] as string[]) || [];
  const statusLabel = h['status'] === 'healthy' ? '✅ Healthy'
    : h['status'] === 'warning' ? '⚠️ Warning'
    : h['status'] === 'error' ? '❌ Error' : '⚫ Not Initialized';
  const issuesHtml = issues.length > 0
    ? `<p style="margin-top: 8px; margin-bottom: 0; font-size: 12px;"><strong>Issues:</strong> ${issues.slice(0, 5).join(', ')}${issues.length > 5 ? ` (+${issues.length - 5} more)` : ''}</p>`
    : '';
  return `
    <h2>🏥 Architecture Health</h2>
    <div class="health-box">
        <div class="info-grid">
            <span class="info-label">Status:</span><span>${statusLabel}</span>
            <span class="info-label">Initialized:</span><span>${h['initialized'] ? 'Yes' : 'No'}</span>
            <span class="info-label">Total Files:</span><span>${h['totalFiles']}</span>
            <span class="info-label">Total Synapses:</span><span>${h['totalSynapses']}</span>
            <span class="info-label">Broken Synapses:</span><span>${h['brokenSynapses']}</span>
            <span class="info-label">Summary:</span><span>${h['summary']}</span>
        </div>
        ${issuesHtml}
    </div>`;
}

function getSessionComparisonSection(d: TelemetryData): string {
  const s = d.summary;
  const a = d.aggregate;
  return `
    <div class="two-column">
        <div>
            <h2>📈 This Session</h2>
            <pre>${((s['topEvents'] as string[]) || []).join("\\n") || "No events yet"}</pre>
        </div>
        <div>
            <h2>📊 All Sessions (${a['totalSessions']})</h2>
            <pre>${((a['topEventsAllTime'] as string[]) || []).join("\\n") || "No events yet"}</pre>
        </div>
    </div>`;
}

function getSettingsSection(d: TelemetryData): string {
  return `
    <h2>⚙️ Settings</h2>
    <div class="settings-box">
        <div class="settings-grid">
            <span><strong>workspace.protectedMode:</strong> ${d.alexSettings['workspace.protectedMode'] ?? 'undefined'}</span>
            <span><strong>m365.enabled:</strong> ${d.alexSettings['m365.enabled'] ?? 'undefined'}</span>
            <span><strong>globalKnowledge.enabled:</strong> ${d.alexSettings['globalKnowledge.enabled'] ?? 'undefined'}</span>
        </div>
    </div>`;
}

function getTelemetryScript(nonce: string): string {
  return `
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        function showLog() { vscode.postMessage({ command: 'showLog' }); }
        function exportData() { vscode.postMessage({ command: 'export' }); }
        function clearData() { vscode.postMessage({ command: 'clear' }); }
        function refreshData() { vscode.postMessage({ command: 'refresh' }); }
        function copyToClipboard() { 
            const data = document.getElementById('sessionData').textContent;
            navigator.clipboard.writeText(data).then(() => {
                vscode.postMessage({ command: 'copied' });
            });
        }
    </script>`;
}

/** Build the full telemetry panel HTML. */
export function buildTelemetryPanelHtml(d: TelemetryData): string {
  const healthStatus = d.health['status'];
  const healthColor = healthStatus === 'healthy' ? '#4caf50'
    : healthStatus === 'warning' ? '#ff9800'
    : healthStatus === 'error' ? '#f44336' : '#9e9e9e';
  const nonce = getNonce();
  return `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <style>${getTelemetryStyles(healthColor)}</style>
</head>
<body>
    <h1>🔬 Alex Diagnostics & Bug Report</h1>
    ${getPrivacySection()}
    ${getSessionSummarySection(d)}
    ${getBugReportSection()}
    <h2>🔧 Actions</h2>
    <button onclick="showLog()">📜 Show Live Log</button>
    <button onclick="refreshData()">🔄 Refresh</button>
    <button class="secondary" onclick="clearData()">🗑️ Clear All Data</button>
    ${getHealthSection(d)}
    ${getSessionComparisonSection(d)}
    ${getSettingsSection(d)}
    <h2>📁 Raw Session Data</h2>
    <p style="color: var(--vscode-descriptionForeground); font-size: 12px;">This is the complete diagnostic data that would be included in a bug report:</p>
    <pre id="sessionData">${JSON.stringify(d.sessions, null, 2)}</pre>
    ${getTelemetryScript(nonce)}
</body>
</html>`;
}

/** Handle webview messages for the telemetry panel. */
export async function handleTelemetryMessage(
  message: { command: string },
  panel: vscode.WebviewPanel,
  extensionVersion: string,
): Promise<void> {
  if (message.command === "showLog") {
    telemetry.showTelemetryLog();
  } else if (message.command === "export") {
    await exportTelemetryBugReport(extensionVersion);
  } else if (message.command === "clear") {
    await clearTelemetryData(panel);
  } else if (message.command === "copied") {
    vscode.window.showInformationMessage("Diagnostic data copied to clipboard!");
  } else if (message.command === "refresh") {
    panel.dispose();
    vscode.commands.executeCommand("alex.viewBetaTelemetry");
  }
}

async function exportTelemetryBugReport(extensionVersion: string): Promise<void> {
  const data = await telemetry.getAllTelemetryData();
  const currentHealth = await checkHealth();
  const currentSettings = telemetry.getAlexSettings();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const uri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(`alex-bug-report-${timestamp}.json`),
    filters: { JSON: ["json"] },
  });
  if (!uri) { return; }
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    extensionVersion,
    vscodeVersion: vscode.version,
    platform: process.platform,
    arch: process.arch,
    health: {
      status: currentHealth.status,
      initialized: currentHealth.initialized,
      totalFiles: currentHealth.totalFiles,
      totalSynapses: currentHealth.totalSynapses,
      brokenSynapses: currentHealth.brokenSynapses,
      summary: currentHealth.summary,
      issues: currentHealth.issues.slice(0, 10),
    },
    settings: currentSettings,
    sessions: data,
  };
  const content = new TextEncoder().encode(JSON.stringify(exportPayload, null, 2));
  await vscode.workspace.fs.writeFile(uri, content);
  vscode.window.showInformationMessage("Diagnostics exported! Attach this file to your GitHub issue.");
}

async function clearTelemetryData(panel: vscode.WebviewPanel): Promise<void> {
  const confirm = await vscode.window.showWarningMessage(
    "Clear all diagnostic data?",
    { modal: true },
    "Yes, Clear",
  );
  if (confirm === "Yes, Clear") {
    await telemetry.clearTelemetryData();
    vscode.window.showInformationMessage("Diagnostic data cleared!");
    panel.dispose();
  }
}
