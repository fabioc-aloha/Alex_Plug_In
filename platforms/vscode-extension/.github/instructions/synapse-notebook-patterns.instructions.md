---
description: "Procedural guidance for Azure Synapse PySpark notebook development patterns"
applyTo: "**/notebook/*.json,**/*.ipynb,**/*synapse*notebook*,**/*pyspark*"
---

# Synapse Notebook Development Instructions

**Auto-loaded when**: Creating or editing Azure Synapse PySpark notebooks
**Domain**: Data engineering, Synapse Analytics, PySpark

---

## Notebook JSON Format

**Critical**: Synapse notebooks are `.json` files, NOT `.ipynb`.

Key structural differences from Jupyter:
- Wrapped in `properties` object
- `folder` field for Synapse workspace organization
- `bigDataPool` reference required
- `sessionProperties` for Spark configuration
- Source lines stored as array of strings with `\n` terminators

---

## Notebook Creation Workflow

### Phase 1: Requirements

1. Identify purpose (ETL, diagnostic, reporting, migration)
2. Determine data sources and output destinations
3. Assess performance requirements (data volume, SLA)

### Phase 2: Structure Selection

| Type | Cell Structure | Key Patterns |
|------|---------------|-------------|
| **ETL Pipeline** | Config → Preflight → Load → Transform → Write → Log | Retry, Protection, Quality |
| **Diagnostic** | Config → Load → Analysis → Summary → Export | Filter, Aggregate, Display |
| **Migration** | Config → Source → Compare → Migrate → Validate | Checksum, Incremental |
| **Reporting** | Config → Query → Visualize → Export | SQL, pandas, display |

### Phase 3: Required Patterns (ALL notebooks)

1. Environment Configuration (dev/test/prod)
2. Structured Logging (audit trail)
3. Error Handling (try/except with context)

### Conditional Patterns

| If... | Apply... |
|-------|----------|
| Writing data | Data Protection Pattern (safe_write) |
| External API calls | Retry with Backoff |
| Production pipeline | Pre-flight Checks |
| Data quality critical | Quality Monitor |

---

## Spark Pool Selection

| Data Volume | Pool Size | Driver/Executor Memory |
|------------|-----------|----------------------|
| < 1 GB | Small | 28g |
| 1-10 GB | Medium | 56g |
| 10-100 GB | Large | 112g |
| > 100 GB | XLarge | 224g |

---

## Common Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| Hardcoded paths | Environment-specific failures | Use config cell with env detection |
| No error handling | Silent failures | Wrap critical ops in try/except |
| `df.count()` in loops | Performance degradation | Cache count or persist DataFrame |
| No logging | Debugging impossible | Use structured logging class |
| Large `collect()` | Driver OOM | Use `.limit()` or aggregate first |

---

## Validation Checklist

Before commit/push:
- [ ] JSON valid (no trailing commas, proper escaping)
- [ ] `bigDataPool` reference correct for target environment
- [ ] `sessionProperties` sized for workload
- [ ] All source strings end with `\n`
- [ ] `outputs: []` (clean for git)
- [ ] `execution_count: null` (clean for git)
- [ ] Environment variables externalized
- [ ] DRY_RUN mode available for testing
