# Command Center Master Plan

**Author**: Alex Finch + GitHub Copilot (GPT-5.4 second-opinion synthesis)
**Created**: March 5, 2026
**Revised**: March 7, 2026 — Waves 0–5 complete
**Classification**: Internal — UI-first implementation plan
**Status**: Waves 0–5 ✔️ · Wave 6 (Advanced Tabs) deferred until runtime contracts defined
**Based on**:
- [COMMAND-CENTER-FEASIBILITY-2026-03-05.md](COMMAND-CENTER-FEASIBILITY-2026-03-05.md)
- [COMMAND-CENTER-DESIGN-PRINCIPLES.md](COMMAND-CENTER-DESIGN-PRINCIPLES.md)
- [CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md](CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md)
- [COMMAND-CENTER-SECOND-OPINION-AUDIT-2026-03-05.md](../audits/COMMAND-CENTER-SECOND-OPINION-AUDIT-2026-03-05.md)

---

## Purpose

This document replaces the feasibility plan as the **execution guide** for the Command Center.

The feasibility plan established the vision, tab architecture, and UI direction. The second-opinion audit found that the implementation sequence needed tightening: too many assumptions were embedded into early phases, and too much behind-the-scenes work was being treated as presentation-only.

This master plan keeps the approved UI direction but changes the execution strategy:

1. **UI first**
2. **Prove critical assumptions early**
3. **Preserve existing runtime behavior until replacements are real**
4. **Separate visual work from new telemetry/data-contract work**
5. **Ship a useful Command Center slice before attempting total consolidation**

---

## Executive Decision

The Command Center will be built as a **staged UI refactor**, not as a single full replacement of the existing sidebar stack.

### What changes from the feasibility plan

- The first implementation milestone is **not** a full gut-and-replace.
- SVG avatar migration is treated as a **blocking technical spike**, not an assumed foundation.
- The first real milestone focuses on **Mission Command + Docs** because they are highest value and lowest architectural risk.
- The Agents, Skill Store, and Mind tabs remain part of the design target, but their richer behavior is deferred until their data contracts are explicit.
- The Docs tab is framed as **the bridge to LearnAlex as a companion surface**, using curated AlexLearn alignment rather than a full mirror of the website.

### What stays the same

- Final tab architecture remains:
  - Mission Command
  - Agents
  - Skill Store
  - Mind
  - Docs
- The design system, approved mockups, and icon workflow remain valid. Icons now use the rocket-character system (33 final SVGs).
- The long-term goal remains a single Command Center sidebar surface.

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

### Wave 6 — Advanced Tabs

> **Goal**: Expand Agents, Skill Store, and Mind beyond placeholders on explicit contracts.
> **Depends on**: Wave 5. **Unlocks**: Full Command Center vision.

| # | Step | Track | Status |
|---|------|:-----:|:------:|
| 6.1 | Define Agent status contract (active / queued / routing / idle semantics) | B | — |
| 6.2 | Implement Agents tab beyond placeholder state | A | — |
| 6.3 | Define Skill Store catalog model and toggle behavior | B | — |
| 6.4 | Implement Skill Store tab beyond placeholder state | A | — |
| 6.5 | Define Mind tab runtime model and memory-modality mapping | B | — |
| 6.6 | Implement Mind tab beyond reduced-scope state | A | — |

**Total**: 50 steps across 7 waves · 3 decision gates · 3 parallel tracks

### Completion Summary (Waves 0–5)

| Wave | Title | Steps | Done | Key Deliverables |
|------|-------|:-----:|:----:|------------------|
| 0 | Planning Hygiene | 4 | 4 | Plan locked, baselines verified |
| 1 | Critical Spikes | 15 | 9 | SVG code, tab shell JS, data triage (3 manual-test gates outstanding) |
| 2 | Command Center Shell | 7 | 7 | 5-tab bar, ARIA, persistence, scroll restoration, responsive |
| 3 | Docs Tab | 8 | 8 | 7 content groups, 33-persona workshop grid, 7 external URLs |
| 4 | Mission Command | 8 | 8 | Session card wired, doc buttons migrated to Docs, features bloat removed |
| 5 | Controlled Consolidation | 5 | 3 | Journey audit done, both legacy views preserved (Mind tab still placeholder) |
| 6 | Advanced Tabs | 6 | 0 | Deferred — requires Agent Status, Skill Catalog, Mind Model contracts |
| **Σ** | | **53** | **39** | **Wave 6 blocked on runtime contracts; 3 spike gates need manual vsix test** |

---

## Validated Baseline

These facts are treated as fixed planning inputs because they were verified against the current repo and AlexLearn source.

### Extension baseline

| Fact | Verified Value |
|------|----------------|
| Sidebar views currently registered | 3 |
| `welcomeView.ts` line count | 588 (was 571 at plan start) |
| `welcomeViewHtml.ts` line count | 1830 (was 1488 at plan start) |
| `avatarMappings.ts` line count | 748 (was 612 at plan start; in `src/chat/`) |
| `memoryTreeProvider.ts` line count | 319 |
| `cognitiveDashboard.ts` line count | 621 |
| Avatar asset files | 145 (was 112; +33 rocket SVGs) |
| Avatar asset size | ~26.7 MB |
| Welcome view currently uses retained context | Yes |
| Chat participant avatar path | SVG-first (rocket-icons) with PNG fallback |
| Extension compile state | Clean |

### AlexLearn baseline

| Fact | Verified Value |
|------|----------------|
| Workshop study guide count | 33 |
| Workshop guide source path | `website/src/content/workshops/` |
| Self-study page exists | Yes |
| Exercises page exists | Yes |
| Facilitator materials exist | Yes |

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
| `alex.welcomeView` | webview | Active | `welcomeView.ts` (571 lines) + `welcomeViewHtml.ts` (1488 lines) |
| `alex.cognitiveDashboard` | webview | Collapsed | `cognitiveDashboard.ts` (621 lines) |
| `alex.memoryTree` | tree | Collapsed | `memoryTreeProvider.ts` (319 lines) |

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
                      externalUrlMap (5 entries) → vscode.env.openExternal()
                      special cases: openChat, launchRecommendedSkill, meditate, refresh
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

1. **UI first means UI first.** Early waves focus on visible structure, navigation, and content hierarchy. Do not block UI progress on advanced telemetry or dynamic status systems.

2. **Preserve working runtime paths until replacements exist.** The current welcome view, PNG avatar path, and 3 sidebar registrations coexist with new work until replacements are proven. No speculative cleanup.

3. **Resolve blocking spikes before they become architecture.** The SVG chat avatar path is a real unknown (Spike 1A). It must be proven before the plan assumes it.

4. **Classify every data source.** Every proposed UI element must be tagged:

   | Class | Meaning | Gate |
   |-------|---------|------|
   | Existing | Available from current `getWelcomeHtmlContent()` parameters | Build immediately |
   | Derived | Computable from current structures with modest glue code | Build when glue is written |
   | New | Requires new instrumentation, tracking, or contracts | Defer until contract documented |

5. **Curate, don't mirror.** The Docs tab surfaces the strongest LearnAlex pathways — not a full website clone.

---

## Scope Boundary

### In Scope (Waves 0–5)

- Tabbed Command Center shell inside `alex.welcomeView`
- Mission Command tab with existing runtime data
- Docs tab with curated AlexLearn alignment
- Approved rocket-icon system as design input
- Keyboard-first tab navigation (ARIA tablist pattern)
- Empty-state design for every tab
- Migration path from 3 sidebar views → 1 Command Center surface
- SVG avatar spike and decision

### Explicitly Deferred (Wave 6+)

- Real-time agent state model (Contracts A) — no lifecycle API exists
- Context-budget percentage bar (Contract B) — `countTokens()` is proposed API
- Full five-modality memory model as live UI (Contract C)
- Full SVG replacement if spike fails
- Command redirection cleanup before replacement is stable
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

| Release | Scope | Gate |
|---------|-------|------|
| v6.x patch | Master plan locked, spikes running | Plan approved |
| v6.x minor | Tab shell + Docs tab + Mission Command tab | Spikes pass, smoke test clean |
| v6.x minor+1 | Sidebar consolidation (remove 2 redundant views) | Replacement covers all journeys |
| v7.0 | Agents, Skill Store, Mind with runtime contracts | Contracts B–D documented and implemented |

Do not tie the full vision to a single major release. Ship useful increments.

---

## Bottom Line

The Command Center is a **UI-first, proof-driven evolution** of the welcome view.

**Build now**: Tab shell, Docs tab, Mission Command tab, keyboard-first navigation, empty states, curated AlexLearn integration.
**Prove first**: SVG chat avatar viability, status badge model, context budget contract, memory-modality mapping.
**Delay until stable**: Full sidebar consolidation, legacy command redirection, fully dynamic Agents / Skill Store / Mind.

The first win is a stable shell plus two genuinely useful tabs, built on existing runtime data.

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
