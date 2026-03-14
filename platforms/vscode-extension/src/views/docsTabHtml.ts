/**
 * docsTabHtml.ts - Docs tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from '../shared/sanitize';
import { actionButton } from './welcomeViewHtml';

/**
 * Study guide category sections linking to learnalex.correax.com/workshop/guide.
 * 76+ guides now live on the site — link to sections rather than listing each one.
 */
const STUDY_GUIDE_SECTIONS: Array<{ icon: string; name: string; anchor: string }> = [
    { icon: '💻', name: 'Technology & Engineering', anchor: 'technology--engineering' },
    { icon: '💼', name: 'Business & Professional', anchor: 'business--professional-services' },
    { icon: '🎨', name: 'Creative & Media', anchor: 'creative--media' },
    { icon: '🎓', name: 'Education & Research', anchor: 'education--research' },
    { icon: '🏥', name: 'Health, Law & Human Services', anchor: 'health-law--human-services' },
];

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
                          <div class="doc-grid-desc">133 skills mapped to 76 disciplines</div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="docs-section">
              <div class="docs-section-title">Study Guides</div>
              <div class="doc-grid">
                  ${STUDY_GUIDE_SECTIONS.map(s =>
                      `<div class="doc-grid-card" data-cmd="learnAlexGuideSection" data-anchor="${escapeHtml(s.anchor)}" tabindex="0" role="button">
                      <span class="doc-grid-icon">${s.icon}</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">${escapeHtml(s.name)}</div>
                      </div>
                  </div>`
                  ).join('\n                  ')}
              </div>
              <div style="margin-top: 8px; text-align: center;">
                  <button class="action-btn" data-cmd="learnAlexGuideSection" data-anchor="" tabindex="0" style="display: inline-flex;">Browse all 76+ study guides</button>
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
