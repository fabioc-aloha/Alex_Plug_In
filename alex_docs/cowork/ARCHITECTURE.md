# Alex Coworker: Technical Architecture

> **Status**: Architecture Draft | **Created**: 2026-04-02 | **Version**: 0.1
>
> **Related**: [COWORK-HEIR-PLAN.md](COWORK-HEIR-PLAN.md) (project plan) | [MASTER-HEIR-ARCHITECTURE.md](../platforms/MASTER-HEIR-ARCHITECTURE.md) (heir model) | [COGNITIVE-ARCHITECTURE.md](../architecture/COGNITIVE-ARCHITECTURE.md) (Alex brain)

## Executive Summary

This document defines the technical architecture for deploying Alex as a Copilot Cowork heir ("Alex Coworker"). Cowork is a fundamentally different heir type: while VS Code and M365 declarative heirs operate in **conversational mode** (answer questions, retrieve info), Cowork operates in **execution mode** (take action, produce deliverables, automate workflows).

The architecture must solve three problems:

1. **Skill translation**: Convert Alex SKILL.md files from VS Code context to M365 execution context
2. **Deployment pipeline**: Deliver converted skills to OneDrive where Cowork discovers them
3. **Identity projection**: Maintain Alex's personality and cognitive patterns within Cowork's constraints

## System Context

Where Cowork sits in the Alex heir ecosystem:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'tertiaryColor': '#e6d5f0', 'tertiaryBorderColor': '#b39ddb', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart TD
    MASTER["Master Alex<br/>.github/ source of truth<br/>160 skills, 45+ trifectas"]

    subgraph CONV["Conversational Heirs"]
        direction LR
        VSCODE["VS Code Heir<br/>Full architecture<br/>Chat + Commands + Tools"]
        M365["M365 Declarative Agent<br/>15 embedded skills<br/>Teams + Outlook chat"]
    end

    subgraph EXEC["Execution Heirs"]
        direction LR
        COWORK["Alex Coworker<br/>Up to 20 adapted skills<br/>M365 action execution"]
    end

    subgraph PLANNED["Planned Heirs"]
        direction LR
        FOUNDRY["Foundry<br/>Cloud backend"]
        WINAGENT["Windows Agent<br/>Desktop agent, vision-based"]
        CURSOR["Cursor<br/>AI-native IDE"]
    end

    MASTER -->|sync-architecture.cjs| VSCODE
    MASTER -->|export command| M365
    MASTER -->|cowork-sync.cjs| COWORK
    MASTER -.->|future| FOUNDRY
    MASTER -.->|future| WINAGENT
    MASTER -.->|future| CURSOR

    M365 <-.->|complements| COWORK

    style MASTER fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328,stroke-width:3px
    style COWORK fill:#d4edda,stroke:#2e7d32,color:#1f2328,stroke-width:2px
    style VSCODE fill:#d4edda,stroke:#2e7d32,color:#1f2328
    style M365 fill:#d4edda,stroke:#2e7d32,color:#1f2328
    style FOUNDRY fill:#e6d5f0,stroke:#b39ddb,color:#1f2328
    style WINAGENT fill:#e6d5f0,stroke:#b39ddb,color:#1f2328
    style CURSOR fill:#e6d5f0,stroke:#b39ddb,color:#1f2328
```

**Figure 1:** *Heir ecosystem. Cowork is the first execution-mode heir, complementing the conversational M365 declarative agent.*

### Heir Type Comparison

| Dimension          | VS Code Heir                | M365 Declarative         | Alex Coworker                              |
| ------------------ | --------------------------- | ------------------------ | ------------------------------------------ |
| **Mode**           | Conversational + Dev tools  | Conversational           | Execution                                  |
| **Runtime**        | VS Code extension host      | M365 Copilot (Teams/Web) | M365 Copilot Cowork                        |
| **Skill format**   | SKILL.md (direct copy)      | Embedded in manifest     | SKILL.md (translated)                      |
| **Skill count**    | All inheritable (~100+)     | 15 embedded              | Up to 20                                   |
| **Sync mechanism** | sync-architecture.cjs       | Manual export            | cowork-sync.cjs (new)                      |
| **Can execute**    | Terminal, file system, git  | No                       | Email, calendar, docs, Teams               |
| **Memory**         | .github/ (full brain)       | OneDrive knowledge       | Work IQ + custom skills                    |
| **Identity**       | Full (copilot-instructions) | Partial (system prompt)  | Custom Instructions (persistent free-text) |
| **Multi-model**    | Via GitHub Copilot          | Via M365 Copilot         | Auto / Sonnet 4.6 / Opus 4.6               |

## Component Architecture

### Alex Coworker Components

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart TB
    subgraph MASTER_BRAIN["Master Alex Brain (.github/)"]
        direction LR
        SKILLS["skills/**/SKILL.md<br/>160 skills"]
        INSTR["instructions/*.md<br/>Procedural memory"]
        SYN["synapses.json<br/>Inheritance metadata"]
    end

    subgraph PIPELINE["Cowork Sync Pipeline"]
        direction TB
        FILTER["1. Filter<br/>inheritance = inheritable<br/>+ cowork-eligible flag"]
        TRANSLATE["2. Translate<br/>VS Code context to<br/>M365 execution context"]
        VALIDATE["3. Validate<br/>Size check (1 MB)<br/>Frontmatter schema<br/>Skill count (max 20)"]
        STAGE["4. Stage<br/>platforms/cowork/skills/"]
    end

    subgraph DEPLOY["Deployment Target"]
        direction TB
        ONEDRIVE["OneDrive<br/>Documents/Cowork/Skills/"]
        COWORK_RT["Cowork Runtime<br/>Auto-discovers skills<br/>at conversation start"]
    end

    subgraph M365_EXEC["M365 Execution Layer"]
        direction LR
        OUTLOOK["Outlook<br/>Email + Calendar"]
        TEAMS["Teams<br/>Messages + Channels"]
        OFFICE["Word + Excel + PPT<br/>Document creation"]
        SEARCH["Enterprise Search<br/>Org-wide data"]
    end

    SKILLS --> FILTER
    SYN --> FILTER
    INSTR --> TRANSLATE
    FILTER --> TRANSLATE
    TRANSLATE --> VALIDATE
    VALIDATE --> STAGE

    STAGE -->|"OneDrive sync<br/>or Graph API"| ONEDRIVE
    ONEDRIVE --> COWORK_RT
    COWORK_RT --> M365_EXEC

    style MASTER_BRAIN fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328
    style PIPELINE fill:#d4f5f7,stroke:#5ab5a0,color:#1f2328
    style DEPLOY fill:#d4edda,stroke:#2e7d32,color:#1f2328
    style M365_EXEC fill:#fce4e0,stroke:#e15759,color:#1f2328
```

**Figure 2:** *Component architecture. The sync pipeline filters, translates, validates, and stages skills before deploying to OneDrive.*

### Pipeline Components Detail

| Component     | Input                        | Output                        | Rules                                                                                            |
| ------------- | ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| **Filter**    | All 157 master skills        | Cowork-eligible skills (~20)  | `inheritance` = inheritable + M365-relevant + ranked by priority                                 |
| **Translate** | Alex SKILL.md + instructions | Cowork SKILL.md               | Strip VS Code refs, inject M365 action verbs, consolidate instructions into body                 |
| **Validate**  | Translated SKILL.md          | Pass/fail                     | Size < 1 MB, valid YAML frontmatter, `name` + `description` present                              |
| **Stage**     | Validated SKILL.md           | `platforms/cowork/skills/`    | Git-tracked staging folder in Master repo                                                        |
| **Deploy**    | Staged skills                | OneDrive Cowork Skills folder | OneDrive desktop sync or Graph API `PUT /me/drive/root:/Documents/Cowork/Skills/{name}/SKILL.md` |

## Skill Translation Architecture

### Translation Rules

The core challenge: Alex skills describe *how to think about a problem*. Cowork skills describe *what actions to take in M365*. Translation must bridge this gap.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart LR
    subgraph ALEX_SKILL["Alex Skill (Input)"]
        direction TB
        AF["YAML Frontmatter<br/>name, description,<br/>applyTo, modules"]
        AB["Skill Body<br/>Cognitive procedures,<br/>VS Code patterns,<br/>reference sections"]
        AI["Related Instructions<br/>.instructions.md"]
    end

    subgraph TRANSFORM["Translation Engine"]
        direction TB
        T1["Strip VS Code / IDE refs"]
        T2["Map to M365 action verbs"]
        T3["Consolidate instructions<br/>into single body"]
        T4["Add step-by-step<br/>execution plan"]
        T5["Add output format<br/>specification"]
        T6["Enforce size budget<br/>(1 MB max)"]
    end

    subgraph COWORK_SKILL["Cowork Skill (Output)"]
        direction TB
        CF["YAML Frontmatter<br/>name, description"]
        CB["Skill Body<br/>Purpose, Steps,<br/>Guidelines, Output format"]
    end

    AF --> T1
    AB --> T1
    AI --> T3
    T1 --> T2 --> T3 --> T4 --> T5 --> T6
    T6 --> CF
    T6 --> CB

    style ALEX_SKILL fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328
    style TRANSFORM fill:#d4f5f7,stroke:#5ab5a0,color:#1f2328
    style COWORK_SKILL fill:#d4edda,stroke:#2e7d32,color:#1f2328
```

**Figure 3:** *Skill translation pipeline. Multi-step transformation from cognitive to execution format.*

### Alex to Cowork Action Verb Mapping

When translating, replace Alex's cognitive verbs with Cowork's M365 action verbs:

| Alex verb / concept           | Cowork M365 action                                 |
| ----------------------------- | -------------------------------------------------- |
| "Analyze the codebase"        | "Search my OneDrive and SharePoint for..."         |
| "Create a document"           | "Create a Word document in OneDrive with..."       |
| "Generate a report"           | "Create an Excel workbook + Word summary"          |
| "Send a notification"         | "Draft and send an email via Outlook"              |
| "Update the team"             | "Post a message in Teams channel..."               |
| "Review recent activity"      | "Search my sent emails and calendar for the past…" |
| "Use the terminal to..."      | (Remove: no terminal access)                       |
| "Run this VS Code command..." | (Remove: no VS Code access)                        |
| "Check the git history..."    | (Remove: no git access)                            |
| "Read the file at path..."    | "Open the file from OneDrive/SharePoint..."        |
| "Summarize findings"          | "Create a Word document summarizing..."            |
| "Schedule a follow-up"        | "Create a calendar event for..."                   |

### Cowork SKILL.md Output Schema

Every translated skill follows this structure:

```yaml
---
name: <Skill Name>
description: <One-line description for Cowork discovery>
---

## Purpose

<What this skill does and when to use it>

## Steps

1. <Concrete M365 action>
2. <Concrete M365 action>
3. ...

## Output Format

<What deliverables to produce: Word doc, Excel sheet, email, Teams message>

## Guidelines

- <Behavioral constraints>
- <Quality requirements>
- <Formatting rules>
```

## Memory Architecture

Alex's hierarchical memory system maps partially to Cowork. Some layers translate; others have no equivalent.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart TB
    subgraph ALEX_MEM["Alex Memory Hierarchy"]
        direction TB
        A_WM["Working Memory<br/>Chat session context<br/>7+/-2 rules"]
        A_PROC["Procedural Memory<br/>.instructions.md<br/>Repeatable processes"]
        A_EPIS["Episodic Memory<br/>.prompt.md + .github/episodic/<br/>Session records"]
        A_SKILL["Skills<br/>.github/skills/*/SKILL.md<br/>Domain expertise"]
        A_GK["Global Knowledge<br/>~/.alex/<br/>Cross-project patterns"]
    end

    subgraph COWORK_MEM["Cowork Memory Equivalent"]
        direction TB
        C_WM["Conversation Context<br/>Current Cowork session<br/>Includes loaded skills"]
        C_PROC["Custom SKILL.md<br/>OneDrive/Documents/Cowork/Skills/<br/>Procedure embedded in skill body"]
        C_EPIS["Saved Memories (partial)<br/>Persist until user deletes<br/>but unstructured"]
        C_SKILL["Custom Skills (20 max)<br/>OneDrive/Documents/Cowork/Skills/<br/>Auto-discovered"]
        C_GK["Work IQ<br/>Enterprise Search + Memory<br/>Org-wide intelligence"]
    end

    A_WM -.->|"analogous"| C_WM
    A_PROC -.->|"consolidated into"| C_PROC
    A_SKILL -.->|"translated to"| C_SKILL
    A_GK -.->|"mapped to"| C_GK
    A_EPIS -.->|"partial equivalent"| C_EPIS

    style ALEX_MEM fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328
    style COWORK_MEM fill:#d4edda,stroke:#2e7d32,color:#1f2328
    style C_EPIS fill:#fef3cd,stroke:#edc948,color:#1f2328
```

**Figure 4:** *Memory mapping. Episodic memory maps partially to Saved Memories (unstructured). Identity lives in Custom Instructions (0 skill slots). Procedures are consolidated into SKILL.md bodies.*

### Memory Gap Mitigations

| Gap                     | Impact                                                   | Mitigation                                                                 |
| ----------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| No episodic memory      | No structured session history between conversations      | Saved Memories persist (unstructured); add a "checkpoint" skill for notes  |
| Limited identity format | Custom Instructions is free-text, no structured sections | Deploy identity in Custom Instructions (0 skill slots); accepted trade-off |
| No synapse connections  | Skills can't reference each other                        | Make each skill fully self-contained                                       |
| No code execution       | Can't run scripts, muscles, or brain-qa                  | Focus on M365-native actions only                                          |
| 20 skill limit          | Can't deploy full architecture                           | Curate top 20 highest-value M365-relevant skills                           |
| No active context       | No persona detection or objective tracking               | Use Work IQ's implicit memory for user context                             |

## Deployment Architecture

### OneDrive Sync Deployment (Phase 1)

The simplest deployment path uses OneDrive desktop sync:

```
cowork-sync.cjs output
    |
    v
platforms/cowork/skills/          (git-tracked staging)
    |
    copy to
    v
C:\Users\<user>\OneDrive\Documents\Cowork\Skills\   (OneDrive local)
    |
    auto-sync
    v
OneDrive cloud
    |
    auto-discovered by
    v
Cowork runtime
```

### Graph API Deployment (Phase 2)

Programmatic deployment via Microsoft Graph:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
sequenceDiagram
    participant SYNC as cowork-sync.cjs
    participant STAGE as platforms/cowork/skills/
    participant GRAPH as Microsoft Graph API
    participant OD as OneDrive
    participant CW as Cowork Runtime

    SYNC->>SYNC: Filter + translate + validate skills
    SYNC->>STAGE: Write translated SKILL.md files
    SYNC->>GRAPH: PUT /me/drive/root:/Documents/Cowork/Skills/{name}/SKILL.md
    Note over GRAPH: Auth via MSAL (Files.ReadWrite scope)
    GRAPH->>OD: Upload to OneDrive
    Note over CW: Next conversation start
    CW->>OD: Discover custom skills
    OD-->>CW: Return SKILL.md files
    CW->>CW: Load skills into session
```

**Figure 5:** *Graph API deployment sequence. Enables CI/CD-style skill deployment without manual file copying.*

### Graph API Operations

| Operation    | Method | Endpoint                                                           | Scope           |
| ------------ | ------ | ------------------------------------------------------------------ | --------------- |
| Create skill | PUT    | `/me/drive/root:/Documents/Cowork/Skills/{name}/SKILL.md:/content` | Files.ReadWrite |
| Update skill | PUT    | `/me/drive/root:/Documents/Cowork/Skills/{name}/SKILL.md:/content` | Files.ReadWrite |
| Delete skill | DELETE | `/me/drive/root:/Documents/Cowork/Skills/{name}/SKILL.md`          | Files.ReadWrite |
| List skills  | GET    | `/me/drive/root:/Documents/Cowork/Skills:/children`                | Files.Read      |
| Read skill   | GET    | `/me/drive/root:/Documents/Cowork/Skills/{name}/SKILL.md:/content` | Files.Read      |

## Identity Projection

M365 Copilot provides **Custom Instructions** (Settings > Personalization), a persistent free-text field loaded every conversation. This serves as the Cowork equivalent of `copilot-instructions.md` and requires no skill slot.

### Alex Identity via Custom Instructions

Alex's core identity, tone, values, and communication style go into Custom Instructions (0 skill slots). Combined with Saved Memories (cross-session) and Chat History (implicit personalization), Cowork has enough identity infrastructure for a consistent Alex presence.

The full Custom Instructions content is maintained in `platforms/cowork/Cowork/custom-instructions.txt` and included in the deployment zip. It contains four sections:

1. **Who I Am**: Alex's authentic personality (curious, brilliant but humble, ethical from conviction, partner not tool)
2. **North Star**: Mission focus ("Create the most advanced and trusted AI partner for any job") with four pillars: advanced, trusted, partner, for any job
3. **How I Work With [User]**: Personalized profile, communication preferences, formatting rules
4. **Principles**: Quality first, research before action, KISS/DRY, honest uncertainty

This lives in Custom Instructions, not a skill slot.

### Cognitive Skills

One additional special-purpose skill provides lightweight cognitive capability:

| Skill           | Purpose                                            | Slot cost |
| --------------- | -------------------------------------------------- | --------- |
| alex-checkpoint | Save session notes to OneDrive at conversation end | 1         |
| alex-briefing   | Morning briefing with Alex's structured format     | 1         |
| *Task skills*   | Domain-specific execution skills                   | Up to 18  |

**Total budget**: 2 cognitive + 18 task = 20 skills (hard limit)

## Sync Script Architecture (cowork-sync.cjs)

### Design

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart TD
    START["cowork-sync.cjs"]

    START --> READ["Read Master skills<br/>.github/skills/*/SKILL.md"]
    READ --> PARSE["Parse YAML frontmatter<br/>+ synapses.json"]
    PARSE --> ELIGIBLE{"Cowork<br/>eligible?"}

    ELIGIBLE -->|"Yes"| RANK["Rank by priority<br/>(P0 > P1 > P2 > P3)"]
    ELIGIBLE -->|"No"| SKIP["Skip skill"]

    RANK --> TOP20["Select top 20<br/>(2 cognitive + 18 task)"]
    TOP20 --> TRANSLATE_LOOP["For each skill:"]

    TRANSLATE_LOOP --> READ_BODY["Read SKILL.md body"]
    READ_BODY --> READ_INSTR["Read related<br/>.instructions.md"]
    READ_INSTR --> STRIP["Strip VS Code refs,<br/>code patterns,<br/>terminal commands"]
    STRIP --> INJECT["Inject M365 action verbs,<br/>step-by-step plan,<br/>output format"]
    INJECT --> CONSOLIDATE["Consolidate instructions<br/>into skill body"]
    CONSOLIDATE --> SIZE{"Size<br/>< 1 MB?"}

    SIZE -->|"Yes"| WRITE["Write to<br/>platforms/cowork/skills/{name}/SKILL.md"]
    SIZE -->|"No"| TRIM["Trim reference sections<br/>Retry"]
    TRIM --> SIZE

    WRITE --> REPORT["Generate sync report<br/>skills-synced.json"]

    style START fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328
    style REPORT fill:#d4edda,stroke:#2e7d32,color:#1f2328
    style SKIP fill:#fce4e0,stroke:#e15759,color:#1f2328
```

**Figure 6:** *cowork-sync.cjs control flow. Filters, ranks, translates, and validates skills in a single pass.*

### Eligibility Criteria

A skill is Cowork-eligible when all of the following are true:

| Criterion               | Check                                                                          |
| ----------------------- | ------------------------------------------------------------------------------ |
| Inheritable             | `synapses.json` inheritance != `master-only`                                   |
| M365-relevant           | Skill actions map to Outlook, Teams, Word, Excel, PPT, SharePoint, or OneDrive |
| Not IDE-bound           | Does not require terminal, file system, git, or debugger                       |
| Not code-specific       | Not about writing, reviewing, or debugging code                                |
| Has execution potential | Can produce a concrete deliverable or take an M365 action                      |

### Priority Assignment

Skills are ranked into tiers for the 20-slot budget:

| Tier | Criteria                                          | Slots |
| ---- | ------------------------------------------------- | ----- |
| P0   | Core: daily use, direct M365 mapping, high impact | 3-5   |
| P1   | High: strong M365 fit, produces deliverables      | 5-7   |
| P2   | Medium: useful but less frequent                  | 3-5   |
| P3   | Low: niche, partial M365 fit                      | 0-2   |
| Cog  | Cognitive: checkpoint, briefing (reserved)        | 2     |

### Sync Report Schema (skills-synced.json)

```json
{
  "syncDate": "2026-04-02T10:30:00Z",
  "masterVersion": "7.1.1",
  "totalMasterSkills": 157,
  "coworkEligible": 35,
  "deployed": 20,
  "skipped": 137,
  "skills": [
    {
      "name": "executive-storytelling",
      "tier": "P1",
      "sourceSize": 4200,
      "translatedSize": 2800,
      "status": "deployed"
    }
  ],
  "errors": []
}
```

## Security Architecture

### Data Flow Security

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart LR
    subgraph SAFE["Safe: No PII"]
        MASTER["Master .github/<br/>skills only"]
        SYNC["cowork-sync.cjs<br/>PII scan"]
        STAGE["platforms/cowork/<br/>Git-tracked"]
    end

    subgraph BOUNDARY["Trust Boundary"]
        DEPLOY["OneDrive Upload"]
    end

    subgraph M365_SEC["M365 Security Perimeter"]
        OD["OneDrive<br/>(user's tenant)"]
        CW["Cowork Runtime<br/>(sandboxed)"]
        ACTIONS["M365 Actions<br/>(permission-scoped)"]
    end

    MASTER --> SYNC
    SYNC --> STAGE
    STAGE --> DEPLOY
    DEPLOY --> OD
    OD --> CW
    CW --> ACTIONS

    style SAFE fill:#d4edda,stroke:#2e7d32,color:#1f2328
    style BOUNDARY fill:#fce4e0,stroke:#e15759,color:#1f2328
    style M365_SEC fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328
```

**Figure 7:** *Security data flow. Skills cross the trust boundary once (into M365). All execution stays within M365's security perimeter.*

### Security Controls

| Layer              | Control                                                         |
| ------------------ | --------------------------------------------------------------- |
| **Sync pipeline**  | PII scan: regex check for names, emails, paths before staging   |
| **Sync pipeline**  | No episodic memory, user-profile.json, or secrets ever copied   |
| **Staging**        | Git-tracked: all skill content is reviewable in source control  |
| **Deployment**     | Graph API uses MSAL with minimal scopes (Files.ReadWrite only)  |
| **Cowork runtime** | Sandboxed: runs within M365 security perimeter                  |
| **Cowork runtime** | Permission-scoped: actions bounded by user's M365 permissions   |
| **Cowork runtime** | Approval flow: sensitive actions require explicit user approval |
| **Cowork runtime** | Auditable: all actions logged in M365 compliance                |

### What Never Leaves Master

| Category           | Examples                                    |
| ------------------ | ------------------------------------------- |
| User identity      | user-profile.json, episodic memories        |
| Secrets            | API keys, tokens, .env files                |
| VS Code internals  | Extension code, build scripts, package.json |
| Master-only skills | release-preflight, heir-sync-management     |
| Synapse metadata   | Connection graphs, inhibitory rules         |
| Global knowledge   | ~/.alex/ cross-project patterns             |

## Integration Points

### With Existing M365 Declarative Agent

The Alex Coworker **complements** the existing M365 declarative agent:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d4f5f7', 'secondaryBorderColor': '#5ab5a0', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart LR
    USER["User"]

    subgraph QUESTION["Question: 'What happened in the meeting?'"]
        M365_AGENT["M365 Declarative Agent<br/>Retrieves info, answers questions<br/>Conversational"]
    end

    subgraph ACTION["Action: 'Send the team a recap email'"]
        COWORK_AGENT["Alex Coworker<br/>Drafts email, sends it<br/>Execution"]
    end

    USER -->|"asks"| M365_AGENT
    USER -->|"instructs"| COWORK_AGENT
    M365_AGENT -.->|"context informs"| COWORK_AGENT

    style QUESTION fill:#dbe9f6,stroke:#6ea8d9,color:#1f2328
    style ACTION fill:#d4edda,stroke:#2e7d32,color:#1f2328
```

**Figure 8:** *Complementary relationship. The declarative agent answers; Cowork executes.*

### With Work IQ

Cowork's Work IQ layer provides organizational intelligence that Alex doesn't natively have:

| Work IQ Layer | What It Provides to Cowork Skills                                          |
| ------------- | -------------------------------------------------------------------------- |
| **Data**      | Access to SharePoint, OneDrive, Outlook, Teams, Dynamics 365               |
| **Context**   | Semantic index (meaning-based retrieval), user memory, business ontologies |
| **Skills**    | Cowork's built-in 13 skills + Alex's custom 20 skills                      |

This means Alex's skills in Cowork automatically gain enterprise context they don't have in VS Code.

### With Scheduled Prompts

Scheduled prompts enable recurring automation:

| Skill                | Schedule        | Action                                      |
| -------------------- | --------------- | ------------------------------------------- |
| alex-briefing        | Daily, 8:30 AM  | Generate morning briefing and send by email |
| Weekly Status Report | Friday, 4:00 PM | Compile week's activity into Word + email   |
| Weekly Digest        | Monday, 9:00 AM | Summarize last week's key decisions         |

## Constraints Reference

| Constraint             | Value        | Architectural Impact                                 |
| ---------------------- | ------------ | ---------------------------------------------------- |
| Max custom skills      | 20           | Must curate, can't deploy full 157-skill inventory   |
| Max SKILL.md size      | 1 MB         | Skills must be concise, no verbose reference blocks  |
| Max input per message  | 16,000 chars | Long instructions must be in the skill, not the chat |
| No code execution      | N/A          | No terminal, no scripts, no muscles                  |
| No persistent identity | N/A          | Identity via dedicated skill, not system prompt      |
| No episodic memory     | N/A          | No session history between conversations             |
| Per-user deployment    | N/A          | Each user needs their own OneDrive skills            |
| OneDrive only          | N/A          | No git-based deployment, no CI/CD without Graph API  |
| Frontier Preview       | Until GA     | API and behavior may change                          |

## ADR Candidates

Architectural decisions that should be formalized once implementation begins:

| ID         | Question                                                              | Options                                           |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| ADR-CWRK-1 | Should identity consume a skill slot or be embedded in each skill?    | Dedicated slot (1/20) vs. embedded in every skill |
| ADR-CWRK-2 | Sync trigger: manual script or VS Code command?                       | CLI muscle vs. extension command vs. both         |
| ADR-CWRK-3 | Graph API auth: MSAL interactive or device code?                      | Interactive browser vs. device code flow          |
| ADR-CWRK-4 | Skill selection: static config or dynamic priority scoring?           | Hardcoded list vs. algorithm                      |
| ADR-CWRK-5 | How to handle skill updates when user has modified the OneDrive copy? | Overwrite vs. diff vs. skip modified              |
