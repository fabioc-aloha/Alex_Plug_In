/**
 * welcomeViewHtml.ts - HTML generation orchestrator for the Welcome sidebar view
 *
 * Shell: interfaces, shared CSS, header, tab bar, client JS.
 * Tab content extracted to: missionTabHtml, settingsTabHtml (formerly mindTabHtml), docsTabHtml
 */
import * as vscode from "vscode";
import { HealthCheckResult } from "../shared/healthCheck";
import {
  PersonaDetectionResult,
  getEasterEggOverride,
  EasterEgg,
} from "../chat/personaDetection";

import { ActiveContext } from "../shared/activeContextManager";
import { escapeHtml, getNonce } from "../shared/sanitize";
import {
  getCachedCognitiveLevel,
  getFeatureRequirement,
  CognitiveLevel,
} from "../shared/cognitiveTier";
import { nasaAssert, nasaAssertBounded } from "../shared/nasaAssert";
import { getMissionTabHtml } from "./missionTabHtml";
import { getSettingsTabHtml } from "./settingsTabHtml";
import { getDocsTabHtml } from "./docsTabHtml";
import { getSharedStyles } from "./sharedStyles";

/** Data contract for the Mind tab */
export interface MindTabData {
  skillCount: number;
  instructionCount: number;
  promptCount: number;
  agentCount: number;
  episodicCount: number;
  chatMemoryLines: number;
  synapseHealthPct: number;
  lastDreamDate: string | null;
  lastMeditationDate: string | null;
  /** 7.38: Meditation session count for streak tracking */
  meditationCount: number;
}

/** 7.13: Token status for Secret Manager inline dashboard */
export interface TokenStatusInfo {
  name: string;
  displayName: string;
  isSet: boolean;
}

/** 7.14: Settings snapshot for inline toggles */
export interface SettingsToggle {
  key: string;
  label: string;
  enabled: boolean;
  group?: string;
  tooltip?: string;
}

/** Data contract for the Skills tab */
export interface SkillInfo {
  id: string;
  displayName: string;
  description: string;
  category: string;
}

/**
 * Resolve a webview-safe URI for an asset in the extension's assets/ folder.
 */
export function getAssetUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  assetPath: string,
): vscode.Uri {
  return webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "assets", ...assetPath.split("/")),
  );
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
  version: string,
  nudges: Nudge[],
  _hasGlobalKnowledge: boolean,
  personaResult: PersonaDetectionResult | null,
  activeContext: ActiveContext | null,
  userProfile: { birthday?: string; name?: string } | null,
  extensionUri: vscode.Uri,
  workspaceName?: string,
  mindData?: MindTabData,
  _skills?: SkillInfo[],
  _personalityMode?: string,
  tokenStatuses?: TokenStatusInfo[],
  settingsToggles?: SettingsToggle[],
  showBootstrap?: boolean,
  isBootstrapResume?: boolean,
  activeTab?: string,
  isMaster?: boolean,
): string {
  // NASA R5: Entry point assertions
  nasaAssert(webview !== undefined, "_getHtmlContent: webview must be defined");
  nasaAssertBounded(health.brokenSynapses, 0, 10000, "health.brokenSynapses");
  nasaAssertBounded(nudges.length, 0, 10, "nudges.length");

  // Security: Generate nonce for CSP
  const nonce = getNonce();

  // Logo URI for webview
  const logoUri = getAssetUri(webview, extensionUri, "icon.png");

  // Persona display
  const persona = personaResult?.persona;

  // Easter egg and persona display
  // Priority: Easter egg > Agent > Cognitive State > Skill State > Skill Persona > Persona > Age > Default
  // Uses organized subdirectories: personas/, ages/, agents/, states/
  const workspaceFolderName = vscode.workspace.workspaceFolders?.[0]?.name;
  const easterEgg: EasterEgg | null = getEasterEggOverride(workspaceFolderName);

  const personaIcon = persona?.icon || "\ud83d\udcbb";
  const personaName = persona?.name || "Developer";
  // mark locals for TS unused checks
  void workspaceName;

  // Use persona accent color (easter eggs no longer override global accent — they get a badge-local color instead)
  const personaAccent = persona?.accentColor || "#6366f1";
  const rawEggColor = easterEgg?.accentColor || "";
  const safeEggColor = /^#[0-9a-fA-F]{3,8}$/.test(rawEggColor)
    ? rawEggColor
    : personaAccent;
  const easterEggBadgeColor = easterEgg?.accentColor
    ? safeEggColor
    : personaAccent;

  const easterEggBadge = easterEgg
    ? `<span class="easter-egg-badge" title="${easterEgg.label}" style="--egg-accent: ${easterEggBadgeColor}">${easterEgg.emoji}</span>`
    : "";

  // Objective from Active Context (hidden when session card is showing)
  const rawObjective = activeContext?.objective;
  const hasObjective =
    rawObjective && !rawObjective.includes("session-objective");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https: data:;">
  <title>Alex</title>
  <style>${getSharedStyles(personaAccent)}</style>
</head>
<body>
  <div class="container">
      <div class="header">
          <div class="header-accent-bar"></div>
          <div class="header-watermark">ALEX</div>
          <div class="header-series">COGNITIVE ARCHITECTURE</div>
          <div class="header-main">
              <div class="header-icon-wrapper">
                  <img src="${logoUri}" alt="Alex v${version}" class="header-icon" data-cmd="workingWithAlex" title="Alex v${version} — Click to learn how to work with Alex" tabindex="0" role="button" />
                  ${easterEggBadge}
              </div>
              <div class="header-text">
                  <span class="header-title">Alex Cognitive</span>
                  <span class="header-persona" data-cmd="skillReview" title="${personaName} — Click to explore skills" tabindex="0" role="button">${personaIcon} ${personaName}</span>
              </div>
              <button class="refresh-btn" data-cmd="refresh" title="Refresh" aria-label="Refresh welcome view">↻</button>
          </div>
      </div>

      <div class="hero-text-box">
          ${userProfile?.name ? `<div class="hero-greeting">Hi ${escapeHtml(userProfile.name)} 👋</div>` : ""}
          ${activeContext?.northStar ? `<div class="hero-north-star" data-cmd="northStar" title="North Star — Click to review" tabindex="0" role="button">⭐ ${escapeHtml(activeContext.northStar)}</div>` : ""}
          ${hasObjective ? `<div class="hero-objective">${escapeHtml(rawObjective!)}</div>` : ""}
      </div>

      <!-- Spike 1B: Tab Bar -->
      <div class="tab-bar" role="tablist" aria-label="Command Center">
          <button role="tab" id="tab-mission" class="tab${activeTab === "mission" || !activeTab ? " active" : ""}" data-tab="mission" aria-selected="${activeTab === "mission" || !activeTab ? "true" : "false"}" aria-controls="panel-mission" tabindex="${activeTab === "mission" || !activeTab ? "0" : "-1"}">Mission</button>
          <button role="tab" id="tab-settings" class="tab${activeTab === "settings" ? " active" : ""}" data-tab="settings" aria-selected="${activeTab === "settings" ? "true" : "false"}" aria-controls="panel-settings" tabindex="${activeTab === "settings" ? "0" : "-1"}">Settings</button>
          <button role="tab" id="tab-docs" class="tab${activeTab === "docs" ? " active" : ""}" data-tab="docs" aria-selected="${activeTab === "docs" ? "true" : "false"}" aria-controls="panel-docs" tabindex="${activeTab === "docs" ? "0" : "-1"}">Docs</button>
      </div>

      ${getMissionTabHtml({ nudges, activeContext, showBootstrap, isBootstrapResume, chatMemoryLines: mindData?.chatMemoryLines ?? 0, isActive: activeTab === "mission" || !activeTab, isMaster })}

      ${getSettingsTabHtml({ tokenStatuses, settingsToggles, isActive: activeTab === "settings" })}

      ${getDocsTabHtml(activeTab === "docs")}

  </div>
  
  <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      
      function cmd(command, data) {
          vscode.postMessage({ command, ...data });
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
      const validTabs = ['mission', 'settings', 'docs'];
      window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'switchToTab' && validTabs.includes(message.tabId)) {
              switchTab(message.tabId, false);
          }
      });

      // ── Nudge dismiss (7.12) ──
      document.addEventListener('click', function(e) {
          const btn = e.target.closest('.nudge-dismiss');
          if (btn) {
              const card = btn.closest('.nudge-card');
              if (card) { card.style.display = 'none'; }
          }
      });

      // ── Collapsible action groups (7.17/7.44) ──
      document.querySelectorAll('.action-group-label[data-group]').forEach(function(label) {
          label.addEventListener('click', function() {
              const gName = this.getAttribute('data-group');
              const content = document.querySelector('.action-group-content[data-group="' + gName + '"]');
              if (!content) return;
              const isCollapsed = this.classList.toggle('collapsed');
              content.classList.toggle('collapsed', isCollapsed);
              this.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
          });          label.addEventListener('keydown', function(e) {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.click();
              }
          });      });

      // ── Mission Profile Toggle (7.40) ──
      document.querySelectorAll('.mission-profile-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
              var profile = this.getAttribute('data-mission');
              var wasActive = this.classList.contains('active');
              document.querySelectorAll('.mission-profile-btn').forEach(function(b) {
                  b.classList.remove('active');
              });
              if (!wasActive) {
                  this.classList.add('active');
                  vscode.postMessage({ command: 'missionProfile', profile: profile });
              }
          });
      });


      // ── Settings Toggles (7.14) ──
      document.querySelectorAll('.toggle-switch[data-setting]').forEach(function(sw) {
          sw.addEventListener('click', function(e) {
              e.stopPropagation();
              const key = this.getAttribute('data-setting');
              const isOn = this.classList.toggle('on');
              this.setAttribute('aria-checked', String(isOn));
              vscode.postMessage({ command: 'toggleSetting', key: key, value: isOn });
          });
          sw.addEventListener('keydown', function(e) {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this.click();
              }
          });
      });

      // ── Auto-populate aria-label on doc-grid-cards from title text ──
      document.querySelectorAll('.doc-grid-card:not([aria-label])').forEach(function(card) {
          var title = card.querySelector('.doc-grid-title');
          if (title) card.setAttribute('aria-label', title.textContent);
      });
  </script>
</body>
</html>`;
}

/**
 * Generate action button HTML with accessibility attributes
 */
export function actionButton(
  cmd: string,
  icon: string,
  label: string,
  title?: string,
): string {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  const ariaLabel = title ? escapeHtml(title) : label;

  // Show tier badge if the command is gated above current level
  let tierBadge = "";
  const commandId = `alex.${cmd}`;
  const req = getFeatureRequirement(commandId);
  if (req) {
    const cached = getCachedCognitiveLevel();
    const currentLevel = cached?.level ?? 1;
    if (currentLevel < req.minimumLevel) {
      const tierEmoji: Record<CognitiveLevel, string> = {
        1: "📁",
        2: "💬",
        3: "🤖",
        4: "🧠",
      };
      tierBadge = ` <span class="tier-lock" title="Requires Level ${req.minimumLevel}">${tierEmoji[req.minimumLevel] || "🔒"} L${req.minimumLevel}</span>`;
    }
  }

  return `<button class="action-btn" data-cmd="${cmd}"${titleAttr} tabindex="0" role="button" aria-label="${ariaLabel}">
                  <span class="action-icon" aria-hidden="true">${icon}</span>
                  <span class="action-text">${label}${tierBadge}</span>
              </button>`;
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
        ? `<button class="nudge-action" data-cmd="${nudge.action}" tabindex="0" role="button" aria-label="${escapeHtml(nudge.actionLabel || "Take action")}">${escapeHtml(nudge.actionLabel || "Take action")}</button>`
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
