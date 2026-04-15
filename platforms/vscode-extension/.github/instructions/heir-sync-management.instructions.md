---
description: "Synchronize cognitive architecture changes between Master Alex and heir projects"
application: "When syncing skills, instructions, or config between Master and heirs"
applyTo: "**/*heir-sync*,**/*sync-heir*,**/*architecture-sync*"
---

# Heir Sync Management

## Sync Direction

| Direction | Use Case |
|-----------|----------|
| **Master → Heir** | Push improvements to heirs |
| **Heir → Master** | Promote validated patterns |

## What to Sync

- Skills (`.github/skills/`)
- Instructions (`.github/instructions/`)
- Config (`.github/config/`)
- Agents (`.github/agents/`)

## Sync Protocol

1. **Diff**: Compare Master vs Heir
2. **Review**: Identify conflicts
3. **Resolve**: Keep better version
4. **Copy**: Use Copy-Item for files
5. **Validate**: Run brain-qa in heir

## Conflict Resolution

| Conflict Type | Resolution |
|---------------|------------|
| Master newer | Push to heir |
| Heir has customization | Keep heir version |
| Both changed | Merge manually |

## Anti-Patterns

- Blind copy without diff
- Breaking heir customizations
- Not validating after sync
- Syncing project-specific content
