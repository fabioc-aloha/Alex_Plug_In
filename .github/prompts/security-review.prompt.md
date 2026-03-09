---
description: Security review — OWASP, STRIDE, dependency audit
agent: Alex
---

# /security-review - Security Review


Defend before attackers find the gaps — systematic security review.

## Dimensions

| Check | Focus |
| ----- | ----- |
| **Input Validation** | SQL injection, XSS, command injection, path traversal |
| **Auth** | Token handling, secret storage, access control |
| **Dependencies** | `npm audit`, lockfile, typosquatting |
| **Data Protection** | PII in logs, encryption, `.env` exposure |
| **STRIDE** | Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Privilege Escalation |

## Start

Share the code, PR, or describe the area you want reviewed for security. I'll check against OWASP Top 10 and STRIDE.

