---
description: "Secure credential storage, VS Code SecretStorage API, token management, environment variable migration"
applyTo: "**/secrets*.ts,**/credentials*.ts,**/tokens*.ts,**/*Secret*.ts"
---

# Secrets Management — Enforcement Rules

Deep reference: `.github/skills/secrets-management/SKILL.md`

## Hard Rules

- **Never hardcode tokens** in source code — use `context.secrets` (SecretStorage API)
- **Never log tokens** — redact: `apiKey ? '[REDACTED]' : 'not set'`
- **Never store in settings.json** — visible in plaintext, synced across machines
- **Namespace keys**: `extension.namespace.tokenName` (not bare `token`)
- **Password input**: always `password: true` in `showInputBox`
- **Cache updates**: update in-memory cache after every `store()`/`delete()`
- **No token in error messages** — sanitize before throw/display

## Architecture Pattern

```
src/services/secretsManager.ts         ← Centralized management
  - TOKEN_CONFIGS: Record<name, {key, displayName, envVar}>
  - initSecretsManager(context)        ← Call in activate()
  - getToken(name) → string | null     ← Cache-first, env fallback
  - setToken(name, value)              ← Store + cache update
```

## Migration Rules (env → SecretStorage)

| Condition | Action |
|-----------|--------|
| Env var exists + storage empty | Migrate (copy) |
| Env var exists + storage populated | Skip (user config wins) |
| Env var missing + storage empty | Prompt when feature needs it |

Non-destructive: never delete env vars after migration (other tools may use them).

## Platform Backends

| Platform | Backend | Mechanism |
|----------|---------|-----------|
| Windows | Credential Manager | DPAPI |
| macOS | Keychain | Keychain Services |
| Linux | Secret Service | libsecret (GNOME Keyring / KDE Wallet) |

## Review Flags

P0: hardcoded token literal, `console.log(token)`, token in error message
P1: `process.env.API_KEY` without SecretStorage fallback, generic key name, no `password: true`
P2: missing cache update, no namespace prefix, no format validation

## Routing

- Full implementation templates, TypeScript patterns → load `secrets-management` skill
- .env detection workflow, export-to-env → load skill
- Testing patterns, troubleshooting → load skill
