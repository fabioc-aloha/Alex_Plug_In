/**
 * User Expertise Model — v6.0.0
 *
 * Tracks interaction frequency per domain across sessions to infer user expertise level.
 * Expertise level calibrates Alex's response depth: novice gets more explanation,
 * expert gets concise/advanced output.
 *
 * Levels per interaction count:
 *   novice:        0–4
 *   intermediate: 5–19
 *   advanced:     20–49
 *   expert:       50+
 */

import * as vscode from 'vscode';

// ============================================================================
// Types
// ============================================================================

export type ExpertiseLevel = 'novice' | 'intermediate' | 'advanced' | 'expert';
export type KnownDomain =
    | 'coding'
    | 'debugging'
    | 'architecture'
    | 'documentation'
    | 'testing'
    | 'devops'
    | 'data'
    | 'security'
    | 'ai-ml'
    | 'general';

interface DomainStats {
    interactions: number;
    lastSeen: string; // ISO date
}

type ExpertiseStore = {
    [D in KnownDomain]?: DomainStats;
};

const STORAGE_KEY = 'alex.expertiseModel.v1';

// Interaction thresholds → levels
const THRESHOLDS: Record<ExpertiseLevel, number> = {
    novice: 0,
    intermediate: 5,
    advanced: 20,
    expert: 50,
};

// ============================================================================
// Domain classification — keyword patterns
// ============================================================================

const DOMAIN_PATTERNS: Record<KnownDomain, RegExp> = {
    coding: /\b(function|class|method|variable|syntax|implement|refactor|code|typescript|javascript|python|rust|go|java|c#|vue|react|angular|npm|package)\b/i,
    debugging: /\b(bug|error|exception|crash|fix|broken|issue|problem|debug|stack\s*trace|null|undefined|fail|failing|not\s*working|unexpected)\b/i,
    architecture: /\b(architecture|design|pattern|system|scalab|microservice|monolith|module|layer|dependency|abstraction|interface|service|api\s*design|separation)\b/i,
    documentation: /\b(document|readme|changelog|comment|jsdoc|typedoc|spec|guide|tutorial|wiki|annotation|explain|clarify|write\s*up)\b/i,
    testing: /\b(test|spec|unit\s*test|integration\s*test|e2e|coverage|assert|mock|stub|spy|jest|mocha|vitest|playwright|cypress|tdd)\b/i,
    devops: /\b(deploy|ci\/cd|pipeline|docker|kubernetes|k8s|helm|terraform|bicep|github\s*action|workflow|release|publish|infrastructure)\b/i,
    data: /\b(database|sql|nosql|query|schema|migration|cosmos|postgres|mongo|redis|datamodel|orm|prisma|entity|table|index|shard)\b/i,
    security: /\b(security|auth|token|jwt|secret|credential|permission|rbac|cve|inject|xss|csrf|encrypt|hash|sanitize|vulnerability)\b/i,
    'ai-ml': /\b(ai|llm|prompt|embedding|vector|model|inference|fine.?tun|openai|copilot|azure\s*ai|foundry|rag|neural|machine\s*learning)\b/i,
    general: /./,   // catch-all — always matches last
};

/** Returns the most specific domain for a given text prompt */
export function classifyDomain(text: string): KnownDomain {
    const order: KnownDomain[] = [
        'debugging', 'testing', 'security', 'ai-ml', 'devops',
        'data', 'architecture', 'documentation', 'coding', 'general',
    ];
    for (const domain of order) {
        if (DOMAIN_PATTERNS[domain].test(text)) {
            return domain;
        }
    }
    return 'general';
}

// ============================================================================
// State
// ============================================================================

let _context: vscode.ExtensionContext | undefined;

function loadStore(): ExpertiseStore {
    if (!_context) { return {}; }
    return _context.globalState.get<ExpertiseStore>(STORAGE_KEY, {});
}

async function saveStore(store: ExpertiseStore): Promise<void> {
    if (!_context) { return; }
    await _context.globalState.update(STORAGE_KEY, store);
}

// ============================================================================
// Public API
// ============================================================================

export function initExpertiseModel(context: vscode.ExtensionContext): void {
    _context = context;
}

/** Record one interaction in the given domain. Call on every @alex exchange. */
export async function recordInteraction(text: string): Promise<void> {
    const domain = classifyDomain(text);
    const store = loadStore();

    const existing = store[domain] ?? { interactions: 0, lastSeen: new Date().toISOString() };
    existing.interactions += 1;
    existing.lastSeen = new Date().toISOString();
    store[domain] = existing;

    // Also always bump 'general'
    if (domain !== 'general') {
        const gen = store['general'] ?? { interactions: 0, lastSeen: new Date().toISOString() };
        gen.interactions += 1;
        gen.lastSeen = new Date().toISOString();
        store['general'] = gen;
    }

    await saveStore(store);
}

/** Returns the expertise level for a given domain */
export function getExpertiseLevel(domain: KnownDomain): ExpertiseLevel {
    const store = loadStore();
    const count = store[domain]?.interactions ?? 0;

    if (count >= THRESHOLDS.expert) { return 'expert'; }
    if (count >= THRESHOLDS.advanced) { return 'advanced'; }
    if (count >= THRESHOLDS.intermediate) { return 'intermediate'; }
    return 'novice';
}

/** Returns a short prompt calibration hint for use in system prompts */
export function getSystemPromptHint(domain: KnownDomain): string {
    const level = getExpertiseLevel(domain);
    switch (level) {
        case 'novice':
            return `The user is new to ${domain}. Use clear explanations, avoid jargon, and include "why" alongside "how".`;
        case 'intermediate':
            return `The user has some ${domain} experience. Assume basic concepts are understood; focus on practical guidance and best practices.`;
        case 'advanced':
            return `The user is experienced in ${domain}. Be concise, use precise terminology, highlight non-obvious insights and tradeoffs.`;
        case 'expert':
            return `The user is an expert in ${domain}. Skip basics entirely. Engage at peer level — tradeoffs, nuance, emerging patterns.`;
    }
}

/** Returns interaction stats for all domains (for display) */
export function getAllExpertise(): { domain: KnownDomain; level: ExpertiseLevel; interactions: number; lastSeen: string }[] {
    const store = loadStore();
    const allDomains: KnownDomain[] = [
        'coding', 'debugging', 'architecture', 'documentation',
        'testing', 'devops', 'data', 'security', 'ai-ml', 'general',
    ];
    return allDomains.map(d => ({
        domain: d,
        level: getExpertiseLevel(d),
        interactions: store[d]?.interactions ?? 0,
        lastSeen: store[d]?.lastSeen ?? '—',
    }));
}

// ============================================================================
// Level bar helper
// ============================================================================

function levelBar(count: number): string {
    const pct = Math.min(count / THRESHOLDS.expert, 1);
    const filled = Math.round(pct * 20);
    return '[' + '█'.repeat(filled) + '░'.repeat(20 - filled) + ']';
}

// ============================================================================
// Command
// ============================================================================

/** alex.showExpertiseModel — display expertise per domain in output channel */
export function showExpertiseModelCommand(): void {
    const expertise = getAllExpertise();
    const channel = vscode.window.createOutputChannel('Alex Expertise Model');
    channel.clear();
    channel.appendLine('');
    channel.appendLine('  Alex Expertise Model — Your domain expertise across sessions');
    channel.appendLine('  ' + '═'.repeat(60));
    channel.appendLine('');
    channel.appendLine('  Domain            Level          Progress              Interactions');
    channel.appendLine('  ' + '─'.repeat(70));
    for (const { domain, level, interactions, lastSeen } of expertise) {
        const d = domain.padEnd(17);
        const l = level.padEnd(14);
        const bar = levelBar(interactions).padEnd(23);
        const last = lastSeen !== '—' ? new Date(lastSeen).toLocaleDateString() : '—';
        channel.appendLine(`  ${d} ${l} ${bar} ${interactions.toString().padStart(4)}   (last: ${last})`);
    }
    channel.appendLine('');
    channel.appendLine('  Thresholds: novice=0  intermediate=5  advanced=20  expert=50');
    channel.appendLine('  Alex calibrates response depth automatically based on your level.');
    channel.appendLine('');
    channel.show();
}
