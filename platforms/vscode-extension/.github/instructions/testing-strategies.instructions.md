---
description: "Testing strategy selection, test coverage review, and test failure triage"
application: "During code reviews, quality audits, or when assessing testing strategies"
applyTo: "**/*.test.*,**/*.spec.*,**/test/**,**/__tests__/**"
---

# Testing Strategies — Enforcement Rules

Deep reference: `.github/skills/testing-strategies/SKILL.md`

## Test Level Decision

- **Unit** (70%): single function/class, mock all I/O — fast (<10ms each)
- **Integration** (20%): 2+ real components, real DB/file, mock external HTTP — <1s each
- **E2E** (10%): complete user journey, real stack

If ratio is inverted (many E2E, few unit) → slow CI, flaky builds, hard to debug.

## Hard Rules

- **AAA pattern**: Arrange, Act, Assert — one logical assertion group per test
- **Name as spec**: `should [verb] when [condition]`
- **Test behavior, not implementation**: assert observable output, not internal state
- **No `.only`/`.skip`** in committed code
- **Independent tests**: no shared mutable state between tests
- **Readable failures**: error messages must explain what went wrong

## What to Mock

| Mock | Don't Mock |
|------|-----------|
| Network, file system, time, RNG | Core business logic, pure functions |
| External APIs (GitHub, Graph) | The module under test itself |

## VS Code Extension Testing

- **Integration tests**: `@vscode/test-cli` runs inside VS Code host, needs display server
- **Unit tests** (pure logic): standard jest/vitest, no VS Code runner needed
- Test files: `src/services/x.ts` → `test/services/x.test.ts`

## Test Quality Scoring (Per-Test)

Core question: "Would this test fail if the production code had a real bug?"

Score individual tests 1-5 during review:

| Score | Meaning | Action |
|-------|---------|--------|
| 1 | Worse than nothing (false confidence) | Delete |
| 2 | Severely flawed (over-mocked, no real assertions) | Rewrite from scratch |
| 3 | Has some value but weak verification | Improve assertions |
| 4 | Solid test, catches real bugs | Acceptable |
| 5 | High value, catches subtle regressions | Exemplar |

**Rapid triage for test suites**:
1. **Red**: No assertions, trivial assertions (`assert.ok(true)`), exception swallowing, self-referential tests → Score 1-2
2. **Yellow**: Over-mocking, testing implementation details, weak verification (`toBeDefined`) → Score 2-3
3. **Green**: Tests behavior, meaningful assertions, covers edge cases → Score 4-5

Deep-analyze only Red and Yellow tests. Green tests pass triage.

## Coverage

80%+ lines for core business logic. Don't chase 100% — chase confidence that regressions get caught. Every public API: happy path + at least one edge case + error handling.

## Routing

- VS Code test boilerplate, mock patterns, runner setup → load `testing-strategies` skill
- Triage methodology, flaky test detection → load skill
