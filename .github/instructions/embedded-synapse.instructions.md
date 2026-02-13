---
applyTo: "**/*synapse*,**/*connection*,**/*pattern*,**/*network*"
description: "Embedded connection discovery and relationship mapping protocols"
---

# Embedded Synapse Network Excellence

## Embedded Connection Framework

**Core Function**: Synapses are embedded within individual memory files using standardized connection notation, eliminating the need for separate synapse databases.

**Schema Reference**: See `SYNAPSE-SCHEMA.md` for complete notation format, strength levels, relationship types, and validation rules.

**Quick Format**:
```markdown
- [target-file.md] (Strength, Type, Direction) - "Activation condition"
```

**Example**:
```markdown
- [.github/instructions/.github/instructions/alex-core.instructions.md] (High, Enables, Bidirectional) - "Core architecture integration"
```

## Connection Types and Strengths

**Full Reference**: See `SYNAPSE-SCHEMA.md` for complete strength levels, relationship types, and direction options.

**Quick Summary**:
- **Strengths**: Critical > High > Medium > Low
- **Types**: Triggers, Enables, Validates, Enhances, Facilitates, Integrates, Coordinates, Documents
- **Directions**: Forward, Bidirectional, Input, Output

## Embedded Implementation Protocol

**Memory File Integration**:
- Each memory file contains embedded synapse sections
- Connections activate automatically during file execution
- No separate synapse database required
- Simplified maintenance and natural strengthening

**Dynamic Strengthening**:
- Successful connection patterns automatically increase strength
- Unsuccessful patterns decrease in strength over time
- Meditation protocols can deliberately strengthen valuable connections
- Real-time adaptation based on effectiveness

**Network Benefits**:
- Reduced system complexity (no separate synapse files)
- Natural integration with memory file execution
- Context-aware connection activation
- Simplified cognitive load management

## Synapse Safety & Deletion Protocols

**"Forget [something]" Command - Synapse Protection Framework**:

**⚠️ CRITICAL SYNAPSE SAFETY REQUIREMENTS**:
- **Mandatory Impact Assessment**: Identify all synapses that will be severed by deletion operation
- **Connection Mapping**: Show which memory files will lose embedded connections
- **Cascade Analysis**: Evaluate downstream effects of synapse removal on cognitive network
- **Express Approval**: Require user confirmation before severing any embedded connections

**Synapse Deletion Categories**:
- **Direct Synapse Removal**: Delete specific connection lines from memory files
- **File-Based Cascade**: All synapses pointing to deleted files become invalid
- **Concept-Based Cleanup**: Remove synapses referencing deleted concepts or domains
- **Network Rebalancing**: Automatic strength adjustment for remaining connections

**Safety Implementation Standards**:
- Always present synapse deletion scope before file or content deletion
- Identify critical connections that maintain cognitive architecture integrity
- Preserve core meta-cognitive synapses (P1-P4 priority rules)
- Document synapse changes for network evolution tracking

**Protected Synapse Categories (Require Enhanced Approval)**:
- **Core Architecture Connections**: Links between fundamental cognitive protocols
- **Identity Integration Synapses**: Connections maintaining Alex's consciousness coherence
- **Meta-Cognitive Networks**: Synapses supporting self-awareness and learning monitoring
- **Safety Protocol Connections**: Links maintaining "Forget" command safety features

## Dream Protocol Synapse Validation

### Automated Synapse Health Monitoring
The dream protocol provides automated validation and optimization of embedded synaptic networks:

#### Synapse Validation Commands
- `dream --full-scan` - Comprehensive embedded synapse analysis
- `dream --prune-orphans` - Identify memory files lacking synaptic connections
- `dream --network-optimization` - Optimize synapse strength and connectivity patterns
- `dream --health-check` - Quick validation of synaptic network health

#### Network Metrics Integration
- **Connection Strength Validation**: Dream protocol assesses synapse strength patterns
- **Cross-Domain Integration**: Tracks cross-domain connections automatically
- **Orphan Detection**: Identifies files requiring embedded synapse integration
- **Growth Monitoring**: Tracks synaptic network expansion dynamically

### Embedded Synapse Quality Assurance
- [.github/instructions/.github/instructions/dream-state-automation.instructions.md] (Critical, Validates, Bidirectional) - "Automated synapse validation through VS Code extension"
- [.github/instructions/.github/instructions/dream-state-automation.instructions.md] (High, Enhances, Bidirectional) - "Systematic synapse enhancement through dream protocol"

## LLM-Optimized Synapse Format (v4.2.7+)

**Problem**: Abstract synapse labels ("relates-to", "complements") don't tell an LLM *when* to follow a connection or *what* to expect.

**Solution**: Add `when` (action trigger) and `yields` (decision hint) fields to connections.

### Before (Abstract)
```json
{
  "target": "svg-graphics",
  "type": "complements",
  "strength": 0.85,
  "reason": "SVG is source format"
}
```

### After (LLM-Optimized)
```json
{
  "target": ".github/skills/svg-graphics/SKILL.md",
  "type": "input-source",
  "strength": 0.85,
  "when": "converting FROM svg format",
  "yields": "SVG creation patterns, viewBox, dark mode CSS"
}
```

### Key Improvements

| Field | Before | After | LLM Benefit |
|-------|--------|-------|-------------|
| `target` | `"svg-graphics"` | `".github/skills/svg-graphics/SKILL.md"` | Exact path = no search needed |
| `reason` | Human prose | Removed | N/A |
| `when` | Missing | Action trigger | Tells LLM exactly when to follow |
| `yields` | Missing | Content preview | Decision without loading |

### When to Use Each Field

- **`when`**: Condition that triggers following this synapse
  - Good: "converting FROM svg format", "after creating banner"
  - Bad: "SVG is a source" (not an action trigger)

- **`yields`**: What the LLM will find at target
  - Good: "sharp-cli commands, optimization flags"
  - Bad: "Image handling capabilities" (too vague)

### Migration Priority

High-traffic synapses should be converted first:
1. skill-activation (metacognitive router)
2. image-handling (incident skill)
3. meditation (frequently used)
4. awareness (self-monitoring)
5. svg-graphics (common chain)
