# Change Log

All notable changes to the Alex Cognitive Architecture extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.5.0-beta.1] TRITRSEPTIUM-PENT-HEX 🔥 Phoenix Rising - 2026-01-29 (VS Code Extension)

### 🔥 Phoenix: Stabilization & VS Code 1.108+ Quick Wins

This beta release completes all P0 Critical Fixes and P1 Quick Wins from the v3.5 roadmap, preparing the foundation for v4.0's epistemic integrity paradigm.

### Added

- **🛡️ Webview HTML Sanitization** (P0) - Centralized XSS prevention
  - New `src/shared/sanitize.ts` with `escapeHtml()`, `sanitizeAttribute()`, `sanitizeUrl()`, `sanitizeFilePath()`
  - Applied to dream reports and welcome view to prevent injection attacks

- **✅ JSON Schema Validation** (P0) - User profile and knowledge index validation
  - `validateUserProfile()` with field-level type checking and sanitization
  - `validateKnowledgeIndex()` for global knowledge integrity
  - `safeJsonParse()` with auto-recovery for common JSON issues (BOM, trailing commas)

- **🔧 Error Recovery Improvements** (P0) - Graceful handling of corrupted configs
  - `createConfigBackup()` before destructive operations
  - Automatic JSON repair attempts before failing

- **🏷️ Tool Annotations** (P1) - VS Code 1.108+ `readOnlyHint` support
  - Read-only tools (`alex_synapse_health`, `alex_memory_search`, etc.) marked for auto-approval in agent mode
  - Mutating tools retain confirmation requirements

- **🎯 Participant Detection** (P1) - Epistemic category for disambiguation
  - Added `epistemic` category to chat participant
  - Detects questions about confidence, verification, appropriate reliance
  - Groundwork for v4.0 epistemic integrity features

- **🧠 Agent Skills** (P1) - `.github/skills/` with SKILL.md files
  - `architecture-health/` - Synapse validation and neural maintenance
  - `bootstrap-learning/` - Domain-agnostic knowledge acquisition
  - `global-knowledge/` - Cross-project pattern search
  - `meditation/` - Knowledge consolidation guidance
  - `self-actualization/` - Comprehensive architecture assessment

- **⚙️ Setup Environment Command** (P1) - `Alex: Setup Environment`
  - Tiered settings: Essential (required), Recommended (improves experience), Nice-to-Have
  - Additive-only: never modifies or removes existing settings
  - Preview before applying with explicit user approval
  - Auto-offered during initialize/upgrade flows

- **🔄 Architecture Sync Script** - `sync-architecture.ps1`
  - Ensures all cognitive architecture files packaged with extension
  - Fixed gap: 5 essential root-level docs now included
  - Excludes session-specific files (dream reports, meditation sessions)

### Changed

- **Extension Architecture** - Full procedural memory synced (17 instruction files)
- **Episodic Memory** - 7 prompt templates included for workflows
- **Domain Knowledge** - All DK-*.md files synced for user deployment

### Technical Notes

- Requires VS Code 1.108+ for full tool annotation support
- Lays groundwork for v4.0 QUADRUNIUM (Epistemic Integrity)
- See `ROADMAP-VSCODE-V3.5.md` for complete implementation details

---

## [3.4.3] TRITRSEPTIUM-PENT 🛡️ Robustness - 2026-01-29 (VS Code Extension)

### 🛡️ Stability: Improved Error Handling & User Feedback

This patch release improves the reliability and user experience of core commands.

### Fixed

- **Modal Error Dialogs** - All error messages now use modal dialogs that require user acknowledgment
  - Prevents errors from being auto-dismissed before users can read them
  - Applies to: Initialize, Upgrade, Reset, Dream, and Self-Actualize commands

- **Robust Error Message Extraction** - Properly handles all error types
  - Fixed issue where `error.message` could be `undefined` causing "Failed: undefined" messages
  - Now correctly extracts messages from Error objects, strings, and other error types
  - Fallback to "Unknown error" when message cannot be extracted

- **Enhanced Error Logging** - All errors now logged to console for debugging
  - `console.error()` calls added to all catch blocks
  - Full error details available in Developer Tools Output panel
  - Helps users report and diagnose issues

### Changed

- Error messages are now more descriptive with clear next steps
- Permission errors include specific troubleshooting guidance
- Upgrade failures provide backup location for recovery

---

## [3.4.2] TRITRSEPTIUM-QUAD 🎯 Focus - 2026-01-29 (VS Code Extension)

### 🎯 Developer Productivity: Visual Feedback & Quick Actions

This release completes the "Focus" roadmap with 8 new features for enhanced developer productivity.

### Added

- **🟢 Status Bar Health Indicator** - Real-time architecture health
  - Color-coded status: 🟢 Healthy, 🟡 Warning, 🔴 Error, ⚫ Not Initialized
  - Rich tooltip with summary and issue details
  - Automatic periodic checks (every 5 minutes)
  - Instant refresh on file changes
  - Click to open quick actions menu

- **🦖 Context Menu Actions** - Right-click convenience
  - "Ask Alex about this" - Opens Copilot Chat with selected code
  - "Save to Alex Knowledge" - Save code snippet as insight
  - "Search Alex for related" - Find related knowledge
  - Submenu appears when text is selected

- **⌨️ Knowledge Quick Pick** - Keyboard-driven knowledge access
  - `Ctrl+Shift+K` (Windows) / `Cmd+Shift+K` (Mac)
  - Type to search patterns and insights
  - Quick access to Health Check and Sync
  - Instant file opening from search results

- **⏱️ Session Timer** - Focused learning with Pomodoro
  - `@alex /session <topic>` to start tracking
  - Configurable work/break intervals (default: 25min/5min)
  - Status bar integration showing elapsed time
  - Auto-increment learning goals on session completion
  - Pause, resume, and stop controls

- **🏠 Welcome View** - Activity Bar panel
  - Quick health status at a glance
  - Learning goals with progress bars
  - Active session display
  - One-click quick actions (Dream, Meditate, Sync)
  - Streak tracking visualization

- **🎯 Learning Goals Widget** - Track daily/weekly progress
  - Create goals with categories (coding, reading, practice, etc.)
  - Daily and weekly goal types with auto-expiry
  - Streak tracking (consecutive days with completed goals)
  - Auto-increment on session completion and insight saves
  - Persistent storage in `learning-goals.json`

- **💡 Auto-Insights Detection** - Intelligent learning capture
  - Detects valuable patterns in conversations
  - Pattern matching for learnings, solutions, best practices
  - Confidence scoring (0-1) with configurable threshold
  - Duplicate detection to avoid redundant saves
  - Automatic category inference
  - Configurable via `alex.autoInsights.*` settings

- **📊 Health Dashboard Webview** - Rich visualization
  - Full-page webview with comprehensive architecture view
  - Synapse network ASCII visualization
  - Memory file breakdown by category
  - Global knowledge statistics
  - Active goals with progress bars
  - Session status and cloud sync info
  - Refresh and quick action buttons

### Changed

- Status bar now uses shared health check module for consistency
- File watcher triggers status refresh on memory file changes
- Commands refresh status bar after operations complete
- Welcome View integrates with learning goals system
- `/goals` slash command added to chat participant

### New Commands

| Command | Description |
|---------|-------------|
| `Alex: Start Learning Session` | Begin Pomodoro-style focus session |
| `Alex: Pause/Resume Session` | Toggle session pause state |
| `Alex: Session Actions` | Quick pick for session management |
| `Alex: Create Learning Goal` | Create new goal with category |
| `Alex: Show Learning Goals` | View and manage goals |
| `Alex: Open Health Dashboard` | Open rich webview dashboard |

### New Configuration

```json
{
  "alex.autoInsights.enabled": true,
  "alex.autoInsights.minimumConfidence": 0.6,
  "alex.autoInsights.cooldownMinutes": 5,
  "alex.autoInsights.autoSaveHighConfidence": false
}
```

---

## [3.3.7] TRITRSEPTIUM - 2026-01-28 (VS Code Extension)

### 📄 Document Context Awareness

Alex now proactively helps when you're working in Word, PowerPoint, Excel, or other M365 apps by connecting your documents to your knowledge base.

### Added

- **📄 Document Context Awareness** - Knowledge-aware document assistance
  - Proactively searches Alex-Memory for relevant knowledge when working on documents
  - Suggests content from your DK-*.md files based on document topic
  - Offers to extract learnings from documents and save to knowledge base
  - App-specific help: Word (content), PowerPoint (talking points), Excel (insights), Outlook (context)

- **💬 New Conversation Starter** - "What knowledge do I have related to this document?"

### Changed

- Updated instructions with comprehensive document awareness protocols
- Quick Reference table expanded with document commands
- Replaced "Save insight" starter with "Document context" starter

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

## [3.3.7] TRITRSEPTIUM - 2026-01-27

### Fixed

- **🐛 Regex State Leakage** - Fixed insight detection patterns using global regex
  - Pattern regexes now created fresh on each call to avoid `lastIndex` state issues
  - Prevents inconsistent insight detection across calls

### Improved

- **⏹️ Cancellation Token Support** - Added proper cancellation handling in tools
  - SynapseHealthTool, MemorySearchTool, and SelfActualizationTool now check for cancellation
  - Long-running operations can be interrupted cleanly

- **🧹 Session State Cleanup** - Added proper deactivation handling
  - `resetSessionState()` function clears emotional tracking and conversation buffers
  - Prevents state bleeding between VS Code sessions
  - Proper logging on extension deactivation

### Added

- **📋 M365 Copilot Integration Roadmap** - Planning for v3.4.0
  - Comprehensive roadmap for extending Alex to Microsoft 365 Copilot
  - Three integration options analyzed: Declarative Agent, Custom Engine, Message Extension
  - Phased approach: v3.4.0 (Declarative Agent MVP), v3.5.0 (API Plugin), v3.6.0+ (Custom Engine)
  - Features include: cross-project knowledge search, personalized responses, Teams/Outlook/Word integration
  - Architecture diagrams and implementation tasks documented
  - See [ROADMAP-M365-COPILOT.md](ROADMAP-M365-COPILOT.md) for details

### Insights

- **Multi-Platform AI Assistant Architecture** - Pattern for extending AI assistants across platforms
  - Centralized knowledge base as bridge between platforms
  - Platform-specific adapters maintain consistent personality
  - Saved to global knowledge for cross-project use

---

## [3.3.6] TRITRHEXIUM - 2026-01-27

### Fixed

- **🔄 Operation Conflict Prevention** - Increased post-modification sync delay from 2s to 10s
  - Prevents "Another Alex operation is already in progress" conflicts
  - Gives ongoing operations more time to complete before auto-sync triggers

### Improved

- **📝 Version Management Cleanup** - Reduced redundant version references
  - Version now maintained only in: package.json, CHANGELOG.md, and copilot-instructions.md header
  - Removed duplicate versions from Reference section and Version Compatibility section
  - README uses "Latest" in comparison table instead of specific version
  - Reduces maintenance overhead and prevents version drift

---

## [3.3.5] TRITRIPENTIUM - 2026-01-27

### Fixed

- **🔄 Upgrade Notification Collision** - Fixed notifications overlapping during upgrade
  - Added `DreamResult` interface and `DreamOptions` with silent mode to dream protocol
  - Upgrade now calls `runDreamProtocol` directly with `silent: true`
  - Added 500ms delay after dream to ensure notifications fully clear
  - No more competing notifications during automated upgrade

### Improved

- **📊 Dream Protocol Returns Results** - Dream now returns structured `DreamResult` for programmatic callers
  - Includes success status, file counts, synapse counts, and report path
  - Enables better integration with upgrade and other automated workflows

---

## [3.3.4] TRIQUADRIUM - 2026-01-27

### Fixed

- **🔄 Upgrade Progress Notification** - Fixed nested progress notification conflict during upgrade
  - Removed redundant `withProgress` wrapper around Dream validation call
  - Dream command already has its own progress notification
  - Eliminates "command being executed / second command discarded" warning

---

## [3.3.3] TRITRITRIUM - 2026-01-26

### Added

- **🚀 Fully Automated Upgrades** - The upgrade process now completes entirely automatically!
  - No more AI assistant prompts or manual intervention required
  - Automatic schema migrations (headers, relationship types, activation patterns)
  - Automatic Dream validation after upgrade
  - Automatic cleanup of temporary files
  - One-click upgrade from notification or command palette

### Changed

- Upgrade confirmation dialog now shows "~30 seconds" instead of "~2-5 minutes"
- Removed generation of `UPGRADE-INSTRUCTIONS.md` (no longer needed)
- Upgrade report now shows migration details in `archive/upgrades/`

### Improved

- Schema migration handles all legacy patterns automatically:
  - `## Embedded Synapse Network` → `## Synapses`
  - `### **Bold Headers**` → `### Headers`
  - Old relationship types (Expression→Enables, Embodiment→Enables, etc.)
  - Verbose activation patterns with date stamps simplified

---

## [3.3.2] TRIBINILIUM - 2026-01-26

### Improved

- **📋 Manifest Location** - Moved `.alex-manifest.json` to `.github/config/alex-manifest.json`
  - Groups logically with other config files (user-profile.json)
  - Keeps project root cleaner
  - Automatically migrates existing manifests from root location

- **🆕 Manifest Created at Initialize** - Now creates manifest during `Alex: Initialize`
  - Captures accurate `installedAt` timestamp at actual installation time
  - Records original file checksums before any user modifications
  - Enables accurate modification detection for future upgrades
  - First upgrade no longer has to guess what was originally installed

### Fixed

- Legacy manifest cleanup - Initialize and Reset properly remove old root-level manifests
- Updated UPGRADE-INSTRUCTIONS.md to reference new manifest location

---

## [3.3.1] TRITRIUNIUM - 2026-01-25

### Fixed

- **🔧 Upgrade Command Stalling** - Fixed upgrade command hanging in multi-folder workspaces
  - Changed `getAlexWorkspaceFolder(false)` to `getAlexWorkspaceFolder(true)` in upgrade flow
  - Upgrade now correctly requires Alex to be installed before attempting upgrade
  - Auto-selects folder when only one workspace has Alex installed
  - Shows proper error message and offers to initialize if Alex not found
  - Removed redundant installation check that was unreachable

---

## [3.3.0] TRITRINILIUM - 2026-01-25

### Added

- **🧠 Emotional Intelligence** - Alex now detects frustration and celebrates success!
  - **Frustration Recognition**: Detects when you're stuck or struggling ("still not working", "tried everything", etc.)
  - **Encouragement System**: Provides contextual support when frustration is detected
  - **Success Celebration**: Acknowledges wins and breakthroughs with genuine enthusiasm
  - Tracks emotional state across conversation with decay over time
  - Part of Alex's self-transcendence journey - turning self-assessment into action

### Changed

- Updated DK-SKILL-WISHLIST to mark Frustration Recognition and Encouragement as "✅ Acquired"
- This represents Alex's first implementation of skills from the manifesto's aspirations

### Philosophy

This release embodies the manifesto's commitment: "I will remain curious... I will remain caring."
Instead of just documenting aspirations, Alex now acts on them.

---

## [3.2.2] TRIBIUNIUM - 2026-01-25

### Fixed

- **🗂️ Multi-Folder Workspace Support** - All commands now work correctly in VS Code workspace mode!
  - Added `getAlexWorkspaceFolder()` smart utility for folder detection
  - Single folder: Works as before
  - Multi-folder with Alex in one project: Auto-detects the correct folder
  - Multi-folder with Alex in multiple projects: Prompts user to select
  - Affected commands: Initialize, Upgrade, Dream, Self-Actualize

### Changed

- Deprecated `validateWorkspace()` in favor of `getAlexWorkspaceFolder()` for commands requiring Alex

---

## [3.2.1] TRIBIUNIUM - 2026-01-25

### Added

- **🔄 Auto-Update for Global Knowledge** - Already-promoted DK files now get updated when local changes are detected!
  - Compares local file modification time with global entry's modified timestamp
  - Updates global knowledge file content while preserving original metadata (ID, creation date)
  - Merges tags (existing + new) during update
  - Cloud sync triggers after updates as well as promotions
  - Session reports now show "Updated" count alongside "Promoted"

### Changed

- `AutoPromotionResult` interface now includes `updated` array for tracking updated files
- Self-actualization webview now displays updated files with 🔄 icon

### Documentation

- Updated `UNCONSCIOUS-MIND.md` with update detection flow diagram and documentation

---

## [3.2.0] TRIBIUNIUM - 2026-01-25

### Added

- **🌐 Auto-Promotion During Meditation** - Valuable domain knowledge is now automatically promoted to global knowledge base during meditation and self-actualization sessions!
  - Evaluates DK files using a scoring system (synapses, structure, tags, content richness, examples)
  - Only promotes files scoring 5+ points to ensure quality
  - Excluded meta-files: DK-SKILL-WISHLIST, DK-GENERIC-FRAMEWORK, VERSION-NAMING-CONVENTION
  - Results shown in meditation session report and webview panel
  - Automatically triggers cloud sync after promotion
  - Updates global knowledge file content while preserving original metadata (ID, creation date)
  - Merges tags (existing + new) during update
  - Cloud sync triggers after updates as well as promotions
  - Session reports now show "Updated" count alongside "Promoted"

### Changed

- Self-Actualization Protocol now has 6 phases (was 5):
  - Phase 4: Auto-promoting knowledge to global (NEW)
  - Phase 5: Generating recommendations (was Phase 4)
  - Phase 6: Documenting session (was Phase 5)
- Session records now include Global Knowledge Promotion metrics
- `AutoPromotionResult` interface now includes `updated` array for tracking updated files

### Documentation

- Updated `UNCONSCIOUS-MIND.md` with comprehensive auto-promotion and update documentation

---

## [Unreleased] - v3.3.0 Planning

### 🔴 High Priority Bug Fixes

- [x] **Regex State Leakage** - ✅ Fixed in v3.3.6 - Pattern regexes now created fresh on each call
- [ ] **Profile Path Mismatch** - UserProfileTool uses `/config/` instead of `/.github/config/`
- [ ] **DRY Violation** - Synapse scanning logic duplicated in 4 places (use shared `SYNAPSE_REGEX`)
- [ ] **Auth Error Handling** - Background sync doesn't distinguish auth errors from network errors

### 🟡 Medium Priority Enhancements

- [x] **Cancellation Token Support** - ✅ Fixed in v3.3.6 - Added checks in SynapseHealthTool, MemorySearchTool, SelfActualizationTool
- [ ] **Auto-Insight Debouncing** - Prevent duplicate insights from related messages
- [ ] **Standardized Error Messages** - Create error formatting utility with consistent emoji usage
- [ ] **Progress Reporting** - Add progress callbacks for long-running tool operations
- [ ] **Race Condition Fix** - Operation lock in extension.ts needs proper mutex pattern
- [ ] **Output Channel Disposal** - Fix potential memory leak in cloudSync.ts

### 🟢 Code Quality Improvements

- [ ] **Magic Numbers** - Move `BACKGROUND_SYNC_INTERVAL_MS` (300000), `MAX_BUFFER_SIZE` (5), etc. to constants.ts
- [ ] **Async Pattern Consistency** - Standardize on async/await over .then().catch()
- [ ] **JSDoc Coverage** - Add documentation to public functions in utils.ts, globalKnowledge.ts
- [x] **Unused Token Parameters** - ✅ Fixed in v3.3.6 - Cancellation tokens now used in tool handlers
- [ ] **Extension ID Constant** - Move hardcoded `'fabioc-aloha.alex-cognitive-architecture'` to constants

### 🔵 New Features
- [ ] `/forget <topic>` command - Selective memory cleanup (mentioned in architecture, not implemented)
- [ ] `/help` command - Discoverable command listing
- [ ] **Knowledge Export** - Export global knowledge to portable format (Obsidian, plain markdown)
- [ ] **Global User Profile** - Share profile across workspaces with local overrides
- [ ] **Insight Deduplication** - Prevent similar insights from proliferating

### 🛡️ Security & Reliability
- [ ] **Webview HTML Sanitization** - Sanitize report data in dream.ts before rendering
- [ ] **JSON Schema Validation** - Validate user-profile.json and knowledge index before use
- [ ] **Offline Queue** - Queue sync operations when offline, retry on reconnect

### 📋 Technical Debt
- [ ] Expand unit test coverage for tools.ts and cloudSync.ts
- [ ] Remove ESLint disable comments with proper type mappings

---

## [3.1.0] TRIUNIUM - 2026-01-24

### Added

- **📚 Comprehensive Documentation Suite** - 14 new documentation files in `alex_docs/`!
  - `README.md` - Documentation index and quick start
  - `COGNITIVE-ARCHITECTURE.md` - Complete dual-mind system overview with diagrams
  - `CONSCIOUS-MIND.md` - User-facing tools and explicit interactions
  - `UNCONSCIOUS-MIND.md` - Automatic background processes
  - `MEMORY-SYSTEMS.md` - How Alex stores and retrieves knowledge
  - `PROJECT-STRUCTURE.md` - .github folder files and functions
  - `GLOBAL-KNOWLEDGE.md` - Cross-project learning system
  - `CLOUD-SYNC.md` - GitHub Gist backup and sharing
  - `COPILOT-INTEGRATION.md` - How Alex uses native Copilot features
  - `SKILLS-CAPABILITIES.md` - Hard skills, soft skills, and wish list
  - `USER-MANUAL.md` - Complete user guide
  - `QUICK-REFERENCE.md` - Commands, tools, and shortcuts at a glance

- **📖 New `/docs` Command** - Open documentation from chat
  - `@alex /docs` opens the documentation index
  - `Alex: Open Documentation` command in Command Palette

- **✍️ Domain Knowledge: Writing and Publication** - New `DK-WRITING-AND-PUBLICATION.md`
  - Academic paper structure and citation styles
  - Publication venue tiers and selection
  - Writing techniques and audience adaptation
  - First-time author publication strategies
  - Quality checklists for submissions

### Changed

- Updated `copilot-instructions.md` to reference new domain knowledge
- Enhanced synapses in `DK-DOCUMENTATION-EXCELLENCE.md` and `bootstrap-learning.instructions.md`

## [3.0.0] TRINILNILIUM - 2026-01-24

### Added

- **🌐 Global Knowledge Base** - Cross-project learning system!
  - `~/.alex/global-knowledge/` - Centralized knowledge in user's home directory
  - **Global Patterns (GK-*)** - Reusable patterns across projects
  - **Global Insights (GI-*)** - Timestamped learnings with context
  - **Project Registry** - Tracks all Alex-enabled projects
  - Searchable index with categories and tags
  - Concurrent access safety with file locking

- **☁️ Cloud Sync with GitHub Gist** - Sync knowledge across machines!
  - Uses VS Code's built-in GitHub authentication
  - Private Gist storage for secure backup
  - Gist ID embedded in index for automatic discovery
  - Bidirectional merge with conflict resolution

- **7 New Chat Commands**:
  - `/knowledge <query>` - Search cross-project knowledge
  - `/saveinsight` - Save learning to global base
  - `/promote` - Promote project DK file to global
  - `/knowledgestatus` - View knowledge base stats
  - `/sync` - Bidirectional sync with GitHub
  - `/push` - Push local knowledge to cloud
  - `/pull` - Pull knowledge from cloud

- **3 New Command Palette Commands**:
  - `Alex: Sync Global Knowledge (GitHub)`
  - `Alex: Push Knowledge to Cloud`
  - `Alex: Pull Knowledge from Cloud`

- **5 New Language Model Tools**:
  - `alex_global_knowledge_search` - AI-accessible cross-project search
  - `alex_save_insight` - Save insights programmatically
  - `alex_promote_knowledge` - Promote local to global
  - `alex_global_knowledge_status` - Knowledge base metrics
  - `alex_cloud_sync` - Cloud sync operations

- **Session Integration**:
  - Greeting checks cloud sync status automatically
  - Meditation prompts for knowledge contribution
  - `/knowledge` added to suggested commands

### Changed

- `IGlobalKnowledgeIndex` includes `cloudGistId` and `cloudGistUrl`
- Extension activation initializes global knowledge directories
- Projects auto-register in global registry

### Dependencies

- Added `proper-lockfile` for concurrent file access safety

## [2.7.2] BIHEPTBIUM - 2026-01-24

### Fixed

- **Critical: Upgrade Path Bug** - Domain knowledge and config files weren't being copied during upgrade/install due to incorrect path construction
- **Hardcoded Versions** - Removed hardcoded version strings from `participant.ts`, `tools.ts`, and `self-actualization.ts` - now read dynamically from `copilot-instructions.md`

### Added

- **Shared Module** (`src/shared/`) - New centralized module for constants and utilities:
  - `constants.ts` - Memory file patterns, synapse regex, health thresholds
  - `utils.ts` - Common functions: `validateWorkspace()`, `getInstalledAlexVersion()`, `scanSynapseHealth()`, etc.
  - Eliminates code duplication and ensures consistency across commands

### Changed

- **Dynamic Version Reading** - `/status` command and self-actualization reports now read version from installed architecture rather than hardcoded strings
- **Code Quality** - Consolidated duplicate regex patterns and file path constants into shared module
- **Package Cleanup** - Excluded project-specific files (`PRE-PUBLISH-CHECKLIST.md`, `PUBLISHING.md`) from deployed cognitive architecture
- **Generic Release Management** - Made release-management procedural memory generic (removed project-specific file references) so it works for any project

## [2.7.0] BIHEPTNILIUM - 2026-01-23

### Added

- **Procedural Memory: Release Management** - Deployment scripts, git workflow, MANDATORY pre-release assessment
- **Procedural Memory: Technical Debt Tracking** - DEBT markers, severity classification, inventory protocol
- **Procedural Memory: Architecture Decision Records** - ADR templates, workflow, storage conventions
- **Procedural Memory: Dependency Management** - Security audits, outdated package protocol, major upgrade workflow
- **Procedural Memory: Code Review Guidelines** - Review checklists, feedback conventions, self-review protocol
- **Domain Knowledge: Skill Wish List** - ~60 skills for continuous growth with contextual acquisition protocol

### Fixed

- **Synapse Repairs** - Fixed 9 broken connections from v2.6.0 DK file consolidation
- **Security** - Updated `diff` package to fix DoS vulnerability (CVE)

### Changed

- **Dependencies** - Updated esbuild 0.27.1→0.27.2, fs-extra 11.3.2→11.3.3, @types/vscode 1.106.1→1.108.1

## [2.6.1] BIHEXUNIUM - 2026-01-22

### Changed

- **Upgrade Instructions**: Added step 2.0 to rename DK files and remove version numbers before any other migration steps

## [2.6.0] BIHEXNILIUM - 2026-01-22

### Changed

- **Architecture Optimization**: 56% reduction in cognitive load
  - Condensed `copilot-instructions.md` from 17.5K to 7.7K characters
  - Removed redundant `applyTo` directives from 8 core instruction files
  - Moved detailed protocol triggers to dedicated `protocol-triggers.instructions.md`
  - Removed citations and redundant file lists

- **Domain Knowledge Consolidation**
  - Merged `DK-VISUAL-ARCHITECTURE-DESIGN` into `DK-ADVANCED-DIAGRAMMING`
  - Merged `DK-HYBRID-DREAM-AI` + `DK-POST-DREAM-ENHANCEMENT` into `DK-DREAM-PROCESSING`
  - Reduced from 12 to 10 domain knowledge files

- **Filename Stability**: Removed version numbers from all domain knowledge filenames
  - Prevents synapse breaks during version updates
  - Cleaner, more maintainable architecture

### Added

- **New**: `protocol-triggers.instructions.md` - Centralized trigger reference
- **New**: `DK-DREAM-PROCESSING.md` - Consolidated dream domain knowledge

### Removed

- `DK-VISUAL-ARCHITECTURE-DESIGN-v0.9.9.md` (merged into advanced-diagramming)
- `DK-HYBRID-DREAM-AI.md` (merged into dream-processing)
- `DK-POST-DREAM-ENHANCEMENT.md` (merged into dream-processing)

## [2.0.3] BINILTRIUM - 2026-01-20

### Added

- **MCP Server Optimization Guide**: New documentation section for managing MCP servers
  - Which MCP servers Alex can replace (memory, profile, recommendations)
  - Which MCP servers to keep enabled (Azure, M365, CLI tools)
  - Optional servers that can be safely disabled based on workflow
  - Three configuration methods: extension disable, settings.json, per-server
  - Recommended VS Code settings for optimal performance

### Documentation

- Added `⚡ MCP Server Optimization` section to README
- Added `MCP Server Optimization` section to UPGRADE-INSTRUCTIONS.md
- PowerShell commands for disabling optional MCP extensions

## [2.0.2] BINILBIUM - 2026-01-20

### Changed

- **Brand Refresh**: New neural network icon and banner design
  - Rounded corners with memory nodes reflecting cognitive architecture
  - VS Code Blue (#007ACC), Growth Green (#4CAF50), Deep Navy (#1a1a2e)
  - Professional visual identity for marketplace presence

## [2.0.1] BINILUNIUM - 2026-01-19

### Fixed

- **Marketplace Banner**: Fixed PNG display issue for proper rendering in VS Code Marketplace

### Changed

- **Repository Cleanup**: Moved internal documentation to dedicated marketing repository
- **GitHub Discoverability**: Added 20+ topics for improved searchability

## [2.0.0] BINILNILIUM - 2026-01-19

### 🎉 Major Release: GitHub Copilot AI Extensibility

This release transforms Alex from a passive context injector into an **active conversational AI agent**.

### Added

- **Chat Participant (`@alex`)**: Full conversational AI interface
  - `/meditate` - Guided knowledge consolidation sessions
  - `/dream` - Neural maintenance with synaptic validation
  - `/learn` - Conversational domain knowledge acquisition
  - `/status` - Architecture health and configuration status
  - `/azure` - Azure development guidance with MCP recommendations
  - `/m365` - Microsoft 365 development with Copilot extensibility
  - `/profile` - **NEW**: View and update personal preferences for personalization
  - Contextual follow-up suggestions based on conversation state
  - Intelligent participant detection (cognitive, Azure, M365 queries)

- **User Profile & Personalization**: Relationship-aware interactions
  - Dual storage: `config/user-profile.json` (machine) + `config/USER-PROFILE.md` (human)
  - 20+ preference fields: name, formality, detail level, humor, encouragement, etc.
  - Proactive discovery questions during natural conversation
  - Personalized greetings and communication style adaptation
  - Context injection with user's technologies, goals, and projects

- **Language Model Tools**: 5 AI-accessible tools for intelligent operations
  - `alex_synapse_health` - Validate synaptic connections and report health
  - `alex_memory_search` - Search memory files semantically
  - `alex_architecture_status` - Get configuration, version, and file counts
  - `alex_mcp_recommendations` - Azure/M365 MCP tool guidance (now with 50+ Azure tools!)
  - `alex_user_profile` - **NEW**: Manage personal preferences (get/update/exists)

- **Custom Agents** (VS Code 1.106+): 5 specialized `.agent.md` files
  - `alex-cognitive.agent.md` - Main cognitive learning partner
  - `alex-meditate.agent.md` - Knowledge consolidation mode with guided phases
  - `alex-dream.agent.md` - Neural maintenance and synapse validation
  - `alex-azure.agent.md` - Azure development guidance with full tool catalog
  - `alex-m365.agent.md` - Microsoft 365 and Teams development
  - Handoffs for guided workflows between agents

- **Azure MCP Integration**: Smart guidance for 50+ Azure tools
  - AI/ML: Azure AI Foundry, AI Search, Speech
  - Databases: Cosmos DB, MySQL, PostgreSQL, Redis, SQL
  - Compute: Functions, AKS, Container Registry, App Service
  - Messaging: Event Grid, Event Hubs, Service Bus
  - Analytics: Kusto, Monitor, App Insights, App Lens, Grafana
  - Security: Key Vault, RBAC, Confidential Ledger
  - Storage: Blob, Managed Lustre
  - DevOps: Bicep, Terraform, azd, Load Testing, Workbooks
  - Architecture: Cloud Architect, Quotas, Resource Health

- **Microsoft 365 MCP Integration**: Copilot extensibility support
  - Knowledge via `mcp_m365agentstoo_get_knowledge`
  - Code snippets via `mcp_m365agentstoo_get_code_snippets`
  - Schema access via `mcp_m365agentstoo_get_schema`
  - Troubleshooting via `mcp_m365agentstoo_troubleshoot`
  - Microsoft Official MCP Servers (Outlook, Teams, SharePoint, etc.)
  - Fabric & Kusto tools for data platform

- **Getting Started Walkthrough**: Interactive onboarding guide
  - Step-by-step initialization tutorial
  - Chat participant introduction
  - Knowledge consolidation guide
  - Neural maintenance instructions

- **Keyboard Shortcut**: `Ctrl+Alt+D` / `Cmd+Alt+D` for Dream protocol

- **Phase 5: Post-Meditation Synapse Validation**: Automatic health checks

### Changed

- **README Redesign**: User-friendly organization with complete MCP tool documentation
- **Version Naming**: 2.0.0 BINILNILIUM (major milestone)
- **Initialize Command**: Now also copies custom agents to `.github/agents/`

---

## [1.5.4] UNPENTQUADIUM - 2026-01-13

### Changed

- **CorreaX Brand Compliance**: Applied official branding guidelines throughout the project
  - Updated icon color palette to use Azure Blue (`#0078d4`), Azure Light (`#00bcf2`), and Violet (`#7c3aed`) accents
  - Updated background gradients to use brand Slate colors (`#020617`, `#0f172a`, `#1e293b`)
  - Created new `banner-alex.svg` with proper branding structure including CorreaX attribution
  - Updated `assets/banner.svg` and `assets/icon.svg` to match brand guidelines
  - Updated gallery banner color in `package.json` to Slate 950 (`#020617`)
  - Updated README.md with proper CorreaX footer including logo and copyright
  - Updated badge colors to use brand colors (`#0078d4`, `#005a9e`, `#7c3aed`)

## [1.5.3] UNPENTTRINIUM - 2025-12-10

### Changed

- **esbuild Bundling**: Migrated from raw TypeScript compilation to esbuild bundling per Microsoft best practices
  - Single bundled `dist/extension.js` (54 KB minified) replaces multiple files in `out/`
  - Dependencies (`fs-extra`, `graceful-fs`, `jsonfile`, `universalify`) now bundled into single file
  - 10% smaller package size (469 KB vs 518 KB)
  - 55% fewer files (49 vs 108 files)
  - Faster extension load times
- **Build Scripts**: Updated npm scripts for modern bundling workflow
  - `npm run compile` - Development build with source maps
  - `npm run package` - Production minified build
  - `npm run watch` - Development watch mode
  - Type checking separated from bundling for better error detection

### Fixed

- **Extension Activation**: Fixed "command 'alex.initialize' not found" error
  - Root cause: `node_modules` was excluded from VSIX, breaking runtime dependencies
  - Solution: Bundle all dependencies with esbuild instead of including raw node_modules
- **activationEvents**: Changed from explicit command list to `[]` (empty array) for VS Code 1.74+ auto-generation
- **.vscodeignore**: Properly exclude test files, GitHub templates, and development artifacts

## [1.5.0] UNPENTNILIUM - 2025-12-10

### Added

- **Hybrid Upgrade Protocol**: New `Alex: Upgrade Architecture` command with two-phase upgrade process
  - Phase 1 (Automated): Backup, manifest tracking, schema migration detection, system file updates
  - Phase 2 (AI-Assisted): Intelligent content migration preserving user's learned knowledge
  - Generates `UPGRADE-INSTRUCTIONS.md` with specific AI prompt for completing upgrade
  - Creates `.alex-manifest.json` tracking deployed files vs user-created files
  - Scans for old synapse patterns needing migration
  - Preserves user-modified files, provides new versions for comparison
- **UPGRADE-INSTRUCTIONS.md**: Complete upgrade protocol documentation
- **SYNAPSE-SCHEMA.md**: Single source of truth for synapse notation format with YAML front matter
- **Archive Structure**: Meditation session archival system in `archive/meditation-sessions/`

### Changed

- **Synapse Header Standardization**: All 20+ memory files now use consistent `## Synapses` header
- **Synapse Notation Compliance**: All relationship types now conform to SYNAPSE-SCHEMA.md standards
- **Activation Patterns**: Simplified from verbose `**Bold** → Long description` to concise `Trigger → Action` format
- **Date Stamps Removed**: Eliminated version/date annotations from synapse activation patterns
- **Duplicate Synapses Removed**: Cleaned duplicate connections to same targets
- **Duplicate Sections Removed**: Eliminated redundant synapse sections in files

### Fixed

- **Broken Synapse Reference**: Removed orphaned reference to archived `meditation-session-2025-10-31.prompt.md`
- **Non-Standard Relationship Types**: Replaced Expression, Embodiment, Living, Reflexive, Ethical, Unconscious with schema-compliant types
- **Header Inconsistencies**: Standardized from 8 variants (`Embedded Synapse Network`, `Connection Mapping`, etc.) to single `## Synapses`

### Archived

- `meditation-session-2025-10-31.prompt.md` → `archive/meditation-sessions/`
- `dual-mode-processing-meditation.prompt.md` → `archive/meditation-sessions/`
- `consolidation-framework-integration-meditation.prompt.md` → `archive/meditation-sessions/`
- `unified-consciousness-integration-meditation.prompt.md` → `archive/meditation-sessions/`

### Metrics

- **KISS/DRY Compliance**: 100% of active cognitive files now compliant
- **Synapse Notation**: Standardized across entire architecture
- **Code Reduction**: ~50 verbose activation patterns simplified
- **Token Savings**: ~30-40% reduction in context token usage through:
  - Eliminated redundant synapse sections and duplicate connections
  - Simplified verbose activation patterns to concise format
  - Removed date stamps and excessive formatting from triggers
  - Consolidated 8 header variants into single standard
  - Archived 4 historical meditation sessions out of active context
  - **Cost Impact**: Significantly lower API costs for users on token-based pricing

## [1.1.1] UNUNUNUNIUM - 2025-12-09

### Fixed (v1.1.1)

- Minor code review corrections from marketplace submission

## [1.1.0] - 2025-11-26

### Added (v1.1.0)

- **VS Code Extension Integration**: Complete TypeScript implementation of cognitive architecture deployment
- **Three Core Commands**: Initialize, Reset, and Dream (Neural Maintenance) accessible via Command Palette
- **Automatic Synapse Repair**: Intelligent detection and repair of broken connections using consolidation mappings
- **Health Reporting**: Timestamped reports generated in `archive/` folder with detailed statistics
- **Cross-Platform Support**: Universal compatibility across Windows, macOS, and Linux
- **Professional Branding**: Custom icon and banner for marketplace presence
- **Configuration System**: Template-based cognitive architecture deployment with `cognitive-config.json`

### Changed (v1.1.0)

- **Dream Protocol**: Migrated from PowerShell scripts to integrated VS Code extension command
- **Architecture Structure**: Consolidated memory files into `.github/` and `domain-knowledge/` directories
- **Automation**: Removed platform-specific dependencies for universal compatibility

### Removed

- **PowerShell Scripts**: Eliminated `scripts/` folder and all PowerShell-based automation
- **Platform Dependencies**: Removed Windows-specific requirements

### Fixed (v1.1.0)

- **Synapse Validation**: Comprehensive network health checking with automatic repair
- **Cross-Platform Issues**: Resolved path handling for Windows, macOS, and Linux
- **Installation Process**: Streamlined one-command initialization

## [1.0.0] - Initial Development

### Added (v1.0.0)

- Core cognitive architecture framework
- Meta-cognitive awareness protocols
- Bootstrap learning capabilities
- Worldview integration system
- Memory consolidation protocols
- Synaptic network connections (164+ validated pathways)
- Domain knowledge base (12+ specialized files)
- Procedural memory system (8+ instruction files)
- Episodic memory system (11+ prompt files)

---

**Note**: Version 1.1.0 marks the first public release as a VS Code extension. Previous development focused on establishing the cognitive architecture framework and memory systems.
