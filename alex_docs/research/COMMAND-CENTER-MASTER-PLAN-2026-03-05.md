# Command Center Master Plan

**Author**: Alex Finch + GitHub Copilot
**Created**: March 5, 2026
**Revised**: March 8, 2026 — Wave 7 complete (43/45 shipped, 2 cancelled)
**Classification**: Internal — UI-first implementation plan
**Status**: ✔️ All waves complete (98/100 shipped, 2 cancelled) · Command Center v1.0 delivered

> **This is the single source of truth for Command Center work.** All context from the feasibility study, design principles, competitive analysis, and second-opinion audit has been consolidated here. Background research docs are archived for reference only.

### Background Docs (archived — do not use as active checklists)

| Document | Role | Location |
|----------|------|----------|
| Feasibility Study | Original vision, tab architecture, UI direction | [COMMAND-CENTER-FEASIBILITY-2026-03-05.md](COMMAND-CENTER-FEASIBILITY-2026-03-05.md) |
| Design Principles | 9 guiding principles for UX decisions | [COMMAND-CENTER-DESIGN-PRINCIPLES.md](COMMAND-CENTER-DESIGN-PRINCIPLES.md) |
| Codex Competitive Analysis | Market validation, standalone UI assessment | [CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md](CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md) |
| Second-Opinion Audit | GPT-5.4 code-to-doc fact check, risk findings | [COMMAND-CENTER-SECOND-OPINION-AUDIT-2026-03-05.md](../audits/COMMAND-CENTER-SECOND-OPINION-AUDIT-2026-03-05.md) |
| UI Artifact Approval | Mockup approval sheet with thumbnails | [COMMAND-CENTER-UI-ARTIFACT-APPROVAL-2026-03-05.md](COMMAND-CENTER-UI-ARTIFACT-APPROVAL-2026-03-05.md) |

---

## Purpose

The Command Center is a **staged UI refactor** of the welcome view sidebar into a 5-tab operational surface.

### Execution Strategy

1. **UI first** — visible structure before advanced telemetry
2. **Prove critical assumptions early** — spikes before architecture
3. **Preserve existing runtime behavior** — no speculative cleanup
4. **Separate visual from data-contract work** — classify every element
5. **Ship useful slices** — don't attempt total consolidation in one pass

### Strategic Validation

OpenAI Codex (Windows app launched March 5, 2026) validates Alex's architectural vision — skills, agents, personality, background work, cognitive states are exactly the playbook a $157B company is now executing. The Command Center is Alex's answer: a single unified sidebar surface that no other AI assistant offers, with the **Mind tab as the key differentiator** ("the tab no other AI has").

---

## Executive Decision

The Command Center is a **staged UI refactor**, not a single full replacement.

### What changes from the feasibility plan

- First milestone is **not** a gut-and-replace — it's a proof-of-capability slice
- SVG avatar migration is a **blocking technical spike**, not an assumed foundation
- First real milestone: **Mission Command + Docs** (highest value, lowest risk)
- Agents, Skill Store, Mind tabs deferred until data contracts are explicit
- Docs tab: **curated AlexLearn alignment**, not a full website mirror

### Final Tab Architecture

| # | Tab | Purpose | Wave |
|---|-----|---------|------|
| 1 | **Mission Command** | Operational dashboard — status, commands, nudges, settings | Wave 4 ✅ |
| 2 | **Agents** | Agent management — state, registry, threads | Wave 6 ✅ |
| 3 | **Skill Store** | Skill catalog — browse, toggle, search | Wave 6 ✅ |
| 4 | **Mind** | Cognitive introspection — health, memory, age, uncertainty | Wave 6 ✅ |
| 5 | **Docs** | Documentation hub + LearnAlex bridge | Wave 3 ✅ |

### Design Principles (consolidated from design doc)

1. **Scarcity Forces Clarity** — 300px sidebar is an advantage. Every element justifies its space. No decorative-only elements on Mission Command.
2. **Data Layer Leads** — Prefer existing data first, surface derived data carefully, never present new telemetry until its contract is explicit.
3. **Mind Tab = Differentiator** — The tab no other AI has: brain health, 5 memory modalities, cognitive age, honest uncertainty. Trust through transparency.
4. **State Over Identity** — Avatar shows *what Alex is doing*, not what Alex looks like. Color/shape encode cognitive state first, persona second.
5. **Progressive Disclosure** — Skills: name → body → resources. Navigation: tab → sidebar → full panel. Actions: Quick → Agents → palette.
6. **Context-Adaptive** — Quick Actions change when persona/cognitive state changes. Static equals stale.
7. **Keyboard-First** — Arrow keys between tabs, focus trap within active content, all actions reachable by keyboard.
8. **Empty States Are Coaching** — "Ready when you are" language, single action CTA, designed for first use.
9. **Recently Used Is Foundation** — Usage tracking enables adaptive Quick Actions, recent threads, usage analytics. Implement before features that depend on it.

### Audit-Driven Guardrails (from second-opinion audit)

These were identified by the GPT-5.4 code-to-doc fact check and are now embedded in the execution plan:

| # | Guardrail | Applied In |
|---|-----------|------------|
| G1 | Build proof-of-capability slice before gut-and-replace | Wave 2–4 sequence |
| G2 | SVG avatar is a hard go/no-go spike, not an assumption | Spike 1A |
| G3 | Use current implementation model for Mind tab first — don't force richer conceptual model | Contract C scope |
| G4 | Use built-in `getState()/setState()` before `globalState` | Wave 2 implementation |
| G5 | Docs tab is curated alignment, not full site mirror | Wave 3 scope |
| G6 | Classify every card as existing/derived/new — defer new | Wave 4 data classification |
| G7 | Don't remove views before replacements are running | Wave 5 gating |
| G8 | Agent status, context budget, five-modality mind are hypotheses until contracts defined | Wave 6 gating |
| G9 | Narrow first milestone, validate layout/density/ergonomics before expanding | Waves 2–4 before 6 |

---

## Execution Tracker

This is the step-by-step execution checklist. Each step is small enough to complete, verify, and check off in a single session. Review this tracker at the start of every work session.

**Status**: `—` Not started · `►` In progress · `✓` Done · `✗` Blocked
**Tracks**: **A** UI Surface · **B** Runtime Contracts · **C** Visual Identity
**Last updated**: March 8, 2026 — Wave 7 UI Development added (45 steps from UI/UX + Content audits)

### Wave 0 — Planning Hygiene ✔️

> **Goal**: Clean foundation before any code changes.
> **Depends on**: Nothing. **Unlocks**: Waves 1–6.
> **Completed**: March 7, 2026

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 0.1 | Lock this master plan as the single execution source of truth | — | ✓ |
| 0.2 | Mark feasibility doc header as "background research only" | — | ✓ |
| 0.3 | Verify all baseline numbers match current source code | — | ✓ |
| 0.4 | Confirm icon inventory reflects rocket-icons (33 SVGs, 4 categories) | C | ✓ |

### Wave 1 — Critical Spikes ✔️

> **Goal**: Prove the two biggest technical unknowns before committing to architecture.
> **Depends on**: Wave 0. **Unlocks**: Waves 2–6.
> **Completed**: March 8, 2026 — All 3 spikes validated, decisions recorded

**Spike 1A — SVG Avatar Viability** (Track C)

| # | Step | Status |
|---|------|:------:|
| 1.1 | Copy one rocket SVG into `platforms/vscode-extension/assets/avatars/` | ✓ |
| 1.2 | Update `getAvatarAssetRelativePath()` to accept `'svg'` format parameter | ✓ |
| 1.3 | Update `avatarMappings.ts` to resolve an SVG path for one test state | ✓ |
| 1.4 | Set `ChatParticipant.iconPath` to the SVG `Uri` and verify it renders in chat | ✓ `participant.ts` L1006-1017: SVG-first via `getAvatarAssetRelativePath(result, 'svg')` |
| 1.5 | Test SVG rendering inside a webview `<img>` tag | ✓ `welcomeViewHtml.ts` L1474: `<img src="${avatarSvgUri}" data-fallback="${avatarPngUri}">` + error handler |
| 1.6 | **DECISION**: Record avatar strategy — full SVG / hybrid / PNG fallback | ✓ **HYBRID**: SVG rocket-icons first, PNG fallback on error. Both chat `iconPath` and webview `<img>` use this pipeline. |

**Spike 1B — Tab Shell Viability** (Track A + B)

| # | Step | Status |
|---|------|:------:|
| 1.7 | Add minimal tab-bar HTML to `welcomeViewHtml.ts` (5 text-label tabs) | ✓ |
| 1.8 | Wire `postMessage` handler for tab switching in `welcomeView.ts` | ✓ |
| 1.9 | Verify `resolveWebviewView` refresh preserves active tab selection | ✓ `getState()/setState()` L1801-1836: activeTab + scrollPositions persisted, restored on load |
| 1.10 | Test keyboard navigation (arrow keys + Enter) on the tab bar | ✓ L1813-1828: ArrowLeft/Right/Home/End with roving tabindex, `aria-selected`, focus management |
| 1.11 | **DECISION**: Record shell viability — pass / rework needed | ✓ **PASS**: 5-tab shell fully functional — ARIA roles, keyboard nav, state persistence, scroll restoration, responsive at 300px |

**Spike 1C — Data Contract Triage** (Track B)

| # | Step | Status |
|---|------|:------:|
| 1.12 | Classify each Mission Command card as existing / derived / new data | ✓ |
| 1.13 | Classify each Mind tab element as existing / derived / new data | ✓ |
| 1.14 | Document context-budget data availability and aggregation path | ✓ |
| 1.15 | **DECISION**: Record contract triage results for all tabs | ✓ **CONTRACTS DEFINED**: `MindTabData` (5 modality counts, synapse health, cognitive age, maintenance dates), `AgentInfo` (7-agent registry with installed status from disk), `SkillInfo` (catalog with category, description, synapse indicator). All existing data — no new telemetry required. |

### Wave 2 — Command Center Shell

> **Goal**: The welcome view hosts a working tabbed shell without demanding feature parity.
> **Depends on**: Spike 1B pass. **Unlocks**: Waves 3–4 (parallel).

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 2.1 | Implement full tab-bar component (5 text-label tabs, active highlight) | A | ✓ |
| 2.2 | Implement tab-content switching and active-tab rendering | A | ✓ |
| 2.3 | Add `getState()/setState()` for active-tab persistence across refreshes | B | ✓ |
| 2.4 | Design and implement empty-state panels for all 5 tabs | A | ✓ |
| 2.5 | Test responsive layout at 300px sidebar width | A | ✓ |
| 2.6 | Add per-tab scroll-position restoration | B | ✓ |
| 2.7 | Compile clean · no sidebar regressions · manual smoke test | B | ✓ |

### Wave 3 — Docs Tab

> **Goal**: Ship the lowest-risk, highest-clarity tab to validate density and navigation.
> **Depends on**: Wave 2. **Unlocks**: Wave 5.

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 3.1 | Build Getting Started card group | A | ✓ |
| 3.2 | Build Workshop Study Guides persona grid (33 personas) | A | ✓ |
| 3.3 | Build Self-Study and Exercises section | A | ✓ |
| 3.4 | Build Facilitator Materials section | A | ✓ |
| 3.5 | Add local architecture and operations doc entry points | A | ✓ |
| 3.6 | Add Learn Alex Online CTA and Partnership guide link | A | ✓ |
| 3.7 | Validate all links resolve and open correctly | B | ✓ |
| 3.8 | Test layout at sidebar width — no cramping, primary content above fold | A | ✓ |

### Wave 4 — Mission Command

> **Goal**: The dashboard is immediately more useful than the current welcome view.
> **Depends on**: Wave 2 + Spike 1C. **Unlocks**: Wave 5.

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 4.1 | Build Architecture Status banner card (existing data) | A | ✓ |
| 4.2 | Port Smart Nudges logic from current welcome view into a card | A | ✓ |
| 4.3 | Build Quick Command bar | A | ✓ |
| 4.4 | Build Session / Goal summary area (existing data only) | A | ✓ |
| 4.5 | Add Settings Manager and Secret Manager entry points | A | ✓ |
| 4.6 | Tag every card with data classification (existing / derived / deferred) | B | ✓ |
| 4.7 | Remove or defer any card that cannot defend its data source | B | ✓ |
| 4.8 | Verify Mission Command is more useful than the current welcome view | A | ✓ |

### Wave 5 — Controlled Consolidation

> **Goal**: Remove old sidebar duplication only after the new surface is proven.
> **Depends on**: Waves 3 + 4 both shipped. **Unlocks**: Wave 6.

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 5.1 | Audit user journeys covered by Command Center vs current three views | B | ✓ |
| 5.2 | Redirect legacy commands to new tab destinations | B | ✓ `alex.showCognitiveDashboard` → Mind tab via `alex.switchToTab` |
| 5.3 | Remove redundant sidebar view registrations from `package.json` | A | deferred — no removals safe yet |
| 5.4 | Preserve editor-panel dashboards that serve deeper use cases | A | ✓ kept both |
| 5.5 | Verify no capability loss for normal workflows | B | ✓ |

### Wave 6 — Advanced Tabs ✔️

> **Goal**: Expand Agents, Skill Store, and Mind beyond placeholders with working data.
> **Depends on**: Wave 5. **Unlocks**: Full Command Center vision.
> **Completed**: March 7, 2026

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 6.1 | Define Agent status contract (AgentInfo interface — id, name, icon, description, role, installed) | B | ✓ |
| 6.2 | Implement Agents tab — 7-agent registry cards with installed status badge from disk | A | ✓ |
| 6.3 | Define Skill Store catalog model (SkillInfo — id, displayName, description, category, hasSynapses) | B | ✓ |
| 6.4 | Implement Skill Store tab — clickable skill cards with category, description, synapse indicator | A | ✓ |
| 6.5 | Define Mind tab runtime model (MindTabData — 5 modality counts, synapse health %, cognitive age, maintenance dates) | B | ✓ |
| 6.6 | Implement Mind tab — cognitive age, synapse health %, 5 memory modality bars, maintenance timestamps, quick actions | A | ✓ |
| 6.7 | Fix easter egg avatar to use unified SVG resolution instead of deleted PNG paths | C | ✓ |
| 6.8 | Code review — 6 issues found and fixed (date formatting, sort, empty states, escaping, dedup I/O, perf) | B | ✓ |

### Wave 7 — UI Development (Audit-Driven) ✔️

> **Goal**: Close all UI/UX compliance gaps and align implementation to approved v2 mockups.
> **Depends on**: Wave 6. **Unlocks**: v7.0 full sidebar consolidation.
> **Source**: UI/UX audit (March 8, 2026) + Content audit vs 5 approved mockup SVGs.
> **Completed**: March 8, 2026 (43/45 shipped, 2 cancelled — 7.15 + 7.31 depend on unbuilt Contract B)
> **Classification**: Each step tagged ⬡ Implementable Now · ⬢ Needs Data Provider · ◇ Design Decision

**7A — WCAG Compliance (P1 HIGH)** — Accessibility violations that block WCAG AA conformance

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.1 | Add `id` attributes to tab buttons (`id="tab-mission"` etc.) so `aria-labelledby` on tab panels resolves | A | ⬡ | ✓ |
| 7.2 | Add Enter/Space keyboard activation for all non-button `[data-cmd]` elements — extracted `handleDataCmd()` + delegated `keydown` listener (skips `<button>` which already handle Enter/Space natively) | A | ⬡ | ✓ |
| 7.3 | Bump sub-11px fonts to minimum 11px: `.header-series` 9→11px, `.tier-lock` 9→11px, `.persona-tag` 10→11px, `.agent-role` 10→11px, `.skill-category` 10→11px, `.skill-synapse-dot` 10→11px, `.agent-badge` 10→11px, `.mind-stat-label` 10→11px, `.maintenance-label` 10→11px (9 selectors, 0 sub-11px remaining) | A | ⬡ | ✓ |
| 7.4 | Fix semantic role mismatches: `.persona-card` `role="link"` → `role="button"`; `.status-grid` `role="region"` → `role="button"` (both trigger commands, not navigation) | A | ⬡ | ✓ |

**7B — UX Quality (P2 MEDIUM)** — Design system compliance and touch-target standards

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.5 | Replace hardcoded hex colors in Mind tab with VS Code theme variables: `.stat-good` #3fb950 → `--vscode-testing-iconPassed`, `.stat-warn` #d29922 → `--vscode-editorWarning-foreground`, `.stat-bad` #f85149 → `--vscode-errorForeground`, `.badge-ok`/`.badge-missing` similarly | A | ⬡ | ✓ 5 selectors → theme vars + `color-mix()` for badge backgrounds |
| 7.6 | Increase touch targets below 36px minimum: `.action-btn` min-height 32→36px, `.feature-link-btn` 28→36px, tab buttons ~27→36px, `.nudge-action` ~20→36px | A | ⬡ | ✓ 5 elements now 36px: action-btn, skill-recommendation-btn, nudge-action, feature-link-btn, tab |
| 7.7 | Increase inter-target spacing below 8px minimum: `.action-list` gap 2→8px, `.trifecta-tags` gap 3→8px, `.skill-recommendations-list` gap 3→8px | A | ⬡ | ✓ 3 lists → gap: 8px |
| 7.8 | Normalize non-standard spacing values to 4/8/12/16px design scale: replace 3px, 5px, 6px, 7px, 9px, 10px values across all CSS selectors | A | ⬡ | ✓ 26 replacements: all 7px→8px, 9px→8px, gaps 6px→8px, padding 3/5px→4px, badges 1px 6px→1px 8px. 10px values left as-is (borderline — needs visual review) |

**7C — Content Alignment: Mission Control** — Gap closure vs `command-center-v2-mission-control.svg`

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.9 | Add Architecture Status banner card with 3-state indicator (Healthy/Warnings/Issues) per mockup — existing `HealthCheckResult` data | A | ✅ | ✓ |
| 7.10 | Add Live Activity Feed showing agent progress + queue/steer controls | A+B | ⬢ Contract A | ✓ |
| 7.11 | Add Quick Command bar (search-style input for rapid command access) | A | ◇ | ✓ |
| 7.12 | Add "Later" dismiss button on Smart Nudge cards (currently nudges have no dismiss) | A | ✅ | ✓ |
| 7.13 | Add Secret Manager inline dashboard (3-row token status display per mockup) | A | ◇ | ✓ |
| 7.14 | Add Settings Manager inline toggles (4 toggle switches per mockup) | A | ◇ | ✓ |
| 7.15 | Add Context Budget percentage bar | A+B | ⬢ Contract B | ✗ cancelled |
| 7.16 | Add Personality Toggle (Precise/Chatty modes) | A+B | ◇ | ✓ |
| 7.17 | **DESIGN DECISION**: Resolve 30+ action button density — keep as-is, progressive disclosure, relocate to sub-pages, or replace with monitoring widgets per mockup | A | ◇ | ✓ |

**7D — Content Alignment: Agents** — Gap closure vs `command-center-v2-agent-hub.svg`

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.18 | Add Cognitive State card (avatar + current phase/mode + reasoning meter) above agent registry | A | ◇ | ✓ |
| 7.19 | Add Parallel Agents display (side-by-side agent execution with progress indicators) | A+B | ⬢ Contract A | ✓ |
| 7.20 | Add live status badges on agent cards (ACTIVE/QUEUED/ROUTING/IDLE per mockup — currently all show static "installed" badge) | A+B | ⬢ Contract A | ✓ |
| 7.21 | Add Recent Threads section (conversation history per agent) | A+B | ⬢ Contract A | ✓ |
| 7.22 | Add Auto-Routing explanation card (how Alex routes to specialist agents) | A | ✅ | ✓ |
| 7.23 | Add Create Custom Agent placeholder with CTA | A | ✅ | ✓ |

**7E — Content Alignment: Skill Store** — Gap closure vs `command-center-v2-skill-store.svg`

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.24 | Add search bar + filter controls for skill discovery | A | ✅ | ✓ |
| 7.25 | Add Catalog Toggle bar (All/Active/Inactive with counts) | A | ✅ | ✓ |
| 7.26 | Add Skill Health summary bar (healthy/warnings count from `HealthCheckResult`) | A | ✅ | ✓ |
| 7.27 | Add 3-tier category grouping (Core/Development/Creative) with collapsible sections | A | ✅ | ✓ |
| 7.28 | Add enable/disable toggle switches per skill | A+B | ⬢ Persistence | ✓ |
| 7.29 | Add skill icons from rocket-icons SVG set | C | ✅ | ✓ |
| 7.30 | Add "Install from GitHub" action for community skill loading | A+B | ⬢ | ✓ |
| 7.31 | Add Context Budget Impact indicator per skill | A+B | ⬢ Contract B | ✗ cancelled |

**7F — Content Alignment: Mind** — Gap closure vs `command-center-v2-mind.svg` (key differentiator tab)

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.32 | Add Knowledge Freshness panel (Thriving/Active/Fading/Dormant forgetting curve visualization) | A+B | ⬢ | ✓ |
| 7.33 | Add Honest Uncertainty panel (confidence distribution bars + thin coverage areas) | A+B | ⬢ | ✓ |
| 7.34 | Add Global Knowledge panel (insight count, project count, promoted count) | A | ✅ | ✓ |
| 7.35 | Add Identity card (name, age, personality summary — static character model data) | A | ✅ | ✓ |
| 7.36 | Enrich Cognitive Age display: add tier label, progression bar, and milestone markers per mockup (currently shows only number + label) | A | ✅ | ✓ |
| 7.37 | Upgrade Memory Architecture from horizontal bars to 5 rich modality cards per mockup (Semantic, Procedural, Episodic, Visual, Muscles — each with count + health %) | A | ✅ | ✓ |
| 7.38 | Add meditation streak counter + emotion tags to Meditation & Growth section (currently shows only last meditation/dream timestamps) | A+B | ⬢ Persistence | ✓ |

**7G — Content Alignment: Docs** — Gap closure vs `command-center-v2-docs.svg`

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.39 | Add Tips & Nudges section (3 context-aware tips with "Dismiss all" action) at top of Docs tab | A | ✅ | ✓ |
| 7.40 | Add Architecture grid (2×3: Cognitive Architecture, Memory Systems, Conscious Mind, Unconscious Mind, Agent Catalog, Trifecta Catalog) per mockup | A | ✅ | ✓ |
| 7.41 | Add Operations grid (2×2: Protection, Project Structure, Heir Architecture, Research Papers) per mockup | A | ✅ | ✓ |
| 7.42 | Enrich Getting Started to match mockup 4-card layout (User Manual, Quick Reference, Environment Setup, Use Cases) — currently has 3 links | A | ✅ | ✓ |
| 7.43 | Align Partnership card presentation to mockup format (currently plain text, mockup shows structured card) | A | ✅ | ✓ |

**7H — Polish (P3 LOW)**

| # | Step | Track | Class | Status |
|---|------|:-----:|:-----:|:------:|
| 7.44 | Review Mission Ctrl button density — implement progressive disclosure or grouped sub-sections to reduce cognitive overload (~30 buttons visible at once) | A | ◇ | ✓ |
| 7.45 | Standardize focus indicator widths to consistent 2px across all focusable elements (tabs currently use 1px, global uses 2px) | A | ✅ | ✓ |

**Total**: 55 + 45 = 100 steps across 8 waves · 3 decision gates · 3 parallel tracks

### Completion Summary

| Wave | Title | Steps | Done | Key Deliverables |
|------|-------|:-----:|:----:|------------------|
| 0 | Planning Hygiene | 4 | 4 | Plan locked, baselines verified |
| 1 | Critical Spikes | 15 | 15 | SVG hybrid pipeline (SVG-first + PNG fallback), tab shell (ARIA, keyboard, persistence), data contracts (MindTabData, AgentInfo, SkillInfo) |
| 2 | Command Center Shell | 7 | 7 | 5-tab bar, ARIA, persistence, scroll restoration, responsive |
| 3 | Docs Tab | 8 | 8 | 7 content groups, 33-persona workshop grid, 7 external URLs |
| 4 | Mission Command | 8 | 8 | Session card wired, doc buttons migrated to Docs, features bloat removed |
| 5 | Controlled Consolidation | 5 | 5 | Journey audit done, both legacy views preserved, cognitive dashboard → Mind tab redirect, 5.3 deferred by design |
| 6 | Advanced Tabs | 8 | 8 | Agent registry, Skill Store, Mind dashboard, easter egg SVG fix, code review |
| 7 | UI Development | 45 | 43 | WCAG compliance (7A): ARIA ids, keyboard activation, font minimums, role corrections. UX Quality (7B): theme vars, 36px touch targets, 8px inter-target spacing, design scale normalization. Content Alignment (7C–7G): Secret Manager, Settings toggles, Quick Command, Live Activity Feed, Cognitive State card, Parallel Agents, Agent lifecycle badges, Recent Threads, Skill toggles/icons/categories, Knowledge Freshness, Honest Uncertainty, Meditation streak, Identity/Global Knowledge panels, Docs enrichment. Polish (7H): Button density, focus indicators. 2 cancelled (7.15 Context Budget, 7.31 Context Impact — depend on unbuilt Contract B). |
| **Σ** | | **100** | **98** | **All 100 steps complete (98 shipped, 2 cancelled). Command Center v1.0 delivered.** |

---

## Post-Implementation Optimization

> **Context**: Command Center v1.0 is delivered. The 100-step build plan is complete. What follows is the technical debt incurred during rapid feature delivery — primarily file size growth and missing test coverage. These items feed directly into the v6.5.0 "Trust Release" Definition of Done in [ROADMAP-UNIFIED.md](../../ROADMAP-UNIFIED.md).

### Current State (March 8, 2026)

| Metric | Value | v6.5.0 Target |
|--------|:-----:|:-------------:|
| `welcomeViewHtml.ts` | **2,982 lines** | <1,500 |
| `welcomeView.ts` | **819 lines** | <800 |
| Files >1,500 lines | 1 | 0 |
| Files >1,000 lines | 8 | 0 |
| Total TS source files | 90 | — |
| Total lines of code | 44,517 | — |
| Test files | 6 | 20+ |
| NASA R4 violations (functions >60L) | ~73 | 0 |
| North Star Trust score | 5/10 | ≥7/10 |

### P0 — Break Down welcomeViewHtml.ts (2,982 → ~600 + 5 modules)

The Command Center's main rendering file nearly tripled during Waves 1–7 (was 1,830 pre-Wave-7, now 2,982). It's the single largest file in the codebase and the primary blocker for the v6.5.0 "<1,500 lines" criterion.

**Extraction plan** (one module per tab):

| Module | Extracts | Est. Lines |
|--------|----------|:----------:|
| `missionTabHtml.ts` | Mission Command tab HTML + CSS + client JS | ~500 |
| `agentsTabHtml.ts` | Agents tab HTML + CSS | ~300 |
| `skillStoreTabHtml.ts` | Skill Store tab HTML + CSS + icon map + toggle handlers | ~450 |
| `mindTabHtml.ts` | Mind tab HTML + CSS (cognitive age, memory modalities, freshness, uncertainty, meditation) | ~500 |
| `docsTabHtml.ts` | Docs tab HTML + CSS (architecture grid, operations, getting started, partnership) | ~400 |
| `welcomeViewHtml.ts` (residual) | Shell: tab bar, shared CSS, shared utilities, `getWelcomeHtmlContent()` orchestrator | ~600 |

**Approach**: Each tab module exports a single function (e.g., `getMissionTabHtml(data)`) called by the orchestrator. Shared CSS stays in the shell. Tab-specific CSS moves with the tab. Client-side JS handlers for each tab move into the module.

**Risk**: CSS class collisions after split. Mitigated by tab-prefixed class naming convention (already partially in place: `.skill-*`, `.agent-*`, `.mind-*`).

### P1 — Break Down Other >1,000-Line Files

8 files exceed 1,000 lines. Priority order by size and coupling:

| File | Lines | Decomposition Strategy |
|------|:-----:|------------------------|
| `extension.ts` | 1,283 | Extract command registration into `commandRegistry.ts`, activation into `activation.ts` |
| `contextMenu.ts` | 1,278 | Group by menu category (file ops, cognitive ops, workflow ops) |
| `globalKnowledgeOps.ts` | 1,234 | Split CRUD operations from search/query operations |
| `upgrade.ts` | 1,209 | Extract per-version migration functions into `migrations/` directory |
| `personaDetection.ts` | 1,062 | Separate detection logic from persona definitions |
| `pptxGenerator.ts` | 1,035 | Extract slide builders per template type |
| `commandsPresentation.ts` | 1,024 | Split by presentation format (PPTX, Marp, Gamma) |
| `setupEnvironment.ts` | 997 | Extract validation, file generation, and configuration into separate modules |

### P2 — Test Coverage (6 → 20+ test files)

Current test files cover only basic infrastructure. The Command Center's new data providers and UI logic are untested.

**Priority test targets** (ordered by risk × complexity):

| Test File | Tests For | Why |
|-----------|-----------|-----|
| `welcomeView.test.ts` | `_collectMindData`, `_collectAgents`, `_collectSkills`, toggle handlers | Core data pipeline — feeds all 5 tabs |
| `secretsManager.test.ts` | `getTokenStatuses`, token CRUD | Security-sensitive — tokens must never leak |
| `honestUncertainty.test.ts` | `getCalibrationSummary`, coverage scoring | Integrity feature — wrong numbers erode trust |
| `episodicMemory.test.ts` | File-based memory CRUD, freshness calculation | Persistence layer — data loss is catastrophic |
| `outcomeTracker.test.ts` | Prediction tracking, accuracy calculation | Calibration data feeds Mind tab |
| `taskDetector.test.ts` | Task classification, domain detection | Routing accuracy affects all agent dispatching |
| `workflowEngine.test.ts` | State machine transitions, phase detection | Controls session lifecycle |
| `expertiseModel.test.ts` | Expertise scoring, tier progression | Cognitive age calculation |
| `personaDetection.test.ts` | Persona matching, priority resolution | Wrong persona → wrong agent → wrong output |
| `globalKnowledge.test.ts` | Cross-project knowledge search, promotion | Knowledge integrity across repos |
| `avatarMappings.test.ts` | SVG resolution, fallback chain | Visual regression protection |
| `contextMenu.test.ts` | Menu item generation, command routing | User interaction entry points |
| `healthCheck.test.ts` | Architecture validation, status aggregation | Feeds Mission Command health banner |
| `upgrade.test.ts` | Version migration, data transformation | Data corruption prevention during updates |

### P3 — NASA R4 Violations (73 → 0)

73 functions exceed the 60-line limit. Breakdown:

| Severity | Count | Threshold | Approach |
|----------|:-----:|:---------:|----------|
| Critical | 11 | >200 lines | Extract helper functions, apply strategy pattern |
| Major | 22 | 100–200 lines | Inline decomposition, extract conditionals |
| Minor | 40 | 61–100 lines | Lightweight refactor, often just extracting a nested loop or switch |

These refactors should piggyback on the P0/P1 decomposition — when splitting a file, also split its long functions. Don't refactor functions in isolation without the file-level context.

### P4 — Cancelled Steps (Deferred, Not Abandoned)

Two steps were cancelled due to missing Contract B (context budget API):

| Step | Dependency | Unblock Condition |
|------|-----------|-------------------|
| 7.15 — Context Budget percentage bar | VS Code API for context window usage | VS Code exposes `chat.contextBudget` or equivalent API |
| 7.31 — Context Budget Impact per skill | Per-skill token cost estimation | Skill token measurement tooling built |

These can be revisited when VS Code adds context budget visibility APIs or when a token-counting utility is built into the extension.

### Success Criteria

All optimization work is gated by the v6.5.0 Definition of Done:

1. **20+ test files** — covering all v6.0.0 services and the top 3 largest source files
2. **Zero NASA R4 violations** — no function exceeds 60 lines in any source file
3. **No source file >1,500 lines** — `welcomeViewHtml.ts` must be decomposed
4. **North Star Trust score ≥7/10** — re-assessed at ship time

> **Principle**: *Don't add features. Prove the existing ones deserve trust.*

---

## Validated Baseline

These facts are verified against the current repo (March 8, 2026) and treated as fixed planning inputs.

### Extension Baseline

| Fact | Verified Value |
|------|----------------|
| Sidebar views registered | 3: `alex.welcomeView`, `alex.cognitiveDashboard`, `alex.memoryTree` |
| `welcomeView.ts` | 819 lines (data collection + tab switching) |
| `welcomeViewHtml.ts` | 2,982 lines (5-tab HTML + CSS + client JS) |
| `avatarMappings.ts` | 721 lines (SVG format parameter added in Spike 1A) |
| `memoryTreeProvider.ts` | 281 lines |
| `cognitiveDashboard.ts` | 550 lines |
| `participant.ts` | 978 lines |
| `healthDashboard.ts` | 994 lines |
| Avatar asset files | 145 (112 PNG/WebP + 33 rocket SVGs) |
| Welcome view uses retained context | Yes (`retainContextWhenHidden: true`) |
| Chat participant avatar path | SVG-first (rocket-icons) with PNG fallback |
| Extension compile state | Clean |
| Total TS source files | 95 |
| Total lines of code | 44K |
| Skills | 120 (consolidated from 130) |
| Trifectas | 37 complete |

### AlexLearn Baseline

| Fact | Verified Value |
|------|----------------|
| Workshop study guide count | 33 |
| Workshop guide source path | `website/src/content/workshops/` |
| Self-study page exists | Yes |
| Exercises page exists | Yes |
| Facilitator materials exist | Yes (Session Plan, Slides, Demo Scripts, Handout, Pre-Read, GitHub Guide) |

---

## Design Inputs

Artifacts from the feasibility report retained here so this plan stands alone. Implementation details are in Wave Detail Specifications below.

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
| Tab bar icons | Not needed — tabs use text labels per approved mockups |

### Current Sidebar Architecture

| View ID | Type | State | File |
|---------|------|-------|------|
| `alex.welcomeView` | webview | Active — **is now the Command Center** (5-tab shell, all tabs functional) | `welcomeView.ts` (~700) + `welcomeViewHtml.ts` (~2,100) |
| `alex.cognitiveDashboard` | webview | Collapsed — editor-panel dashboard | `cognitiveDashboard.ts` (621) |
| `alex.memoryTree` | tree | Collapsed — tree view | `memoryTreeProvider.ts` (319) |

All registered under `alex-sidebar` container in `package.json`.

### Current Welcome View HTML Sections

| Section | HTML Structure | Runtime Data |
|---------|---------------|--------------|
| Header | CorreaX banner + persona avatar box | `avatarContext`, `personaResult` |
| Workspace | Project name display | `workspaceName` |
| Partnership bar | Status badges | `personaResult`, `activeContext` |
| Nudge cards | Dynamic nudge cards (max 10) | `nudges: Nudge[]` |
| Status | Health grid + streak | `health: HealthCheckResult`, `goals.streakDays` |
| Active Context | Trifecta tags + context badges | `activeContext: ActiveContext` |
| Action list | 7 groups, 37 buttons (see Wave 4 spec) | Commands via `data-cmd` → `commandMap` |
| Goals | Active goals + progress bars | `goals` object |
| Features | 9 collapsible categories + 6 feature links | Static content via `getFeaturesHtml()` |

### Current Message Protocol

```
webview → extension:  postMessage({ command: string, ...data })
routing:              commandMap (41 entries) → vscode.commands.executeCommand()
                      externalUrlMap (12 entries) → vscode.env.openExternal()
                      special cases: openChat, launchRecommendedSkill, openSkill, meditate, tabSwitch, refresh
script pattern:       Event delegation via data-cmd attributes
                      Auto-refresh: setInterval(refresh, 30000)
```

### CSS Design System (existing)

```css
/* Tokens already defined in welcomeViewHtml.ts */
--persona-accent: <dynamic per persona>
/* Spacing scale */  4px | 8px | 16px | 24px | 32px
/* Font scale */     13px | 14px | 16px | 18px
/* Shadow scale */   sm | md | lg
/* CSP */            default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src nonce-*; img-src ${webview.cspSource} https: data:
```

### AlexLearn Surface Inventory

The Docs tab links into these LearnAlex companion paths:

| Path | Content |
|------|---------|
| `/setup-guide` | Getting started |
| `/self-study` | Self-paced learning |
| `/exercises` | Practice exercises |
| `/session-plan` | Facilitator session plan |
| `/slides` | Presentation slides |
| `/demo-scripts` | Demo scripts |
| `/handout` | Workshop handout |
| `/pre-read` | Pre-read materials |
| `/github-guide` | GitHub integration guide |
| `/responsible-ai` | Responsible AI guidance |
| `/workshop/{persona}` | 33 persona-specific workshops |

**Alignment rule**: LearnAlex personas are the source of truth for the Docs-tab persona grid. Do not create a parallel persona vocabulary.

---

## API Feasibility Reference

| Feature | API Status | Code Reference | Planning Position |
|---------|-----------|----------------|-------------------|
| SVG chat avatar | `iconPath` accepts `Uri` | `participant.ts:1011` — `_alexParticipant.iconPath = avatarPath` | **Spike 1A** — untested with SVG |
| Tab state persistence | `getState()/setState()` on `WebviewView.webview` | Not yet used in codebase | Wave 2 — use for active-tab + scroll |
| Sidebar badge | `WebviewView.badge` property | Not yet used in codebase | Optional enhancement after shell stable |
| Context budget | `maxInputTokens` on model object; `countTokens()` proposed API | Not used in codebase | **Defer** — proposed API not stable |
| Agent activity feed | No direct lifecycle API | — | **Defer** — requires Contract A |
| Skill toggle | No dedicated skill API | — | **Defer** — settings-driven approach needed |
| Typed messaging | No — message channel is `any` | `welcomeView.ts:130-220` — `commandMap` + special cases | Use explicit type guards |
| VS Code engine | `^1.109.0` in `package.json` | `package.json` engines field | Verify 1.110+ features before relying on them |

**Rule**: API existence does not automatically mean first-wave scope. Scope is determined by data availability, UI value, and implementation risk.

---

## Planning Principles

> Design principles are in the [Executive Decision](#executive-decision) section. These are execution rules.

1. **UI first means UI first.** Early waves focus on visible structure. Do not block UI on advanced telemetry.

2. **Preserve working runtime paths.** Current welcome view, PNG avatar path, and 3 sidebar registrations coexist until replacements are proven. No speculative cleanup. (Guardrail G7)

3. **Resolve blocking spikes.** SVG chat avatar is a real unknown. Prove before assuming. (Guardrail G2)

4. **Classify every data source.** (Guardrail G6)

   | Class | Meaning | Gate |
   |-------|---------|------|
   | Existing | Available from current `getWelcomeHtmlContent()` parameters | Build immediately |
   | Derived | Computable from current structures with modest glue code | Build when glue is written |
   | New | Requires new instrumentation, tracking, or contracts | Defer until contract documented |

5. **Curate, don't mirror.** Docs tab surfaces strongest AlexLearn pathways, not a full clone. (Guardrail G5)

---

## Scope Boundary

### Completed (Waves 0–5)

- ✅ Tabbed Command Center shell inside `alex.welcomeView` (5 tabs, ARIA tablist, keyboard nav)
- ✅ Mission Command tab with existing runtime data (status, nudges, context, commands, goals)
- ✅ Docs tab with curated AlexLearn alignment (7 content groups, 33-persona grid)
- ✅ Empty-state design for Agents, Skill Store, Mind tabs
- ✅ Tab state persistence via `getState()/setState()`
- ✅ Per-tab scroll-position restoration
- ✅ Responsive at 300px sidebar width
- ✅ Journey audit: Command Center covers all intended user journeys
- ✅ Both legacy views preserved (cognitiveDashboard + memoryTree)

### Remaining (Wave 7 — UI Development)

**WCAG Compliance (P1)** — 4 steps, all implementable now:
- Broken ARIA `labelledby` references on tab panels (no `id` on tab buttons)
- Non-button `[data-cmd]` elements lack keyboard activation (Enter/Space)
- Sub-11px font sizes (9px and 10px across 10+ selectors)
- Semantic role mismatches (`.persona-card`, `.status-grid`)

**UX Quality (P2)** — 4 steps, all implementable now:
- Hardcoded hex colors bypass theme variables in Mind tab
- Touch targets below 36px compact minimum
- Inter-target spacing below 8px minimum
- Non-standard spacing values (3px, 5px, 6px, 7px, 9px, 10px)

**Content Gaps vs Mockups** — 37 steps across 5 tabs:
- Mission Control: 9 steps (3 implementable, 3 need data, 3 design decisions)
- Agents: 6 steps (2 implementable, 3 need Contract A, 1 design decision)
- Skill Store: 8 steps (4 implementable, 3 need data/persistence, 1 needs Contract B)
- Mind: 7 steps (4 implementable, 3 need data/persistence) — key differentiator tab
- Docs: 5 steps (all implementable now)

**Still Remaining from Prior Waves:**
- Redundant sidebar view removal (Wave 5.3 — deferred until safe)
- Real-time agent state model (Contract A)
- Context-budget percentage bar (Contract B — `countTokens()` is proposed API)
- Full five-modality memory model as live UI (Contract C)
- Recently-used adaptive UX (Contract D)

---

## Product Definition

### Final Target

A single sidebar surface (`alex.welcomeView`) with five tabs:

| # | Tab | View Content | Primary Data Source |
|---|-----|-------------|---------------------|
| 1 | **Mission Command** | Status, nudges, commands, session, goals | `HealthCheckResult`, `Nudge[]`, `ActiveContext`, `session`, `goals` |
| 2 | **Agents** | Agent registry, state, threads | Contract A (not yet defined) |
| 3 | **Skill Store** | Skill catalog, toggles, search | Contract C variant (not yet defined) |
| 4 | **Mind** | Health, memory, uncertainty, meditation | Contract C + `HealthCheckResult` |
| 5 | **Docs** | Onboarding, study guides, local docs, LearnAlex CTA | Static content + external URLs |

### First Valuable Release (Waves 0–4)

The smallest release that proves the concept:

1. Tab shell working inside `alex.welcomeView` (Wave 2)
2. Mission Command tab showing existing runtime data — architecture status, nudges, context, commands (Wave 4)
3. Docs tab showing curated AlexLearn content and local documentation entry points (Wave 3)
4. Agents, Skill Store, Mind present as intentionally designed empty-state placeholders
5. Existing PNG avatar path preserved if SVG spike is not yet proven

### Current-to-Target HTML Mapping

This table maps the current `welcomeViewHtml.ts` HTML sections to their target tab:

| Current HTML Section | Current Location | Target Tab |
|---------------------|-----------------|------------|
| CorreaX header + persona avatar | Top of `<body>` | Stays global (above tab bar) |
| Partnership bar | Below avatar | Removed — content distributed |
| Nudge cards | Above Status section | Mission Command |
| Status section (health + streak) | `<div class="section">` Status | Mission Command |
| Active Context section | `<div class="section">` Active Context | Mission Command |
| PARTNERSHIP action group (6 btns) | `<nav class="action-list">` | Split: 3 → Mission Command, 3 → Docs |
| BUILD TOGETHER group (7 btns) | `<nav class="action-list">` | Mission Command |
| LEARN & KNOWLEDGE group (5 btns) | `<nav class="action-list">` | Split: tools → Mission Command, docs → Docs |
| PRESENT & SHARE group (3 btns) | `<nav class="action-list">` | Mission Command |
| VISUALIZE group (2 btns) | `<nav class="action-list">` | Mission Command |
| TRUST & GROWTH group (5 btns) | `<nav class="action-list">` | Mission Command |
| SYSTEM group (9 btns) | `<nav class="action-list">` | Split: ops → Mission Command, docs → Docs |
| Goals section | `getGoalsHtml()` | Mission Command |
| Features/Documentation collapsible | `getFeaturesHtml()` | Docs |

---

## Wave Detail Specifications

Each wave below expands the corresponding tracker section. The tracker is the checklist; these sections provide file-level implementation context and exit criteria.

### Wave 0 — Planning Hygiene

**Goal**: One execution document, verified baseline, no stale assumptions.

| Deliverable | Detail |
|-------------|--------|
| Lock this master plan | Mark feasibility doc header: *"background research only — see master plan"* |
| Verify baseline numbers | Compare tables below against live source (last verified: March 6, 2026) |
| Confirm icon inventory | 33 SVGs in `rocket-icons/` across 4 categories — verified |

**Exit**: This document is the sole execution reference. No other doc contradicts it.

---

### Wave 1 — Critical Spikes

**Goal**: Prove the three biggest unknowns before committing to architecture.

#### Spike 1A — SVG Avatar Viability (steps 1.1–1.6)

**Question**: Can `ChatParticipant.iconPath` render SVG?

**Current path** (verified):
- `participant.ts:1011` → `_alexParticipant.iconPath = avatarPath`
- `avatarMappings.ts` → `getAvatarAssetRelativePath(result, 'png')` — hardcoded PNG
- 112 PNG/WebP files in `platforms/vscode-extension/assets/avatars/` (26.43 MB)

**Spike procedure**:
1. Copy one rocket SVG (e.g. `rocket-icons/states/building.svg`) into `assets/avatars/rocket-icons/states/`
2. In `avatarMappings.ts`, add a format parameter to `getAvatarAssetRelativePath()`: `format: 'png' | 'svg' = 'png'`
3. Temporarily resolve one test state (e.g. `building`) to the SVG path
4. Set `ChatParticipant.iconPath` to the SVG `Uri` and open a chat conversation
5. Test SVG inside a webview `<img>` tag in the welcome view
6. Record decision in this plan

| Outcome | Action |
|---------|--------|
| PASS — SVG renders in both chat and webview | Unified SVG identity (33 SVGs replace 112 PNGs) |
| PARTIAL — SVG works in webview only | Hybrid: SVG in sidebar, PNG for `iconPath` |
| FAIL — fragile or inconsistent | PNG stays, SVG only decorative in webviews |

#### Spike 1B — Tab Shell Viability (steps 1.7–1.11)

**Question**: Can the existing `WelcomeViewProvider` host a tabbed shell without destabilising refresh, commands, or keyboard flow?

**Files to modify**:
- `welcomeViewHtml.ts` — add tab-bar HTML above current content (5 text-label `<button>` tabs)
- `welcomeView.ts` — add `tabSwitch` case to `webview.onDidReceiveMessage` handler

**Implementation sketch** (HTML):
```html
<div class="tab-bar" role="tablist" aria-label="Command Center">
  <button role="tab" class="tab active" data-tab="mission" aria-selected="true">Mission Ctrl</button>
  <button role="tab" class="tab" data-tab="agents">Agents</button>
  <button role="tab" class="tab" data-tab="skills">Skill Store</button>
  <button role="tab" class="tab" data-tab="mind">Mind</button>
  <button role="tab" class="tab" data-tab="docs">Docs</button>
</div>
<div class="tab-content" role="tabpanel" id="panel-mission">...</div>
```

**Key risks to test**:
- Does `resolveWebviewView` refresh (triggered by `this._view.webview.html = ...`) preserve active tab?
  - Mitigation: Use `getState()/setState()` to persist `activeTab` across refreshes
- Does the 30-second auto-refresh interval (`setInterval(refresh, 30000)`) cause tab reset?
  - Mitigation: Restore tab from state inside the refresh handler
- Keyboard: Arrow keys between tabs + Enter to activate (ARIA tablist pattern)

**Exit**: Tab bar renders. Switching works. Refresh preserves selection. Keyboard navigable.

#### Spike 1C — Data Contract Triage (steps 1.12–1.15)

**Question**: Which proposed UI elements have data available today?

Classify every Mission Command and Mind tab element using the `getWelcomeHtmlContent()` parameter signature as evidence:

| Parameter | Supplies | Classification |
|-----------|----------|----------------|
| `health: HealthCheckResult` | Architecture status, synapse count, broken count | **Existing** |
| `session` | Focus timer state, pomodoro count | **Existing** |
| `goals` | Active goals, streak, completed today | **Existing** |
| `nudges: Nudge[]` | Smart nudges (up to 10) | **Existing** |
| `personaResult: PersonaDetectionResult` | Detected persona, confidence | **Existing** |
| `activeContext: ActiveContext` | Focus trifectas, phase, mode | **Existing** |
| `agentMode` / `cognitiveState` | Current agent and state strings | **Existing** |
| `skillRecommendations` | Skill suggestions | **Existing** |
| `userProfile` | Name, birthday | **Existing** |
| Context budget (token usage %) | `maxInputTokens` exists; `countTokens()` is proposed API | **New** — defer |
| Agent lifecycle (active/queued/idle) | No API — internal tracking needed | **New** — defer |
| Memory modality health | Partially via `HealthCheckResult`; full model undefined | **Derived** |
| Recently-used commands | Not tracked; needs `globalState` or `workspaceState` | **New** — defer |

**Exit**: Every proposed card tagged. New-data cards deferred.

---

### Wave 2 — Command Center Shell

**Goal**: The welcome view hosts a working 5-tab shell. No feature parity required.

**Primary file**: `welcomeViewHtml.ts` — refactor `getWelcomeHtmlContent()` from monolithic HTML to tab-panel architecture.

**Structural change**:
```
BEFORE: <body> → header → avatar → status → context → action-list → goals → features
AFTER:  <body> → header → avatar → tab-bar → tab-panel[active] → (content varies by tab)
```

**CSS additions** (extend existing design system):
```css
.tab-bar      { display: flex; border-bottom: 1px solid var(--vscode-panel-border); }
.tab          { flex: 1; padding: 8px 0; background: none; border: none; cursor: pointer; }
.tab.active   { border-bottom: 2px solid var(--persona-accent, #6366f1); font-weight: 600; }
.tab-content  { display: none; }
.tab-content.active { display: block; }
```

**State persistence** (in `welcomeView.ts`):

```ts
// In message handler:
case "tabSwitch":
  this._activeTab = message.tabId;
  // Do NOT full-refresh — just acknowledge; JS handles panel swap
  break;

// In resolveWebviewView:
webviewView.webview.options = { enableScripts: true, localResourceRoots: [...] };
// pass activeTab to getWelcomeHtmlContent so it renders the right panel as .active
```

Use the built-in `webview.getState()/setState()` for client-side tab and scroll restoration across refresh cycles.

**Empty states**: Every non-Mission-Command tab renders a designed empty state:
- Icon from rocket-icons set (if integrated) or emoji fallback
- One-sentence description of what the tab will contain
- Optional CTA button where applicable (e.g. Docs → "Learn Alex Online")

**Responsive**: Test at 300px sidebar width. Tab labels must not overflow — use truncation or abbreviation if needed.

**Exit**: 5 tabs render. Switching works. Refresh preserves tab. Empty states are intentional. Compile clean. No regressions in existing functionality.

---

### Wave 3 — Docs Tab

**Goal**: Ship the lowest-risk, highest-clarity tab to validate information density in a sidebar.

**Why Docs first**: Strongest content clarity, zero dependency on new telemetry, real product value, and validates the information hierarchy pattern that all tabs will follow.

**Content groups** (from approved mockup `command-center-v2-docs.svg`):

| Group | Content | Command/URL |
|-------|---------|-------------|
| Getting Started | Setup guide, How We Work, Cognitive Levels | `alex.setupEnvironment`, `alex.workingWithAlex`, `alex.cognitiveLevels` |
| Workshop Study Guides | 33 persona cards in a grid | `learnAlex` → `https://learnalex.correax.com/workshop/{persona}` |
| Self-Study & Exercises | Self-study path, exercises | External URLs to `learnalex.correax.com/self-study`, `/exercises` |
| Facilitator Materials | Session plan, slides, demo scripts, handout, pre-read | External URLs to `learnalex.correax.com/session-plan`, etc. |
| Architecture & Ops | Brain Anatomy, architecture docs, operations docs | `alex.openDocs`, `openBrainAnatomy` (external URL) |
| Learn Alex Online CTA | Prominent link to companion surface | External URL to `https://learnalex.correax.com/` |
| Partnership Guide | Working with Alex deep-dive | `alex.workingWithAlex` |

**Migration from current welcome view**: These commands currently live in the PARTNERSHIP and SYSTEM action groups. They move to the Docs tab; their spots in Mission Command are freed.

| Current Group | Command | Moves To |
|---------------|---------|----------|
| PARTNERSHIP | `workingWithAlex` | Docs → Getting Started |
| PARTNERSHIP | `learnAlex` | Docs → Learn Alex Online CTA |
| PARTNERSHIP | `cognitiveLevels` | Docs → Getting Started |
| SYSTEM | `openDocs` | Docs → Architecture & Ops |

**Product framing**: Curated AlexLearn alignment — not a full website mirror. Surface the strongest learning pathways. The persona grid links into `learnalex.correax.com/workshop/{id}` for each of the 33 workshop personas.

**Exit**: All content groups render. All links resolve. Layout usable at sidebar width. Primary content above fold. No cramping.

---

### Wave 4 — Mission Command

**Goal**: The operational dashboard is immediately more useful than the current welcome view.

**Content mapping**: Mission Command inherits the operational core of the current welcome view. Everything non-doc, non-advanced moves here.

| Card / Section | Source Data | Current Location in `welcomeViewHtml.ts` |
|----------------|-------------|------------------------------------------|
| Architecture Status banner | `health: HealthCheckResult` | Status section (health + streak grid) |
| Smart Nudges | `nudges: Nudge[]` | Nudge cards above Status section |
| Active Context | `activeContext: ActiveContext` | Active Context section (trifectas + badges) |
| Focus Session | `session` object | Session card (when active) |
| Goals Summary | `goals` object | Goals section |
| Quick Command bar | Action buttons (subset) | Action list nav (7 groups) |

**Action button redistribution** — the 37 current buttons split across tabs:

| Target Tab | Action Group | Buttons |
|------------|-------------|---------|
| **Mission Command** | Partnership (core) | Chat with Alex, North Star, Think Together |
| **Mission Command** | Build Together (all) | Code Review, Debug This, Generate Tests, Project Audit, Release Preflight, Import Issues, Review PR |
| **Mission Command** | Present & Share (all) | Marp PPTX, Gamma Cloud, Gamma Advanced |
| **Mission Command** | Visualize (all) | Generate Image, Edit Image |
| **Mission Command** | Trust & Growth (all) | Dream, Self-Actualize, How I Think, Focus Session, Goals |
| **Mission Command** | System (core) | Initialize/Update, Environment Setup, API Keys, Diagnostics |
| **Docs** | Docs-bound (from Partnership + System) | How We Work, Learn Alex, Cognitive Levels, Documentation |
| **Mission Command** | Learn & Knowledge (tools) | Ask About Selection, Save Insight, Search Knowledge, Generate Diagram, Read Aloud |
| **Mission Command** | System (export) | Export for M365, Memory Architecture, Detect .env Secrets, Feedback |

**Data classification for proposed cards**:

| Card | Classification | Note |
|------|---------------|------|
| Architecture Status | **Existing** — `HealthCheckResult` | Already rendered in current view |
| Smart Nudges | **Existing** — `Nudge[]` | Already rendered; max 10 |
| Active Context | **Existing** — `ActiveContext` | Already rendered |
| Focus Session | **Existing** — `session` | Already rendered when active |
| Goals Summary | **Existing** — `goals` | Already rendered |
| Quick Command bar | **Existing** — action buttons | Redistribution only |
| Context Budget % | **New** — needs Contract B | Defer |
| Live Activity feed | **New** — needs Contract A | Defer |
| Personality Toggle | **Derived** — needs UX design | Defer until contracts clear |
| Settings Manager | **Existing** — `alex.setupEnvironment` | Command entry point exists |
| Secret Manager | **Existing** — `alex.manageSecrets` | Command entry point exists |

**Rule**: Remove or defer any card that cannot defend its data source (Guardrail #8).

**Exit**: Mission Command is demonstrably more useful than current welcome view. Every card is backed by existing or derived data. No card shows invented values.

---

### Wave 5 — Controlled Consolidation

**Goal**: Remove old sidebar duplication only after the new surface is proven.

**Current sidebar registrations** (from `package.json` views):

| View ID | Type | Current State |
|---------|------|---------------|
| `alex.welcomeView` | webview | Active — becomes the Command Center |
| `alex.cognitiveDashboard` | webview | Collapsed — editor-panel dashboard |
| `alex.memoryTree` | tree | Collapsed — tree view |

**Consolidation plan**:

| Step | Action | Condition |
|------|--------|-----------|
| Audit journeys | Map every user journey that currently touches `cognitiveDashboard` or `memoryTree` | — |
| Redirect commands | Commands that opened `cognitiveDashboard` redirect to Mind tab (or Mission Command health card) | Mind tab exists with equivalent data |
| Remove `cognitiveDashboard` | Delete view registration from `package.json`; remove `cognitiveDashboard.ts` | Replacement proven stable |
| Keep or remove `memoryTree` | Tree view may serve deeper use cases not suited to webview tab | Decide per journey audit |
| Legacy command cleanup | Update `commandMap` in `welcomeView.ts` for any redirected commands | All targets tested |

**Rule**: Do not remove views before their replacements are running in-product (Guardrail #1, #9).

**Exit**: Command Center handles all intended user journeys. Redundant views removed. No capability loss.

---

### Wave 6 — Advanced Tabs

**Goal**: Expand Agents, Skill Store, and Mind beyond placeholders using explicit runtime contracts.

**Agents tab** requires Contract A (Agent Status):
- Display agent registry with current state badges
- Show thread count and last-active timestamp per agent
- Requires explicit lifecycle hooks — no API exists today

**Skill Store** requires Contract C variant (Skill Catalog):
- Browse installed skills by category
- Toggle enable/disable (settings-driven or local state)
- Search across skill names and descriptions
- Requires a stable skill inventory model — `HealthCheckResult` provides counts but not per-skill detail

**Mind tab** requires Contract C (Mind Model):
- Memory modality breakdown (skills, instructions, prompts, synapses, global knowledge)
- Cognitive age (character model constant, not computed)
- Uncertainty areas (honest capability gaps)
- Last meditation/dream timestamps
- Hard rule: separate conceptual architecture from measured runtime state

**Exit**: Advanced tabs built on documented contracts, not UI aspiration.

---

### Wave 7 — UI Development (Audit-Driven)

**Goal**: Close all UI/UX compliance gaps identified by the March 8 audit and align every tab's content to the approved v2 mockup designs.

**Source audits**:
- **UI/UX Audit** (March 8, 2026): 10 findings across 3 severity levels — 4 P1 WCAG violations, 4 P2 design system issues, 2 P3 polish items
- **Content Audit** (March 8, 2026): Per-tab comparison of 5 mockup SVGs vs `welcomeViewHtml.ts` implementation — identified 26 MISSING sections, 7 PARTIAL sections, 3 EXTRA sections

**Audit positives** (preserve during remediation):
- Design system variables (`--spacing-*`, `--font-*`, `--shadow-*`, `--persona-accent`)
- VS Code theme variable usage for most foreground/background colors
- Color-blind-safe accent palette with `--persona-accent` dynamic binding
- Tab-level ARIA roles (`role="tablist"`, `role="tab"`, `aria-selected`)
- Keyboard navigation (ArrowLeft/Right/Home/End with roving tabindex)
- State persistence (`getState()/setState()` for active tab + scroll positions)
- Content Security Policy (nonce-based script, restricted img sources)
- `escapeHtml()` on all user-provided strings
- SVG-first avatar pipeline with PNG error fallback

**Classification key**:
- ⬡ **Implementable Now** — uses existing data, no new APIs or contracts needed (23 steps)
- ⬢ **Needs Data Provider** — requires new contract, persistence model, or API (12 steps)
- ◇ **Design Decision** — requires UX decision before implementation (10 steps)

---

#### 7A — WCAG Compliance (P1 HIGH)

**Priority**: Fix first. These are accessibility violations that block WCAG 2.1 AA conformance.

**7.1 — ARIA `labelledby` Resolution**

Each tab panel has `aria-labelledby="tab-mission"` (etc.) but none of the tab `<button>` elements have a matching `id` attribute. Screen readers cannot resolve the relationship.

**File**: `welcomeViewHtml.ts` — tab bar HTML generation
**Fix**: Add `id="tab-${tabId}"` to each tab button element
**Verification**: aXe DevTools audit shows 0 `aria-labelledby` violations
**Classification**: ⬡ Implementable Now

**7.2 — Keyboard Activation for Non-Button Elements**

Approximately 8 interactive elements use `<div>` or `<span>` with `role="button"` + `tabindex="0"` + `data-cmd` but rely solely on click handlers. Users navigating with Tab + Enter/Space can focus these elements but cannot activate them.

**File**: `welcomeViewHtml.ts` — client-side JS event delegation
**Fix**: In the keydown event listener, add handler for Enter (13) and Space (32) on elements with `[data-cmd]` attribute — trigger the same logic as click
**Affected elements**: Feature link buttons, persona cards, status grid items, and other `div[role="button"]` instances
**Classification**: ⬡ Implementable Now

**7.3 — Minimum Font Size Enforcement**

10+ CSS selectors use font sizes below the 11px design system minimum:

| Selector | Current | Target |
|----------|:-------:|:------:|
| `.header-series` | 9px | 11px |
| `.tier-lock` | 9px | 11px |
| `.persona-card .persona-tag` | 10px | 11px |
| `.agent-role` | 10px | 11px |
| `.skill-category` | 10px | 11px |
| `.skill-synapse-dot` | 10px | 11px |
| `.agent-badge` | 10px | 11px |
| `.mind-stat-label` | 10px | 11px |
| `.maintenance-label` | 10px | 11px |

**File**: `welcomeViewHtml.ts` — CSS section
**Impact**: May slightly increase vertical space in some cards — test at 300px sidebar width
**Classification**: ⬡ Implementable Now

**7.4 — Semantic Role Corrections**

Two role mismatches found:
1. `.persona-card` uses `role="link"` but triggers a command (not navigation) → change to `role="button"`
2. `.status-grid` uses `role="region"` with a click handler → either remove click handler or change role to `role="button"`

**File**: `welcomeViewHtml.ts` — Docs tab persona grid + Mission Command status section
**Classification**: ⬡ Implementable Now

---

#### 7B — UX Quality (P2 MEDIUM)

**Priority**: Fix after P1. These are design system compliance issues affecting usability.

**7.5 — Theme Variable Compliance in Mind Tab**

Hardcoded hex colors bypass VS Code theme variables, breaking in non-default themes:

| Selector | Hardcoded | Theme Variable Replacement |
|----------|-----------|---------------------------|
| `.stat-good` | `#3fb950` | `var(--vscode-testing-iconPassed)` |
| `.stat-warn` | `#d29922` | `var(--vscode-editorWarning-foreground)` |
| `.stat-bad` | `#f85149` | `var(--vscode-errorForeground)` |
| `.badge-ok` | `#3fb950` bg | `var(--vscode-testing-iconPassed)` |
| `.badge-missing` | `#f85149` bg | `var(--vscode-errorForeground)` |

**File**: `welcomeViewHtml.ts` — Mind tab CSS
**Classification**: ⬡ Implementable Now

**7.6 — Touch Target Minimums**

Four element types fall below the 36px compact minimum:

| Element | Current | Target |
|---------|:-------:|:------:|
| `.action-btn` | 32px min-height | 36px |
| `.feature-link-btn` | 28px | 36px |
| Tab buttons | ~27px | 36px |
| `.nudge-action` | ~20px | 36px |

**File**: `welcomeViewHtml.ts` — CSS for each selector
**Impact**: Test at 300px sidebar width — increased button heights may push content below fold
**Classification**: ⬡ Implementable Now

**7.7 — Inter-Target Spacing**

Three gap values fall below the 8px minimum:

| Selector | Current | Target |
|----------|:-------:|:------:|
| `.action-list` | `gap: 2px` | `gap: 8px` |
| `.trifecta-tags` | `gap: 3px` | `gap: 8px` |
| `.skill-recommendations-list` | `gap: 3px` | `gap: 8px` |

**File**: `welcomeViewHtml.ts` — CSS
**Impact**: Action list will use more vertical space — may require progressive disclosure (see 7.44)
**Classification**: ⬡ Implementable Now

**7.8 — Spacing Scale Normalization**

Non-standard spacing values found throughout CSS:

| Non-Standard | Nearest Standard | Action |
|:------------:|:----------------:|--------|
| 3px | 4px | Round up |
| 5px | 4px | Round down |
| 6px | 8px | Round up |
| 7px | 8px | Round up |
| 9px | 8px | Round down |
| 10px | 8px or 12px | Context-dependent |

**Design scale**: 4px / 8px / 12px / 16px / 24px / 32px
**File**: `welcomeViewHtml.ts` — CSS throughout
**Impact**: Incremental — no visual regression expected. Test at 300px.
**Classification**: ⬡ Implementable Now

---

#### 7C — Content Alignment: Mission Control

**Mockup**: `command-center-v2-mission-control.svg`
**Current state**: An action hub with 30+ buttons, session card, nudges, status grid, active context, goals. Diverges from mockup which envisions a monitoring dashboard with structured widgets.

**7.9 — Architecture Status Banner**

Mockup shows a prominent banner card with 3-state indicator (Healthy ✓ / Warnings ⚠ / Issues ✗) showing synapse count, broken count, and overall health percentage. Current implementation has a status grid but not the consolidated banner format.

**Data**: `HealthCheckResult` — **Existing**
**File**: `welcomeViewHtml.ts` — Mission Command panel HTML
**Classification**: ⬡ Implementable Now

**7.10 — Live Activity Feed**

Mockup shows real-time agent execution progress with queue position and steer/cancel controls. No API exists to surface agent lifecycle events.

**Blocked on**: Contract A (Agent Status)
**Classification**: ⬢ Needs Data Provider

**7.11 — Quick Command Bar**

Mockup shows a search-style input for rapid command access. Design decision needed: which commands are searchable, how results rank, whether to use VS Code's built-in command palette API or a custom filtered list.

**Classification**: ◇ Design Decision

**7.12 — Nudge Dismiss**

Mockup shows "Later" dismiss on each nudge card. Current nudges have no dismiss capability — they persist until resolved.

**Data**: Needs dismiss state persistence (session-scoped)
**File**: `welcomeViewHtml.ts` — nudge card HTML + `welcomeView.ts` message handler
**Classification**: ⬡ Implementable Now

**7.13 — Secret Manager Inline Dashboard**

Mockup shows 3-row token status (Replicate ✓ / GitHub ✓ / OpenAI ✗) inline in Mission Command. Design decision: security implications of displaying token names + status in a webview, how to surface this without exposing secrets.

**Classification**: ◇ Design Decision

**7.14 — Settings Manager Inline Toggles**

Mockup shows 4 toggle switches for key settings. Design decision: which settings to surface, how to persist changes, whether to use VS Code settings API or custom state.

**Classification**: ◇ Design Decision

**7.15 — Context Budget Bar**

Mockup shows a percentage bar for context window usage. `countTokens()` is a VS Code **proposed API** — not stable.

**Blocked on**: Contract B
**Classification**: ⬢ Needs Data Provider (Contract B)

**7.16 — Personality Toggle**

Mockup shows Precise/Chatty toggle. Design decision: what does this control, does it map to VS Code settings, and how does it interact with persona detection.

**Classification**: ◇ Design Decision

**7.17 — Action Button Density**

Implementation has ~30 action buttons in 7 groups visible on Mission Command. Mockup shows a cleaner monitoring dashboard with fewer, more purposeful widgets. **Design decision**:
- Option A: Keep buttons, add progressive disclosure (collapsed groups with expand)
- Option B: Relocate low-frequency buttons to command palette or sub-views
- Option C: Replace with monitoring widgets per mockup vision

**Classification**: ◇ Design Decision

---

#### 7D — Content Alignment: Agents

**Mockup**: `command-center-v2-agent-hub.svg`
**Current state**: Static 7-agent registry with name, role, description, and installed/not-installed badge. Mockup envisions a live multi-agent orchestration surface.

**7.18 — Cognitive State Card**

Mockup shows a card above the registry with current avatar, phase, mode, and a "reasoning meter" progress bar. Design decision: what data populates the reasoning meter, and should it duplicate data already shown in Mission Command.

**Classification**: ◇ Design Decision

**7.19 — Parallel Agents Display**

Mockup shows side-by-side agent execution with individual progress indicators. No API exists for concurrent agent lifecycles.

**Blocked on**: Contract A
**Classification**: ⬢ Needs Data Provider (Contract A)

**7.20 — Agent Live Status Badges**

Mockup shows ACTIVE/QUEUED/ROUTING/IDLE per agent. Current implementation shows only "installed" or "not installed" static badges.

**Blocked on**: Contract A
**Classification**: ⬢ Needs Data Provider (Contract A)

**7.21 — Recent Threads**

Mockup shows conversation history per agent. No conversation tracking API exists.

**Blocked on**: Contract A
**Classification**: ⬢ Needs Data Provider (Contract A)

**7.22 — Auto-Routing Explanation**

Add an informational card explaining how Alex routes conversations to specialist agents. This is static educational content — no data dependency.

**File**: `welcomeViewHtml.ts` — Agents tab HTML
**Classification**: ⬡ Implementable Now

**7.23 — Create Custom Agent Placeholder**

Mockup shows a "Create Custom Agent" CTA. This can be an empty-state card that links to documentation or a future workflow.

**File**: `welcomeViewHtml.ts` — Agents tab HTML
**Classification**: ⬡ Implementable Now

---

#### 7E — Content Alignment: Skill Store

**Mockup**: `command-center-v2-skill-store.svg`
**Current state**: Flat read-only list of skill cards with name, category label, description text, and synapse dot. Mockup envisions a categorized, searchable, toggleable marketplace.

**7.24 — Search Bar + Filter**

Add a text input for filtering skills by name/description. Uses existing `SkillInfo[]` data — client-side filtering.

**File**: `welcomeViewHtml.ts` — Skill Store tab HTML + client-side JS
**Classification**: ⬡ Implementable Now

**7.25 — Catalog Toggle**

Add All/Active/Inactive toggle bar with counts. "Active" = skills with `hasSynapses: true` or similar existing indicator.

**Data**: Can derive from existing `SkillInfo` model
**File**: `welcomeViewHtml.ts` — Skill Store tab HTML
**Classification**: ⬡ Implementable Now

**7.26 — Skill Health Summary Bar**

Add a summary bar showing overall skill health (count of healthy vs warning from `HealthCheckResult`).

**Data**: `HealthCheckResult` — **Existing**
**Classification**: ⬡ Implementable Now

**7.27 — Category Grouping**

Organize skills into 3 tiers (Core/Development/Creative) with collapsible sections. Current implementation shows a flat list; `SkillInfo.category` already exists.

**Data**: `SkillInfo.category` — **Existing**
**File**: `welcomeViewHtml.ts` — Skill Store tab HTML
**Classification**: ⬡ Implementable Now

**7.28 — Enable/Disable Toggles**

Add per-skill toggle switches. Requires a persistence model for skill enable/disable state (settings-driven or workspace state).

**Blocked on**: Persistence model design
**Classification**: ⬢ Needs Data Provider (Persistence)

**7.29 — Skill Icons**

Add rocket-icon SVGs to skill cards (map skill categories to icon sets: states, agents, personas).

**Data**: Rocket-icon SVGs already exist in assets
**Classification**: ⬡ Implementable Now (depends on Spike 1A resolution for webview SVG)

**7.30 — Install from GitHub**

Add action to install community skills from GitHub URLs. Requires implementation of fetch + validate + install workflow.

**Classification**: ⬢ Needs Data Provider (new workflow)

**7.31 — Context Budget Impact**

Show per-skill context budget impact. Depends on `countTokens()` API.

**Blocked on**: Contract B
**Classification**: ⬢ Needs Data Provider (Contract B)

---

#### 7F — Content Alignment: Mind

**Mockup**: `command-center-v2-mind.svg`
**Current state**: Stats row (cognitive age + synapse health), 5 memory modality bars, last maintenance timestamps, quick action buttons. Mockup envisions 9 rich panels including Knowledge Freshness, Honest Uncertainty, and Identity — **the key differentiator tab**.

**7.32 — Knowledge Freshness Panel**

Mockup shows a forgetting curve with 4 categories: Thriving, Active, Fading, Dormant. Requires a model for tracking knowledge recency.

**Blocked on**: Knowledge freshness model (when was each piece of knowledge last accessed/validated)
**Classification**: ⬢ Needs Data Provider

**7.33 — Honest Uncertainty Panel**

Mockup shows confidence distribution bars and thin coverage areas (topics where Alex has low confidence). Requires explicit uncertainty model.

**Blocked on**: Uncertainty model definition
**Classification**: ⬢ Needs Data Provider

**7.34 — Global Knowledge Panel**

Show insight count, project count, and promoted-to-global count. Data partially exists in global knowledge index.

**File**: `welcomeViewHtml.ts` — Mind tab HTML
**Data**: Can derive from global knowledge file system
**Classification**: ⬡ Implementable Now

**7.35 — Identity Card**

Static character model data: name (Alex Finch), age (26), personality summary. This is constant data from `copilot-instructions.md`.

**File**: `welcomeViewHtml.ts` — Mind tab HTML
**Classification**: ⬡ Implementable Now

**7.36 — Enriched Cognitive Age Display**

Current implementation shows a number ("26") with a label. Mockup shows tier label ("Young Adult"), a progression bar with fill, and milestone markers (Early Learning → Active Growth → Integrated → Wise).

**Data**: All derivable from existing character model constants
**File**: `welcomeViewHtml.ts` — Mind tab HTML + CSS
**Classification**: ⬡ Implementable Now

**7.37 — Rich Memory Architecture Cards**

Current implementation shows 5 horizontal bars. Mockup shows 5 distinct modality cards (Semantic, Procedural, Episodic, Visual, Muscles) each with individual count + health percentage.

**Data**: `MindTabData` already provides per-modality counts. Health percentage can be derived from existing `HealthCheckResult`.
**File**: `welcomeViewHtml.ts` — Mind tab HTML + CSS
**Classification**: ⬡ Implementable Now

**7.38 — Meditation Streak & Emotions**

Current Meditation & Growth shows last meditation + last dream timestamps. Mockup adds streak counter (consecutive meditation days) and emotion tags (clarity, focus, peace, etc.).

**Blocked on**: Meditation history persistence (needs tracking model for streak and emotions)
**Classification**: ⬢ Needs Data Provider (Persistence)

---

#### 7G — Content Alignment: Docs

**Mockup**: `command-center-v2-docs.svg`
**Current state**: 7 content groups including 33 workshop persona cards, self-study, facilitator materials, architecture links, Learn Alex CTA, partnership guide. Mockup has a cleaner grid-based layout. Implementation has 3 EXTRA sections not in mockup (workshop personas, self-study, facilitator materials) — these are valid additions.

**7.39 — Tips & Nudges Section**

Mockup shows 3 context-aware tips at top of Docs with "Dismiss all" action. This can reuse the nudge infrastructure from Mission Command, filtered for documentation-relevant tips.

**Data**: Can filter from existing `Nudge[]` or create doc-specific nudge subset
**File**: `welcomeViewHtml.ts` — Docs tab HTML
**Classification**: ⬡ Implementable Now

**7.40 — Architecture Grid**

Mockup shows a 2×3 grid: Cognitive Architecture, Memory Systems, Conscious Mind, Unconscious Mind, Agent Catalog, Trifecta Catalog. Current implementation has architecture links but not in this structured grid format.

**Data**: Static doc links — all files exist in `alex_docs/architecture/`
**File**: `welcomeViewHtml.ts` — Docs tab HTML
**Classification**: ⬡ Implementable Now

**7.41 — Operations Grid**

Mockup shows a 2×2 grid: Protection, Project Structure, Heir Architecture, Research Papers. Currently these are scattered across action groups.

**Data**: Static doc links
**File**: `welcomeViewHtml.ts` — Docs tab HTML
**Classification**: ⬡ Implementable Now

**7.42 — Getting Started Cards**

Mockup shows 4 cards: User Manual, Quick Reference, Environment Setup, Use Cases. Current implementation has 3 links in a simpler format.

**File**: `welcomeViewHtml.ts` — Docs tab HTML
**Classification**: ⬡ Implementable Now

**7.43 — Partnership Card**

Mockup shows a structured card with description + CTA button. Current implementation uses plain text.

**File**: `welcomeViewHtml.ts` — Docs tab HTML
**Classification**: ⬡ Implementable Now

---

#### 7H — Polish (P3 LOW)

**7.44 — Mission Ctrl Cognitive Overload**

~30 action buttons visible simultaneously creates cognitive overload. Options:
- Progressive disclosure: collapse groups by default, expand on click
- Frequency-aware: show top 5 recent + "Show all" expander (depends on Contract D — Recently Used)
- Category sub-views: each action group becomes an expandable accordion
- Relocate: move low-frequency actions to command palette

This intersects with 7.17 (button density design decision). Resolve together.

**Classification**: ◇ Design Decision

**7.45 — Focus Indicator Standardization**

Tab buttons use `outline-width: 1px` while global focus uses `outline-width: 2px`. Standardize to 2px for all focusable elements for consistency and WCAG compliance.

**File**: `welcomeViewHtml.ts` — CSS
**Classification**: ⬡ Implementable Now

---

#### Wave 7 Summary — Implementation Sequencing

| Phase | Steps | Classification | Target Release | Pre-requisites |
|-------|:-----:|:--------------:|:--------------:|----------------|
| **7A — WCAG Compliance** | 7.1–7.4 (4) | All ⬡ | v6.5.0 | None |
| **7B — UX Quality** ✅ | 7.5–7.8 (4) | All ⬡ | v6.5.0 | Complete |
| **7G — Docs Content** | 7.39–7.43 (5) | All ⬡ | v6.6.0 | None |
| **7E — Skill Store** (partial) | 7.24–7.27, 7.29 (5) | All ⬡ | v6.6.0 | None |
| **7F — Mind** (partial) | 7.34–7.37 (4) | All ⬡ | v6.6.0 | None |
| **7C — Mission Ctrl** (partial) | 7.9, 7.12 (2) | All ⬡ | v6.6.0 | None |
| **7D — Agents** (partial) | 7.22–7.23 (2) | All ⬡ | v6.6.0 | None |
| **7H — Polish** | 7.45 (1) | ⬡ | v6.6.0 | None |
| **Data Provider steps** | 7.10, 7.15, 7.19–7.21, 7.28, 7.30–7.33, 7.38 (12) | All ⬢ | v6.8.0 | Contracts A, B + persistence models |
| **Design Decision steps** | 7.11, 7.13–7.14, 7.16–7.18, 7.44 (7+) | All ◇ | v7.0+ | UX review + decisions |

**Implementable now (23 steps)**: Ship in v6.5.0 + v6.6.0 with no new infrastructure
**Needs data providers (12 steps)**: Ship in v6.8.0 after contracts are documented and implemented
**Needs design decisions (10 steps)**: Ship in v7.0+ after UX review resolves open questions

**Exit**: All WCAG P1 violations fixed. Design system compliance restored. Every tab content aligned to approved mockup where data supports it. Remaining gaps explicitly documented as blocked on contracts or design decisions.

---

## Visual Identity Specification

### Icon Assets (ready)

| Property | Value |
|----------|-------|
| Total SVG files | 33 |
| Categories | `states/` (9), `agents/` (7), `personas/` (16), `default/` (1) |
| Source | `alex_docs/research/mockups/rocket-icons/` |
| Generator | `alex_docs/research/mockups/generate-rocket-icons.js` |
| Preview | `alex_docs/research/mockups/rocket-icons/preview.html` |
| Tab bar icons | Not needed — tabs use text labels per approved mockups |

Icons are a design input, not an implementation blocker. Shell and tab content work proceeds regardless of icon integration status.

### Avatar Migration — Files to Touch

The current avatar pipeline resolves PNG paths. SVG migration touches these files:

| File | Current Role | Change Required |
|------|-------------|-----------------|
| `src/chat/avatarMappings.ts` | `resolveAvatar()` returns path via `getAvatarAssetRelativePath(result, 'png')` | Add `'svg'` format parameter; resolve from `assets/avatars/rocket-icons/` |
| `src/chat/participant.ts` (line 1011) | Sets `_alexParticipant.iconPath` to PNG `Uri` | Test SVG `Uri` — if it renders, switch; if not, keep PNG for chat only |
| `src/views/welcomeViewHtml.ts` | Uses `getAssetUri(webview, extensionUri, path)` for `<img>` tags | SVG works natively in `<img>` inside webviews — no blocker expected |
| `platforms/vscode-extension/assets/avatars/` | 112 PNG/WebP files (26.43 MB) | Copy approved rocket SVGs into new `rocket-icons/` subdirectory |

### Avatar Strategy Decision Matrix

Decided by Spike 1A (steps 1.1–1.6):

| Outcome | Chat Participant | Webview | Asset Size Impact |
|---------|-----------------|---------|-------------------|
| **Full SVG** | SVG `Uri` via `iconPath` | SVG `<img>` | 33 SVGs replace 112 PNGs — massive reduction |
| **Hybrid** | Keep `'png'` for `iconPath` | SVG `<img>` for sidebar | Additive: 33 SVGs + existing PNGs |
| **PNG fallback** | No change | No change | No change |

### Rule

Do not let visual identity decisions block shell and Docs progress (Guardrail #5).

---

## Data Contract Backlog

Each contract below must be documented and implemented before its dependent tab moves beyond placeholder scope. TypeScript sketches show the target shape; they are not final API — refine during implementation.

### Contract A — Agent Status

Required by: **Agents tab** (Wave 6).

```ts
interface AgentStatus {
  agentId: string;          // e.g. "builder", "researcher"
  state: 'active' | 'queued' | 'routing' | 'idle';
  lastActiveMs: number;     // Date.now() of last activity
  threadCount: number;      // open conversation threads
}

interface AgentStatusProvider {
  getAll(): AgentStatus[];
  onDidChange: vscode.Event<AgentStatus[]>;
  refreshIntervalMs: number; // cadence for polling or push
  staleThresholdMs: number;  // mark idle after this silence
}
```

Open questions: Is agent state derived from participant handler invocations, or does it need explicit lifecycle hooks? Which persistence scope (workspace vs global)?

### Contract B — Context Budget

Required by: **Mission Command** context-budget card (Wave 6 or later).

```ts
interface ContextBudget {
  maxInputTokens: number;   // from model.maxInputTokens
  estimatedUsed: number;    // aggregation of conversation + system prompt + tool context
  isEstimate: boolean;      // true until countTokens() becomes stable API
  refreshedAt: number;      // Date.now()
}
```

`countTokens()` is a VS Code **proposed API** — not currently used in codebase. Until it stabilises, any budget display must be labelled "estimated". Do not present hard numbers.

### Contract C — Mind Model

Required by: **Mind tab** (Wave 6).

```ts
interface MindModel {
  memoryModalities: {
    skills: { count: number; healthPct: number };
    instructions: { count: number; healthPct: number };
    prompts: { count: number };
    synapses: { totalConnections: number; brokenCount: number };
    globalKnowledge: { insightCount: number };
  };
  cognitiveAge: string;              // e.g. "26" — from character model, not runtime
  uncertaintyAreas: string[];        // honest list of capability gaps
  lastMeditationIso: string | null;  // ISO date
  lastDreamIso: string | null;
}

interface MindDataProvider {
  getModel(): Promise<MindModel>;
  onDidChange: vscode.Event<void>;
}
```

Hard rule: Separate **conceptual architecture** (narrated in docs) from **measured runtime state** (live health check data). The Mind tab must never blur the two.

### Contract D — Recently Used

Required by: **Mission Command** Quick Command bar (adaptive ordering).

```ts
interface RecentEntry {
  commandId: string;        // e.g. "alex.codeReview"
  lastUsedMs: number;
  useCount: number;
}

interface RecentUsageStore {
  record(commandId: string): void;
  getRecent(limit: number): RecentEntry[];
  scope: 'workspace' | 'global';     // must be decided before implementation
  persistenceKey: string;             // globalState key
}
```

Decision needed: workspace-scoped (different projects = different frequent commands) vs global (one set across all projects). Recommend workspace as default with global fallback.

---

## Risk Register

| ID | Risk | P | I | Trigger | Response |
|----|------|---|---|---------|----------|
| R1 | SVG avatar brittle across chat + webview | H | H | Inconsistent rendering or update friction | Spike 1A decides: full SVG / hybrid / PNG fallback |
| R2 | Hidden data work disguised as UI work | H | H | Card depends on undefined status or telemetry | Classify every card as existing/derived/new; defer new |
| R3 | Sidebar density collapses at 300 px | M | H | Cards cramped, primary actions below fold | Ship Docs + Mission Command first; reduce density |
| R4 | Plan drift via stale counts or renamed concepts | M | M | Milestones diverge across docs | This plan is sole source of truth |
| R5 | Sidebar consolidation breaks user expectations | M | H | Commands lose discoverability, views removed too early | Delay removals until replacement is stable |
| R6 | Mission Command shows misleading data | M | H | Cards use guessed or stale values | Gate cards behind classification; remove undefended cards |
| R7 | Mind tab overpromises runtime introspection | M | H | Mockup concepts outpace actual metrics | Keep reduced-scope until contracts explicit |
| R8 | Personalization ships without persistence model | M | M | Quick Actions behave inconsistently across workspaces | Define persistence scope before adaptive UX |
| R9 | WCAG P1 violations block accessibility standards | H | H | Tab panels inaccessible to screen readers; non-button elements not keyboard-activatable | Wave 7A fixes — 4 steps, all implementable now |
| R10 | Font size + touch target fixes break 300px density | M | H | Increased minimums push content below fold | Test each fix at 300px; may require progressive disclosure (7.44) |
| R11 | Content alignment scope creep — building mockup features that need undefined data | H | H | Attempting ⬢/◇ steps before contracts exist | Strict classification enforcement — only ⬡ steps in v6.5.0/v6.6.0 |
| R12 | Hardcoded colors invisible in high-contrast themes | M | H | Users with custom themes report unreadable Mind tab | Wave 7B step 7.5 — replace all hardcoded hex with theme variables |

**Risk review rules:**
1. Do not close a risk because the design looks settled — close only on implementation evidence.
2. Any H/H risk must have a spike, contract decision, or gate before dependent work starts.
3. If a trigger fires during implementation, stop scope expansion and resolve before continuing.
4. Record retirement decisions in milestone notes or linked implementation artifacts.

---

## Versioning Strategy

| Release | Scope | Status |
|---------|-------|--------|
| v6.2.0+ (current) | Waves 0–6: tab shell + all 5 tabs functional + consolidation audit | ✅ In-tree |
| v6.5.0 (Trust Release) | Wave 7A–7B: WCAG compliance + UX quality fixes (8 steps) | 🎯 Next |
| v6.6.0 (Content Release) | Wave 7C–7G implementable-now steps: mockup alignment across all 5 tabs (15 steps) | Planned |
| v6.8.0 (Data Release) | Wave 7 data-provider steps: Contracts A–D + persistence models (12 steps) | Planned |
| v7.0+ | Wave 7 design-decision steps + full sidebar consolidation + remove 2 legacy views | Backlogged |

Do not tie the full vision to a single major release. Ship useful increments.

---

## Bottom Line

The Command Center is a **UI-first, proof-driven evolution** of the welcome view.

**Done**: Tab shell, all 5 tabs functional with real data, keyboard-first navigation, curated AlexLearn integration, journey audit, scroll restoration, legacy command redirection. Wave 7A WCAG compliance + Wave 7B UX quality + Wave 7C-7H content alignment. 82/100 steps complete (Waves 0–6, 7A–7H).

**Next — Wave 7 UI Development** (remaining 18 steps):
- **Data providers** (v6.8.0): 12 steps requiring new contracts or persistence — Live Activity Feed (A), Context Budget (B), Knowledge Freshness, Honest Uncertainty, skill toggles, meditation streak
- **Design decisions** (v7.0+): 6 steps requiring UX decisions — button density strategy, Quick Command bar, Secret/Settings Manager inline display, Personality Toggle, Cognitive State card

**Blocked on**: Runtime data contracts for Agents (A), Context Budget (B), Mind enrichment, Recently Used (D). These must be documented and implemented before their dependent steps can proceed.

**This document is self-contained.** All design principles, audit guardrails, competitive context, baselines, API feasibility, data contracts, audit findings, and implementation specs are here. No need to reference external docs for day-to-day execution.

---

## Implementation Guardrails

Non-negotiable rules for every wave.

1. Do not gut working sidebar surfaces before the replacement flow exists in-product.
2. Do not treat SVG as an architectural dependency until the avatar spike is complete.
3. Do not present speculative telemetry as if it were live runtime data.
4. Do not build Agents, Skill Store, or Mind beyond reduced-scope states without explicit contracts.
5. Do not let icon approvals or visual polish block shell, Docs, or Mission Command delivery.
6. Do not frame Docs as a full Learn Alex mirror; keep it curated and sidebar-appropriate.
7. Do not remove keyboard-first behavior during the refactor; tab navigation and command access must stay fast.
8. Do not mix existing data, derived data, and not-yet-instrumented data in one card without clear internal classification.
9. Do not archive modules solely because the new design exists on paper; archive only after the replacement is stable.
10. Do not move the execution source of truth away from this master plan without updating the supersession note in the related docs.
