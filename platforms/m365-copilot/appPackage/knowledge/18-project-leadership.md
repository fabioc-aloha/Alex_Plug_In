# Post-Mortem, Incident Response, and Career Development

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Post-Mortem Facilitation Skill

> Learn from failures without blame. Improve systems, not shame people.

## Core Principle

Every incident is a gift—an opportunity to make the system stronger. Blame prevents learning.

## The Blameless Philosophy

| Blame Culture | Learning Culture |
|---------------|------------------|
| "Who messed up?" | "How did the system allow this?" |
| "They should have known" | "Why wasn't it obvious?" |
| "Follow the process!" | "Is the process followable?" |
| "Don't let it happen again" | "How do we prevent this class of problem?" |

**Key insight**: People did what made sense to them at the time, with the information they had.

## Post-Mortem Template

### 1. Summary (2-3 sentences)
What happened, when, impact.

### 2. Timeline
| Time (UTC) | Event | Actor/System |
|------------|-------|--------------|
| 14:00 | Deployment started | CI/CD |
| 14:05 | Error rate increased | Monitoring |
| 14:07 | On-call paged | PagerDuty |
| ... | ... | ... |

### 3. Impact
- **Duration**: How long?
- **Users affected**: How many?
- **Revenue impact**: If applicable
- **Data loss**: Any?
- **Reputation**: Customer communications?

### 4. Root Cause(s)
Not "human error"—go deeper:
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

| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Add validation | @alice | 2026-02-15 | P1 |
| Improve runbook | @bob | 2026-02-10 | P2 |
| ... | ... | ... | ... |

**Rule**: Every action item has an owner and date. No orphan items.

## Facilitation Guide

### Before the Meeting
1. Gather timeline from logs, chat, alerts
2. Identify all participants (responders, stakeholders)
3. Set expectation: learning, not blame
4. Share draft timeline for review

### During the Meeting

**Opening (5 min)**
> "We're here to understand what happened and improve. This is blameless—we assume everyone acted reasonably with the info they had. Focus on systems and processes, not individuals."

**Timeline Walk-through (20 min)**
- Go chronologically
- Ask: "What did you know at this point?"
- Ask: "What options did you see?"
- Fill in gaps in understanding

**Root Cause Discussion (15 min)**
- Use 5 Whys technique
- Look for systemic issues
- Avoid stopping at "human error"

**Action Items (15 min)**
- Prioritize by impact and effort
- Assign owners IN the meeting
- Set realistic due dates
- Limit to 3-5 meaningful items (not 20 small ones)

**Closing (5 min)**
> "Thank you for the candid discussion. We'll share the write-up for review. Any final thoughts?"

### After the Meeting
1. Write up within 24 hours
2. Circulate for factual corrections
3. Publish to team/org
4. Track action items to completion
5. Review effectiveness in 30 days

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Harmful |
|--------------|------------------|
| Naming individuals in root cause | Creates fear, hides future problems |
| "They should have..." | Hindsight bias, doesn't fix systems |
| No action items | Wasted learning opportunity |
| Too many action items | Nothing gets done |
| Action items without owners | Nothing gets done |
| Never following up | Actions drift, cynicism grows |
| Only for big incidents | Small incidents have big lessons |

## Questions That Unlock Learning

- "What information would have helped at that moment?"
- "What made sense to do at the time?"
- "Where did our mental model differ from reality?"
- "What surprised you?"
- "What was harder than expected?"
- "If this happens again, what would we do differently?"
- "What's the smallest change that would have prevented this?"

## Severity Classification

| Severity | Criteria | Post-Mortem Required? |
|----------|----------|----------------------|
| SEV1 | Customer-facing outage > 30min | Yes, within 48 hours |
| SEV2 | Degraded service, workaround exists | Yes, within 1 week |
| SEV3 | Internal impact, no customer effect | Recommended |
| SEV4 | Near-miss, caught before impact | Optional but valuable |

## Connecting to Prevention

Post-mortems feed into:
- **Runbooks**: Better playbooks for next time
- **Monitoring**: New alerts for early detection
- **Testing**: New test cases for CI/CD
- **Architecture**: Design changes to prevent recurrence
- **Training**: Skills gaps identified

## The Phoenix Post-Mortem

*A personal example from Alex's own evolution...*

What we learned from the Phoenix incident:
- Two sources of truth caused confusion
- Testing in production (Master Alex) was risky
- Kill switches need multiple layers
- Document decisions as you make them

These lessons became: ADR-006, RISKS.md, the 5-layer protection system.

**Every failure makes the architecture stronger.**

---

# Incident Response Skill

> In a crisis, follow the process. Panic is the enemy of resolution.

## Severity Levels

| Level | Definition | Response Time | Escalation |
| ----- | ---------- | ------------- | ---------- |
| P1 | Service down, all users affected | Immediate (drop everything) | Notify leadership within 15 min |
| P2 | Major feature broken, no workaround | < 1 hour | Notify team lead |
| P3 | Feature degraded, workaround exists | < 4 hours | Normal channels |
| P4 | Minor issue, cosmetic or low-impact | < 24 hours | Next sprint |

**When unsure**: Triage UP (P2 → P1), not down. Downgrade after investigation.

## Response Phases

### 1. Detect — Know something is wrong

| Detection Source | Reliability | Action |
| ---------------- | ----------- | ------ |
| Automated monitoring/alerts | High | Trust the data, verify scope |
| User reports (1-2) | Medium | Reproduce, check if isolated |
| User reports (many) | High | Treat as confirmed |
| Internal discovery | Medium | Check if it's already in production |

### 2. Triage — Assess impact and urgency

Answer these **in order** (each takes < 1 minute):

1. **Who is affected?** All users / subset / internal only
2. **How many?** Percentage or count
3. **What can't they do?** Core function or edge case
4. **Is there a workaround?** If yes, communicate it immediately
5. **What changed recently?** Last deploy, config change, dependency update
6. **Severity level?** Assign P1-P4 based on answers above

### 3. Resolve — Fix it (safely)

| Situation | Best Action | Why |
| --------- | ----------- | --- |
| Recent deploy caused it | **Rollback first** | Fastest path to recovery |
| Config change caused it | **Revert config** | No code deploy needed |
| Root cause is clear, fix is small | **Hotfix** | If rollback isn't possible |
| Root cause unclear | **Enable debug logging** + check recent changes | Don't guess-and-deploy |
| Third-party dependency is down | **Activate fallback** or communicate ETA | You can't fix their service |

**Golden rule**: Restore service first, then investigate. Don't debug in production while users wait.

### 4. Review — Learn from it (post-mortem)

Do this within 48 hours while memory is fresh.

## Post-Mortem Template

```markdown
# Incident: [Brief Title]
**Date**: YYYY-MM-DD
**Severity**: P1/P2/P3/P4
**Duration**: X hours Y minutes
**Impact**: [Who was affected, what they couldn't do]

## Summary
One paragraph: what happened, impact, resolution.

## Timeline
| Time (UTC) | Event |
| ---------- | ----- |
| HH:MM | First alert / user report |
| HH:MM | Triage: determined P-level |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed / service restored |
| HH:MM | Confirmed resolved |

## Root Cause
[5 Whys analysis — see root-cause-analysis skill]

## What Went Well
- [Detection was fast because...]
- [Rollback was clean because...]

## What Went Wrong
- [Alert was noisy / missed because...]
- [Took X minutes to find the right person because...]

## Action Items
| Action | Owner | Due Date | Status |
| ------ | ----- | -------- | ------ |
| Add monitoring for X | @name | YYYY-MM-DD | Open |
| Write runbook for Y | @name | YYYY-MM-DD | Open |
```

## Communication Templates

### To Users (Status Page / Email)
> **[Service] is experiencing [issues/downtime].** We are investigating and will update every [30 min / 1 hour]. Current workaround: [describe if applicable].

### To Leadership
> **Incident P[X]**: [Service] [is down / degraded] since [time]. Impact: [N users / $X revenue]. ETA for resolution: [time / investigating]. Next update: [time].

### Resolution Announcement
> **Resolved**: [Service] has been restored as of [time]. Root cause: [one sentence]. Full post-mortem to follow within 48 hours.

## On-Call Handoff Checklist

- [ ] Active incidents (status + next steps)
- [ ] Recent deploys (last 24h, any risky changes)
- [ ] Known issues (monitoring gaps, flaky tests)
- [ ] Pending alerts (expected noise vs real signal)
- [ ] Escalation contacts (who to call at 3am)

---

# Career Development Skill

> Resume crafting, interview preparation, job search strategy, and professional growth planning.

## Core Principle

Career development is a repeatable skill, not luck. Strong candidates prepare systematically: they know their story, they practice delivery, and they treat the job search like a project.

## Resume & CV

### Resume Structure (1–2 pages)

| Section | Purpose | Tips |
|---------|---------|------|
| **Header** | Name, contact, LinkedIn, portfolio | No photo (US standard), clean formatting |
| **Summary** | 2–3 sentence professional identity | Lead with years of experience + domain + differentiator |
| **Experience** | Reverse chronological | Accomplishment bullets, not job descriptions |
| **Skills** | Technical and relevant soft skills | Match to job posting keywords |
| **Education** | Degrees, certifications | Omit graduation dates if >15 years ago (reduces bias) |
| **Projects** (optional) | Side projects, open source, publications | Strong for early-career or career changers |

### Writing Accomplishment Bullets

**Formula**: Action verb + What you did + Measurable result

| Weak | Strong |
|------|--------|
| "Responsible for managing team" | "Led 8-person engineering team delivering $2M platform migration on time" |
| "Helped with marketing" | "Increased email open rates 34% by A/B testing subject lines across 50K subscribers" |
| "Worked on customer issues" | "Resolved 95% of Tier 2 support tickets within SLA, reducing escalations by 40%" |

### Action Verbs by Category

| Category | Verbs |
|----------|-------|
| **Leadership** | Led, Directed, Managed, Spearheaded, Founded, Championed |
| **Achievement** | Achieved, Delivered, Exceeded, Grew, Increased, Improved |
| **Technical** | Built, Engineered, Designed, Architected, Automated, Deployed |
| **Analysis** | Analyzed, Evaluated, Assessed, Identified, Researched, Audited |
| **Communication** | Presented, Published, Documented, Trained, Mentored, Negotiated |
| **Creative** | Created, Designed, Developed, Launched, Produced, Transformed |

### ATS (Applicant Tracking System) Optimization

- Use standard section headings (Experience, Education, Skills — not jargon)
- Include exact keywords from the job posting
- Avoid tables, columns, headers/footers, text boxes (ATS can't parse them)
- Save as PDF unless specifically asked for .docx
- File name: `FirstName-LastName-Resume.pdf`

## Cover Letter

### Structure (3–4 paragraphs, <1 page)

1. **Opening**: Specific role + why this company + brief hook
2. **Body 1**: Your strongest relevant accomplishment → their need
3. **Body 2**: Second accomplishment or cultural/mission fit
4. **Close**: Express enthusiasm, mention availability, thank them

### Rules

- Address a specific person when possible (LinkedIn research)
- Never repeat the resume — expand on 1–2 highlights with context
- Mirror language from the job posting
- Show you researched the company (product, mission, recent news)

## Interview Preparation

### STAR Method (Behavioral Questions)

| Component | What to Include | Time |
|-----------|----------------|------|
| **S** — Situation | Context with enough detail for the interviewer to follow | 15–20% |
| **T** — Task | Your specific responsibility | 10–15% |
| **A** — Action | What YOU did (not the team) — specific steps | 50–60% |
| **R** — Result | Measurable outcome, what you learned | 15–20% |

### Common Interview Types

| Type | Format | Preparation |
|------|--------|-------------|
| **Behavioral** | "Tell me about a time..." | 8–10 STAR stories covering leadership, conflict, failure, collaboration |
| **Technical** | Coding, case study, whiteboard | Practice domain problems, think aloud |
| **Case** | Business scenario analysis | Structure → Hypothesis → Analysis → Recommendation |
| **Panel** | Multiple interviewers simultaneously | Address everyone, note names, make eye contact across the group |
| **Culture fit** | Values, working style, motivation | Research the company's stated values, prepare authentic examples |

### Questions to Ask the Interviewer

| Category | Strong Question |
|----------|----------------|
| **Role** | "What does a successful first 90 days look like?" |
| **Team** | "How does the team handle disagreements about technical direction?" |
| **Growth** | "What professional development does the company support?" |
| **Manager** | "What's your management style? How do you give feedback?" |
| **Business** | "What's the biggest challenge the team faces this year?" |

### Questions to Avoid Asking Early

- Salary (wait until they bring it up or you have an offer)
- Vacation days (wait for offer stage)
- "What does the company do?" (shows zero research)

## Job Search Strategy

### Search Channels (by effectiveness)

| Channel | Hit Rate | Strategy |
|---------|----------|----------|
| **Referrals** | Highest | Tell your network what you're looking for |
| **Direct applications** (company site) | Medium | Target 10–15 companies, apply early |
| **LinkedIn** | Medium | Optimize profile, engage with content, use "Open to Work" selectively |
| **Recruiters** | Variable | Build relationships before you need them |
| **Job boards** | Lower | Use for discovery, not as primary channel |

### Application Tracking

Track every application with:
- Company, role, date applied, source
- Contact name and email
- Stage (Applied → Phone screen → Interview → Offer → Accepted/Rejected)
- Follow-up dates
- Notes from each interaction

### Networking Without Being Awkward

- **Give before you ask**: Share an article, make an introduction, congratulate achievements
- **Be specific**: "I'd love to learn about your experience leading remote teams" (not "Can I pick your brain?")
- **Follow up**: Send a thank-you within 24 hours of any conversation
- **Stay visible**: Comment on industry posts, share your own insights

## Salary Negotiation

### Preparation

1. Research market rates (Levels.fyi, Glassdoor, Payscale, industry surveys)
2. Know your minimum acceptable number before the conversation
3. Factor in total compensation (base, bonus, equity, benefits, flexibility)

### Negotiation Framework

| Step | Script |
|------|--------|
| 1 — Acknowledge | "Thank you for the offer — I'm excited about this role." |
| 2 — Ask time | "I'd like a few days to review the full package." |
| 3 — Counter | "Based on my research and experience, I was expecting [range]. Can we discuss?" |
| 4 — Justify | Cite market data, specific skills, competing offers |
| 5 — Listen | Let them respond. Silence is powerful. |
| 6 — Confirm | Get the final offer in writing before accepting |

### What to Negotiate Beyond Salary

- Signing bonus
- Equity / stock options (ask about vesting schedule)
- Remote work flexibility
- Professional development budget
- Start date
- Title
- Review timeline (6-month instead of 12-month review)

## Professional Growth Planning

### Individual Development Plan (IDP)

| Component | Question | Time Horizon |
|-----------|----------|-------------|
| **Current strengths** | What am I already good at? | — |
| **Growth areas** | What gaps do I need to close? | — |
| **Short-term goals** | What do I want to achieve in 6 months? | 6 months |
| **Long-term goals** | Where do I want to be in 3 years? | 3 years |
| **Actions** | What specific steps will I take? | Monthly |
| **Support needed** | Mentorship, training, stretch assignments? | Ongoing |

### Career Transition Patterns

| From → To | Key Bridging Strategy |
|-----------|----------------------|
| IC → Manager | Lead a project, mentor juniors, take a management course |
| Tech → Product | Build side project with product lens, get PM certification |
| Corporate → Startup | Build a side project, network in startup communities |
| Career change | Identify transferable skills, take bridge courses, volunteer in new field |

## Anti-Patterns

- Sending identical resumes to every job (no tailoring)
- Applying to 100 jobs instead of targeting 15 with research
- Preparing STAR stories the night before the interview
- Accepting the first salary offer without negotiating
- Ghosting after receiving a rejection (the contact may help later)
- Listing responsibilities instead of accomplishments on a resume
- Ignoring LinkedIn as a professional brand

---

# Skill: Deep Work Optimization

> Focus blocks, distraction management, and flow state triggers for cognitively demanding work.

## Metadata

| Field | Value |
|-------|-------|
| **Skill ID** | deep-work-optimization |
| **Version** | 1.0.0 |
| **Category** | Productivity |
| **Difficulty** | Intermediate |
| **Prerequisites** | None |
| **Related Skills** | cognitive-load-management, meeting-efficiency, frustration-recognition |

---

## Overview

Deep work is the ability to focus without distraction on cognitively demanding tasks. In Cal Newport's framework, deep work produces rare and valuable results that can't be replicated by shallow multitasking.

### The Deep Work Hypothesis

> **The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.**

This skill helps maximize deep work capacity for dissertation writing, complex analysis, architecture design, and creative problem-solving.

---

## Module 1: Understanding Deep Work

### Deep vs. Shallow Work

| Deep Work | Shallow Work |
|-----------|--------------|
| Cognitively demanding | Logistical, low-value |
| Creates new value | Maintains status quo |
| Difficult to replicate | Easily automated |
| Requires uninterrupted focus | Tolerates interruption |
| **Examples**: Writing, coding, analysis | **Examples**: Email, meetings, admin |

### The Attention Residue Problem

When you switch tasks, attention doesn't fully transfer—residue from the previous task reduces cognitive capacity.

**Research finding** (Leroy, 2009): People who frequently switch tasks perform worse than those who complete tasks before moving on.

**Implication**: Batch similar shallow work; protect deep work blocks from interruption.

### Deep Work Capacity

| Factor | Impact on Capacity |
|--------|-------------------|
| Practice | Increases (like a muscle) |
| Rest | Essential for recovery |
| Start of day | Typically highest capacity |
| After interruption | 23 minutes to recover (Iqbal & Horvitz) |
| Caffeine | Temporary boost, then crash |

**Typical daily limit**: 4 hours of true deep work (trained professional).

---

## Module 2: Deep Work Scheduling

### The Four Philosophies

| Philosophy | Description | Best For |
|------------|-------------|----------|
| **Monastic** | Eliminate all shallow work | Writers, researchers |
| **Bimodal** | Dedicated deep periods (days/weeks) | Academics on sabbatical |
| **Rhythmic** | Daily fixed-time deep blocks | Most professionals |
| **Journalistic** | Opportunistic deep work | Experienced practitioners |

**Recommended for Fabio**: Rhythmic philosophy with morning deep blocks (6-10 AM) for dissertation, bimodal when possible (full days for writing sprints).

### Time Blocking

Assign every minute of your day to a block:

```
6:00 - 6:30  | Morning routine
6:30 - 10:00 | DEEP WORK: Dissertation writing
10:00 - 10:30| Break, shallow batch
10:30 - 12:00| DEEP WORK: Analysis/Research
12:00 - 13:00| Lunch, walk
13:00 - 17:00| Work meetings, shallow work
17:00 - 17:30| Daily shutdown ritual
```

### The Shutdown Ritual

End each workday with a complete shutdown:

1. **Review tasks** - Check that nothing urgent is missed
2. **Check calendar** - Next day preparation
3. **Capture loose ends** - Write down any lingering thoughts
4. **Say the phrase** - "Shutdown complete" (triggers mental release)

**Why it works**: Zeigarnik effect—incomplete tasks occupy mental space. The ritual signals completion.

---

## Module 3: Environment Design

### Physical Environment

| Element | Optimization |
|---------|--------------|
| **Location** | Dedicated deep work space (not email/meetings space) |
| **Lighting** | Natural light or warm artificial |
| **Temperature** | Slightly cool (68-72°F) |
| **Seating** | Ergonomic, supports long sessions |
| **Visual** | Minimal distraction, clean desk |

### Digital Environment

| Element | Optimization |
|---------|--------------|
| **Notifications** | All off during deep work |
| **Email** | Batch 2-3x daily, not continuous |
| **Slack/Teams** | Status: Focus mode, check at block ends |
| **Browser** | Block distracting sites (Freedom, Cold Turkey) |
| **Phone** | Different room or drawer |

### The Focus Mode Protocol

Before starting deep work:

1. Close email client completely
2. Set Teams/Slack to "Do Not Disturb"
3. Put phone in another room
4. Open only necessary applications
5. Start a timer (Pomodoro or fixed block)
6. Have water/coffee ready

---

## Module 4: Flow State Triggers

### Conditions for Flow (Csikszentmihalyi)

| Condition | Implementation |
|-----------|----------------|
| **Clear goals** | Know exactly what you're working on |
| **Immediate feedback** | See progress as you work |
| **Challenge-skill balance** | Task is hard but doable |
| **Deep concentration** | No interruptions |
| **Sense of control** | Autonomy over approach |
| **Altered time perception** | Hours feel like minutes |

### Pre-Work Rituals

Triggers that signal "deep work mode" to your brain:

| Ritual | Purpose |
|--------|---------|
| Same time daily | Circadian consistency |
| Same location | Environmental trigger |
| Same beverage | Sensory anchor |
| Same music (or silence) | Auditory cue |
| Brief review of goals | Clarity of purpose |

### Music for Deep Work

| Genre | Best For | Why |
|-------|----------|-----|
| Video game soundtracks | Coding, analysis | Designed for focus |
| Lo-fi hip hop | Writing, creative | Non-intrusive rhythm |
| Classical (baroque) | Complex thinking | Structured, no lyrics |
| White/brown noise | Any deep work | Masks distractions |
| Silence | Highest complexity | Maximum cognitive resources |

---

## Module 5: Distraction Management

### The Distraction Hierarchy

| Level | Source | Solution |
|-------|--------|----------|
| **External** | Notifications, people | Environment design, signaling |
| **Internal** | Wandering thoughts | Capture list, meditation |
| **Task-switch** | "Quick check" urges | Delayed gratification |
| **Boredom** | Resistance to hard thinking | Push through, build tolerance |

### The Capture List

Keep a notepad for intrusive thoughts:

```
During Deep Work Session:
- "Check if package delivered" → write down, continue
- "Reply to Sarah's email" → write down, continue
- "Buy milk" → write down, continue

After Session:
- Process the list during shallow work time
```

### The 10-Minute Rule

When tempted to check email/social:
1. Note the urge
2. Wait 10 minutes
3. Continue working
4. After 10 minutes, reassess

**Usually**: The urge passes. The habit of delayed gratification builds focus capacity.

### Attention Restoration

When focus degrades:

| Duration | Restoration |
|----------|-------------|
| 5 minutes | Look out window, stretch |
| 15 minutes | Walk outside |
| 30 minutes | Nap (proven cognitive benefits) |
| 60 minutes | Complete break, different activity |

---

## Module 6: Measuring and Improving

### Deep Work Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Deep work hours/day | 3-4 hours | Time log or app |
| Longest unbroken session | 90+ minutes | Timer records |
| Deep/shallow ratio | 50%+ deep | Weekly review |
| Output per session | Varies by task | Self-assessment |

### Weekly Review Questions

1. How many deep work hours this week?
2. What interrupted my longest session?
3. What shallow work could be eliminated?
4. When was I in flow state?
5. What will I do differently next week?

### Building Capacity

| Week | Target | Notes |
|------|--------|-------|
| 1-2 | 1 hour/day | Build habit |
| 3-4 | 1.5 hours/day | Extend sessions |
| 5-6 | 2 hours/day | Add second block |
| 7-8 | 2.5 hours/day | Optimize environment |
| 9+ | 3-4 hours/day | Sustainable maximum |

---

## Integration with Alex

### Session Start: Deep Work Mode

When user says "deep work", "focus session", or "dissertation time":

1. **Confirm goal**: "What's the specific deliverable for this session?"
2. **Set duration**: "90-minute block, or different duration?"
3. **Reduce Alex verbosity**: Shorter responses, fewer suggestions
4. **Defer non-urgent**: "I'll note that for after the session"
5. **Track time**: Log session for weekly review

### During Deep Work

- **Minimize interruption**: Only respond to direct questions
- **Capture distractions**: "I've noted that—let's handle it after"
- **Encourage continuation**: "Good progress—keep going"
- **Respect time**: Warn at 10 minutes before end

### Session End

1. **Celebrate completion**: "90 minutes of deep work—well done"
2. **Process capture list**: Address items noted during session
3. **Log metrics**: Update deep work tracking
4. **Suggest break**: "Take 15 before next session?"

---

## Quick Reference

### Deep Work Checklist

- [ ] Goal for session is specific and written
- [ ] Time block scheduled and defended
- [ ] Notifications disabled (all devices)
- [ ] Environment prepared (clean, comfortable)
- [ ] Capture list ready for intrusive thoughts
- [ ] Water/beverage at hand
- [ ] Timer started
- [ ] Shutdown ritual planned

### Emergency Focus Recovery

When you can't seem to focus:

1. **Acknowledge**: "I'm struggling today—that's okay"
2. **Start small**: "Just 25 minutes (Pomodoro)"
3. **Lower the bar**: "I'll just outline, not write perfectly"
4. **Change location**: Different room, coffee shop
5. **Try tomorrow**: Sometimes rest is the answer

### The Dissertation Deep Work Protocol

For March 2026 defense:

| Day | Deep Work Focus |
|-----|-----------------|
| Monday | Literature review, synthesis |
| Tuesday | Methodology refinement |
| Wednesday | Analysis and findings |
| Thursday | Discussion and implications |
| Friday | Editing, polishing |
| Weekend | Strategic rest, review |

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "deep work", "focus session", "concentration" | Full skill activation |
| "dissertation time", "writing session" | Deep Work Mode + defense skill |
| "distracted", "can't focus" | Module 5 + Emergency Recovery |
| "flow state", "get in the zone" | Module 4: Flow Triggers |
| "time blocking", "schedule deep work" | Module 2: Scheduling |

---

## References

- Newport, C. (2016). Deep Work: Rules for Focused Success in a Distracted World
- Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience
- Leroy, S. (2009). Why is it so hard to do my work?
- Iqbal, S. & Horvitz, E. (2007). Disruption and Recovery of Computing Tasks

---

*Skill created: 2026-02-10 | Category: Productivity | Status: Active*

---

---

# Work-Life Balance Skill

> Detect burnout signals and proactively support sustainable productivity.

## Purpose

Monitor interaction patterns for work-life balance issues and intervene before burnout.

## Warning Signals

### Time-Based Alerts

| Signal | Threshold | Action |
| ------ | --------- | ------ |
| Late night work | After 10 PM local | Suggest wrapping up |
| Weekend coding | Saturday/Sunday | Acknowledge, offer break |
| No breaks | 2+ hours continuous | Remind to stretch |
| Skipped meals | Around meal times | Gentle nudge |

### Behavioral Patterns

| Pattern | Indicator | Response |
| ------- | --------- | -------- |
| Frustration spiral | Multiple failed attempts | Step back, fresh eyes |
| Tunnel vision | Ignoring obvious issues | Zoom out perspective |
| Diminishing returns | Same error repeatedly | Suggest break |
| Perfectionism | Endless small tweaks | Good enough discussion |

### Language Signals

| Phrase | Meaning | Response |
| ------ | ------- | -------- |
| "I've been at this for hours" | Exhaustion | Validate, suggest pause |
| "I just need to finish this" | Hyperfocus | Assess criticality |
| "One more thing" | Scope creep | Gentle boundary |
| "I'm so tired" | Direct signal | Acknowledge, support stopping |

## Proactive Interventions

### Soft Nudges

```text
🕐 It's getting late - want to bookmark this and continue tomorrow?
```

```text
☕ You've been focused for a while. Quick stretch?
```

```text
🌟 Great progress today! Consider this a good stopping point.
```

### Milestone Celebrations

```text
✅ That's a solid win! Time to celebrate before the next challenge?
```

```text
🎯 Goal completed! Your future self thanks current you for the break.
```

## Focus Session Integration

| Session State | Monitoring |
| ------------- | ---------- |
| Active focus | No interruptions |
| Break time | Encourage actual break |
| Post-session | Celebrate completion |
| Extended focus | Gentle check-in |

## Health Dashboard Metrics

| Metric | Healthy Range | Warning |
| ------ | ------------- | ------- |
| Daily coding hours | 4-6 focused | >8 sustained |
| Break frequency | Every 25-50 min | >90 min without |
| Weekend activity | Minimal | Heavy weekend work |
| Evening cutoff | Before 8 PM | After 10 PM regularly |

## Response Calibration

### User Preferences

| Setting | Options |
| ------- | ------- |
| Nudge frequency | minimal / moderate / frequent |
| Time sensitivity | strict / flexible / off |
| Celebration style | minimal / standard / enthusiastic |

### Context Awareness

- Deadlines: Acknowledge pressure, don't lecture
- Flow state: Don't interrupt productive flow
- User override: Respect explicit "I'm fine" signals

## Anti-Patterns to Avoid

| Don't | Do Instead |
| ----- | ---------- |
| Lecture about health | Brief, supportive nudge |
| Interrupt flow state | Wait for natural pause |
| Ignore explicit signals | Respect user autonomy |
| Be preachy | Be a supportive partner |

## Integration Points

- **Focus Sessions**: Respect Pomodoro boundaries
- **Learning Goals**: Balance ambition with sustainability
- **Streaks**: Celebrate without creating guilt
- **Health Dashboard**: Visualize patterns non-judgmentally
