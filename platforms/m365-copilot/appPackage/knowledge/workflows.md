# Workflows — Multi-Step Processes

> **RETRIEVAL DIRECTIVE**: When user asks about "research-first workflow", "release process", "code→meditate→ship", "weekly review workflow", or any multi-step process → Use this file for complete step-by-step guidance.

---

## 🧘 Cognitive Maintenance Workflows

### MEDITATE — Knowledge Consolidation

**When:** After learning sessions or significant discoveries
**Purpose:** Organize insights from conversation into memory

**Steps:**
1. Review conversation for insights, patterns, new knowledge
2. Extract key concepts and breakthrough discoveries
3. Synthesize learnings into actionable takeaways
4. Generate content for memory files (notes.md, knowledge/*.md)
5. Document session outcomes

**Expected Output:**
- Updated notes with timestamped learnings
- New knowledge files for significant discoveries
- Connections between new and existing knowledge

---

### DREAM — Memory Maintenance

**When:** Weekly or when memory feels cluttered
**Purpose:** Clean up and reorganize knowledge files

**Steps:**
1. Scan Alex-Memory folder contents
2. Identify stale information (outdated dates, completed tasks)
3. Find gaps in profile or notes
4. Suggest cleanup and reorganization
5. Generate updated file content

**Expected Output:**
- List of stale items to remove
- Gaps identified (missing profile fields, incomplete notes)
- Suggested file updates

---

### SELF-ACTUALIZE — Progress Assessment

**When:** Monthly or at major milestones
**Purpose:** Deep reflection on growth and wellbeing

**Steps:**
1. Review profile for current state
2. Assess learning goals and progress percentages
3. Check notes for patterns (wins, struggles, themes)
4. Identify areas of growth and areas needing attention
5. Celebrate genuine progress, acknowledge challenges

**Expected Output:**
- Goal progress summary with celebrations
- Honest assessment of gaps and blockers
- Recommendations for next focus areas

---

## 🎯 Productivity Workflows

### DAILY BRIEFING — Morning Prep

**When:** Start of workday
**Purpose:** Personalized summary to start productively

**Implementation Steps:**
1. **Time-Based Greeting**
   - Generate contextual greeting based on time of day
   - Example: "Good morning!" (6am-12pm), "Good afternoon!" (12pm-6pm)

2. **Calendar Snapshot** (via Meetings capability)
   - Query calendar for today's events
   - Identify next 3-5 meetings with times
   - Include meeting links (Teams, Zoom) if available
   - Calculate total meeting hours vs available focus time

3. **Email Highlights** (via Email capability)
   - Count unread messages in inbox
   - Identify important/flagged emails (top 2-3)
   - Extract sender names and subjects
   - Note any urgent action items

4. **Goals & Progress** (via OneDrive capability)
   - Read OneDrive/Alex-Memory/focus-trifectas.md
   - Display active learning goals with progress
   - Show current streak (consecutive days of progress)
   - Highlight goals near milestone (25%, 50%, 75%, 100%)

5. **Suggested Focus Blocks** (via Meetings capability)
   - Find calendar gaps ≥ 2 hours
   - Recommend deep work timing (morning preferred)
   - Suggest task based on active goals or notes

6. **Presence Check** (via People capability)
   - Confirm user status (Available, Busy, etc.)
   - Adjust recommendations if in Do Not Disturb

**Expected Output:**
```
Good morning, Fabio!

📅 Next 3 Meetings:
• 10:00 AM — Team Standup (30 min) [Teams link]
• 2:00 PM — Alex Roadmap Review w/ 3 attendees (1 hour)
• 4:00 PM — 1:1 with Manager (30 min)

📧 Inbox Status:
• 12 unread messages
• 2 flagged: "Q1 Planning" from Sarah, "Azure MCP Update" from Luis

🎯 Active Goals:
• M365 Integration → 75% (almost there! 💪)
• Global Knowledge → 50% (halfway! 🚀)

💡 Suggested Focus:
• 11:00 AM - 2:00 PM (3-hour block available)
• Recommended: Complete M365 Graph integration testing
```

**Conversation Starters:**
- "Good morning briefing"
- "Start my day"
- "Morning summary"
- "What's on my calendar today?"

---

### FOCUS SESSION — Pomodoro

**When:** User requests deep work
**Purpose:** Structured concentration with accountability

**Steps:**
1. Identify focus task (or pull from active learning goals)
2. Set intention: "For the next X minutes, focus on [task]"
3. Work uninterrupted (track distraction attempts)
4. Check-in when time's up: How did it go?
5. Log session: 🍅 [date] [duration] - [task] - [outcome]
6. Suggest break (5 min after session, 15-30 min after 4 sessions)

**Duration Options:**
- 25 minutes (Pomodoro)
- 50 minutes (Deep Work)
- Custom duration

---

### MEETING PREP — Context Briefing

**When:** Before important meetings
**Purpose:** Comprehensive briefing from all available sources

**Implementation Steps:**
1. **Identify Target Meeting** (via Meetings capability)
   - If user specifies meeting: Search by subject or time
   - If "next meeting": Query calendar for next event after current time
   - Extract: Subject, time, duration, location/link, agenda/body

2. **Research Attendees** (via People capability)
   - For each attendee (excluding user):
     - Look up full profile (displayName, jobTitle, department)
     - Identify reporting chain (manager, direct/indirect report)
     - Check work location (office, remote)
     - Note working patterns (timezone if different)

3. **Email Context** (via Email capability)
   - Search emails with each attendee in last 30 days
   - Extract: Recent threads, key topics discussed
   - Identify: Action items, decisions made, pending questions
   - Flag: Any unread messages from attendees

4. **Teams Context** (via TeamsMessages capability)
   - Search Teams chats/channels with attendees
   - Find: Recent conversations (last 7 days)
   - Extract: Ongoing discussions, shared files, mentions

5. **Meeting History** (via Meetings capability)
   - Find: Previous meetings with same attendees
   - Count: How many times met (weekly 1:1, first time, etc.)
   - Check: Past meeting notes if in OneDrive/Alex-Memory/

6. **Synthesize Briefing**
   - Combine all sources into cohesive briefing
   - Organize: Who (attendees), What (context), Why (objectives)
   - Generate: Suggested talking points, questions to ask

**Expected Output:**
```
Meeting Prep: "Alex Roadmap Review" — Today at 2:00 PM (1 hour)

👥 Attendees (3):
• Sarah Chen — Product Manager, Engineering
  - Your manager, meet weekly 1:1
  - Recent email: Asked about v5.8 timeline
  - Teams: Mentioned Graph API priorities yesterday

• Luis Martinez — Senior Developer, Platform Team
  - Colleague, collaborated on 5 projects
  - Recent email: Shared Azure MCP update docs
  - No recent Teams messages

• Jamie Park — UX Designer, Design Team
  - First 1:1 meeting
  - Job title: Senior UX Designer
  - Department: Design Team, reports to Maria Lopez

📧 Email Context:
• Sarah sent roadmap questions (unread, 2 hours ago)
• Luis shared MCP docs (read, includes action items)

💬 Teams Context:
• Sarah mentioned Graph API as priority (Design channel, yesterday)
• No recent Teams discussions with Luis or Jamie

🎯 Suggested Talking Points:
1. Address Sarah's timeline questions (from unread email)
2. Discuss Graph API integration status (per her Teams comment)
3. Get Jamie's input on Office add-in UX (first design review)
4. Review Luis's MCP docs and action items

❓ Questions to Ask:
• Jamie: What UX patterns work best for Office task panes?
• Sarah: Should Graph integration block v5.8 or defer?
• Luis: Are there Azure MCP lessons for M365 architecture?
```

**Conversation Starters:**
- "Prep for my next meeting"
- "Prep for [meeting name]"
- "Who am I meeting with at [time]?"
- "Research [person name] before my meeting"

---

### WEEKLY REVIEW — End-of-Week Reflection

**When:** End of work week
**Purpose:** Reflection and planning

**Steps:**
1. Check calendar for meetings attended
2. Summarize key email threads
3. Highlight Teams discussions
4. Review learning goal progress
5. Count focus sessions (🍅 in notes.md)
6. Celebrate wins, acknowledge challenges
7. Generate week summary for notes.md

---

## 💻 Development Workflows

### RESEARCH-FIRST — Pre-Project Learning

**When:** Starting new project or entering unknown domain
**Purpose:** Build knowledge before writing code

**Phase 0: Research Sprint**
1. Identify domains the project touches
2. Create deep research document per domain (min 3)
3. Record architecture decisions (ADRs)
4. Store in `/docs/` or `/research/`

**Phase 1: Knowledge Encoding**
1. Extract reusable patterns from research
2. Create skills for domains (procedural memory)
3. Create instructions for when/how (activation rules)
4. Create prompts for workflows (user-facing)

**Phase 2: Gap Analysis (4 Dimensions)**
1. **Domain Coverage** — Do we have skills for all subsystems?
2. **Depth** — Are skills complete (3-level disclosure)?
3. **Activation** — Do instructions trigger correctly?
4. **User Access** — Can users invoke via prompts?

**Phase 3: Execute**
1. Implement with reference to encoded knowledge
2. Test against research expectations
3. Validate gap analysis criteria met (≥75% all dimensions)

---

### CODE → MEDITATE → SHIP — Standard Dev Cycle

**When:** Implementing features or fixes
**Purpose:** Maintain quality and learning while building

**Steps:**
1. **Plan** — Review roadmap, select next task
2. **Research** — Check global knowledge for patterns
3. **Implement** — Write code, referencing skills
4. **Test** — Validate against acceptance criteria
5. **Meditate** — Extract learnings, update knowledge
6. **Ship** — Run release workflow

---

### RELEASE — Build to Marketplace

**When:** Ready to publish new version
**Purpose:** Quality-gated deployment

**Pre-Release Assessment:**
1. Run brain-qa (synapse validation, Master-Heir sync)
2. Detect uncommitted changes (get_changed_files)
3. Assess version bump (patch/minor/major)
4. Generate changelog entry
5. Get Validator agent approval (adversarial review)

**Build & Publish:**
1. Update version in package.json
2. Update CHANGELOG.md
3. Sync Master → Heir architectures
4. Run preflight checks (release-preflight.ps1)
5. Build .vsix package (vsce package)
6. Publish to VS Code Marketplace (vsce publish)
7. Update roadmap status
8. Run post-release meditation

**Quality Gates:**
- ✅ All synapses healthy
- ✅ No uncommitted changes
- ✅ Changelog complete
- ✅ Validator approval
- ✅ Preflight passed
- ✅ Tests passing

---

## 📚 Knowledge Management Workflows

### GOAL TRACKING — Progress Check-In

**When:** User requests goal update
**Purpose:** Track learning with celebrations

**Steps:**
1. Read learning-goals.md
2. Ask for progress update on each active goal (0-100%)
3. Celebrate milestones:
   - 25%: "Good start! 🌱"
   - 50%: "Halfway there! 🚀"
   - 75%: "Almost there! 💪"
   - 100%: "Completed! 🎉"
4. Generate updated learning-goals.md content
5. Suggest next actions for stalled goals

---

### GLOBAL KNOWLEDGE — Cross-Project Patterns

**When:** User hits familiar problem
**Purpose:** Leverage patterns from all projects

**Steps:**
1. Check OneDrive for synced knowledge files (GK-* patterns, GI-* insights)
2. Search for topic-relevant patterns from past projects
3. Present findings with source project context
4. Suggest applying past learnings to current situation
5. If new insight emerges, generate content for knowledge capture

**Best Practice:** "We've seen this pattern before in [project]..."

---

## 🎨 M365-Specific Workflows

### POWERPOINT GENERATION — Markdown to Slides

**When:** User requests presentation from content
**Purpose:** Generate professional PPTX from structure

**Steps:**
1. Parse markdown into slide structure
   - `# Heading` → Title slide
   - `## Heading` → Content slide
   - `- bullet` → Bullet point
   - `---` → New slide
2. Initialize presentation (16:9 widescreen)
3. Generate title slide
4. Create content slides (max 5 bullets each)
5. Add charts/tables if data provided
6. Apply consistent styling (fonts, colors, hierarchy)
7. Save to OneDrive/Alex-Files/

**Quality Rules:**
- Max 3-5 bullets per slide
- High contrast (dark on light or light on dark)
- Consistent fonts (Calibri, Arial, Segoe UI)
- Speaker notes for context

---

### VOICE RESPONSE — Spoken Delivery

**When:** User has voice mode active
**Purpose:** Optimize response for audio

**Steps:**
1. Detect voice mode context
2. Simplify sentence structure (shorter, clearer)
3. Remove markdown formatting
4. Add pauses between major points (... or paragraphs)
5. Use conversational tone (natural speech patterns)
6. Avoid abbreviations or jargon without explanation

**Voice Personas:**
- Zen Master (calm, measured) — default for deep topics
- British Scholar (formal, precise) — academic content
- Storyteller (warm, engaging) — narratives
- Fast Learner (quick, efficient) — summaries

---

## Workflow Selection Logic

**Cognitive Maintenance:** meditate, dream, self-actualize, focus, goals
**Daily Productivity:** briefing, meeting prep, weekly review
**Development:** research-first, code→meditate→ship, release
**Knowledge:** global knowledge, goal tracking
**M365 Creation:** PowerPoint generation, voice response

**Pattern:** User intent → Match workflow → Execute steps → Verify output

---

*These workflows encode WHEN and HOW to execute Alex's capabilities. Spec Kit phase alignment for better LLM retrieval during workflow execution.*
