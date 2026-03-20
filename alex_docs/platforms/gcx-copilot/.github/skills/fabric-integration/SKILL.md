---
name: fabric-integration
description: Work with Microsoft Fabric for data engineering, warehousing, and analytics. Use when user asks about Fabric, lakehouses, notebooks, or data pipelines.
---

# Microsoft Fabric Integration

Data platform patterns and operations.

## Lakehouse Operations

### Read Data
```python
df = spark.read.format("delta").load("Tables/my_table")
```

### Write Data
```python
df.write.format("delta").mode("overwrite").save("Tables/my_table")
```

### Incremental Load
```python
df.write.format("delta").mode("append").save("Tables/my_table")
```

## Notebook Patterns

### Environment Setup
```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit, when
```

### Configuration
```python
spark.conf.set("spark.sql.shuffle.partitions", "200")
```

## Data Quality

### Schema Validation
```python
expected_schema = StructType([...])
assert df.schema == expected_schema
```

### Null Checks
```python
null_counts = df.select([count(when(col(c).isNull(), c)).alias(c) for c in df.columns])
```

### Duplicate Detection
```python
duplicates = df.groupBy(key_cols).count().filter("count > 1")
```

## Best Practices

1. **Delta format** — Use Delta Lake for all tables
2. **Partitioning** — Partition large tables appropriately
3. **Z-ordering** — Apply Z-order on filter columns
4. **Optimize** — Run OPTIMIZE regularly
5. **Vacuum** — Clean up old files periodically
