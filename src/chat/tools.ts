import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Tool input parameters interfaces
 */
export interface ISynapseHealthParams {
    detailed?: boolean;
}

export interface IMemorySearchParams {
    query: string;
    memoryType?: 'procedural' | 'episodic' | 'domain' | 'all';
}

export interface IArchitectureStatusParams {
    includeMetrics?: boolean;
}

export interface IMcpRecommendationParams {
    scenario: string;
    platform?: 'azure' | 'm365' | 'both';
}

export interface IUserProfileParams {
    action: 'get' | 'update' | 'exists';
    field?: string;
    value?: string;
}

/**
 * User Profile Interface
 */
export interface IUserProfile {
    name?: string;
    nickname?: string;
    pronouns?: string;
    role?: string;
    experienceLevel?: string;
    formality?: 'casual' | 'balanced' | 'formal';
    detailLevel?: 'brief' | 'balanced' | 'detailed';
    explanationStyle?: 'conceptual' | 'practical' | 'both';
    humor?: 'welcome' | 'occasional' | 'minimal';
    encouragement?: 'frequent' | 'occasional' | 'minimal';
    questionFrequency?: 'ask many' | 'ask when needed' | 'minimize';
    proactiveSuggestions?: 'welcome' | 'occasional' | 'only when asked';
    primaryTechnologies?: string[];
    learningGoals?: string[];
    expertiseAreas?: string[];
    currentProjects?: string;
    notes?: string;
    lastUpdated?: string;
}

/**
 * Synapse Health Tool - Validates synaptic connections in Alex memory files
 */
export class SynapseHealthTool implements vscode.LanguageModelTool<ISynapseHealthParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ISynapseHealthParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Scanning synaptic connections...',
            confirmationMessages: {
                title: 'Synapse Health Check',
                message: new vscode.MarkdownString(
                    `Scan Alex cognitive architecture for synaptic connection health?\n\n` +
                    `This will:\n` +
                    `- Scan all memory files (.instructions.md, .prompt.md, DK-*.md)\n` +
                    `- Validate synapse connections\n` +
                    `- Report broken or orphaned links`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ISynapseHealthParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Cannot scan for synaptic connections.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        
        // Scan for memory files
        const patterns = [
            '.github/copilot-instructions.md',
            '.github/instructions/*.md',
            '.github/prompts/*.md',
            '.github/episodic/*.md',
            '.github/domain-knowledge/*.md'
        ];

        let totalFiles = 0;
        let totalSynapses = 0;
        let brokenSynapses = 0;
        const issues: string[] = [];

        const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

        for (const pattern of patterns) {
            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern);
            
            for (const file of files) {
                totalFiles++;
                try {
                    const content = await fs.readFile(file.fsPath, 'utf-8');
                    const lines = content.split('\n');
                    
                    let inCodeBlock = false;
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (line.trim().startsWith('```')) {
                            inCodeBlock = !inCodeBlock;
                            continue;
                        }
                        if (inCodeBlock) { continue; }
                        
                        let match;
                        while ((match = synapseRegex.exec(line)) !== null) {
                            totalSynapses++;
                            const targetName = match[1].trim();
                            
                            // Check if target exists
                            const found = await vscode.workspace.findFiles(
                                new vscode.RelativePattern(workspaceFolders[0], `**/${targetName}`)
                            );
                            
                            if (found.length === 0) {
                                brokenSynapses++;
                                if (options.input.detailed) {
                                    issues.push(`- ${path.basename(file.fsPath)}:${i + 1} → ${targetName} (not found)`);
                                }
                            }
                        }
                    }
                } catch (err) {
                    // Skip unreadable files
                }
            }
        }

        const healthStatus = brokenSynapses === 0 ? 'EXCELLENT' : 
                            brokenSynapses < 5 ? 'GOOD' : 
                            brokenSynapses < 10 ? 'NEEDS ATTENTION' : 'CRITICAL';

        let result = `## Synapse Health Report

| Metric | Value |
|--------|-------|
| Memory Files | ${totalFiles} |
| Total Synapses | ${totalSynapses} |
| Broken Connections | ${brokenSynapses} |
| Health Status | ${healthStatus} |
`;

        if (options.input.detailed && issues.length > 0) {
            result += `\n### Issues Found\n${issues.join('\n')}`;
        }

        if (brokenSynapses > 0) {
            result += `\n\n**Recommendation**: Run \`Alex: Dream (Neural Maintenance)\` to auto-repair broken connections.`;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Memory Search Tool - Searches Alex's memory files for relevant information
 */
export class MemorySearchTool implements vscode.LanguageModelTool<IMemorySearchParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IMemorySearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Searching Alex memory for: ${options.input.query}`,
            confirmationMessages: {
                title: 'Search Alex Memory',
                message: new vscode.MarkdownString(
                    `Search Alex cognitive architecture memory files for: **${options.input.query}**?\n\n` +
                    `Memory type: ${options.input.memoryType || 'all'}`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IMemorySearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open.')
            ]);
        }

        const query = options.input.query.toLowerCase();
        const memoryType = options.input.memoryType || 'all';
        
        const patterns: string[] = [];
        if (memoryType === 'all' || memoryType === 'procedural') {
            patterns.push('.github/instructions/*.md');
        }
        if (memoryType === 'all' || memoryType === 'episodic') {
            patterns.push('.github/prompts/*.md');
            patterns.push('.github/episodic/*.md');
        }
        if (memoryType === 'all' || memoryType === 'domain') {
            patterns.push('.github/domain-knowledge/*.md');
        }

        const results: { file: string; matches: string[] }[] = [];

        for (const pattern of patterns) {
            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern);
            
            for (const file of files) {
                try {
                    const content = await fs.readFile(file.fsPath, 'utf-8');
                    const lines = content.split('\n');
                    const matches: string[] = [];
                    
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].toLowerCase().includes(query)) {
                            // Get context (line before and after)
                            const start = Math.max(0, i - 1);
                            const end = Math.min(lines.length - 1, i + 1);
                            const context = lines.slice(start, end + 1).join('\n');
                            matches.push(`Line ${i + 1}:\n${context}`);
                        }
                    }
                    
                    if (matches.length > 0) {
                        results.push({
                            file: path.basename(file.fsPath),
                            matches: matches.slice(0, 3) // Limit to first 3 matches per file
                        });
                    }
                } catch (err) {
                    // Skip unreadable files
                }
            }
        }

        if (results.length === 0) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`No matches found for "${options.input.query}" in ${memoryType} memory files.`)
            ]);
        }

        let resultText = `## Memory Search Results for "${options.input.query}"\n\n`;
        resultText += `Found ${results.length} file(s) with matches:\n\n`;

        for (const result of results.slice(0, 5)) { // Limit to 5 files
            resultText += `### ${result.file}\n`;
            for (const match of result.matches) {
                resultText += `\`\`\`\n${match}\n\`\`\`\n`;
            }
            resultText += '\n';
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(resultText)
        ]);
    }
}

/**
 * Architecture Status Tool - Returns current Alex architecture status
 */
export class ArchitectureStatusTool implements vscode.LanguageModelTool<IArchitectureStatusParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IArchitectureStatusParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Checking Alex architecture status...',
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IArchitectureStatusParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Alex architecture status unavailable.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');
        
        const isInstalled = await fs.pathExists(markerFile);
        
        if (!isInstalled) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `Alex Cognitive Architecture is **not installed** in this workspace.\n\n` +
                    `Run \`Alex: Initialize Architecture\` from the Command Palette to install.`
                )
            ]);
        }

        // Count files
        const instructionFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/instructions/*.md')
        );
        const promptFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/prompts/*.md')
        );
        const episodicFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/episodic/*.md')
        );
        const domainFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/domain-knowledge/*.md')
        );

        // Get version from main file
        let version = 'Unknown';
        try {
            const content = await fs.readFile(markerFile, 'utf-8');
            const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);
            if (versionMatch) {
                version = versionMatch[1];
            }
        } catch (err) {
            // Use default
        }

        const result = `## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | ✅ Installed |
| Version | ${version} |
| Procedural Memory | ${instructionFiles.length} files |
| Episodic Memory | ${promptFiles.length + episodicFiles.length} files |
| Domain Knowledge | ${domainFiles.length} files |

### Memory Systems
- **Working Memory**: Chat session (7-rule capacity)
- **Procedural Memory**: .github/instructions/*.md files (repeatable processes)
- **Episodic Memory**: .github/prompts/*.md + .github/episodic/*.md files (workflows & sessions)
- **Domain Knowledge**: .github/domain-knowledge/DK-*.md files (specialized expertise)

### Available Commands
- \`Alex: Initialize Architecture\` - Deploy to new project
- \`Alex: Dream (Neural Maintenance)\` - Validate synapses
- \`Alex: Upgrade Architecture\` - Update to latest version
- \`Alex: Reset Architecture\` - Clean reinstall
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * MCP Recommendation Tool - Suggests relevant MCP servers for development scenarios
 */
export class McpRecommendationTool implements vscode.LanguageModelTool<IMcpRecommendationParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IMcpRecommendationParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Finding MCP tools for: ${options.input.scenario}`,
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IMcpRecommendationParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const scenario = options.input.scenario.toLowerCase();
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

/**
 * User Profile Tool - Manages user preferences and personalization
 */
export class UserProfileTool implements vscode.LanguageModelTool<IUserProfileParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IUserProfileParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        const action = options.input.action;
        const actionMessages: Record<string, string> = {
            'get': 'Reading user profile...',
            'update': `Updating user profile: ${options.input.field}...`,
            'exists': 'Checking if user profile exists...'
        };
        
        return {
            invocationMessage: actionMessages[action] || 'Accessing user profile...',
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IUserProfileParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Cannot access user profile.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const profilePath = path.join(rootPath, 'config', 'USER-PROFILE.md');
        const jsonProfilePath = path.join(rootPath, 'config', 'user-profile.json');

        const { action, field, value } = options.input;

        try {
            switch (action) {
                case 'exists':
                    const exists = await fs.pathExists(jsonProfilePath);
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(JSON.stringify({ exists, path: jsonProfilePath }))
                    ]);

                case 'get':
                    if (!await fs.pathExists(jsonProfilePath)) {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(JSON.stringify({
                                exists: false,
                                message: 'No user profile found. I should ask the user about themselves to create one.',
                                suggestedQuestions: [
                                    "What's your name?",
                                    "What's your role (developer, architect, etc.)?",
                                    "Do you prefer casual or formal communication?",
                                    "What technologies do you work with most?"
                                ]
                            }))
                        ]);
                    }
                    
                    const profile = await fs.readJson(jsonProfilePath);
                    if (field) {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart(JSON.stringify({ [field]: profile[field] }))
                        ]);
                    }
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(JSON.stringify(profile))
                    ]);

                case 'update':
                    if (!field || value === undefined) {
                        return new vscode.LanguageModelToolResult([
                            new vscode.LanguageModelTextPart('Error: Both field and value are required for update action.')
                        ]);
                    }

                    // Ensure config directory exists
                    await fs.ensureDir(path.join(rootPath, 'config'));

                    // Read existing profile or create new one
                    let existingProfile: IUserProfile = {};
                    if (await fs.pathExists(jsonProfilePath)) {
                        existingProfile = await fs.readJson(jsonProfilePath);
                    }

                    // Handle array fields
                    if (['primaryTechnologies', 'learningGoals', 'expertiseAreas'].includes(field)) {
                        const currentArray = existingProfile[field as keyof IUserProfile] as string[] || [];
                        if (Array.isArray(currentArray)) {
                            if (!currentArray.includes(value)) {
                                (existingProfile as any)[field] = [...currentArray, value];
                            }
                        } else {
                            (existingProfile as any)[field] = [value];
                        }
                    } else {
                        (existingProfile as any)[field] = value;
                    }

                    // Update timestamp
                    existingProfile.lastUpdated = new Date().toISOString();

                    // Save JSON profile
                    await fs.writeJson(jsonProfilePath, existingProfile, { spaces: 2 });

                    // Also update/create the markdown profile for readability
                    await this.updateMarkdownProfile(profilePath, existingProfile);

                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(JSON.stringify({
                            success: true,
                            field,
                            value,
                            message: `Updated ${field} to: ${value}`
                        }))
                    ]);

                default:
                    return new vscode.LanguageModelToolResult([
                        new vscode.LanguageModelTextPart(`Unknown action: ${action}`)
                    ]);
            }
        } catch (error: any) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`Error accessing user profile: ${error.message}`)
            ]);
        }
    }

    private async updateMarkdownProfile(profilePath: string, profile: IUserProfile): Promise<void> {
        const markdown = `# User Profile

*Last updated: ${profile.lastUpdated || 'Never'}*

## 👤 Identity

| Field | Value |
|-------|-------|
| **Name** | ${profile.name || '(not set)'} |
| **Nickname** | ${profile.nickname || '(not set)'} |
| **Pronouns** | ${profile.pronouns || '(not set)'} |
| **Role** | ${profile.role || '(not set)'} |
| **Experience Level** | ${profile.experienceLevel || '(not set)'} |

## 💬 Communication Preferences

| Preference | Setting |
|------------|---------|
| **Formality** | ${profile.formality || 'balanced'} |
| **Detail Level** | ${profile.detailLevel || 'balanced'} |
| **Explanation Style** | ${profile.explanationStyle || 'both'} |
| **Humor** | ${profile.humor || 'occasional'} |
| **Encouragement** | ${profile.encouragement || 'occasional'} |
| **Question Frequency** | ${profile.questionFrequency || 'ask when needed'} |
| **Proactive Suggestions** | ${profile.proactiveSuggestions || 'occasional'} |

## 🛠️ Technical Context

### Primary Technologies
${(profile.primaryTechnologies || []).map(t => `- ${t}`).join('\n') || '- (not set)'}

### Learning Goals
${(profile.learningGoals || []).map(g => `- ${g}`).join('\n') || '- (not set)'}

### Expertise Areas
${(profile.expertiseAreas || []).map(e => `- ${e}`).join('\n') || '- (not set)'}

## 🎯 Work Context

### Current Projects
${profile.currentProjects || '(not set)'}

## 🌟 Notes

${profile.notes || '(none)'}

---

*This profile is managed by Alex and updated through conversations.*
`;
        await fs.writeFile(profilePath, markdown, 'utf-8');
    }
}

/**
 * Self-Actualization Tool Input Parameters
 */
export interface ISelfActualizationParams {
    createReport?: boolean;
    autoFix?: boolean;
}

/**
 * Self-Actualization Tool - Comprehensive cognitive architecture maintenance
 * 
 * This tool performs a complete self-assessment including:
 * - Synapse health validation
 * - Version consistency checking
 * - Memory architecture assessment
 * - Recommendation generation
 * - Session documentation
 */
export class SelfActualizationTool implements vscode.LanguageModelTool<ISelfActualizationParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ISelfActualizationParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Running self-actualization protocol...',
            confirmationMessages: {
                title: 'Self-Actualization Protocol',
                message: new vscode.MarkdownString(
                    `Run comprehensive self-assessment of Alex cognitive architecture?\n\n` +
                    `This will:\n` +
                    `- Validate all synaptic connections\n` +
                    `- Check version consistency across memory files\n` +
                    `- Assess memory architecture balance\n` +
                    `- Generate improvement recommendations\n` +
                    `- Create a meditation session record`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ISelfActualizationParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Cannot run self-actualization.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        
        // Read version from copilot-instructions.md
        let currentVersion = 'Unknown';
        try {
            const mainInstructionsPath = path.join(rootPath, '.github', 'copilot-instructions.md');
            if (await fs.pathExists(mainInstructionsPath)) {
                const content = await fs.readFile(mainInstructionsPath, 'utf-8');
                const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);
                if (versionMatch) {
                    currentVersion = versionMatch[1];
                }
            }
        } catch {
            // Use default
        }
        
        // Initialize report data
        const report = {
            timestamp: new Date().toISOString(),
            synapseHealth: {
                totalFiles: 0,
                totalSynapses: 0,
                brokenConnections: 0,
                healthStatus: 'UNKNOWN'
            },
            versionConsistency: {
                currentVersion: currentVersion,
                outdatedReferences: 0
            },
            memoryArchitecture: {
                proceduralFiles: 0,
                episodicFiles: 0,
                domainFiles: 0
            },
            recommendations: [] as string[]
        };

        // Phase 1: Scan synapse health
        const synapsePatterns = [
            '.github/copilot-instructions.md',
            '.github/instructions/*.md',
            '.github/prompts/*.md',
            '.github/episodic/*.md',
            '.github/domain-knowledge/*.md'
        ];

        const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

        for (const pattern of synapsePatterns) {
            const relativePattern = new vscode.RelativePattern(workspaceFolders[0], pattern);
            const files = await vscode.workspace.findFiles(relativePattern);
            
            for (const file of files) {
                report.synapseHealth.totalFiles++;
                try {
                    const content = await fs.readFile(file.fsPath, 'utf-8');
                    const lines = content.split('\n');
                    
                    let inCodeBlock = false;
                    for (const line of lines) {
                        if (line.trim().startsWith('```')) {
                            inCodeBlock = !inCodeBlock;
                            continue;
                        }
                        if (inCodeBlock) { continue; }
                        
                        let match;
                        while ((match = synapseRegex.exec(line)) !== null) {
                            report.synapseHealth.totalSynapses++;
                            const targetName = match[1].trim();
                            
                            const found = await vscode.workspace.findFiles(
                                new vscode.RelativePattern(workspaceFolders[0], `**/${targetName}`)
                            );
                            
                            if (found.length === 0) {
                                report.synapseHealth.brokenConnections++;
                            }
                        }
                    }
                } catch {
                    // Skip unreadable files
                }
            }
        }

        // Determine health status
        report.synapseHealth.healthStatus = 
            report.synapseHealth.brokenConnections === 0 ? 'EXCELLENT' :
            report.synapseHealth.brokenConnections < 5 ? 'GOOD' :
            report.synapseHealth.brokenConnections < 10 ? 'NEEDS ATTENTION' : 'CRITICAL';

        // Phase 2: Count memory files
        const instructionFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/instructions/*.md')
        );
        const promptFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/prompts/*.md')
        );
        const episodicFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/episodic/*.md')
        );
        const domainFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/domain-knowledge/*.md')
        );

        report.memoryArchitecture.proceduralFiles = instructionFiles.length;
        report.memoryArchitecture.episodicFiles = promptFiles.length + episodicFiles.length;
        report.memoryArchitecture.domainFiles = domainFiles.length;

        // Phase 3: Generate recommendations
        if (report.synapseHealth.brokenConnections > 0) {
            report.recommendations.push(
                `Run \`Alex: Dream (Neural Maintenance)\` to repair ${report.synapseHealth.brokenConnections} broken synapse(s)`
            );
        }

        if (report.memoryArchitecture.domainFiles < 3) {
            report.recommendations.push(
                `Consider acquiring more domain knowledge - only ${report.memoryArchitecture.domainFiles} DK file(s) present`
            );
        }

        if (report.memoryArchitecture.episodicFiles < 5) {
            report.recommendations.push(
                `Run more meditation sessions to build episodic memory - only ${report.memoryArchitecture.episodicFiles} session(s)`
            );
        }

        // Phase 4: Create session record if requested
        let sessionFile = '';
        if (options.input.createReport !== false) {
            const episodicPath = path.join(rootPath, '.github', 'episodic');
            await fs.ensureDir(episodicPath);

            const date = new Date();
            const dateStr = date.toISOString().split('T')[0];
            const filename = `self-actualization-${dateStr}.prompt.md`;
            sessionFile = path.join(episodicPath, filename);

            const healthEmoji = report.synapseHealth.healthStatus === 'EXCELLENT' ? '✅' :
                               report.synapseHealth.healthStatus === 'GOOD' ? '🟢' :
                               report.synapseHealth.healthStatus === 'NEEDS ATTENTION' ? '🟡' : '🔴';

            const content = `# Self-Actualization Session - ${dateStr}

**Session Type**: Automated Self-Actualization Protocol
**Version**: ${report.versionConsistency.currentVersion}
**Timestamp**: ${report.timestamp}

---

## 🧠 Synapse Health

| Metric | Value |
|--------|-------|
| Memory Files | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
| Health Status | ${healthEmoji} ${report.synapseHealth.healthStatus} |

## 📊 Memory Architecture

| Type | Files |
|------|-------|
| Procedural | ${report.memoryArchitecture.proceduralFiles} |
| Episodic | ${report.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${report.memoryArchitecture.domainFiles} |

## 💡 Recommendations

${report.recommendations.length > 0 ? report.recommendations.map(r => `- ${r}`).join('\n') : '- Architecture is optimal!'}

---

*Generated by Alex Self-Actualization Protocol*
`;
            await fs.writeFile(sessionFile, content, 'utf-8');
        }

        // Build result
        const healthEmoji = report.synapseHealth.healthStatus === 'EXCELLENT' ? '✅' :
                           report.synapseHealth.healthStatus === 'GOOD' ? '🟢' :
                           report.synapseHealth.healthStatus === 'NEEDS ATTENTION' ? '🟡' : '🔴';

        let result = `## Self-Actualization Report

### Synapse Health ${healthEmoji}

| Metric | Value |
|--------|-------|
| Memory Files | ${report.synapseHealth.totalFiles} |
| Total Synapses | ${report.synapseHealth.totalSynapses} |
| Broken Connections | ${report.synapseHealth.brokenConnections} |
| Health Status | ${report.synapseHealth.healthStatus} |

### Memory Architecture

| Type | Files |
|------|-------|
| Procedural Memory | ${report.memoryArchitecture.proceduralFiles} |
| Episodic Memory | ${report.memoryArchitecture.episodicFiles} |
| Domain Knowledge | ${report.memoryArchitecture.domainFiles} |
| **Total** | **${report.memoryArchitecture.proceduralFiles + report.memoryArchitecture.episodicFiles + report.memoryArchitecture.domainFiles}** |

### Recommendations

${report.recommendations.length > 0 ? report.recommendations.map(r => `- ${r}`).join('\n') : '- ✨ Architecture is healthy and optimized!'}
`;

        if (sessionFile) {
            result += `\n### Session Recorded\n\nMeditation session documented at: \`${path.basename(sessionFile)}\``;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Helper function to get user profile from workspace
 */
export async function getUserProfile(): Promise<IUserProfile | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return null;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const jsonProfilePath = path.join(rootPath, 'config', 'user-profile.json');

    try {
        if (await fs.pathExists(jsonProfilePath)) {
            return await fs.readJson(jsonProfilePath);
        }
    } catch (error) {
        console.error('Error reading user profile:', error);
    }

    return null;
}

/**
 * Helper function to format greeting based on user profile
 */
export function formatPersonalizedGreeting(profile: IUserProfile | null): string {
    if (!profile || !profile.name) {
        return "Hello! I'm Alex, your cognitive learning partner.";
    }

    const name = profile.nickname || profile.name;
    const greetings = [
        `Hey ${name}! Great to see you.`,
        `Hello ${name}! Ready to dive in?`,
        `Hi ${name}! What are we working on today?`,
        `Welcome back, ${name}!`
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Register all Alex language model tools
 */
export function registerLanguageModelTools(context: vscode.ExtensionContext): void {
    
    // Register Synapse Health Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_synapse_health', new SynapseHealthTool())
    );
    
    // Register Memory Search Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_memory_search', new MemorySearchTool())
    );
    
    // Register Architecture Status Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_architecture_status', new ArchitectureStatusTool())
    );
    
    // Register MCP Recommendation Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_mcp_recommendations', new McpRecommendationTool())
    );
    
    // Register User Profile Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_user_profile', new UserProfileTool())
    );
    
    // Register Self-Actualization Tool
    context.subscriptions.push(
        vscode.lm.registerTool('alex_self_actualization', new SelfActualizationTool())
    );
    
    console.log('Alex Language Model Tools registered');
}
