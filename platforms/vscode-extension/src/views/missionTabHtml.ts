/**
 * missionTabHtml.ts - Mission Command tab HTML generation for the Command Center sidebar
 *
 * Extracted from welcomeViewHtml.ts during Post-Implementation Optimization (P0).
 * Exports a single function called by the orchestrator.
 * Focused on project work: partnership, agents, create, learn.
 */
import { Nudge, actionButton, getNudgesHtml } from "./welcomeViewHtml";
import { ActiveContext } from "../shared/activeContextManager";

export interface MissionTabContext {
  nudges: Nudge[];
  activeContext?: ActiveContext | null;
  showBootstrap?: boolean;
  isBootstrapResume?: boolean;
  chatMemoryLines?: number;
  isActive?: boolean;
  isMaster?: boolean;
}

/** Generate the Mission Command tab panel HTML. */
export function getMissionTabHtml(ctx: MissionTabContext): string {
  const { nudges } = ctx;

  return `
      <div class="tab-panel${ctx.isActive !== false ? " active" : ""}" id="panel-mission" role="tabpanel" aria-labelledby="tab-mission">

          ${getNudgesHtml(nudges)}

          <nav class="action-list" aria-label="Actions" role="navigation" id="mission-action-list">

              <div class="action-group-label" data-group="partnership" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>PARTNERSHIP</div>
              <div class="action-group-content" data-group="partnership">
                  <button class="action-btn primary" data-cmd="openChat" tabindex="0" role="button" aria-label="Start a conversation with Alex">
                      <span class="action-icon" aria-hidden="true">💬</span>
                      <span class="action-text">Chat with Alex</span>
                  </button>
                  ${actionButton("northStar", "⭐", "North Star", "Define or review project vision and quality standards")}
                  ${!ctx.isMaster ? actionButton("upgrade", "\u2B06\uFE0F", "Initialize / Update", "Deploy or refresh Alex architecture") : ""}                  ${ctx.showBootstrap ? actionButton("heirBootstrap", "\ud83e\uddec", ctx.isBootstrapResume ? "Resume Bootstrap" : "Bootstrap Project", ctx.isBootstrapResume ? "Continue tailoring Alex to this project (interrupted session detected)" : "Tailor Alex to this project (build commands, conventions, security hooks)") : ""}              </div>

              <div class="action-group-label" data-group="agents" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>AGENTS</div>
              <div class="action-group-content" data-group="agents">
                  <div class="mission-profile-bar" role="radiogroup" aria-label="Mission profile">
                      <button class="mission-profile-btn active" data-mission="alex" title="Default cognitive partner mode">🧠 Alex</button>
                      <button class="mission-profile-btn" data-mission="release" title="Heightened quality gates, Validator on all changes">🚀 Release</button>
                      <button class="mission-profile-btn" data-mission="research" title="Breadth-first, cite sources, compare approaches">🔬 Research</button>
                      <button class="mission-profile-btn" data-mission="debug" title="3+ hypotheses, binary search, no shotgun debugging">🐛 Debug</button>
                      <button class="mission-profile-btn" data-mission="review" title="Adversarial, confidence-scored, pattern deviation">👀 Review</button>
                      <button class="mission-profile-btn" data-mission="draft" title="Skip Validator, accept TODOs, move fast">⚡ Draft</button>
                  </div>
              </div>

              <div class="action-group-label" data-group="create" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>CREATE</div>
              <div class="action-group-content" data-group="create">
                  ${actionButton("generatePptx", "📝", "Generate PPTX", "Create polished PowerPoint presentations locally — free, offline")}
                  ${actionButton("generateGammaPresentation", "🎨", "Gamma Presentation", "Generate AI presentations via Gamma API (use advanced options in dialog)")}
                  ${actionButton("generateAIImage", "🖼️", "Generate Image", "Generate AI images from text prompts via Replicate")}
                  ${actionButton("editImageAI", "✏️", "Edit Image (AI)", "Edit images with AI using nano-banana-pro model")}
              </div>

              <div class="action-group-label" data-group="learn" tabindex="0" role="button" aria-expanded="true"><span class="collapse-chevron" aria-hidden="true">▾</span>LEARN & KNOWLEDGE</div>
              <div class="action-group-content" data-group="learn">
                  ${actionButton("saveSelectionAsInsight", "💡", "Save Insight", "Remember this for future projects")}
                  ${actionButton("generateDiagram", "📊", "Generate Diagram", "Visualize architecture and flow")}
                  ${actionButton("exportMemory", "📤", "Export Memory", "Export all memory to a portable file for other AI surfaces")}
                  ${actionButton("memoryAudit", "🔍", "Memory Audit", "Audit user memory for scope violations, waste, and budget usage")}
                  <button class="action-btn" data-cmd="openChatMemoryFile" tabindex="0" role="button" aria-label="Open Chat Memory file">
                      <span class="action-icon" aria-hidden="true">💾</span>
                      <span class="action-text">Chat Memory</span>
                      <span class="action-badge${(ctx.chatMemoryLines ?? 0) >= 200 ? " badge-warning" : ""}" title="${(ctx.chatMemoryLines ?? 0) >= 200 ? "First 200 lines auto-loaded into context. Consider pruning." : "Lines in Copilot Chat user memory"}">${ctx.chatMemoryLines ?? 0} lines</span>
                  </button>
              </div>

          </nav>

      </div>`;
}
