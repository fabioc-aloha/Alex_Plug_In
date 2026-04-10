# Data Visualization and Dashboard Design

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Skill: Data Visualization

> Choose the right chart for the story, not just the data shape. Every chart should make an argument.

## Metadata

| Field              | Value                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Skill ID**       | data-visualization                                                                                                             |
| **Version**        | 1.0.0                                                                                                                          |
| **Category**       | Data Analytics                                                                                                                 |
| **Difficulty**     | Intermediate                                                                                                                   |
| **Prerequisites**  | None                                                                                                                           |
| **Related Skills** | data-analysis, dashboard-design, data-storytelling, chart-interpretation, executive-storytelling, slide-design, graphic-design |

## Overview

Data visualization is not chart generation -- it is **visual argumentation**. The chart type, color palette, annotation, and title are all rhetorical choices that either strengthen or weaken the story.

### Core Principles

| Principle                 | Rule                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Title = Insight**       | Chart titles state the takeaway, not the data label. "California leads with 39M" not "Population by State" |
| **Story-Intent First**    | Ask "what story?" before "what chart?"                                                                     |
| **Data-Ink Ratio**        | Every pixel of ink should represent data. Remove everything else (Tufte)                                   |
| **3-Second Test**         | If a viewer can't grasp the point in 3 seconds, redesign                                                   |
| **Annotation = Argument** | Callouts carry the story; the chart is evidence, the annotation is the argument                            |

## Module 1: Story-Intent Chart Selection

The primary axis for chart selection is **what story the user wants to tell**. Data shape is a secondary constraint.

### Step 1 -- Identify Story Intent

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

### Step 2 -- Narrow by Data Shape

| Data Shape                  | Compatible Intents                   | Ruled Out                       |
| --------------------------- | ------------------------------------ | ------------------------------- |
| Categorical + numeric       | Compare, Part-to-Whole, Distribution | Flow (unless sequential)        |
| Two numeric variables       | Relationship, Distribution           | Part-to-Whole                   |
| Time series                 | Change Over Time, Deviation          | Hierarchy                       |
| Network / adjacency         | Relationship, Flow                   | Part-to-Whole, Change Over Time |
| Hierarchical (parent-child) | Hierarchy, Part-to-Whole             | Change Over Time, Distribution  |
| Flow matrix (source-target) | Flow, Relationship                   | Compare (use grouped bar)       |

### Step 3 -- Audience & Context Filter

| Choose Standard When                  | Choose Advanced When                          |
| ------------------------------------- | --------------------------------------------- |
| Audience expects familiar shapes      | Complex relationships (flows, networks)       |
| Tooltip interactivity is critical     | Distribution shape matters more than values   |
| Chart.js handles the data shape       | Hierarchical structure needs multi-level view |
| Dashboard has 3+ charts (consistency) | Single hero viz to anchor a story             |
| Executive audience (30s scan)         | Analyst audience (exploration expected)       |

### Story-Intent Detection Heuristics

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

## Module 2: Narrative Chart Pairing

A single chart tells one point. Paired charts reinforce the insight from a second angle.

| Primary Chart          | Good Pair                               | Why                                     |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| Bar (compare)          | Donut (proportion)                      | Shows both absolute and relative size   |
| Line (trend)           | Bar (change amount)                     | Shows direction and magnitude           |
| Scatter (relationship) | Histogram (distribution)                | Shows correlation and individual spread |
| Treemap (hierarchy)    | Table (detail)                          | Shows structure and precise values      |
| Sankey (flow)          | Stacked bar (proportions at each stage) | Shows paths and stage composition       |

### The Inverted Pyramid Pattern

From `population.html` reference -- arrange visuals in absorption order:

| Layer | Component         | Time to Absorb | Purpose                        |
| ----- | ----------------- | -------------- | ------------------------------ |
| 1     | KPI cards         | 2 seconds      | "What's the big picture?"      |
| 2     | Hero chart        | 10 seconds     | Full distribution, interactive |
| 3     | Supporting charts | 15 seconds     | Same data, different lens      |
| 4     | Table             | As needed      | Precise values for analysts    |
| 5     | Drill-down        | On click       | Detail without clutter         |

## Module 3: Color Theory

### Mandatory: Colorblind-Safe Palette

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

### Color Rules (Non-Negotiable)

| Rule                            | Explanation                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| **Always colorblind-safe**      | Never use a palette that has not been tested for deuteranopia, protanopia, and tritanopia |
| **Semantic consistency**        | Same color = same meaning across all charts on a page                                     |
| **Highlight, don't decorate**   | Use saturated color for the key data point; mute everything else                          |
| **Sequential for ordered data** | Light-to-dark for low-to-high                                                             |
| **Diverging for deviation**     | Two hues diverging from neutral midpoint                                                  |
| **Never rely on color alone**   | Add patterns, labels, or shapes for accessibility                                         |
| **Test with Sim Daltonism**     | Verify with protanopia and deuteranopia simulation                                        |

### WCAG Contrast Requirements

| Context             | Minimum Ratio              |
| ------------------- | -------------------------- |
| Text on background  | 4.5:1 (AA), 7:1 (AAA)      |
| Chart labels        | 4.5:1 minimum              |
| Data vs. background | 3:1 for graphical elements |

## Module 4: Decluttering (Tufte's Data-Ink Ratio)

Every element must earn its place. Remove anything that doesn't carry data.

| Remove                    | Replace With                         |
| ------------------------- | ------------------------------------ |
| Gridlines                 | Light reference lines only if needed |
| Borders around chart area | White space separation               |
| Legends (when possible)   | Direct labels on data                |
| Background fills          | Transparent / minimal                |
| 3D effects                | Never. Always flat.                  |
| Redundant axis labels     | Context in title or subtitle         |

### Before/After Anti-Patterns

| Anti-Pattern       | Problem                 | Fix                              |
| ------------------ | ----------------------- | -------------------------------- |
| Rainbow palette    | No semantic meaning     | Use 2-3 purposeful colors        |
| Every bar labeled  | Visual noise            | Label key values only            |
| Dual Y axes        | Misleading correlation  | Two separate charts              |
| Pie with 8+ slices | Unreadable              | Horizontal bar, sorted           |
| Missing axis zero  | Exaggerated differences | Start at zero or note truncation |

## Module 5: Annotation Hierarchy

| Element      | Content                                                 | Rule               |
| ------------ | ------------------------------------------------------- | ------------------ |
| **Title**    | The insight ("Sales peaked at $4.2M in Q3")             | Never a data label |
| **Subtitle** | Context ("Quarterly revenue, FY 2024-2025")             | Who, what, when    |
| **Callout**  | The exception ("Q1 2025: +31% jump -- pricing change?") | Arrow or highlight |
| **Footnote** | Caveats ("Excludes returns. Source: SAP ERP.")          | Small, bottom      |
| **Source**   | Data provenance                                         | Always present     |

## Module 6: Small Multiples

Use faceted views when a single chart would be overloaded.

| Use Small Multiples When              | Use Overlay When          |
| ------------------------------------- | ------------------------- |
| 5+ series on one chart                | 2-3 series that interact  |
| Each series has its own pattern       | Comparison is the point   |
| Reader needs to see individual shapes | Relative position matters |

### Implementation

```
Grid: 2x3 or 3x4 panels
Each panel: Same axes, same scale (critical!)
Difference: One variable changes per panel (category, time period, cohort)
```

## Module 7: Accessibility

| Requirement       | Implementation                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **Alt text**      | Describe the chart's insight, not its structure ("Revenue grew 34% in 2024" not "Bar chart showing revenue") |
| **Patterns**      | Add hatching or shapes alongside color                                                                       |
| **Keyboard**      | Tab-navigable data points in interactive charts                                                              |
| **Screen reader** | `aria-label` on chart container, data table fallback                                                         |
| **High contrast** | Test in Windows High Contrast mode                                                                           |

## Module 8: Tool Targets

| Target                | Library                | Output                    | When                              |
| --------------------- | ---------------------- | ------------------------- | --------------------------------- |
| HTML (self-contained) | Chart.js 4.x via CDN   | `.html` file              | Default -- zero-config dashboards |
| HTML (advanced)       | Raw Canvas 2D API      | `.html` file              | Sankey, Chord, Sunburst, etc.     |
| Python                | Plotly                 | Interactive HTML/notebook | Data science workflows            |
| Python (static)       | Matplotlib + Seaborn   | PNG/SVG                   | Publications, reports             |
| Markdown              | Mermaid                | Inline in docs            | Documentation, PRs                |
| Power BI              | DAX measures + visuals | .pbix                     | Enterprise BI                     |

### Chart.js Configuration Defaults

```javascript
// Standard Chart.js defaults for all data-viz skills
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.display = false; // prefer direct labels
Chart.defaults.scales.x.grid.display = false; // declutter
Chart.defaults.scales.y.grid.color = "rgba(255,255,255,0.06)"; // subtle
Chart.defaults.plugins.tooltip.backgroundColor = "rgba(0,0,0,0.85)";
```

## Module 9: Advanced Canvas Charts

10 chart types rendered with raw Canvas 2D API -- no extra dependencies beyond the browser.

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

### Canvas Rendering Pattern

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

## Reference Implementations

| File               | Charts             | Pattern                                        |
| ------------------ | ------------------ | ---------------------------------------------- |
| `visuals.html`     | 14 standard types  | Card grid, mini/full pairs, per-chart metadata |
| `adv_visuals.html` | 10 advanced types  | Canvas-only rendering, zero dependencies       |
| `population.html`  | 4 dashboard charts | Inverted pyramid, narrative flow, drill-down   |

## Anti-Patterns

| Anti-Pattern                    | Why It Fails                                | Fix                                         |
| ------------------------------- | ------------------------------------------- | ------------------------------------------- |
| "Chart type first, data second" | Picks visual before understanding the story | Start with story intent                     |
| Title just labels axes          | No argument, no insight                     | Write a sentence the viewer should conclude |
| Rainbow palette on categories   | No semantic meaning, accessibility failure  | Max 2-3 purposeful hues                     |
| Dual Y axes                     | Implies false correlation                   | Two separate charts                         |
| Pie chart with 8+ slices        | Unreadable, angle perception is poor        | Sorted horizontal bar                       |
| 3D anything                     | Distorts perception, adds zero information  | Always flat                                 |
| Default gridlines               | Clutter that competes with data             | Remove or make very subtle                  |

---

# Dashboard Design

| Property     | Value                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| **Domain**   | Data Analytics                                                         |
| **Category** | Dashboard Architecture & Layout                                        |
| **Trifecta** | SKILL.md + dashboard-design.instructions.md + dashboard.prompt.md      |
| **Depends**  | data-visualization (chart content), data-analysis (KPIs and segments)  |

## Overview

Design dashboards that tell stories through layout. A dashboard is not a collection of charts -- it's a guided reading experience where position, size, and interaction design control what the viewer understands and in what order.

The cardinal rule: **reading order = story order**. KPIs answer "what?", charts answer "why?", tables answer "how much?", and drill-downs answer "show me more."

## Module 1: Layout Patterns

| Pattern           | Best For                  | Reading Flow                               | Use When                                       |
| ----------------- | ------------------------- | ------------------------------------------ | ---------------------------------------------- |
| Inverted Pyramid  | Executive dashboards      | KPIs → hero chart → supporting → detail    | Audience scans from top, drills as needed       |
| Z-Pattern         | Marketing / consumer      | Top-left → top-right → bottom-left → end   | Two primary metrics side-by-side               |
| F-Pattern         | Data-heavy analytics      | Left column scanned top-down, right detail | Dense detail dashboards for analysts           |
| Hub-and-Spoke     | Exploration dashboards    | Central question, surrounding perspectives | When multiple equally important views exist    |
| Narrative Scroll  | Data stories / reports    | Top-to-bottom linear reading               | Self-contained HTML stories with guided arc    |

### Reference Pattern: Inverted Pyramid (from population.html)

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

## Module 2: KPI Card Design

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

### KPI Selection Rules

| Rule                         | Why                                                    |
| ---------------------------- | ------------------------------------------------------ |
| 3-6 KPIs maximum             | More overwhelms; fewer under-informs                   |
| Each answers a different "what?"| Redundant KPIs waste prime real estate                |
| Include at least one delta   | Static numbers lack context                            |
| Lead with the most important | Top-left KPI gets the most attention                   |
| Color thresholds if applicable | Green/amber/red for status-driven metrics             |

## Module 3: Filter Architecture

| Filter Type     | Placement       | Behavior                           | Example                        |
| --------------- | --------------- | ---------------------------------- | ------------------------------ |
| Global filter   | Top, below KPIs | Affects all charts and table       | Region buttons, date range     |
| Chart filter    | Inline on chart | Affects only parent chart          | Sort toggle, limit slider      |
| Cross-filter    | Click on chart  | Highlights related data elsewhere  | Click bar → table highlights   |
| Drill-through   | Click on item   | Opens detail modal or new view     | Click state → city breakdown   |
| Search          | Top controls    | Text filter across primary column  | Search box for state names     |

### Filter Design Rules

1. Global filters visible at all times (sticky if page scrolls)
2. Active filter state clearly indicated (colored buttons, badges)
3. "All" or "Reset" always available as first option
4. Filter changes animate smoothly (transition: 300ms)
5. Filter state reflected in chart titles or subtitles

## Module 4: Narrative Flow

The dashboard tells a story through panel arrangement:

| Layer | Component          | Answers              | Time to Absorb |
| ----- | ------------------ | -------------------- | -------------- |
| 1     | KPI cards          | "What's the story?"  | 2 seconds      |
| 2     | Hero chart         | "Show me the shape"  | 10 seconds     |
| 3     | Supporting charts  | "What else?"         | 15 seconds     |
| 4     | Data table         | "Give me the details"| As needed      |
| 5     | Drill-down modal   | "Tell me more about X"| On demand     |

### Progressive Disclosure

- **Above the fold**: KPIs + hero chart (must convey the main story without scrolling)
- **Below the fold**: Supporting views + table (deeper evidence)
- **On demand**: Drill-down modals, tooltips, expandable rows

## Module 5: Self-Contained HTML Pattern

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

### CSS Custom Properties Template

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

## Module 6: Platform Targets

| Platform            | Output Format     | Key Differences                            |
| ------------------- | ----------------- | ------------------------------------------ |
| **HTML** (primary)  | Self-contained    | Chart.js + Canvas, embedded data           |
| **Power BI**        | Report spec       | DAX measures, M queries, visual config     |
| **Streamlit**       | Python app        | Plotly charts, st.columns, st.metric       |
| **React**           | Component tree    | Recharts/Nivo, state management, props     |

Default to HTML unless the user specifies otherwise.

## Module 7: Chart Grid Pattern (from visuals.html)

For dashboards that showcase multiple chart types or let users explore:

| Component          | Purpose                             | Implementation                    |
| ------------------ | ----------------------------------- | --------------------------------- |
| Category filter    | Show charts by category             | Button row with colored states    |
| Card grid          | Visual index of available charts    | CSS grid, auto-fit, minmax(280px) |
| Mini preview       | Quick visual (130px height canvas)  | Chart.js render at small scale    |
| Metadata badges    | "Best for", "Data type"             | Tags below chart preview          |
| Modal detail       | Full chart + metadata + examples    | Fixed overlay, arrow key nav      |

## Module 8: Interaction Patterns

| Pattern               | Trigger          | Effect                              |
| --------------------- | ---------------- | ----------------------------------- |
| Hover tooltip         | Mouse over bar   | Show exact value + label            |
| Click drill-down      | Click chart item | Open modal with detail view         |
| Filter select         | Click button     | Filter all charts to selection      |
| Sort toggle           | Click column head| Re-sort table ascending/descending  |
| Search highlight      | Type in search   | Fade non-matching, highlight match  |
| Responsive collapse   | Screen < 768px   | Stack columns, hide secondary charts|

## Module 9: 5-Visual Rule (VT BIT 5424)

Executive dashboards follow the 5-Visual Rule:

1. **1 KPI row** (3-6 metric cards)
2. **1 hero chart** (the main story)
3. **2 supporting charts** (different lenses on same data)
4. **1 data table** (detail on demand)

Maximum 5 visual elements above the fold. More than 5 creates cognitive overload for executive audiences. Analysts get more through drill-down, not more panels.

## Anti-Patterns

| Anti-Pattern           | Problem                                      | Fix                                    |
| ---------------------- | -------------------------------------------- | -------------------------------------- |
| Chart soup             | Too many charts with no narrative connection | Apply 5-Visual Rule, add story arc     |
| Dashboard as database  | Every field shown "just in case"             | Show only what answers the KPI questions|
| Inconsistent colors    | Same category = different color across charts | Use semantic color map (region → color) |
| No drill-down escape   | Modal/detail has no clear close/back          | Always show close button + ESC handler |
| Tiny charts            | Cramming 10 charts into one screen           | Fewer, larger charts with drill paths  |
| Static title           | "Revenue Dashboard"                          | "Revenue grew 34% -- but growth is slowing" |

---

# Graphic Design Skill

> Patterns for visual design, SVG creation, layout composition, typography, and brand identity.

## Design Principles

### Visual Hierarchy

| Level | Purpose | Techniques |
| ----- | ------- | ---------- |
| **Primary** | First thing seen | Largest, boldest, highest contrast |
| **Secondary** | Supporting info | Medium size, moderate weight |
| **Tertiary** | Details | Smaller, lighter, subtle |

### Hierarchy Tools

- **Size** — Larger = more important
- **Weight** — Bolder = more attention
- **Color** — High contrast = focal point
- **Position** — Top/center = primary
- **Whitespace** — Isolation = emphasis

### Balance Types

| Type | Characteristics | Best For |
| ---- | --------------- | -------- |
| **Symmetrical** | Mirror image, formal | Corporate, traditional |
| **Asymmetrical** | Visual weight balanced, dynamic | Modern, creative |
| **Radial** | Elements radiate from center | Logos, icons |

## Layout & Composition

### Grid Systems

```text
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │   12-column grid
├─────┼─────┼─────┼─────┤   (most flexible)
│  5  │  6  │  7  │  8  │
├─────┼─────┼─────┼─────┤
│  9  │ 10  │ 11  │ 12  │
└─────┴─────┴─────┴─────┘
```

### Golden Ratio (1:1.618)

- Use for proportions that feel "right"
- Width to height relationships
- Spacing progressions
- Element sizing

### Rule of Thirds

```text
┌─────────┬─────────┬─────────┐
│         │    ●    │         │  Place key elements
├─────────┼─────────┼─────────┤  at intersection
│    ●    │         │    ●    │  points for dynamic
├─────────┼─────────┼─────────┤  composition
│         │    ●    │         │
└─────────┴─────────┴─────────┘
```

### Alignment Principles

| Principle | Rule |
| --------- | ---- |
| **Edge alignment** | Elements share common edges |
| **Center alignment** | Elements share center axis |
| **Baseline alignment** | Text shares baseline |
| **Optical alignment** | Visually aligned (may differ from mathematical) |

## Typography

### Type Scale (1.25 ratio)

| Level | Size | Use |
| ----- | ---- | --- |
| Display | 72px | Hero headlines |
| H1 | 48px | Page titles |
| H2 | 36px | Section headers |
| H3 | 28px | Subsections |
| Body | 16px | Main content |
| Caption | 12px | Supporting text |

### Font Pairing Rules

| Combination | Example | Vibe |
| ----------- | ------- | ---- |
| Serif + Sans | Georgia + Helvetica | Classic, professional |
| Sans + Sans | Montserrat + Open Sans | Modern, clean |
| Display + Body | Playfair + Source Sans | Elegant, editorial |

### Typography Best Practices

- **Line height**: 1.4–1.6× font size for body
- **Line length**: 45–75 characters optimal
- **Letter spacing**: Increase for ALL CAPS
- **Contrast**: Dark on light or light on dark
- **Hierarchy**: Max 3 font sizes per design

## Color Theory

### Color Relationships

```text
        Primary
           ●
          /|\
         / | \
        /  |  \
       ●───●───●
   Secondary  Tertiary
```

### Color Schemes

| Scheme | Description | Mood |
| ------ | ----------- | ---- |
| **Monochromatic** | One hue, varied lightness | Cohesive, elegant |
| **Complementary** | Opposite on wheel | High contrast, vibrant |
| **Analogous** | Adjacent on wheel | Harmonious, natural |
| **Triadic** | Three equidistant | Balanced, dynamic |
| **Split-complementary** | Base + two adjacent to complement | Softer contrast |

### Color Psychology

| Color | Associations | Use Cases |
| ----- | ------------ | --------- |
| **Blue** | Trust, stability, tech | Corporate, software |
| **Green** | Growth, nature, success | Health, finance |
| **Red** | Energy, urgency, passion | CTAs, alerts |
| **Purple** | Creativity, luxury | Premium, creative |
| **Orange** | Friendly, energetic | Social, youth |
| **Yellow** | Optimism, attention | Highlights, warnings |

### Contrast & Accessibility

| WCAG Level | Contrast Ratio | Use |
| ---------- | -------------- | --- |
| AA (normal) | 4.5:1 | Body text |
| AA (large) | 3:1 | 18px+ or 14px bold |
| AAA | 7:1 | Maximum accessibility |

### Applying Color Theory to Mermaid Diagrams

Color theory principles translate directly to Mermaid diagram styling. The **GitHub Pastel Palette v2** (defined in the **markdown-mermaid** skill) implements these principles:

**Semantic Color Mapping** (from color psychology):

| Semantic Purpose | Palette Color | Fill | Text | Stroke |
| ---------------- | ------------- | ---- | ---- | ------ |
| Primary actions | Blue | `#ddf4ff` | `#0550ae` | `#80ccff` |
| Success/output | Green | `#d3f5db` | `#1a7f37` | `#6fdd8b` |
| Business logic | Gold | `#fff8c5` | `#9a6700` | `#d4a72c` |
| Special/DevOps | Purple | `#d8b9ff` | `#6639ba` | `#bf8aff` |
| Errors/critical | Red | `#ffebe9` | `#cf222e` | `#f5a3a3` |
| Raw/ingestion | Bronze | `#fff1e5` | `#953800` | `#ffb77c` |
| Background | Neutral | `#eaeef2` | `#24292f` | `#d0d7de` |

**Design Principles Applied**:

1. **Triadic harmony**: Blue + Gold + Red form a balanced triad
2. **Analogous groups**: Green + Blue are adjacent, creating calm flow sections
3. **Light fills + dark text**: Ensures WCAG AA contrast (4.5:1+)
4. **Neutral arrows** (`#57606a`): Don't compete with colored nodes — visual hierarchy preserved
5. **Consistent stroke family**: Each color has a matching mid-tone stroke (not jarring black borders)

**When to Override the Palette**:
- Diagrams comparing two systems → Use just 2 contrasting colors (complementary scheme)
- Status dashboards → Green/Yellow/Red RAG mapping
- Sequential processes → Monochromatic gradient (light to dark within one hue)

## SVG Design

### SVG Structure

```xml
<svg viewBox="0 0 width height" xmlns="...">
  <defs>
    <!-- Reusable definitions -->
    <linearGradient id="grad1">...</linearGradient>
    <filter id="shadow">...</filter>
  </defs>

  <!-- Background layer -->
  <rect .../>

  <!-- Main content -->
  <g transform="translate(x, y)">
    <!-- Grouped elements -->
  </g>

  <!-- Foreground/overlay -->
</svg>
```

### Common SVG Elements

| Element | Use | Key Attributes |
| ------- | --- | -------------- |
| `<rect>` | Rectangles, backgrounds | x, y, width, height, rx (rounded) |
| `<circle>` | Circles, dots | cx, cy, r |
| `<ellipse>` | Ovals | cx, cy, rx, ry |
| `<line>` | Straight lines | x1, y1, x2, y2 |
| `<path>` | Complex shapes | d (path data) |
| `<text>` | Typography | x, y, text-anchor, dominant-baseline |
| `<g>` | Grouping | transform |

### SVG Path Commands

| Command | Meaning | Example |
| ------- | ------- | ------- |
| M | Move to | M 10 20 |
| L | Line to | L 30 40 |
| H | Horizontal line | H 50 |
| V | Vertical line | V 60 |
| Q | Quadratic curve | Q cx cy, x y |
| C | Cubic curve | C cx1 cy1, cx2 cy2, x y |
| Z | Close path | Z |

### SVG Text Alignment

```xml
<!-- Horizontal alignment -->
text-anchor="start|middle|end"

<!-- Vertical alignment -->
dominant-baseline="auto|middle|central|hanging"

<!-- Centered text -->
<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">
  Perfectly Centered
</text>
```

### SVG Gradients

```xml
<!-- Linear gradient -->
<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="#007ACC"/>
  <stop offset="100%" stop-color="#00a8e8"/>
</linearGradient>

<!-- Radial gradient -->
<radialGradient id="glow" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stop-color="#007ACC" stop-opacity="0.4"/>
  <stop offset="100%" stop-color="#007ACC" stop-opacity="0"/>
</radialGradient>
```

### SVG Transforms

| Transform | Syntax | Use |
| --------- | ------ | --- |
| Translate | translate(x, y) | Move element |
| Rotate | rotate(deg, cx, cy) | Spin around point |
| Scale | scale(x, y) | Resize |
| Skew | skewX(deg) / skewY(deg) | Shear |

## Banner & Marketing Design

### Banner Dimensions

| Platform | Size | Aspect |
| -------- | ---- | ------ |
| VS Code Marketplace | 1280×640 | 2:1 |
| GitHub Social | 1280×640 | 2:1 |
| Twitter Header | 1500×500 | 3:1 |
| LinkedIn Banner | 1584×396 | 4:1 |
| Open Graph | 1200×630 | ~1.9:1 |

### Banner Composition

```text
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐    │
│  │         VISUAL ELEMENT          │    │  Top third: Logo/Icon
│  └─────────────────────────────────┘    │
│                                         │
│           MAIN HEADLINE                 │  Middle: Primary message
│           Subtitle Text                 │
│                                         │
│  [Badge 1]  [Badge 2]  [Badge 3]        │  Bottom third: CTAs/Details
└─────────────────────────────────────────┘
```

### Badge/Pill Design

```xml
<!-- Rounded pill badge -->
<g>
  <rect x="-50" y="-16" width="100" height="32" rx="16"
        fill="#007ACC" opacity="0.15"/>
  <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-size="12" fill="#94a3b8">Label</text>
</g>
```

## Icon Design

### Icon Grid

```text
┌────────────────────┐
│ ┌──────────────┐   │  Outer: Padding zone
│ │              │   │  Inner: Safe area
│ │   CONTENT    │   │  Content: Icon artwork
│ │              │   │
│ └──────────────┘   │  Standard: 24×24, 16×16
└────────────────────┘
```

### Icon Principles

- **Simplicity** — Recognize at small sizes
- **Consistency** — Same stroke weight, style
- **Optical balance** — Visually centered, not mathematically
- **Metaphor** — Universally understood symbols

### Icon Styles

| Style | Characteristics | Use |
| ----- | --------------- | --- |
| **Outlined** | Stroke only, no fill | Light, modern UI |
| **Filled** | Solid shapes | Bold, clear visibility |
| **Duotone** | Two tones/colors | Distinctive, branded |
| **Glyph** | Single color, simplified | System icons |

## Design Systems

### Spacing Scale (8px base)

| Token | Value | Use |
| ----- | ----- | --- |
| xs | 4px | Tight spacing |
| sm | 8px | Default gap |
| md | 16px | Section spacing |
| lg | 24px | Component gaps |
| xl | 32px | Major sections |
| 2xl | 48px | Hero spacing |

### Elevation/Shadow

| Level | Shadow | Use |
| ----- | ------ | --- |
| 0 | None | Flat elements |
| 1 | 0 1px 2px | Subtle lift |
| 2 | 0 2px 4px | Cards |
| 3 | 0 4px 8px | Dropdowns |
| 4 | 0 8px 16px | Modals |

### Border Radius Scale

| Token | Value | Use |
| ----- | ----- | --- |
| none | 0 | Sharp corners |
| sm | 4px | Subtle rounding |
| md | 8px | Standard buttons |
| lg | 16px | Cards, pills |
| full | 9999px | Circles, pills |

## Illustration Principles

Universal principles for placing illustrations in any document — READMEs, docs, presentations, books.

### Principle 1: Contextual Placement

> **An image should answer: "Why HERE?"**

Place images at the exact moment they illustrate. An image that appears next to the content it depicts reinforces understanding; a decorative image placed arbitrarily adds noise.

### Principle 2: Visual Variety

> **Readers should be surprised by each image, not numb to them.**

Avoid repeating the same visual formula. Vary: composition, subject matter, perspective, color palette, and image type (diagram, screenshot, illustration, photo).

### Principle 3: Narrative Function

Every illustration should serve one of these purposes:

| Function | Description | Example |
|----------|-------------|--------|
| **Anchor** | Mark a pivotal moment or concept | Architecture diagram at design section |
| **Reveal** | Show something text describes | Screenshot of the UI being discussed |
| **Transition** | Signal a tonal or topic shift | Banner between major sections |
| **Character** | Deepen connection to a person/persona | Avatar at persona introduction |
| **Setting** | Establish context or environment | Deployment diagram for infrastructure |
| **Evidence** | Visual proof or data | Chart, graph, or test results |

### Principle 4: Format Consistency

**HTML for precise control:**
```html
<p align="center">
<img src="assets/IMAGE.png" alt="Descriptive alt text" width="60%">
</p>
```

**Width guidelines:**

| Asset Type | Width | Use |
|------------|-------|-----|
| Full-width banners | 100% | Section headers, hero images |
| Feature illustrations | 60% | In-content diagrams, screenshots |
| Spot illustrations | 40-50% | Inline accents, small diagrams |
| Icons/badges | 20-30% | Status indicators, inline elements |

---

## Design Review Checklist

### Visual Quality

- [ ] Consistent spacing throughout
- [ ] Aligned elements (check edges)
- [ ] Balanced composition
- [ ] Clear visual hierarchy
- [ ] Appropriate whitespace

### Typography

- [ ] Readable font sizes
- [ ] Proper line height
- [ ] Consistent font usage
- [ ] Good contrast ratios
- [ ] Appropriate letter spacing

### Color

- [ ] Consistent color palette
- [ ] Sufficient contrast
- [ ] Meaningful color use
- [ ] Works in different contexts
- [ ] Accessible (WCAG compliant)

### Technical

- [ ] Optimized file size
- [ ] Correct dimensions
- [ ] Responsive/scalable
- [ ] Cross-platform compatible
- [ ] Proper naming conventions

---

# SVG Graphics Skill

> Scalable, accessible, theme-aware visuals.

## Why SVG

- Scales infinitely (retina, print)
- Text is searchable/accessible
- CSS-styleable (dark mode!)
- Small file size
- Version control friendly

## Banner Template

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#1a1a2e"/>

  <!-- Title -->
  <text x="50" y="100" font-size="48" fill="#fff" font-family="system-ui">
    Project Name
  </text>

  <!-- Tagline -->
  <text x="50" y="150" font-size="24" fill="#888">
    One-line description
  </text>

  <!-- Feature pills -->
  <g transform="translate(50, 200)">
    <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
    <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 1</text>
  </g>
</svg>
```

## Key Techniques

| Technique | Use Case |
| --------- | -------- |
| `viewBox` | Responsive scaling |
| `<defs>` + `<use>` | Reusable components |
| `<linearGradient>` | Modern backgrounds |
| `<clipPath>` | Shaped containers |
| CSS variables | Theme switching |

## Dark/Light Mode

```xml
<style>
  @media (prefers-color-scheme: dark) {
    .bg { fill: #1a1a2e; }
    .text { fill: #ffffff; }
  }
  @media (prefers-color-scheme: light) {
    .bg { fill: #ffffff; }
    .text { fill: #1a1a2e; }
  }
</style>
```

## Icon Guidelines

| Size | Use |
| ---- | --- |
| 16x16 | Favicon, small UI |
| 32x32 | Tab icon, lists |
| 128x128 | App icon |
| 512x512 | Store listing |

## SMIL Animation

### Delayed Fade-In Pattern

Elements that should appear after load (hero text, feature pills, etc.):

```xml
<!-- Element starts invisible, fades in after delay -->
<g opacity="0">
  <text x="50" y="100" font-size="48" fill="#fff">Title</text>
  <animate
    attributeName="opacity"
    from="0" to="1"
    dur="0.8s"
    begin="0.5s"
    fill="freeze"
  />
</g>
```

**Key attributes**:

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `begin` | Delay before start | `"0.5s"`, `"1s"`, `"click"` |
| `dur` | Animation duration | `"0.3s"` to `"2s"` typical |
| `fill` | State after animation | `"freeze"` (keep end state) or `"remove"` (revert) |
| `repeatCount` | Repetitions | `"1"`, `"3"`, `"indefinite"` |

### Staggered Entrance

Multiple elements appearing in sequence:

```xml
<g opacity="0">
  <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
  <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 1</text>
  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.3s" fill="freeze"/>
</g>
<g opacity="0">
  <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
  <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 2</text>
  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.6s" fill="freeze"/>
</g>
<g opacity="0">
  <rect rx="12" width="100" height="24" fill="#4a4a6a"/>
  <text x="50" y="17" text-anchor="middle" fill="#fff" font-size="12">Feature 3</text>
  <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.9s" fill="freeze"/>
</g>
```

**Pattern**: Increment `begin` by `0.3s` per element for smooth staggering.

### SMIL Compatibility

| Platform | Support |
|----------|---------|
| Chrome/Edge | Full SMIL |
| Firefox | Full SMIL |
| Safari | Full SMIL |
| GitHub README | **No animation** (static render) |
| npm/PyPI README | **No animation** (static render) |

**Rule**: For README badges/banners, set initial `opacity="1"` as fallback — animated SVGs render as static first frame in non-animated contexts.

## CSS Transform Patterns

### The Nested Group Pattern

**Problem**: Combining position transforms (`translate`) with animation transforms (`rotate`, `scale`) on the same element causes conflicts — the animation resets position.

**Solution**: Use nested `<g>` groups to separate concerns:

```xml
<!-- Outer group: POSITION (static) -->
<g transform="translate(600, 150)">
  <!-- Inner group: ANIMATION (dynamic) -->
  <g>
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0" to="360"
      dur="10s"
      repeatCount="indefinite"
    />
    <!-- The actual shape -->
    <circle r="20" fill="#4a90d9"/>
  </g>
</g>
```

**Rule**: Never mix static positioning and animated transforms on the same element. Always wrap in a positioning group.

### Scale from Center

```xml
<g transform="translate(100, 100)">
  <!-- transform-origin doesn't work reliably in SVG; 
       use translate to center, then scale -->
  <g>
    <animateTransform
      attributeName="transform"
      type="scale"
      from="0.8" to="1.0"
      dur="0.5s"
      fill="freeze"
    />
    <!-- Shape centered at origin (0,0) -->
    <circle cx="0" cy="0" r="30" fill="#d3f5db"/>
  </g>
</g>
```

### Pulse Effect

```xml
<circle cx="50" cy="50" r="10" fill="#cf222e">
  <animateTransform
    attributeName="transform"
    type="scale"
    values="1;1.2;1"
    dur="1.5s"
    repeatCount="indefinite"
  />
</circle>
```

## ClipPath Container Layering

### The 3-Layer Pattern

For shaped containers with content and visible borders:

```xml
<defs>
  <clipPath id="container-clip">
    <rect x="50" y="50" width="400" height="200" rx="16"/>
  </clipPath>
</defs>

<!-- Layer 1: BACKGROUND (fill behind clip) -->
<rect x="50" y="50" width="400" height="200" rx="16" fill="#f6f8fa"/>

<!-- Layer 2: CLIPPED CONTENT (stays inside shape) -->
<g clip-path="url(#container-clip)">
  <!-- Content that may overflow is safely clipped -->
  <image href="photo.jpg" x="50" y="50" width="400" height="200"/>
  <text x="70" y="120" font-size="24" fill="#fff">Overlay Text</text>
</g>

<!-- Layer 3: BORDER OUTLINE (drawn last, on top) -->
<rect x="50" y="50" width="400" height="200" rx="16" 
      fill="none" stroke="#d1d9e0" stroke-width="2"/>
```

**Draw order matters**:
1. Background fill (behind everything)
2. Clipped content group (contained within shape)
3. Border outline (on top, `fill="none"`)

### Rounded Card Pattern

```xml
<defs>
  <clipPath id="card">
    <rect width="300" height="180" rx="12"/>
  </clipPath>
</defs>

<g transform="translate(20, 20)">
  <!-- Card background -->
  <rect width="300" height="180" rx="12" fill="#ffffff"/>
  
  <!-- Card content (clipped) -->
  <g clip-path="url(#card)">
    <!-- Header band -->
    <rect width="300" height="48" fill="#0550ae"/>
    <text x="16" y="32" fill="#fff" font-size="16" font-weight="bold">Card Title</text>
    <!-- Body -->
    <text x="16" y="80" fill="#1f2328" font-size="14">Card content here</text>
  </g>
  
  <!-- Card border -->
  <rect width="300" height="180" rx="12" fill="none" stroke="#d1d9e0"/>
</g>
```

## SVG Optimization

### SVGO Configuration

```json
{
  "plugins": [
    "preset-default",
    { "name": "removeViewBox", "active": false },
    { "name": "removeDimensions", "active": true },
    { "name": "removeTitle", "active": false }
  ]
}
```

**Critical**: Never remove `viewBox` (breaks scaling) or `<title>` (breaks accessibility).

### Size Budget

| SVG Type | Target Size | Max |
|----------|-------------|-----|
| Icon | < 1 KB | 2 KB |
| Badge/shield | < 2 KB | 5 KB |
| Banner | < 10 KB | 25 KB |
| Complex diagram | < 25 KB | 50 KB |

### Common Optimization Wins

| Technique | Savings |
|-----------|---------|
| Remove editor metadata (Inkscape, Illustrator) | 20-50% |
| Simplify paths (reduce decimal precision) | 10-20% |
| Remove empty groups/unused defs | 5-15% |
| Convert shapes to paths | 5-10% |
| Gzip on server | 60-80% additional |

## Accessibility

- `role="img"` on decorative SVGs
- `<title>` for screen readers
- Sufficient contrast (4.5:1 min)
- `aria-hidden="true"` if decorative

## Tools

| Tool | Purpose |
| ---- | ------- |
| SVGO | Optimize/minify |
| Inkscape | Visual editing |
| svg-to-png | Rasterization |

## SVG for Documentation Illustrations

SVG isn't just for branding — it's the best format for **polished documentation visuals** that need more control than Mermaid provides.

### When to Choose SVG Over Mermaid

| Scenario | Use SVG | Use Mermaid |
|----------|---------|-------------|
| Architecture overview for README | ✅ Branded, polished | ❌ Too generic |
| Internal dev docs flow | ❌ Overkill | ✅ Quick, accurate |
| Marketing / landing page | ✅ Full design control | ❌ Unbranded |
| Infographic with custom layout | ✅ Arbitrary positioning | ❌ Auto-layout only |
| Dark/light theme required | ✅ CSS media queries | ⚠️ Limited theming |
| Print / high-DPI output | ✅ Infinitely scalable | ⚠️ Rasterized at render |

### Illustration Template

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" role="img">
  <title>Architecture Overview</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1e1e1e; }
      .text { fill: #d4d4d4; }
      .box { fill: #2d2d2d; stroke: #444; }
      .accent { fill: #0078d4; }
    }
    @media (prefers-color-scheme: light) {
      .bg { fill: #ffffff; }
      .text { fill: #1a1a1a; }
      .box { fill: #f5f5f5; stroke: #ddd; }
      .accent { fill: #0078d4; }
    }
    .label { font-family: system-ui, sans-serif; font-size: 14px; }
    .title-text { font-family: system-ui, sans-serif; font-size: 20px; font-weight: 600; }
    .connector { stroke-width: 2; stroke-dasharray: 4 4; }
  </style>

  <rect class="bg" width="100%" height="100%"/>

  <!-- Title -->
  <text class="title-text text" x="400" y="30" text-anchor="middle">Architecture Name</text>

  <!-- Boxes with rounded corners -->
  <g transform="translate(100, 60)">
    <rect class="box" rx="8" width="200" height="80" stroke-width="1.5"/>
    <text class="label text" x="100" y="45" text-anchor="middle">Component A</text>
  </g>

  <!-- Connector arrow -->
  <line class="connector accent" x1="300" y1="100" x2="400" y2="100"/>
  <polygon class="accent" points="400,95 410,100 400,105"/>

  <g transform="translate(420, 60)">
    <rect class="box" rx="8" width="200" height="80" stroke-width="1.5"/>
    <text class="label text" x="100" y="45" text-anchor="middle">Component B</text>
  </g>
</svg>
```

### Key Principles for Illustrations

1. **Always include dark/light mode** via `@media (prefers-color-scheme: ...)` — GitHub renders both
2. **Use semantic class names** (`.box`, `.accent`, `.connector`) not inline styles
3. **Center with `text-anchor="middle"`** — more maintainable than manual x positioning
4. **Group with `<g transform="translate()">`** — move entire components by adjusting one value
5. **Keep `viewBox` ratio consistent** — 800×400 (2:1) for wide illustrations, 600×600 (1:1) for square

## Illustrating Real-World Subjects (Animals, Objects, People)

### The Snowman Problem

**Problem**: When asked to draw a dog, cat, person, or any real-world subject, AI defaults to stacking circles and rectangles — producing geometric snowmen with accessories instead of recognizable illustrations.

**Root Cause**: The model uses primitive shapes (`<circle>`, `<rect>`, `<ellipse>`) as building blocks. Real-world subjects have **organic, asymmetric silhouettes** that require `<path>` elements with Bezier curves.

**The Snowman Test**: If you remove all color, texture, and small details — does the **silhouette alone** identify the subject? A circle on a circle is always a snowman, no matter how many ears/tails you add.

### Mandatory Rules for Subject Illustrations

| # | Rule | Why |
|---|------|-----|
| 1 | **Start with the silhouette** — sketch the outer `<path>` outline FIRST | The outline makes or breaks recognition. If the outline looks wrong, details won't fix it. |
| 2 | **Use `<path>` with Bezier curves** for ALL organic shapes | `<circle>` and `<ellipse>` produce geometric/robotic results. Real animals have no perfect circles. |
| 3 | **Pass the squint test** — outline alone must be identifiable | Remove all fill colors and details. If the outline doesn't read as the subject, redo the outline. |
| 4 | **Get proportions right before adding details** | Head-to-body ratio, limb length, and placement matter more than eyes/nose/accessories. |
| 5 | **Count limbs correctly** — quadrupeds have 4 legs, birds have 2 + wings | The most common error. Don't draw 2 legs on a 4-legged animal. In side view, show at least 3 legs (near pair + 1 far). |
| 6 | **Differentiate species by key anatomical features** | A dog is not a cat is not a bear. See the feature table below. |

### Feature Differentiation Table

What makes each animal **visually distinct** — the features to exaggerate:

| Animal | Key Silhouette Features | Common AI Mistakes |
|--------|------------------------|--------------------|
| **Dog** | Snout/muzzle protruding from head, floppy or pointed ears (SIDE of head, not top), 4 legs, wagging tail, body longer than tall | Flat face (no snout), cat ears on top, 2 legs, perfect circle head |
| **Cat** | Pointed ears on TOP of head, round face, long curved whiskers, slender body, long curving tail, 4 legs with small paws | No whiskers, dog-like snout added, thick stocky body |
| **Bird** | Beak (triangular), wings (large relative to body), 2 thin legs, tail feathers, no arms | 4 legs, no beak, arms instead of wings |
| **Fish** | Streamlined oval body, tail fin, dorsal fin, NO legs | Legs added, round body (balloon), no fins |
| **Person** | Head on neck on shoulders, 2 arms with hands, 2 legs with feet, torso taller than wide | Snowman stack, no neck, T-pose arms |
| **Horse** | Long neck, elongated head with flat front, 4 long thin legs, mane, flowing tail | Dog-like proportions, short legs, round head |
| **Rabbit** | LONG upright ears (longer than head), round body, short front legs, large hind legs, cotton tail | Short ears (looks like a bear), same-length legs |

### The Path-First Approach

**Never build an animal from primitive shapes.** Build from a single continuous `<path>` outline.

#### Step-by-Step: Drawing a Dog (Side View)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img">
  <title>Dog illustration</title>
  
  <!-- Step 1: BODY OUTLINE - single path defining the entire silhouette -->
  <!-- Start at chest, go along back, tail, rear leg, belly, front leg, up to chin, head, ear, back to start -->
  <path d="
    M 120,180
    C 120,140 140,110 180,105
    C 210,100 250,100 280,110
    Q 300,118 310,135
    L 330,115
    L 320,140
    Q 315,160 310,180
    L 305,220
    L 290,220
    L 290,185
    Q 260,195 220,195
    L 180,220
    L 165,220
    L 170,185
    Q 140,180 120,180
    Z
  " fill="#c89050" stroke="#6b4226" stroke-width="2"/>

  <!-- Step 2: HEAD - overlapping path with snout protruding forward -->
  <path d="
    M 130,160
    C 120,130 100,110 85,100
    Q 70,92 60,100
    C 50,110 55,130 60,140
    L 65,148
    Q 80,160 100,165
    Q 115,168 130,160
    Z
  " fill="#c89050" stroke="#6b4226" stroke-width="2"/>
  
  <!-- Step 3: SNOUT/MUZZLE - the feature that makes it a dog, not a snowman -->
  <path d="
    M 72,130
    C 60,125 50,128 48,135
    C 46,142 52,148 62,148
    Q 70,145 72,138
    Z
  " fill="#e8c690" stroke="#6b4226" stroke-width="1.5"/>
  
  <!-- Step 4: EAR - floppy, attached to SIDE of head (not on top!) -->
  <path d="
    M 100,105
    C 105,85 115,75 120,80
    C 125,88 118,105 110,112
    Z
  " fill="#a0703c" stroke="#6b4226" stroke-width="1.5"/>
  
  <!-- Step 5: Details LAST - eye, nose, mouth -->
  <circle cx="82" cy="115" r="4" fill="#2c1810"/>  <!-- Eye -->
  <ellipse cx="52" cy="135" rx="5" ry="4" fill="#2c1810"/>  <!-- Nose -->
  <path d="M 55,142 Q 62,148 68,144" fill="none" stroke="#6b4226" stroke-width="1.5"/>  <!-- Mouth -->
  
  <!-- Step 6: TAIL - curved upward, characteristic dog pose -->
  <path d="M 325,120 Q 345,90 350,100 Q 348,115 330,125" 
        fill="#c89050" stroke="#6b4226" stroke-width="2"/>
</svg>
```

**Why this works**: 
- Silhouette reads as "dog" even without color (elongated body, protruding snout, floppy ear)
- Snout is the dominant facial feature — face is NOT flat
- 4 legs visible (2 front, 2 back in side view)
- Body is longer than tall (dog proportions, not snowman proportions)
- ALL shapes use `<path>` with curves — no perfect circles

### Proportion Guide

For side-view quadrupeds (dog, cat, horse):

```text
┌──────────────────────────────────────────┐
│         HEAD    NECK    BODY             │
│        ┌───┐   ┌─┐   ┌──────────┐      │
│   ear→ │   │───│ │───│          │ ←tail │
│        │ • │   │ │   │          │  /    │
│  snout→│ ▪ │   └─┘   │          │ /     │
│        └───┘         │          │/      │
│                      └──┬──┬──┬─┘       │
│                         │  │  │  │      │
│                     legs (4, not 2!)    │
│                                         │
│  HEAD:BODY ratio ≈ 1:2.5 (dog)         │
│  HEAD:BODY ratio ≈ 1:2   (cat)         │
│  HEAD:BODY ratio ≈ 1:4   (horse)       │
│  LEG length ≈ body height (dog, horse)  │
│  LEG length ≈ 0.7× body height (cat)   │
└──────────────────────────────────────────┘
```

### Color Guidelines for Illustrated Subjects

| Subject | Natural Palette | Avoid |
|---------|----------------|-------|
| Dog | Browns (#c89050, #a0703c, #6b4226), Golden (#e8c690), Black, White, Gray | Green, blue, purple (unnatural) |
| Cat | Gray (#8e8e8e), Orange (#d68c45), Black, White, Siamese (#c4a882) | Bright green, neon colors |
| Bird | Species-specific; blue (#4a90d9), red (#cf4040), yellow (#e6b422), green (#5ab05a) | All one color (usually multi-toned) |
| Person | Skin tones, clothing colors | Geometric shapes for body parts |
| Tree | Green canopy (#4a8c3f, #6aad5a), brown trunk (#6b4226, #8b6914) | Blue leaves, gray trunk |

**Rule**: Use **realistic base colors** unless the user specifically requests a stylized/cartoon palette.

### Common Failure Modes

| Failure | Cause | Fix |
|---------|-------|-----|
| "Snowman with ears" | Using stacked circles for body | Use one continuous `<path>` for body outline |
| "Cat ears on everything" | Triangles placed on top of circular head | Place ears on SIDE of head (dogs), check species table |
| "Floating face" | Features placed on a perfect circle with no jaw/chin structure | Give head a distinct shape — snout, jawline, not a circle |
| "Stick figure animal" | Rectangles for legs attached to circles | Legs should taper, connect to body organically with curves |
| "2-legged quadruped" | Forgetting rear or front leg pair | Always count: is this animal 2-legged or 4-legged? |
| "Psychedelic colors" | Using brand/branding palette instead of natural colors | Real animals have earthy, natural tones — check color table |
| "Giant head, tiny body" | No proportion reference | Check proportion guide — head is usually smaller than body |

### Workflow for Subject Illustrations

1. **Identify** — What species/object? What view? (side/front/3-quarter)
2. **Reference proportions** — Check the proportion guide and feature table
3. **Draw silhouette** — Single `<path>` for body outline. Apply squint test.
4. **Add major features** — Head shape, ears at correct position, limbs (count them!)
5. **Add details last** — Eyes, nose, mouth, texture, color
6. **Squint test** — Remove all color. Is the silhouette recognizable?

---
