---
sem: 1
description: Design an interactive dashboard layout with KPIs, charts, filters, and drill-down
application: "When requesting dashboard workflows"
agent: Alex
---

# /dashboard - Dashboard Design

Turn metrics into an interactive dashboard that tells a story through layout, not just charts.

## Workflow

1. **You provide**: Data + audience + key questions the dashboard should answer
2. **I identify**: KPIs, hero chart, supporting views, filter dimensions
3. **I design**: Layout spec with panel arrangement and interaction flow
4. **I generate**: Self-contained HTML dashboard with embedded data

## What I Need

| Input    | Required | Example                                             |
| -------- | -------- | --------------------------------------------------- |
| Data     | Yes      | File path, URL, pasted table, or from prior /analyze|
| Audience | Yes      | executive, manager, analyst, general                |
| Questions| Helpful  | "What regions are growing? Where are we losing?"    |
| Layout   | Optional | "inverted pyramid" or "narrative scroll"            |
| Theme    | Optional | dark (default), light                               |

## Dashboard Components

| Component        | Purpose                    |
| ---------------- | -------------------------- |
| KPI cards (3-6)  | Headline metrics           |
| Hero chart       | Main story visualization   |
| Supporting charts| Different lenses on data   |
| Filter controls  | Interactive exploration    |
| Data table       | Detail on demand           |
| Drill-down modal | Deep-dive per item         |

## Start

Share your data and tell me who the dashboard is for and what questions it should answer. I'll design the layout and generate it.
