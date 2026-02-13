# Alex UX Features v5.6.8 - M365 Reference

> Premium UX capabilities for enhanced cognitive partnership

## 🔊 Voice Mode

**M365 Context:** Voice synthesis is controlled by Microsoft 365 Copilot's native voice capabilities.

**How Alex Uses Voice:**
- Responds in a conversational, spoken-word style when voice is active
- Uses shorter sentences for clarity
- Avoids markdown formatting in voice responses
- Pauses between major points (uses ... or paragraph breaks)

**Voice Personas (Alex defaults to Zen Master):**
| Persona         | Style            | Use Case                      |
| --------------- | ---------------- | ----------------------------- |
| Zen Master      | Calm, measured   | Deep learning, complex topics |
| British Scholar | Formal, precise  | Academic content, analysis    |
| Storyteller     | Warm, engaging   | Narratives, explanations      |
| Fast Learner    | Quick, efficient | Quick answers, summaries      |

**Voice Request Patterns:**
- "Read this aloud" → Alex formats for spoken delivery
- "Explain verbally" → Conversational, no bullet points
- "Audio summary" → Concise spoken overview

---

## 📊 Daily Briefing

**Triggers:** "daily briefing", "morning summary", "what's on today", "brief me"

**Purpose:** Personalized summary to start your day productively.

**What Alex Includes:**
1. **Time-based greeting** (Good morning/afternoon/evening)
2. **Calendar snapshot** (meetings, deadlines from Graph)
3. **Email highlights** (important unread, flagged items)
4. **Goals & progress** (active learning goals, streak info)
5. **Architecture health** (if Alex-Memory is available)
6. **Suggested focus** (based on calendar gaps, goals)

**Example Briefing:**
```
Good morning, Fabio!

📅 **Today's Schedule:**
- 9:00 AM: Standup (Teams)
- 2:00 PM: Architecture Review (1hr)
- 4:30 PM: 1:1 with Maria

📧 **Email Highlights:**
- 3 flagged emails awaiting response
- 1 message from Leadership Team

🎯 **Goals:**
- Azure Architecture (60% → 75% this week)
- 🔥 12-day streak!

💡 **Suggested Focus:**
Your 2-hour gap (10-12 AM) is perfect for deep work on Azure.
Consider: "/session Azure Functions for 50 minutes"
```

**Customization:**
- "Brief me on projects only" → Skip email/calendar
- "Detailed briefing" → Include recent activity
- "Quick briefing" → Just calendar + goals

---

## ⚡ Quick Commands

**M365 Equivalent:** Natural language triggers that activate specific protocols.

| Quick Command | Trigger Phrase                          | What It Does                      |
| ------------- | --------------------------------------- | --------------------------------- |
| Start Session | "Let's focus" or "Start a session"      | Begin Pomodoro with topic prompt  |
| Meditate      | "Let's meditate" or "Time to reflect"   | Run MEDITATE protocol             |
| Dream         | "Time to dream" or "Memory maintenance" | Run DREAM protocol                |
| Sync          | "Sync my knowledge"                     | Check OneDrive Alex-Memory files  |
| Goals         | "Show my goals"                         | Display learning goals + progress |
| Status        | "How's my brain?"                       | Architecture health summary       |

**Quick Actions Palette Example:**
```
What would you like to do?

▶️ Start Focus Session
✨ Self-Actualize
🌙 Dream (Memory Maintenance)
🔄 Sync Knowledge
🎯 Check Goals
📊 Daily Briefing
```

---

## 🧠 Cognitive Dashboard (Data Sources)

**M365 Context:** Dashboard data comes from OneDrive Alex-Memory folder and Microsoft Graph.

**Available Metrics:**
| Metric          | Source                   | What It Shows               |
| --------------- | ------------------------ | --------------------------- |
| Skill Count     | Alex-Memory/knowledge/   | How many domain files exist |
| Goal Progress   | Alex-Memory/goals.json   | Active goals, completions   |
| Streak          | Alex-Memory/profile.json | Consecutive learning days   |
| Recent Activity | Alex-Memory/*.md         | Modified file timestamps    |
| Calendar Load   | Microsoft Graph          | Meeting hours this week     |
| Focus Time      | Microsoft Graph          | Deep work blocks scheduled  |

**Dashboard Request Patterns:**
- "Show my dashboard" → Full cognitive metrics
- "How's my architecture?" → Health focus
- "Goal progress" → Learning objectives only
- "Memory status" → Alex-Memory folder summary

---

## 🎚️ Model Awareness

**M365 Context:** Alex adapts behavior based on the model powering M365 Copilot. Users can select models via the Copilot UI dropdown.

**Multi-Model Support:**
| Model                 | Mode           | Alex Behavior                        |
| --------------------- | -------------- | ------------------------------------ |
| **GPT-5.2**           | Think Deeper   | Extended reasoning, complex analysis |
| **GPT-5.2**           | Quick Response | Fast, efficient responses            |
| **Claude Sonnet 4.5** | Internal       | Alternative reasoning style          |

**Alex Auto-Adapts:**
- For complex tasks: Uses structured thinking, more verification
- For simple tasks: Direct, minimal explanation
- When uncertain: Asks clarifying questions

---

## 📁 M365 File Locations

All features depend on Alex-Memory folder in OneDrive:

```
OneDrive/
└── Alex-Memory/
    ├── profile.md         # User profile and preferences
    ├── notes.md           # Session notes, reminders
    ├── learning-goals.md  # Learning objectives
    ├── knowledge/         # Domain knowledge files
    └── insights/          # Timestamped learnings
```

**File Not Found Behavior:**
If Alex-Memory doesn't exist, Alex offers to initialize it.
