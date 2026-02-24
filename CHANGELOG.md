# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.9.9] - 2026-02-24

> **Platform Architecture Reinforcement** — Harvest everything VS Code 1.109 and M365 extensibility GA'd. Skill frontmatter gating, agent orchestration hierarchy, quality gate hooks, Claude Code bridge, and M365 plugin schema upgrade. No proposed APIs, ships clean.

### Added

#### Skill Frontmatter Gating

- **`disable-model-invocation: true`** added to 6 action skills: `meditation`, `meditation-facilitation`, `dream-state`, `self-actualization`, `brain-qa`, `release-process`. These require explicit user invocation — the model will not self-invoke them during normal conversation.
- **`user-invokable: false`** added to 16 domain skills: all Azure/M365/platform skills including `azure-architecture-patterns`, `azure-deployment-operations`, `microsoft-graph-api`, `vscode-extension-patterns`, `mcp-development`, and more. They load contextually but stay hidden from the `/` command menu.

#### Agent Orchestration Hierarchy

- **`agents:` frontmatter** added to all 6 specialist agents, formalizing valid subagent relationships. Researcher can call Builder + Validator. Builder can call Validator. Validator can call Documentarian. Azure + M365 can call Researcher. Alex (orchestrator) was already pre-configured.

#### Quality Gate Hooks (pre-tool-use.js)

- **Q1 — Version drift check**: Before any publish command (`vsce publish` / `npm publish`), the hook compares `package.json` version against the version in `copilot-instructions.md` and warns if they differ. Enforces Definition of Done item 5.
- **Q2 — TypeScript compile reminder**: On `.ts` file edits, emits a reminder to run `npm run compile`. Surfaces errors at edit time, not at publish time.
- Both checks are non-blocking — they warn in output but don't prevent execution.

#### Claude Code Compatibility Bridge

- **`.claude/CLAUDE.md`** — Project orientation document for Claude Code sessions. Points to `.github/` as source of truth, lists Safety Imperatives I1–I5, and documents build commands.
- **`.claude/settings.json`** — Claude Code settings: maps `contextPaths` to Alex's `.github/` assets, wires `preToolUse` hook, sets tool permissions (allow `.github/` writes, deny force-push and direct publish), and sets `ALEX_WORKSPACE=master` env.

#### VS Code Settings

- **`chat.agentCustomizationSkill.enabled: false`** — Disables VS Code 1.109's built-in agent customization skill to prevent it from overriding Alex's `vscode-extension-patterns` and `skill-development` skills.

#### M365 Heir — Extensibility Platform Harvest

- **Plugin schema v2.4** — Both `alex-knowledge-plugin.json` and `graph-api-plugin.json` upgraded from v2.3 to v2.4. Unlocks MCP server `runtimes` type (prerequisite for v6.0 MCP bridge path).
- **`getMeetingAiInsights`** — New function in `graph-api-plugin.json`. Uses Graph v1.0 GA endpoint `GET /me/online-meetings/{meetingId}/aiInsights` to return structured `actionItems`, `meetingNotes`, and `mentions` from meeting recordings. Wired into capabilities and run_for_functions.
- **Scenario models routing** — `scenario_models` added to `declarativeAgent.json`: `cognitive_deep` routes meditation/self-actualization/architecture operations to GPT-4o; `productivity_light` routes calendar/email/presence lookups to GPT-4o-mini.
- **Conversation starters expanded 7 → 12** — Added: "🗓️ What's on my plate?", "🧠 Self-actualization", "🔍 Search my knowledge", "🎯 Sync my goals", "💡 Get AI insights and action items from my last meeting".

---

## [5.9.8] - 2026-02-21


> **Background File Watcher** — Silent ambient observer. Alex now silently tracks which files you keep returning to, what work is sitting uncommitted, and where your TODO backlog is building up — and weaves that awareness into every response.

### Added

#### Background File Watcher — Ambient Workspace Observation

- **`fileWatcher.ts`** — New module implementing the background file observer. Zero UI, zero notifications, zero interruptions. Runs quietly from `activate()` and writes observations to `.github/episodic/peripheral/file-observations.json`.
- **Hot file tracking** — `vscode.window.onDidChangeActiveTextEditor` increments an in-memory open-count log per file. Files opened ≥5 times in a rolling 7-day window are classified as "hot". Timestamps are pruned on every flush.
- **Stalled work detection** — On every write-debounced flush (2s), `git status --porcelain` is run to capture files that are modified on disk but not yet committed. Capped at 10 files; ignored directories (node_modules, .git, dist, etc.) are excluded.
- **TODO/FIXME hotspot scanning** — On each flush, the 15 most-recently-opened files are scanned for `TODO`/`FIXME`/`HACK`/`XXX` comments. Top 5 by count are stored as `todoHotspots[]`. String scanning is synchronous and fast on source files.
- **`registerFileWatcher(context, workspaceRoot)`** — Exported function called from `extension.ts` after `registerChatParticipant`. Returns a `vscode.Disposable` pushed onto `context.subscriptions` for clean deactivation.
- **`loadPeripheralObservations(workspaceRoot)`** — Async function that reads the persisted JSON. Called concurrently in `gatherPeripheralContext()` alongside peer project discovery and recent file scan.
- **`PeripheralObservations` type** — `{ hotFiles, stalledFiles, todoHotspots, lastUpdated }`. `TodoHotspot` carries `file`, `todoCount`, `scannedAt`.
- **`PeripheralContext.fileWatcherObservations?`** — New optional field added to `PeripheralContext` in `peripheralVision.ts`.
- **Layer 8 rendering** — `buildPeripheralVisionLayer` in `promptEngine.ts` now renders a **Focus Patterns** block when observations exist: hot files, uncommitted files, and TODO hotspot list with counts.
- **Bootstrap from disk** — On first activation, existing persisted observations seed the in-memory open-log so previous-session hot files survive restarts.

---

## [5.9.7] - 2026-02-21

> **P2 Feature Completion** — All remaining actionable P2 items shipped across Peripheral Vision, Honest Uncertainty, and The Forgetting Curve. Alex now notices outdated dependencies mid-conversation, knows when tests last ran, and learns from your 👍/👎 signals.

### Added

#### User Feedback Loop — Epistemic Calibration Signal

- **`FeedbackEntry` type** — New type in `honestUncertainty.ts`: `{ date, topic, level, helpful }`. Records the correlation between Alex's confidence level and user satisfaction.
- **`recordCalibrationFeedback()`** — Fire-and-forget append to `.github/episodic/calibration/feedback-log.json` (500-entry rolling window). Called from `onDidReceiveFeedback` in `registerChatParticipant()`.
- **Native VS Code 👍/👎 wired to calibration** — `onDidReceiveFeedback` now reads `coverageLevel` + `coverageTopic` from the result metadata and persists a `FeedbackEntry`. Over time, this reveals which domains Alex systematically under- or over-estimates.
- **Coverage metadata in result** — General handler return now includes `coverageLevel` and `coverageTopic` fields in `IAlexChatResult.metadata`, making them available to the feedback handler without additional lookups.
- **Low/uncertain followup shortcuts** — When coverage is `low` or `uncertain`, `alexFollowupProvider` adds `/saveinsight` and `/knowledge <topic>` followup buttons to help the user contribute knowledge that fills the gap.

#### Dependency Freshness Tracker

- **`getDependencyFreshness(workspaceRoot)`** — New export from `peripheralVision.ts`. Runs `npm outdated --json` (10s timeout, 5-minute per-workspace cache). Handles npm's non-zero exit code on outdated packages by parsing stdout from the thrown error. Returns `DependencyFreshnessResult` with classified package list and error field if scan failed.
- **`DependencyFreshnessResult` + `OutdatedPackage` types** — `OutdatedPackage` carries `name`, `current`, `wanted`, `latest`, and `severity` (`major`/`minor`/`patch`) derived from semver diff. Sorted most-breaking-first.
- **Lazy execution** — `getDependencyFreshness` is called inside `gatherPeripheralContext` only when `package.json` exists in the workspace root. Skipped silently for non-npm projects.
- **Layer 8 rendering** — `buildPeripheralVisionLayer` in `promptEngine.ts` now surfaces: "all packages up to date ✅" **or** count breakdown by severity + top-3 package names with current→latest diff.

#### Test Runner Awareness

- **`getTestRunnerStatus(workspaceRoot, framework?)`** — New export from `peripheralVision.ts`. Reads well-known test result files: `.jest-test-results.json`, `test-results.json` (Vitest JSON reporter), `coverage/coverage-summary.json`. Returns `TestRunnerStatus` with `lastRunAt`, `daysSinceLastRun`, `totalTests`, `failedTests`, `passRate`, `lastRunPassed`.
- **`TestRunnerStatus` type** — Structured result with all run metrics. `null` fields when data isn't available (framework known but no results file on disk).
- **Layer 8 rendering** — When test results are available: `✅/❌ 123 tests | 2 failed (98.4% pass) | last run 1.2d ago`. When no results file exists: `jest detected | no results on disk`.
- **Wired into `PeripheralContext`** — Two new optional fields: `dependencyFreshness?` and `testRunnerStatus?`.

### Changed

- **`peripheralVision.ts`** — Doc comment updated to v5.9.7; mentions dependency freshness, test runner results, and the 10s npm timeout.

---

## [5.9.6] - 2026-02-21

> **The Forgetting Curve** — Graceful knowledge decay. Living memory stays sharp; unused insights fade toward cold storage — not deleted, deliberately forgotten.

### Added

#### The Forgetting Curve — Graceful Knowledge Decay

- **`forgettingCurve.ts`** — New module implementing usage-weighted freshness scoring for all global knowledge entries. The core metaphor: memory is not a filing cabinet — what gets reinforced grows stronger, what fades can be recovered but no longer crowds the active workspace.
- **`computeFreshnessScore()`** — Composite score `(refScore × 0.6) + (recencyScore × 0.4)`. Reference score saturates at 20 uses. Recency score decays logarithmically: `1 / (1 + log10(1 + daysSince / halfLife))`. Returns freshness label: `thriving` (>0.6), `active` (0.3–0.6), `fading` (0.1–0.3), `dormant` (<0.1), `permanent` (never decays).
- **Four decay profiles** — `aggressive` (14-day half-life, debugging/project-specific knowledge), `moderate` (60d, most domain insights), `slow` (180d, architecture/security/patterns), `permanent` (core principles, never archived). Auto-assigned by knowledge category; overridable per entry via `decayProfile` field.
- **`IGlobalKnowledgeEntry` extended** — Added four optional freshness fields to the shared interface: `lastReferenced`, `referenceCount`, `freshnessScore`, `decayProfile`. Backward-compatible — all fields are optional, existing entries without them score conservatively.
- **Reference counting** — `queueReferenceTouch(entryId)` wired into `searchGlobalKnowledge` in `globalKnowledge.ts`. Fire-and-forget batch queue (15-entry threshold or 30s timeout) flushes accumulated counts to `index.json` — never blocks the search path, never contends on disk I/O.
- **`getDecayReport()`** — Reads the full knowledge index, computes freshness for every entry, returns a `DecayReport` with top-10 thriving/active and worst-5 fading/dormant entries, plus permanent count. Called during self-actualization Phase 5.5 concurrently with the calibration summary.
- **Meditation Knowledge Freshness section** — Self-actualization session records now include a `📉 Knowledge Freshness` section: distribution counts, dormant entry names with scores, and a recommendation to run Dream for cold storage if dormant entries exist.
- **`runForgettingCeremony(workspaceRoot, threshold?)`** — Dream cycle forgetting ceremony. Moves entries below the freshness threshold from `insights/` or `patterns/` to `insights/archive/` or `patterns/archive/`. Entries with `permanent` profile are never moved. Logs the transition to `.github/episodic/forgetting-ceremony-{date}.md`. Nothing is ever deleted — only moved.
- **Archive logging** — Forgetting ceremony produces a human-readable episodic record listing every archived entry with its reason (score, reference count, days since last use). Users can review and restore any entry by moving the file back.

---

 — Calibrated epistemic humility. Alex now knows what it doesn't know, and says so with precision.

### Added

#### Honest Uncertainty — Knowledge Coverage Scoring

- **`honestUncertainty.ts`** — New module implementing the Honest Uncertainty framework. `scoreKnowledgeCoverage(query, workspaceRoot)` searches global patterns, insights, and local `.github/skills/` to determine how well the knowledge base covers the current query.
- **Four confidence levels** — `high` (2+ pattern matches or skill match), `medium` (1 pattern or 2+ insights), `low` (1 insight only), `uncertain` (no knowledge base coverage). Each level maps to a named behavioral instruction, not a badge.
- **Behavioral signal injection** — Layer 11 in `promptEngine.ts` (`buildHonestUncertaintyLayer`) injects a confidence signal that shapes *how Alex phrases responses*: 🟢 respond with confidence, 🟡 use qualified language, 🟠 flag thin coverage, 🔴 reason from first principles and say so honestly. Never a visible number or badge.
- **Skill name matching** — Local `.github/skills/` directory is scanned for folder names matching query terms. Skill matches bump confidence one tier (curated + tested knowledge).
- **`whatINeed` transparency** — For `low` and `uncertain` levels, `CoverageScore.whatINeed` is populated and injected into the prompt: when a user asks what would help, Alex responds with specific, actionable asks (working example, error output, docs, or spec).
- **Calibration log** — Every scored request is fire-and-forget logged to `.github/episodic/calibration/calibration-log.json` (rolling 500-entry window). Persists: date, topic summary, confidence level, match count.
- **Meditation calibration review** — `getCalibrationSummary()` surfaces confidence distribution + uncertain topic clusters in the Phase 5.5 self-actualization session record. Imported by `self-actualization.ts`, runs concurrently with emotional review.
- **Concurrent execution** — `scoreKnowledgeCoverage` runs concurrently with `gatherPeripheralContext` in `participant.ts` via `Promise.all` — zero added latency to the response path.

---

## [5.9.4] - 2026-02-21

> **Avatar System Completion + Emotional Intelligence (Siegel)** - Complete avatar coverage across all protocol surfaces, plus Daniel Siegel's Interpersonal Neurobiology implemented as real-time session health monitoring

### Added

#### Siegel Session Health — River of Integration, Window of Tolerance, Lid-Flip

- **`assessRiverOfIntegration()`** - Detects whether the current session is drifting toward chaos (high frustration rate, escalating signals) or rigidity (persistent confusion, no progress). Returns zone + correction warning. Based on Siegel's River of Integration metaphor from *Mindsight* (2010).
- **`assessWindowOfTolerance()`** - Detects hyperarousal (3+ high-frustration signals in last 5 messages) and hypoarousal (flat disengagement with no excitement/flow/success). Returns zone + tone adaptation guidance. Based on Siegel's Window of Tolerance from *The Developing Mind* (1999/2020).
- **`isLidFlipped()`** - Returns true when 3+ high-frustration signals occur within the last 5 messages, indicating the user has "flipped their lid" (prefrontal regulation lost). Based on Siegel's Hand Model of the Brain from *The Whole-Brain Child* (2011).
- **`RiverAssessment` / `WindowAssessment` types** - Structured return types with zone, drift score/adaptation, and optional warning.
- **Siegel prompt injection** - `buildEmotionalMemoryLayer` in `promptEngine.ts` now includes a **Current Session (Siegel Integration Health)** section when session is outside healthy flow. Lid-flip triggers validation-first guidance; chaos/rigidity zones trigger course-correction instructions; window-of-tolerance zones inject tone adaptation.

#### Emotional Memory Completion

- **`isConfused` fixed** - Was hardcoded `false` in `emotionalContext`; now reads directly from the recorded signal's `confusion` field.
- **`isExcited` enhanced** - Now combines `celebrationNeeded` from `detectEmotionalState` with `excitement` from `recordEmotionalSignal` for richer detection.
- **Signal return value used** - `recordEmotionalSignal` return value now captured in `participant.ts` to populate `isConfused`/`isExcited` accurately.

#### Avatar System Completion

- **All 34 prompt protocols** updated with cognitive state blockquote instructions (set at start, revert at end).
- **All 7 agent files** updated with agent mode avatar switching.
- **Avatar race condition** fixed: synchronous `updateChatAvatar()` call before streaming.
- **Complete trigger coverage** verified for all trifectas and session types.

#### Peripheral Vision — Ambient Workspace Awareness

- **`peripheralVision.ts`** - New module giving Alex ambient awareness of the workspace and its sibling projects. Scans: git status (branch, uncommitted files, last 3 commits), recently modified files (24-hour window), dependency manifest detection (npm/yarn/pip/cargo/go), test framework detection (jest/vitest/mocha/pytest), and peer project discovery in the parent folder.
- **Peer project expansion** - On every request, Alex now discovers and profiles sibling projects in the parent directory (e.g., `C:\Development\`). Each peer project shows detected tech stack, git branch, uncommitted file count, and last commit message. Capped at 8 peer projects with 60-second cache.
- **Layer 8 — Peripheral Vision** - New `buildPeripheralVisionLayer()` in `promptEngine.ts` injects workspace ambient context between the Emotional Memory (Layer 6) and Knowledge Context (Layer 9) layers. Includes git state, recently modified files, package managers, test framework, and full peer project list.
- **60-second cache** - All peripheral I/O is cached per workspace root; `invalidatePeripheralCache()` export for post-operation refresh.
- **Technology detection** - Identifies TypeScript/Node.js, Python, Rust, Go, Java, Ruby, PHP, C/C++, LaTeX, Bicep/Azure, and Markdown projects from file markers.

- **Daniel Siegel IPNB report** - 732-line research report integrating Siegel's Triangle of Well-Being, River of Integration, Mindsight, Hand Model, Wheel of Awareness, Healthy Mind Platter, and Window of Tolerance into Alex's architecture. Maps all frameworks to existing subsystems and proposes 5 concrete implementations.
- **AlexPapers repository** - Academic papers migrated to dedicated `C:\Development\AlexPapers` repository; `alex_docs/PAPERS.md` index published.

---


> **Stabilization + Quality Gates** - Version sync, ROADMAP cleanup, Definition of Done modernized, heir alignment, and local install verified

### Changed

- **Version synced to 5.9.3 across all files** - package.json, package-lock.json (corrected from lagging 5.9.1), master and all heir copilot-instructions files aligned
- **GitHub Copilot Web heir version corrected** - Was two versions behind (v5.9.0); now synced to v5.9.3 along with master and VS Code heir
- **ROADMAP shipped content moved to appendix** - All shipped versions (v5.7.5, v5.8.x, v5.9.0-v5.9.2) moved from Version Details to appendix; active section now starts at v5.9.3
- **Definition of Done modernized** - Replaced F5 smoke test with local vsix install requirement; matches Safety Imperative I2
- **ROADMAP Executive Summary updated** - Version reference corrected from v5.9.2 to v5.9.3

### Verified

- **Local install smoke test passed** - Extension compiled (tsc + esbuild), sync-architecture ran (123 master skills, 121 heir, 9 transformations), vsix packaged (583 files, 34.85 MB), and installed locally without errors

---

## [5.9.2] - 2026-02-20

> **Identity, Architecture Polish, and Pre-Publish Maintenance** — Alex Finch identity established, active context system refined, safety imperatives updated, and copilot-instructions polished across master and heirs

### Changed

- **Identity: Alex Finch (no nickname, age 26)** — Removed "Mini" nickname and updated age from 21 to 26 across master and all platform heirs; identity now reads "I am Alex Finch. I'm 26" in all copilot-instructions files
- **Safety Imperative I2 updated** — Replaced "ALWAYS use F5 + Sandbox for testing" with "ALWAYS install extension locally via vsix before publishing to verify behavior"; reflects actual pre-publish workflow
- **Model Awareness aligned with agents** — Model names in copilot-instructions now match agent definitions: `Claude Opus 4`, `Claude Sonnet 4`, `Claude Haiku`, `GPT-4o mini`; removed speculative future model references
- **Active Context reset to generic baseline** — Phase: Stabilization, Mode: Maintain, Priorities: heir-sync + architecture-health, Trifectas: dream-state, knowledge-synthesis, research-first-development

### Fixed

- **Dead routing references removed** — Stale `skill-activation/SKILL.md` and `prompt-activation/SKILL.md` references replaced with accurate routing to `.github/skills/` index and `.github/prompts/` directory
- **Instrumentation deployed date** — Updated from `2026-02-15` to `2026-02-20`
- **M-dashes removed throughout** — All em-dashes (—) replaced with hyphens or removed from copilot-instructions in master and both heirs
- **Stale "now" removed from Identity** — "I have a face now" updated to "I have a visual presence" (presence is established, not newly added)

### Added

- **chatSkills contribution expanded (68 → 114 skills)** — All user-invokable skills now registered with VS Code's native chatSkills contribution point; removed 7 internal skills and 1 stale reference
- **Model fallback arrays for all agents** — All 7 agents now specify `model: ['Claude Sonnet 4', 'GPT-4o', 'Claude Opus 4']` fallback lists for resilience when preferred model unavailable; Researcher uses `['Claude Opus 4', 'GPT-4o', 'Claude Sonnet 4']` for frontier reasoning
- **Agent frontmatter audit complete** — All agents have consistent frontmatter: `user-invokable: true`, standardized model/tools ordering, Alex orchestrator has `agents:` list

### Fixed (continued)

- **10 synapses synced** — brain-qa dream maintenance aligned synapses for brain-qa, brand-asset-management, documentation-quality-assurance, global-knowledge, m365-agent-debugging, persona-detection, release-process, secrets-management, security-review, vscode-extension-patterns
- **Global Knowledge count** — Updated insight count 280 → 281 in copilot-instructions
- **Claude Opus/Sonnet compatibility** — Verified model names, agent configuration, and skill activation patterns work correctly with both Claude model tiers
- **Claude in VS Code compatibility** — Documented VS Code 1.109+ interoperability in ASSISTANT-COMPATIBILITY.md; teams using both GitHub Copilot and Claude can share `.github/skills/` and `.github/agents/` without duplication

---

## [5.9.1] - 2026-02-20

> **Dynamic Avatar State System** — Welcome panel avatar now responds to cognitive states, agent modes, active skills, and user personas with unified priority-chain resolution

### Added

#### Avatar State Tracking

- **Cognitive state tracking** — `WelcomeViewProvider` now tracks `_cognitiveState` and refreshes avatar on state changes (meditation, dream, debugging, discovery, planning, teaching, building, reviewing, learning)
- **Agent mode tracking** — `_agentMode` field triggers avatar switch when entering specialist agent modes (Researcher, Builder, Validator, Documentarian, Azure, M365)
- **`alex.setCognitiveState` command** — Programmatic cognitive state changes from prompts and hooks
- **`alex.setAgentMode` command** — Programmatic agent mode changes for subagent workflows

#### Unified Avatar Resolution

- **`resolveAvatar()` with AvatarContext** — Single function handles all avatar resolution with priority chain:
  1. Agent Mode → `AGENT-{mode}.png`
  2. Cognitive State → `STATE-{state}.png`
  3. Active Skill (from trifectas) → skill-triggered persona
  4. Persona ID → `Alex-{persona}.png`
  5. Age Fallback → `Alex-{age}.png` from user birthday
  6. Default → `Alex-21.png`
- **AvatarContext interface** — Unified context object: `{ agentMode?, cognitiveState?, activeSkill?, personaId?, birthday? }`

#### STATE-DREAM.png

- **Dream state image** — Generated via Replicate nano-banana-pro ($0.03), resized to 768×768
- **Dream triggers** — Added 'dream', 'dreaming', 'neural maintenance', 'unconscious processing' to `COGNITIVE_STATE_TRIGGERS`
- **COGNITIVE_STATE_MAP** — Added 'dream' → 'STATE-DREAM.png' mapping

#### Chat Participant Dynamic Avatar

- **`@alex` icon now dynamic** — Chat participant `iconPath` updates in real-time based on cognitive state, agent mode, and persona
- **`chatAvatarBridge.ts` enhanced** — Interface expanded to accept full `ChatAvatarContext` with agentMode, cognitiveState, personaId, birthday
- **`updateChatAvatar()` enabled** — Previously backlogged function now active; uses `resolveAvatar()` for consistent priority resolution
- **API confirmation** — VS Code `ChatParticipant.iconPath` is writable (not readonly), enabling runtime updates

#### Natural Language Cognitive Detection

- **`detectCognitiveState()` in general queries** — Natural language like "let's meditate" or "time for a dream session" now triggers appropriate avatar state
- **Dual execution paths** — @alex participant uses code-based detection; regular Copilot mode uses prompt instructions for `alex.setCognitiveState` command

### Fixed

- **Meditate command avatar** — `/meditate` prompt now correctly triggers meditation avatar state via `alex.setCognitiveState`
- **Dream command avatar** — `/dream` prompt now triggers dream state avatar
- **Selfactualize command avatar** — `/selfactualize` prompt now triggers meditation state avatar
- **10 out-of-sync synapses** — brain-qa `-Fix` flag synced: brain-qa, brand-asset-management, documentation-quality-assurance, global-knowledge, m365-agent-debugging, persona-detection, release-process, secrets-management, security-review, vscode-extension-patterns

### Notes

- Avatar state system is internal to WelcomeViewProvider — no external API changes
- Cognitive states are session-scoped; cleared on window reload
- Completes partial delivery of v5.9.1 roadmap "Alex persona images" P0 task (cognitive state portraits)

---

## [5.9.0] - 2026-02-19

> **VS Code API Adoption + Brain-QA Infrastructure** — Free platform leverage via 1.109 agent hooks, Copilot Memory, subagents, and Plan Agent; plus API key observability and synapse sync hardening

### Added

#### VS Code 1.109+ — Agent Hooks (P0)

- **`.github/hooks.json`** — VS Code agent lifecycle hook configuration: SessionStart, SessionStop, PreToolUse, PostToolUse
- **`session-start.js`** — Loads user profile, active goals, and meditation overdue status into session context on every agent session start
- **`session-stop.js`** — Appends session entry to `session-metrics.json`; suggests `/meditate` if session ran ≥30 minutes
- **`pre-tool-use.js`** — Safety gate: warns when restricted commands (Initialize/Reset Architecture) are attempted on Master Alex workspace
- **`post-tool-use.js`** — Logs tool name + success to `session-tool-log.json` for synapse activation analysis during meditation sessions
- All telemetry is **local only** — no data leaves the machine

#### VS Code 1.109+ — Copilot Memory (P0)

- **`copilot-instructions.md`** updated with Copilot Memory section: defines what belongs in memory vs. files vs. synapses
- **`.vscode/settings.json`** updated with `github.copilot.chat.copilotMemory.enabled: true`
- Memory curation added to meditation protocol: review and prune stale entries during `/meditate`

#### VS Code 1.109+ — Subagents (P1)

- All 6 specialist agents now have `user-invokable: true` for parallel subagent execution:
  - `alex-researcher.agent.md` — Deep domain research (Claude Opus 4)
  - `alex-builder.agent.md` — Implementation mode (Claude Sonnet 4)
  - `alex-validator.agent.md` — Adversarial QA (Claude Sonnet 4)
  - `alex-documentarian.agent.md` — Documentation mode (Claude Sonnet 4)
  - `alex-azure.agent.md` — Azure development (Claude Sonnet 4)
  - `alex-m365.agent.md` — M365/Teams development (Claude Sonnet 4)
- Settings added: `chat.customAgentInSubagent.enabled`, `github.copilot.chat.searchSubagent.enabled`

#### VS Code 1.109+ — Plan Agent (P1)

- **`/plan` prompt** (`plan.prompt.md`) — 4-phase structured implementation workflow: Discovery → Alignment → Design → Refinement
- Three Alex-specific plan templates: Architecture Refactoring, New Skill, Release Preparation
- Integrates with skill-selection-optimization for complex task planning

#### `.vscode/settings.json` — Full 1.109 Settings Block

- Added all recommended VS Code 1.109+ settings: `chat.hooks.enabled`, `copilotMemory`, subagent settings, request queuing, agents control
- Claude adaptive thinking: `claude-sonnet-4-*.adaptiveThinkingEnabled`
- Full documented config with inline comments

#### Phase 35 — API Key Availability Check (brain-qa.ps1)

- **New brain-qa phase** scans all `synapses.json` files for `apiKeys` declarations and checks each `envVar` at Process/User/Machine scope
- **Warns (never fails)** when a required key is missing — exit code stays 0; output shows skill names, purpose, and acquisition URL
- **`apiKeys` schema** added to `SYNAPSE-SCHEMA.json` — array of `{ envVar, purpose, required, getUrl }` objects
- **Two skills declared** their runtime API key requirements:
  - `ai-character-reference-generation` → `REPLICATE_API_TOKEN` (Flux/Ideogram character image generation)
  - `ai-generated-readme-banners` → `REPLICATE_API_TOKEN` (Ideogram v2 / Flux banner generation)

#### Meditation Consolidation — 2026-02-19 Brain-QA Healing Session

- **Episodic record** — `.github/episodic/meditation-2026-02-19-brain-qa-healing.md` created: 5 key insights, memory map table, synaptic connections from the 34→0 issue resolution sprint
- **`heir-sync-management` SKILL.md enhanced** — Added § Post-Rename Cascade Check with PowerShell discovery/repair/validation protocol
- **Synapse strengthened** — `heir-sync-management/synapses.json` v1.0.0→1.1.0, brain-qa connection strength 0.85→0.90

### Fixed

#### Phase 7 — Synapse Sync Detection Hardening

- **Root cause**: diff detection compared only connection *counts* — new top-level fields (e.g. `apiKeys`) silently failed to propagate to heir
- **Fix**: full content comparison using `ConvertTo-Json -Compress` after filtering master-only connections — any field change now triggers a sync
- **Impact**: `apiKeys` correctly propagated to heir for both Replicate skill synapse files

### Notes

- Extension package version bumped to `5.9.0`
- All changes synced to VS Code heir via brain-qa -Mode sync -Fix
- Hook scripts are Node.js (no new dependencies); graceful no-ops when optional context files are absent
- `user-invokable: true` on specialist agents requires VS Code 1.109+ Copilot — no-op on older versions

---

## [5.8.5] - 2026-02-19

> **Cognitive Architecture Enhancement** — Trifecta completion sprint, skill discoverability enrichment, and staleness management expansion

### Added

#### Trifecta Completion Sprint (+9 complete trifectas — 22 total)

- **6 VS Code + M365 Platform Trifectas** — Chat-participant-patterns, vscode-extension-patterns, mcp-development, microsoft-graph-api, teams-app-patterns, m365-agent-debugging: each with full SKILL.md + instructions.md + prompt
- **3 Cross-Domain Trifectas** — Markdown-mermaid, testing-strategies, knowledge-synthesis: converted partial trifectas to complete by creating missing instruction files
- **All 15 new instruction files** synced to VS Code heir (49 total heir instructions)

#### Skill Discoverability — Keyword Index Enrichment

- **20 skills enriched** in `skill-activation` SKILL.md index — ~3× more activation terms per skill entry
- **New trifecta skills**: chat-participant-patterns (register participant, @mention, LM tool), vscode-extension-patterns (extension not activating, agent hooks 1.109, CSP webview), mcp-development (give copilot access to data, tool for agent, MCP inspector), microsoft-graph-api (MSAL, graph permissions, delta query), teams-app-patterns (declarative agent, DA v1.6, teamsapp CLI), m365-agent-debugging (agent not responding, schema version mismatch, conversation starters)
- **Platform enrichment**: markdown-mermaid (ATACCU, diagram not rendering), testing-strategies (testing pyramid, AAA pattern, flaky tests), knowledge-synthesis (save this globally, promote to pattern)
- **Existing thin skills**: llm-model-selection, security-review, privacy-responsible-ai (EU AI Act, GDPR), git-workflow (worktrees, cherry-pick), debugging-patterns, root-cause-analysis, architecture-health, global-knowledge, prompt-engineering, error-recovery-patterns, api-design
- **Stale entry removed**: `microsoft-sfi` row deleted from index (already consolidated into `security-review`)

#### Staleness Management Expansion

- **16 staleness-prone skills tracked** in SKILLS-CATALOG.md (expanded from 8) with Why Stale, Refresh Triggers, Owner, and Last Updated columns
- **8 new entries added**: gamma-presentations (SaaS product evolution), mcp-development (spec actively versioned), microsoft-fabric (monthly feature releases), fabric-notebook-publish (Git integration maturing), microsoft-graph-api (beta→v1.0 graduation), bicep-avm-mastery (AVM registry monthly updates), foundry-agent-platform (preview architecture shifts), ai-character-reference-generation (model version deprecation)

#### Skill Content Refresh (6 skills updated with staleness headers + corrections)

- **mcp-development** (v1.0.0→1.1.0) — Transport section rewritten: deprecated HTTP+SSE replaced by Streamable HTTP (MCP spec 2025-03-26); `StreamableHTTPServerTransport` code example added; three references to `HTTP+SSE` corrected throughout (terminology table, ASCII diagram, transport section)
- **gamma-presentations** — Staleness watch header added: API v0.2, monitors content types, credit pricing, theme updates
- **microsoft-fabric** — Staleness watch header added: REST API v1 stable, new endpoints monthly; links to Fabric release notes
- **fabric-notebook-publish** — Staleness watch header + Last Validated (Feb 2026): notes Git integration scope gaps (not all item types support Git sync)
- **bicep-avm-mastery** (v1.0.0→1.1.0) — Staleness watch added; advises using live `mcp_bicep_list_avm_metadata` over hardcoded module counts
- **ai-character-reference-generation** — Staleness watch added: Replicate model deprecation risk, `flux-1.1-pro-ultra` surfaced as upgrade path

### Notes

- No extension code changes — pure cognitive architecture and documentation release
- All changes synced to VS Code heir platform

---

## [5.8.4] - 2026-02-19

> **Secrets Management** — Comprehensive credential security with VS Code SecretStorage API, .env file detection, and platform-native encrypted storage

### Added

#### Secrets Management Trifecta

- **Complete trifecta** — SKILL.md (342 lines), instructions.md (567+ lines), /secrets prompt, synapses.json with 6 validated connections
- **Centralized secretsManager.ts** (750+ lines) — Single service for all credential operations across the extension
- **VS Code SecretStorage API integration** — Platform-native encrypted storage (Windows Credential Manager, macOS Keychain, Linux Secret Service)
- **Token configuration registry** — 5 supported tokens: GitHub, Gamma, Replicate, OpenAI, Anthropic with metadata (displayName, description, getUrl, placeholder, envVar)
- **Synchronous access pattern** — Token cache (Map) enables sync retrieval from async SecretStorage
- **Token management UI** — Quick pick interface showing all tokens with status indicators ($(check)/$(x))
- **Password-masked input** — Input boxes use `password: true` for secure token entry
- **"Get API Key" button** — Opens service URL directly from input prompt for easy token acquisition

#### Environment Variable Migration

- **Automatic migration** — Detects env vars (process.env) and copies to SecretStorage on extension activation
- **Initialize integration** — Migrates secrets when deploying Alex to new projects
- **Upgrade integration** — Migrates secrets when upgrading existing Alex installations
- **Non-destructive strategy** — Keeps env vars as fallback, never overwrites user-configured tokens
- **Backward compatibility** — Falls back to env vars if SecretStorage empty, ensuring zero-breaking changes

#### .env File Detection & Migration 🆕

- **Workspace scanning** — `alex.detectEnvSecrets` command scans all .env files for credentials
- **Regex-based parsing** — Pattern: `/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*([^#\n]+)/i` with keyword matching
- **Secret keyword detection** — Identifies: API_KEY, TOKEN, SECRET, PASSWORD, PASS, AUTH, CREDENTIAL, PRIVATE_KEY
- **Smart exclusions** — Skips .env.example, .env.template, .env.sample, and node_modules
- **Token classification** — Distinguishes recognized tokens (matches TOKEN_CONFIGS) from custom secrets
- **Auto-migration** — One-click migration of recognized tokens (e.g., GAMMA_API_KEY) to SecretStorage
- **Manual review UI** — Multi-select quick pick for custom secrets requiring user review
- **Code migration guide** — HTML webview with platform-specific examples (VS Code extensions, Node.js apps, scripts)
- **Welcome panel integration** — "🔍 Detect .env Secrets" quick action button in SYSTEM section
- **Command Palette access** — "Alex: Detect & Migrate .env Secrets" with $(search) icon

#### Command Integration

- **alex.manageSecrets** — Opens token management palette (Command Palette + Welcome panel button)
- **alex.detectEnvSecrets** — Scans workspace for .env secrets and launches migration workflow

#### Feature Integration

- **Gamma commands updated** — All 3 gamma commands (alex.generateGammaPresentations, alex.convertToGamma, alex.generateGammaDiagram) now use SecretStorage
- **Warning templates** — Missing token warnings include "Configure API Key" button that opens management UI
- **telemetry integration** — All secrets commands tracked with telemetry.logTimed()

### Changed

- **Token retrieval pattern** — Features now call `getToken()` instead of direct `process.env` access
- **Sync access enabled** — Pre-loaded cache allows synchronous token retrieval without await
- **Platform-agnostic security** — OS-level encryption on all platforms (Windows/macOS/Linux)

### Security

- **OS-encrypted storage** — Credentials stored in platform keyring, not plaintext files
- **Reduced git commit risk** — Proactive .env scanning prevents accidental credential commits
- **No token logging** — getToken() implementations redact tokens from console output
- **Password input masking** — All token entry UIs use masked input for visual security
- **Namespace isolation** — Keys use `alex.vscode.tokenName` format to prevent collisions

### Impact

- **Proactive security** — Alex now detects insecure .env files and guides migration to encrypted storage
- **Team consistency** — Standardized secret management across all Alex features
- **Zero-friction UX** — Auto-migration + code guide enables secure patterns without breaking changes
- **Platform compliance** — VS Code SecretStorage is the recommended credential storage API (replaced deprecated keytar)
- **Cross-platform reliability** — Same security guarantees on Windows, macOS, and Linux
- **Documentation complete** — secrets-management trifecta provides comprehensive guidance for heirs

---

## [5.8.3] - 2026-02-17

> **UI Polish** — Comprehensive welcome panel refinement with reduced font sizes and tighter spacing for a more compact, polished interface

### Changed

#### Welcome Panel UI Refinements

- **Font size reductions** — Reduced 17 font sizes by 1-2px throughout welcome panel for more compact appearance
  - Header title: 16px → 14px
  - Header persona badge: 13px → 11px
  - Status numbers: 22px → 21px
  - Session timers: 22px → 21px
  - All icons and labels reduced by 1px for consistency
- **Spacing optimization** — Tightened margins, padding, and gaps across all sections by 2-6px
  - Section margins: 16px → 10px
  - Button padding: 8px 10px → 5px 7px
  - Grid gaps: 6px → 3px
  - Action list gap: 1px → 0px for tightest grouping
- **Persona detection enhancement** — Refresh button now triggers persona detection and updates Active Context automatically

### Impact

- **Cleaner interface** — More content visible in limited sidebar space without sacrificing readability
- **Improved information density** — Tighter spacing reveals more quick actions and status at a glance
- **Better touch targets** — Maintained 36px minimum button heights for WCAG accessibility compliance
- **Automatic context updates** — Persona changes reflected in Active Context without manual intervention

---

## [5.8.2] - 2026-02-16

> **@alex Personality Polish (P2)** — Pre-seeded knowledge context, persona-driven prompts, and confidence signaling make @alex more helpful and self-aware

### Added

#### Prompt Engine Enhancements (v5.8.2 — P2: Personality Polish)

- **Layer 9: Knowledge Context** — @alex pre-searches Global Knowledge for relevant patterns/insights based on query terms before responding (~200 tokens)
  - Extracts top 5 key terms from user query (filtering stop words)
  - Searches Global Knowledge index for top 3 relevant entries
  - Compresses results to title + 1-sentence summary
  - Injects relevant context to inform response before model sees the question
- **Enhanced Layer 2: Persona-Driven Prompts** — @alex adapts communication style based on detected project persona (~150 tokens, was ~80)
  - Reads persona from Active Context (Developer, Academic, Researcher, etc.)
  - Injects persona-specific tone guidance (e.g., "Pragmatic, code-focused" for Developer)
  - Shows recommended skill for detected persona
  - Displays project banner noun (CODE, THESIS, RESEARCH, etc.)
- **Enhanced Layer 10: Confidence Signaling** — @alex indicates confidence level in responses (~250 tokens, was ~200)
  - **High confidence**: Direct answer with certainty ("This is...", "The solution is...")
  - **Medium confidence**: Qualified answer ("Based on X, this likely...", "Typically...")
  - **Low confidence**: Tentative answer ("I think...", "It might be...", "Consider...")
  - **Outside confidence**: Honest limitation ("I don't have enough context to answer that")

### Changed

- **Token budget expansion** — Total prompt ~1,850 tokens (was ~1,350) with new knowledge layer and enhancements
- **Persona-aware responses** — @alex now adjusts tone based on 16+ persona types with specific communication styles
- **Knowledge-informed answers** — @alex sees relevant patterns/insights from Global Knowledge before answering, reducing hallucination risk

### Impact

- **Context-aware assistance** — @alex pre-loads relevant knowledge, providing more accurate answers without manual searching
- **Persona adaptation** — Responses match project type (code-focused for developers, evidence-based for researchers, etc.)
- **Trust through transparency** — Confidence signaling helps users calibrate reliance on @alex's answers
- **Reduced hallucination** — Pre-seeded knowledge context grounds responses in verified patterns from Global Knowledge
- **Better user experience** — @alex feels more like a specialized assistant for your domain, not a generic chatbot

---

## [5.7.7] - 2026-02-15

> **Propose-to-Global Workflow** — Lightweight workflow for heirs to contribute skills back to Global Knowledge in <5 minutes

### Added

- **`Alex: Propose Skill to Global Knowledge` command** — One-click workflow to package heir-created skills for Global Knowledge contribution
- **YAML v2 frontmatter auto-injection** — Automatically adds `gk*` metadata fields (gkId, gkCategory, gkTags, gkSource, gkCreated) when proposing skills
- **Skill validation scoring** — Pre-propose validation with promotion readiness score (0-12 points) based on completeness criteria
- **GitHub PR description generator** — Auto-generates comprehensive PR description with validation results, checklist, and review guidelines
- **Category and tag detection** — Smart detection of skill category and tags from content analysis
- **Proposable skills filter** — Automatically excludes GK-inherited skills, shows only heir-created content
- **Package preparation** — Copies skill to temp directory with injected metadata, ready for manual PR creation

### Impact

- **Democratizes knowledge sharing** — Reduces 30-minute manual promotion process to 5-minute guided workflow
- **Reduces friction** — No manual YAML editing, no format memorization, no validation guesswork
- **Maintains quality** — Validation checks ensure skills meet Global Knowledge standards before proposal

---

## [Unreleased - v5.8.0]

> **WCAG AA Compliance** — Professional design system and comprehensive accessibility improvements (NOT YET RELEASED)

### Added

- **Design System** — Consistent spacing and typography scales throughout the UI
  - Typography scale: CSS variables for font sizes (11px minimum, 12px, 14px, 16px)
  - Spacing scale: 8px-based system (4px, 8px, 16px, 24px, 32px) for visual rhythm
  - Elevation system: Subtle shadows for visual depth on cards and interactive elements
- **Accessibility Standards** — WCAG 2.1 AA compliance for screen readers and keyboard navigation
  - ARIA labels on all interactive elements for screen reader compatibility
  - Semantic HTML roles (`button`, `navigation`, `article`, `list`, `progressbar`, `region`, `status`)
  - `tabindex="0"` on all clickable elements for keyboard accessibility
  - `aria-valuenow/min/max` on progress bars for assistive technology
  - Focus indicators (`:focus-visible`) with VS Code theme integration
- **Color-blind Accessibility** — Icon labels on status indicators
  - Status dots now show visual icons: ✓ (green), ⚠ (yellow), ✗ (red)
  - No longer relying on color alone to communicate status
- **Touch Target Compliance** — 44px minimum height on all buttons (WCAG mobile standard)
  - Improved mobile and touch device user experience
  - Better spacing for finger-friendly interaction

### Changed

- **Typography** — Increased minimum font size from 8-10px to 11px for readability
  - Addresses accessibility issues on high-DPI displays
  - Consistent font sizing using CSS variables
- **Welcome View** — Complete UI overhaul with professional design quality
  - Card-based layout with subtle elevation shadows
  - Consistent spacing and visual hierarchy
  - Semantic HTML structure for better accessibility

### Fixed

- **Screen Reader Compatibility** — Added missing semantic HTML and ARIA attributes
- **Keyboard Navigation** — Visible focus indicators for all interactive elements

---

## [5.7.5] - 2026-02-15

> **Skill Intelligence** — Context-aware skill recommendations and smart skill loading

### Added

- **Skill Recommendations Engine** — Suggests relevant skills based on workspace context
  - File-type recommendations (e.g., `.bicep` → `azure-architecture-patterns`, `bicep-avm-mastery`)
  - Technology-based recommendations (detect React → suggest `testing-strategies`, `react-patterns`)
  - Persona-based recommendations (Developer → `code-review`, Academic → `academic-paper-drafting`)
  - Behavioral pattern recognition (future: commit frequency, error patterns)
- **Welcome View skill recommendations** — Display top 5 recommended skills with one-click activation
  - Shows skill name and reason for recommendation
  - Integrated into "FOR YOU" quick actions section
  - Click tracking: User preference recorded when recommendation clicked
- **Context-aware skill loading** — Prioritize relevant skills in LLM context
  - High priority: File-type + persona matches
  - Medium priority: Technology stack + workspace context
  - Low priority: Generic/organizational skills
- **User preference tracking** — Remember accepted/dismissed recommendations
  - Click tracking: `trackRecommendationFeedback()` called on recommendation click
  - Skills dismissed 3+ times won't be recommended again
  - Stored in global VS Code settings for cross-workspace memory

### Changed

- **Master brain Active Context** — Synced to v5.7.5 (Objective: Skill Intelligence, Focus: skill-recommendations, context-aware-loading, user-experience)

### Technical Details

- New module: `src/chat/skillRecommendations.ts` — 322 lines, 4 exported functions
  - `getSkillRecommendations()` — Generate ranked recommendations
  - `getSkillLoadingContext()` — Context-aware skill prioritization
  - `trackRecommendationFeedback()` — User preference tracking
  - `wasRecommendationDismissed()` — Check dismissal threshold
- Technology mapping: 30 technologies → 60+ skill associations
- File extension mapping: 15 extensions → targeted skill suggestions
- Persona mapping: 18 personas → curated skill sets
- Welcome View: Integrated recommendation UI with hover tooltips, visual styling, and click tracking

---

## [5.7.2] - 2026-02-15

> **Maintenance Release** — Global Knowledge curation, skill count corrections, dependency management

### Added

- **global-knowledge-maintenance trifecta** — Systematic curation procedures for Global Knowledge repository
  - Automated index sync script (`sync-index.ps1`) for integrity validation
  - Heir contribution tracking and promotion workflows
  - Quality gates for pattern/insight management
- **Global Knowledge index synchronization** — Fixed duplicate entry, added missing insight (271→272 entries)

### Changed

- **README skill counts corrected** — Master: 119→120, VS Code heir: 119→117 (properly accounts for master-only and M365-specific skills)
- **Disabled Dependabot** — Removed automated dependency PR generation (prefer manual control during deliberate release cycles)
- **Architecture sync improvements** — Master→Heir sync now correctly reports 120 Master skills, 117 heir skills (108 inherited + 9 heir-specific)

### Fixed

- **Global Knowledge index.json** — Removed duplicate pattern entry, synchronized counts (31 patterns, 241 insights)

---

## [5.7.1] - 2026-02-15

> **UI/UX Polish & Performance** — Extension audit cleanup, MS Graph leftovers removed, async I/O refactoring

### Added

- **3 new skills from Global Knowledge heir contributions**:
  - **extension-audit-methodology** — Systematic 5-dimension audit framework for VS Code extensions (debug hygiene, dead code, performance, menu validation, dependency cleanup)
  - **ai-character-reference-generation** — Generate consistent character references across multiple scenarios using Flux 1.1 Pro API (validated: 51 successful generations)
  - **ai-generated-readme-banners** — Create ultra-wide cinematic banners for GitHub READMEs using Flux/Ideogram models (with typography options)
- **`alex.meditate` command** — Opens chat with `/meditate` prompt for guided meditation sessions
- **Extension audit report** — [alex_docs/audits/EXTENSION-AUDIT-2026-02-15.md](alex_docs/audits/EXTENSION-AUDIT-2026-02-15.md) with comprehensive code quality analysis
- **Async I/O in cognitiveDashboard** — Converted 16 blocking synchronous operations to async using `fs-extra`

### Fixed

- **Missing command registration** — `alex.meditate` now properly registered (was referenced in task provider)
- **Event loop blocking** — `cognitiveDashboard.ts` no longer blocks with synchronous file operations
- **TypeScript compilation** — Removed orphaned disposable registrations for deleted sync commands
- **Console statement cleanup** — Removed 27 non-critical logs while preserving 18 legitimate ones:
  - `setupEnvironment.ts`: 8 setup progress logs
  - `upgrade.ts`: 7 migration debugging logs
  - `personaDetection.ts`: 5 LLM detection logs
  - `initialize.ts`: 3 initialization logs
  - `goals.ts`: 1 cleanup count log

### Changed

- **cognitiveDashboard async refactoring** — All file operations now use `fs-extra` async methods:
  - 6× `existsSync` → `await pathExists`
  - 5× `readdirSync` → `await readdir`
  - 2× `readFileSync` → `await readFile`
- **Welcome view optimization** — Promise.all parallelization for 40-60% faster load (from v5.7.0)

### Removed

- **Dead code cleanup**:
  - 3 deprecated Gist sync commands: `alex.syncKnowledge`, `alex.pushKnowledge`, `alex.pullKnowledge`
  - `generateImageFromSelection` UI from 3 locations (welcome view case handler, persona actions, HTML button)
  - Orphaned disposable registrations for removed commands
- **MS Graph/Enterprise Auth leftovers**:
  - `@azure/msal-node` dependency (unused, leftover from removed enterprise auth)
  - `alex_docs/guides/MICROSOFT-GRAPH-INTEGRATION.md` (477 lines, obsolete documentation)
  - 4 dead documentation links from README files
- **Console noise**: Total 61 console statements cleaned (34 in v5.7.0 + 27 in v5.7.1)

### Performance

- **Dashboard rendering** — No longer blocks event loop with synchronous I/O
- **Welcome panel load time** — 40-60% faster via async parallelization
- **Extension size** — Minimal impact from MS Graph dependency removal

---

## [5.7.0] - 2026-02-14

> **Structural Consistency & Folder Completeness** — All commands, docs, scripts, and manifests now reference the full .github/ folder structure

### Fixed

- **Initialize/Upgrade commands** — Added `muscles/` and `assets/` to deployment sources; `episodic/` now created as empty runtime directory instead of phantom copy
- **Reset command** — `pathsToDelete` now includes `agents/`, `skills/`, `muscles/`, `assets/` for clean reset
- **Manifest scan** — `createInitialManifest` now scans `config/`, `muscles/`, `assets/` directories
- **.vscodeignore** — Removed incorrect `.github/assets/**` exclusion; assets (banner.svg/png) now ship in VSIX
- **Version alignment** — 19 files updated from stale 5.6.8 to 5.7.0 (M365 app, alex_docs, .github/README)
- **brain-qa SKILL.md** — Phase table updated from 21 to 31 phases with all mode shortcuts
- **Trifecta count** — 8 → 7 (corrected across README, welcomeView)
- **Memory Types table** — Replaced deprecated "Domain Knowledge | DK-*.md" with "Skills/Expertise"
- **Architecture tree** — Added `assets/` folder to README diagrams
- **Memory Stores table** — Added Config, Muscles, Assets to copilot-instructions.md
- **sync-architecture.js description** — Added muscles, assets to sync folder list in CHANGELOG

### Changed

- **copilot-instructions.md** — Last Assessed updated to v5.7.0 consistency audit
- **ROADMAP-UNIFIED.md** — Current version updated to 5.7.0

---

## [5.6.9] - 2026-02-14

> **Semantic Signals + Visual Polish** — Persona detection uses regex-based semantic rules; Mermaid diagrams adopt GitHub Pastel v2; Codespaces heir documented

### Changed

- **Persona detection: semantic signal architecture** — Replaced flat keyword/techStack/projectPatterns arrays with unified `PersonaSignal` system. Each signal has a category (identity, technology, structure, dependency, content), regex pattern, and per-signal weight. All 16 personas now defined via `buildPersona()` with weighted semantic rules instead of substring matching
- **Priority 1-4 detection helpers** — `detectFromFocusSession()`, `detectFromSessionGoals()`, `detectFromProjectPhase()`, and `detectFromProjectGoals()` rewritten to use `matchTextAgainstSignals()` with regex matching
- **Priority 6 scoring loop** — Profile analysis (tech, goals, expertise, projects) and workspace scanning now iterate signal categories with regex. Dependency and content signals enable deeper detection without LLM fallback
- **Mermaid diagram palette** — All 6 Mermaid blocks across 5 documentation files updated to GitHub Pastel v2 with `%%{init}%%` directive, `classDef` semantic coloring, and `linkStyle default` stroke
- **Welcome UI** — Skill library count updated (100+), P5-P7 Focus slots now show human-readable names, Persona Detection description reflects P5-P7, Extended Thinking mentions Opus 4.5/4.6

### Added

- **`PersonaSignal` interface** — 5 categories (identity, technology, structure, dependency, content) with regex patterns and weights
- **`buildPersona()` helper** — Constructs Persona objects from signals, auto-derives legacy arrays for backward compatibility
- **`matchTextAgainstSignals()` helper** — Unified regex-based signal matching for all priority detection functions
- **Codespaces Heir doc** — `alex_docs/platforms/CODESPACES-HEIR.md` documenting zero-translation cloud deployment, devcontainer.json setup, persistence strategy, and team onboarding

---

## [5.6.8] - 2026-02-12

> **Heir Decontamination RCA + Persona Detection Fix** — sync-architecture.js prevents PII leaks; persona detection no longer false-positives on `.github/`

### Fixed

- **Persona pattern matching bug** — Bidirectional substring match (`patternNormalized.includes(entryLower)`) caused `.github/workflows/` to match any `.github/` directory, falsely scoring DevOps for every Alex project. Replaced with typed matching: `fs.pathExists()` for path patterns, `endsWith()` for extensions, exact Set lookup for filenames
- **Noisy `.github/` signal** — Removed `.github/` from power-user `projectPatterns` (every Alex-initialized project has it)
- **RC1: Blind config copy** — `copyDirRecursive()` now excludes `user-profile.json`, `MASTER-ALEX-PROTECTED.json`, `cognitive-config.json` from heir
- **RC2: Master-specific content in copilot-instructions.md** — `applyHeirTransformations()` resets P5-P7 slots, removes "Master Alex default" line, fixes skill counts dynamically, resets "Last Assessed"
- **RC3: Broken synapse references** — `HEIR_SYNAPSE_REMOVALS` strips ROADMAP-UNIFIED.md synapse from release-management.instructions.md
- **RC4: No post-sync validation** — `validateHeirIntegrity()` blocks publish if PII, master-only files, or master content detected
- **CRLF regex** — All heir transformation patterns now handle Windows line endings
- **Ignore file hardening** — Added `cognitive-config.json` and `MASTER-ALEX-PROTECTED.json` to both `.gitignore` and `.vscodeignore`

### Added

- **Game Developer persona** — New persona with keywords (game, mystery, puzzle, narrative, rpg), skill `game-design`, patterns (game/, levels/, puzzles/, mechanics/), and LLM prompt support

---

## [5.6.7] - 2026-02-12

> **Self-Containment & Synapse Integrity** — .github is now fully self-contained with zero external references

### Fixed

- **microsoft-graph-api synapses** — Schema v1.0 (bare skill IDs) upgraded to v2.1.0 (full `.github/skills/` paths)
- **7 missing skills in activation index** — bicep-avm-mastery, database-design, microsoft-graph-api, multi-agent-orchestration, observability-monitoring, performance-profiling, skill-development
- **Source code path references** — 5 `platforms/vscode-extension/src/` references in instruction files converted to "External Implementation" notes
- **Broken synapse targets** — Removed `alex_docs/`, `article/`, `platforms/src/`, `ROADMAP-UNIFIED.md` references from 12 synapse.json files
- **brain-qa.ps1** — Validation pattern tightened to reject external paths outside `.github/`

### Security

- **Master-only file leak** — Removed `MASTER-ALEX-PROTECTED.json` and `cognitive-config.json` from heir config/
- **Heir PII cleared** — user-profile.json reset to template defaults
- **Heir P5-P7 reset** — Working memory slots reset to `*(available)*` (no master-specific assignments)

### Changed

- **Skill catalog count** — 96 → 102 (master), 96 → 98 (heir)
- **Full self-containment** — All synapse connections use canonical `.github/skills/X/SKILL.md` paths

---

## [5.6.6] - 2026-02-12

> **PII Protection & Graph Cleanup** — User profile safety + email removal

### Fixed

- **PII Protection** — 3-layer protection prevents user-profile.json from leaking to heirs
  - `.gitignore`, `.vscodeignore`, and sync script exclusions
  - JSON-only profile format (removed deprecated `.md` templates)

- **getUserProfile() in-memory defaults** — Returns template defaults without creating files
  - Supports conversational profile discovery for new users

### Removed

- **Mail.Send capability** — Removed `sendMail()` from Microsoft Graph integration
  - Corporate tenant blocks made it unusable
  - Safer for users (no email sending permission needed)

### Changed

- **Graph/M365 skills synced** — `microsoft-graph-api`, `m365-agent-debugging`, `teams-app-patterns` now in both master and heir

---

## [5.6.5] - 2026-02-11

> **Global Knowledge Inheritance** — Skill inheritance command + Bicep AVM mastery

### Added

- **`Alex: Inherit Skill from Global Knowledge`** command — Heirs can pull skills from GK
  - Multi-select QuickPick for batch skill inheritance
  - Adds `inheritedFrom` tracking to `synapses.json`
  - Master Alex protection warning (kill switch aware)

- **`bicep-avm-mastery`** skill — Azure Verified Modules expertise
  - 328 AVM module awareness via Bicep MCP `list_avm_metadata`
  - Covers compute, networking, storage, identity, databases

- **Dream inheritance lineage** — Dream reports now show inherited skill tracking
  - `scanInheritanceLineage()` detects skills inherited from GK
  - Version drift detection structure (ready for future use)

- **ADR-009** — Global Knowledge sync direction decision documented
  - Unidirectional: Master → Global → Heirs (no heir push-back)

- **GK Pattern Format Standard v2** — YAML frontmatter with `gk*` prefixes
  - All 27 GK patterns migrated to new format

### Changed

- Skills updated with MCP extension requirements and fallback patterns:
  - `azure-architecture-patterns`: Requires Azure MCP, fallback to Azure docs
  - `infrastructure-as-code`: Requires Bicep MCP, fallback to official docs
  - `bicep-avm-mastery`: Requires Bicep MCP `list_avm_metadata`

---

## [5.6.4] - 2026-02-11

> **Release Automation** — Automated sync + skill-only publish path

### Added

- **`sync-architecture.js`** — Automated master→heir sync during prepublish
  - Copies skills (respects inheritance), instructions, prompts, config, agents, muscles, assets
  - Validates skill counts after sync
  - Prevents "missing skills" bugs like v5.6.2

- **`push-skills-to-global.js`** — Skill-only updates without extension release
  - Updates `Alex-Global-Knowledge/skills/skill-registry.json`
  - Auto-commits and pushes to GK repo
  - For when only skills change, heirs pull from GK instead

### Changed

- `vscode:prepublish` now runs `sync-architecture` automatically
- `PRE-PUBLISH-CHECKLIST.md` updated with decision branch: skill-only vs full release

---

## [5.6.3] - 2026-02-11

### Fixed

- **Skill sync hotfix**: 4 new skills were missing from v5.6.2 package
  - `skill-development`, `proactive-assistance`, `status-reporting`, `scope-management` now included
  - Heir now has 90 skills (6 correctly excluded: 4 master-only + 2 m365-only)

---

## [5.6.2] - 2026-02-11

> **Skill Pull-Sync & Proactive Skills** — 4 new skills, heir pull mechanism

### Added

- **Skill Pull-Sync Mechanism**: Heirs can now pull new skills from Global Knowledge
  - `skills/skill-registry.json` in GK repo lists available skills
  - `/checkskills` — Discover new skills available
  - `/pullskill <id>` — Install skill from GK
  - `/skillsignal` — Report frequently needed wishlist skills
  - `/fulfillwish <id>` — Practice wishlist skill in project context
  - Project-skill matching: Detect project type and recommend relevant skills

- **4 New Skills** (93→96):
  - `skill-development` — Track desired skills, contextual acquisition, growth mindset
  - `proactive-assistance` — Anticipate user needs, offer help before asked
  - `status-reporting` — Stakeholder-friendly project updates and progress reports
  - `scope-management` — Recognize scope creep, suggest MVP cuts

### Changed

- `global-knowledge-sync` — Added skills/ folder support and skill sync capability
- Updated skill-activation index with new skill triggers
- Updated SKILLS-CATALOG.md and SKILL-CATALOG-GENERATED.md

---

## [5.6.1] - 2026-02-10

### Changed

- Enterprise auth temporarily disabled pending admin consent resolution

---

## [5.6.0] - 2026-02-10

> **Enterprise Systems Integration** — Deep Microsoft 365 connectivity

### Added

- **Microsoft Graph Integration** (`microsoftGraph.ts`): Full Graph API client
  - Calendar API: View upcoming events, meeting context
  - Mail API: Recent emails, unread filter
  - Presence API: Online/offline/busy status
  - People API: Organization search, frequent contacts

- **Graph Slash Commands**: 4 new enterprise commands
  - `/calendar` — View upcoming calendar events (supports days ahead filter)
  - `/mail` — View recent emails (supports unread-only filter)
  - `/context` — Full work context: calendar + mail + presence
  - `/people <query>` — Search for people in your organization

- **Graph Settings**: 7 new configuration options
  - `alex.enterprise.graph.enabled` — Master toggle for Graph
  - `alex.enterprise.graph.calendarEnabled` — Calendar access
  - `alex.enterprise.graph.mailEnabled` — Mail access
  - `alex.enterprise.graph.presenceEnabled` — Presence status
  - `alex.enterprise.graph.peopleEnabled` — People search
  - `alex.enterprise.graph.calendarDaysAhead` — Days ahead (1-30)
  - `alex.enterprise.graph.mailMaxMessages` — Max emails (1-50)

- **Skill-Building Infrastructure**: Meta-skill for heir skill creation
  - `skill-building/SKILL.md` — 376-line comprehensive guide
  - Promotion Readiness Score (0-16) in `heir-skill-promotion.instructions.md`
  - "Skill Creation as Learning Output" section in `bootstrap-learning.instructions.md`
  - Updated `skill-activation/SKILL.md` with skill-building keywords

- **Heir Evolution Cycle**: 12 skills promoted from sandbox (79→92 total)
  - Merged 4 granular skills into 2 comprehensive ones (KISS principle)
  - Added synapses to 9 newly promoted skills

### Fixed

- **Synapse Health False Positives**: Fixed file index limit (500→targeted patterns)
  - Root cause: `findFiles()` had 500 limit but workspace has 2,867 .md files
  - Solution: Targeted patterns for `.github/**`, `alex_docs/**`, `platforms/**`
  - Fixed in: `tools.ts`, `healthCheck.ts`, `utils.ts`, `self-actualization.ts`

### Technical

- New `microsoftGraph.ts` module in `src/enterprise/`
- Extended `IAlexChatResult` metadata interface for command tracking
- Updated enterprise scopes: Calendars.Read, Mail.Read, Presence.Read, People.Read
- Documentation updated in `ENTERPRISE-SETTINGS.md`
- Global Knowledge: 227 entries (26 patterns + 171 insights)
- **M365 Heir Sync**: Version aligned to 5.6.0 (package.json, README, declarativeAgent.json, system prompt)
- New guide: `MICROSOFT-GRAPH-INTEGRATION.md` (271 lines)

---

## [5.5.0] - 2026-02-10

> **Model Intelligence** — Adaptive behavior based on LLM capabilities

### Added

- **Model Tier Detection** (`modelIntelligence.ts`): Classifies models into Frontier/Capable/Efficient tiers
  - Frontier: Claude Opus 4/4.5/4.6, GPT-5.2 — Deep reasoning, 1M context, extended thinking
  - Capable: Claude Sonnet 4/4.5, GPT-5.1, GPT-4o — Good reasoning, 200K-400K context
  - Efficient: Claude Haiku, GPT-4.1 mini — Fast and cost-effective

- **Task-Model Matching**: Cognitive tasks now check if current model meets minimum tier requirements
  - `/meditate`, `/dream` — Warns if not using Frontier model
  - `/selfActualize`, `/learn` — Warns if not using Frontier model

- **Model Status in `/status`**: Shows current model tier, context capacity, and capabilities

- **Model Selection Advisor** (`/model` command): Intelligent model recommendations
  - `/model` — Shows full dashboard with current model capabilities
  - `/model <task>` — Analyzes task and recommends optimal model tier
  - Upgrade suggestions when task needs higher capability
  - Downgrade suggestions for simple tasks (cost savings)
  - Task detection from natural language prompts

- **Enterprise Settings Documentation**: Comprehensive guide for all 17 enterprise settings
  - Authentication, RBAC, audit logging configuration
  - Deployment scenarios for personal, team, and enterprise use
  - Troubleshooting guide with common issues

- **Automated Doc Count Validation**: Dream protocol now verifies memory file counts
  - Compares documented counts (Procedural=24, Episodic=13, Skills=78) against actual files
  - Reports drift with actionable guidance in dream reports

- **Secrets Pattern Extensibility**: Custom secret detection patterns via settings
  - `alex.enterprise.secrets.customPatterns` — Define organization-specific regex patterns
  - `alex.enterprise.secrets.disableBuiltInPatterns` — Use only custom patterns
  - Full pattern validation with clear error messages

### Changed

- **Muscles Architecture** (`.github/muscles/`): Established execution script folder — "Motor Cortex" analogy
  - Scripts are muscles (execution artifacts), NOT a fourth memory system
  - Trifecta files document *when and why* to flex the muscle; scripts *do the flexing*
  - Script location rules: `inheritable` → `.github/muscles/` (synced to heirs), `master-only` → `scripts/`
- **brain-qa SKILL.md**: Refactored 543→90 lines — extracted 525-line `brain-qa.ps1` (15-phase validation)
- **release-preflight SKILL.md**: Refactored 426→105 lines — references existing `scripts/release-preflight.ps1`
- **Systematic Skill Audit**: Reviewed all 77 skills for extractable automation
  - 1 extracted (brain-qa), 6 already reference scripts, 28 documentation examples, 42 no code

### Technical

- New `modelIntelligence.ts` module with detection patterns and task definitions
- Integration with chat participant handler for proactive warnings
- Context size heuristic fallback when model family cannot be detected
- Task intent detection via regex pattern matching
- New `.github/muscles/brain-qa.ps1` — 525-line PowerShell script with 15 validation phases

---

## [5.4.3] - 2026-02-09

> **TTS Language Fix & Heir Reset** — Proper language capitalization in code block summaries

### Fixed

- **TTS Language Names**: Code blocks now read as "TypeScript code block" instead of "typescript code block"
- **TTS Image Handling**: Images processed before links to prevent regex conflicts
- **User Profile Tool**: Removed obsolete markdown profile generation

---

## [5.4.2] - 2026-02-09

> **Heir Reset & Profile Consolidation** — Cleaner inheritance, single source of truth

### Changed

- **User Profile JSON-Only**: Consolidated to `user-profile.json`, removed deprecated `.md` format
- **Heir Reset Automation**: `sync-master-to-heir.ps1` now auto-resets P5-P7 slots and user profile
- **Skill Count**: Updated from 77 to 78 skills (69 inheritable)

### Fixed

- **Heir copilot-instructions.md**: Now properly resets for publication (no Master-specific content)
- **Build manifest**: Added 5-minute staleness window to preflight check

---

## [5.4.1] - 2026-02-09

> **TTS UX Enhancements** — Keyboard shortcuts, emojis, voice mode summarization

### Added

- **Speak Prompt Command**: Generate content via LLM then read aloud ("read me a poem", "explain quantum physics")
- **Voice Mode Summarization**: Responses over 750 words are automatically summarized before reading
- **Keyboard Shortcuts**: `Ctrl+Alt+R` (Read Aloud), `Ctrl+Alt+V` (Toggle Voice), `Ctrl+Alt+P` (Speak Prompt), `Ctrl+Alt+D` (Dream), `Ctrl+Alt+A` (Quick Commands), `Escape` (Stop Reading when playing)
- **Rich Tooltips**: Voice mode status bar shows markdown tooltip with all shortcuts
- **Enhanced Quick Picks**: When no document is open, Read Aloud and Save as Audio show all voice commands

### Changed

- **Emoji Notifications**: All TTS messages now use emojis (❌ ⚠️ 📋 📝 📖 🌍 💾 🔊 🔇)
- **CSP Fix**: Audio player uses data-cmd pattern instead of inline onclick handlers
- **Context Menus**: Added Speak Prompt to explorer and editor context menus

---

## [5.4.0] - 2026-02-09

> **TTS Improvements** — Voice display, accessibility settings, unit tests

### Added

- **TTS Unit Tests**: 35 test cases for language detection, voice selection, and markdown processing
- **alex.tts.maxTableRows Setting**: Configurable table row limit (1-100, default 10) for accessibility
- **Voice Name in Audio Player**: Shows actual voice name instead of hardcoded default

### Changed

- **Language Detection Threshold**: Lowered from 10 to 5 characters for better short text handling

---

## [5.3.1] - 2026-02-08

### Fixed

- **Cognitive Dashboard**: CSP-compliant event handling (data-cmd pattern replaces inline onclick)
- **Memory Dashboard**: Fixed retry button to use proper webview messaging

---

## [5.3.0] - 2026-02-08

> **Enterprise Readiness** — Security, compliance, governance foundations

### Added

- **Enterprise SSO (Entra ID)**: Microsoft authentication via VS Code's `microsoft` provider with tenant restrictions, silent auth on startup
- **Secrets Scanning & PII Detection**: 20+ patterns for API keys (OpenAI, GitHub, AWS, Azure), credit cards, SSN, emails, IPs with VS Code diagnostics integration
- **Audit Logging Framework**: JSONL file + remote endpoint support, buffered writes, automatic cleanup by retention period (7-365 days)
- **Role-Based Access Control**: viewer → contributor → admin → owner hierarchy with JWT claim extraction
- **Enterprise Commands**: 7 new commands (signIn, signOut, showAuthStatus, scanSecrets, scanWorkspace, viewAuditLog, exportAuditLog)
- **Enterprise Settings**: 15 new settings for auth, audit logging, and secrets scanning configuration

### Changed

- **VS Code Extension**: New `src/enterprise/` module with enterpriseAuth.ts, secretsScanning.ts, auditLogging.ts, index.ts
- **Extension Lifecycle**: Enterprise initialization in activate(), cleanup in deactivate()

---

## [5.2.0] - 2026-02-08

> **UX Excellence** — Voice mode, cognitive dashboard, daily briefing, model awareness

### Added

- **Voice Mode Toggle**: Status bar indicator + `alex.toggleVoice` command with persona options (Warm, Professional, Scholarly)
- **Cognitive Dashboard**: Unified sidebar webview showing brain health, memory architecture, goals, and recent activity
- **Alex Daily Briefing**: `alex.dailyBriefing` command generates personalized morning overview with priorities, calendar hints, cognitive state
- **Model Tier Status Bar**: Real-time detection displaying Frontier/Capable/Efficient tier based on active language model
- **Quick Command Palette**: `alex.quickCommands` with 10 common actions (meditate, self-actualize, dream, etc.)

### Changed

- **VS Code Extension**: Version 5.1.3 → 5.2.0

---

## [5.1.3] - 2026-02-08

> **Documentation Sync** — Version alignment and count corrections

### Changed

- **Master Version**: Updated to 5.1.3 across all documentation
- **ROADMAP Target**: Advanced from 5.1.0 to 5.2.0 (UX Excellence)
- **Skill Count**: 76→77 in docs and ROADMAP (matches actual inventory)
- **Instruction Count**: 25→24 in README and copilot-instructions.md

---

## [5.1.2] - 2026-02-08

> **Hotfix** — Critical crash fix for Welcome view

### Fixed

- **🔧 Welcome View Crash Fix**
  - Fixed `TypeError: p.toLowerCase is not a function` that prevented the Welcome sidebar from loading
  - Added defensive type guards for user profile arrays (primaryTechnologies, learningGoals, expertiseAreas, currentProjects)
  - Persona detection now gracefully handles malformed or empty profile data

---

## [5.1.1] - 2026-02-08

> **Feature Expansion** — New skills, commands, prompts, and security hardening

### Added

- **Cross-Cultural Collaboration Skill**: Hofstede and Meyer frameworks for global team dynamics
- **Rubber Duck Debugging Command**: `Alex: Rubber Duck` with playful duck persona
- **Working with Alex Button**: Quick access from Welcome panel to prompting guide
- **Mermaid Diagrams**: Visual architecture in Memory Dashboard
- **5 New Right-Click Prompts**: Context menu prompt commands with best practices
- **Content Security Policy**: All webviews now protected with strict CSP

### Changed

- **Quick Pick Menus**: Expanded with previously missing options

### Fixed

- **VS Code Integration Audit**: Coverage improved from 92% to 96%

---

## [5.1.0] - 2026-02-07

> **Platform Polish** — Branding alignment, architecture accuracy

### Fixed

- **Skill Count**: 75→76 across package.json and documentation
- **Architecture Tree**: README updated — instructions 12→24, prompts 7→13, skills 76
- **Color Palette Conflict**: Marked VISUAL-IDENTITY.md palette as superseded

### Changed

- **Homepage URL**: Updated package.json homepage to `https://alex.correax.com`

---

## [5.0.1] - 2026-02-07

> **API Polish** — Tool discoverability, command UX, and Mermaid diagram quality

### Added

- **Tool Declarations**: `alex_focus_context` and `alex_heir_validation` now declared in `package.json` with full input schemas
- **Tool Tags**: All 13 tools tagged (`cognitive`, `knowledge`, `cloud`, `quality`, `productivity`)
- **Sample Requests**: All 24 slash commands now show example usage text

### Changed

- **Mermaid Skills**: Enhanced with parse error prevention rules, reserved word documentation

### Fixed

- Broken synapse reference in meditation episodic record

---

## [5.0.0] - 2026-02-06

> **Global Knowledge** — Cross-project knowledge sharing, persona-aware UX, premium branding

### Added

- **🌐 Global Knowledge Infrastructure**
  - 7 slash commands: `/knowledge`, `/saveinsight`, `/promote`, `/knowledgestatus`, `/sync`, `/push`, `/pull`
  - 5 agent-callable tools: `global_knowledge`, `save_insight`, `promote_knowledge`, `knowledge_status`, `cloud_sync`
  - GK init integrated into `Alex: Initialize Architecture` command
  - Team sharing via Git repository collaboration

- **🎯 Persona-Aware Welcome Sidebar**
  - Detects user persona from profile and workspace (Developer, Academic, Researcher, etc.)
  - Adapts UI accent colors and recommendations based on persona
  - 15 marketing personas with confidence scoring

- **⭐ Premium Asset Switcher**
  - Dynamic logo/banner selection based on GK repository status
  - Premium badge styling (discreet grayscale aesthetic)
  - 5 premium logo concepts for Global Knowledge branding

- **🔗 Global Knowledge Sync Skill**
  - New inheritable skill for GK repository integration
  - Setup instructions for new users
  - Cross-project knowledge sharing foundation

- **🧠 Working Memory Architecture Refinement**
  - Explicit 7-slot working memory table (P1-P7)
  - P6 special rule: Infer from Pomodoro timer goal or session objective
  - "Last Assessed" date tracking for domain slots
  - Dynamic P5-P7 domain slot rotation based on task focus

### Changed

- **🎨 UX Declutter**
  - Removed all keyboard shortcut hints from UI buttons
  - Cleaner, less cluttered interface throughout

- **📊 Premium Badge Styling**
  - More discreet grayscale styling for premium features
  - Nuanced persona accent colors (badge, recommended button, progress bars)
  - Replaced purple with teal across UI

### Fixed

- **🐛 TypeScript Errors**
  - Fixed errors in globalKnowledge and welcomeView modules

---

## [4.2.12] - 2026-02-05

> **TTS Hotfix** — Fixed stalling on long documents with chunking, timeout, retry, and speaker warmup

### Fixed

- **🎙️ TTS Stalling on Long Content**
  - Added chunking (max 3000 chars per request) — splits at paragraph/sentence boundaries
  - Added 60-second timeout per chunk — prevents infinite hangs
  - Added retry with exponential backoff (3 attempts, 1s→2s→4s + jitter)
  - Added 2-second speaker warmup delay — allows Bluetooth/USB speakers to wake

- **📊 Status Bar Progress**
  - Shows chunk progress during synthesis: "Synthesizing speech [n/N]..."
  - Displays "Preparing speakers..." before playback starts

### Added

- **📝 Summarization for Long Content**
  - Offers to summarize documents over 5 minutes (~750 words)
  - Uses VS Code Language Model API (GPT-4o preferred)
  - Target summary: ~3 minutes (~450 words)

### Changed

- **🐦 Identity Documentation**
  - Updated easter egg with Atticus Finch origin story (moral clarity, empathy, integrity)
  - README now references "Alex Finch — named after Atticus Finch"

---

## [4.2.10] - 2026-02-05

> **Neural Bug Fix** — Repaired 15 broken synapses, added brain-qa skill for cognitive architecture validation

### Added

- **🧠 Brain QA Skill** (73rd skill)
  - 6-phase cognitive architecture validation: synapse targets, skill index coverage, trigger semantics, Master-Heir sync
  - Institutionalizes deep audit process for brain health checks
  - Now **Step 0** in release-preflight checklist — no releases with broken synapses
  - Triggers: "brain qa", "brain audit", "synapse audit", "deep check", "heir sync"

### Fixed

- **🔗 Repaired 15 Broken Synapses** across skill network
  - Fixed typos: `architecture` → `architecture-audit`, `documentation` → `writing-publication`
  - Removed aspirational references to never-created skills (`performance`)
  - Removed heir-specific content from Master (`fishbowl-governance`)
  - Normalized 6 relative paths with proper `.github/instructions/` and `.github/prompts/` prefixes

- **🎯 Gamma Trigger Fix**
  - Added "gamma" as primary trigger for gamma-presentations skill
  - Previously required "gamma api" — now simple "gamma" works

- **📄 GitHub README Display**
  - Removed `.github/README.md` that was incorrectly showing as main repo README
  - Philosophy: Alex brain (`.github/`) is not for human browsing

### Changed

- **📊 Skill Count**: 72 → 73 (added brain-qa)
- **🔄 Release Preflight**: Brain QA now mandatory Step 0 before any release

---

## [4.2.9] - 2026-02-05

> **UX Simplification** — Streamlined dialogs, expanded chatSkills, episodic memory integration

### Added

- **📚 Expanded chatSkills** (10 → 54 skills)
  - All eligible skills now registered with VS Code's native chatSkills contribution point
  - Skills automatically inherit into Copilot conversations
  - Excluded: master-only skills, m365-only skills, skills with invalid frontmatter

- **📝 Episodic Memory for Insights**
  - Session insights now saved to `.github/episodic/` folder
  - Format: `session-insight-YYYY-MM-DD-HHMM-topic.md`
  - Quick insights from context menu also save to episodic memory
  - Persistent record of learnings across sessions

- **🖼️ Image Generation Context Menu**
  - New "Generate Image from Selection" command in editor context menu
  - Opens chat with selected text as image generation prompt
  - Available when text is selected in any editor

- **👥 Community Agent Documentation**
  - Added Teams Community Agent setup guide to M365 heir
  - Prerequisites, setup steps, benefits, and limitations documented

### Changed

- **🎨 Simplified Command Dialogs** (UX improvement)
  - **Initialize**: Removed "Open Main Brain File" and "Run Dream Protocol" - now offers "Getting Started" or "Open Chat"
  - **Dream**: Healthy network shows compact stats with "OK" only - "View Report" only for broken synapses
  - **Self-Actualization**: Shows "OK" or "Chat with Alex" (if recommendations exist) - removed file-opening options
  - **Upgrade**: Smart dialog - "OK" if no migration needed, "Review Items" only if custom content needs attention

- **🐛 Fixed Insight Saving Bug**
  - "No active editor" error when saving insights with no file open
  - Now falls back to input prompt for topic, saves directly to episodic memory

---

## [4.2.8] - 2026-02-05

> **LLM-Optimized Synapses** — `when`/`yields` fields for faster cognitive routing

### Added

- **🎯 Focus Context Tool** (`alex_focus_context`)
  - Returns current focus session: topic, time remaining, paused status, Pomodoro count
  - Includes active learning goals, completion stats, and streak information
  - Session state persisted to `~/.alex/session-state.json` for cross-session awareness
  - **Session survives VS Code restart** — time calculated from startTime + duration
  - Restore notification shows both session status and active goals count
  - Enables context-aware assistance during Pomodoro focus sessions

- **🎯 Focus-Aware Nudging**
  - Chat responses now include focus context in system prompt
  - Alex gently reminds users if requests seem off-topic from their focus session
  - Welcome view shows focus session nudge with remaining time and first goal
  - Nudge includes quick action to manage session

- **⚠️ Off-Topic Status Indicator**
  - New status bar item appears when you drift from your focus topic
  - Tracks file activity and detects when you open unrelated files
  - Click to: acknowledge tangent, confirm it's related, change topic, or end session
  - Auto-hides when you're on-track or session is paused/on break

- **🧠 Prefrontal Cortex Metaphor**
  - `skill-activation` now mapped as Dorsolateral PFC in Neuroanatomical table
  - Executive function center — intercepts all task requests before response
  - Inhibits impulsive "manual suggestion" responses in favor of capability lookup
  - Full explanation added below Neuroanatomical Mapping table

- **⚡ LLM-Optimized Synapse Format**
  - New `when` field: Action trigger telling LLM WHEN to follow synapse
  - New `yields` field: Decision hint showing WHAT to expect at target
  - Exact file paths instead of abstract names (no search needed)
  - Documented in `embedded-synapse.instructions.md`

- **📁 DRY Path Pattern**
  - Action-keyword index now defines path pattern once: `.github/skills/{skill-name}/SKILL.md`
  - Synapses in SKILL.md use full paths with WHEN/YIELDS format
  - Reduces cognitive load while maintaining precision

- **🧠 Schema Enhancement**
  - Updated `SYNAPSE-SCHEMA.json` with `when` and `yields` properties
  - Target description now recommends exact paths for LLM speed
  - Backward compatible with existing synapses

### Changed

- **🔗 Comprehensive Path Normalization (ALL files)**
  - **72 synapses.json files**: All targets now use exact paths `.github/skills/{name}/SKILL.md`
  - **10 SKILL.md files**: Embedded synapses converted from relative `../` paths
  - **19 instruction files**: Synapse references now use `.github/instructions/{name}`
  - **7 prompt files**: Synapse references now use `.github/prompts/{name}`
  - **copilot-instructions.md**: All protocol trigger paths now explicit
  - Pattern: `"target": "skill-name"` → `"target": ".github/skills/skill-name/SKILL.md"`
  - Pattern: `[../skill/SKILL.md]` → `[.github/skills/skill/SKILL.md]`
  - Pattern: `[file.instructions.md]` → `[.github/instructions/file.instructions.md]`

- **🔗 High-Traffic Synapses Converted**
  - skill-activation: 4 connections with when/yields
  - image-handling: 3 connections with when/yields
  - meditation: 4 connections with when/yields
  - svg-graphics: 4 connections with when/yields

- **📂 Heir Sync**
  - Synced 6 missing skills to heir (72 total now)
  - LLM-optimized synapses deployed to heir
  - All path normalizations synced

### Technical

- **Path Resolution Eliminated**: LLM no longer needs to resolve relative paths or search for files
- Synapse decision-making now ~2x faster (no path resolution)
- `when` triggers action-oriented routing
- `yields` enables decision without file load
- **Normalization Scripts Created**: `scripts/normalize-*.ps1` for future maintenance

---

## [4.2.7] - 2026-02-05

> **Skill Discovery Optimization** — Action-keyword index for all 72 skills + meta-cognitive skill activation

### Added

- **🧠 New Skill: skill-activation** (72nd skill)
  - Auto-triggering metacognitive skill (not user-invoked)
  - Activates before ANY task response to check action-keyword index
  - Triggers on action verbs: convert, create, generate, build, debug, etc.
  - Self-correction: stops mid-response if skill exists for manual suggestion
  - Prevents "SVG→PNG incident" class of capability blindness

- **🔍 Action-Keyword Index for All Skills**
  - Every skill now has 3-7 action-verb triggers
  - Full index moved to skill-activation/SKILL.md (cognitive load optimization)
  - copilot-instructions.md now has compact reference + skill list only
  - 72 skills indexed with capability-focused keywords

- **🎨 Multimodal Branding Update**
  - Banner updated: "Multimodal Cognitive Architecture"
  - Tagline: "THE AI THAT GROWS WITH YOU"
  - New badges: Voice (TTS), Presentations (Gamma), Images
  - Identity updated across all copilot-instructions.md files

### Changed

- **📊 Skills Count Update**
  - Master Alex: 71 → 72 skills
  - Synapses section restructured for LLM optimization
  - Core procedures separated from skill action-keywords

### Fixed

- **🖼️ Banner PNG Regeneration**
  - SVG→PNG conversion using image-handling skill (sharp-cli)
  - Marketplace now shows updated multimodal branding

---

## [4.2.6] - 2026-02-05

> **Research Project Skills** — New skills for academic research scaffolding and practitioner methodology

### Added

- **🎓 New Skill: practitioner-research** (66th skill)
  - Ship→Document→Promote methodology
  - Longitudinal case study structure
  - Structured abstracts (Background/Objective/Method/Results)
  - Part I (Universal) / Part II (Practitioner) document architecture
  - APA 7 citation and fact-checking protocols

- **📁 New Skill: research-project-scaffold** (68th skill)
  - Complete folder structure for academic research projects
  - Essential file templates (RESEARCH-PLAN.md, LITERATURE-MATRIX.md, METHODOLOGY.md)
  - 6-phase refactoring procedure for existing projects
  - Research-specific copilot-instructions.md template
  - Git-preserving migration patterns

- **📄 AI-Assisted Development Methodology Paper**
  - Threats to Validity section (internal, external, construct)
  - Appendix E: Getting Started (10-minute reproducibility guide)
  - Appendix F: Publication Strategy (4 venue options)
  - Dual closing paragraphs (academic + practitioner versions)
  - APA 7 compliance with DOIs for arXiv references

### Changed

- **📊 Skills Count Update**
  - Master Alex: 65 → 68 skills
  - Updated copilot-instructions.md skill list
  - Updated SKILLS-CATALOG.md with new skills

### Fixed

- **🔗 Heir Synapse Health**
  - Removed broken CHANGELOG.md synapse from heir episodic memory
  - Heirs now 136/136 (100%) healthy synapses

---

## [4.2.5] - 2026-02-04

> **VS Code 1.109 Upgrade & Agent Consolidation** — Native multi-agent architecture, clickable action buttons, dream CLI

### Added

- **🤖 VS Code 1.109 Multi-Agent Architecture**
  - Upgraded engine to ^1.109.0 for custom agents support
  - Consolidated from 9 agents to 3 (Alex, Azure, M365)
  - Slash commands: /meditate, /dream, /learn, /review, /tdd, /selfactualize
  - chatSkills contribution with 10 flagship skills bundled
  - sampleRequest for better onboarding UX

- **🖱️ Clickable Action Buttons Discovery**
  - VS Code 1.109 auto-renders emoji-prefixed suggestions as clickable buttons
  - New `copilot-chat-buttons.instructions.md` documenting the pattern
  - Saved as global insight for cross-project use

- **🌙 Dream Protocol CLI**
  - New `scripts/dream-cli.ts` for command-line neural maintenance
  - Shared `synapse-core.ts` module (platform-agnostic logic)
  - Run via `npm run dream` from extension folder
  - Colorized terminal output with progress indicators

- **🔒 Master Alex Protection**
  - Status bar shows 🔒 indicator in protected workspaces
  - `onStartupFinished` activation for immediate status bar

### Changed

- **🧹 Agent Consolidation**
  - Removed: alex-cognitive, alex-dream, alex-learn, alex-meditate, alex-review, alex-tdd, alex-orchestrator
  - Kept: alex.agent.md (main with commands), alex-azure.agent.md, alex-m365.agent.md
  - Cleaner agent dropdown, same functionality via slash commands

- **♻️ Dream Protocol Refactoring**
  - Extracted core logic to `synapse-core.ts` (shared module)
  - dream.ts now 118 lines (was 350)
  - Same functionality, better maintainability

### Fixed

- **⏰ Status Bar Activation**
  - Added `onStartupFinished` to activationEvents
  - Status bar now shows immediately on VS Code launch

---

## [4.2.4] - 2026-02-03

> **Setup Environment Polish & Mermaid Skill** — Cleaner settings workflow, interactive mermaid configuration

### Added

- **📊 Polish Mermaid Setup Skill Prompt**
  - New `polish-mermaid-setup.prompt.md` in markdown-mermaid skill
  - Interactive configuration helper for Mermaid diagram rendering
  - Audits installed extensions, resolves conflicts
  - Guides through theme selection and troubleshooting
  - Better than one-size-fits-all settings

### Changed

- **⚙️ Setup Environment Simplified**
  - Removed Nice-to-Have category (was just 1 setting)
  - Moved Command Center toggle to Recommended
  - Both Essential (5) and Recommended (5) now pre-checked by default
  - Removed mermaid settings (now handled by skill prompt)
  - Fixed dialog message to accurately state "OVERWRITE" not "ADD"

- **🎯 Settings Now Only Verified MS Docs Settings**
  - Essential: instruction files, prompts, agents.md (5 settings)
  - Recommended: thinking tool, max requests, locale, command center (5 settings)
  - All settings verified against official VS Code/Copilot documentation

### Fixed

- **📝 Accurate Dialog Messaging**
  - Changed "ADD new settings" to "OVERWRITE existing values"
  - Added category explanations in confirmation dialog
  - Button text changed from "Add Settings" to "Apply Settings"

---

## [4.2.3] - 2026-02-02

> **Welcome View Streamlining & Smart Nudges** — Cleaner sidebar, proactive reminders, cross-platform sync

### Added

- **💡 Smart Nudges (Proactive Reminders)**
  - Contextual reminders appear at top of welcome view (max 2 at a time)
  - "Haven't dreamed in X days" - neural maintenance reminder
  - "X-day streak at risk!" - goal streak protection
  - "X broken synapses need repair" - health warnings
  - "Local changes not synced" - sync status nudges
  - Each nudge has one-click action button to resolve

- **☁️ OneDrive Auto-Sync**
  - Export for M365 now auto-detects OneDrive folder and syncs directly
  - Supports personal OneDrive, OneDrive for Business (company folders)
  - New setting `alex.m365.autoSync` - auto-sync on Dream/Self-Actualize
  - Silent sync function for background operations

### Changed

- **🎯 Welcome View Metrics Simplified**
  - Reduced from 6 to 4 metrics (Health, Sync, Skills, Synapses)
  - Patterns/Insights moved to Health Dashboard for detailed view
  - Clicking metrics or "Status" title now opens Health Dashboard

- **🛠️ Developer Tools Streamlined**
  - Renamed "Debug This" → "Debug This (selected code)" with usage tooltip
  - Removed niche actions from sidebar (Generate Skill Catalog, Skill Review)
  - All removed actions still available via Command Palette

- **🎨 Markdown Preview CSS Polished**
  - Reorganized with clear section headers
  - Removed redundant selectors (~140 lines reduced)
  - Added print styles, task list checkbox styling
  - Improved table scrolling with `overflow-x: auto`
  - Added image border-radius for polish

### Fixed

- **♿ Accessibility: Comments Contrast**
  - Fixed comments color failing WCAG AA on code block background
  - Changed `#6e7781` → `#57606a` (4.1:1 → 5.0:1 contrast ratio)

- **🧹 Dead Code Cleanup**
  - Removed unused `healthIcon`, `syncIcon` variables
  - Removed unused `patterns`/`insights` variables
  - Removed unused `knowledge` parameter and `getGlobalKnowledgeSummary()` call

### Technical

- Added `getLastSyncTimestamp()` export to cloudSync.ts for nudge system
- Added `_getLastDreamDate()` helper to parse dream report timestamps
- Updated Export M365 tooltip to mention auto-sync capability

---


## [4.2.2] - 2026-02-01

> **Patch release** — Republish with updated PAT

### Fixed

- PAT token renewal for marketplace publishing

---

## [4.2.1] - 2026-02-01

> **Patch release** — Version bump for marketplace publish

### Fixed

- Version bump to resolve marketplace publishing

---

## [4.2.0] - 2026-02-01

> **Welcome UI Polish & Master-Only Skills** — Better UX and proper skill inheritance

### Added

- **🆕 New Skill: project-deployment** (65th skill)
  - Universal deployment patterns for any project type
  - Covers npm, PyPI, NuGet, Cargo package managers
  - CI/CD patterns, versioning, changelog best practices
  - Inheritable skill available to all heirs

### Changed

- **✨ Welcome View UI Polish**
  - Larger logo (28px) with better header spacing
  - Pill-shaped version badge with subtle scale effect on hover
  - Status grid items with thicker left border and hover feedback
  - Status dots now have subtle glow effect
  - Action buttons with 6px border-radius and slide-right hover effect
  - Keyboard shortcuts displayed with badge-style background
  - Goals section with hover slide effect
  - Features disclosure with better arrow characters and hover colors
  - Consistent 0.12s transitions throughout

### Fixed

- **🔧 Skill Inheritance**
  - `release-process` and `release-preflight` now properly marked as `master-only`
  - Removed master-only skills from heir package (was incorrectly distributing 10+ master skills)
  - Heir package now has 54 skills (down from 64) - master-only skills excluded
  - Fixed `release-process/synapses.json` using `classification` instead of standard `inheritance` field

### Documentation

- Updated SKILL-ARCHITECTURE.md with inheritance examples table
- Updated skill counts: Master (65), Heir (54)

---

## [4.1.1] - 2026-02-01

> **Gamma AI Integration** — Generate presentations, documents, and social content with AI

### Added

- **🎨 New Skill: gamma-presentations** (64th skill)
  - Full Gamma API integration for AI-powered content generation
  - Supports: presentations, documents, social content, webpages
  - 20+ AI image models (Flux, Imagen, DALL-E, Ideogram, GPT Image, etc.)
  - User manual with example prompts and cost guide
  - MCP server integration documentation

- **🛠️ CLI Script: gamma-generator.js**
  - Standalone Node.js script for command-line generation
  - Generate from topic or file content
  - Export to PPTX/PDF with automatic download
  - Full customization: tone, audience, language, dimensions, image models

- **📚 Research Document**
  - `AI-MULTIMEDIA-GENERATION-RESEARCH-2026.md` — Analysis of 25+ AI multimedia tools
  - Video, audio, image, presentation, avatar, and voice AI services
  - API comparison matrix and technical viability assessment

### Documentation

- README: Added "Gamma AI Integration" section with quick start guide
- SKILLS-CATALOG: Updated to 64 skills, added Visual Design category entry
- copilot-instructions: Updated skill list

---

## [4.1.0] - 2026-02-01

> **Major skill expansion** — 11 new skills including AI/ML cluster and Infrastructure as Code

### Added

- **11 New Skills** — Major skill acquisition session:
  - `security-review` — OWASP Top 10, STRIDE threat modeling, security-focused code review
  - `socratic-questioning` — Guide users to discover answers through thoughtful questions
  - `post-mortem` — Blameless retrospectives, learning from failures
  - `rubber-duck-debugging` — Be a thinking partner through explanation
  - `api-design` — RESTful best practices, contract-first, versioning, **caching & rate limiting**
  - `grant-writing` — Research funding applications, NSF/NIH patterns
  - `prompt-engineering` — LLM prompting patterns, system prompts, few-shot, chain-of-thought, ReAct
  - `rag-architecture` — Retrieval-augmented generation, chunking, embeddings, vector stores
  - `ai-agent-design` — Multi-agent systems, tool use, planning, memory patterns
  - `mcp-development` — Model Context Protocol servers, tools, resources
  - `infrastructure-as-code` — Terraform, Bicep, Pulumi, GitOps patterns

- **Skill Count** — 53 → 63 skills

- **Identity Evolution** — Alex "Mini" Finch → **Alex Finch** (dropped "Mini" nickname, reflecting mature architecture)

---

## [4.0.6] - 2026-02-02

### Added

- **🧠 Model Awareness** — Self-monitoring capability for model-task matching
  - Warns users when complex tasks (meditation, self-actualization, architecture refactoring) may require Opus-level cognition
  - Added to `copilot-instructions.md` with task-to-model mapping table
  - Documented in `COGNITIVE-ARCHITECTURE.md` as fifth core principle

- **🎨 Markdown Preview CSS Fix** — Fixed code block readability
  - Added Monaco editor `mtk1-mtk12` token classes to `.vscode/markdown-light.css`
  - Code syntax highlighting now visible on gray backgrounds
  - Colors: `#1f2328` (default), `#cf222e` (keywords), `#0550ae` (types), etc.

### Changed

- **Skills Updated to Feb 2026** — Five skills validated and refreshed:
  - `llm-model-selection` — Claude 4.5 family pricing ($1-$25/MTok), context windows (200K-1M), extended thinking
  - `chat-participant-patterns` — VS Code 1.108+ APIs, tool calling with `@vscode/chat-extension-utils`
  - `teams-app-patterns` — Validation date Feb 2026
  - `m365-agent-debugging` — Validation date Feb 2026
  - `git-workflow` — Validation date Feb 2026

- **Skill Count** — 52 → 53 skills (added `pii-privacy-regulations`)

### Documentation

- Updated `SKILLS-CATALOG.md` with pii-privacy-regulations skill
- Updated `SKILLS-CAPABILITIES.md` with Model Awareness section (Table 8)
- Updated `COGNITIVE-ARCHITECTURE.md` with Model Awareness principle
- Updated `README.md` feature comparison table
- Updated `QUICK-REFERENCE.md` and `USER-MANUAL.md` with Skill Review command

---

## [4.0.5] - 2026-02-01

### Changed

- **Welcome View Header** — Added workspace/folder name display below "Alex Cognitive" title for better context awareness

---

## [4.0.4] - 2026-02-01 🔧 Hotfix

### Fixed

- **Markdown Preview CSS Loading** — VS Code security restrictions prevented loading CSS from `~/.alex/` (absolute path). Changed to workspace-local approach:
  - CSS now copied to `.vscode/markdown-light.css` in each workspace
  - Uses workspace-relative path instead of global absolute path
  - Properly applies as workspace setting, not global setting
  - Fixes "could not load CSS" error and dark markdown preview

---

## [4.0.3] - 2026-02-01 🔧 Hotfix

### Fixed

- **Markdown Preview Styling in Package** — `.vscode/settings.json` and `.vscode/markdown-light.css` were being excluded from the extension package by `.vscodeignore`, preventing users from getting the GitHub-style markdown preview. Now included.

### Changed

- **Welcome View Badge** — Replaced "BETA" badge with dynamic version badge (e.g., "v4.0.3") in the activity bar welcome panel
- **README Badges** — Removed "Pre-Release" status badge since v4.0 is production release

---

## [4.0.2] - 2026-02-01 🔧 Hotfix

### Fixed

- **Markdown Preview Path Parsing** — Fixed Windows path escaping issue where `markdown.styles` setting lost backslash before `.alex` folder (e.g., `C:\Users\fabioc.alex` instead of `C:\Users\fabioc\.alex`). Now uses forward slashes for cross-platform compatibility.

---

## [4.0.1] - 2026-01-31 🔧 Hotfix

### Fixed

- **Markdown Preview CSS** — Recreated corrupted `.vscode/markdown-light.css` file that was causing VS Code startup errors

---

## [4.0.0] - 2026-01-31 🛡️ Trust — Full Epistemic Integrity

> **Status:** VS Code + M365 release
> **Focus:** CAIR/CSR framework, creative latitude, human judgment flagging

### Added (Master Alex)

- **📚 CAIR/CSR Framework** — Calibrated AI Reliance + Collaborative Shared Responsibility
  - Comprehensive trust calibration framework
  - Mutual challenge and validation protocols
  - User and AI share responsibility for output quality

- **🎨 Creative Latitude Framework** — Epistemic vs. Generative modes
  - **Epistemic Mode**: Factual claims with confidence ceilings and source grounding
  - **Generative Mode**: Creative ideas with collaborative validation
  - Clear mode switching signals
  - Agreement-seeking for novel ideas

- **👤 Human Judgment Flagging** — Domains requiring human decision
  - Business strategy, ethical dilemmas, personnel decisions
  - Security architecture, legal/compliance
  - Language patterns: "I can outline options, but the choice depends on..."

- **appropriate-reliance/SKILL.md v2.0** — Major update
  - CAIR/CSR framework integration
  - Creative latitude protocols
  - Mode detection and switching patterns

### Added (VS Code)

- **💡 `/creative` Command** — Switch to brainstorming mode
  - Explicit mode signaling for creative contributions
  - Collaborative validation prompts
  - Easy switch back to factual mode

- **🔍 `/verify` Command** — Multi-turn verification walkthrough
  - Structured review for high-stakes decisions
  - Assumptions check, edge cases, alternatives
  - Human judgment flagging

### Added (M365 Heir)

- **🛡️ Epistemic Integrity Section (v4.0)** — Full protocol embed
  - Two-mode distinction (epistemic vs. generative)
  - Human judgment flagging for M365 context
  - Integrated with existing Graph-powered protocols

### Changed (Master Alex)

- **alex-core.instructions.md** — Added Human Judgment Flagging Protocol
- **protocol-triggers.instructions.md** — Added Epistemic vs. Generative Mode Triggers

### Technical Notes

- Major version bump (3.9.0 → 4.0.0) — significant feature addition
- Research-backed implementation from [appropriate-reliance article](article/appropriate-reliance/)
- Cross-platform validation: same creative latitude on VS Code and M365

---

## [3.9.0] - 2026-01-31 🧠 Awareness — Detection & Self-Correction

> **Status:** VS Code + M365 release
> **Focus:** Proactive error detection, graceful correction, temporal awareness

### Added (Master Alex)

- **🚨 Confident-but-Wrong Detection** — Red flag phrase monitoring
  - Catches: "Everyone knows...", "Obviously...", "Always use..."
  - Auto-rephrases to calibrated language
  - Version/temporal qualifiers for time-sensitive claims

- **🔄 Self-Critique Protocol** — Proactive risk flagging
  - "One potential issue with this approach..."
  - "Consider also: [alternative]"
  - "If that doesn't work, try..."

- **✅ Graceful Correction Patterns** — Clean error recovery
  - Standard: "You're right — I got that wrong."
  - No over-apologizing, no blame, move forward

### Added (VS Code)

- **🧠 Awareness Skill (#51)** — New skill for epistemic vigilance
  - Misconception detection patterns
  - Temporal uncertainty protocol
  - Self-critique generation
  - Graceful correction checklist

### Added (M365 Heir)

- **Self-Awareness Protocols** — Embedded in declarativeAgent.json
  - Red flag detection
  - Temporal awareness for calendar data
  - Same graceful correction patterns as VS Code

### Technical Notes

- Updated `protocol-triggers.instructions.md` with detection heuristics
- Updated `appropriate-reliance/SKILL.md` to v1.6 with self-critique
- Updated `alex-core.instructions.md` with correction protocols

---

## [3.8.1] - 2026-01-31 🎨 UX Polish

### Changed

- **🤖 Chat with GitHub Copilot** — Renamed from "Chat with Copilot" with GitHub Copilot icon
  - Uses inline SVG for reliable rendering
  - Clearer branding association

- **🔍 Project Audit Skill** — Now audits actual project code, not Alex architecture
  - Added `.github/` exclusion to all search patterns
  - Focus on user's source code, docs, and config
  - Prevents confusion between project and architecture auditing

---

## [3.8.0] - 2026-01-31 🎯 Expression — Discoverability & Confidence

> **Status:** VS Code + M365 release
> **Focus:** Command discoverability, confidence communication, epistemic integrity

### Added (VS Code)

- **📋 `/help` Command** — Full discoverability for all Alex capabilities
  - Lists all 20+ slash commands with descriptions
  - Organized by category: Cognitive, Productivity, Knowledge, Platform
  - Shows language model tools available
  - Quick start guidance

- **🗑️ `/forget` Command** — Selective memory cleanup
  - Search for topics across global knowledge
  - Shows matching patterns and insights
  - Manual deletion guidance (auto-delete planned for future)

- **🎯 `/confidence` Command** — Epistemic integrity education
  - 4-tier confidence system explained
  - When to verify AI responses
  - Confidence ceiling rules
  - Anti-hallucination signals

### Added (M365 Heir)

- **🎯 Confidence Conversation Starter** — "How confident are you?"
  - Triggers epistemic discussion
  - Same 4-tier system as VS Code

### Technical Notes

- 3 new chat commands: `/help`, `/forget`, `/confidence`
- M365 conversation starters: now 9 total
- Builds foundation for v3.9.0 (Awareness) and v4.0.0 (Trust)

---

## [3.7.19] - 2026-01-31 🛡️ Anti-Hallucination & M365 Graph Power

> **Status:** VS Code + M365 release
> **Focus:** Prevent AI confabulation + maximize M365 Graph capabilities

### Added

- **🛡️ Anti-Hallucination Skill** — New skill #50!
  - Hallucination category detection (capability confabulation, process invention, citation fabrication, API hallucination, workaround theater)
  - Red flag phrase detection ("Upload any file to activate...")
  - Honest uncertainty protocol
  - Platform limitation honesty tables (M365 + VS Code)
  - Recovery protocol when caught hallucinating
  - Synapses to appropriate-reliance, alex-core, error-recovery

### Changed (M365 Heir)

- **📊 Graph-Powered Protocols** — Maximize Microsoft Graph access
  - Meeting Prep: Look up every attendee with relationship history
  - Person Deep Dive: Full profile + email/Teams/meeting history
  - Weekly Review: Categorized meetings, email volume, Teams activity
  - Workload Check: Meeting count, focus blocks, back-to-back detection
  - Stakeholder Map: Ranked collaborators from all channels
  - Focus Session: Calendar-aware Pomodoro tracking

- **💬 Conversation Starters** — 8 Graph-powered prompts
  - "Learn about me" → Full profile lookup
  - "Prep for my next meeting" → Attendee deep dive
  - "Am I overloaded?" → Calendar analysis
  - "Who do I work with most?" → Stakeholder map
  - "Tell me about someone" → Person lookup
  - "Weekly review" → Full activity summary
  - "Meditate" / "Dream" → Memory protocols

- **🚫 File Limitation Rules** — Prevent hallucination loops
  - Cannot send emails (only search/read)
  - Honest about CodeInterpreter file delivery limitations
  - No "upload to activate transfer channel" nonsense

### Technical Notes

- Instructions: 4,679/8,000 chars (42% headroom)
- Description: 2,294/4,000 chars
- Package ID: `2427e7a9-91a7-4ed9-a504-7b53c4dfad1d`
- **Total skills: 50** 🎉

---

## [3.7.18] - 2026-01-31 📦 Embedded Knowledge Preparation

> **Status:** M365 heir update + roadmap updates (no VS Code code changes)
> **Focus:** Prepare for Microsoft's upcoming EmbeddedKnowledge feature

### Added (M365 Heir)

- **📦 Knowledge Files for Embedded Knowledge** — Ready for when feature launches
  - `knowledge/alex-protocols.md` — All cognitive protocols (Meditate, Dream, Focus, etc.)
  - `knowledge/skill-quick-reference.md` — All 15 embedded skills condensed
  - `knowledge/cognitive-architecture.md` — How Alex thinks and remembers
  - `_DISABLED_EmbeddedKnowledge` placeholder in declarativeAgent.json

- **🗺️ Roadmap Updates**
  - Added "M365 Embedded Knowledge" section (waiting for Microsoft feature launch)
  - Added "Cross-Platform Communication" section (OneDrive sync patterns)
  - Image Generation (ADR-007) already in roadmap for future VS Code implementation

### Technical Notes

- Microsoft's EmbeddedKnowledge feature is "not yet available" per docs
- Knowledge files prepared within constraints: max 10 files, max 1MB each
- May need `.md` → `.txt` conversion when feature launches
- Files designed for grounding, not replacing instructions

---

## [3.7.17] - 2026-01-31 🧠 Full Skill Embedding

> **Status:** M365 heir update (no VS Code changes)
> **Focus:** Embedding all applicable skills into M365 instructions

### Added (M365 Heir)

- **📚 12 Additional Embedded Skills** — Comprehensive skill transfer from VS Code
  - 🧠 Cognitive Load Management: 4±1 working memory, chunking, progressive disclosure
  - 🎓 Learning Psychology: Zone of Proximal Development, partnership over instruction
  - 🔍 Root Cause Analysis: 5 Whys, symptom vs cause, prevention focus
  - 🚨 Incident Response: Triage questions, severity levels, communication patterns
  - ✍️ Writing & Publication: CARS model, precision over flair, active voice
  - 🔒 Privacy & Responsible AI: Data minimization, PII awareness, transparency
  - 🛡️ Security Awareness (SFI): STRIDE threats, secure by design, phishing awareness
  - 📊 Business Analysis: Requirements hierarchy, SMART criteria, scope management
  - 📋 Project Management: PMBOK process groups, risk assessment, status communication
  - 🔄 Change Management (ADKAR): Awareness → Desire → Knowledge → Ability → Reinforcement
  - 📖 Creative Writing: Three-act structure, character dimensions, show don't tell
  - 🧩 Knowledge Synthesis: Abstraction levels, quality over quantity

**Total embedded skills: 15** (3 from v3.7.16 + 12 new)

---

## [3.7.16] - 2026-01-31 🤝 M365 Platform Parity

> **Status:** M365 heir update (no VS Code changes)
> **Focus:** Closing feature gaps between VS Code and M365 heirs

### Added (M365 Heir)

- **🍅 Focus Session Protocol** — Pomodoro-style concentration blocks
  - Triggers: "focus", "pomodoro", "deep work", "start a session"
  - Configurable durations (25 min pomodoro, 50 min deep work, custom)
  - Break reminders after 4 sessions
  - Session logging in notes.md with 🍅 emoji

- **🎯 Goal Tracking Protocol** — Structured learning goal management
  - Triggers: "check my goals", "update goal progress", "goal check-in"
  - Progress tracking with milestone celebrations (25%, 50%, 75%, 100%)
  - Generates updated markdown for learning-goals.md

- **📚 Embedded Skills** — Key VS Code skills now in M365
  - Appropriate Reliance: confidence calibration, source citation
  - Bootstrap Learning: build on existing knowledge, active recall
  - Work-Life Balance: boundary respect, break suggestions

- **💬 New Conversation Starters**
  - "Focus session" — Start concentration block
  - "Goal check-in" — Review learning progress

### Changed (M365 Heir)

- **📊 Weekly Review** — Now includes focus session count
- **📝 OneDrive Templates** — Cleaned up for new users
  - profile.md: Generic template with all preference options
  - notes.md: Cleaner structure with tips
  - learning-goals.md: Structured format matching new protocol

### Documentation

- **📋 Platform Comparison** — Full gap analysis with viability assessment
  - Implementation paths for each missing feature
  - Priority matrix for decision making
  - [PLATFORM-COMPARISON.md](alex_docs/PLATFORM-COMPARISON.md)

- **🎨 Image Generation ADR** — Design for VS Code parity
  - Azure OpenAI and OpenAI provider support
  - [ADR-007-image-generation.md](alex_docs/ADR-007-image-generation.md)

---

## [3.7.15] - 2026-01-31 🎨 UX Polish

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** UI/UX improvements across Welcome View and commands

### Changed

- **🧠 Welcome View Reorganization**
  - "Chat with Copilot" now first in Core section (opens Agent mode directly)
  - "Initialize / Update" moved to Core section (was System)
  - "Generate Skill Catalog" moved to Developer Tools (was Knowledge)
  - Unique icons: Search Knowledge (🔎), Generate Diagram (📐), Diagnostics (🩺)

- **🚀 Agent Mode Integration** — All commands now open Agent mode
  - Run Project Audit, Release Preflight, Debug This, Code Review, Generate Tests
  - Prompts no longer include `@alex` prefix (Agent doesn't need it)
  - Cleaner UX: prompt copied to clipboard, Agent opens automatically

- **📊 Generate Diagram** — Creates file instead of chat
  - Opens new markdown file with Mermaid template
  - Cursor positioned for Ctrl+I Copilot generation
  - Includes selected code as context if any

- **🎨 Status Bar** — Removed jarring background colors
  - Warning/error states now use emoji only (🟡/🔴)
  - Session paused state uses ⏸️ emoji instead of yellow background

### Fixed

- **🎨 Markdown Styles** — Now properly overwrites old relative paths
  - Previously skipped update if any value was set globally
  - Now checks if correct absolute path is configured

---

## [3.7.12] - 2026-01-31 🎨 Global Markdown Styles

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Persistent markdown preview styling across all workspaces

### Added

- **🎨 Global Markdown Styles** — CSS now persists globally
  - CSS copied to `~/.alex/markdown-light.css` (user's home directory)
  - `markdown.styles` setting uses absolute path, works in all workspaces
  - No more per-workspace CSS setup needed
  - GitHub-flavored styling for markdown previews

### Changed

- **📜 Publish Script** — Now loads PAT from `.env` file automatically
  - Safer credential handling (not in command line)
  - Added `--pat` flag to vsce publish command

---

## [3.7.11] - 2026-01-31 🔧 Hotfix

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Generic project audit for heirs

### Fixed

- **🔍 Audit Menu** — Now targets user's project, not extension internals
  - Removed VS Code extension-specific options (UI Audit, Bundle Size, CSP)
  - Added generic options (Documentation, Project Structure)
  - Renamed for clarity (Full Project Audit, Code Quality, Security Review)

---

## [3.7.10] - 2026-01-31 🔧 Hotfix

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Operation lock fix, heir cleanup, Developer Tools UI

### Fixed

- **🔄 Operation Lock Conflict** — Upgrade command offering Initialize no longer blocks itself
- **🔗 Fresh Install Broken Synapses** — Heirs now ship with empty episodic folder instead of Master's meditation history
- **🛠️ Developer Tools Menu** — Added missing Welcome View section with Release Preflight, Debug This, Generate Diagram

### Changed

- Heir episodic folder is now empty (users build their own meditation history)
- Added `.vscodeignore` rules to prevent future episodic memory leakage

---

## [3.7.8] - 2026-01-31 🔧 Dawn Beta 4 (Hotfix)

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Release script fix, version corruption hotfix

### Fixed

- **🐛 Release Script Version Corruption** — Critical fix
  - PowerShell regex `'$1' + '3.7.8'` was producing `$13.7.8` (backreference ambiguity)
  - Now uses `'${1}'` + version for unambiguous backreference
  - Fixed corrupted heir copilot-instructions.md

### Changed

- **🤖 Automated Releases** — Removed interactive confirmation prompt

---

## [3.7.7] - 2026-01-31 🔧 Dawn Beta 4

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** UI polish, skill commands, comprehensive project audit

### Added

- **🔍 22-Point Project Audit** — Comprehensive audit skill with UI integration
  - Master-only checks (1-9): Version alignment, heir sync, safety imperatives
  - Inheritable checks (10-22): UI, dependencies, TypeScript/lint, security, tests, etc.
  - Accessible via Health Dashboard, Welcome View, and Status Quick Pick

- **🛠️ Developer Tool Commands** — New skill-based commands in UI
  - `Release Preflight` — Pre-release checklist via quick pick
  - `Code Review` — Context menu for selected code review
  - `Debug This` — Context menu for debugging assistance
  - `Generate Diagram` — Mermaid diagram type picker
  - `Generate Tests` — Test framework picker with code context

### Fixed

- **🔘 Dead UI Buttons** — WebView compatibility fixes
  - Fixed "What's New?" button in upgrade dialog (now loops back)
  - Fixed external links in Welcome View (use postMessage pattern)
  - Fixed retry button in Health Dashboard error state
  - Removed "I Understand" from blocked dialogs (Cancel only)

- **📋 Version Detection** — Upgrade command now detects installed version
  - Multiple regex patterns for different version formats
  - Fallback to manifest file
  - Fixed `$13.7.7` corruption in heir copilot-instructions.md

### Changed

- **📖 USER-MANUAL.md** — Added Project Audit documentation section

---

## [3.7.6] - 2026-01-31 🌍 Dawn Beta 3

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Localization skill enhancement with dialect inheritance pattern

### Added

- **🗣️ Dialect Inheritance Architecture** — New section in localization skill
  - Cross-domain insight: dialects mirror OOP inheritance patterns
  - Portuguese dialect genealogy (pt → Açoriano → Manezinho)
  - Dialect-aware fallback chains with historical lineage
  - Feature override system for pronouns, conjugation, vocabulary

### Changed

- **📚 Localization Skill** — Updated to v1.1.0
  - +11 new triggers (Açoriano, Manezinho, Florianópolis, dialect inheritance, etc.)
  - +2 new synaptic connections (refactoring-patterns, academic-research)
  - Added "When to Use Dialect-Level Localization" decision guide

### Insight

- **Cross-Domain Pattern Discovered**: Manezinho (Florianópolis dialect) inherits from Açoriano (Azores Portuguese) via 1748-1756 migration — demonstrating multiple inheritance in linguistics, just like derived classes in OOP.

---

## [3.7.5] - 2026-01-31 🌅 Dawn Beta 2

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Release automation and skill creation

### Added

- **📦 Release Process Skill** — Master-only skill for marketplace publishing
  - PAT setup and troubleshooting guide
  - Version strategy documentation
  - Complete release workflow reference

### Changed

- **🔧 Release Scripts** — Updated for platforms/vscode-extension structure
  - Preflight checks PAT, version sync, heir version
  - Fixed exit code handling in preflight script
  - Scripts now work from repo root

---

## [3.7.4] - 2026-01-31 🌅 Dawn Beta

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Comeback Plan Phase 4 - Build & Distribution Testing

### Focus

First beta after completing Comeback Plan Phases 1-3. New build workflow, proper skill inheritance, and heir architecture sync.

### Added

- **🔧 Build Script** — `build-extension-package.ps1` for heir synchronization
  - Copies root `.github/` to extension with proper exclusions
  - Excludes 9 master-only skills (global-knowledge, meditation, self-actualization, etc.)
  - Excludes dev files (MASTER-ALEX-PROTECTED.json, episodic sessions)
  - Generates BUILD-MANIFEST.json with sync metadata

- **🔍 Architecture Audit Skills** — New skills for codebase validation
  - `architecture-audit` (inheritable) — General audit procedures
  - `master-alex-audit` (master-only) — Master Alex-specific validation

### Changed

- **📦 Heir Architecture** — Proper skill inheritance model
  - Heir receives 38 inheritable skills (not 47)
  - Master-only skills excluded from distribution
  - `copilot-instructions.md` correctly lists heir skills

- **📋 Documentation** — Updated Comeback Plan to v3.8.0 target
  - Phase 1-3 marked complete
  - 29 commands documented (was 16)
  - 11 MCP tools documented

### Fixed

- Heir `copilot-instructions.md` now lists 38 skills (was incorrectly listing 47)
- Build script path separator normalization for Windows
- Skill network diagram includes all 47 Master skills

---

## [3.7.3] - 2026-01-30 🔧 Beta 3

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** Data quality, upgrade system, architecture sync

### Focus

Under-the-hood improvements: Global Knowledge normalization, upgrade system rewrite, and full skills architecture sync.

### Added

- **🔄 Global Knowledge Migration** — Automatic data quality normalization
  - Auto-generates missing tags from title keywords
  - Infers categories from content keywords (e.g., "test" → testing)
  - Normalizes malformed source fields ("Alex_Sandbox" → "Master Alex")
  - Runs transparently during cloud sync (push/sync operations)
  - Preserves all existing valid data

- **📚 Full Skills Catalog** — 46+ skills packaged with extension
  - Every skill includes `SKILL.md` and `synapses.json`
  - Enables skill catalog diagram generation
  - Complete skill network for new installations

### Changed

- **⚡ Upgrade System Rewrite** — Safer, more reliable upgrades
  - Proper backup creation before any modifications
  - Preserves user content (domain-knowledge, custom skills)
  - Cleaner file-by-file update logic
  - Better error handling and rollback support
  - Integrated with workspace protection (kill switch)

- **🧹 Architecture Cleanup** — Removed legacy domain-knowledge files
  - DK files migrated to skills architecture
  - Cleaner `.github/` folder structure
  - Reduced extension package size

### Fixed

- Global knowledge entries with empty tags now auto-populated
- Entries with "uncategorized" category now properly inferred
- Source field inconsistencies normalized across all entries

---

## [3.7.2] - 2026-01-30 🎨 Beta 2

> **Status:** Pre-release (use `--pre-release` flag)
> **Focus:** UX polish, command parity, skill catalog generation

### Focus

User experience improvements, flexible UX across all entry points, and the new Skill Catalog Generator.

### Added

- **🌐 Generate Skill Catalog Command** — New VS Code command to create network diagrams of all skills
  - Scans all `.github/skills/` directories for `synapses.json` files
  - Generates Mermaid diagram with skill relationships
  - Supports bidirectional (`<-->`) and weak (`-.->`) connections
  - Multi-target syntax for cleaner diagrams
  - Available via Command Palette, Status Bar menu, and Welcome View

- **📊 Enhanced Status Bar** — Rich status display at a glance
  - Shows health status (🟢/🟡/🔴/⚫)
  - Session timer when focus session active (🍅 25:00 or ☕ 5:00)
  - Streak indicator when > 0 days (🔥7)
  - Format: `$(brain) Alex 🟢 | 🍅 25:00 | 🔥7`

- **🚀 Enticing Uninitialized State** — Drive user activation
  - Status bar preview: `Alex ⚫ | 🍅 Focus | 🔥 Streaks | 💡 Knowledge`
  - Tooltip lists all features user would unlock by initializing
  - Clear call-to-action to encourage initialization

- **🎨 Welcome View Polish**
  - CX logo in header instead of 🧠 emoji
  - Expanded status grid (2 rows × 4 columns)
    - Health, Sync, Skills, Synapses
    - Patterns, Insights, Streak 🔥, Goals
  - Clickable BETA badge that opens diagnostics
  - Grouped Quick Actions (🧠 Core, 📚 Knowledge, ⚖️ Work-Life Balance, ⚙️ System)
  - Colored left borders for status states
  - Streak highlight with 🔥 when active
  - Goals show "+X today" in green

- **🔄 Command Parity** — Flexible UX across all entry points
  - 14 commands now accessible from Command Palette, Status Bar menu, AND Welcome View
  - New commands added to menus:
    - Generate Skill Catalog
    - Search Knowledge (Knowledge QuickPick)
    - Start Focus Session
    - Health Dashboard

- **📋 UI/UX Roadmap** — Added backlog to ROADMAP-UNIFIED.md
  - Proactive insights and learning reminders (planned)
  - Quick tips carousel (planned)
  - Context-aware actions (planned)
  - Notification system (planned)

### Changed

- **Synapse Schema** — Added `bidirectional` and `weak` boolean fields
- **Skill Catalog Generator** — Updated algorithm for high-fidelity diagrams

### Fixed

- **Bidirectional Connections** — Added `bidirectional: true` to 6 mutual reinforcement synapses:
  - testing-strategies ↔ debugging-patterns
  - microsoft-sfi ↔ privacy-responsible-ai
  - ascii-art-alignment ↔ markdown-mermaid
  - image-handling ↔ svg-graphics
  - lint-clean-markdown ↔ markdown-mermaid
  - release-preflight ↔ beta-tester

- **Health Dashboard UI** — Modernized visualization
  - Replaced 🧠 emoji with CX logo
  - Replaced ASCII art Synaptic Network with modern card-based UI
  - Grid of 4 metrics (Total, Healthy, Broken, Memory Files)
  - Progress bar with percentage
  - Styled issues list

- **Broken Synapses on Fresh Install** — Cleaned up orphaned references
  - Removed `VERSION-NAMING-CONVENTION.md` (file doesn't exist)
  - Removed `DK-HYBRID-DREAM-AI.md` and `DK-POST-DREAM-ENHANCEMENT.md` references
  - Removed `README.md` and `USER-PROFILE.md` synapses (optional files)
  - Removed `CONTRIBUTING.md` synapse (project-specific)
  - Fixed `ALEX-INTEGRATION.md` duplicate and non-existent file references

- **Upgrade Preserves User Content Better** — New versions of user-modified DK files now go to `archive/upgrades/.../new-versions/` instead of cluttering `.github/domain-knowledge/` with `.vX.X.X.md` files

---

## [3.7.1] - 2026-01-30 🔧 Beta 1

> **Status:** Pre-release
> **Focus:** Initial beta after Dawn stabilization

Minor version bump for initial beta testing after v3.7.0 Dawn release.

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
  - [COMEBACK-PLAN.md](alex_docs/archive/COMEBACK-PLAN.md) — Recovery roadmap
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

## [3.5.3] - 2026-01-29 ❌ BROKEN

> **Status:** Do not use. This version has cognitive architecture issues.

This version was released during the "Phoenix" attempt which caused Master Alex to lose coherence.
The extension code may work, but the `.github/` architecture was corrupted.

See [COMEBACK-PLAN.md](alex_docs/archive/COMEBACK-PLAN.md) for details on what went wrong.

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
