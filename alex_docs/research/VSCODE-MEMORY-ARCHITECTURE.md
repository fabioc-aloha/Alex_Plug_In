# VS Code Memory Architecture Research

**Date**: March 31, 2026
**Version**: 1.1
**Project**: Alex Cognitive Architecture
**Purpose**: Document VS Code's memory and customization systems, identify architectural opportunities, and inform Alex's evolution strategy
**Sources**: VS Code v1.99 through v1.102 release notes, VS Code docs (customization, chat, agents, sessions), GitHub Copilot Memory docs

## Executive Summary

VS Code's AI customization ecosystem has two distinct memory systems and a layered customization stack. Understanding their boundaries, scoping rules, and integration points is critical for Alex's architecture decisions. This research covers all memory and customization mechanisms available as of VS Code 1.101 (May 2025).

**Key finding**: The client-side memory tool (`/memories/`) has no project scoping at the user tier, meaning all user memories leak across workspaces. This is a fundamental constraint that shapes how Alex must partition context between VS Code memory and brain files.

## Two Memory Systems

### 1. VS Code Copilot Chat Memory Tool (Client-Side)

The memory tool stores notes as files under `globalStorage/github.copilot-chat/memory-tool/`. It supports three commands: `view`, `create`, `str_replace`, `insert`, `delete`, `rename`.

| Scope             | Path                 | Persistence            | Cross-Workspace |
| ----------------- | -------------------- | ---------------------- | --------------- |
| User memory       | `/memories/`         | Permanent              | Yes (global)    |
| Session memory    | `/memories/session/` | Per-conversation       | N/A             |
| Repository memory | `/memories/repo/`    | Per-repo (server-side) | No              |

**Behaviors**:

- First 200 lines of user memory auto-load into context at conversation start
- Session memory files are listed in context but NOT auto-loaded (must be read explicitly)
- Repository memory supports only `create` (write-only from client, managed at github.com)
- User memory has NO workspace scoping: notes saved in project A are visible in project B

**Implication for Alex**: User memory must contain ONLY universal preferences (formatting rules, tool preferences, persona defaults). All project-specific context belongs in `.github/episodic/` (brain files, version-controlled, Master-only).

### 2. GitHub Copilot Agentic Memory (Server-Side, Repo-Scoped)

A separate, newer system in Public Preview. Copilot autonomously deduces and stores memories as it works.

| Property      | Detail                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------- |
| Scope         | Repository-level                                                                         |
| Created by    | Copilot (autonomous), requires user write access + Memory enabled                        |
| Consumers     | Coding agent, code review, CLI                                                           |
| Validation    | Citations reference specific code; checked against current codebase before use           |
| TTL           | Auto-deleted after 28 days                                                               |
| Cross-product | Coding agent memories inform code review and vice versa                                  |
| Availability  | Enabled by default (Pro/Pro+); disabled by default (Enterprise/Org)                      |
| Management    | Repo Settings > Copilot > Memory                                                         |
| Future        | "Will be extended to other parts of Copilot, and for personal and organizational scopes" |

**Implication for Alex**: This system is complementary to Alex's brain. It captures patterns Copilot notices while working in a repo. Worth monitoring for when personal/org scopes arrive, as it could supplement cross-session persistence.

## Customization Stack (Complete Inventory)

VS Code's customization system is layered. Alex already leverages most layers, documented here for completeness and gap analysis.

### Layer 1: Always-On Instructions

File: `.github/copilot-instructions.md`

- Auto-included in every chat request
- Single file per repo, defined at repo root
- Contains identity, active context, routing, safety imperatives
- Alex status: **Fully leveraged** (copilot-instructions.md is the conscious mind)

### Layer 2: File-Based Instructions

Files: `*.instructions.md` with YAML frontmatter

- `applyTo` glob patterns restrict when they load (e.g., `**/*.ts`)
- `description` field enables semantic matching (loaded when task matches description)
- Placed in `.github/instructions/` by convention
- Can be synced via Settings Sync
- Alex status: **Fully leveraged** (45+ instruction files with applyTo patterns)

### Layer 3: Prompt Files

Files: `*.prompt.md` with YAML frontmatter

- Appear as `/promptName` slash commands
- Support `mode`, `tools`, `description` front matter
- Can reference files and tools as context
- Created via `Chat: New Prompt File...` or `/create-prompt`
- Alex status: **Fully leveraged** (prompts directory with reusable workflows)

### Layer 4: Agent Skills

Folders containing instructions, scripts, and resources.

- Load on demand when task matches their description
- Multi-step capabilities with external tool access
- Built on open standard (agentskills.io)
- Alex status: **Fully leveraged** (157 skills across all domains)

### Layer 5: Custom Agents

Files: `*.agent.md` with persona, tools, and model preferences.

- Specialized personas with constrained tool access
- Can delegate to other agents
- Alex status: **Fully leveraged** (7 agents: orchestrator, researcher, builder, validator, documentarian, Azure, M365)

### Layer 6: MCP Servers

External tools and data via Model Context Protocol.

- Supports Streamable HTTP transport (v1.100+)
- v1.101 added: prompts, resources, sampling (experimental), auth, dev mode
- Alex status: **Partially leveraged** (cognitive tools MCP package exists; new capabilities below are unexplored)

### Layer 7: Hooks

Shell commands at agent lifecycle points.

- Deterministic execution (not AI-guided)
- Points: after file edit, before commit, etc.
- Alex status: **Available, selectively used**

### Layer 8: Agent Plugins (Discontinued)

Pre-packaged bundles of customizations from marketplaces. Alex explored this as a distribution mechanism for heirs but discontinued it in v7.1.2 in favor of sync-architecture.cjs and platform-specific deployment.

- Alex status: **Discontinued** (v7.1.2)

### Layer 9: Custom Chat Modes (Preview, v1.101)

Files: `*.chatprompt.md` with description and tool restrictions.

- Define custom modes alongside built-in Ask/Edit/Agent
- Specify which tools are available per mode
- Select from chat mode dropdown
- Alex status: **Not leveraged** (new in v1.101)

### Layer 10: Tool Sets (v1.101)

JSON configuration grouping multiple tools under a single name.

- Reference via `#toolSetName` in chat
- Created via `Configure Tool Sets > Create new tool sets file`
- Can include MCP tools, built-in tools, or extension tools
- Alex status: **Not leveraged** (new in v1.101)

## New Capabilities (v1.99 through v1.102)

### v1.99 (March 2025)

- Custom instructions enhancements (applyTo, description matching)
- Agent skills open standard
- Context compaction with `/compact` command

### v1.100 (April 2025)

- MCP Streamable HTTP transport
- Parent repository discovery (`chat.useCustomizationsInParentRepositories`)
- `#githubRepo` tool for searching code in any GitHub repo without cloning
- `#fetch` tool improvements (full page as Markdown, smart truncation)
- Chat Customizations editor (centralized UI, preview)
- Context compaction auto-triggers when context window fills
- Conversation summary with prompt caching (stable prefix optimization)
- Agent plugins (preview)
- Browser tools (agents interact with integrated browser pages)
- Autofix (agent mode auto-detects and fixes errors from its own edits)

### v1.101 (May 2025)

- **Tool Sets**: group related tools into named collections
- **MCP Prompts**: MCP servers can define reusable `/mcp.server.prompt` slash commands
- **MCP Resources**: browse and attach resources from MCP servers
- **MCP Sampling** (Experimental): MCP servers can make requests back to the model
- **MCP Auth**: OAuth/Entra support for authenticated MCP servers
- **MCP Dev Mode**: watch + debug configuration for MCP server development
- **Custom Chat Modes** (Preview): custom modes with tool restrictions
- **Copilot Coding Agent**: assign issues/PRs to Copilot from VS Code
- **Source Control as Context**: add commits/PRs as chat context
- **MCP Extension APIs**: extensions can publish collections of MCP servers
- **VSCE Secret Scanning**: scans for secrets when packaging extensions
- **Task Diagnostic Awareness**: agent sees errors from problem matchers
- **Terminal CWD Context**: agent knows current working directory

### v1.102 (June 2025)

- **Copilot Chat open sourced**: MIT license at github.com/microsoft/vscode-copilot-chat; agent mode, inline chat, and MCP integration source now public
- **MCP is GA**: generally available with org-level policy controls for enterprise
- **MCP Elicitations**: MCP servers can request structured input from the client (user)
- **MCP server gallery**: curated discovery page, install directly from Extensions view MCP SERVERS section
- **MCP servers as first-class resources**: dedicated `mcp.json` per profile (not in settings.json), Settings Sync integration, Dev Container support
- **Generate custom instructions**: `Chat: Generate Instructions` command analyzes your codebase and auto-generates `copilot-instructions.md`
- **Load instructions on demand**: LLM can autonomously load `.instructions.md` files when it detects a relevant task, even if no `applyTo` match is in context
- **Chat mode improvements**: `model` metadata in `.chatmode.md`, IntelliSense for metadata properties, import modes via `vscode:` links, awesome-copilot community repo
- **Edit previous requests** (Experimental): click previous prompts to modify text, context, mode, model; subsequent requests are undone and retried
- **Terminal auto approval** (Experimental): allow/deny lists for terminal commands (`github.copilot.chat.agent.terminal.allowList`/`denyList`); regex and prefix matching; chained command detection
- **Agent awareness of tasks/terminals**: `GetTaskOutput` tool reads running task output; agent tracks which background terminals it created
- **Start chat from CLI**: `code chat [options] [prompt]` with `--mode`, `--add-file`, `--maximize`, stdin support
- **Fetch tool non-HTTP URLs**: `file://` URLs and images now supported
- **Chat Debug View**: `Show Chat Debug View` command shows full prompt, tools, responses, tool calls for every request; exportable
- **Maximized chat view**: secondary side bar spans full editor area; persists across restarts
- **Agent badge indicator**: OS-level badge when agent needs confirmation in unfocused window
- **Copilot coding agent handoff**: `#copilotCodingAgent` tool pushes local changes to remote branch and starts background agent session

## Chat Features (Cross-Version)

These features span multiple versions and represent the current state of the chat system.

### Agent Types and Execution Targets

Agents can run in four environments:

| Type        | Where                     | Interaction                    | Use Case                                        |
| ----------- | ------------------------- | ------------------------------ | ----------------------------------------------- |
| Local       | Your machine, VS Code     | Interactive                    | Brainstorming, code edits, debugging, MCP tools |
| Copilot CLI | Your machine, background  | Autonomous, worktree isolation | Well-defined tasks while you keep working       |
| Cloud       | GitHub remote environment | Autonomous, creates PRs        | Team collaboration, issue assignment            |
| Third-party | Anthropic/OpenAI SDK      | Via provider harness           | Using specific AI providers                     |

Built-in agents: **Agent** (autonomous implementation), **Plan** (structured planning before coding), **Ask** (Q&A, no edits).

### Permission Levels

| Level               | Behavior                                                                        |
| ------------------- | ------------------------------------------------------------------------------- |
| Default Approvals   | Read-only and safe tools auto-approved; others require confirmation             |
| Bypass Approvals    | All tool calls auto-approved; agent may still ask clarifying questions          |
| Autopilot (Preview) | All tools auto-approved, auto-responds to questions, runs until task completion |

### Session Management

- **Multiple parallel sessions**: different tasks, different agent types, different models
- **Session views**: sidebar (default), editor tab, separate window, maximized
- **Forking**: `/fork` duplicates full session; fork from checkpoint duplicates up to a specific request
- **Queue/Steer/Stop**: send messages while a request is running; queue (wait), steer (redirect after current tool), stop (cancel immediately)
- **Reorder pending messages**: drag-and-drop queued/steering messages
- **Archive and pin**: organize sessions without deleting; filter by archived/active
- **Export**: `Chat: Export Chat...` saves session as JSON; right-click for markdown copy
- **Save as prompt**: `/savePrompt` generalizes a conversation into a reusable `.prompt.md` template
- **Session handoff**: switch agent types mid-session (e.g., local to CLI to cloud); `/delegate` from CLI to cloud
- **Session status indicator** (Experimental): title bar badge shows unread and in-progress session counts
- **OS notifications**: configurable alerts when responses arrive or confirmation needed (`chat.notifyWindowOnResponseReceived`, `chat.notifyWindowOnConfirmation`)
- **Welcome page sessions**: set `workbench.startupEditor` to `agentSessionsWelcomePage` for session-centric startup

### Context and Input

- **`#`-mentions**: files, folders, symbols, `#codebase`, `#terminalSelection`, `#fetch`, `#githubRepo`, tool sets
- **`@`-mentions**: `@vscode`, `@terminal` for domain-specific participants
- **Vision**: attach images (screenshots, mockups) as context
- **Browser elements** (Experimental): select elements from integrated browser as HTML/CSS/screenshot context
- **Image carousel** (Experimental): browse images from tool results and chat responses
- **Source control history**: add commits/PRs as chat context via `Add Context > Source Control`
- **Implicit context**: active file, cursor position, selection auto-included; agent can read more via tools

### Debugging and Troubleshooting

- **Chat Debug View**: `Show Chat Debug View` command shows full prompt text, enabled tools, response details, and tool call trees for every request
- **Agent Logs**: chronological event log of tool calls, LLM requests, and prompt file discovery
- **Export debug logs**: right-click > `Export As...` in the debug view

## Architectural Opportunities

### High Priority (Quick Wins)

**1. Tool Sets for Cognitive MCP Tools**

Create a `.vscode/toolsets.json` grouping Alex's 5 MCP cognitive tools:

```json
{
  "alex-brain": {
    "tools": ["alex_synapse_health", "alex_architecture_status"],
    "description": "Alex cognitive health and architecture status",
    "icon": "brain"
  },
  "alex-knowledge": {
    "tools": ["alex_knowledge_search", "alex_knowledge_save"],
    "description": "Alex cross-project knowledge management",
    "icon": "library"
  }
}
```

This lets users type `#alex-brain` instead of remembering individual tool names.

**2. MCP Prompts on Cognitive Tools**

Expose common operations as MCP prompts so they appear as `/mcp.alex.meditate`, `/mcp.alex.health-check` slash commands without needing `.prompt.md` files.

**3. MCP Resources for Architecture Files**

Let the cognitive MCP server expose architecture docs (COGNITIVE-ARCHITECTURE.md, SKILLS-CATALOG.md, NORTH-STAR.md) as browseable resources. Agents and users can attach them as context via `Add Context > MCP Resources`.

### Medium Priority (Strategic)

**4. Custom Chat Modes for Alex Personas**

Define mode files that map to Alex's existing agents:

- `meditation.chatprompt.md`: read-only tools, reflection-focused instructions
- `builder.chatprompt.md`: full edit tools, implementation-focused
- `researcher.chatprompt.md`: fetch + search tools, no edit access
- `validator.chatprompt.md`: read + test tools, adversarial instructions

This gives native VS Code mode-switching UX for Alex's personas.

**5. ~~Agent Plugin Packaging~~ (Discontinued v7.1.2)**

Agent plugins were evaluated as a distribution mechanism for heir deployment but discontinued. Heir distribution uses sync-architecture.cjs instead.

**6. MCP Sampling for Autonomous Reasoning**

When MCP sampling stabilizes, the cognitive tools server could make its own LLM calls for background processing (e.g., dream state, synapse health analysis) without requiring a user-initiated chat.

### Lower Priority (Monitor)

**7. Agentic Memory Personal/Org Scopes**

When GitHub expands agentic memory beyond repository scope, it could serve as a persistent cross-session memory layer that doesn't leak across workspaces (unlike the current user memory).

**8. Parent Repository Discovery**

The `chat.useCustomizationsInParentRepositories` setting is relevant for monorepo heirs that nest Alex's `.github/` inside a larger repository structure.

**9. Context Compaction Rules**

Alex could define compaction instructions that guide how conversation summaries preserve critical context (persona state, active trifectas, safety imperatives) when the context window fills.

**10. Terminal Auto Approval Lists**

Define workspace-level allow/deny lists for Alex's common terminal commands (audit scripts, build, test, lint). This reduces confirmation fatigue during automated workflows while keeping destructive commands gated.

```json
"github.copilot.chat.agent.terminal.allowList": {
  "node scripts/": true,
  "/^npm run (build|test|lint)$/": true,
  "npx vsce package": true
},
"github.copilot.chat.agent.terminal.denyList": {
  "rm ": true,
  "git push --force": true,
  "npx vsce publish": true
}
```

**11. Session Forking for Exploration**

Use `/fork` or checkpoint forking when exploring architectural alternatives. Fork before a risky change, try it, and discard the fork if it fails while the original session preserves context.

**12. `/savePrompt` for Workflow Capture**

After completing a complex multi-step workflow (release, meditation, audit), use `/savePrompt` to auto-generate a reusable `.prompt.md` template from the conversation. This is a natural way to evolve Alex's prompt library from real sessions.

**13. CLI Chat for Automation**

`code chat --mode agent --add-file .github/copilot-instructions.md "run meditation protocol"` enables scripted invocation of Alex workflows from PowerShell automation or scheduled tasks.

**14. On-Demand Instruction Loading**

With v1.102's on-demand loading, Alex's instruction files no longer need aggressive `applyTo` patterns. The LLM can discover and load relevant instructions autonomously based on their descriptions. This reduces token waste from over-eager pattern matching.

## Memory Architecture Decision Matrix

| What to Store                         | Where                           | Why                                           |
| ------------------------------------- | ------------------------------- | --------------------------------------------- |
| Universal preferences (format, style) | `/memories/` (user memory)      | Persists across sessions, needed everywhere   |
| Session working state                 | `/memories/session/`            | Auto-cleared, conversation-scoped             |
| Repo-scoped conventions               | `/memories/repo/`               | Server-side, survives local resets            |
| Project-specific context              | `.github/episodic/` (brain)     | Version-controlled, Master-only, no heir leak |
| Architecture patterns                 | `.github/instructions/` (brain) | Synced to heirs via sync-architecture.cjs     |
| Skills and capabilities               | `.github/skills/` (brain)       | Synced to heirs, open standard                |
| Copilot-discovered patterns           | GitHub Agentic Memory           | Auto-managed, 28-day TTL, citation-validated  |

## Conclusion

Alex's architecture is well-aligned with VS Code's customization stack. The primary gaps are in the v1.101/v1.102 features (tool sets, MCP prompts/resources, custom chat modes, terminal auto approval, on-demand instruction loading) which offer native UX improvements without architectural changes. The biggest risk is continued user memory scope leakage, which requires ongoing discipline about what goes into `/memories/` vs brain files.

The open-sourcing of Copilot Chat (v1.102) opens a new dimension: Alex can study the actual agent loop, prompt construction, and tool calling implementation to optimize its own architecture against the real token budget and tool invocation patterns.
