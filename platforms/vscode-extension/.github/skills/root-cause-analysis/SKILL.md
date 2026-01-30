---
applyTo: "**/*debug*,**/*error*,**/*bug*,**/*issue*,**/*problem*"
---

# Root Cause Analysis Skill

> Find the true source, not symptoms.

## Core Principle

Fixing symptoms creates more symptoms. Fix root cause.

## 5 Whys

Ask "Why?" until you reach the systemic issue.

**Trap**: Don't stop at "human error." Ask why the mistake was possible.

## Cause Categories

| Category | Examples |
| -------- | -------- |
| Code | Bug, validation, race condition |
| Data | Corrupt, unexpected input |
| Infrastructure | Server, network, disk |
| Dependencies | Third-party, library version |
| Configuration | Env vars, feature flags |
| Process | Missing review, unclear requirements |

## Timeline Analysis

| Time | Event | Notes |
| ---- | ----- | ----- |

**Look for**: What changed? What correlates?

## Fix + Prevent Pattern

1. **Immediate**: Stop the bleeding
2. **Permanent**: Fix root cause
3. **Prevention**: Stop recurrence

## Common Patterns

| Symptom | Likely Cause |
| ------- | ------------ |
| Memory leak | Unclosed resources |
| Slow performance | N+1 queries, missing indexes |
| Intermittent failures | Race conditions |
| Data corruption | Missing validation |

## Post-Mortem

Summary → Timeline → Root Cause → Action Items (owner + due)

## Synapses

See [synapses.json](synapses.json) for connections.
