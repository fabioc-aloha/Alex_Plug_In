---
sem: 1
description: Read any chart and extract insights, detect bias, and produce audience-adapted analysis
application: "When analyzing data, creating visualizations, or building reports"
agent: Alex
---

# /interpret - Chart Interpretation

The reverse of `/visualize` -- give me a chart, I'll tell you what it says, what it hides, and how to make it better.

## Workflow

1. **You provide**: Chart (image, screenshot, HTML, URL)
2. **I identify**: Chart type, encodings, structural elements
3. **I extract**: Key data points, patterns, anomalies
4. **I check**: Misleading elements, missing context, bias
5. **I narrate**: Audience-adapted analysis (executive / detailed / talking points)
6. **I suggest**: How to improve the visualization

## What I Need

| Input    | Required | Example                                      |
| -------- | -------- | -------------------------------------------- |
| Chart    | Yes      | Image, screenshot, HTML file, URL            |
| Context  | Helpful  | "This is from our Q3 sales review"           |
| Question | Optional | "What does this tell us about churn?"        |
| Audience | Optional | executive, analyst, presenter (default: all) |

## What You Get

1. **Chart identification**: type, encodings, dimensions
2. **Structural reading**: title, axes, legend, source, time range
3. **Data extraction**: key values with precision rating
4. **Pattern analysis**: primary story + supporting observations + anomalies
5. **Bias check**: misleading elements flagged with impact assessment
6. **Narrative output**:
   - Executive: 3 bullets, 30 seconds
   - Detailed: paragraph analysis with evidence
   - Talking points: presenter-ready "say this" notes
7. **Improvement suggestions**: how to tell the story better
8. **Follow-up questions**: what data would deepen the analysis

## Start

Share a chart (paste, attach, or point me to a file) and I'll read it for you. Tell me the context if you have it -- otherwise I'll work with what's visible.
