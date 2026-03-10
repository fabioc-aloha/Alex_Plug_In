/**
 * skillStoreTabHtml.ts - Skill Store tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from '../shared/sanitize';
import { HealthCheckResult } from '../shared/healthCheck';
import { SkillInfo } from './welcomeViewHtml';

/** Dynamic skill category detection via keyword patterns (no hardcoded map). */
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

const CATEGORY_ICONS: Record<string, string> = {
    'Cognitive': '🧠', 'Development': '⚙️', 'AI & ML': '🤖', 'Research & Writing': '📝',
    'Creative & Media': '🎨', 'Azure & Cloud': '☁️', 'VS Code': '💻', 'Collaboration': '🤝', 'Other': '📦',
};

const CATEGORY_ORDER = ['Cognitive', 'Development', 'AI & ML', 'Research & Writing', 'Creative & Media', 'Azure & Cloud', 'VS Code', 'Collaboration', 'Other'];

const SKILL_ICONS: Record<string, string> = {
    'meditation': '🧘', 'dream-state': '💭', 'self-actualization': '✨', 'north-star': '⭐',
    'code-review': '👀', 'debugging-patterns': '🐛', 'testing-strategies': '🧪', 'root-cause-analysis': '🔍',
    'refactoring-patterns': '🔧', 'security-review': '🛡️', 'secrets-management': '🔑',
    'research-first-development': '📚', 'bootstrap-learning': '📖', 'knowledge-synthesis': '🔗',
    'global-knowledge': '🌐', 'brand-asset-management': '🎨', 'image-handling': '🖼️',
    'ai-generated-readme-banners': '🏞️', 'flux-brand-finetune': '🎯', 'vscode-extension-patterns': '💻',
    'mcp-development': '🔌', 'release-process': '🚀', 'markdown-mermaid': '📊',
    'skill-building': '🧩', 'visual-memory': '👁️', 'brain-qa': '🩺',
};

function classifySkill(id: string, description: string): string {
    const text = `${id} ${description}`.toLowerCase();
    for (const rule of CATEGORY_RULES) {
        if (rule.pattern.test(text)) { return rule.category; }
    }
    return 'Other';
}

function getSkillIcon(id: string, category: string): string {
    return SKILL_ICONS[id] || CATEGORY_ICONS[category] || '📦';
}

export interface SkillStoreTabContext {
    skills?: SkillInfo[];
    health: HealthCheckResult;
}

/** Generate the Skill Store tab panel HTML. */
export function getSkillStoreTabHtml(ctx: SkillStoreTabContext): string {
    const { skills, health } = ctx;

    const skillCategories: Record<string, SkillInfo[]> = {};
    for (const cat of CATEGORY_ORDER) { skillCategories[cat] = []; }
    for (const s of skills ?? []) {
        const cat = classifySkill(s.id, s.description);
        if (!skillCategories[cat]) { skillCategories[cat] = []; }
        skillCategories[cat].push(s);
    }

    return `
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
                      ${catSkills.map(s => {
                      const skillIcon = getSkillIcon(s.id, cat);
                      return `
                      <div class="skill-card" data-cmd="openSkill" data-skill="${escapeHtml(s.id)}" data-skill-name="${escapeHtml(s.displayName)}" title="${escapeHtml(s.description)}" tabindex="0" role="button">
                          <div class="skill-header">
                              <span class="skill-icon" aria-hidden="true">${skillIcon}</span>
                              <span class="skill-name">${escapeHtml(s.displayName)}</span>
                              ${s.hasSynapses ? '<span class="skill-synapse-dot" title="Has synapses">\u26A1</span>' : ''}
                          </div>
                          <div class="skill-desc">${escapeHtml(s.description)}</div>
                      </div>`;}).join('')}
                  </div>
              </div>`;
          }).join('')}
          </div>

          <div class="install-github-card" data-cmd="openChat" tabindex="0" role="button" title="Install skills from GitHub repositories">
              <div style="font-size: 20px; margin-bottom: 4px;">📥</div>
              <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">Install from GitHub</div>
              <div style="font-size: 11px; opacity: 0.7;">Ask Alex to install community skills from GitHub repositories</div>
          </div>
          `}
      </div>`;
}
