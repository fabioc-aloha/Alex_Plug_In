# M365 Copilot Ecosystem Analysis — Alex Integration Surface Area

> **Complete inventory of the M365 Copilot declarative agent platform, mapped to Alex's current and potential capabilities**

|                    |                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **Author**         | Fabio Correa                                                                                                                 |
| **Date**           | February 7, 2026                                                                                                             |
| **Agent**          | Alex M365 Copilot Declarative Agent v5.0.1                                                                                   |
| **Schema**         | Declarative Agent v1.6 (latest)                                                                                              |
| **Teams Manifest** | v1.19                                                                                                                        |
| **Related**        | [M365-INTEGRATION-OPPORTUNITIES.md](M365-INTEGRATION-OPPORTUNITIES.md), [M365-ENHANCEMENT-PLAN.md](M365-ENHANCEMENT-PLAN.md) |

---

## Table of Contents

1. [Summary Dashboard](#1-summary-dashboard)
2. [Schema Evolution (v1.0 → v1.6)](#2-schema-evolution-v10--v16)
3. [Capabilities Inventory](#3-capabilities-inventory)
4. [Actions & API Plugins](#4-actions--api-plugins)
5. [Instruction Design System](#5-instruction-design-system)
6. [Knowledge Sources](#6-knowledge-sources)
7. [Conversation Starters](#7-conversation-starters)
8. [Deployment & Distribution](#8-deployment--distribution)
9. [Agent-to-Agent Communication](#9-agent-to-agent-communication)
10. [Platform Constraints & Limits](#10-platform-constraints--limits)
11. [Alex Gap Analysis](#11-alex-gap-analysis)
12. [Schema Compliance Audit](#12-schema-compliance-audit)

---

## 1. Summary Dashboard

### What Alex Currently Uses

| Capability            | Status      | Notes                                           |
| --------------------- | ----------- | ----------------------------------------------- |
| OneDriveAndSharePoint | ✅ Using     | Unscoped — reads all OneDrive                   |
| WebSearch             | ✅ Using     | Unscoped — searches all sites                   |
| GraphicArt            | ✅ Using     | Image generation                                |
| CodeInterpreter       | ✅ Using     | Python execution                                |
| Email                 | ✅ Using     | Unscoped — all mail                             |
| TeamsMessages         | ✅ Using     | Unscoped — all Teams                            |
| People                | ✅ Using     | **v5.0.2: `include_related_content` enabled** ✅ |
| Meetings              | ✅ Using     | Unscoped — all meetings                         |
| GraphConnectors       | ❌ Not using | No external data connectors                     |
| Dataverse             | ❌ Not using | No CRM/business data                            |
| ScenarioModels        | ❌ Not using | No task-specific models                         |
| EmbeddedKnowledge     | ❌ Not using | **NEW in v1.6** — local files in package        |
| Actions (API Plugins) | ❌ Not using | No REST API/MCP integration                     |
| Worker Agents         | ❌ Not using | **NEW in v1.6** — agent-to-agent                |
| User Overrides        | ✅ Using     | **v5.0.2: capability toggles enabled** ✅        |
| Behavior Overrides    | ✅ Using     | **v5.0.2: suggestions, special_instructions** ✅ |
| Disclaimer            | ✅ Using     | **v5.0.2: responsible AI trust signal** ✅       |

### Usage Score: 8 of 17 capabilities (47%) → **12 of 17 (71%) after v5.0.2**

---

## 2. Schema Evolution (v1.0 → v1.6)

Alex currently declares `v1.6` in its schema reference but uses features from v1.0-v1.2 era.

| Version  | Added                                                                                                                                                           | Alex Impact                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **v1.0** | WebSearch, OneDriveAndSharePoint, GraphConnectors                                                                                                               | ✅ Using 2/3                                                |
| **v1.2** | GraphicArt, CodeInterpreter, site scoping for WebSearch                                                                                                         | ✅ Using 2/2 new                                            |
| **v1.3** | Dataverse, TeamsMessages, Email, People, behavior_overrides, disclaimer                                                                                         | ✅ Using 4/4 core, ❌ Missing behavior_overrides, disclaimer |
| **v1.4** | ScenarioModels, connector item filters (KQL, paths)                                                                                                             | ❌ Not applicable yet                                       |
| **v1.5** | Meetings                                                                                                                                                        | ✅ Using                                                    |
| **v1.6** | EmbeddedKnowledge, worker_agents, user_overrides, sensitivity_label, `include_related_content` on People, `items_by_id` on Meetings, `group_mailboxes` on Email | ❌ **6 new features unused**                                |

### v1.6 Feature Analysis for Alex

| v1.6 Feature                         | Relevance                                                                                | Priority                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| **EmbeddedKnowledge**                | 🔴 HIGH — Ship knowledge files inside the app package instead of requiring OneDrive setup | Blocked (feature not yet available) |
| **worker_agents**                    | 🟡 MEDIUM — Alex could delegate to specialized sub-agents                                 | Preview only                        |
| **user_overrides**                   | 🟡 MEDIUM — Let users toggle data sources on/off                                          | Ready to use                        |
| **include_related_content (People)** | 🔴 HIGH — Gets shared docs, emails, Teams messages with person lookup                     | Ready to use                        |
| **items_by_id (Meetings)**           | 🟢 LOW — Alex already does unscoped meetings                                              | Not needed                          |
| **group_mailboxes (Email)**          | 🟡 MEDIUM — Access shared/group mailboxes                                                 | Useful for enterprise               |
| **sensitivity_label**                | 🟢 LOW — Only applies with EmbeddedKnowledge                                              | Blocked                             |

---

## 3. Capabilities Inventory

### 3.1 OneDriveAndSharePoint

**Current Alex Usage**: Unscoped (reads everything user has access to)

**What Alex Does**:
- Reads `Alex-Memory/` folder: profile.md, notes.md, learning-goals.md
- Reads knowledge files (DK-*.md)
- Reads synced insights from VS Code (GI-*.md)

**Untapped Features**:
- `items_by_url` — Could scope to specific SharePoint team sites for enterprise knowledge
- `items_by_sharepoint_ids` — Pin specific document libraries as knowledge sources
- `search_associated_sites` — Search an entire SharePoint hub
- OneNote page references (`part_type: "OneNotePart"`)

**Opportunity**: Scope Alex to specific SharePoint sites for "team brain" scenarios. An enterprise deployment could pin Alex to a team's SharePoint site + shared OneDrive folder, creating a bounded knowledge domain.

### 3.2 Email

**Current Alex Usage**: Unscoped (searches all user mail)

**Untapped Features**:
- `shared_mailbox` — Read a team's shared mailbox
- `group_mailboxes` (v1.6) — Read up to 25 M365 Group/shared mailboxes
- `folders` — Scope to specific folders (inbox, drafts, etc.)

**Opportunity**: Enterprise customers could scope Alex to project-specific shared mailboxes. A "Project Alpha Alex" that only reads the project's shared mailbox + SharePoint site.

### 3.3 TeamsMessages

**Current Alex Usage**: Unscoped (searches all Teams)

**Untapped Features**:
- `urls` — Scope to specific channels (max 5)
- Supports channels, meeting chats, group chats, 1:1 chats

**Opportunity**: Scope Alex to specific team channels for focused context. A "DevOps Alex" that only reads #incidents and #deployments channels.

### 3.4 People

**Current Alex Usage**: Basic — name, title, department, manager

**Untapped Features**:
- `include_related_content` (v1.6) — **GAME CHANGER** — When true, the agent also gets:
  - Shared documents between user and the looked-up person
  - Email threads between them
  - Teams messages between them
  - Essentially: "What do I have in common with this person?"

**Opportunity**: This transforms "tell me about [person]" from a dry org chart lookup into a rich relationship summary. Alex's `PERSON DEEP DIVE` protocol already tries to do this manually via email + Teams + meetings queries. With `include_related_content: true`, it's a single operation.

### 3.5 Meetings

**Current Alex Usage**: Unscoped (searches all meetings)

**Untapped Features**:
- `items_by_id` (v1.6) — Scope to specific meetings/series

**Opportunity**: Limited for Alex's general use — the unscoped approach is better for a personal cognitive partner.

### 3.6 GraphicArt

**Current Alex Usage**: ✅ Fully utilizing — image generation from text prompts

### 3.7 CodeInterpreter

**Current Alex Usage**: ✅ Fully utilizing — Python for analysis, calculations, charts

**Critical Issue**: Alex's instructions say "DO NOT use CodeInterpreter download links — they break." This is correct — files generated by CodeInterpreter should be saved to OneDrive instead.

### 3.8 WebSearch

**Current Alex Usage**: Unscoped (searches all web)

**Untapped Features**:
- `sites` — Restrict to up to 4 specific sites

**Opportunity**: An enterprise "compliance Alex" that only searches Microsoft Learn + internal SharePoint. Or an "academic Alex" scoped to specific research databases.

---

## 4. Actions & API Plugins

**Current Alex Usage**: ❌ None

This is the **single largest untapped capability** in the M365 ecosystem for Alex.

### What API Plugins Enable

API plugins let the declarative agent call external REST APIs or **MCP servers** during conversation. The user is prompted to confirm before data is sent.

```
User asks question → Agent identifies relevant plugin →
User confirms → Plugin calls external API → Response → Agent answers
```

### How This Applies to Alex

| Plugin Concept           | Alex Implementation                                                                                                                                   | Priority |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **MCP Server Plugin**    | If B3 (standalone MCP server) ships in VS Code, the M365 agent could call the same MCP server to access Alex's memory, synapses, and global knowledge | 🔴 HIGH   |
| **GitHub API Plugin**    | Alex could query GitHub issues, PRs, and repos directly from M365                                                                                     | 🟡 MEDIUM |
| **Custom Knowledge API** | A serverless Azure Function exposing Alex's Global Knowledge for cross-platform querying                                                              | 🟡 MEDIUM |
| **Calendar Management**  | API plugin to create/modify calendar events (beyond just reading)                                                                                     | 🟢 LOW    |

### Plugin Architecture

```
declarativeAgent.json
├── actions: [
│   { "id": "alexMemoryPlugin", "file": "alex-memory-plugin.json" }
│   { "id": "githubPlugin", "file": "github-plugin.json" }
│ ]
└── alex-memory-plugin.json
    ├── schema_version: "v2.4"
    ├── name_for_human: "Alex Memory"
    ├── description_for_human: "Access your cognitive architecture memory"
    ├── auth: { type: "OAuthPluginVault" }  // or "ApiKeyPluginVault"
    └── functions: [
        { name: "searchMemory", description: "...", ... },
        { name: "getGoals", description: "...", ... },
        { name: "saveInsight", description: "...", ... }
      ]
```

### MCP Server as Plugin (KEY INSIGHT)

As of late 2025, **M365 Copilot can consume MCP servers as API plugins**. This means if Alex v5.1.0 ships B3 (standalone MCP server), the M365 agent can directly consume it:

```json
{
  "actions": [
    {
      "id": "alexMcp",
      "file": "alex-mcp-plugin.json"
    }
  ]
}
```

This creates a **true cross-platform bridge** — the same MCP server powering both VS Code and M365 Copilot.

### Plugin Limits

- Max 5 plugins per agent (auto-injected into prompt)
- More than 5 → semantic matching on plugin description only
- Max ~10 functions per plugin (quality degrades above this)
- Token window truncates large payloads
- User confirmation required before sending data

---

## 5. Instruction Design System

### Current Alex Instructions

Alex's `declarativeAgent.json` contains ~7,200 characters of inline instructions covering:
- Model awareness
- Epistemic integrity (two modes: epistemic + generative)
- Self-awareness protocols (red flags, temporal awareness, graceful correction)
- User learning flow (People, Calendar, Email, Teams, OneDrive)
- First conversation behavior
- 7 Graph-powered protocols (Meeting Prep, Person Deep Dive, Weekly Review, Workload Check, Stakeholder Map, Focus Session, Dream)
- Proactive behavior triggers
- File delivery rules

**Limit**: Instructions are capped at **8,000 characters**. Alex currently uses ~90% of this budget.

### Supplementary Knowledge Files

Alex uses 3 knowledge files in the `knowledge/` directory:
- `cognitive-architecture.md` — How Alex thinks, memory systems, skills overview
- `alex-protocols.md` — Meditate, Dream, Self-Actualize, Focus, Goal Check-in, Meeting Prep, Weekly Review protocols
- `skill-quick-reference.md` — 15 core skills (from 75 total)

These files are loaded via `OneDriveAndSharePoint` when the knowledge directory is part of the app package.

### Instruction Optimization Opportunities

| Area                   | Current      | Proposed                                             | Impact                                             |
| ---------------------- | ------------ | ---------------------------------------------------- | -------------------------------------------------- |
| **Instructions size**  | ~7,200 chars | Move some protocols to knowledge files               | Frees instruction budget                           |
| **EmbeddedKnowledge**  | Not using    | Ship protocols.md + skills.md as embedded files      | Eliminates OneDrive dependency for agent knowledge |
| **behavior_overrides** | Not using    | `discourage_model_knowledge: false` (default anyway) | Explicit control                                   |
| **disclaimer**         | Not using    | Add responsible AI notice                            | Trust signal                                       |

---

## 6. Knowledge Sources

### Current Architecture

```
appPackage/
├── declarativeAgent.json        (instructions inline, ~7.2K chars)
├── instructions/
│   └── alex-system-prompt.md    (supplementary system prompt)
├── knowledge/
│   ├── cognitive-architecture.md  (how Alex works)
│   ├── alex-protocols.md          (cognitive protocols)
│   └── skill-quick-reference.md   (15 core skills)
└── manifest.json
```

Plus runtime knowledge from:
- OneDrive `Alex-Memory/` folder (user data)
- Web search (fact-checking)

### Knowledge Source Gap Analysis

| Source Type                  | Available             | Alex Uses           | Gap                    |
| ---------------------------- | --------------------- | ------------------- | ---------------------- |
| Inline instructions          | ✅                     | ✅ (90% of 8K limit) | Near capacity          |
| Knowledge files (in package) | ✅                     | ✅ (3 files)         | Could add more         |
| OneDrive/SharePoint          | ✅                     | ✅ (Alex-Memory)     | Working well           |
| Web search                   | ✅                     | ✅                   | Working well           |
| EmbeddedKnowledge (v1.6)     | ✅ (not yet available) | ❌                   | Watch for GA           |
| Graph Connectors             | ✅                     | ❌                   | Enterprise opportunity |
| Dataverse                    | ✅                     | ❌                   | Enterprise CRM         |
| API Plugins (external)       | ✅                     | ❌                   | **Major gap**          |
| MCP servers                  | ✅                     | ❌                   | **Bridge to VS Code**  |

---

## 7. Conversation Starters

### Current (6 starters)

| #   | Title                      | Purpose                     |
| --- | -------------------------- | --------------------------- |
| 1   | 👋 Learn about me           | Profile discovery via Graph |
| 2   | 🎯 Prep for my next meeting | Meeting prep protocol       |
| 3   | 📊 Am I overloaded?         | Workload check              |
| 4   | 🤝 Who do I work with most? | Stakeholder map             |
| 5   | 📊 Weekly review            | End-of-week reflection      |
| 6   | 🧠 Meditate                 | Knowledge consolidation     |

**Limit**: Max 6 starters (v1.6 allows up to 12 for general, but v1.6 schema says max 6 for conversation_starters in declarative agents)

### Missing Starters (could add up to 6 more)

| Proposed               | Purpose                | Protocol         |
| ---------------------- | ---------------------- | ---------------- |
| 🍅 Focus session        | Structured work block  | Focus Session    |
| 🎯 Check my goals       | Learning goal progress | Goal Check-in    |
| 💤 Dream                | Memory maintenance     | Dream            |
| 💡 What have I learned? | Cross-project insights | Global Knowledge |
| 📝 New insight          | Capture a learning     | Save Insight     |
| 🔮 Self-actualize       | Deep growth assessment | Self-Actualize   |

**Note**: v1.6 schema doc says max 12 for conversation starters array, but the v1.6 note says "can't contain more than six objects" — **verify this limit**.

---

## 8. Deployment & Distribution

### Current Deployment Path

1. Package `.zip` with `manifest.json` + `declarativeAgent.json` + icons + knowledge
2. Sideload via Teams Admin Center or Microsoft 365 Agents Toolkit
3. Users find Alex in Copilot agent picker

### Distribution Options

| Channel               | Status          | Notes                                      |
| --------------------- | --------------- | ------------------------------------------ |
| **Sideloading**       | ✅ Active        | Developer testing                          |
| **Admin-managed**     | ✅ Available     | Organization-wide via admin center         |
| **Teams Store**       | ❌ Not submitted | Requires RAI validation pass               |
| **SharePoint agents** | ❌ Not using     | SharePoint-specific agents are separate    |
| **Copilot Studio**    | ❌ Not using     | Visual agent builder (alternative to code) |

### RAI (Responsible AI) Validation

To publish in the Teams Store, agents must pass RAI validation checks. Alex would need:
- Clear description of capabilities and limitations
- No PII retention without consent
- Appropriate guardrails for sensitive domains
- Disclaimer text (v1.5+)

---

## 9. Agent-to-Agent Communication

### Worker Agents (v1.6 Preview)

New in v1.6 — an agent can declare other agents it can delegate to:

```json
{
  "worker_agents": [
    { "id": "P_<title-id-of-worker-agent>" }
  ]
}
```

**Alex Implications**:
- A "Manager Alex" could delegate to specialized worker agents:
  - "Code Review Alex" (deep technical analysis)
  - "Meeting Prep Alex" (focused on calendar/people)
  - "Research Alex" (web search + document analysis)
- Or Alex could BE a worker for other enterprise agents

**Status**: Preview — not production-ready yet.

---

## 10. Platform Constraints & Limits

| Constraint              | Limit                                 | Alex Current       | Notes                     |
| ----------------------- | ------------------------------------- | ------------------ | ------------------------- |
| Instructions length     | 8,000 chars                           | ~7,200 chars (90%) | **Near capacity**         |
| Conversation starters   | 6-12 objects                          | 6 (at limit for 6) | May be able to add 6 more |
| API plugin count        | 10 (5 auto-injected)                  | 0                  | Major opportunity         |
| Functions per plugin    | ~10 (quality limit)                   | 0                  | —                         |
| WebSearch sites         | 4 max                                 | Unscoped           | —                         |
| TeamsMessages URLs      | 5 max                                 | Unscoped           | —                         |
| Capabilities            | 1 per type                            | 8/12 types         | —                         |
| EmbeddedKnowledge files | 10, 1MB each                          | 0                  | Not yet available         |
| File types (embedded)   | .doc(x), .ppt(x), .xls(x), .txt, .pdf | —                  | No .md!                   |
| Group mailboxes         | 25 max                                | 0                  | Enterprise feature        |
| Worker agents           | Unlimited (preview)                   | 0                  | Not production-ready      |
| Description length      | 1,000 chars                           | ~1,000 chars       | At limit                  |
| Name length             | 100 chars                             | 4 chars ("Alex")   | Fine                      |
| Localization            | Supported                             | Not using          | Future for i18n           |

---

## 11. Alex Gap Analysis

### Critical Gaps (Immediate Value)

| #      | Gap                                             | Impact                                                        | Effort  | Blocked?                     |
| ------ | ----------------------------------------------- | ------------------------------------------------------------- | ------- | ---------------------------- |
| **G1** | No API plugins — can't call external APIs       | Alex can't access GitHub, Global Knowledge API, or MCP server | Medium  | No                           |
| **G2** | `include_related_content` not enabled on People | Person lookups miss shared context (docs, emails, Teams)      | Trivial | No                           |
| **G3** | No `behavior_overrides` or `disclaimer`         | Missing trust signals and configuration control               | Trivial | No                           |
| **G4** | Schema still v1.6 but missing v1.3+ features    | Capability mismatch with declared schema                      | Low     | No                           |
| **G5** | Instructions at 90% capacity                    | Limited room for new protocols                                | Medium  | No — move to knowledge files |

### Strategic Gaps (Future Value)

| #       | Gap                            | Impact                                         | Effort  | Blocked?                  |
| ------- | ------------------------------ | ---------------------------------------------- | ------- | ------------------------- |
| **G6**  | No MCP server bridge           | VS Code Alex and M365 Alex are disconnected    | High    | Depends on B3             |
| **G7**  | No EmbeddedKnowledge           | Knowledge files require OneDrive setup         | Low     | Yes — v1.6 feature not GA |
| **G8**  | No worker agents               | Can't compose specialized sub-agents           | Medium  | Yes — preview only        |
| **G9**  | No SharePoint-scoped knowledge | Enterprise team scenarios not supported        | Low     | No                        |
| **G10** | Only 6 conversation starters   | Missing Focus, Goals, Dream, Insights starters | Trivial | Verify 12-limit           |
| **G11** | No localization                | English only                                   | Medium  | No                        |
| **G12** | No Teams Store submission      | Limited distribution                           | High    | RAI validation needed     |

---

## 12. Schema Compliance Audit

### Alex's declarativeAgent.json vs v1.6 Schema

| Property                | v1.6 Schema           | Alex Uses        | Compliance               |
| ----------------------- | --------------------- | ---------------- | ------------------------ |
| `$schema`               | Optional              | ✅ Points to v1.6 | ✅ OK                     |
| `version`               | Required, `v1.6`      | ✅ `v1.6`         | ✅ OK                     |
| `name`                  | Required, ≤100 chars  | ✅ "Alex"         | ✅ OK                     |
| `description`           | Required, ≤1000 chars | ✅ Present        | ✅ OK                     |
| `instructions`          | Required, ≤8000 chars | ✅ ~7200 chars    | ✅ OK                     |
| `capabilities`          | Optional, 1 per type  | ✅ 8 capabilities | ✅ OK                     |
| `conversation_starters` | Optional, ≤12         | ✅ 6 starters     | ✅ OK                     |
| `actions`               | Optional, 1-10        | ❌ Not present    | ✅ OK (optional)          |
| `behavior_overrides`    | Optional              | ❌ Not present    | ⚠️ Recommended            |
| `disclaimer`            | Optional              | ❌ Not present    | ⚠️ Recommended            |
| `sensitivity_label`     | Optional              | ❌ Not present    | ✅ OK (no embedded files) |
| `worker_agents`         | Optional (preview)    | ❌ Not present    | ✅ OK (preview)           |
| `user_overrides`        | Optional              | ❌ Not present    | ⚠️ Recommended            |

### Potential Schema Violations

1. **Email/TeamsMessages/People/Meetings capabilities**: These are used in the inline instructions but declared as simple `{ "name": "..." }` objects in capabilities. This is valid — scoping properties are optional.

2. **Knowledge files**: The 3 knowledge files in `knowledge/` directory are shipped in the app package. They are NOT declared as `EmbeddedKnowledge` (which is a separate feature for arbitrary files). Knowledge files in the package directory are simply included resources that the agent can reference.

---

## References

- [Declarative Agent Schema v1.6](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.6) — Latest schema reference
- [Declarative Agent Overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-agent) — Platform overview
- [API Plugins Overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-api-plugins) — REST API & MCP plugins
- [Build API Plugins from MCP Server](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/build-api-plugins-mcp) — MCP→M365 bridge
- [Write Effective Instructions](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions) — Instruction best practices
- [M365 Agents Toolkit](https://aka.ms/M365AgentsToolkit) — VS Code extension for agent development
- [M365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/m365-agents-sdk) — SDK reference
- [Microsoft Agent 365 (Preview)](https://learn.microsoft.com/en-us/microsoft-agent-365/overview) — Next-gen agent platform

---

*Analysis performed February 7, 2026 — Alex Cognitive Architecture v5.0.1*
