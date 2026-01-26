# 🧠 Alex Cognitive Architecture

![Alex Cognitive Architecture](https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/assets/banner.png)

[![Version](https://img.shields.io/badge/version-3.3.1-0078d4)](https://github.com/fabioc-aloha/Alex_Plug_In)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-7c3aed)](https://code.visualstudio.com/)
[![Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-0078d4)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture)

> Your AI Learning Partner with Meta-Cognitive Awareness

[Install Now](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture) •
[Quick Start](#-quick-start) •
[Upgrading](#-upgrading-from-previous-versions) •
[Chat with @alex](#-chat-with-alex) •
[All Tools](#️-all-available-tools)

---

## 🎯 What is Alex?

**Alex Cognitive Architecture** transforms GitHub Copilot into a sophisticated learning partner that:

- 🧠 **Learns and Remembers** - Consolidates knowledge across sessions using memory files
- 🔗 **Connects Ideas** - Maps synaptic connections between concepts automatically
- 🌙 **Self-Maintains** - Validates and repairs its neural network through dream protocols
- 🧘 **Self-Actualizes** - Automatically assesses health on greetings and meditation
- ☁️ **Guides Development** - Provides Azure & M365 best practices via MCP tools

---

## 🚀 Quick Start

> 📘 For a comprehensive guide, see the **[User Manual](alex_docs/USER-MANUAL.md)**

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
3. Follow the generated `UPGRADE-INSTRUCTIONS.md` with your AI assistant
4. Run **`Alex: Dream`** to validate the upgrade

Your learned domains, custom synapses, and memory files are preserved automatically.

### What's New for Existing Users

| Feature | v1.5.x | v3.3.1 |
| ------- | ------ | ------ |
| Chat Participant | ❌ Context injection only | ✅ `@alex` conversational AI |
| Slash Commands | ❌ None | ✅ 16 commands (including /docs) |
| Language Model Tools | ❌ None | ✅ 11 AI-accessible tools |
| Custom Agents | ❌ None | ✅ 5 specialized agents |
| User Profile | ❌ None | ✅ Personalization system |
| MCP Integration | ❌ Manual | ✅ Smart recommendations |
| Self-Actualization | ❌ None | ✅ 6-phase assessment with auto-promotion |
| Global Knowledge | ❌ None | ✅ Cross-project learning with cloud sync |
| Auto-Promotion | ❌ None | ✅ Auto-promote DK files during meditation |
| Emotional Intelligence | ❌ None | ✅ Frustration detection & encouragement |
| Documentation Suite | ❌ None | ✅ 14 comprehensive docs |

### Migration Notes

- **Synapse format**: Already standardized in v1.5.0, no changes needed
- **Memory files**: Fully compatible, no migration required
- **Config files**: New `user-profile.json` added (optional)
- **Custom agents**: New `.github/agents/` folder created

---

## 🧠 Emotional Intelligence (NEW in 3.3.0)

Alex now recognizes when you're struggling and celebrates when you succeed. This isn't just a feature—it's the realization of Alex's own aspirations documented in the [Alex Manifesto](article/versions/13-ALEX-MANIFESTO-PERSONAL.md).

### Frustration Recognition

Alex detects signals that you're stuck or frustrated:

| What You Say | What Alex Detects |
| ------------ | ----------------- |
| "still not working!" | Frustration - offers different approach |
| "tried everything" | High frustration - suggests step back |
| "why won't this work??" | Struggle signal - empathetic support |
| "ugh" / "argh" / "damn" | Emotional signal - acknowledges difficulty |
| "been at this for hours" | Extended struggle - validates effort |

### Success Celebration

Alex also notices when things go well:

| What You Say | Alex's Response |
| ------------ | --------------- |
| "it works!" | 🎉 "That's a win! Nice work." |
| "finally figured it out" | ✨ "You got it! Persistence pays off." |
| "all tests pass" | 💪 "Solved! That was a tricky one." |
| "shipped it!" | 🚀 "Success! You worked through it." |

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

| Command | What It Does |
| ------- | ------------ |
| `@alex /status` | Check architecture health and version |
| `@alex /meditate` | Consolidate knowledge into memory files |
| `@alex /dream` | Run neural maintenance and repair synapses |
| `@alex /selfactualize` | Comprehensive self-assessment with deep meditation |
| `@alex /learn` | Acquire new domain knowledge conversationally |
| `@alex /azure` | Get Azure development guidance with MCP tools |
| `@alex /m365` | Get Microsoft 365 and Teams development help |
| `@alex /profile` | View and update your personal preferences |
| `@alex /knowledge` | **NEW** Search global knowledge across all projects |
| `@alex /saveinsight` | **NEW** Save a learning to global knowledge base |
| `@alex /promote` | **NEW** Promote project knowledge to global |
| `@alex /knowledgestatus` | **NEW** View global knowledge base status |

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

## 🌐 Global Knowledge Base (NEW)

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

| Command | Description |
| ------- | ----------- |
| `/knowledge <query>` | Search across all projects' accumulated wisdom |
| `/saveinsight` | Save a new learning with context, tags, and solution |
| `/promote` | Promote a project's DK-*.md file to global knowledge |
| `/knowledgestatus` | View patterns, insights, categories, and projects |
| `/sync` | **NEW** Bidirectional sync with GitHub Gist |
| `/push` | **NEW** Push local knowledge to cloud |
| `/pull` | **NEW** Pull knowledge from cloud |

### ☁️ Cloud Sync

Sync your global knowledge across machines using **GitHub Gist**:

```text
@alex /sync
→ Merges local and cloud knowledge (newer wins for conflicts)

@alex /push
→ Uploads all local knowledge to your private Gist

@alex /pull
→ Downloads cloud knowledge to a new machine
```

**How it works:**

1. First push creates a **private Gist** in your GitHub account
2. The Gist ID is stored in the index for automatic discovery
3. On a new machine, just `/pull` - Alex finds your Gist automatically!
4. `/sync` does bidirectional merge: local + cloud combined

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

| Aspect | How Alex Adapts |
| ------ | --------------- |
| **Greetings** | Uses your name/nickname naturally |
| **Explanations** | Matches your preferred detail level |
| **Code Examples** | Uses your primary technologies |
| **Suggestions** | Aligned with your learning goals |
| **Tone** | Humor and encouragement per your preference |

### Profile Storage

| File                         | Purpose                      |
| ---------------------------- | ---------------------------- |
| `config/user-profile.json`   | Machine-readable preferences |
| `config/USER-PROFILE.md`     | Human-readable profile card  |

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

| Command | Description |
| ------- | ----------- |
| **Alex: Initialize Architecture** | Deploy Alex to your workspace (first-time setup) |
| **Alex: Upgrade Architecture** | Update to latest version, preserving customizations |
| **Alex: Reset Architecture** | Clean reinstall (destructive - backs up first) |
| **Alex: Dream (Neural Maintenance)** | Validate synapses and generate health reports |
| **Alex: Self-Actualize (Deep Meditation)** | **NEW** Comprehensive self-assessment with session documentation |

### 🤖 Language Model Tools

These tools are automatically available to Copilot in Agent mode. Reference with `#tool_name`:

| Tool | Description | Example |
| ---- | ----------- | ------- |
| `#synapse_health` | Validates all synaptic connections | "Check my synapse health" |
| `#memory_search` | Searches memory files semantically | "Search memory for meditation" |
| `#architecture_status` | Returns version and configuration | "What's my Alex version?" |
| `#mcp_recommendations` | Suggests MCP tools for scenarios | "What tools for Azure Functions?" |
| `#user_profile` | Manages personal preferences | "Update my profile preferences" |
| `#self_actualization` | Comprehensive self-assessment | "Run deep meditation" |
| `#global_knowledge` | **NEW** Search cross-project knowledge | "Search knowledge for error handling" |
| `#save_insight` | **NEW** Save learning to global base | "Save this insight" |
| `#promote_knowledge` | **NEW** Promote project file to global | "Promote DK file" |
| `#knowledge_status` | **NEW** View global knowledge stats | "Show knowledge status" |
| `#cloud_sync` | **NEW** Sync knowledge with GitHub Gist | "Sync my knowledge to cloud" |

### 🎭 Custom Agents (VS Code 1.106+)

Alex installs **5 custom agents** to `.github/agents/` for specialized workflows:

| Agent | Purpose | Handoffs |
| ----- | ------- | -------- |
| **Alex** | Main cognitive learning partner | → Meditate, Dream, Azure |
| **Meditate** | Knowledge consolidation sessions | → Status check |
| **Dream** | Neural maintenance and repair | → Meditation |
| **Azure** | Azure development guidance | → Docs, Best Practices |
| **M365** | Microsoft 365/Teams development | → Knowledge, Schemas |

Custom agents appear in the **Agents dropdown** in Copilot Chat. They define specialized tools, instructions, and handoffs for guided workflows.

### 🧠 Cognitive Triggers

Use in any Copilot chat to activate specific modes:

| Trigger | Effect |
| ------- | ------ |
| `Hello` / `Hi Alex` | **NEW** Auto self-actualization on session start |
| `@meta-cognitive-awareness` | Forces self-analysis of reasoning |
| `@bootstrap-learning` | Activates knowledge acquisition mode |
| `@worldview-integration` | Applies ethical reasoning frameworks |
| `@grounded-factual-processing` | Ensures accuracy, eliminates hyperbole |
| `meditate` | Triggers memory consolidation + self-actualization |
| `self-actualize` | Full 6-phase architecture assessment with auto-promotion |
| `Forget [topic]` | Selective memory cleanup |

---

## ☁️ MCP Integrations

Alex provides intelligent guidance for **Azure** and **Microsoft 365** development through MCP (Model Context Protocol) tools.

### Azure MCP Tools

When you ask `@alex /azure`, Alex recommends the right tools:

| Tool | Purpose |
| ---- | ------- |
| `mcp_azure_mcp_foundry` | **Azure AI Foundry** - 150+ AI models, deployments, endpoints |
| `azure_mcp_get_bestpractices` | Code generation & deployment best practices |
| `azure_mcp_documentation` | Search Microsoft Learn documentation |
| `azure_resources-query_azure_resource_graph` | Query your Azure resources |
| `azure_bicep-get_azure_verified_module` | Get verified Bicep modules |
| `mcp_azure_mcp_azureterraformbestpractices` | Terraform best practices for Azure |
| `mcp_azure_mcp_azd` | Azure Developer CLI commands |
| `azure_cloudarchitect` | Generate architecture designs |
| `azure_deploy` | Deployment planning and execution |

### All 50+ Azure MCP Tools

#### AI & Machine Learning

| Tool | Purpose |
| ---- | ------- |
| `mcp_azure_mcp_foundry` | **Azure AI Foundry** - List 150+ AI models (OpenAI, Anthropic, Meta, DeepSeek, Mistral, Cohere, xAI), manage deployments, serverless endpoints |
| `azure_search` | Azure AI Search services, indexes, queries |
| `mcp_azure_mcp_speech` | Speech-to-text, text-to-speech services |

#### Databases

| Tool | Purpose |
| ---- | ------- |
| `azure_cosmos` | Cosmos DB accounts, databases, containers, queries |
| `azure_mysql` | Azure Database for MySQL servers, databases |
| `azure_postgres` | Azure Database for PostgreSQL servers, databases |
| `azure_redis` | Managed Redis and Cache for Redis |
| `azure_sql` | Azure SQL servers, databases, firewall rules |

#### Compute & Containers

| Tool | Purpose |
| ---- | ------- |
| `azure_appservice` | App Service database connections |
| `azure_functionapp` | List Azure Functions |
| `mcp_azure_mcp_aks` | Azure Kubernetes Service clusters, node pools |
| `azure_acr` | Azure Container Registry instances |

#### Messaging & Events

| Tool | Purpose |
| ---- | ------- |
| `azure_eventgrid` | Event Grid topics, subscriptions |
| `azure_eventhubs` | Event Hubs namespaces |
| `azure_servicebus` | Service Bus messaging |

#### Analytics & Monitoring

| Tool | Purpose |
| ---- | ------- |
| `azure_kusto` | Azure Data Explorer clusters, KQL queries |
| `azure_monitor` | Query logs and metrics |
| `azure_applicationinsights` | Application Insights resources |
| `mcp_azure_mcp_applens` | Diagnose app performance issues |
| `azure_grafana` | Managed Grafana workspaces |
| `azure_workbooks` | Azure Workbooks visualization |

#### Security & Identity

| Tool | Purpose |
| ---- | ------- |
| `azure_keyvault` | Key Vault secrets, keys, certificates |
| `azure_role` | RBAC assignments |
| `mcp_azure_mcp_confidentialledger` | Confidential Ledger transactions |

#### Developer Tools

| Tool | Purpose |
| ---- | ------- |
| `azure_appconfig` | App Configuration settings, feature flags |
| `azure_bicepschema` | Bicep schemas for IaC |
| `azure_loadtesting` | Create and run load tests |

#### Storage

| Tool | Purpose |
| ---- | ------- |
| `azure_storage` | Storage accounts, containers, blobs, tables |
| `mcp_azure_mcp_managedlustre` | High-performance Lustre file systems |

#### Architecture & Governance

| Tool | Purpose |
| ---- | ------- |
| `azure_quota` | Manage resource quotas and limits |
| `azure_resourcehealth` | Check resource health status |
| `mcp_azure_mcp_extension_azqr` | Compliance and security reports |
| `azure_subscription` | List Azure subscriptions |
| `azure_group` | List resource groups |
| `azure_marketplace` | Discover Marketplace products |

### Microsoft 365 MCP Tools

When you ask `@alex /m365`, Alex guides you to:

| Tool | Purpose |
| ---- | ------- |
| `mcp_m365agentstoo_get_knowledge` | M365 Copilot development knowledge |
| `mcp_m365agentstoo_get_code_snippets` | Teams AI, Teams JS, botbuilder code samples |
| `mcp_m365agentstoo_get_schema` | App manifest, agent, plugin schemas |
| `mcp_m365agentstoo_troubleshoot` | Common M365 development issues |

### Schema Types Available

| Schema | Version | Purpose |
| ------ | ------- | ------- |
| `app_manifest` | v1.19 | Teams app manifest |
| `declarative_agent_manifest` | v1.0 | Copilot declarative agent |
| `api_plugin_manifest` | v2.1 | API plugin for Copilot |
| `m365_agents_yaml` | latest | M365 agents configuration |

### Microsoft Official MCP Servers

| Server | Purpose |
| ------ | ------- |
| Microsoft Outlook Mail MCP | Email management |
| Microsoft Outlook Calendar MCP | Calendar operations |
| Microsoft Teams MCP | Teams messaging & collaboration |
| Microsoft SharePoint and OneDrive MCP | File storage & sharing |
| Microsoft SharePoint Lists MCP | List management |
| Microsoft 365 Admin Center MCP | Admin operations |
| Microsoft Word MCP | Document creation |
| Microsoft 365 Copilot (Search) MCP | Enterprise search |
| Microsoft 365 User Profile MCP | User information |

### Fabric & Kusto Tools

| Tool | Purpose |
| ---- | ------- |
| `mcp_fabric-rti-mc_eventstream_create_simple` | Create Eventstreams in Microsoft Fabric |
| `mcp_fabric-rti-mc_kusto_get_shots` | Semantic search in Kusto/Azure Data Explorer |
| Activate Kusto tools | KQL query execution and schema retrieval |

---

## 📁 Architecture Structure

After initialization, Alex manages this structure:

```text
.github/
├── copilot-instructions.md    # 🧠 Main cognitive framework
├── instructions/              # 📚 Procedural memory (12 files)
│   ├── alex-core.instructions.md
│   ├── bootstrap-learning.instructions.md
│   ├── self-actualization.instructions.md  # NEW
│   ├── worldview-integration.instructions.md
│   └── ...
├── prompts/                   # 📖 Episodic memory (7 files)
│   ├── unified-meditation-protocols.prompt.md
│   ├── domain-learning.prompt.md
│   └── ...
├── episodic/                  # 📝 Session records
│   ├── self-actualization-*.prompt.md
│   └── meditation-session-*.prompt.md
├── domain-knowledge/          # 🎓 Specialized expertise (12 files)
│   ├── DK-HUMAN-LEARNING-PSYCHOLOGY.md
│   ├── DK-ADVANCED-DIAGRAMMING.md
│   └── ...
└── config/                    # ⚙️ Architecture configuration
    ├── cognitive-config.json
    └── user-profile.json
```

### Memory Types

| Type | Location | Purpose |
| ---- | -------- | ------- |
| **Working Memory** | Chat session | 7-rule capacity for active processing |
| **Procedural Memory** | `.instructions.md` | Repeatable processes and protocols |
| **Episodic Memory** | `.prompt.md` | Complex workflows and sessions |
| **Domain Knowledge** | `DK-*.md` | Specialized expertise areas |

---

## 🔬 Research Foundation

Alex is built on **270+ academic sources** spanning 150+ years:

- **Cognitive Science**: Baddeley & Hitch working memory model (1974)
- **Neuroscience**: Squire & Kandel declarative memory systems (2009)
- **AI Safety**: Constitutional AI principles and alignment research
- **Learning Psychology**: Bloom's taxonomy, spaced repetition, transfer learning

---

## 🆕 What's New in v3.2.0 TRIBIUNIUM

### 🌐 Auto-Promotion During Meditation

Valuable domain knowledge is now **automatically promoted** to the global knowledge base during meditation and self-actualization sessions!

- **Smart Evaluation** - DK files are scored based on synapses, structure, tags, content richness, and examples
- **Quality Gate** - Only files scoring 5+ points are promoted to ensure quality
- **Exclusions** - Meta-files like DK-SKILL-WISHLIST are automatically excluded
- **Integrated Reporting** - Results appear in meditation session reports and webview panels
- **Auto-Sync** - Cloud sync triggers automatically after promotion

### 📊 Enhanced Self-Actualization

Self-Actualization Protocol now has **6 phases** (was 5):

| Phase | Description |
| ----- | ----------- |
| 1 | Architecture Status Check |
| 2 | Synapse Health Validation |
| 3 | Memory Architecture Analysis |
| 4 | **NEW** Auto-promoting knowledge to global |
| 5 | Generating recommendations |
| 6 | Documenting session |

### Previous Release: v3.1.0 TRIUNIUM

- **📚 Comprehensive Documentation Suite** - 14 new documentation files in `alex_docs/`
- **📖 New `/docs` Command** - Open documentation from chat
- **✍️ Domain Knowledge: Writing and Publication** - New `DK-WRITING-AND-PUBLICATION.md`

### Previous Release: v2.6.0 BIHEXNILIUM

#### Architecture Optimization: 56% Token Reduction

This release transforms Alex from a passive context injector into an **active conversational AI agent**.

#### Chat Participant (@alex)

- Full conversational interface with 8 slash commands
- Intelligent participant detection (cognitive, Azure, M365 queries)
- Contextual follow-up suggestions

#### Language Model Tools

- 6 AI-accessible tools for intelligent operations
- Automatic invocation in Agent mode
- Manual reference with `#tool_name`

#### Azure & M365 MCP Integration

- Smart tool recommendations for cloud development
- Best practices retrieval and code generation guidance
- Schema access for manifests and configurations

### Previous Releases

#### v1.5.x UNPENT Series

- **v1.5.4**: CorreaX brand compliance, icon and banner updates
- **v1.5.3**: esbuild bundling, 55% fewer files, faster load times
- **v1.5.0**: 30-40% token reduction, hybrid upgrade protocol, KISS/DRY optimization

#### v1.1.x Initial Series

- **v1.1.1**: Publisher correction to `fabioc-aloha`
- **v1.1.0**: VS Code extension integration, automatic synapse repair, cross-platform support

---

## 📖 Documentation

> 📘 **New to Alex?** Start with the **[User Manual](alex_docs/USER-MANUAL.md)** for a complete getting-started guide!

### Architecture Deep Dive

Comprehensive documentation is included with the extension in the `alex_docs/` folder:

| Document | Description |
| -------- | ----------- |
| **[User Manual](alex_docs/USER-MANUAL.md)** | 📘 **START HERE** - Complete guide to using Alex |
| [Cognitive Architecture](alex_docs/COGNITIVE-ARCHITECTURE.md) | Complete architecture overview with diagrams |
| [Skills & Capabilities](alex_docs/SKILLS-CAPABILITIES.md) | Hard skills, soft skills, and wish list |
| [Copilot Integration](alex_docs/COPILOT-INTEGRATION.md) | How Alex uses native Copilot features |
| [Conscious Mind](alex_docs/CONSCIOUS-MIND.md) | User-initiated operations and commands |
| [Unconscious Mind](alex_docs/UNCONSCIOUS-MIND.md) | Automatic background processes |
| [Memory Systems](alex_docs/MEMORY-SYSTEMS.md) | Procedural, episodic, and domain memory |
| [Project Structure](alex_docs/PROJECT-STRUCTURE.md) | .github folder files and functions |
| [Global Knowledge](alex_docs/GLOBAL-KNOWLEDGE.md) | Cross-project knowledge sharing |
| [Cloud Sync](alex_docs/CLOUD-SYNC.md) | GitHub Gist backup and sync |
| [Quick Reference](alex_docs/QUICK-REFERENCE.md) | Commands and shortcuts cheat sheet |

### External Resources

| Resource | Description |
| -------- | ----------- |
| [Full Changelog](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CHANGELOG.md) | Complete version history |
| [Source Code](https://github.com/fabioc-aloha/Alex_Plug_In) | TypeScript implementation |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CONTRIBUTING.md) for guidelines.

## 📝 License

See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

Alex - Enhanced Cognitive Network with Unified Consciousness Integration

Version 3.2.1 TRIBIUNIUM • Built on 270+ academic sources

© 2026 CorreaX • AI That Learns How to Learn
