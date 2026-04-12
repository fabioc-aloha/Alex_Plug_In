---
description: "Auto-loaded for data analysis: profile first, explore distributions, find patterns, translate to narrative insights"
applyTo: "**/*analy*,**/*eda*,**/*profile*,**/*statistic*"
---

# Data Analysis Procedure

EDA module catalog, DIKW translation patterns → load `data-analysis` skill.

## Procedure

### Step 1: Ingest & Profile

Before any analysis, establish what you're working with.

1. Identify data source (file path, URL, pasted table, SQL connection)
2. Parse into rows and columns -- detect format, encoding, delimiters
3. Compute profile: row count, column count, types, nulls, cardinality, duplicates
4. Report data quality score (completeness, consistency, uniqueness)
5. Show first 5 rows as sanity check

### Step 2: Univariate Exploration

For every numeric column:
1. Compute: mean, median, std, min, max, P25, P50, P75
2. Check: if `|mean - median| / median > 0.1`, distribution is skewed -- report median as "typical"
3. Assess shape: normal, skewed, bimodal, uniform, power-law
4. Flag anomalies: Z-score > 3 or IQR outliers

For every categorical column:
1. Count unique values and top 5 by frequency
2. Check for near-unique columns (likely IDs -- skip in analysis)
3. Flag low-cardinality columns as potential segmentation axes

### Step 3: Bivariate Exploration

1. Compute correlation matrix for all numeric pairs
2. Surface top correlations (|r| > 0.5) with strength labels
3. For strong correlations: check for Simpson's Paradox by segmenting on top categorical variable
4. Generate scatter plot recommendations for top 3 pairs

### Step 4: Segmentation

1. Identify natural groupings from categorical columns
2. Compute group-by aggregates for the most interesting numeric columns
3. Look for segments that behave differently than the overall average
4. Answer: "If I could only act on ONE segment, which one and why?"

### Step 5: Anomaly Investigation

1. Flag outliers (Z-score > 3 or IQR fence)
2. For each outlier, classify: data error, real outlier, or different population
3. **Never auto-remove** -- document the decision
4. Report: "{N} anomalies found in {column} -- {classification}"

### Step 6: Time-Series (if applicable)

If any date/time column exists:
1. Sort by time, check for gaps
2. Compute rolling average (window = 1 period)
3. Identify trend direction and inflection points
4. Check for seasonality (autocorrelation at lag = period)

### Step 7: Hypothesize & Validate

1. State 2-3 testable hypotheses based on patterns observed
2. Test each against the data (filter, cross-tab, correlate)
3. Mark each: supported, refuted, or inconclusive
4. Write the finding as a narrative insight

### Step 8: "So What?" Translation

For each finding, produce an insight statement:

```
[WHAT]: {metric} is {value/behavior}
[SO WHAT]: This means {business implication}
[NOW WHAT]: Consider {action or follow-up question}
[STORY INTENT]: {compare|trend|deviation|distribution|relationship|part-to-whole|flow|hierarchy|spatial}
[CHART]: {recommended chart type} because {rationale}
```

### Step 9: Narrative Arc

Arrange the insights into a suggested story:
1. **Lead** with the most surprising or impactful finding
2. **Support** with 2-3 findings that provide evidence or context
3. **Conclude** with the "now what?" -- recommendation or next question
4. Tag each insight with its story intent so visualization can pick the right chart

## Anti-Patterns

| Anti-Pattern              | Why It Fails                           | Do This Instead                    |
| ------------------------- | -------------------------------------- | ---------------------------------- |
| Report statistics only    | No business meaning                    | Always add "so what?"              |
| Assume correlation=cause  | Misleading conclusions                 | Say "correlates with", check confounders |
| Skip the profile          | You'll misinterpret dirty data         | Profile first, always              |
| Auto-remove outliers      | You lose real signal                   | Flag, investigate, document        |
| Average everything        | Hides variation and sub-populations    | Show distributions, segment first  |
| Skip the hypothesis step  | Analysis without direction is wandering | State claims, test them            |

## Routing

- Chart generation from insights → `data-visualization` instruction
- Dashboard layout from KPIs/segments → `dashboard-design` instruction
- Narrative arc construction → `data-storytelling` instruction
- Reading an existing chart → `chart-interpretation` instruction
- Data ingestion mechanics → load `data-ingest.cjs` muscle
