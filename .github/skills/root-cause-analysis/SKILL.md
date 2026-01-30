---
applyTo: "**/*debug*,**/*error*,**/*bug*,**/*issue*,**/*problem*"
---

# Root Cause Analysis Skill

> Systematic problem-solving to find the true source, not just symptoms.

## The Core Principle

> **Fixing symptoms creates more symptoms. Fix the root cause.**

## The 5 Whys

Start with the problem, ask "Why?" five times.

```text
Problem: The website is down.
Why? → The server crashed.
Why? → It ran out of memory.
Why? → A process had a memory leak.
Why? → We're loading all records into memory.
Why? → The original query was simple, we never paginated.

Root Cause: Missing pagination in database query.
```

**Trap**: Stopping at human error ("developer made a mistake"). Ask why the mistake was possible.

## Fishbone Diagram (Ishikawa)

Categorize potential causes:

```text
        People ──────┐
                     │
      Process ───────┼───────► Problem
                     │
    Technology ──────┤
                     │
   Environment ──────┘
```

**Categories for software:**

| Category | Examples |
| -------- | -------- |
| Code | Bug, missing validation, race condition |
| Data | Corrupt data, unexpected input, missing records |
| Infrastructure | Server, network, disk, memory |
| Dependencies | Third-party service, library version |
| Configuration | Environment variables, feature flags |
| Process | Missing review, unclear requirements |

## Fault Tree Analysis

Work backwards from the failure:

```text
                    [Website Down]
                          │
            ┌─────────────┼─────────────┐
            │             │             │
      [Server Crash] [Network Down] [DNS Failure]
            │
      ┌─────┴─────┐
      │           │
  [OOM]      [CPU 100%]
      │
  [Memory Leak]
```

## Timeline Analysis

For intermittent or complex issues:

| Time | Event | Notes |
| ---- | ----- | ----- |
| 10:00 | Deploy v2.3.1 | New feature release |
| 10:15 | Traffic spike | Marketing email sent |
| 10:22 | First error | Memory warning |
| 10:25 | Server OOM | Restart triggered |

**Look for**: What changed? What correlates?

## Debugging vs Root Cause

| Debugging | Root Cause Analysis |
| --------- | ------------------- |
| "What is broken?" | "Why did it break?" |
| Find the bug | Find the systemic issue |
| Fix this instance | Prevent future instances |
| Quick | Thorough |

## Root Cause Categories

| Category | Question | Fix Type |
| -------- | -------- | -------- |
| **Technical** | What code/config caused this? | Code fix |
| **Process** | What process allowed this? | Process fix |
| **Systemic** | What system property enabled this? | Architecture fix |

## The "Fix + Prevent" Pattern

For every root cause, define:

1. **Immediate fix**: Stop the bleeding
2. **Permanent fix**: Address root cause
3. **Prevention**: Stop recurrence

```markdown
## Issue: Production database corrupted

### Immediate Fix
- Restore from last night's backup
- Estimated: 2 hours

### Permanent Fix
- Fix the migration script that caused corruption
- Add transaction rollback on failure

### Prevention
- Add pre-production migration testing
- Enable point-in-time recovery
- Add data integrity checks
```

## Common Root Cause Patterns

| Symptom | Often Caused By |
| ------- | --------------- |
| Memory leak | Unclosed resources, growing caches |
| Slow performance | N+1 queries, missing indexes |
| Intermittent failures | Race conditions, timeouts |
| Data corruption | Missing validation, concurrent writes |
| Security breach | Missing auth check, SQL injection |

## Post-Mortem Template

```markdown
## Incident: [Brief description]
**Date**: YYYY-MM-DD
**Duration**: X hours
**Severity**: P1/P2/P3

## Summary
What happened in 2-3 sentences.

## Timeline
| Time | Event |
| ---- | ----- |
| ... | ... |

## Root Cause
5 Whys or fishbone analysis result.

## Resolution
What fixed it immediately.

## Action Items
| Action | Owner | Due |
| ------ | ----- | --- |
| Permanent fix | ... | ... |
| Prevention | ... | ... |
```

## Synapses

See [synapses.json](synapses.json) for connections.
