---
description: "Microsoft Fabric workspace management, governance, REST API patterns, and medallion architecture"
application: "When working with Microsoft Fabric workspaces, lakehouses, or data engineering pipelines"
applyTo: "**/*fabric*,**/*lakehouse*,**/*medallion*,**/*delta*"
---

# Microsoft Fabric Patterns

## Medallion Architecture

| Layer | Purpose | SLA |
|-------|---------|-----|
| **Bronze** | Raw ingestion, as-is | Land fast |
| **Silver** | Cleaned, typed, deduplicated | Standard quality |
| **Gold** | Business-ready aggregates | Production SLA |

## Workspace Governance

- One workspace per environment (dev/test/prod)
- Use workspace roles for access control
- Separate compute from storage where possible
- Monitor capacity usage

## REST API Patterns

- Authenticate via service principal
- Use /v1/ API endpoints
- Handle pagination for large result sets
- Implement retry with exponential backoff

## Anti-Patterns

- Single workspace for all environments
- Skipping Silver layer (Bronze → Gold)
- Manual deployments (use pipelines)
- Ignoring capacity limits
