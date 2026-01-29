# M365 Copilot Schema Compatibility Reference

> **SINGLE SOURCE OF TRUTH** for what works in M365 Copilot Declarative Agents
>
> Last Updated: 2026-01-29
> Based on: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest

---

## ⚠️ CRITICAL: Schema Versions That Exist

| Version | Status | URL |
|---------|--------|-----|
| **v1.0** | Old | `declarative-agent/v1.0/schema.json` |
| **v1.2** | ✅ Stable | `declarative-agent/v1.2/schema.json` |
| **v1.5** | Newer | `declarative-agent/v1.5/schema.json` |
| **v1.6** | ✅ Latest | `declarative-agent/v1.6/schema.json` |
| ~~v1.3~~ | ❌ **DOES NOT EXIST** | - |
| ~~v1.4~~ | ❌ **DOES NOT EXIST** | - |

> **We were using v1.3 which doesn't exist!** This caused the agent to fail silently.

---

## Capabilities by Schema Version

### v1.2 (Currently Used - STABLE)

| Capability | Status | Description |
|------------|:------:|-------------|
| `OneDriveAndSharePoint` | ✅ | Access user's OneDrive and SharePoint files |
| `WebSearch` | ✅ | Search the web (Bing) |
| `GraphConnectors` | ✅ | Access enterprise Graph connectors |
| `GraphicArt` | ✅ | Generate images with DALL-E |
| `CodeInterpreter` | ✅ | Execute Python code |

### v1.5+ ONLY (NOT in v1.2!)

| Capability | v1.5 | v1.6 | Description |
|------------|:----:|:----:|-------------|
| `TeamsMessages` | ✅ | ✅ | Search Teams chats/channels |
| `Email` | ✅ | ✅ | Search Outlook emails |
| `People` | ✅ | ✅ | Search organization people |
| `Meetings` | ✅ | ✅ | Search calendar meetings |
| `Dataverse` | ❌ | ✅ | Access Power Platform data |
| `ScenarioModels` | ❌ | ✅ | Custom AI models |
| `EmbeddedKnowledge` | ❌ | ✅ | Local files in package (NOT YET AVAILABLE) |

---

## ⚠️ "Unrecognized Properties" Rule

From Microsoft docs:
> "JSON objects defined in this document support only the described properties. **Unrecognized or extraneous properties in any JSON object make the entire document invalid.**"

This means:
- Using `People` capability in v1.2 schema → **INVALID DOCUMENT**
- Using any property not in the schema → **INVALID DOCUMENT**
- The agent will fail silently or not respond

---

## Conversation Starters Limits

| Schema | Max Items | Notes |
|--------|:---------:|-------|
| v1.2 | 12 | - |
| v1.6 | 6 | Reduced limit in newer schema |

---

## Instructions Limit

| Property | Max Length |
|----------|:----------:|
| `name` | 100 characters |
| `description` | 1,000 characters |
| `instructions` | **8,000 characters** |

---

## Teams App Manifest (manifest.json)

| Version | Status | Notes |
|---------|--------|-------|
| v1.17 | Works | Older, minimal features |
| v1.18 | Works | - |
| v1.19 | ✅ Recommended | Good balance |
| v1.20-v1.23 | Works | - |
| v1.24 | Works | Newer features |
| v1.25 | ⚠️ | Some features not yet supported |

---

## Current Alex Configuration (v4.4.0)

```json
// declarativeAgent.json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "capabilities": [
    { "name": "OneDriveAndSharePoint" },
    { "name": "WebSearch" },
    { "name": "GraphicArt" },
    { "name": "CodeInterpreter" }
  ]
}

// manifest.json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19"
}
```

---

## Upgrading to v1.6 (Future)

When upgrading to schema v1.6 to get People, Email, TeamsMessages, Meetings:

1. Change `$schema` to v1.6 URL
2. Change `version` to `"v1.6"`
3. Add new capabilities
4. Reduce conversation_starters to max 6
5. Test thoroughly - may have portal compatibility issues

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
  "version": "v1.6",
  "capabilities": [
    { "name": "OneDriveAndSharePoint" },
    { "name": "WebSearch" },
    { "name": "GraphicArt" },
    { "name": "CodeInterpreter" },
    { "name": "TeamsMessages" },
    { "name": "Email" },
    { "name": "People" },
    { "name": "Meetings" }
  ]
}
```

---

## Validation Checklist

Before uploading any package:

- [ ] Schema URL points to a REAL schema (v1.0, v1.2, v1.5, or v1.6)
- [ ] `version` field matches schema (e.g., `"v1.2"` for v1.2 schema)
- [ ] All capabilities are valid for that schema version
- [ ] No extra/unknown properties in any JSON object
- [ ] Instructions under 8,000 characters
- [ ] No emojis in JSON property values (can cause issues)
- [ ] conversation_starters within limit for schema version

---

## References

- [Schema v1.2 Docs](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.2)
- [Schema v1.6 Docs](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.6)
- [Build Declarative Agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/build-declarative-agents)
