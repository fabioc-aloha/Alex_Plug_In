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

import * as path from "path";
import * as workspaceFs from "./workspaceFs";

// ============================================================================
// Types
// ============================================================================

export interface ActiveContext {
  persona?: string; // e.g. "Developer (85% confidence)"
  objective?: string; // e.g. "Build ActiveContextManager" or placeholder
  tone?: string; // e.g. "Concise, code-first, minimal explanation"

  focusTrifectas?: string; // e.g. "master-heir-management, brand-asset-management"
  priorities?: string; // e.g. "north-star-alignment, autonomous-partnership"
  principles?: string; // e.g. "KISS, DRY, Optimize-for-AI"
  recent?: string; // e.g. "Summary of recent work"
  guidelines?: string; // e.g. "Architecture MUST NOT depend on the Extension"
  lastAssessed?: string; // e.g. "2026-02-14 — v5.7.0"
  northStar?: string; // e.g. "Create the most advanced and trusted AI partner for any job"
}

type ActiveContextField = Exclude<keyof ActiveContext, "northStar">;

// ============================================================================
// Constants
// ============================================================================

const SECTION_HEADER = "## Active Context";


/** Field labels as they appear in copilot-instructions.md */
const FIELD_LABELS: Record<ActiveContextField, string> = {
  persona: "Persona",
  objective: "Objective",
  tone: "Tone",

  focusTrifectas: "Focus Trifectas",
  priorities: "Priorities",
  principles: "Principles",
  recent: "Recent",
  guidelines: "Guidelines",
  lastAssessed: "Last Assessed",
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
  const next = new Promise<void>((resolve) => {
    release = resolve;
  });
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
  return path.join(workspaceRoot, ".github", "copilot-instructions.md");
}

/**
 * Check if this workspace is Master Alex (protected from certain overwrites).
 */
async function isMasterWorkspace(workspaceRoot: string): Promise<boolean> {
  const protectedPath = path.join(
    workspaceRoot,
    ".github",
    "config",
    "MASTER-ALEX-PROTECTED.json",
  );
  try {
    if (await workspaceFs.pathExists(protectedPath)) {
      const data = (await workspaceFs.readJson(protectedPath)) as {
        protected?: boolean;
      };
      return data.protected === true;
    }
  } catch {
    /* not protected */
  }
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
  if (headerIndex === -1) {
    return null;
  }

  // Find the end of the section: next `## ` heading or EOF
  const afterHeader = content.indexOf("\n", headerIndex);
  if (afterHeader === -1) {
    return null;
  }

  const rest = content.substring(afterHeader + 1);
  const nextHeading = rest.search(/^## /m);

  const sectionBody =
    nextHeading === -1 ? rest : rest.substring(0, nextHeading);
  const after = nextHeading === -1 ? "" : rest.substring(nextHeading);

  return {
    before: content.substring(0, headerIndex),
    section: SECTION_HEADER + "\n" + sectionBody,
    after,
  };
}

/**
 * Parse field values from the Active Context section body.
 */
function parseSection(section: string): ActiveContext {
  const ctx: ActiveContext = {};
  const lines = section.replace(/\r\n/g, "\n").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("Persona:")) {
      ctx.persona = trimmed.substring("Persona:".length).trim();
    } else if (trimmed.startsWith("Objective:")) {
      ctx.objective = trimmed.substring("Objective:".length).trim();
    } else if (trimmed.startsWith("Tone:")) {
      ctx.tone = trimmed.substring("Tone:".length).trim();
    } else if (trimmed.startsWith("Focus Trifectas:")) {
      ctx.focusTrifectas = trimmed.substring("Focus Trifectas:".length).trim();
    } else if (trimmed.startsWith("Priorities:")) {
      ctx.priorities = trimmed.substring("Priorities:".length).trim();
    } else if (trimmed.startsWith("Principles:")) {
      ctx.principles = trimmed.substring("Principles:".length).trim();
    } else if (trimmed.startsWith("Recent:")) {
      ctx.recent = trimmed.substring("Recent:".length).trim();
    } else if (trimmed.startsWith("Guidelines:")) {
      ctx.guidelines = trimmed.substring("Guidelines:".length).trim();
    } else if (trimmed.startsWith("Last Assessed:")) {
      ctx.lastAssessed = trimmed.substring("Last Assessed:".length).trim();
    }
  }
  return ctx;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Read the current Active Context from copilot-instructions.md.
 */
export async function readActiveContext(
  workspaceRoot: string,
): Promise<ActiveContext | null> {
  const filePath = getInstructionsPath(workspaceRoot);
  if (!(await workspaceFs.pathExists(filePath))) {
    return null;
  }

  try {
    const content = await workspaceFs.readFile(filePath);
    const parts = splitActiveContextSection(content);
    if (!parts) {
      return null;
    }
    const ctx = parseSection(parts.section);
    // North Star lives outside Active Context — parse from full file
    const nsMatch = content.match(/^North Star:\s*(.+)$/m);
    if (nsMatch) {
      ctx.northStar = nsMatch[1].trim();
    }
    return ctx;
  } catch (err) {
    console.warn("[ActiveContext] Failed to read:", err);
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
  source: string,
): Promise<boolean> {
  return withMutex(async () => {
    const filePath = getInstructionsPath(workspaceRoot);
    if (!(await workspaceFs.pathExists(filePath))) {
      console.warn(`[ActiveContext] File not found: ${filePath}`);
      return false;
    }

    try {
      const content = await workspaceFs.readFile(filePath);
      const parts = splitActiveContextSection(content);
      if (!parts) {
        console.warn(
          "[ActiveContext] Active Context section not found in copilot-instructions.md",
        );
        return false;
      }

      // Master protection: block Focus Trifectas overwrite on Master Alex
      if (updates.focusTrifectas !== undefined) {
        const isMaster = await isMasterWorkspace(workspaceRoot);
        if (isMaster) {
          delete updates.focusTrifectas;
        }
      }

      // Targeted line replacement within the section (preserves all existing fields)
      let section = parts.section;
      const changed: string[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          continue;
        }
        const field = key as ActiveContextField;
        const label = FIELD_LABELS[field];
        if (!label) {
          continue;
        }

        const lineRegex = new RegExp(`^${label}:.*$`, "m");
        const newLine = `${label}: ${value}`;

        if (lineRegex.test(section)) {
          const oldLine = section.match(lineRegex)?.[0];
          if (oldLine !== newLine) {
            section = section.replace(lineRegex, newLine);
            changed.push(newLine);
          }
        } else {
          // Field doesn't exist — insert before trailing whitespace
          section = section.trimEnd() + "\n" + newLine + "\n";
          changed.push(newLine);
        }
      }

      if (changed.length === 0) {
        return false;
      }

      // Write the updated content
      const newContent = parts.before + section + parts.after;
      await workspaceFs.writeFile(filePath, newContent);
      console.log(`[ActiveContext] Updated (${source}): ${changed.join(", ")}`);
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
  confidence: number,
): Promise<boolean> {
  const pct = Math.round(confidence * 100);
  return updateActiveContext(
    workspaceRoot,
    { persona: `${personaName} (${pct}% confidence)` },
    "persona-detection",
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
  version: string,
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  return updateActiveContext(
    workspaceRoot,
    { lastAssessed: `${today} — v${version}` },
    "self-actualization",
  );
}
