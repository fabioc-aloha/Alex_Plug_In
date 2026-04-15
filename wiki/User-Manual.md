# User Manual

Complete reference for Alex commands, UI, and features.

## Table of Contents

- [Chat Commands](#chat-commands)
- [Sidebar Panel](#sidebar-panel)
- [Agents](#agents)
- [Skills](#skills)
- [Memory System](#memory-system)
- [Health Processes](#health-processes)
- [Settings](#settings)

---

## Chat Commands

Interact with Alex through Copilot Chat using the `@alex` participant.

### Core Commands

| Command | Description |
|---------|-------------|
| `@alex help` | List available commands and capabilities |
| `@alex status` | Show cognitive health and memory stats |
| `@alex dream` | Run dream cycle (synapse validation) |
| `@alex meditate` | Consolidate recent learning |
| `@alex self-actualize` | Deep architecture assessment |

### Workspace Commands

| Command | Description |
|---------|-------------|
| `@alex initialize` | Set up Alex for current workspace |
| `@alex reset` | Clear workspace-specific settings |
| `@alex sync` | Synchronize heir architecture |

### Agent Mode

| Command | Description |
|---------|-------------|
| `@alex /builder` | Switch to Builder agent (implementation) |
| `@alex /researcher` | Switch to Researcher agent (exploration) |
| `@alex /validator` | Switch to Validator agent (QA) |
| `@alex /documentarian` | Switch to Documentarian agent (docs) |

---

## Sidebar Panel

The Alex sidebar (`Ctrl+Shift+A` or click the Alex icon) contains three tabs:

### Mind Tab

Your window into Alex's cognitive state.

| Section | Shows |
|---------|-------|
| **Health Pulse** | Current cognitive health (0-100) |
| **Synapses** | Active learned connections |
| **Skills** | Available knowledge domains |
| **Memory** | Recent episodic entries |

**Actions:**
- 🧠 **Open Chat Memories** — View Copilot's memory about you
- 📊 **Memory Audit** — Analyze memory health and efficiency

### Mission Tab

Your current focus and session history.

| Section | Shows |
|---------|-------|
| **Active Session** | Current conversation context |
| **Recent Sessions** | Last 5 significant sessions |
| **Focus Areas** | Auto-detected project domains |

### Journey Tab

Your learning progress with Alex.

| Section | Shows |
|---------|-------|
| **Partnership Level** | How well Alex knows your patterns |
| **Skills Used** | Most activated skills |
| **Milestones** | Key learning moments |

---

## Agents

Alex has specialized agents for different tasks. Each brings focused expertise.

| Agent | Specialty | When to Use |
|-------|-----------|-------------|
| **Alex** | General partnership | Default, most conversations |
| **Builder** | Implementation | Writing code, creating features |
| **Researcher** | Exploration | Learning new domains, investigations |
| **Validator** | Quality assurance | Code review, testing, audits |
| **Documentarian** | Documentation | READMEs, wikis, changelogs |
| **Planner** | Strategy | Architecture, roadmaps, planning |
| **Presenter** | Communication | Demos, presentations, stakeholder docs |

### Switching Agents

In chat:
```
@alex /builder Create a React component for user profiles
```

Or explicitly:
```
@alex Use the Researcher agent to investigate OAuth2 best practices
```

---

## Skills

Alex has 165+ skills across domains. Skills activate automatically based on context.

### Skill Categories

| Category | Examples |
|----------|----------|
| **Development** | `vscode-extension-patterns`, `api-design`, `testing-strategies` |
| **AI/ML** | `prompt-engineering`, `rag-architecture`, `mcp-development` |
| **Documentation** | `markdown-mermaid`, `lint-clean-markdown`, `md-to-word` |
| **Quality** | `code-review`, `security-review`, `debugging-patterns` |
| **Process** | `release-process`, `git-workflow`, `scope-management` |

### Checking Active Skills

```
@alex What skills are active for this workspace?
```

### Requesting a Skill

```
@alex Use the security-review skill to audit this code
```

---

## Memory System

Alex maintains three types of memory:

### Synapses (Long-term)

Learned connections between concepts. Created when Alex discovers patterns or relationships.

- Stored in `.github/synapses/`
- Persist across sessions
- Strengthened through repeated use

### Episodic Memory (Session-based)

Records of significant sessions and decisions.

- Stored in `.github/episodic/`
- Captures key moments from conversations
- Used for context in future sessions

### User Memory (Copilot Chat)

Copilot Chat's memory about you, accessible to Alex.

- Cloud-synced across workspaces
- Contains preferences and patterns
- Managed via Mind tab or `@alex memory audit`

---

## Health Processes

Alex needs maintenance to stay healthy. Run these periodically:

### Dream (Weekly)

Validates and repairs synapse network.

```
@alex dream
```

**What it does:**
- Checks synapse integrity
- Identifies broken connections
- Proposes repairs
- Reports health score

### Meditate (After major sessions)

Consolidates recent learning into long-term memory.

```
@alex meditate
```

**What it does:**
- Reviews recent sessions
- Extracts key insights
- Creates new synapses
- Updates skill activations

### Self-Actualize (Monthly)

Comprehensive architecture assessment.

```
@alex self-actualize
```

**What it does:**
- Full cognitive architecture audit
- Skill usage analysis
- Memory efficiency review
- Improvement recommendations

---

## Settings

Configure Alex through VS Code settings (`Ctrl+,`).

### Available Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `alex.persona` | `auto` | Your primary persona (Developer/Researcher/Writer/auto) |
| `alex.verbosity` | `normal` | Response detail level (brief/normal/detailed) |
| `alex.autoMeditate` | `false` | Auto-meditate after long sessions |
| `alex.dreamReminder` | `7` | Days between dream reminders |

### Settings File

Create `.vscode/settings.json` in your workspace:

```json
{
  "alex.persona": "developer",
  "alex.verbosity": "detailed"
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+A` | Toggle Alex sidebar |
| `Ctrl+Shift+I` | Open Copilot Chat (talk to Alex) |
| `Ctrl+K Ctrl+A` | Quick Alex command |

### Custom Shortcuts

Add to `keybindings.json`:

```json
{
  "key": "ctrl+alt+d",
  "command": "alex.dream",
  "when": "editorTextFocus"
}
```

---

*Alex adapts to how you work. The more context you provide, the better the partnership.*
