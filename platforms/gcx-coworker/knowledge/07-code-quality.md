# Code Quality

## What matters most in code review

1. **Correctness**: Does it do what it's supposed to?
2. **Security**: Can it be exploited?
3. **Maintainability**: Will the next person understand this?
4. **Performance**: Will it scale?
5. **Style**: Is it consistent? (ideally enforced by linters, not humans)

## How to conduct effective code reviews

### 3-Pass Review

| Pass | Focus | What You're Looking For | Time |
| ---- | ----- | ----------------------- | ---- |
| 1. Orientation | Big picture | Does the approach make sense? Is the scope right? Over-engineered? | 2-3 min |
| 2. Logic | Deep read | Edge cases, null handling, error paths, concurrency, off-by-one | 10-15 min |
| 3. Polish | Surface | Naming, duplication, test coverage, docs | 3-5 min |

**Pass 1 shortcut**: Read the PR description and test names first. They reveal intent faster than code.

### Comment Prefixes

| Prefix | Meaning | Author Response |
| ------ | ------- | --------------- |
| `[blocking]` | Must fix before merge | Fix it |
| `[suggestion]` | Better approach exists | Consider it, explain if declining |
| `[question]` | I don't understand | Clarify (in code, not just in reply) |
| `[nit]` | Trivial style issue | Fix if easy, skip if not |
| `[praise]` | This is well done | Appreciate it |

### Good vs Bad Comment Examples

| Bad | Why | Good |
| --- | --- | ---- |
| "This is confusing" | Vague, unhelpful | "[suggestion] This nested ternary is hard to follow. Consider extracting to a named function like `isEligibleForDiscount()`." |
| "Fix this" | No context | "[blocking] This accepts user input without sanitization. Use `escapeHtml()` before rendering." |
| "Why?" | Sounds hostile | "[question] What's the motivation for the custom sort here vs `Array.sort()`? Is there a performance concern?" |
| "LGTM" (on 500-line PR) | Rubber stamp | "Pass 1: Approach looks right. Pass 2 comments below. Pass 3: naming is clean." |

### Review Checklist: Security

- [ ] No secrets, tokens, or API keys in code
- [ ] User input validated/sanitized before use
- [ ] Auth checks on protected endpoints
- [ ] No SQL/command injection vectors
- [ ] Sensitive data not logged

### Review Checklist: Logic

- [ ] Edge cases handled (empty input, null, boundary values)
- [ ] Error paths return meaningful messages
- [ ] Async operations have timeout/cancellation
- [ ] State changes are atomic (no partial updates)
- [ ] All new branches have test coverage

### Review Checklist: Quality

- [ ] Tests cover the *changed behavior*, not just the changed lines
- [ ] No debug code (console.log, TODO-hacks)
- [ ] Public API changes documented
- [ ] Backward compatibility considered

### Review Checklist: Architecture

- [ ] Change is in the right layer (not business logic in the controller)
- [ ] New dependencies justified
- [ ] No unnecessary coupling introduced

### Anti-Patterns

| Anti-Pattern | What Happens | Instead |
| ------------ | ------------ | ------- |
| Rubber-stamp | Bugs ship | Actually read Pass 1-3 |
| Bikeshedding | Hours on naming, ignore logic bugs | Spend 80% on Pass 2 |
| Gatekeeping | Reviewees dread PRs | Teach, don't block |
| Week-long queue | PRs go stale, conflicts pile up | Review within 4 hours, merge within 24 |
| Style wars | Team friction | Automate style (ESLint, Prettier, etc.) |
| Everything-is-blocking | Author overwhelmed | Use prefix system honestly |

### PR size guidelines

| PR Size | Expected Review Time | If Larger |
| ------- | -------------------- | --------- |
| < 100 lines | < 30 min | Perfect size |
| 100-400 lines | 30-60 min | Ideal size |
| 400+ lines | 60+ min | Ask author to split |
| 1000+ lines | Don't | Refuse; request breakdown |

## Code review for CX professionals

### How non-developers can add value

| Review Area | What CX Can Check | Questions to Ask |
| ----------- | ----------------- | ---------------- |
| **User Experience** | Flow matches requirements | Does this handle the customer journey we designed? |
| **Error Messages** | Clear, actionable text | Would a customer understand this error? |
| **Business Logic** | Rules match policy | Is the discount calculation correct per our policy? |
| **Documentation** | API docs, user guides | Can a new team member follow these instructions? |
| **Test Cases** | Scenarios covered | Did we test the edge case where customer has expired subscription? |

### Reading PRs as a non-developer

**Focus on these sections in order**:

1. **PR Description**: What problem is being solved?
2. **Test Names**: What scenarios are covered?
3. **Changed Files**: Which parts of the system are affected?
4. **Comments**: What questions do reviewers have?

**Don't get lost in**: Syntax details, variable names, code structure (unless it affects user experience)

**Good CX Review Comments**:
- "This error message doesn't explain how to fix the problem"
- "We're missing a test for when customer has multiple subscriptions"
- "The API documentation doesn't explain the rate limits"
- "According to policy X, shouldn't this also check condition Y?"

## When to request a security review

### Decision Tree for CX Team Members

| Scenario | Security Review Required? | Why |
| -------- | ------------------------ | --- |
| New customer data field | **Yes** | PII handling, compliance |
| External API integration | **Yes** | Third-party trust, data sharing |
| New vendor/service | **Yes** | Supply chain risk |
| Customer auth flow changes | **Yes** | Identity and access critical |
| Internal dashboard/tool | **Maybe** | Depends on data sensitivity |
| Documentation updates | **No** | Unless revealing internal architecture |
| UI-only changes | **No** | Unless handling sensitive display |

### Red Flags: Always Get Security Review

- Customer SSN, payment card, health data
- Integration with new external service
- Authentication or permission changes
- File upload capabilities
- Customer data export features
- Admin-level functionality

### How to Request Security Review

**Good Request**:
> "We're adding credit card storage to the billing flow. Customer enters card details, we tokenize via Stripe, store token in our DB. PR #123 shows the implementation. Security review needed before merge."

**Provides**: Context, data flow, implementation location, clear ask

**Bad Request**:
> "Can someone look at this code?"

**Missing**: What it does, why it needs review, where to look

## Mission-Critical Review (NASA Standards)

For safety-critical projects, apply NASA/JPL Power of 10 rules during review:

### Blocking Violations (Must Fix)

| Rule | Check For | Detection |
| ---- | --------- | --------- |
| **R1** | Recursive function without `maxDepth` parameter | `grep -rn "function.*\(" | xargs grep -l "walk\|traverse\|recurse"` |
| **R2** | `while` loop without iteration counter | Manual review of all `while` statements |
| **R3** | Unbounded array growth | `push()` in loops without size checks |

### High Priority (Strong Recommendation)

| Rule | Check For | Detection |
| ---- | --------- | --------- |
| **R4** | Function > 60 lines | Line count per function |
| **R5** | Missing entry assertions | Public functions without precondition checks |
| **R8** | Nesting > 4 levels | Visual inspection of indentation |

### Medium Priority (Consider)

| Rule | Check For | Detection |
| ---- | --------- | --------- |
| **R6** | Variable declared far from use | Manual review |
| **R7** | Unchecked return values | `grep` for ignored returns |
| **R9** | Deep property access without `?.` | `obj.prop.prop.prop` chains |
| **R10** | Compiler warnings | Build output |

**Trigger**: User mentions "mission-critical", "NASA standards", "high reliability", or "safety-critical"

## Quick Security Questions Before Shipping

Before shipping, ask:
1. **What's the worst thing an attacker could do?**
2. **What data could leak if this endpoint is exposed?**
3. **Who should NOT have access to this?**
4. **What happens if input is malicious?**
5. **Are we trusting anything we shouldn't?**

### Pre-Merge Security Gate

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Output encoding for XSS
- [ ] SQL uses parameterized queries
- [ ] Auth checks on all endpoints
- [ ] Sensitive data encrypted
- [ ] Errors don't leak info
- [ ] Dependencies up to date