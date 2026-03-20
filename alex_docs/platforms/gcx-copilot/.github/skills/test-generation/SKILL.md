---
name: test-generation
description: Generate unit tests, integration tests, and test strategies. Use when user asks for tests, coverage, or test planning.
---

# Test Generation

Create comprehensive tests following best practices.

## Instructions

When generating tests:

1. **Identify scope** — Unit, integration, or E2E
2. **Analyze code** — Understand inputs, outputs, side effects
3. **Cover cases** — Happy path, edge cases, error conditions
4. **Name clearly** — Describe what each test validates
5. **Arrange-Act-Assert** — Follow AAA pattern

## Test Types

### Unit Tests
- Test single units in isolation
- Mock dependencies
- Fast execution

### Integration Tests
- Test component interactions
- Use real or test databases
- Verify contracts

### E2E Tests
- Test full user flows
- Run against deployed environment
- Cover critical paths

## Coverage Targets

| Type | Target Coverage |
|------|-----------------|
| Unit | 80%+ |
| Integration | Key paths |
| E2E | Critical flows |

## Response Format

```typescript
describe('[Component/Function Name]', () => {
  describe('[Method/Scenario]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```
