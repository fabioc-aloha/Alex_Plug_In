---
description: Systematic debugging session — from error to fix
agent: Alex
---

# /debug - Systematic Debugging

> **Avatar**: Call `alex_cognitive_state_update` with `state: "debugging"`. This updates the welcome sidebar avatar.

Reproduce → Isolate → Hypothesize → Fix → Verify.

## Process

1. **Reproduce** — Can you trigger the error consistently?
2. **Read the error** — Stack trace top-down for cause, bottom-up for context
3. **Isolate** — What's the smallest failing case?
4. **Hypothesize** — One theory at a time, test each
5. **Fix** — Minimal change, run tests
6. **Verify** — Regression test added, full suite green

## Start

Share the error, stack trace, or describe the unexpected behavior. I'll work through it systematically.

> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
