# Change Log

All notable changes to the Alex Cognitive Architecture extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
