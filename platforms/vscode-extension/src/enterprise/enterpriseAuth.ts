/**
 * Enterprise Authentication Module - Entra ID SSO
 *
 * Provides Microsoft Entra ID (Azure AD) authentication for enterprise users.
 * Supports two authentication modes:
 * 1. VS Code's built-in Microsoft authentication provider (default)
 * 2. Custom Entra ID app registration via MSAL interactive browser flow
 *
 * Use custom app mode for corporate tenants that restrict first-party apps
 * (e.g., AADSTS65002 preauthorization errors).
 *
 * Based on AIRS Enterprise authentication patterns for:
 * - Persistent token caching across sessions
 * - Retry logic for transient failures
 * - Better handling of corporate tenant requirements
 *
 * @module enterprise/enterpriseAuth
 * @version 5.8.0
 */

import * as vscode from 'vscode';
import * as msal from '@azure/msal-node';

// Entra ID scopes for Alex enterprise features
const ALEX_SCOPES = [
  'User.Read', // Basic profile info
  'offline_access', // Refresh tokens
];

// Graph API scopes for v5.6.0 enterprise integration
const GRAPH_SCOPES = [
  'Calendars.Read', // Read calendar events
  'Mail.Read', // Read email messages
  'Presence.Read', // Read online/offline/busy status
  'People.Read', // Read frequent contacts
];

// Combined scopes for full enterprise functionality
const ALL_ENTERPRISE_SCOPES = [...ALEX_SCOPES, ...GRAPH_SCOPES];

// MSAL client for custom app authentication
let msalClient: msal.PublicClientApplication | null = null;
let msalTokenCache: msal.TokenCache | null = null;

// Extension context for persistent storage (set during registration)
let extensionContext: vscode.ExtensionContext | null = null;

// Token cache key for VS Code SecretStorage
const TOKEN_CACHE_KEY = 'alex.enterprise.tokenCache';

// Retry configuration for token acquisition (based on AIRS patterns)
const TOKEN_RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for async operations with exponential backoff
 * Based on AIRS resilient-fetch patterns
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  config = TOKEN_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | undefined;
  let delay = config.initialDelayMs;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message;

      // Don't retry on permanent errors
      if (
        errorMessage.includes('AADSTS65002') || // Preauthorization required
        errorMessage.includes('AADSTS700016') || // App not found
        errorMessage.includes('AADSTS90002') || // Tenant not found
        errorMessage.includes('user_cancelled')
      ) {
        throw lastError;
      }

      if (attempt < config.maxRetries) {
        console.log(`[Auth] ${operationName} failed (attempt ${attempt}/${config.maxRetries}), retrying in ${delay}ms...`);
        await sleep(delay);
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
      }
    }
  }

  throw lastError || new Error(`${operationName} failed after ${config.maxRetries} attempts`);
}

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
  /** Custom app authentication settings */
  auth: {
    /** Use custom Entra ID app instead of VS Code's built-in */
    useCustomApp: boolean;
    /** Custom app client ID */
    clientId: string;
    /** Custom app tenant ID */
    tenantId: string;
  };
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
    auth: {
      useCustomApp: config.get<boolean>('auth.useCustomApp', false),
      clientId: config.get<string>('auth.clientId', ''),
      tenantId: config.get<string>('auth.tenantId', 'common'),
    },
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
 * Supports both VS Code's built-in provider and custom app via MSAL
 */
export async function authenticateWithEntraId(
  options: { silent?: boolean; scopes?: string[]; includeGraphScopes?: boolean } = {}
): Promise<EnterpriseUser | null> {
  const config = getEnterpriseConfig();
  if (!config.enabled) {
    vscode.window.showWarningMessage('Enterprise mode is not enabled. Enable it in settings first.');
    return null;
  }

  // Default to all enterprise scopes (including Graph) for full functionality
  const scopes = options.scopes || (options.includeGraphScopes !== false ? ALL_ENTERPRISE_SCOPES : ALEX_SCOPES);

  // Use custom app authentication if configured
  if (config.auth.useCustomApp) {
    return authenticateWithCustomApp(config, scopes, options.silent);
  }

  // Fall back to VS Code's built-in Microsoft authentication provider
  return authenticateWithVSCodeProvider(config, scopes, options.silent);
}

/**
 * Authenticate using VS Code's built-in Microsoft provider
 */
async function authenticateWithVSCodeProvider(
  config: EnterpriseAuthConfig,
  scopes: string[],
  silent?: boolean
): Promise<EnterpriseUser | null> {
  try {
    // Use VS Code's built-in Microsoft authentication provider
    const session = await vscode.authentication.getSession('microsoft', scopes, {
      createIfNone: !silent,
      silent: silent,
    });

    if (!session) {
      if (!silent) {
        vscode.window.showWarningMessage('Authentication cancelled or failed.');
      }
      return null;
    }

    return processAuthResult(config, session.accessToken, session.account.id, session.account.label);
  } catch (error) {
    console.error('VS Code auth provider error:', error);
    vscode.window.showErrorMessage(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return null;
  }
}

/**
 * Create a persistent cache plugin using VS Code SecretStorage
 * Based on AIRS Enterprise patterns for cross-session token persistence
 */
function createVSCodeCachePlugin(): msal.ICachePlugin {
  return {
    beforeCacheAccess: async (cacheContext: msal.TokenCacheContext): Promise<void> => {
      if (!extensionContext) {
        console.log('[Auth] Extension context not available for cache access');
        return;
      }
      try {
        const cachedData = await extensionContext.secrets.get(TOKEN_CACHE_KEY);
        if (cachedData) {
          cacheContext.tokenCache.deserialize(cachedData);
          console.log('[Auth] Token cache loaded from SecretStorage');
        }
      } catch (error) {
        console.warn('[Auth] Failed to load token cache:', error);
      }
    },
    afterCacheAccess: async (cacheContext: msal.TokenCacheContext): Promise<void> => {
      if (!extensionContext) {
        return;
      }
      if (cacheContext.cacheHasChanged) {
        try {
          const serializedCache = cacheContext.tokenCache.serialize();
          await extensionContext.secrets.store(TOKEN_CACHE_KEY, serializedCache);
          console.log('[Auth] Token cache saved to SecretStorage');
        } catch (error) {
          console.warn('[Auth] Failed to save token cache:', error);
        }
      }
    },
  };
}

/**
 * Authenticate using custom Entra ID app via MSAL interactive browser flow
 * Uses localhost redirect to pass device compliance state for Conditional Access
 *
 * Improvements based on AIRS Enterprise patterns:
 * - Persistent token caching across sessions
 * - Retry logic for transient failures
 * - Better handling of corporate tenant requirements
 */
async function authenticateWithCustomApp(
  config: EnterpriseAuthConfig,
  scopes: string[],
  silent?: boolean
): Promise<EnterpriseUser | null> {
  if (!config.auth.clientId) {
    vscode.window.showErrorMessage(
      'Custom app authentication requires a client ID. Set alex.enterprise.auth.clientId in settings.'
    );
    return null;
  }

  try {
    // Initialize MSAL client if needed
    if (!msalClient) {
      console.log('[Auth] Initializing MSAL client with clientId:', config.auth.clientId.substring(0, 8) + '...');

      const msalConfig: msal.Configuration = {
        auth: {
          clientId: config.auth.clientId,
          authority: `https://login.microsoftonline.com/${config.auth.tenantId}`,
        },
        cache: {
          // Use persistent cache if extension context is available
          cachePlugin: extensionContext ? createVSCodeCachePlugin() : undefined,
        },
        system: {
          loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
              if (!containsPii) {
                const prefix = ['Error', 'Warning', 'Info', 'Verbose', 'Trace'][level] || 'Log';
                console.log(`[MSAL ${prefix}] ${message}`);
              }
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Warning,
          },
        },
      };
      msalClient = new msal.PublicClientApplication(msalConfig);
      msalTokenCache = msalClient.getTokenCache();
    }

    // Format scopes for Microsoft Graph (add resource prefix if needed)
    const formattedScopes = scopes.map((s) =>
      s.includes('/') || s === 'offline_access' ? s : `https://graph.microsoft.com/${s}`
    );
    console.log('[Auth] Requesting scopes:', formattedScopes.join(', '));

    // Try silent authentication first if we have cached accounts
    const accounts = await msalClient.getTokenCache().getAllAccounts();
    console.log('[Auth] Found', accounts.length, 'cached accounts');

    if (accounts.length > 0) {
      try {
        console.log('[Auth] Attempting silent token acquisition for:', accounts[0].username);

        // Use retry logic for silent auth (handles transient network issues)
        const silentResult = await withRetry(
          async () => {
            const silentRequest: msal.SilentFlowRequest = {
              account: accounts[0],
              scopes: formattedScopes,
              forceRefresh: false, // Only refresh if token is expired
            };
            return msalClient!.acquireTokenSilent(silentRequest);
          },
          'Silent token acquisition'
        );

        if (silentResult) {
          console.log('[Auth] Silent token acquisition successful');
          return processAuthResult(
            config,
            silentResult.accessToken,
            silentResult.account?.homeAccountId || 'unknown',
            silentResult.account?.username || 'User'
          );
        }
      } catch (silentError) {
        console.log('[Auth] Silent auth failed:', silentError instanceof Error ? silentError.message : 'Unknown');
        // Silent auth failed, proceed to interactive
        if (silent) {
          return null;
        }
      }
    }

    if (silent) {
      return null;
    }

    // Use interactive browser flow - opens system browser, listens on localhost
    // This passes device compliance state for Conditional Access policies
    vscode.window.showInformationMessage('Opening browser for sign-in... Complete authentication in your browser.');

    const interactiveRequest: msal.InteractiveRequest = {
      scopes: formattedScopes,
      openBrowser: async (url) => {
        console.log('[Auth] Opening browser for authentication...');
        // Open the auth URL in the system browser
        await vscode.env.openExternal(vscode.Uri.parse(url));
      },
      successTemplate: `
        <html>
          <head><title>Alex Authentication</title></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
              <h1 style="color: #22c55e; margin: 0 0 16px 0;">✓ Authentication Successful!</h1>
              <p style="color: #666; margin: 0;">You can close this window and return to VS Code.</p>
            </div>
          </body>
        </html>
      `,
      errorTemplate: `
        <html>
          <head><title>Alex Authentication</title></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
              <h1 style="color: #ef4444; margin: 0 0 16px 0;">✗ Authentication Failed</h1>
              <p style="color: #666; margin: 0;">Please close this window and try again in VS Code.</p>
            </div>
          </body>
        </html>
      `,
    };

    // Use retry logic for interactive auth (handles network/timing issues)
    const result = await withRetry(
      () => msalClient!.acquireTokenInteractive(interactiveRequest),
      'Interactive token acquisition'
    );

    if (!result) {
      vscode.window.showWarningMessage('Authentication cancelled or failed.');
      return null;
    }

    console.log('[Auth] Interactive authentication successful');
    return processAuthResult(
      config,
      result.accessToken,
      result.account?.homeAccountId || 'unknown',
      result.account?.username || result.account?.name || 'User'
    );
  } catch (error) {
    console.error('[Auth] MSAL authentication error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Provide helpful error messages based on AIRS error handling patterns
    if (errorMessage.includes('AADSTS65002')) {
      vscode.window.showErrorMessage(
        'Preauthorization required. Your IT admin needs to grant consent for this app. Share the client ID with them.',
        'Copy Client ID'
      ).then((action) => {
        if (action === 'Copy Client ID') {
          vscode.env.clipboard.writeText(config.auth.clientId);
          vscode.window.showInformationMessage('Client ID copied to clipboard.');
        }
      });
    } else if (errorMessage.includes('AADSTS700016')) {
      vscode.window.showErrorMessage(
        'Application not found. Check that your client ID is correct in settings.',
        'Open Settings'
      ).then((action) => {
        if (action === 'Open Settings') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'alex.enterprise.auth.clientId');
        }
      });
    } else if (errorMessage.includes('AADSTS90002')) {
      vscode.window.showErrorMessage(
        'Tenant not found. Check that your tenant ID is correct in settings.',
        'Open Settings'
      ).then((action) => {
        if (action === 'Open Settings') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'alex.enterprise.auth.tenantId');
        }
      });
    } else if (errorMessage.includes('AADSTS50076') || errorMessage.includes('AADSTS50079')) {
      // MFA required - these are not errors, just additional auth steps
      vscode.window.showInformationMessage(
        'Multi-factor authentication required. Please complete MFA in your browser.'
      );
    } else if (errorMessage.includes('530003') || errorMessage.includes('managed') || errorMessage.includes('compliant')) {
      vscode.window.showErrorMessage(
        'Device compliance required. Make sure you\'re signing in from your managed/compliant device. The redirect URI http://localhost must be registered in your Entra ID app.',
        'View App Registration Guide'
      ).then((action) => {
        if (action === 'View App Registration Guide') {
          vscode.env.openExternal(vscode.Uri.parse('https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app'));
        }
      });
    } else if (errorMessage.includes('AADSTS50011')) {
      vscode.window.showErrorMessage(
        'Reply URL mismatch. Ensure http://localhost is registered as a redirect URI in your Entra ID app registration.'
      );
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT') || errorMessage.includes('ECONNREFUSED')) {
      vscode.window.showErrorMessage(
        'Network timeout. Please check your internet connection and try again.'
      );
    } else if (errorMessage.includes('user_cancelled') || errorMessage.includes('cancelled')) {
      // User cancelled - not really an error
      vscode.window.showInformationMessage('Sign-in was cancelled.');
    } else {
      vscode.window.showErrorMessage(`Authentication failed: ${errorMessage}`);
    }
    return null;
  }
}

/**
 * Process authentication result and create user object
 */
async function processAuthResult(
  config: EnterpriseAuthConfig,
  accessToken: string,
  accountId: string,
  displayName: string
): Promise<EnterpriseUser | null> {
  // Parse the access token to extract claims (basic JWT parsing)
  const tokenParts = accessToken.split('.');
  let claims: Record<string, unknown> = {};
  if (tokenParts.length === 3) {
    try {
      claims = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
    } catch {
      // Token parsing failed, use provided info
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
    id: accountId,
    displayName: displayName,
    email: (claims['preferred_username'] as string) || (claims['upn'] as string) || displayName,
    tenantId,
    roles,
    accessToken: accessToken,
    expiresAt: new Date(Date.now() + 3600 * 1000), // Default 1 hour
  };

  updateStatusBar();

  // Log authentication event
  if (config.auditEnabled) {
    logAuditEvent('auth.login', {
      userId: currentUser.id,
      email: currentUser.email,
      tenantId: currentUser.tenantId,
      authMethod: config.auth.useCustomApp ? 'custom-app' : 'vscode-provider',
    });
  }

  vscode.window.showInformationMessage(`Welcome, ${currentUser.displayName}! 🔐`);
  return currentUser;
}

/**
 * Sign out from enterprise session
 * Clears both in-memory cache and persistent SecretStorage cache
 */
export async function signOut(): Promise<void> {
  const config = getEnterpriseConfig();

  if (currentUser && config.auditEnabled) {
    logAuditEvent('auth.logout', {
      userId: currentUser.id,
      email: currentUser.email,
      authMethod: config.auth.useCustomApp ? 'custom-app' : 'vscode-provider',
    });
  }

  // Clear MSAL cache if using custom app
  if (config.auth.useCustomApp && msalClient) {
    try {
      const accounts = await msalClient.getTokenCache().getAllAccounts();
      for (const account of accounts) {
        await msalClient.getTokenCache().removeAccount(account);
      }
      console.log('[Auth] MSAL in-memory cache cleared');
    } catch (error) {
      console.warn('[Auth] Failed to clear MSAL cache:', error);
    }
  }

  // Clear persistent cache from SecretStorage
  if (extensionContext) {
    try {
      await extensionContext.secrets.delete(TOKEN_CACHE_KEY);
      console.log('[Auth] Persistent token cache cleared');
    } catch (error) {
      console.warn('[Auth] Failed to clear persistent cache:', error);
    }
  }

  // Reset MSAL client to force re-initialization on next login
  msalClient = null;
  msalTokenCache = null;

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
  // Store extension context for persistent cache plugin
  extensionContext = context;
  console.log('[Auth] Enterprise auth commands registered with persistent cache support');

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
  msalClient = null;
  msalTokenCache = null;
  extensionContext = null;
  console.log('[Auth] Enterprise auth resources disposed');
}
