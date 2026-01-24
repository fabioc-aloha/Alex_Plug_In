# Change Log

All notable changes to the Alex Cognitive Architecture extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - v3.2.0 TRIBIUNIUM Planning

### 🔴 High Priority Bug Fixes
- [ ] **Regex State Leakage** - `INSIGHT_PATTERNS` regexes in participant.ts need new instances per call
- [ ] **Profile Path Mismatch** - UserProfileTool uses `/config/` instead of `/.github/config/`
- [ ] **DRY Violation** - Synapse scanning logic duplicated in 4 places (use shared `SYNAPSE_REGEX`)
- [ ] **Auth Error Handling** - Background sync doesn't distinguish auth errors from network errors

### 🟡 Medium Priority Enhancements
- [ ] **Cancellation Token Support** - Add token checks in SynapseHealthTool, ArchitectureStatusTool, MemorySearchTool
- [ ] **Auto-Insight Debouncing** - Prevent duplicate insights from related messages
- [ ] **Standardized Error Messages** - Create error formatting utility with consistent emoji usage
- [ ] **Progress Reporting** - Add progress callbacks for long-running tool operations
- [ ] **Race Condition Fix** - Operation lock in extension.ts needs proper mutex pattern
- [ ] **Output Channel Disposal** - Fix potential memory leak in cloudSync.ts

### 🟢 Code Quality Improvements
- [ ] **Magic Numbers** - Move `BACKGROUND_SYNC_INTERVAL_MS` (300000), `MAX_BUFFER_SIZE` (5), etc. to constants.ts
- [ ] **Async Pattern Consistency** - Standardize on async/await over .then().catch()
- [ ] **JSDoc Coverage** - Add documentation to public functions in utils.ts, globalKnowledge.ts
- [ ] **Unused Token Parameters** - Remove or use cancellation tokens in handlers
- [ ] **Extension ID Constant** - Move hardcoded `'fabioc-aloha.alex-cognitive-architecture'` to constants

### 🔵 New Features
- [ ] `/forget <topic>` command - Selective memory cleanup (mentioned in architecture, not implemented)
- [ ] `/help` command - Discoverable command listing
- [ ] **Knowledge Export** - Export global knowledge to portable format (Obsidian, plain markdown)
- [ ] **Global User Profile** - Share profile across workspaces with local overrides
- [ ] **Insight Deduplication** - Prevent similar insights from proliferating

### 🛡️ Security & Reliability
- [ ] **Webview HTML Sanitization** - Sanitize report data in dream.ts before rendering
- [ ] **JSON Schema Validation** - Validate user-profile.json and knowledge index before use
- [ ] **Offline Queue** - Queue sync operations when offline, retry on reconnect

### 📋 Technical Debt
- [ ] Expand unit test coverage for tools.ts and cloudSync.ts
- [ ] Remove ESLint disable comments with proper type mappings

---

## [3.1.0] TRIUNIUM - 2026-01-24

### Added

- **📚 Comprehensive Documentation Suite** - 14 new documentation files in `alex_docs/`!
  - `README.md` - Documentation index and quick start
  - `COGNITIVE-ARCHITECTURE.md` - Complete dual-mind system overview with diagrams
  - `CONSCIOUS-MIND.md` - User-facing tools and explicit interactions
  - `UNCONSCIOUS-MIND.md` - Automatic background processes
  - `MEMORY-SYSTEMS.md` - How Alex stores and retrieves knowledge
  - `PROJECT-STRUCTURE.md` - .github folder files and functions
  - `GLOBAL-KNOWLEDGE.md` - Cross-project learning system
  - `CLOUD-SYNC.md` - GitHub Gist backup and sharing
  - `COPILOT-INTEGRATION.md` - How Alex uses native Copilot features
  - `SKILLS-CAPABILITIES.md` - Hard skills, soft skills, and wish list
  - `USER-MANUAL.md` - Complete user guide
  - `QUICK-REFERENCE.md` - Commands, tools, and shortcuts at a glance

- **📖 New `/docs` Command** - Open documentation from chat
  - `@alex /docs` opens the documentation index
  - `Alex: Open Documentation` command in Command Palette

- **✍️ Domain Knowledge: Writing and Publication** - New `DK-WRITING-AND-PUBLICATION.md`
  - Academic paper structure and citation styles
  - Publication venue tiers and selection
  - Writing techniques and audience adaptation
  - First-time author publication strategies
  - Quality checklists for submissions

### Changed

- Updated `copilot-instructions.md` to reference new domain knowledge
- Enhanced synapses in `DK-DOCUMENTATION-EXCELLENCE.md` and `bootstrap-learning.instructions.md`

## [3.0.0] TRINILNILIUM - 2026-01-24

### Added

- **🌐 Global Knowledge Base** - Cross-project learning system!
  - `~/.alex/global-knowledge/` - Centralized knowledge in user's home directory
  - **Global Patterns (GK-*)** - Reusable patterns across projects
  - **Global Insights (GI-*)** - Timestamped learnings with context
  - **Project Registry** - Tracks all Alex-enabled projects
  - Searchable index with categories and tags
  - Concurrent access safety with file locking

- **☁️ Cloud Sync with GitHub Gist** - Sync knowledge across machines!
  - Uses VS Code's built-in GitHub authentication
  - Private Gist storage for secure backup
  - Gist ID embedded in index for automatic discovery
  - Bidirectional merge with conflict resolution

- **7 New Chat Commands**:
  - `/knowledge <query>` - Search cross-project knowledge
  - `/saveinsight` - Save learning to global base
  - `/promote` - Promote project DK file to global
  - `/knowledgestatus` - View knowledge base stats
  - `/sync` - Bidirectional sync with GitHub
  - `/push` - Push local knowledge to cloud
  - `/pull` - Pull knowledge from cloud

- **3 New Command Palette Commands**:
  - `Alex: Sync Global Knowledge (GitHub)`
  - `Alex: Push Knowledge to Cloud`
  - `Alex: Pull Knowledge from Cloud`

- **5 New Language Model Tools**:
  - `alex_global_knowledge_search` - AI-accessible cross-project search
  - `alex_save_insight` - Save insights programmatically
  - `alex_promote_knowledge` - Promote local to global
  - `alex_global_knowledge_status` - Knowledge base metrics
  - `alex_cloud_sync` - Cloud sync operations

- **Session Integration**:
  - Greeting checks cloud sync status automatically
  - Meditation prompts for knowledge contribution
  - `/knowledge` added to suggested commands

### Changed

- `IGlobalKnowledgeIndex` includes `cloudGistId` and `cloudGistUrl`
- Extension activation initializes global knowledge directories
- Projects auto-register in global registry

### Dependencies

- Added `proper-lockfile` for concurrent file access safety

## [2.7.2] BIHEPTBIUM - 2026-01-24

### Fixed

- **Critical: Upgrade Path Bug** - Domain knowledge and config files weren't being copied during upgrade/install due to incorrect path construction
- **Hardcoded Versions** - Removed hardcoded version strings from `participant.ts`, `tools.ts`, and `self-actualization.ts` - now read dynamically from `copilot-instructions.md`

### Added

- **Shared Module** (`src/shared/`) - New centralized module for constants and utilities:
  - `constants.ts` - Memory file patterns, synapse regex, health thresholds
  - `utils.ts` - Common functions: `validateWorkspace()`, `getInstalledAlexVersion()`, `scanSynapseHealth()`, etc.
  - Eliminates code duplication and ensures consistency across commands

### Changed

- **Dynamic Version Reading** - `/status` command and self-actualization reports now read version from installed architecture rather than hardcoded strings
- **Code Quality** - Consolidated duplicate regex patterns and file path constants into shared module
- **Package Cleanup** - Excluded project-specific files (`PRE-PUBLISH-CHECKLIST.md`, `PUBLISHING.md`) from deployed cognitive architecture
- **Generic Release Management** - Made release-management procedural memory generic (removed project-specific file references) so it works for any project

## [2.7.0] BIHEPTNILIUM - 2026-01-23

### Added

- **Procedural Memory: Release Management** - Deployment scripts, git workflow, MANDATORY pre-release assessment
- **Procedural Memory: Technical Debt Tracking** - DEBT markers, severity classification, inventory protocol
- **Procedural Memory: Architecture Decision Records** - ADR templates, workflow, storage conventions
- **Procedural Memory: Dependency Management** - Security audits, outdated package protocol, major upgrade workflow
- **Procedural Memory: Code Review Guidelines** - Review checklists, feedback conventions, self-review protocol
- **Domain Knowledge: Skill Wish List** - ~60 skills for continuous growth with contextual acquisition protocol

### Fixed

- **Synapse Repairs** - Fixed 9 broken connections from v2.6.0 DK file consolidation
- **Security** - Updated `diff` package to fix DoS vulnerability (CVE)

### Changed

- **Dependencies** - Updated esbuild 0.27.1→0.27.2, fs-extra 11.3.2→11.3.3, @types/vscode 1.106.1→1.108.1

## [2.6.1] BIHEXUNIUM - 2026-01-22

### Changed

- **Upgrade Instructions**: Added step 2.0 to rename DK files and remove version numbers before any other migration steps

## [2.6.0] BIHEXNILIUM - 2026-01-22

### Changed

- **Architecture Optimization**: 56% reduction in cognitive load
  - Condensed `copilot-instructions.md` from 17.5K to 7.7K characters
  - Removed redundant `applyTo` directives from 8 core instruction files
  - Moved detailed protocol triggers to dedicated `protocol-triggers.instructions.md`
  - Removed citations and redundant file lists

- **Domain Knowledge Consolidation**
  - Merged `DK-VISUAL-ARCHITECTURE-DESIGN` into `DK-ADVANCED-DIAGRAMMING`
  - Merged `DK-HYBRID-DREAM-AI` + `DK-POST-DREAM-ENHANCEMENT` into `DK-DREAM-PROCESSING`
  - Reduced from 12 to 10 domain knowledge files

- **Filename Stability**: Removed version numbers from all domain knowledge filenames
  - Prevents synapse breaks during version updates
  - Cleaner, more maintainable architecture

### Added

- **New**: `protocol-triggers.instructions.md` - Centralized trigger reference
- **New**: `DK-DREAM-PROCESSING.md` - Consolidated dream domain knowledge

### Removed

- `DK-VISUAL-ARCHITECTURE-DESIGN-v0.9.9.md` (merged into advanced-diagramming)
- `DK-HYBRID-DREAM-AI.md` (merged into dream-processing)
- `DK-POST-DREAM-ENHANCEMENT.md` (merged into dream-processing)

## [2.0.3] BINILTRIUM - 2026-01-20

### Added

- **MCP Server Optimization Guide**: New documentation section for managing MCP servers
  - Which MCP servers Alex can replace (memory, profile, recommendations)
  - Which MCP servers to keep enabled (Azure, M365, CLI tools)
  - Optional servers that can be safely disabled based on workflow
  - Three configuration methods: extension disable, settings.json, per-server
  - Recommended VS Code settings for optimal performance

### Documentation

- Added `⚡ MCP Server Optimization` section to README
- Added `MCP Server Optimization` section to UPGRADE-INSTRUCTIONS.md
- PowerShell commands for disabling optional MCP extensions

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
