# Alex Initialization Process

> Complete guide to how `Alex: Initialize Architecture` works

## Overview

The initialization process deploys the Alex Cognitive Architecture to a workspace, transforming it into an "heir" — a project that inherits Alex's cognitive capabilities.

## Prerequisites

- **VS Code** with Alex extension installed
- **Workspace folder** open (File → Open Folder)
- **Write permissions** to the workspace

---

## Step-by-Step Process

### Step 1: Workspace Detection

When you run `Alex: Initialize Architecture`:

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
| **Upgrade Instead**    | Runs `Alex: Upgrade` to preserve your changes |
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
| `skills/`                 | `.github/skills/`                 | Domain expertise (130 skills)         |

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

### Step 8: Global Knowledge Setup

Alex has a **two-tier knowledge system**:

| Tier            | Location                                        | Purpose                                         |
| --------------- | ----------------------------------------------- | ----------------------------------------------- |
| **Local**       | `~/.alex/global-knowledge/`                     | Auto-created fallback, always available         |
| **GitHub Repo** | Sibling folder (e.g., `Alex-Global-Knowledge/`) | Optional — version control + cross-machine sync |

#### Detection Logic

The extension checks for a Global Knowledge repository as a sibling folder:
- Looks for common names: `Alex-Global-Knowledge`, `My-Global-Knowledge`, etc.
- Validates structure: `index.json` + `patterns/` + `insights/`

#### If Found (sibling folder):
- Logs the discovery
- No further action needed

#### If Not Found:
Shows a prompt:
> "📚 Global Knowledge Repository — Alex can store cross-project learnings in a GitHub repository. Would you like to create one?"

| Option                | Action                                               |
| --------------------- | ---------------------------------------------------- |
| **Create Repository** | Scaffolds `Alex-Global-Knowledge/` as sibling folder |
| **Skip for Now**      | Continues without GK repo setup                      |

#### ⚠️ What Happens If User Skips?

**Nothing breaks.** All knowledge features use graceful fallback:

| Feature             | Behavior When Skipped                                  |
| ------------------- | ------------------------------------------------------ |
| `/knowledge` search | Creates `~/.alex/` on first use, returns empty results |
| `/saveinsight`      | Auto-creates local folders + saves normally            |
| `/knowledgestatus`  | Shows "0 patterns, 0 insights"                         |
| Cloud sync          | Shows "Not configured"                                 |

The local `~/.alex/global-knowledge/` system is always available — it's just not synced to GitHub.

#### Repository Structure Created:

```
Alex-Global-Knowledge/
├── index.json                    # Master search index
├── README.md                     # Repository documentation
├── .gitignore                    # Excludes sync-metadata.json
├── .github/
│   └── copilot-instructions.md   # GK-specific instructions
├── patterns/                     # GK-* reusable solutions
└── insights/                     # GI-* timestamped learnings
```

#### Follow-up Steps (shown to user):
```powershell
cd "C:\Development\Alex-Global-Knowledge"
git init && git add -A && git commit -m "feat: initialize global knowledge"
gh repo create Alex-Global-Knowledge --private --source=. --push
```

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

| Button              | Action                                  |
| ------------------- | --------------------------------------- |
| **Getting Started** | Opens webview with usage instructions   |
| **Open Chat**       | Opens Copilot Chat with `@alex /status` |

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
│   │   ├── markdown-light.css      # Source CSS for preview
│   │   └── user-profile.json       # Your preferences
│   ├── agents/                     # Agent definitions
│   └── skills/                     # Domain expertise (130 skills)
├── .vscode/
│   └── markdown-light.css          # Copied from config/ for VS Code
└── (your project files)
```

**User's home directory** (auto-created on first knowledge operation):
```
~/.alex/
└── global-knowledge/
    ├── index.json                  # Knowledge index
    ├── patterns/                   # GK-* files
    └── insights/                   # GI-* files
```

---

## Sharing Global Knowledge

Since the GitHub-based GK repo is a standard Git repository, sharing is handled entirely through GitHub's permission system:

| Access Level     | GitHub Setting               | Use Case                      |
| ---------------- | ---------------------------- | ----------------------------- |
| **Private**      | Private repo, you only       | Personal knowledge vault      |
| **Team**         | Private repo + collaborators | Shared team learnings         |
| **Organization** | Org-owned repo               | Enterprise knowledge base     |
| **Public**       | Public repo                  | Open-source knowledge sharing |

**To share your knowledge:**
1. Push your `Alex-Global-Knowledge` repo to GitHub
2. Adjust repository visibility (Settings → General → Danger Zone)
3. Add collaborators (Settings → Collaborators) or transfer to an organization

**Benefits of GitHub-based sharing:**
- No custom authentication code
- No token management
- No sync servers to maintain
- Standard fork/PR workflow for knowledge contributions
- Full Git history of knowledge evolution

**Team workflow example:**
```
Organization/Alex-Global-Knowledge  (shared)
├── patterns/GK-team-conventions.md
├── patterns/GK-api-standards.md
└── insights/GI-postmortem-*.md
```

Each team member clones the shared repo as a sibling to their projects, and Alex automatically detects and uses it.

---

## Related Commands

| Command                            | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `Alex: Upgrade Architecture`       | Update to new version, preserve changes |
| `Alex: Reset Architecture`         | Delete all memory, fresh install        |
| `Alex: Dream (Neural Maintenance)` | Health check and synapse validation     |

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
- Ensure the GK repo is a sibling folder (same parent directory)
- Check that `index.json`, `patterns/`, and `insights/` exist

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
