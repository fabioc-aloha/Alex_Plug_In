# v5.7.1 UI/UX Regression Checklist

**Date**: 2026-02-14
**Status**: ✅ **PRE-FLIGHT COMPLETE** — Enterprise auth removed, compiled, packaged, installed
**Purpose**: F5 sandbox verification of all v5.7.1 visual identity + UI features
**Method**: Press F5 in VS Code, open a test workspace, run through each section

---

## Pre-Flight

- [x] `npm run compile` exits 0 (**verified** — clean as of 2026-02-14)
- [x] Enterprise auth removed (commit 5ba9fe2) — 763 lines deleted, 3 commands removed
- [x] `npx @vscode/vsce package` — alex-cognitive-architecture-5.7.1.vsix created (9.84 MB)
- [x] `code --install-extension` — installed locally
- [ ] F5 launches Extension Development Host
- [ ] Extension activates — "Alex Cognitive Architecture" appears in sidebar

---

## 1. Welcome Panel — Avatar System

| #   | Test                               | Expected                                      | Pass? |
| --- | ---------------------------------- | --------------------------------------------- | ----- |
| 1.1 | Open Alex sidebar — avatar visible | 44px circular avatar with accent-color border |       |
| 1.2 | Avatar image loads (WebP)          | `<picture>` element renders WebP source       |       |
| 1.3 | Logo overlay badge                 | 20px logo icon bottom-right of avatar         |       |
| 1.4 | Click logo badge                   | Opens "Working with Alex" guide               |       |
| 1.5 | Persona-specific avatar            | Developer workspace → ALEX-CODING image       |       |
| 1.6 | Default avatar fallback            | No persona → Alex-21 image                    |       |

## 2. Welcome Panel — Rocket Tagline Bar

| #   | Test                     | Expected                                               | Pass? |
| --- | ------------------------ | ------------------------------------------------------ | ----- |
| 2.1 | Bar visible below header | Gradient bar with `🚀 Take Your CODE to New Heights`    |       |
| 2.2 | Persona-specific noun    | Researcher workspace → "RESEARCH", Academic → "THESIS" |       |
| 2.3 | Click rocket bar         | Opens Working with Alex guide                          |       |
| 2.4 | Hover effect             | Subtle background brightens on hover                   |       |

## 3. Easter Eggs — Seasonal

> **NOTE**: Test on Feb 14 — Valentine's Day egg should be active!

| #   | Test          | Expected                                     | Pass? |
| --- | ------------- | -------------------------------------------- | ----- |
| 3.1 | Feb 14 active | Avatar shows ALEX-CREATIVE, 💝 badge top-left |       |
| 3.2 | Badge bounces | Subtle 2s bounce animation on emoji          |       |
| 3.3 | Badge tooltip | Hover shows "Happy Valentine's Day!"         |       |

## 4. Easter Eggs — Project Name

> Test by opening workspace folders with specific names

| #    | Folder Name Test  | Expected Avatar              | Expected Emoji | Pass? |
| ---- | ----------------- | ---------------------------- | -------------- | ----- |
| 4.1  | "my-cookbook"     | ALEX-COOKING                 | 🍳              |       |
| 4.2  | "pet-tracker"     | ALEX-DOG-TRAINER             | 🐕              |       |
| 4.3  | "wine-cellar"     | ALEX-WINE-TASTING            | 🍷              |       |
| 4.4  | "comedy-bot"      | ALEX-COMEDY                  | 😂              |       |
| 4.5  | "podcast-app"     | ALEX-PODCAST                 | 🎙️              |       |
| 4.6  | "investment-tool" | ALEX-INVESTMENT              | 📈              |       |
| 4.7  | "legal-docs"      | ALEX-INTELLECTUAL-PROPERTY   | ⚖️              |       |
| 4.8  | "survey-builder"  | ALEX-SURVEY-DESIGN           | 📋              |       |
| 4.9  | "mentor-platform" | ALEX-MENTORING               | 🧑‍🏫              |       |
| 4.10 | "normal-project"  | No override (persona avatar) | No badge       |       |

> **Note**: Seasonal eggs (date-based) take priority over project-name eggs.

## 5. Chat Avatar — Dynamic

| #   | Test                      | Expected                                  | Pass? |
| --- | ------------------------- | ----------------------------------------- | ----- |
| 5.1 | Open @alex chat           | Chat participant icon visible             |       |
| 5.2 | Icon matches persona      | Developer → ALEX-CODING.webp as chat icon |       |
| 5.3 | Switch workspace, refresh | Icon updates to new persona's avatar      |       |

## 6. Self-Actualization — Maturity Card

| #   | Test                       | Expected                                                | Pass? |
| --- | -------------------------- | ------------------------------------------------------- | ----- |
| 6.1 | Run `Alex: Self-Actualize` | Command completes, notification shows age               |       |
| 6.2 | Age in notification        | `🧠 Age 21 (Professional)` for ~116 skills               |       |
| 6.3 | Session record created     | `.github/episodic/self-actualization-*.md` file         |       |
| 6.4 | Maturity section in record | `## 🧠 Architecture Maturity` with age, label, quote     |       |
| 6.5 | Metrics table              | Shows Cognitive Age, Skill Count, Health Status, Avatar |       |

## 7. Core Commands — Smoke Test

> Pick 3 random commands and verify they work

| #   | Command                  | Expected                                   | Pass? |
| --- | ------------------------ | ------------------------------------------ | ----- |
| 7.1 | `Alex: Dream`            | Dream report generated, notification shown |       |
| 7.2 | `Alex: Status`           | Status output in chat                      |       |
| 7.3 | `Alex: Health Dashboard` | Dashboard webview opens with health data   |       |

## 8. Existing Views — No Regression

| #   | View                          | Expected                    | Pass? |
| --- | ----------------------------- | --------------------------- | ----- |
| 8.1 | Cognitive Dashboard (sidebar) | Renders without errors      |       |
| 8.2 | Memory Architecture (tree)    | Tree nodes expandable       |       |
| 8.3 | Health Dashboard (panel)      | Opens, shows health metrics |       |

## 9. Asset Verification

| #   | Check                                     | Expected                                 | Pass? |
| --- | ----------------------------------------- | ---------------------------------------- | ----- |
| 9.1 | `assets/avatars/` contains 88 files       | 44 PNG + 44 WebP                         |       |
| 9.2 | All PERSONA_AVATAR_MAP entries have files | 16 personas × 2 formats = 32 files exist |       |
| 9.3 | `.vscodeignore` doesn't exclude avatars   | `assets/avatars/` NOT in ignore list     |       |

---

## Post-Flight

- [ ] No console errors in Extension Dev Host → Developer Tools
- [ ] Extension deactivates cleanly on close
- [ ] All passing? → Ready to publish to marketplace
- [x] v5.7.1 packaged and installed locally (2026-02-14)
- [x] Enterprise auth cleanup complete (commit 5ba9fe2)

---

## Discrepancy Notes (Fix During Sweep)

- [x] **LM tools count**: ~~Active Context says "8 LM tools" but package.json declares **12**~~ — **FIXED** in copilot-instructions.md
- [ ] **Chat avatar WebP**: If VS Code doesn't support `.webp` for `ChatParticipant.iconPath`, fall back to `.png`
- [ ] **AGE_TIERS boundary**: 2 skills → Newborn? Or Toddler? Verify edge case at exactly 3 skills

---

## Completion Log

**2026-02-14 14:30** — Pre-flight complete:
- ✅ Enterprise auth removed (enterpriseAuth.ts deleted, 3 commands removed, ~10 settings removed)
- ✅ Clean compile (zero TypeScript errors)
- ✅ VSIX packaged (9.84 MB, 425 files)
- ✅ Installed locally via `code --install-extension`
- ✅ Commits pushed to main (5ba9fe2)

**Next**: F5 sandbox testing of all UI/UX features listed above
