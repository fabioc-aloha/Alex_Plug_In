---
description: "Cross-project pattern recognition, insight promotion, and knowledge synthesis protocols"
---

# Knowledge Synthesis — Auto-Loaded Rules

## Synapses

- [.github/prompts/cross-domain-transfer.prompt.md] (High, Implements, Forward) - "Cross-domain synthesis during meditation Phase 3"
- [.github/instructions/meditation.instructions.md] (Critical, Coordinates, Bidirectional) - "Synthesis is Phase 3 and Phase 4 of meditation"

Abstraction protocol, GI/GK storage formats, promotion criteria, quality gates → see knowledge-synthesis skill.

## Cross-Domain Synthesis Tool

During meditation Phase 3, invoke `alex_cognitive_cross_domain_synthesis` to get a data-driven report of domain coverage and under-connected pairs. Apply the Transfer Test (structural, actionable, independent) before creating connections. See the knowledge-synthesis skill for connection types and output format.

## The Synthesis Decision

```
Is this observation project-specific (this repo only)?
  Yes → Don't store globally (document in project docs if needed)

Could this help someone in a completely different project?
  Yes → Qualify for global knowledge (GI or GK)

Has this been proven in 2+ different projects/contexts?
  Yes → Pattern level (GK-*)
  No → Insight level (GI-*) — observe before promoting
```

**Abstraction test**: Would this help someone who has never seen this project?

Promote an insight to a pattern when:

- Observed in 2+ independent projects or contexts
- The abstracted form holds true in all cases
- The solution is actionable (not just descriptive)
- At least 2 concrete examples can be documented

**Process**: Create new GK-\* file, link back to source GI files, update index.json.

---

## Quality Gate

Before saving globally:

- [ ] Abstracted — no project-specific names or details in the core insight
- [ ] Tested — "would this help a stranger working on a different codebase?"
- [ ] Categorized — valid category from: `architecture, api-design, debugging, deployment, documentation, error-handling, patterns, performance, refactoring, security, testing, tooling, general`
- [ ] Tagged — at least 3 relevant tags
- [ ] GI vs GK chosen correctly (observation vs proven pattern)
