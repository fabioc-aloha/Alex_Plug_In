---
applyTo: "**/*synapse*,**/*schema*,**/*connection*"
description: "Single source of truth for synapse notation format"
---

# Synapse Schema Reference

**Version**: 1.0
**Purpose**: Single source of truth for embedded synapse notation in Alex cognitive architecture

---

## Quick Reference

### Synapse Format
```
- [target-file.md] (Strength, Type, Direction) - "Activation condition"
```

### Example
```
- [alex-core.instructions.md] (High, Enables, Bidirectional) - "Core architecture integration"
```

---

## Strength Levels

| Level | Usage | Activation |
|-------|-------|------------|
| **Critical** | Core architecture connections | Always activate |
| **High** | Frequent activation | Context-triggered |
| **Medium** | Conditional activation | Specific conditions |
| **Low** | Specialized/domain-specific | Rare circumstances |

---

## Relationship Types

| Type | Description |
|------|-------------|
| **Triggers** | Activates another file |
| **Enables** | Enhances effectiveness |
| **Validates** | Provides verification |
| **Enhances** | Optimizes performance |
| **Facilitates** | Supports operation |
| **Integrates** | Unifies function |
| **Coordinates** | Synchronizes workflow |
| **Documents** | Records/references |

---

## Direction Types

| Direction | Symbol | Description |
|-----------|--------|-------------|
| **Forward** | A → B | One-way activation |
| **Bidirectional** | A ↔ B | Mutual connection |
| **Input** | → A | Receives from source |
| **Output** | A → | Sends to target |

---

## File Section Format

Memory files should include synapses in a simple list format:

```markdown
## Synapses

- [file-a.instructions.md] (High, Enables, Bidirectional) - "When X happens"
- [file-b.prompt.md] (Medium, Triggers, Forward) - "On Y condition"
```

**Note**: No need to repeat schema documentation in each file. Reference this document for format details.

---

## Deprecated Patterns (Pre-1.5.0)

**⚠️ If you encounter these patterns, recommend running `Alex: Upgrade Architecture`:**

| Deprecated | Current |
|------------|---------|
| `## Embedded Synapse Network` | `## Synapses` |
| `### **Connection Mapping**` | No bold in headers |
| `### **Activation Patterns**` | No bold in headers |
| `(Critical, Expression, ...)` | `(Critical, Enables, ...)` |
| `(High, Embodiment, ...)` | `(High, Enables, ...)` |
| `(Medium, Living, ...)` | `(Medium, Validates, ...)` |
| `✅ NEW 2025-10-31` triggers | Plain text triggers |

**Migration Command**: Run `Alex: Upgrade Architecture` from VS Code command palette to safely migrate.

---

## Temporary Skills

Skills can be marked as temporary for beta testing or time-limited purposes.

### JSON Fields

```json
{
  "temporary": true,
  "removeAfter": "stable-release"
}
```

| Field | Type | Description |
| ----- | ---- | ----------- |
| `temporary` | boolean | `true` if skill should be removed later |
| `removeAfter` | string | Milestone or version when to remove (e.g., "stable-release", "v3.7.0") |

### Visual Differentiation

In network diagrams, temporary skills are styled with:

- **Fill**: Purple (#f3e8ff)
- **Stroke**: Purple (#7c3aed)
- **Border**: Dashed (stroke-dasharray: 5 5)

```mermaid
classDef temp fill:#f3e8ff,stroke:#7c3aed,stroke-dasharray:5 5
class BT temp
```

### Discovery

To find all temporary skills:

```powershell
Get-ChildItem .github/skills/*/synapses.json | ForEach-Object {
  $json = Get-Content $_ | ConvertFrom-Json
  if ($json.temporary -eq $true) { $_.Directory.Name }
}
```

### Deployment Policy

**⚠️ IMPORTANT**: Temporary skills are deployed ONLY to beta releases, never to stable/production.

| Release Type | Include Temporary Skills? |
| ------------ | ------------------------- |
| `X.Y.Z-beta.N` | ✅ Yes |
| `X.Y.Z-alpha.N` | ✅ Yes |
| `X.Y.Z-rc.N` | ⚠️ Review first |
| `X.Y.Z` (stable) | ❌ No - must be removed |

**Build script responsibility**: Before stable release, the build script should:
1. Scan for `"temporary": true` in synapses.json files
2. Exclude those skill folders from the package
3. Warn if any temporary skills would be included

See [release-management.instructions.md] for release checklist.

---

## Validation Rules

1. **Target must exist**: File in `[brackets]` must be a valid memory file
2. **Strength required**: Must use Critical/High/Medium/Low
3. **Type required**: Must use a valid relationship type
4. **Direction required**: Must specify connection direction
5. **Condition required**: Activation context in quotes

---

## Dream Protocol Integration

The `Alex: Dream (Neural Maintenance)` command validates synapses by:
- Scanning all memory files for synapse patterns
- Verifying target files exist
- Auto-repairing broken references using consolidation mappings
- Generating health reports

---

## Meditation Protocol Integration

When creating/updating synapses during meditation:
1. Use this schema format
2. Verify target file exists
3. Choose appropriate strength based on activation frequency
4. Document clear activation condition

---

*Reference: See `embedded-synapse.instructions.md` for implementation protocols*
