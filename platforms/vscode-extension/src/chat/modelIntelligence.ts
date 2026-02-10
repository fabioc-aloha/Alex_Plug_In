/**
 * Model Intelligence Module - v5.5.0
 * 
 * Detects, classifies, and optimizes model usage for cognitive tasks.
 * Implements adaptive behavior based on model tier capabilities.
 */

import * as vscode from 'vscode';

// ============================================================================
// MODEL TIER DEFINITIONS
// ============================================================================

/**
 * Model capability tiers
 */
export type ModelTier = 'frontier' | 'capable' | 'efficient' | 'unknown';

/**
 * Model tier metadata
 */
export interface ModelTierInfo {
    tier: ModelTier;
    displayName: string;
    description: string;
    capabilities: {
        deepReasoning: boolean;
        extendedContext: boolean;
        complexArchitecture: boolean;
        toolCalling: boolean;
    };
    minContextTokens: number;
}

/**
 * Detected model information
 */
export interface DetectedModel {
    id: string;
    name: string;
    family: string;
    vendor: string;
    version: string;
    maxInputTokens: number;
    tier: ModelTier;
    tierInfo: ModelTierInfo;
}

/**
 * Task complexity classification
 */
export type TaskComplexity = 'frontier' | 'capable' | 'efficient';

/**
 * Task type for model matching
 */
export interface CognitiveTask {
    name: string;
    minimumTier: TaskComplexity;
    description: string;
    warning?: string;
}

// ============================================================================
// MODEL CLASSIFICATION DATA
// ============================================================================

/**
 * Model tier definitions with capabilities
 */
const MODEL_TIERS: Record<ModelTier, ModelTierInfo> = {
    frontier: {
        tier: 'frontier',
        displayName: 'Frontier',
        description: 'Maximum reasoning, 1M+ context, extended thinking',
        capabilities: {
            deepReasoning: true,
            extendedContext: true,
            complexArchitecture: true,
            toolCalling: true
        },
        minContextTokens: 200000
    },
    capable: {
        tier: 'capable',
        displayName: 'Capable',
        description: 'Good reasoning, 200K-400K context',
        capabilities: {
            deepReasoning: false,
            extendedContext: true,
            complexArchitecture: false,
            toolCalling: true
        },
        minContextTokens: 100000
    },
    efficient: {
        tier: 'efficient',
        displayName: 'Efficient',
        description: 'Fast, cost-effective, limited reasoning',
        capabilities: {
            deepReasoning: false,
            extendedContext: false,
            complexArchitecture: false,
            toolCalling: true
        },
        minContextTokens: 8000
    },
    unknown: {
        tier: 'unknown',
        displayName: 'Unknown',
        description: 'Unrecognized model',
        capabilities: {
            deepReasoning: false,
            extendedContext: false,
            complexArchitecture: false,
            toolCalling: false
        },
        minContextTokens: 0
    }
};

/**
 * Model family to tier mappings
 * Order matters - more specific patterns should come first
 * Updated: 2026-02-10 based on VS Code model picker
 */
const MODEL_FAMILY_PATTERNS: Array<{ pattern: RegExp; tier: ModelTier }> = [
    // ========== FRONTIER (Deep reasoning, 1M+ context) ==========
    // Claude Opus variants
    { pattern: /claude.*opus/i, tier: 'frontier' },
    { pattern: /claude-opus/i, tier: 'frontier' },
    // GPT-5.2 variants (including Codex)
    { pattern: /gpt-5\.2/i, tier: 'frontier' },
    // Reasoning models
    { pattern: /o1-preview/i, tier: 'frontier' },
    { pattern: /o1-pro/i, tier: 'frontier' },
    { pattern: /o3/i, tier: 'frontier' },
    
    // ========== CAPABLE (Good reasoning, 200K-400K context) ==========
    // Claude Sonnet variants
    { pattern: /claude.*sonnet/i, tier: 'capable' },
    { pattern: /claude-sonnet/i, tier: 'capable' },
    // GPT-5.1 variants (all Codex flavors: Max, Mini, base)
    { pattern: /gpt-5\.1/i, tier: 'capable' },
    // GPT-5 base and Codex (not 5.2, not 5-mini)
    { pattern: /gpt-5-codex/i, tier: 'capable' },
    { pattern: /gpt-5(?![\.\-])/i, tier: 'capable' },  // GPT-5 alone
    // GPT-4o
    { pattern: /gpt-4o/i, tier: 'capable' },
    { pattern: /gpt-4-turbo/i, tier: 'capable' },
    // Gemini Pro variants
    { pattern: /gemini.*3.*pro/i, tier: 'capable' },
    { pattern: /gemini.*2\.5.*pro/i, tier: 'capable' },
    { pattern: /gemini-pro/i, tier: 'capable' },
    // o1-mini
    { pattern: /o1-mini/i, tier: 'capable' },
    
    // ========== EFFICIENT (Fast, cost-effective) ==========
    // Claude Haiku
    { pattern: /claude.*haiku/i, tier: 'efficient' },
    { pattern: /claude-haiku/i, tier: 'efficient' },
    // GPT-5 mini
    { pattern: /gpt-5.*mini/i, tier: 'efficient' },
    // GPT-4.1
    { pattern: /gpt-4\.1/i, tier: 'efficient' },
    { pattern: /gpt-4-mini/i, tier: 'efficient' },
    // Gemini Flash
    { pattern: /gemini.*flash/i, tier: 'efficient' },
    // Legacy
    { pattern: /gpt-3\.5/i, tier: 'efficient' },
];

/**
 * Cognitive task definitions with minimum tier requirements
 */
const COGNITIVE_TASKS: Record<string, CognitiveTask> = {
    meditation: {
        name: 'Meditation/Consolidation',
        minimumTier: 'frontier',
        description: 'Deep memory consolidation and knowledge synthesis',
        warning: 'For best results, switch to Opus or GPT-5.2. Consolidation quality may be limited on current model.'
    },
    selfActualization: {
        name: 'Self-Actualization',
        minimumTier: 'frontier',
        description: 'Comprehensive architecture assessment',
        warning: 'Self-actualization works best with Frontier models. Results may be shallow on current model.'
    },
    architectureRefactoring: {
        name: 'Architecture Refactoring',
        minimumTier: 'frontier',
        description: 'Multi-file structural changes',
        warning: 'Complex architecture changes need deep context. Consider switching to a Frontier model.'
    },
    bootstrapLearning: {
        name: 'Bootstrap Learning',
        minimumTier: 'frontier',
        description: 'Acquiring new skills and domain knowledge',
        warning: 'Skill acquisition needs maximum reasoning. A Frontier model will produce better results.'
    },
    skillSelection: {
        name: 'Skill Selection Optimization',
        minimumTier: 'capable',
        description: 'Proactive resource planning',
        warning: 'SSO works on Capable+ models. Current model may produce incomplete plans.'
    },
    dream: {
        name: 'Dream/Neural Maintenance',
        minimumTier: 'capable',
        description: 'Synapse validation and repair',
        warning: 'Dream protocol works on Capable+ models.'
    },
    codeReview: {
        name: 'Code Review',
        minimumTier: 'capable',
        description: 'Analyzing and reviewing code',
        warning: 'Code review works better on Capable+ models.'
    },
    debugging: {
        name: 'Debugging',
        minimumTier: 'capable',
        description: 'Finding and fixing bugs',
        warning: 'Complex debugging benefits from Capable+ models.'
    },
    simpleEdits: {
        name: 'Simple Edits',
        minimumTier: 'efficient',
        description: 'Formatting, renaming, small changes'
    },
    documentation: {
        name: 'Documentation',
        minimumTier: 'efficient',
        description: 'Writing and updating docs'
    },
    lookup: {
        name: 'Information Lookup',
        minimumTier: 'efficient',
        description: 'Searching and retrieving information'
    }
};

// ============================================================================
// MODEL DETECTION
// ============================================================================

/**
 * Detect the tier of a model based on its family/name
 */
export function detectModelTier(model: vscode.LanguageModelChat): ModelTier {
    // Try matching against known patterns
    const searchString = `${model.family} ${model.name} ${model.id}`;
    
    for (const { pattern, tier } of MODEL_FAMILY_PATTERNS) {
        if (pattern.test(searchString)) {
            return tier;
        }
    }
    
    // Fallback: use context size as a heuristic
    if (model.maxInputTokens >= 200000) {
        return 'frontier';
    } else if (model.maxInputTokens >= 100000) {
        return 'capable';
    } else if (model.maxInputTokens >= 8000) {
        return 'efficient';
    }
    
    return 'unknown';
}

/**
 * Get full model information from a ChatRequest
 */
export function getModelInfo(request: vscode.ChatRequest): DetectedModel {
    const model = request.model;
    const tier = detectModelTier(model);
    
    return {
        id: model.id,
        name: model.name,
        family: model.family,
        vendor: model.vendor,
        version: model.version,
        maxInputTokens: model.maxInputTokens,
        tier,
        tierInfo: MODEL_TIERS[tier]
    };
}

/**
 * Get tier info by tier name
 */
export function getTierInfo(tier: ModelTier): ModelTierInfo {
    return MODEL_TIERS[tier];
}

// ============================================================================
// TASK-MODEL MATCHING
// ============================================================================

/**
 * Check if a model tier is sufficient for a task
 */
export function isTierSufficient(modelTier: ModelTier, requiredTier: TaskComplexity): boolean {
    const tierOrder: Record<ModelTier, number> = {
        frontier: 3,
        capable: 2,
        efficient: 1,
        unknown: 0
    };
    
    const requiredOrder: Record<TaskComplexity, number> = {
        frontier: 3,
        capable: 2,
        efficient: 1
    };
    
    return tierOrder[modelTier] >= requiredOrder[requiredTier];
}

/**
 * Get task definition by key
 */
export function getTask(taskKey: string): CognitiveTask | undefined {
    return COGNITIVE_TASKS[taskKey];
}

/**
 * Check if model is appropriate for a task, return warning if not
 */
export function checkTaskModelMatch(
    modelTier: ModelTier, 
    taskKey: string
): { suitable: boolean; warning?: string; task?: CognitiveTask } {
    const task = COGNITIVE_TASKS[taskKey];
    
    if (!task) {
        return { suitable: true }; // Unknown task, assume OK
    }
    
    const suitable = isTierSufficient(modelTier, task.minimumTier);
    
    return {
        suitable,
        warning: !suitable ? task.warning : undefined,
        task
    };
}

/**
 * Get all tasks that require a specific tier or higher
 */
export function getTasksForTier(tier: TaskComplexity): CognitiveTask[] {
    return Object.values(COGNITIVE_TASKS).filter(task => task.minimumTier === tier);
}

// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * Format a model warning message for display
 */
export function formatModelWarning(
    detectedModel: DetectedModel, 
    taskKey: string
): string | undefined {
    const match = checkTaskModelMatch(detectedModel.tier, taskKey);
    
    if (match.suitable || !match.warning) {
        return undefined;
    }
    
    return `⚠️ **Model Tip**: ${match.warning}\n\n*Current model: ${detectedModel.name} (${detectedModel.tierInfo.displayName} tier)*`;
}

/**
 * Format model info for status display
 */
export function formatModelStatus(model: DetectedModel): string {
    const tierEmoji = {
        frontier: '🚀',
        capable: '⚡',
        efficient: '💨',
        unknown: '❓'
    };
    
    return `${tierEmoji[model.tier]} **${model.name}** — ${model.tierInfo.displayName} tier (${model.maxInputTokens.toLocaleString()} tokens)`;
}

/**
 * Get model recommendation for a task
 */
export function getModelRecommendation(taskKey: string): string {
    const task = COGNITIVE_TASKS[taskKey];
    
    if (!task) {
        return 'Any model works for this task.';
    }
    
    switch (task.minimumTier) {
        case 'frontier':
            return 'Recommended: Claude Opus 4.5/4.6 or GPT-5.2 for best results.';
        case 'capable':
            return 'Recommended: Claude Sonnet 4+ or GPT-5.1/GPT-4o for reliable results.';
        case 'efficient':
            return 'Any model works well for this task.';
    }
}

// ============================================================================
// MODEL SELECTION ADVISOR
// ============================================================================

/**
 * Model recommendation with reasoning
 */
export interface ModelRecommendation {
    action: 'upgrade' | 'downgrade' | 'keep';
    reason: string;
    currentTier: ModelTier;
    suggestedTier?: ModelTier;
    suggestedModels: string[];
    savings?: string;
}

/**
 * Available models for each tier (for recommendations)
 */
const TIER_MODEL_SUGGESTIONS: Record<ModelTier, string[]> = {
    frontier: [
        'Claude Opus 4.5',
        'Claude Opus 4.6',
        'GPT-5.2',
        'GPT-5.2-Codex'
    ],
    capable: [
        'Claude Sonnet 4.5',
        'Claude Sonnet 4',
        'GPT-5.1-Codex',
        'GPT-4o',
        'Gemini 2.5 Pro'
    ],
    efficient: [
        'Claude Haiku 4.5',
        'GPT-5 mini',
        'GPT-4.1',
        'Gemini 3 Flash'
    ],
    unknown: []
};

/**
 * Analyze task intent from user prompt
 */
export function detectTaskFromPrompt(prompt: string): string | undefined {
    const promptLower = prompt.toLowerCase();
    
    // Frontier tasks
    if (/meditat|consolidat|reflect/.test(promptLower)) {return 'meditation';}
    if (/self-actuali|deep assess|architecture review/.test(promptLower)) {return 'selfActualization';}
    if (/refactor.*architecture|restructure|major redesign/.test(promptLower)) {return 'architectureRefactoring';}
    if (/learn.*new|bootstrap|acquire.*skill|teach me/.test(promptLower)) {return 'bootstrapLearning';}
    
    // Capable tasks
    if (/dream|maintenance|health check|synapse/.test(promptLower)) {return 'dream';}
    if (/review.*code|code review|pr review/.test(promptLower)) {return 'codeReview';}
    if (/debug|fix.*bug|troubleshoot|error/.test(promptLower)) {return 'debugging';}
    if (/skill select|plan.*task|optimize.*skill/.test(promptLower)) {return 'skillSelection';}
    
    // Efficient tasks
    if (/format|rename|simple edit|typo|spelling/.test(promptLower)) {return 'simpleEdits';}
    if (/doc|readme|comment|jsdoc/.test(promptLower)) {return 'documentation';}
    if (/what is|explain|look up|find|search/.test(promptLower)) {return 'lookup';}
    
    return undefined;
}

/**
 * Get model selection advice based on current model and detected/specified task
 */
export function getModelAdvice(
    currentModel: DetectedModel,
    taskKey?: string,
    prompt?: string
): ModelRecommendation {
    // Try to detect task from prompt if not specified
    const detectedTask = taskKey || (prompt ? detectTaskFromPrompt(prompt) : undefined);
    const task = detectedTask ? COGNITIVE_TASKS[detectedTask] : undefined;
    
    // If no task detected, provide general advice
    if (!task) {
        return {
            action: 'keep',
            reason: `Current model (${currentModel.name}) is suitable for general tasks.`,
            currentTier: currentModel.tier,
            suggestedModels: []
        };
    }
    
    const currentTierOrder = { frontier: 3, capable: 2, efficient: 1, unknown: 0 };
    const requiredTierOrder = { frontier: 3, capable: 2, efficient: 1 };
    
    const currentOrder = currentTierOrder[currentModel.tier];
    const requiredOrder = requiredTierOrder[task.minimumTier];
    
    // Check if upgrade needed
    if (currentOrder < requiredOrder) {
        return {
            action: 'upgrade',
            reason: `**${task.name}** requires ${task.minimumTier} tier. Current model may produce limited results.`,
            currentTier: currentModel.tier,
            suggestedTier: task.minimumTier as ModelTier,
            suggestedModels: TIER_MODEL_SUGGESTIONS[task.minimumTier as ModelTier] || []
        };
    }
    
    // Check if downgrade possible (cost savings)
    if (currentOrder > requiredOrder && currentModel.tier === 'frontier' && task.minimumTier === 'efficient') {
        return {
            action: 'downgrade',
            reason: `**${task.name}** works fine on Efficient models. Consider switching to save costs.`,
            currentTier: currentModel.tier,
            suggestedTier: 'efficient',
            suggestedModels: TIER_MODEL_SUGGESTIONS.efficient,
            savings: 'Up to 90% cost reduction for simple tasks'
        };
    }
    
    // Current model is appropriate
    return {
        action: 'keep',
        reason: `**${task.name}** — ${currentModel.name} is appropriate for this task.`,
        currentTier: currentModel.tier,
        suggestedModels: []
    };
}

/**
 * Format model advice for display in chat
 */
export function formatModelAdvice(advice: ModelRecommendation): string {
    const actionEmoji = {
        upgrade: '⬆️',
        downgrade: '⬇️',
        keep: '✅'
    };
    
    let output = `${actionEmoji[advice.action]} ${advice.reason}`;
    
    if (advice.suggestedModels.length > 0) {
        output += `\n\n**Suggested models:**\n${advice.suggestedModels.map(m => `- ${m}`).join('\n')}`;
    }
    
    if (advice.savings) {
        output += `\n\n💰 *${advice.savings}*`;
    }
    
    return output;
}

/**
 * Get comprehensive model dashboard for /model command
 */
export function formatModelDashboard(model: DetectedModel, prompt?: string): string {
    const tierEmoji = {
        frontier: '🚀',
        capable: '⚡',
        efficient: '💨',
        unknown: '❓'
    };
    
    const capabilities = model.tierInfo.capabilities;
    
    let output = `## 🧠 Model Intelligence

### Current Model
${tierEmoji[model.tier]} **${model.name}**
- **Tier**: ${model.tierInfo.displayName}
- **Context**: ${model.maxInputTokens.toLocaleString()} tokens
- **Family**: ${model.family}
- **Vendor**: ${model.vendor}

### Capabilities
| Capability | Status |
|------------|--------|
| Deep Reasoning | ${capabilities.deepReasoning ? '✅' : '❌'} |
| Extended Context | ${capabilities.extendedContext ? '✅' : '❌'} |
| Complex Architecture | ${capabilities.complexArchitecture ? '✅' : '❌'} |
| Tool Calling | ${capabilities.toolCalling ? '✅' : '❌'} |
`;

    // Add task-specific advice if prompt provided
    if (prompt) {
        const advice = getModelAdvice(model, undefined, prompt);
        output += `\n### Recommendation\n${formatModelAdvice(advice)}`;
    } else {
        output += `\n### Task Recommendations

| Task Type | Minimum Tier | Current Model |
|-----------|--------------|---------------|
| Meditation, Self-Actualization, Architecture | Frontier | ${model.tier === 'frontier' ? '✅' : '⚠️ Upgrade recommended'} |
| Code Review, Debugging, Dream | Capable | ${model.tier !== 'efficient' ? '✅' : '⚠️ Upgrade recommended'} |
| Simple Edits, Documentation | Efficient | ✅ |

*Use \`/model <task description>\` for specific advice.*`;
    }
    
    return output;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    MODEL_TIERS,
    COGNITIVE_TASKS,
    TIER_MODEL_SUGGESTIONS
};
