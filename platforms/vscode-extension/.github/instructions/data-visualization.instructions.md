---
description: "Auto-loaded when generating charts: select type by story intent, apply palette, annotate insight, declutter"
applyTo: "**/*chart*,**/*visual*,**/*plot*,**/*graph*"
---

# Data Visualization Procedure

Deep reference: `.github/skills/data-visualization/SKILL.md`

## Synapses

- [.github/skills/data-visualization/SKILL.md] (Critical, Enables, Bidirectional) - "Skill provides chart selection matrix and color theory"
- [.github/instructions/data-analysis.instructions.md] (High, Consumes, Input) - "Analysis feeds insights that visualization renders"
- [.github/instructions/dashboard-design.instructions.md] (High, Feeds, Forward) - "Visualization provides charts that dashboards arrange"
- [.github/instructions/data-storytelling.instructions.md] (High, Feeds, Forward) - "Visualization provides visual evidence for narrative"

## When This Activates

This procedure auto-loads when:
- User asks to create, generate, or recommend a chart or visualization
- A file matching `*chart*`, `*visual*`, `*plot*`, `*graph*` is being edited
- Another skill (data-analysis, data-storytelling) requests visualization output

## Procedure

### Step 1: Identify Story Intent

Before choosing a chart type, determine what story the user wants to tell.

Ask or infer the intent from these 9 categories:

| Intent | Signal Words |
|--------|-------------|
| Compare | rank, versus, top, best, worst, differ |
| Change Over Time | trend, growth, decline, monthly, over time |
| Part-to-Whole | share, proportion, breakdown, percent of |
| Distribution | spread, range, outlier, normal |
| Relationship | correlation, affects, predict, connected |
| Flow / Process | flow, path, from-to, conversion, funnel |
| Hierarchy | drill down, parent, child, levels |
| Spatial Pattern | where, hotspot, concentration |
| Deviation | variance, above/below target, gap |

If the user doesn't state intent, infer from their question. If ambiguous, ask.

### Step 2: Select Chart Type

1. Match story intent to chart candidates (see SKILL.md Step 1 table)
2. Narrow by data shape (SKILL.md Step 2 table)
3. Filter by audience: executive (simple), analyst (detailed), general (familiar)
4. If multiple candidates remain, pick the simplest that conveys the message

### Step 3: Map Data to Encodings

| Encoding | Best For |
|----------|---------|
| Position (x/y axis) | Quantitative comparison, trend |
| Length (bar) | Magnitude comparison |
| Color hue | Categories (max 8) |
| Color intensity | Sequential numeric |
| Size (area) | Third variable in scatter/bubble |
| Angle | Avoid -- poor human perception |

### Step 4: Write Title as Insight

The chart title is a complete sentence stating the takeaway.

| Wrong | Right |
|-------|-------|
| "Revenue by Quarter" | "Revenue grew 34% YoY but growth is decelerating" |
| "Population by State" | "California leads with 39M -- 5x the median state" |
| "Campaign ROI" | "Email delivers 3.2x ROI vs. paid social" |

### Step 5: Declutter

Remove in this order:
1. 3D effects (always remove)
2. Background fills (use transparent)
3. Heavy gridlines (remove or set to very subtle)
4. Borders around chart area (use white space)
5. Legend (replace with direct labels when possible)
6. Redundant axis labels (context goes in title/subtitle)

### Step 6: Apply Color Palette (Mandatory: Colorblind-Safe)

1. **Always use the canonical Tableau 10 palette**: `#4e79a7, #f28e2b, #e15759, #76b7b2, #59a14f, #edc948, #b07aa1, #ff9da7, #9c755f, #bab0ac`
2. Pick the first N colors needed from this 10-color sequence
3. Apply semantic consistency: same category = same color across all charts
4. Highlight the key insight data point with saturated color; mute the rest with lower opacity
5. For sequential data: light-to-dark single hue (e.g., `#deebf7 → #08519c`)
6. For diverging data: two hues from neutral midpoint (e.g., `#b2182b → #f7f7f7 → #2166ac`)
7. Never use raw CSS color names or arbitrary hex -- always reference the canonical palette

### Step 7: Annotate

1. Callout the key data point that proves the story
2. Add subtitle with context (time range, data source, filter applied)
3. Add footnote for caveats or methodology notes
4. Always include data source attribution

### Step 8: Validate

Apply the 3-second test:
- Show the chart to yourself for 3 seconds
- Can you state the intended message?
- If not, the chart type or annotation is wrong -- go back to Step 2

## Chart.js Defaults

When generating Chart.js code, apply these defaults:

```javascript
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.scales.x.grid.display = false;
Chart.defaults.scales.y.grid.color = 'rgba(255,255,255,0.06)';
```

## Output Format

Always output as self-contained HTML unless the user specifies otherwise:
- Embed data as JavaScript arrays
- Load Chart.js via CDN: `https://cdn.jsdelivr.net/npm/chart.js`
- Use CSS custom properties for theming
- Include responsive canvas sizing
- Add `alt` text describing the insight (not the chart type)

## Routing

- Full chart selection matrix, all 24 types, color palettes → load `data-visualization` skill
- Dashboard layout, KPI cards, filter design → `dashboard-design` skill
- Narrative arc, three-act structure, audience framing → `data-storytelling` skill
- Read/interpret existing chart → `chart-interpretation` skill
