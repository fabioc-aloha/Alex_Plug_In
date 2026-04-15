---
description: "Submit feedback, bug reports, and feature requests from heir projects to Master Alex"
application: "When reporting bugs, requesting features, or providing feedback from heir projects"
applyTo: "**/*feedback*,**/*bug-report*,**/*feature-request*"
---

# Heir Feedback Protocol

## Feedback Types

| Type | Severity | File Prefix |
|------|----------|-------------|
| Bug | critical/high/medium/low | `bug-` |
| Feature | - | `feature-` |
| Enhancement | - | `enhancement-` |

## Submission Format

Create file at `AI-Memory/feedback/{date}-{type}-{slug}.md`:

```yaml
---
type: bug | feature | enhancement
severity: critical | high | medium | low
heir: project-name
date: YYYY-MM-DD
status: new
---

## Summary
One-line description

## Details
What happened / what's requested

## Steps to Reproduce (bugs)
1. ...

## Expected Behavior
What should happen
```

## Master Triage

1. Check if exists in Master
2. Fix if applicable
3. Sync fix to heirs
4. **Delete the feedback file** (resolution tracked in CHANGELOG/git)

## Anti-Patterns

- Feedback without reproduction steps
- Not checking if already fixed in Master
- Keeping feedback files after resolution (delete them)
- Tracking status in file instead of just fixing and deleting
