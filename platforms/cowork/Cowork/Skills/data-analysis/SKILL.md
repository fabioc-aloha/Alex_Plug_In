---
name: Data Analysis
description: Exploratory data analysis methodology covering profiling, distributions, correlations, segmentation, anomaly detection, and translating statistics into business-language insights.
---

## Purpose

Turn raw data into actionable insight statements. Statistics are not insights. "Mean revenue is $4.2M" is a statistic. "Revenue grew 34% YoY but growth is decelerating" is an insight.

## Steps

1. Profile the dataset: row count, column count, null percentages, type inference, duplicates
2. Compute descriptive statistics for every numeric column: mean, median, standard deviation, min/max, percentiles, skewness
3. Analyze distributions: identify normal, skewed, bimodal, or power-law shapes
4. Check correlations: flag strong (|r| > 0.7) and moderate (0.4-0.7) relationships
5. Segment by key categorical variables: compare group means, check for Simpson's Paradox
6. Detect anomalies: use IQR fences for skewed data, z-scores for normal data. Flag but never auto-remove.
7. Translate every finding into an insight statement using the DIKW framework
8. Create an Excel workbook with a summary sheet and supporting data sheets
9. Create a Word document with the top 5 insights, each following the insight template

## Data Profiling Checklist

| Metric                   | Red Flag                                 |
| ------------------------ | ---------------------------------------- |
| Null percentage          | > 20% in key column = unreliable         |
| Unique count = row count | Likely an ID column                      |
| Mixed types in column    | Needs cleaning before analysis           |
| > 1% duplicate rows      | Dedup decision required                  |
| Mean >> median           | Right-skewed, report median as "typical" |

## Insight Statement Template

For each finding, write:

- **WHAT**: [metric] is [value/behavior]
- **SO WHAT**: This means [business implication]
- **NOW WHAT**: Consider [action or follow-up question]

Example:

- WHAT: California's population (39M) is 5x the median state (7.5M)
- SO WHAT: Resource allocation using state averages will dramatically under-serve CA
- NOW WHAT: Segment by population tier, not just state count

## Correlation Rules

| Strength | Range   | Action                                       |
| -------- | ------- | -------------------------------------------- |
| Strong   | 0.7-1.0 | Investigate causation, check for confounders |
| Moderate | 0.4-0.7 | Worth reporting, segment and re-check        |
| Weak     | 0.1-0.4 | Mention only if business-relevant            |
| None     | < 0.1   | Do not report                                |

Always check: does the correlation reverse when split by a categorical variable? (Simpson's Paradox)

## Time-Series Decomposition

Separate trend, seasonality, and residual. Use rolling averages:

- Daily data: 7 or 30 day window
- Weekly: 4 or 13 week window
- Monthly: 3 or 12 month window

## Output Format

- Excel workbook: Summary sheet with top insights + data sheets with full analysis
- Word document: Top 5 insight statements with supporting charts
- Each insight includes: what, so what, now what

## Guidelines

- Always add "so what?" to every statistic before reporting it
- Report both mean and median; the gap itself is an insight
- Never claim "X causes Y" from correlation alone; say "correlates with"
- Show distributions, not just averages (averages hide variation)
- Complete the full EDA before recommending action
- Flag data quality issues at the start, not buried in footnotes
