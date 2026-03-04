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

/** GitHub account information detected via authentication API */
export interface GitHubAccountInfo {
    /** GitHub username / display label */
    label: string;
    /** Whether the session was detected (user is signed in) */
    signedIn: boolean;
    /** Number of GitHub sessions available (multi-account indicator) */
    sessionCount: number;
    /** Hint about likely account type based on available models */
    accountHint: 'free' | 'pro' | 'business' | 'enterprise' | 'unknown';
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
    /** Whether GitHub Copilot extension is installed */
    copilotInstalled: boolean;
    /** Whether GitHub Copilot Chat extension is installed */
    copilotChatInstalled: boolean;
    /** Active GitHub account information */
    gitHubAccount: GitHubAccountInfo;
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

    // ── Step 0: Check for Copilot extensions ────────────────────────
    const copilotInstalled = !!vscode.extensions.getExtension('github.copilot');
    const copilotChatInstalled = !!vscode.extensions.getExtension('github.copilot-chat');

    // ── Step 0b: Detect active GitHub account ───────────────────────
    let gitHubAccount: GitHubAccountInfo = {
        label: '',
        signedIn: false,
        sessionCount: 0,
        accountHint: 'unknown',
    };

    try {
        // Silent check — don't prompt for sign-in
        const session = await vscode.authentication.getSession('github', ['user:email'], { createIfNone: false });
        if (session) {
            gitHubAccount.label = session.account.label;
            gitHubAccount.signedIn = true;
            gitHubAccount.sessionCount = 1;
        }

        // Check for multiple accounts (Enterprise users often have both)
        // The 'github-enterprise' provider indicates a corporate account
        try {
            const enterpriseSession = await vscode.authentication.getSession('github-enterprise', [], { createIfNone: false });
            if (enterpriseSession) {
                gitHubAccount.sessionCount++;
                // If we didn't have a personal session, use enterprise info
                if (!gitHubAccount.signedIn) {
                    gitHubAccount.label = enterpriseSession.account.label;
                    gitHubAccount.signedIn = true;
                }
            }
        } catch {
            // github-enterprise provider may not exist — that's fine
        }
    } catch {
        // Authentication API unavailable — proceed without account info
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
    // The actual settings are nested under github.copilot.chat.models.anthropic.*
    const copilotModelsConfig = vscode.workspace.getConfiguration('github.copilot.chat.models.anthropic');
    const extendedThinkingEnabled =
        chatConfig.get<boolean>('extendedThinking.enabled', false) ||
        copilotModelsConfig.get<boolean>('claude-opus-4-6.extendedThinkingEnabled', false) ||
        copilotModelsConfig.get<boolean>('claude-opus-4-5.extendedThinkingEnabled', false);

    // ── Step 4: Check MCP gallery ───────────────────────────────────
    const mcpGalleryEnabled = chatConfig.get<boolean>('mcp.gallery.enabled', false);

    // ── Step 5: Check Copilot Memory ────────────────────────────────
    const copilotMemoryEnabled =
        vscode.workspace.getConfiguration('github.copilot.chat').get<boolean>('copilotMemory.enabled', false);

    // ── Step 6: Classify account type from model availability ─────
    // Note: We can't reliably distinguish Pro from Business by model tier alone,
    // so we use broad categories: 'pro' (frontier), 'paid' (capable), 'free' (efficient).
    if (gitHubAccount.signedIn) {
        if (bestModelTier === 'frontier') {
            gitHubAccount.accountHint = 'pro'; // Pro/Business/Enterprise with frontier access
        } else if (hasModels && (bestModelTier === 'capable' || bestModelTier === 'efficient')) {
            // Both Pro and Business can have capable models; free tier may have efficient
            // We can't distinguish further without subscription API access
            gitHubAccount.accountHint = 'unknown';
        }
    }

    // ── Step 7: Determine cognitive level ───────────────────────────
    let level: CognitiveLevel;
    let reason: string;

    const accountLabel = gitHubAccount.signedIn ? ` (signed in as ${gitHubAccount.label})` : '';
    const multiAccountHint = gitHubAccount.sessionCount > 1
        ? ' You have multiple GitHub accounts — try switching accounts if your current plan lacks frontier models.'
        : '';

    if (!hasModels) {
        level = 1;
        reason = !copilotInstalled
            ? 'GitHub Copilot extension is not installed. Install it from the Extensions panel to unlock AI features.'
            : !copilotChatInstalled
                ? 'GitHub Copilot Chat extension is not installed. Install it to enable chat and agent mode.'
                : gitHubAccount.signedIn
                    ? `No language models detected${accountLabel}. Your account may not have an active Copilot subscription. Check your GitHub Copilot settings.${multiAccountHint}`
                    : 'No language models detected. Sign in to GitHub Copilot to activate AI capabilities.';
    } else if (!agentModeEnabled) {
        level = 2;
        reason = `Copilot Chat available${accountLabel} but agent mode is disabled. Enable "chat.agent.enabled" for full tool access.`;
    } else if (bestModelTier !== 'frontier' || !extendedThinkingEnabled) {
        level = 3;
        if (agentModeEnabled && bestModelTier !== 'frontier') {
            reason = `Agent mode active with ${bestModelTier} model${accountLabel}. ` +
                `Frontier models (Claude Opus, GPT-5.2) require Copilot Pro or Business.${multiAccountHint}`;
        } else {
            reason = `Agent mode active${accountLabel} but extended thinking is not enabled. Enable for maximum cognitive capability.`;
        }
    } else {
        level = 4;
        reason = `Advanced capability${accountLabel}: Frontier model + agent mode + extended thinking.`;
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
        copilotInstalled,
        copilotChatInstalled,
        gitHubAccount,
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
    const account = result.gitHubAccount;

    const planLabel = account.accountHint !== 'unknown' ? account.accountHint : 'plan unknown';
    const multiAcct = account.sessionCount > 1 ? ` (+${account.sessionCount - 1} more)` : '';
    const accountDisplay = account.signedIn
        ? `✅ ${account.label}${multiAcct} — ${planLabel}`
        : '❌ Not signed in';

    const checks = [
        `GitHub Account: ${accountDisplay}`,
        `GitHub Copilot: ${result.copilotInstalled ? '✅ Installed' : '❌ Not installed'}`,
        `Copilot Chat: ${result.copilotChatInstalled ? '✅ Installed' : '❌ Not installed'}`,
        `Language Models: ${result.hasModels ? '✅' : '❌'}`,
        `Agent Mode: ${result.agentModeEnabled ? '✅' : '❌'}`,
        `Extended Thinking: ${result.extendedThinkingEnabled ? '✅' : '❌'}`,
        `MCP Gallery: ${result.mcpGalleryEnabled ? '✅' : '❌'}`,
        `Copilot Memory: ${result.copilotMemoryEnabled ? '✅' : '❌'}`,
        `Best Model Tier: ${result.bestModelTier}`,
    ];

    let summary = `## ${tier.emoji} Cognitive Level ${tier.level}: ${tier.displayName}\n\n` +
        `${tier.description}\n\n` +
        `### Detection Results\n${checks.map(c => `- ${c}`).join('\n')}\n\n` +
        `### Reason\n${result.reason}`;

    // Add account switching guidance for Level 3 users stuck without frontier models
    if (result.level === 3 && result.bestModelTier !== 'frontier' && account.signedIn) {
        summary += '\n\n### 💡 Upgrade Tip\n' +
            'Frontier models require **Copilot Pro** (personal) or **Copilot Business/Enterprise** (organization) with frontier model access enabled.\n\n' +
            (account.sessionCount > 1
                ? '**You have multiple GitHub accounts.** If your other account has a higher Copilot plan, try switching:\n' +
                  '1. Open the **Accounts** menu (bottom-left person icon)\n' +
                  '2. Sign out of the current GitHub session\n' +
                  '3. Sign in with the account that has Copilot Pro/Business\n' +
                  '4. Run **Alex: Detect Cognitive Level** to refresh'
                : 'If you have another GitHub account with Copilot Pro/Business, you can switch accounts:\n' +
                  '1. Open the **Accounts** menu (bottom-left person icon)\n' +
                  '2. Add your other GitHub account\n' +
                  '3. Switch Copilot to use the account with frontier model access');
    }

    return summary;
}

/**
 * Get all feature requirements (for documentation/UI).
 */
export function getAllFeatureRequirements(): Record<string, FeatureRequirement> {
    return { ...FEATURE_REQUIREMENTS };
}
