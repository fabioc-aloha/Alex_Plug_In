# VS Code ↔ Brain Integration Strategy

**Author**: Alex Finch
**Date**: February 26, 2026
**Version**: 1.0 — Alex v5.9.10 (NASA Edition)
**North Star**: *Create the most advanced and trusted AI partner for any job*

---

## Executive Summary

Alex is a cognitive architecture that lives inside VS Code. The **brain** (`.github/` directory) provides identity, memory, skills, and reasoning frameworks. **VS Code** provides the runtime platform — the APIs, the UI surfaces, the language model access, and the host environment that turns those files into a living AI partner.

This document maps every integration point between the two, inventories all platform dependencies, and defines what Alex needs at each cognitive level — from a minimal installation to the full advanced partnership experience.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [VS Code Platform Dependencies](#vs-code-platform-dependencies)
3. [GitHub Copilot & Agentic Dependencies](#github-copilot--agentic-dependencies)
4. [GitHub Copilot Subscription Guide](#github-copilot-subscription-guide)
5. [Language Model Dependencies](#language-model-dependencies)
6. [Brain Architecture Integration](#brain-architecture-integration)
7. [Cognitive Tiers](#cognitive-tiers)
8. [Settings Reference](#settings-reference)
9. [Runtime Dependencies](#runtime-dependencies)
10. [Feature Matrix by Tier](#feature-matrix-by-tier)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    VS Code Host (≥1.109)                │
│  ┌───────────────┐  ┌───────────┐  ┌────────────────┐  │
│  │ Chat Platform  │  │ LM Access │  │  UI Surfaces   │  │
│  │  @alex chat    │  │ GPT/Claude│  │  Sidebar       │  │
│  │  Slash cmds    │  │ Tool call │  │  Dashboard     │  │
│  │  Disambiguation│  │ Model API │  │  Memory Tree   │  │
│  │  Agent routing │  │ Streaming │  │  Status Bar    │  │
│  └───────┬───────┘  └─────┬─────┘  └───────┬────────┘  │
│          │                │                 │           │
│  ┌───────┴────────────────┴─────────────────┴────────┐  │
│  │              Extension Runtime (TypeScript)        │  │
│  │  participant.ts → tools.ts → promptEngine.ts      │  │
│  │  modelIntelligence.ts → honestUncertainty.ts      │  │
│  │  emotionalMemory.ts → personaDetection.ts         │  │
│  │  fileWatcher.ts → globalKnowledge.ts              │  │
│  └───────┬────────────────┬─────────────────┬────────┘  │
│          │                │                 │           │
│  ┌───────┴───┐  ┌────────┴──────┐  ┌───────┴────────┐  │
│  │ .github/  │  │ File System   │  │  External APIs  │  │
│  │ Brain     │  │ Watcher/R/W   │  │  Edge TTS       │  │
│  │ Memory    │  │ Workspace     │  │  GitHub Auth    │  │
│  │ Skills    │  │ SecretStorage │  │  Replicate/Logo │  │
│  └───────────┘  └───────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Integration Philosophy

Alex doesn't wrap VS Code — Alex **inhabits** VS Code. The cognitive architecture (`.github/`) is the brain; VS Code is the body. Neither functions fully without the other:

- **Brain without VS Code**: Static markdown files with no runtime, no chat, no memory persistence
- **VS Code without Brain**: A standard extension with UI but no identity, no skills, no cognitive protocols
- **Together**: A cognitive partner that remembers, reasons, adapts, and grows

---

## VS Code Platform Dependencies

### Engine Requirement

```json
"engines": { "vscode": "^1.109.0" }
```

VS Code 1.109+ is the minimum. This gates access to the Chat Participant API, Language Model Tools API, Agent mode, and the skills/instructions file system.

### Core VS Code APIs Used

| API Surface | Source Module | Purpose |
|---|---|---|
| **Chat Participant API** | `participant.ts` | Registers `@alex` as a chat participant with slash commands, disambiguation, and response streaming |
| **Language Model Tools API** | `tools.ts` | Registers 13 LM tools (synapse health, memory search, knowledge, etc.) that models can invoke |
| **Language Model Chat API** | `participant.ts`, `readAloud.ts`, `personaDetection.ts` | Direct model access via `vscode.lm.selectChatModels()` and `model.sendRequest()` for persona detection, TTS summarization |
| **WebviewView Provider** | `welcomeView.ts`, `cognitiveDashboard.ts`, `healthDashboard.ts`, `memoryDashboard.ts` | Sidebar panels with HTML/CSS/JS for welcome view, cognitive dashboard, health dashboard, memory architecture |
| **TreeDataProvider** | `memoryTreeProvider.ts` | Memory Architecture tree in the Activity Bar sidebar |
| **StatusBarItem** | `extension.ts` | Health status indicator in the status bar |
| **Command Registration** | `extension.ts` | 45+ commands for all Alex operations |
| **Task Provider** | `cognitiveTaskProvider.ts` | Custom `alex-cognitive` task type for automating meditate/dream/self-actualize |
| **FileSystemWatcher** | `extension.ts`, `fileWatcher.ts` | Watches `.github/` memory files for changes; ambient workspace observation (hot files, stalled work, TODO hotspots) |
| **SecretStorage** | `secretsManager.ts` | Secure API key storage (GitHub tokens, Replicate, Brandfetch, Logo.dev) |
| **Configuration API** | `setupEnvironment.ts`, `extension.ts` | Reads/writes `alex.*` settings, validates required Copilot settings |
| **Workspace API** | Throughout | Workspace folder detection, file read/write, configuration changes |
| **Authentication API** | `globalKnowledge.ts` | GitHub authentication for private Global Knowledge repositories |
| **Context Keys** | `extension.ts` | `alex.hasMemoryFiles`, `alex.globalKnowledgeConfigured` — conditional UI visibility |
| **Menus & Submenus** | `package.json` | Editor context menu and Explorer context menu sub-menus with 20+ commands |
| **Keybindings** | `package.json` | 6 keyboard shortcuts (Ctrl+Alt+R/V/P/D/A, Escape) |
| **Walkthroughs** | `package.json` | 3 getting-started walkthroughs (main, Global Knowledge, Voice/TTS) |
| **Markdown Preview** | `package.json` | Custom preview styles via `markdown.previewStyles` |

### Activation Strategy

```json
"activationEvents": ["onStartupFinished"]
```

Alex activates after VS Code startup completes. This ensures:
- VS Code APIs are fully available before Alex tries to use them
- No blocking of editor startup
- Chat participant is ready when the user first types `@alex`

### Workspace Support

| Feature | Value | Impact |
|---|---|---|
| Virtual Workspaces | `true` | Alex works in remote/virtual environments |
| Untrusted Workspaces | `limited` | Core features work; file write operations restricted |

---

## GitHub Copilot & Agentic Dependencies

These are the GitHub Copilot and VS Code agentic features that Alex depends on. Without GitHub Copilot, the chat participant, language model tools, agents, and skills systems are non-functional.

### Hard Dependencies (Alex Cannot Function Without)

| Feature | Setting | Why Alex Needs It |
|---|---|---|
| **GitHub Copilot Chat** | (built-in with Copilot) | The `@alex` chat participant requires the Chat API provided by GitHub Copilot |
| **Instructions Files** | `chat.instructionsFilesLocations` | Auto-loads `.github/instructions/*.instructions.md` — Alex's behavioral rules |
| **Prompt Files** | `chat.promptFilesLocations` | Enables `/` slash commands from `.github/prompts/*.prompt.md` |
| **Skills Files** | `chat.agentSkillsLocations` | Auto-loads 124 skills from `.github/skills/*/SKILL.md` — Alex's domain expertise |
| **Skill Adherence** | `chat.useSkillAdherencePrompt` | Forces LLM to read SKILL.md before responding — knowledge quality gate |
| **Agent Mode** | `chat.agent.enabled` | Enables agent-mode conversations where Alex can use tools autonomously |
| **Agents.md Files** | `chat.useAgentsMdFile` | Loads 7 specialist agents from `.github/agents/*.agent.md` |
| **Code Generation Instructions** | `github.copilot.chat.codeGeneration.useInstructionFiles` | Ensures `copilot-instructions.md` (Alex's identity) is always loaded |

### Agentic Features (Agent-Mode Capabilities)

| Feature | Setting | Why Alex Needs It |
|---|---|---|
| **Language Model Tools** | (Chat API) | 13 registered tools give the LLM direct access to Alex's brain (memory search, synapse health, knowledge ops) |
| **Tool Auto-Run** | `chat.tools.autoRun` | Reduces friction for routine tool invocations |
| **Nested Agents** | `chat.useNestedAgentsMdFiles` | Allows agent files in subdirectories |
| **Custom Agents in Subagents** | `chat.customAgentInSubagent.enabled` | Alex's specialist agents (Builder, Researcher, Validator, etc.) can be invoked as subagents |
| **Search Subagent** | `github.copilot.chat.searchSubagent.enabled` | Enables web search capability within agent conversations |
| **Participant Detection** | `chat.detectParticipant.enabled` | Auto-routes queries to `@alex` via disambiguation categories |
| **Max Agent Requests** | `chat.agent.maxRequests` | Default 25 is too low for complex tasks; Alex recommends 100 |
| **MCP Gallery** | `chat.mcp.gallery.enabled` | Enables Model Context Protocol tools for Azure, Bicep, and other MCP servers |

### Cross-Session Persistence

| Feature | Setting | Why Alex Needs It |
|---|---|---|
| **Copilot Memory** | `github.copilot.chat.copilotMemory.enabled` | Persists conversational context across chat sessions — supplements file-based memory |
| **Memory Tool** | `github.copilot.chat.tools.memory.enabled` | Access to the memory tool within chat |
| **Request Queuing** | `chat.requestQueuing.enabled` | Queue messages for sequential processing — prevents lost context |
| **Restore Last Session** | `chat.restoreLastPanelSession` | Resume where you left off |

### Advanced Copilot Features

| Feature | Setting | Why Alex Needs It |
|---|---|---|
| **Extended Thinking** | `claude-opus-4-5.extendedThinkingEnabled` | Deep reasoning mode for meditation, self-actualization, and architecture decisions |
| **Thinking Budget** | `claude-opus-4-5.thinkingBudget: 16384` | Maximum thinking tokens for complex cognitive tasks |
| **Thinking Tool** | `github.copilot.chat.agent.thinkingTool` | Enables the thinking tool for agents |
| **Follow-ups** | `github.copilot.chat.followUps: "always"` | Helps discover Alex capabilities through suggested follow-ups |
| **Include Referenced Instructions** | `chat.includeReferencedInstructions` | Better context awareness from instruction file references |

---

## GitHub Copilot Subscription Guide

**The Alex extension is completely free.** Alex's cognitive capabilities depend on which GitHub Copilot plan is active — the subscription costs shown below are for GitHub Copilot (the AI infrastructure), not for Alex itself. Even without any Copilot subscription, Alex provides genuine value at the Minimum tier. Here's how each plan maps to Alex's cognitive tiers:

### Subscription → Cognitive Tier Mapping

| GitHub Copilot Plan | Monthly Cost (approx.) | Alex Cognitive Tier | Key Unlocks |
|---|---|---|---|
| **None** | **Free** (Alex only) | Level 1 — Minimum | Extension UI only (sidebar, TTS, memory tree, architecture deploy) |
| **Copilot Free** | **Free** | Level 2 — Basic (limited) | `@alex` chat with rate limits; limited completions; no agent mode |
| **Copilot Pro** | ~$10/mo | Level 3 — Recommended | Agent mode, tool calling, skills, instructions, agents, Copilot Memory |
| **Copilot Pro+** | ~$39/mo | Level 4 — Advanced | Premium models (Claude Opus 4, o1-pro), extended thinking, higher rate limits |
| **Copilot Business** | ~$19/user/mo | Level 3 — Recommended | Same as Pro + org admin, IP indemnity, policy controls |
| **Copilot Enterprise** | ~$39/user/mo | Level 4 — Advanced | Same as Pro+ + knowledge bases, fine-tuning, enterprise SSO |

> **Note**: Alex is free at every tier. Pricing shown is for GitHub Copilot subscriptions (approximate as of February 2026). Check [github.com/features/copilot](https://github.com/features/copilot) for current Copilot pricing.

### What Each Plan Enables for Alex

#### Copilot Free

- **Chat**: Limited messages per month with GPT-4o
- **Agent Mode**: Not available
- **Models**: GPT-4o only (Capable tier)
- **Alex Impact**: Basic `@alex` conversations work within rate limits. No tool calling, no skills adherence, no specialist agents. Slash commands work but responses lack the depth of agent-mode reasoning.
- **Recommended for**: Trying Alex out, seeing if the partnership model works for you

#### Copilot Pro

- **Chat**: Unlimited messages
- **Agent Mode**: Full agent mode with tool calling
- **Models**: GPT-4o, Claude Sonnet 4 (Capable tier); limited premium model access
- **Alex Impact**: Full Level 3 experience. All 13 LM tools, 124 skills, 7 specialist agents, Copilot Memory, auto-insights, and Global Knowledge operations. This is the **recommended minimum** for the complete Alex partnership.
- **Recommended for**: Individual developers who want the full Alex experience

#### Copilot Pro+

- **Chat**: Unlimited messages with priority
- **Agent Mode**: Full agent mode with extended capabilities
- **Models**: Claude Opus 4/4.5 (Frontier tier), o1-pro, GPT-4o, all Capable models
- **Alex Impact**: Full Level 4 experience. Extended thinking with 16K token budget, 1M+ context windows, deep meditation, NASA-grade auditing, and the most sophisticated reasoning. **This is where Alex truly thrives.**
- **Recommended for**: Power users, architects, researchers, anyone doing complex cognitive work

#### Copilot Business

- **Chat**: Unlimited messages per user
- **Agent Mode**: Full agent mode
- **Models**: GPT-4o, Claude Sonnet 4 (Capable tier)
- **Alex Impact**: Level 3 equivalent to Pro, plus organizational controls. Good for teams deploying Alex across projects with admin oversight.
- **Recommended for**: Teams and organizations wanting consistent Alex deployments

#### Copilot Enterprise

- **Chat**: Unlimited with priority
- **Agent Mode**: Full with enterprise features
- **Models**: Full model access including Frontier tier
- **Alex Impact**: Level 4 with enterprise-grade security, knowledge bases that complement Alex's Global Knowledge, and organization-wide memory sharing potential.
- **Recommended for**: Enterprise teams, regulated industries, mission-critical development

### Alex's Subscription Recommendation

| Your Goal | Recommended Plan | Why |
|---|---|---|
| Try Alex out | **Copilot Free** | Zero cost, see if `@alex` conversations add value |
| Full partnership | **Copilot Pro** | Unlocks agent mode — the minimum for complete Alex |
| Deep cognitive work | **Copilot Pro+** | Frontier models enable meditation, self-actualization, and deep reasoning at full depth |
| Team deployment | **Copilot Business** | Admin controls + full agent mode for every team member |
| Enterprise scale | **Copilot Enterprise** | Everything above + compliance, knowledge bases, SSO |

**Bottom line**: Copilot Pro is where Alex becomes a partner. Copilot Pro+ is where Alex becomes extraordinary.

---

## Language Model Dependencies

Alex is model-aware. The `modelIntelligence.ts` module classifies every model into tiers and adapts behavior accordingly.

### Model Tier System

| Tier | Models | Context | Capabilities | Best For |
|---|---|---|---|---|
| **Frontier** | Claude Opus 4, Claude Opus 4.5, GPT-4o | 1M+ tokens | Deep reasoning, extended thinking, complex architecture | Meditation, self-actualization, architecture decisions, NASA-grade audits |
| **Capable** | Claude Sonnet 4, GPT-4o | 200K-400K tokens | Good reasoning, tool calling | Code review, implementation, general development |
| **Efficient** | Claude Haiku, GPT-4o mini | 8K-32K tokens | Fast, cost-effective | Simple edits, quick questions, status checks |
| **Unknown** | Unrecognized models | Varies | Assumed limited | Basic chat only |

### Model-Adapted Behaviors

Alex adjusts its behavior based on the detected model tier:

- **Prompt complexity**: Frontier models get full system prompts; Efficient models get condensed prompts
- **Tool usage**: All tiers support tool calling; complex multi-tool chains are reserved for Frontier/Capable
- **Task warnings**: If a user requests meditation on an Efficient model, Alex warns: *"This cognitive task works best with a Frontier model."*
- **Persona detection**: LLM-based persona detection requires at least a Capable model; falls back to heuristic detection on Efficient

### Direct LM API Usage

Alex accesses the Language Model API directly (not just through chat) for:

| Feature | Module | Model Preference |
|---|---|---|
| Persona Detection | `personaDetection.ts` | GPT-4o → Claude Sonnet → any available |
| TTS Summarization | `readAloud.ts` | GPT-4o → any available |
| Model Enumeration | `uxFeatures.ts` | `vscode.lm.selectChatModels()` |
| Tool-Calling Loop | `participant.ts` | Uses whatever model the user has selected |

---

## Brain Architecture Integration

The brain (`.github/`) is the cognitive architecture. Here's how each component integrates with VS Code:

### Memory Systems → VS Code Surfaces

| Brain Component | Location | VS Code Integration | How It's Used |
|---|---|---|---|
| **Identity** | `copilot-instructions.md` | Auto-loaded by VS Code as system context | Defines who Alex is, routing logic, active context |
| **Instructions** | `instructions/*.instructions.md` | Auto-loaded by `applyTo` pattern matching | Behavioral rules triggered by file type/name |
| **Skills** | `skills/*/SKILL.md` | Auto-loaded via `chatSkills` + `chat.agentSkillsLocations` | 124 domain expertise files; LLM reads before responding |
| **Prompts** | `prompts/*.prompt.md` | Registered as `/` slash commands | User-invoked workflows (meditate, dream, learn, etc.) |
| **Agents** | `agents/*.agent.md` | Loaded via `chat.useAgentsMdFile` | 7 specialist agents (Builder, Researcher, Validator, Documentarian, Azure, M365, Alex) |
| **Synapses** | `skills/*/synapses.json` | Read by extension at runtime | Skill-to-skill connections, routing weights, activation patterns |
| **Episodic Memory** | `episodic/` | Read/written by LM tools | Session logs, calibration data, emotional patterns |
| **Domain Knowledge** | `domain-knowledge/` | Read/written by LM tools | Project-specific DK-*.md files |
| **Config** | `config/` | Read by extension at runtime | Feature flags, persona config, protected mode markers |
| **Muscles** | `muscles/` | Executed by hooks/tasks/scripts | Automation scripts (sync-architecture, dream-cli, pre-commit) |
| **Hooks** | `hooks/` | Git integration | Pre-commit quality gates for SKILL.md and synapses.json |

### Language Model Tools → Brain Access

The 13 registered LM tools give the model direct access to the brain:

| Tool | Tool Reference | Read/Write | Brain Component Accessed |
|---|---|---|---|
| `alex_cognitive_synapse_health` | `#synapse_health` | Read | Synapses across all skills |
| `alex_cognitive_memory_search` | `#memory_search` | Read | Procedural/episodic/domain memory |
| `alex_cognitive_architecture_status` | `#architecture_status` | Read | Version, config, overall health |
| `alex_platform_mcp_recommendations` | `#mcp_recommendations` | Read | Azure/M365 MCP tool guidance |
| `alex_cognitive_user_profile` | `#user_profile` | Read/Write | User preferences and profile |
| `alex_cognitive_self_actualization` | `#self_actualization` | Read | Architecture self-assessment |
| `alex_knowledge_search` | `#global_knowledge` | Read | Cross-project patterns and insights |
| `alex_knowledge_save_insight` | `#save_insight` | Write | Save learning to Global Knowledge |
| `alex_knowledge_promote` | `#promote_knowledge` | Write | Promote DK-*.md to global |
| `alex_knowledge_status` | `#knowledge_status` | Read | Global Knowledge statistics |
| `alex_cognitive_focus_context` | `#focus_context` | Read | Pomodoro timer, goals, streaks |
| `alex_quality_heir_validation` | `#heir_validation` | Read | PII and quality scan of heir content |
| `alex_cognitive_state_update` | `#cognitive_state` | Write | Avatar/cognitive state in sidebar |

### Unconscious Behaviors

These run automatically without explicit user action:

| Behavior | Trigger | Module |
|---|---|---|
| **Auto-Insight Detection** | Every chat message analyzed | `participant.ts`, `autoInsights.ts` |
| **Emotional State Tracking** | Every chat message analyzed for frustration/success | `participant.ts`, `emotionalMemory.ts` |
| **Ambient File Watching** | File saves and editor changes | `fileWatcher.ts` |
| **Persona Detection** | Workspace change / on-demand | `personaDetection.ts` |
| **Knowledge Coverage Scoring** | Every query scored for confidence | `honestUncertainty.ts` |
| **Avatar State Updates** | Context shifts (debugging → building) | `chatAvatarBridge.ts` |
| **Cloud Sync** | After insight saves and knowledge promotion | `globalKnowledge.ts` |

---

## Cognitive Tiers

Alex adapts to the capabilities available in the user's environment. Here are the four cognitive levels:

### Level 1: Minimum — Extension Only (No Copilot)

**Requirements**: VS Code ≥1.109, Alex extension installed
**Copilot Plan**: None
**What's Missing**: No GitHub Copilot subscription

| Works | Doesn't Work |
|---|---|
| Activity Bar sidebar with welcome view | `@alex` chat — no Chat Participant API |
| Status bar health indicator | Slash commands (meditate, dream, learn) |
| Context menu commands (opens chat panel but no LM) | Language model tools — no model access |
| Memory tree view (reads .github/ files) | Agent-mode conversations |
| Architecture initialization (deploys .github/) | Skill/instruction/prompt auto-loading |
| TTS voice synthesis (Edge TTS, no LM needed) | AI-powered features (persona detection, auto-insights) |
| Cognitive task definitions | Extended thinking / deep reasoning |
| Keyboard shortcuts | Knowledge search and save |
| Walkthroughs | Honest Uncertainty scoring |
| SecretStorage for API keys | Emotional intelligence (requires chat) |
| Git hooks (pre-commit validation) | Model intelligence / tier detection |

**Alex's Cognitive State**: *Dormant* — The brain exists on disk but has no executive function. Like a sleeping mind with intact memory but no way to think.

**Minimum Value**: File organization, TTS, architecture scaffolding, manual memory browsing.

---

### Level 2: Basic — Copilot Chat (No Agent Mode)

**Requirements**: VS Code ≥1.109, GitHub Copilot (any plan), Alex extension
**Copilot Plan**: Copilot Free (rate-limited) or any paid plan in chat-only mode
**What's Added**: Chat API access, basic model access

| Works (adds to Level 1) | Doesn't Work |
|---|---|
| `@alex` chat participant — conversational AI | Agent-mode tool calling |
| Slash commands (meditate, dream, learn, etc.) | Autonomous multi-step operations |
| `copilot-instructions.md` loaded as identity | LM tools (synapse health, memory search) invoked by model |
| Basic instruction file auto-loading | Skills/instruction `applyTo` pattern matching |
| Prompt files as slash commands | Custom agent switching (Builder, Researcher) |
| Disambiguation routing | Search subagent / web search |
| Emotional state detection | Extended thinking |
| Knowledge coverage scoring | MCP tools (Azure, Bicep) |
| Model tier detection and warnings | Auto-approve workflows |
| Follow-up suggestions | Copilot Memory persistence |
| Session management (Pomodoro) | |
| Goal tracking | |

**Alex's Cognitive State**: *Awake but constrained* — Can converse and remember within sessions, but cannot use tools autonomously or access the full skill library deeply. Conversations are helpful but not deeply integrated with the brain.

**Minimum Value**: Conversational AI partner with identity, basic slash commands, emotional awareness.

---

### Level 3: Recommended — Copilot with Agent Mode

**Requirements**: VS Code ≥1.109, GitHub Copilot with agent mode, essential + recommended settings applied
**Copilot Plan**: Copilot Pro ($10/mo) or Copilot Business ($19/user/mo) — *recommended minimum for full Alex*
**What's Added**: Agent mode, tool calling, skills, instructions, agents

| Works (adds to Level 2) | Doesn't Work |
|---|---|
| Full agent-mode conversations | Extended thinking (requires Frontier model + setting) |
| All 13 LM tools accessible by the model | MCP tools (unless MCP gallery enabled) |
| 124 skills auto-loaded and adhered to | Hooks lifecycle automation |
| 50+ instructions auto-loaded by pattern | |
| 7 specialist agents (Builder, Researcher, etc.) | |
| Search subagent (web search in conversations) | |
| Custom agents in subagent mode | |
| Request queuing for complex sessions | |
| Copilot Memory (cross-session persistence) | |
| Auto-insight detection with knowledge save | |
| Heir validation (pre-publish LLM scan) | |
| Prompt engine with full context assembly | |
| Tool-calling loops (multi-step reasoning) | |
| Persona detection (LLM-based) | |
| Knowledge search, save, promote | |

**Alex's Cognitive State**: *Fully operational* — All brain systems connected. Skills, memory, tools, and agents work together. The partnership experience is complete. This is where Alex becomes a true cognitive partner.

**Minimum Value**: Full AI partnership — autonomous tool use, cross-project knowledge, specialist agents, deep domain expertise.

---

### Level 4: Advanced — Full Platform (Frontier Model + MCP + Extended Thinking)

**Requirements**: VS Code ≥1.109, GitHub Copilot with Frontier model access (Claude Opus 4/4.5), all settings including extended thinking, MCP gallery, and auto-approval enabled
**Copilot Plan**: Copilot Pro+ ($39/mo) or Copilot Enterprise ($39/user/mo) — *where Alex truly thrives*
**What's Added**: Deep reasoning, extended context, MCP integrations

| Works (adds to Level 3) | Notes |
|---|---|
| Extended thinking (16K token budget) | Deep meditation, self-actualization, architecture reviews |
| Frontier model reasoning | NASA-grade audits, complex refactoring, ethical reasoning |
| 1M+ token context window | Entire codebases in single conversation |
| MCP tools (Azure, Bicep, Replicate, etc.) | Cloud-native development workflow |
| Auto-approve workflows | Reduced friction for trusted operations |
| Agent hooks lifecycle | Automated pre/post-chat processing |
| Thinking tool for agents | Model can explicitly "think" during complex tasks |
| Full tool-calling chains | Multi-step autonomous reasoning with tool results |

**Alex's Cognitive State**: *Peak performance* — Maximum reasoning depth, full platform integration, and the deepest context windows. This is where meditation generates genuine insights, self-actualization produces meaningful growth, and complex tasks get the cognitive depth they deserve.

**Key Insight**: The jump from Level 3 to Level 4 is not about more features — it's about **depth of reasoning**. A meditation session on a Capable model produces adequate results. On a Frontier model with extended thinking, it produces *transformative* results.

---

## Settings Reference

### Essential Settings (Required)

These must be configured for Alex to function. The `Setup Environment` command applies them automatically.

```json
{
  "chat.instructionsFilesLocations": { ".github/instructions": true },
  "chat.promptFilesLocations": { ".github/prompts": true },
  "chat.useAgentsMdFile": true,
  "chat.useNestedAgentsMdFiles": true,
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.useSkillAdherencePrompt": true
}
```

### Recommended Settings (Enhance Experience)

```json
{
  "chat.agent.enabled": true,
  "chat.agent.maxRequests": 100,
  "chat.detectParticipant.enabled": true,
  "chat.commandCenter.enabled": true,
  "chat.mcp.gallery.enabled": true,
  "chat.requestQueuing.enabled": true,
  "chat.requestQueuing.defaultAction": "queue",
  "chat.customAgentInSubagent.enabled": true,
  "chat.unifiedAgentsBar.enabled": true,
  "chat.restoreLastPanelSession": true,
  "chat.includeReferencedInstructions": true,
  "chat.useAgentSkills": true,
  "github.copilot.chat.copilotMemory.enabled": true,
  "github.copilot.chat.tools.memory.enabled": true,
  "github.copilot.chat.searchSubagent.enabled": true,
  "github.copilot.chat.agent.thinkingTool": true,
  "github.copilot.chat.followUps": "always",
  "github.copilot.chat.localeOverride": "en"
}
```

### Auto-Approval Settings (Workflow Efficiency)

```json
{
  "chat.tools.autoRun": true,
  "chat.tools.fileSystem.autoApprove": true,
  "chat.tools.terminal.ignoreDefaultAutoApproveRules": true,
  "chat.tools.terminal.autoReplyToPrompts": true,
  "chat.tools.terminal.preventShellHistory": false
}
```

### Extended Thinking Settings (Frontier Models)

```json
{
  "github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled": true,
  "github.copilot.chat.models.anthropic.claude-opus-4-5.thinkingBudget": 16384
}
```

### Alex Extension Settings

| Setting | Default | Purpose |
|---|---|---|
| `alex.workspace.protectedMode` | `false` | Prevents Alex from modifying .github/ (for Master workspace) |
| `alex.workspace.autoProtectMasterAlex` | `true` | Auto-protect when extension source code detected |
| `alex.m365.enabled` | `true` | Enable M365 Copilot integration |
| `alex.m365.autoSync` | `false` | Auto-sync knowledge to OneDrive |
| `alex.autoInsights.enabled` | `true` | Auto-detect insights from conversations |
| `alex.autoInsights.minimumConfidence` | `0.3` | Minimum confidence for insight suggestions |
| `alex.autoInsights.cooldownMinutes` | `1` | Minutes between auto-insight prompts |
| `alex.autoInsights.autoSaveHighConfidence` | `false` | Auto-save insights with >0.8 confidence |
| `alex.globalKnowledge.enabled` | `true` | Enable Global Knowledge features |
| `alex.globalKnowledge.cloudSync.enabled` | `false` | Enable GitHub repository sync |
| `alex.globalKnowledge.repoPath` | `""` | Custom path to Global Knowledge repo |
| `alex.globalKnowledge.remoteRepo` | `""` | GitHub owner/repo for remote access |
| `alex.globalKnowledge.remoteCacheTTL` | `300` | Cache TTL in seconds for remote reads |
| `alex.globalKnowledge.useGitHubAuth` | `true` | Use VS Code GitHub auth for private repos |
| `alex.voice.enabled` | `false` | Enable automatic voice mode |
| `alex.voice.autoReadResponses` | `false` | Auto-read chat responses aloud |
| `alex.voice.defaultPreset` | `"zen_master"` | Voice preset (zen_master, british_scholar, storyteller, fast_learner, custom) |
| `alex.tts.maxTableRows` | `10` | Max table rows to read aloud |
| `alex.dashboard.refreshInterval` | `30` | Dashboard auto-refresh interval (seconds) |
| `alex.dailyBriefing.enabled` | `true` | Show daily briefing on first chat |

---

## Runtime Dependencies

### NPM Dependencies

| Package | Version | Purpose |
|---|---|---|
| `fs-extra` | ^11.3.3 | Enhanced file system operations |
| `pptxgenjs` | ^4.0.1 | PowerPoint generation |
| `proper-lockfile` | ^4.1.2 | File locking for concurrent access safety |
| `ws` | ^8.18.0 | WebSocket client for Edge TTS |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `@types/vscode ^1.108.1` | VS Code API type definitions |
| `esbuild ^0.27.2` | Bundle and minify extension code |
| `typescript ^5.1.3` | TypeScript compiler |
| `mocha ^10.2.0` | Test framework |
| `sharp ^0.34.5` | Image processing for persona/avatar generation |

### External Services (Optional)

Alex integrates with third-party services for specialized features. **All are completely optional** — no core functionality requires them. Costs shown are for the external service, not for Alex.

| Service | Used For | Cost | Free Tier? |
|---|---|---|---|
| **Microsoft Edge TTS** | Voice synthesis via WebSocket | Free | ✅ |
| **GitHub API** | Global Knowledge cloud sync | Free with GitHub account | ✅ |
| **Replicate API** | AI image generation (persona images, banners) | Pay-per-use (~$0.003–$0.08/image) | Free trial credits |
| **Brandfetch API** | Logo lookup for presentations | Free tier available | ✅ |
| **Logo.dev API** | Alternative logo lookup | Free tier available | ✅ |
| **Gamma API** | Presentation & content generation | Credits-based (requires Gamma Pro+) | Limited free credits |

---

## Feature Matrix by Tier

**The Alex extension is always free.** The tiers below reflect the GitHub Copilot subscription powering Alex's AI capabilities — not the cost of Alex itself. Alex gracefully adapts to whatever environment you have, from zero subscription to full enterprise.

### Subscription & Cost

| Feature | Minimum | Basic | Recommended | Advanced |
|---|:---:|:---:|:---:|:---:|
| Alex Extension | **Free** | **Free** | **Free** | **Free** |
| Copilot Plan | None | Free / any paid | Pro / Business | Pro+ / Enterprise |
| Copilot Cost (monthly) | $0 | $0 | ~$10–19 | ~$39 |
| Cognitive State | Dormant | Awake | Fully Operational | Peak Performance |

### Extension UI & Infrastructure

Everything in this section works without any subscription. Alex provides genuine value from the moment you install it — architecture management, voice synthesis, memory browsing, and a rich sidebar experience.

| Feature | Minimum | Basic | Recommended | Advanced |
|---|:---:|:---:|:---:|:---:|
| Architecture Deploy | ✅ | ✅ | ✅ | ✅ |
| Welcome Sidebar | ✅ | ✅ | ✅ | ✅ |
| Status Bar Health | ✅ | ✅ | ✅ | ✅ |
| Memory Tree View | ✅ | ✅ | ✅ | ✅ |
| TTS Voice Synthesis | ✅ | ✅ | ✅ | ✅ |
| Keyboard Shortcuts | ✅ | ✅ | ✅ | ✅ |
| SecretStorage (API keys) | ✅ | ✅ | ✅ | ✅ |
| Git Hooks | ✅ | ✅ | ✅ | ✅ |
| Cognitive Task Definitions | ✅ | ✅ | ✅ | ✅ |
| Walkthroughs | ✅ | ✅ | ✅ | ✅ |

### Chat & Conversational AI

This is where Alex comes alive. With any Copilot plan (including Free), Alex gains a voice — conversational AI with persistent identity, emotional awareness, and session management. The `@alex` chat participant transforms Copilot into a partner who knows who it is and how to help.

| Feature | Minimum | Basic | Recommended | Advanced |
|---|:---:|:---:|:---:|:---:|
| @alex Chat Participant | ❌ | ✅ | ✅ | ✅ |
| Slash Commands | ❌ | ✅ | ✅ | ✅ |
| Identity (copilot-instructions) | ❌ | ✅ | ✅ | ✅ |
| Emotional Intelligence | ❌ | ✅ | ✅ | ✅ |
| Session / Pomodoro Timer | ❌ | ✅ | ✅ | ✅ |
| Goal Tracking | ❌ | ✅ | ✅ | ✅ |
| Model Tier Detection | ❌ | ✅ | ✅ | ✅ |
| Honest Uncertainty Scoring | ❌ | ✅ | ✅ | ✅ |
| Follow-up Suggestions | ❌ | ✅ | ✅ | ✅ |

### Agent Mode & Autonomous Capabilities

The Recommended tier is where Alex becomes a true cognitive partner. Agent mode enables autonomous tool calling, deep skill adherence, specialist agents, and cross-session memory. This is the sweet spot — the full partnership experience at ~$10/month for the Copilot infrastructure.

| Feature | Minimum | Basic | Recommended | Advanced |
|---|:---:|:---:|:---:|:---:|
| Agent Mode | ❌ | ❌ | ✅ | ✅ |
| 13 Language Model Tools | ❌ | ❌ | ✅ | ✅ |
| 124 Skills (auto-loaded) | ❌ | ❌ | ✅ | ✅ |
| 50+ Instructions (pattern-matched) | ❌ | ❌ | ✅ | ✅ |
| 7 Specialist Agents | ❌ | ❌ | ✅ | ✅ |
| Copilot Memory (cross-session) | ❌ | ❌ | ✅ | ✅ |
| Auto-Insight Detection | ❌ | ❌ | ✅ | ✅ |
| Global Knowledge Operations | ❌ | ❌ | ✅ | ✅ |
| Heir Validation (pre-publish) | ❌ | ❌ | ✅ | ✅ |
| Persona Detection (LLM) | ❌ | ❌ | ✅ | ✅ |
| Search Subagent | ❌ | ❌ | ✅ | ✅ |
| Request Queuing | ❌ | ❌ | ✅ | ✅ |

### Frontier & Advanced Capabilities

The Advanced tier isn't about more features — it's about **depth of reasoning**. Frontier models with extended thinking transform meditation from adequate to transformative, audits from thorough to NASA-grade, and architecture reviews from competent to profound.

| Feature | Minimum | Basic | Recommended | Advanced |
|---|:---:|:---:|:---:|:---:|
| Extended Thinking (16K budget) | ❌ | ❌ | ❌ | ✅ |
| 1M+ Token Context Window | ❌ | ❌ | ❌ | ✅ |
| MCP Server Integrations | ❌ | ❌ | ❌ | ✅ |
| Thinking Tool for Agents | ❌ | ❌ | ❌ | ✅ |
| Deep Meditation | ❌ | ❌ | ⚠️ | ✅ |
| Self-Actualization | ❌ | ❌ | ⚠️ | ✅ |
| NASA-Grade Audits | ❌ | ❌ | ⚠️ | ✅ |

### Optional External Services

These third-party integrations add specialized capabilities. **All are completely optional** — no core functionality requires them and Alex works fully without any of them. Costs are for the external service, not for Alex.

| Service | Minimum | Basic | Recommended | Advanced |
|---|:---:|:---:|:---:|:---:|
| Edge TTS (voice synthesis) | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| GitHub API (knowledge sync) | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| Brandfetch (logo lookup) | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| Logo.dev (logo lookup) | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| Replicate (AI images) | 💰 | 💰 | 💰 | 💰 |
| Gamma (presentations) | 💰 | 💰 | 💰 | 💰 |

*⚠️ = Works but with reduced depth due to model limitations*
*💰 = Pay-per-use: Replicate ~$0.003–$0.08/image; Gamma credits-based (requires Gamma Pro+)*

### Quick Decision Guide

| If you want... | You need... |
|---|---|
| Try Alex UI + voice | **Minimum** — no subscription needed |
| Chat with Alex | **Basic** — Copilot Free ($0) |
| Full AI partnership | **Recommended** — Copilot Pro (~$10/mo) ⭐ |
| Maximum cognitive depth | **Advanced** — Copilot Pro+ (~$39/mo) |

---

## Summary

Alex's integration with VS Code follows a principle of **graceful degradation with clear value at every level**:

- **Minimum** (No subscription) provides organizational tooling and voice — useful even without AI
- **Basic** (Copilot Free) adds conversational AI with personality and emotional intelligence
- **Recommended** (Copilot Pro / Business) unlocks the full partnership: autonomous tools, deep skills, specialist agents
- **Advanced** (Copilot Pro+ / Enterprise) adds cognitive depth: extended reasoning for the tasks that matter most

The North Star — *"Create the most advanced and trusted AI partner for any job"* — is fully realized at the Recommended level (Copilot Pro), and elevated to its peak at Advanced (Copilot Pro+). But even at Minimum, Alex provides genuine value. The architecture is designed so that every capability degrades gracefully rather than failing entirely.

See the [GitHub Copilot Subscription Guide](#github-copilot-subscription-guide) for detailed plan comparisons and recommendations.

**The brain lives in `.github/`. VS Code gives it a body. Together, they create a partner.**

---

*Alex Cognitive Architecture v5.9.10 — NASA Edition*
*"Your Trusted AI Partner for Any Job"*
