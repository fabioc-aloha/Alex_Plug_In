# Enterprise Settings Reference

Alex Cognitive Architecture includes enterprise-grade security features for organizational deployments. This document covers all enterprise settings available in VS Code.

## Quick Start

To enable enterprise mode, add these settings to your VS Code `settings.json`:

```json
{
  "alex.enterprise.enabled": true,
  "alex.enterprise.requireAuth": true,
  "alex.enterprise.allowedTenants": ["your-tenant-id"]
}
```

---

## Authentication Settings

### alex.enterprise.enabled
**Type**: `boolean`  
**Default**: `false`  
**Scope**: Machine

Enable enterprise mode with Microsoft Entra ID authentication and enhanced security features.

When enabled:
- Activates Entra ID SSO authentication
- Enables RBAC (Role-Based Access Control)
- Activates secrets scanning
- Enables audit logging

### alex.enterprise.requireAuth
**Type**: `boolean`  
**Default**: `false`  
**Scope**: Machine

Require authentication for all Alex operations in enterprise mode.

When enabled:
- Users must sign in before using Alex commands
- Anonymous usage is blocked
- All operations are tied to authenticated identity

### alex.enterprise.allowedTenants
**Type**: `array` of `string`  
**Default**: `[]`  
**Scope**: Machine

List of allowed Entra ID tenant IDs. Leave empty to allow any tenant.

Example:
```json
{
  "alex.enterprise.allowedTenants": [
    "12345678-1234-1234-1234-123456789abc",
    "87654321-4321-4321-4321-cba987654321"
  ]
}
```

Use this to restrict access to specific organizations.

---

## Role-Based Access Control (RBAC)

### alex.enterprise.minWriteRole
**Type**: `string`  
**Default**: `"contributor"`  
**Scope**: Machine

Minimum role required for write operations in enterprise mode.

| Value | Description |
|-------|-------------|
| `viewer` | Read-only access |
| `contributor` | Can modify content (default) |
| `admin` | Full access except ownership changes |
| `owner` | Full access including role management |

Example: To require admin privileges for any modifications:
```json
{
  "alex.enterprise.minWriteRole": "admin"
}
```

---

## Audit Logging

### alex.enterprise.auditEnabled
**Type**: `boolean`  
**Default**: `true`  
**Scope**: Machine

Enable audit logging for enterprise operations. This is the master switch for all audit features.

### alex.enterprise.audit.enabled
**Type**: `boolean`  
**Default**: `true`  
**Scope**: Machine

Enable the audit logging system. More granular control than `auditEnabled`.

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

| Level | Description |
|-------|-------------|
| `debug` | All events including verbose debugging |
| `info` | Standard operations (default) |
| `warn` | Warnings and above |
| `error` | Errors only |

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

## Enterprise Commands

These commands are available when enterprise mode is enabled:

| Command | Description |
|---------|-------------|
| `Alex: Sign In (Enterprise)` | Authenticate with Microsoft Entra ID |
| `Alex: Sign Out (Enterprise)` | End authenticated session |
| `Alex: Show Auth Status` | Display current authentication state |
| `Alex: Scan for Secrets` | Scan current file for exposed secrets |
| `Alex: Scan Workspace for Secrets` | Scan entire workspace for secrets |
| `Alex: View Audit Log` | Open audit log viewer |
| `Alex: Export Audit Log` | Export logs to file |

---

## Deployment Scenarios

### Personal Use (Default)
No configuration needed. Enterprise features are disabled.

### Small Team
```json
{
  "alex.enterprise.enabled": true,
  "alex.enterprise.audit.enabled": true,
  "alex.enterprise.audit.retentionDays": 30
}
```

### Corporate / Regulated
```json
{
  "alex.enterprise.enabled": true,
  "alex.enterprise.requireAuth": true,
  "alex.enterprise.allowedTenants": ["your-corporate-tenant-id"],
  "alex.enterprise.minWriteRole": "contributor",
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
  "alex.enterprise.enabled": true,
  "alex.enterprise.requireAuth": true,
  "alex.enterprise.allowedTenants": ["single-tenant-only"],
  "alex.enterprise.minWriteRole": "admin",
  "alex.enterprise.audit.enabled": true,
  "alex.enterprise.audit.minLevel": "debug",
  "alex.enterprise.audit.remoteLogging": true,
  "alex.enterprise.audit.retentionDays": 365,
  "alex.enterprise.audit.redactSensitive": true,
  "alex.enterprise.audit.consoleLogging": true
}
```

---

## Security Best Practices

1. **Always use tenant restrictions** — Set `allowedTenants` to your organization's tenant ID
2. **Enable audit logging** — Required for compliance in regulated industries
3. **Use remote logging** — Send logs to a SIEM for centralized monitoring
4. **Set appropriate retention** — Balance storage costs with compliance requirements
5. **Keep redaction enabled** — Prevents accidental secret exposure in logs
6. **Require authentication** — Ensures all actions are attributable

---

## Troubleshooting

### Authentication Issues

**"Authentication required" when not expected**
- Check if `alex.enterprise.requireAuth` is set to `true`
- Verify your Entra ID session is active

**"Tenant not allowed"**
- Your Entra ID tenant is not in `allowedTenants`
- Contact your admin to add your tenant ID

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

*Last updated: 2026-02-10*
*Settings documented: 15*
