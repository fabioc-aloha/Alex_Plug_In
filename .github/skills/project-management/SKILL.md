---
name: "Project Management Skill"
description: "Patterns for PMI/PMBOK methodology, Agile practices, risk management, and stakeholder communication."
---

# Project Management Skill

> Patterns for PMI/PMBOK methodology, Agile practices, risk management, and stakeholder communication.

## Project Management Approaches

| Approach | Best For | Key Characteristics |
| -------- | -------- | ------------------- |
| **Predictive (Waterfall)** | Known requirements, regulated | Sequential phases, heavy documentation |
| **Agile (Scrum/Kanban)** | Evolving requirements | Iterative, adaptive, collaborative |
| **Hybrid** | Complex, mixed needs | Predictive planning + Agile execution |
| **Lean** | Continuous flow | Eliminate waste, optimize flow |

## 📋 Planning Document Standards

### Task Lists First

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

[Remaining tasks with status]

[Progress summary table]

---

## [Rest of document...]
```

### Alex Effort Estimation

Use dual-column effort estimates:

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

See [alex-effort-estimation skill](../alex-effort-estimation/SKILL.md) for methodology.

## PMBOK Process Groups

| Group | Purpose | Key Activities |
| ----- | ------- | -------------- |
| **Initiating** | Authorize project | Charter, stakeholder ID |
| **Planning** | Define approach | Scope, schedule, budget, risk |
| **Executing** | Do the work | Team management, quality |
| **Monitoring & Controlling** | Track progress | Status, change control |
| **Closing** | Formal completion | Lessons learned, handoff |

## Project Charter Template

### Essential Elements

```text
PROJECT CHARTER

Project Name: [Name]
Project Manager: [Name]
Sponsor: [Name]
Date: [Date]

1. PURPOSE & JUSTIFICATION
   Why are we doing this?

2. OBJECTIVES (SMART)
   - Objective 1
   - Objective 2

3. HIGH-LEVEL SCOPE
   In Scope:
   - Item 1
   Out of Scope:
   - Item 1

4. KEY DELIVERABLES
   - Deliverable 1 (target date)

5. HIGH-LEVEL MILESTONES
   - Milestone 1: Date
   - Milestone 2: Date

6. BUDGET SUMMARY
   Estimated: $X

7. KEY STAKEHOLDERS
   - Name, Role, Interest

8. ASSUMPTIONS
   - Assumption 1

9. CONSTRAINTS
   - Constraint 1

10. RISKS (HIGH-LEVEL)
    - Risk 1

APPROVALS:
Sponsor: _____________ Date: _______
```

## Work Breakdown Structure (WBS)

### WBS Principles

- 100% rule — Captures ALL work
- Mutually exclusive — No overlap
- Outcome-focused — Deliverables, not activities
- 8/80 rule — Work packages 8-80 hours

### WBS Structure

```text
1.0 Project Name
├── 1.1 Phase/Deliverable 1
│   ├── 1.1.1 Sub-deliverable
│   │   ├── 1.1.1.1 Work Package
│   │   └── 1.1.1.2 Work Package
│   └── 1.1.2 Sub-deliverable
├── 1.2 Phase/Deliverable 2
└── 1.3 Project Management
    ├── 1.3.1 Planning
    ├── 1.3.2 Monitoring
    └── 1.3.3 Closing
```

### WBS Dictionary Entry

| Field | Content |
| ----- | ------- |
| WBS ID | 1.1.1.1 |
| Name | [Work package name] |
| Description | What's included |
| Owner | Responsible person |
| Effort | Hours estimated |
| Duration | Calendar time |
| Dependencies | Predecessor WBS items |
| Deliverables | Tangible outputs |
| Acceptance Criteria | How to verify complete |

## Schedule Management

### Estimating Techniques

| Technique | When to Use | Accuracy |
| --------- | ----------- | -------- |
| **Analogous** | Early estimates, similar projects | ±25-50% |
| **Parametric** | Have historical data | ±10-25% |
| **Three-Point** | Uncertainty exists | Better accuracy |
| **Bottom-Up** | Detailed planning | ±5-10% |

### Three-Point Estimate (PERT)

```text
Expected = (Optimistic + 4×Most Likely + Pessimistic) / 6

Standard Deviation = (Pessimistic - Optimistic) / 6
```

### Critical Path Method

1. List all activities with durations
2. Identify dependencies
3. Calculate early start/finish (forward pass)
4. Calculate late start/finish (backward pass)
5. Float = Late Start - Early Start
6. Critical Path = Activities with zero float

## Risk Management

### Risk Process

```text
Identify → Analyze → Plan Response → Monitor
    │         │            │            │
    ▼         ▼            ▼            ▼
 Risk     Probability   Strategy     Track &
Register   × Impact     Selection    Update
```

### Risk Register Template

| ID | Risk | Category | Probability | Impact | Score | Response | Owner | Status |
| -- | ---- | -------- | ----------- | ------ | ----- | -------- | ----- | ------ |
| R1 | [Description] | Technical | H/M/L | H/M/L | P×I | [Strategy] | [Name] | Open |

### Risk Response Strategies

| For Threats | For Opportunities |
| ----------- | ----------------- |
| **Avoid** — Eliminate cause | **Exploit** — Ensure it happens |
| **Transfer** — Shift to third party | **Share** — Partner for benefit |
| **Mitigate** — Reduce P or I | **Enhance** — Increase P or I |
| **Accept** — Acknowledge, no action | **Accept** — Acknowledge, no action |

### Risk Categories (Sample)

- **Technical** — Technology, complexity, integration
- **External** — Vendors, regulations, market
- **Organizational** — Resources, priorities, politics
- **Project Management** — Estimates, dependencies, scope

## Status Reporting

### Status Report Template

```text
PROJECT STATUS REPORT
Project: [Name]
Period: [Date Range]
Overall Status: 🟢 Green / 🟡 Yellow / 🔴 Red

EXECUTIVE SUMMARY
[2-3 sentences on current state]

SCHEDULE STATUS
- Planned completion: [Date]
- Forecast completion: [Date]
- Variance: [+/- days]

BUDGET STATUS
- Approved: $X
- Spent to date: $Y
- Forecast total: $Z

KEY ACCOMPLISHMENTS THIS PERIOD
- Item 1
- Item 2

PLANNED NEXT PERIOD
- Item 1
- Item 2

RISKS & ISSUES
| # | Description | Impact | Mitigation | Owner |
|---|-------------|--------|------------|-------|
| 1 | [Risk/Issue] | H/M/L | [Action] | [Name] |

DECISIONS NEEDED
- Decision 1 (by [date])

DEPENDENCIES
- Dependency 1 (status)
```

### RAG Status Criteria

| Color | Schedule | Budget | Scope | Risk |
| ----- | -------- | ------ | ----- | ---- |
| 🟢 Green | On track | Within budget | No changes | Managed |
| 🟡 Yellow | <10% delay | <10% over | Minor changes | Elevated |
| 🔴 Red | >10% delay | >10% over | Major changes | Critical |

## Agile/Scrum Elements

### Scrum Events

| Event | Purpose | Duration |
| ----- | ------- | -------- |
| Sprint Planning | Plan sprint work | 2-4 hours |
| Daily Standup | Sync, identify blockers | 15 minutes |
| Sprint Review | Demo completed work | 1-2 hours |
| Retrospective | Improve process | 1-2 hours |
| Backlog Refinement | Prepare future work | Ongoing |

### User Story Format

```
As a [user type]
I want [functionality]
So that [benefit]

Acceptance Criteria:
- Given [context]
- When [action]
- Then [outcome]
```

### Story Point Estimation

| Points | Relative Effort | Example |
| ------ | --------------- | ------- |
| 1 | Trivial | Config change |
| 2 | Simple | Minor UI update |
| 3 | Small | New field + validation |
| 5 | Medium | New feature module |
| 8 | Large | Integration work |
| 13 | Very Large | Consider splitting |
| 21+ | Epic | Must split |

## Stakeholder Communication

### Communication Matrix

| Stakeholder | Information | Format | Frequency | Owner |
| ----------- | ----------- | ------ | --------- | ----- |
| Sponsor | Status, decisions | 1:1 meeting | Weekly | PM |
| Steering | Progress, risks | Presentation | Bi-weekly | PM |
| Team | Tasks, blockers | Standup | Daily | Scrum Master |
| Users | Changes, training | Email, sessions | As needed | BA |

### Meeting Effectiveness

| Meeting Type | Success Criteria |
| ------------ | ---------------- |
| Status | Clear decisions, actions assigned |
| Planning | Committed plan, risks identified |
| Review | Stakeholder feedback captured |
| Retrospective | Actionable improvements |

## Lessons Learned

### Capture Template

| Question | Response |
| -------- | -------- |
| What went well? | [Successes to repeat] |
| What didn't go well? | [Issues to avoid] |
| What would we do differently? | [Specific changes] |
| What surprised us? | [Unexpected learnings] |
| What should others know? | [Transferable knowledge] |

### When to Capture

- After each phase/milestone
- After significant issues
- At project close
- During retrospectives

## Synapses

### High-Strength Connections

- [change-management] (High, Complements, Bidirectional) — "Projects drive change"
- [business-analysis] (High, Receives, Backward) — "Requirements drive scope"
- [risk-management] (High, Contains, Forward) — "Risk is core to PM" [Note: maps to root-cause-analysis]

### Medium-Strength Connections

- [testing-strategies] (Medium, Plans, Forward) — "Testing in project schedule"
- [release-preflight] (Medium, Uses, Forward) — "Release planning within projects"

### Supporting Connections

- [incident-response] (Low, Escalates, Forward) — "Project issues may become incidents"
- [meditation-facilitation] (Low, Supports, Forward) — "Retrospective reflection"
