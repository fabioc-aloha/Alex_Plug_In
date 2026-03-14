import * as vscode from 'vscode';
import { IMcpRecommendationParams } from './types';

/**
 * MCP Recommendation Tool - Suggests relevant MCP servers for development scenarios
 */
export class McpRecommendationTool implements vscode.LanguageModelTool<IMcpRecommendationParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IMcpRecommendationParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Finding MCP tools for: ${options.input.scenario}`,
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IMcpRecommendationParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        // Update welcome view avatar — MCP recommendations = planning state
        vscode.commands.executeCommand('alex.setCognitiveState', 'planning');

        const platform = options.input.platform || 'both';
        
        const recommendations: string[] = [];
        
        // Azure MCP recommendations
        if (platform === 'azure' || platform === 'both') {
            recommendations.push(`## Azure MCP Tools (50+ Tools Available)

### Best Practices & Documentation
| Tool | Purpose | Use When |
|------|---------|----------|
| \`mcp_azure_mcp_get_bestpractices\` | Azure Functions, deployment, SDK best practices | Generating code, deploying |
| \`mcp_azure_mcp_azureterraformbestpractices\` | Terraform best practices for Azure | Creating IaC |
| \`mcp_azure_mcp_documentation\` | Search Microsoft Learn documentation | Need official docs |
| \`mcp_microsoft_doc_microsoft_docs_search\` | Search all Microsoft documentation | Broad doc search |
| \`mcp_microsoft_doc_microsoft_code_sample_search\` | Find code samples in MS docs | Need code examples |

### AI & Machine Learning
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_foundry\` | \`foundry\` | Azure AI Foundry models, deployments, endpoints |
| \`azure_search\` | \`search\` | Azure AI Search services, indexes, queries |
| \`mcp_azure_mcp_speech\` | \`speech\` | Speech-to-text, text-to-speech services |

### Databases
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_cosmos\` | \`cosmos\` | Cosmos DB accounts, databases, containers, queries |
| \`azure_mysql\` | \`mysql\` | Azure Database for MySQL servers, databases |
| \`azure_postgres\` | \`postgres\` | Azure Database for PostgreSQL servers, databases |
| \`azure_redis\` | \`redis\` | Managed Redis and Cache for Redis |
| \`azure_sql\` | \`sql\` | Azure SQL servers, databases, firewall rules |

### Compute & Containers
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_appservice\` | \`appservice\` | App Service database connections |
| \`azure_functionapp\` | \`functionapp\` | List Azure Functions |
| \`mcp_azure_mcp_aks\` | \`aks\` | Azure Kubernetes Service clusters, node pools |
| \`azure_acr\` | \`acr\` | Azure Container Registry instances |

### Messaging & Events
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_eventgrid\` | \`eventgrid\` | Event Grid topics, subscriptions |
| \`azure_eventhubs\` | \`eventhubs\` | Event Hubs namespaces |
| \`azure_servicebus\` | \`servicebus\` | Service Bus messaging |

### Analytics & Monitoring
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_kusto\` | \`kusto\` | Azure Data Explorer clusters, queries |
| \`azure_monitor\` | \`monitor\` | Query logs and metrics |
| \`azure_applicationinsights\` | \`applicationinsights\` | Application Insights resources |
| \`mcp_azure_mcp_applens\` | \`applens\` | Diagnose app performance issues |
| \`azure_grafana\` | \`grafana\` | Managed Grafana workspaces |
| \`azure_workbooks\` | \`workbooks\` | Azure Workbooks visualization |

### Security & Identity
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_keyvault\` | \`keyvault\` | Key Vault secrets, keys, certificates |
| \`azure_role\` | \`role\` | RBAC assignments |
| \`azure_confidentialledger\` | \`confidentialledger\` | Confidential Ledger transactions |

### Developer Tools
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_appconfig\` | \`appconfig\` | App Configuration settings, feature flags |
| \`mcp_azure_mcp_azd\` | \`azd\` | Azure Developer CLI commands |
| \`azure_bicepschema\` | \`bicepschema\` | Bicep schemas for IaC |
| \`azure_deploy\` | \`deploy\` | Deploy Azure resources |
| \`azure_loadtesting\` | \`loadtesting\` | Create and run load tests |

### Storage
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_storage\` | \`storage\` | Storage accounts, containers, blobs, tables |
| \`mcp_azure_mcp_managedlustre\` | \`managedlustre\` | High-performance Lustre file systems |

### Architecture & Governance
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_cloudarchitect\` | \`cloudarchitect\` | Generate architecture designs |
| \`azure_quota\` | \`quota\` | Manage resource quotas and limits |
| \`azure_resourcehealth\` | \`resourcehealth\` | Check resource health status |
| \`mcp_azure_mcp_extension_azqr\` | \`azqr\` | Compliance and security reports |

### Management
| Tool | Namespace | Purpose |
|------|-----------|---------|
| \`azure_subscription\` | \`subscription\` | List Azure subscriptions |
| \`azure_group\` | \`group\` | List resource groups |
| \`azure_marketplace\` | \`marketplace\` | Discover Marketplace products |
`);
        }

        // M365 MCP recommendations
        if (platform === 'm365' || platform === 'both') {
            recommendations.push(`## Microsoft 365 MCP Tools

### M365 Agents & Copilot Development
| Tool | Purpose | Use When |
|------|---------|----------|
| \`mcp_m365agentstoo_get_knowledge\` | M365 Copilot development knowledge | Building M365 apps or agents |
| \`mcp_m365agentstoo_get_code_snippets\` | Teams AI, Teams JS, botbuilder samples | Need implementation examples |
| \`mcp_m365agentstoo_get_schema\` | App manifest, agent, plugin schemas | Creating or modifying manifests |
| \`mcp_m365agentstoo_troubleshoot\` | Common M365 dev issues | Debugging or errors |

### Schema Types Available
| Schema | Version Example | Purpose |
|--------|-----------------|---------|
| \`app_manifest\` | v1.19 | Teams app manifest |
| \`declarative_agent_manifest\` | v1.0 | Copilot declarative agent |
| \`api_plugin_manifest\` | v2.1 | API plugin for Copilot |
| \`m365_agents_yaml\` | latest | M365 agents configuration |

### Microsoft Official MCP Servers (Available)
| Server | Purpose |
|--------|---------|
| Microsoft Outlook Mail MCP | Email management |
| Microsoft Outlook Calendar MCP | Calendar operations |
| Microsoft Teams MCP | Teams messaging & collaboration |
| Microsoft SharePoint and OneDrive MCP | File storage & sharing |
| Microsoft SharePoint Lists MCP | List management |
| Microsoft 365 Admin Center MCP | Admin operations |
| Microsoft Word MCP | Document creation |
| Microsoft 365 Copilot (Search) MCP | Enterprise search |
| Microsoft 365 User Profile MCP | User information |

### Fabric & Data Tools
| Tool | Purpose |
|------|---------|
| \`mcp_fabric-rti-mc_eventstream_create_simple\` | Create Eventstreams in Fabric |
| \`mcp_fabric-rti-mc_kusto_get_shots\` | Semantic search in Kusto |
| \`mcp_fabric-rti-mc_eventstream_delete\` | Delete Eventstreams |
`);
        }

        // Scenario-specific recommendations
        recommendations.push(`## Recommended for: "${options.input.scenario}"

### How to Use These Tools
1. **Switch to Agent Mode** in GitHub Copilot Chat
2. Ask your question naturally - tools are invoked automatically
3. Or reference tools explicitly with \`#toolName\`

### Example Prompts
- "Create an Azure Function with Cosmos DB binding using best practices"
- "Build a Teams bot with adaptive cards and SSO"
- "Query my Azure resources to find expensive VMs"
- "Generate a declarative Copilot agent manifest"
`);

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(recommendations.join('\n'))
        ]);
    }
}
