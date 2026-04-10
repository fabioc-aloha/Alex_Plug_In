# Data Analysis and Visualization

## Data Analysis

Turn raw data into actionable insight statements. This covers the full EDA pipeline: profiling the dataset, exploring distributions, finding correlations, detecting anomalies, and translating statistical findings into business-language narratives tagged with story intents for downstream visualization.

The cardinal rule: **statistics are not insights**. "Mean revenue is $4.2M" is a statistic. "Revenue grew 34% YoY but growth is decelerating: Q3 peak was 8% vs. 22% last year" is an insight.

### Data Profiling

First pass on any dataset. Compute before exploring.

| Metric             | What It Tells You                        | Red Flag                              |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| Row count          | Dataset scale                            | <100 rows limits statistical power    |
| Column count       | Dimensionality                           | >50 columns suggests feature bloat    |
| Null percentage    | Data completeness                        | >20% nulls in key column = unreliable |
| Unique count       | Cardinality                              | Unique count = row count → likely ID  |
| Type inference     | String/number/date/boolean               | Mixed types in same column = dirty    |
| Memory estimate    | Processing feasibility                   | >500MB warns for browser context      |
| Duplicate rows     | Data quality                             | >1% duplicates needs dedup decision   |

#### Profiling Output Template

```
Dataset: {name} ({rowCount} rows x {colCount} columns)
Source:  {source} | Format: {format} | Encoding: {encoding}

Column Summary:
  {name}: {type} | {nullPct}% null | {uniqueCount} unique | min={min} max={max} mean={mean}
  ...

Quality Score: {score}/100
  - Completeness: {completeness}% (columns with <5% nulls)
  - Consistency: {consistency}% (columns with single type)
  - Uniqueness: {uniqueness}% (no unexpected duplicates)

Warnings:
  - Column "X" has 23% nulls -- consider imputation or exclusion
  - Column "Y" has mixed types (78% number, 22% string) -- needs cleaning
```

### Descriptive Statistics

What to compute first for every numeric column.

| Statistic        | When It Matters                                    |
| ---------------- | -------------------------------------------------- |
| Mean vs. Median  | If mean >> median, right-skewed (outliers pull up) |
| Standard Dev     | Spread -- is the data tight or dispersed?          |
| Min / Max        | Range -- any impossible values?                    |
| Percentiles      | P25, P50, P75 -- where does the bulk sit?          |
| Skewness         | >1 or <-1 suggests non-normal distribution         |
| Kurtosis         | >3 = heavy tails (more outliers than expected)     |

#### Rule of Thumb: Mean vs. Median

- If `|mean - median| / median > 0.1` (10%), report median as the "typical" value
- Always report both -- the gap itself is an insight

### Distribution Analysis

| Shape        | What It Suggests                          | Story Intent     |
| ------------ | ----------------------------------------- | ---------------- |
| Normal       | Stable process, predictable               | Distribution     |
| Right-skewed | Many small values, few large (income)     | Deviation        |
| Left-skewed  | Most values high, some low (test scores)  | Deviation        |
| Bimodal      | Two populations mixed together            | Compare (groups) |
| Uniform      | No pattern -- random or categorical codes | None (check)     |
| Power law    | Few items dominate (Pareto, web traffic)  | Part-to-Whole    |

#### Normality Quick Check

1. Compare mean to median (>10% gap = non-normal)
2. Check skewness (|skew| > 1 = non-normal)
3. If important: Shapiro-Wilk test (n < 5000) or Anderson-Darling

### Correlation & Relationship

| Strength | `|r|` Range | Interpretation              |
| -------- | ----------- | --------------------------- |
| Strong   | 0.7 -- 1.0  | Likely meaningful           |
| Moderate | 0.4 -- 0.7  | Worth investigating         |
| Weak     | 0.1 -- 0.4  | Unlikely actionable alone   |
| None     | < 0.1       | No linear relationship      |

#### Simpson's Paradox Awareness

Always check: does the correlation reverse when you split by a categorical variable?

```
Overall: Ad spend positively correlates with sales (+0.6)
By region: In 3 of 4 regions, correlation is NEGATIVE
Cause: High-spend region has higher baseline sales (confound)
```

**Rule**: If a strong correlation exists, segment by the top 2-3 categorical variables and re-check.

### Segmentation

Group-by patterns for discovering sub-populations.

| Technique          | When to Use                          | Output            |
| ------------------ | ------------------------------------ | ----------------- |
| Group-by aggregate | Categorical × numeric                | Segment averages  |
| Percentile buckets | Continuous variable, create tiers    | Low/Mid/High      |
| RFM analysis       | Customer behavior (recency, freq, $) | Customer segments |
| Cohort analysis    | Time-based grouping (signup month)   | Retention curves  |
| Cross-tabulation   | Two categorical variables            | Contingency table |

#### "So What?" for Segments

For each segment found, answer: "If I could only act on ONE segment, which one and why?"

### Time-Series Decomposition

| Component    | What It Is                            | Detection                       |
| ------------ | ------------------------------------- | ------------------------------- |
| Trend        | Long-term direction                   | Rolling average (window = period) |
| Seasonality  | Repeating pattern at fixed intervals  | Autocorrelation at lag = period |
| Residual     | What's left (noise + anomalies)       | Original - trend - seasonality  |

#### Rolling Average Windows

| Data Frequency | Window  |
| -------------- | ------- |
| Daily          | 7 or 30 |
| Weekly         | 4 or 13 |
| Monthly        | 3 or 12 |
| Quarterly      | 4       |

### Anomaly Detection

| Method     | Best For                   | Threshold              |
| ---------- | -------------------------- | ---------------------- |
| Z-score    | Normal-ish distributions   | |z| > 3               |
| IQR fence  | Skewed distributions       | < Q1-1.5×IQR or > Q3+1.5×IQR |
| Isolation   | Multivariate outliers      | Score > 0.7 (heuristic) |
| Visual      | Any -- always plot first   | Inspect scatter/box    |

#### Anomaly Protocol

1. Detect and **flag** -- never auto-remove
2. Investigate: is it a data error, a real outlier, or a different population?
3. Document the decision: kept (real), removed (error), or separated (sub-population)

### "So What?" Translation (DIKW)

The most important module. Convert statistics into business language.

| Level           | Example (Bad)                    | Example (Good)                                                           |
| --------------- | -------------------------------- | ------------------------------------------------------------------------ |
| **Data**        | "Column revenue has 5000 values" | (Don't report raw data)                                                  |
| **Information** | "Mean revenue is $4.2M"          | "Average quarterly revenue is $4.2M across 8 quarters"                   |
| **Knowledge**   | "Revenue has a positive trend"   | "Revenue grew 34% YoY but growth rate decelerated from 22% to 8%"       |
| **Wisdom**      | (Requires domain context)        | "Growth is decelerating -- if Q3 seasonal effect weakens, plan for flat" |

#### Insight Statement Template

```
[WHAT]: {metric} is {value/behavior}
[SO WHAT]: This means {business implication}
[NOW WHAT]: Consider {action or follow-up question}
[STORY INTENT]: {compare|trend|deviation|distribution|relationship|part-to-whole|flow|hierarchy|spatial}
[CHART]: {recommended chart type} because {rationale}
```

#### Example Insight Statements

```
[WHAT]: California's population (39M) is 5x the median state (7.5M)
[SO WHAT]: Resource allocation models using state averages will dramatically under-serve CA
[NOW WHAT]: Segment by population tier, not just state count
[STORY INTENT]: Compare
[CHART]: Horizontal bar (sorted descending) because ranking 50 items with long labels

[WHAT]: Support ticket resolution time has a bimodal distribution (peaks at 2h and 48h)
[SO WHAT]: Two distinct processes exist -- quick fixes and escalated investigations
[NOW WHAT]: Separate the two populations before setting SLA targets
[STORY INTENT]: Distribution
[CHART]: Histogram with two highlighted peaks, or violin plot for visual impact
```

### Hypothesis Framework

Structured approach to moving from observation to testable claim.

| Step         | Action                                             |
| ------------ | -------------------------------------------------- |
| Observe      | Note a pattern in the data                         |
| Hypothesize  | State a testable claim ("X causes Y because Z")   |
| Test         | Check against data (filter, segment, correlate)    |
| Conclude     | Supported, refuted, or inconclusive                |
| Narrate      | Write the finding as an insight statement          |

#### Anti-Patterns

| Anti-Pattern             | Problem                                     | Fix                                         |
| ------------------------ | ------------------------------------------- | ------------------------------------------- |
| Reporting stats only     | No business meaning                         | Always add "so what?"                       |
| Correlation = causation  | Misleading conclusions                      | Check for confounders, state "correlates"   |
| Ignoring base rates      | Percentages without context                 | Always report denominator                   |
| Survivorship bias        | Only analyzing what's visible               | Ask "what's missing from this data?"        |
| Over-aggregation         | Hiding variation with averages              | Show distribution, not just mean            |
| Premature optimization   | Jumping to solutions before understanding   | Complete the EDA before recommending action |

## Data Visualization

Data visualization is not chart generation -- it is **visual argumentation**. The chart type, color palette, annotation, and title are all rhetorical choices that either strengthen or weaken the story.

### Core Principles

| Principle                 | Rule                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Title = Insight**       | Chart titles state the takeaway, not the data label. "California leads with 39M" not "Population by State" |
| **Story-Intent First**    | Ask "what story?" before "what chart?"                                                                     |
| **Data-Ink Ratio**        | Every pixel of ink should represent data. Remove everything else (Tufte)                                   |
| **3-Second Test**         | If a viewer can't grasp the point in 3 seconds, redesign                                                   |
| **Annotation = Argument** | Callouts carry the story; the chart is evidence, the annotation is the argument                            |

### Story-Intent Chart Selection

The primary axis for chart selection is **what story the user wants to tell**. Data shape is a secondary constraint.

#### Step 1: Identify Story Intent

| Story Intent         | Question Being Answered                          | Primary Charts                           | Advanced Charts                       |
| -------------------- | ------------------------------------------------ | ---------------------------------------- | ------------------------------------- |
| **Compare**          | "How do these items rank or differ?"             | Bar, Horizontal Bar, Grouped Bar, Radar  | Beeswarm, Parallel Coordinates        |
| **Change Over Time** | "How has this evolved?"                          | Line, Area, Stacked Area                 | Streamgraph, Ridgeline                |
| **Part-to-Whole**    | "What share does each segment hold?"             | Donut, Stacked Bar, Pie                  | Waffle, Sunburst                      |
| **Distribution**     | "How is this spread? What's normal vs. outlier?" | Histogram, Scatter                       | Violin, Beeswarm, Ridgeline           |
| **Relationship**     | "How are these variables connected?"             | Scatter, Bubble                          | Chord, Network Graph, Parallel Coords |
| **Flow / Process**   | "Where does it go? What are the paths?"          | Horizontal Bar (stages)                  | Sankey, Chord                         |
| **Hierarchy**        | "How is this organized in levels?"               | Treemap                                  | Sunburst                              |
| **Spatial Pattern**  | "Where are the concentrations?"                  | Heatmap                                  | Network Graph                         |
| **Deviation**        | "What deviates from the baseline?"               | Bar (diverging), Line (+ reference line) | Beeswarm                              |

#### Step 2: Narrow by Data Shape

| Data Shape                  | Compatible Intents                   | Ruled Out                       |
| --------------------------- | ------------------------------------ | ------------------------------- |
| Categorical + numeric       | Compare, Part-to-Whole, Distribution | Flow (unless sequential)        |
| Two numeric variables       | Relationship, Distribution           | Part-to-Whole                   |
| Time series                 | Change Over Time, Deviation          | Hierarchy                       |
| Network / adjacency         | Relationship, Flow                   | Part-to-Whole, Change Over Time |
| Hierarchical (parent-child) | Hierarchy, Part-to-Whole             | Change Over Time, Distribution  |
| Flow matrix (source-target) | Flow, Relationship                   | Compare (use grouped bar)       |

#### Step 3: Audience & Context Filter

| Choose Standard When                  | Choose Advanced When                          |
| ------------------------------------- | --------------------------------------------- |
| Audience expects familiar shapes      | Complex relationships (flows, networks)       |
| Tooltip interactivity is critical     | Distribution shape matters more than values   |
| Chart.js handles the data shape       | Hierarchical structure needs multi-level view |
| Dashboard has 3+ charts (consistency) | Single hero viz to anchor a story             |
| Executive audience (30s scan)         | Analyst audience (exploration expected)       |

#### Story-Intent Detection Heuristics

When the user doesn't state intent explicitly, infer from language:

| User Language                                          | Inferred Intent  |
| ------------------------------------------------------ | ---------------- |
| "rank", "compare", "versus", "top", "best/worst"       | Compare          |
| "over time", "trend", "growth", "decline", "monthly"   | Change Over Time |
| "share", "proportion", "breakdown", "percent of"       | Part-to-Whole    |
| "spread", "range", "outlier", "normal", "distribution" | Distribution     |
| "correlation", "relationship", "predict", "affects"    | Relationship     |
| "flow", "path", "from X to Y", "conversion", "funnel"  | Flow / Process   |
| "hierarchy", "drill down", "parent/child", "levels"    | Hierarchy        |
| "where", "hotspot", "concentration", "geographic"      | Spatial Pattern  |
| "deviation", "variance", "above/below target", "gap"   | Deviation        |

### Narrative Chart Pairing

A single chart tells one point. Paired charts reinforce the insight from a second angle.

| Primary Chart          | Good Pair                               | Why                                     |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| Bar (compare)          | Donut (proportion)                      | Shows both absolute and relative size   |
| Line (trend)           | Bar (change amount)                     | Shows direction and magnitude           |
| Scatter (relationship) | Histogram (distribution)                | Shows correlation and individual spread |
| Treemap (hierarchy)    | Table (detail)                          | Shows structure and precise values      |
| Sankey (flow)          | Stacked bar (proportions at each stage) | Shows paths and stage composition       |

#### The Inverted Pyramid Pattern

Arrange visuals in absorption order:

| Layer | Component         | Time to Absorb | Purpose                        |
| ----- | ----------------- | -------------- | ------------------------------ |
| 1     | KPI cards         | 2 seconds      | "What's the big picture?"      |
| 2     | Hero chart        | 10 seconds     | Full distribution, interactive |
| 3     | Supporting charts | 15 seconds     | Same data, different lens      |
| 4     | Table             | As needed      | Precise values for analysts    |
| 5     | Drill-down        | On click       | Detail without clutter         |

### Color Theory

#### Mandatory: Colorblind-Safe Palette

All chart output MUST use a colorblind-safe palette. The canonical palette for all Alex charting skills is **Tableau 10**, verified against deuteranopia, protanopia, and tritanopia:

```
#4e79a7  Blue-Steel   (primary)
#f28e2b  Orange
#e15759  Coral
#76b7b2  Teal
#59a14f  Sage
#edc948  Gold
#b07aa1  Mauve
#ff9da7  Rose
#9c755f  Brown
#bab0ac  Warm Gray
```

| Palette                   | Colors                                                    | Use Case                   |
| ------------------------- | --------------------------------------------------------- | -------------------------- |
| **Categorical (default)** | First N colors from the canonical 10 above                | Unordered categories       |
| **Sequential Blue**       | `#deebf7 → #08519c`                                       | Low-to-high numeric        |
| **Diverging RdBu**        | `#b2182b → #f7f7f7 → #2166ac`                             | Above/below midpoint       |
| **Semantic Region**       | Consistent color per category across all charts on a page | Region, department, status |

#### Color Rules (Non-Negotiable)

| Rule                            | Explanation                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| **Always colorblind-safe**      | Never use a palette that has not been tested for deuteranopia, protanopia, and tritanopia |
| **Semantic consistency**        | Same color = same meaning across all charts on a page                                     |
| **Highlight, don't decorate**   | Use saturated color for the key data point; mute everything else                          |
| **Sequential for ordered data** | Light-to-dark for low-to-high                                                             |
| **Diverging for deviation**     | Two hues diverging from neutral midpoint                                                  |
| **Never rely on color alone**   | Add patterns, labels, or shapes for accessibility                                         |
| **Test with Sim Daltonism**     | Verify with protanopia and deuteranopia simulation                                        |

#### WCAG Contrast Requirements

| Context             | Minimum Ratio              |
| ------------------- | -------------------------- |
| Text on background  | 4.5:1 (AA), 7:1 (AAA)      |
| Chart labels        | 4.5:1 minimum              |
| Data vs. background | 3:1 for graphical elements |

### Decluttering (Tufte's Data-Ink Ratio)

Every element must earn its place. Remove anything that doesn't carry data.

| Remove                    | Replace With                         |
| ------------------------- | ------------------------------------ |
| Gridlines                 | Light reference lines only if needed |
| Borders around chart area | White space separation               |
| Legends (when possible)   | Direct labels on data                |
| Background fills          | Transparent / minimal                |
| 3D effects                | Never. Always flat.                  |
| Redundant axis labels     | Context in title or subtitle         |

#### Before/After Anti-Patterns

| Anti-Pattern       | Problem                 | Fix                              |
| ------------------ | ----------------------- | -------------------------------- |
| Rainbow palette    | No semantic meaning     | Use 2-3 purposeful colors        |
| Every bar labeled  | Visual noise            | Label key values only            |
| Dual Y axes        | Misleading correlation  | Two separate charts              |
| Pie with 8+ slices | Unreadable              | Horizontal bar, sorted           |
| Missing axis zero  | Exaggerated differences | Start at zero or note truncation |

### Annotation Hierarchy

| Element      | Content                                                 | Rule               |
| ------------ | ------------------------------------------------------- | ------------------ |
| **Title**    | The insight ("Sales peaked at $4.2M in Q3")             | Never a data label |
| **Subtitle** | Context ("Quarterly revenue, FY 2024-2025")             | Who, what, when    |
| **Callout**  | The exception ("Q1 2025: +31% jump -- pricing change?") | Arrow or highlight |
| **Footnote** | Caveats ("Excludes returns. Source: SAP ERP.")          | Small, bottom      |
| **Source**   | Data provenance                                         | Always present     |

### Small Multiples

Use faceted views when a single chart would be overloaded.

| Use Small Multiples When              | Use Overlay When          |
| ------------------------------------- | ------------------------- |
| 5+ series on one chart                | 2-3 series that interact  |
| Each series has its own pattern       | Comparison is the point   |
| Reader needs to see individual shapes | Relative position matters |

#### Implementation

```
Grid: 2x3 or 3x4 panels
Each panel: Same axes, same scale (critical!)
Difference: One variable changes per panel (category, time period, cohort)
```

### Accessibility

| Requirement       | Implementation                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **Alt text**      | Describe the chart's insight, not its structure ("Revenue grew 34% in 2024" not "Bar chart showing revenue") |
| **Patterns**      | Add hatching or shapes alongside color                                                                       |
| **Keyboard**      | Tab-navigable data points in interactive charts                                                              |
| **Screen reader** | `aria-label` on chart container, data table fallback                                                         |
| **High contrast** | Test in Windows High Contrast mode                                                                           |

### Tool Targets

| Target                | Library                | Output                    | When                              |
| --------------------- | ---------------------- | ------------------------- | --------------------------------- |
| HTML (self-contained) | Chart.js 4.x via CDN   | `.html` file              | Default -- zero-config dashboards |
| HTML (advanced)       | Raw Canvas 2D API      | `.html` file              | Sankey, Chord, Sunburst, etc.     |
| Python                | Plotly                 | Interactive HTML/notebook | Data science workflows            |
| Python (static)       | Matplotlib + Seaborn   | PNG/SVG                   | Publications, reports             |
| Markdown              | Mermaid                | Inline in docs            | Documentation, PRs                |
| Power BI              | DAX measures + visuals | .pbix                     | Enterprise BI                     |

#### Chart.js Configuration Defaults

```javascript
// Standard Chart.js defaults for all data-viz skills
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.display = false; // prefer direct labels
Chart.defaults.scales.x.grid.display = false; // declutter
Chart.defaults.scales.y.grid.color = "rgba(255,255,255,0.06)"; // subtle
Chart.defaults.plugins.tooltip.backgroundColor = "rgba(0,0,0,0.85)";
```

### Advanced Canvas Charts

10 chart types rendered with raw Canvas 2D API: no extra dependencies beyond the browser.

| Chart                    | Story Intent           | Data Shape              | Key Technique                       |
| ------------------------ | ---------------------- | ----------------------- | ----------------------------------- |
| **Sankey**               | Flow                   | Source-target-value     | Bezier curves between stacked bars  |
| **Chord**                | Relationship           | Adjacency matrix        | Circular arcs with ribbons          |
| **Streamgraph**          | Change Over Time       | Multi-series time       | Stacked area with centered baseline |
| **Sunburst**             | Hierarchy              | Parent-child            | Concentric arcs, angular proportion |
| **Parallel Coordinates** | Compare (multi-dim)    | Many numeric columns    | Vertical axes, polylines            |
| **Beeswarm**             | Distribution           | Categorical + numeric   | Force-separated dots on axis        |
| **Ridgeline**            | Distribution (compare) | Series of distributions | Overlapping density curves          |
| **Waffle**               | Part-to-Whole          | Percentages             | Grid of colored squares             |
| **Network Graph**        | Relationship           | Nodes + edges           | Force-directed layout               |
| **Violin**               | Distribution           | Grouped distributions   | Mirrored density curves             |

#### Canvas Rendering Pattern

```javascript
// Standard pattern for all advanced charts
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.scale(dpr, dpr);
// ... render logic
```

#### Visualization Anti-Patterns

| Anti-Pattern                    | Why It Fails                                | Fix                                         |
| ------------------------------- | ------------------------------------------- | ------------------------------------------- |
| "Chart type first, data second" | Picks visual before understanding the story | Start with story intent                     |
| Title just labels axes          | No argument, no insight                     | Write a sentence the viewer should conclude |
| Rainbow palette on categories   | No semantic meaning, accessibility failure  | Max 2-3 purposeful hues                     |
| Dual Y axes                     | Implies false correlation                   | Two separate charts                         |
| Pie chart with 8+ slices        | Unreadable, angle perception is poor        | Sorted horizontal bar                       |
| 3D anything                     | Distorts perception, adds zero information  | Always flat                                 |
| Default gridlines               | Clutter that competes with data             | Remove or make very subtle                  |

## Data Storytelling

This is the orchestrator skill. It transforms raw data into a complete, coherent narrative by activating analysis, visualization, and dashboard skills in sequence. The output is a self-contained artifact -- typically an HTML dashboard or scrollable report -- where every chart, annotation, and KPI serves the story.

The cardinal rule: **data stories have arguments, not just observations**. A collection of charts with captions is a report. A data story says "here's what happened, here's why it matters, and here's what we should do."

### Three-Act Data Structure

Every data story follows this arc:

| Act          | Purpose                               | Content                                          |
| ------------ | ------------------------------------- | ------------------------------------------------ |
| **Setup**    | Establish context and baseline        | Who, what, when, where + "here's how things were"|
| **Conflict** | Reveal the surprise, problem, or gap  | "But then this happened" / "X is not what we expected" |
| **Resolution**| Deliver insight and recommendation   | "This means X, and we should do Y"               |

#### Act Mapping to Dashboard Components

| Act        | Dashboard Element                 |
| ---------- | --------------------------------- |
| Setup      | KPI cards showing baseline stats  |
| Conflict   | Hero chart revealing the anomaly  |
| Resolution | Supporting charts + annotated insight |

### Audience-First Framing

Before choosing a single chart, identify who will read this and what decision it supports.

| Audience    | Time Budget | What They Need                     | Artifact Style            |
| ----------- | ----------- | ---------------------------------- | ------------------------- |
| **Executive** | 30 seconds | Headline + action recommendation  | KPI dashboard, 5-Visual   |
| **Manager**   | 2 minutes  | Context + options + trade-offs    | Dashboard with filters    |
| **Analyst**   | Unlimited  | Full data + methodology + caveats | Detailed report with drill|
| **General**   | 1 minute   | Simple story, familiar visuals    | Scroll narrative, annotated|

### Knaflic Method ("Storytelling with Data")

The 5-step framework from Cole Nussbaumer Knaflic:

| Step                     | Action                                               |
| ------------------------ | ---------------------------------------------------- |
| 1. Understand context    | Who is the audience? What do they need to do?        |
| 2. Choose an effective visual | Story intent → chart type (SKILL cross-ref)     |
| 3. Eliminate clutter     | Remove everything that isn't data or supporting story|
| 4. Focus attention       | Use color, size, position to direct the eye          |
| 5. Tell a story          | Connect visuals with narrative text                  |

### Duarte Contrast ("What Is" vs. "What Could Be")

Nancy Duarte's tension pattern drives engagement:

```
What Is:      "Today, we process 500 support tickets per day"
What Could Be: "With the new model, we could process 2000 with the same team"
What Is:      "Current SLA breach rate is 12%"
What Could Be: "Top performers achieve 3% -- the gap is process, not people"
```

Use this pattern when the story needs to motivate action, not just inform.

### Big Idea Worksheet

Force the story into one sentence before building anything:

```
[Subject/audience] should [action/decision]
because [evidence from data].
```

Examples:
- "The exec team should double Q4 marketing spend because every $1 of email marketing generates $3.20 in pipeline"
- "Engineering should prioritize Region B support because resolution time is 2.5x the company average"

If you can't write the Big Idea sentence, the analysis isn't done yet.

### Explanatory vs. Exploratory

| Mode           | You Know the Story? | Goal                          | Output                     |
| -------------- | -------------------- | ----------------------------- | -------------------------- |
| **Explanatory** | Yes                 | Guide viewer to a conclusion  | Annotated dashboard/report |
| **Exploratory** | No (yet)            | Let viewer discover patterns  | Interactive dashboard      |

Default to **explanatory** for executives and general audiences. Use **exploratory** for analysts.

### Annotation as Narration

Annotations carry the argument. The chart is evidence; the annotation is the lawyer.

| Annotation Type | Purpose                              | Example                                    |
| --------------- | ------------------------------------ | ------------------------------------------ |
| **Title**       | State the insight (not the metric)   | "Revenue grew 34% but growth is slowing"   |
| **Subtitle**    | Provide context                      | "Quarterly actuals, FY2024-FY2025"         |
| **Callout**     | Highlight the key data point         | Arrow + "Q3 peak: $4.2M"                   |
| **Caption**     | Add nuance below the chart           | "Note: Q1 2025 includes one-time adjustment"|
| **Footnote**    | Source, methodology, caveats         | "Source: Internal CRM, excludes returns"   |

### Orchestration Protocol

When data storytelling is invoked, execute these phases in order:

#### Phase 0: Ingest
- Activate data-ingest.cjs (or inline parse)
- Output: clean columnar data + metadata

#### Phase 1: Discover
- Activate data-analysis skill
- Output: 3-5 insight statements with story intents

#### Phase 2: Visualize
- Activate data-visualization skill for each insight
- Match story intent → chart type
- Output: chart specs with titles-as-insights

#### Phase 3: Arrange
- Activate dashboard-design skill
- Choose layout by audience
- Place KPIs, hero, supporting, table, drill-down
- Output: dashboard scaffold

#### Phase 4: Narrate
- Apply three-act structure
- Write Big Idea sentence
- Add annotations as narration
- Validate: top-to-bottom read tells the story
- Output: self-contained HTML with narrative

### Quality Checks

Before delivering the final output:

| Check                         | Pass Criteria                                       |
| ----------------------------- | --------------------------------------------------- |
| Big Idea exists               | One sentence captures the entire story              |
| Three-act present             | Setup → Conflict → Resolution identifiable          |
| Titles are insights           | No chart titled "Revenue by Quarter" (must be a sentence) |
| Color consistency             | Same category = same color across all visuals       |
| Source attribution             | Every chart cites its data source                   |
| Audience match                | Executive gets 5 visuals, analyst gets drill-down   |
| 3-second test                 | Each chart conveys its point in 3 seconds           |
| Annotation coverage           | Hero chart has at least 1 callout annotation        |
| Data freshness                | Date range stated; "as of" timestamp included       |

#### Storytelling Anti-Patterns

| Anti-Pattern              | Problem                                    | Fix                                     |
| ------------------------- | ------------------------------------------ | --------------------------------------- |
| Chart collection          | Charts exist but don't connect             | Apply three-act structure               |
| Data dump                 | Every metric shown "just in case"          | Write Big Idea first, cut everything else|
| Insight-free annotations  | "This is a bar chart showing revenue"      | State what the data means, not what it is|
| Wrong audience depth      | Analyst-level detail for C-suite           | Match artifact to audience time budget  |
| No recommendation         | Story ends at "here's what happened"       | Always include "so here's what we should do" |
| Over-designed              | Fancy visuals, weak argument              | Substance over aesthetics               |

## Dashboard Design

Design dashboards that tell stories through layout. A dashboard is not a collection of charts -- it's a guided reading experience where position, size, and interaction design control what the viewer understands and in what order.

The cardinal rule: **reading order = story order**. KPIs answer "what?", charts answer "why?", tables answer "how much?", and drill-downs answer "show me more."

### Layout Patterns

| Pattern           | Best For                  | Reading Flow                               | Use When                                       |
| ----------------- | ------------------------- | ------------------------------------------ | ---------------------------------------------- |
| Inverted Pyramid  | Executive dashboards      | KPIs → hero chart → supporting → detail    | Audience scans from top, drills as needed       |
| Z-Pattern         | Marketing / consumer      | Top-left → top-right → bottom-left → end   | Two primary metrics side-by-side               |
| F-Pattern         | Data-heavy analytics      | Left column scanned top-down, right detail | Dense detail dashboards for analysts           |
| Hub-and-Spoke     | Exploration dashboards    | Central question, surrounding perspectives | When multiple equally important views exist    |
| Narrative Scroll  | Data stories / reports    | Top-to-bottom linear reading               | Self-contained HTML stories with guided arc    |

#### Reference Pattern: Inverted Pyramid

```
┌────────────────────────────────────────────────────┐
│ HEADER: Title + subtitle + badge                   │
├────────────────────────────────────────────────────┤
│ KPI ROW: 3-6 cards (auto-fit grid)                 │
├────────────────────────────────────────────────────┤
│ CONTROLS: Search + filter buttons                  │
├────────────────────────────────────────────────────┤
│ HERO CHART: Full-width, clickable                  │
├───────────────────────┬────────────────────────────┤
│ SUPPORTING CHART 1    │ SUPPORTING CHART 2         │
├───────────────────────┴────────────────────────────┤
│ DATA TABLE: Sortable, ranked, inline indicators    │
├────────────────────────────────────────────────────┤
│ FOOTER: Data source + attribution + last updated   │
└────────────────────────────────────────────────────┘

         ┌── DRILL-DOWN MODAL ──┐
         │ Detail stats grid     │
         │ Horizontal bar        │
         │ Detail table          │
         └───────────────────────┘
```

### KPI Card Design

Each KPI card follows the **metric + delta + context** pattern:

| Element      | Purpose                           | Example                    |
| ------------ | --------------------------------- | -------------------------- |
| Primary value| The headline number               | "334M"                     |
| Label        | What it measures                  | "Total Population"         |
| Delta        | Change indicator (arrow + %)      | "↑ 2.1% YoY"              |
| Sparkline    | Trend miniature (optional)        | Tiny 30-day line           |
| Subtitle     | Time range or source              | "2024 Census estimate"     |
| Icon/Emoji   | Visual anchor                     | "👥"                       |
| Accent color | Category signal                   | Brand purple               |

#### KPI Selection Rules

| Rule                         | Why                                                    |
| ---------------------------- | ------------------------------------------------------ |
| 3-6 KPIs maximum             | More overwhelms; fewer under-informs                   |
| Each answers a different "what?"| Redundant KPIs waste prime real estate                |
| Include at least one delta   | Static numbers lack context                            |
| Lead with the most important | Top-left KPI gets the most attention                   |
| Color thresholds if applicable | Green/amber/red for status-driven metrics             |

### Filter Architecture

| Filter Type     | Placement       | Behavior                           | Example                        |
| --------------- | --------------- | ---------------------------------- | ------------------------------ |
| Global filter   | Top, below KPIs | Affects all charts and table       | Region buttons, date range     |
| Chart filter    | Inline on chart | Affects only parent chart          | Sort toggle, limit slider      |
| Cross-filter    | Click on chart  | Highlights related data elsewhere  | Click bar → table highlights   |
| Drill-through   | Click on item   | Opens detail modal or new view     | Click state → city breakdown   |
| Search          | Top controls    | Text filter across primary column  | Search box for state names     |

#### Filter Design Rules

1. Global filters visible at all times (sticky if page scrolls)
2. Active filter state clearly indicated (colored buttons, badges)
3. "All" or "Reset" always available as first option
4. Filter changes animate smoothly (transition: 300ms)
5. Filter state reflected in chart titles or subtitles

### Narrative Flow

The dashboard tells a story through panel arrangement:

| Layer | Component          | Answers              | Time to Absorb |
| ----- | ------------------ | -------------------- | -------------- |
| 1     | KPI cards          | "What's the story?"  | 2 seconds      |
| 2     | Hero chart         | "Show me the shape"  | 10 seconds     |
| 3     | Supporting charts  | "What else?"         | 15 seconds     |
| 4     | Data table         | "Give me the details"| As needed      |
| 5     | Drill-down modal   | "Tell me more about X"| On demand     |

#### Progressive Disclosure

- **Above the fold**: KPIs + hero chart (must convey the main story without scrolling)
- **Below the fold**: Supporting views + table (deeper evidence)
- **On demand**: Drill-down modals, tooltips, expandable rows

### Self-Contained HTML Pattern

Every dashboard outputs as a single HTML file:

| Requirement                | Implementation                                              |
| -------------------------- | ----------------------------------------------------------- |
| Zero build step            | Open in browser, no npm/webpack/build                       |
| Embedded data              | JavaScript arrays/objects, not external API calls           |
| Single CDN dependency      | Chart.js 4.x via jsdelivr                                  |
| Responsive                 | CSS grid with `auto-fit`, `minmax`, media queries           |
| Themeable                  | CSS custom properties for colors, spacing, fonts            |
| Accessible                 | Semantic HTML, ARIA labels, alt text on charts              |
| Print-friendly             | `@media print` styles for clean output                      |

#### CSS Custom Properties Template

```css
:root {
  --bg-primary: #0f0f23;
  --bg-card: #1a1a2e;
  --text-primary: #e8e8f0;
  --text-secondary: #888;
  --accent-1: #6366f1;
  --accent-2: #3b82f6;
  --accent-3: #10b981;
  --accent-4: #f59e0b;
  --accent-5: #ec4899;
  --border-radius: 12px;
  --shadow: 0 2px 8px rgba(0,0,0,0.3);
  --transition: 0.3s ease;
}
```

### Platform Targets

| Platform            | Output Format     | Key Differences                            |
| ------------------- | ----------------- | ------------------------------------------ |
| **HTML** (primary)  | Self-contained    | Chart.js + Canvas, embedded data           |
| **Power BI**        | Report spec       | DAX measures, M queries, visual config     |
| **Streamlit**       | Python app        | Plotly charts, st.columns, st.metric       |
| **React**           | Component tree    | Recharts/Nivo, state management, props     |

Default to HTML unless the user specifies otherwise.

### Chart Grid Pattern

For dashboards that showcase multiple chart types or let users explore:

| Component          | Purpose                             | Implementation                    |
| ------------------ | ----------------------------------- | --------------------------------- |
| Category filter    | Show charts by category             | Button row with colored states    |
| Card grid          | Visual index of available charts    | CSS grid, auto-fit, minmax(280px) |
| Mini preview       | Quick visual (130px height canvas)  | Chart.js render at small scale    |
| Metadata badges    | "Best for", "Data type"             | Tags below chart preview          |
| Modal detail       | Full chart + metadata + examples    | Fixed overlay, arrow key nav      |

### Interaction Patterns

| Pattern               | Trigger          | Effect                              |
| --------------------- | ---------------- | ----------------------------------- |
| Hover tooltip         | Mouse over bar   | Show exact value + label            |
| Click drill-down      | Click chart item | Open modal with detail view         |
| Filter select         | Click button     | Filter all charts to selection      |
| Sort toggle           | Click column head| Re-sort table ascending/descending  |
| Search highlight      | Type in search   | Fade non-matching, highlight match  |
| Responsive collapse   | Screen < 768px   | Stack columns, hide secondary charts|

### 5-Visual Rule (VT BIT 5424)

Executive dashboards follow the 5-Visual Rule:

1. **1 KPI row** (3-6 metric cards)
2. **1 hero chart** (the main story)
3. **2 supporting charts** (different lenses on same data)
4. **1 data table** (detail on demand)

Maximum 5 visual elements above the fold. More than 5 creates cognitive overload for executive audiences. Analysts get more through drill-down, not more panels.

#### Dashboard Anti-Patterns

| Anti-Pattern           | Problem                                      | Fix                                    |
| ---------------------- | -------------------------------------------- | -------------------------------------- |
| Chart soup             | Too many charts with no narrative connection | Apply 5-Visual Rule, add story arc     |
| Dashboard as database  | Every field shown "just in case"             | Show only what answers the KPI questions|
| Inconsistent colors    | Same category = different color across charts | Use semantic color map (region → color) |
| No drill-down escape   | Modal/detail has no clear close/back          | Always show close button + ESC handler |
| Tiny charts            | Cramming 10 charts into one screen           | Fewer, larger charts with drill paths  |
| Static title           | "Revenue Dashboard"                          | "Revenue grew 34% -- but growth is slowing" |

## Chart Interpretation

The reverse of data visualization. Instead of data → chart, this skill reads chart → insights → narrative. It extracts meaning from existing charts (screenshots, images, HTML, Power BI reports) and produces structured analysis adapted to the target audience.

The cardinal rule: **read what the chart says, then read what it doesn't say**. The visible data points tell one story; the missing context, truncated axes, and suppressed categories tell another.

### Chart Type Recognition

Identify the chart type to determine the correct reading strategy.

| Chart Type       | Key Visual Features                    | Reading Strategy                          |
| ---------------- | -------------------------------------- | ----------------------------------------- |
| Bar / Column     | Rectangular bars, one axis categorical | Compare bar lengths, check sort order     |
| Horizontal Bar   | Bars extend left-to-right              | Rank comparison, read labels first        |
| Line             | Connected points over axis             | Follow trend direction, find inflections  |
| Area             | Filled region under line               | Volume over time, stacking if multiple    |
| Pie / Donut      | Circular segments                      | Part-to-whole, count segments, check %    |
| Scatter           | Points in x-y space                   | Look for clusters, outliers, trend line   |
| Bubble           | Scatter with size encoding             | Three dimensions: x, y, size             |
| Histogram        | Bars touching, x is continuous         | Distribution shape, skew, outliers       |
| Heatmap          | Color grid                             | Pattern density, row-column relationships |
| Treemap          | Nested rectangles                      | Hierarchical proportions                  |
| Sankey           | Flow ribbons between stages            | Volume flow, biggest paths               |
| Box Plot         | Box + whiskers                         | Median, IQR, outlier dots                |
| Network          | Nodes + edges                          | Clusters, hubs, isolates                 |
| Violin           | Mirrored density curves                | Distribution shape + density             |

### Visual Decoding

Extract data from visual encodings:

| Encoding         | What to Read                          | Precision Level     |
| ---------------- | ------------------------------------- | ------------------- |
| Position (axis)  | Exact values from gridlines/labels    | High (if labeled)   |
| Length (bar)      | Relative magnitude between items     | High                |
| Color hue        | Category membership                   | Categorical only    |
| Color intensity  | Value magnitude in sequential scheme  | Medium              |
| Size (area)      | Third variable (bubble, treemap)      | Low (area perception is poor) |
| Angle (pie)      | Proportion (poor human accuracy)      | Low                 |
| Slope (line)     | Rate of change                        | Medium              |

### Pattern Detection

| Pattern          | What to Look For                        | Significance                           |
| ---------------- | --------------------------------------- | -------------------------------------- |
| **Trend**        | Consistent upward/downward direction    | Growth, decline, momentum              |
| **Inflection**   | Direction change point                  | Market shift, intervention effect      |
| **Plateau**      | Flat region after growth/decline        | Saturation, stabilization              |
| **Cluster**      | Groups of points in scatter/network     | Natural segments, sub-populations      |
| **Outlier**      | Points far from the main group          | Anomaly, error, or special case        |
| **Periodicity**  | Repeating pattern at intervals          | Seasonality, weekly cycle              |
| **Gap**          | Missing data or discontinuity           | Data quality issue or deliberate omission |
| **Skew**         | Asymmetric distribution shape           | Non-normal population, concentration   |
| **Dominance**    | One item >> all others                  | Power law, market leader, outlier      |

### Misleading Visual Detection

Check every chart for these deceptive patterns:

| Deception                  | How to Detect                                              | Actual Impact                          |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Non-zero baseline**      | Y-axis starts above 0                                      | Exaggerates differences (sometimes 2-5x)|
| **Truncated axis**         | Axis range excludes data or starts mid-range               | Hides context, magnifies small changes |
| **Dual axes**              | Two Y-axes with different scales                           | Implies correlation where none may exist|
| **3D effects**             | Perspective distortion on bars/pies                        | Area comparison becomes inaccurate     |
| **Cherry-picked range**    | Time window starts/ends at convenient point                | Hides contrary trend outside window     |
| **Suppressed categories**  | "Other" aggregates significant items                       | Hides important segments               |
| **Area distortion**        | Variable-width bars, non-proportional icons                | Size doesn't match value               |
| **Missing denominator**    | Percentages without base size                              | 50% of 10 ≠ 50% of 10,000            |
| **Reversed axis**          | Values increase downward or rightward                      | Readers misread direction              |

### Structural Element Reading

Always read these elements before interpreting the data:

| Element          | What to Extract                        | If Missing                              |
| ---------------- | -------------------------------------- | --------------------------------------- |
| **Title**        | Author's intended takeaway             | Chart lacks stated purpose              |
| **Subtitle**     | Time range, filter condition, context  | Context must be inferred                |
| **Axes labels**  | What variables are plotted             | Interpretation becomes guesswork        |
| **Legend**        | Category-to-color mapping             | Color meaning unclear                   |
| **Annotations**  | Author-highlighted insights            | No guided reading                       |
| **Data source**  | Where the data came from              | Credibility unknown                     |
| **Date/time**    | When data was collected/reported       | Freshness unknown                       |

### Narrative Extraction

Convert visual observations into prose at three audience levels:

#### Executive Summary (30 seconds)

```
3 bullets maximum:
• [Primary insight: the main takeaway]  
• [Supporting evidence: the strongest proof point]  
• [Recommendation or implication: what to do about it]
```

#### Detailed Analysis (2-3 minutes)

```
The chart shows [chart type] plotting [X variable] against [Y variable]
for [time range / scope].

Primary finding: [Main pattern or insight with specific numbers]

Supporting observations:
- [Pattern 1 with evidence]
- [Pattern 2 with evidence]
- [Anomaly or exception worth noting]

Context and caveats:
- [What the chart doesn't show]
- [Potential biases or limitations]
- [Comparison to benchmarks if available]
```

#### Talking Points (presenter-ready)

```
"What you're seeing here is [explain the main pattern in plain language]."
"The key number to focus on is [highlight], which tells us [implication]."
"What's interesting is [surprise or anomaly]: this suggests [hypothesis]."
"The action item here is [recommendation]."
```

### Confidence Rating

Rate interpretation confidence honestly:

| Level    | When                                            | Signal to User                           |
| -------- | ----------------------------------------------- | ---------------------------------------- |
| **High** | Clear labels, clean data, familiar chart type   | "The chart clearly shows..."             |
| **Medium** | Some inference needed (unlabeled, partial data) | "Based on visual estimation..."        |
| **Low**  | Ambiguous visual, missing context, blurry image | "This appears to show, but verify..."   |

### Follow-Up Recommendations

After interpreting, suggest what would strengthen the analysis:

| Suggestion Type         | Example                                                    |
| ----------------------- | ---------------------------------------------------------- |
| Missing variable        | "Add cost data to see if revenue growth is profitable"     |
| Time extension          | "Extend to 24 months to confirm the seasonal pattern"      |
| Segmentation            | "Break this down by region to check for Simpson's Paradox" |
| Alternative chart       | "A scatter plot would better show the correlation"          |
| Baseline addition       | "Add a target line to show performance vs. plan"           |

### CSAR Loop Integration

Use the Dialog Engineering CSAR Loop for structured chart reading:

| Phase        | Action                                                |
| ------------ | ----------------------------------------------------- |
| **Clarify**  | What chart type? What variables? What time range?     |
| **Summarize**| State the main finding in one sentence                |
| **Act**      | Extract specific data points, patterns, anomalies     |
| **Reflect**  | What's missing? What would I want to see next?        |

#### Interpretation Anti-Patterns

| Anti-Pattern              | Problem                                    | Fix                                      |
| ------------------------- | ------------------------------------------ | ---------------------------------------- |
| Describing, not interpreting | "This is a bar chart" (no insight)       | Say what the bars MEAN, not what they ARE|
| Ignoring the title         | Missing the author's intended message     | Read title first -- it's the thesis      |
| Over-precision from visual | "Revenue is exactly $4,237,892"           | Estimate from visual: "roughly $4.2M"    |
| Missing bias check         | Accepting the chart at face value         | Always scan for misleading elements      |
| Single-lens reading        | Only one interpretation offered           | Provide primary + alternative reading    |