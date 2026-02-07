/**
 * Persona Detection Module
 * 
 * Identifies user personas from their profile and project context.
 * Uses LLM-based analysis for dynamic persona detection.
 * 
 * v5.0.0 Feature: Know Your Customer
 * v5.1.0 Feature: LLM-based persona detection + P6 update
 * v5.1.1 Feature: Priority-based detection chain
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

/**
 * Marketing persona definition
 */
export interface Persona {
    id: string;
    name: string;
    bannerNoun: string;
    hook: string;
    skill: string;
    icon: string;
    accentColor: string;  // Hex color for badges/pills
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
 * All defined personas from marketing plan
 */
export const PERSONAS: Persona[] = [
    {
        id: 'developer',
        name: 'Developer',
        bannerNoun: 'CODE',
        hook: 'Ship faster, debug less',
        skill: 'code-quality',
        icon: '💻',
        accentColor: '#0078D4',  // Azure Blue
        keywords: ['developer', 'engineer', 'programmer', 'coder', 'software'],
        techStack: ['typescript', 'javascript', 'python', 'java', 'c#', 'go', 'rust', 'react', 'angular', 'vue', 'node'],
        projectPatterns: ['src/', 'package.json', 'tsconfig.json', 'pom.xml', 'Cargo.toml', 'go.mod']
    },
    {
        id: 'academic',
        name: 'Academic / Grad Student',
        bannerNoun: 'THESIS',
        hook: 'Literature review on autopilot',
        skill: 'research-project-scaffold',
        icon: '🎓',
        accentColor: '#8B5CF6',  // Purple
        keywords: ['student', 'phd', 'thesis', 'dissertation', 'academic', 'university', 'graduate', 'research'],
        techStack: ['latex', 'bibtex', 'markdown', 'r', 'python', 'jupyter'],
        projectPatterns: ['.tex', '.bib', 'thesis/', 'dissertation/', 'chapters/', 'references/']
    },
    {
        id: 'researcher',
        name: 'Researcher',
        bannerNoun: 'RESEARCH',
        hook: 'Hypothesis to publication, accelerated',
        skill: 'research-project-scaffold',
        icon: '🔬',
        accentColor: '#10B981',  // Emerald Green
        keywords: ['researcher', 'scientist', 'lab', 'data', 'analysis', 'experiment', 'hypothesis'],
        techStack: ['python', 'r', 'julia', 'matlab', 'jupyter', 'pandas', 'numpy'],
        projectPatterns: ['data/', 'analysis/', 'experiments/', 'notebooks/', '.ipynb']
    },
    {
        id: 'technical-writer',
        name: 'Technical Writer',
        bannerNoun: 'DOCUMENTATION',
        hook: 'Docs that write themselves',
        skill: 'api-documentation',
        icon: '📝',
        accentColor: '#F59E0B',  // Amber
        keywords: ['writer', 'documentation', 'docs', 'technical', 'api', 'manual'],
        techStack: ['markdown', 'rst', 'asciidoc', 'docusaurus', 'sphinx', 'mkdocs'],
        projectPatterns: ['docs/', 'documentation/', 'README.md', 'CONTRIBUTING.md', '.mdx']
    },
    {
        id: 'architect',
        name: 'Enterprise Architect',
        bannerNoun: 'ARCHITECTURE',
        hook: 'Self-documenting cognitive architecture',
        skill: 'architecture-health',
        icon: '🏗️',
        accentColor: '#6366F1',  // Indigo
        keywords: ['architect', 'system', 'enterprise', 'design', 'infrastructure'],
        techStack: ['terraform', 'bicep', 'kubernetes', 'docker', 'azure', 'aws'],
        projectPatterns: ['infra/', 'terraform/', 'bicep/', 'kubernetes/', 'helm/', 'ADR/']
    },
    {
        id: 'data-engineer',
        name: 'Data Engineer',
        bannerNoun: 'DATA',
        hook: 'Governance on autopilot',
        skill: 'microsoft-fabric',
        icon: '📊',
        accentColor: '#06B6D4',  // Cyan
        keywords: ['data', 'engineer', 'etl', 'pipeline', 'warehouse', 'analytics', 'fabric', 'lakehouse'],
        techStack: ['sql', 'python', 'spark', 'dbt', 'fabric', 'synapse', 'databricks'],
        projectPatterns: ['pipelines/', 'etl/', 'dbt/', 'notebooks/', 'lakehouse/']
    },
    {
        id: 'devops',
        name: 'DevOps Engineer',
        bannerNoun: 'INFRASTRUCTURE',
        hook: 'Same infra, every time. Automated.',
        skill: 'infrastructure-as-code',
        icon: '⚙️',
        accentColor: '#EF4444',  // Red
        keywords: ['devops', 'sre', 'infrastructure', 'ci', 'cd', 'deployment', 'automation'],
        techStack: ['terraform', 'ansible', 'docker', 'kubernetes', 'github-actions', 'azure-devops'],
        projectPatterns: ['.github/workflows/', 'azure-pipelines.yml', 'Dockerfile', '.gitlab-ci.yml']
    },
    {
        id: 'content-creator',
        name: 'Content Creator',
        bannerNoun: 'CONTENT',
        hook: 'Ideas to posts in minutes',
        skill: 'creative-writing',
        icon: '✍️',
        accentColor: '#EC4899',  // Pink
        keywords: ['content', 'creator', 'blogger', 'writer', 'newsletter', 'social'],
        techStack: ['markdown', 'ghost', 'wordpress', 'substack', 'notion'],
        projectPatterns: ['posts/', 'articles/', 'blog/', 'content/', 'drafts/']
    },
    {
        id: 'fiction-writer',
        name: 'Fiction Writer',
        bannerNoun: 'WRITING',
        hook: 'Your story structure co-author',
        skill: 'creative-writing',
        icon: '📚',
        accentColor: '#A855F7',  // Violet
        keywords: ['fiction', 'novel', 'screenplay', 'story', 'author', 'creative', 'book', 'writing'],
        techStack: ['markdown', 'scrivener', 'fountain', 'writing'],
        projectPatterns: ['chapters/', 'manuscript/', 'outline/', 'characters/', '.fountain', 'book/', 'drafts/', 'scenes/', 'OUTLINE.md', 'outline.md', 'plot/', 'worldbuilding/']
    },
    {
        id: 'project-manager',
        name: 'Project Manager',
        bannerNoun: 'PROJECTS',
        hook: '4-6× faster than human estimates',
        skill: 'project-management',
        icon: '📋',
        accentColor: '#14B8A6',  // Teal
        keywords: ['project', 'manager', 'agile', 'scrum', 'sprint', 'roadmap'],
        techStack: ['markdown', 'jira', 'azure-boards', 'notion', 'linear'],
        projectPatterns: ['sprints/', 'roadmap/', 'epics/', 'backlog/']
    },
    {
        id: 'security',
        name: 'Security Engineer',
        bannerNoun: 'SECURITY',
        hook: 'Threat-aware by default',
        skill: 'incident-response',
        icon: '🔐',
        accentColor: '#DC2626',  // Crimson
        keywords: ['security', 'threat', 'audit', 'compliance', 'penetration', 'vulnerability'],
        techStack: ['python', 'bash', 'powershell', 'terraform'],
        projectPatterns: ['security/', 'audits/', 'compliance/', 'threat-models/']
    },
    {
        id: 'student',
        name: 'Student',
        bannerNoun: 'LEARNING',
        hook: 'Master concepts, not just memorize',
        skill: 'learning-psychology',
        icon: '📖',
        accentColor: '#3B82F6',  // Blue
        keywords: ['student', 'learning', 'study', 'course', 'class', 'homework'],
        techStack: ['markdown', 'notion', 'obsidian'],
        projectPatterns: ['notes/', 'study/', 'courses/', 'assignments/']
    },
    {
        id: 'job-seeker',
        name: 'Job Seeker',
        bannerNoun: 'CAREER',
        hook: 'Stand out, get hired',
        skill: 'creative-writing',
        icon: '💼',
        accentColor: '#84CC16',  // Lime
        keywords: ['job', 'career', 'resume', 'interview', 'portfolio', 'linkedin'],
        techStack: ['markdown', 'latex'],
        projectPatterns: ['resume/', 'portfolio/', 'cover-letters/', 'cv/']
    },
    {
        id: 'presenter',
        name: 'Speaker / Presenter',
        bannerNoun: 'PRESENTATIONS',
        hook: 'Notes → polished slides in minutes',
        skill: 'gamma-presentations',
        icon: '🎤',
        accentColor: '#F97316',  // Orange
        keywords: ['speaker', 'presenter', 'slides', 'deck', 'talk', 'conference', 'workshop'],
        techStack: ['markdown', 'marp', 'reveal.js', 'gamma'],
        projectPatterns: ['slides/', 'decks/', 'presentations/', 'talks/']
    },
    {
        id: 'power-user',
        name: 'Power User / Builder',
        bannerNoun: 'PROJECTS',
        hook: 'Your rocket. Your trajectory.',
        skill: 'git-workflow',
        icon: '🚀',
        accentColor: '#FBBF24',  // Gold
        keywords: ['power user', 'builder', 'maker', 'hacker', 'tinkerer', 'contributor'],
        techStack: ['typescript', 'python', 'bash', 'powershell', 'git'],
        projectPatterns: ['skills/', '.github/', 'extensions/', 'plugins/']
    }
];

// ============================================================================
// PRIORITY CHAIN DETECTION HELPERS
// ============================================================================

/**
 * PRIORITY 1: Detect persona from active Focus session (Pomodoro timer)
 * Highest priority - if user explicitly started a focus session with a topic,
 * that topic should drive persona detection.
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
        
        const topic = sessionState.topic.toLowerCase();
        
        // Match topic against persona keywords
        for (const persona of PERSONAS) {
            for (const keyword of persona.keywords) {
                if (topic.includes(keyword)) {
                    return {
                        persona,
                        confidence: 0.95,
                        reasons: [`Active focus session: "${sessionState.topic}"`]
                    };
                }
            }
            // Also check tech stack
            for (const tech of persona.techStack) {
                if (topic.includes(tech)) {
                    return {
                        persona,
                        confidence: 0.9,
                        reasons: [`Focus session on ${tech}: "${sessionState.topic}"`]
                    };
                }
            }
        }
    } catch {
        // Session state not available
    }
    return null;
}

/**
 * PRIORITY 2: Detect persona from current session goal
 * Second priority - explicit goals set for this session.
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
        
        // Check goal titles and tags for persona matches
        for (const goal of activeGoals) {
            const goalText = `${goal.title} ${goal.description || ''} ${(goal.tags || []).join(' ')}`.toLowerCase();
            
            for (const persona of PERSONAS) {
                for (const keyword of persona.keywords) {
                    if (goalText.includes(keyword)) {
                        return {
                            persona,
                            confidence: 0.85,
                            reasons: [`Active goal: "${goal.title}"`]
                        };
                    }
                }
            }
        }
    } catch {
        // Goals not available
    }
    return null;
}

/**
 * PRIORITY 3: Detect persona from project phase
 * Third priority - current phase of the project lifecycle.
 */
async function detectFromProjectPhase(rootPath?: string): Promise<Omit<PersonaDetectionResult, 'source'> | null> {
    if (!rootPath) { return null; }
    
    try {
        // Check for ROADMAP files that indicate current phase
        const roadmapPaths = [
            path.join(rootPath, 'ROADMAP.md'),
            path.join(rootPath, 'ROADMAP-UNIFIED.md'),
            path.join(rootPath, '.github', 'ROADMAP.md')
        ];
        
        for (const roadmapPath of roadmapPaths) {
            if (await fs.pathExists(roadmapPath)) {
                const content = await fs.readFile(roadmapPath, 'utf8');
                const contentLower = content.toLowerCase();
                
                // Look for current phase indicators
                const phaseKeywords: Array<{ keywords: string[]; persona: string }> = [
                    { keywords: ['🔄 in progress', '## current', 'active track'], persona: 'developer' },
                    { keywords: ['documentation phase', 'docs sprint'], persona: 'technical-writer' },
                    { keywords: ['release phase', 'publishing', 'deployment'], persona: 'devops' },
                    { keywords: ['architecture review', 'design phase'], persona: 'architect' },
                    { keywords: ['research phase', 'literature review'], persona: 'researcher' },
                    { keywords: ['presentation', 'demo prep'], persona: 'presenter' }
                ];
                
                for (const { keywords, persona: personaId } of phaseKeywords) {
                    if (keywords.some(k => contentLower.includes(k))) {
                        const persona = PERSONAS.find(p => p.id === personaId);
                        if (persona) {
                            return {
                                persona,
                                confidence: 0.75,
                                reasons: [`Project phase from roadmap`]
                            };
                        }
                    }
                }
            }
        }
    } catch {
        // Roadmap not available
    }
    return null;
}

/**
 * PRIORITY 4: Detect persona from project learning goals
 * Fourth priority - what the user is trying to learn in this project.
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
            const goalLower = (goal as string).toLowerCase();
            
            for (const persona of PERSONAS) {
                for (const keyword of persona.keywords) {
                    if (goalLower.includes(keyword)) {
                        return {
                            persona,
                            confidence: 0.7,
                            reasons: [`Learning goal: "${goal}"`]
                        };
                    }
                }
            }
        }
    } catch {
        // Profile not available
    }
    return null;
}

/**
 * User profile structure (subset relevant for persona detection)
 */
interface UserProfile {
    name?: string;
    nickname?: string;
    primaryTechnologies?: string[];
    learningGoals?: string[];
    expertiseAreas?: string[];
    currentProjects?: string[];
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
    if (focusResult && focusResult.confidence >= 0.8) {
        return { ...focusResult, source: 'detected' };
    }
    
    // PRIORITY 2: Check session goal from goals.json
    const goalResult = await detectFromSessionGoals(rootPath);
    if (goalResult && goalResult.confidence >= 0.7) {
        return { ...goalResult, source: 'detected' };
    }
    
    // PRIORITY 3: Check project phase from config
    const phaseResult = await detectFromProjectPhase(rootPath);
    if (phaseResult && phaseResult.confidence >= 0.7) {
        return { ...phaseResult, source: 'detected' };
    }
    
    // PRIORITY 4: Check project learning goals
    const projectGoalsResult = await detectFromProjectGoals(rootPath);
    if (projectGoalsResult && projectGoalsResult.confidence >= 0.6) {
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
    
    // PRIORITY 6: Profile-based detection (existing logic)
    const scores: Map<string, { score: number; reasons: string[] }> = new Map();
    
    // Initialize all personas with 0 score
    for (const persona of PERSONAS) {
        scores.set(persona.id, { score: 0, reasons: [] });
    }
    
    // Analyze user profile
    if (userProfile) {
        // Check primary technologies
        if (userProfile.primaryTechnologies) {
            for (const tech of userProfile.primaryTechnologies) {
                const techLower = tech.toLowerCase();
                for (const persona of PERSONAS) {
                    if (persona.techStack.some(t => techLower.includes(t) || t.includes(techLower))) {
                        const entry = scores.get(persona.id)!;
                        entry.score += 2;
                        entry.reasons.push(`Uses ${tech}`);
                    }
                }
            }
        }
        
        // Check learning goals
        if (userProfile.learningGoals) {
            for (const goal of userProfile.learningGoals) {
                const goalLower = goal.toLowerCase();
                for (const persona of PERSONAS) {
                    if (persona.keywords.some(k => goalLower.includes(k))) {
                        const entry = scores.get(persona.id)!;
                        entry.score += 1.5;
                        entry.reasons.push(`Learning goal: ${goal}`);
                    }
                }
            }
        }
        
        // Check expertise areas
        if (userProfile.expertiseAreas) {
            for (const area of userProfile.expertiseAreas) {
                const areaLower = area.toLowerCase();
                for (const persona of PERSONAS) {
                    if (persona.keywords.some(k => areaLower.includes(k))) {
                        const entry = scores.get(persona.id)!;
                        entry.score += 2.5;
                        entry.reasons.push(`Expert in ${area}`);
                    }
                }
            }
        }
        
        // Check current projects
        if (userProfile.currentProjects) {
            for (const project of userProfile.currentProjects) {
                const projectLower = project.toLowerCase();
                for (const persona of PERSONAS) {
                    if (persona.keywords.some(k => projectLower.includes(k))) {
                        const entry = scores.get(persona.id)!;
                        entry.score += 1;
                        entry.reasons.push(`Working on ${project}`);
                    }
                }
            }
        }
    }
    
    // Analyze workspace structure
    if (workspaceFolders && workspaceFolders.length > 0) {
        for (const folder of workspaceFolders) {
            try {
                const rootPath = folder.uri.fsPath;
                const entries = await fs.readdir(rootPath);
                
                for (const entry of entries) {
                    const entryLower = entry.toLowerCase();
                    for (const persona of PERSONAS) {
                        for (const pattern of persona.projectPatterns) {
                            const patternNormalized = pattern.replace(/\//g, '').toLowerCase();
                            if (entryLower.includes(patternNormalized) || patternNormalized.includes(entryLower)) {
                                const scoreEntry = scores.get(persona.id)!;
                                scoreEntry.score += 1;
                                if (!scoreEntry.reasons.includes(`Project has ${entry}`)) {
                                    scoreEntry.reasons.push(`Project has ${entry}`);
                                }
                            }
                        }
                    }
                }
                
                // Check for specific files
                const checkFiles = ['package.json', 'tsconfig.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'requirements.txt'];
                for (const file of checkFiles) {
                    const filePath = path.join(rootPath, file);
                    if (await fs.pathExists(filePath)) {
                        // Developer persona boost
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
        confidence: 0.5,
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
 * Get a personalized welcome message based on detected persona
 */
export function getPersonalizedHook(persona: Persona): string {
    return `${persona.icon} **${persona.hook}**\n\nAs a ${persona.name}, your Global Knowledge will help you:\n- Build reusable ${persona.bannerNoun.toLowerCase()} patterns\n- Remember solutions across projects\n- Share expertise with your team`;
}

/**
 * Get the premium features teaser based on persona
 */
export function getPremiumTeaser(persona: Persona): string {
    return `
## ⭐ Premium Features Unlocked

With Global Knowledge, you get access to:

| Feature | Benefit for ${persona.name}s |
|---------|------------------------------|
| **🔍 Search Knowledge** | Find your ${persona.bannerNoun.toLowerCase()} patterns instantly |
| **💡 Save Insights** | Capture debugging discoveries |
| **📈 Promote Patterns** | Share solutions across projects |
| **☁️ Cloud Sync** | Knowledge travels with you |
| **👥 Team Sharing** | GitHub collaboration built-in |

> *"${persona.hook}"*
`;
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
    workspaceRoot: string
): Promise<PersonaDetectionResult | null> {
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
            console.log('[Alex] Persona detected via LLM analysis');
        }
    } catch (err) {
        console.log('[Alex] LLM persona detection unavailable, using heuristics');
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
    
    // Update P6 working memory slot based on detected persona
    try {
        await updateWorkingMemoryP6(workspaceRoot, personaResult.persona.skill, personaResult.persona.name);
    } catch (err) {
        console.warn('[Alex] Failed to update P6 working memory:', err);
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
        
        for (const entry of entries.slice(0, 50)) { // Limit to 50 entries
            if (entry.startsWith('.') && entry !== '.github') {continue;}
            
            const entryPath = path.join(workspaceRoot, entry);
            const stat = await fs.stat(entryPath);
            
            if (stat.isDirectory()) {
                tree.push(`${entry}/`);
                try {
                    const subEntries = await fs.readdir(entryPath);
                    for (const sub of subEntries.slice(0, 10)) { // Limit subdirs
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
    // Get available models
    const models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
    if (!models || models.length === 0) {
        // Try any available model
        const allModels = await vscode.lm.selectChatModels();
        if (!allModels || allModels.length === 0) {
            return null;
        }
        models.push(allModels[0]);
    }
    
    const model = models[0];
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
- code-quality: For software developers
- creative-writing: For fiction writers, content creators
- research-project-scaffold: For researchers, academics
- api-documentation: For technical writers
- microsoft-fabric: For data engineers
- gamma-presentations: For presenters, speakers
- project-management: For project managers
- infrastructure-as-code: For DevOps engineers
- architecture-health: For enterprise architects

## Response Format (JSON only)
\`\`\`json
{
  "personaId": "developer|fiction-writer|researcher|technical-writer|data-engineer|presenter|project-manager|devops|architect|student|content-creator|academic",
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
            skill: parsed.skill || 'code-quality',
            icon: '🎯',
            accentColor: '#0078D4',  // Default to Azure Blue
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
 * Update the P6 working memory slot in copilot-instructions.md
 * P6 is the session-specific skill slot that should match the detected persona
 */
export async function updateWorkingMemoryP6(
    workspaceRoot: string,
    skillId: string,
    personaName: string
): Promise<boolean> {
    const instructionsPath = path.join(workspaceRoot, '.github', 'copilot-instructions.md');
    
    if (!(await fs.pathExists(instructionsPath))) {
        return false;
    }
    
    try {
        let content = await fs.readFile(instructionsPath, 'utf-8');
        
        // Find and update P6 row in the Working Memory table
        // Pattern: | **P6** | some-skill-name | Domain | Description |
        const p6Pattern = /(\| \*\*P6\*\* \|)\s*[^\|]+\s*(\| Domain \|)\s*[^\|]+\s*\|/;
        
        if (p6Pattern.test(content)) {
            const skillDescription = getSkillDescription(skillId);
            content = content.replace(
                p6Pattern,
                `$1 ${skillId} $2 ${skillDescription} (${personaName}) |`
            );
            
            await fs.writeFile(instructionsPath, content, 'utf-8');
            console.log(`[Alex] Updated P6 to: ${skillId} for ${personaName}`);
            return true;
        }
        
        return false;
    } catch (err) {
        console.warn('[Alex] Failed to update P6:', err);
        return false;
    }
}

/**
 * Get a brief description for a skill ID
 */
function getSkillDescription(skillId: string): string {
    const descriptions: Record<string, string> = {
        'code-quality': 'Code review, testing, best practices',
        'creative-writing': 'Fiction, narrative, story structure',
        'research-project-scaffold': 'Research methodology, literature review',
        'api-documentation': 'Technical docs, API reference',
        'microsoft-fabric': 'Data pipelines, medallion architecture',
        'gamma-presentations': 'Slides, presentations, decks',
        'project-management': 'Planning, sprints, roadmaps',
        'infrastructure-as-code': 'Terraform, CI/CD, deployment',
        'architecture-health': 'System design, ADRs',
        'learning-psychology': 'Study techniques, concept mastery',
        'git-workflow': 'Version control, branching',
        'brand-asset-management': 'Logos, banners, visual identity'
    };
    
    return descriptions[skillId] || `${skillId} domain expertise`;
}
