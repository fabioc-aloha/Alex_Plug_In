---
name: "Brain QA"
description: "Deep semantic validation of Alex's cognitive architecture - synapses, triggers, skill index, and Master-Heir synchronization"
applyTo: "**/*synapse*,**/*skill*,**/*trigger*"
---

# Brain QA

> Deep semantic validation of Alex's cognitive architecture - synapses, triggers, skill index, and Master-Heir synchronization

## Quick Start

```powershell
# Full 21-phase audit
.github/muscles/brain-qa.ps1

# Quick validation (phases 1-6)
.github/muscles/brain-qa.ps1 -Mode quick

# Sync validation only (phases 5,7,8,13-15)
.github/muscles/brain-qa.ps1 -Mode sync

# Schema/frontmatter validation (phases 2,6,11,16,17)
.github/muscles/brain-qa.ps1 -Mode schema

# LLM-first content validation (phases 10,20,21)
.github/muscles/brain-qa.ps1 -Mode llm

# Specific phases
.github/muscles/brain-qa.ps1 -Phase 1,5,7

# Auto-fix sync issues
.github/muscles/brain-qa.ps1 -Mode sync -Fix
```

## When to Use

- Before releases
- After adding/modifying skills
- After bulk synapse updates
- When trigger conflicts are suspected
- To verify Master-Heir parity
- To validate LLM-friendly content formats

## Audit Phases

| Phase | Name | Validates |
|-------|------|-----------|
| 1 | Synapse Target Validation | All connection targets exist |
| 2 | Inheritance Field Validation | All skills have inheritance field |
| 3 | Skill Index Coverage | All skills in skill-activation index |
| 4 | Trigger Semantic Analysis | Overlapping keywords (warnings OK if related) |
| 5 | Master-Heir Skill Sync | Skill directories match |
| 6 | Synapse Schema Format | Numeric strengths, $schema present |
| 7 | Synapse File Sync | synapses.json hash match |
| 8 | Skill-Activation Index Sync | SKILL.md hash match |
| 9 | Catalog Accuracy | SKILLS-CATALOG count matches reality |
| 10 | Mermaid Detection | No mermaid in copilot-instructions |
| 11 | Boilerplate Descriptions | No placeholder skill descriptions |
| 12 | Heir Reset Validation | Empty profile, available P5-P7 slots |
| 13 | Instructions/Prompts Sync | Memory files synced to heir |
| 14 | Agents Structure | Valid agent files in both |
| 15 | Config Files | Required configs present, no leaks |
| **16** | **Skill YAML Frontmatter** | **name and description in frontmatter** |
| **17** | **Internal Skills Hidden** | **user-invokable: false for metacognition** |
| **18** | **Agent Handoffs** | **Return-to-Alex handoffs present** |
| **19** | **ApplyTo Patterns** | **Instructions have file-type patterns** |
| **20** | **LLM-First Content** | **No ASCII art, Mermaid OK** |
| **21** | **Emoji Semantics** | **Meaningful emoji usage stats** |

## Mode Shortcuts

| Mode | Phases | Use Case |
|------|--------|----------|
| `all` | 1-21 | Full audit before release |
| `quick` | 1-6 | Fast validation during development |
| `sync` | 5,7,8,13-15 | Master-Heir synchronization check |
| `schema` | 2,6,11,16,17 | Schema, frontmatter, and format validation |
| `llm` | 10,20,21 | LLM-first content format validation |

## Known Gaps (Future Phases)

| Phase | Name | Validates |
|-------|------|-----------|
| 22 | Brain HTML Count Drift | Hardcoded counts in `docs/alex-brain-anatomy.html` match actual file counts (skills, instructions, muscles, prompts) |
| 23 | Motor Cortex Mapping | Muscle inventory in brain diagrams matches `.github/muscles/` |

> **Context**: Session 2026-02-13 discovered stale counts in brain HTML (muscles 13→11, procedures 29→28, skills 100+→116). Diagrams with hardcoded numbers will drift after any architecture change.

## Common Issues

| Issue | Fix |
|-------|-----|
| Broken synapse target | Update path in synapses.json |
| Missing inheritance | Add `"inheritance": "inheritable"` to synapses.json |
| Out of sync | Run with `-Fix` or use `build-extension-package.ps1` |
| Boilerplate description | Write meaningful description in SKILL.md frontmatter |
| Master-only leak | Remove protected files from heir |
| Missing YAML frontmatter | Add `---\nname:\ndescription:\n---` to SKILL.md |
| ASCII art warning | Replace with Mermaid diagrams or tables |
| Missing return-to-Alex | Add handoff to main Alex agent |
| Brain HTML count drift | Update hardcoded numbers in `docs/alex-brain-anatomy.html` |

## Integration

- **Dream Protocol**: Run brain-qa after dream for deeper analysis
- **Release Preflight**: Include `-Mode quick` in release checks
- **LLM Content Audit**: Run `-Mode llm` when updating diagrams
- **Skill Selection Optimization**: Brain QA validates SSO data sources

## Triggers

- "brain qa", "brain audit", "validate brain"
- "synapse audit", "deep synapse check"
- "master heir sync", "heir sync validation"
- "catalog validation", "instruction sync"

---

*Script: `.github/muscles/brain-qa.ps1`*
