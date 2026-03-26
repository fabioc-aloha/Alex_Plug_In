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
