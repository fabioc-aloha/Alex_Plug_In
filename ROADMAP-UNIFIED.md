# Alex Cognitive Architecture — Roadmap v5.6-v6.0

> **Phase: Platform Expansion & Enterprise Systems Integration**

---

## 🌟 Executive Summary

### Current State

v5.6.8 is stabilized (final). Alex now has:
- **100+ Skills** — Comprehensive domain coverage (most inheritable to heirs)
- **Microsoft Graph** — Calendar, Mail, Presence, People via enterprise mode
- **Enterprise Security** — Entra ID SSO, RBAC, secrets scanning, audit logging
- **Text-to-Speech** — Multi-language voice synthesis with 35 test cases
- **Voice Mode** — Continuous reading, speak prompt, auto-summarization
- **Keyboard Shortcuts** — Full accessibility support (Ctrl+Alt+R/V/P/D/A)
- **Model Intelligence** — Tier detection, task matching, `/model` advisor
- **Skill-Building Infrastructure** — Heirs can create and promote quality skills
- **Release Automation** — Automated master→heir sync with PII protection
- **Skill Pull-Sync** — Heirs can discover and inherit skills from Global Knowledge

### Vision Forward

| Phase  | Focus                                      | Timeline     |
| ------ | ------------------------------------------ | ------------ |
| v5.6.x | Enterprise Systems Integration             | ✅ Stabilized |
| v5.7.0 | Platform Expansion + Enterprise Connectors | Q2-Q3 2026   |
| v6.0.0 | Semantic Skill Graph                       | Q4 2026+     |

---

## Version Status

| Version    | Focus                     | Paradigm                   | Status                     |
| ---------- | ------------------------- | -------------------------- | -------------------------- |
| v5.3.0     | Enterprise Readiness      | Trust at Scale             | ✅ Complete                 |
| v5.3.1     | CSP Security Fix          | Secure UX                  | ✅ Complete                 |
| v5.4.0-3   | Text-to-Speech & Voice    | Accessible Cognition       | ✅ Complete                 |
| v5.5.0     | Model Intelligence        | Adaptive Cognition         | ✅ Complete                 |
| **v5.6.0** | **Enterprise Systems**    | **Deep Orchestration**     | ✅ Stabilized (5.6.8 final) |
| **v5.7.0** | **Platform + Enterprise** | **Cloud-Native Cognition** | 📋 Planned                  |
| v6.0.0     | Semantic Skill Graph      | Emergent Intelligence      | 📋 Planned                  |

---

## 🎯 Version Details

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
- **Global Knowledge**: 227 entries (26 patterns + 171 insights)

---

### v5.6.0 — Enterprise Systems Integration (STABILIZED)

**Theme**: Deep connectivity with Microsoft ecosystem for enterprise workflows.

**Paradigm**: Deep orchestration — Alex becomes the cognitive layer across the entire Microsoft stack.

**Status**: Stabilized at v5.6.8. Patches 5.6.1-5.6.8 focused on quality: PII protection, heir decontamination, self-containment, release automation, skill sync, and persona detection. Remaining enterprise connector tasks deferred to v5.7.0.

| Task                        | Owner | Effort | Priority | Status | Description                          |
| --------------------------- | :---: | :----: | :------: | :----: | ------------------------------------ |
| Microsoft Graph Integration | Heir  |   1w   | Critical |   ✅    | Calendar, Mail, Presence, People API |

**Completed 2026-02-10**:
- `microsoftGraph.ts` — Full Graph API client (Calendar, Mail, Presence, People)
- `/calendar`, `/mail`, `/context`, `/people` slash commands
- 7 new enterprise settings for Graph integration
- Welcome View integration: Enterprise section with Graph buttons
- `/status` command shows Graph connection status
- `/help` command lists Graph commands when enterprise mode enabled
- Documented in `alex_docs/guides/ENTERPRISE-SETTINGS.md`
- **Skill-Building Infrastructure**: `skill-building/SKILL.md` (376 lines) + Promotion Readiness Score
- **Heir Evolution Cycle**: 12 skills promoted from sandbox (79→92 total skills)
- **Synapse Health Fix**: Fixed file index limit causing false positives (500→targeted patterns)
- **Global Knowledge**: 227 entries (26 patterns + 171 insights)

**Reference Projects**:
- `FabricManager`, `FishBowl-Fabric` — Fabric integration patterns
- `cpesynapse` — Azure Synapse examples
- `VT_AIPOWERBI` — Power BI AI integration
- `AIRS Enterprise` — Enterprise AI systems

**Stabilized**: v5.6.8 — 2026-02-12 (final patch)

---

### v5.7.0 — Platform Expansion + Enterprise Connectors

**Theme**: Cloud-native agent deployment via Microsoft Foundry + VS Code 1.109 feature adoption + enterprise system connectors deferred from v5.6.

**Paradigm**: Cloud-native cognition — Alex evolves from IDE companion to multi-surface cloud service while leveraging VS Code's latest agent capabilities.

#### Track D: Enterprise Connectors (deferred from v5.6)

| Task                         | Owner  | Effort | Priority | Status | Description                              |
| ---------------------------- | :----: | :----: | :------: | :----: | ---------------------------------------- |
| Azure DevOps Connector       |  Heir  |   1w   |   High   |   📋    | Work items, pipelines, repos, boards     |
| Microsoft Fabric Integration |  Heir  |   1w   |   High   |   📋    | Lakehouse, notebooks, semantic models    |
| Teams Channel Awareness      |  Heir  |   3d   |   High   |   📋    | Post insights, respond in channels       |
| Azure OpenAI Service Backend | Master |   1w   |   High   |   📋    | Enterprise-grade LLM hosting option      |
| Planner/To-Do Sync           |  Heir  |   2d   |  Medium  |   📋    | Alex tasks ↔ Planner/To-Do bidirectional |
| Power BI Connector           |  Heir  |   3d   |  Medium  |   📋    | Query datasets, suggest visualizations   |
| SharePoint Knowledge Mining  |  Heir  |   1w   |  Medium  |   📋    | Extract insights from document libraries |
| Data Connectors (Azure SQL)  |  Heir  |   4h   |  Medium  |   📋    | Deferred from v5.3.0 → v5.6.0 → v5.7.0   |

#### Track A: Microsoft Foundry Integration

| Task                                  | Owner  | Effort | Priority | Status | Description                                  |
| ------------------------------------- | :----: | :----: | :------: | :----: | -------------------------------------------- |
| Create Foundry project + deploy model |  Heir  |   2h   | Critical |   📋    | Azure subscription + GPT-4.1-mini deployment |
| Build Alex Orchestrator agent         |  Heir  |   2h   | Critical |   📋    | Core personality + system prompt in Foundry  |
| Upload core skills to File Search     |  Heir  |   2h   |   High   |   📋    | Top 15 skills as vector store documents      |
| Add Bing Grounding + MCP tools        |  Heir  |   1h   |   High   |   📋    | Web search + existing MCP server reuse       |
| Test Memory + conversation mgmt       |  Heir  |   2h   |   High   |   📋    | Cross-session context retention validation   |
| Create specialist agents (×5)         |  Heir  |  10h   |   High   |   📋    | Researcher, Builder, Validator, Azure, M365  |
| Implement multi-agent orchestration   |  Heir  |   4h   |   High   |   📋    | Orchestrator routes to correct specialist    |
| Set up observability dashboard        |  Heir  |   2h   |  Medium  |   📋    | OpenTelemetry → Application Insights         |
| Run baseline evaluation               | Master |   2h   |  Medium  |   📋    | Quality metrics for agent responses          |
| Connect global knowledge via MCP      |  Heir  |   2h   |  Medium  |   📋    | Cross-project knowledge access               |
| Publish Alex to Teams                 |  Heir  |   2d   |  Medium  |   📋    | Alex chatbot accessible in Teams             |
| Build VS Code → Foundry API bridge    |  Heir  |   1w   |  Medium  |   📋    | LM Tools call Foundry agents for heavy tasks |

#### Track B: VS Code 1.109 Adoption

| Task                             | Owner | Effort | Priority | Status | Description                                           |
| -------------------------------- | :---: | :----: | :------: | :----: | ----------------------------------------------------- |
| Agent Hooks (lifecycle events)   | Heir  |   2d   |    P0    |   📋    | `onSend`/`onDidReceiveMessage` for context injection  |
| Copilot Memory API integration   | Heir  |   1d   |    P0    |   📋    | Persistent user preferences via `LanguageModelMemory` |
| Subagent support for specialists | Heir  |   3d   |    P1    |   📋    | Embed specialist agents with `SubAgent` API           |
| Plan Agent integration           | Heir  |   2d   |    P1    |   📋    | `planStep` for structured multi-step workflows        |
| Claude Opus/Sonnet compatibility | Heir  |   1d   |    P2    |   📋    | Test + fix for Claude model compatibility             |
| MCP Apps for tool packaging      | Heir  |   2d   |    P2    |   📋    | Package Alex tools as installable MCP Apps            |

#### Track C: Platform Documentation

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

**Target**: Q2-Q3 2026

---

### v6.0.0 — Semantic Skill Graph (Future)

**Theme**: Skills interconnect semantically, enabling emergent capability combinations.

**Vision**:
- Skills form a graph with weighted connections
- Task routing uses graph traversal, not keyword matching
- New skills auto-position in the graph based on semantic similarity
- Cross-skill reasoning produces capabilities greater than the sum of parts

**Research Required**:
- Semantic similarity embeddings for skills
- Graph-based task routing algorithms
- Emergent behavior measurement framework

**Target**: Q4 2026+

---

## 📋 Backlog (Unscheduled)

Items to pull from when capacity frees up:

| Task                            | Owner  | Effort | Priority | Description                                      |
| ------------------------------- | :----: | :----: | :------: | ------------------------------------------------ |
| Foundry Voice Alex (Realtime)   |  Heir  |   1w   |  Medium  | Speech-to-speech via Realtime API WebSocket      |
| Hosted Agent Container Deploy   |  Heir  |   3d   |  Medium  | Containerized Alex on managed infrastructure     |
| Foundry → M365 Backend Unify    |  Heir  |   1w   |  Medium  | M365 heir routes through Foundry Agent Service   |
| Declarative Agent Workflows     |  Heir  |   3d   |  Medium  | YAML-based multi-step agent workflows            |
| Enterprise Fleet Management     |  Heir  |   1w   |   Low    | Centralized multi-instance Alex via Operate      |
| Automated Dream via Evaluations | Master |   3d   |  Medium  | Scheduled evals replace manual dream command     |
| Claude Code Heir                |  Heir  |   1w   |  Medium  | Terminal + IDE deployment via hooks              |
| Cursor Heir                     |  Heir  |   3d   |   Low    | AI-native IDE port (VS Code foundation)          |
| Windsurf Heir                   |  Heir  |   3d   |   Low    | Auto-memory native deployment                    |
| Local Model Usage Learning      | Master |   2h   |   Low    | Learn from your usage patterns to improve advice |
| Learning Journeys               |  Heir  |   3h   |  Medium  | Curated skill progressions                       |
| Session Replay                  |  Heir  |   2h   |  Medium  | Save session transcripts + code changes          |
| Skill Recommendations           |  Heir  |   3h   |  Medium  | Suggest skills based on file types               |
| Context-Aware Skill Loading     |  Heir  |   2h   |  Medium  | Auto-load skills based on workspace              |
| Office Add-in (Word/Excel/PPT)  |  Heir  |   2w   |  Medium  | Alex sidebar in Office apps                      |

---

## 📚 Historical Reference

**Archived Roadmaps**: See `archive/roadmaps/` for completed versions:
- `ROADMAP-UNIFIED-V3.5-V5.3-COMPLETED.md` — Full history v3.5-v5.3.0

**Version History Summary**:
| Version Range | Theme                  | Completion      |
| ------------- | ---------------------- | --------------- |
| v3.6.0-v3.9.0 | Dawn → Awareness       | Jan 2026        |
| v4.0.x        | Trust (CAIR/CSR)       | Jan 2026        |
| v4.1.0-v4.3.0 | Skills & Architecture  | Feb 2026        |
| v5.0.x-v5.2.0 | Team Scaling & UX      | Feb 2026        |
| v5.3.0        | Enterprise Readiness   | Feb 8, 2026     |
| v5.3.1        | CSP Security Fix       | Feb 8, 2026     |
| v5.4.0-v5.4.3 | Text-to-Speech & Voice | Feb 9, 2026     |
| v5.5.0        | Model Intelligence     | Feb 10, 2026    |
| v5.6.0-5.6.8  | Enterprise Systems     | Feb 10-12, 2026 |

---

|                            |                                         |
| -------------------------- | --------------------------------------- |
| **Current Master Version** | 5.6.8 (stabilized, final)               |
| **Current Heirs**          | VS Code (5.6.8), M365 (5.6.8)           |
| **Next Target**            | 5.7.0 — Platform Expansion + Enterprise |
| **Updated**                | 2026-02-13                              |
| **Archived From**          | ROADMAP-UNIFIED.md (v3.5-5.3)           |

---

*From enterprise foundations to cloud-native agent deployment to semantic intelligence — the next evolution of cognitive partnership.*
