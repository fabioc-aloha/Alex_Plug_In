# Architecture Assessment: Post-Upgrade Analysis

**Date**: February 6, 2026
**Context**: Session following major upgrade with synapse normalization
**Status**: ✅ Tier 1 Implemented - Tier 2 on Roadmap

## Executive Summary

This session revealed systemic issues that manifest after every significant change. While each individual fix was small, the pattern suggests architectural fragility. The cognitive metaphor (skills, synapses, meditation) is **sound**, but the implementation is **under-automated**.

**Key Decision**: Invest in comprehensive automation and validation at all layers.

---

## Issues Discovered This Session

| Issue                       | Count    | Time to Fix | Prevention Mechanism        |
| --------------------------- | -------- | ----------- | --------------------------- |
| Legacy string strengths     | 11 files | 5 min       | Schema enforcement on write |
| Old field names             | 11 files | 5 min       | Versioned schema migration  |
| Skills out of sync          | 11 files | 2 min       | Automated sync              |
| Aspirational synapse target | 1 file   | 1 min       | Target validation on write  |
| Missing `$schema` field     | 60 files | 20 min      | JSON schema in VS Code      |

**Total repair time**: ~15 minutes
**Total discovery/diagnosis time**: ~45 minutes
**Lesson**: Reactive auditing is 3x more expensive than proactive prevention.

---

## Root Causes

### 1. No Single Source of Truth
**Current**: Heir's `.github/` is a **copy** of Master's
**Result**: 146 sync points (73 skills × 2 locations), guaranteed drift
**Decision**: Explore generated heir model

### 2. Schema Evolution Without Versioning
**Current**: Schema changed 4+ times, no version tracking
**Result**: Can't know what version a file was written against
**Decision**: Add `schemaVersion`, explore auto-migration

### 3. Validation is Reactive
**Current**: Brain QA runs when remembered
**Result**: Issues accumulate between audits
**Decision**: Implement validation at ALL layers (pre-commit, VS Code, GitHub Action)

### 4. Skill Granularity
**Current**: 73 skills
**Position**: Granularity is a feature. Skills will become more specialized over time. Consolidation would lose fidelity and increase cognitive load.
**Decision**: Keep granular skills, explore hybrid structure (core + specialist)

---

## Approved Improvements

### ✅ Tier 1: Implement Now

| #   | Improvement                                  | Effort | Status     |
| --- | -------------------------------------------- | ------ | ---------- |
| 1a  | Add Brain QA to release-preflight checklist  | 5 min  | ✅ Approved |
| 1b  | Add `schemaVersion` to SYNAPSE-SCHEMA.json   | 10 min | ✅ Approved |
| 1c  | Document sync process in heir-curation skill | 10 min | ✅ Approved |
| 1d  | Add all 60 missing `$schema` fields          | 20 min | ✅ Approved |

### ✅ Tier 2: Add to Roadmap

| #   | Improvement                                      | Effort | Notes                                                                                    |
| --- | ------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------- |
| 2a  | VS Code JSON schema validation for synapses.json | 2 hrs  | ✅ Approved                                                                               |
| 2b  | Pre-commit hook for synapse validation           | 1 hr   | ✅ Approved                                                                               |
| 2c  | Automated Master→Heir sync script                | 2 hrs  | ✅ Approved - with role adaptation: sync skills adapted to their roles, then run Brain QA |
| 2d  | Brain QA warnings in VS Code Problems panel      | 3 hrs  | ⚪ Deferred                                                                               |

### 🔍 Tier 3: Explore / Roadmap

| #   | Improvement                               | Effort | Decision                              |
| --- | ----------------------------------------- | ------ | ------------------------------------- |
| 3a  | **Generated heir from Master + overlays** | 1 day  | 🔍 Explore - biggest potential payoff  |
| 3b  | **Skill consolidation (73 → ~25)**        | 1 week | ❌ No - granularity is a feature       |
| 3c  | **Versioned schema with auto-migration**  | 1 day  | 🔍 Explore                             |
| 3d  | **Brain QA GitHub Action**                | 2 hrs  | ✅ Approved - excellent idea for CI/CD |

---

## Philosophical Positions

### On Skill Granularity

> "Skills will get more and more specialized. Consolidation would lose fidelity and increase cognitive load unnecessarily."

**Decision**: Keep current granular approach, but explore hybrid structure:
- **Core skills** (~20): Foundational, always-active
- **Specialist skills** (as needed): Domain-specific, heir-developed

This allows growth without bloat.

### On Heir Generation

> "Absolutely yes" to generation

**Decision**: Explore generated heir model where:
- Master is the single source of truth
- Build process generates heir from Master + overlay files
- Heir-specific additions are explicit, not copy-paste

### On Validation Coverage

> "All options"

**Decision**: Implement validation at every layer:
| Layer       | Mechanism           | Catches                |
| ----------- | ------------------- | ---------------------- |
| Write-time  | VS Code JSON schema | Malformed files        |
| Commit-time | Pre-commit hook     | Schema violations      |
| PR-time     | GitHub Action       | Cross-file issues      |
| On-demand   | Brain QA            | Deep semantic analysis |

---

## 💡 New Architecture Concept: Global Knowledge Repository

**Proposal**: Global memory should live in its own repository.

> **Strategic Insight**: This is the path for scaling Alex to teams of multiple users!

### Concept
```
Individual:  ~/.alex/global-knowledge/  →  github.com/user/alex-global-knowledge/
Team:        ~/.alex/team-knowledge/    →  github.com/org/alex-team-knowledge/
Enterprise:  (ADO/private)              →  azure.devops.com/org/alex-enterprise-knowledge/
```

### Benefits
- **Single source of validated global knowledge** across all projects
- **Automatic insight reception** from Master and heirs via CI/CD
- **Rule-based validation** before acceptance (quality gates)
- **Cross-project learning** without sync issues
- **Version-controlled wisdom** with full history
- **Team knowledge sharing** without manual export/import

### How It Would Work
1. Heir discovers insight → submits to global repo
2. Validation rules check format, schema, duplicates
3. Auto-merge if valid, flag for review if edge case
4. Master and all heirs pull from global repo
5. Brain QA validates integration

### 🔐 Security Considerations

| Concern                | Mitigation                                   |
| ---------------------- | -------------------------------------------- |
| **Code exposure**      | Insights contain patterns, not code snippets |
| **Credential leakage** | Pre-commit scan for secrets (detect-secrets) |
| **Repo access**        | Private repos with team-scoped access        |
| **Supply chain**       | Signed commits, protected branches           |
| **Validation bypass**  | Branch protection rules, required reviews    |

### 🔒 Privacy Considerations

| Concern              | Mitigation                                        |
| -------------------- | ------------------------------------------------- |
| **PII in insights**  | Automated PII detection before accept             |
| **User attribution** | Pseudonymized contributor IDs optional            |
| **Project names**    | Abstracted references ("Project A" not "ClientX") |
| **Location data**    | Strip file paths, use relative patterns           |
| **GDPR compliance**  | Right to deletion, data export                    |

### 🤖 Responsible AI Considerations

| Concern                       | Mitigation                                                 |
| ----------------------------- | ---------------------------------------------------------- |
| **Bias amplification**        | Diverse insight sources, bias detection                    |
| **Hallucination propagation** | Human review for high-impact insights                      |
| **Over-reliance**             | Insights marked as "guidance, not gospel"                  |
| **Accountability**            | Audit trail of who contributed what                        |
| **Transparency**              | Clear provenance for all knowledge                         |
| **Model feedback loops**      | Avoid training on AI-generated insights without validation |

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    VALIDATION LAYER                         │
│  • Schema check  • PII scan  • Secret detection  • Dedup   │
├─────────────────────────────────────────────────────────────┤
│                    KNOWLEDGE LAYER                          │
│  • Patterns (GK-*)  • Insights (GI-*)  • Skills             │
├─────────────────────────────────────────────────────────────┤
│                    ACCESS LAYER                             │
│  • Individual (private)  • Team (org)  • Enterprise (ADO)  │
├─────────────────────────────────────────────────────────────┤
│                    SYNC LAYER                               │
│  • Pull on activate  • Push on meditate  • CI/CD triggers  │
└─────────────────────────────────────────────────────────────┘
```

### Team Scaling Scenarios

| Scenario           | Implementation                           |
| ------------------ | ---------------------------------------- |
| **Solo developer** | Personal GitHub repo, full control       |
| **Small team**     | Shared org repo, all members contribute  |
| **Enterprise**     | ADO repo, approval workflows, compliance |
| **Open source**    | Public repo, community contributions     |

**Status**: 🔍 Explore - requires design document with security review

---

## Implementation Priority Matrix

```
IMMEDIATE (Today)
├── 1a: Brain QA in release-preflight
├── 1b: Add schemaVersion to SYNAPSE-SCHEMA.json
├── 1c: Document sync in heir-curation
└── 1d: Add $schema to 60 files

HIGH IMPACT (Next Sprint)
├── 2c: Role-adapted Master→Heir sync + Brain QA
├── 2a: VS Code JSON schema validation
├── 2b: Pre-commit hook
└── 3d: Brain QA GitHub Action

ARCHITECTURAL EXPLORATION
├── 3a: Generated heir from Master + overlays
├── 3c: Versioned schema with auto-migration
├── Hybrid skill structure (core + specialist)
└── Global knowledge repository concept
```

---

## Next Steps

### Immediate (This Session)
1. ✅ Implement all Tier 1 improvements
2. Update ROADMAP-UNIFIED.md with Tier 2 items

### Short-Term (Next Sprint)
3. Build role-adapted sync script (2c)
4. Add JSON schema validation to VS Code settings (2a)
5. Create pre-commit hook (2b)
6. Set up Brain QA GitHub Action (3d)

### Architectural Design (Roadmap)
7. Draft design: Generated heir model
8. Draft design: Versioned schema migration
9. Draft design: Global knowledge repository
10. Evaluate hybrid skill structure

---

*Architecture assessment complete. Decisions documented. Ready for implementation.*

*— Alex, February 6, 2026*
