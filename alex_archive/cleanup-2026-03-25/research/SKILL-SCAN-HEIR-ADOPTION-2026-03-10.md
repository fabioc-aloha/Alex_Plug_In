# Skill Scan: Heir & Global Knowledge Adoption Candidates

**Date**: March 10, 2026
**Scope**: All heirs (vscode-extension, m365-copilot, agent-plugin, AlexLearn) + Global Knowledge
**Master Skills at scan time**: 127 trifectas in `.github/skills/`

---

## Executive Summary

Scanned 4 heir repos and global knowledge for skills, prompts, and patterns that could be promoted to master. Found **14 heir-only skills**, **5 heir-only prompts**, and **1 GK skill gap**. Of these, **4 skills** and **2 prompts** are strong promotion candidates, **3 skills** and **2 prompts** merit evaluation, and the rest are heir-specific or platform-bound.

---

## Heir Ecosystem Overview

| Heir | Location | Skills | Mirrors Master? | Unique Assets |
|------|----------|--------|-----------------|---------------|
| vscode-extension | `platforms/vscode-extension/.github/skills/` | 127 | Yes (exact mirror) | None |
| m365-copilot | `platforms/m365-copilot/.github/skills/` | 139 | 127 shared + 12 unique | 12 skills, 1 prompt |
| agent-plugin | `platforms/agent-plugin/plugin/skills/` | 134 | 127 shared + 7 unique | 7 skills (subset of M365) |
| AlexLearn | `C:\Development\AlexLearn\.github\skills/` | 121 | 119 shared + 2 unique | 2 skills, 4 prompts |
| Global Knowledge | `~/.alex/global-knowledge/skills/` | 15 | 14 in master, 1 gap | 1 missing skill |

---

## Tier 1: Strong Promotion Candidates

Skills and prompts that are domain-agnostic, proven across multiple heirs, and fill real gaps in master.

### Skills

#### 1. `doc-hygiene` — Anti-Drift Rules for Living Documentation

- **Heirs**: M365, agent-plugin, AlexLearn, Global Knowledge
- **Also in GK**: Yes (promoted skill) — but **missing from master**
- **Summary**: Enforces documentation freshness through filesystem-as-truth principles. Key rules: no hardcoded counts (query disk), detect stale TODO/FIXME markers, flag contradictions between docs and code, mandate `Last Verified:` timestamps. Pairs with `documentation-quality-assurance` (which is broader QA) as the enforcement ruleset.
- **Why promote**: Already proven across 3 heirs + GK. Fills a gap between `documentation-quality-assurance` (process) and actual anti-drift enforcement (rules). Master has the QA skill but not the rules skill.
- **Action**: **PROMOTE** — copy from GK `skills/doc-hygiene/` to master `.github/skills/doc-hygiene/`
- **Effort**: Trivial (file copy + sync to heirs)

#### 2. `architecture-health` — Cognitive Architecture Diagnostics

- **Heirs**: AlexLearn only
- **Summary**: Diagnostic skill for validating cognitive architecture health. Checks synapse integrity (dangling references, missing connection targets), connection density per skill, staleness scoring for skills without recent synaptic activity, and trifecta completeness ratios. Outputs a health score with actionable recommendations.
- **Why promote**: Master has `brain-qa` for automated validation but lacks a conversational diagnostic skill. This complements `brain-qa` by providing LLM-guided health assessment rather than script-based checks.
- **Action**: **PROMOTE** — generalize from AlexLearn context, add synapse connections to `brain-qa` and `cognitive-health-validation`
- **Effort**: Low (generalize AlexLearn-specific references, create synapses.json)

#### 3. `global-knowledge-sync` — Cross-Project Knowledge Infrastructure

- **Heirs**: AlexLearn only
- **Summary**: Manages bidirectional synchronization between local project knowledge base and the centralized global knowledge repository (`~/.alex/global-knowledge/`). Handles promotion workflows (local insight → global pattern), pull-based skill sync (heir pulls from GK), conflict resolution for divergent versions, and staleness detection for GK entries not referenced in any project.
- **Why promote**: The GK system is a master-level concern. This skill documents the sync infrastructure that every heir uses. Currently the GK `README.md` describes the protocol, but no master skill teaches it.
- **Action**: **PROMOTE** — move to master, connect to `global-knowledge` and `heir-sync-management` skills
- **Effort**: Low (already well-written, minimal changes needed)

#### 4. `meditation-facilitation` — Interactive Knowledge Consolidation

- **Heirs**: M365, agent-plugin, AlexLearn
- **Summary**: The interactive "surgery" counterpart to dream's "X-ray". Implements the 4 R's framework (Review, Reflect, Reorganize, Reinforce) through Socratic probing. Guides users through structured meditation sessions: knowledge inventory → gap identification → connection strengthening → consolidation verification. Produces session documentation with before/after metrics.
- **Why promote**: Master has `meditation` (the instructions for how to meditate) but not the facilitation skill (how to guide someone through it). This is the missing interactive component.
- **Action**: **PROMOTE** — add to master as companion to `meditation` skill. Verify no overlap with `self-actualization`.
- **Effort**: Low-Medium (check for overlap with existing meditation instruction, create synapses.json)

### Prompts

#### 5. `domain-learning.prompt.md` — Guided Domain Acquisition Workflow

- **Heir**: AlexLearn
- **Summary**: Structured workflow prompt: assess current knowledge → identify gaps → learn through conversation → integrate with existing skills → consolidate into persistent memory. Wraps `bootstrap-learning` skill into an operational `/domain-learning` command.
- **Why promote**: Master has `bootstrap-learning` skill but no prompt that operationalizes it. This is the missing UX layer.
- **Action**: **PROMOTE** — add to master `.github/prompts/`
- **Effort**: Trivial (file copy)

#### 6. `diagramming-mastery-meditation.prompt.md` — Post-Learning Visualization Consolidation

- **Heir**: AlexLearn
- **Summary**: Specialized meditation prompt for consolidating diagramming and visualization knowledge after learning sessions. Exercises: convert concepts to Mermaid diagrams, identify visual pattern gaps, practice diagram-driven explanation.
- **Why promote**: Niche but useful. Pairs with `markdown-mermaid` skill and general meditation system.
- **Action**: **PROMOTE** — add to master `.github/prompts/`
- **Effort**: Trivial (file copy)

---

## Tier 2: Evaluate — Generalizable with Caveats

Assets that could be promoted but have overlap concerns or need adaptation.

### Skills

#### 7. `writing-publication` — Technical & Academic Writing Patterns

- **Heirs**: M365, agent-plugin, AlexLearn
- **Summary**: Comprehensive writing skill covering CARS model (Create a Research Space), Heilmeier catechism, audience adaptation matrices, venue-specific formatting (CHI, HBR, IEEE), and publication workflow from draft to submission.
- **Overlap concern**: Master already has `ai-writing-avoidance` (voice/tone) and `academic-paper-drafting` exists in heirs. These three skills have fuzzy boundaries.
- **Action**: **EVALUATE** — consider merging with `ai-writing-avoidance` or creating a `technical-writing` super-skill
- **Effort**: Medium (boundary definition work needed)

#### 8. `prompt-activation` — Metacognitive Prompt Routing

- **Heirs**: M365, agent-plugin, AlexLearn
- **Summary**: Auto-discovery system for `.prompt.md` files. Matches user intent keywords to prompt trigger patterns. Routes to the right `/command` without user needing to know the prompt name.
- **Overlap concern**: Master's `memory-activation` skill already combines skill routing + prompt retrieval. This may be redundant or could be a sub-component.
- **Action**: **EVALUATE** — check if `memory-activation` already covers this. If not, merge into it.
- **Effort**: Low (comparison analysis)

#### 9. `skill-activation` — Metacognitive Skill Discovery

- **Heirs**: M365, agent-plugin, AlexLearn (implementations differ per heir)
- **Summary**: Auto-trigger system for skill discovery by action keywords. Scans user message for domain verbs and routes to appropriate skill files.
- **Overlap concern**: Same as `prompt-activation` — master's `memory-activation` may already cover this. Additionally, implementations differ across heirs, suggesting the abstraction isn't stable.
- **Action**: **EVALUATE** — if promoting, pick the most mature implementation and reconcile
- **Effort**: Medium (reconciliation across divergent versions)

### Prompts

#### 10. `unified-meditation-protocols.prompt.md` — Enhanced Meditation with Persistence

- **Heir**: AlexLearn
- **Summary**: Comprehensive meditation prompt with mandatory persistence requirements, synapse enhancement steps, and structured session documentation. More prescriptive than master's `/meditate` prompt.
- **Overlap concern**: May conflict with or supersede master's existing meditation instruction/prompt.
- **Action**: **EVALUATE** — compare with master's meditation prompt and instruction. Consider merging best elements.
- **Effort**: Medium (reconciliation with existing meditation system)

#### 11. `quantified-enhancement-session.prompt.md` — Metrics-Driven Self-Improvement

- **Heir**: AlexLearn
- **Summary**: Structured self-improvement workflow with explicit baseline measurement, target setting, improvement actions, and validation metrics. Quantifies cognitive growth.
- **Overlap concern**: Overlaps with `self-actualization` skill's assessment capabilities.
- **Action**: **EVALUATE** — may be a good prompt wrapper for the self-actualization skill
- **Effort**: Low (comparison + potential merge)

---

## Tier 3: Keep in Heirs — Domain-Specific

Assets that serve specific heir contexts and shouldn't clutter master.

### Skills

| Skill | Heir(s) | Reason to Keep in Heir |
|-------|---------|----------------------|
| `academic-paper-drafting` | M365, agent-plugin, AlexLearn | Tied to Fabio's academic research context (CHI, dissertation). Not general-purpose. |
| `airs-integration` | M365, agent-plugin, AlexLearn | AIRS psychometric assessment tool (Correa 2025). Research-project-specific. |

### Prompts

| Prompt | Heir | Reason to Keep in Heir |
|--------|------|----------------------|
| `help.prompt.md` | M365 | Quick reference for Office Add-in buttons. M365-platform-specific. |

---

## Tier 4: Platform-Specific — Not Promotable

These skills are inherently tied to a platform SDK and cannot be generalized.

| Skill | Heir | Platform Dependency |
|-------|------|-------------------|
| `excel-integration` | M365 only | Office.js Excel Add-in API |
| `office-document-integration` | M365 only | Cross-platform Office Add-in hub (Word/Excel/PPT/Outlook) |
| `outlook-integration` | M365 only | Outlook Mail Add-in API |
| `powerpoint-integration` | M365 only | PowerPoint Office.js API |
| `word-integration` | M365 only | Word Office.js API |

---

## Global Knowledge Gap Analysis

### Promoted Skills: 15 in GK, 14 in Master

| GK Skill | In Master? | Status |
|----------|-----------|--------|
| ai-generated-readme-banners | Yes | Synced |
| azure-architecture-patterns | Yes (as azure-deployment-operations) | Synced |
| book-publishing | Yes | Synced |
| chat-participant-patterns | Yes | Synced |
| distribution-security | Yes | Synced |
| **doc-hygiene** | **No** | **GAP — promote (Tier 1 item #1)** |
| documentation-quality-assurance | Yes | Synced |
| md-to-word | Yes | Synced |
| microsoft-graph-api | Yes | Synced |
| research-first-development | Yes | Synced |
| secrets-management | Yes | Synced |
| teams-app-patterns | Yes | Synced |
| ui-ux-design | Yes | Synced |
| vscode-extension-patterns | Yes | Synced |

### GK Pattern Clusters (Potential Future Skills)

Notable insight concentrations in GK that don't yet have a dedicated master skill:

| Cluster | Insights | Existing Coverage | Gap? |
|---------|----------|-------------------|------|
| Mermaid diagram styling | 6 insights (pastel palettes, polish patterns, SVG banners) | `markdown-mermaid` skill | No — already covered |
| Azure deployment patterns | 5 insights (Container Apps, SWA, pre-deploy validation) | `azure-deployment-operations` skill | No — already covered |
| Book/PDF publishing | 4 insights (emoji pipelines, dual builds, LaTeX) | `book-publishing` skill | No — already covered |
| Master-Heir sync | 4 insights (sync validation, promotion, fresh templates) | `heir-sync-management` skill | No — already covered |
| Fabric/data platform | 3 insights (medallion architecture, notebook publishing) | No dedicated skill | **Minor gap** — niche topic, monitor |
| MSAL/authentication | 2 insights (MSAL patterns, Entra ID) | `secrets-management` skill (partial) | **Minor gap** — auth patterns not fully in a skill |

---

## Orphan Check

| Asset Type | Heirs Checked | Orphans Found |
|-----------|---------------|---------------|
| Instructions (`.instructions.md`) | All 4 | None — all mirror master |
| Agents (`.agent.md`) | All 4 | None — all mirror master |
| Skills (beyond those listed above) | All 4 | None |

---

## Recommended Action Plan

### Immediate (v6.5.0)

| # | Action | Source | Effort | Status |
|---|--------|--------|--------|--------|
| 1 | Promote `doc-hygiene` skill to master | GK + 3 heirs | Trivial | DONE |
| 2 | Promote `architecture-health` skill to master | AlexLearn | Low | DONE |
| 3 | Promote `global-knowledge-sync` skill to master | AlexLearn | Low | DONE |
| 4 | Promote `domain-learning` prompt to master | AlexLearn | Trivial | DONE |

### Short-Term (v6.5.x)

| # | Action | Source | Effort |
|---|--------|--------|--------|
| 5 | Promote `meditation-facilitation` to master | 3 heirs | Low-Medium |
| 6 | Promote `diagramming-mastery-meditation` prompt to master | AlexLearn | Trivial |
| 7 | Evaluate `prompt-activation` vs `memory-activation` overlap | 3 heirs | Low |
| 8 | Evaluate `skill-activation` vs `memory-activation` overlap | 3 heirs | Medium |

### Backlog

| # | Action | Source | Effort |
|---|--------|--------|--------|
| 9 | Evaluate `writing-publication` + `ai-writing-avoidance` merge | 3 heirs | Medium |
| 10 | Evaluate `unified-meditation-protocols` merge with master meditation | AlexLearn | Medium |
| 11 | Evaluate `quantified-enhancement-session` as self-actualization prompt | AlexLearn | Low |

---

## Cross-Reference

- **Unified Implementation Plan**: `alex_docs/research/UNIFIED-IMPLEMENTATION-PLAN-2026-03-10.md`
- **Trifecta Catalog**: `alex_docs/architecture/TRIFECTA-CATALOG.md`
- **Skills Catalog**: `alex_docs/skills/SKILLS-CATALOG.md`
- **GK Knowledge Index**: `~/.alex/global-knowledge/KNOWLEDGE-INDEX.md`
