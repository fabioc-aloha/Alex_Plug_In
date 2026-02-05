---
name: "Security Review Skill"
description: "Defend before attackers find the gaps."
applyTo: "**/*security*,**/*auth*,**/*password*,**/*token*,**/*credential*,**/*vulnerability*"
---

# Security Review Skill

> Defend before attackers find the gaps.

## Core Principle

Security is not a feature—it's a property. Review code with adversarial thinking.

## OWASP Top 10 Checklist

| # | Vulnerability | What to Check |
|---|---------------|---------------|
| 1 | Injection | SQL, NoSQL, LDAP, OS commands—parameterize everything |
| 2 | Broken Auth | Session management, credential storage, MFA |
| 3 | Sensitive Data | Encryption at rest/transit, PII exposure, logging secrets |
| 4 | XXE | XML parsers disabled external entities? |
| 5 | Broken Access | IDOR, privilege escalation, missing authZ checks |
| 6 | Misconfig | Default credentials, error messages, headers |
| 7 | XSS | Input sanitization, output encoding, CSP |
| 8 | Insecure Deserialization | Untrusted data → object creation |
| 9 | Vulnerable Dependencies | npm audit, Dependabot, known CVEs |
| 10 | Logging & Monitoring | Audit trails, alerting, incident detection |

## Threat Modeling (STRIDE)

| Threat | Question | Mitigation |
|--------|----------|------------|
| **S**poofing | Can attacker impersonate? | Strong authentication |
| **T**ampering | Can data be modified? | Integrity checks, signatures |
| **R**epudiation | Can actions be denied? | Audit logging |
| **I**nformation Disclosure | Can secrets leak? | Encryption, access control |
| **D**enial of Service | Can system be overwhelmed? | Rate limiting, quotas |
| **E**levation of Privilege | Can attacker gain access? | Least privilege, authZ |

## Code Review Security Lens

### Authentication
```
□ Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
□ No hardcoded credentials
□ Session tokens are random, rotated, and expire
□ Failed login attempts are rate-limited
□ MFA supported where appropriate
```

### Authorization
```
□ Every endpoint has explicit access control
□ No security through obscurity (hidden URLs)
□ Resource ownership verified before access
□ Admin functions require elevated auth
□ Deny by default, allow explicitly
```

### Input Validation
```
□ All input validated on server (not just client)
□ Allowlist validation preferred over blocklist
□ File uploads restricted by type and size
□ URL redirects validated against allowlist
□ JSON/XML parsing has size limits
```

### Data Protection
```
□ Sensitive data encrypted at rest
□ TLS 1.2+ for data in transit
□ API keys/secrets in env vars, not code
□ PII minimized and retention limited
□ Logs don't contain passwords/tokens/PII
```

### Dependencies
```
□ npm audit / pip audit / cargo audit clean
□ No deprecated or unmaintained packages
□ Dependabot or Renovate enabled
□ Lock files committed
□ Known CVE check before release
```

## Quick Security Questions

Before shipping, ask:
1. **What's the worst thing an attacker could do?**
2. **What data could leak if this endpoint is exposed?**
3. **Who should NOT have access to this?**
4. **What happens if input is malicious?**
5. **Are we trusting anything we shouldn't?**

## Common Vulnerabilities by Language

| Language | Watch For |
|----------|-----------|
| JavaScript | Prototype pollution, eval(), innerHTML |
| TypeScript | Type assertions bypassing validation |
| Python | pickle deserialization, format strings |
| SQL | String concatenation in queries |
| Shell | Command injection, unquoted variables |

## Security Headers Checklist

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 0 (deprecated, use CSP)
```

## Incident Response Connection

When vulnerability found:
1. **Assess**: What's the blast radius?
2. **Contain**: Can we disable the feature?
3. **Fix**: Patch the vulnerability
4. **Verify**: Confirm fix works
5. **Learn**: Update review checklist

## Synapses

See [synapses.json](synapses.json) for connections.
