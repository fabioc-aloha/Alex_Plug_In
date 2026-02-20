# Knowledge Synthesis Instructions

**Auto-loaded when**: Recognizing a pattern across projects, deciding whether to save an insight globally, promoting a GI insight to a GK pattern, or curating cross-project knowledge
**Domain**: Knowledge management, pattern extraction, global knowledge curation
**Synapses**: [knowledge-synthesis/SKILL.md](../skills/knowledge-synthesis/SKILL.md)

---

## Purpose

Extract reusable knowledge from project-specific work — abstract, generalize, connect to existing patterns, and store at the highest level that remains universally true.

---

## When This Applies

**File Patterns**:
- `**/insights/GI-*.md`
- `**/patterns/GK-*.md`
- `~/.alex/global-knowledge/**`

**Contextual Triggers**:
- "We solved this problem before in another project"
- "This is the third time I've encountered this pattern"
- Post-session reflection: "What should be remembered globally?"
- Completing a debugging session with a generalizable lesson
- Noticing an antipattern that causes repeated mistakes

---

## The Synthesis Decision

**Should this be saved globally?**

```
Is this observation project-specific (Alex extension only)?
  Yes → Don't store globally (document in project docs if needed)

Could this help someone in a completely different project?
  Yes → Qualify for global knowledge (GI or GK)

Has this been proven in 2+ different projects/contexts?
  Yes → Pattern level (GK-*)
  No → Insight level (GI-*) — observe before promoting
```

---

## Abstraction Protocol

Strip project details to find the universal:

| Specific | Abstracted | Level |
| -------- | ---------- | ----- |
| "Alex synapses.json breaks on rename" | "Self-referencing metadata needs rename-aware tooling" | GK pattern |
| "DA v1.6 changed disclaimer from string to object" | "Breaking schema changes between minor versions cause silent failures" | GI insight |
| "VS Code 1.109 added chatSkills contribution" | "Platform capability distribution APIs change with each major release" | GI insight |
| "Three mermaid classDiagram bugs in one session" | "Cross-syntax diagram type pitfalls require dedicated documentation" | GK pattern |

**Test**: Would this help someone who has never seen this project and is working on a completely different codebase?

---

## Storage Format

### GI-* Insight (single observation)

```markdown
# [Insight Title]

**ID**: GI-{slug}-{YYYY-MM-DD}
**Category**: [category]
**Tags**: tag1, tag2, tag3
**Source Project**: project-name
**Date**: ISO timestamp

## Problem
[What triggered this insight]

## Insight
[The reusable learning]

## Solution/Pattern
[What worked]
```

### GK-* Pattern (proven in 2+ contexts)

```markdown
# [Pattern Title]

**ID**: GK-{pattern-slug}
**Category**: [category]
**Tags**: tag1, tag2, tag3
**Source**: Original project
**Created**: ISO timestamp

## Problem
[The recurring problem this solves]

## Pattern
[The repeatable solution]

## Examples
- Project A: [how it applied]
- Project B: [how it applied]
```

---

## Promotion Criteria (GI → GK)

Promote an insight to a pattern when:
- Observed in 2+ independent projects or contexts
- The abstracted form holds true in all cases
- The solution is actionable (not just descriptive)
- At least 2 concrete examples can be documented

**Process**: Create new GK-* file, link back to source GI files, update index.json.

---

## Quality Gate

Before saving globally:
- [ ] Abstracted — no project-specific names or details in the core insight
- [ ] Tested — "would this help a stranger working on a different codebase?"
- [ ] Categorized — valid category from: `architecture, api-design, debugging, deployment, documentation, error-handling, patterns, performance, refactoring, security, testing, tooling, general`
- [ ] Tagged — at least 3 relevant tags
- [ ] GI vs GK chosen correctly (observation vs proven pattern)
