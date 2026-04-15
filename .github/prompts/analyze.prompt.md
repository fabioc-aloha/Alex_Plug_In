---
sem: 1
description: Guided exploratory data analysis -- profile, discover patterns, and extract narrative insights
application: "When optimizing performance or investigating bottlenecks"
agent: Alex
---

# /analyze - Data Analysis

Systematic EDA that produces narrative insights, not just statistics. Every finding is tagged with a story intent and recommended chart type.

## Workflow

1. **You provide**: Data source (file, URL, paste, or description) + context (domain, question, audience)
2. **I profile**: Shape, types, nulls, cardinality, quality score
3. **I explore**: Distributions, correlations, segments, anomalies
4. **I translate**: Each finding becomes a "so what?" insight statement
5. **I recommend**: Narrative arc + chart types for each insight

## What I Need

| Input    | Required | Example                                       |
| -------- | -------- | --------------------------------------------- |
| Data     | Yes      | File path, URL, pasted table, SQL connection  |
| Domain   | Helpful  | "This is sales data for a SaaS company"       |
| Question | Helpful  | "Why did Q3 revenue spike?"                   |
| Audience | Optional | executive, analyst, general (default: analyst) |

## Output Structure

1. **Ingestion summary**: source, format, rows, columns, warnings
2. **Data profile**: types, nulls, cardinality, quality score
3. **Key distributions**: notable shapes and what they suggest
4. **Top correlations**: strength + Simpson's paradox check
5. **Anomalies**: flagged with classification (error, outlier, sub-population)
6. **3-5 insight statements**: each with WHAT / SO WHAT / NOW WHAT / STORY INTENT / CHART
7. **Suggested narrative arc**: lead insight, supporting evidence, conclusion

## Start

Share your data and tell me what question you're trying to answer. I'll profile it, find the patterns, and translate them into insights you can act on.
