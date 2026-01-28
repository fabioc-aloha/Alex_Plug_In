# Alex M365 Agent - Manifest Reference Guide

Complete reference for all configurable settings in the Teams/M365 app manifest.

---

## Quick Links

- [Core Identity](#core-identity)
- [Developer Information](#developer-information)
- [App Display](#app-display)
- [Declarative Agent](#declarative-agent)
- [Permissions & Domains](#permissions--domains)
- [Localization](#localization)
- [Activity Notifications](#activity-notifications)
- [Install & Admin Settings](#install--admin-settings)
- [Developer Portal Settings](#developer-portal-settings-not-in-manifest)

---

## Core Identity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | URL | Yes | Schema URL for validation |
| `manifestVersion` | string | Yes | Schema version. Current: `1.19` |
| `version` | semver | Yes | App version (e.g., `1.0.0`). Increment when updating |
| `id` | GUID | Yes | Unique app ID. Generate once, never change |

```json
{
  "manifestVersion": "1.19",
  "version": "1.0.0",
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
- Emojis work great: `Alex Cognitive 🦖`

### Description

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `description.short` | string | Yes | 80 chars | One-line summary for search results |
| `description.full` | string | Yes | 4000 chars | Full description with markdown |

**Full Description Supports:**
- `**bold**` and `*italic*`
- Line breaks (`\n`)
- Unicode symbols (━, ✨, 🦖, etc.)
- Bulleted lists

### Icons

| Field | Type | Required | Size | Description |
|-------|------|----------|------|-------------|
| `icons.color` | file path | Yes | 192x192 px | Full color icon (PNG) |
| `icons.outline` | file path | Yes | 32x32 px | Transparent outline icon (PNG) |

**Requirements:**
- Color icon: 192x192 pixels, full color, can have background
- Outline icon: 32x32 pixels, transparent background, white lines only
- Both must be PNG format

### Accent Color

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accentColor` | hex color | Yes | Brand color (e.g., `#4F46E5`) |

---

## Declarative Agent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `copilotAgents.declarativeAgents` | array | Yes | Agent references (max 1) |
| `copilotAgents.declarativeAgents[].id` | string | Yes | Unique agent ID |
| `copilotAgents.declarativeAgents[].file` | file path | Yes | Path to declarativeAgent.json |

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

---

## Permissions & Domains

### Permissions

| Value | Description |
|-------|-------------|
| `identity` | Access user identity (name, email) |
| `messageTeamMembers` | Send messages to team members |

### Valid Domains

| Field | Type | Description |
|-------|------|-------------|
| `validDomains` | array | Domains the app can navigate to (max 16) |

Supports wildcards: `*.example.com`

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

| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `activities.activityTypes` | array | 128 | Notification definitions |
| `activityTypes[].type` | string | 64 chars | Unique type identifier |
| `activityTypes[].description` | string | 128 chars | Human-readable description |
| `activityTypes[].templateText` | string | 128 chars | Notification template |

**Template Variables:** Use `{variableName}` for dynamic content.

```json
{
  "activities": {
    "activityTypes": [
      {
        "type": "learningReminder",
        "description": "Reminder to consolidate learnings",
        "templateText": "Time to meditate! You have learnings to consolidate."
      },
      {
        "type": "goalProgress",
        "description": "Learning goal progress update",
        "templateText": "Progress update on your learning goal: {goalName}"
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
| `personal` | Install as personal app (default for Alex) |
| `team` | Install to a team |
| `groupChat` | Install to group chat |
| `meetings` | Install to meetings |

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
  "defaultInstallScope": "personal",
  "publisherDocsUrl": "https://github.com/fabio-correa/alex-cognitive/README.md",
  "configurableProperties": ["name", "shortDescription", "longDescription", "accentColor"]
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
- [Teams Manifest Schema](https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json)
- [Microsoft Docs](https://learn.microsoft.com/microsoftteams/platform/resources/schema/manifest-schema)

---

*Generated for Alex Cognitive v4.0.0 QUADRUNIUM "Dino" 🦖*
