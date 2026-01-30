---
applyTo: "**/*teams*,**/*manifest*,**/*m365*"
---

# Teams App Patterns Skill

> Beyond declarative agents — full Teams app development patterns.

## ⚠️ Staleness Warning

Teams platform and M365 APIs evolve rapidly with each release cycle.

**Refresh triggers:**

- Teams Toolkit updates
- Manifest schema versions
- Graph API changes
- M365 Copilot extensibility updates

**Last validated:** January 2026 (TTK 5.x, Manifest v1.17)

**Check current state:** [Teams Platform Docs](https://learn.microsoft.com/en-us/microsoftteams/platform/), [Teams Toolkit](https://github.com/OfficeDev/TeamsFx)

---

## App Package Structure

```text
appPackage/
├── manifest.json        # App definition
├── outline.png          # 32x32 outline icon
├── color.png           # 192x192 color icon
├── declarativeAgent.json   # Copilot agent (if applicable)
└── ...
```

## Manifest Essentials

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.17/MicrosoftTeams.schema.json",
  "manifestVersion": "1.17",
  "version": "1.0.0",
  "id": "{{APP_ID}}",
  "name": {
    "short": "My App",
    "full": "My Teams Application"
  },
  "description": {
    "short": "Brief description",
    "full": "Detailed description for store listing"
  },
  "icons": {
    "outline": "outline.png",
    "color": "color.png"
  },
  "accentColor": "#FFFFFF",
  "developer": {
    "name": "Your Company",
    "websiteUrl": "https://example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsOfUseUrl": "https://example.com/terms"
  },
  "validDomains": ["example.com"]
}
```

## Bot Development

```typescript
// Bot handler
export class MyBot extends TeamsActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            const text = context.activity.text;
            await context.sendActivity(`You said: ${text}`);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            for (const member of context.activity.membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome!');
                }
            }
            await next();
        });
    }
}
```

## Adaptive Cards

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "Hello, World!",
      "size": "Large",
      "weight": "Bolder"
    },
    {
      "type": "Input.Text",
      "id": "userInput",
      "placeholder": "Enter something..."
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Submit",
      "data": { "action": "submit" }
    }
  ]
}
```

## Message Extensions

```typescript
// Search-based message extension
this.handleTeamsMessagingExtensionQuery = async (context, query) => {
    const searchQuery = query.parameters?.[0]?.value;
    const results = await searchDatabase(searchQuery);

    return {
        composeExtension: {
            type: 'result',
            attachmentLayout: 'list',
            attachments: results.map(r => ({
                preview: CardFactory.thumbnailCard(r.title),
                content: createAdaptiveCard(r)
            }))
        }
    };
};
```

## Tab Development

```typescript
// Tab configuration
app.get('/configure', (req, res) => {
    res.render('configure', {
        contentUrl: `${process.env.PUBLIC_URL}/tab`,
        entityId: 'myTab'
    });
});

// Tab content
app.get('/tab', (req, res) => {
    const context = req.query.context;
    res.render('tab', { context: JSON.parse(context) });
});
```

### Teams JavaScript SDK

```typescript
import * as microsoftTeams from '@microsoft/teams-js';

await microsoftTeams.app.initialize();

const context = await microsoftTeams.app.getContext();
console.log('Team ID:', context.team?.internalId);
console.log('User:', context.user?.userPrincipalName);
```

## Authentication

### SSO with Azure AD

```typescript
// Get SSO token
const token = await microsoftTeams.authentication.getAuthToken();

// Exchange for Graph token
const graphToken = await exchangeToken(token);

// Call Graph API
const me = await graphClient.api('/me').get();
```

## Teams Toolkit Patterns

### Environment Variables

```env
# .env.local
TEAMSFX_ENV=local
APP_ID=your-app-id
BOT_ID=your-bot-id
```

### Provision & Deploy

```powershell
# Provision resources
npx teamsapp provision --env dev

# Deploy code
npx teamsapp deploy --env dev

# Package for distribution
npx teamsapp package --env dev
```

## Common Gotchas

| Issue | Solution |
| ----- | -------- |
| Manifest validation fails | Check schema version, required fields |
| SSO token expired | Handle token refresh |
| Card not rendering | Check Adaptive Card version compatibility |
| Bot not responding | Verify bot endpoint, check ngrok/tunnel |
| Sideload fails | Enable custom app upload in admin center |

## Debugging Tips

```powershell
# Local tunnel for development
npx teamsapp preview --env local

# Check app package
npx teamsapp validate --package-file appPackage/build/*.zip

# View logs
# Azure Portal → App Service → Log Stream
```

## Synapses

See [synapses.json](synapses.json) for connections.
