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

## Skills

| Skill | Tier | Lines | fm | struct | code | bounds | tri | muscle | Type | Score | Pass |
|-------|:----:|------:|:--:|:------:|:----:|:------:|:---:|:------:|:----:|------:|:----:|
| dissertation-defense | exte | 552 | 1 | 0 | 0 | 0 | 0 | 0 | - | 1/4 | ✗ |
| agent-debug-panel | stan | 121 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/5 | ✗ |
| ai-agent-design | stan | 595 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ |
| api-design | stan | 655 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ |
| appropriate-reliance | core | 458 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/6 | ✗ |
| awareness | core | 306 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/6 | ✗ |
| azure-architecture-patterns | stan | 575 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ |
| career-development | exte | 199 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| citation-management | exte | 314 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| comedy-writing | exte | 135 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| correax-brand | exte | 124 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| counseling-psychology | exte | 179 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| cross-cultural-collaboration | exte | 318 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| deep-work-optimization | exte | 351 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| game-design | exte | 165 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| grant-writing | exte | 172 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| healthcare-informatics | exte | 142 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| hr-people-operations | exte | 155 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| journalism | exte | 154 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| legal-compliance | exte | 129 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| memory-curation | stan | 191 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/5 | ✗ |
| research-project-scaffold | exte | 515 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ |
| sales-enablement | exte | 164 | 1 | 0 | 0 | 1 | 0 | 0 | - | 2/4 | ✗ |
| skill-catalog-generator | exte | 567 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/4 | ✗ |
| svg-graphics | stan | 555 | 1 | 0 | 1 | 0 | 0 | 0 | - | 2/5 | ✗ |
| academic-research | exte | 482 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| ai-generated-readme-banners | stan | 618 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ |
| ai-writing-avoidance | stan | 333 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| alex-effort-estimation | exte | 153 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| anti-hallucination | core | 153 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ |
| ascii-art-alignment | exte | 325 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| bicep-avm-mastery | exte | 423 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| book-publishing | exte | 293 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| bootstrap-learning | stan | 114 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| business-analysis | stan | 273 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| chart-interpretation | stan | 185 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| coaching-techniques | exte | 326 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| code-review | core | 193 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ |
| cognitive-symbiosis | exte | 244 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| copilot-sdk | stan | 484 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| data-analysis | stan | 220 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| data-storytelling | stan | 169 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| database-design | stan | 417 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| dialog-engineering | core | 101 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ |
| doc-hygiene | core | 101 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ |
| documentation-quality-assurance | stan | 374 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| dream-state | stan | 96 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| entra-agent-id | stan | 277 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| executive-storytelling | stan | 463 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| fabric-notebook-publish | exte | 177 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| financial-analysis | exte | 158 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| frustration-recognition | core | 387 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ |
| git-workflow | core | 153 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ |
| global-knowledge | stan | 250 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| global-knowledge-sync | stan | 132 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| graphic-design | exte | 452 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| heir-bootstrap | stan | 178 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| heir-feedback | stan | 193 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| heir-sync-management | stan | 484 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| incident-response | stan | 117 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| infrastructure-as-code | stan | 842 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ |
| learning-psychology | stan | 203 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| lint-clean-markdown | core | 108 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/6 | ✗ |
| literature-review | exte | 346 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| localization | exte | 952 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/4 | ✗ |
| markdown-mermaid | stan | 1528 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ |
| mcp-builder | stan | 317 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| mcp-development | stan | 740 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ |
| meeting-efficiency | stan | 357 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| memory-activation | core | 317 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ |
| memory-export | exte | 104 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| microsoft-fabric | stan | 333 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| microsoft-graph-api | stan | 520 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ |
| multi-agent-orchestration | stan | 321 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| observability-monitoring | stan | 350 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| performance-profiling | stan | 439 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| post-mortem | exte | 167 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| practitioner-research | exte | 302 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/4 | ✗ |
| privacy-responsible-ai | stan | 278 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| project-deployment | stan | 305 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| prompt-engineering | stan | 356 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| rag-architecture | stan | 390 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| refactoring-patterns | core | 61 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ |
| release-process | stan | 299 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| root-cause-analysis | core | 108 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ |
| rubber-duck-debugging | exte | 171 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| scope-management | stan | 267 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| silence-as-signal | core | 188 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/6 | ✗ |
| skill-creator | stan | 410 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| skill-development | stan | 339 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| slide-design | exte | 351 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| socratic-questioning | exte | 169 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/4 | ✗ |
| stakeholder-management | stan | 292 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| status-reporting | stan | 265 | 1 | 0 | 1 | 1 | 0 | 0 | - | 3/5 | ✗ |
| token-waste-elimination | stan | 69 | 1 | 0 | 0 | 1 | 1 | 0 | I | 3/5 | ✗ |
| ui-ux-design | stan | 604 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/5 | ✗ |
| vscode-extension-patterns | core | 965 | 1 | 0 | 1 | 0 | 1 | 0 | I | 3/6 | ✗ |
| ai-character-reference-generation | stan | 322 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| airs-appropriate-reliance | exte | 325 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| api-documentation | stan | 312 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| architecture-audit | stan | 292 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| architecture-health | stan | 102 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| architecture-refinement | stan | 120 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| azure-deployment-operations | stan | 276 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| azure-devops-automation | stan | 456 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| azure-openai-patterns | stan | 244 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| brand-asset-management | stan | 131 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| change-management | stan | 235 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| character-aging-progression | exte | 225 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| chat-participant-patterns | stan | 189 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| cloud-solution-architect | stan | 275 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| cognitive-load | core | 68 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| content-safety-implementation | stan | 228 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| creative-writing | stan | 465 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| dashboard-design | stan | 207 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| data-quality-monitoring | stan | 211 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| data-visualization | stan | 295 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| debugging-patterns | core | 118 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| distribution-security | stan | 221 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| enterprise-integration | stan | 240 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| error-recovery-patterns | core | 75 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| extension-audit-methodology | stan | 190 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| flux-brand-finetune | exte | 392 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| foundry-agent-platform | exte | 281 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| frontend-design-review | stan | 276 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| gamma-presentations | stan | 359 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| image-handling | stan | 372 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| knowledge-synthesis | stan | 134 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| llm-model-selection | stan | 215 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| m365-agent-debugging | stan | 164 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| md-scaffold | exte | 52 | 1 | 0 | 1 | 1 | 0 | 1 | - | 4/4 | ✓ |
| meditation | stan | 171 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| msal-authentication | stan | 264 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| muscle-memory-recognition | stan | 206 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| north-star | core | 321 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| persona-detection | core | 112 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| pii-privacy-regulations | exte | 359 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| pptx-generation | exte | 157 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| presentation-tool-selection | stan | 227 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| proactive-assistance | core | 210 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| project-management | stan | 248 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| project-scaffolding | stan | 88 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| prompt-evolution-system | stan | 188 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| ralph-loop | adva | 239 | 1 | 0 | 1 | 1 | 0 | 1 | - | 4/5 | ✗ |
| react-vite-performance | stan | 302 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| release-preflight | stan | 105 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| research-first-development | stan | 394 | 1 | 1 | 1 | 1 | 0 | 0 | - | 4/5 | ✗ |
| secrets-management | stan | 439 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| security-review | core | 333 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| self-actualization | stan | 201 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| service-worker-offline-first | exte | 252 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| skill-building | stan | 536 | 1 | 1 | 1 | 0 | 1 | 0 | I | 4/5 | ✗ |
| sse-streaming | exte | 289 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| teams-app-patterns | stan | 195 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| terminal-image-rendering | exte | 113 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| testing-strategies | core | 156 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/6 | ✗ |
| text-to-speech | exte | 127 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| visual-memory | exte | 343 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| vscode-configuration-validation | stan | 232 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| vscode-environment | stan | 110 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/5 | ✗ |
| work-life-balance | exte | 119 | 1 | 0 | 1 | 1 | 1 | 0 | I | 4/4 | ✓ |
| brain-qa | stan | 268 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/5 | ✓ |
| converter-qa | exte | 67 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ |
| docx-to-md | exte | 76 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ |
| md-to-eml | exte | 69 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ |
| md-to-html | stan | 78 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/5 | ✓ |
| md-to-word | stan | 233 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/5 | ✓ |
| nav-inject | exte | 74 | 1 | 0 | 1 | 1 | 1 | 1 | A | 5/4 | ✓ |

**Summary**: 168 skills | Passing: 20 | Failing: 148 | Perfect(6/6): 0

**Skill Types**: Agentic(A): 7 | Intellectual(I): 90 | Incomplete(-): 71

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

| Instruction | Lines | fm | spec | depth | sect | code | skill | Score | Pass |
|-------------|------:|:--:|:----:|:-----:|:----:|:----:|:-----:|------:|:----:|
| __test-exclusion | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0/6 | ✗ |
| ai-writing-avoidance | 40 | 0 | 0 | 0 | 1 | 0 | 1 | 2/6 | ✗ |
| alex-identity-integration | 179 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ |
| markdown-mermaid | 30 | 0 | 0 | 0 | 1 | 0 | 1 | 2/6 | ✗ |
| md-to-word | 23 | 0 | 0 | 0 | 0 | 1 | 1 | 2/6 | ✗ |
| memory-export | 24 | 0 | 0 | 0 | 1 | 0 | 1 | 2/6 | ✗ |
| skill-selection-optimization | 226 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ |
| worldview-constitutional-ai | 60 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ |
| worldview-integration | 100 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ |
| worldview-moral-psychology | 58 | 0 | 0 | 1 | 1 | 0 | 0 | 2/6 | ✗ |
| alex-core | 569 | 0 | 0 | 1 | 1 | 1 | 0 | 3/6 | ✗ |
| deep-thinking | 165 | 0 | 0 | 1 | 1 | 1 | 0 | 3/6 | ✗ |
| emotional-intelligence | 91 | 1 | 0 | 1 | 1 | 0 | 0 | 3/6 | ✗ |
| teams-app-patterns | 33 | 1 | 1 | 0 | 0 | 0 | 1 | 3/6 | ✗ |
| ai-generated-readme-banners | 41 | 1 | 1 | 0 | 0 | 1 | 1 | 4/6 | ✓ |
| empirical-validation | 90 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| flux-brand-finetune | 43 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ |
| image-generation-guidelines | 184 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| lucid-dream-integration | 87 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| m365-agent-debugging | 49 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ |
| planning-first-development | 168 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| protocol-triggers | 230 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| repository-readiness-eval | 97 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| synapse-notebook-patterns | 94 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| terminal-command-safety | 120 | 1 | 0 | 1 | 1 | 1 | 0 | 4/6 | ✓ |
| trifecta-audit | 316 | 1 | 1 | 1 | 1 | 0 | 0 | 4/6 | ✓ |
| ui-ux-design | 50 | 1 | 1 | 0 | 1 | 0 | 1 | 4/6 | ✓ |
| adversarial-oversight | 350 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| architecture-decision-records | 287 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| automated-quality-gates | 116 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| azure-enterprise-deployment | 376 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| bootstrap-learning | 75 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| chart-interpretation | 117 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| code-review-guidelines | 314 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| cognitive-benchmarking | 149 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| cognitive-health-validation | 427 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| content-safety-implementation | 133 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| copilot-chat-buttons | 96 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| coupling-metrics | 78 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| dashboard-design | 112 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| data-analysis | 109 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| data-storytelling | 101 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| debugging-patterns | 80 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| dependency-management | 314 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| dream-state-automation | 504 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| embedded-synapse | 156 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| extension-audit-methodology | 58 | 1 | 1 | 1 | 0 | 1 | 1 | 5/6 | ✓ |
| gamma-presentation | 180 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| global-knowledge-curation | 148 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| heir-project-improvement | 378 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| heir-skill-promotion | 292 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| image-handling | 87 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| knowledge-synthesis | 54 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| language-detection-patterns | 143 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| log-pattern-analyzer | 95 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| meditation | 130 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| nasa-code-standards | 421 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| north-star | 58 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| refactoring-patterns | 97 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| release-management | 949 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| research-first-workflow | 385 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| roadmap-maintenance | 245 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| root-cause-analysis | 58 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| secrets-management | 59 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| security-review | 61 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| semantic-audit | 153 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| skill-building | 66 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| skill-telemetry | 103 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| technical-debt-tracking | 230 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| testing-strategies | 69 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| token-waste-elimination | 82 | 1 | 1 | 1 | 1 | 0 | 1 | 5/6 | ✓ |
| vscode-extension-patterns | 46 | 1 | 1 | 0 | 1 | 1 | 1 | 5/6 | ✓ |
| vscode-marketplace-publishing | 356 | 1 | 1 | 1 | 1 | 1 | 0 | 5/6 | ✓ |
| ai-character-reference-generation | 86 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| brand-asset-management | 60 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| character-aging-progression | 118 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| chat-participant-patterns | 182 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| data-visualization | 121 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| mcp-development | 110 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| microsoft-graph-api | 123 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| self-actualization | 91 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| service-worker-offline-first | 91 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| visual-memory | 120 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |
| vscode-configuration-validation | 96 | 1 | 1 | 1 | 1 | 1 | 1 | 6/6 | ✓ |

**Summary**: 84 instructions | Passing: 70 | Failing: 14 | Perfect(6/6): 11

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
| Instructions | 84 |
| Prompts | 66 |
| **Total** | **330** |