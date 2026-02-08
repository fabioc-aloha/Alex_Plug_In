/**
 * Secrets Scanning & PII Detection Module
 *
 * Scans content for sensitive data before it's processed or stored.
 * Prevents accidental exposure of secrets, API keys, and personal information.
 *
 * @module enterprise/secretsScanning
 * @version 5.3.0
 */

import * as vscode from 'vscode';

export interface ScanResult {
  hasSensitiveData: boolean;
  findings: SensitiveDataFinding[];
  scannedAt: Date;
  contentHash: string;
}

export interface SensitiveDataFinding {
  type: SensitiveDataType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  line?: number;
  column?: number;
  matchedPattern: string;
  redactedValue: string;
}

export type SensitiveDataType =
  | 'api_key'
  | 'aws_access_key'
  | 'aws_secret_key'
  | 'azure_connection_string'
  | 'azure_storage_key'
  | 'private_key'
  | 'password'
  | 'jwt_token'
  | 'credit_card'
  | 'ssn'
  | 'email_pii'
  | 'phone_number'
  | 'ip_address'
  | 'github_token'
  | 'npm_token'
  | 'slack_token'
  | 'openai_key'
  | 'anthropic_key'
  | 'google_api_key';

interface PatternDefinition {
  type: SensitiveDataType;
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

// Comprehensive patterns for secret detection
const PATTERNS: PatternDefinition[] = [
  // API Keys & Tokens
  {
    type: 'openai_key',
    pattern: /sk-[a-zA-Z0-9]{20,}/g,
    severity: 'critical',
    description: 'OpenAI API key detected',
  },
  {
    type: 'anthropic_key',
    pattern: /sk-ant-[a-zA-Z0-9-]{20,}/g,
    severity: 'critical',
    description: 'Anthropic API key detected',
  },
  {
    type: 'github_token',
    pattern: /gh[ps]_[A-Za-z0-9]{36,}/g,
    severity: 'critical',
    description: 'GitHub token detected',
  },
  {
    type: 'npm_token',
    pattern: /npm_[A-Za-z0-9]{36}/g,
    severity: 'critical',
    description: 'NPM token detected',
  },
  {
    type: 'slack_token',
    pattern: /xox[baprs]-[0-9A-Za-z-]{10,}/g,
    severity: 'high',
    description: 'Slack token detected',
  },
  {
    type: 'google_api_key',
    pattern: /AIza[0-9A-Za-z-_]{35}/g,
    severity: 'high',
    description: 'Google API key detected',
  },

  // AWS
  {
    type: 'aws_access_key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical',
    description: 'AWS Access Key ID detected',
  },
  {
    type: 'aws_secret_key',
    pattern: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
    severity: 'high',
    description: 'Potential AWS Secret Access Key detected',
  },

  // Azure
  {
    type: 'azure_connection_string',
    pattern: /DefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[^;]+/gi,
    severity: 'critical',
    description: 'Azure Storage connection string detected',
  },
  {
    type: 'azure_storage_key',
    pattern: /(?<![A-Za-z0-9+/=])[A-Za-z0-9+/]{86}==(?![A-Za-z0-9+/=])/g,
    severity: 'high',
    description: 'Azure Storage key detected',
  },

  // Private Keys
  {
    type: 'private_key',
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    severity: 'critical',
    description: 'Private key detected',
  },

  // JWT Tokens
  {
    type: 'jwt_token',
    pattern: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
    severity: 'high',
    description: 'JWT token detected',
  },

  // Generic API Key patterns
  {
    type: 'api_key',
    pattern: /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?/gi,
    severity: 'high',
    description: 'Generic API key detected',
  },

  // Passwords in config
  {
    type: 'password',
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"]?([^'"\\s]{8,})['"]?/gi,
    severity: 'high',
    description: 'Password in configuration detected',
  },

  // PII - Credit Cards
  {
    type: 'credit_card',
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g,
    severity: 'critical',
    description: 'Credit card number detected',
  },

  // PII - SSN (US)
  {
    type: 'ssn',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    severity: 'critical',
    description: 'Social Security Number detected',
  },

  // PII - Email addresses (context-dependent)
  {
    type: 'email_pii',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: 'low',
    description: 'Email address detected',
  },

  // PII - Phone numbers
  {
    type: 'phone_number',
    pattern: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
    severity: 'medium',
    description: 'Phone number detected',
  },

  // IP Addresses (private ranges are lower severity)
  {
    type: 'ip_address',
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    severity: 'low',
    description: 'IP address detected',
  },
];

// Allowlist patterns (things that look like secrets but aren't)
const ALLOWLIST_PATTERNS = [
  /example\.com/gi,
  /placeholder/gi,
  /your[_-]?api[_-]?key/gi,
  /xxx+/gi,
  /\*{4,}/g,
  /test[_-]?key/gi,
  /dummy/gi,
  /sample/gi,
  /fake/gi,
];

/**
 * Scan content for sensitive data
 */
export function scanContent(content: string, options: { includeLowSeverity?: boolean } = {}): ScanResult {
  const findings: SensitiveDataFinding[] = [];
  const lines = content.split('\n');
  const contentHash = simpleHash(content);

  for (const patternDef of PATTERNS) {
    // Skip low severity if not requested
    if (patternDef.severity === 'low' && !options.includeLowSeverity) {
      continue;
    }

    // Reset regex state
    patternDef.pattern.lastIndex = 0;

    let match;
    while ((match = patternDef.pattern.exec(content)) !== null) {
      const matchedValue = match[0];

      // Check if this is an allowlisted pattern
      if (isAllowlisted(matchedValue)) {
        continue;
      }

      // Find line and column
      const position = findPosition(content, match.index);

      findings.push({
        type: patternDef.type,
        severity: patternDef.severity,
        description: patternDef.description,
        line: position.line,
        column: position.column,
        matchedPattern: patternDef.pattern.source,
        redactedValue: redactValue(matchedValue),
      });
    }
  }

  // Sort by severity (critical first)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    hasSensitiveData: findings.length > 0,
    findings,
    scannedAt: new Date(),
    contentHash,
  };
}

/**
 * Scan a file for sensitive data
 */
export async function scanFile(uri: vscode.Uri): Promise<ScanResult> {
  try {
    const content = await vscode.workspace.fs.readFile(uri);
    return scanContent(new TextDecoder().decode(content));
  } catch (error) {
    console.error(`Error scanning file ${uri.fsPath}:`, error);
    return {
      hasSensitiveData: false,
      findings: [],
      scannedAt: new Date(),
      contentHash: '',
    };
  }
}

/**
 * Redact sensitive content for safe logging/display
 */
export function redactContent(content: string): string {
  let redacted = content;

  for (const patternDef of PATTERNS) {
    patternDef.pattern.lastIndex = 0;
    redacted = redacted.replace(patternDef.pattern, (match) => {
      if (isAllowlisted(match)) {
        return match;
      }
      return redactValue(match);
    });
  }

  return redacted;
}

/**
 * Check if a value should be allowlisted
 */
function isAllowlisted(value: string): boolean {
  return ALLOWLIST_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Redact a sensitive value
 */
function redactValue(value: string): string {
  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }
  const visibleStart = value.slice(0, 4);
  const visibleEnd = value.slice(-4);
  const hidden = '*'.repeat(Math.min(value.length - 8, 20));
  return `${visibleStart}${hidden}${visibleEnd}`;
}

/**
 * Find line and column for a position in content
 */
function findPosition(content: string, index: number): { line: number; column: number } {
  const lines = content.substring(0, index).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Simple hash function for content comparison
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Create a diagnostic collection for secrets warnings
 */
let diagnosticCollection: vscode.DiagnosticCollection | null = null;

export function initializeSecretsDiagnostics(context: vscode.ExtensionContext): void {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('alex-secrets');
  context.subscriptions.push(diagnosticCollection);

  // Scan on document change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (shouldScanDocument(e.document)) {
        scanDocument(e.document);
      }
    })
  );

  // Scan on document open
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (shouldScanDocument(doc)) {
        scanDocument(doc);
      }
    })
  );

  // Scan all open documents on activation
  for (const doc of vscode.workspace.textDocuments) {
    if (shouldScanDocument(doc)) {
      scanDocument(doc);
    }
  }
}

/**
 * Determine if a document should be scanned
 */
function shouldScanDocument(doc: vscode.TextDocument): boolean {
  // Skip very large files
  if (doc.lineCount > 10000) return false;

  // Skip binary files
  const binaryExtensions = ['.png', '.jpg', '.gif', '.pdf', '.zip', '.exe'];
  if (binaryExtensions.some((ext) => doc.fileName.endsWith(ext))) return false;

  // Skip output/debug panels
  if (doc.uri.scheme !== 'file') return false;

  return true;
}

/**
 * Scan a document and update diagnostics
 */
function scanDocument(doc: vscode.TextDocument): void {
  if (!diagnosticCollection) return;

  const result = scanContent(doc.getText(), { includeLowSeverity: false });

  const diagnostics: vscode.Diagnostic[] = result.findings.map((finding) => {
    const line = finding.line ? finding.line - 1 : 0;
    const col = finding.column ? finding.column - 1 : 0;

    const range = new vscode.Range(line, col, line, col + finding.redactedValue.length);

    const severity =
      finding.severity === 'critical'
        ? vscode.DiagnosticSeverity.Error
        : finding.severity === 'high'
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information;

    const diagnostic = new vscode.Diagnostic(
      range,
      `🔐 ${finding.description}: ${finding.redactedValue}`,
      severity
    );

    diagnostic.source = 'Alex Security';
    diagnostic.code = finding.type;

    return diagnostic;
  });

  diagnosticCollection.set(doc.uri, diagnostics);
}

/**
 * Register secrets scanning commands
 */
export function registerSecretsCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.enterprise.scanSecrets', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor to scan.');
        return;
      }

      const result = scanContent(editor.document.getText(), { includeLowSeverity: true });

      if (result.findings.length === 0) {
        vscode.window.showInformationMessage('✅ No sensitive data detected in this file.');
        return;
      }

      const critical = result.findings.filter((f) => f.severity === 'critical').length;
      const high = result.findings.filter((f) => f.severity === 'high').length;
      const other = result.findings.length - critical - high;

      const message = `🔐 Found ${result.findings.length} potential secrets: ${critical} critical, ${high} high, ${other} other`;

      const action = await vscode.window.showWarningMessage(message, 'Show Details', 'Ignore');

      if (action === 'Show Details') {
        // Show findings in output channel
        const output = vscode.window.createOutputChannel('Alex Security Scan');
        output.clear();
        output.appendLine(`Security Scan Results - ${new Date().toISOString()}`);
        output.appendLine(`File: ${editor.document.fileName}`);
        output.appendLine(`Total findings: ${result.findings.length}`);
        output.appendLine('');

        for (const finding of result.findings) {
          output.appendLine(`[${finding.severity.toUpperCase()}] ${finding.description}`);
          output.appendLine(`  Line ${finding.line}, Column ${finding.column}`);
          output.appendLine(`  Redacted: ${finding.redactedValue}`);
          output.appendLine('');
        }

        output.show();
      }
    }),

    vscode.commands.registerCommand('alex.enterprise.scanWorkspace', async () => {
      const files = await vscode.workspace.findFiles(
        '**/*.{ts,js,json,yaml,yml,env,properties,config}',
        '**/node_modules/**',
        100
      );

      if (files.length === 0) {
        vscode.window.showInformationMessage('No scannable files found in workspace.');
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Scanning workspace for secrets...',
          cancellable: true,
        },
        async (progress, token) => {
          let scanned = 0;
          let totalFindings = 0;
          const criticalFiles: string[] = [];

          for (const file of files) {
            if (token.isCancellationRequested) break;

            progress.report({
              message: `Scanning ${file.fsPath.split(/[\\/]/).pop()}...`,
              increment: (100 / files.length),
            });

            const result = await scanFile(file);
            if (result.hasSensitiveData) {
              totalFindings += result.findings.length;
              if (result.findings.some((f) => f.severity === 'critical')) {
                criticalFiles.push(file.fsPath);
              }
            }
            scanned++;
          }

          if (totalFindings === 0) {
            vscode.window.showInformationMessage(`✅ Scanned ${scanned} files. No secrets detected.`);
          } else {
            vscode.window.showWarningMessage(
              `🔐 Found ${totalFindings} potential secrets in ${criticalFiles.length} files.`,
              'Show Files'
            ).then((action) => {
              if (action === 'Show Files') {
                vscode.window.showQuickPick(criticalFiles, {
                  placeHolder: 'Select a file to open',
                }).then((selected) => {
                  if (selected) {
                    vscode.window.showTextDocument(vscode.Uri.file(selected));
                  }
                });
              }
            });
          }
        }
      );
    })
  );
}

/**
 * Dispose resources
 */
export function disposeSecretsDiagnostics(): void {
  diagnosticCollection?.dispose();
  diagnosticCollection = null;
}
