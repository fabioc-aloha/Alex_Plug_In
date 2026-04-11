# Alex Initialization Process

> Complete guide to how architecture initialization works

## Overview

The initialization process deploys the Alex Cognitive Architecture to a workspace, transforming it into an "heir" — a project that inherits Alex's cognitive capabilities.

## Prerequisites

- **VS Code** with Alex extension installed
- **Workspace folder** open (File → Open Folder)
- **Write permissions** to the workspace

---

## Step-by-Step Process

### Step 1: Workspace Detection

When you run the initialization operation (via `sync-architecture.cjs` or the extension):

1. The extension checks if a workspace folder is open
2. If multiple folders are open, prompts you to select one
3. If no folder is open, shows an error with instructions

**Error message if no folder:**
> "No workspace folder open. Please open a project folder first (File → Open Folder), then run this command again."

---

### Step 2: Protection Check (Kill Switch)

The extension checks if the workspace is a "protected" Master Alex installation:

1. Looks for `.github/config/MASTER-ALEX-PROTECTED.json` marker file
2. If found, blocks initialization with a warning
3. Allows override only with double confirmation (for developers)

**Why?** Master Alex is the source repository — initializing over it would corrupt the canonical architecture.

---

### Step 3: Existing Installation Check

If Alex is already installed (`.github/copilot-instructions.md` exists):

| Option                 | Action                                        |
| ---------------------- | --------------------------------------------- |
| **Upgrade Instead**    | Runs upgrade to preserve your changes         |
| **Reset Architecture** | Deletes all memory files and reinstalls fresh |
| **Cancel**             | Aborts the operation                          |

---

### Step 4: Permission Validation

Before copying files, the extension:

1. Creates a test file in `.github/`
2. Deletes the test file
3. If either fails, shows a permission error

---

### Step 5: File Deployment

The extension copies these from itself to your workspace:

| Source                    | Destination                       | Purpose                               |
| ------------------------- | --------------------------------- | ------------------------------------- |
| `copilot-instructions.md` | `.github/copilot-instructions.md` | Main brain file (core personality)    |
| `instructions/`           | `.github/instructions/`           | Procedural memory (64 files)          |
| `prompts/`                | `.github/prompts/`                | Episodic workflows (meditation, etc.) |
| `episodic/`               | `.github/episodic/`               | Session records                       |
| `config/`                 | `.github/config/`                 | Configuration + CSS styling           |
| `agents/`                 | `.github/agents/`                 | Agent definitions                     |
| `skills/`                 | `.github/skills/`                 | Domain expertise (150 skills)         |

**Note:** `markdown-light.css` is included in the `config/` folder and gets copied to `.vscode/` during the markdown styles step (Step 7).

**Total files deployed:** ~150+ markdown and JSON files

---

### Step 6: Manifest Creation

After copying, the extension creates `alex-manifest.json`:

```json
{
  "version": "4.2.12",
  "installedAt": "2026-02-06T12:00:00Z",
  "files": {
    ".github/copilot-instructions.md": {
      "type": "system",
      "originalChecksum": "abc123..."
    }
    // ... all deployed files with checksums
  }
}
```

**Purpose:** Enables the Upgrade command to detect which files you've modified vs. which are still system defaults.

---

### Step 7: Markdown Styles

The extension:

1. Reads `markdown-light.css` from `.github/config/` (deployed in Step 5)
2. Copies it to `.vscode/markdown-light.css`
3. Sets `markdown.styles` in workspace settings

**Result:** Markdown preview shows GitHub-style formatting with Mermaid diagram support.

---

### Step 8: AI-Memory Setup

Alex uses **AI-Memory** for cross-workspace knowledge:

| Tier               | Location                               | Purpose                                   |
| ------------------ | -------------------------------------- | ----------------------------------------- |
| **Cloud-synced**   | `AI-Memory/` (OneDrive/iCloud/Dropbox) | Auto-detected, syncs across machines      |
| **Local fallback** | `~/.alex/AI-Memory/`                   | Created when no cloud storage is detected |

#### Detection Logic

The extension scans for AI-Memory in common cloud storage locations:
- OneDrive (personal and commercial folders)
- iCloud Drive
- Dropbox
- Falls back to `~/.alex/AI-Memory/` if no cloud storage is found

#### AI-Memory Structure:
```
AI-Memory/
├── user-profile.json             # Cross-workspace user profile
├── global-knowledge.md           # Accumulated knowledge and patterns
├── profile.md                    # Identity and preferences
├── notes.md                      # Personal notes
├── learning-goals.md             # Current learning objectives
├── patterns/                     # GK-* reusable solutions
├── insights/                     # GI-* timestamped learnings
└── index.json                    # Searchable knowledge index
```

#### ⚠️ What Happens If Cloud Storage Is Unavailable?

**Nothing breaks.** The local fallback is always available:

| Feature             | Behavior                                              |
| ------------------- | ----------------------------------------------------- |
| `/knowledge` search | Uses local AI-Memory, returns empty if no entries yet |
| `/saveinsight`      | Auto-creates local folders + saves normally           |
| `/knowledgestatus`  | Shows "0 patterns, 0 insights"                        |
| Cross-machine sync  | Unavailable until cloud storage detected              |

---

### Step 9: Environment Setup (Optional)

The extension offers to configure recommended VS Code settings:

| Setting                     | Value                | Purpose           |
| --------------------------- | -------------------- | ----------------- |
| `chat.agent.enabled`        | `true`               | Enable agent mode |
| `chat.agentSkillsLocations` | `[".github/skills"]` | Auto-load skills  |
| `chat.useAgentsMdFile`      | `true`               | Use AGENTS.md     |

User can accept all, choose specific settings, or skip.

---

### Step 10: Success Dialog

Shows completion message with options:

| Button              | Action                                |
| ------------------- | ------------------------------------- |
| **Getting Started** | Opens webview with usage instructions |
| **Open Chat**       | Opens Copilot Chat                    |

---

## Result: Workspace Structure

After initialization, your workspace has:

```
your-project/
├── .github/
│   ├── copilot-instructions.md     # Main brain file
│   ├── instructions/               # Procedural memory
│   │   ├── alex-core.instructions.md
│   │   ├── bootstrap-learning.instructions.md
│   │   └── ... (64 files)
│   ├── prompts/                    # Episodic workflows
│   │   ├── unified-meditation-protocols.prompt.md
│   │   └── ... (45 files)
│   ├── episodic/                   # Session records
│   ├── config/
│   │   ├── alex-manifest.json      # Installation manifest
│   │   └── markdown-light.css      # Source CSS for preview
│   ├── agents/                     # Agent definitions
│   └── skills/                     # Domain expertise (150 skills)
├── .vscode/
│   └── markdown-light.css          # Copied from config/ for VS Code
└── (your project files)
```

**User's AI-Memory** (cloud-synced or local fallback):
```
AI-Memory/                          # OneDrive/iCloud/Dropbox or ~/.alex/AI-Memory/
├── user-profile.json               # Cross-workspace profile
├── global-knowledge.md             # Accumulated knowledge
├── patterns/                       # GK-* files
└── insights/                       # GI-* files
```

---

## Cross-Workspace Knowledge Sharing

AI-Memory is stored in a cloud-synced folder, so knowledge automatically travels across machines and workspaces:

| Storage Provider | Auto-Detected | Cross-Machine Sync |
| ---------------- | ------------- | ------------------ |
| **OneDrive**     | Yes           | Automatic          |
| **iCloud Drive** | Yes           | Automatic          |
| **Dropbox**      | Yes           | Automatic          |
| **Local only**   | Fallback      | Manual backup only |

**No setup required** — Alex detects your cloud storage automatically during initialization.

---

## Related Commands

| Operation                  | Purpose                                 |
| -------------------------- | --------------------------------------- |
| Upgrade Architecture       | Update to new version, preserve changes |
| Reset Architecture         | Delete all memory, fresh install        |
| Dream (Neural Maintenance) | Health check and synapse validation     |

---

## Troubleshooting

### "No workspace folder open"
- Open a folder first: File → Open Folder

### "Cannot write to workspace"
- Check folder permissions
- Ensure no files are locked by other programs

### "Extension installation appears corrupted"
- Reinstall the Alex extension from VS Code Marketplace

### Global Knowledge not detected
- Ensure AI-Memory folder exists in a supported cloud storage location
- Check that the folder contains `global-knowledge.md` or `patterns/` + `insights/`
- Falls back to `~/.alex/AI-Memory/` if no cloud storage is detected

---

## Technical Details

### Checksums
Files are tracked with MD5 checksums for upgrade diffing.

### File Types in Manifest
| Type           | Meaning                             |
| -------------- | ----------------------------------- |
| `system`       | Core Alex file, safe to auto-update |
| `hybrid`       | System file with user modifications |
| `user-created` | User's own file, never touched      |

### Kill Switch Protection
Protected workspaces have `MASTER-ALEX-PROTECTED.json` containing:
```json
{
  "isProtected": true,
  "reason": "Master Alex development workspace",
  "createdAt": "2026-01-29T00:00:00Z"
}
```

---

*Part of the Alex Cognitive Architecture Documentation*
