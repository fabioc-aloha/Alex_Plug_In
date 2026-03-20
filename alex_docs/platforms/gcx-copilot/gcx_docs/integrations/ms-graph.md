# Microsoft Graph Integration Guide

> Deep integration with Microsoft 365 — users, groups, calendar, mail, Teams, SharePoint, OneDrive.



## Overview

Microsoft Graph is the unified API gateway to Microsoft 365 data and intelligence. The GCX Copilot has **deep expertise** in Graph patterns, making it your go-to assistant for M365 integrations.



## Prerequisites

| Requirement | Purpose |
|-------------|---------|
| Azure AD App Registration | Authentication |
| API Permissions | Data access |
| Azure Key Vault | Credential storage |



## Setup

### Step 1: Register Azure AD Application

```
@workspace Guide me through registering an Azure AD app for MS Graph
```

**Manual Steps:**
1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory
2. App registrations → New registration
3. Name: `gcx-ai-agent-graph`
4. Supported account types: Single tenant (or as needed)
5. Redirect URI: (configure based on auth flow)

### Step 2: Configure API Permissions

**Delegated (user context):**
```
User.Read
Calendars.Read
Mail.Read
```

**Application (daemon/service):**
```
User.Read.All
Group.Read.All
```

### Step 3: Store Credentials

```
@workspace Set up Key Vault for MS Graph credentials
```



## Common Operations

### Users & Groups

```
@workspace Query all users in my organization
```

```
@workspace Get group memberships for a user
```

```
@workspace Find all members of the Engineering team
```

### Calendar & Scheduling

```
@workspace Get my calendar events for next week
```

```
@workspace Find available meeting times for these attendees
```

```
@workspace Create a recurring meeting
```

### Mail

```
@workspace Read my recent emails
```

```
@workspace Send an email with attachments
```

```
@workspace Search emails containing "project update"
```

### Teams

```
@workspace List all Teams I'm a member of
```

```
@workspace Get messages from a Teams channel
```

```
@workspace Create a new Teams channel
```

### SharePoint

```
@workspace List files in a SharePoint site
```

```
@workspace Download a document from SharePoint
```

```
@workspace Get site permissions
```

### OneDrive

```
@workspace List my recent OneDrive files
```

```
@workspace Upload a file to OneDrive
```

```
@workspace Share a file with specific users
```



## Advanced Patterns

### Batch Requests

Combine multiple requests for efficiency:

```
@workspace Batch these Graph queries: user profile, calendar, and mail
```

### Delta Queries

Track changes efficiently:

```
@workspace Set up delta sync for user changes
```

### Change Notifications (Webhooks)

Real-time updates:

```
@workspace Set up a webhook for new Teams messages
```

### Permission Scoping

Least privilege patterns:

```
@workspace What's the minimum permission for reading user calendars?
```



## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Token expired or invalid | Refresh access token |
| `403 Forbidden` | Insufficient permissions | Add required API permissions |
| `429 Too Many Requests` | Rate limited | Implement exponential backoff |
| `404 Not Found` | Resource doesn't exist | Verify resource ID |

```
@workspace Add Graph API error handling with retry logic
```



## Best Practices

1. **Use least privilege** — Request only permissions you need
2. **Cache tokens** — Don't request new tokens for every call
3. **Batch when possible** — Reduce round trips
4. **Handle throttling** — Implement proper backoff
5. **Use delta queries** — Sync changes efficiently



## Related Skills

- `microsoft-graph-api` — Core Graph patterns
- `msal-authentication` — Authentication flows
- `teams-app-patterns` — Teams-specific integration
