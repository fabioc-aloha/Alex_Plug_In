# Command Center Master Plan

**Author**: Alex Finch + GitHub Copilot
**Created**: March 5, 2026
**Revised**: March 7, 2026 — Consolidated as single self-contained execution doc
**Classification**: Internal — UI-first implementation plan
**Status**: Waves 0–6 ✔️ · Refinement phase next

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

### Wave 1 — Critical Spikes

> **Goal**: Prove the two biggest technical unknowns before committing to architecture.
> **Depends on**: Wave 0. **Unlocks**: Waves 2–6.

**Spike 1A — SVG Avatar Viability** (Track C)

| # | Step | Status |
|---|------|:------:|
| 1.1 | Copy one rocket SVG into `platforms/vscode-extension/assets/avatars/` | ✓ |
| 1.2 | Update `getAvatarAssetRelativePath()` to accept `'svg'` format parameter | ✓ |
| 1.3 | Update `avatarMappings.ts` to resolve an SVG path for one test state | ✓ |
| 1.4 | Set `ChatParticipant.iconPath` to the SVG `Uri` and verify it renders in chat | — |
| 1.5 | Test SVG rendering inside a webview `<img>` tag | — |
| 1.6 | **DECISION**: Record avatar strategy — full SVG / hybrid / PNG fallback | — |

**Spike 1B — Tab Shell Viability** (Track A + B)

| # | Step | Status |
|---|------|:------:|
| 1.7 | Add minimal tab-bar HTML to `welcomeViewHtml.ts` (5 text-label tabs) | ✓ |
| 1.8 | Wire `postMessage` handler for tab switching in `welcomeView.ts` | ✓ |
| 1.9 | Verify `resolveWebviewView` refresh preserves active tab selection | — |
| 1.10 | Test keyboard navigation (arrow keys + Enter) on the tab bar | — |
| 1.11 | **DECISION**: Record shell viability — pass / rework needed | — |

**Spike 1C — Data Contract Triage** (Track B)

| # | Step | Status |
|---|------|:------:|
| 1.12 | Classify each Mission Command card as existing / derived / new data | ✓ |
| 1.13 | Classify each Mind tab element as existing / derived / new data | ✓ |
| 1.14 | Document context-budget data availability and aggregation path | ✓ |
| 1.15 | **DECISION**: Record contract triage results for all tabs | — |

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
| 5.2 | Redirect legacy commands to new tab destinations | B | deferred — Mind tab placeholder |
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

**Total**: 55 steps across 7 waves · 3 decision gates · 3 parallel tracks

### Completion Summary (Waves 0–6)

| Wave | Title | Steps | Done | Key Deliverables |
|------|-------|:-----:|:----:|------------------|
| 0 | Planning Hygiene | 4 | 4 | Plan locked, baselines verified |
| 1 | Critical Spikes | 15 | 9 | SVG code, tab shell JS, data triage (3 manual-test gates outstanding) |
| 2 | Command Center Shell | 7 | 7 | 5-tab bar, ARIA, persistence, scroll restoration, responsive |
| 3 | Docs Tab | 8 | 8 | 7 content groups, 33-persona workshop grid, 7 external URLs |
| 4 | Mission Command | 8 | 8 | Session card wired, doc buttons migrated to Docs, features bloat removed |
| 5 | Controlled Consolidation | 5 | 3 | Journey audit done, both legacy views preserved |
| 6 | Advanced Tabs | 8 | 8 | Agent registry, Skill Store, Mind dashboard, easter egg SVG fix, code review |
| **Σ** | | **55** | **47** | **All 5 tabs functional. 3 spike manual-test gates + 2 Wave 5 deferrals remaining.** |

---

## Validated Baseline

These facts are verified against the current repo (March 7, 2026) and treated as fixed planning inputs.

### Extension Baseline

| Fact | Verified Value |
|------|----------------|
| Sidebar views registered | 3: `alex.welcomeView`, `alex.cognitiveDashboard`, `alex.memoryTree` |
| `welcomeView.ts` | ~700 lines (grew with 3 data collection methods) |
| `welcomeViewHtml.ts` | ~2,100 lines (grew with 3 tab implementations + CSS) |
| `avatarMappings.ts` | 748 lines (SVG format parameter added in Spike 1A) |
| `memoryTreeProvider.ts` | 319 lines |
| `cognitiveDashboard.ts` | 621 lines |
| `participant.ts` | 1,060 lines |
| `healthDashboard.ts` | 1,008 lines |
| Avatar asset files | 145 (112 PNG/WebP + 33 rocket SVGs) |
| Welcome view uses retained context | Yes (`retainContextWhenHidden: true`) |
| Chat participant avatar path | SVG-first (rocket-icons) with PNG fallback |
| Extension compile state | Clean |
| Total TS source files | 95 |
| Total lines of code | 48K |
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

### Remaining (Wave 1 gates + Wave 6)

- 3 manual vsix test gates from Spike 1A/1B outstanding (SVG chat, webview SVG, shell refresh)
- SVG avatar strategy decision pending spike results
- Real-time agent state model (Contract A)
- Context-budget percentage bar (Contract B — `countTokens()` is proposed API)
- Full five-modality memory model as live UI (Contract C)
- Recently-used adaptive UX (Contract D)
- Command redirection cleanup (Wave 5.2 — deferred until Mind tab exists)
- Redundant sidebar view removal (Wave 5.3 — deferred until safe)

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

**Risk review rules:**
1. Do not close a risk because the design looks settled — close only on implementation evidence.
2. Any H/H risk must have a spike, contract decision, or gate before dependent work starts.
3. If a trigger fires during implementation, stop scope expansion and resolve before continuing.
4. Record retirement decisions in milestone notes or linked implementation artifacts.

---

## Versioning Strategy

| Release | Scope | Status |
|---------|-------|--------|
| v6.2.0+ (current) | Waves 0–5: tab shell + Docs + Mission Command + consolidation audit | ✅ In-tree |
| v6.5.0 (Trust Release) | SVG spike gates + Wave 6 advanced tabs + test/refactoring work | 🎯 Next |
| v7.0+ | Full sidebar consolidation, remove 2 legacy views, organizational cognition | Backlogged |

Do not tie the full vision to a single major release. Ship useful increments.

---

## Bottom Line

The Command Center is a **UI-first, proof-driven evolution** of the welcome view.

**Done**: Tab shell, Docs tab, Mission Command tab, keyboard-first navigation, empty states, curated AlexLearn integration, journey audit, scroll restoration. 39/53 steps complete.

**Next**: 3 manual vsix test gates (SVG avatar chat, webview SVG, shell refresh preservation). Then Wave 6 advanced tabs.

**Blocked on**: Runtime data contracts for Agents (A), Context Budget (B), Mind (C), Recently Used (D). These must be documented and implemented before their dependent tabs move beyond placeholders.

**This document is self-contained.** All design principles, audit guardrails, competitive context, baselines, API feasibility, data contracts, and implementation specs are here. No need to reference external docs for day-to-day execution.

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
