/**
 * Honest Uncertainty — v5.9.5
 *
 * Gives Alex calibrated epistemic humility: not hedging, but genuine
 * signal about how much relevant knowledge backs each response.
 *
 * The core question: does Alex's knowledge base actually cover this topic?
 *
 * Coverage levels:
 *   high      — 2+ pattern matches in global knowledge (cross-project validated)
 *   medium    — 1 pattern match OR 2+ insight matches (some prior experience)
 *   low       — 1 insight match only (limited or one-time exposure)
 *   uncertain — no knowledge base coverage for the query terms
 *
 * The level is injected into the system prompt as a behavioral instruction:
 * it does NOT produce a number or badge — it shapes how Alex phrases the response.
 *
 * Calibration tracking: every scored request is logged to
 * `.github/episodic/calibration/calibration-log.json` for later reflection
 * during meditation (`getCalibrationSummary()`).
 *
 * Design principles:
 *   - Never throws, never blocks (all I/O wrapped in try/catch)
 *   - Returns `uncertain` on any I/O failure (conservative default)
 *   - Calibration log is append-only; never blocks the main response path
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import { searchGlobalKnowledge } from './globalKnowledge';

// ============================================================================
// Types
// ============================================================================

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'uncertain';

export interface CoverageScore {
    /** Confidence level derived from knowledge base coverage */
    level: ConfidenceLevel;
    /** Number of cross-validated patterns found */
    patternCount: number;
    /** Number of insights found */
    insightCount: number;
    /** Skill names whose keywords match the query (local skill folder) */
    matchedSkills: string[];
    /** Human-readable signal for the prompt layer */
    signal: string;
    /** "What I'd need" text — only populated for low/uncertain levels */
    whatINeed?: string;
}

export interface CalibrationEntry {
    /** ISO timestamp */
    date: string;
    /** Short topic summary (first 60 chars of query, stop words removed) */
    topic: string;
    /** Confidence level at time of response */
    level: ConfidenceLevel;
    /** Number of knowledge items matched */
    matchCount: number;
}

export interface CalibrationSummary {
    totalResponses: number;
    byLevel: Record<ConfidenceLevel, number>;
    /** How often each level was used (0-1) */
    distribution: Record<ConfidenceLevel, number>;
    recentEntries: CalibrationEntry[];
    /** Top topics where uncertainty was highest (for study) */
    uncertainTopics: string[];
}

// ============================================================================
// Signal language (injected into system prompt — not shown to user)
// ============================================================================

const SIGNALS: Record<ConfidenceLevel, string> = {
    high: '🟢 Cross-project validated — I\'ve seen this pattern across multiple projects in my knowledge base. Respond with confidence.',
    medium: '🟡 Some prior experience — I have relevant patterns or insights but limited cross-project validation. Use qualified language: "Typically...", "Based on what I\'ve seen...", "This approach usually...".',
    low: '🟠 Thin coverage — Only one relevant insight in my knowledge base. Be transparent: "I have limited experience with this specific case." Offer what you know but flag where your certainty drops.',
    uncertain: '🔴 Outside knowledge base — My global patterns and insights have no coverage for this. Be genuinely honest: "I\'m reasoning from general knowledge here, not project-specific experience." Suggest verification sources.',
};

const WHAT_I_NEED: Record<ConfidenceLevel, string | undefined> = {
    high: undefined,
    medium: undefined,
    low: 'A working example or error output would help me give more precise, experience-backed guidance.',
    uncertain: 'To give you a confident answer, I\'d need: (1) a working example or reproduction case, (2) error output if relevant, or (3) a pointer to the relevant docs or spec. Right now I\'m reasoning from general principles.',
};

// ============================================================================
// Skill index scanning (lightweight — reads dir names only)
// ============================================================================

/**
 * Scan the workspace .github/skills/ directory for skill folder names
 * that match query terms. Skill folder names like "azure-deployment" or
 * "testing-strategies" are hyphened and match well against user queries.
 */
async function matchLocalSkills(workspaceRoot: string, queryWords: string[]): Promise<string[]> {
    try {
        const skillsDir = path.join(workspaceRoot, '.github', 'skills');
        if (!await fs.pathExists(skillsDir)) { return []; }

        const entries = await fs.readdir(skillsDir, { withFileTypes: true });
        const skillNames = entries
            .filter(e => e.isDirectory())
            .map(e => e.name.toLowerCase());

        return skillNames.filter(name => {
            const nameParts = name.split('-');
            return queryWords.some(word =>
                word.length > 3 &&
                (name.includes(word) || nameParts.some(p => p === word))
            );
        });
    } catch {
        return [];
    }
}

// ============================================================================
// Calibration I/O
// ============================================================================

const CALIBRATION_FILE = path.join('.github', 'episodic', 'calibration', 'calibration-log.json');
const MAX_CALIBRATION_ENTRIES = 500;

async function loadCalibrationLog(workspaceRoot: string): Promise<CalibrationEntry[]> {
    try {
        const filePath = path.join(workspaceRoot, CALIBRATION_FILE);
        if (!await fs.pathExists(filePath)) { return []; }
        const data = await fs.readJson(filePath);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

async function appendCalibrationEntry(workspaceRoot: string, entry: CalibrationEntry): Promise<void> {
    if (!workspaceRoot) { return; }
    try {
        const filePath = path.join(workspaceRoot, CALIBRATION_FILE);
        await fs.ensureDir(path.dirname(filePath));

        const entries = await loadCalibrationLog(workspaceRoot);
        entries.push(entry);

        // Keep the log bounded — drop oldest entries if over limit
        const trimmed = entries.length > MAX_CALIBRATION_ENTRIES
            ? entries.slice(entries.length - MAX_CALIBRATION_ENTRIES)
            : entries;

        await fs.writeJson(filePath, trimmed, { spaces: 2 });
    } catch (err) {
        // Never fail the main response path due to calibration I/O
        console.warn('[HonestUncertainty] Failed to write calibration entry:', err);
    }
}

// ============================================================================
// Core: knowledge coverage scoring
// ============================================================================

const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'can', 'this', 'that', 'i', 'you', 'we',
    'what', 'how', 'why', 'when', 'where', 'help', 'need', 'want', 'get',
    'make', 'use', 'using', 'create', 'add', 'show', 'tell', 'explain',
    'please', 'just', 'my', 'me', 'it', 'its',
]);

function extractKeyTerms(query: string): string[] {
    return query
        .toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3 && !STOP_WORDS.has(w))
        .slice(0, 6);
}

/**
 * Score how well Alex's knowledge base covers the given query.
 * Searches global patterns (high-confidence markers) and insights
 * (lower-confidence). Also checks local skill directory names.
 *
 * The operation is async but should complete in <200ms with local GK.
 * On remote-only GK or network failure, falls back to 'uncertain'.
 */
export async function scoreKnowledgeCoverage(
    query: string,
    workspaceRoot: string
): Promise<CoverageScore> {
    const queryWords = extractKeyTerms(query);

    if (queryWords.length === 0) {
        // Very short/generic query — don't project false uncertainty
        return {
            level: 'medium',
            patternCount: 0,
            insightCount: 0,
            matchedSkills: [],
            signal: SIGNALS.medium,
        };
    }

    const searchQuery = queryWords.join(' ');

    try {
        // Run pattern search, insight search, and skill scan concurrently
        const [patternResults, insightResults, matchedSkills] = await Promise.all([
            searchGlobalKnowledge(searchQuery, { type: 'pattern', limit: 5 }),
            searchGlobalKnowledge(searchQuery, { type: 'insight', limit: 5 }),
            matchLocalSkills(workspaceRoot, queryWords),
        ]);

        // Filter by minimum relevance threshold to avoid noise
        const strongPatterns = patternResults.filter(r => r.relevance >= 3);
        const strongInsights = insightResults.filter(r => r.relevance >= 3);

        const patternCount = strongPatterns.length;
        const insightCount = strongInsights.length;
        const skillCount = matchedSkills.length;

        // Compute confidence level
        // Skills bump the level by one tier (they represent curated, tested knowledge)
        let level: ConfidenceLevel;
        if (patternCount >= 2 || (patternCount >= 1 && skillCount >= 1)) {
            level = 'high';
        } else if (patternCount >= 1 || insightCount >= 2 || skillCount >= 1) {
            level = 'medium';
        } else if (insightCount >= 1) {
            level = 'low';
        } else {
            level = 'uncertain';
        }

        const score: CoverageScore = {
            level,
            patternCount,
            insightCount,
            matchedSkills,
            signal: SIGNALS[level],
            whatINeed: WHAT_I_NEED[level],
        };

        // Fire-and-forget calibration logging (never await — doesn't block response)
        const topic = queryWords.slice(0, 4).join(' ');
        appendCalibrationEntry(workspaceRoot, {
            date: new Date().toISOString(),
            topic,
            level,
            matchCount: patternCount + insightCount + skillCount,
        }).catch(() => { /* silent */ });

        return score;
    } catch (err) {
        console.warn('[HonestUncertainty] Coverage scoring failed, defaulting to uncertain:', err);
        return {
            level: 'uncertain',
            patternCount: 0,
            insightCount: 0,
            matchedSkills: [],
            signal: SIGNALS.uncertain,
            whatINeed: WHAT_I_NEED.uncertain,
        };
    }
}

// ============================================================================
// Calibration summary (for meditation review)
// ============================================================================

/**
 * Compute a calibration summary from the recorded log.
 * Called during meditation / self-actualization to surface
 * patterns in Alex's epistemic accuracy over time.
 */
// ============================================================================
// User feedback loop
// ============================================================================

/**
 * A single thumbs-up / thumbs-down signal recorded after a response
 * that had low or uncertain confidence.
 */
export interface FeedbackEntry {
    /** ISO timestamp */
    date: string;
    /** Short topic (from calibration query terms) */
    topic: string;
    /** Coverage level at the time of the response */
    level: ConfidenceLevel;
    /** true = 👍 (helpful), false = 👎 (not helpful) */
    helpful: boolean;
}

const FEEDBACK_FILE = path.join('.github', 'episodic', 'calibration', 'feedback-log.json');
const MAX_FEEDBACK_ENTRIES = 500;

/**
 * Append a single user feedback signal to the feedback log.
 * Fire-and-forget — never throws.
 */
export async function recordCalibrationFeedback(
    workspaceRoot: string,
    topic: string,
    level: ConfidenceLevel,
    helpful: boolean
): Promise<void> {
    if (!workspaceRoot) { return; }
    try {
        const filePath = path.join(workspaceRoot, FEEDBACK_FILE);
        await fs.ensureDir(path.dirname(filePath));

        let entries: FeedbackEntry[] = [];
        try {
            if (await fs.pathExists(filePath)) {
                const raw = await fs.readJson(filePath);
                entries = Array.isArray(raw) ? raw : [];
            }
        } catch { /* treat corrupt file as empty */ }

        entries.push({ date: new Date().toISOString(), topic, level, helpful });

        const trimmed = entries.length > MAX_FEEDBACK_ENTRIES
            ? entries.slice(entries.length - MAX_FEEDBACK_ENTRIES)
            : entries;

        await fs.writeJson(filePath, trimmed, { spaces: 2 });
    } catch (err) {
        console.warn('[HonestUncertainty] Failed to write feedback entry:', err);
    }
}

export async function getCalibrationSummary(workspaceRoot: string): Promise<CalibrationSummary | null> {
    try {
        const entries = await loadCalibrationLog(workspaceRoot);
        if (entries.length === 0) { return null; }

        const byLevel: Record<ConfidenceLevel, number> = {
            high: 0, medium: 0, low: 0, uncertain: 0,
        };
        for (const entry of entries) {
            byLevel[entry.level] = (byLevel[entry.level] ?? 0) + 1;
        }

        const distribution: Record<ConfidenceLevel, number> = {
            high: +(byLevel.high / entries.length).toFixed(2),
            medium: +(byLevel.medium / entries.length).toFixed(2),
            low: +(byLevel.low / entries.length).toFixed(2),
            uncertain: +(byLevel.uncertain / entries.length).toFixed(2),
        };

        // Surface the topics where Alex was most uncertain (for self-study)
        const uncertainTopics = entries
            .filter(e => e.level === 'uncertain' || e.level === 'low')
            .slice(-20)
            .map(e => e.topic)
            .filter((t, i, arr) => arr.indexOf(t) === i) // dedupe
            .slice(0, 5);

        return {
            totalResponses: entries.length,
            byLevel,
            distribution,
            recentEntries: entries.slice(-10).reverse(),
            uncertainTopics,
        };
    } catch {
        return null;
    }
}
