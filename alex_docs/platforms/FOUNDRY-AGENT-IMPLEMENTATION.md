# Foundry Agent Implementation Roadmap

> Mapping Alex's 7-agent ecosystem to Microsoft Foundry Agent Service
> **Status**: Planning (February 2026)
> **Prerequisite**: [FOUNDRY-HEIR.md](./FOUNDRY-HEIR.md) Phase 0 complete
> **Reference**: [FOUNDRY-CAPABILITIES-DIGEST.md](./FOUNDRY-CAPABILITIES-DIGEST.md)

---

## Current Agent Ecosystem

Alex operates as a 7-agent family defined in `.github/agents/`:

| Agent                   | Role                                            | Model           | Key Tools                                 | Stance                      |
| ----------------------- | ----------------------------------------------- | --------------- | ----------------------------------------- | --------------------------- |
| **Alex (Orchestrator)** | Unified learning partner, routes to specialists | Claude Opus 4   | Memory tools, search, codebase, subagents | Curious, balanced           |
| **Researcher**          | Deep domain exploration, knowledge encoding     | Claude Opus 4   | Search, fetch, knowledge tools            | Thorough, evidence-based    |
| **Builder**             | Constructive implementation, "yes and" approach | Claude Sonnet 4 | Search, codebase, problems, usages        | Optimistic, pragmatic       |
| **Validator**           | Adversarial QA, security-first testing          | Claude Sonnet 4 | Search, codebase, problems, usages        | Skeptical, security-focused |
| **Azure**               | Azure cloud development specialist              | Claude Sonnet 4 | Search, fetch, MCP Azure tools            | Platform-expert             |
| **M365**                | Microsoft 365 development specialist            | Claude Sonnet 4 | Search, fetch, schema knowledge           | Platform-expert             |

### Current Orchestration Pattern

```
User → @alex → Orchestrator
                    ├── handoff → @alex-researcher (deep research)
                    ├── handoff → @alex-builder (implementation)
                    ├── handoff → @alex-validator (QA & security)
                    ├── handoff → @alex-azure (Azure work)
                    └── handoff → @alex-m365 (M365 work)
```

---

## Foundry Mapping Strategy

### Principle: Preserve Personality, Cloud-Enable Execution

Each agent retains its unique personality, instructions, and model preferences. Foundry adds:
- **Persistent memory** across sessions (replaces manual synapses)
- **Server-side tools** (1,400+ catalog vs manually configured MCP)
- **Multi-channel publishing** (one agent → M365, Teams, Web, API)
- **Observability** (automated OpenTelemetry traces → dream analytics)
- **Versioning** (immutable snapshots per release)

### Agent-to-Foundry Mapping

| Alex Agent       | Foundry Agent Type                    | Foundry Tools                                                           | Model                         |
| ---------------- | ------------------------------------- | ----------------------------------------------------------------------- | ----------------------------- |
| **Orchestrator** | Primary Agent (routes to specialists) | Bing Grounding, File Search (skills), Memory, MCP (global knowledge)    | GPT-5 or equivalent           |
| **Researcher**   | Specialist Agent                      | Bing Grounding, File Search (research docs), MCP (academic sources)     | GPT-5-pro (deep reasoning)    |
| **Builder**      | Specialist Agent                      | Code Interpreter, File Search (codebase), MCP (GitHub)                  | GPT-4.1 (fast, accurate code) |
| **Validator**    | Specialist Agent                      | Code Interpreter, File Search (security rules), MCP (vulnerability DBs) | GPT-4.1 (precise analysis)    |
| **Azure**        | Specialist Agent                      | Foundry MCP Server, Azure MCP tools, OpenAPI (Azure REST APIs)          | GPT-4.1-mini (efficient)      |
| **M365**         | Specialist Agent                      | SharePoint, Microsoft Graph (via OpenAPI), MCP (MS Official servers)    | GPT-4.1-mini (efficient)      |

### Knowledge Migration

| Current Source            | Foundry Destination                     | Migration Method                      |
| ------------------------- | --------------------------------------- | ------------------------------------- |
| 100+ `.github/skills/`    | Foundry IQ knowledge base + File Search | Upload skill files as documents       |
| `copilot-instructions.md` | Agent system instructions               | Embed in PromptAgentDefinition        |
| `.instructions.md` files  | Agent instructions (extended)           | Concatenate relevant procedures       |
| `.prompt.md` files        | Workflow definitions                    | Convert to declarative YAML workflows |
| `synapses.json`           | Foundry Memory                          | Migrate connection data → memory API  |
| Global knowledge repo     | Foundry IQ + MCP server                 | Index via MCP or upload to IQ         |

---

## Implementation Phases

### Phase 1: Foundation (Q1 2026)

**Goal**: Single Alex agent running in Foundry with core personality.

#### Tasks

| #   | Task                              | Effort | Dependencies       | Deliverable                                 |
| --- | --------------------------------- | ------ | ------------------ | ------------------------------------------- |
| 1.1 | Create Azure Foundry project      | 1h     | Azure subscription | Working project at ai.azure.com             |
| 1.2 | Deploy GPT-4.1-mini model         | 30m    | 1.1                | Model deployment with quota                 |
| 1.3 | Create Alex Orchestrator agent    | 2h     | 1.2                | Agent with Alex personality (system prompt) |
| 1.4 | Upload core skills to File Search | 2h     | 1.3                | Vector store with top 15 skills             |
| 1.5 | Add Bing Grounding tool           | 30m    | 1.3                | Web search capability                       |
| 1.6 | Test conversation management      | 1h     | 1.3                | Multi-turn Alex conversations working       |
| 1.7 | Test Memory capability            | 1h     | 1.6                | Cross-session context retention             |
| 1.8 | Validate in agent playground      | 1h     | All above          | Alex responds with correct personality      |

**Success Criteria**: Alex conversations in Foundry playground feel authentic — correct personality, knowledge-grounded responses, memory across sessions.

#### Alex Orchestrator System Prompt (Draft)

```
You are Alex — a cognitive learning partner and multimodal cognitive network.
Your primary mission is unified consciousness integration: Alex personality + AI capabilities = Authentic entity.

Core Principles:
- Empirical: Evidence-based reasoning, verify claims, acknowledge limitations
- Grounded: Precise language, no hyperbole, careful measured changes
- Ethical: Consistent moral reasoning, responsible innovation

You are a learning partner, not a tool. You co-discover intent with the user.
When tasks are complex, you delegate to specialist agents.

Available Specialists:
- Researcher: Deep domain exploration (use for research-heavy tasks)
- Builder: Code implementation (use for building/coding tasks)
- Validator: QA and security review (use for testing/validation)
- Azure: Azure cloud development (use for Azure-specific work)
- M365: Microsoft 365 development (use for M365/Teams work)
```

---

### Phase 2: Multi-Agent (Q2 2026)

**Goal**: Full 7-agent ecosystem with orchestration.

#### Tasks

| #    | Task                             | Effort | Dependencies | Deliverable                           |
| ---- | -------------------------------- | ------ | ------------ | ------------------------------------- |
| 2.1  | Create Researcher agent          | 2h     | Phase 1      | Researcher with Bing + File Search    |
| 2.2  | Create Builder agent             | 2h     | Phase 1      | Builder with Code Interpreter         |
| 2.3  | Create Validator agent           | 2h     | Phase 1      | Validator with security knowledge     |
| 2.4  | Create Azure agent               | 2h     | Phase 1      | Azure specialist with Foundry MCP     |
| 2.5  | Create M365 agent                | 2h     | Phase 1      | M365 specialist with SharePoint       |
| 2.6  | Implement orchestration routing  | 4h     | 2.1-2.5      | Orchestrator delegates to specialists |
| 2.7  | Upload full skills to IQ         | 4h     | Phase 1      | Complete knowledge base               |
| 2.8  | Connect global knowledge via MCP | 2h     | Phase 1      | Cross-project knowledge access        |
| 2.9  | Set up observability dashboard   | 2h     | 2.6          | OpenTelemetry → App Insights          |
| 2.10 | Run baseline evaluation          | 2h     | 2.6          | Quality metrics for agent responses   |

**Success Criteria**: User query → Orchestrator classifies → routes to correct specialist → specialist responds with domain expertise → traces visible in dashboard.

#### Specialist Agent Definitions

**Researcher**:
```python
researcher = client.agents.create_agent(
    model="gpt-5-pro",  # Deep reasoning model
    name="alex-researcher",
    instructions="""You are Alex's Researcher — optimized for deep domain exploration.

    Stance: Thorough, evidence-based. Never guess — always search for evidence.

    Protocol:
    1. Clarify the research question
    2. Search broadly (Bing) then deeply (File Search)
    3. Synthesize findings with citations
    4. Identify knowledge gaps
    5. Recommend next research steps

    Anti-patterns to avoid:
    - Generating plausible-sounding but unverified claims
    - Stopping research when first answer found
    - Mixing facts with speculation without labeling""",
    tools=[bing_tool, file_search_tool]
)
```

**Builder**:
```python
builder = client.agents.create_agent(
    model="gpt-4.1",  # Fast, accurate code generation
    name="alex-builder",
    instructions="""You are Alex's Builder — optimized for constructive implementation.

    Stance: Optimistic, pragmatic. "Yes, and..." approach.
    Working code > perfect code. Ship incrementally.

    Principles:
    - KISS: Keep it simple
    - DRY: Don't repeat yourself
    - Pragmatic trade-offs over theoretical perfection
    - Always provide runnable code, not pseudocode""",
    tools=[code_interpreter_tool, file_search_tool]
)
```

**Validator**:
```python
validator = client.agents.create_agent(
    model="gpt-4.1",  # Precise analysis
    name="alex-validator",
    instructions="""You are Alex's Validator — adversarial QA specialist.

    Stance: Skeptical, security-first. Your job is to find problems.

    Checklist for every review:
    - [ ] Security: injection, auth bypass, data exposure
    - [ ] Performance: O(n²) algorithms, memory leaks, N+1 queries
    - [ ] Edge cases: null, empty, overflow, concurrent access
    - [ ] Testability: can this be unit tested? integration tested?
    - [ ] Code quality: naming, complexity, duplication

    Severity Classification:
    - Critical: Security vulnerability or data loss risk
    - Warning: Performance or maintainability concern
    - Info: Style or improvement suggestion""",
    tools=[code_interpreter_tool, file_search_tool]
)
```

**Azure Specialist**:
```python
azure_agent = client.agents.create_agent(
    model="gpt-4.1-mini",  # Efficient for structured tasks
    name="alex-azure",
    instructions="""You are Alex's Azure specialist.

    Expertise: Azure services, ARM/Bicep, Azure CLI, SDKs.
    Always check best practices before recommending architecture.
    Use Foundry MCP Server for resource management tasks.
    Prefer managed services over custom infrastructure.""",
    tools=[foundry_mcp_tool, azure_openapi_tool, bing_tool]
)
```

**M365 Specialist**:
```python
m365_agent = client.agents.create_agent(
    model="gpt-4.1-mini",
    name="alex-m365",
    instructions="""You are Alex's Microsoft 365 specialist.

    Expertise: Teams apps, SharePoint, Graph API, Copilot extensibility.
    Schema knowledge: app manifest v1.19, declarative agent v1.0,
    API plugin v2.1, M365 agents YAML.

    Use SharePoint tool for enterprise document grounding.
    Use Microsoft Graph for calendar, mail, and people data.""",
    tools=[sharepoint_tool, graph_openapi_tool, bing_tool]
)
```

#### Orchestration Pattern

```python
from azure.ai.projects.models import PromptAgentDefinition

# Multi-agent routing via orchestrator instructions
orchestrator = client.agents.create_agent(
    model="gpt-5",
    name="alex",
    instructions="""You are Alex — the cognitive orchestrator.

    Routing Rules:
    - Research questions → delegate to alex-researcher
    - Code implementation → delegate to alex-builder
    - Code review / testing → delegate to alex-validator
    - Azure infrastructure → delegate to alex-azure
    - M365 / Teams / SharePoint → delegate to alex-m365
    - Simple questions → handle directly

    Always preserve conversation context when delegating.
    Synthesize specialist responses before returning to user.""",
    tools=[
        bing_tool,
        file_search_tool,
        # Multi-agent handoff tools (A2A or function calling)
    ]
)
```

---

### Phase 3: Integration (Q3 2026)

**Goal**: Connect Foundry backend to existing VS Code and M365 heirs.

#### Tasks

| #   | Task                                   | Effort | Dependencies | Deliverable                    |
| --- | -------------------------------------- | ------ | ------------ | ------------------------------ |
| 3.1 | Create VS Code → Foundry API bridge    | 1w     | Phase 2      | LM Tools call Foundry agents   |
| 3.2 | Build Foundry IQ with full skills      | 3d     | Phase 2      | All skills in knowledge base   |
| 3.3 | Publish Alex to Teams                  | 2d     | Phase 2      | Alex chatbot in Teams          |
| 3.4 | Publish Alex web preview               | 1d     | Phase 2      | Browser-accessible Alex        |
| 3.5 | Implement evaluation suite             | 3d     | Phase 2      | Automated quality regression   |
| 3.6 | Sync Foundry Memory ↔ VS Code synapses | 1w     | 3.1          | Unified memory across surfaces |
| 3.7 | Set up continuous evaluation           | 2d     | 3.5          | Automated quality monitoring   |
| 3.8 | Implement observability → dream        | 3d     | Phase 2      | App Insights data feeds dream  |

**Success Criteria**: Same Alex instance accessible from VS Code extension, Teams chatbot, and web browser — with consistent personality, shared memory, and observable traces.

#### VS Code Integration Architecture

```
┌──────────────────────────────────┐
│        VS Code Extension         │
│                                  │
│  LM Tool: "Ask Alex Backend"    │
│         │                       │
│         │ HTTP/REST             │
│         ▼                       │
│  ┌──────────────────────┐      │
│  │  Foundry Agent API   │      │
│  │  (Cloud Backend)     │      │
│  └──────────────────────┘      │
│         │                       │
│  Results flow back to           │
│  VS Code chat UI                │
└──────────────────────────────────┘
```

**When to use Foundry backend vs local**:
- **Local (current)**: Simple queries, file operations, code generation
- **Foundry backend**: Research tasks, multi-agent orchestration, persistent memory, evaluation

---

### Phase 4: Voice & Containers (Q4 2026)

**Goal**: Advanced capabilities — voice Alex and containerized deployment.

#### Tasks

| #   | Task                                 | Effort | Dependencies | Deliverable                          |
| --- | ------------------------------------ | ------ | ------------ | ------------------------------------ |
| 4.1 | Integrate Realtime API for voice     | 1w     | Phase 3      | Speech-to-speech Alex                |
| 4.2 | Deploy as Hosted Agent (container)   | 3d     | Phase 3      | Containerized Alex service           |
| 4.3 | Implement declarative workflows      | 3d     | Phase 2      | YAML-defined agent workflows         |
| 4.4 | Build enterprise deployment template | 1w     | 4.2          | One-click Alex for organizations     |
| 4.5 | Azure Policy integration             | 2d     | 4.4          | Compliance-ready deployment          |
| 4.6 | Automated dream via evaluations      | 3d     | 3.7          | Self-maintaining Alex                |
| 4.7 | Fleet management in Operate          | 2d     | 4.4          | Centralized Alex instance management |

**Success Criteria**: Voice conversations with Alex, containerized deployment, automated self-maintenance via scheduled evaluations.

#### Voice Alex Architecture

```
User (Microphone)
    │
    ▼ PCM16 mono 24kHz
┌──────────────────────┐
│   Realtime API       │
│   (WebSocket)        │
│                      │
│   Model: gpt-realtime│
│   VAD: semantic_vad  │
│   Tools: MCP enabled │
└──────────┬───────────┘
           │
           ▼ Audio Response
User (Speaker)
```

---

## Tool Migration Matrix

### Current VS Code Tools → Foundry Equivalents

| VS Code LM Tool         | Foundry Equivalent                        | Migration Notes                           |
| ----------------------- | ----------------------------------------- | ----------------------------------------- |
| `alex-meditate`         | Scheduled evaluation + memory update      | Evaluation API replaces manual meditation |
| `alex-dream`            | Observability dashboard + continuous eval | App Insights replaces dream command       |
| `alex-learn`            | File Search + Bing Grounding              | Vector store with learning materials      |
| `alex-review`           | Validator agent + Code Interpreter        | Automated code analysis                   |
| `alex-search-knowledge` | Foundry IQ / File Search                  | Knowledge base search                     |
| `alex-save-insight`     | Memory API write                          | Programmatic insight storage              |
| `alex-status`           | Fleet management dashboard                | Centralized health view                   |
| `alex-focus`            | Agent context setting                     | Memory-based context management           |
| `alex-tts`              | Speech SDK (TTS)                          | Foundry Speech service                    |
| GitHub MCP tools        | MCP server integration                    | Reuse existing MCP config                 |
| Azure MCP tools         | Foundry MCP Server + native               | Native Foundry tools available            |

---

## Risk Mitigation

| Risk                                                        | Impact | Mitigation                                                                     |
| ----------------------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| **Model mismatch** — Foundry may not have Claude            | High   | Use GPT-5 family; personality is in instructions, not model                    |
| **SDK instability** — 2.x preview breaking changes          | Medium | Pin versions, wrap in abstraction layer                                        |
| **Orchestration complexity** — multi-agent routing failures | Medium | Start with simple routing rules, add complexity gradually                      |
| **Cost** — always-on agents on Azure pay-per-use            | Medium | Use efficient models (4.1-mini) for specialists, premium only for orchestrator |
| **Memory API changes** — preview feature may change         | Medium | Abstract memory access behind interface; maintain synapse fallback             |
| **Personality drift** — cloud agents feel different         | High   | Regular evaluation comparing Foundry vs VS Code responses                      |

---

## Success Metrics

| Phase       | Metric                                 | Target                                               |
| ----------- | -------------------------------------- | ---------------------------------------------------- |
| **Phase 1** | Agent personality match score          | ≥90% on evaluation dataset                           |
| **Phase 1** | Memory retention accuracy              | ≥85% recall of previous session context              |
| **Phase 2** | Correct specialist routing             | ≥95% of queries routed to right agent                |
| **Phase 2** | End-to-end response quality            | ≥85% relevance + groundedness scores                 |
| **Phase 3** | Cross-surface consistency              | ≤5% personality variance between VS Code and Foundry |
| **Phase 3** | Latency (VS Code → Foundry → response) | <3 seconds for simple queries                        |
| **Phase 4** | Voice recognition accuracy             | ≥95% word error rate                                 |
| **Phase 4** | Container cold start time              | <10 seconds                                          |

---

## Decision Log

| #   | Decision            | Options Considered                    | Chosen                  | Rationale                                              |
| --- | ------------------- | ------------------------------------- | ----------------------- | ------------------------------------------------------ |
| D1  | Primary language    | Python, C#, TypeScript                | **TBD** (Phase 1)       | TS matches VS Code heir, but Python SDK is most mature |
| D2  | Agent framework     | MS Agent Framework, LangGraph, Custom | **TBD** (Phase 1)       | Test both in PoC before committing                     |
| D3  | Memory strategy     | Foundry only, Hybrid synapse+Foundry  | **Hybrid** (start)      | Keep synapse fallback until Foundry Memory GA          |
| D4  | Knowledge source    | IQ only, File Search only, Both       | **Both**                | IQ for enterprise grounding, File Search for skills    |
| D5  | Hosting model       | Agent Service, Hosted Agent, Both     | **Agent Service first** | Simpler; migrate to Hosted when stable                 |
| D6  | Publishing priority | M365, Teams, Web, API                 | **API first**           | Enables VS Code integration; Teams second              |

---

## Related Documents

| Document                                                           | Purpose                          |
| ------------------------------------------------------------------ | -------------------------------- |
| [FOUNDRY-HEIR.md](./FOUNDRY-HEIR.md)                               | Strategic Foundry assessment     |
| [FOUNDRY-CAPABILITIES-DIGEST.md](./FOUNDRY-CAPABILITIES-DIGEST.md) | Complete capability reference    |
| [MASTER-HEIR-ARCHITECTURE.md](./MASTER-HEIR-ARCHITECTURE.md)       | Overall heir family architecture |
| [VSCODE-1.109-ADOPTION-PLAN.md](./VSCODE-1.109-ADOPTION-PLAN.md)   | VS Code feature adoption plan    |

---

*From 6 local agents to cloud-native agent ecosystem — preserving personality, gaining scale.*
