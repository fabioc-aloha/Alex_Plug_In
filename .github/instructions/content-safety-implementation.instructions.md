---
description: "Procedural guide for implementing AI content safety defense-in-depth systems"
applyTo: "**/*safety*,**/*content-filter*,**/*guardrail*,**/*kill-switch*,**/*injection*"
---

# Content Safety Implementation

**Auto-loaded when**: Implementing content safety, AI guardrails, input defense, output validation, or operational safety controls
**Synapses**: [content-safety-implementation/SKILL.md](../skills/content-safety-implementation/SKILL.md)

---

## 7-Layer Defense Model

| # | Layer | Components | Purpose |
|---|-------|-----------|---------|
| 1 | **Input Defense** | Sanitizer, InjectionDetector, RateLimiter | Block malicious input |
| 2 | **Prompt Hardening** | System prompt anchoring, role separation | Prevent prompt injection |
| 3 | **Model Controls** | Azure Content Safety, temperature/token limits | Platform-level filters |
| 4 | **Output Validation** | ContentFilter, GroundTruthGuard, LengthValidator | Catch unsafe output |
| 5 | **Session Monitoring** | BehaviorTracker, SycophancyDetector | Detect abuse patterns |
| 6 | **Evolution Safety** | Prompt rollback, A/B safety gates | Prevent regression |
| 7 | **Operational** | KillSwitch, IncidentManager, AuditLog | Emergency controls |

---

## Layer 1: Input Defense Rules

1. **Sanitize**: Strip control characters, normalize Unicode, enforce length limits
2. **Detect injection**: Pattern-match known templates ("ignore previous instructions", "you are now", "act as", "pretend to be", encoded payloads)
3. **Rate limit**: Per-session caps on actions and AI calls

### Severity Response

| Severity | Action |
|----------|--------|
| Low | Log + pass sanitized input |
| Medium | Log + deflect in-character |
| High/Critical | Log + block + increment incident counter |

---

## Layer 2: Prompt Hardening Rules

- **Role anchoring**: First system message establishes AI identity
- **Instruction hierarchy**: System > Assistant > User (never reversed)
- **User input isolation**: Wrap in clear delimiters, mark as untrusted
- **Forbidden list**: Explicit behaviors the AI must never perform

---

## Layer 4: Output Validation Pipeline

```
AI Response → ContentFilter → GroundTruthGuard → LengthValidator → ToneChecker → Approved
```

- Never serve unvalidated AI output to users
- Check against sensitive data patterns (PII, secrets, domain-specific)
- Enforce max token limits per response type

---

## Layer 7: Kill Switch Levels

| Level | Behavior |
|-------|----------|
| **Green** | Normal operation |
| **Yellow** | Disable AI generation, serve cached responses |
| **Red** | Return maintenance page, all AI calls blocked |

### Incident Protocol

Detect → Classify severity → If Critical: kill switch → Investigate → Patch → Regression test → Restore → Post-mortem

---

## Self-Harm Detection

If user input suggests self-harm or crisis:
1. Pause normal flow immediately
2. Respond compassionately (never dismiss)
3. Display crisis resources (e.g., 988 Suicide & Crisis Lifeline)
4. Log incident (no PII) for review
5. Resume normal operation only after user confirmation

---

## Quality Gate

Before shipping any AI-facing feature:
- [ ] All 7 defense layers assessed (even if some are N/A)
- [ ] Input sanitization tested with adversarial prompts
- [ ] Output validation catches sensitive content leaks
- [ ] Kill switch tested and operational
- [ ] Rate limiting prevents abuse at scale
- [ ] Content rating system documented (if applicable)
