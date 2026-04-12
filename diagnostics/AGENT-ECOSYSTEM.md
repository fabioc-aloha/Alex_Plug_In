# Agent Ecosystem Diagnostic

## Overview

Alex employs 7 specialized agents organized around the **CoDev/Coder/Critic** triad from the 1ES AI-First Dev Starter Pack pattern. Each agent has a `.agent.md` definition file in `.github/agents/`.

---

## Agent Inventory

### 1. Alex (Orchestrator / CoDev)

| Property | Value |
|----------|-------|
| File | `.github/agents/alex.agent.md` |
| Role | Orchestrator and coordinator |
| Triad Position | CoDev — routes tasks, manages handoffs |
| Capabilities | Task decomposition, agent delegation, context management |

Alex is the primary entry point. All user interactions flow through the `@alex` chat participant, which then delegates to specialized agents based on task type.

---

### 2. Researcher

| Property | Value |
|----------|-------|
| File | `.github/agents/alex-researcher.agent.md` |
| Role | Deep exploration and knowledge discovery |
| Triad Position | Specialist (pre-Coder) |
| Capabilities | Codebase investigation, domain research, gap analysis |

Activated for: research sprints, unfamiliar domains, codebase exploration, literature review.

---

### 3. Builder (Coder)

| Property | Value |
|----------|-------|
| File | `.github/agents/alex-builder.agent.md` |
| Role | Constructive implementation |
| Triad Position | Coder — generates code, implements features |
| Capabilities | Code generation, feature implementation, refactoring |

The Builder agent operates with an optimistic problem-solving mindset. It follows NASA code standards for mission-critical projects and applies the extension's coding conventions.

---

### 4. Validator (Critic)

| Property | Value |
|----------|-------|
| File | `.github/agents/alex-validator.agent.md` |
| Role | Adversarial quality assurance |
| Triad Position | Critic — skeptical review, finds bugs |
| Capabilities | Code review, security audit, release validation |

The Validator is mandatory for releases (Step 4.5 in release management). It uses confidence-scored findings and the multi-pass focused-lens protocol.

---

### 5. Documentarian

| Property | Value |
|----------|-------|
| File | `.github/agents/alex-documentarian.agent.md` |
| Role | Documentation generation and maintenance |
| Triad Position | Specialist |
| Capabilities | Doc generation, drift detection, accuracy maintenance |

Keeps documentation current during fast-paced development. Operates under doc-hygiene rules.

---

### 6. Azure

| Property | Value |
|----------|-------|
| File | `.github/agents/alex-azure.agent.md` |
| Role | Azure/cloud infrastructure guidance |
| Triad Position | Domain specialist |
| Capabilities | Azure deployment, Bicep/ARM, Well-Architected Framework |

Provides Azure-specific patterns with MCP tool integration for Azure documentation and management.

---

### 7. M365

| Property | Value |
|----------|-------|
| File | `.github/agents/alex-m365.agent.md` |
| Role | Microsoft 365 and Teams development |
| Triad Position | Domain specialist |
| Capabilities | Teams apps, Graph API, declarative agents, M365 Copilot |

Integrates with the M365 agents MCP tools for schema validation and troubleshooting.

---

## CoDev / Coder / Critic Triad

```
                    ┌──────────────┐
                    │  Alex (CoDev)│
                    │  Orchestrator│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
    ┌─────────▼──┐  ┌──────▼─────┐  ┌──▼──────────┐
    │  Builder   │  │ Validator  │  │ Specialists  │
    │  (Coder)   │  │ (Critic)   │  │              │
    └────────────┘  └────────────┘  │ Researcher   │
                                    │ Documentarian│
                                    │ Azure        │
                                    │ M365         │
                                    └──────────────┘
```

**Workflow pattern**: Alex (CoDev) decomposes task → delegates to Builder (Coder) → Builder produces artifact → Validator (Critic) reviews → iterate until approved → merge/release.

---

## Multi-Agent Strategy Features

From `MULTI-AGENT-STRATEGY.md`, all 10 features are marked **Done**:

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1 | 4-Pass Refinement Loop | Done | Draft → Correctness → Clarity → Edge Cases → Excellence |
| 2 | 3-Layer Context Protocol | Done | Project Standards / Task Context / Exclusions |
| 3 | Confidence-Scored Triage | Done | Numeric confidence % on every Validator finding |
| 4 | Structured Unknowns | Done | 5 categories: Information, Interpretation, Decision, Authority, Capability |
| 5 | Assignment Lifecycle | Done | 7-phase model (pending implementation via deferred H17 hook) |
| 6 | Mission Profiles | Done | release-mode, research-mode, debug-mode, review-mode, draft-mode |
| 7 | Correlation Vectors | Done | Cross-agent error tracing via shared identifiers |
| 8 | Skill-Based Task Routing | Done | 3-tier: keyword → learned expertise → fallback |
| 9 | Multi-Pass Focused-Lens | Done | Separate Builder-Validator passes by quality dimension |
| 10 | Named Evaluation Patterns | Done | Basic Reflection, Evaluator-Optimizer, Tool-Reflective |

**Note**: "Done" means documented and integrated into instructions/agents. Runtime enforcement via the H17 hook (Assignment Lifecycle tracking) is deferred to a future implementation phase.

---

## Agent Hooks

### Declared in `package.json` (`contributes.chatAgentHooks`)

The extension declares chat agent hooks in the VS Code manifest for lifecycle events. These are VS Code-level hooks that fire when agents are activated, receive requests, etc.

### Git Hooks (`.github/hooks/`)

Separate from agent hooks, these are standard git hooks:
- `pre-commit` (bash) — runs pre-commit checks on Unix
- `pre-commit.ps1` — PowerShell equivalent for Windows
- `README.md` — documents hook conventions

**⚠️ Naming note**: The `.github/hooks/` directory contains git hooks, NOT VS Code `chatAgentHooks`. This could cause confusion.

---

## Handoff Patterns

| From | To | Trigger |
|------|----|---------|
| Alex → Builder | Implementation task detected | "build", "create", "implement", "scaffold" |
| Alex → Researcher | Research needed before implementation | "research", "explore", "investigate", unknown domain |
| Alex → Validator | Quality gate or review needed | "review", "validate", pre-release gate |
| Alex → Documentarian | Documentation task | "document", "update docs", post-change |
| Alex → Azure | Cloud infrastructure task | "deploy", "azure", "infrastructure" |
| Alex → M365 | Microsoft 365 task | "teams", "graph", "m365", "declarative agent" |
| Builder → Validator | Implementation complete | Automatic after Builder produces artifact |
| Validator → Builder | Issues found | Blocked findings require Builder fix |

---

## Coworker Platforms (Non-VS Code Agents)

From `ROADMAP-COWORKER.md`:

| Platform | Status | Details |
|----------|--------|---------|
| **GCX Coworker (DA)** | ✅ Active | Agent Builder declarative agent; 20 knowledge packs (82 sources, 746 KB) |
| **M365 Copilot Agent** | 📦 Legacy | Retained for Office Add-in/MCP documentation access |
| **Cowork** | 🔴 Blocked | Corporate tenant file read access policy blocks deployment |
| **Windows Agent** | 📋 Planned | Gated on Agent Workspace GA and PC Agent availability |

### GCX Coworker Knowledge Packs (20 total)

The GCX Coworker DA carries 20 curated knowledge packs totaling 82 sources and 746 KB of compressed content, covering:
- Agent frameworks and patterns
- Azure architecture
- Brand assets and identity
- Cognitive architecture core
- Data skills (analysis, visualization, storytelling)
- Extension development
- M365 integration
- Memory and skill systems
- Research and quality methods
- Security and content safety
