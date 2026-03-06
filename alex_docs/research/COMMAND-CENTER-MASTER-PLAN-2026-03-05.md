# Command Center Master Plan

**Author**: Alex Finch + GitHub Copilot (GPT-5.4 second-opinion synthesis)
**Date**: March 5, 2026
**Classification**: Internal - UI-first implementation plan
**Status**: Approved concept, tightened execution plan
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
- The design system, approved mockups, and 38-position icon approval workflow remain valid.
- The long-term goal remains a single Command Center sidebar surface.

---

## Validated Baseline

These facts are treated as fixed planning inputs because they were verified against the current repo and AlexLearn source.

### Extension baseline

| Fact | Verified Value |
|------|----------------|
| Sidebar views currently registered | 3 |
| `welcomeView.ts` line count | 571 |
| `welcomeViewHtml.ts` line count | 1487 |
| `avatarMappings.ts` line count | 597 |
| `memoryTreeProvider.ts` line count | 319 |
| `cognitiveDashboard.ts` line count | 621 |
| Avatar asset files | 112 |
| Avatar asset size | 27,713,118 bytes (~26.43 MB) |
| Welcome view currently uses retained context | Yes |
| Chat participant avatar path currently PNG-based | Yes |
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

## Self-Sufficient Artifact Bundle

This section embeds the key artifacts from the feasibility report so this master plan can stand alone as the working execution document.

### Final Target Tab Architecture

| # | Tab | Purpose | First-wave Status |
|---|-----|---------|-------------------|
| 1 | Mission Command | Operational dashboard: status, nudges, commands, settings, actions | Build in early wave |
| 2 | Agents | Agent management: registry, status, threads, routing context | Deferred to contract-backed wave |
| 3 | Skill Store | Skill catalog: browse, toggle, search, organization | Deferred to contract-backed wave |
| 4 | Mind | Cognitive architecture: health, memory, uncertainty, meditation | Reduced scope until runtime model is explicit |
| 5 | Docs | Onboarding, study guides, self-study, facilitator resources, local docs, and LearnAlex bridge | Build in early wave |

### Approved Mockup Inventory

These are the visual source-of-truth artifacts for the UI direction.

| File | Tab | Dimensions | Notes |
|------|-----|------------|-------|
| `mockups/command-center-v2-mission-control.svg` | Mission Command | 560x800 | Operational dashboard layout |
| `mockups/command-center-v2-agent-hub.svg` | Agents | 560x870 | Agent registry and thread concepts |
| `mockups/command-center-v2-skill-store.svg` | Skill Store | 560x812 | Skill browsing and toggles |
| `mockups/command-center-v2-mind.svg` | Mind | 560x960 | Cognitive architecture dashboard |
| `mockups/command-center-v2-docs.svg` | Docs | 560x920 | AlexLearn-aligned docs hub |

Only the approved v2 mockups above should be treated as active design inputs for implementation and review.

### Icon Artifact Inventory

The icon-design artifacts are already generated and should be treated as design inputs, not implementation blockers.

| Artifact | Value |
|---------|-------|
| Total icon positions | 38 |
| Options per position | 3 |
| Total SVG options | 114 |
| Categories | Tab Bar, Cognitive States, Agent Modes, Persona Categories, Default |
| Source directory | `alex_docs/research/mockups/icons/` |
| Generator script | `alex_docs/research/mockups/generate-icon-options.ps1` |

### Icon Category Breakdown

| Category | Count | Notes |
|----------|-------|-------|
| Tab bar icons | 5 | Mission Command, Agents, Skill Store, Mind, Docs |
| Cognitive state icons | 9 | building, debugging, planning, reviewing, learning, teaching, meditation, dream, discovery |
| Agent mode icons | 7 | Alex, Researcher, Builder, Validator, Documentarian, Azure, M365 |
| Persona category icons | 16 | Mapped to the 33 AlexLearn workshop personas |
| Default icon | 1 | Neutral fallback |

### Current-to-Target UI Summary

| Surface | Current State | Target State |
|---------|---------------|--------------|
| Sidebar views | 3 separate surfaces | 1 Command Center sidebar surface |
| Main interaction model | Single long scroll | Tabbed navigation |
| Welcome surface | Mixed operational + identity + docs content | Focused per-tab information architecture |
| Docs discovery | Scattered commands and links | Dedicated Docs tab |
| Learning portal alignment | Indirect | Direct LearnAlex companion-surface bridge |
| Avatar system | 112 PNG/WebP assets | SVG-first or hybrid strategy after spike |

### Embedded Docs Artifact Summary

The Docs tab content model from the feasibility report is preserved here as the product reference.

**Docs tab content groups:**
- Getting Started
- Workshop Study Guides (33 personas)
- Self-Study and Exercises
- Facilitator Materials
- Architecture docs
- Operations docs
- Learn Alex Online CTA
- Partnership guide

**Product relationship:**
- LearnAlex is the companion web surface for the Alex VS Code extension
- The Docs tab is the intentional bridge between the extension and that companion surface
- The tab should route users into LearnAlex's strongest pathways while also surfacing local extension documentation

**Alignment rule:**
- LearnAlex personas and targeted use cases are the source of truth for the new Docs-tab persona grid
- Persona categories used in icons, badges, and companion-facing UI should stay aligned to that LearnAlex taxonomy
- The extension should not create a parallel persona vocabulary for the new UI when a LearnAlex equivalent already exists

**AlexLearn-aligned primary surfaces:**
- `/setup-guide`
- `/self-study`
- `/exercises`
- `/session-plan`
- `/slides`
- `/demo-scripts`
- `/handout`
- `/pre-read`
- `/github-guide`
- `/responsible-ai`
- `/workshop/{persona}` for 33 personas

### Embedded Mission Command Artifact Summary

The Mission Command layout target from the feasibility report is preserved here as a design target, but implementation must respect the UI-first constraints of this master plan.

**Mission Command candidate cards from the design target:**
- Architecture Status Banner
- Smart Nudges
- Quick Command Bar
- Live Activity area
- Secret Manager
- Settings Manager
- Context Budget
- Personality Toggle

Implementation rule:
- Build only cards backed by existing or clearly derived runtime data in early waves
- Defer speculative cards until their contracts are documented

---

## API Feasibility Snapshot

This is the condensed API feasibility artifact pulled from the feasibility report and retained here so the master plan remains self-sufficient.

| Feature | API Exists? | Current Planning Position |
|---------|-------------|---------------------------|
| SVG chat avatar | Yes, via `IconPath` using `Uri` | Blocking runtime spike still required |
| Context budget bar | Yes, `maxInputTokens` and `countTokens()` exist | Treat as deferred until trustworthy aggregation is defined |
| Agent activity feed | No direct lifecycle API | Requires internal tracking; not first-wave UI |
| Skill toggle switches | No dedicated skill API | Requires settings-driven or local state approach |
| Tab state persistence | Yes, `getState()/setState()` exists | Use built-in webview state first |
| Sidebar badge | Yes, `WebviewView.badge` exists | Optional enhancement after shell proves stable |
| Typed messaging | No, message channel is untyped | Use explicit type guards in implementation |

### Planning Interpretation

- API existence does **not** automatically mean first-wave scope
- first-wave scope is determined by UI value, contract clarity, and implementation risk
- the only true technical blocker identified so far is the SVG chat avatar runtime path

---

## Planning Principles

### 1. UI First Means UI First

The first waves focus on visible structure, navigation, density, layout, and content hierarchy.

Do not block early UI progress on advanced telemetry, dynamic status systems, or complete avatar replacement.

### 2. Preserve Working Runtime Paths Until Their Replacements Exist

The current welcome view, PNG avatar path, and sidebar registrations are allowed to coexist with new work until the replacement path is proven.

No speculative cleanup in advance of proven functionality.

### 3. Blocking Spikes Must Be Resolved Before They Become Architecture

The SVG chat avatar path is a real technical unknown. It must be proven before the plan assumes it.

### 4. Treat Existing Data, Derived Data, and New Data as Separate Classes

Every proposed UI element must be classified as one of:

| Class | Meaning |
|------|---------|
| Existing | Already available from current runtime structures |
| Derived | Can be computed from current structures with modest glue code |
| New | Requires new instrumentation, tracking, or contracts |

This prevents hidden data work from being disguised as presentation work.

### 5. Curate, Don’t Mirror

The Docs tab should surface the strongest LearnAlex companion pathways, not duplicate the full website.

---

## In Scope vs Deferred

### In Scope for the UI-first master plan

- tabbed Command Center shell inside the existing welcome view surface
- Mission Command visual layout
- Docs tab aligned to AlexLearn's primary learning surfaces
- approved icon system as design source of truth
- keyboard-first tab navigation requirements
- empty-state design for every tab
- a clear migration path from three sidebar surfaces toward one

### Explicitly Deferred Until Later Waves

- true real-time agent state model (`ACTIVE / QUEUED / ROUTING / IDLE`)
- trustworthy context-budget percentage bar
- full five-modality memory model as live runtime UI
- full SVG replacement across all avatar paths if the spike fails or proves awkward
- command redirection cleanup before the Command Center replacement is demonstrably stable

---

## Product Definition

### Final Target

The final Command Center is a single sidebar surface with five tabs:

1. **Mission Command** — status, nudges, commands, settings, actions
2. **Agents** — agent registry, state, threads, routing context
3. **Skill Store** — skill catalog, toggles, search, organization
4. **Mind** — architecture, health, memory, uncertainty, meditation
5. **Docs** — onboarding, study guides, self-study, facilitator resources, local docs

### First Valuable Release

The first meaningful release is smaller:

1. Tab shell working inside the existing welcome view
2. Mission Command tab implemented with current runtime data
3. Docs tab implemented with AlexLearn-aligned content and local-doc entry points
4. Remaining tabs present as structured placeholders or reduced-scope surfaces
5. Existing avatar path still allowed if SVG migration is not yet proven

This is the smallest release that proves the concept without forcing all downstream architecture at once.

---

## Delivery Tracks

The plan is organized into three tracks so visual progress and technical certainty can advance in parallel.

### Track A - UI Surface

Focus: layout, tab shell, cards, content hierarchy, interaction model, keyboard behavior

### Track B - Runtime Contracts

Focus: state persistence, data mapping, message routing, refresh strategy, status model definitions

### Track C - Visual Identity

Focus: icon approvals, SVG viability, avatar migration, fallback model

The project should never stall because all three tracks are waiting on each other at once.

---

## Master Sequence

## Numbered Milestone Tracker

This tracker is the execution checklist for the UI-first rollout. Use it for sequencing and readiness decisions; do not schedule directly from the older feasibility tracker.

| # | Milestone | Primary Outcome | Depends On | Status |
|---|-----------|-----------------|------------|--------|
| 1 | Planning baseline locked | Master plan is the execution source of truth and feasibility doc is background-only for delivery sequencing | None | Planned |
| 2 | SVG/avatar spike resolved | Avatar strategy is chosen: full SVG, hybrid, or compact PNG fallback | 1 | Planned |
| 3 | Tab-shell spike resolved | Current welcome view can host the Command Center shell without breaking refresh or keyboard flow | 1 | Planned |
| 4 | Contract triage complete | Status, context-budget, recently-used, and Mind-model work is split into existing, derived, and new data | 2, 3 | Planned |
| 5 | Shell shipped | Stable tab bar, tab switching, empty states, and view-state restoration exist in-product | 3, 4 | Planned |
| 6 | Docs tab shipped | AlexLearn-aligned learning pathways and local-doc entry points are usable in the shell | 5 | Planned |
| 7 | Mission Command shipped | Operational dashboard replaces the current welcome-view core value with trustworthy data only | 5, 4 | Planned |
| 8 | Consolidation approved | Redundant sidebar surfaces can be removed without regressing normal workflows | 6, 7 | Planned |
| 9 | Advanced tabs expanded | Agents, Skill Store, and Mind move beyond placeholder or reduced-scope states on explicit contracts | 8 | Planned |

## Wave 0 - Planning Hygiene

**Goal**: Clean the plan before implementation starts.

### Deliverables

- This master plan becomes the execution source of truth
- Feasibility plan remains as background research and design rationale
- Stale counts and mixed assumptions are no longer used for scheduling

### Exit Criteria

- one execution document exists
- blocking spikes are explicitly named
- first milestone is narrow and testable

---

## Wave 1 - Critical Spikes

**Goal**: Resolve the technical assumptions that can invalidate major design choices.

### 1.1 SVG chat avatar spike

**Question**: Can the chat participant icon be updated using the intended SVG path cleanly in practice?

**Test outcomes:**
- `PASS`: SVG path is stable and ergonomic for the intended use
- `PARTIAL`: SVG works in webviews but not cleanly for chat participant updates
- `FAIL`: SVG introduces enough friction that the participant path should stay PNG-based

**Decision rule:**
- If `PASS`: continue toward unified SVG identity
- If `PARTIAL`: use hybrid strategy
- If `FAIL`: keep chat avatars on compact PNG fallback set and use SVG only in webviews

### 1.2 Minimal tab-shell spike

**Question**: Can the current welcome view host the Command Center shell without destabilizing refresh, commands, or keyboard flow?

### 1.3 Badge/status contract spike

**Question**: What status indicators can be shown immediately from existing data, and what would require new tracking?

### Exit Criteria

- avatar decision made
- shell viability proven
- status model split into existing / derived / new categories

---

## Wave 2 - Command Center Shell

**Goal**: Replace the visual structure of the welcome view without yet demanding full feature parity across all tabs.

### Includes

- tab bar
- active-tab rendering
- keyboard navigation model
- responsive content zones for 300px sidebar width
- empty states for all tabs
- built-in webview state strategy for active tab and scroll restoration

### Excludes

- full Agents tab behavior
- full Skill Store behavior
- full Mind tab behavior
- legacy sidebar removals

### State Strategy

- use `getState()/setState()` for active tab and lightweight view restoration
- use `globalState` only if needed for recently-used history or future personalization

### Exit Criteria

- one shell exists inside the current welcome view surface
- tab switching is stable
- refresh behavior is predictable
- empty states are intentionally designed, not placeholders of neglect

---

## Wave 3 - Docs Tab (First Full Tab)

**Goal**: Ship the lowest-risk, highest-clarity tab first.

### Why Docs first

- strongest content clarity
- lowest dependence on new telemetry
- real product value even before deeper architecture work
- validates density, navigation, and information hierarchy in the sidebar

### Includes

- Getting Started cards
- Workshop Study Guides grid for 33 personas
- Self-Study and Exercises section
- Facilitator Materials section
- local architecture and operations doc entry points
- Learn Alex Online CTA
- Partnership guide entry point

### Product framing

The Docs tab is **curated AlexLearn alignment**, not a complete copy of learnalex.correax.com.

### Exit Criteria

- primary AlexLearn learning pathways are accessible from the sidebar
- links are stable
- layout is usable at sidebar width
- content groups feel intentional rather than crowded

---

## Wave 4 - Mission Command (First Operational Tab)

**Goal**: Deliver the main operational dashboard using current runtime data.

### Includes

- architecture status banner
- smart nudges from current welcome-view logic
- quick command area
- current session and goal summaries where already available
- settings and secret-entry affordances only where backed by current commands

### Excludes for this wave

- speculative activity feed if no solid status model exists yet
- context budget percentage if not backed by a trustworthy contract

### Data policy

Every Mission Command card must be tagged internally as:
- existing data
- derived data
- deferred because it needs new tracking

### Exit Criteria

- Mission Command is immediately more useful than the current welcome view
- no card depends on invented or misleading data

---

## Wave 5 - Controlled Consolidation

**Goal**: Remove old sidebar duplication only after the new surface is proven.

### Includes

- remove redundant sidebar registrations only when the Command Center replacement is stable
- redirect legacy commands only after their destination behavior is clear
- preserve editor-panel dashboards if they still serve deeper use cases

### Rule

Do not archive or gut working modules before their replacements are running in the product.

### Exit Criteria

- new sidebar surface handles the intended user journeys
- redundant sidebar views can be removed without capability loss for normal workflows

---

## Wave 6 - Advanced Tabs

**Goal**: Expand Agents, Skill Store, and Mind only after their contracts are explicit.

### Agents tab requires

- explicit definition of status semantics
- thread model and data source
- what counts as active, queued, routing, and idle

### Skill Store requires

- stable skill catalog source and health model
- clear distinction between display, enable/disable behavior, and future install behavior

### Mind tab requires

- explicit source of truth for memory groupings
- clear separation between conceptual architecture and runtime metrics

### Exit Criteria

- advanced tabs are built on defined contracts rather than UI aspiration

---

## Visual Identity Plan

### Approved assets process

- 38 icon positions
- 114 options total
- icon approval remains a design artifact, not a hard blocker for shell work

### Avatar strategy

Use one of these only after the Wave 1 spike:

| Strategy | When to use |
|---------|-------------|
| Full SVG | Only if chat participant + webview paths both work cleanly |
| Hybrid | SVG in webviews, compact PNG fallback for chat participant |
| Compact PNG fallback | If SVG introduces unnecessary fragility |

### Rule

Do not let visual identity decisions block shell and Docs progress.

---

## Data Contract Backlog

These items must not be treated as solved until documented.

### Contract A - Agent status

Needs definition for:
- active
- queued
- routing
- idle
- refresh timing
- stale-state handling

### Contract B - Context budget

Needs definition for:
- token-count source
- aggregation point
- refresh cadence
- what is estimated vs exact

### Contract C - Mind model

Needs definition for:
- memory modality mapping
- relationship between conceptual architecture and runtime files
- what is measured live vs narrated conceptually

### Contract D - Recently used

Needs definition for:
- what events are tracked
- where they persist
- whether they are per workspace, per machine, or global

---

## Risk Register

This register tracks the execution risks that can materially delay, derail, or distort the Command Center rollout. Review it at each milestone transition, especially before Wave 1, Wave 3, Wave 4, and Wave 5.

| ID | Risk | Probability | Impact | Trigger / Early Warning | Response | Owner | Status |
|----|------|-------------|--------|-------------------------|----------|-------|--------|
| R1 | SVG avatar path proves awkward or brittle across chat participant and webview surfaces | High | High | SVG works inconsistently, adds update friction, or complicates runtime asset handling | Run the avatar spike first; choose full SVG, hybrid, or compact PNG fallback based on evidence | UI + runtime spike owner | Open |
| R2 | Hidden backend or contract work is mistaken for simple UI work | High | High | A tab design depends on undefined status semantics, new telemetry, or unclear persistence behavior | Classify every card as existing, derived, or new data before implementation; defer contract-heavy elements | Feature lead | Open |
| R3 | Sidebar density collapses usability at 300px width | Medium | High | Tabs require long-scroll browsing, cards feel cramped, or primary actions disappear below the fold | Prioritize Docs and Mission Command first; reduce default density; push overflow into lower disclosure levels | UX lead | Open |
| R4 | Plan drift reappears through stale counts, renamed concepts, or conflicting docs | Medium | Medium | Milestones, tab names, or artifact counts diverge across planning docs | Keep this master plan as the execution source of truth and treat feasibility/design docs as supporting rationale only | Planning owner | Open |
| R5 | Command migration or sidebar consolidation breaks user expectations | Medium | High | Existing commands lose discoverability, old views disappear too early, or replacement flows feel incomplete | Delay redirects and removals until replacement behavior is stable and tested in normal workflows | Extension owner | Open |
| R6 | Mission Command shows untrustworthy or misleading operational data | Medium | High | Cards rely on guessed values, stale status, or mixed live and conceptual data | Gate Mission Command cards behind explicit data classification and remove any card that cannot defend its source | Runtime contract owner | Open |
| R7 | Mind tab overpromises introspection that the runtime model cannot yet support | Medium | High | Mockup concepts outpace actual measurable architecture data or blur conceptual vs live signals | Keep Mind reduced-scope until model contracts are explicit; separate narrated architecture from measured runtime state | Cognitive model owner | Open |
| R8 | Recently-used and personalization features ship without a stable persistence model | Medium | Medium | Quick Actions or recent sections behave inconsistently across workspace or machine boundaries | Define persistence scope before adaptive UX ships; implement tracking before dependent features go live | Personalization owner | Open |

### Risk Review Rules

1. Do not close a risk because the design looks settled; close it only when the implementation evidence exists.
2. Any `High / High` risk must have an explicit spike, contract decision, or gating rule before dependent work starts.
3. If a risk trigger is observed during implementation, stop expanding scope and resolve the risk before continuing downstream tabs.
4. When a risk is retired, record the decision in the relevant milestone notes or linked implementation artifact.

---

## Acceptance Criteria by Milestone

### Milestone A - Spikes complete

- avatar strategy chosen
- shell viability proven
- status/data backlog classified

### Milestone B - Shell complete

- tab bar works
- keyboard navigation works
- tab state restoration works
- all tabs have designed empty states

### Milestone C - Docs complete

- primary AlexLearn pathways accessible
- local docs grouped clearly
- no false "site mirror" obligation encoded

### Milestone D - Mission Command complete

- status and actions are clearer than the current welcome view
- only trustworthy data is shown

### Milestone E - Consolidation complete

- duplicate sidebar surfaces can be removed without normal-user regression

---

## Suggested Versioning Path

This is intentionally conservative.

| Candidate | Scope |
|----------|-------|
| v6.x planning cycle | master plan, spikes, shell groundwork |
| v6.x UI milestone | shell + Docs + Mission Command |
| v6.x consolidation milestone | sidebar simplification after proof |
| v7.x advanced milestone | richer Agents / Skill Store / Mind once contracts are real |

This avoids tying the entire concept to one large release jump.

---

## Decision Summary

### Build now

- tab shell
- Docs tab
- Mission Command tab
- keyboard-first interaction
- empty states
- curated AlexLearn integration

### Prove first

- SVG chat avatar viability
- status badge model
- context budget model
- true memory modality mapping

### Delay until stable

- full sidebar consolidation
- legacy command redirection
- fully dynamic Agents / Skill Store / Mind experiences

---

## Bottom Line

The feasibility plan established the right destination. This master plan defines the safer path to get there.

The Command Center should be built as a **UI-first, proof-driven evolution** of the welcome view. The right first win is not total replacement. The right first win is a stable shell plus two genuinely useful tabs, backed by existing reality rather than hidden assumptions.

That approach preserves momentum, reduces risk, and gives the project room to mature the deeper systems behind the UI without pretending they already exist.

---

## Implementation Guardrails

These are the non-negotiables for UI-first delivery.

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
