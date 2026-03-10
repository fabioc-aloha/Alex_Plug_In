---
description: Create a Mermaid diagram following the ATACCU methodology
agent: Alex
---

# /diagramming - Mermaid Diagram Creation

Create professional Mermaid diagrams using the ATACCU methodology from the markdown-mermaid skill.

## ATACCU Workflow

| Step | Action | What to Do |
| ---- | ------ | ---------- |
| **A** | Analyze | What data/process? Who is the audience? What diagram type? |
| **T** | Think | Layout pattern (Medallion/Lineage/Pipeline), node count, direction |
| **A** | Apply Skills | GitHub Pastel v2 palette, `classDef` by semantic meaning, `%%{init}%%` directive |
| **C** | Create | Write Mermaid code — every node gets a style, every flowchart gets `linkStyle default` |
| **C** | Check | Render and verify: pastels (not saturated), layout, labels, arrows (#57606a) |
| **U** | Update | Write into target `.md` with `**Figure N:** *description*` label |

## Diagram Types

- `flowchart` — processes, workflows, decision trees (most common)
- `sequenceDiagram` — API calls, message flows, interactions
- `classDiagram` — object relationships, data models
- `stateDiagram-v2` — state machines, lifecycle
- `gantt` — timelines, project schedules
- `quadrantChart` — 2-axis comparison, priority matrices

## Quality Rules

- Init directive is FIRST line inside mermaid block
- ALL nodes have style/classDef (no unstyled nodes)
- Colors are GitHub Pastel v2 (NOT saturated)
- `linkStyle default stroke:#57606a,stroke-width:1.5px` on flowcharts
- Node labels use `<br/>` for line breaks, NOT `\n`

## Start

What would you like to diagram? Describe the process, architecture, or data flow and I'll create a Mermaid diagram.
