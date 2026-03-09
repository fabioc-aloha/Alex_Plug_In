/**
 * agentsTabHtml.ts - Agents tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from '../shared/sanitize';
import { AgentInfo, actionButton } from './welcomeViewHtml';
import { AgentActivity } from '../services/agentActivity';

export interface AgentsTabContext {
    agents?: AgentInfo[];
    recentActivity?: AgentActivity[];
    cognitiveState: string | null;
    agentMode: string | null;
    personalityMode?: string;
}

/** Generate the Agents tab panel HTML. */
export function getAgentsTabHtml(ctx: AgentsTabContext): string {
    const { agents, recentActivity, cognitiveState, agentMode, personalityMode } = ctx;

    return `
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
      </div>`;
}
