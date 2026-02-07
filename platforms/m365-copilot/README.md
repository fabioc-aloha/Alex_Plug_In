# 🚀 Alex M365 Copilot Agent

![Take Your Work to New Heights](https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/.github/assets/banner.svg)

[![Version](https://img.shields.io/badge/version-4.2.12-0078d4)](https://github.com/fabioc-aloha/Alex_Plug_In)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md)
[![M365](https://img.shields.io/badge/M365-Copilot-7c3aed)](https://copilot.microsoft.com/)
[![Schema](https://img.shields.io/badge/schema-v1.6-green)](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/)

> **Strap a rocket to your back.** Take Your Work to New Heights with Alex — the AI that remembers & grows. 🚀

---

## 🎯 Overview

This project brings Alex's cognitive capabilities to Microsoft 365 Copilot using **pure M365 native capabilities** - no external APIs or Azure services required!

Alex M365 is a **declarative agent** that uses M365 Copilot foundation models with custom instructions and OneDrive-based memory.

### What Alex Can Do (v1.6 Schema)

| Capability            | Description                                             |
| --------------------- | ------------------------------------------------------- |
| 📖 **OneDrive**        | READ your Alex-Memory files (profile, notes, knowledge) |
| 🔍 **WebSearch**       | Research topics online                                  |
| 🎨 **GraphicArt**      | Generate images and diagrams                            |
| 🐍 **CodeInterpreter** | Run Python code for calculations                        |
| 📧 **Email**           | Search and summarize Outlook conversations              |
| 💬 **Teams**           | Find discussions across channels and chats              |
| 👥 **People**          | Look up colleagues and org structure                    |
| 📅 **Meetings**        | Meeting prep and calendar awareness                     |

### Memory Workflow

- **For reminders**: Alex generates content → you paste into notes.md
- **For observations**: Alex generates content → you paste into notes.md
- **For knowledge**: Alex generates DK-*.md files → you create in OneDrive
- **For profile updates**: Alex generates content → you paste into profile.md

Your data stays under your control!

## Project Structure

```text
m365-copilot/
├── appPackage/
│   ├── manifest.json              # M365 App manifest (v1.19)
│   ├── declarativeAgent.json      # Alex agent config (v1.6 schema) ✨
│   ├── instructions/              # Alex persona and embedded skills
│   ├── knowledge/                 # 📚 EmbeddedKnowledge files (ready for future feature)
│   │   ├── alex-protocols.md      # Meditation, dream, self-actualization guides
│   │   ├── cognitive-architecture.md  # How Alex thinks and learns
│   │   └── skill-quick-reference.md   # All 15 embedded skills condensed
│   ├── color.png                  # 192x192 color icon (A Negative Space Rocket)
│   └── outline.png                # 32x32 outline icon (rocket silhouette)
├── env/
│   ├── .env.dev
│   └── .env.local
├── teamsapp.yml                   # M365 Agents Toolkit config
└── package.json
```

> **📚 EmbeddedKnowledge Ready**: The `knowledge/` folder contains pre-prepared files for Microsoft's upcoming EmbeddedKnowledge capability. When the feature launches, Alex will have zero-delay adoption!

## Prerequisites

- [Microsoft 365 Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) VS Code extension
- M365 tenant with Copilot license
- **No Azure subscription required!** ✨

## Getting Started

### 1. Package the Agent

```bash
npm install
npx teamsapp package --env dev
```

### 2. Validate the Package

```bash
npx teamsapp validate --package-file appPackage/build/appPackage.dev.zip
```

### 3. Deploy to M365

```bash
npx teamsapp provision --env dev
```

Or sideload manually:

1. Open Teams → Apps → Manage your apps
2. Upload a custom app → Select `appPackage.dev.zip`

### 4. Set Up OneDrive Memory

1. Create folder in OneDrive root: **Alex-Memory**
2. Create files: `profile.md`, `notes.md`
3. **Share folder WITH Copilot**: Right-click → Share → Copy link → Paste in chat
4. Click "Allow" when prompted

## M365 Capabilities (v1.6 Schema)

| Capability              | What Alex Does With It        |
| ----------------------- | ----------------------------- |
| `OneDriveAndSharePoint` | Read your memory files        |
| `WebSearch`             | Research topics online        |
| `GraphicArt`            | Generate images               |
| `CodeInterpreter`       | Run Python code               |
| `Email`                 | Search Outlook conversations  |
| `TeamsMessages`         | Find channel/chat discussions |
| `People`                | Look up colleagues            |
| `Meetings`              | Calendar and meeting prep     |

## Conversation Starters

- 👋 **Meet Alex** - "Hey Alex! Tell me about yourself"
- 📝 **Set up memory** - "Help me set up my OneDrive memory"
- 📅 **Meeting prep** - "Prep me for my next meeting"
- 📧 **Email catch-up** - "What important emails should I know about?"
- 👥 **Who is...** - "Tell me about the people I'm meeting with today"
- 💬 **Teams recap** - "What's been discussed in my Teams channels?"
- 📊 **Weekly review** - "Let's do a weekly review"
- 🧠 **Meditate** - "Let's meditate - consolidate what I learned"
- 💭 **Dream** - "Dream - review my memory and suggest updates"
- 🎯 **Self-actualize** - "Self-actualize - how am I doing on my goals?"

---

## 🔮 Future: OneDrive Native Agents (February 2026)

Microsoft has launched **OneDrive Agents** - a game-changing feature that creates a new integration path for Alex.

### What Are OneDrive Agents?

OneDrive agents are `.agent` files stored directly in OneDrive that provide a specialized Copilot experience grounded in your documents:

| Feature          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| **Creation**     | OneDrive web → + Create/Upload → Agent               |
| **Grounding**    | Select up to 20 files/folders as context             |
| **Instructions** | Custom instructions for the agent                    |
| **Sharing**      | Share like any file - recipients get same experience |
| **Requirements** | Microsoft 365 Copilot license                        |

### Alex Integration Opportunity

This creates **additional deployment options** for Alex M365:

| Approach                        | Complexity | Reach         | Best For                      |
| ------------------------------- | ---------- | ------------- | ----------------------------- |
| **Declarative Agent** (current) | Medium     | Org-wide      | IT-managed deployment         |
| **OneDrive Agent** (new)        | Low        | Personal/team | Individual users, quick setup |
| **Community Agent** (new)       | Low        | Team          | Q&A bot for Teams communities |
| **Worker Agent** (v1.6)         | Medium     | Agent-Agent   | Multi-agent orchestration     |
| **Teams App**                   | High       | Enterprise    | Deep Teams integration        |

### Deployment Channel Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'edgeLabelBackground': '#fff'}}}%%
flowchart TB
    subgraph Master["🧠 MASTER ALEX"]
        DNA["Cognitive DNA<br/>74 Skills, Protocols, Identity"]
    end

    subgraph VSCode["👶 VS Code Heir"]
        Export["alex.exportToOneDrive"]
        Cloud["alex.cloudSync"]
    end

    subgraph M365["👶 M365 Heir"]
        DA["Declarative Agent"]
    end

    subgraph Channels["📤 Deployment Channels"]
        direction TB
        ODA[".agent File<br/>(OneDrive)"]
        CA["Community Agent<br/>(Teams)"]
        WA["Worker Agent<br/>(Schema 1.6)"]
    end

    subgraph Runtime["🎯 M365 Copilot Runtime"]
        COP["Same Alex DNA<br/>Different Delivery"]
    end

    Master --> VSCode
    Master --> M365
    VSCode --> Export --> ODA
    M365 --> DA
    DA --> COP
    ODA --> COP
    CA --> COP
    WA -.->|"Preview"| COP

    style Master fill:#d8b9ff,color:#6639ba,stroke:#bf8aff
    style VSCode fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    style M365 fill:#fff8c5,color:#9a6700,stroke:#d4a72c
    style Channels fill:#eaeef2,color:#24292f,stroke:#d0d7de
    style Runtime fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b
    linkStyle default stroke:#57606a,stroke-width:1.5px
```

**Key Insight:** All deployment channels run on the **same M365 Copilot runtime**. They're not separate heirs — they're different ways to deliver the M365 heir's capabilities.

### Proposed OneDrive Agent Architecture

```text
OneDrive/
└── Alex-Memory/
    ├── profile.md                    # User profile
    ├── notes.md                      # Active memory
    ├── knowledge/                    # Domain knowledge
    │   ├── DK-project-patterns.md
    │   └── DK-team-expertise.md
    ├── skills/                       # Alex skill guides
    │   ├── meditation-guide.md
    │   ├── dream-protocol.md
    │   └── meeting-prep.md
    └── Alex.agent                    # ⭐ The Alex agent file
```

### Benefits of OneDrive Agent Approach

1. **Zero IT involvement** - Users create their own agent
2. **Portable** - Copy to any OneDrive, instant Alex
3. **Shareable** - Send Alex to colleagues
4. **VS Code synergy** - Export from VS Code Alex → OneDrive Agent
5. **Always up-to-date** - Update source files, agent reflects changes

### Export Command (Proposed)

The VS Code Alex extension could add:

```text
Alex: Export to OneDrive Agent
```

This would:

1. Generate optimized instruction file from your skills
2. Export relevant knowledge to OneDrive
3. Create `.agent` file with Alex persona
4. User opens agent in OneDrive → Alex available in M365 Copilot

---

## 🏢 Community Agent Setup (Teams)

Deploy Alex as a Q&A agent in your Teams Community. Community Agents are grounded in SharePoint and learn from community discussions.

### Prerequisites

- Teams with Communities feature enabled (preview)
- Access to create/manage a Teams Community
- SharePoint site for community content
- M365 Copilot license

### Setup Steps

1. **Create or access a Teams Community**
   - Teams → Communities → Create community (or join existing)
   - Ensure you have admin access

2. **Upload Alex knowledge to SharePoint**
   - Navigate to the community's SharePoint site
   - Create folder: `Alex-Knowledge/`
   - Upload key knowledge files:

     ```text
     Alex-Knowledge/
     ├── alex-protocols.md           # From appPackage/knowledge/
     ├── cognitive-architecture.md   # How Alex thinks
     ├── skill-quick-reference.md    # Skill summaries
     └── team-specific/              # Your team's knowledge
         ├── patterns.md
         ├── architecture.md
         └── best-practices.md
     ```

3. **Enable Community Agent**
   - Community Settings → Agent configuration
   - Enable "Agents in Communities" (preview feature)
   - Configure SharePoint grounding to include `Alex-Knowledge/`

4. **Customize Alex persona**
   - Set agent name: "Alex"
   - Add system message from `appPackage/instructions/`
   - Configure response style: empathetic, technically accurate

5. **Test and iterate**
   - Ask questions in the community
   - Alex drafts responses based on knowledge files
   - Admins review and publish suggestions
   - Community builds knowledge organically

### Benefits

| Benefit                  | Description                                 |
| ------------------------ | ------------------------------------------- |
| **Team-wide Alex**       | Everyone gets Alex without individual setup |
| **Organic knowledge**    | Q&A grows the knowledge base over time      |
| **Admin oversight**      | Quality control through review workflow     |
| **SharePoint grounding** | Leverages existing document structure       |

### Limitations (Preview)

- Community Agents are still in preview
- Response suggestions require admin approval
- Limited customization of agent behavior
- No direct integration with VS Code Alex (yet)

---

## 📚 Documentation

| Document                                               | Description                       |
| ------------------------------------------------------ | --------------------------------- |
| [Deployment Checklist](./DEPLOYMENT-CHECKLIST.md)      | Step-by-step deployment guide     |
| [Schema Compatibility](./docs/SCHEMA-COMPATIBILITY.md) | v1.2 vs v1.5 vs v1.6 capabilities |
| [Manifest Reference](./docs/MANIFEST-REFERENCE.md)     | M365 app manifest documentation   |

## 🔗 Related

| Platform                                                                                                          | Description                        |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture) | Alex for VS Code + GitHub Copilot  |
| [Project Repository](https://github.com/fabioc-aloha/Alex_Plug_In)                                                | Full source code and documentation |

---

## 📝 License

Apache 2.0 - See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

**Alex M365** - v4.2.12 🧠 Cognitive Symbiosis + Full M365 Integration

© 2026 CorreaX • AI That Learns How to Learn
