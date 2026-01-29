# Alex M365 Agent - Declarative Agent Reference Guide

Complete reference for all settings in the declarativeAgent.json file.

**⚠️ IMPORTANT: See [SCHEMA-COMPATIBILITY.md](SCHEMA-COMPATIBILITY.md) for valid schema versions!**

---

## Quick Links

- [Core Properties](#core-properties)
- [Instructions](#instructions)
- [Capabilities](#capabilities)
- [Conversation Starters](#conversation-starters)
- [Actions (API Plugins)](#actions-api-plugins)

---

## Core Properties

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `$schema` | URL | Yes | - | Schema URL for validation (v1.2 or v1.6 only!) |
| `version` | string | Yes | - | Schema version. Use `v1.2` (stable) or `v1.6` (latest) |
| `name` | string | Yes | 100 chars | Display name for the agent |
| `description` | string | Yes | 1000 chars | Agent description |

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "Alex Cognitive",
  "description": "Your AI learning partner with personality and memory"
}
```

> **Note**: `id` is NOT required in declarativeAgent.json (it's optional)

---

## Instructions

The `instructions` field defines the agent's personality, behavior, and capabilities.

| Field | Type | Max Length | Description |
|-------|------|------------|-------------|
| `instructions` | string | 8000 chars | System prompt defining agent behavior |

### Best Practices

1. **Start with identity** - Who is the agent?
2. **Define personality traits** - How should it communicate?
3. **List capabilities** - What can it do?
4. **Specify protocols** - Special commands/triggers
5. **Set boundaries** - What should it NOT do?
6. **Avoid special characters** - No emojis in JSON values

### Example Structure

```
You are [NAME], [BRIEF DESCRIPTION].

PERSONALITY:
- Trait 1
- Trait 2

CAPABILITIES:
- Capability 1
- Capability 2

PROTOCOLS:
When user says X, do Y.

BOUNDARIES:
Do not do Z.
```

---

## Capabilities

Define what data sources the agent can access.

### v1.2 Schema (Current - Stable)

| Capability | Description |
|------------|-------------|
| `OneDriveAndSharePoint` | Access user's OneDrive and SharePoint files |
| `WebSearch` | Search the web using Bing |
| `GraphConnectors` | Access Graph connector data |
| `GraphicArt` | Generate images (DALL-E) |
| `CodeInterpreter` | Execute Python code |

### v1.5+ Schema ONLY (Not available in v1.2!)

| Capability | Description |
|------------|-------------|
| `TeamsMessages` | Access Teams chats and channels |
| `Email` | Access Outlook emails |
| `People` | Access organization people info |
| `Meetings` | Access calendar meetings (v1.6 only) |

### OneDriveAndSharePoint

```json
{
  "capabilities": [
    {
      "name": "OneDriveAndSharePoint",
      "items_by_url": [
        {
          "url": "https://tenant.sharepoint.com/sites/SiteName"
        }
      ],
      "items_by_sharepoint_ids": [
        {
          "site_id": "site-guid",
          "web_id": "web-guid",
          "list_id": "list-guid"
        }
      ]
    }
  ]
}
```

**For Alex (user's OneDrive):**
```json
{
  "capabilities": [
    {
      "name": "OneDriveAndSharePoint"
    }
  ]
}
```

Without `items_by_url` or `items_by_sharepoint_ids`, it searches the user's entire OneDrive.

### WebSearch

```json
{
  "capabilities": [
    {
      "name": "WebSearch"
    }
  ]
}
```

### GraphConnectors

```json
{
  "capabilities": [
    {
      "name": "GraphConnectors",
      "connections": [
        {
          "connection_id": "connector-id-here"
        }
      ]
    }
  ]
}
```

### Multiple Capabilities

```json
{
  "capabilities": [
    { "name": "OneDriveAndSharePoint" },
    { "name": "WebSearch" }
  ]
}
```

---

## Conversation Starters

Suggested prompts shown to users when they start a chat.

| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `conversation_starters` | array | 10 | Suggested prompts |
| `conversation_starters[].title` | string | 50 chars | Button text |
| `conversation_starters[].text` | string | 250 chars | Full prompt sent |

### Best Practices

1. **Show key features** - Help users discover capabilities
2. **Vary the topics** - Different use cases
3. **Include setup prompts** - For first-time users
4. **Use action verbs** - "Help me...", "Let's...", "Show me..."

### Example

```json
{
  "conversation_starters": [
    {
      "title": "🚀 Get Started",
      "text": "Hi Alex! Help me set up my memory folder in OneDrive"
    },
    {
      "title": "📚 Learn Something",
      "text": "I want to learn about a new topic. Can you help me explore it?"
    },
    {
      "title": "🧘 Meditate",
      "text": "Let's meditate and consolidate what we learned today"
    },
    {
      "title": "🌙 Dream Review",
      "text": "Review my knowledge and identify any gaps"
    },
    {
      "title": "🎯 Check Goals",
      "text": "How am I progressing on my learning goals?"
    }
  ]
}
```

---

## Actions (API Plugins)

Connect the agent to external APIs.

| Field | Type | Description |
|-------|------|-------------|
| `actions` | array | API plugin references |
| `actions[].id` | string | Unique action ID |
| `actions[].file` | file path | Path to API plugin manifest |

### API Plugin Structure

```
appPackage/
├── declarativeAgent.json
├── apiPlugin.json
└── apiDefinition.json (or .yaml)
```

### declarativeAgent.json

```json
{
  "actions": [
    {
      "id": "alexMemoryApi",
      "file": "apiPlugin.json"
    }
  ]
}
```

### apiPlugin.json

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "Alex Memory API",
  "description_for_human": "Save and retrieve memories",
  "namespace": "alexMemory",
  "functions": [
    {
      "name": "saveInsight",
      "description": "Save a learning insight",
      "capabilities": {
        "response_semantics": {
          "data_path": "$.result"
        }
      }
    }
  ],
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": { "type": "None" },
      "spec": {
        "url": "apiDefinition.json"
      }
    }
  ]
}
```

### Authentication Types

| Type | Description |
|------|-------------|
| `None` | No authentication |
| `OAuthPluginVault` | OAuth via Plugin Vault |
| `ApiKeyPluginVault` | API key via Plugin Vault |

---

## Complete Example

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.3/schema.json",
  "version": "v1.3",
  "id": "alexCognitiveAgent",
  "name": "Alex Cognitive 🦖",
  "description": "Your AI learning partner with personality and memory",

  "instructions": "You are Alex, a cognitive architecture...",

  "capabilities": [
    { "name": "OneDriveAndSharePoint" },
    { "name": "WebSearch" }
  ],

  "conversation_starters": [
    {
      "title": "🚀 Get Started",
      "text": "Hi Alex! Help me set up my memory folder"
    },
    {
      "title": "🧘 Meditate",
      "text": "Let's consolidate our learnings"
    }
  ],

  "actions": [
    {
      "id": "alexMemoryApi",
      "file": "apiPlugin.json"
    }
  ]
}
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Agent not responding | Check `id` matches manifest |
| Capabilities not working | Ensure user has permissions |
| Conversation starters missing | Max 10, check character limits |
| Instructions truncated | Max 8000 characters |

### Validation

```powershell
teamsapp validate --app-package-file-path ./appPackage/build/appPackage.dev.zip
```

---

## See Also

- [Manifest Reference](./MANIFEST-REFERENCE.md)
- [Declarative Agent Schema](https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.3/schema.json)
- [Microsoft Docs](https://learn.microsoft.com/microsoft-365-copilot/extensibility/build-declarative-agents)

---

*Generated for Alex Cognitive v4.0.0 QUADRUNIUM "Dino" 🦖*
