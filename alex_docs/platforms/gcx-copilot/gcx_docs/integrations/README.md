# Integration Guides

> Platform-specific setup and usage guides for the GCX Copilot Integration Hub.

---

## Available Integrations

| Platform | Category | Status | Guide |
|----------|----------|--------|-------|
| [Microsoft Graph](ms-graph.md) | M365 | ✅ Core | Users, Calendar, Teams, SharePoint |
| [Azure DevOps](ado.md) | DevOps | ✅ Core | Work Items, Pipelines, PRs |
| [Microsoft Fabric](fabric.md) | Data | ✅ Core | Medallion, Governance, REST API |
| [CPM](cpm.md) | Compliance | ✅ Ready | Customer Promise Management |
| [Everest](everest.md) | Surveys | ✅ Ready | Enterprise Survey Platform |
| [Qualtrics](qualtrics.md) | Surveys | ✅ Ready | Survey Data Integration |
| [Azure](azure.md) | Cloud | ✅ Core | Architecture, Bicep, Deployment |

---

## Integration Setup Matrix

| Integration | Auth Method | Required | Optional Skills |
|-------------|-------------|----------|-----------------|
| MS Graph | Azure AD App | App registration | `microsoft-graph-api`, `msal-authentication` |
| Azure DevOps | PAT / Service Connection | PAT token | `azure-devops-automation` |
| Microsoft Fabric | Workspace access | Contributor role | `microsoft-fabric`, `data-quality-monitoring` |
| CPM | API Key | API credentials | `cpm-workflows` |
| Everest | API Key | API credentials | `everest-integration` |
| Qualtrics | API Token | API credentials | `qualtrics-integration` |
| Azure | Subscription | Contributor role | `azure-architecture-patterns` |

---

## Quick Setup Checklist

### MS Graph API

- [ ] Register Azure AD application
- [ ] Configure API permissions (delegated or app-only)
- [ ] Store credentials in Key Vault
- [ ] Test with Graph Explorer first

### Azure DevOps

- [ ] Generate Personal Access Token (PAT)
- [ ] Grant appropriate scopes (Work Items, Code, Build)
- [ ] Configure ADO MCP server (if using)

### Microsoft Fabric

- [ ] Ensure workspace Contributor access
- [ ] Enable REST API access
- [ ] Set up service principal (for automation)

### CPM

- [ ] Obtain CPM API credentials
- [ ] Configure endpoint URL
- [ ] Test SLA query access

### Everest

- [ ] Obtain Everest API key
- [ ] Configure survey project access
- [ ] Test data export permissions

---

## Common Patterns

### Authentication

All integrations use secure credential management:

```
# Never hardcode credentials
# Use Azure Key Vault or environment variables
@workspace Set up Key Vault for my integration credentials
```

### Error Handling

```
@workspace Add retry logic for [integration] API calls
```

### Rate Limiting

```
@workspace How do I handle rate limits for MS Graph batch requests?
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication fails | Check token expiry, refresh credentials |
| Permission denied | Verify API scopes/roles granted |
| Rate limited | Implement exponential backoff |
| Data not syncing | Check network access, endpoint URLs |

---

## Adding New Integrations

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on proposing new integration skills.
