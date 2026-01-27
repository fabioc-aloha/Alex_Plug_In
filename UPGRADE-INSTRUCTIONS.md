# Alex Cognitive Architecture - Upgrade Instructions

**Version**: 3.3.3 TRITRITRIUM
**Purpose**: Fully automated upgrade process that preserves learned knowledge while updating system architecture

---

## Overview

**Good news!** Starting with v3.3.2, Alex performs **fully automated upgrades**. When the extension updates, you'll see a notification with options to:

- **Run Upgrade** - Performs complete upgrade automatically
- **View Changelog** - See what's new before upgrading
- **Dismiss** - Skip for now (you can always run manually later)

### What Makes This Different

Previous versions required a hybrid approach with manual AI assistance. **v3.3.3+ performs all migrations automatically**:

1. ✅ Creates complete backup
2. ✅ Updates all system files
3. ✅ **Auto-migrates schema changes** (headers, relationship types, activation patterns)
4. ✅ Preserves user customizations
5. ✅ Runs Dream validation
6. ✅ Cleans up temporary files

**No manual intervention required!**

---

## Upgrade Process (Fully Automated)

### Trigger

Run `Alex: Upgrade Architecture` command or click "Run Upgrade" on notification.

### What Happens Automatically

1. **Backup Creation**
   - Full backup to `archive/upgrades/backup-{version}-{timestamp}/`
   - All cognitive memory preserved

2. **System File Updates**
   - `.github/instructions/*.instructions.md` - All instruction files
   - `.github/prompts/*.prompt.md` - Prompt templates
   - `.github/agents/` - Agent definitions
   - `.github/config/` - Configuration templates

3. **Schema Migrations** (automatic)
   - `## Embedded Synapse Network` → `## Synapses`
   - `### **Bold Headers**` → `### Headers`
   - Relationship type normalization:

     | Old | New |
     | --- | --- |
     | Expression | Enables |
     | Embodiment | Enables |
     | Living | Validates |
     | Reflexive | Documents |
     | Ethical | Validates |
     | Unconscious | Enables |
     | Application | Enables |
     | Validation | Validates |

   - Verbose activation patterns simplified (date stamps removed, bold removed)

4. **Brain File Merge** (copilot-instructions.md)
   - **Updates**: Version, system sections, command documentation
   - **Preserves**: Domain slots (P5-P7), custom memory references, user sections

5. **Dream Validation**
   - Automatically runs `Alex: Dream (Neural Maintenance)`
   - Validates synaptic connections
   - Reports any issues

6. **Cleanup**
   - Removes any leftover `UPGRADE-INSTRUCTIONS.md` from previous upgrades
   - Generates upgrade report in `archive/upgrades/`

### Output

- Upgrade report: `archive/upgrades/upgrade-report-{timestamp}.md`
- Backup location: `archive/upgrades/backup-{version}-{timestamp}/`

---

## File Classification

### System Files (Safe to Replace)

These files contain no user state and can be safely overwritten:

- `.github/instructions/*.instructions.md` - All instruction files
- `.github/prompts/*.prompt.md` - Base prompt files (except user-created)
- `config/cognitive-config-template.json` - Template only

### Hybrid Files (Auto-Merged)

These contain both system structure and user state - merged intelligently:

- `.github/copilot-instructions.md` - **THE BRAIN** - auto-merged preserving user customizations

### User Files (Never Overwrite)

These are created by user learning and are fully protected:

- `domain-knowledge/DK-*.md` - User-created knowledge files
- `archive/*` - All historical records
- `config/cognitive-config.json` - User's actual config
- Any file NOT in `.github/config/alex-manifest.json`

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

- **Version-specific migration scripts**: Each version bump could include specific transformations
- **Conflict resolution UI**: VS Code webview showing side-by-side diffs for user approval (for edge cases)
- **Pre-upgrade compatibility checks**: Validate environment before starting

---

*This protocol ensures safe, fully automated upgrades that preserve the cognitive system's learned knowledge while incorporating architectural improvements.*
