---
description: "Microsoft Graph API integration — endpoint calls, MSAL/OAuth authentication, and M365 service patterns"
applyTo: "**/*graph*,**/*msal*,**/*oauth*,**/*entra*"
---

# Microsoft Graph API — Auto-Loaded Rules

Endpoint reference table, scope catalog, service-specific patterns → see microsoft-graph-api skill.
This instruction covers runtime patterns: auth flow, error handling, pagination, retry.

## Authentication Protocol

### Principle of Least Privilege

**Always start minimal and add incrementally:**

```typescript
// Initial auth — request only what's needed now
const INITIAL_SCOPES = ['User.Read'];

// Full feature scopes — requested when feature is used
const MAIL_SCOPES = ['User.Read', 'Mail.Read'];
const CALENDAR_SCOPES = ['User.Read', 'Calendars.Read'];
```

**Never request all scopes upfront** — users reject consent dialogs with too many permissions.

### VS Code Authentication Pattern

```typescript
async function getGraphToken(scopes: string[]): Promise<string | null> {
    const session = await vscode.authentication.getSession(
        'microsoft',
        scopes,
        { createIfNone: false }  // Silent first — ask only if needed
    );
    return session?.accessToken ?? null;
}

// For user-triggered actions that need consent:
async function requestGraphAccess(scopes: string[]): Promise<string | null> {
    const session = await vscode.authentication.getSession(
        'microsoft',
        scopes,
        { createIfNone: true }   // Show sign-in UI if no session
    );
    return session?.accessToken ?? null;
}
```

### API Version Selection

| Version | Use For |
| ------- | ------- |
| **v1.0** (default) | All production code |
| **beta** | Exploration only — never ship code pointing to `/beta` |

```typescript
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0';
```

---

## Error Classification

Handle Graph errors by HTTP status code:

| Code | Meaning | Action |
| ---- | ------- | ------ |
| `401` | Token expired or invalid | Refresh token, re-authenticate |
| `403` | Insufficient permissions | Request correct scope, inform user |
| `404` | Resource not found | Check resource ID, handle gracefully |
| `429` | Rate limited | Read `Retry-After` header, implement backoff |
| `503` | Service unavailable | Retry with exponential backoff |

```typescript
async function callGraph(token: string, endpoint: string): Promise<unknown> {
    const response = await fetch(`${GRAPH_ENDPOINT}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') ?? '5');
        await sleep(retryAfter * 1000);
        return callGraph(token, endpoint); // One retry
    }

    if (!response.ok) {
        const error = await response.json();
        throw new GraphError(response.status, error.error?.message ?? 'Graph API error');
    }

    return response.json();
}
```

---

## Pagination Pattern

**All list endpoints return paginated results.** Always handle `@odata.nextLink`:

```typescript
async function* getAllPages<T>(token: string, firstUrl: string): AsyncGenerator<T[]> {
    let url: string | undefined = firstUrl;
    while (url) {
        const response = await callGraph(token, url.replace(GRAPH_ENDPOINT, '')) as {
            value: T[];
            '@odata.nextLink'?: string;
        };
        yield response.value;
        url = response['@odata.nextLink'];
    }
}

// Usage:
for await (const page of getAllPages<User>(token, '/users')) {
    processUsers(page);
}
```

---

## Key Endpoints Quick Reference

### Most Used

```
GET /me                                    — current user profile
GET /me/presence                           — presence status
GET /me/calendar/events                    — calendar events
GET /me/messages                           — mailbox messages
GET /me/people                             — relevant contacts
GET /users/{id}/manager                    — user's manager
POST /communications/getPresencesByUserId  — bulk presence (up to 650 users)
```

### Delta Queries (Efficient Sync)

```
GET /me/calendar/events/delta              — events changed since last sync
GET /me/messages/delta                     — messages changed since last sync
```

---

## Quality Checklist

Before shipping Graph API code:
- [ ] Minimum required scopes only (not all M365 permissions upfront)
- [ ] Silent token acquisition first (`createIfNone: false`)
- [ ] Using v1.0 endpoint (not `/beta`)
- [ ] Pagination handled for all list operations
- [ ] 429 rate limit handling with `Retry-After` header
- [ ] 401/403 errors surface meaningful messages to user
- [ ] Token never logged or exposed in output
