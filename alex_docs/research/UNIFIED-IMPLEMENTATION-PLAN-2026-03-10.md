# Unified Implementation Plan — March 2026

> Combines: [API Dependency Review](API-DEPENDENCY-REVIEW-2026-03.md) + [VS Code 1.111 Evaluation](VSCODE-1.111-RELEASE-EVALUATION-2026-03-09.md)
> **Generated**: 2026-03-10
> **Current version**: v6.4.6 (Audit Hygiene Release)
> **Target version**: v6.5.0 (The Trust Release)

---

## Status Legend

| Status | Meaning |
|--------|---------|
| DONE | Already shipped or applied |
| READY | No blockers — can implement now |
| DEFERRED | Intentionally postponed with rationale |
| BLOCKED | Waiting on external dependency |
| MONITOR | Watch for changes, not actionable yet |

---

## P1 — Security (Immediate)

Items that address known vulnerabilities or safety gaps. Non-negotiable for a "Trust Release."

| # | Item | Source | Status | Effort | Description |
|---|------|--------|--------|--------|-------------|
| 1.1 | **Update MCP SDK `^1.0.0` → `^1.27.1`** | API Review | DONE | Low | Bumped to ^1.27.1, resolves to 1.27.1. 0 vulnerabilities. Clean compile |
| 1.2 | **Verify MCP server after SDK bump** | API Review | DONE | Medium | `npm run build` — clean compile, no API changes needed |
| 1.3 | **Run `npm audit` on MCP package** | API Review | DONE | Low | 3 transitive HIGH vulns fixed via `npm audit fix`. 0 vulnerabilities |
| 1.4 | **Autopilot safety audit (H1)** | 1.111 Eval | READY | 2d | Verify I1–I7 warnings are effective in non-interactive Autopilot mode. PreToolUse hook outputs warnings via stdout — confirm agent respects `permissionDecision: "deny"` under Autopilot. May need warn → block escalation |

---

## P2 — Safety Hooks (High Value)

Agent-scoped hooks that enforce safety boundaries and improve developer workflow.

| # | Item | Source | Status | Effort | Description |
|---|------|--------|--------|--------|-------------|
| 2.1 | **Validator read-only enforcement (H2)** | 1.111 Eval | DONE | 2d | Agent-scoped PreToolUse hook blocks write tools. validator-pre-tool-use.cjs + hooks frontmatter in alex-validator.agent.md |
| 2.2 | **Builder auto-compile (H4)** | 1.111 Eval | DONE | 2d | Agent-scoped PostToolUse hook reminds to compile after .ts edits. builder-post-tool-use.cjs + hooks frontmatter in alex-builder.agent.md |
| 2.3 | **Heir contamination guard (H8)** | 1.111 Eval | DONE | 1d | Added to pre-tool-use.cjs. Tested — fires correctly for platforms/*/.github/ edits |
| 2.4 | **I8 architecture guard (H9)** | 1.111 Eval | DONE | 1d | Added to pre-tool-use.cjs. Tested — fires correctly for src/ importing .github/ paths |
| 2.5 | **Prompt safety gate (H21)** | 1.111 Eval | DONE | 1d | Global UserPromptSubmit hook scans for secrets and I1 violations. prompt-safety-gate.cjs registered in hooks.json |
| 2.6 | **SubagentStart context injection (H16)** | 1.111 Eval | DONE | 1d | Injects Active Context from copilot-instructions.md so subagents have parent session context. subagent-context.cjs registered in hooks.json |

---

## P3 — Dependency Hygiene (Low-Effort Bumps)

Simple version bumps that pick up bug fixes and minor improvements.

| # | Item | Source | Status | Effort | Description |
|---|------|--------|--------|--------|-------------|
| 3.1 | **Bump `@types/vscode` → `^1.110.0`** | API Review | DONE | Low | 1.111.0 not yet published on npm; bumped to latest available 1.110.0. Compile + 241 tests pass |
| 3.2 | **Bump `ws` → `^8.19.0`** | API Review | DONE | Low | Bumped. Compile + 241 tests pass |
| 3.3 | **MCP development skill updated** | Stale Audit | DONE | — | Staleness watch + code block corruption fixed across master and 3 heirs (v1.2.0) |
| 3.4 | **Chat participant patterns skill updated** | Stale Audit | DONE | — | Validated date bumped to March 2026 (VS Code 1.111+) |

---

## P4 — Documentation & DX (Quality of Life)

Items that improve the developer experience and keep docs accurate.

| # | Item | Source | Status | Effort | Description |
|---|------|--------|--------|--------|-------------|
| 4.1 | **Document `#debugEventsSnapshot` usage** | 1.111 Eval | DONE | Low | Already documented in WORKING-WITH-ALEX.md Getting Help section |
| 4.2 | **Document `/fork` for research sessions** | 1.111 Eval | DONE | Low | Added to WORKING-WITH-ALEX.md Getting Help section |
| 4.3 | **Document Autopilot workflows (Stretch #6)** | 1.111 Eval | READY | 1d | Recommend Autopilot for dream/meditation/routine maintenance. Safety implications in SECURITY.md |
| 4.4 | **Update vscode-extension-patterns SKILL (Stretch #7)** | 1.111 Eval | READY | 1d | Add 1.111 capabilities (hooks, autopilot, debug events snapshot) |
| 4.5 | **`/create-*` skill generation guide (Core #5)** | Roadmap | READY | 1d | Document `/create-skill`, `/create-instruction`, etc. for trifecta generation from chat |

---

## P5 — Medium-Value Hooks (Workflow Improvements)

Hooks that improve workflow efficiency. Good candidates for iterative implementation.

| # | Item | Source | Status | Effort | Description |
|---|------|--------|--------|--------|-------------|
| 5.1 | **Validator session start (H3)** | 1.111 Eval | READY | 0.5d | Load adversarial checklist + recent changes summary on Validator agent start |
| 5.2 | **Researcher session start (H5)** | 1.111 Eval | READY | 0.5d | Load knowledge gaps + research trifecta context on Researcher agent start |
| 5.3 | **Documentarian post-tool (H6)** | 1.111 Eval | READY | 1d | Track file changes for auto-CHANGELOG suggestions |
| 5.4 | **Targeted test runner (H12)** | 1.111 Eval | READY | 1d | After `.ts` edits to files with `.test.ts` siblings, auto-run the affected test file |
| 5.5 | **Auto-commit suggestion (H14)** | 1.111 Eval | READY | 0.5d | If >5 files modified and no commit in session, use `decision: "block"` on Stop to suggest commit |
| 5.6 | **Decision journal (H18)** | 1.111 Eval | READY | 1d | On long sessions (>30 min), extract key decisions to `session-decisions.json` |
| 5.7 | **Research continuity (H20)** | 1.111 Eval | READY | 0.5d | Save unanswered questions and partial findings on Researcher Stop |
| 5.8 | **PreCompact state preservation (H22)** | 1.111 Eval | READY | 0.5d | Before context compaction, save active decisions and progress to prevent knowledge loss |

---

## P6 — Low-Priority / Deferred

Items with limited immediate value or edge-case coverage.

| # | Item | Source | Status | Effort | Rationale |
|---|------|--------|--------|--------|-----------|
| 6.1 | **Dream session start (H7)** | 1.111 Eval | DEFERRED | 0.5d | Dream sessions are infrequent; global SessionStart already loads sufficient context |
| 6.2 | **Secret leak scan (H10)** | 1.111 Eval | DEFERRED | 1d | Defense-in-depth value but H21 (prompt gate) covers primary vector; hooks can't scan streamed output |
| 6.3 | **Runaway guard (H11)** | 1.111 Eval | DEFERRED | 0.5d | Edge case — H1 safety audit covers core risk. Autopilot `permissionDecision` is the primary safeguard |
| 6.4 | **Breaking change detector (H13)** | 1.111 Eval | DEFERRED | 1d | Useful but difficult to implement accurately; code review skill covers this manually |
| 6.5 | **Package size check (H15)** | 1.111 Eval | DEFERRED | 1d | Achieved 433-file VSIX with avatar removal; quality-gate.cjs already checks file inclusion |
| 6.6 | **Subagent result capture (H17)** | 1.111 Eval | DEFERRED | 0.5d | Analytics only — useful for meditation pattern analysis but low ROI |
| 6.7 | **Synapse weight update (H19)** | 1.111 Eval | DEFERRED | 0.5d | Adds write contention; meditation handles this in batch — real-time updates are premature |
| 6.8 | **WebView ThemeIcon for sidebar icons** | 1.111 Eval | DEFERRED | Medium | Could simplify icon handling but low urgency after avatar removal |
| 6.9 | **`env.isAppPortable` detection** | 1.111 Eval | DEFERRED | Low | Niche use case |

---

## MONITOR — Watch, Don't Act

Items where the ecosystem is evolving and action would be premature.

| # | Item | Source | Signal to Watch | Description |
|---|------|--------|-----------------|-------------|
| M1 | **Agent-scoped hook matchers** | 1.111 Eval | VS Code starts honoring matchers (currently parsed but ignored) | Would enable tool-name filtering without custom script logic |
| M2 | **Agent lifecycle hooks API** | Roadmap (Blocked A) | VS Code exposes agent state API (active/queued/idle) | Enables real-time agent status in Agents tab |
| M3 | **Context budget API** | Roadmap (Blocked B) | VS Code exposes `chat.contextBudget` / `countTokens()` | Enables Context Budget bar + per-skill impact measurement |
| M4 | **Weekly VS Code release cadence** | 1.111 Eval | Breaking changes in weekly Stable releases | Add "test against VS Code Insiders" to PRE-PUBLISH-CHECKLIST.md if regressions occur |
| M5 | **l10n IntelliSense** | 1.111 Eval | l10n reaches the roadmap | `package.nls.json` Go to Definition + Find All References ready when i18n starts |
| M6 | **Edge TTS endpoint stability** | API Review | Microsoft deprecation notice or Azure Speech SDK parity | Consider Azure Cognitive Services Speech SDK as stable alternative |
| M7 | **TypeScript version** | API Review | TS 6.0 or breaking changes | `^5.1.3` auto-resolves to latest 5.x; no action until major version |
| M8 | **Agent Plugins distribution format** | 1.111 Eval | Format stabilizes beyond experimental | Core to Alex agent-plugin heir |
| M9 | **Prompt/Agent hook types** | 1.111 Eval | VS Code adds `type: "prompt"` / `type: "agent"` | Enables LLM-based hooks and subagent verification without shell scripts |

---

## DONE — Already Shipped

Items from both reviews that have been completed.

| # | Item | Source | Shipped In |
|---|------|--------|------------|
| D1 | Enable `chat.autopilot.enabled` in settings | 1.111 Eval | v6.4.0 |
| D2 | Enable `chat.useCustomAgentHooks` in settings | 1.111 Eval | v6.4.0 |
| D3 | Update copilot-instructions.md § VS Code Settings to 1.111+ | 1.111 Eval | v6.4.0 |
| D4 | Fix global hooks API compliance (F1–F6) | 1.111 Eval | v6.4.5 |
| D5 | Remove deprecated avatar system (25.3 MB eliminated) | Roadmap | v6.5.0-wip |
| D6 | console.log → OutputChannel migration | Roadmap | v6.5.0-wip |
| D7 | UI theme + font WCAG compliance | Roadmap | v6.5.0-wip |
| D8 | Heir version alignment to v6.4.6 | Roadmap | v6.5.0-wip |
| D9 | MCP development skill staleness + corruption fix | Stale Audit | 2026-03-10 |
| D10 | Chat participant patterns skill date update | Stale Audit | 2026-03-10 |

---

## Implementation Sequence

Recommended order respecting dependencies and maximizing value per effort.

```
Phase 1: Security Foundation (P1)
  1.1 → 1.2 → 1.3  MCP SDK update chain (sequential — each depends on prior)
  1.4               Autopilot safety audit (parallel with MCP chain)

Phase 2: Dependency Bumps (P3) — quick wins after Phase 1
  3.1 + 3.2         @types/vscode + ws bumps (parallel, independent)

Phase 3: Safety Hooks (P2) — highest-value new work
  2.1 + 2.2         Validator + Builder agent-scoped hooks (parallel)
  2.3 + 2.4         Heir contamination + I8 architecture guards (parallel)
  2.5 + 2.6         Prompt safety + SubagentStart context (parallel)

Phase 4: Documentation (P4) — can interleave with Phase 3
  4.1 + 4.2         Debug snapshot + /fork docs (parallel, low effort)
  4.3 + 4.4 + 4.5   Autopilot docs + SKILL update + /create-* guide (parallel)

Phase 5: Workflow Hooks (P5) — if time allows in v6.5.0
  5.1 + 5.2         Validator + Researcher session starts (parallel)
  5.3 + 5.4         Documentarian tracking + test runner (parallel)
  5.5 + 5.6 + 5.7 + 5.8  Remaining workflow hooks (batch)
```

---

## Effort Summary

| Priority | Items | Total Effort | Nature |
|----------|-------|-------------|--------|
| **P1 Security** | 4 | ~3d | Version bump + validation + safety audit |
| **P2 Safety Hooks** | 6 | ~8d | New hook scripts + agent frontmatter |
| **P3 Dependency** | 2 active | ~1h | Version bumps in package.json |
| **P4 Documentation** | 5 | ~4d | Markdown docs + skill updates |
| **P5 Workflow Hooks** | 8 | ~5.5d | New hook scripts |
| **P6 Deferred** | 9 | — | Intentionally postponed |
| **Monitor** | 9 | — | Watching, not acting |
| **Done** | 10 | — | Already shipped |

**Total active work: ~20.5 days** across P1–P5. P1+P3 (~3d) should ship before publishing v6.5.0. P2+P4 form the bulk of v6.5.0 content. P5 is stretch.
