/**
 * welcomeViewHtml.ts - HTML generation for the Welcome sidebar view
 *
 * Extracted from WelcomeViewProvider class to keep the provider focused
 * on lifecycle, state management, and message routing.
 */
import * as vscode from 'vscode';
import {
  HealthCheckResult,
  HealthStatus,
} from '../shared/healthCheck';
import {
    PersonaDetectionResult,
  getEasterEggOverride,
  EasterEgg,
} from '../chat/personaDetection';

import { ActiveContext } from '../shared/activeContextManager';
import { LearningGoal } from '../commands/goals';
import { escapeHtml, getNonce } from '../shared/sanitize';
import { getCachedCognitiveLevel, getFeatureRequirement, CognitiveLevel } from '../shared/cognitiveTier';
import { SkillRecommendation } from '../chat/skillRecommendations';
import { getSkillDisplayName } from '../shared/skillConstants';
import { nasaAssert, nasaAssertBounded } from '../shared/nasaAssert';
import { AgentActivity } from '../services/agentActivity';

/** Data contract for the Mind tab */
export interface MindTabData {
  skillCount: number;
  instructionCount: number;
  promptCount: number;
  agentCount: number;
  episodicCount: number;
  synapseHealthPct: number;
  lastDreamDate: string | null;
  lastMeditationDate: string | null;
  cognitiveAge: number;
}

/** Data contract for the Agents tab */
export interface AgentInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  role: string;
  installed: boolean;
}

/** Data contract for the Skills tab */
export interface SkillInfo {
  id: string;
  displayName: string;
  description: string;
  category: string;
  hasSynapses: boolean;
}

/**
 * Resolve a webview-safe URI for an asset in the extension's assets/ folder.
 */
export function getAssetUri(webview: vscode.Webview, extensionUri: vscode.Uri, assetPath: string): vscode.Uri {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'assets', ...assetPath.split('/')));
}

/**
 * Nudge types for contextual reminders
 */
export interface Nudge {
  type: "dream" | "streak" | "health" | "tip" | "focus" | "mission";
  icon: string;
  message: string;
  action?: string;
  actionLabel?: string;
  priority: number;
}
export function getLoadingHtml(): string {
  const nonce = getNonce();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
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

export function getErrorHtml(err: unknown): string {
  const errorMessage = escapeHtml(String(err));
  const nonce = getNonce();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
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
      <p style="font-size: var(--font-xs); opacity: 0.7;">${errorMessage}</p>
      <button data-cmd="refresh">Retry</button>
  </div>
  <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      function cmd(command, data) {
          vscode.postMessage({ command, ...data });
      }
      document.addEventListener('click', function(e) {
          const el = e.target.closest('[data-cmd]');
          if (el) {
              e.preventDefault();
              const command = el.getAttribute('data-cmd');
              const skill = el.getAttribute('data-skill');
              const skillName = el.getAttribute('data-skill-name');
              if (skill) {
                  cmd(command, { skill, skillName });
              } else {
                  cmd(command);
              }
          }
      });
  </script>
</body>
</html>`;
}

export function getWelcomeHtmlContent(
  webview: vscode.Webview,
  health: HealthCheckResult,
  session: { topic: string; remaining: number; isPaused: boolean; isBreak: boolean; pomodoroCount: number } | null,
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
  activeContext: ActiveContext | null,
  userProfile: { birthday?: string; name?: string } | null,
  extensionUri: vscode.Uri,
  agentMode: string | null,
  cognitiveState: string | null,
  workspaceName?: string,
  skillRecommendations?: SkillRecommendation[],
  mindData?: MindTabData,
  agents?: AgentInfo[],
  skills?: SkillInfo[],
  recentActivity?: AgentActivity[],
  personalityMode?: string,
): string {
  // NASA R5: Entry point assertions
  nasaAssert(webview !== undefined, '_getHtmlContent: webview must be defined');
  nasaAssertBounded(health.brokenSynapses, 0, 10000, 'health.brokenSynapses');
  nasaAssertBounded(goals.streakDays, 0, 9999, 'goals.streakDays');
  nasaAssertBounded(nudges.length, 0, 10, 'nudges.length');

  // Security: Generate nonce for CSP
  const nonce = getNonce();

  // Logo URI for webview
  const logoUri = getAssetUri(
    webview,
    extensionUri,
    'icon.png',
  );

  // Persona display
  const persona = personaResult?.persona;

  // Focus Trifectas from Active Context - parse early for avatar resolution
  const rawTrifectas = activeContext?.focusTrifectas;
  const hasLiveTrifectas =
    rawTrifectas &&
    !rawTrifectas.includes("*(") &&
    rawTrifectas.trim().length > 0;
  const trifectaIds = hasLiveTrifectas
    ? rawTrifectas!
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []; // Empty when no live trifectas (user hasn't started working yet)

  // Easter egg and persona display
  // Priority: Easter egg > Agent > Cognitive State > Skill State > Skill Persona > Persona > Age > Default
  // Uses organized subdirectories: personas/, ages/, agents/, states/
  const workspaceFolderName = vscode.workspace.workspaceFolders?.[0]?.name;
  const easterEgg: EasterEgg | null =
    getEasterEggOverride(workspaceFolderName);
  
  const easterEggBadge = easterEgg
    ? `<span class="easter-egg-badge" title="${easterEgg.label}">${easterEgg.emoji}</span>`
    : "";
  const personaHook = persona?.hook || "Take Your Code to New Heights";
  const personaIcon = persona?.icon || "💻";
  const personaName = persona?.name || "Developer";
  const personaSkill = persona?.skill || "code-review";
  const bannerNoun = persona?.bannerNoun || "CODE";

  // Use easter egg accent color if present, fallback to persona color, then CorreaX indigo primary
  const personaAccent = easterEgg?.accentColor || persona?.accentColor || "#6366f1";

  // Active Context — live state from copilot-instructions.md
  const confidenceLabel =
    personaResult?.confidence !== null && personaResult?.confidence !== undefined
      ? `${Math.round(personaResult.confidence * 100)}%`
      : "";
  const sourceLabel =
    personaResult?.source === "llm"
      ? "LLM"
      : personaResult?.source === "cached"
        ? "Cached"
        : "Auto";

  // Skill display names now imported from shared/skillConstants.ts (DRY)

  const trifectaTagsHtml = trifectaIds.length > 0
    ? trifectaIds.map((id) => {
      const name = getSkillDisplayName(id);
      return `<span class="trifecta-tag" data-cmd="launchRecommendedSkill" data-skill="${id}" data-skill-name="${name}" title="Launch ${name}">${name}</span>`;
    })
    .join("\n                ")
    : `<span class="trifecta-placeholder" style="opacity: 0.6; font-style: italic;">Focus trifectas will appear here when you start working</span>`;

  // Objective from Active Context (hidden when session card is showing)
  const rawObjective = activeContext?.objective;
  const hasObjective =
    rawObjective && !rawObjective.includes("session-objective") && !session;

  // Last Assessed from Active Context
  const rawAssessed = activeContext?.lastAssessed || "never";
  const isNeverAssessed =
    rawAssessed === "never" || rawAssessed.includes("never");
  const assessedLabel = isNeverAssessed
    ? "Not assessed"
    : rawAssessed.split(" — ")[0];

  // Principles from Active Context
  const principlesText =
    activeContext?.principles || "KISS, DRY, Optimize-for-AI";

  const recommendedSkillName = getSkillDisplayName(personaSkill);

  // Skill recommendations HTML
  const skillRecommendationsHtml = skillRecommendations && skillRecommendations.length > 0
    ? `<div class="skill-recommendations-section">
              <div class="skill-recommendations-list">
                  ${skillRecommendations.map(rec => 
                      `<button class="skill-recommendation-btn" data-cmd="launchRecommendedSkill" data-skill="${rec.skillId}" data-skill-name="${rec.displayName}" title="${rec.reason}">
                          <span class="skill-rec-name">${rec.displayName}</span>
                          <span class="skill-rec-reason">${rec.reason}</span>
                      </button>`
                  ).join('\n                    ')}
              </div>
          </div>`
    : "";

  // Health indicator
  const isHealthy = health.status === HealthStatus.Healthy;
  const healthText = isHealthy
    ? "Healthy"
    : `${health.brokenSynapses} issues`;

  // Streak days for status display
  const streakDays = goals.streakDays;

  // Architecture status banner (7.9)
  const healthPct = health.totalSynapses > 0
    ? Math.round((1 - health.brokenSynapses / health.totalSynapses) * 100)
    : 100;
  const healthBannerClass = isHealthy ? 'status-healthy' : health.brokenSynapses > 5 ? 'status-error' : 'status-warning';
  const healthBannerIcon = isHealthy ? '✓' : health.brokenSynapses > 5 ? '✗' : '⚠';
  const healthBannerLabel = isHealthy ? 'Healthy' : health.brokenSynapses > 5 ? 'Issues' : 'Warnings';

  // Dynamic skill category detection via keyword patterns (no hardcoded map)
  const CATEGORY_RULES: Array<{ category: string; pattern: RegExp }> = [
    { category: 'Azure & Cloud', pattern: /azure|bicep|fabric|foundry|cloud|infrastructure-as-code/ },
    { category: 'Creative & Media', pattern: /image|banner|character-|brand|svg|graphic|ascii|ui-ux|mermaid|gamma|slide|pptx|presentation|terminal-image|text-to-speech|correax|aging/ },
    { category: 'Collaboration', pattern: /teams-app|microsoft-graph|m365|enterprise|project-management|scope-management|change-management|business-analysis|cross-cultural|pii-privacy|work-life/ },
    { category: 'VS Code', pattern: /vscode|extension|chat-participant|mcp-|agent-debug-panel|heir-sync/ },
    { category: 'AI & ML', pattern: /\bai[- ]|prompt|llm|rag-|hallucination|flux|finetune|fine-tune|reliance|responsible-ai|agent-design|orchestration|frustration|coaching|socratic|learning-psychology/ },
    { category: 'Research & Writing', pattern: /research|academic|literature|dissertation|grant|citation|book-publish|creative-writing|documentation-quality|md-to-word|storytelling|status-report|effort-estimation/ },
    { category: 'Cognitive', pattern: /meditat|dream|actuali[sz]|memory-activ|brain-qa|cognitive|north-star|bootstrap|knowledge-synth|global-knowledge|awareness|persona-detect|skill-build|skill-develop|skill-catalog|visual-memory|deep-work|muscle-memory|proactive|architecture-refin/ },
    { category: 'Development', pattern: /code-review|debug|refactor|root-cause|testing|api-|database|error-recov|architecture-audit|git-|lint-|performance|observability|security|distribution-security|secrets|incident|post-mortem|rubber-duck|project-scaffold|project-deploy|release|localization/ },
  ];

  function classifySkill(id: string, description: string): string {
    const text = `${id} ${description}`.toLowerCase();
    for (const rule of CATEGORY_RULES) {
      if (rule.pattern.test(text)) { return rule.category; }
    }
    return 'Other';
  }

  const CATEGORY_ICONS: Record<string, string> = {
    'Cognitive': '🧠', 'Development': '⚙️', 'AI & ML': '🤖', 'Research & Writing': '📝',
    'Creative & Media': '🎨', 'Azure & Cloud': '☁️', 'VS Code': '💻', 'Collaboration': '🤝', 'Other': '📦',
  };
  const CATEGORY_ORDER = ['Cognitive', 'Development', 'AI & ML', 'Research & Writing', 'Creative & Media', 'Azure & Cloud', 'VS Code', 'Collaboration', 'Other'];

  const skillCategories: Record<string, SkillInfo[]> = {};
  for (const cat of CATEGORY_ORDER) { skillCategories[cat] = []; }
  for (const s of skills ?? []) {
    const cat = classifySkill(s.id, s.description);
    if (!skillCategories[cat]) { skillCategories[cat] = []; }
    skillCategories[cat].push(s);
  }


  // Cognitive age tier (7.36)
  const cogAge = mindData?.cognitiveAge ?? 0;
  const cogTier = cogAge <= 5 ? 'Early Learning' : cogAge <= 15 ? 'Active Growth' : cogAge <= 25 ? 'Integrated' : 'Wise';
  const cogProgress = Math.min(cogAge / 40 * 100, 100);

  // Session status
  const sessionHtml = session
    ? `
          <div class="session-card">
              <div class="session-header">
                  <span class="session-icon">${session.isBreak ? "☕" : "🎯"}</span>
                  <span class="session-title">${escapeHtml(session.topic)}</span>
              </div>
              <div class="session-timer">${formatTime(session.remaining)}</div>
              <div class="session-footer">
                  <span class="session-status">${session.isPaused ? "⏸️ Paused" : "▶️ Active"}${session.pomodoroCount > 0 ? ` • 🍅×${session.pomodoroCount}` : ""}</span>
                  <a href="#" class="session-actions-link" data-cmd="sessionActions">Actions</a>
              </div>
          </div>
      `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:;">
  <title>Alex</title>
  <style>
      * {
          box-sizing: border-box;
          --persona-accent: ${personaAccent};
          /* Design System - Spacing Scale (8px base) */
          --spacing-xs: 4px;
          --spacing-sm: 8px;
          --spacing-md: 16px;
          --spacing-lg: 24px;
          --spacing-xl: 32px;
          /* Typography Scale (1.18x for better readability) */
          --font-xs: 13px;
          --font-sm: 14px;
          --font-md: 16px;
          --font-lg: 18px;
          /* Elevation/Shadows */
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.12);
          --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      body {
          font-family: var(--vscode-font-family);
          font-size: var(--vscode-font-size);
          color: var(--vscode-foreground);
          background-color: var(--vscode-sideBar-background);
          padding: 0;
          margin: 0;
      }
      /* Focus indicators for accessibility */
      button:focus-visible,
      [tabindex]:focus-visible,
      a:focus-visible {
          outline: 2px solid var(--vscode-focusBorder);
          outline-offset: 2px;
      }
      .container {
          padding: 6px 10px;
      }
      /* CorreaX banner-style header — accent bar + ghost watermark + series label */
      .header {
          position: relative;
          overflow: hidden;
          background: var(--vscode-editor-widget-background, var(--vscode-sideBar-background));
          border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
          padding: 10px 10px 10px 14px;
          margin-bottom: 8px;
      }
      .header-accent-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--persona-accent, var(--vscode-charts-blue));
      }
      .header-watermark {
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 52px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.04);
          pointer-events: none;
          user-select: none;
          line-height: 1;
      }
      .header-series {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--persona-accent, var(--vscode-charts-blue));
          opacity: 0.65;
          margin-bottom: 2px;
      }
      .header-main {
          display: flex;
          align-items: center;
          gap: 8px;
      }
      .header-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.12));
          cursor: pointer;
          transition: transform 0.15s ease;
      }
      .header-icon:hover {
          transform: scale(1.08);
      }
      .hero-text-box {
          text-align: center;
          padding: 12px 14px;
          margin-bottom: 8px;
          position: relative;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
      }
      .hero-hook {
          font-size: 15px;
          font-weight: 600;
          color: var(--vscode-foreground);
          margin-bottom: 6px;
      }
      .hero-hook strong {
          color: var(--persona-accent);
      }
      .hero-north-star {
          font-size: 12px;
          color: var(--vscode-descriptionForeground);
          cursor: pointer;
          padding: 3px 6px;
          border-radius: 4px;
          transition: background 0.15s ease;
      }
      .hero-north-star:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .hero-objective {
          font-size: 11px;
          color: var(--vscode-descriptionForeground);
          margin-top: 4px;
          font-style: italic;
          opacity: 0.85;
      }
      .easter-egg-badge {
          position: absolute;
          top: -2px;
          right: 8px;
          font-size: 28px;
          line-height: 1;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          animation: egg-bounce 2s ease-in-out infinite;
          pointer-events: none;
      }
      @keyframes egg-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
      }
      .header-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.2px;
      }
      .header-persona {
          font-size: 11px;
          color: var(--vscode-foreground);
          background: color-mix(in srgb, var(--persona-accent) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--persona-accent) 30%, transparent);
          padding: 4px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
      }
      .header-persona:hover {
          background: color-mix(in srgb, var(--persona-accent) 25%, transparent);
      }
      .header-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex: 1;
      }
      .project-name {
          text-align: center;
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--vscode-descriptionForeground);
          margin: 4px 0 8px;
          padding: 4px 8px;
          opacity: 0.85;
      }
      .refresh-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: var(--vscode-foreground);
          cursor: pointer;
          opacity: 0.5;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.15s ease;
      }
      .refresh-btn:hover {
          opacity: 1;
          background: var(--vscode-toolbar-hoverBackground);
      }
      
      .section {
          margin-bottom: 12px;
      }
      .section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--vscode-descriptionForeground);
          margin-bottom: 4px;
          opacity: 0.65;
      }
      
      .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
      }
      .status-item {
          background: var(--vscode-editor-background);
          border-radius: 4px;
          padding: 8px;
          border-left: 2px solid transparent;
          transition: all 0.12s ease;
      }
      .status-item:hover {
          border-left-color: var(--vscode-focusBorder);
          background: var(--vscode-list-hoverBackground);
      }
      .status-item.status-good {
          border-left-color: var(--vscode-charts-green);
      }
      .status-item.status-warn {
          border-left-color: var(--vscode-charts-yellow);
      }
      .status-label {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
      }
      .status-value {
          font-size: var(--font-sm);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
      }
      .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 3px currentColor;
          position: relative;
      }
      /* Accessibility: Icon labels for color-blind users */
      .status-dot::after {
          position: absolute;
          font-size: 11px;
          line-height: 11px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
      }
      .dot-green { background: var(--vscode-charts-green); color: var(--vscode-charts-green); }
      .dot-green::after { content: '✓'; color: white; }
      .dot-yellow { background: var(--vscode-charts-yellow); color: var(--vscode-charts-yellow); }
      .dot-yellow::after { content: '⚠'; color: black; font-weight: bold; }
      .dot-red { background: var(--vscode-charts-red); color: var(--vscode-charts-red); }
      .dot-red::after { content: '✗'; color: white; }
      .status-num {
          font-weight: 600;
          font-size: var(--font-md);
          color: var(--vscode-foreground);
          line-height: 1;
      }
      .status-unit {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          font-weight: normal;
      }
      .status-completed {
          font-size: var(--font-xs);
          color: var(--vscode-charts-green);
          font-weight: 500;
      }
      .context-card {
          background: var(--vscode-editor-background);
          border-radius: 5px;
          padding: 8px;
          border-left: 2px solid var(--persona-accent);
      }
      .context-objective {
          font-size: var(--font-sm);
          font-weight: 500;
          margin-bottom: 4px;
          padding: 4px 8px;
          background: color-mix(in srgb, var(--persona-accent) 8%, transparent);
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.12s ease;
          display: flex;
          align-items: center;
          gap: 8px;
      }
      .context-objective:hover {
          background: color-mix(in srgb, var(--persona-accent) 15%, transparent);
      }
      .context-objective::before {
          content: '🎯';
          font-size: 14px;
      }
      .trifecta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
      }
      .trifecta-tag {
          font-size: var(--font-xs);
          padding: 2px var(--spacing-sm);
          border-radius: 10px;
          background: color-mix(in srgb, var(--persona-accent) 12%, var(--vscode-badge-background));
          color: var(--vscode-foreground);
          cursor: pointer;
          transition: all 0.12s ease;
          border: 1px solid color-mix(in srgb, var(--persona-accent) 25%, transparent);
      }
      .trifecta-tag:hover {
          background: color-mix(in srgb, var(--persona-accent) 25%, var(--vscode-badge-background));
          transform: translateY(-1px);
      }
      .context-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
      }
      .context-badge {
          font-size: var(--font-xs);
          padding: 1px 8px;
          border-radius: 8px;
          background: var(--vscode-badge-background);
          color: var(--vscode-badge-foreground);
          opacity: 0.8;
      }
      .context-badge.accent {
          background: color-mix(in srgb, var(--persona-accent) 20%, transparent);
          color: var(--vscode-foreground);
          font-weight: 500;
      }
      .context-badge.stale {
          background: color-mix(in srgb, var(--vscode-charts-yellow) 25%, transparent);
          color: var(--vscode-foreground);
          cursor: pointer;
      }
      .context-badge[data-cmd] {
          cursor: pointer;
          transition: opacity 0.12s ease;
      }
      .context-badge[data-cmd]:hover {
          opacity: 1;
      }
      
      .session-card {
          background: var(--vscode-editor-background);
          border-radius: 5px;
          padding: 8px;
          margin-bottom: 8px;
          border-left: 2px solid var(--vscode-charts-blue);
      }
      .session-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
      }
      .session-icon {
          font-size: 16px;
      }
      .session-title {
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      .session-timer {
          font-size: 21px;
          font-weight: 600;
          font-family: monospace;
          color: var(--vscode-charts-blue);
      }
      .session-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
      }
      .session-status {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
      }
      .session-actions-link {
          font-size: var(--font-xs);
          color: var(--vscode-textLink-foreground);
          text-decoration: none;
          cursor: pointer;
      }
      .session-actions-link:hover {
          text-decoration: underline;
      }
      
      .action-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      .action-group-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--vscode-descriptionForeground);
          margin-top: 10px;
          margin-bottom: 2px;
          padding-left: 2px;
          opacity: 0.55;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          user-select: none;
      }
      .action-group-label:first-child {
          margin-top: 0;
      }
      .action-group-label .collapse-chevron {
          font-size: 9px;
          transition: transform 0.15s ease;
          display: inline-block;
      }
      .action-group-label.collapsed .collapse-chevron {
          transform: rotate(-90deg);
      }
      .action-group-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
          transition: max-height 0.2s ease;
      }
      .action-group-content.collapsed {
          display: none;
      }
      /* Quick Command Bar (7.11) */
      .quick-command-input {
          width: 100%;
          padding: 4px 8px;
          min-height: 32px;
          border: 1px solid var(--vscode-input-border, var(--vscode-widget-border));
          border-radius: 4px;
          background: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          font-size: 12px;
          box-sizing: border-box;
          margin-bottom: 8px;
      }
      .quick-command-input:focus {
          border-color: var(--vscode-focusBorder);
          outline: none;
      }
      .quick-command-input::placeholder {
          color: var(--vscode-input-placeholderForeground);
      }
      /* Cognitive State Card (7.18) */
      .cognitive-state-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          margin-bottom: 8px;
      }
      .cognitive-state-icon { font-size: 24px; flex-shrink: 0; }
      .cognitive-state-detail { flex: 1; }
      .cognitive-state-label { font-size: 12px; font-weight: 600; }
      .cognitive-state-mode { font-size: 11px; opacity: 0.7; }
      /* Personality Toggle (7.16) */
      .personality-toggle {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          margin-bottom: 8px;
          overflow: hidden;
      }
      .personality-toggle-btn {
          flex: 1;
          padding: 6px 8px;
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          cursor: pointer;
          border: none;
          background: transparent;
          color: var(--vscode-foreground);
          opacity: 0.6;
          transition: opacity 0.15s, background 0.15s;
      }
      .personality-toggle-btn:hover { opacity: 0.85; }
      .personality-toggle-btn.active {
          opacity: 1;
          background: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          font-weight: 600;
      }
      .personality-toggle-btn + .personality-toggle-btn {
          border-left: 1px solid var(--vscode-widget-border, #303030);
      }
      /* Memory Modality Cards (7.37) */
      .memory-modalities {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 8px;
      }
      .memory-modality-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px;
          text-align: center;
      }
      .memory-modality-icon { font-size: 18px; margin-bottom: 4px; }
      .memory-modality-count { font-size: 16px; font-weight: 600; color: var(--vscode-foreground); }
      .memory-modality-label { font-size: 11px; color: var(--vscode-descriptionForeground); }
      .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          min-height: 36px; /* WCAG 2.5.8 compact touch target */
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--font-xs);
          text-align: left;
          transition: all 0.12s ease;
      }
      .action-btn:hover {
          background: var(--vscode-button-secondaryHoverBackground);
          transform: translateX(2px);
      }
      .action-btn.primary {
          background: color-mix(in srgb, var(--persona-accent) 10%, var(--vscode-button-secondaryBackground));
          color: var(--vscode-button-secondaryForeground);
          border-left: 2px solid var(--persona-accent);
          font-weight: 500;
      }
      .action-btn.primary:hover {
          background: color-mix(in srgb, var(--persona-accent) 18%, var(--vscode-button-secondaryHoverBackground));
          transform: translateX(2px);
      }
      .action-icon {
          font-size: var(--font-sm);
          width: 27px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          opacity: 0.9;
      }
      .action-icon svg {
          width: 17px;
          height: 17px;
      }
      .action-text {
          flex: 1;
      }
      .tier-lock {
          font-size: 11px;
          margin-left: auto;
          opacity: 0.55;
          white-space: nowrap;
          padding: 1px 4px;
          border-radius: 3px;
          background: color-mix(in srgb, var(--vscode-charts-yellow) 15%, transparent);
          color: var(--vscode-descriptionForeground);
      }
      .action-btn.recommended {
          border-left: 2px solid var(--persona-accent);
          background: color-mix(in srgb, var(--persona-accent) 8%, var(--vscode-button-secondaryBackground));
      }
      .action-btn.recommended:hover {
          background: color-mix(in srgb, var(--persona-accent) 15%, var(--vscode-button-secondaryHoverBackground));
      }
      .recommended-badge {
          font-size: var(--font-xs);
          margin-left: auto;
          opacity: 0.6;
          color: var(--persona-accent);
      }
      
      /* Skill Recommendations Styles */
      .skill-recommendations-section {
          margin: 8px 0;
          padding: 8px;
          background: var(--vscode-editor-background);
          border-radius: 6px;
          border: 1px solid var(--vscode-widget-border);
      }
      .section-subtitle {
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--vscode-descriptionForeground);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
      }
      .skill-recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
      }
      .skill-recommendation-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 4px 8px;
          min-height: 36px;
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-left: 2px solid var(--vscode-charts-blue);
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: all 0.12s ease;
      }
      .skill-recommendation-btn:hover {
          background: var(--vscode-button-secondaryHoverBackground);
          border-left-color: var(--persona-accent);
          transform: translateX(2px);
      }
      .skill-rec-name {
          font-size: var(--font-xs);
          font-weight: 500;
          margin-bottom: 2px;
      }
      .skill-rec-reason {
          font-size: var(--font-xs);
          opacity: 0.7;
          font-style: italic;
      }
      
      .goals-stats {
          display: flex;
          gap: 12px;
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          margin-bottom: 8px;
          opacity: 0.85;
      }
      .goal-item {
          background: var(--vscode-editor-background);
          border-radius: 5px;
          padding: 8px 10px;
          margin-bottom: 5px;
          transition: transform 0.1s ease;
      }
      .goal-item:hover {
          transform: translateX(1px);
      }
      .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
      }
      .goal-title {
          font-size: var(--font-xs);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
      }
      .goal-progress-text {
          font-size: var(--font-xs);
          color: var(--vscode-descriptionForeground);
          margin-left: 8px;
          opacity: 0.8;
      }
      .goal-bar {
          height: 3px;
          background: var(--vscode-progressBar-background);
          border-radius: 2px;
          overflow: hidden;
      }
      .goal-bar-fill {
          height: 100%;
          background: var(--persona-accent);
          border-radius: 2px;
          transition: width 0.3s ease;
      }
      
      /* Nudges Section Styles */
      .nudges-section {
          margin-bottom: 10px;
      }
      .nudge-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          background: var(--vscode-editor-background);
          border-radius: 4px;
          margin-bottom: 4px;
          border-left: 2px solid var(--vscode-charts-yellow);
          font-size: var(--font-xs);
          transition: all 0.12s ease;
      }
      .nudge-card:hover {
          transform: translateX(1px);
          background: var(--vscode-list-hoverBackground);
      }
      .nudge-card.nudge-health {
          border-left-color: var(--vscode-charts-red);
      }
      .nudge-card.nudge-streak {
          border-left-color: var(--vscode-charts-orange, #f0883e);
      }
      .nudge-card.nudge-mission {
          border-left-color: var(--vscode-charts-purple, #a371f7);
          background: linear-gradient(90deg, var(--vscode-editor-background), rgba(163, 113, 247, 0.08));
      }
      .nudge-icon {
          font-size: 16px;
          flex-shrink: 0;
          opacity: 0.9;
      }
      .nudge-content {
          flex: 1;
          min-width: 0;
      }
      .nudge-message {
          font-size: var(--font-xs);
          line-height: 1.3;
      }
      .nudge-action {
          font-size: var(--font-xs);
          color: var(--vscode-textLink-foreground);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          min-height: 36px;
          border-radius: 4px;
          transition: background 0.1s ease;
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
          padding: 3px 0;
          border-radius: 3px;
          transition: color 0.1s ease;
      }
      .features-section summary:hover {
          color: var(--vscode-textLink-foreground);
      }
      .features-section summary::-webkit-details-marker {
          display: none;
      }
      .features-section summary::before {
          content: '▸ ';
          font-size: 14px;
          margin-right: 4px;
          transition: transform 0.12s ease;
          display: inline-block;
          opacity: 0.7;
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
          margin-top: 10px;
          padding: 0 2px;
      }
      .feature-category {
          margin-bottom: 10px;
      }
      .feature-category-title {
          font-size: var(--font-xs);
          font-weight: 600;
          color: var(--vscode-foreground);
          margin-bottom: 4px;
      }
      .feature-list {
          margin: 0;
          padding-left: 17px;
          font-size: var(--font-xs);
          line-height: 1.5;
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
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--vscode-widget-border);
      }
      .feature-link-btn {
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          min-height: 36px;
          font-size: var(--font-xs);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: all 0.12s ease;
      }
      .feature-link-btn:hover {
          background: var(--vscode-button-secondaryHoverBackground);
      }

      /* ── Spike 1B: Tab Bar ── */
      .tab-bar {
          display: flex;
          border-bottom: 1px solid var(--vscode-panel-border);
          margin: 0 -16px;
          padding: 0 16px;
          gap: 0;
      }
      .tab-bar .tab {
          flex: 1;
          padding: 8px 4px;
          min-height: 36px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--vscode-foreground);
          opacity: 0.6;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          transition: all 0.15s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      .tab-bar .tab:hover {
          opacity: 0.85;
          background: var(--vscode-list-hoverBackground);
      }
      .tab-bar .tab:focus-visible {
          outline: 2px solid var(--vscode-focusBorder);
          outline-offset: 2px;
      }
      .tab-bar .tab.active {
          opacity: 1;
          font-weight: 600;
          border-bottom-color: var(--persona-accent, #6366f1);
      }
      .tab-panel { display: none; }
      .tab-panel.active { display: block; }
      .empty-state {
          text-align: center;
          padding: 32px 16px;
          opacity: 0.7;
      }
      .empty-state-icon { font-size: 32px; margin-bottom: 8px; }
      .empty-state-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
      .empty-state-desc { font-size: 12px; line-height: 1.4; }

      /* ── Docs Tab: Persona Grid ── */
      .persona-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 6px;
          margin: 8px 0;
      }
      .persona-card {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          background: var(--vscode-editor-widget-background, var(--vscode-sideBar-background));
          border: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          line-height: 1.3;
          transition: background 0.15s;
          border-left: 3px solid var(--persona-accent, #6366f1);
      }
      .persona-card:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .persona-card .persona-tag {
          font-size: 11px;
          opacity: 0.6;
      }
      .persona-card .persona-name {
          font-weight: 500;
      }
      .docs-section { margin-bottom: 12px; }
      .docs-section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin: 12px 0 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--vscode-panel-border, var(--vscode-widget-border));
      }
      .docs-cta {
          text-align: center;
          padding: 16px 12px;
          margin: 12px 0;
          background: var(--vscode-editor-widget-background);
          border: 1px solid var(--persona-accent, #6366f1);
          border-radius: 6px;
      }
      .docs-cta-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
      .docs-cta-desc { font-size: 11px; opacity: 0.7; margin-bottom: 8px; }

      /* Dashboard card styling for Mission Command */
      .dashboard-card {
          background: var(--vscode-editor-background, #1e1e1e);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 8px;
      }
      .dashboard-card-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.7;
          margin-bottom: 6px;
      }

      /* ── Tab Section Title ── */
      .tab-section-title {
          font-size: 13px;
          font-weight: 600;
          margin: 8px 0 10px;
      }
      .tab-footer-hint {
          font-size: 11px;
          opacity: 0.5;
          margin-top: 12px;
          padding: 8px 0;
          border-top: 1px solid var(--vscode-panel-border);
      }
      .tab-footer-hint code {
          background: var(--vscode-textCodeBlock-background);
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 11px;
      }

      /* ── Agents Tab ── */
      .agent-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
      }
      .agent-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px 10px;
      }
      .agent-card.agent-missing { opacity: 0.5; }
      .agent-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
      }
      .agent-icon { font-size: 16px; }
      .agent-name { font-weight: 600; font-size: 12px; flex: 1; }
      .agent-badge {
          font-size: 11px;
          padding: 1px 5px;
          border-radius: 8px;
          font-weight: 600;
      }
      .badge-ok { background: color-mix(in srgb, var(--vscode-testing-iconPassed) 20%, transparent); color: var(--vscode-testing-iconPassed); }
      .badge-missing { background: color-mix(in srgb, var(--vscode-errorForeground) 20%, transparent); color: var(--vscode-errorForeground); }
      .agent-role {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 2px;
      }
      .agent-desc {
          font-size: 11px;
          line-height: 1.4;
          opacity: 0.8;
      }
      /* Live agent status dot (7.20) */
      .agent-live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-left: 4px;
      }
      .agent-live-dot.active { background: var(--vscode-testing-iconPassed); animation: pulse-dot 1.5s infinite; }
      .agent-live-dot.idle { background: var(--vscode-disabledForeground); opacity: 0.4; }
      @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      /* Activity feed (7.10/7.21) */
      .activity-feed { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
      .activity-item {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 8px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          font-size: 11px;
      }
      .activity-status { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
      .activity-status.active { background: var(--vscode-testing-iconPassed); animation: pulse-dot 1.5s infinite; }
      .activity-status.complete { background: var(--vscode-disabledForeground); opacity: 0.5; }
      .activity-status.error { background: var(--vscode-errorForeground); }
      .activity-agent { font-weight: 600; flex-shrink: 0; }
      .activity-prompt { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.75; }
      .activity-time { font-size: 10px; opacity: 0.5; flex-shrink: 0; }

      /* ── Skill Store Tab ── */
      .skill-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
      }
      .skill-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px 10px;
          cursor: pointer;
          transition: border-color 0.15s;
      }
      .skill-card:hover {
          border-color: var(--persona-accent, #6366f1);
      }
      .skill-header {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
      }
      .skill-name { font-weight: 600; font-size: 12px; flex: 1; }
      .skill-synapse-dot { font-size: 11px; opacity: 0.7; }
      .skill-category {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.5;
          margin-bottom: 2px;
      }
      .skill-desc {
          font-size: 11px;
          line-height: 1.4;
          opacity: 0.8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
      }

      /* ── Mind Tab ── */
      .mind-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
      }
      .mind-stat-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 12px;
          text-align: center;
      }
      .mind-stat-value {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
      }
      .mind-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
      }
      .stat-good { color: var(--vscode-testing-iconPassed); }
      .stat-warn { color: var(--vscode-editorWarning-foreground); }
      .stat-bad { color: var(--vscode-errorForeground); }

      .memory-modality {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
      }
      .modality-label {
          font-size: 11px;
          width: 72px;
          flex-shrink: 0;
          opacity: 0.8;
      }
      .modality-bar {
          flex: 1;
          height: 6px;
          background: var(--vscode-progressBar-background, #333);
          border-radius: 3px;
          overflow: hidden;
      }
      .modality-fill {
          height: 100%;
          background: var(--persona-accent, #6366f1);
          border-radius: 3px;
          transition: width 0.3s ease;
      }
      .modality-count {
          font-size: 11px;
          font-weight: 600;
          width: 28px;
          text-align: right;
          flex-shrink: 0;
      }

      .mind-maintenance-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
      }
      .maintenance-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.15s;
      }
      .maintenance-item:hover {
          background: var(--vscode-list-hoverBackground);
      }
      .maintenance-icon { font-size: 20px; margin-bottom: 4px; }
      .maintenance-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 2px;
      }
      .maintenance-value {
          font-size: 11px;
          font-weight: 500;
      }

      /* ── Architecture Status Banner (7.9) ── */
      .arch-status-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 8px;
          cursor: pointer;
          border: 1px solid var(--vscode-widget-border, #303030);
      }
      .arch-status-banner.status-healthy {
          background: color-mix(in srgb, var(--vscode-testing-iconPassed) 8%, transparent);
          border-color: color-mix(in srgb, var(--vscode-testing-iconPassed) 25%, transparent);
      }
      .arch-status-banner.status-warning {
          background: color-mix(in srgb, var(--vscode-editorWarning-foreground) 8%, transparent);
          border-color: color-mix(in srgb, var(--vscode-editorWarning-foreground) 25%, transparent);
      }
      .arch-status-banner.status-error {
          background: color-mix(in srgb, var(--vscode-errorForeground) 8%, transparent);
          border-color: color-mix(in srgb, var(--vscode-errorForeground) 25%, transparent);
      }
      .arch-status-icon { font-size: 20px; flex-shrink: 0; }
      .arch-status-detail { flex: 1; }
      .arch-status-title { font-weight: 600; font-size: 12px; }
      .arch-status-meta { font-size: 11px; opacity: 0.7; }

      /* ── Nudge Dismiss (7.12) ── */
      .nudge-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 11px;
          opacity: 0.4;
          padding: 4px;
          color: var(--vscode-foreground);
          flex-shrink: 0;
          align-self: flex-start;
      }
      .nudge-dismiss:hover { opacity: 1; }

      /* ── Info Card (7.22, 7.23) ── */
      .info-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 10px 12px;
          margin: 8px 0;
      }
      .info-card-title { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
      .info-card-desc { font-size: 11px; opacity: 0.8; line-height: 1.5; }

      /* ── Skill Search & Filter (7.24, 7.25) ── */
      .skill-search-input {
          width: 100%;
          padding: 4px 8px;
          min-height: 28px;
          border: 1px solid var(--vscode-input-border, var(--vscode-widget-border));
          border-radius: 4px;
          background: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          font-size: 12px;
          outline: none;
          margin-bottom: 8px;
      }
      .skill-search-input:focus { border-color: var(--vscode-focusBorder); }
      .skill-search-input::placeholder { color: var(--vscode-input-placeholderForeground); }
      .catalog-toggle {
          display: flex;
          gap: 0;
          margin-bottom: 8px;
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          overflow: hidden;
      }
      .catalog-toggle-btn {
          flex: 1;
          padding: 4px 8px;
          min-height: 28px;
          background: var(--vscode-editor-background);
          color: var(--vscode-foreground);
          border: none;
          font-size: 11px;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.15s;
      }
      .catalog-toggle-btn:not(:last-child) {
          border-right: 1px solid var(--vscode-widget-border, #303030);
      }
      .catalog-toggle-btn.active {
          background: var(--persona-accent, #6366f1);
          color: #fff;
          opacity: 1;
          font-weight: 600;
      }

      /* ── Skill Health Summary (7.26) ── */
      .skill-health-bar {
          display: flex;
          gap: 12px;
          padding: 4px 0;
          margin-bottom: 8px;
          font-size: 11px;
          opacity: 0.7;
      }
      .skill-health-item { display: flex; align-items: center; gap: 4px; }

      /* ── Skill Category Groups (7.27) ── */
      .skill-category-group { margin-bottom: 8px; }
      .skill-category-header {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          cursor: pointer;
          user-select: none;
      }
      .skill-category-header .collapse-icon {
          transition: transform 0.15s;
          font-size: 11px;
      }
      .skill-category-header.collapsed .collapse-icon { transform: rotate(-90deg); }
      .skill-category-group-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
      }
      .skill-category-header.collapsed + .skill-category-group-content { display: none; }

      /* ── Identity Card (7.35) ── */
      .identity-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 8px;
          text-align: center;
      }
      .identity-name { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
      .identity-meta { font-size: 11px; opacity: 0.7; }

      /* ── Cognitive Age Enriched (7.36) ── */
      .cognitive-tier-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-top: 4px;
      }
      .cognitive-progress-bar {
          width: 100%;
          height: 6px;
          background: var(--vscode-progressBar-background, #333);
          border-radius: 3px;
          overflow: hidden;
          margin: 8px 0 4px;
      }
      .cognitive-progress-fill {
          height: 100%;
          background: var(--persona-accent, #6366f1);
          border-radius: 3px;
          transition: width 0.3s ease;
      }
      .cognitive-milestones {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          opacity: 0.4;
      }

      /* ── Global Knowledge Panel (7.34) ── */
      .gk-panel {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 8px;
      }
      .gk-stat {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px;
          text-align: center;
      }
      .gk-stat-icon { font-size: 20px; display: block; margin-bottom: 2px; }
      .gk-stat-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; }

      /* ── Doc Grid Cards (7.40, 7.41, 7.42) ── */
      .doc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
      }
      .doc-grid-card {
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
          transition: border-color 0.15s;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-height: 36px;
      }
      .doc-grid-card:hover { border-color: var(--persona-accent, #6366f1); }
      .doc-grid-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
      .doc-grid-text { flex: 1; }
      .doc-grid-title { font-size: 12px; font-weight: 600; }
      .doc-grid-desc { font-size: 11px; opacity: 0.7; }

      /* ── Partnership Card (7.43) ── */
      .partnership-structured {
          background: var(--vscode-editor-background);
          border: 1px solid var(--persona-accent, #6366f1);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 8px;
      }
      .partnership-structured-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
      .partnership-structured-desc { font-size: 11px; opacity: 0.8; line-height: 1.5; margin-bottom: 8px; }

      /* ── Doc Tips (7.39) ── */
      .doc-tips { margin-bottom: 8px; }
      .doc-tip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px;
          background: var(--vscode-editor-background);
          border: 1px solid var(--vscode-widget-border, #303030);
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 11px;
          line-height: 1.4;
      }
      .doc-tip-icon { font-size: 14px; flex-shrink: 0; }
      .doc-tip-dismiss {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          opacity: 0.4;
          padding: 4px;
          color: var(--vscode-foreground);
          flex-shrink: 0;
          margin-left: auto;
      }
      .doc-tip-dismiss:hover { opacity: 1; }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <div class="header-accent-bar"></div>
          <div class="header-watermark">ALEX</div>
          <div class="header-series">COGNITIVE ARCHITECTURE</div>
          <div class="header-main">
              <img src="${logoUri}" alt="Alex v${version}" class="header-icon" data-cmd="workingWithAlex" title="Alex v${version} — Click to learn how to work with Alex" tabindex="0" role="button" />
              <div class="header-text">
                  <span class="header-title">Alex Cognitive</span>
                  <span class="header-persona" data-cmd="skillReview" title="${personaName} — Click to explore skills" tabindex="0" role="button">${personaIcon} ${personaName}</span>
              </div>
              <button class="refresh-btn" data-cmd="refresh" title="Refresh" aria-label="Refresh welcome view">↻</button>
          </div>
      </div>

      <div class="hero-text-box">
          ${easterEggBadge}
          <div class="hero-hook">Your Trusted Partner for <strong>${bannerNoun}</strong></div>
          ${activeContext?.northStar ? `<div class="hero-north-star" data-cmd="northStar" title="North Star — Click to review" tabindex="0" role="button">⭐ ${escapeHtml(activeContext.northStar)}</div>` : ''}
          ${hasObjective ? `<div class="hero-objective">${escapeHtml(rawObjective!)}</div>` : ''}
      </div>

      <!-- Spike 1B: Tab Bar -->
      <div class="tab-bar" role="tablist" aria-label="Command Center">
          <button role="tab" id="tab-mission" class="tab active" data-tab="mission" aria-selected="true" aria-controls="panel-mission" tabindex="0">Mission</button>
          <button role="tab" id="tab-agents" class="tab" data-tab="agents" aria-selected="false" aria-controls="panel-agents" tabindex="-1">Agents</button>
          <button role="tab" id="tab-skills" class="tab" data-tab="skills" aria-selected="false" aria-controls="panel-skills" tabindex="-1">Skills</button>
          <button role="tab" id="tab-mind" class="tab" data-tab="mind" aria-selected="false" aria-controls="panel-mind" tabindex="-1">Mind</button>
          <button role="tab" id="tab-docs" class="tab" data-tab="docs" aria-selected="false" aria-controls="panel-docs" tabindex="-1">Docs</button>
      </div>

      <!-- Tab Panel: Mission Command -->
      <div class="tab-panel active" id="panel-mission" role="tabpanel" aria-labelledby="tab-mission">

      ${sessionHtml}
      
      ${getNudgesHtml(nudges)}
      
      <input type="text" class="quick-command-input" id="mission-command-search" placeholder="Search commands\u2026" aria-label="Search commands" />

      <nav class="action-list" aria-label="Actions" role="navigation" id="mission-action-list">
              
              <div class="action-group-label" data-group="partnership"><span class="collapse-chevron" aria-hidden="true">▾</span>PARTNERSHIP</div>
              <div class="action-group-content" data-group="partnership">
              <button class="action-btn primary" data-cmd="openChat" tabindex="0" role="button" aria-label="Start a conversation with Alex">
                  <span class="action-icon" aria-hidden="true">💬</span>
                  <span class="action-text">Chat with Alex</span>
              </button>
              ${actionButton('northStar', '⭐', 'North Star', 'Define or review project vision and quality standards')}
              ${actionButton('rubberDuck', '🦆', 'Think Together', 'Work through problems as partners')}
              </div>
              
              <div class="action-group-label" data-group="system"><span class="collapse-chevron" aria-hidden="true">▾</span>SYSTEM</div>
              <div class="action-group-content" data-group="system">
              <button class="action-btn" data-cmd="upgrade" tabindex="0" role="button" aria-label="Initialize or Update Alex architecture">
                  <span class="action-icon" aria-hidden="true">${hasGlobalKnowledge ? "🌐" : "⬆️"}</span>
                  <span class="action-text">Initialize / Update</span>
              </button>
              ${actionButton('setupEnvironment', '⚙️', 'Environment Setup', 'Configure VS Code settings')}
              ${actionButton('manageSecrets', '🔑', 'API Keys & Secrets', 'Manage tokens for Gamma, Replicate, OpenAI')}
              ${actionButton('detectEnvSecrets', '🔍', 'Detect .env Secrets', 'Scan .env files and migrate to secure storage')}
              ${actionButton('exportM365', '📦', 'Export for M365', 'Package knowledge for M365 Copilot')}
              ${actionButton('provideFeedback', '💬', 'Feedback', 'Share feedback, ideas, or feature requests')}
              ${actionButton('viewDiagnostics', '🩺', 'Diagnostics', 'View diagnostics and report issues')}
              </div>
              
              <div class="action-group-label" data-group="trust"><span class="collapse-chevron" aria-hidden="true">▾</span>TRUST & GROWTH</div>
              <div class="action-group-content" data-group="trust">
              ${actionButton('dream', '💭', 'Dream', 'Neural maintenance — keeps me reliable')}
              ${actionButton('selfActualize', '✨', 'Self-Actualize', 'Deep self-assessment — honest about my capabilities')}
              ${actionButton('openBrainAnatomy', '🧠', 'How I Think', 'Explore my cognitive architecture')}
              ${actionButton('startSession', '🍅', 'Focus Session', 'Pomodoro-style work sessions')}
              ${actionButton('showGoals', '🎯', 'Goals', 'Track learning progress')}
              </div>
              
              <div class="action-group-label" data-group="build"><span class="collapse-chevron" aria-hidden="true">▾</span>BUILD TOGETHER</div>
              <div class="action-group-content" data-group="build">
              ${actionButton('codeReview', '👀', 'Code Review', 'Review for correctness and growth')}
              ${actionButton('debugThis', '🐛', 'Debug This', 'Find the issue together')}
              ${actionButton('generateTests', '🧪', 'Generate Tests', 'Build confidence in your code')}
              ${actionButton('runAudit', '🔍', 'Project Audit', 'Comprehensive quality check')}
              ${actionButton('releasePreflight', '🚀', 'Release Preflight')}
              ${actionButton('importGitHubIssues', '📋', 'Import Issues', 'Import GitHub issues as goals')}
              ${actionButton('reviewPR', '👁️', 'Review PR', 'AI-powered pull request review')}
              </div>
              
              <div class="action-group-label" data-group="present"><span class="collapse-chevron" aria-hidden="true">▾</span>PRESENT & SHARE</div>
              <div class="action-group-content" data-group="present">
              ${actionButton('generatePptx', '📄', 'Marp PPTX (Local)', 'Generate PowerPoint locally with Marp - free, offline')}
              ${actionButton('generateGammaPresentation', '🎨', 'Gamma (Cloud)', 'Generate beautiful AI presentations via Gamma API')}
              ${actionButton('generateGammaAdvanced', '⚙️', 'Gamma Advanced', 'Gamma with style, model, and image options')}
              </div>
              
              <div class="action-group-label" data-group="visualize"><span class="collapse-chevron" aria-hidden="true">▾</span>VISUALIZE</div>
              <div class="action-group-content" data-group="visualize">
              ${actionButton('generateAIImage', '🖼️', 'Generate Image', 'Generate AI images from text prompts via Replicate')}
              ${actionButton('editImageAI', '✏️', 'Edit Image (AI)', 'Edit images with AI using nano-banana-pro model')}
              </div>
          </nav>
      
      ${getGoalsHtml(goals)}

      </div><!-- /panel-mission -->

      <!-- Tab Panel: Agents -->
      <div class="tab-panel" id="panel-agents" role="tabpanel" aria-labelledby="tab-agents">
          <div class="cognitive-state-card">
              <span class="cognitive-state-icon">${cognitiveState === 'debugging' ? '🔍' : cognitiveState === 'building' ? '🔨' : cognitiveState === 'reviewing' ? '👀' : cognitiveState === 'planning' ? '📐' : cognitiveState === 'learning' ? '📖' : cognitiveState === 'teaching' ? '🎓' : cognitiveState === 'meditation' ? '🧘' : cognitiveState === 'dream' ? '💭' : cognitiveState === 'discovery' ? '💡' : '🧠'}</span>
              <div class="cognitive-state-detail">
                  <div class="cognitive-state-label">${cognitiveState ? cognitiveState.charAt(0).toUpperCase() + cognitiveState.slice(1) : 'Ready'}</div>
                  <div class="cognitive-state-mode">${agentMode ? 'Agent: ' + agentMode : 'Awaiting task'}</div>
              </div>
          </div>

          <div class="personality-toggle" role="radiogroup" aria-label="Personality mode">
              <button class="personality-toggle-btn${(personalityMode ?? 'auto') === 'auto' ? ' active' : ''}" data-mode="auto" role="radio" aria-checked="${(personalityMode ?? 'auto') === 'auto'}">🤖 Auto</button>
              <button class="personality-toggle-btn${personalityMode === 'precise' ? ' active' : ''}" data-mode="precise" role="radio" aria-checked="${personalityMode === 'precise'}">🎯 Precise</button>
              <button class="personality-toggle-btn${personalityMode === 'chatty' ? ' active' : ''}" data-mode="chatty" role="radio" aria-checked="${personalityMode === 'chatty'}">💬 Chatty</button>
          </div>

          <div class="tab-section-title">Agent Registry</div>
          <div class="agent-list">
              ${(agents ?? []).map(a => {
              const isActive = (recentActivity ?? []).some(act => act.agent === a.name && act.status === 'active');
              return `
              <div class="agent-card${!a.installed ? ' agent-missing' : ''}" title="${escapeHtml(a.description)}">
                  <div class="agent-card-header">
                      <span class="agent-icon">${escapeHtml(a.icon)}</span>
                      <span class="agent-name">${escapeHtml(a.name)}</span>
                      <span class="agent-live-dot ${isActive ? 'active' : 'idle'}" title="${isActive ? 'Active' : 'Idle'}"></span>
                      <span class="agent-badge ${a.installed ? 'badge-ok' : 'badge-missing'}">${a.installed ? '✓' : '✗'}</span>
                  </div>
                  <div class="agent-role">${escapeHtml(a.role)}</div>
                  <div class="agent-desc">${escapeHtml(a.description)}</div>
              </div>`;}).join('')}
          </div>
          <div class="tab-footer-hint">Agents are specialist modes — invoke with <code>@alex</code> or via the agent picker.</div>

          ${(recentActivity ?? []).length > 0 ? `
          <div class="tab-section-title">Recent Activity</div>
          <div class="activity-feed">
              ${(recentActivity ?? []).map(act => {
              const elapsed = act.completedAt ? Math.round((act.completedAt - act.startedAt) / 1000) : Math.round((Date.now() - act.startedAt) / 1000);
              const timeLabel = elapsed < 60 ? elapsed + 's' : Math.round(elapsed / 60) + 'm';
              return `
              <div class="activity-item">
                  <span class="activity-status ${act.status}"></span>
                  <span class="activity-agent">${escapeHtml(act.agent)}</span>
                  <span class="activity-prompt">${escapeHtml(act.prompt)}</span>
                  <span class="activity-time">${act.status === 'active' ? '\u23f1 ' : ''}${timeLabel}</span>
              </div>`;}).join('')}
          </div>` : ''}

          <div class="info-card">
              <div class="info-card-title">🔀 Auto-Routing</div>
              <div class="info-card-desc">Alex automatically routes conversations to the best specialist agent based on your task. Complex multi-step work triggers skill selection optimization. Domain pivots are detected and handed off seamlessly.</div>
          </div>

          <div class="info-card" style="border-style: dashed; opacity: 0.7;">
              <div class="info-card-title">➕ Create Custom Agent</div>
              <div class="info-card-desc">Define your own specialist agent with custom instructions, tool access, and routing rules.</div>
              ${actionButton('openDocs', '📄', 'Agent Authoring Guide', 'Learn how to create custom agents')}
          </div>
      </div>

      <!-- Tab Panel: Skills -->
      <div class="tab-panel" id="panel-skills" role="tabpanel" aria-labelledby="tab-skills">
          <div class="tab-section-title">Skills (${(skills ?? []).length})</div>
          ${(skills ?? []).length === 0 ? `
          <div class="empty-state">
              <div class="empty-state-icon">📦</div>
              <div class="empty-state-title">No Skills Found</div>
              <div class="empty-state-desc">Initialize Alex architecture to install skills.</div>
          </div>` : `

          <input type="text" class="skill-search-input" id="skill-search" placeholder="Search skills\u2026" aria-label="Search skills" />

          <div class="skill-health-bar">
              <span class="skill-health-item"><span class="status-dot dot-green" aria-hidden="true"></span> ${health.totalSynapses} synapses</span>
              <span class="skill-health-item"><span class="status-dot ${health.brokenSynapses === 0 ? 'dot-green' : 'dot-yellow'}" aria-hidden="true"></span> ${health.brokenSynapses} broken</span>
          </div>

          <div id="skill-list">
          ${CATEGORY_ORDER.map(cat => {
              const catSkills = skillCategories[cat];
              if (!catSkills || catSkills.length === 0) return '';
              const catIcon = CATEGORY_ICONS[cat] || '📦';
              return `
              <div class="skill-category-group" data-tier="${cat}">
                  <div class="skill-category-header" role="button" tabindex="0" aria-expanded="true" aria-label="Toggle ${cat} skills">
                      <span class="collapse-icon" aria-hidden="true">▾</span>
                      <span>${catIcon} ${cat} (${catSkills.length})</span>
                  </div>
                  <div class="skill-category-group-content">
                      ${catSkills.map(s => `
                      <div class="skill-card" data-cmd="openSkill" data-skill="${escapeHtml(s.id)}" data-skill-name="${escapeHtml(s.displayName)}" title="${escapeHtml(s.description)}" tabindex="0" role="button">
                          <div class="skill-header">
                              <span class="skill-name">${escapeHtml(s.displayName)}</span>
                              ${s.hasSynapses ? '<span class="skill-synapse-dot" title="Has synapses">⚡</span>' : ''}
                          </div>
                          <div class="skill-desc">${escapeHtml(s.description)}</div>
                      </div>`).join('')}
                  </div>
              </div>`;
          }).join('')}
          </div>
          `}
      </div>

      <!-- Tab Panel: Mind -->
      <div class="tab-panel" id="panel-mind" role="tabpanel" aria-labelledby="tab-mind">
          ${mindData ? `
          <div class="identity-card">
              <div class="identity-name">Alex Finch</div>
              <div class="identity-meta">Age 26 · Curious · Ethical · Grows through reflection</div>
          </div>

          <div class="arch-status-banner ${healthBannerClass}" data-cmd="healthDashboard" title="Click to open Health Dashboard" tabindex="0" role="button" aria-label="Architecture health: ${healthBannerLabel}">
              <span class="arch-status-icon" aria-hidden="true">${healthBannerIcon}</span>
              <div class="arch-status-detail">
                  <div class="arch-status-title">Architecture ${healthBannerLabel}</div>
                  <div class="arch-status-meta">${health.totalSynapses} synapses${health.brokenSynapses > 0 ? ` · ${health.brokenSynapses} broken` : ''} · ${healthPct}%</div>
              </div>
          </div>

          <div class="mind-stats-row">
              <div class="mind-stat-card">
                  <div class="mind-stat-value">${mindData.cognitiveAge}</div>
                  <div class="mind-stat-label">Cognitive Age</div>
                  <div class="cognitive-tier-label">${cogTier}</div>
                  <div class="cognitive-progress-bar"><div class="cognitive-progress-fill" style="width: ${cogProgress}%"></div></div>
                  <div class="cognitive-milestones">
                      <span>Learning</span><span>Growth</span><span>Integrated</span><span>Wise</span>
                  </div>
              </div>
              <div class="mind-stat-card">
                  <div class="mind-stat-value">${streakDays > 0 ? streakDays : '0'}</div>
                  <div class="mind-stat-label">Day Streak</div>
              </div>
          </div>

          ${hasGlobalKnowledge ? `
          <div class="dashboard-card">
              <div class="dashboard-card-title">Global Knowledge</div>
              <div class="gk-panel">
                  <div class="gk-stat">
                      <span class="gk-stat-icon">📚</span>
                      <div class="gk-stat-label">Insights</div>
                  </div>
                  <div class="gk-stat">
                      <span class="gk-stat-icon">🔗</span>
                      <div class="gk-stat-label">Cross-Project</div>
                  </div>
                  <div class="gk-stat">
                      <span class="gk-stat-icon">⭐</span>
                      <div class="gk-stat-label">Promoted</div>
                  </div>
              </div>
              ${actionButton('knowledgeQuickPick', '🔎', 'Search Knowledge', 'Find patterns from past work')}
          </div>
          ` : ''}



          <div class="dashboard-card">
              <div class="dashboard-card-title">Memory Architecture</div>
              <div class="memory-modalities">
                  <div class="memory-modality-card">
                      <div class="memory-modality-icon">📚</div>
                      <div class="memory-modality-count">${mindData.skillCount}</div>
                      <div class="memory-modality-label">Skills</div>
                  </div>
                  <div class="memory-modality-card">
                      <div class="memory-modality-icon">📋</div>
                      <div class="memory-modality-count">${mindData.instructionCount}</div>
                      <div class="memory-modality-label">Instructions</div>
                  </div>
                  <div class="memory-modality-card">
                      <div class="memory-modality-icon">💬</div>
                      <div class="memory-modality-count">${mindData.promptCount}</div>
                      <div class="memory-modality-label">Prompts</div>
                  </div>
                  <div class="memory-modality-card">
                      <div class="memory-modality-icon">🤖</div>
                      <div class="memory-modality-count">${mindData.agentCount}</div>
                      <div class="memory-modality-label">Agents</div>
                  </div>
                  <div class="memory-modality-card">
                      <div class="memory-modality-icon">🧠</div>
                      <div class="memory-modality-count">${mindData.episodicCount}</div>
                      <div class="memory-modality-label">Episodic</div>
                  </div>
              </div>
              ${actionButton('memoryDashboard', '🧠', 'Memory Architecture', 'Explore all memory systems')}
          </div>

          <div class="dashboard-card">
              <div class="dashboard-card-title">Maintenance</div>
              <div class="mind-maintenance-row">
                  <div class="maintenance-item" data-cmd="dream" tabindex="0" role="button" title="Run Dream maintenance">
                      <span class="maintenance-icon">💭</span>
                      <span class="maintenance-label">Last Dream</span>
                      <span class="maintenance-value">${mindData.lastDreamDate ?? 'Never'}</span>
                  </div>
                  <div class="maintenance-item" data-cmd="selfActualize" tabindex="0" role="button" title="Run Self-Actualization">
                      <span class="maintenance-icon">✨</span>
                      <span class="maintenance-label">Last Meditation</span>
                      <span class="maintenance-value">${mindData.lastMeditationDate ?? 'Never'}</span>
                  </div>
              </div>
          </div>

          <div class="dashboard-card">
              <div class="dashboard-card-title">Learn & Knowledge</div>
              ${actionButton('askAboutSelection', '💬', 'Ask About Selection', 'Ask about code or concepts')}
              ${actionButton('saveSelectionAsInsight', '💡', 'Save Insight', 'Remember this for future projects')}
              ${hasGlobalKnowledge
                  ? actionButton('knowledgeQuickPick', '🔎', 'Search Knowledge', 'Find patterns from past work')
                  : actionButton('searchRelatedKnowledge', '🔍', 'Search Knowledge', 'Find patterns from past work')
              }
              ${actionButton('generateDiagram', '📊', 'Generate Diagram', 'Visualize architecture and flow')}
              ${actionButton('readAloud', '🔊', 'Read Aloud', 'Listen to documentation')}
              ${actionButton('memoryDashboard', '🧠', 'Memory Architecture', 'Explore all memory systems')}
          </div>
          ` : `
          <div class="empty-state">
              <div class="empty-state-icon">🧠</div>
              <div class="empty-state-title">Mind</div>
              <div class="empty-state-desc">Initialize Alex architecture to see cognitive dashboard.</div>
          </div>
          `}
      </div>

      <!-- Tab Panel: Docs -->
      <div class="tab-panel" id="panel-docs" role="tabpanel" aria-labelledby="tab-docs">

          <div class="doc-tips" id="doc-tips">
              <div class="doc-tip">
                  <span class="doc-tip-icon">💡</span>
                  <span>Use <strong>/meditate</strong> to consolidate learning across sessions</span>
                  <button class="doc-tip-dismiss" aria-label="Dismiss tip">×</button>
              </div>
              <div class="doc-tip">
                  <span class="doc-tip-icon">💡</span>
                  <span>Skills auto-load by file type — open a .ts file and coding skills activate</span>
                  <button class="doc-tip-dismiss" aria-label="Dismiss tip">×</button>
              </div>
              <div class="doc-tip">
                  <span class="doc-tip-icon">💡</span>
                  <span>Run <strong>/dream</strong> after big changes to validate synapses</span>
                  <button class="doc-tip-dismiss" aria-label="Dismiss tip">×</button>
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Getting Started</div>
              <div class="doc-grid">
                  <div class="doc-grid-card" data-cmd="setupEnvironment" tabindex="0" role="button">
                      <span class="doc-grid-icon">⚙️</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Setup Guide</div>
                          <div class="doc-grid-desc">Configure VS Code for Alex</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="workingWithAlex" tabindex="0" role="button">
                      <span class="doc-grid-icon">🎓</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">How We Work</div>
                          <div class="doc-grid-desc">Collaboration patterns</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="cognitiveLevels" tabindex="0" role="button">
                      <span class="doc-grid-icon">🧬</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Cognitive Levels</div>
                          <div class="doc-grid-desc">Unlocks at each tier</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="quickReference" tabindex="0" role="button">
                      <span class="doc-grid-icon">⚡</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Quick Reference</div>
                          <div class="doc-grid-desc">Commands and shortcuts</div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Architecture</div>
              <div class="doc-grid">
                  <div class="doc-grid-card" data-cmd="openBrainAnatomy" tabindex="0" role="button">
                      <span class="doc-grid-icon">🧠</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Brain Anatomy</div>
                          <div class="doc-grid-desc">Interactive 3D visualization</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:COGNITIVE-ARCHITECTURE" tabindex="0" role="button">
                      <span class="doc-grid-icon">🏗️</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Cognitive Architecture</div>
                          <div class="doc-grid-desc">Full system design</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:MEMORY-SYSTEMS" tabindex="0" role="button">
                      <span class="doc-grid-icon">💾</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Memory Systems</div>
                          <div class="doc-grid-desc">5 modality architecture</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:CONSCIOUS-MIND" tabindex="0" role="button">
                      <span class="doc-grid-icon">💡</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Conscious Mind</div>
                          <div class="doc-grid-desc">Skills, agents, prompts</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:AGENT-CATALOG" tabindex="0" role="button">
                      <span class="doc-grid-icon">🤖</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Agent Catalog</div>
                          <div class="doc-grid-desc">All specialist agents</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:TRIFECTA-CATALOG" tabindex="0" role="button">
                      <span class="doc-grid-icon">🔺</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Trifecta Catalog</div>
                          <div class="doc-grid-desc">Skill + Instruction + Prompt</div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Operations</div>
              <div class="doc-grid">
                  <div class="doc-grid-card" data-cmd="openDoc:MASTER-ALEX-PROTECTED" tabindex="0" role="button">
                      <span class="doc-grid-icon">🛡️</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Protection</div>
                          <div class="doc-grid-desc">Safety imperatives</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDocs" tabindex="0" role="button">
                      <span class="doc-grid-icon">📁</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Project Structure</div>
                          <div class="doc-grid-desc">Files and directories</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:HEIR-ARCHITECTURE" tabindex="0" role="button">
                      <span class="doc-grid-icon">👑</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Heir Architecture</div>
                          <div class="doc-grid-desc">Master-Heir sync</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="openDoc:RESEARCH-FIRST" tabindex="0" role="button">
                      <span class="doc-grid-icon">🔬</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Research Papers</div>
                          <div class="doc-grid-desc">Foundation research</div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Workshop Study Guides</div>
              <div class="persona-grid">
                  ${getPersonaGridHtml()}
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Self-Study & Exercises</div>
              ${actionButton('learnAlexSelfStudy', '📝', 'Self-Study Path', 'Self-paced learning at your own speed')}
              ${actionButton('learnAlexExercises', '🏋️', 'Exercises', 'Hands-on practice exercises')}
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Facilitator Materials</div>
              ${actionButton('learnAlexSessionPlan', '📋', 'Session Plan', 'Workshop session planning guide')}
              ${actionButton('learnAlexSlides', '📊', 'Slides', 'Presentation slides for workshops')}
              ${actionButton('learnAlexDemoScripts', '🎬', 'Demo Scripts', 'Live demo walkthroughs')}
              ${actionButton('learnAlexHandout', '📄', 'Handout', 'Printable workshop handout')}
              ${actionButton('learnAlexPreRead', '📖', 'Pre-Read', 'Pre-workshop reading material')}
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Partnership</div>
              <div class="partnership-structured">
                  <div class="partnership-structured-title">🤝 Working with Alex</div>
                  <div class="partnership-structured-desc">Alex is a cognitive partner, not a tool. Learn about the autonomous partnership model — how Alex grows, remembers, and collaborates across sessions.</div>
                  <button class="action-btn primary" data-cmd="workingWithAlex" tabindex="0">Explore Partnership</button>
              </div>
          </div>

          <div class="docs-cta">
              <div class="docs-cta-title">📚 Learn Alex Online</div>
              <div class="docs-cta-desc">Comprehensive guides, workshops, and training at the companion site.</div>
              <button class="action-btn primary" data-cmd="learnAlex" tabindex="0" style="display: inline-flex;">Visit learnalex.correax.com</button>
          </div>

      </div>

  </div>
  
  <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      
      function cmd(command, data) {
          vscode.postMessage({ command, ...data });
      }
      
      function refresh() {
          vscode.postMessage({ command: 'refresh' });
      }

      // ── Tab switching with state persistence + scroll restoration ──
      const tabs = document.querySelectorAll('.tab-bar .tab');
      const panels = document.querySelectorAll('.tab-panel');
      const scrollPositions = {};

      function switchTab(tabId, restoreScroll) {
          // Save current panel's scroll position before switching
          const currentActive = document.querySelector('.tab.active');
          if (currentActive) {
              const currentId = currentActive.getAttribute('data-tab');
              scrollPositions[currentId] = document.documentElement.scrollTop || document.body.scrollTop;
          }
          tabs.forEach(t => {
              const isActive = t.getAttribute('data-tab') === tabId;
              t.classList.toggle('active', isActive);
              t.setAttribute('aria-selected', isActive ? 'true' : 'false');
              t.setAttribute('tabindex', isActive ? '0' : '-1');
          });
          panels.forEach(p => {
              p.classList.toggle('active', p.id === 'panel-' + tabId);
          });
          // Restore scroll position for the newly active panel
          const savedScroll = restoreScroll ? (scrollPositions[tabId] || 0) : 0;
          requestAnimationFrame(() => {
              document.documentElement.scrollTop = savedScroll;
              document.body.scrollTop = savedScroll;
          });
          // Persist to webview state and notify extension
          const state = vscode.getState() || {};
          state.activeTab = tabId;
          state.scrollPositions = scrollPositions;
          vscode.setState(state);
          vscode.postMessage({ command: 'tabSwitch', tabId });
      }

      // Click handler for tabs
      tabs.forEach(tab => {
          tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab'), true));
      });

      // Keyboard: arrow keys between tabs, Enter/Space to activate
      document.querySelector('.tab-bar')?.addEventListener('keydown', (e) => {
          const focused = document.activeElement;
          if (!focused || !focused.classList.contains('tab')) return;
          const tabList = Array.from(tabs);
          const idx = tabList.indexOf(focused);
          let newIdx = idx;
          if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabList.length;
          else if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabList.length) % tabList.length;
          else if (e.key === 'Home') newIdx = 0;
          else if (e.key === 'End') newIdx = tabList.length - 1;
          else return;
          e.preventDefault();
          tabList[newIdx].focus();
          switchTab(tabList[newIdx].getAttribute('data-tab'), true);
      });

      // Restore tab + scroll from persisted state
      const savedState = vscode.getState();
      if (savedState?.scrollPositions) {
          Object.assign(scrollPositions, savedState.scrollPositions);
      }
      if (savedState?.activeTab) {
          switchTab(savedState.activeTab, true);
      }
      
      // Event delegation for all data-cmd clicks (CSP-compliant)
      function handleDataCmd(el) {
          const command = el.getAttribute('data-cmd');
          const skill = el.getAttribute('data-skill');
          const skillName = el.getAttribute('data-skill-name');
          const workshop = el.getAttribute('data-workshop');
          if (skill) {
              cmd(command, { skill, skillName });
          } else if (workshop) {
              cmd(command, { workshop });
          } else {
              cmd(command);
          }
      }
      document.addEventListener('click', function(e) {
          const el = e.target.closest('[data-cmd]');
          if (el) {
              e.preventDefault();
              handleDataCmd(el);
          }
      });
      // Keyboard activation for non-button [data-cmd] elements (Enter/Space)
      document.addEventListener('keydown', function(e) {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          const el = e.target.closest('[data-cmd]');
          if (!el || el.tagName === 'BUTTON') return;
          e.preventDefault();
          handleDataCmd(el);
      });
      
      // Listen for messages from the extension (e.g. programmatic tab switch)
      const validTabs = ['mission', 'agents', 'skills', 'mind', 'docs'];
      window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'switchToTab' && validTabs.includes(message.tabId)) {
              switchTab(message.tabId, false);
          }
      });

      // Auto-refresh interval (30 seconds)
      const AUTO_REFRESH_MS = 30000;
      setInterval(refresh, AUTO_REFRESH_MS);

      // ── Nudge dismiss (7.12) ──
      document.addEventListener('click', function(e) {
          const btn = e.target.closest('.nudge-dismiss');
          if (btn) {
              const card = btn.closest('.nudge-card');
              if (card) { card.style.display = 'none'; }
          }
      });

      // ── Skill search filter ──
      function applySkillSearch() {
          const searchEl = document.getElementById('skill-search');
          const q = (searchEl ? searchEl.value : '').toLowerCase();
          document.querySelectorAll('.skill-card').forEach(function(card) {
              card.style.display = (!q || (card.textContent || '').toLowerCase().includes(q)) ? '' : 'none';
          });
          // Hide category groups where all cards are hidden
          document.querySelectorAll('.skill-category-group').forEach(function(group) {
              const visibleCards = group.querySelectorAll('.skill-card:not([style*="display: none"])');
              group.style.display = visibleCards.length === 0 ? 'none' : '';
          });
      }

      const skillSearch = document.getElementById('skill-search');
      if (skillSearch) {
          skillSearch.addEventListener('input', applySkillSearch);
      }

      // ── Category collapse (7.27) ──
      document.querySelectorAll('.skill-category-header').forEach(function(hdr) {
          hdr.addEventListener('click', function() {
              const isCollapsed = this.classList.toggle('collapsed');
              this.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
          });
      });

      // ── Doc tip dismiss (7.39) ──
      document.addEventListener('click', function(e) {
          const btn = e.target.closest('.doc-tip-dismiss');
          if (btn) {
              const tip = btn.closest('.doc-tip');
              if (tip) { tip.style.display = 'none'; }
          }
      });

      // ── Quick Command search (7.11) ──
      const missionSearch = document.getElementById('mission-command-search');
      if (missionSearch) {
          missionSearch.addEventListener('input', function() {
              const q = this.value.toLowerCase();
              const nav = document.getElementById('mission-action-list');
              if (!nav) return;
              nav.querySelectorAll('.action-btn').forEach(function(btn) {
                  btn.style.display = (!q || (btn.textContent || '').toLowerCase().includes(q)) ? '' : 'none';
              });
              // Show/hide group labels based on visible children
              nav.querySelectorAll('.action-group-content').forEach(function(group) {
                  const visible = group.querySelectorAll('.action-btn:not([style*="display: none"])');
                  const gName = group.getAttribute('data-group');
                  group.style.display = visible.length === 0 ? 'none' : '';
                  const label = nav.querySelector('.action-group-label[data-group="' + gName + '"]');
                  if (label) label.style.display = visible.length === 0 ? 'none' : '';
              });
          });
      }

      // ── Collapsible action groups (7.17/7.44) ──
      document.querySelectorAll('.action-group-label[data-group]').forEach(function(label) {
          label.addEventListener('click', function() {
              const gName = this.getAttribute('data-group');
              const content = document.querySelector('.action-group-content[data-group="' + gName + '"]');
              if (!content) return;
              const isCollapsed = this.classList.toggle('collapsed');
              content.classList.toggle('collapsed', isCollapsed);
              this.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
          });
      });

      // ── Personality Toggle (7.16) ──
      document.querySelectorAll('.personality-toggle-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
              const mode = this.getAttribute('data-mode');
              document.querySelectorAll('.personality-toggle-btn').forEach(function(b) {
                  b.classList.remove('active');
                  b.setAttribute('aria-checked', 'false');
              });
              this.classList.add('active');
              this.setAttribute('aria-checked', 'true');
              vscode.postMessage({ command: 'setPersonalityMode', mode: mode });
          });
      });
  </script>
</body>
</html>`;
}



export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * AlexLearn workshop persona data for the Docs tab persona grid.
 * Each entry maps to learnalex.correax.com/workshop/{id}
 */
const WORKSHOP_PERSONAS: Array<{ id: string; tag: string; name: string }> = [
  { id: 'job-seekers', tag: 'Career', name: 'Job Seekers' },
  { id: 'ai-researchers', tag: 'AI Research', name: 'AI Researchers' },
  { id: 'consultants', tag: 'Consulting', name: 'Consultants' },
  { id: 'content-creators', tag: 'Content', name: 'Content Creators' },
  { id: 'creative-writers', tag: 'Creative', name: 'Creative Writers' },
  { id: 'cx-leaders', tag: 'CX', name: 'CX Leaders' },
  { id: 'data-analysts', tag: 'Data', name: 'Data Analysts' },
  { id: 'designers', tag: 'Design', name: 'Designers' },
  { id: 'engineers', tag: 'Engineering', name: 'Engineers' },
  { id: 'entrepreneurs', tag: 'Startup', name: 'Entrepreneurs' },
  { id: 'executives', tag: 'Leadership', name: 'Executives' },
  { id: 'finance-professionals', tag: 'Finance', name: 'Finance Pros' },
  { id: 'healthcare-professionals', tag: 'Healthcare', name: 'Healthcare Pros' },
  { id: 'hr-people-ops', tag: 'HR', name: 'HR & People Ops' },
  { id: 'journalists', tag: 'Journalism', name: 'Journalists' },
  { id: 'knowledge-workers', tag: 'Business', name: 'Knowledge Workers' },
  { id: 'lawyers', tag: 'Legal', name: 'Lawyers' },
  { id: 'marketing-professionals', tag: 'Marketing', name: 'Marketing Pros' },
  { id: 'nonprofit-leaders', tag: 'Nonprofit', name: 'Nonprofit Leaders' },
  { id: 'podcasters', tag: 'Podcasting', name: 'Podcasters' },
  { id: 'product-managers', tag: 'Product', name: 'Product Managers' },
  { id: 'project-managers', tag: 'PM', name: 'Project Managers' },
  { id: 'psychology-counselors', tag: 'Counseling', name: 'Counselors' },
  { id: 'real-estate', tag: 'Real Estate', name: 'Real Estate Pros' },
  { id: 'researchers-professors', tag: 'Academic', name: 'Researchers' },
  { id: 'sales-professionals', tag: 'Sales', name: 'Sales Pros' },
  { id: 'scientists', tag: 'Science', name: 'Scientists' },
  { id: 'software-developers', tag: 'Software', name: 'Developers' },
  { id: 'standup-comics', tag: 'Comedy', name: 'Standup Comics' },
  { id: 'students', tag: 'Learning', name: 'Students' },
  { id: 'teachers-educators', tag: 'Teaching', name: 'Teachers' },
  { id: 'technical-writers', tag: 'Docs', name: 'Technical Writers' },
  { id: 'visual-storytellers', tag: 'Data Viz', name: 'Visual Storytellers' },
];

/**
 * Generate the persona grid HTML for the Docs tab.
 */
export function getPersonaGridHtml(): string {
  return WORKSHOP_PERSONAS.map(p =>
    `<div class="persona-card" data-cmd="learnAlexWorkshop" data-workshop="${escapeHtml(p.id)}" tabindex="0" role="button" title="${escapeHtml(p.name)} study guide">
        <span class="persona-tag">${escapeHtml(p.tag)}</span>
        <span class="persona-name">${escapeHtml(p.name)}</span>
    </div>`
  ).join('\n                  ');
}

/**
 * Generate action button HTML with accessibility attributes
 */
export function actionButton(cmd: string, icon: string, label: string, title?: string): string {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const ariaLabel = title ? escapeHtml(title) : label;

  // Show tier badge if the command is gated above current level
  let tierBadge = '';
  const commandId = `alex.${cmd}`;
  const req = getFeatureRequirement(commandId);
  if (req) {
    const cached = getCachedCognitiveLevel();
    const currentLevel = cached?.level ?? 1;
    if (currentLevel < req.minimumLevel) {
      const tierEmoji: Record<CognitiveLevel, string> = { 1: '📁', 2: '💬', 3: '🤖', 4: '🧠' };
      tierBadge = ` <span class="tier-lock" title="Requires Level ${req.minimumLevel}">${tierEmoji[req.minimumLevel] || '🔒'} L${req.minimumLevel}</span>`;
    }
  }

  return `<button class="action-btn" data-cmd="${cmd}"${titleAttr} tabindex="0" role="button" aria-label="${ariaLabel}">
                  <span class="action-icon" aria-hidden="true">${icon}</span>
                  <span class="action-text">${label}${tierBadge}</span>
              </button>`;
}

export function getGoalsHtml(goals: {
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
          <div style="text-align: center; padding: 12px; opacity: 0.7;" role="region" aria-label="Create learning goals">
              <p style="margin: 0 0 8px 0;">Set goals to track your progress</p>
              <button class="action-btn primary" data-cmd="createGoal" style="display: inline-flex; width: auto;" tabindex="0" role="button" aria-label="Create your first learning goal">
                  <span class="action-icon" aria-hidden="true">➕</span>
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
          <div class="goal-item" role="article" aria-label="Goal: ${escapeHtml(goal.title)}">
              <div class="goal-header">
                  <span class="goal-title">${escapeHtml(goal.title)}</span>
                  <span class="goal-progress-text" aria-label="Progress: ${goal.currentCount} of ${goal.targetCount}">${goal.currentCount}/${goal.targetCount}</span>
              </div>
              <div class="goal-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${progress}% complete">
                  <div class="goal-bar-fill" style="width: ${progressWidth}%;"></div>
              </div>
          </div>`;
    })
    .join("");

  return `
      <div class="section">
          <div class="section-title">Learning Goals ${goals.streakDays > 0 ? `<span style="float: right;">🔥 ${goals.streakDays} day streak</span>` : ""}</div>
          <div class="goals-stats" role="status" aria-label="${goals.completedToday} completed today, ${goals.totalCompleted} total">
              <span>✅ ${goals.completedToday} today</span>
              <span>🏆 ${goals.totalCompleted} total</span>
          </div>
          <div role="list" aria-label="Active learning goals">
              ${goalsListHtml || '<div style="text-align: center; padding: 8px; opacity: 0.6;" role="status">No active goals</div>'}
          </div>
      </div>`;
}

/**
 * Generate the Nudges section HTML (contextual reminders)
 * Only shows when there are actionable nudges
 */
export function getNudgesHtml(nudges: Nudge[]): string {
  if (nudges.length === 0) {
    return "";
  }

  const nudgesHtml = nudges
    .map((nudge) => {
      const typeClass = `nudge-${nudge.type}`;
      const actionHtml = nudge.action
        ? `<button class="nudge-action" data-cmd="${nudge.action}" tabindex="0" role="button" aria-label="${escapeHtml(nudge.actionLabel || 'Take action')}">${escapeHtml(nudge.actionLabel || 'Take action')}</button>`
        : "";

      return `
      <div class="nudge-card ${typeClass}" role="article" aria-label="Nudge: ${escapeHtml(nudge.message)}">
          <span class="nudge-icon" aria-hidden="true">${nudge.icon}</span>
          <div class="nudge-content">
              <span class="nudge-message">${escapeHtml(nudge.message)}</span>
          </div>
          ${actionHtml}
          <button class="nudge-dismiss" title="Dismiss" aria-label="Dismiss nudge">×</button>
      </div>`;
    })
    .join("");

  return `
      <div class="nudges-section">
          ${nudgesHtml}
      </div>`;
}

/**
 * Generate the Features/Documentation section HTML
 */
export function getFeaturesHtml(): string {
  return `
      <div class="section features-section">
          <details>
              <summary class="section-title clickable">📖 Features & Documentation</summary>
              <div class="features-content">
                  <div class="feature-category" role="article" aria-labelledby="cognitive-core-title">
                      <div class="feature-category-title" id="cognitive-core-title">🧠 Cognitive Core</div>
                      <ul class="feature-list" role="list">
                          <li><strong>Dream Protocol</strong> - Automated neural maintenance, synapse validation, and architecture health checks</li>
                          <li><strong>Self-Actualization</strong> - Deep meditation with comprehensive architecture assessment and knowledge promotion</li>
                          <li><strong>Meditation</strong> - Conscious knowledge consolidation via chat (@alex /meditate)</li>
                          <li><strong>Brain QA</strong> - 31-phase health validation covering structure, indexes, content, and format</li>
                          <li><strong>Muscle Scripts</strong> - Execution scripts for audit, build, sync, and validation tasks</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="knowledge-mgmt-title">
                      <div class="feature-category-title" id="knowledge-mgmt-title">📚 Knowledge Management</div>
                      <ul class="feature-list" role="list">
                          <li><strong>Global Knowledge</strong> - Cross-project patterns and insights with GitHub remote access</li>
                          <li><strong>Team Sharing</strong> - Git-based knowledge repository accessible across machines</li>
                          <li><strong>Skill Library</strong> - Portable skills with triggers and synaptic connections</li>
                          <li><strong>Domain Learning</strong> - Bootstrap new domains through conversational acquisition</li>
                          <li><strong>Trifecta Model</strong> - Core capabilities encoded across all 3 memory systems (Skill+Instruction+Prompt)</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="balance-title">
                      <div class="feature-category-title" id="balance-title">⚖️ Work-Life Balance</div>
                      <ul class="feature-list" role="list">
                          <li><strong>Focus Sessions</strong> - Pomodoro-style work sessions with breaks and automatic tracking</li>
                          <li><strong>Learning Goals</strong> - Track progress with targets, streaks, and achievements</li>
                          <li><strong>Health Dashboard</strong> - Visual architecture status and cognitive metrics</li>
                          <li><strong>Streak Protection</strong> - Stay motivated with daily progress indicators</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="chat-title">
                      <div class="feature-category-title" id="chat-title">💬 Chat Integration</div>
                      <ul class="feature-list" role="list">
                          <li><strong>@alex Chat Participant</strong> - Personality-driven conversations with memory</li>
                          <li><strong>12 Language Model Tools</strong> - Status, memory search, knowledge management</li>
                          <li><strong>Custom Agents</strong> - Specialized handoffs for meditation, dreams, Azure</li>
                          <li><strong>Slash Commands</strong> - /meditate, /status, /knowledge, /saveinsight, and more</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="content-creation-title">
                      <div class="feature-category-title" id="content-creation-title">🎨 Content Creation</div>
                      <ul class="feature-list" role="list">
                          <li><strong>AI Image Generation</strong> - Generate images from text prompts via Replicate (Flux, SDXL)</li>
                          <li><strong>AI Image Editing</strong> - Edit existing images with nano-banana-pro for consistent results</li>
                          <li><strong>Marp Presentations</strong> - Generate PPTX locally with Marp CLI (free, offline)</li>
                          <li><strong>Gamma Presentations</strong> - Cloud-based AI presentations with rich styling and image models</li>
                          <li><strong>Mermaid Diagrams</strong> - Generate flowcharts, sequence diagrams from code or text</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="cross-platform-title">
                      <div class="feature-category-title" id="cross-platform-title">🌐 Cross-Platform</div>
                      <ul class="feature-list" role="list">
                          <li><strong>M365 Export</strong> - Package knowledge for Microsoft 365 Copilot integration</li>
                          <li><strong>Architecture Upgrade</strong> - Seamless migration between versions with backup</li>
                          <li><strong>User Profile</strong> - Personalized communication style and preferences</li>
                          <li><strong>Text-to-Speech</strong> - Voice synthesis for reading documents and content aloud</li>
                          <li><strong>Research-First Dev</strong> - Pre-project knowledge encoding with 4-dimension gap analysis</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="env-setup-title">
                      <div class="feature-category-title" id="env-setup-title">⚙️ Environment Setup</div>
                      <ul class="feature-list" role="list">
                          <li><strong>Essential Settings</strong> (7) - instruction/prompt file locations, agent mode, skill loading</li>
                          <li><strong>Recommended Settings</strong> (24) - thinking tool, memory, subagents, MCP gallery, request queueing, UI</li>
                          <li><strong>Auto-Approval Settings</strong> (5) - auto-run tools, file operations, terminal automation</li>
                          <li><strong>Extended Thinking</strong> (2) - Opus 4.5/4.6 deep reasoning (16K token budget)</li>
                          <li><strong>Persona Detection</strong> - ⭐ Auto-detect project type, adapt Focus Trifectas (GK premium)</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="config-title">
                      <div class="feature-category-title" id="config-title">📁 Configuration Locations</div>
                      <ul class="feature-list" role="list">
                          <li><strong>.github/config/</strong> - All Alex configuration files</li>
                          <li><strong>user-profile.json</strong> - Communication preferences and project persona</li>
                          <li><strong>markdown-light.css</strong> - GitHub-style markdown preview theme</li>
                          <li><strong>cognitive-config.json</strong> - Dream/meditation state tracking</li>
                      </ul>
                  </div>
                  
                  <div class="feature-category" role="article" aria-labelledby="docs-title">
                      <div class="feature-category-title" id="docs-title">📖 Documentation Guides</div>
                      <ul class="feature-list" role="list">
                          <li><strong>Work-Life Balance</strong> - Focus sessions, goals, streaks, and sustainable productivity</li>
                          <li><strong>M365 Export</strong> - Bridge your knowledge to Microsoft 365 Copilot</li>
                          <li><strong>Global Knowledge</strong> - Cross-project patterns and insights</li>
                          <li><strong>User Manual</strong> - Complete feature reference and tutorials</li>
                      </ul>
                  </div>
                  
                  <nav class="feature-links" role="navigation" aria-label="Feature documentation links">
                      <button class="feature-link-btn" data-cmd="workingWithAlex" tabindex="0" role="button" aria-label="Learn about working with Alex">🎓 Working with Alex</button>
                      <button class="feature-link-btn" data-cmd="agentVsChat" tabindex="0" role="button" aria-label="Compare agents and @alex chat mode">🤖 Agent vs @alex</button>
                      <button class="feature-link-btn" data-cmd="openDocs" tabindex="0" role="button" aria-label="Open full documentation">📚 Full Documentation</button>
                      <button class="feature-link-btn" data-cmd="openBrainAnatomy" tabindex="0" role="button" aria-label="Explore brain anatomy">🧠 Brain Anatomy</button>
                      <button class="feature-link-btn" data-cmd="openMarketplace" tabindex="0" role="button" aria-label="View on VS Code Marketplace">🏪 Marketplace</button>
                      <button class="feature-link-btn" data-cmd="openGitHub" tabindex="0" role="button" aria-label="View on GitHub">🐙 GitHub</button>
                  </nav>
              </div>
          </details>
      </div>`;
}
