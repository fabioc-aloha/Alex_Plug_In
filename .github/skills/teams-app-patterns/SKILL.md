---
name: "Teams App Patterns Skill"
description: "Full Teams app development patterns."
applyTo: "**/*teams*,**/*manifest*,**/*m365*"
---

# Teams App Patterns Skill

> Full Teams app development patterns.

## ⚠️ Staleness Warning

Teams platform evolves rapidly. **Last validated:** February 7, 2026 (TTK CLI 3.1.0, Manifest v1.19, DA v1.6)

**Check:** [Teams Docs](https://learn.microsoft.com/en-us/microsoftteams/platform/), [Teams Toolkit](https://github.com/OfficeDev/TeamsFx)

---

## ⚠️ Critical: Declarative Agent v1.6 Schema

**declarativeAgent.json** for M365 Copilot agents has specific schema requirements:

| Field | Wrong (Pre-v1.6) | Correct (v1.6) |
|-------|------------------|----------------|
| `disclaimer` | `"text string"` | `{ "text": "..." }` |
| `behavior_overrides.suggestions` | `false` | `{ "disabled": false }` |
| `behavior_overrides.special_instructions` | `"text string"` | `{ "discourage_model_knowledge": false }` |
| `user_overrides` | `{ "capabilities": [...] }` | `[ { "path": "$.capabilities[?(@.name=='X')]", "allowed_actions": ["remove"] } ]` |

**CLI Version Matters:**
- **v2.x**: `--app-package-file` flag, may NOT include declarativeAgent.json in zip (bug)
- **v3.x**: `--package-file` flag, correctly includes declarativeAgent.json

**Upgrade CLI if packaging fails:**
```powershell
npm install -g @microsoft/teamsapp-cli@latest
teamsapp --version  # Should be 3.x
```

---

## App Package

```text
appPackage/
├── manifest.json        # Teams app manifest (schema v1.19+)
├── outline.png          # 32x32, transparent bg, white only
├── color.png            # 192x192, no transparency
└── declarativeAgent.json # Required for M365 Copilot agents (DA v1.6)
```

### Icon Requirements (CRITICAL)
| Icon | Size | Background | Content |
|------|------|------------|---------|
| color.png | 192×192 | Any | Full color logo |
| outline.png | 32×32 | **Transparent** (Alpha=0) | **White only** (255,255,255) |

**❌ Common failures:** Wrong dimensions, outline has gray background, outline uses colors

## Manifest Required Fields

- `$schema`, `manifestVersion`, `version`, `id`
- `name.short`, `name.full`
- `description.short`, `description.full`
- `icons.outline`, `icons.color`
- `developer.*`, `validDomains`

## Bot Handler

```typescript
class MyBot extends TeamsActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => { ... });
    }
}
```

## Adaptive Card Structure

```json
{ "type": "AdaptiveCard", "version": "1.5", "body": [...], "actions": [...] }
```

## Teams SDK

```typescript
await microsoftTeams.app.initialize();
const context = await microsoftTeams.app.getContext();
```

## SSO

```typescript
const token = await microsoftTeams.authentication.getAuthToken();
```

## Toolkit Commands

```powershell
npx teamsapp package --env local
npx teamsapp validate --package-file ...
npx teamsapp preview --env local
```

## Common Issues

| Issue | Solution |
| ----- | -------- |
| Manifest fails | Check schema version |
| Bot not responding | Verify endpoint/tunnel |
| Sideload fails | Enable custom apps in admin |

## Synapses

See [synapses.json](synapses.json) for connections.
