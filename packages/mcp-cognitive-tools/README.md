# Alex Cognitive Tools MCP Server

Standalone MCP server that exposes Alex's cognitive architecture tools for use with any MCP-compatible AI client.

## Features

- **Synapse Health Check**: Validate cognitive architecture integrity
- **Memory Search**: Search across all Alex memory systems (skills, instructions, prompts, episodic, global knowledge)
- **Architecture Status**: Get current inventory of cognitive components
- **Global Knowledge Search**: Search cross-project patterns and insights
- **Knowledge Save**: Persist new insights to the global knowledge base

## Installation

```bash
npm install -g @alex/mcp-cognitive-tools
```

Or use directly with npx:

```bash
npx @alex/mcp-cognitive-tools
```

## Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "alex-cognitive": {
      "command": "npx",
      "args": ["@alex/mcp-cognitive-tools"]
    }
  }
}
```

### VS Code MCP Gallery

The server will appear in the MCP Gallery when installed globally.

### Cline / Continue

```json
{
  "mcp": {
    "servers": {
      "alex-cognitive": {
        "command": "alex-mcp"
      }
    }
  }
}
```

## Tools Reference

### alex_synapse_health

Check the health of Alex's cognitive architecture.

```
Input:
  workspacePath?: string  # Path to workspace (defaults to cwd)

Output:
  - status: EXCELLENT | GOOD | NEEDS_ATTENTION
  - skills, instructions, prompts, agents, synapses counts
  - brokenSynapses count
```

### alex_memory_search

Search across all memory systems.

```
Input:
  query: string           # Search query
  memoryType?: string     # all | skills | instructions | prompts | episodic | global
  limit?: number          # Max results (default: 10)

Output:
  - Array of matches with type, name, path, snippet
```

### alex_architecture_status

Get current architecture inventory.

```
Input:
  workspacePath?: string  # Path to workspace (defaults to cwd)

Output:
  - Component counts (skills, instructions, prompts, agents)
  - Global knowledge stats
  - Version info
```

### alex_knowledge_search

Search global knowledge base.

```
Input:
  query: string           # Search query
  category?: string       # patterns | insights | all
  limit?: number          # Max results (default: 10)

Output:
  - Array of matching insights with category, title, path, snippet
```

### alex_knowledge_save

Save insight to global knowledge.

```
Input:
  title: string           # Brief title
  content: string         # Full insight (markdown)
  category: string        # architecture | patterns | debugging | best-practices | lessons-learned
  tags?: string[]         # Tags for discoverability

Output:
  - Confirmation with saved file path
```

## Requirements

- Node.js 18+
- Alex cognitive architecture installed in target workspace (for workspace-specific tools)
- `~/.alex/global-knowledge/` directory for global knowledge features

## Development

```bash
# Clone the repo
git clone https://github.com/yourusername/alex-cognitive-architecture
cd packages/mcp-cognitive-tools

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js
```

## License

MIT - See [LICENSE](../../LICENSE.md)
