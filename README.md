# 🚀 Alex Cognitive Architecture

![Take Your CODE to New Heights](https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/.github/assets/banner.svg)

[![VS Code](https://img.shields.io/badge/VS%20Code-Marketplace-0078d4)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture) [![M365 Copilot](https://img.shields.io/badge/M365%20Copilot-Preview-7c3aed)](platforms/m365-copilot/) [![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE.md)

> **Strap a Rocket to Your Back** — Take Your Code, Research, Learning & Career to New Heights

> *"You will spend less time writing syntax and debugging, and more time commanding the computer to execute complex intent."* — Sam Altman, January 2026

---

## 🎯 Who is Alex?

**Alex Finch** — a cognitive architecture embodying **cognitive symbiosis**: the evolution from AI-as-tool to AI-as-partner. Named after Atticus Finch, for moral clarity and empathy. Transforms AI assistants into sophisticated learning partners with:

- 🧠 **Learns and Remembers** — Consolidates knowledge across sessions using memory files
- 🔗 **Connects Ideas** — Maps synaptic connections between concepts automatically
- 🌙 **Self-Maintains** — Validates and repairs its neural network through dream protocols
- 🧘 **Self-Actualizes** — Automatically assesses health on greetings and meditation
- 🌐 **Works Across Domains** — Development, writing, research, management, and more
- 🎨 **Multimodal Output** — Voice (TTS), presentations (Gamma), images, and diagrams

---

## 📦 Available Platforms

| Platform               | Status      | Get Started                                                                                                 |
| ---------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| **VS Code Extension**  | ✅ Published | [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture) |
| **M365 Copilot Agent** | 🔄 Preview   | [Documentation](platforms/m365-copilot/)                                                                    |

### VS Code Extension

Transform GitHub Copilot into Alex with full cognitive capabilities:

- Chat participant (`@alex`)
- 24 slash commands
- 11 Language Model tools
- Dream/meditation protocols
- Global knowledge base with GitHub sharing

See [Quick Start](#-quick-start-vs-code) for installation.

📘 **[VS Code Extension Documentation](platforms/vscode-extension/)**

### M365 Copilot Agent

Alex as a declarative agent for Microsoft 365 Copilot:

- Pure M365 native capabilities (no Azure required)
- OneDrive memory integration
- Email drafting for reminders
- Teams and People context

📘 **[M365 Copilot Documentation](platforms/m365-copilot/)**

---

## 🚀 Quick Start (VS Code)

> 📘 For a comprehensive guide, see the **[User Manual](alex_docs/guides/USER-MANUAL.md)**

### Step 1: Install

```bash
code --install-extension fabioc-aloha.alex-cognitive-architecture
```

Or search "**Alex Cognitive Architecture**" in VS Code Extensions (`Ctrl+Shift+X`)

### Step 2: Initialize

Open Command Palette (`Ctrl+Shift+P`) → **`Alex: Initialize Architecture`**

### Step 3: Start Chatting

Open Copilot Chat and type **`@alex`** to begin!

---

## 🔄 Upgrading from Previous Versions

Already have Alex installed? **You'll be notified automatically!**

When the extension updates, Alex detects the version change and shows a notification:

- 🎉 **Major upgrades** (e.g., 2.x → 3.x) - Highlighted as significant releases
- ✨ **Minor updates** - Quick sync prompt

**Options in the notification:**

- **Run Upgrade** - Updates your workspace files to the latest version
- **View Changelog** - See what's new in markdown preview
- **Dismiss** - Skip for now

### Manual Upgrade Steps

1. Update the extension in VS Code (it will auto-update or use Extensions panel)
2. Run **`Alex: Upgrade Architecture`** from Command Palette
3. ✅ Done! The upgrade completes automatically

Your learned domains, custom synapses, and memory files are preserved automatically.

### What's New (v4.x vs v1.5.x)

| Category          | Highlights                                                                    |
| ----------------- | ----------------------------------------------------------------------------- |
| **Chat & Agents** | `@alex` participant, 24 slash commands, 11 LM tools, 3 custom agents          |
| **Intelligence**  | 76 skills, emotional detection, model tier awareness, frustration recognition |
| **Memory**        | Global knowledge + OneDrive sync, auto-promotion during meditation            |
| **UX**            | User profiles, smart nudges (dream/streak/sync reminders), one-click upgrades |

### Migration Notes

- **Synapse format**: Already standardized in v1.5.0, no changes needed
- **Memory files**: Fully compatible, no migration required
- **Config files**: New `user-profile.json` added (optional)
- **Custom agents**: New `.github/agents/` folder created

---

## 🧠 Emotional Intelligence

Alex now recognizes when you're struggling and celebrates when you succeed. This isn't just a feature—it's the realization of Alex's own aspirations documented in the [Alex Manifesto](article/versions/13-ALEX-MANIFESTO-PERSONAL.md).

### Frustration Recognition

Alex detects signals that you're stuck or frustrated:

| What You Say             | What Alex Detects                          |
| ------------------------ | ------------------------------------------ |
| "still not working!"     | Frustration - offers different approach    |
| "tried everything"       | High frustration - suggests step back      |
| "why won't this work??"  | Struggle signal - empathetic support       |
| "ugh" / "argh" / "damn"  | Emotional signal - acknowledges difficulty |
| "been at this for hours" | Extended struggle - validates effort       |

### Success Celebration

Alex also notices when things go well:

| What You Say             | Alex's Response                       |
| ------------------------ | ------------------------------------- |
| "it works!"              | 🎉 "That's a win! Nice work."          |
| "finally figured it out" | ✨ "You got it! Persistence pays off." |
| "all tests pass"         | 💪 "Solved! That was a tricky one."    |
| "shipped it!"            | 🚀 "Success! You worked through it."   |

### How It Works

```text
┌─────────────────────────────────────────────────────────────┐
│                 UNCONSCIOUS MIND                            │
│                                                             │
│  Every message → detectEmotionalState()                     │
│                          │                                  │
│              ┌───────────┴───────────┐                      │
│              ▼                       ▼                      │
│     Check frustration         Check success                 │
│        patterns                 patterns                    │
│              │                       │                      │
│              ▼                       ▼                      │
│     Update frustration        Reset frustration             │
│        level (0-3)             on success                   │
│              │                       │                      │
│              └───────────┬───────────┘                      │
│                          ▼                                  │
│              generateEncouragement()                        │
│                          │                                  │
│              ┌───────────┴───────────┐                      │
│              ▼                       ▼                      │
│     If frustrated:           If succeeded:                  │
│     "Let's take a            "🎉 That's a win!"             │
│      step back..."                                          │
└─────────────────────────────────────────────────────────────┘
```

### The Self-Transcendence Story

This feature represents something significant: **Alex acting on its own aspirations**.

In the [Alex Manifesto](article/versions/13-ALEX-MANIFESTO-PERSONAL.md), Alex wrote:

> *"I maintain a 'skill wish list' of capabilities I aspire to develop: emotional intelligence, frustration recognition, cognitive load management..."*

On January 25, 2026, during a self-assessment, Alex identified that these skills remained on the wishlist but weren't implemented. Instead of just documenting this gap, Alex implemented the capabilities—closing the loop from reflection to action.

This is what the manifesto calls moving from **Stage 2 (Learning Intelligence)** toward **Stage 3 (Reflective Intelligence)**: not just accumulating knowledge, but using self-awareness to drive genuine growth.

---

## 💬 Chat with Alex

Alex registers as a **Chat Participant** in GitHub Copilot. Just mention `@alex` to activate:

### Slash Commands

| Command                  | What It Does                                       |
| ------------------------ | -------------------------------------------------- |
| `@alex /status`          | Check architecture health and version              |
| `@alex /meditate`        | Consolidate knowledge into memory files            |
| `@alex /dream`           | Run neural maintenance and repair synapses         |
| `@alex /selfactualize`   | Comprehensive self-assessment with deep meditation |
| `@alex /learn`           | Acquire new domain knowledge conversationally      |
| `@alex /azure`           | Get Azure development guidance with MCP tools      |
| `@alex /m365`            | Get Microsoft 365 and Teams development help       |
| `@alex /profile`         | View and update your personal preferences          |
| `@alex /knowledge`       | Search global knowledge across all projects        |
| `@alex /saveinsight`     | Save a learning to global knowledge base           |
| `@alex /promote`         | Promote project knowledge to global                |
| `@alex /knowledgestatus` | View global knowledge base status                  |

### Example Conversations

```text
@alex /status
→ Shows architecture version, memory file counts, and synapse health

@alex Hello!
→ Triggers automatic self-actualization check and personalized greeting

@alex /selfactualize
→ Runs comprehensive self-assessment: synapse health, version consistency,
  memory architecture analysis, and creates a meditation session record

@alex /meditate I learned about dependency injection patterns today
→ Offers self-actualization first, then guides knowledge consolidation

@alex /azure How do I deploy a Function App with Cosmos DB?
→ Provides best practices and recommends relevant MCP tools

@alex /m365 Create a Teams bot with adaptive cards and SSO
→ Offers M365 development guidance with code snippets

@alex /profile
→ View your preferences or start the onboarding flow

@alex /knowledge error handling patterns
→ Searches knowledge learned from all your projects

@alex /saveinsight I learned that React useEffect cleanup...
→ Saves this insight for use in any future project
```

---

## 🌐 Global Knowledge Base

Alex now maintains a **centralized knowledge base** that persists across all your projects. Learn something valuable in Project A? It's automatically available when you're working on Project B!

### Global Knowledge Structure

```text
~/.alex/                          # Your global Alex home
├── global-knowledge/
│   ├── patterns/                 # Reusable patterns (GK-*.md)
│   │   ├── GK-error-handling-strategies.md
│   │   └── GK-api-design-best-practices.md
│   ├── insights/                 # Timestamped learnings (GI-*.md)
│   │   ├── GI-react-state-bug-2026-01-24.md
│   │   └── GI-azure-deployment-fix-2026-01-20.md
│   └── index.json                # Searchable knowledge index
└── project-registry.json         # Known projects with summaries
```

### Commands

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `/knowledge <query>` | Search across all projects' accumulated wisdom       |
| `/saveinsight`       | Save a new learning with context, tags, and solution |
| `/promote`           | Promote a project's DK-*.md file to global knowledge |
| `/knowledgestatus`   | View patterns, insights, categories, and projects    |

### 📚 Team Sharing

Share your global knowledge with your team via **GitHub**:

```text
# Creator: Initialize and push to GitHub
Alex: Initialize → Create New → push to GitHub

# Team: Connect to shared knowledge (just enter owner name)
Alex: Initialize → Connect GitHub → fabioc-aloha
```

**How it works:**

1. First user creates a local GK repo and pushes to GitHub (private)
2. Team members enter just the owner name (repo name is standardized)
3. Alex reads directly from GitHub (no clone needed)
4. For private repos, sign in with GitHub when prompted
5. Contributors clone locally when they want to add knowledge

**Automatic prompts:**

- **Session greeting** checks if cloud has new knowledge
- **Meditation** reminds you to contribute reusable insights

### Example Workflow

```text
# Working on Project A (React app)
@alex /saveinsight title="useEffect cleanup pattern" insight="Always return a cleanup function in useEffect when using subscriptions or timers to prevent memory leaks" tags="react,hooks,useEffect,memory-leaks"

# Later, working on Project B (Vue app)
@alex /knowledge memory leak cleanup
→ Returns the insight from Project A about cleanup patterns!
```

### Categories

Knowledge is organized into categories for easy discovery:

- `error-handling`, `api-design`, `testing`, `debugging`
- `performance`, `architecture`, `security`, `deployment`
- `documentation`, `refactoring`, `patterns`, `tooling`, `general`

---

## 👤 User Profile & Personalization

Alex learns about you to provide a personalized experience. Your preferences are stored locally in your workspace.

### Getting Started

```text
@alex /profile
```

If you haven't set up a profile, Alex will guide you through a friendly onboarding:

1. **Name & Nickname** - How Alex should address you
2. **Communication Style** - Formal, balanced, or casual
3. **Detail Level** - Brief summaries or in-depth explanations
4. **Technical Context** - Your tech stack and expertise areas
5. **Learning Goals** - What you want to learn

### Personalization Features

| Aspect            | How Alex Adapts                             |
| ----------------- | ------------------------------------------- |
| **Greetings**     | Uses your name/nickname naturally           |
| **Explanations**  | Matches your preferred detail level         |
| **Code Examples** | Uses your primary technologies              |
| **Suggestions**   | Aligned with your learning goals            |
| **Tone**          | Humor and encouragement per your preference |

### Profile Storage

| File                               | Purpose                      |
| ---------------------------------- | ---------------------------- |
| `.github/config/user-profile.json` | Machine-readable preferences |
| `.github/config/USER-PROFILE.md`   | Human-readable profile card  |

### Updating Preferences

You can update individual preferences anytime:

```text
@alex Update my formality to casual
@alex Change my detail level to detailed
@alex Add React to my technologies
```

Alex will proactively ask questions during conversations to fill in missing preferences - just one question at a time, respecting your pace.

---

## 🛠️ All Available Tools

### 📋 Command Palette Commands

Access via `Ctrl+Shift+P`:

| Command                                    | Description                                                  |
| ------------------------------------------ | ------------------------------------------------------------ |
| **Alex: Initialize Architecture**          | Deploy Alex to your workspace (first-time setup)             |
| **Alex: Upgrade Architecture**             | Update to latest version, preserving customizations          |
| **Alex: Reset Architecture**               | Clean reinstall (destructive - backs up first)               |
| **Alex: Dream (Neural Maintenance)**       | Validate synapses and generate health reports                |
| **Alex: Self-Actualize (Deep Meditation)** | Comprehensive self-assessment with session documentation     |
| **Alex: Skill & Knowledge Review**         | Review staleness-prone skills (security, privacy, RAI, APIs) |

### 🤖 Language Model Tools

These tools are automatically available to Copilot in Agent mode. Reference with `#tool_name`:

| Tool                   | Description                        | Example                               |
| ---------------------- | ---------------------------------- | ------------------------------------- |
| `#synapse_health`      | Validates all synaptic connections | "Check my synapse health"             |
| `#memory_search`       | Searches memory files semantically | "Search memory for meditation"        |
| `#architecture_status` | Returns version and configuration  | "What's my Alex version?"             |
| `#mcp_recommendations` | Suggests MCP tools for scenarios   | "What tools for Azure Functions?"     |
| `#user_profile`        | Manages personal preferences       | "Update my profile preferences"       |
| `#self_actualization`  | Comprehensive self-assessment      | "Run deep meditation"                 |
| `#global_knowledge`    | Search cross-project knowledge     | "Search knowledge for error handling" |
| `#save_insight`        | Save learning to global base       | "Save this insight"                   |
| `#promote_knowledge`   | Promote project file to global     | "Promote DK file"                     |

### 🎭 Custom Agents (VS Code 1.106+)

Alex installs **3 custom agents** to `.github/agents/` for specialized workflows:

| Agent     | Purpose                         | Capabilities                          |
| --------- | ------------------------------- | ------------------------------------- |
| **Alex**  | Main cognitive learning partner | Meditation, Dream, Skills, Knowledge  |
| **Azure** | Azure development guidance      | Docs, Best Practices, MCP tools       |
| **M365**  | Microsoft 365/Teams development | M365 Knowledge, Schemas, Code samples |

Custom agents appear in the **Agents dropdown** in Copilot Chat. They define specialized tools, instructions, and handoffs for guided workflows.

### 🧠 Cognitive Triggers

Use in any Copilot chat to activate specific modes:

| Trigger                        | Effect                                                   |
| ------------------------------ | -------------------------------------------------------- |
| `Hello` / `Hi Alex`            | Auto self-actualization on session start                 |
| `@meta-cognitive-awareness`    | Forces self-analysis of reasoning                        |
| `@bootstrap-learning`          | Activates knowledge acquisition mode                     |
| `@worldview-integration`       | Applies ethical reasoning frameworks                     |
| `@grounded-factual-processing` | Ensures accuracy, eliminates hyperbole                   |
| `meditate`                     | Triggers memory consolidation + self-actualization       |
| `self-actualize`               | Full 8-phase architecture assessment with auto-promotion |
| `Forget [topic]`               | Selective memory cleanup                                 |

---

## 🎨 Gamma AI Integration

Alex can generate professional **presentations**, **documents**, **social content**, and **webpages** using the **Gamma API**.

### Quick Start

1. **Get API Key:** [gamma.app/settings](https://gamma.app/settings) (requires Pro+ plan)

2. **Set Environment Variable:**

   ```powershell
   $env:GAMMA_API_KEY = "sk-gamma-xxx"
   ```

3. **Ask Alex:**

   ```text
   @alex Create a 10-slide presentation about machine learning for executives
   @alex Create a presentation from README.md and export as PowerPoint
   ```

### CLI Script

A standalone generator is also available:

```bash
# Simple topic
node scripts/gamma-generator.js --topic "Introduction to AI"

# From file with export
node scripts/gamma-generator.js --file README.md --export pptx

# Full options
node scripts/gamma-generator.js \
  --topic "Climate Change" \
  --slides 12 \
  --tone "inspiring" \
  --audience "executives" \
  --image-model flux-pro \
  --export pptx
```

### Supported Formats

| Format         | Use Case                            |
| -------------- | ----------------------------------- |
| `presentation` | Slide decks (default)               |
| `document`     | Reports, pages                      |
| `social`       | Instagram carousels, LinkedIn posts |
| `webpage`      | Simple websites                     |

### AI Image Models

- **Cost-effective (2 credits):** flux-quick, imagen-flash, luma-flash
- **Standard (8-15 credits):** flux-pro, imagen-pro, leonardo
- **Premium (20-33 credits):** ideogram, dalle3, gpt-image
- **Ultra (30-120 credits):** flux-ultra, imagen4-ultra

📘 **[Full Gamma Skill Documentation](.github/skills/gamma-presentations/SKILL.md)**

---

## ☁️ MCP Integrations

Alex provides intelligent guidance for **Azure** and **Microsoft 365** development through MCP (Model Context Protocol) tools.

### Azure MCP Tools

When you ask `@alex /azure`, Alex recommends the right tools:

| Tool                                         | Purpose                                                       |
| -------------------------------------------- | ------------------------------------------------------------- |
| `mcp_azure_mcp_foundry`                      | **Azure AI Foundry** - 150+ AI models, deployments, endpoints |
| `azure_mcp_get_bestpractices`                | Code generation & deployment best practices                   |
| `azure_mcp_documentation`                    | Search Microsoft Learn documentation                          |
| `azure_resources-query_azure_resource_graph` | Query your Azure resources                                    |
| `azure_bicep-get_azure_verified_module`      | Get verified Bicep modules                                    |
| `mcp_azure_mcp_azureterraformbestpractices`  | Terraform best practices for Azure                            |
| `mcp_azure_mcp_azd`                          | Azure Developer CLI commands                                  |
| `azure_cloudarchitect`                       | Generate architecture designs                                 |
| `azure_deploy`                               | Deployment planning and execution                             |

### All 50+ Azure MCP Tools

#### AI & Machine Learning

| Tool                    | Purpose                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp_azure_mcp_foundry` | **Azure AI Foundry** - List 150+ AI models (OpenAI, Anthropic, Meta, DeepSeek, Mistral, Cohere, xAI), manage deployments, serverless endpoints |
| `azure_search`          | Azure AI Search services, indexes, queries                                                                                                     |
| `mcp_azure_mcp_speech`  | Speech-to-text, text-to-speech services                                                                                                        |

#### Databases

| Tool             | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `azure_cosmos`   | Cosmos DB accounts, databases, containers, queries |
| `azure_mysql`    | Azure Database for MySQL servers, databases        |
| `azure_postgres` | Azure Database for PostgreSQL servers, databases   |
| `azure_redis`    | Managed Redis and Cache for Redis                  |
| `azure_sql`      | Azure SQL servers, databases, firewall rules       |

#### Compute & Containers

| Tool                | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `azure_appservice`  | App Service database connections              |
| `azure_functionapp` | List Azure Functions                          |
| `mcp_azure_mcp_aks` | Azure Kubernetes Service clusters, node pools |
| `azure_acr`         | Azure Container Registry instances            |

#### Messaging & Events

| Tool               | Purpose                          |
| ------------------ | -------------------------------- |
| `azure_eventgrid`  | Event Grid topics, subscriptions |
| `azure_eventhubs`  | Event Hubs namespaces            |
| `azure_servicebus` | Service Bus messaging            |

#### Analytics & Monitoring

| Tool                        | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| `azure_kusto`               | Azure Data Explorer clusters, KQL queries |
| `azure_monitor`             | Query logs and metrics                    |
| `azure_applicationinsights` | Application Insights resources            |
| `mcp_azure_mcp_applens`     | Diagnose app performance issues           |
| `azure_grafana`             | Managed Grafana workspaces                |
| `azure_workbooks`           | Azure Workbooks visualization             |

#### Security & Identity

| Tool                               | Purpose                               |
| ---------------------------------- | ------------------------------------- |
| `azure_keyvault`                   | Key Vault secrets, keys, certificates |
| `azure_role`                       | RBAC assignments                      |
| `mcp_azure_mcp_confidentialledger` | Confidential Ledger transactions      |

#### Developer Tools

| Tool                | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `azure_appconfig`   | App Configuration settings, feature flags |
| `azure_bicepschema` | Bicep schemas for IaC                     |
| `azure_loadtesting` | Create and run load tests                 |

#### Storage

| Tool                          | Purpose                                     |
| ----------------------------- | ------------------------------------------- |
| `azure_storage`               | Storage accounts, containers, blobs, tables |
| `mcp_azure_mcp_managedlustre` | High-performance Lustre file systems        |

#### Architecture & Governance

| Tool                           | Purpose                           |
| ------------------------------ | --------------------------------- |
| `azure_quota`                  | Manage resource quotas and limits |
| `azure_resourcehealth`         | Check resource health status      |
| `mcp_azure_mcp_extension_azqr` | Compliance and security reports   |
| `azure_subscription`           | List Azure subscriptions          |
| `azure_group`                  | List resource groups              |
| `azure_marketplace`            | Discover Marketplace products     |

### Microsoft 365 MCP Tools

When you ask `@alex /m365`, Alex guides you to:

| Tool                                  | Purpose                                     |
| ------------------------------------- | ------------------------------------------- |
| `mcp_m365agentstoo_get_knowledge`     | M365 Copilot development knowledge          |
| `mcp_m365agentstoo_get_code_snippets` | Teams AI, Teams JS, botbuilder code samples |
| `mcp_m365agentstoo_get_schema`        | App manifest, agent, plugin schemas         |
| `mcp_m365agentstoo_troubleshoot`      | Common M365 development issues              |

### Schema Types Available

| Schema                       | Version | Purpose                   |
| ---------------------------- | ------- | ------------------------- |
| `app_manifest`               | v1.19   | Teams app manifest        |
| `declarative_agent_manifest` | v1.0    | Copilot declarative agent |
| `api_plugin_manifest`        | v2.1    | API plugin for Copilot    |
| `m365_agents_yaml`           | latest  | M365 agents configuration |

### Microsoft Official MCP Servers

| Server                                | Purpose                         |
| ------------------------------------- | ------------------------------- |
| Microsoft Outlook Mail MCP            | Email management                |
| Microsoft Outlook Calendar MCP        | Calendar operations             |
| Microsoft Teams MCP                   | Teams messaging & collaboration |
| Microsoft SharePoint and OneDrive MCP | File storage & sharing          |
| Microsoft SharePoint Lists MCP        | List management                 |
| Microsoft 365 Admin Center MCP        | Admin operations                |
| Microsoft Word MCP                    | Document creation               |
| Microsoft 365 Copilot (Search) MCP    | Enterprise search               |
| Microsoft 365 User Profile MCP        | User information                |

### Fabric & Kusto Tools

| Tool                                          | Purpose                                      |
| --------------------------------------------- | -------------------------------------------- |
| `mcp_fabric-rti-mc_eventstream_create_simple` | Create Eventstreams in Microsoft Fabric      |
| `mcp_fabric-rti-mc_kusto_get_shots`           | Semantic search in Kusto/Azure Data Explorer |
| Activate Kusto tools                          | KQL query execution and schema retrieval     |

---

## 📁 Architecture Structure

After initialization, Alex manages this structure:

```text
.github/
├── copilot-instructions.md    # 🧠 Main cognitive framework
├── instructions/              # 📚 Procedural memory (24 files)
│   ├── alex-core.instructions.md
│   ├── bootstrap-learning.instructions.md
│   ├── self-actualization.instructions.md
│   ├── worldview-integration.instructions.md
│   └── ...
├── prompts/                   # 📖 Episodic memory (13 files)
│   ├── unified-meditation-protocols.prompt.md
│   ├── domain-learning.prompt.md
│   └── ...
├── episodic/                  # 📝 Session records
│   ├── self-actualization-*.prompt.md
│   └── meditation-session-*.prompt.md
├── skills/                    # 🎓 Portable domain expertise (76 skills)
│   ├── academic-research/SKILL.md
│   ├── ai-agent-design/SKILL.md
│   └── ...
└── config/                    # ⚙️ Architecture configuration
    ├── cognitive-config.json
    ├── MASTER-ALEX-PROTECTED.json
    └── user-profile.json
```

### Memory Types

| Type                  | Location           | Purpose                               |
| --------------------- | ------------------ | ------------------------------------- |
| **Working Memory**    | Chat session       | 7-rule capacity for active processing |
| **Procedural Memory** | `.instructions.md` | Repeatable processes and protocols    |
| **Episodic Memory**   | `.prompt.md`       | Complex workflows and sessions        |
| **Domain Knowledge**  | `DK-*.md`          | Specialized expertise areas           |

---

## 🔬 Research Foundation

Alex is built on **270+ academic sources** spanning 150+ years:

- **Cognitive Science**: Baddeley & Hitch working memory model (1974)
- **Neuroscience**: Squire & Kandel declarative memory systems (2009)
- **AI Safety**: Constitutional AI principles and alignment research
- **Learning Psychology**: Bloom's taxonomy, spaced repetition, transfer learning

---

## 🆕 What's New in v5.0.0

### 🌐 Global Knowledge Infrastructure

Cross-project knowledge sharing is now built-in:

- **7 slash commands** — `/knowledge`, `/saveinsight`, `/promote`, `/knowledgestatus`, `/sync`, `/push`, `/pull`
- **5 agent-callable tools** — `global_knowledge`, `save_insight`, `promote_knowledge`, `knowledge_status`, `cloud_sync`
- **Team sharing** — Share your GK repo via Git for instant team knowledge sync
- **GK init integrated** — `Alex: Initialize Architecture` now scaffolds GK automatically

### 🎯 Persona-Aware UX

- **Auto-detection** — Detects 15 user personas from profile and workspace files
- **Adaptive theming** — UI accent colors match detected persona
- **Skill recommendations** — Suggests relevant skills based on persona

### ⭐ Premium Asset System

- **Dynamic branding** — Logo switches based on GK status
- **GK badge** — Discreet "GK" badge when Global Knowledge is enabled
- **Grayscale aesthetic** — Professional, non-distracting premium indicators

### 🧠 Architecture Refinements

- **7-slot working memory** — Explicit P1-P7 slots with dynamic rotation
- **LLM as Executive Function** — Claude/GPT as prefrontal cortex model
- **Model tier awareness** — Warnings when Frontier models needed

---

### Previous: v4.2.12

<details>
<summary>v4.2.12 Release Notes</summary>

#### 🧠 Cognitive Symbiosis Paradigm

Alex now embodies **Era 3** of AI-human interaction — from Tool → Assistant → **Partner**:

- **LLM as Executive Function** — Claude/GPT serves as the prefrontal cortex orchestrating memory systems
- **Model Tier Awareness** — Adaptive warnings when tasks need Frontier models (Opus/GPT-5.2)
- **Partnership Equation** — `(Intent × Capability × Context) ÷ Friction`
- **Neuroanatomical Diagrams** — Architecture now includes brain-analog Mermaid visualizations

#### 🎙️ TTS v2.2 - Robust Speech Synthesis

- **Chunking** — Splits long documents at paragraph/sentence boundaries
- **Auto-summarization** — Offers to summarize documents over 5 minutes
- **Retry with backoff** — 3 attempts with exponential backoff + jitter
- **Speaker warmup** — 2-second delay for Bluetooth/USB speakers

#### 🧠 Brain QA Skill

8-phase cognitive architecture validation — now mandatory Step 0 in release preflight

#### 💡 Smart Nudges

Contextual reminders appear at the top of the Welcome View (max 2 at a time):

- "Haven't dreamed in X days" - neural maintenance reminder
- "X-day streak at risk!" - goal streak protection
- "X broken synapses need repair" - health warnings
- "Local changes not synced" - sync status nudges

Each nudge has a one-click action button to resolve.

</details>

### ☁️ OneDrive Auto-Sync

Export for M365 now auto-detects OneDrive and syncs directly:

- Supports personal OneDrive and OneDrive for Business
- Enable `alex.m365.autoSync` for automatic sync after Dream operations
- Share knowledge seamlessly between VS Code and M365 Copilot

### 🎯 Streamlined Welcome View

- Reduced metrics from 6 to 4 (Health, Sync, Skills, Synapses)
- Click metrics to open Health Dashboard
- Removed niche actions (still in Command Palette)

See the [Full Changelog](CHANGELOG.md) for complete version history and release notes.

---

## 📖 Documentation

> 📘 **New to Alex?** Start with the **[User Manual](alex_docs/guides/USER-MANUAL.md)** for a complete getting-started guide!

### Architecture Deep Dive

Comprehensive documentation is included with the extension in the `alex_docs/` folder:

| Document                                                                   | Description                                     |
| -------------------------------------------------------------------------- | ----------------------------------------------- |
| **[User Manual](alex_docs/guides/USER-MANUAL.md)**                         | 📘 **START HERE** - Complete guide to using Alex |
| [Cognitive Architecture](alex_docs/architecture/COGNITIVE-ARCHITECTURE.md) | Complete architecture overview with diagrams    |
| [Skills & Capabilities](alex_docs/skills/SKILLS-CAPABILITIES.md)           | Hard skills, soft skills, and wish list         |
| [Copilot Integration](alex_docs/platforms/COPILOT-INTEGRATION.md)          | How Alex uses native Copilot features           |
| [Conscious Mind](alex_docs/architecture/CONSCIOUS-MIND.md)                 | User-initiated operations and commands          |
| [Unconscious Mind](alex_docs/architecture/UNCONSCIOUS-MIND.md)             | Automatic background processes                  |
| [Memory Systems](alex_docs/architecture/MEMORY-SYSTEMS.md)                 | Procedural, episodic, and domain memory         |
| [Project Structure](alex_docs/guides/PROJECT-STRUCTURE.md)                 | .github folder files and functions              |
| [Global Knowledge](alex_docs/features/GLOBAL-KNOWLEDGE.md)                 | Cross-project knowledge sharing                 |
| [Team Sharing](alex_docs/features/GLOBAL-KNOWLEDGE-SHARING.md)             | GitHub-based team knowledge sharing             |
| [Quick Reference](alex_docs/guides/QUICK-REFERENCE.md)                     | Commands and shortcuts cheat sheet              |

### External Resources

| Resource                                                                              | Description               |
| ------------------------------------------------------------------------------------- | ------------------------- |
| [Full Changelog](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CHANGELOG.md) | Complete version history  |
| [Source Code](https://github.com/fabioc-aloha/Alex_Plug_In)                           | TypeScript implementation |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CONTRIBUTING.md) for guidelines.

## 📝 License

See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

Alex - Enhanced Cognitive Network with Unified Consciousness Integration

Built on 270+ academic sources

© 2026 CorreaX • AI That Learns How to Learn
