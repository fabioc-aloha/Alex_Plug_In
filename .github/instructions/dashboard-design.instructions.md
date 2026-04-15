---
description: "Auto-loaded for dashboards: define audience, pick KPIs, arrange panels, wire interactions, validate story flow"
application: "When interpreting charts, building dashboards, or visualizing data"
applyTo: "**/*dashboard*,**/*kpi*,**/*panel*"
---

# Dashboard Design Procedure

Layout patterns, KPI card templates, filter architecture reference → load `dashboard-design` skill.

## Procedure

### Step 1: Define Audience

Who looks at this dashboard and what decisions do they make?

| Audience    | Attention Span | Max Visuals | Interaction Depth |
| ----------- | -------------- | ----------- | ----------------- |
| Executive   | 30 seconds     | 5 (5-Visual Rule) | KPIs + 1 drill   |
| Manager     | 2 minutes      | 7-8         | Filters + drill   |
| Analyst     | Unlimited      | 10+         | Full exploration  |
| General     | 1 minute       | 4-5         | Familiar charts   |

### Step 2: Identify KPIs

Select 3-6 headline numbers:
1. Each KPI answers a different "what?" question
2. At least one shows a delta (change over time or vs. target)
3. Lead with the most important metric (top-left position)
4. Add color thresholds if applicable (green = good, red = action needed)
5. Include subtitle with time range or source

### Step 3: Choose Hero Chart

The single most important visual:
1. Must convey the main story of the dashboard
2. Full-width placement (highest visual prominence)
3. Interactive (click to drill or filter)
4. Title written as insight, not label

### Step 4: Add Supporting Views

2-3 charts that provide different lenses on the same data:
1. Each answers a different question than the hero chart
2. Use different chart types to avoid visual monotony
3. Maintain semantic color consistency with hero chart
4. Smaller than hero (half-width or third-width)

### Step 5: Design Filter Set

1. Global filters at top (region, time range)
2. "All" or "Reset" as first option
3. Active filter state clearly visible (colored buttons)
4. Search box for primary text column
5. Filter changes animate (300ms transition)

### Step 6: Wire Interactions

Map the interaction chain:
```
Filter → charts update → table updates
Click chart item → drill-down modal opens
Sort column → table reorders
Search → non-matching items fade
```

### Step 7: Build Data Table

1. Columns match the story (don't dump every field)
2. Sortable by numeric columns
3. Clickable rows trigger drill-down
4. Inline indicators (rank badges, mini bars, color dots)

### Step 8: Apply Theme

1. Choose dark or light base (dark preferred for data dashboards)
2. Set CSS custom properties for all colors
3. Apply responsive breakpoints (stack at <768px)
4. Ensure WCAG AA contrast ratios

### Step 9: Embed Data

1. All data as JavaScript arrays/objects (no external fetch)
2. Single CDN dependency: Chart.js 4.x
3. No build step required

### Step 10: Validate Narrative

Read the dashboard top-to-bottom:
1. KPIs → Do they tell the headline?
2. Hero chart → Does it show the shape of the story?
3. Supporting charts → Do they add new perspectives?
4. Table → Does it provide the details an analyst needs?
5. Drill-down → Does it answer the "tell me more" question?

If any panel doesn't advance the story, remove it.

## Output Format

Self-contained HTML file following the reference pattern from population.html:
- CSS grid layout with `auto-fit`, `minmax`
- Chart.js via CDN
- CSS custom properties for theming
- Responsive at 768px breakpoint
- Print-friendly `@media print` styles

## Routing

- Chart type selection → `data-visualization` instruction
- Data profiling / insight extraction → `data-analysis` instruction
- Full narrative arc construction → `data-storytelling` instruction
- Generating the HTML file → load `dashboard-scaffold.cjs` muscle
