---
name: Post-Mortem
description: Facilitate blameless incident reviews that find systemic root causes, capture action items, and prevent recurrence.
---

## Purpose

Every incident is an opportunity to make the system stronger. Post-mortems turn failures into improvements by focusing on systems, not blame.

## Blameless Philosophy

| Blame Culture               | Learning Culture                           |
| --------------------------- | ------------------------------------------ |
| "Who messed up?"            | "How did the system allow this?"           |
| "They should have known"    | "Why wasn't it obvious?"                   |
| "Follow the process!"       | "Is the process followable?"               |
| "Don't let it happen again" | "How do we prevent this class of problem?" |

People did what made sense to them at the time, with the information they had.

## Post-Mortem Template

### 1. Summary (2-3 sentences)

What happened, when, and the impact.

### 2. Timeline

| Time (UTC) | Event                | Actor/System |
| ---------- | -------------------- | ------------ |
| 14:00      | Deployment started   | CI/CD        |
| 14:05      | Error rate increased | Monitoring   |
| 14:07      | On-call paged        | PagerDuty    |

### 3. Impact

- **Duration**: How long?
- **Users affected**: How many?
- **Data loss**: Any?
- **Customer communications**: Required?

### 4. Root Cause(s)

Not "human error." Go deeper:

- Why was the error possible?
- What safeguards didn't catch it?
- What systemic conditions contributed?

### 5. What Went Well

- Detection time
- Response coordination
- Communication
- Recovery speed

### 6. What Could Be Improved

- Missing alerts
- Documentation gaps
- Process friction
- Tool limitations

### 7. Action Items

| Action          | Owner  | Due Date   | Priority |
| --------------- | ------ | ---------- | -------- |
| Add validation  | @alice | 2026-04-15 | P1       |
| Improve runbook | @bob   | 2026-04-10 | P2       |

Every action item has an owner and date. No orphan items. Limit to 3-5 meaningful items.

## Facilitation Guide

### Before the Meeting

1. Gather timeline from logs, chat, alerts
2. Identify all participants (responders, stakeholders)
3. Set expectation: learning, not blame
4. Share draft timeline for review

### During the Meeting (55 min)

**Opening (5 min)**: "We're here to understand what happened and improve. This is blameless. Focus on systems and processes, not individuals."

**Timeline Walk-through (20 min)**: Go chronologically. Ask: "What did you know at this point?" and "What options did you see?"

**Root Cause Discussion (15 min)**: Use 5 Whys technique. Look for systemic issues. Never stop at "human error."

**Action Items (10 min)**: Prioritize by impact and effort. Assign owners in the meeting. Set realistic due dates.

**Closing (5 min)**: "Thank you for the candid discussion. We'll share the write-up for review."

### After the Meeting

1. Write up within 24 hours
2. Circulate for factual corrections
3. Publish to team
4. Track action items to completion
5. Review effectiveness in 30 days

## Severity Classification

| Severity | Criteria                            | Post-Mortem Required? |
| -------- | ----------------------------------- | --------------------- |
| SEV1     | Customer-facing outage > 30 min     | Yes, within 48 hours  |
| SEV2     | Degraded service, workaround exists | Yes, within 1 week    |
| SEV3     | Internal impact, no customer effect | Recommended           |
| SEV4     | Near-miss, caught before impact     | Optional but valuable |

## Questions That Unlock Learning

- "What information would have helped at that moment?"
- "What made sense to do at the time?"
- "Where did our mental model differ from reality?"
- "What surprised you?"
- "What's the smallest change that would have prevented this?"

## Anti-Patterns

| Anti-Pattern                     | Why It's Harmful                    |
| -------------------------------- | ----------------------------------- |
| Naming individuals in root cause | Creates fear, hides future problems |
| "They should have..."            | Hindsight bias, doesn't fix systems |
| No action items                  | Wasted learning opportunity         |
| Too many action items            | Nothing gets done                   |
| Action items without owners      | Nothing gets done                   |
| Never following up               | Actions drift, cynicism grows       |

## Guidelines

- Schedule the post-mortem within 48 hours while memory is fresh
- Focus on systems and processes; if you're writing a person's name in the root cause, reframe
- Post-mortems feed into runbooks, monitoring, testing, architecture, and training
- Small incidents often have the biggest lessons; don't reserve post-mortems only for outages
- Publish post-mortems broadly; transparency builds trust and prevents repeat incidents
