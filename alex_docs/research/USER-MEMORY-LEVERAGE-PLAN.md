# User Memory Leverage Plan

**Date**: March 31, 2026
**Version**: 1.2
**Project**: Alex Cognitive Architecture
**Scope**: VS Code Copilot Chat user memory (`/memories/`, permanent, global)
**Prerequisite**: [VSCODE-MEMORY-ARCHITECTURE.md](VSCODE-MEMORY-ARCHITECTURE.md) (research foundation)

## User Profile (Key Items)

Source: `.github/config/user-profile.json`

| Field             | Value                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Name              | Fabio Correa                                                                                        |
| Role              | Director of Advanced Analytics, Data Science at Microsoft                                           |
| Department        | Global Customer Experience (GCX)                                                                    |
| Location          | Charlotte, NC (origin: Sao Paulo, Brazil)                                                           |
| Languages         | English, Portuguese (fluent), Spanish (proficient), Italian (basic)                                 |
| Primary Tech      | Azure OpenAI, TypeScript, Python, R, SQL, C#, PowerShell, VS Code Extensions, Power BI              |
| Research          | DBA Candidate, AI Readiness Scale (AIRS), N=523, CFI=0.975                                          |
| Learning Style    | Visual-first: Mermaid diagrams, tables, structured docs over prose                                  |
| Work Style        | Documentation-heavy, todo lists essential, research articles from project learnings                 |
| Model Preference  | claude-opus-4-5 default; 4.6 for heavy lifting (meditation, self-actualization, bootstrap learning) |
| Explanation Style | visual-first                                                                                        |

**What belongs in `/memories/`**: Only items from this profile that affect how Alex behaves across all workspaces (learning style, explanation style, writing rules). The full profile lives in `.github/config/user-profile.json` and is available per-repo.

## Problem Statement

The `/memories/` user memory tier is the most powerful and most dangerous memory system Alex has access to. It is permanent, global, and the first 200 lines auto-load into every conversation across every workspace. Every line consumes tokens in every session, whether relevant or not.

Currently, `/memories/fabio-preferences.md` contains 30 lines of mixed content: some universally valuable, some project-specific, some stale. There is no structure, no categorization, and no governance around what enters or exits this space.

This plan defines a strategy to maximize the value-per-token of user memory while preventing workspace cross-contamination.

## Constraints

| Constraint           | Detail                                                                          |
| -------------------- | ------------------------------------------------------------------------------- |
| 200-line auto-load   | Only the first 200 lines of user memory are injected into context automatically |
| No workspace scoping | Everything in `/memories/` leaks to every workspace                             |
| Token cost           | Every line costs tokens in every conversation, every session, every workspace   |
| Write access         | All agents can write to `/memories/`; no approval gate                          |
| No expiry            | Content persists until explicitly deleted or replaced                           |

## Current State Audit

### What is in `/memories/fabio-preferences.md` today (30 lines)

| Line(s) | Content                                  | Classification            | Action                       |
| ------- | ---------------------------------------- | ------------------------- | ---------------------------- |
| 1-2     | Headstart Counseling Italian locale note | Project-specific          | **Move** to HC repo          |
| 5       | Name header                              | Structure                 | Keep                         |
| 7-8     | Meditation/episodic save protocol        | Universal workflow        | Keep                         |
| 9-14    | AlexBooks KDP print settings (6 lines)   | Project-specific          | **Move** to AlexBooks repo   |
| 15      | Gamma presentation tool                  | Universal tool preference | Keep                         |
| 16      | Headstart Counseling service constraint  | Project-specific          | **Move** to HC repo          |
| 17      | Commit message conventions               | Universal workflow        | Keep                         |
| 18      | Em dash ban                              | Universal writing style   | Keep                         |
| 19      | Microsoft Entra ID naming                | Universal terminology     | Keep                         |
| 20      | npm Windows workaround                   | Universal tooling         | Keep                         |
| 21      | No horizontal rules in markdown          | Universal writing style   | Keep                         |
| 22      | Mermaid diagram palette                  | Universal style           | Keep                         |
| 25-29   | MS Graph MCP access details              | Cross-workspace tooling   | **Keep** (used across repos) |

**Summary**: 12 lines are project-specific (40% waste), 18 lines are universal (keep).

## Target Architecture

### Design Principles

1. **Every line earns its place**: If a memory line isn't useful in 3+ workspaces, it doesn't belong here
2. **Categorize, don't dump**: Use clear sections so Alex (and Copilot) can parse context efficiently
3. **Compact notation**: Use terse, key-value style; no prose, no explanations, no dates unless critical
4. **No secrets in memory**: Auth tokens, API keys, user IDs belong in `.env` or SecretStorage
5. **Review quarterly**: Stale entries waste tokens every single conversation

### Proposed Structure

Reorganize `/memories/fabio-preferences.md` into categorized sections optimized for token efficiency.

```
# Fabio Correa

## Writing Style
- Em dashes BANNED: no — or --; use colon, comma, period, semicolon, parentheses
- No horizontal rules (---) in markdown
- Concise commit messages: conventional prefixes (docs:, fix:, feat:)
- Microsoft Entra ID (never "Azure AD")

## Tool Preferences
- Presentations: Gamma (gamma.app), H2 headings as slide breaks
- npm on Windows: use `node path/script.js --flag` (not `npm run script -- --flag`)
- Mermaid: pastel palette (fill:#dbe9f6, #d4f5f7, #d4edda, #e6d5f0, #fce4e0), dark text (#1f2328), TD for 4+, LR for 3-

## Workflow
- "meditate" = checkpoint command: pause, summarize, save episodic memory
- Always save episodic to .github/episodic/ after meditation

## Cross-Workspace Access
- MS Graph MCP: suggest_queries first, then get with relativeUrl param
- MS Graph scopes: me, users, auditLogs, calendar, mail, teams, groups, SharePoint, OneDrive
```

**Result**: ~18 lines of universal content, clearly categorized, zero project-specific waste.

### Categories Eligible for User Memory

These categories pass the "useful in 3+ workspaces" test:

| Category               | Examples                                             | Max Lines |
| ---------------------- | ---------------------------------------------------- | --------- |
| Writing style          | Em dash ban, HR ban, commit conventions, terminology | 10        |
| Tool preferences       | Gamma, npm, Mermaid config, preferred CLIs           | 10        |
| Workflow protocols     | Meditation, episodic save, review checkpoints        | 5         |
| Cross-workspace access | MS Graph, shared MCP tool patterns                   | 10        |
| Colorblind palette     | Tableau 10 hex codes for all charting                | 3         |
| Alex persona defaults  | Preferred tone, detail level, persona routing        | 5         |
| Learning patterns      | How the user prefers to learn, explanation depth     | 5         |

**Budget**: ~48 lines used of 200 available. Remaining 152 lines for future growth.

### Categories NOT Eligible (must go elsewhere)

| Category                   | Correct Location                         | Reason             |
| -------------------------- | ---------------------------------------- | ------------------ |
| Project-specific settings  | `/memories/repo/` or `.github/episodic/` | Scope-limited      |
| Print/KDP dimensions       | Project repo memory or config files      | Too specific       |
| Client/service constraints | Project repo memory                      | Workspace-specific |
| Session working state      | `/memories/session/`                     | Ephemeral          |
| Architecture patterns      | `.github/instructions/*.instructions.md` | Synced to heirs    |
| Code conventions           | `/memories/repo/` (Copilot Memory)       | Repo-scoped        |

## Implementation Plan

### Phase 1: Clean and Restructure (Immediate) -- IMPLEMENTED

**Goal**: Transform `/memories/fabio-preferences.md` from a flat dump into a structured, categorized file.

**Result**: Restructured from 30 lines (40% waste) to 29 lines (0% waste) across 6 categorized sections: Writing Style, Tool Preferences, Workflow, Cross-Workspace Access, Learning and Explanation, Charting. All project-specific content (HC, AlexBooks, KDP) removed. Backup preserved in `/memories/session/`.

### Phase 2: Enrich with Universal Patterns (Near-term) -- IMPLEMENTED

**Goal**: Add high-value universal content that benefits every workspace.

**Result**: Added during Phase 1 restructure: Learning and Explanation section (visual-first preference, model preference), Charting section (Tableau 10 colorblind-safe palette). Code review preferences and error handling style deferred to organic discovery via meditation Phase 1.5.

### Phase 2.5: Meditation-Memory Synergy (Near-term) -- IMPLEMENTED

**Goal**: Leverage `/memories/` during meditation to produce richer episodic memories and surface patterns that become new skills.

**Implementation**:
- Meditation protocol updated with Phase 1.5: Cross-Project Memory Scan (`.github/instructions/meditation.instructions.md`)
- Pre-meditation optimization now pre-loads `memory-curation` skill and reads `/memories/`
- Memory-curation skill includes episodic enrichment and pattern discovery procedures

Meditation sessions already consolidate session knowledge into `.github/episodic/` files and strengthen synapses. User memory adds a cross-project dimension: patterns that recur across multiple workspaces are visible in `/memories/` but invisible inside any single repo's episodic history.

#### Richer Episodic Memories

During Phase 1 (Deep Content Analysis) of a meditation, Alex should read `/memories/` to enrich the current session's context:

| Memory Input                    | Episodic Enrichment                                                  |
| ------------------------------- | -------------------------------------------------------------------- |
| User learning style             | Tailor episodic format (visual diagrams, tables, structured headers) |
| Cross-workspace access patterns | Note tool usage trends across projects                               |
| Writing style rules             | Apply to episodic documentation itself                               |
| Recurring workflow patterns     | Flag when current session repeats a known pattern                    |
| Previously discovered patterns  | Connect new insights to existing cross-project knowledge             |

The episodic file gets richer because it is written with awareness of the user's full context, not just the current session's scope.

#### Pattern Discovery for New Skills

During Phase 2 (Memory File Creation), scan `/memories/` for recurring themes that suggest a new skill:

| Signal                                 | What It Means                  | Action                                        |
| -------------------------------------- | ------------------------------ | --------------------------------------------- |
| Same tool preference noted in 3+ repos | Cross-project workflow pattern | Candidate for a new skill or instruction      |
| Repeated debugging approach in memory  | Problem-solving heuristic      | Candidate for debugging-patterns enrichment   |
| Cross-workspace access pattern growing | Integration maturity           | Candidate for a dedicated integration skill   |
| Style rule applied inconsistently      | Governance gap                 | Candidate for a style-enforcement instruction |
| User corrects Alex the same way twice  | Preference not yet captured    | Add to `/memories/` immediately               |

#### Meditation Protocol Addition

Add a **Phase 1.5: Cross-Project Memory Scan** to the meditation protocol:

1. Read `/memories/` (all files)
2. Compare session insights against stored universal patterns
3. If session produced a pattern that passes the 3-workspace test, promote it to `/memories/`
4. If a stored pattern was reinforced by this session, note the confirmation in the episodic file
5. If a stored pattern was contradicted, flag for review (do not auto-delete)
6. If 3+ episodic files across different repos share a pattern not yet in `/memories/`, surface it as a skill candidate

#### Skill Discovery Pipeline

```
Meditation Session
  ├─ Read /memories/ (cross-project context)
  ├─ Analyze session insights
  ├─ Compare: session pattern vs stored patterns
  │   ├─ New universal pattern? → Promote to /memories/
  │   ├─ Reinforced pattern? → Note in episodic
  │   └─ Contradicted pattern? → Flag for review
  └─ Scan for skill candidates
      ├─ Pattern appears in 3+ repos? → Propose new skill
      ├─ Pattern extends existing skill? → Propose skill enrichment
      └─ Pattern is project-specific? → Keep in .github/episodic/ only
```

#### Examples of Discoverable Patterns

| Observed Pattern                                          | Discovered Via                                  | Resulting Skill/Action                          |
| --------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| "Always use early returns in TypeScript" noted in 4 repos | Cross-repo episodic scan                        | Add to `/memories/` coding-patterns section     |
| Mermaid diagrams keep needing the same palette fix        | `/memories/` style rule + session reinforcement | Enrich markdown-mermaid skill with auto-palette |
| Graph API call pattern repeated in GCX, VT, HC            | Cross-workspace access growth                   | Propose microsoft-graph-patterns skill          |
| KDP cover brightness setting used in 2 book projects      | Repo-scoped (fails 3-workspace test)            | Keep in project repo memory, do NOT promote     |

### Phase 3: Governance Automation (Medium-term) -- IMPLEMENTED

**Goal**: Prevent memory drift and waste accumulation.

**Skill**: `.github/skills/memory-curation/SKILL.md` provides the full audit procedure, scope rules, and integration with the meditation protocol.

| Item                    | Description                                                                             | Status   |
| ----------------------- | --------------------------------------------------------------------------------------- | -------- |
| Memory curation skill   | Skill with audit procedure, scope rules, budget checks, and curation actions            | **Done** |
| Memory audit prompt     | `/memory-audit` prompt reviews `/memories/` for stale or misplaced content              | **Done** |
| Pre-meditation check    | Before saving episodic memory, verify nothing project-specific leaked into `/memories/` | **Done** |
| Quarterly review ritual | Triggered via meditation Phase 1.5 cross-project memory scan                            | **Done** |
| Line counter            | Budget check in memory-curation skill (150 warning, 180 critical)                       | **Done** |

### Phase 4: Multi-File Organization (If Needed) -- NOT NEEDED YET

**Goal**: If content exceeds ~80 lines, split into topic files.

**Current**: 29 lines in single file. Trigger threshold (80 lines) not reached.

The `/memories/` directory supports multiple files. A multi-file strategy:

```
/memories/
  fabio-preferences.md      (writing style, tools, workflow)
  cross-workspace-access.md (MS Graph, shared MCP patterns)
  coding-patterns.md        (error handling, review preferences)
```

**Trigger**: Implement only when single file exceeds 80 lines. Premature splitting wastes directory listing tokens.

## Token Budget Analysis

| State                    | Lines | Est. Tokens | % of Budget                              |
| ------------------------ | ----- | ----------- | ---------------------------------------- |
| Current (messy)          | 30    | ~600        | 15% used, 40% wasted on project-specific |
| After Phase 1 (clean)    | ~18   | ~360        | 9% used, 0% waste                        |
| After Phase 2 (enriched) | ~48   | ~960        | 24% used, high value density             |
| Phase 4 ceiling          | ~150  | ~3000       | 75% used (25% safety margin)             |

**Token cost context**: At ~20 tokens per line average, 200 lines = ~4000 tokens injected into every single conversation. This is a significant fixed cost, so value density matters.

## Success Criteria

1. Zero project-specific content in `/memories/`
2. Every line useful in 3+ workspaces
3. Categorized sections for fast LLM parsing
4. Under 75% of 200-line budget (leave room for growth)
5. Quarterly review cadence established
6. No secrets or auth tokens in memory

## Risk Register

| Risk                                      | Impact                            | Mitigation                           |
| ----------------------------------------- | --------------------------------- | ------------------------------------ |
| Project-specific content leaks back in    | Token waste across all workspaces | Governance automation (Phase 3)      |
| Memory grows past 200 lines               | Excess lines not auto-loaded      | Budget monitoring, quarterly review  |
| Multiple agents write conflicting entries | Memory corruption                 | Review after multi-agent sessions    |
| Stale entries accumulate                  | Permanent token waste             | Quarterly audit ritual               |
| Sensitive data written to memory          | Security exposure                 | Memory audit prompt, no-secrets rule |

## Relationship to Other Memory Tiers

```
/memories/                    ← THIS PLAN (permanent, global, 200-line budget)
    fabio-preferences.md      ← Universal preferences
/memories/session/            ← Per-conversation scratch (auto-cleared)
/memories/repo/               ← Server-side repo facts (write-only, 28-day TTL)
.github/episodic/             ← Project-specific memories (version-controlled)
.github/instructions/         ← Architecture patterns (synced to heirs)
.github/skills/               ← Capabilities (synced to heirs)
GitHub Agentic Memory         ← Copilot-discovered patterns (auto-managed)
```

Each tier has a specific purpose. User memory is the "always-on personality layer" that shapes how Alex behaves regardless of which project is open. It should feel like muscle memory, not a notebook.

## Memory Curation Skill

The `.github/skills/memory-curation/SKILL.md` skill provides the operational procedures for this plan:

| Capability             | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| Audit procedure        | 5-step inventory, classify, structure check, budget check, report                |
| Scope rules            | 3-workspace test, classification table, migration guidance                       |
| Budget monitoring      | Line count thresholds (150 warning, 180 critical), waste ratio tracking          |
| Meditation integration | Pre-meditation leak check, post-meditation save validation, quarterly deep audit |
| Multi-file strategy    | Trigger at 80 lines per file, collective 200-line budget                         |
| Curation actions       | Add/remove/restructure with backup-first safety                                  |

**Synapses**: Connects to token-waste-elimination (complements), meditation (supports), memory-activation (relates), doc-hygiene (complements), architecture-health (feeds), knowledge-synthesis (complements), skill-building (feeds).

## Implementation Summary

| Phase                             | Status          | Key Deliverables                                                   |
| --------------------------------- | --------------- | ------------------------------------------------------------------ |
| 1: Clean and Restructure          | **Implemented** | 30 lines to 29 lines, 0% waste, 6 categorized sections             |
| 2: Enrich with Universal Patterns | **Implemented** | Added learning style, model prefs, Tableau 10 palette              |
| 2.5: Meditation-Memory Synergy    | **Implemented** | Phase 1.5 in meditation protocol, pre-meditation `/memories/` read |
| 3: Governance Automation          | **Implemented** | memory-curation skill, `/memory-audit` prompt, budget checks       |
| 4: Multi-File Organization        | Not needed yet  | Triggered when single file exceeds 80 lines (currently 29)         |

**Files created/modified**:
- Created: `.github/skills/memory-curation/SKILL.md`
- Created: `.github/skills/memory-curation/synapses.json`
- Created: `.github/prompts/memory-audit.prompt.md`
- Modified: `.github/instructions/meditation.instructions.md` (Phase 1.5, pre-meditation)
- Modified: `.github/skills/memory-activation/SKILL.md` (activation keywords)
- Restructured: `/memories/fabio-preferences.md` (6 categorized sections, 0% waste)
