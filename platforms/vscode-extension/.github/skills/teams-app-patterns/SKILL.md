---
applyTo: "**/*teams*,**/*manifest*,**/*m365*"
---

# Teams App Patterns Skill

> Full Teams app development patterns.

## ⚠️ Staleness Warning

Teams platform evolves rapidly. **Last validated:** January 2026 (TTK 5.x, Manifest v1.17)

**Check:** [Teams Docs](https://learn.microsoft.com/en-us/microsoftteams/platform/), [Teams Toolkit](https://github.com/OfficeDev/TeamsFx)

---

## App Package

```text
appPackage/
├── manifest.json
├── outline.png (32x32)
├── color.png (192x192)
└── declarativeAgent.json (optional)
```

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
