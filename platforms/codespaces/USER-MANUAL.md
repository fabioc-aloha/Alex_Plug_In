# Alex in GitHub Codespaces — User Manual

> Your complete guide to using Alex Cognitive Architecture in the cloud

---

## What Is This?

GitHub Codespaces gives you a full VS Code editor in your browser. When a repository includes an Alex `devcontainer.json`, you get the **complete Alex experience** — all 100+ skills, chat participant, dream/meditate commands, Global Knowledge — without installing anything locally.

**Who is this for?**
- Developers who want Alex on any machine with a browser
- Teams sharing a pre-configured development environment
- Workshop/education participants getting started quickly
- Anyone who wants an ephemeral, disposable Alex environment

---

## Getting Started

### Prerequisites

| Requirement            | Why                             | Free Tier?  |
| ---------------------- | ------------------------------- | ----------- |
| GitHub account         | Codespaces runs on GitHub       | ✅           |
| Codespaces access      | Compute for the cloud container | ✅ 60h/mo    |
| GitHub Copilot license | Powers `@alex` chat participant | ✅ Free tier |

> **Note**: You do NOT need a local VS Code installation. Everything runs in the browser.

### Step 1: Open a Codespace

1. Go to a GitHub repository that has Alex configured (look for a `.devcontainer/` folder)
2. Click the green **Code** button → **Codespaces** tab
3. Click **Create codespace on main** (or your preferred branch)

![GitHub UI: Code > Codespaces > Create](https://docs.github.com/assets/cb-49943/images/help/codespaces/new-codespace-button.png)

4. Wait 1–2 minutes for the container to build
5. VS Code opens in your browser with Alex pre-installed

### Step 2: Verify Alex Is Running

Once the Codespace opens:

1. **Activity Bar** — Look for the Alex icon (🧠) in the left sidebar
2. **Command Palette** — Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type "Alex:" → you should see commands like `Alex: Dream`, `Alex: Status`
3. **Chat** — Open Copilot Chat (`Ctrl+Alt+I`) and type `@alex /status` to verify the architecture is loaded

If you see Alex commands and the sidebar icon, you're ready!

---

## Using Alex in Codespaces

### Talking to Alex

Open the Copilot Chat panel and address Alex:

| What to Type                           | What Happens                                |
| -------------------------------------- | ------------------------------------------- |
| `@alex How does this codebase work?`   | Alex analyzes your project structure        |
| `@alex /status`                        | Shows architecture health and loaded skills |
| `@alex Help me refactor this function` | Code assistance with Alex's full skill set  |
| `@alex /knowledge error handling`      | Searches Global Knowledge across projects   |

### Key Commands (Command Palette)

Press `Ctrl+Shift+P` and type any of these:

| Command                            | What It Does                                        |
| ---------------------------------- | --------------------------------------------------- |
| `Alex: Dream (Neural Maintenance)` | Validates synapses, checks architecture health      |
| `Alex: Status`                     | Shows loaded skills, instructions, version          |
| `Alex: Initialize Architecture`    | Sets up `.github/` if the repo doesn't have one yet |
| `Alex: Focus Session`              | Starts a Pomodoro timer for focused work            |
| `Alex: Health Dashboard`           | Opens a visual dashboard of architecture health     |

### Using Skills

Alex comes with 100+ portable skills covering topics like debugging, architecture, testing, deployment, and more. Skills load automatically from the `.github/skills/` folder. You don't need to do anything — just ask Alex about a topic and the relevant skill activates.

**Example**:
```
@alex I need to set up error handling for my API
```
Alex will automatically draw on error-handling skills, API design patterns, and any Global Knowledge insights.

### Using Agents

Type `@` in the chat to see available agents:

| Agent            | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `@alex`          | General orchestrator — your learning partner |
| `@researcher`    | Deep domain exploration                      |
| `@builder`       | Constructive implementation                  |
| `@validator`     | Adversarial QA — finds edge cases            |
| `@documentarian` | Documentation accuracy and drift prevention  |

### Focus Sessions (Pomodoro)

1. `Ctrl+Shift+P` → `Alex: Focus Session`
2. Set a goal (e.g., "Refactor authentication module")
3. Timer starts in the status bar — Alex adapts persona to your goal
4. When the session ends, Alex can help consolidate what you learned

---

## Global Knowledge

Global Knowledge (GK) gives you cross-project learnings — patterns and insights that transfer between repositories.

### Is GK Available?

If the devcontainer was configured with GK (most are), it auto-clones on Codespace creation. Check:

```bash
ls ~/.alex/global-knowledge/
```

You should see `patterns/`, `insights/`, and `index.json`.

### Using GK

| Command in Chat            | What It Does                          |
| -------------------------- | ------------------------------------- |
| `@alex /knowledge <query>` | Search patterns and insights          |
| `@alex /saveinsight`       | Save a learning from this session     |
| `@alex /knowledgestatus`   | See GK stats (pattern/insight counts) |

### Persisting GK Changes

GK lives in a separate Git repo cloned to `~/.alex/global-knowledge/`. If you save new insights:

```bash
cd ~/.alex/global-knowledge
git add -A
git commit -m "insight: add new learning"
git push
```

> ⚠️ If you don't push, GK changes are lost when the Codespace is deleted.

---

## Important: Saving Your Work

**Codespaces are ephemeral.** If a Codespace is deleted, any uncommitted changes are lost.

### What Persists Automatically
- ✅ **Committed code** — anything you `git push`
- ✅ **Global Knowledge** — if you `git push` the GK repo
- ✅ **VS Code Settings Sync** — if you enable Settings Sync in the browser

### What Does NOT Persist
- ❌ **Extension state** — lost when Codespace is deleted
- ❌ **Uncommitted `.github/` changes** — meditation state, profile updates
- ❌ **Uncommitted GK insights** — push them!

### Recommended Workflow

```
1. Start Codespace → Alex activates automatically
2. Work normally — all features available
3. Before stopping your Codespace:
   a. Commit + push any .github/ changes (meditation results, profile updates)
   b. Push Global Knowledge if you saved new insights
4. Stop Codespace → resume later from the same branch
```

> **Tip**: Stopped Codespaces retain their state (including uncommitted changes) for a retention period (default: 30 days). Only *deleted* Codespaces lose uncommitted work.

---

## Setting Up a New Repository for Codespaces

If your repository doesn't have Alex configured yet, here's how to add it.

### Option A: Deploy Script (From Local Machine)

If you have the Alex repository cloned locally:

```powershell
# Navigate to your project
cd C:\path\to\your-project

# Run the deploy script
& "C:\Development\Alex_Plug_In\platforms\codespaces\deploy.ps1"
```

The script creates `.devcontainer/devcontainer.json` with all the right settings.

**Script options:**

| Flag                                 | Effect                          |
| ------------------------------------ | ------------------------------- |
| `-TargetRepo "C:\Projects\my-app"`   | Deploy to a specific directory  |
| `-GitHubUser "your-github-username"` | Set GK repository owner         |
| `-SkipGK`                            | Skip Global Knowledge setup     |
| `-Force`                             | Overwrite existing devcontainer |

### Option B: Manual Setup

Create `.devcontainer/devcontainer.json` in your repository:

```json
{
    "name": "Alex-Enabled Development",
    "image": "mcr.microsoft.com/devcontainers/universal:2",
    "customizations": {
        "vscode": {
            "extensions": [
                "fabioc-aloha.alex-cognitive-architecture",
                "GitHub.copilot",
                "GitHub.copilot-chat"
            ],
            "settings": {
                "chat.agent.enabled": true,
                "chat.agentSkillsLocations": [".github/skills"],
                "chat.useAgentsMdFile": true,
                "chat.mcp.gallery.enabled": true
            }
        }
    },
    "postCreateCommand": "git clone https://github.com/YOUR_USERNAME/Alex-Global-Knowledge.git ~/.alex/global-knowledge 2>/dev/null || echo 'Global Knowledge not configured'"
}
```

Replace `YOUR_USERNAME` with your GitHub username (or remove the `postCreateCommand` line if you don't use Global Knowledge).

Then commit and push:

```bash
git add .devcontainer/
git commit -m "chore: add Alex Codespaces devcontainer"
git push
```

### Option C: Initialize Inside a Codespace

1. Open any Codespace
2. Install the Alex extension manually from the Extensions sidebar
3. Run `Alex: Initialize Architecture` from the Command Palette
4. Commit the generated `.github/` folder

---

## Team Usage

### Sharing Alex with Your Team

Once `.devcontainer/devcontainer.json` is committed to the repo, **every team member** who opens a Codespace gets Alex automatically. No setup required on their end.

### Sharing Global Knowledge

If your team uses a shared GK repository:

1. Create a shared `Alex-Global-Knowledge` repo on GitHub
2. Update the `postCreateCommand` in `devcontainer.json` to point to it
3. Everyone gets the same patterns and insights

### Onboarding New Team Members

New team members experience:
1. Clone repo (or open in Codespaces directly)
2. Alex + Copilot auto-install in ~60 seconds
3. All skills, instructions, and agents are ready
4. `@alex` is available immediately in chat

---

## Troubleshooting

| Problem                             | Solution                                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Alex icon missing in sidebar**    | Extension may still be installing — wait 30 seconds, then reload (`Developer: Reload Window`)   |
| **"Alex: Dream" command not found** | Check Extensions sidebar for "Alex Cognitive Architecture" — install if missing                 |
| **Global Knowledge not available**  | Run `ls ~/.alex/global-knowledge/` — if empty, check `postCreateCommand` in `devcontainer.json` |
| **Chat says "unknown participant"** | Ensure GitHub Copilot is installed and signed in                                                |
| **`.github/` not found**            | Run `Alex: Initialize Architecture` from the Command Palette                                    |
| **Slow performance**                | Consider upgrading Codespace machine type (Settings → Codespace machine type)                   |
| **Changes lost after restart**      | Commit and push before stopping — Codespaces are ephemeral                                      |
| **Settings not applied**            | Rebuild the container: Command Palette → `Codespaces: Rebuild Container`                        |
| **Extension out of date**           | Delete and recreate the Codespace to get the latest extension version                           |

### Getting Help

- `@alex /status` — Check what's loaded and version info
- `Alex: Dream (Neural Maintenance)` — Validates architecture integrity
- `Alex: Health Dashboard` — Visual health overview

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│             Alex in Codespaces — Quick Ref           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  OPEN:    GitHub → Code → Codespaces → Create       │
│  CHAT:    Ctrl+Alt+I → @alex <your question>        │
│  STATUS:  @alex /status                             │
│  DREAM:   Ctrl+Shift+P → Alex: Dream                │
│  FOCUS:   Ctrl+Shift+P → Alex: Focus Session         │
│  HEALTH:  Ctrl+Shift+P → Alex: Health Dashboard      │
│  GK:      @alex /knowledge <query>                   │
│  SAVE:    git add -A && git commit && git push       │
│                                                     │
│  ⚠️ ALWAYS commit before stopping your Codespace    │
└─────────────────────────────────────────────────────┘
```

---

## Further Reading

- [Codespaces Platform README](README.md) — Technical overview and deploy script details
- [Deployment Checklist](DEPLOYMENT-CHECKLIST.md) — Step-by-step validation
- [Codespaces Heir Architecture](../../alex_docs/platforms/CODESPACES-HEIR.md) — Full feature matrix and persistence strategy
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces) — Official GitHub documentation
