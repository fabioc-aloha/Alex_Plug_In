import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";

/**
 * Beta Telemetry - Temporary instrumentation for v3.5.x beta testing
 *
 * This module collects anonymous usage data to identify issues during beta.
 * All data is stored locally in the extension's global storage.
 * Users can view/export/clear their data via "Alex: View Beta Telemetry"
 *
 * TODO: Remove or formalize after beta period (target: v3.6.0 or v4.0.0)
 */

interface TelemetryEvent {
  timestamp: string;
  sessionId: string;
  event: string;
  category: "command" | "error" | "lifecycle" | "performance";
  data?: Record<string, unknown>;
  duration?: number;
  success?: boolean;
  errorMessage?: string;
  errorStack?: string;
}

interface TelemetrySession {
  sessionId: string;
  startedAt: string;
  vscodeVersion: string;
  extensionVersion: string;
  platform: string;
  arch: string;
  events: TelemetryEvent[];
}

let currentSession: TelemetrySession | null = null;
let globalStoragePath: string | null = null;
let outputChannel: vscode.OutputChannel | null = null;

const MAX_EVENTS_PER_SESSION = 500;
const MAX_SESSIONS_TO_KEEP = 10;

/**
 * Initialize telemetry for the current session
 */
export function initTelemetry(
  context: vscode.ExtensionContext,
  extensionVersion: string,
): void {
  globalStoragePath = context.globalStorageUri.fsPath;

  // Create or get output channel for real-time logging
  outputChannel = vscode.window.createOutputChannel("Alex Beta Telemetry");
  context.subscriptions.push(outputChannel);

  currentSession = {
    sessionId: generateSessionId(),
    startedAt: new Date().toISOString(),
    vscodeVersion: vscode.version,
    extensionVersion,
    platform: os.platform(),
    arch: os.arch(),
    events: [],
  };

  log("lifecycle", "session_start", {
    workspaceFolders: vscode.workspace.workspaceFolders?.length ?? 0,
    hasAlexInstalled: false, // Will be updated by first health check
  });

  outputChannel.appendLine(
    `[${new Date().toISOString()}] Beta telemetry initialized - Session: ${currentSession.sessionId}`,
  );
}

/**
 * Update the session's hasAlexInstalled status
 * Called by health check when it detects Alex is installed
 */
export function updateAlexInstalledStatus(installed: boolean): void {
  if (!currentSession) return;
  
  // Update the session_start event's data if it exists
  const sessionStartEvent = currentSession.events.find(e => e.event === 'session_start');
  if (sessionStartEvent && sessionStartEvent.data) {
    sessionStartEvent.data.hasAlexInstalled = installed;
  }
}

/**
 * Generate a random session ID (not tied to user identity)
 */
function generateSessionId(): string {
  return `beta-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Log a telemetry event
 */
export function log(
  category: TelemetryEvent["category"],
  event: string,
  data?: Record<string, unknown>,
): void {
  if (!currentSession) return;

  if (currentSession.events.length >= MAX_EVENTS_PER_SESSION) {
    // Prevent runaway logging
    return;
  }

  const telemetryEvent: TelemetryEvent = {
    timestamp: new Date().toISOString(),
    sessionId: currentSession.sessionId,
    event,
    category,
    data: sanitizeData(data),
  };

  currentSession.events.push(telemetryEvent);

  // Also log to output channel for real-time debugging
  if (outputChannel) {
    const dataStr = data ? ` ${JSON.stringify(sanitizeData(data))}` : "";
    outputChannel.appendLine(
      `[${telemetryEvent.timestamp}] [${category}] ${event}${dataStr}`,
    );
  }
}

/**
 * Log the start of a timed operation (returns a function to call when done)
 */
export function logTimed(
  category: TelemetryEvent["category"],
  event: string,
  data?: Record<string, unknown>,
): (success: boolean, errorOrData?: Error | Record<string, unknown>) => void {
  const startTime = Date.now();

  log(category, `${event}_start`, data);

  return (success: boolean, errorOrData?: Error | Record<string, unknown>) => {
    const duration = Date.now() - startTime;

    const endEvent: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      sessionId: currentSession?.sessionId ?? "unknown",
      event: `${event}_end`,
      category,
      duration,
      success,
      data: sanitizeData(data),
    };

    if (!success && errorOrData instanceof Error) {
      endEvent.errorMessage = errorOrData.message;
      // Only first line of stack to avoid huge logs
      endEvent.errorStack = errorOrData.stack
        ?.split("\n")
        .slice(0, 3)
        .join("\n");
    } else if (errorOrData && !(errorOrData instanceof Error)) {
      endEvent.data = { ...endEvent.data, ...sanitizeData(errorOrData) };
    }

    if (
      currentSession &&
      currentSession.events.length < MAX_EVENTS_PER_SESSION
    ) {
      currentSession.events.push(endEvent);
    }

    if (outputChannel) {
      const status = success ? "✓" : "✗";
      const errorStr =
        !success && errorOrData instanceof Error
          ? ` - ${errorOrData.message}`
          : "";
      outputChannel.appendLine(
        `[${endEvent.timestamp}] [${category}] ${event}_end ${status} (${duration}ms)${errorStr}`,
      );
    }
  };
}

/**
 * Log an error
 */
export function logError(
  event: string,
  error: Error | unknown,
  context?: Record<string, unknown>,
): void {
  const err = error instanceof Error ? error : new Error(String(error));

  log("error", event, {
    ...context,
    errorMessage: err.message,
    errorStack: err.stack?.split("\n").slice(0, 5).join("\n"),
  });
}

/**
 * Sanitize data to remove sensitive information
 */
function sanitizeData(
  data?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!data) return undefined;

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip potentially sensitive keys
    if (/password|token|secret|key|auth|credential|api/i.test(key)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }

    // Sanitize file paths - keep only filename and extension
    if (
      typeof value === "string" &&
      (value.includes("/") || value.includes("\\"))
    ) {
      const parts = value.split(/[/\\]/);
      sanitized[key] =
        parts.length > 2 ? `.../${parts.slice(-2).join("/")}` : value;
      continue;
    }

    // Truncate long strings
    if (typeof value === "string" && value.length > 200) {
      sanitized[key] = value.substring(0, 200) + "...[truncated]";
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

/**
 * Save session data to disk
 */
export async function saveSession(): Promise<void> {
  if (!currentSession || !globalStoragePath) return;

  try {
    const telemetryDir = path.join(globalStoragePath, "beta-telemetry");
    await fs.ensureDir(telemetryDir);

    const filename = `session-${currentSession.sessionId}.json`;
    await fs.writeJson(path.join(telemetryDir, filename), currentSession, {
      spaces: 2,
    });

    // Clean up old sessions
    await cleanupOldSessions(telemetryDir);
  } catch (err) {
    console.error("Failed to save telemetry session:", err);
  }
}

/**
 * Keep only the most recent sessions
 */
async function cleanupOldSessions(telemetryDir: string): Promise<void> {
  try {
    const files = await fs.readdir(telemetryDir);
    const sessionFiles = files
      .filter((f) => f.startsWith("session-") && f.endsWith(".json"))
      .sort()
      .reverse();

    // Remove old sessions beyond the limit
    for (const file of sessionFiles.slice(MAX_SESSIONS_TO_KEEP)) {
      await fs.remove(path.join(telemetryDir, file));
    }
  } catch (err) {
    // Non-critical, ignore
  }
}

/**
 * Get all stored telemetry data (for user review/export)
 */
export async function getAllTelemetryData(): Promise<TelemetrySession[]> {
  if (!globalStoragePath) return [];

  const telemetryDir = path.join(globalStoragePath, "beta-telemetry");
  if (!(await fs.pathExists(telemetryDir))) return [];

  const files = await fs.readdir(telemetryDir);
  const sessions: TelemetrySession[] = [];

  for (const file of files.filter((f) => f.endsWith(".json"))) {
    try {
      const session = await fs.readJson(path.join(telemetryDir, file));
      sessions.push(session);
    } catch {
      // Skip corrupted files
    }
  }

  // Add current session if not saved yet
  if (currentSession) {
    sessions.push(currentSession);
  }

  return sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

/**
 * Clear all telemetry data
 */
export async function clearTelemetryData(): Promise<void> {
  if (!globalStoragePath) return;

  const telemetryDir = path.join(globalStoragePath, "beta-telemetry");
  if (await fs.pathExists(telemetryDir)) {
    await fs.remove(telemetryDir);
  }

  // Reset current session events
  if (currentSession) {
    currentSession.events = [];
  }
}

/**
 * Get summary statistics
 */
export function getSessionSummary(): Record<string, unknown> {
  if (!currentSession) return {};

  const eventCounts: Record<string, number> = {};
  let errorCount = 0;
  let totalDuration = 0;
  let timedEventCount = 0;

  for (const event of currentSession.events) {
    eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
    if (event.category === "error") errorCount++;
    if (event.duration) {
      totalDuration += event.duration;
      timedEventCount++;
    }
  }

  return {
    sessionId: currentSession.sessionId,
    startedAt: currentSession.startedAt,
    totalEvents: currentSession.events.length,
    errorCount,
    avgDuration:
      timedEventCount > 0 ? Math.round(totalDuration / timedEventCount) : 0,
    topEvents: Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([event, count]) => `${event}: ${count}`),
  };
}

/**
 * Show telemetry output channel
 */
export function showTelemetryLog(): void {
  outputChannel?.show();
}
