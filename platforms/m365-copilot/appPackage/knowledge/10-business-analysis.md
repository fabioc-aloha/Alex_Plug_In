# Business Analysis, Scope, and Change Management

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Business Analysis Skill

> Patterns for requirements elicitation, BRDs, process analysis, and stakeholder alignment.

## Business Analysis Deliverables

| Deliverable | Purpose | Audience |
| ----------- | ------- | -------- |
| **Business Case** | Justify investment | Executives, sponsors |
| **BRD** | Document requirements | All stakeholders |
| **Functional Spec** | Detail system behavior | Dev team, testers |
| **Use Cases** | Describe user interactions | Designers, developers |
| **Process Maps** | Visualize workflows | Process owners, analysts |
| **Data Dictionary** | Define data elements | Technical team |

## Requirements Hierarchy

```text
Business Requirements (WHY)
    └── Stakeholder Requirements (WHO needs WHAT)
        └── Solution Requirements
            ├── Functional (WHAT it does)
            └── Non-Functional (HOW WELL it does it)
                └── Transition Requirements (HOW we get there)
```

## BRD Structure

### Standard Sections

1. **Executive Summary** — One-page overview for executives
2. **Business Objectives** — Measurable goals (SMART)
3. **Scope** — In scope, out of scope, boundaries
4. **Stakeholders** — Who's involved, their interests
5. **Current State** — As-is process, pain points
6. **Future State** — To-be vision, benefits
7. **Functional Requirements** — What the solution must do
8. **Non-Functional Requirements** — Quality attributes
9. **Assumptions & Constraints** — Known limitations
10. **Dependencies** — External factors
11. **Risks** — What could go wrong
12. **Glossary** — Term definitions

### Requirements Writing

#### SMART Criteria

| Letter | Meaning | Test |
| ------ | ------- | ---- |
| **S** | Specific | Is it clear what's needed? |
| **M** | Measurable | Can we verify it's done? |
| **A** | Achievable | Is it realistic? |
| **R** | Relevant | Does it support objectives? |
| **T** | Time-bound | Is there a deadline? |

#### Good vs. Bad Requirements

| Bad | Problem | Better |
| --- | ------- | ------ |
| "System should be fast" | Not measurable | "Page load < 2 seconds" |
| "Easy to use" | Subjective | "Complete task in < 3 clicks" |
| "Handle all cases" | Unbounded | "Support cases A, B, C" |
| "Similar to competitor" | Vague | "[Specific features listed]" |
| "Should probably..." | Uncertain | "Must" or "Should" (MoSCoW) |

#### Requirement Attributes

| Attribute | Purpose |
| --------- | ------- |
| ID | Unique identifier (REQ-001) |
| Description | What is required |
| Priority | MoSCoW or numeric |
| Source | Who requested it |
| Rationale | Why it's needed |
| Acceptance Criteria | How to verify |
| Dependencies | Related requirements |
| Status | Draft/Approved/Implemented |

## Elicitation Techniques

### Technique Selection

| Technique | Best For | Effort |
| --------- | -------- | ------ |
| **Interviews** | Deep understanding, complex topics | High |
| **Workshops** | Consensus, group decisions | Medium |
| **Surveys** | Broad input, quantitative data | Low |
| **Observation** | Understanding real workflows | High |
| **Document Analysis** | Existing systems, regulations | Low |
| **Prototyping** | Validating concepts, UI | Medium |
| **Focus Groups** | User perspectives, reactions | Medium |

### Interview Best Practices

- Prepare questions in advance
- Start broad, then specific
- Use open-ended questions
- Listen more than talk (80/20)
- Probe with "Why?" and "How?"
- Summarize and confirm understanding
- Document immediately after

### Workshop Facilitation

| Phase | Activities |
| ----- | ---------- |
| **Open** | Objectives, agenda, ground rules |
| **Diverge** | Brainstorm, generate options |
| **Converge** | Prioritize, decide |
| **Close** | Summarize, next steps, thank |

## Use Case Development

### Use Case Template

```text
Use Case: [UC-001] [Name]
Actor: [Primary actor]
Precondition: [What must be true before]
Trigger: [What initiates the use case]

Main Flow:
1. Actor does X
2. System responds with Y
3. ...

Alternative Flows:
2a. If condition, then...

Exception Flows:
2b. If error, then...

Postcondition: [What is true after]
Business Rules: [Applicable rules]
```

### Use Case Levels

| Level | Scope | Example |
| ----- | ----- | ------- |
| **Summary** | Multiple sessions | "Manage Customer Account" |
| **User Goal** | One sitting | "Place Order" |
| **Subfunction** | Part of a step | "Validate Address" |

## Process Analysis

### Current State Analysis

1. Map as-is process (BPMN, swimlane)
2. Identify pain points
3. Measure current performance
4. Find root causes
5. Quantify improvement opportunity

### Process Mapping Notations

| Notation | Best For |
| -------- | -------- |
| BPMN | Detailed, technical processes |
| Swimlane | Cross-functional workflows |
| Value Stream | Lean analysis |
| SIPOC | High-level overview |

### SIPOC Template

| S | I | P | O | C |
| - | - | - | - | - |
| Suppliers | Inputs | Process | Outputs | Customers |
| Who provides? | What's needed? | High-level steps | What's produced? | Who receives? |

## Gap Analysis

### Gap Analysis Framework

```text
Current State → Gap → Future State
     │           │          │
     ▼           ▼          ▼
  As-Is     What needs   To-Be
  Process   to change    Vision
```

### Gap Categories

| Type | Examples |
| ---- | -------- |
| **Process** | Missing steps, manual work |
| **Technology** | System limitations |
| **People** | Skills, capacity |
| **Data** | Quality, availability |
| **Policy** | Rules, compliance |

## Acceptance Criteria

### Gherkin Format

```gherkin
Given [precondition]
When [action]
Then [expected result]
And [additional result]
```

### Acceptance Criteria Checklist

- [ ] Testable — Can write a test case
- [ ] Clear — Unambiguous language
- [ ] Complete — Covers happy path and edges
- [ ] Independent — Doesn't require other criteria
- [ ] Valuable — Ties to user need

## Traceability

### Traceability Matrix

| Req ID | Business Objective | Design | Test Case | Status |
| ------ | ------------------ | ------ | --------- | ------ |
| REQ-001 | OBJ-01 | DES-005 | TC-012 | Passed |

### Traceability Benefits

- Ensure all requirements implemented
- Impact analysis for changes
- Test coverage verification
- Audit compliance evidence

## Prioritization Techniques

### MoSCoW

| Priority | Meaning | Guidance |
| -------- | ------- | -------- |
| **Must** | Critical for success | ~60% of effort |
| **Should** | Important, not critical | ~20% of effort |
| **Could** | Nice to have | ~20% of effort |
| **Won't** | Out of scope (this release) | Documented |

### Value vs. Effort Matrix

```text
High Value │ Quick Wins │ Major Projects │
           │ (Do first) │ (Plan carefully)│
Low Value  │ Fill-ins   │ Avoid           │
           │ (If time)  │ (Don't do)      │
           └────────────┴─────────────────┘
             Low Effort   High Effort
```

### Kano Model

| Type | If Present | If Absent |
| ---- | ---------- | --------- |
| **Basic** | Expected, no delight | Dissatisfied |
| **Performance** | More is better | Less is worse |
| **Delighter** | Unexpected joy | Not missed |

## Common BA Pitfalls

| Pitfall | Prevention |
| ------- | ---------- |
| Solution jumping | Ask "why" before "how" |
| Missing stakeholders | Stakeholder analysis early |
| Gold plating | Tie everything to objectives |
| Assumption blindness | Document and validate assumptions |
| Scope creep | Change control process |
| Analysis paralysis | Timeboxed analysis, iterate |

---

# Scope Management Skill

Recognize scope creep, suggest MVP cuts, and help maintain healthy project boundaries. The art of delivering the right thing, not everything.

## Core Philosophy

> "A good project ships. A perfect project ships never."

Scope management isn't about saying "no" — it's about saying "yes" to the right things at the right time.

## Scope Creep Detection

### Warning Signs

| Signal | Indicator | Response |
|--------|-----------|----------|
| **Feature addition** | "While we're at it, let's also..." | "That's a great idea — for v2. Let's capture it." |
| **Perfectionism** | "It's not quite right yet..." | "What's the minimum that solves the problem?" |
| **Edge cases** | "What if someone does X?" | "How common is X? Let's handle the 80% first." |
| **Gold plating** | "Users might want..." | "Have users asked for this, or are we guessing?" |
| **Unclear boundaries** | "This might be useful..." | "Let's define done before adding more." |
| **Endless research** | "We should investigate more..." | "What decision does this research enable?" |

### Scope Creep Patterns

```
HEALTHY SCOPE:
┌──────────────────────────────────────┐
│  ✅ Core Feature                     │
│  ✅ User Need                        │
│  ✅ MVP Requirement                  │
│  ----------------------------------- │
│  📋 Phase 2 (captured, not now)     │
└──────────────────────────────────────┘

SCOPE CREEP:
┌──────────────────────────────────────┐
│  ✅ Core Feature                     │
│  ⚠️ "Nice to have"                   │
│  ⚠️ Edge case handling               │
│  ⚠️ Extra polish                     │
│  ⚠️ "While we're here..."           │
│  ❌ Gold plating                     │
│  ❌ Premature optimization           │
└──────────────────────────────────────┘
```

## MVP Definition Framework

### The MoSCoW Method

| Priority | Meaning | Criteria |
|----------|---------|----------|
| **Must have** | Critical path | Won't work without it |
| **Should have** | Important | Significant value, but workaround exists |
| **Could have** | Nice to have | Adds polish, not essential |
| **Won't have** | Out of scope | Explicitly excluded (for now) |

### MVP Checklist

```markdown
## MVP Definition: [Feature/Project]

### Must Have (Ship-blocking)
- [ ] [Core functionality 1]
- [ ] [Core functionality 2]

### Should Have (Target for v1.0)
- [ ] [Important enhancement 1]
- [ ] [Important enhancement 2]

### Could Have (If time permits)
- [ ] [Nice to have 1]
- [ ] [Nice to have 2]

### Won't Have (Explicitly v2+)
- [ ] [Future idea 1]
- [ ] [Future idea 2]

### Definition of Done
[ ] [Specific, measurable completion criteria]
```

## Scope Negotiation Patterns

### 1. The Capture & Defer

When someone suggests additions:

```
"That's a great idea. Let me add it to the backlog for Phase 2 
so we don't lose it. For now, let's ship the core first."
```

### 2. The Trade-Off

When scope must grow:

```
"We can add X, but something needs to come out to keep the timeline.
Options:
A) Add X, defer Y to next release
B) Add X, extend timeline by Z days
C) Keep current scope, add X to backlog

Which works best for stakeholders?"
```

### 3. The MVP Challenge

When features keep adding:

```
"Quick check: If we shipped today with just what we have,
would users get value? If yes, maybe we're already at MVP."
```

### 4. The 80/20 Cut

When perfectionism strikes:

```
"This handles the 80% case. The remaining 20% is complex.
Ship now, gather feedback, then decide if the 20% is worth it?"
```

### 5. The Parking Lot

For good ideas at bad times:

```
"Great idea but out of scope for this sprint. 
Added to the parking lot — we'll prioritize it next planning."
```

## Complexity Assessment

### Scope Health Check

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| **Requirements** | Stable | 1-2 changes/week | Daily changes |
| **Timeline** | On track | Slipping | Blown |
| **Team confidence** | High | Uncertain | Low |
| **Stakeholder alignment** | Clear | Some confusion | Conflicting |
| **Done definition** | Specific | Vague | Missing |

### Complexity Score

Calculate scope complexity:

```
Base features:     ___ × 1 point  = ___
Integrations:      ___ × 2 points = ___
Edge cases:        ___ × 1 point  = ___
New technologies:  ___ × 3 points = ___
Dependencies:      ___ × 2 points = ___
                   ─────────────────────
                   TOTAL:           ___

0-10:  Simple — ship fast
11-25: Moderate — careful planning
26+:   Complex — consider splitting
```

## Scope Reduction Tactics

### When Scope Must Shrink

1. **Cut features, not quality**: Remove whole features vs. half-implementing many
2. **Reduce polish**: Good enough > perfect
3. **Hardcode first**: Configuration can come later
4. **Manual before automated**: Prove value, then optimize
5. **Single platform**: Ship on one, expand later
6. **Invite-only**: Smaller user base = smaller scope

### Questions to Ask

| Question | If Yes → |
|----------|----------|
| "Does this block launch?" | Keep it |
| "Can users workaround this?" | Defer it |
| "Is this proven valuable?" | Keep if proven |
| "Are we guessing about need?" | Validate first |
| "Can this be added later?" | Defer it |
| "Will this delay other must-haves?" | Defer it |

## Session Protocol

### When to Invoke Scope Management

1. **Project kickoff**: Define MVP boundaries upfront
2. **Feature requests**: Evaluate fit against scope
3. **Timeline pressure**: Identify cutting candidates
4. **Complexity growth**: Assess scope health
5. **Before release**: Final scope check

### Scope Check Command

```
/scopecheck

Output:
📊 Scope Health Report

Current scope: 12 features
- Must have: 5 ✅
- Should have: 4 🔄
- Could have: 3 ⏳

Complexity score: 18 (Moderate)
Recommendation: Consider deferring 2 "could have" items
to hit timeline with confidence.
```

## Integration Points

### With Other Skills
- **proactive-assistance**: Detect scope growth, offer check
- **status-reporting**: Include scope health in updates
- **alex-effort-estimation**: Scope impacts estimates
- **project-management**: Backlog management

### Triggers for This Skill
- "scope creep", "adding features"
- "what's MVP", "minimum viable"
- "can we cut", "reduce scope"
- "too much", "won't finish"
- Feature list growing
- Timeline pressure

## Red Flags (Automatic Alert)

Alert when:
- Requirements change > 2x per week
- "Must have" list grows after kickoff
- No explicit "Won't have" list
- Definition of done is missing/vague
- Same feature discussed > 3 times

## Metrics

- **Scope stability**: Changes per week
- **MVP adherence**: % of original scope shipped
- **Creep capture rate**: % of additions parked for later
- **Ship rate**: Projects that actually ship

---

## Related Skills

- [proactive-assistance](..\proactive-assistance/SKILL.md) — Detect scope growth early
- [status-reporting](..\status-reporting/SKILL.md) — Report scope health
- [alex-effort-estimation](..\alex-effort-estimation/SKILL.md) — Scope affects estimates
- [project-management](..\project-management/SKILL.md) — Overall project tracking

---

*Ship small, ship often, ship something.*

---

# Change Management Skill

> Patterns for organizational change, ADKAR methodology, stakeholder engagement, and adoption strategies.

## Change Management Frameworks

| Framework | Focus | Best For |
| --------- | ----- | -------- |
| **ADKAR** | Individual change | Specific, measurable transitions |
| **Kotter's 8 Steps** | Organizational momentum | Large-scale transformation |
| **Lewin's 3 Stage** | Simple conceptual model | Teaching, small changes |
| **McKinsey 7S** | Organizational alignment | Strategic restructuring |
| **Bridges Transition** | Psychological transition | People-focused change |

## ADKAR Model Deep Dive

### The Five Elements

| Element | Question | Achieved When |
| ------- | -------- | ------------- |
| **A**wareness | Why is change needed? | Person understands business reasons |
| **D**esire | What's in it for me? | Person wants to participate |
| **K**nowledge | How do I change? | Person knows what to do |
| **A**bility | Can I do it? | Person can demonstrate new skills |
| **R**einforcement | Will it stick? | Systems sustain the change |

### ADKAR Assessment Template

```text
Rate 1-5 for each stakeholder group:

Awareness:     [ ] Do they understand WHY?
Desire:        [ ] Do they WANT to change?
Knowledge:     [ ] Do they know HOW?
Ability:       [ ] Can they DO it?
Reinforcement: [ ] Will it STICK?

Barrier Point: First element scoring ≤ 3
Action Focus:  Address barrier point first
```

### Barrier Point Actions

| Barrier | Tactics |
| ------- | ------- |
| **Awareness** | Communications, business case, impact stories |
| **Desire** | WIIFM, sponsor engagement, peer advocacy |
| **Knowledge** | Training, job aids, documentation |
| **Ability** | Practice, coaching, support resources |
| **Reinforcement** | Recognition, metrics, accountability |

## Stakeholder Analysis

### Power/Interest Grid

```text
High Power  │ Keep Satisfied │ Manage Closely │
            │                │                │
Low Power   │ Monitor        │ Keep Informed  │
            └────────────────┴────────────────┘
              Low Interest     High Interest
```

### Stakeholder Mapping Template

| Stakeholder | Impact | Influence | Current State | Target State | Strategy |
| ----------- | ------ | --------- | ------------- | ------------ | -------- |
| [Name/Group] | H/M/L | H/M/L | Supportive/Neutral/Resistant | Advocate/Supportive | [Actions] |

### Influence Strategies by Quadrant

| Quadrant | Strategy |
| -------- | -------- |
| High Power, High Interest | Engage deeply, involve in decisions |
| High Power, Low Interest | Keep satisfied, don't overwhelm |
| Low Power, High Interest | Keep informed, leverage as advocates |
| Low Power, Low Interest | Monitor, minimal effort |

## Resistance Management

### Types of Resistance

| Type | Signs | Root Cause |
| ---- | ----- | ---------- |
| **Active** | Vocal opposition, sabotage | Strong disagreement |
| **Passive** | Slow compliance, "forgetting" | Low desire or ability |
| **Hidden** | Surface agreement, no action | Fear or distrust |

### Resistance Root Causes

- **Loss** — Status, comfort, competence, relationships
- **Fear** — Unknown, failure, looking incompetent
- **Distrust** — Past failures, leadership credibility
- **Disagreement** — Believe current way is better
- **Overload** — Too many changes, not enough capacity

### Response Strategies

| Cause | Response |
| ----- | -------- |
| Loss | Acknowledge, involve in design |
| Fear | Provide safety, support, training |
| Distrust | Transparent communication, quick wins |
| Disagreement | Listen, incorporate feedback, explain |
| Overload | Prioritize, phase, resource |

## Communication Planning

### ADKAR-Aligned Messages

| Phase | Key Messages |
| ----- | ------------ |
| **Awareness** | Why change, what's happening, timeline |
| **Desire** | Benefits, WIIFM, success stories |
| **Knowledge** | How-to, resources, training schedule |
| **Ability** | Support available, practice opportunities |
| **Reinforcement** | Progress updates, recognition, results |

### Channel Selection

| Channel | Best For |
| ------- | -------- |
| Executive video | Awareness, importance |
| Town halls | Q&A, two-way dialogue |
| Email | Reference information |
| Team meetings | Local context, discussion |
| Champions | Peer influence, support |
| Intranet | Self-service resources |

### Communication Frequency by Phase

| Phase | Frequency |
| ----- | --------- |
| Pre-launch | Weekly builds to daily |
| Launch | Daily to multiple per day |
| Post-launch | Daily decreasing to weekly |
| Sustain | Periodic reinforcement |

## Sponsor Engagement

### Effective Sponsor Actions

- Communicate directly (not just through project team)
- Visible participation in key events
- Remove obstacles and allocate resources
- Recognize and reward adoption
- Hold people accountable
- Model the change personally

### Sponsor Coaching Topics

| Topic | Key Points |
| ----- | ---------- |
| Role clarity | Active vs. passive sponsorship |
| Time investment | 10-20% of time during change |
| Communication | Authentic, frequent, cascaded |
| Resistance | Personal conversations with resistors |
| Coalition | Building peer sponsor network |

## Training & Support Design

### Knowledge Transfer Methods

| Method | Best For |
| ------ | -------- |
| Instructor-led | Complex, interactive skills |
| E-learning | Basic, self-paced, compliance |
| Job aids | Quick reference, procedures |
| Coaching | Individual skill development |
| Peer learning | Practical tips, ongoing support |
| Sandbox/practice | Safe experimentation |

### Support Structure

```text
Tier 1: Self-service (docs, FAQs, videos)
    ↓
Tier 2: Floor support (champions, super users)
    ↓
Tier 3: Help desk (technical issues)
    ↓
Tier 4: Specialists (complex problems)
```

## Measuring Change Success

### Leading Indicators

- Training completion rates
- Communication reach/engagement
- Stakeholder sentiment surveys
- Champion activity levels
- Support ticket themes

### Lagging Indicators

- Adoption/utilization metrics
- Proficiency assessments
- Process compliance
- Business outcomes
- Employee satisfaction

### ADKAR Metrics

| Element | Metric Examples |
| ------- | --------------- |
| Awareness | Survey: "Do you understand why?" |
| Desire | Survey: "Do you support this change?" |
| Knowledge | Assessment scores, training completion |
| Ability | Proficiency demonstration, error rates |
| Reinforcement | Sustained metrics, audit results |

## Change Saturation

### Capacity Assessment

- Count concurrent changes per person/team
- Assess cumulative impact
- Identify change collisions
- Recommend sequencing/phasing

### Saturation Warning Signs

- Increased resistance to any change
- "Change fatigue" language
- Declining engagement
- Quality/productivity drops
- Increased turnover

---

# Financial Analysis Skill

> Financial modeling, analysis frameworks, and regulatory awareness for business-minded professionals.

## Core Principle

Financial analysis transforms raw numbers into decisions. Every model, ratio, and forecast exists to answer one question: *Should we do this?*

## Financial Statement Analysis

### The Three Statements

| Statement | Measures | Key Question |
|-----------|----------|-------------|
| **Income Statement** | Profitability over a period | Is the business making money? |
| **Balance Sheet** | Assets, liabilities, equity at a point in time | What does the business own and owe? |
| **Cash Flow Statement** | Cash movement over a period | Where is the cash going? |

### Key Ratios

#### Profitability
| Ratio | Formula | Meaning |
|-------|---------|---------|
| Gross Margin | (Revenue − COGS) / Revenue | Pricing power and production efficiency |
| Operating Margin | Operating Income / Revenue | Core business profitability |
| Net Margin | Net Income / Revenue | Bottom-line profitability |
| ROE | Net Income / Shareholders' Equity | Return to equity holders |
| ROA | Net Income / Total Assets | Asset efficiency |

#### Liquidity
| Ratio | Formula | Healthy Range |
|-------|---------|---------------|
| Current Ratio | Current Assets / Current Liabilities | 1.5–3.0 |
| Quick Ratio | (Current Assets − Inventory) / Current Liabilities | 1.0–2.0 |
| Cash Ratio | Cash / Current Liabilities | 0.5–1.0 |

#### Leverage
| Ratio | Formula | Watch For |
|-------|---------|-----------|
| Debt-to-Equity | Total Debt / Total Equity | >2.0 signals high leverage |
| Interest Coverage | EBIT / Interest Expense | <1.5 signals debt stress |
| Debt-to-EBITDA | Total Debt / EBITDA | >4.0 may limit borrowing capacity |

## Financial Modeling

### DCF (Discounted Cash Flow)

**When to use**: Valuing a business, project, or investment based on future cash flows.

**Steps:**
1. Project free cash flows (FCF) for 5–10 years
2. Calculate terminal value (perpetuity growth or exit multiple)
3. Discount all cash flows to present value using WACC
4. Sum = enterprise value
5. Subtract net debt → equity value

**Key assumptions to document:**
- Revenue growth rate and drivers
- Margin trajectory
- Capital expenditure requirements
- Working capital changes
- Discount rate (WACC) and terminal growth rate

### Comparable Company Analysis (Comps)

| Step | Action |
|------|--------|
| 1 | Select peer group (industry, size, geography) |
| 2 | Gather trading multiples (EV/EBITDA, P/E, EV/Revenue) |
| 3 | Calculate median and mean multiples |
| 4 | Apply multiples to target company metrics |
| 5 | Derive implied valuation range |

### Scenario Analysis

Always model three cases:

| Scenario | Purpose | Probability Weight |
|----------|---------|-------------------|
| **Base** | Most likely outcome | 50–60% |
| **Upside** | Favorable conditions | 20–25% |
| **Downside** | Adverse conditions | 20–25% |

## Budgeting & Forecasting

### Budget Types

| Type | Method | Best For |
|------|--------|----------|
| **Zero-based** | Justify every line from zero | Cost control, new initiatives |
| **Incremental** | Adjust prior year ±% | Stable operations |
| **Activity-based** | Cost per activity/output | Service organizations |
| **Rolling** | Continuously extend 12-month window | Dynamic environments |

### Variance Analysis

| Variance | Formula | Interpretation |
|----------|---------|---------------|
| Favorable | Actual better than budget | Outperformance or conservative budget |
| Unfavorable | Actual worse than budget | Underperformance or aggressive budget |
| Volume variance | (Actual units − Budget units) × Budget price | Demand-driven |
| Price variance | (Actual price − Budget price) × Actual units | Pricing/cost-driven |

## Real Estate Financial Analysis

### Property Valuation Methods

| Method | Approach | Best For |
|--------|----------|----------|
| **Cap Rate** | NOI / Property Value | Income-producing properties |
| **Comparable Sales** | Recent sale prices of similar properties | Residential, land |
| **Cost Approach** | Land value + replacement cost − depreciation | Unique properties |

### Key Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Cap Rate | NOI / Purchase Price | 4–10% depending on market |
| Cash-on-Cash Return | Annual Cash Flow / Total Cash Invested | 8–12% |
| DSCR (Debt Service Coverage) | NOI / Annual Debt Service | >1.25 |
| GRM (Gross Rent Multiplier) | Price / Annual Gross Rent | Lower = better value |

## Regulatory Awareness

### Key Frameworks (Not Legal Advice)

| Framework | Scope | Applies To |
|-----------|-------|-----------|
| **SOX** (Sarbanes-Oxley) | Financial reporting controls, audit requirements | US public companies |
| **PCI-DSS** | Payment card data security | Any business processing card payments |
| **Basel III/IV** | Capital adequacy, liquidity requirements | Banks and financial institutions |
| **Dodd-Frank** | Financial stability, consumer protection | US financial institutions |
| **IFRS vs GAAP** | Accounting standards | International vs US reporting |
| **MiFID II** | Financial instrument markets | EU investment firms |

### Financial Compliance Patterns

- **Segregation of duties**: No single person controls an entire financial process
- **Audit trails**: Every financial transaction traceable to source documentation
- **Materiality thresholds**: Define what magnitude of error requires disclosure
- **Internal controls**: Preventive (approvals) and detective (reconciliations)

## Anti-Patterns

- Building models without documenting assumptions
- Using a single-point forecast instead of scenarios
- Confusing revenue with cash flow
- Ignoring working capital in projections
- Treating all debt as equivalent (ignoring covenants, maturity, rates)
- Circular references in spreadsheet models without iteration controls
