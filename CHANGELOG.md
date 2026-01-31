# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
