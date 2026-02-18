# Phase 3 Testing Guide
**Office-Specific Features Testing Checklist**

**Version**: v5.9.0
**Date**: February 18, 2026

---

## Prerequisites

1. ✅ Alex M365 add-in installed (appPackage.dev.zip)
2. ✅ OneDrive memory setup complete:
   - `profile.md` with name, role, goals
   - `focus-trifectas.md` with skills
   - `notes.md` optional
3. ✅ Microsoft 365 subscription (E3/E5 or Business Premium)
4. ✅ Office apps installed: Word, Excel, PowerPoint, Outlook

---

## Test 1: Custom Excel Functions (UDFs)

### Setup
1. Open Excel (desktop or web)
2. Open Alex add-in via Home ribbon → Alex button
3. Wait for memory to load (green indicators)

### Test Cases

#### Test 1.1: ALEX.SKILLLEVEL
**Input**:
```excel
=ALEX.SKILLLEVEL("React")
```

**Expected Output**:
- If React is in focus-trifectas.md: `Beginner` / `Intermediate` / `Advanced` / `Expert`
- If not in focus: `Not in focus`
- On error: `#ERROR: <error message>`

**Validation**:
- [ ] Formula inserts without error
- [ ] Returns correct skill level from memory
- [ ] Updates when focus-trifectas.md changes (after 1-minute cache expires)

---

#### Test 1.2: ALEX.GOALSTATUS
**Input**:
```excel
=ALEX.GOALSTATUS("TypeScript")
```

**Expected Output**:
- Progress percentage: `0.75` (format as percent: 75%)
- If not in focus: `0`

**Validation**:
- [ ] Returns numeric value between 0.0 and 1.0
- [ ] Formats correctly as percentage
- [ ] Can be used in charts/conditional formatting

**Create Test Chart**:
1. Create table with columns: Skill | Progress
2. Add formulas: `=ALEX.GOALSTATUS("React")`, etc.
3. Format Progress column as percentage
4. Insert column chart
5. Verify visual representation

---

#### Test 1.3: ALEX.NEXTSTEP
**Input**:
```excel
=ALEX.NEXTSTEP("Python")
```

**Expected Output**:
- Next action from focus-trifectas.md: `"Practice fundamentals"`, `"Build project"`, etc.
- If not in focus: `"Add to focus trifectas"`

**Validation**:
- [ ] Returns text string
- [ ] Matches "Next:" line in focus-trifectas.md
- [ ] Useful for task tracking tables

---

#### Test 1.4: ALEX.MEMORYQUERY
**Input**:
```excel
=ALEX.MEMORYQUERY("What's my current focus?")
```

**Expected Output**:
- `"Currently focused on: React, TypeScript, Testing"`
- Or: `"Working on 3 skills"`

**Test Other Queries**:
```excel
=ALEX.MEMORYQUERY("What's my name?")
→ Should return name from profile.md

=ALEX.MEMORYQUERY("What are my goals?")
→ Should return goals from profile.md
```

**Validation**:
- [ ] Responds to natural language queries
- [ ] Reads from correct memory files
- [ ] Handles unknown queries gracefully

---

### Excel UDF Test Workbook Template

Create workbook with these sheets:

**Sheet 1: Skill Tracker**
| Skill      | Current Level                  | Progress                       | Next Action                  |
| ---------- | ------------------------------ | ------------------------------ | ---------------------------- |
| React      | =ALEX.SKILLLEVEL("React")      | =ALEX.GOALSTATUS("React")      | =ALEX.NEXTSTEP("React")      |
| TypeScript | =ALEX.SKILLLEVEL("TypeScript") | =ALEX.GOALSTATUS("TypeScript") | =ALEX.NEXTSTEP("TypeScript") |
| Testing    | =ALEX.SKILLLEVEL("Testing")    | =ALEX.GOALSTATUS("Testing")    | =ALEX.NEXTSTEP("Testing")    |

**Sheet 2: Memory Queries**
| Query                    | Result                                        |
| ------------------------ | --------------------------------------------- |
| What's my current focus? | =ALEX.MEMORYQUERY("What's my current focus?") |
| What's my name?          | =ALEX.MEMORYQUERY("What's my name?")          |
| What's my role?          | =ALEX.MEMORYQUERY("What's my role?")          |

**Sheet 3: Progress Dashboard**
- Skill progress chart (column chart from Sheet 1)
- Current focus summary (linked to memory query)
- Goal completion gauge

---

## Test 2: Word Template Insertion

### Test 2.1: Research Summary Template

**Steps**:
1. Open Word (new document)
2. Open Alex add-in
3. Click "Research Summary" button (or use action panel)
4. Verify template insertion

**Expected Result**:
```
Research Summary
[Subtitle with date]

Background
[Section content with persona context]

Methodology
[Section content]

Findings
[Section content]

Next Steps
[Section content]
```

**Validation**:
- [ ] Title formatted as Heading 1
- [ ] Subtitle includes date
- [ ] Sections formatted as Heading 2
- [ ] Content includes user name from profile.md
- [ ] Matches persona (mentions role/focus if in profile)

---

### Test 2.2: Meeting Notes Template

**Steps**:
1. Open Word
2. Click "Meeting Notes" button
3. Verify template insertion

**Expected Result**:
```
Meeting Notes - [Date]
Participants: [From calendar/context]

Agenda
-

Discussion Points
-

Action Items
-

Next Steps
-
```

**Validation**:
- [ ] Date auto-filled
- [ ] Participants populated if calendar access available
- [ ] Sections formatted correctly
- [ ] Ready for note-taking

---

### Test 2.3: Article Template

**Steps**:
1. Open Word
2. Click "Article Template" button
3. Verify template insertion

**Expected Result**:
```
[Article Title]
By [Your Name]

Introduction
[Opening paragraph]

Main Content
[Body sections based on focus trifectas]

Conclusion
[Closing thoughts]
```

**Validation**:
- [ ] Author name from profile.md
- [ ] Sections relate to focus trifectas
- [ ] Professional formatting

---

## Test 3: Excel Goal Tracker

### Test 3.1: Create Goals Tracker

**Steps**:
1. Open Excel (new workbook)
2. Open Alex add-in
3. Click "Create Goals Tracker" button
4. Wait for table creation

**Expected Result**:
- Table with columns: Skill | Current Level | Target Level | Progress % | Next Action
- Header row: Bold, Alex blue background (#0078D4), white text
- Data rows populated from focus-trifectas.md
- Progress column formatted as percentage
- Data bar conditional formatting on Progress column
- Auto-fit columns

**Validation**:
- [ ] All data populated correctly
- [ ] Formatting matches specification
- [ ] Progress bars visible and accurate
- [ ] Can manually edit cells

---

### Test 3.2: Create Skill Chart

**Steps**:
1. After creating goals tracker (Test 3.1)
2. Click "Create Skill Chart" button
3. Verify chart creation

**Expected Result**:
- Column chart inserted
- Title: "Skill Development Progress"
- X-axis: Skill names
- Y-axis: Progress %
- Legend at bottom
- Positioned to right of table (column G)
- Size: 300px height × 500px width

**Validation**:
- [ ] Chart displays correctly
- [ ] Data matches table
- [ ] Updates when table data changes
- [ ] Professional appearance

---

## Test 4: PowerPoint Slide Generation

### Test 4.1: Focus Trifecta Slide

**Steps**:
1. Open PowerPoint (new presentation)
2. Open Alex add-in
3. Click "Create Trifecta Slide" button
4. Verify slide creation

**Expected Result**:
```
┌─────────────────────────────────────┐
│ Focus Trifectas                     │  ← Title (36pt, Alex blue)
│                                     │
│ 1. React Development                │  ← Trifecta name (18pt)
│    TypeScript • Testing • CI/CD     │  ← Skills (18pt)
│                                     │
│ 2. [Next Trifecta]                  │
│    [Skills]                         │
└─────────────────────────────────────┘
```

**Validation**:
- [ ] New slide added
- [ ] Title formatted correctly (Alex blue #0078D4)
- [ ] Trifectas listed from focus-trifectas.md
- [ ] Skills formatted with bullets
- [ ] Positioning consistent

---

## Test 5: Outlook Email Drafting

### Test 5.1: Draft Response Email

**Steps**:
1. Open Outlook
2. Reply to an email OR compose new
3. Open Alex add-in
4. Click "Draft Email" → Select "Response"
5. Verify email content inserted

**Expected Result**:
- Professional greeting with recipient name (if available)
- Response content based on email context
- Signature with your name from profile.md
- Professional tone

**Validation**:
- [ ] HTML formatted correctly
- [ ] Personalized with your name
- [ ] Professional and contextual
- [ ] Can be edited before sending

---

### Test 5.2: Smart Replies

**Steps**:
1. In Outlook, open an email
2. Click "Smart Replies" button
3. Review 3 generated reply options
4. Select one and click "Insert"

**Expected Result**:
- 3 reply options displayed:
  - Professional tone
  - Casual tone
  - Brief tone
- Each option matches email context
- Personalized with your profile data

**Validation**:
- [ ] All 3 options generated
- [ ] Tone differences clear
- [ ] Selected reply inserts correctly
- [ ] Can select different option

---

### Test 5.3: Urgent Marker

**Steps**:
1. Compose new email
2. Click "Urgent Marker" → Select "URGENT"
3. Verify marker insertion

**Expected Result**:
```html
⚠️ URGENT — Immediate attention required
[Red text, bold]
```

**Alternate Tests**:
- CRITICAL: 🚨 CRITICAL — System impact, respond ASAP
- NORMAL: 📌 Action Required

**Validation**:
- [ ] Marker inserts at cursor position
- [ ] HTML formatting correct
- [ ] Color and icon appropriate
- [ ] Stands out visually

---

## Test 6: Chat Interface

### Test 6.1: Initialize Chat

**Steps**:
1. Open any Office app
2. Open Alex add-in
3. Click "Chat" tab (if available)
4. Verify chat interface loads

**Expected Result**:
- Chat messages container (scrollable)
- Text input field at bottom
- Send button
- Welcome message from Alex
- Memory context loaded (name, focus)

**Validation**:
- [ ] UI renders correctly
- [ ] Welcome message personalized
- [ ] Input field accepts text
- [ ] Send button clickable

---

### Test 6.2: Send Message

**Steps**:
1. Type message: "What's my current focus?"
2. Press Enter or click Send
3. Wait for response

**Expected Result**:
- User message appears immediately
- Typing indicator shows (animated dots)
- Response appears after ~1.5 seconds
- Message includes focus trifectas from memory

**Test Other Messages**:
- "Help me prep for a meeting"
- "Draft an email"
- "What are my goals?"

**Validation**:
- [ ] Messages display in conversation format
- [ ] User messages aligned right
- [ ] Alex messages aligned left
- [ ] Timestamps shown
- [ ] Chat scrolls to bottom automatically

---

### Test 6.3: Chat History Persistence

**Steps**:
1. Send 3-4 messages
2. Close task pane
3. Reopen task pane
4. Switch to Chat tab

**Expected Result**:
- Previous messages still visible
- Conversation continues from last message
- No duplicates

**Validation**:
- [ ] History persists across sessions
- [ ] localStorage used correctly
- [ ] Can clear history with button

---

##Test 7: Collaboration Awareness

### Test 7.1: Presence Indicators

**Prerequisites**: Share document with another user

**Steps**:
1. Share Excel/Word document with colleague
2. Have colleague open document
3. Open Alex add-in
4. Open "Contributors" panel (if visible)

**Expected Result**:
- List of active collaborators
- Presence icons: 🟢 Available, 🔴 Busy, 🟡 Away, ⚫ Offline
- User names and status

**Validation**:
- [ ] Collaborators list populates
- [ ] Presence accurate (check Teams status)
- [ ] Updates every 30 seconds
- [ ] No duplicates

---

### Test 7.2: Document Change Notifications

**Prerequisites**: Excel workbook shared with colleague

**Steps**:
1. Have colleague edit a cell in shared workbook
2. Observe Alex task pane

**Expected Result** (if implemented):
- Notification: "John edited B5"
- Live indication of active areas
- Recent changes list

**Note**: Office.js has limited real-time collaboration APIs. This feature may show console logs instead of UI notifications.

**Validation**:
- [ ] Console logs show change events
- [ ] User identity correct
- [ ] Cell address accurate

---

## Test 8: Integration Testing

### Test 8.1: Excel UDF + Chat

**Steps**:
1. Create Excel tracker with UDFs
2. Open Chat
3. Ask: "What's my React skill level?"
4. Compare chat response to formula result

**Validation**:
- [ ] Both sources agree
- [ ] Data comes from same memory file

---

### Test 8.2: Word Template + Email Draft

**Steps**:
1. Create meeting notes in Word
2. Switch to Outlook
3. Draft follow-up email
4. Verify consistency in content

**Validation**:
- [ ] Same participants mentioned
- [ ] Action items consistent
- [ ] Professional tone maintained

---

## Bug Reporting Template

If you encounter issues, report with this format:

```markdown
**Bug**: [Brief description]
**Host**: Word / Excel / PowerPoint / Outlook
**Steps to Reproduce**:
1.
2.
3.

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Error Messages**: [Console logs, error dialogs]
**Memory Status**: Loaded / Missing / Error
**Screenshot**: [If applicable]
```

---

## Success Criteria

Phase 3 testing complete when:

- [ ] All 4 Excel UDFs work correctly
- [ ] All 3 Word templates insert properly
- [ ] Excel goal tracker creates and formats correctly
- [ ] PowerPoint trifecta slide generates
- [ ] All 3 Outlook email features work
- [ ] Chat interface functional (basic responses)
- [ ] Collaboration panel shows presence
- [ ] No critical bugs found
- [ ] User experience smooth and intuitive

---

## Next Steps After Testing

1. **Document bugs** → Create GitHub issues
2. **Fix critical bugs** → Prioritize showstoppers
3. **Update documentation** → Reflect actual behavior
4. **User feedback** → Share with beta testers
5. **Release v5.9.0** → Deploy to production

---

**Happy Testing!** 🚀
