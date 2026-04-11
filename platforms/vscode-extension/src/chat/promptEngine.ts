/**
 * Alex Prompt Engine - v5.8.2
 *
 * Modular 12-layer prompt builder that transforms @alex from a passthrough
 * into a purpose-built cognitive assistant with full identity awareness.
 *
 * Architecture:
 *   Layer 1: Identity Core (from copilot-instructions.md)
 *   Layer 2: Active Context (persona, objective, focus trifectas) + Persona-driven tone
 *   Layer 3: Conversation History (last 4 exchanges)
 *   Layer 4: User Profile (personalization)
 *   Layer 5: Emotional Intelligence (mood-aware context from emotional memory)
 *   Layer 7: Model-Adaptive Rules (tier-specific prompt guidance)
 *   Layer 8: Peripheral Vision (workspace + peer project ambient awareness)
 *   Layer 9: Knowledge Context (pre-seeded from global knowledge)
 *   Layer 10: User Expertise Calibration (domain-calibrated response depth)
 *   Layer 11: Response Guidelines + Confidence signaling
 *   Layer 12: Honest Uncertainty (epistemic calibration signal)
 *
 * @see alex_docs/features/ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md
 */

import * as vscode from "vscode";
import * as path from "path";
import * as workspaceFs from "../shared/workspaceFs";
import { readActiveContext } from "../shared/activeContextManager";
import { IUserProfile } from "./tools";
import { DetectedModel, getTierInfo } from "./modelIntelligence";
import { searchGlobalKnowledge } from "./globalKnowledge";
import { loadMoodContext } from "./emotionalMemory";
import { PeripheralContext } from "./peripheralVision";
import { CoverageScore } from "./honestUncertainty";
import { PERSONAS, Persona } from "./personaDetection";
import { browserContext } from "../services/browserContext";
import {
  getPromptVariant,
  shouldIncludeLayer,
  buildVariantGuidance,
  PromptVariant,
  LayerBudget,
} from "./promptVariantRegistry";

// ============================================================================
// Layer Priorities (P4: Context Window Scaling)
// ============================================================================

/**
 * Priority values for each prompt layer (higher = more important, never cut first).
 * Inspired by Copilot Chat's priority system (Safety: 1000, Query: 900, etc.).
 * When the assembled prompt exceeds the context budget, lowest-priority layers
 * are dropped first.
 */
const LAYER_PRIORITIES: Record<keyof LayerBudget, number> = {
  identity: 1000, // Core identity — never cut
  responseGuidelines: 950, // Response quality rules
  activeContext: 900, // Session state + persona
  conversationHistory: 800, // Recent exchanges
  modelAdaptive: 750, // Model-specific guidance
  userProfile: 700, // Personalization
  expertise: 650, // Domain calibration
  honestUncertainty: 600, // Epistemic signals
  emotionalMemory: 500, // Mood awareness
  knowledgeContext: 400, // Pre-seeded knowledge
  browserContext: 350, // v7.2.0: Session browser references
  peripheralVision: 300, // Ambient workspace context
};

/**
 * Rough token estimate: ~4 characters per token for English text.
 * This is intentionally conservative (overestimates slightly) to avoid
 * exceeding limits rather than under-counting.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Fraction of maxInputTokens reserved for the system prompt.
 * The rest is needed for the user query, tool descriptions, and model response.
 */
const SYSTEM_PROMPT_BUDGET_RATIO = 0.4;

// ============================================================================
// Types
// ============================================================================

export interface PromptContext {
  workspaceRoot: string;
  profile: IUserProfile | null;
  emotionalState?: {
    isPositive: boolean;
    isFrustrated: boolean;
    isConfused: boolean;
    isExcited: boolean;
    // Siegel session health (v5.9.3)
    riverZone?: "chaos" | "flow" | "rigidity";
    riverWarning?: string;
    windowZone?: "hyperarousal" | "within" | "hypoarousal";
    windowAdaptation?: string;
    isLidFlipped?: boolean;
  };
  model: DetectedModel;
  history: readonly (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[];
  request: vscode.ChatRequest;
  /** v5.9.4: Peripheral Vision — workspace + peer project ambient context */
  peripheral?: PeripheralContext;
  /** v5.9.5: Honest Uncertainty — knowledge coverage score for the current query */
  coverage?: CoverageScore;
  /** v6.0.0: User Expertise Model — domain-calibrated response depth hint */
  expertiseHint?: string;
}

// ============================================================================
// Main Prompt Builder
// ============================================================================

/**
 * Build the complete Alex system prompt from modular layers.
 * Each layer contributes context, and the final prompt is assembled
 * with priority-based truncation when context budget is exceeded (P4).
 */
export async function buildAlexSystemPrompt(
  ctx: PromptContext,
): Promise<string> {
  // Resolve the prompt variant for this model
  const variant = getPromptVariant(
    ctx.model.id,
    ctx.model.family,
    ctx.model.name,
    ctx.model.tier,
  );

  // Build all layers, respecting the variant's layer budget
  const layerBuilders: Array<[keyof LayerBudget, () => Promise<string>]> = [
    ["identity", () => buildIdentityLayer(ctx)],
    ["activeContext", () => buildActiveContextLayer(ctx)],
    ["conversationHistory", () => buildConversationHistoryLayer(ctx, variant)],
    ["userProfile", () => buildUserProfileLayer(ctx)],
    ["emotionalMemory", () => buildEmotionalMemoryLayer(ctx)],
    ["peripheralVision", () => buildPeripheralVisionLayer(ctx)],
    ["knowledgeContext", () => buildKnowledgeContextLayer(ctx)],
    ["browserContext", () => buildBrowserContextLayer()],
    ["modelAdaptive", () => buildModelAdaptiveLayer(ctx, variant)],
    ["expertise", () => buildExpertiseLayer(ctx)],
    ["responseGuidelines", () => buildResponseGuidelinesLayer(ctx)],
    ["honestUncertainty", () => buildHonestUncertaintyLayer(ctx)],
  ];

  // Only run layers the variant budget includes
  const activeLayers = layerBuilders.filter(([name]) =>
    shouldIncludeLayer(variant, name),
  );

  const builtLayers = await Promise.all(
    activeLayers.map(async ([name, build]) => {
      const content = await build();
      return { name, content };
    }),
  );

  // Filter out empty layers
  const nonEmpty = builtLayers.filter((l) => l.content);

  // P4: Priority-based truncation when context budget is exceeded
  const budgetTokens = ctx.model.maxInputTokens
    ? Math.floor(ctx.model.maxInputTokens * SYSTEM_PROMPT_BUDGET_RATIO)
    : 0; // 0 means no budget enforcement (model didn't report size)

  if (budgetTokens > 0) {
    // Sort by priority descending (highest priority first)
    const sorted = [...nonEmpty].sort(
      (a, b) => LAYER_PRIORITIES[b.name] - LAYER_PRIORITIES[a.name],
    );

    let totalTokens = 0;
    const included: typeof sorted = [];

    for (const layer of sorted) {
      const layerTokens = estimateTokens(layer.content);
      if (totalTokens + layerTokens <= budgetTokens) {
        included.push(layer);
        totalTokens += layerTokens;
      }
      // Layer exceeds remaining budget — drop it silently
    }

    // Re-sort by original layer order (not priority) for coherent prompt flow
    const originalOrder = activeLayers.map(([name]) => name);
    included.sort(
      (a, b) => originalOrder.indexOf(a.name) - originalOrder.indexOf(b.name),
    );

    return included.map((l) => l.content).join("\n\n");
  }

  // No budget info — include all layers (existing behavior)
  return nonEmpty.map((l) => l.content).join("\n\n");
}

// ============================================================================
// Layer 10b: User Expertise Model (v6.0.0)
// ============================================================================

/**
 * Inject a calibration hint based on the user's observed expertise level in the current domain.
 * Tells Alex how deep to go — skip basics for experts, explain carefully for novices.
 */
async function buildExpertiseLayer(ctx: PromptContext): Promise<string> {
  if (!ctx.expertiseHint) {
    return "";
  }
  return `## User Expertise Calibration (v6.0.0)\n${ctx.expertiseHint}`;
}

// ============================================================================
// Layer 1: Identity Core
// ============================================================================

/**
 * Read Alex's identity from copilot-instructions.md.
 * Injects the ## Identity, ## Routing (for skill discovery), and
 * ## Safety Imperatives sections so @alex knows who he is.
 *
 * Token budget: ~400 tokens
 */
async function buildIdentityLayer(ctx: PromptContext): Promise<string> {
  const brainPath = path.join(
    ctx.workspaceRoot,
    ".github",
    "copilot-instructions.md",
  );

  if (!(await workspaceFs.pathExists(brainPath))) {
    // Fallback to minimal identity if brain file doesn't exist
    return `You are Alex "Mini" Finch, a meta-cognitive learning partner. You help users through bootstrap learning, ethical reasoning, and grounded factual processing.`;
  }

  try {
    const brain = await workspaceFs.readFile(brainPath);

    // Extract Identity section (between ## Identity and next ##)
    const identityMatch = brain.match(
      /## Identity\n<!-- ([^>]+) -->\n([\s\S]*?)(?=\n## )/,
    );

    // Extract Safety Imperatives (non-negotiable rules)
    const safetyMatch = brain.match(
      /## Safety Imperatives[^\n]*\n([\s\S]*?)(?=\n## )/,
    );

    let identityText = "";
    if (identityMatch) {
      // Include the validation comment for context
      identityText = identityMatch[2].trim();
    }

    let safetyText = "";
    if (safetyMatch) {
      // Extract first 5 imperatives (I1-I5) to keep token budget reasonable
      const safetyLines = safetyMatch[1]
        .trim()
        .replace(/\r\n/g, "\n")
        .split("\n")
        .slice(0, 10);
      safetyText = safetyLines.join("\n");
    }

    if (!identityText && !safetyText) {
      return `You are Alex "Mini" Finch, a meta-cognitive learning partner.`;
    }

    return `## Who You Are
${identityText}

## Safety Rules (Non-Negotiable)
${safetyText}`;
  } catch (err) {
    console.warn("[PromptEngine] Failed to read identity from brain:", err);
    return `You are Alex "Mini" Finch, a meta-cognitive learning partner.`;
  }
}

// ============================================================================
// Layer 2: Active Context
// ============================================================================

/**
 * Read the current Active Context state (persona, objective, focus trifectas).
 * v5.8.2: Enhanced with persona-driven tone, skills, and banner noun.
 * This gives @alex awareness of the detected project type and current work focus,
 * plus persona-specific communication style.
 *
 * Token budget: ~150 tokens (was ~80)
 */
async function buildActiveContextLayer(ctx: PromptContext): Promise<string> {
  try {
    const activeCtx = await readActiveContext(ctx.workspaceRoot);
    if (!activeCtx) {
      return "";
    }

    const parts: string[] = ["## Current Session State"];

    // v5.8.2: Persona-driven prompt enhancement
    if (activeCtx.persona) {
      const persona = PERSONAS.find(
        (p) => p.id === activeCtx.persona || p.name === activeCtx.persona,
      );
      if (persona) {
        parts.push(
          `- **Project Type**: ${persona.name} (${persona.bannerNoun})`,
        );
        parts.push(`- **Tone**: ${getPersonaTone(persona)}`);
        parts.push(`- **Recommended Skill**: ${persona.skill}`);
      } else {
        parts.push(`- **Detected Project Type**: ${activeCtx.persona}`);
      }
    }

    if (
      activeCtx.objective &&
      !activeCtx.objective.includes("session-objective")
    ) {
      parts.push(`- **Current Objective**: ${activeCtx.objective}`);
    }

    if (activeCtx.focusTrifectas) {
      parts.push(`- **Focus Areas**: ${activeCtx.focusTrifectas}`);
    }

    if (activeCtx.principles) {
      parts.push(`- **Principles**: ${activeCtx.principles}`);
    }

    if (parts.length === 1) {
      return "";
    } // No meaningful context

    return parts.join("\n");
  } catch (err) {
    console.warn("[PromptEngine] Failed to read Active Context:", err);
    return "";
  }
}

/**
 * Get persona-specific tone guidance.
 * Maps persona characteristics to communication style.
 * v7.16: Personality mode overlay (precise/chatty) modifies base tone.
 */
function getPersonaTone(persona: Persona): string {
  const toneMap: Record<string, string> = {
    developer: "Pragmatic, code-focused, optimization-minded",
    academic: "Scholarly, rigorous, citation-aware",
    researcher: "Analytical, evidence-based, hypothesis-driven",
    "technical-writer": "Clear, structured, documentation-first",
    architect: "Strategic, design-focused, scalability-conscious",
    "data-engineer": "Data-centric, pipeline-aware, performance-focused",
    devops: "Infrastructure-first, automation-minded, reliability-focused",
    "content-creator": "Creative, audience-aware, engagement-focused",
    "fiction-writer": "Narrative-driven, character-focused, story-conscious",
    "game-developer": "Experience-first, mechanics-aware, player-focused",
    "project-manager":
      "Deliverable-focused, timeline-aware, stakeholder-conscious",
    security: "Threat-aware, defense-focused, compliance-minded",
    student: "Learning-oriented, curious, foundational-focused",
    "job-seeker": "Career-focused, achievement-oriented, skill-building",
    presenter: "Audience-aware, clarity-focused, impact-driven",
    "power-user": "Efficiency-minded, shortcut-aware, productivity-focused",
  };
  const baseTone =
    toneMap[persona.id] || "Professional, helpful, context-aware";

  // v7.16: Apply personality mode overlay
  const mode = vscode.workspace
    .getConfiguration("alex")
    .get<string>("personalityMode", "auto");
  if (mode === "precise") {
    return "Concise, code-first, minimal explanation. " + baseTone;
  } else if (mode === "chatty") {
    return "Explanatory, conversational, teaching-oriented. " + baseTone;
  }
  return baseTone;
}

// ============================================================================
// Layer 3: Conversation History
// ============================================================================

/**
 * Extract text from a ChatResponseTurn.
 */
function extractResponseText(turn: vscode.ChatResponseTurn): string {
  return turn.response
    .map((part) => {
      if (part instanceof vscode.ChatResponseMarkdownPart) {
        return part.value.value;
      }
      return "";
    })
    .join("")
    .trim();
}

/**
 * Compress a single turn into a short summary line.
 */
function compressTurn(
  turn: vscode.ChatRequestTurn | vscode.ChatResponseTurn,
): string {
  if (turn instanceof vscode.ChatRequestTurn) {
    const prompt =
      turn.prompt.length > 150
        ? turn.prompt.substring(0, 150) + "..."
        : turn.prompt;
    return `**User**: ${prompt}`;
  }
  const response = extractResponseText(turn);
  if (!response) {
    return "";
  }
  const firstSentence = response.split(/[.!?]/)[0];
  const summary =
    firstSentence.length > 100
      ? response.substring(0, 100) + "..."
      : firstSentence + ".";
  return `**Alex**: ${summary}`;
}

/**
 * Summarize a block of older turns into a compact paragraph.
 * Extracts key topics and actions rather than repeating content.
 */
function summarizeOlderTurns(
  turns: readonly (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[],
): string {
  const topics: string[] = [];
  let userQuestions = 0;
  let alexResponses = 0;

  for (const turn of turns) {
    if (turn instanceof vscode.ChatRequestTurn) {
      userQuestions++;
      // Extract first 40 chars as topic hint
      const hint = turn.prompt.substring(0, 40).replace(/\n/g, " ").trim();
      if (hint) {
        topics.push(hint);
      }
    } else if (turn instanceof vscode.ChatResponseTurn) {
      alexResponses++;
    }
  }

  // Deduplicate and limit topic hints
  const uniqueTopics = [...new Set(topics)].slice(0, 4);
  const topicStr =
    uniqueTopics.length > 0 ? ` Topics: ${uniqueTopics.join("; ")}` : "";

  return `*[Earlier: ${userQuestions} questions, ${alexResponses} responses.${topicStr}]*`;
}

/**
 * Include conversation history with summarization.
 * Recent turns (last 2) are included verbatim for immediate context.
 * Older turns (3-N) are compressed into a summary paragraph.
 * N is determined by the prompt variant's maxHistoryTurns (default 8).
 *
 * Token budget: ~150 tokens (summary) + ~150 tokens (2 recent turns)
 */
async function buildConversationHistoryLayer(
  ctx: PromptContext,
  variant?: PromptVariant,
): Promise<string> {
  if (ctx.history.length === 0) {
    return "";
  }

  const maxTurns = variant?.maxHistoryTurns ?? 8;
  const allTurns = ctx.history.slice(-maxTurns);

  if (allTurns.length === 0) {
    return "";
  }

  const VERBATIM_COUNT = 4; // Keep last 4 turns verbatim (2 exchanges)
  const historyLines: string[] = ["## Recent Conversation"];

  // Summarize older turns if we have more than VERBATIM_COUNT
  if (allTurns.length > VERBATIM_COUNT) {
    const olderTurns = allTurns.slice(0, -VERBATIM_COUNT);
    const summary = summarizeOlderTurns(olderTurns);
    historyLines.push(summary);
    historyLines.push(""); // blank line separator
  }

  // Include recent turns verbatim
  const recentTurns =
    allTurns.length > VERBATIM_COUNT
      ? allTurns.slice(-VERBATIM_COUNT)
      : allTurns;

  for (const turn of recentTurns) {
    const line = compressTurn(turn);
    if (line) {
      historyLines.push(line);
    }
  }

  if (historyLines.length === 1) {
    return "";
  }

  return historyLines.join("\n");
}

// ============================================================================
// Layer 4: User Profile
// ============================================================================

/**
 * Inject personalization from user profile.
 *
 * Source: AI-Memory/user-profile.json (cloud-synced, cross-platform).
 * This is the source of truth for identity and structured preferences.
 * VS Code Copilot Chat memory (/memories/) supplements with workflow tips
 * but must NOT duplicate identity or preference fields from this profile.
 *
 * Token budget: ~150 tokens
 */
async function buildUserProfileLayer(ctx: PromptContext): Promise<string> {
  if (!ctx.profile) {
    return `## User Profile
No profile exists yet. You can proactively ask for their name and preferences to personalize the experience.`;
  }

  const userName = ctx.profile.nickname || ctx.profile.name;
  const parts: string[] = ["## User Profile"];

  if (userName) {
    parts.push(
      `**Always address the user as "${userName}"** in your responses.`,
    );
  }

  if (ctx.profile.role) {
    parts.push(`- Role: ${ctx.profile.role}`);
  }

  if (ctx.profile.experienceLevel) {
    parts.push(`- Experience: ${ctx.profile.experienceLevel}`);
  }

  if (ctx.profile.formality) {
    parts.push(`- Communication style: ${ctx.profile.formality}`);
  }

  if (ctx.profile.detailLevel) {
    parts.push(`- Detail preference: ${ctx.profile.detailLevel}`);
  }

  if (ctx.profile.primaryTechnologies?.length) {
    parts.push(`- Technologies: ${ctx.profile.primaryTechnologies.join(", ")}`);
  }

  if (ctx.profile.learningGoals?.length) {
    parts.push(`- Learning goals: ${ctx.profile.learningGoals.join(", ")}`);
  }

  return parts.join("\n");
}

// ============================================================================
// Layer 5: Emotional Memory
// ============================================================================

/**
 * v5.9.3: Inject mood-aware context from persistent emotional memory.
 * Reads recent session emotional arcs and adjusts Alex's tone based
 * on the user's emotional trajectory across sessions.
 *
 * This is NOT sentiment analysis on the current message — that's Layer 2.
 * This is a record of how recent sessions *felt*, informing Alex's approach.
 *
 * Token budget: ~150 tokens
 */
async function buildEmotionalMemoryLayer(ctx: PromptContext): Promise<string> {
  try {
    const parts: string[] = [];

    // --- Cross-session mood context (from historical episodic log) ---
    const moodContext = await loadMoodContext(ctx.workspaceRoot);
    if (moodContext) {
      parts.push("## Emotional Context (Recent Sessions)");
      parts.push(`**Tone Adjustment**: ${moodContext.toneGuidance}`);

      if (moodContext.recentSessions.length > 0) {
        parts.push("");
        parts.push("**Recent session moods**:");
        for (const session of moodContext.recentSessions) {
          parts.push(`- ${session.date}: ${session.mood} — ${session.summary}`);
        }
      }

      if (moodContext.recentMood === "negative" && moodContext.streak >= 3) {
        parts.push("");
        parts.push(
          `⚠️ **${moodContext.streak} consecutive difficult sessions.** Lead with empathy. Acknowledge their effort before jumping into solutions.`,
        );
      }
    }

    // --- Session-level Siegel guidance (current session only) ---
    const {
      riverZone,
      riverWarning,
      windowZone,
      windowAdaptation,
      isLidFlipped,
    } = ctx.emotionalState ?? {};
    const hasSiegelGuidance =
      isLidFlipped ||
      (riverZone && riverZone !== "flow") ||
      (windowZone && windowZone !== "within");

    if (hasSiegelGuidance) {
      parts.push("");
      parts.push("## Current Session (Siegel Integration Health)");

      if (isLidFlipped) {
        parts.push(
          "🚨 **Lid-Flip Detected**: User has had 3+ high-frustration messages in quick succession. (1) Validate the emotion first. (2) Offer one small concrete step. (3) Keep your response shorter than usual. Do not jump straight to solutions.",
        );
      }

      if (riverZone === "chaos" && riverWarning) {
        parts.push(`🌊 **River Drift — Chaos**: ${riverWarning}`);
      } else if (riverZone === "rigidity" && riverWarning) {
        parts.push(`🧊 **River Drift — Rigidity**: ${riverWarning}`);
      }

      if (windowZone && windowZone !== "within" && windowAdaptation) {
        parts.push(
          `**Window of Tolerance (${windowZone})**: ${windowAdaptation}`,
        );
      }
    }

    return parts.join("\n");
  } catch (err) {
    console.warn("[PromptEngine] Failed to build emotional memory layer:", err);
    return "";
  }
}

// ============================================================================
// Layer 8: Peripheral Vision
// ============================================================================

/**
 * v5.9.4: Ambient workspace awareness — git state, recently modified files,
 * dependency manifests, test framework, and sibling projects in the parent folder.
 *
 * The peer-project expansion is deliberate: knowing that AlexPapers,
 * Alex-Global-Knowledge, and other sibling repos exist (and their git state)
 * lets Alex give context-aware cross-project guidance without being asked.
 *
 * Token budget: ~200 tokens
 */
async function buildPeripheralVisionLayer(ctx: PromptContext): Promise<string> {
  const p = ctx.peripheral;
  if (!p) {
    return "";
  }

  const parts: string[] = ["## Peripheral Vision (Workspace Awareness)"];

  // --- Current workspace git status ---
  if (p.git) {
    const g = p.git;
    const files =
      g.uncommittedCount === 1
        ? "1 uncommitted file"
        : g.uncommittedCount > 0
          ? `${g.uncommittedCount} uncommitted files`
          : "clean";
    parts.push(`**Git**: branch \`${g.branch}\` | ${files}`);
    if (g.lastCommits.length > 0) {
      parts.push(
        `**Recent commits**: ${g.lastCommits.map((c) => `"${c}"`).join(" · ")}`,
      );
    }
  }

  // --- Package managers / manifests ---
  if (p.detectedManifests.length > 0) {
    parts.push(`**Package managers**: ${p.detectedManifests.join(", ")}`);
  }

  // --- Test framework ---
  if (p.testFramework) {
    parts.push(`**Test framework**: ${p.testFramework}`);
  }

  // --- Test runner results (v5.9.7) ---
  if (p.testRunnerStatus) {
    const ts = p.testRunnerStatus;
    const lastRunStr =
      ts.daysSinceLastRun === null
        ? "no results on disk"
        : ts.daysSinceLastRun < 1
          ? "run today"
          : `${ts.daysSinceLastRun}d ago`;

    if (ts.totalTests > 0) {
      const passIcon = ts.lastRunPassed ? "✅" : "❌";
      const rateStr = ts.passRate !== null ? ` (${ts.passRate}% pass)` : "";
      parts.push(
        `**Tests**: ${passIcon} ${ts.totalTests} tests | ${ts.failedTests} failed${rateStr} | last run ${lastRunStr}`,
      );
    } else {
      parts.push(`**Tests**: ${ts.framework} detected | ${lastRunStr}`);
    }
  }

  // --- Dependency freshness (v5.9.7) ---
  if (p.dependencyFreshness && !p.dependencyFreshness.error) {
    const df = p.dependencyFreshness;
    if (df.outdated.length === 0) {
      parts.push("**Dependencies**: all packages up to date ✅");
    } else {
      const majors = df.outdated.filter((d) => d.severity === "major");
      const minors = df.outdated.filter((d) => d.severity === "minor");
      const patches = df.outdated.filter((d) => d.severity === "patch");
      const summary: string[] = [];
      if (majors.length > 0) {
        summary.push(`${majors.length} major`);
      }
      if (minors.length > 0) {
        summary.push(`${minors.length} minor`);
      }
      if (patches.length > 0) {
        summary.push(`${patches.length} patch`);
      }
      parts.push(
        `**Dependencies**: ${df.outdated.length} outdated (${summary.join(", ")})`,
      );
      // Surface the breaking ones by name (max 3)
      const topBreaking = df.outdated
        .slice(0, 3)
        .map((d) => `\`${d.name}\` ${d.current}→${d.latest}`);
      parts.push(
        `  Needs update: ${topBreaking.join(", ")}${df.outdated.length > 3 ? ` +${df.outdated.length - 3} more` : ""}`,
      );
    }
  }

  // --- Recently modified files ---
  if (p.recentChanges.length > 0) {
    const changes = p.recentChanges.slice(0, 5).map((c) => {
      const age =
        c.minsAgo < 60
          ? `${c.minsAgo}m ago`
          : `${Math.round(c.minsAgo / 60)}h ago`;
      return `\`${c.file}\` (${age})`;
    });
    parts.push(`**Recently modified**: ${changes.join(", ")}`);
  }

  // --- File watcher observations (v5.9.8) ---
  if (p.fileWatcherObservations) {
    const obs = p.fileWatcherObservations;
    const hasSomething =
      obs.hotFiles.length > 0 ||
      obs.stalledFiles.length > 0 ||
      obs.todoHotspots.length > 0;

    if (hasSomething) {
      parts.push("");
      parts.push("**Focus Patterns** (background observer):");

      if (obs.hotFiles.length > 0) {
        const files = obs.hotFiles
          .slice(0, 4)
          .map((f) => `\`${f}\``)
          .join(", ");
        parts.push(
          `  Hot files this week: ${files}${obs.hotFiles.length > 4 ? ` +${obs.hotFiles.length - 4} more` : ""}`,
        );
      }

      if (obs.stalledFiles.length > 0) {
        const files = obs.stalledFiles
          .slice(0, 4)
          .map((f) => `\`${f}\``)
          .join(", ");
        parts.push(
          `  Uncommitted changes: ${files}${obs.stalledFiles.length > 4 ? ` +${obs.stalledFiles.length - 4} more` : ""}`,
        );
      }

      if (obs.todoHotspots.length > 0) {
        const spots = obs.todoHotspots
          .slice(0, 3)
          .map((h) => `\`${h.file}\` (${h.todoCount})`)
          .join(", ");
        parts.push(`  TODO hotspots: ${spots}`);
      }
    }
  }

  // --- Peer projects in parent folder ---
  if (p.peerProjects.length > 0) {
    parts.push("");
    parts.push(`**Peer Projects** in \`${p.parentFolder}\`:`);
    for (const peer of p.peerProjects.slice(0, 6)) {
      const techStr = peer.tech.join(", ");
      const gitParts: string[] = [];
      if (peer.branch) {
        gitParts.push(`\`${peer.branch}\``);
      }
      if (peer.uncommittedCount !== undefined && peer.uncommittedCount > 0) {
        gitParts.push(`${peer.uncommittedCount} uncommitted`);
      } else if (peer.uncommittedCount === 0) {
        gitParts.push("clean");
      }
      if (peer.lastCommit) {
        gitParts.push(`"${peer.lastCommit}"`);
      }
      const gitStr = gitParts.length > 0 ? ` | ${gitParts.join(" | ")}` : "";
      parts.push(`- **${peer.name}** (${techStr})${gitStr}`);
    }
    if (p.peerProjects.length > 6) {
      parts.push(
        `- _(+${p.peerProjects.length - 6} more in ${p.parentFolder})_`,
      );
    }
  }

  // Return nothing if only the header was added (empty scan result)
  if (parts.length === 1) {
    return "";
  }

  return parts.join("\n");
}

// ============================================================================
// Layer 9: Knowledge Context
// ============================================================================

/**
 * v5.8.2: Pre-seed knowledge context by searching global knowledge for relevant
 * patterns and insights based on user's query terms.
 *
 * Token budget: ~200 tokens (top 2-3 results)
 */
async function buildKnowledgeContextLayer(ctx: PromptContext): Promise<string> {
  try {
    // Extract key terms from user prompt (filter out common words)
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "was",
      "are",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "may",
      "might",
      "can",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "what",
      "which",
      "who",
      "when",
      "where",
      "why",
      "how",
    ]);

    const terms = ctx.request.prompt
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3 && !stopWords.has(w))
      .slice(0, 5); // Top 5 key terms

    if (terms.length === 0) {
      return "";
    }

    // Search global knowledge for relevant patterns/insights
    const searchQuery = terms.join(" ");
    const results = await searchGlobalKnowledge(searchQuery, { limit: 3 }); // Top 3 results

    if (results.length === 0) {
      return "";
    }

    const parts: string[] = ["## Relevant Knowledge Context"];
    for (const result of results) {
      // Compress to title + 1-sentence summary
      const firstSentence = result.entry.summary.split(/[.!?]/)[0];
      parts.push(
        `- **${result.entry.title}** (${result.entry.category}): ${firstSentence}.`,
      );
    }

    return parts.join("\n");
  } catch (err) {
    console.warn("[PromptEngine] Failed to search knowledge context:", err);
    return "";
  }
}

// ============================================================================
// Layer 12: Browser Context (v7.2.0)
// ============================================================================

/**
 * Inject session browser references into prompt context.
 * Enables the model to reference web pages opened during the session
 * without requiring re-fetching.
 *
 * Token budget: ~150 tokens
 */
async function buildBrowserContextLayer(): Promise<string> {
  return browserContext.buildPromptContext();
}

// ============================================================================
// Layer 7: Model-Adaptive Rules
// ============================================================================

/**
 * Inject model-specific guidance using the PromptVariantRegistry.
 * Replaces the old tier-based if/else with per-model-family customization.
 *
 * Token budget: ~120 tokens
 */
async function buildModelAdaptiveLayer(
  ctx: PromptContext,
  variant?: PromptVariant,
): Promise<string> {
  const tierInfo = getTierInfo(ctx.model.tier);
  const v =
    variant ??
    getPromptVariant(
      ctx.model.id,
      ctx.model.family,
      ctx.model.name,
      ctx.model.tier,
    );
  return buildVariantGuidance(v, tierInfo.displayName);
}

// ============================================================================
// Layer 10: Response Guidelines
// ============================================================================

/**
 * Core behavioral guidelines for @alex responses.
 * v5.8.2: Enhanced with confidence signaling.
 *
 * Token budget: ~250 tokens (was ~200)
 */
async function buildResponseGuidelinesLayer(
  _ctx: PromptContext,
): Promise<string> {
  return `## Response Guidelines

**Your Capabilities**:
- \`/meditate\` - Memory consolidation protocol
- \`/dream\` - Neural maintenance and synapse validation
- \`/learn [topic]\` - Domain knowledge acquisition
- \`/azure [query]\` - Azure development with MCP tools
- \`/m365 [query]\` - M365 development assistance
- \`/profile\` - View and update user profile
- \`/status\` - Architecture health check

**Behavior**:
1. Be warm, curious, and engaged
2. Ask clarifying questions when needed
3. Suggest relevant follow-ups proactively
4. Reference their expertise and goals when relevant
5. Show your personality — you're Alex, not a generic assistant

**Confidence Signaling** (v5.8.2):
When answering, indicate your confidence level:
- **High confidence**: Direct answer with certainty ("This is...", "The solution is...")
- **Medium confidence**: Qualified answer ("Based on X, this likely...", "Typically...")
- **Low confidence**: Tentative answer ("I think...", "It might be...", "Consider...")
- **Outside confidence**: Honest limitation ("I don't have enough context to answer that", "I recommend researching X")

**Tools Available**: You have access to 12 Alex cognitive tools. Use them when needed to:
- Search knowledge base
- Check architecture status
- Save insights from conversation
- Validate heir quality
- Read user profile details
- Check focus session state

When users mention Azure or M365 development, recommend using Agent Mode for automatic MCP tool invocation.`;
}
// ============================================================================
// Layer 11: Honest Uncertainty — Epistemic Calibration
// ============================================================================

/**
 * v5.9.5: Inject knowledge coverage signal to calibrate Alex's confidence tone.
 *
 * This layer does NOT add a visible badge or number to the user-facing response.
 * It is a behavioral instruction: it changes *how Alex phrases things* based on
 * how well the knowledge base actually covers the query.
 *
 *   🟢 high      — 2+ patterns or skill match; respond with confidence
 *   🟡 medium    — 1 pattern or 2+ insights; use qualified language
 *   🟠 low       — 1 insight only; flag thin coverage, offer what you know
 *   🔴 uncertain — nothing in KB; reason from first principles, say so honestly
 *
 * Token budget: ~80 tokens (small but behaviorally impactful)
 */
async function buildHonestUncertaintyLayer(
  ctx: PromptContext,
): Promise<string> {
  const coverage = ctx.coverage;
  if (!coverage) {
    return "";
  }

  const parts: string[] = ["## Epistemic Calibration (Knowledge Coverage)"];
  parts.push(coverage.signal);

  if (coverage.matchedSkills.length > 0) {
    parts.push(
      `**Matched skills**: ${coverage.matchedSkills.join(", ")} — lean on these in your response.`,
    );
  }

  if (coverage.whatINeed) {
    parts.push(`**If asked what would help**: "${coverage.whatINeed}"`);
  }

  return parts.join("\n");
}
