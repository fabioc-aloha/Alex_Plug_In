---
applyTo: "**/*test*,**/*spec*,**/*.test.*,**/*.spec.*"
---

# Testing Strategies Skill

> Systematic testing for confidence without over-testing.

## Testing Pyramid

| Level | Volume | Speed | Purpose |
| ----- | ------ | ----- | ------- |
| Unit | Many | Fast | Individual functions |
| Integration | Some | Medium | Component boundaries |
| E2E | Few | Slow | User journeys |

**Anti-pattern**: Inverted pyramid (too many E2E, few unit).

## Unit Test Pattern (AAA)

```typescript
test('should [behavior] when [condition]', () => {
    // Arrange - setup
    // Act - execute
    // Assert - verify
});
```

## What to Mock

| Mock | Don't Mock |
| ---- | ---------- |
| External services | Your own code |
| Time/randomness | Pure functions |
| Network calls | Business logic |

## Coverage Philosophy

| Range | Interpretation |
| ----- | -------------- |
| 50-70% | Reasonable |
| 70-85% | Good, diminishing returns |
| 85%+ | Often wasteful |

**Focus**: Coverage of *changed* code.

## Don't Test

- Third-party internals
- Framework behavior
- Private implementation
- Trivial getters/setters

## TDD Cycle

Red → Green → Refactor

## Synapses

See [synapses.json](synapses.json) for connections.
