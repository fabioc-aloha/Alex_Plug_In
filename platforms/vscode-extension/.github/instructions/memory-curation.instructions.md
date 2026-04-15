---
description: "Monitor, audit, and curate VS Code user memory for token efficiency and value density"
application: "When reviewing or cleaning /memories/ user memory"
applyTo: "**/*memory*,**/*curation*"
---

# Memory Curation

## Scope Rules

| Content Type | Lives In | NOT In /memories/ |
|--------------|----------|-------------------|
| User identity | AI-Memory/user-profile.json | ✗ |
| VS Code workflow tips | /memories/ | ✓ |
| Project-specific | /memories/repo/ | ✗ |
| Session scratch | /memories/session/ | ✗ |

**3-Workspace Test**: Only store in `/memories/` if useful across 3+ workspaces.

## Budget

- **200 lines** auto-loaded maximum
- **150 lines** warning threshold
- **>180 lines** requires immediate trim

## Quick Audit

```bash
memory view /memories/
# Check total lines, identify stale/duplicate content
```

See `.github/skills/memory-curation/SKILL.md` for full audit procedure.
