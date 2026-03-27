# Cross-Platform Gap Analysis: macOS Heir Support

> **Audited**: 2026-03-27 | **Scope**: VS Code Extension Heir (what ships in the VSIX to end users)
>
> **Boundary**: Master Alex runs on Windows only. Release scripts, dev docs (PUBLISHING.md,
> CONTRIBUTING.md, PRE-PUBLISH-CHECKLIST.md), and `.ps1` files are Master development
> tools -- they are excluded by `.vscodeignore` and do **not** ship to heir users.
> This audit covers only code and files that run on macOS via the Marketplace VSIX.

## What Ships in the VSIX

| Category                | Ships?         | Contents                                      |
| ----------------------- | -------------- | --------------------------------------------- |
| `dist/extension.js`     | Yes            | esbuild bundle of all TypeScript source       |
| `.github/muscles/*.cjs` | Yes (13 files) | Converter/scaffold muscles invoked by Copilot |
| `.github/instructions/` | Yes            | Cognitive architecture instructions           |
| `.github/skills/`       | Yes            | Skill definitions and synapses                |
| `.github/prompts/`      | Yes            | Prompt templates                              |
| `.github/agents/`       | Yes            | Agent definitions                             |
| `assets/`               | Yes            | Icons, avatars                                |
| `.ps1` scripts          | **No**         | Excluded by `.vscodeignore` -- Master-only    |
| `src/` TypeScript       | **No**         | Bundled by esbuild into dist/                 |
| `node_modules/`         | **No**         | Bundled by esbuild into dist/                 |
| Dev docs                | **No**         | PUBLISHING.md, CONTRIBUTING.md, etc. excluded |

## Severity Legend

| Severity              | Meaning                                  |
| --------------------- | ---------------------------------------- |
| **P0 -- Blocker**     | Feature broken or degraded on macOS heir |
| **P1 -- Significant** | Wrong guidance shown to macOS users      |
| **P2 -- Minor**       | Cosmetic, dead code, non-critical path   |

## Findings Summary

| #   | Severity | Category         | File (shipped)            | Issue                                                                      |
| --- | -------- | ---------------- | ------------------------- | -------------------------------------------------------------------------- |
| 1   | **P0**   | Extension bundle | `setupGlobalKnowledge.ts` | Hardcoded `C:\` and `D:\` Windows paths in DEVELOPER_PATHS                 |
| 2   | **P1**   | Shipped muscle   | `docx-to-md.cjs`          | Install hint says `winget install pandoc` -- macOS user sees wrong command |
| 3   | **P1**   | Shipped muscle   | `md-to-html.cjs`          | Same `winget install pandoc` hint                                          |
| 4   | **P1**   | Shipped muscle   | `md-to-word.cjs`          | Same `winget install pandoc` hint                                          |
| 5   | **P1**   | Extension bundle | `setupGlobalKnowledge.ts` | Symlink error says "Try running VS Code as administrator" -- macOS-wrong   |
| 6   | **P2**   | Extension bundle | `commandsWord.ts`         | Path separator check uses both `/` and `\` -- works fine, no issue         |

## Detailed Analysis

### Finding 1 (P0): Hardcoded Windows Drive Letters in Global Knowledge Discovery

**File**: `setupGlobalKnowledge.ts` (bundled into `dist/extension.js`, runs on macOS)

```typescript
const DEVELOPER_PATHS = [
    'C:\\Development\\Alex-Global-Knowledge',  // Windows-only -- dead code on macOS
    'D:\\Development\\Alex-Global-Knowledge',  // Windows-only -- dead code on macOS
    path.join(os.homedir(), 'Development', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'dev', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'repos', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'projects', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'code', 'Alex-Global-Knowledge'),
];
```

**Impact**: On macOS, the two `C:\` / `D:\` entries silently fail (`fs.pathExists` returns false). Not harmful, but:

- Dead code wastes two `fs.pathExists` calls on every invocation
- Common macOS developer directories are **missing**: `~/Developer/` (Xcode default), `~/src/`
- Signals "Windows-first" to macOS contributors reading the source

**Fix**: Replace hardcoded drive letters with cross-platform `os.homedir()` paths. Add macOS-common directories.

```typescript
const DEVELOPER_PATHS = [
    path.join(os.homedir(), 'Development', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'Developer', 'Alex-Global-Knowledge'),  // macOS Xcode default
    path.join(os.homedir(), 'dev', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'src', 'Alex-Global-Knowledge'),        // common on macOS/Linux
    path.join(os.homedir(), 'repos', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'projects', 'Alex-Global-Knowledge'),
    path.join(os.homedir(), 'code', 'Alex-Global-Knowledge'),
];
```

### Finding 2-4 (P1): Windows-Only Install Instructions in Shipped Muscles

These three muscles ship in the VSIX and their header comments are visible to macOS Copilot users when the muscle is invoked:

| Muscle           | Line | Current Text                      |
| ---------------- | ---- | --------------------------------- |
| `docx-to-md.cjs` | 27   | `pandoc (winget install pandoc)`  |
| `md-to-html.cjs` | 24   | `pandoc (winget install pandoc)`  |
| `md-to-word.cjs` | 37   | `pandoc  (winget install pandoc)` |

**Impact**: A macOS user running these muscles sees "winget install pandoc" which does not work on macOS. They need `brew install pandoc` instead.

**Fix**: Replace with cross-platform install hint:

```
pandoc (Windows: winget install pandoc | macOS: brew install pandoc | Linux: apt install pandoc)
```

### Finding 5 (P1): Windows-Specific Error Message in Symlink Setup

**File**: `setupGlobalKnowledge.ts` (bundled into `dist/extension.js`, runs on macOS)

When symlink creation fails during Global Knowledge setup, the error message says:

> Try running VS Code as administrator.

On macOS, "administrator" is not the right guidance -- it should say "Check folder permissions."

Additionally, the symlink type comment said `junction works without admin on Windows` without noting that `'junction'` is silently ignored on macOS/Linux (Node.js handles this correctly, but the comment was misleading).

**Fix**: Use `process.platform` to show platform-appropriate error guidance. Updated comment to explain cross-platform behavior.

### Finding 6 (P2 -- No Action Needed): Path Separator Check

**File**: `commandsWord.ts` line 166

```typescript
if (value.includes("/") || value.includes("\\")) {
    return "Enter file name only, not path";
}
```

Correctly checks both Unix and Windows separators. Works on all platforms. No change needed.

## What Already Works on macOS

These shipped components are **correctly** cross-platform -- no changes needed:

| Component                      | Why It Works                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `audioPlayer.ts` (TTS)         | `process.platform` switch: win32 -> `start`, darwin -> `afplay`, linux -> `mpv/mplayer/aplay`                                                                    |
| `gamma-generator.cjs` (muscle) | `openFile()` handles win32/darwin/linux with `start`/`open`/`xdg-open`                                                                                           |
| All path handling              | Uses `path.join()`, `os.homedir()`, `os.tmpdir()` throughout                                                                                                     |
| All temp file operations       | Cross-platform via `os.tmpdir()` + cleanup handlers                                                                                                              |
| `git` / `npm` / `npx` calls    | CLI tools are cross-platform by design                                                                                                                           |
| Telemetry                      | Captures `os.platform()` as metadata -- informational only                                                                                                       |
| VS Code API calls              | Platform-abstracted by VS Code itself                                                                                                                            |
| MCP Cognitive Tools            | Pure Node.js -- fully cross-platform                                                                                                                             |
| 9 of 13 shipped muscles        | No platform-specific code (data-profile, data-ingest, dashboard-scaffold, chart-recommend, audit-token-waste, nav-inject, md-scaffold, markdown-lint, md-to-eml) |

## Action Plan

### Phase 1: Fix P0 -- Extension Source (DONE 2026-03-27)

- [x] **AP-01** Replace hardcoded `C:\` and `D:\` entries in `setupGlobalKnowledge.ts` DEVELOPER_PATHS with cross-platform `os.homedir()` paths. Added `~/Developer/` and `~/src/`.

### Phase 2: Fix P1 -- Shipped Muscle Install Hints (DONE 2026-03-27)

- [x] **AP-02** Updated `docx-to-md.cjs` pandoc install hint to include `brew` and `apt` (both Master and heir copies).
- [x] **AP-03** Updated `md-to-html.cjs` pandoc install hint to include `brew` and `apt` (both Master and heir copies).
- [x] **AP-04** Updated `md-to-word.cjs` pandoc install hint to include `brew` and `apt` (both Master and heir copies).
- [x] **AP-05** Updated `setupGlobalKnowledge.ts` symlink error message to show platform-appropriate guidance (`process.platform` switch). Updated junction comment for cross-platform clarity.

### Phase 3: Validation

- [ ] **AP-06** Test VS Code extension on macOS: install VSIX, run `Alex: Initialize`, verify Global Knowledge setup.
- [ ] **AP-07** Test TTS audio playback on macOS (`afplay` path).
- [ ] **AP-08** Test converter muscles (md-to-word, md-to-html, docx-to-md) on macOS with `brew install pandoc`.
- [ ] **AP-09** Test gamma-generator and file-opening on macOS (`open` command).

## Verified Cross-Platform (No Action Needed)

These shipped components were audited and confirmed to work correctly on macOS:

- **Settings setup** (`setupEnvironment.ts`): All VS Code settings are platform-agnostic. Extension/Copilot/agent mode recommendations, auto-approval, and extended thinking settings apply identically on macOS.
- **Initialize flow** (`initialize.ts`): Uses `path.join()`, `fs-extra`, VS Code APIs -- no platform assumptions. File permissions test, manifest creation, persona detection all use cross-platform Node.js APIs.
- **Symlink creation** (`setupGlobalKnowledge.ts`): Node.js `fs.symlink` with `'junction'` type is silently ignored on macOS/Linux (creates a regular symlink). No macOS issue.
- **Edge TTS** (`ttsService.ts`): Windows epoch and User-Agent string are API protocol requirements (not OS dependencies). WebSocket connection works identically on macOS.
- **Audio playback** (`audioPlayer.ts`): Correct `process.platform` switch -- `afplay` on macOS, `start` on Windows, `mpv/mplayer/aplay` on Linux.
- **Gamma generator** (`gamma-generator.cjs`): `open` command on macOS, `start` on Windows, `xdg-open` on Linux.
- **All path/temp handling**: `path.join()`, `os.homedir()`, `os.tmpdir()` used throughout.
- **9 of 13 shipped muscles**: Pure Node.js, no platform-specific code.

## Verdict

The VS Code heir is **macOS-ready** pending validation. All identified code issues have been fixed:

- `setupGlobalKnowledge.ts`: Removed hardcoded Windows drive letters, replaced with `os.homedir()`-based paths, added `~/Developer/` and `~/src/`. Symlink error message now shows platform-appropriate guidance.
- 6 muscle files (3 Master + 3 heir): Pandoc install hints now show Windows/macOS/Linux commands
- Environment setup (`setupEnvironment.ts`): All settings, extensions, and account checks are platform-agnostic -- no changes needed.
- Initialize flow (`initialize.ts`): File deployment, manifest creation, persona detection all use cross-platform Node.js APIs -- no changes needed.

Phase 3 validation requires a macOS machine to confirm end-to-end behavior.
