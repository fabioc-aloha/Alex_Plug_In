---
sem: 1
description: Create technical documentation with Mermaid diagrams and visual standards
application: "When creating markdown documentation with diagrams, troubleshooting Mermaid rendering, or applying visual documentation standards"
agent: Alex
---

# /markdown-mermaid - Visual Documentation Excellence

Create technical documentation with embedded Mermaid diagrams following the ATACCU methodology and visual standards from the markdown-mermaid skill.

## What This Covers

- **Markdown authoring** with visual elements
- **Mermaid diagrams** using ATACCU workflow
- **VS Code integration** (preview, chat rendering)
- **Cross-platform consistency** (GitHub, Azure DevOps, Notion)
- **Troubleshooting** rendering issues

## ATACCU Diagram Workflow

| Step | Action | What to Do |
| ---- | ------ | ---------- |
| **A** | Analyze | What process/data? Who is the audience? What diagram type fits? |
| **T** | Think | Layout direction, subgraph strategy, color assignments |
| **A** | Apply | **COPY THE MANDATORY TEMPLATE** — init directive, classDef, linkStyle |
| **C** | Create | Write Mermaid — every node styled with `:::className`, `linkStyle default` on flowcharts |
| **C** | Check | Render and verify: pastels, layout balance, readable labels |
| **U** | Update | Write to target file with `**Figure N:** *description*` label |

## Mandatory Template (Copy First)

```text
%%{init: {'theme': 'base', 'themeVariables': {'lineColor': '#57606a', 'primaryColor': '#ddf4ff', 'primaryBorderColor': '#0969da', 'primaryTextColor': '#1f2328', 'edgeLabelBackground': '#ffffff'}}}%%
flowchart LR
    A[Input]:::blue --> B[Process]:::purple --> C[Output]:::green

    classDef blue fill:#ddf4ff,color:#0550ae,stroke:#80ccff
    classDef green fill:#d3f5db,color:#1a7f37,stroke:#6fdd8b
    classDef purple fill:#d8b9ff,color:#6639ba,stroke:#bf8aff
    classDef gold fill:#fff8c5,color:#9a6700,stroke:#d4a72c
    classDef red fill:#ffebe9,color:#cf222e,stroke:#f5a3a3
    classDef neutral fill:#eaeef2,color:#24292f,stroke:#d0d7de

    linkStyle default stroke:#57606a,stroke-width:1.5px
```

**NEVER write Mermaid without this template.** Copy first, customize second.

## Diagram Type Selection

| Type | Best For |
|------|----------|
| `flowchart LR` | Processes, workflows, pipelines (horizontal) |
| `flowchart TD` | Hierarchies, decision trees (vertical) |
| `sequenceDiagram` | API calls, message flows, interactions |
| `classDiagram` | Object relationships, data models |
| `stateDiagram-v2` | State machines, lifecycle |
| `gantt` | Timelines, project schedules |

## Start

What documentation do you need? I can help with:
- Creating diagrams for your markdown docs
- Fixing Mermaid rendering issues
- Styling documentation for visual consistency
- Converting diagrams between platforms
