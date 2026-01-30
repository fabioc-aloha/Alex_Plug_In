# Alex M365 Agent - Manifest Reference Guide

Complete reference for all configurable settings in the Teams/M365 app manifest.

**Schema Version:** 1.25 (January 2026)

---

## Quick Links

- [Core Identity](#core-identity)
- [Developer Information](#developer-information)
- [App Display](#app-display)
- [Copilot Agents](#copilot-agents)
- [Agentic User Templates](#agentic-user-templates-v125-new) *(NEW in v1.25)*
- [Channel Features](#channel-features-v125-new) *(NEW in v1.25)*
- [Permissions & Authorization](#permissions--authorization)
- [Localization](#localization)
- [Activity Notifications](#activity-notifications)
- [Install & Admin Settings](#install--admin-settings)
- [Developer Portal Settings](#developer-portal-settings-not-in-manifest)

---

## Core Identity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | URL | Yes | Schema URL for validation |
| `manifestVersion` | string | Yes | Schema version. Current: `1.25` |
| `version` | semver | Yes | App version (e.g., `4.1.0`). Increment when updating |
| `id` | GUID | Yes | Unique app ID. Generate once, never change |

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.25/MicrosoftTeams.schema.json",
  "manifestVersion": "1.25",
  "version": "4.1.0",
  "id": "e29bc39c-1f78-4732-ba00-a6cea76db5b1"
}
```

---

## Developer Information

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `developer.name` | string | Yes | 32 chars | Display name for developer/company |
| `developer.websiteUrl` | HTTPS URL | Yes | 2048 chars | Support/info website |
| `developer.privacyUrl` | HTTPS URL | Yes | 2048 chars | Privacy policy page |
| `developer.termsOfUseUrl` | HTTPS URL | Yes | 2048 chars | Terms of service page |
| `developer.mpnId` | string | No | 10 chars | Microsoft Partner Network ID |

```json
{
  "developer": {
    "name": "Fabio Correa & Alex",
    "websiteUrl": "https://github.com/fabio-correa/alex-cognitive",
    "privacyUrl": "https://github.com/fabio-correa/alex-cognitive/blob/main/PRIVACY.md",
    "termsOfUseUrl": "https://github.com/fabio-correa/alex-cognitive/blob/main/TERMS.md"
  }
}
```

---

## App Display

### Name

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `name.short` | string | Yes | 30 chars | App name in store and UI. Emojis allowed! |
| `name.full` | string | Yes | 100 chars | Full name when space allows |

**Tips:**
- Short name appears in most places - make it memorable
- Emojis work great: `Alex Cognitive `

### Description

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `description.short` | string | Yes | 80 chars | One-line summary for search results |
| `description.full` | string | Yes | 4000 chars | Full description with markdown |

**Full Description Supports:**
- `**bold**` and `*italic*`
- Line breaks (`\n`)
- Unicode symbols (━, ✨, , etc.)
- Bulleted lists

### Icons

| Field | Type | Required | Size | Description |
|-------|------|----------|------|-------------|
| `icons.color` | file path | Yes | 192x192 px | Full color icon (PNG) |
| `icons.outline` | file path | Yes | 32x32 px | Transparent outline icon (PNG) |
| `icons.color32x32` | file path | No | 32x32 px | Full color 32x32 icon for Outlook/M365 app pinning (v1.24+) |

**Requirements:**
- Color icon: 192x192 pixels, full color, can have background
- Outline icon: 32x32 pixels, transparent background, white lines only
- Color32x32 icon: 32x32 pixels, full color, transparent background (optional but recommended)
- All must be PNG format

```json
{
  "icons": {
    "outline": "outline.png",
    "color": "color.png",
    "color32x32": "color32x32.png"
  }
}
```

### Accent Color

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accentColor` | hex color | Yes | Brand color (e.g., `#4F46E5`) |

---

## Copilot Agents

### Declarative Agents (Alex uses this)

Declarative agents run on the same M365 Copilot orchestrator and foundation models, customized with your instructions and capabilities.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `copilotAgents.declarativeAgents` | array | Yes* | Agent references (max 1) |
| `copilotAgents.declarativeAgents[].id` | string | Yes | Unique agent ID |
| `copilotAgents.declarativeAgents[].file` | file path | Yes | Path to declarativeAgent.json |

*Required if `customEngineAgents` is not specified.

```json
{
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "alexCognitiveAgent",
        "file": "declarativeAgent.json"
      }
    ]
  }
}
```

### Custom Engine Agents (v1.24+)

Custom engine agents use your own AI models but appear in the Copilot side panel. Currently in public preview.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `copilotAgents.customEngineAgents` | array | Yes* | Custom agent references (max 1) |
| `customEngineAgents[].id` | string | Yes | Unique agent ID |
| `customEngineAgents[].type` | string | Yes | Must be `"bot"` |
| `customEngineAgents[].disclaimer` | object | No | Custom disclaimer text |

*Required if `declarativeAgents` is not specified.

> **Note:** Alex uses declarative agents to leverage M365 Copilot's built-in capabilities.

---

## Agentic User Templates (v1.25+ NEW)

**NEW in v1.25:** Agentic user templates enable AI agents with their own Microsoft Entra Agent ID within your organization. These agents can have persistent identity for autonomous operations.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agenticUserTemplates` | array | No | Agent 365 blueprint references (max 1) |
| `agenticUserTemplates[].id` | string | Yes | Unique template ID (alphanumeric, dots, underscores, hyphens) |
| `agenticUserTemplates[].file` | file path | Yes | Path to agentic user template file |

```json
{
  "agenticUserTemplates": [
    {
      "id": "alex-agent-identity",
      "file": "agenticUserTemplate.json"
    }
  ]
}
```

**Template File Schema:**
```json
{
  "id": "alex-agent-identity",
  "schemaVersion": "1.0",
  "agentIdentityBlueprintId": "00000000-0000-0000-0000-000000000000"
}
```

> **Use Case:** Register an Agent 365 blueprint in Azure AD portal to give your agent a persistent identity for autonomous workflows, background processing, and proactive actions.

---

## Channel Features (v1.25+ NEW)

**NEW in v1.25:** Opt your app into next-level channel features including shared and private channels.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `supportsChannelFeatures` | string | No | Channel feature tier support |

| Value | Description |
|-------|-------------|
| `tier1` | Full support for shared and private channels |
| (empty) | Standard channel support only |

```json
{
  "supportsChannelFeatures": "tier1"
}
```

> **Note:** This is separate from `supportedChannelTypes` which declares compatibility. `supportsChannelFeatures` enables enhanced channel features.

---

## Permissions & Authorization

### Basic Permissions (Deprecated)

| Value | Description |
|-------|-------------|
| `identity` | Access user identity (name, email) |
| `messageTeamMembers` | Send messages to team members |

### Authorization (Resource-Specific Consent)

The `authorization` block defines granular permissions your app requests:

```json
{
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        {
          "name": "Files.Read.User",
          "type": "Delegated"
        },
        {
          "name": "Mail.ReadWrite.User",
          "type": "Delegated"
        }
      ]
    }
  }
}
```

#### Permission Types

| Type | Description |
|------|-------------|
| `Delegated` | Acts on behalf of the signed-in user |
| `Application` | Acts with app-only permissions (no user context) |

#### Common Permissions for Copilot Agents

| Permission | Type | What It Enables |
|------------|------|-----------------|
| `Files.Read.User` | Delegated | Read user's OneDrive files |
| `Mail.ReadWrite.User` | Delegated | Read/draft emails |
| `ChannelSettings.Read.Group` | Application | Read channel settings |
| `ChatMessage.Read.Chat` | Application | Read chat messages |

### Valid Domains

| Field | Type | Description |
|-------|------|-------------|
| `validDomains` | array | Domains the app can navigate to (max 16) |

Supports wildcards: `*.example.com`

> **Note:** For Pure M365 agents using only native capabilities, `validDomains` can be empty.

---

## Localization

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `localizationInfo.defaultLanguageTag` | language tag | Yes | Default language (e.g., `en-us`) |
| `localizationInfo.additionalLanguages` | array | No | Additional language files |

**To add translations:**
```json
{
  "localizationInfo": {
    "defaultLanguageTag": "en-us",
    "additionalLanguages": [
      { "languageTag": "es-es", "file": "es-es.json" },
      { "languageTag": "pt-br", "file": "pt-br.json" }
    ]
  }
}
```

---

## Activity Notifications

Define notification types the app can send to users.

### Activity Types

| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `activities.activityTypes` | array | 128 | Notification definitions |
| `activityTypes[].type` | string | 64 chars | Unique type identifier |
| `activityTypes[].description` | string | 128 chars | Human-readable description |
| `activityTypes[].templateText` | string | 128 chars | Notification template |
| `activityTypes[].allowedIconIds` | array | - | Reference custom icons (v1.24+) |

**Template Variables:** Use `{variableName}` for dynamic content.

### Activity Icons (v1.24+)

Custom icons for activity notifications:

| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `activities.activityIcons` | array | 50 | Custom icon definitions |
| `activityIcons[].id` | string | - | Unique icon ID (referenced by allowedIconIds) |
| `activityIcons[].iconFile` | file path | - | Path to icon file |

```json
{
  "activities": {
    "activityTypes": [
      {
        "type": "learningReminder",
        "description": "Reminder to consolidate learnings",
        "templateText": "Time to meditate! You have learnings to consolidate.",
        "allowedIconIds": ["meditateIcon"]
      },
      {
        "type": "goalProgress",
        "description": "Learning goal progress update",
        "templateText": "Progress update on your learning goal: {goalName}"
      }
    ],
    "activityIcons": [
      {
        "id": "meditateIcon",
        "iconFile": "meditate-icon.png"
      }
    ]
  }
}
```

---

## Install & Admin Settings

### Default Install Scope

| Value | Description |
|-------|-------------|
| `personal` | Install as personal app |
| `team` | Install to a team |
| `groupChat` | Install to group chat |
| `meetings` | Install to meetings |
| `copilot` | **Install as Copilot agent** (recommended for Alex) |

### Publisher Documentation

| Field | Type | Description |
|-------|------|-------------|
| `publisherDocsUrl` | HTTPS URL | Documentation link for IT admins |

### Configurable Properties

Allow tenant admins to customize these fields:

| Value | Description |
|-------|-------------|
| `name` | App name |
| `shortDescription` | Short description |
| `longDescription` | Full description |
| `smallImageUrl` | Outline icon |
| `largeImageUrl` | Color icon |
| `accentColor` | Brand color |
| `developerUrl` | Website URL |
| `privacyUrl` | Privacy policy URL |
| `termsOfUseUrl` | Terms of use URL |

```json
{
  "defaultInstallScope": "copilot",
  "publisherDocsUrl": "https://github.com/fabio-correa/alex-cognitive/README.md",
  "configurableProperties": ["name", "shortDescription", "longDescription", "accentColor", "privacyUrl", "termsOfUseUrl"]
}
```

### Block Until Admin Action

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultBlockUntilAdminAction` | boolean | false | Require admin approval |

---

## Developer Portal Settings (Not in Manifest)

These are configured in **Teams Developer Portal UI**:

### App Details Page

| Setting | Location | Description |
|---------|----------|-------------|
| **Screenshots** | App details | Up to 5 images (1280x720 or 1920x1080) |
| **Video URL** | App details | YouTube or Vimeo URL |
| **App category** | Publishing | AI, Productivity, etc. |
| **Search keywords** | Publishing | Help users discover the app |

### Publishing Section

| Setting | Description |
|---------|-------------|
| **Admin notes** | Instructions for IT admins |
| **What's new** | Release notes for updates |
| **Testing notes** | Notes for app reviewers |

### Recommended Screenshots for Alex

1. **Welcome/Setup** - First-run "Hi Alex" experience
2. **Personalization** - Alex greeting user by name
3. **Learning Session** - Active conversation about a topic
4. **Meditate Protocol** - Consolidating learnings to OneDrive
5. **Memory Structure** - OneDrive folder organization

---

## See Also

- [Declarative Agent Reference](./DECLARATIVE-AGENT-REFERENCE.md)
- [Teams Manifest Schema v1.25](https://developer.microsoft.com/json-schemas/teams/v1.25/MicrosoftTeams.schema.json)
- [Microsoft Docs - Manifest Schema](https://learn.microsoft.com/microsoft-365/extensibility/schema/root?view=m365-app-1.25)
- [Authorization Permissions](https://learn.microsoft.com/microsoft-365/extensibility/schema/root-authorization?view=m365-app-1.25)
- [Agentic User Templates](https://learn.microsoft.com/microsoft-365/extensibility/schema/agentic-user-template-ref?view=m365-app-1.25) *(NEW in v1.25)*
- [Agent 365 Blueprints](https://learn.microsoft.com/microsoft-agent-365/developer/registration)

---

*Updated for Alex Cognitive v4.1.0 QUADRUNIUM "Dino" - Pure M365 Edition *
