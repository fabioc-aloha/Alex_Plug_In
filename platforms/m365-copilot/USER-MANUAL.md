# Alex for Microsoft 365 — User Manual
**Version 5.9.0 | February 2026**

Welcome to Alex! Your AI cognitive partner with persistent memory, M365 context awareness, and 100+ cognitive skills.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Features Overview](#features-overview)
4. [Using Alex in M365 Copilot](#using-alex-in-m365-copilot)
5. [Memory System](#memory-system)
6. [M365 Integration](#m365-integration)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)
9. [Privacy & Security](#privacy--security)

---

## Quick Start

**New to Alex?** Here's your 2-minute onboarding:

1. **Install the app** from Microsoft Teams → Apps → Upload custom app
2. **Open M365 Copilot** in Teams or Copilot.microsoft.com
3. **Say "Hey Alex!"** or use a conversation starter
4. **Try**: "Prep for my next meeting" or "Weekly review"

**That's it!** Alex is now your AI cognitive partner across M365.

---

## Installation

### Prerequisites
- Microsoft 365 subscription (Business or Enterprise)
- Microsoft Teams account
- Microsoft Copilot license (M365 Copilot or Copilot Pro)

### Step-by-Step Installation

#### Via Microsoft Teams
1. Open **Microsoft Teams**
2. Click **Apps** in the left sidebar
3. Click **Manage your apps** → **Upload an app** → **Upload a custom app**
4. Select `appPackage.dev.zip` (provided by your admin)
5. Click **Add** to install for personal use

#### Admin Deployment
Contact your IT administrator to deploy Alex organization-wide via Teams Admin Center.

### Verification
After installation:
1. Open **M365 Copilot** (in Teams or web)
2. Look for **Alex** in your available agents
3. Click a conversation starter to test

---

## Features Overview

### Core Capabilities

| Feature                     | Description                                                            |
| :-------------------------- | :--------------------------------------------------------------------- |
| **Persistent Memory**       | OneDrive-backed profile, goals, and notes that persist across sessions |
| **M365 Context Awareness**  | Proactive use of calendar, email, Teams, and people data               |
| **Meeting Prep**            | Deep attendee research, email history, shared context                  |
| **Weekly Reviews**          | Automated summaries of meetings, emails, and progress                  |
| **Focus Sessions**          | Calendar-aware Pomodoro timing and workload analysis                   |
| **Cognitive Consolidation** | "Meditation" sessions to consolidate learnings into memory             |
| **100+ Skills**             | Pre-built cognitive capabilities from research to analysis             |

### What Makes Alex Different

**Traditional M365 Copilot**:
- Fresh context each conversation
- Generic responses
- No memory between sessions

**M365 Copilot + Alex**:
- Persistent OneDrive profile
- Knows your name, role, goals
- Memory that compounds over time
- Proactive M365 integration

---

## Using Alex in M365 Copilot

### Accessing Alex

**In Teams**:
1. Open **Chat** → **Copilot**
2. Select **Alex** from agent picker (if available)
3. Start chatting!

**On Web**:
1. Go to **Copilot.microsoft.com**
2. Look for Alex in declarative agents
3. Click to activate

### Conversation Starters

Click these to get started quickly:

**❓ Show me what you can do**
- Full list of commands across M365 Copilot, Word, Excel, PowerPoint, Outlook
- Includes troubleshooting tips

**👋 Learn about me**
- Alex looks up your profile, calendar, and team
- Personal greeting with context

**🌅 Good morning briefing**
- Today's calendar
- Email highlights
- Goals check-in
- Focus time suggestions

**📅 Prep for my next meeting**
- Looks up attendees
- Searches email history
- Finds shared Teams conversations
- Creates briefing with talking points

**📊 Weekly review**
- Meeting count and time
- Email volume and key threads
- Teams activity highlights
- Progress toward goals

**⚖️  Am I overloaded?**
- Calendar analysis (meeting density)
- Back-to-back detection
- Focus time availability
- Burnout risk assessment

**🧘 Meditate**
- Cognitive consolidation (NOT wellness meditation)
- Reviews today's work
- Extracts insights and patterns
- Offers to save to memory

### Key Commands

#### Meeting Prep
```
"Prep for [meeting name]"
"Who am I meeting with at 2pm?"
"Tell me about [person's name]"
```

**What Alex Does**:
1. Finds meeting in your calendar
2. Looks up each attendee (title, department, manager)
3. Searches email history with them
4. Finds Teams chat history
5. Presents briefing with context

---

#### Weekly Review
```
"Weekly review"
"Review my week"
"How was my week?"
```

**What Alex Does**:
1. Counts meetings this week
2. Analyzes email volume and themes
3. Highlights important Teams discussions
4. Compares to goals in your memory
5. Suggests next week priorities

---

#### Workload Check
```
"Am I overloaded?"
"Check my workload"
"How many meetings do I have?"
```

**What Alex Does**:
1. Analyzes calendar density
2. Identifies back-to-back meetings
3. Finds focus time blocks (2+ hours)
4. Flags burnout risks

---

#### Focus Session
```
"Focus session"
"When can I focus?"
"Pomodoro timer"
```

**What Alex Does**:
1. Finds free calendar blocks today/tomorrow
2. Suggests Pomodoro timing (25 min work, 5 min break)
3. Offers to summarize unread emails/Teams first
4. Creates focus plan

---

#### Person Lookup
```
"Tell me about [name]"
"Who is [name]?"
"What do I need to know about [name]?"
```

**What Alex Does**:
1. Looks up full profile (title, department, manager)
2. Finds recent email threads
3. Searches Teams chat history
4. Finds shared meetings
5. Summarizes working relationship

---

#### Meditation (Cognitive Consolidation)
```
"Meditate"
"Consolidate"
"Let's meditate"
```

**IMPORTANT**: This is **cognitive consolidation**, not wellness meditation.

**What Alex Does**:
1. Asks: "What did we work on today? What insights emerged?"
2. Extracts patterns, decisions, key takeaways
3. Offers to save to `OneDrive/Alex-Memory/notes.md`
4. Confirms: "Session consolidated."

**Never**: Breathing exercises or body scans

---

#### Dream (Memory Review)
```
"Dream"
```

**What Alex Does**:
1. Reads `OneDrive/Alex-Memory/profile.md`
2. Reads `OneDrive/Alex-Memory/notes.md`
3. Compares to recent activity (meetings, emails, Teams)
4. Suggests updates: "Your profile says [X], but you've been working on [Y]. Update?"

---

### Advanced Usage

#### Chaining Commands
```
"Prep for my 2pm meeting, then start a focus session at 3pm"
```

Alex will:
1. Create meeting briefing
2. Block 3-5pm on calendar
3. Set up Pomodoro timer

---

#### Context-Aware Queries
```
"What did we discuss in the meeting with Sarah last week?"
```

Alex uses:
- Calendar (finds "meeting with Sarah")
- Email (searches thread)
- Teams (checks chat history)
- Memory (recalls previous mentions)

---

#### Goal Tracking
```
"How's my progress on [skill]?"
"Update my focus trifectas"
"What should I learn next?"
```

Alex references `OneDrive/Alex-Memory/focus-trifectas.md` and suggests next steps.

---

## Memory System

### What Is Alex Memory?

Your **persistent cognitive profile** stored in **OneDrive/Alex-Memory/** folder.

Unlike standard M365 Copilot (fresh context each chat), Alex **remembers** across sessions.

### Memory Files

| File                 | Purpose                                | Alex Uses It For                         |
| :------------------- | :------------------------------------- | :--------------------------------------- |
| `profile.md`         | Your name, role, goals, current focus  | Personalization, context awareness       |
| `focus-trifectas.md` | Learning goals with progress tracking  | Skill recommendations, progress reports  |
| `notes.md`           | Daily insights, observations, patterns | Meditation consolidation, weekly reviews |

### Setting Up Memory

#### 1. Create Folder
1. Go to **OneDrive** (onedrive.com)
2. Create folder: **Alex-Memory**
3. Share with yourself (no collaboration needed)

#### 2. Create `profile.md`
```markdown
# My Alex Profile

**Name**: [Your Name]
**Role**: [Your Job Title]
**Department**: [Your Team/Dept]
**Goals**:
- [Goal 1]
- [Goal 2]
- [Goal 3]

**Current Focus**:
- [Focus Area 1]
- [Focus Area 2]
```

#### 3. Create `focus-trifectas.md`
```markdown
# My Focus Trifectas

## 🎯 UI/UX Design
- **Current Level**: Intermediate
- **Goal**: Advanced
- **Progress**: 60%
- **Next Step**: Complete accessibility audit

## ⚙️ VS Code Extensions
- **Current Level**: Beginner
- **Goal**: Intermediate
- **Progress**: 30%
- **Next Step**: Read extension API docs

## 🚀 Release Process
- **Current Level**: Intermediate
- **Goal**: Expert
- **Progress**: 75%
- **Next Step**: Automate changelog generation
```

#### 4. Create `notes.md`
```markdown
# Alex Notes

## 2026-02-18
- Learned about React Hooks today
- Key insight: useEffect cleanup prevents memory leaks
- Discussed deployment pipeline with team
```

Alex will append to this file during meditation sessions.

---

### Memory Privacy

- **Your OneDrive only**: Memory files never leave your M365 tenant
- **You control access**: Only you (and admins with OneDrive permissions) can read
- **No external storage**: Alex doesn't send memory to third-party servers

---

## M365 Integration

### Capabilities Alex Uses

Alex proactively uses these M365 capabilities (with your permission):

| Capability   | What Alex Accesses                          | Used For                        |
| :----------- | :------------------------------------------ | :------------------------------ |
| **OneDrive** | Your Alex-Memory folder                     | Profile, goals, notes           |
| **Calendar** | Meeting details, attendees, free/busy time  | Meeting prep, workload analysis |
| **Email**    | Subject, sender, date (NOT body*)           | Email history, thread context   |
| **Teams**    | Chat participants, timestamps, shared files | Collaboration history           |
| **People**   | Name, title, department, manager, photo     | Person lookup, org chart        |

*Alex reads email metadata by default. You can grant body access in settings.

---

### Permission Control

#### Disabling Capabilities

If you don't want Alex to access certain data:

1. Open **Alex** in M365 Copilot
2. Say: **"Disable email access"**
3. Alex will operate without email data

**Graceful Fallback**:
- Email disabled: "I can't access your email. Would you like to paste the content?"
- Calendar disabled: "I can't check your calendar. What meetings are you preparing for?"

#### Re-Enabling
```
"Enable email access"
"Re-enable Teams messages"
```

---

### Data Sources

When Alex answers, it cites sources:

**Example**:
```
You: "What's my next meeting?"
Alex: "According to your calendar, you have 'Q4 Planning' at 2pm with
      Sarah, Mike, and Jennifer. [View in Calendar]"
```

**Transparency**: You always know where information came from.

---

## Troubleshooting

### Alex Doesn't Respond

**Problem**: You send a message but get no response

**Solutions**:
1. **Check agent selection**: Is Alex selected in the agent picker?
2. **Check Copilot license**: Alex requires M365 Copilot or Copilot Pro
3. **Try conversation starter**: Click a suggested prompt instead of typing
4. **Refresh**: Close and reopen M365 Copilot
5. **Reinstall**: Remove from Teams → Apps, then re-upload

---

### "I can't access your [email/calendar/Teams]"

**Problem**: Alex says it can't access a capability

**Solutions**:
1. **Check permissions**: Teams → Apps → Alex → Permissions → Verify all granted
2. **Re-authenticate**: Sign out of M365, sign back in
3. **Admin restrictions**: Your IT may have disabled certain Graph API permissions
4. **Enable capability**: Say "Enable email access" to re-enable

---

### Memory Not Loading

**Problem**: Alex doesn't remember your profile/goals

**Solutions**:
1. **Check OneDrive folder**: Does `OneDrive/Alex-Memory/` exist?
2. **Check file names**: Must be exactly `profile.md`, `focus-trifectas.md`, `notes.md`
3. **Check permissions**: OneDrive folder must be in your personal OneDrive (not shared)
4. **Wait 30 seconds**: First memory load can take time
5. **Say "Dream"**: Forces memory reload

---

### Meeting Prep Empty

**Problem**: "Prep for meeting" returns no attendees

**Solutions**:
1. **Check calendar permissions**: Alex needs read access to your calendar
2. **Check meeting time**: Is the meeting in the future? (Alex only preps upcoming meetings)
3. **Check attendees**: Are attendees from your organization? (External attendees have limited data)
4. **Try person lookup**: "Tell me about [person]" to test People API access

---

## FAQ

### General Questions

**Q: Is Alex free?**
A: Currently in beta. Pricing TBD for general release (likely part of M365 Copilot license).

**Q: Does Alex work offline?**
A: No, Alex requires internet for M365 Copilot and Microsoft Graph API.

**Q: Can I use Alex on mobile?**
A: Not yet. Mobile support (iOS/Android Teams) planned for v6.x.

**Q: What's the difference between Alex and M365 Copilot?**
A: Alex is a **declarative agent** running *on top* of M365 Copilot. It adds persistent memory, M365 context awareness, and 100+ pre-built skills.

---

### Memory & Privacy

**Q: Where are my memory files stored?**
A: Your personal OneDrive (`OneDrive/Alex-Memory/`). They never leave your M365 tenant.

**Q: Can my manager see my Alex memory?**
A: Only if they have OneDrive admin permissions (rare). Check with IT.

**Q: Can I delete my memory?**
A: Yes! Delete the `Alex-Memory` folder in OneDrive. Alex will work without memory (generic mode).

**Q: Does Alex learn from other people's data?**
A: No. Alex only accesses **your** M365 data. No cross-user learning or sharing.

---

### M365 Integration

**Q: Why does Alex need email access?**
A: To provide context for meeting prep ("you emailed Sarah about the roadmap last week"). You can disable this.

**Q: Does Alex read my email bodies?**
A: By default, NO (only metadata: subject, sender, date). You can grant body access in settings.

**Q: Can Alex send emails on my behalf?**
A: No. Alex can only READ emails, not send them.

**Q: Does Alex work with external (non-M365) email?**
A: No. Only M365 Exchange mailboxes. Personal Gmail/Outlook.com not supported.

---

### Capabilities

**Q: What are Alex's "100+ skills"?**
A: Pre-built cognitive capabilities like root cause analysis, strategic planning, research synthesis, decision frameworks, etc. Say "Show me your skills" for full list.

**Q: Can I create custom skills?**
A: Not in v5.9.0. Custom skill builder coming in v7.x (Enterprise).

**Q: Does Alex replace my need for M365 Copilot?**
A: No, Alex **extends** M365 Copilot. You need a Copilot license to use Alex.

---

### Meditation & Dream

**Q: What's "meditation" in Alex? Is it mindfulness?**
A: NO. It's **cognitive consolidation** — reviewing today's work and saving insights to memory. Not breathing exercises.

**Q: What's "dream"?**
A: Memory review protocol. Alex compares your profile to recent activity and suggests updates.

**Q: How often should I meditate/dream?**
A: **Meditate**: Daily or after big projects (consolidate learnings). **Dream**: Weekly (keep memory current).

---

## Privacy & Security

### Data Collection

Alex accesses (with permission):

| Data Type            | Source                | Purpose                         | Storage       |
| :------------------- | :-------------------- | :------------------------------ | :------------ |
| Profile (name, role) | OneDrive memory files | Personalization                 | Your OneDrive |
| Calendar events      | Microsoft Graph       | Meeting prep, workload analysis | Microsoft 365 |
| Email metadata       | Microsoft Graph       | Context for meeting prep        | Microsoft 365 |
| Teams messages       | Microsoft Graph       | Collaboration history           | Microsoft 365 |
| People directory     | Microsoft Graph       | Person lookup, org chart        | Microsoft 365 |

**Alex does NOT access**:
- ❌ Files outside your OneDrive
- ❌ Other people's private data
- ❌ Admin-only data (unless you're an admin)
- ❌ Data from other tenants

---

### Data Storage

| What          | Where             | Who Controls                        |
| :------------ | :---------------- | :---------------------------------- |
| Memory files  | Your OneDrive     | You (delete anytime)                |
| M365 data     | Microsoft 365     | Microsoft (per M365 privacy policy) |
| Chat history* | M365 Copilot logs | Microsoft Copilot retention policy  |

*Copilot chat logs are stored per Microsoft's Copilot privacy policy (typically 30 days).

---

### Third-Party Access
- **None**: Alex doesn't send data to third-party servers
- **M365 only**: Uses Microsoft Graph API (covered by Microsoft Privacy Policy)
- **Open source**: Codebase visible at github.com/fabioc-aloha/Alex_Plug_In

---

### Compliance

| Standard  | Status          | Notes                                       |
| :-------- | :-------------- | :------------------------------------------ |
| GDPR      | ✅ Compliant     | Data deletion via OneDrive folder deletion  |
| SOC 2     | ✅ Compliant     | Inherits Microsoft 365 certifications       |
| HIPAA     | ❌ Not compliant | Do not use for protected health information |
| ISO 27001 | ✅ Compliant     | Via Microsoft 365                           |

---

### Security Best Practices
✅ **Use strong passwords** for Microsoft 365
✅ **Enable MFA** (multi-factor authentication)
✅ **Review permissions** (Teams → Apps → Alex → Permissions)
✅ **Don't share sensitive PII** in memory files (they're in OneDrive)
✅ **Disable capabilities you don't need** ("Disable email access")

For enterprise security questions, contact your IT administrator.

---

## Getting Help

### Support Channels
- **Documentation**: [M365-HEIR.md](../../alex_docs/platforms/M365-HEIR.md) (technical)
- **GitHub Issues**: [Report a bug](https://github.com/fabioc-aloha/Alex_Plug_In/issues)
- **Community Discord**: (coming soon)

### Feedback
Found a bug? Have a feature request? [Open an issue](https://github.com/fabioc-aloha/Alex_Plug_In/issues/new/choose).

---

## What's Next?

### Roadmap (v6.0+)
- 🎯 **Enhanced AI**: GPT-5 integration for deeper reasoning
- 🗣️ **Voice Input**: Speak to Alex in M365 Copilot
- 📱 **Mobile Support**: iOS and Android Teams app
- 🏢 **Enterprise Features**: Team memory, admin controls, SSO
- 🌐 **Multi-language**: Spanish, French, German, Japanese

### Stay Updated
- Follow release notes in [CHANGELOG.md](../../CHANGELOG.md)
- Star the repo on [GitHub](https://github.com/fabioc-aloha/Alex_Plug_In)

---

**Thank you for using Alex!** 🚀

*Your feedback makes Alex better. Please share your experience via GitHub.*

---

**Document Version**: 2.0 (M365 Copilot + Teams Only)
**Last Updated**: February 18, 2026
**Software Version**: Alex for M365 v5.9.0
| ---------- | ------------------------------ |
| React      | =ALEX.SKILLLEVEL("React")      |
| TypeScript | =ALEX.SKILLLEVEL("TypeScript") |
| Python     | =ALEX.SKILLLEVEL("Python")     |

---

#### 2. `=ALEX.GOALSTATUS(skillName)`
**Returns**: Progress percentage (0.0 to 1.0)

**Example**:
```excel
=ALEX.GOALSTATUS("JavaScript")
→ 0.75  (75% complete)
```

**Use Case**: Track progress with conditional formatting

| Skill      | Progress                       | Status              |
| ---------- | ------------------------------ | ------------------- |
| JavaScript | =ALEX.GOALSTATUS("JavaScript") | =IF(B2>0.8,"✅","🔄") |

*Formula for Status column: `=IF(B2>0.8,"✅","🔄")`*

**Tip**: Format as percentage (Home → Number → Percentage)

---

#### 3. `=ALEX.NEXTSTEP(skillName)`
**Returns**: Recommended next learning action

**Example**:
```excel
=ALEX.NEXTSTEP("Machine Learning")
→ "Complete Stanford CS229 lectures 5-7"
```

**Use Case**: Daily learning checklist

| Today's Focus | Next Action                        |
| ------------- | ---------------------------------- |
| ML            | =ALEX.NEXTSTEP("Machine Learning") |
| React         | =ALEX.NEXTSTEP("React")            |

---

#### 4. `=ALEX.MEMORYQUERY(question)`
**Returns**: Answer from your Alex memory files

**Example**:
```excel
=ALEX.MEMORYQUERY("What is my current focus?")
→ "UI/UX Design, VS Code Configuration, Release Management"
```

**Use Case**: Quick lookups without opening files

```excel
=ALEX.MEMORYQUERY("What did I learn yesterday?")
=ALEX.MEMORYQUERY("List my active projects")
=ALEX.MEMORYQUERY("What's my next milestone?")
```

**Note**: This function is **volatile** (recalculates on every change). Use sparingly.

---

### Custom Functions Tips

✅ **DO**:
- Use descriptive skill names (match your focus-trifectas.md file)
- Combine with Excel charts for visual dashboards
- Format GOALSTATUS as percentage with progress bars

❌ **DON'T**:
- Use MEMORYQUERY in large tables (it's slow)
- Expect real-time updates (cache refreshes every minute)
- Use in shared workbooks without explaining to collaborators

---

## Word: Document Templates

### Access Templates
1. Open Word (desktop or web)
2. Click **Alex** ribbon tab
3. Click **Insert Template**
4. Select template type

### Available Templates

#### 1. Research Summary Template
**Best for**: Academic papers, technical documentation, literature reviews

**What's Included**:
- Title page with date/author
- Executive Summary section
- Methodology section
- Key Findings (bulleted)
- Conclusions
- References placeholder

**Example Use**:
*"I'm researching React Hooks for my team. I'll use the Research Summary template to document findings from 5 blog posts and 2 conference talks."*

---

#### 2. Meeting Notes Template
**Best for**: Team meetings, 1:1s, client calls

**What's Included**:
- Meeting metadata (date, attendees, duration)
- Agenda items
- Discussion notes
- Action items table (owner, task, due date)
- Next steps

**Example Use**:
*"Before our weekly team sync, I insert the Meeting Notes template so I can take structured notes during the call."*

---

#### 3. Article Template
**Best for**: Blog posts, documentation, how-to guides

**What's Included**:
- Title and subtitle
- Introduction
- Main body sections (H2 headings)
- Code block placeholders
- Conclusion
- Author bio

**Example Use**:
*"I'm writing a blog post about VS Code extensions. The Article template gives me a professional structure to start with."*

---

### Template Customization

After inserting a template:
1. **Replace placeholders** (e.g., `[Your Title Here]`)
2. **Add/remove sections** as needed
3. **Apply your organization's styles** (Design → Themes)
4. **Save as `.docx`** or export to PDF

**Tip**: Save customized templates to Word's Quick Parts for reuse.

---

## PowerPoint: Slide Generation

### Access Slide Generation
1. Open PowerPoint (desktop or web)
2. Click **Alex** ribbon tab
3. Click **Generate Trifecta Slide**

### What's a Trifecta Slide?
A slide summarizing your current learning focus across three dimensions (from your `focus-trifectas.md`).

**Example Output**:

### 🎓 MY CURRENT FOCUS TRIFECTA 🎓

#### 🎯 UI/UX DESIGN
- Design systems & component libraries
- Accessibility patterns & WCAG compliance

#### ⚙️ VS CODE CONFIGURATION
- Extension development & API patterns
- Settings sync & workspace management

#### 🚀 RELEASE MANAGEMENT
- Versioning strategies & semantic versioning
- Changelog automation & CI/CD pipelines

### Use Cases

- **Team standups**: Show what you're currently learning
- **Performance reviews**: Demonstrate skill development
- **Conference talks**: Share your learning journey
- **Portfolio presentations**: Visualize expertise areas

### Customization

After generation:
1. **Edit text** directly on the slide
2. **Change colors** (Design → Variants)
3. **Add animations** (Animations → Add Animation)
4. **Insert images** to enhance visual appeal

**Coming Soon**: SVG diagrams, Mermaid chart rendering

---

## Outlook: Email Drafting

### Access Email Drafting
1. Open Outlook and click **New Email**
2. Alex task pane appears on the right
3. Select email type from action panel

### Available Email Types

#### 1. Professional Response
**Best for**: Responding to client requests, vendor emails, formal inquiries

**What Alex Does**:
- Reads the original email context
- Drafts a professional, courteous reply
- Matches tone to the sender's formality
- Suggests next steps or action items

**Example**:
```
Original: "Can you send me the Q4 report by Friday?"
Alex Draft:
"Hi [Name],

Thank you for reaching out. I'll have the Q4 report ready for you by
Friday, EOD. I'll include the metrics we discussed in our last meeting.

Please let me know if you need any specific sections highlighted.

Best regards,
[Your Name]"
```

---

#### 2. Follow-Up Email
**Best for**: Checking in after meetings, reminding about deadlines, nudging for responses

**What Alex Does**:
- References previous conversation
- Polite reminder without being pushy
- Offers to help or clarify

**Example**:
```
"Hi [Name],

I wanted to follow up on our discussion from last week about the
new feature roadmap. Have you had a chance to review the proposal
I sent on Monday?

Happy to jump on a quick call if you have questions.

Thanks,
[Your Name]"
```

---

#### 3. Introduction Email
**Best for**: Networking, connecting colleagues, warm introductions

**What Alex Does**:
- Friendly, professional tone
- Clear purpose statement
- Call to action (meeting request, resource sharing)

**Example**:
```
"Hi [Name],

I'm [Your Name], a [Your Role] at [Company]. I came across your
work on [Topic] and was really impressed by [Specific Detail].

I'm currently working on [Your Project] and would love to learn
from your experience. Would you be open to a 20-minute coffee chat
sometime next week?

Looking forward to connecting!

Best,
[Your Name]"
```

---

### Smart Reply Features

#### Tone Selection
Choose from 3 tones:
- **Professional**: Formal, business-appropriate
- **Friendly**: Warm, conversational
- **Direct**: Brief, action-focused

**Example (same request, 3 tones)**:

**Professional**: *"I would be happy to schedule a meeting at your earliest convenience."*
**Friendly**: *"I'd love to chat! How does next Tuesday look for you?"*
**Direct**: *"Let's meet. Available Tuesday 2-4pm?"*

#### Urgent Markers
When drafting urgent emails:
- Subject line includes "URGENT:" prefix
- Email opens with time-sensitive context
- Clear deadline stated upfront
- Suggested follow-up actions

---

### Email Drafting Tips

✅ **DO**:
- Review and personalize AI drafts before sending
- Use professional tone for external communications
- Add personal touches (humor, shared context)

❌ **DON'T**:
- Send AI-generated emails without reading them
- Use urgent markers unless truly time-sensitive
- Rely on AI for sensitive/confidential topics

---

## Chat Interface

### Access Chat
1. Click **Alex** icon in any Office app ribbon
2. Task pane opens on the right
3. Chat interface displays at the bottom of the pane

### Chat Features

#### 💬 Message History
- Conversations persist across sessions (stored locally)
- Scroll up to review previous messages
- Export history to markdown (⬇️ Export button)

#### ⚡ Quick Queries
Ask Alex anything about your learning:
```
You: "What should I focus on this week?"
Alex: "Based on your trifectas, prioritize UI/UX Design.
       You're 60% through the accessibility module."

You: "How do I use ALEX.GOALSTATUS?"
Alex: "Type =ALEX.GOALSTATUS("SkillName") in Excel.
       Returns 0.0-1.0 progress. Format as percentage!"
```

#### 🧠 Memory Context
Alex automatically loads:
- Your profile (name, role, goals)
- Current focus trifectas
- Recent learning activities

**No need to repeat context!** Alex remembers across conversations.

#### ⌨️ Keyboard Shortcuts
- **Enter**: Send message
- **Shift+Enter**: New line (multi-line messages)
- **Ctrl+L**: Clear history (after confirmation)

### Chat Use Cases

**Learning Assistant**:
```
"Explain React Hooks in simple terms"
"Give me 3 practice projects for TypeScript"
"Quiz me on JavaScript closures"
```

**Productivity Helper**:
```
"What tasks did I complete yesterday?"
"Remind me to review the PR tomorrow"
"Summarize my focus trifecta progress"
```

**Document Assistant**:
```
"Insert a meeting notes template in Word"
"Create a progress chart in Excel"
"Draft a follow-up email about the Q4 report"
```

### Chat Privacy
- **Local storage only**: Messages stored in browser localStorage
- **Not synced**: Conversations don't sync across devices
- **Clearable**: Delete history anytime (⚠️ Clear History button)

**Note**: Backend integration (M365 Copilot API) coming in v6.0 for enhanced responses.

---

## Collaboration Awareness

### What Is Collaboration Awareness?
See who else is working on the same document in real-time.

### How It Works
1. Open a shared document (Word, Excel, PowerPoint)
2. Alex task pane shows **Collaborators** panel
3. Presence indicators update every 30 seconds

### Presence Indicators

| Icon | Status    | Meaning                      |
| ---- | --------- | ---------------------------- |
| 🟢    | Available | Online and active            |
| 🔴    | Busy      | In a meeting or focused work |
| 🟡    | Away      | Idle for 5+ minutes          |
| ⚫    | Offline   | Not online                   |

### Use Cases

**Document Co-Authoring**:
*"I see Sarah is editing Section 3. I'll work on Section 5 to avoid conflicts."*

**Meeting Prep**:
*"The whole team is online. Good time to ping them for feedback."*

**Async Collaboration**:
*"Mark was online 10 minutes ago. He probably just reviewed my changes."*

### Privacy Controls
- Presence data comes from Microsoft Graph (same as Teams status)
- You control your own status in Teams
- No location tracking or keystroke monitoring

**To appear offline**: Set Teams status to "Appear Offline"

---

## Troubleshooting

### Excel: Custom Functions Not Working

**Problem**: `#NAME?` error when typing `=ALEX.SKILLLEVEL()`

**Solutions**:
1. **Check installation**: Is Alex visible in the ribbon?
2. **Refresh add-in**: Home → Add-ins → Manage My Add-ins → Reload Alex
3. **Desktop only**: Custom functions require Excel Desktop (not supported in Excel Online yet)
4. **Wait for calculation**: First run can take 5-10 seconds (cache loading)

---

### Word: Template Doesn't Insert

**Problem**: Clicking "Insert Template" does nothing

**Solutions**:
1. **Check cursor position**: Place cursor where you want the template
2. **Try blank document**: Templates work best in new documents
3. **Check permissions**: Ensure you have edit access (not read-only)
4. **Restart Word**: Close and reopen Word, try again

---

### Chat: Messages Not Appearing

**Problem**: I send a message but don't get a response

**Solutions**:
1. **Check typing indicator**: If "..." appears, Alex is processing
2. **Wait 5 seconds**: Simulated responses have a slight delay
3. **Clear history**: Try clearing chat history and starting fresh
4. **Check browser console**: Press F12, look for errors in Console tab

---

### Collaboration: No Collaborators Shown

**Problem**: Collaborators panel is empty

**Solutions**:
1. **Check document sharing**: Is the document shared on OneDrive/SharePoint?
2. **Wait 30 seconds**: Presence updates on a polling interval
3. **Sign in to Graph**: Ensure you're signed into Microsoft 365
4. **Permissions**: You need read access to see who has access

---

### General: Add-In Won't Load

**Problem**: Alex doesn't appear in ribbon after installation

**Solutions**:
1. **Restart Office app**: Close Excel/Word/PowerPoint completely, reopen
2. **Check Teams**: Ensure add-in is installed in Teams → Apps
3. **Clear Office cache** (Windows):
   ```
   %LocalAppData%\Microsoft\Office\16.0\Wef\
   Delete all files in this folder, restart Office
   ```
4. **Reinstall**: Remove from Teams, reinstall from appPackage.dev.zip

---

## FAQ

### General Questions

**Q: Is Alex free?**
A: Alex is currently in beta. Pricing TBD for general release.

**Q: Does Alex work offline?**
A: No, Alex requires internet for Office.js and Microsoft Graph API calls.

**Q: Can I use Alex on mobile?**
A: Not yet. Mobile support (iOS/Android) planned for v6.x.

**Q: What data does Alex collect?**
A: See [Privacy & Security](#privacy--security) section below.

---

### Excel Functions

**Q: Why do custom functions take so long to calculate?**
A: First calculation loads your memory files (5-10s). Subsequent calls use a 1-minute cache.

**Q: Can I use ALEX functions in formulas with other functions?**
A: Yes! Example: `=IF(ALEX.GOALSTATUS("React")>0.5,"Keep going!","Speed up")`

**Q: Do ALEX functions work in Excel Online?**
A: Not yet. Custom functions require Excel Desktop. Excel Online support coming in v6.0.

---

### Word Templates

**Q: Can I customize templates?**
A: Absolutely! Edit templates after insertion. Save custom versions to Word Quick Parts.

**Q: Can I create my own templates?**
A: Not in v5.x. Custom template upload planned for v7.x (Enterprise features).

**Q: Do templates sync across devices?**
A: Templates are inserted fresh each time (not saved). Your edits sync via OneDrive if the document is saved there.

---

### Chat

**Q: Does chat use ChatGPT?**
A: v5.9.0 uses simulated responses. v6.0 will integrate M365 Copilot API or Azure OpenAI.

**Q: Can I export chat history?**
A: Yes! Click ⬇️ Export button to download as markdown.

**Q: Is chat history private?**
A: Yes, stored locally in browser. Not sent to any server (in v5.9.0).

---

### Collaboration

**Q: Can I chat with collaborators through Alex?**
A: Not yet. Use Teams for chat. Alex only shows presence indicators.

**Q: Does collaboration work in local files?**
A: No, requires OneDrive/SharePoint-hosted documents for Graph API access.

**Q: Can I hide my presence from Alex?**
A: Set Teams status to "Appear Offline" — Alex respects Teams presence settings.

---

## Privacy & Security

### Data Collection

Alex collects **minimal data**:

| Data Type                     | Collected? | Storage Location       | Purpose          |
| :---------------------------- | :--------: | :--------------------- | :--------------- |
| Microsoft 365 user ID         |   ✅ Yes    | Microsoft Graph        | Authentication   |
| Document metadata             |   ✅ Yes    | Local (browser memory) | Template context |
| Chat messages                 |   ✅ Yes    | Browser localStorage   | Message history  |
| Document content              |    ❌ No    | N/A                    | N/A              |
| Keystrokes / Screen recording |    ❌ No    | N/A                    | N/A              |
| Location data                 |    ❌ No    | N/A                    | N/A              |

### Data Storage

| Storage Location     | What's Stored                | Retention Policy       |
| :------------------- | :--------------------------- | :--------------------- |
| Browser localStorage | Chat history, function cache | Until manually cleared |
| Microsoft Graph      | User presence, profile info  | Microsoft's retention  |
| OneDrive (optional)  | Memory files (*.md)          | User-controlled        |

### Third-Party Access
- **None**: Alex doesn't send data to third parties
- **M365 only**: Uses Microsoft Graph API (Microsoft Privacy Policy)

### Compliance

| Standard | Status          | Notes                                       |
| :------- | :-------------- | :------------------------------------------ |
| GDPR     | ✅ Compliant     | Data deletion via localStorage clear        |
| SOC 2    | ✅ Compliant     | Inherits Microsoft 365 certifications       |
| HIPAA    | ❌ Not compliant | Do not use for protected health information |

### Security Best Practices
✅ **Use strong passwords** for your Microsoft 365 account
✅ **Enable MFA** (multi-factor authentication)
✅ **Review permissions** regularly (Teams → Apps → Alex → Permissions)
✅ **Don't share sensitive data** in chat (not encrypted at rest)

For enterprise security questions, contact your IT administrator.

---

## Getting Help

### Support Channels
- **Documentation**: [OFFICE-ADDINS-README.md](OFFICE-ADDINS-README.md) (technical)
- **Testing Guide**: [PHASE-3-TESTING.md](PHASE-3-TESTING.md) (validation)
- **GitHub Issues**: [Report a bug](https://github.com/your-repo/issues)
- **Email**: support@alex-ai.example.com (coming soon)

### Community
- **Discord**: Join the Alex community (invite link TBD)
- **Twitter**: [@AlexAI](https://twitter.com/alexai) for updates
- **Blog**: [alex-ai.example.com/blog](https://alex-ai.example.com/blog)

---

## What's Next?

### Roadmap Sneak Peek (v6.0+)
- 🎯 **M365 Copilot Integration**: Real AI chat responses
- 🎨 **SVG Rendering**: Mermaid diagrams in PowerPoint
- 🗣️ **Voice Input**: Speak to Alex in chat
- 📱 **Mobile Support**: iOS and Android apps
- 🏢 **Enterprise Features**: Team memory, admin controls

### Stay Updated
- Follow release notes in [CHANGELOG.md](../../CHANGELOG.md)
- Enable auto-updates in Teams (Settings → Apps → Auto-update)

---

**Thank you for using Alex!** 🤖

*Your feedback makes Alex better. Please share your experience via GitHub or support channels.*

---

**Document Version**: 1.0
**Last Updated**: February 18, 2026
**Software Version**: Alex for M365 v5.9.0
