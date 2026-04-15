---
name: "ascii-project-dashboard"
description: "Create and maintain ASCII visual dashboards for project tracking with parallel lane progress bars"
tier: standard
applyTo: "**/*plan*,**/*roadmap*,**/*tracker*,**/*dashboard*"
inheritance: inheritable
---

# ASCII Project Dashboard

> Visual project tracking that works everywhere — no dependencies, no rendering, pure text.

## Why ASCII Dashboards?

| Feature | Benefit |
|---------|---------|
| **Universal rendering** | Works in any editor, terminal, email, Slack, GitHub |
| **No dependencies** | No chart libraries, no build step, no broken images |
| **Version control friendly** | Diffs show exactly what changed |
| **Accessible** | Screen readers handle text; they struggle with images |
| **Copy-paste portable** | Works everywhere text works |

## Core Components

### 1. Lane Header (Visual Overview)

```
     🧠 BRAIN          🔄 HEIR SYNC       ⚙️ EXTENSION       🎨 UI/UX
   Skills, Synapses   Architecture      TypeScript Code    Sidebar Design
   ─────────────────  ─────────────────  ─────────────────  ─────────────────
   ▓▓▓░░░░░░░ 30%     ▓▓▓▓▓░░░░░ 50%     ▓░░░░░░░░░ 10%     ░░░░░░░░░░  0%
```

**Elements:**
- Emoji icon for quick lane identification
- Lane name in bold caps
- Subtitle describing scope
- Horizontal rule (─) for visual separation
- Progress bar with percentage

### 2. Progress Bar Syntax

| Progress | Bar | Percentage |
|----------|-----|------------|
| 0% | `░░░░░░░░░░` | Empty |
| 10% | `▓░░░░░░░░░` | 1 filled |
| 20% | `▓▓░░░░░░░░` | 2 filled |
| 30% | `▓▓▓░░░░░░░` | 3 filled |
| 40% | `▓▓▓▓░░░░░░` | 4 filled |
| 50% | `▓▓▓▓▓░░░░░` | 5 filled |
| 60% | `▓▓▓▓▓▓░░░░` | 6 filled |
| 70% | `▓▓▓▓▓▓▓░░░` | 7 filled |
| 80% | `▓▓▓▓▓▓▓▓░░` | 8 filled |
| 90% | `▓▓▓▓▓▓▓▓▓░` | 9 filled |
| 100% | `▓▓▓▓▓▓▓▓▓▓` | Full |

**Characters:**
- `▓` (U+2593) — Filled block
- `░` (U+2591) — Empty block
- Always 10 characters for consistency

### 3. Summary Table

```markdown
| Lane | Focus | Tasks | Done | Progress |
| ---- | ----- | ----- | ---- | -------- |
| 🧠 **Brain** | Skills, instructions, prompts | 12 | 4 | ▓▓▓░░░░░░░ 33% |
| 🔄 **Sync** | Architecture, inheritance | 8 | 4 | ▓▓▓▓▓░░░░░ 50% |
| ⚙️ **Code** | TypeScript, commands, views | 10 | 1 | ▓░░░░░░░░░ 10% |
| 🎨 **UI** | Sidebar, tabs, feedback | 10 | 0 | ░░░░░░░░░░  0% |
| **TOTAL** | **All lanes** | **40** | **9** | **▓▓░░░░░░░░ 23%** |
```

### 4. Task Backlog Tables

```markdown
#### 🧠 Brain (4/12)

| ID | Task | Status | Blocks |
|----|------|--------|--------|
| B1 | Health status rules | ✅ | — |
| B2 | Meditation parsing | ✅ | — |
| B3 | Dream state markers | ✅ | — |
| B4 | Synapse scoring | ✅ | — |
| B5 | Chat memory audit | ⬜ | — |
| B6 | Frecency ranking | 🔄 | UI1 |
```

**Status Icons:**
- `⬜` — Not started
- `🔄` — In progress
- `✅` — Complete
- `🚫` — Blocked
- `⏸️` — Paused

### 5. Sprint Focus Box

```markdown
### Current Sprint

**v7.10.0 — Health Pulse Data Model** 🏗️ `4/37` ▓░░░░░░░░░

#### File Setup (2/2) ✅
- [x] Create `src/views/healthPulse.ts`
- [x] Add exports to `src/views/index.ts`

#### Interface Definition (2/15) 🔄
- [x] Define `HealthStatus` type
- [x] Define `HealthPulse` interface
- [ ] `status: HealthStatus`
...
```

## Layout Patterns

### Pattern A: Horizontal Lanes (Wide Screens)

Best for: README files, documentation, wide terminals

```
     LANE 1           LANE 2            LANE 3            LANE 4
   Description 1    Description 2     Description 3     Description 4
   ─────────────    ─────────────     ─────────────     ─────────────
   ▓▓▓░░░░░░░ 30%   ▓▓▓▓▓░░░░░ 50%    ▓░░░░░░░░░ 10%    ░░░░░░░░░░  0%
```

### Pattern B: Vertical Lanes (Narrow Screens)

Best for: Sidebars, mobile, narrow terminals

```
🧠 BRAIN ▓▓▓░░░░░░░ 30%
🔄 SYNC  ▓▓▓▓▓░░░░░ 50%
⚙️ CODE  ▓░░░░░░░░░ 10%
🎨 UI    ░░░░░░░░░░  0%
```

### Pattern C: Milestone Timeline

```
v7.9 ────●──── v7.10 ────●──── v7.15 ────○──── v8.0
         ✅           🔄              ⬜         🎯
```

**Timeline Characters:**
- `●` — Completed milestone
- `○` — Future milestone
- `─` — Timeline connector
- `✅` — Shipped
- `🔄` — In progress
- `⬜` — Planned
- `🎯` — Target

## Update Protocol

### When to Update

| Trigger | Action |
|---------|--------|
| Task completed | Update status icon, increment Done count, recalculate bar |
| Sprint changes | Update sprint box, move tasks |
| Lane rebalanced | Recalculate task counts, update header bars |
| Major milestone | Update timeline, archive completed sprint |

### Calculation Rules

```
percentage = Math.round((done / total) * 100)
filledBlocks = Math.round(percentage / 10)
emptyBlocks = 10 - filledBlocks
bar = '▓'.repeat(filledBlocks) + '░'.repeat(emptyBlocks)
```

### Alignment Tips

- Right-align percentages for visual scanning
- Use consistent column widths in tables
- Keep emoji icons in first column for quick identification
- Use monospace font assumption (10 chars = 10 chars)

## Integration Points

### With Universal Creative Loop

Map dashboard lanes to loop stages:

| Loop Stage | Typical Lanes |
|------------|---------------|
| IDEATE | Research, Exploration |
| PLAN | Architecture, Design |
| BUILD/CREATE | Code, Content, Assets |
| TEST | QA, Validation |
| RELEASE | Deploy, Publish |
| IMPROVE | Maintenance, Brain |

### With Planning Documents

Every `PLAN-*.md` should have:
1. ASCII lane header at top
2. Summary table after header
3. Lane backlogs with task IDs
4. Current sprint focus box

### With Release Notes

Include mini-dashboard showing what shipped:

```markdown
## v7.10.0 Release Summary

🧠 Brain  ▓▓▓▓░░░░░░  +4 tasks
⚙️ Code   ▓▓░░░░░░░░  +2 tasks
🎨 UI     ▓░░░░░░░░░  +1 task
```

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Use images for progress | ASCII bars work everywhere |
| Hardcode percentages | Calculate from task counts |
| Update manually | Use muscle script for consistency |
| Mix bar styles | Stick to `▓░` pair |
| Forget alignment | Right-align numbers, left-align text |

## Related Skills

| Skill | Relationship |
|-------|--------------|
| **planning-first-development** | Dashboards are planning artifacts |
| **status-reporting** | Dashboards inform status reports |
| **markdown-mermaid** | Mermaid for complex diagrams, ASCII for progress |
| **north-star** | Dashboard tracks progress toward North Star |

## Quick Reference

```
Progress:  ░░░░░░░░░░ 0%  →  ▓▓▓▓▓░░░░░ 50%  →  ▓▓▓▓▓▓▓▓▓▓ 100%
Status:    ⬜ not started  |  🔄 in progress  |  ✅ complete  |  🚫 blocked
Timeline:  ●──────●──────○──────🎯
Lanes:     🧠 Brain | 🔄 Sync | ⚙️ Code | 🎨 UI
```
