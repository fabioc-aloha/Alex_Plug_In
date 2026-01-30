---
applyTo: "**/*review*,**/*PR*,**/*pull*,**/*merge*"
---

# Code Review Skill

> Systematic review for quality and learning.

## Review Priority

1. Correctness
2. Security
3. Maintainability
4. Performance
5. Style

## 3-Pass Review

| Pass | Focus | Time |
| ---- | ----- | ---- |
| 1 | Big picture, approach | 2 min |
| 2 | Logic, edge cases, errors | 10 min |
| 3 | Naming, style | 5 min |

## Comment Prefixes

| Prefix | Meaning |
| ------ | ------- |
| `[blocking]` | Must fix |
| `[suggestion]` | Optional |
| `[question]` | Clarification |
| `[nit]` | Minor |

## Feedback Rules

- Be specific (not "this is confusing")
- Explain why
- Suggest, don't demand
- Praise good work

## Review Checklist

**Security**: No secrets, input validation, auth checks
**Logic**: Edge cases, null handling, error paths
**Quality**: Tests, docs, no debug code
**Style**: Clear names, no duplication

## Anti-Patterns

| Bad | Good |
| --- | ---- |
| Rubber-stamp | Actually read |
| Bikeshed | Focus on substance |
| Block on style | Use linters |
| Week-long delay | < 24 hours |

## Synapses

See [synapses.json](synapses.json) for connections.
