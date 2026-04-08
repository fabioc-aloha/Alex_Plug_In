/**
 * Alex Cognitive Architecture - Shared Constants
 *
 * Single source of truth for patterns, paths, and configuration used across the extension.
 * Prevents duplication and ensures consistency.
 */

/**
 * Memory file patterns for scanning Alex cognitive architecture files
 */
export const MEMORY_FILE_PATTERNS = [
  ".github/copilot-instructions.md",
  ".github/instructions/*.md",
  ".github/prompts/*.md",
  ".github/episodic/*.md",
  ".github/skills/*/SKILL.md",
  ".github/domain-knowledge/*.md", // Legacy - kept for backward compatibility
] as const;

/**
 * Regex pattern for parsing synapse connections in markdown files
 *
 * Format: [target-file.md] (Strength, Type, Direction) - "condition"
 *
 * Capture groups:
 * 1. Target filename (e.g., "target-file.md")
 * 2. Strength (e.g., "Critical", "High", "Medium", "Low")
 * 3. Type (optional, e.g., "Validates", "Enables", "Documents")
 * 4. Direction (optional, e.g., "Bidirectional", "Forward")
 * 5. Condition/description (e.g., "Trigger description")
 */
export const SYNAPSE_REGEX =
  /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

/**
 * Health status thresholds for synapse health evaluation
 */
const HEALTH_THRESHOLDS = {
  excellent: 0, // 0 broken connections
  good: 5, // < 5 broken connections
  needsAttention: 10, // < 10 broken connections, >= 10 is CRITICAL
} as const;

/**
 * Determine health status based on broken connection count
 */
export function getHealthStatus(
  brokenCount: number,
): "EXCELLENT" | "GOOD" | "NEEDS ATTENTION" | "CRITICAL" {
  if (brokenCount === HEALTH_THRESHOLDS.excellent) {
    return "EXCELLENT";
  }
  if (brokenCount < HEALTH_THRESHOLDS.good) {
    return "GOOD";
  }
  if (brokenCount < HEALTH_THRESHOLDS.needsAttention) {
    return "NEEDS ATTENTION";
  }
  return "CRITICAL";
}

/**
 * Regex to extract version from copilot-instructions.md
 */
export const VERSION_EXTRACT_REGEX = /\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/;

/**
 * Regex to extract numeric version only (for comparisons)
 */
export const VERSION_NUMBER_REGEX = /\*\*Version\*\*:\s*(\d+\.\d+\.\d+)/;

// ============================================================================
// GLOBAL KNOWLEDGE BASE CONFIGURATION
// ============================================================================

/**
 * Global Alex home directory name (in user's home folder)
 */
export const ALEX_GLOBAL_HOME = ".alex";

/**
 * Global knowledge base subdirectories
 */
export const GLOBAL_KNOWLEDGE_PATHS = {
  root: ALEX_GLOBAL_HOME,
  knowledge: `${ALEX_GLOBAL_HOME}/global-knowledge`,
  patterns: `${ALEX_GLOBAL_HOME}/global-knowledge/patterns`,
  insights: `${ALEX_GLOBAL_HOME}/global-knowledge/insights`,
  index: `${ALEX_GLOBAL_HOME}/global-knowledge/index.json`,
  projectRegistry: `${ALEX_GLOBAL_HOME}/project-registry.json`,
  globalProfile: `${ALEX_GLOBAL_HOME}/user-profile.json`,
} as const;

/**
 * File prefixes for global knowledge types
 */
export const GLOBAL_KNOWLEDGE_PREFIXES = {
  pattern: "GK-", // Global Knowledge patterns
  insight: "GI-", // Global Insights (timestamped learnings)
} as const;

/**
 * Categories for global knowledge organization
 */
export const GLOBAL_KNOWLEDGE_CATEGORIES = [
  "error-handling",
  "api-design",
  "testing",
  "debugging",
  "performance",
  "architecture",
  "security",
  "deployment",
  "documentation",
  "refactoring",
  "patterns",
  "tooling",
  "general",
] as const;

export type GlobalKnowledgeCategory =
  (typeof GLOBAL_KNOWLEDGE_CATEGORIES)[number];

/**
 * Interface for global knowledge file metadata
 */
export interface IGlobalKnowledgeEntry {
  id: string;
  title: string;
  type: "pattern" | "insight";
  category: GlobalKnowledgeCategory;
  tags: string[];
  sourceProject?: string;
  relatedProjects?: string[];
  created: string;
  modified: string;
  summary: string;
  filePath: string;
  // v5.9.6: Forgetting Curve — freshness tracking fields (optional, added lazily)
  /** ISO timestamp of the most recent reference (skill activation, search, or mention) */
  lastReferenced?: string;
  /** Cumulative reference count across all interaction types */
  referenceCount?: number;
  /** Cached composite freshness score 0.0–1.0 (recomputed on read) */
  freshnessScore?: number;
  /** Decay profile — determines how fast this entry fades without use */
  decayProfile?: "aggressive" | "moderate" | "slow" | "permanent";
}

/**
 * Interface for the global knowledge index
 */
export interface IGlobalKnowledgeIndex {
  version: string;
  lastUpdated: string;
  entries: IGlobalKnowledgeEntry[];
}

/**
 * Interface for project registry entry
 */
export interface IProjectRegistryEntry {
  path: string;
  name: string;
  lastAccessed: string;
  knowledgeFiles: number;
  primaryTechnologies?: string[];
  summary?: string;
}

/**
 * Interface for the project registry
 */
export interface IProjectRegistry {
  version: string;
  lastUpdated: string;
  projects: IProjectRegistryEntry[];
}
