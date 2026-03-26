---
description: "Mermaid diagram creation, technical documentation visuals, diagram type selection, and rendering troubleshooting"
---

# Markdown & Mermaid — Auto-Loaded Rules

Diagram type selection, classDiagram rules, GitHub Pastel v2 palette, rendering pitfalls, quality gate → see markdown-mermaid skill.

## ATACCU Workflow (Every Diagram)

| Step | What |
| ---- | ---- |
| **A**nalyze | What am I visualizing? Audience? Diagram type? |
| **T**hink | Layout direction, node count, subgraph strategy |
| **A**pply Skills | Palette + semantic classDef + init directive |
| **C**reate | Write code. Every node styled. Every flowchart gets `linkStyle default` |
| **C**heck | Render. Pastels only, balanced layout, readable labels, gray arrows |
| **U**pdate | Write to file. Add `**Figure N:** *description*` caption |

## Init Directive (Required)

```
  'lineColor': '#57606a',
  'primaryColor': '#ddf4ff',
  'primaryBorderColor': '#0969da',
  'primaryTextColor': '#1f2328',
  'edgeLabelBackground': '#ffffff'
}}}%%
```
