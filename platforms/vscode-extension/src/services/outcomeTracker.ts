/**
 * Outcome Learning Loop — v6.0.0
 *
 * Tracks the accuracy of Alex's advice by recording 👍/👎 signals.
 * Builds per-domain confidence scores over time so Alex can calibrate
 * how assertively it responds in each area.
 *
 * Storage: VS Code globalState (key: alex.outcomeTracker.v1)
 */

import * as vscode from 'vscode';

// ============================================================================
// Types
// ============================================================================

export interface AdviceRecord {
    id: string;
    advice: string;          // first 300 chars of the response that was rated
    domain: string;
    context: string;         // first 200 chars of the user prompt that prompted the advice
    outcome: 'positive' | 'negative' | null;
    createdAt: string;
    resolvedAt?: string;
}

export interface DomainStats {
    domain: string;
    positiveCount: number;
    negativeCount: number;
    pendingCount: number;
    confidenceScore: number; // 0–1, default 0.7 if insufficient data
}

// ============================================================================
// State
// ============================================================================

const STATE_KEY = 'alex.outcomeTracker.v1';
const MAX_RECORDS = 500;

/** Last advice ID tracked — used to correlate outcomes with advice */
let _lastAdviceId: string | null = null;
let _ctx: vscode.ExtensionContext | undefined;

export function initOutcomeTracker(context: vscode.ExtensionContext): void {
    _ctx = context;
}

// ============================================================================
// Storage
// ============================================================================

function loadRecords(): AdviceRecord[] {
    if (!_ctx) { return []; }
    return _ctx.globalState.get<AdviceRecord[]>(STATE_KEY, []);
}

async function saveRecords(records: AdviceRecord[]): Promise<void> {
    if (!_ctx) { return; }
    await _ctx.globalState.update(STATE_KEY, records.slice(0, MAX_RECORDS));
}

// ============================================================================
// Core API
// ============================================================================

/**
 * Record a piece of advice Alex gave. Returns the tracking ID.
 * Call this after generating a response in the chat participant.
 */
export async function trackAdvice(
    advice: string,
    domain: string,
    userContext: string
): Promise<string> {
    const id = `advice-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    _lastAdviceId = id;

    const records = loadRecords();
    records.unshift({
        id,
        advice: advice.slice(0, 300),
        domain,
        context: userContext.slice(0, 200),
        outcome: null,
        createdAt: new Date().toISOString(),
    });
    await saveRecords(records);
    return id;
}

/**
 * Record a positive outcome for the last tracked advice (👍).
 */
export async function recordPositiveOutcome(adviceId?: string): Promise<void> {
    await recordOutcome(adviceId ?? _lastAdviceId, true);
    vscode.window.showInformationMessage('👍 Outcome recorded — Alex learns from this!', { modal: false });
}

/**
 * Record a negative outcome for the last tracked advice (👎).
 */
export async function recordNegativeOutcome(adviceId?: string): Promise<void> {
    await recordOutcome(adviceId ?? _lastAdviceId, false);
    vscode.window.showInformationMessage('👎 Outcome recorded — Alex will adjust confidence in this area.', { modal: false });
}

async function recordOutcome(id: string | null, positive: boolean): Promise<void> {
    if (!id) {
        vscode.window.showWarningMessage('No recent advice to rate. Use @alex first, then rate the response.');
        return;
    }
    const records = loadRecords();
    const record = records.find(r => r.id === id);
    if (record) {
        record.outcome = positive ? 'positive' : 'negative';
        record.resolvedAt = new Date().toISOString();
        await saveRecords(records);
    }
}

// ============================================================================
// Confidence Scoring
// ============================================================================

/**
 * Returns confidence score (0–1) for a domain based on historical outcomes.
 * Default is 0.7 (moderate) when fewer than 3 rated records exist.
 */
export function getConfidenceForDomain(domain: string): number {
    const records = loadRecords().filter(r => r.domain === domain && r.outcome !== null);
    if (records.length < 3) { return 0.7; }
    const positives = records.filter(r => r.outcome === 'positive').length;
    return Math.round((positives / records.length) * 100) / 100;
}

/**
 * Returns a prompt hint for a domain based on confidence.
 * Used to calibrate how assertively Alex responds.
 */
export function getConfidenceHint(domain: string): string {
    const score = getConfidenceForDomain(domain);
    if (score >= 0.85) { return `High confidence in ${domain} (${Math.round(score * 100)}% success rate). Be direct and assertive.`; }
    if (score >= 0.65) { return `Moderate confidence in ${domain} (${Math.round(score * 100)}% success rate). Be clear but acknowledge uncertainty where appropriate.`; }
    return `Lower confidence in ${domain} (${Math.round(score * 100)}% success rate). Be explicit about uncertainty and offer alternatives.`;
}

export function getDomainStats(): DomainStats[] {
    const records = loadRecords();
    const byDomain = new Map<string, AdviceRecord[]>();
    for (const r of records) {
        const list = byDomain.get(r.domain) ?? [];
        list.push(r);
        byDomain.set(r.domain, list);
    }
    const stats: DomainStats[] = [];
    for (const [domain, domainRecords] of byDomain) {
        const positiveCount = domainRecords.filter(r => r.outcome === 'positive').length;
        const negativeCount = domainRecords.filter(r => r.outcome === 'negative').length;
        const pendingCount = domainRecords.filter(r => r.outcome === null).length;
        const resolved = positiveCount + negativeCount;
        stats.push({
            domain,
            positiveCount,
            negativeCount,
            pendingCount,
            confidenceScore: resolved > 0 ? positiveCount / resolved : 0.7,
        });
    }
    return stats.sort((a, b) => (b.positiveCount + b.negativeCount) - (a.positiveCount + a.negativeCount));
}

// ============================================================================
// Commands
// ============================================================================

/** alex.recordPositiveOutcome — mark last advice as helpful */
export async function recordPositiveOutcomeCommand(): Promise<void> {
    await recordPositiveOutcome();
}

/** alex.recordNegativeOutcome — mark last advice as unhelpful */
export async function recordNegativeOutcomeCommand(): Promise<void> {
    await recordNegativeOutcome();
}

/** alex.showOutcomeStats — display domain confidence dashboard */
export async function showOutcomeStatsCommand(): Promise<void> {
    const stats = getDomainStats();
    if (stats.length === 0) {
        vscode.window.showInformationMessage(
            'No outcome data yet. After @alex gives advice, rate it with "Alex: 👍 This Worked" or "Alex: 👎 This Didn\'t Work".'
        );
        return;
    }

    const panel = vscode.window.createOutputChannel('Alex Outcome Stats');
    panel.clear();
    panel.appendLine('');
    panel.appendLine('  Alex Outcome Learning — Domain Confidence Scores');
    panel.appendLine('  ' + '═'.repeat(53));
    panel.appendLine('');
    for (const s of stats) {
        const pct = Math.round(s.confidenceScore * 100);
        const filled = Math.round(pct / 10);
        const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
        const label = s.domain.padEnd(16);
        panel.appendLine(`  ${label} ${bar}  ${String(pct).padStart(3)}%  (${s.positiveCount}👍  ${s.negativeCount}👎  ${s.pendingCount} pending)`);
    }
    panel.appendLine('');
    panel.appendLine(`  Total rated: ${stats.reduce((n, s) => n + s.positiveCount + s.negativeCount, 0)} advice records`);
    panel.show();
}
