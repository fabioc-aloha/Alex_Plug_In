---
description: Investigate a bug or failure using systematic root cause analysis
agent: Alex
---

# /rca - Root Cause Analysis

> **Avatar**: Call `alex_cognitive_state_update` with `state: "debugging"`. This updates the welcome sidebar avatar.

Find the true source, not symptoms — systematic investigation from observation to permanent fix.

## Process

1. **Reproduce** — Can you trigger the issue consistently?
2. **Isolate** — What's the smallest failing case?
3. **5 Whys** — Dig past symptoms to the system-level cause
4. **Categorize** — Code, data, infra, dependency, config, or process?
5. **Fix + Test** — Write a test that captures the root cause, then fix
6. **Prevent** — Add automation to catch this class of issue

## Start

Describe the bug, error, or failure you're investigating. Include:
- What happened (symptoms)
- When it started (context)
- What you've already tried

> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
