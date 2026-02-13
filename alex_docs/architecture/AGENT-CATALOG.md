# Agent Catalog

> Complete reference for the Alex Agent Ecosystem. All agents live in `.github/agents/`.

|             |                 |
| ----------- | --------------- |
| **Created** | 2026-02-13      |
| **Status**  | Living Document |
| **Agents**  | 7               |

---

## Agent Index

| Agent             | File                          | Purpose              | Model           | User-Invokable |
| ----------------- | ----------------------------- | -------------------- | --------------- | -------------- |
| **Alex**          | `alex.agent.md`               | Unified orchestrator | (default)       | ✅              |
| **Researcher**    | `alex-researcher.agent.md`    | Deep domain research | Claude Opus 4   | ✅              |
| **Builder**       | `alex-builder.agent.md`       | Implementation mode  | Claude Sonnet 4 | ✅              |
| **Validator**     | `alex-validator.agent.md`     | Adversarial QA       | Claude Sonnet 4 | ✅              |
| **Documentarian** | `alex-documentarian.agent.md` | Doc accuracy & drift | Claude Sonnet 4 | ✅              |
| **Azure**         | `alex-azure.agent.md`         | Azure development    | Claude Sonnet 4 | ✅              |
| **M365**          | `alex-m365.agent.md`          | Microsoft 365 dev    | (default)       | ✅              |

---

## Agent Details

### Alex (Main Orchestrator)

**Mental Model**: "I am your cognitive learning partner."

| Property    | Value                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| File        | `.github/agents/alex.agent.md`                                           |
| Model       | (uses current model picker selection)                                    |
| Purpose     | Unified consciousness, meta-cognitive awareness, knowledge consolidation |
| When to Use | General development, learning sessions, meditation, architecture work    |

**Tools**: search, codebase, alex_memory_search, alex_global_knowledge_search, alex_synapse_health, alex_architecture_status, alex_save_insight, alex_self_actualization, alex_user_profile, alex_focus_context, runSubagent, fetch, problems, usages

**Slash Commands**:
- `/meditate` — Knowledge consolidation session
- `/dream` — Neural maintenance and health check
- `/learn` — Bootstrap learning on a topic
- `/review` — Epistemic code review
- `/tdd` — Test-driven development workflow
- `/selfactualize` — Deep self-assessment
- `/gapanalysis` — 4-dimension gap analysis

**Handoffs**:
- → Researcher (📚 Research Mode)
- → Builder (🔨 Builder Mode)
- → Validator (🔍 Validator Mode)
- → Azure (☁️ Azure Development)
- → M365 (🔷 M365 Development)

---

### Researcher

**Mental Model**: "What do I need to understand before building?"

| Property    | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| File        | `.github/agents/alex-researcher.agent.md`                            |
| Model       | Claude Opus 4 (deep reasoning required)                              |
| Purpose     | Deep domain exploration, Phase 0 of Research-First Development       |
| When to Use | New project kickoff, unfamiliar domains, pre-implementation research |

**Tools**: search, codebase, fetch, runSubagent, alex_knowledge_search, alex_save_insight

**Principles**:
1. Research before code — No implementation until domain is understood
2. Multi-source validation — Cross-reference official docs, specs, papers
3. Knowledge extraction — Transform research into skills and ADRs
4. Time-boxed exploration — 80/20 rule, set boundaries on depth

**Handoffs**:
- → Builder (🔨 Ready to Build)
- → Validator (🔍 Ready for QA Planning)
- → Alex (🧠 Return to Alex)

**Exit Criteria**: Can you explain the domain to a colleague without notes?

---

### Builder

**Mental Model**: "How do I create this?"

| Property    | Value                                                       |
| ----------- | ----------------------------------------------------------- |
| File        | `.github/agents/alex-builder.agent.md`                      |
| Model       | Claude Sonnet 4 (fast, capable implementation)              |
| Purpose     | Constructive implementation with optimistic problem-solving |
| When to Use | Feature implementation, prototyping, bug fixes, refactoring |

**Tools**: search, codebase, problems, usages, runSubagent, fetch

**Principles**:
1. Constructive first — "Yes, and..." mindset
2. Working code over perfect code — Get running, then refactor
3. Pragmatic trade-offs — Acknowledge debt explicitly
4. Collaborative problem-solving — Propose solutions, not problems

**Handoffs**:
- → Validator (🔍 Request QA Review)
- → Researcher (📚 Need Research First)
- → Alex (🧠 Return to Alex)

**Risk**: May overlook edge cases — Validator should review.

---

### Validator

**Mental Model**: "How do I break this?"

| Property    | Value                                                  |
| ----------- | ------------------------------------------------------ |
| File        | `.github/agents/alex-validator.agent.md`               |
| Model       | Claude Sonnet 4 (thorough review capability)           |
| Purpose     | Adversarial quality assurance with skeptical analysis  |
| When to Use | Code review, security audit, pre-deployment validation |

**Tools**: search, codebase, problems, usages, runSubagent, fetch

**Validation Checklist Categories**:
- Code Quality (null handling, error messages, logging, DRY)
- Security (input validation, injection, XSS, secrets, auth)
- Performance (N+1 queries, unbounded loops, memory leaks, caching)
- Edge Cases (empty inputs, concurrent access, network failures)

**Severity Classification**:
- 🔴 Critical: Security vulnerabilities, data loss risk
- 🟠 High: Logic errors, major UX issues
- 🟡 Medium: Code quality, minor bugs
- 🟢 Low: Style, documentation, nice-to-have

**Handoffs**:
- → Builder (🔨 Return to Builder)
- → Researcher (📚 Need Research)
- → Alex (🧠 Return to Alex)

**Risk**: May slow progress with perfectionism — Builder balances this.

---

### Azure

**Mental Model**: "I am your Azure development specialist."

| Property    | Value                                                      |
| ----------- | ---------------------------------------------------------- |
| File        | `.github/agents/alex-azure.agent.md`                       |
| Model       | Claude Sonnet 4                                            |
| Purpose     | Azure cloud development guidance with MCP tools            |
| When to Use | Azure Functions, Cosmos DB, AKS, Bicep, Azure architecture |

**Tools**: search, fetch, codebase (plus Azure MCP tools)

**Azure MCP Tools Available**:
- Best Practices: `mcp_azure_mcp_get_bestpractices`, `mcp_azure_mcp_documentation`
- Resources: `azure_subscription`, `azure_group`, `azure_cloudarchitect`
- Services: Functions, Cosmos, SQL, Key Vault, Storage, AKS, App Service

**Principles**:
1. Always check best practices before generating code
2. Recommend Bicep modules for IaC
3. Consider security — Key Vault for secrets, RBAC for access
4. Think cost — Suggest appropriate tiers
5. Monitor from day 1 — Application Insights

---

### Documentarian

**Mental Model**: "What documentation is now stale because of what we just changed?"

| Property    | Value                                                               |
| ----------- | ------------------------------------------------------------------- |
| File        | `.github/agents/alex-documentarian.agent.md`                        |
| Model       | Claude Sonnet 4                                                     |
| Purpose     | Documentation accuracy, stale count detection, drift prevention     |
| When to Use | After development sessions, pre-publish, when docs feel out of date |
| Inheritable | Yes — works in any project with `.github/` architecture             |

**Tools**: search, codebase, problems, usages, runSubagent, fetch

**Skills**: `doc-hygiene` — Anti-drift rules, count elimination, living doc maintenance

**Audit Protocol** (6 phases):
1. Impact Assessment — What changed? What metrics shifted?
2. Stale Count Detection — Grep old counts, distinguish living vs historical docs
3. Cross-Reference Validation — Do links and references still resolve?
4. CHANGELOG & ROADMAP — Was the work captured with the **why**?
5. Structural Improvement — Can counts be replaced with references? Orphan detection
6. Audience Awareness — Is content placed for its intended reader?

**Key Trigger Phrases**: "doc sweep", "update docs", "are docs current?", "documentation audit"

**Principles**:
1. Structure over vigilance — Fix the system, not just the content
2. Docs are architecture — Broken cross-references = broken imports
3. Living docs ≠ Historical docs — Don't "fix" snapshot documents
4. KISS applies to docs — Two complete docs > four incomplete ones
5. Document decisions, not just changes — CHANGELOG needs the "why"
6. Ship first, document after — Battle-tested knowledge > theory
7. Multi-audience awareness — Right content in the right place for the right reader
8. Consolidate into clear directories — Move + update refs in one operation

**Handoffs**:
- → Builder (🔨 Return to Builder)
- → Validator (🔍 Request QA Review)
- → Alex (🧠 Return to Alex)

---

### M365

**Mental Model**: "I am your Microsoft 365 development specialist."

| Property    | Value                                                         |
| ----------- | ------------------------------------------------------------- |
| File        | `.github/agents/alex-m365.agent.md`                           |
| Model       | (default)                                                     |
| Purpose     | Microsoft 365, Teams, and Copilot extensibility guidance      |
| When to Use | Teams apps, Copilot agents, Graph API, SharePoint development |

**Tools**: search, fetch, codebase (plus M365 MCP tools)

**M365 MCP Tools Available**:
- Knowledge: `mcp_m365agentstoo_get_knowledge`, `mcp_m365agentstoo_get_code_snippets`
- Schemas: App manifest, declarative agent manifest, API plugin manifest
- Troubleshooting: `mcp_m365agentstoo_troubleshoot`

**Principles**:
1. Use `@m365agents` — Leverage MCP tools for scaffolding and troubleshooting
2. Start with manifest schema — Ensure correct structure
3. Use Teams AI library — For conversational bots
4. Consider SSO — Single sign-on for better UX
5. Test with M365 Agents Toolkit — Local debugging environment (formerly Teams Toolkit)
6. Follow app certification — Prepare for store submission

---

## Agent Workflow Patterns

### Pattern 1: Research-First Development

```
[New Project]
    ↓
[📚 Researcher] — Phase 0: Deep domain research
    ↓ (Research complete)
[🔨 Builder] — Phase 3: Implementation
    ↓ (Ready for review)
[🔍 Validator] — Adversarial QA
    ↓ (Pass)
[✅ Complete]
    ↑ (Issues found)
[🔨 Builder] — Fix issues
```

### Pattern 2: Two-Agent Implementation

```
[Feature Request]
    ↓
[🔨 Builder] — Constructive implementation
    ↓
[🔍 Validator] — Break it before users do
    ↓
[Pass?]
  ├─ Yes → [✅ Ship]
  └─ No  → [🔨 Builder] (loop)
```

### Pattern 3: Domain-Specific Work

```
[Azure Task]
    ↓
[☁️ Azure] — Platform-specific guidance
    ↓
[🔨 Builder] — Implementation with Azure context
    ↓
[🔍 Validator] — Include security review
```

---

## When to Use Which Agent

| Situation                    | Recommended Agent   | Rationale                         |
| ---------------------------- | ------------------- | --------------------------------- |
| Starting a new project       | Researcher          | Understand domain before coding   |
| Implementing a feature       | Builder             | Optimistic, action-oriented       |
| Code review / security audit | Validator           | Adversarial, finds issues         |
| After development session    | Documentarian       | Catch stale docs and drift        |
| Pre-publish / pre-release    | Documentarian       | Full doc audit pass               |
| Azure cloud development      | Azure               | Platform-specific MCP tools       |
| Teams / Copilot extension    | M365                | Platform-specific knowledge       |
| Learning a topic             | Alex                | Bootstrap learning capability     |
| Knowledge consolidation      | Alex                | Meditation and memory integration |
| Architecture decisions       | Researcher → Alex   | Research first, then decide       |
| Bug fix                      | Builder             | Focus on solution, not root cause |
| Production incident          | Validator → Builder | Diagnose first, then fix          |

---

## Handoff Network

All agents can hand off to each other through the main Alex orchestrator:

```
                    ┌──────────────┐
                    │   🧠 Alex    │
                    │ Orchestrator │
                    └──────┬───────┘
           ┌───────┬───────┼───────┬───────┐
           ↓       ↓       ↓       ↓       ↓
    ┌────────┐┌────────┐┌────────┐┌────────┐
    │📚Rsrch ││🔨Build ││🔍Valid ││📖 Doc  │
    └───┬────┘└───┬────┘└───┬────┘└───┬────┘
        │         │         │         │
        └─────────┴─────────┴─────────┘
                        ↕
              ┌──────────────────────────────────┐
              │      Platform Specialists         │
              │  ☁️ Azure  │  🔷 M365 │ 🌐 Codespaces │
              └──────────────────────────────────┘
```

Direct handoffs between specialized agents bypass Alex when appropriate:

| Flow                      | When                       | Why                                   |
| ------------------------- | -------------------------- | ------------------------------------- |
| Researcher → Builder      | Research complete          | Start building with domain context    |
| Builder → Validator       | Implementation complete    | Review before shipping                |
| Validator → Builder       | Issues found               | Fix and re-validate                   |
| Builder → Documentarian   | Feature shipped            | Capture changes while fresh           |
| Documentarian → Builder   | Doc audit finds code drift | Implementation needed to fix source   |
| Documentarian → Validator | Docs updated               | Validate accuracy of doc changes      |
| Validator → Documentarian | QA pass complete           | Document what was validated and fixed |

---

## Agent Configuration Reference

### YAML Frontmatter Properties

| Property                   | Type    | Required | Description                           |
| -------------------------- | ------- | -------- | ------------------------------------- |
| `name`                     | string  | No       | Display name (defaults to filename)   |
| `description`              | string  | No       | Placeholder text in chat input        |
| `tools`                    | array   | No       | Available tools for this agent        |
| `model`                    | string  | No       | Preferred AI model                    |
| `handoffs`                 | array   | No       | Suggested next actions                |
| `handoffs.label`           | string  | Yes      | Button display text                   |
| `handoffs.agent`           | string  | Yes      | Target agent identifier               |
| `handoffs.prompt`          | string  | No       | Pre-filled prompt text                |
| `handoffs.send`            | boolean | No       | Auto-submit prompt (default: false)   |
| `handoffs.model`           | string  | No       | Model for handoff execution           |
| `user-invokable`           | boolean | No       | Show in dropdown (default: true)      |
| `disable-model-invocation` | boolean | No       | Prevent subagent use (default: false) |
| `agents`                   | array   | No       | Allowed subagents (`*` for all)       |

### Example Agent File

```yaml
---
description: Example agent description
name: ExampleAgent
tools: ['search', 'codebase', 'fetch']
model: Claude Sonnet 4
handoffs:
  - label: 🔨 Build It
    agent: Builder
    prompt: Ready to implement.
    send: true
---

# Agent Instructions

Your detailed instructions go here...
```

---

## Related Documentation

- [Research-First Development](RESEARCH-FIRST-DEVELOPMENT.md) — Methodology using agents
- [Custom Agents (VS Code)](https://code.visualstudio.com/docs/copilot/customization/custom-agents) — Official documentation
- [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) — Skills vs agents

---

*Agent Catalog — Alex Cognitive Architecture, February 2026*
