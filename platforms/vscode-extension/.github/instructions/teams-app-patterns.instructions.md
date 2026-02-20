# Teams App Patterns Instructions

**Auto-loaded when**: Building Microsoft Teams apps, M365 Copilot declarative agents, bots, tabs, or managing Teams app manifests
**Domain**: Microsoft Teams, M365 platform, declarative agents, Teams Toolkit
**Synapses**: [teams-app-patterns/SKILL.md](../skills/teams-app-patterns/SKILL.md)

---

## Purpose

Apply correct Teams app development patterns: DA v1.6 schema fields, manifest version requirements, CLI workflow, icon specifications, and `@m365agents` MCP tool usage — preventing schema failures, silent capability errors, and sideloading issues.

---

## When This Applies

**File Patterns**:
- `**/manifest.json` — Teams app manifest
- `**/declarativeAgent.json` — Declarative agent configuration
- `**/appPackage/**` — App package assets (icons, manifests)
- `**/teamsapp*.yml` — M365 Agents Toolkit configuration

**Contextual Triggers**:
- Creating or modifying a declarative agent for M365 Copilot
- Troubleshooting Teams app sideloading or validation errors
- Setting up agent capabilities (WebSearch, TeamsMessages, Email, Meetings)
- Building bots, tabs, or adaptive card experiences
- Packaging and publishing a Teams app

---

## First Principle: Use MCP Tools Before Manual Work

The `@m365agents` participant exposes MCP tools. **Always call these before manual research:**

| Tool | When |
| ---- | ---- |
| `mcp_m365agentstoo_troubleshoot` | Any Teams/M365 error or failure |
| `mcp_m365agentstoo_get_schema` | Validate manifest structure |
| `mcp_m365agentstoo_get_knowledge` | Capability and feature questions |
| `mcp_m365agentstoo_get_code_snippets` | Working code examples |

```
// In Copilot Chat:
@m365agents My declarative agent shows no conversation starters
@m365agents Get the declarative agent manifest v1.6 schema
@m365agents How do I add SSO to a Teams tab?
```

---

## Declarative Agent Schema (DA v1.6 — CURRENT)

### Schema Version Field

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6"
}
```

**Critical**: v1.3 and v1.4 do NOT exist — using them makes the entire document invalid. Valid: v1.0, v1.2, v1.5, v1.6.

### v1.6 Field Corrections

| Field | Wrong (Pre-v1.6) | Correct (v1.6) |
| ----- | ---------------- | -------------- |
| `disclaimer` | `"text string"` | `{ "text": "..." }` |
| `behavior_overrides.suggestions` | `false` | `{ "disabled": false }` |
| `behavior_overrides.special_instructions` | `"text string"` | `{ "discourage_model_knowledge": false }` |
| `user_overrides` | `{ "capabilities": [...] }` | `[ { "path": "...", "allowed_actions": [...] } ]` |

### Capability → Schema Version Requirement

| Capability | Minimum Schema |
| ---------- | -------------- |
| WebSearch, GraphicArt, CodeInterpreter | v1.2 |
| TeamsMessages, Email, People | v1.5 |
| Meetings, Dataverse, ScenarioModels | v1.6 |

**Rule**: Never use v1.2 schema with v1.5+ capabilities — results in silent failures.

### Manifest Limits (v1.6)

| Property | Limit |
| -------- | ----- |
| `description` | 1,000 characters |
| `instructions` | 8,000 characters |
| `conversation_starters` | **6 items max** |
| `actions` | 1-10 items |
| `WebSearch.sites` | 4 items |

---

## Icon Requirements

**color.png**: 192×192px, solid color background, logo centered in 120×120 safe zone

**outline.png**: 32×32px, white only (#FFFFFF), **Alpha=0 background (fully transparent)**

Common failure: `Error: Alpha,R,G,B: 255,X,X,X` means the background is opaque — must be Alpha=0.

```powershell
# Verify outline icon transparency:
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("outline.png")
$pixel = $bmp.GetPixel(0, 0)
$bmp.Dispose()
"Alpha: $($pixel.A)"  # Must be 0
```

---

## CLI Workflow

```powershell
# Build package
npx teamsapp package --env local         # v3.x syntax (current)

# Validate
npx teamsapp validate --package-file appPackage/build/*.zip

# Preview in Teams
npx teamsapp preview --env local
```

**Version matters**: CLI v2.x uses `--app-package-file` and may silently omit `declarativeAgent.json` from the zip. Use CLI v3.x+ (`--package-file`).

### Conditional Access Workaround

If `teamsapp auth login m365` fails with `AADSTS530084`:
1. Build package locally
2. Validate with CLI
3. Upload manually at https://dev.teams.microsoft.com/apps

---

## Package Checklist

Every Teams app package must contain:
- [ ] `manifest.json` — Teams app manifest (v1.19+)
- [ ] `declarativeAgent.json` — Agent config (v1.2, v1.5, or v1.6)
- [ ] `color.png` — 192×192 solid background
- [ ] `outline.png` — 32×32 white-on-transparent
- [ ] All icons referenced in `manifest.json` present in zip
