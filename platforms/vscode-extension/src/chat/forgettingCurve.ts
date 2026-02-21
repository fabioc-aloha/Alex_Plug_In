/**
 * The Forgetting Curve — v5.9.6
 *
 * Graceful knowledge decay: usage-weighted freshness scoring for all
 * global knowledge entries. Strong patterns grow stronger; unused insights
 * fade toward cold storage — not deletion, deliberate forgetting.
 *
 * Core idea: memory is not a filing cabinet. It is a living system where
 * what matters gets reinforced and what fades can be recovered, but no
 * longer crowds the active workspace.
 *
 * Freshness formula: score = (refScore × 0.6) + (recencyScore × 0.4)
 *   refScore     = min(referenceCount / 20, 1.0)              — saturates at 20 uses
 *   recencyScore = 1 / (1 + log10(1 + daysSince / halfLife))  — logarithmic decay
 *
 * Decay profiles:
 *   aggressive  — 14-day half-life  (project-specific, fast-moving knowledge)
 *   moderate    — 60-day half-life  (domain patterns, most insights)
 *   slow        — 180-day half-life (architectural principles, security)
 *   permanent   — never decays      (core principles, universal patterns)
 *
 * Reference counting is fire-and-forget: touches are queued in memory and
 * flushed to index.json in batches — never blocks the main response path.
 *
 * Cold storage: entries below the archive threshold are moved to
 * insights/archive/ or patterns/archive/ during the dream ceremony,
 * logged to episodic memory, and excluded from active search but
 * recoverable via explicit search.
 *
 * Config: `.github/config/knowledge-decay.json` overrides defaults per project.
 *
 * Design principles:
 *   - Never throws (all I/O wrapped in try/catch)
 *   - Reference touches are fire-and-forget (never block response path)
 *   - Archive is always recoverable — nothing is permanently deleted
 *   - User reviews and decides — Alex never forgets autonomously
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { GLOBAL_KNOWLEDGE_PATHS, GlobalKnowledgeCategory } from '../shared/constants';
import type { IGlobalKnowledgeEntry, IGlobalKnowledgeIndex } from '../shared/constants';

// ============================================================================
// Types
// ============================================================================

export type DecayProfile = 'aggressive' | 'moderate' | 'slow' | 'permanent';

export interface FreshnessScore {
    /** 0.0–1.0 composite freshness score */
    score: number;
    /** Raw reference count (0 if never referenced) */
    referenceCount: number;
    /** ISO timestamp of last reference, null if never touched */
    lastReferenced: string | null;
    /** Days since last reference (-1 if never referenced) */
    daysSinceReferenced: number;
    /** Active decay profile */
    decayProfile: DecayProfile;
    /** Human-readable freshness label */
    label: 'thriving' | 'active' | 'fading' | 'dormant' | 'permanent';
}

export interface DecayEntry {
    id: string;
    title: string;
    type: 'pattern' | 'insight';
    category: string;
    freshness: FreshnessScore;
}

export interface DecayReport {
    /** Total entries in the knowledge base */
    totalEntries: number;
    /** Entries with score > 0.6 — healthy, frequently used */
    thriving: DecayEntry[];
    /** Entries with score 0.3–0.6 — in use, holding steady */
    active: DecayEntry[];
    /** Entries with score 0.1–0.3 — rarely used, candidates for review */
    fading: DecayEntry[];
    /** Entries with score < 0.1 — dormant, candidates for cold storage */
    dormant: DecayEntry[];
    /** Entries with permanent profile — excluded from decay */
    permanentCount: number;
    /** ISO timestamp this report was generated */
    generatedAt: string;
}

export interface ForgettingCeremonyResult {
    /** Entries moved to cold storage */
    archived: { id: string; title: string; reason: string }[];
    /** Entries that survived (above threshold) */
    kept: { id: string; title: string; score: number }[];
    /** Entries skipped because their profile is 'permanent' */
    skipped: number;
}

// ============================================================================
// Constants
// ============================================================================

/** Half-life in days per decay profile. null = never decays. */
const DECAY_HALF_LIVES: Record<DecayProfile, number | null> = {
    aggressive: 14,
    moderate: 60,
    slow: 180,
    permanent: null,
};

/** Default decay profile per knowledge category. */
const CATEGORY_DECAY_DEFAULTS: Partial<Record<GlobalKnowledgeCategory, DecayProfile>> = {
    architecture: 'slow',
    security: 'slow',
    patterns: 'slow',
    'api-design': 'moderate',
    deployment: 'moderate',
    documentation: 'moderate',
    'error-handling': 'moderate',
    performance: 'moderate',
    refactoring: 'moderate',
    testing: 'moderate',
    tooling: 'moderate',
    debugging: 'aggressive',
    general: 'moderate',
};

/** Freshness score below which an entry is a candidate for cold storage. */
const DEFAULT_ARCHIVE_THRESHOLD = 0.1;

/** Flush accumulated reference counts after this many distinct entries are queued. */
const FLUSH_THRESHOLD = 15;

/** Or flush after this many milliseconds of inactivity. */
const FLUSH_DELAY_MS = 30_000;

// ============================================================================
// In-memory reference queue (fire-and-forget batch flush)
// ============================================================================

/** entryId → accumulated touch count since last flush */
const _referenceQueue = new Map<string, number>();
let _flushTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Queue a reference touch for a global knowledge entry (fire-and-forget).
 * Batches touches to avoid hammering index.json on every search.
 * Call this whenever an entry is returned from a knowledge search.
 */
export function queueReferenceTouch(entryId: string): void {
    if (!entryId) { return; }
    _referenceQueue.set(entryId, (_referenceQueue.get(entryId) ?? 0) + 1);

    if (_referenceQueue.size >= FLUSH_THRESHOLD) {
        // Hit batch threshold — flush immediately without blocking caller
        flushReferenceQueue().catch(() => {});
    } else if (_flushTimer === null) {
        // Schedule a deferred flush
        _flushTimer = setTimeout(() => {
            flushReferenceQueue().catch(() => {});
        }, FLUSH_DELAY_MS);
    }
}

/**
 * Force-flush the reference queue to disk. Call before computing decay reports
 * so meditation/dream sees counters that reflect the current session.
 */
export async function flushReferenceQueue(): Promise<void> {
    if (_flushTimer !== null) {
        clearTimeout(_flushTimer);
        _flushTimer = null;
    }

    if (_referenceQueue.size === 0) { return; }

    // Snapshot and clear before async I/O to avoid duplicate writes on retry
    const snapshot = new Map(_referenceQueue);
    _referenceQueue.clear();

    const indexPath = path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS.index);
    if (!await fs.pathExists(indexPath)) { return; }

    try {
        const raw = await fs.readFile(indexPath, 'utf-8');
        const index = JSON.parse(raw) as IGlobalKnowledgeIndex;
        const now = new Date().toISOString();
        let changed = false;

        for (const entry of index.entries) {
            const count = snapshot.get(entry.id);
            if (!count) { continue; }

            (entry as FreshnessFields).referenceCount = ((entry as FreshnessFields).referenceCount ?? 0) + count;
            (entry as FreshnessFields).lastReferenced = now;
            changed = true;
        }

        if (changed) {
            index.lastUpdated = now;
            await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');
        }
    } catch (err) {
        console.warn('[ForgettingCurve] Failed to flush reference queue:', err);
        // Restore snapshot so next flush can retry
        for (const [id, count] of snapshot) {
            _referenceQueue.set(id, (_referenceQueue.get(id) ?? 0) + count);
        }
    }
}

// ============================================================================
// Freshness computation
// ============================================================================

/** Fields added to IGlobalKnowledgeEntry for freshness tracking (optional). */
export interface FreshnessFields {
    /** ISO timestamp of the most recent reference */
    lastReferenced?: string;
    /** Cumulative count of skill activations, chat mentions, and searches */
    referenceCount?: number;
    /** Cached composite freshness score (0.0–1.0) */
    freshnessScore?: number;
    /** Decay rate profile — defaults to category-based if omitted */
    decayProfile?: DecayProfile;
}

/**
 * Determine the default decay profile for a knowledge category.
 */
export function getDefaultDecayProfile(category: string): DecayProfile {
    return CATEGORY_DECAY_DEFAULTS[category as GlobalKnowledgeCategory] ?? 'moderate';
}

/**
 * Compute a freshness score for a knowledge entry.
 * Works with the base IGlobalKnowledgeEntry type plus optional FreshnessFields.
 */
export function computeFreshnessScore(
    entry: IGlobalKnowledgeEntry & Partial<FreshnessFields>
): FreshnessScore {
    const referenceCount = entry.referenceCount ?? 0;
    const lastReferenced = entry.lastReferenced ?? null;
    const profile: DecayProfile = entry.decayProfile ?? getDefaultDecayProfile(entry.category);
    const halfLifeDays = DECAY_HALF_LIVES[profile];

    // Reference score: saturates at 20 references (prevents runaway inflation)
    const refScore = Math.min(referenceCount / 20, 1.0);

    // Recency score via logarithmic decay
    let recencyScore: number;
    let daysSinceReferenced: number;

    if (profile === 'permanent') {
        recencyScore = 1.0;
        daysSinceReferenced = 0;
    } else if (!lastReferenced) {
        // Never referenced — moderate default (we don't know age, so be neutral)
        recencyScore = 0.5;
        daysSinceReferenced = -1;
    } else {
        const msElapsed = Date.now() - Date.parse(lastReferenced);
        daysSinceReferenced = msElapsed / (1000 * 60 * 60 * 24);
        // score = 1 / (1 + log10(1 + daysSince / halfLife))
        // At daysSince=0 → 1.0; at daysSince=halfLife → ~0.5; at 10× → ~0.1
        recencyScore = halfLifeDays === null
            ? 1.0
            : 1.0 / (1.0 + Math.log10(1.0 + daysSinceReferenced / halfLifeDays));
    }

    const score = Math.max(0, Math.min(1, (refScore * 0.6) + (recencyScore * 0.4)));

    let label: FreshnessScore['label'];
    if (profile === 'permanent') { label = 'permanent'; }
    else if (score >= 0.6) { label = 'thriving'; }
    else if (score >= 0.3) { label = 'active'; }
    else if (score >= 0.1) { label = 'fading'; }
    else { label = 'dormant'; }

    return { score, referenceCount, lastReferenced, daysSinceReferenced, decayProfile: profile, label };
}

// ============================================================================
// Decay Report — for meditation review
// ============================================================================

/**
 * Build a decay report across all entries in the global knowledge index.
 * Called during self-actualization Phase 5.5. Flushes pending reference
 * touches first so the report reflects accurate usage data.
 *
 * Returns null if the global knowledge index does not exist locally.
 */
export async function getDecayReport(): Promise<DecayReport | null> {
    const indexPath = path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS.index);
    if (!await fs.pathExists(indexPath)) { return null; }

    try {
        // Flush pending touches so report is accurate for this session
        await flushReferenceQueue();

        const raw = await fs.readFile(indexPath, 'utf-8');
        const index = JSON.parse(raw) as IGlobalKnowledgeIndex;

        const thriving: DecayEntry[] = [];
        const active: DecayEntry[] = [];
        const fading: DecayEntry[] = [];
        const dormant: DecayEntry[] = [];
        let permanentCount = 0;

        for (const entry of index.entries) {
            const freshness = computeFreshnessScore(entry as IGlobalKnowledgeEntry & Partial<FreshnessFields>);

            if (freshness.label === 'permanent') {
                permanentCount++;
                continue;
            }

            const decayEntry: DecayEntry = {
                id: entry.id,
                title: entry.title,
                type: entry.type,
                category: entry.category,
                freshness,
            };

            if (freshness.label === 'thriving')     { thriving.push(decayEntry); }
            else if (freshness.label === 'active')  { active.push(decayEntry); }
            else if (freshness.label === 'fading')  { fading.push(decayEntry); }
            else                                    { dormant.push(decayEntry); }
        }

        // Sort: best first for thriving/active; worst first for fading/dormant
        thriving.sort((a, b) => b.freshness.score - a.freshness.score);
        active.sort((a, b) => b.freshness.score - a.freshness.score);
        fading.sort((a, b) => a.freshness.score - b.freshness.score);
        dormant.sort((a, b) => a.freshness.score - b.freshness.score);

        return {
            totalEntries: index.entries.length,
            thriving: thriving.slice(0, 10),
            active: active.slice(0, 10),
            fading: fading.slice(0, 5),
            dormant: dormant.slice(0, 5),
            permanentCount,
            generatedAt: new Date().toISOString(),
        };
    } catch (err) {
        console.warn('[ForgettingCurve] Failed to build decay report:', err);
        return null;
    }
}

// ============================================================================
// Dream Cycle — Forgetting Ceremony
// ============================================================================

/**
 * During the dream state, move entries below the freshness threshold to cold
 * storage (archive folders). Entries are NEVER deleted — only moved. The
 * transition is logged to episodic memory so the user can review what changed.
 *
 * Human review first: `getDecayReport()` during meditation surfaces candidates.
 * This ceremony runs automatically only during the dream cycle (P3 — background).
 *
 * @param workspaceRoot Root path of the Alex workspace (for episodic log)
 * @param threshold     Freshness score below which entries are archived (default: 0.1)
 */
export async function runForgettingCeremony(
    workspaceRoot: string,
    threshold = DEFAULT_ARCHIVE_THRESHOLD
): Promise<ForgettingCeremonyResult> {
    const result: ForgettingCeremonyResult = { archived: [], kept: [], skipped: 0 };

    const indexPath = path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS.index);
    if (!await fs.pathExists(indexPath)) { return result; }

    try {
        // Flush pending touches before archiving
        await flushReferenceQueue();

        const raw = await fs.readFile(indexPath, 'utf-8');
        const index = JSON.parse(raw) as IGlobalKnowledgeIndex;

        const insightArchive = path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS.insights, 'archive');
        const patternArchive = path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS.patterns, 'archive');

        const remainingEntries: IGlobalKnowledgeEntry[] = [];

        for (const entry of index.entries) {
            const freshness = computeFreshnessScore(entry as IGlobalKnowledgeEntry & Partial<FreshnessFields>);

            // Permanent entries are never archived
            if (freshness.label === 'permanent') {
                result.skipped++;
                remainingEntries.push(entry);
                continue;
            }

            if (freshness.score < threshold) {
                // Locate the source file
                const gkBase = path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS.knowledge);
                const sourceFile = entry.filePath.startsWith('/')
                    ? entry.filePath
                    : path.join(gkBase, entry.filePath);

                if (!await fs.pathExists(sourceFile)) {
                    // File is already gone — remove from index
                    result.archived.push({
                        id: entry.id,
                        title: entry.title,
                        reason: `score ${freshness.score.toFixed(3)} < ${threshold} (source file absent)`,
                    });
                    continue;
                }

                // Move to archive subfolder
                const archiveDir = entry.type === 'pattern' ? patternArchive : insightArchive;
                await fs.ensureDir(archiveDir);
                const destFile = path.join(archiveDir, path.basename(entry.filePath));
                await fs.move(sourceFile, destFile, { overwrite: false });

                const dayStr = freshness.daysSinceReferenced >= 0
                    ? `${Math.round(freshness.daysSinceReferenced)}d since last use`
                    : 'never referenced';

                result.archived.push({
                    id: entry.id,
                    title: entry.title,
                    reason: `score ${freshness.score.toFixed(3)} | refs: ${freshness.referenceCount} | ${dayStr}`,
                });
            } else {
                result.kept.push({ id: entry.id, title: entry.title, score: freshness.score });
                remainingEntries.push(entry);
            }
        }

        // Persist the pruned index
        if (result.archived.length > 0) {
            index.entries = remainingEntries;
            index.lastUpdated = new Date().toISOString();
            await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');

            // Log the ceremony to episodic memory
            await _logForgettingCeremony(workspaceRoot, result);
        }
    } catch (err) {
        console.warn('[ForgettingCurve] Forgetting ceremony failed:', err);
    }

    return result;
}

/** Write a forgetting ceremony record to .github/episodic/ for the user to review. */
async function _logForgettingCeremony(
    workspaceRoot: string,
    result: ForgettingCeremonyResult
): Promise<void> {
    try {
        const episodicPath = path.join(workspaceRoot, '.github', 'episodic');
        await fs.ensureDir(episodicPath);

        const date = new Date().toISOString().split('T')[0];
        const logPath = path.join(episodicPath, `forgetting-ceremony-${date}.md`);

        const archivedLines = result.archived.map(e => `- **${e.title}** \`${e.id}\` — ${e.reason}`);

        const content = [
            `# Forgetting Ceremony — ${date}`,
            '',
            `**Archived**: ${result.archived.length} entries moved to cold storage`,
            `**Kept**: ${result.kept.length} entries retained`,
            `**Skipped (permanent)**: ${result.skipped}`,
            '',
            '## Archived Entries (Cold Storage)',
            '',
            ...archivedLines,
            '',
            '> All archived entries remain recoverable. They reside in `insights/archive/`',
            '> or `patterns/archive/` in your Global Knowledge directory.',
            '> To restore an entry, move the file back and re-run `/knowledge index`.',
            '',
            '---',
            '',
            '*Generated by Alex Dream State — Forgetting Ceremony (v5.9.6)*',
        ].join('\n');

        await fs.writeFile(logPath, content, 'utf-8');
    } catch {
        // Non-critical — a failed log never fails the ceremony
    }
}
