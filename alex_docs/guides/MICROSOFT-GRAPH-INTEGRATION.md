# Microsoft Graph Integration Guide

> **Bringing VS Code Closer to Microsoft 365**

Alex Cognitive Architecture v5.6.0 introduces deep Microsoft Graph integration, connecting your development environment directly to your Microsoft 365 workspace. This guide covers all features, commands, and real-world use cases.

---

## Overview

Microsoft Graph integration enables Alex to access your:
- **Calendar** — Upcoming meetings, event context, online meeting links
- **Mail** — Recent emails, unread messages, sender information
- **Presence** — Your current availability status
- **People** — Colleagues, org chart, frequent contacts

This creates a unified workspace where coding and collaboration live side-by-side.

---

## Quick Setup

### 1. Enable Enterprise Mode

Add these settings to your VS Code `settings.json`:

```json
{
  "alex.enterprise.enabled": true,
  "alex.enterprise.graph.enabled": true
}
```

### 2. Sign In

When you first use a Graph command, Alex will prompt you to sign in with your Microsoft work or school account. This uses secure OAuth 2.0 with these permissions:

| Permission       | Purpose                      |
| ---------------- | ---------------------------- |
| `Calendars.Read` | View your calendar events    |
| `Mail.Read`      | View your email messages     |
| `Presence.Read`  | See your availability status |
| `People.Read`    | Search your organization     |
| `User.Read`      | Get your profile information |

> **Privacy**: Alex never stores your emails or calendar content. Data is fetched on-demand and displayed only in the current session.

---

## Custom App Registration (For Restricted Tenants)

If you encounter **AADSTS65002** ("Consent between first party application... must be configured via preauthorization"), your organization restricts first-party apps. You'll need to register your own Entra ID app.

### When You Need This

- Corporate tenants that restrict third-party app access
- Organizations requiring admin consent for all apps
- Microsoft internal (`@microsoft.com`) or other restricted tenants

### Step-by-Step Setup

#### 1. Register App in Entra ID

1. Go to [Microsoft Entra admin center](https://entra.microsoft.com/)
2. Navigate to **Identity** → **Applications** → **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: `Alex VS Code Extension` (or your preferred name)
   - **Supported account types**: Choose based on your needs:
     - "Single tenant" for your org only
     - "Multitenant" for any Microsoft account
   - **Redirect URI**: Leave blank (device code flow doesn't need one)
5. Click **Register**
6. Copy the **Application (client) ID** — you'll need this

#### 2. Add API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add these permissions:
   - `User.Read`
   - `Calendars.Read`
   - `Mail.Read`
   - `Presence.Read`
   - `People.Read`
   - `offline_access`
4. Click **Grant admin consent** (requires admin privileges)

#### 3. Enable Public Client Flow

1. Go to **Authentication**
2. Under **Advanced settings**, set **Allow public client flows** to **Yes**
3. Save

#### 4. Configure VS Code

Add to your `settings.json`:

```json
{
  "alex.enterprise.enabled": true,
  "alex.enterprise.graph.enabled": true,
  "alex.enterprise.auth.useCustomApp": true,
  "alex.enterprise.auth.clientId": "YOUR-APPLICATION-CLIENT-ID",
  "alex.enterprise.auth.tenantId": "YOUR-TENANT-ID"
}
```

**Tenant ID Options**:
- Your specific tenant ID (from app registration overview)
- `common` — Any Microsoft account (personal or work)
- `organizations` — Work/school accounts only
- `consumers` — Personal accounts only

#### 5. Sign In

Run **Alex: Enterprise Sign In** command. You'll see a device code flow:
1. A notification shows a code (e.g., `ABC123`)
2. Click "Open Browser" or navigate to https://microsoft.com/devicelogin
3. Enter the code and sign in
4. Return to VS Code — you're authenticated!

---

## Slash Commands

### `/calendar` — View Upcoming Events

See your upcoming meetings and appointments.

**Usage:**
```
@alex /calendar
@alex /calendar 3         # Next 3 days only
@alex /calendar 14        # Next 2 weeks
```

**Example Output:**
```
📅 Upcoming Events (Next 7 Days)

🔵 Sprint Planning
   📆 Mon, Feb 10 • 10:00 AM - 11:30 AM
   📍 Conference Room A / Teams Meeting
   👥 Sarah, Mike, Jennifer

🟢 1:1 with Manager
   📆 Tue, Feb 11 • 2:00 PM - 2:30 PM
   📍 Teams Meeting
   🔗 Join: https://teams.microsoft.com/...

🔴 Quarterly Review (High Priority)
   📆 Thu, Feb 13 • 9:00 AM - 12:00 PM
   📍 Executive Boardroom
   👥 12 attendees
```

**Use Cases:**
- Plan your coding blocks around meetings
- Check for conflicts before accepting a code review
- Get meeting links without leaving VS Code

---

### `/mail` — View Recent Emails

Check your inbox without context switching.

**Usage:**
```
@alex /mail
@alex /mail unread        # Unread messages only
```

**Example Output:**
```
📧 Recent Messages (10 most recent)

📩 [UNREAD] Code Review Request: API Authentication
   From: Sarah Chen <sarah@contoso.com>
   Received: 2 hours ago
   Preview: "Hi team, I've submitted PR #234 for the..."

📩 [UNREAD] ⚠️ HIGH PRIORITY: Production Alert
   From: Azure Monitor <noreply@azure.com>
   Received: 3 hours ago
   📎 1 attachment
   Preview: "Alert triggered: CPU usage exceeded 90%..."

📬 Re: Architecture Decision - Database Choice
   From: Mike Johnson <mike@contoso.com>
   Received: Yesterday
   Preview: "I agree with your analysis. Let's go with..."
```

**Use Cases:**
- Monitor urgent emails during focus coding sessions
- Check for PR review responses
- Stay aware of team communications without email distraction

---

### `/context` — Full Work Context

Get a complete picture of your work context: calendar, mail, and presence in one view.

**Usage:**
```
@alex /context
```

**Example Output:**
```
🎯 Work Context Overview

👤 Your Status: 🟢 Available

📅 Next Meeting: Sprint Planning in 45 minutes
   📍 Conference Room A / Teams
   🔗 Join: https://teams.microsoft.com/...

📧 Inbox: 3 unread messages
   ⚠️ 1 high priority

📊 Today's Schedule:
   • 10:00 AM - Sprint Planning (1.5h)
   • 2:00 PM - 1:1 with Manager (30m)
   • 4:00 PM - Focus Time (blocked)
```

**Use Cases:**
- Morning standup preparation
- Quick status check before deep work
- Context before joining meetings

---

### `/people <query>` — Find Colleagues

Search for people in your organization.

**Usage:**
```
@alex /people sarah
@alex /people engineering manager
@alex /people seattle office
```

**Example Output:**
```
👥 People matching "sarah"

🧑‍💼 Sarah Chen
   📧 sarah.chen@contoso.com
   💼 Senior Software Engineer
   🏢 Engineering / Seattle

🧑‍💼 Sarah Williams
   📧 sarah.williams@contoso.com
   💼 Product Manager
   🏢 Product / Remote
```

**Use Cases:**
- Find the right person to ask about a codebase
- Look up someone mentioned in a code review
- Check reporting structures for escalation

---

## Settings Reference

All Graph settings are under `alex.enterprise.graph.*`:

| Setting             | Type    | Default | Description                         |
| ------------------- | ------- | ------- | ----------------------------------- |
| `enabled`           | boolean | `true`  | Master toggle for Graph integration |
| `calendarEnabled`   | boolean | `true`  | Enable calendar access              |
| `mailEnabled`       | boolean | `true`  | Enable mail access                  |
| `presenceEnabled`   | boolean | `true`  | Enable presence status              |
| `peopleEnabled`     | boolean | `true`  | Enable people search                |
| `calendarDaysAhead` | number  | `7`     | Days ahead to fetch (1-30)          |
| `mailMaxMessages`   | number  | `10`    | Max emails to show (1-50)           |

**Example: Minimal Configuration**

Only calendar, no mail access:

```json
{
  "alex.enterprise.enabled": true,
  "alex.enterprise.graph.enabled": true,
  "alex.enterprise.graph.mailEnabled": false,
  "alex.enterprise.graph.presenceEnabled": false,
  "alex.enterprise.graph.peopleEnabled": false
}
```

---

## Real-World Scenarios

### Scenario 1: Pre-Meeting Prep

You have a code review meeting in 30 minutes. What do you need?

```
@alex /context
```

Alex shows:
- The meeting is with Sarah Chen about PR #234
- You have 2 unread emails from Sarah about the PR
- Sarah is currently "Busy" (in another meeting)

You now know to:
1. Review the PR before the meeting
2. Read Sarah's context emails
3. Join the meeting when Sarah becomes available

### Scenario 2: Focus Mode Check

You're about to start a deep coding session (2 hours):

```
@alex /calendar 1
```

Alex shows:
- Next meeting: "1:1 with Manager" in 3 hours
- You have a clear 2-hour window

You can safely start your focus session.

### Scenario 3: Urgent Email Triage

You're debugging a production issue and can't leave VS Code:

```
@alex /mail unread
```

Alex shows:
- 1 high-priority email from Azure Monitor (production alert)
- 2 normal emails (can wait)

You address the production alert immediately.

### Scenario 4: Finding the Right Expert

You encounter an unfamiliar API in the codebase:

```
@alex /people authentication service owner
```

Alex shows team members who work on authentication, with their contact info.

---

## Privacy & Security

### What Alex Accesses

- **Calendar**: Event titles, times, locations, attendees (not detailed body content)
- **Mail**: Subjects, senders, timestamps, preview snippets (not full body)
- **Presence**: Availability status only
- **People**: Public directory information

### What Alex Does NOT Do

- ❌ Store emails or calendar content long-term
- ❌ Send emails on your behalf
- ❌ Modify your calendar
- ❌ Access message body content
- ❌ Share data with third parties

### Data Handling

- All Graph data is fetched on-demand
- Data exists only in your current VS Code session
- No data is written to disk or transmitted elsewhere
- Sessions expire after idle timeout

---

## Troubleshooting

### AADSTS65002 - Preauthorization Required

**Error**: "Consent between first party application... must be configured via preauthorization"

**Cause**: Your organization (e.g., `@microsoft.com`, restricted corporate tenants) blocks first-party apps like VS Code's built-in Microsoft auth from requesting Graph permissions.

**Solution**: Register your own Entra ID app. See [Custom App Registration](#custom-app-registration-for-restricted-tenants) above.

### AADSTS700016 - Application Not Found

**Cause**: Custom app client ID is incorrect.

**Solution**: Check `alex.enterprise.auth.clientId` matches your app registration's "Application (client) ID".

### AADSTS90002 - Tenant Not Found

**Cause**: Custom app tenant ID is invalid.

**Solution**: Use a valid tenant ID, or `common`/`organizations`/`consumers`.

### "Graph integration not available"

**Check:**
1. Enterprise mode is enabled: `alex.enterprise.enabled: true`
2. Graph is enabled: `alex.enterprise.graph.enabled: true`
3. You're signed in with a work/school account

### "Session expired"

Your OAuth token has expired. Run any Graph command to trigger re-authentication.

### "/mail returns empty"

Your organization may have disabled mail access via Graph. Contact your IT administrator.

### Scopes Denied

If your organization restricts certain Graph permissions, some commands may not work. Check with your IT department about:
- Conditional Access policies
- App consent settings
- Data loss prevention (DLP) policies

---

## What's Next

Future Graph capabilities planned:

| Feature                | Description              | Status    |
| ---------------------- | ------------------------ | --------- |
| **Planner/To-Do Sync** | Bidirectional task sync  | 📋 Planned |
| **Teams Presence**     | Set status from VS Code  | 📋 Planned |
| **OneDrive Files**     | Access shared documents  | 📋 Planned |
| **SharePoint Search**  | Query document libraries | 📋 Planned |

---

## VS Code ↔ M365: A Unified Workspace

With Graph integration, Alex bridges your development environment and collaboration tools:

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Workspace                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   VS Code                         Microsoft 365             │
│   ┌─────────────────┐            ┌─────────────────┐       │
│   │ • Code Files    │◄──────────►│ • Calendar      │       │
│   │ • Terminal      │   Alex     │ • Mail          │       │
│   │ • Git           │   Graph    │ • Teams         │       │
│   │ • Extensions    │   Bridge   │ • People        │       │
│   └─────────────────┘            └─────────────────┘       │
│                                                             │
│   "Alex, when's my next meeting?"                          │
│   "Alex, do I have any unread urgent emails?"              │
│   "Alex, who owns the auth service?"                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

No more context switching. No more missed meetings. No more "I didn't see that email."

**Alex keeps you connected while you code.**

---

*Microsoft Graph integration is available in Alex Cognitive Architecture v5.6.0+*
