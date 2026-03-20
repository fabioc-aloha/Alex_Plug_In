---
name: cpm-integration
description: Work with CPM for compliance tracking, SLA monitoring, and audit readiness. Use when user asks about compliance, SLAs, CPM, or regulatory requirements.
---

# CPM Integration

Compliance and SLA management patterns.

## Core Concepts

| Term | Description |
|------|-------------|
| **SLA** | Service Level Agreement commitment |
| **KPI** | Key Performance Indicator metric |
| **Compliance** | Regulatory requirement adherence |
| **Audit** | Verification of compliance |

## Common Operations

### SLA Tracking
```
@workspace What are our current SLA metrics?
```

### Compliance Status
```
@workspace Show compliance status for [regulation]
```

### Audit Preparation
```
@workspace Generate audit evidence for [requirement]
```

## Dashboard Queries

### SLA Performance
```sql
SELECT service_name, 
       target_sla, 
       actual_sla,
       CASE WHEN actual_sla >= target_sla THEN 'Met' ELSE 'Missed' END as status
FROM sla_metrics
WHERE period = CURRENT_MONTH
```

### Compliance Score
```sql
SELECT category,
       requirements_met,
       total_requirements,
       (requirements_met * 100.0 / total_requirements) as compliance_pct
FROM compliance_status
```

## Integration Points

- ADO work items for remediation tracking
- Power BI dashboards for visualization
- Automated alerts for SLA breaches
- Evidence collection for audits
