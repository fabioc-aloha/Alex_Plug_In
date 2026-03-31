---
description: "Microsoft Teams app patterns — bots, tabs, M365 Copilot agents, and Teams manifest management"
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
