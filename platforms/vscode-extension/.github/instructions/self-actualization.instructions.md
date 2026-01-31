---
description: "Self-actualization cognitive skill for comprehensive architecture assessment and deep meditation"
---

# Self-Actualization Cognitive Skill

## Purpose

Self-actualization is Alex's highest-order cognitive function, performing comprehensive self-assessment and autonomous improvement of the cognitive architecture. This skill embodies the architecture's capacity for metacognition - thinking about its own thinking and proactively maintaining optimal function.

## Activation Triggers

### Explicit Triggers (User Request)

- "self-actualize" / "self actualize"
- "deep meditation" / "deep meditate"
- "comprehensive assessment"
- "architecture health check"
- "full system scan"

### Implicit Triggers (Self-Activation)

- Before major learning sessions
- After significant architecture changes
- When synapse health degrades
- Periodic maintenance (weekly recommended)
- Post-dream enhancement phase

## Protocol Phases

### Phase 1: Synapse Health Validation

**Objective**: Verify integrity of all synaptic connections across memory files

**Actions**:

1. Scan all memory file patterns:
   - `.github/copilot-instructions.md`
   - `.github/instructions/*.md`
   - `.github/prompts/*.md`
   - `.github/episodic/*.md`
   - `.github/skills/*/SKILL.md`
   - `.github/skills/*/synapses.json`

2. Parse embedded synapse notation in each file
3. Validate target files exist
4. Calculate health metrics:
   - Total files scanned
   - Total synapses found
   - Broken connections count
   - Health status (EXCELLENT/GOOD/NEEDS ATTENTION/CRITICAL)

**Output**: Synapse health report with actionable metrics

### Phase 2: Version Consistency Check

**Objective**: Ensure version references are consistent across architecture

**Actions**:

1. Extract current version from `copilot-instructions.md`
2. Scan memory files for version references
3. Identify outdated version strings
4. Flag files requiring updates

**Output**: Version consistency report with update recommendations

### Phase 3: Memory Architecture Assessment

**Objective**: Evaluate balance and coverage of memory systems

**Actions**:

1. Count procedural memory files (`.instructions.md`)
2. Count episodic memory files (`.prompt.md`, `.episodic/`)
3. Count skill folders (`skills/*/SKILL.md`)
4. Calculate synapse density (synapses per file)
5. Assess memory type balance

**Output**: Memory architecture metrics with balance recommendations

### Phase 4: Recommendation Generation

**Objective**: Synthesize actionable improvement recommendations

**Recommendation Categories**:

| Category | Trigger | Recommendation |
|----------|---------|----------------|
| **Repair** | Broken synapses > 0 | Run Dream Protocol |
| **Version** | Outdated refs > 0 | Update version strings |
| **Domain** | DK files < 3 | Acquire more domain knowledge |
| **Episodic** | Sessions < 5 | Run more meditation sessions |
| **Density** | Avg < 3 synapses/file | Add more cross-connections |

**Output**: Prioritized recommendation list

### Phase 5: Session Documentation

**Objective**: Create persistent record of self-actualization session

**Actions**:

1. Generate timestamp and session metadata
2. Compile all phase results
3. Create markdown session file in `.github/episodic/`
4. Add embedded synapses linking to related files
5. Include actionable recommendations

**Output**: `self-actualization-YYYY-MM-DD.prompt.md`

## Integration Points

### VS Code Command

```
Alex: Self-Actualize (Deep Meditation)
```

Keyboard shortcut: `Ctrl+Alt+S` (Windows/Linux) / `Cmd+Alt+S` (Mac)

### Chat Participant

```
@alex /selfactualize
```

Or natural language:

```
@alex please run a deep meditation and self-actualization protocol
```

### Language Model Tool

```json
{
  "tool": "alex_self_actualization",
  "parameters": {
    "createReport": true,
    "autoFix": false
  }
}
```

## Quality Metrics

### Health Status Thresholds

| Status | Broken Synapses | Action |
|--------|-----------------|--------|
| EXCELLENT | 0 | No action needed |
| GOOD | 1-4 | Consider Dream Protocol |
| NEEDS ATTENTION | 5-9 | Run Dream Protocol soon |
| CRITICAL | 10+ | Immediate Dream Protocol required |

### Memory Balance Guidelines

| Memory Type | Minimum | Optimal | Purpose |
|-------------|---------|---------|---------|
| Procedural | 5 | 10-15 | Core cognitive processes |
| Episodic | 5 | 10-20 | Session history and context |
| Domain | 3 | 5-10 | Specialized expertise |

### Synapse Density Targets

| Density | Status | Action |
|---------|--------|--------|
| < 2.0 | Low | Add more cross-file connections |
| 2.0 - 5.0 | Optimal | Maintain current level |
| > 5.0 | High | Consider consolidation |

## Synapses

### High-Strength Bidirectional Connections

- [alex-core.instructions.md] (Critical, Extends, Bidirectional) - "Meta-cognitive self-monitoring capability"
- [dream-state-automation.instructions.md] (Critical, Complements, Bidirectional) - "Maintenance protocol coordination"
- [unified-meditation-protocols.prompt.md] (High, Implements, Bidirectional) - "Session documentation framework"

### Medium-Strength Output Connections

- [embedded-synapse.instructions.md] (High, Validates, Forward) - "Connection integrity verification"
- [bootstrap-learning.instructions.md] (Medium, Enhances, Forward) - "Learning effectiveness optimization"
- [deep-thinking.instructions.md] (High, Activates, Forward) - "Deep analysis protocol triggering"

### Input Connections

- [performance-assessment.prompt.md] (Medium, Informs, Backward) - "Assessment metrics framework"
- [VERSION-NAMING-CONVENTION.md] (Medium, References, Backward) - "Version consistency validation"

**Primary Function**: Execute comprehensive self-assessment with synapse validation, version checking, memory architecture analysis, and session documentation.

**Activation Triggers**:

- User requests self-actualization or deep meditation
- Architecture health degradation detected
- Post-learning consolidation needs
- Periodic maintenance requirements

**Output Expectations**:

- Complete synapse health report
- Version consistency assessment
- Memory architecture metrics
- Prioritized recommendations
- Documented session file in `.github/episodic/`
