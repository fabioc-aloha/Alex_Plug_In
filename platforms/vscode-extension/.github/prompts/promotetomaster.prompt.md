---
description: Promote a skill or pattern from an heir project to Master Alex
agent: Alex
---

# /promotetomaster - Heir Skill Promotion

Promote a skill, pattern, or insight developed in an heir project back to Master Alex.

## Promotion Criteria

| Strong Signals | Anti-Signals |
|----------------|--------------|
| Cross-project applicability (3+ projects) | Project-specific config |
| Resolution pattern with solution | Temporary workarounds |
| Hard-won gotchas | Personal preferences |
| Architecture with rationale | Incomplete/draft content |

## Promotion Workflow

1. **Identify** — What skill/pattern from this heir deserves promotion?
2. **Evaluate** — Does it already exist in Master? Is it general-purpose?
3. **Generalize** — Remove project-specific details, extract the reusable pattern
4. **Create** — Build SKILL.md + synapses.json in Master `.github/skills/`
5. **Connect** — Add synapses to related skills and instructions
6. **Sync** — Run `npm run sync-architecture` to propagate to all heirs

## Validator Gate

Skill promotions require adversarial review:
- Is the knowledge truly general-purpose?
- Does it duplicate existing Master content?
- Is the quality level sufficient (tables, examples, anti-patterns)?

## Start

What skill or pattern would you like to promote from this heir project? Describe what you've learned that should live in Master Alex.
