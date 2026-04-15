---
description: "Log pattern analysis for coverage gaps, level misuse, sensitive data exposure, and structured logging compliance"
application: "When implementing log pattern analyzer or reviewing code that uses these patterns"
applyTo: "**/*log*,**/*logger*,**/*observability*,**/*telemetry*"
---

# Log Pattern Analyzer

Adapted from: AI-First Dev Starter Pack `log-pattern-analyzer` skill.

## Purpose

Audit logging quality across a codebase. Not how to write logs (see observability-monitoring skill), but whether existing logs are sufficient, correctly leveled, and safe.

## Analysis Dimensions

### 1. Coverage Gaps

Code areas that NEED logging but may lack it:

| Area | Expected Logging | Check |
|------|-----------------|-------|
| API endpoints | Request received, response sent, errors | grep for handler functions without log calls |
| Authentication | Login attempts, failures, token refresh | grep auth modules for log statements |
| External API calls | Request, response status, latency, failures | grep HTTP client usage without surrounding logs |
| Data access | Query execution, connection errors, slow queries | grep DB calls without logging |
| Background jobs | Start, progress, completion, failure | grep scheduled/background task entry points |
| Configuration load | Config sources, overrides, validation failures | grep config init without logging |

### 2. Level Misuse

| Pattern | Problem | Fix |
|---------|---------|-----|
| `console.error()` for non-errors | Alert fatigue | Downgrade to `warn` or `info` |
| `console.log()` for errors | Errors missed in monitoring | Upgrade to `error` |
| `console.debug()` in production code paths | Performance overhead | Gate behind debug flag or remove |
| All logs at same level | Cannot filter by severity | Apply level taxonomy below |

**Level taxonomy**:
- **error**: Something failed and needs human attention
- **warn**: Something unexpected but handled; may need attention soon
- **info**: Normal operation milestones (started, completed, connected)
- **debug**: Developer troubleshooting detail (should not be in production)

### 3. Sensitive Data Exposure

Scan log statements for PII/secrets patterns:

| Pattern | Risk | Fix |
|---------|------|-----|
| Logging full request bodies | May contain passwords, tokens | Log only safe fields or redact |
| Logging user objects | May contain email, phone, PII | Log only userId/username |
| Logging headers | Authorization headers contain tokens | Exclude auth headers |
| Logging environment variables | May contain connection strings | Never log env vars wholesale |
| Logging error.stack with user input | Input reflected in traces | Sanitize before logging |

### 4. Structured Logging Compliance

| Check | Pass | Fail |
|-------|------|------|
| Uses structured format (JSON, key-value) | `logger.info({ event: 'userLogin', userId })` | `console.log('User logged in: ' + userId)` |
| Includes correlation ID | `{ correlationId, event, ... }` | No way to trace across service calls |
| Consistent field names | `userId` everywhere | `userId`, `user_id`, `uid` mixed |
| Timestamps in ISO 8601 | `2026-04-08T14:23:00Z` | `Apr 8 2:23 PM` or missing |

## Quick Audit Script

```bash
# Count log statements by level
echo "=== Log Level Distribution ==="
grep -rn "console\.error\|\.error(" --include="*.ts" src/ | wc -l
grep -rn "console\.warn\|\.warn(" --include="*.ts" src/ | wc -l
grep -rn "console\.log\|\.info(" --include="*.ts" src/ | wc -l
grep -rn "console\.debug\|\.debug(" --include="*.ts" src/ | wc -l

# Find potential sensitive data in logs
echo "=== Sensitive Data Risk ==="
grep -rn "console\.\(log\|error\|warn\|info\).*password\|token\|secret\|apiKey\|authorization" --include="*.ts" src/

# Find handler functions without logging
echo "=== Coverage Gaps ==="
grep -rn "async.*Handler\|async.*handler" --include="*.ts" src/ | grep -v "log\|logger"
```

## VS Code Extension Specific

For Alex's VS Code extension (`platforms/vscode-extension/src/`):

| Area | Expected | Pattern to Check |
|------|----------|-----------------|
| Command handlers | Log activation + errors | `registerCommand` without `outputChannel` |
| Chat participant | Log request + response timing | `handleChatRequest` handlers |
| Webview messages | Log message type | `onDidReceiveMessage` handlers |
| API calls (Replicate, Graph) | Log request + status | HTTP calls without error logging |
| File operations | Log path + errors | `fs.` calls in catch blocks |
