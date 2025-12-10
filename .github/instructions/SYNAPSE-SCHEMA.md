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
