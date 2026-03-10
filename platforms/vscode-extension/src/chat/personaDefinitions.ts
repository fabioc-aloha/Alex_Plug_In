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
 * 
 * NOTE: This map intentionally contains entries beyond the PERSONAS array.
 * Extra entries (sub-specialties, platform-specific, fun) serve LLM-detected
 * personas that return IDs not in the hardcoded signal list.
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
    
    // LearnAlex workshop alignment (v6.3.0)
    'cx-leader':           'personas/PERSONA-CX-LEADER',
    'designer':            'personas/PERSONA-DESIGNER',
    'engineer':            'personas/PERSONA-ENGINEER',
    'executive':           'personas/PERSONA-EXECUTIVE',
    'finance-professional':'personas/PERSONA-FINANCE-PROFESSIONAL',
    'healthcare-professional':'personas/PERSONA-HEALTHCARE-PROFESSIONAL',
    'hr-professional':     'personas/PERSONA-HR-PROFESSIONAL',
    'journalist':          'personas/PERSONA-JOURNALIST',
    'lawyer':              'personas/PERSONA-LAWYER',
    'nonprofit-leader':    'personas/PERSONA-NONPROFIT-LEADER',
    'podcaster':           'personas/PERSONA-PODCASTER',
    'counselor':           'personas/PERSONA-COUNSELOR',
    'real-estate':         'personas/PERSONA-REAL-ESTATE',
    'sales-professional':  'personas/PERSONA-SALES-PROFESSIONAL',
    'scientist':           'personas/PERSONA-SCIENTIST',
    'standup-comic':       'personas/PERSONA-STANDUP-COMIC',
    'teacher':             'personas/PERSONA-TEACHER',
    'visual-storyteller':  'personas/PERSONA-VISUAL-STORYTELLER',
    
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
        bannerNoun: 'CODING',
        hook: 'Ship faster, debug less',
        skill: 'code-review',
        icon: '💻',
        accentColor: '#0078D4',
        signals: [
            { category: 'identity',   pattern: 'developer|software.?eng|programmer|coder|software',             weight: 2.5 },
            { category: 'technology', pattern: 'typescript|javascript|python|java|c#|go|rust|react|angular|vue|node', weight: 2.0 },
            { category: 'structure',  pattern: 'src/',                                                           weight: 1.0 },
            { category: 'dependency', pattern: 'typescript|eslint|jest|mocha|webpack|vite|esbuild',               weight: 1.5 },
            { category: 'content',    pattern: 'npm|build|compile|test|lint',                                    weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'academic',
        name: 'Academic / Grad Student',
        bannerNoun: 'YOUR THESIS',
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
            { category: 'structure',  pattern: 'raw-data/|datasets/|analysis/|experiments/|notebooks/|.ipynb',    weight: 1.5 },
            { category: 'dependency', pattern: 'pandas|numpy|scipy|matplotlib|seaborn|scikit-learn',              weight: 1.5 },
            { category: 'content',    pattern: 'dataset|experiment|finding|analysis|result',                      weight: 0.5 },
        ]
    }),
    buildPersona({
        id: 'technical-writer',
        name: 'Technical Writer',
        bannerNoun: 'DOCUMENTING',
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
        bannerNoun: 'ARCHITECTING',
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
        bannerNoun: 'DATA ENGINEERING',
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
        bannerNoun: 'BUILDING INFRASTRUCTURE',
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
        bannerNoun: 'CREATING CONTENT',
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
        bannerNoun: 'BUILDING GAMES',
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
        bannerNoun: 'MANAGING PROJECTS',
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
        bannerNoun: 'SECURING CODE',
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
            { category: 'structure',  pattern: 'lecture-notes/|study/|courses/|assignments/',                        weight: 1.5 },
            { category: 'content',    pattern: 'lesson|assignment|quiz|exam|lecture|tutorial',                       weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'job-seeker',
        name: 'Job Seeker',
        bannerNoun: 'YOUR CAREER',
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
        bannerNoun: 'PRESENTING',
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
        bannerNoun: 'BUILDING',
        hook: 'Your rocket. Your trajectory.',
        skill: 'git-workflow',
        icon: '🚀',
        accentColor: '#fb923c',
        signals: [
            { category: 'identity',   pattern: 'power.?user|builder|maker|hacker|tinkerer|contributor',            weight: 2.5 },
            { category: 'technology', pattern: 'typescript|python|bash|powershell|git',                             weight: 1.0 },
            { category: 'structure',  pattern: 'skills/|extensions/|plugins/',                                      weight: 1.5 },
            { category: 'content',    pattern: 'extensi|plugin|customiz|automat|contribut',                         weight: 0.5 },
        ]
    }),
    // ── v5.7.1 — 11 new personas from marketing plan ──────────────────
    buildPersona({
        id: 'cognitive-scientist',
        name: 'Cognitive Scientist',
        bannerNoun: 'AI RESEARCH',
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
        bannerNoun: 'OPEN SOURCE',
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
        bannerNoun: 'GRANT WRITING',
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
        bannerNoun: 'COPYWRITING',
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
        bannerNoun: 'BUSINESS ANALYSIS',
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
        bannerNoun: 'INCIDENT RESPONSE',
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
        bannerNoun: 'PRODUCT PLANNING',
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
        bannerNoun: 'DATA ANALYSIS',
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
        bannerNoun: 'CONSULTING',
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
        bannerNoun: 'TESTING',
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
    // ── v6.3.0 — 20 new personas from LearnAlex workshop alignment ──────
    buildPersona({
        id: 'cx-leader',
        name: 'CX Leader',
        bannerNoun: 'CUSTOMER EXPERIENCE',
        hook: 'Journey maps that drive action',
        skill: 'frustration-recognition',
        icon: '💬',
        accentColor: '#2dd4bf',
        signals: [
            { category: 'identity',   pattern: 'customer.?experience|cx|journey.?map|voice.?of.?customer|service.?design', weight: 2.5 },
            { category: 'technology', pattern: 'zendesk|intercom|medallia|qualtrics|hotjar|freshdesk',                     weight: 2.0 },
            { category: 'structure',  pattern: 'journeys/|cx/|personas/|surveys/|feedback/',                               weight: 1.5 },
            { category: 'content',    pattern: 'nps|csat|customer.?journey|touchpoint|pain.?point|service.?blueprint',      weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'designer',
        name: 'Designer (UX/UI)',
        bannerNoun: 'DESIGNING',
        hook: 'Research to pixels, systematically',
        skill: 'ui-ux-design',
        icon: '🎨',
        accentColor: '#8B5CF6',
        signals: [
            { category: 'identity',   pattern: 'designer|ux|ui|user.?experience|user.?interface|interaction.?design',      weight: 2.5 },
            { category: 'technology', pattern: 'figma|sketch|adobe.?xd|storybook|tailwind|css',                            weight: 2.0 },
            { category: 'structure',  pattern: 'design/|mockups/|wireframes/|prototypes/|design-system/|components/',      weight: 1.5 },
            { category: 'dependency', pattern: 'tailwindcss|storybook|@radix-ui|@headlessui|styled-components|@emotion|@chakra-ui|@mui', weight: 1.5 },
            { category: 'content',    pattern: 'wireframe|prototype|usability|design.?system|component|accessibility',      weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'engineer',
        name: 'Engineer',
        bannerNoun: 'ENGINEERING',
        hook: 'Specs that build confidence',
        skill: 'architecture-health',
        icon: '⚙️',
        accentColor: '#0078D4',
        signals: [
            { category: 'identity',   pattern: 'engineer|mechanical|electrical|civil|structural|systems.?eng',             weight: 2.5 },
            { category: 'technology', pattern: 'matlab|simulink|autocad|solidworks|ansys|labview',                         weight: 2.0 },
            { category: 'structure',  pattern: 'specs/|drawings/|calculations/|simulations/|requirements/',                weight: 1.5 },
            { category: 'content',    pattern: 'specification|tolerance|failure.?analysis|design.?review|bom|technical.?report', weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'startup-founder',
        name: 'Entrepreneur',
        bannerNoun: 'BUILDING A STARTUP',
        hook: 'From idea to traction, fast',
        skill: 'financial-analysis',
        icon: '🚀',
        accentColor: '#fb923c',
        signals: [
            { category: 'identity',   pattern: 'entrepreneur|startup|founder|co.?founder|bootstrapp|mvp|venture',          weight: 2.5 },
            { category: 'technology', pattern: 'stripe|shopify|vercel|firebase|supabase|heroku',                           weight: 2.0 },
            { category: 'structure',  pattern: 'pitch/|business-plan/|mvp/|investors/|fundraising/',                       weight: 2.0 },
            { category: 'content',    pattern: 'pitch.?deck|runway|market.?fit|investor|fundrais|valuation|traction',       weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'executive',
        name: 'Executive (CxO)',
        bannerNoun: 'LEADING',
        hook: 'Strategic clarity, on demand',
        skill: 'executive-storytelling',
        icon: '👔',
        accentColor: '#6366f1',
        signals: [
            { category: 'identity',   pattern: 'executive|ceo|cto|cfo|cio|coo|vp|director|c.?suite|chief',                weight: 2.5 },
            { category: 'technology', pattern: 'power.?bi|tableau|jira|confluence|slack|teams',                            weight: 1.5 },
            { category: 'structure',  pattern: 'strategy/|board/|governance/|executive/',                                  weight: 2.0 },
            { category: 'content',    pattern: 'board.?meeting|strategic.?plan|quarterly|organizational|shareholder',       weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'finance-professional',
        name: 'Finance Professional',
        bannerNoun: 'FINANCIAL ANALYSIS',
        hook: 'Numbers tell stories — tell them well',
        skill: 'financial-analysis',
        icon: '💹',
        accentColor: '#2dd4bf',
        signals: [
            { category: 'identity',   pattern: 'finance|financial|accounting|cpa|cfa|investment|analyst',                  weight: 2.5 },
            { category: 'technology', pattern: 'excel|power.?bi|bloomberg|quickbooks|sap',                                weight: 2.0 },
            { category: 'structure',  pattern: 'financials/|budgets/|forecasts/|reports/|audit/',                          weight: 1.5 },
            { category: 'dependency', pattern: 'openpyxl|pandas|plotly|chart\\.js|d3|financial|quantlib',                  weight: 1.5 },
            { category: 'content',    pattern: 'revenue|margin|forecast|balance.?sheet|p&l|roi|irr|dcf',                   weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'healthcare-professional',
        name: 'Healthcare Professional',
        bannerNoun: 'HEALTHCARE',
        hook: 'Clinical documentation, simplified',
        skill: 'healthcare-informatics',
        icon: '🏥',
        accentColor: '#f43f5e',
        signals: [
            { category: 'identity',   pattern: 'healthcare|medical|clinical|physician|nurse|pharmacist|health',            weight: 2.5 },
            { category: 'structure',  pattern: 'clinical/|patient/|protocols/|ehr/',                                       weight: 2.0 },
            { category: 'content',    pattern: 'patient|diagnosis|treatment|clinical.?trial|ehr|hipaa|soap.?note',          weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'hr-professional',
        name: 'HR & People Ops',
        bannerNoun: 'PEOPLE OPERATIONS',
        hook: 'People programs that scale',
        skill: 'hr-people-operations',
        icon: '👥',
        accentColor: '#fb7185',
        signals: [
            { category: 'identity',   pattern: 'hr|human.?resource|people.?ops|talent|recruiting|onboarding',              weight: 2.5 },
            { category: 'technology', pattern: 'workday|bamboohr|greenhouse|lever|lattice|rippling',                       weight: 2.0 },
            { category: 'structure',  pattern: 'policies/|onboarding/|hiring/|people/|hr/',                                weight: 2.0 },
            { category: 'content',    pattern: 'job.?description|onboarding|performance.?review|compensation|benefits',     weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'journalist',
        name: 'Journalist',
        bannerNoun: 'JOURNALISM',
        hook: 'Research deep, write fast',
        skill: 'journalism',
        icon: '📰',
        accentColor: '#f97316',
        signals: [
            { category: 'identity',   pattern: 'journalist|reporter|editor|newsroom|investigat|press',                     weight: 2.5 },
            { category: 'technology', pattern: 'wordpress|substack|medium|google.?docs|ap.?style|reuters',                 weight: 1.5 },
            { category: 'structure',  pattern: 'stories/|articles/|drafts/|sources/|investigations/',                      weight: 1.5 },
            { category: 'content',    pattern: 'byline|source|deadline|editorial|fact.?check|interview|headline',           weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'knowledge-worker',
        name: 'Knowledge Worker',
        bannerNoun: 'KNOWLEDGE WORK',
        hook: 'Turn information into decisions',
        skill: 'business-analysis',
        icon: '🧩',
        accentColor: '#2dd4bf',
        signals: [
            { category: 'identity',   pattern: 'knowledge.?worker|information|briefing|executive.?summary|memo',           weight: 2.5 },
            { category: 'technology', pattern: 'notion|obsidian|confluence|sharepoint|onenote',                            weight: 1.5 },
            { category: 'structure',  pattern: 'wiki/|knowledge-base/|memos/|briefings/|meeting-notes/',                   weight: 1.5 },
            { category: 'content',    pattern: 'briefing|executive.?summary|talking.?points|scenario|synthesis',            weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'lawyer',
        name: 'Lawyer',
        bannerNoun: 'LEGAL WORK',
        hook: 'Research, draft, argue — faster',
        skill: 'legal-compliance',
        icon: '⚖️',
        accentColor: '#6366f1',
        signals: [
            { category: 'identity',   pattern: 'lawyer|attorney|legal|paralegal|counsel|litigat|contract',                 weight: 2.5 },
            { category: 'structure',  pattern: 'contracts/|briefs/|legal/|compliance/|discovery/',                         weight: 2.0 },
            { category: 'content',    pattern: 'contract|clause|brief|motion|statute|regulation|compliance|precedent',      weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'nonprofit-leader',
        name: 'Nonprofit Leader',
        bannerNoun: 'NONPROFIT LEADERSHIP',
        hook: 'Mission-driven, donor-funded',
        skill: 'grant-writing',
        icon: '💚',
        accentColor: '#2dd4bf',
        signals: [
            { category: 'identity',   pattern: 'nonprofit|ngo|charity|fundrais|donor|foundation|advocacy|social.?impact',  weight: 2.5 },
            { category: 'technology', pattern: 'salesforce|bloomerang|classy|neon|donorbox|givebutter',                    weight: 2.0 },
            { category: 'structure',  pattern: 'grants/|fundraising/|donors/|programs/|impact/',                           weight: 2.0 },
            { category: 'content',    pattern: 'donor|grant|impact.?report|annual.?report|program|advocacy|mission',        weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'podcaster',
        name: 'Podcaster',
        bannerNoun: 'PODCASTING',
        hook: 'Plan, record, publish — repeat',
        skill: 'creative-writing',
        icon: '🎙️',
        accentColor: '#fb7185',
        signals: [
            { category: 'identity',   pattern: 'podcast|audio|episode|show.?notes|interview|hosting',                     weight: 2.5 },
            { category: 'technology', pattern: 'audacity|descript|anchor|spotify|apple.?podcast|rss',                      weight: 2.0 },
            { category: 'structure',  pattern: 'episodes/|show-notes/|transcripts/|audio/',                                weight: 1.5 },
            { category: 'dependency', pattern: 'ffmpeg-static|fluent-ffmpeg|rss-parser|podcast-feed-parser',               weight: 1.5 },
            { category: 'content',    pattern: 'episode|guest|show.?notes|transcript|listener|audience',                    weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'counselor',
        name: 'Psychology Counselor',
        bannerNoun: 'COUNSELING',
        hook: 'Documentation that serves the client',
        skill: 'counseling-psychology',
        icon: '🧠',
        accentColor: '#818cf8',
        signals: [
            { category: 'identity',   pattern: 'counselor|therapist|psycholog|mental.?health|clinical|psychotherapy',      weight: 2.5 },
            { category: 'technology', pattern: 'simplepractice|theranest|doxy|therapynotes|wiley',                         weight: 2.0 },
            { category: 'structure',  pattern: 'cases/|assessments/|treatment-plans/|session-notes/|intake/',              weight: 2.0 },
            { category: 'content',    pattern: 'treatment.?plan|case.?conceptual|intake|assessment|psychoeducat|dsm',       weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'real-estate',
        name: 'Real Estate Professional',
        bannerNoun: 'REAL ESTATE',
        hook: 'Listings that sell, offers that close',
        skill: 'sales-enablement',
        icon: '🏠',
        accentColor: '#fb923c',
        signals: [
            { category: 'identity',   pattern: 'real.?estate|realtor|broker|property|listing|mls',                         weight: 2.5 },
            { category: 'technology', pattern: 'zillow|mls|dotloop|docusign|canva|kvcore',                                weight: 2.0 },
            { category: 'structure',  pattern: 'listings/|properties/|offers/|comps/|market-analysis/',                    weight: 2.0 },
            { category: 'content',    pattern: 'listing|property|offer|closing|commission|buyer|seller|comp|appraisal',     weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'sales-professional',
        name: 'Sales Professional',
        bannerNoun: 'SELLING',
        hook: 'Pipeline to closed-won, systematically',
        skill: 'sales-enablement',
        icon: '🤑',
        accentColor: '#f43f5e',
        signals: [
            { category: 'identity',   pattern: 'sales|account.?exec|business.?develop|pipeline|quota|prospecting',         weight: 2.5 },
            { category: 'technology', pattern: 'salesforce|hubspot|outreach|gong|zoominfo',                                weight: 2.0 },
            { category: 'structure',  pattern: 'pipeline/|leads/|proposals/|accounts/|territories/',                       weight: 1.5 },
            { category: 'content',    pattern: 'prospect|discovery.?call|proposal|objection|close|quota|pipeline',          weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'scientist',
        name: 'Scientist',
        bannerNoun: 'SCIENTIFIC RESEARCH',
        hook: 'Hypothesis to manuscript, accelerated',
        skill: 'research-project-scaffold',
        icon: '🔭',
        accentColor: '#0d9488',
        signals: [
            { category: 'identity',   pattern: 'scientist|biolog|chemist|physicist|geolog|ecolog|neurosci',                weight: 2.5 },
            { category: 'technology', pattern: 'python|r\b|matlab|spss|prism|imagej|blast',                               weight: 1.5 },
            { category: 'structure',  pattern: 'lab-notebooks/|protocols/|data/|manuscripts/|figures/',                    weight: 1.5 },
            { category: 'dependency', pattern: 'scipy|numpy|pandas|matplotlib|biopython|astropy|rdkit|statsmodels',        weight: 1.5 },
            { category: 'content',    pattern: 'hypothesis|protocol|specimen|reagent|method|result|manuscript|peer.?review', weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'standup-comic',
        name: 'Standup Comic',
        bannerNoun: 'COMEDY WRITING',
        hook: 'Premises that punch, tags that land',
        skill: 'comedy-writing',
        icon: '🎤',
        accentColor: '#fb7185',
        signals: [
            { category: 'identity',   pattern: 'standup|comedian|comic|comedy|humor|funny|improv',                         weight: 2.5 },
            { category: 'structure',  pattern: 'sets/|bits/|jokes/|premises/|material/',                                   weight: 2.0 },
            { category: 'content',    pattern: 'premise|punchline|tag|callback|set.?list|bit|crowd.?work|tight.?five',      weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'teacher',
        name: 'Teacher / Educator',
        bannerNoun: 'TEACHING',
        hook: 'Lessons that engage, assessments that reveal',
        skill: 'learning-psychology',
        icon: '👩‍🏫',
        accentColor: '#2dd4bf',
        signals: [
            { category: 'identity',   pattern: 'teacher|educator|instructor|professor|curriculum|lesson.?plan',            weight: 2.5 },
            { category: 'technology', pattern: 'canvas|moodle|blackboard|google.?classroom',                               weight: 2.0 },
            { category: 'structure',  pattern: 'lessons/|curriculum/|assessments/|rubrics/|syllabi/',                       weight: 1.5 },
            { category: 'dependency', pattern: 'reveal\\.js|@marp-team|marked|remark|katex|mathjax',                      weight: 1.5 },
            { category: 'content',    pattern: 'lesson.?plan|rubric|differentiat|assessment|learning.?objective|bloom',     weight: 1.0 },
        ]
    }),
    buildPersona({
        id: 'visual-storyteller',
        name: 'Visual Storyteller',
        bannerNoun: 'DATA VISUALIZATION',
        hook: 'Charts that persuade, dashboards that inspire',
        skill: 'microsoft-fabric',
        icon: '📊',
        accentColor: '#2dd4bf',
        signals: [
            { category: 'identity',   pattern: 'visual.?story|data.?viz|infograph|chart|dashboard.?design|presentation',   weight: 2.5 },
            { category: 'technology', pattern: 'power.?bi|d3|tableau|plotly|matplotlib|seaborn|vega',                      weight: 2.0 },
            { category: 'structure',  pattern: 'charts/|visualizations/|dashboards/|infographics/',                        weight: 1.5 },
            { category: 'content',    pattern: 'chart|visualiz|infographic|dashboard|data.?story|annotation',               weight: 1.0 },
        ]
    }),
];
