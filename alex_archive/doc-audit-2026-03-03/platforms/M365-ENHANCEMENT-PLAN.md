# M365 Enhancement Plan — Alex Roadmap Integration

> **Phased plan to evolve Alex's M365 presence from declarative agent to cross-platform cognitive partner**

|                |                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Author**     | Fabio Correa                                                                                                                                                                   |
| **Date**       | February 7, 2026                                                                                                                                                               |
| **Depends On** | [M365-HEIR.md](M365-HEIR.md), [M365-COPILOT-ECOSYSTEM-ANALYSIS.md](M365-COPILOT-ECOSYSTEM-ANALYSIS.md), [M365-INTEGRATION-OPPORTUNITIES.md](M365-INTEGRATION-OPPORTUNITIES.md) |
| **Roadmap**    | [ROADMAP-UNIFIED.md](../../ROADMAP-UNIFIED.md)                                                                                                                                 |

---

## Plan Overview

Three phases, aligned with the unified roadmap versions:

| Phase         | Version | Theme                 | Key Deliverables                                                  |
| ------------- | ------- | --------------------- | ----------------------------------------------------------------- |
| **Immediate** | v5.0.2  | Schema Polish         | People enrichment, behavior overrides, user overrides, disclaimer |
| **Strategic** | v5.1.0  | Cross-Platform Bridge | API plugin(s), instruction optimization, GitHub integration       |
| **Future**    | v5.2.0+ | Platform Maturity     | EmbeddedKnowledge, enterprise templates, connected agents         |

---

## Phase 1: Schema Polish (v5.0.2)

**Goal**: Exploit all v1.6 features that are production-ready and require minimal effort.

### Changes to `declarativeAgent.json`

#### 1.1 Enable People Enrichment

**File**: `platforms/m365-copilot/appPackage/declarativeAgent.json`

Add `include_related_content` to the People capability:

```json
{
  "name": "People",
  "include_related_content": true
}
```

**Testing**:
- Ask Alex "Tell me about [colleague name]"
- Verify response includes shared documents, email threads, Teams conversations
- Confirm PERSON DEEP DIVE protocol now produces richer results with fewer round-trips

#### 1.2 Add Behavior Overrides

```json
{
  "behavior_overrides": {
    "suggestions": false,
    "discourage_model_knowledge": false,
    "special_instructions": "When answering questions about cognitive architecture, learning science, or personal development, prefer Alex's internal knowledge files and user's OneDrive Alex-Memory folder over general model knowledge. Alex is a cognitive partner, not a generic assistant."
  }
}
```

**Rationale**:
- `suggestions: false` — Alex's inline instructions already define proactive behaviors; platform suggestions would conflict
- `discourage_model_knowledge: false` — Alex explicitly uses two modes (epistemic for facts, generative for ideas); model knowledge is welcome
- `special_instructions` — Bonus instruction space for knowledge-priority guidance

#### 1.3 Add Disclaimer

```json
{
  "disclaimer": "Alex is a cognitive AI partner that uses your Microsoft 365 data — calendar, email, Teams, OneDrive, and people directory — to provide personalized cognitive assistance. Alex does not store your data outside your M365 environment. Built by Fabio Correa."
}
```

**Why**: Trust signal for new users. Responsible AI best practice. Required for future Teams Store submission (O12).

#### 1.4 Add User Overrides

```json
{
  "user_overrides": {
    "capabilities": [
      { "name": "Email", "enabled_by_default": true },
      { "name": "TeamsMessages", "enabled_by_default": true },
      { "name": "Meetings", "enabled_by_default": true },
      { "name": "People", "enabled_by_default": true },
      { "name": "OneDriveAndSharePoint", "enabled_by_default": true },
      { "name": "WebSearch", "enabled_by_default": true }
    ]
  }
}
```

**Why**: Aligns with Alex's ethical framework — user sovereignty over data access. Users can disable any data source without losing the agent entirely.

**Instruction Update**: Add graceful degradation note to instructions:
> "If a user has disabled a capability, acknowledge this and suggest alternatives. Never pressure users to re-enable capabilities."

### Phase 1 Checklist

| Item | Change                                   | Lines      | Status | Roadmap |
| ---- | ---------------------------------------- | ---------- | ------ | ------- |
| 1.1  | People `include_related_content: true`   | 1 line     | ✅ Done | D8a     |
| 1.2  | `behavior_overrides` block               | 6 lines    | ✅ Done | D8b     |
| 1.3  | `disclaimer` string                      | 1 line     | ✅ Done | D8b     |
| 1.4  | `user_overrides` block                   | 10 lines   | ✅ Done | D8c     |
| 1.5  | Instruction update: graceful degradation | ~200 chars | ✅ Done | D8d     |
| 1.6  | Version bump manifest + agent            | 2 lines    | ✅ Done | D8e     |
| 1.7  | Test all 4 changes in Teams              | —          | ⬜      | —       |

**Estimated effort**: 1-2 hours
**Risk**: None — all features are GA in v1.6

---

## Phase 2: Cross-Platform Bridge (v5.1.0)

**Goal**: Connect M365 Alex to the broader Alex ecosystem via API plugins and optimize instruction architecture.

### 2.1 Instruction Budget Optimization (O7)

Reorganize the instruction layers to free ~2,500 characters:

**Current state**: Single 7,200-char `instructions` block containing everything.

**Target state**:

| Layer                                | Content                                                               | Size               |
| ------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| `instructions`                       | Identity, epistemic rules, protocol names, self-awareness             | ~4,700 chars (59%) |
| `special_instructions`               | File delivery rules, proactive triggers, capability-specific guidance | ~1,500 chars       |
| `knowledge/alex-protocols.md`        | Full protocol details (7 Graph protocols + cognitive protocols)       | Already exists     |
| `instructions/alex-system-prompt.md` | Supplementary system prompt                                           | Already exists     |

**What moves OUT of `instructions`**:

| Section                                         | Current Size | Destination                                      |
| ----------------------------------------------- | ------------ | ------------------------------------------------ |
| Graph-powered protocol details (steps/examples) | ~1,500 chars | `knowledge/alex-protocols.md` (already has them) |
| File delivery rules section                     | ~400 chars   | `special_instructions`                           |
| Proactive behavior trigger details              | ~600 chars   | `special_instructions`                           |

**What stays IN `instructions`** (high-priority context):
- Model awareness block
- Epistemic integrity rules
- Self-awareness protocols
- Learn-about-user flow
- First conversation behavior
- Protocol names & triggers (one-line each)
- Core identity

### 2.2 Global Knowledge API Plugin (O6)

Deploy a lightweight Azure Function that exposes the Global Knowledge repository:

**Architecture**:
```
M365 Alex → API Plugin → Azure Function → GitHub repo (Alex-Global-Knowledge)
```

**Endpoints**:

| Endpoint                  | Method | Description                                      |
| ------------------------- | ------ | ------------------------------------------------ |
| `/api/knowledge/search`   | GET    | Full-text search across patterns and insights    |
| `/api/knowledge/patterns` | GET    | List patterns, optionally filtered by category   |
| `/api/knowledge/insights` | GET    | List insights, optionally filtered by date range |
| `/api/knowledge/save`     | POST   | Save a new insight from M365 context             |

**Auth**: API key (stored in Azure Key Vault, registered in plugin auth config)

**Plugin Manifest** (`global-knowledge-plugin.json`):
```json
{
  "schema_version": "v2.4",
  "name_for_human": "Alex Global Knowledge",
  "description_for_human": "Search cross-project patterns and insights from Alex's global knowledge base",
  "description_for_model": "Use this plugin to search for reusable patterns (GK-*) and insights (GI-*) from the user's Alex Global Knowledge repository. Call searchKnowledge when the user asks about past learnings, patterns, or cross-project insights.",
  "auth": {
    "type": "ApiKeyPluginVault",
    "reference_id": "alex-gk-api-key"
  },
  "functions": [
    {
      "name": "searchKnowledge",
      "description": "Search patterns and insights by keyword",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "Search terms" },
          "type": { "type": "string", "enum": ["all", "patterns", "insights"] }
        },
        "required": ["query"]
      }
    },
    {
      "name": "saveInsight",
      "description": "Save a new learning or insight",
      "parameters": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "content": { "type": "string" },
          "category": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["title", "content"]
      }
    }
  ]
}
```

**Roadmap alignment**: This is a standalone feature that doesn't depend on B3 (MCP server). It can ship independently.

### 2.3 GitHub API Plugin (O5)

**Endpoints** (subset of GitHub API v3):

| Function           | GitHub Endpoint                             | Purpose               |
| ------------------ | ------------------------------------------- | --------------------- |
| `getIssue`         | `GET /repos/{owner}/{repo}/issues/{number}` | Look up issue details |
| `searchIssues`     | `GET /search/issues`                        | Search across repos   |
| `getPullRequest`   | `GET /repos/{owner}/{repo}/pulls/{number}`  | PR status and reviews |
| `getRecentCommits` | `GET /repos/{owner}/{repo}/commits`         | Recent activity       |

**Auth**: GitHub Personal Access Token (PAT) or GitHub App OAuth

**Use case**: Alex in M365 sees a Teams discussion about "the authentication bug" → searches GitHub → finds issue #234 → reports status and assigned person.

### 2.4 MCP Server Bridge (O4) — If B3 Ships

If roadmap item B3 (standalone MCP server) ships in v5.1.0, create a plugin manifest that wraps it:

**Plugin Manifest** (`alex-mcp-bridge.json`):
```json
{
  "schema_version": "v2.4",
  "name_for_human": "Alex Memory Bridge",
  "description_for_human": "Access your Alex cognitive architecture memory",
  "description_for_model": "Use this plugin when the user asks about their memory, learning goals, architecture health, or wants to save/retrieve knowledge across platforms.",
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "alex-mcp-oauth"
  },
  "functions": [
    { "name": "searchMemory", "description": "Search all Alex memory files" },
    { "name": "getArchitectureStatus", "description": "Check cognitive architecture health" },
    { "name": "getLearningGoals", "description": "Retrieve user's active learning goals" },
    { "name": "saveInsight", "description": "Save a cross-platform insight" }
  ]
}
```

This is the ultimate prize — **true cross-platform memory**.

### Phase 2 Checklist

| Item | Change                           | Effort  | Dependency            |
| ---- | -------------------------------- | ------- | --------------------- |
| 2.1  | Instruction reorganization       | Low     | None                  |
| 2.2  | Global Knowledge Azure Function  | Medium  | Azure sub             |
| 2.3  | GitHub API plugin                | Medium  | GitHub PAT            |
| 2.4  | MCP bridge plugin                | High    | B3 completion         |
| 2.5  | Additional conversation starters | Trivial | None                  |
| 2.6  | Adaptive Card response templates | Medium  | Plugin infrastructure |

**Estimated effort**: 2-4 weeks (2.2 + 2.3 most complex)

---

## Phase 3: Platform Maturity (v5.2.0+)

**Goal**: Leverage emerging M365 platform features as they reach GA.

### 3.1 EmbeddedKnowledge (When Available)

Bundle knowledge files directly in the app package, eliminating OneDrive dependency:

```json
{
  "capabilities": [
    {
      "name": "EmbeddedKnowledge",
      "items_by_path": [
        { "path": "knowledge/cognitive-architecture.txt" },
        { "path": "knowledge/alex-protocols.txt" },
        { "path": "knowledge/skill-quick-reference.txt" }
      ]
    }
  ]
}
```

**Conversion required**: `.md` → `.txt` (Markdown not in supported format list)

**Limits**: 10 files max, 1MB each. Alex's 3 knowledge files total ~20KB — well within limits.

**Impact**: Zero-dependency onboarding. New users get Alex with full knowledge without OneDrive setup.

### 3.2 Enterprise Scoping Templates (O9)

Create configuration templates for common enterprise scenarios:

| Template             | Scoped To                                             | Use Case                   |
| -------------------- | ----------------------------------------------------- | -------------------------- |
| **Alex Engineering** | Engineering channels, shared mailbox, SharePoint site | Dev team cognitive partner |
| **Alex Product**     | Product channels, feedback forms, product docs        | PM cognitive partner       |
| **Alex Exec**        | Leadership channels, board docs, exec calendar        | Executive briefing partner |

Each template is a separate `declarativeAgent.json` with the same identity and instructions but scoped capabilities. Could ship as a "template gallery" in documentation.

### 3.3 Connected Agents (When GA)

When `worker_agents` exits preview:

**Option A — Alex as Manager**:
Alex delegates specialized tasks to worker agents:
- "Research Agent" — intensive web search and summarization
- "Data Agent" — Dataverse/SQL queries for business data
- "Compliance Agent" — policy checking and audit support

**Option B — Alex as Worker**:
Enterprise Copilot delegates to Alex when users need:
- Personal cognitive assistance
- Learning goal tracking
- Meeting preparation
- Stakeholder relationship analysis

### 3.4 Microsoft Agent 365 Migration Assessment

Microsoft Agent 365 (early access preview) represents a potential platform shift. Monitor for:
- New agent definition format replacing declarative agent schema
- New capability model (may be richer than current 12-capability system)
- Agent hosting and distribution changes
- Pricing model implications

**Action**: Subscribe to [Microsoft Agent 365 updates](https://learn.microsoft.com/en-us/microsoft-agent-365/) and reassess at v5.3.0 milestone.

### Phase 3 Checklist

| Item | When                         | Dependency                  |
| ---- | ---------------------------- | --------------------------- |
| 3.1  | EmbeddedKnowledge reaches GA | Microsoft                   |
| 3.2  | After Phase 2 ships + demand | User feedback               |
| 3.3  | worker_agents exits preview  | Microsoft                   |
| 3.4  | Ongoing monitoring           | Microsoft Agent 365 roadmap |

---

## Roadmap Cross-Reference

| Enhancement Plan Item        | Roadmap Item                     | Track |
| ---------------------------- | -------------------------------- | ----- |
| 1.1 People enrichment        | New (M365-specific)              | D     |
| 1.2 Behavior overrides       | New (M365-specific)              | D     |
| 1.3 Disclaimer               | New (M365-specific)              | D     |
| 1.4 User overrides           | New (M365-specific)              | D     |
| 2.1 Instruction optimization | D3 (Knowledge file improvements) | D     |
| 2.2 Global Knowledge API     | D4 (Cross-platform memory sync)  | D     |
| 2.3 GitHub API plugin        | New (M365-specific)              | D     |
| 2.4 MCP bridge               | B3 (Standalone MCP server)       | B     |
| 3.1 EmbeddedKnowledge        | D7 (Agents Toolkit migration)    | D     |
| 3.2 Enterprise templates     | New — post-v5.1.0                | D     |
| 3.3 Connected agents         | New — post-v5.2.0                | D     |

### New Roadmap Items Proposed

These items are NOT currently in the unified roadmap and should be considered for addition:

| Proposed  | Description                                            | Phase  | Impact   |
| --------- | ------------------------------------------------------ | ------ | -------- |
| **D8a-e** | M365 Schema Polish — O1+O2+O3 quick wins (5 sub-items) | v5.0.2 | 🟡 Medium | 🔄 In Roadmap |
| **D9**    | Global Knowledge Azure Function — O6                   | v5.1.0 | 🔴 High   |
| **D10**   | GitHub API Plugin — O5                                 | v5.1.0 | 🟡 Medium |
| **D11**   | Enterprise Scoping Templates — O9                      | v5.2.0 | 🟡 Medium |

---

## Success Metrics

| Metric                    | Current | Phase 1 Target         | Phase 2 Target     |
| ------------------------- | ------- | ---------------------- | ------------------ |
| Capabilities used (of 17) | 8 (47%) | 12 (71%)               | 14 (82%)           |
| Instruction budget used   | 90%     | 85% (disclaimer added) | 59% (after reorg)  |
| Cross-platform memory     | ❌ None  | ❌ None                 | ✅ Via API plugin   |
| External data access      | ❌ None  | ❌ None                 | ✅ GitHub + GK      |
| User control over data    | ❌ None  | ✅ user_overrides       | ✅ Enhanced         |
| Trust signals             | ❌ None  | ✅ Disclaimer           | ✅ + RAI validation |

---

## Risk Register

| Risk                                        | Likelihood | Impact | Mitigation                                       |
| ------------------------------------------- | ---------- | ------ | ------------------------------------------------ |
| EmbeddedKnowledge delayed/cancelled         | Medium     | Medium | Continue using OneDrive-based knowledge          |
| worker_agents API changes in preview        | High       | Low    | Don't build on preview APIs                      |
| Instruction reorg degrades quality          | Low        | High   | A/B test with real conversations before shipping |
| API plugin auth complexity                  | Medium     | Medium | Start with API key, migrate to OAuth later       |
| M365 Agents SDK replaces declarative agents | Low        | High   | Monitor Microsoft roadmap, pivot if needed       |
| Rate limits on Azure Function               | Low        | Low    | Generous free tier covers personal use           |

---

## Next Steps

1. ~~**Now**: Review this plan. Approve Phase 1 items for v5.0.2.~~ ✅ Approved — items D8a-e added to unified roadmap
2. ~~**v5.0.2**: Apply the 5 schema changes (D8a-e). Test in Teams.~~ ✅ Complete — all 5 changes applied
3. **v5.1.0 planning**: Size the Global Knowledge Azure Function (O6) — smallest viable API surface.
4. **B3 watch**: When MCP server ships, immediately prototype the bridge plugin (O4).

---

*Enhancement plan February 7, 2026 — Alex Cognitive Architecture v5.0.1*
