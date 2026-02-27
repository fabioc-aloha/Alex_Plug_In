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
  - [Slash Commands](#slash-commands)
- [Commands Reference](#-commands-reference)
  - [Command Palette](#command-palette-ctrlshiftp)
  - [Chat Commands](#chat-commands-alex-command)
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

   Open Copilot Chat and type:

   ```
   @alex Hello!
   ```

### First Session Checklist

- [ ] Extension installed
- [ ] `Alex: Initialize Architecture` run
- [ ] Test `@alex /status` in chat
- [ ] Run `@alex /profile` to personalize (optional)

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

| Setting | Purpose |
|---|---|
| `instructionsFilesLocations` | Enables procedural memory (.instructions.md) |
| `useAgentSkills` | Activates SKILL.md capabilities |
| `useNestedAgentsMdFiles` | Enables .agent.md hierarchies |
| `memory.enabled` | Persistent memory across sessions |

#### Recommended Settings (Improves Experience)

```json
{
  "chat.agent.enabled": true,
  "chat.viewSessions.enabled": true,
  "chat.useAgentsMdFile": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 50,
  "chat.experimental.detectParticipant.enabled": true,
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

| Option | Action |
|---|---|
| **Upgrade Instead** | Runs `Alex: Upgrade` to preserve your changes |
| **Reset Architecture** | Deletes all memory files and reinstalls fresh |
| **Cancel** | Aborts the operation |

---

## 💼 Use Cases

Alex adapts to your domain. While VS Code is traditionally for code, Alex works equally well for any text-based knowledge work.

| Domain | Example Prompts |
|---|---|
| **💻 Software Development** | *"Help me debug this"*, *"What patterns for error handling?"* |
| **📚 Writing & Publishing** | *"Strengthen chapter 3"*, *"Maintain consistent voice"* |
| **🎓 Academic Research** | *"Synthesize these findings"*, *"Identify literature gaps"* |
| **📊 Project Management** | *"Assess ADKAR readiness"*, *"Decompose the WBS"* |
| **🎭 Creative Arts** | *"Tighten this dialogue"*, *"Strengthen the imagery"* |
| **📝 Professional Writing** | *"Make this proposal compelling"*, *"Check edge cases"* |
| **🎨 Design** | *"Design a banner"*, *"What's the best icon grid?"* |
| **🌐 Localization** | *"Set up i18n"*, *"Handle RTL languages"* |

---

## 💬 Daily Usage

### Talking to Alex

Always start with `@alex` to activate Alex's cognitive framework:

```
@alex How do I implement error handling in this API?
@alex Review this code for potential issues
@alex Help me understand this architecture
```

### Slash Commands

| Command | What It Does |
|---|---|
| `/status` | Check Alex health and version |
| `/meditate` | Consolidate knowledge from session |
| `/dream` | Run neural maintenance |
| `/selfactualize` | Deep architecture assessment |
| `/learn` | Start a learning conversation |
| `/session` | Start a focused learning session |
| `/model` | Model intelligence dashboard |
| `/knowledge` | Search global knowledge |
| `/saveinsight` | Save a new insight |
| `/promote` | Promote local skill to global |
| `/knowledgestatus` | Knowledge base stats |
| `/sync` | Cloud sync |
| `/calendar` | View upcoming calendar events (Graph) |
| `/mail` | View recent emails (Graph) |
| `/context` | Full work context (Graph) |
| `/people` | People search (Graph) |
| `/profile` | Personalization |
| `/docs` | Open documentation |
| `/azure` | Azure guidance |
| `/m365` | M365 guidance |

### Learning Something New

When you learn something valuable:

```
@alex /saveinsight title="Error handling pattern" insight="Always wrap async..." tags="error-handling,typescript"
```

This saves the insight to your global knowledge base for use in other projects.

### Finding Past Knowledge

Search across all your projects:

```
@alex /knowledge error handling patterns
@alex /knowledge React hooks gotchas
```

---

## ⚡ Commands Reference

### Command Palette (Ctrl+Shift+P)

| Command | Description |
|---|---|
| `Alex: Initialize Architecture` | First-time setup for a project |
| `Alex: Upgrade Architecture` | Update to latest version |
| `Alex: Dream (Neural Maintenance)` | Validate and repair synapses |
| `Alex: Self-Actualize (Deep Meditation)` | Comprehensive health check |
| `Alex: Skill & Knowledge Review` | Review staleness-prone skills |
| `Alex: Inherit Skill from Global Knowledge` | Pull skills from GK repository |
| `Alex: Open Documentation` | View the docs |
| `Alex: Setup Environment` | Optimize VS Code settings for Alex |
| `Alex: Start Learning Session` | Begin Pomodoro-style focus session |
| `Alex: Pause/Resume Session` | Pause or resume active session |
| `Alex: Open Health Dashboard` | Rich webview with architecture visualization |
| `Alex: Create Learning Goal` | Create a new learning goal |
| `Alex: Sync Global Knowledge` | Sync with GitHub Gist |
| `Alex: Report Issue / View Diagnostics` | View local telemetry for bug reports |

### Chat Commands (@alex /command)

| Command | Purpose | Example |
|---|---|---|
| `/status` | Health check | `@alex /status` |
| `/meditate` | Knowledge consolidation | `@alex /meditate I learned about DI patterns` |
| `/dream` | Neural maintenance | `@alex /dream` |
| `/selfactualize` | Deep assessment | `@alex /selfactualize` |
| `/learn` | Learning session | `@alex /learn TypeScript generics` |
| `/model` | Model intelligence | `@alex /model` or `@alex /model <task>` |
| `/azure` | Azure guidance | `@alex /azure deploy function app` |
| `/m365` | M365 guidance | `@alex /m365 create teams bot` |
| `/calendar` | Calendar events | `@alex /calendar` or `@alex /calendar 7` |
| `/mail` | Recent emails | `@alex /mail` or `@alex /mail unread` |
| `/context` | Full work context | `@alex /context` |
| `/people` | People search | `@alex /people John Smith` |
| `/profile` | Personalization | `@alex /profile` |
| `/knowledge` | Search global | `@alex /knowledge caching patterns` |
| `/saveinsight` | Save learning | `@alex /saveinsight [your insight]` |
| `/promote` | Promote to global | `@alex /promote .github/skills/api-design/SKILL.md` |
| `/knowledgestatus` | Knowledge stats | `@alex /knowledgestatus` |
| `/sync` | Cloud sync | `@alex /sync` |
| `/docs` | Open documentation | `@alex /docs` |
| `/checkskills` | Discover new skills | `@alex /checkskills` |
| `/pullskill` | Install from GK | `@alex /pullskill <id>` |

### MCP Tools

#### Memory & Search

| Tool | Purpose | Auto? |
|---|---|---|
| `alex_memory_search` | Search memory files | ✅ Auto-fallback to global |
| `alex_global_knowledge_search` | Search global knowledge | — |
| `alex_global_knowledge_status` | Knowledge base status | — |

#### Knowledge Management

| Tool | Purpose | Auto? |
|---|---|---|
| `alex_save_insight` | Save learning to global | ✅ Auto cloud sync |
| `alex_promote_knowledge` | Promote local to global | ✅ Auto cloud sync |
| `alex_cloud_sync` | Sync with GitHub Gist | — |

#### Architecture Health

| Tool | Purpose |
|---|---|
| `alex_architecture_status` | Check Alex version and status |
| `alex_synapse_health` | Validate synaptic connections |
| `alex_self_actualization` | Deep architecture assessment |

---

## 🧠 Architecture Overview

### The Dual-Mind Model

Alex implements a dual-process cognitive model inspired by human cognition:

#### System 1: Unconscious Mind (Fast, Automatic)

- Runs continuously in the background
- No user intervention required
- Handles routine tasks automatically
- Pattern recognition and auto-learning

| Process | Trigger | Timing |
|---|---|---|
| Auto Global Search | Local search empty | Immediate |
| Startup Sync | Extension activates | 10 seconds |
| Periodic Sync | Timer | Every 5 minutes |
| Post-Modification Sync | Save/promote | 2 seconds |
| Auto-Insight | Conversation | Confidence ≥ 0.5 |

#### System 2: Conscious Mind (Slow, Deliberate)

- Activated by explicit user requests
- Handles complex reasoning tasks
- User-directed operations
- Requires attention and intention

### Memory Systems

Alex has different types of memory arranged in a hierarchy:

| Type | Location | Purpose |
|---|---|---|
| **Working** | Chat session | Current conversation (temporary) |
| **Procedural** | `.github/instructions/` | How-to processes (auto-loaded) |
| **Episodic** | `.github/prompts/` | Complex workflows (user-invoked) |
| **Skills** | `.github/skills/` | Domain expertise (auto-loaded) |
| **Global** | `~/.alex/global-knowledge/` | Cross-project patterns & insights |
| **Cloud** | GitHub Gist | Backup and sharing across machines |

### Global Knowledge

Your `~/.alex/` folder contains knowledge that works across all projects:

| Type | File Pattern | Purpose |
|---|---|---|
| Pattern | `GK-*.md` | Reusable solutions |
| Insight | `GI-*.md` | Timestamped learnings |
| Index | `index.json` | Searchable master index |

**Saving insights:**

```
@alex /saveinsight title="Error handling pattern" insight="Always wrap async..." tags="error-handling,typescript"
```

**Cloud backup:**

```
@alex /sync
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

~/.alex/
├── global-knowledge/
│   ├── index.json             # Master index
│   ├── patterns/              # GK-* files
│   └── insights/              # GI-* files
├── project-registry.json
└── sync-metadata.json
```

---

## ⌨️ Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|---|---|---|
| Start Learning Session | `Ctrl+Alt+P` | `Cmd+Alt+P` |
| Pause/Resume Session | `Ctrl+Alt+Space` | `Cmd+Alt+Space` |
| Search Knowledge | `Ctrl+Shift+K` | `Cmd+Shift+K` |
| Run Dream Protocol | `Ctrl+Alt+D` | `Cmd+Alt+D` |
| Self-Actualize | `Ctrl+Alt+S` | `Cmd+Alt+S` |
| Sync Knowledge | `Ctrl+Alt+K` | `Cmd+Alt+K` |
| Open Documentation | `Ctrl+Alt+H` | `Cmd+Alt+H` |
| Open Chat | `Ctrl+Alt+I` | `Cmd+Alt+I` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Output Panel | `Ctrl+Shift+U` | `Cmd+Shift+U` |

---

## 🔧 Maintenance & Health

### Daily Maintenance

1. Start session: `@alex Hello!` (triggers auto-check)
2. Work on your project
3. End session: `@alex /meditate` (consolidate learnings)

### Weekly Maintenance

Run neural maintenance to keep connections healthy:

```
@alex /dream
```

### Monthly Maintenance

Deep self-assessment:

```
@alex /selfactualize
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
@alex run full audit
@alex run security audit
@alex run dependency audit
```

| Priority | Audits |
|---|---|
| 🔴 High | Security, Dependencies, Code Quality |
| 🟡 Medium | UI, Bundle Size, Git, Changelog, Tests, API Compatibility |
| 🟢 Low | Accessibility, Localization, Assets, Configuration |

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
2. Verify `@alex` prefix in chat
3. Try reloading VS Code: `Ctrl+Shift+P` → "Reload Window"

### "Not Initialized" Error

```
Ctrl+Shift+P → "Alex: Initialize Architecture"
```

### Broken Synapses

```
@alex /dream
```

Or: `Ctrl+Shift+P` → "Alex: Dream (Neural Maintenance)"

### Cloud Sync Issues

1. Check GitHub authentication in VS Code
2. View Output panel: "Alex Unconscious Mind"
3. Try manual sync: `@alex /sync`

### Upgrade Failed

1. Check the error message
2. Look in `archive/upgrades/` for backups
3. Try `Alex: Reset Architecture` (last resort — backs up first)

### Finding Logs

| Channel | Content |
|---|---|
| Alex Cognitive Architecture | General extension logs |
| Alex Unconscious Mind | Background sync and auto-operations |

View in VS Code Output panel: `Ctrl+Shift+U`

### Getting Help

1. Check documentation: `@alex /docs`
2. Search knowledge: `@alex /knowledge [your issue]`
3. Run diagnostics: `@alex /status`

---

## 💡 Quick Tips

### Productivity

- 💡 Start each session with `@alex Hello!` for health check
- 💡 Save insights immediately when you learn something
- 💡 Use `/knowledge` before researching — you might already know it!
- 💡 End sessions with `/meditate` to consolidate

### Organization

- 📁 Keep domain knowledge files focused (one topic per file)
- 🏷️ Use consistent tags when saving insights
- 🔗 Add synapses to connect related knowledge

### Maintenance

- 🌙 Run `/dream` weekly for healthy connections
- 🧘 Run `/selfactualize` monthly for deep assessment
- ☁️ Sync to cloud after saving important insights

### Status Indicators

| Icon | Meaning |
|---|---|
| ✅ | Working / Healthy / Connected |
| ⏳ | In Progress / Syncing |
| ⚠️ | Warning / Needs Attention |
| ❌ | Error / Disconnected |
| 🧠 | Conscious (user-initiated) |
| 💤 | Unconscious (automatic) |
| 🌐 | Global knowledge |
| ☁️ | Cloud sync |

---

*Alex Cognitive Architecture — Your AI Learning Partner*
