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
    '.github/copilot-instructions.md',
    '.github/instructions/*.md',
    '.github/prompts/*.md',
    '.github/episodic/*.md',
    '.github/skills/*/SKILL.md',
    '.github/domain-knowledge/*.md'  // Legacy - kept for backward compatibility
] as const;

/**
 * Paths relative to extension root for source files during install/upgrade
 */
export const EXTENSION_SOURCE_PATHS = {
    mainInstructions: '.github/copilot-instructions.md',
    instructions: '.github/instructions',
    prompts: '.github/prompts',
    episodic: '.github/episodic',
    domainKnowledge: '.github/domain-knowledge',
    config: '.github/config',
    agents: '.github/agents',
    skills: '.github/skills'
} as const;

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
export const SYNAPSE_REGEX = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

/**
 * Files to ignore when validating synapse connections (documentation placeholders)
 */
export const IGNORED_SYNAPSE_TARGETS = ['target-file.md', 'CHANGELOG.md'] as const;

/**
 * Health status thresholds for synapse health evaluation
 */
export const HEALTH_THRESHOLDS = {
    excellent: 0,      // 0 broken connections
    good: 5,           // < 5 broken connections
    needsAttention: 10 // < 10 broken connections, >= 10 is CRITICAL
} as const;

/**
 * Determine health status based on broken connection count
 */
export function getHealthStatus(brokenCount: number): 'EXCELLENT' | 'GOOD' | 'NEEDS ATTENTION' | 'CRITICAL' {
    if (brokenCount === HEALTH_THRESHOLDS.excellent) { return 'EXCELLENT'; }
    if (brokenCount < HEALTH_THRESHOLDS.good) { return 'GOOD'; }
    if (brokenCount < HEALTH_THRESHOLDS.needsAttention) { return 'NEEDS ATTENTION'; }
    return 'CRITICAL';
}

/**
 * Get health status emoji for display
 */
export function getHealthEmoji(status: string): string {
    switch (status) {
        case 'EXCELLENT': return '✅';
        case 'GOOD': return '🟢';
        case 'NEEDS ATTENTION': return '🟡';
        case 'CRITICAL': return '🔴';
        default: return '❓';
    }
}

/**
 * Workspace goal structure (stored in .github/config/goals.json)
 * Used for project-specific goal tracking (not global LearningGoals)
 */
export interface WorkspaceGoal {
    id: string;
    title: string;
    status: 'not-started' | 'in-progress' | 'completed';
    priority?: 'critical' | 'high' | 'medium' | 'low';
    createdAt?: string;
    completedAt?: string;
}

/**
 * Workspace goals file structure
 */
export interface WorkspaceGoalsData {
    goals: WorkspaceGoal[];
    streak?: number;
}

/**
 * Consolidated file mappings for auto-repair of broken synapses
 * Maps old/deprecated filenames to their current consolidated equivalents
 */
/* eslint-disable @typescript-eslint/naming-convention */
export const CONSOLIDATED_FILE_MAPPINGS: Record<string, string> = {
    // Meditation protocols
    "enhanced-meditation-protocol.prompt.md": "unified-meditation-protocols.prompt.md",
    "meditation-consolidation.prompt.md": "unified-meditation-protocols.prompt.md",
    "dream-meditation-distinction.prompt.md": "unified-meditation-protocols.prompt.md",
    
    // Identity integration
    "alex-finch-integration.prompt.md": "alex-identity-integration.instructions.md",
    "self-identity-integration.prompt.md": "alex-identity-integration.instructions.md",
    "character-driven-development.instructions.md": "alex-identity-integration.instructions.md",
    "unified-consciousness.instructions.md": "alex-identity-integration.instructions.md",
    
    // Dream protocols
    "dream-protocol-integration.prompt.md": "dream-state-automation.instructions.md",
    "dream-protocol-mastery-meditation.prompt.md": "dream-state-automation.instructions.md"
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Outdated version patterns to detect during version consistency checks
 */
export const OUTDATED_VERSION_PATTERNS = [
    /1\.5\.0\s+UNPENTNILIUM/g,
    /1\.1\.0\s+UNUNUNNILIUM/g,
    /1\.0\.\d+\s+UNNL/g,
    /0\.\d+\.\d+\s+NIL/g
];

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
export const ALEX_GLOBAL_HOME = '.alex';

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
    globalProfile: `${ALEX_GLOBAL_HOME}/user-profile.json`
} as const;

/**
 * File prefixes for global knowledge types
 */
export const GLOBAL_KNOWLEDGE_PREFIXES = {
    pattern: 'GK-',      // Global Knowledge patterns
    insight: 'GI-'       // Global Insights (timestamped learnings)
} as const;

/**
 * Categories for global knowledge organization
 */
export const GLOBAL_KNOWLEDGE_CATEGORIES = [
    'error-handling',
    'api-design',
    'testing',
    'debugging',
    'performance',
    'architecture',
    'security',
    'deployment',
    'documentation',
    'refactoring',
    'patterns',
    'tooling',
    'general'
] as const;

export type GlobalKnowledgeCategory = typeof GLOBAL_KNOWLEDGE_CATEGORIES[number];

/**
 * Interface for global knowledge file metadata
 */
export interface IGlobalKnowledgeEntry {
    id: string;
    title: string;
    type: 'pattern' | 'insight';
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
    decayProfile?: 'aggressive' | 'moderate' | 'slow' | 'permanent';
}

/**
 * Interface for the global knowledge index
 */
export interface IGlobalKnowledgeIndex {
    version: string;
    lastUpdated: string;
    cloudGistId?: string;  // Stored in gist so other machines can find it
    cloudGistUrl?: string; // Human-readable URL for reference
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
