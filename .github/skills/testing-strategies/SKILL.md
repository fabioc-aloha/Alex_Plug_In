---
applyTo: "**/*test*,**/*spec*,**/*.test.*,**/*.spec.*"
---

# Testing Strategies Skill

> Systematic testing patterns for confidence without over-testing.

## The Testing Pyramid

```text
        /\
       /  \     E2E (few)
      /----\
     /      \   Integration (some)
    /--------\
   /          \ Unit (many)
  --------------
```

**Anti-pattern**: Inverted pyramid (too many E2E, few unit tests).

## Unit Testing Patterns

### Arrange-Act-Assert (AAA)

```typescript
test('should calculate total with discount', () => {
    // Arrange
    const cart = new Cart();
    cart.addItem({ price: 100, quantity: 2 });

    // Act
    const total = cart.calculateTotal(0.1); // 10% discount

    // Assert
    expect(total).toBe(180);
});
```

### Test Naming Convention

```text
should [expected behavior] when [condition]
```

Examples:

- `should throw error when input is null`
- `should return empty array when no matches found`
- `should retry three times when network fails`

## Integration Testing Patterns

### Test Real Boundaries

```typescript
// Good: Tests actual file system behavior
test('should persist data to disk', async () => {
    const tempDir = await fs.mkdtemp('test-');
    const store = new FileStore(tempDir);

    await store.save('key', { value: 42 });
    const loaded = await store.load('key');

    expect(loaded.value).toBe(42);
    await fs.rm(tempDir, { recursive: true });
});
```

### Fixture Patterns

```typescript
// Setup once, use in multiple tests
let testContext: TestContext;

beforeAll(async () => {
    testContext = await setupTestDatabase();
});

afterAll(async () => {
    await testContext.cleanup();
});
```

## E2E Testing Patterns

### Happy Path First

Test the main user journey before edge cases.

### Stable Selectors

```typescript
// Bad: Brittle
await page.click('.btn-primary');

// Good: Semantic
await page.click('[data-testid="submit-button"]');
```

## What NOT to Test

- Third-party library internals
- Framework behavior
- Private implementation details
- Trivial getters/setters

## Test Coverage Philosophy

| Coverage | Meaning |
| -------- | ------- |
| 0-50% | Major risk, untested paths |
| 50-70% | Reasonable for most projects |
| 70-85% | Good coverage, diminishing returns |
| 85-100% | Often wasteful unless safety-critical |

**Metric to watch**: Coverage of *changed* code, not total coverage.

## Mocking Guidelines

| Mock | Don't Mock |
| ---- | ---------- |
| External services | Your own code |
| Time/randomness | Pure functions |
| File system (sometimes) | Data structures |
| Network calls | Business logic |

```typescript
// Mock external, test internal
jest.mock('./api-client');
// But test the logic that uses the API client
```

## Test Organization

```text
src/
  feature/
    feature.ts
    feature.test.ts      # Unit tests
tests/
  integration/
    feature.integration.test.ts
  e2e/
    user-journey.e2e.test.ts
```

## Red-Green-Refactor

1. **Red**: Write failing test first
2. **Green**: Minimum code to pass
3. **Refactor**: Clean up with confidence

## Synapses

See [synapses.json](synapses.json) for connections.
