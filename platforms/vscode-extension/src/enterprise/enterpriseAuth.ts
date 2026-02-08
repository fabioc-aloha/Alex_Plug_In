/**
 * Enterprise Authentication Module - Entra ID SSO
 *
 * Provides Microsoft Entra ID (Azure AD) authentication for enterprise users.
 * Uses VS Code's built-in Microsoft authentication provider.
 *
 * @module enterprise/enterpriseAuth
 * @version 5.3.0
 */

import * as vscode from 'vscode';

// Entra ID scopes for Alex enterprise features
const ALEX_SCOPES = [
  'User.Read', // Basic profile info
  'offline_access', // Refresh tokens
];

// Optional Graph API scopes (for future v5.5.0 integration)
const GRAPH_SCOPES = [
  'Calendars.Read',
  'Mail.Read',
  'Tasks.ReadWrite',
];

export interface EnterpriseUser {
  id: string;
  displayName: string;
  email: string;
  tenantId?: string;
  roles: EnterpriseRole[];
  accessToken: string;
  expiresAt: Date;
}

export type EnterpriseRole = 'viewer' | 'contributor' | 'admin' | 'owner';

export interface EnterpriseAuthConfig {
  /** Enable enterprise authentication */
  enabled: boolean;
  /** Require authentication for all operations */
  requireAuth: boolean;
  /** Minimum role required for write operations */
  minWriteRole: EnterpriseRole;
  /** Allowed tenant IDs (empty = any tenant) */
  allowedTenants: string[];
  /** Enable audit logging */
  auditEnabled: boolean;
}

let currentUser: EnterpriseUser | null = null;
let authStatusBar: vscode.StatusBarItem | null = null;

/**
 * Get the current enterprise configuration
 */
export function getEnterpriseConfig(): EnterpriseAuthConfig {
  const config = vscode.workspace.getConfiguration('alex.enterprise');
  return {
    enabled: config.get<boolean>('enabled', false),
    requireAuth: config.get<boolean>('requireAuth', false),
    minWriteRole: config.get<EnterpriseRole>('minWriteRole', 'contributor'),
    allowedTenants: config.get<string[]>('allowedTenants', []),
    auditEnabled: config.get<boolean>('auditEnabled', true),
  };
}

/**
 * Check if enterprise mode is enabled
 */
export function isEnterpriseMode(): boolean {
  return getEnterpriseConfig().enabled;
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): EnterpriseUser | null {
  return currentUser;
}

/**
 * Check if user has the required role
 */
export function hasRole(requiredRole: EnterpriseRole): boolean {
  if (!currentUser) return false;

  const roleHierarchy: EnterpriseRole[] = ['viewer', 'contributor', 'admin', 'owner'];
  const userMaxRole = Math.max(...currentUser.roles.map((r) => roleHierarchy.indexOf(r)));
  const requiredIndex = roleHierarchy.indexOf(requiredRole);

  return userMaxRole >= requiredIndex;
}

/**
 * Check if user can perform write operations
 */
export function canWrite(): boolean {
  const config = getEnterpriseConfig();
  if (!config.enabled) return true; // No restrictions in non-enterprise mode
  if (!config.requireAuth) return true; // Auth not required

  return hasRole(config.minWriteRole);
}

/**
 * Authenticate with Microsoft Entra ID
 */
export async function authenticateWithEntraId(
  options: { silent?: boolean; scopes?: string[] } = {}
): Promise<EnterpriseUser | null> {
  const config = getEnterpriseConfig();
  if (!config.enabled) {
    vscode.window.showWarningMessage('Enterprise mode is not enabled. Enable it in settings first.');
    return null;
  }

  const scopes = options.scopes || ALEX_SCOPES;

  try {
    // Use VS Code's built-in Microsoft authentication provider
    const session = await vscode.authentication.getSession('microsoft', scopes, {
      createIfNone: !options.silent,
      silent: options.silent,
    });

    if (!session) {
      if (!options.silent) {
        vscode.window.showWarningMessage('Authentication cancelled or failed.');
      }
      return null;
    }

    // Parse the access token to extract claims (basic JWT parsing)
    const tokenParts = session.accessToken.split('.');
    let claims: Record<string, unknown> = {};
    if (tokenParts.length === 3) {
      try {
        claims = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
      } catch {
        // Token parsing failed, use session info
      }
    }

    const tenantId = (claims['tid'] as string) || undefined;

    // Check tenant restrictions
    if (config.allowedTenants.length > 0 && tenantId) {
      if (!config.allowedTenants.includes(tenantId)) {
        vscode.window.showErrorMessage(
          `Access denied. Your organization (${tenantId}) is not authorized to use Alex Enterprise.`
        );
        return null;
      }
    }

    // Determine roles (in real implementation, query Graph API or custom backend)
    const roles = determineUserRoles(claims);

    currentUser = {
      id: session.account.id,
      displayName: session.account.label,
      email: (claims['preferred_username'] as string) || session.account.label,
      tenantId,
      roles,
      accessToken: session.accessToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // Default 1 hour
    };

    updateStatusBar();

    // Log authentication event
    if (config.auditEnabled) {
      logAuditEvent('auth.login', {
        userId: currentUser.id,
        email: currentUser.email,
        tenantId: currentUser.tenantId,
      });
    }

    vscode.window.showInformationMessage(`Welcome, ${currentUser.displayName}! 🔐`);
    return currentUser;
  } catch (error) {
    console.error('Entra ID authentication error:', error);
    vscode.window.showErrorMessage(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return null;
  }
}

/**
 * Sign out from enterprise session
 */
export async function signOut(): Promise<void> {
  const config = getEnterpriseConfig();

  if (currentUser && config.auditEnabled) {
    logAuditEvent('auth.logout', {
      userId: currentUser.id,
      email: currentUser.email,
    });
  }

  currentUser = null;
  updateStatusBar();
  vscode.window.showInformationMessage('Signed out from Alex Enterprise.');
}

/**
 * Determine user roles from token claims
 * In production, this would query Graph API or a custom roles service
 */
function determineUserRoles(claims: Record<string, unknown>): EnterpriseRole[] {
  const roles: EnterpriseRole[] = ['viewer']; // Everyone gets viewer by default

  // Check for role claims (Azure AD app roles)
  const tokenRoles = claims['roles'] as string[] | undefined;
  if (tokenRoles) {
    if (tokenRoles.includes('Alex.Owner')) roles.push('owner');
    if (tokenRoles.includes('Alex.Admin')) roles.push('admin');
    if (tokenRoles.includes('Alex.Contributor')) roles.push('contributor');
  }

  // Check for group claims (security groups)
  const groups = claims['groups'] as string[] | undefined;
  // In production, map group IDs to roles via configuration

  return [...new Set(roles)]; // Deduplicate
}

/**
 * Update the status bar with auth status
 */
function updateStatusBar(): void {
  if (!authStatusBar) {
    authStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    authStatusBar.command = 'alex.enterprise.showAuthStatus';
  }

  if (currentUser) {
    authStatusBar.text = `$(shield) ${currentUser.displayName}`;
    authStatusBar.tooltip = `Signed in as ${currentUser.email}\nRoles: ${currentUser.roles.join(', ')}`;
    authStatusBar.backgroundColor = undefined;
  } else if (isEnterpriseMode()) {
    authStatusBar.text = '$(shield) Sign In';
    authStatusBar.tooltip = 'Click to sign in with Microsoft';
    authStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    authStatusBar.hide();
    return;
  }

  authStatusBar.show();
}

/**
 * Simple audit log (will be enhanced in auditLogging.ts)
 */
function logAuditEvent(event: string, data: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...data,
  };
  console.log('[AUDIT]', JSON.stringify(entry));
  // In production, send to audit service or file
}

/**
 * Register enterprise authentication commands
 */
export function registerEnterpriseAuthCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.enterprise.signIn', async () => {
      await authenticateWithEntraId();
    }),

    vscode.commands.registerCommand('alex.enterprise.signOut', async () => {
      await signOut();
    }),

    vscode.commands.registerCommand('alex.enterprise.showAuthStatus', async () => {
      if (!currentUser) {
        const action = await vscode.window.showInformationMessage(
          'Not signed in to Alex Enterprise',
          'Sign In',
          'Enable Enterprise Mode'
        );
        if (action === 'Sign In') {
          await authenticateWithEntraId();
        } else if (action === 'Enable Enterprise Mode') {
          await vscode.commands.executeCommand('workbench.action.openSettings', 'alex.enterprise.enabled');
        }
        return;
      }

      const roleList = currentUser.roles.join(', ');
      const message = [
        `**${currentUser.displayName}**`,
        `Email: ${currentUser.email}`,
        currentUser.tenantId ? `Tenant: ${currentUser.tenantId}` : '',
        `Roles: ${roleList}`,
        `Session expires: ${currentUser.expiresAt.toLocaleTimeString()}`,
      ]
        .filter(Boolean)
        .join('\n');

      const action = await vscode.window.showInformationMessage(
        `Signed in as ${currentUser.displayName} (${roleList})`,
        'Sign Out',
        'Refresh Token'
      );

      if (action === 'Sign Out') {
        await signOut();
      } else if (action === 'Refresh Token') {
        await authenticateWithEntraId({ silent: true });
        vscode.window.showInformationMessage('Token refreshed.');
      }
    }),

    // Listen for configuration changes
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('alex.enterprise')) {
        updateStatusBar();
      }
    })
  );

  // Initialize status bar on activation
  updateStatusBar();

  // Try silent auth on startup if enterprise mode is enabled
  const config = getEnterpriseConfig();
  if (config.enabled && config.requireAuth) {
    authenticateWithEntraId({ silent: true }).catch(() => {
      // Silent auth failed, user will need to sign in manually
    });
  }
}

/**
 * Dispose resources
 */
export function disposeEnterpriseAuth(): void {
  authStatusBar?.dispose();
  authStatusBar = null;
  currentUser = null;
}
