/**
 * Persona Definitions — Data Layer
 * 
 * Contains all persona data definitions, avatar mappings, and Easter egg system.
 * Extracted from personaDetection.ts for DoD monolith breakup.
 * 
 * Detection LOGIC remains in personaDetection.ts — this file is pure data.
 */

// ============================================================================
// INTERFACES
// ============================================================================

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

// ============================================================================
// AVATAR MAPPING
// ============================================================================

/**
 * Persona-to-avatar image mapping.
 * Each persona ID maps to an avatar path (no extension) relative to assets/avatars/.
 * v5.9.1: Now uses organized subdirectories:
 *   - personas/PERSONA-* for role-based avatars
 *   - ages/Alex-* for age-based fallback
 * Both .webp (primary) and .png (fallback) are shipped.
 * Fallback: logo (rocket brand mark).
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

/** Default avatar path (no extension) when no persona match - rocket logo */
export const DEFAULT_AVATAR = 'logo';

/**
 * Get avatar base name (no extension) for a persona ID.
 * Use with .webp/.png in assets/avatars/ for persona entries, or assets/ for the rocket-logo fallback.
 * @returns Base name (e.g., 'ALEX-CODING') or DEFAULT_AVATAR
 */
export function getAvatarForPersona(personaId: string): string {
    return PERSONA_AVATAR_MAP[personaId] || DEFAULT_AVATAR;
}

// ============================================================================
// EASTER EGG SYSTEM
// ============================================================================
// Surprise avatar overrides based on date (seasonal) or project name.
// Returns null when no Easter egg applies — caller uses normal persona avatar.

export interface EasterEgg {
    /** Short label for tooltip/display */
    label: string;
    /** Emoji indicator */
    emoji: string;
    /** Optional accent color for avatar border (defaults to blue) */
    accentColor?: string;
}

/** Seasonal Easter eggs — checked by month/day */
const SEASONAL_EGGS: Array<{ month: number; day: number; egg: EasterEgg }> = [
    { month: 1,  day: 1,  egg: { label: 'Happy New Year!',          emoji: '🎉', accentColor: '#FFD700' } },
    { month: 2,  day: 14, egg: { label: 'Happy Valentine\'s Day!',  emoji: '💝', accentColor: '#FF69B4' } },
    { month: 3,  day: 7,  egg: { label: 'Happy Birthday, Fabio!',   emoji: '🎂', accentColor: '#FF1493' } },
    { month: 3,  day: 14, egg: { label: 'Happy Pi Day!',            emoji: '🥧', accentColor: '#D2691E' } },
    { month: 3,  day: 17, egg: { label: 'Happy St. Patrick\'s Day!', emoji: '🍀', accentColor: '#00A86B' } },
    // Easter is calculated dynamically (March 22 - April 25), using April 20, 2025 as placeholder
    { month: 4,  day: 20, egg: { label: 'Happy Easter!',            emoji: '🐰', accentColor: '#E6B0E6' } },
    { month: 7,  day: 4,  egg: { label: 'Happy Independence Day!',  emoji: '🎆', accentColor: '#DC143C' } },
    { month: 10, day: 31, egg: { label: 'Happy Halloween!',         emoji: '🎃', accentColor: '#FF8C00' } },
    { month: 11, day: 27, egg: { label: 'Happy Thanksgiving!',      emoji: '🦃', accentColor: '#D2691E' } },
    { month: 12, day: 24, egg: { label: 'Happy Holidays!',          emoji: '🎄', accentColor: '#228B22' } },
    { month: 12, day: 25, egg: { label: 'Merry Christmas!',         emoji: '🎄', accentColor: '#228B22' } },
    { month: 12, day: 31, egg: { label: 'New Year\'s Eve!',         emoji: '🎊', accentColor: '#FFD700' } },
];

/** Project-name Easter eggs — regex matched against workspace folder name (case-insensitive) */
const PROJECT_NAME_EGGS: Array<{ pattern: RegExp; egg: EasterEgg }> = [
    { pattern: /\b(cook|recipe|chef|food|kitchen|bak(e|ing))\b/i,         egg: { label: 'Cooking project!',    emoji: '🍳', accentColor: '#FF6347' } },
    { pattern: /\b(dog|pet|puppy|animal|vet(erinary)?|cat)\b/i,           egg: { label: 'Pet project!',        emoji: '🐕', accentColor: '#8B4513' } },
    { pattern: /\b(wine|sommelier|vineyard|brewery|beer|cocktail)\b/i,    egg: { label: 'Wine country!',       emoji: '🍷', accentColor: '#722F37' } },
    { pattern: /\b(comedy|joke|humor|roast|funny|meme|standup)\b/i,       egg: { label: 'Comedy mode!',        emoji: '😂', accentColor: '#FFD700' } },
    { pattern: /\b(podcast|audio|radio|episode)\b/i,                      egg: { label: 'Podcast studio!',     emoji: '🎙️', accentColor: '#FF4500' } },
    { pattern: /\b(invest|financ|trading|stock|portfolio|crypto)\b/i,     egg: { label: 'Finance mode!',       emoji: '📈', accentColor: '#228B22' } },
    { pattern: /\b(legal|patent|copyright|trademark|compliance)\b/i,      egg: { label: 'Legal eagle!',        emoji: '⚖️', accentColor: '#2F4F4F' } },
    { pattern: /\b(survey|questionnaire|poll|census)\b/i,                 egg: { label: 'Survey time!',        emoji: '📋', accentColor: '#4169E1' } },
    { pattern: /\b(mentor|onboard|coach|tutor)\b/i,                       egg: { label: 'Mentor mode!',        emoji: '🧑‍🏫', accentColor: '#FF8C00' } },
    // Milestone/Achievement patterns
    { pattern: /\b(milestone|achievement|release|launch|v?1\.0|shipped)\b/i, egg: { label: 'Milestone achieved!', emoji: '🏆', accentColor: '#FFD700' } },
    { pattern: /\b(celebrate|celebration|success|victory|win)\b/i,        egg: { label: 'Celebrating!',        emoji: '🎉', accentColor: '#FF69B4' } },
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

// ============================================================================
// PERSONA BUILDER
// ============================================================================

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

// ============================================================================
// PERSONA DEFINITIONS
// ============================================================================

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
        accentColor: '#0d9488',
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
        accentColor: '#f97316',
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
        accentColor: '#6366f1',
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
        accentColor: '#f43f5e',
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
        accentColor: '#fb7185',
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
        accentColor: '#818cf8',
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
        accentColor: '#6366f1',
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
        accentColor: '#2dd4bf',
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
        accentColor: '#f43f5e',
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
        accentColor: '#818cf8',
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
        accentColor: '#2dd4bf',
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
        accentColor: '#f97316',
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
        accentColor: '#fb923c',
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
        accentColor: '#818cf8',
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
        accentColor: '#2dd4bf',
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
        accentColor: '#f97316',
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
        accentColor: '#fb7185',
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
        accentColor: '#0d9488',
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
        accentColor: '#f43f5e',
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
        accentColor: '#6366f1',
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
        accentColor: '#2dd4bf',
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
        accentColor: '#6366f1',
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
        accentColor: '#0d9488',
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
        accentColor: '#f43f5e',
        signals: [
            { category: 'identity',   pattern: 'marketer|marketing|campaign|seo|growth|brand|analytics',               weight: 2.5 },
            { category: 'technology', pattern: 'google.?analytics|hubspot|mailchimp|segment|mixpanel',                  weight: 2.0 },
            { category: 'structure',  pattern: 'campaigns/|marketing/|email-templates/|landing-pages/',                 weight: 1.5 },
            { category: 'content',    pattern: 'campaign|funnel|conversion|lead|segment|attribution',                   weight: 1.0 },
        ]
    }),
];
