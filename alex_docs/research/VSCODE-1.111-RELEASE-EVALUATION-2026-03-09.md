# VS Code 1.111 Release Evaluation

> **Release**: March 9, 2026 (version 1.111) — First weekly Stable cadence release
> **Evaluated by**: Alex Researcher Mode
> **Date**: 2026-03-09
> **Current engine**: `^1.109.0` in `package.json`
> **Current settings baseline**: copilot-instructions.md § VS Code Settings (1.110+)

---

## Executive Summary

VS Code 1.111 is the **first weekly Stable release**, signaling a faster feature cadence. The release is agent-centric: autopilot permissions, agent-scoped hooks, debug events snapshot, and improved chat tips. For the Alex Cognitive Architecture, **agent-scoped hooks** is the highest-impact feature — it directly enables per-agent hook specialization that our current flat `hooks.json` cannot express. Autopilot is a strategic consideration for how Alex sessions run. The remaining features are quality-of-life improvements with low adoption effort.

---

## Feature-by-Feature Evaluation

### 1. Autopilot and Agent Permissions

| Aspect | Detail |
|--------|--------|
| Setting | `chat.autopilot.enabled` |
| Status | Preview (default in Insiders, opt-in in Stable) |
| Risk | High — bypasses all approval gates including destructive operations |

#### What It Does

Three-tier permissions picker in Chat view (session-scoped):

| Level | Behavior |
|-------|----------|
| **Default Approvals** | Uses configured tool approval settings (current behavior) |
| **Bypass Approvals** | Auto-approves all tool calls, retries on errors |
| **Autopilot** | Auto-approves + auto-responds to questions + continues until `task_complete` |

Autopilot introduces a new `task_complete` tool the agent calls when it signals task completion.

#### Impact on Alex

- **Safety Imperatives tension**: Alex has I1–I7 safety imperatives enforced via PreToolUse hooks. Bypass Approvals and Autopilot **skip the manual confirmation** but hooks still fire. The PreToolUse hook in `.github/muscles/hooks/pre-tool-use.js` warns but doesn't block — this design is **compatible** with Autopilot.
- **Dream/Meditation sessions**: Autopilot could be ideal for `/dream` neural maintenance, which is largely autonomous. The agent would iterate through synapse validation, cleanup, and consolidation without user intervention.
- **Master Alex protection**: The `MASTER-ALEX-PROTECTED.json` marker check in PreToolUse outputs warnings to stdout (injected into context). Under Autopilot, these warnings would be consumed by the agent but not shown to the user interactively. This is a **gap** — the agent must respect these warnings autonomously.

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **Enable** `chat.autopilot.enabled` in `.vscode/settings.json` | P2 | Low |
| **Document** in copilot-instructions.md which tasks suit Autopilot | P3 | Low |
| **Audit** PreToolUse hook outputs — verify they're effective in non-interactive mode | P1 | Medium |
| **Consider** adding `task_complete` awareness to dream/meditation prompts | P3 | Low |

#### Adoption Decision

> **ADOPT** — Enable the setting. Do NOT default to Autopilot mode for all sessions. Recommend it specifically for dream/meditation workflows and routine maintenance. Document safety implications in `SECURITY.md`.

---

### 2. Agent-Scoped Hooks (Preview)

| Aspect | Detail |
|--------|--------|
| Setting | `chat.useCustomAgentHooks` |
| Status | Preview |
| Impact | **HIGH** — directly enhances Alex's agent architecture |

#### What It Does

Hooks can now be defined in the YAML frontmatter of `.agent.md` files. They fire **only** when that specific agent is selected or invoked via `runSubagent`. This replaces the need for global hooks that must inspect context to determine which agent is active.

#### Current State in Alex

Today, Alex uses a flat global hook system:

```
.github/hooks.json
├── SessionStart  → session-start.js (cognitive context load)
├── SessionStop   → session-stop.js  (session notes, metrics)
├── PreToolUse    → pre-tool-use.js  (safety gate I1–I7, quality gates Q1–Q2)
└── PostToolUse   → post-tool-use.js (synapse activation tracking)
```

All hooks fire regardless of which agent (Alex, Builder, Validator, etc.) is active. The hooks must determine agent context from environment or heuristics.

#### Opportunities with Agent-Scoped Hooks

| Agent | Scoped Hook Idea | Value |
|-------|-----------------|-------|
| **Validator** | PreToolUse: Extra strict checks — reject code changes during review mode | Prevents accidental edits during QA |
| **Builder** | PostToolUse: Auto-compile check after `.ts` file edits | Faster feedback loop |
| **Researcher** | SessionStart: Load research trifecta list and current knowledge gaps | Better research context |
| **Documentarian** | PostToolUse: Auto-update CHANGELOG tracking | Prevents doc drift |
| **Alex (main)** | SessionStart: Full cognitive context (current behavior) | No change needed |
| **Dream/Meditate** | SessionStart: Load synapse health baseline | Better maintenance targeting |

#### Migration Strategy

The global `hooks.json` should remain for cross-cutting concerns (safety imperatives, session metrics). Agent-scoped hooks should **augment**, not replace, global hooks.

```yaml
# Example: alex-validator.agent.md frontmatter addition
hooks:
  PreToolUse:
    command: "node .github/muscles/hooks/validator-pre-tool.js"
    description: "Block code modifications during review — read-only validation mode"
    timeout: 2000
  SessionStart:
    command: "node .github/muscles/hooks/validator-session-start.js"
    description: "Load adversarial review checklist and recent code changes"
    timeout: 3000
```

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **Enable** `chat.useCustomAgentHooks` setting | P1 | Low |
| **Design** agent-specific hook scripts for Builder + Validator | P2 | Medium |
| **Add** hooks frontmatter to `alex-validator.agent.md` first (highest value) | P2 | Medium |
| **Keep** global `hooks.json` for cross-cutting safety imperatives | — | — |
| **Update** copilot-instructions.md § VS Code Settings | P2 | Low |

#### Adoption Decision

> **ADOPT** — This is the highest-value feature in 1.111 for Alex. Enable the setting immediately. Implement agent-scoped hooks iteratively, starting with Validator (read-only enforcement) and Builder (auto-compile).

---

### 3. Debug Events Snapshot (`#debugEventsSnapshot`)

| Aspect | Detail |
|--------|--------|
| Setting | None required (built-in) |
| Status | GA |
| Impact | Medium — improves troubleshooting |

#### What It Does

Attach a snapshot of agent debug events as context in chat using `#debugEventsSnapshot`. Shows loaded customizations, token consumption, and agent behavior. The sparkle icon in Agent Debug panel auto-attaches the snapshot.

#### Impact on Alex

- **Troubleshooting agent loading**: Alex has 37 trifectas, 7 agents, 60+ instruction files. When skills or instructions aren't loading, `#debugEventsSnapshot` reveals what VS Code actually loaded vs. what's configured.
- **Token consumption visibility**: Alex's `copilot-instructions.md` is large. Debug events can show how much context budget it consumes.
- **brain-qa integration**: Could complement brain-qa validation by showing runtime loading state vs. disk state.

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **Document** usage in `WORKING-WITH-ALEX.md` or troubleshooting guide | P3 | Low |
| **Add** to brain-qa workflow as optional runtime validation step | P4 | Low |
| **Reference** in debugging-patterns.instructions.md | P3 | Low |

#### Adoption Decision

> **ADOPT** — No configuration needed. Document it as a troubleshooting tool for Alex users.

---

### 4. Chat Tip Improvements

| Aspect | Detail |
|--------|--------|
| Setting | `chat.tips.enabled` (already enabled) |
| Status | GA |
| Impact | Low — informational |

#### What It Does

- Structured onboarding: foundational tips first (Plan agent, custom agents), then quality-of-life tips
- Tips hidden when multiple editors open
- Keyboard shortcuts in tips
- New `/init` and `/fork` tips

#### Impact on Alex

- Alex already has `chat.tips.enabled=true` — no changes needed.
- The `/init` command tip could confuse Alex users if they trigger VS Code's `/init` instead of Alex's Initialize Architecture. Worth a mention in docs.
- The `/fork` command (conversation forking) is useful for Alex research sessions — explore different approaches without losing context.

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **No action** — already enabled and compatible | — | — |
| **Consider** documenting `/fork` in WORKING-WITH-ALEX.md for research workflows | P4 | Low |

#### Adoption Decision

> **MONITOR** — No action needed. Existing configuration is compatible.

---

### 5. AI CLI Profile Group in Terminal Dropdown (Experimental)

| Aspect | Detail |
|--------|--------|
| Setting | `terminal.integrated.experimental.aiProfileGrouping` |
| Status | Experimental |
| Impact | Low |

#### What It Does

Groups AI CLI terminal profiles (e.g., GitHub Copilot CLI) at the top of the terminal dropdown.

#### Impact on Alex

Minimal. Alex doesn't currently provide a terminal profile. If Alex MCP tools or CLI workflows grow, this could be useful for discoverability.

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **Skip** for now — no terminal profile to group | — | — |
| **Revisit** if MCP cognitive tools CLI is ever exposed as a terminal profile | P5 | — |

#### Adoption Decision

> **SKIP** — No current use case. Revisit if Alex provides terminal-based CLI tools.

---

### 6. Basic IntelliSense for Localized Strings in package.json

| Aspect | Detail |
|--------|--------|
| Setting | None required |
| Status | GA |
| Impact | Medium — improves DX if l10n is adopted |

#### What It Does

- Go to Definition: Jump from `%localized.string%` in package.json to its definition in `package.nls.json`
- Find All References: See all places a localized string is used across package.json and package.nls.json

#### Current State in Alex

- **No l10n currently**: The extension has no `package.nls.json` file. All strings in `package.json` are hardcoded English.
- **Audit check exists**: `audit-master-alex.ps1` Section 20 checks for l10n presence and reports `[Info] No l10n (optional)`
- **Skill exists**: `.github/skills/localization/SKILL.md` has full i18n/l10n knowledge
- **Release preflight includes it**: The localization check is listed in the preflight QuickPick

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **No action now** — l10n is not on the current roadmap | — | — |
| **Track** as a future l10n enabler when internationalization begins | P5 | — |
| **Note**: When l10n work starts, this IntelliSense will provide immediate DX value | — | — |

#### Adoption Decision

> **SKIP** — l10n is not on the current roadmap. This feature becomes valuable when it is.

---

### 7. Edit Mode Deprecation (Upcoming)

| Aspect | Detail |
|--------|--------|
| Setting | `chat.editMode.hidden` |
| Status | Deprecated in 1.110, removal in 1.125 |
| Impact | Low — assessment needed |

#### What It Does

Edit Mode is deprecated. Users can re-enable via `chat.editMode.hidden` through 1.125, after which it's fully removed.

#### Impact on Alex

- Alex doesn't reference Edit Mode in any configuration or documentation.
- Alex's agent mode is the primary interaction pattern, which is the replacement for Edit Mode.
- **No action needed** — Alex is already on the agent-first paradigm.

#### Adoption Decision

> **NO ACTION** — Alex already uses agent mode exclusively.

---

### 8. Weekly Stable Release Cadence

| Aspect | Detail |
|--------|--------|
| Impact | Medium — affects testing and compatibility strategy |

#### What It Means

VS Code is now shipping weekly Stable releases. Features arrive faster, but so do potential breaking changes.

#### Impact on Alex

- **Engine version**: Currently `^1.109.0`. This remains safe — semver caret allows all 1.x updates.
- **Feature detection**: New features may land without prior Insiders preview periods. Test more frequently.
- **Release cadence alignment**: Alex's release process should account for faster VS Code iteration. Consider testing against Insiders before major Alex releases.

#### Recommendation

| Action | Priority | Effort |
|--------|----------|--------|
| **Add** "test against VS Code Insiders" to PRE-PUBLISH-CHECKLIST.md | P3 | Low |
| **Consider** VS Code version pinning in CI if regressions occur | P4 | Medium |
| **Continue** with `^1.109.0` engine range — no change needed | — | — |

---

## Settings Update Summary

### New Settings to Enable

| Setting | Value | Where | Priority |
|---------|-------|-------|----------|
| `chat.autopilot.enabled` | `true` | `.vscode/settings.json` | P2 |
| `chat.useCustomAgentHooks` | `true` | `.vscode/settings.json` | P1 |

### Settings to Update in copilot-instructions.md

Current:
```
## VS Code Settings (1.110+)
```

Proposed update to reference 1.111 features:
```
## VS Code Settings (1.111+)

chat.autopilot.enabled=true, chat.useCustomAgentHooks=true
```

### No-Change Settings (Already Configured)

| Setting | Current Value | Status |
|---------|--------------|--------|
| `chat.tips.enabled` | `true` | Compatible with new tip system |
| `chat.hooks.enabled` | `true` | Required for agent-scoped hooks |
| `chat.agent.enabled` | `true` | No change |
| `chat.useAgentsMdFile` | `true` | No change |

---

## Adoption Roadmap

### Immediate (This Sprint)

1. **Enable** `chat.useCustomAgentHooks` in `.vscode/settings.json` and `.devcontainer/devcontainer.json`
2. **Enable** `chat.autopilot.enabled` in `.vscode/settings.json` and `.devcontainer/devcontainer.json`
3. **Update** copilot-instructions.md § VS Code Settings to reference new settings

### Short-Term (Next 1–2 Sprints)

4. **Design** Validator agent-scoped hooks (read-only enforcement during QA)
5. **Design** Builder agent-scoped hooks (auto-compile on .ts edits)
6. **Audit** PreToolUse hook behavior under Autopilot mode (non-interactive warning effectiveness)
7. **Document** `#debugEventsSnapshot` in troubleshooting docs

### Medium-Term (Backlog)

8. **Add** agent-scoped hooks to Researcher, Documentarian, Dream agents
9. **Document** Autopilot-recommended workflows (dream, meditation, routine maintenance)
10. **Add** VS Code Insiders testing step to PRE-PUBLISH-CHECKLIST.md
11. **Update** vscode-extension-patterns SKILL.md with 1.111 capabilities

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Autopilot bypasses safety warnings | Medium | High | PreToolUse hooks still fire; verify warnings are consumed by agent |
| Agent-scoped hooks conflict with global hooks | Low | Medium | Test interaction — global hooks should still fire alongside scoped hooks |
| Weekly releases introduce breaking changes | Low | Low | Engine caret range (`^1.109.0`) is safe; test against Insiders |
| Edit Mode removal affects users | Very Low | Low | Alex uses agent mode exclusively |

---

## Decision Summary

| Feature | Decision | Priority |
|---------|----------|----------|
| Autopilot & Permissions | **ADOPT** | P2 |
| Agent-Scoped Hooks | **ADOPT** | P1 |
| Debug Events Snapshot | **ADOPT** | P3 |
| Chat Tip Improvements | **MONITOR** | — |
| AI CLI Profile Group | **SKIP** | — |
| l10n IntelliSense | **SKIP** | — |
| Edit Mode Deprecation | **NO ACTION** | — |
| Weekly Release Cadence | **MONITOR** | P3 |

---

*Next review: VS Code 1.112 release (expected ~March 16, 2026)*
