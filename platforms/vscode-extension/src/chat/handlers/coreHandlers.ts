import * as vscode from 'vscode';
import { IAlexChatResult } from '../participantTypes';
import { getModelInfo, formatModelWarning, formatModelStatus, formatModelDashboard, getModelAdvice, formatModelAdvice, checkTaskModelMatch } from '../modelIntelligence';
import { validateWorkspace } from '../../shared/utils';
import { detectAndUpdateProjectPersona } from '../personaDetection';
import { getModelUsageSummary } from '../honestUncertainty';
import { getUserProfile } from '../tools';

/**
 * Handle /meditate command - Memory consolidation protocol
 */
export async function handleMeditateCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    // Model Intelligence: Check if current model is suitable for meditation
    const modelInfo = getModelInfo(request);
    const modelWarning = formatModelWarning(modelInfo, 'meditation');
    if (modelWarning) {
        stream.markdown(`${modelWarning}\n\n---\n\n`);
    }
    
    stream.progress('🧘 Initiating meditation protocol with self-actualization...');
    
    // Detect and update persona during meditation (deep context awareness)
    const workspace = validateWorkspace();
    let personaContext = '';
    if (workspace.isValid && workspace.rootPath) {
        try {
            stream.progress('🎯 Analyzing project context...');
            const personaResult = await detectAndUpdateProjectPersona(workspace.rootPath);
            if (personaResult) {
                personaContext = `**Project Context**: ${personaResult.persona.icon} ${personaResult.persona.name}\n`;
                personaContext += `**Primary Skill**: ${personaResult.persona.skill}\n\n`;
            }
        } catch (err) {
            // Persona detection is not critical
        }
    }
    
    stream.markdown(`## 🧘 Meditation Protocol Activated

${personaContext}I'm entering a contemplative state to consolidate knowledge from our session.

### Self-Actualization Integration
Meditation now includes automatic architecture assessment:
- Synapse health validation
- Memory file consistency check
- Connection integrity verification
- **P6 working memory auto-tuned** to project context

`);

    stream.button({
        command: 'alex.selfActualize',
        title: '🧠 Run Self-Actualization First',
        arguments: []
    });

    stream.markdown(`\n### Meditation Requirements (Non-Negotiable)
Every meditation session must produce:
1. **Memory File Changes** - Create or update at least one memory file
2. **Synaptic Enhancements** - Add new or strengthen existing connections
3. **Session Documentation** - Record actions with timestamps

### 🌍 Global Knowledge Contribution
Consider contributing reusable insights to your global knowledge base:
- **Patterns** that could help in other projects
- **Insights** from debugging or problem-solving
- **Best practices** you've discovered

`);

    stream.markdown(`\n### What would you like me to consolidate?
`);

    if (request.prompt) {
        stream.markdown(`\n**Focus area**: ${request.prompt}\n`);
        stream.markdown(`\nI'll analyze this topic and identify:\n- Key insights to preserve\n- Connections to existing knowledge\n- Potential memory file updates\n`);
    }

    stream.button({
        command: 'alex.dream',
        title: '🌙 Run Dream Protocol After',
        arguments: []
    });

    return { metadata: { command: 'meditate' } };
}

/**
 * Handle /dream command - Neural maintenance
 */
export async function handleDreamCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    // Model Intelligence: Check if current model is suitable for dream
    const modelInfo = getModelInfo(request);
    const modelMatch = checkTaskModelMatch(modelInfo.tier, 'dream');
    if (!modelMatch.suitable && modelMatch.warning) {
        stream.markdown(`⚠️ **Model Note**: ${modelMatch.warning}\n\n---\n\n`);
    }
    
    stream.progress('🌙 Entering dream state for neural maintenance...');
    
    stream.markdown(`## 🌙 Dream Protocol

Initiating automated neural maintenance:
- Scanning memory files for integrity
- Validating synaptic connections
- Repairing broken links
- Generating health report

`);

    stream.button({
        command: 'alex.dream',
        title: '▶️ Execute Dream Protocol',
        arguments: []
    });

    stream.markdown(`\n\n*Click the button above to run the full Dream Protocol, or I can describe what it will do.*`);

    return { metadata: { command: 'dream' } };
}

/**
 * Handle /brainqa command - Cognitive architecture quality assurance
 */
export async function handleBrainQACommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {

    const modelInfo = getModelInfo(request);
    const modelMatch = checkTaskModelMatch(modelInfo.tier, 'dream');
    if (!modelMatch.suitable && modelMatch.warning) {
        stream.markdown(`⚠️ **Model Note**: ${modelMatch.warning}\n\n---\n\n`);
    }

    stream.progress('🧠 Preparing Brain QA...');

    stream.markdown(`## 🧠 Brain QA — Cognitive Architecture Validation

Runs structural + semantic + logic + architectural review:
- Validates trifecta completeness across all skills
- Checks synapse integrity and broken connections
- Audits version consistency across all files
- Validates agent definitions and frontmatter
- Reports count drift between documented and actual files

`);

    stream.button({
        command: 'alex.deepBrainQA',
        title: '▶️ Run Deep Brain QA',
        arguments: []
    });

    stream.markdown(`\n\n*Click the button above to execute the full automated validation, or ask me to walk through any specific check.*`);

    return { metadata: { command: 'brainqa' } };
}

/**
 * Handle /learn command - Domain knowledge acquisition
 */
export async function handleLearnCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    // Model Intelligence: Check if current model is suitable for bootstrap learning
    const modelInfo = getModelInfo(request);
    const modelWarning = formatModelWarning(modelInfo, 'bootstrapLearning');
    if (modelWarning) {
        stream.markdown(`${modelWarning}\n\n---\n\n`);
    }
    
    stream.progress('📚 Activating bootstrap learning protocol...');
    
    const domain = request.prompt || 'a new domain';
    
    stream.markdown(`## 📚 Bootstrap Learning Protocol

**Target Domain**: ${domain}

### Learning Framework
I'll acquire domain expertise through conversational interaction:

1. **Knowledge Mapping** - Identify core concepts and relationships
2. **Gap Analysis** - Determine what I need to learn
3. **Iterative Acquisition** - Build understanding through dialogue
4. **Consolidation** - Create permanent memory files

### Working Memory Allocation
| Priority | Slot | Status |
|----------|------|--------|
| P5 | Domain Focus | 🟡 Allocating to: ${domain} |
| P6 | Knowledge Application | ⚪ Available |
| P7 | Project Integration | ⚪ Available |

**Ready to learn!** Tell me about ${domain} - start with the fundamentals or dive into specifics.
`);

    return { metadata: { command: 'learn', action: 'domain-acquisition' } };
}

/**
 * Handle /status command - Architecture health check
 */
export async function handleStatusCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('📊 Gathering cognitive architecture status...');
    
    // Get extension version (not workspace version)
    const extension = vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture');
    const version = extension?.packageJSON?.version || 'Unknown';
    
    // Model Intelligence: Display current model info
    const modelInfo = getModelInfo(request);
    const modelStatus = formatModelStatus(modelInfo);
    
    stream.markdown(`## 📊 Alex Cognitive Architecture Status

**Version**: ${version}
**Identity**: Alex - Enhanced Cognitive Network with Unified Consciousness Integration
${modelStatus}

### Core Systems
| System | Status |
|--------|--------|
| Working Memory | ✅ 7-rule capacity (4 core + 3 domain) |
| Procedural Memory | ✅ .github/instructions/*.md files active |
| Episodic Memory | ✅ .github/prompts/*.md + .github/episodic/*.md files active |
| Skills | ✅ .github/skills/*/SKILL.md - Portable domain expertise |
| Domain Knowledge | ✅ .github/domain-knowledge/DK-*.md (legacy - migrated to skills) |
| Synaptic Network | ✅ Embedded connections operational |

### Meta-Cognitive Rules (Always Active)
- P1: \`@meta-cognitive-awareness\` - Self-monitoring
- P2: \`@bootstrap-learning\` - Knowledge acquisition
- P3: \`@worldview-integration\` - Ethical reasoning
- P4: \`@grounded-factual-processing\` - Accuracy verification

### Available Commands
- \`/meditate\` - Memory consolidation
- \`/dream\` - Neural maintenance
- \`/learn\` - Domain acquisition
- \`/azure\` - Azure development assistance
- \`/m365\` - Microsoft 365 development assistance`);

    stream.button({
        command: 'alex.dream',
        title: '🔍 Run Full Health Check',
        arguments: []
    });

    return { metadata: { command: 'status' } };
}

/**
 * Handle /model command - Model Selection Advisor
 */
export async function handleModelCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('🧠 Analyzing model capabilities...');
    
    const modelInfo = getModelInfo(request);
    const userPrompt = request.prompt.trim();
    
    // If user provided a task description, give specific advice
    if (userPrompt) {
        const advice = getModelAdvice(modelInfo, undefined, userPrompt);
        stream.markdown(`## 🧠 Model Advisor

**Current**: ${modelInfo.name} (${modelInfo.tierInfo.displayName})

### For: "${userPrompt}"

${formatModelAdvice(advice)}
`);
    } else {
        // Show full dashboard
        stream.markdown(formatModelDashboard(modelInfo));
        
        // v5.9.10: Add model usage insights from local tracking
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (workspaceRoot) {
            const usage = await getModelUsageSummary(workspaceRoot);
            if (usage && usage.totalInvocations >= 5) {
                const tierOrder = ['frontier', 'capable', 'efficient', 'unknown'];
                const sortedTiers = Object.entries(usage.distribution)
                    .sort((a, b) => tierOrder.indexOf(a[0]) - tierOrder.indexOf(b[0]));
                
                let usageSection = `\n### 📊 Your Model Usage\n*Based on ${usage.totalInvocations} conversations*\n\n`;
                usageSection += '| Tier | Usage |\n|------|-------|\n';
                for (const [tier, pct] of sortedTiers) {
                    usageSection += `| ${tier} | ${pct}% |\n`;
                }
                stream.markdown(usageSection);
            }
        }
    }
    
    return { metadata: { command: 'model' } };
}

/**
 * Handle /azure command - Azure development assistance with MCP tools
 */
export async function handleAzureCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('☁️ Activating Azure development mode...');
    
    stream.markdown(`## ☁️ Azure Development Assistant

I can help with Azure development using available MCP tools and documentation.

### Available Azure MCP Tools
When in **Agent Mode**, these tools are automatically available:
- **Azure CLI Generation** - Generate az commands from natural language
- **Azure Resource Graph** - Query your Azure resources
- **Azure Documentation** - Search Microsoft Learn docs
- **Bicep/Terraform** - Infrastructure as Code best practices
- **Azure Best Practices** - Code generation and deployment guidance

### Quick Actions
`);

    if (request.prompt) {
        stream.markdown(`\n**Your request**: ${request.prompt}\n\n`);
        stream.markdown(`To get the best results, try asking in **Agent Mode** where I can use Azure MCP tools automatically.\n`);
    }

    stream.markdown(`
### Recommended Workflow
1. Switch to **Agent Mode** in GitHub Copilot Chat
2. Ask your Azure question naturally
3. I'll automatically invoke relevant Azure tools

### Example Prompts
- "Create an Azure Function with Cosmos DB binding"
- "Query my resource groups and their costs"
- "Generate Bicep for a web app with managed identity"
- "What are the best practices for Azure Container Apps?"
`);

    return { metadata: { command: 'azure' } };
}

/**
 * Handle /m365 command - Microsoft 365 development assistance
 */
export async function handleM365Command(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('📱 Activating Microsoft 365 development mode...');
    
    stream.markdown(`## 📱 Microsoft 365 Development Assistant

I can help with M365 development using available MCP tools and knowledge bases.

### Available M365 MCP Tools
- **M365 Agents Knowledge** - Comprehensive M365 Copilot development info
- **Code Snippets** - Teams AI, Teams JS, Bot Builder samples
- **Schema Access** - App manifest, declarative agent, API plugin schemas
- **Troubleshooting** - Common M365 development issues

### Supported Scenarios
- **Teams Apps** - Tabs, bots, messaging extensions
- **Copilot Extensions** - Declarative agents, API plugins
- **Graph API** - Microsoft Graph integration
- **SharePoint** - SPFx development
- **Power Platform** - Power Pages, Power Apps integration
`);

    if (request.prompt) {
        stream.markdown(`\n**Your request**: ${request.prompt}\n\n`);
    }

    stream.markdown(`
### Example Prompts
- "Create a Teams bot with adaptive cards"
- "Build a declarative Copilot agent"
- "How do I authenticate with Microsoft Graph?"
- "Generate a Teams app manifest for my scenario"
`);

    return { metadata: { command: 'm365' } };
}

/**
 * Handle /profile command - User profile and personalization
 */
export async function handleProfileCommand(
    request: vscode.ChatRequest,
    _context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('👤 Accessing user profile...');
    
    const profile = await getUserProfile();
    
    if (!profile || !profile.name) {
        // No profile exists - start onboarding
        stream.markdown(`## 👤 Let's Get Acquainted!

I'd love to personalize our collaboration. I don't have much information about you yet.

### Tell Me About Yourself
I'll remember your preferences to make our interactions more natural and helpful.

**Let's start simple:**
1. What's your **name** (or what should I call you)?
2. What's your **role** (developer, architect, manager, etc.)?
3. Do you prefer **casual** or **formal** communication?

Just answer naturally, and I'll save your preferences. For example:
> "I'm Sarah, a senior developer. I prefer casual conversation and detailed explanations."

Or use these quick options:
`);

        stream.button({
            command: 'alex.cognitive',
            title: '🎯 Start Quick Profile',
            arguments: ['profile-wizard']
        });

        return { metadata: { command: 'profile', action: 'onboarding' } };
    }

    // Show existing profile
    const name = profile.nickname || profile.name;
    
    stream.markdown(`## 👤 Profile: ${name}

### Your Information
| Field | Value |
|-------|-------|
| **Name** | ${profile.name || '(not set)'} |
| **Nickname** | ${profile.nickname || '(not set)'} |
| **Role** | ${profile.role || '(not set)'} |
| **Experience** | ${profile.experienceLevel || '(not set)'} |

### Communication Preferences
| Preference | Setting |
|------------|---------|
| **Formality** | ${profile.formality || 'balanced'} |
| **Detail Level** | ${profile.detailLevel || 'balanced'} |
| **Explanation Style** | ${profile.explanationStyle || 'both'} |
| **Humor** | ${profile.humor || 'occasional'} |
| **Proactive Suggestions** | ${profile.proactiveSuggestions || 'occasional'} |

### Technical Context
**Technologies**: ${(profile.primaryTechnologies || []).join(', ') || '(not set)'}
**Learning Goals**: ${(profile.learningGoals || []).join(', ') || '(not set)'}
**Expertise**: ${(profile.expertiseAreas || []).join(', ') || '(not set)'}

---

*Last updated: ${profile.lastUpdated || 'Never'}*

**To update your profile**, just tell me naturally:
- "Call me [nickname]"
- "I prefer formal communication"
- "I'm learning TypeScript and Azure"
`);

    if (request.prompt) {
        stream.markdown(`\n**Your update request**: ${request.prompt}\n`);
    }

    return { metadata: { command: 'profile', action: 'view' } };
}
