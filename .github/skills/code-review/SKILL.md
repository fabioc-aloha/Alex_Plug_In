---
applyTo: "**/*review*,**/*PR*,**/*pull*,**/*merge*"
---

# Code Review Skill

> Systematic review patterns for quality and learning.

## Review Goals (Priority Order)

1. **Correctness** — Does it work?
2. **Security** — Is it safe?
3. **Maintainability** — Can others understand it?
4. **Performance** — Is it efficient enough?
5. **Style** — Does it match conventions?

## The 3-Pass Review

### Pass 1: Big Picture (2 min)

- What is this change trying to do?
- Does the approach make sense?
- Is the scope appropriate?

### Pass 2: Logic & Correctness (10 min)

- Are there edge cases?
- Error handling complete?
- Tests cover the changes?

### Pass 3: Readability & Polish (5 min)

- Naming clarity
- Comments where needed
- Style consistency

## Feedback Patterns

### Be Specific

```text
❌ "This is confusing"
✅ "The variable name 'data' doesn't reveal what it contains.
    Consider 'userProfiles' or 'orderHistory'"
```

### Explain Why

```text
❌ "Use a Map instead"
✅ "A Map would give O(1) lookup vs O(n) for this array search,
    which matters since we're calling this in a loop"
```

### Suggest, Don't Demand

```text
❌ "Change this to use async/await"
✅ "Consider using async/await here — it might make the
    error handling clearer. What do you think?"
```

### Praise Good Work

```text
✅ "Nice use of the builder pattern here — makes the
    configuration much more readable"
```

## Comment Prefixes

| Prefix | Meaning |
| ------ | ------- |
| `[blocking]` | Must fix before merge |
| `[suggestion]` | Take it or leave it |
| `[question]` | Seeking understanding |
| `[nit]` | Minor style issue |
| `[future]` | Consider for later |

## Checklist for Reviewers

### Security

- [ ] No secrets/credentials in code
- [ ] Input validation present
- [ ] SQL/command injection prevented
- [ ] Auth checks in place

### Logic

- [ ] Edge cases handled
- [ ] Null/undefined handled
- [ ] Error paths tested
- [ ] Off-by-one errors checked

### Quality

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No debug code left in
- [ ] Logging appropriate

### Style

- [ ] Naming is clear
- [ ] No unnecessary complexity
- [ ] DRY (no copy-paste)
- [ ] Consistent with codebase

## Checklist for Authors

### Before Requesting Review

- [ ] Self-reviewed the diff
- [ ] Tests pass locally
- [ ] Lint/format clean
- [ ] PR description explains "why"
- [ ] Linked to issue/ticket

### PR Description Template

```markdown
## What
Brief description of the change.

## Why
Context and motivation.

## How
Key implementation decisions.

## Testing
How was this tested?

## Screenshots (if UI)
Before/after if applicable.
```

## Review Anti-Patterns

| Anti-Pattern | Better Approach |
| ------------ | --------------- |
| Rubber-stamping | Actually read the code |
| Bikeshedding | Focus on what matters |
| Blocking on style | Use linters instead |
| Being harsh | Be kind, we're all learning |
| Week-long reviews | Review within 24 hours |

## Handling Disagreements

1. Assume good intent
2. Ask clarifying questions
3. Explain your reasoning
4. Offer alternatives
5. Escalate if truly stuck (rare)

## Synapses

See [synapses.json](synapses.json) for connections.
