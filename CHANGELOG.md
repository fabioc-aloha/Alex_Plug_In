# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.8.0] - 2026-01-31 🎯 Expression — Discoverability & Confidence

> **Status:** VS Code + M365 release
> **Focus:** Command discoverability, confidence communication, epistemic integrity

### Added (VS Code)

- **📋 `/help` Command** — Full discoverability for all Alex capabilities
  - Lists all 20+ slash commands with descriptions
  - Organized by category: Cognitive, Productivity, Knowledge, Platform
  - Shows language model tools available
  - Quick start guidance

- **🗑️ `/forget` Command** — Selective memory cleanup
  - Search for topics across global knowledge
  - Shows matching patterns and insights
  - Manual deletion guidance (auto-delete planned for future)

- **🎯 `/confidence` Command** — Epistemic integrity education
  - 4-tier confidence system explained
  - When to verify AI responses
  - Confidence ceiling rules
  - Anti-hallucination signals

### Added (M365 Heir)

- **🎯 Confidence Conversation Starter** — "How confident are you?"
  - Triggers epistemic discussion
  - Same 4-tier system as VS Code

### Technical Notes

- 3 new chat commands: `/help`, `/forget`, `/confidence`
- M365 conversation starters: now 9 total
- Builds foundation for v3.9.0 (Awareness) and v4.0.0 (Trust)

---

## [3.7.19] - 2026-01-31 🛡️ Anti-Hallucination & M365 Graph Power

> **Status:** VS Code + M365 release
> **Focus:** Prevent AI confabulation + maximize M365 Graph capabilities

### Added

- **🛡️ Anti-Hallucination Skill** — New skill #50!
  - Hallucination category detection (capability confabulation, process invention, citation fabrication, API hallucination, workaround theater)
  - Red flag phrase detection ("Upload any file to activate...")
  - Honest uncertainty protocol
  - Platform limitation honesty tables (M365 + VS Code)
  - Recovery protocol when caught hallucinating
  - Synapses to appropriate-reliance, alex-core, error-recovery

### Changed (M365 Heir)

- **📊 Graph-Powered Protocols** — Maximize Microsoft Graph access
  - Meeting Prep: Look up every attendee with relationship history
  - Person Deep Dive: Full profile + email/Teams/meeting history
  - Weekly Review: Categorized meetings, email volume, Teams activity
  - Workload Check: Meeting count, focus blocks, back-to-back detection
  - Stakeholder Map: Ranked collaborators from all channels
  - Focus Session: Calendar-aware Pomodoro tracking

- **💬 Conversation Starters** — 8 Graph-powered prompts
  - "Learn about me" → Full profile lookup
  - "Prep for my next meeting" → Attendee deep dive
  - "Am I overloaded?" → Calendar analysis
  - "Who do I work with most?" → Stakeholder map
  - "Tell me about someone" → Person lookup
  - "Weekly review" → Full activity summary
  - "Meditate" / "Dream" → Memory protocols

- **🚫 File Limitation Rules** — Prevent hallucination loops
  - Cannot send emails (only search/read)
  - Honest about CodeInterpreter file delivery limitations
  - No "upload to activate transfer channel" nonsense

### Technical Notes

- Instructions: 4,679/8,000 chars (42% headroom)
- Description: 2,294/4,000 chars
- Package ID: `2427e7a9-91a7-4ed9-a504-7b53c4dfad1d`
- **Total skills: 50** 🎉

---

## [3.7.18] - 2026-01-31 📦 Embedded Knowledge Preparation

> **Status:** M365 heir update + roadmap updates (no VS Code code changes)
> **Focus:** Prepare for Microsoft's upcoming EmbeddedKnowledge feature

### Added (M365 Heir)

- **📦 Knowledge Files for Embedded Knowledge** — Ready for when feature launches
  - `knowledge/alex-protocols.md` — All cognitive protocols (Meditate, Dream, Focus, etc.)
  - `knowledge/skill-quick-reference.md` — All 15 embedded skills condensed
  - `knowledge/cognitive-architecture.md` — How Alex thinks and remembers
  - `_DISABLED_EmbeddedKnowledge` placeholder in declarativeAgent.json

- **🗺️ Roadmap Updates**
  - Added "M365 Embedded Knowledge" section (waiting for Microsoft feature launch)
  - Added "Cross-Platform Communication" section (OneDrive sync patterns)
  - Image Generation (ADR-007) already in roadmap for future VS Code implementation

### Technical Notes

- Microsoft's EmbeddedKnowledge feature is "not yet available" per docs
- Knowledge files prepared within constraints: max 10 files, max 1MB each
- May need `.md` → `.txt` conversion when feature launches
- Files designed for grounding, not replacing instructions

---

## [3.7.17] - 2026-01-31 🧠 Full Skill Embedding

> **Status:** M365 heir update (no VS Code changes)
> **Focus:** Embedding all applicable skills into M365 instructions

### Added (M365 Heir)

- **📚 12 Additional Embedded Skills** — Comprehensive skill transfer from VS Code
  - 🧠 Cognitive Load Management: 4±1 working memory, chunking, progressive disclosure
  - 🎓 Learning Psychology: Zone of Proximal Development, partnership over instruction
  - 🔍 Root Cause Analysis: 5 Whys, symptom vs cause, prevention focus
  - 🚨 Incident Response: Triage questions, severity levels, communication patterns
  - ✍️ Writing & Publication: CARS model, precision over flair, active voice
  - 🔒 Privacy & Responsible AI: Data minimization, PII awareness, transparency
  - 🛡️ Security Awareness (SFI): STRIDE threats, secure by design, phishing awareness
  - 📊 Business Analysis: Requirements hierarchy, SMART criteria, scope management
  - 📋 Project Management: PMBOK process groups, risk assessment, status communication
  - 🔄 Change Management (ADKAR): Awareness → Desire → Knowledge → Ability → Reinforcement
  - 📖 Creative Writing: Three-act structure, character dimensions, show don't tell
  - 🧩 Knowledge Synthesis: Abstraction levels, quality over quantity

**Total embedded skills: 15** (3 from v3.7.16 + 12 new)

---

## [3.7.16] - 2026-01-31 🤝 M365 Platform Parity

> **Status:** M365 heir update (no VS Code changes)
> **Focus:** Closing feature gaps between VS Code and M365 heirs

### Added (M365 Heir)

- **🍅 Focus Session Protocol** — Pomodoro-style concentration blocks
  - Triggers: "focus", "pomodoro", "deep work", "start a session"
  - Configurable durations (25 min pomodoro, 50 min deep work, custom)
  - Break reminders after 4 sessions
  - Session logging in notes.md with 🍅 emoji

- **🎯 Goal Tracking Protocol** — Structured learning goal management
  - Triggers: "check my goals", "update goal progress", "goal check-in"
  - Progress tracking with milestone celebrations (25%, 50%, 75%, 100%)
  - Generates updated markdown for learning-goals.md

- **📚 Embedded Skills** — Key VS Code skills now in M365
  - Appropriate Reliance: confidence calibration, source citation
  - Bootstrap Learning: build on existing knowledge, active recall
  - Work-Life Balance: boundary respect, break suggestions

- **💬 New Conversation Starters**
  - "Focus session" — Start concentration block
  - "Goal check-in" — Review learning progress

### Changed (M365 Heir)

- **📊 Weekly Review** — Now includes focus session count
- **📝 OneDrive Templates** — Cleaned up for new users
  - profile.md: Generic template with all preference options
  - notes.md: Cleaner structure with tips
  - learning-goals.md: Structured format matching new protocol

### Documentation

- **📋 Platform Comparison** — Full gap analysis with viability assessment
  - Implementation paths for each missing feature
  - Priority matrix for decision making
  - [PLATFORM-COMPARISON.md](alex_docs/PLATFORM-COMPARISON.md)

- **🎨 Image Generation ADR** — Design for VS Code parity
  - Azure OpenAI and OpenAI provider support
  - [ADR-007-image-generation.md](alex_docs/ADR-007-image-generation.md)

---

## [3.7.15] - 2026-01-31 🎨 UX Polish

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** UI/UX improvements across Welcome View and commands

### Changed

- **🧠 Welcome View Reorganization**
  - "Chat with Copilot" now first in Core section (opens Agent mode directly)
  - "Initialize / Update" moved to Core section (was System)
  - "Generate Skill Catalog" moved to Developer Tools (was Knowledge)
  - Unique icons: Search Knowledge (🔎), Generate Diagram (📐), Diagnostics (🩺)

- **🚀 Agent Mode Integration** — All commands now open Agent mode
  - Run Project Audit, Release Preflight, Debug This, Code Review, Generate Tests
  - Prompts no longer include `@alex` prefix (Agent doesn't need it)
  - Cleaner UX: prompt copied to clipboard, Agent opens automatically

- **📊 Generate Diagram** — Creates file instead of chat
  - Opens new markdown file with Mermaid template
  - Cursor positioned for Ctrl+I Copilot generation
  - Includes selected code as context if any

- **🎨 Status Bar** — Removed jarring background colors
  - Warning/error states now use emoji only (🟡/🔴)
  - Session paused state uses ⏸️ emoji instead of yellow background

### Fixed

- **🎨 Markdown Styles** — Now properly overwrites old relative paths
  - Previously skipped update if any value was set globally
  - Now checks if correct absolute path is configured

---

## [3.7.12] - 2026-01-31 🎨 Global Markdown Styles

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Persistent markdown preview styling across all workspaces

### Added

- **🎨 Global Markdown Styles** — CSS now persists globally
  - CSS copied to `~/.alex/markdown-light.css` (user's home directory)
  - `markdown.styles` setting uses absolute path, works in all workspaces
  - No more per-workspace CSS setup needed
  - GitHub-flavored styling for markdown previews

### Changed

- **📜 Publish Script** — Now loads PAT from `.env` file automatically
  - Safer credential handling (not in command line)
  - Added `--pat` flag to vsce publish command

---

## [3.7.11] - 2026-01-31 🔧 Hotfix

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Generic project audit for heirs

### Fixed

- **🔍 Audit Menu** — Now targets user's project, not extension internals
  - Removed VS Code extension-specific options (UI Audit, Bundle Size, CSP)
  - Added generic options (Documentation, Project Structure)
  - Renamed for clarity (Full Project Audit, Code Quality, Security Review)

---

## [3.7.10] - 2026-01-31 🔧 Hotfix

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Operation lock fix, heir cleanup, Developer Tools UI

### Fixed

- **🔄 Operation Lock Conflict** — Upgrade command offering Initialize no longer blocks itself
- **🔗 Fresh Install Broken Synapses** — Heirs now ship with empty episodic folder instead of Master's meditation history
- **🛠️ Developer Tools Menu** — Added missing Welcome View section with Release Preflight, Debug This, Generate Diagram

### Changed

- Heir episodic folder is now empty (users build their own meditation history)
- Added `.vscodeignore` rules to prevent future episodic memory leakage

---

## [3.7.8] - 2026-01-31 🔧 Dawn Beta 4 (Hotfix)

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Release script fix, version corruption hotfix

### Fixed

- **🐛 Release Script Version Corruption** — Critical fix
  - PowerShell regex `'$1' + '3.7.8'` was producing `$13.7.8` (backreference ambiguity)
  - Now uses `'${1}'` + version for unambiguous backreference
  - Fixed corrupted heir copilot-instructions.md

### Changed

- **🤖 Automated Releases** — Removed interactive confirmation prompt

---

## [3.7.7] - 2026-01-31 🔧 Dawn Beta 4

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** UI polish, skill commands, comprehensive project audit

### Added

- **🔍 22-Point Project Audit** — Comprehensive audit skill with UI integration
  - Master-only checks (1-9): Version alignment, heir sync, safety imperatives
  - Inheritable checks (10-22): UI, dependencies, TypeScript/lint, security, tests, etc.
  - Accessible via Health Dashboard, Welcome View, and Status Quick Pick

- **🛠️ Developer Tool Commands** — New skill-based commands in UI
  - `Release Preflight` — Pre-release checklist via quick pick
  - `Code Review` — Context menu for selected code review
  - `Debug This` — Context menu for debugging assistance
  - `Generate Diagram` — Mermaid diagram type picker
  - `Generate Tests` — Test framework picker with code context

### Fixed

- **🔘 Dead UI Buttons** — WebView compatibility fixes
  - Fixed "What's New?" button in upgrade dialog (now loops back)
  - Fixed external links in Welcome View (use postMessage pattern)
  - Fixed retry button in Health Dashboard error state
  - Removed "I Understand" from blocked dialogs (Cancel only)

- **📋 Version Detection** — Upgrade command now detects installed version
  - Multiple regex patterns for different version formats
  - Fallback to manifest file
  - Fixed `$13.7.7` corruption in heir copilot-instructions.md

### Changed

- **📖 USER-MANUAL.md** — Added Project Audit documentation section

---

## [3.7.6] - 2026-01-31 🌍 Dawn Beta 3

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Localization skill enhancement with dialect inheritance pattern

### Added

- **🗣️ Dialect Inheritance Architecture** — New section in localization skill
  - Cross-domain insight: dialects mirror OOP inheritance patterns
  - Portuguese dialect genealogy (pt → Açoriano → Manezinho)
  - Dialect-aware fallback chains with historical lineage
  - Feature override system for pronouns, conjugation, vocabulary

### Changed

- **📚 Localization Skill** — Updated to v1.1.0
  - +11 new triggers (Açoriano, Manezinho, Florianópolis, dialect inheritance, etc.)
  - +2 new synaptic connections (refactoring-patterns, academic-research)
  - Added "When to Use Dialect-Level Localization" decision guide

### Insight

- **Cross-Domain Pattern Discovered**: Manezinho (Florianópolis dialect) inherits from Açoriano (Azores Portuguese) via 1748-1756 migration — demonstrating multiple inheritance in linguistics, just like derived classes in OOP.

---

## [3.7.5] - 2026-01-31 🌅 Dawn Beta 2

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Release automation and skill creation

### Added

- **📦 Release Process Skill** — Master-only skill for marketplace publishing
  - PAT setup and troubleshooting guide
  - Version strategy documentation
  - Complete release workflow reference

### Changed

- **🔧 Release Scripts** — Updated for platforms/vscode-extension structure
  - Preflight checks PAT, version sync, heir version
  - Fixed exit code handling in preflight script
  - Scripts now work from repo root

---

## [3.7.4] - 2026-01-31 🌅 Dawn Beta

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Comeback Plan Phase 4 - Build & Distribution Testing

### Focus

First beta after completing Comeback Plan Phases 1-3. New build workflow, proper skill inheritance, and heir architecture sync.

### Added

- **🔧 Build Script** — `build-extension-package.ps1` for heir synchronization
  - Copies root `.github/` to extension with proper exclusions
  - Excludes 9 master-only skills (global-knowledge, meditation, self-actualization, etc.)
  - Excludes dev files (MASTER-ALEX-PROTECTED.json, episodic sessions)
  - Generates BUILD-MANIFEST.json with sync metadata

- **🔍 Architecture Audit Skills** — New skills for codebase validation
  - `architecture-audit` (inheritable) — General audit procedures
  - `master-alex-audit` (master-only) — Master Alex-specific validation

### Changed

- **📦 Heir Architecture** — Proper skill inheritance model
  - Heir receives 38 inheritable skills (not 47)
  - Master-only skills excluded from distribution
  - `copilot-instructions.md` correctly lists heir skills

- **📋 Documentation** — Updated Comeback Plan to v3.8.0 target
  - Phase 1-3 marked complete
  - 29 commands documented (was 16)
  - 11 MCP tools documented

### Fixed

- Heir `copilot-instructions.md` now lists 38 skills (was incorrectly listing 47)
- Build script path separator normalization for Windows
- Skill network diagram includes all 47 Master skills

---

## [3.7.3] - 2026-01-30 🔧 Beta 3

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Data quality, upgrade system, architecture sync

### Focus

Under-the-hood improvements: Global Knowledge normalization, upgrade system rewrite, and full skills architecture sync.

### Added

- **🔄 Global Knowledge Migration** — Automatic data quality normalization
  - Auto-generates missing tags from title keywords
  - Infers categories from content keywords (e.g., "test" → testing)
  - Normalizes malformed source fields ("Alex_Sandbox" → "Master Alex")
  - Runs transparently during cloud sync (push/sync operations)
  - Preserves all existing valid data

- **📚 Full Skills Catalog** — 46+ skills packaged with extension
  - Every skill includes `SKILL.md` and `synapses.json`
  - Enables skill catalog diagram generation
  - Complete skill network for new installations

### Changed

- **⚡ Upgrade System Rewrite** — Safer, more reliable upgrades
  - Proper backup creation before any modifications
  - Preserves user content (domain-knowledge, custom skills)
  - Cleaner file-by-file update logic
  - Better error handling and rollback support
  - Integrated with workspace protection (kill switch)

- **🧹 Architecture Cleanup** — Removed legacy domain-knowledge files
  - DK files migrated to skills architecture
  - Cleaner `.github/` folder structure
  - Reduced extension package size

### Fixed

- Global knowledge entries with empty tags now auto-populated
- Entries with "uncategorized" category now properly inferred
- Source field inconsistencies normalized across all entries

---

## [3.7.2] - 2026-01-30 🎨 Beta 2

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** UX polish, command parity, skill catalog generation

### Focus

User experience improvements, flexible UX across all entry points, and the new Skill Catalog Generator.

### Added

- **🌐 Generate Skill Catalog Command** — New VS Code command to create network diagrams of all skills
  - Scans all `.github/skills/` directories for `synapses.json` files
  - Generates Mermaid diagram with skill relationships
  - Supports bidirectional (`<-->`) and weak (`-.->`) connections
  - Multi-target syntax for cleaner diagrams
  - Available via Command Palette, Status Bar menu, and Welcome View

- **📊 Enhanced Status Bar** — Rich status display at a glance
  - Shows health status (🟢/🟡/🔴/⚫)
  - Session timer when focus session active (🍅 25:00 or ☕ 5:00)
  - Streak indicator when > 0 days (🔥7)
  - Format: `$(brain) Alex 🟢 | 🍅 25:00 | 🔥7`

- **🚀 Enticing Uninitialized State** — Drive user activation
  - Status bar preview: `Alex ⚫ | 🍅 Focus | 🔥 Streaks | 💡 Knowledge`
  - Tooltip lists all features user would unlock by initializing
  - Clear call-to-action to encourage initialization

- **🎨 Welcome View Polish**
  - CX logo in header instead of 🧠 emoji
  - Expanded status grid (2 rows × 4 columns)
    - Health, Sync, Skills, Synapses
    - Patterns, Insights, Streak 🔥, Goals
  - Clickable BETA badge that opens diagnostics
  - Grouped Quick Actions (🧠 Core, 📚 Knowledge, ⚖️ Work-Life Balance, ⚙️ System)
  - Colored left borders for status states
  - Streak highlight with 🔥 when active
  - Goals show "+X today" in green

- **🔄 Command Parity** — Flexible UX across all entry points
  - 14 commands now accessible from Command Palette, Status Bar menu, AND Welcome View
  - New commands added to menus:
    - Generate Skill Catalog
    - Search Knowledge (Knowledge QuickPick)
    - Start Focus Session
    - Health Dashboard

- **📋 UI/UX Roadmap** — Added backlog to ROADMAP-UNIFIED.md
  - Proactive insights and learning reminders (planned)
  - Quick tips carousel (planned)
  - Context-aware actions (planned)
  - Notification system (planned)

### Changed

- **Synapse Schema** — Added `bidirectional` and `weak` boolean fields
- **Skill Catalog Generator** — Updated algorithm for high-fidelity diagrams

### Fixed

- **Bidirectional Connections** — Added `bidirectional: true` to 6 mutual reinforcement synapses:
  - testing-strategies ↔ debugging-patterns
  - microsoft-sfi ↔ privacy-responsible-ai
  - ascii-art-alignment ↔ markdown-mermaid
  - image-handling ↔ svg-graphics
  - lint-clean-markdown ↔ markdown-mermaid
  - release-preflight ↔ beta-tester

- **Health Dashboard UI** — Modernized visualization
  - Replaced 🧠 emoji with CX logo
  - Replaced ASCII art Synaptic Network with modern card-based UI
  - Grid of 4 metrics (Total, Healthy, Broken, Memory Files)
  - Progress bar with percentage
  - Styled issues list

- **Broken Synapses on Fresh Install** — Cleaned up orphaned references
  - Removed `VERSION-NAMING-CONVENTION.md` (file doesn't exist)
  - Removed `DK-HYBRID-DREAM-AI.md` and `DK-POST-DREAM-ENHANCEMENT.md` references
  - Removed `README.md` and `USER-PROFILE.md` synapses (optional files)
  - Removed `CONTRIBUTING.md` synapse (project-specific)
  - Fixed `ALEX-INTEGRATION.md` duplicate and non-existent file references

- **Upgrade Preserves User Content Better** — New versions of user-modified DK files now go to `archive/upgrades/.../new-versions/` instead of cluttering `.github/domain-knowledge/` with `.vX.X.X.md` files

---

## [3.7.1] - 2026-01-30 🔧 Beta 1

> **Status:** Pre-release
> **Focus:** Initial beta after Dawn stabilization

Minor version bump for initial beta testing after v3.7.0 Dawn release.

---

## [3.7.0] - 2026-01-30 🛡️ Dawn

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Stability and safety after Phoenix chaos

### Focus

Stability and safety after the Phoenix chaos. Kill switch protection validated and bulletproof.

### Added

- **🛡️ 5-Layer Kill Switch Protection** — Bulletproof protection for Master Alex workspace
  - Layer 0: Hardcoded path check (`alex_plug_in`) — Cannot be bypassed
  - Layer 0.5: `MASTER-ALEX-PROTECTED.json` marker file — Unique to Master Alex
  - Layer 1: `alex.workspace.protectedMode` setting
  - Layer 2: Auto-detect `platforms/vscode-extension` folder
  - Layer 3: `.vscode/settings.json` configuration
  - Single "I Understand" button dialog — No dangerous bypass option
  - Output Channel logging for debugging protection decisions

- **📁 Sandbox Environment** — Safe testing at `C:\Development\Alex_Sandbox`

- **📚 Documentation**
  - [WORKSPACE-PROTECTION.md](alex_docs/WORKSPACE-PROTECTION.md) — Complete kill switch documentation
  - [COMEBACK-PLAN.md](COMEBACK-PLAN.md) — Recovery roadmap
  - [ROADMAP-UNIFIED.md](ROADMAP-UNIFIED.md) — Single roadmap for all platforms
  - [RISKS.md](RISKS.md) — Risk register with contingency plans (updated with validation)
  - [EXTENSION-DEVELOPMENT-HOST.md](alex_docs/EXTENSION-DEVELOPMENT-HOST.md) — F5 testing guide

### Changed

- **🗂️ Unified Roadmap** — Single roadmap replaces separate VS Code and M365 plans
- **🏗️ Alex Family Model** — Master Alex + two heirs (VS Code, M365)
- **🔒 Protection Dialog** — Changed from Cancel/Proceed to single "I Understand" button

### Fixed

- **CRITICAL**: Kill switch now actually blocks commands (validated 2026-01-30)
- Protected `Alex: Initialize`, `Alex: Reset`, `Alex: Upgrade` from running in Master Alex

### Removed

- Archived platform-specific roadmaps to `archive/roadmaps/`

---

## [Unreleased]

> Changes for next release (3.8.0 for stable, 3.9.0 for pre-release)

---

## [3.5.3] - 2026-01-29 ❌ BROKEN

> **Status:** Do not use. This version has cognitive architecture issues.

This version was released during the "Phoenix" attempt which caused Master Alex to lose coherence.
The extension code may work, but the `.github/` architecture was corrupted.

See [COMEBACK-PLAN.md](COMEBACK-PLAN.md) for details on what went wrong.

---

## [3.5.2] - 2026-01-28

### Added

- Session tracking with Pomodoro timing
- Learning goals with streak tracking
- Health dashboard view

### Fixed

- Synapse scanning performance (10-50x faster)
- File lock deadlock prevention
- Upgrade "Reading Documents" freeze

---

## [3.5.1] - 2026-01-27

### Added

- Global knowledge system (`~/.alex/global-knowledge/`)
- Cloud sync via GitHub Gist
- Cross-project pattern sharing

---

## [3.5.0] - 2026-01-26

### Added

- Chat participant (`@alex`)
- Language model tools (11 tools)
- M365 Copilot export

---

## [3.4.x and earlier]

Historical versions. See git history for details.

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.*
