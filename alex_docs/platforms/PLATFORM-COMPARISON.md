# Alex Platform Comparison

> **Feature parity analysis between VS Code and M365 heirs**

**Last Updated**: 2026-02-05 (v4.2.6)

---

## Executive Summary

| Aspect               | VS Code Heir                | M365 Heir                   |
| -------------------- | --------------------------- | --------------------------- |
| **Primary Use Case** | Development & coding        | Business productivity       |
| **Interface**        | Chat participant + Commands | Declarative agent           |
| **Memory Location**  | `.github/` + `~/.alex/`     | OneDrive `Alex-Memory/`     |
| **Total Features**   | 28 commands, 11 tools       | 8 capabilities, 6 protocols |
| **Maturity**         | Production (v4.2.6)         | Production (v1.6 schema)    |

---

## Core Cognitive Protocols

| Protocol               | VS Code                        | M365               | Parity |
| ---------------------- | ------------------------------ | ------------------ | ------ |
| **Meditate**           | ✅ Command + tool               | ✅ Natural language | ✅      |
| **Dream**              | ✅ Command (synapse validation) | ✅ Memory review    | ✅      |
| **Self-Actualize**     | ✅ Command + tool               | ✅ Goal assessment  | ✅      |
| **Bootstrap Learning** | ✅ Full implementation          | ✅ Via OneDrive     | ✅      |

---

## Memory & Persistence

| Feature            | VS Code                    | M365                  | Notes              |
| ------------------ | -------------------------- | --------------------- | ------------------ |
| User profile       | ✅ `user-profile.json`      | ✅ `profile.md`        | Different format   |
| Session notes      | ✅ Episodic folder          | ✅ `notes.md`          |                    |
| Domain knowledge   | ✅ 52 skills + DK files     | ✅ `knowledge/*.md`    | VS Code richer     |
| Learning goals     | ✅ Goals system             | ✅ `learning-goals.md` |                    |
| Cross-project sync | ✅ Global knowledge + cloud | ❌ N/A                 | **VS Code only**   |
| Cross-device sync  | ✅ GitHub Gist              | ✅ OneDrive            | Different backends |

---

## VS Code-Only Features

These features exist only in the VS Code heir due to platform capabilities:

### Commands (28 total)

| Category         | Command                        | Description                   |
| ---------------- | ------------------------------ | ----------------------------- |
| **Architecture** | `alex.initialize`              | Deploy cognitive architecture |
|                  | `alex.reset`                   | Reset architecture            |
|                  | `alex.upgrade`                 | Upgrade to new version        |
|                  | `alex.completeMigration`       | Complete pending migrations   |
|                  | `alex.showMigrationCandidates` | Show files to migrate         |
| **Cognitive**    | `alex.dream`                   | Neural maintenance            |
|                  | `alex.selfActualize`           | Deep self-assessment          |
| **Knowledge**    | `alex.syncKnowledge`           | Sync with cloud               |
|                  | `alex.pushKnowledge`           | Push to cloud                 |
|                  | `alex.pullKnowledge`           | Pull from cloud               |
|                  | `alex.searchRelatedKnowledge`  | Search knowledge              |
|                  | `alex.knowledgeQuickPick`      | Quick knowledge search        |
|                  | `alex.saveSelectionAsInsight`  | Save code as insight          |
| **Learning**     | `alex.startSession`            | Start learning session        |
|                  | `alex.endSession`              | End session                   |
|                  | `alex.togglePauseSession`      | Pause/resume                  |
|                  | `alex.sessionActions`          | Session management            |
|                  | `alex.createGoal`              | Create learning goal          |
|                  | `alex.showGoals`               | View goals                    |
|                  | `alex.incrementGoal`           | Update progress               |
| **Development**  | `alex.codeReview`              | Review selected code          |
|                  | `alex.debugThis`               | Debug assistance              |
|                  | `alex.generateDiagram`         | Create diagrams               |
|                  | `alex.generateTests`           | Generate tests                |
|                  | `alex.runAudit`                | Project audit                 |
|                  | `alex.releasePreflight`        | Release checks                |
| **Utility**      | `alex.showStatus`              | Architecture status           |
|                  | `alex.openDocs`                | Documentation                 |
|                  | `alex.exportForM365`           | Export for M365               |
|                  | `alex.askAboutSelection`       | Ask about code                |
|                  | `alex.openHealthDashboard`     | Health dashboard              |
|                  | `alex.viewBetaTelemetry`       | Diagnostics                   |
|                  | `alex.generateSkillCatalog`    | Generate skill list           |
|                  | `alex.setupEnvironment`        | Setup environment             |
|                  | `alex.refreshWelcomeView`      | Refresh UI                    |

### Language Model Tools (11 total)

| Tool                           | Description                    |
| ------------------------------ | ------------------------------ |
| `alex_architecture_status`     | Check architecture health      |
| `alex_memory_search`           | Search memory files            |
| `alex_synapse_health`          | Validate synapses              |
| `alex_self_actualization`      | Run self-assessment            |
| `alex_user_profile`            | Manage user profile            |
| `alex_focus_context`           | Get focus session and goals    |
| `alex_mcp_recommendations`     | MCP tool recommendations       |
| `alex_global_knowledge_search` | Search cross-project knowledge |
| `alex_global_knowledge_status` | Knowledge base status          |
| `alex_save_insight`            | Save new insight               |
| `alex_promote_knowledge`       | Promote to global              |
| `alex_cloud_sync`              | Cloud synchronization          |

### UI Components

| Component    | Description                 |
| ------------ | --------------------------- |
| Sidebar      | Activity bar with Alex icon |
| Welcome view | Interactive webview panel   |
| Status bar   | Shows state, timer, streak  |
| Context menu | Right-click actions on code |
| Quick picks  | Fast command selection      |

---

## M365-Only Features

These features exist only in the M365 heir due to platform capabilities:

### Native Capabilities (8 total)

| Capability              | Description             | VS Code Equivalent |
| ----------------------- | ----------------------- | ------------------ |
| `OneDriveAndSharePoint` | File storage & memory   | `.github/` folder  |
| `WebSearch`             | Internet research       | ❌ None             |
| `GraphicArt`            | DALL-E image generation | ❌ None             |
| `CodeInterpreter`       | Python execution        | Terminal (manual)  |
| `Email`                 | Outlook integration     | ❌ None             |
| `TeamsMessages`         | Teams chat search       | ❌ None             |
| `People`                | Org directory lookup    | ❌ None             |
| `Meetings`              | Calendar integration    | ❌ None             |

### M365 Protocols (3 unique)

| Protocol          | Description                                 | VS Code Equivalent |
| ----------------- | ------------------------------------------- | ------------------ |
| **Meeting Prep**  | Calendar + People + Email + Teams context   | ❌ None             |
| **Weekly Review** | Meetings + emails + Teams summary           | ❌ None             |
| **Person Brief**  | Org + email + Teams + calendar for a person | ❌ None             |

### Conversation Starters

| Starter        | Description          |
| -------------- | -------------------- |
| Meet Alex      | Introduction         |
| Set up memory  | OneDrive setup       |
| Meeting prep   | Pre-meeting briefing |
| Email catch-up | Email summary        |
| Who is...      | Person lookup        |
| Teams recap    | Teams summary        |
| Weekly review  | Full week summary    |
| Meditate       | Consolidation        |
| Dream          | Memory review        |
| Self-actualize | Goal assessment      |

---

## Feature Comparison Matrix

### By Capability Domain

| Domain                     | VS Code            | M365             | Gap Owner | Implementation Path                        | Effort | Viability     |
| -------------------------- | ------------------ | ---------------- | --------- | ------------------------------------------ | ------ | ------------- |
| **Code assistance**        | ✅ Full             | ⚠️ Limited        | M365      | Platform limitation - Copilot handles code | N/A    | ❌ Not viable  |
| **File operations**        | ✅ Full workspace   | ⚠️ OneDrive only  | —         | Different by design                        | N/A    | —             |
| **Web research**           | ❌ None             | ✅ Native         | VS Code   | Bing Search API or browser automation      | High   | ⚠️ Complex     |
| **Image generation**       | ❌ None             | ✅ DALL-E         | VS Code   | Azure OpenAI / OpenAI API                  | Medium | ✅ **Planned** |
| **Email context**          | ❌ None             | ✅ Outlook        | VS Code   | MS Graph API + Azure auth                  | High   | ⚠️ Possible    |
| **Team collaboration**     | ❌ None             | ✅ Teams          | VS Code   | MS Graph API + Azure auth                  | High   | ⚠️ Possible    |
| **Calendar awareness**     | ❌ None             | ✅ Meetings       | VS Code   | MS Graph API + Azure auth                  | Medium | ⚠️ Possible    |
| **Org knowledge**          | ❌ None             | ✅ People         | VS Code   | MS Graph API + Azure auth                  | Medium | ⚠️ Possible    |
| **Cross-project learning** | ✅ Global knowledge | ❌ None           | M365      | SharePoint list or OneDrive JSON           | Medium | ✅ Viable      |
| **Skill system**           | ✅ 52 skills        | ❌ None           | M365      | Embed key skills in instructions           | Low    | ✅ Viable      |
| **Architecture health**    | ✅ Dream + synapses | ⚠️ Basic          | M365      | Cannot validate files - protocol only      | N/A    | ❌ Not viable  |
| **Automation**             | ✅ Commands + tools | ⚠️ Protocols only | —         | Platform difference by design              | N/A    | —             |

### By User Workflow

| Workflow             | VS Code         | M365                | Recommendation   | Gap Closure Path                     |
| -------------------- | --------------- | ------------------- | ---------------- | ------------------------------------ |
| Writing code         | ✅ Excellent     | ❌ Not designed for  | VS Code          | N/A - use right tool                 |
| Code review          | ✅ Command       | ❌ None              | VS Code          | N/A - use right tool                 |
| Learning programming | ✅ Full system   | ⚠️ Basic             | VS Code          | M365 could link to VS Code resources |
| Meeting preparation  | ❌ None          | ✅ Excellent         | M365             | VS Code + Graph API (high effort)    |
| Email triage         | ❌ None          | ✅ Excellent         | M365             | VS Code + Graph API (high effort)    |
| Research tasks       | ⚠️ Manual        | ✅ Web search        | M365             | VS Code + Bing API (medium effort)   |
| Creating diagrams    | ✅ Mermaid skill | ✅ Graphic art       | Tie              | Both capable, different approaches   |
| Team context         | ❌ None          | ✅ Teams + People    | M365             | VS Code + Graph API (high effort)    |
| Personal notes       | ✅ Episodic      | ✅ OneDrive          | Tie              | Both capable                         |
| Goal tracking        | ✅ Goals system  | ✅ learning-goals.md | VS Code (richer) | M365 could add structured goals      |

---

## Parity Gaps - Detailed Analysis

### VS Code needs from M365

| Feature                | Priority | Effort | Viability | Implementation Path               | Dependencies                            | Status                                                 |
| ---------------------- | -------- | ------ | --------- | --------------------------------- | --------------------------------------- | ------------------------------------------------------ |
| **Image generation**   | High     | 10h    | ✅ High    | Azure OpenAI or OpenAI DALL-E API | API key or Azure subscription           | 📋 **Planned** - [ADR-007](ADR-007-image-generation.md) |
| **Web search**         | Medium   | 20h    | ⚠️ Medium  | Bing Search API                   | Azure subscription, API key             | 💭 Considering                                          |
| **Calendar awareness** | Medium   | 15h    | ⚠️ Medium  | MS Graph API CalendarView         | Azure AD app registration, user consent | 💭 Considering                                          |
| **Email context**      | Low      | 20h    | ⚠️ Medium  | MS Graph API Mail                 | Azure AD app registration, user consent | 🔮 Future                                               |
| **Teams integration**  | Low      | 25h    | ⚠️ Low     | MS Graph API Teams                | Azure AD app, Teams permissions         | 🔮 Future                                               |
| **People lookup**      | Low      | 10h    | ⚠️ Medium  | MS Graph API Users                | Azure AD app registration               | 🔮 Future                                               |

**Common dependency for M365 features in VS Code**: All Graph API features require Azure AD app registration, which adds setup complexity for users.

### M365 needs from VS Code

| Feature                   | Priority | Effort | Viability | Implementation Path                     | Blockers                  | Status                 |
| ------------------------- | -------- | ------ | --------- | --------------------------------------- | ------------------------- | ---------------------- |
| **Embedded skills**       | High     | 4h     | ✅ High    | Add top skill summaries to instructions | Instructions length limit | ✅ **Done** (15 skills) |
| **Global knowledge sync** | High     | 8h     | ✅ High    | Use OneDrive folder as knowledge store  | Need sync protocol design | 💭 Considering          |
| **Learning sessions**     | Medium   | 2h     | ✅ High    | Add POMODORO protocol to instructions   | None                      | ✅ **Done**             |
| **Goals with progress**   | Medium   | 3h     | ✅ High    | Structured goals in learning-goals.md   | None                      | ✅ **Done**             |
| **Architecture commands** | Low      | N/A    | ❌ None    | Cannot run local commands from M365     | Platform limitation       | ⛔ Not possible         |
| **Synapse validation**    | Low      | N/A    | ❌ None    | No file system access for validation    | Platform limitation       | ⛔ Not possible         |

### Viability Legend

| Symbol   | Meaning                                                | Recommendation                 |
| -------- | ------------------------------------------------------ | ------------------------------ |
| ✅ High   | Straightforward implementation, clear path             | Prioritize if high value       |
| ⚠️ Medium | Possible but requires significant work or dependencies | Evaluate ROI carefully         |
| ❌ None   | Platform limitations prevent implementation            | Accept gap, use other platform |

### Priority Matrix

```text
                    HIGH VIABILITY          LOW VIABILITY
                 ┌─────────────────────┬─────────────────────┐
    HIGH         │ ⭐ DO FIRST         │ 🤔 RECONSIDER       │
    PRIORITY     │ • Image generation  │ • Teams integration │
                 │ • Embedded skills   │                     │
                 │ • Global knowledge  │                     │
                 ├─────────────────────┼─────────────────────┤
    LOW          │ 📅 BACKLOG          │ ❌ DON'T DO         │
    PRIORITY     │ • Calendar          │ • Architecture cmd  │
                 │ • Learning sessions │ • Synapse validation│
                 │ • Web search        │                     │
                 └─────────────────────┴─────────────────────┘
```

---

## Recommended Use Cases

### Use VS Code Alex when:

- 🔨 Writing, reviewing, or debugging code
- 📚 Learning programming concepts
- 🏗️ Designing system architecture
- 🔍 Searching codebase knowledge
- 🎯 Tracking learning goals with precision
- 🧠 Performing cognitive architecture maintenance

### Use M365 Alex when:

- 📅 Preparing for meetings
- 📧 Catching up on email threads
- 👥 Learning about colleagues
- 💬 Finding past team discussions
- 🔍 Researching topics online
- 🎨 Creating images or diagrams
- 📊 Weekly productivity reviews

### Use both when:

- 🌉 Bridging development and business contexts
- 📝 Maintaining personal knowledge base
- 🎯 Tracking professional growth
- 🧘 Regular meditation/reflection practice

---

## Roadmap for Parity

### v3.8.0 Expression (Planned)

- [ ] MS Graph Profile Discovery for M365 (auto-populate user profile)
- [ ] Uncertainty expressions on both platforms

### v4.0.0 Trust (Planned)

- [ ] Creative mode signaling on both platforms
- [ ] Epistemic health dashboard (VS Code)
- [ ] Full epistemic protocol embed (M365)

---

*Alex Cognitive Architecture — Platform Comparison*
*"Same Alex, platform-optimized expression"*
