---
applyTo: "**/*security*,**/*auth*,**/*credential*,**/*secret*,**/*vulnerability*,**/*CVE*"
---

# Microsoft Secure Future Initiative (SFI) Skill

> Security-first development practices aligned with Microsoft's SFI.

## ⚠️ Staleness Warning

Security practices evolve with new threats, vulnerabilities, and industry standards.

**Refresh triggers:**

- New CVEs affecting our stack
- Microsoft SFI updates
- Major security incidents (industry-wide)
- Dependency security advisories
- Compliance requirement changes

**Last validated:** February 2026

**Check current state:** [Microsoft SFI](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative), [OWASP](https://owasp.org/), [CVE Database](https://cve.mitre.org/)

---

## SFI Core Principles

Three principles anchor Microsoft's approach to SFI:

| Principle | Focus |
| --------- | ----- |
| **Secure by Design** | Security comes first when designing any product or service |
| **Secure by Default** | Protections enabled/enforced by default, require no extra effort, not optional |
| **Secure Operations** | Security controls and monitoring continuously improved for current/future threats |

> **Satya's Mandate (May 2024):** "If you're faced with the tradeoff between security and another priority, your answer is clear: Do security."

---

## SFI Foundations

Four foundations that underpin successful security operations:

| Foundation | Description |
| ---------- | ----------- |
| **Security-first Culture** | Daily behaviors reinforced through regular meetings between engineering and SFI leaders |
| **Security Governance** | Framework led by CISO, partnering with engineering teams to oversee SFI and manage risks |
| **Continuous Improvement** | Growth mindset integrating feedback and learnings from incidents into standards |
| **Paved Paths & Standards** | Best practices that optimize productivity, compliance, and security at scale |

---

## SFI Six Pillars

| Pillar | Focus |
| ------ | ----- |
| **Protect Identities & Secrets** | Best-in-class standards for identity/secrets infrastructure, phishing-resistant MFA |
| **Protect Tenants & Isolate Systems** | Tenant isolation and production system protection |
| **Protect Networks** | Network security and segmentation |
| **Protect Engineering Systems** | Secure development infrastructure and CI/CD |
| **Monitor & Detect Cyberthreats** | Continuous threat monitoring and detection |
| **Accelerate Response & Remediation** | Fast incident response and recovery |

---

## Secure by Design

### Threat Modeling (STRIDE)

| Threat | Question | Mitigation |
| ------ | -------- | ---------- |
| **S**poofing | Can someone pretend to be someone else? | Authentication |
| **T**ampering | Can data be modified? | Integrity checks |
| **R**epudiation | Can actions be denied? | Logging, audit trail |
| **I**nformation Disclosure | Can data leak? | Encryption, access control |
| **D**enial of Service | Can service be disrupted? | Rate limiting, redundancy |
| **E**levation of Privilege | Can someone gain more access? | Least privilege |

### Security Requirements Checklist

Before coding:

- [ ] Authentication method defined
- [ ] Authorization model designed
- [ ] Data classification done
- [ ] Encryption requirements clear
- [ ] Logging requirements defined
- [ ] Third-party dependencies reviewed

## Secure by Default

### Principle of Least Privilege

```typescript
// Bad: Admin access by default
const user = { role: 'admin', permissions: ['*'] };

// Good: Minimum permissions
const user = { role: 'viewer', permissions: ['read:own'] };
```

### Secure Defaults

```typescript
// Bad: Optional security
createServer({ https: false, cors: '*' });

// Good: Secure by default
createServer({
    https: true,
    cors: ['https://trusted.com'],
    helmet: true
});
```

### Input Validation

```typescript
// Validate and sanitize ALL input
function processInput(input: unknown) {
    const validated = schema.parse(input); // Zod, Joi, etc.
    const sanitized = sanitize(validated);
    return sanitized;
}
```

## OWASP Top 10 Quick Reference

| Risk | Prevention |
| ---- | ---------- |
| Broken Access Control | Check permissions on every request |
| Cryptographic Failures | Use strong, modern crypto |
| Injection | Parameterized queries, no string concat |
| Insecure Design | Threat modeling, secure patterns |
| Security Misconfiguration | Secure defaults, remove unused features |
| Vulnerable Components | Dependency scanning, updates |
| Auth Failures | MFA, secure session management |
| Data Integrity | Signatures, checksums |
| Logging Failures | Comprehensive audit logging |
| SSRF | Allowlist URLs, validate requests |

## Credential Management

### Never Hardcode

```typescript
// NEVER
const apiKey = 'sk-1234567890abcdef';

// ALWAYS
const apiKey = process.env.API_KEY;
// Or: Azure Key Vault, AWS Secrets Manager, etc.
```

### Rotate Regularly

```text
Credential Type     | Rotation Period
--------------------|----------------
API Keys            | 90 days
Service Passwords   | 90 days
Certificates        | 1 year
User Passwords      | User discretion + breach response
```

### Secrets in Git

If secrets accidentally committed:

1. **Revoke immediately** — The secret is compromised
2. **Remove from history** — `git filter-branch` or BFG
3. **Rotate** — Generate new credentials
4. **Audit** — Check for unauthorized use

## Dependency Security

### Regular Audits

```powershell
# npm
npm audit
npm audit fix

# Check for outdated
npm outdated
```

### Automated Scanning

- Dependabot (GitHub)
- Snyk
- npm audit in CI/CD

### Update Strategy

| Severity | Response Time |
| -------- | ------------- |
| Critical | 24-48 hours |
| High | 1 week |
| Medium | 2 weeks |
| Low | Next release |

## Security Code Review

### Checklist

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Output encoding for XSS
- [ ] SQL uses parameterized queries
- [ ] Auth checks on all endpoints
- [ ] Sensitive data encrypted
- [ ] Errors don't leak info
- [ ] Dependencies up to date

### Red Flags

```text
🚩 eval(), exec(), dangerouslySetInnerHTML
🚩 String concatenation in queries
🚩 Disabled security features
🚩 Overly permissive CORS
🚩 Secrets in code or config files
🚩 Missing rate limiting
🚩 Verbose error messages
```

## Incident Response (Security)

1. **Contain** — Limit blast radius
2. **Preserve** — Don't destroy evidence
3. **Notify** — Security team, legal if needed
4. **Investigate** — What happened, how
5. **Remediate** — Fix + prevent recurrence
6. **Report** — Breach notification if required

## Synapses

See [synapses.json](synapses.json) for connections.
