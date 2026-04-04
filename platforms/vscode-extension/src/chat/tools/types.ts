/**
 * Tool input parameters interfaces
 */
export interface ISynapseHealthParams {
  detailed?: boolean;
}

export interface IMemorySearchParams {
  query: string;
  memoryType?: "procedural" | "episodic" | "domain" | "all";
}

export interface IArchitectureStatusParams {
  includeMetrics?: boolean;
}

export interface IMcpRecommendationParams {
  scenario: string;
  platform?: "azure" | "m365" | "both";
}

export interface IUserProfileParams {
  action: "get" | "update" | "exists";
  field?: string;
  value?: string;
}

export interface IHeirValidationParams {
  /** Validate specific folder or all heir content */
  scope?: "all" | "instructions" | "prompts" | "skills" | "config";
  /** Return full content for LLM analysis (default: true) */
  includeContent?: boolean;
}

export interface ICognitiveStateParams {
  /** The cognitive state to set: debugging, planning, building, reviewing, learning, teaching, meditation, dream, discovery
   *  OR an agent mode: builder, researcher, validator, documentarian, azure, m365
   */
  state: string;
}

/**
 * User Profile Interface
 */
export interface IUserProfile {
  name?: string;
  nickname?: string;
  pronouns?: string;
  birthday?: string; // ISO date string (e.g., "1968-03-07") for age-based avatar
  role?: string;
  experienceLevel?: string;
  formality?: "casual" | "balanced" | "formal";
  detailLevel?: "brief" | "balanced" | "detailed";
  explanationStyle?: "conceptual" | "practical" | "both";
  humor?: "welcome" | "occasional" | "minimal";
  encouragement?: "frequent" | "occasional" | "minimal";
  questionFrequency?: "ask many" | "ask when needed" | "minimize";
  proactiveSuggestions?: "welcome" | "occasional" | "only when asked";
  primaryTechnologies?: string[];
  learningGoals?: string[];
  expertiseAreas?: string[];
  currentProjects?: string;
  notes?: string;
  lastUpdated?: string;
  // Index signature for dynamic field access (NASA R10 compliance)
  [key: string]: string | string[] | undefined;
}

/**
 * Self-Actualization Tool Input Parameters
 */
export interface ISelfActualizationParams {
  createReport?: boolean;
  autoFix?: boolean;
}

/**
 * Cross-Domain Synthesis Tool Input Parameters
 */
export interface ICrossDomainSynthesisParams {
  /** Maximum episodic memories to analyze (default: 50) */
  maxEntries?: number;
  /** Focus on connections involving this specific domain */
  focusDomain?: string;
}
