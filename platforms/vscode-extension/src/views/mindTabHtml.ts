/**
 * mindTabHtml.ts - Mind tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { HealthCheckResult } from '../shared/healthCheck';
import { MindTabData, actionButton } from './welcomeViewHtml';

export interface MindTabContext {
    mindData?: MindTabData;
    health: HealthCheckResult;
    hasGlobalKnowledge: boolean;
    streakDays: number;
    healthBannerClass: string;
    healthBannerIcon: string;
    healthBannerLabel: string;
    healthPct: number;
    cogTier: string;
    cogProgress: number;
}

/** Generate the Mind tab panel HTML. */
export function getMindTabHtml(ctx: MindTabContext): string {
    const {
        mindData, health, hasGlobalKnowledge, streakDays,
        healthBannerClass, healthBannerIcon, healthBannerLabel, healthPct,
        cogTier, cogProgress,
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
          </div>` : ''}

          <div class="dashboard-card">
              <div class="dashboard-card-title">Learn & Knowledge</div>
              ${actionButton('askAboutSelection', '💬', 'Ask About Selection', 'Ask about code or concepts')}
              ${actionButton('saveSelectionAsInsight', '💡', 'Save Insight', 'Remember this for future projects')}
              ${actionButton('generateDiagram', '📊', 'Generate Diagram', 'Visualize architecture and flow')}
              ${actionButton('readAloud', '🔊', 'Read Aloud', 'Listen to documentation')}
          </div>
          ` : `
          <div class="empty-state">
              <div class="empty-state-icon">🧠</div>
              <div class="empty-state-title">Mind</div>
              <div class="empty-state-desc">Initialize Alex architecture to see cognitive dashboard.</div>
          </div>
          `}
      </div>`;
}
