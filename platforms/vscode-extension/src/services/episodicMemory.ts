/**
 * Episodic Memory Service — v6.0.0
 *
 * Saves and retrieves full session records, enabling "what were we building last Tuesday?"
 * recall across VS Code sessions.
 *
 * Storage: ~/.alex/episodic/sessions.json (rolling, max 200 records)
 * Each record: id, date, topic, summary, filesChanged, tags, workspace
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

// ============================================================================
// Types
// ============================================================================

export interface EpisodicRecord {
    id: string;
    date: string;           // ISO timestamp
    topic: string;          // derived from first user prompt in session
    summary: string;        // key actions/outcomes of the session
    filesChanged: string[]; // files touched (from peripheral observation)
    tags: string[];         // inferred domain tags
    workspace?: string;     // workspace folder name
    messageCount?: number;  // number of @alex exchanges
}

/** In-memory buffer for the current session — flushed on session end or deactivation */
let _currentDraft: {
    topic: string;
    prompts: string[];
    filesAtStart: string[];
    workspace: string;
    startedAt: number;
} | null = null;

// ============================================================================
// Storage
// ============================================================================

const ALEX_HOME = path.join(os.homedir(), '.alex');
const SESSIONS_FILE = path.join(ALEX_HOME, 'episodic', 'sessions.json');
const MAX_SESSIONS = 200;

async function loadSessions(): Promise<EpisodicRecord[]> {
    if (!await fs.pathExists(SESSIONS_FILE)) { return []; }
    try {
        const data = await fs.readJson(SESSIONS_FILE);
        return Array.isArray(data) ? data as EpisodicRecord[] : [];
    } catch {
        return [];
    }
}

async function persistSessions(sessions: EpisodicRecord[]): Promise<void> {
    await fs.ensureDir(path.dirname(SESSIONS_FILE));
    await fs.writeJson(SESSIONS_FILE, sessions.slice(0, MAX_SESSIONS), { spaces: 2 });
}

// ============================================================================
// Session Draft — accumulates messages during a conversation
// ============================================================================

/**
 * Called after each @alex exchange to build up the session draft.
 * Automatically starts a new draft if none exists.
 */
export async function appendToEpisodicDraft(
    prompt: string,
    filesChanged: string[],
    workspace: string
): Promise<void> {
    if (!_currentDraft) {
        _currentDraft = {
            topic: prompt.slice(0, 80).trim(),
            prompts: [],
            filesAtStart: [...filesChanged],
            workspace,
            startedAt: Date.now(),
        };
    }
    _currentDraft.prompts.push(prompt.slice(0, 200));
    // Only keep last 10 prompts in the draft to cap memory
    if (_currentDraft.prompts.length > 10) {
        _currentDraft.prompts = _currentDraft.prompts.slice(-10);
    }
}

/**
 * Flush the current draft to persistent storage.
 * Call from deactivate() or endSession().
 * No-op if no draft or draft has fewer than 2 exchanges.
 */
export async function flushEpisodicDraft(): Promise<void> {
    if (!_currentDraft || _currentDraft.prompts.length < 2) {
        _currentDraft = null;
        return;
    }

    const draft = _currentDraft;
    _currentDraft = null;

    const tags = inferTags([draft.topic, ...draft.prompts].join(' '));
    const summary = buildSummary(draft.prompts);

    const record: EpisodicRecord = {
        id: `session-${draft.startedAt}`,
        date: new Date(draft.startedAt).toISOString(),
        topic: draft.topic,
        summary,
        filesChanged: draft.filesAtStart,
        tags,
        workspace: draft.workspace,
        messageCount: draft.prompts.length,
    };

    try {
        const sessions = await loadSessions();
        sessions.unshift(record);
        await persistSessions(sessions);
    } catch (err) {
        console.warn('[EpisodicMemory] Failed to flush draft:', err);
    }
}

/**
 * Explicitly save a fully-formed episodic record (e.g. from a meditation session).
 */
export async function saveEpisodicRecord(record: Omit<EpisodicRecord, 'id' | 'date'>): Promise<void> {
    const sessions = await loadSessions();
    sessions.unshift({
        id: `session-${Date.now()}`,
        date: new Date().toISOString(),
        ...record,
    });
    await persistSessions(sessions);
}

// ============================================================================
// Query
// ============================================================================

export async function queryEpisodicMemory(query: string): Promise<EpisodicRecord[]> {
    const sessions = await loadSessions();
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (terms.length === 0) { return sessions.slice(0, 20); }

    return sessions.filter(s => {
        const hay = `${s.topic} ${s.summary} ${s.tags.join(' ')} ${s.workspace ?? ''}`.toLowerCase();
        return terms.every(t => hay.includes(t));
    });
}

export async function getRecentSessions(n = 10): Promise<EpisodicRecord[]> {
    const sessions = await loadSessions();
    return sessions.slice(0, n);
}

export async function getSessionsByDateRange(from: Date, to: Date): Promise<EpisodicRecord[]> {
    const sessions = await loadSessions();
    return sessions.filter(s => {
        const d = new Date(s.date);
        return d >= from && d <= to;
    });
}

/**
 * Build a concise context string for injection into prompts.
 * Returns the last N sessions as a readable list.
 */
export async function buildEpisodicContext(n = 5): Promise<string> {
    const sessions = await getRecentSessions(n);
    if (sessions.length === 0) { return ''; }
    const lines = sessions.map(s => {
        const date = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        return `- [${date}] ${s.topic} (${s.tags.slice(0, 2).join(', ')})`;
    });
    return `Recent sessions:\n${lines.join('\n')}`;
}

// ============================================================================
// Helpers
// ============================================================================

function buildSummary(prompts: string[]): string {
    if (prompts.length === 0) { return ''; }
    if (prompts.length === 1) { return prompts[0]; }
    return `Started with: "${prompts[0]}". Also covered: ${prompts.slice(1, 4).map(p => `"${p.slice(0, 60)}"`).join(', ')}.`;
}

const DOMAIN_TAG_MAP: [RegExp, string][] = [
    [/\b(brand|color|css|design|ui|ux|layout|style|theme)\b/i, 'design'],
    [/\b(test|spec|jest|mocha|coverage|mock)\b/i, 'testing'],
    [/\b(deploy|azure|aws|docker|ci\/cd|pipeline|release|publish)\b/i, 'devops'],
    [/\b(debug|error|bug|fix|crash|exception|stack trace)\b/i, 'debugging'],
    [/\b(architecture|design pattern|microservice|api|system design)\b/i, 'architecture'],
    [/\b(typescript|javascript|python|react|node|function|class)\b/i, 'coding'],
    [/\b(document|readme|changelog|comment|explain)\b/i, 'documentation'],
    [/\b(security|auth|token|permission|vulnerability)\b/i, 'security'],
    [/\b(database|sql|query|schema|migration|cosmos|postgres)\b/i, 'data'],
    [/\b(refactor|clean|optimize|performance|memory)\b/i, 'refactoring'],
];

function inferTags(text: string): string[] {
    const tags: string[] = [];
    for (const [pattern, tag] of DOMAIN_TAG_MAP) {
        if (pattern.test(text) && !tags.includes(tag)) {
            tags.push(tag);
        }
    }
    return tags.slice(0, 4);
}
