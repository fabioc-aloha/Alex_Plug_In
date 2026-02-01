# ⚡ Quick Reference

> Commands, tools, and shortcuts at a glance

---

## Use Cases at a Glance

| Domain | Example Prompts |
| --- | --- |
| **Development** | *"Help me debug this"*, *"What patterns for error handling?"* |
| **Writing** | *"Strengthen chapter 3"*, *"Maintain consistent voice"* |
| **Research** | *"Synthesize these findings"*, *"Identify literature gaps"* |
| **Management** | *"Assess ADKAR readiness"*, *"Decompose the WBS"* |
| **Creative** | *"Tighten this dialogue"*, *"Strengthen the imagery"* |
| **Design** | *"Design a banner"*, *"What's the best icon grid?"* |
| **Localization** | *"Set up i18n"*, *"Handle RTL languages"*, *"ICU pluralization"* |

**See [PROJECT-TYPE-TEMPLATES.md](../.github/PROJECT-TYPE-TEMPLATES.md) for full templates.**

---

## Chat Commands

**Table 1:** *Chat Commands Quick Reference*

| Command | Description | Example |
| --- | --- | --- |
| `/knowledge` | Search global knowledge | `@alex /knowledge error handling` |
| `/saveinsight` | Save a new insight | `@alex /saveinsight React useEffect cleanup...` |
| `/promote` | Promote local skill to global | `@alex /promote .github/skills/api-design/SKILL.md` |
| `/knowledgestatus` | View knowledge base stats | `@alex /knowledgestatus` |
| `/session` | Start/manage learning session | `@alex /session React hooks` |
| `/goals` | View learning goals & streak | `@alex /goals` |
| `/sync` | Sync with cloud | `@alex /sync` |

---

## VS Code Commands

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

**Table 2:** *VS Code Command Palette Commands*

| Command | Description |
| --- | --- |
| `Alex: Initialize Architecture` | Deploy Alex to current project |
| `Alex: Dream (Neural Maintenance)` | Run health check and maintenance |
| `Alex: Upgrade Architecture` | Update to latest Alex version |
| `Alex: Setup Environment` | Optimize VS Code settings for Alex |
| `Alex: Sync Knowledge to Cloud` | Manual cloud sync |
| `Alex: Start Learning Session` | Begin Pomodoro-style focus session |
| `Alex: Pause/Resume Session` | Pause or resume active session |
| `Alex: Session Actions` | View/manage active session |
| `Alex: Open Health Dashboard` | Rich webview with architecture visualization |
| `Alex: Create Learning Goal` | Create a new learning goal |
| `Alex: Show Learning Goals` | View and manage learning goals |
| `Alex: Skill & Knowledge Review` | **NEW** Review staleness-prone skills (security, privacy, AI, APIs) |
| `Alex: Report Issue / View Diagnostics` | View local telemetry for bug reports |

---

## MCP Tools

### Memory & Search

**Table 3:** *Memory and Search MCP Tools*

| Tool | Purpose | Unconscious? |
| --- | --- | --- |
| `alex_memory_search` | Search memory files | ✅ Auto-fallback to global |
| `alex_global_knowledge_search` | Search global knowledge | – |
| `alex_global_knowledge_status` | Knowledge base status | – |

### Knowledge Management

**Table 4:** *Knowledge Management MCP Tools*

| Tool | Purpose | Unconscious? |
| --- | --- | --- |
| `alex_save_insight` | Save learning to global | ✅ Auto cloud sync |
| `alex_promote_knowledge` | Promote local to global | ✅ Auto cloud sync |
| `alex_cloud_sync` | Sync with GitHub Gist | – |

### Architecture Health

**Table 5:** *Architecture Health MCP Tools*

| Tool | Purpose |
| --- | --- |
| `alex_architecture_status` | Check Alex version and status |
| `alex_synapse_health` | Validate synaptic connections |
| `alex_self_actualization` | Deep architecture assessment |

---

## Memory File Types

**Table 6:** *Memory File Types and Locations*

| Type | Location | Pattern | Purpose |
| --- | --- | --- | --- |
| Procedural | `.github/instructions/` | `*.instructions.md` | How-to processes |
| Episodic | `.github/prompts/` | `*.prompt.md` | Complex workflows |
| Skills | `.github/skills/` | `*/SKILL.md` | Domain expertise |
| Global Pattern | `~/.alex/global-knowledge/patterns/` | `GK-*.md` | Cross-project patterns |
| Global Insight | `~/.alex/global-knowledge/insights/` | `GI-*.md` | Timestamped learnings |

---

## Global Knowledge Categories

**Table 7:** *Knowledge Category Definitions*

| Category | For |
| --- | --- |
| `error-handling` | Exception handling, recovery |
| `api-design` | REST, GraphQL, APIs |
| `testing` | Unit, integration, E2E |
| `debugging` | Troubleshooting |
| `performance` | Optimization |
| `architecture` | System design |
| `security` | Auth, encryption |
| `deployment` | CI/CD, infrastructure |
| `documentation` | Docs, diagrams |
| `refactoring` | Code improvement |
| `patterns` | Design patterns |
| `tooling` | Dev tools |
| `general` | Everything else |

---

## Unconscious Mind Quick Facts

**Table 8:** *Unconscious Process Triggers and Timing*

| Process | Trigger | Timing |
| --- | --- | --- |
| Auto Global Search | Local search empty | Immediate |
| Startup Sync | Extension activates | 10 seconds |
| Periodic Sync | Timer | Every 5 minutes |
| Post-Mod Sync | Save/promote | 2 seconds |
| Auto-Insight | Conversation | Confidence ≥ 0.5 |

---

## Architecture Files

```text
.github/
├── copilot-instructions.md    # Main Alex config
├── instructions/              # Procedural memory
├── prompts/                   # Episodic memory
├── skills/                    # Domain expertise (skills/*/SKILL.md)
├── episodic/                  # Session records
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

## Status Indicators

**Table 9:** *Status Icon Meanings*

| Icon | Meaning |
| --- | --- |
| ✅ | Working / Healthy / Connected |
| ⏳ | In Progress / Syncing |
| ⚠️ | Warning / Needs Attention |
| ❌ | Error / Disconnected |
| 🧠 | Conscious (user-initiated) |
| 💤 | Unconscious (automatic) |
| 🌐 | Global knowledge |
| ☁️ | Cloud sync |

---

## Trigger Phrases

### Meditation Triggers

- "meditate"
- "consolidate"
- "reflect"

### Maintenance Triggers

- "dream"
- "health check"
- "synapse validation"
- "maintenance"

### Self-Actualization Triggers

- "self-actualize"
- "deep assessment"
- "architecture review"

---

## Output Channels

View in VS Code Output panel (`Ctrl+Shift+U`):

**Table 10:** *VS Code Output Channels*

| Channel | Content |
| --- | --- |
| Alex Cognitive Architecture | General extension logs |
| Alex Unconscious Mind | Background sync and auto-operations |

---

## Keyboard Shortcuts

**Table 11:** *Keyboard Shortcuts*

| Action | Windows/Linux | macOS |
| --- | --- | --- |
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

## Common Workflows

### Starting a New Project

```text
1. Open project in VS Code
2. Run "Alex: Initialize Architecture"
3. Pull existing knowledge: @alex /sync
```

### Capturing a Learning

```text
1. Solve problem
2. @alex /saveinsight [what you learned]
3. Auto-syncs to cloud
```

### Before Switching Machines

```text
1. Ensure sync complete (check status)
2. @alex /sync (manual sync for safety)
3. Switch to new machine
4. @alex /sync (pull latest)
```

### Debugging Knowledge Issues

```text
1. @alex /knowledgestatus
2. Check output channel
3. @alex /sync (if needed)
4. "Alex: Dream" for architecture health
```

---

## Version Info

**Table 12:** *Current Versions*

| Component | Version |
| --- | --- |
| Alex Extension | See `@alex /status` |
| Cognitive Architecture | See `.github/copilot-instructions.md` |
| Global Knowledge Schema | 1.0.0 |

---

*Quick Reference - Everything You Need, Fast*
