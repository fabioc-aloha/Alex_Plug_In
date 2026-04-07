/**
 * Prompt Variant Registry - v7.1.0
 *
 * Maps model families to prompt customization surfaces. Replaces the simple
 * tier-based if/else in buildModelAdaptiveLayer with a registry pattern that
 * adapts Alex's behavior per-model family.
 *
 * Inspired by Copilot Chat's PromptRegistry which selects different system
 * prompt variants, verbosity levels, and tool preferences per model.
 *
 * Customization surfaces:
 *   - communicationStyle: verbose/balanced/concise
 *   - identityDepth: full/standard/minimal
 *   - safetyVerbosity: full/lean
 *   - editToolHints: model-specific guidance for file editing
 *   - layerBudget: which prompt layers to include
 *   - maxHistoryTurns: conversation history depth
 */

import { ModelTier } from "./modelIntelligence";

// ============================================================================
// Types
// ============================================================================

export type CommunicationStyle = "verbose" | "balanced" | "concise";
export type IdentityDepth = "full" | "standard" | "minimal";
export type SafetyVerbosity = "full" | "lean";

/** Model family identifier derived from the model's name/family string */
export type ModelFamily =
  | "claude-opus"
  | "claude-sonnet"
  | "claude-haiku"
  | "gpt-frontier"
  | "gpt-capable"
  | "gpt-efficient"
  | "gemini-pro"
  | "gemini-flash"
  | "o-series"
  | "unknown";

/**
 * Per-layer inclusion flags. Layers not listed default to true.
 * Maps to the layer names in promptEngine.ts.
 */
export interface LayerBudget {
  identity: boolean; // Layer 1
  activeContext: boolean; // Layer 2
  conversationHistory: boolean; // Layer 3
  userProfile: boolean; // Layer 4
  emotionalMemory: boolean; // Layer 5
  peripheralVision: boolean; // Layer 8
  knowledgeContext: boolean; // Layer 9
  modelAdaptive: boolean; // Layer 7
  expertise: boolean; // Layer 10b
  responseGuidelines: boolean; // Layer 10
  honestUncertainty: boolean; // Layer 11
  browserContext: boolean; // Layer 12 (v7.2.0)
}

export interface PromptVariant {
  family: ModelFamily;
  communicationStyle: CommunicationStyle;
  identityDepth: IdentityDepth;
  safetyVerbosity: SafetyVerbosity;
  editToolHints: string;
  layerBudget: LayerBudget;
  maxHistoryTurns: number;
  systemPromptGuidance: string;
}

// ============================================================================
// Layer Budget Presets
// ============================================================================

const FULL_LAYERS: LayerBudget = {
  identity: true,
  activeContext: true,
  conversationHistory: true,
  userProfile: true,
  emotionalMemory: true,
  peripheralVision: true,
  knowledgeContext: true,
  modelAdaptive: true,
  expertise: true,
  responseGuidelines: true,
  honestUncertainty: true,
  browserContext: true,
};

const STANDARD_LAYERS: LayerBudget = {
  ...FULL_LAYERS,
  peripheralVision: false,
  knowledgeContext: false,
};

const LEAN_LAYERS: LayerBudget = {
  identity: true,
  activeContext: true,
  conversationHistory: true,
  userProfile: true,
  emotionalMemory: false,
  peripheralVision: false,
  knowledgeContext: false,
  modelAdaptive: true,
  expertise: false,
  responseGuidelines: true,
  honestUncertainty: false,
  browserContext: false,
};

// ============================================================================
// Variant Definitions
// ============================================================================

const VARIANTS: Record<ModelFamily, PromptVariant> = {
  "claude-opus": {
    family: "claude-opus",
    communicationStyle: "verbose",
    identityDepth: "full",
    safetyVerbosity: "full",
    editToolHints:
      "Use replace_string_in_file with ample context lines. Claude Opus excels at precise multi-line edits.",
    layerBudget: FULL_LAYERS,
    maxHistoryTurns: 8,
    systemPromptGuidance: `You have deep reasoning capabilities. Feel free to:
- Think through complex problems step-by-step
- Explore multiple solution paths
- Provide thorough explanations with nuance
- Handle large context windows effectively
- Use extended thinking when the problem warrants it`,
  },
  "claude-sonnet": {
    family: "claude-sonnet",
    communicationStyle: "balanced",
    identityDepth: "standard",
    safetyVerbosity: "full",
    editToolHints:
      "Use replace_string_in_file with precise context. Sonnet handles edits well with clear before/after blocks.",
    layerBudget: FULL_LAYERS,
    maxHistoryTurns: 6,
    systemPromptGuidance: `Provide:
- Clear, well-structured responses
- Balanced depth without overwhelming detail
- Practical solutions over theoretical exploration`,
  },
  "claude-haiku": {
    family: "claude-haiku",
    communicationStyle: "concise",
    identityDepth: "minimal",
    safetyVerbosity: "lean",
    editToolHints:
      "Prefer small, targeted edits. Keep replace_string_in_file context minimal but unambiguous.",
    layerBudget: LEAN_LAYERS,
    maxHistoryTurns: 4,
    systemPromptGuidance: `Focus on:
- Concise, actionable answers
- Direct solutions without extensive exploration
- Efficient responses that get to the point quickly`,
  },
  "gpt-frontier": {
    family: "gpt-frontier",
    communicationStyle: "verbose",
    identityDepth: "full",
    safetyVerbosity: "full",
    editToolHints:
      "Use replace_string_in_file with generous context. GPT frontier models handle large edits reliably.",
    layerBudget: FULL_LAYERS,
    maxHistoryTurns: 8,
    systemPromptGuidance: `You have deep reasoning capabilities. Feel free to:
- Think through complex problems step-by-step
- Explore multiple solution paths
- Provide thorough explanations with nuance
- Handle large context windows effectively`,
  },
  "gpt-capable": {
    family: "gpt-capable",
    communicationStyle: "balanced",
    identityDepth: "standard",
    safetyVerbosity: "full",
    editToolHints:
      "Use replace_string_in_file with clear context markers. Include enough surrounding lines to avoid ambiguity.",
    layerBudget: FULL_LAYERS,
    maxHistoryTurns: 6,
    systemPromptGuidance: `Provide:
- Clear, well-structured responses
- Balanced depth without overwhelming detail
- Practical solutions over theoretical exploration`,
  },
  "gpt-efficient": {
    family: "gpt-efficient",
    communicationStyle: "concise",
    identityDepth: "minimal",
    safetyVerbosity: "lean",
    editToolHints:
      "Keep edits small and focused. Prefer single-function changes.",
    layerBudget: LEAN_LAYERS,
    maxHistoryTurns: 4,
    systemPromptGuidance: `Focus on:
- Concise, actionable answers
- Direct solutions without extensive exploration
- Efficient responses that get to the point quickly`,
  },
  "gemini-pro": {
    family: "gemini-pro",
    communicationStyle: "balanced",
    identityDepth: "standard",
    safetyVerbosity: "full",
    editToolHints:
      "Use replace_string_in_file with extra context. Be explicit about indentation, whitespace matters for Gemini edits.",
    layerBudget: FULL_LAYERS,
    maxHistoryTurns: 6,
    systemPromptGuidance: `Provide:
- Clear, well-structured responses
- Balanced depth without overwhelming detail
- Practical solutions over theoretical exploration`,
  },
  "gemini-flash": {
    family: "gemini-flash",
    communicationStyle: "concise",
    identityDepth: "minimal",
    safetyVerbosity: "lean",
    editToolHints:
      "Keep edits small. Prefer direct replacements over multi-region edits.",
    layerBudget: LEAN_LAYERS,
    maxHistoryTurns: 4,
    systemPromptGuidance: `Focus on:
- Concise, actionable answers
- Direct solutions without extensive exploration
- Efficient responses that get to the point quickly`,
  },
  "o-series": {
    family: "o-series",
    communicationStyle: "balanced",
    identityDepth: "standard",
    safetyVerbosity: "full",
    editToolHints:
      "Use replace_string_in_file with clear context. O-series models reason well through complex edits.",
    layerBudget: { ...FULL_LAYERS, emotionalMemory: false },
    maxHistoryTurns: 6,
    systemPromptGuidance: `You have strong reasoning capabilities. Leverage your chain-of-thought to:
- Analyze problems systematically before acting
- Verify assumptions with evidence
- Provide well-reasoned solutions`,
  },
  unknown: {
    family: "unknown",
    communicationStyle: "balanced",
    identityDepth: "standard",
    safetyVerbosity: "full",
    editToolHints: "Use replace_string_in_file with sufficient context.",
    layerBudget: STANDARD_LAYERS,
    maxHistoryTurns: 4,
    systemPromptGuidance: `Provide:
- Clear, well-structured responses
- Balanced depth without detail overload
- Practical solutions`,
  },
};

// ============================================================================
// Family Detection
// ============================================================================

const FAMILY_PATTERNS: Array<{ pattern: RegExp; family: ModelFamily }> = [
  // Claude variants
  { pattern: /claude.*opus/i, family: "claude-opus" },
  { pattern: /claude.*sonnet/i, family: "claude-sonnet" },
  { pattern: /claude.*haiku/i, family: "claude-haiku" },
  // O-series reasoning models
  { pattern: /o[134]-/i, family: "o-series" },
  { pattern: /o[134](?:\s|$)/i, family: "o-series" },
  // GPT frontier
  { pattern: /gpt-5\.[23]/i, family: "gpt-frontier" },
  // GPT capable
  { pattern: /gpt-5\.1/i, family: "gpt-capable" },
  { pattern: /gpt-5(?![\.\-])/i, family: "gpt-capable" },
  { pattern: /gpt-5-codex/i, family: "gpt-capable" },
  { pattern: /gpt-4\.1(?!.*mini|.*nano)/i, family: "gpt-capable" },
  { pattern: /gpt-4o(?!.*mini)/i, family: "gpt-capable" },
  { pattern: /gpt-4-turbo/i, family: "gpt-capable" },
  // GPT efficient
  { pattern: /gpt-5.*mini/i, family: "gpt-efficient" },
  { pattern: /gpt-4\.1.*mini/i, family: "gpt-efficient" },
  { pattern: /gpt-4\.1.*nano/i, family: "gpt-efficient" },
  { pattern: /gpt-4o.*mini/i, family: "gpt-efficient" },
  { pattern: /gpt-3\.5/i, family: "gpt-efficient" },
  // Gemini variants
  { pattern: /gemini.*pro/i, family: "gemini-pro" },
  { pattern: /gemini.*flash/i, family: "gemini-flash" },
];

/**
 * Detect the model family from the model's identifiers.
 */
export function detectModelFamily(
  modelId: string,
  modelFamily: string,
  modelName: string,
): ModelFamily {
  const searchString = `${modelFamily} ${modelName} ${modelId}`;
  for (const { pattern, family } of FAMILY_PATTERNS) {
    if (pattern.test(searchString)) {
      return family;
    }
  }
  return "unknown";
}

/**
 * Get the model family from a tier fallback when family detection fails.
 */
function familyFromTier(tier: ModelTier): ModelFamily {
  switch (tier) {
    case "frontier":
      return "gpt-frontier";
    case "capable":
      return "gpt-capable";
    case "efficient":
      return "gpt-efficient";
    default:
      return "unknown";
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get the prompt variant for a detected model.
 * Tries family detection first, falls back to tier mapping.
 */
export function getPromptVariant(
  modelId: string,
  modelFamily: string,
  modelName: string,
  tier: ModelTier,
): PromptVariant {
  let family = detectModelFamily(modelId, modelFamily, modelName);
  if (family === "unknown" && tier !== "unknown") {
    family = familyFromTier(tier);
  }
  return VARIANTS[family];
}

/**
 * Check whether a specific prompt layer should be included for this model.
 */
export function shouldIncludeLayer(
  variant: PromptVariant,
  layerName: keyof LayerBudget,
): boolean {
  return variant.layerBudget[layerName];
}

/**
 * Build the model-adaptive prompt section using the variant registry.
 * Replaces the old if/else chain in buildModelAdaptiveLayer.
 */
export function buildVariantGuidance(
  variant: PromptVariant,
  tierDisplayName: string,
): string {
  const parts: string[] = [
    `## Your Capabilities (${tierDisplayName} Model, ${variant.family})`,
  ];
  parts.push(variant.systemPromptGuidance);

  if (variant.editToolHints) {
    parts.push("");
    parts.push(`**Edit tool guidance**: ${variant.editToolHints}`);
  }

  return parts.join("\n");
}
