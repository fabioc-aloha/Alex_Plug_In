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
import * as workspaceFs from '../shared/workspaceFs';
import { assertBounded, assertDefined, assertNonEmpty } from '../shared/assertions';

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


// ============================================================================
// PERSONA DEFINITIONS (extracted to personaDefinitions.ts)
// ============================================================================
import {
    PersonaSignal,
    Persona,
    LLMPersona,
    PERSONA_AVATAR_MAP,
    DEFAULT_AVATAR,
    getAvatarForPersona,
    EasterEgg,
    getEasterEggOverride,
    PERSONAS,
} from './personaDefinitions';

// Re-export for backward compatibility - all consumers import from this file
export {
    PersonaSignal,
    Persona,
    LLMPersona,
    PERSONA_AVATAR_MAP,
    DEFAULT_AVATAR,
    getAvatarForPersona,
    EasterEgg,
    getEasterEggOverride,
    PERSONAS,
} from './personaDefinitions';

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
        if (!await workspaceFs.pathExists(goalsPath)) {
            return null;
        }
        
        const goalsData = await workspaceFs.readJson(goalsPath) as { goals?: Array<{ completedAt?: string; title?: string; description?: string; tags?: string[] }> };
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
            if (await workspaceFs.pathExists(roadmapPath)) {
                const content = await workspaceFs.readFile(roadmapPath);
                
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
        if (!await workspaceFs.pathExists(profilePath)) {
            return null;
        }
        
        const profile = await workspaceFs.readJson(profilePath) as { learningGoals?: string[] };
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

/** Internal scoring entry for persona detection */
interface PersonaScoreEntry {
    score: number;
    reasons: string[];
}

/** Profile text evidence for signal matching */
interface ProfileEvidence {
    text: string;
    label: string;
}

// ============================================================================
// SIGNAL SCORING HELPERS (NASA R4 extraction)
// ============================================================================

/**
 * Score identity and technology signals against profile texts
 * @param profileTexts - Collected evidence from user profile
 * @param scores - Mutable score map to update
 */
function scoreProfileSignals(
    profileTexts: ProfileEvidence[],
    scores: Map<string, PersonaScoreEntry>
): void {
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
}

/**
 * Score structure signals against workspace directory
 * @param wsRoot - Workspace root path
 * @param entries - Directory entry names
 * @param scores - Mutable score map to update
 */
async function scoreStructureSignals(
    wsRoot: string,
    entries: string[],
    scores: Map<string, PersonaScoreEntry>
): Promise<void> {
    const entriesLowerSet = new Set(entries.map(e => e.toLowerCase()));
    
    for (const persona of PERSONAS) {
        for (const signal of persona.signals) {
            if (signal.category !== 'structure') { continue; }
            const structureTokens = signal.pattern.split('|').map(t => t.trim()).filter(Boolean);
            for (const token of structureTokens) {
                let matched = false;
                let displayName = token;
                
                if (token.includes('/')) {
                    const cleanPath = token.replace(/\/+$/, '');
                    matched = await workspaceFs.pathExists(path.join(wsRoot, cleanPath));
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
    
    // Developer baseline boost for common dev files
    const devFiles = ['package.json', 'tsconfig.json', 'pyproject.toml', 'Cargo.toml', 'go.mod', 'requirements.txt'];
    for (const file of devFiles) {
        if (entriesLowerSet.has(file.toLowerCase())) {
            const devEntry = scores.get('developer')!;
            devEntry.score += 0.5;
        }
    }
}

/**
 * Score dependency signals against package.json
 * @param wsRoot - Workspace root path
 * @param scores - Mutable score map to update
 */
async function scoreDependencySignals(
    wsRoot: string,
    scores: Map<string, PersonaScoreEntry>
): Promise<void> {
    const packageJsonPath = path.join(wsRoot, 'package.json');
    if (!await workspaceFs.pathExists(packageJsonPath)) { return; }
    
    try {
        const pkg = await workspaceFs.readJson(packageJsonPath) as { 
            dependencies?: Record<string, string>; 
            devDependencies?: Record<string, string> 
        };
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

/**
 * Score content signals against README and package.json description
 * @param wsRoot - Workspace root path
 * @param scores - Mutable score map to update
 */
async function scoreContentSignals(
    wsRoot: string,
    scores: Map<string, PersonaScoreEntry>
): Promise<void> {
    const contentFiles = [
        path.join(wsRoot, 'README.md'),
        path.join(wsRoot, 'package.json'),
    ];
    let contentText = '';
    for (const cf of contentFiles) {
        try {
            if (await workspaceFs.pathExists(cf)) {
                const raw = await workspaceFs.readFile(cf);
                contentText += ' ' + raw.slice(0, 2000); // cap to prevent perf issues
            }
        } catch { /* skip */ }
    }
    if (!contentText) { return; }
    
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

/**
 * Select the best persona from accumulated scores
 * @param scores - Accumulated scores from all signal sources
 * @returns Best persona result or null
 */
function selectBestPersona(scores: Map<string, PersonaScoreEntry>): PersonaDetectionResult | null {
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
    
    if (bestPersona && bestScore >= 1) {
        const confidence = Math.min(bestScore / 10, 1);
        return {
            persona: bestPersona,
            confidence,
            reasons: bestReasons.slice(0, 5),
            source: 'detected'
        };
    }
    return null;
}

/**
 * Collect evidence texts from user profile for signal matching
 * @param userProfile - User profile data
 * @returns Array of text/label pairs for matching
 */
function collectProfileEvidence(userProfile?: UserProfile): ProfileEvidence[] {
    const profileTexts: ProfileEvidence[] = [];
    if (!userProfile) { return profileTexts; }
    
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
    return profileTexts;
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
        let ageInDays = 0;
        if (savedPersona.detectedAt) {
            const detectedAt = new Date(savedPersona.detectedAt);
            if (!isNaN(detectedAt.getTime())) {
                ageInDays = (Date.now() - detectedAt.getTime()) / (1000 * 60 * 60 * 24);
            }
        }
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
    const scores = new Map<string, PersonaScoreEntry>();
    for (const persona of PERSONAS) {
        scores.set(persona.id, { score: 0, reasons: [] });
    }
    
    // Collect and score profile evidence (NASA R4 compliance)
    const profileTexts = collectProfileEvidence(userProfile);
    scoreProfileSignals(profileTexts, scores);
    
    if (workspaceFolders && workspaceFolders.length > 0) {
        for (const folder of workspaceFolders) {
            try {
                const wsRoot = folder.uri.fsPath;
                const dirEntries = await workspaceFs.readDirectory(wsRoot);
                const entries = dirEntries.map(([name]) => name);
                
                await scoreStructureSignals(wsRoot, entries, scores);
                await scoreDependencySignals(wsRoot, scores);
                await scoreContentSignals(wsRoot, scores);
            } catch { /* Ignore errors reading directory */ }
        }
    }
    
    // Select best persona from scores
    const result = selectBestPersona(scores);
    if (result) { return result; }
    
    // FALLBACK: Default to Developer
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
            if (await workspaceFs.pathExists(profilePath)) {
                return await workspaceFs.readJson(profilePath) as UserProfile;
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
        const dirEntries = await workspaceFs.readDirectory(workspaceRoot);
        const entries = dirEntries.map(([name, _]) => name);
        
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
                    if (entries.includes(dir)) {
                        const statResult = await workspaceFs.stat(path.join(workspaceRoot, dir));
                        if (statResult && statResult.type === vscode.FileType.Directory) {
                            if (!detected.includes(tech)) {detected.push(tech);}
                        }
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
        if (await workspaceFs.pathExists(packageJsonPath)) {
            try {
                const pkg = await workspaceFs.readJson(packageJsonPath) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
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
 * NASA R5: Runtime assertions for input validation
 * 
 * @param workspaceRoot - Path to the workspace root
 * @returns The detected persona result, or null if detection failed
 */
export async function detectAndUpdateProjectPersona(
    workspaceRoot: string,
    options?: { updateSlots?: boolean }
): Promise<PersonaDetectionResult | null> {
    // NASA R5: Validate required input
    assertDefined(workspaceRoot, 'workspaceRoot is required for persona detection');
    assertNonEmpty(workspaceRoot, 'workspaceRoot');
    
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
        if (await workspaceFs.pathExists(profilePath)) {
            const currentProfile = await workspaceFs.readJson(profilePath) as ExtendedUserProfile;
            
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
            
            await workspaceFs.writeJson(profilePath, updatedProfile);
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
            accentColor: '#0078D4',  // Developer blue — intentional per DK §13
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
