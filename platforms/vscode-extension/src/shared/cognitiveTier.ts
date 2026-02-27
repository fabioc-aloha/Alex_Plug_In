/**
 * Alex Cognitive Architecture — Runtime Cognitive Tier Detection & Guards
 *
 * Detects the user's effective cognitive level based on:
 *   - Available language models (via vscode.lm.selectChatModels)
 *   - Copilot Chat agent mode settings
 *   - Extended thinking settings
 *   - MCP gallery settings
 *
 * Provides guard functions that warn users BEFORE they hit dead ends.
 *
 * Cognitive Levels:
 *   Level 1 — Minimum      (no Copilot / no models)
 *   Level 2 — Basic         (Copilot Chat available, no agent mode)
 *   Level 3 — Recommended   (Agent mode enabled, tools + skills active)
 *   Level 4 — Advanced      (Frontier model + extended thinking + MCP)
 */

import * as vscode from 'vscode';

// ============================================================================
// TYPES
// ============================================================================

/** The four cognitive levels in ascending capability order */
export type CognitiveLevel = 1 | 2 | 3 | 4;

/** Detailed cognitive tier information */
export interface CognitiveTierInfo {
    level: CognitiveLevel;
    name: string;
    displayName: string;
    emoji: string;
    description: string;
    /** What becomes available at this level */
    unlocks: string[];
    /** Known limitations at this level */
    limitations: string[];
}

/** Result of a cognitive level check */
export interface CognitiveLevelResult {
    level: CognitiveLevel;
    tierInfo: CognitiveTierInfo;
    /** Whether any language models were found */
    hasModels: boolean;
    /** Whether agent mode is enabled in settings */
    agentModeEnabled: boolean;
    /** Whether extended thinking is available */
    extendedThinkingEnabled: boolean;
    /** Whether MCP gallery is enabled */
    mcpGalleryEnabled: boolean;
    /** Whether Copilot Memory is enabled for cross-session persistence */
    copilotMemoryEnabled: boolean;
    /** Best model tier detected (frontier/capable/efficient/unknown) */
    bestModelTier: string;
    /** Reason for the detected level */
    reason: string;
}

/** Feature requirement definition */
export interface FeatureRequirement {
    featureName: string;
    minimumLevel: CognitiveLevel;
    description: string;
    /** What the user needs to do to unlock this */
    upgradeHint: string;
}

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

/** Complete tier information for each cognitive level */
const COGNITIVE_TIERS: Record<CognitiveLevel, CognitiveTierInfo> = {
    1: {
        level: 1,
        name: 'minimum',
        displayName: 'Minimum',
        emoji: '📁',
        description: 'Free — local architecture management, no AI chat (no Copilot subscription needed)',
        unlocks: [
            'Architecture initialization & reset',
            'Status dashboard & health checks',
            'Skill catalog browsing',
            'Environment setup',
            'Global Knowledge file operations (save insight, search)',
            'Memory Dashboard',
        ],
        limitations: [
            'No AI conversation capabilities',
            'No code review or debugging assistance',
            'No meditation or self-actualization',
            'No agent mode tools',
        ],
    },
    2: {
        level: 2,
        name: 'basic',
        displayName: 'Basic',
        emoji: '💬',
        description: 'AI conversation via Copilot Chat',
        unlocks: [
            'Conversational AI assistance',
            'North Star vision discussions',
            'Basic meditation sessions',
            'Chat-mode code review',
            'Copilot Memory (cross-session context)',
        ],
        limitations: [
            'No agent mode (tools, file edits, terminal)',
            'No skill/instruction auto-loading',
            'No MCP server integration',
            'Limited to chat-only interactions',
        ],
    },
    3: {
        level: 3,
        name: 'recommended',
        displayName: 'Recommended',
        emoji: '🤖',
        description: 'Full agent mode with tools, skills, and autonomous actions',
        unlocks: [
            'Agent mode with tool calling',
            'Skills & instructions auto-loading',
            'Code review, debugging, test generation',
            'Project audits & release preflight',
            'Dream protocol & neural maintenance',
            'Memory Search tool (alex_cognitive_memory_search)',
            'Inherit & Promote skills from Global Knowledge',
        ],
        limitations: [
            'May lack deep reasoning for complex architecture',
            'Extended thinking not available',
            'Some MCP integrations may be missing',
        ],
    },
    4: {
        level: 4,
        name: 'advanced',
        displayName: 'Advanced',
        emoji: '🧠',
        description: 'Maximum AI partnership — frontier model + extended thinking + MCP',
        unlocks: [
            'Frontier-class deep reasoning',
            'Extended thinking for complex problems',
            'MCP server integrations',
            'Self-actualization & architecture design',
            'Bootstrap learning & knowledge synthesis',
            'NASA-grade audits',
        ],
        limitations: [
            'Requires Copilot Pro/Business subscription',
        ],
    },
};

// ============================================================================
// FEATURE REQUIREMENTS MAP
// ============================================================================

/**
 * Maps command IDs to their minimum cognitive level requirements.
 * Commands not listed here are assumed to work at Level 1 (minimum).
 */
const FEATURE_REQUIREMENTS: Record<string, FeatureRequirement> = {
    // ── Level 2: Chat Required ──────────────────────────────────────────
    'alex.meditate': {
        featureName: 'Meditation',
        minimumLevel: 2,
        description: 'Knowledge consolidation through conversation',
        upgradeHint: 'Install GitHub Copilot Chat extension to enable meditation.',
    },
    'alex.northStar': {
        featureName: 'North Star',
        minimumLevel: 2,
        description: 'Vision definition and alignment',
        upgradeHint: 'Install GitHub Copilot Chat extension to access North Star conversations.',
    },
    'alex.workingWithAlex': {
        featureName: 'Working With Alex',
        minimumLevel: 2,
        description: 'Partnership guide conversation',
        upgradeHint: 'Install GitHub Copilot Chat extension.',
    },
    'alex.askAboutSelection': {
        featureName: 'Ask About Selection',
        minimumLevel: 2,
        description: 'Ask Alex about selected code',
        upgradeHint: 'Install GitHub Copilot Chat extension.',
    },

    // ── Level 3: Agent Mode Required ────────────────────────────────────
    'alex.dream': {
        featureName: 'Dream Protocol',
        minimumLevel: 3,
        description: 'Neural maintenance with synapse healing',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings. Requires Copilot Pro or Business.',
    },
    'alex.codeReview': {
        featureName: 'Code Review',
        minimumLevel: 3,
        description: 'Systematic code analysis with tool access',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.debugThis': {
        featureName: 'Debug This',
        minimumLevel: 3,
        description: 'Root cause analysis with file access',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.rubberDuck': {
        featureName: 'Rubber Duck Debugging',
        minimumLevel: 3,
        description: 'Interactive debugging conversation',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.generateTests': {
        featureName: 'Generate Tests',
        minimumLevel: 3,
        description: 'AI-powered test generation',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.runAudit': {
        featureName: 'Project Audit',
        minimumLevel: 3,
        description: 'Comprehensive project health analysis',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.releasePreflight': {
        featureName: 'Release Preflight',
        minimumLevel: 3,
        description: 'Pre-release validation checks',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.reviewPR': {
        featureName: 'Review Pull Request',
        minimumLevel: 3,
        description: 'Pull request analysis',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },

    // ── Level 3: Global Memory (Agent-mode tools) ──────────────────────
    'alex.inheritSkillFromGlobal': {
        featureName: 'Inherit Skill from Global Knowledge',
        minimumLevel: 3,
        description: 'Import a reusable skill from the cross-project knowledge base',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },
    'alex.proposeSkillToGlobal': {
        featureName: 'Promote Skill to Global Knowledge',
        minimumLevel: 3,
        description: 'Share a project skill with the cross-project knowledge base',
        upgradeHint: 'Enable agent mode: set "chat.agent.enabled": true in VS Code settings.',
    },

    // ── Level 4: Advanced Required ──────────────────────────────────────
    'alex.selfActualize': {
        featureName: 'Self-Actualization',
        minimumLevel: 4,
        description: 'Deep architecture assessment requiring frontier reasoning',
        upgradeHint: 'Use a Frontier model (Claude Opus, GPT-5.2) with extended thinking enabled for best results.',
    },
};

// ============================================================================
// STATE
// ============================================================================

/** Cached cognitive level, updated on detection */
let cachedLevel: CognitiveLevelResult | null = null;

/** Timestamp of last detection */
let lastDetectionTime = 0;

/** Cache TTL in milliseconds (30 seconds) */
const CACHE_TTL_MS = 30_000;

// ============================================================================
// DETECTION
// ============================================================================

/**
 * Detect the user's current cognitive level.
 * Uses cached result if fresh enough; otherwise re-detects.
 */
export async function detectCognitiveLevel(forceRefresh = false): Promise<CognitiveLevelResult> {
    const now = Date.now();

    if (!forceRefresh && cachedLevel && (now - lastDetectionTime) < CACHE_TTL_MS) {
        return cachedLevel;
    }

    // ── Step 1: Check for available language models ─────────────────
    let hasModels = false;
    let bestModelTier = 'unknown';

    try {
        const models = await vscode.lm.selectChatModels();
        hasModels = models.length > 0;

        if (hasModels) {
            // Classify the best available model
            for (const model of models) {
                const id = `${model.family} ${model.name} ${model.id}`.toLowerCase();

                if (/opus|gpt-5\.2|o1-pro|o3/.test(id)) {
                    bestModelTier = 'frontier';
                    break; // Can't do better than frontier
                } else if (/sonnet|gpt-4o|gpt-5|gemini.*pro|o1/.test(id) && bestModelTier !== 'frontier') {
                    bestModelTier = 'capable';
                } else if (/haiku|mini|gpt-4\.1|flash/.test(id) && bestModelTier === 'unknown') {
                    bestModelTier = 'efficient';
                }
            }
        }
    } catch {
        // vscode.lm may not be available — Level 1
        hasModels = false;
    }

    // ── Step 2: Check agent mode setting ────────────────────────────
    const chatConfig = vscode.workspace.getConfiguration('chat');
    const agentModeEnabled = chatConfig.get<boolean>('agent.enabled', false);

    // ── Step 3: Check extended thinking ─────────────────────────────
    // Check multiple possible setting keys for extended thinking
    const extendedThinkingEnabled =
        chatConfig.get<boolean>('extendedThinking.enabled', false) ||
        vscode.workspace.getConfiguration('claude-opus-4-6').get<boolean>('extendedThinkingEnabled', false) ||
        vscode.workspace.getConfiguration('claude-opus-4-5').get<boolean>('extendedThinkingEnabled', false);

    // ── Step 4: Check MCP gallery ───────────────────────────────────
    const mcpGalleryEnabled = chatConfig.get<boolean>('mcp.gallery.enabled', false);

    // ── Step 5: Check Copilot Memory ────────────────────────────────
    const copilotMemoryEnabled =
        vscode.workspace.getConfiguration('github.copilot.chat').get<boolean>('copilotMemory.enabled', false);

    // ── Step 6: Determine cognitive level ───────────────────────────
    let level: CognitiveLevel;
    let reason: string;

    if (!hasModels) {
        level = 1;
        reason = 'No language models detected. Install GitHub Copilot for AI capabilities.';
    } else if (!agentModeEnabled) {
        level = 2;
        reason = 'Copilot Chat available but agent mode is disabled. Enable "chat.agent.enabled" for full tool access.';
    } else if (bestModelTier !== 'frontier' || !extendedThinkingEnabled) {
        level = 3;
        reason = agentModeEnabled && bestModelTier !== 'frontier'
            ? `Agent mode active with ${bestModelTier} model. Use a Frontier model for Level 4.`
            : 'Agent mode active but extended thinking is not enabled. Enable for maximum cognitive capability.';
    } else {
        level = 4;
        reason = 'Advanced capability: Frontier model + agent mode + extended thinking.';
    }

    const result: CognitiveLevelResult = {
        level,
        tierInfo: COGNITIVE_TIERS[level],
        hasModels,
        agentModeEnabled,
        extendedThinkingEnabled,
        mcpGalleryEnabled,
        copilotMemoryEnabled,
        bestModelTier,
        reason,
    };

    cachedLevel = result;
    lastDetectionTime = now;

    return result;
}

/**
 * Get the cached cognitive level without re-detecting.
 * Returns null if never detected.
 */
export function getCachedCognitiveLevel(): CognitiveLevelResult | null {
    return cachedLevel;
}

/**
 * Invalidate the cached cognitive level (e.g., after settings change).
 */
export function invalidateCognitiveLevelCache(): void {
    cachedLevel = null;
    lastDetectionTime = 0;
}

// ============================================================================
// GUARD FUNCTIONS
// ============================================================================

/**
 * Check if the user's cognitive level meets the minimum for a feature.
 * If not, shows a warning with upgrade instructions and returns false.
 *
 * Usage:
 *   if (!(await requireCognitiveLevel('alex.codeReview'))) { return; }
 *
 * @param commandId The command identifier to check
 * @returns true if the user can proceed, false if blocked
 */
export async function requireCognitiveLevel(commandId: string): Promise<boolean> {
    const requirement = FEATURE_REQUIREMENTS[commandId];

    // No requirement registered — allow by default
    if (!requirement) {
        return true;
    }

    const current = await detectCognitiveLevel();

    if (current.level >= requirement.minimumLevel) {
        return true;
    }

    // ── Show upgrade warning ────────────────────────────────────────
    const tierInfo = COGNITIVE_TIERS[requirement.minimumLevel];
    const currentInfo = current.tierInfo;

    const upgradeAction = 'Show Cognitive Levels';
    const settingsAction = 'Open Settings';

    const choice = await vscode.window.showWarningMessage(
        `${tierInfo.emoji} "${requirement.featureName}" requires Cognitive Level ${requirement.minimumLevel} (${tierInfo.displayName}). ` +
        `You're currently at Level ${current.level} (${currentInfo.displayName}). ` +
        `${requirement.upgradeHint}`,
        upgradeAction,
        settingsAction,
    );

    if (choice === upgradeAction) {
        vscode.commands.executeCommand('alex.cognitiveLevels');
    } else if (choice === settingsAction) {
        vscode.commands.executeCommand('workbench.action.openSettings', 'chat.agent.enabled');
    }

    return false;
}

/**
 * Get the feature requirement for a command, if any.
 */
export function getFeatureRequirement(commandId: string): FeatureRequirement | undefined {
    return FEATURE_REQUIREMENTS[commandId];
}

/**
 * Check if a command is available at the current cognitive level.
 * Unlike requireCognitiveLevel, this does NOT show a warning — useful
 * for UI state (e.g., graying out buttons).
 */
export async function isFeatureAvailable(commandId: string): Promise<boolean> {
    const requirement = FEATURE_REQUIREMENTS[commandId];
    if (!requirement) {
        return true;
    }
    const current = await detectCognitiveLevel();
    return current.level >= requirement.minimumLevel;
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Get all tier definitions (for the Cognitive Levels UI).
 */
export function getAllTiers(): Record<CognitiveLevel, CognitiveTierInfo> {
    return { ...COGNITIVE_TIERS };
}

/**
 * Format a cognitive level summary for display.
 */
export function formatCognitiveLevelSummary(result: CognitiveLevelResult): string {
    const tier = result.tierInfo;
    const checks = [
        `Language Models: ${result.hasModels ? '✅' : '❌'}`,
        `Agent Mode: ${result.agentModeEnabled ? '✅' : '❌'}`,
        `Extended Thinking: ${result.extendedThinkingEnabled ? '✅' : '❌'}`,
        `MCP Gallery: ${result.mcpGalleryEnabled ? '✅' : '❌'}`,
        `Copilot Memory: ${result.copilotMemoryEnabled ? '✅' : '❌'}`,
        `Best Model Tier: ${result.bestModelTier}`,
    ];

    return `## ${tier.emoji} Cognitive Level ${tier.level}: ${tier.displayName}\n\n` +
        `${tier.description}\n\n` +
        `### Detection Results\n${checks.map(c => `- ${c}`).join('\n')}\n\n` +
        `### Reason\n${result.reason}`;
}

/**
 * Get all feature requirements (for documentation/UI).
 */
export function getAllFeatureRequirements(): Record<string, FeatureRequirement> {
    return { ...FEATURE_REQUIREMENTS };
}
