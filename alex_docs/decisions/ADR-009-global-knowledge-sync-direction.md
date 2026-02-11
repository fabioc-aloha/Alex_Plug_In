# ADR-009: Global Knowledge Sync Direction

**Status**: Accepted
**Date**: 2026-02-11
**Context**: Skill Inheritance from Global Knowledge

---

## Context

The Alex Cognitive Architecture uses Global Knowledge (`~/.alex/global-knowledge/`) as a shared repository for cross-project learnings. With the new skill inheritance feature (`Alex: Inherit Skill from Global`), heirs can pull skills from this repository.

The question arose: **Should heirs be able to push improvements back to Global Knowledge?**

## Decision

**Unidirectional flow: Master → Global → Heirs**

Heirs can PULL from Global Knowledge but cannot directly PUSH improvements back.

### Rationale

1. **Quality Control**: Master Alex is the source of truth. Uncontrolled heir contributions could introduce inconsistencies, duplicates, or low-quality content.

2. **Version Coherence**: If multiple heirs modify the same skill independently, merge conflicts and version divergence would occur.

3. **Architectural Integrity**: Global Knowledge patterns are curated and validated. Automatic promotion bypasses quality gates.

4. **Complexity Avoidance**: Bidirectional sync requires conflict resolution, version locking, and consensus mechanisms — significant complexity for limited benefit.

### Approved Workflow for Heir Improvements

When an heir improves a skill:

```text
1. Heir develops improvement locally
2. Human reviews and validates improvement
3. Human manually promotes to Master Alex:
   - Copy improvement to Master's .github/skills/
   - Validate with `Alex: Dream`
4. Master syncs to Global Knowledge via curation protocol
5. Other heirs can re-inherit the improved version
```

### Future Consideration: Propose-to-Global

A lighter-weight "propose improvement" workflow could be implemented later:

```text
Heir creates:    ~/.alex/proposals/skill-improvement-{timestamp}.md
Human reviews:   Accepts/rejects proposals during curation
If accepted:     Manually apply to Master → Global
```

This would provide visibility without automatic promotion risk.

## Consequences

### Positive
- Clear source of truth (Master Alex)
- Quality control maintained
- No merge conflicts in Global Knowledge
- Simple mental model for users

### Negative
- Heir improvements require manual promotion
- Potential friction for power users
- Good ideas may get lost if not promoted

### Mitigations
- Encourage meditation sessions to surface improvements
- Document the promotion workflow clearly
- Consider proposal mechanism in future version

## Related

- [global-knowledge-curation.instructions.md](../../.github/instructions/global-knowledge-curation.instructions.md)
- [heir-skill-promotion.instructions.md](../../.github/instructions/heir-skill-promotion.instructions.md)
- [inheritSkill.ts](../../platforms/vscode-extension/src/commands/inheritSkill.ts)
