---
name: debugging
description: Debug code issues and identify root causes. Use when user has errors, exceptions, unexpected behavior, or needs help troubleshooting.


# Debugging

Systematic debugging and root cause analysis.

## Instructions

When debugging:

1. **Reproduce** — Understand the exact failure conditions
2. **Isolate** — Narrow down to the smallest failing unit
3. **Analyze** — Examine logs, stack traces, state
4. **Hypothesize** — Form theories based on evidence
5. **Test** — Validate hypotheses with targeted tests
6. **Fix** — Apply the minimal correct fix
7. **Verify** — Confirm the fix resolves the issue

## Common Patterns

### Error Analysis
```
@workspace Analyze this error: [paste error]
```

### State Inspection
```
@workspace What's the state of [variable] at this point?
```

### Trace Analysis
```
@workspace Walk through this stack trace
```

## Response Format

```
## Root Cause
[Concise explanation of what's wrong]

## Evidence
- [Log/trace/code that supports the diagnosis]

## Fix
[Code or configuration change]

## Prevention
[How to avoid this in the future]
```
