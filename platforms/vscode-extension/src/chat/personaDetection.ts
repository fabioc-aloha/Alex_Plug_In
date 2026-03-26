/**
 * Persona Detection Module
 * 
 * Identifies user personas from their profile and project context.
 * Uses semantic signal rules for flexible, weighted detection.
 * 
 * v5.0.0 Feature: Know Your Customer
 * v5.6.9 Feature: Semantic rules replace flat keyword lists
 * v6.8.1 Feature: Simplified 3-tier detection (explicit → cached → scored)
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
 * 1. Explicit - Persona: field from copilot-instructions.md Active Context
 * 2. Cached - Recent projectPersona from user-profile.json (<1 day)
 * 3. Workspace Scoring - Unified heuristic (profile + structure + deps + content + roadmap)
 * 4. Developer - Default fallback
 */

import * as path from 'path';
import * as vscode from 'vscode';
import * as workspaceFs from '../shared/workspaceFs';

// ============================================================================
// CONFIDENCE THRESHOLDS & LIMITS
// ============================================================================

/** Confidence for copilot-instructions.md Persona: field (explicit declaration) */
const CONFIDENCE_COPILOT_PERSONA = 0.9;
/** Default confidence for fallback detection */
const CONFIDENCE_FALLBACK = 0.5;


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

// ============================================================================
// EXPLICIT DECLARATION DETECTION
// ============================================================================

/**
 * P1: Detect persona from copilot-instructions.md Active Context.
 * Reads the Persona: field — this is an explicit declaration that outranks all heuristics.
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

        // Strip confidence suffix like "Developer (85% confidence)" → "developer"
        const raw = personaMatch[1].trim();
        const declaredPersona = raw.replace(/\s*\(\d+%\s*confidence\)/i, '').toLowerCase();
        if (!declaredPersona || declaredPersona.startsWith('_') || declaredPersona.startsWith('(')) {
            return null;
        }

        const matchedPersona = PERSONAS.find(p => p.id === declaredPersona || p.name.toLowerCase() === declaredPersona);
        if (matchedPersona) {
            return {
                persona: matchedPersona,
                confidence: CONFIDENCE_COPILOT_PERSONA,
                reasons: [`Persona declared in copilot-instructions.md: "${raw}"`]
            };
        }
    } catch {
        // Ignore — not all projects have copilot-instructions.md
    }
    return null;
}

// ============================================================================
// ROADMAP PHASE SCORING (folded into workspace scoring)
// ============================================================================

/** Phase semantic rules: regex pattern → persona ID boost */
const ROADMAP_PHASE_RULES: Array<{ pattern: RegExp; personaId: string }> = [
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

/**
 * Score roadmap phase signals against ROADMAP.md content.
 * Folded into workspace scoring as a supplementary signal (not a separate priority).
 */
async function scoreRoadmapPhaseSignals(
    wsRoot: string,
    scores: Map<string, PersonaScoreEntry>
): Promise<void> {
    const roadmapPaths = [
        path.join(wsRoot, 'ROADMAP.md'),
        path.join(wsRoot, 'ROADMAP-UNIFIED.md'),
        path.join(wsRoot, '.github', 'ROADMAP.md'),
    ];

    for (const roadmapPath of roadmapPaths) {
        try {
            if (!await workspaceFs.pathExists(roadmapPath)) { continue; }
            const content = await workspaceFs.readFile(roadmapPath);

            for (const { pattern, personaId } of ROADMAP_PHASE_RULES) {
                if (pattern.test(content)) {
                    const entry = scores.get(personaId);
                    if (entry) {
                        entry.score += 2; // strong signal
                        const reason = 'Project roadmap phase';
                        if (!entry.reasons.includes(reason)) { entry.reasons.push(reason); }
                    }
                }
            }
            break; // only read the first roadmap found
        } catch { /* skip */ }
    }
}

/**
 * User profile structure (subset relevant for persona detection)
 */
interface UserProfile {
    name?: string;
    nickname?: string;
    birthday?: string;  // ISO date string for age-based avatar fallback
    role?: string;      // e.g. "Director of Advanced Analytics"
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
    
    if (userProfile.role && typeof userProfile.role === 'string') {
        profileTexts.push({ text: userProfile.role, label: `Role: ${userProfile.role}` });
    }
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
 * Detect the most likely persona based on a 4-tier priority chain.
 * 
 * PRIORITY CHAIN:
 * 1. Explicit    - Persona: field from copilot-instructions.md Active Context
 * 2. Cached      - Recent projectPersona from user-profile.json (<1 day old)
 * 3. Scored      - Unified heuristic: profile + structure + deps + content + roadmap phase
 * 4. User Profile - Role/expertise from user-profile.json (weaker than workspace signals)
 * 5. Fallback    - Developer (always)
 * 
 * @param userProfile - User profile from user-profile.json
 * @param workspaceFolders - Current workspace folders
 * @returns Detected persona with confidence score
 */
export async function detectPersona(
    userProfile?: UserProfile,
    workspaceFolders?: readonly vscode.WorkspaceFolder[]
): Promise<PersonaDetectionResult | null> {
    const rootPath = workspaceFolders?.[0]?.uri.fsPath;
    
    // P1: Explicit declaration in copilot-instructions.md (highest authority)
    const explicitResult = await detectFromCopilotInstructions(rootPath);
    if (explicitResult) {
        return { ...explicitResult, source: 'detected' };
    }
    
    // P2: Cached projectPersona from user-profile.json (valid <1 day)
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
    
    // P3: Unified workspace scoring (all heuristic signals in one pass)
    const scores = new Map<string, PersonaScoreEntry>();
    for (const persona of PERSONAS) {
        scores.set(persona.id, { score: 0, reasons: [] });
    }
    
    // Score profile evidence (identity + technology signals)
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
                await scoreRoadmapPhaseSignals(wsRoot, scores);
            } catch { /* Ignore errors reading directory */ }
        }
    }
    
    // Select best persona from scores
    const result = selectBestPersona(scores);
    if (result) { return result; }
    
    // P4: User profile role/expertise fallback (weaker than workspace signals)
    if (userProfile?.role) {
        const roleLower = userProfile.role.toLowerCase();
        for (const persona of PERSONAS) {
            for (const signal of persona.signals) {
                if (signal.category !== 'identity') { continue; }
                try {
                    if (new RegExp(signal.pattern, 'i').test(roleLower)) {
                        return {
                            persona,
                            confidence: 0.6,
                            reasons: [`User profile role: "${userProfile.role}"`],
                            source: 'detected'
                        };
                    }
                } catch { /* skip */ }
            }
        }
    }
    
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
