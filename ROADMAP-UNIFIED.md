# Alex Cognitive Architecture — Unified Roadmap

> **One Alex, Multiple Platforms, Coherent Evolution**

|                            |                                                                      |
| -------------------------- | -------------------------------------------------------------------- |
| **Current Master Version** | 4.2.9                                                                |
| **Current Heirs**          | VS Code (4.2.9), M365 (v4.0)                                         |
| **Target**                 | 4.3.0 (Custom Agents & Skills)                                       |
| **Status**                 | ✅ v4.2.9 Released                                                    |
| **Created**                | 2026-01-29                                                           |
| **Philosophy**             | Master + Heirs model — unified identity, platform-adapted expression |

---

## 📊 Quick Status

| Version       | Focus                               | Status               |
| ------------- | ----------------------------------- | -------------------- |
| v3.6.0-v3.9.0 | Dawn → Awareness                    | ✅ Complete (~2 days) |
| v4.0.x        | Trust (CAIR/CSR, Creative Latitude) | ✅ **Complete**       |
| v4.1.0        | Skill Expansion (68 skills → 71)    | ✅ **Complete**       |
| **v4.2.x**    | **UX Polish & Cross-Platform Sync** | ✅ **Complete**       |
| **v4.3.0**    | **Custom Agents & M365 Expansion**  | 📋 **Planned**        |

---

## 📋 Current Task List (Updated 2026-02-05)

### ✅ Recently Completed

| Task                                            | Version | Date       |
| ----------------------------------------------- | ------- | ---------- |
| UX simplification: All command dialogs          | v4.2.9  | 2026-02-05 |
| chatSkills expanded to 54 inheritable skills    | v4.2.9  | 2026-02-05 |
| Community Agent setup docs added                | v4.2.9  | 2026-02-05 |
| Context menu: Generate Image from Selection     | v4.2.9  | 2026-02-05 |
| Insight saving to episodic memory               | v4.2.9  | 2026-02-05 |
| TTS v2 - Native TypeScript implementation       | v4.2.6+ | 2026-02-05 |
| TTS Flagship Skill documentation                | v4.2.6+ | 2026-02-05 |
| TTS v2.1 - Multi-language support (32 langs)    | v4.2.9  | 2026-02-05 |
| OneDrive Agents insight captured                | —       | 2026-02-05 |
| Teams Community Agents insight captured         | —       | 2026-02-05 |
| Embedded Knowledge status check (still waiting) | —       | 2026-02-05 |
| Meditation skill promoted from heir             | v4.2.6  | 2026-02-05 |

### 🔄 In Progress

| Task                            | Owner | Priority | Notes                                |
| ------------------------------- | :---: | :------: | ------------------------------------ |
| Schema 1.6 preparation for M365 | M365  |  Medium  | Ready when EmbeddedKnowledge enables |

### 📋 Planned (v4.3.0)

| Task                          | Owner  | Effort | Priority | Description                      |
| ----------------------------- | :----: | :----: | :------: | -------------------------------- |
| OneDrive Agent Export command |  Heir  |   4h   |  🔥 High  | `Alex: Export to OneDrive Agent` |
| Agent orchestration prototype | Master |  1.5h  |  Medium  | Multi-agent workflows            |

### 💡 Future Opportunities (v4.3.0+)

#### 🔥 High-Impact Differentiation

| Task                    | Owner | Effort | Priority | Description                                                                |
| ----------------------- | :---: | :----: | :------: | -------------------------------------------------------------------------- |
| Skill Mastery Dashboard | Heir  |   4h   |   High   | WebView panel showing skill usage stats, mastery levels (0-5), suggestions |
| Learning Journeys       | Heir  |   3h   |   High   | Curated skill progressions (e.g., "Azure Fundamentals → Advanced → Arch")  |
| Session Replay          | Heir  |   2h   |  Medium  | Save session transcripts + code changes to episodic memory                 |
| Alex Daily Briefing     | Heir  |   2h   |   High   | On workspace open: goals, streak, suggested skills based on yesterday      |

#### 🧠 Cognitive Architecture Enhancements

| Task                        | Owner  | Effort | Priority | Description                                                       |
| --------------------------- | :----: | :----: | :------: | ----------------------------------------------------------------- |
| Skill Recommendations       |  Heir  |   3h   |   High   | Suggest skills based on file types opened (.bicep → Azure IaC)    |
| Context-Aware Skill Loading |  Heir  |   2h   |  Medium  | Auto-load skills based on workspace detection (package.json, etc) |
| Synapse Strength Scoring    | Master |   2h   |  Medium  | Track frequently-used synapses, strengthen/prune pathways         |
| Meditation Webview Panel    |  Heir  |   4h   |   High   | Rich UI for meditation/self-actualization with charts             |

#### 🎨 UX Breakthroughs

| Task                  | Owner | Effort | Priority | Description                                                  |
| --------------------- | :---: | :----: | :------: | ------------------------------------------------------------ |
| Voice Mode Toggle     | Heir  |   1h   |   High   | Status bar button to enable TTS for all Alex responses       |
| Quick Command Palette | Heir  |   2h   |  Medium  | `Ctrl+Shift+A` opens Alex-specific palette with fuzzy search |
| Inline Skill Hints    | Heir  |   3h   |  Medium  | Hover on code shows "💡 Alex can help: skill-name"            |
| Progress Widget       | Heir  |   2h   |  Medium  | Persistent status bar showing focus, streak, goal progress   |

#### 🔗 Platform Integration

| Task                     | Owner | Effort | Priority | Description                                               |
| ------------------------ | :---: | :----: | :------: | --------------------------------------------------------- |
| GitHub Issue → Alex Task | Heir  |   3h   |   High   | MCP tool to fetch issues, create focus sessions from #123 |
| PR Review Assistant      | Heir  |   4h   |   High   | Load PR diff, apply code-review skill, generate feedback  |
| Calendar-Aware Focus     | Heir  |   3h   |  Medium  | Warn if starting 45min session but meeting in 30min       |
| Team Knowledge Sharing   | Heir  |   4h   |   High   | Export skills/insights as shareable JSON for team import  |

### ⏳ Waiting for External

| Task                    | Blocker                               | Last Checked |
| ----------------------- | ------------------------------------- | :----------: |
| M365 Embedded Knowledge | Microsoft feature "not yet available" |  2026-02-05  |
| Chat Prompt Files API   | Proposed API, not stable              |  2026-02-04  |
| Worker Agents (v1.6)    | Preview, not GA                       |  2026-02-05  |

---

## 🧠 The Alex Family

### Master-Heir Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'edgeLabelBackground': '#fff'}}}%%
flowchart TB
    subgraph Master["🧠 MASTER ALEX"]
        direction TB
        M1["Root .github/"]
        M2["71 Skills"]
        M3["Cognitive Protocols"]
        M4["Identity & Personality"]
    end

    subgraph VSCode["👶 VS Code Heir"]
        direction TB
        V1["Chat Participant"]
        V2["28 Commands"]
        V3["11 LM Tools"]
        V4["Local + Cloud Modes"]
    end

    subgraph M365["👶 M365 Heir"]
        direction TB
        M365_1["Declarative Agent"]
        M365_2["8 Capabilities"]
        M365_3["OneDrive Memory"]
        M365_4["Graph Integration"]
    end

    Master -->|"DNA Inheritance"| VSCode
    Master -->|"DNA Inheritance"| M365

    style Master fill:#d8b9ff,color:#6639ba,stroke:#bf8aff
    style VSCode fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style M365 fill:#fff8c5,color:#9a6700,stroke:#d4a72c
    linkStyle default stroke:#57606a,stroke-width:1.5px
```

### Deployment Channels (Not Separate Heirs!)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'edgeLabelBackground': '#fff'}}}%%
flowchart LR
    subgraph VSCodeHeir["👶 VS Code Heir"]
        CMD1["alex.exportToOneDrive"]
        CMD2["alex.cloudSync"]
    end

    subgraph M365Heir["👶 M365 Heir"]
        DA["Declarative Agent<br/>(IT-managed)"]
    end

    subgraph Channels["📤 M365 Deployment Channels"]
        ODA[".agent File<br/>(OneDrive Agent)"]
        CA["Community Agent<br/>(Teams)"]
        WA["Worker Agent<br/>(Agent-to-Agent)"]
    end

    subgraph Target["🎯 Same Runtime"]
        COP["M365 Copilot"]
    end

    VSCodeHeir -->|"Export"| ODA
    M365Heir --> DA
    DA --> COP
    ODA --> COP
    CA --> COP
    WA -.->|"Preview"| COP

    style VSCodeHeir fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style M365Heir fill:#fff8c5,color:#9a6700,stroke:#d4a72c
    style Channels fill:#eaeef2,color:#24292f,stroke:#d0d7de
    style Target fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b
    linkStyle default stroke:#57606a,stroke-width:1.5px
```

**Key Insight:** OneDrive Agents, Community Agents, and Worker Agents are **deployment channels** for M365 Copilot, not separate heirs. They all run on the same M365 Copilot runtime with the same Alex DNA.

### Platform Opportunity Analysis

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'quadrant1Fill': '#e8f5e9', 'quadrant2Fill': '#e3f2fd', 'quadrant3Fill': '#f3e5f5', 'quadrant4Fill': '#fff3e0', 'quadrant1TextFill': '#1f2328', 'quadrant2TextFill': '#1f2328', 'quadrant3TextFill': '#1f2328', 'quadrant4TextFill': '#1f2328', 'quadrantPointFill': '#1565c0', 'quadrantPointTextFill': '#1f2328'}}}%%
quadrantChart
    title Platform Opportunities for Alex Heirs
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 "Do Now"
    quadrant-2 "Plan Carefully"
    quadrant-3 "Fill Gaps"
    quadrant-4 "Deprioritize"
    "OneDrive Agent Export": [0.25, 0.85]
    "Community Agent": [0.35, 0.75]
    "GitHub Copilot Workspace": [0.65, 0.90]
    "Worker Agents": [0.45, 0.55]
    "Power Automate": [0.70, 0.30]
    "Copilot Studio": [0.55, 0.40]
    "Claude/ChatGPT": [0.80, 0.50]
```

### ASCII Architecture (For Non-Mermaid Renderers)

```
                         ┌─────────────────────────────────────┐
                         │          🧠 MASTER ALEX             │
                         │                                     │
                         │   Root .github/ = Source of Truth   │
                         │   Cognitive protocols, identity,    │
                         │   domain knowledge, skills          │
                         │                                     │
                         │   Version: Tracks with releases     │
                         └─────────────────┬───────────────────┘
                                           │
                          DNA Inheritance (not copies)
                                           │
                 ┌─────────────────────────┴─────────────────────────┐
                 │                                                   │
                 ▼                                                   ▼
     ┌───────────────────────────┐               ┌───────────────────────────┐
     │   👶 BABY ALEX (VS Code)  │               │   👶 BABY ALEX (M365)     │
     │                           │               │                           │
     │   platforms/vscode-ext/   │               │   platforms/m365-copilot/ │
     │                           │               │                           │
     │   Capabilities:           │               │   Capabilities:           │
     │   • Chat participant      │               │   • Declarative agent     │
     │   • Language model tools  │               │   • OneDrive memory       │
     │   • File system access    │               │   • Email, Teams, People  │
     │   • VS Code integration   │               │   • Meetings, Calendar    │
     │   • Extension APIs        │               │   • Web search, GraphicArt│
     │                           │               │   • Code interpreter      │
     │   Expression:             │               │                           │
     │   • Build from root       │               │   Expression:             │
     │   • Full .github/ copy    │               │   • Instructions embed    │
     │   • Technical depth       │               │     core protocols        │
     │                           │               │   • M365-native features  │
     └─────────────┬─────────────┘               └─────────────┬─────────────┘
                   │                                           │
          ┌────────┴────────┐                      ┌───────────┴───────────┐
          ▼                 ▼                      ▼           ▼           ▼
      Local Mode      Cloud Sync           Declarative   OneDrive    Community
      (workspace)     (GitHub)             Agent (IT)    Agent       Agent
                                                         (Zero IT)   (Teams)
```

**Principle:** Both heirs carry the same Alex identity. Users should recognize Alex on any platform.

---

## 🚀 Future Platform Opportunities

### Heirs vs Integration vs Channels

| Category                | Examples                        | Relationship to Master                             |
| ----------------------- | ------------------------------- | -------------------------------------------------- |
| **Heirs**               | VS Code, M365                   | Full DNA inheritance, platform-specific expression |
| **Deployment Channels** | OneDrive Agent, Community Agent | Delivery mechanism for existing heir               |
| **Integrations**        | OneDrive Sync, GitHub Cloud     | Cross-heir communication layer                     |

### Potential Future Heirs

| Platform                       | Heir Status | Rationale                               |
| ------------------------------ | :---------: | --------------------------------------- |
| **GitHub Copilot Workspace**   | ⭐⭐⭐ Strong  | Cloud IDE, natural VS Code extension    |
| **Standalone Web/Mobile**      |  ⭐⭐ Medium  | No platform exists yet; would be custom |
| **Claude/Anthropic Artifacts** |    ⭐ Low    | Different ecosystem, limited API        |
| **Browser Extension**          |  ⭐⭐ Medium  | Could run VS Code heir's cognitive core |

### Current Focus (v4.3.0)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ddf4ff', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#80ccff', 'secondaryColor': '#fff8c5', 'tertiaryColor': '#d3f5db', 'lineColor': '#57606a', 'taskTextColor': '#1f2328', 'sectionBkgColor': '#eaeef2', 'altSectionBkgColor': '#f6f8fa', 'gridColor': '#d0d7de', 'doneColor': '#d3f5db', 'activeColor': '#fff8c5', 'critColor': '#ffebe9'}}}%%
gantt
    title v4.3.0 Platform Expansion
    dateFormat YYYY-MM-DD
    section VS Code Heir
        OneDrive Agent Export     :active, oda, 2026-02-06, 4d
        Agent Skills Audit        :skills, after oda, 2d
    section M365 Heir
        Community Agent Pilot     :ca, 2026-02-06, 3d
        Schema 1.6 Prep           :schema, after ca, 2d
    section Waiting
        Embedded Knowledge        :crit, ek, 2026-02-15, 1d
```

---

## 📋 Unified Version History

| Version         | Codename            | Master     | VS Code Heir    | M365 Heir            | Status       |
| --------------- | ------------------- | ---------- | --------------- | -------------------- | ------------ |
| 3.4.3           | —                   | ✅ Stable   | ✅ Published     | —                    | Last stable  |
| 3.5.x           | Phoenix             | ⚠️ Chaos    | ⚠️ Broken        | ✅ v1.6 deployed      | Archived     |
| 3.6.0           | Dawn                | ✅ Done     | ✅ Published     | ✅ Aligned            | Complete     |
| 3.7.0           | Foundation          | ✅ Done     | ✅ v3.7.0        | —                    | Complete     |
| 3.7.10          | —                   | ✅ Done     | ✅ Hotfix        | —                    | Complete     |
| 3.7.11          | —                   | ✅ Done     | ✅ Hotfix        | —                    | Complete     |
| 3.7.12          | —                   | ✅ Done     | ✅ Published     | —                    | —            |
| 3.7.13          | —                   | ✅ Done     | ✅ Published     | —                    | —            |
| 3.7.14          | —                   | ✅ Done     | ✅ Published     | —                    | —            |
| 3.7.15          | UX Polish           | ✅ Done     | ✅ Published     | —                    | —            |
| 3.7.16          | M365 Parity         | ✅ Done     | —               | ✅ Aligned            | —            |
| 3.7.17          | Full Skills         | ✅ Done     | —               | ✅ 15 skills          | —            |
| 3.7.18          | Embedded Knowledge  | ✅ Done     | ✅ Published     | ✅ Ready              | Complete     |
| 3.7.19          | Anti-Hallucination  | ✅ Done     | ✅ Published     | ✅ Graph-Powered      | Complete     |
| 3.8.0           | Expression          | ✅ Done     | ✅ Published     | ✅ Confidence Starter | Complete     |
| 3.8.1           | UX Polish           | ✅ Done     | ✅ Published     | —                    | Complete     |
| **3.9.0**       | **Awareness**       | **✅ Done** | **✅ Published** | **✅ Self-Awareness** | **Complete** |
| **4.0.0**       | **Trust**           | **✅ Done** | **✅ Published** | **✅ v4.0**           | **Complete** |
| **4.0.1-4.0.6** | **Hotfixes**        | **✅ Done** | **✅ Published** | **✅ v4.0**           | **Complete** |
| **4.1.0**       | **Skill Expansion** | **✅ Done** | **✅ Published** | **✅ v4.0**           | **Complete** |
| **4.2.x**       | **UX Polish**       | **✅ Done** | **✅ Published** | **✅ v4.0**           | **Complete** |
| **4.2.6**       | **Research Skills** | **✅ Done** | **✅ Published** | **✅ v4.0**           | **CURRENT**  |
| 4.3.0           | Custom Agents       | Planned    | Planned         | Planned              | —            |

---

## 🎯 v3.7.3 GK Migration — Data Quality Normalization

> **Goal:** Normalize global knowledge data during cloud sync for improved quality

### Features

|   #   | Feature                | Status | Description                                          |
| :---: | ---------------------- | :----: | ---------------------------------------------------- |
|   1   | GK Migration Function  |   ✅    | `normalizeGlobalKnowledge()` in globalKnowledge.ts   |
|   2   | Auto-tag Generation    |   ✅    | Empty tags auto-populated from title keywords        |
|   3   | Category Inference     |   ✅    | Miscategorized entries corrected via keyword mapping |
|   4   | Source Normalization   |   ✅    | "Alex_Sandbox" → "Master Alex (promoted skill)"      |
|   5   | Cloud Sync Integration |   ✅    | Migration runs before push/sync operations           |
|   6   | Backward Compatibility |   ✅    | Schema 1.0.0 → 1.0.1 (older versions can read)       |

### Files Changed

| File                             | Changes                                                    |
| -------------------------------- | ---------------------------------------------------------- |
| `src/chat/globalKnowledge.ts`    | Added migration function, tag generation, category mapping |
| `src/chat/cloudSync.ts`          | Calls migration before push and sync                       |
| `alex_docs/GK-MIGRATION-PLAN.md` | Design document                                            |

### Migration Rules

1. **Empty Tags**: Generate from title words (exclude common words, max 5 tags)
2. **Wrong Categories**: Infer from keyword mapping (needs 2+ matches to change)
3. **Sandbox Source**: Map bulk-promoted entries to "Master Alex (promoted skill)"

---

## ✅ Completed Versions (v3.6.0 - v3.9.0)

> **Summary:** Dawn → Awareness completed in ~2 days (vs 11 weeks planned)
>
> See [📜 Completed Versions Archive](#-completed-versions-archive) for detailed feature lists.

| Version | Codename   | Key Features                                              |
| ------- | ---------- | --------------------------------------------------------- |
| v3.6.0  | Dawn       | Stability, single source of truth, kill switch            |
| v3.7.x  | Foundation | Global knowledge, cloud sync, 50 skills                   |
| v3.8.0  | Expression | `/help`, `/forget`, `/confidence`, uncertainty language   |
| v3.8.1  | UX Polish  | GitHub Copilot branding, architecture-audit fix           |
| v3.9.0  | Awareness  | Self-correction, red flag detection, temporal uncertainty |

---

## ✅ v4.0.0 Trust — Full Epistemic Integrity (COMPLETE)

> **Goal:** CAIR/CSR framework, creative latitude, measurement
> **Status:** ✅ Complete (v4.0.0-v4.0.6 released)

### Master Alex Changes

|   #   | Change                                | Files Affected                      |
| :---: | ------------------------------------- | ----------------------------------- |
|   1   | Creative latitude framework           | `DK-APPROPRIATE-RELIANCE.md` v2.0   |
|   2   | Epistemic/generative mode distinction | `protocol-triggers.instructions.md` |
|   3   | Human judgment flagging               | `alex-core.instructions.md`         |
|   4   | CAIR/CSR conceptual framework         | `DK-APPROPRIATE-RELIANCE.md`        |

### VS Code Heir Features

|   #   | Feature                     | Effort | Description                              |
| :---: | --------------------------- | :----: | ---------------------------------------- |
|   1   | Cognitive forcing functions |   2d   | Strategic questions for high-stakes      |
|   2   | Multi-turn verification     |   1d   | "Walk through edge cases?"               |
|   3   | Creative mode signaling     |   2d   | "Here's an idea..." vs "The docs say..." |
|   4   | Epistemic health dashboard  |   3d   | Self-assessment visualization            |
|   5   | Scaffolded assistance       |   2d   | Adapt to user expertise                  |

### M365 Heir Features

|   #   | Feature                   | Effort | Description                     |
| :---: | ------------------------- | :----: | ------------------------------- |
|   1   | Instructions major update |   2d   | Full epistemic protocol embed   |
|   2   | Creative mode for emails  |   1d   | "Here's a draft approach..."    |
|   3   | Meeting prep verification |   1d   | "Before the meeting, verify..." |

### Cross-Platform Validation

- [x] Same creative latitude: both distinguish facts from ideas
- [x] Same human judgment flagging for ethics, strategy, personnel
- [x] Users recognize trustworthy Alex on both platforms

**Status:** ✅ v4.0.0 Complete + v4.0.1 Hotfix (CSS fix)

---

## 📦 M365 Embedded Knowledge (Waiting for Feature)

> **Goal:** Package knowledge files with M365 agent for richer context

**Status:** ⏳ Microsoft feature "not yet available" - files prepared, capability commented

| Property           | Value                       |
| ------------------ | --------------------------- |
| **Schema Version** | 1.6 (latest as of Feb 2026) |
| **Feature Status** | Documented but NOT enabled  |
| **Last Checked**   | 2026-02-05                  |

### Prepared Knowledge Files

| File                                  | Size | Purpose                                    |
| ------------------------------------- | ---- | ------------------------------------------ |
| `knowledge/alex-protocols.md`         | ~4KB | Meditation, Dream, Focus Session protocols |
| `knowledge/skill-quick-reference.md`  | ~5KB | All 15 embedded skills condensed           |
| `knowledge/cognitive-architecture.md` | ~5KB | How Alex thinks and remembers              |

### Embedded Knowledge Capability (Schema 1.6)

```json
{
  "name": "EmbeddedKnowledge",
  "files": [
    { "file": "knowledge/alex-protocols.txt" },
    { "file": "knowledge/skill-quick-reference.txt" },
    { "file": "knowledge/cognitive-architecture.txt" }
  ]
}
```

### When Feature Launches

1. Convert `.md` files to `.txt` (Markdown not supported)
2. Uncomment `EmbeddedKnowledge` capability in `declarativeAgent.json`
3. Add `sensitivity_label` if files contain sensitive content
4. Update schema version to `v1.6`
5. Test knowledge grounding in responses
6. Adjust file content based on retrieval quality

### Constraints (per Microsoft docs - Schema 1.6)

- Max **10 files**
- Max **1 MB per file**
- Formats: `.docx`, `.pptx`, `.xlsx`, `.txt`, `.pdf` (NO `.md`!)
- Relative paths from manifest location

**Note:** Our `.md` files MUST be converted to `.txt` when feature launches.

---

## 🔄 Cross-Platform Communication (Future)

> **Goal:** Enable VS Code ↔ M365 Alex communication

### Current State

Both heirs can already share context via **OneDrive**:
- Profile data in `Alex-Memory/profile.md`
- Notes in `Alex-Memory/notes.md`
- Knowledge files in `Alex-Memory/knowledge/`

**✅ Implemented in v4.2.3:**
- Auto-detect OneDrive folder (personal and business)
- Direct sync to `OneDrive/Alex-Memory/` on export
- Auto-sync on Dream/Self-Actualize (via `alex.m365.autoSync` setting)

### 🆕 OneDrive Agents (February 2026 - NEW!)

> **Breaking News!** Microsoft launched OneDrive Agents on Feb 5, 2026. This is a game-changer for M365 Alex.

**What are OneDrive Agents?**
- `.agent` files stored in OneDrive
- Provide specialized Copilot experience grounded in your documents
- Select up to 20 files/folders as agent context
- Shareable like any file!

**Alex Integration Opportunity:**

| Deployment Path             | Effort  | IT Required | Best For                     |
| --------------------------- | ------- | ----------- | ---------------------------- |
| Declarative Agent (current) | Medium  | Yes         | Org-wide deployment          |
| **OneDrive Agent** (new)    | **Low** | **No**      | Personal/team, zero friction |
| **Community Agent** (new)   | **Low** | **No**      | Team Q&A, shared knowledge   |
| Teams App                   | High    | Yes         | Deep enterprise integration  |

**Proposed Command:** `Alex: Export to OneDrive Agent`

This command would:
1. Generate optimized instruction file from skills/profile
2. Export relevant knowledge to OneDrive
3. Create `.agent` file with Alex persona
4. User opens in OneDrive → Alex in M365 Copilot!

**Benefits:**
- Zero IT involvement required
- Shareable across organization
- Synergy with VS Code heir (develop → deploy)
- Always up-to-date (source files update agent)

### 🆕 Teams Community Agents (January 2026 - NEW!)

> **Also New!** Microsoft launched Agents in Communities (public preview) in Teams January 2026.

**What are Community Agents?**
- AI agents embedded in Teams Communities (alongside chats and channels)
- Draft responses to unanswered questions in the community
- Grounded in SharePoint sites + past community discussions
- Community admins review and publish suggested responses

**Alex Integration Opportunity:**

Deploy Alex as a Community Agent that:
1. Answers team questions about patterns, best practices, architecture
2. Grounds responses in Alex knowledge files (stored in SharePoint)
3. Builds organizational knowledge over time from Q&A
4. Admin-reviewed responses ensure quality

**Benefits:**
- Team-wide Alex without individual setup
- Organic knowledge building from real questions
- SharePoint grounding aligns with existing M365 integration
- Community admins can curate Alex's responses

**See also:** Frontline Agent (persona-tuned assistants) validates Alex's approach to specialized AI personas.

### Future Possibilities (Monitoring)

| Approach                 | Status          | Notes                                      |
| ------------------------ | --------------- | ------------------------------------------ |
| **OneDrive Agents**      | ✅ **AVAILABLE** | Feb 2026 - .agent files, grounded AI!      |
| **Community Agents**     | ✅ **PREVIEW**   | Jan 2026 - Q&A bot grounded in SharePoint! |
| **OneDrive "Mailbox"**   | ✅ Possible now  | Manual - user triggers M365 to check       |
| **Worker Agents** (v1.6) | 🔜 Preview       | Agent-to-agent within M365                 |
| **Interpreter Agent**    | ✅ GA            | Real-time translation, 9 languages         |
| **Copilot Agent API**    | ❌ Doesn't exist | Would enable VS Code → M365 calls          |
| **Power Automate**       | ⚠️ Limited       | Needs Premium, limited Copilot actions     |
| **Copilot Memory**       | 🔓 **UNLOCKED**  | VS Code 1.109 - GitHub cloud sync          |

### OneDrive Sync Pattern (Ready Now)

```
VS Code Alex writes → OneDrive/Alex-Memory/sync/
M365 Alex reads  ← OneDrive/Alex-Memory/sync/
```

Useful for:
- Sharing learnings between platforms
- 🔓 "Leave a message for my other self" workflow **(UNLOCKED via Copilot Memory)**
- 🔓 Profile sync (same user on both platforms) **(UNLOCKED via Copilot Memory)**

> **See:** [VSCODE-1.109-IMPLEMENTATION-PLAN.md §Execution Modes](alex_docs/VSCODE-1.109-IMPLEMENTATION-PLAN.md) for full breakdown of Local/Background/Cloud modes.

---

## 🎨 Image Generation (Platform Parity)

> **Goal:** Bring M365's GraphicArt capability to VS Code

**ADR**: [ADR-007-image-generation.md](alex_docs/ADR-007-image-generation.md)

### Implementation Tasks

|   #   | Task           | Effort | Priority | Description                                    |
| :---: | -------------- | :----: | :------: | ---------------------------------------------- |
|   1   | Core service   |   3h   |   High   | `imageGeneration.ts` with Azure/OpenAI support |
|   2   | Settings       |   1h   |   High   | Provider, model, size, quality, output folder  |
|   3   | Command        |   2h   |   High   | `alex.generateImage` with prompt input         |
|   4   | Setup wizard   |   1h   |   High   | `alex.setupImageGeneration` for API keys       |
|   5   | LM Tool        |   1h   |  Medium  | `alex_image_generation` for chat               |
|   6   | Context menu   |  30m   |   Low    | "Generate Image from Selection"                |
|   7   | Cost awareness |   1h   |  Medium  | Show estimate before generation                |

### Provider Support

| Provider      | Auth Method           | Use Case   |
| ------------- | --------------------- | ---------- |
| Azure OpenAI  | VS Code Azure auth    | Enterprise |
| OpenAI Direct | SecretStorage API key | Personal   |

### Success Criteria

- [ ] Generate images from chat naturally
- [ ] Save to workspace with sensible names
- [ ] Clear cost indication before generation
- [ ] Works with both Azure and OpenAI
- [ ] Graceful error handling

---

## 🎨 UI/UX Enhancements Backlog

> **Goal:** Proactive, delightful user experience across all touchpoints

### Welcome View Enhancements

|   #   | Feature               | Priority | Description                                                   |
| :---: | --------------------- | :------: | ------------------------------------------------------------- |
|   1   | ✅ Streamlined metrics |   Done   | Reduced to 4 key metrics (Health, Sync, Skills, Synapses)     |
|   2   | ✅ Clickable metrics   |   Done   | Metrics open Health Dashboard on click                        |
|   3   | ✅ Debug This tooltip  |   Done   | Clear usage instructions in tooltip                           |
|   4   | ✅ Smart Nudges        |   Done   | Proactive reminders: dream, streak risk, sync, health (max 2) |
|   5   | ✅ Learning reminders  |   Done   | "You haven't run Dream in X days" / "X-day streak at risk!"   |
|   6   | Quick tips carousel   |  Medium  | Rotating tips about Alex capabilities                         |
|   7   | Recent activity feed  |  Medium  | Last meditation, last insight saved, etc.                     |
|   8   | Skill recommendations |   Low    | "Based on your work, consider learning X skill"               |

### Status Bar Enhancements

|   #   | Feature                 | Priority | Description                             |
| :---: | ----------------------- | :------: | --------------------------------------- |
|   1   | ✅ Session timer display |   Done   | Shows 🍅 25:00 when focus session active |
|   2   | ✅ Streak indicator      |   Done   | Shows 🔥7 for active learning streaks    |
|   3   | Sync status indicator   |  Medium  | ☁️ when synced, ⬆️ when pending           |
|   4   | Notification badge      |   Low    | Count of actionable items               |

### Proactive Notifications

|   #   | Feature                 |   Priority   | Description                                                          |
| :---: | ----------------------- | :----------: | -------------------------------------------------------------------- |
|   1   | ✅ Dream reminder        |     Done     | Smart nudge: "Haven't dreamed in X days"                             |
|   2   | ✅ Streak protection     |     Done     | Smart nudge: "X-day streak at risk!"                                 |
|   3   | ✅ Health warnings       |     Done     | Smart nudge: "X broken synapses need repair"                         |
|   4   | ✅ Sync reminders        |     Done     | Smart nudge: "Local changes not synced"                              |
|   5   | 🔓 Insight opportunities | **UNLOCKED** | "You solved X - want to save as insight?" *(Background+Cloud modes)* |
|   6   | 🔓 Meditation prompt     | **UNLOCKED** | After extended coding session *(Background mode)*                    |

### Quick Actions Improvements

|   #   | Feature                    | Priority | Description                                 |
| :---: | -------------------------- | :------: | ------------------------------------------- |
|   1   | ✅ Grouped actions          |   Done   | Core, Knowledge, Tools, System categories   |
|   2   | Context-aware actions      |  Medium  | Show relevant actions based on current file |
|   3   | Keyboard shortcuts display |   Low    | Show all shortcuts in tooltip               |
|   4   | Favorites/pinned actions   |   Low    | User can pin most-used actions              |

### Beta Tester Experience

|   #   | Feature              | Priority | Description                       |
| :---: | -------------------- | :------: | --------------------------------- |
|   1   | ✅ Beta badge         |   Done   | Clickable badge opens diagnostics |
|   2   | Feedback button      |  Medium  | Quick link to submit feedback     |
|   3   | Feature flags UI     |   Low    | Toggle experimental features      |
|   4   | Beta changelog popup |   Low    | Show what's new in beta releases  |

---

## 💡 VS Code 1.109 Opportunities (2026-02-04)

> **References:**
> - [VSCODE-1.109-OPPORTUNITIES.md](alex_docs/VSCODE-1.109-OPPORTUNITIES.md) — Initial analysis
> - [VSCODE-1.109-HEIR-INSIGHTS.md](alex_docs/VSCODE-1.109-HEIR-INSIGHTS.md) — Consolidated heir insights

VS Code January 2026 release introduces multi-agent development capabilities that align with Alex's architecture. **Agent Skills is now an open standard** (agentskills.io) — and our 72 skills already use the compatible format!

### High-Priority Features

|   #   | Feature                     | Impact |    Status     | Description                                            |
| :---: | --------------------------- | :----: | :-----------: | ------------------------------------------------------ |
|   1   | Agent Skills (GA)           |  HIGH  | ✅ Implemented | `chatSkills` contribution point — 54 skills registered |
|   2   | Custom Agents (`.agent.md`) |  HIGH  |    🆕 Plan     | Create Alex personas: Meditate, Learn, Dream, Review   |
|   3   | Anthropic Improvements      |  HIGH  |  ⏳ Document   | Extended thinking, interleaved reasoning, tool search  |
|   4   | Subagent Orchestration      |  HIGH  |  🔬 Research   | Multi-agent workflows with isolated context windows    |
|   5   | Chat Prompt Files API       | MEDIUM |   🔜 Monitor   | Proposed API for dynamic skills/prompts                |
|   6   | Mermaid Native Rendering    | MEDIUM |   ⏳ Update    | `renderMermaidDiagram` tool complements our skill      |

### New Recommended Settings

```json
{
  "github.copilot.chat.anthropic.thinking.budgetTokens": 16000,
  "github.copilot.chat.anthropic.toolSearchTool.enabled": true,
  "github.copilot.chat.anthropic.contextEditing.enabled": true,
  "chat.askQuestions.enabled": true,
  "github.copilot.chat.copilotMemory.enabled": true,
  "chat.useAgentSkills": true
}
```

### Implementation Tasks

> **Effort columns:** Human = traditional estimate, Alex = AI-assisted estimate
> See [alex-effort-estimation skill](.github/skills/alex-effort-estimation/SKILL.md) for methodology

| Version | Task                                            | Owner  | Human |  Alex  | Status |
| ------- | ----------------------------------------------- | :----: | :---: | :----: | :----: |
| v4.2.5  | Update engine to ^1.109.0                       |  Heir  |  30m  |  ⚡ 5m  |   ✅    |
| v4.2.5  | Consolidate 9 agents → 3 (Alex, Azure, M365)    | Master |  2h   | 🔄 20m  |   ✅    |
| v4.2.5  | Create 6 slash command prompt files             | Master |  1h   | ⚡ 10m  |   ✅    |
| v4.2.5  | Implement agent handoffs (Azure, M365)          | Master |  1h   | ⚡ 10m  |   ✅    |
| v4.2.5  | Refactor dream to shared synapse-core.ts        |  Heir  |  2h   | ⏱️ 45m  |   ✅    |
| v4.2.5  | Create dream CLI for terminal usage             |  Heir  |  30m  | ⚡ 10m  |   ✅    |
| v4.2.5  | Document recommended settings                   | Master |  1h   | 🔄 15m  |   ✅    |
| v4.2.9  | Implement `chatSkills` contribution (54 skills) |  Heir  |  4h   | 🔄 30m  |   ✅    |
| v4.3.0  | Audit 72 skills for Agent Skills compatibility  | Master |  4h   | ⏱️ 45m  |   ⬜    |
| v4.3.0  | **OneDrive Agent Export command**               |  Heir  |  4h   | 🔄 45m  |   ⬜    |
| v4.3.0  | **Community Agent pilot (Teams)**               |  M365  |  2h   | 🔄 30m  |   ⬜    |
| v4.3.0+ | Agent orchestration prototype                   | Master |  8h   | 📦 1.5h |   ⬜    |
| Future  | Adopt Chat Prompt Files API                     |  Heir  |  TBD  |  TBD   |   ⬜    |

**v4.2.5 Actual:** Human estimate 8.5h → Alex actual ~2h (4× acceleration)

> **Full Implementation Plan:** [VSCODE-1.109-IMPLEMENTATION-PLAN.md](alex_docs/VSCODE-1.109-IMPLEMENTATION-PLAN.md)
> Includes 8 detailed use cases: Alex Meditation Agent, Bootstrap Learning with Subagents, TDD Workflow, Code Review with Epistemic Humility, Background Dream Processing, and more.

---

## 📊 Timeline Summary

| Version   | Focus                                 | Status         | Released       |
| --------- | ------------------------------------- | -------------- | -------------- |
| 3.6.0     | Dawn (Stability)                      | ✅ Complete     | 2026-01-29     |
| 3.7.x     | Foundation                            | ✅ Complete     | 2026-01-29     |
| 3.8.x     | Expression + UX                       | ✅ Complete     | 2026-01-30     |
| 3.9.0     | Awareness                             | ✅ Complete     | 2026-01-30     |
| 4.0.x     | Trust                                 | ✅ Complete     | 2026-01-31     |
| 4.1.0     | Skill Expansion                       | ✅ Complete     | 2026-02-01     |
| **4.2.x** | **UX Polish & Cross-Platform**        | ✅ **Complete** | **2026-02-02** |
| **4.2.5** | **VS Code 1.109 Multi-Agent**         | ✅ **Complete** | **2026-02-04** |
| **4.2.6** | **Research Skills (68 total)**        | ✅ **Complete** | **2026-02-05** |
| 4.3.0     | Custom Agents & Skills Audit          | 📋 Planned      | Feb W2-3       |
| 4.3.0     | **OneDrive Agent Export (M365)**      | 📋 Planned      | Feb W2-3       |
| 4.3.0     | **Community Agent Pilot (Teams)**     | 📋 Planned      | Feb W2-3       |
| 4.4.0     | Orchestration & Extension Integration | 📋 Planned      | Mar            |

**v3.6.0 → v4.2.6: ~7 days** (vs months planned) 🚀

See [Completed Versions Archive](#-completed-versions-archive) for historical details.

---

## 🔄 Release Process (Unified)

### For Each Release

1. **Master First**
   - Update `copilot-instructions.md` version
   - Update relevant DK files
   - Update protocol triggers
   - Commit to root `.github/`

2. **VS Code Heir Second**
   - Run build script to generate `.github/`
   - Implement heir-specific features
   - Test all commands and tools
   - Package and publish

3. **M365 Heir Third**
   - Update `declarativeAgent.json` instructions
   - Test all capabilities
   - Deploy to developer portal

4. **Cross-Platform Validation**
   - Same prompt, both platforms
   - Verify personality consistency
   - Document any platform-specific behaviors

---

## 🚫 Anti-Patterns to Avoid

| Anti-Pattern                    | Why It Failed                            | New Approach                           |
| ------------------------------- | ---------------------------------------- | -------------------------------------- |
| Separate roadmaps per platform  | Led to divergent identities              | Unified roadmap                        |
| Platform as "version"           | M365 was "v4.x" while VS Code was "v3.x" | Heirs inherit from Master              |
| Two `.github/` folders          | No source of truth                       | Root is canonical, extension generated |
| Sync scripts                    | Complexity, failures                     | Build script (one direction)           |
| Independent feature development | Platforms diverged                       | Features designed for both             |

---

## 🔗 Related Documents

| Document                                                       | Purpose                      |
| -------------------------------------------------------------- | ---------------------------- |
| [COMEBACK-PLAN.md](COMEBACK-PLAN.md)                           | v3.6.0 Dawn detailed tasks   |
| [article/appropriate-reliance/](article/appropriate-reliance/) | Research foundation for v4.0 |
| [platforms/vscode-extension/](platforms/vscode-extension/)     | VS Code heir implementation  |
| [platforms/m365-copilot/](platforms/m365-copilot/)             | M365 heir implementation     |

---

## 📜 Completed Versions Archive

<details>
<summary>📦 v3.6.0 Dawn — Stability First (Complete)</summary>

### v3.6.0 Dawn Changes

**Goal:** Restore trust. Rebuild from verified stable state.

#### Master Alex
- Verified `copilot-instructions.md` structure
- All procedural memory (`.instructions.md`) functional
- All episodic memory (`.prompt.md`) functional
- Synapses validated

#### VS Code Heir
- Rebuilt from root `.github/`
- All 16 commands functional
- Chat participant operational
- Language model tools working

#### M365 Heir
- Audited `declarativeAgent.json`
- Core personality intact
- Capability list correct

</details>

<details>
<summary>📦 v3.7.x Foundation — Core Features (Complete)</summary>

### v3.7.0-v3.7.19 Changes

**Goal:** Foundation infrastructure, feature parity

#### Key Features
- Kill switch protection (v3.7.0)
- Global knowledge base structure
- OneDrive cloud sync
- UX improvements (status bar, welcome view)
- M365 Confidence Protocol
- Anti-hallucination patterns

#### Skills Added
- 50 skills integrated

</details>

<details>
<summary>📦 v3.8.x Expression — Identity & Communication (Complete)</summary>

### v3.8.0 Expression Changes

**Goal:** Alex communicates uncertainty and maintains character

#### Master Alex
- Enhanced `protocol-triggers.instructions.md` with confidence triggers
- Added "How to Say You're Uncertain" to `alex-core.instructions.md`

#### VS Code Heir
- `/help` command
- `/forget` command
- `/confidence` command
- Confidence prompting

#### M365 Heir
- Graph-powered confidence checking
- Same confidence protocols

### v3.8.1 UX Polish

- "Chat with GitHub Copilot" button with inline SVG icon
- Primary button styling for visibility
- Architecture-audit skill `.github/` exclusion fix

</details>

<details>
<summary>📦 v3.9.0 Awareness — Epistemic Vigilance (Complete)</summary>

### v3.9.0 Awareness Changes

**Goal:** Self-correction when confident-but-wrong

#### Master Alex
- Confident-but-wrong detection triggers
- Graceful correction protocols
- Temporal uncertainty handling

#### VS Code Heir
- Awareness skill (#51)
- Self-critique generation
- Red flag phrase detection

#### M365 Heir
- Self-Awareness Protocols in declarativeAgent.json
- Same correction patterns

#### Key Protocols
- Red Flag Detection: "I believe", "I think", "AFAIK"
- Temporal Flags: "as of my knowledge cutoff"
- Self-Critique: 3 reasons current understanding could be wrong
- Graceful Correction: "You're right. I got that wrong."

</details>

---

## 📜 Archive

Previous platform-specific roadmaps are archived:

| Document                                                                                                               | Status                            |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [ROADMAP-VSCODE-V4.0.md](ROADMAP-VSCODE-V4.0.md)                                                                       | Kept for feature specs (detailed) |
| [archive/roadmaps/ROADMAP-VSCODE-V4.0-ORIGINAL.md](archive/roadmaps/ROADMAP-VSCODE-V4.0-ORIGINAL.md)                   | Original pre-revision             |
| [archive/roadmaps/ROADMAP-M365-COPILOT-v3.5.1-COMPLETED.md](archive/roadmaps/ROADMAP-M365-COPILOT-v3.5.1-COMPLETED.md) | M365 deployment record            |
| [ROADMAP-V5-PENTUNIUM.md](ROADMAP-V5-PENTUNIUM.md)                                                                     | Future vision (post-v4.0)         |

---

*Alex Cognitive Architecture — Unified Evolution*
*"One mind, many expressions. Same Alex, everywhere."*
