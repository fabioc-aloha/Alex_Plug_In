---
description: "Systematic root cause investigation — 5 Whys, binary search, timeline reconstruction"
applyTo: "**/*debug*,**/*error*,**/*bug*,**/*issue*,**/*problem*,**/*incident*"
---

# Root Cause Analysis Procedure

## When to Apply

Activate when: a bug recurs after a fix, a production incident occurs, or a failure has no obvious cause.

## Investigation Protocol

### Step 1: Reproduce

- Confirm the issue is reproducible (failing test, repro steps, or log evidence)
- If not reproducible, collect environment details and timestamps

### Step 2: Isolate

- Find the smallest case that demonstrates the failure
- Binary search: `git bisect` between last-known-good and current-bad
- Strip away unrelated code/config until the minimal trigger remains

### Step 3: 5 Whys

Ask "Why?" until you reach an actionable system change:

1. Each answer must have **evidence** (logs, code, metrics)
2. Branch when multiple causes exist — don't follow a single chain
3. Stop at human error → ask "Why was it possible to make this mistake?"
4. Stop when you reach a **preventable system change**

### Step 4: Categorize the Cause

| Category | Fix Pattern |
| -------- | ----------- |
| Code | Unit test + code fix |
| Data | Validation + migration |
| Infrastructure | Monitoring + capacity |
| Dependencies | Pin version + lockfile |
| Configuration | Config validation + defaults |
| Process | Checklist + automation |

### Step 5: Fix and Verify

1. Write a failing test that captures the root cause
2. Apply the minimal fix
3. Verify the test passes
4. Check for similar patterns elsewhere (`grep` for related code)
5. Document what was found and why in the commit message

### Step 6: Prevent Recurrence

- Add automated detection (lint rule, test, CI check)
- Update relevant runbooks or checklists
- If process gap: update PR template or review guidelines
