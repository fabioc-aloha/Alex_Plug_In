# Data Storytelling Trifecta Suite -- Plan

> **Status**: Complete (45/45 trifectas, 155 skills, brain-qa 0 bugs)
> **Created**: 2026-03-26
> **Author**: Alex + Fabio
> **Goal**: Turn raw data into compelling, interactive narratives through five interlocking trifectas and supporting muscles
> **Primary Consumer**: VT BIT 5424 (AI-Assisted Power BI), `C:\Development\VT_AIPOWERBI`

<details>
<summary><strong>Implementation Tracker</strong> (click to expand)</summary>

### Trifectas

| #   | Trifecta               | SKILL.md | synapses.json | .instructions.md | .prompt.md | Status       |
| --- | ---------------------- | -------- | ------------- | ---------------- | ---------- | ------------ |
| 1   | `data-visualization`   | [x]      | [x]           | [x]              | [x]        | **Complete** |
| 2   | `data-analysis`        | [x]      | [x]           | [x]              | [x]        | **Complete** |
| 3   | `dashboard-design`     | [x]      | [x]           | [x]              | [x]        | **Complete** |
| 4   | `data-storytelling`    | [x]      | [x]           | [x]              | [x]        | **Complete** |
| 5   | `chart-interpretation` | [x]      | [x]           | [x]              | [x]        | **Complete** |

### Muscles

| #   | Muscle                   | Script | Tests | Docs | Status          |
| --- | ------------------------ | ------ | ----- | ---- | --------------- |
| 6   | `data-ingest.cjs`        | [x]    | [ ]   | [ ]  | **Script done** |
| 7   | `dashboard-scaffold.cjs` | [x]    | [ ]   | [ ]  | **Script done** |
| 8   | `data-profile.cjs`       | [x]    | [ ]   | [ ]  | **Script done** |
| 9   | `chart-recommend.cjs`    | [x]    | [ ]   | [ ]  | **Script done** |

### Reference Implementations

| File               | Location            | Status           | Lines |
| ------------------ | ------------------- | ---------------- | ----- |
| `population.html`  | alex_docs/research/ | Done             | ~580  |
| `visuals.html`     | alex_docs/research/ | Done             | ~660  |
| `adv_visuals.html` | alex_docs/research/ | Stub (258 bytes) | TBD   |

### Wiring & Registration

| Task                                          | Status   |
| --------------------------------------------- | -------- |
| Memory-activation index updated               | [x] Done |
| SKILLS-CATALOG.md updated (5 new skills)      | [x] Done |
| TRIFECTA-CATALOG.md updated (5 new trifectas) | [x] Done |
| copilot-instructions.md trifecta count bumped | [x] Done |
| Synapse connections wired bidirectionally     | [x] Done |
| brain-qa passes with 0 broken connections     | [x] Done |

### VT BIT 5424 Validation

| Test                              | Trifecta       | Dataset                             | Status          |
| --------------------------------- | -------------- | ----------------------------------- | --------------- |
| `/analyze` on CloudRevenue CSV    | Analysis       | CloudRevenue (50K rows)             | [ ] Not started |
| `/visualize` M365Marketing ROI    | Visualization  | M365Marketing (75K rows)            | [ ] Not started |
| `/dashboard` 5-Visual Rule layout | Dashboard      | SupportInsights (150K rows)         | [ ] Not started |
| `/datastory` end-to-end HTML      | Storytelling   | Starbucks Kaggle (300K+ rows)       | [ ] Not started |
| `/interpret` Power BI screenshot  | Interpretation | Any chart image                     | [ ] Not started |
| `data-ingest.cjs` multi-table CSV | Muscle         | All VT datasets                     | [ ] Not started |
| Kirk/Knaflic framework alignment  | All            | N/A                                 | [ ] Not started |
| DIKW narrative structure          | Storytelling   | N/A                                 | [ ] Not started |
| Knowledge doc consistency         | All            | CHARTING-GUIDE, DATA-ANALYSIS-GUIDE | [ ] Not started |

### Open Decisions Resolved

| #   | Decision                    | Resolution                        | Date       |
| --- | --------------------------- | --------------------------------- | ---------- |
| 1   | Primary chart library       | Chart.js 4.x + raw Canvas 2D API  | 2026-03-26 |
| 2   | Python output targets       | Plotly (default)                  | 2026-03-26 |
| 3   | Dashboard platform priority | HTML-first self-contained         | 2026-03-26 |
| 4   | Storytelling methodology    | Hybrid Knaflic + Tufte            | 2026-03-26 |
| 5   | Scaffold input format       | JSON specification                | 2026-03-26 |
| 6   | Advanced chart rendering    | Canvas-only for 10 advanced types | 2026-03-26 |
| 7   | Chart guide output          | Embed + HTML guide                | 2026-03-26 |
| 8   | SQL dependency model        | Optional install                  | 2026-03-26 |
| 9   | Large dataset strategy      | Sample + warn                     | 2026-03-26 |
| 10  | Public API auth management  | .env keys                         | 2026-03-26 |

</details>

## Problem Statement

Alex's Data Analytics capability has only 2 skills (`microsoft-fabric`, `fabric-notebook-publish`) -- no trifectas, no visualization, no dashboarding, no storytelling. The skill wish list already flags "Data Visualization | Analytics | Charts, dashboards, storytelling" as a gap. Related skills like `executive-storytelling` and `slide-design` touch data viz peripherally but aren't dedicated.

## Vision

Five interlocking trifectas that turn raw data into compelling narratives -- and read existing charts back into insights:

1. **Analysis** discovers the story hiding in the data
2. **Visualization** tells it -- choosing the right chart for the narrative, not just the data shape
3. **Dashboard** makes it interactive and explorable
4. **Storytelling** ties them into a coherent arc with a clear argument
5. **Interpretation** reads existing charts and extracts insights, notes, and narratives from them

Each trifecta outputs self-contained, production-ready artifacts -- no build step, no server required.

## Real-World Validation: VT BIT 5424

This trifecta suite is being developed alongside **BIT 5424: Business Visualization Analytics** at Virginia Tech's Pamplin College of Business (`C:\Development\VT_AIPOWERBI`). The course is the primary testing ground and first consumer.

### Course Context

| Property           | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Course**         | BIT 5424: Business Visualization Analytics                                                  |
| **Program**        | Virginia Tech MBA, Pamplin College of Business                                              |
| **Professors**     | Dr. Viswanath Venkatesh + Prof. Fabio Correa                                                |
| **Website**        | vt.correax.com (Azure Static Web App)                                                       |
| **AI Assistant**   | Azure OpenAI Assistants API, embedded chat widget                                           |
| **Core Principle** | "A Power BI report is not the deliverable. Insights are."                                   |
| **Approach**       | Copilot-first -- AI is the primary interface, not supplementary                             |
| **Textbooks**      | Kirk (Data Visualisation 3e), Knaflic (Storytelling with Data), Correa (Dialog Engineering) |

### Course Datasets (Test Fixtures)

Three synthetic datasets plus public Starbucks data provide ready-made test fixtures for every trifecta:

| Dataset                | Complexity | Tables   | Rows   | Story Intents to Test                                                                       |
| ---------------------- | ---------- | -------- | ------ | ------------------------------------------------------------------------------------------- |
| **CloudRevenue**       | Low        | 3        | ~50K   | Compare (revenue by region), Trend (MoM growth), Part-to-whole (product mix)                |
| **M365Marketing**      | Medium     | 5        | ~75K   | Compare (channel ROI), Trend (campaign performance), Relationship (spend vs. pipeline)      |
| **SupportInsights**    | Medium     | 5        | ~150K  | Distribution (resolution times), Flow (escalation paths), Deviation (SLA breaches)          |
| **Starbucks (public)** | Varies     | Multiple | ~300K+ | Compare (store locations), Distribution (nutrition), Relationship (offers vs. transactions) |
| **AIRS Research**      | Low        | 1        | ~60    | Trend (pre/post AI reliance scores), Compare (cohort segments)                              |

Dataset locations: `VT_AIPOWERBI/datasets/raw/` (CSV), `VT_AIPOWERBI/datasets/generators/` (Python generators), `VT_AIPOWERBI/datasets/brds/` (business requirements).

### Theory Alignment

The course teaches specific frameworks that map directly to trifecta capabilities:

| Course Theory                          | Source                      | Trifecta Alignment                                          |
| -------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| Chart taxonomy and selection           | Kirk ch. 6, Knaflic ch. 2-3 | **Visualization** -- story-intent selection matrix          |
| Pre-attentive attributes and declutter | Knaflic ch. 4-5             | **Visualization** -- decluttering module                    |
| Narrative arc and Big Idea             | Knaflic ch. 1, 7            | **Storytelling** -- three-act structure, Big Idea Worksheet |
| Context of design (audience, purpose)  | Kirk ch. 3, 5               | **Storytelling** -- audience-first framing                  |
| "What is" vs. "What could be"          | Duarte                      | **Storytelling** -- Duarte Contrast module                  |
| Layout and composition                 | Kirk ch. 10, Knaflic ch. 7  | **Dashboard** -- layout patterns, 5-Visual Rule             |
| Color with purpose                     | Kirk ch. 9                  | **Visualization** -- color theory module                    |
| Root cause analysis                    | Kirk ch. 6 revisited        | **Analysis** -- anomaly detection, segmentation             |
| DIKW pyramid                           | Course methodology          | **Analysis** -- "so what?" translation module               |
| CSAR Loop                              | Dialog Engineering (Correa) | **Interpretation** -- structured chart reading              |

### VT Knowledge Assets (Synergy)

Existing VT knowledge base documents complement and should cross-reference the trifectas:

| VT Document                     | Trifecta Link  | Synergy                                                                     |
| ------------------------------- | -------------- | --------------------------------------------------------------------------- |
| `CHARTING-GUIDE.md`             | Visualization  | Chart selection by purpose/data type -- validates our story-intent matrix   |
| `DATA-ANALYSIS-GUIDE.md`        | Analysis       | DIKW pyramid, EDA checklist, 5 Whys -- feeds instruction procedure          |
| `STATISTICS-REFERENCE.md`       | Analysis       | Descriptive stats, distributions, correlations -- aligns with skill modules |
| `COPILOT-GUIDE.md`              | All (AI-first) | Copilot-first patterns inform how skills interact with AI                   |
| `LAB-05-Executive-Dashboard.md` | Dashboard      | 5-Visual Rule, "less is more" -- validates dashboard design patterns        |
| `THEORY-LAB-ALIGNMENT.md`       | All            | Gap analysis showing exactly where trifecta skills fill course weaknesses   |
| `population.html` (gallery)     | Dashboard      | Same reference file deployed to vt.correax.com/gallery/                     |
| `visuals.html` (gallery)        | Visualization  | Same reference file deployed to vt.correax.com/gallery/                     |

## Reference Implementations

Three self-contained HTML files serve as the pattern library for this suite. All live in `alex_docs/research/`.

| File                                 | Purpose                 | Charts                                     | Lines | Key Pattern                                                                                                                               |
| ------------------------------------ | ----------------------- | ------------------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [population.html](population.html)   | Dashboard archetype     | 4 (bar, donut, bucket bar, drill-down bar) | ~580  | Inverted pyramid narrative, KPIs-to-drill-down                                                                                            |
| [visuals.html](visuals.html)         | Chart selection guide   | 14 types across 6 categories               | ~660  | Card grid + modal detail, mini/full chart pairs, custom canvas (heatmap, treemap)                                                         |
| [adv_visuals.html](adv_visuals.html) | Advanced chart showcase | 10 canvas-only types                       | TBD   | Sankey, Chord, Streamgraph, Sunburst, Parallel Coordinates, Beeswarm, Ridgeline, Waffle, Network Graph, Violin -- all from-scratch canvas |

### Ref 1: population.html (Dashboard Archetype)

Canonical output pattern for `/dashboard` and `/datastory`. Key properties:

### Narrative Architecture (Inverted Pyramid)

| Layer | Component           | Purpose                                     | Time to Absorb |
| ----- | ------------------- | ------------------------------------------- | -------------- |
| 1     | KPI cards (5)       | Headline stats -- "what's the big picture?" | 2 seconds      |
| 2     | Bar chart           | Full distribution, interactive, color-coded | 10 seconds     |
| 3     | Donut + Size charts | Same data reframed through different lenses | 15 seconds     |
| 4     | Sortable table      | Detailed data for the analytical reader     | As needed      |
| 5     | Drill-down modal    | On-demand detail without leaving the page   | On click       |

### Technical Fingerprint

| Property       | Implementation                                            |
| -------------- | --------------------------------------------------------- |
| Format         | Self-contained HTML (~580 lines)                          |
| Data           | Embedded as JS arrays/objects -- no external fetch        |
| Dependencies   | Chart.js 4.x via CDN (single library)                     |
| Theming        | CSS custom properties (dark mode, semantic region colors) |
| Interactivity  | Search + region filters + column sort + click-to-drill    |
| Responsiveness | CSS grid with `auto-fit`, `minmax`, media queries         |
| Build step     | None -- open in browser                                   |

### Storytelling Patterns Encoded

| Pattern                        | Example from Reference                                                |
| ------------------------------ | --------------------------------------------------------------------- |
| **Title = insight, not label** | "States Over 10M" not "State Count"                                   |
| **Interaction hints**          | "Click a bar to explore cities"                                       |
| **Semantic color**             | Same region color flows through buttons, chart bars, dots, drill-down |
| **Rank hierarchy**             | Top 3 badges styled distinctly                                        |
| **Progressive disclosure**     | KPIs --> charts --> table --> drill-down                              |
| **Zero-config**                | Data embedded, CDN dependency, no API keys                            |

### Ref 2: visuals.html (Chart Selection Guide)

Canonical reference for `/visualize` -- teaches the skill which chart to pick. Key properties:

**6 Categories, 14 Chart Types**:

| Category     | Charts                                                      | Color Token                       |
| ------------ | ----------------------------------------------------------- | --------------------------------- |
| Comparison   | Bar, Horizontal Bar, Grouped Bar, Stacked Bar, Radar/Spider | `--comparison: #6366f1` (indigo)  |
| Trend        | Line, Area                                                  | `--trend: #3b82f6` (blue)         |
| Distribution | Histogram                                                   | `--distribution: #10b981` (green) |
| Relationship | Scatter, Bubble                                             | `--relationship: #f59e0b` (amber) |
| Proportion   | Pie, Donut, Treemap (canvas)                                | `--proportion: #ec4899` (pink)    |
| Pattern      | Heatmap (canvas)                                            | `--pattern: #8b5cf6` (purple)     |

**Per-Chart Metadata** (feeds directly into `chart-recommend.cjs`):

| Field       | Purpose                  | Example                                               |
| ----------- | ------------------------ | ----------------------------------------------------- |
| `bestFor`   | Array of ideal use cases | `["Ranking 2-15 categories", "Showing exact values"]` |
| `whenToUse` | Narrative guidance       | "Bar chart is the workhorse of comparison..."         |
| `avoidWhen` | Anti-patterns            | "Avoid with >15 categories"                           |
| `dataType`  | Data shape spec          | `"X: Categorical, Y: Quantitative"`                   |
| `examples`  | Real-world scenarios     | `["Monthly revenue by product", "Sales by region"]`   |

**UI Patterns** (reusable in dashboard muscle):
- Filter buttons with category-colored active states
- Card grid with mini chart previews (130px height)
- Modal with split layout (chart left, metadata right)
- Arrow key navigation between modal items
- Custom canvas rendering for non-Chart.js types (heatmap, treemap)

### Ref 3: adv_visuals.html (Advanced Chart Showcase)

Extends the visualization vocabulary beyond Chart.js into pure canvas territory. 10 chart types that handle complex data relationships:

| Chart                    | Category     | Best For                                                    | Rendering                    |
| ------------------------ | ------------ | ----------------------------------------------------------- | ---------------------------- |
| **Sankey**               | Flow         | Resource/budget flows between stages                        | Canvas paths + bezier curves |
| **Chord**                | Relationship | Bidirectional flows between entities (migration, trade)     | Canvas arcs + ribbons        |
| **Streamgraph**          | Trend        | Stacked time-series with organic aesthetics                 | Canvas filled curves         |
| **Sunburst**             | Proportion   | Multi-level hierarchical composition                        | Canvas arcs (nested rings)   |
| **Parallel Coordinates** | Relationship | Comparing entities across many dimensions simultaneously    | Canvas polylines             |
| **Beeswarm**             | Distribution | Individual data points without overlap (better than jitter) | Canvas circle packing        |
| **Ridgeline**            | Distribution | Comparing distributions across categories (joy plot)        | Canvas filled density curves |
| **Waffle**               | Proportion   | Precise percentage visualization (each cell = 1%)           | Canvas grid cells            |
| **Network Graph**        | Relationship | Connections and clusters between entities                   | Canvas force simulation      |
| **Violin**               | Distribution | Distribution shape + density + median simultaneously        | Canvas mirrored density      |

**Key Implementation Pattern**: All 10 use raw `<canvas>` 2D context -- no Chart.js. This proves:
- Custom rendering is viable for the `dashboard-scaffold.cjs` muscle
- Advanced charts can be self-contained (no D3.js dependency needed)
- Canvas-based charts pair well with Chart.js charts in the same dashboard

### Combined Chart Type Catalog (24 Types)

Merging all three references into a unified selection matrix:

```
What are you showing?
├── Comparison (5 types)
│   ├── Among items ──────────► Bar / Horizontal Bar
│   ├── Multiple series ──────► Grouped Bar / Stacked Bar
│   └── Multi-dimensional ────► Radar
├── Trend (3 types)
│   ├── Continuous ───────────► Line
│   ├── Volume over time ─────► Area (stacked)
│   └── Organic evolution ────► Streamgraph
├── Distribution (4 types)
│   ├── Single variable ──────► Histogram / Beeswarm
│   ├── Across categories ────► Violin / Ridgeline
│   └── Shape comparison ─────► Box plot (implied)
├── Relationship (4 types)
│   ├── Two variables ────────► Scatter
│   ├── Three variables ──────► Bubble
│   ├── Many dimensions ──────► Parallel Coordinates
│   └── Connections ──────────► Network Graph / Chord
├── Proportion (4 types)
│   ├── Few categories ───────► Pie / Donut
│   ├── Many categories ──────► Treemap / Waffle
│   └── Hierarchical ─────────► Sunburst
├── Flow (1 type)
│   └── Stage-to-stage ───────► Sankey
└── Pattern (1 type)
    └── Two-dimensional grid ─► Heatmap
```

## Data Sources & Ingestion

The suite must handle data from wherever it lives -- public APIs, local files, or cloud databases. The ingestion layer normalizes everything into a common in-memory format before analysis begins.

### Supported Source Types

| Source        | Format            | Ingestion Method                | Notes                                               |
| ------------- | ----------------- | ------------------------------- | --------------------------------------------------- |
| **CSV**       | `.csv`            | `fs.readFileSync` + parse       | Most common; detect delimiter, encoding, header row |
| **Excel**     | `.xlsx`, `.xls`   | `xlsx` npm package (SheetJS)    | Sheet selection, named ranges, multi-sheet support  |
| **JSON**      | `.json`, `.jsonl` | `JSON.parse` / line-delimited   | Nested objects need flattening step                 |
| **Azure SQL** | Connection string | `tedious` or `mssql` npm        | Parameterized queries only (injection prevention)   |
| **SQLite**    | `.db`, `.sqlite`  | `better-sqlite3`                | Local analytical databases                          |
| **Parquet**   | `.parquet`        | `parquet-wasm` or Python bridge | Columnar format from Spark/Fabric pipelines         |
| **Clipboard** | Paste             | Tab-delimited parse             | Quick ad-hoc from Excel/browser tables              |
| **URL**       | HTTP GET          | `fetch` + format detection      | Public APIs, hosted CSV/JSON                        |

### Public Data Sources (Discovery)

| Source                 | URL                  | Data Types                            | Access                     |
| ---------------------- | -------------------- | ------------------------------------- | -------------------------- |
| **U.S. Census Bureau** | data.census.gov      | Population, demographics, economics   | Free API (key required)    |
| **Kaggle**             | kaggle.com/datasets  | 300K+ datasets, all domains           | Free account, `kaggle` CLI |
| **Data.gov**           | data.gov             | US government open data               | Free, REST/CSV             |
| **World Bank**         | data.worldbank.org   | Global development indicators         | Free API                   |
| **OECD**               | data.oecd.org        | Economic, social, environmental stats | Free API                   |
| **BLS**                | bls.gov/data         | Employment, wages, CPI, inflation     | Free API                   |
| **FRED**               | fred.stlouisfed.org  | Economic time series (10K+ series)    | Free API (key required)    |
| **WHO**                | who.int/data         | Global health statistics              | Free CSV/API               |
| **SEC EDGAR**          | sec.gov/edgar        | Company filings, financials           | Free                       |
| **GitHub**             | github.com (various) | Curated datasets in repos             | Free                       |

### Ingestion Pipeline

```
Source (any format)
  │
  ▼
data-ingest.cjs
  ├── Detect format (extension, content sniffing, MIME type)
  ├── Parse to row/column arrays
  ├── Infer column types (string, number, date, boolean)
  ├── Handle encoding (UTF-8, Latin-1, auto-detect)
  ├── Normalize nulls (empty string, "NA", "null", "N/A" → null)
  └── Output: { columns: [...], rows: [...], metadata: { source, rowCount, parseWarnings } }
  │
  ▼
data-profile.cjs (profiling)
  │
  ▼
Analysis / Visualization / Dashboard
```

### Ingestion Rules

1. **Never trust user input** -- parameterized queries for SQL, validate URLs against allowlists
2. **Size guard** -- warn if >100K rows in browser context; suggest server-side or sampling
3. **Encoding detection** -- try UTF-8 first, fall back to Latin-1, log if ambiguous
4. **Date parsing** -- ISO 8601 preferred; detect common formats (MM/DD/YYYY, DD-Mon-YY) with explicit locale
5. **Column name cleanup** -- trim whitespace, lowercase, replace spaces with underscores
6. **Preview before commit** -- show first 5 rows + profile before full analysis

## Trifecta 1: Data Analysis

| Component       | Name                            | Purpose                                                                                                           |
| --------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Skill**       | `data-analysis/SKILL.md`        | EDA patterns, statistical methods, pandas/PySpark/SQL idioms, insight extraction, "what's interesting?" framework |
| **Instruction** | `data-analysis.instructions.md` | Auto-loaded procedure: profile first, check distributions, identify outliers, formulate hypotheses, validate      |
| **Prompt**      | `analyze.prompt.md`             | `/analyze` -- guided EDA: user provides dataset, Alex walks through systematic discovery                          |

### Skill Modules

| Module                    | Content                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| Data Ingestion Patterns   | Source detection, format parsing, type inference, encoding, cleanup |
| Descriptive Statistics    | Central tendency, spread, shape -- what to compute first            |
| Distribution Analysis     | Histograms, QQ-plots, normality tests, skew/kurtosis rules of thumb |
| Correlation & Causation   | Correlation matrix, scatter grid, Simpson's paradox awareness       |
| Segmentation              | Group-by patterns, cohort analysis, RFM, percentile bucketing       |
| Time-Series Decomposition | Trend, seasonality, residual -- STL, rolling averages               |
| Anomaly Detection         | Z-score, IQR fencing, isolation forest heuristics                   |
| "So What?" Translation    | Converting statistical findings into business-language insights     |

### Instruction Procedure (Auto-Loaded)

```
1. Profile: shape, dtypes, nulls, cardinality, memory
2. Univariate: distributions for every numeric column
3. Bivariate: correlation matrix, top pairs
4. Segments: identify natural groupings
5. Outliers: flag + document (don't auto-remove)
6. Hypotheses: state 2-3 testable claims
7. Validate: test claims against data
8. Narrate: "So what?" for each finding
```

### Prompt Workflow (`/analyze`)

```
User provides:
  - Data source: file path, URL, pasted table, SQL connection, or "fetch from [public source]"
  - Context: what domain, what question, who is the audience

Alex produces:
  1. Ingestion summary (source, format, rows, columns, warnings)
  2. Data profile (types, nulls, cardinality, distributions)
  3. Key distributions (notable shapes)
  4. Top correlations
  5. Anomalies
  6. 3-5 insights phrased as narrative statements, each tagged with:
     - Story intent (compare, trend, deviation, part-to-whole, etc.)
     - Why this intent fits ("population varies 65x across states -- compare intent")
     - Recommended chart type + alternative
  7. Suggested narrative arc: which insight leads, which supports, which concludes
```

## Trifecta 2: Data Visualization

| Component       | Name                                 | Purpose                                                                                                      |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Skill**       | `data-visualization/SKILL.md`        | Chart selection matrix, color theory, annotation patterns, decluttering rules, "title = insight" principle   |
| **Instruction** | `data-visualization.instructions.md` | Auto-loaded when generating charts: choose type by data shape, apply palette, highlight insight, remove junk |
| **Prompt**      | `visualize.prompt.md`                | `/visualize` -- describe data + message, Alex recommends chart type and generates code                       |

### Skill Modules

| Module                              | Content                                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Story-Intent Chart Selection Matrix | Story intent (what you want to say) --> chart type, with data shape as secondary filter                  |
| Narrative Chart Pairing             | Selecting complementary chart pairs that reinforce the same insight from different angles                |
| Color Theory                        | Colorblind-safe palettes (8 vetted sets), semantic color rules, sequential vs. diverging vs. categorical |
| Decluttering                        | Tufte's data-ink ratio, gridline removal, direct labeling vs. legends, white space as design element     |
| Annotation Hierarchy                | Title = takeaway, subtitle = context, callouts = exceptions, footnotes = caveats                         |
| Small Multiples                     | When and how to use faceted views instead of overloaded single charts                                    |
| Accessibility                       | Alt text for charts, patterns not just color, WCAG contrast ratios, screen reader hints                  |
| Tool Targets                        | Chart.js (HTML), Matplotlib/Plotly (Python), Mermaid (Markdown), Power BI (DAX measures)                 |
| Advanced Canvas Charts              | Sankey, Chord, Streamgraph, Sunburst, Parallel Coordinates, Beeswarm, Ridgeline, Waffle, Network, Violin |

### Story-Intent Chart Selection (24 Types)

The primary axis for chart selection is **what story the user wants to tell**, not the raw data shape. Data shape is a secondary constraint that narrows the options within a story intent.

**Step 1 -- Identify Story Intent**

| Story Intent         | Question Being Answered                           | Primary Charts                              | Advanced Charts                       |
| -------------------- | ------------------------------------------------- | ------------------------------------------- | ------------------------------------- |
| **Compare**          | "How do these items rank or differ?"              | Bar, Horizontal Bar, Grouped Bar, Radar     | Beeswarm, Parallel Coordinates        |
| **Change Over Time** | "How has this evolved?"                           | Line, Area, Stacked Area                    | Streamgraph, Ridgeline                |
| **Part-to-Whole**    | "What share does each segment hold?"              | Donut, Stacked Bar, Pie                     | Waffle, Sunburst                      |
| **Distribution**     | "How is this spread? What's normal vs. outlier?"  | Histogram, Scatter                          | Violin, Beeswarm, Ridgeline           |
| **Relationship**     | "How are these variables connected?"              | Scatter, Bubble                             | Chord, Network Graph, Parallel Coords |
| **Flow / Process**   | "Where does it go? What are the paths?"           | Horizontal Bar (stages)                     | Sankey, Chord                         |
| **Hierarchy**        | "How is this organized in levels?"                | Treemap                                     | Sunburst                              |
| **Spatial Pattern**  | "Where are the concentrations?"                   | Heatmap                                     | Network Graph                         |
| **Deviation**        | "What deviates from the baseline or expectation?" | Bar (diverging), Line (with reference line) | Beeswarm                              |

**Step 2 -- Narrow by Data Shape**

| Data Shape                  | Compatible Story Intents             | Ruled Out                           |
| --------------------------- | ------------------------------------ | ----------------------------------- |
| Categorical + numeric       | Compare, Part-to-Whole, Distribution | Flow (unless sequential categories) |
| Two numeric variables       | Relationship, Distribution           | Part-to-Whole                       |
| Time series                 | Change Over Time, Deviation          | Hierarchy                           |
| Network / adjacency         | Relationship, Flow                   | Part-to-Whole, Change Over Time     |
| Hierarchical (parent-child) | Hierarchy, Part-to-Whole             | Change Over Time, Distribution      |
| Flow matrix (source-target) | Flow, Relationship                   | Compare (use grouped bar instead)   |

**Step 3 -- Audience & Context Filter**

| Choose Standard When                   | Choose Advanced When                             |
| -------------------------------------- | ------------------------------------------------ |
| Audience expects familiar chart shapes | Data has complex relationships (flows, networks) |
| Tooltip interactivity is critical      | Distribution shape matters more than values      |
| Chart.js handles the data shape well   | Hierarchical structure needs multi-level view    |
| Dashboard has 3+ charts (consistency)  | Single hero visualization to anchor a story      |
| Executive audience (30s scan)          | Analyst audience (exploration expected)          |

### Instruction Procedure (Auto-Loaded)

```
1. Ask: what story does the user want to tell? (compare, trend, part-to-whole, flow, etc.)
2. Map story intent to chart candidates (Step 1 table above)
3. Narrow by data shape (Step 2 table above)
4. Filter by audience and context (Step 3 table above)
5. If multiple options remain: pick the simplest that conveys the message
6. Map data to visual encodings: position, length, color, size
7. Title = insight: write the takeaway as the chart title, NOT a label
8. Remove junk: 3D effects, unnecessary gridlines, redundant legends
9. Add annotation: callout the key data point that proves the story
10. Apply palette: colorblind-safe, semantic where applicable
11. Test: does a 3-second glance convey the intended story?
12. If not -- wrong chart type. Go back to step 2.
```

### Prompt Workflow (`/visualize`)

```
User provides:
  - Data (inline, file, or from prior /analyze)
  - Story intent: what point to make? (compare, trend, deviation, flow, etc.)
  - Audience: who will see this? (executive, analyst, general)
  - Optional: preferred chart type, color scheme, specific highlight

Alex produces:
  1. Identified story intent (confirmed or inferred from user phrasing)
  2. Recommended chart type with rationale ("bar chart because you're comparing 50 items")
  3. Alternative chart option ("also consider horizontal bar for long labels")
  4. Chart code (Chart.js or Canvas) with:
     - Title written as insight ("California leads with 39M residents")
     - Semantic color encoding
     - Key data point annotated
     - Decluttered (no default gridlines, direct labels where possible)
  5. If story intent was ambiguous: 2-3 options showing same data through different lenses
```

## Trifecta 3: Dashboard Design

| Component       | Name                               | Purpose                                                                                            |
| --------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Skill**       | `dashboard-design/SKILL.md`        | Layout patterns, KPI card design, filter architecture, narrative flow through panels               |
| **Instruction** | `dashboard-design.instructions.md` | Procedure: define audience --> pick KPIs --> arrange panels --> add drill paths --> validate story |
| **Prompt**      | `dashboard.prompt.md`              | `/dashboard` -- describe audience + metrics, Alex designs layout with component specs              |

### Skill Modules

| Module                 | Content                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Layout Patterns        | Inverted pyramid, Z-pattern, F-pattern, hub-and-spoke; when to use each                           |
| KPI Card Design        | Metric + delta + sparkline pattern, color thresholds (green/amber/red), icon usage                |
| Filter Architecture    | Global filters (top), panel filters (inline), drill-through vs. drill-down vs. cross-filter       |
| Narrative Flow         | Reading order = story order; KPIs answer "what?", charts answer "why?", tables answer "how much?" |
| Progressive Disclosure | Above-the-fold = KPIs + hero chart; below-the-fold = supporting detail; modal = drill-down        |
| Self-Contained HTML    | Reference pattern from population.html: embedded data, CDN deps, CSS variables, responsive grid   |
| Platform Targets       | HTML (Chart.js + Canvas), Power BI, Streamlit, React + Recharts                                   |
| Card-Grid Pattern      | From visuals.html: filterable card grid with mini previews, modal drill-down, category badges     |
| Advanced Viz Embedding | From adv_visuals.html: canvas-rendered charts alongside Chart.js in same dashboard                |

### Dashboard Anatomy (from Reference)

```
┌──────────────────────────────────────────────────┐
│ HEADER: Title + subtitle + badge                 │
├──────────────────────────────────────────────────┤
│ KPI ROW: 5 cards (auto-fit grid)                 │
├──────────────────────────────────────────────────┤
│ CONTROLS: Search + region filter buttons         │
├──────────────────────────────────────────────────┤
│ HERO CHART: Full-width bar (clickable)           │
├───────────────────────┬──────────────────────────┤
│ SUPPORTING CHART 1    │ SUPPORTING CHART 2       │
│ (donut)               │ (size buckets)           │
├───────────────────────┴──────────────────────────┤
│ DATA TABLE: Sortable, ranked, with inline bars   │
├──────────────────────────────────────────────────┤
│ FOOTER: Data source + attribution                │
└──────────────────────────────────────────────────┘

         ┌─ DRILL-DOWN MODAL ─┐
         │ State stats grid    │
         │ Horizontal bar      │
         │ City detail table   │
         └─────────────────────┘
```

### Instruction Procedure (Auto-Loaded)

```
1. Define audience: who looks at this and what decisions do they make?
2. Identify KPIs: 3-6 headline numbers (the "so what?" of the data)
3. Choose hero chart: the single most important visual
4. Add supporting views: different lenses on same data
5. Design drill path: what happens when they click?
6. Build filter set: global filters + contextual controls
7. Wire interactions: filter --> chart --> table --> drill-down
8. Apply theme: dark/light, semantic colors, responsive breakpoints
9. Embed data: self-contained, no external API dependency
10. Validate narrative: read top-to-bottom -- does it tell a story?
```

## Trifecta 4: Data Storytelling (Orchestrator)

| Component       | Name                                | Purpose                                                                                       |
| --------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| **Skill**       | `data-storytelling/SKILL.md`        | Three-act structure, audience-first arcs, Knaflic/Duarte methodology, annotation as narration |
| **Instruction** | `data-storytelling.instructions.md` | Orchestration: when to invoke analysis vs. viz vs. dashboard, narrative coherence checks      |
| **Prompt**      | `datastory.prompt.md`               | `/datastory` -- end-to-end: raw data + audience --> analysis + visuals + narrative            |

### Skill Modules

| Module                      | Content                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Three-Act Data Structure    | Setup (context), Conflict (the problem/surprise), Resolution (insight/recommendation)            |
| Audience-First Framing      | Executive (30s), Manager (2min), Analyst (deep), General (accessible)                            |
| Knaflic Method              | "Storytelling with Data": context, choose visual, eliminate clutter, focus attention, tell story |
| Duarte Contrast             | "What is" vs. "What could be" -- tension drives engagement                                       |
| Big Idea Worksheet          | One-sentence articulation: [subject] should [action] because [evidence]                          |
| Explanatory vs. Exploratory | Explanatory = you know the story, guide the viewer. Exploratory = let them discover.             |
| Storyboard Technique        | Sketch panels on paper before building -- sequence matters more than polish                      |
| Annotation as Narration     | Chart annotations carry the story; the chart is evidence, the annotation is argument             |

### Orchestration Flow

```
/datastory input: data source (file/URL/SQL/paste) + audience + question

Phase 0 -- Ingest (activates data-ingest.cjs)
  → Detect format, parse, normalize, type-infer
  → Output: clean columnar data + ingestion metadata

Phase 1 -- Discover (activates data-analysis)
  → Profile, segment, find anomalies, generate hypotheses
  → Output: 3-5 insight statements

Phase 2 -- Visualize (activates data-visualization)
  → For each insight, identify the story intent (compare? trend? deviation?)
  → Select chart type by story intent first, data shape second
  → Apply decluttering, annotation, semantic color
  → Title every chart as the insight, not the data label
  → Output: chart code/specs per insight (each carrying a clear narrative point)

Phase 3 -- Arrange (activates dashboard-design)
  → Choose layout pattern based on audience
  → Place KPIs, hero chart, supporting views
  → Wire drill-down paths
  → Output: dashboard scaffold

Phase 4 -- Narrate (data-storytelling core)
  → Write the three-act arc
  → Place annotations that carry the argument
  → Add titles-as-insights throughout
  → Validate: does the top-to-bottom read tell the story?
  → Output: self-contained HTML dashboard with narrative
```

## Trifecta 5: Chart Interpretation

| Component       | Name                                   | Purpose                                                                                            |
| --------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Skill**       | `chart-interpretation/SKILL.md`        | Read any chart (image, HTML, screenshot) and extract insights, patterns, anomalies, and narrative  |
| **Instruction** | `chart-interpretation.instructions.md` | Auto-loaded when user shares a chart: describe, quantify, contextualize, narrate                   |
| **Prompt**      | `interpret.prompt.md`                  | `/interpret` -- user provides chart image or HTML, Alex produces structured analysis and narrative |

This is the reverse of Trifectas 1-4: instead of data → chart, it's chart → insights → narrative.

### Skill Modules

| Module                      | Content                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Chart Type Recognition      | Identify chart type from visual: bar, line, scatter, pie, Sankey, etc. -- determines reading strategy |
| Visual Decoding             | Extract data from visual encodings: position → values, length → magnitude, color → categories         |
| Pattern Detection           | Trends, clusters, outliers, gaps, plateaus, inflection points -- what the eye should catch            |
| Annotation Reading          | Parse titles, subtitles, axis labels, legends, callouts -- the author's intended story                |
| Missing Context Inference   | What's NOT shown: missing baselines, truncated axes, cherry-picked time ranges, suppressed categories |
| Bias & Misleading Detection | Dual axes, non-zero baselines, area distortion, 3D perspective tricks, cherry-picked scales           |
| Narrative Extraction        | Convert visual observations into prose: "Sales peaked in Q3 at $4.2M before declining 18% in Q4"      |
| Comparative Interpretation  | When given multiple charts: identify connections, contradictions, and the composite story             |
| Audience-Adapted Output     | Executive (3 bullet summary), Analyst (detailed breakdown), Presenter (talking points with evidence)  |

### Instruction Procedure (Auto-Loaded)

```
1. Identify chart type and visual encoding scheme
2. Read structural elements: title, axes, legend, annotations, data source
3. Extract key data points: maximums, minimums, averages, notable values
4. Detect patterns: trend direction, clusters, outliers, periodicity
5. Check for misleading elements: truncated axes, dual scales, area distortion
6. Formulate 3-5 insight statements as narrative prose
7. Identify what's missing: context the chart doesn't provide
8. Rate confidence: high (clear data) / medium (some inference) / low (ambiguous visual)
9. Suggest follow-up: what additional data or views would strengthen the story?
```

### Prompt Workflow (`/interpret`)

```
User provides:
  - Chart: image (PNG/JPG/screenshot), HTML file, pasted SVG, or URL to a chart
  - Optional context: domain, audience, what decision depends on this chart
  - Optional question: "What does this chart tell us about X?"

Alex produces:
  1. Chart identification (type, encoding, data dimensions)
  2. Structural reading (title, axes, legend, source, time range)
  3. Data extraction (key values, ranges, totals -- as precise as visual allows)
  4. Pattern analysis:
     - Primary story: the main takeaway (1 sentence)
     - Supporting patterns: 2-4 secondary observations
     - Anomalies: anything unexpected or noteworthy
  5. Bias check: any misleading visual elements flagged
  6. Narrative output (audience-adapted):
     - Executive summary: 3 bullets, 30 seconds to read
     - Detailed analysis: paragraph-form with evidence citations
     - Talking points: presenter-ready notes with "say this" phrasing
  7. Suggested improvements: how this chart could tell its story better
  8. Follow-up questions: what data would deepen the analysis
```

### Example

```
User: /interpret [attaches bar chart of quarterly revenue]

Alex:
  Chart Type: Vertical bar chart, 8 bars (Q1 2024 - Q4 2025), Y-axis = revenue ($M)

  Primary Story: Revenue grew 34% year-over-year but growth is decelerating.

  Supporting Patterns:
  - Q3 2024 was the peak quarter ($4.2M) -- likely seasonal
  - Q4 quarters consistently underperform Q3 by 15-20%
  - 2025 baseline is higher but the Q3 2025 spike is smaller (+8% vs +22% in 2024)

  Anomaly: Q1 2025 shows a sharp jump (+31% vs Q1 2024) -- possible pricing change or acquisition?

  Bias Check: Y-axis starts at $2M, not $0 -- exaggerates visual differences by ~2x.

  Missing Context: No cost/margin data. Revenue growth without profitability context
  can be misleading.

  Suggestion: Add a reference line for target/budget to show performance vs. plan.
```

## Supporting Muscles

| Muscle                   | Language   | Purpose                                                                  | Inheritance |
| ------------------------ | ---------- | ------------------------------------------------------------------------ | ----------- |
| `data-ingest.cjs`        | JavaScript | Normalize any data source (CSV, XLSX, JSON, SQL, URL) into common format | inheritable |
| `dashboard-scaffold.cjs` | JavaScript | Generate self-contained HTML dashboard from data spec + narrative intent | inheritable |
| `data-profile.cjs`       | JavaScript | Quick data profiling: column types, nulls, distributions, cardinality    | inheritable |
| `chart-recommend.cjs`    | JavaScript | Given data shape + message intent, return chart type + config            | inheritable |

### `data-ingest.cjs` -- Universal Data Loader

The front door for all data. Detects format, parses, normalizes, and outputs a common structure.

```
Usage:
  node data-ingest.cjs --source <path|url|connection>
  node data-ingest.cjs --stdin              (piped/clipboard data)
  node data-ingest.cjs --sql <connection>   --query "SELECT ..."

Input formats:
  .csv, .tsv          → delimiter detection + streaming parse
  .xlsx, .xls         → SheetJS parse (--sheet <name|index>)
  .json, .jsonl       → JSON.parse / line-delimited
  .parquet            → parquet-wasm decode
  http(s)://...       → fetch + content-type detection
  mssql://...         → tedious parameterized query
  sqlite:///path.db   → better-sqlite3

Output (JSON to stdout):
  {
    "metadata": {
      "source": "kaggle-download.csv",
      "format": "csv",
      "encoding": "utf-8",
      "rowCount": 5000,
      "columnCount": 12,
      "parseWarnings": []
    },
    "columns": [
      { "name": "state", "type": "string", "nullCount": 0, "uniqueCount": 50 },
      { "name": "population", "type": "number", "nullCount": 2, "min": 584057, "max": 38965193 }
    ],
    "rows": [ ... ]   // first 10K rows (--limit to override)
  }

Security:
  - SQL: parameterized queries only, no string interpolation
  - URLs: fetch with timeout (30s), max response size (100MB)
  - Files: resolve to absolute path, reject path traversal
```

Dependencies (optional, installed on first use):

| Package          | Purpose                | Size          |
| ---------------- | ---------------------- | ------------- |
| `xlsx` (SheetJS) | Excel parsing          | ~2MB          |
| `mssql`          | Azure SQL / SQL Server | ~1MB          |
| `better-sqlite3` | Local SQLite           | ~8MB (native) |
| `parquet-wasm`   | Parquet files          | ~3MB          |

### `dashboard-scaffold.cjs` -- Core Muscle

Input: JSON spec describing the dashboard

```json
{
  "title": "US Population Dashboard",
  "subtitle": "2024 Census Bureau estimates",
  "theme": "dark",
  "data": { ... },
  "kpis": [
    { "label": "Total Population", "value": "~334M", "subtitle": "2024 estimate", "icon": "👥", "accent": "purple" }
  ],
  "filters": [
    { "type": "search", "placeholder": "Search states..." },
    { "type": "buttons", "field": "region", "values": ["All", "Northeast", "Midwest", "South", "West"] }
  ],
  "charts": [
    { "type": "bar", "field": "pop", "label": "state", "colorBy": "region", "drilldown": "cities", "fullWidth": true },
    { "type": "donut", "groupBy": "region", "aggregate": "sum", "field": "pop" },
    { "type": "bar", "buckets": [...], "field": "pop" }
  ],
  "table": {
    "columns": ["rank", "state", "region", "pop", "share", "cities"],
    "sortable": true,
    "clickAction": "drilldown"
  },
  "drilldown": {
    "type": "modal",
    "charts": [{ "type": "horizontalBar", "field": "pop", "label": "city" }],
    "table": { "columns": ["rank", "city", "pop", "share"] }
  }
}
```

Output: self-contained HTML file matching the reference pattern.

### `data-profile.cjs` -- Quick Profiler

```
Input:  Output from data-ingest.cjs (JSON) or direct file path (auto-ingests first)
Output: Profile report
  - Row count, column count, memory estimate
  - Per column: dtype, nulls, unique, min/max/mean/median/mode
  - Distribution shape: skew, kurtosis, histogram bins
  - Top correlations (numeric pairs above |0.5|)
  - Recommended segments (high-cardinality categorical columns)
  - Anomaly flags (Z-score > 3, IQR outliers)
  - Data quality score (0-100 based on nulls, type consistency, outlier ratio)
  - Suggested cleaning actions ("Column X has 12% nulls -- consider imputation")
```

### `chart-recommend.cjs` -- Chart Advisor

```
Input:  {
  storyIntent: "compare" | "trend" | "part-to-whole" | "distribution" | "relationship" | "flow" | "hierarchy" | "spatial" | "deviation",
  dataShape: "categorical-vs-numeric" | "two-numeric" | "time-series" | "network" | "hierarchical" | "flow-matrix",
  columns: [ { name, type, uniqueCount } ],
  audience: "executive" | "manager" | "analyst" | "general",
  message: "free text -- the point to make"  (optional, used to infer storyIntent if not explicit)
}

Output: {
  primary:     { chartType, config, rationale },
  alternative: { chartType, config, rationale },
  storyIntentUsed: "compare",
  inferenceNote: "User said 'rank states by population' -- inferred compare intent"
}

Example:
  Input:  { storyIntent: "compare", dataShape: "categorical-vs-numeric", columns: [{name:"state", type:"string", uniqueCount:50}, {name:"population", type:"number"}], audience: "executive" }
  Output: {
    primary:     { chartType: "horizontalBar", sortBy: "value-desc", limit: 10, rationale: "Horizontal bar for executive compare of 50 items -- top 10 focus reduces cognitive load" },
    alternative: { chartType: "bar", sortBy: "value-desc", rationale: "Vertical bar if space allows all 50" },
    storyIntentUsed: "compare"
  }

Story-Intent Resolution:
  1. Explicit storyIntent field -- use directly
  2. Infer from message text: "rank" → compare, "over time" → trend, "share" → part-to-whole,
     "spread" → distribution, "connect" → relationship, "flows to" → flow
  3. Fall back to data shape default: time-series → trend, categorical → compare, two-numeric → relationship
  4. If still ambiguous: return 2-3 options with different intents, let user pick
```

## Synapse Network

```
data-storytelling (orchestrator)
    ├── activates → data-analysis
    ├── activates → data-visualization
    ├── activates → dashboard-design
    ├── activates → chart-interpretation (reverse flow)
    ├── complements → executive-storytelling (narrative framing)
    └── complements → slide-design (presentation output)

data-analysis
    ├── feeds → data-visualization (insights become charts)
    ├── feeds → data-storytelling (findings become narrative)
    ├── uses → data-quality-monitoring (clean data first)
    └── complements → microsoft-fabric (platform patterns)

data-visualization
    ├── feeds → dashboard-design (charts populate panels)
    ├── feeds → chart-interpretation (viz knowledge aids reading)
    ├── feeds → pptx-generation (charts in slides)
    ├── complements → slide-design (visual principles)
    └── complements → graphic-design (color/typography)

chart-interpretation (reverse flow)
    ├── feeds → data-storytelling (extracted insights become narrative)
    ├── feeds → data-analysis (re-analyze based on chart observations)
    ├── uses → data-visualization (chart type knowledge aids decoding)
    └── complements → code-review (visual review of data presentations)

dashboard-design
    ├── uses → data-visualization (panel content)
    ├── complements → ui-ux-design (layout/accessibility)
    └── complements → react-vite-performance (web dashboards)
```

## Build Sequence

| Phase  | Deliverable                                                      | Dependencies                | Output                                          |
| ------ | ---------------------------------------------------------------- | --------------------------- | ----------------------------------------------- |
| **1**  | `data-visualization` trifecta                                    | None -- foundational        | SKILL.md + instruction + prompt + synapses.json |
| **2**  | `data-analysis` trifecta                                         | Needs viz for output recs   | SKILL.md + instruction + prompt + synapses.json |
| **3**  | `dashboard-design` trifecta                                      | Needs viz for panel content | SKILL.md + instruction + prompt + synapses.json |
| **4**  | `data-storytelling` trifecta                                     | Orchestrates all four       | SKILL.md + instruction + prompt + synapses.json |
| **5**  | `chart-interpretation` trifecta                                  | Needs viz knowledge         | SKILL.md + instruction + prompt + synapses.json |
| **6**  | `data-ingest.cjs` muscle                                         | None -- foundational        | Muscle script + format parsers                  |
| **7**  | `dashboard-scaffold.cjs` muscle                                  | All trifectas inform spec   | Muscle script + shared module                   |
| **8**  | `data-profile.cjs` muscle                                        | Ingest muscle feeds it      | Muscle script                                   |
| **9**  | `chart-recommend.cjs` muscle                                     | Viz trifecta informs        | Muscle script                                   |
| **10** | Wiring -- synapse connections, catalog updates, activation index | All above complete          | Updated catalogs                                |

## Registration Checklist (Per Trifecta)

- [ ] `SKILL.md` created in `.github/skills/{name}/`
- [ ] `synapses.json` created with 3-5 connections
- [ ] `.instructions.md` created in `.github/instructions/`
- [ ] `.prompt.md` created in `.github/prompts/`
- [ ] Memory-activation index updated in `memory-activation/SKILL.md`
- [ ] SKILLS-CATALOG.md updated
- [ ] TRIFECTA-CATALOG.md updated
- [ ] copilot-instructions.md trifecta count bumped

## Open Decisions

| #   | Question                                                 | Options                                     | Default                                                         |
| --- | -------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| 1   | Primary chart library                                    | Chart.js (reference), Plotly, D3, Mermaid   | Chart.js + raw canvas (matches all 3 references)                |
| 2   | Python output targets                                    | Matplotlib, Plotly, Seaborn                 | Plotly (interactive, web-native)                                |
| 3   | Dashboard platform priority                              | HTML-first, Power BI-first, Streamlit-first | HTML-first (self-contained, zero-config)                        |
| 4   | Storytelling methodology                                 | Knaflic, Duarte, Tufte, hybrid              | Hybrid (Knaflic structure + Tufte aesthetics)                   |
| 5   | `dashboard-scaffold.cjs` -- JSON spec or Markdown input? | JSON (precise), Markdown (natural), both    | JSON spec with Markdown description support                     |
| 6   | Advanced chart rendering                                 | Canvas-only, D3.js, Observable Plot         | Canvas-only (proven in adv_visuals.html, zero extra dependency) |
| 7   | Chart guide output                                       | Embed in skill, separate HTML, both         | Embed decision tree in skill; HTML guide as reference artifact  |
| 8   | SQL dependency model                                     | Always bundled, optional-install, bridge    | Optional-install (mssql on first use, keep core zero-dep)       |
| 9   | Large dataset strategy                                   | Stream, sample, paginate, reject            | Sample + warn (preview 10K rows, full export on confirm)        |
| 10  | Public API auth management                               | .env keys, VS Code secrets, interactive     | .env file for API keys (Census, Kaggle), document in skill      |

## Success Criteria

- [ ] All 5 trifectas pass the Why Test (user-facing, domain-rich, auto-loadable)
- [ ] `/datastory` prompt produces a self-contained HTML dashboard from raw data
- [ ] `/visualize` correctly selects chart type for 9 story intents x data shape combinations
- [ ] `/visualize` explains WHY it chose a chart ("bar because you're comparing", not just "bar")
- [ ] `/dashboard` generates a layout spec matching the reference pattern
- [ ] `/analyze` produces "so what?" insight statements, not just statistics
- [ ] `data-ingest.cjs` successfully parses CSV, XLSX, JSON, and Azure SQL sources
- [ ] `/interpret` extracts accurate insights from chart images and flags misleading visuals
- [ ] `/interpret` output adapts to audience (executive bullets vs. analyst detail vs. talking points)
- [ ] All synapses wired bidirectionally
- [ ] brain-qa passes with 0 broken connections

### VT BIT 5424 Validation

- [ ] `/analyze` produces meaningful output from CloudRevenue CSV (50K rows, 3 tables)
- [ ] `/visualize` generates chart for M365Marketing campaign ROI with correct story intent (compare)
- [ ] `/dashboard` generates 5-Visual Rule executive layout from SupportInsights data
- [ ] `/datastory` produces end-to-end HTML dashboard from Starbucks Kaggle store locations CSV
- [ ] `/interpret` accurately reads a Power BI-generated chart screenshot and identifies storytelling gaps
- [ ] `data-ingest.cjs` handles all VT dataset formats (CSV star schema with multi-table joins)
- [ ] Chart selection aligns with Kirk ch. 6 taxonomy and Knaflic ch. 2-3 framework
- [ ] Generated narratives follow DIKW pyramid (data → information → knowledge → wisdom)
- [ ] Course assistant knowledge docs (CHARTING-GUIDE.md, DATA-ANALYSIS-GUIDE.md) are consistent with trifecta skill content
