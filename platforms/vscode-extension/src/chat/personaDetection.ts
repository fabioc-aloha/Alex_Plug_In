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
 * 5. Copilot Instructions - Persona: field from Active Context in copilot-instructions.md
 * 6. Profile - User profile credentials/expertise
 * 7. Workspace Scoring - File structure heuristic
 * 8. Developer - Default fallback
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import * as os from 'os';
import * as workspaceFs from '../shared/workspaceFs';

// ============================================================================
// CONFIDENCE THRESHOLDS & LIMITS
// ============================================================================

/** Confidence threshold for Focus session detection (P1) */
const CONFIDENCE_FOCUS = 0.95;
// const CONFIDENCE_FOCUS_TECH = 0.9; // reserved for future focus tech matching
/** Confidence threshold for Session goal detection (P2) */
const CONFIDENCE_GOAL = 0.85;
/** Confidence threshold for Project phase detection (P3) */
const CONFIDENCE_PHASE = 0.75;
/** Confidence threshold for Learning goals detection (P4) */
const CONFIDENCE_LEARNING_GOALS = 0.7;
/** Confidence threshold for copilot-instructions.md Persona: field (P5) */
const CONFIDENCE_COPILOT_PERSONA = 0.85;
/** Minimum threshold to use priority chain result */
const THRESHOLD_PRIORITY_1 = 0.8;
const THRESHOLD_PRIORITY_2 = 0.7;
const THRESHOLD_PRIORITY_3 = 0.7;
const THRESHOLD_PRIORITY_4 = 0.6;
const THRESHOLD_PRIORITY_5 = 0.7;
/** Default confidence for fallback detection */
const CONFIDENCE_FALLBACK = 0.5;

// Reserved for future filesystem heuristics (currently unused)
// const MAX_DIR_ENTRIES = 50;
// const MAX_SUBDIR_ENTRIES = 10;


// ============================================================================
// PERSONA DEFINITIONS (extracted to personaDefinitions.ts)
// ============================================================================
import {
    PersonaSignal,
    Persona,
    PERSONAS,
} from './personaDefinitions';

// Re-export for backward compatibility - all consumers import from this file
export {
    PersonaSignal,
    Persona,
    PERSONAS,
    getEasterEggOverride,
    EasterEgg,
    LLMPersona,
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
            { pattern: /data pipeline|etl|data migration|lakehouse|medallion/i,              personaId: 'data-engineer' },
            { pattern: /game design|level design|game jam|game prototype|playtest/i,         personaId: 'game-developer' },
            { pattern: /learning phase|study|exam prep|course.?work|tutorial/i,              personaId: 'student' },
            { pattern: /content phase|blog writing|content calendar|editorial/i,             personaId: 'content-creator' },
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
 * PRIORITY 5: Detect persona from copilot-instructions.md Active Context
 * Reads the Persona: field from the project's copilot-instructions.md.
 * This is an explicit project-level declaration that overrides heuristic scoring.
 */
async function detectFromCopilotInstructions(rootPath?: string): Promise<Omit<PersonaDetectionResult, 'source'> | null> {
    if (!rootPath) { return null; }

    try {
        const instructionsPath = path.join(rootPath, '.github', 'copilot-instructions.md');
        if (!await workspaceFs.pathExists(instructionsPath)) {
            return null;
        }

        const content = await workspaceFs.readFile(instructionsPath);
        // Match "Persona: <value>" in the Active Context section
        const personaMatch = content.match(/^Persona:\s*(.+)$/m);
        if (!personaMatch) {
            return null;
        }

        const declaredPersona = personaMatch[1].trim().toLowerCase();
        if (!declaredPersona || declaredPersona.startsWith('_') || declaredPersona.startsWith('(')) {
            // Skip placeholder values like "_(session-objective)_"
            return null;
        }

        const matchedPersona = PERSONAS.find(p => p.id === declaredPersona || p.name.toLowerCase() === declaredPersona);
        if (matchedPersona) {
            return {
                persona: matchedPersona,
                confidence: CONFIDENCE_COPILOT_PERSONA,
                reasons: [`Persona declared in copilot-instructions.md: "${personaMatch[1].trim()}"`]
            };
        }
    } catch {
        // Ignore — not all projects have copilot-instructions.md
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
        // Tie-breaking: on equal scores, prefer the persona with more distinct signal matches (specificity)
        if (entry.score > bestScore || (entry.score === bestScore && entry.reasons.length > bestReasons.length)) {
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
 * 5. Copilot Instructions - Persona: field from Active Context
 * 6. Profile - Cached projectPersona from user-profile.json
 * 7. Workspace Scoring - File structure heuristic
 * 8. Developer - Default fallback (lowest priority)
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
    
    // PRIORITY 5: Check copilot-instructions.md Persona: field
    const copilotResult = await detectFromCopilotInstructions(rootPath);
    if (copilotResult && copilotResult.confidence >= THRESHOLD_PRIORITY_5) {
        return { ...copilotResult, source: 'detected' };
    }
    
    // PRIORITY 6: Use saved projectPersona if available and recent (within 1 day)
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
        if (ageInDays < 1) {
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
    
    // PRIORITY 7: Signal-based scoring across all evidence sources
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


// Re-export project-level detection functions (extracted to personaProjectDetection.ts)
export { detectProjectTechnologies, detectAndUpdateProjectPersona, updateWorkingMemorySlots } from './personaProjectDetection';
