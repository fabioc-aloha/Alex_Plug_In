# M365 Integration Opportunities — Alex Expansion Surface

> **10 concrete integration plays ranked by impact, effort, and readiness — the path from 47% to 85% capability coverage**

|                |                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **Author**     | Fabio Correa                                                                                         |
| **Date**       | February 7, 2026                                                                                     |
| **Depends On** | [M365-COPILOT-ECOSYSTEM-ANALYSIS.md](M365-COPILOT-ECOSYSTEM-ANALYSIS.md)                             |
| **Related**    | [M365-ENHANCEMENT-PLAN.md](M365-ENHANCEMENT-PLAN.md), [ROADMAP-UNIFIED.md](../../ROADMAP-UNIFIED.md) |

---

## Opportunities Checklist

| #   | Opportunity                                                             | Impact     | Effort  | Status        | Phase   |
| --- | ----------------------------------------------------------------------- | ---------- | ------- | ------------- | ------- |
| O1  | [Rich People Lookups](#o1-rich-people-lookups)                          | 🔴 High     | Trivial | ✅ Done        | v5.0.2  |
| O2  | [Behavioral Controls & Disclaimer](#o2-behavioral-controls--disclaimer) | 🟡 Medium   | Trivial | ✅ Done        | v5.0.2  |
| O3  | [User Capability Overrides](#o3-user-capability-overrides)              | 🟡 Medium   | Trivial | ✅ Done        | v5.0.2  |
| O4  | [MCP Server Bridge Plugin](#o4-mcp-server-bridge-plugin)                | 🔴 Critical | High    | Depends on B3 | v5.1.0  |
| O5  | [GitHub API Plugin](#o5-github-api-plugin)                              | 🟡 Medium   | Medium  | Ready         | v5.1.0  |
| O6  | [Global Knowledge API Plugin](#o6-global-knowledge-api-plugin)          | 🔴 High     | Medium  | Ready         | v5.1.0  |
| O7  | [Instruction Budget Optimization](#o7-instruction-budget-optimization)  | 🟡 Medium   | Low     | Ready         | v5.1.0  |
| O8  | [EmbeddedKnowledge Migration](#o8-embeddedknowledge-migration)          | 🔴 High     | Low     | ⛔ Blocked     | v5.2.0+ |
| O9  | [Enterprise Scoping Templates](#o9-enterprise-scoping-templates)        | 🟡 Medium   | Medium  | Ready         | v5.2.0  |
| O10 | [Connected Agents Architecture](#o10-connected-agents-architecture)     | 🔴 High     | High    | ⛔ Preview     | v5.3.0+ |

---

## O1: Rich People Lookups

**Gap**: G2 (People capability lacks `include_related_content`)

### Current State

When Alex looks up a person, it returns:
- Name, title, department, manager, location
- That's it — a directory card

Alex's `PERSON DEEP DIVE` protocol then chains multiple capability calls to gather context:
1. Query People for org info
2. Search Email for shared threads
3. Search Teams for message history
4. Check Meetings for shared calendar entries

This is **4 separate capability invocations** for something that could be one.

### With `include_related_content: true`

A single People lookup returns:
- Name, title, department, manager, location
- **Shared documents** (OneDrive/SharePoint files both users accessed)
- **Email threads** between the two users
- **Teams messages** between the two users
- Essentially: "the relationship between me and this person"

### Implementation

```json
{
  "name": "People",
  "include_related_content": true
}
```

One line change in `declarativeAgent.json`.

### Impact

- **Simplifies PERSON DEEP DIVE protocol** from 4 steps to 1-2
- **Richer results** — shared documents are included automatically
- **Faster responses** — fewer capability invocations
- **No instruction changes needed** — the protocol already describes what to look for, the capability now delivers it natively

### Effort: Trivial (1 line)
### Risk: None — additive, backward compatible
### Phase: v5.0.2 (patch)

---

## O2: Behavioral Controls & Disclaimer

**Gap**: G3 (no behavior_overrides or disclaimer)

### behavior_overrides

```json
{
  "behavior_overrides": {
    "suggestions": false,
    "discourage_model_knowledge": false,
    "special_instructions": "When responding about cognitive architecture concepts, prefer Alex's internal knowledge files over general model knowledge."
  }
}
```

| Property                     | Purpose                                                    | Alex Setting                                                   |
| ---------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| `suggestions`                | Show follow-up suggestions after responses                 | `false` — Alex's proactive behavior is already in instructions |
| `discourage_model_knowledge` | Prefer grounded sources over model knowledge               | `false` — Alex uses both (epistemic + generative modes)        |
| `special_instructions`       | Additional model-level guidance beyond inline instructions | Useful for overflow from 8K instruction limit                  |

**Key Insight**: `special_instructions` gives us **additional instruction space** beyond the 8,000 character limit of `instructions`. This directly addresses Gap G5 (instruction budget at 90%).

### disclaimer

```json
{
  "disclaimer": "Alex is a cognitive AI partner built by Fabio Correa. Alex uses your Microsoft 365 data (calendar, email, Teams, OneDrive) to provide personalized assistance. Alex does not store your data outside of your M365 environment."
}
```

This displays a one-time notice when a user first opens Alex. It:
- Sets expectations about data access
- Communicates the personal nature of Alex
- Aligns with responsible AI principles

### Impact
- **Trust signal** for new users
- **Extra instruction space** via `special_instructions`
- **Better UX** — suppressing suggestions keeps focus on Alex's own proactive protocols

### Effort: Trivial (10 lines of JSON)
### Risk: None
### Phase: v5.0.2 (patch)

---

## O3: User Capability Overrides

**Gap**: G4 (no user_overrides)

### What This Enables

Users can toggle capabilities on/off in the Alex experience:

```json
{
  "user_overrides": {
    "capabilities": [
      { "name": "Email", "enabled_by_default": true },
      { "name": "TeamsMessages", "enabled_by_default": true },
      { "name": "Meetings", "enabled_by_default": true },
      { "name": "People", "enabled_by_default": true },
      { "name": "OneDriveAndSharePoint", "enabled_by_default": true }
    ]
  }
}
```

### Why This Matters for Alex

Alex's worldview includes strong principles about consent and user sovereignty. Giving users explicit control over which data sources Alex can access is **directly aligned with Alex's ethical architecture**.

A user who wants Alex for coding help but doesn't want to share email can disable the Email capability without losing everything else.

### Impact
- **Ethical alignment** — user-controlled data access
- **Trust building** — transparency about which signals Alex uses
- **Privacy control** — enterprise users may need to limit scope

### Effort: Trivial (15 lines of JSON)
### Risk: Low — some protocols (Meeting Prep, Stakeholder Map) may fail gracefully if data is unavailable
### Phase: v5.0.2 (patch)

---

## O4: MCP Server Bridge Plugin

**Gap**: G6 (VS Code and M365 Alex are disconnected)

### The Vision

This is the **highest-value integration opportunity** and the one that transforms Alex from "two separate agents" to "one agent, two surfaces."

```
┌──────────────┐       API Plugin        ┌──────────────────────┐
│ M365 Copilot │ ──────────────────────→ │  Alex MCP Server     │
│   (Alex)     │ ← responses ──────────  │  (Azure Function or  │
│              │                          │   local server)      │
└──────────────┘                          └──────────┬───────────┘
                                                     │
                                          ┌──────────▼───────────┐
                                          │  Alex Global         │
                                          │  Knowledge Base      │
                                          │  ─────────────       │
                                          │  • 25 patterns       │
                                          │  • 166 insights      │
                                          │  • Synapses          │
                                          │  • Procedures        │
                                          └──────────────────────┘
```

### How It Works

1. **VS Code roadmap B3** ships a standalone Alex MCP server
2. Deploy it as an Azure Function (or Azure Container App)
3. Create an OpenAPI description of the MCP endpoints
4. Register it as an API plugin in `declarativeAgent.json`
5. M365 Alex can now call: `searchMemory`, `getGoals`, `saveInsight`, `getGlobalKnowledge`

### What M365 Alex Gains

| Function                       | Description                                             |
| ------------------------------ | ------------------------------------------------------- |
| `searchMemory(query)`          | Search all Alex memory files (procedural, episodic, DK) |
| `searchGlobalKnowledge(query)` | Search cross-project patterns and insights              |
| `saveInsight(content, tags)`   | Save a new GI-* insight from M365 context               |
| `getGoals()`                   | Retrieve user's learning goals                          |
| `getSynapseHealth()`           | Check architecture health                               |
| `promoteKnowledge(file)`       | Promote a project DK to global                          |

### Critical Dependencies

- **B3 (Standalone MCP server)** — Must ship first
- **Azure hosting** — MCP server needs a cloud endpoint
- **Authentication** — OAuth or API key (both supported by M365 plugins)
- **OpenAPI spec** — Must describe all MCP endpoints

### Impact: Cross-platform memory bridge — the #1 ask for Alex
### Effort: High (server deployment + OpenAPI spec + plugin manifest + auth)
### Risk: Medium — auth complexity, rate limits, latency
### Phase: v5.1.0 (tied to B3 in roadmap Track B)

---

## O5: GitHub API Plugin

**Gap**: No external data access from M365

### What This Enables

Alex in M365 Copilot could:
- Look up GitHub issues and PRs by repo
- Check build status
- Find recent commits
- Link M365 discussions to GitHub activity

### Implementation

Uses GitHub's REST API with a Personal Access Token (PAT) or GitHub App:

```json
{
  "actions": [
    {
      "id": "githubPlugin",
      "file": "github-plugin.json"
    }
  ]
}
```

With `github-plugin.json` wrapping the GitHub API v3 endpoints.

### Why This Matters

A common Alex workflow in M365:
> "What did we discuss about the login bug?"
> Alex finds: Teams thread about login issue → can look up GitHub issue #234 → shows PR #567 is in review

Without a GitHub plugin, Alex can find the Teams thread but **can't follow the thread into GitHub**.

### Impact: Closes the code-to-collaboration loop
### Effort: Medium (GitHub App OAuth + subset of API endpoints)
### Risk: Low — GitHub API is well-documented, rate limits are generous
### Phase: v5.1.0

---

## O6: Global Knowledge API Plugin

**Gap**: G6 + knowledge accessibility from M365

### What This Enables

A lightweight Azure Function that serves the Global Knowledge base:

```
/api/search?q=error+handling → returns matching GK-* and GI-* files
/api/insights?since=2026-02-01 → recent insights
/api/patterns?category=architecture → patterns by category
/api/save → POST new insight
```

### Why This Is Separate from O4

O4 (MCP bridge) is the full memory server — complex auth, many endpoints, depends on B3.

O6 is a **simpler, standalone Azure Function** that just exposes the Global Knowledge repo:
- Reads from `~/.alex/global-knowledge/` (or a synced GitHub repo)
- No MCP dependency
- Simple API key auth
- Could ship independently of B3

### Implementation Path

1. Create Azure Function (TypeScript)
2. Index `patterns/` and `insights/` into a simple search structure
3. Create OpenAPI spec
4. Register as API plugin in `declarativeAgent.json`

### Impact: M365 Alex gains access to all cross-project learnings
### Effort: Medium (Azure Function + OpenAPI + plugin manifest)
### Risk: Low — read-mostly API, simple data model
### Phase: v5.1.0

---

## O7: Instruction Budget Optimization

**Gap**: G5 (instructions at 90% of 8K limit)

### The Problem

Alex's inline `instructions` in `declarativeAgent.json` is ~7,200 characters. Adding new protocols, capabilities, or context squeezes a budget that's nearly full.

### The Solution: Multi-Layer Instruction Architecture

```
Layer 1: instructions (8K max)        → Core identity, epistemic rules, key protocols
Layer 2: special_instructions          → Overflow protocols, capability-specific rules
Layer 3: knowledge/ files              → Full protocol documentation
Layer 4: instructions/ file (prompt)   → Supplementary system prompt
Layer 5: EmbeddedKnowledge (future)    → Rich documentation files
```

### Concrete Moves

| Move | What                                | From → To                           | Chars Freed |
| ---- | ----------------------------------- | ----------------------------------- | ----------- |
| M1   | 7 Graph-powered protocols (details) | instructions → knowledge file       | ~1,500      |
| M2   | File delivery rules                 | instructions → special_instructions | ~400        |
| M3   | Proactive behavior triggers         | instructions → special_instructions | ~600        |

**Total freed**: ~2,500 characters (bringing usage from 90% → 59%)

### Risk

Instructions are the highest-priority context — the model reads them first. Knowledge files are secondary. Moving too much to knowledge files risks the model "forgetting" critical behaviors during complex conversations.

**Mitigation**: Keep identity, epistemic rules, and protocol *names* in instructions. Move protocol *details* and *examples* to knowledge files.

### Impact: Room for new capabilities without hitting the 8K wall
### Effort: Low (reorganize existing content)
### Risk: Medium — must test that moved content is still retrieved
### Phase: v5.1.0

---

## O8: EmbeddedKnowledge Migration

**Gap**: G7 (knowledge files require OneDrive)

### Current Pain Point

Alex's knowledge files (`cognitive-architecture.md`, `alex-protocols.md`, `skill-quick-reference.md`) are in the app package `knowledge/` directory but served through OneDrive. This means:

1. First-time users must have OneDrive configured
2. Knowledge availability depends on M365 licensing
3. File indexing can be slow

### EmbeddedKnowledge Promise

When GA, EmbeddedKnowledge allows bundling files directly in the app package:

```json
{
  "capabilities": [
    {
      "name": "EmbeddedKnowledge",
      "items_by_path": [
        { "path": "knowledge/cognitive-architecture.md" },
        { "path": "knowledge/alex-protocols.md" },
        { "path": "knowledge/skill-quick-reference.md" }
      ]
    }
  ]
}
```

**Critical Constraint**: Supported file types are `.doc(x)`, `.ppt(x)`, `.xls(x)`, `.txt`, `.pdf`. **No `.md` support**. Alex's knowledge files would need conversion to `.txt` or `.docx`.

### Impact: Zero-dependency knowledge access
### Effort: Low (convert files + add capability)
### Risk: Low — but `.md` → `.txt` conversion loses formatting
### Status: ⛔ **BLOCKED** — feature not yet available in production
### Phase: v5.2.0 (when EmbeddedKnowledge reaches GA)

---

## O9: Enterprise Scoping Templates

**Gap**: G9 (no SharePoint-scoped knowledge)

### Vision

Create pre-configured Alex variants for enterprise teams:

```
"Alex - Engineering"
├── Email scoped to: engineering@company.com shared mailbox
├── Teams scoped to: #engineering, #incidents, #deploys channels
├── OneDrive scoped to: Engineering SharePoint site
└── WebSearch scoped to: learn.microsoft.com, company-wiki.com

"Alex - Product"
├── Email scoped to: product@company.com shared mailbox
├── Teams scoped to: #product-updates, #feedback channels
├── OneDrive scoped to: Product SharePoint site
└── People with include_related_content: true
```

### Implementation

These aren't code changes — they're **configuration templates** that ship as separate `declarativeAgent.json` files with pre-scoped capabilities. The same core instructions, but bounded data access.

### Impact: Enterprise adoption pathway
### Effort: Medium (template design + documentation + testing)
### Risk: Low — uses existing scoping features
### Phase: v5.2.0

---

## O10: Connected Agents Architecture

**Gap**: G8 (no worker agents / agent-to-agent communication)

### Vision

Alex as an orchestrating agent that delegates to specialized workers:

```
┌─────────────────────────────────────┐
│            Alex (Manager)           │
│  ─────────────────────────────────  │
│  Identity, Memory, Protocols        │
│                                     │
│  worker_agents:                     │
│  ├─ "Research Agent" (web search)   │
│  ├─ "Code Agent" (code interpreter) │
│  └─ "Data Agent" (Dataverse/SQL)    │
└─────────────────────────────────────┘
```

Or Alex as a worker in enterprise systems:

```
┌─────────────────────────────────────┐
│     Enterprise Copilot (Manager)    │
│                                     │
│  worker_agents:                     │
│  ├─ "HR Agent"                      │
│  ├─ "Finance Agent"                 │
│  └─ "Alex" (cognitive partner)      │
└─────────────────────────────────────┘
```

### Status: ⛔ **Preview** — `worker_agents` is not production-ready
### Impact: Multi-agent orchestration — the future of agent ecosystems
### Effort: High (agent design + trust boundaries + testing)
### Risk: High — preview API may change
### Phase: v5.3.0+ (when worker_agents reaches GA)

---

## Integration Priority Matrix

```
                          HIGH IMPACT
                              │
                    O4 (MCP)  │  O1 (People)
                    O6 (GK)   │  O2 (Behavior)
                              │  O3 (Overrides)
          ────────────────────┼────────────────────
          HIGH EFFORT         │         LOW EFFORT
                              │
                    O10 (WA)  │  O7 (Budget)
                    O9 (Ent)  │  O8 (Embed)
                    O5 (GH)   │
                              │
                          LOW IMPACT
```

**Quick wins (bottom-right)**: O1, O2, O3 — trivial changes, ship in v5.0.2
**Strategic bets (top-left)**: O4, O6 — high effort, transformative value
**Watch list (bottom-left)**: O8, O10 — blocked by platform preview status

---

*Analysis performed February 7, 2026 — Alex Cognitive Architecture v5.0.1*
