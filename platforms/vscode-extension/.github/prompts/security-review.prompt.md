---
description: Security review — OWASP, STRIDE, dependency audit
agent: Alex
---

# /security-review - Security Review

> **Avatar**: Call `alex_cognitive_state_update` with `state: "reviewing"`. This updates the welcome sidebar avatar.

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

> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
