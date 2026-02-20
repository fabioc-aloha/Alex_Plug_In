---
description: "Secure credential storage, VS Code SecretStorage API, token management, environment variable migration"
applyTo: "**/secrets*.ts,**/credentials*.ts,**/tokens*.ts,**/*Secret*.ts"
---

# Secrets Management

**Purpose**: Procedural memory for secure credential storage in VS Code extensions
**Created**: 2026-02-19 (Secrets manager implementation session)

## Auto-Activation Triggers

Activate when user mentions:
- "API key", "token", "secret", "credential", "password" (in development context)
- "SecretStorage", "keychain", "credential manager"
- "migrate from environment variables"
- ".env file", "environment file", "detect secrets in .env"
- "secure token storage"
- "How do I store API keys?"
- Code review involving `process.env.API_KEY` patterns
- Code review involving `.env` file security

## VS Code SecretStorage API

### Core Methods

| Method | Signature | Purpose |
|--------|-----------|---------|
| `store` | `(key: string, value: string): Promise<void>` | Save encrypted credential |
| `get` | `(key: string): Promise<string \| undefined>` | Retrieve credential |
| `delete` | `(key: string): Promise<void>` | Remove credential |
| `onDidChange` | `Event<SecretStorageChangeEvent>` | Listen for external changes |

### Access Pattern

```typescript
export function activate(context: vscode.ExtensionContext) {
    // SecretStorage is available on context
    const secretStorage = context.secrets;
    
    // Initialize your secrets manager
    await initSecretsManager(context);
}
```

## Platform Storage Backends

| Platform | Backend | Location | Encryption |
|----------|---------|----------|------------|
| **Windows** | Credential Manager | `Control Panel → Credential Manager → Windows Credentials` | DPAPI |
| **macOS** | Keychain | `Keychain Access.app` | Keychain Services |
| **Linux** | Secret Service | `libsecret` (GNOME Keyring / KDE Wallet) | OS keyring |

**Key Insight**: VS Code abstracts platform differences. Same code works everywhere.

## Service Architecture Pattern

### Recommended Structure

```
src/
├── services/
│   └── secretsManager.ts          ← Centralized token management
├── extension.ts                    ← Initialize in activate()
└── commands/
    └── manageSecrets.ts           ← UI for token configuration
```

### secretsManager.ts Template

```typescript
import * as vscode from 'vscode';

// Namespaced keys (prevent collisions)
const SECRETS = {
    SERVICE_TOKEN: 'extension.namespace.serviceToken',
    // Add more...
} as const;

let secretStorage: vscode.SecretStorage | null = null;
const tokenCache: Map<string, string | null> = new Map();

export interface TokenConfig {
    key: string;
    displayName: string;
    description: string;
    getUrl?: string;
    placeholder?: string;
    envVar?: string;  // For migration
}

export const TOKEN_CONFIGS: Record<string, TokenConfig> = {
    SERVICE_TOKEN: {
        key: SECRETS.SERVICE_TOKEN,
        displayName: 'Service API Token',
        description: 'API token for service integration',
        getUrl: 'https://service.example.com/tokens',
        placeholder: 'svc_xxxxxxxxxxxxxxxxxxxx',
        envVar: 'SERVICE_API_TOKEN',
    },
};

export async function initSecretsManager(context: vscode.ExtensionContext) {
    secretStorage = context.secrets;
    
    // Pre-load cache for sync access
    for (const config of Object.values(TOKEN_CONFIGS)) {
        const token = await secretStorage.get(config.key);
        tokenCache.set(config.key, token || null);
    }
    
    // Migrate env vars (non-destructive)
    await migrateEnvironmentVariables();
}

export function getToken(tokenName: keyof typeof TOKEN_CONFIGS): string | null {
    const config = TOKEN_CONFIGS[tokenName];
    if (!config) return null;
    
    // Check cache first
    const cached = tokenCache.get(config.key);
    if (cached !== undefined) return cached;
    
    // Fallback to env var (backward compatibility)
    if (config.envVar && process.env[config.envVar]) {
        return process.env[config.envVar];
    }
    
    return null;
}

export async function setToken(tokenName: keyof typeof TOKEN_CONFIGS, value: string) {
    if (!secretStorage) throw new Error('Secrets manager not initialized');
    
    const config = TOKEN_CONFIGS[tokenName];
    if (!config) throw new Error(\`Unknown token: \${tokenName}\`);
    
    if (value) {
        await secretStorage.store(config.key, value);
        tokenCache.set(config.key, value);
    } else {
        await secretStorage.delete(config.key);
        tokenCache.set(config.key, null);
    }
}

async function migrateEnvironmentVariables() {
    if (!secretStorage) return;
    
    for (const config of Object.values(TOKEN_CONFIGS)) {
        if (!config.envVar) continue;
        
        const envValue = process.env[config.envVar];
        const storedValue = tokenCache.get(config.key);
        
        // Only migrate if env var exists AND storage is empty
        if (envValue && !storedValue) {
            await secretStorage.store(config.key, envValue);
            tokenCache.set(config.key, envValue);
            console.log(\`[Extension] Migrated \${config.envVar} to secure storage\`);
        }
    }
}

export async function migrateSecretsFromEnvironment() {
    await migrateEnvironmentVariables();
}
```

## Migration Strategy (Environment Variables → SecretStorage)

### When to Migrate

| Trigger | Action |
|---------|--------|
| **Extension activation** | Check + migrate on every startup |
| **Initialize command** | Migrate when deploying to new project |
| **Upgrade command** | Migrate when upgrading existing project |
| **Manual config** | User opens token management UI |

### Migration Rules

| Condition | Action |
|-----------|--------|
| Env var exists + SecretStorage empty | **Migrate** (copy env var → SecretStorage) |
| Env var exists + SecretStorage populated | **Skip** (user config takes precedence) |
| Env var missing + SecretStorage empty | **Prompt** (when feature needs token) |
| Env var missing + SecretStorage populated | **Use SecretStorage** (migration complete) |

### Non-Destructive Philosophy

✅ **DO**: Copy env vars to SecretStorage
✅ **DO**: Keep env vars as fallback
❌ **DON'T**: Delete env vars after migration
❌ **DON'T**: Overwrite user-configured tokens

**Reason**: Env vars might be used by other tools, scripts, or CI/CD pipelines.

## Export Secrets to .env (Reverse Migration)

### The Problem

VS Code SecretStorage is secure but **inaccessible to external tools**:
- PowerShell scripts (like `brain-qa.ps1`) can't read SecretStorage
- CLI tools (Replicate, OpenAI) expect environment variables
- CI/CD pipelines need `.env` files

### The Solution: Bidirectional Flow

```
┌─────────────────┐      migrate       ┌──────────────────┐
│   .env file     │  ───────────────►  │  SecretStorage   │
│  (unencrypted)  │                    │   (encrypted)    │
│                 │  ◄───────────────  │                  │
└─────────────────┘      export        └──────────────────┘
```

### Export Command

**Command**: `alex.exportSecretsToEnv` ("Alex: Export Secrets to .env")

**Behavior**:
1. Reads all configured secrets from SecretStorage
2. Writes to `.env` file in workspace root
3. Adds/updates "Alex Secrets Export" section
4. Preserves existing `.env` content

### Export Implementation

```typescript
export async function exportSecretsToEnv(targetFolder?: string): Promise<{ exported: number; filePath: string | null }> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return { exported: 0, filePath: null };

    const folder = targetFolder || workspaceFolders[0].uri.fsPath;
    const envPath = path.join(folder, '.env');

    const lines: string[] = [
        '# Alex Secrets Export',
        `# Generated: ${new Date().toISOString()}`,
        '# WARNING: Keep this file gitignored.',
        '',
    ];

    for (const [name, config] of Object.entries(TOKEN_CONFIGS)) {
        if (!config.envVar) continue;
        const token = getToken(name as keyof typeof TOKEN_CONFIGS);
        if (token) {
            lines.push(`# ${config.displayName}`);
            lines.push(`${config.envVar}=${token}`);
            lines.push('');
        }
    }

    fs.writeFileSync(envPath, lines.join('\\n'), 'utf8');
    return { exported: lines.filter(l => l.includes('=')).length, filePath: envPath };
}
```

### Workflow for Scripts

1. **First time**: Configure secrets via `alex.manageSecrets`
2. **Before running scripts**: Export via `alex.exportSecretsToEnv`
3. **In PowerShell**: Source the .env file:

```powershell
# Source .env in PowerShell
Get-Content .env | ForEach-Object {
    if ($_ -match '^([A-Z_]+)=(.+)$') {
        [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
    }
}
```

### Security Considerations

| Aspect | Guidance |
|--------|----------|
| **gitignore** | `.env` is already in `.gitignore` |
| **Scope** | Export creates session-local file |
| **Cleanup** | Delete `.env` after use if sensitive |
| **CI/CD** | Use proper CI secrets management instead |

## .env File Detection & Migration

### Detection Pattern

Proactive scanning for secrets in `.env` files across the workspace.

**Regex Pattern**:
```typescript
/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*([^#\n]+)/i
```

**Secret Keywords**:
- `API_KEY`, `TOKEN`, `SECRET`, `PASSWORD`, `PASS`
- `AUTH`, `CREDENTIAL`, `PRIVATE_KEY`

**File Exclusions**:
- `.env.example`, `.env.template`, `.env.sample`
- `node_modules/**`, `**/dist/**`

### Detection Workflow

```typescript
export interface DetectedSecret {
    file: vscode.Uri;           // .env file location
    key: string;                // Variable name (e.g., "GAMMA_API_KEY")
    value: string;              // Secret value (trimmed)
    line: number;               // Line number (1-based)
    tokenType?: string;         // If matches TOKEN_CONFIGS
    recommended: boolean;       // True if matches known token
}

async function scanForEnvFiles(): Promise<vscode.Uri[]> {
    return await vscode.workspace.findFiles(
        '**/.env',
        '{**/.env.example,**/.env.template,**/.env.sample,**/node_modules/**}'
    );
}

async function parseEnvFile(fileUri: vscode.Uri): Promise<DetectedSecret[]> {
    const content = await vscode.workspace.fs.readFile(fileUri);
    const text = Buffer.from(content).toString('utf8');
    const lines = text.split(/\r?\n/);
    const secrets: DetectedSecret[] = [];
    
    const SECRET_KEYWORDS = ['API_KEY', 'TOKEN', 'SECRET', 'PASSWORD', 'PASS', 
                             'AUTH', 'CREDENTIAL', 'PRIVATE_KEY'];
    const ENV_PATTERN = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*([^#\n]+)/i;
    
    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(ENV_PATTERN);
        if (!match) continue;
        
        const [, key, value] = match;
        const trimmedValue = value.trim();
        
        // Skip empty values and comments
        if (!trimmedValue || trimmedValue.startsWith('#')) continue;
        
        // Check for secret keywords
        const upperKey = key.toUpperCase();
        const isSecret = SECRET_KEYWORDS.some(kw => upperKey.includes(kw));
        if (!isSecret) continue;
        
        // Check if matches TOKEN_CONFIGS
        const matchedToken = Object.entries(TOKEN_CONFIGS).find(
            ([, config]) => config.envVar === key
        );
        
        secrets.push({
            file: fileUri,
            key,
            value: trimmedValue,
            line: i + 1,
            tokenType: matchedToken?.[0],
            recommended: !!matchedToken
        });
    }
    
    return secrets;
}
```

### Migration UI Flow

```typescript
export async function showEnvSecretsMigrationUI() {
    const secrets = await detectEnvSecrets();
    
    if (secrets.length === 0) {
        vscode.window.showInformationMessage(
            '✅ No .env files with secrets detected'
        );
        return;
    }
    
    const recognized = secrets.filter(s => s.tokenType);
    const custom = secrets.filter(s => !s.tokenType);
    
    const message = `Found ${secrets.length} secret${secrets.length > 1 ? 's' : ''} ` +
                   `(${recognized.length} recognized, ${custom.length} custom)`;
    
    const choice = await vscode.window.showInformationMessage(
        message,
        'Review Secrets',
        'Auto-Migrate Recognized',
        'Cancel'
    );
    
    if (choice === 'Review Secrets') {
        await showSecretReviewUI(secrets);
    } else if (choice === 'Auto-Migrate Recognized') {
        await autoMigrateRecognizedSecrets(recognized);
        if (custom.length > 0) {
            await showSecretReviewUI(custom);
        }
    }
}

async function autoMigrateRecognizedSecrets(secrets: DetectedSecret[]) {
    for (const secret of secrets) {
        if (!secret.tokenType) continue;
        
        const existing = getToken(secret.tokenType);
        if (!existing) {  // Don't overwrite user config
            await setToken(secret.tokenType, secret.value);
        }
    }
    
    vscode.window.showInformationMessage(
        `✅ Migrated ${secrets.length} token${secrets.length > 1 ? 's' : ''} to secure storage`
    );
    
    await showCodeMigrationGuide();
}
```

### Code Migration Guide

After migration, users must update their code. Show platform-specific guidance:

**VS Code Extensions**:
```typescript
// Before (insecure):
const apiKey = process.env.GAMMA_API_KEY;

// After (secure):
const { getToken } = await import('./services/secretsManager');
const apiKey = getToken('GAMMA_API_KEY');
```

**Node.js Applications**:
```typescript
// Load secrets from environment at runtime (not .env file)
// Use Azure Key Vault, AWS Secrets Manager, or environment injection
const apiKey = process.env.GAMMA_API_KEY;  // Populated by deployment platform
```

**Scripts/Commands**:
```bash
# Pass secrets as arguments, don't read from .env
node gamma-generator.js --api-key="${GAMMA_API_KEY}"
```

### Integration Points

| Trigger | Action |
|---------|--------|
| **Command Palette** | `alex.detectEnvSecrets` → Scan all .env files |
| **Welcome Panel** | "🔍 Detect .env Secrets" button → Launch detection |
| **Initialize** | Auto-scan after deploying architecture |
| **Upgrade** | Auto-scan after upgrading existing projects |

### Security Benefits

- ✅ Moves secrets from plaintext files → OS-encrypted storage
- ✅ Reduces risk of git commits with real credentials
- ✅ Consistent secret management across team
- ✅ Platform-native encryption (Credential Manager, Keychain, Secret Service)
- ✅ Code migration guidance prevents breaking changes

## UI/UX Pattern

### Token Management Command

```typescript
// In extension.ts
const manageSecretsDisposable = vscode.commands.registerCommand(
  'extension.manageSecrets',
  async () => {
    const { showTokenManagementPalette } = await import('./services/secretsManager');
    await showTokenManagementPalette();
  }
);
context.subscriptions.push(manageSecretsDisposable);

// In package.json
{
  "commands": [{
    "command": "extension.manageSecrets",
    "title": "Manage API Keys & Secrets",
    "category": "Extension Name",
    "icon": "$(key)"
  }]
}
```

### Feature Integration Pattern

```typescript
// When feature requires a token
const { getToken } = await import('./services/secretsManager');
const apiKey = getToken('SERVICE_TOKEN');

if (!apiKey) {
  const result = await vscode.window.showWarningMessage(
    'Service API Key not configured. Set your API key to use this feature.',
    'Configure API Key',
    'Get API Key',
    'Continue Anyway'
  );
  
  if (result === 'Configure API Key') {
    vscode.commands.executeCommand('extension.manageSecrets');
    return;
  }
  
  if (result === 'Get API Key') {
    const config = TOKEN_CONFIGS.SERVICE_TOKEN;
    vscode.env.openExternal(vscode.Uri.parse(config.getUrl));
    return;
  }
  
  // Continue Anyway falls through (feature may fail)
}

// Use apiKey for feature logic
```

### Quick Pick UI

```typescript
export async function showTokenManagementPalette() {
    const items = Object.entries(TOKEN_CONFIGS).map(([key, config]) => {
        const token = getToken(key as keyof typeof TOKEN_CONFIGS);
        const icon = token ? '$(check)' : '$(x)';
        
        return {
            label: `${icon} ${config.displayName}`,
            description: token ? 'Configured' : 'Not configured',
            detail: config.description,
            tokenName: key,
        };
    });
    
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a token to configure',
        title: 'API Keys & Secrets',
    });
    
    if (selected) {
        await promptForToken(selected.tokenName);
    }
}
```

### Token Input Prompt

```typescript
async function promptForToken(tokenName: string) {
    const config = TOKEN_CONFIGS[tokenName];
    const current = getToken(tokenName);
    
    const buttons: vscode.QuickInputButton[] = [];
    if (config.getUrl) {
        buttons.push({
            iconPath: new vscode.ThemeIcon('link-external'),
            tooltip: 'Get API Key',
        });
    }
    
    const value = await vscode.window.showInputBox({
        title: `Configure ${config.displayName}`,
        prompt: config.description,
        value: current || '',
        password: true,  // Mask input
        placeHolder: config.placeholder,
        buttons: buttons,
        validateInput: (value) => {
            // Optional: Add format validation
            if (value && config.placeholder) {
                const expectedLength = config.placeholder.length;
                if (value.length < expectedLength - 5) {
                    return 'Token seems too short';
                }
            }
            return undefined;
        }
    });
    
    if (value !== undefined) {
        await setToken(tokenName, value);
        vscode.window.showInformationMessage(
            `✅ ${config.displayName} ${value ? 'saved' : 'cleared'}`
        );
    }
}
```

## Security Checklist

### Code Review Points

- [ ] **No hardcoded tokens**: Search for `api.*key.*=.*['"]`, flag all matches
- [ ] **Namespace keys**: Use `extension.namespace.tokenName`, not just `apiKey`
- [ ] **No token logging**: Check for `console.log(token)` or similar
- [ ] **Password input**: Use `password: true` in showInputBox
- [ ] **Validation**: Check token format before storage
- [ ] **Cache updates**: Update tokenCache when storing/deleting
- [ ] **Error handling**: Don't expose tokens in error messages
- [ ] **Placeholder text**: Use `xxx...` not real tokens

### Common Security Mistakes

| Mistake | Fix |
|---------|-----|
| `console.log(apiKey)` | `console.log('API key:', apiKey ? '[REDACTED]' : 'not set')` |
| `process.env.API_KEY` directly in code | Import from secretsManager, use `getToken()` |
| Storing in `settings.json` | Use SecretStorage instead |
| Generic key names like `token` | Namespace: `extension.namespace.serviceToken` |
| Sync storage access | Pre-load cache in init, use cache for sync access |

## Testing Strategy

### Manual Testing

| Platform | Test | Expected Result |
|----------|------|-----------------|
| **Windows** | Store token → check Credential Manager | Entry visible under VS Code |
| **macOS** | Store token → open Keychain Access | Entry visible in login keychain |
| **Linux** | Store token → use `secret-tool lookup` | Token retrievable via Secret Service |
| **All** | Restart VS Code | Token persists across restart |
| **All** | Delete token → check storage | Token removed from OS storage |

### Automated Testing

```typescript
suite('Secrets Manager', () => {
    test('stores and retrieves tokens', async () => {
        await setToken('SERVICE_TOKEN', 'test-token-value');
        const retrieved = getToken('SERVICE_TOKEN');
        assert.strictEqual(retrieved, 'test-token-value');
    });
    
    test('migrates from environment variables', async () => {
        process.env.SERVICE_API_TOKEN = 'env-token';
        await migrateSecretsFromEnvironment();
        const token = getToken('SERVICE_TOKEN');
        assert.strictEqual(token, 'env-token');
    });
});
```

## Troubleshooting

### Token Not Persisting

**Symptom**: Token saved but missing after VS Code restart

**Causes & Fixes**:
1. Not using `context.secrets` → Use SecretStorage from context
2. Using extension global state → Switch to SecretStorage
3. Cache not updated → Call `tokenCache.set()` after `store()`
4. Platform keyring unavailable → Check OS keyring service status

### Platform-Specific Issues

| Platform | Issue | Solution |
|----------|-------|----------|
| **Linux** | `libsecret` not installed | Install: `sudo apt-get install libsecret-1-0` |
| **macOS** | Keychain locked | Unlock keychain, allow VS Code access |
| **Windows** | Credential Manager full | Clean up old entries |
| **WSL** | No keyring backend | Use env vars as fallback in WSL |

## Extension Examples Using SecretStorage

| Extension | Usage |
|-----------|-------|
| **GitHub Pull Requests** | GitHub PAT storage |
| **Azure Account** | Azure subscription credentials |
| **Docker** | Docker Hub authentication |
| **GitLens** | API keys for hosting providers |

## Evolution Notes

- **Pre-v1.42**: Used `keytar` (native module, install issues)
- **v1.42+**: VS Code SecretStorage API (built-in, platform-abstracted)
- **Current**: Standard pattern for all credential storage
