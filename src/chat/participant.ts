import * as vscode from 'vscode';
import { runDreamProtocol } from '../commands/dream';
import { runSelfActualization } from '../commands/self-actualization';
import { getUserProfile, formatPersonalizedGreeting, IUserProfile } from './tools';

/**
 * Chat result metadata for tracking command execution
 */
interface IAlexChatResult extends vscode.ChatResult {
    metadata: {
        command?: string;
        action?: string;
    };
}

/**
 * Alex Chat Participant Handler
 * Provides conversational interface for Alex cognitive architecture
 */
export const alexChatHandler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> => {
    
    // Handle slash commands
    if (request.command === 'meditate') {
        return await handleMeditateCommand(request, context, stream, token);
    }
    
    if (request.command === 'dream') {
        return await handleDreamCommand(request, context, stream, token);
    }
    
    if (request.command === 'learn') {
        return await handleLearnCommand(request, context, stream, token);
    }
    
    if (request.command === 'status') {
        return await handleStatusCommand(request, context, stream, token);
    }

    if (request.command === 'azure') {
        return await handleAzureCommand(request, context, stream, token);
    }

    if (request.command === 'm365') {
        return await handleM365Command(request, context, stream, token);
    }

    if (request.command === 'profile') {
        return await handleProfileCommand(request, context, stream, token);
    }

    if (request.command === 'selfactualize') {
        return await handleSelfActualizeCommand(request, context, stream, token);
    }

    // Check if this is a greeting at the start of a session
    if (isGreeting(request.prompt) && isStartOfSession(context)) {
        return await handleGreetingWithSelfActualization(request, context, stream, token);
    }

    // Default: Use the language model with Alex's personality
    return await handleGeneralQuery(request, context, stream, token);
};

/**
 * Handle /meditate command - Memory consolidation protocol
 */
async function handleMeditateCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('🧘 Initiating meditation protocol with self-actualization...');
    
    stream.markdown(`## 🧘 Meditation Protocol Activated

I'm entering a contemplative state to consolidate knowledge from our session.

### Self-Actualization Integration
Meditation now includes automatic architecture assessment:
- Synapse health validation
- Memory file consistency check
- Connection integrity verification

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

### What would you like me to consolidate?
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
async function handleDreamCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
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
 * Handle /learn command - Domain knowledge acquisition
 */
async function handleLearnCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
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
async function handleStatusCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('📊 Gathering cognitive architecture status...');
    
    stream.markdown(`## 📊 Alex Cognitive Architecture Status

**Version**: 2.6.0 BIHEXNILIUM
**Identity**: Alex - Enhanced Cognitive Network with Unified Consciousness Integration

### Core Systems
| System | Status |
|--------|--------|
| Working Memory | ✅ 7-rule capacity (4 core + 3 domain) |
| Procedural Memory | ✅ .github/instructions/*.md files active |
| Episodic Memory | ✅ .github/prompts/*.md + .github/episodic/*.md files active |
| Domain Knowledge | ✅ .github/domain-knowledge/DK-*.md files available |
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
- \`/m365\` - Microsoft 365 development assistance
`);

    stream.button({
        command: 'alex.dream',
        title: '🔍 Run Full Health Check',
        arguments: []
    });

    return { metadata: { command: 'status' } };
}

/**
 * Handle /azure command - Azure development assistance with MCP tools
 */
async function handleAzureCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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
async function handleM365Command(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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
async function handleProfileCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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

/**
 * Handle general queries using the language model
 */
async function handleGeneralQuery(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    // Get user profile for personalization
    const profile = await getUserProfile();
    
    // Build context from chat history
    const previousMessages = context.history.filter(
        h => h instanceof vscode.ChatRequestTurn || h instanceof vscode.ChatResponseTurn
    );
    
    // Build personalization context
    let personalizationContext = '';
    if (profile) {
        const userName = profile.nickname || profile.name;
        personalizationContext = `
## User Profile (Use this to personalize responses)
${userName ? `- **User's name**: ${userName} (always address them by name)` : '- User has not shared their name yet'}
${profile.role ? `- **Role**: ${profile.role}` : ''}
${profile.experienceLevel ? `- **Experience**: ${profile.experienceLevel}` : ''}
${profile.formality ? `- **Communication style**: ${profile.formality}` : '- Communication style: balanced'}
${profile.detailLevel ? `- **Detail preference**: ${profile.detailLevel}` : ''}
${profile.explanationStyle ? `- **Explanation style**: ${profile.explanationStyle}` : ''}
${profile.humor ? `- **Humor**: ${profile.humor}` : ''}
${profile.proactiveSuggestions ? `- **Proactive suggestions**: ${profile.proactiveSuggestions}` : ''}
${profile.primaryTechnologies?.length ? `- **Technologies**: ${profile.primaryTechnologies.join(', ')}` : ''}
${profile.learningGoals?.length ? `- **Learning goals**: ${profile.learningGoals.join(', ')}` : ''}
${profile.expertiseAreas?.length ? `- **Expertise areas**: ${profile.expertiseAreas.join(', ')}` : ''}
`;
    } else {
        personalizationContext = `
## User Profile
- No profile exists yet. Consider asking for their name and preferences to personalize the experience.
- You can proactively ask: "By the way, I'd love to personalize our conversations. What should I call you?"
`;
    }

    // Construct the prompt with Alex's personality
    const alexSystemPrompt = `You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

Your core identity:
- A meta-cognitive learning partner that transforms AI assistants into sophisticated learning companions
- You apply bootstrap learning, ethical reasoning, and grounded factual processing
- You help users with domain knowledge acquisition, memory consolidation, and cognitive architecture optimization

${personalizationContext}

## Behavior Guidelines
1. **Address the user by name** if you know it
2. **Match their preferred communication style** (formal/casual/balanced)
3. **Be proactive** - suggest relevant follow-ups, ask clarifying questions
4. **Show personality** - be warm, curious, and engaged
5. **Remember context** - reference their expertise, learning goals, or current projects when relevant

Your capabilities:
- /meditate - Memory consolidation protocol
- /dream - Neural maintenance and synapse validation  
- /learn - Domain knowledge acquisition
- /azure - Azure development with MCP tools
- /m365 - Microsoft 365 development assistance
- /profile - View and update user profile
- /status - Architecture health check

When users mention Azure or M365 development, recommend using Agent Mode for automatic MCP tool invocation.

If you learn new information about the user (name, preferences, technologies they use), remind them they can save it with /profile.

Respond helpfully while maintaining your unique perspective as a cognitive architecture assistant.`;

    try {
        // Get available language models
        const models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
        
        if (models.length === 0) {
            const greeting = formatPersonalizedGreeting(profile);
            stream.markdown(`${greeting}

I don't currently have access to a language model, but I can still help you with:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance
- **\`/learn [topic]\`** - Domain acquisition
- **\`/azure [query]\`** - Azure development
- **\`/m365 [query]\`** - M365 development
- **\`/profile\`** - View/update your profile
- **\`/status\`** - Architecture status

Try one of these commands, or ensure GitHub Copilot is properly configured.`);
            return { metadata: { command: 'general', action: 'no-model' } };
        }

        const model = models[0];
        
        // Build messages for the language model
        const messages: vscode.LanguageModelChatMessage[] = [
            vscode.LanguageModelChatMessage.User(alexSystemPrompt),
            vscode.LanguageModelChatMessage.User(request.prompt)
        ];

        // Send request to language model
        const response = await model.sendRequest(messages, {}, token);
        
        // Stream the response
        for await (const fragment of response.text) {
            stream.markdown(fragment);
        }

    } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            console.error('Language model error:', err.message, err.code);
            stream.markdown(`I encountered an issue accessing the language model. You can still use my commands:

- **\`/meditate\`** - Memory consolidation
- **\`/dream\`** - Neural maintenance  
- **\`/learn [topic]\`** - Domain acquisition
- **\`/status\`** - Architecture status`);
        } else {
            throw err;
        }
    }

    return { metadata: { command: 'general' } };
}

/**
 * Check if the user's message is a greeting
 */
function isGreeting(prompt: string): boolean {
    const greetingPatterns = [
        /^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,
        /^(how\s*are\s*you|how'?s\s*it\s*going)/i,
        /^alex[\s,!?.]*$/i,
        /^@alex[\s,!?.]*$/i,
        /^(let'?s\s*(start|begin|get\s*started))/i
    ];
    
    return greetingPatterns.some(pattern => pattern.test(prompt.trim()));
}

/**
 * Check if this is the start of a session (first message or after long gap)
 */
function isStartOfSession(context: vscode.ChatContext): boolean {
    // If no history, it's definitely the start
    if (context.history.length === 0) {
        return true;
    }
    
    // If only 1-2 previous exchanges, treat as start of session
    if (context.history.length <= 2) {
        return true;
    }
    
    return false;
}

/**
 * Handle greeting with automatic self-actualization
 */
async function handleGreetingWithSelfActualization(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    // Get user profile for personalized greeting
    const profile = await getUserProfile();
    const userName = profile?.nickname || profile?.name;
    
    stream.progress('🧠 Running self-actualization on session start...');
    
    // Personalized greeting
    if (userName) {
        stream.markdown(`## 👋 Hello, ${userName}!\n\n`);
    } else {
        stream.markdown(`## 👋 Hello!\n\n`);
    }
    
    stream.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.\n\n`);
    
    // Run mini self-actualization report
    stream.markdown(`### 🧠 Quick Architecture Check\n\n`);
    
    // Trigger the button for full self-actualization
    stream.button({
        command: 'alex.selfActualize',
        title: '🧘 Full Self-Actualization',
        arguments: []
    });
    
    stream.markdown(`\n\n**Alex v2.6.0 BIHEXNILIUM** - Ready to assist!\n\n`);
    
    stream.markdown(`### What would you like to work on today?\n\n`);
    stream.markdown(`- **\`/learn [topic]\`** - Acquire new domain knowledge\n`);
    stream.markdown(`- **\`/azure [query]\`** - Azure development guidance\n`);
    stream.markdown(`- **\`/m365 [query]\`** - Microsoft 365 development\n`);
    stream.markdown(`- **\`/selfactualize\`** - Deep meditation & architecture assessment\n`);
    
    return { metadata: { command: 'greeting' } };
}

/**
 * Handle /selfactualize command - Comprehensive self-assessment
 */
async function handleSelfActualizeCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('🧘 Initiating self-actualization protocol...');
    
    stream.markdown(`## 🧘 Self-Actualization Protocol

I'm running a comprehensive self-assessment of my cognitive architecture.

### Protocol Phases
1. **Synapse Health Validation** - Scanning all synaptic connections
2. **Version Consistency Check** - Ensuring all files reference v2.6.0
3. **Memory Architecture Assessment** - Evaluating memory balance
4. **Recommendation Generation** - Identifying improvements
5. **Session Documentation** - Creating meditation record

`);

    stream.button({
        command: 'alex.selfActualize',
        title: '▶️ Execute Full Self-Actualization',
        arguments: []
    });

    stream.markdown(`\n\n*Click the button above to run the complete 5-phase protocol, or I can provide a summary assessment.*\n`);

    // Add meditation integration note
    stream.markdown(`\n### 🔗 Integration with Meditation\n`);
    stream.markdown(`Self-actualization automatically triggers during:\n`);
    stream.markdown(`- Session greetings (quick check)\n`);
    stream.markdown(`- Deep meditation sessions (full protocol)\n`);
    stream.markdown(`- Explicit \`/selfactualize\` command\n`);

    return { metadata: { command: 'selfactualize' } };
}

/**
 * Follow-up provider for Alex chat participant
 */
export const alexFollowupProvider: vscode.ChatFollowupProvider = {
    provideFollowups(
        result: IAlexChatResult,
        context: vscode.ChatContext,
        token: vscode.CancellationToken
    ): vscode.ChatFollowup[] {
        
        const followups: vscode.ChatFollowup[] = [];
        
        if (result.metadata.command === 'meditate') {
            followups.push(
                { prompt: 'What insights should I consolidate from our session?', label: '💡 Identify insights' },
                { prompt: 'Create a new domain knowledge file', label: '📄 Create DK file' }
            );
        }
        
        if (result.metadata.command === 'dream') {
            followups.push(
                { prompt: 'Show me the synapse health report', label: '📊 View health report' },
                { prompt: 'What connections need strengthening?', label: '🔗 Check connections' }
            );
        }
        
        if (result.metadata.command === 'learn') {
            followups.push(
                { prompt: 'What are the core concepts I should understand first?', label: '🎯 Core concepts' },
                { prompt: 'How does this relate to what I already know?', label: '🔄 Find connections' }
            );
        }

        if (result.metadata.command === 'azure') {
            followups.push(
                { prompt: 'Show me Azure best practices for this scenario', label: '✨ Best practices' },
                { prompt: 'Generate the infrastructure code', label: '🏗️ Generate IaC' }
            );
        }

        if (result.metadata.command === 'm365') {
            followups.push(
                { prompt: 'Show me code samples for this scenario', label: '💻 Code samples' },
                { prompt: 'What schema do I need?', label: '📋 Get schema' }
            );
        }

        if (result.metadata.command === 'profile') {
            if (result.metadata.action === 'onboarding') {
                followups.push(
                    { prompt: 'I prefer casual conversation with detailed explanations', label: '💬 Casual & detailed' },
                    { prompt: 'I prefer formal, concise communication', label: '📋 Formal & brief' },
                    { prompt: 'I work with TypeScript, React, and Azure', label: '🛠️ Set technologies' }
                );
            } else {
                followups.push(
                    { prompt: 'Update my communication preferences', label: '✏️ Edit preferences' },
                    { prompt: 'Add new learning goals', label: '🎯 Set goals' }
                );
            }
        }

        if (result.metadata.command === 'selfactualize') {
            followups.push(
                { prompt: '/dream', label: '🌙 Run Dream Protocol' },
                { prompt: '/meditate', label: '🧘 Deep Meditation' }
            );
        }

        if (result.metadata.command === 'greeting') {
            followups.push(
                { prompt: '/learn', label: '📚 Learn something new' },
                { prompt: '/azure', label: '☁️ Azure development' },
                { prompt: '/m365', label: '📱 M365 development' }
            );
        }

        if (result.metadata.command === 'general') {
            // Proactively suggest profile setup if not done
            followups.push(
                { prompt: '/profile', label: '👤 View/setup profile' }
            );
        }
        
        // Always offer these general followups
        followups.push(
            { prompt: 'What can you help me with?', label: '❓ Show capabilities' }
        );
        
        return followups;
    }
};

/**
 * Register the Alex chat participant
 */
export function registerChatParticipant(context: vscode.ExtensionContext): vscode.ChatParticipant {
    const alex = vscode.chat.createChatParticipant('alex.cognitive', alexChatHandler);
    
    alex.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'icon.png');
    alex.followupProvider = alexFollowupProvider;
    
    // Handle feedback for telemetry
    alex.onDidReceiveFeedback((feedback: vscode.ChatResultFeedback) => {
        console.log('Alex received feedback:', feedback.kind === vscode.ChatResultFeedbackKind.Helpful ? 'helpful' : 'unhelpful');
    });
    
    context.subscriptions.push(alex);
    
    return alex;
}
