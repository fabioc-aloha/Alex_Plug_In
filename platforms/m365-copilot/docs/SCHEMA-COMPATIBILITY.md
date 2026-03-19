# M365 Copilot Schema Compatibility Reference

> **SINGLE SOURCE OF TRUTH** for what works in M365 Copilot Declarative Agents
>
> Last Updated: 2026-03-19
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

## Current Alex Configuration (v6.7.0)

Alex uses the **v1.6 schema** with 8 capabilities + v1.6 features:

```json
// declarativeAgent.json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
  "version": "v1.6",
  "capabilities": [
    { "name": "OneDriveAndSharePoint" },
    { "name": "WebSearch" },
    { "name": "GraphicArt" },
    { "name": "CodeInterpreter" },
    { "name": "Email" },
    { "name": "TeamsMessages" },
    { "name": "People", "include_related_content": true },
    { "name": "Meetings" },
    { "name": "EmbeddedKnowledge", "files": ["...6 knowledge files"] }
  ],
  "behavior_overrides": { "suggestions": { "disabled": false } },
  "disclaimer": { "text": "..." },
  "user_overrides": ["...capability toggles..."]
}

// manifest.json — v1.19
```

### v1.6 Feature Adoption Status

| v1.6 Feature | Status | Notes |
| --- | --- | --- |
| 8 capabilities | ✅ Using | OneDrive, Web, GraphicArt, Code, Email, Teams, People, Meetings |
| `EmbeddedKnowledge` | ✅ Configured | 6 knowledge files; feature not yet GA at Microsoft |
| `include_related_content` (People) | ✅ Enabled | Gets shared docs/emails/Teams with person lookup |
| `behavior_overrides` | ✅ Configured | Suggestions enabled |
| `disclaimer` | ✅ Configured | Trust signal with open-source attribution |
| `user_overrides` | ✅ Configured | Users can toggle data source capabilities |
| `worker_agents` | ⏳ Preview | Not added — waiting for GA. See readiness doc. |
| `sensitivity_label` | N/A | Only needed with EmbeddedKnowledge GA |

---

## Worker Agents (Preview — Not Production-Ready)

The v1.6 schema supports `worker_agents` for multi-agent orchestration:

```json
{
  "worker_agents": [
    { "id": "P_<title-id-of-worker-agent>" }
  ]
}
```

**Alex as Manager**: Delegate to specialized sub-agents (research, data, compliance).
**Alex as Worker**: Enterprise Copilot delegates cognitive tasks to Alex.

**Status**: Preview. Do not add to production manifest until GA.
**Tracking**: See `alex_docs/platforms/WORKER-AGENT-READINESS.md` for full assessment.

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
