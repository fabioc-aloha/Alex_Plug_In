---
sem: 1
description: Recommend and generate the right chart for your data story
application: "When analyzing data, creating visualizations, or building reports"
agent: Alex
---

# /visualize - Data Visualization

Story-intent-first chart selection -- choose the visualization that tells your story, not just one that fits your data shape.

## Workflow

1. **You provide**: Data (paste, file path, or describe shape) + what you want to show
2. **I identify**: Story intent, data shape, audience level
3. **I recommend**: Best chart type with rationale + one alternative
4. **I generate**: Self-contained HTML with Chart.js (or Canvas for advanced types)

## Story Intents

| Intent | Example Question |
| ------ | --------------- |
| **Compare** | Which region sells the most? |
| **Change Over Time** | How has revenue trended this year? |
| **Part-to-Whole** | What's each product's market share? |
| **Distribution** | How are customer ages spread? |
| **Relationship** | Does ad spend correlate with conversions? |
| **Flow / Process** | Where do users drop off in signup? |
| **Hierarchy** | How does budget break down by department? |
| **Spatial Pattern** | Where are the hotspots? |
| **Deviation** | Which units missed their target? |

## What I Need

- **Data**: CSV, JSON, XLSX path, pasted table, or a description of the columns/rows
- **Story**: What question should the chart answer? (I'll infer intent if you describe the question)
- **Audience** (optional): executive, analyst, or general public (defaults to analyst)

## Start

Share your data and the question you want the chart to answer. I'll pick the right visualization and generate it.
