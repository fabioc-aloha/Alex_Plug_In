import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Centralized secrets management for Alex extension
 * Uses VS Code SecretStorage API for secure token storage
 */

// Secret storage keys
const SECRETS = {
    GITHUB_TOKEN: 'alex.secrets.githubToken',
    GAMMA_API_KEY: 'alex.secrets.gammaApiKey',
    REPLICATE_API_TOKEN: 'alex.secrets.replicateApiToken',
    OPENAI_API_KEY: 'alex.secrets.openaiApiKey',
    ANTHROPIC_API_KEY: 'alex.secrets.anthropicApiKey',
} as const;

/** Module-level reference to VS Code SecretStorage */
let secretStorage: vscode.SecretStorage | null = null;

/** Cached tokens for synchronous access */
const tokenCache: Map<string, string | null> = new Map();

/**
 * Token configuration metadata
 */
export interface TokenConfig {
    key: string;
    displayName: string;
    description: string;
    getUrl?: string;
    placeholder?: string;
    envVar?: string; // Environment variable name for backward compatibility
}

/**
 * Available token configurations
 */
export const TOKEN_CONFIGS: Record<string, TokenConfig> = {
    GITHUB_TOKEN: {
        key: SECRETS.GITHUB_TOKEN,
        displayName: 'GitHub Token',
        description: 'Personal access token for Global Knowledge repository access',
        getUrl: 'https://github.com/settings/tokens/new?description=Alex%20Global%20Knowledge&scopes=repo',
        placeholder: 'Paste your token here',
    },
    GAMMA_API_KEY: {
        key: SECRETS.GAMMA_API_KEY,
        displayName: 'Gamma API Key',
        description: 'API key for AI-powered presentation generation via Gamma.app',
        getUrl: 'https://gamma.app/settings',
        placeholder: 'ga_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        envVar: 'GAMMA_API_KEY',
    },
    REPLICATE_API_TOKEN: {
        key: SECRETS.REPLICATE_API_TOKEN,
        displayName: 'Replicate API Token',
        description: 'API token for AI image generation and model inference via Replicate',
        getUrl: 'https://replicate.com/account/api-tokens',
        placeholder: 'r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        envVar: 'REPLICATE_API_TOKEN',
    },
    OPENAI_API_KEY: {
        key: SECRETS.OPENAI_API_KEY,
        displayName: 'OpenAI API Key',
        description: 'API key for DALL-E image generation and GPT models',
        getUrl: 'https://platform.openai.com/api-keys',
        placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        envVar: 'OPENAI_API_KEY',
    },
    ANTHROPIC_API_KEY: {
        key: SECRETS.ANTHROPIC_API_KEY,
        displayName: 'Anthropic API Key',
        description: 'API key for Claude models and advanced AI capabilities',
        getUrl: 'https://console.anthropic.com/settings/keys',
        placeholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        envVar: 'ANTHROPIC_API_KEY',
    },
};

/**
 * Initialize secrets storage
 * @param context Extension context with secrets API
 */
export async function initSecretsManager(context: vscode.ExtensionContext): Promise<void> {
    secretStorage = context.secrets;

    // Load all tokens into cache
    for (const config of Object.values(TOKEN_CONFIGS)) {
        try {
            const token = await secretStorage.get(config.key);
            tokenCache.set(config.key, token || null);
        } catch {
            tokenCache.set(config.key, null);
        }
    }

    // Migrate environment variables to SecretStorage (one-time, non-destructive)
    await migrateEnvironmentVariables();
}

/**
 * Migrate environment variables to SecretStorage
 * Does not clear env vars (non-destructive)
 */
async function migrateEnvironmentVariables(): Promise<void> {
    if (!secretStorage) {
        return;
    }

    for (const config of Object.values(TOKEN_CONFIGS)) {
        if (!config.envVar) {
            continue;
        }

        const envValue = process.env[config.envVar];
        const storedValue = tokenCache.get(config.key);

        // Only migrate if env var exists and secret storage is empty
        if (envValue && !storedValue) {
            try {
                await secretStorage.store(config.key, envValue);
                tokenCache.set(config.key, envValue);
                console.log(`[Alex][SecretsManager] Migrated ${config.envVar} to secure storage`);
            } catch (error) {
                console.error(`[Alex][SecretsManager] Failed to migrate ${config.envVar}:`, error);
            }
        }
    }
}

/**
 * Public API to trigger environment variable migration
 * Can be called from initialize/upgrade commands
 */
export async function migrateSecretsFromEnvironment(): Promise<void> {
    await migrateEnvironmentVariables();
}

/**
 * Store a token securely
 * @param tokenName Key from TOKEN_CONFIGS
 * @param token The token value, or empty string to clear
 */
export async function setToken(tokenName: keyof typeof TOKEN_CONFIGS, token: string): Promise<void> {
    if (!secretStorage) {
        throw new Error('Secrets manager not initialized');
    }

    const config = TOKEN_CONFIGS[tokenName];
    if (!config) {
        throw new Error(`Unknown token: ${tokenName}`);
    }

    if (token) {
        await secretStorage.store(config.key, token);
        tokenCache.set(config.key, token);
    } else {
        await secretStorage.delete(config.key);
        tokenCache.set(config.key, null);
    }
}

/**
 * Get a token (synchronous, uses cached value)
 * @param tokenName Key from TOKEN_CONFIGS
 * @returns Token value or null if not set
 */
export function getToken(tokenName: keyof typeof TOKEN_CONFIGS): string | null {
    const config = TOKEN_CONFIGS[tokenName];
    if (!config) {
        return null;
    }

    // Check cache first
    const cached = tokenCache.get(config.key);
    if (cached !== undefined) {
        return cached;
    }

    // Fallback to environment variable for backward compatibility
    if (config.envVar) {
        const envValue = process.env[config.envVar];
        if (envValue) {
            return envValue;
        }
    }

    return null;
}

/**
 * Get all token statuses
 * @returns Map of token name to boolean (true if set)
 */
export function getTokenStatuses(): Record<string, boolean> {
    const statuses: Record<string, boolean> = {};

    for (const [name, config] of Object.entries(TOKEN_CONFIGS)) {
        const token = getToken(name as keyof typeof TOKEN_CONFIGS);
        statuses[name] = !!token;
    }

    return statuses;
}

/**
 * Clear all tokens (use with caution)
 */
export async function clearAllTokens(): Promise<void> {
    if (!secretStorage) {
        throw new Error('Secrets manager not initialized');
    }

    for (const config of Object.values(TOKEN_CONFIGS)) {
        try {
            await secretStorage.delete(config.key);
            tokenCache.set(config.key, null);
        } catch (error) {
            console.error(`[Alex][SecretsManager] Failed to clear ${config.displayName}:`, error);
        }
    }
}

/**
 * Export secrets from SecretStorage to .env file
 * Makes secrets accessible to external scripts and tools
 * @param targetFolder Optional folder path, defaults to first workspace folder
 * @returns Object with exported count and file path
 */
export async function exportSecretsToEnv(targetFolder?: string): Promise<{ exported: number; filePath: string | null }> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('No workspace folder open. Cannot export secrets.');
        return { exported: 0, filePath: null };
    }

    const folder = targetFolder || workspaceFolders[0].uri.fsPath;
    const envPath = path.join(folder, '.env');

    // Build .env content from stored secrets
    const lines: string[] = [
        '# Alex Secrets Export',
        `# Generated: ${new Date().toISOString()}`,
        '# WARNING: This file contains sensitive data. Keep it gitignored.',
        '',
    ];

    let exportedCount = 0;

    for (const [name, config] of Object.entries(TOKEN_CONFIGS)) {
        if (!config.envVar) {
            continue; // Skip tokens without env var mapping
        }

        const token = getToken(name as keyof typeof TOKEN_CONFIGS);
        if (token) {
            lines.push(`# ${config.displayName}`);
            lines.push(`${config.envVar}=${token}`);
            lines.push('');
            exportedCount++;
        }
    }

    if (exportedCount === 0) {
        vscode.window.showInformationMessage('No secrets to export. Configure API keys first.');
        return { exported: 0, filePath: null };
    }

    // Check if .env exists and has content
    let existingContent = '';
    try {
        if (fs.existsSync(envPath)) {
            existingContent = fs.readFileSync(envPath, 'utf8');
        }
    } catch {
        // File doesn't exist or can't be read, that's fine
    }

    // If existing .env has Alex export section, replace it; otherwise append
    const alexSectionMarker = '# Alex Secrets Export';
    let newContent: string;

    if (existingContent.includes(alexSectionMarker)) {
        // Replace existing Alex section
        const beforeAlex = existingContent.split(alexSectionMarker)[0].trimEnd();
        newContent = beforeAlex + (beforeAlex ? '\n\n' : '') + lines.join('\n');
    } else if (existingContent.trim()) {
        // Append to existing content
        newContent = existingContent.trimEnd() + '\n\n' + lines.join('\n');
    } else {
        // New file
        newContent = lines.join('\n');
    }

    try {
        fs.writeFileSync(envPath, newContent, 'utf8');
        console.log(`[Alex][SecretsManager] Exported ${exportedCount} secrets to ${envPath}`);
        return { exported: exportedCount, filePath: envPath };
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write .env file: ${error}`);
        return { exported: 0, filePath: null };
    }
}

/**
 * Show UI for exporting secrets to .env file
 */
export async function showExportSecretsUI(): Promise<void> {
    const statuses = getTokenStatuses();
    const configuredCount = Object.values(statuses).filter(Boolean).length;

    if (configuredCount === 0) {
        vscode.window.showInformationMessage(
            'No secrets configured. Use "Alex: Manage API Keys" to add tokens first.'
        );
        return;
    }

    const confirm = await vscode.window.showWarningMessage(
        `Export ${configuredCount} secret(s) to .env file?\n\n` +
        'This makes secrets accessible to scripts and external tools. ' +
        'Ensure .env is in your .gitignore.',
        { modal: true },
        'Export to .env',
        'Cancel'
    );

    if (confirm !== 'Export to .env') {
        return;
    }

    const result = await exportSecretsToEnv();

    if (result.filePath) {
        const openFile = await vscode.window.showInformationMessage(
            `✅ Exported ${result.exported} secret(s) to .env\n\n` +
            'Scripts can now access these via environment variables.',
            'Open .env',
            'OK'
        );

        if (openFile === 'Open .env') {
            const doc = await vscode.workspace.openTextDocument(result.filePath);
            await vscode.window.showTextDocument(doc);
        }
    }
}

/**
 * Prompt user to enter a token
 * @param tokenName Key from TOKEN_CONFIGS
 * @returns True if token was set, false if cancelled
 */
export async function promptForToken(tokenName: keyof typeof TOKEN_CONFIGS): Promise<boolean> {
    const config = TOKEN_CONFIGS[tokenName];
    if (!config) {
        return false;
    }

    const currentToken = getToken(tokenName);
    const hasToken = !!currentToken;

    const value = await vscode.window.showInputBox({
        prompt: config.description,
        placeHolder: config.placeholder,
        password: true,
        ignoreFocusOut: true,
        value: hasToken ? '••••••••' : undefined,
        validateInput: (input) => {
            if (!input || input === '••••••••') {
                return hasToken ? null : 'Token cannot be empty';
            }
            if (input.length < 10) {
                return 'Token seems too short';
            }
            return null;
        },
        title: `${config.displayName} ${hasToken ? '(currently set)' : ''}`,
    });

    if (value === undefined) {
        return false; // User cancelled
    }

    if (value === '••••••••' && hasToken) {
        return false; // User didn't change the masked value
    }

    if (value === '') {
        // Clear token
        await setToken(tokenName, '');
        vscode.window.showInformationMessage(`${config.displayName} cleared`);
        return true;
    }

    // Set token
    await setToken(tokenName, value);
    vscode.window.showInformationMessage(`${config.displayName} saved securely`);

    // Offer to open get URL if provided
    if (config.getUrl) {
        const action = await vscode.window.showInformationMessage(
            `Need a ${config.displayName}?`,
            'Get API Key',
        );
        if (action === 'Get API Key') {
            vscode.env.openExternal(vscode.Uri.parse(config.getUrl));
        }
    }

    return true;
}

/**
 * Show token management quick pick
 */
export async function showTokenManagementPalette(): Promise<void> {
    const statuses = getTokenStatuses();

    const items = Object.entries(TOKEN_CONFIGS).map(([name, config]) => {
        const isSet = statuses[name];
        return {
            label: `${isSet ? '$(check)' : '$(circle-outline)'} ${config.displayName}`,
            description: isSet ? 'Configured' : 'Not set',
            detail: config.description,
            tokenName: name as keyof typeof TOKEN_CONFIGS,
        };
    });

    items.push({
        label: '$(globe) Get API Keys',
        description: 'Open documentation',
        detail: 'Learn where to get API keys for Alex features',
        tokenName: '__HELP__' as any,
    });

    items.push({
        label: '$(export) Export to .env',
        description: 'Make secrets available to scripts',
        detail: 'Write configured secrets to .env file for external tools',
        tokenName: '__EXPORT__' as any,
    });

    items.push({
        label: '$(trash) Clear All Tokens',
        description: 'Remove all stored tokens',
        detail: 'Use with caution - this will clear all API keys',
        tokenName: '__CLEAR_ALL__' as any,
    });

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select an API key to configure',
        title: 'Alex API Keys & Secrets',
        matchOnDescription: true,
    });

    if (!selected) {
        return;
    }

    if (selected.tokenName === '__HELP__') {
        // Show help documentation
        const message = Object.entries(TOKEN_CONFIGS)
            .map(([_, config]) => `**${config.displayName}**: ${config.getUrl || 'Contact administrator'}`)
            .join('\n\n');

        vscode.window.showInformationMessage(
            'Visit these URLs to get your API keys:\n\n' + message,
            { modal: true },
        );
        return;
    }

    if (selected.tokenName === '__EXPORT__') {
        await showExportSecretsUI();
        return;
    }

    if (selected.tokenName === '__CLEAR_ALL__') {
        const confirm = await vscode.window.showWarningMessage(
            'Clear all stored API keys and tokens? This cannot be undone.',
            { modal: true },
            'Clear All',
        );
        if (confirm === 'Clear All') {
            await clearAllTokens();
            vscode.window.showInformationMessage('All tokens cleared');
        }
        return;
    }

    // Prompt for the selected token
    await promptForToken(selected.tokenName);
}

/**
 * Detected secret from .env file
 */
interface DetectedSecret {
    file: string;              // .env file path (relative)
    key: string;               // Environment variable name
    value: string;             // Secret value (partial for display)
    line: number;              // Line number in file
    tokenType?: keyof typeof TOKEN_CONFIGS;  // Matching token config
    recommended: boolean;      // Should be migrated
}

/**
 * Scan workspace for .env files
 */
async function scanForEnvFiles(): Promise<vscode.Uri[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return [];
    }

    const envFiles: vscode.Uri[] = [];

    // Find all .env* files in workspace
    const pattern = '**/.env*';
    const exclude = '**/node_modules/**';
    
    const files = await vscode.workspace.findFiles(pattern, exclude);
    
    // Filter to only .env files (exclude .env.example, .env.template, etc.)
    for (const file of files) {
        const basename = file.path.split('/').pop() || '';
        if (basename === '.env' || basename.startsWith('.env.')) {
            // Exclude example/template files
            if (!basename.includes('example') && !basename.includes('template') && !basename.includes('sample')) {
                envFiles.push(file);
            }
        }
    }

    return envFiles;
}

/**
 * Parse .env file and detect potential secrets
 */
async function parseEnvFile(uri: vscode.Uri): Promise<DetectedSecret[]> {
    const detected: DetectedSecret[] = [];
    
    try {
        const content = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(content).toString('utf8');
        const lines = text.split('\n');
        
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        const relativePath = workspaceFolder 
            ? vscode.workspace.asRelativePath(uri, false)
            : uri.fsPath;

        // Pattern for key=value (handles quotes, spaces, comments)
        const envPattern = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*([^#\n]+)/i;

        // Patterns that indicate secrets
        const secretKeywords = [
            'API_KEY', 'API_TOKEN', 'SECRET', 'PASSWORD', 'PASS',
            'TOKEN', 'AUTH', 'CREDENTIAL', 'PRIVATE_KEY',
            'ACCESS_KEY', 'SECRET_KEY', 'CLIENT_SECRET'
        ];

        lines.forEach((line, index) => {
            const match = line.match(envPattern);
            if (!match) {
                return;
            }

            const [, key, rawValue] = match;
            const value = rawValue.trim().replace(/^["']|["']$/g, ''); // Remove quotes

            // Skip empty values
            if (!value || value.length === 0) {
                return;
            }

            // Check if key suggests it's a secret
            const isSecret = secretKeywords.some(keyword => 
                key.toUpperCase().includes(keyword)
            );

            if (!isSecret) {
                return;
            }

            // Try to match to known token configs
            let tokenType: keyof typeof TOKEN_CONFIGS | undefined;
            for (const [configName, config] of Object.entries(TOKEN_CONFIGS)) {
                if (config.envVar === key) {
                    tokenType = configName as keyof typeof TOKEN_CONFIGS;
                    break;
                }
            }

            // Partial value for display (mask middle)
            const displayValue = value.length > 20
                ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
                : `${value.substring(0, 4)}${'*'.repeat(Math.max(0, value.length - 4))}`;

            detected.push({
                file: relativePath,
                key,
                value: displayValue,
                line: index + 1,
                tokenType,
                recommended: !!tokenType, // Recommend if we have a matching config
            });
        });
    } catch (error) {
        console.error(`[Alex][SecretsManager] Failed to parse ${uri.fsPath}:`, error);
    }

    return detected;
}

/**
 * Detect secrets in .env files across workspace
 */
export async function detectEnvSecrets(): Promise<DetectedSecret[]> {
    const envFiles = await scanForEnvFiles();
    if (envFiles.length === 0) {
        return [];
    }

    const allSecrets: DetectedSecret[] = [];

    for (const file of envFiles) {
        const secrets = await parseEnvFile(file);
        allSecrets.push(...secrets);
    }

    return allSecrets;
}

/**
 * Show UI to migrate detected .env secrets
 */
export async function showEnvSecretsMigrationUI(): Promise<void> {
    const secrets = await detectEnvSecrets();

    if (secrets.length === 0) {
        vscode.window.showInformationMessage(
            '✅ No secrets detected in .env files.\n\n' +
            'Alex scanned for common secret patterns (API_KEY, TOKEN, SECRET, PASSWORD, etc.) ' +
            'and found none in your workspace .env files.',
            { modal: false }
        );
        return;
    }

    // Group by token type
    const recognized = secrets.filter(s => s.tokenType);
    const unrecognized = secrets.filter(s => !s.tokenType);

    const summary = `🔍 Found ${secrets.length} potential secret(s) in .env files:\n\n` +
        (recognized.length > 0 ? `✅ ${recognized.length} recognized (can auto-migrate)\n` : '') +
        (unrecognized.length > 0 ? `⚠️ ${unrecognized.length} custom (requires manual setup)\n` : '');

    const action = await vscode.window.showInformationMessage(
        summary + '\nWould you like to migrate these to secure storage?',
        { modal: true },
        'Review Secrets',
        'Auto-Migrate Recognized',
        'Cancel'
    );

    if (action === 'Cancel' || !action) {
        return;
    }

    if (action === 'Auto-Migrate Recognized') {
        await autoMigrateRecognizedSecrets(recognized);
        return;
    }

    if (action === 'Review Secrets') {
        await showSecretReviewUI(secrets);
    }
}

/**
 * Auto-migrate recognized secrets to SecretStorage
 */
async function autoMigrateRecognizedSecrets(secrets: DetectedSecret[]): Promise<void> {
    if (secrets.length === 0) {
        vscode.window.showWarningMessage('No recognized secrets to migrate.');
        return;
    }

    let migrated = 0;
    let skipped = 0;

    for (const secret of secrets) {
        if (!secret.tokenType) {
            continue;
        }

        try {
            // Read the actual value from the file
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                continue;
            }

            const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, secret.file);
            const content = await vscode.workspace.fs.readFile(fileUri);
            const text = Buffer.from(content).toString('utf8');
            const lines = text.split('\n');
            const targetLine = lines[secret.line - 1];
            
            const match = targetLine.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*([^#\n]+)/i);
            if (!match) {
                skipped++;
                continue;
            }

            const actualValue = match[2].trim().replace(/^["']|["']$/g, '');
            
            // Check if already set in SecretStorage
            const existing = getToken(secret.tokenType);
            if (existing && existing === actualValue) {
                skipped++;
                continue; // Already migrated
            }

            // Migrate to SecretStorage
            await setToken(secret.tokenType, actualValue);
            migrated++;
        } catch (error) {
            console.error(`[Alex][SecretsManager] Failed to migrate ${secret.key}:`, error);
            skipped++;
        }
    }

    const message = `✅ Migration complete!\n\n` +
        `Migrated: ${migrated}\n` +
        `Skipped: ${skipped}\n\n` +
        (migrated > 0 ? `⚠️ Update your code to use VS Code SecretStorage instead of process.env` : '');

    vscode.window.showInformationMessage(message, { modal: true });

    // Offer to show migration guide
    if (migrated > 0) {
        const guide = await vscode.window.showInformationMessage(
            'Would you like to see the code migration guide?',
            'Show Guide',
            'Later'
        );

        if (guide === 'Show Guide') {
            await showCodeMigrationGuide();
        }
    }
}

/**
 * Show detailed review UI for all secrets
 */
async function showSecretReviewUI(secrets: DetectedSecret[]): Promise<void> {
    const items = secrets.map(secret => ({
        label: `${secret.tokenType ? '$(check)' : '$(circle-outline)'} ${secret.key}`,
        description: `${secret.file}:${secret.line}`,
        detail: `Value: ${secret.value}${secret.tokenType ? ` → ${TOKEN_CONFIGS[secret.tokenType].displayName}` : ' (custom)'}`,
        secret,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select secrets to migrate (recognized secrets auto-map to Alex tokens)',
        title: 'Review Detected Secrets',
        canPickMany: true,
    });

    if (!selected || selected.length === 0) {
        return;
    }

    // Separate recognized from unrecognized
    const recognized = selected.filter(s => s.secret.tokenType);
    const unrecognized = selected.filter(s => !s.secret.tokenType);

    if (recognized.length > 0) {
        await autoMigrateRecognizedSecrets(recognized.map(s => s.secret));
    }

    if (unrecognized.length > 0) {
        vscode.window.showWarningMessage(
            `${unrecognized.length} custom secret(s) selected.\n\n` +
            'These require manual setup. Add them to TOKEN_CONFIGS in secretsManager.ts',
            { modal: false }
        );
    }
}

/**
 * Show code migration guide
 */
async function showCodeMigrationGuide(): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
        'alexSecretsMigration',
        'Secrets Migration Guide',
        vscode.ViewColumn.One,
        { enableScripts: false }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            line-height: 1.6;
        }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { color: var(--vscode-textLink-activeForeground); margin-top: 24px; }
        code {
            background: var(--vscode-textCodeBlock-background);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: var(--vscode-editor-font-family);
        }
        pre {
            background: var(--vscode-textCodeBlock-background);
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            border-left: 3px solid var(--vscode-textLink-foreground);
        }
        .warning {
            background: var(--vscode-inputValidation-warningBackground);
            border: 1px solid var(--vscode-inputValidation-warningBorder);
            padding: 12px;
            border-radius: 4px;
            margin: 16px 0;
        }
        .success {
            background: var(--vscode-inputValidation-infoBackground);
            border: 1px solid var(--vscode-inputValidation-infoBorder);
            padding: 12px;
            border-radius: 4px;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <h1>🔐 Secrets Migration Guide</h1>
    <p>Your secrets have been migrated to VS Code SecretStorage (encrypted at OS level). Now update your code to use the secure storage instead of environment variables.</p>

    <h2>⚠️ Important: Update Your Code</h2>
    <div class="warning">
        <strong>Action Required:</strong> Your <code>.env</code> file still contains the secrets. You must update your application code and scripts to use VS Code SecretStorage API instead of <code>process.env</code>.
    </div>

    <h2>For VS Code Extensions</h2>
    <p>If you're building a VS Code extension, use the SecretStorage API:</p>
    <pre>
// In your extension's activate() function
const secretStorage = context.secrets;

// Store a secret
await secretStorage.store('myapp.apiKey', apiKey);

// Retrieve a secret
const apiKey = await secretStorage.get('myapp.apiKey');

// Delete a secret
await secretStorage.delete('myapp.apiKey');
</pre>

    <h2>For Node.js Applications</h2>
    <p>For standalone Node.js apps, continue using <code>process.env</code> but load from a secure secret manager:</p>

    <h3>Option 1: Use Environment Variables (Recommended for Scripts)</h3>
    <pre>
// Keep using process.env in your code
const apiKey = process.env.API_KEY;

// But set them securely at runtime, not in .env files
// Example: From CI/CD secrets, Azure Key Vault, AWS Secrets Manager, etc.
</pre>

    <h3>Option 2: Use a Secret Manager Library</h3>
    <pre>
// Install a secret manager
npm install dotenv-vault   # For encrypted .env files
npm install @azure/keyvault-secrets  # For Azure
npm install @aws-sdk/client-secrets-manager  # For AWS

// Load secrets at runtime
const secrets = await loadFromSecretManager();
const apiKey = secrets.API_KEY;
</pre>

    <h2>For Scripts Called by Alex</h2>
    <p>Scripts called by the Alex extension can access secrets via SecretStorage:</p>
    <pre>
// In your muscle script (e.g., gamma-generator.js)
// Alex extension will pass secrets as arguments instead of env vars

// Before (insecure):
const apiKey = process.env.GAMMA_API_KEY;

// After (secure):
// The extension calls: node script.js --api-key <secret-from-storage>
const apiKey = process.argv.find(arg => arg.startsWith('--api-key='))?.split('=')[1];
</pre>

    <h2>✅ Next Steps</h2>
    <div class="success">
        <ol>
            <li><strong>Update your code</strong> to use the new secret access pattern</li>
            <li><strong>Test thoroughly</strong> to ensure secrets are loaded correctly</li>
            <li><strong>Remove secrets from .env</strong> after successful migration (or add .env to .gitignore)</li>
            <li><strong>Document the change</strong> for your team</li>
        </ol>
    </div>

    <h2>Need Help?</h2>
    <p>Ask Alex: "How do I migrate my code to use SecretStorage?" or "Show me the secrets management skill"</p>
</body>
</html>`;
}
