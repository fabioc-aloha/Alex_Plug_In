# Outlook Integration

**Domain**: Microsoft Outlook email composition and calendar
**Platform**: M365 Heir — Office Add-in (Mail Add-in)
**Office.js API**: `Office.context.mailbox`, Mailbox API

## Capabilities

### Memory-Augmented Email Drafting

**Purpose**: Draft emails with context from OneDrive memory

**Memory Sources**:
- **profile.md**: User name, role, signature preferences
- **notes.md**: Recent session context, relevant topics
- **focus-trifectas.md**: Current learning areas (for educational emails)

**Email Types**:
1. **Professional replies**: Context-aware responses
2. **Meeting summaries**: From session notes
3. **Learning updates**: Progress on focus areas
4. **Incident reports**: Calm, structured communication

### Urgent Email Triage

**Purpose**: Detect urgent emails and activate incident-response skill

**Trigger Keywords**:
- "URGENT", "CRITICAL", "DOWN", "OUTAGE"
- "ASAP", "EMERGENCY", "BLOCKED"
- "PRODUCTION", "P0", "SEV1"

**Response Flow**:
1. Detect urgency in subject/body
2. Activate `incident-response` skill
3. Suggest calm, structured reply template
4. Offer to escalate or log incident

**Template Example**:
```
Subject: RE: [URGENT] Production API down

Hi [Name],

I've received your report about the API outage. Here's our immediate action plan:

**Status**: Investigating (started [time])
**Impact**: [describe from email]
**Next Update**: [time + 30 minutes]

I'm on it and will keep you posted.

Best,
[Your Name]
```

### Tone Adaptation

**Purpose**: Adjust email tone based on recipient and context

**Persona Detection**:
- Read `profile.md` for user's default tone
- Detect recipient role (manager, peer, external)
- Adapt formality, structure, greeting

**Tone Options**:
- **Professional**: Formal, structured, detailed
- **Friendly**: Casual, conversational, brief
- **Technical**: Precise, code snippets, low prose
- **Executive**: Brief, bullet points, action items

## Office.js Patterns

### Read Email Context

```javascript
// Get current email being composed
const item = Office.context.mailbox.item;

// Read subject
item.subject.getAsync((result) => {
  if (result.status === Office.AsyncResultStatus.Succeeded) {
    const subject = result.value;
    // Detect urgency
    if (/urgent|critical|down/i.test(subject)) {
      activateIncidentResponse();
    }
  }
});

// Read body
item.body.getAsync(Office.CoercionType.Text, (result) => {
  const bodyText = result.value;
  // Extract context for memory-augmented drafting
});
```

### Insert Content

```javascript
// Insert drafted text
item.body.setSelectedDataAsync(
  "Thank you for reaching out...",
  { coercionType: Office.CoercionType.Html },
  (result) => {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      console.log("Email content inserted");
    }
  }
);
```

### Add Recipients

```javascript
// Suggest CC based on incident type (future)
item.cc.addAsync(
  ["team-lead@company.com"],
  { asyncContext: "incident-escalation" },
  (result) => {
    console.log("CC added for incident escalation");
  }
);
```

## Integration Patterns

### VS Code Skill Connections

**incident-response** (Primary for Urgent):
- **When**: URGENT keywords detected
- **Yields**: Triage protocols, calm communication
- **Strength**: 0.8

**persona-detection**:
- **When**: Personalizing tone/formatting
- **Yields**: User role, recipient context
- **Strength**: 0.75

**writing-publication**:
- **When**: Drafting professional emails
- **Yields**: Clear structure, concise language
- **Strength**: 0.6

### Memory Context Usage

**profile.md**:
- User name for signature
- Role for tone selection
- Email signature template

**notes.md**:
- Recent topics for context
- Session notes for meeting summaries
- Action items from conversations

## Use Cases

### Incident Email Response

```
User: Opens urgent email "CRITICAL: Database connection failing"
Alex Flow:
1. Detect "CRITICAL" keyword
2. Activate incident-response skill
3. Suggest structured reply template
4. Insert calm, actionable response
5. Offer to log incident in notes.md
```

**Generated Email**:
```
Subject: RE: CRITICAL: Database connection failing

Hi [Name],

**Status**: Investigating (started [time])
**Current Finding**: [brief status]
**Next Steps**: [action items]
**ETA for Update**: [time]

I'll keep you posted as we learn more.

[Your Name]
```

### Meeting Summary Email

```
User: "Send meeting summary to the team"
Alex Flow:
1. Read recent notes.md for meeting notes
2. Extract: attendees, decisions, action items
3. Format as professional email
4. Insert into Outlook compose window
```

**Generated Email**:
```
Subject: Meeting Summary - [Topic] ([Date])

Team,

Key outcomes from today's meeting:

**Decisions**:
- [Decision 1]
- [Decision 2]

**Action Items**:
- [Person]: [Task] (Due: [Date])
- [Person]: [Task] (Due: [Date])

**Next Meeting**: [Date/Time]

Best,
[Your Name]
```

### Learning Progress Update

```
User: "Draft an email about my learning progress"
Alex Flow:
1. Read focus-trifectas.md
2. Summarize current skills, progress %
3. Highlight recent achievements
4. Mention next goals
```

**Generated Email**:
```
Subject: Learning Progress Update - [Month]

Hi [Manager/Team],

Quick update on my skill development:

**Current Focus**:
- React Hooks (65% complete)
- TypeScript (85% complete)
- Docker (40% complete)

**Recent Wins**:
- Completed [specific achievement]
- Applied [skill] to [project]

**Next Quarter Goals**:
- Master TypeScript advanced patterns
- Begin Kubernetes learning

Happy to discuss in our next 1:1.

Best,
[Your Name]
```

## Mail Add-in Modes

### Compose Mode

**Available when**: User is writing a new email or reply

**Capabilities**:
- Read subject, body, recipients
- Insert content
- Modify recipients (To, CC, BCC)
- Add attachments (limited API)

### Read Mode

**Available when**: User is reading a received email

**Capabilities** (Limited):
- Read subject, sender, body
- Extract entities (phone, email, URL)
- Cannot modify content

**Use Case**: Detect urgent emails in inbox, offer to draft reply

## Limitations

**Outlook-Specific**:
- No direct access to sent items or drafts folder
- Cannot modify email after send
- Limited attachment API (name/size only, no content)
- No calendar event creation (separate API)

**Mail Add-in Constraints**:
- Must be activated by user (cannot auto-insert on all emails)
- Context menu integration requires manifest configuration
- Web-based (no offline mode)

**Privacy**:
- Cannot read emails outside user's mailbox
- No access to other users' calendars
- All operations require user permission

## Future Enhancements

### Smart Reply Suggestions

```javascript
// Analyze email sentiment
// Suggest reply tone (formal, friendly, brief)
// Generate 3 reply options
```

### Email Template Library

```javascript
// Save common email patterns to OneDrive
// Template variables: {user_name}, {recipient}, {date}
// One-click insertion
```

### Calendar Integration

```javascript
// Create meeting from email action items
// Suggest attendees based on email thread
// Auto-populate agenda from notes.md
```

## Resources

- [Outlook JavaScript API Reference](https://learn.microsoft.com/javascript/api/outlook)
- [Mailbox API Overview](https://learn.microsoft.com/office/dev/add-ins/outlook/apis)
- [Mail Add-in Scenarios](https://learn.microsoft.com/office/dev/add-ins/outlook/outlook-add-ins-overview)
