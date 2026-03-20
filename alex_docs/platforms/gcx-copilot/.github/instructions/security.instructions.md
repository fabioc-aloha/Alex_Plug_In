---
applyTo: "**/*"
---

# Security Standards

When working with any files, follow these security guidelines:

## Secrets
- NEVER commit secrets, keys, or credentials
- Use environment variables or Key Vault
- Check for accidental secret exposure

## Input Validation
- Validate and sanitize all inputs
- Use parameterized queries for databases
- Escape output to prevent XSS

## Authentication
- Use managed identities where possible
- Implement least privilege access
- Rotate credentials regularly

## Logging
- Never log sensitive data (PII, credentials)
- Include correlation IDs
- Log security events for audit

## Dependencies
- Keep dependencies updated
- Review changelogs for security fixes
- Use lockfiles for reproducibility
