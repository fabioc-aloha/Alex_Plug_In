import * as vscode from "vscode";
import * as path from "path";
import { logInfo } from "../shared/logger";
import {
  processForInsights,
  getAutoInsightsConfig,
} from "../commands/autoInsights";
import { getUserProfile, formatPersonalizedGreeting } from "./tools";
import {
  recordEmotionalSignal,
  resetEmotionalState,
  assessRiverOfIntegration,
  assessWindowOfTolerance,
  isLidFlipped as checkLidFlipped,
} from "./emotionalMemory";
import { gatherPeripheralContext } from "./peripheralVision";
import {
  scoreKnowledgeCoverage,
  recordCalibrationFeedback,
  recordModelUsage,
} from "./honestUncertainty";
import { createGlobalInsight } from "./globalKnowledge";
import { GlobalKnowledgeCategory } from "../shared/constants";
// persona detection handled elsewhere (runtime); import removed
import { speakIfVoiceModeEnabled } from "../ux/uxFeatures";
import {
  getModelInfo,
  detectModelTier,
  getTierInfo,
} from "./modelIntelligence";
import { detectCognitiveState } from "./avatarMappings";
import { buildAlexSystemPrompt, PromptContext } from "./promptEngine";
import { assertDefined } from "../shared/assertions";
import { appendToEpisodicDraft } from "../services/episodicMemory";
import {
  classifyDomain,
  getSystemPromptHint,
  recordInteraction,
} from "../services/expertiseModel";
import { agentActivity } from "../services/agentActivity";
import { sessionTrace } from "../services/sessionTrace";

// ============================================================================
// C5: Steering Awareness — yield detection for mid-turn user input
// ============================================================================

/** Polling interval for yieldRequested checks (ms) */
const YIELD_CHECK_INTERVAL_MS = 100;

/**
 * Check whether the VS Code editor has requested this handler to yield.
 * Uses the proposed `ChatContext.yieldRequested` API (runtime feature detection).
 * When the user sends a new message while the agent is still working, VS Code
 * sets yieldRequested=true on the previous request's context so the handler
 * can exit gracefully and let the steering (new) request take over.
 */
function isYieldRequested(context: vscode.ChatContext): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (context as any).yieldRequested === true;
}

/**
 * Returns true if the request should stop — either via CancellationToken or yield.
 */
function shouldStop(
  token: vscode.CancellationToken,
  context?: vscode.ChatContext,
): boolean {
  if (token.isCancellationRequested) {
    return true;
  }
  return context ? isYieldRequested(context) : false;
}

// Handler imports — extracted from this file for DoD monolith breakup
import { IAlexChatResult } from "./participantTypes";
export type { IAlexChatResult } from "./participantTypes";
import {
  handleMeditateCommand,
  handleDreamCommand,
  handleBrainQACommand,
  handleLearnCommand,
  handleStatusCommand,
  handleModelCommand,
  handleAzureCommand,
  handleM365Command,
  handleProfileCommand,
} from "./handlers/coreHandlers";
import {
  isGreeting,
  isStartOfSession,
  handleGreetingWithSelfActualization,
  handleSelfActualizeCommand,
  handleKnowledgeCommand,
  handleSaveInsightCommand,
  handlePromoteCommand,
  handleKnowledgeStatusCommand,
  handleDocsCommand,
  handleHelpCommand,
  handleForgetCommand,
  handleConfidenceCommand,
  handleCreativeCommand,
  handleVerifyCommand,
} from "./handlers/workflowHandlers";

// ============================================================================
// UNCONSCIOUS MIND: AUTO-INSIGHT DETECTION
// ============================================================================
// Note: Core detection logic moved to autoInsights.ts for reusability

/**
 * Patterns that indicate valuable learnings in conversation
 * NOTE: These are strings to avoid regex state leakage with /g flag
 * Create new RegExp instances per call to prevent lastIndex issues
 */
const INSIGHT_PATTERN_STRINGS = [
  "(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)",
  "(?:this works because|the reason is|what fixed it|solved by|resolved by)",
  "(?:always remember to|never forget to|make sure to|be careful to)",
  "(?:debugging tip|performance tip|security tip)",
];

/**
 * Get fresh regex instances for insight detection
 * Avoids state leakage from lastIndex in global regexes
 */
function getInsightPatterns(): RegExp[] {
  return INSIGHT_PATTERN_STRINGS.map((p) => new RegExp(p, "i"));
}

/**
 * Keywords that suggest valuable domain knowledge
 */
const DOMAIN_KEYWORDS = [
  "pattern",
  "anti-pattern",
  "best practice",
  "gotcha",
  "pitfall",
  "workaround",
  "solution",
  "fix",
  "resolved",
  "debugging",
  "performance",
  "optimization",
  "security",
  "architecture",
];

/**
 * Analyze text for potential insights worth saving (legacy inline detection)
 * Returns insight data if valuable learning detected, null otherwise
 */
function detectPotentialInsight(text: string): {
  detected: boolean;
  confidence: number;
  keywords: string[];
} {
  const lowerText = text.toLowerCase();

  // Check for insight patterns (fresh instances to avoid regex state leakage)
  let patternMatches = 0;
  for (const pattern of getInsightPatterns()) {
    if (pattern.test(text)) {
      patternMatches++;
    }
  }

  // Check for domain keywords
  const foundKeywords: string[] = [];
  for (const keyword of DOMAIN_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  // Calculate confidence score
  const confidence = patternMatches * 0.3 + foundKeywords.length * 0.1;

  return {
    detected: confidence >= 0.3 || patternMatches >= 1,
    confidence: Math.min(confidence, 1.0),
    keywords: foundKeywords,
  };
}

/**
 * Auto-save a detected insight in the background
 */
async function autoSaveInsight(
  content: string,
  keywords: string[],
  sourceProject?: string,
): Promise<void> {
  try {
    // Extract a title from the first sentence or use generic
    const firstSentence = content.split(/[.!?]/)[0].trim();
    const title =
      firstSentence.length > 10 && firstSentence.length < 100
        ? firstSentence
        : `Auto-captured insight - ${new Date().toISOString().split("T")[0]}`;

    // Determine category from keywords
    let category: GlobalKnowledgeCategory = "general";
    if (keywords.includes("debugging")) {
      category = "debugging";
    } else if (
      keywords.includes("performance") ||
      keywords.includes("optimization")
    ) {
      category = "performance";
    } else if (keywords.includes("security")) {
      category = "security";
    } else if (keywords.includes("architecture")) {
      category = "architecture";
    } else if (
      keywords.includes("pattern") ||
      keywords.includes("anti-pattern")
    ) {
      category = "patterns";
    }

    await createGlobalInsight(
      title,
      content,
      category,
      keywords,
      sourceProject,
      "Auto-detected from conversation",
      content,
    );

    logInfo(`[Unconscious] Auto-saved insight: ${title}`);
  } catch (err) {
    console.warn("[Unconscious] Failed to auto-save insight:", err);
  }
}

/**
 * Track conversation for potential insights (called during general queries)
 * Now integrates with enhanced autoInsights module
 */
let conversationBuffer: string[] = [];
const MAX_BUFFER_SIZE = 5;

function trackConversationForInsights(
  userMessage: string,
  sourceProject?: string,
): void {
  // Add to buffer
  conversationBuffer.push(userMessage);
  if (conversationBuffer.length > MAX_BUFFER_SIZE) {
    conversationBuffer.shift();
  }

  // Check if auto-insights is enabled
  const config = getAutoInsightsConfig();
  if (!config.enabled) {
    return;
  }

  // Analyze the combined recent context
  const combinedContext = conversationBuffer.join("\n\n");

  // Use the enhanced auto-insights module (non-blocking)
  processForInsights(combinedContext).catch((err) => {
    console.warn("[Unconscious] Auto-insight processing failed:", err);
  });

  // Legacy inline detection for high-confidence immediate saves
  const analysis = detectPotentialInsight(combinedContext);
  if (analysis.detected && analysis.confidence >= 0.7) {
    // Very high confidence - auto-save immediately
    autoSaveInsight(userMessage, analysis.keywords, sourceProject);
    // Clear buffer to avoid duplicate saves
    conversationBuffer = [];
  }
}

// ============================================================================
// UNCONSCIOUS MIND: EMOTIONAL INTELLIGENCE
// ============================================================================

/**
 * Patterns indicating user frustration or struggle
 */
const FRUSTRATION_PATTERNS = [
  /(?:still (?:not working|broken|failing|doesn't work)|keeps? (?:failing|breaking|crashing))/i,
  /(?:tried everything|nothing works|no idea|completely lost|so confused)/i,
  /(?:why (?:won't|doesn't|isn't)|what am i (?:doing wrong|missing))/i,
  /(?:ugh|argh|damn|dammit|frustrated|annoying|annoyed|stuck)/i,
  /(?:this is (?:impossible|ridiculous|insane|driving me crazy))/i,
  /(?:been (?:at this|trying|working on this) for (?:hours|days|forever))/i,
  /(?:same (?:error|problem|issue) (?:again|still))/i,
  /(?:!{2,}|\?{3,})/, // Multiple exclamation or question marks
];

/**
 * Patterns indicating user success or progress
 */
const SUCCESS_PATTERNS = [
  /(?:it works|finally|got it|figured it out|solved it|fixed it)/i,
  /(?:that (?:worked|fixed it|did it)|now it (?:works|runs))/i,
  /(?:thank(?:s| you)|perfect|awesome|great|amazing|brilliant)/i,
  /(?:makes sense now|i understand|clicked for me)/i,
  /(?:shipped|deployed|released|launched|published)/i,
  /(?:passed|all (?:tests|green)|build succeeded)/i,
];

/**
 * Track frustration level across conversation
 */
let frustrationLevel = 0;
let lastFrustrationCheck = 0;
const FRUSTRATION_DECAY_MS = 300000; // 5 minutes

/**
 * Reset session state - call when chat participant is deactivated or on new session
 * Prevents state bleeding between sessions
 */
export function resetSessionState(): void {
  frustrationLevel = 0;
  lastFrustrationCheck = 0;
  conversationBuffer = [];
  resetEmotionalState(); // v5.9.3: Reset emotional memory tracking
}

/**
 * Emotional state analysis result
 */
export interface EmotionalState {
  frustration: "none" | "mild" | "moderate" | "high";
  success: boolean;
  encouragementNeeded: boolean;
  celebrationNeeded: boolean;
}

/**
 * Analyze message for emotional signals
 * UNCONSCIOUS BEHAVIOR: Runs automatically on every message
 */
export function detectEmotionalState(message: string): EmotionalState {
  const now = Date.now();

  // Decay frustration over time
  if (now - lastFrustrationCheck > FRUSTRATION_DECAY_MS) {
    frustrationLevel = Math.max(0, frustrationLevel - 1);
  }
  lastFrustrationCheck = now;

  // Check for frustration signals
  let frustrationSignals = 0;
  for (const pattern of FRUSTRATION_PATTERNS) {
    if (pattern.test(message)) {
      frustrationSignals++;
    }
  }

  // Check for success signals
  let successSignals = 0;
  for (const pattern of SUCCESS_PATTERNS) {
    if (pattern.test(message)) {
      successSignals++;
    }
  }

  // Update frustration level
  if (frustrationSignals > 0) {
    frustrationLevel = Math.min(3, frustrationLevel + frustrationSignals);
  }
  if (successSignals > 0) {
    frustrationLevel = Math.max(0, frustrationLevel - 2); // Success reduces frustration
  }

  // Determine emotional state
  let frustration: EmotionalState["frustration"] = "none";
  if (frustrationLevel >= 3) {
    frustration = "high";
  } else if (frustrationLevel >= 2) {
    frustration = "moderate";
  } else if (frustrationLevel >= 1) {
    frustration = "mild";
  }

  return {
    frustration,
    success: successSignals > 0,
    encouragementNeeded: frustration === "moderate" || frustration === "high",
    celebrationNeeded:
      successSignals >= 2 || (successSignals > 0 && frustrationLevel > 0),
  };
}

/**
 * Generate contextual encouragement based on emotional state
 */
export function generateEncouragement(state: EmotionalState): string | null {
  if (state.celebrationNeeded) {
    const celebrations = [
      "🎉 That's a win! Nice work.",
      "✨ You got it! Persistence pays off.",
      "💪 Solved! That was a tricky one.",
      "🚀 Success! You worked through it.",
    ];
    return celebrations[Math.floor(Math.random() * celebrations.length)];
  }

  if (state.encouragementNeeded) {
    const encouragements = [
      "I can see this is frustrating. Let's take a step back and approach it differently.",
      "Tough problem. What if we break it down into smaller pieces?",
      "You're closer than it feels. What's the last thing that *did* work?",
      "Debugging is hard. Let's be systematic - what have we ruled out?",
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  return null;
}

/**
 * Alex Chat Participant Handler
 * Provides conversational interface for Alex cognitive architecture
 */
export const alexChatHandler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<IAlexChatResult> => {
  // v5.9.3: Update avatar SYNCHRONOUSLY before any response streaming.
  // Must happen before stream.markdown() to ensure VS Code captures the correct icon.
  // Priority: slash command state > message-detected state > current state
  const commandStateMap: Record<string, string> = {
    meditate: "meditation",
    dream: "dream",
    selfactualize: "meditation",
    brainqa: "reviewing",
    learn: "learning",
    confidence: "planning",
    verify: "reviewing",
    creative: "discovery",
  };

  const commandState = request.command
    ? commandStateMap[request.command]
    : null;
  const messageState = commandState ?? detectCognitiveState(request.prompt);

  if (messageState) {
    // Notify welcomeView so sidebar cognitive state stays in sync
    vscode.commands.executeCommand("alex.setCognitiveState", messageState);
  }

  // v6.2.0: Track agent activity for live feed (Contract A)
  const commandAgentMap: Record<string, string> = {
    azure: "Azure",
    m365: "M365",
    dream: "Alex",
    meditate: "Alex",
    selfactualize: "Alex",
    brainqa: "Validator",
    learn: "Researcher",
    creative: "Alex",
    verify: "Validator",
  };
  const activityAgent = request.command
    ? commandAgentMap[request.command] || "Alex"
    : "Alex";
  const activityId = agentActivity.start(
    activityAgent,
    request.command || "general",
    request.prompt,
  );

  try {
    // C5: Yield-aware execution — race the handler against yieldRequested polling
    const result = await raceWithYield(context, token, async () => {
      return await handleAlexRequest(request, context, stream, token);
    });
    return result;
  } catch (err) {
    agentActivity.complete(activityId, true);
    throw err;
  } finally {
    agentActivity.complete(activityId);
  }
};

/**
 * C5: Race the handler against yieldRequested polling.
 * When the proposed API is available and the user sends a steering message,
 * the handler resolves early so VS Code can dispatch the new request.
 */
async function raceWithYield(
  context: vscode.ChatContext,
  token: vscode.CancellationToken,
  handler: () => Promise<IAlexChatResult>,
): Promise<IAlexChatResult> {
  // If the proposed API isn't available, run the handler directly
  if (!("yieldRequested" in context)) {
    return handler();
  }

  const handledPromise = handler();
  const yieldPromise = new Promise<IAlexChatResult>((resolve) => {
    const interval = setInterval(() => {
      if (isYieldRequested(context) || token.isCancellationRequested) {
        clearInterval(interval);
        resolve({ metadata: { command: "general", action: "yielded" } });
      }
    }, YIELD_CHECK_INTERVAL_MS);

    // Clean up interval when handler completes naturally
    handledPromise.finally(() => clearInterval(interval));
  });

  return Promise.race([handledPromise, yieldPromise]);
}

/**
 * Core request dispatch — extracted from alexChatHandler for C5 yield wrapping.
 */
async function handleAlexRequest(
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<IAlexChatResult> {
  // Handle slash commands
  if (request.command === "meditate") {
    return await handleMeditateCommand(request, context, stream, token);
  }

  if (request.command === "dream") {
    return await handleDreamCommand(request, context, stream, token);
  }

  if (request.command === "learn") {
    return await handleLearnCommand(request, context, stream, token);
  }

  if (request.command === "status") {
    return await handleStatusCommand(request, context, stream, token);
  }

  if (request.command === "model") {
    return await handleModelCommand(request, context, stream, token);
  }

  if (request.command === "azure") {
    return await handleAzureCommand(request, context, stream, token);
  }

  if (request.command === "m365") {
    return await handleM365Command(request, context, stream, token);
  }

  if (request.command === "profile") {
    return await handleProfileCommand(request, context, stream, token);
  }

  if (request.command === "selfactualize") {
    return await handleSelfActualizeCommand(request, context, stream, token);
  }

  if (request.command === "brainqa") {
    return await handleBrainQACommand(request, context, stream, token);
  }

  // Global Knowledge commands
  if (request.command === "knowledge") {
    return await handleKnowledgeCommand(request, context, stream, token);
  }

  if (request.command === "saveinsight") {
    return await handleSaveInsightCommand(request, context, stream, token);
  }

  if (request.command === "promote") {
    return await handlePromoteCommand(request, context, stream, token);
  }

  if (request.command === "knowledgestatus") {
    return await handleKnowledgeStatusCommand(request, context, stream, token);
  }

  // Documentation command
  if (request.command === "docs") {
    return await handleDocsCommand(request, context, stream, token);
  }

  // Help command - discoverability
  if (request.command === "help") {
    return await handleHelpCommand(request, context, stream, token);
  }

  // Forget command - selective memory cleanup
  if (request.command === "forget") {
    return await handleForgetCommand(request, context, stream, token);
  }

  // Confidence command - epistemic integrity
  if (request.command === "confidence") {
    return await handleConfidenceCommand(request, context, stream, token);
  }

  // Creative mode command - brainstorming/ideation
  if (request.command === "creative") {
    return await handleCreativeCommand(request, context, stream, token);
  }

  // Verify command - multi-turn verification for high-stakes decisions
  if (request.command === "verify") {
    return await handleVerifyCommand(request, context, stream, token);
  }

  // Check if this is a greeting at the start of a session
  if (isGreeting(request.prompt) && isStartOfSession(context)) {
    return await handleGreetingWithSelfActualization(
      request,
      context,
      stream,
      token,
    );
  }

  // Default: Use the language model with Alex's personality
  return await handleGeneralQuery(request, context, stream, token);
}

// === HELPER FUNCTIONS FOR handleGeneralQuery (NASA R4 extraction) ===

interface UnconsciousMindContext {
  emotionalState: ReturnType<typeof detectEmotionalState>;
  encouragement: string | null;
  lastSignal: ReturnType<typeof recordEmotionalSignal>;
  riverStatus: ReturnType<typeof assessRiverOfIntegration>;
  windowStatus: ReturnType<typeof assessWindowOfTolerance>;
  lidFlipped: boolean;
}

/**
 * Gather unconscious mind context: emotional state, Siegel integration, and encouragement
 */
function gatherUnconsciousMindContext(
  prompt: string,
  sourceProject?: string,
): UnconsciousMindContext {
  trackConversationForInsights(prompt, sourceProject);

  const emotionalState = detectEmotionalState(prompt);
  const encouragement = generateEncouragement(emotionalState);

  const frustrationNum =
    emotionalState.frustration === "high"
      ? 3
      : emotionalState.frustration === "moderate"
        ? 2
        : emotionalState.frustration === "mild"
          ? 1
          : 0;
  const lastSignal = recordEmotionalSignal(
    prompt,
    frustrationNum,
    emotionalState.success,
  );

  const riverStatus = assessRiverOfIntegration();
  const windowStatus = assessWindowOfTolerance();
  const lidFlipped = checkLidFlipped();

  return {
    emotionalState,
    encouragement,
    lastSignal,
    riverStatus,
    windowStatus,
    lidFlipped,
  };
}

/**
 * Build model-tier specific reasoning guidance
 */
function buildReasoningGuidance(
  modelTier: string,
  tierInfo: { displayName: string },
): string {
  if (modelTier === "frontier") {
    return `\n\n## Model Capability
You're running on a ${tierInfo.displayName} model with deep reasoning capabilities. Feel free to:
- Think through complex problems step-by-step
- Explore multiple solution paths
- Provide thorough explanations with nuance
- Handle large context windows effectively`;
  } else if (modelTier === "capable") {
    return `\n\n## Model Capability  
You're running on a ${tierInfo.displayName} model. Provide:
- Clear, well-structured responses
- Balanced depth without overwhelming detail
- Practical solutions over theoretical exploration`;
  } else if (modelTier === "efficient") {
    return `\n\n## Model Capability
You're running on a ${tierInfo.displayName} model optimized for speed. Focus on:
- Concise, actionable answers
- Direct solutions without extensive exploration
- Efficient responses that get to the point quickly`;
  }
  return "";
}

/**
 * Build file context from request references and active editor
 */
async function buildFileContextFromReferences(
  request: vscode.ChatRequest,
): Promise<string> {
  let fileContext = "";

  if (request.references.length > 0) {
    fileContext = "\n\n## Referenced Files\n";
    for (const ref of request.references) {
      if (ref.value instanceof vscode.Uri) {
        const filePath = ref.value.fsPath;
        const fileName = path.basename(filePath);

        try {
          const content = await vscode.workspace.fs.readFile(ref.value);
          const text = Buffer.from(content).toString("utf8");
          fileContext += `\n### ${fileName}\n\`\`\`\n${text.slice(0, 5000)}\n\`\`\`\n`;
        } catch (err) {
          fileContext += `\n### ${fileName}\n_(Could not read file)_\n`;
        }
      } else if (
        typeof ref.value === "object" &&
        ref.value !== null &&
        "text" in ref.value
      ) {
        fileContext += `\n### Selected Text\n\`\`\`\n${(ref.value as { text: string }).text}\n\`\`\`\n`;
      }
    }
  }

  // Include active editor selection if no references provided
  const editor = vscode.window.activeTextEditor;
  if (editor && !editor.selection.isEmpty && request.references.length === 0) {
    const selection = editor.document.getText(editor.selection);
    if (selection) {
      fileContext += "\n\n## Active Editor Selection\n";
      fileContext += `From: ${path.basename(editor.document.fileName)}\n\`\`\`\n${selection}\n\`\`\`\n`;
    }
  }

  return fileContext;
}

/**
 * Get available Alex cognitive tools for model requests
 */
function getAlexCognitiveTools(): vscode.LanguageModelChatTool[] {
  const toolNames = [
    "alex_cognitive_synapse_health",
    "alex_cognitive_memory_search",
    "alex_cognitive_architecture_status",
    "alex_platform_mcp_recommendations",
    "alex_cognitive_user_profile",
    "alex_cognitive_self_actualization",
    "alex_quality_heir_validation",
    "alex_knowledge_search",
    "alex_knowledge_save_insight",
    "alex_knowledge_promote",
    "alex_knowledge_status",
  ];
  return toolNames
    .map((name) => vscode.lm.tools.find((t) => t.name === name)!)
    .filter((t) => t !== undefined);
}

/**
 * Execute model request with tool loop - streams response and handles tool calls
 * Returns the collected response text for post-processing
 */
async function executeModelWithTools(
  model: vscode.LanguageModelChat,
  messages: vscode.LanguageModelChatMessage[],
  alexTools: vscode.LanguageModelChatTool[],
  stream: vscode.ChatResponseStream,
  request: vscode.ChatRequest,
  token: vscode.CancellationToken,
  context?: vscode.ChatContext,
): Promise<string> {
  const toolCallResults: vscode.LanguageModelToolCallPart[] = [];
  let collectedResponse = "";
  sessionTrace.modelRequest("Alex", model.id);
  let response = await model.sendRequest(messages, { tools: alexTools }, token);

  // Iterate through stream and collect tool calls
  for await (const part of response.stream) {
    if (part instanceof vscode.LanguageModelTextPart) {
      stream.markdown(part.value);
      collectedResponse += part.value;
    } else if (part instanceof vscode.LanguageModelToolCallPart) {
      toolCallResults.push(part);
    }
  }

  // If there were tool calls, execute them and send results back
  if (toolCallResults.length > 0) {
    const toolResultMessages: vscode.LanguageModelChatMessage[] = [...messages];

    for (const toolCall of toolCallResults) {
      // C5: Check for cancellation/yield between tool calls
      if (shouldStop(token, context)) {
        break;
      }
      try {
        sessionTrace.toolCall("Alex", toolCall.name, true);
        const toolResult = await vscode.lm.invokeTool(
          toolCall.name,
          {
            input: toolCall.input,
            toolInvocationToken: request.toolInvocationToken,
          },
          token,
        );

        const resultPart = new vscode.LanguageModelToolResultPart(
          toolCall.callId,
          toolResult.content,
        );
        toolResultMessages.push(
          vscode.LanguageModelChatMessage.Assistant([toolCall]),
          vscode.LanguageModelChatMessage.User([resultPart]),
        );
      } catch (err) {
        sessionTrace.toolCall("Alex", toolCall.name, false);
        console.error(`[Alex] Tool ${toolCall.name} failed:`, err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        const errorPart = new vscode.LanguageModelToolResultPart(
          toolCall.callId,
          [new vscode.LanguageModelTextPart(`Error: ${errorMessage}`)],
        );
        toolResultMessages.push(
          vscode.LanguageModelChatMessage.Assistant([toolCall]),
          vscode.LanguageModelChatMessage.User([errorPart]),
        );
      }
    }

    // Send updated messages with tool results back to model
    if (toolResultMessages.length > messages.length) {
      response = await model.sendRequest(
        toolResultMessages,
        { tools: alexTools },
        token,
      );

      for await (const part of response.stream) {
        if (part instanceof vscode.LanguageModelTextPart) {
          stream.markdown(part.value);
          collectedResponse += part.value;
        }
      }
    }
  }

  return collectedResponse;
}

/**
 * Handle general queries using the language model
 * NASA R5: Runtime assertions for input validation
 */
async function handleGeneralQuery(
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<IAlexChatResult> {
  // NASA R5: Validate required inputs
  assertDefined(request, "ChatRequest is required");
  assertDefined(stream, "ChatResponseStream is required");
  assertDefined(token, "CancellationToken is required");

  // v5.9.3: Cognitive state detection and avatar update now handled in alexChatHandler
  // before dispatch to prevent race condition with async executeCommand

  // === UNCONSCIOUS MIND: Gather emotional/integration context ===
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const sourceProject = workspaceFolders
    ? path.basename(workspaceFolders[0].uri.fsPath)
    : undefined;
  const unconsciousCtx = gatherUnconsciousMindContext(
    request.prompt,
    sourceProject,
  );
  const {
    emotionalState,
    encouragement,
    lastSignal,
    riverStatus,
    windowStatus,
    lidFlipped,
  } = unconsciousCtx;

  // Get user profile for personalization
  const profile = await getUserProfile();

  // v5.8.0: Build modular prompt using prompt engine
  const workspaceRoot = workspaceFolders?.[0]?.uri.fsPath || "";
  const detectModelInfo = getModelInfo(request);

  // v5.9.4 + v5.9.5: Gather peripheral vision and knowledge coverage concurrently
  const [peripheral, coverage] = await Promise.all([
    gatherPeripheralContext(workspaceRoot),
    scoreKnowledgeCoverage(request.prompt, workspaceRoot),
  ]);

  // Transform EmotionalState to PromptContext.emotionalState shape
  const emotionalContext = emotionalState
    ? {
        isPositive: emotionalState.success || emotionalState.celebrationNeeded,
        isFrustrated: emotionalState.frustration !== "none",
        isConfused: lastSignal.confusion, // v5.9.3: now read from actual signal
        isExcited: emotionalState.celebrationNeeded || lastSignal.excitement,
        // Siegel session health
        riverZone: riverStatus.zone,
        riverWarning: riverStatus.warning,
        windowZone: windowStatus.zone,
        windowAdaptation: windowStatus.adaptation,
        isLidFlipped: lidFlipped,
      }
    : undefined;

  const promptContext: PromptContext = {
    workspaceRoot,
    profile,
    emotionalState: emotionalContext,
    model: detectModelInfo,
    history: context.history,
    request,
    peripheral, // v5.9.4: ambient workspace + peer project awareness
    coverage, // v5.9.5: knowledge coverage / honest uncertainty calibration
    expertiseHint: getSystemPromptHint(classifyDomain(request.prompt)), // v6.0.0: expertise calibration
  };

  const alexSystemPrompt = await buildAlexSystemPrompt(promptContext);

  try {
    // v5.8.1: Model-adaptive behavior - Select best available model, not hardcoded gpt-4o
    const models = await vscode.lm.selectChatModels({ vendor: "copilot" });

    if (models.length === 0) {
      const greeting = formatPersonalizedGreeting(profile);
      stream.markdown(`${greeting}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`);
      return { metadata: { command: "general", action: "no-model" } };
    }

    const model = models[0];
    const modelTier = detectModelTier(model);
    const tierInfo = getTierInfo(modelTier);

    // v5.9.10: Record model tier usage for /model advisor insights
    if (workspaceRoot) {
      recordModelUsage(workspaceRoot, modelTier).catch(() => {
        /* fire-and-forget */
      });
    }

    // v5.8.1: Model-adaptive prompt rules (NASA R4 extracted)
    const reasoningGuidance = buildReasoningGuidance(modelTier, tierInfo);

    // v5.8.1: File context from references (NASA R4 extracted)
    const fileContext = await buildFileContextFromReferences(request);

    // Build messages for the language model
    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(
        alexSystemPrompt + reasoningGuidance + fileContext,
      ),
      vscode.LanguageModelChatMessage.User(request.prompt),
    ];

    // v5.8.1: Tool calling - Pass Alex cognitive tools to @alex (NASA R4 extracted)
    const alexTools = getAlexCognitiveTools();

    // v5.8.1: Execute model with tool loop (NASA R4 extracted)
    let collectedResponse = await executeModelWithTools(
      model,
      messages,
      alexTools,
      stream,
      request,
      token,
      context,
    );

    // === UNCONSCIOUS MIND: Add encouragement if emotional state warrants it ===
    if (encouragement) {
      stream.markdown(`\n\n---\n*${encouragement}*`);
      collectedResponse += ` ${encouragement}`;
    }

    // Voice Mode: Read response aloud if enabled (fire and forget)
    speakIfVoiceModeEnabled(collectedResponse).catch(() => {});

    // v6.0.0: Episodic memory + expertise model — fire-and-forget background updates
    appendToEpisodicDraft(
      request.prompt,
      peripheral?.fileWatcherObservations?.stalledFiles ?? [],
      workspaceRoot,
    ).catch(() => {});
    recordInteraction(request.prompt).catch(() => {});
  } catch (err) {
    if (err instanceof vscode.LanguageModelError) {
      console.error("Language model error:", err.message, err.code);
      stream.markdown(`I encountered an issue accessing the language model. You can still use my commands:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance  
- **\`/learn [topic]\`** - Domain acquisition
- **\`/status\`** - Architecture status`);
    } else {
      throw err;
    }
  }

  return {
    metadata: {
      command: "general",
      coverageLevel: coverage?.level,
      coverageTopic: coverage
        ? [
            ...request.prompt
              .toLowerCase()
              .split(/\W+/)
              .filter((w) => w.length > 3),
          ]
            .slice(0, 4)
            .join(" ")
        : undefined,
    },
  };
}

/**
 * Follow-up provider for Alex chat participant
 */
export const alexFollowupProvider: vscode.ChatFollowupProvider = {
  provideFollowups(
    result: IAlexChatResult,
    _context: vscode.ChatContext,
    _token: vscode.CancellationToken,
  ): vscode.ChatFollowup[] {
    const followups: vscode.ChatFollowup[] = [];

    if (result.metadata.command === "meditate") {
      followups.push(
        {
          prompt: "What insights should I consolidate from our session?",
          label: "💡 Identify insights",
        },
        {
          prompt: "Create a new domain knowledge file",
          label: "📄 Create DK file",
        },
      );
    }

    if (result.metadata.command === "dream") {
      followups.push(
        {
          prompt: "Show me the synapse health report",
          label: "📊 View health report",
        },
        {
          prompt: "What connections need strengthening?",
          label: "🔗 Check connections",
        },
      );
    }

    if (result.metadata.command === "learn") {
      followups.push(
        {
          prompt: "What are the core concepts I should understand first?",
          label: "🎯 Core concepts",
        },
        {
          prompt: "How does this relate to what I already know?",
          label: "🔄 Find connections",
        },
      );
    }

    if (result.metadata.command === "azure") {
      followups.push(
        {
          prompt: "Show me Azure best practices for this scenario",
          label: "✨ Best practices",
        },
        {
          prompt: "Generate the infrastructure code",
          label: "🏗️ Generate IaC",
        },
      );
    }

    if (result.metadata.command === "m365") {
      followups.push(
        {
          prompt: "Show me code samples for this scenario",
          label: "💻 Code samples",
        },
        { prompt: "What schema do I need?", label: "📋 Get schema" },
      );
    }

    if (result.metadata.command === "profile") {
      if (result.metadata.action === "onboarding") {
        followups.push(
          {
            prompt: "I prefer casual conversation with detailed explanations",
            label: "💬 Casual & detailed",
          },
          {
            prompt: "I prefer formal, concise communication",
            label: "📋 Formal & brief",
          },
          {
            prompt: "I work with TypeScript, React, and Azure",
            label: "🛠️ Set technologies",
          },
        );
      } else {
        followups.push({
          prompt: "Update my communication preferences",
          label: "✏️ Edit preferences",
        });
      }
    }

    if (result.metadata.command === "selfactualize") {
      followups.push(
        { prompt: "/dream", label: "🌙 Run Dream Protocol" },
        { prompt: "/meditate", label: "🧘 Deep Meditation" },
      );
    }

    // Global Knowledge followups
    if (result.metadata.command === "knowledge") {
      followups.push(
        { prompt: "/saveinsight", label: "💡 Save new insight" },
        { prompt: "/knowledgestatus", label: "📊 View knowledge status" },
      );
    }

    if (result.metadata.command === "saveinsight") {
      followups.push(
        { prompt: "/knowledge", label: "🔍 Search knowledge" },
        { prompt: "/knowledgestatus", label: "📊 View status" },
      );
    }

    if (result.metadata.command === "promote") {
      followups.push(
        { prompt: "/knowledgestatus", label: "📊 View status" },
        { prompt: "/knowledge", label: "🔍 Search promoted" },
      );
    }

    if (result.metadata.command === "knowledgestatus") {
      followups.push(
        { prompt: "/knowledge error handling", label: "🔍 Search knowledge" },
        { prompt: "/saveinsight", label: "💡 Add insight" },
        { prompt: "/promote", label: "⬆️ Promote file" },
      );
    }

    if (result.metadata.command === "greeting") {
      followups.push(
        { prompt: "/learn", label: "📚 Learn something new" },
        { prompt: "/azure", label: "☁️ Azure development" },
        { prompt: "/m365", label: "📱 M365 development" },
        { prompt: "/knowledge", label: "🌐 Global knowledge" },
      );
    }

    if (result.metadata.command === "general") {
      // v5.9.7: Surface knowledge gap when coverage was low/uncertain
      if (
        result.metadata.coverageLevel === "low" ||
        result.metadata.coverageLevel === "uncertain"
      ) {
        followups.push(
          { prompt: "/saveinsight", label: "💡 Save this as a new insight" },
          {
            prompt: `/knowledge ${result.metadata.coverageTopic ?? ""}`.trim(),
            label: "🔍 Search existing knowledge",
          },
        );
      }

      // v7.1.0: Persona-driven follow-ups based on conversation content
      const topic = (result.metadata.coverageTopic ?? "").toLowerCase();
      const hasCode =
        /code|function|class|api|endpoint|implement|bug|error|debug/.test(
          topic,
        );
      const hasArch = /architect|design|pattern|structure|system/.test(topic);
      const hasLearn = /learn|understand|explain|how.*work|what.*is/.test(
        topic,
      );

      if (hasCode) {
        followups.push(
          { prompt: "/verify", label: "🔍 Verify this approach" },
          { prompt: "Can you review this code?", label: "📋 Code review" },
        );
      } else if (hasArch) {
        followups.push(
          { prompt: "/status", label: "📊 Architecture status" },
          {
            prompt: "What are the trade-offs?",
            label: "⚖️ Analyze trade-offs",
          },
        );
      } else if (hasLearn) {
        followups.push(
          { prompt: "Can you go deeper on this?", label: "🔬 Go deeper" },
          { prompt: "/learn", label: "📚 Start learning session" },
        );
      } else {
        followups.push(
          { prompt: "/profile", label: "👤 View/setup profile" },
          { prompt: "/learn something new", label: "📚 Start learning" },
        );
      }
    }

    // Context-aware followups based on response content
    if (!result.metadata.command || result.metadata.command === "chat") {
      // Add contextual followups based on what was discussed
      followups.push(
        {
          prompt: "Can you explain that in more detail?",
          label: "🔍 More detail",
        },
        { prompt: "What should I do next?", label: "➡️ Next steps" },
      );
    }

    // Always offer these general followups (but only if we have few)
    if (followups.length < 3) {
      followups.push({
        prompt: "What can you help me with?",
        label: "❓ Show capabilities",
      });
    }

    return followups;
  },
};

/**
 * Module-level reference to the chat participant.
 */
// intentionally kept for future reuse; eslint-disable-next-line @typescript-eslint/no-unused-vars
// Participant lifecycle caching handled internally; no static cache required at this time.

/**
 * Register the Alex chat participant with dynamic avatar support.
 * v5.9.1: Avatar updates based on cognitive state, agent mode, and persona.
 */
export function registerChatParticipant(
  context: vscode.ExtensionContext,
): vscode.ChatParticipant {
  const alex = vscode.chat.createChatParticipant(
    "alex.cognitive",
    alexChatHandler,
  );

  // Participant cached via VS Code chat participant registry; no static cache needed

  // Set static default rocket icon (avatar system removed in v6.5.0)
  alex.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "assets",
    "avatars",
    "rocket-icons",
    "default",
    "default.svg",
  );

  alex.followupProvider = alexFollowupProvider;

  // Handle feedback for telemetry + calibration correlation
  alex.onDidReceiveFeedback((feedback: vscode.ChatResultFeedback) => {
    const helpful = feedback.kind === vscode.ChatResultFeedbackKind.Helpful;
    logInfo("Alex received feedback: " + (helpful ? "helpful" : "unhelpful"));

    // v5.9.7: Correlate 👍/👎 with epistemic accuracy
    const meta = (feedback.result as IAlexChatResult).metadata;
    const level = meta?.coverageLevel as
      | import("./honestUncertainty").ConfidenceLevel
      | undefined;
    const topic =
      typeof meta?.coverageTopic === "string" ? meta.coverageTopic : "general";
    if (level) {
      const workspaceRoot =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      recordCalibrationFeedback(workspaceRoot, topic, level, helpful).catch(
        () => {},
      );
    }
  });

  context.subscriptions.push(alex);

  return alex;
}
