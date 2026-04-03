---
name: Status Reporting
description: Generate structured project status reports with RAG ratings, risk tracking, and action items for stakeholder communication.
---

## Purpose

Create clear, consistent project status reports that tell stakeholders what they need to know: what's on track, what's at risk, what's blocked, and what needs their attention. Replace ad-hoc updates with a repeatable format.

## Steps

1. Search recent emails, calendar events, and Teams messages for project activity from the reporting period
2. Compile accomplishments: what was completed since last report?
3. Assess status using RAG (Red/Amber/Green) for each workstream:
   - **Green**: On track, no issues
   - **Amber**: At risk, needs attention or mitigation
   - **Red**: Off track, needs escalation or intervention
4. List risks and issues: what could go wrong? What is already wrong?
5. List blockers: what is preventing progress? Who can unblock?
6. List action items from the period with owners, due dates, and status
7. Write the next period plan: what will be done next?
8. Create a Word document with the status report
9. Send the report via Outlook to the stakeholder distribution list

## Status Report Structure

### Header

- Report date and period covered
- Project name
- Overall RAG status (one rating for the whole project)

### Executive Summary (3 sentences max)

What happened, what's at risk, what you need.

### Accomplishments

Bullet list of completed items with dates.

### RAG by Workstream

| Workstream | Status          | Notes               |
| ---------- | --------------- | ------------------- |
| [Area 1]   | Green/Amber/Red | [Brief explanation] |
| [Area 2]   | Green/Amber/Red | [Brief explanation] |

### Risks and Issues

| Risk/Issue    | Impact       | Likelihood   | Mitigation | Owner  |
| ------------- | ------------ | ------------ | ---------- | ------ |
| [Description] | High/Med/Low | High/Med/Low | [Action]   | [Name] |

### Blockers

Items preventing progress. Each needs an owner and a resolution path.

### Action Items

| Action | Owner  | Due    | Status                |
| ------ | ------ | ------ | --------------------- |
| [Task] | [Name] | [Date] | Open/In Progress/Done |

### Next Period Plan

What will be worked on next. Key milestones and deliverables.

## RAG Rating Rules

| Rating | Criteria                                                  |
| ------ | --------------------------------------------------------- |
| Green  | On schedule, on budget, no significant risks              |
| Amber  | Minor delays or risks that have mitigation plans          |
| Red    | Significant delays, budget overruns, or unmitigated risks |

Rule: never use Green if there are unacknowledged risks. Amber with a clear mitigation plan is more honest than false Green.

## Output Format

- Word document: structured status report
- Outlook email: report to stakeholder list with executive summary in the email body and full report attached
- Optional: Excel tracker for action items and risk register

## Guidelines

- Same format every time; stakeholders should know where to find information
- Lead with the overall RAG, then detail
- Mark items needing stakeholder action with [ACTION NEEDED]
- Include specific dates, not "soon" or "next week"
- Never hide bad news; Amber/Red with a mitigation plan is better than false Green
- Keep the executive summary to 3 sentences: progress, risk, ask
- Action items must have an owner and a due date (no orphaned actions)
