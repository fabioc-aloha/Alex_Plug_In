/**
 * docsTabHtml.ts - Docs tab HTML generation for the Command Center sidebar
 *
 * Exports a single function called by the orchestrator.
 */

/** Generate the Docs tab panel HTML. */
export function getDocsTabHtml(): string {
  return `
      <div class="tab-panel" id="panel-docs" role="tabpanel" aria-labelledby="tab-docs">

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
                  <div class="doc-grid-card" data-cmd="openDoc:AGENT-CATALOG" tabindex="0" role="button">
                      <span class="doc-grid-icon">🤖</span>
                      <div class="doc-grid-text">
                          <div class="doc-grid-title">Agent Catalog</div>
                          <div class="doc-grid-desc">All specialist agents</div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="docs-cta">
              <div class="docs-cta-title">📚 LearnAI</div>
              <div class="docs-cta-desc">80 playbooks and readiness tools -- free for any AI platform.</div>
              <button class="action-btn primary" data-cmd="learnAlex" tabindex="0">Browse learnai.correax.com</button>
              <div class="docs-cta-links">
                  <a class="docs-cta-link" data-cmd="learnAlexPromptEngineering" tabindex="0">Prompt Engineering</a>
                  <span class="docs-cta-sep">·</span>
                  <a class="docs-cta-link" data-cmd="learnAlexAiReadiness" tabindex="0">AI Readiness</a>
                  <span class="docs-cta-sep">·</span>
                  <a class="docs-cta-link" data-cmd="learnAlexAiAdoption" tabindex="0">AI Adoption</a>
              </div>
          </div>

      </div>`;
}
