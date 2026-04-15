---
description: "Microsoft Teams app patterns — bots, tabs, M365 Copilot agents, and Teams manifest management"
application: "When implementing teams app patterns or reviewing code that uses these patterns"
applyTo: "**/*teams*,**/*m365*"
inheritance: heir:m365
---

# Teams App Patterns — Auto-Loaded Rules

DA v1.6 schema, icon requirements, CLI workflow, package checklist → see teams-app-patterns skill.

## First Principle: MCP Tools Before Manual Work

| Tool | When |
| ---- | ---- |
| `mcp_m365agentstoo_troubleshoot` | Any Teams/M365 error or failure |
| `mcp_m365agentstoo_get_schema` | Validate manifest structure |
| `mcp_m365agentstoo_get_knowledge` | Capability and feature questions |
| `mcp_m365agentstoo_get_code_snippets` | Working code examples |

```
@m365agents My declarative agent shows no conversation starters
@m365agents Get the declarative agent manifest v1.6 schema
```

Always call MCP tools before manual research or debugging.

Every Teams app package must contain:
- [ ] `manifest.json` — Teams app manifest (v1.19+)
- [ ] `declarativeAgent.json` — Agent config (v1.2, v1.5, or v1.6)
- [ ] `color.png` — 192×192 solid background
- [ ] `outline.png` — 32×32 white-on-transparent
- [ ] All icons referenced in `manifest.json` present in zip

## Manifest Schema Patterns

### DA v1.6 Required Fields

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
  "version": "v1.6",
  "name": "Agent Name",
  "description": "Agent description for users",
  "instructions": "$[file('instructions.md')]"
}
```

### Conversation Starters

```json
{
  "conversation_starters": [
    { "text": "What can you help me with?", "title": "Get started" },
    { "text": "Show me recent documents", "title": "Recent docs" }
  ]
}
```

## Icon Requirements

| Icon | Size | Background | Format |
|------|------|------------|--------|
| color.png | 192×192 | Solid color | PNG |
| outline.png | 32×32 | Transparent | PNG (white only) |

Icons must be included in the Teams app zip at root level.

## CLI Workflow

```bash
# Validate manifest
npx @m365agents/toolkit validate

# Package for deployment
npx @m365agents/toolkit package --output ./dist

# Sideload for testing
npx @m365agents/toolkit sideload --tenant $TENANT_ID
```

## Troubleshooting Checklist

1. **No conversation starters** → Check `conversation_starters` array in DA manifest
2. **Agent not responding** → Verify `instructions` file path is correct
3. **Icon missing** → Ensure icons are at zip root, not in subfolders
4. **Sideload fails** → Check tenant admin consent and app permissions
