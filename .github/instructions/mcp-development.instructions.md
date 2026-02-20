# MCP Development Instructions

**Auto-loaded when**: Building an MCP server, integrating MCP tools, or connecting AI assistants to external data via the Model Context Protocol
**Domain**: AI infrastructure, MCP server development, tool integration
**Synapses**: [mcp-development/SKILL.md](../skills/mcp-development/SKILL.md)

---

## Purpose

Apply correct MCP server patterns: tool schema design, resource URIs, transport selection, error handling, and production hardening — ensuring interoperability across all MCP-compatible hosts (VS Code, Claude Desktop, Cursor, etc.).

---

## When This Applies

**File Patterns**:
- `**/src/server.ts` — MCP server entry point
- `**/src/tools/**` — Tool handler implementations
- `**/mcp.json` or `**/.mcp/config.json` — MCP configuration
- `**/package.json` — Package declaring `mcpServers` or MCP SDK dependencies

**Contextual Triggers**:
- Building a new MCP server
- Connecting AI to a database, API, or file system
- Designing tool schemas for LLM consumption
- Debugging MCP client connection issues
- Choosing between stdio and HTTP+SSE transport

---

## Architecture Decision: Transport

| Transport | Use When | Pros/Cons |
| --------- | -------- | --------- |
| **stdio** | Local tools, CLI, VS Code tasks | Zero config, simple; no remote access |
| **HTTP+SSE** | Remote services, cloud deployment | Network accessible; requires server management |

**Default**: Start with stdio. Upgrade to HTTP+SSE only when remote access is needed.

---

## Tool Design Rules

### Schema Requirements

Every tool MUST have:
1. A clear, action-oriented `name` (verb + noun: `search_issues`, `read_file`)
2. A comprehensive `description` explaining when to use it and what it returns
3. A strict `inputSchema` with all required properties declared
4. `required` array for mandatory parameters

```typescript
server.tool(
    'search_issues',
    'Search GitHub issues in a repository. Returns a list of matching issues with title, state, and URL.',
    {
        repo: z.string().describe('Repository in owner/repo format'),
        query: z.string().describe('Search terms to filter issues'),
        state: z.enum(['open', 'closed', 'all']).default('open').describe('Issue state filter')
    },
    async ({ repo, query, state }) => {
        const results = await searchGitHubIssues(repo, query, state);
        return {
            content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
    }
);
```

**Rules**:
- Tool names: `snake_case`, verb-first
- Descriptions: what it does, when to use it, what it returns
- Parameters: always include `describe()` for each field
- Return: always include `content` array with typed parts

### Tool Error Handling

```typescript
async ({ input }) => {
    try {
        const result = await riskyOperation(input);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    } catch (err) {
        // MCP errors are returned as content, not exceptions
        return {
            content: [{ type: 'text', text: `Error: ${err.message}` }],
            isError: true
        };
    }
}
```

**Rule**: Never let tool handlers throw — use `isError: true` to return errors as structured responses.

---

## Resource Design Rules

```typescript
// Static resource
server.resource(
    'config',
    'app://config/current',
    'Current application configuration',
    async (uri) => ({
        contents: [{
            uri: uri.href,
            text: JSON.stringify(await readConfig()),
            mimeType: 'application/json'
        }]
    })
);

// Resource template (dynamic URIs)
server.resourceTemplate(
    new ResourceTemplate('app://logs/{date}', { list: undefined }),
    'Application logs for a specific date',
    async (uri, { date }) => ({
        contents: [{ uri: uri.href, text: await readLogs(date), mimeType: 'text/plain' }]
    })
);
```

---

## Server Initialization Pattern

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
    name: 'my-mcp-server',
    version: '1.0.0'
});

// Register all tools and resources here
registerTools(server);
registerResources(server);

// Connect transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## VS Code Integration

Declare in workspace `.vscode/mcp.json`:

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

---

## Quality Gates

Before shipping an MCP server:
- [ ] Every tool has `name`, `description`, and `inputSchema` with `required`
- [ ] All parameter descriptions filled in (`z.string().describe(...)`)
- [ ] Tool handlers return `{ content: [...] }` — never throw
- [ ] Errors returned with `isError: true`
- [ ] Transport selected appropriately (stdio for local, HTTP for remote)
- [ ] Server name and version declared in `McpServer` constructor
- [ ] Tested with `npx @modelcontextprotocol/inspector` before integration
