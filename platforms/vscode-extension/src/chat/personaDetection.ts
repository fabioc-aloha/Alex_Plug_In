/**
 * Persona Detection Module
 * 
 * Identifies user personas from their profile and project context.
 * Uses semantic signal rules for flexible, weighted detection.
 * LLM-based analysis for dynamic persona detection when available.
 * 
 * v5.0.0 Feature: Know Your Customer
 * v5.1.0 Feature: LLM-based persona detection + P6 update
 * v5.1.1 Feature: Priority-based detection chain
 * v5.6.9 Feature: Semantic rules replace flat keyword lists
 * 
 * DETECTION MODEL:
 * Instead of flat keyword arrays, each persona defines weighted "signals":
 *   - identity:   regex matched against user text (goals, expertise, focus)
 *   - technology:  regex matched against detected tech stack
 *   - structure:   workspace file/dir existence checks (path, extension, exact)
 *   - dependency:  matched against package.json dependencies
 *   - content:     regex matched against README/key file contents
 * 
 * Each signal carries its own weight, enabling fine-grained scoring
 * and easy addition of new personas without changing detection logic.
 * 
 * PRIORITY CHAIN (highest to lowest):
 * 1. Focus - Current session topic from Pomodoro timer
 * 2. Goal - Stated session objective
 * 3. Project Phase - Current phase from project config
 * 4. Project Goals - From learning goals
 * 5. Profile - User profile credentials/expertise
 * 6. Developer - Default fallback
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import * as os from 'os';

// ============================================================================
// CONFIDENCE THRESHOLDS & LIMITS
// ============================================================================

/** Confidence threshold for Focus session detection (P1) */
const CONFIDENCE_FOCUS = 0.95;
/** Confidence threshold for Focus session tech match */
const CONFIDENCE_FOCUS_TECH = 0.9;
/** Confidence threshold for Session goal detection (P2) */
const CONFIDENCE_GOAL = 0.85;
/** Confidence threshold for Project phase detection (P3) */
const CONFIDENCE_PHASE = 0.75;
/** Confidence threshold for Learning goals detection (P4) */
const CONFIDENCE_LEARNING_GOALS = 0.7;
/** Minimum threshold to use priority chain result */
const THRESHOLD_PRIORITY_1 = 0.8;
const THRESHOLD_PRIORITY_2 = 0.7;
const THRESHOLD_PRIORITY_3 = 0.7;
const THRESHOLD_PRIORITY_4 = 0.6;
/** Default confidence for fallback detection */
const CONFIDENCE_FALLBACK = 0.5;

/** Max directory entries to scan */
const MAX_DIR_ENTRIES = 50;
/** Max subdirectory entries to scan */
const MAX_SUBDIR_ENTRIES = 10;

/**
 * A semantic detection signal.
 * Replaces flat keyword/techStack/projectPattern arrays with
 * typed, weighted, regex-capable matching rules.
 */
export interface PersonaSignal {
    /**
     * What category of evidence this signal represents:
     * - identity:   matched against user-provided text (expertise, goals, focus topic)
     * - technology:  matched against detected project technologies
     * - structure:   workspace path/file existence (supports path/, .ext, exact name)
     * - dependency:  matched against package.json dependency names
     * - content:     matched against key file contents (README, package.json description)
     */
    category: 'identity' | 'technology' | 'structure' | 'dependency' | 'content';
    /** Regex pattern string (case-insensitive). Supports alternation. */
    pattern: string;
    /** Score weight when matched (default conceptual ranges: 1-3) */
    weight: number;
}

/**
 * Marketing persona definition.
 * Detection is driven by `signals` — an array of weighted semantic rules.
 * The legacy `keywords`, `techStack`, and `projectPatterns` are derived
 * automatically for backward compatibility.
 */
export interface Persona {
    id: string;
    name: string;
    bannerNoun: string;
    hook: string;
    skill: string;
    icon: string;
    accentColor: string;  // Hex color for badges/pills
    /** Avatar image filename in assets/avatars/ (e.g., 'ALEX-CODING.png'). Auto-derived from PERSONA_AVATAR_MAP by buildPersona. */
    avatarFile?: string;
    /** Weighted semantic signals that drive detection scoring */
    signals: PersonaSignal[];
    // --- Derived accessors (backward compat) ---
    keywords: string[];
    techStack: string[];
    projectPatterns: string[];
}

/**
 * LLM-detected persona (dynamic, not from hardcoded list)
 */
export interface LLMPersona {
    id: string;
    name: string;
    skill: string;
    confidence: number;
    reasons: string[];
}

/**
 * Persona-to-avatar image mapping.
 * Each persona ID maps to an avatar path (no extension) relative to assets/avatars/.
 * v5.9.1: Now uses organized subdirectories:
 *   - personas/PERSONA-* for role-based avatars
 *   - ages/Alex-* for age-based fallback
 * Both .webp (primary) and .png (fallback) are shipped.
 * Fallback: ages/Alex-21 (current identity age).
 */
export const PERSONA_AVATAR_MAP: Record<string, string> = {
    // Core developer personas
    'developer':           'personas/PERSONA-DEVELOPER',
    'fullstack-developer': 'personas/PERSONA-FULLSTACK-DEVELOPER',
    'mobile-developer':    'personas/PERSONA-MOBILE-DEVELOPER',
    'game-developer':      'personas/PERSONA-GAME-DEVELOPER',
    'code-reviewer':       'personas/PERSONA-CODE-REVIEWER',
    'debugger':            'personas/PERSONA-DEBUGGER',
    
    // Cloud & Infrastructure
    'architect':           'personas/PERSONA-ARCHITECT',
    'solutions-architect': 'personas/PERSONA-SOLUTIONS-ARCHITECT',
    'cloud-architect':     'personas/PERSONA-CLOUD-ARCHITECT',
    'devops':              'personas/PERSONA-DEVOPS',
    'sre':                 'personas/PERSONA-SRE',
    'dba':                 'personas/PERSONA-DBA',
    'database-developer':  'personas/PERSONA-DATABASE-DEVELOPER',
    
    // Platform-specific
    'microsoft-developer': 'personas/PERSONA-MICROSOFT-DEVELOPER',
    'aws-developer':       'personas/PERSONA-AWS-DEVELOPER',
    'fabric-developer':    'personas/PERSONA-FABRIC-DEVELOPER',
    'openai-developer':    'personas/PERSONA-OPENAI-DEVELOPER',
    'oracle-developer':    'personas/PERSONA-ORACLE-DEVELOPER',
    
    // AI & ML
    'ai-engineer':         'personas/PERSONA-AI-ENGINEER',
    'ml-ops':              'personas/PERSONA-ML-OPS',
    'cognitive-scientist': 'personas/PERSONA-COGNITIVE-SCIENTIST',
    
    // Data
    'data-engineer':       'personas/PERSONA-DATA-ENGINEER',
    'bi-analyst':          'personas/PERSONA-BI-ANALYST',
    
    // Research & Academic
    'academic':            'personas/PERSONA-ACADEMIC',
    'researcher':          'personas/PERSONA-RESEARCHER',
    'cx-researcher':       'personas/PERSONA-CX-RESEARCHER',
    'ux-researcher':       'personas/PERSONA-UX-RESEARCHER',
    
    // Writing & Documentation
    'technical-writer':    'personas/PERSONA-TECHNICAL-WRITER',
    'documentarian':       'personas/PERSONA-DOCUMENTARIAN',
    'content-creator':     'personas/PERSONA-CONTENT-CREATOR',
    'copywriter':          'personas/PERSONA-COPYWRITER',
    'fiction-writer':      'personas/PERSONA-FICTION-WRITER',
    'grant-writer':        'personas/PERSONA-GRANT-WRITER',
    'book-author':         'personas/PERSONA-BOOK-AUTHOR',
    
    // Business & Management
    'business-analyst':    'personas/PERSONA-BUSINESS-ANALYST',
    'product-manager':     'personas/PERSONA-PRODUCT-MANAGER',
    'project-manager':     'personas/PERSONA-PROJECT-MANAGER',
    'consultant':          'personas/PERSONA-CONSULTANT',
    'marketer':            'personas/PERSONA-MARKETER',
    'startup-founder':     'personas/PERSONA-STARTUP-FOUNDER',
    'tech-lead':           'personas/PERSONA-TECH-LEAD',
    
    // Quality & Security
    'qa-engineer':         'personas/PERSONA-QA-ENGINEER',
    'security':            'personas/PERSONA-SECURITY',
    'auditor':             'personas/PERSONA-AUDITOR',
    'red-team':            'personas/PERSONA-RED-TEAM',
    
    // Teaching & Learning
    'student':             'personas/PERSONA-STUDENT',
    'bootcamp-grad':       'personas/PERSONA-BOOTCAMP-GRAD',
    'teaching-assistant':  'personas/PERSONA-TEACHING-ASSISTANT',
    'presenter':           'personas/PERSONA-PRESENTER',
    
    // Career
    'job-seeker':          'personas/PERSONA-JOB-SEEKER',
    'oss-contributor':     'personas/PERSONA-OSS-CONTRIBUTOR',
    
    // Special & Fun
    'power-user':          'personas/PERSONA-POWER-USER',
    'knowledge-worker':    'personas/PERSONA-KNOWLEDGE-WORKER',
    'questionnaire-developer': 'personas/PERSONA-QUESTIONNAIRE-DEVELOPER',
    'gcx-team':            'personas/PERSONA-GCX-TEAM',
    
    // Fun/Easter egg personas
    'hacker':              'personas/PERSONA-HACKER',
    'night-owl':           'personas/PERSONA-NIGHT-OWL',
    'coffee-coder':        'personas/PERSONA-COFFEE-CODER',
    'rubber-duck':         'personas/PERSONA-RUBBER-DUCK',
    'stack-overflow':      'personas/PERSONA-STACK-OVERFLOW',
    'imposter':            'personas/PERSONA-IMPOSTER',
    'mad-scientist':       'personas/PERSONA-MAD-SCIENTIST',
    'fabio-special':       'personas/PERSONA-FABIO-SPECIAL',
};

/** Default avatar path (no extension) when no persona match - age 21 Alex */
export const DEFAULT_AVATAR = 'ages/Alex-21';

/**
 * Get avatar base name (no extension) for a persona ID.
 * Use with .webp (primary) and .png (fallback) in assets/avatars/.
 * @returns Base name (e.g., 'ALEX-CODING') or DEFAULT_AVATAR
 */
export function getAvatarForPersona(personaId: string): string {
    return PERSONA_AVATAR_MAP[personaId] || DEFAULT_AVATAR;
}

// ── Easter Egg System ──────────────────────────────────────────────
// Surprise avatar overrides based on date (seasonal) or project name.
// Returns null when no Easter egg applies — caller uses normal persona avatar.

export interface EasterEgg {
    /** Avatar base name (no extension) in assets/avatars/ */
    avatarBase: string;
    /** Short label for tooltip/display */
    label: string;
    /** Emoji indicator */
    emoji: string;
    /** Optional accent color for avatar border (defaults to blue) */
    accentColor?: string;
}

/** Seasonal Easter eggs — checked by month/day */
const SEASONAL_EGGS: Array<{ month: number; day: number; egg: EasterEgg }> = [
    { month: 1,  day: 1,  egg: { avatarBase: 'ALEX-EUREKA',    label: 'Happy New Year!',        emoji: '🎉', accentColor: '#FFD700' } },
    { month: 2,  day: 14, egg: { avatarBase: 'ALEX-CREATIVE',   label: 'Happy Valentine\'s Day!', emoji: '💝', accentColor: '#FF69B4' } },
    { month: 3,  day: 7,  egg: { avatarBase: 'ALEX-EUREKA',    label: 'Happy Birthday, Fabio!', emoji: '🎂', accentColor: '#FF1493' } },
    { month: 3,  day: 14, egg: { avatarBase: 'ALEX-EUREKA',    label: 'Happy Pi Day!',          emoji: '🥧', accentColor: '#D2691E' } },
    { month: 3,  day: 17, egg: { avatarBase: 'ALEX-CREATIVE',   label: 'Happy St. Patrick\'s Day!', emoji: '🍀', accentColor: '#00A86B' } },
    // Easter is calculated dynamically (March 22 - April 25), using April 20, 2025 as placeholder
    { month: 4,  day: 20, egg: { avatarBase: 'ALEX-CREATIVE',   label: 'Happy Easter!',          emoji: '🐰', accentColor: '#E6B0E6' } },
    { month: 7,  day: 4,  egg: { avatarBase: 'ALEX-EUREKA',    label: 'Happy Independence Day!', emoji: '🎆', accentColor: '#DC143C' } },
    { month: 10, day: 31, egg: { avatarBase: 'ALEX-COMEDY',     label: 'Happy Halloween!',       emoji: '🎃', accentColor: '#FF8C00' } },
    { month: 11, day: 27, egg: { avatarBase: 'ALEX-COOKING',    label: 'Happy Thanksgiving!',    emoji: '🦃', accentColor: '#D2691E' } },
    { month: 12, day: 24, egg: { avatarBase: 'ALEX-COOKING',    label: 'Happy Holidays!',        emoji: '🎄', accentColor: '#228B22' } },
    { month: 12, day: 25, egg: { avatarBase: 'ALEX-COOKING',    label: 'Merry Christmas!',       emoji: '🎄', accentColor: '#228B22' } },
    { month: 12, day: 31, egg: { avatarBase: 'ALEX-EUREKA',    label: 'New Year\'s Eve!',        emoji: '🎊', accentColor: '#FFD700' } },
];

/** Project-name Easter eggs — regex matched against workspace folder name (case-insensitive) */
const PROJECT_NAME_EGGS: Array<{ pattern: RegExp; egg: EasterEgg }> = [
    { pattern: /\b(cook|recipe|chef|food|kitchen|bak(e|ing))\b/i,         egg: { avatarBase: 'ALEX-COOKING',               label: 'Cooking project!',    emoji: '🍳', accentColor: '#FF6347' } },
    { pattern: /\b(dog|pet|puppy|animal|vet(erinary)?|cat)\b/i,           egg: { avatarBase: 'ALEX-DOG-TRAINER',            label: 'Pet project!',        emoji: '🐕', accentColor: '#8B4513' } },
    { pattern: /\b(wine|sommelier|vineyard|brewery|beer|cocktail)\b/i,    egg: { avatarBase: 'ALEX-WINE-TASTING',           label: 'Wine country!',       emoji: '🍷', accentColor: '#722F37' } },
    { pattern: /\b(comedy|joke|humor|roast|funny|meme|standup)\b/i,       egg: { avatarBase: 'ALEX-COMEDY',                 label: 'Comedy mode!',        emoji: '😂', accentColor: '#FFD700' } },
    { pattern: /\b(podcast|audio|radio|episode)\b/i,                      egg: { avatarBase: 'ALEX-PODCAST',                label: 'Podcast studio!',     emoji: '🎙️', accentColor: '#FF4500' } },
    { pattern: /\b(invest|financ|trading|stock|portfolio|crypto)\b/i,     egg: { avatarBase: 'ALEX-INVESTMENT',              label: 'Finance mode!',       emoji: '📈', accentColor: '#228B22' } },
    { pattern: /\b(legal|patent|copyright|trademark|compliance)\b/i,      egg: { avatarBase: 'ALEX-INTELLECTUAL-PROPERTY',   label: 'Legal eagle!',        emoji: '⚖️', accentColor: '#2F4F4F' } },
    { pattern: /\b(survey|questionnaire|poll|census)\b/i,                 egg: { avatarBase: 'ALEX-SURVEY-DESIGN',           label: 'Survey time!',        emoji: '📋', accentColor: '#4169E1' } },
    { pattern: /\b(mentor|onboard|coach|tutor)\b/i,                       egg: { avatarBase: 'ALEX-MENTORING',               label: 'Mentor mode!',        emoji: '🧑‍🏫', accentColor: '#FF8C00' } },
    // Milestone/Achievement patterns
    { pattern: /\b(milestone|achievement|release|launch|v?1\.0|shipped)\b/i, egg: { avatarBase: 'ALEX-EUREKA',               label: 'Milestone achieved!', emoji: '🏆', accentColor: '#FFD700' } },
    { pattern: /\b(celebrate|celebration|success|victory|win)\b/i,        egg: { avatarBase: 'ALEX-EUREKA',                 label: 'Celebrating!',        emoji: '🎉', accentColor: '#FF69B4' } },
];

/**
 * Check for Easter egg avatar overrides.
 * Priority: seasonal (date-based) > project name.
 * @param workspaceFolderName - Name of the first workspace folder (optional)
 * @param now - Current date (injectable for testing)
 * @returns EasterEgg override or null
 */
export function getEasterEggOverride(workspaceFolderName?: string, now: Date = new Date()): EasterEgg | null {
    // 1. Seasonal check — date takes priority
    const month = now.getMonth() + 1; // getMonth() is 0-indexed
    const day = now.getDate();
    for (const { month: m, day: d, egg } of SEASONAL_EGGS) {
        if (month === m && day === d) {
            return egg;
        }
    }

    // 2. Project name check
    if (workspaceFolderName) {
        for (const { pattern, egg } of PROJECT_NAME_EGGS) {
            if (pattern.test(workspaceFolderName)) {
                return egg;
            }
        }
    }

    return null;
}

/**
 * NOTE: P5-P7 slot architecture deprecated in v5.7.x.
 * Persona detection now updates Active Context persona field only.
 * Focus Trifectas are managed independently via ActiveContextManager.
 */

/**
 * Build a Persona object from signals, auto-deriving keywords/techStack/projectPatterns
 * for backward compatibility with code that reads those arrays.
 */
function buildPersona(base: Omit<Persona, 'keywords' | 'techStack' | 'projectPatterns'> & { signals: PersonaSignal[]; avatarFile?: string }): Persona {
    const keywords: string[] = [];
    const techStack: string[] = [];
    const projectPatterns: string[] = [];
    for (const s of base.signals) {
        // Extract simple tokens from regex alternation for legacy arrays
        const tokens = s.pattern.split('|').map(t => t.replace(/[\\^$.*+?()[\]{}]/g, '').trim()).filter(t => t.length > 0);
        if (s.category === 'identity') { keywords.push(...tokens); }
        else if (s.category === 'technology') { techStack.push(...tokens); }
        else if (s.category === 'structure') { projectPatterns.push(...tokens); }
    }
    // Auto-derive avatarFile from PERSONA_AVATAR_MAP if not explicitly provided
    const avatarFile = base.avatarFile || getAvatarForPersona(base.id);
    return { ...base, avatarFile, keywords, techStack, projectPatterns };
}

/**
 * All defined personas — driven by semantic signal rules.
 * Each persona's detection is controlled entirely by its `signals` array.
 * Use identity signals for text matching, technology for stack detection,
 * structure for workspace scanning, dependency for package.json, and
 * content for file content analysis.
 */
export const PERSONAS: Persona[] = [
    buildPersona({
        id: 'developer',
        name: 'Developer',
        bannerNoun: 'CODE',
        hook: 'Ship faster, debug less',
        skill: 'code-review',
        icon: '💻',
        accentColor: '#0078D4',
        signals: [
            { category: 'identity',   pattern: 'developer|engineer|programmer|coder|software',                  weight: 2.0 },
            { category: 'technology', pattern: 'typescript|javascript|python|java|c#|go|rust|react|angular|vue|node', weight: 2.0 },
            { category: 'structure',  pattern: 'src/',                                                           weight: 1.0 },
            { category: 'dependency', pattern: 'typescript|eslint|jest|mocha|webpack|vite|esbuild',               weight: 1.5 },
            { category: 'content',    pattern: 'npm|build|compile|test|lint',                                    weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'academic',
        name: 'Academic / Grad Student',
        bannerNoun: 'THESIS',
        hook: 'Literature review on autopilot',
        skill: 'research-project-scaffold',
        icon: '🎓',
        accentColor: '#8B5CF6',
        signals: [
            { category: 'identity',   pattern: 'phd|thesis|dissertation|academic|university|graduate|postdoc',    weight: 2.5 },
            { category: 'technology', pattern: 'latex|bibtex|r\\b|jupyter',                                      weight: 2.0 },
            { category: 'structure',  pattern: '.tex|.bib|thesis/|dissertation/|chapters/|references/',           weight: 1.5 },
            { category: 'content',    pattern: 'abstract|literature review|methodology|hypothesis|citation',      weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'researcher',
        name: 'Researcher',
        bannerNoun: 'RESEARCH',
        hook: 'Hypothesis to publication, accelerated',
        skill: 'research-project-scaffold',
        icon: '🔬',
        accentColor: '#10B981',
        signals: [
            { category: 'identity',   pattern: 'researcher|scientist|lab|experiment|hypothesis',                  weight: 2.5 },
            { category: 'technology', pattern: 'python|r\\b|julia|matlab|jupyter|pandas|numpy|scipy',             weight: 2.0 },
            { category: 'structure',  pattern: 'data/|analysis/|experiments/|notebooks/|.ipynb',                  weight: 1.5 },
            { category: 'dependency', pattern: 'pandas|numpy|scipy|matplotlib|seaborn|scikit-learn',              weight: 1.5 },
            { category: 'content',    pattern: 'dataset|experiment|finding|analysis|result',                      weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'technical-writer',
        name: 'Technical Writer',
        bannerNoun: 'DOCUMENTATION',
        hook: 'Docs that write themselves',
        skill: 'api-documentation',
        icon: '📝',
        accentColor: '#F59E0B',
        signals: [
            { category: 'identity',   pattern: 'writer|documentation|technical.?writ|api.?doc|manual',           weight: 2.5 },
            { category: 'technology', pattern: 'markdown|rst|asciidoc|docusaurus|sphinx|mkdocs',                  weight: 2.0 },
            { category: 'structure',  pattern: 'docs/|documentation/|.mdx',                                      weight: 1.5 },
            { category: 'content',    pattern: 'getting started|api reference|installation|quick start',          weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'architect',
        name: 'Enterprise Architect',
        bannerNoun: 'ARCHITECTURE',
        hook: 'Self-documenting cognitive architecture',
        skill: 'architecture-health',
        icon: '🏗️',
        accentColor: '#6366F1',
        signals: [
            { category: 'identity',   pattern: 'architect|system.?design|enterprise|infrastructure',              weight: 2.5 },
            { category: 'technology', pattern: 'terraform|bicep|kubernetes|docker|azure|aws|gcp',                  weight: 2.0 },
            { category: 'structure',  pattern: 'infra/|terraform/|bicep/|kubernetes/|helm/|ADR/',                  weight: 1.5 },
            { category: 'content',    pattern: 'architecture|adr|decision record|microservice|scalab',             weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'data-engineer',
        name: 'Data Engineer',
        bannerNoun: 'DATA',
        hook: 'Governance on autopilot',
        skill: 'microsoft-fabric',
        icon: '📊',
        accentColor: '#06B6D4',
        signals: [
            { category: 'identity',   pattern: 'data.?engineer|etl|pipeline|warehouse|analytics|fabric|lakehouse', weight: 2.5 },
            { category: 'technology', pattern: 'sql|spark|dbt|fabric|synapse|databricks|snowflake',                weight: 2.0 },
            { category: 'structure',  pattern: 'pipelines/|etl/|dbt/|notebooks/|lakehouse/',                       weight: 1.5 },
            { category: 'dependency', pattern: 'dbt-core|pyspark|great-expectations|apache-airflow',               weight: 1.5 },
            { category: 'content',    pattern: 'medallion|bronze|silver|gold|data warehouse|lakehouse',             weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'devops',
        name: 'DevOps Engineer',
        bannerNoun: 'INFRASTRUCTURE',
        hook: 'Same infra, every time. Automated.',
        skill: 'infrastructure-as-code',
        icon: '⚙️',
        accentColor: '#EF4444',
        signals: [
            { category: 'identity',   pattern: 'devops|sre|ci/?cd|deployment|automation|platform.?eng',           weight: 2.5 },
            { category: 'technology', pattern: 'terraform|ansible|docker|kubernetes|github-actions|azure-devops',  weight: 2.0 },
            { category: 'structure',  pattern: '.github/workflows/|azure-pipelines.yml|Dockerfile|.gitlab-ci.yml', weight: 2.0 },
            { category: 'content',    pattern: 'deploy|pipeline|continuous|infrastructure|helm|container',          weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'content-creator',
        name: 'Content Creator',
        bannerNoun: 'CONTENT',
        hook: 'Ideas to posts in minutes',
        skill: 'creative-writing',
        icon: '✍️',
        accentColor: '#EC4899',
        signals: [
            { category: 'identity',   pattern: 'content.?creat|blogger|newsletter|social.?media|copywriter',      weight: 2.5 },
            { category: 'technology', pattern: 'markdown|ghost|wordpress|substack|notion',                         weight: 1.5 },
            { category: 'structure',  pattern: 'posts/|articles/|blog/|content/|drafts/',                          weight: 1.5 },
            { category: 'content',    pattern: 'publish|audience|seo|newsletter|content calendar',                  weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'fiction-writer',
        name: 'Fiction Writer',
        bannerNoun: 'WRITING',
        hook: 'Your story structure co-author',
        skill: 'creative-writing',
        icon: '📚',
        accentColor: '#A855F7',
        signals: [
            { category: 'identity',   pattern: 'fiction|novel|screenplay|story|author|creative.?writ|book',        weight: 2.5 },
            { category: 'technology', pattern: 'scrivener|fountain|writing',                                       weight: 2.0 },
            { category: 'structure',  pattern: 'chapters/|manuscript/|outline/|characters/|.fountain|book/|scenes/|OUTLINE.md|plot/|worldbuilding/', weight: 1.5 },
            { category: 'content',    pattern: 'chapter|character|protagonist|plot|narrative|dialogue',              weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'game-developer',
        name: 'Game Developer',
        bannerNoun: 'GAMES',
        hook: 'Design, build, play — iterate',
        skill: 'game-design',
        icon: '🎮',
        accentColor: '#7C3AED',
        signals: [
            { category: 'identity',   pattern: 'game.?dev|unity|unreal|godot|rpg|puzzle|interactive|narrative.?design', weight: 2.5 },
            { category: 'technology', pattern: 'unity|unreal|godot|c#|c\\+\\+|lua|gdscript|renpy',                     weight: 2.0 },
            { category: 'structure',  pattern: 'game/|levels/|sprites/|quests/|puzzles/|mechanics/|game-design/|GAME-DESIGN.md|inventory/|dialogues/|encounters/', weight: 1.5 },
            { category: 'dependency', pattern: 'phaser|pixi|three|babylonjs|matter-js',                                 weight: 1.5 },
            { category: 'content',    pattern: 'game.?loop|player|inventory|quest|level.?design|mechanic',               weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'project-manager',
        name: 'Project Manager',
        bannerNoun: 'PROJECTS',
        hook: '4-6× faster than human estimates',
        skill: 'project-management',
        icon: '📋',
        accentColor: '#14B8A6',
        signals: [
            { category: 'identity',   pattern: 'project.?manag|agile|scrum|sprint|roadmap|kanban',                weight: 2.5 },
            { category: 'technology', pattern: 'jira|azure-boards|notion|linear',                                 weight: 2.0 },
            { category: 'structure',  pattern: 'sprints/|roadmap/|epics/|backlog/',                                weight: 1.5 },
            { category: 'content',    pattern: 'sprint|user.?story|backlog|velocity|retrospective|standup',         weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'security',
        name: 'Security Engineer',
        bannerNoun: 'SECURITY',
        hook: 'Threat-aware by default',
        skill: 'incident-response',
        icon: '🔐',
        accentColor: '#DC2626',
        signals: [
            { category: 'identity',   pattern: 'security|threat|audit|compliance|penetration|vulnerabilit',        weight: 2.5 },
            { category: 'technology', pattern: 'python|bash|powershell|terraform',                                 weight: 1.0 },
            { category: 'structure',  pattern: 'security/|audits/|compliance/|threat-models/',                     weight: 2.0 },
            { category: 'content',    pattern: 'cve|owasp|threat model|incident|security review|pen.?test',        weight: 1.5 },
        ]
    }),
    buildPersona({
        id: 'student',
        name: 'Student',
        bannerNoun: 'LEARNING',
        hook: 'Master concepts, not just memorize',
        skill: 'learning-psychology',
        icon: '📖',
        accentColor: '#3B82F6',
        signals: [
            { category: 'identity',   pattern: 'student|learning|study|course|class|homework|tutorial',            weight: 2.5 },
            { category: 'technology', pattern: 'notion|obsidian',                                                  weight: 1.0 },
            { category: 'structure',  pattern: 'notes/|study/|courses/|assignments/',                               weight: 1.5 },
            { category: 'content',    pattern: 'lesson|assignment|quiz|exam|lecture|tutorial',                       weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'job-seeker',
        name: 'Job Seeker',
        bannerNoun: 'CAREER',
        hook: 'Stand out, get hired',
        skill: 'creative-writing',
        icon: '💼',
        accentColor: '#84CC16',
        signals: [
            { category: 'identity',   pattern: 'job|career|resume|interview|portfolio|linkedin|cover.?letter',     weight: 2.5 },
            { category: 'technology', pattern: 'markdown|latex',                                                    weight: 0.5 },
            { category: 'structure',  pattern: 'resume/|portfolio/|cover-letters/|cv/',                             weight: 2.0 },
            { category: 'content',    pattern: 'experience|position|responsibilities|qualification|skill.?set',     weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'presenter',
        name: 'Speaker / Presenter',
        bannerNoun: 'PRESENTATIONS',
        hook: 'Notes → polished slides in minutes',
        skill: 'gamma-presentations',
        icon: '🎤',
        accentColor: '#F97316',
        signals: [
            { category: 'identity',   pattern: 'speaker|presenter|slides|deck|talk|conference|workshop',           weight: 2.5 },
            { category: 'technology', pattern: 'marp|reveal\\.?js|gamma',                                          weight: 2.0 },
            { category: 'structure',  pattern: 'slides/|decks/|presentations/|talks/',                              weight: 1.5 },
            { category: 'content',    pattern: 'slide|presentation|speaker.?notes|audience|keynote',                weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'power-user',
        name: 'Power User / Builder',
        bannerNoun: 'PROJECTS',
        hook: 'Your rocket. Your trajectory.',
        skill: 'git-workflow',
        icon: '🚀',
        accentColor: '#FBBF24',
        signals: [
            { category: 'identity',   pattern: 'power.?user|builder|maker|hacker|tinkerer|contributor',            weight: 2.0 },
            { category: 'technology', pattern: 'typescript|python|bash|powershell|git',                             weight: 1.0 },
            { category: 'structure',  pattern: 'skills/|extensions/|plugins/',                                      weight: 1.5 },
            { category: 'content',    pattern: 'extensi|plugin|customiz|automat|contribut',                         weight: 0.5 },
        ]
    }),
    // ── v5.7.1 — 11 new personas from marketing plan ──────────────────
    buildPersona({
        id: 'cognitive-scientist',
        name: 'Cognitive Scientist',
        bannerNoun: 'RESEARCH',
        hook: 'Prefrontal cortex for your IDE',
        skill: 'ai-agent-design',
        icon: '🧠',
        accentColor: '#8B5CF6',
        signals: [
            { category: 'identity',   pattern: 'cognitive.?sci|ai.?research|machine.?learn|neural|nlp|llm|deep.?learn', weight: 2.5 },
            { category: 'technology', pattern: 'pytorch|tensorflow|huggingface|transformers|langchain|openai',            weight: 2.0 },
            { category: 'structure',  pattern: 'models/|training/|experiments/|prompts/|agents/',                         weight: 1.5 },
            { category: 'dependency', pattern: 'torch|tensorflow|transformers|langchain|openai|anthropic',                weight: 1.5 },
            { category: 'content',    pattern: 'model|training|inference|embedding|prompt|token|fine.?tun',                weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'oss-contributor',
        name: 'Open Source Contributor',
        bannerNoun: 'PROJECTS',
        hook: 'Your rocket. Your trajectory.',
        skill: 'git-workflow',
        icon: '🌐',
        accentColor: '#22C55E',
        signals: [
            { category: 'identity',   pattern: 'open.?source|oss|contributor|maintainer|community',                 weight: 2.5 },
            { category: 'structure',  pattern: 'CONTRIBUTING.md|CODE_OF_CONDUCT.md|.github/ISSUE_TEMPLATE/',         weight: 2.0 },
            { category: 'content',    pattern: 'pull.?request|issue|contributor|license|fork|upstream',               weight: 1.0 },
            { category: 'structure',  pattern: '.github/workflows/|.github/PULL_REQUEST_TEMPLATE.md',                weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'grant-writer',
        name: 'Grant Writer',
        bannerNoun: 'GRANTS',
        hook: 'Research vision → funded reality',
        skill: 'research-project-scaffold',
        icon: '💰',
        accentColor: '#D97706',
        signals: [
            { category: 'identity',   pattern: 'grant|funding|proposal|principal.?investigator|pi\b|postdoc|nsf|nih', weight: 2.5 },
            { category: 'structure',  pattern: 'proposals/|grants/|budget/|narrative/',                                weight: 2.0 },
            { category: 'content',    pattern: 'budget|funding|award|specific.?aims|broader.?impact|significance',     weight: 1.5 },
        ]
    }),
    buildPersona({
        id: 'copywriter',
        name: 'Copywriter',
        bannerNoun: 'COPY',
        hook: 'Headlines that convert',
        skill: 'creative-writing',
        icon: '✏️',
        accentColor: '#F472B6',
        signals: [
            { category: 'identity',   pattern: 'copywriter|copywriting|headline|landing.?page|ad.?copy|conversion', weight: 2.5 },
            { category: 'structure',  pattern: 'copy/|ads/|landing-pages/|campaigns/',                               weight: 1.5 },
            { category: 'content',    pattern: 'headline|call.?to.?action|cta|conversion|a/b.?test|tagline',          weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'business-analyst',
        name: 'Business Analyst',
        bannerNoun: 'ANALYSIS',
        hook: 'Stakeholder alignment accelerator',
        skill: 'business-analysis',
        icon: '📊',
        accentColor: '#0891B2',
        signals: [
            { category: 'identity',   pattern: 'business.?analyst|brd|requirements|process.?map|stakeholder',        weight: 2.5 },
            { category: 'structure',  pattern: 'requirements/|brd/|processes/|use-cases/',                            weight: 2.0 },
            { category: 'content',    pattern: 'business.?requirement|functional.?spec|use.?case|stakeholder|as-is|to-be', weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'sre',
        name: 'SRE / On-Call',
        bannerNoun: 'INCIDENTS',
        hook: 'Calm. Systematic. Crisis handled.',
        skill: 'incident-response',
        icon: '🚨',
        accentColor: '#EF4444',
        signals: [
            { category: 'identity',   pattern: 'sre|site.?reliab|on.?call|incident|runbook|observab',                weight: 2.5 },
            { category: 'technology', pattern: 'prometheus|grafana|datadog|pagerduty|opsgenie',                       weight: 2.0 },
            { category: 'structure',  pattern: 'runbooks/|alerts/|dashboards/|incident-reports/|postmortems/',        weight: 2.0 },
            { category: 'content',    pattern: 'sla|slo|sli|error.?budget|incident|postmortem|toil',                   weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'product-manager',
        name: 'Product Manager',
        bannerNoun: 'ROADMAPS',
        hook: 'User needs → shipped features',
        skill: 'project-management',
        icon: '🗺️',
        accentColor: '#7C3AED',
        signals: [
            { category: 'identity',   pattern: 'product.?manag|pm\b|roadmap|user.?stor|prioritiz|okr',                weight: 2.5 },
            { category: 'structure',  pattern: 'roadmap/|prd/|user-stories/|features/',                               weight: 2.0 },
            { category: 'content',    pattern: 'product.?requirement|user.?story|acceptance.?criteria|okr|kpi|mvp',    weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'bi-analyst',
        name: 'BI Analyst',
        bannerNoun: 'INSIGHTS',
        hook: 'Raw data → executive insights',
        skill: 'microsoft-fabric',
        icon: '📈',
        accentColor: '#0EA5E9',
        signals: [
            { category: 'identity',   pattern: 'bi.?analyst|business.?intelligence|dashboard|report|metric|kpi',      weight: 2.5 },
            { category: 'technology', pattern: 'power.?bi|tableau|looker|metabase|superset',                           weight: 2.0 },
            { category: 'structure',  pattern: 'reports/|dashboards/|metrics/|kpis/',                                 weight: 1.5 },
            { category: 'content',    pattern: 'dashboard|measure|dimension|kpi|executive.?summary|trend',             weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'consultant',
        name: 'Consultant',
        bannerNoun: 'PROPOSALS',
        hook: 'Win more deals, faster',
        skill: 'business-analysis',
        icon: '🤝',
        accentColor: '#6366F1',
        signals: [
            { category: 'identity',   pattern: 'consultant|consult|advisory|proposal|client|deliverable|engagement',   weight: 2.5 },
            { category: 'structure',  pattern: 'proposals/|deliverables/|clients/|engagements/|sow/',                  weight: 2.0 },
            { category: 'content',    pattern: 'proposal|scope.?of.?work|deliverable|milestone|client|statement.?of',  weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'qa-engineer',
        name: 'QA Engineer',
        bannerNoun: 'TESTS',
        hook: 'Coverage without the tedium',
        skill: 'code-quality',
        icon: '🧪',
        accentColor: '#16A34A',
        signals: [
            { category: 'identity',   pattern: 'qa|quality.?assur|test.?engineer|automation.?test|sdet',               weight: 2.5 },
            { category: 'technology', pattern: 'selenium|cypress|playwright|jest|pytest|testcafe|appium',               weight: 2.0 },
            { category: 'structure',  pattern: 'tests/|test-plans/|e2e/|integration-tests/|__tests__/',                weight: 1.5 },
            { category: 'dependency', pattern: 'selenium|cypress|playwright|puppeteer|@testing-library',                weight: 1.5 },
            { category: 'content',    pattern: 'test.?case|test.?plan|coverage|regression|acceptance.?test',             weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'marketer',
        name: 'Marketer',
        bannerNoun: 'MARKETING',
        hook: 'Data-driven campaigns, faster',
        skill: 'business-analysis',
        icon: '📢',
        accentColor: '#E11D48',
        signals: [
            { category: 'identity',   pattern: 'marketer|marketing|campaign|seo|growth|brand|analytics',               weight: 2.5 },
            { category: 'technology', pattern: 'google.?analytics|hubspot|mailchimp|segment|mixpanel',                  weight: 2.0 },
            { category: 'structure',  pattern: 'campaigns/|marketing/|email-templates/|landing-pages/',                 weight: 1.5 },
            { category: 'content',    pattern: 'campaign|funnel|conversion|lead|segment|attribution',                   weight: 1.0 },
        ]
    }),
];

// ============================================================================
// SIGNAL MATCHING HELPERS
// ============================================================================

/**
 * Test whether a text matches any identity or technology signals for a persona.
 * Returns the best-matching persona and reason, or null.
 */
function matchTextAgainstSignals(
    text: string,
    categories: PersonaSignal['category'][],
): { persona: Persona; confidence: number; reason: string } | null {
    const textLower = text.toLowerCase();
    let bestPersona: Persona | null = null;
    let bestWeight = 0;
    let bestReason = '';

    for (const persona of PERSONAS) {
        for (const signal of persona.signals) {
            if (!categories.includes(signal.category)) { continue; }
            try {
                const re = new RegExp(signal.pattern, 'i');
                if (re.test(textLower)) {
                    if (signal.weight > bestWeight) {
                        bestWeight = signal.weight;
                        bestPersona = persona;
                        bestReason = `Matched "${signal.pattern}" in text`;
                    }
                }
            } catch { /* skip invalid regex */ }
        }
    }

    return bestPersona ? { persona: bestPersona, confidence: 0, reason: bestReason } : null;
}

// ============================================================================
// PRIORITY CHAIN DETECTION HELPERS
// ============================================================================

/**
 * PRIORITY 1: Detect persona from active Focus session (Pomodoro timer)
 * Uses semantic signal matching against session topic.
 */
async function detectFromFocusSession(): Promise<Omit<PersonaDetectionResult, 'source'> | null> {
    try {
        const sessionStatePath = path.join(os.homedir(), '.alex', 'session-state.json');
        if (!await fs.pathExists(sessionStatePath)) {
            return null;
        }
        
        const sessionState = await fs.readJson(sessionStatePath);
        if (!sessionState.active || !sessionState.topic) {
            return null;
        }
        
        const topic = sessionState.topic;
        
        // Match topic against identity and technology signals
        const match = matchTextAgainstSignals(topic, ['identity', 'technology']);
        if (match) {
            return {
                persona: match.persona,
                confidence: CONFIDENCE_FOCUS,
                reasons: [`Active focus session: "${sessionState.topic}"`]
            };
        }
    } catch (err) {
        // Ignore - not all projects have focus sessions
    }
    return null;
}

/**
 * PRIORITY 2: Detect persona from current session goal
 * Uses semantic signal matching against goal text.
 */
async function detectFromSessionGoals(rootPath?: string): Promise<Omit<PersonaDetectionResult, 'source'> | null> {
    if (!rootPath) { return null; }
    
    try {
        const goalsPath = path.join(rootPath, '.github', 'config', 'goals.json');
        if (!await fs.pathExists(goalsPath)) {
            return null;
        }
        
        const goalsData = await fs.readJson(goalsPath);
        const activeGoals = goalsData.goals?.filter((g: { completedAt?: string }) => !g.completedAt) || [];
        
        for (const goal of activeGoals) {
            const goalText = `${goal.title} ${goal.description || ''} ${(goal.tags || []).join(' ')}`;
            const match = matchTextAgainstSignals(goalText, ['identity', 'technology']);
            if (match) {
                return {
                    persona: match.persona,
                    confidence: CONFIDENCE_GOAL,
                    reasons: [`Active goal: "${goal.title}"`]
                };
            }
        }
    } catch (err) {
        // Ignore - not all projects have goals
    }
    return null;
}

/**
 * PRIORITY 3: Detect persona from project phase
 * Uses semantic pattern matching against roadmap content.
 */
async function detectFromProjectPhase(rootPath?: string): Promise<Omit<PersonaDetectionResult, 'source'> | null> {
    if (!rootPath) { return null; }
    
    try {
        const roadmapPaths = [
            path.join(rootPath, 'ROADMAP.md'),
            path.join(rootPath, 'ROADMAP-UNIFIED.md'),
            path.join(rootPath, '.github', 'ROADMAP.md')
        ];
        
        // Phase semantic rules: regex pattern → persona ID
        const phaseRules: Array<{ pattern: RegExp; personaId: string }> = [
            { pattern: /🔄 in progress|## current|active track|sprint \d+/i,                personaId: 'developer' },
            { pattern: /documentation phase|docs sprint|writing phase|api docs/i,            personaId: 'technical-writer' },
            { pattern: /release phase|publish|deployment|go.?live|launch/i,                  personaId: 'devops' },
            { pattern: /architecture review|design phase|system design|adr/i,                personaId: 'architect' },
            { pattern: /research phase|literature review|data collection|experiment/i,       personaId: 'researcher' },
            { pattern: /presentation|demo prep|conference|talk prep/i,                       personaId: 'presenter' },
            { pattern: /security audit|compliance review|pen.?test|threat model/i,           personaId: 'security' },
        ];
        
        for (const roadmapPath of roadmapPaths) {
            if (await fs.pathExists(roadmapPath)) {
                const content = await fs.readFile(roadmapPath, 'utf8');
                
                for (const { pattern, personaId } of phaseRules) {
                    if (pattern.test(content)) {
                        const persona = PERSONAS.find(p => p.id === personaId);
                        if (persona) {
                            return {
                                persona,
                                confidence: CONFIDENCE_PHASE,
                                reasons: [`Project phase from roadmap`]
                            };
                        }
                    }
                }
            }
        }
    } catch (err) {
        // Ignore - not all projects have roadmaps
    }
    return null;
}

/**
 * PRIORITY 4: Detect persona from project learning goals
 * Uses semantic signal matching against goal text.
 */
async function detectFromProjectGoals(rootPath?: string): Promise<Omit<PersonaDetectionResult, 'source'> | null> {
    if (!rootPath) { return null; }
    
    try {
        const profilePath = path.join(rootPath, '.github', 'config', 'user-profile.json');
        if (!await fs.pathExists(profilePath)) {
            return null;
        }
        
        const profile = await fs.readJson(profilePath);
        const goals = profile.learningGoals || [];
        
        for (const goal of goals) {
            if (typeof goal !== 'string') { continue; }
            const match = matchTextAgainstSignals(goal, ['identity', 'technology']);
            if (match) {
                return {
                    persona: match.persona,
                    confidence: CONFIDENCE_LEARNING_GOALS,
                    reasons: [`Learning goal: "${goal}"`]
                };
            }
        }
    } catch (err) {
        // Ignore - not all projects have learning goals
    }
    return null;
}

/**
 * User profile structure (subset relevant for persona detection)
 */
interface UserProfile {
    name?: string;
    nickname?: string;
    birthday?: string;  // ISO date string for age-based avatar fallback
    primaryTechnologies?: string[];
    learningGoals?: string[];
    expertiseAreas?: string[];
    currentProjects?: (string | { name?: string; [key: string]: unknown })[];
}

/**
 * Persona detection result
 */
export interface PersonaDetectionResult {
    persona: Persona;
    confidence: number; // 0-1
    reasons: string[];
    source?: 'cached' | 'detected' | 'llm'; // Where the persona came from
}

/**
 * Detect the most likely persona based on priority chain.
 * 
 * PRIORITY CHAIN (each level overrides lower levels if confident):
 * 1. Focus - Current session topic from Pomodoro timer (highest priority)
 * 2. Goal - Stated session objective
 * 3. Project Phase - Current phase from project config
 * 4. Project Goals - From learning goals
 * 5. Profile - User profile credentials/expertise
 * 6. Developer - Default fallback (lowest priority)
 * 
 * @param userProfile - User profile from user-profile.json
 * @param workspaceFolders - Current workspace folders
 * @returns Detected persona with confidence score, or null if insufficient data
 */
export async function detectPersona(
    userProfile?: UserProfile,
    workspaceFolders?: readonly vscode.WorkspaceFolder[]
): Promise<PersonaDetectionResult | null> {
    const rootPath = workspaceFolders?.[0]?.uri.fsPath;
    
    // PRIORITY 1: Check active focus session (Pomodoro timer topic)
    const focusResult = await detectFromFocusSession();
    if (focusResult && focusResult.confidence >= THRESHOLD_PRIORITY_1) {
        return { ...focusResult, source: 'detected' };
    }
    
    // PRIORITY 2: Check session goal from goals.json
    const goalResult = await detectFromSessionGoals(rootPath);
    if (goalResult && goalResult.confidence >= THRESHOLD_PRIORITY_2) {
        return { ...goalResult, source: 'detected' };
    }
    
    // PRIORITY 3: Check project phase from config
    const phaseResult = await detectFromProjectPhase(rootPath);
    if (phaseResult && phaseResult.confidence >= THRESHOLD_PRIORITY_3) {
        return { ...phaseResult, source: 'detected' };
    }
    
    // PRIORITY 4: Check project learning goals
    const projectGoalsResult = await detectFromProjectGoals(rootPath);
    if (projectGoalsResult && projectGoalsResult.confidence >= THRESHOLD_PRIORITY_4) {
        return { ...projectGoalsResult, source: 'detected' };
    }
    
    // PRIORITY 5: Use saved projectPersona if available and recent (within 7 days)
    const extendedProfile = userProfile as ExtendedUserProfile | undefined;
    if (extendedProfile?.projectPersona) {
        const savedPersona = extendedProfile.projectPersona;
        
        // Defensive: if detectedAt is missing, treat as recently detected
        let ageInDays = 0;
        if (savedPersona.detectedAt) {
            const detectedAt = new Date(savedPersona.detectedAt);
            if (!isNaN(detectedAt.getTime())) {
                ageInDays = (Date.now() - detectedAt.getTime()) / (1000 * 60 * 60 * 24);
            }
        }
        
        // Use cached persona if less than 7 days old (or if no date, assume valid)
        if (ageInDays < 7) {
            const matchedPersona = PERSONAS.find(p => p.id === savedPersona.id);
            if (matchedPersona) {
                return {
                    persona: matchedPersona,
                    confidence: savedPersona.confidence,
                    reasons: savedPersona.reasons,
                    source: 'cached'
                };
            }
        }
    }
    
    // PRIORITY 6: Signal-based scoring across all evidence sources
    const scores: Map<string, { score: number; reasons: string[] }> = new Map();
    
    // Initialize all personas with 0 score
    for (const persona of PERSONAS) {
        scores.set(persona.id, { score: 0, reasons: [] });
    }
    
    // --- Collect evidence texts from user profile ---
    const profileTexts: { text: string; label: string }[] = [];
    if (userProfile) {
        for (const tech of (userProfile.primaryTechnologies || [])) {
            if (typeof tech === 'string') { profileTexts.push({ text: tech, label: `Uses ${tech}` }); }
        }
        for (const goal of (userProfile.learningGoals || [])) {
            if (typeof goal === 'string') { profileTexts.push({ text: goal, label: `Learning goal: ${goal}` }); }
        }
        for (const area of (userProfile.expertiseAreas || [])) {
            if (typeof area === 'string') { profileTexts.push({ text: area, label: `Expert in ${area}` }); }
        }
        for (const project of (userProfile.currentProjects || [])) {
            const name = typeof project === 'string' ? project : (project as { name?: string })?.name;
            if (name && typeof name === 'string') { profileTexts.push({ text: name, label: `Working on ${name}` }); }
        }
    }
    
    // --- Score identity and technology signals against profile texts ---
    for (const { text, label } of profileTexts) {
        const textLower = text.toLowerCase();
        for (const persona of PERSONAS) {
            for (const signal of persona.signals) {
                if (signal.category !== 'identity' && signal.category !== 'technology') { continue; }
                try {
                    const re = new RegExp(signal.pattern, 'i');
                    if (re.test(textLower)) {
                        const entry = scores.get(persona.id)!;
                        entry.score += signal.weight;
                        if (!entry.reasons.includes(label)) { entry.reasons.push(label); }
                    }
                } catch { /* skip invalid regex */ }
            }
        }
    }
    
    // --- Score structure signals against workspace ---
    if (workspaceFolders && workspaceFolders.length > 0) {
        for (const folder of workspaceFolders) {
            try {
                const wsRoot = folder.uri.fsPath;
                const entries = await fs.readdir(wsRoot);
                const entriesLowerSet = new Set(entries.map(e => e.toLowerCase()));
                
                for (const persona of PERSONAS) {
                    for (const signal of persona.signals) {
                        if (signal.category !== 'structure') { continue; }
                        // Structure patterns use the same | separator as regex;
                        // each token is checked as path, extension, or exact name
                        const structureTokens = signal.pattern.split('|').map(t => t.trim()).filter(Boolean);
                        for (const token of structureTokens) {
                            let matched = false;
                            let displayName = token;
                            
                            if (token.includes('/')) {
                                const cleanPath = token.replace(/\/+$/, '');
                                matched = await fs.pathExists(path.join(wsRoot, cleanPath));
                            } else if (/^\.[a-zA-Z]+$/.test(token)) {
                                const ext = token.toLowerCase();
                                matched = entries.some(e => e.toLowerCase().endsWith(ext));
                                displayName = `*${token} files`;
                            } else {
                                matched = entriesLowerSet.has(token.toLowerCase());
                            }
                            
                            if (matched) {
                                const entry = scores.get(persona.id)!;
                                entry.score += signal.weight;
                                const reason = `Project has ${displayName}`;
                                if (!entry.reasons.includes(reason)) { entry.reasons.push(reason); }
                            }
                        }
                    }
                }
                
                // --- Score dependency signals against package.json ---
                const packageJsonPath = path.join(wsRoot, 'package.json');
                if (await fs.pathExists(packageJsonPath)) {
                    try {
                        const pkg = await fs.readJson(packageJsonPath);
                        const allDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
                        const depsJoined = allDeps.join(' ').toLowerCase();
                        
                        for (const persona of PERSONAS) {
                            for (const signal of persona.signals) {
                                if (signal.category !== 'dependency') { continue; }
                                try {
                                    const re = new RegExp(signal.pattern, 'i');
                                    if (re.test(depsJoined)) {
                                        const entry = scores.get(persona.id)!;
                                        entry.score += signal.weight;
                                        const matched = depsJoined.match(re)?.[0] || signal.pattern;
                                        const reason = `Dependency: ${matched}`;
                                        if (!entry.reasons.includes(reason)) { entry.reasons.push(reason); }
                                    }
                                } catch { /* skip */ }
                            }
                        }
                    } catch { /* skip */ }
                }
                
                // --- Score content signals against key file text ---
                const contentFiles = [
                    path.join(wsRoot, 'README.md'),
                    path.join(wsRoot, 'package.json'),
                ];
                let contentText = '';
                for (const cf of contentFiles) {
                    try {
                        if (await fs.pathExists(cf)) {
                            const raw = await fs.readFile(cf, 'utf-8');
                            contentText += ' ' + raw.slice(0, 2000); // cap to prevent perf issues
                        }
                    } catch { /* skip */ }
                }
                if (contentText) {
                    for (const persona of PERSONAS) {
                        for (const signal of persona.signals) {
                            if (signal.category !== 'content') { continue; }
                            try {
                                const re = new RegExp(signal.pattern, 'i');
                                if (re.test(contentText)) {
                                    const entry = scores.get(persona.id)!;
                                    entry.score += signal.weight;
                                    const reason = `Content matches ${persona.name} signals`;
                                    if (!entry.reasons.includes(reason)) { entry.reasons.push(reason); }
                                }
                            } catch { /* skip */ }
                        }
                    }
                }
                
                // Developer baseline boost for common dev files
                const devFiles = ['package.json', 'tsconfig.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'requirements.txt'];
                for (const file of devFiles) {
                    if (entriesLowerSet.has(file.toLowerCase())) {
                        const devEntry = scores.get('developer')!;
                        devEntry.score += 0.5;
                    }
                }
            } catch {
                // Ignore errors reading directory
            }
        }
    }
    
    // Find persona with highest score
    let bestPersona: Persona | null = null;
    let bestScore = 0;
    let bestReasons: string[] = [];
    
    for (const persona of PERSONAS) {
        const entry = scores.get(persona.id)!;
        if (entry.score > bestScore) {
            bestScore = entry.score;
            bestPersona = persona;
            bestReasons = entry.reasons;
        }
    }
    
    // If profile-based detection found something, return it
    if (bestPersona && bestScore >= 1) {
        const confidence = Math.min(bestScore / 10, 1);
        return {
            persona: bestPersona,
            confidence,
            reasons: bestReasons.slice(0, 5), // Top 5 reasons
            source: 'detected'
        };
    }
    
    // PRIORITY 6: Default fallback to Developer
    const developerPersona = PERSONAS.find(p => p.id === 'developer')!;
    return {
        persona: developerPersona,
        confidence: CONFIDENCE_FALLBACK,
        reasons: ['Default persona (no specific signals detected)'],
        source: 'detected'
    };
}

/**
 * Load user profile from workspace
 */
export async function loadUserProfile(workspaceRoot: string): Promise<UserProfile | null> {
    const profilePaths = [
        path.join(workspaceRoot, '.github', 'config', 'user-profile.json'),
        path.join(workspaceRoot, 'USER-PROFILE.json')
    ];
    
    for (const profilePath of profilePaths) {
        try {
            if (await fs.pathExists(profilePath)) {
                return await fs.readJson(profilePath);
            }
        } catch {
            // Continue to next path
        }
    }
    
    return null;
}

/**
 * Project persona stored in user-profile.json
 */
export interface ProjectPersona {
    id: string;
    confidence: number;
    detectedAt: string;
    reasons: string[];
}

/**
 * Extended user profile with project persona
 */
export interface ExtendedUserProfile {
    name?: string;
    nickname?: string;
    primaryTechnologies?: string[];
    learningGoals?: string[];
    expertiseAreas?: string[];
    currentProjects?: string[];
    projectPersona?: ProjectPersona;
    lastUpdated?: string;
}

/**
 * Detect project technologies from file structure
 */
export async function detectProjectTechnologies(workspaceRoot: string): Promise<string[]> {
    const detected: string[] = [];
    
    const techIndicators: Record<string, string[]> = {
        // Programming languages
        'typescript': ['tsconfig.json', '.ts', '.tsx'],
        'javascript': ['package.json', '.js', '.jsx', '.mjs'],
        'python': ['pyproject.toml', 'requirements.txt', 'setup.py', '.py'],
        'rust': ['Cargo.toml', '.rs'],
        'go': ['go.mod', '.go'],
        'java': ['pom.xml', 'build.gradle', '.java'],
        'csharp': ['.csproj', '.sln', '.cs'],
        'r': ['.Rproj', '.R', '.Rmd'],
        
        // Frameworks
        'react': ['package.json'], // Will check for react dependency
        'vue': ['vue.config.js', '.vue'],
        'angular': ['angular.json', '.angular'],
        
        // Infrastructure
        'terraform': ['*.tf', '.terraform', 'terraform/'],
        'bicep': ['*.bicep', 'main.bicep'],
        'docker': ['Dockerfile', 'docker-compose.yml'],
        'kubernetes': ['deployment.yaml', 'service.yaml', 'k8s/', 'helm/'],
        'cicd': ['.github/workflows/', 'azure-pipelines.yml', '.gitlab-ci.yml'],
        
        // Data science
        'jupyter': ['*.ipynb', 'notebooks/'],
        'data': ['data/', 'pipelines/', 'etl/', 'dbt/', 'lakehouse/'],
        'sql': ['*.sql', 'queries/'],
        
        // Documentation
        'markdown': ['docs/', 'documentation/', '*.mdx'],
        'documentation': ['README.md', 'CONTRIBUTING.md', 'docs/', 'api/'],
        
        // Research/Academic
        'latex': ['.tex', '.bib', 'references/'],
        'research': ['thesis/', 'dissertation/', 'analysis/', 'experiments/', 'references/', 'LITERATURE-MATRIX.md'],
        
        // Creative writing
        'writing': ['chapters/', 'manuscript/', 'drafts/', 'book/', 'outline.md', 'OUTLINE.md'],
        'fiction': ['characters/', 'worldbuilding/', 'scenes/', 'plot/'],
        'scrivener': ['*.scriv'],
        'fountain': ['*.fountain'],
        
        // Learning/Study
        'study': ['courses/', 'notes/', 'flashcards/', 'assignments/', 'study/'],
        
        // Presentations
        'presentations': ['slides/', 'decks/', 'presentations/', 'talks/'],
        
        // Project management
        'project-management': ['sprints/', 'roadmap/', 'epics/', 'backlog/']
    };
    
    try {
        const entries = await fs.readdir(workspaceRoot);
        
        for (const [tech, indicators] of Object.entries(techIndicators)) {
            for (const indicator of indicators) {
                if (indicator.startsWith('*')) {
                    // Extension check
                    const ext = indicator.substring(1);
                    if (entries.some(e => e.endsWith(ext))) {
                        if (!detected.includes(tech)) {detected.push(tech);}
                    }
                } else if (indicator.endsWith('/')) {
                    // Directory check
                    const dir = indicator.slice(0, -1);
                    if (entries.includes(dir) && (await fs.stat(path.join(workspaceRoot, dir))).isDirectory()) {
                        if (!detected.includes(tech)) {detected.push(tech);}
                    }
                } else {
                    // File check
                    if (entries.includes(indicator)) {
                        if (!detected.includes(tech)) {detected.push(tech);}
                    }
                }
            }
        }
        
        // Check package.json for specific frameworks
        const packageJsonPath = path.join(workspaceRoot, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const pkg = await fs.readJson(packageJsonPath);
                const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
                
                if (allDeps.react || allDeps['react-dom']) {
                    if (!detected.includes('react')) {detected.push('react');}
                }
                if (allDeps.vue) {
                    if (!detected.includes('vue')) {detected.push('vue');}
                }
                if (allDeps['@angular/core']) {
                    if (!detected.includes('angular')) {detected.push('angular');}
                }
                if (allDeps.next) {
                    if (!detected.includes('nextjs')) {detected.push('nextjs');}
                }
            } catch {
                // Ignore package.json parse errors
            }
        }
    } catch {
        // Ignore read errors
    }
    
    return detected;
}

/**
 * Detect persona and update user profile with project-specific context.
 * Called during upgrade to help identify the right persona for this project.
 * 
 * @param workspaceRoot - Path to the workspace root
 * @returns The detected persona result, or null if detection failed
 */
export async function detectAndUpdateProjectPersona(
    workspaceRoot: string,
    options?: { updateSlots?: boolean }
): Promise<PersonaDetectionResult | null> {
    const shouldUpdateSlots = options?.updateSlots ?? true;
    // Load existing profile
    const profile = await loadUserProfile(workspaceRoot) as ExtendedUserProfile | null;
    
    // Detect technologies
    const detectedTech = await detectProjectTechnologies(workspaceRoot);
    
    // Try LLM-based detection first (more accurate, dynamic)
    let personaResult: PersonaDetectionResult | null = null;
    try {
        const llmResult = await detectPersonaWithLLM(workspaceRoot, detectedTech);
        if (llmResult) {
            personaResult = llmResult;
        }
    } catch (err) {
        // Fall back to heuristics if LLM unavailable
    }
    
    // Fall back to heuristic-based detection
    if (!personaResult) {
        personaResult = await detectPersona(
            profile ?? undefined,
            vscode.workspace.workspaceFolders
        );
    }
    
    if (!personaResult) {
        return null;
    }
    
    // Update profile with detected persona and technologies
    const profilePath = path.join(workspaceRoot, '.github', 'config', 'user-profile.json');
    
    try {
        if (await fs.pathExists(profilePath)) {
            const currentProfile = await fs.readJson(profilePath) as ExtendedUserProfile;
            
            // Merge detected technologies with existing (avoid duplicates)
            const existingTech = currentProfile.primaryTechnologies || [];
            const mergedTech = [...new Set([...existingTech, ...detectedTech])];
            
            // Update project persona
            const updatedProfile: ExtendedUserProfile = {
                ...currentProfile,
                primaryTechnologies: mergedTech,
                projectPersona: {
                    id: personaResult.persona.id,
                    confidence: personaResult.confidence,
                    detectedAt: new Date().toISOString(),
                    reasons: personaResult.reasons
                },
                lastUpdated: new Date().toISOString()
            };
            
            await fs.writeJson(profilePath, updatedProfile, { spaces: 2 });
        }
    } catch (err) {
        console.warn('[Alex] Failed to update user profile with persona:', err);
    }
    
    // Update Active Context with detected persona
    // Skip during initialization/upgrade — context should remain as defaults until first chat session
    // Focus Trifectas are NOT auto-assigned here — they're managed independently
    if (shouldUpdateSlots) {
        try {
            const { updatePersona } = await import('../shared/activeContextManager');
            await updatePersona(workspaceRoot, personaResult.persona.name, personaResult.confidence);
        } catch (err) {
            console.warn('[Alex] Failed to update Active Context persona:', err);
        }
    }
    
    return personaResult;
}

/**
 * Gather project context for LLM analysis
 */
async function gatherProjectContext(workspaceRoot: string): Promise<string> {
    const contextParts: string[] = [];
    
    // Get directory tree (2 levels deep)
    try {
        const entries = await fs.readdir(workspaceRoot);
        const tree: string[] = [];
        
        for (const entry of entries.slice(0, MAX_DIR_ENTRIES)) {
            if (entry.startsWith('.') && entry !== '.github') {continue;}
            
            const entryPath = path.join(workspaceRoot, entry);
            const stat = await fs.stat(entryPath);
            
            if (stat.isDirectory()) {
                tree.push(`${entry}/`);
                try {
                    const subEntries = await fs.readdir(entryPath);
                    for (const sub of subEntries.slice(0, MAX_SUBDIR_ENTRIES)) {
                        if (!sub.startsWith('.')) {
                            tree.push(`  ${sub}`);
                        }
                    }
                } catch { /* ignore */ }
            } else {
                tree.push(entry);
            }
        }
        contextParts.push(`## Directory Structure\n\`\`\`\n${tree.join('\n')}\n\`\`\``);
    } catch { /* ignore */ }
    
    // Read key files
    const keyFiles = [
        { name: 'README.md', maxLines: 50 },
        { name: 'package.json', maxLines: 30 },
        { name: '.github/copilot-instructions.md', maxLines: 40 }
    ];
    
    for (const { name, maxLines } of keyFiles) {
        const filePath = path.join(workspaceRoot, name);
        try {
            if (await fs.pathExists(filePath)) {
                const content = await fs.readFile(filePath, 'utf-8');
                const lines = content.split('\n').slice(0, maxLines);
                contextParts.push(`## ${name}\n\`\`\`\n${lines.join('\n')}\n\`\`\``);
            }
        } catch { /* ignore */ }
    }
    
    return contextParts.join('\n\n');
}

/**
 * Detect persona using VS Code's LLM API
 * This provides dynamic, context-aware detection without hardcoded patterns
 */
async function detectPersonaWithLLM(
    workspaceRoot: string,
    detectedTech: string[]
): Promise<PersonaDetectionResult | null> {
    // Get available models - prefer GPT-4o, fall back to Claude Sonnet, then any model
    let model: vscode.LanguageModelChat | null = null;
    
    // Try GPT-4o family first (best for persona analysis)
    let models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
    if (models && models.length > 0) {
        model = models[0];
    }
    
    // Fall back to Claude Sonnet family
    if (!model) {
        models = await vscode.lm.selectChatModels({ family: 'claude-sonnet' });
        if (models && models.length > 0) {
            model = models[0];
        }
    }
    
    // Fall back to any available model
    if (!model) {
        const allModels = await vscode.lm.selectChatModels();
        if (!allModels || allModels.length === 0) {
            return null;
        }
        model = allModels[0];
    }
    
    const projectContext = await gatherProjectContext(workspaceRoot);
    
    const prompt = `Analyze this project and identify the most appropriate user persona.

${projectContext}

## Detected Technologies
${detectedTech.join(', ') || 'None detected'}

## Task
Based on the project structure and content, determine:
1. What type of project is this? (e.g., software development, book writing, research, documentation, data engineering)
2. What persona would the user working on this project likely have?
3. What skill would be most relevant for this persona?

## Available Skills (examples)
- code-review: For software developers
- creative-writing: For fiction writers, content creators
- research-project-scaffold: For researchers, academics
- api-documentation: For technical writers
- microsoft-fabric: For data engineers
- gamma-presentations: For presenters, speakers
- project-management: For project managers
- infrastructure-as-code: For DevOps engineers
- architecture-health: For enterprise architects
- game-design: For game developers

## Response Format (JSON only)
\`\`\`json
{
  "personaId": "developer|fiction-writer|game-developer|researcher|technical-writer|data-engineer|presenter|project-manager|devops|architect|student|content-creator|academic",
  "personaName": "Human-readable name",
  "skill": "most-relevant-skill-id",
  "confidence": 0.85,
  "reasons": ["reason 1", "reason 2", "reason 3"]
}
\`\`\`

Respond with ONLY the JSON block, no other text.`;

    try {
        const messages = [vscode.LanguageModelChatMessage.User(prompt)];
        const response = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
        
        // Collect response
        let responseText = '';
        for await (const chunk of response.text) {
            responseText += chunk;
        }
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                          responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            console.warn('[Alex] LLM response did not contain valid JSON');
            return null;
        }
        
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Find or create persona
        const existingPersona = PERSONAS.find(p => p.id === parsed.personaId);
        
        if (existingPersona) {
            return {
                persona: existingPersona,
                confidence: parsed.confidence || 0.8,
                reasons: parsed.reasons || []
            };
        }
        
        // Create dynamic persona from LLM response
        const dynamicPersona: Persona = {
            id: parsed.personaId || 'developer',
            name: parsed.personaName || 'Developer',
            bannerNoun: parsed.personaName?.toUpperCase() || 'PROJECT',
            hook: `Alex-assisted ${parsed.personaName || 'development'}`,
            skill: parsed.skill || 'code-review',
            icon: '🎯',
            accentColor: '#0078D4',  // Default to Azure Blue
            signals: [],
            keywords: [],
            techStack: detectedTech,
            projectPatterns: []
        };
        
        return {
            persona: dynamicPersona,
            confidence: parsed.confidence || 0.8,
            reasons: parsed.reasons || []
        };
        
    } catch (err) {
        console.warn('[Alex] LLM persona detection failed:', err);
        return null;
    }
}

/**
 * DEPRECATED: P5-P7 slot architecture removed in v5.7.x.
 * Use ActiveContextManager.updatePersona() instead.
 * Focus Trifectas are managed independently, not tied to persona detection.
 */
export async function updateWorkingMemorySlots(
    workspaceRoot: string,
    persona: Persona
): Promise<boolean> {
    console.warn('[Alex] updateWorkingMemorySlots() is deprecated. Use ActiveContextManager.updatePersona() instead.');
    try {
        const { updatePersona } = await import('../shared/activeContextManager');
        await updatePersona(workspaceRoot, persona.name, 0.85);
        return true;
    } catch (err) {
        console.warn('[Alex] Failed to update persona via ActiveContextManager:', err);
        return false;
    }
}
