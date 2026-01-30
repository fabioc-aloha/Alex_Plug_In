---
applyTo: "**/*incident*,**/*outage*,**/*alert*,**/*emergency*"
---

# Incident Response Skill

> Calm, systematic crisis handling for production issues.

## Severity Levels

| Level | Definition | Response Time | Examples |
| ----- | ---------- | ------------- | -------- |
| **P1** | Service down, all users affected | Immediate | Site unreachable, data loss |
| **P2** | Major feature broken, many affected | < 1 hour | Payment failing, auth broken |
| **P3** | Feature degraded, some affected | < 4 hours | Slow performance, minor bug |
| **P4** | Minor issue, workaround exists | < 24 hours | UI glitch, edge case |

## Incident Response Phases

```text
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  DETECT  │ → │  TRIAGE  │ → │  RESOLVE │ → │  REVIEW  │
│          │   │          │   │          │   │          │
│ Alerting │   │ Severity │   │ Fix/     │   │ Post-    │
│ Monitoring│   │ Assign   │   │ Rollback │   │ Mortem   │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
```

## Phase 1: Detect

**Goal**: Know something is wrong FAST.

- Monitoring dashboards
- Automated alerts
- User reports
- Health checks

## Phase 2: Triage

**Goal**: Assess severity, assign owner.

```markdown
1. What is the user impact?
2. How many users affected?
3. Is there a workaround?
4. Who owns this component?
5. What's the severity level?
```

## Phase 3: Resolve

### The Decision Tree

```text
Can we rollback?
├── YES → Rollback immediately, investigate after
└── NO →
    ├── Is there a quick fix? → Deploy hotfix
    └── Need investigation? →
        ├── Enable debug logging
        ├── Check recent changes
        └── Reproduce if possible
```

### Rollback First, Debug Later

For P1/P2 incidents:

```powershell
# Rollback to last known good
git checkout v3.6.0
vsce publish  # Or deploy script

# THEN investigate
git log --oneline v3.6.0..v3.7.0
```

### Communication During Incident

| Stakeholder | What They Need |
| ----------- | -------------- |
| Users | Status page update, ETA |
| Support | What to tell users |
| Leadership | Impact summary, ETA |
| Team | Technical details, assignments |

**Status Update Template**:

```text
[HH:MM] Status: Investigating / Identified / Fixing / Resolved
Impact: [Who is affected, how]
Current action: [What we're doing]
Next update: [When]
```

## Phase 4: Review (Post-Mortem)

**Goal**: Learn, don't blame.

### Post-Mortem Template

```markdown
## Incident: [Title]
**Date**: YYYY-MM-DD
**Duration**: X hours
**Severity**: P1/P2/P3
**Author**: [Name]

## Summary
One paragraph: what happened, impact, resolution.

## Timeline
| Time (UTC) | Event |
| ---------- | ----- |
| 14:00 | First alert triggered |
| 14:05 | Engineer acknowledged |
| 14:15 | Root cause identified |
| 14:30 | Rollback deployed |
| 14:35 | Service restored |

## Root Cause
5 Whys analysis or fishbone result.

## Resolution
What fixed it.

## Impact
- X users affected
- Y minutes of downtime
- $Z revenue impact (if applicable)

## Action Items
| Action | Owner | Priority | Due |
| ------ | ----- | -------- | --- |
| Add monitoring | @alice | P1 | 2026-02-01 |
| Fix root cause | @bob | P1 | 2026-02-03 |
| Improve runbook | @carol | P2 | 2026-02-07 |

## Lessons Learned
What went well, what didn't, what to improve.
```

## On-Call Practices

### Handoff Checklist

- [ ] Active incidents
- [ ] Recent deployments
- [ ] Known issues
- [ ] Pending alerts
- [ ] Contact escalation

### Runbook Essentials

```markdown
## [Service Name] Runbook

### Health Check
curl https://service.example.com/health

### Common Alerts

#### Alert: High Memory
1. Check which pods: kubectl top pods
2. If one pod: kubectl delete pod [name]
3. If all pods: Check for memory leak, rollback if recent deploy

#### Alert: High Latency
1. Check database: SELECT * FROM pg_stat_activity
2. Check external deps: curl -w "%{time_total}" [dep-url]
3. Scale if needed: kubectl scale deployment [name] --replicas=5
```

## Synapses

See [synapses.json](synapses.json) for connections.
