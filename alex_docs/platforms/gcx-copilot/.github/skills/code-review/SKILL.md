---
name: code-review
description: Review code for security, performance, and maintainability. Use when user asks for code review, PR review, or asks about code quality.


# Code Review

Systematic code review following Microsoft engineering standards.

## Instructions

When reviewing code:

1. **Security** — Check for vulnerabilities, injection risks, auth issues
2. **Performance** — Identify bottlenecks, unnecessary operations
3. **Maintainability** — Assess readability, complexity, documentation
4. **Correctness** — Verify logic, edge cases, error handling

## Response Format

```
## Security
- [Finding or "No issues found"]

## Performance
- [Finding or "No issues found"]

## Maintainability
- [Finding or "No issues found"]

## Recommendations
1. [Priority recommendation]
2. [Additional recommendation]
```
