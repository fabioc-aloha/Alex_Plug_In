# Data Analysis and Chart Interpretation

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Data Analysis

| Property     | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| **Domain**   | Data Analytics                                                 |
| **Category** | Analysis & Insight Extraction                                  |
| **Trifecta** | SKILL.md + data-analysis.instructions.md + analyze.prompt.md   |
| **Depends**  | data-visualization (chart output), data-ingest.cjs (ingestion) |

## Overview

Turn raw data into actionable insight statements. This skill covers the full EDA pipeline: profiling the dataset, exploring distributions, finding correlations, detecting anomalies, and -- critically -- translating statistical findings into business-language narratives tagged with story intents for downstream visualization.

The cardinal rule: **statistics are not insights**. "Mean revenue is $4.2M" is a statistic. "Revenue grew 34% YoY but growth is decelerating -- Q3 peak was 8% vs. 22% last year" is an insight.

## Module 1: Data Profiling

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

### Profiling Output Template

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

## Module 2: Descriptive Statistics

What to compute first for every numeric column.

| Statistic        | When It Matters                                    |
| ---------------- | -------------------------------------------------- |
| Mean vs. Median  | If mean >> median, right-skewed (outliers pull up) |
| Standard Dev     | Spread -- is the data tight or dispersed?          |
| Min / Max        | Range -- any impossible values?                    |
| Percentiles      | P25, P50, P75 -- where does the bulk sit?          |
| Skewness         | >1 or <-1 suggests non-normal distribution         |
| Kurtosis         | >3 = heavy tails (more outliers than expected)     |

### Rule of Thumb: Mean vs. Median

- If `|mean - median| / median > 0.1` (10%), report median as the "typical" value
- Always report both -- the gap itself is an insight

## Module 3: Distribution Analysis

| Shape        | What It Suggests                          | Story Intent     |
| ------------ | ----------------------------------------- | ---------------- |
| Normal       | Stable process, predictable               | Distribution     |
| Right-skewed | Many small values, few large (income)     | Deviation        |
| Left-skewed  | Most values high, some low (test scores)  | Deviation        |
| Bimodal      | Two populations mixed together            | Compare (groups) |
| Uniform      | No pattern -- random or categorical codes | None (check)     |
| Power law    | Few items dominate (Pareto, web traffic)  | Part-to-Whole    |

### Normality Quick Check

1. Compare mean to median (>10% gap = non-normal)
2. Check skewness (|skew| > 1 = non-normal)
3. If important: Shapiro-Wilk test (n < 5000) or Anderson-Darling

## Module 4: Correlation & Relationship

| Strength | `|r|` Range | Interpretation              |
| -------- | ----------- | --------------------------- |
| Strong   | 0.7 -- 1.0  | Likely meaningful           |
| Moderate | 0.4 -- 0.7  | Worth investigating         |
| Weak     | 0.1 -- 0.4  | Unlikely actionable alone   |
| None     | < 0.1       | No linear relationship      |

### Simpson's Paradox Awareness

Always check: does the correlation reverse when you split by a categorical variable?

```
Overall: Ad spend positively correlates with sales (+0.6)
By region: In 3 of 4 regions, correlation is NEGATIVE
Cause: High-spend region has higher baseline sales (confound)
```

**Rule**: If a strong correlation exists, segment by the top 2-3 categorical variables and re-check.

## Module 5: Segmentation

Group-by patterns for discovering sub-populations.

| Technique          | When to Use                          | Output            |
| ------------------ | ------------------------------------ | ----------------- |
| Group-by aggregate | Categorical × numeric                | Segment averages  |
| Percentile buckets | Continuous variable, create tiers    | Low/Mid/High      |
| RFM analysis       | Customer behavior (recency, freq, $) | Customer segments |
| Cohort analysis    | Time-based grouping (signup month)   | Retention curves  |
| Cross-tabulation   | Two categorical variables            | Contingency table |

### "So What?" for Segments

For each segment found, answer: "If I could only act on ONE segment, which one and why?"

## Module 6: Time-Series Decomposition

| Component    | What It Is                            | Detection                       |
| ------------ | ------------------------------------- | ------------------------------- |
| Trend        | Long-term direction                   | Rolling average (window = period) |
| Seasonality  | Repeating pattern at fixed intervals  | Autocorrelation at lag = period |
| Residual     | What's left (noise + anomalies)       | Original - trend - seasonality  |

### Rolling Average Windows

| Data Frequency | Window  |
| -------------- | ------- |
| Daily          | 7 or 30 |
| Weekly         | 4 or 13 |
| Monthly        | 3 or 12 |
| Quarterly      | 4       |

## Module 7: Anomaly Detection

| Method     | Best For                   | Threshold              |
| ---------- | -------------------------- | ---------------------- |
| Z-score    | Normal-ish distributions   | |z| > 3               |
| IQR fence  | Skewed distributions       | < Q1-1.5×IQR or > Q3+1.5×IQR |
| Isolation   | Multivariate outliers      | Score > 0.7 (heuristic) |
| Visual      | Any -- always plot first   | Inspect scatter/box    |

### Anomaly Protocol

1. Detect and **flag** -- never auto-remove
2. Investigate: is it a data error, a real outlier, or a different population?
3. Document the decision: kept (real), removed (error), or separated (sub-population)

## Module 8: "So What?" Translation (DIKW)

The most important module. Convert statistics into business language.

| Level           | Example (Bad)                    | Example (Good)                                                           |
| --------------- | -------------------------------- | ------------------------------------------------------------------------ |
| **Data**        | "Column revenue has 5000 values" | (Don't report raw data)                                                  |
| **Information** | "Mean revenue is $4.2M"          | "Average quarterly revenue is $4.2M across 8 quarters"                   |
| **Knowledge**   | "Revenue has a positive trend"   | "Revenue grew 34% YoY but growth rate decelerated from 22% to 8%"       |
| **Wisdom**      | (Requires domain context)        | "Growth is decelerating -- if Q3 seasonal effect weakens, plan for flat" |

### Insight Statement Template

```
[WHAT]: {metric} is {value/behavior}
[SO WHAT]: This means {business implication}
[NOW WHAT]: Consider {action or follow-up question}
[STORY INTENT]: {compare|trend|deviation|distribution|relationship|part-to-whole|flow|hierarchy|spatial}
[CHART]: {recommended chart type} because {rationale}
```

### Example Insight Statements

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

## Module 9: Hypothesis Framework

Structured approach to moving from observation to testable claim.

| Step         | Action                                             |
| ------------ | -------------------------------------------------- |
| Observe      | Note a pattern in the data                         |
| Hypothesize  | State a testable claim ("X causes Y because Z")   |
| Test         | Check against data (filter, segment, correlate)    |
| Conclude     | Supported, refuted, or inconclusive                |
| Narrate      | Write the finding as an insight statement          |

### Anti-Patterns

| Anti-Pattern             | Problem                                     | Fix                                         |
| ------------------------ | ------------------------------------------- | ------------------------------------------- |
| Reporting stats only     | No business meaning                         | Always add "so what?"                       |
| Correlation = causation  | Misleading conclusions                      | Check for confounders, state "correlates"   |
| Ignoring base rates      | Percentages without context                 | Always report denominator                   |
| Survivorship bias        | Only analyzing what's visible               | Ask "what's missing from this data?"        |
| Over-aggregation         | Hiding variation with averages              | Show distribution, not just mean            |
| Premature optimization   | Jumping to solutions before understanding   | Complete the EDA before recommending action |

---

# Chart Interpretation

| Property     | Value                                                                 |
| ------------ | --------------------------------------------------------------------- |
| **Domain**   | Data Analytics                                                        |
| **Category** | Visual Analysis & Insight Extraction                                  |
| **Trifecta** | SKILL.md + chart-interpretation.instructions.md + interpret.prompt.md |
| **Depends**  | data-visualization (chart type knowledge), data-analysis (validation) |

## Overview

The reverse of data visualization. Instead of data → chart, this skill reads chart → insights → narrative. It extracts meaning from existing charts (screenshots, images, HTML, Power BI reports) and produces structured analysis adapted to the target audience.

The cardinal rule: **read what the chart says, then read what it doesn't say**. The visible data points tell one story; the missing context, truncated axes, and suppressed categories tell another.

## Module 1: Chart Type Recognition

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

## Module 2: Visual Decoding

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

## Module 3: Pattern Detection

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

## Module 4: Misleading Visual Detection

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

## Module 5: Structural Element Reading

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

## Module 6: Narrative Extraction

Convert visual observations into prose at three audience levels:

### Executive Summary (30 seconds)

```
3 bullets maximum:
• [Primary insight — the main takeaway]  
• [Supporting evidence — the strongest proof point]  
• [Recommendation or implication — what to do about it]
```

### Detailed Analysis (2-3 minutes)

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

### Talking Points (presenter-ready)

```
"What you're seeing here is [explain the main pattern in plain language]."
"The key number to focus on is [highlight], which tells us [implication]."
"What's interesting is [surprise or anomaly] — this suggests [hypothesis]."
"The action item here is [recommendation]."
```

## Module 7: Confidence Rating

Rate interpretation confidence honestly:

| Level    | When                                            | Signal to User                           |
| -------- | ----------------------------------------------- | ---------------------------------------- |
| **High** | Clear labels, clean data, familiar chart type   | "The chart clearly shows..."             |
| **Medium** | Some inference needed (unlabeled, partial data) | "Based on visual estimation..."        |
| **Low**  | Ambiguous visual, missing context, blurry image | "This appears to show, but verify..."   |

## Module 8: Follow-Up Recommendations

After interpreting, suggest what would strengthen the analysis:

| Suggestion Type         | Example                                                    |
| ----------------------- | ---------------------------------------------------------- |
| Missing variable        | "Add cost data to see if revenue growth is profitable"     |
| Time extension          | "Extend to 24 months to confirm the seasonal pattern"      |
| Segmentation            | "Break this down by region to check for Simpson's Paradox" |
| Alternative chart       | "A scatter plot would better show the correlation"          |
| Baseline addition       | "Add a target line to show performance vs. plan"           |

## Module 9: CSAR Loop Integration

Use the Dialog Engineering CSAR Loop for structured chart reading:

| Phase        | Action                                                |
| ------------ | ----------------------------------------------------- |
| **Clarify**  | What chart type? What variables? What time range?     |
| **Summarize**| State the main finding in one sentence                |
| **Act**      | Extract specific data points, patterns, anomalies     |
| **Reflect**  | What's missing? What would I want to see next?        |

## Anti-Patterns

| Anti-Pattern              | Problem                                    | Fix                                      |
| ------------------------- | ------------------------------------------ | ---------------------------------------- |
| Describing, not interpreting | "This is a bar chart" (no insight)       | Say what the bars MEAN, not what they ARE|
| Ignoring the title         | Missing the author's intended message     | Read title first -- it's the thesis      |
| Over-precision from visual | "Revenue is exactly $4,237,892"           | Estimate from visual: "roughly $4.2M"    |
| Missing bias check         | Accepting the chart at face value         | Always scan for misleading elements      |
| Single-lens reading        | Only one interpretation offered           | Provide primary + alternative reading    |

---

# Database Design Skill

> Model data to match access patterns. Normalize for integrity, denormalize for performance.

---

## Choosing a Database

### Decision Matrix

| Factor | SQL (Relational) | NoSQL (Document) | Key-Value | Graph |
|--------|------------------|------------------|-----------|-------|
| **Schema** | Fixed, strict | Flexible | None | Nodes/edges |
| **Transactions** | ACID built-in | Eventually consistent (usually) | Limited | Varies |
| **Joins** | Native support | Expensive/manual | N/A | Native (relationships) |
| **Scale** | Vertical → Horizontal | Horizontal native | Horizontal native | Specialized |
| **Best for** | Structured data, complex queries | Rapid iteration, varied shape | Cache, sessions | Relationships |

### Common Choices (2026)

| Database | Type | Best For |
|----------|------|----------|
| **PostgreSQL** | Relational | General purpose, full-featured |
| **SQLite** | Relational | Embedded, serverless |
| **MongoDB** | Document | Rapid prototyping, flexible schema |
| **Redis** | Key-Value | Caching, sessions, pub/sub |
| **Cosmos DB** | Multi-model | Azure-native, global distribution |
| **DynamoDB** | Key-Value/Document | AWS-native, massive scale |
| **Neo4j** | Graph | Social networks, recommendations |

---

## Schema Design Principles

### Normalization Levels

| Form | Rule | Trade-off |
|------|------|-----------|
| **1NF** | No repeating groups | Basic structure |
| **2NF** | No partial dependencies | Remove redundancy |
| **3NF** | No transitive dependencies | Data integrity |
| **BCNF** | Every determinant is a key | Strict integrity |

### When to Denormalize

- Read-heavy workloads
- Complex queries hitting many tables
- When consistency can be eventual
- Reporting/analytics tables

### Example: E-Commerce Schema

```sql
-- Normalized (3NF)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) NOT NULL
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Denormalized for reporting
CREATE TABLE order_summary (
    order_id INTEGER PRIMARY KEY,
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    total_amount DECIMAL(10,2),
    item_count INTEGER,
    created_at TIMESTAMP
);
```

---

## Modern ORM Patterns

### Prisma (TypeScript)

```prisma
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  profile   Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

```typescript
// Usage - type-safe queries
const user = await prisma.user.findUnique({
  where: { email: 'alex@example.com' },
  include: { posts: true }
});
```

### Drizzle (TypeScript)

```typescript
// schema.ts
import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  authorId: integer('author_id').references(() => users.id),
});

// Usage
const result = await db.select().from(users).where(eq(users.email, 'alex@example.com'));
```

### Entity Framework (.NET)

```csharp
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string? Name { get; set; }
    public ICollection<Post> Posts { get; } = new List<Post>();
}

// Usage
var user = await context.Users
    .Include(u => u.Posts)
    .FirstOrDefaultAsync(u => u.Email == "alex@example.com");
```

---

## Query Optimization

### The EXPLAIN Plan

```sql
-- PostgreSQL
EXPLAIN ANALYZE
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
GROUP BY u.id
ORDER BY post_count DESC
LIMIT 10;
```

### Reading Execution Plans

| Operation | Meaning | Concern |
|-----------|---------|---------|
| Seq Scan | Full table scan | Consider index |
| Index Scan | Using index | Good |
| Nested Loop | For each row... | OK for small sets |
| Hash Join | Build hash table | Good for large sets |
| Sort | In-memory sort | Check work_mem |

### Index Strategy

```sql
-- Single column (most common)
CREATE INDEX idx_users_email ON users(email);

-- Composite (column order matters!)
CREATE INDEX idx_posts_author_date ON posts(author_id, created_at DESC);

-- Partial (when you query a subset)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Covering (includes all needed columns)
CREATE INDEX idx_posts_covering ON posts(author_id) INCLUDE (title, created_at);
```

### Query Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| `SELECT *` | Fetches unnecessary data | List specific columns |
| N+1 queries | Loop makes N queries | Use JOIN or eager loading |
| Missing index on WHERE | Full table scan | Add appropriate index |
| OR in WHERE | Can't use index efficiently | UNION ALL or restructure |
| Functions on columns | `WHERE YEAR(date) = 2026` | `WHERE date >= '2026-01-01'` |

---

## Data Modeling Patterns

### Soft Deletes

```sql
-- Instead of DELETE, update a flag
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;

-- Query active users
SELECT * FROM users WHERE deleted_at IS NULL;

-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = 123;
```

### Audit Trails

```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Trigger for automatic auditing (PostgreSQL)
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
    VALUES (TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, 
            to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Temporal Tables

```sql
-- PostgreSQL example
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_to TIMESTAMP DEFAULT 'infinity'
);

-- Query current data
SELECT * FROM products WHERE valid_to = 'infinity';

-- Query historical data (what was the price on Jan 1?)
SELECT * FROM products 
WHERE valid_from <= '2026-01-01' AND valid_to > '2026-01-01';
```

---

## NoSQL Patterns

### Document Modeling (MongoDB)

```javascript
// ❌ Relational thinking (too normalized)
{ _id: 1, userId: 'u1', productId: 'p1' }  // separate collection

// ✅ Document thinking (embed when 1:few or frequent access together)
{
  _id: 'order123',
  customer: {
    id: 'c1',
    name: 'Alex',
    email: 'alex@example.com'
  },
  items: [
    { productId: 'p1', name: 'Widget', price: 9.99, quantity: 2 },
    { productId: 'p2', name: 'Gadget', price: 19.99, quantity: 1 }
  ],
  total: 39.97,
  createdAt: ISODate('2026-02-11')
}
```

### Embedding vs Referencing

| Embed When | Reference When |
|------------|----------------|
| 1:1 or 1:few relationship | 1:many or many:many |
| Data accessed together | Data accessed independently |
| Data doesn't change often | Data changes frequently |
| Size is bounded | Unbounded growth |

---

## Migration Strategies

### Schema Migration Best Practices

1. **Forward-only migrations** — Don't modify existing migrations
2. **Small, incremental changes** — One concern per migration
3. **Backward compatible** — Add before remove
4. **Test migrations** — Run against production copy

### Zero-Downtime Schema Changes

```sql
-- Phase 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN new_email VARCHAR(255);

-- Phase 2: Backfill data (in batches)
UPDATE users SET new_email = email WHERE new_email IS NULL LIMIT 1000;

-- Phase 3: Update application to write to both columns

-- Phase 4: Make new column required
ALTER TABLE users ALTER COLUMN new_email SET NOT NULL;

-- Phase 5: Update application to read from new column

-- Phase 6: Drop old column
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN new_email TO email;
```

---

## Connection Management

### Connection Pooling

```typescript
// Prisma with connection pool
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Pool settings in URL: ?connection_limit=10&pool_timeout=30
}

// Node postgres pool
const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Connection Pool Sizing

Rule of thumb for PostgreSQL:
```
connections = (core_count * 2) + spindle_count
```

For cloud: Start with 10-20, monitor and adjust.

---

## Implementation Checklist

### New Database

- [ ] Choose appropriate database type
- [ ] Design initial schema (3NF or justified denormalization)
- [ ] Define primary keys and foreign keys
- [ ] Plan indexes for known query patterns
- [ ] Set up connection pooling
- [ ] Configure backups and point-in-time recovery
- [ ] Set up monitoring (query performance, connections)

### Production Readiness

- [ ] Indexes for all WHERE/JOIN columns
- [ ] No N+1 query patterns
- [ ] Connection pool sized appropriately
- [ ] Query timeouts configured
- [ ] Slow query logging enabled
- [ ] Backup restoration tested

---

## Related Skills

- **performance-profiling** — Query-level performance analysis
- **api-design** — Data shapes for API responses
- **infrastructure-as-code** — Database provisioning
- **security-review** — Access control, encryption

---

*Design for today's queries, but plan for tomorrow's scale.*
