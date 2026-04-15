# Brain Health Grid

Generated: 2026-04-15

## Scoring Criteria

Each dimension is scored **0** (defect) or **1** (good). Score = sum of dimensions.

| Dim | Name | 1 (good) | 0 (defect) | Fix |
|:---:|------|----------|------------|-----|
| **fm** | Frontmatter | Has `name`, `description`, `applyTo`, and `tier` | Missing any required field | Auto |
| **code** | Code Examples | Has pseudocode (excludes mermaid/ascii/diagrams) | No code blocks | Info |
| **bounds** | Bounds | 100–500 lines | <100 (stub) or >500 (bloated) | Manual |
| **tri** | Trifecta | Not a workflow skill, OR has matching `.instructions.md` | Workflow skill missing instruction file | Manual |
| **muscle** | Muscle | Has `.cjs`/`.js` script OR pseudocode `.md` in muscles/ | No automation component | Manual |

## Modern Synapses

Static `synapses.json` files are **deprecated**. Copilot's semantic search + these mechanisms replace connection graphs:

| Mechanism | Where | Purpose |
|-----------|-------|---------|
| `applyTo` | Frontmatter | Pattern-based activation (e.g., `**/*.ts`) |
| `description` | Frontmatter | Semantic matching by Copilot |
| Trifecta naming | Convention | `skill-name` → `skill-name.instructions.md` |
| `handoffs` | Agent files | Explicit routing to specialists |

## Tier-Based Pass Thresholds

"Good is good enough" — higher tiers require higher quality. Max score depends on skill type:
- **Agentic** (tri+muscle): 4/4 (fm, bounds, tri, muscle)
- **Intellectual** (tri only): 3/3 (fm, bounds, tri)

| Tier | Allowed Defects | Rationale |
|------|:---------------:|-----------|
| **core** | 0 | Foundation skills must be perfect |
| **standard** | 1 | One defect allowed |
| **extended** | 2 | Two defects allowed |
| **specialist** | 3 | Niche skills, three defects allowed |

**Gate requirement**: `fm=1` is mandatory for all memory types. Without frontmatter, the file is **broken** (invisible to activation), not just low quality.

## Skill Types

| Type | Components | Nature | Example |
|------|------------|--------|--------|
| **Intellectual** | tri=1, muscle=0 | Reasoning, analysis, judgment — no action | code-review, security-review |
| **Agentic** | tri=1, muscle=1 | Autonomous execution — knows AND does | md-to-word, brain-qa |

**Informational columns** (not scored):
| Col | Meaning | 1 | 0 |
|:---:|---------|---|---|
| **inh** | Inheritance | Master-only | Synced to heirs |
| **stale** | Staleness | Needs regular review | Stable |
| **sem** | Semantic Review | Reviewed post-synapse-cleanup | Pending review |

> **Semantic Review (sem)**: One-time audit to verify each brain file is clear, coherent, and not damaged by synapse removal. Files marked 0 need manual review for: broken references, orphaned content, outdated patterns, or content that should be renewed/removed.

## Skills

| Skill | Tier | Lines | fm | code | bounds | tri | muscle | Type | Score | Pass | inh | stale | sem |
|-------|:----:|------:|:--:|:----:|:------:|:---:|:------:|:----:|------:|:----:|:---:|:-----:|:---:|
| [academic-research](../skills/academic-research/SKILL.md) | exte | 340 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [ai-generated-readme-banners](../skills/ai-generated-readme-banners/SKILL.md) | stan | 713 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [alex-effort-estimation](../skills/alex-effort-estimation/SKILL.md) | exte | 134 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [bicep-avm-mastery](../skills/bicep-avm-mastery/SKILL.md) | exte | 423 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [book-publishing](../skills/book-publishing/SKILL.md) | exte | 293 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [career-development](../skills/career-development/SKILL.md) | exte | 216 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [citation-management](../skills/citation-management/SKILL.md) | exte | 314 | 1 | - | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [comedy-writing](../skills/comedy-writing/SKILL.md) | exte | 149 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [correax-brand](../skills/correax-brand/SKILL.md) | exte | 149 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 1 | 0 | 1 |
| [counseling-psychology](../skills/counseling-psychology/SKILL.md) | exte | 208 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [cross-cultural-collaboration](../skills/cross-cultural-collaboration/SKILL.md) | exte | 340 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [deep-work-optimization](../skills/deep-work-optimization/SKILL.md) | exte | 366 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [dissertation-defense](../skills/dissertation-defense/SKILL.md) | exte | 495 | 1 | - | 1 | 0 | 0 | - | 2/2 | ✓ | 1 | 0 | 1 |
| [fabric-notebook-publish](../skills/fabric-notebook-publish/SKILL.md) | exte | 177 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [game-design](../skills/game-design/SKILL.md) | exte | 184 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [grant-writing](../skills/grant-writing/SKILL.md) | exte | 195 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [graphic-design](../skills/graphic-design/SKILL.md) | exte | 452 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [healthcare-informatics](../skills/healthcare-informatics/SKILL.md) | exte | 174 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [hr-people-operations](../skills/hr-people-operations/SKILL.md) | exte | 187 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [infrastructure-as-code](../skills/infrastructure-as-code/SKILL.md) | stan | 842 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [journalism](../skills/journalism/SKILL.md) | exte | 180 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [legal-compliance](../skills/legal-compliance/SKILL.md) | exte | 158 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [literature-review](../skills/literature-review/SKILL.md) | exte | 346 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [localization](../skills/localization/SKILL.md) | exte | 952 | 1 | 1 | 0 | 1 | 0 | I | 2/1 | ✓ | 0 | 0 | 1 |
| [markdown-mermaid](../skills/markdown-mermaid/SKILL.md) | stan | 1576 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [mcp-development](../skills/mcp-development/SKILL.md) | stan | 740 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [microsoft-graph-api](../skills/microsoft-graph-api/SKILL.md) | stan | 520 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [practitioner-research](../skills/practitioner-research/SKILL.md) | exte | 303 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 1 | 0 | 1 |
| [project-scaffolding](../skills/project-scaffolding/SKILL.md) | stan | 88 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [sales-enablement](../skills/sales-enablement/SKILL.md) | exte | 187 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 0 | 0 | 1 |
| [skill-building](../skills/skill-building/SKILL.md) | stan | 540 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [skill-catalog-generator](../skills/skill-catalog-generator/SKILL.md) | exte | 217 | 1 | 1 | 1 | 0 | 0 | - | 2/2 | ✓ | 1 | 0 | 1 |
| [ui-ux-design](../skills/ui-ux-design/SKILL.md) | stan | 604 | 1 | 1 | 0 | 1 | 0 | I | 2/2 | ✓ | 0 | 0 | 1 |
| [agent-debug-panel](../skills/agent-debug-panel/SKILL.md) | stan | 138 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [ai-agent-design](../skills/ai-agent-design/SKILL.md) | stan | 224 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [ai-character-reference-generation](../skills/ai-character-reference-generation/SKILL.md) | stan | 322 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [ai-writing-avoidance](../skills/ai-writing-avoidance/SKILL.md) | stan | 333 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [airs-appropriate-reliance](../skills/airs-appropriate-reliance/SKILL.md) | exte | 325 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 1 | 0 | 1 |
| [anti-hallucination](../skills/anti-hallucination/SKILL.md) | core | 153 | 1 | - | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [api-design](../skills/api-design/SKILL.md) | stan | 224 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [api-documentation](../skills/api-documentation/SKILL.md) | stan | 312 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [appropriate-reliance](../skills/appropriate-reliance/SKILL.md) | core | 497 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [architecture-audit](../skills/architecture-audit/SKILL.md) | stan | 292 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [architecture-health](../skills/architecture-health/SKILL.md) | stan | 102 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [architecture-refinement](../skills/architecture-refinement/SKILL.md) | stan | 120 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [awareness](../skills/awareness/SKILL.md) | core | 349 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [azure-architecture-patterns](../skills/azure-architecture-patterns/SKILL.md) | stan | 204 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [azure-deployment-operations](../skills/azure-deployment-operations/SKILL.md) | stan | 276 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [azure-devops-automation](../skills/azure-devops-automation/SKILL.md) | stan | 456 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [azure-openai-patterns](../skills/azure-openai-patterns/SKILL.md) | stan | 244 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [bootstrap-learning](../skills/bootstrap-learning/SKILL.md) | stan | 114 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [brand-asset-management](../skills/brand-asset-management/SKILL.md) | stan | 131 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [business-analysis](../skills/business-analysis/SKILL.md) | stan | 273 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [change-management](../skills/change-management/SKILL.md) | stan | 235 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [character-aging-progression](../skills/character-aging-progression/SKILL.md) | exte | 225 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [chart-interpretation](../skills/chart-interpretation/SKILL.md) | stan | 185 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [chat-participant-patterns](../skills/chat-participant-patterns/SKILL.md) | stan | 189 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 1 | 1 |
| [cloud-solution-architect](../skills/cloud-solution-architect/SKILL.md) | stan | 275 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [coaching-techniques](../skills/coaching-techniques/SKILL.md) | exte | 326 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [code-review](../skills/code-review/SKILL.md) | core | 193 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [cognitive-load](../skills/cognitive-load/SKILL.md) | core | 202 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [cognitive-symbiosis](../skills/cognitive-symbiosis/SKILL.md) | exte | 244 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [content-safety-implementation](../skills/content-safety-implementation/SKILL.md) | stan | 228 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [converter-qa](../skills/converter-qa/SKILL.md) | exte | 67 | 1 | 1 | 0 | 1 | 1 | A | 3/2 | ✓ | 0 | 0 | 1 |
| [copilot-sdk](../skills/copilot-sdk/SKILL.md) | stan | 484 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [creative-writing](../skills/creative-writing/SKILL.md) | stan | 465 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [dashboard-design](../skills/dashboard-design/SKILL.md) | stan | 207 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [data-analysis](../skills/data-analysis/SKILL.md) | stan | 220 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [data-quality-monitoring](../skills/data-quality-monitoring/SKILL.md) | stan | 211 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [data-storytelling](../skills/data-storytelling/SKILL.md) | stan | 169 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [data-visualization](../skills/data-visualization/SKILL.md) | stan | 295 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [database-design](../skills/database-design/SKILL.md) | stan | 417 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [debugging-patterns](../skills/debugging-patterns/SKILL.md) | core | 118 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [dialog-engineering](../skills/dialog-engineering/SKILL.md) | core | 155 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [distribution-security](../skills/distribution-security/SKILL.md) | stan | 221 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [doc-hygiene](../skills/doc-hygiene/SKILL.md) | core | 144 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [documentation-quality-assurance](../skills/documentation-quality-assurance/SKILL.md) | stan | 374 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [dream-state](../skills/dream-state/SKILL.md) | stan | 135 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [enterprise-integration](../skills/enterprise-integration/SKILL.md) | stan | 240 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [entra-agent-id](../skills/entra-agent-id/SKILL.md) | stan | 277 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [error-recovery-patterns](../skills/error-recovery-patterns/SKILL.md) | core | 210 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [executive-storytelling](../skills/executive-storytelling/SKILL.md) | stan | 463 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [extension-audit-methodology](../skills/extension-audit-methodology/SKILL.md) | stan | 190 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 1 | 0 | 1 |
| [financial-analysis](../skills/financial-analysis/SKILL.md) | exte | 158 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [flux-brand-finetune](../skills/flux-brand-finetune/SKILL.md) | exte | 392 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [foundry-agent-platform](../skills/foundry-agent-platform/SKILL.md) | exte | 281 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [frontend-design-review](../skills/frontend-design-review/SKILL.md) | stan | 276 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [frustration-recognition](../skills/frustration-recognition/SKILL.md) | core | 387 | 1 | - | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [gamma-presentations](../skills/gamma-presentations/SKILL.md) | stan | 359 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [git-workflow](../skills/git-workflow/SKILL.md) | core | 153 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 1 | 1 |
| [global-knowledge](../skills/global-knowledge/SKILL.md) | stan | 250 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [global-knowledge-sync](../skills/global-knowledge-sync/SKILL.md) | stan | 132 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [heir-bootstrap](../skills/heir-bootstrap/SKILL.md) | stan | 178 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [heir-feedback](../skills/heir-feedback/SKILL.md) | stan | 187 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [heir-sync-management](../skills/heir-sync-management/SKILL.md) | stan | 485 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 1 | 0 | 1 |
| [image-handling](../skills/image-handling/SKILL.md) | stan | 372 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [incident-response](../skills/incident-response/SKILL.md) | stan | 117 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [knowledge-synthesis](../skills/knowledge-synthesis/SKILL.md) | stan | 134 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [learning-psychology](../skills/learning-psychology/SKILL.md) | stan | 203 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [lint-clean-markdown](../skills/lint-clean-markdown/SKILL.md) | core | 108 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [llm-model-selection](../skills/llm-model-selection/SKILL.md) | stan | 215 | 1 | - | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 1 | 1 |
| [m365-agent-debugging](../skills/m365-agent-debugging/SKILL.md) | stan | 164 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 1 | 1 |
| [mcp-builder](../skills/mcp-builder/SKILL.md) | stan | 317 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [meditation](../skills/meditation/SKILL.md) | stan | 171 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [meeting-efficiency](../skills/meeting-efficiency/SKILL.md) | stan | 357 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [memory-activation](../skills/memory-activation/SKILL.md) | core | 383 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [memory-curation](../skills/memory-curation/SKILL.md) | stan | 191 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [memory-export](../skills/memory-export/SKILL.md) | exte | 104 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [microsoft-fabric](../skills/microsoft-fabric/SKILL.md) | stan | 333 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [msal-authentication](../skills/msal-authentication/SKILL.md) | stan | 264 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [multi-agent-orchestration](../skills/multi-agent-orchestration/SKILL.md) | stan | 321 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [muscle-memory-recognition](../skills/muscle-memory-recognition/SKILL.md) | stan | 206 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [nav-inject](../skills/nav-inject/SKILL.md) | exte | 74 | 1 | 1 | 0 | 1 | 1 | A | 3/2 | ✓ | 0 | 0 | 1 |
| [north-star](../skills/north-star/SKILL.md) | core | 321 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [observability-monitoring](../skills/observability-monitoring/SKILL.md) | stan | 350 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [performance-profiling](../skills/performance-profiling/SKILL.md) | stan | 439 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [persona-detection](../skills/persona-detection/SKILL.md) | core | 112 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [pii-privacy-regulations](../skills/pii-privacy-regulations/SKILL.md) | exte | 359 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [post-mortem](../skills/post-mortem/SKILL.md) | exte | 167 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [pptx-generation](../skills/pptx-generation/SKILL.md) | exte | 157 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [presentation-tool-selection](../skills/presentation-tool-selection/SKILL.md) | stan | 227 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [privacy-responsible-ai](../skills/privacy-responsible-ai/SKILL.md) | stan | 278 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 1 | 1 |
| [proactive-assistance](../skills/proactive-assistance/SKILL.md) | core | 210 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [project-deployment](../skills/project-deployment/SKILL.md) | stan | 305 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [project-management](../skills/project-management/SKILL.md) | stan | 248 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [prompt-engineering](../skills/prompt-engineering/SKILL.md) | stan | 356 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [prompt-evolution-system](../skills/prompt-evolution-system/SKILL.md) | stan | 188 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [rag-architecture](../skills/rag-architecture/SKILL.md) | stan | 390 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [ralph-loop](../skills/ralph-loop/SKILL.md) | adva | 239 | 1 | 1 | 1 | 0 | 1 | - | 3/3 | ✓ | 0 | 0 | 1 |
| [react-vite-performance](../skills/react-vite-performance/SKILL.md) | stan | 302 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [refactoring-patterns](../skills/refactoring-patterns/SKILL.md) | core | 234 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [release-preflight](../skills/release-preflight/SKILL.md) | stan | 105 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 1 | 0 | 1 |
| [release-process](../skills/release-process/SKILL.md) | stan | 299 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 1 | 0 | 1 |
| [research-first-development](../skills/research-first-development/SKILL.md) | stan | 396 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [root-cause-analysis](../skills/root-cause-analysis/SKILL.md) | core | 143 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [rubber-duck-debugging](../skills/rubber-duck-debugging/SKILL.md) | exte | 171 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [scope-management](../skills/scope-management/SKILL.md) | stan | 267 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [secrets-management](../skills/secrets-management/SKILL.md) | stan | 439 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [security-review](../skills/security-review/SKILL.md) | core | 333 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [self-actualization](../skills/self-actualization/SKILL.md) | stan | 201 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [service-worker-offline-first](../skills/service-worker-offline-first/SKILL.md) | exte | 252 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [silence-as-signal](../skills/silence-as-signal/SKILL.md) | core | 242 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [skill-creator](../skills/skill-creator/SKILL.md) | stan | 410 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [skill-development](../skills/skill-development/SKILL.md) | stan | 339 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [slide-design](../skills/slide-design/SKILL.md) | exte | 351 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [socratic-questioning](../skills/socratic-questioning/SKILL.md) | exte | 169 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [sse-streaming](../skills/sse-streaming/SKILL.md) | exte | 289 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [stakeholder-management](../skills/stakeholder-management/SKILL.md) | stan | 292 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [status-reporting](../skills/status-reporting/SKILL.md) | stan | 265 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [svg-graphics](../skills/svg-graphics/SKILL.md) | stan | 209 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [teams-app-patterns](../skills/teams-app-patterns/SKILL.md) | stan | 195 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 1 | 1 |
| [terminal-image-rendering](../skills/terminal-image-rendering/SKILL.md) | exte | 113 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [testing-strategies](../skills/testing-strategies/SKILL.md) | core | 156 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 1 |
| [text-to-speech](../skills/text-to-speech/SKILL.md) | exte | 122 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [token-waste-elimination](../skills/token-waste-elimination/SKILL.md) | stan | 124 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [visual-memory](../skills/visual-memory/SKILL.md) | exte | 343 | 1 | 1 | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [vscode-configuration-validation](../skills/vscode-configuration-validation/SKILL.md) | stan | 232 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [vscode-environment](../skills/vscode-environment/SKILL.md) | stan | 110 | 1 | 1 | 1 | 1 | 0 | I | 3/2 | ✓ | 0 | 0 | 1 |
| [vscode-extension-patterns](../skills/vscode-extension-patterns/SKILL.md) | core | 278 | 1 | 1 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 1 | 1 |
| [work-life-balance](../skills/work-life-balance/SKILL.md) | exte | 119 | 1 | - | 1 | 1 | 0 | I | 3/1 | ✓ | 0 | 0 | 1 |
| [brain-qa](../skills/brain-qa/SKILL.md) | stan | 268 | 1 | 1 | 1 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 1 |
| [docx-to-md](../skills/docx-to-md/SKILL.md) | exte | 359 | 1 | 1 | 1 | 1 | 1 | A | 4/2 | ✓ | 0 | 0 | 1 |
| [md-scaffold](../skills/md-scaffold/SKILL.md) | exte | 236 | 1 | 1 | 1 | 1 | 1 | A | 4/2 | ✓ | 0 | 0 | 1 |
| [md-to-eml](../skills/md-to-eml/SKILL.md) | exte | 203 | 1 | 1 | 1 | 1 | 1 | A | 4/2 | ✓ | 0 | 0 | 1 |
| [md-to-html](../skills/md-to-html/SKILL.md) | stan | 202 | 1 | 1 | 1 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 1 |
| [md-to-word](../skills/md-to-word/SKILL.md) | stan | 408 | 1 | 1 | 1 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 1 |

**Summary**: 166 skills | Passing: 166 | Failing: 0 | Perfect: 130

**Skill Types**: Agentic(A): 8 | Intellectual(I): 133 | Incomplete(-): 25

**Semantic Review**: 166/166 reviewed | 0 pending

**Defects by dimension (informational)**:
| fm | code | bounds | tri | muscle |
|:--:|:----:|:------:|:---:|:------:|
| 0 | 21 | 11 | 25 | 157 |

## Agents

**Scoring Criteria**:
| Dim | Name | 1 (good) | 0 (defect) |
|:---:|------|----------|------------|
| **fm** | Frontmatter | Has `description`, `name`, `model`, `tools` | Missing any |
| **handoffs** | Handoffs | Has `handoffs:` for agent orchestration | No handoffs |
| **bounds** | Bounds | 50–400 lines | <50 (stub) or >400 (bloated) |
| **persona** | Persona | Has `## Mental Model`, `## Core Identity`, or similar | No persona section |
| **code** | Examples | Has pseudocode, templates, or diagrams | No examples |

> **Code policy**: Agent examples should use **pseudocode** (language-agnostic patterns), **templates** (markdown output formats), or **diagrams** (Mermaid). Avoid language-specific syntax — agents teach patterns, not syntax.

> **Semantic Review (sem)**: Audit each agent for: clear persona, appropriate examples (pseudocode not language-specific), coherent structure. Files marked 0 need optimization.

**Pass criteria**: fm=1 (gate) AND score ≥4/5

| Agent | Lines | fm | handoffs | bounds | persona | code | Score | Pass | sem |
|-------|------:|:--:|:--------:|:------:|:-------:|:----:|------:|:----:|:---:|
| [alex-azure](../agents/alex-azure.agent.md) | 104 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✗ | 1 |
| [alex-m365](../agents/alex-m365.agent.md) | 101 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✗ | 1 |
| [alex-documentarian](../agents/alex-documentarian.agent.md) | 212 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [alex](../agents/alex.agent.md) | 263 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [alex-backend](../agents/alex-backend.agent.md) | 233 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-builder](../agents/alex-builder.agent.md) | 237 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-frontend](../agents/alex-frontend.agent.md) | 276 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-infrastructure](../agents/alex-infrastructure.agent.md) | 340 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-planner](../agents/alex-planner.agent.md) | 230 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-presenter](../agents/alex-presenter.agent.md) | 252 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-researcher](../agents/alex-researcher.agent.md) | 248 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [alex-validator](../agents/alex-validator.agent.md) | 258 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |

**Summary**: 12 agents | Passing: 10 | Failing: 2 | Perfect(5/5): 8
**Semantic Review**: 12/12 reviewed | 0 pending

## Instructions

> **Design**: Instructions are **discoverable knowledge modules** that can serve multiple skills. Frontmatter enables routing without reading the full document.

**Scoring Criteria**:
| Dim | Name | 1 (good) | 0 (defect) |
|:---:|------|----------|------------|
| **fm** | Frontmatter | Has `description` AND `application` | Missing either |
| **depth** | Depth | >50 lines | ≤50 lines |
| **sect** | Sections | ≥2 `##` headers | Flat structure |
| **code** | Code | Has code block | No examples |
| **skill** | Trifecta | Has matching skill | Standalone instruction |

> **Frontmatter fields**: `description` (what it does) + `application` (when/why to use). Optional: `applyTo` (Copilot file-pattern activation).

**Pass criteria**: fm=1 (gate) AND score ≥3/5

| Instruction | Lines | fm | depth | sect | code | skill | Score | Pass | sem |
|-------------|------:|:--:|:-----:|:----:|:----:|:-----:|------:|:----:|:---:|
| [__test-exclusion](../instructions/__test-exclusion.instructions.md) | 7 | 1 | 0 | 0 | 0 | 0 | 1/5 | ✗ | 1 |
| [teams-app-patterns](../instructions/teams-app-patterns.instructions.md) | 34 | 1 | 0 | 0 | 0 | 1 | 2/5 | ✗ | 1 |
| [worldview-constitutional-ai](../instructions/worldview-constitutional-ai.instructions.md) | 40 | 1 | 0 | 1 | 0 | 0 | 2/5 | ✗ | 1 |
| [worldview-moral-psychology](../instructions/worldview-moral-psychology.instructions.md) | 37 | 1 | 0 | 1 | 0 | 0 | 2/5 | ✗ | 1 |
| [ai-agent-design](../instructions/ai-agent-design.instructions.md) | 36 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [ai-generated-readme-banners](../instructions/ai-generated-readme-banners.instructions.md) | 42 | 1 | 0 | 0 | 1 | 1 | 3/5 | ✓ | 1 |
| [ai-writing-avoidance](../instructions/ai-writing-avoidance.instructions.md) | 41 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [alex-identity-integration](../instructions/alex-identity-integration.instructions.md) | 161 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [anti-hallucination](../instructions/anti-hallucination.instructions.md) | 33 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [appropriate-reliance](../instructions/appropriate-reliance.instructions.md) | 43 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [awareness](../instructions/awareness.instructions.md) | 40 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [azure-architecture-patterns](../instructions/azure-architecture-patterns.instructions.md) | 33 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [bootstrap-learning](../instructions/bootstrap-learning.instructions.md) | 45 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [business-analysis](../instructions/business-analysis.instructions.md) | 38 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [database-design](../instructions/database-design.instructions.md) | 38 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [documentation-quality-assurance](../instructions/documentation-quality-assurance.instructions.md) | 40 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [emotional-intelligence](../instructions/emotional-intelligence.instructions.md) | 92 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [empirical-validation](../instructions/empirical-validation.instructions.md) | 79 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [entra-agent-id](../instructions/entra-agent-id.instructions.md) | 46 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [executive-storytelling](../instructions/executive-storytelling.instructions.md) | 37 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [flux-brand-finetune](../instructions/flux-brand-finetune.instructions.md) | 44 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [frustration-recognition](../instructions/frustration-recognition.instructions.md) | 31 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [git-workflow](../instructions/git-workflow.instructions.md) | 47 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [global-knowledge-sync](../instructions/global-knowledge-sync.instructions.md) | 41 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [global-knowledge](../instructions/global-knowledge.instructions.md) | 38 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [heir-bootstrap](../instructions/heir-bootstrap.instructions.md) | 39 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [heir-sync-management](../instructions/heir-sync-management.instructions.md) | 45 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [image-generation-guidelines](../instructions/image-generation-guidelines.instructions.md) | 185 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [incident-response](../instructions/incident-response.instructions.md) | 39 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [knowledge-synthesis](../instructions/knowledge-synthesis.instructions.md) | 48 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [learning-psychology](../instructions/learning-psychology.instructions.md) | 34 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [lucid-dream-integration](../instructions/lucid-dream-integration.instructions.md) | 68 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [m365-agent-debugging](../instructions/m365-agent-debugging.instructions.md) | 50 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [meeting-efficiency](../instructions/meeting-efficiency.instructions.md) | 39 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [memory-export](../instructions/memory-export.instructions.md) | 25 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [microsoft-fabric](../instructions/microsoft-fabric.instructions.md) | 37 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [multi-agent-orchestration](../instructions/multi-agent-orchestration.instructions.md) | 39 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [observability-monitoring](../instructions/observability-monitoring.instructions.md) | 36 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [performance-profiling](../instructions/performance-profiling.instructions.md) | 37 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [planning-first-development](../instructions/planning-first-development.instructions.md) | 167 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [privacy-responsible-ai](../instructions/privacy-responsible-ai.instructions.md) | 38 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [project-deployment](../instructions/project-deployment.instructions.md) | 38 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [prompt-engineering](../instructions/prompt-engineering.instructions.md) | 39 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [protocol-triggers](../instructions/protocol-triggers.instructions.md) | 220 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [rag-architecture](../instructions/rag-architecture.instructions.md) | 37 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [release-process](../instructions/release-process.instructions.md) | 45 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [repository-readiness-eval](../instructions/repository-readiness-eval.instructions.md) | 98 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [research-first-development](../instructions/research-first-development.instructions.md) | 42 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [scope-management](../instructions/scope-management.instructions.md) | 43 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [skill-development](../instructions/skill-development.instructions.md) | 39 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [skill-selection-optimization](../instructions/skill-selection-optimization.instructions.md) | 211 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [stakeholder-management](../instructions/stakeholder-management.instructions.md) | 38 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [status-reporting](../instructions/status-reporting.instructions.md) | 45 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 1 |
| [synapse-notebook-patterns](../instructions/synapse-notebook-patterns.instructions.md) | 95 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [trifecta-audit](../instructions/trifecta-audit.instructions.md) | 304 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [worldview-integration](../instructions/worldview-integration.instructions.md) | 83 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 1 |
| [adversarial-oversight](../instructions/adversarial-oversight.instructions.md) | 338 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [agent-debug-panel](../instructions/agent-debug-panel.instructions.md) | 34 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 1 |
| [alex-core](../instructions/alex-core.instructions.md) | 525 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [api-design](../instructions/api-design.instructions.md) | 46 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 1 |
| [architecture-decision-records](../instructions/architecture-decision-records.instructions.md) | 279 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [automated-quality-gates](../instructions/automated-quality-gates.instructions.md) | 107 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [azure-enterprise-deployment](../instructions/azure-enterprise-deployment.instructions.md) | 369 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [chart-interpretation](../instructions/chart-interpretation.instructions.md) | 118 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [cognitive-benchmarking](../instructions/cognitive-benchmarking.instructions.md) | 150 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [cognitive-health-validation](../instructions/cognitive-health-validation.instructions.md) | 417 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [content-safety-implementation](../instructions/content-safety-implementation.instructions.md) | 134 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [copilot-chat-buttons](../instructions/copilot-chat-buttons.instructions.md) | 92 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [coupling-metrics](../instructions/coupling-metrics.instructions.md) | 79 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [dashboard-design](../instructions/dashboard-design.instructions.md) | 113 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [data-analysis](../instructions/data-analysis.instructions.md) | 110 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [data-storytelling](../instructions/data-storytelling.instructions.md) | 95 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [debugging-patterns](../instructions/debugging-patterns.instructions.md) | 81 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [deep-thinking](../instructions/deep-thinking.instructions.md) | 136 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [dependency-management](../instructions/dependency-management.instructions.md) | 306 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [dream-state-automation](../instructions/dream-state-automation.instructions.md) | 482 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [extension-audit-methodology](../instructions/extension-audit-methodology.instructions.md) | 59 | 1 | 1 | 0 | 1 | 1 | 4/5 | ✓ | 1 |
| [gamma-presentation](../instructions/gamma-presentation.instructions.md) | 181 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [global-knowledge-curation](../instructions/global-knowledge-curation.instructions.md) | 141 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [heir-project-improvement](../instructions/heir-project-improvement.instructions.md) | 375 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [heir-skill-promotion](../instructions/heir-skill-promotion.instructions.md) | 289 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [image-handling](../instructions/image-handling.instructions.md) | 88 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [language-detection-patterns](../instructions/language-detection-patterns.instructions.md) | 137 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [lint-clean-markdown](../instructions/lint-clean-markdown.instructions.md) | 48 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 1 |
| [log-pattern-analyzer](../instructions/log-pattern-analyzer.instructions.md) | 96 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [markdown-mermaid](../instructions/markdown-mermaid.instructions.md) | 83 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [mcp-builder](../instructions/mcp-builder.instructions.md) | 47 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 1 |
| [md-scaffold](../instructions/md-scaffold.instructions.md) | 76 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [meditation](../instructions/meditation.instructions.md) | 131 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [memory-curation](../instructions/memory-curation.instructions.md) | 34 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 1 |
| [nasa-code-standards](../instructions/nasa-code-standards.instructions.md) | 413 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [north-star](../instructions/north-star.instructions.md) | 59 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [refactoring-patterns](../instructions/refactoring-patterns.instructions.md) | 98 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [release-management](../instructions/release-management.instructions.md) | 930 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [research-first-workflow](../instructions/research-first-workflow.instructions.md) | 380 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [roadmap-maintenance](../instructions/roadmap-maintenance.instructions.md) | 236 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [root-cause-analysis](../instructions/root-cause-analysis.instructions.md) | 59 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [secrets-management](../instructions/secrets-management.instructions.md) | 60 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [security-review](../instructions/security-review.instructions.md) | 62 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [semantic-audit](../instructions/semantic-audit.instructions.md) | 144 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [skill-building](../instructions/skill-building.instructions.md) | 67 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [skill-telemetry](../instructions/skill-telemetry.instructions.md) | 104 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [technical-debt-tracking](../instructions/technical-debt-tracking.instructions.md) | 222 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [terminal-command-safety](../instructions/terminal-command-safety.instructions.md) | 121 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [testing-strategies](../instructions/testing-strategies.instructions.md) | 70 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [token-waste-elimination](../instructions/token-waste-elimination.instructions.md) | 83 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [ui-ux-design](../instructions/ui-ux-design.instructions.md) | 51 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 1 |
| [vscode-extension-patterns](../instructions/vscode-extension-patterns.instructions.md) | 47 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 1 |
| [vscode-marketplace-publishing](../instructions/vscode-marketplace-publishing.instructions.md) | 348 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 1 |
| [ai-character-reference-generation](../instructions/ai-character-reference-generation.instructions.md) | 87 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [brand-asset-management](../instructions/brand-asset-management.instructions.md) | 61 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [character-aging-progression](../instructions/character-aging-progression.instructions.md) | 119 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [chat-participant-patterns](../instructions/chat-participant-patterns.instructions.md) | 183 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [code-review](../instructions/code-review.instructions.md) | 306 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [copilot-sdk](../instructions/copilot-sdk.instructions.md) | 52 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [data-visualization](../instructions/data-visualization.instructions.md) | 122 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [docx-to-md](../instructions/docx-to-md.instructions.md) | 82 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [heir-feedback](../instructions/heir-feedback.instructions.md) | 56 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [mcp-development](../instructions/mcp-development.instructions.md) | 111 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [md-to-eml](../instructions/md-to-eml.instructions.md) | 80 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [md-to-html](../instructions/md-to-html.instructions.md) | 68 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [md-to-word](../instructions/md-to-word.instructions.md) | 88 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [microsoft-graph-api](../instructions/microsoft-graph-api.instructions.md) | 124 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [self-actualization](../instructions/self-actualization.instructions.md) | 55 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [service-worker-offline-first](../instructions/service-worker-offline-first.instructions.md) | 92 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [skill-creator](../instructions/skill-creator.instructions.md) | 55 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [visual-memory](../instructions/visual-memory.instructions.md) | 121 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |
| [vscode-configuration-validation](../instructions/vscode-configuration-validation.instructions.md) | 97 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 1 |

**Summary**: 128 instructions | Passing: 124 | Failing: 4 | Perfect(5/5): 19

**Semantic Review**: 128/128 reviewed | 0 pending

## Prompts

> **Design**: Prompts are **agent-loaded workflows** — user says "run brain-qa" and the agent matches by name/description. `application` declares WHEN to suggest this workflow.

**Scoring Criteria**:
| Dim | Name | 1 (good) | 0 (defect) |
|:---:|------|----------|------------|
| **desc** | Description | Has `description:` in frontmatter | Missing description |
| **app** | Application | Has `application:` with WHEN hint | Missing application |
| **agent** | Agent Routing | Has `agent:` field | No agent routing |
| **>20L** | Content | >20 lines | ≤20 lines (stub) |

**Pass criteria**: desc=1 AND app=1 (gates) AND score ≥3/4

| Prompt | Lines | desc | app | agent | >20L | Score | Pass |
|--------|------:|:----:|:---:|:-----:|:----:|------:|:----:|
| [docx-to-md](../prompts/docx-to-md.prompt.md) | 129 | 1 | 0 | 0 | 1 | 2/4 | ✗ |
| [md-scaffold](../prompts/md-scaffold.prompt.md) | 128 | 1 | 0 | 0 | 1 | 2/4 | ✗ |
| [md-to-eml](../prompts/md-to-eml.prompt.md) | 122 | 1 | 0 | 0 | 1 | 2/4 | ✗ |
| [md-to-html](../prompts/md-to-html.prompt.md) | 100 | 1 | 0 | 0 | 1 | 2/4 | ✗ |
| [md-to-word](../prompts/md-to-word.prompt.md) | 123 | 1 | 0 | 0 | 1 | 2/4 | ✗ |
| [ai-character-reference-generation](../prompts/ai-character-reference-generation.prompt.md) | 380 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [ai-generated-readme-banners](../prompts/ai-generated-readme-banners.prompt.md) | 503 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [alex](../prompts/alex.prompt.md) | 8 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [audit-writing](../prompts/audit-writing.prompt.md) | 37 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [azure](../prompts/azure.prompt.md) | 16 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [builder](../prompts/builder.prompt.md) | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [character-aging-progression](../prompts/character-aging-progression.prompt.md) | 167 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [chat-participant](../prompts/chat-participant.prompt.md) | 196 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [documentarian](../prompts/documentarian.prompt.md) | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [extension-audit-methodology](../prompts/extension-audit-methodology.prompt.md) | 514 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [flux-brand-finetune](../prompts/flux-brand-finetune.prompt.md) | 91 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [gamma](../prompts/gamma.prompt.md) | 218 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [graph-api](../prompts/graph-api.prompt.md) | 210 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [image-handling](../prompts/image-handling.prompt.md) | 132 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [journey](../prompts/journey.prompt.md) | 231 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [m365-agent-debug](../prompts/m365-agent-debug.prompt.md) | 184 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [m365](../prompts/m365.prompt.md) | 16 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [marp](../prompts/marp.prompt.md) | 194 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [mcp-server](../prompts/mcp-server.prompt.md) | 193 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [presentation](../prompts/presentation.prompt.md) | 105 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [researcher](../prompts/researcher.prompt.md) | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [teams-app](../prompts/teams-app.prompt.md) | 200 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [ui-ux-audit](../prompts/ui-ux-audit.prompt.md) | 686 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [validate-config](../prompts/validate-config.prompt.md) | 70 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [validator](../prompts/validator.prompt.md) | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| [visual-memory](../prompts/visual-memory.prompt.md) | 221 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [vscode-extension-audit](../prompts/vscode-extension-audit.prompt.md) | 164 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| [add-endpoint](../prompts/add-endpoint.prompt.md) | 117 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [alex-initialization](../prompts/alex-initialization.prompt.md) | 45 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [analyze](../prompts/analyze.prompt.md) | 41 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [brainqa](../prompts/brainqa.prompt.md) | 46 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [brand](../prompts/brand.prompt.md) | 32 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [code-review-checklist](../prompts/code-review-checklist.prompt.md) | 84 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [create-store](../prompts/create-store.prompt.md) | 111 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [cross-domain-transfer](../prompts/cross-domain-transfer.prompt.md) | 52 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [dashboard](../prompts/dashboard.prompt.md) | 42 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [datastory](../prompts/datastory.prompt.md) | 40 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [debug](../prompts/debug.prompt.md) | 25 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [diagramming](../prompts/diagramming.prompt.md) | 41 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [domain-learning](../prompts/domain-learning.prompt.md) | 43 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [dream](../prompts/dream.prompt.md) | 38 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [export-memory](../prompts/export-memory.prompt.md) | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [gapanalysis](../prompts/gapanalysis.prompt.md) | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [improve](../prompts/improve.prompt.md) | 87 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [interpret](../prompts/interpret.prompt.md) | 46 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [knowledge](../prompts/knowledge.prompt.md) | 33 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [learn](../prompts/learn.prompt.md) | 29 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [masteraudit](../prompts/masteraudit.prompt.md) | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [meditate](../prompts/meditate.prompt.md) | 37 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [memory-audit](../prompts/memory-audit.prompt.md) | 36 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [northstar](../prompts/northstar.prompt.md) | 104 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [performance-assessment](../prompts/performance-assessment.prompt.md) | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [plan](../prompts/plan.prompt.md) | 101 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [promotetomaster](../prompts/promotetomaster.prompt.md) | 40 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [refactor](../prompts/refactor.prompt.md) | 33 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [release](../prompts/release.prompt.md) | 52 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [review](../prompts/review.prompt.md) | 55 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [root-cause-analysis](../prompts/root-cause-analysis.prompt.md) | 28 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [secrets](../prompts/secrets.prompt.md) | 91 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [security-review](../prompts/security-review.prompt.md) | 26 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [selfactualize](../prompts/selfactualize.prompt.md) | 38 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [skill-building](../prompts/skill-building.prompt.md) | 37 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [tdd](../prompts/tdd.prompt.md) | 62 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [token-audit](../prompts/token-audit.prompt.md) | 34 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [visualize](../prompts/visualize.prompt.md) | 41 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| [word](../prompts/word.prompt.md) | 63 | 1 | 1 | 1 | 1 | 4/4 | ✓ |

**Summary**: 71 prompts | Passing: 66 | Failing: 5 | Perfect(4/4): 39

### Criterion Validity

| Criterion | Pass | Rate | Validity |
|-----------|-----:|-----:|----------|
| desc | 71/71 | 100% | ✓ Valid — required for discoverability |
| app | 66/71 | 93% | ✓ Valid — tells agent WHEN to suggest |
| agent | 46/71 | 65% | ✓ Valid — identifies routing prompts |
| >20L | 64/71 | 90% | ✓ Valid — identifies workflow content |

## Muscles

> **Design**: Muscles are **execution scripts** that convert cognitive decisions into real-world output. Memory files define *what* and *how*; muscles *do*.

**Scoring Criteria**:
| Dim | Name | 1 (good) | 0 (defect) |
|:---:|------|----------|------------|
| **comments** | Well Documented | Header block + ≥5 inline comments | Missing header or insufficient comments |
| **err** | Error Handling | try/catch, .catch(), $ErrorActionPreference | No error handling (fragile) |
| **bounds** | Bounds | 50–1000 lines | <50 (stub) or >1000 (bloated) |
| **compat** | Cross-Platform | path.join/Join-Path, no hardcoded separators | Hardcoded path separators |

**Pass criteria**: err=1 (gate) AND score ≥3/4

**Review Date**: Add `@reviewed: YYYY-MM-DD` comment to track code review currency.

### Standard Muscle Header

Muscles SHOULD use the standard header format for discoverability:

```javascript
#!/usr/bin/env node
/**
 * @muscle muscle-name
 * @description What this muscle does
 * @version 1.0.0
 * @skill linked-skill-name
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires pandoc, mermaid-cli
 */
```

| Tag | Required | Purpose |
|-----|:--------:|---------|
| `@muscle` | ✓ | Canonical muscle name |
| `@description` | ✓ | What it does (for search/display) |
| `@version` | | Semantic version |
| `@skill` | | Linked skill name for trifecta binding |
| `@reviewed` | | Code review date (YYYY-MM-DD) |
| `@platform` | | Supported platforms (windows,macos,linux) |
| `@requires` | | External dependencies |

| Muscle | Lines | Lang | Category | comments | err | bounds | compat | Score | Pass | inh | Reviewed |
|--------|------:|:----:|----------|:--------:|:---:|:------:|:------:|------:|:----:|:---:|----------|
| [install-hooks.ps1](../muscles/install-hooks.ps1) | 48 | ps | build | 0 | 1 | 0 | 0 | 1/4 | ✗ | 0 | — |
| [brain-qa.ps1](../muscles/brain-qa.ps1) | 1812 | ps | validation | 0 | 1 | 0 | 1 | 2/4 | ✗ | 1 | — |
| [install-hooks.cjs](../muscles/install-hooks.cjs) | 62 | js | build | 0 | 0 | 1 | 1 | 2/4 | ✗ | 0 | — |
| [validate-skills.cjs](../muscles/validate-skills.cjs) | 106 | js | validation | 0 | 0 | 1 | 1 | 2/4 | ✗ | 0 | — |
| [audit-master-alex.cjs](../muscles/audit-master-alex.cjs) | 537 | js | validation | 0 | 1 | 1 | 1 | 3/4 | ✓ | 1 | — |
| [audit-master-alex.ps1](../muscles/audit-master-alex.ps1) | 441 | ps | validation | 1 | 1 | 1 | 0 | 3/4 | ✓ | 1 | — |
| [audit-token-waste.cjs](../muscles/audit-token-waste.cjs) | 449 | js | validation | 1 | 0 | 1 | 1 | 3/4 | ✗ | 0 | — |
| [brain-qa-heir.cjs](../muscles/brain-qa-heir.cjs) | 962 | js | validation | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [brain-qa-heir.ps1](../muscles/brain-qa-heir.ps1) | 934 | ps | validation | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [build-extension-package.ps1](../muscles/build-extension-package.ps1) | 338 | ps | build | 0 | 1 | 1 | 1 | 3/4 | ✓ | 1 | — |
| [chart-recommend.cjs](../muscles/chart-recommend.cjs) | 241 | js | analysis | 1 | 0 | 1 | 1 | 3/4 | ✗ | 0 | — |
| [converter-qa.cjs](../muscles/converter-qa.cjs) | 1268 | js | validation | 1 | 1 | 0 | 1 | 3/4 | ✓ | 1 | — |
| [dashboard-scaffold.cjs](../muscles/dashboard-scaffold.cjs) | 316 | js | converter | 1 | 0 | 1 | 1 | 3/4 | ✗ | 0 | — |
| [data-profile.cjs](../muscles/data-profile.cjs) | 286 | js | analysis | 1 | 0 | 1 | 1 | 3/4 | ✗ | 0 | — |
| [fix-fence-bug.ps1](../muscles/fix-fence-bug.ps1) | 189 | ps | utility | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [md-to-word.cjs](../muscles/md-to-word.cjs) | 1186 | js | converter | 1 | 1 | 0 | 1 | 3/4 | ✓ | 0 | 2026-04-15 |
| [nav-inject.cjs](../muscles/nav-inject.cjs) | 215 | js | converter | 1 | 0 | 1 | 1 | 3/4 | ✗ | 0 | — |
| [new-skill.cjs](../muscles/new-skill.cjs) | 143 | js | build | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [new-skill.ps1](../muscles/new-skill.ps1) | 130 | ps | build | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [pptxgen-cli.ts](../muscles/pptxgen-cli.ts) | 136 | ts | utility | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [sync-architecture.cjs](../muscles/sync-architecture.cjs) | 1655 | js | build | 1 | 1 | 0 | 1 | 3/4 | ✓ | 1 | 2026-04-15 |
| [validate-synapses.cjs](../muscles/validate-synapses.cjs) | 138 | js | validation | 0 | 1 | 1 | 1 | 3/4 | ✓ | 0 | — |
| [validate-synapses.ps1](../muscles/validate-synapses.ps1) | 144 | ps | validation | 1 | 1 | 1 | 0 | 3/4 | ✓ | 0 | — |
| [analyze-assignments.cjs](../muscles/analyze-assignments.cjs) | 140 | js | analysis | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [brain-qa.cjs](../muscles/brain-qa.cjs) | 937 | js | validation | 1 | 1 | 1 | 1 | 4/4 | ✓ | 1 | 2026-04-15 |
| [data-ingest.cjs](../muscles/data-ingest.cjs) | 367 | js | analysis | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [docx-to-md.cjs](../muscles/docx-to-md.cjs) | 379 | js | converter | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [dream-cli.ts](../muscles/dream-cli.ts) | 116 | ts | utility | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [gamma-generator.cjs](../muscles/gamma-generator.cjs) | 913 | js | utility | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [markdown-lint.cjs](../muscles/markdown-lint.cjs) | 444 | js | validation | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [md-scaffold.cjs](../muscles/md-scaffold.cjs) | 542 | js | converter | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [md-to-eml.cjs](../muscles/md-to-eml.cjs) | 443 | js | converter | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [md-to-html.cjs](../muscles/md-to-html.cjs) | 437 | js | converter | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [normalize-paths.ps1](../muscles/normalize-paths.ps1) | 194 | ps | utility | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [ralph-loop.cjs](../muscles/ralph-loop.cjs) | 740 | js | utility | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [session-name.cjs](../muscles/session-name.cjs) | 237 | js | utility | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |
| [validate-skills.ps1](../muscles/validate-skills.ps1) | 113 | ps | validation | 1 | 1 | 1 | 1 | 4/4 | ✓ | 0 | — |

**Summary**: 37 muscles | Passing: 28 | Failing: 9 | Perfect(4/4): 14

**Inheritance**: Master-only(1): 7 | Inheritable(0): 30

**Metadata Adoption**: 3/37 have standard header | 2/37 linked to skills | 3/37 have review dates

**Categories**: build: 6 | validation: 13 | analysis: 4 | converter: 7 | utility: 7

## Overall

| Category | Count |
|----------|------:|
| Skills | 166 |
| Agents | 12 |
| Instructions | 128 |
| Prompts | 71 |
| Muscles | 37 |
| **Total** | **414** |