/**
 * Enterprise Module Index
 *
 * Exports all enterprise features for Alex Cognitive Architecture.
 *
 * @module enterprise
 * @version 5.3.0
 */

export * from './secretsScanning';
export * from './auditLogging';

import * as vscode from 'vscode';
import {
  registerSecretsCommands,
  initializeSecretsDiagnostics,
  disposeSecretsDiagnostics,
} from './secretsScanning';
import {
  initializeAuditLogging,
  registerAuditCommands,
  disposeAuditLogging,
  audit,
} from './auditLogging';

/**
 * Initialize enterprise security features (secrets scanning and audit logging)
 */
export function initializeEnterprise(context: vscode.ExtensionContext): void {
  // Initialize audit logging first (for logging other initialization)
  initializeAuditLogging(context);

  // Initialize secrets scanning
  initializeSecretsDiagnostics(context);

  // Register commands
  registerSecretsCommands(context);
  registerAuditCommands(context);

  // Log enterprise initialization
  audit.system('enterprise.initialized', {});

  console.log('[Alex] Enterprise security features initialized (secrets scanning & audit logging)');
}

/**
 * Dispose all enterprise resources
 */
export function disposeEnterprise(): void {
  disposeSecretsDiagnostics();
  disposeAuditLogging();
}
