# Markdown & Mermaid Diagram Instructions

**Auto-loaded when**: Creating Mermaid diagrams, writing technical documentation with visuals, choosing diagram types, or troubleshooting rendering issues
**Domain**: Technical documentation, Mermaid.js, visual communication
**Synapses**: [markdown-mermaid/SKILL.md](../skills/markdown-mermaid/SKILL.md)

---

## Purpose

Produce correct, visually consistent Mermaid diagrams using the ATACCU protocol — preventing parse errors, unstyled nodes, inconsistent palettes, and broken rendering across VS Code, GitHub, and web contexts.

---

## When This Applies

**File Patterns**:
- `**/*.md` — Any markdown file

**Contextual Triggers**:
- Writing a diagram in a markdown doc
- Choosing between flowchart, sequence, gantt, classDiagram, quadrant
- Diagram renders incorrectly in VS Code Preview or GitHub
- Requesting a visual explanation of architecture or workflow

---

## Mandatory Workflow: ATACCU

**Every Mermaid diagram must follow these 6 steps — no exceptions:**

| Step | What |
| ---- | ---- |
| **A**nalyze | What am I visualizing? Who's the audience? Which diagram type fits? |
| **T**hink | Layout direction, node count, subgraph strategy, will it be too wide/tall? |
| **A**pply Skills | GitHub Pastel v2 palette + semantic `classDef` colors + `%%{init}%%` directive |
| **C**reate | Write Mermaid code. Every node gets a style. Every flowchart gets `linkStyle default`. |
| **C**heck | Render. Verify: pastels (not saturated), balanced layout, readable labels, gray arrows |
| **U**pdate | Write to target file. Add `**Figure N:** *description*` caption. |

---

## Init Directive (Required on Every Diagram)

```
%%{init: {'theme': 'base', 'themeVariables': {
  'lineColor': '#57606a',
  'primaryColor': '#ddf4ff',
  'primaryBorderColor': '#0969da',
  'primaryTextColor': '#1f2328'
}}}%%
```

---

## Diagram Type Selection

| Use | Diagram Type |
| --- | ------------ |
| Workflows, pipelines, decision trees | `flowchart LR` (prefer LR over TD for readability) |
| API calls, time-ordered events | `sequenceDiagram` |
| Classes, interfaces, inheritance | `classDiagram` |
| Project timelines, sprints | `gantt` |
| 2×2 strategy maps | `quadrantChart` |
| Layered architecture (VS Code 1.109+) | `architecture-beta` |

---

## classDiagram Rules (Fail-Proof)

classDiagram has different parser rules than flowchart — these cause silent or verbose parse errors:

| Rule | ❌ Wrong | ✅ Correct |
| ---- | -------- | --------- |
| Multiple classes in one classDef | `classDef red A,B,C` | One line per class: `class A:::red` |
| Reserved word as class name | `class abstract` | `class AbstractBase` |
| Font-weight in classDef | `classDef x font-weight:bold` | Not supported — omit |
| Stroke-dasharray with spaces | `stroke-dasharray: 5 5` | `stroke-dasharray:5 5` (no leading space) |
| Interface keyword | `interface IMyInterface` | `class IMyInterface` with `<<interface>>` |

---

## GitHub Pastel v2 Palette

```
Blue (primary/happy):    fill:#ddf4ff,stroke:#0969da,color:#0550ae
Green (success/data):    fill:#dcffe4,stroke:#2da44e,color:#116329
Yellow (warning/config): fill:#fff8c5,stroke:#bf8700,color:#7d4e00
Purple (AI/cognitive):   fill:#f3eeff,stroke:#8250df,color:#6e40c9
Pink (UX/output):        fill:#ffeff7,stroke:#bf3989,color:#99286e
Gray (neutral/infra):    fill:#f6f8fa,stroke:#57606a,color:#24292f
Red (error/risk):        fill:#ffebe9,stroke:#cf222e,color:#a40e26
```

---

## Common Rendering Pitfalls

- **ArrowHead in label**: `A -->|"label with > sign"| B` — percent-encode `>` as `&gt;`
- **Special chars in node IDs**: Use alphanumeric IDs only, put display text in `["..."]`
- **Long lines**: flowchart with 10+ nodes in one row → split with subgraphs
- **GitHub vs VS Code**: GitHub renders subset of Mermaid; `architecture-beta` only works in VS Code 1.109+

---

## Quality Gate — Before Finalizing

- [ ] `%%{init}%%` directive present
- [ ] Every node has a `classDef` applied
- [ ] `linkStyle default stroke:#57606a` at end of flowcharts
- [ ] No saturated colors (only GitHub Pastel v2)
- [ ] `**Figure N:** *description*` caption below the code block
- [ ] Rendered and visually verified (not just syntax-checked)
