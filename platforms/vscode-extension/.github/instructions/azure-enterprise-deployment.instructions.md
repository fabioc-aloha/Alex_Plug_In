---
description: "Enterprise Azure deployment patterns - pre-deployment validation, permission blockers, phased rollout strategies"
applyTo: "**/azure/**,**/infrastructure/**,**/*deploy*.{ps1,sh,md}"
---

# Azure Enterprise Deployment Patterns

**Classification**: Procedural Knowledge | Enterprise Infrastructure  
**Activation**: Azure deployment, enterprise infrastructure, permission validation, phased rollout  
**Domain**: Cloud infrastructure deployment in enterprise environments with policy restrictions

---

## Synapses

- [.github/instructions/research-first-workflow.instructions.md] (High, Uses, Forward) - "Pre-deployment validation is research phase for infrastructure work"
- [.github/instructions/empirical-validation.instructions.md] (High, Implements, Bidirectional) - "Validation commands provide empirical evidence of deployment readiness"
- [.github/instructions/release-management.instructions.md] (Medium, Patterns, Bidirectional) - "Similar pre-release validation checklists"
- [platforms/m365-copilot/TEAMS-DEEP-INTEGRATION-PLAN.md] (Critical, Exemplifies, Forward) - "Reference implementation with 143-item deployment checklist"

---

## Core Principles

1. **Validate Before Deploy**: Check permissions, policies, resource providers BEFORE infrastructure provisioning
2. **Document Blockers with Workarounds**: Enterprise restrictions are common - provide 3-4 solution paths
3. **Enable Phased Deployment**: Allow parallel progress when approval processes create dependencies
4. **Fact-Check Against Official Documentation**: Validate all technical claims with authoritative sources
5. **Comprehensive Checklists for Complex Deployments**: 100+ item tracking systems for multi-phase work

---

## Pre-Deployment Validation Checklist

### 1. Azure Subscription Permissions

```powershell
# Verify authenticated and correct subscription
az account show

# Check RBAC role assignments
az role assignment list --assignee $(az account show --query user.name -o tsv) `
  --all --query "[].roleDefinitionName"

# Required roles for infrastructure deployment:
# - Contributor (or higher) for resource creation
# - User Access Administrator (for managed identity role assignments)
# - Application Administrator (for service principal creation)
```

### 2. Azure Policy Compliance

```powershell
# List all policy assignments at subscription level
az policy assignment list --query "[].{Name:displayName, Effect:parameters.effect.value}"

# Check for common blocking policies:
# - Allowed locations (region restrictions)
# - Allowed resource types (service restrictions)
# - Required tags (metadata requirements)
# - Allowed SKUs (tier restrictions)
```

**Common Blocking Policies**:

| Policy | Impact | Workaround |
|--------|--------|------------|
| Allowed locations | ❌ Deployment fails if region not in allowlist | Request policy exemption OR deploy to allowed region |
| Deny public IPs | ❌ Cannot create public endpoints | Use private endpoints + VPN/ExpressRoute |
| Require specific tags | ⚠️ Deployment fails without tags | Add tags to ARM/Bicep templates |
| Allowed SKUs | ⚠️ Cannot use Free/Consumption tiers | Request exemption OR use allowed tier |

### 3. Entra App Registration Permissions

```powershell
# Test app registration permission
az ad app create --display-name "test-permissions-$(Get-Random)"

# If successful, you can create apps
# If fails with "ServiceManagementReference" error → blocked
```

**Entra App Registration Blocker Solutions**:

1. **Request Admin-Created App**:
   - Email Entra administrator with complete app specification
   - Include redirect URIs, API permissions, client secret requirements
   - Await App ID + Client Secret for infrastructure deployment

2. **Request Application Developer Role**:
   - Entra built-in role allowing app registration without admin
   - Lower barrier than Application Administrator
   - Request from identity team with business justification

3. **Phased Deployment**:
   - Deploy non-app-dependent infrastructure immediately (Storage, Insights, SignalR)
   - Wait for app approval while deploying Functions, monitoring, networking
   - Complete Bot Service + Teams package once app registration available

4. **M365 Developer Program** (for testing):
   - Free tenant with full admin access: https://developer.microsoft.com/microsoft-365/dev-program
   - Use for POC/testing while production approval in progress
   - Migrate to production after validation

### 4. Resource Provider Registration

```powershell
# Check required providers are registered
az provider show --namespace Microsoft.Web --query "registrationState"
az provider show --namespace Microsoft.BotService --query "registrationState"
az provider show --namespace Microsoft.SignalRService --query "registrationState"
az provider show --namespace Microsoft.Insights --query "registrationState"

# If not registered, request admin to register:
# az provider register --namespace Microsoft.Web
```

### 5. Teams Admin Center Validation

**Teams Custom App Upload**:
- Navigate to Teams Admin Center → Teams apps → Setup policies
- Verify "Upload custom apps" is enabled for your tenant/users
- If disabled, request Teams admin to enable custom app sideloading

**Microsoft Graph API Permissions**:
- Verify your app registration can request delegated/application permissions
- Common permissions needed: `OnlineMeetings.ReadWrite`, `Chat.ReadWrite`, `ActivityFeed.Read`
- Admin consent may be required for application permissions

---

## Deployment Automation Patterns

### PowerShell Infrastructure-as-Code

**12-Step Deployment Script** (from Teams Deep Integration Plan):

```powershell
# 1. Set Azure context
az login
az account set --subscription "your-subscription-id"

# 2. Create resource group
az group create --name alex-teams-rg --location eastus

# 3. Create Storage Account
az storage account create `
  --name alexteamsstorage `
  --resource-group alex-teams-rg `
  --location eastus `
  --sku Standard_LRS

# 4. Create Application Insights
az monitor app-insights component create `
  --app alex-teams-insights `
  --location eastus `
  --resource-group alex-teams-rg

# 5. Create SignalR Service
az signalr create `
  --name alex-teams-signalr `
  --resource-group alex-teams-rg `
  --location eastus `
  --sku Free_F1

# 6. Deploy Function App
az functionapp create `
  --resource-group alex-teams-rg `
  --name alex-teams-functions `
  --storage-account alexteamsstorage `
  --consumption-plan-location eastus `
  --runtime node `
  --runtime-version 18 `
  --functions-version 4

# 7. Configure App Settings
az functionapp config appsettings set `
  --name alex-teams-functions `
  --resource-group alex-teams-rg `
  --settings "BOT_ID=$botId" "BOT_PASSWORD=$botPassword"

# 8. Enable Managed Identity
az functionapp identity assign `
  --name alex-teams-functions `
  --resource-group alex-teams-rg

# 9. Deploy Bot Service (requires Entra app)
az bot create `
  --resource-group alex-teams-rg `
  --name alex-teams-bot `
  --kind registration `
  --appid $botAppId `
  --password $botPassword `
  --endpoint "https://alex-teams-functions.azurewebsites.net/api/messages"

# 10. Configure Bot Channels
az bot msteams create `
  --resource-group alex-teams-rg `
  --name alex-teams-bot

# 11. Deploy Function Code
func azure functionapp publish alex-teams-functions

# 12. Verify Deployment
az functionapp show --name alex-teams-functions --resource-group alex-teams-rg
```

### Environment Configuration

**.env.local** (local development):
```bash
BOT_ID=your-bot-app-id
BOT_PASSWORD=your-bot-client-secret
SIGNALR_CONNECTION_STRING=Endpoint=https://...
APPINSIGHTS_INSTRUMENTATIONKEY=your-instrumentation-key
```

**Azure App Settings** (production):
- Use Managed Identity instead of connection strings
- Store secrets in Azure Key Vault
- Reference Key Vault secrets in App Settings: `@Microsoft.KeyVault(SecretUri=https://...)`

---

## Phased Deployment Strategy

**Phase 0: Pre-Deployment Validation** (1-2 days)
- Run 7-point validation script (permissions, policies, providers, Teams, Graph API)
- Identify blockers and initiate approval processes
- Document environment constraints and workarounds

**Phase 1: Non-Dependent Infrastructure** (1-2 days)
- Deploy: Resource Group, Storage, Application Insights, SignalR
- These require only Contributor role, no app registration
- Can proceed immediately while waiting for Entra app approval

**Phase 2: Entra App-Dependent Infrastructure** (1 day, after app approval)
- Deploy: Function App (with Bot ID/secret in settings), Bot Service
- Requires Entra app registration completed
- Configure Managed Identity for Key Vault access

**Phase 3: Code Deployment & Testing** (1-2 weeks)
- Deploy Function code to Azure
- Test Bot Framework message handling
- Verify SignalR real-time connections
- Monitor Application Insights for errors

**Phase 4: Teams Integration** (1 week)
- Create Teams app package (.zip with manifest.json + icons)
- Sideload to Teams for testing
- Request admin upload for production distribution
- Beta test with select users

**Phase 5: Production Rollout** (ongoing)
- Monitor Application Insights metrics
- Collect user feedback
- Iterate based on usage patterns
- Scale resources as adoption grows

---

## Cost Estimation with Free Tiers

**Azure Functions** (Consumption Plan Y1):
- Free Tier: 1,000,000 executions/month + 400,000 GB-s/month
- Most MVPs stay within free tier
- Paid: $0.20 per million executions, $0.000016 per GB-s
- **Estimated**: $0-20/month (free tier covers most usage)

**SignalR Service**:
- Free Tier (F1): 20 concurrent connections, dev/test only, no SLA
- Standard Tier (S1): 1,000 concurrent connections = 1 unit @ ~$50/month
- **Estimated**: $0 (dev) or ~$50/month (production)

**Azure Bot Service** (F0 Free):
- Free: 10,000 messages/month to Standard Channels (Teams, Slack, etc.)
- Premium: $0.50 per 1,000 messages above free tier
- **Estimated**: $0/month (free tier sufficient for most)

**Application Insights**:
- Free: First 5 GB/month of data ingestion
- Paid: $2.88 per GB above free tier
- **Estimated**: $0-5/month (typical usage under free tier)

**Storage Account** (Standard LRS):
- ~$0.02 per GB/month for blob storage
- Minimal storage for bot state (~1 GB)
- **Estimated**: $0-2/month

**Total MVP Cost**: $1-35/month (most services free tier eligible)

---

## Monitoring & Validation

### Application Insights Queries

**Bot Message Volume**:
```kusto
requests
| where name == "POST /api/messages"
| summarize count() by bin(timestamp, 1h)
| render timechart
```

**Error Rate**:
```kusto
exceptions
| where timestamp > ago(24h)
| summarize count() by type
| order by count_ desc
```

**SignalR Connection Health**:
```kusto
traces
| where customDimensions.Category == "SignalR"
| where message contains "connected" or message contains "disconnected"
| summarize connections = countif(message contains "connected"),
            disconnections = countif(message contains "disconnected")
  by bin(timestamp, 5m)
```

### Health Check Endpoints

**Function App Health**:
```bash
curl https://alex-teams-functions.azurewebsites.net/api/health
```

**Bot Framework Verification**:
```bash
# Teams will send verification requests
# Check Application Insights for successful 200 responses
```

---

## Lessons Learned (Feb 2026 - Teams Integration Planning)

1. **Entra App Registration is Common Enterprise Blocker**
   - Many organizations restrict this permission to identity admins
   - Always provide 4 solution paths: admin-created app, role request, phased deployment, dev tenant
   - Include complete email template with all app specifications for admin request

2. **Azure Free Tiers More Generous Than Expected**
   - Functions: 1M executions/month free (not just "some free tier")
   - Bot Service F0: 10K messages/month free
   - Application Insights: 5 GB/month free
   - Update cost estimates to reflect free tier coverage accurately

3. **Pre-Deployment Validation Saves Weeks**
   - Discovering Entra blocker AFTER building infrastructure wastes time
   - 7-point validation script (15 minutes) prevents multi-day surprises
   - Validation provides empirical evidence of deployment readiness

4. **Comprehensive Checklists Enable Large Projects**
   - 143-item checklist made 12-week integration project tractable
   - 5-phase structure (Validation → Infrastructure → Development → Packaging → Launch → Verification) covers entire lifecycle
   - Success metrics at end provide completion criteria (60% adoption, 4.2/5 stars, 2+ hrs saved/user/week)

5. **Fact-Checking Against Official Docs Builds Credibility**
   - Made 8 mcp_azure_mcp_documentation API calls to validate claims
   - Found pricing corrections needed (SignalR $25 → $50, Functions missing free tier info)
   - Prevents spreading outdated or speculative information

---

## When to Apply This Knowledge

- **Trigger**: User mentions Azure deployment, enterprise infrastructure, Teams integration, Bot Framework
- **File Pattern**: `**/azure/**`, `**/infrastructure/**`, `**/*deploy*.{ps1,sh,md}`
- **Scenario**: Planning cloud infrastructure deployment in enterprise environment with policy restrictions
- **Output**: Pre-deployment validation checklist, phased deployment plan, blocker workarounds, cost estimates

---

*Azure Enterprise Deployment Patterns - distilled from Teams Deep Integration Plan (Feb 2026)*
