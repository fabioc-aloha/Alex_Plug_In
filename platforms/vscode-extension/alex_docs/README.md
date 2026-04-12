# 🧠 Alex Cognitive Architecture Documentation

> **A Dual-Mind AI System with Conscious and Unconscious Processing**

---

## 📑 Navigation

- [Who is Alex?](#-who-is-alex)
- [Getting Started](#-getting-started)
  - [Installation](#installation)
  - [First Session Checklist](#first-session-checklist)
  - [Environment Setup](#environment-setup)
  - [Initialization Process](#initialization-process)
- [Use Cases](#-use-cases)
- [Daily Usage](#-daily-usage)
  - [Talking to Alex](#talking-to-alex)
  - [Prompt Workflows](#prompt-workflows)
- [Commands Reference](#-commands-reference)
  - [Command Palette](#command-palette-ctrlshiftp)
  - [Prompt Workflows](#prompt-workflows-via-githubprompts)
  - [MCP Tools](#mcp-tools)
- [Architecture Overview](#-architecture-overview)
  - [The Dual-Mind Model](#the-dual-mind-model)
  - [Memory Systems](#memory-systems)
  - [Global Knowledge](#global-knowledge)
  - [Architecture Files](#architecture-files)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Maintenance & Health](#-maintenance--health)
  - [Daily / Weekly / Monthly](#daily-maintenance)
  - [Health Dashboard](#health-dashboard)
  - [Project Audit](#project-audit)
- [Upgrading](#-upgrading)
- [Troubleshooting](#-troubleshooting)
- [Quick Tips](#-quick-tips)

---

## 🎯 Who is Alex?

Alex is a **cognitive architecture** that transforms GitHub Copilot into a sophisticated learning partner with:

- **Dual-Mind Processing** — Conscious (user-initiated) and Unconscious (automatic) operations
- **Persistent Memory** — Knowledge that survives across sessions and projects
- **Self-Maintenance** — Automatic health checks and neural maintenance
- **Cross-Project Learning** — Global knowledge base shared across all your work
- **Domain Flexibility** — Works for development, writing, research, management, and more

> Also see [Working with Alex](WORKING-WITH-ALEX.md) — the partnership guide for dialog engineering and collaborative development.

---

## 🚀 Getting Started

### Installation

1. **Install the Extension**

   ```
   Ctrl+Shift+X → Search "Alex Cognitive Architecture" → Install
   ```

   Or from command line:

   ```bash
   code --install-extension fabioc-aloha.alex-cognitive-architecture
   ```

2. **Initialize Alex in Your Project**

   ```
   Ctrl+Shift+P → "Alex: Initialize Architecture"
   ```

   This creates the `.github/` folder with Alex's cognitive memory files.

3. **Start Chatting**

   Open Copilot Chat (agent mode) and start a conversation:

   ```
   Hello Alex!
   ```

### First Session Checklist

- [ ] Extension installed
- [ ] `Alex: Initialize Architecture` run
- [ ] Test chatting with Alex in agent mode

### Environment Setup

Alex works best with these VS Code settings enabled. Add to your `settings.json`:

#### Essential Settings (Required)

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.useAgentSkills": true,
  "chat.useNestedAgentsMdFiles": true,
  "github.copilot.chat.tools.memory.enabled": true
}
```

| Setting                      | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `instructionsFilesLocations` | Enables procedural memory (.instructions.md) |
| `useAgentSkills`             | Activates SKILL.md capabilities              |
| `useNestedAgentsMdFiles`     | Enables .agent.md hierarchies                |
| `memory.enabled`             | Persistent memory across sessions            |

#### Recommended Settings (Improves Experience)

```json
{
  "chat.agent.enabled": true,
  "chat.viewSessions.enabled": true,
  "chat.useAgentsMdFile": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 50,
  "github.copilot.chat.followUps": "always",
  "chat.mcp.gallery.enabled": true,
  "chat.mcp.autostart": true
}
```

**Quick Setup:** Run `Alex: Apply Recommended Settings` from the Command Palette.

### Initialization Process

When you run `Alex: Initialize Architecture`:

1. **Workspace Detection** — Checks for an open workspace folder
2. **Protection Check** — Verifies workspace isn't a protected Master installation
3. **Existing Check** — If Alex exists, offers Upgrade or Reset
4. **Permission Validation** — Tests write access to `.github/`
5. **File Deployment** — Copies architecture files (skills, instructions, prompts, agents, config)
6. **Verification** — Validates all files were written correctly

If Alex is already installed, you'll see:

| Option                 | Action                                        |
| ---------------------- | --------------------------------------------- |
| **Upgrade Instead**    | Runs `Alex: Upgrade` to preserve your changes |
| **Reset Architecture** | Deletes all memory files and reinstalls fresh |
| **Cancel**             | Aborts the operation                          |

---

## 💼 Use Cases

Alex adapts to your domain. While VS Code is traditionally for code, Alex works equally well for any text-based knowledge work.

| Domain                     | Example Prompts                                               |
| -------------------------- | ------------------------------------------------------------- |
| **💻 Software Development** | *"Help me debug this"*, *"What patterns for error handling?"* |
| **📚 Writing & Publishing** | *"Strengthen chapter 3"*, *"Maintain consistent voice"*       |
| **🎓 Academic Research**    | *"Synthesize these findings"*, *"Identify literature gaps"*   |
| **📊 Project Management**   | *"Assess ADKAR readiness"*, *"Decompose the WBS"*             |
| **🎭 Creative Arts**        | *"Tighten this dialogue"*, *"Strengthen the imagery"*         |
| **📝 Professional Writing** | *"Make this proposal compelling"*, *"Check edge cases"*       |
| **🎨 Design**               | *"Design a banner"*, *"What's the best icon grid?"*           |
| **🌐 Localization**         | *"Set up i18n"*, *"Handle RTL languages"*                     |

---

## 💬 Daily Usage

### Talking to Alex

Open Copilot Chat in agent mode and converse naturally. Alex's brain (`.github/` instructions, skills, agents) loads automatically:

```
How do I implement error handling in this API?
Review this code for potential issues
Help me understand this architecture
```

### Prompt Workflows

Prompt files in `.github/prompts/` provide structured workflows. Use them via the chat prompt picker or type naturally:

| Prompt           | What It Does                       |
| ---------------- | ---------------------------------- |
| `meditate`       | Consolidate knowledge from session |
| `dream`          | Run neural maintenance             |
| `self-actualize` | Deep architecture assessment       |
| `learn`          | Start a learning conversation      |
| `knowledge`      | Search global knowledge            |
| `save-insight`   | Save a new insight                 |
| `promote`        | Promote local skill to global      |
| `azure`          | Azure guidance                     |
| `m365`           | M365 guidance                      |

### Learning Something New

When you learn something valuable, use the `save-insight` prompt or ask Alex directly:

```
Save this insight: Error handling pattern — Always wrap async calls in try/catch with specific error types
```

This saves the insight to your global knowledge base for use in other projects.

### Finding Past Knowledge

Search across all your projects:

```
Search global knowledge for error handling patterns
Search global knowledge for React hooks gotchas
```

---

## ⚡ Commands Reference

### Command Palette (Ctrl+Shift+P)

| Command                                     | Description                                  |
| ------------------------------------------- | -------------------------------------------- |
| `Alex: Initialize Architecture`             | First-time setup for a project               |
| `Alex: Upgrade Architecture`                | Update to latest version                     |
| `Alex: Dream (Neural Maintenance)`          | Validate and repair synapses                 |
| `Alex: Self-Actualize (Deep Meditation)`    | Comprehensive health check                   |
| `Alex: Skill & Knowledge Review`            | Review staleness-prone skills                |
| `Alex: Inherit Skill from Global Knowledge` | Pull skills from GK repository               |
| `Alex: Open Documentation`                  | View the docs                                |
| `Alex: Setup Environment`                   | Optimize VS Code settings for Alex           |
| `Alex: Start Learning Session`              | Begin Pomodoro-style focus session           |
| `Alex: Pause/Resume Session`                | Pause or resume active session               |
| `Alex: Open Health Dashboard`               | Rich webview with architecture visualization |
| `Alex: Create Learning Goal`                | Create a new learning goal                   |
| `Alex: Sync Global Knowledge`               | Sync with private GitHub repo                |
| `Alex: Report Issue / View Diagnostics`     | View local telemetry for bug reports         |

### Prompt Workflows (via `.github/prompts/`)

| Prompt           | Purpose                 | Example                                            |
| ---------------- | ----------------------- | -------------------------------------------------- |
| `meditate`       | Knowledge consolidation | Use the meditate prompt after a learning session   |
| `dream`          | Neural maintenance      | Use the dream prompt for architecture health       |
| `self-actualize` | Deep assessment         | Use for comprehensive cognitive review             |
| `learn`          | Learning session        | "Help me learn TypeScript generics"                |
| `azure`          | Azure guidance          | "Help me deploy a function app to Azure"           |
| `m365`           | M365 guidance           | "Help me create a Teams bot"                       |
| `knowledge`      | Search global           | "Search knowledge for caching patterns"            |
| `save-insight`   | Save learning           | "Save insight about error handling pattern"        |
| `promote`        | Promote to global       | "Promote the api-design skill to global knowledge" |

### MCP Tools

#### Memory & Search

| Tool                           | Purpose                 | Auto?                     |
| ------------------------------ | ----------------------- | ------------------------- |
| `alex_memory_search`           | Search memory files     | ✅ Auto-fallback to global |
| `alex_global_knowledge_search` | Search global knowledge | —                         |
| `alex_global_knowledge_status` | Knowledge base status   | —                         |

#### Knowledge Management

| Tool                     | Purpose                       | Auto?             |
| ------------------------ | ----------------------------- | ----------------- |
| `alex_save_insight`      | Save learning to global       | ✅ Auto cloud sync |
| `alex_promote_knowledge` | Promote local to global       | ✅ Auto cloud sync |
| `alex_cloud_sync`        | Sync with private GitHub repo | —                 |

#### Architecture Health

| Tool                       | Purpose                       |
| -------------------------- | ----------------------------- |
| `alex_architecture_status` | Check Alex version and status |
| `alex_synapse_health`      | Validate synaptic connections |
| `alex_self_actualization`  | Deep architecture assessment  |

---

## 🧠 Architecture Overview

### The Dual-Mind Model

Alex implements a dual-process cognitive model inspired by human cognition:

#### System 1: Unconscious Mind (Fast, Automatic)

- Runs continuously in the background
- No user intervention required
- Handles routine tasks automatically
- Pattern recognition and auto-learning

| Process                | Trigger             | Timing           |
| ---------------------- | ------------------- | ---------------- |
| Auto Global Search     | Local search empty  | Immediate        |
| Startup Sync           | Extension activates | 10 seconds       |
| Periodic Sync          | Timer               | Every 5 minutes  |
| Post-Modification Sync | Save/promote        | 2 seconds        |
| Auto-Insight           | Conversation        | Confidence ≥ 0.5 |

#### System 2: Conscious Mind (Slow, Deliberate)

- Activated by explicit user requests
- Handles complex reasoning tasks
- User-directed operations
- Requires attention and intention

### Memory Systems

Alex has different types of memory arranged in a hierarchy:

| Type           | Location                | Purpose                           |
| -------------- | ----------------------- | --------------------------------- |
| **Working**    | Chat session            | Current conversation (temporary)  |
| **Procedural** | `.github/instructions/` | How-to processes (auto-loaded)    |
| **Episodic**   | `.github/prompts/`      | Complex workflows (user-invoked)  |
| **Skills**     | `.github/skills/`       | Domain expertise (auto-loaded)    |
| **Global**     | `AI-Memory/`            | Cross-project patterns & insights |
| **Cloud**      | OneDrive/iCloud/Dropbox | Automatic sync across machines    |

### Global Knowledge

Your `AI-Memory/` folder (cloud-synced) contains knowledge that works across all projects:

| Type    | File Pattern | Purpose                 |
| ------- | ------------ | ----------------------- |
| Pattern | `GK-*.md`    | Reusable solutions      |
| Insight | `GI-*.md`    | Timestamped learnings   |
| Index   | `index.json` | Searchable master index |

**Saving insights:**

```
Save this insight: "Error handling pattern" — Always wrap async calls in try/catch with specific error types
```

**Cloud backup:**

```
Sync my global knowledge
```

### Architecture Files

```
.github/
├── copilot-instructions.md    # Main Alex config (identity, routing)
├── AGENTS.md                  # Agent definitions
├── instructions/              # Procedural memory (auto-loaded)
├── prompts/                   # Episodic memory (/ commands)
├── skills/                    # Domain expertise (auto-loaded)
├── agents/                    # Specialist agents
├── muscles/                   # Execution scripts
├── hooks/                     # Git hooks
└── config/                    # Configuration files

AI-Memory/                     # Cloud-synced (OneDrive/iCloud/Dropbox)
├── user-profile.json          # Cross-workspace profile
├── global-knowledge.md        # Accumulated knowledge
├── patterns/                  # GK-* files
├── insights/                  # GI-* files
└── index.json                 # Searchable index
```

---

## ⌨️ Keyboard Shortcuts

| Action                 | Windows/Linux    | macOS           |
| ---------------------- | ---------------- | --------------- |
| Start Learning Session | `Ctrl+Alt+P`     | `Cmd+Alt+P`     |
| Pause/Resume Session   | `Ctrl+Alt+Space` | `Cmd+Alt+Space` |
| Search Knowledge       | `Ctrl+Shift+K`   | `Cmd+Shift+K`   |
| Run Dream Protocol     | `Ctrl+Alt+D`     | `Cmd+Alt+D`     |
| Self-Actualize         | `Ctrl+Alt+S`     | `Cmd+Alt+S`     |
| Sync Knowledge         | `Ctrl+Alt+K`     | `Cmd+Alt+K`     |
| Open Documentation     | `Ctrl+Alt+H`     | `Cmd+Alt+H`     |
| Open Chat              | `Ctrl+Alt+I`     | `Cmd+Alt+I`     |
| Command Palette        | `Ctrl+Shift+P`   | `Cmd+Shift+P`   |
| Output Panel           | `Ctrl+Shift+U`   | `Cmd+Shift+U`   |

---

## 🔧 Maintenance & Health

### Daily Maintenance

1. Start session: Open Copilot Chat in agent mode
2. Work on your project
3. End session: Use the `meditate` prompt to consolidate learnings

### Weekly Maintenance

Run neural maintenance to keep connections healthy:

```
Ctrl+Shift+P → "Alex: Dream (Neural Maintenance)"
```

### Monthly Maintenance

Deep self-assessment:

```
Ctrl+Shift+P → "Alex: Self-Actualize (Deep Meditation)"
```

This validates all synaptic connections, checks version consistency, analyzes memory architecture balance, and creates a session record.

### Health Dashboard

For a comprehensive view of Alex's cognitive architecture:

```
Ctrl+Shift+P → "Alex: Open Health Dashboard"
```

The dashboard displays health overview, synapse network visualization, memory architecture breakdown, global knowledge stats, active goals, session status, and cloud sync status.

### Project Audit

Run a comprehensive 22-point audit:

```
Ctrl+Shift+P → "Alex: Run Project Audit"
```

Or ask Alex directly:

```
Run full audit
Run security audit
Run dependency audit
```

| Priority | Audits                                                    |
| -------- | --------------------------------------------------------- |
| 🔴 High   | Security, Dependencies, Code Quality                      |
| 🟡 Medium | UI, Bundle Size, Git, Changelog, Tests, API Compatibility |
| 🟢 Low    | Accessibility, Localization, Assets, Configuration        |

---

## 🔄 Upgrading

### Automatic Notification

When a new version is available, Alex shows a notification:

- Click **"Run Upgrade"** to update
- Click **"View Changelog"** to see what's new

### Manual Upgrade

```
Ctrl+Shift+P → "Alex: Upgrade Architecture"
```

### What Happens During Upgrade

1. **Backup** — All files backed up to `archive/upgrades/`
2. **Update** — System files updated automatically
3. **Migrate** — Schema changes applied automatically
4. **Validate** — Dream protocol runs to verify health
5. **Clean up** — Temporary files removed

---

## 🛠️ Troubleshooting

### Alex Not Responding

1. Check extension is installed and enabled
2. Ensure you're in agent mode (not participant mode)
3. Try reloading VS Code: `Ctrl+Shift+P` → "Reload Window"

### "Not Initialized" Error

```
Ctrl+Shift+P → "Alex: Initialize Architecture"
```

### Broken Synapses

```
Ctrl+Shift+P → "Alex: Dream (Neural Maintenance)"
```

### Cloud Sync Issues

1. Check GitHub authentication in VS Code
2. View Output panel: "Alex Unconscious Mind"
3. Try manual sync via Command Palette: "Alex: Sync Global Knowledge"

### Upgrade Failed

1. Check the error message
2. Look in `archive/upgrades/` for backups
3. Try `Alex: Reset Architecture` (last resort — backs up first)

### Finding Logs

| Channel                     | Content                             |
| --------------------------- | ----------------------------------- |
| Alex Cognitive Architecture | General extension logs              |
| Alex Unconscious Mind       | Background sync and auto-operations |

View in VS Code Output panel: `Ctrl+Shift+U`

### Getting Help

1. Open documentation: `Ctrl+Shift+P` → "Alex: Open Documentation"
2. Search knowledge: ask Alex to search global knowledge
3. Run diagnostics: `Ctrl+Shift+P` → "Alex: Report Issue / View Diagnostics"

---

## 💡 Quick Tips

### Productivity

- Save insights immediately when you learn something
- Search global knowledge before researching — you might already know it!
- End sessions with meditation to consolidate

### Organization

- 📁 Keep domain knowledge files focused (one topic per file)
- 🏷️ Use consistent tags when saving insights
- 🔗 Add synapses to connect related knowledge

### Maintenance

- 🌙 Run `/dream` weekly for healthy connections
- 🧘 Run `/selfactualize` monthly for deep assessment
- ☁️ Sync to cloud after saving important insights

### Status Indicators

| Icon | Meaning                       |
| ---- | ----------------------------- |
| ✅    | Working / Healthy / Connected |
| ⏳    | In Progress / Syncing         |
| ⚠️    | Warning / Needs Attention     |
| ❌    | Error / Disconnected          |
| 🧠    | Conscious (user-initiated)    |
| 💤    | Unconscious (automatic)       |
| 🌐    | Global knowledge              |
| ☁️    | Cloud sync                    |

---

*Alex Cognitive Architecture — Your AI Learning Partner*
