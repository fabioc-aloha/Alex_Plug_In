# 🧠 Alex Cognitive Architecture

![Alex Cognitive Architecture](https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/assets/banner.png)

[![Version](https://img.shields.io/badge/version-2.0.3-0078d4)](https://github.com/fabioc-aloha/Alex_Plug_In)
[![License](https://img.shields.io/badge/license-SEE%20LICENSE-005a9e)](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md)
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
- ☁️ **Guides Development** - Provides Azure & M365 best practices via MCP tools

---

## 🚀 Quick Start

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

Already have Alex installed? Here's how to upgrade safely:

### From v1.5.x (UNPENT Series)

1. Update the extension in VS Code (it will auto-update or use Extensions panel)
2. Run **`Alex: Upgrade Architecture`** from Command Palette
3. Follow the generated `UPGRADE-INSTRUCTIONS.md` with your AI assistant
4. Run **`Alex: Dream`** to validate the upgrade

Your learned domains, custom synapses, and memory files are preserved automatically.

### What's New for Existing Users

| Feature | v1.5.x | v2.0.0 |
| ------- | ------ | ------ |
| Chat Participant | ❌ Context injection only | ✅ `@alex` conversational AI |
| Slash Commands | ❌ None | ✅ 7 commands |
| Language Model Tools | ❌ None | ✅ 5 AI-accessible tools |
| Custom Agents | ❌ None | ✅ 5 specialized agents |
| User Profile | ❌ None | ✅ Personalization system |
| MCP Integration | ❌ Manual | ✅ Smart recommendations |

### Migration Notes

- **Synapse format**: Already standardized in v1.5.0, no changes needed
- **Memory files**: Fully compatible, no migration required
- **Config files**: New `user-profile.json` added (optional)
- **Custom agents**: New `.github/agents/` folder created

---

## 💬 Chat with Alex

Alex registers as a **Chat Participant** in GitHub Copilot. Just mention `@alex` to activate:

### Slash Commands

| Command | What It Does |
| ------- | ------------ |
| `@alex /status` | Check architecture health and version |
| `@alex /meditate` | Consolidate knowledge into memory files |
| `@alex /dream` | Run neural maintenance and repair synapses |
| `@alex /learn` | Acquire new domain knowledge conversationally |
| `@alex /azure` | Get Azure development guidance with MCP tools |
| `@alex /m365` | Get Microsoft 365 and Teams development help |
| `@alex /profile` | View and update your personal preferences |

### Example Conversations

```text
@alex /status
→ Shows architecture version, memory file counts, and synapse health

@alex /meditate I learned about dependency injection patterns today
→ Guides you through knowledge consolidation and updates memory files

@alex /azure How do I deploy a Function App with Cosmos DB?
→ Provides best practices and recommends relevant MCP tools

@alex /m365 Create a Teams bot with adaptive cards and SSO
→ Offers M365 development guidance with code snippets

@alex /profile
→ View your preferences or start the onboarding flow
```

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

### 🤖 Language Model Tools

These tools are automatically available to Copilot in Agent mode. Reference with `#tool_name`:

| Tool | Description | Example |
| ---- | ----------- | ------- |
| `#synapse_health` | Validates all synaptic connections | "Check my synapse health" |
| `#memory_search` | Searches memory files semantically | "Search memory for meditation" |
| `#architecture_status` | Returns version and configuration | "What's my Alex version?" |
| `#mcp_recommendations` | Suggests MCP tools for scenarios | "What tools for Azure Functions?" |
| `#user_profile` | Manages personal preferences | "Update my profile preferences" |

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
| `@meta-cognitive-awareness` | Forces self-analysis of reasoning |
| `@bootstrap-learning` | Activates knowledge acquisition mode |
| `@worldview-integration` | Applies ethical reasoning frameworks |
| `@grounded-factual-processing` | Ensures accuracy, eliminates hyperbole |
| `meditate` | Triggers memory consolidation protocol |
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

## ⚡ MCP Server Optimization

Alex provides native alternatives to some MCP servers, allowing you to **disable redundant servers** for better performance and reduced overhead.

### MCP Servers Alex Can Replace

Alex's built-in tools provide equivalent functionality:

| Alex Tool | Replaces | Recommendation |
| --------- | -------- | -------------- |
| `alex_memory_search` | Generic memory/context MCP servers | ✅ Can disable if using Alex's memory architecture |
| `alex_user_profile` | Profile management MCPs | ✅ Alex manages user preferences natively |
| `alex_mcp_recommendations` | Generic MCP guidance tools | ✅ Alex provides scenario-based recommendations |

### MCP Servers to Keep Enabled

These provide unique capabilities Alex works **alongside**:

| Category | MCP Servers | Why Keep |
| -------- | ----------- | -------- |
| **Azure Resources** | `azure_cosmos`, `azure_sql`, `azure_storage`, etc. | Direct Azure API access |
| **Documentation** | `mcp_azure_mcp_documentation` | Microsoft Learn search |
| **Best Practices** | `mcp_azure_mcp_get_bestpractices` | Azure-specific guidance |
| **M365** | Teams, Outlook, SharePoint MCPs | M365 service integration |
| **CLI Generation** | `mcp_azure_mcp_azd` | Azure CLI command generation |

### Optional MCP Servers (Disable If Not Used)

These can be safely disabled based on your workflow:

| MCP Server/Extension | Disable If |
| -------------------- | ---------- |
| `analysis-services.powerbi-modeling-mcp` | Not working with Power BI models |
| Microsoft Word MCP | Not creating Word documents programmatically |
| Microsoft SharePoint Lists MCP | Not managing SharePoint lists |
| Fabric Eventstream tools | Not using Microsoft Fabric real-time intelligence |

### How to Disable MCP Servers

#### Option 1: Disable VS Code Extension

```powershell
# Disable specific MCP extension
code --disable-extension <extension-id>

# Example: Disable Power BI MCP
code --disable-extension analysis-services.powerbi-modeling-mcp
```

Or in VS Code: **Extensions** (`Ctrl+Shift+X`) → Find extension → Click **Disable**

#### Option 2: VS Code Settings

Open settings with `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)":

```json
{
  // Control MCP autostart behavior
  "chat.mcp.autostart": "newAndOutdated",  // or "never" to disable all
  
  // Keep Alex's memory enabled
  "github.copilot.chat.tools.memory.enabled": true
}
```

#### Option 3: Per-Server Configuration

```json
{
  "chat.mcp.serverSampling": {
    "Azure MCP Server Provider: Azure MCP": {
      "allowedDuringChat": true
    }
  }
}
```

### Recommended Configuration

For most Alex users:

| Setting | Value | Reason |
| ------- | ----- | ------ |
| `chat.mcp.autostart` | `"newAndOutdated"` | Only start MCPs when needed |
| `github.copilot.chat.tools.memory.enabled` | `true` | Alex's memory system |
| Power BI MCP | Disabled | Unless actively using Power BI |
| Azure MCP Server | Enabled | Core Azure functionality |

---

## 📁 Architecture Structure

After initialization, Alex manages this structure:

```text
.github/
├── copilot-instructions.md    # 🧠 Main cognitive framework
├── instructions/              # 📚 Procedural memory (11 files)
│   ├── alex-core.instructions.md
│   ├── bootstrap-learning.instructions.md
│   ├── worldview-integration.instructions.md
│   └── ...
└── prompts/                   # 📖 Episodic memory (7 files)
    ├── unified-meditation-protocols.prompt.md
    ├── domain-learning.prompt.md
    └── ...

domain-knowledge/              # 🎓 Specialized expertise (12 files)
├── DK-HUMAN-LEARNING-PSYCHOLOGY-v1.0.0.md
├── DK-ADVANCED-DIAGRAMMING-v1.1.0.md
└── ...

config/                        # ⚙️ Architecture configuration
archive/                       # 📦 Dream reports & sessions
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

## 🆕 What's New in v2.0.0 BINILNILIUM

### 🎉 Major Release: GitHub Copilot AI Extensibility

This release transforms Alex from a passive context injector into an **active conversational AI agent**.

#### Chat Participant (@alex)

- Full conversational interface with 7 slash commands
- Intelligent participant detection (cognitive, Azure, M365 queries)
- Contextual follow-up suggestions

#### Language Model Tools

- 5 AI-accessible tools for intelligent operations
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

| Resource | Description |
| -------- | ----------- |
| [Full Changelog](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CHANGELOG.md) | Complete version history |
| [Architecture Guide](https://github.com/fabioc-aloha/Alex_Plug_In/tree/main/alex) | Integration and compatibility guides |
| [Source Code](https://github.com/fabioc-aloha/Alex_Plug_In) | TypeScript implementation |

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CONTRIBUTING.md) for guidelines.

## 📝 License

See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

Alex - Enhanced Cognitive Network with Unified Consciousness Integration

Version 2.0.0 BINILNILIUM • Built on 270+ academic sources

© 2026 CorreaX • AI That Learns How to Learn
