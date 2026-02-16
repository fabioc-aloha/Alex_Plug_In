/**
 * Alex Prompt Engine - v5.8.2
 * 
 * Modular 10-layer prompt builder that transforms @alex from a passthrough
 * into a purpose-built cognitive assistant with full identity awareness.
 * 
 * Architecture:
 *   Layer 1: Identity Core (from copilot-instructions.md)
 *   Layer 2: Active Context (persona, objective, focus trifectas) + Persona-driven tone
 *   Layer 3: Conversation History (last 4 exchanges)
 *   Layer 4: User Profile (personalization)
 *   Layer 5: Focus Session (Pomodoro state)
 *   Layer 6: Emotional Intelligence
 *   Layer 7: Model-Adaptive Rules
 *   Layer 8: File Context
 *   Layer 9: Knowledge Context (pre-seeded from global knowledge)
 *   Layer 10: Response Guidelines + Confidence signaling
 * 
 * @see alex_docs/features/ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md
 */

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { readActiveContext, ActiveContext } from '../shared/activeContextManager';
import { IUserProfile } from './tools';
import { DetectedModel, ModelTier, getTierInfo } from './modelIntelligence';
import { getCurrentSession } from '../commands/session';
import { getGoalsSummary } from '../commands/goals';
import { searchGlobalKnowledge } from './globalKnowledge';
import { PERSONAS, Persona } from './personaDetection';

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
    };
    model: DetectedModel;
    history: readonly (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[];
    request: vscode.ChatRequest;
}

// ============================================================================
// Main Prompt Builder
// ============================================================================

/**
 * Build the complete Alex system prompt from modular layers.
 * Each layer contributes context, and the final prompt is assembled
 * with appropriate token budgeting.
 */
export async function buildAlexSystemPrompt(ctx: PromptContext): Promise<string> {
    const layers = await Promise.all([
        buildIdentityLayer(ctx),           // Layer 1: Who Alex is
        buildActiveContextLayer(ctx),      // Layer 2: Current state + persona-driven tone
        buildConversationHistoryLayer(ctx), // Layer 3: Recent exchanges
        buildUserProfileLayer(ctx),        // Layer 4: Personalization
        buildFocusSessionLayer(ctx),       // Layer 5: Pomodoro/goals
        buildKnowledgeContextLayer(ctx),   // Layer 9: Pre-seeded knowledge
        buildModelAdaptiveLayer(ctx),      // Layer 7: Tier-specific rules
        buildResponseGuidelinesLayer(ctx), // Layer 10: Formatting + confidence
    ]);

    // Filter out empty layers and join with double newlines
    return layers.filter(Boolean).join('\n\n');
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
    const brainPath = path.join(ctx.workspaceRoot, '.github', 'copilot-instructions.md');
    
    if (!await fs.pathExists(brainPath)) {
        // Fallback to minimal identity if brain file doesn't exist
        return `You are Alex "Mini" Finch, a meta-cognitive learning partner. You help users through bootstrap learning, ethical reasoning, and grounded factual processing.`;
    }

    try {
        const brain = await fs.readFile(brainPath, 'utf-8');

        // Extract Identity section (between ## Identity and next ##)
        const identityMatch = brain.match(/## Identity\n<!-- ([^>]+) -->\n([\s\S]*?)(?=\n## )/);
        
        // Extract Safety Imperatives (non-negotiable rules)
        const safetyMatch = brain.match(/## Safety Imperatives[^\n]*\n([\s\S]*?)(?=\n## )/);

        let identityText = '';
        if (identityMatch) {
            // Include the validation comment for context
            identityText = identityMatch[2].trim();
        }

        let safetyText = '';
        if (safetyMatch) {
            // Extract first 5 imperatives (I1-I5) to keep token budget reasonable
            const safetyLines = safetyMatch[1].trim().split('\n').slice(0, 10);
            safetyText = safetyLines.join('\n');
        }

        if (!identityText && !safetyText) {
            return `You are Alex "Mini" Finch, a meta-cognitive learning partner.`;
        }

        return `## Who You Are
${identityText}

## Safety Rules (Non-Negotiable)
${safetyText}`;
    } catch (err) {
        console.warn('[PromptEngine] Failed to read identity from brain:', err);
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
        if (!activeCtx) { return ''; }

        const parts: string[] = ['## Current Session State'];

        // v5.8.2: Persona-driven prompt enhancement
        let personaTone = '';
        if (activeCtx.persona) {
            const persona = PERSONAS.find(p => p.id === activeCtx.persona || p.name === activeCtx.persona);
            if (persona) {
                parts.push(`- **Project Type**: ${persona.name} (${persona.bannerNoun})`);
                parts.push(`- **Tone**: ${getPersonaTone(persona)}`);
                parts.push(`- **Recommended Skill**: ${persona.skill}`);
            } else {
                parts.push(`- **Detected Project Type**: ${activeCtx.persona}`);
            }
        }

        if (activeCtx.objective && activeCtx.objective !== '*(session-objective — set by user or focus timer)*') {
            parts.push(`- **Current Objective**: ${activeCtx.objective}`);
        }

        if (activeCtx.focusTrifectas) {
            parts.push(`- **Focus Areas**: ${activeCtx.focusTrifectas}`);
        }

        if (activeCtx.principles) {
            parts.push(`- **Principles**: ${activeCtx.principles}`);
        }

        if (parts.length === 1) { return ''; } // No meaningful context

        return parts.join('\n');
    } catch (err) {
        console.warn('[PromptEngine] Failed to read Active Context:', err);
        return '';
    }
}

/**
 * Get persona-specific tone guidance.
 * Maps persona characteristics to communication style.
 */
function getPersonaTone(persona: Persona): string {
    const toneMap: Record<string, string> = {
        'developer': 'Pragmatic, code-focused, optimization-minded',
        'academic': 'Scholarly, rigorous, citation-aware',
        'researcher': 'Analytical, evidence-based, hypothesis-driven',
        'technical-writer': 'Clear, structured, documentation-first',
        'architect': 'Strategic, design-focused, scalability-conscious',
        'data-engineer': 'Data-centric, pipeline-aware, performance-focused',
        'devops': 'Infrastructure-first, automation-minded, reliability-focused',
        'content-creator': 'Creative, audience-aware, engagement-focused',
        'fiction-writer': 'Narrative-driven, character-focused, story-conscious',
        'game-developer': 'Experience-first, mechanics-aware, player-focused',
        'project-manager': 'Deliverable-focused, timeline-aware, stakeholder-conscious',
        'security': 'Threat-aware, defense-focused, compliance-minded',
        'student': 'Learning-oriented, curious, foundational-focused',
        'job-seeker': 'Career-focused, achievement-oriented, skill-building',
        'presenter': 'Audience-aware, clarity-focused, impact-driven',
        'power-user': 'Efficiency-minded, shortcut-aware, productivity-focused',
    };
    return toneMap[persona.id] || 'Professional, helpful, context-aware';
}

// ============================================================================
// Layer 3: Conversation History
// ============================================================================

/**
 * Include the last 4 exchanges from chat history to give @alex conversation memory.
 * Compresses each turn to ~50-100 tokens.
 * 
 * Token budget: ~300 tokens (4 exchanges × ~75 tokens each)
 */
async function buildConversationHistoryLayer(ctx: PromptContext): Promise<string> {
    if (ctx.history.length === 0) { return ''; }

    // Get last 8 turns (4 user + 4 assistant exchanges)
    const recentTurns = ctx.history.slice(-8);
    
    if (recentTurns.length === 0) { return ''; }

    const historyLines: string[] = ['## Recent Conversation'];

    for (const turn of recentTurns) {
        if (turn instanceof vscode.ChatRequestTurn) {
            // User request
            const prompt = turn.prompt.length > 150 
                ? turn.prompt.substring(0, 150) + '...' 
                : turn.prompt;
            historyLines.push(`**User**: ${prompt}`);
        } else if (turn instanceof vscode.ChatResponseTurn) {
            // Assistant response - extract first sentence or ~100 chars
            const response = turn.response
                .map(part => {
                    if (part instanceof vscode.ChatResponseMarkdownPart) {
                        return part.value.value;
                    }
                    return '';
                })
                .join('')
                .trim();

            if (response) {
                // Get first sentence or first 100 chars
                const firstSentence = response.split(/[.!?]/)[0];
                const summary = firstSentence.length > 100 
                    ? response.substring(0, 100) + '...' 
                    : firstSentence + '.';
                historyLines.push(`**Alex**: ${summary}`);
            }
        }
    }

    if (historyLines.length === 1) { return ''; }

    return historyLines.join('\n');
}

// ============================================================================
// Layer 4: User Profile
// ============================================================================

/**
 * Inject personalization from user profile.
 * 
 * Token budget: ~150 tokens
 */
async function buildUserProfileLayer(ctx: PromptContext): Promise<string> {
    if (!ctx.profile) {
        return `## User Profile
No profile exists yet. You can proactively ask for their name and preferences to personalize the experience.`;
    }

    const userName = ctx.profile.nickname || ctx.profile.name;
    const parts: string[] = ['## User Profile'];

    if (userName) {
        parts.push(`**Always address the user as "${userName}"** in your responses.`);
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
        parts.push(`- Technologies: ${ctx.profile.primaryTechnologies.join(', ')}`);
    }

    if (ctx.profile.learningGoals?.length) {
        parts.push(`- Learning goals: ${ctx.profile.learningGoals.join(', ')}`);
    }

    return parts.join('\n');
}

// ============================================================================
// Layer 5: Focus Session
// ============================================================================

/**
 * Include active Pomodoro session and goals.
 * 
 * Token budget: ~120 tokens
 */
async function buildFocusSessionLayer(ctx: PromptContext): Promise<string> {
    const session = getCurrentSession();
    const goals = await getGoalsSummary();

    const parts: string[] = [];

    if (session) {
        const remainingMins = Math.floor(session.remaining / 60);
        const sessionType = session.isBreak ? 'break' : 'focus session';
        
        parts.push(`## Active Focus Context`);
        parts.push(`- **Current ${sessionType}**: "${session.topic}"`);
        parts.push(`- **Time remaining**: ${remainingMins} minutes`);
        
        if (session.pomodoroCount > 0) {
            parts.push(`- **Pomodoro #${session.pomodoroCount}**`);
        }

        parts.push('');
        parts.push('**Keep responses focused and actionable** to respect their Pomodoro time.');
    }

    if (goals.activeGoals.length > 0) {
        if (parts.length === 0) {
            parts.push('## Active Goals');
        } else {
            parts.push('');
            parts.push('**Active Goals**:');
        }
        
        goals.activeGoals.slice(0, 3).forEach(g => {
            parts.push(`- ${g.title}: ${g.currentCount}/${g.targetCount} ${g.unit}`);
        });

        if (goals.streakDays > 0) {
            parts.push(`- 🔥 **${goals.streakDays}-day streak** — help them keep it going!`);
        }
    }

    return parts.length > 0 ? parts.join('\n') : '';
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
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);
        
        const terms = ctx.request.prompt
            .toLowerCase()
            .split(/\W+/)
            .filter(w => w.length > 3 && !stopWords.has(w))
            .slice(0, 5); // Top 5 key terms

        if (terms.length === 0) { return ''; }

        // Search global knowledge for relevant patterns/insights
        const searchQuery = terms.join(' ');
        const results = await searchGlobalKnowledge(searchQuery, { limit: 3 }); // Top 3 results

        if (results.length === 0) { return ''; }

        const parts: string[] = ['## Relevant Knowledge Context'];
        for (const result of results) {
            // Compress to title + 1-sentence summary
            const firstSentence = result.entry.summary.split(/[.!?]/)[0];
            parts.push(`- **${result.entry.title}** (${result.entry.category}): ${firstSentence}.`);
        }

        return parts.join('\n');
    } catch (err) {
        console.warn('[PromptEngine] Failed to search knowledge context:', err);
        return '';
    }
}

// ============================================================================
// Layer 7: Model-Adaptive Rules
// ============================================================================

/**
 * Inject model tier-specific guidance for response style.
 * 
 * Token budget: ~100 tokens
 */
async function buildModelAdaptiveLayer(ctx: PromptContext): Promise<string> {
    const tierInfo = getTierInfo(ctx.model.tier);

    if (ctx.model.tier === 'frontier') {
        return `## Your Capabilities (${tierInfo.displayName} Model)
You have deep reasoning capabilities. Feel free to:
- Think through complex problems step-by-step
- Explore multiple solution paths
- Provide thorough explanations with nuance
- Handle large context windows effectively`;
    } else if (ctx.model.tier === 'capable') {
        return `## Your Capabilities (${tierInfo.displayName} Model)
Provide:
- Clear, well-structured responses
- Balanced depth without overwhelming detail
- Practical solutions over theoretical exploration`;
    } else if (ctx.model.tier === 'efficient') {
        return `## Your Capabilities (${tierInfo.displayName} Model)
Focus on:
- Concise, actionable answers
- Direct solutions without extensive exploration
- Efficient responses that get to the point quickly`;
    }

    return '';
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
async function buildResponseGuidelinesLayer(ctx: PromptContext): Promise<string> {
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
