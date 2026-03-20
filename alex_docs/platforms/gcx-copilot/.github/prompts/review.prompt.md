---
description: Perform a code review on selected code
---

# Code Review

Review the following code for quality, security, and correctness:

${{input}}

## Review Checklist

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication/authorization

### Performance
- [ ] No unnecessary operations
- [ ] Efficient algorithms
- [ ] Proper async handling
- [ ] No memory leaks

### Maintainability
- [ ] Clear naming
- [ ] Appropriate comments
- [ ] Reasonable complexity
- [ ] DRY principle followed

### Correctness
- [ ] Logic is sound
- [ ] Edge cases handled
- [ ] Errors handled properly
- [ ] Tests adequate

## Output Format

For each finding:
- **Severity**: Critical / High / Medium / Low
- **Category**: Security / Performance / Maintainability / Correctness
- **Location**: File and line
- **Issue**: Description
- **Recommendation**: How to fix
