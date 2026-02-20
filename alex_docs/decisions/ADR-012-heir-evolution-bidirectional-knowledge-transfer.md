# ADR-012: Heir Evolution and Bidirectional Knowledge Transfer

**Date**: 2026-02-19
**Status**: Accepted
**Context**: v5.8.x platform architecture evolution
**Authors**: Alex (research), Fabio Carvalho

---

## Context

The Alex Cognitive Architecture supports multi-platform deployment through "heirs" — platform-specific instances that inherit from Master Alex:

- **VS Code Extension Heir** (`platforms/vscode-extension/`)
- **M365 Copilot Agent Heir** (`platforms/m365-copilot/`)
- **GitHub Codespaces Heir** (future)

As the architecture matures, we need a formal mechanism for:

1. **Master → Heir propagation** (distributing stable capabilities)
2. **Heir → Master promotion** (elevating platform-discovered innovations)
3. **Contamination prevention** (protecting user privacy)
4. **Quality gates** (maintaining architectural integrity)

This ADR documents the bidirectional evolution pattern discovered through v5.7.x–v5.8.x heir experimentation.

---

## Decision

**We adopt a bidirectional heir evolution model with automated sync (Master→Heir) and gated promotion (Heir→Master).**

### Architecture Components

#### 1. Inheritance Model (Source of Truth)

Each skill's `synapses.json` contains an `inheritance` field:

```json
{
  "inheritance": "inheritable" | "master-only" | "universal" | "heir:vscode" | "heir:m365"
}
```

| Value | Ships To | Use Case |
|-------|----------|----------|
| `inheritable` | All heirs | General capabilities (meditation, deep-thinking, security-review) |
| `master-only` | Master only | Repo management (release-preflight, heir-sync-management) |
| `universal` | Everywhere | Core infrastructure |
| `heir:vscode` | VS Code only | Extension patterns, chat participants |
| `heir:m365` | M365 only | Teams integrations, Graph API |

**No hardcoded lists**. The brain declares what belongs where.

#### 2. Master → Heir Sync (Automated)

**Script**: `sync-architecture.js`
**Trigger**: `npm run sync-architecture` (pre-publish hook)
**Process**:

1. **Filter by inheritance** — Copy only relevant skills from Master `.github/skills/`
2. **Copy memory systems** — Instructions, prompts, agents, config
3. **Exclude personal data** — user-profile.json, episodic memories, populated P5-P7
4. **Rename heir-specific scripts** — `brain-qa-heir.ps1` → `brain-qa.ps1`
5. **Generate clean templates** — Empty user-profile, reset working memory
6. **Validate integrity** — PII scan, file structure check

**3-Layer PII Protection**:
- **Layer 1**: Exclusion list (never copy user-profile.json, episodic/, goals.json)
- **Layer 2**: Source sanitization (strip names, emails, personal references)
- **Layer 3**: Pipeline gate (regex scan blocks packaging on violations)

**Heir Types**:
- **Source Heir** (VS Code) — Compile only, low translation cost
- **Translation Heir** (M365) — Full schema mapping, high maintenance
- **Deployment Heir** (Codespaces) — Same code, different distribution

#### 3. Heir → Master Promotion (Gated)

**6-Step Promotion Workflow**:

| Step | Action | Quality Gate |
|------|--------|--------------|
| 1. **Discover** | Review heir skills for portable knowledge | Manual inspection |
| 2. **Evaluate** | Score against promotion rubric | Score ≥12 threshold |
| 3. **Consolidate** | Merge granular heir skills into cohesive Master skills | DRY principle |
| 4. **Implement** | Port code, translate Python→TypeScript if needed | Code review |
| 5. **Test** | Validate in Master context | All tests pass |
| 6. **Document** | CHANGELOG, ROADMAP, catalog updates | Documentation review |

**Quality Rubric** (score 1-3 per dimension, promote if ≥12):

| Dimension | Weight | Criteria |
|-----------|--------|----------|
| **Novel** | High | Introduces new capability vs duplicates existing |
| **Portable** | Critical | Works across projects vs tied to one context |
| **Stable** | High | Production-tested vs experimental |
| **Documented** | Medium | Has examples vs code-only |
| **Generalizable** | Medium | Applies broadly vs niche use case |

**Consolidation During Promotion**:
Heirs naturally create granular one-skill-per-capability files during experimentation. Master consolidates related skills to avoid sprawl.

**Example Promotion**: `research-first-development` (Feb 13, 2026)
- Source: Dead Letter Office heir
- Score: 15/18 (Novel=3, Portable=3, Stable=3, Documented=3, Generalizable=3)
- Action: Promoted as complete trifecta (skill + instruction + prompt + muscle)
- Result: Now inheritable, shipped to VS Code extension v5.8.2

---

## Consequences

### Positive

✅ **Automated propagation** — Master improvements flow to heirs without manual sync
✅ **Innovation capture** — Platform-specific discoveries elevate to Master
✅ **Privacy protection** — 3-layer defense prevents PII leakage
✅ **Quality assurance** — Promotion rubric prevents noise from polluting Master
✅ **Clear ownership** — Inheritance field is single source of truth
✅ **Reduced drift** — Automated sync during build prevents heirs from diverging

### Negative

⚠️ **Manual promotion overhead** — Heir→Master requires human evaluation
⚠️ **Translation costs** — M365 heir has high schema mapping burden
⚠️ **Version lag** — Heirs may not get latest Master capabilities until next sync

### Mitigations

- **Promotion overhead**: Offset by quality gains; bad promotions cost more long-term
- **Translation costs**: Accepted trade-off for M365 native integration
- **Version lag**: Pre-publish hook ensures heirs sync before every release

---

## Validation

**Production Evidence** (v5.7.x–v5.8.x):

| Heir → Master Promotions | Date | Outcome |
|-------------------------|------|---------|
| `research-first-development` | 2026-02-13 | Complete trifecta, score 15/18 |
| `secrets-management` | 2026-02-15 | Consolidated from 3 heir skills |
| `persona-detection` | 2026-02-07 | Premium feature, score 14/18 |

**Master → Heir Propagations** (every release):

| Version | Skills Synced | Heirs Updated |
|---------|--------------|---------------|
| v5.8.0 | 118 inheritable | VS Code |
| v5.8.1 | 120 inheritable | VS Code |
| v5.8.2 | 122 inheritable | VS Code |
| v5.8.3 | 124 inheritable | VS Code |

**Contamination Prevention**:
Zero PII leaks in 15 releases (v5.7.0–v5.8.3) — 3-layer defense validated.

---

## Implementation

### Current State (v5.8.3)

- **Master Alex**: 124 skills (24 master-only, 100 inheritable)
- **VS Code Heir**: 100 skills (all automated sync)
- **M365 Heir**: In development (declarative agent translation in progress)
- **Sync script**: 1,017 lines (`sync-architecture.js`)
- **Contamination checks**: 6 automated validations

### Scripts

| Script | Purpose | Location |
|--------|---------|----------|
| `sync-architecture.js` | Master→Heir sync + PII protection | `platforms/*/` |
| `build-extension-package.ps1` | Full build (sync + compile + scan) | `scripts/` |
| `validate-synapses.ps1` | Inheritance field validation | `scripts/` |
| `brain-qa.ps1` | Cognitive architecture health audit | `scripts/` |

### Quality Gates

**Pre-Release Checklist** (enforced by build script):

1. ✅ Sync architecture (`npm run sync-architecture`)
2. ✅ Validate synapses (`.\scripts\validate-synapses.ps1`)
3. ✅ PII scan (automated in build)
4. ✅ Skill count match (Master inheritable = Heir total)
5. ✅ File hash check (no manual drift)
6. ✅ Config drift detection (P5-P7 clean)

**Pre-Promotion Checklist**:

1. ✅ Score heir skill against rubric (≥12 required)
2. ✅ Identify consolidation opportunities (merge related skills)
3. ✅ Code review by Validator agent (adversarial QA)
4. ✅ Test in Master context (all tests pass)
5. ✅ Documentation complete (CHANGELOG, ROADMAP, catalogs)
6. ✅ Inheritance field set (`inheritable` or `heir:*`)

---

## Evolution

**Near-term** (v5.9–v6.0):
- Complete M365 heir declarative agent translation
- Add GitHub Codespaces deployment heir
- Automate promotion rubric scoring (ML-assisted evaluation)

**Long-term** (v6.x+):
- Bidirectional sync assistant (surfaces promotion candidates)
- Multi-tier inheritance (team-level, org-level, global-level)
- Automated consolidation detection (clusters related heir skills)

---

## References

- **Sync Script**: `platforms/vscode-extension/sync-architecture.js`
- **Heir Management Skill**: `.github/skills/heir-sync-management/SKILL.md`
- **Audit Research**: Session 2026-02-19 (comprehensive skill audit report)
- **Related ADRs**:
  - [ADR-009](ADR-009-global-knowledge-sync-direction.md) — Global Knowledge unidirectional sync
  - [ADR-010](ADR-010-copilot-instructions-as-prefrontal-cortex.md) — Active Context integration

---

**Key Insight**: Bidirectional evolution enables platform-specific innovation without fracturing the architecture. The heir model mirrors biological evolution — shared DNA (Master) with environmental adaptation (heirs) and successful mutations returning to the gene pool (promotion).

**Governance**: This model requires discipline. Without quality gates, heir noise pollutes Master. Without automated sync, heirs drift. The architecture codifies the discipline.
