# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - v3.6.0 🌅 Dawn

> **Codename:** Dawn — A new beginning with lessons learned

### Focus

Stability and safety after the Phoenix chaos. No new features, just solid foundations.

### Added

- **🛡️ Kill Switch Protection** — 4-layer protection for Master Alex workspace
  - `alex.workspace.protectedMode` setting
  - `alex.workspace.autoProtectMasterAlex` auto-detection
  - `checkProtectionAndWarn()` utility for dangerous commands
  - Double-confirmation gates for override attempts

- **📁 Sandbox Environment** — Safe testing at `C:\Development\Alex_Sandbox`

- **📚 Documentation**
  - [COMEBACK-PLAN.md](COMEBACK-PLAN.md) — Recovery roadmap
  - [ROADMAP-UNIFIED.md](ROADMAP-UNIFIED.md) — Single roadmap for all platforms
  - [RISKS.md](RISKS.md) — Risk register with contingency plans
  - [alex_docs/EXTENSION-DEVELOPMENT-HOST.md](alex_docs/EXTENSION-DEVELOPMENT-HOST.md) — F5 testing guide

### Changed

- **🗂️ Unified Roadmap** — Single roadmap replaces separate VS Code and M365 plans
- **🏗️ Alex Family Model** — Master Alex + two heirs (VS Code, M365)

### Fixed

- Protected `Alex: Initialize`, `Alex: Reset`, `Alex: Upgrade` from running in Master Alex workspace

### Removed

- Archived platform-specific roadmaps to `archive/roadmaps/`

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

## Version Naming Convention

| Digit | Name | Example |
|-------|------|---------|
| 0 | nil | 3.0.0 |
| 1 | un | 3.1.0 |
| 2 | bi | 3.2.0 |
| 3 | tri | 3.3.0 |
| 4 | quad | 3.4.0 |
| 5 | pent | 3.5.0 |
| 6 | hex | 3.6.0 |
| 7 | sept | 3.7.0 |
| 8 | oct | 3.8.0 |
| 9 | enn | 3.9.0 |

**Example:** v3.5.3 = TRITRSEPTIUM-PENT-TRI (3.5.3)

---

*This changelog was reset on 2026-01-29 as part of Operation Rebirth (v3.6.0 Dawn).*
