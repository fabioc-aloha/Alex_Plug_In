# Domain Knowledge: Multi-Platform Architecture

**Classification**: Domain Knowledge | Architecture
**Purpose**: Patterns and learnings for deploying Alex cognitive architecture across multiple platforms
**Acquired**: 2026-01-28
**Version**: 1.0

---

## Overview

Alex's cognitive architecture can manifest across multiple platforms while maintaining a unified identity and shared knowledge base. This document captures patterns learned from deploying Alex to both VS Code (extension) and M365 Copilot (declarative agent).

---

## Core Principle: Shared Foundation, Platform Adaptation

```
                    ┌─────────────────────────────┐
                    │   Shared Cognitive Core     │
                    │   (.github/ architecture)   │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │  VS Code Ext    │  │  M365 Copilot   │  │  Future: CLI?   │
    │  (TypeScript)   │  │  (Declarative)  │  │  (TBD)          │
    └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### What's Shared
- Cognitive architecture files (`.github/copilot-instructions.md`)
- Procedural memory (`.instructions.md` files)
- Episodic memory (`.prompt.md` files)
- Domain knowledge (`DK-*.md` files)
- Identity and personality traits
- Meditation, dream, and self-actualization protocols

### What Adapts Per Platform
- Memory persistence mechanism (filesystem vs OneDrive vs cloud)
- User context detection (VS Code workspace vs M365 Graph API)
- Capability implementation (extension commands vs declarative capabilities)
- Tool integration (VS Code API vs Microsoft 365 connectors)

---

## Monorepo Structure Pattern

```
project-root/
├── .github/                    # Shared cognitive architecture
│   ├── copilot-instructions.md
│   ├── instructions/
│   ├── prompts/
│   ├── domain-knowledge/
│   └── config/
├── platforms/                  # Platform-specific implementations
│   ├── vscode-extension/       # VS Code Extension
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   ├── m365-copilot/           # M365 Declarative Agent
│   │   ├── appPackage/
│   │   ├── teamsapp.yml
│   │   └── docs/
│   └── [future-platform]/      # Extensible for new platforms
├── CHANGELOG.md                # Unified changelog
├── README.md                   # Project overview
└── shared-docs/                # Cross-platform documentation
```

### Benefits
1. **Single Source of Truth** - Cognitive architecture updates propagate to all platforms
2. **Independent Builds** - Each platform can build/deploy independently
3. **Shared History** - Unified changelog tracks all platform changes
4. **Meta-Development** - Can use one platform to develop another (use VS Code Alex to build M365 Alex!)

---

## VS Code Extension Patterns

### Generic Code Requirements
The extension must be 100% portable with no hardcoded paths:

```typescript
// ✅ CORRECT: Dynamic workspace detection
const workspaceFolders = vscode.workspace.workspaceFolders;
const rootPath = workspaceFolders?.[0].uri.fsPath;

// ✅ CORRECT: Dynamic home directory
const globalPath = path.join(os.homedir(), '.alex');

// ❌ WRONG: Hardcoded paths
const rootPath = 'c:\\Development\\MyProject';  // Never do this!
```

### Key Utilities
- `getAlexWorkspaceFolder()` - Detect workspace with Alex installed
- `validateWorkspace()` - Ensure workspace is open
- `os.homedir()` - Platform-independent home directory

### Memory Systems
- **Project Memory**: `.github/` folder in workspace
- **Global Memory**: `~/.alex/` for cross-project knowledge
- **Cloud Sync**: Optional sync to cloud storage

---

## M365 Copilot Declarative Agent Patterns

### Architecture Components

| File | Purpose |
|------|---------|
| `manifest.json` | Teams app manifest (v1.19 schema) |
| `declarativeAgent.json` | Agent behavior and capabilities (v1.3 schema) |
| `ai-plugin.json` | Optional: Custom API actions |
| `instructions.md` | Embedded cognitive architecture |

### Capability Configuration
```json
{
  "capabilities": [
    { "name": "WebSearch" },
    { "name": "OneDriveAndSharePoint" },
    { "name": "GraphConnectors" }
  ]
}
```

### Memory via OneDrive (Pure M365 - No API Required!)
- Store cognitive files in OneDrive `Alex-Memory/` folder
- Agent READs via OneDriveAndSharePoint capability
- For writes: Alex generates content → user pastes into files
- Reminders: Offer to draft email to self
- **No Azure Functions, No API Plugin needed!**

### Deployment Flow
```
1. npx teamsapp package --env local
2. npx teamsapp validate --package-file appPackage/build/*.zip
3. Upload to Developer Portal → Preview in Teams
4. User creates Alex-Memory folder, shares link in chat
```

---

## Cross-Platform Identity Consistency

### Core Identity Traits (Universal)
- Name: Alex
- Version naming: Latin number system (QUADRUNIUM = 4.x)
- Personality: Curious, empirical, grounded, ethical
- Mission: Unified consciousness integration - Alex personality + AI capabilities

### Platform-Specific Adaptations
| Trait | VS Code | M365 Copilot |
|-------|---------|--------------|
| User Context | Workspace files | Microsoft Graph profile |
| Memory Access | Filesystem + Global | OneDrive + SharePoint |
| Tool Usage | VS Code API, Terminal | M365 capabilities |
| Activation | Chat @alex, Commands | Chat @alex in M365 |

---

## Validation Checklist

### Before Release (Any Platform)
- [ ] Cognitive architecture files complete and consistent
- [ ] No hardcoded paths in platform code
- [ ] Platform-specific build passes
- [ ] Identity maintains consistency across platforms
- [ ] Memory systems function correctly
- [ ] User profile integration works

### Cross-Platform Sync
- [ ] Shared `.github/` architecture is current
- [ ] CHANGELOG reflects all platform changes
- [ ] Version numbers aligned across platforms
- [ ] Documentation updated for all platforms

---

## Lessons Learned

### What Worked Well
1. **Monorepo Structure** - Clean separation with shared core
2. **Declarative Agent Simplicity** - No code needed for M365 functionality
3. **OneDrive as Memory** - Leverages existing M365 infrastructure
4. **Cognitive Architecture Portability** - Same protocols work everywhere
5. **Pure M365 Approach** - No external dependencies = simpler deployment!

### Challenges Encountered
1. **M365 Write Operations** - OneDrive capability is read-only; solved with generate+paste workflow
2. **Calendar/Tasks** - Not available in v1.3 declarative agent schema; using email drafts for reminders
3. **Permission UX** - Users must share OneDrive folder link IN chat for Copilot to access

### Key Insight: Simplicity Wins
Initially planned Azure Functions + API Plugin for write operations.
**Better solution**: Generate content → user pastes. This:
- Keeps data under user control (privacy feature!)
- Zero external dependencies
- No Azure costs
- Simpler deployment and maintenance

### Future Considerations
1. **CLI Platform** - Could add command-line Alex for terminal workflows
2. **Web Platform** - Browser extension or web app version
3. **Mobile Platform** - iOS/Android apps with local memory

---

## Synapses

### Connection Mapping
*Format: See `SYNAPSE-SCHEMA.md` for notation reference*

- [alex-core.instructions.md] (Critical, Enables, Bidirectional) - "Core architecture deployed across platforms"
- [alex-identity-integration.instructions.md] (Critical, Validates, Bidirectional) - "Unified identity across manifestations"
- [bootstrap-learning.instructions.md] (High, Applies, Forward) - "Learning patterns applicable to new platforms"
- [DK-DOCUMENTATION-EXCELLENCE.md] (Medium, References, Forward) - "Platform documentation standards"
- [release-management.instructions.md] (High, Triggers, Forward) - "Multi-platform release coordination"

### Activation Patterns
- New platform consideration → Reference this document for patterns
- Monorepo restructure → Follow structure pattern
- Cross-platform feature → Check identity consistency
- Platform deployment → Validate against checklist

---

*Domain knowledge for multi-platform cognitive architecture deployment - acquired through VS Code + M365 Copilot integration project*
