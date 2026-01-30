---
applyTo: "**/*knowledge*,**/*insight*,**/*pattern*,**/*global*"
---

# Knowledge Synthesis Skill

> Cross-project pattern recognition and insight extraction.

## What is Knowledge Synthesis?

Taking learnings from one project and:

1. **Abstracting** — Removing project-specific details
2. **Generalizing** — Finding the universal pattern
3. **Connecting** — Relating to existing knowledge
4. **Storing** — Putting in the right place for reuse

## The Synthesis Process

```text
Project Learning → Abstract → Generalize → Connect → Store
     │                                                  │
     └──────────────── Cross-Project Value ────────────┘
```

## Pattern Recognition Triggers

| Signal | Potential Pattern |
| ------ | ----------------- |
| "We did this before" | Recurring solution |
| Same bug twice | Missing knowledge |
| Explaining to others | Teachable insight |
| "I wish I knew this earlier" | Onboarding content |
| Works everywhere | Universal pattern |

## Abstraction Levels

### Level 1: Project-Specific

```text
"In the Alex VS Code extension, we fixed the memory leak 
by closing file handles in the finally block"
```

### Level 2: Technology-Specific

```text
"In Node.js, always close file handles in finally blocks 
to prevent memory leaks"
```

### Level 3: Universal

```text
"Always clean up resources in finally/defer blocks, 
regardless of success or failure"
```

**Store at the highest level that remains true.**

## Knowledge Types

### Patterns (GK-*)

Reusable, abstracted, works across projects:

```markdown
# GK-RESOURCE-CLEANUP

## Pattern
Always release resources in finally/defer/cleanup blocks.

## Applies To
- File handles
- Database connections
- Network sockets
- Locks/mutexes

## Example
[Language-agnostic pseudocode]

## Anti-Pattern
Releasing in try block only → leaks on exception.
```

### Insights (GI-*)

Timestamped, contextual, lesson learned:

```markdown
# GI-2026-01-30-RACE-CONDITION

## Context
Background sync conflicting with user-triggered sync.

## Problem
Two syncs running simultaneously corrupted state.

## Solution
Added mutex lock around sync operation.

## Lesson
Background operations need coordination with foreground.
```

## Connection Discovery

When storing new knowledge, ask:

1. What existing patterns does this relate to?
2. What skills would benefit from this?
3. What instructions should reference this?
4. Are there contradicting learnings to reconcile?

## The Synthesis Checklist

Before promoting knowledge:

- [ ] Abstracted from specific project
- [ ] Named clearly (what it IS, not where it came from)
- [ ] Tagged appropriately
- [ ] Connected to related knowledge
- [ ] Example included
- [ ] Anti-pattern noted (if applicable)

## Knowledge Locations

| Type | Location | When |
| ---- | -------- | ---- |
| Project-specific | Project `DK-*.md` | Unique to project |
| Cross-project pattern | `~/.alex/global-knowledge/patterns/` | Universal |
| Cross-project insight | `~/.alex/global-knowledge/insights/` | Dated learning |
| Skill enhancement | `.github/skills/[skill]/` | Improves capability |

## Promotion Flow

```text
Project DK file
      │
      ▼ (Is this valuable cross-project?)
      │
      ├── YES → Promote to global knowledge
      │           ├── Pattern? → GK-*.md
      │           └── Insight? → GI-*.md
      │
      └── NO  → Keep in project, delete on project end
```

## Quality Over Quantity

**Don't hoard.** Knowledge synthesis is about:

- 10 great patterns > 100 mediocre notes
- Clear, actionable > comprehensive, vague
- Connected > isolated
- Living, updated > stale, forgotten

## Synapses

See [synapses.json](synapses.json) for connections.
