# M365 Office Add-in Cognitive Integration Map

> **Synapse Network**: Cross-platform skill connections between M365 heir and VS Code Alex

**Created**: 2026-02-16
**Version**: v5.7.7
**Status**: Production-ready

---

## Overview

This document catalogs the cognitive integration layer (synapses) that enable cross-platform skill routing between Office Add-ins and VS Code Alex skills.

### Integration Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Alex Cognitive Network                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐           ┌────────────────────┐        │
│  │  VS Code Skills │◄─────────►│  Office Add-ins    │        │
│  │  (.github/      │  Synapses │  (.github/         │        │
│  │   skills/)      │           │   skills/)         │        │
│  └─────────────────┘           └────────────────────┘        │
│         │                              │                      │
│         │                              │                      │
│    120+ Skills                    5 Integration Skills        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Synapse Files Created

### Core Integration Skill

**[.github/skills/office-document-integration/](c:\Development\Alex_Plug_In\platforms\m365-copilot\.github\skills\office-document-integration)**
- `SKILL.md` — Office Add-in integration capabilities and patterns
- `synapses.json` — 10 connections to VS Code skills
  - **Primary targets**: markdown-mermaid, svg-graphics, persona-detection, knowledge-synthesis
  - **Strength range**: 0.5-0.9
  - **Triggers**: "Office Add-in", "task pane", "insert into document", "OneDrive memory"

### Host-Specific Skills

**[.github/skills/word-integration/](c:\Development\Alex_Plug_In\platforms\m365-copilot\.github\skills\word-integration)**
- `synapses.json` — 5 connections for Word document creation
  - **Key connections**: writing-publication, academic-paper-drafting, markdown-mermaid
  - **Specialization**: Long-form content, diagrams, templates

**[.github/skills/excel-integration/](c:\Development\Alex_Plug_In\platforms\m365-copilot\.github\skills\excel-integration)**
- `synapses.json` — 4 connections for Excel data analysis
  - **Key connections**: testing-strategies, observability-monitoring, persona-detection
  - **Specialization**: Charts, formulas, learning goal tracking

**[.github/skills/powerpoint-integration/](c:\Development\Alex_Plug_In\platforms\m365-copilot\.github\skills\powerpoint-integration)**
- `synapses.json` — 6 connections for PowerPoint slide generation
  - **Key connections**: svg-graphics, markdown-mermaid, ui-ux-design, brand-asset-management
  - **Specialization**: Visual slides, diagrams, branding

**[.github/skills/outlook-integration/](c:\Development\Alex_Plug_In\platforms\m365-copilot\.github\skills\outlook-integration)**
- `synapses.json` — 4 connections for email composition
  - **Key connections**: incident-response, persona-detection, writing-publication
  - **Specialization**: Email drafting, urgent triage, tone adaptation

---

## Connection Patterns

### VS Code → Office (Content Creation)

| VS Code Skill          | Office Host      | Strength  | When               | Yields                   |
| ---------------------- | ---------------- | --------- | ------------------ | ------------------------ |
| markdown-mermaid       | Word, PowerPoint | 0.85-0.9  | Inserting diagrams | Mermaid syntax → SVG/PNG |
| svg-graphics           | PowerPoint       | 0.75-0.85 | Creating visuals   | SVG creation, theming    |
| persona-detection      | All              | 0.6-0.8   | Template selection | User role, context       |
| writing-publication    | Word, Outlook    | 0.6-0.85  | Drafting documents | Structure, standards     |
| brand-asset-management | PowerPoint       | 0.8       | Applying theme     | Logo, colors, icons      |

### Office → VS Code (Knowledge Flow)

| Office Trigger  | VS Code Skill       | Strength | When                 | Yields              |
| --------------- | ------------------- | -------- | -------------------- | ------------------- |
| Unfamiliar term | bootstrap-learning  | 0.65     | New domain mentioned | Learning protocols  |
| Excel data      | knowledge-synthesis | 0.7      | Data analysis        | Pattern recognition |
| Urgent email    | incident-response   | 0.6-0.8  | URGENT keywords      | Triage protocols    |
| Test data       | testing-strategies  | 0.7      | Coverage tracking    | Test organization   |

---

## Routing Logic

### LLM-Optimized Synapse Format

All synapses use the v2.0.0 format with `when`/`yields` fields:

```json
{
  "target": ".github/skills/markdown-mermaid/SKILL.md",
  "type": "enables",
  "strength": 0.85,
  "when": "inserting diagrams into Word or PowerPoint",
  "yields": "Mermaid syntax conversion to SVG/PNG for Office.js insertion"
}
```

**Benefits**:
- **`when`**: Tells Alex exactly when to follow this connection
- **`yields`**: Preview of what's at the target without loading
- **`target`**: Absolute path (no search needed)
- **`strength`**: Activation priority (0.0-1.0)

### Activation Flow

```
1. User in Word: "Insert a flowchart showing the deployment process"
   ↓
2. word-integration skill detects request
   ↓
3. Synapse routing: when="inserting diagrams" → markdown-mermaid
   ↓
4. markdown-mermaid generates Mermaid syntax
   ↓
5. word-integration converts to PNG via Office.js
   ↓
6. Successful insertion → Synapse strength += 0.05
```

---

## Dynamic Strengthening

Synapse connections adapt based on usage:

### Strengthening Rules

| Event                  | Effect | Example                            |
| ---------------------- | ------ | ---------------------------------- |
| Successful activation  | +0.05  | Mermaid diagram inserted correctly |
| Failed activation      | -0.02  | Diagram parse error                |
| User positive feedback | +0.10  | "That's perfect!"                  |
| User correction        | -0.05  | "No, I meant Excel not Word"       |

### Strength Thresholds

| Range     | Status              | Behavior                             |
| --------- | ------------------- | ------------------------------------ |
| 0.85+     | **High confidence** | Auto-activate without confirmation   |
| 0.50-0.84 | **Medium**          | Suggest activation, ask confirmation |
| 0.25-0.49 | **Low**             | Exploratory only                     |
| <0.25     | **Dormant**         | Excluded from routing                |

---

## Testing Synapse Routing

### Manual Testing

**Test Case 1: Word Diagram Insertion**
```
User: "Insert a sequence diagram showing the authentication flow"
Expected: markdown-mermaid → word-integration → Office.js insert
Verify: Diagram appears in Word document
```

**Test Case 2: PowerPoint Visual Generation**
```
User: "Create a slide with Alex logo and current focus trifectas"
Expected: svg-graphics + persona-detection → powerpoint-integration
Verify: Slide has logo, trifecta list, branded colors
```

**Test Case 3: Excel Learning Tracker**
```
User: "Create a chart showing my learning goal progress"
Expected: persona-detection → excel-integration → chart creation
Verify: Chart shows focus trifectas with progress bars
```

### Automated Validation

**Dream Protocol Integration**:
```powershell
# Validate all synapses (future enhancement)
dream --full-scan --platform=m365
```

**Expected Output**:
- ✅ 29 synapses found (5 skills × ~5 connections each)
- ✅ All targets resolve to valid paths
- ✅ All `when` conditions are action triggers
- ✅ All `yields` describe concrete content

---

## Maintenance

### Adding New Connections

1. **Identify skill gap**: Office capability not connected to VS Code skill
2. **Create synapse entry**: Add to appropriate `synapses.json`
3. **Define routing**: Write clear `when`/`yields`
4. **Set strength**: Start at 0.5 for experimental, 0.7 for confident
5. **Test activation**: Verify routing works in Office app
6. **Update this index**: Document new connection pattern

### Pruning Weak Connections

- Run `dream --prune-orphans` to identify unused synapses
- Review connections with strength <0.3
- Remove if no successful activations in 30 days

### Version Compatibility

| Alex Version | Synapse Schema | Changes                     |
| ------------ | -------------- | --------------------------- |
| v5.7.7+      | 2.0.0          | `when`/`yields` routing     |
| v5.0-5.7.6   | 1.0.0          | Legacy `reason`-only format |
| v4.x         | (none)         | No M365 synapses            |

---

## References

### Related Documentation

- [OFFICE-ADDINS-README.md](../OFFICE-ADDINS-README.md) — Office Add-in implementation
- [ADR-011](../../alex_docs/decisions/ADR-011-office-addins-m365-integration.md) — Integration decision record
- [.github/instructions/embedded-synapse.instructions.md](../../.github/instructions/embedded-synapse.instructions.md) — Synapse format specification

### Synapse Schema

- [.github/skills/SYNAPSE-SCHEMA.json](../../.github/skills/SYNAPSE-SCHEMA.json) — JSON schema definition
- [.github/instructions/embedded-synapse.instructions.md](../../.github/instructions/embedded-synapse.instructions.md) — Connection types, strengths, patterns

---

**Created by**: Alex (GitHub Copilot)
**Date**: 2026-02-16
**Next Review**: Dream protocol synapse health check (automatic)
**Status**: ✅ Production-ready — 29 synapses, 5 integration skills, full bidirectional routing
