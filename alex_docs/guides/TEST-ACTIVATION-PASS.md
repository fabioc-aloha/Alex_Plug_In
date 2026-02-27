# Extension Activation Pass — Test Guide

> **Purpose**: Structured smoke test to verify all subsystems initialize correctly after installing a new `.vsix`.
> **Run after**: Every local install (`code --install-extension alex-cognitive-architecture-*.vsix`).
> **Time**: ~5 minutes.

---

## Prerequisites

- Extension installed and VS Code reloaded.
- A workspace that has `.github/copilot-instructions.md` (Alex-initialized workspace) **or** a blank workspace (for uninitialized path).
- Output panel open: **View → Output → Alex Cognitive Architecture**.

---

## Phase 1 — Extension Present

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 1.1 | Run `code --list-extensions \| grep alex` | `fabioc-aloha.alex-cognitive-architecture` | ☐ |
| 1.2 | Extensions view shows extension with correct version (5.9.11) | Version matches `package.json` | ☐ |
| 1.3 | Activation event is `onStartupFinished` | Extension active after VS Code finishes loading (no manual trigger needed) | ☐ |

---

## Phase 2 — Status Bar

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 2.1 | Bottom-right status bar during load | `$(sync~spin) Alex loading...` briefly visible | ☐ |
| 2.2 | Status bar after load (initialized workspace) | Health icon + score, e.g. `$(heart) Alex 95%` | ☐ |
| 2.3 | Status bar after load (uninitialized workspace) | `$(info) Alex — Run Initialize` or similar graceful label | ☐ |
| 2.4 | Click status bar item | Opens health dashboard or shows quick-pick actions | ☐ |

---

## Phase 3 — Core Commands Registered

Open **Command Palette** (`Ctrl+Shift+P`) and confirm each command resolves (do not execute — just verify it appears):

| # | Command | Pass |
|---|---------|------|
| 3.1 | `Alex: Initialize Architecture` | ☐ |
| 3.2 | `Alex: Reset Architecture` | ☐ |
| 3.3 | `Alex: Dream (Neural Maintenance)` | ☐ |
| 3.4 | `Alex: Deep Brain QA` | ☐ |
| 3.5 | `Alex: Self-Actualize` | ☐ |
| 3.6 | `Alex: Meditate` | ☐ |
| 3.7 | `Alex: Upgrade Architecture` | ☐ |
| 3.8 | `Alex: Start Session` | ☐ |
| 3.9 | `Alex: End Session` | ☐ |
| 3.10 | `Alex: Open Memory Dashboard` | ☐ |
| 3.11 | `Alex: Open Health Dashboard` | ☐ |
| 3.12 | `Alex: Quick Commands` | ☐ |
| 3.13 | `Alex: Daily Briefing` | ☐ |

> **Baseline**: Total `alex.*` commands should be ≥ 80. Run in terminal to count:
> ```powershell
> # (after extension activates) — check via extension.test.ts or count manually
> ```

---

## Phase 4 — Activity Bar & Views

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 4.1 | Alex icon visible in Activity Bar | Sidebar icon present | ☐ |
| 4.2 | Click Alex icon → Welcome view loads | Avatar + persona greeting, no blank/error panel | ☐ |
| 4.3 | Welcome view shows correct persona | Matches workspace type (Developer / no workspace) | ☐ |
| 4.4 | Memory Tree view visible in sidebar | Tree list renders (may be empty for uninitialized workspace) | ☐ |
| 4.5 | No "Failed to load" error in views | Sidebar panels render without error messages | ☐ |

---

## Phase 5 — Chat Participant (@alex)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 5.1 | Open Copilot Chat, type `@alex` | `@alex` participant resolves with icon | ☐ |
| 5.2 | Type `@alex hello` and send | Alex responds (not blank, not error) | ☐ |
| 5.3 | Slash commands available | Typing `/` in Alex chat shows slash command list | ☐ |
| 5.4 | `/meditate` appears in slash commands | `/meditate` is listed | ☐ |
| 5.5 | `/dream` appears in slash commands | `/dream` is listed | ☐ |

---

## Phase 6 — Language Model Tools

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 6.1 | In agent mode, ask: `"What cognitive state are you in?"` | Alex calls `alex_cognitive_state_update` or references its state | ☐ |
| 6.2 | Ask: `"Run a synapse health check"` | `alex_cognitive_synapse_health` tool fires, returns health metrics | ☐ |
| 6.3 | Ask: `"Search my knowledge base for testing"` | `alex_cognitive_memory_search` fires, returns results or empty-graceful | ☐ |

---

## Phase 7 — Background Services

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 7.1 | Output panel (Alex channel) — no `CRITICAL` errors | No red `[Alex] CRITICAL:` lines | ☐ |
| 7.2 | Secrets manager initialized | Output: `[Alex] Secrets manager initialized` | ☐ |
| 7.3 | File watcher running (initialized workspace) | No error about watcher; modifying a `.github/` file triggers no crash | ☐ |
| 7.4 | Global Knowledge auto-setup | Output: GK setup skipped gracefully **or** GK directories confirmed | ☐ |
| 7.5 | Telemetry initialized | Output: `[Alex] telemetry initialized` or silent (telemetry opt-out respected) | ☐ |

---

## Phase 8 — Error Tolerance

Run each and verify no crash/error notification:

| # | Action | Expected | Pass |
|---|--------|----------|------|
| 8.1 | Open Alex in a workspace with **no** `.github/` folder | Graceful "not initialized" state, no error popup | ☐ |
| 8.2 | Reload window (`Ctrl+Shift+P → Developer: Reload Window`) | Extension reactivates cleanly, status bar returns | ☐ |
| 8.3 | Open Command Palette → `Alex: Quick Commands` | Quick-pick opens, no error | ☐ |

---

## Phase 9 — Cognitive State Avatar

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 9.1 | Ask Alex to "meditate" | Avatar switches to meditation state in sidebar | ☐ |
| 9.2 | After meditation completes | Avatar reverts to persona state (not stuck on meditation) | ☐ |
| 9.3 | Ask Alex to "dream" | Avatar switches to dream state | ☐ |
| 9.4 | After dream completes | Avatar reverts to persona state (not stuck on dream) | ☐ |

---

## Pass Criteria

| Result | Threshold |
|--------|-----------|
| **Full Pass** | All 40 checks green |
| **Acceptable** | ≤ 3 fails, all in Phase 6/7 (non-blocking background services) |
| **Block Release** | Any fail in Phase 1–5, or any `CRITICAL` error in Phase 7 |

---

## Known Acceptable Warnings

- `LF will be replaced by CRLF` — Git line-ending normalization, benign.
- `Failed to register current project` — GK not configured, graceful skip.
- `Global Knowledge auto-setup skipped` — expected without GitHub token.
- `[Alex] Failed to initialize GK secrets` — expected without token configured.
