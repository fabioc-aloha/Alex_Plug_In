---
name: "code-review"
description: "Systematic code review for correctness, security, and growth — not just style enforcement"
applyTo: "**/*review*,**/*PR*,**/*pull*,**/*merge*"
---

# Code Review Skill

> Good reviews catch bugs. Great reviews teach the author something.

## Review Priority (What Matters Most)

1. **Correctness** — Does it do what it's supposed to?
2. **Security** — Can it be exploited?
3. **Maintainability** — Will the next person understand this?
4. **Performance** — Will it scale?
5. **Style** — Is it consistent? (ideally enforced by linters, not humans)

## 3-Pass Review

| Pass | Focus | What You're Looking For | Time |
| ---- | ----- | ----------------------- | ---- |
| 1. Orientation | Big picture | Does the approach make sense? Is the scope right? Over-engineered? | 2-3 min |
| 2. Logic | Deep read | Edge cases, null handling, error paths, concurrency, off-by-one | 10-15 min |
| 3. Polish | Surface | Naming, duplication, test coverage, docs | 3-5 min |

**Pass 1 shortcut**: Read the PR description and test names first. They reveal intent faster than code.

## Comment Prefixes

| Prefix | Meaning | Author Response |
| ------ | ------- | --------------- |
| `[blocking]` | Must fix before merge | Fix it |
| `[suggestion]` | Better approach exists | Consider it, explain if declining |
| `[question]` | I don't understand | Clarify (in code, not just in reply) |
| `[nit]` | Trivial style issue | Fix if easy, skip if not |
| `[praise]` | This is well done | Appreciate it |

### Good vs Bad Comment Examples

| Bad | Why | Good |
| --- | --- | ---- |
| "This is confusing" | Vague, unhelpful | "[suggestion] This nested ternary is hard to follow. Consider extracting to a named function like `isEligibleForDiscount()`." |
| "Fix this" | No context | "[blocking] This accepts user input without sanitization. Use `escapeHtml()` before rendering." |
| "Why?" | Sounds hostile | "[question] What's the motivation for the custom sort here vs `Array.sort()`? Is there a performance concern?" |
| "LGTM" (on 500-line PR) | Rubber stamp | "Pass 1: Approach looks right. Pass 2 comments below. Pass 3: naming is clean." |

## Review Checklist

### Security
- [ ] No secrets, tokens, or API keys in code
- [ ] User input validated/sanitized before use
- [ ] Auth checks on protected endpoints
- [ ] No SQL/command injection vectors
- [ ] Sensitive data not logged

### Logic
- [ ] Edge cases handled (empty input, null, boundary values)
- [ ] Error paths return meaningful messages
- [ ] Async operations have timeout/cancellation
- [ ] State changes are atomic (no partial updates)
- [ ] All new branches have test coverage

### Quality
- [ ] Tests cover the *changed behavior*, not just the changed lines
- [ ] No debug code (console.log, TODO-hacks)
- [ ] Public API changes documented
- [ ] Backward compatibility considered

### Architecture
- [ ] Change is in the right layer (not business logic in the controller)
- [ ] New dependencies justified
- [ ] No unnecessary coupling introduced

## Anti-Patterns

| Anti-Pattern | What Happens | Instead |
| ------------ | ------------ | ------- |
| Rubber-stamp | Bugs ship | Actually read Pass 1-3 |
| Bikeshedding | Hours on naming, ignore logic bugs | Spend 80% on Pass 2 |
| Gatekeeping | Reviewees dread PRs | Teach, don't block |
| Week-long queue | PRs go stale, conflicts pile up | Review within 4 hours, merge within 24 |
| Style wars | Team friction | Automate style (ESLint, Prettier, etc.) |
| Everything-is-blocking | Author overwhelmed | Use prefix system honestly |

## Review Timing

| PR Size | Expected Review Time | If Larger |
| ------- | -------------------- | --------- |
| < 100 lines | < 30 min | — |
| 100-400 lines | 30-60 min | Ideal size |
| 400+ lines | 60+ min | Ask author to split |
| 1000+ lines | Don't | Refuse; request breakdown |

## Synapses

See [synapses.json](synapses.json) for connections.
