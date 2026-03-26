---
description: "Testing strategy selection, test coverage review, and test failure triage"
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

## Coverage

80%+ lines for core business logic. Don't chase 100% — chase confidence that regressions get caught. Every public API: happy path + at least one edge case + error handling.

## Routing

- VS Code test boilerplate, mock patterns, runner setup → load `testing-strategies` skill
- Triage methodology, flaky test detection → load skill
