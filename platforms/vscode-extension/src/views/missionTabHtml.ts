/**
 * missionTabHtml.ts - Mission Command tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 * Focused on project work: partnership, build, create.
 */
import { Nudge, actionButton, getNudgesHtml } from './welcomeViewHtml';

export interface MissionTabContext {
    nudges: Nudge[];
}

/** Generate the Mission Command tab panel HTML. */
export function getMissionTabHtml(ctx: MissionTabContext): string {
    const { nudges } = ctx;

    return `
      <div class="tab-panel active" id="panel-mission" role="tabpanel" aria-labelledby="tab-mission">

          ${getNudgesHtml(nudges)}

          <input type="text" class="quick-command-input" id="mission-command-search" placeholder="Search commands\u2026" aria-label="Search commands" />

          <nav class="action-list" aria-label="Actions" role="navigation" id="mission-action-list">

              <div class="action-group-label" data-group="partnership" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>PARTNERSHIP</div>
              <div class="action-group-content" data-group="partnership">
                  <button class="action-btn primary" data-cmd="openChat" tabindex="0" role="button" aria-label="Start a conversation with Alex">
                      <span class="action-icon" aria-hidden="true">💬</span>
                      <span class="action-text">Chat with Alex</span>
                  </button>
                  ${actionButton('northStar', '⭐', 'North Star', 'Define or review project vision and quality standards')}
                  ${actionButton('rubberDuck', '🦆', 'Think Together', 'Work through problems as partners')}
                  ${actionButton('upgrade', '⬆️', 'Initialize / Update', 'Deploy or refresh Alex architecture')}
              </div>

              <div class="action-group-label" data-group="build" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>BUILD</div>
              <div class="action-group-content" data-group="build">
                  ${actionButton('codeReview', '👀', 'Code Review', 'Review for correctness and growth')}
                  ${actionButton('debugThis', '🐛', 'Debug This', 'Find the issue together')}
                  ${actionButton('generateTests', '🧪', 'Generate Tests', 'Build confidence in your code')}
                  ${actionButton('runAudit', '🔍', 'Project Audit', 'Comprehensive quality check')}
                  ${actionButton('releasePreflight', '🚀', 'Release Preflight')}
                  ${actionButton('reviewPR', '👁️', 'Review PR', 'AI-powered pull request review')}
              </div>

              <div class="action-group-label" data-group="create" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>CREATE</div>
              <div class="action-group-content" data-group="create">
                  ${actionButton('generatePptx', '📝', 'Generate PPTX', 'Create polished PowerPoint presentations locally — free, offline')}
                  ${actionButton('generateGammaPresentation', '🎨', 'Gamma (Cloud)', 'Generate beautiful AI presentations via Gamma API')}
                  ${actionButton('generateGammaAdvanced', '⚙️', 'Gamma Advanced', 'Gamma with style, model, and image options')}
                  ${actionButton('generateAIImage', '🖼️', 'Generate Image', 'Generate AI images from text prompts via Replicate')}
                  ${actionButton('editImageAI', '✏️', 'Edit Image (AI)', 'Edit images with AI using nano-banana-pro model')}
              </div>

              <div class="action-group-label" data-group="learn" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>LEARN & KNOWLEDGE</div>
              <div class="action-group-content" data-group="learn">
                  ${actionButton('askAboutSelection', '💬', 'Ask About Selection', 'Ask about code or concepts')}
                  ${actionButton('saveSelectionAsInsight', '💡', 'Save Insight', 'Remember this for future projects')}
                  ${actionButton('generateDiagram', '📊', 'Generate Diagram', 'Visualize architecture and flow')}
                  ${actionButton('readAloud', '🔊', 'Read Aloud', 'Listen to documentation')}
              </div>

          </nav>

      </div>`;
}
