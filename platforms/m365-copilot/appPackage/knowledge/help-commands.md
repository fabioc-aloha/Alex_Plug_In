# Commands — Help Reference

> **RETRIEVAL DIRECTIVE**: When user says "help", "what can you do", "show commands", "how do I use Alex", or asks for documentation → Use this file as the complete reference.

**Version**: v5.7.7
**Platform**: Office Add-in + M365 Copilot

---

## How to Ask for Help

Just ask naturally:
- "What can you do?"
- "Show me your commands"
- "How do I use Excel formulas?"
- "Help with Word features"

---

## 📝 Word Add-in Commands

| Button                   | What It Does                                 | Memory Required      |
| ------------------------ | -------------------------------------------- | -------------------- |
| 📄 Research Summary       | Insert research template with your name/role | profile.md           |
| 📋 Meeting Notes          | Insert meeting template with current focus   | profile.md, notes.md |
| ✍️ Article Template       | Insert blog post outline                     | profile.md           |
| 📐 Insert Mermaid Diagram | Add flowchart (placeholder in v5.7.7)        | None                 |

---

## 📊 Excel Add-in Commands

### Custom Formulas
```excel
=ALEX.SKILLLEVEL("React")        → Current skill level
=ALEX.GOALSTATUS("TypeScript")   → Progress % (0.0 to 1.0)
=ALEX.NEXTSTEP("Python")         → Next action to take
=ALEX.MEMORYQUERY("current focus") → Answer from notes.md
```

### Task Pane Buttons
- 📋 Create Goals Tracker → Import focus trifectas as table
- 📈 Create Skill Chart → Generate progress visualization
- 🧮 Show Custom Functions → Display formula help

**Cache**: 60 seconds (edit focus-trifectas.md → wait 60s → formulas refresh)

---

## 🎨 PowerPoint Add-in Commands

| Button                      | What It Does                                   | Memory Required    |
| --------------------------- | ---------------------------------------------- | ------------------ |
| 🎯 Generate Trifecta Slide   | Create 4-slide deck from focus skills          | focus-trifectas.md |
| 📐 Architecture Diagram      | Insert system architecture visual              | None               |
| 🎬 Apply Entrance Animations | Prepare animation structure (⚠️ API limitation) | None               |

**⚠️ Note**: Animations button prepares structure only. PowerPoint.js doesn't support actual animation control (Phase 4 feature).

---

## ✉️ Outlook Add-in Commands

### Smart Replies
| Button                   | What It Does                                            |
| ------------------------ | ------------------------------------------------------- |
| 🧠 Generate Smart Replies | 3 sentiment-aware options (Professional, Casual, Brief) |

**Sentiment Detection**: Urgent, Positive, Negative, Neutral (keyword-based)

### Calendar Integration
| Button                      | What It Does                        |
| --------------------------- | ----------------------------------- |
| 📅 Create Meeting from Email | Parse date/time, create appointment |

**Supported Dates**: 02/20/2026, "next Monday", "this Friday at 2pm"

---

## 🚀 M365 Copilot Commands

### Cognitive Protocols

**Meeting Prep**: "Prep for my next meeting"
- Gets attendees, looks up each person, searches email history, presents briefing

**Person Lookup**: "Tell me about [name]"
- Full profile, email history, Teams chats, meeting history

**Weekly Review**: "Let's review my week"
- Summarize meetings, email volume, compare to goals in Alex-Memory

**Workload Check**: "Am I overloaded?"
- Count meetings, find focus blocks, flag back-to-backs

**Focus Session**: "Schedule focus time"
- Find free calendar blocks, suggest pomodoro timing

**Meditation** (Cognitive Consolidation): "Let's meditate" or "Consolidate knowledge"
- Extract patterns from today's work
- Offer to save insights to OneDrive/Alex-Memory/notes.md
- NOT wellness meditation — this is knowledge consolidation

**Dream**: "Dream about my work"
- Read Alex-Memory files
- Suggest updates based on current activity patterns

---

## 💾 Memory Setup (One-Time)

1. Create folder: `OneDrive/Alex-Memory/`
2. Add 3 files:
   - **profile.md** → Your name, role, goals
   - **focus-trifectas.md** → 3 learning skills with progress
   - **notes.md** → Daily context, current focus

Example profile.md:
```markdown
# My Profile

**Name**: Fabio Correa
**Role**: Senior Software Engineer
**Team**: Product Engineering
**Current Goals**:
- Ship v2.0 of platform
- Learn TypeScript advanced patterns
- Mentor 2 junior developers

**Current Focus**: React performance optimization
```

Example focus-trifectas.md:
```markdown
# Focus Trifectas

1. **React Performance** (0.6) — Advanced hooks, memoization patterns
2. **TypeScript** (0.4) — Generics, conditional types
3. **System Design** (0.3) — Distributed systems, event sourcing
```

✅ **Test**: Ask "What's my name?" → Alex should read from profile.md and respond with your actual name

---

## 🔧 Troubleshooting

### "Memory not available" Warning
**Fix**:
1. Check `OneDrive/Alex-Memory/` folder exists
2. Add profile.md, focus-trifectas.md, notes.md
3. Grant OneDrive permissions when prompted

### Excel Functions Show #ERROR
**Fix**:
1. Verify focus-trifectas.md exists in OneDrive
2. Check internet connection (needs OneDrive access)
3. Wait 60 seconds for cache refresh
4. Retry formula

### Smart Replies Wrong Tone
**Fix**:
- Always review & edit generated replies
- Sentiment is keyword-based (not perfect)
- Treat as draft, not final version

---

## 🔗 Cognitive Integration (29 Synapses)

Alex connects Office features to **29 VS Code skills**:

When you click a button in Word/Excel/PowerPoint/Outlook, Alex activates related VS Code skills to provide deeper knowledge.

**Example**: Click "Insert Mermaid Diagram" in Word → Activates `markdown-mermaid (0.9)` skill → Alex knows diagram syntax patterns

---

## ⌨️ Keyboard Shortcuts

| Shortcut           | Action                  | Where           |
| ------------------ | ----------------------- | --------------- |
| `Alt + Shift + A`  | Open Alex task pane     | All Office apps |
| `Ctrl + Shift + H` | Show memory status      | Task pane open  |
| `F9`               | Refresh Excel functions | Excel only      |
| `Esc`              | Close task pane         | All Office apps |

---

## 💡 Pro Tips

1. **Update focus-trifectas.md weekly** — Excel functions and PowerPoint slides pull from here
2. **Use Excel formulas in dashboards** — `=ALEX.GOALSTATUS("React")` makes great chart data
3. **Review smart replies** — AI suggestions are drafts, not final versions
4. **Ask for meditation** — Daily consolidation captures learnings in notes.md
5. **Check OneDrive sync** — Memory files must be synced to cloud

---

## 📚 Full Documentation

For complete details, ask Alex to:
- "Show me the user manual"
- "Explain the cognitive integration"
- "What are the known issues?"

Or access files directly in OneDrive/Alex-Files/Documentation/

---

**Quick Help** — Ask "What can you do?" or "Show commands" anytime
**Version**: v5.7.7 — Last Updated: 2026-02-17
