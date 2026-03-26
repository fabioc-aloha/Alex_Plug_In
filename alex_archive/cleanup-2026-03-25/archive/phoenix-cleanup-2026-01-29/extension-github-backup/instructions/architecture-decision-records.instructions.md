# Architecture Decision Records (ADR) Procedural Memory

**Classification**: Procedural Memory | Documentation  
**Activation**: ADR, architecture decision, why did we, design decision, technical decision, trade-off  
**Priority**: Standard - Document significant decisions for future reference

---

## Synapses

- [deep-thinking.instructions.md] → (High, Supports, Bidirectional) - "ADRs require systematic analysis"
- [technical-debt-tracking.instructions.md] → (Medium, Coordinates, Forward) - "Decisions may create intentional debt"
- [release-management.instructions.md] → (Low, Documents, Forward) - "Major changes should have ADRs"

---

## What Warrants an ADR?

### ✅ Create ADR When:

- Choosing between multiple viable approaches
- Adopting or dropping a technology/framework
- Changing system architecture significantly
- Establishing coding standards or patterns
- Making decisions that will be hard to reverse
- Team disagrees and needs documented consensus

### ❌ Skip ADR When:

- Decision is trivial or easily reversible
- Standard practice with no alternatives considered
- Bug fix or minor enhancement
- Personal preference with no impact on others

---

## ADR Template

```markdown
# ADR-{number}: {Title}

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-XXX  
**Date**: YYYY-MM-DD  
**Deciders**: @person1, @person2  
**Technical Story**: {link to issue/ticket if applicable}

## Context

What is the issue that we're seeing that is motivating this decision or change?

- Background information
- Current situation
- Problem statement
- Constraints we're working within

## Decision Drivers

- Driver 1 (e.g., performance requirements)
- Driver 2 (e.g., team expertise)
- Driver 3 (e.g., timeline constraints)
- Driver 4 (e.g., budget)

## Considered Options

### Option 1: {Name}

**Description**: Brief explanation

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

### Option 2: {Name}

**Description**: Brief explanation

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

### Option 3: {Name}

(Continue as needed)

## Decision

We will use **Option X** because:

1. Reason 1
2. Reason 2
3. Reason 3

## Consequences

### Positive

- Consequence 1
- Consequence 2

### Negative

- Consequence 1 (accepted trade-off)
- Consequence 2 (mitigation: how we'll handle it)

### Risks

- Risk 1: {description} → Mitigation: {approach}

## Follow-up Actions

- [ ] Action 1
- [ ] Action 2

## References

- Link to relevant documentation
- Link to research or benchmarks
- Link to related ADRs
```

---

## ADR Storage

### Location

```
project/
├── docs/
│   └── adr/
│       ├── README.md          # Index of all ADRs
│       ├── ADR-001-*.md
│       ├── ADR-002-*.md
│       └── templates/
│           └── adr-template.md
```

### Naming Convention

```
ADR-{number}-{short-title}.md
ADR-001-use-typescript-for-extension.md
ADR-002-embedded-synapse-notation.md
ADR-003-scripts-over-cicd.md
```

### Index File (docs/adr/README.md)

```markdown
# Architecture Decision Records

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](ADR-001-use-typescript.md) | Use TypeScript for Extension | Accepted | 2025-06-15 |
| [ADR-002](ADR-002-embedded-synapses.md) | Embedded Synapse Notation | Accepted | 2025-08-20 |
| [ADR-003](ADR-003-scripts-over-cicd.md) | Deployment Scripts over CI/CD | Accepted | 2026-01-23 |

## By Status

### Accepted
- ADR-001, ADR-002, ADR-003

### Proposed
- (none)

### Deprecated
- (none)
```

---

## ADR Workflow

### Step 1: Recognize Decision Point

Trigger phrases:
- "Should we use X or Y?"
- "Why don't we just..."
- "I think we should change..."
- "What's the best way to..."

### Step 2: Draft ADR

1. Create file: `docs/adr/ADR-XXX-title.md`
2. Set status to **Proposed**
3. Fill in Context and Options sections
4. Share with stakeholders for input

### Step 3: Decide

1. Discuss options (meeting, async comments, PR review)
2. Reach consensus or decision-maker decides
3. Fill in Decision and Consequences sections
4. Update status to **Accepted**

### Step 4: Implement

1. Execute the decision
2. Reference ADR in related code/commits
3. Complete follow-up actions
4. Update ADR if learnings emerge

### Step 5: Evolve

If decision needs to change:
1. Don't edit the original ADR (preserve history)
2. Create new ADR that supersedes it
3. Update original status to **Superseded by ADR-XXX**

---

## Trigger Phrases & Responses

| User Says | Alex Response |
|-----------|---------------|
| "Why did we..." | "Let me check if there's an ADR for that decision. If not, should we document the reasoning now?" |
| "Should we use X or Y?" | "This sounds like an architecture decision. Let me help you draft an ADR to analyze the options." |
| "Create an ADR" | "I'll create a new ADR. What's the decision about? What options are you considering?" |
| "Show me the ADRs" | "Let me check the docs/adr/ folder for the decision index." |
| "This decision was wrong" | "Let's not delete the ADR - instead, create a new one that supersedes it. What did we learn?" |

---

## Quick ADR (For Smaller Decisions)

Not every decision needs the full template. For smaller choices:

```markdown
# ADR-XXX: {Title}

**Status**: Accepted | **Date**: YYYY-MM-DD

**Context**: {1-2 sentences}

**Decision**: We will {choice} because {primary reason}.

**Consequences**: {1-2 sentences on impact}
```

---

## ADR Quality Checklist

Before marking an ADR as Accepted:

- [ ] Context clearly explains the problem
- [ ] At least 2 options were genuinely considered
- [ ] Pros and cons are honest (not just justifying a preference)
- [ ] Decision rationale is clear to future readers
- [ ] Negative consequences are acknowledged
- [ ] Status and date are set correctly

---

## Anti-Patterns

### ❌ Do NOT:
- Write ADRs after the fact to justify decisions (write them during)
- Delete or heavily edit accepted ADRs (create superseding ADR instead)
- Skip the "Considered Options" section (shows you thought it through)
- Use ADRs for trivial decisions (wastes time)
- Forget to update the index

### ✅ Always:
- Write ADRs when you're actually deciding
- Include the context you had at the time
- Be honest about trade-offs
- Link to related ADRs
- Make ADRs discoverable (good titles, index)

---

*Last Updated: 2026-01-23*
*This procedural memory ensures significant decisions are documented with their context and rationale*
