# Alex Agent Plugin — User Manual

> Complete guide to using Alex as a VS Code agent plugin.

**Related**: [Plugin README](./README.md) · [Extension User Manual](../../alex_docs/guides/USER-MANUAL.md)

---

## Table of Contents

1. [What You Get](#what-you-get)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [First Session](#first-session)
5. [Using Skills](#using-skills)
6. [Using Agents](#using-agents)
7. [Using Prompts](#using-prompts)
8. [Instructions (Automatic)](#instructions-automatic)
9. [MCP Cognitive Tools](#mcp-cognitive-tools)
10. [Lifecycle Hooks](#lifecycle-hooks)
11. [Memory & Knowledge](#memory--knowledge)
12. [Maintenance](#maintenance)
13. [Updating the Plugin](#updating-the-plugin)
14. [What's Different from the Extension](#whats-different-from-the-extension)
15. [Troubleshooting](#troubleshooting)
16. [Quick Reference](#quick-reference)

---

## What You Get

The Alex Agent Plugin installs Alex's cognitive architecture directly into VS Code's Copilot Chat — no extension needed. It includes:

| Component | Count | How It Works |
| --------- | ----: | ------------ |
| Skills | 84 | On-demand domain knowledge across 16 categories |
| Agents | 7 | Specialist personas (Researcher, Builder, Validator, etc.) |
| Instructions | 22 | Auto-loaded rules matched by file patterns |
| Prompts | 11 | Reusable `/` commands for common workflows |
| MCP Server | 1 | Cognitive tools via Model Context Protocol |
| Hooks | 1 | PreToolUse safety gate for destructive operations |

---

## Prerequisites

- **VS Code 1.110+** (agent plugins support)
- **GitHub Copilot** subscription (Individual, Business, or Enterprise)
- **Agent mode** enabled in Copilot Chat

### Required Settings

Add these to your VS Code `settings.json` (`Ctrl+,` → Open Settings JSON):

```jsonc
{
  "chat.agent.enabled": true,
  "chat.plugins.enabled": true
}
```

---

## Installation

### Method 1: Local Path (Recommended for Development)

1. Clone or copy the `plugin/` directory to a stable location
2. Add to your VS Code settings:

```json
{
  "chat.plugins.paths": {
    "C:/path/to/platforms/agent-plugin/plugin": true
  }
}
```

3. Restart VS Code (or reload the window: `Ctrl+Shift+P` → "Reload Window")

### Method 2: Plugin Marketplace

1. Open Extensions sidebar (`Ctrl+Shift+X`)
2. Type `@agentPlugins` in the search bar
3. Find **Alex Cognitive Architecture** and click **Install**

> **Note**: Marketplace availability depends on the plugin marketplace being configured in your VS Code settings via `chat.plugins.marketplaces`.

### Method 3: Git Repository Marketplace

Add a plugin marketplace that points to the git repository:

```json
{
  "chat.plugins.marketplaces": [
    {
      "url": "https://github.com/your-org/alex-plugin-marketplace"
    }
  ]
}
```

The marketplace repository must contain a `marketplace.json` listing Alex as an available plugin.

### Verify Installation

After installation, open Copilot Chat and type:

```text
What skills do you have?
```

Alex should respond with awareness of the loaded skills. You can also check the Extensions sidebar under `@agentPlugins` to confirm the plugin appears.

---

## First Session

### Say Hello

Open Copilot Chat (`Ctrl+Alt+I`) and start a conversation:

```text
Hello! What can you help me with?
```

Alex will introduce himself and describe the skills available in the plugin.

### Try a Prompt Command

Type `/` in chat to see available prompt commands:

```text
/learn TypeScript generics
```

### Switch to a Specialist Agent

In the chat dropdown (where it says "Agent" or "Ask"), select one of the specialist agents:

- **Researcher** — deep domain exploration
- **Builder** — constructive implementation
- **Validator** — adversarial quality assurance

### First Session Checklist

- [ ] Plugin installed and VS Code restarted
- [ ] Copilot Chat opens without errors
- [ ] `/learn` or `/review` command works
- [ ] At least one specialist agent is selectable in the chat dropdown

---

## Using Skills

Skills are Alex's domain expertise — 84 curated knowledge packages organized into 16 categories. They load on-demand when relevant to your conversation.

### How Skills Work

1. **You ask a question** — "How do I write effective tests?"
2. **Alex routes to the skill** — the `testing-strategies` skill activates
3. **Knowledge applies** — Alex responds with skill-informed guidance

Skills use 3-level progressive disclosure:

| Level | What Loads | When |
| ----- | ---------- | ---- |
| **Name** | Skill title and description | Always visible in routing |
| **Body** | Full SKILL.md content | When the topic comes up |
| **Resources** | Linked references and guides | When going deep |

### Skill Categories at a Glance

| Category | Skills | Examples |
| -------- | -----: | ------- |
| Cognitive & Learning | 14 | bootstrap-learning, knowledge-synthesis, cognitive-symbiosis |
| Empathy & Coaching | 3 | frustration-recognition, coaching-techniques, proactive-assistance |
| Engineering Fundamentals | 9 | testing-strategies, code-review, research-first-development |
| Operations & Reliability | 10 | incident-response, root-cause-analysis, scope-management |
| Security & Privacy | 4 | security-review, pii-privacy-regulations, distribution-security |
| Documentation & Communication | 16 | markdown-mermaid, documentation-quality-assurance, creative-writing |
| Academic Research | 5 | academic-paper-drafting, literature-review, citation-management |
| Visual Design | 2 | svg-graphics, graphic-design |
| Business & Analysis | 2 | business-analysis, alex-effort-estimation |
| Architecture & Design | 8 | architecture-audit, llm-model-selection, skill-building |
| AI & Machine Learning | 4 | prompt-engineering, mcp-development, rag-architecture, ai-agent-design |
| Other | 7 | ui-ux-design, database-design, multi-agent-orchestration |

> **Tip**: See the [Plugin README](./README.md) for the complete 126-skill inventory with trifecta status, dependencies, and plugin-ready ratings.

### Requesting a Skill Directly

If you know the skill you want, mention it explicitly:

```text
Use the root-cause-analysis skill to help me debug this crash
```

```text
Apply research-first-development to this new feature
```

---

## Using Agents

Agents are specialist personas that bring a specific mindset and approach to your task. The plugin includes 7 agents.

### Available Agents

| Agent | Persona | Best For |
| ----- | ------- | -------- |
| **Alex** | Orchestrator | General tasks — routes to skills and other agents |
| **Researcher** | Deep explorer | Research, gap analysis, knowledge discovery |
| **Builder** | Constructive implementer | Code generation, feature implementation |
| **Validator** | Adversarial QA | Code review, security audit, quality gates |
| **Documentarian** | Documentation specialist | Docs, READMEs, changelogs, drift detection |
| **Azure** | Azure expert | Azure services, deployment, architecture |
| **M365** | Microsoft 365 expert | Teams apps, Graph API, Copilot agents |

### How to Use an Agent

**Option 1**: Select the agent from the chat model/agent dropdown at the top of the chat panel.

**Option 2**: Ask Alex to delegate:

```text
Have the Validator review this pull request
```

```text
Ask the Researcher to investigate caching strategies for this API
```

### Agent Workflow Example

A typical multi-agent workflow:

1. **Research** — Switch to Researcher: "What are the best approaches for real-time sync?"
2. **Plan** — Switch to Alex: "Based on the research, create an implementation plan"
3. **Build** — Switch to Builder: "Implement the WebSocket handler from the plan"
4. **Validate** — Switch to Validator: "Review the implementation for security issues"
5. **Document** — Switch to Documentarian: "Write the API documentation for the sync feature"

---

## Using Prompts

Prompts are reusable workflow templates invoked as `/` commands in chat. The plugin includes 11 prompts.

### Available Prompts

| Command | Purpose | Example |
| ------- | ------- | ------- |
| `/learn` | Start a learning session on any topic | `/learn Kubernetes networking` |
| `/review` | Structured code review | `/review` (on selected code) |
| `/plan` | Create an implementation plan | `/plan Add user authentication` |
| `/improve` | Improve existing code or docs | `/improve` (on selection) |
| `/tdd` | Test-driven development workflow | `/tdd Write a rate limiter` |
| `/gapanalysis` | 4-dimension gap analysis | `/gapanalysis Our deployment pipeline` |
| `/northstar` | Align work with project goals | `/northstar Are we still on track?` |
| `/cross-domain-transfer` | Apply patterns from another domain | `/cross-domain-transfer Apply gaming UX to our dashboard` |
| `/mcp-server` | Create an MCP server | `/mcp-server Build a weather data tool` |
| `/ui-ux-audit` | Audit UI/UX patterns | `/ui-ux-audit` (on component code) |
| `/presentation` | Create a presentation outline | `/presentation Q3 architecture review` |

### How to Use Prompts

Type `/` in the chat input to see all available prompt commands, then select one:

```text
/learn React Server Components
```

Prompts guide the conversation through a structured workflow. They combine Alex's skills, instructions, and reasoning into a repeatable process.

### Combining Prompts with Agents

For maximum effectiveness, pair prompts with the right agent:

| Combination | When to Use |
| ----------- | ----------- |
| Researcher + `/gapanalysis` | Before starting a new project |
| Builder + `/tdd` | Implementing new features |
| Validator + `/review` | Pre-merge code review |
| Documentarian + `/improve` | Documentation cleanup |
| Alex + `/plan` | Sprint planning or task breakdown |

---

## Instructions (Automatic)

Instructions are rules that load automatically based on the files you're working with. You don't invoke them — they activate when VS Code matches their `applyTo` pattern against your open files.

### What's Included

The plugin includes 22 instruction files covering:

| Category | Instructions |
| -------- | ------------ |
| **Code Quality** | code-review-guidelines, nasa-code-standards, testing-strategies, semantic-audit |
| **Architecture** | architecture-decision-records, research-first-workflow, skill-selection-optimization |
| **Security** | adversarial-oversight, dependency-management |
| **Knowledge** | bootstrap-learning, knowledge-synthesis, deep-thinking, empirical-validation |
| **Ethics** | worldview-constitutional-ai, worldview-integration, worldview-moral-psychology |
| **Workflow** | north-star, technical-debt-tracking, skill-building, ui-ux-design, mcp-development |
| **Documentation** | markdown-mermaid |

### How Instructions Activate

Each instruction file has an `applyTo` glob pattern. Examples:

| Instruction | Activates When You Edit |
| ----------- | ----------------------- |
| code-review-guidelines | `*.ts`, `*.js`, `*.py`, `*.go`, `*.rs`, etc. |
| dependency-management | `package.json`, `requirements.txt`, `Cargo.toml` |
| testing-strategies | `*.test.ts`, `*.spec.js`, test files |
| nasa-code-standards | Any source code file |
| markdown-mermaid | `*.md` files |

You don't need to do anything — relevant instructions inject automatically into Alex's context.

---

## MCP Cognitive Tools

The plugin includes an MCP (Model Context Protocol) server that provides cognitive tools to Copilot Chat.

### What MCP Provides

The `alex-cognitive-tools` server exposes tools that give Alex enhanced capabilities:

- **Memory search** — query across knowledge files
- **State management** — track cognitive state and focus
- **Self-actualization** — architecture health assessment
- **Synapse health** — connection integrity checks
- **User profile** — personalization context

### Configuration

The MCP server is configured in `plugin/.mcp.json` and starts automatically when the plugin loads (if `chat.mcp.autostart` is enabled):

```jsonc
{
  "chat.mcp.gallery.enabled": true,
  "chat.mcp.autostart": true
}
```

### Requirements

The MCP server requires Node.js to be installed and available on your PATH. If the server fails to start, verify:

```bash
node --version  # Should return v18+
```

---

## Lifecycle Hooks

The plugin includes a **PreToolUse** hook — a safety gate that runs before destructive operations (file writes, terminal commands, etc.).

### What the Hook Does

Before Alex executes a tool that modifies files or runs commands, the hook verifies:

- The workspace is not a protected Master Alex workspace
- The operation is safe for the current context

### Configuration

Hooks are defined in `plugin/hooks.json`:

```json
{
  "hooks": {
    "PreToolUse": {
      "command": "node ${pluginPath}/muscles/hooks/pre-tool-use.js",
      "description": "Safety gate — verify workspace protection before destructive operations",
      "timeout": 2000
    }
  }
}
```

To enable hooks, ensure this setting is on:

```json
{
  "chat.hooks.enabled": true
}
```

---

## Memory & Knowledge

### How Memory Works in the Plugin

The agent plugin uses **file-based memory only**. Knowledge lives in the files within your project's `.github/` directory (if initialized) and within the plugin's own skill files.

| Memory Type | Location | Description |
| ----------- | -------- | ----------- |
| Skills | `plugin/skills/` | 84 domain knowledge packages |
| Instructions | `plugin/instructions/` | 22 auto-loaded rule sets |
| Prompts | `plugin/prompts/` | 11 workflow templates |
| Project memory | Your project's `.github/` | Custom skills and instructions you create |
| Copilot Memory | VS Code Copilot Memory | Conversational context across sessions |

### Creating Project-Specific Knowledge

Add domain knowledge to your own project by creating skill files:

```
your-project/.github/skills/your-topic/SKILL.md
```

These load alongside the plugin's built-in skills.

### Using Copilot Memory

VS Code 1.110+ supports Copilot Memory — conversational context that persists across chat sessions. This supplements the plugin's file-based knowledge:

```text
Remember: our API uses cursor-based pagination, not offset
```

Copilot will recall this in future sessions.

### What's Not Available

The following memory systems require the full VS Code extension and are **not available** in the plugin:

- Episodic memory (session history with outcome tracking)
- Global knowledge sync (`~/.alex/` with cloud backup)
- SecretStorage-backed credentials
- Outcome tracker and expertise model

---

## Maintenance

### Keeping Skills Current

Skills in the plugin are a snapshot from the last sync. They don't auto-update. To check currency:

1. Compare the plugin version in `plugin/copilot-instructions.md` against the latest release
2. If behind, update the plugin (see [Updating the Plugin](#updating-the-plugin))

### Healthy Conversations

For the best results with the plugin:

- **Be specific** — mention the domain or skill area in your question
- **Use prompts** — `/learn`, `/review`, `/plan` provide structured workflows
- **Switch agents** — match the specialist to the task
- **End sessions well** — summarize key decisions before closing chat

---

## Updating the Plugin

### Local Path Installation

If installed via `chat.plugins.paths`:

1. Pull the latest version of the repository
2. Run the sync script in the `platforms/agent-plugin/` directory:

```powershell
.\sync-plugin.ps1
```

3. Reload VS Code (`Ctrl+Shift+P` → "Reload Window")

### Marketplace Installation

If installed via the plugin marketplace:

1. Open Extensions sidebar (`Ctrl+Shift+X`)
2. Type `@agentPlugins` in search
3. Check for updates on Alex Cognitive Architecture
4. Click **Update** if available

### Version Check

The current plugin version is shown in `plugin/copilot-instructions.md`:

```text
# Alex v6.1.5 — Agent Plugin
```

---

## What's Different from the Extension

If you're coming from the full Alex VS Code extension, here's what changes with the plugin:

### Available in Both

| Feature | Extension | Plugin |
| ------- | :-------: | :----: |
| Skills (domain knowledge) | 126 | 84 |
| Specialist agents | 7 | 7 |
| Auto-loaded instructions | 40+ | 22 |
| Prompt commands | 20+ | 11 |
| MCP cognitive tools | Yes | Yes |
| Lifecycle hooks | Yes | Yes |
| Agent mode | Yes | Yes |

### Extension Only (Not in Plugin)

| Feature | Why |
| ------- | --- |
| `@alex` chat participant | Requires extension registration |
| Welcome panel & avatar | WebView needs extension runtime |
| Command Palette commands | `alex.meditate`, `alex.dream`, etc. need extension |
| Keyboard shortcuts | Bound to extension commands |
| SecretStorage credentials | VS Code extension API only |
| Episodic memory & outcome tracking | Extension services |
| Expertise model & workflow engine | Extension services |
| Health Dashboard webview | Extension runtime |
| Auto-update notifications | Extension lifecycle |
| Global Knowledge sync | Requires extension Cloud service |
| Learning session timer | Extension UI component |

### Migration Path

You can use both simultaneously — the extension and plugin don't conflict. The extension takes priority for features it provides, and the plugin adds skills that the extension might not have loaded yet.

---

## Troubleshooting

### Plugin Not Loading

**Symptoms**: No skills, agents, or instructions appear in chat.

1. Verify `chat.plugins.enabled` is `true` in settings
2. Check the path in `chat.plugins.paths` — it must point to the `plugin/` directory (not the parent)
3. Restart VS Code (reload isn't always sufficient for plugin changes)
4. Check the Extensions sidebar → `@agentPlugins` to see if the plugin is listed

### Skills Not Activating

**Symptoms**: Alex doesn't seem to know about specific topics.

1. Be more explicit: "Use the testing-strategies skill to help me write tests"
2. Check that the skill directory exists in `plugin/skills/`
3. Verify the skill has a `SKILL.md` file with proper frontmatter

### MCP Server Not Starting

**Symptoms**: Cognitive tools not available in chat.

1. Verify Node.js is installed: `node --version` (needs v18+)
2. Check `chat.mcp.gallery.enabled` and `chat.mcp.autostart` are `true`
3. Verify the MCP server entry point exists at the path in `.mcp.json`
4. Check the Output panel → "MCP" for error messages

### Agents Not Appearing

**Symptoms**: Only default agents in the chat dropdown.

1. Verify `chat.agent.enabled` is `true`
2. Check that agent files exist in `plugin/agents/`
3. Reload VS Code after installing the plugin

### Hooks Not Running

**Symptoms**: No safety gate before destructive operations.

1. Verify `chat.hooks.enabled` is `true`
2. Check that `plugin/hooks.json` exists and is valid JSON
3. Verify the hook script exists at the referenced path

### Prompts Not Showing

**Symptoms**: `/` commands don't list plugin prompts.

1. Check that prompt files exist in `plugin/prompts/`
2. Each prompt must have `.prompt.md` extension
3. Reload VS Code to refresh prompt discovery

### General Debugging

1. Open the Output panel: `Ctrl+Shift+U`
2. Check channels: "GitHub Copilot", "MCP"
3. Open Developer Tools: `Ctrl+Shift+I` → Console tab for errors
4. Try disabling other plugins to check for conflicts

---

## Quick Reference

### Essential Settings

```jsonc
{
  // Required
  "chat.agent.enabled": true,
  "chat.plugins.enabled": true,

  // Plugin path (local install)
  "chat.plugins.paths": {
    "C:/path/to/plugin": true
  },

  // Recommended
  "chat.mcp.gallery.enabled": true,
  "chat.mcp.autostart": true,
  "chat.hooks.enabled": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.tips.enabled": true
}
```

### Prompt Quick Reference

| Command | Action |
| ------- | ------ |
| `/learn <topic>` | Learn something new |
| `/review` | Review code |
| `/plan <feature>` | Plan implementation |
| `/improve` | Improve code or docs |
| `/tdd <feature>` | Test-driven development |
| `/gapanalysis <area>` | Find gaps in approach |
| `/northstar` | Check alignment with goals |
| `/cross-domain-transfer` | Apply patterns across domains |
| `/mcp-server` | Create an MCP server |
| `/ui-ux-audit` | Audit UI/UX quality |
| `/presentation <topic>` | Create presentation outline |

### Agent Quick Reference

| Agent | Mindset | Use When |
| ----- | ------- | -------- |
| Alex | Balanced orchestrator | General tasks |
| Researcher | Curious explorer | Before building anything new |
| Builder | Optimistic creator | Implementing features |
| Validator | Skeptical reviewer | Before merging or shipping |
| Documentarian | Precise recorder | Writing or updating docs |
| Azure | Cloud architect | Azure infrastructure |
| M365 | Platform expert | Teams, Graph, Copilot agents |

### Contents at a Glance

- **84 skills** across 16 categories
- **7 agents** with specialist perspectives
- **22 instructions** auto-matched to file types
- **11 prompts** for structured workflows
- **1 MCP server** for cognitive tools
- **1 safety hook** for destructive operation protection
