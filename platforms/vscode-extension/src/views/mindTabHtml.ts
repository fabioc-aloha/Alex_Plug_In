/**
 * mindTabHtml.ts - Mind tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 * Contains: identity, health, cognitive maintenance, system config, API keys, settings.
 */
import { HealthCheckResult } from '../shared/healthCheck';
import { escapeHtml } from '../shared/sanitize';
import { MindTabData, TokenStatusInfo, SettingsToggle, actionButton } from './welcomeViewHtml';

export interface MindTabContext {
    mindData?: MindTabData;
    health: HealthCheckResult;
    hasGlobalKnowledge: boolean;
    healthBannerClass: string;
    healthBannerIcon: string;
    healthBannerLabel: string;
    healthPct: number;
    tokenStatuses?: TokenStatusInfo[];
    settingsToggles?: SettingsToggle[];
}

/** Generate the Mind tab panel HTML. */
export function getMindTabHtml(ctx: MindTabContext): string {
    const {
        mindData, health, hasGlobalKnowledge,
        healthBannerClass, healthBannerIcon, healthBannerLabel, healthPct,
        tokenStatuses, settingsToggles,
    } = ctx;

    return `
      <div class="tab-panel" id="panel-mind" role="tabpanel" aria-labelledby="tab-mind">
          ${mindData ? `
          <div class="identity-card">
              <div class="identity-name">${mindData.identityName}</div>
              <div class="identity-meta">${mindData.identityMeta}</div>
          </div>

          <div class="arch-status-banner ${healthBannerClass}" data-cmd="healthDashboard" title="Click to open Health Dashboard" tabindex="0" role="button" aria-label="Architecture health: ${healthBannerLabel}">
              <span class="arch-status-icon" aria-hidden="true">${healthBannerIcon}</span>
              <div class="arch-status-detail">
                  <div class="arch-status-title">Architecture ${healthBannerLabel}</div>
                  <div class="arch-status-meta">${health.totalSynapses} synapses${health.brokenSynapses > 0 ? ` · ${health.brokenSynapses} broken` : ''} · ${healthPct}%</div>
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
              ${mindData.meditationCount > 0 ? `
              <div class="meditation-streak-row">
                  <span class="meditation-streak-badge">🧘 ${mindData.meditationCount} session${mindData.meditationCount !== 1 ? 's' : ''}</span>
              </div>` : ''}
          </div>

          <div class="dashboard-card">
              <div class="dashboard-card-title">Knowledge Freshness</div>
              <div class="freshness-panel">
                  <div class="freshness-bucket thriving">
                      <div class="freshness-count">${mindData.freshness.thriving}</div>
                      <div class="freshness-label">Thriving</div>
                  </div>
                  <div class="freshness-bucket active">
                      <div class="freshness-count">${mindData.freshness.active}</div>
                      <div class="freshness-label">Active</div>
                  </div>
                  <div class="freshness-bucket fading">
                      <div class="freshness-count">${mindData.freshness.fading}</div>
                      <div class="freshness-label">Fading</div>
                  </div>
                  <div class="freshness-bucket dormant">
                      <div class="freshness-count">${mindData.freshness.dormant}</div>
                      <div class="freshness-label">Dormant</div>
                  </div>
              </div>
              ${(mindData.freshness.fading + mindData.freshness.dormant) > 0 ? actionButton('reviewFadingSkills', '🔄', 'Review Fading Skills', 'Refresh skills that need attention') : ''}
          </div>

          ${mindData.calibration.total > 0 ? `
          <div class="dashboard-card">
              <div class="dashboard-card-title">Honest Uncertainty</div>
              <div class="calibration-panel">
                  ${(['high', 'medium', 'low', 'uncertain'] as const).map(level => {
                      const count = mindData.calibration[level];
                      const pct = mindData.calibration.total > 0 ? Math.round((count / mindData.calibration.total) * 100) : 0;
                      const emoji = level === 'high' ? '🟢' : level === 'medium' ? '🟡' : level === 'low' ? '🟠' : '🔴';
                      return `
                  <div class="calibration-bar-row">
                      <span class="calibration-label">${emoji} ${level.charAt(0).toUpperCase() + level.slice(1)}</span>
                      <div class="calibration-bar-track"><div class="calibration-bar-fill ${level}" style="width: ${pct}%"></div></div>
                      <span class="calibration-pct">${pct}%</span>
                  </div>`;}).join('')}
              </div>
              ${(mindData.calibration.low + mindData.calibration.uncertain) > 0 ? actionButton('reviewLowConfidence', '📚', 'Review Low-Confidence', 'Build knowledge in uncertain areas') : ''}
          </div>` : ''}

          ${(tokenStatuses ?? []).length > 0 ? `
          <div class="dashboard-card">
              <div class="dashboard-card-title">API Keys</div>
              <div class="secret-status-panel" data-cmd="manageSecrets" tabindex="0" role="button" title="Click to manage API keys">
                  ${(tokenStatuses ?? []).map(t => `
                  <div class="secret-row">
                      <span class="secret-dot ${t.isSet ? 'set' : 'unset'}"></span>
                      <span class="secret-name">${escapeHtml(t.displayName)}</span>
                      <span class="secret-badge ${t.isSet ? 'set' : 'unset'}">${t.isSet ? 'Set' : 'Missing'}</span>
                  </div>`).join('')}
              </div>
              ${actionButton('manageSecrets', '🔑', 'Manage Keys', 'Manage tokens for Gamma, Replicate, OpenAI')}
              ${actionButton('detectEnvSecrets', '🔍', 'Detect .env Secrets', 'Scan .env files and migrate to secure storage')}
          </div>` : ''}

          ${(settingsToggles ?? []).length > 0 ? `
          <div class="dashboard-card">
              <div class="dashboard-card-title">Quick Settings</div>
              ${actionButton('setupEnvironment', '⚙️', 'Full Environment Setup…', 'Open the environment setup wizard')}
              <div class="settings-toggles">
                  ${(() => {
                    let lastGroup = '';
                    return (settingsToggles ?? []).map(s => {
                      const groupHeader = s.group && s.group !== lastGroup
                        ? `<div class="settings-group-header">${escapeHtml(s.group)}</div>`
                        : '';
                      if (s.group) {
                        lastGroup = s.group;
                      }
                      return `${groupHeader}
                  <div class="setting-row"${s.tooltip ? ` title="${escapeHtml(s.tooltip)}"` : ''}>
                      <span>${escapeHtml(s.label)}</span>
                      <div class="toggle-switch ${s.enabled ? 'on' : ''}" data-setting="${escapeHtml(s.key)}" tabindex="0" role="switch" aria-checked="${s.enabled}" aria-label="Toggle ${escapeHtml(s.label)}"></div>
                  </div>`;
                    }).join('');
                  })()}
              </div>
          </div>` : ''}
          ` : `
          <div class="empty-state">
              <div class="empty-state-icon">🧠</div>
              <div class="empty-state-title">Mind</div>
              <div class="empty-state-desc">Initialize Alex architecture to see cognitive dashboard.</div>
          </div>
          `}
      </div>`;
}
