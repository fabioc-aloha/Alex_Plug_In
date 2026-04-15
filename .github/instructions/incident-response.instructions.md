---
description: "Calm, systematic crisis handling — from detection through post-mortem to prevention"
application: "When production issues occur, outages are detected, or urgent problems require immediate response"
applyTo: "**/*incident*,**/*outage*,**/*alert*,**/*page*"
---

# Incident Response Protocol

## Immediate Actions

1. **Acknowledge** — Own the incident, notify stakeholders, start timeline
2. **Assess** — Impact scope, user count, severity level
3. **Communicate** — Status page update, internal channel, customer comms
4. **Mitigate** — Rollback, feature flag, failover — stop the bleeding
5. **Investigate** — Root cause while mitigating (don't let perfect block good)

## Severity Levels

| Level | Impact | Response Time | Example |
|-------|--------|---------------|---------|
| SEV1 | Total outage | 5 min | All users down |
| SEV2 | Major degradation | 15 min | 50%+ affected |
| SEV3 | Partial impact | 1 hour | Feature broken |
| SEV4 | Minor issue | 4 hours | UI glitch |

## Post-Incident

- Blameless post-mortem within 48 hours
- Action items with owners and dates
- Share learnings broadly
- Update runbooks

## Anti-Patterns

- Blaming individuals
- Skipping post-mortem
- Not communicating status
- Heroic solo debugging
