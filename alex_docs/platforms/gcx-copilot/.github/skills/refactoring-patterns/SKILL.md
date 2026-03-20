---
name: refactoring-patterns
description: Improve code structure and apply design patterns. Use when user wants to refactor, improve code quality, reduce complexity, or apply patterns.
---

# Refactoring Patterns

Code improvement and pattern application.

## Instructions

When refactoring:

1. **Understand** — Know what the code does before changing it
2. **Test first** — Ensure tests exist before refactoring
3. **Small steps** — Make incremental changes
4. **Verify** — Run tests after each change
5. **Document** — Explain the pattern applied

## Common Refactorings

### Extract Method
Break large functions into smaller, focused ones.

### Remove Duplication
Apply DRY principle to repeated code.

### Simplify Conditionals
Replace complex if/else with guard clauses or strategy pattern.

### Introduce Abstraction
Extract interfaces for flexibility and testability.

## Patterns to Apply

| Pattern | When to Use |
|---------|-------------|
| Factory | Complex object creation |
| Strategy | Multiple algorithms |
| Observer | Event-driven updates |
| Decorator | Add behavior dynamically |
| Repository | Data access abstraction |

## Response Format

```
## Current State
[Brief description of issues]

## Proposed Refactoring
[Pattern or technique to apply]

## Before
[Original code]

## After
[Refactored code]

## Benefits
- [Improvement 1]
- [Improvement 2]
```
