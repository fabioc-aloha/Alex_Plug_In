# VS Code Chat Configurations

**Date**: March 31, 2026
**Version**: 1.0
**Purpose**: Document the VS Code chat and MCP configurations implemented for Alex's cognitive architecture
**Related**: [VSCODE-MEMORY-ARCHITECTURE.md](VSCODE-MEMORY-ARCHITECTURE.md) (research), [MCP Server README](../../packages/mcp-cognitive-tools/README.md)

## Overview

Three high-priority configurations were implemented based on the VS Code Memory Architecture research:

1. **Tool Sets**: group MCP tools into named collections for `#`-mentioning
2. **MCP Prompts**: reusable prompt templates exposed as `/mcp.*` slash commands
3. **MCP Resources**: architecture documents exposed as browseable, attachable context

## 1. Tool Sets

**File**: `.vscode/toolsets.json`

Tool sets let users reference groups of MCP tools with a single `#` mention instead of remembering individual tool names.

```json
{
    "alex-brain": {
        "tools": [
            "mcp_alex-cognitiv_alex_synapse_health",
            "mcp_alex-cognitiv_alex_architecture_status"
        ],
        "description": "Alex cognitive health and architecture status",
        "icon": "heart"
    },
    "alex-knowledge": {
        "tools": [
            "mcp_alex-cognitiv_alex_knowledge_search",
            "mcp_alex-cognitiv_alex_knowledge_save"
        ],
        "description": "Alex cross-project knowledge management",
        "icon": "library"
    },
    "alex-memory": {
        "tools": [
            "mcp_alex-cognitiv_alex_memory_search"
        ],
        "description": "Search across all Alex memory systems",
        "icon": "search"
    }
}
```

### Usage

| Mention           | Tools Included                      | Use Case                        |
| ----------------- | ----------------------------------- | ------------------------------- |
| `#alex-brain`     | synapse_health, architecture_status | "check my brain health"         |
| `#alex-knowledge` | knowledge_search, knowledge_save    | "find patterns about debugging" |
| `#alex-memory`    | memory_search                       | "search my skills for testing"  |

Type `#alex-brain` in the chat input and the agent gets access to both health and architecture tools in one reference.

## 2. MCP Prompts

**File**: `packages/mcp-cognitive-tools/src/index.ts` (server-side)

MCP prompts appear as slash commands in VS Code chat: `/mcp.alex-cognitive-tools.<name>`.

### Available Prompts

| Slash Command                                     | Arguments                                     | What It Does                                                         |
| ------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `/mcp.alex-cognitive-tools.health-check`          | None                                          | Runs synapse health + architecture status, summarizes overall health |
| `/mcp.alex-cognitive-tools.architecture-overview` | None                                          | Gets architecture inventory and summarizes structure                 |
| `/mcp.alex-cognitive-tools.search-knowledge`      | `query` (required)                            | Combined memory + knowledge search with synthesis                    |
| `/mcp.alex-cognitive-tools.save-insight`          | `title`, `content`, `category` (all required) | Guided insight storage to global knowledge base                      |

### Prompt Implementation Pattern

Each prompt is a structured message that instructs the agent to use specific tools and synthesize results. Example:

```
health-check → "Use alex_synapse_health to check integrity, then alex_architecture_status
for inventory. Summarize overall health, highlight issues, suggest improvements."
```

This approach lets the prompts compose multiple tool calls into coherent workflows without requiring `.prompt.md` files.

## 3. MCP Resources

**File**: `packages/mcp-cognitive-tools/src/index.ts` (server-side)

Architecture documents are exposed as browseable MCP resources. Users can attach them to chat via `Add Context > MCP Resources`.

### Available Resources

| Resource                    | URI                                                       | Description                                |
| --------------------------- | --------------------------------------------------------- | ------------------------------------------ |
| North Star                  | `alex://alex_docs/NORTH-STAR.md`                          | Project vision and mission definition      |
| Cognitive Architecture      | `alex://alex_docs/architecture/COGNITIVE-ARCHITECTURE.md` | Complete architecture documentation        |
| Skills Catalog              | `alex://.github/SKILLS-CATALOG.md`               | Full skill inventory and trifecta status   |
| Conscious Mind              | `alex://.github/copilot-instructions.md`                  | Always-on instructions (identity, routing) |
| Conscious Mind Architecture | `alex://alex_docs/architecture/CONSCIOUS-MIND.md`         | How the conscious mind layer works         |
| What is Alex                | `alex://alex_docs/WHAT-IS-ALEX.md`                        | Introduction and overview                  |

### URI Scheme

Resources use the `alex://` URI scheme. The path after `alex://` maps directly to the workspace-relative file path. Path traversal is blocked by a security check that validates the resolved path stays within the workspace root.

### Usage

1. In chat, click `Add Context` or type `#`
2. Select `MCP Resources...`
3. Browse the list of Alex architecture documents
4. Select one or more to attach as context to your prompt

## Supporting Configuration

### MCP Server

**File**: `.vscode/mcp.json`

```json
{
    "servers": {
        "alex-cognitive-tools": {
            "type": "stdio",
            "command": "node",
            "args": [
                "${workspaceFolder}/packages/mcp-cognitive-tools/dist/index.js"
            ]
        }
    }
}
```

### Workspace Settings

**File**: `.vscode/settings.json`

```json
{
    "chat.useCustomAgentHooks": true,
    "chat.autopilot.enabled": true,
    "chat.notifyWindowOnConfirmation": "always",
    "chat.agentSkillsLocations": [".github/skills"],
    "chat.useCustomizationsInParentRepositories": true,
    "github.copilot.chat.agentDebugLog.enabled": true,
    "github.copilot.chat.agentDebugLog.fileLogging.enabled": true,
    "chat.imageCarousel.enabled": true
}
```

### MCP Server Package

**File**: `packages/mcp-cognitive-tools/package.json` (v1.1.0)

The MCP server declares capabilities for tools, prompts, and resources:

```typescript
capabilities: {
    tools: {},
    prompts: {},
    resources: {},
}
```

## How It All Connects

```
User types #alex-brain in chat
    ↓
VS Code loads toolsets.json → resolves to 2 MCP tools
    ↓
Agent calls alex_synapse_health + alex_architecture_status
    ↓
MCP server (index.ts) executes against workspace .github/
    ↓
Results returned to agent for synthesis

User types /mcp.alex-cognitive-tools.health-check
    ↓
VS Code calls GetPrompt on MCP server
    ↓
Server returns structured prompt with tool usage instructions
    ↓
Agent executes the prompt (calls tools, synthesizes)

User attaches MCP Resource "North Star"
    ↓
VS Code calls ReadResource on MCP server with alex://alex_docs/NORTH-STAR.md
    ↓
Server reads file from workspace, returns markdown content
    ↓
Content added to chat context
```
