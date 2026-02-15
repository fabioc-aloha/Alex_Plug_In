/**
 * Active Context Manager
 * 
 * SINGLE centralized writer for the Active Context section of copilot-instructions.md.
 * No other module should write to this section directly.
 * 
 * Design principles:
 * - Section-scoped: only modifies content between `## Active Context` and the next `##`
 * - Mutex-protected: serialized writes prevent concurrent corruption
 * - Master-safe: respects MASTER-ALEX-PROTECTED.json (blocks Focus Trifecta overwrites)
 * - Validated: every field update is type-checked and logged
 * 
 * Active Context fields (v2-llm-first format):
 *   Persona: <name> (<confidence>% confidence)
 *   Objective: <session topic or placeholder>
 *   Focus Trifectas: <comma-separated trifecta IDs>
 *   Principles: <comma-separated>
 *   Last Assessed: <date> — v<version>
 * 
 * @see ADR-010 — copilot-instructions as prefrontal cortex
 */

import * as fs from 'fs-extra';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

export interface ActiveContext {
    persona?: string;       // e.g. "Developer (85% confidence)"
    objective?: string;     // e.g. "Build ActiveContextManager" or placeholder
    focusTrifectas?: string; // e.g. "master-heir-management, brand-asset-management"
    principles?: string;    // e.g. "KISS, DRY, Optimize-for-AI"
    lastAssessed?: string;  // e.g. "2026-02-14 — v5.7.0"
}

type ActiveContextField = keyof ActiveContext;

// ============================================================================
// Constants
// ============================================================================

const SECTION_HEADER = '## Active Context';
const SECTION_COMMENT = '<!-- Extension-managed session state. Read this FIRST to resume context across sessions. -->';
const OBJECTIVE_PLACEHOLDER = '*(session-objective — set by user or focus timer)*';

/** Field labels as they appear in copilot-instructions.md */
const FIELD_LABELS: Record<ActiveContextField, string> = {
    persona: 'Persona',
    objective: 'Objective',
    focusTrifectas: 'Focus Trifectas',
    principles: 'Principles',
    lastAssessed: 'Last Assessed',
};

// ============================================================================
// Mutex
// ============================================================================

let writeLock: Promise<void> = Promise.resolve();

/**
 * Serialize writes so two callers can never corrupt the file simultaneously.
 */
function withMutex<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const next = new Promise<void>(resolve => { release = resolve; });
    const current = writeLock;
    writeLock = next;

    return current.then(async () => {
        try {
            return await fn();
        } finally {
            release!();
        }
    });
}

// ============================================================================
// Core read/write helpers
// ============================================================================

/**
 * Get the copilot-instructions.md path for a workspace.
 */
function getInstructionsPath(workspaceRoot: string): string {
    return path.join(workspaceRoot, '.github', 'copilot-instructions.md');
}

/**
 * Check if this workspace is Master Alex (protected from certain overwrites).
 */
async function isMasterWorkspace(workspaceRoot: string): Promise<boolean> {
    const protectedPath = path.join(workspaceRoot, '.github', 'config', 'MASTER-ALEX-PROTECTED.json');
    try {
        if (await fs.pathExists(protectedPath)) {
            const data = await fs.readJson(protectedPath);
            return data.protected === true;
        }
    } catch { /* not protected */ }
    return false;
}

/**
 * Extract the Active Context section from the full file content.
 * Returns { before, section, after } where section includes the header line
 * through the last field line (before the next ## or EOF).
 */
function splitActiveContextSection(content: string): {
    before: string;
    section: string;
    after: string;
} | null {
    const headerIndex = content.indexOf(SECTION_HEADER);
    if (headerIndex === -1) { return null; }

    // Find the end of the section: next `## ` heading or EOF
    const afterHeader = content.indexOf('\n', headerIndex);
    if (afterHeader === -1) { return null; }

    const rest = content.substring(afterHeader + 1);
    const nextHeading = rest.search(/^## /m);

    const sectionBody = nextHeading === -1 ? rest : rest.substring(0, nextHeading);
    const after = nextHeading === -1 ? '' : rest.substring(nextHeading);

    return {
        before: content.substring(0, headerIndex),
        section: SECTION_HEADER + '\n' + sectionBody,
        after,
    };
}

/**
 * Parse field values from the Active Context section body.
 */
function parseSection(section: string): ActiveContext {
    const ctx: ActiveContext = {};
    const lines = section.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('Persona:')) {
            ctx.persona = trimmed.substring('Persona:'.length).trim();
        } else if (trimmed.startsWith('Objective:')) {
            ctx.objective = trimmed.substring('Objective:'.length).trim();
        } else if (trimmed.startsWith('Focus Trifectas:')) {
            ctx.focusTrifectas = trimmed.substring('Focus Trifectas:'.length).trim();
        } else if (trimmed.startsWith('Principles:')) {
            ctx.principles = trimmed.substring('Principles:'.length).trim();
        } else if (trimmed.startsWith('Last Assessed:')) {
            ctx.lastAssessed = trimmed.substring('Last Assessed:'.length).trim();
        }
    }
    return ctx;
}

/**
 * Rebuild the Active Context section from parsed values.
 */
function rebuildSection(ctx: ActiveContext): string {
    const lines = [
        SECTION_HEADER,
        SECTION_COMMENT,
        `Persona: ${ctx.persona ?? 'Unknown'}`,
        `Objective: ${ctx.objective ?? OBJECTIVE_PLACEHOLDER}`,
        `Focus Trifectas: ${ctx.focusTrifectas ?? ''}`,
        `Principles: ${ctx.principles ?? 'KISS, DRY, Optimize-for-AI'}`,
        `Last Assessed: ${ctx.lastAssessed ?? 'never'}`,
        '', // trailing newline before next section
    ];
    return lines.join('\n');
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Read the current Active Context from copilot-instructions.md.
 */
export async function readActiveContext(workspaceRoot: string): Promise<ActiveContext | null> {
    const filePath = getInstructionsPath(workspaceRoot);
    if (!(await fs.pathExists(filePath))) { return null; }

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const parts = splitActiveContextSection(content);
        if (!parts) { return null; }
        return parseSection(parts.section);
    } catch (err) {
        console.warn('[ActiveContext] Failed to read:', err);
        return null;
    }
}

/**
 * Update one or more Active Context fields atomically.
 * Only the supplied fields are changed; others are preserved.
 * 
 * @param workspaceRoot - Workspace root path
 * @param updates - Partial ActiveContext with fields to update
 * @param source - Caller identifier for logging (e.g. 'persona-detection', 'session')
 * @returns true if the file was written, false if skipped/failed
 */
export async function updateActiveContext(
    workspaceRoot: string,
    updates: Partial<ActiveContext>,
    source: string
): Promise<boolean> {
    return withMutex(async () => {
        const filePath = getInstructionsPath(workspaceRoot);
        if (!(await fs.pathExists(filePath))) {
            console.warn(`[ActiveContext] File not found: ${filePath}`);
            return false;
        }

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const parts = splitActiveContextSection(content);
            if (!parts) {
                console.warn('[ActiveContext] Active Context section not found in copilot-instructions.md');
                return false;
            }

            // Parse existing values
            const ctx = parseSection(parts.section);

            // Master protection: block Focus Trifectas overwrite on Master Alex
            if (updates.focusTrifectas !== undefined) {
                const isMaster = await isMasterWorkspace(workspaceRoot);
                if (isMaster) {
                    delete updates.focusTrifectas;
                }
            }

            // Merge updates
            const changed: string[] = [];
            for (const [key, value] of Object.entries(updates)) {
                const field = key as ActiveContextField;
                if (value !== undefined && ctx[field] !== value) {
                    (ctx as Record<string, string>)[field] = value;
                    changed.push(`${FIELD_LABELS[field]}: ${value}`);
                }
            }

            if (changed.length === 0) {
                return false;
            }

            // Rebuild and write
            const newSection = rebuildSection(ctx);

            console.log(`[ActiveContext] Updated by ${source}: ${changed.join(', ')}`);
            return true;
        } catch (err) {
            console.warn(`[ActiveContext] Write failed (source: ${source}):`, err);
            return false;
        }
    });
}

// ============================================================================
// Convenience methods — each wraps updateActiveContext for a single concern
// ============================================================================

/**
 * Update the Persona field.
 * Called by persona detection after identifying the user's persona.
 * 
 * @param personaName - e.g. "Developer"
 * @param confidence - 0-1, will be converted to percentage display
 */
export async function updatePersona(
    workspaceRoot: string,
    personaName: string,
    confidence: number
): Promise<boolean> {
    const pct = Math.round(confidence * 100);
    return updateActiveContext(
        workspaceRoot,
        { persona: `${personaName} (${pct}% confidence)` },
        'persona-detection'
    );
}

/**
 * Update the Objective field.
 * Called by session timer on start (sets topic) and end (clears to placeholder).
 * 
 * @param objective - Session topic string, or null/undefined to reset to placeholder
 */
export async function updateObjective(
    workspaceRoot: string,
    objective: string | null | undefined
): Promise<boolean> {
    return updateActiveContext(
        workspaceRoot,
        { objective: objective || OBJECTIVE_PLACEHOLDER },
        'session'
    );
}

/**
 * Update the Focus Trifectas field.
 * Focus Trifectas = 3 skills for current work context (changes per-session).
 * 
 * Blocked on Master Alex workspace (Focus Trifectas are manually curated there).
 * 
 * NOTE: NOT auto-called by persona detection — trifectas managed independently from persona.
 * 
 * @param trifectas - Array of trifecta IDs (e.g. ['code-review', 'testing-strategies'])
 */
export async function updateFocusTrifectas(
    workspaceRoot: string,
    trifectas: string[]
): Promise<boolean> {
    return updateActiveContext(
        workspaceRoot,
        { focusTrifectas: trifectas.join(', ') },
        'persona-detection'
    );
}

/**
 * Update the Last Assessed field.
 * Called by self-actualization after completing the protocol.
 * 
 * @param version - Current Alex version (e.g. "5.7.0")
 */
export async function updateLastAssessed(
    workspaceRoot: string,
    version: string
): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    return updateActiveContext(
        workspaceRoot,
        { lastAssessed: `${today} — v${version}` },
        'self-actualization'
    );
}

/**
 * Update the Principles field.
 * Rarely called — principles are usually stable. Available for future use.
 */
export async function updatePrinciples(
    workspaceRoot: string,
    principles: string[]
): Promise<boolean> {
    return updateActiveContext(
        workspaceRoot,
        { principles: principles.join(', ') },
        'principles'
    );
}
