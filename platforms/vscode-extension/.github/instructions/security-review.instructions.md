---
description: "Security review procedure — OWASP Top 10, STRIDE, dependency audit"
applyTo: "**/*security*,**/*auth*,**/*password*,**/*token*,**/*credential*,**/*vulnerability*"
---

# Security Review Procedure

## When to Apply

Activate when: reviewing code that handles auth, credentials, user input, or external data. Also applies to dependency updates and new integrations.

## Review Checklist

### 1. Input Validation

- All user input is validated at system boundaries
- No raw SQL construction — use parameterized queries
- HTML output is escaped (XSS prevention)
- File paths are sanitized (no path traversal)
- Command arguments are escaped (no command injection)

### 2. Authentication & Authorization

- Auth checks on every protected endpoint
- Token expiry and refresh handled correctly
- Secrets stored via SecretStorage API, never in plaintext
- No credentials in source code, logs, or error messages

### 3. Dependency Security

- Run `npm audit` (or equivalent) for known vulnerabilities
- Pin dependency versions in lockfiles
- Review changelogs for breaking security changes before upgrading
- Check for typosquatting on new dependencies

### 4. Data Protection

- PII is never logged or stored unnecessarily
- Sensitive data encrypted at rest and in transit
- `.env` files excluded from version control
- No secrets in commit history (`git log -p --all -S 'password'`)

### 5. STRIDE Threat Check

| Threat | Question |
| ------ | -------- |
| **Spoofing** | Can someone impersonate a user or service? |
| **Tampering** | Can data be modified in transit or at rest? |
| **Repudiation** | Can actions be traced to responsible parties? |
| **Information Disclosure** | Can sensitive data leak? |
| **Denial of Service** | Can the system be overwhelmed? |
| **Elevation of Privilege** | Can a user gain unauthorized access? |

### 6. Report Findings

For each finding:
1. Severity: Critical / High / Medium / Low
2. Location: File and line number
3. Description: What's wrong and why it matters
4. Recommendation: How to fix it
