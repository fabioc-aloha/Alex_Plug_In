---
name: ms-graph-integration
description: Work with Microsoft Graph API for users, calendar, mail, Teams, SharePoint, and OneDrive. Use when user asks about MS Graph, Microsoft 365 data, or needs to integrate with M365 services.


# Microsoft Graph Integration

Access Microsoft 365 data through Graph API.

## Common Operations

### Users
```
GET /users/{id}
GET /users?$filter=department eq 'Engineering'
```

### Calendar
```
GET /me/events
POST /me/events
GET /users/{id}/calendar/calendarView
```

### Mail
```
GET /me/messages
POST /me/sendMail
```

### Teams
```
GET /teams/{id}
GET /teams/{id}/channels
POST /teams/{id}/channels/{id}/messages
```

### SharePoint
```
GET /sites/{site-id}
GET /sites/{site-id}/lists
GET /sites/{site-id}/drive/items
```

### OneDrive
```
GET /me/drive/root/children
PUT /me/drive/root:/{filename}:/content
```

## Authentication

Use app registration with appropriate permissions:
- `User.Read` — Read user profile
- `Calendars.ReadWrite` — Calendar access
- `Mail.Send` — Send mail
- `ChannelMessage.Send` — Post to Teams

## Best Practices

1. **Minimal permissions** — Request only what's needed
2. **Batch requests** — Combine related calls
3. **Handle throttling** — Implement retry with backoff
4. **Delta queries** — Use for sync scenarios
