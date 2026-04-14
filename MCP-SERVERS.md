# MCP Servers — Development Environment

> Reviewed: 2026-04-11 | Scope: All repos in C:\Development (14 repos with MCP configs)
> Platforms: Windows + macOS

## User-Level Servers (Global)

These are installed in `%APPDATA%\Code\User\mcp.json` and available in every workspace.

| Server                   | Type                                  | Transport                                     | Description                                         |
| ------------------------ | ------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| **MarkItDown**           | `microsoft/markitdown`                | stdio (`uvx markitdown-mcp@0.0.1a4`)          | Convert PDF, Word, Excel, images, audio to Markdown |
| **Microsoft Enterprise** | `io.github.microsoft/enterprise-mcp`  | HTTP (`mcp.svc.cloud.microsoft/enterprise`)    | Query Microsoft Entra data using natural language   |

### Azure MCP Server (Extension-Provided)

The **Azure MCP Server** (`ms-azuretools.vscode-azure-mcp-server`) is installed as a VS Code extension, not a config entry. It provides 60+ Azure resource tools automatically.

**Settings:**

```jsonc
"chat.mcp.serverSampling": {
  "Azure MCP Server Provider: Azure MCP": {
    "allowedDuringChat": true  // Allow Azure MCP to make LLM calls during chat
  }
}
```

## Workspace-Level Servers

These are defined per-project in `.vscode/mcp.json`.

### AlexMaster — Cognitive Tools

Custom MCP server exposing Alex's cognitive architecture as tools.

```jsonc
// .vscode/mcp.json
{
  "servers": {
    "alex-cognitive-tools": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/packages/mcp-cognitive-tools/dist/index.js"]
    }
  }
}
```

**Tools provided:**

| Tool                       | Description                                 |
| -------------------------- | ------------------------------------------- |
| `alex_synapse_health`      | Check cognitive synapse connection status   |
| `alex_memory_search`       | Search episodic memory                      |
| `alex_architecture_status` | Report on cognitive architecture health     |
| `alex_knowledge_search`    | Search across skills, instructions, prompts |
| `alex_knowledge_save`      | Save insights to knowledge base             |

**Build:** `cd packages/mcp-cognitive-tools && npm run build`

### Microsoft Internal Servers

Used in Microsoft-internal projects.

| Server             | Type  | Workspaces                | Description                                        |
| ------------------ | ----- | ------------------------- | -------------------------------------------------- |
| **Ask ES Chat**    | HTTP  | ai-first-dev-starter-pack | ES Chat MCP (`eschat.microsoft.com/mcp`)           |
| **ICM**            | HTTP  | ai-first-dev-starter-pack | Incident management (`icm-mcp-prod.azure-api.net`) |
| **WorkIQ**         | stdio | ai-first-dev-starter-pack | `npx @microsoft/workiq mcp`                        |
| **GitHub Copilot** | HTTP  | ai-first-dev-starter-pack | `api.githubcopilot.com/mcp`                        |
| **S360 Breeze**    | HTTP  | S360                      | S360 platform (`mcp.vnext.s360.msftcloudes.com`)   |
| **MCP Planner**    | stdio | FishbowlGovernance        | Microsoft Planner integration (device-code auth)   |

### M365 Agents Toolkit

Standard scaffold — auto-added by Teams Toolkit for M365 Copilot agent projects.

```jsonc
{
  "command": "npx",
  "args": ["@microsoft/m365agentstoolkit-mcp@latest", "server", "start"]
}
```

**Workspaces:** AIRS Enterprise, CopilotEnhancement, CorreaX, Fishbowl, spotify-mcpb

### Project-Specific Servers

| Server         | Type  | Workspace       | Description                                                                                        |
| -------------- | ----- | --------------- | -------------------------------------------------------------------------------------------------- |
| **YouTube**    | stdio | youtube         | YouTube Data API (`node dist/index.js`, requires `YOUTUBE_API_KEY`)                                |
| **Qualtrics**  | stdio | Fishbowl        | Survey data access (`tsx @iflow-mcp/yrvelez-qualtrics-mcp-server`, read-only, rate-limited 50 RPM) |
| **TTS Reader** | stdio | Lithium         | Text-to-speech reader (`~/.alex/mcp-servers/tts-reader/index.js`)                                  |
| **Playwright** | stdio | GH_Copilot_Chat | VS Code Playwright test automation (dev-only)                                                      |

### Empty / Placeholder

| Workspace          | State                             |
| ------------------ | --------------------------------- |
| Alex-in-Wonderland | `{"servers": {}}` — scaffold only |
| cXpert             | `{"servers": {}}` — scaffold only |

---

## Agent Chat Tool Settings

Settings that control how agent mode interacts with tools, MCP servers, and automated workflows.

### Tool Auto-Approval

```jsonc
// Global tool execution
"chat.tools.autoRun": true,                    // Tools run automatically without confirmation
"chat.tools.global.autoApprove": true,         // All tool types auto-approved
"chat.tools.fileSystem.autoApprove": true,      // File read/write without prompts
"chat.tools.urls.autoApprove": {},              // URL fetching (empty = default approval)
```

### Terminal Tool Settings

```jsonc
// Terminal execution control
"chat.tools.terminal.autoApprove": {},                        // Per-command approval map (empty = use defaults)
"chat.tools.terminal.enableAutoApprove": false,               // Master switch for terminal auto-approve
"chat.tools.terminal.autoApproveWorkspaceNpmScripts": false,  // Don't auto-approve npm scripts
"chat.tools.terminal.preventShellHistory": false,             // Allow shell history recording
"chat.tools.terminal.enforceTimeoutFromModel": false,         // Don't enforce model-suggested timeouts
"chat.tools.terminal.simpleCollapsible": false,               // Full terminal output display
"chat.tools.terminal.ignoreDefaultAutoApproveRules": true,    // Override VS Code's built-in approval rules
"chat.tools.terminal.autoReplyToPrompts": true                // Auto-reply to Y/N terminal prompts
```

### MCP Server Management

```jsonc
"chat.mcp.autostart": "newAndOutdated",         // Auto-start new and updated MCP servers
"chat.mcp.gallery.enabled": true,               // Enable MCP gallery for discovery
"chat.mcp.assisted.nuget.enabled": true          // NuGet-assisted MCP server installation
```

### Memory & Knowledge Tools

```jsonc
"github.copilot.chat.tools.memory.enabled": true,  // Memory tool for persistent notes
"github.copilot.chat.copilotMemory.enabled": true   // Copilot memory across sessions
```

---

## Recommendations

### Must Have (Every Workspace)

These MCP servers provide high-value agent capabilities. Install globally or ensure they're in every workspace you use for agent chat.

| Server                 | Why                                                                                            | Install                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------ |
| **Azure MCP**          | 60+ Azure tools for resource management, deployment, monitoring. Essential for any Azure work. | Already installed (extension)  |
| **MarkItDown**         | Convert any document to Markdown for agent consumption. PDFs, Word, Excel, images.             | Already installed (user-level) |
| **GitHub Copilot MCP** | Access GitHub API through MCP — repos, issues, PRs, code search.                               | Already installed (user-level) |

### ✅ Completed — Add to User-Level `mcp.json`

The **GitHub Copilot MCP** server has been added to user-level `mcp.json`, making it available in all workspaces.

```jsonc
"github": {
  "url": "https://api.githubcopilot.com/mcp",
  "type": "http"
}
```

### Consider Installing

| Server             | Why                                                                    | How                                                          |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Playwright MCP** | Browser automation for testing. Currently dev-only in GH_Copilot_Chat. | `npx @anthropic-ai/mcp-playwright` or use VS Code's built-in |
| **Fetch MCP**      | General HTTP/API fetching tool for agents.                             | Available in MCP Gallery                                     |

### Cleanup Opportunities

| Action                                                   | Why                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Remove empty `mcp.json` in Alex-in-Wonderland and cXpert | Placeholder files add no value                                                       |
| Review Qualtrics token prompt                            | Uses `promptString` with password=true — secure, but verify the token is still valid |
| Check TTS Reader path                                    | Hardcoded to `C:/Users/fabioc/.alex/mcp-servers/` — will break on macOS              |

### Agent Chat Tool Recommendations

For a **chat-centric development workflow** with maximum agent autonomy:

| Setting                                             | Current | Recommended  | Why                                                                         |
| --------------------------------------------------- | ------- | ------------ | --------------------------------------------------------------------------- |
| `chat.tools.terminal.enableAutoApprove`             | `false` | Keep `false` | Terminal commands need human review — safety net for destructive operations |
| `chat.tools.terminal.autoReplyToPrompts`            | `true`  | Keep `true`  | Prevents terminal hangs on Y/N prompts                                      |
| `chat.tools.terminal.ignoreDefaultAutoApproveRules` | `true`  | Keep `true`  | Your custom approval setup takes precedence                                 |
| `chat.tools.global.autoApprove`                     | `true`  | Keep `true`  | Non-terminal tools (file ops, URL fetch, MCP) should run without friction   |
| `chat.tools.autoRun`                                | `true`  | Keep `true`  | Core to chat-centric workflow — agents act autonomously                     |

Your current settings strike the right balance: **full autonomy for non-destructive tools**, **human-in-the-loop for terminal commands**.

---

## Server Architecture Summary

```
User-Level (Global)
├── MarkItDown (stdio/uvx) ─── Document conversion
├── Enterprise MCP (HTTP) ──── Microsoft Entra queries
├── GitHub Copilot MCP (HTTP) ─ GitHub API (repos, issues, PRs, code search)
└── Azure MCP (extension) ──── 60+ Azure resource tools

Workspace-Level (Per-Project)
├── alex-cognitive-tools ───── AlexMaster cognitive architecture
├── m365agentstoolkit ──────── 5 M365 agent projects
├── m365agentstoolkit ────── 5 M365 agent projects
├── Microsoft Internal ─────── ES Chat, ICM, WorkIQ, S360, Planner
└── Project-Specific ──────── YouTube, Qualtrics, TTS, Playwright
```
