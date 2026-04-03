---
name: Chart Interpretation
description: Read any chart or data visualization, extract insights, detect patterns and anomalies, check for bias, and construct a narrative.
---

## Purpose

Decode any chart (screenshot, embedded image, slide visual) into actionable insights. Charts can inform or mislead. This skill teaches how to read them critically, extract what matters, and spot what's hidden or distorted.

## Steps

1. **Identify the chart type**: bar, line, pie, scatter, area, combo, heatmap, treemap, funnel
2. **Read the axes**: What's measured? What units? What time range? Are axes truncated?
3. **Decode the encodings**: What do colors, sizes, positions, and shapes represent?
4. **Find the story**: What's the main takeaway? What trend or comparison is shown?
5. **Check for bias**: Is the visualization honest or misleading?
6. **Extract the narrative**: Write what this chart tells the audience

## Chart Type Identification

| Type      | Recognizable Feature                  | Best For                      |
| --------- | ------------------------------------- | ----------------------------- |
| Bar       | Rectangular bars, categorical axis    | Comparing categories          |
| Line      | Connected points over continuous axis | Trends over time              |
| Pie/Donut | Circle divided into segments          | Part-of-whole (max 5 slices)  |
| Scatter   | Dots in 2D space                      | Correlation between variables |
| Area      | Filled region under a line            | Volume/composition over time  |
| Heatmap   | Color grid                            | Density or intensity patterns |
| Funnel    | Narrowing stages                      | Conversion or dropout rates   |

## Critical Reading Checklist

| Check              | What to Look For                                          |
| ------------------ | --------------------------------------------------------- |
| Y-axis start       | Does it start at 0? Truncated axes exaggerate differences |
| Scale linearity    | Are intervals equal? Non-linear scales distort patterns   |
| Time range         | Is it cherry-picked to show a favorable trend?            |
| Missing context    | Is there a baseline, target, or benchmark for comparison? |
| Color manipulation | Does red = bad and green = good, or is color arbitrary?   |
| Sample size        | Is n= shown? Small samples produce unreliable patterns    |
| Dual axes          | Do two y-axes create a misleading correlation?            |
| 3D effects         | Do they distort proportions? (Almost always yes)          |

## Insight Extraction Template

For any chart, answer these questions:

1. **WHAT**: What does this chart show? (One sentence)
2. **SO WHAT**: Why does this matter? What's the implication?
3. **PATTERN**: What trend, comparison, or anomaly stands out?
4. **OUTLIER**: Is anything unexpected or inconsistent?
5. **NOW WHAT**: What action does this data suggest?

## Common Misleading Patterns

| Pattern                        | How It Misleads                        | How to Detect                            |
| ------------------------------ | -------------------------------------- | ---------------------------------------- |
| Truncated y-axis               | Small differences look dramatic        | Check if y-axis starts at 0              |
| Cherry-picked time range       | Shows only the favorable period        | Ask: what happened before and after?     |
| Cumulative vs. incremental     | Cumulative lines always go up          | Check if the metric is cumulative        |
| Correlation as causation       | Two lines moving together implies link | Look for common causes or coincidence    |
| Pie chart with too many slices | Impossible to compare accurately       | Count the slices; more than 5 is suspect |

## Output Format

- Chart type identification and encoding summary
- Key insight in one sentence (WHAT + SO WHAT)
- Bias or quality assessment
- Recommended actions or follow-up questions

## Guidelines

- Always check the axes before drawing conclusions
- If a chart looks dramatic, check if the scale is honest
- "Correlation" is not "causation": always look for alternative explanations
- A good chart answers one question clearly; a bad chart confuses many
- When presenting a chart to others, state the takeaway explicitly instead of saying "as you can see"
