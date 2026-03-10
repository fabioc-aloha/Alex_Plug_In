/**
 * Cognitive State Detection
 *
 * Detects cognitive state from user messages via keyword matching.
 * Used by participant.ts to update sidebar state display.
 *
 * v6.5.0: Gutted — avatar system removed (personas are text-based now).
 * Only cognitive state detection remains.
 */

/**
 * Keywords that trigger cognitive state detection.
 * Maps user activity patterns to cognitive states.
 */
export const COGNITIVE_STATE_TRIGGERS: Record<string, string[]> = {
    'debugging': [
        'debug', 'bug', 'error', 'exception', 'stack trace', 'breakpoint',
        'fix', 'broken', 'crash', 'investigate', 'troubleshoot', 'issue'
    ],
    'planning': [
        'plan', 'architect', 'design', 'strategy', 'roadmap', 'structure',
        'organize', 'diagram', 'flowchart', 'ADR', 'decision'
    ],
    'building': [
        'implement', 'build', 'create', 'develop', 'code', 'write',
        'add feature', 'scaffold', 'generate'
    ],
    'reviewing': [
        'review', 'PR', 'pull request', 'code review', 'feedback',
        'check', 'validate', 'audit', 'analyze code'
    ],
    'learning': [
        'learn', 'understand', 'explain', 'teach me', 'how does',
        'what is', 'tutorial', 'guide', 'documentation'
    ],
    'teaching': [
        'explain to', 'help understand', 'mentor', 'onboard',
        'show how', 'demonstrate', 'walk through'
    ],
    'meditation': [
        'meditate', 'consolidate', 'reflect', 'synapse'
    ],
    'dream': [
        'dream', 'neural maintenance', 'sleep', 'unconscious',
        'background processing', 'night mode'
    ],
    'discovery': [
        'eureka', 'found it', 'realized', 'breakthrough', 'insight',
        'pattern', 'connection', 'discovered'
    ],
};

/**
 * Detect cognitive state from user message.
 * @param message - User's chat message
 * @returns Detected cognitive state or null
 */
export function detectCognitiveState(message: string): string | null {
    const lowerMessage = message.toLowerCase();

    for (const [state, triggers] of Object.entries(COGNITIVE_STATE_TRIGGERS)) {
        for (const trigger of triggers) {
            if (lowerMessage.includes(trigger.toLowerCase())) {
                return state;
            }
        }
    }

    return null;
}
