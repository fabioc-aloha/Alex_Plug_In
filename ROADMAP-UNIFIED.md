# Alex Cognitive Architecture — Roadmap v5.7-v7.0

**Last Updated**: February 15, 2026

> **Phase: Cognitive Enhancement → Platform Expansion → Autonomous Intelligence**

---

## 🌟 Executive Summary

### Current State

v5.8.2 is current. Alex now has:
- **122 Skills** (119 inheritable to heirs) — Comprehensive domain coverage
- **Skill Intelligence** — Context-aware recommendations (30 tech mappings, 15 file types, 18 personas) with user preference tracking
- **Propose-to-Global Workflow** — One-click skill contribution for heirs (<5 min vs. 30 min manual process)
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
- **UI/UX Design Trifecta** — WCAG 2.1 AA patterns, accessibility audit workflows (11 complete trifectas)

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
| v5.8.3-9   | *reserved for fixes/enhancements*   |                              |                            |
| v5.9.0     | VS Code API Adoption                | Platform Leverage            | 📋 Planned                  |
| v5.9.1     | Foundry POC (if compelling)         | Platform Leverage            | 📋 Planned                  |
| v5.9.2     | Stabilization + Polish              | Production Maturity          | 📋 Planned                  |
| v5.9.3-9   | *reserved for community feedback*   |                              |                            |
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

| Task                                 |   Owner    | Effort  |          Priority           | Description                                                                                                                                                        |
| ------------------------------------ | :--------: | :-----: | :-------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Teams Deep Integration (v6.0)**    |  **M365**  | **12w** |        **📋 PLANNED**        | **Bot Framework + Message Extensions + Meeting Integration + Activity Feed — Complete implementation plan in `TEAMS-DEEP-INTEGRATION-PLAN.md` with 143-item deployment checklist** |
| **Spec Kit M365 Knowledge**          |  **M365**  | **6h**  | ✅ **COMPLETE (2026-02-18)** | **Phase-based knowledge files + retrieval directives deployed**                                                                                                    |
| **Spec Kit VS Code Instructions**    | **Master** | **8h**  |        **❌ WONTFIX**        | **Pattern doesn't transfer — VS Code auto-loading already optimal for topical organization**                                                                       |
| **Microsoft Graph Integration**      |  **M365**  | **10h** | ✅ **COMPLETE (2026-02-18)** | **Phase 2 workflows (Morning Briefing, Meeting Prep) implemented using built-in M365 capabilities. Phase 3 (custom API plugins) on hold pending platform support** |
| Foundry Voice Alex (Realtime)        |    Heir    |   1w    |           Medium            | Speech-to-speech via Realtime API WebSocket                                                                                                                        |
| Hosted Agent Container Deploy     |    Heir    |   3d    |           Medium            | Containerized Alex on managed infrastructure                                                                                                                       |
| Foundry → M365 Backend Unify      |    Heir    |   1w    |           Medium            | M365 heir routes through Foundry Agent Service                                                                                                                     |
| Local Model Usage Learning        |   Master   |   2h    |             Low             | Learn from your usage patterns to improve advice                                                                                                                   |
| Learning Journeys                 |    Heir    |   3h    |           Medium            | Curated skill progressions                                                                                                                                         |

### Spec Kit Knowledge Organization — M365 Copilot (Office Hours — 2026-02-18)

**Decision**: Reorganize M365 Copilot knowledge files using Spec Kit phase-based structure to optimize for 20-file limit

**Context**: M365 Copilot embedded files limited to 20 max (512 MB total). Current 6-file structure is topic-based (cognitive-architecture, skills, protocols, help, pptx, ux). Office Hours suggested Spec Kit's phase-based organization for better retrieval efficiency and workflow alignment.

**Target Structure** (6 files → phase-aligned):

| File                | Purpose                               | Sources                                 | Size  |
| ------------------- | ------------------------------------- | --------------------------------------- | ----- |
| constitution.md     | Identity, principles, worldview       | cognitive-architecture.md               | ~20KB |
| capabilities.md     | Skills organized by phase/context     | skill-quick-reference.md                | ~50KB |
| protocols.md        | Meditation, dream, self-actualization | alex-protocols.md                       | ~30KB |
| commands.md         | Help reference, slash commands        | help-commands.md                        | ~15KB |
| m365-integration.md | PowerPoint, Office add-ins, M365 UX   | pptx-generation.md + ux-features.md     | ~22KB |
| workflows.md (NEW)  | Multi-step processes (code→med→ship)  | Common patterns from protocols + skills | ~15KB |

**Benefits**:
- Phase-aware retrieval (Copilot pulls capabilities.md when planning, workflows.md when executing)
- Better semantic chunking alignment (Spec Kit's constitution → specify → plan → tasks → implement)
- Scalable to 20-file limit (room for 14 more phase-based files)
- Aligns with Agent Builder UI knowledge organization best practices

**Implementation Tasks**:

| Task                                  | Owner | Effort | Priority | Status | Description                                                      |
| ------------------------------------- | :---: | :----: | :------: | :----: | ---------------------------------------------------------------- |
| Merge pptx + ux → m365-integration.md | M365  |   1h   |   High   |   ✅    | Consolidate M365-specific features                               |
| Rename cognitive-architecture.md      | M365  |  15m   |   High   |   ✅    | → constitution.md (align with Spec Kit identity phase)           |
| Rename skill-quick-reference.md       | M365  |  15m   |   High   |   ✅    | → capabilities.md (align with Spec Kit capabilities phase)       |
| Create workflows.md                   | M365  |   2h   |   High   |   ✅    | Extract common multi-step patterns from protocols + experiences  |
| Update declarativeAgent.json          | M365  |  30m   |   High   |   ✅    | Adjust file references if needed                                 |
| Test knowledge grounding              | M365  |   1h   |   High   |   ✅    | Verify retrieval quality with new structure                      |
| Add retrieval directives              | M365  |  30m   |   High   |   ✅    | Add RETRIEVAL DIRECTIVE headers to force knowledge file priority |
| Deploy to M365 via Agent Builder UI   | M365  |  30m   |   High   |   ⏳    | Upload 6 reorganized files with retrieval directives             |

**Total Effort**: ~6 hours (actual: 5.5h)
**Priority**: HIGH (blocks M365 heir knowledge deployment)

**Reference**:
- Spec Kit: https://github.com/fabioc-aloha/spec-kit
- M365 Office Hours recommendation (2026-02-18)

---

### Spec Kit Instruction Organization — VS Code Extension (2026-02-18)

**Decision**: Apply phase-based organization to `.github/instructions/` to reduce cognitive load and improve auto-loading efficiency

**Context**: VS Code has 38 instruction files that auto-load via `applyTo` patterns. Some overlap, some are overly specific. Spec Kit's phase structure could consolidate related instructions into cohesive units while maintaining VS Code's file-based auto-loading.

**Current Pain Points**:
- Instructions scattered across 38 files — hard to maintain consistency
- Overlapping concerns (e.g., `alex-core`, `alex-identity-integration`, `worldview-integration` all touch identity)
- No clear workflow progression encoding
- File-specific `applyTo` patterns sometimes too granular

**Proposed Consolidation** (38 files → ~12-15 phase-based):

| Phase File                               | Consolidates From                                                           | applyTo Pattern                      |
| ---------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------ |
| `identity-constitution.instructions.md`  | alex-core, alex-identity-integration, worldview-*, character-driven         | `**/*` (always loaded)               |
| `capability-routing.instructions.md`     | skill-selection-optimization, skill-building, protocol-triggers             | `**/*` (always loaded)               |
| `cognitive-protocols.instructions.md`    | meditation, dream-state, self-actualization, lucid-dream, deep-thinking     | `**/*dream*,**/*meditation*`         |
| `quality-assurance.instructions.md`      | code-review, adversarial-oversight, semantic-audit, trifecta-audit          | `**/*.{ts,js,py}`, `**/*audit*`      |
| `architecture-decisions.instructions.md` | architecture-decision-records, technical-debt-tracking                      | `**/decisions/**`, `**/*ADR*`        |
| `research-workflow.instructions.md`      | research-first-workflow, bootstrap-learning, empirical-validation           | `**/*research*`                      |
| `release-publishing.instructions.md`     | release-management, vscode-marketplace-publishing, roadmap-maintenance      | `**/CHANGELOG*`, `**/package.json`   |
| `asset-generation.instructions.md`       | brand-asset-management, ai-generated-readme-banners, ai-character-reference | `**/*.svg`, `**/*.png`, `**/assets/` |
| `heir-management.instructions.md`        | heir-skill-promotion, heir-project-improvement, global-knowledge-curation   | `**/platforms/**`                    |
| `vscode-platform.instructions.md`        | vscode-configuration-validation, ui-ux-design, copilot-chat-buttons         | `**/.vscode/**`, `**/src/**`         |
| `synapse-network.instructions.md`        | embedded-synapse                                                            | `**/*synapse*`                       |
| `dependency-security.instructions.md`    | dependency-management                                                       | `**/package*.json`                   |

**Benefits**:
- Reduced file count (38 → ~12) — easier maintenance
- Phase-based grouping matches cognitive workflow (identity → routing → execution → quality → publication)
- Less `applyTo` overlap — clearer loading triggers
- Consolidates related concerns (all worldview/identity in one file)
- Room to add new phase-specific instructions without file explosion

**Implementation Tasks**:

| Task                                | Owner  | Effort | Priority | Status | Description                                     |
| ----------------------------------- | :----: | :----: | :------: | :----: | ----------------------------------------------- |
| Audit current instruction overlaps  | Master |   2h   |  Medium  |   ⏳    | Map which files share concerns                  |
| Create phase consolidation plan     | Master |   1h   |  Medium  |   ⏳    | Define final structure + applyTo patterns       |
| Merge identity-related instructions | Master |   1h   |  Medium  |   ⏳    | alex-core + identity + worldview → constitution |
| Merge cognitive protocols           | Master |   1h   |  Medium  |   ⏳    | meditation + dream + self-actualization         |
| Merge quality/review instructions   | Master |   1h   |  Medium  |   ⏳    | code-review + audit + adversarial               |
| Test VS Code auto-loading           | Master |   1h   |  Medium  |   ⏳    | Verify applyTo patterns still trigger correctly |
| Update copilot-instructions.md      | Master |  30m   |  Medium  |   ⏳    | Reference new instruction organization          |

**Total Effort**: ~8 hours
**Priority**: MEDIUM (quality-of-life improvement, not blocking)

**Reference**:
- Spec Kit: https://github.com/fabioc-aloha/spec-kit

---

### Office Add-in Implementation (from v5.7.6 research — 2026-02-15)

**Decision**: Integrate into M365 heir via unified manifest (ADR-011)

**Phase 1: Minimal Viable Add-in** ✅ **COMPLETE (v5.7.6)**:

| Task                    | Owner | Effort | Priority | Status | Description                                     |
| ----------------------- | :---: | :----: | :------: | :----: | ----------------------------------------------- |
| Update unified manifest | M365  |   2h   |  Medium  |   ✅    | Add `officeAddin` extension to manifest.json    |
| Build task pane HTML    | M365  |   4h   |  Medium  |   ✅    | Simple chat interface (matches M365 Copilot UX) |
| Integrate OneDrive read | M365  |   3h   |  Medium  |   ✅    | Read profile.md, notes.md from task pane        |
| Test in Word/Excel      | M365  |   2h   |  Medium  |   ⏳    | Sideload and validate basic functionality       |
| Document integration    | M365  |   1h   |  Medium  |   ✅    | Update M365 heir README with Office Add-in      |

**Deliverables**:
- `platforms/m365-copilot/appPackage/manifest.json` — Updated with `extensions` array
- `platforms/m365-copilot/taskpane/taskpane.html` — Task pane UI
- `platforms/m365-copilot/taskpane/taskpane.js` — Office.js integration
- `platforms/m365-copilot/OFFICE-ADDINS-README.md` — Complete documentation

**Phase 2: Office-Specific Features** (2-3 weeks):

| Task                         | Owner | Effort | Priority | Description                                   |
| ---------------------------- | :---: | :----: | :------: | --------------------------------------------- |
| Word: Template insertion     | M365  |   1w   |   Low    | Generate docs from templates with persona     |
| Excel: Learning goal tracker | M365  |   1w   |   Low    | Chart skill progress from profile.md          |
| PowerPoint: Slide generation | M365  |   1w   |   Low    | Create slides from Active Context focus areas |
| Outlook: Email drafting      | M365  |   1w   |   Low    | Compose emails with memory-augmented context  |

**Phase 3: Advanced Capabilities** (future):

| Task                     | Owner | Effort | Priority | Description                              |
| ------------------------ | :---: | :----: | :------: | ---------------------------------------- |
| Real-time collaboration  | M365  |   2w   |   Low    | Multi-user awareness in shared docs      |
| Custom Excel functions   | M365  |   1w   |   Low    | Alex UDFs for calculations               |
| Office script automation | M365  |   2w   |   Low    | Macro-style workflows with Office.js     |
| Clipboard integration    | M365  |   3d   |   Low    | Copy from M365 Copilot → paste in Office |

**Reference Documentation**:
- [OFFICE-ADDINS-RESEARCH.md](alex_docs/platforms/OFFICE-ADDINS-RESEARCH.md) — Full platform analysis
- [ADR-011](alex_docs/decisions/ADR-011-office-addins-m365-integration.md) — Architectural decision record

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
| ~~Missing Alex-Finch.md~~         | alex/README.md                              |  ~~P2~~  | ✅ Created in v5.7.1 — `alex_docs/alex/Alex-Finch.md`                                         |
| ~~Redundant files cleanup~~       | COMPETITIVE-ANALYSIS-BACKUP, SKILL-WISHLIST |  ~~P3~~  | ✅ Archived in v5.7.1 — 3 files moved to `archive/`                                           |
| ~~UI/UX Design trifecta~~         | v5.8.0 accessibility session meditation     |  ~~P1~~  | ✅ Created 2026-02-15 — Complete trifecta (skill + instruction + prompt + synapses), 11 total |

### Replicate Platform Evaluation (2026-02-14)

| Finding                         | Source Document         | Priority | Description                                                                |
| ------------------------------- | ----------------------- | :------: | -------------------------------------------------------------------------- |
| ~~Replicate MCP gallery entry~~ | REPLICATE-EVALUATION.md |  ~~P1~~  | ✅ Configured in v5.7.1 — `.vscode/mcp.json` with replicate-mcp             |
| Runtime image generation        | REPLICATE-EVALUATION.md |    P1    | `replicateService.ts` for runtime image gen — replaces DALL-E (ADR-007)    |
| Image upscaling via Replicate   | REPLICATE-EVALUATION.md |    P2    | Super-resolution for avatar images and presentation assets                 |
| FLUX fine-tune for Alex brand   | REPLICATE-EVALUATION.md |    P2    | Custom LoRA trained on Alex's visual identity for consistent brand imagery |
| Video generation capabilities   | REPLICATE-EVALUATION.md |    P3    | Animated tutorials and visual explanations via Wan 2.1                     |

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

---

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

---

|                            |                               |
| -------------------------- | ----------------------------- |
| **Current Master Version** | 5.8.2                         |
| **Current Heirs**          | VS Code (5.8.2), M365 (5.7.2) |
| **Next Target**            | 5.9.0 — VS Code API Adoption  |
| **Updated**                | 2026-02-15                    |
| **Archived From**          | ROADMAP-UNIFIED.md (v3.5-5.3) |

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

*From purpose-built cognition → autonomous workflows → collaborative intelligence — the evolution from personal assistant to organizational mind.*
