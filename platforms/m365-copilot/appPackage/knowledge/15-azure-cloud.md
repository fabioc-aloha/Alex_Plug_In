# Azure Architecture, OpenAI Patterns, and Infrastructure

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Skill: Azure Architecture Patterns

> Well-Architected Framework principles, reference architectures, and best practices for cloud-native solutions.

## Metadata

| Field | Value |
|-------|-------|
| **Skill ID** | azure-architecture-patterns |
| **Version** | 1.0.0 |
| **Category** | Cloud/Infrastructure |
| **Difficulty** | Advanced |
| **Prerequisites** | Basic Azure knowledge |
| **Related Skills** | azure-devops-automation, cognitive-load (for architecture reviews) |

---

## Overview

Azure architecture is about trade-offs, not perfection. This skill provides structured guidance for designing, evaluating, and optimizing Azure solutions using the Well-Architected Framework (WAF) pillars.

### The Five Pillars

| Pillar | Focus | Key Question |
|--------|-------|--------------|
| **Reliability** | Resiliency, availability | "Will it stay up?" |
| **Security** | Protection, compliance | "Is it safe?" |
| **Cost Optimization** | Efficiency, value | "Is it worth it?" |
| **Operational Excellence** | Manageability, observability | "Can we run it?" |
| **Performance Efficiency** | Scalability, responsiveness | "Is it fast enough?" |

---

## Module 1: Reliability Patterns

### Design Principles

1. **Design for failure** - Assume components will fail
2. **Observe health** - Know when something is wrong
3. **Drive automation** - Reduce human error
4. **Design for self-healing** - Automatic recovery
5. **Design for scale-out** - Horizontal over vertical

### Key Patterns

#### Circuit Breaker
Prevent cascading failures by failing fast when a downstream service is unhealthy.

```csharp
// Polly implementation
var circuitBreakerPolicy = Policy
    .Handle<HttpRequestException>()
    .CircuitBreakerAsync(
        exceptionsAllowedBeforeBreaking: 3,
        durationOfBreak: TimeSpan.FromSeconds(30)
    );
```

#### Retry with Exponential Backoff
Handle transient failures with increasing delays.

```csharp
var retryPolicy = Policy
    .Handle<HttpRequestException>()
    .WaitAndRetryAsync(3, retryAttempt => 
        TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
```

#### Availability Zones
Distribute resources across physically separate datacenters.

| Resource | Zone Support |
|----------|--------------|
| VMs | Zone-redundant or zonal |
| Azure SQL | Zone-redundant HA |
| Storage | ZRS, GZRS |
| App Service | Zone-redundant (Premium) |

### Reliability Checklist

- [ ] Single points of failure identified and mitigated
- [ ] Health endpoints implemented (`/health`, `/ready`)
- [ ] Retry policies with backoff configured
- [ ] Circuit breakers for external dependencies
- [ ] Availability zones utilized (where supported)
- [ ] Disaster recovery plan documented
- [ ] RTO/RPO defined and tested

---

## Module 2: Security Patterns

### Zero Trust Principles

| Principle | Implementation |
|-----------|----------------|
| **Verify explicitly** | Always authenticate/authorize |
| **Least privilege** | Minimal necessary permissions |
| **Assume breach** | Segment, encrypt, detect |

### Identity Patterns

#### Managed Identity
Eliminate credential management with Microsoft Entra ID-backed identity.

```json
{
  "type": "Microsoft.Web/sites",
  "identity": {
    "type": "SystemAssigned"
  }
}
```

**Use cases:**
- App Service → Key Vault secrets
- Azure Functions → Storage access
- VMs → Database connections

#### RBAC Best Practices

| Practice | Rationale |
|----------|-----------|
| Use built-in roles first | Custom roles add complexity |
| Scope to resource group | Not subscription (too broad) |
| Use groups, not users | Easier lifecycle management |
| Regular access reviews | Remove stale permissions |

### Network Security

#### Private Endpoints
Keep traffic on Azure backbone, off public internet.

```bicep
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-05-01' = {
  name: 'pe-storage'
  properties: {
    subnet: { id: subnetId }
    privateLinkServiceConnections: [{
      name: 'plsc-storage'
      properties: {
        privateLinkServiceId: storageAccountId
        groupIds: ['blob']
      }
    }]
  }
}
```

#### Network Security Groups (NSG)
Default deny, explicit allow.

| Priority | Description |
|----------|-------------|
| 100-200 | Allow known good traffic |
| 300-400 | Deny known bad traffic |
| 4096 | Default deny all |

### Security Checklist

- [ ] Managed identities used (no stored credentials)
- [ ] Key Vault for secrets/certificates
- [ ] Private endpoints for PaaS services
- [ ] NSG/firewall rules explicit deny-by-default
- [ ] TLS 1.2+ enforced
- [ ] Microsoft Defender for Cloud enabled
- [ ] Diagnostic settings → Log Analytics

---

## Module 3: Cost Optimization Patterns

### Design for Cost

| Strategy | Impact |
|----------|--------|
| **Right-size** | Match SKU to actual workload |
| **Reserved Instances** | 1-3 year commitment = 40-72% savings |
| **Spot VMs** | 90% discount for interruptible workloads |
| **Auto-shutdown** | Dev/test VMs off at night |
| **Serverless** | Pay per execution, not idle time |

### Cost-Aware Architecture

#### Compute Selection Matrix

| Workload Type | Recommended | Why |
|---------------|-------------|-----|
| Steady-state web | App Service Premium | Predictable, manageable |
| Event-driven | Azure Functions | Pay per execution |
| Batch processing | Container Apps + KEDA | Scale to zero |
| Big compute | Spot VMs + Batch | Massive savings |
| Dev/test | B-series VMs | Burstable, cheap |

#### Storage Tiers

| Tier | Use Case | Cost/GB/month |
|------|----------|---------------|
| Hot | Frequently accessed | ~$0.02 |
| Cool | Infrequent (30+ days) | ~$0.01 |
| Archive | Rarely accessed | ~$0.002 |

**Lifecycle management**: Auto-tier blobs based on last access.

### Cost Monitoring

```kusto
// Azure Resource Graph - find expensive resources
resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| extend vmSize = properties.hardwareProfile.vmSize
| project name, resourceGroup, vmSize, location
| order by vmSize desc
```

### Cost Checklist

- [ ] Azure Advisor recommendations reviewed
- [ ] Reserved Instances for predictable workloads
- [ ] Auto-shutdown for non-prod
- [ ] Right-sized based on actual utilization
- [ ] Storage lifecycle policies configured
- [ ] Cost alerts and budgets set
- [ ] Orphaned resources cleaned up

---

## Module 4: Operational Excellence Patterns

### Infrastructure as Code

| Tool | Best For |
|------|----------|
| **Bicep** | Azure-native, declarative |
| **Terraform** | Multi-cloud, state management |
| **ARM** | Legacy, avoid for new work |
| **Pulumi** | Developers who prefer code |

#### Bicep Best Practices

```bicep
// Use parameters with descriptions and constraints
@description('The environment name')
@allowed(['dev', 'staging', 'prod'])
param environment string

// Use variables for derived values
var resourcePrefix = 'app-${environment}'

// Use modules for reusability
module storage 'modules/storage.bicep' = {
  name: 'storage-${environment}'
  params: {
    prefix: resourcePrefix
    location: location
  }
}
```

### Observability Stack

| Layer | Service | Purpose |
|-------|---------|---------|
| Logs | Log Analytics | Centralized logging |
| Metrics | Azure Monitor | Performance data |
| Traces | Application Insights | Distributed tracing |
| Alerts | Azure Alerts | Proactive notification |
| Dashboards | Azure Workbooks | Visualization |

#### Essential Diagnostic Settings

```bicep
resource diagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  scope: appService
  name: 'diag-appservice'
  properties: {
    workspaceId: logAnalyticsId
    logs: [
      { category: 'AppServiceHTTPLogs', enabled: true }
      { category: 'AppServiceConsoleLogs', enabled: true }
    ]
    metrics: [
      { category: 'AllMetrics', enabled: true }
    ]
  }
}
```

### Operational Checklist

- [ ] IaC for all resources (Bicep/Terraform)
- [ ] CI/CD pipelines for deployment
- [ ] Diagnostic settings to Log Analytics
- [ ] Application Insights integrated
- [ ] Alerts for critical metrics
- [ ] Runbooks for common operations
- [ ] Chaos engineering tests scheduled

---

## Module 5: Performance Efficiency Patterns

### Scalability Patterns

#### Horizontal Scaling (Scale Out)
Add more instances, not bigger instances.

| Service | Scaling Mechanism |
|---------|-------------------|
| App Service | Autoscale rules |
| Azure Functions | Event-driven automatic |
| AKS | Horizontal Pod Autoscaler + Cluster Autoscaler |
| VMSS | Autoscale rules |

#### Caching Strategy

| Cache Type | Use Case | Service |
|------------|----------|---------|
| CDN | Static content | Azure Front Door |
| Distributed | Session, computed data | Azure Cache for Redis |
| Local | Hot data | In-memory |

### Performance Patterns

#### CQRS (Command Query Responsibility Segregation)
Separate read and write models for optimization.

```
Write Path: Web App → Cosmos DB (write-optimized)
                 ↓ Change Feed
Read Path: Azure Search ← Cosmos DB (indexed, query-optimized)
```

#### Event Sourcing
Store events, not state. Rebuild state from event stream.

**Benefits:**
- Complete audit trail
- Temporal queries
- Easy scaling

### Database Performance

| Pattern | When to Use |
|---------|-------------|
| **Read replicas** | Read-heavy workloads |
| **Sharding** | Data exceeds single node |
| **Connection pooling** | Many short-lived connections |
| **Indexing strategy** | Query performance issues |

### Performance Checklist

- [ ] Autoscaling configured and tested
- [ ] CDN for static content
- [ ] Redis cache for hot data
- [ ] Database indexes reviewed
- [ ] Connection pooling enabled
- [ ] Load testing completed
- [ ] Performance baselines established

---

## Reference Architectures

### Web Application (Standard)

```
Internet → Front Door (CDN, WAF) → App Service
                                    ↓
                              Azure SQL + Redis Cache
                                    ↓
                              Key Vault, Storage
```

### Microservices (Azure Kubernetes Service)

```
Internet → API Management → AKS Ingress
                              ↓
                        Service Mesh (pods)
                              ↓
                        Cosmos DB, Service Bus
                              ↓
                        Azure Monitor, Key Vault
```

### Serverless (Event-Driven)

```
Event Sources → Event Grid → Azure Functions
                                   ↓
                              Cosmos DB, Storage
                                   ↓
                              Logic Apps (orchestration)
```

---

## Quick Reference

### SKU Selection Guide

| Tier | CPU | Memory | Use Case |
|------|-----|--------|----------|
| B-series | Burstable | Variable | Dev/test |
| D-series | General | Balanced | Most production |
| E-series | Memory-optimized | High | In-memory databases |
| F-series | Compute-optimized | Low | CPU-intensive |

### Common Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Monolithic deployment | All or nothing | Microservices or modular |
| Hardcoded config | Environment-specific | App Configuration, Key Vault |
| Single region | No DR | Multi-region with Traffic Manager |
| Over-provisioned "just in case" | Wasted cost | Right-size + autoscale |
| No IaC | Drift, manual errors | Bicep/Terraform everything |

---

## Module 6: MCP Tool Integration

### Required Extensions & MCP Servers

| Component | ID / Name | Purpose |
|-----------|-----------|--------|
| **VS Code Extension** | `ms-azuretools.vscode-azure-github-copilot` | Azure GitHub Copilot integration |
| **VS Code Extension** | `ms-azuretools.vscode-azureresourcegroups` | Azure resource management |
| **VS Code Extension** | `ms-vscode.azure-account` | Azure authentication |
| **MCP Server** | `azure-mcp` | 40+ Azure tools (cloudarchitect, docs, services) |

**Installation**:
```bash
# VS Code Extensions
code --install-extension ms-azuretools.vscode-azure-github-copilot
code --install-extension ms-azuretools.vscode-azureresourcegroups
code --install-extension ms-vscode.azure-account

# MCP Server (via VS Code settings.json or mcp.json)
# Enabled via chat.mcp.gallery.enabled = true
```

### Fallback Patterns (When MCP Unavailable)

If Azure MCP tools are not available, use these alternatives:

| MCP Tool | Fallback Approach |
|----------|-------------------|
| `cloudarchitect` | Use WAF Assessment: https://aka.ms/waf-assessment |
| `documentation` | Search https://learn.microsoft.com/azure/architecture |
| `get_bestpractices` | Reference Azure Architecture Center patterns |
| Service-specific tools | Use Azure Portal or `az` CLI directly |

**Manual Architecture Design Process**:
1. Review WAF pillars checklist in Module 1-5
2. Use Azure Architecture Center reference architectures
3. Validate with Azure Advisor in portal
4. Apply patterns from this skill's modules

### Available Azure MCP Tools

Alex has access to 40+ Azure MCP tools for real-time architecture assistance:

| Category | Tools | Use Cases |
|----------|-------|-----------|
| **Architecture Design** | `mcp_azure_mcp_cloudarchitect` | Interactive architecture design, WAF guidance |
| **Documentation** | `mcp_azure_mcp_documentation` | Search Azure docs, best practices |
| **Best Practices** | `mcp_azure_mcp_get_bestpractices` | Code gen, deployment, Functions patterns |
| **Compute** | `mcp_azure_mcp_aks`, `mcp_azure_mcp_appservice`, `mcp_azure_mcp_functionapp` | Container orchestration, web apps, serverless |
| **Data** | `mcp_azure_mcp_cosmos`, `mcp_azure_mcp_sql`, `mcp_azure_mcp_postgres` | Database recommendations |
| **Security** | `mcp_azure_mcp_keyvault`, `mcp_azure_mcp_role` | Secrets management, RBAC |
| **Monitoring** | `mcp_azure_mcp_monitor`, `mcp_azure_mcp_applicationinsights` | Observability setup |
| **DevOps** | `mcp_azure_mcp_deploy`, `mcp_azure_mcp_azd` | Deployment automation |

### Cloud Architect Tool

The `mcp_azure_mcp_cloudarchitect` tool provides **interactive guided architecture design**:

```text
Invocation → Ask about user/company → 
  Gather requirements → 
    Build architecture by tier → 
      Present with ASCII diagrams

Architecture Tiers:
├── Infrastructure (VNets, VMs, Load Balancers)
├── Platform (App Service, AKS, Functions)
├── Application (Logic Apps, API Management)
├── Data (SQL, Cosmos, Storage)
├── Security (Key Vault, WAF, DDoS)
└── Operations (Monitor, Log Analytics)
```

The tool tracks:
- **Explicit requirements** — Directly stated by user
- **Implicit requirements** — Inferred from context
- **Assumed requirements** — Industry/domain defaults

### Best Practices Tool

Use `mcp_azure_mcp_get_bestpractices` with these resource/action combinations:

| Resource | Actions |
|----------|---------|
| `codegen` | `all` — Code generation patterns |
| `deployment` | `all` — Deployment best practices |
| `functions` | `all` — Azure Functions patterns |
| `swa` | `all` — Static Web App guidance |
| `coding-agent` | `all` — MCP setup for repos |

### When to Use MCP Tools

| Scenario | Tool | Why |
|----------|------|-----|
| "Design new Azure solution" | `cloudarchitect` | Interactive, pillar-aligned |
| "What's the best way to..." | `documentation` | Search official docs |
| "Generate Azure code" | `get_bestpractices` + specific tools | Current patterns |
| "Cost optimization review" | `cloudarchitect` + `monitor` | Full picture |
| "Security assessment" | `keyvault` + `role` + `documentation` | Multi-tool analysis |

### Example: Interactive Architecture Session

```
User: "Design a solution for a retail e-commerce platform"

Alex invokes: mcp_azure_mcp_cloudarchitect with:
  - intent: "Design e-commerce architecture"
  - nextQuestionNeeded: true
  - state: {initial}

Tool asks: "What's your role and company size?"
User: "CTO of a mid-size retailer"

Tool continues gathering:
  - Expected traffic patterns
  - Data residency requirements  
  - Budget constraints
  - Compliance needs (PCI-DSS for payments)

Tool outputs:
  - Component table with SKU recommendations
  - ASCII architecture diagram
  - WAF pillar alignment
  - Cost estimation
```

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "Azure architecture", "cloud design" | Full skill activation |
| "reliability", "high availability", "resilience" | Module 1 |
| "security", "zero trust", "identity" | Module 2 |
| "cost", "optimize", "savings" | Module 3 |
| "IaC", "Bicep", "observability" | Module 4 |
| "performance", "scaling", "caching" | Module 5 |
| "MCP", "cloud architect tool", "Azure tools" | Module 6 |
| "design architecture interactively" | Invoke cloudarchitect tool |

---

*Skill updated: 2026-02-14 | Category: Cloud/Infrastructure | Status: Active | MCP-Enhanced: Yes*

---

---

# Azure OpenAI Patterns

> Rate limiting, function calling, error handling, and token optimization for Azure OpenAI API.

**Version**: 1.0.0

---

## Rate Limiting: The Dual System

Azure OpenAI uses **dual rate limits**: Tokens Per Minute (TPM) and Requests Per Minute (RPM). The ratio is typically 6 RPM per 1000 TPM.

### TPM vs RPM Relationship

| Model | Tier | TPM | RPM | Ratio |
|-------|------|-----|-----|-------|
| gpt-4o | Default | 450K | 2.7K | 6 RPM/1K TPM |
| gpt-4o-mini | Default | 2M | 12K | 6 RPM/1K TPM |
| gpt-4o | Enterprise | 30M | 180K | 6 RPM/1K TPM |

### How TPM is Calculated

TPM is estimated **before processing** based on:

1. Prompt text character count (converted to estimated tokens)
2. `max_tokens` parameter setting
3. `best_of` parameter setting (if used)

The rate limit estimate is NOT the same as actual token consumption for billing.

### Burst vs Sustained Limits

RPM is enforced over **small time windows** (1-10 seconds):

```text
600 RPM deployment = max 10 requests per second
If you send 15 requests in 1 second → 429 error
Even though 15/min < 600/min
```

---

## Function Calling Patterns

### Pattern 1: Exponential Backoff with Status Callback

```typescript
async function chatWithTools(
  messages: ChatCompletionMessage[],
  tools: Tool[],
  onStatusUpdate?: (status: string) => void
): Promise<ChatCompletionResponse> {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, tools, tool_choice: 'auto' }),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 429 && attempt < maxRetries) {
      const waitTime = Math.pow(2, attempt);
      onStatusUpdate?.(`Rate limited. Waiting ${waitTime}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      continue;
    }

    throw new Error(`API error: ${response.status}`);
  }
}
```

### Pattern 2: Optimize max_tokens

```typescript
// Bad: Set unnecessarily high max_tokens — uses full quota even for short responses
const badRequest = { messages: [...], max_tokens: 4000 };

// Good: Set appropriate max_tokens for expected response length
const goodRequest = { messages: [...], max_tokens: 500 };
```

### Pattern 3: Tool Result Batching

```typescript
// Bad: Send one request per tool result (consumes RPM quota)
for (const toolCall of toolCalls) {
  const result = await executeFunction(toolCall);
  await sendToolResult(result);
}

// Good: Collect all results and send once
const results = await Promise.all(
  toolCalls.map(tc => executeFunction(tc))
);
await sendToolResults(results); // Single request
```

---

## Response Headers to Monitor

```typescript
const headers = response.headers;
const remainingRequests = headers.get('x-ratelimit-remaining-requests');
const remainingTokens = headers.get('x-ratelimit-remaining-tokens');
const resetRequests = headers.get('x-ratelimit-reset-requests');
const resetTokens = headers.get('x-ratelimit-reset-tokens');
const retryAfter = headers.get('Retry-After'); // Only on 429
```

---

## Function Design Best Practices

### 1. Minimize Token Consumption

```typescript
// Bad: Return entire resource objects
{ name: 'get_resources', description: 'Get all Azure resources' }
// Returns: huge JSON with all properties

// Good: Return only necessary fields
{ name: 'get_resources', description: 'Get Azure resource summary' }
// Returns: { name, type, status } only
```

### 2. Use parallel_tool_calls

```typescript
const request = {
  messages,
  tools,
  parallel_tool_calls: true, // Default: true in newer models
};
// Model may call multiple tools in one response, reducing round trips
```

### 3. Request Queuing for High Volume

```typescript
class RequestQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private minDelayMs = 100; // 10 req/sec max

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try { resolve(await request()); }
        catch (e) { reject(e); }
        await this.delay(this.minDelayMs);
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const next = this.queue.shift();
      await next?.();
    }
    this.processing = false;
  }

  private delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }
}
```

---

## Error Codes and Handling

| Code | Meaning | Action |
|------|---------|--------|
| 429 | Rate limited | Exponential backoff, check Retry-After |
| 400 | Invalid request | Check request format, content filter |
| 401 | Authentication error | Refresh token |
| 403 | Quota exceeded | Wait or upgrade tier |
| 500 | Server error | Retry with backoff |
| 503 | Service unavailable | Retry with longer backoff |

### Content Filter Handling

```typescript
if (response.status === 400) {
  const error = await response.json();
  if (error.error?.code === 'content_filter') {
    return { message: 'Content was filtered by safety policy.', filtered: true };
  }
}
```

---

## Recommended Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| max_tokens | 500-2000 | Sized for expected response |
| temperature | 0.3-0.7 | Lower for tool calling, higher for creative |
| retry attempts | 5 | Handles transient rate limits |
| base delay | 2000ms | Start at 2s for backoff |
| max delay | 60000ms | Cap at 1 minute |

---

## References

- [Azure OpenAI quotas and limits](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits)
- [Manage Azure OpenAI quota](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/quota)
- [Best practices for function calling](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/function-calling)

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "azure openai", "rate limit", "429" | Full skill activation |
| "function calling", "tool calling" | Function Calling Patterns section |
| "token optimization", "max_tokens" | Pattern 2 + Recommended Settings |
| "retry", "backoff" | Pattern 1 + Error Codes |
| "request queue", "high volume" | Pattern 3 |

---

# Azure Deployment Operations

> Battle-tested patterns for deploying and operating Azure services in production.

**Scope**: Inheritable skill. Covers SWA, Container Apps, App Service, security posture, rate limiting, production checklists, and multi-subscription management.

## Azure Static Web Apps (SWA)

### Environment Deployment

SWA defaults to **preview** environments. Always specify production explicitly:

```bash
# Anti-pattern: deploys to preview environment
swa deploy

# Correct: explicitly target production
swa deploy --env production
```

**Rule**: Every SWA deployment command in CI/CD and scripts MUST include `--env production` unless creating a preview intentionally.

### Custom Domain Registration

Custom domains require a two-step process:

| Step | Action | Validates |
|------|--------|----------|
| 1. **CNAME record** | Point domain to SWA default hostname | DNS ownership |
| 2. **Hostname registration** | `az staticwebapp hostname set` | Azure binding |

**Common error**: Adding CNAME but forgetting hostname registration. Both steps are required.

### SWA Configuration

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/assets/*"]
  },
  "routes": [
    { "route": "/api/*", "allowedRoles": ["authenticated"] }
  ],
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  }
}
```

## Azure Container Apps

### Health Probe Configuration

Container Apps health probes have specific threshold ranges:

| Parameter | Min | Max | Recommended |
|-----------|-----|-----|-------------|
| `failureThreshold` | 1 | 48 | 3-5 for liveness, 10-30 for startup |
| `periodSeconds` | 1 | 240 | 10 for liveness, 5 for startup |
| `initialDelaySeconds` | 0 | 60 | 0 for liveness (use startup probe instead) |
| `timeoutSeconds` | 1 | 240 | 5 |

**Pattern**: Use a **startup probe** with high failure threshold (30) for slow-starting apps instead of a high `initialDelaySeconds` on the liveness probe.

### Container Apps Deployment

```bash
# Update with new image
az containerapp update \
  --name myapp \
  --resource-group myrg \
  --image myregistry.azurecr.io/myapp:v1.2.3

# Scale configuration
az containerapp update \
  --name myapp \
  --resource-group myrg \
  --min-replicas 1 \
  --max-replicas 10
```

## Azure App Service

### 11-Step Deployment Pipeline

Typical App Service deployment takes ~7 minutes:

| Step | Duration | Action |
|------|----------|--------|
| 1 | 5s | Authenticate to Azure |
| 2 | 10s | Validate resource group exists |
| 3 | 30s | Build application |
| 4 | 15s | Run tests |
| 5 | 20s | Package artifacts |
| 6 | 10s | Upload to staging slot |
| 7 | 60s | Warm up staging slot |
| 8 | 5s | Run smoke tests on staging |
| 9 | 30s | Swap staging → production |
| 10 | 10s | Validate production health |
| 11 | 5s | Tag release in source control |

**Rule**: Always use staging slots for zero-downtime deployment. Direct-to-production deployments cause cold-start downtime.

### Production Readiness Checklist

| Category | Requirement | Why |
|----------|------------|-----|
| **Compute** | P1v3 or higher | Burstable tiers have CPU throttling |
| **Networking** | VNet integration | Isolate from public internet |
| **Data** | Private endpoints for storage/DB | No public connection strings |
| **Identity** | Managed identity (no connection strings) | Eliminates secret rotation |
| **Monitoring** | Application Insights enabled | Observability |
| **Scaling** | Auto-scale rules configured | Handle load spikes |
| **Backup** | Automated backup policy | Disaster recovery |
| **SSL** | Custom domain + managed certificate | Trust and security |

## Security Posture Assessment

### Pass/Fail Matrix

Use a matrix to track security controls across all resources:

| Control | App Service | SQL DB | Storage | Key Vault |
|---------|:-----------:|:------:|:-------:|:---------:|
| Managed Identity | ✅ | ✅ | ✅ | ✅ |
| Private Endpoint | ✅ | ✅ | ❌ | ✅ |
| Diagnostic Logs | ✅ | ❌ | ✅ | ✅ |
| RBAC (no keys) | ✅ | ✅ | ❌ | ✅ |
| Encryption at Rest | ✅ | ✅ | ✅ | ✅ |

**Rule**: Any ❌ in the matrix is a tracked remediation item with a priority (P0-P3) and SLA.

## Rate Limiting

### Spread vs. Burst

For API calls and deployment operations:

| Strategy | Pattern | Use When |
|----------|---------|----------|
| **Spread** | 10 calls/sec evenly spaced | Sustained throughput |
| **Burst** | 100 calls then wait | Quick batch operations |

**Rule**: Prefer **spread** over burst for production workloads. Azure APIs throttle based on request rate, and burst patterns hit throttle limits earlier than spread patterns with the same total throughput.

### Retry Pattern

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === maxRetries) throw err;
      if (err.statusCode === 429) {
        // Use Retry-After header if available
        const delay = err.headers?.['retry-after']
          ? parseInt(err.headers['retry-after']) * 1000
          : baseDelay * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err; // Don't retry non-throttle errors
      }
    }
  }
  throw new Error('Unreachable');
}
```

## Multi-Subscription Management

### Folder Organization

For organizations with multiple Azure subscriptions:

```
azure/
├── production/
│   ├── main.bicep
│   └── parameters.prod.json
├── staging/
│   ├── main.bicep
│   └── parameters.staging.json
├── development/
│   └── parameters.dev.json
└── shared/
    ├── modules/          # Shared Bicep modules
    └── policies/         # Azure Policy definitions
```

### Resource Inventory

Before any infrastructure changes, document what exists:

```bash
# List all resources in subscription
az resource list --subscription "My Subscription" \
  --output table \
  --query "[].{Name:name, Type:type, RG:resourceGroup, Location:location}"

# Export to JSON for diff tracking
az resource list --subscription "My Subscription" -o json > inventory.json
```

### Subscription Documentation Template

Each subscription should have a living document with:

| Section | Content |
|---------|---------|
| **Purpose** | What this subscription is for |
| **Owner** | Team/person responsible |
| **Budget** | Monthly spend limit and alerts |
| **Resources** | Link to inventory command output |
| **Access** | RBAC assignments and justification |
| **Networking** | VNet topology, peering, DNS zones |

## Known Gotchas

### Mail.Send on Corporate Tenants

Microsoft 365 corporate tenants often **block** `Mail.Send` permission for third-party apps. If your app needs to send email:

1. Check tenant admin consent policies first
2. Consider `SendMail` via Graph with delegated (not application) permissions
3. Have a fallback (SMTP, SendGrid) for blocked tenants
4. Document the limitation clearly for users

### Azure CLI Context

```bash
# Always verify which subscription is active
az account show --query "{Name:name, Id:id}" -o table

# Set explicitly before operations
az account set --subscription "Target Subscription"
```

**Rule**: Never assume the correct subscription is active. Always verify or set explicitly in scripts.

## Infrastructure as Code

### Bicep Best Practices for Deployment

| Practice | Why |
|----------|-----|
| Use modules for reusable components | DRY principle |
| Parameters file per environment | Environment isolation |
| `@secure()` decorator for secrets | Prevents logging |
| `existing` keyword for references | No accidental recreation |
| What-if before deploy | Catch unintended changes |

```bash
# Always preview changes before deploying
az deployment group what-if \
  --resource-group myrg \
  --template-file main.bicep \
  --parameters @parameters.prod.json
```

---

# Infrastructure as Code Skill

> **Domain**: DevOps & Cloud Engineering
> **Inheritance**: inheritable
> **Version**: 1.0.0
> **Last Updated**: 2026-02-01

---

## Overview

Comprehensive patterns for defining, provisioning, and managing cloud infrastructure through declarative code. Covers major IaC tools (Terraform, Bicep, Pulumi, CloudFormation), best practices for modularity, state management, testing, and GitOps workflows.

---

## IaC Fundamentals

### Why Infrastructure as Code?

```text
Manual Infrastructure          Infrastructure as Code
┌─────────────────────┐       ┌─────────────────────┐
│  Click in Console   │       │  Write Code         │
│  Document Steps     │       │  Version Control    │
│  Hope It's Repeated │       │  Review & Approve   │
│  Drift Over Time    │       │  Automated Deploy   │
│  Unclear State      │       │  Consistent State   │
└─────────────────────┘       └─────────────────────┘
```

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Repeatability** | Same code = same infrastructure, every time |
| **Version Control** | Track changes, rollback, audit history |
| **Collaboration** | Code review, PRs, shared ownership |
| **Documentation** | Code IS the documentation |
| **Testing** | Validate before deploy |
| **Speed** | Provision environments in minutes |

### Declarative vs Imperative

| Approach | Description | Tools |
|----------|-------------|-------|
| **Declarative** | Describe desired end state | Terraform, Bicep, CloudFormation |
| **Imperative** | Describe steps to reach state | Scripts, Ansible, Pulumi (optional) |

**Prefer declarative** — let the tool figure out how to reach the desired state.

---

## Tool Comparison

| Tool | Provider | Language | State | Best For |
|------|----------|----------|-------|----------|
| **Terraform** | HashiCorp | HCL | Remote/Local | Multi-cloud, mature ecosystem |
| **Bicep** | Microsoft | Bicep DSL | Azure-managed | Azure-native, simple syntax |
| **Pulumi** | Pulumi | TS/Python/Go/C# | Managed/Self | Developers who prefer real languages |
| **CloudFormation** | AWS | YAML/JSON | AWS-managed | AWS-only, deep integration |
| **ARM Templates** | Microsoft | JSON | Azure-managed | Legacy Azure (prefer Bicep) |
| **CDK** | AWS | TS/Python/Java | AWS-managed | Developers on AWS |

---

## Terraform Patterns

### Project Structure

```text
infrastructure/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   └── prod/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── compute/
│   └── database/
└── shared/
    └── providers.tf
```

### Basic Resource Pattern

```hcl
# variables.tf
variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  type        = string
  default     = "eastus2"
  description = "Azure region for resources"
}

# main.tf
resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project}-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = var.project
  }
}

# outputs.tf
output "resource_group_id" {
  value       = azurerm_resource_group.main.id
  description = "The ID of the resource group"
}
```

### Module Pattern

```hcl
# modules/app-service/variables.tf
variable "name" {
  type        = string
  description = "Name of the App Service"
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "sku" {
  type = object({
    tier = string
    size = string
  })
  default = {
    tier = "Standard"
    size = "S1"
  }
}

# modules/app-service/main.tf
resource "azurerm_service_plan" "main" {
  name                = "asp-${var.name}"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.sku.size
}

resource "azurerm_linux_web_app" "main" {
  name                = "app-${var.name}"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = var.sku.tier != "Free"
  }
}

# Usage in environment
module "api" {
  source = "../../modules/app-service"

  name                = "myapi-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  sku = {
    tier = var.environment == "prod" ? "Premium" : "Standard"
    size = var.environment == "prod" ? "P1v3" : "S1"
  }
}
```

### State Management

```hcl
# backend.tf
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "stterraformstate"
    container_name       = "tfstate"
    key                  = "myproject/dev/terraform.tfstate"
  }
}
```

**State Best Practices:**
- ✅ Use remote state (never local for teams)
- ✅ Enable state locking
- ✅ Encrypt state at rest
- ✅ Separate state per environment
- ❌ Never commit `.tfstate` files
- ❌ Never manually edit state

### Data Sources

```hcl
# Reference existing resources
data "azurerm_key_vault" "shared" {
  name                = "kv-shared-${var.environment}"
  resource_group_name = "rg-shared-${var.environment}"
}

data "azurerm_key_vault_secret" "db_password" {
  name         = "db-admin-password"
  key_vault_id = data.azurerm_key_vault.shared.id
}

# Use in resource
resource "azurerm_mssql_server" "main" {
  name                         = "sql-${var.project}-${var.environment}"
  administrator_login          = "sqladmin"
  administrator_login_password = data.azurerm_key_vault_secret.db_password.value
  # ...
}
```

---

## Bicep Patterns (Azure)

### Basic Structure

```bicep
// main.bicep
targetScope = 'subscription'

@allowed(['dev', 'staging', 'prod'])
param environment string

param location string = 'eastus2'

var resourceGroupName = 'rg-myproject-${environment}'

resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: resourceGroupName
  location: location
  tags: {
    Environment: environment
    ManagedBy: 'Bicep'
  }
}

module appService 'modules/app-service.bicep' = {
  scope: rg
  name: 'appServiceDeployment'
  params: {
    appName: 'app-myproject-${environment}'
    location: location
    sku: environment == 'prod' ? 'P1v3' : 'S1'
  }
}

output resourceGroupId string = rg.id
output appServiceUrl string = appService.outputs.defaultHostName
```

### Module Pattern

```bicep
// modules/app-service.bicep
@description('Name of the App Service')
param appName string

param location string = resourceGroup().location

@allowed(['F1', 'S1', 'P1v3'])
param sku string = 'S1'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'asp-${appName}'
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: sku != 'F1'
    }
  }
}

output defaultHostName string = webApp.properties.defaultHostName
output appServiceId string = webApp.id
```

### Bicep vs Terraform for Azure

| Aspect | Bicep | Terraform |
|--------|-------|-----------|
| Azure Support | Day-0 | Day-1 to Day-N |
| Multi-cloud | ❌ | ✅ |
| State Management | Azure-managed | Self-managed |
| Learning Curve | Lower | Moderate |
| Community Modules | Limited | Extensive |
| Type Safety | Strong | Moderate |

**Recommendation**: Bicep for Azure-only; Terraform for multi-cloud or complex scenarios.

---

## Pulumi Patterns

### TypeScript Example

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

const config = new pulumi.Config();
const environment = config.require("environment");

// Resource Group
const resourceGroup = new azure.resources.ResourceGroup("rg", {
  resourceGroupName: `rg-myproject-${environment}`,
  location: "eastus2",
  tags: {
    Environment: environment,
    ManagedBy: "Pulumi",
  },
});

// App Service Plan
const appServicePlan = new azure.web.AppServicePlan("asp", {
  resourceGroupName: resourceGroup.name,
  kind: "Linux",
  reserved: true,
  sku: {
    name: environment === "prod" ? "P1v3" : "S1",
    tier: environment === "prod" ? "Premium" : "Standard",
  },
});

// Web App
const webApp = new azure.web.WebApp("app", {
  resourceGroupName: resourceGroup.name,
  serverFarmId: appServicePlan.id,
  siteConfig: {
    linuxFxVersion: "NODE|20-lts",
    alwaysOn: true,
  },
});

export const endpoint = pulumi.interpolate`https://${webApp.defaultHostName}`;
```

### When to Use Pulumi

✅ **Good fit:**
- Team prefers TypeScript/Python/Go over HCL
- Need complex logic (loops, conditionals, API calls)
- Want type checking and IDE support
- Building reusable libraries

❌ **Consider alternatives:**
- Simple infrastructure needs
- Team experienced with Terraform
- Need maximum community resources

---

## Best Practices

### Naming Conventions

```text
Pattern: {resource-type}-{project}-{environment}-{region}-{instance}

Examples:
  rg-myproject-prod-eus2           (Resource Group)
  app-myproject-prod-eus2          (App Service)
  sql-myproject-prod-eus2          (SQL Server)
  kv-myproject-prod-eus2           (Key Vault)
  st-myproject-prod-eus2           (Storage - no hyphens)
```

### Tagging Strategy

```hcl
locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
    CostCenter  = var.cost_center
    Owner       = var.owner_email
    CreatedDate = timestamp()
  }
}

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project}-${var.environment}"
  location = var.location
  tags     = local.common_tags
}
```

### Secrets Management

```text
❌ DON'T: Hard-code secrets in IaC
❌ DON'T: Store secrets in tfvars files
❌ DON'T: Commit secrets to version control

✅ DO: Use Key Vault / Secrets Manager
✅ DO: Reference secrets via data sources
✅ DO: Use CI/CD pipeline secrets
✅ DO: Use managed identities where possible
```

### Environment Parity

```text
┌─────────────────────────────────────────────────────────┐
│                    Same Code Base                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   dev.tfvars      staging.tfvars      prod.tfvars      │
│   ┌─────────┐     ┌─────────┐        ┌─────────┐       │
│   │ SKU: S1 │     │ SKU: S1 │        │ SKU: P1v3│      │
│   │ Count:1 │     │ Count:2 │        │ Count:3  │      │
│   └─────────┘     └─────────┘        └─────────┘       │
│        │               │                  │             │
│        ▼               ▼                  ▼             │
│   ┌─────────┐     ┌─────────┐        ┌─────────┐       │
│   │   DEV   │     │ STAGING │        │  PROD   │       │
│   └─────────┘     └─────────┘        └─────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Testing IaC

### Static Analysis

```bash
# Terraform
terraform fmt -check
terraform validate
tflint
tfsec  # Security scanning
checkov  # Policy as code

# Bicep
az bicep build --file main.bicep  # Syntax check
```

### Unit Testing (Terraform)

```hcl
# tests/app_service_test.tftest.hcl
run "app_service_creates_correctly" {
  command = plan

  variables {
    environment = "dev"
    project     = "test"
  }

  assert {
    condition     = azurerm_linux_web_app.main.site_config[0].always_on == true
    error_message = "Always-on should be enabled"
  }
}
```

### Integration Testing

```bash
# Deploy to ephemeral environment
terraform apply -auto-approve -var="environment=test-${BUILD_ID}"

# Run integration tests
npm test

# Destroy ephemeral environment
terraform destroy -auto-approve -var="environment=test-${BUILD_ID}"
```

---

## CI/CD Patterns

### GitHub Actions Workflow

```yaml
name: Infrastructure

on:
  push:
    branches: [main]
    paths: ['infrastructure/**']
  pull_request:
    paths: ['infrastructure/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.7.0

      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure/environments/prod
        env:
          ARM_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          ARM_SUBSCRIPTION_ID: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          ARM_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
          ARM_USE_OIDC: true

      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: infrastructure/environments/prod

      - name: Upload Plan
        uses: actions/upload-artifact@v4
        with:
          name: tfplan
          path: infrastructure/environments/prod/tfplan

  apply:
    needs: plan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3

      - name: Download Plan
        uses: actions/download-artifact@v4
        with:
          name: tfplan
          path: infrastructure/environments/prod

      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
        working-directory: infrastructure/environments/prod
```

### GitOps Flow

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Feature    │     │    Pull      │     │    Main      │
│   Branch     │ ──► │   Request    │ ──► │   Branch     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
  terraform plan      terraform plan       terraform apply
  (local preview)     (CI check)           (automated)
```

---

## Common Patterns

### Conditional Resources

```hcl
# Terraform
resource "azurerm_application_insights" "main" {
  count = var.enable_monitoring ? 1 : 0

  name                = "appi-${var.project}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  application_type    = "web"
}
```

### Dynamic Blocks

```hcl
resource "azurerm_network_security_group" "main" {
  name                = "nsg-${var.project}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location

  dynamic "security_rule" {
    for_each = var.security_rules
    content {
      name                       = security_rule.value.name
      priority                   = security_rule.value.priority
      direction                  = security_rule.value.direction
      access                     = security_rule.value.access
      protocol                   = security_rule.value.protocol
      source_port_range          = security_rule.value.source_port_range
      destination_port_range     = security_rule.value.destination_port_range
      source_address_prefix      = security_rule.value.source_address_prefix
      destination_address_prefix = security_rule.value.destination_address_prefix
    }
  }
}
```

### Resource Dependencies

```hcl
# Implicit (recommended)
resource "azurerm_linux_web_app" "main" {
  service_plan_id = azurerm_service_plan.main.id  # Implicit dependency
}

# Explicit (when needed)
resource "azurerm_linux_web_app" "main" {
  depends_on = [azurerm_private_endpoint.sql]  # Wait for private endpoint
}
```

---

## Anti-Patterns

### ❌ Monolithic Configuration

**Problem**: Single massive `.tf` file
**Solution**: Split into logical modules and files

### ❌ Hard-coded Values

**Problem**: Values embedded in resources
**Solution**: Use variables with defaults and tfvars

### ❌ No State Locking

**Problem**: Concurrent applies corrupt state
**Solution**: Enable state locking (DynamoDB for S3, built-in for Azure)

### ❌ Manual Changes

**Problem**: Drift between code and reality
**Solution**: Always change through code, use `terraform import` for existing resources

### ❌ Overly Generic Modules

**Problem**: Modules that try to do everything
**Solution**: Purpose-built modules with sensible defaults

---

## MCP Tool Integration

### Required Extensions & MCP Servers

| Component | ID / Name | Purpose |
|-----------|-----------|--------|
| **VS Code Extension** | `ms-azuretools.vscode-bicep` | Bicep language support |
| **VS Code Extension** | `hashicorp.terraform` | Terraform language support |
| **VS Code Extension** | `ms-azuretools.vscode-azure-github-copilot` | Azure Copilot integration |
| **MCP Server** | `bicep-mcp` | Bicep tools (AVM, schema, validation) |
| **MCP Server** | `azure-mcp` | Azure architecture and deployment tools |

**Installation**:
```bash
# VS Code Extensions
code --install-extension ms-azuretools.vscode-bicep
code --install-extension hashicorp.terraform
code --install-extension ms-azuretools.vscode-azure-github-copilot

# MCP Servers enabled via VS Code MCP gallery
# Settings: chat.mcp.gallery.enabled = true
```

### Fallback Patterns (When MCP Unavailable)

| MCP Tool | Fallback Approach |
|----------|-------------------|
| `list_avm_metadata` | Browse https://aka.ms/avm/modules |
| `get_az_resource_type_schema` | ARM template reference or `az rest` API |
| `get_bicep_best_practices` | https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices |
| `get_bicep_file_diagnostics` | VS Code Bicep extension or `bicep build` CLI |
| `cloudarchitect` | Azure Architecture Center + WAF Assessment (https://aka.ms/waf-assessment) |
| `documentation` | https://learn.microsoft.com/azure/architecture |

**Terraform Fallbacks** (no MCP yet):
```bash
# Terraform validation
terraform validate
terraform fmt -check

# Provider docs
terraform providers schema -json

# Static analysis
tflint
tfsec
checkov -d .
```

### Available IaC MCP Tools

Alex has access to Bicep MCP tools for enhanced infrastructure as code capabilities:

| Tool | Purpose |
|------|---------|
| `mcp_bicep_list_avm_metadata` | Browse 328 Azure Verified Modules |
| `mcp_bicep_get_az_resource_type_schema` | Get resource type properties and schema |
| `mcp_bicep_get_bicep_best_practices` | Current Bicep coding best practices |
| `mcp_bicep_get_bicep_file_diagnostics` | Validate Bicep files, find errors |
| `mcp_bicep_format_bicep_file` | Auto-format Bicep code |
| `mcp_bicep_decompile_arm_template_file` | Convert ARM JSON → Bicep |
| `mcp_bicep_decompile_arm_parameters_file` | Convert parameters.json → .bicepparam |

### Azure Architecture Tools

| Tool | Purpose |
|------|---------|
| `mcp_azure_mcp_cloudarchitect` | Interactive architecture design aligned with WAF |
| `mcp_azure_mcp_documentation` | Search Azure docs and best practices |
| `mcp_azure_mcp_get_bestpractices` | Code generation and deployment patterns |

### Workflow: MCP-Enhanced IaC

```text
1. Architecture Design
   └─ mcp_azure_mcp_cloudarchitect → Requirements → Component design

2. Module Discovery
   └─ mcp_bicep_list_avm_metadata → Find production-ready modules

3. Schema Lookup
   └─ mcp_bicep_get_az_resource_type_schema → Exact properties

4. Code Generation
   └─ mcp_bicep_get_bicep_best_practices → Write clean code

5. Validation
   └─ mcp_bicep_get_bicep_file_diagnostics → Fix errors early

6. Deployment
   └─ mcp_azure_mcp_deploy → Automated deployment
```

### When to Use MCP Tools

| Scenario | Tool |
|----------|------|
| "What modules exist for X?" | `list_avm_metadata` |
| "What properties does X support?" | `get_az_resource_type_schema` |
| "Review my Bicep file" | `get_bicep_file_diagnostics` |
| "Convert ARM to Bicep" | `decompile_arm_template_file` |
| "Design infrastructure from scratch" | `cloudarchitect` |

**Related Skill**: See `bicep-avm-mastery` for deep Bicep patterns and AVM guidance.

---

## Activation Triggers

- "infrastructure as code", "IaC"
- "Terraform", "Bicep", "Pulumi", "CloudFormation"
- "provision infrastructure", "deploy infrastructure"
- "HCL", "tfvars", "terraform.tfstate"
- "ARM template", "CDK"
- "GitOps", "infrastructure pipeline"
- "MCP Bicep", "AVM modules", "Azure Verified Modules"
- "convert ARM to Bicep", "validate Bicep"

---

## Quick Reference

### IaC Checklist

- [ ] Use remote state with locking
- [ ] Implement consistent naming conventions
- [ ] Apply tagging strategy for all resources
- [ ] Store secrets in Key Vault / Secrets Manager
- [ ] Use modules for reusable components
- [ ] Run static analysis (tflint, tfsec)
- [ ] Set up CI/CD pipeline with plan/apply
- [ ] Document module inputs and outputs
- [ ] Test with ephemeral environments
- [ ] Enable drift detection

### Command Reference

```bash
# Terraform
terraform init          # Initialize backend and providers
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform destroy       # Tear down infrastructure
terraform import        # Import existing resource
terraform state list    # List resources in state
terraform fmt           # Format code

# Bicep
az bicep build          # Compile to ARM
az deployment sub create --location eastus2 --template-file main.bicep
az deployment group create --resource-group rg-name --template-file main.bicep
```

---

*Infrastructure as Code skill — Reliable, repeatable infrastructure through code | MCP-Enhanced: Yes | Updated: 2026-02-14*

---

---

# Observability & Monitoring Skill

> See what's happening in production. Debug without reproducing. Understand system behavior at scale.

## The Three Pillars

| Pillar | What | When | Tools |
|--------|------|------|-------|
| **Logs** | Discrete events | Debugging, auditing | Winston, Pino, Serilog |
| **Metrics** | Aggregated measurements | Alerting, dashboards | Prometheus, CloudWatch |
| **Traces** | Request flow across services | Distributed debugging | Jaeger, Zipkin |

**Modern approach:** OpenTelemetry unifies all three.

---

## Logging Best Practices

### Structured Logging

```typescript
// ❌ Bad: Unstructured
console.log(`User ${userId} clicked button ${buttonId}`);

// ✅ Good: Structured
logger.info('Button clicked', {
  userId,
  buttonId,
  timestamp: Date.now(),
  sessionId: ctx.sessionId
});
```

### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **ERROR** | Something failed, needs attention | Payment failed |
| **WARN** | Unexpected but handled | Retry succeeded |
| **INFO** | Business events | User logged in |
| **DEBUG** | Developer details | Cache hit/miss |
| **TRACE** | Verbose internals | Function entry/exit |

### Correlation IDs

Track requests across services:

```typescript
// Middleware to propagate trace ID
app.use((req, res, next) => {
  req.traceId = req.headers['x-trace-id'] || uuid();
  res.setHeader('x-trace-id', req.traceId);
  next();
});

// Include in all logs
logger.info('Processing request', { traceId: req.traceId, ...data });
```

---

## Metrics Patterns

### The RED Method (Request-focused)

For services:
- **R**ate: Requests per second
- **E**rrors: Failed requests per second
- **D**uration: Request latency distribution

### The USE Method (Resource-focused)

For infrastructure:
- **U**tilization: % time resource busy
- **S**aturation: Queue depth
- **E**rrors: Error count

### Key Metric Types

| Type | Use Case | Example |
|------|----------|---------|
| **Counter** | Cumulative totals | requests_total |
| **Gauge** | Current value | temperature, queue_size |
| **Histogram** | Value distribution | request_duration_seconds |
| **Summary** | Quantiles | response_time_p99 |

### Golden Signals (SRE)

1. **Latency** — Time to serve request
2. **Traffic** — Demand on system
3. **Errors** — Failed requests rate
4. **Saturation** — How full is the system

---

## Distributed Tracing

### Span Structure

```
Trace: user-checkout-abc123
├── Span: api-gateway (50ms)
│   ├── Span: auth-service (10ms)
│   └── Span: order-service (35ms)
│       ├── Span: inventory-check (8ms)
│       └── Span: payment-service (20ms)
│           └── Span: database-write (5ms)
```

### Context Propagation

```typescript
// OpenTelemetry automatic propagation
import { trace, context, propagation } from '@opentelemetry/api';

// Extract context from incoming request
const ctx = propagation.extract(context.active(), req.headers);

// Create span with parent context
const span = tracer.startSpan('process-order', undefined, ctx);

// Propagate to outgoing request
propagation.inject(context.active(), headers);
```

---

## OpenTelemetry Setup

### Node.js Quick Start

```typescript
// tracing.ts - Load FIRST
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

### .NET Quick Start

```csharp
// Program.cs
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter());
```

---

## Alerting Strategy

### Alert Hierarchy

| Severity | Response | Example |
|----------|----------|---------|
| **P1/Critical** | Wake someone up | Service down |
| **P2/High** | Fix within hours | Error rate > 5% |
| **P3/Medium** | Fix within days | Disk 80% |
| **P4/Low** | Fix when convenient | Deprecation warning |

### Alert Anti-Patterns

❌ **Alert fatigue** — Too many non-actionable alerts
❌ **Missing runbook** — Alert with no remediation steps
❌ **Threshold-only** — Alert on static value, not trend
❌ **No owner** — Alert goes to void

### Good Alert Template

```yaml
alert: HighErrorRate
expr: sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m])) > 0.05
for: 5m
labels:
  severity: high
  team: backend
annotations:
  summary: "Error rate above 5%"
  runbook: "https://runbooks.example.com/high-error-rate"
  dashboard: "https://grafana.example.com/d/errors"
```

---

## Dashboard Design

### Layout Principles

```
┌─────────────────────────────────────────────────────────┐
│                   SERVICE HEALTH                         │
│  [Status] [Error Rate] [Latency P50] [Latency P99]      │
├─────────────────────────────────────────────────────────┤
│                   TRAFFIC                                │
│  [Requests/sec graph over time]                         │
├─────────────────────────────────────────────────────────┤
│           ERRORS             │        LATENCY           │
│  [Error breakdown by type]   │  [Latency histogram]     │
├─────────────────────────────────────────────────────────┤
│                   RESOURCES                              │
│  [CPU] [Memory] [Disk] [Network]                        │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Hierarchy

1. **Overview** — Executive view, all services
2. **Service** — Single service deep dive
3. **Debug** — Detailed metrics for investigation

---

## Cloud Provider Tools

| Cloud | Metrics | Logs | Traces |
|-------|---------|------|--------|
| **Azure** | Azure Monitor | Log Analytics | App Insights |
| **AWS** | CloudWatch | CloudWatch Logs | X-Ray |
| **GCP** | Cloud Monitoring | Cloud Logging | Cloud Trace |

### Azure Application Insights

```typescript
// Node.js
import { useAzureMonitor } from '@azure/monitor-opentelemetry';

useAzureMonitor({
  azureMonitorExporterOptions: {
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  }
});
```

---

## VS Code Extension Observability

For VS Code extensions like Alex:

### What to Monitor

| Metric | Why |
|--------|-----|
| Command execution time | User experience |
| Activation time | Startup performance |
| Error rates by command | Reliability |
| Memory usage | Resource efficiency |
| API call latency | External dependencies |

### Telemetry Implementation

```typescript
import * as vscode from 'vscode';

const telemetry = vscode.env.createTelemetryLogger({
  sendEventData(eventName, data) {
    // Send to your telemetry backend
  },
  sendErrorData(error, data) {
    // Send errors with context
  }
});

// Usage
telemetry.logUsage('command.executed', {
  commandId: 'alex.meditate',
  durationMs: 1500
});
```

---

## Debugging Patterns

### Log-Driven Debugging

1. Find error in logs
2. Get correlation ID
3. Search all logs with that ID
4. Reconstruct timeline

### Trace-Driven Debugging

1. Find slow/failed trace
2. Examine span waterfall
3. Identify bottleneck span
4. Drill into that service

### Metric-Driven Debugging

1. Notice anomaly in dashboard
2. Correlate with other metrics
3. Narrow time window
4. Switch to logs/traces for details

---

## Implementation Checklist

### New Service

- [ ] Structured logging configured
- [ ] Correlation ID propagation
- [ ] Basic metrics (RED/USE)
- [ ] Health check endpoint
- [ ] OpenTelemetry instrumentation
- [ ] Dashboard created
- [ ] Alerts defined with runbooks

### Production Readiness

- [ ] Error rates < 0.1% baseline
- [ ] P99 latency acceptable
- [ ] Logs searchable and retained
- [ ] Traces sampling configured
- [ ] On-call runbooks written

---

## Related Skills

- **performance-profiling** — Deep dive into specific bottlenecks
- **incident-response** — Using observability during outages
- **infrastructure-as-code** — Deploying monitoring stack
- **security-review** — Audit logging requirements

---

*"If you can't measure it, you can't improve it." — Peter Drucker*

*Good observability means finding the problem before your users do.*
