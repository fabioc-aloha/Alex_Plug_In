---
description: Generate unit tests for selected code
---

# Generate Tests

Generate comprehensive tests for:

${{input}}

## Requirements

1. Use the project's testing framework
2. Follow Arrange-Act-Assert pattern
3. Include:
   - Happy path tests
   - Edge cases
   - Error conditions
4. Use descriptive test names
5. Mock external dependencies

## Output Format

```typescript
describe('[Component]', () => {
  describe('[method]', () => {
    it('should [behavior] when [condition]', () => {
      // Arrange
      
      // Act
      
      // Assert
    });
  });
});
```
