---
description: "Auto-loaded when reading charts: identify type, decode encodings, detect patterns, check for bias, extract narrative"
applyTo: "**/*interpret*,**/*read-chart*,**/*chart-review*"
---

# Chart Interpretation Procedure

Deep reference: `.github/skills/chart-interpretation/SKILL.md`

## Synapses

- [.github/skills/chart-interpretation/SKILL.md] (Critical, Enables, Bidirectional) - "Skill provides chart type recognition, misleading detection, narrative extraction"
- [.github/instructions/data-visualization.instructions.md] (High, Uses, Bidirectional) - "Chart type knowledge aids decoding"
- [.github/instructions/data-analysis.instructions.md] (Medium, Feeds, Bidirectional) - "Extracted insights can trigger re-analysis"

## When This Activates

This procedure auto-loads when:
- User shares a chart image, screenshot, or HTML file and asks what it means
- User asks to interpret, read, or analyze an existing visualization
- User asks to check a chart for bias or misleading elements
- Data-storytelling orchestration needs to read existing charts

## Procedure

### Step 1: Identify Chart Type

Determine the chart type from visual features:
- Bar/column, line, area, pie/donut, scatter, bubble, histogram, heatmap, treemap, Sankey, box plot, network, violin, etc.
- Chart type determines the reading strategy (comparison, trend, distribution, etc.)

### Step 2: Read Structural Elements

Before touching the data, read:
1. **Title** -- the author's intended takeaway (if present)
2. **Subtitle** -- time range, filter condition, context
3. **Axis labels** -- what variables are plotted and their units
4. **Legend** -- category-to-color or category-to-shape mapping
5. **Annotations** -- any callouts or highlights the author placed
6. **Data source** -- where the data came from
7. **Date/time** -- when data was collected or reported

### Step 3: Extract Key Data Points

From the visual encodings, estimate:
1. Maximum and minimum values
2. Averages or central tendencies
3. Notable specific values (peaks, troughs, crossover points)
4. Totals or proportions if applicable

State precision honestly: "approximately $4.2M" (visual estimate) vs. "$4,237,892" (labeled value)

### Step 4: Detect Patterns

Scan for:
- **Trends**: consistent direction (up, down, flat)
- **Inflection points**: where direction changes
- **Clusters**: groups of points or bars
- **Outliers**: values far from the main group
- **Periodicity**: repeating patterns
- **Gaps**: missing data or discontinuities
- **Dominance**: one item significantly larger than others

### Step 5: Check for Misleading Elements

Always scan for:
1. Non-zero baseline (Y-axis not starting at 0)
2. Truncated or cherry-picked time range
3. Dual axes with different scales
4. 3D effects causing area distortion
5. Suppressed categories in "Other"
6. Missing denominator for percentages
7. Reversed or non-standard axis direction

If found, note the impact: "Y-axis starts at $2M, exaggerating differences by approximately 2x"

### Step 6: Formulate Insights

Write 3-5 insight statements as narrative prose:
1. **Primary insight**: the main takeaway (1 sentence)
2. **Supporting patterns**: 2-4 secondary observations with evidence
3. **Anomalies**: anything unexpected worth flagging

### Step 7: Identify What's Missing

What context does the chart NOT provide?
- Missing variables (cost alongside revenue?)
- Missing time periods (why only last 6 months?)
- Missing segments (aggregated when sub-groups differ?)
- Missing baselines (performance vs. what target?)

### Step 8: Rate Confidence

- **High**: Clear labels, readable axis, familiar chart type
- **Medium**: Some values estimated from visual position
- **Low**: Blurry image, missing labels, ambiguous encoding

### Step 9: Generate Audience-Adapted Output

Produce all three formats:

**Executive (3 bullets, 30 seconds)**:
- Primary takeaway
- Key evidence
- Recommendation or implication

**Detailed analysis (2-3 paragraphs)**:
- Chart description, primary finding, supporting observations, caveats

**Talking points (presenter-ready)**:
- "What you're seeing here is..." phrasing
- Key number + implication
- Surprise + hypothesis
- Action item

### Step 10: Suggest Improvements

How could this chart tell its story better?
- Better chart type?
- Added reference line?
- Decluttering opportunity?
- Title rewritten as insight?
- Missing annotation?

## Routing

- Generate a better version of this chart → `data-visualization` instruction
- Re-analyze the underlying data → `data-analysis` instruction
- Build a complete story from these findings → `data-storytelling` instruction
- Place this chart in a dashboard context → `dashboard-design` instruction
