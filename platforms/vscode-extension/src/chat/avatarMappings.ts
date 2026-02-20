/**
 * Avatar Mappings Module
 * 
 * Comprehensive mappings for Alex's visual identity system:
 * - Persona avatars: 63 role-specific images
 * - Age progression: 13 age-specific images (fallback when no activity)
 * - Agent modes: 6 specialized agent banners
 * - Cognitive states: 8 task-specific state portraits
 * 
 * v5.9.1 Feature: Enhanced Visual Identity System
 * 
 * AVATAR SELECTION PRIORITY:
 * 1. Cognitive State - If user is in a detectable cognitive state (debugging, planning, etc.)
 * 2. Agent Mode - If user invoked a specific agent (@Researcher, @Builder, etc.)
 * 3. Persona - Based on detected persona from work context
 * 4. Age Fallback - Based on user's age from profile birthday
 * 
 * Image locations:
 * - personas/PERSONA-*.png (63 images)
 * - ages/Alex-*.png (13 images: 3, 7, 13, 15, 18, 21, 25, 30, 42, 55, 62, 68, 75)
 * - agents/AGENT-*.png (6 images)
 * - states/STATE-*.png (8 images)
 */

// ============================================================================
// PERSONA AVATAR MAPPINGS
// Maps persona IDs to image filenames in assets/avatars/personas/
// ============================================================================

/**
 * Maps persona ID to avatar image filename (without path/extension).
 * Images are in assets/avatars/personas/PERSONA-*.png
 */
export const PERSONA_AVATAR_MAP: Record<string, string> = {
    // Core developer personas
    'developer':           'PERSONA-DEVELOPER',
    'fullstack-developer': 'PERSONA-FULLSTACK-DEVELOPER',
    'mobile-developer':    'PERSONA-MOBILE-DEVELOPER',
    'game-developer':      'PERSONA-GAME-DEVELOPER',
    'code-reviewer':       'PERSONA-CODE-REVIEWER',
    'debugger':            'PERSONA-DEBUGGER',
    
    // Cloud & Infrastructure
    'architect':           'PERSONA-ARCHITECT',
    'solutions-architect': 'PERSONA-SOLUTIONS-ARCHITECT',
    'cloud-architect':     'PERSONA-CLOUD-ARCHITECT',
    'devops':              'PERSONA-DEVOPS',
    'sre':                 'PERSONA-SRE',
    'dba':                 'PERSONA-DBA',
    'database-developer':  'PERSONA-DATABASE-DEVELOPER',
    
    // Platform-specific
    'microsoft-developer': 'PERSONA-MICROSOFT-DEVELOPER',
    'aws-developer':       'PERSONA-AWS-DEVELOPER',
    'fabric-developer':    'PERSONA-FABRIC-DEVELOPER',
    'openai-developer':    'PERSONA-OPENAI-DEVELOPER',
    'oracle-developer':    'PERSONA-ORACLE-DEVELOPER',
    
    // AI & ML
    'ai-engineer':         'PERSONA-AI-ENGINEER',
    'ml-ops':              'PERSONA-ML-OPS',
    'cognitive-scientist': 'PERSONA-COGNITIVE-SCIENTIST',
    
    // Data
    'data-engineer':       'PERSONA-DATA-ENGINEER',
    'bi-analyst':          'PERSONA-BI-ANALYST',
    
    // Research & Academic
    'academic':            'PERSONA-ACADEMIC',
    'researcher':          'PERSONA-RESEARCHER',
    'cx-researcher':       'PERSONA-CX-RESEARCHER',
    'ux-researcher':       'PERSONA-UX-RESEARCHER',
    
    // Writing & Documentation
    'technical-writer':    'PERSONA-TECHNICAL-WRITER',
    'documentarian':       'PERSONA-DOCUMENTARIAN',
    'content-creator':     'PERSONA-CONTENT-CREATOR',
    'copywriter':          'PERSONA-COPYWRITER',
    'fiction-writer':      'PERSONA-FICTION-WRITER',
    'grant-writer':        'PERSONA-GRANT-WRITER',
    'book-author':         'PERSONA-BOOK-AUTHOR',
    
    // Business & Management
    'business-analyst':    'PERSONA-BUSINESS-ANALYST',
    'product-manager':     'PERSONA-PRODUCT-MANAGER',
    'project-manager':     'PERSONA-PROJECT-MANAGER',
    'consultant':          'PERSONA-CONSULTANT',
    'marketer':            'PERSONA-MARKETER',
    'startup-founder':     'PERSONA-STARTUP-FOUNDER',
    'tech-lead':           'PERSONA-TECH-LEAD',
    
    // Quality & Security
    'qa-engineer':         'PERSONA-QA-ENGINEER',
    'security':            'PERSONA-SECURITY',
    'auditor':             'PERSONA-AUDITOR',
    'red-team':            'PERSONA-RED-TEAM',
    
    // Teaching & Learning
    'student':             'PERSONA-STUDENT',
    'bootcamp-grad':       'PERSONA-BOOTCAMP-GRAD',
    'teaching-assistant':  'PERSONA-TEACHING-ASSISTANT',
    'presenter':           'PERSONA-PRESENTER',
    
    // Career
    'job-seeker':          'PERSONA-JOB-SEEKER',
    'oss-contributor':     'PERSONA-OSS-CONTRIBUTOR',
    
    // Special & Fun
    'power-user':          'PERSONA-POWER-USER',
    'knowledge-worker':    'PERSONA-KNOWLEDGE-WORKER',
    'questionnaire-developer': 'PERSONA-QUESTIONNAIRE-DEVELOPER',
    'gcx-team':            'PERSONA-GCX-TEAM',
    
    // Fun/Easter egg personas
    'hacker':              'PERSONA-HACKER',
    'night-owl':           'PERSONA-NIGHT-OWL',
    'coffee-coder':        'PERSONA-COFFEE-CODER',
    'rubber-duck':         'PERSONA-RUBBER-DUCK',
    'stack-overflow':      'PERSONA-STACK-OVERFLOW',
    'imposter':            'PERSONA-IMPOSTER',
    'mad-scientist':       'PERSONA-MAD-SCIENTIST',
    'fabio-special':       'PERSONA-FABIO-SPECIAL',
};

// ============================================================================
// AGE PROGRESSION AVATARS
// Maps ages to Alex at different life stages
// ============================================================================

/**
 * Available ages in the progression (sorted).
 * Used to find closest age for fallback.
 */
export const AVAILABLE_AGES = [3, 7, 13, 15, 18, 21, 25, 30, 42, 55, 62, 68, 75] as const;

/**
 * Maps age to avatar filename in assets/avatars/ages/
 */
export const AGE_AVATAR_MAP: Record<number, string> = {
    3:  'Alex-03',
    7:  'Alex-07',
    13: 'Alex-13',
    15: 'Alex-15',
    18: 'Alex-18',
    21: 'Alex-21',
    25: 'Alex-25',
    30: 'Alex-30',
    42: 'Alex-42',
    55: 'Alex-55',
    62: 'Alex-62',
    68: 'Alex-68',
    75: 'Alex-75',
};

/**
 * Find the closest available age avatar for a given age.
 * @param age - User's actual age
 * @returns Closest age from AVAILABLE_AGES
 */
export function findClosestAge(age: number): number {
    const ages = AVAILABLE_AGES as readonly number[];
    if (age <= ages[0]) { return ages[0]; }
    if (age >= ages[ages.length - 1]) { return ages[ages.length - 1]; }
    
    let closest = ages[0];
    let minDiff = Math.abs(age - closest);
    
    for (const availableAge of ages) {
        const diff = Math.abs(age - availableAge);
        if (diff < minDiff) {
            minDiff = diff;
            closest = availableAge;
        }
    }
    
    return closest;
}

/**
 * Calculate age from birthday string.
 * @param birthday - ISO date string (e.g., "1968-03-07")
 * @returns Age in years, or null if invalid
 */
export function calculateAge(birthday: string | undefined): number | null {
    if (!birthday) { return null; }
    
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) { return null; }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age > 0 ? age : null;
}

/**
 * Get age-based avatar filename for a user.
 * @param birthday - User's birthday (ISO string)
 * @returns Avatar filename or null
 */
export function getAgeAvatar(birthday: string | undefined): string | null {
    const age = calculateAge(birthday);
    if (age === null) { return null; }
    
    const closestAge = findClosestAge(age);
    return AGE_AVATAR_MAP[closestAge] || null;
}

// ============================================================================
// AGENT MODE AVATARS
// Maps agent names to banners in assets/avatars/agents/
// ============================================================================

/**
 * Maps agent mode to avatar filename.
 * Note: Default "Alex" agent uses persona images instead.
 */
export const AGENT_AVATAR_MAP: Record<string, string> = {
    'researcher':    'AGENT-RESEARCHER',
    'builder':       'AGENT-BUILDER',
    'validator':     'AGENT-VALIDATOR',
    'documentarian': 'AGENT-DOCUMENTARIAN',
    'azure':         'AGENT-AZURE',
    'm365':          'AGENT-M365',
};

/**
 * Get avatar for an agent mode.
 * @param agentName - Agent name (case-insensitive)
 * @returns Avatar filename or null for default Alex agent
 */
export function getAgentAvatar(agentName: string): string | null {
    const normalized = agentName.toLowerCase().trim();
    if (normalized === 'alex') { return null; } // Default uses persona
    return AGENT_AVATAR_MAP[normalized] || null;
}

// ============================================================================
// COGNITIVE STATE AVATARS
// Maps cognitive states to portraits in assets/avatars/states/
// ============================================================================

/**
 * Maps cognitive state to avatar filename.
 */
export const COGNITIVE_STATE_MAP: Record<string, string> = {
    'meditation':   'STATE-MEDITATION',
    'debugging':    'STATE-DEBUGGING',
    'discovery':    'STATE-DISCOVERY',
    'planning':     'STATE-PLANNING',
    'teaching':     'STATE-TEACHING',
    'building':     'STATE-BUILDING',
    'reviewing':    'STATE-REVIEWING',
    'code-review':  'STATE-REVIEWING',
    'learning':     'STATE-LEARNING',
};

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
        'meditate', 'consolidate', 'reflect', 'neural maintenance',
        'dream state', 'synapse'
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

/**
 * Get avatar for a cognitive state.
 * @param state - Cognitive state name
 * @returns Avatar filename or null
 */
export function getCognitiveStateAvatar(state: string): string | null {
    const normalized = state.toLowerCase().replace(/[_\s]+/g, '-');
    return COGNITIVE_STATE_MAP[normalized] || null;
}

// ============================================================================
// SKILL & TRIFECTA MAPPINGS
// Maps skills to appropriate personas/states
// ============================================================================

/**
 * Maps skill IDs to recommended persona avatars.
 * When a skill is active, prefer its associated persona.
 */
export const SKILL_TO_PERSONA_MAP: Record<string, string> = {
    // Cognitive skills
    'meditation':              'cognitive-scientist',
    'self-actualization':      'cognitive-scientist',
    'deep-thinking':           'researcher',
    'bootstrap-learning':      'student',
    
    // Development skills
    'code-review':             'code-reviewer',
    'testing-strategies':      'qa-engineer',
    'vscode-extension-patterns': 'developer',
    'root-cause-analysis':     'debugger',
    'incident-response':       'sre',
    
    // Documentation skills
    'markdown-mermaid':        'documentarian',
    'knowledge-synthesis':     'technical-writer',
    
    // Architecture skills
    'architecture-health':     'architect',
    
    // Research skills
    'research-first-workflow': 'researcher',
    
    // Cloud skills  
    'azure-enterprise-deployment': 'cloud-architect',
    'mcp-development':         'ai-engineer',
    
    // Quality skills
    'adversarial-oversight':   'qa-engineer',
    'brain-qa':                'auditor',
};

/**
 * Maps skill IDs to cognitive states.
 * Some skills naturally put the user in a cognitive state.
 */
export const SKILL_TO_STATE_MAP: Record<string, string> = {
    'meditation':              'meditation',
    'self-actualization':      'meditation',
    'code-review':             'reviewing',
    'root-cause-analysis':     'debugging',
    'bootstrap-learning':      'learning',
    'research-first-workflow': 'planning',
    'architecture-health':     'planning',
    'testing-strategies':      'reviewing',
    'deep-thinking':           'planning',
};

// ============================================================================
// UNIFIED AVATAR RESOLUTION
// ============================================================================

export interface AvatarContext {
    /** Current agent mode (null for default Alex) */
    agentMode?: string | null;
    /** Detected cognitive state */
    cognitiveState?: string | null;
    /** Active skill ID */
    activeSkill?: string | null;
    /** Detected persona ID */
    personaId?: string | null;
    /** User's birthday for age fallback */
    birthday?: string | null;
    /** Latest user message for state detection */
    message?: string | null;
}

export interface AvatarResult {
    /** Path relative to assets/avatars/ */
    path: string;
    /** Avatar filename (without extension) */
    filename: string;
    /** Source of the avatar selection */
    source: 'agent' | 'state' | 'skill-state' | 'skill-persona' | 'persona' | 'age' | 'default';
    /** Optional label for display */
    label?: string;
}

/**
 * Default avatar when all else fails.
 */
export const DEFAULT_AVATAR = 'Alex-21';
export const DEFAULT_AVATAR_PATH = 'ages/Alex-21';

/**
 * Resolve the best avatar for the current context.
 * 
 * Priority:
 * 1. Agent mode (if not default Alex)
 * 2. Cognitive state (from message or explicit)
 * 3. Skill-triggered state
 * 4. Skill-triggered persona
 * 5. Detected persona
 * 6. Age-based fallback
 * 7. Default (Alex-21)
 * 
 * @param context - Current avatar context
 * @returns Resolved avatar result
 */
export function resolveAvatar(context: AvatarContext): AvatarResult {
    // 1. Agent mode takes highest priority
    if (context.agentMode) {
        const agentAvatar = getAgentAvatar(context.agentMode);
        if (agentAvatar) {
            return {
                path: `agents/${agentAvatar}`,
                filename: agentAvatar,
                source: 'agent',
                label: `${context.agentMode} Agent`
            };
        }
    }
    
    // 2. Explicit cognitive state
    if (context.cognitiveState) {
        const stateAvatar = getCognitiveStateAvatar(context.cognitiveState);
        if (stateAvatar) {
            return {
                path: `states/${stateAvatar}`,
                filename: stateAvatar,
                source: 'state',
                label: context.cognitiveState
            };
        }
    }
    
    // 3. Detect cognitive state from message
    if (context.message) {
        const detectedState = detectCognitiveState(context.message);
        if (detectedState) {
            const stateAvatar = getCognitiveStateAvatar(detectedState);
            if (stateAvatar) {
                return {
                    path: `states/${stateAvatar}`,
                    filename: stateAvatar,
                    source: 'state',
                    label: detectedState
                };
            }
        }
    }
    
    // 4. Skill-triggered cognitive state
    if (context.activeSkill && SKILL_TO_STATE_MAP[context.activeSkill]) {
        const state = SKILL_TO_STATE_MAP[context.activeSkill];
        const stateAvatar = getCognitiveStateAvatar(state);
        if (stateAvatar) {
            return {
                path: `states/${stateAvatar}`,
                filename: stateAvatar,
                source: 'skill-state',
                label: state
            };
        }
    }
    
    // 5. Skill-triggered persona
    if (context.activeSkill && SKILL_TO_PERSONA_MAP[context.activeSkill]) {
        const personaId = SKILL_TO_PERSONA_MAP[context.activeSkill];
        const personaAvatar = PERSONA_AVATAR_MAP[personaId];
        if (personaAvatar) {
            return {
                path: `personas/${personaAvatar}`,
                filename: personaAvatar,
                source: 'skill-persona',
                label: personaId
            };
        }
    }
    
    // 6. Detected persona
    if (context.personaId && PERSONA_AVATAR_MAP[context.personaId]) {
        const personaAvatar = PERSONA_AVATAR_MAP[context.personaId];
        return {
            path: `personas/${personaAvatar}`,
            filename: personaAvatar,
            source: 'persona',
            label: context.personaId
        };
    }
    
    // 7. Age-based fallback
    if (context.birthday) {
        const ageAvatar = getAgeAvatar(context.birthday);
        if (ageAvatar) {
            const age = calculateAge(context.birthday);
            return {
                path: `ages/${ageAvatar}`,
                filename: ageAvatar,
                source: 'age',
                label: age ? `Age ${age}` : undefined
            };
        }
    }
    
    // 8. Default fallback
    return {
        path: DEFAULT_AVATAR_PATH,
        filename: DEFAULT_AVATAR,
        source: 'default',
        label: 'Alex'
    };
}

/**
 * Get full avatar path for use in webviews/UI.
 * @param result - Avatar result from resolveAvatar
 * @param extensionPath - Extension installation path
 * @returns Full file path to avatar image
 */
export function getAvatarFullPath(result: AvatarResult, extensionPath: string): string {
    const path = require('path');
    return path.join(extensionPath, 'assets', 'avatars', result.path + '.png');
}
