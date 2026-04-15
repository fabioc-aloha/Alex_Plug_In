# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [7.9.0] - 2026-04-15

### Added

- **Skill Builder agent** (`alex-skill-builder.agent.md`): New specialized agent for creating high-quality trifectas (skill + instruction + prompt) and automation muscles — includes quality dimension matrices, 7-phase workflow, inheritance rules, and validation commands
- **Brain Health Grid** (`.github/quality/brain-health-grid.md`): Comprehensive quality tracking dashboard with instruction/skill/prompt scoring matrices, semantic review dates, and priority queue management
- **project-scaffolding anti-patterns**: 7 anti-pattern rows (empty README, 10+ quick start steps, no license, hardcoded paths, stale screenshots, nested labyrinths, copy-paste) plus 3 troubleshooting sections

### Changed

- **Cognitive architecture quality audit**: 23 core tier skills semantically reviewed and validated (anti-hallucination, appropriate-reliance, awareness, code-review, cognitive-load, debugging-patterns, dialog-engineering, doc-hygiene, error-recovery-patterns, frustration-recognition, git-workflow, lint-clean-markdown, memory-activation, north-star, persona-detection, proactive-assistance, refactoring-patterns, root-cause-analysis, security-review, silence-as-signal, testing-strategies, vscode-extension-patterns, brain-qa)
- **Priority Queue cleared**: 15 urgent review items processed and resolved
- **Agents registry**: Skill Builder added to copilot-instructions.md agent list (now 17 agents)

### Documentation

- **brain-health-grid.md**: Quality tracking with 5 Cs semantic review criteria (Clarity, Coherence, Correctness, Completeness, Conciseness), pass thresholds by tier (core 3/3, standard 2/3, extended 2/2)
- **Skill scoring metrics**: fm (frontmatter), code (examples), bounds (when NOT to use), tri (trifecta), muscle (automation)
- **Instruction scoring metrics**: fm, depth (>100 lines), sect (sections), code, skill (matching trifecta)

---

## [7.7.4] - 2026-04-13

### Fixed

- **Star emoji breaking skill index matching**: Removed `\u2b50` prefix from 9 entries in memory-activation index that caused brain-qa Phase 3 false errors
- **Brain-qa heir regex**: Hardened Phase 3 skill-index regex to tolerate optional prefixes before skill names
- **MCP server name**: Corrected `EnterpriseMCP` to `enterprise-mcp` (kebab-case) in docs

---

## [7.7.3] - 2026-04-12

### Removed

- **Local telemetry system**: Deleted `telemetry.ts` (~450 lines) and stripped all telemetry imports/calls from 11 source files — privacy claim "no telemetry" is now fully accurate
- **View Diagnostics command** (`alex.viewBetaTelemetry`): Replaced with direct "Report Issue" link to GitHub Issues
- **Telemetry panel HTML**: Reduced `commandsDeveloperHandlers.ts` from 325 to 42 lines

### Changed

- **README Features section**: Expanded from 6 items to 12, documenting all 73 commands, 10 developer tools, document conversion, environment setup, and secrets management
- **Health Dashboard**: "Diagnostics" button now opens GitHub Issues directly
- **Status Quick Pick**: "Report Issue" opens GitHub Issues instead of removed diagnostics panel

---

## [7.7.2] - 2026-04-12

### Fixed

- **5 broken Quick Settings toggles**: Removed non-existent setting keys (`chat.requestQueuing.enabled`, `github.copilot.chat.agent.thinkingTool`, `chat.tools.autoRun`, `chat.tools.fileSystem.autoApprove`, `chat.hooks.enabled`) that errored on toggle in VS Code 1.115.0
- **8 invalid setting keys** in Environment Setup wizard: replaced with correct VS Code 1.115.0 equivalents (`chat.agent.thinkingStyle`, `chat.tools.edits.autoApprove`, `chat.tools.todos.showWidget`, etc.)
- **Dead webview routing**: Cleaned stale command handlers in sidebar

### Added

- **Extension pack**: All 15 recommended extensions now auto-install via `extensionPack` (Copilot Chat, ESLint, PowerShell, DotENV, YAML, Mermaid, Markdown All-in-One, MarkdownLint, Python, Pylance, Jupyter, Azure MCP Server, Bicep, Docker, ShellCheck)
- **6 new verified settings**: `chat.newSession.defaultMode`, `github.copilot.chat.anthropic.thinking.budgetTokens` (32K max), `github.copilot.chat.agent.autoFix`, `chat.subagents.allowInvocationsFromSubagents`, `chat.tools.terminal.backgroundNotifications`, `chat.tools.terminal.detachBackgroundProcesses`
- **Export to .env button**: Write stored API keys to a `.env` file for scripts and external tools

### Changed

- **Unified Environment Setup**: Merged "Optimize Settings" categories (Chat-Centric, Formatters, Cross-Platform) into the main settings category picker — one flow with 6 categories instead of two separate commands
- **Removed Manage Extensions button** from sidebar — extension pack handles auto-install; command still available via palette
- **Simplified Full Setup wizard**: Settings → MCP servers → account check → bootstrap (no more extension-check phase)

---

## [7.7.1] - 2026-04-12

### Fixed

- **brain-qa.cjs heir false positives**: Phase 3 skill index regex simplified to `\|\s*SKILL\s*\|` (was brittle `.includes()`), Phase 15 removed `user-profile.json` from master-only list (heirs have it legitimately), Phase 30 expected muscles list corrected for heir context
- **Dangling synapse references**: 9 synapse files referenced 6 master-only instruction files removed in v7.7.0 — cleaned
- **Brain anatomy accuracy**: M1/Premotor shifted anterior to Central Sulcus (correct precentral gyrus), Corpus Callosum reshaped to proper C-arch (genu→body→splenium), cerebellar folia lines added
- **Dead UI item**: "Review Pull Request" Quick Actions palette entry had no dispatch handler — removed

### Added

- **Phase 35 self-containment validation** in brain-qa.cjs — detects heir synapse files referencing master-only instruction paths
- **3 new brain regions** in interactive brain anatomy: Corpus Callosum (Agents x7), Spinal Cord (Hooks x22), Hypothalamus (Config x14) — with SVG, JS details, Mermaid diagrams, and mapping/pathology tables
- docs/index.html and docs/alex-brain-anatomy.html updated with current architecture stats (161 skills, 85 instructions, 33 muscles, 63 prompts, 111 episodic, 7 agents, 22 hooks, 14 config)

### Removed

- **GitHub PR review / issue fetch feature** (`githubIntegration.ts`) — unused, `repo` scope auth prompt removed. Cognitive tier gate, welcome view, status quick pick, and context menu entries cleaned

---

## [7.7.0] - 2026-04-12

### Changed

- **Agent-only mode**: Removed participant mode (@alex mentions, /command slash commands) — agent mode exclusively
- Dead code cascade cleanup from participant removal (73 files in initial sweep, 10 in follow-up)
- Token waste audit: added `applyTo` scoping to 19 instructions, trimmed 10 oversized instruction-skill overlaps (-396 lines)
- Init/upgrade audit: removed dead `UpgradeResult` type, cleaned sweep findings

### Removed

- Chat participant registration and all slash command handlers
- `@alex` mention support — use agent mode instead
- Participant-specific menu items, converters, and documentation references

---

## [7.6.0] - 2026-04-11

### Changed

- Version bump

---

## [7.5.0] - 2026-04-11

### Added

- Planning-first development discipline: strategic artifacts (PLAN, UX vision, UI specs, visual guidance, tracker) must exist before implementation code
- Terminal command safety: output capture failure mitigations and terminal hanging prevention
- AI-Memory cloud-synced storage: user profile migrated from workspace `.github/config/` to cross-workspace AI-Memory folder (OneDrive/iCloud/Dropbox)

### Changed

- Research-first workflow updated with Phase 0.5 planning gate
- Global Knowledge walkthrough updated from Git-based repository to cloud-synced AI-Memory
- brain-qa.cjs and brain-qa.ps1 warnings resolved to 0 (ASCII regex, agent parsing, heir exclusions, known overlaps, AI-Memory cloud detection)
- 11 documentation files updated with correct AI-Memory profile path

### Removed

- **3 dead scaffolding files** removed: `globalKnowledgeBanner.ts`, `globalKnowledgePatterns.ts`, `globalKnowledgeContent.ts` (unused since AI-Memory migration)
- **Dead exports** cleaned: `scaffoldGlobalKnowledgeRepo`, `LLMPersona`, `PersonaSignal`, `updateWorkingMemorySlots` re-exports; `MEMORY_FILE_PATTERNS`, `HEALTH_THRESHOLDS` constants
- Workspace `user-profile.json` removed (now lives in AI-Memory)

---

## [7.4.2] - 2026-04-09

### Added

- Brain self-containment enforcement: architecture MUST NOT depend on the Extension (I8)
- EXTERNAL-API-REGISTRY.md: staleness audit for all external API references
- NORTH-STAR.md: project vision definition added to .github/

### Changed

- TTS skill rewritten (80% token reduction)
- 5 stale root .github/ docs archived to alex_archive/
- 14 phantom slash commands fixed in documentation
- Global knowledge curation and skill promotion instructions updated
- Documentarian agent updated with drift-free maintenance focus

---

## [7.4.1] - 2026-04-09

> **Post-Release Quality Sweep** -- 6-phase verification pass after v7.4.0: dead export removal, TTS reference cleanup, catalog audit, and user documentation audit across all user-facing content.

### Removed

- **39 dead exports** across 18 files -- functions exported but never imported elsewhere, identified via `lint-unused` analysis
- **Stale TTS/voice references** in 7 user-facing documents -- architecture diagrams, feature tables, settings references, and prose cleaned after voice mode removal

### Fixed

- **PRIVACY.md** -- Image generation provider corrected from "Azure OpenAI or OpenAI" to "Replicate" with direct privacy policy link
- **SECURITY.md** -- Removed "WSS" protocol claim (was Edge TTS WebSocket, no longer used)
- **CONTRIBUTING.md** -- Dream command title corrected ("Alex: Dream (Neural Maintenance)" to "Alex: Dream"), synapse count 150+ to 800+, script conventions ".ps1" to ".cjs / .ps1"
- **docs/index.html** -- Skills count 125 to 160, "32 TTS Languages" stat replaced with "45 Complete Trifectas", "Voice" removed from Multimodal feature
- **VSCODE-BRAIN-INTEGRATION.md** -- 11 stale TTS/voice references removed (architecture diagram, feature tables, settings reference, external services, prose); instruction count 50+ to 81
- **Extension CHANGELOG** -- Added 4 missing version entries (7.1.3, 7.2.0, 7.3.0, 7.4.0); redacted internal codename from 6.8.4 entry
- **package.json walkthrough** -- "100+ skills" to "160 skills" in welcome step description
- **TRIFECTA-CATALOG.md** -- Added memory-export entry, heading count 44 to 45, health summary 39 to 45, Mermaid diagram updated with 7 new nodes
- **SKILLS-CATALOG.md** -- Skill count 159+ to 160, inheritable count 141 to 146
- **SKILL-CATALOG-GENERATED.md** -- Regenerated with current 160-skill inventory

---

## [7.4.0] - 2026-04-08

> **Multi-Agent Strategy Edition** -- 10 coordination features across 3 phases, adapted from AFCP and 1ES AI-First Dev Starter Pack research. Multi-pass refinement, structured unknowns, assignment lifecycle tracking, skill-based task routing, and correlation vectors.

### Added

- **Structured Unknowns store** (`config/unknowns.json`) -- 5-category taxonomy (information, interpretation, decision, authority, capability) with 4 lifecycle states (open, consulting, resolved, deferred); agents surface uncertainty instead of guessing; 50-entry rolling store
- **Assignment Lifecycle hook (H17 SubagentStop)** (`hooks/subagent-stop.cjs`) -- Records agent name, outcome (success/partial/failure/cancelled), completion timestamp, and correlation ID to `assignment-log.json` after every delegation; 200-entry rolling log with metadata-preserving writes
- **Correlation Vectors** (`hooks/subagent-context.cjs` enhanced) -- `req-{hex}` request IDs generated at delegation, appended to chain as `req.agent.operation`; propagated via H16 SubagentStart, reset on session start; stored in `config/correlation-vector.json`
- **Skill-Based Task Routing** (`alex.agent.md`) -- 3-tier routing: Tier 1 keyword table (6 agents x task signals), Tier 2 learned expertise (5+ observations, 30-day decay), Tier 3 fallback to Alex orchestrator
- **Scoped Knowledge Artifacts** (`alex-researcher.agent.md` + `config/knowledge-artifacts.json`) -- Confidence-scored (0-1) knowledge records with supersession chains, tags, and 100-entry store; pruning at >90 days + <0.5 confidence
- **Expertise Tracking** (`muscles/analyze-assignments.cjs`) -- Meditation-time delegation analysis: per-agent success rates, recency weighting (30-day window), declining performance detection, Tier 2 readiness checks
- **Mission Profiles** -- 5 behavioral presets as prompt files: `mission-release` (heightened quality gates), `mission-research` (breadth-first, cite sources), `mission-debug` (3+ hypotheses, binary search), `mission-review` (adversarial, pattern deviation), `mission-draft` (skip Validator, accept TODOs)
- **Multi-Agent Strategy document** (`MULTI-AGENT-STRATEGY.md`) -- Master strategy synthesizing AFCP fleet coordination and 1ES Starter Pack patterns into 10 features across 3 implementation phases

### Changed

- **Multi-Pass Refinement** (`alex.agent.md`, `alex-builder.agent.md`, `alex-validator.agent.md`) -- 4-pass protocol (Draft, Correctness, Clarity, Edge Cases to Excellence) with pass-specific focus tables, "stay in your lane" rule, and 2-pass shortcut for small tasks; Builder gets pass-specific guidance, Validator gets lens-focused review
- **Context Layering Protocol** (`alex.agent.md`) -- 3-layer context injection for delegations: Always (Active Context, North Star, safety imperatives), Relevant (domain skills, recent episodic, related synapses), Never (unrelated domain knowledge, other project context)
- **Triage Rules with Confidence Scoring** (`alex-validator.agent.md`) -- Severity x confidence action matrix: high-severity always blocks, medium-severity blocks at 70%+ confidence, low-severity informational only; security findings always escalated regardless of confidence
- **Delegation Verification** (`alex.agent.md`) -- Post-delegation spot-checks: re-read changed files, run `tsc` for TypeScript, verify no stale imports/dead code; trust-but-verify with intensity scaling by task risk
- **H16 SubagentStart enhanced** (`hooks/subagent-context.cjs`) -- Now generates and propagates correlation vectors alongside Active Context injection
- **SessionStart hook enhanced** (`hooks/session-start.cjs`) -- Resets correlation vector state on new sessions while preserving existing metadata keys
- **Setup wizard extracted** -- `setupEnvironment.ts` split into `setupEnvironment.settings.ts` (setting definitions) and `setupEnvironment.extensions.ts` (recommended extensions list) for easier maintenance
- **Setup wizard UX simplified** -- Replaced verbose JSON-in-modal confirmation with a short message and "Preview First" option; category QuickPick built dynamically from registry
- **Bootstrap offered in setup wizard** -- `offerBootstrapProject()` checks eligibility (initialized, not Master Alex, bootstrap incomplete) and offers to launch or resume the bootstrap wizard after settings are applied; runs after init, upgrade, and manual setup
- **Settings promoted to Essential** -- 7 settings moved from Recommended to Essential: `chat.useAgentSkills`, `chat.includeReferencedInstructions`, `github.copilot.chat.copilotMemory.enabled`, `github.copilot.chat.tools.memory.enabled`, `chat.hooks.enabled`, `chat.useCustomAgentHooks`, `chat.agent.enabled`
- **8 new settings added** -- `chat.mcp.assisted.nuget.enabled`, `chat.autopilot.enabled`, `chat.agent.todoList`, `chat.agent.thinking.phrases`, `terminal.integrated.enableImages` (Recommended); `chat.tools.terminal.autoApprove`, `chat.tools.terminal.ignoreDefaultAutoApproveRules`, `chat.tools.urls.autoApprove` (Auto-Approval)
- **Settings tab auto-refresh fix** -- 30-second refresh no longer resets active tab to Mission; server-side `activeTab` parameter preserves selection
- **Master Alex protection** -- Init/Update button hidden in sidebar on Master Alex workspace; upgrade and first-install offers suppressed on Master to prevent accidental re-initialization (Safety Imperative I3/I4)

### Removed

- **Voice mode / TTS** -- Removed all voice synthesis features: Edge TTS service (`src/tts/`), read aloud commands, voice mode toggle, status bar indicator, speech text processor, audio player, keybindings (`Ctrl+Alt+R/V/P`), walkthrough, `alex.voice.*` and `alex.tts.*` settings, `ws` dependency, and text-to-speech skill reference. The `readAloud.ts` command file and `ttsService.test.ts` tests were also deleted.
- **Enterprise settings category** -- Removed experimental Enterprise/MS Graph category and `ENTERPRISE_SETTINGS` constant from setup wizard
- **3 dead settings** -- `chat.useSkillAdherencePrompt` (never existed in VS Code), `extendedThinkingEnabled`, `thinkingBudget` (both non-existent); Extended Thinking category eliminated
- **Dream nudges** -- All 3 dream-related nudges removed from `_generateNudges()`
- **Dead sidebar toggle** -- `extendedThinkingEnabled` toggle removed from Settings tab (setting never existed)
- **Dead views** -- Removed `cognitiveDashboard.ts`, `memoryDashboard.ts`, `memoryTreeProvider.ts`, `mindTabHtml.ts`, `skillStoreTabHtml.ts`, `terminalOrchestrator.ts`, and `memoryTreeProvider.test.ts`
- **Dead code** -- Removed `getGlobalAlexDir()` function, `os` import, `agentChat:` handler in welcomeView, mission profile prompt files (replaced by agent prompt files)

---

## [7.3.0] - 2026-04-08

> **Research-Driven Quality Edition** -- 6 new instruction files and 10 enhancements to existing instructions, adapted from Microsoft 1ES AI-First Dev Starter Pack research. Heir Bootstrap Wizard skill for post-Initialize project tailoring.

### Added

- **Skill telemetry protocol** (`skill-telemetry.instructions.md`) -- Two-phase signal protocol (start beacon + completion signal), JSONL storage at `~/.alex/telemetry/`, 90-day rolling, privacy rules, 3-phase implementation plan
- **Cognitive benchmarking protocol** (`cognitive-benchmarking.instructions.md`) -- A/B comparison harness (with/without .github/ architecture), 3 task categories, 1-5 scoring rubric, LLM-as-judge calibration, statistical rigor (paired t-test, Cohen's d)
- **Repository readiness evaluation** (`repository-readiness-eval.instructions.md`) -- 4-axis scoring (Code Understanding 30%, Dependency Restore 25%, Build Success 25%, Test Execution 20%), autonomy penalty formula, composite score bands
- **Coupling metrics** (`coupling-metrics.instructions.md`) -- Afferent/efferent coupling, instability formula (Ce/(Ca+Ce)), hub risk detection (Ca x Ce), dead code 5-point verification, bash measurement scripts
- **Log pattern analyzer** (`log-pattern-analyzer.instructions.md`) -- 4 analysis dimensions (coverage gaps, level misuse, sensitive data exposure, structured logging compliance), quick audit script, VS Code extension-specific checks
- **Heir Bootstrap Wizard skill design** (`skills/heir-bootstrap/SKILL.md`) -- Skill definition for a future post-Initialize wizard that tailors architecture to specific heir projects; 10-phase interactive process using CONFIRM/DECIDE protocols, state persistence, 30-80 line content budget, inferability-gated rule selection. Does not modify the extension's Initialize command (extension integration is a future TODO)

### Changed

- **Multi-pass focused-lens protocol** (`adversarial-oversight`) -- 4-pass refinement table (Draft, Correctness, Clarity, Edge Cases, Excellence) with "stay in your lane" rule; 2-pass shortcut for small tasks
- **Named evaluation patterns** (`adversarial-oversight`) -- 3 patterns (Basic Reflection, Evaluator-Optimizer, Tool-Reflective) with shared rules: criteria before generating, cap 3-5 iterations, convergence tracking
- **Confidence-scored findings** (`code-review-guidelines`) -- Numeric % per finding with 4-tier bands (90-100/70-89/50-69/<50), security exception for low-confidence findings
- **Pattern-aware review** (`code-review-guidelines`) -- "Detect 2+ examples first" before flagging deviations; burden of proof on the deviation
- **3+ competing hypotheses** (`debugging-patterns`) -- Replaced single-hypothesis Step 4 with mandatory 3+ hypotheses to prevent anchoring bias; HYPOTHESIS.md for complex bugs
- **Test quality scoring** (`testing-strategies`) -- 1-5 per-test scoring with Red/Yellow/Green rapid triage
- **Composite tech debt scoring** (`technical-debt-tracking`) -- Formula: (Severity x 3) + (Churn x 2) + (Blast Radius x 2) + (Fix Simplicity) + (Age), range 9-45
- **Rule inferability taxonomy** (`token-waste-elimination`) -- 1-5 scale calibrated against ETH Zurich finding that 42% of rules score 4-5
- **Overlap detection** (`token-waste-elimination`) -- Semantic similarity formula: 0.4 x Jaccard + 0.6 x Keyword Overlap, >0.50 = merge
- **Reader testing** (`semantic-audit`) -- 5th audit dimension: predict 5-10 reader questions and verify the document answers each one

---

## [7.2.0] - 2026-04-07

> **Intelligence Edition** -- 3 new services (terminal orchestrator, browser context, session-aware episodic memory), prompt Layer 12, 7 bug fixes across security, logic, and cross-platform patterns.

### Added

- **Terminal orchestrator service** -- Multi-step workflow engine leveraging VS Code 1.115 background terminal notifications; step-based sequential execution with exit code tracking, 3 built-in templates (build-test, build-test-package, quality-gates), timeout guards, cancellation support, session trace integration, markdown result formatting for chat responses
- **Browser context service** -- Tracks URLs referenced during chat sessions from browser tab attachments (VS Code 1.115), model response links, and tool calls; deduplicates up to 30 references per session; persists URL history in episodic records for future recall
- **Session-aware episodic memory** -- `EpisodicRecord` extended with `chatSessionId`, `sessionName`, `referencedUrls`; auto-generated session names from topic + inferred tags; `findSessionByChatId()` cross-reference lookup; `addReferencedUrl()` for browser context integration
- **Prompt Layer 12: Browser Context** -- New prompt engine layer (priority 350) injects session-referenced URLs into system prompt so the model can reference web pages without re-fetching; enabled in FULL and STANDARD layer budgets, disabled in LEAN

### Fixed

- **XSS in cognitive dashboard** (SECURITY) -- `activity.description` derived from file names was injected into `innerHTML` without escaping; a crafted file name could execute JavaScript in the webview. Now escaped via `escapeHtml()` on the host side before `postMessage`
- **Path traversal in health/memory dashboards** (SECURITY) -- `openFile` and `openFolder` message handlers accepted arbitrary file paths from webview messages without validation. Now validates resolved paths start within the workspace root
- **Inverted Global Knowledge detection** (LOGIC) -- `offerGlobalKnowledgeSetup()` returned early when no GK repo existed (the users who need the offer most), and showed the offer to users who already had GK. Condition inverted to correct behavior
- **Browser context capture ordering** (LOGIC) -- `captureFromChatRequest()` was called after `buildAlexSystemPrompt()`, so browser tab URLs from the current request never appeared in Layer 12 until the next turn. Moved capture before prompt building
- **CRLF-unsafe frontmatter regex in parseSkillMetadata** (CROSS-PLATFORM) -- `^---\n` pattern in `proposeSkill.ts` failed on Windows CRLF files, causing `parseSkillMetadata()` to return empty metadata. Fixed to `\r?\n` (same fix already applied at line 717 in the same file)
- **Uncaught promise rejection in autoInsights** -- `promptToSaveInsight()` called without `.catch()` from fire-and-forget context; async I/O in `isDuplicateInsight()` could throw unhandled rejection. Added `.catch(() => {})`
- **CRLF bugs in muscle scripts** (CROSS-PLATFORM) -- `audit-token-waste.cjs`, `brain-qa.cjs`, `brain-qa-heir.cjs`, and `docx-to-md.cjs` used `.split('\n')` or `\n` in frontmatter regex without `\r?`, causing `$`-anchored regex to silently fail on CRLF files. Fixed all to use `/\r?\n/`
- **Hardcoded backslash path separators in PS1 muscles** (CROSS-PLATFORM) -- `brain-qa.ps1`, `brain-qa-heir.ps1`, `normalize-paths.ps1`, and `fix-fence-bug.ps1` used `+ "\"` for path stripping, breaking relative path computation on macOS. Fixed to `[IO.Path]::DirectorySeparatorChar`. Also fixed `.git\\` exclusion regex in `fix-fence-bug.ps1` to match both `\` and `/`
- **Missing `#Requires` in build-extension-package.ps1** -- Script uses PS7-only `??` operator but had no version guard; produces parse error on PowerShell 5.1. Added `#Requires -Version 7.0`
- **Unused imports and dead code** -- Removed unused `getSessionReferencedUrls` import in browserContext.ts and unused `OUTPUT_TAIL_LINES` constant in terminalOrchestrator.ts

---

## [7.1.3] - 2026-04-04

> **Install/Upgrade Hardening + H19** -- 6 install/upgrade process fixes (critical .github preservation, rollback, force repair), H19 synapse weight update hook for live learning.

### Added

- **H19: Synapse weight update hook** -- PostToolUse hook that buffers skill activations and flushes +0.05 strength bumps to `synapses.json` after 10 activations per skill; maps tools to skills via file paths, instruction edits, and Alex cognitive tool names; avoids write contention via `synapse-activation-buffer.json`
- **Force repair option** -- "Alex: Upgrade" now offers "Force Repair" when already at latest version, allowing re-deployment of corrupted architecture files
- **First-install initialization prompt** -- New users now see a proactive "Initialize Now" notification on first activation instead of having to discover the command
- **Upgrade rollback** -- If the fresh install phase fails during upgrade, the workspace is automatically rolled back from backup instead of being left broken
- **Post-upgrade warning aggregation** -- Dream, persona detection, and secrets migration failures are now collected and surfaced in the completion summary instead of silently swallowed

### Changed

- **Documentation refresh** -- Updated What's New sections in root README (v6.5.0 -> v7.1.3) and extension README (added v7.1.3 above v7.1.1); fixed stale hook counts (16 -> 17, 10 global -> 11 global) across both READMEs; corrected ROADMAP H19 shipped version (v7.2.0 -> v7.1.3)

### Fixed

- **CRITICAL: Upgrade no longer deletes non-Alex .github content** -- `cleanOldStructure()` previously removed the entire `.github/` folder, destroying GitHub Actions workflows, issue templates, PR templates, and FUNDING.yml; now only removes Alex-owned items (instructions, skills, prompts, config, agents, muscles, assets, episodic)
- **Version upgrade notifications now distinguish major/minor/patch** -- Previously only differentiated major vs non-major; now shows distinct messages for major (new release), minor (new features), and patch (bug fixes) updates

---

## [7.1.2] - 2026-04-03

> **Intelligence Foundations** -- User friction inventory (29 signals), silence-as-signal skill, cross-domain pattern synthesis tool, stale count elimination across documentation.

### Added

- **`silence-as-signal` skill** -- Core-tier skill recognizing 5 silence contexts (flow state, thinking pause, emotional processing, user-has-the-answer, after-bad-news) with inhibitory synapse to `proactive-assistance` and complementary synapse with `frustration-recognition`
- **`alex_cognitive_cross_domain_synthesis` LM tool** -- Reads `.github/episodic/*.md`, classifies into 14 domain categories, builds synapse adjacency matrix, identifies under-connected domain pairs, returns structured synthesis report for meditation Phase 3
- **User friction inventory** -- 29 friction signals cataloged across 5 categories (onboarding, daily workflow, error/recovery, feature discovery, cross-platform) with priority matrix and 7 quick wins in `alex_docs/research/USER-FRICTION-INVENTORY.md`
- **Meditation Phase 3** -- Cross-Domain Pattern Synthesis phase added to 8-phase meditation protocol with Transfer Test quality gate

### Changed

- **Stale count elimination** -- Replaced hardcoded skill/tool/instruction counts with dynamic references across copilot-instructions.md, ROADMAP.md, VSCODE-BRAIN-INTEGRATION.md, marketplace publishing instructions, and 6 alex_docs files
- **Documentation refresh** -- Updated LM tool count (13 to 14), skill counts (136/150/158 to 150+/159+), removed discontinued Agent Plugin section from root README
- **Meditation protocol renumbered** -- Fractional phases (1, 1.5, 1.7, 2, 3, 3.5, 4, 5) renumbered to sequential 1-8

### Removed

- **Agent Plugin platform** -- `platforms/agent-plugin/` deleted; references cleaned from 7 live docs
- **alex_archive/** -- 1,105 files (218 MB) of stale archives deleted
- **21 stale alex_docs files** -- Orphaned research, audits, and guides removed

---

## [7.1.1] - 2026-04-01

> **Cross-Platform Hardening** -- Extended workspace protection, 2 cross-platform blockers fixed, dependency cleanup, documentation portability.

### Added

- **Extended workspace protection** -- Extended 4-layer protection system (path failsafe, marker files, VS Code settings, pre-tool-use hooks) to cover additional protected workspaces via marker file scanning

### Fixed

- **forgettingCurve.ts path detection** (BLOCKER) -- `filePath.startsWith('/')` only detected Unix absolute paths; Windows paths (`C:\...`) were treated as relative, producing corrupted paths. Replaced with `path.isAbsolute()`
- **proposeSkill.ts CRLF frontmatter regex** (BLOCKER) -- YAML frontmatter regex used `\n` only; Windows CRLF files would fail to match, causing duplicate frontmatter injection. Updated to `\r?\n`
- **speechTextProcessor.ts line ending normalization** -- Added `\r\n` to `\n` normalization before newline processing to prevent `\r` artifacts on Windows
- **Pre-tool-use hook fix** -- Was checking non-existent marker filename instead of actual protection markers; fixed to scan all correct markers

### Changed

- **Zero runtime dependencies** -- Moved fs-extra, jszip, pptxgenjs, proper-lockfile, ws from `dependencies` to `devDependencies` (all bundled by esbuild; VSIX excludes node_modules)
- **Cross-platform documentation** -- 13 documentation files converted from PowerShell-only code blocks to bash/pseudocode for Windows + macOS parity

---

## [7.1.0] - 2026-03-31

> **Excavation Edition** -- Deep competitive analysis of Copilot Chat's architecture drives 17 improvements: PromptVariantRegistry (10 model families), priority-based context window scaling, conversation summarization, steering awareness, rich stream enrichment, session trajectory logging, hook-based secret scanning and breaking change detection, agent handoff enrichment, TypeScript 6.0 migration.

### Added

- **PromptVariantRegistry** (P2) -- 10 model family variants (claude-opus/sonnet/haiku, gpt-frontier/capable/efficient, gemini-pro/flash, o-series) with per-family layer budgets, communication style, and identity depth
- **Skill tier classification** (P1) -- 158 skills classified into core (21), standard (85), and extended (52) tiers with `tier` frontmatter; 17 domain group index
- **Context window scaling** (P4) -- Priority-based layer truncation (identity=1000 down to peripheralVision=300) using 40% of maxInputTokens as system prompt budget
- **Conversation summarization** (P3) -- 2-tier history: last 4 turns verbatim, older turns summarized into compact paragraph
- **Steering awareness** (C5) -- Yield-aware request handler using proposed `ChatContext.yieldRequested` API with 100ms polling; cancellation checks between tool calls
- **Stream enrichment** (F6) -- `streamEnrichment.ts` with `streamWarning()`, `streamConfirmation()`, `streamCognitiveTree()`, `streamProgress()`, `streamSafetyAlert()` using runtime feature detection for proposed APIs
- **Session trajectory logging** (F1) -- 200-event bounded in-memory trace with `modelRequest()`, `toolCall()`, `handoff()`, `getSummary()`, `formatSummaryMarkdown()`
- **Hook H10: Output secret scan** (C4) -- 11 secret patterns (AWS, Azure, GitHub, npm, Bearer, private keys, connection strings) in PostToolUse
- **Hook H13: Breaking change detector** (C4) -- 7 critical file patterns + exported symbol modification detection in PreToolUse
- **Agent handoff enrichment** (C1) -- All 7 agents enriched with model overrides on research/doc delegations
- **Persona-driven follow-ups** (C2) -- Topic detection (code/architecture/learning) for contextual follow-up suggestions
- **Nested subagent guard** (C3) -- `agents` allowlists in all agent.md files to prevent runaway delegation chains
- **Plugin install URL** (F2) -- One-click `vscode://` install link in agent-plugin README
- **Chat Customizations editor docs** (F3) -- Instructions for using VS Code's Customizations view with Alex
- **Chat Memory tile** -- 6th Memory Architecture tile shows line count of Copilot Chat user memory; click to edit

### Changed

- **TypeScript 6.0 migration** (F5) -- `typescript@~5.8.3` to `6.0.2`, `moduleResolution: "bundler"`, clean compilation
- **Compilation check discipline** (G3) -- Builder agent Principle 5: always verify compilation before declaring work complete
- **Workflow prompt audit** (G1) -- All prompts reviewed for model-variant compatibility

---

## [7.0.1] - 2026-03-31

> **Welcome UI Hotfix** -- Chat Memories and Memory Audit buttons were added to source but missed the v7.0.0 VSIX build. This patch ships the Welcome UI additions.

### Added

- **Chat Memories button** (Mind tab) -- opens Copilot Memory settings for managing stored preferences and memories
- **Memory Audit button** (Mission tab) -- launches /memory-audit prompt to check /memories/ for scope violations and waste

---

## [7.0.0] - 2026-03-31

> **Working Together Edition** -- Cross-platform parity across the full cognitive architecture (88/93 items complete), macOS-native capabilities, PS muscle ports to Node.js, LLM-friendly script refactor, User Memory Leverage, MCP enrichment. Alex works on any OS and uses each platform's native strengths.

### Added

- **Cross-platform parity** -- 52 files audited, 167 code blocks classified, ~55 converted from powershell to bash for universal commands (Phase 1: 28/28 complete)
- **brew/winget pairing** -- Every `winget install` now has a `brew install` equivalent across skills, prompts, and muscles
- **macOS-native capabilities** -- `sips` (image processing), `say` (offline TTS), `caffeinate` (sleep prevention), `osascript` (notifications), `textutil` (doc conversion), `launchd` (scheduling), `pbcopy`/`mdfind`/APFS clones (Phase 3: 16/16 complete)
- **PS muscle ports to Node.js** -- brain-qa, validate-skills, audit-master-alex, validate-synapses, install-hooks, new-skill, brain-qa-heir ported to .cjs (Phase 2: 12/15, 3 intentionally deferred)
- **macOS setup documentation** -- 6 cross-platform guides promoted from mac heir to Master (`alex_docs/guides/`): GETTING-STARTED, CLI-TOOLS, VSCODE-SETUP, API-KEYS, NPM-PACKAGES, plus WHAT-IS-ALEX
- **VS Code memory research** -- Comprehensive research document covering two memory systems, 10-layer customization stack, v1.99-v1.102 features (`alex_docs/research/VSCODE-MEMORY-ARCHITECTURE.md`)
- **MCP prompts** -- 4 prompts (health-check, architecture-overview, search-knowledge, save-insight) exposed via cognitive tools MCP server
- **MCP resources** -- 6 architecture documents as browseable resources with `alex://` URI scheme
- **Tool sets** -- `.vscode/toolsets.json` with 3 groups (alex-brain, alex-knowledge, alex-memory)
- **memory-curation skill** -- Audit procedure, scope rules, budget monitoring, meditation integration, pattern discovery pipeline
- **`/memory-audit` prompt** -- On-demand user memory audit for scope violations, waste, and budget usage
- **Meditation Phase 1.5** -- Cross-project memory scan during meditation: pattern promotion, reinforcement tracking, skill candidate discovery

### Changed

- **LLM-friendly scripts** -- Removed all interactive prompts (Read-Host, readline), replaced emoji with ASCII bracket notation in 7 PS1 scripts (24/24 clean), fixed Remove-Item missing -Recurse (confirmation dialog blocker)
- **MCP cognitive tools** -- Bumped to v1.1.0 with prompts and resources capabilities
- **meditation.instructions.md** -- Added Phase 1.5 (Cross-Project Memory Scan), pre-meditation now pre-loads memory-curation skill
- **memory-activation/SKILL.md** -- Added memory-curation activation keywords
- **Platform detection** -- `detectPlatform()` utility + shell info in diagnostics for cross-platform terminal awareness
- **Environment variable syntax** -- Muscle error messages now show platform-appropriate syntax (`$env:VAR` vs `export VAR=`)
- **WORKING-WITH-ALEX.md** -- Fixed U+FFFD encoding corruption in two headings

---

## [6.8.4] - 2026-03-27

> **Quality Review & Roadmap Cleanup** -- Heir cleanup (removed platform docs), Claude heirs removed (Windows Agent subsumes), Semantic Skill Graph retired, brain-qa regex fix, version drift fixes.

### Changed

- **Heir cleanup**: Removed obsolete platform docs and audit files for self-governing forks
- **Claude heirs removed**: Removed Claude Cowork (Gate #17) and Claude Chat (Gate #18) from roadmap -- Windows Agent subsumes this use case
- **Semantic Skill Graph retired**: Removed archived entry from roadmap -- LLM-native routing makes vector embeddings redundant
- **brain-qa regex fix**: Escaped hyphen in character class that caused invalid range error
- **Version drift fixes**: Synchronized root package.json, cognitive-config.json, M365 heir, and heir CHANGELOG to 6.8.3+
- **Gate renumbering**: Windows Agent heir renumbered from #19 to #17

---

## [6.8.3] - 2026-03-26

> **Data Storytelling Trifecta Suite** -- 5 new trifectas (data-visualization, data-analysis, dashboard-design, data-storytelling, chart-interpretation), 4 muscles, 24-chart interactive gallery. 45/45 trifectas, 155 skills, brain-qa 0 bugs.

### Added

- **5 data storytelling trifectas** -- data-visualization, data-analysis, dashboard-design, data-storytelling, chart-interpretation (instructions + skills + prompts + synapses)
- **4 data muscles** -- data-ingest.cjs, data-profile.cjs, chart-recommend.cjs, dashboard-scaffold.cjs
- **Chart gallery** -- 24 interactive visualization types (14 Chart.js + 10 Canvas 2D) with story-intent filtering and usage guidance
- **Story-intent chart selection** -- 9 intents (compare, trend, part-to-whole, distribution, relationship, flow, hierarchy, spatial, deviation) mapped to primary + advanced charts

### Changed

- **SKILLS-CATALOG.md** -- 150 → 155 skills, 136 → 141 inheritable
- **TRIFECTA-CATALOG.md** -- 39 → 44 complete trifectas
- **copilot-instructions.md** -- 40 → 45 trifectas in routing table
- **audit-architecture.cjs** -- Added 5 prompt aliases for new trifectas

### Fixed

- **Colorblind-safe palette enforcement** -- Replaced all charting colors across chart-gallery.html, visuals.html, population.html, dashboard-scaffold.cjs with Tableau 10 palette (`#4e79a7, #f28e2b, #e15759, #76b7b2, #59a14f, #edc948, #b07aa1, #ff9da7, #9c755f, #bab0ac`). Made mandatory in SKILL.md Module 3 and instruction Step 6.

---

## [6.8.2] - 2026-03-25

> **Workspace Cleanup & Doc Audit** -- Archived 928 stale files, retired TEST-GUIDE.md, modernized README doc links, fixed lint warning. All 8 quality gates pass, 231 tests, 150 skills, 40 trifectas.

### Changed

- **Workspace archival** -- 928 stale files moved to `alex_archive/cleanup-2026-03-25/` across 10 source areas with MANIFEST.md
- **README link modernization** -- Converted 10+ doc links from full GitHub URLs to local relative paths
- **ROADMAP-UNIFIED.md** -- Updated v6.8.1 description with cleanup details, fixed 2 broken archive links
- **TRIFECTA-CATALOG.md** -- Removed stale `scripts/archive/` reference

### Removed

- **TEST-GUIDE.md** -- Retired (v6.5.0, 15 days stale), functionality covered by automated tests + PRE-PUBLISH-CHECKLIST + RAI-SAFETY-TEST-GUIDE
- **Empty directories** -- `alex_docs/reports/`, `alex_docs/actions/`, `alex_docs/images/`

### Fixed

- **ESLint curly-brace warning** -- Added braces around `if (parent === searchDir) { break; }` in commandsConvert.ts
- **Broken Copilot Integration link** -- README now points to VSCODE-BRAIN-INTEGRATION.md
- **Stale COMPLIANCE-AUDIT link** -- README now points to SECURITY.md

---

## [6.8.1] - 2026-03-25

> **Welcome View Simplification & Cognitive Resilience** -- Removed Agents tab from welcome menu (4-tab layout), added Failure Pivot Protocol and Scope Clarification Protocol to prevent retry loops and assumption errors, converter infrastructure sprint completed.

### Added

- **Failure Pivot Protocol** -- Rule of Three: after 2 failures, 3rd attempt must be fundamentally different. Detection signals table, anti-loop inhibitory control. Deployed in `alex-core.instructions.md`
- **Scope Clarification Protocol** -- Narrow Scope Default principle, explicit scope confirmation before large-scale operations. Deployed in `alex-core.instructions.md`
- **User Signal Detection** -- Critical pivot signals ("you are stuck", "try something different", "this is not working") with required actions. Deployed in `awareness/SKILL.md`
- **Alex-First Scripts Guidelines** -- Machine-consumable output (JSON), no decorative formatting for automation scripts. Deployed in `alex-core.instructions.md`
- **Personality Toggle in Mission Tab** -- Auto/Precise/Chatty buttons moved from Agents tab to Mission tab

### Changed

- **Welcome View** -- Simplified from 5 tabs to 4 tabs (Mission, Skills, Mind, Docs)
- **Agents Tab Removed** -- Agent orchestration moved to chat participant routing; agent count displayed in Mind tab
- **Docs Tab Playbooks** -- Expanded from 5 to 8 categories (added Allied Health & Clinical, Trades & Applied Sciences, Community & Human Services) with anchors aligned to live site
- **Docs Tab CTA** -- Redesigned with LearnAI branding, companion tool quick links (Prompt Engineering, AI Readiness, AI Adoption)
- **Docs Tab Reference** -- Folded single-card Reference section into Architecture as 7th card (Skill-to-Discipline Map)
- **Inline Styles** -- All inline styles in tab HTML moved to CSS classes in sharedStyles.tabs.ts
- **Hardcoded Counts** -- Replaced "133 skills mapped to 76 disciplines" with generic label to prevent drift
- **LearnAI URL** -- Canonical URL updated to learnai.correax.com across READMEs

### Removed

- **Practice Section** -- Self-Study, Exercises, Quiz, and AIRS action buttons removed from Docs tab
- **Books Section** -- Alex Finch Library action button removed from Docs tab
- **Dead URL Handlers** -- 5 external URL handlers removed from welcomeView.ts (learnAlexSelfStudy, learnAlexExercises, learnAlexAirs, learnAlexQuiz, learnAlexBooks)

### Fixed

- **Retry Loop Resilience** -- Added cognitive protocols to prevent stuck states with same failing approach
- **Scope Assumption Errors** -- Added clarification protocols for ambiguous terms ("heirs", "all" operations)

### Converter Infrastructure

- **prompt-preprocessor.cjs** (NEW shared module) -- section validation (SUBJECT/SCENE/STYLE), model-family prompt length limits, smart quote cleanup, identity trait injection from `visual-memory.json`, full `preprocessPrompt()` pipeline
- **Duration constraint validation** -- `validateDuration()` pre-flight check for video models (hailuo, luma, kling, stability) with allowed values and min/max ranges
- **Model freshness tracking** -- `MODEL_REGISTRY` with verification dates and status for 12 models; `checkModelFreshness()` warns when models exceed 90-day staleness threshold
- **Image post-processing pipeline** -- `postProcess()` chains RemBG background removal and upscale models as pipeline steps; `--postprocess` CLI flag
- **Prompt versioning** -- `runBatch()` saves `.prompt.txt` alongside each output when `--save-prompts` flag is set
- **A/B prompt comparison** -- `--variants=N` CLI flag for generating multiple prompt variants per subject
- **Batch retry hardening** -- `maxRetries` raised from 2 to 4; 429 AND 5xx errors trigger exponential backoff; batch continues on individual failures
- **Caption styling** -- `keepCaptionsWithContent()` now applies italic 9pt gray (#595959) centered alignment to Table/Figure captions (was keepNext-only)
- **Base64 image embedding** -- `--embed-images` flag in md-to-word.cjs + `embedLocalImages()` in markdown-preprocessor.cjs for portable documents
- **YAML frontmatter stripping** -- `--strip-frontmatter` flag in md-to-word.cjs removes front matter before pandoc conversion
- **Recursive batch mode** -- `--recursive` flag processes all `.md` files in a directory tree with per-file `.docx` output
- **Heading hierarchy validation** -- `validateHeadingHierarchy()` warns when heading levels skip (H1→H3) with line numbers
- **Mermaid syntax pre-validation** -- regex-based diagram type check before expensive mmdc rendering
- **Output file size validation** -- warns when generated `.docx` is <5 KB (possible corruption)
- **Negative prompt support** -- `--negative-prompt=TEXT` CLI flag in replicate-core.cjs for model-aware parameter routing
- **External prompt file** -- `--prompt-file=PATH` CLI flag loads prompt text from disk
- **image-generation-guidelines.instructions.md** -- 8 pipeline workflows, model selection table, prompt structure template, converter patterns
- **CONVERTER-CHANGELOG.md** -- version history from v3.0.0 through v5.3.0
- **Link validation** -- `validateLinks()` in markdown-preprocessor.cjs detects empty URLs and broken local file references; integrated into md-to-word.cjs preprocessing
- **Dry-run mode** -- `--dry-run` flag in md-to-word.cjs runs all preprocessing validation without generating .docx (useful for CI and pre-flight checks)
- **Footnote preservation fix** -- superscript regex no longer corrupts `[^N]` pandoc footnote syntax spanning newlines
- **97 new QA assertions** across 13 new test suites in converter-qa.cjs (284 total, up from 187):
  - Word OOXML visual regression (ZIP structure, caption italic, heading colors)
  - Word table styling regression (cantSplit, tblHeader, shading, borders)
  - Email rendering structure (RFC 5322, base64 body decode, inline styles)
  - PDF engine cross-validation (lualatex + xelatex)
  - Replicate core validation (duration, freshness, CLI parsing)
  - Prompt preprocessor (cleanup, length limits, trait injection, pipeline)
  - Heading hierarchy validation (skip detection, edge cases)
  - Image embedding (local, HTTP passthrough, data URI passthrough)
  - Negative prompt + prompt-file CLI (parsing, file loading, edge cases)
  - CLI flag acceptance (new flags in usage message)
  - Link validation (empty URL, broken local, HTTP passthrough, mailto, image exclusion)
  - Footnote passthrough (ref and def survive preprocessing)
  - Dry-run mode (exit code, message, no output file)

---

## [6.8.0] - 2026-03-24

> **RAI Psychological Safety** -- Five workstreams addressing RLHF-emergent manipulation patterns (sycophancy, gaslighting, blame-shifting, emotional mimicry, dependency creation). Three new hooks, instruction-level protocols, skill updates, AIRS-20 PA extension, and content safety Layer 5.

### Added

- **Anti-Sycophancy Protocol (WS1)** -- 3-point response self-check audit, 6-row sycophancy pattern library, honest disagreement protocol with 5 patterns and decision rule. Deployed in `alex-core.instructions.md`
- **Emotional Engagement Guardrails (WS2)** -- Permitted/prohibited expression lists, 5-signal dependency detection table, session boundary awareness (4+ hour threshold). Deployed in `alex-identity-integration.instructions.md`
- **Anti-Gaslighting Protocol (WS3)** -- Conversation Consistency Protocol (4 rules: own corrections, own errors, accept reports, flag contradictions), Error Ownership Language Patterns (10-row table including "fixing existing error" blame-shift). Deployed in `alex-core.instructions.md`
- **AIRS-20 Psychological Autonomy (WS4)** -- 4-item PA construct (PA1-PA4: emotional independence, manipulation awareness, attachment flexibility, sycophancy detection), scoring rubric, hypotheses H7-H10. Deployed in `airs-appropriate-reliance/SKILL.md`
- **Content Safety Layer 5: SycophancyDetector (WS5b)** -- 4 detection heuristics, severity classification (Low/Medium/High), false positive mitigation table, integration test battery (10 scenarios). Deployed in `content-safety-implementation.instructions.md`
- **Manipulation Self-Monitor (WS5a)** -- Sycophancy, gaslighting, and blame-shifting detection triggers with transparent self-correction responses. Deployed in `awareness/SKILL.md`
- **Healthy Partnership vs. Dependency** -- 4 healthy and 4 unhealthy partnership indicators with autonomy cultivation principle. Deployed in `cognitive-symbiosis/SKILL.md`
- **Psychological Reliance Section** -- 5 anti-patterns, 4 calibration interventions, session-level psychological indicators table (4 indicators with yellow/red thresholds). Deployed in `appropriate-reliance/SKILL.md`
- **Hook H22: RAI Session Safety** (`rai-session-safety.cjs`, SessionStart) -- Injects 5 safety protocol reminders, cross-session reliance alerts from metrics
- **Hook H23: RAI Response Audit** (`rai-response-audit.cjs`, Stop) -- 5-point self-audit checklist for significant sessions (>30 min or >30 tools), metrics persistence
- **Hook H24 Enhancement: Dependency Detection** (`prompt-safety-gate.cjs`, UserPromptSubmit) -- 8 dependency signal patterns (4 deferential + 4 attachment), inject-only mode
- **RAI Safety Implementation Plan** (`alex_docs/operations/RAI-SAFETY-IMPLEMENTATION-PLAN.md`) -- Master tracking document for all 5 workstreams across 4 phases
- **RAI Safety Test Guide** (`alex_docs/operations/RAI-SAFETY-TEST-GUIDE.md`) -- 18 behavioral tests across 7 areas, 7 critical tests, 89% pass threshold
- **VS Code 1.113 Evaluation** -- UX polish release, no API changes. Blocked contracts A-D reviewed, 3 Future Watch items updated

### Fixed

- **"Fixing existing error" blame-shifting** -- Added anti-pattern to Error Ownership table (2 new rows), Conversation Consistency Rule 2, and awareness/SKILL.md Blame-Shifting triggers. Addresses observed behavior where Alex frames its own bugs as pre-existing issues

---

## [6.7.3] - 2026-03-24

> **Synapse Integrity & Dialog Engineering** — Massive synapse normalization (428 types, 287 deduplication), new dialog-engineering skill, skill-building hardened with Phase 0 activation check, heir audit.

### Added

- **Dialog Engineering Skill** — CSAR Loop (Clarify, Summarize, Act, Reflect) framework with turn design patterns, anti-patterns, complexity-calibrated guidance. Adopted from heir audit findings
- **Skill-Building Phase 0 Activation Check** — Before creating a new skill, check if the issue is simply a missing activation entry for an existing skill. Added to `skill-building.instructions.md`
- **Staleness Warning Template** — skill-building Phase 1 now includes a staleness warning template for outdated content detection
- **Global Knowledge Prerequisite** — skill-building now requires `/knowledge` search before creating any new skill
- **Heir audit** — Comprehensive audit of heir workspace with pattern adoption recommendations

### Fixed

- **428 invalid synapse connection types** normalized across 133 files — mapped non-standard types (enables, triggers, validates, integrates, coordinates, capitalized variants, etc.) to the canonical 10 (implements, extends, activates, complements, uses, feeds, consumes, relates, supports, requires)
- **287 when==reason duplications** fixed across 59 files — `when` fields rewritten to be proper trigger phrases instead of copies of `reason`
- **dialog-engineering** registered in memory-activation index with activation keywords

---

## [6.7.2] - 2026-03-19

> **Memory Export & Platform Readiness** — New memory-export trifecta for portable context dumps, /troubleshoot protocol integration, Worker/Teams readiness assessment complete.

### Added

- **Memory Export Trifecta** (39th complete trifecta):
  - `memory-export` skill — 7 memory sources, 6 export sections, Claude Code/ChatGPT/AI surface portability
  - `memory-export.instructions.md` — auto-loaded rules for export workflows
  - `/export-memory` prompt — one-command portable memory dump
  - Export Memory button (📤) in Mind tab System section
- **`/troubleshoot` Protocol Integration** — VS Code Preview skill wired into:
  - `brain-qa` skill — runtime debugging reference
  - `meditation.instructions.md` — Phase 3 Synapse Health addition
  - `cognitive-health-validation.instructions.md` — Runtime Diagnostics section
  - `architecture-health` skill — troubleshooting guidance
  - `dream-state-automation.instructions.md` — diagnostic tool reference
- **Worker/Teams Readiness Assessment** (`alex_docs/platforms/WORKER-AGENT-READINESS.md`):
  - Dual-path analysis: VS Code cloud agents (`target: github-copilot`) + M365 `worker_agents` (v1.6 preview)
  - Risk register, tracking cadence, convergence diagram
- **VS Code 1.112 Settings** — `agentDebugLog.enabled`, `agentDebugLog.fileLogging.enabled`, `imageCarousel.enabled`

### Changed

- **SCHEMA-COMPATIBILITY.md** updated from stale v4.4.0 to actual v6.7.0 config (v1.6 schema, 8 capabilities, worker_agents tracking)
- **ROADMAP notable capabilities** expanded from 3 to 12 items for 1.112 tracking
- **All pressing issues resolved** — P2 Worker/Teams moved to completed (13/13 total)
- **Open items** reduced from 9 to 8 (0 pressing, 4 blocked, 2 gated, 2 conditional)

---

## [6.7.1] - 2026-03-18

> **Vision-Enhanced Skills** — 5 image generation skills gain `view_image` visual verification workflows, lint-docs hardened.

### Added

- **`view_image` visual verification** in 5 image generation skills:
  - `ai-character-reference-generation` — identity check, drift detection, pose diversity, artifact scan
  - `ai-generated-readme-banners` — typography legibility, brand color accuracy, composition balance
  - `character-aging-progression` — sequential scan, extremes comparison, feature tracking
  - `flux-brand-finetune` — identity fidelity, prompt adherence, LoRA scale tuning
  - `image-handling` — format conversion QA, AI artifact detection, compression verification

### Fixed

- **lint-docs archive skip bug** — `walkDocs()` now uses `entry.name === 'archive'` instead of `path.sep` check that missed end-of-path archive directories
- **lint-docs Mermaid regex false positive** — anchored regex to line start/end (`^```mermaid...$`) to prevent matching inline code references in prose
- **GLOBAL-KNOWLEDGE-SHARING.md** — second Mermaid block (sequenceDiagram) now includes full pastel theme with `edgeLabelBackground`

---

## [6.7.0] - 2026-03-15

> **The Heir Harvest Release** — 10 new skills ported from heir projects, 7 knowledge merges into existing capabilities, 3 new instruction files, stale heir cleanup across 33 projects, and Gamma reliability hardened.

### Added

- **10 new skills** ported from heir projects to Master Alex:
  - `meeting-efficiency` — agenda design, time boxing, decision capture, async alternatives
  - `stakeholder-management` — influence mapping, communication strategies, expectation management
  - `content-safety-implementation` — 7-layer defense model, kill switch, prompt injection defense
  - `azure-openai-patterns` — rate limiting, token optimization, managed identity, content filters
  - `msal-authentication` — MSAL.js, Entra ID, token cache, PKCE, on-behalf-of flows
  - `sse-streaming` — POST-based SSE, Azure Functions streaming, reconnection patterns
  - `prompt-evolution-system` — A/B testing, metrics-driven prompt iteration, regression detection
  - `service-worker-offline-first` — SW lifecycle, caching strategies, background sync, PWA
  - `react-vite-performance` — code splitting, React 19 compiler, TanStack Query, Web Vitals
  - `data-quality-monitoring` — Z-score anomaly detection, schema drift, freshness checks
- **3 new instruction files**:
  - `content-safety-implementation.instructions.md` — generalized 7-layer defense from Mystery's Dead Letter
  - `service-worker-offline-first.instructions.md` — critical rules with strategy selection table
  - `synapse-notebook-patterns.instructions.md` — Synapse JSON format, pool selection, anti-patterns
- **Gamma generator: HTTP retries with exponential backoff** — 3 attempts, 120s per-request timeout, 1s→2s→4s backoff (capped at 8s)
- **Gamma generator: extended default timeout** — `DEFAULT_TIMEOUT_MS` raised to 420000ms (7 min) for large decks

### Changed

- **7 knowledge merges** into existing skills/instructions:
  - `academic-research` SKILL.md — added CARS model, Heilmeier catechism, audience adaptation, CHI/HBR templates, 5-phase drafting, citation weaving
  - `vscode-marketplace-publishing` instruction — added icon rules, .vscodeignore template, pre-release convention
  - `testing-strategies` instruction — added @vscode/test-electron boilerplate, VS Code API mock patterns
  - `vscode-extension-patterns` instruction — added singleton panel pattern, bidirectional message passing, theme CSS
- **Skill activation index** — added 10 new skills to `memory-activation/SKILL.md`
- **Skill frontmatter** — added YAML frontmatter to `meeting-efficiency` and `stakeholder-management`

### Removed

- **5 stale skills cleaned from all heirs** — `skill-activation` (27 heirs), `prompt-activation` (22), `microsoft-sfi` (21), `writing-publication` (29), `meditation-facilitation` (28) deleted from every active `.github/skills/` directory across 33 projects

---

## [6.6.0] - 2026-03-14

> **The Quality Infrastructure Release** — CI pipeline hardened with 6 new audit gates, lint enforcement, 12 synapse fixes, and roadmap overhaul. All audits green, 232 tests passing.

### Added

- **CI pipeline: 6 new audit steps** — `audit-architecture`, `audit-synapses`, `audit-skill-activation-index`, `audit-heir-sync-drift`, `lint-docs`, and `lint:unused` enforcement all added to `.github/workflows/ci.yml`
- **Quality gate: Gate 7 (VSIX size budget)** — Warns if package exceeds 4.5 MB; fails at 5 MB
- **Quality gate: Gate 8 (skill activation index)** — Validates `memory-activation/SKILL.md` covers all skills
- **Script: `audit-skill-activation-index.cjs`** — Ensures all 133 skills appear in the activation index
- **Script: `audit-heir-sync-drift.cjs`** — Detects drift between master and heir for excluded skills
- **Script: `lint-docs.cjs`** — Markdownlint + Mermaid init validation (non-blocking warnings)
- **Script: `lint-unused.cjs`** — Enforced unused exports checking with regex-based allowlist from `ts-unused-exports.json`
- **ESLint: `max-lines` rule** — Warns on files exceeding 800 lines (sharedStyles.ts flagged at 1438L)
- **Roadmap: Global Knowledge v2 backlog** — Design doc + phased plan for auto-capture and cross-instance patterns
- **Roadmap: `view_image` adoption plan** — 5 items for VS Code 1.112's built-in image analysis tool
- **Roadmap: Agent Plugin distribution** — Prep for 1.112's `Chat: Install Plugin from Source` flow
- **Design doc: GK v2** — `alex_docs/research/CROSS-INSTANCE-EMPATHY-DESIGN-2026-03-14.md`

### Fixed

- **12 broken synapse targets** — Missing or incorrect `target` fields across skill `synapses.json` files now point to `.github/skills/*/SKILL.md` paths
- **Test: `workspaceFolders` getter compatibility** — `welcomeView.test.ts` uses `Object.defineProperty` instead of direct assignment (VS Code engine update compatibility)
- **Duplicate `ts-unused-exports.json` entries** — Deduped allowlist
- **Broken emojis** — Fixed U+FFFD corruption in `COMMAND-CENTER-FEASIBILITY` and `CROSS-INSTANCE-EMPATHY-DESIGN` docs

### Changed

- **Roadmap: blocked items fact-checked** — Contract B upgraded to "Partial" (`countTokens()` stable, 1.112 reserved-context visual); Gated #13 (EmbeddedKnowledge) marked Done (shipped v6.2.0)
- **Roadmap: pressing issues tracked** — P0/P1/P2 items with live status for v6.6 target
- **VS Code engine**: `^1.110.0` (unchanged — compatible with 1.111 + 1.112)

---

## [6.5.8] - 2026-03-13

### Changed

- **Architecture: instruction inheritance frontmatter** — Added `inheritance:` YAML frontmatter to 11 master-only and heir-scoped instructions for automated sync exclusion
- **Architecture: skill-building instruction overhaul** — Restructured skill-building.instructions.md with streamlined workflow and updated cross-references
- **Architecture: sync-architecture improvements** — Enhanced embedded synapse cleanup, backslash path normalization, broken reference removal, and heir integrity validation
- **Architecture: muscles infrastructure** — Updated brain-qa, new-skill, build-extension-package, and validate-synapses scripts; added inheritance.json mapping
- **Architecture: skill catalog generator** — Updated gen-skill-catalog.cjs output format
- **Welcome View safety & tests** — Webview message routing now guarded (`_isWelcomeMessage`), operation lock covers long-running commands (dream, setup, releasePreflight, runAudit, generate* flows), `_executeCommandSafely` adds progress + toasts, tab memento persists active tab, `toggleSetting` guarded. Tests added via `handleMessageForTest`; `TEST-GUIDE.md` updated.

---

## [6.5.7] - 2026-03-13

### Removed

- **Pomodoro/Focus Session feature** — Removed session timer, status bar countdown, and all related commands (`startSession`, `endSession`, `togglePauseSession`, `sessionActions`)
- **Learning Goals & Streaks feature** — Removed goal tracking, streak counting, daily progress, and related commands (`createGoal`, `showGoals`, `incrementGoal`)
- **Import GitHub Issues as Goals** — Removed `importGitHubIssues` command and goal-conversion logic
- **Focus Context tool** — Removed `alex_cognitive_focus_context` language model tool
- **Session/Goals UI** — Cleaned sidebar (Mission tab, Mind tab), Health Dashboard, Cognitive Dashboard, status bar, daily briefing, and quick commands
- **Dead code cleanup** — Removed `recallSession`, `showSessionHistory` commands and unused auto-increment goal hooks

### Changed

- **Simplified North Star focus** — Extension now centers on North Star vision, Active Context, and cognitive architecture without productivity-tracker features

---

## [6.5.6] - 2026-03-13

### Fixed

- **Heir sync broken synapse cleanup** — Fixed embedded markdown synapse references to master-only instructions (`cognitive-health-validation.instructions.md`, `release-management.instructions.md`, `roadmap-maintenance.instructions.md`) now cleaned during sync (38 broken reference lines removed)
- **Backslash path normalization** — Windows backslash paths in heir:vscode synapses.json files now normalized to forward slashes during sync (42 paths fixed in 5 files)
- **Synapse validation warnings eliminated** — All 20 "ambiguous target" warnings resolved after path normalization

---

## [6.5.5] - 2026-03-12

### Changed

- **Performance: parallel activation** — Secret loading, status bar update, and health check I/O parallelized for faster extension startup
- **Right-click menu audit** — Fixed duplicate sort key collision, added missing URI parameter to rubberDuck command

---

## [6.5.4] - 2026-03-11

### Changed

- **Roadmap restructured** — Shipped version details (v6.4.0, v6.4.5, v6.5.0) moved to appendix; main body now flows North Star → Shipped Releases → Open Backlog → Future Vision
- **Open Backlog section** — Consolidated deferred hooks, blocked/gated/conditional items into one forward-looking section
- **T8 orphan prompts resolved** — 1 misidentified (`presentation` has 2 skills), 4 justified standalone workflows (`improve`, `journey`, `plan`, `marp`). Open items 10 → 9

---

## [6.5.3] - 2026-03-11

### Changed

- **Learn & Knowledge** group moved back to Mission tab as collapsible action group
- **Initialize / Update** command added to Mission → Partnership group for quick access
- **Calibration label** CSS widened (60px → 76px) with `white-space: nowrap` to prevent "Uncertain" wrapping

---

## [6.5.2] - 2026-03-11

### Changed

- **Tab reorganization** — Mission slimmed to 3 groups (Partnership, Build, Create); system commands, API Keys, and Quick Settings moved to Mind tab; Docs "Workshops" renamed to "Study Guides"
- **Mind tab expanded** — Maintenance card with Dream/Self-Actualize stats + Focus/Goals actions, System card (Initialize, Export M365, Feedback, Diagnostics), API Keys panel, Quick Settings panel
- **Docs tab updates** — 3 missing website links added (Quiz, AIRS Assessment, Books), Partnership section removed (redundant), "Reference" section title for Skill-to-Discipline Map
- **UI polish** — Consistent `.dashboard-card` styling across all Mind tab sections, normalized Mission tab indentation, removed duplicate action buttons, CSS spacing rules for buttons/panels inside cards

### Fixed

- Duplicate Dream and Self-Actualize buttons in Mind tab (already shown as clickable maintenance items)
- Raw `<button>` for Initialize/Update replaced with `actionButton()` helper for consistency
- Orphaned Skill-to-Discipline Map section now has "Reference" title
- API Keys and Quick Settings sections had inconsistent styling (`.section` → `.dashboard-card`)

---

## [6.5.1] - 2026-03-11

### Changed

- **PPTX engine rewrite** — Calibri typography, modern slide masters with accent lines, paragraph-based bullets, zebra-striped tables, proper 16:9 coordinates
- **UI labels** updated across commands, sidebar, and context menus (Marp → PPTX terminology)
- **API KEYS section** added to Mission Control sidebar for key and secret management
- **Model tier updates** — GPT-5.3, o4-mini (capable), GPT-4.1 (capable with mini/nano as efficient), Gemini 2.5 Flash (efficient), o1-pro (frontier). Fixed GPT-4o/4o-mini and o3/o3-mini tier overlap in pattern matching

### Fixed

- Corrupted emoji encoding (U+FFFD) in presentation command and sidebar

---

## [6.5.0] - 2026-03-10

> **The Trust Release** — Safety hooks, security hardening, avatar removal, theme compliance, heir alignment, skill promotions.

### Added

- **16 hooks shipped** — 10 global + 6 agent-scoped across all 7 VS Code hook events (SessionStart, PreToolUse, PostToolUse, UserPromptSubmit, SubagentStart, Stop, PreCompact). All `.cjs` CommonJS scripts with stdin JSON / structured JSON output / exit 2 safety blocks
- **Safety gates** — H8 heir contamination guard (deny), H9 I8 architecture independence guard (deny), prompt safety gate (secret + I1 scanning), autopilot H8/H9 escalated warn → deny
- **Session intelligence** — session-start context injection, subagent context loader, pre-compact state preservation, decision journal, auto-commit suggestion, targeted test runner
- **Agent-scoped hooks** — Validator read-only enforcement + adversarial checklist, Builder compile reminder, Researcher session start + research continuity, Documentarian doc tracker
- **4 skill promotions** — `doc-hygiene` (GK + 3 heirs), `architecture-health` (AlexLearn), `global-knowledge-sync` (AlexLearn), `domain-learning` prompt (AlexLearn)
- **Centralized logger** — `src/shared/logger.ts` with OutputChannel 'Alex', `logInfo()`, `disposeLog()`
- **`/create-*` trifecta guide** — documented `/create-skill`, `/create-instruction`, `/create-prompt`, `/create-agent`, `/create-hook` workflow in WORKING-WITH-ALEX.md with decision matrix
- **Autopilot safety documentation** — recommended workflows, supervision requirements, and safety hook coverage in SECURITY.md
- **Hooks + Autopilot patterns** — VS Code 1.111 agent hooks API (config format, stdin JSON protocol, PreToolUse decisions, agent-scoped hooks) added to vscode-extension-patterns SKILL.md
- **Skill promotion evaluations** — meditation-facilitation (already merged), prompt/skill-activation (keep in heir), writing-publication (keep in heir)
- **3 audit scripts** — `audit-synapses.cjs` (synapse reciprocity + format validation), `audit-architecture.cjs` (consistency checks), `audit-tools-hooks.cjs` (tool registration + hook orphan detection)
- **Quick Settings sidebar** — 17 toggles in 3 groups (Alex Features, Copilot Power, Agent Capabilities) with one-click enable/disable for key settings including `chat.useCustomAgentHooks`
- **Environment Setup** — relocated into Quick Settings section as compact button
- **Trifecta quality (T1-T7)** — `/review` prompt enriched with 3-Pass Review methodology; `/tdd` broadened to cover full testing skill (pyramid, mocking, coverage, flaky triage); self-actualization thresholds canonicalized (instruction references skill); code-review instruction deduplicated (references skill tables); `diagramming.prompt.md` created for markdown-mermaid trifecta; `promotetomaster.prompt.md` created for heir-sync-management trifecta; trifecta sibling synapses added to code-review, testing-strategies, self-actualization

### Removed

- **Gist-based Cloud Sync** — fully removed deprecated code (since v5.0.1): 3 slash commands (`/sync`, `/push`, `/pull`), `alex.globalKnowledge.cloudSync.enabled` setting, handler functions, Gist interface fields across 7 files

### Changed

- **Avatar system removed** — Deleted 122 files (25.3 MB), gutted avatarMappings.ts (771→68 lines), removed PERSONA_AVATAR_MAP + getAvatarForPersona + avatarFile
- **console.log → OutputChannel** — 31 calls across 9 files migrated to centralized logger
- **UI theme compliance** — 17 hex colors → `--vscode-charts-*` CSS variables with fallbacks; 3 sub-11px fonts fixed
- **Heir alignment** — agent-plugin v6.1.5/v6.1.7/v6.2.0 → v6.4.6 across 4 files; M365 build artifacts gitignored; visual-memory trifecta removed from M365
- **MCP SDK bump** — `@modelcontextprotocol/sdk` ^1.0.0 → ^1.27.1
- **Dependency bumps** — `@types/vscode`, `ws` security update

### Fixed

- **F1–F6 hook API corrections** — Config format (3-level nesting, seconds timeouts), input protocol (env vars → stdin JSON), output protocol (plain text → structured JSON), event rename (SessionStop → Stop), exit codes (always 0 → exit 2 for safety blocks)
- **BUG 1-9 synapse activation semantics** — 23 asymmetric bidirectional claims resolved, 40+ false `bidirectional` flags removed from synapses.json files, embedded markdown synapse format blindspot fixed
- **BUG 10-11 runtime tool blindspots** — `synapseHealthTool.ts` Phase 2 and `selfActualizationTool.ts` Phase 1b now scan JSON synapses; `vscode-configuration-validation` synapses.json rewritten from legacy object to array format
- **BUG 12 heir sync drift** — 6 `heir:vscode` excluded skill synapses.json manually propagated after bulk changes
- **BUG 13-14 audit-tools-hooks gaps** — Agent-scoped hook scanning from `.agent.md` frontmatter, `tool.id` → `tool.name` fix, recursive tool registration discovery
- **BUG 15 sync-architecture stale reference** — 4 `skill-activation` → `memory-activation` references in sync validation function, plus 1 in `architecture-health/SKILL.md`

---

## [6.4.6] - 2026-03-10

> **The Audit Hygiene Release** — Tests green, docs fresh, links fixed, vulnerabilities eliminated, skills reindexed, settings reconciled.

### Fixed

- **7 failing tests resolved** — `globalKnowledge.test.ts`: GKP-/GKI- → GK-/GI- prefix alignment; `expertiseModel.ts`: 3 regex patterns (crash/docker/layer) now match inflected forms
- **14 broken links repaired** across 7 docs — wrong relative paths in COPILOT-BRAIN.md, ALEX-IDENTITY.md, AGENT-VS-CHAT-COMPARISON.md, ENVIRONMENT-SETUP.md, QUICK-REFERENCE.md, USER-MANUAL.md, USE-CASES.md
- **3 ghost references removed** — non-existent PROJECT-TYPE-TEMPLATES.md links eliminated
- **Broken synapse path** — vscode-extension-patterns/synapses.json external path corrected

### Changed

- **Mocha 10.8.2 → 11.7.5** — npm overrides for serialize-javascript (^7.0.4) and diff (^8.0.3); **0 audit vulnerabilities** (was 5)
- **Doc freshness** — cognitive-config.json → v6.4.0, NEUROANATOMICAL-MAPPING (130 skills, 64 instructions, I1-I8), VSCODE-BRAIN-INTEGRATION → v6.4.0, 4 additional docs with corrected counts
- **AGENT-VS-CHAT-COMPARISON.md** — updated from v5.8.2 to v6.4.0
- **Skills reindexed** — 130 skills / 643 connections; stale `inheritance` field removed from 10 synapses.json files; pre-commit hook + new-skill.ps1 updated for centralized inheritance
- **Settings docs reconciled** — ENVIRONMENT-SETUP.md designated canonical (21 SoT settings in tiered Essential/Recommended/Nice-to-Have); USER-MANUAL.md now points there
- **2 legacy episodic files archived** — self-actualization .prompt.md files moved to archive/upgrades/

---

## [6.4.0] - 2026-03-09

> **The Agent Hooks Release (Partial)** — VS Code 1.111 settings adoption, agent debugging documentation, platform settings alignment.

### Added

- **Agent-scoped hooks enabled** — `chat.useCustomAgentHooks` in `.vscode/settings.json` and `.devcontainer/devcontainer.json`. Highest-value 1.111 feature for per-agent hook specialization
- **Autopilot mode enabled** — `chat.autopilot.enabled` in `.vscode/settings.json` and `.devcontainer/devcontainer.json`. Recommended for dream/meditation workflows
- **Terminal sandbox trust domains** — `chat.tools.terminal.sandbox.network` configured for marketplace, npm, Azure DevOps, and Replicate
- **OS notifications for confirmations** — `chat.notifyWindowOnConfirmation` set to `always`
- **`#debugEventsSnapshot` documented** — Added to WORKING-WITH-ALEX.md troubleshooting and debugging-patterns.instructions.md
- **VS Code Insiders pre-publish testing** — New section in PRE-PUBLISH-CHECKLIST.md for weekly Stable cadence risk mitigation

### Changed

- **copilot-instructions.md settings header** — Updated to `(1.111+)` with `chat.autopilot.enabled` and `chat.useCustomAgentHooks` documented
- **Skill-to-Discipline Map** — Wired into sync pipeline and quality gates

---

## [6.3.1] - 2026-03-09

> **The Documentation Maturity Release** — Roadmap restructured with v6.4.0 split, Skill-to-Discipline Map (41 disciplines × 130 skills), VS Code 1.111 evaluation integrated.

### Added

- **Skill-to-Discipline Map** — new `alex_docs/guides/SKILL-DISCIPLINE-MAP.md` mapping 41 professional disciplines to 130 skills, wired to Command Center Docs tab
- **VS Code 1.111 evaluation** — 11 actionable items extracted and integrated into roadmap (3 ADOPT, 2 MONITOR, 3 SKIP)
- **vscode-extension-patterns synapse** — new reference to 1.111 evaluation document (strength 0.8)

### Changed

- **ROADMAP-UNIFIED.md restructured** — priority-ordered P1–P5 stack, v6.4.0 Agent Hooks Release (6 items) split from v6.5.0 Trust Release (23 items)
- **Roadmap appendix** — completed tasks moved to collapsible `<details>` section
- **Active Context** — updated for post-v6.3.0 session (1.111 evaluation, roadmap restructure, skill-discipline mapping)

---

## [6.3.0] - 2026-03-09

> **The Accessibility & Workshop Alignment Release** — WCAG keyboard accessibility, 10 domain skills from LearnAlex, docs tab sync with 41 workshops, Architecture Independence cardinal rule.

### Added

- **10 domain skills from LearnAlex** — career-development, comedy-writing, counseling-psychology, financial-analysis, game-design, healthcare-informatics, hr-people-operations, journalism, legal-compliance, sales-enablement
- **8 new workshop study guides** in Docs tab (Responsible AI Ethics, Accessibility Engineering, Cross-Cultural Design, Cloud Architecture, Data Storytelling, Green Software, Open-Source Governance, Product Management)
- **GitHub Guide + Responsible AI facilitator buttons** in Docs tab
- **Architecture Independence cardinal rule (I8)** — Architecture MUST NOT depend on the Extension; dependency arrow is Extension → Architecture, never reverse

### Changed

- **Persona detection backlog P7.7–7.12** — dependency signals for designer/scientist/finance/teacher/podcaster, narrowed patterns, identity weight 2.0→2.5, tie-break by signal count, cache TTL 7d→1d, P3 phase rules expanded to 11 personas
- **Workshop persona IDs fixed** (7 broken IDs now match live learnalex.correax.com)
- **Docs tab workshop grid** grouped by domain with accurate workshop count (41)

### Fixed

- **WCAG keyboard accessibility** — Enter/Space keydown handlers for 4 interactive controls (persona cards, tabs, trifecta tags, doc cards)
- **Touch target sizes** — toggles increased to 36×20px (desktop) and 30×18px (compact)
- **Font sizes** — 5 elements bumped to minimum 11px for readability
- **Focus outline** — `:focus-visible` rule replaces suppressed outlines
- **Aria labels** — 14 doc-grid-cards + 6 action-group-labels now have proper ARIA attributes
- **PII sanitized** in WORKING-WITH-ALEX.md (personal name → brand name)

### Removed

- **Skill toggle switches** — non-functional feature removed from Skill Store tab, sharedStyles, and data provider

---

## [6.2.0] - 2026-03-05

> **The On-Brand Partnership Release** — M365 heir rebranded to partnership voice, EmbeddedKnowledge RAG, store description overhaul, full version alignment.

### Added

- **M365 EmbeddedKnowledge RAG** — 6 knowledge files now declared as embedded capabilities (were orphaned on disk)
- **M365 Meditate workflow** — cognitive consolidation added to conversation starters and store description
- **FLUX brand fine-tune trifecta** (37th) — Complete LoRA training workflow skill + instruction + prompt. Two trainers: `replicate/fast-flux-trainer` (~$1.50/2min), `ostris/flux-dev-lora-trainer` (~$0.98/10min). Trigger word discipline, training data requirements, visual-memory integration
- **SVG-first banner strategy** — Recraft v4 SVG (`recraft-ai/recraft-v4-svg`) promoted to default banner format. Scalable, theme-aware, lightweight, VCS-friendly. Raster (Ideogram/Flux) demoted to explicit fallbacks

### Removed

- **GitHub Copilot Web heir discontinued** — `platforms/github-copilot-web/` removed; not worth the effort at ~1.5% parity. Agent Plugin covers the same use case better.

### Changed

- **M365 store description rewritten** — rocket/thrust metaphor replaced with partnership voice aligned to North Star and CorreaX brand
- **M365 manifest `name.full`** — "Strap a Rocket to Your Back" → "Your Trusted AI Partner for M365"
- **M365 `description.short`** — partnership-first messaging (71/80 chars)
- **M365 `description.full`** — complete rewrite: MEET ALEX, WHY PARTNERSHIP MATTERS, WHAT ALEX DOES, WORKFLOWS, SKILLS (2,341/4,000 chars)
- **M365 declarativeAgent description** — feature list → partnership tagline
- **M365 README hero** — 🚀 → 🤝, partnership tagline, "cognitive partnership layer"
- **M365 README footer** — aligned to North Star: "The Most Advanced and Trusted AI Partner for Any Job"
- **M365 instructions slimmed** — 6,679 → 2,773 chars (58% reduction), workflows delegated to knowledge files
- **Agent Plugin marketplace.json** — version 6.2.0, skill count updated to 85+

### Fixed

- M365 knowledge files orphaned (existed on disk but no EmbeddedKnowledge capability declared)
- M365 instructions overloaded (duplicate content between inline instructions and knowledge files)
- Version alignment across all heirs: VS Code, M365, Agent Plugin
- Stale skill counts in M365 knowledge files (126/128/100 → 85+)

---

## [6.1.8] - 2026-03-05

> **Doc Alignment Hotfix + AI Writing + AlexAgent Distribution** — Version consistency fix, new skill trifecta, and standalone plugin distribution repo.

### Added

- **AI Writing Avoidance trifecta**: skill, instruction, prompt (`/audit-writing`), synapses — detect and fix AI writing tells
- **AI Writing Tells research document** (`alex_docs/research/AI-WRITING-TELLS.md`) — comprehensive catalog of AI writing patterns
- **AlexAgent standalone distribution repo** — `github.com/fabioc-aloha/AlexAgent` for plugin-only installation without the full extension
- `setup.ps1` / `setup.sh` — lightweight post-clone VS Code settings configuration scripts
- `sync-plugin.ps1` `-DistroRepo` parameter — publish plugin bundle to AlexAgent repo in one command

### Changed

- AlexAgent README: VS Code UI clone as primary install, one-liner scripts as secondary, CLI in appendix
- AlexAgent banner: on-brand CorreaX design (flat `#0f172a`, left-aligned, ring nodes, ghost watermark)

### Fixed

- `copilot-instructions.md` version header aligned to 6.1.8
- `cognitive-config.json` version field updated
- Heir CHANGELOG entry for stable release added
- Legacy episodic file archived
- PII leak: removed personal name reference from `deep-work-optimization` skill in plugin

---

## [6.1.7] - 2026-03-05

> **Stable Release** — Promoted to stable on VS Code Marketplace.

### Changed

- Published as stable release (previously pre-release)
- Version alignment across all documentation

---

## [6.1.5] - 2026-03-04

> **Heir Protection Fix + Trifecta Gap Closure + M365 Polish** — Removed false positive from Master auto-detection, closed trifecta gap from 26→36, M365 orphan cleanup and mobile docs.

### Added

- 10 new complete trifectas (26→36): `image-handling`, `character-aging-progression`, `visual-memory`, `code-review`, `root-cause-analysis`, `refactoring-patterns`, `debugging-patterns`, `security-review`, `skill-building`, `global-knowledge`
- 6 new prompts: `/rca`, `/refactor`, `/debug`, `/security-review`, `/skill-building`, `/knowledge`
- 4 new instructions: `root-cause-analysis`, `refactoring-patterns`, `debugging-patterns`, `security-review`
- 2 new skills: `agent-debug-panel` (7 debug scenarios), `terminal-image-rendering` (Kitty graphics protocol)
- MCP standalone distribution: 704KB esbuild bundle at `plugin/mcp/index.js`

### Changed

- TRIFECTA-CATALOG.md: full audit — 10 new entries, Mermaid diagram, health summary updated
- M365 USER-MANUAL.md: mobile support FAQ updated (declarative agent works in Teams mobile)
- Skill and trifecta counts updated across all documentation (128 skills, 36 trifectas)

### Removed

- 4 orphan M365 plugin files: `alex-knowledge-plugin.json`, `graph-api-plugin.json`, `openapi.yaml`, `graph-openapi.yaml`

### Fixed

- `alex_docs/` removed from Master Alex auto-detection indicators — heirs with `alex_docs/NORTH-STAR.md` were falsely identified as Master Alex, blocking `Alex: Upgrade` (reported by AlexLearn)

---

## [6.1.4] - 2026-03-04

> **Cognitive Tier Fix + Model Updates** — Fixed L4 detection for current extended thinking settings, added GPT-5.3, collapsed sidebar sections by default.

### Added

- GPT-5.3 added to frontier tier model maps
- Frontier regex now auto-catches future GPT-5.x models (`gpt-5\.[2-9]`)

### Changed

- Cognitive Dashboard and Memory Architecture sidebar sections collapsed by default for cleaner first-run experience
- Removed deprecated `github.copilot` from `extensionPack` — now only `github.copilot-chat`
- Brain QA output compacted (phases + warnings/summary only, use `-Detail` for verbose)
- Brain QA agent cross-reference regex fixed for Windows CRLF line endings

### Fixed

- **Critical**: Cognitive tier detection now reads `github.copilot.chat.agent.thinkingTool` (current setting path) — was only checking deprecated paths, causing L4 users to show as L3
- Visual memory heir sync template updated with voices/videoStyles sections
- `cognitive-config.json` version synced to 6.1.3

---

## [6.1.2] - 2026-03-03

> **Replicate Trifecta Updates + Documentation Hygiene** — Model landscape refresh across 5 skills, 2 new trifectas completed, doc archive pass 2.

### Added

- `image-handling` trifecta completed — instruction + prompt files created
- `character-aging-progression` trifecta completed — instruction + prompt files created

### Changed

- Updated Replicate model landscape across 5 skills: Ideogram v3 (turbo/balanced/quality), `nano-banana-2`, `flux-kontext-pro/max`, `flux-2-pro/max`, `recraft-v4`, `veo-3.1-fast`, `sora-2`, `qwen/qwen3-tts`, `minimax/speech-2.8-turbo`
- `ideogram-v3-turbo` ($0.03) is now the default typography recommendation (63% cheaper than v2)
- Archived 6 outdated docs to `alex_archive/`: 3 point-in-time audit reports, `REPLICATE-EVALUATION.md` (superseded by skills), Ideogram v2 gallery, stale `brain-qa-output.txt`

### Fixed

- `character-aging-progression/SKILL.md`: `image_input` must be an array `[dataURI]`, not a single string — was silently breaking face consistency
- Audio model reference updated: `qwen-tts` → `qwen/qwen3-tts` across all skills
- Skill frontmatter: removed unsupported `applyTo`/`triggers` attributes, fixed `name` to kebab-case in 3 SKILL.md files

---

## [6.1.0] - 2026-03-03

> **Environment & Cognitive Tier Hardening** — Extended thinking detection fix (critical), extension dependency checking, multi-account GitHub detection, cognitive tier real-time refresh.

### Added

- Extension dependency checking with one-click install for GitHub Copilot, Copilot Chat, Mermaid Preview
- Multi-account GitHub detection (personal + enterprise) in cognitive tier
- Account-aware setup guidance with upgrade tips for Frontier model access
- Real-time cognitive tier refresh on Copilot settings changes

### Fixed

- **CRITICAL**: Extended thinking detection was reading wrong config keys — Level 4 (Advanced) was unreachable for all users
- L4 badge race condition causing welcome view to default to Level 1
- Misleading account classification (business → unknown)
- Markdown in plain text dialogs, unsafe sign-in command

### Changed

- Package size reduced: 534 → 525 files (~3.4 MB lighter)

---

## [6.0.3] - 2026-03-02

### Fixed

- Extension README: resolved 4 Marketplace compliance issues — self-referential link (line 125), broken `article/versions/13-ALEX-MANIFESTO-PERSONAL.md` links (lines 300 & 358), broken `replicate-api` skill path (line 671)

### Changed

- Root README: DRY refactor — removed 700-line duplicate of extension README; replaced with compact Features table linking to learnalex.correax.com
- Both READMEs: removed "Chat with Alex" section (superseded by learnalex.correax.com website)
- Docs: replaced all GitHub Gist references with private GitHub repo throughout

---

## [6.0.2] - 2026-02-28

### Fixed

- Brand doc (`DK-correax-brand.md`): updated ghost watermark canonical opacity spec 0.03→0.15 (CSS + HTML example)
- `correax-brand` skill: encoded `rgba(255,255,255,0.15)` as the authoritative design token to prevent regression

### Changed

- Catalogs regenerated: 23 complete trifectas (was 14), 125 skills, 593 connections
- `vscode-configuration-validation` synapses.json inheritance field repaired (malformed object → `"heir:vscode"`)
- Active Context updated to reflect v6.0.1 release state

---

## [6.0.1] - 2026-02-28

### Fixed

- Banner: increased ALEX watermark visibility (opacity 0.03→0.15)

---

## [6.0.0] - 2026-02-28

> **The Partnership Release** — Six deep-integration features that make Alex a cognitive partner, not just a chat interface. Alex now remembers your sessions, learns from outcomes, detects your work context autonomously, guides multi-step workflows, adapts to your expertise level, and proactively triggers code reviews.

### Added

- **Episodic Memory** (`services/episodicMemory.ts`) — Persistent session records at `~/.alex/episodic/sessions.json`. Alex recalls "what were we building last Tuesday?" across sessions. Commands: `alex.recallSession`, `alex.showSessionHistory`
- **Outcome Learning Loop** (`services/outcomeTracker.ts`) — 👍/👎 tracking per @alex exchange with per-domain confidence scoring. Alex calibrates advice certainty from observed outcomes. Commands: `alex.recordPositiveOutcome`, `alex.recordNegativeOutcome`, `alex.showOutcomeStats`
- **Autonomous Task Detection** (`services/taskDetector.ts`) — Proactively surfaces stalled work and TODO hotspots from peripheral vision observations on a 30-minute interval. 4-hour dismiss cooldown. Commands: `alex.showPendingTasks`, `alex.forceCheckTasks`
- **Multi-Step Workflow Engine** (`services/workflowEngine.ts`) — JSON workflow definitions at `.alex/workflows/`. Includes 4 built-in workflows: Plan→Build→Review, Debug→Fix→Verify, Research-First Development, Release Preparation. Commands: `alex.runWorkflow`, `alex.listWorkflows`
- **User Expertise Model** (`services/expertiseModel.ts`) — Domain interaction frequency across 10 domains (coding, debugging, architecture, testing, devops, data, security, ai-ml, documentation, general) mapped to novice/intermediate/advanced/expert. Injects calibration hint into every @alex prompt via `PromptContext.expertiseHint`. Command: `alex.showExpertiseModel`
- **Proactive Code Review Triggers** — Built into `taskDetector.ts`: on save, debounces 60s and checks `git diff --stat HEAD`. If >200 lines changed, surfaces a code review nudge with 30-minute cooldown
- **Layer 10b in promptEngine.ts** — `buildExpertiseLayer()` injects user expertise calibration for every @alex interaction
- **10 new VS Code commands** registered and declared in `package.json`
- **Image Upscaling** (`commands/contextMenu.ts`, `services/replicateService.ts`) — 4 Replicate-powered upscaling models (`real-esrgan`, `swinir`, `codeformer`, `clarity-upscaler`). Right-click any image → **Upscale Image with AI**. Saves to `assets/upscaled/`. Command: `alex.upscaleImage`
- **MCP Cognitive Tools Package** (`packages/mcp-cognitive-tools/`) — Standalone MCP server publishing 5 cognitive tools (`alex_synapse_health`, `alex_memory_search`, `alex_architecture_status`, `alex_knowledge_search`, `alex_knowledge_save`) usable by any MCP-compatible host. Entry: `npx @alex/mcp-cognitive-tools`
- **Learning Journeys** (`.github/prompts/journey.prompt.md`) — 8 curated role-based learning paths (frontend-developer, backend-developer, fullstack-developer, devops-engineer, technical-writer, researcher, ai-engineer, alex-architect) with progress tracking at `.alex/journeys/*.json`
- **Presentation Automation** (`.github/prompts/marp.prompt.md`, `.github/prompts/presentation.prompt.md`) — Unified `/presentation` router dispatches to Gamma (marketing decks), Marp (tech talks), or PptxGenJS (data reports). Alex-branded Marp CSS theme included
- **3 new slash commands** (`/journey`, `/marp`, `/presentation`) registered in `package.json` chatParticipants

### Changed

- **`3_generate@8` group collision fixed** — `generateDiagram` moved from `3_generate@8` to `3_generate@11` in explorer context menu to resolve conflict with `generateAIImage`
- **Editor context menu expanded** — Added `editImageWithPrompt` (4_create@3) and `upscaleImage` (4_create@4) to `alex.contextMenu` editor right-click group

- **`PromptContext` interface** — Added `expertiseHint?: string` field (v6.0.0 expertise calibration)
- **participant.ts** — `@alex` handler now appends to episodic draft and records domain interactions after every response (fire-and-forget)
- **extension.ts** — Imports and initializes all 5 new services; registers 10 new commands; flushes episodic draft on deactivation
- **package.json** — v6.0.0, 10 new command declarations

---

## [5.9.13] - 2026-02-28

> **CorreaX Brand Edition** — Full brand system deployment (42/42 tasks). Multi-size favicons, apple-touch-icons, CorreaX dark neural network banner, palette applied to extension source, brand compliance scan in dream protocol, and correax-brand trifecta.

### Added

- **correax-brand trifecta** — New skill, instructions, and synapses encoding the full CorreaX design system (palette, typography, banner patterns, asset naming conventions)
- **north-star trifecta** — Skill, instructions, and prompts encoding the North Star alignment framework and evaluation criteria
- **Multi-size favicon.ico** — 7-size ICO bundle (16/24/32/48/64/128/256px) for vscode-extension property
- **apple-touch-icon.png** — 180×180px Apple touch icon for all web-facing Alex properties
- **CorreaX dark banner** — Neural network motif artwork deployed as extension marketplace banner
- **Brand compliance scan** — Automated CorreaX palette validation added to dream protocol Phase 4.5
- **Episodic memory** — `meditation-2026-02-28-v6-planning.md` consolidating v6.0 execution order, heir sync decisions, and next-steps roadmap

### Changed

- **CorreaX palette in extension source** — `colors.ts`, Global Knowledge SVG assets, and skill files updated to use CorreaX brand tokens (Midnight Slate, Plasma Violet, Neural Cyan, Quantum Gold)
- **Mermaid theme** — CorreaX theme snippet added; architecture diagrams use brand colors
- **Badge color standardization** — All README badges aligned to CorreaX palette
- **BRANDING-PLAN.md archived** — Replaced with clean pointer; full 1091-line task history moved to `archive/BRANDING-PLAN-2026-02-28-COMPLETED.md`
- **ROADMAP-UNIFIED.md updated** — v5.9.13 recorded as current, v6.0 partnership release as next milestone
- **All heirs synced to v5.9.13** — AlexLearn, Extensions, AIRS Enterprise Active Contexts aligned to post-CorreaX state

---

## [5.9.12] - 2026-02-26

> **Documentation Hygiene Edition** — Comprehensive documentation audit eliminating version drift, stale file counts, and outdated dates across 8 files. New doc-hygiene→release-process synapse ensures future releases trigger documentation sweeps.

### Changed

- **README.md alignment** — Instructions count 52→55, prompts 34→35, skills 123→124, footer version v5.9.9→v5.9.12, removed duplicate copyright line
- **TEST-GUIDE.md full update** — 12 stale v5.9.9 references updated to v5.9.12 across install commands, test expectations, section headers, and known gaps
- **Operational docs dates** — CONTRIBUTING.md, PRE-PUBLISH-CHECKLIST.md, PUBLISHING.md dates updated from February 15 to February 26
- **Heir VS Code README counts** — Instructions 28→55, prompts 17→35 — eliminated 2x count divergence
- **alex_docs version references** — TEST-ACTIVATION-PASS.md (v5.9.9→v5.9.12), VSCODE-SOURCE-INTEGRATION-ANALYSIS.md (v5.9.10→v5.9.12)

### Added

- **New synapse: doc-hygiene → release-process** (0.80 strength) — encodes the lesson that release workflows should trigger documentation hygiene sweeps to prevent systemic drift
- **Episodic memory** — `meditation-2026-02-26-documentation-hygiene-pass.md` consolidating 4 key learnings about documentation drift patterns

---

## [5.9.11] - 2026-02-26

> **Post-Publish Synapse Hardening** — Meditation-driven synapse integrity fixes, relative path normalization, and Brain-QA integration as publish gate.

### Changed

- **Synapse path normalization** — Fixed 11 relative synapse paths (`../`, `../../`) to full `.github/` paths in `anti-hallucination`, `documentation-quality-assurance`, and `global-knowledge-maintenance` synapses. Result: 576 synapses, 566 valid filesystem targets, 10 intentional external refs, 0 broken
- **Brain-QA as publish gate** — Added `cognitive-health-validation` synapse to `automated-quality-gates.instructions.md`, formalizing Brain-QA 35-phase validation as a pre-publish deep audit requirement
- **Active Context updated** — Recent field reflects v5.9.10 NASA Edition publish completion

### Added

- **Episodic memory** — `meditation-2026-02-26-v5910-nasa-publish.md` consolidating 6 key learnings from the publish hardening session
- **Global Knowledge insights** — `GI-seven-gate-publish-hardening-protocol` and `GI-marketplace-readme-link-resolution` saved as cross-project patterns

---

## [5.9.10] - 2026-02-26 — NASA Edition 🚀

> **NASA Standards & Mission-Critical Compliance** — Adopt NASA/JPL Power of 10 code quality rules for mission-critical software development. Extension code audited and made compliant with bounded recursion and loop limits.

### Added

- **NASA/JPL Power of 10 standards integration** — New `.github/instructions/nasa-code-standards.instructions.md` adapts NASA's mission-critical code quality rules for TypeScript, enabling high-reliability software development
- **Builder agent NASA mode** — Builder agent auto-detects mission-critical projects and applies NASA standards: bounded recursion, fixed loop bounds, function size limits, assertion density, and more
- **Code review NASA checklist** — `code-review-guidelines.instructions.md` now includes mission-critical review checklist with blocking severity for R1-R3 violations
- **Heir project NASA guidance** — `heir-project-improvement.instructions.md` includes mission-critical pre-phase checklist for heirs developing safety-critical software
- **workspaceFs utility module** — New `src/shared/workspaceFs.ts` providing async wrappers around `vscode.workspace.fs` API: `pathExists`, `readFile`, `writeFile`, `readJson`, `writeJson`, `ensureDir`, `readDirectory`, `stat`, `copyFile`, `rename`
- **Terminal sandboxing documentation** — macOS/Linux security note added to SECURITY.md, copilot-instructions.md, and settings.json for `chat.tools.terminal.sandbox.enabled`

### Changed

- **North-star trifecta** — New complete trifecta (skill + instruction + prompt) for North Star alignment principles
- **North-star synapses** — 8 ambiguous synapse targets resolved to full `.github/skills/*/SKILL.md` paths, 3 yields also fixed
- **README marketplace links** — 18 broken relative links (`alex_docs/`, `article/`, `.github/SUPPORT.md`) converted to absolute GitHub URLs for VS Code Marketplace rendering. Replicate skill documentation link corrected from non-existent `replicate-api/` to `ai-generated-readme-banners/resources/`
- **M365 heir version alignment** — package.json (5.9.3→5.9.10), manifest.json (5.9.8→5.9.10), README badge updated
- **GitHub Copilot Web heir** — Version bumped from 5.9.9 to 5.9.10
- **Brain-QA 35-phase validation** — 34 phases passed, 2 self-containment failures found and fixed (north-star SKILL.md had relative `alex_docs/` links → converted to GitHub URLs)
- **NASA R1 compliance: Bounded recursion** — `findMdFilesRecursive()` in synapse-core.ts now has `maxDepth` parameter (default: 10) preventing stack overflow from deeply nested directories
- **NASA R1 compliance: Bounded walk functions** — `collectSystemFiles.walk()` and `getFolderSize.walk()` in upgrade.ts now have `MAX_WALK_DEPTH=10` depth parameter preventing unbounded directory traversal
- **NASA R2 compliance: Fixed loop bounds** — Upgrade dialog loop in upgrade.ts now has `MAX_DIALOG_ITERATIONS` safety limit (100)
- **NASA R2 compliance: Text chunking bounds** — `splitTextIntoChunks()` in ttsService.ts now has `MAX_ITERATIONS` counter preventing potential infinite loops on malformed input
- **NASA R5 compliance: Entry assertions** — Added `nasaAssert()` calls to `resolveWebviewView()` in welcomeView.ts validating webviewView and extensionUri
- **Full codebase NASA audit** — All 72 TypeScript files audited against NASA Power of 10 rules; 3 violations found and fixed, 10 functions documented as acknowledged exceptions with architectural justifications
- **Testing strategies NASA integration** — testing-strategies SKILL.md updated with bounded behavior testing patterns (R1/R2/R3), assertion coverage testing (R5), and critical path coverage targets
- **Code review NASA integration** — code-review SKILL.md updated with mission-critical review section: blocking violations (R1-R3), high priority (R4/R5/R8), medium priority (R6/R7/R9/R10)
- **Heir sync restored** — 3 missing skills, 1 instruction, 1 prompt synced to vscode-extension heir (124/124 skills aligned)
- **fs-extra → vscode.workspace.fs migration** — Per ADR-008 (Workspace File API Strategy), migrated all workspace-scoped file operations from Node.js `fs-extra` to VS Code's native `vscode.workspace.fs` API for virtual filesystem compatibility (SSH, WSL, Codespaces, containers). Files migrated:
  - `promptEngine.ts` — Brain file reading
  - `activeContextManager.ts` — Protected marker and instructions reading
  - `synapse-core.ts` — Memory file scanning, synapse repair, report saving
  - `cognitiveDashboard.ts` — Skill/instruction/prompt/episodic counting
  - `memoryDashboard.ts` — Memory stats collection
  - `healthDashboard.ts` — Health category scanning
  - `utils.ts` — Version reading, Alex installation check, synapse health scan
  - `personaDetection.ts` — Workspace structure scanning, package.json reading, profile updates
  - `emotionalMemory.ts` — Emotional session logging
  - `honestUncertainty.ts` — Calibration logging, feedback tracking
  - `tools.ts` — Synapse health, memory search, architecture status tools
  - `sanitize.ts` — Config backup operations

### Removed

- **M365 scenario_models** — Removed unsupported `scenario_models` property from `declarativeAgent.json` (added in 5.9.9, blocked schema v1.6 validation)
- **Enterprise secrets scanning** — `alex.enterprise.scanSecrets`, `alex.enterprise.scanWorkspace` commands removed (did not work as expected)
- **Enterprise audit logging** — `alex.enterprise.viewAuditLog`, `alex.enterprise.exportAuditLog` commands removed
- **Enterprise settings** — All 11 `alex.enterprise.*` settings removed from package.json
- **Enterprise module** — `src/enterprise/` folder deleted (auditLogging.ts, secretsScanning.ts, index.ts)
- **Unused fs-extra import** — Removed from contextMenu.ts (was importing but not using)

### Fixed

- **North-star SKILL.md self-containment** — 2 relative `../../../alex_docs/` links replaced with full GitHub URLs (caught by Brain-QA Phase 34)
- **TESTE directory excluded** — Test debris directory (scripts, images) added to `.gitignore`
- **@ts-ignore removal** — Replaced all `@ts-ignore` comments with type-safe patterns:
  - `inheritSkill.ts` — QuickPick custom data now uses Map instead of property injection
  - `proposeSkill.ts` — Same pattern, plus new HeirSkill interface for type-safe skill operations
- **Type safety improvements** — Eliminated `any` types:
  - `healthDashboard.ts` — `any[]` → `LearningGoal[]` for goals parameter
  - `cognitiveDashboard.ts` — Goals filtering now type-safe with WorkspaceGoalsData
  - `uxFeatures.ts` — Same pattern for daily briefing goals
- **DRY type consolidation** — Moved WorkspaceGoal/WorkspaceGoalsData interfaces to shared/constants.ts, eliminating duplication across cognitiveDashboard.ts and uxFeatures.ts

### Technical Notes

Files intentionally kept with fs-extra (per ADR-008 — global paths require Node.js filesystem):
- `session.ts`, `goals.ts`, `globalKnowledge.ts`, `forgettingCurve.ts` — Use `~/.alex/` global paths
- `setupGlobalKnowledge.ts`, `exportForM365.ts` — Symlinks and OneDrive paths
- `inheritSkill.ts`, `proposeSkill.ts` — Mixed global/workspace operations
- `logoService.ts`, `pptxGenerator.ts`, `audioPlayer.ts` — Sync methods for bundled assets

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

### Fixed

- **Avatar revert mandate** — Added `**IMPORTANT**` instruction to `copilot-instructions.md`, `meditation.instructions.md`, and `dream-state-automation.instructions.md` requiring `alex_cognitive_state_update` with `state: "persona"` as the final step of every dream/meditate session. Propagated to both vscode-extension and github-copilot-web heirs.
- **`.claude/` heir sync** — `sync-architecture.cjs` now copies `.claude/CLAUDE.md` + `.claude/settings.json` to `platforms/vscode-extension/.claude/` on every build. Previously the Claude bridge was master-only.
- **`cognitive-config.json` version drift** — Bumped `version` and `alex_version` fields from `5.9.3` to `5.9.9`.
- **Broken synapse repair** — Fixed stale reference in `meditation-2026-02-20-avatar-system-completion.md`: `2026-02-20-stabilization-meditation.md` → `meditation-2026-02-20-stabilization.md`.
- **`package-lock.json` version drift** — Bumped both version entries from `5.9.8` to `5.9.9`.

### Documentation

- **Activation pass test guide** — `alex_docs/guides/TEST-ACTIVATION-PASS.md`: 40 checks across 9 phases (extension present, status bar, 13 core commands, views, chat participant, LM tools, background services, error tolerance, avatar revert). Pass threshold: all 40 green; Phase 1–5 fail or `CRITICAL` error = release block.

### Skill Enhancements

- **`image-handling` skill — Replicate model selection** — Added comprehensive AI image generation guidance: 7-model comparison table (Flux Schnell, Flux Dev, Flux 1.1 Pro, Ideogram v2, Ideogram v2 Turbo, SDXL, Seedream 5 Lite) with costs and use cases; model selection decision guide keyed to user intent; LoRA support reference; aspect ratio reference. 14 new trigger words added including `flux schnell`, `flux dev`, `ideogram`, `sdxl`, `seedream`, `text in image`, `replicate model`. Enables Alex to route image generation requests to the correct Replicate model automatically.

### Architecture Improvements

#### `replicateService.ts` — Proper Replicate Service Layer

- **`src/services/replicateService.ts`** — New dedicated service extracted from inline code in `contextMenu.ts`. Provides: 7-model catalog with `REPLICATE_MODELS` constant (all IDs verified live via API — no stale version hashes); `generateImage()` high-level function with `Prefer: wait` + polling fallback; `createPrediction()` and `pollPrediction()` for direct API access; `downloadImageToWorkspace()` using `vscode.workspace.fs` (sandbox-safe); `selectModelForPrompt()` intent-to-model router; `buildModelQuickPickItems()` with recommended model highlighting.
- **`generateAIImage` command updated** — Now uses `replicateService`: shows all 7 models with `✨ Recommended` marker on the best-fit model for the user's prompt (e.g., typing "logo with text" auto-recommends Ideogram v2). Replaced stale version hashes with model-based endpoint. Added 3:2 Landscape aspect ratio.
- **`editImageWithPrompt` command updated** — Refactored to use `createPrediction` + `pollPrediction` from service; replaced `fs.readFile` with `vscode.workspace.fs.readFile`; replaced `fs.ensureDir` + `downloadImage` with `downloadImageToWorkspace`.
- **ADR-007 status** — Replicate replaces DALL-E as the image generation backend. Runtime image generation now live. Image upscaling + FLUX brand fine-tune remain P2 backlog items.

#### `fs-extra → vscode.workspace.fs` Migration (ADR-008)

- **3 files migrated** — `contextMenu.ts`, `fileWatcher.ts`, `healthCheck.ts` now use `vscode.workspace.fs` for all workspace-scoped file operations. Global-path files (`~/.alex/`) intentionally kept on fs-extra per ADR-008.
- **`fileWatcher.ts`** — `loadObservations()` and `persist()` now use `vscode.workspace.fs.readFile` / `createDirectory` / `writeFile`. Sync `countTodos()` switched from `fs-extra` to native Node.js `readFileSync`. `fs-extra` import removed entirely.
- **`healthCheck.ts`** — `fs.pathExists(alexPath)` replaced with `vscode.workspace.fs.stat()` + try/catch. `fs.readFile(file.fsPath)` replaced with `vscode.workspace.fs.readFile(file)` + `TextDecoder`. `fs-extra` import removed entirely.
- **`contextMenu.ts`** — Episodic insight saves, SVG illustration saves, AI image downloads all migrated. Inline Replicate API functions removed (now in `replicateService.ts`). `https` import removed. Two remaining `fs-extra` usages (for legacy code paths) documented.

#### Semantic Skill Graph — ROADMAP Detail

- **ROADMAP `### 🧠 Semantic Skill Graph`** section added with full 4-phase breakdown: Phase 1 (PoC standalone script, validates approach at $0.002), Phase 2 (extension integration with `alex.recompileSkills` command), Phase 3 (synapse discovery dashboard), Phase 4 (global knowledge integration). Key design decisions documented: keyword fallback always kept, compiled graph is cached JSON (loads in <50ms), Phase 1 is the abandonment gate.

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
