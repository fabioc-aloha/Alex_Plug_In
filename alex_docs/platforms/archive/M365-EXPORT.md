# M365 Copilot Export Feature

> **Bridge your VS Code Alex knowledge to Microsoft 365 Copilot**

## Overview

The **Export for M365 Copilot** feature packages your global knowledge, profile, and learning context into a format that the M365 Copilot declarative agent can read from OneDrive.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Alex Family Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VS Code Alex                    M365 Alex                           │
│  ┌──────────────┐               ┌──────────────┐                    │
│  │  Extension   │───export───►  │  Declarative │                    │
│  │  + Tools     │               │    Agent     │                    │
│  └──────┬───────┘               └──────┬───────┘                    │
│         │                              │                             │
│         ▼                              ▼                             │
│  ~/.alex/global-knowledge/       OneDrive/Alex-Memory/              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## How to Access

### Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Alex: Export for M365 Copilot"
3. Press Enter

### Status Bar Menu
1. Click the Alex status bar item (bottom of VS Code)
2. Select "Export for M365"

### Welcome View
1. Open the Alex Welcome view in the sidebar
2. Click "Export for M365" button

### Chat Command
```
@alex /exportm365
```

## What Gets Exported

| File | Source | Description |
|------|--------|-------------|
| `profile.md` | `~/.alex/global-knowledge/profile.json` | Your identity, preferences, expertise, and learning goals |
| `notes.md` | Generated template | Quick notes, reminders, observations for M365 sessions |
| `learning-goals.md` | Generated template | Track active, paused, and achieved learning objectives |
| `knowledge/*.md` | `~/.alex/global-knowledge/patterns/GK-*.md` | Domain knowledge patterns (renamed to DK-* for M365) |
| `insights/*.md` | `~/.alex/global-knowledge/insights/GI-*.md` | Timestamped learnings and discoveries |
| `README.md` | Generated | Setup instructions for M365 |

### Export Location

All files are exported to:
```
~/Alex-Memory-Export/
├── profile.md
├── notes.md
├── learning-goals.md
├── README.md
├── knowledge/
│   ├── DK-typescript-patterns.md
│   └── DK-react-hooks.md
└── insights/
    ├── GI-2026-01-15-debugging-trick.md
    └── GI-2026-01-20-api-design.md
```

## Setup Workflow

### Step 1: Build Knowledge in VS Code

Before exporting, build your global knowledge using VS Code Alex:

```
# Save insights as you learn
@alex /saveinsight

# Promote project knowledge to global
@alex /promote

# Check what's available
@alex /knowledgestatus
```

### Step 2: Export

Run the export command. You'll see a progress notification:

1. "Checking global knowledge..."
2. "Exporting profile..."
3. "Exporting patterns..."
4. "Exporting insights..."
5. "Creating notes template..."
6. "Complete!"

### Step 3: Upload to OneDrive

1. Open [OneDrive](https://onedrive.live.com) in your browser
2. Create a folder called `Alex-Memory` in the root
3. Upload all contents from `~/Alex-Memory-Export/`

### Step 4: Use with M365 Copilot

Once files are in OneDrive, access via the M365 Alex declarative agent:

```
@Alex what do you know about me?
@Alex search my knowledge for TypeScript
@Alex what are my learning goals?
@Alex help me with React hooks
```

## File Format Details

### profile.md

The profile is converted from JSON to Markdown for M365 readability:

```markdown
# My Profile

## About Me
- Name: Fabio
- Role: Developer
- Organization: Aloha

## Preferences
- Communication style: casual
- Detail level: detailed
- Explanation style: examples-first
- Use humor: true
- Encouragement: true

## Expertise Areas
- TypeScript
- VS Code Extensions
- AI/ML

## Learning Goals
- Master VS Code API
- Build cognitive architectures

## Primary Technologies
- TypeScript
- React
- Node.js
```

### knowledge/*.md (Domain Knowledge)

Global knowledge patterns are exported with their full content. The `GK-` prefix is changed to `DK-` for M365 agent compatibility:

- `GK-typescript-generics.md` → `DK-typescript-generics.md`

### insights/*.md

Insights retain their timestamped format:

```markdown
# GI-2026-01-15-async-debugging

## Problem
Debugging async/await in VS Code was frustrating...

## Solution
Use the async call stack feature...

## Tags
debugging, async, vscode
```

## Sync Considerations

### Current Limitations

The export is **one-way** (VS Code → M365):

```
VS Code ──────► OneDrive ──────► M365 Copilot
   │                                  │
   │         (no return path)         │
   └──────────────────────────────────┘
```

### Keeping in Sync

**Manual sync workflow:**
1. Build knowledge in VS Code daily
2. Export weekly (or before important M365 sessions)
3. Upload updated files to OneDrive

**Future: Azure Functions API**
Bi-directional sync via Azure Functions is planned but not yet deployed. This would enable:
- Real-time sync between platforms
- M365 insights flowing back to VS Code
- Automatic conflict resolution

## Troubleshooting

### "No global knowledge found"

Run `Alex: Initialize` first, then build some knowledge:
```
@alex /saveinsight "My first insight"
```

### "M365 integration is disabled"

Enable in settings:
```json
{
  "alex.m365.enabled": true
}
```

Or click "Enable & Export" when prompted.

### Files not appearing in M365 Copilot

1. Verify files are in `OneDrive/Alex-Memory/` (not a subfolder)
2. Wait for OneDrive sync to complete
3. Refresh M365 Copilot
4. Ensure the Alex declarative agent is installed

### Profile shows template values

Edit `profile.md` in the export folder before uploading, or:
1. Create your profile in VS Code: `@alex /profile`
2. Re-export

## Related Documentation

- [GLOBAL-KNOWLEDGE.md](GLOBAL-KNOWLEDGE.md) - How global knowledge works
- [CLOUD-SYNC.md](CLOUD-SYNC.md) - GitHub Gist sync for VS Code
- [MASTER-HEIR-ARCHITECTURE.md](MASTER-HEIR-ARCHITECTURE.md) - Alex family model
- [USER-MANUAL.md](USER-MANUAL.md) - Complete user guide

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `alex.m365.enabled` | `true` | Enable M365 Copilot integration |

---

*Part of the Alex Cognitive Architecture - bringing your knowledge across platforms* 🧠
