---
description: "Schema design, normalization, query optimization, and data modeling patterns"
application: "When designing database schemas, optimizing queries, or modeling data relationships"
applyTo: "**/*schema*,**/*database*,**/*table*,**/*query*,**/*sql*"
---

# Database Design Principles

## Normalization vs Denormalization

- Normalize for write-heavy, OLTP workloads
- Denormalize for read-heavy, analytics workloads
- Balance: Normalize first, denormalize for proven bottlenecks

## Key Design Patterns

| Pattern | Use Case |
|---------|----------|
| **Lookup table** | Enum values, reference data |
| **Soft delete** | Audit trail, recovery |
| **Audit columns** | created_at, updated_at, created_by |
| **UUID pk** | Distributed systems, no sequence bottleneck |
| **Composite key** | Junction tables, natural uniqueness |

## Query Optimization

1. Index WHERE/JOIN columns
2. Avoid SELECT * — fetch only needed columns
3. Watch for N+1 queries — use JOINs or batching
4. EXPLAIN before deploying

## Anti-Patterns

- Storing JSON when relational fits
- Missing foreign keys
- Over-indexing (write penalty)
- Nullable columns without clear semantics
