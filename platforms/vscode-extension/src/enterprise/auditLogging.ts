/**
 * Audit Logging Framework
 *
 * Comprehensive audit trail for all Alex operations.
 * Supports file-based, console, and remote logging backends.
 *
 * @module enterprise/auditLogging
 * @version 5.3.0
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface AuditEvent {
  /** Unique event ID */
  id: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Event category */
  category: AuditCategory;
  /** Specific action within category */
  action: string;
  /** User who performed the action */
  actor: AuditActor;
  /** Target of the action */
  target?: AuditTarget;
  /** Action outcome */
  outcome: 'success' | 'failure' | 'unknown';
  /** Additional event details */
  details?: Record<string, unknown>;
  /** Client/session context */
  context: AuditContext;
}

export type AuditCategory =
  | 'auth'           // Authentication events
  | 'access'         // Resource access
  | 'modify'         // Content modification
  | 'system'         // System events
  | 'cognitive'      // Alex cognitive operations
  | 'knowledge'      // Global knowledge operations
  | 'export'         // Data export
  | 'config';        // Configuration changes

export interface AuditActor {
  /** User ID or system */
  id: string;
  /** Display name */
  name: string;
  /** Email if available */
  email?: string;
  /** Tenant ID for enterprise */
  tenantId?: string;
  /** User roles */
  roles?: string[];
}

export interface AuditTarget {
  /** Resource type */
  type: 'file' | 'skill' | 'memory' | 'knowledge' | 'config' | 'session';
  /** Resource identifier */
  id: string;
  /** Resource name */
  name?: string;
  /** Resource path if applicable */
  path?: string;
}

export interface AuditContext {
  /** VS Code session ID */
  sessionId: string;
  /** Workspace folder */
  workspaceId?: string;
  /** Extension version */
  extensionVersion: string;
  /** Client IP (if remote) */
  clientIp?: string;
  /** User agent / client info */
  userAgent?: string;
}

export interface AuditConfig {
  /** Enable audit logging */
  enabled: boolean;
  /** Log to file */
  fileLogging: boolean;
  /** Log file path */
  logFilePath?: string;
  /** Log to console */
  consoleLogging: boolean;
  /** Log to remote endpoint */
  remoteLogging: boolean;
  /** Remote endpoint URL */
  remoteEndpoint?: string;
  /** Minimum log level */
  minLevel: 'debug' | 'info' | 'warn' | 'error';
  /** Retention days for file logs */
  retentionDays: number;
  /** Categories to log */
  categories: AuditCategory[];
  /** Redact sensitive data */
  redactSensitive: boolean;
}

// Default configuration
const DEFAULT_CONFIG: AuditConfig = {
  enabled: true,
  fileLogging: true,
  consoleLogging: false,
  remoteLogging: false,
  minLevel: 'info',
  retentionDays: 90,
  categories: ['auth', 'access', 'modify', 'cognitive', 'knowledge', 'export', 'config'],
  redactSensitive: true,
};

// Module state
let config: AuditConfig = { ...DEFAULT_CONFIG };
let sessionId: string = generateSessionId();
let extensionVersion: string = '5.3.0';
let logFileStream: fs.WriteStream | null = null;
let eventBuffer: AuditEvent[] = [];
const BUFFER_FLUSH_SIZE = 10;
const BUFFER_FLUSH_INTERVAL_MS = 5000;
let flushInterval: NodeJS.Timeout | null = null;

/**
 * Initialize the audit logging system
 */
export function initializeAuditLogging(context: vscode.ExtensionContext): void {
  // Load configuration
  loadConfig();

  // Store extension version
  const ext = vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture');
  if (ext) {
    extensionVersion = ext.packageJSON.version;
  }

  // Initialize file logging if enabled
  if (config.enabled && config.fileLogging) {
    initializeFileLogging(context);
  }

  // Start buffer flush interval
  flushInterval = setInterval(() => flushEventBuffer(), BUFFER_FLUSH_INTERVAL_MS);

  // Listen for config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('alex.enterprise.audit')) {
        loadConfig();
        if (config.fileLogging && !logFileStream) {
          initializeFileLogging(context);
        }
      }
    })
  );

  // Log system startup
  logAudit({
    category: 'system',
    action: 'extension.activated',
    outcome: 'success',
    details: {
      version: extensionVersion,
      workspaceCount: vscode.workspace.workspaceFolders?.length ?? 0,
    },
  });
}

/**
 * Load configuration from VS Code settings
 */
function loadConfig(): void {
  const vsConfig = vscode.workspace.getConfiguration('alex.enterprise.audit');
  config = {
    enabled: vsConfig.get<boolean>('enabled', DEFAULT_CONFIG.enabled),
    fileLogging: vsConfig.get<boolean>('fileLogging', DEFAULT_CONFIG.fileLogging),
    logFilePath: vsConfig.get<string>('logFilePath'),
    consoleLogging: vsConfig.get<boolean>('consoleLogging', DEFAULT_CONFIG.consoleLogging),
    remoteLogging: vsConfig.get<boolean>('remoteLogging', DEFAULT_CONFIG.remoteLogging),
    remoteEndpoint: vsConfig.get<string>('remoteEndpoint'),
    minLevel: vsConfig.get<'debug' | 'info' | 'warn' | 'error'>('minLevel', DEFAULT_CONFIG.minLevel),
    retentionDays: vsConfig.get<number>('retentionDays', DEFAULT_CONFIG.retentionDays),
    categories: vsConfig.get<AuditCategory[]>('categories', DEFAULT_CONFIG.categories),
    redactSensitive: vsConfig.get<boolean>('redactSensitive', DEFAULT_CONFIG.redactSensitive),
  };
}

/**
 * Initialize file-based logging
 */
function initializeFileLogging(context: vscode.ExtensionContext): void {
  const logDir = config.logFilePath || path.join(context.globalStorageUri.fsPath, 'audit-logs');

  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Create log file with date stamp
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logDir, `alex-audit-${date}.jsonl`);

  logFileStream = fs.createWriteStream(logFile, { flags: 'a' });

  // Clean up old logs
  cleanupOldLogs(logDir);
}

/**
 * Clean up logs older than retention period
 */
function cleanupOldLogs(logDir: string): void {
  const cutoff = Date.now() - config.retentionDays * 24 * 60 * 60 * 1000;

  try {
    const files = fs.readdirSync(logDir);
    for (const file of files) {
      if (!file.startsWith('alex-audit-')) {continue;}

      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);

      if (stats.mtimeMs < cutoff) {
        fs.unlinkSync(filePath);
        console.log(`[Audit] Cleaned up old log: ${file}`);
      }
    }
  } catch (error) {
    console.error('[Audit] Error cleaning up old logs:', error);
  }
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Log an audit event
 */
export function logAudit(params: {
  category: AuditCategory;
  action: string;
  outcome?: 'success' | 'failure' | 'unknown';
  target?: AuditTarget;
  details?: Record<string, unknown>;
  actor?: Partial<AuditActor>;
}): void {
  if (!config.enabled) {return;}
  if (!config.categories.includes(params.category)) {return;}

  const event: AuditEvent = {
    id: generateEventId(),
    timestamp: new Date().toISOString(),
    category: params.category,
    action: params.action,
    outcome: params.outcome || 'success',
    actor: {
      id: params.actor?.id || 'anonymous',
      name: params.actor?.name || 'Anonymous User',
      email: params.actor?.email,
      tenantId: params.actor?.tenantId,
      roles: params.actor?.roles,
    },
    target: params.target,
    details: config.redactSensitive ? redactDetails(params.details) : params.details,
    context: {
      sessionId,
      workspaceId: vscode.workspace.workspaceFolders?.[0]?.name,
      extensionVersion,
    },
  };

  // Add to buffer
  eventBuffer.push(event);

  // Console logging
  if (config.consoleLogging) {
    console.log('[AUDIT]', JSON.stringify(event));
  }

  // Flush if buffer is full
  if (eventBuffer.length >= BUFFER_FLUSH_SIZE) {
    flushEventBuffer();
  }
}

/**
 * Flush the event buffer to storage
 */
async function flushEventBuffer(): Promise<void> {
  if (eventBuffer.length === 0) {return;}

  const events = [...eventBuffer];
  eventBuffer = [];

  // File logging
  if (config.fileLogging && logFileStream) {
    for (const event of events) {
      logFileStream.write(JSON.stringify(event) + '\n');
    }
  }

  // Remote logging
  if (config.remoteLogging && config.remoteEndpoint) {
    try {
      await sendToRemote(events);
    } catch (error) {
      console.error('[Audit] Failed to send events to remote:', error);
      // Re-add failed events to buffer for retry
      eventBuffer.unshift(...events);
    }
  }
}

/**
 * Send events to remote endpoint
 */
async function sendToRemote(events: AuditEvent[]): Promise<void> {
  if (!config.remoteEndpoint) {return;}

  const response = await fetch(config.remoteEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Alex-Session': sessionId,
    },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    throw new Error(`Remote logging failed: ${response.status}`);
  }
}

/**
 * Redact sensitive information from details
 */
function redactDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) {return undefined;}

  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'credential', 'auth'];
  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'string' && value.length > 100) {
      redacted[key] = value.substring(0, 100) + '...[truncated]';
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

// Convenience logging functions
export const audit = {
  auth: (action: string, details?: Record<string, unknown>, outcome?: 'success' | 'failure') => {
    logAudit({ category: 'auth', action, details, outcome });
  },

  access: (target: AuditTarget, action: string, details?: Record<string, unknown>) => {
    logAudit({ category: 'access', action, target, details });
  },

  modify: (target: AuditTarget, action: string, details?: Record<string, unknown>) => {
    logAudit({ category: 'modify', action, target, details });
  },

  cognitive: (action: string, details?: Record<string, unknown>) => {
    logAudit({ category: 'cognitive', action, details });
  },

  knowledge: (action: string, target?: AuditTarget, details?: Record<string, unknown>) => {
    logAudit({ category: 'knowledge', action, target, details });
  },

  config: (action: string, details?: Record<string, unknown>) => {
    logAudit({ category: 'config', action, details });
  },

  system: (action: string, details?: Record<string, unknown>, outcome?: 'success' | 'failure') => {
    logAudit({ category: 'system', action, details, outcome });
  },
};

/**
 * Register audit log commands
 */
export function registerAuditCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.enterprise.viewAuditLog', async () => {
      if (!config.fileLogging || !config.logFilePath && !context.globalStorageUri) {
        vscode.window.showWarningMessage('Audit file logging is not configured.');
        return;
      }

      const logDir = config.logFilePath || path.join(context.globalStorageUri.fsPath, 'audit-logs');

      if (!fs.existsSync(logDir)) {
        vscode.window.showInformationMessage('No audit logs found.');
        return;
      }

      const files = fs.readdirSync(logDir)
        .filter((f) => f.startsWith('alex-audit-'))
        .sort()
        .reverse();

      if (files.length === 0) {
        vscode.window.showInformationMessage('No audit logs found.');
        return;
      }

      const selected = await vscode.window.showQuickPick(files, {
        placeHolder: 'Select an audit log to view',
      });

      if (selected) {
        const logPath = path.join(logDir, selected);
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(logPath));
        await vscode.window.showTextDocument(doc);
      }
    }),

    vscode.commands.registerCommand('alex.enterprise.exportAuditLog', async () => {
      const logDir = config.logFilePath || path.join(context.globalStorageUri.fsPath, 'audit-logs');

      if (!fs.existsSync(logDir)) {
        vscode.window.showInformationMessage('No audit logs to export.');
        return;
      }

      const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(`alex-audit-export-${new Date().toISOString().split('T')[0]}.json`),
        filters: { 'JSON': ['json'] },
      });

      if (!saveUri) {return;}

      // Combine all logs
      const files = fs.readdirSync(logDir).filter((f) => f.startsWith('alex-audit-'));
      const allEvents: AuditEvent[] = [];

      for (const file of files) {
        const content = fs.readFileSync(path.join(logDir, file), 'utf8');
        const lines = content.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            allEvents.push(JSON.parse(line));
          } catch {
            // Skip malformed lines
          }
        }
      }

      // Sort by timestamp
      allEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Write export
      fs.writeFileSync(saveUri.fsPath, JSON.stringify({ exportedAt: new Date().toISOString(), events: allEvents }, null, 2));

      vscode.window.showInformationMessage(`Exported ${allEvents.length} audit events.`);
    })
  );
}

/**
 * Dispose audit logging resources
 */
export function disposeAuditLogging(): void {
  // Flush remaining events
  flushEventBuffer();

  // Clear interval
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }

  // Close file stream
  if (logFileStream) {
    logFileStream.end();
    logFileStream = null;
  }
}
