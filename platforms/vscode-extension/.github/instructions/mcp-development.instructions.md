---
description: "MCP server development, tool integration, and Model Context Protocol patterns for AI assistants"
application: "When following mcp development workflows or troubleshooting related issues"
applyTo: "**/*mcp*,**/mcp.json,**/mcp-*.json"
---

# MCP Development — Auto-Loaded Rules

Full MCP architecture, primitives, server patterns, resource design, quality gates → see mcp-development skill.

## Transport Decision

| Transport | Use When |
|-----------|----------|
| **stdio** | Local tools, CLI, VS Code tasks (DEFAULT -- start here) |
| **Streamable HTTP** | Remote services, cloud deployment, multi-client |

## Tool Design Rules

1. Names: `snake_case`, verb-first (`search_issues`, `read_file`)
2. Descriptions: what it does + when to use it + what it returns
3. Parameters: always include `.describe()` for each field
4. Required array: declare all mandatory parameters
5. **Never throw from tool handlers** — return `{ isError: true }` instead:

```typescript
catch (err) {
    return {
        content: [{ type: 'text', text: `Error: ${err.message}` }],
        isError: true
    };
}
```

## VS Code Integration

Declare in `.vscode/mcp.json`:

```json
{
    "servers": {
        "my-server": {
            "type": "stdio",
            "command": "node",
            "args": ["${workspaceFolder}/dist/server.js"],
            "env": { "NODE_ENV": "production" }
        }
    }
}
```

For user-level servers, add to VS Code settings under `mcp.servers`.

## Resource Templates

Use `ResourceTemplate` for dynamic URIs:

```typescript
server.resourceTemplate(
    new ResourceTemplate('app://logs/{date}', { list: undefined }),
    'Application logs for a specific date',
    async (uri, { date }) => ({
        contents: [{ uri: uri.href, text: await readLogs(date), mimeType: 'text/plain' }]
    })
);
```
- [ ] Transport selected appropriately (stdio for local, HTTP for remote)
- [ ] Server name and version declared in `McpServer` constructor
- [ ] Tested with `npx @modelcontextprotocol/inspector` before integration

---

## Pre-Built MCP Servers

### Replicate MCP (AI Model Generation)

The official Replicate MCP server wraps all Replicate HTTP API operations, enabling conversational image/video/audio generation.

**Package**: `replicate-mcp` (v0.9.0+)  
**License**: Apache-2.0  
**Docs**: https://replicate.com/docs/reference/mcp

**VS Code setup** (`.vscode/mcp.json`):
```json
{
    "servers": {
        "replicate": {
            "command": "npx",
            "args": ["-y", "replicate-mcp"],
            "env": {
                "REPLICATE_API_TOKEN": "${input:replicateToken}"
            }
        }
    },
    "inputs": [
        {
            "id": "replicateToken",
            "type": "promptString",
            "description": "Replicate API token",
            "password": true
        }
    ]
}
```

**Available operations**: `models.search`, `models.list`, `models.get`, `predictions.create`, `predictions.get`, `predictions.list`

**When to use**: Model exploration, one-off generations, comparing models. For production pipelines with visual memory and domain knowledge, prefer a project-specific CLI or custom MCP server.

**Alpha feature**: `replicate-mcp@alpha --tools=code` enables TypeScript code execution in a Deno sandbox for multi-step workflows.
