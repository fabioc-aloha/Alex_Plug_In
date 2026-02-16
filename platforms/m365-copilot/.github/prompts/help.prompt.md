---
title: "M365 Help"
description: "Quick help reference for Alex Office Add-in features and commands"
category: "user-guide"
scope: "m365-copilot"
---

# /help — Alex for Microsoft 365 Quick Reference

**Version**: v5.7.7  
**Platform**: Office Add-in (Word, Excel, PowerPoint, Outlook)

---

## 🚀 Quick Start

### Memory Setup (One-Time)
1. Create folder: `OneDrive/Alex-Memory/`
2. Add 3 files:
   - **profile.md** → Your name, role, goals
   - **focus-trifectas.md** → 3 learning skills
   - **notes.md** → Daily context
3. Open Office app → Insert tab → Add Alex add-in
4. Grant OneDrive permissions

✅ **Test**: Click any template button → Should see your name from profile.md

---

## 📝 Word Commands

| Button | What It Does | Memory Required |
|--------|--------------|-----------------|
| 📄 Research Summary | Insert research template with your name/role | profile.md |
| 📋 Meeting Notes | Insert meeting template with current focus | profile.md, notes.md |
| ✍️ Article Template | Insert blog post outline | profile.md |
| 📐 Insert Mermaid Diagram | Add flowchart (placeholder in v5.7.7) | None |

**Activates Skills**: markdown-mermaid, writing-publication, persona-detection

---

## 📊 Excel Commands

### Task Pane Buttons
| Button | What It Does | Memory Required |
|--------|--------------|-----------------|
| 📋 Create Goals Tracker | Import focus trifectas as table | focus-trifectas.md |
| 📈 Create Skill Chart | Generate progress visualization | focus-trifectas.md |
| 🧮 Show Custom Functions | Display formula help | None |

### Custom Formulas
```excel
=ALEX.SKILLLEVEL("React")        → Current skill level
=ALEX.GOALSTATUS("TypeScript")   → Progress % (0.0 to 1.0)
=ALEX.NEXTSTEP("Python")         → Next action to take
=ALEX.MEMORYQUERY("current focus") → Answer from notes.md
```

**Cache**: 60 seconds (edit focus-trifectas.md → wait 60s → formulas refresh)

**Activates Skills**: persona-detection, knowledge-synthesis, testing-strategies

---

## 🎨 PowerPoint Commands

| Button | What It Does | Memory Required |
|--------|--------------|-----------------|
| 🎯 Generate Trifecta Slide | Create 4-slide deck from focus skills | focus-trifectas.md |
| 📐 Architecture Diagram | Insert system architecture visual | None |
| 🎬 Apply Entrance Animations | Prepare animation structure (⚠️ API limitation) | None |
| 🅰️ Insert Alex Logo | Add branding | None |
| 🎨 Apply Alex Theme | Set colors/fonts | None |

**⚠️ Note**: Animations button prepares structure only. PowerPoint.js doesn't support actual animation control (Phase 4 feature).

**Activates Skills**: svg-graphics, ui-ux-design, brand-asset-management

---

## ✉️ Outlook Commands

### Email Templates
| Button | Tone | Best For |
|--------|------|----------|
| ↩️ Draft Response | Professional | Replying to inquiries |
| 📬 Draft Follow-up | Friendly reminder | Post-meeting check-ins |
| 👋 Draft Introduction | Warm greeting | First contact |

### Smart Replies (Phase 3)
| Button | What It Does | Memory Required |
|--------|--------------|-----------------|
| 🧠 Generate Smart Replies | 3 sentiment-aware options (Professional, Casual, Brief) | profile.md |

**Sentiment Detection**: Urgent, Positive, Negative, Neutral (keyword-based)

**⚠️ Always review** — Keyword analysis misses context ("not urgent" → classified as urgent)

### Calendar Integration (Phase 3)
| Button | What It Does | Memory Required |
|--------|--------------|-----------------|
| 📅 Create Meeting from Email | Parse date/time, create appointment | None |

**Supported Dates**: 02/20/2026, "next Monday", "this Friday at 2pm"

**Activates Skills**: incident-response, persona-detection, writing-publication

---

## 🔗 Cognitive Integration (Synapses)

Alex connects Office features to **29 VS Code skills** via synaptic network:

**What happens when you click a button?**
1. Office task pane activates
2. Synapse triggers related VS Code skill
3. You get access to skill knowledge even in Office

**Example**: Click "Insert Mermaid Diagram" in Word → Activates `markdown-mermaid (0.9)` skill → Alex knows diagram syntax patterns

**View Full Map**: [COGNITIVE-INTEGRATION-MAP.md](../../COGNITIVE-INTEGRATION-MAP.md)

---

## 🔧 Troubleshooting

### "Memory not available" Warning
**Fix**: 
1. Check `OneDrive/Alex-Memory/` folder exists
2. Add profile.md, focus-trifectas.md, notes.md
3. Click "Setup now" link in task pane

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

### PowerPoint Animations Don't Apply
**Explanation**: 
- PowerPoint.js API limitation
- Button prepares structure, can't apply actual animations
- Manually add via PowerPoint ribbon (Animations tab)
- Full OOXML implementation coming in Phase 4

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| **[USER-MANUAL.md](../../USER-MANUAL.md)** | Complete user guide (this help is a summary) |
| **[OFFICE-ADDINS-README.md](../../OFFICE-ADDINS-README.md)** | Platform overview, architecture |
| **[COGNITIVE-INTEGRATION-MAP.md](../../COGNITIVE-INTEGRATION-MAP.md)** | Synapse network catalog |
| **[PHASE-3-IMPLEMENTATION-SUMMARY.md](../../PHASE-3-IMPLEMENTATION-SUMMARY.md)** | Advanced features technical details |
| **[M365-QA-REPORT-2026-02-16.md](../../M365-QA-REPORT-2026-02-16.md)** | Known issues, quality audit |

---

## 💡 Pro Tips

1. **Update focus-trifectas.md weekly** — Excel functions and PowerPoint slides pull from here
2. **Use Excel formulas in dashboards** — `=ALEX.GOALSTATUS("React")` makes great chart data
3. **Review smart replies** — AI suggestions are drafts, not final versions
4. **Edit PowerPoint slides in place** — Don't regenerate (overwrites changes)
5. **Check OneDrive sync** — Memory files must be synced to cloud

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Where |
|----------|--------|-------|
| `Alt + Shift + A` | Open Alex task pane | All Office apps |
| `Ctrl + Shift + H` | Show memory status | Task pane open |
| `F9` | Refresh Excel functions | Excel only |
| `Esc` | Close task pane | All Office apps |

---

## 🆘 Getting Support

- **GitHub Issues**: [Report bugs](https://github.com/fabioc-aloha/Alex_Plug_In/issues)
- **Discussions**: [Ask questions](https://github.com/fabioc-aloha/Alex_Plug_In/discussions)
- **Full Manual**: Type `/help manual` or open USER-MANUAL.md

---

**Quick Reference** — Type `/help` anytime to see this guide  
**Full Manual** — [USER-MANUAL.md](../../USER-MANUAL.md) — 2,000+ words  
**Version**: v5.7.7 — Last Updated: 2026-02-16
