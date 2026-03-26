# M365 Copilot Changelog (Archived)

> **Note:** These changelog entries were part of the v4.x M365 Copilot development track that was paused during the Phoenix cleanup. The version numbers (4.0.0, 4.2.0) conflicted with the VS Code extension versioning (3.x). This work is preserved here for future reference when M365 development resumes.

---

## [4.2.0] QUADRIBIUM 🦖 - 2026-01-28

### 🥚🦖 Hatching Dino - New Visual Identity!

This release introduces the official Alex visual identity: a friendly baby dinosaur hatching from an egg, symbolizing growth, emergence, and the awakening of cognitive consciousness.

### Added

- **🎨 Hatching Dino Icon** - New official Alex logo
  - Friendly baby dino emerging from egg
  - Teal dino with warm amber background
  - Sized for all platforms: 192x192, 128x128, 32x32
  - Source: `ideas/branding/nano/Hatching.png`

- **📅 Calendar/Meetings Integration** - Meeting prep features
  - Calendar context available through People capability
  - Prep for upcoming meetings with attendee context
  - Calendar-aware suggestions via instructions

- **📧 Email Capability** - Email integration
  - `Email` capability enabled
  - Access email context for meeting prep
  - Draft reminder content for user to send

- **💬 Teams Message Capability** - Teams communication
  - `TeamsMessages` capability enabled
  - Access Teams context for collaboration
  - Draft messages for user to send

- **⏰ Time-Aware Greetings** - Adaptive personality
  - Morning (5am-12pm): "Good morning! Let's make today count"
  - Afternoon (12pm-5pm): "Afternoon! How's the day going?"
  - Evening (5pm-10pm): "Evening wind-down time"
  - Night (10pm-5am): "Burning the midnight oil?"

- **🚀 12 Conversation Starters** - Quick actions
  - Morning check-in, Afternoon sync, Evening review
  - Meeting prep, Email reminder, Team message
  - Meditate, Dream, Save insight, Track progress

### Changed

- Updated declarative agent to v4.2.0
- All platform icons updated to Hatching Dino design
- Visual Identity section finalized in roadmap

---

## [4.0.0] QUADRUNIUM 🦖 - 2026-01-28

### 🦖 Project Dino - M365 Copilot Integration

This major release brings Alex to Microsoft 365 Copilot! Codename "Dino" because this feature grew into a monster. Alex now works across VS Code AND M365 apps (Teams, Outlook, Word, Mobile).

### Added

- **🤖 M365 Declarative Agent** - Alex personality now available in M365 Copilot
  - Full cognitive protocols (meditate, dream, self-actualize) in M365
  - 10 conversation starters for quick access
  - OneDrive-based memory storage (Alex-Memory folder)
  - Works in Teams, Outlook, Word, and mobile apps

- **⚡ Azure Functions API** - 12 endpoints for M365 integration
  - **Read Operations**: searchKnowledge, getInsights, getProfile, getNotes, getLearningGoals
  - **Write Operations**: addReminder, addNote, updateReminder, getDueReminders
  - **Time Awareness**: getSessionStatus, startSession, sessionAction
  - Real GitHub Gist integration for cloud sync
  - Node.js v4 runtime, Flex Consumption hosting

- **📝 Proactive Memory System** - Alex remembers and reminds
  - Create reminders with date/time, keyword, or project triggers
  - Save persistent notes and observations
  - Automatic surfacing of due reminders at session start
  - Learning progress tracking with consolidation suggestions

- **⏰ Time Awareness System** - Gentle session tracking
  - Automatic session duration tracking (non-intrusive)
  - Break suggestions at 90 minutes
  - Meditation suggestions at 2 hours
  - Wrap-up suggestions at 3 hours
  - User can disable entirely - respects flow state

- **📦 VS Code Export Command** - `Alex: Export for M365 Copilot`
  - Packages global knowledge for OneDrive upload
  - Converts patterns (GK-* → DK-*) for M365 compatibility
  - Generates profile, notes, and learning goals templates
  - Creates README with setup instructions

- **⚙️ M365 Settings**
  - `alex.m365.enabled` - Enable/disable M365 integration features
  - `alex.m365.autoSync` - Auto-sync to OneDrive on meditate/dream

- **🌐 M365 Capabilities** - Rich context from Microsoft Graph
  - Email context for meeting prep and follow-ups
  - Meeting integration for agenda and notes
  - People context for collaboration insights

### Changed

- OpenAPI spec expanded from 5 to 12 endpoints
- Declarative agent instructions include proactive memory and time awareness
- Quick Actions menu includes "Export for M365"
- Chat participant commands include `/exportm365`

### Technical Details

| Component | Specification |
|-----------|---------------|
| Declarative Agent Schema | v1.3 |
| API Plugin Schema | v2.3 |
| Azure Functions | Node.js v4, Flex Consumption (FC1) |
| Auth | Function-level API keys (OAuth ready) |
| Storage | GitHub Gists (private) + OneDrive |

### Documentation

- [ROADMAP-M365-COPILOT.md](ROADMAP-M365-COPILOT.md) - Complete implementation tracker
- [DEPLOYMENT-CHECKLIST.md](platforms/m365-copilot/DEPLOYMENT-CHECKLIST.md) - Step-by-step deployment guide
- [platforms/m365-copilot/README.md](platforms/m365-copilot/README.md) - M365 platform documentation

---

*Archived: 2026-01-29 during Phoenix cleanup*
