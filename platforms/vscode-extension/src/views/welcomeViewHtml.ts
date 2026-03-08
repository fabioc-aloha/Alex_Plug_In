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
import {
  resolveAvatar,
  AvatarContext,
    getAvatarAssetRelativePath,
} from '../chat/avatarMappings';
import { ActiveContext } from '../shared/activeContextManager';
import { LearningGoal } from '../commands/goals';
import { escapeHtml, getNonce } from '../shared/sanitize';
import { getCachedCognitiveLevel, getFeatureRequirement, CognitiveLevel } from '../shared/cognitiveTier';
import { SkillRecommendation } from '../chat/skillRecommendations';
import { getSkillDisplayName } from '../shared/skillConstants';
import { nasaAssert, nasaAssertBounded } from '../shared/nasaAssert';

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

/** Data contract for the Skill Store tab */
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

  // Avatar URIs — v5.9.2 Enhanced with unified resolveAvatar() 
  // Priority: Easter egg > Agent > Cognitive State > Skill State > Skill Persona > Persona > Age > Default
  // Uses organized subdirectories: personas/, ages/, agents/, states/
  const workspaceFolderName = vscode.workspace.workspaceFolders?.[0]?.name;
  const easterEgg: EasterEgg | null =
    getEasterEggOverride(workspaceFolderName);
  
  // Build avatar context for unified resolution
  const avatarContext: AvatarContext = {
    agentMode: agentMode,
    cognitiveState: cognitiveState,
    activeSkill: trifectaIds.length > 0 ? trifectaIds[0] : null,
    personaId: persona?.id || null,
    birthday: userProfile?.birthday || null,
  };
  
  // Resolve avatar using unified priority chain
  let avatarPath: string;
  let avatarSource: string = 'default';
  // Spike 1A: SVG override tracking
  let avatarUseSvg = false;
  let avatarSvgPath: string | null = null;
  
  if (easterEgg) {
    avatarSource = 'easter-egg';
  }
  
  // Always use unified avatar resolution (easter eggs only affect the badge overlay)
  {
    const avatarResult = resolveAvatar(avatarContext);
        avatarPath = getAvatarAssetRelativePath(avatarResult, 'png').replace(/\.png$/, '');
    if (!easterEgg) { avatarSource = avatarResult.source; }
    // Spike 1A: Check for SVG rocket-icon override
    const svgPath = getAvatarAssetRelativePath(avatarResult, 'svg');
    avatarUseSvg = svgPath.includes('rocket-icons');
    console.log(`[Alex][Avatar Debug] PersonaID: ${avatarContext.personaId}, Source: ${avatarResult.source}, Label: ${avatarResult.label}, SVG: ${svgPath}, UseSVG: ${avatarUseSvg}`);
    if (avatarUseSvg) {
      avatarSvgPath = svgPath.replace(/\.svg$/, '');
    }
  }
  
  // Spike 1A: Build SVG URI if available
  const avatarSvgUri = avatarUseSvg && avatarSvgPath
    ? getAssetUri(webview, extensionUri, `${avatarSvgPath}.svg`)
    : null;
  const avatarWebpUri = getAssetUri(
    webview,
    extensionUri,
        `${avatarPath}.webp`,
  );
  const avatarPngUri = getAssetUri(
    webview,
    extensionUri,
        `${avatarPath}.png`,
  );
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
    rawObjective && !rawObjective.includes("*(session-objective") && !session;

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
          font-size: 9px;
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
          gap: 7px;
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
      .persona-avatar-box {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 7px;
          position: relative;
          width: 100%;
      }
      .alex-avatar {
          width: 100%;
          height: auto;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid color-mix(in srgb, var(--persona-accent) 40%, transparent);
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .alex-avatar:hover {
          transform: scale(1.01);
          border-color: var(--persona-accent);
      }
      .easter-egg-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 38px;
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
          padding: 3px 8px;
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
          margin: 4px 0 6px;
          padding: 3px 9px;
          opacity: 0.85;
      }
      .partnership-bar {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-xs) var(--spacing-sm);
          margin-bottom: 8px;
          border-radius: 4px;
          font-size: var(--font-xs);
          letter-spacing: 0.2px;
          color: var(--vscode-descriptionForeground);
          background: color-mix(in srgb, var(--persona-accent) 6%, transparent);
          border: 1px solid color-mix(in srgb, var(--persona-accent) 15%, transparent);
          cursor: pointer;
          transition: all 0.15s ease;
      }
      .partnership-bar:hover {
          background: color-mix(in srgb, var(--persona-accent) 12%, transparent);
          color: var(--vscode-foreground);
      }
      .partnership-bar .partner-icon {
          font-size: var(--font-sm);
          flex-shrink: 0;
      }
      .partnership-bar strong {
          color: var(--persona-accent);
          font-weight: 600;
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
          margin-bottom: 5px;
          opacity: 0.65;
      }
      
      .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
      }
      .status-item {
          background: var(--vscode-editor-background);
          border-radius: 5px;
          padding: 6px 8px;
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
          gap: 5px;
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
          margin-bottom: 5px;
          padding: 4px 8px;
          background: color-mix(in srgb, var(--persona-accent) 8%, transparent);
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.12s ease;
          display: flex;
          align-items: center;
          gap: 6px;
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
          gap: 3px;
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
          gap: 5px;
          margin-top: 5px;
      }
      .context-badge {
          font-size: var(--font-xs);
          padding: 1px 6px;
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
          gap: 5px;
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
          margin-top: 3px;
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
          gap: 2px;
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
      }
      .action-group-label:first-child {
          margin-top: 0;
      }
      .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          min-height: 32px; /* WCAG touch target */
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
          font-size: 9px;
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
          margin: 7px 0;
          padding: 7px;
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
          gap: 3px;
      }
      .skill-recommendation-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 5px 8px;
          min-height: 32px;
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
          gap: 6px;
          padding: 5px 8px;
          background: var(--vscode-editor-background);
          border-radius: 4px;
          margin-bottom: 3px;
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
          padding: 3px 6px;
          border-radius: 3px;
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
          margin-bottom: 3px;
      }
      .feature-list strong {
          color: var(--vscode-foreground);
          font-weight: 500;
      }
      .feature-links {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          margin-top: 7px;
          padding-top: 7px;
          border-top: 1px solid var(--vscode-widget-border);
      }
      .feature-link-btn {
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          border-radius: 4px;
          padding: 4px 6px;
          min-height: 28px;
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
          outline: 1px solid var(--vscode-focusBorder);
          outline-offset: -1px;
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
          font-size: 10px;
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
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 8px;
          font-weight: 600;
      }
      .badge-ok { background: #2ea04333; color: #3fb950; }
      .badge-missing { background: #f8514933; color: #f85149; }
      .agent-role {
          font-size: 10px;
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
      .skill-synapse-dot { font-size: 10px; opacity: 0.7; }
      .skill-category {
          font-size: 10px;
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
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
      }
      .stat-good { color: #3fb950; }
      .stat-warn { color: #d29922; }
      .stat-bad { color: #f85149; }

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
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 2px;
      }
      .maintenance-value {
          font-size: 11px;
          font-weight: 500;
      }
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

      <div class="persona-avatar-box" data-cmd="skillReview" title="Alex as ${personaName} — Click to explore skills" tabindex="0" role="button">
          <img src="${avatarSvgUri || avatarPngUri}" alt="Alex ${personaName}" class="alex-avatar" data-fallback="${avatarPngUri}" />
          ${easterEggBadge}
      </div>

      ${workspaceName ? `<div class="project-name" title="Current workspace">${escapeHtml(workspaceName)}</div>` : ""}

      <!-- Spike 1B: Tab Bar -->
      <div class="tab-bar" role="tablist" aria-label="Command Center">
          <button role="tab" class="tab active" data-tab="mission" aria-selected="true" aria-controls="panel-mission" tabindex="0">Mission Ctrl</button>
          <button role="tab" class="tab" data-tab="agents" aria-selected="false" aria-controls="panel-agents" tabindex="-1">Agents</button>
          <button role="tab" class="tab" data-tab="skills" aria-selected="false" aria-controls="panel-skills" tabindex="-1">Skill Store</button>
          <button role="tab" class="tab" data-tab="mind" aria-selected="false" aria-controls="panel-mind" tabindex="-1">Mind</button>
          <button role="tab" class="tab" data-tab="docs" aria-selected="false" aria-controls="panel-docs" tabindex="-1">Docs</button>
      </div>

      <!-- Tab Panel: Mission Command -->
      <div class="tab-panel active" id="panel-mission" role="tabpanel" aria-labelledby="tab-mission">

      <div class="partnership-bar" data-cmd="openChat" title="Your trusted AI partner — Click to start chatting" tabindex="0" role="button">
          <span class="partner-icon">🤝</span>
          <span>Your Trusted Partner for <strong>${bannerNoun}</strong></span>
      </div>

      ${sessionHtml}
      
      ${getNudgesHtml(nudges)}
      
      <div class="section">
          <div class="section-title clickable" data-cmd="healthDashboard" title="Click to open Health Dashboard" tabindex="0" role="button">Status</div>
          <div class="status-grid" data-cmd="healthDashboard" style="cursor: pointer;" title="Click to open Health Dashboard" tabindex="0" role="region" aria-label="Architecture health status">
              <div class="status-item ${isHealthy ? "status-good" : "status-warn"}">
                  <div class="status-label">Health</div>
                  <div class="status-value"><span class="status-dot ${isHealthy ? "dot-green" : health.brokenSynapses > 5 ? "dot-red" : "dot-yellow"}" aria-label="${isHealthy ? "Healthy" : health.brokenSynapses > 5 ? "Critical" : "Warning"}"></span>${healthText}</div>
              </div>
              <div class="status-item ${streakDays > 0 ? "status-good" : ""}">
                  <div class="status-label">Streak</div>
                  <div class="status-value"><span class="status-dot ${streakDays > 0 ? "dot-green" : "dot-yellow"}" aria-label="${streakDays > 0 ? "Active streak" : "No streak"}"></span>${streakDays > 0 ? streakDays + " days" : "Start today!"}</div>
              </div>
          </div>
      </div>
      
      <div class="section">
          <div class="section-title">Active Context</div>
          <div class="context-card">
              <div class="trifecta-tags">
                  ${trifectaTagsHtml}
              </div>
              <div class="context-meta">
                  ${confidenceLabel ? `<span class="context-badge accent">${personaIcon} ${confidenceLabel} ${sourceLabel}</span>` : ""}
                  <span class="context-badge ${isNeverAssessed ? "stale" : ""}" data-cmd="selfActualize" title="${isNeverAssessed ? "Run self-actualization" : "Last self-actualization"}" tabindex="0" role="button">${isNeverAssessed ? "⚡ Assess" : "✓ " + assessedLabel}</span>
                  <span class="context-badge">${principlesText}</span>
              </div>
          </div>
      </div>
      
      <nav class="action-list" aria-label="Actions" role="navigation">
              
              <div class="action-group-label">PARTNERSHIP</div>
              <button class="action-btn primary" data-cmd="openChat" tabindex="0" role="button" aria-label="Start a conversation with Alex">
                  <span class="action-icon" aria-hidden="true">💬</span>
                  <span class="action-text">Chat with Alex</span>
              </button>
              ${actionButton('northStar', '⭐', 'North Star', 'Define or review project vision and quality standards')}
              ${actionButton('rubberDuck', '🦆', 'Think Together', 'Work through problems as partners')}
              
              <div class="action-group-label">BUILD TOGETHER</div>
              ${actionButton('codeReview', '👀', 'Code Review', 'Review for correctness and growth')}
              ${actionButton('debugThis', '🐛', 'Debug This', 'Find the issue together')}
              ${actionButton('generateTests', '🧪', 'Generate Tests', 'Build confidence in your code')}
              ${actionButton('runAudit', '🔍', 'Project Audit', 'Comprehensive quality check')}
              ${actionButton('releasePreflight', '🚀', 'Release Preflight')}
              ${actionButton('importGitHubIssues', '📋', 'Import Issues', 'Import GitHub issues as goals')}
              ${actionButton('reviewPR', '👁️', 'Review PR', 'AI-powered pull request review')}
              
              <div class="action-group-label">LEARN & KNOWLEDGE</div>
              ${actionButton('askAboutSelection', '💬', 'Ask About Selection', 'Ask about code or concepts')}
              ${actionButton('saveSelectionAsInsight', '💡', 'Save Insight', 'Remember this for future projects')}
              ${hasGlobalKnowledge
                  ? actionButton('knowledgeQuickPick', '🔎', 'Search Knowledge', 'Find patterns from past work')
                  : actionButton('searchRelatedKnowledge', '🔍', 'Search Knowledge', 'Find patterns from past work')
              }
              ${actionButton('generateDiagram', '📊', 'Generate Diagram', 'Visualize architecture and flow')}
              ${actionButton('readAloud', '🔊', 'Read Aloud', 'Listen to documentation')}
              
              <div class="action-group-label">PRESENT & SHARE</div>
              ${actionButton('generatePptx', '📄', 'Marp PPTX (Local)', 'Generate PowerPoint locally with Marp - free, offline')}
              ${actionButton('generateGammaPresentation', '🎨', 'Gamma (Cloud)', 'Generate beautiful AI presentations via Gamma API')}
              ${actionButton('generateGammaAdvanced', '⚙️', 'Gamma Advanced', 'Gamma with style, model, and image options')}
              
              <div class="action-group-label">VISUALIZE</div>
              ${actionButton('generateAIImage', '🖼️', 'Generate Image', 'Generate AI images from text prompts via Replicate')}
              ${actionButton('editImageAI', '✏️', 'Edit Image (AI)', 'Edit images with AI using nano-banana-pro model')}
              
              <div class="action-group-label">TRUST & GROWTH</div>
              ${actionButton('dream', '💭', 'Dream', 'Neural maintenance — keeps me reliable')}
              ${actionButton('selfActualize', '✨', 'Self-Actualize', 'Deep self-assessment — honest about my capabilities')}
              ${actionButton('openBrainAnatomy', '🧠', 'How I Think', 'Explore my cognitive architecture')}
              ${actionButton('startSession', '🍅', 'Focus Session', 'Pomodoro-style work sessions')}
              ${actionButton('showGoals', '🎯', 'Goals', 'Track learning progress')}
              
              <div class="action-group-label">SYSTEM</div>
              <button class="action-btn" data-cmd="upgrade" tabindex="0" role="button" aria-label="Initialize or Update Alex architecture">
                  <span class="action-icon" aria-hidden="true">${hasGlobalKnowledge ? "🌐" : "⬆️"}</span>
                  <span class="action-text">Initialize / Update</span>
              </button>
              ${actionButton('memoryDashboard', '🧠', 'Memory Architecture', 'View memory systems')}
              ${actionButton('exportM365', '📦', 'Export for M365', 'Package knowledge for M365 Copilot')}
              ${actionButton('setupEnvironment', '⚙️', 'Environment Setup', 'Configure VS Code settings')}
              ${actionButton('manageSecrets', '🔑', 'API Keys & Secrets', 'Manage tokens for Gamma, Replicate, OpenAI')}
              ${actionButton('detectEnvSecrets', '🔍', 'Detect .env Secrets', 'Scan .env files and migrate to secure storage')}
              ${actionButton('provideFeedback', '💬', 'Feedback', 'Share feedback, ideas, or feature requests')}
              ${actionButton('viewDiagnostics', '🩺', 'Diagnostics', 'View diagnostics and report issues')}
          </nav>
      
      ${getGoalsHtml(goals)}

      </div><!-- /panel-mission -->

      <!-- Tab Panel: Agents -->
      <div class="tab-panel" id="panel-agents" role="tabpanel" aria-labelledby="tab-agents">
          <div class="tab-section-title">Agent Registry</div>
          <div class="agent-list">
              ${(agents ?? []).map(a => `
              <div class="agent-card${!a.installed ? ' agent-missing' : ''}" title="${escapeHtml(a.description)}">
                  <div class="agent-card-header">
                      <span class="agent-icon">${escapeHtml(a.icon)}</span>
                      <span class="agent-name">${escapeHtml(a.name)}</span>
                      <span class="agent-badge ${a.installed ? 'badge-ok' : 'badge-missing'}">${a.installed ? '✓' : '✗'}</span>
                  </div>
                  <div class="agent-role">${escapeHtml(a.role)}</div>
                  <div class="agent-desc">${escapeHtml(a.description)}</div>
              </div>`).join('')}
          </div>
          <div class="tab-footer-hint">Agents are specialist modes — invoke with <code>@alex</code> or via the agent picker.</div>
      </div>

      <!-- Tab Panel: Skill Store -->
      <div class="tab-panel" id="panel-skills" role="tabpanel" aria-labelledby="tab-skills">
          <div class="tab-section-title">Skills (${(skills ?? []).length})</div>
          ${(skills ?? []).length === 0 ? `
          <div class="empty-state">
              <div class="empty-state-icon">📦</div>
              <div class="empty-state-title">No Skills Found</div>
              <div class="empty-state-desc">Initialize Alex architecture to install skills.</div>
          </div>` : ''}
          <div class="skill-grid">
              ${(skills ?? []).map(s => `
              <div class="skill-card" data-cmd="openSkill" data-skill="${escapeHtml(s.id)}" data-skill-name="${escapeHtml(s.displayName)}" title="${escapeHtml(s.description)}" tabindex="0" role="button">
                  <div class="skill-header">
                      <span class="skill-name">${escapeHtml(s.displayName)}</span>
                      ${s.hasSynapses ? '<span class="skill-synapse-dot" title="Has synapses">⚡</span>' : ''}
                  </div>
                  <div class="skill-category">${escapeHtml(s.category)}</div>
                  <div class="skill-desc">${escapeHtml(s.description)}</div>
              </div>`).join('')}
          </div>
      </div>

      <!-- Tab Panel: Mind -->
      <div class="tab-panel" id="panel-mind" role="tabpanel" aria-labelledby="tab-mind">
          ${mindData ? `
          <div class="tab-section-title">Cognitive Dashboard</div>

          <div class="mind-stats-row">
              <div class="mind-stat-card">
                  <div class="mind-stat-value">${mindData.cognitiveAge}</div>
                  <div class="mind-stat-label">Cognitive Age</div>
              </div>
              <div class="mind-stat-card">
                  <div class="mind-stat-value ${mindData.synapseHealthPct >= 90 ? 'stat-good' : mindData.synapseHealthPct >= 70 ? 'stat-warn' : 'stat-bad'}">${mindData.synapseHealthPct}%</div>
                  <div class="mind-stat-label">Synapse Health</div>
              </div>
          </div>

          <div class="dashboard-card">
              <div class="dashboard-card-title">Memory Modalities</div>
              <div class="memory-modality">
                  <span class="modality-label">Skills</span>
                  <div class="modality-bar"><div class="modality-fill" style="width: ${Math.min(mindData.skillCount, 150) / 150 * 100}%"></div></div>
                  <span class="modality-count">${mindData.skillCount}</span>
              </div>
              <div class="memory-modality">
                  <span class="modality-label">Instructions</span>
                  <div class="modality-bar"><div class="modality-fill" style="width: ${Math.min(mindData.instructionCount, 80) / 80 * 100}%"></div></div>
                  <span class="modality-count">${mindData.instructionCount}</span>
              </div>
              <div class="memory-modality">
                  <span class="modality-label">Prompts</span>
                  <div class="modality-bar"><div class="modality-fill" style="width: ${Math.min(mindData.promptCount, 40) / 40 * 100}%"></div></div>
                  <span class="modality-count">${mindData.promptCount}</span>
              </div>
              <div class="memory-modality">
                  <span class="modality-label">Agents</span>
                  <div class="modality-bar"><div class="modality-fill" style="width: ${Math.min(mindData.agentCount, 15) / 15 * 100}%"></div></div>
                  <span class="modality-count">${mindData.agentCount}</span>
              </div>
              <div class="memory-modality">
                  <span class="modality-label">Episodic</span>
                  <div class="modality-bar"><div class="modality-fill" style="width: ${Math.min(mindData.episodicCount, 50) / 50 * 100}%"></div></div>
                  <span class="modality-count">${mindData.episodicCount}</span>
              </div>
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
              <div class="dashboard-card-title">Quick Actions</div>
              ${actionButton('healthDashboard', '📊', 'Health Dashboard', 'Full synapse and architecture health report')}
              ${actionButton('memoryDashboard', '🧠', 'Memory Architecture', 'Explore all memory systems')}
              ${actionButton('dream', '💭', 'Dream', 'Neural maintenance')}
              ${actionButton('selfActualize', '✨', 'Self-Actualize', 'Deep self-assessment')}
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

          <div class="docs-section">
              <div class="docs-section-title">Getting Started</div>
              ${actionButton('setupEnvironment', '⚙️', 'Setup Guide', 'Configure VS Code for Alex')}
              ${actionButton('workingWithAlex', '🎓', 'How We Work', 'Learn how to collaborate effectively')}
              ${actionButton('cognitiveLevels', '🧬', 'Cognitive Levels', 'What unlocks at each tier')}
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
              <div class="docs-section-title">Architecture & Ops</div>
              ${actionButton('openBrainAnatomy', '🧠', 'Brain Anatomy', 'Interactive 3D brain visualization')}
              ${actionButton('openDocs', '📁', 'Architecture Docs', 'Open local architecture documentation')}
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Partnership</div>
              ${actionButton('workingWithAlex', '🤝', 'Working with Alex', 'Deep-dive into our partnership model')}
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
      document.addEventListener('click', function(e) {
          const el = e.target.closest('[data-cmd]');
          if (el) {
              e.preventDefault();
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
      });
      
      // Avatar SVG error fallback — if SVG fails to load, fall back to PNG
      const avatarImg = document.querySelector('.alex-avatar');
      if (avatarImg) {
          avatarImg.addEventListener('error', function() {
              const fallback = this.getAttribute('data-fallback');
              console.log('[Alex][Avatar] SVG failed to load. src:', this.src, 'Falling back to:', fallback);
              if (fallback && this.src !== fallback) {
                  this.src = fallback;
              }
          });
          console.log('[Alex][Avatar] Current src:', avatarImg.src);
      }

      // Auto-refresh interval (30 seconds)
      const AUTO_REFRESH_MS = 30000;
      setInterval(refresh, AUTO_REFRESH_MS);
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
    `<div class="persona-card" data-cmd="learnAlexWorkshop" data-workshop="${escapeHtml(p.id)}" tabindex="0" role="link" title="${escapeHtml(p.name)} study guide">
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
