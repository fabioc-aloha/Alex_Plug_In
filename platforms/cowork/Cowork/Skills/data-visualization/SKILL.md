---
name: Data Visualization
description: Select the right chart type by story intent, apply colorblind-safe palettes, annotate insights, and remove clutter for clear data communication.
---

## Purpose

Turn data into visuals that communicate. A good chart answers one question clearly. A bad chart confuses many questions at once. This skill covers chart selection, color theory, annotation, and the principle that the chart title should BE the insight.

## Steps

1. Start with the question: what does the audience need to understand?
2. Select the chart type based on the relationship in the data
3. Apply the colorblind-safe palette
4. Write the title as the insight, not the metric name
5. Annotate the key data point
6. Remove all clutter: gridlines, borders, unnecessary legends, 3D effects
7. Add source attribution

## Chart Selection by Story Intent

| Intent                | Best Chart Type            | Example                         |
| --------------------- | -------------------------- | ------------------------------- |
| Compare categories    | Horizontal bar             | "Sales by region"               |
| Show trend over time  | Line                       | "Monthly revenue, 2023-2024"    |
| Part of whole         | Stacked bar or pie (max 5) | "Revenue split by product line" |
| Correlation           | Scatter                    | "Marketing spend vs. revenue"   |
| Distribution          | Histogram or box plot      | "Customer age distribution"     |
| Ranking               | Sorted horizontal bar      | "Top 10 customers by revenue"   |
| Composition over time | Stacked area               | "Channel mix evolution"         |
| Flow or conversion    | Funnel or Sankey           | "Sales pipeline stages"         |
| Geographic            | Choropleth map             | "Revenue by country"            |

## Colorblind-Safe Palette (Mandatory)

Use the Tableau 10 palette for all data series:

| Order | Color  | Hex Code |
| ----- | ------ | -------- |
| 1     | Blue   | #4e79a7  |
| 2     | Orange | #f28e2b  |
| 3     | Red    | #e15759  |
| 4     | Teal   | #76b7b2  |
| 5     | Green  | #59a14f  |
| 6     | Yellow | #edc948  |
| 7     | Purple | #b07aa1  |
| 8     | Pink   | #ff9da7  |
| 9     | Brown  | #9c755f  |
| 10    | Gray   | #bab0ac  |

Never use arbitrary colors. Never rely on red/green distinction alone.

## Title = Insight Principle

| Bad Title (Topic)         | Good Title (Insight)                                       |
| ------------------------- | ---------------------------------------------------------- |
| "Q3 Revenue"              | "Q3 Revenue Grew 18% Driven by Enterprise Segment"         |
| "Customer Satisfaction"   | "Satisfaction Dropped Below Target for First Time in 2024" |
| "Headcount by Department" | "Engineering Grew 40% While Sales Stayed Flat"             |

## Annotation Rules

- Highlight the single most important data point with a contrasting color
- Add a callout or label to that point
- Gray out non-essential data series
- Use direct labels instead of legends when there are 3 or fewer series
- Place the source in small text at the bottom left

## Clutter Removal Checklist

- [ ] Remove chart border and background fill
- [ ] Remove or lighten gridlines (light gray if needed)
- [ ] Remove 3D effects
- [ ] Remove unnecessary legend (use direct labels)
- [ ] Remove data labels on non-key points
- [ ] Ensure axis labels are readable (no rotated text)
- [ ] Verify the y-axis starts at 0 for bar charts

## Output Format

- Chart specification: type, data mapping, colors, title (as insight)
- Annotation guide: which data point to highlight and why
- Source attribution text

## Guidelines

- One chart, one message. If a chart tells two stories, make two charts.
- The audience should understand the point in under 5 seconds
- Start bar chart axes at 0 to avoid exaggerating differences
- Pie charts: maximum 5 slices. If more, use a horizontal bar chart.
- Time always flows left to right on the x-axis
- If the chart needs a paragraph of explanation, the chart has failed
