/**
 * docsTabHtml.ts - Docs tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 */
import { escapeHtml } from '../shared/sanitize';
import { actionButton } from './welcomeViewHtml';

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

/** Generate the persona grid HTML for the Docs tab. */
export function getPersonaGridHtml(): string {
    return WORKSHOP_PERSONAS.map(p =>
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
              <input type="text" class="skill-search-input" id="persona-search" placeholder="Search workshops\u2026" aria-label="Search workshop study guides" />
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

      </div>`;
}
