---
description: "Create stakeholder-friendly project status updates and progress reports"
application: "When writing status reports, progress updates, or executive summaries"
applyTo: "**/*status*,**/*report*,**/*progress*,**/*update*"
---

# Status Reporting

Quick-reference for stakeholder-friendly project updates.

## Core Philosophy

> Stakeholders don't need HOW — they need WHAT it means for them.

## RAG Status System

| Status | Symbol | Meaning | Action |
|--------|--------|---------|--------|
| Green | 🟢 | On track | Continue |
| Yellow | 🟡 | At risk | Monitor, mitigate |
| Red | 🔴 | Blocked | Escalate |
| Blue | 🔵 | Complete | Celebrate |

**Trend indicators**: ↑ improving, ↓ declining, → stable, ⚠️ attention needed

## Executive Summary Template

```markdown
## Project: [Name]
**Date**: [Date] | **Status**: 🟢/🟡/🔴

### One-Line Summary
[What happened and what it means — one sentence]

### Key Metrics
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| [Metric] | [Value] | [Goal] | ↑/↓/→ |

### Decisions Needed
- [ ] [Decision with deadline]

### Timeline Impact
[On schedule / X days ahead / X days behind — why]
```

## Weekly Team Update Template

```markdown
## Week of [Date Range]

### Completed ✅
- [Achievement] — [impact]

### In Progress 🔄
- [Task] — [% complete, ETA]

### Blocked 🚫
- [Blocker] — need [resolution] from [who] by [when]

### Next Week Focus
1. [Priority 1]
2. [Priority 2]

### Risks
| Risk | L×I | Mitigation |
|------|-----|------------|
| [Risk] | H/M | [Action] |
```

## Audience Adaptation

| Audience | Detail | Focus On |
|----------|--------|----------|
| C-Suite | Minimal | Impact, risk, decisions |
| VP/Director | Summary | Progress, resources, timeline |
| Manager | Moderate | Tasks, blockers, team health |
| Team | Detailed | Technical, dependencies |
| Customer | Outcome | Value delivered, what's next |

## Language Translation

| Technical | Executive |
|-----------|-----------|
| Refactored authentication | Improved security and login reliability |
| Reduced technical debt | Lower maintenance costs and risk |
| Implemented CI/CD | Automated releases — faster, safer |
| Fixed race condition | Resolved intermittent data bug |
| Migrated to microservices | More scalable, more reliable |

## Cadence Guide

| Trigger | Report Type |
|---------|-------------|
| End of Friday | Weekly summary |
| Sprint end | Sprint report |
| Before stakeholder meeting | Executive summary |
| Milestone completion | Achievement update |
| Blocker encountered | Escalation notice |

## Report Structure

1. **Summary**: One sentence — are we on track?
2. **Highlights**: What shipped since last update
3. **Risks/Blockers**: What threatens timeline
4. **Next**: What's coming next period
5. **Metrics**: Progress against milestones
6. **Decisions needed**: What you need from them

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Burying bad news | Surprises stakeholders | Lead with risks |
| No metrics | Vague progress | Add numbers, dates |
| Copy-paste stale | Looks lazy | Fresh content each time |
| Activity ≠ progress | "We were busy" | Focus on outcomes |
| No action items | "So what?" | End with asks |
| Wrong detail level | Bores or confuses | Match audience |
