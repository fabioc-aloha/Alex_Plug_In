# Changelog

All notable changes to the Alex Cognitive Architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.9.0] - 2026-02-19

> **VS Code API Adoption** — Agent hooks, Copilot Memory, subagents, Plan Agent, and brain-qa infrastructure hardening

### Added

- **Agent Hooks** — `.github/hooks.json` with SessionStart/Stop/PreToolUse/PostToolUse; context loading, meditation suggestions, safety gates, tool telemetry
- **Copilot Memory** — `copilotMemory.enabled`; memory guidelines in copilot-instructions.md; meditation curation protocol
- **Subagents** — `user-invokable: true` on all 6 specialist agents (Researcher, Builder, Validator, Documentarian, Azure, M365) for parallel execution
- **Plan Agent** — `/plan` prompt with 4-phase workflow and 3 Alex-specific templates
- **brain-qa Phase 35** — API key availability check: warns when `REPLICATE_API_TOKEN` missing for image generation skills
- **`apiKeys` schema** — Declarative API key documentation in `SYNAPSE-SCHEMA.json`; two skills now declare their runtime key requirements
- **Phase 7 sync hardening** — Full-content comparison (was count-only) ensures all synapse field changes propagate to heir
- **`.vscode/settings.json`** — Full 1.109 recommended settings block with inline documentation

### Notes

- Hook scripts are dependency-free Node.js; graceful no-ops when optional config files are absent
- `user-invokable: true` requires VS Code 1.109+ Copilot extension — no-op on older versions

---

## [5.8.5] - 2026-02-19

> **Cognitive Architecture Enhancement** — Trifecta completion sprint, skill discoverability enrichment, and staleness management expansion

### Added

- **22 complete trifectas** — +9 new: chat-participant-patterns, vscode-extension-patterns, mcp-development, microsoft-graph-api, teams-app-patterns, m365-agent-debugging, markdown-mermaid, testing-strategies, knowledge-synthesis
- **Skill discoverability** — 20 skills enriched in skill-activation index with ~3× more keyword terms
- **Staleness management** — 16 staleness-prone skills tracked with refresh triggers and ownership
- **6 skills content-refreshed** — mcp-development transport rewrite, staleness headers added to gamma-presentations, microsoft-fabric, bicep-avm-mastery, fabric-notebook-publish, ai-character-reference-generation
- **49 instruction files** synced to VS Code heir

### Notes

- No extension code changes — pure cognitive architecture and documentation release

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

## [5.8.1] - 2026-02-16

- **Tool calling in @alex** — @alex chat participant now passes 12 Alex cognitive tools to language model via `sendRequest` options
  - alex_cognitive_synapse_health
  - alex_cognitive_memory_search
  - alex_cognitive_architecture_status
  - alex_platform_mcp_recommendations
  - alex_cognitive_user_profile
  - alex_cognitive_focus_context
  - alex_cognitive_self_actualization
  - alex_quality_heir_validation
  - alex_knowledge_search
  - alex_knowledge_save_insight
  - alex_knowledge_promote
  - alex_knowledge_status
- **Tool result loop** — @alex handles `LanguageModelToolCallPart` and feeds tool results back to model for multi-turn tool orchestration
- **File context from references** — @alex extracts `request.references` + active editor selection and includes them in prompt context
- **Model-adaptive behavior** — @alex selects best available model (not hardcoded gpt-4o) and adapts prompt based on detected model tier
- **Model-adaptive prompt rules** — Tier-specific guidance for language model:
  - **Frontier** (Opus 4.5/4.6, GPT-5.2): Deep reasoning, extended thinking, thorough explanations
  - **Capable** (Sonnet 4/4.5, GPT-5.1-Codex): Balanced depth, practical solutions
  - **Efficient** (Haiku 4.5, GPT-5 mini): Concise, actionable, fast responses

#### Quality Assurance Infrastructure

- **Brain QA Phase 33: Pre-Sync Master Validation** — Catches contamination issues in master before they flow to heir (frontmatter, legacy files, PII, broken synapses)
- **Enhanced sync-architecture.js validation** — Added 3 validators: YAML frontmatter checker, synapse target validator with relative path support, skill-activation index validator
- **Skill scaffold template system** — `.github/templates/skill-template/` with SKILL.md, synapses.json, and README templates prevent frontmatter omission at creation time
- **new-skill.ps1 generator** — Automated skill creation with kebab-case normalization, frontmatter population, and auto-open in VS Code
- **Pre-commit hook infrastructure** — `.github/hooks/` with PowerShell validation script and installation automation (ready for future expansion)
- **Phase 22 auto-fix** — `brain-qa.ps1 -Phase 22 -Fix` automatically archives legacy `.prompt.md` files to `archive/upgrades/`

### Fixed

- **Synapse path resolution bug** — validateSynapseTargets() now correctly handles relative paths (`../`, `../../`) with path.normalize()
- **9 legacy episodic files** — Archived `.prompt.md` format files from `.github/episodic/` to `archive/upgrades/`
- **5 broken synapse references** — Removed invalid references to ROADMAP-UNIFIED.md, heir-skill-promotion, alex_docs paths
- **3 contaminated inheritable skills** — Removed master-only path references from documentation-quality-assurance, release-process
- **Synapse auto-cleaning** — Enhanced cleanBrokenSynapseReferences() to remove external:, global-knowledge://, platforms/, alex_docs/ patterns

### Changed

- **Validation timing shift-left** — Quality gates moved from sync-time (downstream) to pre-commit/pre-sync (upstream)
- **Layered defense architecture** — Template validation → Pre-commit hooks → Phase 33 → Sync validation → Integrity check
- **Sync validation metrics** — Reduced from 18 errors to 0 errors; zero contamination issues in heir deployment
- **@alex model selection** — No longer hardcoded to `gpt-4o` family; uses best available Copilot model

### Impact

- **@alex is purpose-built** — No longer a 2-message passthrough; now a 10-layer cognitive prompt engine with tool calling, file awareness, and model adaptation
- **Tool orchestration** — @alex can search knowledge, check architecture status, validate heirs, and save insights automatically when needed by conversation
- **Context-aware responses** — @alex sees referenced files and editor selection, providing more relevant answers
- **Model intelligence** — @alex adapts reasoning depth to model tier capabilities (deep for Frontier, balanced for Capable, concise for Efficient)
- **Prevention over detection** — Root cause elimination through upstream quality gates prevents downstream contamination
- **Cleaner heir packages** — 119 skills deployed with 0 contamination issues (was 20 issues before RCA)
- **Maintainability** — Template system ensures new skills start with correct structure, reducing manual validation burden

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

## [5.8.0] - 2026-02-16

> **@alex Prompt Engine (P0)** — Modular 10-layer prompt builder transforms @alex from passthrough to purpose-built cognitive assistant with full brain awareness

### Added

#### Prompt Engine Architecture (v5.8.0 — P0: Critical Path)

- **`buildAlexSystemPrompt()` orchestrator** — Async function that coordinates all 10 prompt layers with parallel execution via `Promise.all`
- **Layer 1: Identity Core** — Reads `.github/copilot-instructions.md` Identity + Safety Imperatives sections via regex extraction (~400 tokens)
- **Layer 2: Active Context** — Injects persona, objective, focusTrifectas, and principles from brain's Active Context section (~80 tokens)
- **Layer 3: Conversation History** — Compresses last 8 ChatContext turns (4 exchanges) to first sentence or 100 chars (~300 tokens)
- **Layer 4: User Profile** — Formats IUserProfile fields with userName prominence for personalization (~150 tokens)
- **Layer 5: Focus Session** — Includes Pomodoro session state + active goals + streak days for focus-aware assistance (~120 tokens)
- **Layer 7: Model-Adaptive Rules** — Injects tier-specific guidance (frontier=deep, capable=balanced, efficient=concise) (~100 tokens)
- **Layer 10: Response Guidelines** — Lists 12 Alex cognitive tools + core behavior rules + tool recommendation (~200 tokens)
- **Token budgeting system** — Each layer has documented token budget allocation (total ~1,350 tokens vs. ~500 hardcoded)
- **PromptContext interface** — Typed context object encapsulating workspaceRoot, profile, emotionalState, model, history, request

### Changed

- **@alex system prompt construction** — Replaced ~500 token hardcoded string with dynamic `buildAlexSystemPrompt()` call in `handleGeneralQuery()`
- **Brain injection** — @alex now reads Identity from copilot-instructions.md instead of hardcoded "You are Alex..." fallback
- **Conversation memory** — @alex includes last 4 chat exchanges in context (previously only saw current message)
- **Active Context awareness** — @alex sees current persona, objective, and focus trifectas from brain state
- **Modular architecture** — Each prompt layer is independently testable and tunable

### Impact

- **@alex is brain-aware** — No longer disconnected from Master Alex's identity; reads Identity section directly from brain file
- **Conversation continuity** — @alex remembers previous exchanges, can reference earlier discussion points
- **Context-driven adaptation** — @alex adjusts tone/depth based on persona (Developer vs. Researcher vs. Documentarian)
- **Foundation for P1 enhancements** — v5.8.0 provides architectural foundation that v5.8.1 tool calling and file context layer on top of
- **Scalable prompt engineering** — Adding new layers (Knowledge Context, Emotional Intelligence) requires adding one builder function
- **Token visibility** — Explicit budget allocation makes prompt size predictable and tunable per layer

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

## [5.7.1] - 2026-02-14

> **Visual Identity & UI/UX Stabilization** — Enhanced persona-driven visual experience with dynamic avatars and refined welcome panel

### Added

- **Static chat participant icon** — @alex chat uses consistent blue rocket icon for simplicity (dynamic persona avatars moved to backlog)
- **Persona-specific rocket banner** — "Take Your **[NOUN]** to New Heights" banner updates based on persona (CODE/THESIS/RESEARCH/etc.)
- **Circular persona avatar** — Large 72px avatar in welcome panel with persona-appropriate image
- **Avatar logo overlay** — Small Alex rocket logo on persona avatars for brand consistency
- **Self-actualization maturity card** — Session records now show age-tier rewards (Age 21: Expert Problem-Solver)
- **Easter eggs** — Seasonal avatars (5: New Year, Valentine's, Halloween, 2× Holidays) + project-name triggers (9: cooking, pets, wine, comedy, podcast, finance, legal, survey, mentor)
- **AGE_TIERS system** — 9 maturity levels from "Emerging Learner" to "Visionary Architect"

### Fixed

- **TDZ error in welcomeView.ts** — Moved skillNameMap declaration before use (Feb 14 meditation RCA)
- **Welcome panel layout** — Redesigned header with rocket icon and centered large avatar section

### Changed

- **PERSONA_AVATAR_MAP** — Expanded to 27 entries (was 16) with 11 new personas from marketing plan
- **Stats accuracy** — Updated copilot-instructions: 12 LM tools (was 8), 30 instructions (was 31)

---

## [5.7.0] - 2026-02-14

> **Structural Consistency & Folder Completeness** — All commands, docs, scripts, and manifests now reference the full .github/ folder structure

### Fixed

- **Initialize/Upgrade commands** — Added `muscles/` and `assets/` to deployment sources; `episodic/` now created as empty runtime directory
- **Reset command** — `pathsToDelete` now includes all architecture folders
- **Manifest scan** — `createInitialManifest` now scans `config/`, `muscles/`, `assets/`
- **.vscodeignore** — Assets (banner.svg/png) now ship in VSIX
- **Version alignment** — 19 files updated from stale 5.6.8
- **brain-qa SKILL.md** — Phase table updated 21 → 31 phases with new mode shortcuts
- **Trifecta count** — 8 → 7 (README, welcomeView)
- **Memory Types table** — "Domain Knowledge" → "Skills/Expertise"
- **Architecture tree** — Added `assets/` folder
- **Memory Stores table** — Added Config, Muscles, Assets

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

- **Persona pattern matching bug** — Bidirectional substring match caused `.github/workflows/` to match any `.github/` directory. Replaced with typed matching
- **RC1: Blind config copy** — `copyDirRecursive()` now excludes `user-profile.json`, `MASTER-ALEX-PROTECTED.json`, `cognitive-config.json` from heir
- **RC2: Master-specific content in copilot-instructions.md** — `applyHeirTransformations()` resets P5-P7 slots, removes "Master Alex default" line
- **RC3: Broken synapse references** — `HEIR_SYNAPSE_REMOVALS` strips ROADMAP-UNIFIED.md synapse
- **RC4: No post-sync validation** — `validateHeirIntegrity()` blocks publish if PII or master content detected
- **CRLF regex** — All heir transformation patterns now handle Windows line endings

### Added

- **Game Developer persona** — New persona with keywords, skill, patterns, and LLM prompt support

---

## [5.6.7] - 2026-02-12

> **Self-Containment & Synapse Integrity** — .github is now fully self-contained with zero external references

### Fixed

- **Broken synapse targets** — Removed all external file references from synapse.json and instruction files
- **microsoft-graph-api synapses** — Upgraded from legacy schema to v2.1.0 with proper paths
- **7 missing skills in activation index** — bicep-avm-mastery, database-design, microsoft-graph-api, multi-agent-orchestration, observability-monitoring, performance-profiling, skill-development

### Security

- **Heir publication safety** — Removed master-only config files, cleared PII, reset working memory slots

### Changed

- **Skill catalog count** — 96 → 98 skills (heir), 96 → 102 (master)
- **Full self-containment** — All synapse connections use canonical `.github/` paths

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
  - [COMEBACK-PLAN.md](COMEBACK-PLAN.md) — Recovery roadmap
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

See [COMEBACK-PLAN.md](COMEBACK-PLAN.md) for details on what went wrong.

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
