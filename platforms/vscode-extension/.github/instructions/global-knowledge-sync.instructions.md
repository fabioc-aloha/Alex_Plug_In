---
description: "Synchronize insights across AI surfaces via the shared OneDrive AI-Memory folder"
application: "When syncing knowledge between VS Code, Copilot Chat, and other AI surfaces"
applyTo: "**/*global-knowledge-sync*,**/*ai-memory-sync*"
---

# Global Knowledge Sync

## AI-Memory Location

- Path: `~/OneDrive - Correa Family/AI-Memory/`
- Cloud-synced via OneDrive
- Accessible from all workspaces

## Directory Structure

| Folder | Content |
|--------|---------|
| `insights/` | Cross-project patterns |
| `feedback/` | Heir bug reports |
| `user-profile.json` | User preferences |

## Sync Protocol

1. **Write locally**: Create/update in AI-Memory
2. **OneDrive syncs**: Automatic cloud sync
3. **Read globally**: Available from any workspace

## What to Sync

- Validated patterns (not hunches)
- User preferences
- Cross-project learnings

## Anti-Patterns

- Project-specific content in global
- Large files (slows sync)
- Sensitive data (cloud storage)
- Conflicting writes from multiple surfaces
