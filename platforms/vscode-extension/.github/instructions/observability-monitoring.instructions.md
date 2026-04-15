---
description: "Production visibility through logs, metrics, traces, and alerting — the three pillars of observability"
application: "When designing monitoring, investigating production issues, or implementing logging"
applyTo: "**/*observ*,**/*monitor*,**/*telemetry*,**/*logging*,**/*metric*"
---

# Observability Principles

## Three Pillars

| Pillar | What | Use Case |
|--------|------|----------|
| **Logs** | Discrete events | Debugging, audit trail |
| **Metrics** | Aggregated numbers | Alerting, trends, dashboards |
| **Traces** | Request flow | Latency, dependencies |

## Logging Levels

- **ERROR**: Action required, user impact
- **WARN**: Concerning but not broken
- **INFO**: Business events (request served, job completed)
- **DEBUG**: Developer details (off in prod)

## Key Metrics

- Request rate, error rate, duration (RED)
- Utilization, saturation, errors (USE)
- SLI/SLO: What matters to users

## Alerting Rules

- Alert on symptoms, not causes
- Actionable: What should someone do?
- Avoid alert fatigue (tune thresholds)
- Page only for user impact
