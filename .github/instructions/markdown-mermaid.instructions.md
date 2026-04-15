---
description: "Mermaid diagram creation, technical documentation visuals, diagram type selection, and rendering troubleshooting"
application: "When writing or reviewing documentation, or ensuring docs stay current"
applyTo: "**/*.md,**/*mermaid*,**/*diagram*"
---

# Markdown & Mermaid — Auto-Loaded Rules

## ⚠️ MANDATORY: Copy This Template First

**EVERY Mermaid diagram MUST start with this template.** No exceptions. Copy-paste, then customize:

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

**Do NOT write Mermaid without this template.** The init directive, classDef, and linkStyle are required.

---

Diagram type selection, classDef rules, GitHub Pastel v2 palette, rendering pitfalls, quality gate → see markdown-mermaid skill.

## Critical: Edge Label Background

**ALWAYS use white background for edge labels.** Without this, labels appear with dark boxes in dark mode or break rendering.

```
edgeLabelBackground: '#ffffff'
```

This is the single most common Mermaid mistake. Never use `'transparent'` — always `'#ffffff'`.

## ATACCU Workflow (Every Diagram)

| Step | What |
| ---- | ---- |
| **A**nalyze | What am I visualizing? Audience? Diagram type? |
| **T**hink | Layout direction, node count, subgraph strategy |
| **A**pply | **COPY THE TEMPLATE ABOVE** — palette + classDef + init directive |
| **C**reate | Write code. Every node styled with `:::className`. Every flowchart gets `linkStyle default` |
| **C**heck | Render. Pastels only, balanced layout, readable labels, gray arrows |
| **U**pdate | Write to file. Add `**Figure N:** *description*` caption |

## Semantic Color Assignment

| Color | Use For |
| ----- | ------- |
| `blue` | Input, source, start |
| `green` | Output, result, success, data |
| `purple` | Processing, model, transformation |
| `gold` | Decision, condition, question |
| `red` | Error, warning, failure |
| `neutral` | Context, background, optional |

## Quality Checklist

- [ ] Init directive is FIRST line in mermaid block
- [ ] `edgeLabelBackground: '#ffffff'` (NOT transparent)
- [ ] ALL nodes have `:::className` (no unstyled nodes)
- [ ] `linkStyle default stroke:#57606a` for flowcharts
- [ ] Multi-line labels use `<br/>` NOT `\n`
- [ ] Colors are pastel (light fills, medium text)
- [ ] Figure label below diagram

## Do NOT

- Write ANY Mermaid without the init directive template
- Use `edgeLabelBackground: 'transparent'` (dark mode breaks)
- Use `theme: 'dark'` (use `theme: 'base'` with pastels)
- Forget `linkStyle default` on flowcharts
- Use `\n` for line breaks (use `<br/>`)
- Leave nodes unstyled
