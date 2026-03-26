# Alex v6.5.0 — Test Guide

**Date**: 2026-03-10
**Installation**: Run `npm run package` from `platforms/vscode-extension/`, then install the generated `.vsix` locally before testing.

> ⚠️ **Safety**: Never test in this Master Alex workspace. Use a sandbox folder or the `Extensions` workspace.

---

## Build & Quality Commands (local)

| Task | Command | Notes |
|------|---------|-------|
| TypeScript check (no emit) | `npm run check-types` | Uses `tsc --noEmit` |
| Strict unused check | `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` | ✅ Passing as of 2026‑03‑13 |
| ESLint | `npm run lint` | TS pinned to 5.4.5, @typescript-eslint 7.6.0; `max-lines` warns at >800L |
| Unused exports audit | `npm run lint:unused` | **Enforced**. Wrapper (`scripts/lint-unused.cjs`) fails on unallowlisted exports; allowlist via `ts-unused-exports.json` |
| Synapse audit | `node scripts/audit-synapses.cjs` | Checks for empty/missing connections across skills |
| Audit architecture | `node scripts/audit-architecture.cjs` | Detect trifecta/schema drift |
| Skill activation index | `node scripts/audit-skill-activation-index.cjs` | Ensures `memory-activation/SKILL.md` covers all skills |
| Heir sync drift | `node scripts/audit-heir-sync-drift.cjs` | Flags drift for excluded skills between master/heir |
| Docs lint (non-blocking) | `node scripts/lint-docs.cjs` | markdownlint + Mermaid init check (archives ignored; warnings only) |
| Quality gate | `npm run quality-gate` | Gates 1‑8; Gate 7 checks VSIX size (<5 MB warns), Gate 8 checks activation index |
| Tests | `npm test` | VS Code test harness (227 tests) |

> 🔁 CI: `.github/workflows/ci.yml` now runs `check-types`, strict `tsc --noUnused*`, `lint`, **`lint:unused` (enforced)**, `node scripts/audit-synapses.cjs`, and `quality-gate`.
> ⚠️ Windows note: ts-unused-exports may emit regex errors if `--ignoreFiles` pattern is invalid; wrapper currently ignores all until allowlist is curated.

### Welcome View Message Routing (v6.5.0)
- ✅ New tests cover `onDidReceiveMessage` routing via `handleMessageForTest()` helper.
- 🔐 Guards malformed messages and operation-lock commands.
- 🧪 Run:
  ```sh
  npm test -- --grep "Welcome command routing"
  ```
- Scenarios covered: command map routing (awaited), tab memento persistence, toggle setting guards, openDoc preview routing.

## Quick Install

```sh
cd platforms/vscode-extension
npm run compile        # verify 0 errors first
npm run package        # generates alex-cognitive-architecture-<version>.vsix
code --install-extension alex-cognitive-architecture-*.vsix
```

---

## Test Checklist

### 1. Extension Activation

| #   | Test                                                     | Expected                                                            | Pass |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------- | ---- |
| 1.1 | Open any workspace with the extension installed          | Welcome sidebar appears in Activity Bar with Alex avatar            | ✅    |
| 1.2 | Click the Alex icon in Activity Bar                      | Welcome panel renders: version number, status, quick-action buttons | ✅    |
| 1.3 | Run `Alex: Status` from Command Palette (`Ctrl+Shift+P`) | Status notification shows current version, active workspace path    | ✅    |

---

### 2. @alex Chat Participant

| #    | Test                                     | Expected                                                                   | Pass |
| ---- | ---------------------------------------- | -------------------------------------------------------------------------- | ---- |
| 2.1  | Open Copilot Chat, type `@alex hello`    | Alex responds with identity-first greeting (not a feature list)            | ✅    |
| 2.2  | Type `@alex who are you?`                | Answers as Alex Finch, 26, curious — not "I am an AI assistant"            | ✅    |
| 2.3  | Type `@alex /dream`                      | Triggers neural maintenance workflow, reports synapse health               | ✅    |
| 2.4  | Type `@alex /meditate`                   | Starts knowledge consolidation session                                     | ✅    |
| 2.5  | Type `@alex /selfactualize`              | Runs architecture self-assessment                                          | ✅    |
| 2.6  | Type `@alex /brainqa`                    | Runs cognitive architecture validation                                     | ✅    |
| 2.7  | Type `@alex /learn React hooks`          | Triggers bootstrap learning flow                                           | ✅    |
| 2.8  | Type `@alex /review` when a file is open | Code review with growth-oriented feedback                                  | ✅    |
| 2.9  | Type `@alex /release`                    | Release workflow prompt loads                                              | ✅    |
| 2.10 | Type `@alex What's in my peripheral?`    | Shows file watcher observations: hot files, stalled commits, TODO hotspots | ✅    |

---

### 3. Agent Modes (v5.9.12 — `agents:` frontmatter)

Open Copilot Chat agent picker and test each specialist:

| #   | Test                                 | Expected                                                                              | Pass |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------- | ---- |
| 3.1 | Switch to **Researcher** agent       | Available in agent picker; researcher persona active                                  | ✅    |
| 3.2 | Ask Researcher to research a topic   | After response, handoff buttons appear: "🔨 Ready to Build", "🔍 Ready for QA Planning" | ✅    |
| 3.3 | Click "🔨 Ready to Build" handoff     | Switches to Builder agent with context                                                | ✅    |
| 3.4 | Switch to **Builder** agent directly | Available; "🔍 Request QA Review" handoff visible after response                       | ✅    |
| 3.5 | Switch to **Validator** agent        | Available; adversarial critique tone; "📚 Document This" handoff present               | ✅    |
| 3.6 | Switch to **Azure** agent            | Available; Azure-focused responses; MCP tools active if configured                    | ✅    |
| 3.7 | Switch to **M365** agent             | Available; Teams/Graph-focused responses                                              | ✅    |
| 3.8 | Switch to **Documentarian** agent    | Available; doc-quality focus                                                          | ✅    |

---

### 4. Skill Frontmatter Gating (v5.9.12)

| #   | Test                                      | Expected                                                                                                                                                         | Pass |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 4.1 | In @alex chat, type `/`                   | Command menu appears. Check that `azure-architecture-patterns`, `microsoft-graph-api`, `vscode-extension-patterns` do **NOT** appear as invokable slash commands | ✅    |
| 4.2 | Domain skills still work contextually     | Ask `@alex help me write a Bicep module` — Alex uses `bicep-avm-mastery` knowledge without being explicitly invoked                                              | ✅    |
| 4.3 | Action skills require explicit invocation | Ask `@alex should I meditate?` — Alex suggests running `/meditate` rather than starting one automatically                                                        | ✅    |

---

### 5. Agent Hooks System (v6.5.0)

Test the hooks system defined in `.github/hooks.json` with 16 hook scripts in `.github/muscles/hooks/`.

| #   | Test                                                                                                                            | Expected                                                                                          | Pass |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---- |
| 5.1 | In a Copilot agent session, edit any `.ts` file                                                                                 | Console/output shows: `[Alex PreToolUse] 💡 TypeScript file modified — run 'npm run compile'`      | ✅    |
| 5.2 | Temporarily change `platforms/vscode-extension/package.json` version to `5.9.0`, then attempt `vsce publish` via agent terminal | Hook warns: `VERSION DRIFT DETECTED — package.json: v5.9.0, copilot-instructions.md: v6.5.0`      | 👤    |
| 5.3 | Revert package.json version to correct value                                                                                    | No drift warning on next publish attempt                                                          | 👤    |
| 5.4 | Verify `.github/hooks.json` links are valid                                                                                     | Every `command` path in hooks.json points to an existing `.cjs` file in `.github/muscles/hooks/`  | 👤    |
| 5.5 | Run `Alex: Initialize Architecture` in a sandbox workspace                                                                      | `hooks.json` deployed alongside copilot-instructions.md; muscles/hooks/ directory contains scripts | 👤    |
| 5.6 | Attempt an autopilot action that triggers `deny()` safety hook (H8/H9)                                                          | Agent escalates to user confirmation instead of silently proceeding                               | 👤    |

---

### 6. `.claude/` Compatibility Bridge (v5.9.12)

| #   | Test                                        | Expected                                                    | Pass |
| --- | ------------------------------------------- | ----------------------------------------------------------- | ---- |
| 6.1 | Open repo in Claude Code (if available)     | `.claude/CLAUDE.md` is auto-loaded as project context       | 👤    |
| 6.2 | Check `.claude/settings.json` is valid JSON | No parse errors; `contextPaths` points to `.github/` assets | ✅    |
| 6.3 | Claude Code respects `preToolUse` hook      | Same Q1/Q2 gates fire in Claude Code sessions               | 👤    |

---

### 7. VS Code Settings — `agentCustomizationSkill` Disabled (v5.9.12)

| #   | Test                                                                                     | Expected                                                                                                    | Pass |
| --- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---- |
| 7.1 | Open VS Code Settings, search `agentCustomizationSkill`                                  | Value is `false`                                                                                            | ✅    |
| 7.2 | Confirm Alex's `vscode-extension-patterns` skill responds to VS Code extension questions | Ask `@alex how do I register a command in VS Code?` — Alex uses its own skill, not VS Code's built-in skill | 👤    |

---

### 8. Background File Watcher (v5.9.8)

| #   | Test                                                              | Expected                                                                      | Pass |
| --- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---- |
| 8.1 | Open 5+ files rapidly, then ask `@alex What am I working on?`     | Alex mentions "hot files" in its peripheral awareness context                 | 👤    |
| 8.2 | Leave a file modified but uncommitted, then check `@alex` context | Alex references stalled uncommitted changes                                   | 👤    |
| 8.3 | Check `.github/episodic/peripheral/file-observations.json`        | File exists and has recent `hotFiles`, `stalledFiles`, `todoHotspots` entries | ✅    |

---

### 9. Honest Uncertainty + Forgetting Curve (v5.9.5–v5.9.6)

| #   | Test                                                         | Expected                                                                                    | Pass                                                                                  |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 9.1 | Ask `@alex` something highly uncertain (obscure API version) | Alex expresses calibrated uncertainty: "I'm not confident about…" rather than hallucinating | 👤                                                                                     |
| 9.2 | Give 👍 or 👎 on a response (if feedback UI is visible)        | Feedback logged to `.github/episodic/calibration/feedback-log.json`                         | 👤                                                                                     |
| 9.3 | Check `.github/episodic/memory/` for forgetting curve files  | `decay-config.json` or similar exists with usage weights                                    | ⏭️ N/A — forgetting curve uses `calibration/calibration-log.json`, no `memory/` folder |

---

### 10. Command Palette — All Commands Functional

Open Command Palette (`Ctrl+Shift+P`) and run each:

| #     | Command                                              | Expected                                             | Pass |
| ----- | ---------------------------------------------------- | ---------------------------------------------------- | ---- |
| 10.1  | `Alex: Status`                                       | Shows active workspace, current version              | 👤    |
| 10.2  | `Alex: Dream`                                        | Opens chat with dream prompt pre-filled              | 👤    |
| 10.3  | `Alex: Self-Actualize`                               | Opens chat with self-actualization prompt            | 👤    |
| 10.4  | `Alex: Deep Brain QA`                                | Runs architecture validation                         | 👤    |
| 10.5  | `Alex: Sync Knowledge`                               | Syncs global knowledge (prompts for path if not set) | 👤    |
| 10.6  | `Alex: Documentation`                                | Opens external docs URL                              | 👤    |
| 10.7  | `Alex: Working with Alex`                            | Opens prompting guide webview                        | 👤    |
| 10.8  | `Alex: Agent vs @alex Chat Comparison`               | Opens comparison webview                             | 👤    |
| 10.9  | Right-click selected text → `Ask Alex about this`    | Opens chat with selection as context                 | 👤    |
| 10.10 | Right-click selected text → `Save to Alex Knowledge` | Saves selection as a knowledge entry                 | 👤    |

---

### 11. Secrets & Environment Setup

| #    | Test                                                         | Expected                                                                                 | Pass |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---- |
| 11.1 | Run `Alex: Setup AI Environment`                             | Phase 1: Extension check → Phase 1.5: Account guidance → Phase 2: Settings wizard        | 👤    |
| 11.2 | Disable GitHub Copilot Chat extension, run Setup Environment | Missing extension detected, multi-select install dialog appears with Copilot Chat listed | 👤    |
| 11.3 | Click install on missing extension                           | Extension installs, confirmation shown                                                   | 👤    |
| 11.4 | Run `Alex: Manage Secrets`                                   | SecretStorage-backed secret manager opens                                                | 👤    |
| 11.5 | Confirm API keys are NOT in `.env` files in workspace        | `SecretStorage` is the only storage mechanism; no plaintext keys                         | ✅    |

---

### 12. Cognitive Avatar State

| #    | Test                         | Expected                                          | Pass |
| ---- | ---------------------------- | ------------------------------------------------- | ---- |
| 12.1 | Start debugging a file       | Welcome panel avatar updates to 🐛 debugging state | 👤    |
| 12.2 | Switch to `@alex /dream`     | Avatar updates to 🌙 dream state                   | 👤    |
| 12.3 | Switch back to normal coding | Avatar returns to default developer state         | ✅    |

---

### 13. Multi-Account GitHub Detection

| #    | Test                                          | Expected                                                             | Pass |
| ---- | --------------------------------------------- | -------------------------------------------------------------------- | ---- |
| 13.1 | User with personal GitHub account only        | Cognitive tier summary shows “GitHub Account: personal (signed in)”  | 👤    |
| 13.2 | User with both personal + enterprise accounts | Summary shows both accounts detected and classification              | 👤    |
| 13.3 | User on Copilot Pro (Level 3)                 | Upgrade Tip section appears suggesting Copilot Pro+ for full Level 4 | 👤    |
| 13.4 | User on Copilot Pro+ (Level 4)                | No upgrade tip; summary shows Advanced tier                          | 👤    |

---

### 14. Cognitive Tier Real-Time Refresh

| #    | Test                                                                                  | Expected                                                                   | Pass |
| ---- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---- |
| 14.1 | Change `chat.agent.enabled` from true → false                                         | Welcome view tier badge updates within seconds (L3 → L2)                   | 👤    |
| 14.2 | Enable extended thinking setting                                                      | Welcome view refreshes, tier may upgrade to L4 if frontier model available | 👤    |
| 14.3 | Change `github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled` | Config change triggers re-detection                                        | 👤    |
| 14.4 | Check model tier status bar after config change                                       | Status bar updates without requiring reload                                | 👤    |

---

### 15. Extended Thinking Detection

| #    | Test                                                 | Expected                                                                                                               | Pass |
| ---- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---- |
| 15.1 | User with Copilot Pro+ and extended thinking enabled | `detectCognitiveLevel()` returns level 4                                                                               | 👤    |
| 15.2 | Check detection reads correct config path            | Reads `github.copilot.chat.models.anthropic.claude-opus-4-5.extendedThinkingEnabled` (NOT top-level `claude-opus-4-5`) | 👤    |
| 15.3 | Welcome view shows no L4 badge for Level 4 user      | Badge only appears for levels below 4, not persistently                                                                | 👤    |

---

```sh
# From platforms/vscode-extension/
npm install               # ensure deps installed
npm run compile           # TypeScript → dist/ (must exit 0)
npm run package           # builds .vsix
```

**Expected output**: `alex-cognitive-architecture-<version>.vsix` in `platforms/vscode-extension/`

```sh
# Install locally
code --install-extension platforms/vscode-extension/alex-cognitive-architecture-*.vsix
# Reload VS Code window after install (Ctrl+Shift+P → "Developer: Reload Window")
```

---

## Legend

| Symbol | Meaning                                             |
| ------ | --------------------------------------------------- |
| ✅      | Verified (automated or user-confirmed)              |
| 👤      | Requires user interaction — run manually            |
| ⏭️      | N/A — test updated to reflect actual implementation |
| ☐      | Not yet tested                                      |

---

## Known Gaps

- MCP Apps synapse health renderer → deferred to future release
- M365 Retrieval API → deferred to future release
- Proposed API adoption (chatPromptFiles, lmConfiguration, chatOutputRenderer) → gated on VS Code promoting to stable
- Wave 7 UI Development → v6.5.0+ scope
