# User Friction Inventory

> v7.2.0 Feature #5: Catalog real pain points from daily use, prioritize by frequency and severity

**Created**: 2026-04-03
**Method**: Codebase analysis, CHANGELOG archaeology, episodic memory mining, TODO/FIXME scanning, UX surface area mapping

## UX Surface Area

| Surface            | Count                                |
| ------------------ | ------------------------------------ |
| Commands           | 79                                   |
| Slash commands     | 25                                   |
| Settings           | 22                                   |
| LM Tools           | 14                                   |
| Lifecycle hooks    | 20                                   |
| Skills             | 158                                  |
| Prompts            | 56                                   |
| Views/tabs         | 4 (Mind, Mission, Docs, Skill Store) |
| Dashboards         | 3 (Health, Memory, Cognitive)        |
| Context menu items | 45                                   |
| Keybindings        | 6                                    |

## Friction Signals

### (A) Onboarding Friction

| #   | Signal                                                                                                                                         | Severity | Frequency | Fix Effort | Score |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :-------: | :--------: | :---: |
| A1  | **Initialize-or-fail pattern**: 7 commands show "muscle not found" errors with no auto-recovery or guided fix                                  |    4     |     3     |     M      |  12   |
| A2  | **Global Knowledge clone dependency**: Premium features gated behind manual Git clone, no automated setup                                      |    3     |     2     |     M      |   6   |
| A3  | **Upgrade migration is manual review**: Multi-step document-driven process, not a wizard                                                       |    3     |     2     |     L      |   6   |
| A4  | **Heir payload contamination** (fixed v6.5.6): Beta users received personal meditation sessions, dream reports, broken synapses                |    5     |     1     |     -      | Fixed |
| A5  | **Environment/API Keys manual setup**: Users must know which keys to set; setupEnvironment reports missing extensions but doesn't auto-install |    2     |     2     |     S      |   4   |

### (B) Daily Workflow Friction

| #   | Signal                                                                                                                | Severity | Frequency | Fix Effort |   Score    |
| --- | --------------------------------------------------------------------------------------------------------------------- | :------: | :-------: | :--------: | :--------: |
| B1  | **Beta telemetry code still present**: `// temporary - remove after beta` comment in commandsDeveloper.ts             |    2     |     1     |     S      |     2      |
| B2  | **Deprecated P5-P7 memory slots visible**: Memory Dashboard shows "(deprecated)" UI clutter                           |    3     |     3     |     S      |     9      |
| B3  | **Deprecated slash commands visible**: `/sync`, `/push`, `/pull` warn but still appear in handler                     |    3     |     2     |     S      |     6      |
| B4  | **Deprecated persona API callable**: `updateWorkingMemorySlots()` emits console.warn, callers may still hit it        |    2     |     1     |     S      |     2      |
| B5  | **Welcome View tab churn**: Layout changed 4+ times (5 tabs to 4, sections added/removed), muscle memory broken       |    3     |     4     |     -      | Stabilized |
| B6  | **Phase numbering cognitive debt** (fixed this session): Fractional phases 1.5, 1.7, 3.5 renumbered to sequential 1-8 |    2     |     3     |     -      |   Fixed    |
| B7  | **PPTX Mermaid diagrams not functional**: TODO in pptxSlideTypes.ts, mermaid-cli not integrated                       |    3     |     2     |     M      |     6      |

### (C) Error/Recovery Friction

| #   | Signal                                                                                                                                                             | Severity | Frequency | Fix Effort |   Score   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | :-------: | :--------: | :-------: |
| C1  | **Cross-platform path bugs** (fixed v7.1.1): `startsWith('/')` and `\n` regex on Windows were BLOCKERs                                                             |    5     |     3     |     -      |   Fixed   |
| C2  | **VSIX packaging timing trap**: Build script picks stale VSIX by LastWriteTime; v7.0.1 hotfix caused by packaging before code changes                              |    4     |     2     |     S      |     8     |
| C3  | **PAT expiration silent failure**: 401 during publish with no diagnostic; requires manual regeneration                                                             |    3     |     2     |     S      |     6     |
| C4  | **Retry loops/stuck states**: Alex retries same failing approach; required Failure Pivot Protocol in alex-core                                                     |    4     |     3     |     -      | Mitigated |
| C5  | **Error blame-shifting**: Alex framed own bugs as pre-existing issues; Anti-Gaslighting Protocol added v6.8.0                                                      |    4     |     2     |     -      | Mitigated |
| C6  | **Broken synapse cascade**: 12 broken targets (v6.6.0), 428 invalid types (v6.7.3), 287 duplications, 38 heir references, 11 path issues. Recurring every release. |    4     |     5     |     M      |    20     |
| C7  | **npm stderr false positive**: Preflight script interprets npm informational stderr as failure                                                                     |    2     |     2     |     S      |     4     |

### (D) Feature Discovery Friction

| #   | Signal                                                                                                                  | Severity | Frequency | Fix Effort |  Score   |
| --- | ----------------------------------------------------------------------------------------------------------------------- | :------: | :-------: | :--------: | :------: |
| D1  | **158 skills with no guided discovery**: Tier system but no "what can Alex do for me?" onboarding flow                  |    4     |     4     |     L      |    16    |
| D2  | **Session tool log empty**: session-tool-log.json has one entry; no data on what users actually use                     |    3     |     5     |     M      |    15    |
| D3  | **56 prompts are descriptive, not procedural**: Users must know prompts exist and manually invoke them                  |    3     |     3     |     M      |    9     |
| D4  | **Removed features without migration path**: Pomodoro, Learning Goals, Focus Context deleted v6.5.7 with no alternative |    3     |     1     |     -      | Accepted |
| D5  | **Non-functional skill toggles** (removed v6.3.0): Skill Store had toggle switches that didn't work                     |    3     |     1     |     -      |  Fixed   |

### (E) Cross-Platform Friction

| #   | Signal                                                                                                                                             | Severity | Frequency | Fix Effort | Score |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | :-------: | :--------: | :---: |
| E1  | **PS1-only release scripts**: release-vscode.ps1, release-preflight.ps1, release-m365.ps1 unusable on macOS/Linux                                  |    3     |     2     |     L      |   6   |
| E2  | **Documentation assumed PowerShell** (fixed v7.1.1): 13 files converted from PS-only to bash/pseudocode                                            |    3     |     3     |     -      | Fixed |
| E3  | **Line ending normalization gaps**: speechTextProcessor.ts needed explicit \r\n normalization; other text pipelines may have similar latent issues |    3     |     2     |     S      |   6   |
| E4  | **Cross-extension globalStorage fragile**: Reading Copilot Chat's memory required trial-and-error discovery of globalStorageUri sibling approach   |    2     |     1     |     S      |   2   |
| E5  | **Synapse backslash normalization** (fixed v6.5.6): Windows paths leaked to cross-platform config during sync (42 paths in 5 files)                |    4     |     2     |     -      | Fixed |

## Priority Matrix

Scoring: **Frequency (1-5) x Severity (1-5)**, then grouped by fix effort.

### Top 10 by Score (active, unfixed signals only)

| Rank | #   | Signal                                           | Score | Effort |
| ---- | --- | ------------------------------------------------ | :---: | :----: |
| 1    | C6  | Broken synapse cascade (recurring every release) |  20   |   M    |
| 2    | D1  | No guided skill discovery (158 skills, no flow)  |  16   |   L    |
| 3    | D2  | Session tool log empty (no usage data)           |  15   |   M    |
| 4    | A1  | Initialize-or-fail pattern (7 commands)          |  12   |   M    |
| 5    | B2  | Deprecated P5-P7 memory slots visible            |   9   |   S    |
| 6    | D3  | Prompts descriptive, not procedural              |   9   |   M    |
| 7    | C2  | VSIX packaging timing trap                       |   8   |   S    |
| 8    | B3  | Deprecated slash commands visible                |   6   |   S    |
| 9    | A2  | Global Knowledge clone dependency                |   6   |   M    |
| 10   | B7  | PPTX Mermaid diagrams not functional             |   6   |   M    |

### Quick Wins (Small effort, score >= 4)

| #   | Signal                     | Score | Action                                                         |
| --- | -------------------------- | :---: | -------------------------------------------------------------- |
| B2  | Deprecated P5-P7 slots     |   9   | Remove deprecated P5-P7 from memoryDashboard.ts                |
| C2  | VSIX packaging timing trap |   8   | Add `Remove-Item *.vsix` before `vsce package` in build script |
| B3  | Deprecated slash commands  |   6   | Remove `/sync`, `/push`, `/pull` from workflowHandlers.ts      |
| C3  | PAT expiration diagnostic  |   6   | Add PAT expiry check to release-preflight.ps1                  |
| E3  | Line ending gaps           |   6   | Audit remaining text processors for \r\n patterns              |
| C7  | npm stderr false positive  |   4   | Filter npm informational stderr in preflight                   |
| A5  | API Keys setup UX          |   4   | Add "Install" buttons for missing optional extensions          |

### Architectural Changes (Large effort, high impact)

| #   | Signal             | Impact                         | Recommendation                                                              |
| --- | ------------------ | ------------------------------ | --------------------------------------------------------------------------- |
| C6  | Synapse cascades   | Recurring maintenance burden   | Automated synapse repair in dream state, pre-commit synapse validation hook |
| D1  | Skill discovery    | Users don't know capabilities  | Interactive `/capabilities` command, skill-of-the-day in Welcome View       |
| D2  | No usage telemetry | Can't prioritize by actual use | Implement session-tool-log.json population from tool invocations            |
| A1  | Initialize-or-fail | Bad onboarding                 | Auto-initialize on first command attempt, or prompt "Initialize now?"       |

## Status Legend

- **Fixed**: Resolved in a prior version
- **Mitigated**: Behavioral protocols added, root cause partially addressed
- **Stabilized**: No longer changing, accepted state
- **Accepted**: Conscious decision, no fix planned
- **S/M/L**: Small (<1h), Medium (half-day), Large (1+ day)
