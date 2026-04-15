---
description: "Planning-first development discipline: strategic artifacts (PLAN, UX vision, UI specs, visual guidance, tracker) must exist before implementation code"
application: "When generating images, managing visual assets, or maintaining brand consistency"
applyTo: "**/PLAN*,**/*plan*,**/*spec*,**/*design*,**/*ux*"
---

# Planning-First Development

> Do not jump into doing. Plan the actions first.

**Related**: research-first-workflow (research before planning), skill-selection-optimization (planning identifies skills), ui-ux-design (UX vision follows design principles)

---

## Principle

Research tells you what exists and what is possible. Planning tells you what to build, for whom, and in what order. Code is the last step, not the first. Projects that skip planning pay in rework, scope creep, and misaligned outcomes.

## When to Apply

| Trigger | Scope |
|---------|-------|
| New project initiated | Full planning sequence |
| New major feature or phase | Strategy + UX + tracker update |
| User says "build", "create", "implement" for something non-trivial | Check: do planning artifacts exist? |
| Heir project bootstrapped | Full planning sequence after research |

### Skip Conditions

- Bug fixes, hotfixes, single-file changes
- Tasks with an existing plan and tracker
- Exploratory spikes explicitly labeled as throwaway

## Planning Sequence

Research comes first (see research-first-workflow). Planning follows research and precedes implementation.

```
Research (knowledge) → Planning (strategy) → Knowledge Encoding (brain) → Implementation (code)
         ↑                    ↑                       ↑                          ↑
   research-first     THIS INSTRUCTION          research-first              execute
```

### Phase 1: Strategic Plan (PLAN.md)

The project's source of truth. One document that answers: what, why, for whom, how, and in what order.

**Required sections:**

| Section | Purpose |
|---------|---------|
| Vision | One paragraph: what this project does and why it matters |
| Problem Statement | What pain exists today, with specifics |
| Target Users | Persona table: who they are, what they need, how they use the tool |
| Capability Matrix | Features grouped by phase, each with description and research basis |
| Architecture | High-level diagram (Mermaid) showing major components and data flow |
| Tech Stack | Languages, frameworks, platforms, dependencies with rationale |
| Phased Roadmap | Numbered phases with clear scope boundaries and dependencies |
| Trade-offs | What you chose NOT to do and why (proves deliberate scoping) |

**Quality gate**: PLAN.md exists, has all sections, and every capability traces to a research document or user need.

### Phase 2: UX Vision (ux-vision.md)

How the product feels and flows. Not wireframes; interaction design principles and user journeys.

**Required sections:**

| Section | Purpose |
|---------|---------|
| Core UX Thesis | One sentence: the fundamental interaction paradigm |
| Design Principles | 4-6 principles with enforcement rules (not aspirational: actionable) |
| Interaction Model | How users interact: conversation, commands, GUI, or hybrid |
| Progressive Disclosure | What each persona tier sees; complexity never leaks upward |
| Error Recovery | How failures are communicated: human language, next steps, no stack traces |
| Visual Response Format | What output looks like: charts, layouts, themes, text |

**Quality gate**: Each design principle has at least one concrete enforcement rule. Persona tiers are defined with clear boundaries.

### Phase 3: UI Specification (ui-spec.md)

Concrete component layout, commands, and behaviors. ASCII mockups before pixels.

**Required sections:**

| Section | Purpose |
|---------|---------|
| Layout Mockup | ASCII art showing spatial arrangement of UI elements |
| Component Inventory | Every button, panel, tab, indicator with icon, command ID, behavior |
| State Transitions | How UI responds to state changes (connection, errors, loading) |
| Implementation Pattern | Code structure reference (e.g., WebviewViewProvider, TreeView) |

**Quality gate**: Every UI element in the mockup has a corresponding entry in the component inventory with a defined command.

### Phase 4: Visual Guidance (visual-guidance/)

Design system for any project that produces visual output (charts, themes, layouts, reports).

**Common artifacts:**

| File | Purpose |
|------|---------|
| design-principles.md | Enforceable visual rules (e.g., Kirk, Knaflic) |
| color-palette.md | Color tokens, accessibility ratios, semantic meaning |
| chart-selection.md | Decision matrix: data shape to chart type |
| layout-principles.md | Composition patterns, grid systems, spacing |
| accessibility.md | WCAG compliance rules, contrast requirements |
| theme-generation.md | Brand-to-theme conversion rules |

**Quality gate**: Skip this phase for non-visual projects. For visual projects, at minimum: design-principles.md and color-palette.md exist.

### Phase 5: Implementation Tracker (TRACKER.md)

Granular task tracking with IDs, statuses, priorities, and phase grouping.

**Structure:**

| Column | Purpose |
|--------|---------|
| ID | Hierarchical (F1.1, P1.2.3) for traceability |
| Task | Specific, actionable description |
| Status | Not started, In progress, Done, Blocked, Deferred |
| Priority | P0 (must-have), P1 (should-have), P2 (nice-to-have) |
| Notes | Dependencies, decisions, links to research |

**Quality gate**: Every capability from PLAN.md decomposes into tracker tasks. No orphan tasks that do not trace to a planned capability.

## Enforcement Checklist

Before writing implementation code, verify:

| Check | Artifact |
|-------|----------|
| Vision and scope are documented | PLAN.md |
| Users and their needs are defined | PLAN.md target users table |
| Architecture is diagrammed | PLAN.md architecture section |
| Interaction design is specified | ux-vision.md |
| UI is mocked and inventoried | ui-spec.md |
| Tasks are decomposed and prioritized | TRACKER.md |
| Research backs every major decision | research/ folder |
| Trade-offs are explicit | PLAN.md trade-offs section |

Missing any of the first 6? Stop and create them first.

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| "Let me just code a prototype" | Prototype becomes production; no one goes back to plan | Write PLAN.md first, even if brief |
| Research without strategy | 17 research docs but no roadmap; knowledge without direction | PLAN.md follows research immediately |
| UX by accident | UI designed as code is written; inconsistent interactions | ux-vision.md before any UI code |
| Task list without decomposition | "Build the app" as a single task | Hierarchical IDs (F1.1, P1.2.3) in TRACKER.md |
| Planning without tracking | Great plan, no progress visibility | TRACKER.md with regular status updates |

## Integration with Research-First Workflow

The research-first-workflow defines: Research → Encode → Gap Analysis → Execute.

Planning-first inserts **Strategy** between Research and Encode:

```
Research → Strategy → Encode → Gap Analysis → Execute
  (Phase 0)   (THIS)   (Phase 1)  (Phase 2)    (Phase 3)
```

The Strategy phase produces: PLAN.md, ux-vision.md, ui-spec.md, visual-guidance/, TRACKER.md. These artifacts inform the Encode phase (what skills, instructions, and agents to create) and the Execute phase (what to build, in what order).
