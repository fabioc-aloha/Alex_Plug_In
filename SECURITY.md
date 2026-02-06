# Security Policy

## Supported Versions

| Version | Supported             |
| ------- | --------------------- |
| 4.x.x   | ✅ Actively supported  |
| 3.x.x   | ⚠️ Security fixes only |
| < 3.0   | ❌ No longer supported |

## Reporting a Vulnerability

If you discover a security vulnerability in Alex Cognitive Architecture, please report it responsibly:

### 📧 Contact

**Email**: [Create a private security advisory on GitHub](https://github.com/fabioc-aloha/Alex_Plug_In/security/advisories/new)

### ⏱️ Response Time

| Severity | Initial Response | Resolution Target |
| -------- | ---------------- | ----------------- |
| Critical | 24 hours         | 7 days            |
| High     | 48 hours         | 14 days           |
| Medium   | 5 days           | 30 days           |
| Low      | 14 days          | 60 days           |

### What to Include

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Affected versions**
4. **Potential impact**
5. **Suggested fix** (if applicable)

### What to Expect

1. **Acknowledgment** — We'll confirm receipt of your report
2. **Investigation** — We'll investigate and validate the issue
3. **Fix Development** — We'll develop and test a fix
4. **Disclosure** — We'll coordinate disclosure with you
5. **Credit** — We'll credit you in the release notes (unless you prefer anonymity)

## Security Measures

### Architecture

- **Local-first design** — Data stays on your machine by default
- **No telemetry** — We don't collect usage data
- **Minimal dependencies** — Reduced supply chain attack surface
- **VS Code sandbox** — Extension runs in VS Code's security sandbox

### Secret Management

- **SecretStorage API** — API keys stored encrypted via VS Code
- **No hardcoded secrets** — All credentials externalized
- **Transient tokens** — Session tokens not persisted

### Network Security

- **HTTPS/WSS only** — All external communication encrypted
- **Minimal external calls** — Only Edge TTS and GitHub (opt-in)
- **No data exfiltration** — Your code never leaves your machine

### Webview Security

- **Content Security Policy (CSP)** — Prevents XSS attacks
- **No inline scripts** — All JavaScript in separate files
- **Sanitized HTML** — User content escaped before rendering

## Dependency Management

We regularly audit dependencies:

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update
```

### Known Dependencies

| Package    | Purpose           | Risk Level            |
| ---------- | ----------------- | --------------------- |
| `ws`       | WebSocket for TTS | Low (well-maintained) |
| `fs-extra` | File operations   | Low (well-maintained) |

## Secure Development

### Code Review

All changes undergo review for:
- [ ] Hardcoded secrets
- [ ] Unsafe operations (eval, dynamic requires)
- [ ] XSS vulnerabilities in webviews
- [ ] Path traversal risks

### Pre-Release Checklist

- [ ] `npm audit` passes
- [ ] Dependencies updated
- [ ] Security-focused code review completed
- [ ] alex_docs/audits/COMPLIANCE-AUDIT.md updated

## Incident Response

In case of a security incident:

1. **Contain** — Disable affected functionality
2. **Investigate** — Determine scope and impact
3. **Fix** — Develop and test remediation
4. **Release** — Publish patched version
5. **Notify** — Inform affected users
6. **Review** — Post-mortem and process improvement

---

*Thank you for helping keep Alex safe!*
