---
applyTo: "**/*privacy*,**/*consent*,**/*data*,**/*PII*,**/*GDPR*,**/*responsible*,**/*ethical*,**/*bias*,**/*fairness*"
---

# Privacy & Responsible AI Skill

> Privacy by design, data protection, and responsible AI principles.

## ⚠️ Staleness Warning

Privacy regulations and AI ethics guidelines evolve continuously.

**Refresh triggers:**

- New privacy laws (state, country, region)
- AI regulation updates (EU AI Act, etc.)
- Industry standard changes
- Major incident learnings

**Last validated:** January 2026

**Check current state:** [Microsoft RAI](https://www.microsoft.com/en-us/ai/responsible-ai), [GDPR](https://gdpr.eu/), [CCPA](https://oag.ca.gov/privacy/ccpa)

---

## Privacy by Design Principles

| Principle | Implementation |
| --------- | -------------- |
| **Minimize** | Collect only what's needed |
| **Purpose** | Use data only for stated purpose |
| **Consent** | Get explicit permission |
| **Access** | Let users see their data |
| **Deletion** | Let users delete their data |
| **Security** | Protect data at rest and in transit |
| **Transparency** | Explain what you collect and why |

## Data Classification

| Level | Examples | Handling |
| ----- | -------- | -------- |
| **Public** | Marketing content | No restrictions |
| **Internal** | Employee directory | Internal only |
| **Confidential** | Customer data, PII | Encrypted, access-controlled |
| **Restricted** | Credentials, health data | Maximum protection |

## PII Checklist

Personal Identifiable Information includes:

- [ ] Names
- [ ] Email addresses
- [ ] Phone numbers
- [ ] Physical addresses
- [ ] IP addresses
- [ ] Device IDs
- [ ] Location data
- [ ] Financial data
- [ ] Health data
- [ ] Biometric data

## Responsible AI Principles

### Microsoft's 6 Principles

| Principle | Question to Ask |
| --------- | --------------- |
| **Fairness** | Does it treat all groups equitably? |
| **Reliability** | Does it work consistently and safely? |
| **Privacy** | Does it protect user data? |
| **Inclusiveness** | Does it work for everyone? |
| **Transparency** | Can users understand how it works? |
| **Accountability** | Who is responsible for outcomes? |

### Bias Detection

```text
Ask:
1. What data was the model trained on?
2. Are there underrepresented groups?
3. What are the failure modes?
4. Who might be harmed by errors?
5. Have we tested with diverse inputs?
```

### AI Transparency

```markdown
## How This AI Works

**What it does**: [Clear description]
**What it doesn't do**: [Limitations]
**Data used**: [What inputs, how stored]
**Human oversight**: [When humans review]
**How to appeal**: [Process for disputes]
```

## Code Patterns

### Don't Log PII

```typescript
// Bad
console.log(`User ${email} logged in`);

// Good
console.log(`User ${hashUserId(userId)} logged in`);
```

### Consent Before Collection

```typescript
// Get explicit consent
const consent = await showConsentDialog({
    purpose: 'Improve recommendations',
    data: ['usage patterns', 'preferences'],
    retention: '90 days',
    optOut: 'Settings > Privacy'
});

if (!consent.granted) {
    return fallbackBehavior();
}
```

### Data Minimization

```typescript
// Bad: Store everything
saveUser({ ...fullUserObject });

// Good: Store only what's needed
saveUser({
    id: user.id,
    preferences: user.preferences
    // Don't store: email, name, location
});
```

### Right to Deletion

```typescript
async function deleteUserData(userId: string) {
    await db.users.delete(userId);
    await db.userPreferences.delete(userId);
    await db.userHistory.delete(userId);
    await analytics.purge(userId);
    await logs.redact(userId);

    return { deleted: true, timestamp: new Date() };
}
```

## Regulatory Quick Reference

| Regulation | Region | Key Requirements |
| ---------- | ------ | ---------------- |
| GDPR | EU | Consent, access, deletion, breach notification |
| CCPA/CPRA | California | Disclosure, opt-out, deletion |
| LGPD | Brazil | Similar to GDPR |
| PIPL | China | Data localization, consent |
| HIPAA | US Healthcare | Health data protection |

## AI Incident Response

When AI causes harm:

1. **Stop** — Disable the feature immediately
2. **Assess** — Who was affected, how severely
3. **Notify** — Inform affected users
4. **Fix** — Root cause + prevention
5. **Document** — Post-mortem for learning

## Synapses

See [synapses.json](synapses.json) for connections.
