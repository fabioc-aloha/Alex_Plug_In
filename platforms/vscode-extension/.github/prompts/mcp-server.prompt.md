# Create MCP Server

**Purpose**: Scaffold a complete, production-ready MCP server with tools, resources, error handling, and VS Code integration
**Domain**: AI infrastructure, Model Context Protocol
**Duration**: 20-45 minutes depending on complexity
**Output**: Working MCP server with full schema, transport, and workspace config

---

## Workflow

5 steps to a production MCP server:

1. **Scope Definition** — what the server exposes (tools vs resources vs both)
2. **Server Scaffold** — initialization, transport, package.json
3. **Tool Implementation** — schema design + handler logic
4. **Resource Implementation** — URI design + content handlers
5. **VS Code Integration** — `.vscode/mcp.json`, testing with Inspector

---

## Step 1: Scope Definition

Before writing code, clarify:

- What external system/data source is being wrapped?
- What actions should the AI be able to take? → **Tools**
- What data should the AI be able to read? → **Resources**
- Does this need to be accessible remotely? → **Transport** (stdio vs HTTP)

Output: A named list of tools + resources with one-line descriptions.

---

## Step 2: Server Scaffold

**Initialize project:**
```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node ts-node
```

**`src/server.ts`:**
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
    name: '{server-name}',
    version: '1.0.0'
});

// Tool and resource registrations here

const transport = new StdioServerTransport();
await server.connect(transport);
```

**`package.json` additions:**
```json
{
    "main": "dist/server.js",
    "scripts": {
        "build": "tsc",
        "start": "node dist/server.js",
        "inspect": "npx @modelcontextprotocol/inspector node dist/server.js"
    }
}
```

---

## Step 3: Tool Implementation

For each tool in the scope list, generate:

```typescript
server.tool(
    '{verb_noun}',           // snake_case, action-oriented
    '{description}',         // what it does, when to use, what it returns
    {
        param1: z.string().describe('{what this parameter means}'),
        param2: z.number().optional().describe('{optional param description}')
    },
    async ({ param1, param2 }) => {
        try {
            const result = await performAction(param1, param2);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
            };
        } catch (err) {
            return {
                content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
                isError: true
            };
        }
    }
);
```

**Tool naming rules:**
- Verbs: `get_`, `search_`, `create_`, `update_`, `delete_`, `list_`, `read_`
- Always include `isError: true` in catch blocks

---

## Step 4: Resource Implementation

For each data source, generate:

```typescript
// Static resource
server.resource(
    '{resource-id}',
    '{schema}://{path}',
    '{description of what this data represents}',
    async (uri) => ({
        contents: [{
            uri: uri.href,
            text: JSON.stringify(await getData()),
            mimeType: 'application/json'
        }]
    })
);
```

**URI conventions:**
- `{scheme}://` — use consistent scheme per data domain (e.g., `github://`, `db://`, `app://`)
- Path reflects data hierarchy: `github://issues/{owner}/{repo}`

---

## Step 5: VS Code Integration

**Create `.vscode/mcp.json`:**
```json
{
    "servers": {
        "{server-name}": {
            "type": "stdio",
            "command": "node",
            "args": ["${workspaceFolder}/dist/server.js"]
        }
    }
}
```

**Test with Inspector:**
```bash
npm run build
npm run inspect
```

Verify each tool and resource appears correctly in the Inspector UI.

---

## Validation Checklist

- [ ] Every tool: `name` (snake_case), `description` (comprehensive), schema with `describe()`
- [ ] All tool handlers: return `{ content: [...] }`, use `isError: true` in catch
- [ ] Resources: semantic URIs, appropriate `mimeType`
- [ ] Server name + version declared in `McpServer` constructor
- [ ] Build succeeds (`npm run build`)
- [ ] Inspector shows all tools and resources
- [ ] `.vscode/mcp.json` created for workspace integration

---

## Sample

User: "/mcpServer"

Alex:
1. Asks: What system are you wrapping? What actions (tools) and what data (resources)?
2. [After answers] Scaffolds project structure + `server.ts`
3. Generates each tool with schema, handler, and error handling
4. Generates each resource with URI and content handler
5. Creates `.vscode/mcp.json` for workspace integration
6. Provides Inspector test command + validation checklist

**Cross-reference**: `.github/instructions/mcp-development.instructions.md`
