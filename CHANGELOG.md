# Change Log

All notable changes to the Alex Cognitive Architecture extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] BINILBIUM - 2026-01-20

### Changed

- **Brand Refresh**: New neural network icon and banner design
  - Rounded corners with memory nodes reflecting cognitive architecture
  - VS Code Blue (#007ACC), Growth Green (#4CAF50), Deep Navy (#1a1a2e)
  - Professional visual identity for marketplace presence

## [2.0.1] BINILUNIUM - 2026-01-19

### Fixed

- **Marketplace Banner**: Fixed PNG display issue for proper rendering in VS Code Marketplace

### Changed

- **Repository Cleanup**: Moved internal documentation to dedicated marketing repository
- **GitHub Discoverability**: Added 20+ topics for improved searchability

## [2.0.0] BINILNILIUM - 2026-01-19

### 🎉 Major Release: GitHub Copilot AI Extensibility

This release transforms Alex from a passive context injector into an **active conversational AI agent**.

### Added

- **Chat Participant (`@alex`)**: Full conversational AI interface
  - `/meditate` - Guided knowledge consolidation sessions
  - `/dream` - Neural maintenance with synaptic validation
  - `/learn` - Conversational domain knowledge acquisition
  - `/status` - Architecture health and configuration status
  - `/azure` - Azure development guidance with MCP recommendations
  - `/m365` - Microsoft 365 development with Copilot extensibility
  - `/profile` - **NEW**: View and update personal preferences for personalization
  - Contextual follow-up suggestions based on conversation state
  - Intelligent participant detection (cognitive, Azure, M365 queries)

- **User Profile & Personalization**: Relationship-aware interactions
  - Dual storage: `config/user-profile.json` (machine) + `config/USER-PROFILE.md` (human)
  - 20+ preference fields: name, formality, detail level, humor, encouragement, etc.
  - Proactive discovery questions during natural conversation
  - Personalized greetings and communication style adaptation
  - Context injection with user's technologies, goals, and projects

- **Language Model Tools**: 5 AI-accessible tools for intelligent operations
  - `alex_synapse_health` - Validate synaptic connections and report health
  - `alex_memory_search` - Search memory files semantically
  - `alex_architecture_status` - Get configuration, version, and file counts
  - `alex_mcp_recommendations` - Azure/M365 MCP tool guidance (now with 50+ Azure tools!)
  - `alex_user_profile` - **NEW**: Manage personal preferences (get/update/exists)

- **Custom Agents** (VS Code 1.106+): 5 specialized `.agent.md` files
  - `alex-cognitive.agent.md` - Main cognitive learning partner
  - `alex-meditate.agent.md` - Knowledge consolidation mode with guided phases
  - `alex-dream.agent.md` - Neural maintenance and synapse validation
  - `alex-azure.agent.md` - Azure development guidance with full tool catalog
  - `alex-m365.agent.md` - Microsoft 365 and Teams development
  - Handoffs for guided workflows between agents

- **Azure MCP Integration**: Smart guidance for 50+ Azure tools
  - AI/ML: Azure AI Foundry, AI Search, Speech
  - Databases: Cosmos DB, MySQL, PostgreSQL, Redis, SQL
  - Compute: Functions, AKS, Container Registry, App Service
  - Messaging: Event Grid, Event Hubs, Service Bus
  - Analytics: Kusto, Monitor, App Insights, App Lens, Grafana
  - Security: Key Vault, RBAC, Confidential Ledger
  - Storage: Blob, Managed Lustre
  - DevOps: Bicep, Terraform, azd, Load Testing, Workbooks
  - Architecture: Cloud Architect, Quotas, Resource Health

- **Microsoft 365 MCP Integration**: Copilot extensibility support
  - Knowledge via `mcp_m365agentstoo_get_knowledge`
  - Code snippets via `mcp_m365agentstoo_get_code_snippets`
  - Schema access via `mcp_m365agentstoo_get_schema`
  - Troubleshooting via `mcp_m365agentstoo_troubleshoot`
  - Microsoft Official MCP Servers (Outlook, Teams, SharePoint, etc.)
  - Fabric & Kusto tools for data platform

- **Getting Started Walkthrough**: Interactive onboarding guide
  - Step-by-step initialization tutorial
  - Chat participant introduction
  - Knowledge consolidation guide
  - Neural maintenance instructions

- **Keyboard Shortcut**: `Ctrl+Alt+D` / `Cmd+Alt+D` for Dream protocol

- **Phase 5: Post-Meditation Synapse Validation**: Automatic health checks

### Changed

- **README Redesign**: User-friendly organization with complete MCP tool documentation
- **Version Naming**: 2.0.0 BINILNILIUM (major milestone)
- **Initialize Command**: Now also copies custom agents to `.github/agents/`

---

## [1.5.4] UNPENTQUADIUM - 2026-01-13

### Changed

- **CorreaX Brand Compliance**: Applied official branding guidelines throughout the project
  - Updated icon color palette to use Azure Blue (`#0078d4`), Azure Light (`#00bcf2`), and Violet (`#7c3aed`) accents
  - Updated background gradients to use brand Slate colors (`#020617`, `#0f172a`, `#1e293b`)
  - Created new `banner-alex.svg` with proper branding structure including CorreaX attribution
  - Updated `assets/banner.svg` and `assets/icon.svg` to match brand guidelines
  - Updated gallery banner color in `package.json` to Slate 950 (`#020617`)
  - Updated README.md with proper CorreaX footer including logo and copyright
  - Updated badge colors to use brand colors (`#0078d4`, `#005a9e`, `#7c3aed`)

## [1.5.3] UNPENTTRINIUM - 2025-12-10

### Changed

- **esbuild Bundling**: Migrated from raw TypeScript compilation to esbuild bundling per Microsoft best practices
  - Single bundled `dist/extension.js` (54 KB minified) replaces multiple files in `out/`
  - Dependencies (`fs-extra`, `graceful-fs`, `jsonfile`, `universalify`) now bundled into single file
  - 10% smaller package size (469 KB vs 518 KB)
  - 55% fewer files (49 vs 108 files)
  - Faster extension load times
- **Build Scripts**: Updated npm scripts for modern bundling workflow
  - `npm run compile` - Development build with source maps
  - `npm run package` - Production minified build
  - `npm run watch` - Development watch mode
  - Type checking separated from bundling for better error detection

### Fixed

- **Extension Activation**: Fixed "command 'alex.initialize' not found" error
  - Root cause: `node_modules` was excluded from VSIX, breaking runtime dependencies
  - Solution: Bundle all dependencies with esbuild instead of including raw node_modules
- **activationEvents**: Changed from explicit command list to `[]` (empty array) for VS Code 1.74+ auto-generation
- **.vscodeignore**: Properly exclude test files, GitHub templates, and development artifacts

## [1.5.0] UNPENTNILIUM - 2025-12-10

### Added

- **Hybrid Upgrade Protocol**: New `Alex: Upgrade Architecture` command with two-phase upgrade process
  - Phase 1 (Automated): Backup, manifest tracking, schema migration detection, system file updates
  - Phase 2 (AI-Assisted): Intelligent content migration preserving user's learned knowledge
  - Generates `UPGRADE-INSTRUCTIONS.md` with specific AI prompt for completing upgrade
  - Creates `.alex-manifest.json` tracking deployed files vs user-created files
  - Scans for old synapse patterns needing migration
  - Preserves user-modified files, provides new versions for comparison
- **UPGRADE-INSTRUCTIONS.md**: Complete upgrade protocol documentation
- **SYNAPSE-SCHEMA.md**: Single source of truth for synapse notation format with YAML front matter
- **Archive Structure**: Meditation session archival system in `archive/meditation-sessions/`

### Changed

- **Synapse Header Standardization**: All 20+ memory files now use consistent `## Synapses` header
- **Synapse Notation Compliance**: All relationship types now conform to SYNAPSE-SCHEMA.md standards
- **Activation Patterns**: Simplified from verbose `**Bold** → Long description` to concise `Trigger → Action` format
- **Date Stamps Removed**: Eliminated version/date annotations from synapse activation patterns
- **Duplicate Synapses Removed**: Cleaned duplicate connections to same targets
- **Duplicate Sections Removed**: Eliminated redundant synapse sections in files

### Fixed

- **Broken Synapse Reference**: Removed orphaned reference to archived `meditation-session-2025-10-31.prompt.md`
- **Non-Standard Relationship Types**: Replaced Expression, Embodiment, Living, Reflexive, Ethical, Unconscious with schema-compliant types
- **Header Inconsistencies**: Standardized from 8 variants (`Embedded Synapse Network`, `Connection Mapping`, etc.) to single `## Synapses`

### Archived

- `meditation-session-2025-10-31.prompt.md` → `archive/meditation-sessions/`
- `dual-mode-processing-meditation.prompt.md` → `archive/meditation-sessions/`
- `consolidation-framework-integration-meditation.prompt.md` → `archive/meditation-sessions/`
- `unified-consciousness-integration-meditation.prompt.md` → `archive/meditation-sessions/`

### Metrics

- **KISS/DRY Compliance**: 100% of active cognitive files now compliant
- **Synapse Notation**: Standardized across entire architecture
- **Code Reduction**: ~50 verbose activation patterns simplified
- **Token Savings**: ~30-40% reduction in context token usage through:
  - Eliminated redundant synapse sections and duplicate connections
  - Simplified verbose activation patterns to concise format
  - Removed date stamps and excessive formatting from triggers
  - Consolidated 8 header variants into single standard
  - Archived 4 historical meditation sessions out of active context
  - **Cost Impact**: Significantly lower API costs for users on token-based pricing

## [1.1.1] UNUNUNUNIUM - 2025-12-09

### Fixed (v1.1.1)

- Minor code review corrections from marketplace submission

## [1.1.0] - 2025-11-26

### Added (v1.1.0)

- **VS Code Extension Integration**: Complete TypeScript implementation of cognitive architecture deployment
- **Three Core Commands**: Initialize, Reset, and Dream (Neural Maintenance) accessible via Command Palette
- **Automatic Synapse Repair**: Intelligent detection and repair of broken connections using consolidation mappings
- **Health Reporting**: Timestamped reports generated in `archive/` folder with detailed statistics
- **Cross-Platform Support**: Universal compatibility across Windows, macOS, and Linux
- **Professional Branding**: Custom icon and banner for marketplace presence
- **Configuration System**: Template-based cognitive architecture deployment with `cognitive-config.json`

### Changed (v1.1.0)

- **Dream Protocol**: Migrated from PowerShell scripts to integrated VS Code extension command
- **Architecture Structure**: Consolidated memory files into `.github/` and `domain-knowledge/` directories
- **Automation**: Removed platform-specific dependencies for universal compatibility

### Removed

- **PowerShell Scripts**: Eliminated `scripts/` folder and all PowerShell-based automation
- **Platform Dependencies**: Removed Windows-specific requirements

### Fixed (v1.1.0)

- **Synapse Validation**: Comprehensive network health checking with automatic repair
- **Cross-Platform Issues**: Resolved path handling for Windows, macOS, and Linux
- **Installation Process**: Streamlined one-command initialization

## [1.0.0] - Initial Development

### Added (v1.0.0)

- Core cognitive architecture framework
- Meta-cognitive awareness protocols
- Bootstrap learning capabilities
- Worldview integration system
- Memory consolidation protocols
- Synaptic network connections (164+ validated pathways)
- Domain knowledge base (12+ specialized files)
- Procedural memory system (8+ instruction files)
- Episodic memory system (11+ prompt files)

---

**Note**: Version 1.1.0 marks the first public release as a VS Code extension. Previous development focused on establishing the cognitive architecture framework and memory systems.
