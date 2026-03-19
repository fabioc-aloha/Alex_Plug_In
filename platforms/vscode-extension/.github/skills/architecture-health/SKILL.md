---
name: "architecture-health"
description: "Diagnose cognitive architecture health — synapse integrity, memory balance, connection density, and drift detection"
---

# Architecture Health Skill

> Diagnose, don't describe. Every metric has a threshold. Every finding has a fix.

## Health Dimensions

| Dimension | What It Measures | Healthy | Warning | Critical |
| --------- | ---------------- | ------- | ------- | -------- |
| Synapse Integrity | % of connections targeting existing files | 100% | 95-99% | <95% |
| Connection Density | Avg connections per skill | 3-6 | 1-2 | 0 |
| Bidirectional Coverage | % of connections with reciprocal entries | >80% | 50-80% | <50% |
| Memory Balance | Ratio of procedural:episodic:declarative | ~1:1:4 | Skewed 3:1 | Missing category |
| Schema Compliance | Skills with valid synapses.json | 100% | 95-99% | <95% |
| Inheritance Consistency | Synapses.json matches catalog labels | 100% | Any mismatch | — |
| Staleness | Skills with outdated content | <5% | 5-15% | >15% |

## Diagnostic Patterns

### Synapse Integrity Check

Parse every `synapses.json` → extract `connections[].target` → verify file exists.

**Common breakage causes**: File renames, folder restructuring, consolidation merges.

**Fix pattern**: Check consolidation mappings in `dream-state-automation.instructions.md` for old→new file paths. If not mapped, add the mapping and re-run dream.

### Connection Density Analysis

```text
orphan = skill with 0 connections (isolated node)
hub    = skill with 8+ connections (potential bottleneck)
leaf   = skill with 1 connection (normal for specialized skills)
```

**Healthy network**: Most skills are leaves (1-3) with a few hubs (meditation, self-actualization, memory-activation). Orphans indicate missing integration.

### Memory Balance Assessment

| Memory Type | File Pattern | Ideal % | Purpose |
| ----------- | ------------ | ------- | ------- |
| Declarative | `SKILL.md`, `copilot-instructions.md` | ~60% | Domain knowledge |
| Procedural | `.instructions.md` | ~25% | Auto-loaded procedures |
| Episodic | `.prompt.md` | ~15% | Interactive workflows |

**Imbalance signals**:

- Too many skills, few instructions → knows *what* but not *how*
- Too many instructions, few skills → follows steps but can't reason *why*
- Too few prompts → users can't invoke capabilities interactively

### Drift Detection

| Drift Type | Signal | Resolution |
| ---------- | ------ | ---------- |
| Version drift | package.json version ≠ copilot-instructions.md version | Sync via release-preflight |
| Terminology drift | Old terms ("DK files") in active files | Grep + replace |
| Count drift | Hardcoded numbers stale by next session | Replace with references |
| Inheritance drift | Catalog says "master-only" but synapses.json says "inheritable" | Trust synapses.json |
| Runtime loading drift | Skill/instruction exists on disk but doesn't load in agent | Use `/troubleshoot` to analyze JSONL debug logs — reveals name mismatches, invalid frontmatter, or silent loader skips |

## Health Report Template

```markdown
## Architecture Health Report — [date]

### Summary: [HEALTHY | ATTENTION REQUIRED | CRITICAL]

| Dimension | Score | Status |
| --------- | ----- | ------ |
| Synapse Integrity | X/Y valid (Z%) | ✅/⚠️/🔴 |
| Connection Density | avg N.N | ✅/⚠️/🔴 |
| Memory Balance | P:E:D = X:Y:Z | ✅/⚠️/🔴 |
| Schema Compliance | X/Y valid | ✅/⚠️/🔴 |

### Issues Found
1. [Issue] → [Fix]
```

## Relationship to Other Systems

| System | Role |
| ------ | ---- |
| **Dream** (muscle: brain-qa.ps1) | Automated structural checks — the "X-ray" |
| **Architecture Health** (this) | Interpretation framework — the "radiologist" |
| **Meditation** | Consolidation after diagnosis — the "surgery" |
| **Self-Actualization** | Comprehensive assessment — the "full physical" |

Dream runs the scans. This skill teaches how to read and act on the results.

## Triggers

- "health check", "synapse health", "architecture health"
- "how's my brain?", "connection status"
- Before meditation (pre-assessment)
- After dream reports with warnings

## Synapses

See [synapses.json](synapses.json) for connections.
