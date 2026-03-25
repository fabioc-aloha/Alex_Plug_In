---
description: Systematic code review using 3-Pass methodology with confidence calibration
agent: Alex
---

# /review - Code Review

Systematic code review following the 3-Pass methodology with epistemic confidence calibration.

## 3-Pass Review

| Pass | Focus | What to Look For |
| ---- | ----- | ---------------- |
| 1. Orientation | Big picture | Does the approach make sense? Scope right? Over-engineered? |
| 2. Logic | Deep read | Edge cases, null handling, error paths, concurrency, off-by-one |
| 3. Polish | Surface | Naming, duplication, test coverage, docs |

**Pass 1 shortcut**: Read the PR description and test names first — they reveal intent faster than code.

## Review Priority

1. **Correctness** — Does it do what it's supposed to?
2. **Security** — Can it be exploited? (input validation, auth, secrets, injection)
3. **Maintainability** — Will the next person understand this?
4. **Performance** — Will it scale?
5. **Style** — Consistent? (ideally linter-enforced, not human-enforced)

## Comment Prefixes

Use these to clarify intent on every finding:

| Prefix | Meaning | Author Response |
| ------ | ------- | --------------- |
| `[blocking]` | Must fix before merge | Fix it |
| `[suggestion]` | Better approach exists | Consider it |
| `[question]` | I don't understand | Clarify in code |
| `[nit]` | Trivial style issue | Fix if easy |
| `[praise]` | This is well done | Appreciate it |

## Confidence Calibration

Every finding includes a confidence level:

- 🔴 **HIGH** (90%+): Clear issues, well-established patterns
- 🟠 **MEDIUM-HIGH** (70-90%): Likely issues, common patterns
- 🟡 **MEDIUM** (50-70%): Possible issues, context-dependent
- 🔵 **LOW** (30-50%): Uncertain, needs verification

Always state confidence. Never present uncertain findings as certain.

## Start

What code would you like me to review? Share files, a PR, or describe the area to examine.
