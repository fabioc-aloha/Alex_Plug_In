# Command Center Master Plan

**Author**: Alex Finch + GitHub Copilot
**Created**: March 5, 2026
**Revised**: March 9, 2026 — LearnAlex sprint: 8 workshop study guides added (33→41), all 41 revised with practice sections + extension CTA, 14 P0 security fixes, 14+ UI/UX audit fixes, free paywall re-enabled. Master: P6 complete (avatar directives removed), execution sequencing added, 10 domain skills created (120→130), skill-to-discipline mapping complete (41/41 disciplines covered)
**Classification**: Internal — UI-first implementation plan
**Status**: ✔️ Command Center v1.0 delivered (98/100 shipped, 2 cancelled) · Post-delivery optimization in progress

> **This is the single source of truth for Command Center work.** All context from the feasibility study, design principles, competitive analysis, and second-opinion audit has been consolidated here. Background research docs are archived for reference only.

### Background Docs (archived — do not use as active checklists)

| Document | Role | Location |
|----------|------|----------|
| Feasibility Study | Original vision, tab architecture, UI direction | [COMMAND-CENTER-FEASIBILITY-2026-03-05.md](COMMAND-CENTER-FEASIBILITY-2026-03-05.md) |
| Design Principles | 9 guiding principles for UX decisions | [COMMAND-CENTER-DESIGN-PRINCIPLES.md](COMMAND-CENTER-DESIGN-PRINCIPLES.md) |
| Codex Competitive Analysis | Market validation, standalone UI assessment | [CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md](CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md) |
| Second-Opinion Audit | GPT-5.4 code-to-doc fact check, risk findings | [COMMAND-CENTER-SECOND-OPINION-AUDIT-2026-03-05.md](../audits/COMMAND-CENTER-SECOND-OPINION-AUDIT-2026-03-05.md) |
| UI Artifact Approval | Mockup approval sheet with thumbnails | [COMMAND-CENTER-UI-ARTIFACT-APPROVAL-2026-03-05.md](COMMAND-CENTER-UI-ARTIFACT-APPROVAL-2026-03-05.md) |
| UI/UX Audit (March 9) | Post-Wave 7 compliance + cross-tab consistency audit | [WELCOME-MENU-UI-UX-AUDIT-2026-03-09.md](../audits/WELCOME-MENU-UI-UX-AUDIT-2026-03-09.md) |

---

## Current State (March 9, 2026)

| Metric | Value | Target | Status |
|--------|:-----:|:------:|:------:|
| Waves shipped | 98/100 steps | 100 | ✅ (2 cancelled — Contract B dependency) |
| `welcomeViewHtml.ts` | 831 lines | <1,500 | ✅ |
| `welcomeView.ts` | 819 lines | <800 | 🟡 19 lines over |
| Files >1,500L (logic) | 0 | 0 | ✅ |
| Files >1,000L (logic) | 2 | 0 | 🟡 see P5B |
| Total TS source files | 107 | — | ✅ grew via decomposition |
| Total lines of code | 46,838 | — | — |
| Skills | 130 | — | ✅ 10 domain skills contributed by LearnAlex heir |
| Test files | 20 | 20+ | ✅ |
| NASA R4 violations (>60L) | ~50 real | 0 | 🟡 see P3/P5C |
| Dead avatar assets removed | 22 files (1,256 KB) | — | ✅ |
| North Star Trust score | 7/10 | ≥7/10 | ✅ |

---

## Active Work

### Execution Sequencing

| Order | Section | Focus | Effort | Rationale |
|:-----:|---------|-------|--------|-----------|
| ~~1st~~ | ~~P7.1–7.2~~ | ~~Fix `engineer` vs `developer` CRITICAL bug~~ | ✅ Complete | Fixed March 10, 2026 — removed bare `engineer` from developer pattern, added `software.?eng`, boosted weight to 2.5 |
| ~~2nd~~ | ~~P1 (8A)~~ | ~~WCAG touch targets & accessibility~~ | ✅ Complete | 5/5 items fixed March 10, 2026 |
| 3rd | ~~P6~~ | ~~Cognitive protocol cleanup~~ | ✅ Complete | All avatar directives removed (March 10, 2026) |
| ~~4th~~ | ~~P1 (8B–8D)~~ | ~~Design system + polish + cross-tab consistency~~ | ✅ Complete | All 15 items fixed March 10, 2026 |
| 5th | P2 (P5B) | Trim 5 files below 1,000 lines | 1–2 sessions | v6.5.0 release criteria |
| 6th | ~~P3 (P5C)~~ | ~~Split 8 orchestrator functions~~ | ✅ Complete | 7 functions split March 10, 2026. setAgentMode already 5L (stale data). |
| 7th | P4 (P5D) | Formally accept 5 structural exceptions | 15 min | Decision only — close and document |
| 8th | P7.3–7.5 | Persona detection HIGH improvements (LLM prompt, signals, skills) | 1–2 sessions | Broader detection quality |

> **Quick wins available now**: P7.1–7.2 (CRITICAL fix, ~2 lines of code), P4 (P5D decision, 0 code).

### Priority 1: Wave 8 — UI/UX Audit Remediation (NEW)

> **Source**: [WELCOME-MENU-UI-UX-AUDIT-2026-03-09.md](../audits/WELCOME-MENU-UI-UX-AUDIT-2026-03-09.md)
> **Goal**: Close all P1/P2/P3 findings from the post-Wave 7 UI/UX audit.
> **Depends on**: Wave 7 complete. **Unlocks**: v6.5.0 Trust Release readiness.

#### 8A — Touch Targets & Accessibility (P1 HIGH) ✅

| # | Finding | Location | Fix | Status |
|---|---------|----------|-----|:------:|
| 8A.1 | `.action-btn` min-height 28px — below 36px compact floor | sharedStyles.ts | Increase to 36px | ✅ |
| 8A.2 | `.quick-command-input` min-height 32px — below 36px floor | sharedStyles.ts | Increase to 36px | ✅ |
| 8A.3 | `.skill-search-input` min-height 28px — below 36px floor | sharedStyles.ts | Increase to 36px | ✅ |
| 8A.4 | `.secret-dot` — color-only indicator (green/red), no icon fallback | sharedStyles.ts | Added `::after` icon content (✓/✗) matching `.status-dot` pattern | ✅ |
| 8A.5 | `.agent-live-dot` — color-only indicator (green/gray), no icon fallback | sharedStyles.ts | Added `::after` icon content (✓/―) matching `.status-dot` pattern | ✅ |

#### 8B — Design System Compliance (P2 MEDIUM) ✅

| # | Finding | Location | Fix | Status |
|---|---------|----------|-----|:------:|
| 8B.1 | `.action-list` and `.action-group-content` gap 2px — below `--spacing-xs: 4px` minimum | sharedStyles.ts | Increase to 4px (on-grid minimum) | ✅ |
| 8B.2 | Non-standard spacing: 5px, 6px, 10px, 14px not on 8px grid | sharedStyles.ts (multiple selectors) | Normalize: 5px→4px, 6px→8px, 10px→8/12px context-dependent | ✅ |
| 8B.3 | Inconsistent `border-radius`: 3/4/5/6px mix | sharedStyles.ts | Standardize to 4px (controls), 6px (cards), 12px (pills) | ✅ |
| 8B.4 | Section title styling differs per tab (opacity 0.55–1.0, size 11–13px) | All tab HTML files | Unify to one section title style (11px semibold uppercase, consistent opacity) | ✅ |
| 8B.5 | Inconsistent button heights: 28–36px across contexts | sharedStyles.ts | Align all interactive elements to 36px baseline | ✅ |
| 8B.6 | Memory modalities 3-col grid fragile (5 items, bottom row has gap) | sharedStyles.ts | Use `repeat(auto-fill, minmax(80px, 1fr))` or 2-col layout | ✅ |

#### 8C — Polish (P3 LOW) ✅

| # | Finding | Location | Fix | Status |
|---|---------|----------|-----|:------:|
| 8C.1 | 9 distinct opacity values (0.4 to 0.85) — no system | sharedStyles.ts | Standardize to 4 levels: 0.4 (faint), 0.6 (secondary), 0.8 (emphasis), 1.0 (primary) | ✅ |
| 8C.2 | Hardcoded color in `.meditation-streak-badge` | sharedStyles.ts | Use `color-mix(in srgb, var(--persona-accent) 12%, transparent)` | ✅ |
| 8C.3 | Duplicate "Memory Architecture" button in Mind tab | mindTabHtml.ts | Remove from Learn & Knowledge card (keep in Memory Architecture card) | ✅ |
| 8C.4 | Duplicate "Search Knowledge" button in Mind tab | mindTabHtml.ts | Remove from Learn & Knowledge card (keep in Global Knowledge card) | ✅ |
| 8C.5 | Identity card hardcoded ("Alex Finch", "Age 26") | mindTabHtml.ts | Data-drive via `MindTabData` interface | ✅ |
| 8C.6 | Mixed animation durations: 0.1s, 0.12s, 0.15s, 0.2s, 0.3s | sharedStyles.ts | Standardize to CSS variables: `--transition-fast: 0.12s`, `--transition-normal: 0.2s`, `--transition-slow: 0.3s` | ✅ |

#### 8D — Cross-Tab Consistency ✅

| # | Finding | Fix | Status |
|---|---------|-----|:------:|
| 8D.1 | Agents tab feels empty vs other tabs | Add agent count header and empty-state fallback | ✅ |
| 8D.2 | No search in Docs tab (33 persona cards benefit from filtering) | Add search bar matching Skill Store pattern | ✅ |
| 8D.3 | Only Skill Store has proper empty-state fallback | Add empty states to Agents tab (Mission/Docs are static) | ✅ |

**Wave 8 Summary**: 5 P1 + 6 P2 + 6 P3 + 3 consistency = **20 steps** — ✅ ALL COMPLETE (March 10, 2026)

---

### Priority 2: P5B — Remaining Files Below 1,000 Lines

> **Goal**: All logic files below 1,000 lines for v6.5.0 "Trust Release".

| # | File | Lines | Gap | Approach | Status |
|---|------|:-----:|:---:|----------|:------:|
| P5B.1 | `globalKnowledgeContent.ts` | 1,027 | 27L | Extract ~27L | |
| P5B.2 | `extension.ts` | 1,043 | 43L | Extract ~43L of command registration or activation logic | |
| P5B.3 | `workflowHandlers.ts` | 902 | — | — | ✅ Below 1,000L |
| P5B.4 | `participant.ts` | 995 | — | — | ✅ Below 1,000L |
| P5B.5 | `healthDashboard.ts` | 994 | — | — | ✅ Below 1,000L |

---

### Priority 3: P5C — NASA R4 Orchestrator Splits ✅ Complete (March 10, 2026)

> **Goal**: Split remaining multi-phase orchestrators (genuine branching complexity).
> **Status**: 7 functions decomposed. `setAgentMode` was already 5L (master plan figure stale).
> **Note**: Registration blocks (P5D) are structural exceptions — see below.

| # | Function | Before | After | Helpers Extracted | Status |
|---|----------|:------:|:-----:|:-----------------:|:------:|
| P5C.1 | `performInitialization` | 425L | 88L | `deployArchitectureFiles`, `offerGlobalKnowledgeSetup`, `showInitSuccessAndGettingStarted`, `getGettingStartedHtml` | ✅ |
| P5C.2 | `setupEnvironment` | 219L | 53L | `buildSettingsCategoryItems`, `previewConfirmAndApply` | ✅ |
| P5C.3 | `setAgentMode` | ~~214L~~ | 5L | N/A (already compliant — master plan figure was stale) | ✅ |
| P5C.4 | `proposeSkillToGlobal` | 175L | 69L | `selectAndValidateSkill`, `packageAndPresentSkill` | ✅ |
| P5C.5 | `normalizeSynapseFile` | 172L | 70L | `normalizeConnection`, `writeOrderedSynapseFile` | ✅ |
| P5C.6 | `checkHealth` | 168L | 57L | `buildMarkdownFileIndex`, `scanFilesAndSynapses`, `classifyHealthStatus` | ✅ |
| P5C.7 | `completeMigration` | 166L | 86L | `executeMigrationItems` | ✅ |
| P5C.8 | `detectCognitiveLevel` | 166L | 52L | `detectGitHubAccount`, `detectBestModelTier`, `classifyCognitiveLevel` | ✅ |

**P3 overall**: ✅ Complete. 7 orchestrators decomposed into 17 focused helpers. Average orchestrator reduced from 213L to 68L (68% reduction). 4 of 7 are now under 60L NASA R4 target; remaining 3 (88L, 70L, 86L) are acceptable linear orchestrators.

---

### Priority 4: P5D — Structural Exceptions (Formally Accept)

> **Decision needed**: Accept command registration functions as structural exceptions to NASA R4.
> These are long but linear/declarative — splitting adds indirection without improving comprehension.

| Function | Lines | File | Recommendation |
|----------|:-----:|------|:--------------:|
| `activateInternal` | 820 | extension.ts | Accept |
| `registerImageCommands` | 628 | contextMenuImage.ts | Accept |
| `registerDeveloperCommands` | 576 | commandsDeveloper.ts | Accept |
| `registerGammaCommands` | 408 | commandsGamma.ts | Accept |
| `registerWordCommands` | 190 | commandsWord.ts | Accept |

---

### Priority 5: Persona Taxonomy Alignment ✅ Complete (Extension + LearnAlex)

> **Status**: FULLY COMPLETE (March 9) — Extension: 20 personas added to `personaDefinitions.ts` + `avatarMappings.ts` (47 personas, 81 avatar entries). LearnAlex: 8 workshop study guides added (33→41), all 41 guides revised with tool-agnostic practice sections, discipline examples, and extension CTA. Skill-to-discipline mapping and 10 new domain skills originated from LearnAlex heir and were promoted to Master.
> **Remaining**: `personaDefinitions.ts` skill assignments need code update to reference new skills. Alignment decisions deferred to backlog.
> **Source**: LearnAlex persona taxonomy (per DK-correax-brand.md).
>
> **New Skills Created (March 9)** — contributed by LearnAlex heir:
> - **Tier 1** (multi-discipline): `financial-analysis`, `sales-enablement`, `career-development`
> - **Tier 2** (multi-discipline): `legal-compliance`, `healthcare-informatics`, `hr-people-operations`
> - **Tier 3** (single-discipline): `comedy-writing`, `journalism`, `game-design`, `counseling-psychology`

#### Extension — 20 Personas Added ✅ (reference)

| # | LearnAlex Persona | Tag | Banner Action | Notes |
|---|-------------------|-----|---------------|:-----:|
| 1 | CX Leaders | CX | CUSTOMER EXPERIENCE | |
| 2 | Designers (UX/UI) | Design | DESIGNING | |
| 3 | Engineers | Engineering | ENGINEERING | General engineers (not DevOps/SRE) |
| 4 | Entrepreneurs | Startup | BUILDING A STARTUP | |
| 5 | Executives (CxO) | Leadership | LEADING | |
| 6 | Finance Professionals | Finance | FINANCIAL ANALYSIS | |
| 7 | Healthcare Professionals | Healthcare | HEALTHCARE | |
| 8 | HR & People Ops | HR | PEOPLE OPERATIONS | |
| 9 | Journalists | Journalism | JOURNALISM | |
| 10 | Knowledge Workers | Business | KNOWLEDGE WORK | |
| 11 | Lawyers | Legal | LEGAL WORK | |
| 12 | Nonprofit Leaders | Nonprofit | NONPROFIT LEADERSHIP | |
| 13 | Podcasters | Podcasting | PODCASTING | |
| 14 | Psychology Counselors | Counseling | COUNSELING | |
| 15 | Real Estate Professionals | Real Estate | REAL ESTATE | |
| 16 | Sales Professionals | Sales | SELLING | |
| 17 | Scientists | Science | SCIENTIFIC RESEARCH | Distinct from Researcher |
| 18 | Standup Comics | Comedy | COMEDY WRITING | |
| 19 | Teachers & Educators | Teaching | TEACHING | |
| 20 | Visual Storytellers | Data Viz | DATA VISUALIZATION | |

#### LearnAlex — 8 Workshops Added ✅ (March 9)

> **42 commits** across March 8-9. Study guides grew from 33 to 41. All 41 revised with tool-agnostic practice sections, discipline examples, and extension install CTA. Study guide overview page added. Free paywall re-enabled with restyled access wall.

| # | Extension Persona | Tag | Notes | Status |
|---|-------------------|-----|-------|:------:|
| 1 | Enterprise Architect | Architecture | System design, ADRs, cloud architecture | ✅ |
| 2 | Data Engineer | Data Engineering | Fabric, lakehouse, medallion, ETL | ✅ |
| 3 | Game Developer | Game Dev | Unity, Unreal, Godot, game design | ✅ |
| 4 | Security Engineer | Security | Threat modeling, compliance, pen testing | ✅ |
| 5 | Power User / Builder | Power User | Alex extension customization, tinkering | ✅ |
| 6 | Open Source Contributor | Open Source | OSS maintenance, community building | ✅ |
| 7 | SRE / On-Call | SRE | Incident response, observability, runbooks | ✅ |
| 8 | Grant Writer | Grants | NSF/NIH proposals, funding narratives | ✅ |

#### LearnAlex — Security & UX Hardening (March 8-9)

> Companion sprint that ran alongside the study guide additions.

| Category | Items Fixed | Highlights |
|----------|:-----------:|------------|
| P0 Security | 14 | XSS (innerHTML→textContent/createElement), CORS allowlisting, error message sanitization, CSP headers, MSAL v2→v5, managed identity migration |
| Rate Limiting | 3 endpoints | `/api/track` (60/min), `/api/generate-deck` (10/min), shared rate limiter module |
| UI/UX Audit | 14+ | WCAG touch targets (44px), contrast fixes, keyboard flyout nav, mobile nav collapse, semantic HTML |
| Code Quality | 6 | Shared table client, OData server-side filters, session storage consolidation, auth config dedup |
| Infrastructure | 2 | CI/CD restored (GitHub Actions → Azure SWA), Bicep admin email parameterized |

#### Skill-to-Discipline Mapping — "Alex is trained on what you do"

> **Purpose**: Each discipline/study guide should surface the Alex skills most relevant to that audience. This is an install incentive — users see that Alex has specialized knowledge for *their* profession, not just generic AI features. Use this table in LearnAlex study guides, workshop pages, and Docs tab persona cards.
> **Source**: 130 skills in `.github/skills/` mapped to 41 LearnAlex workshop disciplines. Mapping and 10 new domain skills contributed by LearnAlex heir (March 9): Tier 1 (`financial-analysis`, `sales-enablement`, `career-development`), Tier 2 (`legal-compliance`, `healthcare-informatics`, `hr-people-operations`), Tier 3 (`comedy-writing`, `journalism`, `game-design`, `counseling-psychology`).
> **Convention**: Skills listed in relevance order. First 3 are the strongest hooks for that audience.

| # | Discipline | Key Skills (install incentive) |
|---|-----------|-------------------------------|
| 1 | Academic Research | `literature-review`, `citation-management`, `research-project-scaffold`, `practitioner-research`, `dissertation-defense`, `anti-hallucination` |
| 2 | AI Researchers | `ai-agent-design`, `rag-architecture`, `prompt-engineering`, `llm-model-selection`, `multi-agent-orchestration`, `anti-hallucination` |
| 3 | Business Knowledge Workers | `business-analysis`, `executive-storytelling`, `status-reporting`, `gamma-presentations`, `project-management`, `deep-work-optimization` |
| 4 | Consultants | `business-analysis`, `executive-storytelling`, `scope-management`, `change-management`, `status-reporting`, `project-management` |
| 5 | Content Creators | `creative-writing`, `ai-writing-avoidance`, `image-handling`, `brand-asset-management`, `book-publishing`, `markdown-mermaid` |
| 6 | Creative Writers | `creative-writing`, `ai-writing-avoidance`, `book-publishing`, `prompt-engineering`, `lint-clean-markdown` |
| 7 | CX Leaders | `frustration-recognition`, `business-analysis`, `change-management`, `executive-storytelling`, `status-reporting`, `coaching-techniques` |
| 8 | Data Analysts | `microsoft-fabric`, `database-design`, `observability-monitoring`, `status-reporting`, `markdown-mermaid`, `anti-hallucination` |
| 9 | Data Engineers | `microsoft-fabric`, `database-design`, `infrastructure-as-code`, `azure-architecture-patterns`, `azure-deployment-operations`, `observability-monitoring` |
| 10 | Designers (UX/UI) | `ui-ux-design`, `svg-graphics`, `graphic-design`, `brand-asset-management`, `image-handling`, `cognitive-load` |
| 11 | Developers | `code-review`, `testing-strategies`, `debugging-patterns`, `refactoring-patterns`, `api-design`, `git-workflow`, `vscode-extension-patterns`, `architecture-audit` |
| 12 | Engineers | `architecture-audit`, `infrastructure-as-code`, `testing-strategies`, `debugging-patterns`, `performance-profiling`, `observability-monitoring` |
| 13 | Enterprise Architects | `architecture-audit`, `architecture-refinement`, `azure-architecture-patterns`, `infrastructure-as-code`, `enterprise-integration`, `api-design` |
| 14 | Entrepreneurs | `financial-analysis`, `business-analysis`, `scope-management`, `project-scaffolding`, `executive-storytelling`, `brand-asset-management` |
| 15 | Executives (CxO) | `executive-storytelling`, `financial-analysis`, `status-reporting`, `change-management`, `scope-management`, `business-analysis` |
| 16 | Finance Professionals | `financial-analysis`, `business-analysis`, `pii-privacy-regulations`, `anti-hallucination`, `status-reporting`, `deep-work-optimization` |
| 17 | Game Developers | `game-design`, `debugging-patterns`, `testing-strategies`, `performance-profiling`, `code-review`, `project-management` |
| 18 | Grant Writers | `grant-writing`, `creative-writing`, `citation-management`, `research-first-development`, `ai-writing-avoidance` |
| 19 | Healthcare Professionals | `healthcare-informatics`, `pii-privacy-regulations`, `privacy-responsible-ai`, `anti-hallucination`, `citation-management` |
| 20 | HR & People Ops | `hr-people-operations`, `pii-privacy-regulations`, `change-management`, `coaching-techniques`, `career-development` |
| 21 | Job Seekers | `career-development`, `ai-writing-avoidance`, `prompt-engineering`, `bootstrap-learning`, `creative-writing` |
| 22 | Journalists | `journalism`, `creative-writing`, `ai-writing-avoidance`, `citation-management`, `anti-hallucination` |
| 23 | Lawyers | `legal-compliance`, `pii-privacy-regulations`, `privacy-responsible-ai`, `anti-hallucination`, `citation-management` |
| 24 | Marketing | `creative-writing`, `ai-writing-avoidance`, `brand-asset-management`, `image-handling`, `executive-storytelling`, `prompt-engineering` |
| 25 | Nonprofit Leaders | `grant-writing`, `financial-analysis`, `business-analysis`, `executive-storytelling`, `change-management`, `status-reporting` |
| 26 | Open Source Contributors | `git-workflow`, `code-review`, `documentation-quality-assurance`, `testing-strategies`, `release-process`, `api-documentation` |
| 27 | Podcasters | `creative-writing`, `ai-writing-avoidance`, `text-to-speech`, `prompt-engineering`, `book-publishing` |
| 28 | Power Users / Builders | `vscode-extension-patterns`, `vscode-configuration-validation`, `prompt-engineering`, `skill-building`, `mcp-development`, `agent-debug-panel` |
| 29 | Product Managers | `project-management`, `scope-management`, `business-analysis`, `status-reporting`, `executive-storytelling`, `gamma-presentations` |
| 30 | Project Managers | `project-management`, `scope-management`, `status-reporting`, `change-management`, `gamma-presentations`, `alex-effort-estimation` |
| 31 | Psychology & Counselors | `counseling-psychology`, `learning-psychology`, `coaching-techniques`, `privacy-responsible-ai`, `frustration-recognition` |
| 32 | Real Estate | `financial-analysis`, `sales-enablement`, `business-analysis`, `executive-storytelling`, `creative-writing` |
| 33 | Scientists | `research-first-development`, `literature-review`, `citation-management`, `practitioner-research`, `anti-hallucination`, `research-project-scaffold` |
| 34 | Security Engineers | `security-review`, `distribution-security`, `secrets-management`, `pii-privacy-regulations`, `architecture-audit`, `incident-response` |
| 35 | Sellers | `sales-enablement`, `executive-storytelling`, `financial-analysis`, `coaching-techniques`, `business-analysis` |
| 36 | SRE / On-Call | `incident-response`, `post-mortem`, `observability-monitoring`, `root-cause-analysis`, `debugging-patterns`, `error-recovery-patterns` |
| 37 | Standup Comics | `comedy-writing`, `creative-writing`, `ai-writing-avoidance`, `prompt-engineering` |
| 38 | Students | `career-development`, `bootstrap-learning`, `learning-psychology`, `research-first-development`, `citation-management`, `socratic-questioning` |
| 39 | Teachers & Educators | `learning-psychology`, `coaching-techniques`, `socratic-questioning`, `gamma-presentations`, `creative-writing`, `slide-design` |
| 40 | Technical Writers | `documentation-quality-assurance`, `api-documentation`, `markdown-mermaid`, `lint-clean-markdown`, `md-to-word`, `code-review` |
| 41 | Visual Storytellers | `svg-graphics`, `graphic-design`, `image-handling`, `gamma-presentations`, `slide-design`, `markdown-mermaid` |

**Coverage stats**: 64 of 130 skills appear in at least one discipline mapping. Top skills by discipline coverage: `creative-writing` (14), `business-analysis` (10), `executive-storytelling` (9), `anti-hallucination` (7), `status-reporting` (7), `citation-management` (7), `prompt-engineering` (7), `pii-privacy-regulations` (7), `financial-analysis` (5), `coaching-techniques` (5). New dedicated skills: `legal-compliance` (1), `healthcare-informatics` (1), `hr-people-operations` (1), `comedy-writing` (1), `journalism` (1), `game-design` (1), `counseling-psychology` (1), `sales-enablement` (2), `career-development` (3).

---

### Priority 6: Streamline Cognitive Protocols (Stream A) ✅

> **Source**: Cognitive state audit (March 9, 2026)
> **Goal**: Remove all avatar set/revert boilerplate — participant.ts auto-detects everything.
> **Impact**: ~106 lines removed across prompts, agents, instructions. Cleaner prompt context, less ceremony.
> **Completed**: March 10, 2026

#### What was done

- Removed `> **Avatar**:` and `> **Revert Avatar**:` lines from all 39 prompt files
- Removed `> **Avatar**:` and `> **Revert Avatar**:` lines from all 7 agent files
- Removed `alex_cognitive_state_update` from tools frontmatter in all agent files and journey.prompt.md
- Removed "Cognitive State (Avatar)" section from copilot-instructions.md
- Removed "IMPORTANT — Avatar Revert" directives from meditation.instructions.md and dream-state-automation.instructions.md
- Synced all changes to 3 heir platforms (vscode-extension, m365-copilot, agent-plugin)

#### Steps

| # | Step | Status |
|---|------|:------:|
| 6.1 | Remove `> **Avatar**:` lines from all prompts | ✅ |
| 6.2 | Remove `> **Revert Avatar**:` lines from all prompts | ✅ |
| 6.3 | Remove avatar lines from all 7 agent files + tools frontmatter | ✅ |
| 6.4 | Remove Cognitive State section from copilot-instructions.md | ✅ |
| 6.5 | Fix tooltip bug: remove `pointer-events: none` from `.easter-egg-badge` CSS | ✅ |
| 6.6 | Remove avatar revert from meditation.instructions.md + dream-state-automation.instructions.md | ✅ |
| 6.7 | Sync all changes to heir platforms | ✅ |

---

### Priority 7: Persona Detection Quality (Stream B)

> **Source**: Persona detection weakness audit (March 9, 2026)
> **Goal**: Fix critical detection bugs, improve signal coverage, update LLM prompt.
> **Impact**: Better persona matching → more relevant skill recommendations → higher trust.

#### Findings Summary

| # | Severity | Issue |
|---|:--------:|-------|
| 1 | **CRITICAL** | `engineer` (weight 2.5) beats `developer` (weight 2.0) for "software engineer" |
| 2 | **HIGH** | 21/47 personas route to just 2 skills (`business-analysis` or `creative-writing`) |
| 3 | **HIGH** | LLM prompt only lists 13/47 persona IDs — 34 invisible to LLM detection |
| 4 | **HIGH** | P1-P4 only match `identity`+`technology` — 15 personas with no `technology` can only match on identity |
| 5 | **MEDIUM** | P3 phase detection hardcoded to 7/47 personas |
| 6 | **MEDIUM** | 41/47 personas have no `dependency` signals |
| 7 | **MEDIUM** | Tie-breaking favors array position — all 20 LearnAlex personas lose ties |
| 8 | **MEDIUM** | 7-day persona cache blocks detection improvements |
| 9 | **LOW** | 34 orphan avatar entries with no matching persona definition |
| 10 | **LOW** | Generic `data/`, `notes/`, `proposals/` patterns cause collisions |

#### Steps (CRITICAL + HIGH — remaining items deferred to backlog)

| # | Step | Severity | Status |
|---|------|:--------:|:------:|
| 7.1 | Fix `engineer` vs `developer` — removed bare `engineer` from developer pattern, added `software.?eng` to capture "software engineer" explicitly. Engineer pattern unchanged (retains domain-specific terms + bare `engineer` for unqualified use). | CRITICAL | ✅ |
| 7.2 | Boost `developer` identity weight from 2.0 to 2.5 | CRITICAL | ✅ |
| 7.3 | Update LLM prompt in `personaProjectDetection.ts` — generate persona ID list dynamically from `PERSONAS` array | HIGH | ☐ |
| 7.4 | Diversify skill assignments for 21 personas currently using `business-analysis` or `creative-writing` | HIGH | 🟡 10 dedicated domain skills created — mapping table updated, `personaDefinitions.ts` skill assignments still need code update |
| 7.5 | Add `technology` signals to 15 personas that only have `identity`+`structure`+`content` | HIGH | ☐ |

---

### Backlog

#### Persona Detection — Medium & Low Improvements

> Deferred from Priority 7. Not blocking v6.5.0 — revisit after CRITICAL+HIGH fixes ship.

| # | Step | Severity |
|---|------|:--------:|
| 7.6 | Add `dependency` signals to high-value personas (designer, scientist, finance-professional, teacher, podcaster) | MEDIUM |
| 7.7 | Expand P3 phase rules beyond 7 personas — add data-engineer, game-developer, student, content-creator | MEDIUM |
| 7.8 | Fix tie-breaking: use `>=` or secondary sort (signal count, specificity) instead of positional first-wins | MEDIUM |
| 7.9 | Reduce persona cache TTL from 7 days to 1 day, or invalidate on workspace change | MEDIUM |
| 7.10 | Clean up 34 orphan avatar map entries (or add matching persona definitions) | LOW |
| 7.11 | Narrow generic structure patterns (`data/` → `raw-data/|datasets/`, `notes/` → `lecture-notes/|session-notes/`) | LOW |
| 7.12 | Fix `power-user` and `knowledge-worker` identity weight from 2.0 to 2.5 | LOW |

#### Persona Taxonomy — Pending Decisions

> Extension additions ✅ complete (Priority 5). These decisions remain open.

- Should extension-only personas (Power User, Game Dev, SRE) go into LearnAlex as full study guides or sub-sections?
- Weak workspace signals for Standup Comics, Real Estate — accept low-confidence detection or rely on LLM?
- Naming standardization: extension uses role titles vs LearnAlex audience labels

#### Easter Egg UI Placement ✅

> Shipped March 9. Option A implemented: 16px emoji badge on header icon (bottom-right overlay).
> Fixes: `pointer-events: none` removed (tooltip works), accent color no longer leaks globally
> (easter egg gets `--egg-accent` CSS var, persona accent stays clean).

#### Cancelled Steps (Contract B)

| Step | Original | Dependency | Unblock Condition |
|------|----------|-----------|-------------------|
| 7.15 | Context Budget percentage bar | VS Code API | VS Code exposes `chat.contextBudget` or equivalent |
| 7.31 | Context Budget Impact per skill | Token cost estimation | Skill token measurement tooling built |

#### Wave 5.3 — Sidebar View Removal (deferred)

Remove redundant sidebar view registrations from `package.json`. Was deferred during Wave 5 — no removals safe yet. Revisit when Command Center fully replaces all legacy surface journeys.

#### Contract Dependencies (inform future waves)

| Contract | Scope | Required For |
|----------|-------|-------------|
| Contract A | Agent lifecycle hooks (active/queued/idle) | Real-time agent state in Agents tab |
| Contract B | Context budget API (`countTokens()`) | Context Budget bar + per-skill impact |
| Contract C | Full five-modality memory model | Mind tab live data |
| Contract D | Recently-used command tracking | Adaptive UX (command history) |

---

## Design Principles

1. **Tab first** — consolidate into 5 tabs, not 5 panels.
2. **Ship the simplest useful version** — existing data before new contracts.
3. **Coexistence before consolidation** — prove the new surface before removing old.
4. **Curate, don't mirror** — Docs tab surfaces strongest pathways, not a full clone.
5. **LLM-coherent** — structure that an AI can reliably parse and generate.
6. **Classify every data source** — Existing / Derived / New tags on every element.
7. **Preserve working runtime paths** — no speculative cleanup.
8. **Data-backed or deferred** — remove cards without a real data source.
9. **One surface to rule them** — a single tab can always be reached from the sidebar.

## Audit-Driven Guardrails

| # | Guardrail | Rule |
|---|-----------|------|
| G1 | No removals until replacement proven | Old views persist until new ones are shipping |
| G2 | Spike before architect | SVG, tab shell, data contracts — prove unknowns early |
| G3 | Compile clean at each wave boundary | Every wave ends with `npm run compile` = 0 errors |
| G4 | Keyboard parity | Every interactive element reachable via Tab + Enter/Space |
| G5 | Docs curated from AlexLearn | No parallel vocabulary; personas from companion site |
| G6 | Tag every data point | Existing / Derived / New classification |
| G7 | Retain context | `retainContextWhenHidden: true` stays |
| G8 | Justify all cards | If data source doesn't exist, card is deferred |
| G9 | Test responsive | Every wave tested at 300px sidebar width |

---

## Validated Baseline (March 9, 2026)

### Extension Baseline

| Fact | Verified Value |
|------|----------------|
| Sidebar views registered | 3: `alex.welcomeView`, `alex.cognitiveDashboard`, `alex.memoryTree` |
| `welcomeView.ts` | 819 lines (data collection + tab switching) |
| `welcomeViewHtml.ts` | 831 lines (shell: tab bar, orchestrator, client JS — CSS extracted to `sharedStyles.ts`) |
| `sharedStyles.ts` | 1,570 lines (pure CSS — design system, component styles, tab styles, Wave 7 additions) |
| 5 tab modules | missionTabHtml.ts, agentsTabHtml.ts, skillStoreTabHtml.ts, mindTabHtml.ts, docsTabHtml.ts |
| `avatarMappings.ts` | 741 lines (SVG format parameter added in Spike 1A) |
| `memoryTreeProvider.ts` | 281 lines |
| `cognitiveDashboard.ts` | 558 lines (split: `_getHtmlForWebview` → 3 helpers) |
| `participant.ts` | 995 lines |
| `healthDashboard.ts` | 994 lines |
| Avatar asset files | 123 (90 PNG/WebP + 33 rocket SVGs) — 22 dead ALEX-*.png/webp removed |
| Welcome view uses retained context | Yes (`retainContextWhenHidden: true`) |
| Chat participant avatar path | SVG-first (rocket-icons) with PNG fallback |
| Extension compile state | Clean |
| Total TS source files | 107 |
| Total lines of code | 46,838 |
| Test files | 20 |
| Skills | 130 (120 existing + 10 domain skills contributed by LearnAlex heir) |
| Trifectas | 37 complete |

### AlexLearn Baseline

| Fact | Verified Value |
|------|----------------|
| Workshop study guide count | 41 (was 33 → +8 extension-only personas added March 9) |
| Workshop guide source path | `website/src/pages/workshop/*.astro` |
| Study guide overview page | Yes (`/workshop/guide`) — added March 9 |
| All guides revised | Yes — tool-agnostic practice sections, discipline examples, extension CTA |
| Self-study page exists | Yes |
| Exercises page exists | Yes |
| Facilitator materials exist | Yes (Session Plan, Slides, Demo Scripts, Handout, Pre-Read, GitHub Guide) |
| Free paywall | Active — sign-in required, all content free |
| Security hardening | 14 P0 fixes, MSAL v5, CSP headers, CORS, rate limiting, managed identity |
| UI/UX audit | 14+ findings fixed (WCAG, touch targets, contrast, keyboard, mobile) |
| CI/CD | GitHub Actions auto-deploy to Azure SWA |
| Commits (March 8-9 sprint) | 42 |

---

## Success Criteria (v6.5.0 "Trust Release")

1. **20+ test files** ✅ — 20 test files covering all v6.0.0 services
2. **Zero NASA R4 violations** 🟡 — 13 functions split; ~50 real remain + ~75 structural exceptions
3. **No logic file >1,500 lines** ✅ — `sharedStyles.ts` (1,570L) is pure CSS, not logic
4. **No source file >1,000 lines** 🟡 — 2 logic files remain >1,000L (P5B: extension.ts 1,043, globalKnowledgeContent.ts 1,027)
5. **North Star Trust score ≥7/10** ✅
6. **UI audit clean** 🟡 — Wave 8 addresses 20 findings (NEW)

> **Principle**: *Don't add features. Prove the existing ones deserve trust.*

---
---

# Appendix A — Completed Waves (98/100 shipped, 2 cancelled)

### Completion Summary

| Wave | Title | Steps | Done | Key Deliverables |
|------|-------|:-----:|:----:|------------------|
| 0 | Planning Hygiene | 4 | 4 | Plan locked, baselines verified |
| 1 | Critical Spikes | 15 | 15 | SVG hybrid pipeline, tab shell, data contracts |
| 2 | Command Center Shell | 7 | 7 | 5-tab bar, ARIA, persistence, scroll restoration, responsive |
| 3 | Docs Tab | 8 | 8 | 7 content groups, 33-persona workshop grid, 7 external URLs |
| 4 | Mission Command | 8 | 8 | Session card, doc buttons migrated, features bloat removed |
| 5 | Controlled Consolidation | 5 | 5 | Journey audit, legacy views preserved, cognitive dashboard redirect, 5.3 deferred |
| 6 | Advanced Tabs | 8 | 8 | Agent registry, Skill Store, Mind dashboard, easter egg SVG fix, code review |
| 7 | UI Development | 45 | 43 | WCAG, touch targets, content alignment, 2 cancelled (Contract B) |
| **Σ** | | **100** | **98** | |

### Wave 0 — Planning Hygiene ✔️

| # | Step | Status |
|---|------|:------:|
| 0.1 | Lock this master plan as the single execution document | ✓ |
| 0.2 | Mark feasibility study header as "background research only" | ✓ |
| 0.3 | Verify baseline numbers against live source | ✓ |
| 0.4 | Confirm rocket-icon SVG inventory (33 files, 4 categories) | ✓ |

### Wave 1 — Critical Spikes ✔️

**Spike 1A — SVG Avatar Viability (PASS: Hybrid)**

| # | Step | Status |
|---|------|:------:|
| 1.1 | Copy rocket SVG to assets/avatars/rocket-icons/ | ✓ |
| 1.2 | Add format param to `getAvatarAssetRelativePath()` | ✓ |
| 1.3 | Test SVG as `ChatParticipant.iconPath` | ✓ |
| 1.4 | Test SVG inside webview `<img>` tag | ✓ |
| 1.5 | Record viability result | ✓ SVG-first with PNG fallback |
| 1.6 | Code Review — Bug found and fixed (TypeScript const assertion) | ✓ |

**Spike 1B — Tab Shell (PASS)**

| # | Step | Status |
|---|------|:------:|
| 1.7 | Add tab-bar HTML to `welcomeViewHtml.ts` | ✓ |
| 1.8 | Add ARIA tablist pattern (`role="tablist"`, `role="tab"`, `aria-selected`) | ✓ |
| 1.9 | Add keyboard navigation (ArrowLeft/Right/Home/End) | ✓ |
| 1.10 | Add `getState()/setState()` for tab persistence across refresh | ✓ |
| 1.11 | Verify 30s auto-refresh doesn't reset active tab | ✓ |

**Spike 1C — Data Contract Triage (PASS)**

| # | Step | Status |
|---|------|:------:|
| 1.12 | Classify `getWelcomeHtmlContent()` parameters as Existing/Derived/New | ✓ |
| 1.13 | Define `MindTabData` interface (5 modality counts, synapse health %, cognitive age, maintenance dates) | ✓ |
| 1.14 | Define `AgentInfo` interface (id, name, icon, description, role, installed) | ✓ |
| 1.15 | Define `SkillInfo` interface (id, displayName, description, category, hasSynapses) | ✓ |

### Wave 2 — Command Center Shell ✔️

| # | Step | Status |
|---|------|:------:|
| 2.1 | Implement full tab-bar component (5 text-label tabs, active highlight) | ✓ |
| 2.2 | Implement tab-content switching and active-tab rendering | ✓ |
| 2.3 | Add `getState()/setState()` for active-tab persistence across refreshes | ✓ |
| 2.4 | Design and implement empty-state panels for all 5 tabs | ✓ |
| 2.5 | Test responsive layout at 300px sidebar width | ✓ |
| 2.6 | Add per-tab scroll-position restoration | ✓ |
| 2.7 | Compile clean · no sidebar regressions · manual smoke test | ✓ |

### Wave 3 — Docs Tab ✔️

| # | Step | Status |
|---|------|:------:|
| 3.1 | Build Getting Started card group | ✓ |
| 3.2 | Build Workshop Study Guides persona grid (33 personas) | ✓ |
| 3.3 | Build Self-Study and Exercises section | ✓ |
| 3.4 | Build Facilitator Materials section | ✓ |
| 3.5 | Add local architecture and operations doc entry points | ✓ |
| 3.6 | Add Learn Alex Online CTA and Partnership guide link | ✓ |
| 3.7 | Validate all links resolve and open correctly | ✓ |
| 3.8 | Test layout at sidebar width — no cramping, primary content above fold | ✓ |

### Wave 4 — Mission Command ✔️

| # | Step | Status |
|---|------|:------:|
| 4.1 | Build Architecture Status banner card (existing data) | ✓ |
| 4.2 | Port Smart Nudges logic from current welcome view into a card | ✓ |
| 4.3 | Build Quick Command bar | ✓ |
| 4.4 | Build Session / Goal summary area (existing data only) | ✓ |
| 4.5 | Add Settings Manager and Secret Manager entry points | ✓ |
| 4.6 | Tag every card with data classification (existing / derived / deferred) | ✓ |
| 4.7 | Remove or defer any card that cannot defend its data source | ✓ |
| 4.8 | Verify Mission Command is more useful than the current welcome view | ✓ |

### Wave 5 — Controlled Consolidation ✔️

| # | Step | Status |
|---|------|:------:|
| 5.1 | Audit user journeys covered by Command Center vs current three views | ✓ |
| 5.2 | Redirect legacy commands to new tab destinations | ✓ `alex.showCognitiveDashboard` → Mind tab via `alex.switchToTab` |
| 5.3 | Remove redundant sidebar view registrations from `package.json` | deferred — no removals safe yet |
| 5.4 | Preserve editor-panel dashboards that serve deeper use cases | ✓ kept both |
| 5.5 | Verify no capability loss for normal workflows | ✓ |

### Wave 6 — Advanced Tabs ✔️

| # | Step | Status |
|---|------|:------:|
| 6.1 | Define Agent status contract (AgentInfo interface) | ✓ |
| 6.2 | Implement Agents tab — 7-agent registry cards with installed status | ✓ |
| 6.3 | Define Skill Store catalog model (SkillInfo interface) | ✓ |
| 6.4 | Implement Skill Store tab — clickable skill cards with category, description, synapse indicator | ✓ |
| 6.5 | Define Mind tab runtime model (MindTabData interface) | ✓ |
| 6.6 | Implement Mind tab — cognitive age, synapse health %, 5 memory modality bars, maintenance timestamps | ✓ |
| 6.7 | Fix easter egg avatar to use unified SVG resolution instead of deleted PNG paths | ✓ |
| 6.8 | Code review — 6 issues found and fixed | ✓ |

### Wave 7 — UI Development (Audit-Driven) ✔️

> 43/45 shipped, 2 cancelled (7.15 + 7.31 depend on unbuilt Contract B)

**7A — WCAG Compliance (P1 HIGH)**

| # | Step | Status |
|---|------|:------:|
| 7.1 | Add `id` attributes to tab buttons for `aria-labelledby` resolution | ✓ |
| 7.2 | Add Enter/Space keyboard activation for all `[data-cmd]` elements | ✓ |
| 7.3 | Bump sub-11px fonts to minimum 11px (9 selectors fixed) | ✓ |
| 7.4 | Fix semantic role mismatches (`.persona-card`, `.status-grid`) | ✓ |

**7B — UX Quality (P2 MEDIUM)**

| # | Step | Status |
|---|------|:------:|
| 7.5 | Replace hardcoded hex colors in Mind tab with VS Code theme variables | ✓ |
| 7.6 | Increase touch targets below 36px minimum to 36px (5 elements) | ✓ |
| 7.7 | Increase inter-target spacing below 8px minimum to 8px (3 lists) | ✓ |
| 7.8 | Normalize non-standard spacing values (26 replacements) | ✓ |

**7C — Content Alignment: Mission Control**

| # | Step | Status |
|---|------|:------:|
| 7.9 | Architecture Status banner (3-state indicator) | ✓ |
| 7.10 | Live Activity Feed | ✓ |
| 7.11 | Quick Command bar | ✓ |
| 7.12 | "Later" dismiss button on Smart Nudge cards | ✓ |
| 7.13 | Secret Manager inline dashboard | ✓ |
| 7.14 | Settings Manager inline toggles | ✓ |
| 7.15 | Context Budget percentage bar | ✗ cancelled (Contract B) |
| 7.16 | Personality Toggle (Precise/Chatty) | ✓ |
| 7.17 | Action button density — progressive disclosure | ✓ |

**7D — Content Alignment: Agents**

| # | Step | Status |
|---|------|:------:|
| 7.18 | Cognitive State card (avatar + phase/mode + reasoning meter) | ✓ |
| 7.19 | Parallel Agents display (side-by-side with progress indicators) | ✓ |
| 7.20 | Live status badges (ACTIVE/QUEUED/ROUTING/IDLE) | ✓ |
| 7.21 | Recent Threads section | ✓ |
| 7.22 | Auto-Routing explanation card | ✓ |
| 7.23 | Create Custom Agent placeholder with CTA | ✓ |

**7E — Content Alignment: Skill Store**

| # | Step | Status |
|---|------|:------:|
| 7.24 | Search bar + filter controls | ✓ |
| 7.25 | Catalog Toggle bar (All/Active/Inactive) | ✓ |
| 7.26 | Skill Health summary bar | ✓ |
| 7.27 | 3-tier category grouping (Core/Development/Creative) | ✓ |
| 7.28 | Enable/disable toggle switches per skill | ✓ |
| 7.29 | Skill icons from rocket-icons SVG set | ✓ |
| 7.30 | "Install from GitHub" action | ✓ |
| 7.31 | Context Budget Impact per skill | ✗ cancelled (Contract B) |

**7F — Content Alignment: Mind**

| # | Step | Status |
|---|------|:------:|
| 7.32 | Knowledge Freshness panel (forgetting curve) | ✓ |
| 7.33 | Honest Uncertainty panel (confidence distribution) | ✓ |
| 7.34 | Global Knowledge panel (insight count, project count) | ✓ |
| 7.35 | Identity card (name, age, personality) | ✓ |
| 7.36 | Enriched Cognitive Age display (tier, progression bar, milestones) | ✓ |
| 7.37 | Upgraded Memory Architecture (5 rich modality cards) | ✓ |
| 7.38 | Meditation streak counter + emotion tags | ✓ |

**7G — Content Alignment: Docs**

| # | Step | Status |
|---|------|:------:|
| 7.39 | Tips & Nudges section at top of Docs tab | ✓ |
| 7.40 | Architecture grid (2×3) | ✓ |
| 7.41 | Operations grid (2×2) | ✓ |
| 7.42 | Enriched Getting Started (4-card layout) | ✓ |
| 7.43 | Partnership card presentation | ✓ |

**7H — Polish (P3 LOW)**

| # | Step | Status |
|---|------|:------:|
| 7.44 | Progressive disclosure for Mission Ctrl button density | ✓ |
| 7.45 | Standardize focus indicator widths to 2px | ✓ |

---

# Appendix B — Completed Optimization

### P0 — Break Down welcomeViewHtml.ts ✔️ (2,982 → 895L)

Extracted 5 tab modules + CSS:

| Module | Extracts | Status |
|--------|----------|:------:|
| `missionTabHtml.ts` | Mission Command tab HTML + CSS + client JS | ✓ |
| `agentsTabHtml.ts` | Agents tab HTML + CSS | ✓ |
| `skillStoreTabHtml.ts` | Skill Store tab HTML + CSS + icon map + toggle handlers | ✓ |
| `mindTabHtml.ts` | Mind tab HTML + CSS | ✓ |
| `docsTabHtml.ts` | Docs tab HTML + CSS | ✓ |
| `sharedStyles.ts` | 1,596L shared CSS (P5A extraction) | ✓ |
| `welcomeViewHtml.ts` (residual) | 895L shell: tab bar, orchestrator, client JS | ✓ |

### P1 — Break Down Other >1,000-Line Files ✔️ (8 → 5 files >1,000L)

| File | Was | Now | Extracted To | Status |
|------|:---:|:---:|--------------|:------:|
| `extension.ts` | 1,283 | 1,043 | `statusQuickPick.ts` (221L) | ✓ |
| `contextMenu.ts` | 1,278 | 477 | `contextMenuImage.ts` (794L) | ✓ |
| `globalKnowledgeOps.ts` | 1,234 | 728 | `globalKnowledgeMigration.ts` (248L) + `globalKnowledgeTools.ts` (345L) | ✓ |
| `upgrade.ts` | 1,209 | 670 | `upgradeSynapseNormalization.ts` (172L) + `upgradeMigration.ts` (166L) | ✓ |
| `personaDetection.ts` | 1,062 | 658 | `personaProjectDetection.ts` (445L) | ✓ |
| `pptxGenerator.ts` | 1,035 | 674 | `pptxSlideTypes.ts` (496L) | ✓ |
| `commandsPresentation.ts` | 1,024 | 574 | `commandsGamma.ts` (~410L) + `commandsWord.ts` (~195L) | ✓ |
| `setupEnvironment.ts` | 997 | 904 | `getEmbeddedMarkdownCss` extracted | ✓ |

### P2 — Test Coverage ✔️ (6 → 20 test files)

| Test File | Tests For |
|-----------|-----------|
| `welcomeView.test.ts` | `_collectMindData`, `_collectAgents`, `_collectSkills`, toggle handlers |
| `secretsManager.test.ts` | `getTokenStatuses`, token CRUD |
| `honestUncertainty.test.ts` | `getCalibrationSummary`, coverage scoring |
| `episodicMemory.test.ts` | File-based memory CRUD, freshness calculation |
| `outcomeTracker.test.ts` | Prediction tracking, accuracy calculation |
| `taskDetector.test.ts` | Task classification, domain detection |
| `workflowEngine.test.ts` | State machine transitions, phase detection |
| `expertiseModel.test.ts` | Expertise scoring, tier progression |
| `personaDetection.test.ts` | Persona matching, priority resolution |
| `globalKnowledge.test.ts` | Cross-project knowledge search, promotion |
| `avatarMappings.test.ts` | SVG resolution, fallback chain |
| `contextMenu.test.ts` | Menu item generation, command routing |
| `healthCheck.test.ts` | Architecture validation, status aggregation |
| `upgrade.test.ts` | Version migration, data transformation |

### P5A — CSS Extraction ✔️ (2,379 → 895L)

Extracted 1,581 lines of shared CSS into `sharedStyles.ts`. One template interpolation (`${personaAccent}`) passed as function parameter.

### P3 — NASA R4 Functions Split (13 of ~63 total)

| Function | Was | Now | File |
|----------|:---:|-----|------|
| `commandsDeveloper.ts` body | 978L | 520L → `commandsDeveloperHandlers.ts` | commandsDeveloper.ts |
| `getStarterPatterns` | 384L | 5+1 functions | globalKnowledgeContent.ts |
| `getUserGuideContent` | 332L | 4+1 functions | globalKnowledgeContent.ts |
| `_getHtmlForWebview` | 333L | 3 helpers | cognitiveDashboard.ts |
| `getAnimatedBannerSvg` | 206L | 4 helpers | globalKnowledgeContent.ts |
| `showStatusQuickPick` | 219L | 2 data helpers + orchestrator | statusQuickPick.ts |
| `getAudioPlayerHtml` | 303L | 3 section helpers + assembler | audioPlayer.ts |
| `prepareTextForSpeech` | 210L | 5-stage pipeline | ttsService.ts |
| `copyMarkdownCssToWorkspace` | 281L | `getEmbeddedMarkdownCss()` extracted | setupEnvironment.ts |
| `readAloud` | 239L | 3 helpers + orchestrator | readAloud.ts |
| `saveAsAudio` | 229L | `acquireTextForSave()` + reuses `selectVoiceForText()` | readAloud.ts |
| `upgradeArchitecture` | 263L | 4 helpers + orchestrator | upgrade.ts |
| Dead avatar cleanup | — | 22 ALEX-*.png/webp deleted (1,256 KB) | personaDefinitions.ts |

---

# Appendix C — Design Inputs & Reference

### Approved Mockups

| File | Tab | Dimensions |
|------|-----|------------|
| `mockups/command-center-v2-mission-control.svg` | Mission Command | 560×800 |
| `mockups/command-center-v2-agent-hub.svg` | Agents | 560×870 |
| `mockups/command-center-v2-skill-store.svg` | Skill Store | 560×812 |
| `mockups/command-center-v2-mind.svg` | Mind | 560×960 |
| `mockups/command-center-v2-docs.svg` | Docs | 560×920 |

All files under `alex_docs/research/mockups/`. Only v2 mockups are active design inputs.

### Icon Inventory

| Property | Value |
|----------|-------|
| Total SVGs | 33 (9 states + 7 agents + 16 personas + 1 default) |
| Source | `alex_docs/research/mockups/rocket-icons/` |
| Generator | `alex_docs/research/mockups/generate-rocket-icons.js` |
| Preview | `alex_docs/research/mockups/rocket-icons/preview.html` |

### CSS Design System

```css
/* Tokens defined in sharedStyles.ts */
--persona-accent: <dynamic per persona>
/* Spacing scale */  4px | 8px | 16px | 24px | 32px
/* Font scale */     13px | 14px | 16px | 18px
/* Shadow scale */   sm | md | lg
/* CSP */            default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src nonce-*; img-src ${webview.cspSource} https: data:
```

### API Feasibility Reference

| Feature | API Status | Planning Position |
|---------|-----------|-------------------|
| SVG chat avatar | `iconPath` accepts `Uri` ✅ | Proven in Spike 1A |
| Tab state persistence | `getState()/setState()` ✅ | Built in Wave 2 |
| Sidebar badge | `WebviewView.badge` | Optional future enhancement |
| Context budget | `countTokens()` proposed API | Defer (Contract B) |
| Agent activity feed | No lifecycle API | Defer (Contract A) |
| Skill toggle | No skill API | Settings-driven (Contract C variant) |

### Planning Principles

1. **UI first means UI first.** Early waves focus on visible structure. Do not block UI on advanced telemetry.
2. **Preserve working runtime paths.** Current welcome view, PNG avatar path, and 3 sidebar registrations coexist until replacements are proven.
3. **Resolve blocking spikes.** Prove unknowns early.
4. **Classify every data source.** Existing / Derived / New.
5. **Curate, don't mirror.** Docs tab surfaces strongest AlexLearn pathways.
