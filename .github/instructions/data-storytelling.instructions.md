---
description: "End-to-end data story orchestration: ingest, analyze, visualize, arrange, and narrate"
application: "When analyzing data, building visualizations, or creating reports"
applyTo: "**/*story*,**/*narrative*,**/*datastory*"
---

# Data Storytelling Procedure

Deep reference: `.github/skills/data-storytelling/SKILL.md`

## When This Activates

This procedure auto-loads when:
- User asks to tell a data story, build a narrative from data, or create an end-to-end data artifact
- The `/datastory` prompt is invoked
- A file matching `*story*`, `*narrative*`, `*datastory*` is being edited

## Orchestration Procedure

### Phase 0: Context & Ingest

1. **Identify audience**: executive (30s), manager (2min), analyst (deep), general (1min)
2. **Ingest data**: parse source → detect format → normalize → type-infer
3. **Write Big Idea draft**: "[Audience] should [action] because [evidence]" -- refine after analysis

### Phase 1: Discover (invoke data-analysis)

1. Profile the dataset (shape, types, nulls, quality score)
2. Explore distributions, correlations, segments
3. Detect anomalies (flag, don't remove)
4. Generate 3-5 insight statements, each tagged with:
   - Story intent (compare, trend, deviation, etc.)
   - "So what?" business implication
   - Recommended chart type

### Phase 2: Visualize (invoke data-visualization)

For each insight statement:
1. Match story intent → chart type candidates
2. Narrow by data shape and audience
3. Generate chart with:
   - Title = insight sentence
   - Decluttered (no gridline noise, direct labels)
   - Semantic color encoding
   - Key data point annotated

### Phase 3: Arrange (invoke dashboard-design)

1. Choose layout pattern by audience (inverted pyramid for exec, narrative scroll for general)
2. Place KPI cards (3-6 headline stats)
3. Position hero chart (the Conflict of the story)
4. Add supporting charts (evidence for Resolution)
5. Include data table for detail on demand
6. Wire interactions: filters → charts → table → drill-down

### Phase 4: Narrate (core storytelling)

1. **Apply three-act structure**:
   - Setup: KPIs establish the baseline
   - Conflict: Hero chart reveals the surprise
   - Resolution: Supporting charts + annotation deliver the insight

2. **Write annotations as narration**:
   - Chart titles are insight sentences
   - Callouts highlight the proof points
   - Captions add nuance
   - Source attribution on every visual

3. **Finalize Big Idea**: Refine the one-sentence summary based on completed analysis

4. **Quality checks**:
   - Three-act present? (Setup → Conflict → Resolution)
   - Titles are insights, not labels?
   - Color consistent across all charts?
   - 3-second test passes on every visual?
   - Recommendation included? (not just observation)

## Output Format

Self-contained HTML file:
- Embedded data (no external API calls)
- Chart.js 4.x via CDN
- CSS custom properties for theming
- Responsive grid layout
- Print-friendly styles
- Annotations woven into the visual flow

## Routing

- Data profiling and insight extraction → `data-analysis` instruction
- Chart type selection and generation → `data-visualization` instruction
- Dashboard layout and interaction design → `dashboard-design` instruction
- Reading an existing chart for insights → `chart-interpretation` instruction
- Presentation output → `gamma-presentations` or `slide-design` skill
