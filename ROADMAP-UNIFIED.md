# Alex Cognitive Architecture — Roadmap v5.7-v7.0

**Last Updated**: February 15, 2026

> **Phase: Cognitive Enhancement → Platform Expansion → Autonomous Intelligence**

---

## 🌟 Executive Summary

### Current State

v5.7.1 is current. Alex now has:
- **116 Skills** (114 inheritable to heirs) — Comprehensive domain coverage
- **v3-Identity-First Brain** — copilot-instructions.md restructured: identity → routing → safety
- **Prompt Pipeline Research** — Full mapping of how VS Code/Copilot injects context into LLM
- **Visual Identity** — 44 avatar images (age progression + occupation variants) at 256×256px
- **Semantic Persona Detection** — Regex-weighted signal architecture replacing flat keyword matching
- **Enterprise Security** — Entra ID SSO, RBAC, secrets scanning, audit logging
- **Text-to-Speech** — Multi-language voice synthesis with 35 test cases
- **Voice Mode** — Continuous reading, speak prompt, auto-summarization
- **Model Intelligence** — Tier detection, task matching, `/model` advisor
- **Skill-Building Infrastructure** — Heirs can create and promote quality skills
- **Release Automation** — Automated master→heir sync with PII protection (sync-architecture.js v3-fixed)
- **Skill Pull-Sync** — Heirs can discover and inherit skills from Global Knowledge

### Vision Forward

| Phase  | Focus                                 | Timeline     |
| ------ | ------------------------------------- | ------------ |
| v5.6.x | Enterprise Systems Integration        | ✅ Stabilized |
| v5.7.x | UI/UX Stabilization + Visual Identity | Q1-Q2 2026   |
| v5.8.x | @alex Enhanced Mode                   | Q2 2026      |
| v5.9.x | VS Code API Adoption + Stabilization  | Q3-Q4 2026   |
| v6.x   | Autonomous Cognition + Deep Memory    | Q1-Q2 2027   |
| v7.0   | Collaborative Intelligence            | Q3 2027+     |

---

## Version Status

| Version    | Focus                              | Paradigm                | Status                     |
| ---------- | ---------------------------------- | ----------------------- | -------------------------- |
| v5.3.0     | Enterprise Readiness               | Trust at Scale          | ✅ Complete                 |
| v5.3.1     | CSP Security Fix                   | Secure UX               | ✅ Complete                 |
| v5.4.0-3   | Text-to-Speech & Voice             | Accessible Cognition    | ✅ Complete                 |
| v5.5.0     | Model Intelligence                 | Adaptive Cognition      | ✅ Complete                 |
| v5.6.0-9   | Enterprise Systems                 | Deep Orchestration      | ✅ Stabilized (5.6.9 final) |
| v5.7.0     | Structural Consistency             | Purpose-Built Cognition | ✅ Shipped                  |
| **v5.7.1** | **Visual Identity + UI/UX Polish** | **Stable Foundation**   | ✅ Shipped                  |
| v5.7.2-9   | *reserved for UI/UX fixes*         |                         |                            |
| v5.8.0     | @alex Prompt Engine (P0)           | Purpose-Built Cognition | 📋 Planned                  |
| v5.8.1     | @alex Tools + File Context (P1)    | Purpose-Built Cognition | 📋 Planned                  |
| v5.8.2     | @alex Personality + Knowledge (P2) | Purpose-Built Cognition | 📋 Planned                  |
| v5.8.3-9   | *reserved for fixes/enhancements*  |                         |                            |
| v5.9.0     | VS Code API Adoption               | Platform Leverage       | 📋 Planned                  |
| v5.9.1     | Foundry POC (if compelling)        | Platform Leverage       | 📋 Planned                  |
| v5.9.2     | Stabilization + Polish             | Production Maturity     | 📋 Planned                  |
| v5.9.3-9   | *reserved for community feedback*  |                         |                            |
| v6.0.0     | Autonomous Workflows               | Autonomous Cognition    | 📋 Planned                  |
| v6.1.0     | Deep Memory + Learning Loops       | Autonomous Cognition    | 📋 Planned                  |
| v6.2.0     | Skill Marketplace (if community)   | Autonomous Cognition    | 📋 Planned                  |
| v6.3-9     | *reserved for fixes/enhancements*  |                         |                            |
| v7.0.0     | Collaborative Intelligence         | Collective Cognition    | 📋 Planned                  |

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

### v5.8.x — @alex Enhanced Mode ⭐ (PLANNED)

**Theme**: Transform the @alex chat participant from a 2-message passthrough into a 10-layer cognitive prompt engine — purpose-built, efficient, and uniquely Alex.

**Paradigm**: Purpose-built cognition — every token is intentional, every layer serves Alex's identity.

**Prerequisite**: v5.7.x ships with Visual Identity + UI/UX stable.

**Reference**: [ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md](alex_docs/features/ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md)

**Tagline**: Agent mode is your **workshop**. @alex is your **mentor**.

#### v5.8.0 — P0: Critical Path (ship first)

| Task                       | Owner | Effort | Priority | Status | Description                                             |
| -------------------------- | :---: | :----: | :------: | :----: | ------------------------------------------------------- |
| Prompt Engine module       | Heir  |   4h   |    P0    |   📋    | New `promptEngine.ts` — modular 10-layer prompt builder |
| Brain injection (Identity) | Heir  |   2h   |    P0    |   📋    | Read copilot-instructions.md → inject Identity + Safety |
| Active Context injection   | Heir  |   1h   |    P0    |   📋    | ActiveContextManager → persona, objective, focus areas  |
| Conversation history       | Heir  |   2h   |    P0    |   📋    | Include last 4 exchanges from `context.history`         |

**Milestone**: @alex that knows who it is and remembers the conversation.

#### v5.8.1 — P1: High Value (ship next)

| Task                         | Owner | Effort | Priority | Status | Description                                               |
| ---------------------------- | :---: | :----: | :------: | :----: | --------------------------------------------------------- |
| Tool calling in @alex        | Heir  |   4h   |    P1    |   📋    | Pass 7-12 Alex tools via `sendRequest` options            |
| Tool result loop             | Heir  |   3h   |    P1    |   📋    | Handle `LanguageModelToolCallPart` + feed results back    |
| File context from references | Heir  |   2h   |    P1    |   📋    | Extract `request.references` + active editor selection    |
| Model-adaptive behavior      | Heir  |   2h   |    P1    |   📋    | Replace hardcoded `gpt-4o` with tier-aware selection      |
| Model-adaptive prompt rules  | Heir  |   1h   |    P1    |   📋    | Frontier=deep reasoning, Capable=balanced, Efficient=fast |

**Milestone**: @alex can invoke tools, see files, and adapt to model tier.

#### v5.8.2 — P2: Personality Polish (refinement)

| Task                         | Owner | Effort | Priority | Status | Description                                              |
| ---------------------------- | :---: | :----: | :------: | :----: | -------------------------------------------------------- |
| Pre-seeded knowledge context | Heir  |   4h   |    P2    |   📋    | Auto-search memory for user's query terms before sending |
| Persona-driven prompt        | Heir  |   2h   |    P2    |   📋    | Inject persona-specific tone, skills, banner noun        |
| Confidence signaling         | Heir  |   1h   |    P2    |   📋    | Response guidelines: high/medium/low/outside confidence  |
| User profile layer           | Heir  |   1h   |    P2    |   📋    | Inject personalization from user-profile.json            |
| Focus session layer          | Heir  |   1h   |    P2    |   📋    | Inject Pomodoro timer, goals, streaks into prompt        |

**Milestone**: @alex adapts per persona, pre-loads knowledge, signals confidence.

**Target**: Q2 2026

---

### v5.9.x — VS Code API Adoption + Stabilization (PLANNED)

**Theme**: Leverage emerging VS Code APIs for free platform wins. Harden for production. Foundry POC only if demand exists.

**Paradigm**: Platform leverage + production maturity — ride the wave, then polish for community.

**Prerequisite**: v5.8.x ships with @alex Enhanced Mode P0 + P1 complete.

**Guiding Principle**: Expand only if the user experience improvement is obvious and immediate. If it requires weeks of work for speculative value, it stays in backlog.

#### v5.9.0 — VS Code API Adoption (free leverage)

| Task                             | Owner | Effort | Priority | Status | Description                                           |
| -------------------------------- | :---: | :----: | :------: | :----: | ----------------------------------------------------- |
| Agent Hooks (lifecycle events)   | Heir  |   2d   |    P0    |   📋    | `onSend`/`onDidReceiveMessage` for context injection  |
| Copilot Memory API integration   | Heir  |   1d   |    P0    |   📋    | Persistent user preferences via `LanguageModelMemory` |
| Claude Opus/Sonnet compatibility | Heir  |   1d   |    P1    |   📋    | Test + fix for Claude model compatibility             |
| MCP Apps for tool packaging      | Heir  |   2d   |    P2    |   📋    | Package Alex tools as installable MCP Apps            |

#### v5.9.1 — Foundry POC (only if Teams demand exists)

| Task                                  | Owner  | Effort | Priority | Status | Description                                  |
| ------------------------------------- | :----: | :----: | :------: | :----: | -------------------------------------------- |
| Create Foundry project + deploy model |  Heir  |   2h   |   High   |   📋    | Azure subscription + GPT-4.1-mini deployment |
| Build Alex Orchestrator agent         |  Heir  |   2h   |   High   |   📋    | Core personality + system prompt in Foundry  |
| Publish Alex to Teams                 |  Heir  |   2d   |   High   |   📋    | Alex chatbot accessible in Teams             |
| Run baseline evaluation               | Master |   2h   |  Medium  |   📋    | Quality metrics — is it worth expanding?     |

**Compelling trigger**: Do this if and when a real user or team asks "I want Alex in Teams." Until then, VS Code is the primary surface.

#### v5.9.2 — Production Hardening + Community

**Goals**:
- All quality gates pass consistently across fresh installs and upgrades
- Documentation covers 100% of features for new users
- Performance profiling — startup time, memory footprint, prompt latency
- Community issue triage and fix cycle
- Accessibility audit (screen reader, high contrast, reduced motion)
- Localization completeness for top 5 languages

#### Platform Documentation (COMPLETE)

| Task                                 | Owner  | Effort | Priority | Status | Description                            |
| ------------------------------------ | :----: | :----: | :------: | :----: | -------------------------------------- |
| Foundry capabilities digest          | Master |   4h   |   High   |   ✅    | Complete capability reference document |
| Foundry agent implementation roadmap | Master |   4h   |   High   |   ✅    | 6-agent mapping to Foundry             |
| Foundry heir strategic assessment    | Master |   4h   |   High   |   ✅    | FOUNDRY-HEIR.md created                |
| VS Code 1.109 adoption plan          | Master |   2h   |   High   |   ✅    | P0-P3 prioritized feature plan         |
| Master-heir architecture update      | Master |   1h   |   High   |   ✅    | Foundry + new heirs added              |

**Reference Documentation**:
- `alex_docs/platforms/FOUNDRY-HEIR.md` — Strategic Foundry assessment
- `alex_docs/platforms/FOUNDRY-CAPABILITIES-DIGEST.md` — Complete capability reference
- `alex_docs/platforms/FOUNDRY-AGENT-IMPLEMENTATION.md` — Agent mapping roadmap
- `alex_docs/platforms/VSCODE-1.109-ADOPTION-PLAN.md` — VS Code feature adoption

**Target**: Q3-Q4 2026

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

| Task                           | Owner  | Effort | Priority | Description                                                                                                      |
| ------------------------------ | :----: | :----: | :------: | ---------------------------------------------------------------------------------------------------------------- |
| Microsoft Graph Integration    |  Heir  |   1w   |   High   | Calendar, Mail, Presence, People — removed v5.7.1 (non-functional). Re-implement when auth flow works end-to-end |
| Chat Avatar Dynamic            |  Heir  |   2h   |   Low    | Participant icon changes per persona — deferred in favor of static rocket icon for simplicity                    |
| Foundry Voice Alex (Realtime)  |  Heir  |   1w   |  Medium  | Speech-to-speech via Realtime API WebSocket                                                                      |
| Hosted Agent Container Deploy  |  Heir  |   3d   |  Medium  | Containerized Alex on managed infrastructure                                                                     |
| Foundry → M365 Backend Unify   |  Heir  |   1w   |  Medium  | M365 heir routes through Foundry Agent Service                                                                   |
| Local Model Usage Learning     | Master |   2h   |   Low    | Learn from your usage patterns to improve advice                                                                 |
| Learning Journeys              |  Heir  |   3h   |  Medium  | Curated skill progressions                                                                                       |
| Skill Recommendations          |  Heir  |   3h   |  Medium  | Suggest skills based on file types                                                                               |
| Context-Aware Skill Loading    |  Heir  |   2h   |  Medium  | Auto-load skills based on workspace                                                                              |
| Office Add-in (Word/Excel/PPT) |  Heir  |   2w   |  Medium  | Alex sidebar in Office apps                                                                                      |

### Research Findings (from alex_docs/ audit — 2026-02-14)

| Finding                           | Source Document                             | Priority | Description                                                                 |
| --------------------------------- | ------------------------------------------- | :------: | --------------------------------------------------------------------------- |
| VS Code 1.109 P0 features         | VSCODE-1.109-ADOPTION-PLAN.md               |    P0    | Agent Hooks + Copilot Memory — already planned for v5.9.0                   |
| Architecture assessment gaps      | ARCHITECTURE-ASSESSMENT-2026-02-06.md       |    P1    | 146 sync points — Tier 2a/2b confirmed done (JSON schema + pre-commit hook) |
| GK pattern format inconsistency   | GK-PATTERN-FORMAT-STANDARD.md               |    P1    | Standardize all GK files to YAML v2 frontmatter                             |
| @alex enhancement plan            | ALEX-PARTICIPANT-ENHANCEMENT-PLAN.md        |    P1    | Multi-layer prompt engine — already planned for v5.8.x                      |
| fs-extra → vscode.workspace.fs    | ADR-008-workspace-file-api.md               |    P1    | 10 files need migration, priority order defined                             |
| VS Code source integration        | VSCODE-SOURCE-INTEGRATION-ANALYSIS.md       |    P1    | 10 integration opportunities, all not started                               |
| Copilot API enhancement checklist | VSCODE-COPILOT-API-ANALYSIS.md              |    P1    | Multiple items in progress, others not started                              |
| Marp template automation          | MARP-AUTOMATION-PLAN.md                     |    P1    | Template-driven deck generation, zero new deps, ready to implement          |
| PptxGenJS generator               | PPTXGENJS-IMPLEMENTATION-PLAN.md            |    P1    | Validated with 2 generated PPTX files, pure Node.js                         |
| Semantic Skill Graph              | SEMANTIC-SKILL-GRAPH.md                     |    P2    | Embedding-based skill discovery using Azure OpenAI — 4-phase proposal       |
| Cognitive Dashboard               | COGNITIVE-DASHBOARD-DESIGN.md               |    P2    | Unified webview for brain health, skill network, memory visualization       |
| Image generation (DALL-E)         | ADR-007-image-generation.md                 |    P2    | Azure OpenAI DALL-E integration — accepted, not implemented                 |
| Propose-to-Global workflow        | ADR-009-global-knowledge-sync-direction.md  |    P2    | Lighter path for heir contributions to Global Knowledge                     |
| Academic paper finalization       | AI-ASSISTED-DEVELOPMENT-METHODOLOGY.md      |    P2    | 1706-line paper, 62-project case study — needs peer review prep             |
| ~~Missing Alex-Finch.md~~         | alex/README.md                              |  ~~P2~~  | ✅ Created in v5.7.1 — `alex_docs/alex/Alex-Finch.md`                        |
| ~~Redundant files cleanup~~       | COMPETITIVE-ANALYSIS-BACKUP, SKILL-WISHLIST |  ~~P3~~  | ✅ Archived in v5.7.1 — 3 files moved to `archive/`                          |

### Replicate Platform Evaluation (2026-02-14)

| Finding                            | Source Document         | Priority | Description                                                                         |
| ---------------------------------- | ----------------------- | :------: | ----------------------------------------------------------------------------------- |
| ~~Replicate MCP gallery entry~~    | REPLICATE-EVALUATION.md |  ~~P1~~  | ✅ Configured in v5.7.1 — `.vscode/mcp.json` with replicate-mcp                      |
| Replicate image generation service | REPLICATE-EVALUATION.md |    P1    | `replicateService.ts` wrapping Node.js client for `/generate` — ADR-007 alternative |
| Image upscaling via Replicate      | REPLICATE-EVALUATION.md |    P2    | Super-resolution for avatar images and presentation assets                          |
| FLUX fine-tune for Alex brand      | REPLICATE-EVALUATION.md |    P2    | Custom LoRA trained on Alex's visual identity for consistent brand imagery          |
| Presentation visuals pipeline      | REPLICATE-EVALUATION.md |    P2    | Auto-generate slide illustrations via Marp/PptxGenJS + Replicate                    |
| Video generation capabilities      | REPLICATE-EVALUATION.md |    P3    | Animated tutorials and visual explanations via Wan 2.1                              |

### Platform Expansion (only if compelling trigger met)

These items graduated to backlog from v6.x. They re-enter the roadmap only when a clear user/team need justifies the investment.

| Task                              | Owner  | Effort | Compelling Trigger                                     |
| --------------------------------- | :----: | :----: | ------------------------------------------------------ |
| CLI heir (terminal Alex)          |  Heir  |   1w   | User requests Alex outside VS Code for scripts/CI      |
| Browser extension heir            |  Heir  |   2w   | User wants Alex context while reading docs/GitHub      |
| Mobile companion (PWA)            |  Heir  |   2w   | User wants to review insights on-the-go                |
| Claude Code heir                  |  Heir  |   1w   | Claude Code gains meaningful market share              |
| Cursor heir                       |  Heir  |   3d   | Cursor adds sufficient extension API parity            |
| Windsurf heir                     |  Heir  |   3d   | Windsurf gains meaningful adoption                     |
| Unified memory sync               | Master |   1w   | 2+ heirs actively deployed — memory divergence is real |
| Subagent support for specialists  |  Heir  |   3d   | SubAgent API stabilizes AND specialist agents exist    |
| Plan Agent integration            |  Heir  |   2d   | planStep API stabilizes AND workflow engine built      |
| Enterprise Connectors             |  Heir  | weeks  | Enterprise customer requests specific connector        |
| Foundry specialist agents (×5)    |  Heir  |  10h   | Foundry POC proves quality AND Teams demand exists     |
| Foundry multi-agent orchestration |  Heir  |   4h   | 2+ specialist agents deployed AND routing value proven |
| Foundry observability             |  Heir  |   2h   | Foundry agents in production with real traffic         |

---

## 🎯 Priority Matrix — What Ships When

### v5.7.1 (✅ SHIPPED — Visual Identity + UI/UX)

```
Graph removal + Definition of Done + Replicate MCP POC + Alex-Finch.md + Synapse validation confirmed
+ Redundant files archived + Welcome panel avatar + Persona→avatar mapping + UI regression sweep
= Dead code gone, shipping criteria defined, multimedia AI ready, identity documented, Alex has a face, UI is stable
```

**Effort**: ~18h | **Impact**: Visible polish — users see a stable, clean, personal Alex with multimedia AI access
**Shipped**: 2026-02-15

### v5.8.0 (@alex P0 — Identity + Memory)

```
promptEngine.ts + Brain injection + Active Context + Conversation history
= @alex knows who it is + remembers the thread
```

**Effort**: ~9h | **Impact**: Foundational — everything else builds on this

### v5.8.1 (@alex P1 — Tools + Files)

```
Tool calling + File context + Model-adaptive behavior
= @alex can DO things + see files + adapt to model tier
```

**Effort**: ~12h | **Impact**: @alex becomes genuinely useful for daily work

### v5.8.2 (@alex P2 — Personality)

```
Pre-seeded knowledge + Persona prompt + Confidence signaling
= @alex is intelligent, personal, and honest about uncertainty
```

**Effort**: ~9h | **Impact**: Differentiation — no other extension does this

### v5.9.0 (VS Code API Adoption)

```
Agent hooks + Copilot Memory API + Claude compatibility
= @alex gets smarter with zero new infrastructure
```

**Effort**: ~1 week | **Impact**: Free leverage — ride the platform wave

### v5.9.1 (Foundry POC — only if Teams demand exists)

```
Foundry project + Alex orchestrator + Teams publish + baseline eval
= Alex in Teams — prove or kill the hypothesis fast
```

**Effort**: ~1 week | **Impact**: Strategic — but only if someone actually wants it

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
| Version Range | Theme                          | Completion      |
| ------------- | ------------------------------ | --------------- |
| v3.6.0-v3.9.0 | Dawn → Awareness               | Jan 2026        |
| v4.0.x        | Trust (CAIR/CSR)               | Jan 2026        |
| v4.1.0-v4.3.0 | Skills & Architecture          | Feb 2026        |
| v5.0.x-v5.2.0 | Team Scaling & UX              | Feb 2026        |
| v5.3.0        | Enterprise Readiness           | Feb 8, 2026     |
| v5.3.1        | CSP Security Fix               | Feb 8, 2026     |
| v5.4.0-v5.4.3 | Text-to-Speech & Voice         | Feb 9, 2026     |
| v5.5.0        | Model Intelligence             | Feb 10, 2026    |
| v5.6.0-5.6.9  | Enterprise Systems             | Feb 10-14, 2026 |
| v5.7.0        | Structural Consistency         | Feb 14, 2026    |
| v5.7.1        | Visual Identity + UI/UX Polish | Feb 15, 2026    |

---

|                            |                                  |
| -------------------------- | -------------------------------- |
| **Current Master Version** | 5.7.1                            |
| **Current Heirs**          | VS Code (5.7.1), M365 (5.7.1)    |
| **Next Target**            | 5.8.0 — @alex Enhanced Mode (P0) |
| **Updated**                | 2026-02-15                       |
| **Archived From**          | ROADMAP-UNIFIED.md (v3.5-5.3)    |

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
- ~~`microsoftGraph.ts` — Full Graph API client~~ **REMOVED** — non-functional, moved to backlog
- ~~`/calendar`, `/mail`, `/context`, `/people` slash commands~~ **REMOVED**
- ~~7 enterprise Graph settings~~ **REMOVED**
- ~~Welcome View Graph buttons~~ **REMOVED**
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
- ~~Muscles README had stale line counts for 11/12 scripts~~ → Updated
- ~~package-lock.json stuck at 5.6.7~~ → Regenerated to 5.7.0
- ~~Roadmap said "100+ Skills"~~ → Corrected to 116
- ~~Roadmap said "227 entries (26 patterns + 171 insights)"~~ → Corrected to 257 (28 + 229)
- ~~brain-qa said 31 phases~~ → Corrected to 32
- ~~Quality gate said 7 transformations~~ → Corrected to 9
- ~~Quality gate said 27+ slash commands~~ → Corrected to 24 (4 Graph commands removed)
- ~~Quality gate said 7+ tools~~ → Corrected to 8

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
| Heir skill count matches        | Compare `.github/skills/` master vs heir        | 114 of 116 skills present (2 master-only)  |
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

*From purpose-built cognition → autonomous workflows → collaborative intelligence — the evolution from personal assistant to organizational mind.*
