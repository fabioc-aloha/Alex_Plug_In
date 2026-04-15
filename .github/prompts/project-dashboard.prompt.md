---
description: "Generate or update ASCII project dashboard with parallel lanes"
mode: agent
---

# Create Project Dashboard

Generate an ASCII visual dashboard for tracking parallel workstreams.

## Context

I need a project dashboard for: {{projectName}}

## Lanes

{{#each lanes}}
- **{{name}}**: {{description}} ({{taskCount}} tasks)
{{/each}}

## Instructions

1. **Create lane header** with emoji, name, subtitle, and progress bar
2. **Build summary table** with all lanes and totals
3. **Add task backlogs** for each lane with:
   - Task ID (lane prefix + number)
   - Task description
   - Status icon (⬜/🔄/✅/🚫)
   - Blocks column for dependencies
4. **Calculate progress bars** from task counts:
   - `percentage = round((done / total) * 100)`
   - `filled = round(percentage / 10)`
   - `bar = '▓' × filled + '░' × (10 - filled)`

## Output Format

```markdown
## Tracker

### Parallel Lanes to {{targetVersion}}

     {{lane1.emoji}} {{lane1.name}}    {{lane2.emoji}} {{lane2.name}}    ...
   {{lane1.subtitle}}                {{lane2.subtitle}}                 ...
   ─────────────────                 ─────────────────                  ...
   {{lane1.bar}} {{lane1.pct}}%      {{lane2.bar}} {{lane2.pct}}%       ...

| Lane | Focus | Tasks | Done | Progress |
| ---- | ----- | ----- | ---- | -------- |
| {{lane1.emoji}} **{{lane1.name}}** | {{lane1.focus}} | {{lane1.tasks}} | {{lane1.done}} | {{lane1.bar}} {{lane1.pct}}% |
...
| **TOTAL** | **All lanes** | **{{totalTasks}}** | **{{totalDone}}** | **{{totalBar}} {{totalPct}}%** |

### Lane Backlogs

#### {{lane1.emoji}} {{lane1.name}} ({{lane1.done}}/{{lane1.tasks}})

| ID | Task | Status | Blocks |
|----|------|--------|--------|
| {{lane1.prefix}}1 | {{task1.name}} | {{task1.status}} | {{task1.blocks}} |
...
```

## Progress Bar Reference

```
░░░░░░░░░░  0%     ▓▓░░░░░░░░ 20%     ▓▓▓▓▓░░░░░ 50%     ▓▓▓▓▓▓▓▓░░ 80%     ▓▓▓▓▓▓▓▓▓▓ 100%
```

## Status Icons

- `⬜` Not started
- `🔄` In progress  
- `✅` Complete
- `🚫` Blocked
