/**
 * docsTabHtml.ts - Docs tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from '../shared/sanitize';
import { actionButton } from './welcomeViewHtml';

/**
 * AlexLearn study guide persona data for the Docs tab persona grid.
 * Each entry maps to learnalex.correax.com/workshop/{id}
 * 41 study guides grouped by domain — synced with learnalex.correax.com/workshop/guide
 */
const STUDY_GUIDE_PERSONAS: Array<{ id: string; tag: string; name: string }> = [
    // Technology & Engineering
    { id: 'ai-researchers', tag: 'AI Research', name: 'AI Researchers' },
    { id: 'data-analysts', tag: 'Data', name: 'Data Analysts' },
    { id: 'data-engineers', tag: 'Data Engineering', name: 'Data Engineers' },
    { id: 'developers', tag: 'Software', name: 'Developers' },
    { id: 'engineers', tag: 'Engineering', name: 'Engineers' },
    { id: 'enterprise-architects', tag: 'Architecture', name: 'Enterprise Architects' },
    { id: 'game-developers', tag: 'Game Dev', name: 'Game Developers' },
    { id: 'open-source-contributors', tag: 'Open Source', name: 'Open Source' },
    { id: 'power-users', tag: 'Power User', name: 'Power Users' },
    { id: 'security-engineers', tag: 'Security', name: 'Security Engineers' },
    { id: 'sre-oncall', tag: 'SRE', name: 'SRE & On-Call' },
    { id: 'technical-writers', tag: 'Docs', name: 'Technical Writers' },
    // Business & Professional Services
    { id: 'consultants', tag: 'Consulting', name: 'Consultants' },
    { id: 'entrepreneurs', tag: 'Startup', name: 'Entrepreneurs' },
    { id: 'executives', tag: 'Leadership', name: 'Executives' },
    { id: 'finance-professionals', tag: 'Finance', name: 'Finance Pros' },
    { id: 'job-seekers', tag: 'Career', name: 'Job Seekers' },
    { id: 'business-knowledge-workers', tag: 'Business', name: 'Knowledge Workers' },
    { id: 'marketing', tag: 'Marketing', name: 'Marketing Pros' },
    { id: 'product-managers', tag: 'Product', name: 'Product Managers' },
    { id: 'project-managers', tag: 'PM', name: 'Project Managers' },
    { id: 'real-estate', tag: 'Real Estate', name: 'Real Estate Pros' },
    { id: 'sellers', tag: 'Sales', name: 'Sales Pros' },
    // Creative & Media
    { id: 'content-creators', tag: 'Content', name: 'Content Creators' },
    { id: 'creative-writers', tag: 'Creative', name: 'Creative Writers' },
    { id: 'designers', tag: 'Design', name: 'Designers' },
    { id: 'journalists', tag: 'Journalism', name: 'Journalists' },
    { id: 'podcasters', tag: 'Podcasting', name: 'Podcasters' },
    { id: 'standup-comics', tag: 'Comedy', name: 'Standup Comics' },
    { id: 'visual-storytellers', tag: 'Data Viz', name: 'Visual Storytellers' },
    // Education & Research
    { id: 'academic-research', tag: 'Academic', name: 'Researchers' },
    { id: 'grant-writers', tag: 'Grants', name: 'Grant Writers' },
    { id: 'scientists', tag: 'Science', name: 'Scientists' },
    { id: 'students', tag: 'Learning', name: 'Students' },
    { id: 'teachers', tag: 'Teaching', name: 'Teachers' },
    // Health, Law & Human Services
    { id: 'cx-leaders', tag: 'CX', name: 'CX Leaders' },
    { id: 'healthcare', tag: 'Healthcare', name: 'Healthcare Pros' },
    { id: 'hr-people-ops', tag: 'HR', name: 'HR & People Ops' },
    { id: 'lawyers', tag: 'Legal', name: 'Lawyers' },
    { id: 'nonprofit-leaders', tag: 'Nonprofit', name: 'Nonprofit Leaders' },
    { id: 'psychology-counselors', tag: 'Counseling', name: 'Counselors' },
];

/** Generate the persona grid HTML for the Docs tab. */
export function getPersonaGridHtml(): string {
    return STUDY_GUIDE_PERSONAS.map(p =>
        `<div class="persona-card" data-cmd="learnAlexWorkshop" data-workshop="${escapeHtml(p.id)}" tabindex="0" role="button" title="${escapeHtml(p.name)} study guide">
        <span class="persona-tag">${escapeHtml(p.tag)}</span>
        <span class="persona-name">${escapeHtml(p.name)}</span>
    </div>`
    ).join('\n                  ');
}

/** Generate the Docs tab panel HTML. */
export function getDocsTabHtml(): string {
    return `
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
                  <div class="doc-grid-card" data-cmd="quickReference" tabindex="0" role="button">
                      <span class="doc-grid-icon">⚡</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Quick Reference</div>
                          <div class="doc-grid-desc">Commands and shortcuts</div>
                      </div>
                  </div>
                  <div class="doc-grid-card" data-cmd="learnAlexResponsibleAI" tabindex="0" role="button">
                      <span class="doc-grid-icon">🤖</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Responsible AI</div>
                          <div class="doc-grid-desc">Ethical usage guidelines</div>
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
              <div class="docs-section-title">Reference</div>
              <div class="doc-grid">
                  <div class="doc-grid-card" data-cmd="openDoc:SKILL-DISCIPLINE-MAP" tabindex="0" role="button">
                      <span class="doc-grid-icon">🎯</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Skill-to-Discipline Map</div>
                          <div class="doc-grid-desc">130 skills mapped to 41 disciplines</div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Study Guides</div>
              <input type="text" class="skill-search-input" id="persona-search" placeholder="Search study guides\u2026" aria-label="Search study guides" />
              <div class="persona-grid">
                  ${getPersonaGridHtml()}
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Practice</div>
              ${actionButton('learnAlexSelfStudy', '📝', 'Self-Study Path', 'Self-paced learning at your own speed')}
              ${actionButton('learnAlexExercises', '🏋️', 'Exercises', 'Hands-on practice exercises')}
              ${actionButton('learnAlexQuiz', '❓', 'Quiz', 'Test your knowledge')}
              ${actionButton('learnAlexAirs', '📊', 'AIRS Assessment', 'AI Readiness Score — discover where you stand')}
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Books</div>
              ${actionButton('learnAlexBooks', '📚', 'The Alex Finch Library', 'Biography, fiction, and companion content')}
          </div>

          <div class="docs-cta">
              <div class="docs-cta-title">📚 Learn Alex Online</div>
              <div class="docs-cta-desc">Comprehensive study guides, exercises, and training at the companion site.</div>
              <button class="action-btn primary" data-cmd="learnAlex" tabindex="0" style="display: inline-flex;">Visit learnalex.correax.com</button>
          </div>

      </div>`;
}
