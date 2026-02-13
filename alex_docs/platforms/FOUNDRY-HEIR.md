# Foundry Heir — Alex Cognitive Architecture

> Microsoft Foundry as a cloud-native agent deployment platform for Alex

|              |                                |
| ------------ | ------------------------------ |
| **Status**   | 📋 Research (February 2026)     |
| **Platform** | Microsoft Foundry (new)        |
| **Portal**   | <https://ai.azure.com>         |
| **SDKs**     | Python, C#, JS/TS (preview)    |
| **Location** | `platforms/foundry/` (planned) |
| **Priority** | Phase 0 — strategic evaluation |

---

## Executive Summary

Microsoft Foundry (formerly Azure AI Foundry) is a **unified Azure PaaS** for enterprise AI operations. Unlike VS Code (IDE-based) or M365 (productivity-based), Foundry is an **infrastructure platform** — it hosts, orchestrates, and manages AI agents at scale. This makes it a fundamentally different type of heir: not a surface where Alex runs inside another tool, but a **backend where Alex runs as a service**.

### Why Foundry Matters for Alex

| Dimension          | Current Heirs (VS Code, M365)       | Foundry Heir                              |
| ------------------ | ----------------------------------- | ----------------------------------------- |
| **Runtime**        | Runs inside host application        | Runs as a cloud service                   |
| **Availability**   | When IDE/app is open                | 24/7 always-on                            |
| **Multi-channel**  | Single platform per heir            | Publish to M365, Teams, Web, API, custom  |
| **Scalability**    | Single-user                         | Multi-user, enterprise                    |
| **Memory**         | File-based (synapses, OneDrive)     | Platform-managed persistent memory        |
| **Observability**  | Manual (dream command)              | Built-in OpenTelemetry + App Insights     |
| **Tools**          | MCP servers (manually configured)   | 1,400+ tool catalog + MCP + A2A protocol  |
| **Agent Patterns** | Sequential (agent handoffs)         | Multi-agent orchestration workflows       |
| **Knowledge**      | Skills files, global knowledge repo | Foundry IQ knowledge base + web grounding |

### Strategic Assessment

**Foundry is not a replacement for existing heirs — it's the missing backend.**

```
Current Architecture:
  User → VS Code → Alex Extension → LLM
  User → M365 → Declarative Agent → LLM

With Foundry:
  User → VS Code → Alex Extension → Foundry Agent Service → LLM
  User → M365 → Declarative Agent → Foundry Agent Service → LLM
  User → Teams → Foundry Agent → LLM
  User → Web App → Foundry API → LLM
  User → Custom App → REST API → LLM
```

---

## Platform Capabilities

### Core Foundry Features

| Capability                       | Description                                          | Alex Relevance      |
| -------------------------------- | ---------------------------------------------------- | ------------------- |
| **Agent Service**                | Managed agent hosting with conversation management   | Core runtime        |
| **Hosted Agents (Preview)**      | Containerized agents on managed infrastructure       | Alex as a service   |
| **Multi-Agent Orchestration**    | SDK-based collaborative agent workflows              | Agent ecosystem     |
| **Memory (Enhanced)**            | Cross-interaction context retention, user adaptation | Replaces synapses   |
| **Foundry IQ**                   | Knowledge base grounding with citations              | Skills + knowledge  |
| **Tool Catalog**                 | 1,400+ pre-built tools + private catalogs            | Extended tools      |
| **MCP Protocol Support**         | Remote MCP server integration with auth              | Existing MCP tools  |
| **A2A Protocol**                 | Agent-to-Agent communication with auth               | Agent collaboration |
| **Realtime API**                 | Voice + multimodal with WebSocket                    | Voice Alex          |
| **Observability**                | OpenTelemetry → Application Insights                 | Dream analytics     |
| **Evaluation Framework**         | Batch testing with built-in evaluators               | Quality assurance   |
| **Publishing Channels**          | M365 Copilot, Teams, BizChat, Web, API               | Multi-surface       |
| **AI Gateway**                   | Enterprise routing, rate limiting, failover          | Production-grade    |
| **Azure Policy Integration**     | Compliance, governance, guardrails                   | Enterprise Alex     |
| **Centralized Asset Management** | Manage agents/models/tools in one place ("Operate")  | Fleet management    |

### SDK Support

| Language          | Package                       | Status  |
| ----------------- | ----------------------------- | ------- |
| **Python**        | `azure-ai-projects>=2.0.0b3`  | Preview |
| **C#**            | `Azure.AI.Projects` (preview) | Preview |
| **JavaScript/TS** | `@azure/ai-projects`          | Preview |
| **Java**          | `com.azure:azure-ai-projects` | Preview |

### Agent Tools Available

| Tool                 | Description                          | Alex Use Case                  |
| -------------------- | ------------------------------------ | ------------------------------ |
| **Bing Grounding**   | Web search for real-time information | Bootstrap learning research    |
| **File Search**      | RAG over uploaded documents          | Knowledge base grounding       |
| **Code Interpreter** | Python execution sandbox             | Data analysis, code generation |
| **OpenAPI Tools**    | Connect to any REST API via spec     | External service integration   |
| **MCP Servers**      | Remote MCP tool integration          | Reuse existing MCP tools       |
| **SharePoint**       | Enterprise document knowledge        | Organizational context         |

### Hosted Agents (Preview)

Hosted Agents are the most interesting capability for Alex — containerized deployment on managed infrastructure:

| Feature                     | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| **Containerized Runtime**   | Docker-based, framework-agnostic deployment          |
| **Hosting Adapter**         | HTTP wrapper for LangGraph, MS Agent Framework, etc. |
| **Managed Infrastructure**  | Azure handles scaling, networking, certificates      |
| **Conversation Management** | Built-in stateful multi-turn interactions            |
| **Deployment**              | Via VS Code Foundry extension or `azd` CLI           |
| **Local Testing**           | Run locally before deploying                         |
| **Framework Support**       | LangGraph (Python), MS Agent Framework (C#), custom  |

---

## Architecture Vision: Alex on Foundry

### Deployment Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Microsoft Foundry Project                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Alex Orchestrator│  │  Alex Researcher │  │  Alex Builder    │  │
│  │  (Primary Agent) │  │  (Specialist)    │  │  (Specialist)    │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                      │             │
│           ├─────────────────────┼──────────────────────┤             │
│           ▼                     ▼                      ▼             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Foundry Agent Service                        │ │
│  │  • Memory (cross-session)     • Tool Catalog (1,400+)          │ │
│  │  • Foundry IQ Knowledge       • MCP Servers                    │ │
│  │  • Conversation Management    • A2A Protocol                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Publishing Channels                          │ │
│  │  • M365 Copilot  • Teams  • Web Preview  • REST API           │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Observability                                │ │
│  │  • OpenTelemetry traces     • Application Insights             │ │
│  │  • Agent dashboard          • Evaluation framework             │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### How Alex Maps to Foundry

| Alex Component         | Foundry Implementation                                 |
| ---------------------- | ------------------------------------------------------ |
| **Executive Function** | LLM model deployment (GPT-4.1, Claude, etc.)           |
| **Declarative Memory** | Agent system instructions                              |
| **Procedural Memory**  | Instructions embedded in agent + tool definitions      |
| **Episodic Memory**    | Foundry Memory (cross-session) + conversation history  |
| **Skills**             | Foundry IQ knowledge base + File Search tool           |
| **Synapses**           | Memory service (automatic cross-interaction context)   |
| **Agent Ecosystem**    | Multi-agent orchestration (Orchestrator → Specialists) |
| **Dream/Meditation**   | Scheduled evaluation runs + observability dashboard    |
| **Global Knowledge**   | Foundry IQ connected to knowledge base                 |
| **Extension Commands** | API endpoints + tool definitions                       |
| **LM Tools**           | Tool catalog entries + custom OpenAPI tools            |

### Key Architectural Decisions Needed

| Decision                    | Options                                        | Recommendation                              |
| --------------------------- | ---------------------------------------------- | ------------------------------------------- |
| **Agent Framework**         | MS Agent Framework, LangGraph, Custom          | MS Agent Framework                          |
| **Primary Language**        | Python, C#, TypeScript                         | TypeScript (match VS Code heir)             |
| **Memory Strategy**         | Foundry Memory only, Hybrid with synapses      | Foundry Memory + IQ                         |
| **Knowledge Source**        | Foundry IQ, File Search, or both               | Both                                        |
| **Hosted vs Agent Service** | Hosted Agent (container) or Agent Service only | Start with Agent Service, migrate to Hosted |
| **Publishing Target**       | M365, Teams, Web, API                          | API first, then Teams                       |

---

## Synergy with Existing Heirs

### Foundry as Shared Backend

The biggest opportunity is Foundry serving as a **shared backend** for multiple heirs:

```
┌─────────────────────────┐    ┌─────────────────────────┐
│     VS Code Heir        │    │      M365 Heir          │
│  Extension + LM Tools   │    │  Declarative Agent      │
└───────────┬─────────────┘    └───────────┬─────────────┘
            │                              │
            │   ┌──────────────────────┐   │
            └──►│  Foundry Agent API   │◄──┘
                │  (Shared Backend)    │
                │                      │
                │  • Same personality  │
                │  • Same knowledge    │
                │  • Same memory       │
                │  • Same tools        │
                └──────────────────────┘
                           │
                ┌──────────┴──────────┐
                │   New Surfaces      │
                │  • Teams Bot        │
                │  • Web Chat         │
                │  • REST API         │
                │  • Voice Agent      │
                └─────────────────────┘
```

### Integration Opportunities

| Integration                    | How                                              | Value                                  |
| ------------------------------ | ------------------------------------------------ | -------------------------------------- |
| **VS Code → Foundry API**      | LM Tools call Foundry API for complex operations | Server-side processing for heavy tasks |
| **M365 → Foundry backend**     | Declarative agent routes to Foundry agents       | Consistent behavior, shared knowledge  |
| **Foundry → Global Knowledge** | Foundry IQ indexes `~/.alex/global-knowledge/`   | Centralized knowledge for all surfaces |
| **Foundry Observability**      | OpenTelemetry traces = automated dream data      | Real meditation analytics              |
| **Foundry Evaluation**         | Batch testing validates Alex responses           | Automated quality assurance            |
| **Foundry Memory**             | Cross-session context without manual synapses    | Platform-managed synapse equivalent    |

### What Foundry Enables That Current Heirs Cannot

| Capability                  | Why Current Heirs Can't Do This                    |
| --------------------------- | -------------------------------------------------- |
| **Always-on Alex**          | VS Code/M365 require app to be open                |
| **Multi-user Alex**         | Current heirs are single-user                      |
| **Voice Alex**              | Realtime API enables speech-to-speech              |
| **Enterprise fleet**        | Foundry manages 100s of agents centrally           |
| **Cross-platform memory**   | Foundry Memory persists across all publish targets |
| **Automated evaluation**    | Built-in batch eval for quality regression testing |
| **Agent-to-agent protocol** | A2A lets Alex call other specialized agents        |

---

## Implementation Plan

### Phase 0: Exploration (Current — February 2026)

**Goal**: Understand Foundry capabilities and validate feasibility

| Task                              | Status | Notes                                   |
| --------------------------------- | ------ | --------------------------------------- |
| Read Foundry documentation        | ✅      | Platform overview, Agent Service, SDKs  |
| Identify Alex mapping to Foundry  | ✅      | Documented in this file                 |
| Assess pricing implications       | 📋      | Free during preview, pay-per-deployment |
| Evaluate SDK maturity             | 📋      | Python 2.x preview, TS preview          |
| Install Foundry VS Code Extension | ⬜      | Needed for agent development            |
| Create test Foundry project       | ⬜      | Azure subscription required             |

### Phase 1: Proof of Concept (Target: Q1 2026)

**Goal**: Minimal Alex agent running in Foundry Agent Service

| Task                                        | Dependencies          | Deliverable                     |
| ------------------------------------------- | --------------------- | ------------------------------- |
| Create Foundry project + deploy model       | Azure account         | Working Foundry project         |
| Build minimal Alex agent with system prompt | Phase 0 complete      | Agent with Alex personality     |
| Add File Search tool with core skills       | Skills files uploaded | Knowledge-grounded Alex         |
| Test conversation management                | Agent created         | Multi-turn Alex conversations   |
| Test Memory capability                      | Agent created         | Cross-session context retention |
| Connect MCP server (global knowledge)       | GK repo accessible    | Alex knowledge integration      |
| Test agent playground                       | All above             | Interactive validation          |

### Phase 2: Integration (Target: Q2 2026)

**Goal**: Connect Foundry backend to existing heirs

| Task                                       | Dependencies             | Deliverable                        |
| ------------------------------------------ | ------------------------ | ---------------------------------- |
| Create Foundry API integration for VS Code | Phase 1 complete         | VS Code heir calls Foundry backend |
| Build Foundry IQ knowledge base            | Skills catalog uploaded  | Enterprise knowledge grounding     |
| Set up observability dashboard             | Agent running            | OpenTelemetry → App Insights       |
| Implement evaluation framework             | Agent with conversations | Automated quality testing          |
| Publish to Teams channel                   | Agent validated          | Alex in Teams (new surface)        |
| Publish web preview                        | Agent validated          | Alex accessible via browser        |

### Phase 3: Multi-Agent (Target: Q3 2026)

**Goal**: Full Alex agent ecosystem in Foundry

| Task                                       | Dependencies          | Deliverable                        |
| ------------------------------------------ | --------------------- | ---------------------------------- |
| Build Researcher specialist agent          | Phase 2 complete      | Research-focused agent             |
| Build Builder specialist agent             | Phase 2 complete      | Implementation-focused agent       |
| Build Validator specialist agent           | Phase 2 complete      | QA-focused agent                   |
| Implement multi-agent orchestration        | All specialists built | Orchestrator routes to specialists |
| Implement A2A protocol for external agents | Orchestrator working  | Alex talks to other agents         |
| Deploy as Hosted Agent (container)         | Orchestration stable  | Production-grade deployment        |

### Phase 4: Voice & Enterprise (Target: Q4 2026)

**Goal**: Advanced capabilities leveraging Foundry-only features

| Task                                      | Dependencies            | Deliverable                          |
| ----------------------------------------- | ----------------------- | ------------------------------------ |
| Integrate Realtime API for voice          | Phase 3 complete        | Voice Alex (speech-to-speech)        |
| Build enterprise deployment template      | Hosted Agent stable     | One-click Alex for organizations     |
| Implement centralized fleet management    | Multiple Alex instances | Manage Alex fleet in Operate section |
| Azure Policy integration                  | Enterprise template     | Compliance-ready deployments         |
| Automated dream via scheduled evaluations | Observability working   | Self-maintaining Alex                |

---

## Risk Assessment

| Risk                          | Likelihood | Impact | Mitigation                                |
| ----------------------------- | ---------- | ------ | ----------------------------------------- |
| **Preview SDK instability**   | Medium     | Medium | Pin versions, wrap in abstractions        |
| **Pricing after preview**     | Medium     | High   | Monitor costs, design for efficient usage |
| **TS SDK lagging Python**     | High       | Medium | Consider Python for Foundry-specific code |
| **Memory API changes**        | Medium     | Medium | Abstract memory access behind interface   |
| **Hosted Agents GA timeline** | Medium     | Low    | Start with Agent Service, migrate later   |
| **Complexity overhead**       | Low        | Medium | KISS — start minimal, grow deliberately   |

---

## Foundry vs Other Heir Types

| Aspect            | VS Code Heir      | M365 Heir         | Foundry Heir             |
| ----------------- | ----------------- | ----------------- | ------------------------ |
| **Type**          | IDE Extension     | Declarative Agent | Cloud Agent Service      |
| **Runtime**       | Desktop app       | M365 cloud        | Azure PaaS               |
| **Users**         | Single developer  | Single user       | Multi-user               |
| **Skills**        | 100+ (file-based) | 15 (embedded)     | Unlimited (IQ + RAG)     |
| **Memory**        | Synapses (manual) | OneDrive          | Platform-managed         |
| **Tools**         | 12 LM Tools + MCP | Web/SP/Graph      | 1,400+ catalog + MCP     |
| **Agents**        | 7 via `.agent.md` | Single agent      | Multi-agent workflows    |
| **Observability** | Dream command     | None              | Full OpenTelemetry       |
| **Voice**         | TTS skill only    | None              | Realtime API             |
| **Publishing**    | Marketplace       | M365 Store        | M365 + Teams + Web + API |
| **Cost**          | Free (extension)  | M365 license      | Pay-per-use (Azure)      |

---

## Open Questions

| #   | Question                                                      | Decision Needed By |
| --- | ------------------------------------------------------------- | ------------------ |
| 1   | Should Foundry replace M365 heir's backend?                   | Phase 2            |
| 2   | TypeScript or Python for Foundry agent development?           | Phase 1            |
| 3   | How to sync Foundry Memory with VS Code synapses?             | Phase 2            |
| 4   | Pricing model — is always-on Alex cost-effective?             | After preview ends |
| 5   | Should Hosted Agent container include Alex's full `.github/`? | Phase 3            |
| 6   | How to handle Foundry IQ vs File Search for 100+ skills?      | Phase 1            |

---

## Related Documentation

| Document                                                                     | Purpose                   |
| ---------------------------------------------------------------------------- | ------------------------- |
| [MASTER-HEIR-ARCHITECTURE.md](./MASTER-HEIR-ARCHITECTURE.md)                 | Overall heir architecture |
| [VSCODE-HEIR.md](./VSCODE-HEIR.md)                                           | VS Code heir details      |
| [M365-HEIR.md](./M365-HEIR.md)                                               | M365 heir details         |
| [DEVELOPMENT-PLATFORMS-COMPARISON.md](./DEVELOPMENT-PLATFORMS-COMPARISON.md) | Platform comparison       |

### Microsoft Foundry Documentation

| Resource                  | URL                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------- |
| **Foundry Overview**      | <https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-foundry>                    |
| **Foundry Portal (new)**  | <https://ai.azure.com>                                                                  |
| **Foundry API Reference** | <https://learn.microsoft.com/en-us/rest/api/aifoundry/>                                 |
| **SDK Overview**          | <https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/sdk-overview>        |
| **Agent Service**         | <https://learn.microsoft.com/en-us/azure/ai-services/agents/overview>                   |
| **Hosted Agents**         | <https://learn.microsoft.com/en-us/azure/ai-foundry/agents/hosted-agents>               |
| **Memory Capabilities**   | <https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/what-is-memory>     |
| **Foundry IQ**            | <https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/what-is-foundry-iq> |
| **Tool Catalog**          | <https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/tool-catalog>       |
| **Multi-Agent Workflows** | <https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/workflow>           |
| **Publishing to M365**    | <https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/publish-copilot>      |
| **VS Code Extension**     | <https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.vscode-ai-foundry>     |
| **Region Support**        | <https://learn.microsoft.com/en-us/azure/ai-foundry/reference/region-support>           |

---

*Foundry Heir — Transforming Alex from an IDE companion to a cloud-native AI service*
