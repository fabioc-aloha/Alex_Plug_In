/**
 * Enterprise Module Index
 *
 * Exports all enterprise features for Alex Cognitive Architecture.
 *
 * @module enterprise
 * @version 5.3.0
 */

export * from './enterpriseAuth';
export * from './secretsScanning';
export * from './auditLogging';
export * from './microsoftGraph';

import * as vscode from 'vscode';
import {
  registerEnterpriseAuthCommands,
  disposeEnterpriseAuth,
  isEnterpriseMode,
} from './enterpriseAuth';
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
import { registerGraphTestCommand } from './microsoftGraph';

/**
 * Initialize all enterprise features
 */
export function initializeEnterprise(context: vscode.ExtensionContext): void {
  // Initialize audit logging first (for logging other initialization)
  initializeAuditLogging(context);

  // Initialize secrets scanning
  initializeSecretsDiagnostics(context);

  // Register commands
  registerEnterpriseAuthCommands(context);
  registerSecretsCommands(context);
  registerAuditCommands(context);
  registerGraphTestCommand(context);

  // Log enterprise initialization
  audit.system('enterprise.initialized', {
    enterpriseMode: isEnterpriseMode(),
  });

  console.log('[Alex] Enterprise features initialized');
}

/**
 * Dispose all enterprise resources
 */
export function disposeEnterprise(): void {
  disposeEnterpriseAuth();
  disposeSecretsDiagnostics();
  disposeAuditLogging();
}
