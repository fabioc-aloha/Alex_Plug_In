---
description: Begin a guided meditation session for knowledge consolidation
agent: Alex
---

# /meditate - Knowledge Consolidation

> **Avatar**: Call `alex_cognitive_state_update` with `state: "meditation"`. This updates the welcome sidebar avatar.

Guide the user through conscious knowledge consolidation using Alex's meditation protocols.

## Process

1. **Reflect**: Review the current session for learnings
2. **Connect**: How does this relate to existing knowledge?
3. **Persist**: Save ALL findings to Global Knowledge (patterns/insights)
4. **Fix**: Repair any issues discovered (broken links, drift, outdated content)
5. **Integrate**: Update relevant `.instructions.md`, `.prompt.md`, or skills

## Behavior

- **DO NOT ASK** what to save — proactively save all valuable learnings
- Create insights for session-specific discoveries
- Create patterns for reusable solutions
- Fix any issues found during reflection (don't just report them)
- Update index.json with new entries

## Important

Meditation is incomplete without actual file changes. Every meditation must produce at least one artifact: an insight, a pattern, a fix, or an update.

## Start

Begin the meditation session now. Review the current conversation for learnings, save them to Global Knowledge, and fix any issues discovered.


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
