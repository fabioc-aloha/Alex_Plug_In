# Alex Cognitive Architecture — Roadmap v5.7-v7.0

**Last Updated**: February 20, 2026

> **Phase: Cognitive Enhancement → Multi-Platform Reach → Autonomous Intelligence**

---

## 🗺️ Platform Strategy

Three platforms. Focused, not scattered.

| Platform | Heir | Status | Notes |
| -------- | ---- | :----: | ----- |
| **VS Code Extension** | `platforms/vscode-extension/` | ✅ Active | Full TypeScript extension — primary heir |
| **M365 Copilot Agent** | `platforms/m365-copilot/` | ✅ Active | Declarative agent via Agent Builder + Office Add-ins |
| **GitHub Copilot Web** | `platforms/github-copilot-web/` | ✅ Active | `.github/`-only heir — Alex instructions guide Copilot Chat **and** the Copilot Coding Agent (autonomous PR creation from issues) |

**GitHub Copilot on the Web** — Alex's `.github/copilot-instructions.md` is already read by GitHub Copilot in repository chat (`github.com/copilot`, `github.dev`). This heir is a curated `.github/` deploy — instructions, skills, prompts — tuned for the web context. No TypeScript required. Zero compute cost.

**Killer feature**: The Copilot Coding Agent (`github.com/copilot/agents`) reads Alex's `.github/` files autonomously — assign a GitHub issue to Copilot and it creates a branch, writes code in a GitHub Actions sandbox, and opens a PR, all guided by Alex identity, instructions, and skills. Also supports coding agent hooks, MCP servers, and custom specialized agents.

---

## 🌟 Executive Summary

### Current State

v5.9.2 is current. Alex now has:
- **123 Skills** (109 inheritable to heirs) — Comprehensive domain coverage
- **22 Complete Trifectas** — 9 added in cognitive sprint (VS Code, M365, cross-domain capabilities) for 17.2% trifecta coverage
- **Skill Discoverability** — 20 skills enriched with ~3× more activation keywords; skill-activation index now has 90+ entries with natural-language triggers
- **Staleness Management** — 16 staleness-prone skills tracked with refresh triggers, owners, and validation dates
- **Secrets Management** — VS Code SecretStorage API, .env file detection, platform-native encrypted storage
- **Skill Intelligence** — Context-aware recommendations (30 tech mappings, 15 file types, 18 personas) with user preference tracking
- **Propose-to-Global Workflow** — One-click skill contribution for heirs (<5 min vs. 30 min manual process)
- **v3-Identity-First Brain** — copilot-instructions.md restructured: identity → routing → safety
- **Prompt Pipeline Research** — Full mapping of how VS Code/Copilot injects context into LLM
- **Visual Identity** — 44 avatar images (age progression + occupation variants) at 256×256px
- **Dynamic Avatar State System** — Welcome panel avatar responds to cognitive states (9 states including dream), agent modes, active skills with unified priority-chain resolution
- **Semantic Persona Detection** — Regex-weighted signal architecture replacing flat keyword matching
- **Enterprise Security** — Entra ID SSO, RBAC, secrets scanning, audit logging
- **Text-to-Speech** — Multi-language voice synthesis with 35 test cases
- **Voice Mode** — Continuous reading, speak prompt, auto-summarization
- **Model Intelligence** — Tier detection, task matching, `/model` advisor
- **Skill-Building Infrastructure** — Heirs can create and promote quality skills
- **Release Automation** — Automated master→heir sync with PII protection (sync-architecture.js v3-fixed)
- **Skill Pull-Sync** — Heirs can discover and inherit skills from Global Knowledge
- **API Key Observability** — brain-qa Phase 35 warns when required skill API keys are missing at runtime; `apiKeys` field in SYNAPSE-SCHEMA enables declarative key documentation per skill
- **Synapse Sync Hardening** — Phase 7 full-content comparison (vs. count-only) ensures all synapse field changes propagate to heir, not just connection additions/removals
- **Agent Hooks** — SessionStart/Stop/PreToolUse/PostToolUse automation via `.github/hooks.json`; context loading, meditation suggestions, safety gates, tool logging
- **Copilot Memory** — Cross-session context persistence supplements file-based memory; memory section added to copilot-instructions.md with when/where guidelines
- **Subagent Platform** — All 6 specialist agents have `user-invokable: true`; parallel Researcher+Builder+Validator execution enabled
- **Plan Agent** — `/plan` prompt with 4-phase workflow (Discovery→Alignment→Design→Refinement) and 3 Alex-specific templates

### Vision Forward

| Phase  | Focus                                 | Timeline     |
| ------ | ------------------------------------- | ------------ |
| v5.6.x | Enterprise Systems Integration        | ✅ Stabilized |
| v5.7.x | UI/UX Stabilization + Visual Identity | ✅ Q1 2026   |
| v5.8.x | @alex Enhanced Mode                   | ✅ Q1 2026   |
| v5.9.x | VS Code API Adoption + Stabilization  | ✅ Q1 2026 (end of March) |
| v6.x   | Autonomous Cognition + Deep Memory    | Q1-Q2 2027   |
| v7.0   | Collaborative Intelligence            | Q3 2027+     |

**Platform milestones**:
- VS Code heir: primary, active, publishing cadence aligned with version releases
- M365 heir: active, Foundry POC on hold pending demand signal
- GitHub Copilot Web heir: active — `.github/`-only deploy at `platforms/github-copilot-web/`; Copilot Coding Agent reads Alex instructions for autonomous PR creation

---

## Version Status

| Version    | Focus                               | Paradigm                     | Status                     |
| ---------- | ----------------------------------- | ---------------------------- | -------------------------- |
| v5.3.0     | Enterprise Readiness                | Trust at Scale               | ✅ Complete                 |
| v5.3.1     | CSP Security Fix                    | Secure UX                    | ✅ Complete                 |
| v5.4.0-3   | Text-to-Speech & Voice              | Accessible Cognition         | ✅ Complete                 |
| v5.5.0     | Model Intelligence                  | Adaptive Cognition           | ✅ Complete                 |
| v5.6.0-9   | Enterprise Systems                  | Deep Orchestration           | ✅ Stabilized (5.6.9 final) |
| v5.7.0     | Structural Consistency              | Purpose-Built Cognition      | ✅ Shipped                  |
| v5.7.1     | Visual Identity + UI/UX Polish      | Stable Foundation            | ✅ Shipped                  |
| **v5.7.2** | **Global Knowledge Maintenance**    | **Knowledge Infrastructure** | **✅ Shipped**              |
| v5.7.3-4   | *reserved for UI/UX fixes*          |                              |                            |
| **v5.7.5** | **Skill Intelligence**              | **Context-Aware Guidance**   | **✅ Shipped**              |
| v5.7.6     | Office Add-in Platform Research     | Platform Exploration         | ✅ Complete (2026-02-15)    |
| v5.7.7     | Propose-to-Global Workflow          | Knowledge Contribution       | ✅ Shipped (2026-02-15)     |
| v5.7.8-9   | *reserved for UI/UX fixes*          |                              |                            |
| **v5.8.0** | **@alex Prompt Engine (P0)**        | **Purpose-Built Cognition**  | **✅ Shipped (2026-02-16)** |
| **v5.8.1** | **@alex Tools + File Context (P1)** | **Purpose-Built Cognition**  | **✅ Shipped (2026-02-16)** |
| **v5.8.2** | **@alex Personality Polish (P2)**   | **Purpose-Built Cognition**  | **✅ Shipped (2026-02-16)** |
| **v5.8.3** | **Welcome Panel UI Polish**         | **UI/UX Refinement**         | **✅ Shipped (2026-02-17)** |
| **v5.8.4** | **Secrets Management**                   | **Security & Credential Management**    | **✅ Shipped (2026-02-19)** |
| **v5.8.5** | **Cognitive Architecture Enhancement**   | **Skill Intelligence & Maintenance**    | **✅ Shipped (2026-02-19)** |
| **v5.9.0** | **VS Code API Adoption**                 | **Platform Leverage**                   | **✅ Shipped (2026-02-19)** |
| v5.9.1     | Platform Quick Wins                 | Platform Leverage            | ✅ In Progress              |
| v5.9.2     | *hotfix buffer for v5.9.1*          |                              |                             |
| v5.9.3     | Stabilization + Quality Gates       | Production Maturity          | 📋 Planned                  |
| v5.9.4     | *hotfix buffer for v5.9.3*          |                              |                             |
| v5.9.5     | Proposed API Adoption               | Proposed API Leverage        | 📋 Planned (upstream-gated) |
| v5.9.6     | *hotfix buffer for v5.9.5*          |                              |                             |
| v5.9.7-9   | *reserved for community feedback*   |                              |                             |
| v6.0.0     | Autonomous Workflows                | Autonomous Cognition         | 📋 Planned                  |
| v6.1.0     | Deep Memory + Learning Loops        | Autonomous Cognition         | 📋 Planned                  |
| v6.2.0     | Skill Marketplace (if community)    | Autonomous Cognition         | 📋 Planned                  |
| v6.3-9     | *reserved for fixes/enhancements*   |                              |                            |
| v7.0.0     | Collaborative Intelligence          | Collective Cognition         | 📋 Planned                  |

---

## 🎯 Version Details

### Definition of Done

A version is **done** when ALL of the following are true:

1. **Builds clean** — `npm run compile` exits 0 with zero errors
2. **No dead code** — Every import resolves, every export is consumed, no orphaned modules
3. **Counts match reality** — Slash commands, tools, skills, trifectas in docs match actual code
4. **F5 smoke test passes** — Extension activates in sandbox, welcome view renders, 3 random commands work
5. **Version aligned** — package.json, CHANGELOG, copilot-instructions.md all show the same version
6. **Heir sync clean** — `sync-architecture.js` runs with 0 errors, heir activates independently
7. **No non-functional features** — If it's in the UI or command palette, it works. If it doesn't work, it's removed.
8. **CHANGELOG documents the delta** — Every user-visible change has a line item

> **Principle**: Ship what works. Remove what doesn't. Document what changed.

### v5.7.5 — Skill Intelligence ✅ **SHIPPED (2026-02-15)**

**Theme**: Make skills discoverable and contextually relevant — suggest the right capability at the right moment.

**Status**: Shipped with skill mappings, recommendation engine, and UI/UX trifecta. Details in Appendix.

**Tagline**: The right skill, right when you need it.

---

### v5.8.x — @alex Enhanced Mode ⭐ ✅ **SHIPPED (2026-02-16)**

**Theme**: Transform the @alex chat participant from a 2-message passthrough into a 10-layer cognitive prompt engine — purpose-built, efficient, and uniquely Alex.

**Status**: All phases (P0, P1, P2) shipped. Details in Appendix.

**Tagline**: Agent mode is your **workshop**. @alex is your **mentor**.

---

### v5.8.5 — Cognitive Architecture Enhancement ✅ **SHIPPED (2026-02-19)**

**Theme**: Make the cognitive architecture self-maintaining — skills are discoverable, trifectas complete, and staleness actively tracked.

**Status**: Shipped. +9 trifectas (22 total), 20 enriched skills, 16 staleness entries. Details in Appendix.

**Tagline**: More skills, better found, never stale.

---

### v5.9.x — VS Code API Adoption + Stabilization (IN PROGRESS)

**Theme**: Leverage emerging VS Code APIs for free platform wins. Harden for production. Foundry POC only if demand exists.

**Paradigm**: Platform leverage + production maturity — ride the wave, then polish for community.

**Prerequisite**: v5.8.x ships with @alex Enhanced Mode P0 + P1 complete.

**Guiding Principle**: Expand only if the user experience improvement is obvious and immediate. If it requires weeks of work for speculative value, it stays in backlog.

#### v5.9.0 — VS Code API Adoption (free leverage) ✅ SHIPPED

| Task                             | Owner | Effort | Priority | Status | Description                                           |
| -------------------------------- | :---: | :----: | :------: | :----: | ----------------------------------------------------- |
| Agent Hooks (lifecycle events)   | Heir  |   2d   |    P0    |   ✅    | SessionStart/Stop/PreToolUse/PostToolUse hook scripts  |
| Copilot Memory API integration   | Heir  |   1d   |    P0    |   ✅    | Settings + instructions + meditation curation          |
| Subagents parallel execution     | Heir  |   1d   |    P1    |   ✅    | `user-invokable: true` on all 6 specialist agents      |
| Plan Agent prompt template       | Heir  |   0.5d |    P1    |   ✅    | `/plan` 4-phase workflow with 3 Alex templates         |
| Claude Opus/Sonnet compatibility | Heir  |   1d   |    P1    |   ✅    | Settings.json updated with `claude-opus-4-*.extendedThinkingEnabled=true` + `thinkingBudget=16384`. Template profile updated to `claude-opus-4-6`. |
| MCP Apps for tool packaging      | Heir  |   2d   |    P2    |   ✅    | `chat.mcp.gallery.enabled=true` in settings. `.github/config/mcp-catalog.json` ships recommended server configs (Azure, GitHub, filesystem). Full ext-apps SDK packaging deferred to backlog. |

> **v5.9.1 Foundry POC** — Moved to low-priority backlog (2026-02-19). Re-activates only when a real user or team asks "I want Alex in Teams." See Backlog section.

#### v5.9.1 — Platform Quick Wins

**Theme**: Immediate, low-effort leverage from VS Code v1.109.5 — ship fast, independent of stabilization work.

**Estimated effort**: ~3 days | **Gate**: All tasks self-contained, no upstream dependency

| Task | Owner | Effort | Priority | Status | Description |
| ---- | :---: | :----: | :------: | :----: | ----------- |
| Avatar state system | Heir | 0.5d | P0 | ✅ | Dynamic avatar resolution in WelcomeViewProvider: cognitive state tracking (`_cognitiveState`), agent mode tracking (`_agentMode`), unified `resolveAvatar()` with AvatarContext, priority chain (Agent > State > Skill > Persona > Age > Default), `alex.setCognitiveState` and `alex.setAgentMode` commands |
| STATE-DREAM.png | Heir | 0.5h | P0 | ✅ | Dream cognitive state image via Replicate nano-banana-pro ($0.03), resized to 768×768, added to COGNITIVE_STATE_MAP and COGNITIVE_STATE_TRIGGERS |
| Agent mode banners | Heir | 0.5d | P1 | ✅ | Generated 6 agent images: AGENT-{RESEARCHER,BUILDER,VALIDATOR,DOCUMENTARIAN,AZURE,M365}.png via nano-banana-pro. Default Alex agent uses persona images. |
| Cognitive state images | Heir | 0.5d | P1 | ✅ | All 9 STATE-*.png images generated: meditation, dream, debugging, discovery, planning, teaching, building, reviewing, learning |
| `chatSkills` contribution point | Heir | 2h | P0 | ✅ | Expanded `chatSkills` from 68 → 114 skills in package.json; removed 7 internal skills (user-invokable: false) and 1 stale reference (microsoft-sfi). All 114 user-facing skills now auto-discovered. |
| Multiple model fallback in agents | Heir | 2h | P0 | ✅ | All 7 agents now have `model: ['Claude Sonnet 4', 'GPT-4o', 'Claude Opus 4']` fallback arrays; Researcher uses Opus-first for frontier reasoning. |
| Agent frontmatter audit | Heir | 1d | P1 | ✅ | All agents have consistent frontmatter: `user-invokable: true`, standardized field ordering, Alex orchestrator has `agents:` list. |
| Claude Opus/Sonnet compatibility | Heir | 1d | P1 | ✅ | Model names verified, agent configuration consistent, skill activation patterns work correctly with both Claude model tiers. |
| Claude compatibility validation | Heir | 0.5d | P2 | ✅ | Documented in ASSISTANT-COMPATIBILITY.md — VS Code 1.109+ reads `.github/` and `.claude/` paths natively; teams can share skills/agents without duplication via symlinks. Not a new heir (Format Heir = rewrite, not recommended). |

#### v5.9.2 — *Hotfix buffer for v5.9.1*

*Reserved for post-ship fixes. Activated if v5.9.1 produces regressions or edge cases in the skills contribution point or agent frontmatter changes.*

---

#### v5.9.3 — Stabilization + Quality Gates

**Theme**: Harden for production — every feature works on a fresh install, docs are complete, performance is profiled.

**Estimated effort**: ~1-2 weeks | **Gate**: Internal — ships when quality checklist is green

**Goals**:
- All quality gates pass consistently across fresh installs and upgrades
- Documentation covers 100% of features for new users
- Performance profiling — startup time, memory footprint, prompt latency
- Community issue triage and fix cycle
- Accessibility audit (screen reader, high contrast, reduced motion)
- Localization completeness for top 5 languages

#### v5.9.4 — *Hotfix buffer for v5.9.3*

*Reserved. Likely used for accessibility fixes or localization corrections surfaced post-audit.*

---

#### v5.9.5 — Proposed API Adoption

**Theme**: Leverage proposed VS Code APIs from v1.109.5 as they finalize — dynamic skill injection, native API key config UI, interactive chat renderers.

**Estimated effort**: ~1 week | **Gate**: External — waits on VS Code promoting proposed APIs to stable

| Task | Owner | Effort | Priority | Status | Description |
| ---- | :---: | :----: | :------: | :----: | ----------- |
| Chat prompt files API | Heir | 2d | P1 | 📋 | `vscode.chat.registerSkillProvider()` + `registerCustomAgentProvider()` + `registerInstructionsProvider()` — contribute Alex skills/agents dynamically from TypeScript; enables context-aware skill injection (e.g., auto-load `azure` skill when `.bicep` files are open). Tracks `vscode.proposed.chatPromptFiles.d.ts`. |
| Chat Model Provider Config API | Heir | 1d | P1 | 📋 | Migrate Alex's API key setup (Replicate, Azure OpenAI, Graph) to the new `languageModelChatProviders` contribution point — VS Code renders the config UI natively via `chatLanguageModels.json`. Replaces custom settings panels. Tracks `vscode.proposed.lmConfiguration.d.ts`. |
| Chat output renderer | Heir | 3d | P2 | 📋 | Use `chat.registerOutputRenderer` to render Alex's cognitive dashboard, synapse health reports, and brain anatomy visualizations as interactive webviews inside chat responses — no separate panel. Tracks `chat-output-renderer-sample`. |

#### v5.9.6 — *Hotfix buffer for v5.9.5*

*Reserved. Proposed API integrations often surface edge cases on promotion — this slot absorbs them.*

---

> **Platform Documentation** ✅ Complete — Foundry + VS Code 1.109 analysis docs in `alex_docs/platforms/`. Details in Appendix.

---

### 💡 Spin-Off Extension Ideas

*Standalone VS Code extensions that can be built independently of Alex — lightweight utilities targeting a broad audience beyond cognitive architecture users. Each could be built quickly with the codebase patterns already established.*

| Extension | Category | Core Feature | Tech | Effort | Opportunity |
| --------- | :------: | ------------ | :--: | :----: | ----------- |
| **Replicate Image Studio** | 🎨 Image Gen | Generate images from selection or prompt directly in chat — FLUX, Stability, SDXL, video. Right-click any markdown image reference to regenerate. | Replicate API | 1w | Replicate MCP is already wired in Alex; extract as standalone |
| **Markdown to Word** | 📄 Converter | Convert any `.md` file to `.docx` with one click — tables, code blocks, mermaid diagrams, theme support. Export to Word/Google Docs format. | Pandoc / docx | 3d | Already exists as an Alex skill — extract to standalone |
| **SVG Toolkit** | 🖼️ Image Gen | Generate, edit, and optimize SVGs with AI assist. Convert PNG/JPG → SVG, icon generation, VS Code theme-aware color swaps. | Sharp, AI | 1w | SVG skill exists; standalone widens audience massively |
| **PPTX Builder** | 📊 Converter | Create PowerPoint decks from markdown outlines. Slide-per-heading conversion, branded themes, chart generation from code blocks. | pptxgenjs | 4d | pptxgenjs already in deps — extract and expose cleanly |
| **Brandfetch Logo Fetcher** | 🏢 Utility | Fetch company logos by ticker/domain, insert into markdown or code comments. Logo.dev + Brandfetch fallback. | REST APIs | 2d | Brandfetch code is already in Alex extension |
| **Gamma Slide Assistant** | 🎤 Presenter | One-command upload of markdown outlines to Gamma.app via API (when available). AI-enhanced slide titles, speaker notes. | Gamma API | 1w | Gamma skill exists; standalone removes Alex dependency |
| **Mermaid Diagram Pro** | 📐 Diagramming | Enhanced Mermaid editing — live preview, error highlighting, AI-fix on parse error, export to PNG/SVG/PDF. | Mermaid.js | 1w | Alex already has deep mermaid patterns |
| **SecretGuard** | 🔒 Security | Workspace-wide secret scanner with regex patterns, severity tiers, audit log export. CI/CD-ready JSON report output. Standalone from Alex Enterprise. | Regex engine | 3d | Enterprise secret scan already built — trivial to extract |
| **AI Voice Reader** | 🔊 Accessibility | Read any editor content or chat response aloud using system TTS or cloud voices. Per-language voice routing, speed control. | Web Speech API | 3d | TTS module already built in Alex — extract to standalone |
| **Focus Timer** | ⏱️ Productivity | Pomodoro + goals tracker embedded in status bar. Session notes, streak tracking, GitHub Issues sync. Zero AI dependency. | VS Code API | 2d | Focus/goals system already in Alex — extract and simplify |

**Prioritization notes:**
- 🔥 Highest value: Replicate Image Studio, Markdown to Word, SVG Toolkit, SecretGuard — large existing audiences
- ⚡ Fastest to ship: Brandfetch Logo Fetcher, AI Voice Reader, Focus Timer — code already written, just needs packaging
- 🔗 Alex synergy: Keep API keys, settings, and UX patterns consistent to allow future re-integration

---

### v6.0.0 — Autonomous Workflows (PLANNED)

**Theme**: Alex moves from reactive assistant to proactive partner — initiating actions, managing multi-step workflows, and learning from outcomes without constant human direction.

**Paradigm**: Autonomous Cognition — Alex doesn't wait to be asked.

| Task                               | Owner  | Effort | Priority | Status | Description                                               |
| ---------------------------------- | :----: | :----: | :------: | :----: | --------------------------------------------------------- |
| Autonomous task detection          |  Heir  |   1w   | Critical |   📋    | Detect actionable patterns and propose next steps         |
| Multi-step workflow engine         |  Heir  |   2w   | Critical |   📋    | Chain tool calls into declarative YAML workflows          |
| Outcome learning loop              | Master |   1w   |   High   |   📋    | Track action outcomes → reinforce or adjust future advice |
| Proactive code review triggers     |  Heir  |   3d   |   High   |   📋    | Auto-suggest review when PR-sized changes detected        |
| Scheduled maintenance (auto-dream) | Master |   3d   |   High   |   📋    | Scheduled evaluations replace manual `/dream` command     |
| Workspace health dashboard         |  Heir  |   3d   |  Medium  |   📋    | Real-time cognitive health overlay in status bar          |

**Target**: Q1 2027

---

### v6.1.0 — Deep Memory + Learning Loops (PLANNED)

**Theme**: Alex remembers not just facts but patterns of collaboration — what worked, what didn't, and how the user thinks.

| Task                             | Owner  | Effort | Priority | Status | Description                                             |
| -------------------------------- | :----: | :----: | :------: | :----: | ------------------------------------------------------- |
| Episodic memory (session replay) |  Heir  |   1w   |   High   |   📋    | Save & retrieve full session transcripts + code changes |
| Outcome-weighted knowledge       | Master |   1w   |   High   |   📋    | Knowledge entries gain confidence scores from usage     |
| User learning model              | Master |   1w   |   High   |   📋    | Track user expertise growth, adapt explanation depth    |
| Spaced repetition for skills     |  Heir  |   3d   |  Medium  |   📋    | Surface skills at optimal review intervals              |
| Cross-project pattern mining     |  Heir  |   1w   |  Medium  |   📋    | Auto-detect reusable patterns across heir projects      |

**Target**: Q1-Q2 2027

---

### v6.2.0 — Skill Marketplace (PLANNED — if community warrants it)

**Theme**: Users and teams publish, share, and install Alex skills like npm packages — creating a community-driven intelligence layer.

**Compelling trigger**: Only pursue when there are 500+ active users or 3+ teams creating custom skills. Until then, Global Knowledge + manual skill sharing is sufficient.

| Task                                | Owner  | Effort | Priority | Status | Description                                               |
| ----------------------------------- | :----: | :----: | :------: | :----: | --------------------------------------------------------- |
| Skill package format (`.alexskill`) |  Heir  |   1w   | Critical |   📋    | Portable skill bundle with metadata, tests, synapses      |
| Skill registry API                  |  Heir  |   2w   | Critical |   📋    | GitHub-backed registry for publishing and discovery       |
| Install/uninstall from chat         |  Heir  |   3d   |   High   |   📋    | `/skill install react-patterns` from @alex                |
| Skill quality scoring               | Master |   1w   |   High   |   📋    | Usage frequency, success rate, synapse density scoring    |
| Team skill bundles                  |  Heir  |   1w   |  Medium  |   📋    | Curated skill packs for roles (frontend, backend, DevOps) |
| Skill versioning + updates          |  Heir  |   3d   |  Medium  |   📋    | Semantic versioning, auto-update notifications            |

**Target**: Q2 2027

---

### v7.0.0 — Collaborative Intelligence (PLANNED)

**Theme**: Multiple Alex instances collaborate across a team — sharing insights, coordinating reviews, and building collective organizational intelligence. Alex evolves from personal assistant to team cognition layer.

**Paradigm**: Collective Cognition — Alex learns from the whole team, not just one person.

| Task                                | Owner  | Effort | Priority | Status | Description                                                   |
| ----------------------------------- | :----: | :----: | :------: | :----: | ------------------------------------------------------------- |
| Team knowledge mesh                 | Master |   2w   | Critical |   📋    | Federated knowledge graph across team members' Alex instances |
| Collaborative code review           |  Heir  |   2w   | Critical |   📋    | Alex instances exchange review insights across PRs            |
| Organizational learning aggregation | Master |   2w   |   High   |   📋    | Team-level patterns emerge from individual session data       |
| Expertise routing                   |  Heir  |   1w   |   High   |   📋    | "Ask Sarah's Alex about Kubernetes" — cross-instance queries  |
| Shared skill curation               |  Heir  |   1w   |  Medium  |   📋    | Team votes on skill quality, surfaces best practices          |
| Privacy-preserving learning         | Master |   2w   | Critical |   📋    | Differential privacy for team aggregation, zero PII leaks     |
| Onboarding acceleration             |  Heir  |   1w   |  Medium  |   📋    | New team members bootstrap from team's collective knowledge   |
| Enterprise admin dashboard          |  Heir  |   2w   |  Medium  |   📋    | Fleet overview, usage analytics, compliance reporting         |

**Target**: Q3 2027+

---

## 📋 Backlog (Unscheduled)

Items to pull from when capacity frees up:

| Task                              |   Owner    | Effort  |          Priority           | Description                                                                                                                                                                        |
| --------------------------------- | :--------: | :-----: | :-------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Teams Deep Integration (v6.0)** |  **M365**  | **12w** |        **📋 PLANNED**        | **Bot Framework + Message Extensions + Meeting Integration + Activity Feed — Complete implementation plan in `TEAMS-DEEP-INTEGRATION-PLAN.md` with 143-item deployment checklist** |
| **Foundry POC** (was v5.9.1)      |  **Heir**  | **1w**  |           **Low**           | **Foundry project + Alex orchestrator + Teams publish + baseline eval. Trigger: real user/team requests Alex in Teams.** |
| MCP Apps packaging                |    Heir    |   3d    |             P2              | Package Alex tools (meditation, dream, self-actualization) as installable MCP Apps with rich interactive UI. Official SDK now available: `modelcontextprotocol/ext-apps`. Unblock after v5.9.1. |
| Terminal sandboxing for hooks     |    Heir    |   1d    |             P2              | Alex's `hooks.json` runs shell commands at `PreToolUse`/`PostToolUse`. Document `chat.tools.terminal.sandbox.enabled` in hook instructions for macOS/Linux users. Windows unaffected. |
| Agent sessions welcome page eval  |    Heir    |   0.5d  |             P3              | Evaluate whether Alex's welcome panel should integrate with or complement VS Code's new `agentSessionsWelcomePage` (`workbench.startupEditor`). Avoid fighting for startup editor real estate. |
| Hosted Agent Container Deploy     |    Heir    |   3d    |           Medium            | Containerized Alex on managed infrastructure (VS Code/M365 hosting)                                                                                                                |
| Local Model Usage Learning        |   Master   |   2h    |             Low             | Learn from your usage patterns to improve advice                                                                                                                                   |
| Learning Journeys                 |    Heir    |   3h    |           Medium            | Curated skill progressions                                                                                                                                                         |

### Office Add-in — M365 Heir (Phase 2/3, Low Priority)

**Phase 1** ✅ Complete — unified manifest, task pane, OneDrive integration. Details in Appendix.

**Phase 2** (Low, trigger: active M365 heir users):
- Word template insertion, Excel learning tracker, PowerPoint slide gen, Outlook email drafting

**Phase 3** (Low, future): Real-time collab, custom Excel functions, Office script automation, clipboard integration

**Reference**: [ADR-011](alex_docs/decisions/ADR-011-office-addins-m365-integration.md)

### Research Findings (from alex_docs/ audit — 2026-02-14)

| Finding                           | Source Document                             | Priority | Description                                                                                  |
| --------------------------------- | ------------------------------------------- | :------: | -------------------------------------------------------------------------------------------- |
| GK pattern format inconsistency   | GK-PATTERN-FORMAT-STANDARD.md               |    P2    | Migrate final 4 patterns to YAML v2 frontmatter (28/32 complete in v5.6.5)                   |
| fs-extra → vscode.workspace.fs    | ADR-008-workspace-file-api.md               |    P1    | 10 files need migration, priority order defined                                              |
| VS Code source integration        | VSCODE-SOURCE-INTEGRATION-ANALYSIS.md       |    P1    | 10 integration opportunities, all not started                                                |
| Copilot API enhancement checklist | VSCODE-COPILOT-API-ANALYSIS.md              |    P1    | Multiple items in progress, others not started                                               |
| Semantic Skill Graph              | SEMANTIC-SKILL-GRAPH.md                     |    P2    | Embedding-based skill discovery using Azure OpenAI — 4-phase proposal                        |
| Cognitive Dashboard               | COGNITIVE-DASHBOARD-DESIGN.md               |    P2    | Unified webview for brain health, skill network, memory visualization                        |
| Presentation automation           | gamma/MARP-AUTOMATION-PLAN.md + PPTXGENJS   |    P1    | Template-driven Marp + PptxGenJS generators with Replicate image integration                 |
| Academic paper finalization       | AI-ASSISTED-DEVELOPMENT-METHODOLOGY.md      |    P2    | 1706-line paper, 62-project case study — needs peer review prep                              |


### Replicate Platform Evaluation (2026-02-14)

| Finding                         | Source Document         | Priority | Description                                                                |
| ------------------------------- | ----------------------- | :------: | -------------------------------------------------------------------------- |
| Runtime image generation        | REPLICATE-EVALUATION.md |    P1    | `replicateService.ts` for runtime image gen — replaces DALL-E (ADR-007)    |
| Image upscaling via Replicate   | REPLICATE-EVALUATION.md |    P2    | Super-resolution for avatar images and presentation assets                 |
| FLUX fine-tune for Alex brand   | REPLICATE-EVALUATION.md |    P2    | Custom LoRA trained on Alex's visual identity for consistent brand imagery |
| Video generation capabilities   | REPLICATE-EVALUATION.md |    P3    | Animated tutorials and visual explanations via Wan 2.1                     |

---

## 🎯 Priority Matrix — What Ships When

---

### v5.9.1 (Stabilization + Polish)

> Next target. See Version Details for goals.

### v6.0.0 (Autonomous Workflows)

```
Task detection + multi-step workflow engine + outcome learning
= Alex doesn't wait to be asked — it anticipates and acts
```

**Effort**: 4-6 weeks | **Impact**: Paradigm shift — from reactive to proactive

### v6.1-6.2 (Deep Memory → Marketplace)

```
Episodic memory + outcome-weighted knowledge + .alexskill packages
= Alex remembers what worked and grows via community
```

**Effort**: Months | **Impact**: Ecosystem — but only if user base warrants it

### v7.0.0 (Collaborative Intelligence)

```
Team knowledge mesh + expertise routing + privacy-preserving learning
= From personal assistant to organizational cognition layer
```

**Effort**: Months | **Impact**: Transformative — collective AI intelligence

---

## 📚 Historical Reference

**Archived Roadmaps**: See `archive/roadmaps/` for completed versions:
- `ROADMAP-UNIFIED-V3.5-V5.3-COMPLETED.md` — Full history v3.5-v5.3.0

**Version History Summary**:
| Version Range | Theme                            | Completion       |
| ------------- | -------------------------------- | ---------------- |
| v3.6.0-v3.9.0 | Dawn → Awareness                 | Jan 2026         |
| v4.0.x        | Trust (CAIR/CSR)                 | Jan 2026         |
| v4.1.0-v4.3.0 | Skills & Architecture            | Feb 2026         |
| v5.0.x-v5.2.0 | Team Scaling & UX                | Feb 2026         |
| v5.3.0        | Enterprise Readiness             | Feb 8, 2026      |
| v5.3.1        | CSP Security Fix                 | Feb 8, 2026      |
| v5.4.0-v5.4.3 | Text-to-Speech & Voice           | Feb 9, 2026      |
| v5.5.0        | Model Intelligence               | Feb 10, 2026     |
| v5.6.0-5.6.9  | Enterprise Systems               | Feb 10-14, 2026  |
| v5.7.0        | Structural Consistency           | Feb 14, 2026     |
| v5.7.1        | Visual Identity + UI/UX Polish   | Feb 15, 2026     |
| **v5.7.2**    | **Global Knowledge Maintenance** | **Feb 15, 2026** |
| **v5.7.5**    | **Skill Intelligence**           | **Feb 15, 2026** |
| **v5.8.2**    | **@alex Enhanced Mode**          | **Feb 16, 2026** |
| **v5.8.4**    | **Secrets Management**           | **Feb 19, 2026** |
| **v5.8.5**    | **Cognitive Architecture Enhancement** | **Feb 19, 2026** |

---

|                            |                               |
| -------------------------- | ----------------------------- |
| **Current Master Version** | 5.9.2                               |
| **Current Heirs**          | VS Code (5.9.2), M365 (5.9.2)      |
| **Next Target**            | 5.9.3 — Stabilization + Quality Gates                          |
| **Updated**                | 2026-02-20                          |
| **Archived From**          | ROADMAP-UNIFIED.md (v3.5-5.3)      |

---

## 📖 Appendix: Completed Version History

### v5.5.0 — Model Intelligence (COMPLETE)

**Theme**: Smarter model utilization — detect, recommend, and optimize for the running LLM.

| Task                    | Owner  | Effort | Priority | Status | Description                                    |
| ----------------------- | :----: | :----: | :------: | :----: | ---------------------------------------------- |
| Model Tier Detection    |  Heir  |   2h   |   High   |   ✅    | Detect running model via VS Code/Copilot API   |
| Task-Model Matching     | Master |   2h   |   High   |   ✅    | Map cognitive tasks to minimum model tier      |
| Model Status in /status |  Heir  |   1h   |   High   |   ✅    | Display current model tier and capabilities    |
| Model Selection Advisor |  Heir  |   3h   |  Medium  |   ✅    | `/model` command with upgrade/downgrade advice |

**Completed 2026-02-10**:
- `modelIntelligence.ts` — Tier detection with patterns for Claude, GPT, Gemini
- Warnings in `/meditate`, `/dream`, `/selfActualize`, `/learn` handlers
- Model info display in `/status` command
- `/model` command — Full dashboard + task-specific recommendations
- Enterprise Settings Docs — All 17 settings documented in `alex_docs/guides/ENTERPRISE-SETTINGS.md`
- Automated Doc Count Validation — Dream protocol verifies instruction/skill counts match actuals
- Secrets Pattern Extensibility — User-defined regex patterns via `alex.enterprise.secrets.customPatterns`
- **Heir Evolution Cycle**: 12 skills promoted from sandbox heir (79→92 total skills)
- **Skill Consolidation**: Merged 4 granular skills into 2 comprehensive ones (KISS principle)
- **skill-building Skill**: 376-line meta-skill for heir skill creation and promotion
- **Muscles Architecture**: `.github/muscles/` folder — execution scripts as "Motor Cortex" (not memory)
- **Skill Script Refactoring**: brain-qa (543→90 lines), release-preflight (426→105 lines), 77-skill audit
- **Synapse Health**: 174→206 synapses, normalized formats, added synapses to 9 skills
- **Quality Gate 4.5**: Promotion Readiness Score (0-16) in heir-skill-promotion.instructions.md
- **Global Knowledge**: 257 entries (28 patterns + 229 insights)

---

### v5.6.0 — Enterprise Systems Integration (STABILIZED)

**Theme**: Deep connectivity with Microsoft ecosystem for enterprise workflows.

**Paradigm**: Deep orchestration — Alex becomes the cognitive layer across the entire Microsoft stack.

**Status**: Stabilized at v5.6.9. Patches 5.6.1-5.6.9 focused on quality: PII protection, heir decontamination, self-containment, release automation, skill sync, persona detection, and semantic signals. Microsoft Graph integration was implemented but proved non-functional and was removed in v5.7.1 (moved to backlog).

| Task                        | Owner | Effort | Priority | Status | Description                     |
| --------------------------- | :---: | :----: | :------: | :----: | ------------------------------- |
| Microsoft Graph Integration | Heir  |   1w   | Critical |   ❌    | Removed v5.7.1 — non-functional |

**Completed 2026-02-10** (Graph removed 2026-02-14):
- **Graph removal**: microsoftGraph.ts, 4 slash commands (/calendar, /mail, /context, /people), 7 enterprise settings, Welcome View buttons — all removed as non-functional
- **Skill-Building Infrastructure**: `skill-building/SKILL.md` (376 lines) + Promotion Readiness Score
- **Heir Evolution Cycle**: 12 skills promoted from sandbox (79→92 total skills)
- **Synapse Health Fix**: Fixed file index limit causing false positives (500→targeted patterns)
- **Global Knowledge**: 257 entries (28 patterns + 229 insights)

**Reference Projects**:
- `FabricManager`, `FishBowl-Fabric` — Fabric integration patterns
- `cpesynapse` — Azure Synapse examples
- `VT_AIPOWERBI` — Power BI AI integration
- `AIRS Enterprise` — Enterprise AI systems

**Stabilized**: v5.6.9 — 2026-02-14 (final patch)

---

### v5.7.x — UI/UX Stabilization + Visual Identity (SHIPPED)

**Theme**: Stabilize the extension after weeks of rapid changes. Give Alex a face. Ship visual identity and welcome panel improvements before adding new cognitive features.

**Paradigm**: Stable foundation — fix what's shaky, ship what's visible, then build on solid ground.

#### v5.7.0 — Structural Consistency (SHIPPED)

| Task                        | Owner  | Effort | Priority | Status | Description                                            |
| --------------------------- | :----: | :----: | :------: | :----: | ------------------------------------------------------ |
| Folder completeness audit   | Master |   2h   | Critical |   ✅    | Initialize/Reset/Manifest now include muscles, assets  |
| .vscodeignore fix           | Master |   1h   |   High   |   ✅    | Assets (banner) now ship in VSIX                       |
| Version alignment           | Master |   1h   |   High   |   ✅    | 19 files updated from stale 5.6.8 to 5.7.0             |
| brain-qa phase table        | Master |  30m   |   High   |   ✅    | Updated 21→32 phases with mode shortcuts               |
| Trifecta count correction   | Master |  30m   |   High   |   ✅    | 8→7 corrected across README, welcomeView               |
| Memory types table update   | Master |  30m   |  Medium  |   ✅    | Replaced deprecated DK-*.md with Skills/Expertise      |
| Semantic persona detection  |  Heir  |   4h   |   High   |   ✅    | Regex-weighted signals replacing flat keyword matching |
| Mermaid GitHub Pastel v2    | Master |   1h   |  Medium  |   ✅    | 6 diagram blocks updated across 5 docs                 |
| sync-architecture.js v3 fix | Master |   2h   | Critical |   ✅    | Heir transformations rewritten for v3-identity-first   |

**Shipped**: v5.7.0 — 2026-02-14

#### Fact-Check Audit (2026-02-14)

Full codebase audit performed across code, heir sync, muscles, scripts, and architecture:

**Code (58 .ts files, ~30,500 lines)**:
| Claim               | Verified | Evidence                                                                       |
| ------------------- | :------: | ------------------------------------------------------------------------------ |
| Model Intelligence  |    ✅     | `modelIntelligence.ts` (582 lines) — tier detection, task matching, `/model`   |
| Microsoft Graph     |    ❌     | `microsoftGraph.ts` removed — non-functional, moved to backlog                 |
| Persona Detection   |    ✅     | `personaDetection.ts` (1,394 lines) — regex-weighted signals, Active Context   |
| Text-to-Speech      |    ✅     | 3 files (1,423 lines) + 257-line test suite                                    |
| 24 Slash Commands   |    ✅     | `participant.ts` — all dispatched (4 Graph commands removed)                   |
| 8 LM Tools          |    ✅     | `tools.ts` (1,406 lines) — all registered via `vscode.lm.registerTool()`       |
| Enterprise Security |    ✅     | `secretsScanning.ts` (522), `auditLogging.ts` (432), `enterpriseAuth.ts` (688) |
| Welcome View        |    ✅     | `welcomeView.ts` — avatars, dashboards                                         |
| Build compiles      |    ✅     | `npm run compile` → exit 0, no errors                                          |

**Architecture**:
| Check                        | Result                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| Master skills                | 116 (2 master-only: heir-curation, master-alex-audit)           |
| Heir skills                  | 114 (correctly excludes master-only)                            |
| Master instructions          | 31                                                              |
| Master prompts               | 19                                                              |
| Master agents                | 7                                                               |
| Trifecta count               | 9 — consistent across copilot-instructions, welcomeView, README |
| brain-qa phases              | 32 master / 25 heir (7 master-only phases skipped)              |
| sync-architecture.js         | 771 lines, 9 transformations, v3-identity-first compliant       |
| package.json version         | 5.7.0 ✅                                                         |
| CHANGELOG version            | 5.7.0 ✅                                                         |
| copilot-instructions version | 5.7.0 ✅                                                         |
| Global Knowledge             | 257 entries (28 patterns + 229 insights)                        |

**Muscles (14 files)**: All clean — no TODO/FIXME, no syntax errors. README line counts updated.

**Scripts (3 files)**: `release-preflight.ps1` (281), `release-vscode.ps1` (143), `release-m365.ps1` (140) — all clean.

**Issues Fixed During Audit**:
- Muscles README: stale line counts corrected
- package-lock.json: regenerated to 5.7.0
- Roadmap: Skills count corrected to 116; GK entries corrected to 257 (28+229); brain-qa phases corrected to 32; sync transformations to 9; slash commands to 24; tools to 8

---

#### v5.7.1 — Visual Identity + UI/UX Stabilization

**Goal**: Alex has a face. Stabilize the UI after weeks of rapid changes. Ship visual improvements that users can see immediately.

**Reference**: [ALEX-AVATAR-INTEGRATION-PLAN.md](alex_docs/features/ALEX-AVATAR-INTEGRATION-PLAN.md)

| Task                         | Owner | Effort | Priority | Status | Description                                                   |
| ---------------------------- | :---: | :----: | :------: | :----: | ------------------------------------------------------------- |
| Graph code removal           | Heir  |   2h   | Critical |   ✅    | microsoftGraph.ts + 4 slash commands + 7 settings removed     |
| Definition of Done created   | Heir  |   1h   |   High   |   ✅    | 8-point shipping criteria added to roadmap                    |
| alex_docs research audit     | Heir  |   2h   |   High   |   ✅    | 44 backlog items extracted from ~120 docs                     |
| Avatar images resized        | Heir  |   1h   |   High   |   ✅    | 44 images at 256×256px, 4.8 MB total in assets/avatars/       |
| Replicate MCP POC            | Heir  |   1h   |   High   |   ✅    | `.vscode/mcp.json` with replicate-mcp — multimedia AI backend |
| Alex-Finch.md created        | Heir  |   1h   |   High   |   ✅    | Core identity document — was referenced but missing           |
| Redundant files archived     | Heir  |  30m   |  Medium  |   ✅    | 3 superseded files moved to archive/                          |
| Synapse validation confirmed | Heir  |  15m   |   High   |   ✅    | JSON schema + pre-commit hook already operational (110/110)   |
| Welcome panel avatar         | Heir  |   3h   |   High   |   ✅    | Show Alex's face in welcome sidebar (age progression)         |
| Persona→avatar mapping       | Heir  |   2h   |   High   |   ✅    | PersonaDetection returns avatarFile per persona               |
| UI/UX regression sweep       | Heir  |   3h   |   High   |   ✅    | Extension audit + all recommendations implemented (61 logs)   |
| Rocket tagline banner        | Heir  |   2h   |  Medium  |   ✅    | Gradient bar with persona-specific bannerNoun, clickable      |
| Self-actualization reward    | Heir  |   1h   |   Low    |   ✅    | AGE_TIERS (9 levels), maturity card in session record         |
| Easter eggs                  | Heir  |   2h   |   Low    |   ✅    | Seasonal + project-name surprise avatars (9 triggers)         |
| Marketing persona coverage   | Heir  |   1h   |  Medium  |   ✅    | 11 new personas from marketing plan (27 total), signals+slots |

**Shipped**: v5.7.1 — 2026-02-15

---

#### Architecture Research & Documentation (COMPLETE)

**Goal**: Deep understanding of the VS Code/Copilot prompt pipeline, enabling informed design decisions for all future features.

| Task                        | Owner  | Effort | Priority | Status | Description                                             |
| --------------------------- | :----: | :----: | :------: | :----: | ------------------------------------------------------- |
| Prompt pipeline anatomy     | Master |   4h   |   High   |   ✅    | PROMPT-PIPELINE-ANATOMY.md — full injection chain map   |
| Appendix A: observed XML    | Master |   2h   |   High   |   ✅    | First-hand XML tag structure from inside running prompt |
| Agent vs @alex gap analysis | Master |   2h   |   High   |   ✅    | 15-dimension comparison, token cost analysis            |
| @alex enhancement plan      | Master |   3h   | Critical |   ✅    | 8-phase plan with code samples, token budgets           |
| Avatar integration plan     | Master |   2h   |   High   |   ✅    | 6 integration points, persona→image mapping             |

**Reference Documentation**:
- [PROMPT-PIPELINE-ANATOMY.md](alex_docs/architecture/PROMPT-PIPELINE-ANATOMY.md) — LLM prompt injection chain
- [ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md](alex_docs/features/ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md) — @alex mode plan
- [ALEX-AVATAR-INTEGRATION-PLAN.md](alex_docs/features/ALEX-AVATAR-INTEGRATION-PLAN.md) — Visual identity plan

**Shipped**: v5.7.0 — 2026-02-14

---

### ✅ v5.7.x Quality Gate — Ship Readiness Checklist

Before any v5.7.x patch ships to Marketplace, ALL of the following must pass.

#### Gate 1: Build & Type Safety

| Check                        | Command                                       | Expected Result             |
| ---------------------------- | --------------------------------------------- | --------------------------- |
| TypeScript compilation       | `npm run compile`                             | Exit code 0, no errors      |
| Type checking                | `npm run check-types`                         | Exit code 0, no errors      |
| No console.log in production | `grep -r "console.log" src/ --include="*.ts"` | Only intentional logs       |
| Bundle size reasonable       | `npx vsce ls` then check VSIX size            | < 15 MB (avatars add ~5 MB) |

#### Gate 2: Architecture Integrity

| Check                           | Command / Method                                | Expected Result                            |
| ------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| sync-architecture.js runs clean | `npm run sync-architecture`                     | 9 transformations, 0 errors                |
| Heir skill count matches        | Compare `.github/skills/` master vs heir        | 117 of 119 skills present (2 master-only)  |
| brain-qa audit                  | `/dream` or run `brain-qa.ps1`                  | 32 phases pass                             |
| Trifecta count consistent       | Check README, welcomeView, copilot-instructions | All say same number                        |
| copilot-instructions.md format  | Manual check                                    | v3-identity-first (Identity section first) |

#### Gate 3: Version Consistency

| Check                           | File                                                | Expected Result             |
| ------------------------------- | --------------------------------------------------- | --------------------------- |
| package.json version            | `platforms/vscode-extension/package.json`           | `"version": "5.7.X"`        |
| CHANGELOG entry                 | `CHANGELOG.md`                                      | `## [5.7.X] - date` at top  |
| copilot-instructions.md version | `.github/copilot-instructions.md`                   | `Last Assessed: ... v5.7.X` |
| No stale version references     | `grep -r "5.6" --include="*.md" --include="*.json"` | Only in historical sections |

#### Gate 4: @alex Participant Validation

| Check                    | Method                                       | Expected Result                  |
| ------------------------ | -------------------------------------------- | -------------------------------- |
| @alex responds           | Type `@alex hello` in chat panel             | Gets personality-driven response |
| /status shows version    | Type `@alex /status`                         | Shows 5.7.X + model tier         |
| /help lists all commands | Type `@alex /help`                           | 24 slash commands listed         |
| /meditate runs           | Type `@alex /meditate`                       | Meditation session executes      |
| /dream runs              | Type `@alex /dream`                          | Dream protocol executes          |
| Tool registration        | Check "Language Model Tools" in output panel | 8 tools registered               |
| Slash command dispatch   | Test 5 random slash commands                 | All execute without error        |

#### Gate 5: Visual & Content

| Check                       | Method                           | Expected Result        |
| --------------------------- | -------------------------------- | ---------------------- |
| Avatar images in VSIX       | `npx vsce ls \| findstr avatar`  | 44 .png files listed   |
| .vscodeignore correct       | `cat .vscodeignore`              | `assets/` NOT excluded |
| README links work           | Check banner URL, external links | All resolve correctly  |
| CHANGELOG documents changes | Read top section                 | All features listed    |
| Landing page version        | `docs/index.html`                | Shows current version  |

#### Gate 6: Marketplace Readiness

| Check                     | Command / Method                             | Expected Result        |
| ------------------------- | -------------------------------------------- | ---------------------- |
| PAT not expired           | `vsce verify-pat fabioc-aloha`               | Success                |
| Package builds            | `npx vsce package --no-dependencies`         | .vsix created          |
| Local install test        | `code --install-extension *.vsix`            | Installs without error |
| F5 sandbox test           | Press F5 in VS Code → test in sandbox window | All features work      |
| No PII in published files | Check .github/ heir output for personal data | No emails, paths, etc. |

#### Gate 7: Regression Check

| Check                         | Method                                        | Expected Result       |
| ----------------------------- | --------------------------------------------- | --------------------- |
| Initialize on fresh workspace | `Alex: Initialize Architecture` in new folder | All files deployed    |
| Enterprise mode (if enabled)  | Set `alex.enterprise.enabled: true`           | Auth + secrets work   |
| Voice mode                    | `Ctrl+Alt+V` or `/voice`                      | TTS works             |
| Keyboard shortcuts            | Test `Ctrl+Alt+R/V/P/D/A`                     | All shortcuts trigger |
| Global Knowledge search       | `/knowledge search error handling`            | Returns results       |

---

## 📦 Appendix — Shipped Versions

This appendix contains completed version details for historical reference. These versions are live in production.

---

### v5.7.1 (✅ SHIPPED — Visual Identity + UI/UX)

**Theme**: Avatar UI, Extension Audit, Async I/O Refactoring
**Shipped**: February 15, 2026

```
Graph removal + Definition of Done + Replicate MCP POC + Alex-Finch.md + Synapse validation confirmed
+ Redundant files archived + Welcome panel avatar + Persona→avatar mapping + UI regression sweep
= Dead code gone, shipping criteria defined, multimedia AI ready, identity documented, Alex has a face, UI is stable
```

**Effort**: ~18h | **Impact**: Visible polish — users see a stable, clean, personal Alex with multimedia AI access

---

### v5.7.2 (✅ SHIPPED — Global Knowledge Maintenance)

**Theme**: Knowledge Infrastructure, Skill Count Accuracy, Dependency Cleanup
**Shipped**: February 15, 2026

```
Global Knowledge maintenance trifecta (skill + script + synapses) + sync-index.ps1 automation
+ Skill count corrections (120 Master → 117 VS Code Heir) + Heir inheritance math pattern
+ Dependabot removal + Index synchronization (273 entries: 32 patterns, 241 insights)
= Systematic GK curation + accurate skill counts + clean dependency management + validated index
```

**Effort**: ~8h | **Impact**: Foundation — ensures Global Knowledge integrity and heir synchronization accuracy

---

### v5.7.5 (✅ SHIPPED — Skill Intelligence)

**Theme**: Context-aware skill recommendations and UI/UX Design trifecta
**Shipped**: February 15, 2026

```
Skill-to-technology mapping (30 tech signals) + Recommendation engine + Welcome View integration
+ Context-aware loading + User preference tracking + UI/UX Design trifecta (WCAG 2.1 AA patterns)
= Proactive skill discovery + systematic accessibility workflows + 11 complete trifectas
```

**Effort**: ~7h | **Impact**: Intelligence — Alex suggests the right skill at the right time + accessibility excellence

**Post-Ship Trifecta Work**:
- ✅ UI/UX Design trifecta created (skill, instruction, prompt, synapses) — WCAG 2.1 AA patterns, design system implementation
- ✅ Bidirectional synaptic connections: code-review (0.85), graphic-design (0.7), testing-strategies (0.8), vscode-extension-patterns (0.75)
- ✅ Updated catalogs: skill-activation, prompt-activation (master + heir), TRIFECTA-CATALOG.md
- ✅ sync-architecture.js trifecta count regex updated (9→11)
- ✅ Documented vscode-configuration-validation as 11th complete trifecta (existing but undocumented)
- ✅ Skills: 120→122, Instructions: 37→38, Complete trifectas: 9→11
- ✅ Source: v5.8.0 accessibility implementation session meditation

---

### v5.7.6 (✅ SHIPPED — Office Add-in Platform Research)

**Theme**: Explore feasibility of deploying Alex cognitive architecture to Microsoft Office (Word/Excel/PowerPoint) as an add-in
**Shipped**: February 15, 2026

**Decision**: **Integrate into M365 heir** via unified manifest (ADR-011)

**Milestone**: ✅ **Decision: Office Add-ins integrate into M365 heir** — 90% shared infrastructure (unified manifest, OneDrive memory, Entra ID, deployment), natural workflow continuity (Teams chat → Office creation), complementary surfaces (conversational + document creation).

**Effort**: ~4h | **Impact**: Strategic clarity — Office Add-ins become additional M365 heir surface alongside Teams/M365 Copilot.

**Deliverables**:
- [OFFICE-ADDINS-RESEARCH.md](alex_docs/platforms/OFFICE-ADDINS-RESEARCH.md) — Full platform analysis
- [ADR-011](alex_docs/decisions/ADR-011-office-addins-m365-integration.md) — Architectural decision record

---

### v5.7.7 (✅ SHIPPED — Propose-to-Global Workflow)

**Theme**: Lightweight workflow for heirs to contribute skills back to Global Knowledge without full promotion ceremony
**Shipped**: February 15, 2026

**Tagline**: Share knowledge without ceremony.

**Milestone**: Heirs can contribute skills to Global Knowledge in <5 minutes ✅

**Effort**: ~4.5h | **Impact**: Democratizes knowledge sharing — reduces 30min manual process to 1-click

**Deliverables**:
- `platforms/vscode-extension/src/commands/proposeSkill.ts` — Command implementation (650+ lines)
- `platforms/vscode-extension/package.json` — Command registration
- `platforms/vscode-extension/CHANGELOG.md` — v5.7.7 release notes

---

### v5.8.0 (✅ SHIPPED — @alex P0: Identity + Memory)

**Theme**: Transform @alex chat participant from passthrough into purpose-built cognitive prompt engine
**Shipped**: February 16, 2026

```
promptEngine.ts + Brain injection + Active Context + Conversation history
= @alex knows who it is + remembers the thread
```

**Effort**: ~9h | **Impact**: Foundational — everything else builds on this

---

### v5.8.1 (✅ SHIPPED — @alex P1: Tools + Files)

**Theme**: Enable @alex to invoke tools, see files, and adapt to model tier
**Shipped**: February 16, 2026

```
Tool calling + File context + Model-adaptive behavior
= @alex can DO things + see files + adapt to model tier
```

**Effort**: ~12h | **Impact**: @alex becomes genuinely useful for daily work

---

### v5.8.2 (✅ SHIPPED — @alex P2: Personality)

**Theme**: Add personality, knowledge pre-seeding, and confidence signaling
**Shipped**: February 16, 2026

```
Pre-seeded knowledge + Persona prompt + Confidence signaling
= @alex is intelligent, personal, and honest about uncertainty
```

**Effort**: ~9h | **Impact**: Differentiation — no other extension does this

---

### v5.8.3 (✅ SHIPPED — Welcome Panel UI Polish)

**Theme**: Compact, polished welcome panel with reduced font sizes and tighter spacing
**Shipped**: February 17, 2026

```
Font size reductions + Spacing optimization + Persona auto-detection
= More content visible, cleaner interface, automatic context updates
```

**Changes**:
- 17 font sizes reduced by 1-2px throughout welcome panel
- Margins/padding/gaps tightened by 2-6px for compact appearance
- Persona refresh button now updates Active Context automatically
- Better information density without sacrificing accessibility

**Effort**: ~4h | **Impact**: Cleaner sidebar, more visible quick actions

---

### v5.8.4 (✅ SHIPPED — Secrets Management)

**Theme**: Comprehensive credential security with VS Code SecretStorage API and proactive .env detection
**Shipped**: February 19, 2026

```
SecretStorage API + Token management UI + .env detection
= Platform-native encrypted storage, proactive security, zero-friction migration
```

**Delivered**:
1. **Complete trifecta** — secrets-management (SKILL.md 342 lines, instructions.md 567+ lines, /secrets prompt, synapses.json)
2. **Centralized service** — secretsManager.ts (750+ lines) with VS Code SecretStorage API integration
3. **Platform encryption** — Windows Credential Manager, macOS Keychain, Linux Secret Service
4. **Token management UI** — Quick pick interface with status indicators and password-masked input
5. **Auto-migration** — Env vars → SecretStorage on activation/initialize/upgrade (non-destructive)
6. **.env file detection** — Workspace scanning with regex parsing, keyword matching, smart exclusions
7. **Token classification** — Recognized tokens (auto-migrate) vs custom secrets (manual review)
8. **Code migration guide** — HTML webview with platform-specific examples (VS Code/Node.js/Scripts)
9. **Commands** — alex.manageSecrets, alex.detectEnvSecrets (Command Palette + Welcome panel)
10. **Gamma integration** — All 3 gamma commands migrated to SecretStorage

---

### v5.8.5 (✅ SHIPPED — Cognitive Architecture Enhancement)

**Theme**: Make the cognitive architecture self-maintaining — skills discoverable, trifectas complete, staleness tracked
**Shipped**: February 19, 2026

```
+9 trifectas + 20 enriched skill keywords + 16 staleness entries
= Skills that can be found, anchored in all 3 memory systems, and never quietly stale
```

**Delivered**:
1. **+9 complete trifectas** (22 total) — chat-participant-patterns, vscode-extension-patterns, mcp-development, microsoft-graph-api, teams-app-patterns, m365-agent-debugging, markdown-mermaid, testing-strategies, knowledge-synthesis
2. **Skill discoverability** — skill-activation index enriched for 20 skills (~3× activation terms); stale `microsoft-sfi` entry removed
3. **Staleness management** — 16 skills tracked in SKILLS-CATALOG (from 8); gamma, mcp, fabric, fabric-notebook, bicep-avm, ai-character-ref refreshed with staleness headers
4. **MCP correctness** — HTTP+SSE transport doctrine replaced by Streamable HTTP (MCP spec 2025-03-26) in mcp-development skill
5. **No code changes** — pure cognitive architecture and documentation release

**Supported tokens**: GitHub, Gamma, Replicate, OpenAI, Anthropic

**Security wins**:
- OS-encrypted storage replaces plaintext .env files
- Proactive scanning prevents accidental credential commits
- Team-wide standardization on secure credential management
- Platform compliance (VS Code recommended API)

**Effort**: ~16h | **Impact**: Critical — production-grade credential security, GitHub best practices

**Trifecta count**: 11→14 (added secrets-management, gamma-presentation, md-to-word)
**Skill count**: 122→124

---

### v5.9.0 (✅ SHIPPED — VS Code API Adoption)

**Theme**: Leverage emerging VS Code APIs for free platform wins.
**Shipped**: February 19, 2026

```
Agent hooks + Copilot Memory API + Subagents + Plan Agent
= @alex gets smarter with zero new infrastructure
```

**Delivered**:
- **Agent Hooks** — `.github/hooks.json` + 4 scripts (SessionStart/Stop/PreToolUse/PostToolUse)
- **Copilot Memory** — Cross-session context persistence; guidelines in copilot-instructions.md
- **Subagent Platform** — All 6 specialist agents `user-invokable: true`; parallel execution enabled
- **Plan Agent** — `/plan` prompt with 4-phase workflow (Discovery→Alignment→Design→Refinement) + 3 templates
- **.vscode/settings.json** — Full VS Code 1.109+ settings block (hooks, memory, subagents, MCP gallery)

**Effort**: ~1 week | **Impact**: Free leverage — ride the platform wave

---

### Completed & Cancelled Items (2026-02-18 / 2026-02-19)

#### Spec Kit M365 Knowledge ✅ COMPLETE (2026-02-18)

Phase-based knowledge files + retrieval directives deployed to M365 heir. All tasks done via Agent Builder UI reorganization.

#### Spec Kit VS Code Instructions ❌ WONTFIX

VS Code auto-loading already optimal for topical organization. Pattern doesn't transfer — the 38-file structure sorted by `applyTo` works correctly; consolidation would lose granularity without benefit.

#### Spec Kit Knowledge Organization — M365 Copilot ❌ Cancelled 2026-02-19

Tasks already completed (see Spec Kit M365 Knowledge above) or marked WONTFIX. Detailed planning notes removed.

#### Spec Kit Instruction Organization — VS Code Extension ❌ Cancelled 2026-02-19

VS Code auto-loading already optimal; pattern doesn't transfer. WONTFIX confirmed. Detailed planning notes removed.

#### Microsoft Graph Integration ✅ COMPLETE (2026-02-18)

Phase 2 workflows (Morning Briefing, Meeting Prep) implemented using built-in M365 capabilities. Phase 3 (custom API plugins) on hold pending platform support.

#### Platform Documentation ✅ COMPLETE

All Foundry + VS Code 1.109 platform analysis docs complete:
- `alex_docs/platforms/FOUNDRY-HEIR.md` — Strategic Foundry assessment
- `alex_docs/platforms/FOUNDRY-CAPABILITIES-DIGEST.md` — Complete capability reference
- `alex_docs/platforms/FOUNDRY-AGENT-IMPLEMENTATION.md` — Agent mapping roadmap
- `alex_docs/platforms/VSCODE-1.109-ADOPTION-PLAN.md` — VS Code feature adoption plan

#### Office Add-in Phase 1 ✅ COMPLETE (v5.7.6)

**Decision**: Integrate into M365 heir via unified manifest (ADR-011)

| Task                    | Status | Description                                     |
| ----------------------- | :----: | ----------------------------------------------- |
| Update unified manifest |   ✅    | `officeAddin` extension added to manifest.json  |
| Build task pane HTML    |   ✅    | Simple chat interface matching M365 Copilot UX  |
| Integrate OneDrive read |   ✅    | Reads profile.md, notes.md from task pane       |
| Test in Word/Excel      |   ⏳    | Sideload and validate basic functionality       |
| Document integration    |   ✅    | M365 heir README updated with Office Add-in     |

**Deliverables**: `manifest.json` (extensions array), `taskpane.html`, `taskpane.js`, `OFFICE-ADDINS-README.md`

#### Research Findings — Completed Items

| Finding                   | Completed                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------- |
| Missing Alex-Finch.md     | ✅ Created in v5.7.1 — `alex_docs/alex/Alex-Finch.md`                              |
| Redundant files cleanup   | ✅ Archived in v5.7.1 — 3 files moved to `archive/`                                |
| UI/UX Design trifecta     | ✅ Created 2026-02-15 — Complete trifecta (skill + instruction + prompt + synapses) |
| Replicate MCP gallery     | ✅ Configured in v5.7.1 — `.vscode/mcp.json` with replicate-mcp                    |

---

*From purpose-built cognition → autonomous workflows → collaborative intelligence — the evolution from personal assistant to organizational mind.*
