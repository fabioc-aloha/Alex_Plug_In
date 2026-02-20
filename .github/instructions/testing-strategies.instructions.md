# Testing Strategies Instructions

**Auto-loaded when**: Writing tests, reviewing test coverage, choosing test types, or triaging failing tests
**Domain**: Software testing, TDD, test architecture
**Synapses**: [testing-strategies/SKILL.md](../skills/testing-strategies/SKILL.md)

---

## Purpose

Apply the right test at the right level — maintaining pyramid shape (70/20/10 unit/integration/E2E), testing behavior not implementation, and writing tests that act as living specifications.

---

## When This Applies

**File Patterns**:
- `**/*.test.ts`, `**/*.spec.ts`, `**/*.test.js`, `**/*.spec.js`
- `**/test/**`, `**/tests/**`, `**/__tests__/**`
- `**/vitest.config.*`, `**/jest.config.*`

**Contextual Triggers**:
- Writing new tests for a feature
- CI fails with test failures
- Reviewing test coverage gaps
- Deciding whether a unit or integration test is appropriate
- Removing tests that are too tightly coupled to implementation

---

## Test Level Decision

**Before writing a test, classify it:**

```
Is it testing a single function/class in isolation?
  Yes → Unit test (mock all I/O, no network, no file system)

Is it testing interaction between 2+ real components?
  Yes → Integration test (real DB/file, mock external HTTP)

Is it testing a complete user journey top-to-bottom?
  Yes → E2E test (real browser/app, real stack)
```

**Target ratio: 70% unit / 20% integration / 10% E2E**

If your test suite is inverted (many E2E, few unit) → slow CI, flaky builds, hard to debug failures.

---

## Unit Test Pattern (AAA)

```typescript
test('should [expected behavior] when [condition]', () => {
    // Arrange — set up inputs and dependencies
    const input = createTestInput({ property: 'value' });
    
    // Act — invoke exactly one function
    const result = functionUnderTest(input);
    
    // Assert — verify observable output
    expect(result).toBe(expectedValue);
});
```

**Rules**:
- One `expect` per test (or one logical assertion group)
- No implementation details in assertions (`expect(mockFn).toHaveBeenCalled` is OK; checking internal state is not)
- Test name reads as a specification: `should [verb] when [condition]`

---

## What to Mock (and What Not To)

| Mock | Don't Mock |
| ---- | ---------- |
| Network calls (HTTP, WebSocket) | Core business logic |
| File system in unit tests | Simple pure functions |
| External APIs (GitHub, Graph) | The module under test itself |
| Time (`Date.now()`, `setTimeout`) | Framework utilities (React, VS Code API stubs) |
| Random number generators | Data transformation functions |

**Anti-pattern**: Mocking the thing being tested to make it pass — this tests nothing.

---

## VS Code Extension Testing

```typescript
// Integration test — requires VS Code test runner
suite('Extension Activation', () => {
    test('should register all commands on activate', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('my-ext.openPanel'));
        assert.ok(commands.includes('my-ext.refresh'));
    });
});
```

**Run**: `npm run test` (uses `@vscode/test-cli` — runs inside VS Code host)
**Unit tests** (pure logic, no VS Code API): standard jest/vitest, no VS Code runner needed.

---

## Test Coverage Guidance

**Measure coverage by behavior, not by lines:**

- Every public API should have a happy-path test + at least one edge case
- Error handling paths must be tested (not just happy path)
- Don't chase 100% line coverage — chase confidence that regressions will be caught

**Coverage thresholds (reasonable defaults)**:
- Unit: 80%+ lines for core business logic
- Integration: Key user flows covered end-to-end
- E2E: All critical paths that affect revenue/data integrity

---

## Quality Checklist

Before committing tests:
- [ ] Test name describes behavior, not implementation (`should handle empty input` not `test line 42`)
- [ ] No `test.only` or `test.skip` left in committed code
- [ ] External I/O mocked in unit tests
- [ ] Each test is independent (no shared mutable state between tests)
- [ ] Failing test produces a readable error message (not just `expected true, got false`)
- [ ] Tests run in <10ms each for unit, <1s for integration
