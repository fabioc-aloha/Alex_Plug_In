# Brain Health Grid

Generated: 2026-04-15

## Scoring Criteria

Each dimension is scored **0** (defect) or **1** (good). Score = sum of dimensions.

| Dim | Name | 1 (good) | 0 (defect) | Fix |
|:---:|------|----------|------------|-----|
| **fm** | Frontmatter | Has `name`, `description`, `applyTo`, and `tier` | Missing any required field | Auto |
| **code** | Code Examples | Has ≥1 fenced code block with language tag | No code blocks | Manual |
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

"Good is good enough" — higher tiers require higher quality:

| Tier | Min Score | Rationale |
|------|:---------:|-----------|
| **core** | 5/5 | Foundation skills must be perfect |
| **standard** | 4/5 | One defect allowed |
| **extended** | 3/5 | Two defects allowed |
| **specialist** | 2/5 | Niche skills, three defects allowed |

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
| dissertation-defense | exte | 552 | 1 | 0 | 0 | 0 | 0 | - | 1/3 | ✗ | 0 | 0 | 0 |
| agent-debug-panel | stan | 121 | 1 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 | 0 | 0 |
| ai-agent-design | stan | 595 | 1 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ | 0 | 0 | 0 |
| api-design | stan | 655 | 1 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ | 0 | 0 | 0 |
| appropriate-reliance | core | 458 | 1 | 0 | 1 | 0 | 0 | - | 2/5 | ✗ | 0 | 0 | 0 |
| awareness | core | 306 | 1 | 0 | 1 | 0 | 0 | - | 2/5 | ✗ | 0 | 0 | 0 |
| azure-architecture-patterns | stan | 575 | 1 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ | 0 | 0 | 0 |
| career-development | exte | 199 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| citation-management | exte | 314 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| comedy-writing | exte | 135 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| correax-brand | exte | 124 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| counseling-psychology | exte | 179 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| cross-cultural-collaboration | exte | 318 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| deep-work-optimization | exte | 351 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| dream-state | stan | 96 | 1 | 0 | 0 | 1 | 0 | I | 2/4 | ✗ | 0 | 0 | 0 |
| game-design | exte | 165 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| grant-writing | exte | 172 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| healthcare-informatics | exte | 142 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| hr-people-operations | exte | 155 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| journalism | exte | 154 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| legal-compliance | exte | 129 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| memory-curation | stan | 191 | 1 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 | 0 | 0 |
| refactoring-patterns | core | 61 | 1 | 0 | 0 | 1 | 0 | I | 2/5 | ✗ | 0 | 0 | 0 |
| research-project-scaffold | exte | 515 | 1 | 1 | 0 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| sales-enablement | exte | 164 | 1 | 0 | 1 | 0 | 0 | - | 2/3 | ✗ | 0 | 0 | 0 |
| skill-catalog-generator | exte | 567 | 1 | 1 | 0 | 0 | 0 | - | 2/3 | ✗ | 1 | 0 | 0 |
| svg-graphics | stan | 555 | 1 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ | 0 | 0 | 0 |
| token-waste-elimination | stan | 69 | 1 | 0 | 0 | 1 | 0 | I | 2/4 | ✗ | 0 | 0 | 0 |
| academic-research | exte | 482 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| ai-generated-readme-banners | stan | 618 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| ai-writing-avoidance | stan | 333 | 1 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| alex-effort-estimation | exte | 153 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| anti-hallucination | core | 153 | 1 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 | 0 | 0 |
| ascii-art-alignment | exte | 325 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| bicep-avm-mastery | exte | 423 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| book-publishing | exte | 293 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| bootstrap-learning | stan | 114 | 1 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| business-analysis | stan | 273 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| chart-interpretation | stan | 185 | 1 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| coaching-techniques | exte | 326 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| code-review | core | 193 | 1 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 | 0 | 0 |
| cognitive-load | core | 68 | 1 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| cognitive-symbiosis | exte | 244 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| copilot-sdk | stan | 484 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| data-analysis | stan | 220 | 1 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| data-storytelling | stan | 169 | 1 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| database-design | stan | 417 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| dialog-engineering | core | 101 | 1 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| doc-hygiene | core | 101 | 1 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| documentation-quality-assurance | stan | 374 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| entra-agent-id | stan | 277 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| error-recovery-patterns | core | 75 | 1 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| executive-storytelling | stan | 463 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| fabric-notebook-publish | exte | 177 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| financial-analysis | exte | 158 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| frustration-recognition | core | 387 | 1 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 | 0 | 0 |
| git-workflow | core | 153 | 1 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 | 1 | 0 |
| global-knowledge | stan | 250 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| global-knowledge-sync | stan | 132 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| graphic-design | exte | 452 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| heir-bootstrap | stan | 178 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| heir-feedback | stan | 193 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| heir-sync-management | stan | 485 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 1 | 0 | 0 |
| incident-response | stan | 117 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| infrastructure-as-code | stan | 842 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| learning-psychology | stan | 203 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| lint-clean-markdown | core | 108 | 1 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 | 0 | 0 |
| literature-review | exte | 346 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| localization | exte | 952 | 1 | 1 | 0 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| markdown-mermaid | stan | 1528 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| mcp-builder | stan | 317 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| mcp-development | stan | 740 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| md-scaffold | exte | 52 | 1 | 1 | 0 | 0 | 1 | - | 3/3 | ✓ | 0 | 0 | 0 |
| meeting-efficiency | stan | 357 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| memory-activation | core | 317 | 1 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| memory-export | exte | 104 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| microsoft-fabric | stan | 333 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| microsoft-graph-api | stan | 520 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| multi-agent-orchestration | stan | 321 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| observability-monitoring | stan | 350 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| performance-profiling | stan | 439 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| post-mortem | exte | 167 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| practitioner-research | exte | 302 | 1 | 1 | 1 | 0 | 0 | - | 3/3 | ✓ | 0 | 0 | 0 |
| privacy-responsible-ai | stan | 278 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 1 | 0 |
| project-deployment | stan | 305 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| project-scaffolding | stan | 88 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| prompt-engineering | stan | 356 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| rag-architecture | stan | 390 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| release-process | stan | 299 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 1 | 0 | 0 |
| research-first-development | stan | 396 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| root-cause-analysis | core | 108 | 1 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| rubber-duck-debugging | exte | 171 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| scope-management | stan | 267 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| silence-as-signal | core | 188 | 1 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 | 0 | 0 |
| skill-building | stan | 540 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| skill-creator | stan | 410 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| skill-development | stan | 339 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| slide-design | exte | 351 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| socratic-questioning | exte | 169 | 1 | 0 | 1 | 1 | 0 | I | 3/3 | ✓ | 0 | 0 | 0 |
| stakeholder-management | stan | 292 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| status-reporting | stan | 265 | 1 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 | 0 | 0 |
| ui-ux-design | stan | 604 | 1 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 | 0 | 0 |
| vscode-extension-patterns | core | 965 | 1 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 | 1 | 0 |
| ai-character-reference-generation | stan | 322 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| airs-appropriate-reliance | exte | 325 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| api-documentation | stan | 312 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| architecture-audit | stan | 292 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| architecture-health | stan | 102 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| architecture-refinement | stan | 120 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| azure-deployment-operations | stan | 276 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| azure-devops-automation | stan | 456 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| azure-openai-patterns | stan | 244 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| brand-asset-management | stan | 131 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| change-management | stan | 235 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| character-aging-progression | exte | 225 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| chat-participant-patterns | stan | 189 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 1 | 0 |
| cloud-solution-architect | stan | 275 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| content-safety-implementation | stan | 228 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| converter-qa | exte | 67 | 1 | 1 | 0 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 0 |
| creative-writing | stan | 465 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| dashboard-design | stan | 207 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| data-quality-monitoring | stan | 211 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| data-visualization | stan | 295 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| debugging-patterns | core | 118 | 1 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 | 0 | 0 |
| distribution-security | stan | 221 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| docx-to-md | exte | 76 | 1 | 1 | 0 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 0 |
| enterprise-integration | stan | 240 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| extension-audit-methodology | stan | 190 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 1 | 0 | 0 |
| flux-brand-finetune | exte | 392 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| foundry-agent-platform | exte | 281 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| frontend-design-review | stan | 276 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| gamma-presentations | stan | 359 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| image-handling | stan | 372 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| knowledge-synthesis | stan | 134 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| llm-model-selection | stan | 215 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 1 | 0 |
| m365-agent-debugging | stan | 164 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 1 | 0 |
| md-to-eml | exte | 69 | 1 | 1 | 0 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 0 |
| md-to-html | stan | 78 | 1 | 1 | 0 | 1 | 1 | A | 4/4 | ✓ | 0 | 0 | 0 |
| meditation | stan | 171 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| msal-authentication | stan | 264 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| muscle-memory-recognition | stan | 206 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| nav-inject | exte | 74 | 1 | 1 | 0 | 1 | 1 | A | 4/3 | ✓ | 0 | 0 | 0 |
| north-star | core | 321 | 1 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 | 0 | 0 |
| persona-detection | core | 112 | 1 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 | 0 | 0 |
| pii-privacy-regulations | exte | 359 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| pptx-generation | exte | 157 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| presentation-tool-selection | stan | 227 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| proactive-assistance | core | 210 | 1 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 | 0 | 0 |
| project-management | stan | 248 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| prompt-evolution-system | stan | 188 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| ralph-loop | adva | 239 | 1 | 1 | 1 | 0 | 1 | - | 4/4 | ✓ | 0 | 0 | 0 |
| react-vite-performance | stan | 302 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| release-preflight | stan | 105 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 1 | 0 | 0 |
| secrets-management | stan | 439 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| security-review | core | 333 | 1 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 | 0 | 0 |
| self-actualization | stan | 201 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| service-worker-offline-first | exte | 252 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| sse-streaming | exte | 289 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| teams-app-patterns | stan | 195 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 1 | 0 |
| terminal-image-rendering | exte | 113 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| testing-strategies | core | 156 | 1 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 | 0 | 0 |
| text-to-speech | exte | 122 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| visual-memory | exte | 343 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| vscode-configuration-validation | stan | 232 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| vscode-environment | stan | 110 | 1 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 | 0 | 0 |
| work-life-balance | exte | 119 | 1 | 1 | 1 | 1 | 0 | I | 4/3 | ✓ | 0 | 0 | 0 |
| brain-qa | stan | 268 | 1 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ | 0 | 0 | 0 |
| md-to-word | stan | 233 | 1 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ | 0 | 0 | 0 |

**Summary**: 168 skills | Passing: 78 | Failing: 90 | Perfect(5/5): 2

**Skill Types**: Agentic(A): 7 | Intellectual(I): 90 | Incomplete(-): 71

**Semantic Review**: 0/168 reviewed | 168 pending

**Defects by dimension**:
| fm | code | bounds | tri | muscle |
|:--:|:----:|:------:|:---:|:------:|
| 0 | 40 | 28 | 71 | 159 |

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
| alex-azure | 104 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✗ | 0 |
| alex-m365 | 101 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✗ | 0 |
| alex-documentarian | 212 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| alex | 263 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| alex-backend | 233 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-builder | 237 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-frontend | 276 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-infrastructure | 340 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-planner | 230 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-presenter | 252 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-researcher | 248 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| alex-validator | 258 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |

**Summary**: 12 agents | Passing: 10 | Failing: 2 | Perfect(5/5): 8
**Semantic Review**: 0/12 reviewed | 12 pending

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
| __test-exclusion | 7 | 1 | 0 | 0 | 0 | 0 | 1/5 | ✗ | 0 |
| teams-app-patterns | 34 | 1 | 0 | 0 | 0 | 1 | 2/5 | ✗ | 0 |
| worldview-constitutional-ai | 40 | 1 | 0 | 1 | 0 | 0 | 2/5 | ✗ | 0 |
| worldview-moral-psychology | 37 | 1 | 0 | 1 | 0 | 0 | 2/5 | ✗ | 0 |
| ai-generated-readme-banners | 42 | 1 | 0 | 0 | 1 | 1 | 3/5 | ✓ | 0 |
| ai-writing-avoidance | 41 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| alex-identity-integration | 161 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| bootstrap-learning | 45 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| emotional-intelligence | 92 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| empirical-validation | 79 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| flux-brand-finetune | 44 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| image-generation-guidelines | 185 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| knowledge-synthesis | 48 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| lucid-dream-integration | 68 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| m365-agent-debugging | 50 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| markdown-mermaid | 31 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| md-to-word | 24 | 1 | 0 | 0 | 1 | 1 | 3/5 | ✓ | 0 |
| memory-export | 25 | 1 | 0 | 1 | 0 | 1 | 3/5 | ✓ | 0 |
| planning-first-development | 167 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| protocol-triggers | 220 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| repository-readiness-eval | 98 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| skill-selection-optimization | 211 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| synapse-notebook-patterns | 95 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| trifecta-audit | 304 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| worldview-integration | 83 | 1 | 1 | 1 | 0 | 0 | 3/5 | ✓ | 0 |
| adversarial-oversight | 338 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| alex-core | 525 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| architecture-decision-records | 279 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| automated-quality-gates | 107 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| azure-enterprise-deployment | 369 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| chart-interpretation | 118 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| code-review-guidelines | 306 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| cognitive-benchmarking | 150 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| cognitive-health-validation | 417 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| content-safety-implementation | 134 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| copilot-chat-buttons | 92 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| coupling-metrics | 79 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| dashboard-design | 113 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| data-analysis | 110 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| data-storytelling | 95 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| debugging-patterns | 81 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| deep-thinking | 136 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| dependency-management | 306 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| dream-state-automation | 482 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| extension-audit-methodology | 59 | 1 | 1 | 0 | 1 | 1 | 4/5 | ✓ | 0 |
| gamma-presentation | 181 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| global-knowledge-curation | 141 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| heir-project-improvement | 375 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| heir-skill-promotion | 289 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| image-handling | 88 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| language-detection-patterns | 137 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| log-pattern-analyzer | 96 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| meditation | 131 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| nasa-code-standards | 413 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| north-star | 59 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| refactoring-patterns | 98 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| release-management | 930 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| research-first-workflow | 380 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| roadmap-maintenance | 236 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| root-cause-analysis | 59 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| secrets-management | 60 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| security-review | 62 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| semantic-audit | 144 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| skill-building | 67 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| skill-telemetry | 104 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| technical-debt-tracking | 222 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| terminal-command-safety | 121 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| testing-strategies | 70 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| token-waste-elimination | 83 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| ui-ux-design | 51 | 1 | 1 | 1 | 0 | 1 | 4/5 | ✓ | 0 |
| vscode-extension-patterns | 47 | 1 | 0 | 1 | 1 | 1 | 4/5 | ✓ | 0 |
| vscode-marketplace-publishing | 348 | 1 | 1 | 1 | 1 | 0 | 4/5 | ✓ | 0 |
| ai-character-reference-generation | 87 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| brand-asset-management | 61 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| character-aging-progression | 119 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| chat-participant-patterns | 183 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| data-visualization | 122 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| mcp-development | 111 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| microsoft-graph-api | 124 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| self-actualization | 55 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| service-worker-offline-first | 92 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| visual-memory | 121 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |
| vscode-configuration-validation | 97 | 1 | 1 | 1 | 1 | 1 | 5/5 | ✓ | 0 |

**Summary**: 83 instructions | Passing: 79 | Failing: 4 | Perfect(5/5): 11

**Semantic Review**: 0/83 reviewed | 83 pending

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
| ai-character-reference-generation | 380 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| ai-generated-readme-banners | 503 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| alex | 8 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| audit-writing | 37 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| azure | 16 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| builder | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| character-aging-progression | 167 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| chat-participant | 196 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| documentarian | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| extension-audit-methodology | 514 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| flux-brand-finetune | 91 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| gamma | 218 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| graph-api | 210 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| image-handling | 132 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| journey | 231 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| m365-agent-debug | 184 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| m365 | 16 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| marp | 194 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| mcp-server | 193 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| presentation | 105 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| researcher | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| teams-app | 200 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| ui-ux-audit | 686 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| validate-config | 70 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| validator | 17 | 1 | 1 | 1 | 0 | 3/4 | ✓ |
| visual-memory | 221 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| vscode-extension-audit | 164 | 1 | 1 | 0 | 1 | 3/4 | ✓ |
| add-endpoint | 117 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| alex-initialization | 45 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| analyze | 41 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| brainqa | 46 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| brand | 32 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| code-review-checklist | 84 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| create-store | 111 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| cross-domain-transfer | 52 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| dashboard | 42 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| datastory | 40 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| debug | 25 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| diagramming | 41 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| domain-learning | 43 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| dream | 38 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| export-memory | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| gapanalysis | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| improve | 87 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| interpret | 46 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| knowledge | 33 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| learn | 29 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| masteraudit | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| meditate | 37 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| memory-audit | 36 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| northstar | 104 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| performance-assessment | 44 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| plan | 101 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| promotetomaster | 40 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| refactor | 33 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| release | 52 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| review | 55 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| root-cause-analysis | 28 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| secrets | 91 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| security-review | 26 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| selfactualize | 38 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| skill-building | 37 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| tdd | 62 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| token-audit | 34 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| visualize | 41 | 1 | 1 | 1 | 1 | 4/4 | ✓ |
| word | 63 | 1 | 1 | 1 | 1 | 4/4 | ✓ |

**Summary**: 66 prompts | Passing: 66 | Failing: 0 | Perfect(4/4): 39

### Criterion Validity

| Criterion | Pass | Rate | Validity |
|-----------|-----:|-----:|----------|
| desc | 66/66 | 100% | ✓ Valid — required for discoverability |
| app | 66/66 | 100% | ✓ Valid — tells agent WHEN to suggest |
| agent | 46/66 | 70% | ✓ Valid — identifies routing prompts |
| >20L | 59/66 | 89% | ✓ Valid — identifies workflow content |
## Overall

| Category | Count |
|----------|------:|
| Skills | 168 |
| Agents | 12 |
| Instructions | 83 |
| Prompts | 66 |
| **Total** | **329** |