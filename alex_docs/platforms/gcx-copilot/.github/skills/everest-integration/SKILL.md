---
name: everest-integration
description: Work with Everest for survey data, sentiment analysis, and feedback insights. Use when user asks about surveys, Everest, sentiment analysis, or customer feedback.


# Everest Integration

Survey and feedback platform patterns.

## Data Access

### Survey Responses
```python
responses = everest_client.get_responses(survey_id="12345")
```

### Score Calculations
```python
# NPS calculation
promoters = df.filter(col("score") >= 9).count()
detractors = df.filter(col("score") <= 6).count()
nps = ((promoters - detractors) / total) * 100
```

## Sentiment Analysis

### Basic Analysis
```
@workspace Analyze sentiment trends from recent surveys
```

### Topic Extraction
```
@workspace What topics are customers mentioning most?
```

### Trend Detection
```
@workspace Compare sentiment this quarter vs last quarter
```

## Power BI Integration

### Dataset Creation
```
@workspace Create a Power BI dataset from Everest data
```

### Dashboard Metrics
- Response rate trends
- NPS/CSAT over time
- Sentiment distribution
- Topic frequency

## Best Practices

1. **Normalize scores** — Standardize across survey types
2. **Track trends** — Focus on directional changes
3. **Close the loop** — Connect insights to actions
4. **Privacy compliance** — Handle PII appropriately
5. **Regular refresh** — Keep dashboards current
