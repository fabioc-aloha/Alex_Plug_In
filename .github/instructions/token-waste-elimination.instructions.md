---
description: "Token cost reduction for cognitive architecture files -- instruction/skill overlap, waste pattern detection, applyTo optimization"
applyTo: "**/.github/instructions/*.md,**/.github/skills/*/SKILL.md,**/.github/prompts/*.md"
---

# Token Waste Elimination -- Auto-Loaded Rules

Full audit procedure, loading tier documentation, and VS Code mechanics -> see token-waste-elimination skill.

## Decision Table: Where Content Belongs

| Content Type | Put In | Not In | Why |
|-------------|--------|--------|-----|
| Decision tables, quick rules | Instruction | Skill | Compact, loads when matched |
| Routing pointers | Instruction | Skill | Delegates to on-demand tier |
| Detailed procedures, step-by-step | Skill | Instruction | On-demand progressive disclosure |
| Code examples, templates | Skill | Instruction | On-demand progressive disclosure |
| Reference material, API tables | Skill | Instruction | On-demand progressive disclosure |
| Guided workflows | Prompt | Instruction/Skill | Zero cost until `/command` |

## Size Thresholds

| File Type | Has Matching Skill | Max Lines | Action If Over |
|-----------|-------------------|-----------|----------------|
| Instruction | Yes | 50 | Trim -- move detail to skill |
| Instruction | No (standalone) | 200 | Review for splitting |
| Prompt | Any | 60 | Slim to steps + "See skill" |
| Skill body | Any | 400 | Consider resource files |

## Rule Inferability Taxonomy

Score each instruction rule 1-5 to determine if it's worth the token cost:

| Score | Meaning | Action |
|-------|---------|--------|
| 1 | Trivially inferable from the file being edited | Remove |
| 2 | Inferable from nearby files in the same directory | Remove |
| 3 | Inferable only from deliberate cross-project reading | Keep if cheap |
| 4 | Inferable only from systematic multi-project analysis | Keep |
| 5 | Impossible to infer (requires explicit documentation) | Must keep |

Research finding: **42% of rules score 4-5** (non-inferrable). Only 35% score 1-2 (naturally visible to the model). Focus instruction content on score 4-5 rules.

Examples of score 5 (must document): security guardrails, safety imperatives, cross-platform gotchas, deployment sequences, secret handling.
Examples of score 1 (remove): "use TypeScript", "follow existing naming conventions", "import from the correct path".

## Overlap Detection (Semantic Similarity)

Beyond size-based waste, detect instruction pairs that cover the same topic under different names.

**Lightweight scoring** (no embeddings needed):
```
Overlap Score = (0.4 x Jaccard Similarity) + (0.6 x Keyword Overlap Ratio)
```

- Extract directive sentences (imperative verbs: "use", "never", "always", "prefer")
- Jaccard = intersection / union of directive word sets
- Keyword Overlap = shared domain keywords / total unique keywords

| Score | Classification | Action |
|-------|---------------|--------|
| >0.50 | High overlap (likely duplicate) | Merge into one file |
| 0.35-0.50 | Medium overlap | Review for consolidation |
| 0.30-0.35 | Low overlap | Acceptable, monitor |
| <0.30 | No overlap | No action |

Run pairwise across all `.instructions.md` files. Flag High overlaps in audit reports.

## Waste Pattern Quick-Check

| Pattern | Fix |
|---------|-----|
| `%%{init` in Mermaid | Delete line |
| `## Synapses` in SKILL.md with synapses.json | Delete section |
| `Microsoft Entra ID` | -> `Microsoft Entra ID` |
| `Classification:` / `Activation:` / `Priority:` in instruction body | Delete -- duplicate of frontmatter |
| Instruction >50 lines with matching skill | Trim to rules + routing pointer |

## Muscle

Run `node .github/muscles/audit-token-waste.cjs` for automated scanning. Use `--fix` for auto-repair of safe patterns.
