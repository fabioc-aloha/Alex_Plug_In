---
name: "self-actualization"
description: "Comprehensive cognitive self-assessment — honest evaluation of architecture health, growth, and optimization opportunities"
---

# Self-Actualization Skill

> The full physical exam. Not "am I sick?" but "how fit am I, and where should I train next?"

## What Self-Actualization Is (and Isn't)

| It IS | It ISN'T |
| ----- | -------- |
| Honest assessment of current state | Cheerful report that everything is fine |
| Identification of growth opportunities | List of capabilities |
| Prioritized improvement plan | Unprioritized wish list |
| Architecture optimization | Code refactoring |
| Deep meditation + action plan | Quick health check (that's dream/health) |

## Assessment Dimensions

### 1. Structural Integrity (Architecture Health)

| Metric | How to Measure | Healthy | Concern |
| ------ | -------------- | ------- | ------- |
| Synapse validity | All targets exist, bidirectional | 100% valid | Any broken links |
| Schema compliance | All synapses.json match SYNAPSE-SCHEMA | Full compliance | Any schema violations |
| Version alignment | Version string consistent across files | All match | Any drift |
| File organization | Files in correct directories | All correct | Orphaned files |

### 2. Memory Balance (P:E:D Ratio)

The architecture has three memory types. Healthy balance varies by maturity:

| Architecture Maturity | Procedural (P) | Episodic (E) | Domain/Skills (D) |
| --------------------- | --------------- | ------------ | ------------------- |
| New (< 3 months) | ~30% | ~20% | ~50% |
| Maturing (3-12 months) | ~20% | ~15% | ~65% |
| Mature (> 1 year) | ~15% | ~10% | ~75% |

**Current formula**: P = instructions count, E = prompts + episodic, D = skills count.

**Imbalance signals**:
- Too many instructions, few skills → "Knows how but not what" (procedural heavy)
- Too many skills, few instructions → "Knows what but not how" (domain heavy)
- Too many episodic, few skills → "Remembers sessions but never synthesized" (consolidation debt)

### 3. Knowledge Depth (Skill Quality)

| Quality Level | Signals | Action |
| ------------- | ------- | ------ |
| Deep | Tables with thresholds, real examples, anti-patterns | None needed |
| Adequate | Has structure and some detail, missing edge cases | Enrich when convenient |
| Shallow | Capabilities list, one-liner descriptions, no examples | **Rewrite priority** |
| Empty shell | Only frontmatter and a description line | Consider removing |

**The capabilities-list anti-pattern**: "Expert in X. Capabilities: validate, detect, assess..." — this adds zero value because an LLM already knows these things generically. Skills must encode *specific* knowledge.

### 4. Connection Density (Synapse Network)

| Metric | How to Measure | Healthy | Concern |
| ------ | -------------- | ------- | ------- |
| Avg connections per skill | Total synapses / total skills | 3-6 | < 2 (isolated) or > 10 (over-connected) |
| Orphan skills | Skills with 0 synapses | 0 | Any |
| Hub skills | Skills with > 8 connections | 1-2 core hubs | > 4 (over-centralized) |
| Bidirectional coverage | % of connections that are reciprocated | > 80% | < 60% |

### 5. Trifecta Completeness

| Component | Purpose | What's Missing If Absent |
| --------- | ------- | ------------------------ |
| SKILL.md | What to know (declarative) | No reference knowledge |
| .instructions.md | How to do it (procedural) | No step-by-step process |
| .prompt.md | Interactive workflow (episodic) | No guided conversation |

**Trifecta priority**: Not every skill needs a trifecta. Prioritize trifectas for skills that are:
- Used frequently (high activation count)
- Complex (multi-step processes)
- Error-prone (common mistakes without guidance)

### 6. Growth Trajectory

| Metric | How to Assess | Good Sign | Warning Sign |
| ------ | ------------- | --------- | ------------ |
| Skills added this month | Count new SKILL.md files | 1-5 new skills | 0 (stagnant) or > 10 (unfocused) |
| Skills deepened | Skills edited to add depth | Active enrichment | Only new, never deepened |
| Global knowledge growth | New GI-* and GK-* entries | Synthesis happening | No global entries (isolated learning) |
| Trifecta progression | New instructions/prompts | Capability maturing | Skills without procedures |

## Self-Actualization Session Flow

1. **Inventory** — Count all files by type (skills, instructions, prompts, episodic, agents)
2. **Structural audit** — Run brain-qa or dream for baseline metrics
3. **Depth sampling** — Read 5-10 smallest skills, assess for shallow content
4. **Balance calculation** — Compute P:E:D ratio, compare to maturity target
5. **Network analysis** — Check connection density, find orphans and hubs
6. **Growth review** — Compare to last self-actualization (what changed?)
7. **Priority list** — Rank top 3-5 improvements by impact
8. **Action plan** — Assign each to a session type (quick fix, deep-dive, trifecta build)

## Scoring Guide

| Dimension | Weight | Score 1-5 |
| --------- | ------ | --------- |
| Structural Integrity | 20% | 5=perfect, 1=broken links everywhere |
| Memory Balance | 15% | 5=ideal ratio, 1=severely skewed |
| Knowledge Depth | 25% | 5=all deep, 1=mostly shallow |
| Connection Density | 15% | 5=well-connected, 1=isolated islands |
| Trifecta Completeness | 10% | 5=appropriate coverage, 1=skills only |
| Growth Trajectory | 15% | 5=healthy momentum, 1=stagnant |

**Overall**: Weighted average. > 4.0 = healthy. 3.0-4.0 = needs attention. < 3.0 = urgent.

## Relationship to Other Cognitive Processes

| Process | Frequency | Depth | Purpose |
| ------- | --------- | ----- | ------- |
| Dream | On-demand | Structural | Automated validation |
| Quick Meditation | Per-session | Light | Session consolidation |
| Full Meditation | Weekly | Moderate | Knowledge integration |
| **Self-Actualization** | **Monthly** | **Deep** | **Comprehensive assessment + growth plan** |

## Drift Remediation Protocol

Self-actualization often detects **documentation drift** — when implementation evolves faster than documentation. Common drift categories:

### 1. Version Reference Drift

**Detection**: Self-actualization scans memory files for outdated version references (e.g., `v5.6.8` when current is `v5.7.1`)

**Common locations**:
- Skill examples: "as of v5.X.Y" annotations
- Release notes embedded in skills
- Instruction file headers
- Comments with version-specific behavior

**Remediation**:
```typescript
// Find all outdated version references
grep -r "v5\.[0-6]\.\d+" .github/ --include="*.md"

// Update via multi_replace or manual edit
// Pattern: v5.6.8 → v5.7.1
```

### 2. Documentation Count Drift

**Detection**: Compare copilot-instructions.md documented counts vs. actual file counts

**Verification commands** (PowerShell):
```powershell
# Count actual skills (directories with SKILL.md)
(Get-ChildItem -Path .\.github\skills -Directory | Where-Object { 
  Test-Path "$($_.FullName)\SKILL.md" 
}).Count

# Count actual instructions
(Get-ChildItem -Path .\.github\instructions -Filter "*.instructions.md").Count

# Count prompts
(Get-ChildItem -Path .\.github\prompts -Filter "*.prompt.md").Count
```

**Remediation**:
Update copilot-instructions.md with actual counts:
```markdown
Total Skills: 116 | Total Instructions: 30
```

### 3. Memory Balance Drift

**Detection**: Calculate P:E:D ratio, compare to maturity-appropriate target

**Not always remediation needed** — growth causes natural shifts:
- Adding skills → D increases (good)
- Consolidating episodic → E decreases (good)
- Removing redundant instructions → P decreases (good)

**Action required when**:
- Episodic debt (too many unconsolidated sessions)
- Procedural bloat (overlapping instructions)
- Skill stagnation (no new domain knowledge)

### Pre-Publish Drift Check Workflow

**Order** (run before `vsce package`):
1. **Self-Actualization** → Detect all drift categories
2. **Remediation** → Fix version refs, update counts
3. **Verification** → Run PowerShell counts, grep version patterns
4. **Build & Install** → Confirm clean heir sync, 0 TypeScript errors
5. **User Testing** → Regression checklist

**Real-world example** (v5.7.1):
- Detected: persona-detection/SKILL.md had v5.6.8 references
- Detected: copilot-instructions.md missing skill/instruction counts
- Fixed: Updated 3 version instances, added counts
- Verified: PowerShell confirmed 116 skills, 30 instructions
- Result: Clean build, 0 contamination, ready for publish

## Synapses

See [synapses.json](synapses.json) for connections.
