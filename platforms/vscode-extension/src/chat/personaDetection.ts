/**
 * Persona Detection Module
 * 
 * Identifies user personas from their profile and project context.
 * Based on marketing personas defined in alex_docs/marketing/MARKETING-PLAN.md
 * 
 * v5.0.0 Feature: Know Your Customer
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

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
    keywords: string[];
    techStack: string[];
    projectPatterns: string[];
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
        keywords: ['fiction', 'novel', 'screenplay', 'story', 'author', 'creative'],
        techStack: ['markdown', 'scrivener', 'fountain'],
        projectPatterns: ['chapters/', 'manuscript/', 'outline/', 'characters/', '.fountain']
    },
    {
        id: 'project-manager',
        name: 'Project Manager',
        bannerNoun: 'PROJECTS',
        hook: '4-6× faster than human estimates',
        skill: 'project-management',
        icon: '📋',
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
        keywords: ['power user', 'builder', 'maker', 'hacker', 'tinkerer', 'contributor'],
        techStack: ['typescript', 'python', 'bash', 'powershell', 'git'],
        projectPatterns: ['skills/', '.github/', 'extensions/', 'plugins/']
    }
];

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
}

/**
 * Detect the most likely persona based on user profile and project context.
 * 
 * @param userProfile - User profile from user-profile.json
 * @param workspaceFolders - Current workspace folders
 * @returns Detected persona with confidence score, or null if insufficient data
 */
export async function detectPersona(
    userProfile?: UserProfile,
    workspaceFolders?: readonly vscode.WorkspaceFolder[]
): Promise<PersonaDetectionResult | null> {
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
    
    // Require minimum confidence
    if (!bestPersona || bestScore < 1) {
        return null;
    }
    
    // Normalize confidence to 0-1 range (max reasonable score ~10)
    const confidence = Math.min(bestScore / 10, 1);
    
    return {
        persona: bestPersona,
        confidence,
        reasons: bestReasons.slice(0, 5) // Top 5 reasons
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
