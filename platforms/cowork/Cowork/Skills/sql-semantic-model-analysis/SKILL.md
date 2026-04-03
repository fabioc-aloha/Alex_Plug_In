---
name: SQL & Semantic Model Analysis
description: Write efficient SQL queries against SQL Server and semantic models to extract, validate, and analyze CX data for reporting and decision-making.
---

## Purpose

Turn business questions into correct SQL queries and semantic model (DAX/Power BI) measures. GCX teams work with customer data in SQL Server, Azure SQL, and Microsoft Fabric semantic models. This skill bridges the gap between "what do we need to know?" and "how do we query it?"

## SQL Query Patterns

### Filtering and Aggregation

```sql
-- Customer satisfaction by region (last 90 days)
SELECT
    r.RegionName,
    COUNT(s.SurveyId) AS ResponseCount,
    AVG(s.CSATScore) AS AvgCSAT,
    AVG(s.NPSScore) AS AvgNPS
FROM Surveys s
JOIN Customers c ON s.CustomerId = c.CustomerId
JOIN Regions r ON c.RegionId = r.RegionId
WHERE s.CompletedDate >= DATEADD(DAY, -90, GETDATE())
GROUP BY r.RegionName
HAVING COUNT(s.SurveyId) >= 30
ORDER BY AvgCSAT DESC;
```

### Window Functions for Trend Analysis

```sql
-- Month-over-month CSAT trend with change indicator
SELECT
    FORMAT(CompletedDate, 'yyyy-MM') AS Month,
    AVG(CSATScore) AS AvgCSAT,
    LAG(AVG(CSATScore)) OVER (ORDER BY FORMAT(CompletedDate, 'yyyy-MM')) AS PriorMonth,
    AVG(CSATScore) - LAG(AVG(CSATScore)) OVER (ORDER BY FORMAT(CompletedDate, 'yyyy-MM')) AS Change
FROM Surveys
WHERE CompletedDate >= DATEADD(MONTH, -12, GETDATE())
GROUP BY FORMAT(CompletedDate, 'yyyy-MM');
```

### Duplicate Detection

```sql
-- Find duplicate survey responses (same customer, same survey, same day)
SELECT
    CustomerId,
    SurveyTemplateId,
    CAST(CompletedDate AS DATE) AS ResponseDate,
    COUNT(*) AS DuplicateCount
FROM Surveys
GROUP BY CustomerId, SurveyTemplateId, CAST(CompletedDate AS DATE)
HAVING COUNT(*) > 1;
```

### Data Quality Profiling

```sql
-- Profile key columns for nulls, distinct counts, and outliers
SELECT
    COUNT(*) AS TotalRows,
    COUNT(DISTINCT CustomerId) AS UniqueCustomers,
    SUM(CASE WHEN CSATScore IS NULL THEN 1 ELSE 0 END) AS NullCSAT,
    ROUND(100.0 * SUM(CASE WHEN CSATScore IS NULL THEN 1 ELSE 0 END) / COUNT(*), 1) AS NullCSATPct,
    MIN(CSATScore) AS MinCSAT,
    MAX(CSATScore) AS MaxCSAT,
    AVG(CSATScore) AS AvgCSAT,
    STDEV(CSATScore) AS StdDevCSAT
FROM Surveys;
```

## Semantic Model Patterns (DAX)

### Time Intelligence Measures

```dax
// Year-over-year CSAT comparison
CSAT YoY Change =
VAR CurrentPeriod = [Avg CSAT Score]
VAR PriorYear = CALCULATE([Avg CSAT Score], SAMEPERIODLASTYEAR('Date'[Date]))
RETURN CurrentPeriod - PriorYear
```

### Segmented Analysis

```dax
// NPS by customer tier
NPS by Tier =
CALCULATETABLE(
    SUMMARIZE(
        Surveys,
        Customers[Tier],
        "Avg NPS", [Avg NPS Score],
        "Response Count", COUNTROWS(Surveys)
    ),
    Surveys[CompletedDate] >= TODAY() - 90
)
```

### Calculated Columns vs Measures

| Use               | Calculated Column                | Measure                |
| ----------------- | -------------------------------- | ---------------------- |
| **Computed when** | Table refresh                    | Query time             |
| **Storage**       | In model, increases size         | No storage             |
| **Best for**      | Static categorization, row-level | Aggregation, filtering |
| **Example**       | Customer tier assignment         | Avg CSAT score         |

## Query Optimization

### Index-Friendly Patterns

| Pattern                  | Fast                          | Slow                                         |
| ------------------------ | ----------------------------- | -------------------------------------------- |
| Filter on indexed column | `WHERE RegionId = 5`          | `WHERE RegionName LIKE '%west%'`             |
| Date range               | `WHERE Date >= '2026-01-01'`  | `WHERE YEAR(Date) = 2026`                    |
| Existence check          | `WHERE EXISTS (SELECT 1 ...)` | `WHERE Id IN (SELECT Id ...)` for large sets |
| Top N                    | `SELECT TOP 100 ...`          | Full scan then sort                          |

### Execution Plan Red Flags

| Warning                   | Cause                          | Fix                      |
| ------------------------- | ------------------------------ | ------------------------ |
| Table Scan                | Missing index                  | Add covering index       |
| Key Lookup                | Non-covering index             | Include columns in index |
| Sort operator (high cost) | ORDER BY on non-indexed column | Add index or remove sort |
| Hash Match                | Large join without index       | Index join columns       |

## Data Validation Checklist

Before reporting any CX metric:

- [ ] Confirm date range matches the reporting period
- [ ] Check for duplicates (same customer + survey + date)
- [ ] Verify null handling: are nulls excluded or treated as zero?
- [ ] Validate row counts against source system
- [ ] Check for outliers: scores outside valid range (e.g., CSAT 1-5, NPS -100 to 100)
- [ ] Confirm joins don't inflate counts (1:many producing duplicates)
- [ ] Test with known values before sharing results

## Guidelines

- Always qualify column names with table aliases in multi-table queries
- Use CTEs for readability over nested subqueries
- Never use `SELECT *` in production queries or reports
- Always include a date filter; unbounded queries are slow and misleading
- Validate results against a known baseline before sharing with stakeholders
- For semantic models, prefer measures over calculated columns for aggregations
- Document assumptions: "NPS excludes responses with null scores" or "CSAT is the 5-point scale average"
- No PII in query results shared outside the team: hash or exclude customer identifiers
