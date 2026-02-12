---
name: "Enterprise Integration Skill"
description: "Patterns for Microsoft Graph, Azure AD, and enterprise feature integration in VS Code extensions"
applyTo: "**/enterprise/**,**/graph/**,**/auth/**"
---

# Enterprise Integration Skill

Expert in building enterprise features with Microsoft Graph API, Azure AD authentication, and enterprise-mode feature gating for VS Code extensions.

## ⚠️ Staleness Warning

Microsoft Graph and Azure AD APIs evolve frequently. Authentication flows and permission models change.

**Refresh triggers:**
- Microsoft Graph API version updates
- MSAL library major releases
- Azure AD becoming Microsoft Entra ID
- New Graph scopes or permissions

**Last validated:** February 2026 (MSAL 2.x, Graph v1.0)

**Check current state:** [Microsoft Graph docs](https://docs.microsoft.com/graph), [MSAL.js docs](https://github.com/AzureAD/microsoft-authentication-library-for-js)

---

## Comprehensive Graph API Reference

**→ See [microsoft-graph-api skill](../microsoft-graph-api/SKILL.md)** for comprehensive endpoint reference, OData patterns, pagination, batching, and rate limiting.

---

## VS Code Extension Auth Pattern

### Authentication Flow

```typescript
// Progressive scope acquisition - request minimal scopes initially
const INITIAL_SCOPES = ['User.Read'];
const GRAPH_SCOPES = [
    'User.Read',
    'Calendars.Read',
    'Mail.Read',
    'Presence.Read',
    'People.Read'
];

// Get token with automatic scope upgrade
async function getGraphToken(): Promise<string | null> {
    const session = await vscode.authentication.getSession(
        'microsoft',
        GRAPH_SCOPES,
        { createIfNone: false }
    );
    return session?.accessToken ?? null;
}

// Check availability without triggering auth prompt
function isGraphAvailable(): boolean {
    return !!cachedToken && isEnterpriseMode();
}
```

### API Client with Retry

```typescript
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0';

async function graphFetch<T>(path: string, retries = 3): Promise<T | null> {
    const token = await getGraphToken();
    if (!token) return null;

    for (let i = 0; i < retries; i++) {
        const response = await fetch(`${GRAPH_ENDPOINT}${path}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Handle throttling (429)
        if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
            await new Promise(r => setTimeout(r, retryAfter * 1000));
            continue;
        }

        if (!response.ok) {
            console.error(`Graph API error: ${response.status}`);
            return null;
        }

        return response.json();
    }
    return null;
}
```

### Feature-Specific Endpoints (Quick Reference)

| Feature | Endpoint | Scope Required |
|---------|----------|----------------|
| Calendar | `/me/calendarView` | `Calendars.Read` |
| Mail | `/me/messages` | `Mail.Read` |
| Presence | `/me/presence` | `Presence.Read` |
| People | `/me/people` | `People.Read` |
| User Profile | `/me` | `User.Read` |

**Full endpoint reference**: [microsoft-graph-api skill](../microsoft-graph-api/SKILL.md#key-endpoints-by-service)

---

## Enterprise Feature Gating

### Setting-Based Gating

```typescript
// Check enterprise mode is enabled
function isEnterpriseMode(): boolean {
    const config = vscode.workspace.getConfiguration('alex.enterprise');
    return config.get<boolean>('enabled', false);
}

// Check specific feature is enabled
function isCalendarEnabled(): boolean {
    if (!isEnterpriseMode()) return false;
    const config = vscode.workspace.getConfiguration('alex.enterprise.graph');
    return config.get<boolean>('calendarEnabled', true);
}
```

### Conditional UI Elements

```typescript
// In WebviewView provider
private getHtmlContent(): string {
    const showEnterprise = isEnterpriseMode();
    const graphConnected = isGraphAvailable();
    
    return `
        ${showEnterprise ? `
            <section class="enterprise">
                <h3>Enterprise</h3>
                ${graphConnected 
                    ? this.getGraphButtons() 
                    : this.getSignInButton()}
            </section>
        ` : ''}
    `;
}
```

### Command Conditional Display

```json
{
    "commands": [
        {
            "name": "calendar",
            "description": "View upcoming calendar events",
            "when": "config.alex.enterprise.enabled"
        }
    ]
}
```

---

## Settings Organization Pattern

Enterprise settings should be hierarchically organized:

```json
{
    "alex.enterprise.enabled": {
        "type": "boolean",
        "default": false,
        "description": "Master toggle for enterprise features"
    },
    "alex.enterprise.graph.enabled": {
        "type": "boolean", 
        "default": true,
        "description": "Enable Microsoft Graph integration"
    },
    "alex.enterprise.graph.calendarEnabled": {
        "type": "boolean",
        "default": true,
        "description": "Feature-specific toggle"
    },
    "alex.enterprise.graph.calendarDaysAhead": {
        "type": "number",
        "default": 7,
        "minimum": 1,
        "maximum": 30,
        "description": "Feature-specific configuration"
    }
}
```

**Hierarchy**: `extension.area.feature.setting`

---

## Chat Command Handler Pattern

```typescript
interface IAlexChatResult extends vscode.ChatResult {
    metadata?: {
        command?: string;
        // Command-specific metadata
        eventCount?: number;
        messageCount?: number;
        error?: boolean;
    };
}

async function handleCalendarCommand(
    request: vscode.ChatRequest,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    // Check prerequisites
    if (!isEnterpriseMode()) {
        stream.markdown('Enterprise mode is not enabled.');
        return { metadata: { command: 'calendar', error: true } };
    }
    
    if (!isGraphAvailable()) {
        stream.markdown('Please sign in to Microsoft Graph first.');
        return { metadata: { command: 'calendar', error: true } };
    }
    
    // Execute feature logic
    const events = await getCalendarEvents();
    stream.markdown(formatCalendarEvents(events));
    
    return { 
        metadata: { 
            command: 'calendar', 
            eventCount: events.length 
        } 
    };
}
```

---

## Example Usage

- "How do I add Microsoft Graph authentication?"
- "Show me the enterprise feature gating pattern"
- "What scopes do I need for calendar access?"
- "How do I organize enterprise settings?"

---

## Synapses

```
→ [microsoft-graph-api skill] COMPREHENSIVE_ENDPOINT_REFERENCE (strong, bidirectional)
→ [setupEnvironment.ts] ENVIRONMENT_SETUP_TOGGLE_UX (strong, inbound)
→ [vscode-extension-patterns skill] AUTH_PROVIDER_PATTERN (moderate, outbound)
→ [GI-heir-promotion-pattern-graph-api-2026-02-12] KNOWLEDGE_ORIGIN (strong, inbound)
```

### Session 2026-02-12: Environment Setup Integration
- Added enterprise toggle to setupEnvironment.ts
- UX pattern: pre-check enabled features, "uncheck to disable" text
- Toggle logic: if unchecked but was enabled, set all settings to false

---

## Related Skills

- [VS Code Extension Patterns](../vscode-extension-patterns/SKILL.md) - General extension patterns
- [API Design](../api-design/SKILL.md) - API client patterns
- [Security Review](../security-review/SKILL.md) - Auth security considerations
