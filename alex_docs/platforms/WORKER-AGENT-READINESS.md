# Worker Agent & Cloud Readiness Assessment

> **Last Updated**: 2026-03-19
> **Status**: Tracked — both paths still gated on external dependencies
> **Related**: ROADMAP P2, Gated #14, Conditional #15/#16

---

## Executive Summary

Alex has two paths to multi-agent orchestration and cloud/Teams deployment. Both are blocked on external dependencies but Alex is well-positioned for rapid adoption when gates open.

| Path | Platform | Gate | Alex Readiness |
| --- | --- | --- | --- |
| VS Code Cloud Agents | VS Code + GitHub Copilot | `target: github-copilot` reaches GA | 🟢 High — handoffs, agents, subagents already configured |
| M365 Worker Agents | M365 Copilot Declarative Agent | `worker_agents` exits preview in DA schema | 🟡 Medium — v1.6 schema in use, skeleton ready |

---

## Path 1: VS Code Custom Agents → GitHub Copilot Cloud

### Current State (1.112)

VS Code 1.112 custom agents support:

| Feature | Status | Alex Uses |
| --- | --- | --- |
| `target: vscode` (local) | ✅ GA | ✅ Default for all 7 agents |
| `target: github-copilot` (cloud) | Preview | ❌ Not yet — would disable local |
| Handoffs (inter-agent delegation) | ✅ GA | ✅ All agents have handoff chains |
| Subagent support (`agents` field) | ✅ GA | ✅ Alex orchestrator delegates to 6 specialists |
| Organization-level sharing | ✅ GA | ❌ Not configured (single-developer) |
| Background agents (Copilot CLI) | Preview | ❌ Not targeted |
| Claude `.claude/agents` format | ✅ Supported | ✅ `.claude/CLAUDE.md` bridge exists |

### What Opens When `target: github-copilot` GAs

- Alex agents accessible from GitHub Copilot web/mobile (not just VS Code)
- Organization-level agent distribution (teams can use Alex's researcher, builder, etc.)
- Potential bridge to Teams via GitHub Copilot ↔ M365 Copilot integration

### Prep Completed

- [x] 7 `.agent.md` files with full frontmatter (model tiers, tools, handoffs, hooks)
- [x] Handoff chains configured (Alex ↔ Researcher ↔ Builder ↔ Validator ↔ Documentarian)
- [x] Agent-scoped hooks (Researcher session-start, Builder post-tool-use, Validator pre-tool-use)
- [x] `agents.md` includes all 7 agents
- [x] Subagent delegation via `agents` field in frontmatter

### When to Act

- When `target: github-copilot` exits Preview and can coexist with local (dual-target)
- OR when GitHub ships a way to publish local agents to cloud without disabling local

---

## Path 2: M365 Declarative Agent `worker_agents`

### Current State (Schema v1.6)

The M365 declarative agent schema v1.6 includes `worker_agents` as a preview property:

```json
{
  "worker_agents": [
    { "id": "P_<title-id-of-worker-agent>" }
  ]
}
```

**Alex as Manager**: Delegate to specialized worker agents (research, data analysis, compliance).
**Alex as Worker**: Enterprise Copilot delegates to Alex for cognitive partnership tasks.

### Schema Readiness

| v1.6 Feature | Alex Status |
| --- | --- |
| Core capabilities (8/12 types) | ✅ Using |
| `behavior_overrides` | ✅ Configured |
| `disclaimer` | ✅ Configured |
| `user_overrides` | ✅ Configured |
| `EmbeddedKnowledge` | ✅ Knowledge files pre-prepared; feature not yet GA |
| `include_related_content` on People | ✅ Enabled |
| `worker_agents` | ⏳ Preview — not added to manifest |
| `sensitivity_label` | N/A until EmbeddedKnowledge GAs |

### Skeleton Configuration (Ready to Uncomment)

When `worker_agents` exits preview, add to `declarativeAgent.json`:

```json
{
  "worker_agents": [
    {
      "id": "P_alex-research-agent",
      "description": "Deep research and web search synthesis"
    },
    {
      "id": "P_alex-data-agent",
      "description": "Dataverse and business data queries"
    }
  ]
}
```

Or for Alex-as-worker in enterprise:
```json
// In enterprise manager agent's manifest:
{
  "worker_agents": [
    { "id": "P_alex-cognitive-partner" }
  ]
}
```

### When to Act

- When Microsoft announces `worker_agents` GA in declarative agent schema
- Monitor: [Declarative Agent Manifest v1.6 docs](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.6)

---

## Convergence: VS Code ↔ M365

The two paths may converge:

```
VS Code Custom Agents ──target:github-copilot──▶ GitHub Copilot Cloud
                                                        │
                                                        ▼
M365 Declarative Agent ──worker_agents──▶ M365 Copilot ──▶ Teams
```

**Key signal to watch**: GitHub Copilot cloud agents becoming invocable from M365 Copilot. This would bridge the VS Code agent ecosystem into Teams without requiring a separate M365 declarative agent deployment.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| `worker_agents` API changes before GA | High | Low | Don't build on preview APIs |
| `target: github-copilot` disables local usage | Medium | High | Wait for dual-target or publish mechanism |
| VS Code + M365 paths diverge permanently | Low | Medium | Maintain both platforms independently |
| Organization agent sharing requires GitHub Enterprise | Medium | Low | Single-developer; revisit for team scenarios |

---

## Tracking Cadence

- Review at each VS Code stable release (monthly)
- Review M365 schema changes (check [schema changelog](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-manifest))
- Gate #14 in ROADMAP tracks `worker_agents` GA specifically
- Conditionals #15/#16 track Foundry POC and Teams Deep Integration
