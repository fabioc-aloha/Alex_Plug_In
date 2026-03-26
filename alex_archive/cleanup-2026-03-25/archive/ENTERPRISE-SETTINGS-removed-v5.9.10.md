# Enterprise Settings Reference

Alex Cognitive Architecture includes enterprise-grade security features for organizational deployments. This document covers the **implemented** enterprise settings available in VS Code.

> **Note**: Enterprise features currently include audit logging and secrets scanning. Authentication (Entra ID SSO, RBAC) is planned for a future release — see [ROADMAP-UNIFIED.md](../../ROADMAP-UNIFIED.md).

## Quick Start

Enable audit logging in your VS Code `settings.json`:

```json
{
  "alex.enterprise.audit.enabled": true,
  "alex.enterprise.audit.fileLogging": true
}
```

---

## Audit Logging

### alex.enterprise.audit.enabled
**Type**: `boolean`
**Default**: `true`
**Scope**: Machine

Enable the audit logging system.

### alex.enterprise.audit.fileLogging
**Type**: `boolean`
**Default**: `true`
**Scope**: Machine

Write audit events to local log files.

Log files are stored in:
- **Default**: Extension storage directory (`~/.vscode/extensions/alex-*/logs/`)
- **Custom**: Set via `alex.enterprise.audit.logFilePath`

### alex.enterprise.audit.logFilePath
**Type**: `string`
**Default**: `""` (empty = use extension storage)
**Scope**: Machine

Custom path for audit log files.

Example:
```json
{
  "alex.enterprise.audit.logFilePath": "C:\\Logs\\Alex\\audit.log"
}
```

### alex.enterprise.audit.consoleLogging
**Type**: `boolean`
**Default**: `false`
**Scope**: Machine

Log audit events to VS Code developer console.

Useful for:
- Debugging audit issues
- Real-time monitoring during development
- Verifying audit events are captured

### alex.enterprise.audit.remoteLogging
**Type**: `boolean`
**Default**: `false`
**Scope**: Machine

Send audit events to a remote endpoint (e.g., SIEM, Azure Monitor, Splunk).

Requires `alex.enterprise.audit.remoteEndpoint` to be configured.

### alex.enterprise.audit.remoteEndpoint
**Type**: `string`
**Default**: `""`
**Scope**: Machine

URL endpoint for remote audit log collection.

Example:
```json
{
  "alex.enterprise.audit.remoteLogging": true,
  "alex.enterprise.audit.remoteEndpoint": "https://your-siem.example.com/api/logs"
}
```

### alex.enterprise.audit.minLevel
**Type**: `string`
**Default**: `"info"`
**Scope**: Machine

Minimum severity level for audit events.

| Level   | Description                            |
| ------- | -------------------------------------- |
| `debug` | All events including verbose debugging |
| `info`  | Standard operations (default)          |
| `warn`  | Warnings and above                     |
| `error` | Errors only                            |

### alex.enterprise.audit.retentionDays
**Type**: `number`
**Default**: `90`
**Range**: 7-365
**Scope**: Machine

Number of days to retain audit log files.

Logs older than this value are automatically purged.

### alex.enterprise.audit.redactSensitive
**Type**: `boolean`
**Default**: `true`
**Scope**: Machine

Automatically redact sensitive data from audit logs.

When enabled, the following are masked:
- API keys and tokens
- Passwords and secrets
- Personal identifiers
- File contents that match secret patterns

---

## Secrets Scanning

### alex.enterprise.secrets.customPatterns
**Type**: `array`
**Default**: `[]`
**Scope**: Machine

Custom regex patterns for detecting organization-specific secrets. Each pattern object requires:

| Property      | Type     | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `name`        | `string` | Unique identifier for the pattern                |
| `pattern`     | `string` | Regular expression to match                      |
| `severity`    | `string` | One of: `critical`, `high`, `medium`, `low`      |
| `description` | `string` | Human-readable description shown in scan results |

Example - detecting internal API keys:
```json
{
  "alex.enterprise.secrets.customPatterns": [
    {
      "name": "internal_api_key",
      "pattern": "MYCOMPANY-[A-Za-z0-9]{32}",
      "severity": "critical",
      "description": "Internal API key detected"
    },
    {
      "name": "legacy_token",
      "pattern": "LGT_[0-9a-f]{24}",
      "severity": "high",
      "description": "Legacy system token"
    }
  ]
}
```

### alex.enterprise.secrets.disableBuiltInPatterns
**Type**: `boolean`
**Default**: `false`
**Scope**: Machine

Disable built-in secret detection patterns (use only custom patterns).

Use this when your organization has specific compliance requirements and you need complete control over what patterns are detected.

---

## Enterprise Commands

| Command                            | Description                            |
| ---------------------------------- | -------------------------------------- |
| `Alex: Scan for Secrets`           | Scan current file for exposed secrets  |
| `Alex: Scan Workspace for Secrets` | Scan entire workspace for secrets      |
| `Alex: View Audit Log`             | Open audit log viewer                  |
| `Alex: Export Audit Log`           | Export logs to file                    |

---

## Deployment Scenarios

### Personal Use (Default)
No configuration needed. Audit logging is enabled by default.

### Small Team
```json
{
  "alex.enterprise.audit.enabled": true,
  "alex.enterprise.audit.retentionDays": 30
}
```

### Corporate / Regulated
```json
{
  "alex.enterprise.audit.enabled": true,
  "alex.enterprise.audit.fileLogging": true,
  "alex.enterprise.audit.remoteLogging": true,
  "alex.enterprise.audit.remoteEndpoint": "https://siem.corp.example.com/api/logs",
  "alex.enterprise.audit.retentionDays": 365,
  "alex.enterprise.audit.redactSensitive": true
}
```

### High Security
```json
{
  "alex.enterprise.audit.enabled": true,
  "alex.enterprise.audit.minLevel": "debug",
  "alex.enterprise.audit.remoteLogging": true,
  "alex.enterprise.audit.remoteEndpoint": "https://siem.corp.example.com/api/logs",
  "alex.enterprise.audit.retentionDays": 365,
  "alex.enterprise.audit.redactSensitive": true,
  "alex.enterprise.audit.consoleLogging": true
}
```

---

## Troubleshooting

### Audit Log Issues

**Logs not appearing**
- Verify `alex.enterprise.audit.enabled` is `true`
- Check `alex.enterprise.audit.minLevel` isn't filtering events
- For file logging, verify write permissions to log path

**Remote logging failing**
- Verify `alex.enterprise.audit.remoteEndpoint` is reachable
- Check network/firewall settings
- Ensure endpoint accepts POST requests with JSON body

---

## Planned Features

The following enterprise features are planned but **not yet implemented**:

- **Entra ID SSO Authentication** — Sign in with Microsoft Entra ID
- **Role-Based Access Control (RBAC)** — Viewer/Contributor/Admin/Owner roles
- **Tenant Restrictions** — Limit access to specific Entra ID tenants
- **Microsoft Graph Integration** — Calendar, mail, presence, and people context

See [ROADMAP-UNIFIED.md](../../ROADMAP-UNIFIED.md) for timeline.

---

*Last updated: 2026-02-26*
*Settings documented: 11 (all implemented)*
