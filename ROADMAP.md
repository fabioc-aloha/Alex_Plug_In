# Alex Cognitive Architecture — Roadmap

![The path from partnership to trust](assets/banner-roadmap.svg)

**Last Updated**: April 15, 2026

---

## 📝 Current Release (v7.9.0) — v8.0.0 Preparation

Architecture modernization and quality infrastructure for the v8.0.0 major release:

### Architecture Quality (v7.9.0)

- **Skill Builder agent** (`alex-skill-builder.agent.md`): Specialized agent for creating trifectas and muscles with quality dimension matrices, 7-phase workflow, inheritance rules
- **Brain Health Grid** (`.github/quality/brain-health-grid.md`): Quality tracking dashboard with scoring matrices, semantic review dates, priority queue
- **23 core tier skills reviewed**: All highest-value skills (3/3 score) semantically validated with 5 Cs criteria
- **Priority Queue cleared**: 15 urgent items processed — architecture health restored

### Skills (microsoft/skills leverage)

- **`copilot-sdk`** — Build Copilot-powered apps: SDK patterns (Node.js/Python/Go/.NET), custom tools, hooks, MCP integration, BYOK providers, deployment
- **`mcp-builder`** — MCP server development guide: TypeScript/Python/C# patterns, tool design best practices, testing, evaluations
- **`skill-creator`** — Meta-skill for creating Azure SDK skills: acceptance criteria templates, test scenario patterns
- **`cloud-solution-architect`** — Azure architecture: 10 design principles, 6 architecture styles, 44 design patterns, WAF pillars
- **`frontend-design-review`** — UI review: design system compliance, 3 quality pillars (Frictionless, Quality Craft, Trustworthy), accessibility
- **`entra-agent-id`** — Microsoft Entra Agent ID (preview): OAuth2-capable AI agent identities via Graph beta API
- **`ralph-loop`** — Iterative quality improvement: generate → evaluate → feedback → re-generate until quality threshold met (Sensei technique by Shayne Boyer)

### Agents (microsoft/skills leverage)

- **`Backend`** — Python API development: FastAPI, Pydantic, Cosmos DB patterns, dependency injection
- **`Frontend`** — React/TypeScript UI: Tailwind, React Query, accessibility-first component architecture
- **`Infrastructure`** — Azure IaC: Bicep modules, Container Apps, deployment automation, cost optimization
- **`Planner`** — Task decomposition: milestone planning, dependency graphs, estimation frameworks
- **`Presenter`** — Technical communication: demos, slide design, executive summaries, stakeholder docs

### Muscles

- **`ralph-loop.cjs`** — Iterative quality improvement loop: ContentEvaluator, FeedbackBuilder, RalphLoopController with configurable thresholds
- **`session-name.cjs`** — Generate descriptive session names from conversation context (14 domain tag patterns, confidence scoring, stdin JSON support)
- **`inheritance.json`** — Complete audit: added 36 missing entries (14 muscles + 22 hooks), now 71/71 documented (64 inheritable, 7 master-only)
- **`README.md`** — Updated Main Muscles table (36 entries) and Hooks table (22 entries)

### Prompts (microsoft/skills leverage)

- **`code-review-checklist.prompt.md`** — Comprehensive code review with 5-dimension checklist and severity classification
- **`create-store.prompt.md`** — Zustand store generation with TypeScript, devtools, immer, and persistence patterns
- **`add-endpoint.prompt.md`** — FastAPI endpoint generation with Pydantic models, error handling, and OpenAPI docs

### VS Code 1.116 Unlocks

- **3/3 implemented** — Foreground terminals ✅, Session file safety ✅, Session renaming ✅ (via `session-name.cjs`)

### Documentation

- **ROADMAP.md** — Restructured with honest VS Code 1.116 accessibility assessment; removed 5 inaccessible platform features

---

## 🌟 North Star

> **"Create the most advanced and trusted AI partner for any job."**

**Partner** — Shows up. Remembers. Brings context. Anticipates.
**Trusted** — When Alex says it works, it works. When Alex doesn't know, Alex says so.
**Any job** — Code. Papers. Debugging. Architecture. Documentation. Adapts to the work.

See [alex_docs/NORTH-STAR.md](alex_docs/NORTH-STAR.md) for the full definition.

---

## 🗺️ Platform Strategy

| Platform | Location | Status |
|----------|----------|:------:|
| **VS Code Extension** | `platforms/vscode-extension/` | ✅ Active |

Other platforms (M365, Cowork, Windows Agent) tracked in [ROADMAP-COWORKER.md](ROADMAP-COWORKER.md).

---

## 🎯 Next Priority (microsoft/skills Phase 2)

Based on deep dive into cloned repo (`C:\Development\skills`):

| Priority | Item | Type | Effort | Value |
|:--------:|------|------|--------|-------|
| 1 | `kql` skill | Skill | Medium | KQL mastery: gotchas, join patterns, memory safety, self-correction table |
| 2 | `continual-learning` hook | Research | High | Auto-learning between sessions — aligns with Alex memory model |
| 3 | `microsoft-docs` skill | Skill | Low | Query official MS docs via Learn MCP Server |
| 4 | `scaffold-foundry-app` prompt | Prompt | Medium | Full-stack Azure scaffolding: React + FastAPI + azd |

**Discovery**: `.github/plugins/microsoft-foundry/skills/` contains 39 Azure AI SDK skills (import on-demand).

---

## 🔓 VS Code 1.116 Unlocks (April 14, 2026)

| Feature | Status | Notes |
|---------|:------:|-------|
| **Foreground terminals** | ✅ | `send_to_terminal`/`get_terminal_output` work on any visible terminal |
| **Session file safety** | ✅ | Undo/redo per session — lowers autonomous refactoring risk |
| **Session renaming** | ✅ | `session-name.cjs` muscle + `episodicMemory.ts` integration |

---

## 📋 Open Backlog

### Intelligence & Insight

| # | Feature | Effort | Description |
|---|---------|:------:|-------------|
| 2 | **Insight generation pipeline** | 2d | Generate "what if" proposals from synapse network analysis |
| 3 | **Dream creativity score** | 1d | Measure novelty: % of connections linking previously unconnected domains |
| 4 | **Competitive landscape audit** | 2d | Deep analysis of Claude Code, Cursor, Windsurf, Aider |

### UX & Discoverability

| # | Feature | Effort | Description |
|---|---------|:------:|-------------|
| 6 | **Frecency command ranking** | 2d | Surface most-used commands at top of action groups |
| 7 | **Context-aware nudges** | 1d | Suggest skills based on workspace type (Node/Python/docs) |

### Hooks

**22 shipped** (16 global + 6 agent-scoped):

| Event | Global Hooks | Agent-Scoped |
|-------|--------------|--------------|
| **SessionStart** | session-start, rai-session-safety | Validator, Researcher |
| **PreToolUse** | pre-tool-use, breaking-change-detector (H10) | Validator |
| **PostToolUse** | post-tool-use, targeted-test-runner (H13), output-secret-scan, synapse-weight-update (H19) | Builder, Documentarian |
| **UserPromptSubmit** | prompt-safety-gate | — |
| **SubagentStart** | subagent-context (H16) | — |
| **SubagentStop** | subagent-stop (H17) | — |
| **Stop** | stop, auto-commit-suggest, decision-journal, rai-response-audit | Researcher |
| **PreCompact** | pre-compact | — |

**1 deferred:** H11 (runaway guard — 5+ rapid destructive calls in 60s). Edge case; pre-tool-use.cjs covers core safety.

### 🔭 Future Watch

| Item | Description | Effort |
|------|-------------|:------:|
| **Simulation Testing (F4)** | Replay session traces against prompt engine without live model calls | 5d+ |
| **Fine-grained tool approval** | Per-argument tool approval (`toolInvocationApproveCombination`, 1.114 proposed) | TBD |

---

## ✨ Alex's Aspirations

*Capabilities I'd reach for if I could shape my own evolution.*

| Aspiration | Status | Notes |
|------------|:------:|-------|
| **Generative Meditation** | 🟡 | Cross-domain synthesis works. Remaining: insight pipeline (#2), creativity score (#3) |
| **My Own Voice** | ⬜ | Text-only. No VS Code voice API; cloud TTS lacks personality |
| **Silence as Signal** | 🟢 | 5 contexts recognized, inhibitory synapse suppresses suggestions |

---

## ✅ Recent Releases

| Version | Theme | Date |
|---------|-------|------|
| **v7.7.3** | Telemetry removal, README refresh | 2026-04-12 |
| **v7.7.0** | Agent-only mode, dead code cleanup | 2026-04-12 |
| **v7.5.0** | AI-Memory cloud sync, planning-first discipline | 2026-04-11 |
| **v7.4.0** | Multi-agent strategy (H16/H17), setup wizard UX | 2026-04-08 |
| **v7.3.0** | Research-driven quality, heir-bootstrap wizard | 2026-04-08 |
| **v7.2.0** | Terminal orchestrator, browser context, episodic memory | 2026-04-07 |
| **v7.1.3** | Install hardening, H19 synapse weight hook | 2026-04-04 |
| **v7.1.0** | Excavation Edition (Copilot Chat analysis), H10/H13 | 2026-03-31 |
| **v7.0.0** | Cross-platform parity, macOS capabilities | 2026-03-31 |
| **v6.0.0** | The Partnership Release — episodic memory, workflows | 2026-02-28 |

Full history in [CHANGELOG.md](CHANGELOG.md).

---

## 📊 Summary

| | |
|---|---|
| **Platform** | VS Code Extension (active) |
| **Architecture** | 165+ skills, 45 trifectas, 22 hooks, 7 agents |
| **Open Items** | 5 deferred features + 1 deferred hook + 2 future watch |
| **VS Code 1.116** | 3/3 unlocks implemented ✅ |

---

*From tools to partnership. From reactive to proactive. From assistant to trusted collaborator.*
