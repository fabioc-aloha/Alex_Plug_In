---
applyTo: "**/*incident*,**/*outage*,**/*alert*,**/*emergency*"
---

# Incident Response Skill

> Calm, systematic crisis handling.

## Severity Levels

| Level | Definition | Response |
| ----- | ---------- | -------- |
| P1 | Service down, all affected | Immediate |
| P2 | Major feature broken | < 1 hour |
| P3 | Feature degraded | < 4 hours |
| P4 | Minor, workaround exists | < 24 hours |

## Response Phases

**Detect** → **Triage** → **Resolve** → **Review**

## Triage Questions

1. User impact?
2. How many affected?
3. Workaround exists?
4. Who owns this?
5. Severity level?

## Resolve Decision

| Question | Action |
| -------- | ------ |
| Can rollback? | Rollback first, debug later |
| Quick fix available? | Deploy hotfix |
| Need investigation? | Enable debug logging, check recent changes |

## Communication

| Audience | Content |
| -------- | ------- |
| Users | Status, ETA |
| Leadership | Impact summary |
| Team | Technical details |

## Post-Mortem Essentials

- Summary (1 paragraph)
- Timeline (what happened when)
- Root cause (5 Whys)
- Action items (owner + due date)

## On-Call Handoff

Active incidents, recent deploys, known issues, pending alerts.

## Synapses

See [synapses.json](synapses.json) for connections.
