---
name: "global-knowledge-sync"
description: "Synchronize insights across AI surfaces via the shared OneDrive AI-Memory folder"
tier: standard
applyTo: '**/*sync*,**/*ai-memory*,**/*onedrive*'
---

# Global Knowledge Sync Skill

Manages cross-platform knowledge synchronization via the shared OneDrive/AI-Memory/ folder. All AI surfaces (VS Code, M365 Copilot, Agent Builder agents) read from and write to the same memory files.

## Architecture

```
OneDrive/AI-Memory/
  profile.md            User identity and preferences
  notes.md              Session notes and reminders
  learning-goals.md     Goals with progress tracking
  global-knowledge.md   Cross-project insights and patterns
```

This replaces the legacy GitHub-based system (~/.alex/global-knowledge/, GK-_/GI-_ files, Alex-Global-Knowledge repo).

## Access Methods

| Surface           | Read                             | Write                                      |
| ----------------- | -------------------------------- | ------------------------------------------ |
| **VS Code**       | Local OneDrive sync path (auto)  | Direct file edit                           |
| **M365 Copilot**  | OneDriveAndSharePoint capability | Save-back pattern (code block, user saves) |
| **Agent Builder** | OneDriveAndSharePoint capability | Save-back pattern (code block, user saves) |

### VS Code Path Detection

The extension resolves the AI-Memory folder at activation with OneDrive priority and local fallback:

1. **Windows OneDrive**: `%OneDrive%/AI-Memory/`, `%OneDriveConsumer%/AI-Memory/`, `%OneDriveCommercial%/AI-Memory/`, or `%UserProfile%/OneDrive/AI-Memory/`
2. **macOS OneDrive**: `~/Library/CloudStorage/OneDrive-*/AI-Memory/` or `~/OneDrive/AI-Memory/`
3. **Local fallback**: `~/.alex/AI-Memory/` — used when OneDrive is not installed or disabled

When OneDrive is unavailable the folder is created locally. Files work identically but do not sync across devices or to M365 agents. Installing OneDrive later and moving the folder enables cross-platform sync.

## Capabilities

### 1. Save Insight

Save a learning from the current session to global knowledge.

**Trigger**: "save this insight", "promote to global", "consolidate"

**Process**:

1. Identify the cross-project insight
2. Determine the category (or create new one)
3. Format as standard entry (Topic, Source, Insight, Date)
4. **VS Code**: Append directly to `AI-Memory/global-knowledge.md`
5. **M365**: Generate update in code block, ask user to save to OneDrive

### 2. Search Global Knowledge

Find relevant knowledge from past projects.

**Trigger**: "have I solved this before?", "search knowledge", "check global"

**Process**:

1. Read `AI-Memory/global-knowledge.md`
2. Search for matching topics, keywords, patterns
3. Return relevant entries with context

### 3. Sync During Consolidation

Automated sync during meditation/consolidation sessions.

**Trigger**: "consolidate", "meditate", cognitive protocols

**Process**:

1. Review session for cross-project insights
2. Check global-knowledge.md for duplicates
3. Add new entries under appropriate categories
4. Update notes.md with session summary
5. Check learning-goals.md for progress updates

### 4. Profile Sync

Keep user preferences current across surfaces.

**Trigger**: Implicit (read on session start), "update my profile"

**Process**:

1. Read AI-Memory/profile.md for user context
2. Apply preferences to current session
3. If preferences discovered during session, suggest profile update

## Integration Points

### Cognitive Protocols

The consolidation protocol (cognitive-protocols.txt) includes:

- Save session insights to global-knowledge.md
- Update notes.md with session summary
- Check and update learning-goals.md progress
- All with explicit save-back prompts for M365

### Dream/Meditation

During consolidation, prompt:

- "Any insights worth saving globally?"
- Auto-detect cross-project patterns from session

## Entry Format

```markdown
### [Topic Title]

- **Source**: [Project or context]
- **Insight**: [The key learning]
- **Date**: [When captured]
```

Entries are grouped by category. Categories are created organically as knowledge grows.

## Triggers

- "save insight", "promote to global", "consolidate"
- "sync knowledge", "global knowledge sync"
- "search knowledge", "have I solved this before?"
- "update profile", "check goals"
