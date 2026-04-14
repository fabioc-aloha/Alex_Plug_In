# Brain Health Grid

Generated: 2026-04-14

## Scoring Criteria

Each dimension is scored **0** (defect) or **1** (good). Score = sum of dimensions.

| Dim | Name | 1 (good) | 0 (defect) | Fix |
|:---:|------|----------|------------|-----|
| **fm** | Frontmatter | Has `name`, `description`, `applyTo`, and `tier` | Missing any required field | Auto |
| **struct** | Structure | Has `## Troubleshooting` AND `## Activation Patterns` | Missing either section | Template |
| **code** | Code Examples | Has ≥1 fenced code block with language tag | No code blocks | Manual |
| **bounds** | Bounds | 50–500 lines | <50 (stub) or >500 (bloated) | Manual |
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
| **core** | 6/6 | Foundation skills must be perfect |
| **standard** | 5/6 | One defect allowed |
| **extended** | 4/6 | Two defects allowed |
| **specialist** | 3/6 | Niche skills, three defects allowed |

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

| Skill | Tier | Lines | fm | struct | code | bounds | tri | muscle | Type | Score | Pass | sem |
|-------|:----:|------:|:--:|:------:|:----:|:------:|:---:|:------:|:----:|------:|:----:|:---:|
| dissertation-defense | exte | 552 | 1 | 0 | 0 | 0 | 0 | 0 | - | 1/4 | ✗ | 0 |
| agent-debug-panel | stan | 121 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/5 | ✗ | 0 |
| ai-agent-design | stan | 595 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ | 0 |
| api-design | stan | 655 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ | 0 |
| appropriate-reliance | core | 458 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/6 | ✗ | 0 |
| awareness | core | 306 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/6 | ✗ | 0 |
| azure-architecture-patterns | stan | 575 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ | 0 |
| career-development | exte | 199 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| citation-management | exte | 314 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| comedy-writing | exte | 135 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| correax-brand | exte | 124 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| counseling-psychology | exte | 179 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| cross-cultural-collaboration | exte | 318 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| deep-work-optimization | exte | 351 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| game-design | exte | 165 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| grant-writing | exte | 172 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| healthcare-informatics | exte | 142 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| hr-people-operations | exte | 155 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| journalism | exte | 154 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| legal-compliance | exte | 129 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| memory-curation | stan | 191 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/5 | ✗ | 0 |
| research-project-scaffold | exte | 515 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ | 0 |
| sales-enablement | exte | 164 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ | 0 |
| skill-catalog-generator | exte | 567 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ | 0 |
| svg-graphics | stan | 555 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ | 0 |
| academic-research | exte | 482 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| ai-generated-readme-banners | stan | 618 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 |
| ai-writing-avoidance | stan | 333 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| alex-effort-estimation | exte | 153 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| anti-hallucination | core | 153 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ | 0 |
| ascii-art-alignment | exte | 325 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| bicep-avm-mastery | exte | 423 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| book-publishing | exte | 293 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| bootstrap-learning | stan | 114 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| business-analysis | stan | 273 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| chart-interpretation | stan | 185 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| coaching-techniques | exte | 326 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| code-review | core | 193 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ | 0 |
| cognitive-symbiosis | exte | 244 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| copilot-sdk | stan | 484 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| data-analysis | stan | 220 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| data-storytelling | stan | 169 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| database-design | stan | 417 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| dialog-engineering | core | 101 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ | 0 |
| doc-hygiene | core | 101 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ | 0 |
| documentation-quality-assurance | stan | 374 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| dream-state | stan | 96 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| entra-agent-id | stan | 277 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| executive-storytelling | stan | 463 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| fabric-notebook-publish | exte | 177 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| financial-analysis | exte | 158 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| frustration-recognition | core | 387 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ | 0 |
| git-workflow | core | 153 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ | 0 |
| global-knowledge | stan | 250 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| global-knowledge-sync | stan | 132 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| graphic-design | exte | 452 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| heir-bootstrap | stan | 178 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| heir-feedback | stan | 193 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| heir-sync-management | stan | 485 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| incident-response | stan | 117 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| infrastructure-as-code | stan | 842 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 |
| learning-psychology | stan | 203 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| lint-clean-markdown | core | 108 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ | 0 |
| literature-review | exte | 346 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| localization | exte | 952 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ | 0 |
| markdown-mermaid | stan | 1528 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 |
| mcp-builder | stan | 317 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| mcp-development | stan | 740 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 |
| meeting-efficiency | stan | 357 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| memory-activation | core | 317 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ | 0 |
| memory-export | exte | 104 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| microsoft-fabric | stan | 333 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| microsoft-graph-api | stan | 520 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 |
| multi-agent-orchestration | stan | 321 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| observability-monitoring | stan | 350 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| performance-profiling | stan | 439 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| post-mortem | exte | 167 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| practitioner-research | exte | 302 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ | 0 |
| privacy-responsible-ai | stan | 278 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| project-deployment | stan | 305 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| prompt-engineering | stan | 356 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| rag-architecture | stan | 390 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| refactoring-patterns | core | 61 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ | 0 |
| release-process | stan | 299 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| root-cause-analysis | core | 108 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ | 0 |
| rubber-duck-debugging | exte | 171 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| scope-management | stan | 267 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| silence-as-signal | core | 188 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ | 0 |
| skill-creator | stan | 410 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| skill-development | stan | 339 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| slide-design | exte | 351 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| socratic-questioning | exte | 169 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ | 0 |
| stakeholder-management | stan | 292 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| status-reporting | stan | 265 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ | 0 |
| token-waste-elimination | stan | 69 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ | 0 |
| ui-ux-design | stan | 604 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ | 0 |
| vscode-extension-patterns | core | 965 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/6 | ✗ | 0 |
| ai-character-reference-generation | stan | 322 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| airs-appropriate-reliance | exte | 325 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| api-documentation | stan | 312 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| architecture-audit | stan | 292 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| architecture-health | stan | 102 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| architecture-refinement | stan | 120 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| azure-deployment-operations | stan | 276 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| azure-devops-automation | stan | 456 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| azure-openai-patterns | stan | 244 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| brand-asset-management | stan | 131 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| change-management | stan | 235 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| character-aging-progression | exte | 225 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| chat-participant-patterns | stan | 189 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| cloud-solution-architect | stan | 275 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| cognitive-load | core | 68 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| content-safety-implementation | stan | 228 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| creative-writing | stan | 465 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| dashboard-design | stan | 207 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| data-quality-monitoring | stan | 211 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| data-visualization | stan | 295 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| debugging-patterns | core | 118 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| distribution-security | stan | 221 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| enterprise-integration | stan | 240 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| error-recovery-patterns | core | 75 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| extension-audit-methodology | stan | 190 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| flux-brand-finetune | exte | 392 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| foundry-agent-platform | exte | 281 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| frontend-design-review | stan | 276 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| gamma-presentations | stan | 359 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| image-handling | stan | 372 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| knowledge-synthesis | stan | 134 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| llm-model-selection | stan | 215 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| m365-agent-debugging | stan | 164 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| md-scaffold | exte | 52 | 1 | 0 | 1 | 1 | 0 | 1 | - | 4/4 | ✓ | 0 |
| meditation | stan | 171 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| msal-authentication | stan | 264 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| muscle-memory-recognition | stan | 206 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| north-star | core | 321 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| persona-detection | core | 112 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| pii-privacy-regulations | exte | 359 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| pptx-generation | exte | 157 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| presentation-tool-selection | stan | 227 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| proactive-assistance | core | 210 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| project-management | stan | 248 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| project-scaffolding | stan | 88 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| prompt-evolution-system | stan | 188 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| ralph-loop | adva | 239 | 1 | 0 | 1 | 1 | 0 | 1 | - | 4/5 | ✗ | 0 |
| react-vite-performance | stan | 302 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| release-preflight | stan | 105 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| research-first-development | stan | 396 | 1 | 1 | 1 | 1 | 0 | 0 | - | 4/5 | ✗ | 0 |
| secrets-management | stan | 439 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| security-review | core | 333 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| self-actualization | stan | 201 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| service-worker-offline-first | exte | 252 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| skill-building | stan | 540 | 1 | 1 | 1 | 0 | 1 | 0 | I | 4/5 | ✗ | 0 |
| sse-streaming | exte | 289 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| teams-app-patterns | stan | 195 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| terminal-image-rendering | exte | 113 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| testing-strategies | core | 156 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ | 0 |
| text-to-speech | exte | 122 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| visual-memory | exte | 343 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| vscode-configuration-validation | stan | 232 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| vscode-environment | stan | 110 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ | 0 |
| work-life-balance | exte | 119 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ | 0 |
| brain-qa | stan | 268 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/5 | ✓ | 0 |
| converter-qa | exte | 67 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ | 0 |
| docx-to-md | exte | 76 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ | 0 |
| md-to-eml | exte | 69 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ | 0 |
| md-to-html | stan | 78 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/5 | ✓ | 0 |
| md-to-word | stan | 233 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/5 | ✓ | 0 |
| nav-inject | exte | 74 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ | 0 |

**Summary**: 168 skills | Passing: 20 | Failing: 148 | Perfect(6/6): 0

**Skill Types**: Agentic(A): 7 | Intellectual(I): 90 | Incomplete(-): 71

**Semantic Review**: 0/168 reviewed | 168 pending

**Defects by dimension**:
| fm | struct | code | bounds | tri | muscle |
|:--:|:------:|:----:|:------:|:---:|:------:|
| 0 | 166 | 40 | 16 | 71 | 159 |

## Agents

**Scoring Criteria**:
| Dim | Name | 1 (good) | 0 (defect) |
|:---:|------|----------|------------|
| **fm** | Frontmatter | Has `description`, `name`, `model`, `tools` | Missing any |
| **handoffs** | Handoffs | Has `handoffs:` for agent orchestration | No handoffs |
| **hooks** | Hooks | Has `hooks:` for automation | No hooks |
| **bounds** | Bounds | 50–400 lines | <50 (stub) or >400 (bloated) |
| **persona** | Persona | Has mental model / mindset section | No persona |
| **code** | Code | Has code examples | No code |

**Pass criteria**: fm=1 (gate) AND score ≥4/6

| Agent | Lines | fm | handoffs | hooks | bounds | persona | code | Score | Pass |
|-------|------:|:--:|:--------:|:-----:|:------:|:-------:|:----:|------:|:----:|
| alex-azure | 104 | 1 | 1 | 0 | 1 | 0 | 0 | 3/6 | ✗ |
| alex-m365 | 101 | 1 | 1 | 0 | 1 | 0 | 0 | 3/6 | ✗ |
| alex | 263 | 1 | 1 | 0 | 1 | 0 | 0 | 3/6 | ✗ |
| alex-backend | 233 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ |
| alex-documentarian | 212 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| alex-frontend | 276 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ |
| alex-infrastructure | 340 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ |
| alex-planner | 230 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ |
| alex-presenter | 252 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ |
| alex-builder | 237 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| alex-researcher | 248 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| alex-validator | 258 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |

**Summary**: 12 agents | Passing: 9 | Failing: 3 | Perfect(6/6): 3

## Instructions

**Scoring Criteria**:
| Dim | Name | 1 (good) | 0 (defect) |
|:---:|------|----------|------------|
| **fm** | Frontmatter | Has `description` AND `applyTo` | Missing either |
| **spec** | Specificity | applyTo has specific glob (not just `**`) | Too broad or missing |
| **depth** | Depth | >50 lines | ≤50 lines |
| **sect** | Sections | ≥2 `##` headers | Flat structure |
| **code** | Code | Has code block | No examples |
| **skill** | Trifecta | Has matching skill | Orphan instruction |

**Pass criteria**: fm=1 (gate) AND score ≥4/6

| Instruction | Lines | fm | spec | depth | sect | code | skill | Score | Pass | sem |
|-------------|------:|:--:|:----:|:-----:|:----:|:----:|:-----:|------:|:----:|:---:|
| __test-exclusion | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0/6 | ✗ | 0 |
| worldview-constitutional-ai | 39 | 0 | 0 | 0 | 1 | 0 | 0 | 1/6 | ✗ | 0 |
| worldview-moral-psychology | 36 | 0 | 0 | 0 | 1 | 0 | 0 | 1/6 | ✗ | 0 |
| ai-writing-avoidance | 40 | 0 | 0 | 0 | 1 | 0 | 1 | 2/6 | ✗ | 0 |
| alex-identity-integration | 160 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ | 0 |
| markdown-mermaid | 30 | 0 | 0 | 0 | 1 | 0 | 1 | 2/6 | ✗ | 0 |
| md-to-word | 23 | 0 | 0 | 0 | 0 | 1 | 1 | 2/6 | ✗ | 0 |
| memory-export | 24 | 0 | 0 | 0 | 1 | 0 | 1 | 2/6 | ✗ | 0 |
| skill-selection-optimization | 210 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ | 0 |
| worldview-integration | 82 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ | 0 |
| alex-core | 524 | 0 | 0 | 1 | 1 | 1 | 0 | 3/6 | ✗ | 0 |
| deep-thinking | 135 | 0 | 0 | 1 | 1 | 1 | 0 | 3/6 | ✗ | 0 |
| emotional-intelligence | 91 | 1 | 0 | 1 | 1 | 0 | 0 | 3/6 | ✗ | 0 |
| teams-app-patterns | 33 | 1 | 1 | 0 | 0 | 0 | 1 | 3/6 | ✗ | 0 |
| ai-generated-readme-banners | 41 | 1 | 1 | 0 | 0 | 1 | 1 | 4/6 | ✓ | 0 |
| bootstrap-learning | 44 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ | 0 |
| empirical-validation | 78 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| flux-brand-finetune | 43 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ | 0 |
| image-generation-guidelines | 184 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| knowledge-synthesis | 47 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ | 0 |
| lucid-dream-integration | 67 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| m365-agent-debugging | 49 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ | 0 |
| planning-first-development | 166 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| protocol-triggers | 219 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| repository-readiness-eval | 97 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| synapse-notebook-patterns | 94 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| terminal-command-safety | 120 | 1 | 0 | 1 | 1 | 1 | 0 | 4/6 | ✓ | 0 |
| trifecta-audit | 303 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ | 0 |
| ui-ux-design | 50 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ | 0 |
| adversarial-oversight | 337 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| architecture-decision-records | 278 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| automated-quality-gates | 106 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| azure-enterprise-deployment | 368 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| chart-interpretation | 117 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| code-review-guidelines | 305 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| cognitive-benchmarking | 149 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| cognitive-health-validation | 416 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| content-safety-implementation | 133 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| copilot-chat-buttons | 91 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| coupling-metrics | 78 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| dashboard-design | 112 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| data-analysis | 109 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| data-storytelling | 94 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| debugging-patterns | 80 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| dependency-management | 305 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| dream-state-automation | 481 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| extension-audit-methodology | 58 | 1 | 1 | 1 | 0 | 1 | 1 | 5/6 | ✓ | 0 |
| gamma-presentation | 180 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| global-knowledge-curation | 140 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| heir-project-improvement | 374 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| heir-skill-promotion | 288 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| image-handling | 87 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| language-detection-patterns | 136 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| log-pattern-analyzer | 95 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| meditation | 130 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| nasa-code-standards | 412 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| north-star | 58 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| refactoring-patterns | 97 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| release-management | 929 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| research-first-workflow | 379 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| roadmap-maintenance | 235 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| root-cause-analysis | 58 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| secrets-management | 59 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| security-review | 61 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| semantic-audit | 143 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| skill-building | 66 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| skill-telemetry | 103 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| technical-debt-tracking | 221 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| testing-strategies | 69 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| token-waste-elimination | 82 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ | 0 |
| vscode-extension-patterns | 46 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ | 0 |
| vscode-marketplace-publishing | 347 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ | 0 |
| ai-character-reference-generation | 86 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| brand-asset-management | 60 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| character-aging-progression | 118 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| chat-participant-patterns | 182 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| data-visualization | 121 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| mcp-development | 110 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| microsoft-graph-api | 123 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| self-actualization | 54 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| service-worker-offline-first | 91 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| visual-memory | 120 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |
| vscode-configuration-validation | 96 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ | 0 |

**Summary**: 83 instructions | Passing: 69 | Failing: 14 | Perfect(6/6): 11

**Semantic Review**: 0/83 reviewed | 83 pending

## Prompts

**Pass criteria**: desc=1 (gate) AND score ≥2/3

| Prompt | Lines | desc | agent | >20L | Score | Pass |
|--------|------:|:----:|:-----:|:----:|------:|:----:|
| ai-character-reference-generation | 379 | 1 | 0 | 1 | 2/3 | ✓ |
| ai-generated-readme-banners | 502 | 1 | 0 | 1 | 2/3 | ✓ |
| alex | 7 | 1 | 1 | 0 | 2/3 | ✓ |
| audit-writing | 36 | 1 | 0 | 1 | 2/3 | ✓ |
| azure | 15 | 1 | 1 | 0 | 2/3 | ✓ |
| builder | 16 | 1 | 1 | 0 | 2/3 | ✓ |
| character-aging-progression | 166 | 1 | 0 | 1 | 2/3 | ✓ |
| chat-participant | 195 | 1 | 0 | 1 | 2/3 | ✓ |
| documentarian | 16 | 1 | 1 | 0 | 2/3 | ✓ |
| extension-audit-methodology | 513 | 1 | 0 | 1 | 2/3 | ✓ |
| flux-brand-finetune | 90 | 1 | 0 | 1 | 2/3 | ✓ |
| gamma | 217 | 1 | 0 | 1 | 2/3 | ✓ |
| graph-api | 209 | 1 | 0 | 1 | 2/3 | ✓ |
| image-handling | 131 | 1 | 0 | 1 | 2/3 | ✓ |
| journey | 230 | 1 | 0 | 1 | 2/3 | ✓ |
| m365-agent-debug | 183 | 1 | 0 | 1 | 2/3 | ✓ |
| m365 | 15 | 1 | 1 | 0 | 2/3 | ✓ |
| marp | 193 | 1 | 0 | 1 | 2/3 | ✓ |
| mcp-server | 192 | 1 | 0 | 1 | 2/3 | ✓ |
| presentation | 104 | 1 | 0 | 1 | 2/3 | ✓ |
| researcher | 16 | 1 | 1 | 0 | 2/3 | ✓ |
| teams-app | 199 | 1 | 0 | 1 | 2/3 | ✓ |
| ui-ux-audit | 685 | 1 | 0 | 1 | 2/3 | ✓ |
| validate-config | 69 | 1 | 0 | 1 | 2/3 | ✓ |
| validator | 16 | 1 | 1 | 0 | 2/3 | ✓ |
| visual-memory | 220 | 1 | 0 | 1 | 2/3 | ✓ |
| vscode-extension-audit | 163 | 1 | 0 | 1 | 2/3 | ✓ |
| add-endpoint | 116 | 1 | 1 | 1 | 3/3 | ✓ |
| alex-initialization | 44 | 1 | 1 | 1 | 3/3 | ✓ |
| analyze | 40 | 1 | 1 | 1 | 3/3 | ✓ |
| brainqa | 45 | 1 | 1 | 1 | 3/3 | ✓ |
| brand | 31 | 1 | 1 | 1 | 3/3 | ✓ |
| code-review-checklist | 83 | 1 | 1 | 1 | 3/3 | ✓ |
| create-store | 110 | 1 | 1 | 1 | 3/3 | ✓ |
| cross-domain-transfer | 51 | 1 | 1 | 1 | 3/3 | ✓ |
| dashboard | 41 | 1 | 1 | 1 | 3/3 | ✓ |
| datastory | 39 | 1 | 1 | 1 | 3/3 | ✓ |
| debug | 24 | 1 | 1 | 1 | 3/3 | ✓ |
| diagramming | 40 | 1 | 1 | 1 | 3/3 | ✓ |
| domain-learning | 42 | 1 | 1 | 1 | 3/3 | ✓ |
| dream | 37 | 1 | 1 | 1 | 3/3 | ✓ |
| export-memory | 43 | 1 | 1 | 1 | 3/3 | ✓ |
| gapanalysis | 43 | 1 | 1 | 1 | 3/3 | ✓ |
| improve | 86 | 1 | 1 | 1 | 3/3 | ✓ |
| interpret | 45 | 1 | 1 | 1 | 3/3 | ✓ |
| knowledge | 32 | 1 | 1 | 1 | 3/3 | ✓ |
| learn | 28 | 1 | 1 | 1 | 3/3 | ✓ |
| masteraudit | 43 | 1 | 1 | 1 | 3/3 | ✓ |
| meditate | 36 | 1 | 1 | 1 | 3/3 | ✓ |
| memory-audit | 35 | 1 | 1 | 1 | 3/3 | ✓ |
| northstar | 103 | 1 | 1 | 1 | 3/3 | ✓ |
| performance-assessment | 43 | 1 | 1 | 1 | 3/3 | ✓ |
| plan | 100 | 1 | 1 | 1 | 3/3 | ✓ |
| promotetomaster | 39 | 1 | 1 | 1 | 3/3 | ✓ |
| refactor | 32 | 1 | 1 | 1 | 3/3 | ✓ |
| release | 51 | 1 | 1 | 1 | 3/3 | ✓ |
| review | 54 | 1 | 1 | 1 | 3/3 | ✓ |
| root-cause-analysis | 27 | 1 | 1 | 1 | 3/3 | ✓ |
| secrets | 90 | 1 | 1 | 1 | 3/3 | ✓ |
| security-review | 25 | 1 | 1 | 1 | 3/3 | ✓ |
| selfactualize | 37 | 1 | 1 | 1 | 3/3 | ✓ |
| skill-building | 36 | 1 | 1 | 1 | 3/3 | ✓ |
| tdd | 61 | 1 | 1 | 1 | 3/3 | ✓ |
| token-audit | 33 | 1 | 1 | 1 | 3/3 | ✓ |
| visualize | 40 | 1 | 1 | 1 | 3/3 | ✓ |
| word | 62 | 1 | 1 | 1 | 3/3 | ✓ |

**Summary**: 66 prompts | Passing: 66 | Failing: 0 | Perfect(3/3): 39
## Overall

| Category | Count |
|----------|------:|
| Skills | 168 |
| Agents | 12 |
| Instructions | 83 |
| Prompts | 66 |
| **Total** | **329** |