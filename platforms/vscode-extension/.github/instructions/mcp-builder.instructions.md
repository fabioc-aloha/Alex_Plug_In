---
description: "Build and deploy MCP servers with tool registration, handler patterns, and transport configuration"
application: "When creating MCP servers, registering tools, or configuring MCP transports"
applyTo: "**/*mcp*,**/*mcp-server*,**/*mcp-tool*"
---

# MCP Builder Patterns

## Server Structure

```typescript
const server = new McpServer({
  name: 'my-server',
  version: '1.0.0'
});

server.tool('my-tool', {
  description: 'What this tool does',
  parameters: z.object({ input: z.string() }),
  execute: async (args) => ({ result: process(args.input) })
});

server.start();
```

## Tool Registration

| Field | Purpose |
|-------|---------|
| `name` | Tool identifier (snake_case) |
| `description` | When to use this tool |
| `parameters` | Zod schema for input |
| `execute` | Handler function |

## Transport Options

- **stdio**: Local development, CLI
- **HTTP SSE**: Web integration
- **WebSocket**: Bidirectional, real-time

## Anti-Patterns

- Vague tool descriptions
- Missing parameter validation
- No error handling in execute
- Blocking operations without timeout
