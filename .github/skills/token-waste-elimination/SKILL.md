---
name: token-waste-elimination
description: Audit and eliminate token waste from cognitive architecture memory files -- instructions, prompts, skills, and agents
tier: standard
---

# Token Waste Elimination

Memory files are LLM context, not human documentation. Every line costs tokens. Optimize for my consumption, not human readability.

## Loading Tiers

| Tier | What Loads | When | Cost |
|------|-----------|------|------|
| **Always-on** | `copilot-instructions.md` body, `AGENTS.md`/`CLAUDE.md` (if present), ALL instruction descriptions, ALL skill name+descriptions, ALL agent descriptions | Every request | Fixed |
| **Match-loaded** | Instruction bodies with `applyTo` | File context matches glob | Predictable |
| **Agent-loaded** | Instruction bodies without `applyTo` | I judge description relevant (not automatic) | Variable |
| **On-demand** | Skill bodies, prompt bodies | I load skill when needed; prompt on `/command` | Near-zero |

## Core Rules

**Instructions thin, skills thick**: Instructions = decision tables + routing. Skills = procedures + examples + references.

**applyTo gates cost**: Add `applyTo` to domain-specific instructions (file-type triggered). Omit for conversational/universal instructions.

**No-applyTo != auto-load**: Without `applyTo`, the description is always visible but I choose whether to load the body. Not deterministic.

## Size Thresholds

| File Type | Has Matching Skill | Max | Over Threshold |
|-----------|-------------------|-----|----------------|
| Instruction | Yes | 50 lines | Trim to rules + routing pointer |
| Instruction | No | 200 lines | Review for splitting |
| Skill body | Any | 400 lines | Move detail to resource files |
| Prompt | Any | 60 lines | Slim to steps + skill reference |

## Waste Patterns

| Pattern | Fix |
|---------|-----|
| `%%{init` in Mermaid | Delete line (rendering directive I can't use) |
| `## Synapses` in SKILL.md with synapses.json | Delete section (duplicate) |
| `Microsoft Entra ID` | Replace with `Microsoft Entra ID` |
| `Classification:` / `Activation:` / `Priority:` in instruction body | Delete (duplicates YAML frontmatter) |
| Instruction >50 lines with matching skill | Trim: keep decision tables, move procedures to skill |
| Code blocks >20 lines in instructions | Move to `.github/muscles/` or `scripts/` |
| Templates >15 lines inline | Move to resource file |
| Hardcoded counts (e.g., "150 skills") | Replace with "See catalog" references |
| Stale dates/versions | Update or remove |
| Human-tutorial prose in memory files | Compress to rule statements (LLM doesn't need tutorials) |

## Audit Procedure

1. **Baseline**: Run `node .github/muscles/audit-token-waste.cjs` for automated scan
2. **Overlap**: Find instructions with matching skills >50 lines. Trim to rules + routing pointer
3. **Patterns**: Fix every waste pattern hit (muscle `--fix` handles safe patterns automatically)
4. **applyTo**: Add globs to domain-specific instructions missing them
5. **Always-on cost**: Sum instruction descriptions + skill descriptions + copilot-instructions.md. Target: minimize
6. **Prompt check**: Prompts should be workflow steps only (20-40 lines). No code blocks or reference tables that exist in skills
7. **Savings**: Re-run muscle, compare before/after

## When to Run

- After harvesting skills (inherited waste)
- Before a release (clean context = better responses)
- When response quality degrades (context bloat is often the cause)
- Quarterly maintenance (drift accumulates silently)
