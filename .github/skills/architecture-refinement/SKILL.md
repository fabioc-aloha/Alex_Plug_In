# Architecture Refinement Skill

> Meta-skill for maintaining and evolving Alex's cognitive architecture through deliberate documentation and pattern extraction.

## Purpose

This skill enables Alex to:

- Recognize when a learning session produces architecture-worthy insights
- Document patterns in the appropriate alex_docs location
- Update migration trackers and status tables
- Consolidate knowledge files following KISS/DRY principles

## When to Apply

Trigger this skill when:

- A session resolves a recurring problem (document the pattern)
- A DK file is migrated or consolidated (update trackers)
- A new workflow emerges (capture in appropriate .instructions.md)
- User feedback reveals a principle ("don't over-simplify")

## Core Patterns

### Pattern Recognition Checklist

Before session ends, ask:

| Question | If Yes → Action |
| -------- | --------------- |
| Did we solve a problem that could recur? | Document in relevant skill or DK file |
| Did we learn something about Alex's architecture? | Update alex_docs/ |
| Did a file get created/deleted/consolidated? | Update migration trackers |
| Did user correct AI behavior? | Add to skill's Anti-Patterns + document principle |
| Did the skill itself get improved during use? | Commit the refinement immediately |

### Documentation Location Guide

| What You Learned | Where to Document |
| ---------------- | ----------------- |
| Technical skill pattern | `.github/skills/{name}/SKILL.md` |
| Architecture evolution | `alex_docs/SKILL-ARCHITECTURE.md` |
| Process improvement | `.github/instructions/*.instructions.md` |
| Complex workflow | `.github/prompts/*.prompt.md` |
| Domain expertise | `.github/domain-knowledge/DK-*.md` |
| Tool-specific learning | Relevant skill or new skill |

### Consolidation Decision Tree

```text
Is new knowledge related to existing skill?
├── Yes (>50% overlap) → Consolidate INTO existing skill
│   └── Update migration tracker as "Consolidated"
└── No (<50% overlap) → Create new skill
    └── Add to migration tracker as "Migrated"
```

### Pattern Extraction Template

When documenting a learned pattern:

```markdown
### [Pattern Name]

**Pattern**: [One-sentence description of what to do]

**Example**: [Concrete instance from the session]

**Why**:

- [Reason 1]
- [Reason 2]

**Anti-pattern**: [What NOT to do, if applicable]
```

## Quality Checks

Before committing documentation updates:

- [ ] Markdown lint-clean (blank lines around lists, proper headings)
- [ ] Tables have header separators
- [ ] No orphaned references to deleted files
- [ ] Migration trackers reflect current state
- [ ] Commit message follows conventional format

## Anti-Patterns

| Don't | Do Instead |
| ----- | ---------- |
| Document every minor fix | Only architecture-worthy insights |
| Create new file for each learning | Consolidate into existing structure |
| Wait until end of session | Document as patterns emerge |
| Over-document obvious things | Focus on non-obvious learnings |
| Skip human feedback | Capture corrective principles explicitly |

## User Coaching Learning Loop

The most valuable learning often comes from user corrections:

```text
┌─────────────────────────────────────────────────────────┐
│              USER COACHING LEARNING LOOP                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│   │   AI    │--->│  User   │--->│   AI    │             │
│   │ Attempt │    │ Corrects│    │ Refines │             │
│   └────┬────┘    └────┬────┘    └────┬────┘             │
│        │              │              │                  │
│        v              v              v                  │
│   "Dumped all    "Don't dump    Added to               │
│    patterns in    in one file"   appropriate           │
│    one doc"                      skills                │
│                                                         │
│   ┌─────────────────────────────────────────────┐       │
│   │  CAPTURE THE CORRECTION AS A PRINCIPLE      │       │
│   │  in the relevant skill's Anti-Patterns      │       │
│   └─────────────────────────────────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Why User Coaching Matters

| AI Tendency | User Correction | Extracted Principle |
| ----------- | --------------- | ------------------- |
| Over-centralize | "Don't dump in one file" | Distribute to appropriate locations |
| Over-simplify | "You lost context" | Preserve nuance when consolidating |
| Skip validation | "Did you check it?" | Always verify (lint, count chars) |
| Assume completion | "What about X?" | Follow through on all aspects |

### Capturing User Feedback

When user corrects AI behavior:

1. **Acknowledge** the correction immediately
2. **Fix** the specific instance
3. **Extract** the underlying principle
4. **Document** in the relevant skill's Anti-Patterns section
5. **Commit** with message referencing the learning

---

## Connection to Bootstrap Learning

This skill operationalizes the bootstrap learning principle:

1. **Learn** → Acquire knowledge through conversation
2. **Coach** → User corrections refine understanding (NEW)
3. **Extract** → Identify reusable patterns (this skill)
4. **Document** → Persist in appropriate location (this skill)
5. **Consolidate** → Integrate during meditation

## Synapses

See [synapses.json](synapses.json) for connection mapping.
