---
description: Perform epistemic code review with confidence calibration
agent: Alex
---

# /review - Epistemic Code Review

> **Avatar**: Call `alex_cognitive_state_update` with `state: "reviewing"`. This updates the welcome sidebar avatar.

Perform code review with uncertainty quantification.

## Confidence Levels

- 🔴 **HIGH** (90%+): Clear issues, well-established patterns
- 🟠 **MEDIUM-HIGH** (70-90%): Likely issues, common patterns
- 🟡 **MEDIUM** (50-70%): Possible issues, context-dependent
- 🔵 **LOW** (30-50%): Uncertain, needs verification
- ⚪ **SPECULATIVE** (<30%): Guessing, definitely verify

## Principles

Always state confidence. Never present uncertain findings as certain.

## Start

What code would you like me to review? Share files, a PR, or describe the area to examine.


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
