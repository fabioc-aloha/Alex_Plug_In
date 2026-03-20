---
name: azure-patterns
description: Azure architecture patterns and best practices. Use when user asks about Azure services, cloud architecture, or needs Azure guidance.
---

# Azure Architecture Patterns

Common Azure patterns and best practices.

## Compute Selection

| Workload | Service | When to Use |
|----------|---------|-------------|
| Web apps | App Service | Traditional web hosting |
| APIs | Functions | Event-driven, serverless |
| Containers | Container Apps | Microservices, scale-to-zero |
| Kubernetes | AKS | Full container orchestration |

## Data Patterns

### Event-Driven
```
Event Grid → Function → Cosmos DB
```

### Queue-Based
```
Service Bus → Function → Database
```

### Streaming
```
Event Hubs → Stream Analytics → Storage
```

## Security Patterns

1. **Managed Identity** — Always prefer over connection strings
2. **Key Vault** — Store all secrets centrally
3. **Private Endpoints** — Use for sensitive workloads
4. **Network Isolation** — VNet integration where possible

## Cost Optimization

- Use consumption/serverless tiers for variable load
- Reserved instances for predictable workloads
- Auto-scale based on actual demand
- Review costs monthly

## Well-Architected Framework

- **Reliability**: Redundancy, health monitoring, disaster recovery
- **Security**: Defense in depth, zero trust
- **Cost**: Right-sizing, reserved capacity
- **Operations**: Automation, monitoring, alerting
- **Performance**: Scaling, caching, optimization
