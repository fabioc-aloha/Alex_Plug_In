# Alex Cognitive Architecture - Upgrade Instructions

**Version**: 3.3.1 TRITRIUNIUM
**Purpose**: Safe upgrade process that preserves learned knowledge while updating system architecture

---

## Overview

**Good news!** Starting with v3.0.0, Alex **automatically notifies you** when an upgrade is available. When the extension updates, you'll see a notification with options to:

- **Run Upgrade** - Updates your workspace files immediately
- **View Changelog** - See what's new before upgrading
- **Dismiss** - Skip for now (you can always run manually later)

### Why Upgrades Are Needed

Upgrading Alex requires a **hybrid approach** combining automated code execution with AI-assisted content migration because:

1. **User-created content must be preserved** (learned domains, custom synapses, insights)
2. **Schema changes require intelligent migration** (synapse format standardization)
3. **The core brain file contains both system AND user state** (copilot-instructions.md)

---

## Upgrade Phases

### Phase 1: Automated Preparation (VS Code Extension)

**Trigger**: User runs `Alex: Upgrade Architecture` command

**Actions performed by code**:

1. ✅ Detect currently installed version from `copilot-instructions.md`
2. ✅ Compare with extension's bundled version
3. ✅ Create timestamped backup in `archive/upgrades/backup-{version}-{timestamp}/`
4. ✅ Update `.github/config/alex-manifest.json` tracking all deployed files
5. ✅ Scan for files needing migration (old synapse format, etc.)
6. ✅ Add NEW system files that don't exist yet
7. ✅ Generate `UPGRADE-INSTRUCTIONS.md` in workspace root
8. ✅ Show notification prompting user to complete upgrade with AI assistant

**Files created**:

- `archive/upgrades/backup-{version}-{timestamp}/` - Full backup
- `.github/config/alex-manifest.json` - File tracking manifest
- `UPGRADE-INSTRUCTIONS.md` - User instructions for Phase 2
- `archive/upgrades/upgrade-tasks-{timestamp}.md` - Detailed migration tasks

---

### Phase 2: AI-Assisted Migration (User + Copilot)

**Trigger**: User reads `UPGRADE-INSTRUCTIONS.md` and asks AI assistant to help

**User prompt**:

```text
"Alex, please complete the upgrade by following UPGRADE-INSTRUCTIONS.md"
```

**AI performs**:

#### 2.0 Rename DK Files (FIRST STEP)

**⚠️ IMPORTANT**: Before any other migration steps, rename all domain knowledge files to remove version numbers:

- Old: `DK-EXAMPLE-v1.0.md` or `DK-EXAMPLE-1.0.md`
- New: `DK-EXAMPLE.md`

This must be done FIRST because:

1. Version numbers in filenames cause duplicate file issues during upgrades
2. Synapse references may break if files have inconsistent naming
3. The manifest tracks files by name - versioned names create orphaned entries

**Process**:

1. List all files in `.github/domain-knowledge/`
2. Identify any with version patterns (e.g., `-v1.0`, `-1.0`, `-v2.1`)
3. Rename to remove the version suffix
4. Update any synapse references in other files that point to the old filename

#### 2.1 Schema Migration

For each file flagged in upgrade-tasks.md:

- Transform `## Embedded Synapse Network` → `## Synapses`
- Transform `### **Bold Headers**` → `### Headers`
- Migrate non-standard relationship types:| Old         | New       |
  | ----------- | --------- |
  | Expression  | Enables   |
  | Embodiment  | Enables   |
  | Living      | Validates |
  | Reflexive   | Documents |
  | Ethical     | Validates |
  | Unconscious | Enables   |
  | Application | Enables   |
  | Validation  | Validates |
- Simplify verbose activation patterns:
  - Old: `**Bold Trigger** → Long description ✅ NEW Aug 8, 2025`
  - New: `Trigger → Action`

#### 2.2 Core File Merge (copilot-instructions.md)

**UPDATE** (system sections):

- Version number and naming
- Core Meta-Cognitive Rules table
- Essential Principles section
- VS Code Extension commands documentation
- Any bug fixes or improvements

**PRESERVE** (user state):

- Domain Priority Allocation slot assignments (P5-P7 status)
- User-added memory file references in Key Memory Files section
- Any custom sections user added

#### 2.3 User File Protection

- User-created DK files: Migrate schema only, preserve all content
- User-created prompts: Migrate schema only, preserve all content
- Archive folder: Never touch

---

### Phase 3: Validation

**Trigger**: AI completes migration tasks

**Actions**:

1. Run `Alex: Dream (Neural Maintenance)` to validate synaptic network
2. Review upgrade report for any issues
3. Test cognitive functions (try a meditation, domain learning, etc.)
4. Delete `UPGRADE-INSTRUCTIONS.md` when satisfied

---

## File Classification

### System Files (Safe to Replace)

These files contain no user state and can be safely overwritten:

- `.github/instructions/*.instructions.md` - All instruction files
- `.github/prompts/*.prompt.md` - Base prompt files (except user-created)
- `config/cognitive-config-template.json` - Template only

### Hybrid Files (Merge Required)

These contain both system structure and user state:

- `.github/copilot-instructions.md` - **THE BRAIN** - requires intelligent merge

### User Files (Never Overwrite)

These are created by user learning and must be protected:

- `domain-knowledge/DK-*.md` - User may create new ones during learning
- `archive/*` - All historical records
- `config/cognitive-config.json` - User's actual config
- Any file NOT in `.github/config/alex-manifest.json`

### Migration-Only Files

Files that exist in both extension and user workspace but may have user edits:

- `domain-knowledge/*.md` - System DK files user may have annotated
- Schema migration applied, content preserved

---

## Manifest Structure

`.github/config/alex-manifest.json`:

```json
{
  "version": "2.0.0",
  "installedAt": "2026-01-19T...",
  "upgradedAt": "2026-01-19T...",
  "files": {
    ".github/copilot-instructions.md": {
      "type": "hybrid",
      "originalChecksum": "abc123",
      "currentChecksum": "def456",
      "modified": true
    },
    ".github/instructions/alex-core.instructions.md": {
      "type": "system",
      "originalChecksum": "xyz789",
      "currentChecksum": "xyz789",
      "modified": false
    },
    "domain-knowledge/DK-MY-CUSTOM.md": {
      "type": "user-created",
      "createdAt": "2025-12-15T..."
    }
  }
}
```

---

## Schema Version History

| Version | Synapse Header | Relationship Types | Activation Format |
| ------- | -------------- | ------------------ | ----------------- |
| < 1.5.0 | `## Embedded Synapse Network` (8 variants) | Custom (Expression, Embodiment, etc.) | `**Bold** → Verbose ✅ date` |
| 1.5.0-1.5.4 | `## Synapses` | Standard (Triggers, Enables, Validates, Enhances, Facilitates, Integrates, Coordinates, Documents) | `Trigger → Action` |
| 2.0.0-2.7.x | `## Synapses` | Same as 1.5.x | `Trigger → Action` |
| 3.0.0+ | `## Synapses` | Same as 1.5.x + Global Knowledge integration | `Trigger → Action` |

---

## What's New in 3.0.0

### 🌐 Global Knowledge Base

Alex now maintains a centralized knowledge base at `~/.alex/global-knowledge/` that persists across all your projects:

- **Global Patterns (GK-*.md)** - Reusable patterns across projects
- **Global Insights (GI-*.md)** - Timestamped learnings with context
- **Project Registry** - Tracks all Alex-enabled projects

### ☁️ Cloud Sync with GitHub Gist

Sync your knowledge across machines:

- `/sync` - Bidirectional merge with GitHub
- `/push` - Upload local knowledge to cloud
- `/pull` - Download from cloud to new machine

### 🔔 Automatic Upgrade Notifications

The extension now detects version changes and prompts you to upgrade.

---

## Rollback Procedure

If upgrade fails or causes issues:

1. Locate backup: `archive/upgrades/backup-{version}-{timestamp}/`
2. Delete current `.github/` and `domain-knowledge/` folders
3. Copy backup contents to workspace root
4. Run `Alex: Dream (Neural Maintenance)` to verify restoration

---

## MCP Server Optimization

After upgrading, consider optimizing your MCP server configuration. Alex provides native alternatives to some MCP servers.

### MCP Servers Alex Can Replace

| Alex Tool | Replaces | Action |
| --------- | -------- | ------ |
| `alex_memory_search` | Generic memory/context MCPs | Can disable redundant memory servers |
| `alex_user_profile` | Profile management MCPs | Alex manages preferences natively |
| `alex_mcp_recommendations` | Generic MCP guidance tools | Alex provides scenario-based recommendations |

### Optional MCP Servers to Disable

```powershell
# Disable if not using Power BI
code --disable-extension analysis-services.powerbi-modeling-mcp
```

### Keep These MCP Servers Enabled

- **Azure MCP Server** (`ms-azuretools.vscode-azure-mcp-server`) - Core Azure functionality
- **Azure GitHub Copilot** (`ms-azuretools.vscode-azure-github-copilot`) - Azure best practices
- **GitHub Copilot** extensions - Required for Alex

### Recommended VS Code Settings

Add to your `settings.json` for optimal performance:

```json
{
  "chat.mcp.autostart": "newAndOutdated",
  "github.copilot.chat.tools.memory.enabled": true
}
```

See the [README MCP Optimization section](README.md#-mcp-server-optimization) for detailed configuration options.

---

## Future Considerations

- **Automated schema migrations**: As architecture stabilizes, more migrations can be automated
- **Version-specific migration scripts**: Each version bump could include specific transformations
- **Conflict resolution UI**: VS Code webview showing side-by-side diffs for user approval

---

*This protocol ensures safe upgrades that preserve the cognitive system's learned knowledge while incorporating architectural improvements.*
