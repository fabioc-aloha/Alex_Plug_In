# Teams Deep Integration Plan — Alex v6.0+

**Version**: 1.0
**Author**: Fabio Correa
**Date**: February 18, 2026
**Status**: Planning
**Target Release**: v6.0.0 (Q2 2026)

---

## Executive Summary

**Goal**: Transform Alex from a declarative agent accessed via Copilot to a **native Teams citizen** with deep integration across chat, meetings, channels, and collaboration surfaces.

**Current State**: Alex is a M365 Copilot declarative agent with a static welcome tab
- ✅ M365 Copilot chat interface
- ✅ Teams personal tab (static GitHub Pages link)
- ✅ OneDrive memory integration
- ❌ No message extensions
- ❌ No meeting integration
- ❌ No bot framework
- ❌ No adaptive cards
- ❌ No activity feed notifications

**Target State**: Full Teams platform integration
- ✅ Search Alex memory from any chat (message extensions)
- ✅ Save insights without leaving Teams (action extensions)
- ✅ Meeting prep/notes in meeting tabs (configurable tabs)
- ✅ Proactive notifications (activity feed)
- ✅ Rich structured responses (adaptive cards)
- ✅ Team collaboration sessions (shared memory)

**Timeline**: 3 phases over 12 weeks

| Phase                                  | Duration | Focus                   | Deliverables                                             |
| :------------------------------------- | :------- | :---------------------- | :------------------------------------------------------- |
| **Phase 1: Message Extensions**        | 3 weeks  | Search & Actions        | Search memory, Save insights, Quick commands             |
| **Phase 2: Meeting Integration**       | 4 weeks  | Meetings & Cards        | Meeting tabs, Adaptive cards, Pre/post-meeting workflows |
| **Phase 3: Proactive & Collaborative** | 5 weeks  | Notifications & Sharing | Activity feed, Team sessions, Presence                   |

---

## Current Architecture Analysis

### What We Have Today (v5.9.0)

```
┌─────────────────────────────────────────────────────────┐
│ Microsoft Teams                                         │
│                                                         │
│  ┌──────────────────┐        ┌──────────────────────┐  │
│  │ M365 Copilot     │        │ Static Tab           │  │
│  │ Chat Interface   │        │ (GitHub Pages link)  │  │
│  │                  │        │                      │  │
│  │ declarativeAgent │        │ Welcome Page         │  │
│  │ ↓                │        │ Documentation Link   │  │
│  │ OneDrive Memory  │        │                      │  │
│  └──────────────────┘        └──────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
           ↓                              ↓
   ┌──────────────┐              ┌──────────────┐
   │ OneDrive     │              │ GitHub Pages │
   │ Alex-Memory/ │              │ Landing Page │
   └──────────────┘              └──────────────┘
```

### Gaps Preventing Deep Integration

| Gap                        | Impact                              | Blocker For                                 |
| :------------------------- | :---------------------------------- | :------------------------------------------ |
| **No Bot Framework**       | Can't respond to @mentions, events  | Message extensions, notifications           |
| **No composeExtensions**   | Can't search from message box       | Search memory, quick actions                |
| **No configurableTabs**    | Can't add tabs to meetings/channels | Meeting prep, team workspaces               |
| **No activityFeed**        | Can't send notifications            | Weekly review reminders, meditation prompts |
| **Static responses only**  | No rich UI in chat                  | Adaptive cards for structured data          |
| **No real-time signaling** | Can't show presence/collaboration   | Team sessions, co-editing indicators        |

---

## Phase 1: Message Extensions (Weeks 1-3)

**Goal**: Enable Alex interactions from anywhere in Teams without opening Copilot

### 1.1 Search-Based Message Extension

**User Flow**:
1. User types in any Teams chat/channel
2. User types `@Alex` or clicks message box → sees "Alex" in extensions
3. User searches: "React patterns" or "meeting notes Feb 12"
4. Alex searches OneDrive memory + Global Knowledge
5. Results appear as cards → user clicks to insert into conversation

**Implementation**:

```json
// manifest.json additions
{
  "composeExtensions": [{
    "botId": "AZURE_BOT_ID_HERE",
    "canUpdateConfiguration": false,
    "commands": [{
      "id": "searchMemory",
      "type": "query",
      "title": "Search Alex Memory",
      "description": "Search your OneDrive Alex-Memory folder and Global Knowledge",
      "initialRun": true,
      "parameters": [{
        "name": "searchQuery",
        "title": "Search",
        "description": "What are you looking for?",
        "inputType": "text"
      }]
    }]
  }]
}
```

**Backend**: Azure Function (Node.js/TypeScript)
- Endpoint: `/api/messaging` (Bot Framework webhook)
- Search: Microsoft Graph API (OneDrive files.read)
- Return adaptive card with results

**Technical Requirements**:
- ✅ Azure Bot Service registration
- ✅ Azure Function App (Consumption tier OK for MVP)
- ✅ App Service authentication (OAuth 2.0 for Graph API)
- ✅ Bot Framework SDK v4.x

### 1.2 Action-Based Message Extension

**User Flow**:
1. User right-clicks any Teams message
2. "More actions" → "Save to Alex Memory"
3. Dialog: "Save to profile, focus-trifectas, or notes?"
4. Alex appends to chosen OneDrive file
5. Confirmation: "Saved to notes.md ✓"

**Implementation**:

```json
{
  "commands": [{
    "id": "saveMessage",
    "type": "action",
    "title": "Save to Alex Memory",
    "description": "Save this message to your OneDrive Alex-Memory",
    "context": ["message", "compose"],
    "fetchTask": true,
    "parameters": [{
      "name": "messageContent",
      "title": "Content",
      "description": "Message to save"
    }]
  }]
}
```

**Backend**: Same Azure Function
- Action handler: receives message content
- Append to OneDrive file via Graph API
- Return success card

### 1.3 Quick Command Extension

**Pre-built shortcuts**:
- "Weekly review" → triggers weekly review protocol
- "Meditate" → cognitive consolidation
- "Dream" → memory health check
- "Meeting prep" → next meeting briefing

**Implementation**: Command-based extension

```json
{
  "commands": [{
    "id": "weeklyReview",
    "type": "action",
    "title": "Weekly Review",
    "description": "Generate your weekly summary"
  }]
}
```

### Phase 1 Deliverables

| Item                       | Description                        | Lines of Code (Est) |
| :------------------------- | :--------------------------------- | :------------------ |
| manifest.json updates      | Add composeExtensions              | ~80 lines           |
| Azure Function (messaging) | Bot webhook endpoint               | ~300 lines          |
| Search handler             | OneDrive + Global Knowledge search | ~200 lines          |
| Save action handler        | Append to memory files             | ~150 lines          |
| Quick commands handler     | Protocol triggers                  | ~100 lines          |
| Adaptive card templates    | Result cards                       | ~200 lines          |
| **Total**                  |                                    | **~1,030 lines**    |

**Infrastructure**:
- Azure Bot Service: ~$0/month (free tier)
- Azure Function: ~$5/month (Consumption plan)
- Storage: Included in OneDrive

**Success Metrics**:
- Users can search memory from any chat
- Save rate: 10+ insights/user/week
- Quick command usage: 5+ commands/user/week

---

## Phase 2: Meeting Integration (Weeks 4-7)

**Goal**: Make Alex the definitive meeting companion

### 2.1 Meeting Stage Extension

**User Flow**:
1. User opens Teams meeting
2. Clicks "+" → "Alex Meeting Companion"
3. Tab appears with 3 sections:
   - **Pre-Meeting**: Attendee research, context, talking points
   - **During Meeting**: Live notes, key decisions, action items
   - **Post-Meeting**: Summary, follow-ups, save to memory

**Implementation**:

```json
{
  "configurableTabs": [{
    "configurationUrl": "https://fabioc-aloha.github.io/Alex_Plug_In/meeting-config.html",
    "canUpdateConfiguration": true,
    "scopes": ["groupchat"],
    "context": ["meetingStage", "meetingSidePanel"],
    "supportedSharePointHosts": ["sharePointFullPage", "sharePointWebPart"],
    "sharePointPreviewImage": "meeting-preview.png",
    "supportedPlatform": ["desktop", "mobile"]
  }]
}
```

**GitHub Pages**: New files needed
- `meeting-config.html` — Tab configuration picker
- `meeting-pre.html` — Pre-meeting briefing UI
- `meeting-live.html` — Live note-taking interface
- `meeting-post.html` — Post-meeting summary

**Features**:

#### Pre-Meeting (Auto-loads 30 min before)
```
┌────────────────────────────────────────────┐
│ 📅 Q4 Planning Meeting                     │
│ ⏰ Today at 2:00 PM (30 minutes)           │
├────────────────────────────────────────────┤
│ 👥 ATTENDEES (3)                           │
│                                            │
│ Sarah Chen — VP Product                   │
│ └─ Last contact: Email thread Feb 10      │
│ └─ Topics: Budget, resource allocation    │
│                                            │
│ Mike Torres — Engineering Lead            │
│ └─ Last contact: Teams chat yesterday     │
│ └─ Topics: Timeline concerns              │
│                                            │
│ [View full briefing →]                     │
├────────────────────────────────────────────┤
│ 💡 SUGGESTED TALKING POINTS                │
│ • Budget discussion (mentioned 3x in email)│
│ • Timeline (Mike flagged risks)           │
│ • Resource allocation (Sarah's priority)  │
└────────────────────────────────────────────┘
```

#### During Meeting (Live notes)
```
┌────────────────────────────────────────────┐
│ 📝 LIVE NOTES                              │
│                                            │
│ [Free-form text area]                      │
│                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│ 🎯 ACTION ITEMS                            │
│ □ Sarah: Send Q4 budget proposal by Friday│
│ □ Mike: Update timeline by EOW            │
│ [+ Add action item]                        │
│                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│ 🔑 KEY DECISIONS                           │
│ ✓ Approved: Hire 2 additional engineers   │
│ ✗ Deferred: Office expansion to Q1 2027   │
│ [+ Add decision]                           │
│                                            │
│ [Save to Memory] [Export to Word]         │
└────────────────────────────────────────────┘
```

#### Post-Meeting (Auto-appears after meeting ends)
```
┌────────────────────────────────────────────┐
│ ✅ Meeting Complete                        │
│                                            │
│ 📊 SUMMARY                                 │
│ Duration: 45 minutes                       │
│ Attendees: 3/3 joined                      │
│ Action items: 2 assigned                   │
│ Decisions: 2 recorded                      │
│                                            │
│ [Review Summary →]                         │
│                                            │
│ 💾 SAVE OPTIONS                            │
│ ☑ Save notes to OneDrive/Alex-Memory/notes.md│
│ ☑ Send summary to attendees via Teams     │
│ ☐ Create Planner tasks for action items   │
│                                            │
│ [Save & Close]                             │
└────────────────────────────────────────────┘
```

### 2.2 Adaptive Cards for Structured Responses

**Replace plain text with rich cards**:

**Before (Current)**:
```
User: "Prep for my next meeting"
Alex: "Your next meeting is Q4 Planning at 2pm with Sarah Chen, Mike Torres, and Jennifer Wu.
Sarah is VP Product. Last email thread was Feb 10 about budget..."
[wall of text]
```

**After (Adaptive Cards)**:
```
User: "Prep for my next meeting"
Alex: [Displays interactive card with sections, expandable details, action buttons]
```

**Implementation**:

```typescript
// Azure Function response
const card = {
  type: 'AdaptiveCard',
  version: '1.5',  // Teams supports v1.5 (v1.6 available in Bot Framework Web Chat only)
  body: [
    {
      type: 'TextBlock',
      text: '📅 Q4 Planning Meeting',
      size: 'large',
      weight: 'bolder'
    },
    {
      type: 'FactSet',
      facts: [
        { title: '⏰ Time', value: 'Today at 2:00 PM' },
        { title: '👥 Attendees', value: '3 people' },
        { title: '📧 Last Contact', value: 'Email thread Feb 10' }
      ]
    },
    {
      type: 'Container',
      items: attendees.map(person => ({
        type: 'TextBlock',
        text: `${person.name} — ${person.title}`,
        separator: true
      }))
    }
  ],
  actions: [
    {
      type: 'Action.OpenUrl',
      title: 'View Full Briefing',
      url: 'https://fabioc-aloha.github.io/Alex_Plug_In/meeting-briefing.html?id={meetingId}'
    },
    {
      type: 'Action.Submit',
      title: 'Add to Meeting Tab',
      data: { action: 'addToMeeting', meetingId: '{meetingId}' }
    }
  ]
};
```

### 2.3 Meeting Context API Integration

**Use Microsoft Graph Meeting APIs**:

```typescript
// Get meeting context
const meeting = await graphClient
  .api(`/me/onlineMeetings/${meetingId}`)
  .get();

// Get attendees
const attendees = await graphClient
  .api(`/me/events/${meeting.eventId}/attendees`)
  .get();

// Search email history with each attendee
for (const attendee of attendees) {
  const emails = await graphClient
    .api('/me/messages')
    .filter(`from/emailAddress/address eq '${attendee.email}'`)
    .top(10)
    .select('subject,receivedDateTime,bodyPreview')
    .get();
}

// Search Teams chat history
const chats = await graphClient
  .api('/chats')
  .filter(`chatType eq 'oneOnOne' and members/any(m:m/email eq '${attendee.email}')`)
  .expand('messages')
  .get();
```

### Phase 2 Deliverables

| Item                       | Description               | Lines of Code (Est) |
| :------------------------- | :------------------------ | :------------------ |
| Configurable tabs manifest | Meeting tab configuration | ~40 lines           |
| meeting-config.html        | Tab setup UI              | ~150 lines          |
| meeting-pre.html           | Pre-meeting briefing      | ~300 lines          |
| meeting-live.html          | Live note-taking          | ~400 lines          |
| meeting-post.html          | Post-meeting summary      | ~250 lines          |
| Meeting API handlers       | Graph API integration     | ~500 lines          |
| Adaptive card templates    | 5-6 card types            | ~400 lines          |
| **Total**                  |                           | **~2,040 lines**    |

**Success Metrics**:
- Meeting tab adoption: 30% of users within 4 weeks
- Notes saved to memory: 80%+ of meetings
- Time saved per meeting prep: 15 minutes average

---

## Phase 3: Proactive & Collaborative (Weeks 8-12)

### 3.1 Activity Feed Notifications

**Proactive triggers**:

| Trigger                    | Timing                          | Message                                                      |
| :------------------------- | :------------------------------ | :----------------------------------------------------------- |
| **Weekly Review Ready**    | Friday 3 PM                     | "Your weekly review is ready. [View now →]"                  |
| **Meditation Reminder**    | End of workday                  | "Consolidate today's work? [Meditate →]"                     |
| **Meeting Prep Available** | 30 min before meeting           | "Meeting prep ready: Q4 Planning with Sarah, Mike, Jennifer" |
| **Overload Alert**         | 4+ back-to-back meetings        | "Workload check: You have 6 meetings today. [Review →]"      |
| **Goal Milestone**         | Skill progress 25%/50%/75%/100% | "You've reached 50% on React mastery! [Next step →]"         |

**Implementation**:

```json
{
  "activities": {
    "activityTypes": [
      {
        "type": "weeklyReview",
        "description": "Weekly review ready",
        "templateText": "Your weekly review is ready",
        "imageUrl": "https://fabioc-aloha.github.io/Alex_Plug_In/assets/weekly-review.png"
      },
      {
        "type": "meetingPrep",
        "description": "Meeting prep available",
        "templateText": "Meeting prep ready: {meetingTitle}",
        "imageUrl": "https://fabioc-aloha.github.io/Alex_Plug_In/assets/meeting-prep.png"
      }
    ]
  }
}
// Note: The `systemDefault` activity type is currently in public developer preview (not GA)
```

**Backend**: Azure Function with Timer Trigger

```typescript
// Runs every 15 minutes
export async function checkNotifications(context: Context, timer: Timer) {
  const users = await getActiveUsers();

  for (const user of users) {
    // Check if Friday 3 PM (local time)
    if (isFriday3PM(user.timezone)) {
      await sendActivityNotification(user, 'weeklyReview');
    }

    // Check upcoming meetings (next 30 min)
    const upcomingMeetings = await getUpcomingMeetings(user);
    if (upcomingMeetings.length > 0 && !alreadyNotified(user, upcomingMeetings[0])) {
      await sendActivityNotification(user, 'meetingPrep', { meetingTitle: upcomingMeetings[0].subject });
    }
  }
}
```

### 3.2 Team Collaboration Sessions

**Shared Alex memory workspace**:

**User Flow**:
1. User creates "Project Apollo" channel in Teams
2. Clicks "+" → "Alex Team Workspace"
3. Alex creates `Projects/Apollo/` folder in team's SharePoint
4. All team members share:
   - Shared notes (team-notes.md)
   - Shared goals (team-goals.md)
   - Shared research (team-research.md)

**Features**:
- **Live presence**: See who's viewing/editing notes
- **Co-meditation**: Team consolidation sessions
- **Shared insights**: Pattern detection across team activity
- **Team metrics**: Collective progress on goals

**Architecture**:

```
┌──────────────────────────────────────────┐
│ Teams Channel: Project Apollo            │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Alex Team Workspace Tab             │  │
│ │                                     │  │
│ │ 📊 Team Metrics                     │  │
│ │ └─ 5 members active                 │  │
│ │ └─ 23 insights this week            │  │
│ │                                     │  │
│ │ 📝 Shared Notes                     │  │
│ │ └─ Sarah is editing... (live)       │  │
│ │                                     │  │
│ │ 🎯 Team Goals                       │  │
│ │ └─ Launch MVP: 75% complete         │  │
│ │ └─ API integration: 40% complete    │  │
│ │                                     │  │
│ │ [Team Meditation] [Weekly Review]   │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ SharePoint: Project Apollo Site          │
│ /Shared Documents/Alex-Team-Memory/      │
│ ├─ team-notes.md                         │
│ ├─ team-goals.md                         │
│ ├─ team-research.md                      │
│ └─ insights/                             │
└──────────────────────────────────────────┘
```

**Real-time Collaboration**: Azure SignalR Service

```typescript
// Broadcast presence
const connection = new signalR.HubConnectionBuilder()
  .withUrl('/api/collaboration')
  .build();

// User starts editing
connection.invoke('UserStartedEditing', {
  userId: user.id,
  userName: user.name,
  file: 'team-notes.md',
  section: 'Sprint Planning'
});

// Other users see presence indicator
connection.on('PresenceUpdate', (data) => {
  showPresenceBadge(data.userName, data.file, data.section);
});
```

### 3.3 Deep Links & Launch Contexts

**Direct links to Alex workflows**:

```html
<!-- Add to Teams channel welcome message -->
<a href="https://teams.microsoft.com/l/entity/2427e7a9-91a7-4ed9-a504-7b53c4dfad1d/alexWelcome?
  context=%7B%22subEntityId%22%3A%22weeklyReview%22%7D">
  🚀 Launch Weekly Review
</a>

<!-- One-click meeting prep -->
<a href="https://teams.microsoft.com/l/chat/0/0?
  users=alex@bot.teams.microsoft.com
  &message=Prep%20for%20my%20next%20meeting">
  📅 Meeting Prep Now
</a>
```

**Update static tab with launch buttons**:

```html
<!-- GitHub Pages: index.html -->
<div class="quick-actions">
  <h2>🚀 Quick Launch</h2>

  <a href="msteams://teams.microsoft.com/l/entity/..."
     class="launch-button">
    📊 Weekly Review
  </a>

  <a href="msteams://teams.microsoft.com/l/entity/..."
     class="launch-button">
    🧘 Meditate
  </a>

  <a href="msteams://teams.microsoft.com/l/entity/..."
     class="launch-button">
    📅 Meeting Prep
  </a>
</div>
```

### Phase 3 Deliverables

| Item                    | Description                 | Lines of Code (Est) |
| :---------------------- | :-------------------------- | :------------------ |
| Activity feed manifest  | Notification types          | ~60 lines           |
| Timer function          | Notification scheduler      | ~300 lines          |
| Team workspace tab      | Shared memory UI            | ~500 lines          |
| SignalR hub             | Real-time presence          | ~200 lines          |
| Deep link launcher      | Static tab updates          | ~150 lines          |
| Team meditation handler | Collaborative consolidation | ~250 lines          |
| **Total**               |                             | **~1,460 lines**    |

**Infrastructure**:
- Azure SignalR Service: ~$20/month (Free tier: 20 concurrent connections)
- Timer Function: Included in existing Function App

**Success Metrics**:
- Notification engagement: 60%+ click-through rate
- Team workspace adoption: 20% of channels
- Presence awareness: 40% of active users see live indicators

---

## Technical Architecture (End State)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Microsoft Teams                                                     │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ M365 Copilot │  │ Message Ext  │  │ Meeting Tabs │             │
│  │ Chat         │  │ Search/Save  │  │ Pre/Live/Post│             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                 │                 │                      │
│         │                 │                 │                      │
│  ┌──────┴─────────────────┴─────────────────┴───────┐             │
│  │ Activity Feed Notifications                      │             │
│  │ Weekly review • Meeting prep • Meditation        │             │
│  └──────────────────────────────────────────────────┘             │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Azure Bot Service + Function App                                   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Bot Webhook      │  │ Timer Triggers   │  │ SignalR Hub      │ │
│  │ /api/messaging   │  │ Notifications    │  │ Collaboration    │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                     │                     │           │
└───────────┼─────────────────────┼─────────────────────┼─────────────┘
            │                     │                     │
            ↓                     ↓                     ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Microsoft Graph API                                                 │
│ • OneDrive (personal memory)                                        │
│ • SharePoint (team memory)                                          │
│ • Calendar (meetings)                                               │
│ • Email (history)                                                   │
│ • Teams (messages)                                                  │
│ • People (org chart)                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure & Cost Estimate

### Azure Resources

| Resource                  | SKU              | Purpose                            | Monthly Cost                                       |
| :------------------------ | :--------------- | :--------------------------------- | :------------------------------------------------- |
| **Azure Bot Service**     | F0 (Free)        | Bot registration                   | $0                                                 |
| **Azure Function App**    | Consumption Y1   | Bot webhook, timers                | $0-20 (free tier: 1M executions + 400K GB-s/month) |
| **Azure SignalR Service** | Free             | Real-time presence (dev/test only) | $0 (20 connections)                                |
| **Application Insights**  | Free tier (5 GB) | Logging, monitoring                | $0                                                 |
| **Storage Account**       | Standard LRS     | Function state                     | $1                                                 |
|                           |                  | **Total**                          | **~$1-35/month**                                   |

### Scaling (100 users)

| Resource              | SKU                              | Monthly Cost   |
| :-------------------- | :------------------------------- | :------------- |
| Azure Function App    | Consumption Y1 (500K executions) | ~$20           |
| Azure SignalR Service | Standard (1,000 concurrent)      | ~$50 (1 unit)  |
| Application Insights  | 5-10 GB                          | ~$5            |
|                       | **Total (100 users)**            | **~$50/month** |

### Scaling (1,000 users)

| Resource              | SKU                                    | Monthly Cost    |
| :-------------------- | :------------------------------------- | :-------------- |
| Azure Function App    | Premium EP1 (dedicated)                | ~$150           |
| Azure SignalR Service | Standard (1,000 concurrent)            | ~$50            |
| Application Insights  | 20-30 GB                               | ~$20            |
| Azure CDN             | Standard Microsoft (for static assets) | ~$10            |
|                       | **Total (1,000 users)**                | **~$230/month** |

---

## Azure Infrastructure Deployment

### Complete Resource Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          AZURE SUBSCRIPTION                             │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Resource Group: alex-teams-rg (East US)                          │  │
│  │                                                                  │  │
│  │  ┌────────────────────────┐      ┌──────────────────────────┐  │  │
│  │  │ Entra App Registration │      │ Azure Bot Service (F0)   │  │  │
│  │  │ alex-teams-bot         │──────│ alex-teams-bot           │  │  │
│  │  │ • App ID               │      │ • Bot handle             │  │  │
│  │  │ • Client Secret        │      │ • Messaging endpoint     │  │  │
│  │  │ • Teams permissions    │      └──────────┬───────────────┘  │  │
│  │  └────────────────────────┘                 │                   │  │
│  │                                              │                   │  │
│  │  ┌───────────────────────────────────────────┼────────────────┐ │  │
│  │  │ Azure Function App (Consumption Y1)       ▼                │ │  │
│  │  │ alex-teams-functions                                       │ │  │
│  │  │                                                            │ │  │
│  │  │  Functions:                                                │ │  │
│  │  │  • /api/messaging        ◄─── Bot webhook                 │ │  │
│  │  │  • /api/searchMemory     ◄─── Message extension search    │ │  │
│  │  │  • /api/actionHandler    ◄─── Message extension actions   │ │  │
│  │  │  • /api/tabConfig        ◄─── Meeting tab configuration   │ │  │
│  │  │  • /api/notificationTimer◄─── Timer trigger (every 15min) │ │  │
│  │  │                                                            │ │  │
│  │  │  Environment Variables:                                    │ │  │
│  │  │  • BOT_APP_ID                                              │ │  │
│  │  │  • BOT_APP_PASSWORD                                        │ │  │
│  │  │  • SIGNALR_CONNECTION_STRING                               │ │  │
│  │  │  • APPLICATIONINSIGHTS_CONNECTION_STRING                   │ │  │
│  │  └────────────────┬──────────────────┬────────────────────────┘ │  │
│  │                   │                  │                          │  │
│  │  ┌────────────────▼──────┐  ┌────────▼─────────────────────┐   │  │
│  │  │ Storage Account       │  │ Azure SignalR Service (Free) │   │  │
│  │  │ alexteamsstorage      │  │ alex-teams-signalr           │   │  │
│  │  │ • Function state      │  │ • 20 concurrent connections  │   │  │
│  │  │ • Blob storage        │  │ • Presence & notifications   │   │  │
│  │  └───────────────────────┘  └──────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │ Application Insights                                       │ │  │
│  │  │ alex-teams-insights                                        │ │  │
│  │  │ • Bot telemetry                                            │ │  │
│  │  │ • Function logs                                            │ │  │
│  │  │ • Performance metrics                                      │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ External Integrations                                            │  │
│  │                                                                  │  │
│  │  • Microsoft Graph API (user's tenant)                          │  │
│  │    - OneDrive memory access                                     │  │
│  │    - Calendar/Meetings API                                      │  │
│  │    - Email/Messages API                                         │  │
│  │                                                                  │  │
│  │  • Teams Platform                                               │  │
│  │    - Message extensions                                         │  │
│  │    - Meeting tabs                                               │  │
│  │    - Activity feed                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Required Azure Resources

| Resource                    | Name                   | SKU/Tier       | Purpose                                      | Dependencies                |
| :-------------------------- | :--------------------- | :------------- | :------------------------------------------- | :-------------------------- |
| **Resource Group**          | alex-teams-rg          | N/A            | Container for all resources                  | None                        |
| **Entra App Registration**  | alex-teams-bot         | N/A            | Bot identity, Graph API permissions          | None                        |
| **Azure Bot Service**       | alex-teams-bot         | F0 (Free)      | Bot Framework registration                   | Entra App                   |
| **Function App**            | alex-teams-functions   | Consumption Y1 | Bot webhook, message extensions, timers      | Storage Account             |
| **Storage Account**         | alexteamsstorage       | Standard LRS   | Function app state, blob storage             | None                        |
| **SignalR Service**         | alex-teams-signalr     | Free           | Real-time presence, live notifications       | None                        |
| **Application Insights**    | alex-teams-insights    | Free (5GB)     | Logging, monitoring, telemetry               | None                        |
| **Teams App Registration**  | Alex (Teams manifest)  | N/A            | Teams platform integration                   | Bot Service, Entra App      |

### Step-by-Step Deployment Script

**Prerequisites:**
- Azure CLI installed (`az --version` should work)
- Logged into Azure (`az login`)
- Teams Toolkit CLI installed (`npm install -g @microsoft/teamsapp-cli`)

**1. Set Variables**

```powershell
# Configuration
$RESOURCE_GROUP = "alex-teams-rg"
$LOCATION = "eastus"
$BOT_NAME = "alex-teams-bot"
$FUNCTION_APP_NAME = "alex-teams-functions"
$STORAGE_ACCOUNT = "alexteamsstorage"  # Must be globally unique
$SIGNALR_NAME = "alex-teams-signalr"
$INSIGHTS_NAME = "alex-teams-insights"

# Generate or use existing App ID/Password
# Option 1: Create new Entra app
$APP_REGISTRATION = az ad app create --display-name $BOT_NAME --sign-in-audience AzureADMultipleOrgs | ConvertFrom-Json
$APP_ID = $APP_REGISTRATION.appId

# Create client secret (save this immediately - only shown once!)
$SECRET = az ad app credential reset --id $APP_ID --query password -o tsv
Write-Host "🔐 SAVE THIS SECRET: $SECRET" -ForegroundColor Yellow
```

**2. Create Resource Group**

```powershell
az group create `
  --name $RESOURCE_GROUP `
  --location $LOCATION

Write-Host "✅ Resource group created: $RESOURCE_GROUP"
```

**3. Create Storage Account**

```powershell
az storage account create `
  --name $STORAGE_ACCOUNT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --sku Standard_LRS `
  --kind StorageV2

Write-Host "✅ Storage account created: $STORAGE_ACCOUNT"
```

**4. Create Application Insights**

```powershell
az monitor app-insights component create `
  --app $INSIGHTS_NAME `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --application-type web

$INSIGHTS_KEY = az monitor app-insights component show `
  --app $INSIGHTS_NAME `
  --resource-group $RESOURCE_GROUP `
  --query instrumentationKey -o tsv

$INSIGHTS_CONN_STRING = az monitor app-insights component show `
  --app $INSIGHTS_NAME `
  --resource-group $RESOURCE_GROUP `
  --query connectionString -o tsv

Write-Host "✅ Application Insights created: $INSIGHTS_NAME"
```

**5. Create Azure SignalR Service**

```powershell
az signalr create `
  --name $SIGNALR_NAME `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --sku Free_F1 `
  --unit-count 1 `
  --service-mode Serverless

$SIGNALR_CONN_STRING = az signalr key list `
  --name $SIGNALR_NAME `
  --resource-group $RESOURCE_GROUP `
  --query primaryConnectionString -o tsv

Write-Host "✅ SignalR Service created: $SIGNALR_NAME"
```

**6. Create Azure Function App**

```powershell
az functionapp create `
  --name $FUNCTION_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --storage-account $STORAGE_ACCOUNT `
  --consumption-plan-location $LOCATION `
  --runtime node `
  --runtime-version 18 `
  --functions-version 4 `
  --os-type Windows `
  --app-insights $INSIGHTS_NAME

Write-Host "✅ Function App created: $FUNCTION_APP_NAME"
```

**7. Configure Function App Settings**

```powershell
az functionapp config appsettings set `
  --name $FUNCTION_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --settings `
    "BOT_APP_ID=$APP_ID" `
    "BOT_APP_PASSWORD=$SECRET" `
    "SIGNALR_CONNECTION_STRING=$SIGNALR_CONN_STRING" `
    "APPLICATIONINSIGHTS_CONNECTION_STRING=$INSIGHTS_CONN_STRING" `
    "MicrosoftAppType=MultiTenant" `
    "MicrosoftAppTenantId=common"

Write-Host "✅ Function App configured with environment variables"
```

**8. Create Azure Bot Service**

```powershell
# Get Function App messaging endpoint
$FUNCTION_HOSTNAME = az functionapp show `
  --name $FUNCTION_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query defaultHostName -o tsv

$MESSAGING_ENDPOINT = "https://$FUNCTION_HOSTNAME/api/messaging"

# Create bot registration
az bot create `
  --resource-group $RESOURCE_GROUP `
  --name $BOT_NAME `
  --kind registration `
  --sku F0 `
  --appid $APP_ID `
  --password $SECRET `
  --endpoint $MESSAGING_ENDPOINT

# Enable Teams channel
az bot msteams create `
  --resource-group $RESOURCE_GROUP `
  --name $BOT_NAME

Write-Host "✅ Bot Service created and Teams channel enabled: $BOT_NAME"
Write-Host "   Messaging endpoint: $MESSAGING_ENDPOINT"
```

**9. Configure Entra App Permissions**

```powershell
# Add Microsoft Graph API permissions
# OneDrive, Calendar, Mail, User read permissions

Write-Host "⚠️  MANUAL STEP REQUIRED:"
Write-Host "1. Go to: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/$APP_ID"
Write-Host "2. Add API Permissions:"
Write-Host "   - Microsoft Graph > Delegated > Files.ReadWrite"
Write-Host "   - Microsoft Graph > Delegated > Calendars.Read"
Write-Host "   - Microsoft Graph > Delegated > Mail.Read"
Write-Host "   - Microsoft Graph > Delegated > User.Read"
Write-Host "3. Click 'Grant admin consent'"
```

**10. Deploy Function Code**

```powershell
cd platforms/m365-copilot/bot-backend

# Build the TypeScript code
npm run build

# Deploy to Azure
func azure functionapp publish $FUNCTION_APP_NAME

Write-Host "✅ Function code deployed to: $FUNCTION_APP_NAME"
```

**11. Update Teams Manifest**

```powershell
# Update manifest.json with Bot ID
$MANIFEST_PATH = "../appPackage/manifest.json"
$manifest = Get-Content $MANIFEST_PATH | ConvertFrom-Json
$manifest.bots[0].botId = $APP_ID
$manifest.composeExtensions[0].botId = $APP_ID
$manifest | ConvertTo-Json -Depth 10 | Set-Content $MANIFEST_PATH

Write-Host "✅ Teams manifest updated with Bot ID: $APP_ID"
```

**12. Package and Test**

```powershell
# Package the Teams app
teamsapp package --env dev

Write-Host "✅ Teams app package created: appPackage/build/appPackage.dev.zip"
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE!"
Write-Host ""
Write-Host "📋 RESOURCE SUMMARY:"
Write-Host "   Resource Group:    $RESOURCE_GROUP"
Write-Host "   Bot Name:          $BOT_NAME"
Write-Host "   App ID:            $APP_ID"
Write-Host "   Function App:      $FUNCTION_APP_NAME"
Write-Host "   Messaging Endpoint: $MESSAGING_ENDPOINT"
Write-Host ""
Write-Host "🚀 NEXT STEPS:"
Write-Host "1. Complete Entra App permissions (see manual step above)"
Write-Host "2. Upload appPackage.dev.zip to Teams:"
Write-Host "   Teams > Apps > Manage your apps > Upload an app > Upload a custom app"
Write-Host "3. Test message extension: Open any chat > @ > Select Alex > Search"
Write-Host "4. Monitor logs: Azure Portal > Application Insights > $INSIGHTS_NAME"
```

### Environment Configuration

**Local Development (.env.local)**

```bash
# Bot Framework
BOT_APP_ID=<your-app-id>
BOT_APP_PASSWORD=<your-app-secret>
MicrosoftAppType=MultiTenant
MicrosoftAppTenantId=common

# Azure Services
SIGNALR_CONNECTION_STRING=<local-signalr-or-azure-connection-string>
APPLICATIONINSIGHTS_CONNECTION_STRING=<not-required-locally>

# Development
NODE_ENV=development
FUNCTIONS_WORKER_RUNTIME=node
```

**Production (Azure App Settings)**

Set via Azure Portal or CLI (already done in step 7 above):
- `BOT_APP_ID`: Entra app ID
- `BOT_APP_PASSWORD`: Entra app secret
- `SIGNALR_CONNECTION_STRING`: Azure SignalR connection string
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: Application Insights connection string
- `MicrosoftAppType`: MultiTenant
- `MicrosoftAppTenantId`: common

### Security Configuration

**1. Managed Identity (Optional - for production)**

```powershell
# Enable system-assigned managed identity for Function App
az functionapp identity assign `
  --name $FUNCTION_APP_NAME `
  --resource-group $RESOURCE_GROUP

# Use managed identity instead of connection strings for:
# - Storage Account access
# - Application Insights
# - SignalR Service
```

**2. Key Vault Integration (Recommended for secrets)**

```powershell
# Create Key Vault
az keyvault create `
  --name alex-teams-keyvault `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION

# Store secrets
az keyvault secret set --vault-name alex-teams-keyvault --name BotAppPassword --value $SECRET
az keyvault secret set --vault-name alex-teams-keyvault --name SignalRConnectionString --value $SIGNALR_CONN_STRING

# Reference in Function App:
# @Microsoft.KeyVault(SecretUri=https://alex-teams-keyvault.vault.azure.net/secrets/BotAppPassword/)
```

**3. Network Security**

```powershell
# Restrict Function App to accept traffic only from:
# - Azure Bot Service
# - Teams platform
# - Azure services

az functionapp config access-restriction add `
  --name $FUNCTION_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --rule-name AllowBotService `
  --action Allow `
  --service-tag AzureCloud `
  --priority 100
```

### Verification Checklist

After deployment, verify:

- [ ] **Resource Group**: All 6 resources created in `alex-teams-rg`
- [ ] **Entra App**: App ID obtained, secret saved securely, permissions granted
- [ ] **Bot Service**: F0 tier, Teams channel enabled, messaging endpoint set
- [ ] **Function App**: Deployed code, environment variables configured
- [ ] **Storage Account**: Accessible by Function App
- [ ] **SignalR**: Connection string configured, serverless mode
- [ ] **Application Insights**: Receiving telemetry from Function App
- [ ] **Teams Manifest**: Bot ID updated, package created
- [ ] **Test Bot Emulator**: Local `/api/messaging` responds to messages
- [ ] **Test Teams**: Message extension search works

### Monitoring & Diagnostics

**View Function Logs:**
```powershell
# Real-time logs
az webapp log tail --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP

# Query Application Insights
az monitor app-insights query `
  --app $INSIGHTS_NAME `
  --resource-group $RESOURCE_GROUP `
  --analytics-query "traces | where message contains 'messaging' | take 50"
```

**Monitor Bot Activity:**
```powershell
# Bot channel analytics
az bot show `
  --name $BOT_NAME `
  --resource-group $RESOURCE_GROUP
```

---

## Development Workflow

### Phase 1: Local Development

```powershell
# 1. Set up Azure Bot Emulator
# Download from: https://github.com/microsoft/BotFramework-Emulator

# 2. Create Azure Function locally
cd platforms/m365-copilot
func init bot-backend --worker-runtime node --language typescript
cd bot-backend
npm install @microsoft/teams-js botbuilder

# 3. Create messaging endpoint
code src/functions/messaging.ts

# 4. Test locally
func start

# 5. Test in Bot Emulator
# Connect to: http://localhost:7071/api/messaging
```

### Phase 2: Azure Deployment

```powershell
# 1. Create Azure resources
az group create --name alex-teams-rg --location eastus

az bot create \
  --resource-group alex-teams-rg \
  --name alex-teams-bot \
  --kind registration \
  --sku F0 \
  --appid $APP_ID \
  --password $APP_PASSWORD

az functionapp create \
  --resource-group alex-teams-rg \
  --name alex-teams-functions \
  --storage-account alexteamsstorage \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4

# 2. Deploy function code
cd bot-backend
func azure functionapp publish alex-teams-functions

# 3. Update manifest with bot ID
# manifest.json: "botId": "$APP_ID"

# 4. Package and test
npm run package:dev
```

### Phase 3: Testing Workflow

```powershell
# 1. Upload manifest to Teams
# Teams → Apps → Upload a custom app → Select appPackage.dev.zip

# 2. Test message extension
# Open any chat → Type @ → Select "Alex" → Search for "React patterns"

# 3. Test meeting tab
# Create test meeting → Add Alex tab → Verify pre-meeting briefing loads

# 4. Test notifications
# Manually trigger: POST /api/sendNotification
curl -X POST https://alex-teams-functions.azurewebsites.net/api/sendNotification \
  -H "Content-Type: application/json" \
  -d '{"userId": "...", "type": "weeklyReview"}'

# 5. Check logs
az monitor app-insights query \
  --app alex-teams-insights \
  --analytics-query "traces | where message contains 'message extension'"
```

---

## Risk Mitigation

| Risk                            | Likelihood | Impact | Mitigation                                                    |
| :------------------------------ | :--------- | :----- | :------------------------------------------------------------ |
| **Bot Framework complexity**    | Medium     | High   | Start with minimal MVP, use Bot Builder SDK templates         |
| **Azure cost overruns**         | Low        | Medium | Use free/consumption tiers, set budget alerts                 |
| **Graph API throttling**        | Medium     | Medium | Implement exponential backoff, cache frequently accessed data |
| **User adoption low**           | Medium     | High   | Launch with power users first, collect feedback, iterate      |
| **Meeting tab performance**     | Low        | Medium | Lazy load data, show skeletons, optimize Graph queries        |
| **SignalR connection limits**   | Low        | Low    | Free tier supports 20 concurrent (sufficient for MVP)         |
| **Adaptive Card compatibility** | Low        | Low    | Test on desktop + mobile, use schema v1.5 (broad support)     |

---

## Success Criteria

### MVP Success (Phase 1)

| Metric                      | Target                          | How to Measure             |
| :-------------------------- | :------------------------------ | :------------------------- |
| **Message extension usage** | 60% of users try within 2 weeks | App Insights custom events |
| **Memory saves**            | 10+ insights/user/week          | OneDrive file append count |
| **Quick command usage**     | 5+ commands/user/week           | Bot command analytics      |
| **User satisfaction**       | 4.2/5 stars                     | In-app feedback survey     |

### Full Integration Success (Phase 3)

| Metric                       | Target                             | How to Measure                           |
| :--------------------------- | :--------------------------------- | :--------------------------------------- |
| **Meeting tab adoption**     | 40% of meetings use Alex tab       | Teams usage analytics                    |
| **Weekly review engagement** | 70% of users complete weekly       | Notification click-through rate          |
| **Team workspace creation**  | 15% of channels add Alex workspace | SharePoint folder creation count         |
| **Time saved per week**      | 2+ hours average                   | User survey + usage time analysis        |
| **Retention (30-day)**       | 80%+                               | Active users day 30 / Active users day 1 |

---

## Timeline & Milestones

### Week-by-Week Plan

| Week   | Phase   | Focus                             | Deliverable                               |
| :----- | :------ | :-------------------------------- | :---------------------------------------- |
| **1**  | Phase 1 | Azure setup + Bot registration    | Bot service running, local dev working    |
| **2**  | Phase 1 | Search message extension          | Search OneDrive memory from any chat      |
| **3**  | Phase 1 | Action extension + quick commands | Save insights, trigger protocols          |
| **4**  | Phase 2 | Meeting tab foundation            | Configurable tab manifest + config UI     |
| **5**  | Phase 2 | Pre-meeting briefing              | Attendee research, context summary        |
| **6**  | Phase 2 | Live notes + post-meeting         | Note-taking UI, save to OneDrive          |
| **7**  | Phase 2 | Adaptive cards                    | Rich card templates for all responses     |
| **8**  | Phase 3 | Activity feed notifications       | Weekly review, meeting prep reminders     |
| **9**  | Phase 3 | Team workspace tab                | Shared memory for channels                |
| **10** | Phase 3 | Real-time collaboration           | SignalR presence, live editing indicators |
| **11** | Phase 3 | Deep links + polish               | Quick launch buttons, performance tuning  |
| **12** | Launch  | Testing + launch prep             | Beta testing, documentation, rollout      |

---

## Open Questions

1. **Multi-tenant vs Single-tenant Architecture?**
   - Single-tenant: One deployment per customer (isolation, compliance)
   - Multi-tenant: One deployment for all (scale, cost efficiency)
   - **Recommendation**: Start single-tenant (OneDrive/SharePoint already tenant-scoped)

2. **Should we build a separate API for Global Knowledge?**
   - Pro: Enables cross-project searches in M365
   - Con: Adds infrastructure complexity
   - **Recommendation**: Phase 2 (v6.1) after core Teams integration proven

3. **Mobile support priority?**
   - Teams mobile supports message extensions + tabs
   - Adaptive cards render on mobile
   - **Recommendation**: Test on mobile as part of Phase 2, no separate mobile work needed

4. **How to handle user authentication for Graph API?**
   - Option 1: SSO via Teams (user context passed to bot)
   - Option 2: OAuth flow with consent
   - **Recommendation**: SSO for simplicity, OAuth fallback if needed

5. **Should meeting notes support markdown/rich text?**
   - Pro: Better formatting, tables, links
   - Con: More complex editor
   - **Recommendation**: Start with plain text, add markdown in v6.1

6. **Graph API rate limits and retry logic?**
   - Standard tier: 10,000 requests per 10 minutes per user
   - Throttling headers: `Retry-After`, `RateLimit-*`
   - **Recommendation**: Implement exponential backoff with retry middleware for all Graph API calls

---

## Next Immediate Steps

### Week 1 Kickoff (This Week)

1. **Create Azure Bot Service registration** (30 min)
   ```powershell
   az ad app create --display-name "Alex Teams Bot"
   # Note App ID + secret
   ```

2. **Set up Azure Function App** (30 min)
   ```powershell
   func init platforms/m365-copilot/bot-backend --worker-runtime node --language typescript
   ```

3. **Update manifest with bot ID** (5 min)
   ```json
   "composeExtensions": [{"botId": "YOUR_APP_ID_HERE"}]
   ```

4. **Create minimal messaging endpoint** (2 hours)
   - Bot Framework webhook handler
   - Echo bot to test end-to-end
   - Test in Bot Emulator

5. **Deploy to Azure** (1 hour)
   - Deploy function
   - Update bot messaging endpoint
   - Test in Teams

**Total time estimate**: 4 hours to first working bot in Teams

---

## Conclusion

This plan transforms Alex from a declarative agent to a **native Teams platform citizen** over 12 weeks:

- ✅ **Phase 1 (3 weeks)**: Message extensions for search, save, and quick commands
- ✅ **Phase 2 (4 weeks)**: Meeting integration with pre/during/post workflows
- ✅ **Phase 3 (5 weeks)**: Proactive notifications and team collaboration

**Cost**: ~$11/month to start, scales to ~$50/month for 100 users

**Risk**: Low — all components use mature Azure services with generous free tiers

**ROI**: 2+ hours saved per user per week = ~$100+/user/week for knowledge workers

**Ready to start?** Weeks 1-2 focus on message extensions (highest user value, lowest complexity).

---

**Document Version**: 1.0
**Last Updated**: February 18, 2026
**Next Review**: March 1, 2026 (after Phase 1 completion)
