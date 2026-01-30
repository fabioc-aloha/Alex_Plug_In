# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
