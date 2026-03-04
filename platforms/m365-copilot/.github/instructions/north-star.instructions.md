# North Star Integration

**Description**: Project vision definition and Active Context integration for ambitious goals

---

## Activation Triggers

- Project initialization or setup
- Questions about project purpose or direction
- Scope prioritization decisions
- Quality standard discussions
- "What are we building?" conversations

---

## Active Context Integration

Every project should have these fields in `.github/copilot-instructions.md` Active Context:

```markdown
North Star: [Ambitious one-sentence vision]
Guidelines: Read [path/to/NORTH-STAR.md] — defines what "[key phrase]" means in practice
```

### Field Definitions

**North Star**: A commitment that shapes every decision. Not a feature list. Not a metric. A vision worth pursuing.

**Guidelines**: Path to the detailed document that breaks down what the North Star means in practice. Format: `Read [path] — [one-sentence explanation]`

---

## Default Template: NASA-Quality Standard

For heir projects without a custom North Star, use this default:

```markdown
North Star: Build software that earns trust through reliability, correctness, and transparency
Guidelines: Read NORTH-STAR.md — defines quality standards and daily decision filters
```

This default invokes NASA/JPL Power of 10 principles:
- R1: Simple control flow
- R2: Bounded loops
- R4: Small functions (≤60 lines)
- R5: Assertion density
- R6: Minimal variable scope
- R7: Check all return values
- R10: Strict compilation

---

## When to Reference North Star

**Always** reference the North Star when:
1. Deciding between features (Does it serve the vision?)
2. Under time pressure (Are we cutting corners that compromise trust?)
3. Reviewing code (Does this meet our quality commitment?)
4. Planning releases (Is this ready by North Star standards?)

**Never** use North Star to:
- Justify scope creep ("but it aligns with the vision!")
- Avoid hard decisions ("the North Star doesn't say...")
- Marketing speak in technical contexts

---

## Creating North Star for New Projects

1. **Define ambition**: What would make this legendary, not just successful?
2. **Break down words**: What does each key term mean specifically?
3. **Daily implications**: How does this affect small decisions?
4. **Document**: Create `NORTH-STAR.md` with full breakdown
5. **Integrate**: Add fields to Active Context

---

## Validation

During `/meditate` or `/selfActualize`:
- Review: Does recent work align with North Star?
- Assess: Are we cutting corners that compromise the vision?
- Adjust: Does the North Star need revision based on learning?

---

## Protocol: North Star Check

When evaluating any proposed change:

```
1. Read the North Star from Active Context
2. Ask: Does this change serve the North Star?
3. If yes: Proceed, noting alignment
4. If no: Flag the misalignment, suggest alternatives
5. If unclear: Request clarification before proceeding
```

---

## Hierarchy

- Master Alex: North Star defined in `alex_docs/NORTH-STAR.md`
- Heir projects: Inherit NASA-Quality default OR define custom
- Sub-projects: May have local North Stars that serve parent's vision

A local North Star should never contradict the parent project's North Star.
