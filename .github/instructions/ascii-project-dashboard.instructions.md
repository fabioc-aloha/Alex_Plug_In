---
description: "ASCII visual dashboards for project tracking with parallel lanes and progress bars"
application: "When creating or updating project plans, roadmaps, or trackers"
applyTo: "**/*plan*,**/*roadmap*,**/*tracker*,**/*dashboard*,**/*PLAN-*"
---

# ASCII Project Dashboard

Auto-loaded for planning documents. Creates visual project tracking that works everywhere.

## Quick Reference

### Progress Bar

```
░░░░░░░░░░  0%    ▓▓▓░░░░░░░ 30%    ▓▓▓▓▓▓▓░░░ 70%    ▓▓▓▓▓▓▓▓▓▓ 100%
```

**Characters:** `▓` (filled) + `░` (empty) — always 10 total

### Lane Header Template

```
     🧠 LANE NAME      🔄 LANE NAME       ⚙️ LANE NAME       🎨 LANE NAME
   Subtitle here     Subtitle here      Subtitle here      Subtitle here
   ─────────────────  ─────────────────  ─────────────────  ─────────────────
   ▓▓▓░░░░░░░ 30%     ▓▓▓▓▓░░░░░ 50%     ▓░░░░░░░░░ 10%     ░░░░░░░░░░  0%
```

### Status Icons

| Icon | Meaning |
|------|---------|
| `⬜` | Not started |
| `🔄` | In progress |
| `✅` | Complete |
| `🚫` | Blocked |

### Calculation

```
percentage = round((done / total) * 100)
filled = round(percentage / 10)
bar = '▓' × filled + '░' × (10 - filled)
```

## When to Create Dashboard

| Trigger | Action |
|---------|--------|
| New project plan | Add lane header + summary table |
| Multi-track work | Create parallel lanes |
| Sprint planning | Add sprint focus box |
| Status report | Include mini-dashboard |

## Template

```markdown
## Tracker

### Parallel Lanes

     🧠 LANE 1         🔄 LANE 2          ⚙️ LANE 3          🎨 LANE 4
   Description       Description        Description        Description
   ─────────────────  ─────────────────  ─────────────────  ─────────────────
   ░░░░░░░░░░  0%     ░░░░░░░░░░  0%     ░░░░░░░░░░  0%     ░░░░░░░░░░  0%

| Lane | Focus | Tasks | Done | Progress |
| ---- | ----- | ----- | ---- | -------- |
| 🧠 **Lane 1** | Description | 0 | 0 | ░░░░░░░░░░ 0% |
| 🔄 **Lane 2** | Description | 0 | 0 | ░░░░░░░░░░ 0% |
| ⚙️ **Lane 3** | Description | 0 | 0 | ░░░░░░░░░░ 0% |
| 🎨 **Lane 4** | Description | 0 | 0 | ░░░░░░░░░░ 0% |
| **TOTAL** | **All lanes** | **0** | **0** | **░░░░░░░░░░ 0%** |
```

## Do NOT

- Use images or external chart tools for simple progress
- Hardcode percentages without task counts
- Mix `▓░` with other block characters
- Forget to update when tasks complete
