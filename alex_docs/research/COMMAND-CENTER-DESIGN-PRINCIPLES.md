# Command Center Design Principles

**Source**: Meditation consolidation (March 5, 2026)
**Status**: Consolidated insights for implementation guidance
**Session**: 5-tab iterative design review with per-tab approval cycle

---

## Final Tab Architecture

| # | Tab | Purpose | Approval |
|---|-----|---------|----------|
| 1 | Mission Ctrl | Operational dashboard — status, commands, nudges, secrets, settings | ✅ |
| 2 | Agents | Agent management — cognitive state, parallel agents, registry, threads | ✅ |
| 3 | Skill Store | Skill catalog — browse, toggle, search, 3-tier organization | ✅ |
| 4 | Mind | Cognitive introspection — brain health, memory, age, uncertainty, meditation | ✅ |
| 5 | Docs | Documentation hub — nudges, local guides, architecture, learnalex.correax.com | ✅ |

---

## Core Principles

### 1. Scarcity Forces Clarity

The 300px sidebar constraint is a design *advantage*. Every element must justify its space. If it doesn't serve the user's immediate intent, it belongs on a deeper tab or behind a search.

**Rule**: No decorative-only elements on the Mission Control tab. Every pixel must inform or activate.

### 2. Data Layer Leads, Presentation Follows

The data sources (health check, persona detection, skill recommendations, nudges, session tracking) are already implemented and parallelized. The Command Center is a *presentation refactor*, not a data engineering project. This dramatically reduces implementation risk.

**Rule**: Never add a UI element that requires a new data source until existing data sources are fully surfaced.

### 3. Mind Tab — The Differentiator

The Mind tab is the feature no other AI assistant has. It exposes brain health, 5 memory modalities (Semantic, Procedural, Episodic, Visual, Muscles), cognitive age, honest uncertainty, and meditation state. This is the North Star made visible — trust through transparency.

**Rule**: When a tab concept feels interchangeable with any generic tool, it violates the North Star. Mind was born from rejecting Automations twice.

### 4. State Over Identity

The avatar's primary job is to show *what Alex is doing*, not what Alex looks like. Moving from 112 PNG portraits to ~25 SVG state icons is a philosophical shift: from "AI character" to "cognitive partner."

**Rule**: Avatar color and shape encode cognitive state first, persona second.

### 5. Progressive Disclosure at Every Scale

One pattern, three applications:
- **Skills**: name → body → resources (3-level)
- **Navigation**: tab → sidebar compact → full panel (Option C)
- **Actions**: Quick Actions → Agents tab → command palette

**Rule**: No tab should require scrolling. If it does, content should move to a lower disclosure level.

### 6. Context-Adaptive Over Static

The same user debugging TypeScript should see different Quick Actions than when they're writing documentation. Persona detection + active file + recent activity already provide the signals.

**Rule**: Quick Actions must change when persona or cognitive state changes. Static equals stale.

### 7. Keyboard-First Navigation

VS Code users are keyboard-first. Tab switching needs:
- `Ctrl+1` through `Ctrl+5` when sidebar has focus
- Command palette entries: "Alex: Switch to Mission Control", etc.
- Arrow key navigation between tab items
- Focus trap within active tab content

**Rule**: Every action reachable by mouse must also be reachable by keyboard.

### 8. Empty States Are Coaching

What does the Skill Store show for a new user with zero skills? What does Mind show before the first dream? These are identity moments — not error states.

Empty state pattern:
- Friendly message explaining what *will* show here
- Single action button to get started
- No "nothing to show" language — use "ready when you are" language

**Rule**: Every tab has a designed empty state that guides the user toward first use.

### 9. Recently Used Is the Personalization Foundation

The "recently used" tracker isn't a 0.5-day feature — it's the foundation for:
- Agents tab "Recent Threads" section
- Mission Control context-adaptive Quick Actions
- Future: personalized nudges
- Future: usage analytics for tab prioritization

**Rule**: Ship usage tracking in Phase 0 and start collecting data immediately.

## Design Risk: Phase Coupling

The gantt chart couples SVG avatar migration with Mission Control layout. These can be decoupled:
- **Phase 1a**: Tab bar + Mission Control layout with *existing* PNG avatars
- **Phase 1b**: SVG avatar migration (can ship independently)

Decoupling derisks the critical path — tab layout can ship and validate without waiting for SVG icon design.

## Design Decisions Log

### Automations → Mind (Rejected × 2)
- **Round 1 rejection**: "Too generic" — workflows/rules/templates don't differentiate Alex
- **Round 2 rejection**: "Completely different" — still too tool-centric
- **Resolution**: Mind tab — cognitive architecture dashboard with 5 memory modalities, brain health, honest uncertainty
- **Lesson**: If a concept is interchangeable with any AI assistant, it violates the North Star

### Activity → Docs
- **Rationale**: Activity/diff tracking is better served at the agent level (per-thread). Documentation hub is more useful as a persistent sidebar surface
- **Key addition**: learnalex.correax.com CTA as expansion pathway for learning content
- **Nudge system reuse**: Tips & Nudges section reuses existing `Nudge` interface from `welcomeViewHtml.ts`

### Tab Order Change
- **Original**: Mission Ctrl | Agents | Skill Store | Mind | Activity
- **Final**: Mission Ctrl | Agents | Skill Store | Mind | Docs
- Mind placed 4th because it's the differentiator — users discover it naturally

## SVG Mockup Design System

### Canvas
- **Width**: 560px total = 320px UI mockup + 240px annotation column
- **Height**: Variable per tab (800–960px)
- **Background**: `#1e1e1e` (VS Code dark theme base)

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#1e1e1e` | Canvas, main background |
| Card surface | `#252526` | Content cards, panels |
| Tab bar | `#2d2d2d` | Tab navigation strip |
| Active tab bg | `#1e1e1e` | Selected tab background |
| Primary accent | `#6366f1` | Active indicators, buttons, links |
| Annotation label | `#a78bfa` | Arrow labels in annotation column |
| Annotation bg | `#181820` | Annotation column background |
| Arrow elements | `#4a4a6a` | Dashed leader lines, arrowheads |
| Text primary | `#ffffff` | Headings, active tab text |
| Text secondary | `#cccccc` | Body text, descriptions |
| Text muted | `#888888` | Metadata, timestamps |

### Typography
- **UI headings**: Segoe UI, 11–13px, semibold/bold
- **UI body**: Segoe UI, 9–11px, regular
- **Code/data**: Cascadia Code, 9–10px
- **Annotation labels**: Segoe UI, 10px, semibold, `#a78bfa`

### Tab Bar Layout
- **Tab bar y-position**: 36px (below 30px header)
- **Tab bar height**: 28px
- **Active tab**: Dark bg rect + white bold text + 2px purple underline
- **Inactive tab**: No bg + muted text
- **Tab x-positions**: 38, 106, 165, 206–234, 268–296

### Annotation System
- **Column start**: x = 330 (10px gap after 320px UI)
- **Leader lines**: Dashed stroke `#4a4a6a`, stroke-width 1, dasharray 4,3
- **Arrow markers**: 8×6 triangles, `#4a4a6a` fill
- **Label pills**: Rounded rect `#181820` bg, `#a78bfa` text, 10px font
- **Description text**: `#888888`, 8–9px, wraps within annotation width

## Document Maintenance Pattern

After 3 rounds of tab renaming, the feasibility doc required 11+ replacements. **Checklist for future renames**:

1. Effort estimate tables (work item names)
2. Gantt/timeline phase names
3. Mermaid diagram labels (all Options A/B/C/D)
4. "What This Achieves" comparison tables
5. Command redirect tables
6. Future Path roadmap labels
7. Success criteria references
8. Prose mentions ("the X tab")

## Missing Features Identified

| Feature | Tab | Priority | Notes |
|---------|-----|----------|-------|
| Keyboard tab switching | All | P0 | Keybindings + arrow nav |
| Empty states | All | P0 | Coaching moments for new users |
| Quick Action personalization | Mission Ctrl | P1 | Depends on recently-used data |
| Skill favoriting | Skill Store | P2 | Star/pin preferred skills |
| Agent pinning | Agents | P2 | Pin preferred agents to top |
| Search history | Agents, Skill Store | P3 | Remember previous searches |
| Tab badge counts | Tab bar | P2 | e.g., "Mind (3)" for broken synapses |
| Drag-and-drop reorder | Agents | P3 | Let users reorder categories |

## Mockup Inventory

### Active v2 Mockups (approved)
| File | Tab | Dimensions | Annotations |
|------|-----|------------|-------------|
| `command-center-v2-mission-control.svg` | Mission Ctrl | 560×800 | 8 |
| `command-center-v2-agent-hub.svg` | Agents | 560×870 | 8 |
| `command-center-v2-skill-store.svg` | Skill Store | 560×812 | 7 |
| `command-center-v2-mind.svg` | Mind | 560×960 | 9 |
| `command-center-v2-docs.svg` | Docs | 560×920 | 6 |

### v1 Originals (historical reference)
`command-center-home.svg`, `command-center-tools.svg`, `command-center-skills.svg`, `command-center-status.svg`, `command-center-more.svg`

### Comparisons (v1 → v2)
`comparison-home-vs-mission-control.svg`, `comparison-tools-vs-agent-hub.svg`, `comparison-skills-vs-skill-store.svg`

### Obsolete Comparisons
- `comparison-status-vs-automations.svg` — Mind replaced Automations entirely
- `comparison-more-vs-activity.svg` — Docs replaced Activity entirely

---

*"The best interface doesn't show you everything. It shows you the right thing at the right time."*
