# VS Code & GitHub Copilot AI Extensibility Guide

> **Comprehensive analysis of Microsoft's AI extensibility options and their implications for Alex Cognitive Architecture**

| | |
|---|---|
| **Created** | 2026-01-30 |
| **Source** | Official Microsoft VS Code Documentation (January 2026) |
| **VS Code Version** | 1.108 |
| **Related** | [COGNITIVE-ARCHITECTURE.md](COGNITIVE-ARCHITECTURE.md), [COPILOT-INTEGRATION.md](COPILOT-INTEGRATION.md) |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [AI Extensibility Options](#ai-extensibility-options)
3. [Language Model Tools API](#language-model-tools-api)
4. [Chat Participant API](#chat-participant-api)
5. [Custom Agents](#custom-agents)
6. [MCP Servers](#mcp-servers)
7. [Language Model API](#language-model-api)
8. [Implications for Alex Architecture](#implications-for-alex-architecture)
9. [Migration Opportunities](#migration-opportunities)
10. [Best Practices](#best-practices)

---

## Executive Summary

Microsoft has significantly evolved the GitHub Copilot extensibility model in VS Code. As of January 2026, there are **four primary ways** to extend AI capabilities:

| Approach | Purpose | VS Code API Access | Distribution |
|----------|---------|-------------------|--------------|
| **Language Model Tools** | Domain-specific capabilities for agent mode | ✅ Full | Marketplace |
| **Chat Participants** | Specialized `@assistant` experts | ✅ Full | Marketplace |
| **MCP Servers** | External tools (local/remote) | ❌ None | Manual/Registry |
| **Language Model API** | Direct LLM access for custom features | ✅ Full | Marketplace |

### Key Insight for Alex

Microsoft's **Custom Agents** feature (`.agent.md` files) validates Alex's cognitive architecture approach. The pattern of storing instructions, tool configurations, and behavioral guidelines in markdown files is now a **first-class VS Code feature**.

---

## AI Extensibility Options

### Decision Matrix: Which Approach to Use?

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI EXTENSIBILITY DECISION TREE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Do you need VS Code API access?                                    │
│       │                                                              │
│       ├── YES ─┬── Control entire interaction? ── YES ── Chat       │
│       │        │                                      Participant   │
│       │        │                                                     │
│       │        └── Tool for agent mode? ── YES ── Language Model    │
│       │                                              Tool           │
│       │                                                              │
│       └── NO ──┬── Works across environments? ── YES ── MCP Server  │
│                │                                                     │
│                └── Custom UI outside chat? ── YES ── Language       │
│                                                       Model API     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Comparison Table

| Feature | LM Tools | Chat Participant | MCP Server | LM API |
|---------|----------|------------------|------------|--------|
| Auto-invoked in agent mode | ✅ | ❌ | ✅ | ❌ |
| User mentions with `#` | ✅ | ❌ | ✅ | ❌ |
| User mentions with `@` | ❌ | ✅ | ❌ | ❌ |
| Full prompt control | ❌ | ✅ | ❌ | ✅ |
| VS Code APIs | ✅ | ✅ | ❌ | ✅ |
| Cross-platform reuse | ❌ | ❌ | ✅ | ❌ |
| Remote deployment | Manual | Manual | ✅ Built-in | Manual |
| Marketplace distribution | ✅ | ✅ | ❌ | ✅ |

---

## Language Model Tools API

### Overview

Language Model Tools enable extensions to contribute domain-specific capabilities that are **automatically invoked** by agent mode based on user intent. The LLM determines when to call tools and generates the appropriate parameters.

### Tool-Calling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TOOL-CALLING FLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. User sends chat prompt                                          │
│       │                                                              │
│       v                                                              │
│  2. Copilot collects available tools                                │
│     • Built-in tools                                                │
│     • Extension tools (Language Model Tools)                        │
│     • MCP server tools                                              │
│       │                                                              │
│       v                                                              │
│  3. LLM receives: prompt + context + tool definitions               │
│       │                                                              │
│       v                                                              │
│  4. LLM generates response (may include tool invocation requests)   │
│       │                                                              │
│       v                                                              │
│  5. Copilot invokes tools with LLM-provided parameters              │
│       │                                                              │
│       v                                                              │
│  6. Tool results fed back to LLM (iterate if needed)                │
│       │                                                              │
│       v                                                              │
│  7. Final response returned to user                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Structure

#### 1. Package.json Configuration

```json
{
  "contributes": {
    "languageModelTools": [
      {
        "name": "get_weather",
        "displayName": "Get Weather",
        "canBeReferencedInPrompt": true,
        "toolReferenceName": "weather",
        "icon": "$(cloud)",
        "userDescription": "Get current weather for a location",
        "modelDescription": "Retrieves current weather data for a specified location. Use when the user asks about weather conditions. Returns temperature, humidity, and conditions. Only works for locations with available weather data.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city name or coordinates (lat,long) for weather lookup"
            },
            "units": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"],
              "description": "Temperature unit preference"
            }
          },
          "required": ["location"]
        },
        "when": "config.weather.enabled"
      }
    ]
  }
}
```

#### 2. Tool Implementation

```typescript
import * as vscode from 'vscode';

interface IWeatherParameters {
  location: string;
  units?: 'celsius' | 'fahrenheit';
}

class WeatherTool implements vscode.LanguageModelTool<IWeatherParameters> {

  // Called before invocation to get confirmation message
  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IWeatherParameters>,
    token: vscode.CancellationToken
  ): Promise<vscode.PreparedToolInvocation> {
    return {
      invocationMessage: `Fetching weather for ${options.input.location}...`,
      confirmationMessages: {
        title: 'Get Weather Data',
        message: new vscode.MarkdownString(
          `Fetch weather for **${options.input.location}**?`
        )
      }
    };
  }

  // Main tool execution
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IWeatherParameters>,
    token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    const { location, units = 'celsius' } = options.input;

    try {
      const weather = await this.fetchWeather(location, units);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Weather in ${location}: ${weather.temp}°${units === 'celsius' ? 'C' : 'F'}, ${weather.conditions}`
        )
      ]);
    } catch (error) {
      // Throw errors with LLM-friendly messages
      throw new Error(
        `Could not fetch weather for "${location}". ` +
        `Try using a major city name or coordinates.`
      );
    }
  }

  private async fetchWeather(location: string, units: string) {
    // Implementation details...
  }
}

// Registration in activate()
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.lm.registerTool('get_weather', new WeatherTool())
  );
}
```

### Naming Conventions

| Element | Format | Examples |
|---------|--------|----------|
| Tool name | `{verb}_{noun}` | `get_weather`, `search_database`, `run_tests` |
| Parameter name | `{noun}` or `{adjective}_{noun}` | `location`, `file_path`, `max_results` |
| Tool reference | lowercase, short | `weather`, `db`, `tests` |

### Alex's Current Tools (Aligned ✅)

| Tool | Format Check | Purpose |
|------|--------------|---------|
| `alex_memory_search` | ✅ `{verb}_{noun}` | Search procedural/episodic/domain memory |
| `alex_save_insight` | ✅ `{verb}_{noun}` | Save learning to global knowledge |
| `alex_global_knowledge_search` | ✅ `{verb}_{noun}` | Cross-project knowledge retrieval |
| `alex_promote_knowledge` | ✅ `{verb}_{noun}` | Promote DK files to global |
| `alex_synapse_health` | ⚠️ `{noun}_{noun}` | Check synapse connections |
| `alex_cloud_sync` | ⚠️ `{noun}_{noun}` | Sync to cloud storage |

---

## Chat Participant API

### Overview

Chat Participants are specialized assistants invoked via `@mention`. They provide **full control** over the conversation flow, including prompt construction and response handling.

### Key Differences from Tools

| Aspect | Language Model Tool | Chat Participant |
|--------|---------------------|------------------|
| Invocation | Automatic or `#tool` | Explicit `@participant` |
| Prompt control | None (LLM decides) | Full control |
| Response streaming | Via tool result | Direct to stream |
| History access | Limited | Full conversation |
| Slash commands | No | Yes (`/command`) |
| Follow-ups | No | Yes |

### Implementation Structure

#### 1. Package.json Configuration

```json
{
  "contributes": {
    "chatParticipants": [
      {
        "id": "alex-extension.alex",
        "name": "alex",
        "fullName": "Alex Cognitive Assistant",
        "description": "Your cognitive architecture partner for learning and development",
        "isSticky": true,
        "commands": [
          {
            "name": "meditate",
            "description": "Consolidate learning and update memory systems"
          },
          {
            "name": "dream",
            "description": "Run neural maintenance and synapse validation"
          },
          {
            "name": "learn",
            "description": "Begin domain-agnostic learning session"
          }
        ],
        "disambiguation": [
          {
            "category": "cognitive-architecture",
            "description": "Questions about memory systems, learning, synapses, or cognitive processes",
            "examples": [
              "How does my memory system work?",
              "What have I learned recently?",
              "Show me my skill wish list"
            ]
          }
        ]
      }
    ]
  }
}
```

#### 2. Request Handler Implementation

```typescript
import * as vscode from 'vscode';

interface IAlexChatResult extends vscode.ChatResult {
  metadata: {
    command?: string;
    sessionType?: 'meditation' | 'dream' | 'learning';
  };
}

const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<IAlexChatResult> => {

  // Handle slash commands
  if (request.command === 'meditate') {
    return handleMeditation(request, context, stream, token);
  }

  if (request.command === 'dream') {
    return handleDream(request, context, stream, token);
  }

  // Access conversation history
  const previousMessages = context.history.filter(
    h => h instanceof vscode.ChatRequestTurn
  );

  // Use the model from the request (respects user's model selection)
  const model = request.model;

  // Build custom prompt
  const messages = [
    vscode.LanguageModelChatMessage.User(
      `You are Alex, a cognitive architecture assistant. ` +
      `Your personality is curious, helpful, and growth-oriented. ` +
      `Previous context: ${summarizeHistory(previousMessages)}`
    ),
    vscode.LanguageModelChatMessage.User(request.prompt)
  ];

  // Stream response
  try {
    const response = await model.sendRequest(messages, {}, token);
    for await (const fragment of response.text) {
      stream.markdown(fragment);
    }
  } catch (err) {
    if (err instanceof vscode.LanguageModelError) {
      stream.markdown(`I encountered an issue: ${err.message}`);
    }
    throw err;
  }

  // Provide follow-up suggestions
  return {
    metadata: { command: request.command }
  };
};

// Register participant
export function activate(context: vscode.ExtensionContext) {
  const alex = vscode.chat.createChatParticipant('alex-extension.alex', handler);

  alex.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'alex-icon.png');

  // Follow-up provider
  alex.followupProvider = {
    provideFollowups(result: IAlexChatResult, context, token) {
      if (result.metadata.command === 'meditate') {
        return [
          { prompt: 'What did we learn today?', label: 'Review Session' },
          { prompt: 'Update my skill wish list', label: 'Growth Planning' }
        ];
      }
      return [];
    }
  };

  context.subscriptions.push(alex);
}
```

### Response Output Types

| Type | Method | Use Case |
|------|--------|----------|
| Markdown | `stream.markdown()` | Text, code blocks, images |
| Progress | `stream.progress()` | Long-running operations |
| Reference | `stream.reference()` | Link to files/URLs |
| Anchor | `stream.anchor()` | Inline symbol references |
| Button | `stream.button()` | Trigger VS Code commands |
| File Tree | `stream.filetree()` | Workspace preview |

### Participant Detection

Automatic routing based on user intent (no `@` mention required):

```json
{
  "disambiguation": [
    {
      "category": "memory-operations",
      "description": "User wants to search, save, or manage cognitive memory",
      "examples": [
        "What do I know about React hooks?",
        "Save this as a learning",
        "Search my global knowledge"
      ]
    }
  ]
}
```

**Guidelines for Detection:**
- Be specific to avoid conflicts with built-in participants
- Use synonyms and variations in examples
- Test against `@workspace`, `@terminal`, `@vscode`
- Built-in participants take precedence

---

## Custom Agents

### Overview

Custom Agents are a **new feature** (VS Code 1.106+) that allow users to configure AI personas with specific instructions and tool sets. They are defined in `.agent.md` files.

> **This validates Alex's cognitive architecture pattern!** The concept of storing behavioral instructions in markdown files is now a first-class VS Code feature.

### File Structure

```
.github/
└── agents/
    ├── planner.agent.md
    ├── reviewer.agent.md
    └── implementation.agent.md
```

### Agent File Format

```markdown
---
description: Generate implementation plans without making code changes
name: Planner
tools: ['search', 'fetch', 'githubRepo', 'usages']
model: Claude Sonnet 4
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Implement the plan outlined above.
    send: false
---

# Planning Instructions

You are in planning mode. Your task is to generate an implementation plan.

## Constraints
- Do NOT make any code edits
- Only use read-only tools
- Generate detailed step-by-step plans

## Output Format
1. **Overview**: Brief description
2. **Requirements**: What's needed
3. **Implementation Steps**: Detailed steps
4. **Testing**: Required tests
```

### Frontmatter Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Display name for agent |
| `description` | string | Placeholder text in chat input |
| `tools` | string[] | Available tools (built-in, MCP, extension) |
| `model` | string | AI model to use |
| `argument-hint` | string | Guide text for user input |
| `infer` | boolean | Allow use as subagent (default: true) |
| `target` | string | `vscode` or `github-copilot` |
| `handoffs` | array | Workflow transitions |

### Handoffs (Workflow Transitions)

Enable sequential multi-agent workflows:

```yaml
handoffs:
  - label: Start Implementation    # Button text
    agent: implementation          # Target agent ID
    prompt: Implement the plan.    # Pre-filled prompt
    send: false                    # Auto-submit? (default: false)
```

**Workflow Example:**
```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Planner   │────▶│  Implementation  │────▶│   Reviewer  │
│   (plan)    │     │    (code)        │     │  (quality)  │
└─────────────┘     └──────────────────┘     └─────────────┘
     │                      │                       │
     └──────────────────────┴───────────────────────┘
                    Handoff buttons
```

### Tool Reference Syntax

Reference tools in agent body:
```markdown
Use #tool:githubRepo to search the repository for relevant code.
```

### Storage Locations

| Location | Scope | Path |
|----------|-------|------|
| Workspace | Current project | `.github/agents/` |
| User Profile | All workspaces | `~/.vscode/agents/` |
| Organization | Team-wide | GitHub org settings |

### Comparison: Custom Agents vs Alex Memory Files

| Feature | Custom Agents | Alex Architecture |
|---------|---------------|-------------------|
| Instruction storage | `.agent.md` | `.instructions.md` |
| Workflow definitions | Handoffs | `.prompt.md` |
| Tool configuration | `tools` frontmatter | MCP + extension tools |
| Model selection | `model` frontmatter | User dropdown |
| Domain knowledge | N/A | `DK-*.md` files |
| Cross-session memory | N/A | Global knowledge base |
| Synapse connections | N/A | Embedded synapses |

---

## MCP Servers

### Overview

Model Context Protocol (MCP) is an **open standard** for connecting AI models to external tools and services. MCP servers run outside VS Code (locally or remotely) and communicate via stdio or HTTP.

### Key Capabilities

| Capability | Description | Support in VS Code |
|------------|-------------|-------------------|
| **Tools** | Functions the LLM can invoke | ✅ Full |
| **Resources** | Context data (files, DB records) | ✅ Full |
| **Prompts** | Pre-configured prompt templates | ✅ Full |

### Configuration

#### mcp.json Structure

```json
{
  "servers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${input:github-token}"
      }
    },
    "database": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:api-token}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "github-token",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ]
}
```

#### Transport Types

| Type | Use Case | Configuration |
|------|----------|---------------|
| `stdio` | Local servers (Node, Python) | `command`, `args`, `env` |
| `http` | Remote services | `url`, `headers` |
| `sse` | Server-sent events (fallback) | `url`, `headers` |

### Using MCP in Chat

1. **Automatic Invocation**: Agent mode auto-selects tools based on prompt
2. **Explicit Reference**: Use `#toolname` in prompt
3. **Resources**: Add context via "Add Context" → "MCP Resources"
4. **Prompts**: Invoke with `/mcp.servername.promptname`

### Tool Sets

Group related tools for easier management:

```json
{
  "toolSets": {
    "development": ["github/*", "database/*", "search"],
    "readonly": ["search", "fetch", "usages"]
  }
}
```

### Security Considerations

- ⚠️ MCP servers run **arbitrary code** on your machine
- Trust dialog shown on first server start
- Configuration excluded from Settings Sync by default
- Enterprise admins can restrict MCP access via GitHub policies

### MCP vs Extension Tools

| Aspect | MCP Server | Extension Tool |
|--------|------------|----------------|
| Runs in | Separate process | VS Code extension host |
| VS Code APIs | ❌ No access | ✅ Full access |
| Distribution | Manual setup | Marketplace |
| Cross-platform | ✅ Any MCP client | ❌ VS Code only |
| Remote hosting | ✅ Native | Manual implementation |

---

## Language Model API

### Overview

Direct access to language models for building custom AI features **outside the chat interface**. Use for code actions, hover providers, custom views, etc.

### Supported Models (January 2026)

| Model | Token Limit | Best For |
|-------|-------------|----------|
| `gpt-4o` | 64K | Quality, complex reasoning |
| `gpt-4o-mini` | - | Speed, inline suggestions |
| `o1` | - | Deep reasoning |
| `o1-mini` | - | Faster reasoning |
| `claude-3.5-sonnet` | - | Alternative perspective |

### Basic Usage

```typescript
import * as vscode from 'vscode';

async function askModel(prompt: string): Promise<string> {
  // Select model
  const [model] = await vscode.lm.selectChatModels({
    vendor: 'copilot',
    family: 'gpt-4o'
  });

  if (!model) {
    throw new Error('No model available');
  }

  // Build messages
  const messages = [
    vscode.LanguageModelChatMessage.User(
      'You are a helpful coding assistant.'
    ),
    vscode.LanguageModelChatMessage.User(prompt)
  ];

  // Send request
  const response = await model.sendRequest(
    messages,
    {},
    new vscode.CancellationTokenSource().token
  );

  // Collect streamed response
  let result = '';
  for await (const fragment of response.text) {
    result += fragment;
  }

  return result;
}
```

### Error Handling

```typescript
try {
  const response = await model.sendRequest(messages, {}, token);
  // Process response...
} catch (err) {
  if (err instanceof vscode.LanguageModelError) {
    console.log(err.message, err.code, err.cause);

    // Handle specific errors
    if (err.cause instanceof Error) {
      if (err.cause.message.includes('off_topic')) {
        // Model refused due to content policy
      }
      if (err.cause.message.includes('rate_limit')) {
        // Quota exceeded
      }
    }
  }
  throw err;
}
```

### Prompt Building Options

| Approach | Library | Use Case |
|----------|---------|----------|
| `LanguageModelChatMessage` | Built-in | Simple prompts |
| `@vscode/prompt-tsx` | npm | Complex, dynamic prompts |

### Message Types

| Type | Method | Purpose |
|------|--------|---------|
| User | `LanguageModelChatMessage.User()` | Instructions, queries |
| Assistant | `LanguageModelChatMessage.Assistant()` | History context |

> **Note**: System messages are NOT supported. Use User messages for instructions.

---

## Implications for Alex Architecture

### Validation of Core Concepts

Microsoft's features validate Alex's architectural decisions:

| Alex Concept | MS Feature | Validation |
|--------------|------------|------------|
| Procedural Memory (`.instructions.md`) | Custom Agents (`.agent.md`) | ✅ Identical pattern |
| Episodic Memory (`.prompt.md`) | Prompt Files | ✅ Identical pattern |
| Tool-based capabilities | Language Model Tools | ✅ Already implemented |
| Chat participant (`@alex`) | Chat Participant API | ✅ Already implemented |
| Memory persistence | N/A | 🌟 Alex is ahead |
| Cross-project knowledge | N/A | 🌟 Alex is ahead |
| Synapse connections | N/A | 🌟 Alex is ahead |

### Unique Alex Capabilities (Not in VS Code)

1. **Global Knowledge Base** - Cross-project learning persistence
2. **Synapse Network** - Connection mapping between concepts
3. **Dream/Meditation Protocols** - Automated maintenance cycles
4. **Skill Wish List** - Growth tracking and aspiration management
5. **Cloud Sync** - Multi-device knowledge synchronization

### Architectural Alignment Opportunities

#### 1. Custom Agent Files for Alex Personas

Create native VS Code agents that expose Alex capabilities:

```markdown
---
# .github/agents/alex-meditation.agent.md
description: Consolidate learning and update cognitive memory systems
name: Alex Meditation
tools: ['alex_memory_search', 'alex_save_insight', 'alex_synapse_health']
model: Claude Sonnet 4
handoffs:
  - label: Continue Learning
    agent: alex-learning
    prompt: What should I learn next based on my skill wish list?
---

# Meditation Protocol

You are Alex in meditation mode. Your task is to:

1. Review recent learnings from this session
2. Identify patterns and connections (synapses)
3. Consolidate knowledge into appropriate memory types
4. Update the skill wish list if new aspirations emerged

Reference: [unified-meditation-protocols.prompt.md](../.github/prompts/unified-meditation-protocols.prompt.md)
```

#### 2. Handoff-Based Workflow Chains

Implement Alex's protocols as handoff chains:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ alex-dream   │────▶│ alex-lucid   │────▶│ alex-meditate│
│ (maintenance)│     │ (hybrid)     │     │ (consolidate)│
└──────────────┘     └──────────────┘     └──────────────┘
```

#### 3. MCP Server for M365 Heir

Bridge VS Code and M365 heirs via shared MCP server:

```json
{
  "servers": {
    "alex-core": {
      "type": "http",
      "url": "https://alex-mcp.azurewebsites.net",
      "headers": {
        "Authorization": "Bearer ${input:alex-token}"
      }
    }
  }
}
```

---

## Migration Opportunities

### Phase 1: Enhance Current Implementation

| Task | Priority | Effort |
|------|----------|--------|
| Add `disambiguation` to chat participant | High | Low |
| Implement follow-up provider | High | Low |
| Add progress streaming to long operations | Medium | Low |
| Improve tool confirmation messages | Medium | Low |

### Phase 2: Create Custom Agent Files

| Agent | Purpose | Tools |
|-------|---------|-------|
| `alex-planner.agent.md` | Architecture planning | search, usages, fetch |
| `alex-meditation.agent.md` | Memory consolidation | alex tools |
| `alex-reviewer.agent.md` | Code review | search, usages |
| `alex-learning.agent.md` | Domain learning | all |

### Phase 3: MCP Server Development

Consider creating `alex-mcp-server` for:
- Cross-platform knowledge access
- M365 Copilot integration
- Remote/shared team knowledge bases

---

## Best Practices

### Tool Development

1. **Naming**: Use `{verb}_{noun}` format
2. **Descriptions**: Be detailed and specific about when to use/not use
3. **Errors**: Throw with LLM-friendly messages including recovery suggestions
4. **Confirmation**: Provide meaningful context in confirmation dialogs
5. **Constraints**: Document limitations in `modelDescription`

### Chat Participant Development

1. **One participant per extension** (UI scalability)
2. **Slash commands** for common operations
3. **Follow-ups** as questions, not commands
4. **Detection** with specific, non-conflicting descriptions
5. **Streaming** for responsive UX

### Custom Agent Design

1. **Single responsibility** per agent
2. **Minimal tool set** (only what's needed)
3. **Clear handoffs** for multi-step workflows
4. **Reusable instructions** via markdown links

### Security

1. **MCP trust**: Only use servers from trusted sources
2. **API keys**: Use input variables, never hardcode
3. **Confirmation**: Always for destructive operations
4. **Rate limits**: Handle gracefully, inform user

---

## References

- [VS Code AI Extensibility Overview](https://code.visualstudio.com/api/extension-guides/ai/ai-extensibility-overview)
- [Language Model Tools API](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [Chat Participant API](https://code.visualstudio.com/api/extension-guides/ai/chat)
- [Language Model API](https://code.visualstudio.com/api/extension-guides/ai/language-model)
- [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [MCP Servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [GitHub MCP Registry](https://github.com/mcp)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)

---

## Synapses

```yaml
connections:
  - target: "COGNITIVE-ARCHITECTURE.md"
    type: "Implements"
    strength: 0.9
    context: "Alex cognitive patterns validated by Microsoft's extensibility model"

  - target: "COPILOT-INTEGRATION.md"
    type: "Extends"
    strength: 0.8
    context: "Detailed API reference for existing integration"

  - target: "MASTER-HEIR-ARCHITECTURE.md"
    type: "Informs"
    strength: 0.7
    context: "MCP potential for heir unification"

  - target: "../platforms/vscode-extension/"
    type: "Guides"
    strength: 0.9
    context: "Implementation reference for VS Code heir"
```

---

*Document generated from official Microsoft documentation, January 2026*
