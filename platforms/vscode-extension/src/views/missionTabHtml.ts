/**
 * missionTabHtml.ts - Mission Command tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from '../shared/sanitize';
import { LearningGoal } from '../commands/goals';
import { Nudge, TokenStatusInfo, SettingsToggle, actionButton, getNudgesHtml, getGoalsHtml } from './welcomeViewHtml';

export interface MissionTabContext {
    sessionHtml: string;
    nudges: Nudge[];
    hasGlobalKnowledge: boolean;
    tokenStatuses?: TokenStatusInfo[];
    settingsToggles?: SettingsToggle[];
    goals: {
        activeGoals: LearningGoal[];
        completedToday: number;
        streakDays: number;
        totalCompleted: number;
    };
}

/** Generate the Mission Command tab panel HTML. */
export function getMissionTabHtml(ctx: MissionTabContext): string {
    const { sessionHtml, nudges, hasGlobalKnowledge, tokenStatuses, settingsToggles, goals } = ctx;

    return `
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

      ${(tokenStatuses ?? []).length > 0 ? `
      <div class="section">
          <div class="section-title">API Keys</div>
          <div class="secret-status-panel" data-cmd="manageSecrets" tabindex="0" role="button" title="Click to manage API keys">
              ${(tokenStatuses ?? []).map(t => `
              <div class="secret-row">
                  <span class="secret-dot ${t.isSet ? 'set' : 'unset'}"></span>
                  <span class="secret-name">${escapeHtml(t.displayName)}</span>
                  <span class="secret-badge ${t.isSet ? 'set' : 'unset'}">${t.isSet ? 'Set' : 'Missing'}</span>
              </div>`).join('')}
          </div>
      </div>` : ''}

      ${(settingsToggles ?? []).length > 0 ? `
      <div class="section">
          <div class="section-title">Quick Settings</div>
          <div class="settings-toggles">
              ${(settingsToggles ?? []).map(s => `
              <div class="setting-row">
                  <span>${escapeHtml(s.label)}</span>
                  <div class="toggle-switch ${s.enabled ? 'on' : ''}" data-setting="${escapeHtml(s.key)}" tabindex="0" role="switch" aria-checked="${s.enabled}" aria-label="Toggle ${escapeHtml(s.label)}"></div>
              </div>`).join('')}
          </div>
      </div>` : ''}
      
      ${getGoalsHtml(goals)}

      </div>`;
}
