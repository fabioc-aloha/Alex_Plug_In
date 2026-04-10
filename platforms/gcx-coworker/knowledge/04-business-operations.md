# Business Operations

## Why Do You Need Requirements Before Design?

Understanding what to build prevents building the wrong thing. Requirements establish the foundation for all subsequent work: design, development, testing, and deployment.

### Business Analysis Deliverables

| Deliverable         | Purpose                    | Audience                 |
| ------------------- | -------------------------- | ------------------------ |
| **Business Case**   | Justify investment         | Executives, sponsors     |
| **BRD**             | Document requirements      | All stakeholders         |
| **Functional Spec** | Detail system behavior     | Dev team, testers        |
| **Use Cases**       | Describe user interactions | Designers, developers    |
| **Process Maps**    | Visualize workflows        | Process owners, analysts |
| **Data Dictionary** | Define data elements       | Technical team           |

### Requirements Hierarchy

Business Requirements (WHY) establish the foundation layer. These justify the entire project and align with organizational objectives. Stakeholder Requirements (WHO needs WHAT) identify specific user groups and their needs. Solution Requirements split into Functional (WHAT it does) and Non-Functional (HOW WELL it does it). Transition Requirements (HOW we get there) define the implementation path.

## How Do You Write Requirements That Don't Get Misunderstood?

### SMART Criteria

| Letter | Meaning    | Test                        |
| ------ | ---------- | --------------------------- |
| **S**  | Specific   | Is it clear what's needed?  |
| **M**  | Measurable | Can we verify it's done?    |
| **A**  | Achievable | Is it realistic?            |
| **R**  | Relevant   | Does it support objectives? |
| **T**  | Time-bound | Is there a deadline?        |

### Good vs. Bad Requirements

| Bad                     | Problem        | Better                        |
| ----------------------- | -------------- | ----------------------------- |
| "System should be fast" | Not measurable | "Page load < 2 seconds"       |
| "Easy to use"           | Subjective     | "Complete task in < 3 clicks" |
| "Handle all cases"      | Unbounded      | "Support cases A, B, C"       |
| "Similar to competitor" | Vague          | "[Specific features listed]"  |
| "Should probably..."    | Uncertain      | "Must" or "Should" (MoSCoW)   |

### Requirement Attributes

| Attribute           | Purpose                     |
| ------------------- | --------------------------- |
| ID                  | Unique identifier (REQ-001) |
| Description         | What is required            |
| Priority            | MoSCoW or numeric           |
| Source              | Who requested it            |
| Rationale           | Why it's needed             |
| Acceptance Criteria | How to verify               |
| Dependencies        | Related requirements        |
| Status              | Draft/Approved/Implemented  |

## What's the Best Way to Structure a Business Requirements Document?

### Standard Sections

1. **Executive Summary** - One-page overview for executives
2. **Business Objectives** - Measurable goals (SMART)
3. **Scope** - In scope, out of scope, boundaries
4. **Stakeholders** - Who's involved, their interests
5. **Current State** - As-is process, pain points
6. **Future State** - To-be vision, benefits
7. **Functional Requirements** - What the solution must do
8. **Non-Functional Requirements** - Quality attributes
9. **Assumptions & Constraints** - Known limitations
10. **Dependencies** - External factors
11. **Risks** - What could go wrong
12. **Glossary** - Term definitions

## How Do You Gather Requirements When People Don't Know What They Want?

### Elicitation Technique Selection

| Technique             | Best For                           | Effort |
| --------------------- | ---------------------------------- | ------ |
| **Interviews**        | Deep understanding, complex topics | High   |
| **Workshops**         | Consensus, group decisions         | Medium |
| **Surveys**           | Broad input, quantitative data     | Low    |
| **Observation**       | Understanding real workflows       | High   |
| **Document Analysis** | Existing systems, regulations      | Low    |
| **Prototyping**       | Validating concepts, UI            | Medium |
| **Focus Groups**      | User perspectives, reactions       | Medium |

### Interview Best Practices

- Prepare questions in advance
- Start broad, then specific
- Use open-ended questions
- Listen more than talk (80/20)
- Probe with "Why?" and "How?"
- Summarize and confirm understanding
- Document immediately after

### Workshop Facilitation

| Phase        | Activities                       |
| ------------ | -------------------------------- |
| **Open**     | Objectives, agenda, ground rules |
| **Diverge**  | Brainstorm, generate options     |
| **Converge** | Prioritize, decide               |
| **Close**    | Summarize, next steps, thank     |

## How Do You Turn User Stories Into Detailed Use Cases?

### Use Case Template

Use Case: [UC-001] [Name]
Actor: [Primary actor]
Precondition: [What must be true before]
Trigger: [What initiates the use case]

Main Flow:
1. Actor does X
2. System responds with Y
3. Continue to completion

Alternative Flows:
2a. If condition, then alternative path

Exception Flows:
2b. If error, then error handling

Postcondition: [What is true after]
Business Rules: [Applicable rules]

### Use Case Levels

| Level           | Scope             | Example                   |
| --------------- | ----------------- | ------------------------- |
| **Summary**     | Multiple sessions | "Manage Customer Account" |
| **User Goal**   | One sitting       | "Place Order"             |
| **Subfunction** | Part of a step    | "Validate Address"        |

## How Do You Analyze Current Processes to Find Improvement Opportunities?

### Current State Analysis

1. Map as-is process (BPMN, swimlane)
2. Identify pain points
3. Measure current performance
4. Find root causes
5. Quantify improvement opportunity

### Process Mapping Notations

| Notation     | Best For                      |
| ------------ | ----------------------------- |
| BPMN         | Detailed, technical processes |
| Swimlane     | Cross-functional workflows    |
| Value Stream | Lean analysis                 |
| SIPOC        | High-level overview           |

### SIPOC Template

| S             | I              | P                | O                | C             |
| ------------- | -------------- | ---------------- | ---------------- | ------------- |
| Suppliers     | Inputs         | Process          | Outputs          | Customers     |
| Who provides? | What's needed? | High-level steps | What's produced? | Who receives? |

## How Do You Identify Gaps Between Current and Future State?

### Gap Analysis Framework

Current State flows through Gap identification to Future State. The Gap represents what needs to change between the As-Is Process and the To-Be Vision.

### Gap Categories

| Type           | Examples                   |
| -------------- | -------------------------- |
| **Process**    | Missing steps, manual work |
| **Technology** | System limitations         |
| **People**     | Skills, capacity           |
| **Data**       | Quality, availability      |
| **Policy**     | Rules, compliance          |

## How Do You Write Testable Acceptance Criteria?

### Gherkin Format

Given [precondition]
When [action]
Then [expected result]
And [additional result]

### Acceptance Criteria Checklist

- Testable: Can write a test case
- Clear: Unambiguous language
- Complete: Covers happy path and edges
- Independent: Doesn't require other criteria
- Valuable: Ties to user need

## How Do You Track Requirements Through Implementation?

### Traceability Matrix

| Req ID  | Business Objective | Design  | Test Case | Status |
| ------- | ------------------ | ------- | --------- | ------ |
| REQ-001 | OBJ-01             | DES-005 | TC-012    | Passed |

### Traceability Benefits

- Ensure all requirements implemented
- Impact analysis for changes
- Test coverage verification
- Audit compliance evidence

## How Do You Prioritize Requirements When Everything is Important?

### MoSCoW

| Priority   | Meaning                     | Guidance       |
| ---------- | --------------------------- | -------------- |
| **Must**   | Critical for success        | ~60% of effort |
| **Should** | Important, not critical     | ~20% of effort |
| **Could**  | Nice to have                | ~20% of effort |
| **Won't**  | Out of scope (this release) | Documented     |

### Value vs. Effort Matrix

High Value, Low Effort: Quick Wins (Do first)
High Value, High Effort: Major Projects (Plan carefully)
Low Value, Low Effort: Fill-ins (If time)
Low Value, High Effort: Avoid (Don't do)

### Kano Model

| Type            | If Present           | If Absent     |
| --------------- | -------------------- | ------------- |
| **Basic**       | Expected, no delight | Dissatisfied  |
| **Performance** | More is better       | Less is worse |
| **Delighter**   | Unexpected joy       | Not missed    |

## What Are the Most Common Business Analysis Mistakes?

| Pitfall              | Prevention                        |
| -------------------- | --------------------------------- |
| Solution jumping     | Ask "why" before "how"            |
| Missing stakeholders | Stakeholder analysis early        |
| Gold plating         | Tie everything to objectives      |
| Assumption blindness | Document and validate assumptions |
| Scope creep          | Change control process            |
| Analysis paralysis   | Timeboxed analysis, iterate       |

## When Should You Have a Meeting vs. Send an Email?

### The Meeting Cost Formula

Meeting Cost = (Attendees × Duration) + (Context-Switch Cost × Attendees)

Example: 6-person, 1-hour meeting with 30-min context switch each = 6 + 3 = 9 hours of productivity

### Meeting or Not?

| Need                | Meeting Required? | Alternative                  |
| ------------------- | ----------------- | ---------------------------- |
| Decide something    | Maybe             | Async decision doc if simple |
| Share information   | Rarely            | Email, video, document       |
| Brainstorm          | Often             | Async + sync hybrid          |
| Build relationships | Yes               | No substitute for presence   |
| Complex alignment   | Yes               | Real-time needed             |
| Status updates      | No                | Dashboards, async standup    |

## What Are the Different Types of Meetings and When Do You Use Them?

### Meeting Categories

| Type          | Purpose            | Typical Duration | Required Elements            |
| ------------- | ------------------ | ---------------- | ---------------------------- |
| **Decision**  | Make a call        | 30-60 min        | Options, criteria, decider   |
| **Creative**  | Generate ideas     | 60-90 min        | Prompt, diverge/converge     |
| **Tactical**  | Coordinate action  | 15-30 min        | Blockers, handoffs           |
| **Strategic** | Set direction      | 60-120 min       | Context, options, trade-offs |
| **1:1**       | Develop people     | 30-60 min        | Their agenda first           |
| **All-hands** | Align organization | 30-60 min        | Updates, Q&A                 |

### Recurring vs. Ad-hoc

| Recurring      | When to Keep          | When to Cancel        |
| -------------- | --------------------- | --------------------- |
| Daily standup  | Unblocking needed     | Team is async-mature  |
| Weekly team    | Coordination required | No topics this week   |
| Monthly review | Accountability value  | Going through motions |

Rule: Every recurring meeting should justify its existence quarterly.

## How Do You Create Agendas That Actually Work?

### Anatomy of a Good Agenda

| Element             | Purpose                 | Example                             |
| ------------------- | ----------------------- | ----------------------------------- |
| **Purpose**         | Why we're meeting       | "Decide: Q3 project prioritization" |
| **Pre-work**        | What to review before   | [Link to options doc]               |
| **Topics**          | Numbered, timed         | "1. Review criteria (10 min)"       |
| **Owners**          | Who leads each topic    | "Sarah - criteria, Tom - options"   |
| **Desired outcome** | What success looks like | "Ranked list of top 3 projects"     |

### Agenda Template

Meeting: [Purpose Statement]
Date: [Date/Time]
Duration: [X min]
Attendees: [Required], [Optional]

Pre-Work (Complete Before)
- Review [document]
- Prepare [input]

Agenda
1. [Topic 1] - [Owner] - [Time] min
   Desired outcome: [Specific result]
2. [Topic 2] - [Owner] - [Time] min
   Desired outcome: [Specific result]

Parking Lot
[Topics for future discussion]

Actions (Captured During)
| Action | Owner | Due |

### Topic Time Allocation

| Topic Type        | Suggested Time                 |
| ----------------- | ------------------------------ |
| Information share | 5 min max                      |
| Discussion        | 10-15 min                      |
| Decision          | 15-20 min                      |
| Complex problem   | 30+ min (single-topic meeting) |

## How Do You Facilitate Meetings That Actually Produce Results?

### The Facilitator Role

| Facilitator Does        | Facilitator Doesn't         |
| ----------------------- | --------------------------- |
| Keep time               | Dominate discussion         |
| Ensure all voices heard | Give their opinion first    |
| Capture decisions       | Make decisions unilaterally |
| Redirect tangents       | Let meetings run over       |

### Time Boxing

| Technique            | How It Works                      |
| -------------------- | --------------------------------- |
| **Visible timer**    | Everyone sees countdown           |
| **2-minute warning** | Alert before time ends            |
| **Hard stop**        | End topic on time, park remainder |
| **Overtime vote**    | "Extend 5 min? Thumbs up/down"    |

### Managing Discussion

| Problem              | Intervention                    |
| -------------------- | ------------------------------- |
| One person dominates | "Let's hear from others"        |
| Nobody speaks        | Direct: "Sarah, your thoughts?" |
| Tangent emerges      | "Interesting - let's park that" |
| Going in circles     | "Let me summarize where we are" |
| Conflict emerges     | "What do we actually agree on?" |

### Decision-Making Methods

| Method           | When to Use              | Process                              |
| ---------------- | ------------------------ | ------------------------------------ |
| **Consent**      | Routine decisions        | "Any objections?" Silence = approval |
| **Consensus**    | High-stakes, need buy-in | All actively agree                   |
| **Consultative** | Need input, one decider  | Hear views, leader decides           |
| **Democratic**   | Equal stakes             | Vote                                 |
| **Delegation**   | Trust exists             | Assign to owner                      |

## How Do You Maintain Meeting Discipline?

### Before the Meeting

| Task               | Owner        | Timing           |
| ------------------ | ------------ | ---------------- |
| Send agenda        | Organizer    | 24+ hours before |
| Complete pre-work  | All          | Before meeting   |
| Confirm attendance | Invitees     | If can't attend  |
| Prepare materials  | Topic owners | Before meeting   |

### During the Meeting

| Practice            | Purpose           |
| ------------------- | ----------------- |
| Start on time       | Respect attendees |
| Note-taker assigned | Capture decisions |
| Cameras on (remote) | Build presence    |
| Phones away         | Focus             |
| Stay on topic       | Efficiency        |

### After the Meeting

| Task                 | Owner         | Timing                          |
| -------------------- | ------------- | ------------------------------- |
| Send notes           | Note-taker    | Within 24 hours                 |
| Log decisions        | Organizer     | Same day                        |
| Create action items  | Organizer     | In meeting or immediately after |
| Follow up on actions | Action owners | As assigned                     |

### Meeting Notes Template

[Meeting Name] - [Date]

Attendees
- [List]

Key Decisions
1. [Decision made]
2. [Decision made]

Action Items
| Action | Owner | Due |

Discussion Summary
[Brief capture of key points]

Parking Lot
[Items for future discussion]

## How Do You Run Effective Remote and Hybrid Meetings?

### Remote-Specific Challenges

| Challenge         | Mitigation                             |
| ----------------- | -------------------------------------- |
| Hard to read room | Ask for reactions explicitly           |
| Multitasking      | Keep engagement high, shorter meetings |
| Tech issues       | Test before, have backup               |
| Time zones        | Rotate burden, record if needed        |

### Engagement Techniques

| Technique          | Description                        |
| ------------------ | ---------------------------------- |
| **Chat waterfall** | Everyone types answer, send on cue |
| **Polls**          | Quick temperature checks           |
| **Breakout rooms** | Small group discussion             |
| **Round robin**    | Each person speaks in turn         |
| **Reactions**      | Thumbs up, raise hand features     |

### Hybrid Meeting Rules

| Rule                      | Rationale              |
| ------------------------- | ---------------------- |
| Everyone on own device    | Equal presence         |
| Chat active               | Remote can participate |
| Facilitator monitors both | No one overlooked      |
| Equal speaking time       | Room doesn't dominate  |

## When Should You Skip the Meeting and Go Async?

### When Async Works Better

| Scenario            | Async Tool               |
| ------------------- | ------------------------ |
| Status updates      | Slack/Teams standup bot  |
| Document review     | Shared doc with comments |
| Simple decisions    | Polling tool or thread   |
| Information sharing | Recorded video (Loom)    |
| Brainstorming       | Virtual whiteboard       |

### Async Decision Framework

1. **Document options** in shared doc
2. **Set deadline** for input (24-48 hours)
3. **Collect comments** in document or thread
4. **Synthesize** feedback
5. **Announce decision** with rationale

### Meeting-to-Async Conversion

| Meeting Type    | Async Alternative            |
| --------------- | ---------------------------- |
| Daily standup   | Slack standup post           |
| Weekly status   | Dashboard + async digest     |
| All-hands       | Recorded video + AMA thread  |
| Brainstorm      | Miro board open for 48 hours |
| Document review | Comments in doc              |

## How Do You Measure and Improve Meeting Effectiveness?

### Meeting Health Metrics

| Metric            | Target | How to Measure         |
| ----------------- | ------ | ---------------------- |
| Start on time     | 100%   | Track first 2 weeks    |
| End on time       | 100%   | Track first 2 weeks    |
| Agenda sent       | 100%   | Check calendar invites |
| Clear outcome     | 90%+   | Post-meeting survey    |
| Action completion | 85%+   | Track in notes         |

### Calendar Audit

Weekly, review calendar for:
- Recurring meetings that can be reduced/eliminated
- Meetings without agendas
- Meetings where you're optional
- Back-to-back meetings (no recovery time)

### Continuous Improvement

Monthly meeting retrospective:
- Which meetings added value this month?
- Which felt wasteful?
- What can we try differently?
- Any meetings to cancel?

### Meeting Anti-Patterns

| Anti-Pattern           | Problem                 | Fix                             |
| ---------------------- | ----------------------- | ------------------------------- |
| No agenda              | Wasted time             | Require agenda for all meetings |
| Too many attendees     | Diffused accountability | 7 ± 2 rule                      |
| Status meetings        | Information push        | Make async                      |
| Open-ended discussions | No closure              | Timeboxes                       |
| No decisions           | Meeting again           | Clear decision process          |
| No notes               | Lost context            | Assign note-taker               |

## What's the Difference Between Coaching and Managing?

### Coaching vs. Other Approaches

| Approach      | When to Use                        | Leader's Role        |
| ------------- | ---------------------------------- | -------------------- |
| **Telling**   | Crisis, safety, no time            | Expert, director     |
| **Teaching**  | Skill gap, new domain              | Instructor           |
| **Mentoring** | Career development                 | Sharing experience   |
| **Coaching**  | Capability exists, needs unlocking | Partner, facilitator |

The Core Principle: Ask, don't tell. The coachee holds the answers; your job is to help them find those answers.

## How Do You Use the GROW Model for Coaching Conversations?

### Framework Overview

| Phase       | Purpose                   | Key Questions                  |
| ----------- | ------------------------- | ------------------------------ |
| **G**oal    | Clarify desired outcome   | "What do you want to achieve?" |
| **R**eality | Explore current situation | "Where are you now?"           |
| **O**ptions | Generate possibilities    | "What could you do?"           |
| **W**ill    | Commit to action          | "What will you do?"            |

### Goal Phase Questions

- "What would you like to focus on today?"
- "What outcome do you want from this conversation?"
- "How will you know you've achieved it?"
- "Why is this important to you now?"
- "What would success look like?"

### Reality Phase Questions

- "What's happening currently?"
- "What have you tried so far?"
- "What's working? What isn't?"
- "What obstacles are in the way?"
- "On a scale of 1-10, where are you now?"
- "What resources do you already have?"

### Options Phase Questions

- "What options do you see?"
- "What else could you do?"
- "If you had unlimited resources, what would you try?"
- "What would you advise a friend in this situation?"
- "What's the opposite approach?"
- "Which options appeal to you most?"

### Will Phase Questions

- "Which option will you pursue?"
- "When will you do this?"
- "What's your first step?"
- "What support do you need?"
- "How will you hold yourself accountable?"
- "On a scale of 1-10, how committed are you?"

## How Do You Listen Like a Coach?

### The Three Levels of Listening

| Level           | Focus                         | Quality            |
| --------------- | ----------------------------- | ------------------ |
| **1. Internal** | Your own thoughts, reactions  | Minimal presence   |
| **2. Focused**  | The speaker's words, emotions | Good coaching      |
| **3. Global**   | Energy, unspoken, environment | Masterful coaching |

### Active Listening Techniques

| Technique              | Purpose                | Example                             |
| ---------------------- | ---------------------- | ----------------------------------- |
| **Paraphrasing**       | Confirm understanding  | "So you're saying..."               |
| **Reflecting feeling** | Acknowledge emotion    | "It sounds frustrating that..."     |
| **Summarizing**        | Consolidate key points | "The main issues are X, Y, Z"       |
| **Clarifying**         | Ensure precision       | "When you say X, what do you mean?" |
| **Silence**            | Create space           | *Pause, wait*                       |

### Non-Verbal Awareness

| Signal             | What It May Mean     |
| ------------------ | -------------------- |
| Eye contact breaks | Discomfort, thinking |
| Changed breathing  | Emotion, stress      |
| Posture shift      | Engagement change    |
| Voice tone shift   | Emotional content    |
| Fidgeting          | Anxiety, boredom     |

### Listening Blockers

| Blocker         | Problem                | Alternative            |
| --------------- | ---------------------- | ---------------------- |
| Advising        | Removes ownership      | Ask what they think    |
| Interrupting    | Shuts down exploration | Wait, summarize        |
| Evaluating      | Kills candor           | Stay neutral           |
| Problem-solving | Takes over             | Ask for their solution |

## How Do You Ask Questions That Unlock Insight?

### Question C haracteristics

| Characteristic      | Description                      |
| ------------------- | -------------------------------- |
| **Open-ended**      | Can't be answered yes/no         |
| **Curious**         | Genuinely explore, not lead      |
| **Simple**          | One question at a time           |
| **Forward-focused** | Action-oriented when appropriate |

### Question Types

| Type            | Purpose            | Examples                   |
| --------------- | ------------------ | -------------------------- |
| **Clarifying**  | Understand better  | "What do you mean by...?"  |
| **Deepening**   | Explore further    | "What's behind that?"      |
| **Challenging** | Test assumptions   | "What if that's not true?" |
| **Possibility** | Open up options    | "What else might work?"    |
| **Action**      | Move to commitment | "What's your next step?"   |

### Questions to Avoid

| Question Type         | Problem             | Better Version               |
| --------------------- | ------------------- | ---------------------------- |
| "Why did you...?"     | Feels judgmental    | "What led to that decision?" |
| "Have you tried X?"   | Leading/advising    | "What have you considered?"  |
| "Don't you think...?" | Puts words in mouth | "What do you think?"         |
| Multiple questions    | Confusing           | One question, wait           |

## How Do You Give Feedback That Helps People Grow?

### The SBI Model

| Element       | Description          | Example                                            |
| ------------- | -------------------- | -------------------------------------------------- |
| **S**ituation | When and where       | "In yesterday's team meeting..."                   |
| **B**ehavior  | Observable action    | "...when you interrupted Sarah..."                 |
| **I**mpact    | Effect on you/others | "...the team seemed reluctant to share after that" |

### Feedforward (Marshall Goldsmith)

Instead of critiquing the past, suggest for the future:

1. Pick one behavior to improve
2. Ask for suggestions (not feedback)
3. Listen without defending
4. Thank without evaluating

Example: "I want to be better at running inclusive meetings. What one suggestion do you have?"

### Receiving Feedback

| Step        | Action                      |
| ----------- | --------------------------- |
| **Listen**  | Don't interrupt or defend   |
| **Clarify** | Ask for examples if needed  |
| **Thank**   | Appreciate the effort       |
| **Reflect** | Consider validity privately |
| **Act**     | Make visible improvements   |

### Praise Effectively

| Weak Praise    | Strong Praise                                                |
| -------------- | ------------------------------------------------------------ |
| "Good job"     | "The way you handled that objection showed real preparation" |
| "You're smart" | "Your analysis surfaced issues nobody else caught"           |
| Generic        | Specific behavior + impact                                   |

## How Do You Coach Someone Who's Stuck?

### When Coachee is Stuck

| Symptom          | Intervention                               |
| ---------------- | ------------------------------------------ |
| "I don't know"   | "If you did know, what might it be?"       |
| Going in circles | "Let's step back - what's the real issue?" |
| Avoidance        | "What are you not saying?"                 |
| Overwhelm        | "What's the smallest first step?"          |

### Resistance Patterns

| Pattern           | Possible Cause         | Response                      |
| ----------------- | ---------------------- | ----------------------------- |
| Deflecting        | Fear of accountability | Gently redirect               |
| Intellectualizing | Avoiding emotion       | "How do you feel about that?" |
| Blaming others    | Avoiding ownership     | "What's your part in this?"   |
| Pessimism         | Learned helplessness   | Focus on what IS in control   |

### When Coaching Isn't Appropriate

| Situation           | Better Approach                     |
| ------------------- | ----------------------------------- |
| Performance crisis  | Direct feedback, clear expectations |
| Skill gap (unknown) | Teaching, training                  |
| Values misalignment | Honest conversation about fit       |
| Unwilling coachee   | Don't force it                      |

## How Do You Structure Regular Coaching Relationships?

### Regular Coaching Rhythms

| Type            | Frequency     | Duration  | Focus               |
| --------------- | ------------- | --------- | ------------------- |
| **1:1**         | Weekly        | 30-60 min | Ongoing development |
| **Project**     | As needed     | 15-30 min | Specific challenge  |
| **Career**      | Quarterly     | 60 min    | Long-term growth    |
| **On-the-spot** | Moment arises | 5-10 min  | Immediate learning  |

### 1:1 Structure

| Phase              | Time   | Content                           |
| ------------------ | ------ | --------------------------------- |
| **Check-in**       | 5 min  | How are you? What's on your mind? |
| **Coachee agenda** | 20 min | Their topics (GROW)               |
| **Your agenda**    | 10 min | Updates, context-setting          |
| **Actions**        | 5 min  | Commitments, next steps           |

### Documentation

Track coaching conversations:
- Date and duration
- Topics discussed
- Key insights
- Commitments made
- Follow-up items

## What's the Most Important Thing to Remember About Coaching?

### GROW Cheat Sheet

G: What do you want?
R: Where are you now?
O: What could you do?
W: What will you do?

### Coaching Checklist

- Created safe space
- More listening than talking (80/20)
- Asked open questions
- Avoided giving advice
- Explored options together
- Coachee owns the answer
- Clear commitment made
- Follow-up scheduled

### Phrases That Work

| Situation   | Phrase                                    |
| ----------- | ----------------------------------------- |
| Opening     | "What's most important to discuss today?" |
| Deepening   | "Tell me more about that"                 |
| Exploring   | "What else?"                              |
| Challenging | "What's stopping you?"                    |
| Committing  | "What's your first step?"                 |
| Checking in | "How committed are you, 1-10?"            |

### Red Flags in Coaching

| Flag                         | Issue                      |
| ---------------------------- | -------------------------- |
| You're talking more than 30% | Too directive              |
| Giving lots of advice        | Not coaching               |
| Coachee seems defeated       | May need different support |
| Same topic every session     | Not making progress        |

## How Do You Recognize Scope Creep Before It Kills Your Project?

### Warning Signs

| Signal                 | Indicator                          | Response                                          |
| ---------------------- | ---------------------------------- | ------------------------------------------------- |
| **Feature addition**   | "While we're at it, let's also..." | "That's a great idea - for v2. Let's capture it." |
| **Perfectionism**      | "It's not quite right yet..."      | "What's the minimum that solves the problem?"     |
| **Edge cases**         | "What if someone does X?"          | "How common is X? Let's handle the 80% first."    |
| **Gold plating**       | "Users might want..."              | "Have users asked for this, or are we guessing?"  |
| **Unclear boundaries** | "This might be useful..."          | "Let's define done before adding more."           |
| **Endless research**   | "We should investigate more..."    | "What decision does this research enable?"        |

### Scope Creep Patterns

HEALTHY SCOPE:
Core Feature ✓
User Need ✓
MVP Requirement ✓
............
Phase 2 (captured, not now) 📋

SCOPE CREEP:
Core Feature ✓
"Nice to have" ⚠️
Edge case handling ⚠️
Extra polish ⚠️
"While we're here..." ⚠️
Gold plating ❌
Premature optimization ❌

## How Do You Define What's In vs. Out of Scope?

### The MoSCoW Method

| Priority        | Meaning       | Criteria                                 |
| --------------- | ------------- | ---------------------------------------- |
| **Must have**   | Critical path | Won't work without it                    |
| **Should have** | Important     | Significant value, but workaround exists |
| **Could have**  | Nice to have  | Adds polish, not essential               |
| **Won't have**  | Out of scope  | Explicitly excluded (for now)            |

### MVP Checklist

MVP Definition: [Feature/Project]

Must Have (Ship-blocking)
- [Core functionality 1]
- [Core functionality 2]

Should Have (Target for v1.0)
- [Important enhancement 1]
- [Important enhancement 2]

Could Have (If time permits)
- [Nice to have 1]
- [Nice to have 2]

Won't Have (Explicitly v2+)
- [Future idea 1]
- [Future idea 2]

Definition of Done
[Specific, measurable completion criteria]

## What Do You Say When Someone Wants to Add Features Mid-Project?

### 1. The Capture & Defer

When someone suggests additions:

"That's a great idea. Let me add it to the backlog for Phase 2 so we don't lose it. For now, let's ship the core first."

### 2. The Trade-Off

When scope must grow:

"We can add X, but something needs to come out to keep the timeline. Options:
A) Add X, defer Y to next release
B) Add X, extend timeline by Z days
C) Keep current scope, add X to backlog

Which works best for stakeholders?"

### 3. The MVP Challenge

When features keep adding:

"Quick check: If we shipped today with just what we have, would users get value? If yes, maybe we're already at MVP."

### 4. The 80/20 Cut

When perfectionism strikes:

"This handles the 80% case. The remaining 20% is complex. Ship now, gather feedback, then decide if the 20% is worth it?"

### 5. The Parking Lot

For good ideas at bad times:

"Great idea but out of scope for this sprint. Added to the parking lot - we'll prioritize it next planning."

## How Do You Assess If Your Project is Getting Too Complex?

### Scope Health Check

| Metric                    | Healthy  | Warning          | Critical      |
| ------------------------- | -------- | ---------------- | ------------- |
| **Requirements**          | Stable   | 1-2 changes/week | Daily changes |
| **Timeline**              | On track | Slipping         | Blown         |
| **Team confidence**       | High     | Uncertain        | Low           |
| **Stakeholder alignment** | Clear    | Some confusion   | Conflicting   |
| **Done definition**       | Specific | Vague            | Missing       |

### Complexity Score

Calculate scope complexity:

Base features: ___ × 1 point = ___
Integrations: ___ × 2 points = ___
Edge cases: ___ × 1 point = ___
New technologies: ___ × 3 points = ___
Dependencies: ___ × 2 points = ___
TOTAL: ___

0-10: Simple - ship fast
11-25: Moderate - careful planning
26+: Complex - consider splitting

## How Do You Cut Scope When You Have To?

### When Scope Must Shrink

1. **Cut features, not quality**: Remove whole features vs. half-implementing many
2. **Reduce polish**: Good enough > perfect
3. **Hardcode first**: Configuration can come later
4. **Manual before automated**: Prove value, then optimize
5. **Single platform**: Ship on one, expand later
6. **Invite-only**: Smaller user base = smaller scope

### Questions to Ask

| Question                            | If Yes →       |
| ----------------------------------- | -------------- |
| "Does this block launch?"           | Keep it        |
| "Can users workaround this?"        | Defer it       |
| "Is this proven valuable?"          | Keep if proven |
| "Are we guessing about need?"       | Validate first |
| "Can this be added later?"          | Defer it       |
| "Will this delay other must-haves?" | Defer it       |

## How Do You Keep Scope Under Control Throughout a Project?

### 5-Minute Prep Checklist for Meetings

- Clear purpose?
- Right people invited (no extras)?
- Agenda shared?
- Pre-work distributed?
- Outcomes defined?
- Shortest possible duration?

### Red Flags (Automatic Alert)

Alert when:
- Requirements change > 2x per week
- "Must have" list grows after kickoff
- No explicit "Won't have" list
- Definition of done is missing/vague
- Same feature discussed > 3 times

### Core Philosophy

"A good project ships. A perfect project ships never."

Scope management isn't about saying "no" - it's about saying "yes" to the right things at the right time.
