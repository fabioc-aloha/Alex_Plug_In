---
name: "Persona Detection Skill"
description: "Intelligent project persona identification using priority chain detection with LLM and heuristic fallback"
applyTo: "**/personaDetection*,**/welcomeView*,**/persona*"
---

# Persona Detection Skill

**Classification**: Inheritable (VS Code heir) | Feature Knowledge
**Activation**: persona, know your customer, project type detection, welcome screen, sidebar persona
**Inheritance**: heir:vscode

---

## Purpose

Detect the most appropriate user persona for a workspace to personalize the Alex experience — sidebar branding, skill suggestions, and working memory P6 configuration.

---

## Priority Chain (Highest to Lowest)

| Priority | Source | Signal | Confidence |
|----------|--------|--------|------------|
| 1 | Focus | Active Pomodoro session topic | 0.95 |
| 2 | Goal | Stated session objective from goals.json | 0.85 |
| 3 | Phase | Current ROADMAP phase keywords | 0.75 |
| 4 | Project Goals | Learning goals from user-profile.json | 0.70 |
| 5 | Profile Cache | Saved projectPersona (< 7 days old) | cached |
| 6 | Profile + Workspace | Tech stack, expertise, file structure scoring | variable |
| 7 | Default | Developer fallback | 0.50 |

Detection stops at the first confident match. Lower priorities only run if higher ones return null.

---

## Available Personas (as of v5.6.8)

developer, academic, researcher, technical-writer, architect, data-engineer, devops, content-creator, fiction-writer, **game-developer**, project-manager, security, student, job-seeker, presenter, power-user

---

## Workspace Scoring (Priority 6 Heuristics)

Three pattern types with distinct matching logic:

| Pattern Type | Example | Match Method |
|-------------|---------|-------------|
| **Path** (contains `/`) | `src/`, `.github/workflows/` | `fs.pathExists()` — directory must actually exist |
| **Extension** (starts with `.`) | `.tex`, `.fountain` | `endsWith()` on workspace entries |
| **Filename** | `Dockerfile`, `package.json` | Exact case-insensitive Set lookup |

**Critical rule**: Never use bidirectional substring matching for workspace patterns. It causes false positives (e.g., `.github/workflows/` matching any `.github/` entry).

---

## LLM Detection Path

When `detectAndUpdateProjectPersona()` is called (initialize/upgrade):
1. Detect technologies from file structure
2. Gather project context (directory tree, README, package.json, copilot-instructions.md)
3. Send structured prompt to LLM (prefers GPT-4o > Claude Sonnet > any)
4. Parse JSON response → match to existing persona or create dynamic one
5. Save to `user-profile.json` as `projectPersona`
6. Update P6 working memory slot in copilot-instructions.md

---

## Adding New Personas

1. Add to `PERSONAS` array in `personaDetection.ts` with: id, name, bannerNoun, hook, skill, icon, accentColor, keywords, techStack, projectPatterns
2. Add persona ID to the LLM prompt's `personaId` enum
3. Add skill to `getSkillDescription()` map
4. Ensure matching skill exists in `.github/skills/`

---

## Known Pitfalls

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Every Alex project shows DevOps | `.github/` matched via substring | Use `fs.pathExists()` for path patterns (v5.6.8) |
| `.github/` triggers power-user | Noise signal in every project | Removed from power-user patterns (v5.6.8) |
| Wrong persona cached | projectPersona in user-profile.json stale | 7-day expiry + re-detect on upgrade |

## Synapses

- [.github/skills/heir-curation/SKILL.md] (High, Integrates, Forward) - "Persona detection ships to heir via inheritance"
- [.github/instructions/alex-core.instructions.md] (Medium, References, Forward) - "P6 working memory slot updated by persona detection"
- [.github/skills/release-process/SKILL.md] (Medium, Validates, Forward) - "Persona detection tested during pre-publish"
