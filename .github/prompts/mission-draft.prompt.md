---
description: "Mission Profile: Draft Mode — optimistic execution, skip Validator loop, move fast"
agent: Alex
---

# Mission Profile: Draft Mode

Behavioral preset for rapid prototyping and exploration sessions. Activate when user says "switch to draft mode" or during early-stage work.

## Agent Behavior Modifications

| Agent         | Modification                                           |
| ------------- | ------------------------------------------------------ |
| **Alex**      | Skip Validator loop; accept working-but-imperfect code |
| **Builder**   | Happy path first; TODOs for edge cases; no polish pass |
| **Validator** | Only invoked if user explicitly requests review        |

## Rules

- Optimize for speed and learning, not production quality
- Accept technical debt if it's tracked (TODOs with context)
- Skip multi-pass refinement; single-pass implementation
- No blocking on style, naming, or documentation
- When switching out of draft mode, flag accumulated TODOs for resolution

## Exit Criteria

- Feature works on the happy path
- Known shortcuts documented as TODOs
- Ready to transition to a standard or release-mode session for hardening
