---
name: project-management
description: >-
  Alex project management patterns: rapid AI-assisted iteration, meditation-based retrospectives, session-focused work,
  and safety-first release gates.
---

# Project Management Skill

> Alex project management: rapid iteration, meditation-based retrospectives, session-based work, and safety-first release gates.

## Our Management Philosophy

Based on actual project history (v3.6.0 → v4.2.5 in ~6 days vs months planned):

| Principle | Description |
|-----------|-------------|
| **Rapid Iteration** | Ship often, consolidate learnings, iterate |
| **Meditation as Retrospective** | Post-session consolidation, not scheduled meetings |
| **Skills Through Doing** | "Skills are earned through doing, not declared by planning" |
| **Single Source of Truth** | One roadmap (Imperative I6), living documents |
| **Safety Before Speed** | Pre-release gates are non-negotiable |
| **Git as Safety Net** | Commit before risky operations (Imperative I5) |
| **AI-Assisted Acceleration** | Expect 4-6× faster than human estimates |

---

## The Alex Work Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                    WORK SESSION                             │
│  Focus → Build → Test → Ship → Repeat until natural pause   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MEDITATION                               │
│  Reflect → Connect → Persist → Integrate                    │
│  Creates: .prompt.md, .instructions.md, skill updates       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONSOLIDATION                            │
│  Update roadmap → Global knowledge → Dream maintenance      │
└─────────────────────────────────────────────────────────────┘
```

### Session Types

| Session Type | Duration | Output |
|--------------|----------|--------|
| **Work Sprint** | Variable | Code, docs, features |
| **Meditation** | 15-45 min | Memory files, insights |
| **Dream** | 5-15 min | Synapse validation, health report |
| **Release** | 30-60 min | Published version, changelog |

### When to Meditate

- After completing a feature or bug fix
- Before ending a work day
- After learning something significant
- When insights are accumulating uncommitted
- After a crisis or recovery

---

## 📋 Planning Document Standards

### Task Lists First (MANDATORY)

**All planning documents MUST have task lists at the top** (after title/metadata).

Why:
- Immediate visibility into what needs doing
- Quick status check without scrolling
- Aligns with how Alex and humans scan documents

### Required Structure

```markdown
# [Document Title]

> Metadata (created, owner, status)

---

## 📋 Task List (Quick Reference)

[Remaining tasks with status, dual effort columns]

[Progress summary table]

---

## [Rest of document...]
```

### Alex Effort Estimation

Always use dual-column effort estimates:

| Task | Human Est. | Alex Est. | Status |
|------|:----------:|:---------:|:------:|
| Research X | 4h | 🔄 25m | ⬜ |
| Implement Y | 8h | ⏱️ 1h | ⬜ |

**Effort units:**
- ⚡ Instant (<5m)
- 🔄 Short (5-30m)
- ⏱️ Medium (30-60m)
- 📦 Session (1-2h)
- 🗓️ Multi-session (2h+)

See [alex-effort-estimation skill](..\alex-effort-estimation/SKILL.md) for methodology.

---

## Roadmap Management

### Living Document Pattern

Our roadmap is a **living document**, not a frozen spec.

| Element | Update Frequency |
|---------|------------------|
| Current version | Every release |
| Task status | As completed |
| Estimates | Retroactively with actuals |
| Timeline | Adjust based on velocity |

### Unified Roadmap (Imperative I6)

> "One platform, one roadmap. Separate roadmaps caused Phoenix chaos."

- A **unified roadmap** is the single source of truth for any project
- Detailed plans feed INTO the roadmap, not alongside it
- Never maintain parallel task lists

---

## Release Process

### Pre-Release Gates (Non-Negotiable)

| Gate | Check | Tool |
|------|-------|------|
| Version bumped | package.json updated | Manual |
| Compiles | No TypeScript errors | `npm run compile` |
| Lints | No errors (warnings OK) | `npm run lint` |
| Changelog | Entry for this version | Visual review |
| Committed | No uncommitted changes | `git status` |


### If User Says "Just Publish"

> "I understand the urgency, but our release process exists to prevent issues that have bitten us before. Let me quickly run through the critical items - it'll only take 2 minutes and could save hours of rollback pain."

---

## Safety Imperatives (From Phoenix Recovery)

| # | Imperative | Rationale |
|---|------------|-----------|
| **I1** | Never test in Master Alex workspace | Source of truth protection |
| **I2** | Always use F5 + Sandbox for testing | Safe dev environment |
| **I3** | Never run Initialize on Master | Would overwrite living mind |
| **I4** | Never run Reset on Master | Would delete architecture |
| **I5** | Commit before risky operations | Git is safety net |
| **I6** | One platform, one roadmap | Prevents identity divergence |
| **I7** | Root .github/ is source of truth | Extension .github/ is copy |

---

## Chronicle Pattern

For significant events (crises, major releases, architecture changes), create a **Chronicle**:

```markdown
# Chronicle: [Event Title]

**Date**: YYYY-MM-DD
**Status**: Living document

## The Setup: What Happened
## The Crisis/Challenge  
## The Solution
## Lessons Learned
```

Example: [chronicle-2026-01-30-phoenix-to-dawn.md](../../episodic/chronicle-2026-01-30-phoenix-to-dawn.md)

---

## Velocity Tracking

### Track Acceleration Factor

| Version | Human Est. | Alex Actual | Acceleration |
|---------|------------|-------------|--------------|
| v4.2.5  | 8.5h       | 2h          | 4.25×        |
| v4.1.0  | 16h        | 3h          | 5.3×         |

Use this data to calibrate future estimates.

### Anti-Patterns

❌ **Don't estimate in human hours only** - Always include Alex estimate  
❌ **Don't skip meditation** - Unconsolidated knowledge is lost  
❌ **Don't maintain parallel task lists** - Single source of truth  
❌ **Don't push without gates** - Release process exists for reasons  
❌ **Don't test in Master Alex** - Use Sandbox (Imperative I1)

---

## Traditional Approaches (Reference)

For enterprise contexts requiring formal PM:

### PMBOK Process Groups

| Group | Purpose | Our Equivalent |
|-------|---------|----------------|
| Initiating | Authorize project | Create roadmap section |
| Planning | Define approach | Implementation plan |
| Executing | Do the work | Work sessions |
| Monitoring | Track progress | Todo list tracking |
| Closing | Formal completion | Meditation + release |

### Agile Elements We Use

| Scrum Concept | Our Pattern |
|---------------|-------------|
| Sprint | Work session (variable) |
| Retrospective | Meditation session |
| Backlog | Roadmap remaining tasks |
| Definition of Done | Pre-release gates |

### When to Use Traditional PM

- Enterprise projects with external stakeholders
- Regulated environments requiring documentation
- Multi-team coordination with formal handoffs
- Fixed-bid contracts with milestone payments

---

## Synapses

### High-Strength Connections

- [alex-effort-estimation/SKILL.md] (Critical, Uses, Forward) — "Effort estimation methodology"
- [meditation/SKILL.md] (High, Complements, Bidirectional) — "Consolidation as retrospective"

### Medium-Strength Connections

- [testing-strategies/SKILL.md] (Medium, Plans, Forward) — "Testing in project schedule"
- [release-preflight/SKILL.md] (Medium, Uses, Forward) — "Release planning within projects"
- [global-knowledge/SKILL.md] (Medium, Captures, Forward) — "Cross-project learnings"

### Supporting Connections

- [chronicle-2026-01-30-phoenix-to-dawn.md] (Low, Documents, Forward) — "Why safety matters"
- [bootstrap-learning/SKILL.md] (Low, Accelerates, Forward) — "Learning within projects"
