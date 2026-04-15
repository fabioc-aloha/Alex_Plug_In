---
sem: 1
description: Systematic code review with comprehensive checklist and severity classification
application: "When requesting code reviews, PR feedback, or quality assessment"
agent: Alex
---

# /code-review-checklist - Comprehensive Code Review

Structured review using a comprehensive checklist with severity-classified findings.

## Review Dimensions

### 1. Correctness

- [ ] Logic matches requirements/ticket description
- [ ] Edge cases handled (null, empty, boundary values)
- [ ] Error handling is appropriate (not swallowed, proper types)
- [ ] Concurrent access is safe (if applicable)
- [ ] State mutations are intentional and tracked

### 2. Security

- [ ] Input validation present at boundaries
- [ ] No secrets/credentials in code
- [ ] Auth/authz checks in place
- [ ] SQL/command injection prevented
- [ ] Sensitive data not logged

### 3. Performance

- [ ] No N+1 queries
- [ ] Expensive operations are cached/memoized
- [ ] Large collections paginated
- [ ] Async operations where beneficial
- [ ] No blocking calls in hot paths

### 4. Maintainability

- [ ] Names express intent
- [ ] Functions have single responsibility
- [ ] Dependencies are explicit (DI, imports)
- [ ] Magic numbers/strings extracted as constants
- [ ] Comments explain "why", not "what"

### 5. Testing

- [ ] Happy path covered
- [ ] Error paths covered
- [ ] Edge cases have tests
- [ ] Mocks are appropriate (not over-mocking)
- [ ] Tests are deterministic

## Severity Classification

| Severity | Criteria | Action |
| -------- | -------- | ------ |
| 🔴 **Critical** | Security vulnerability, data loss risk, crash | Block merge |
| 🟠 **Major** | Bug in main path, missing validation | Block merge |
| 🟡 **Minor** | Edge case bug, minor UX issue | Fix before or after |
| 🔵 **Suggestion** | Improvement opportunity | Consider |
| ⚪ **Nit** | Style, formatting | Optional |

## Output Format

```markdown
## Review Summary

**Files Reviewed**: [count]
**Findings**: 🔴 [n] | 🟠 [n] | 🟡 [n] | 🔵 [n] | ⚪ [n]
**Recommendation**: [Approve / Request Changes / Discuss]

## Findings

### 🔴 [Title] — [file:line]

**Issue**: [description]
**Impact**: [what could go wrong]
**Fix**: [suggested resolution]
```

## Start

Share the code, PR, or files to review. I'll apply the checklist and return classified findings.
