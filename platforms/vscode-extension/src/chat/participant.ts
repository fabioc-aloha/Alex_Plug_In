import * as vscode from 'vscode';
import * as path from 'path';
import { runDreamProtocol } from '../commands/dream';
import { runSelfActualization } from '../commands/self-actualization';
import { startSession, getCurrentSession, isSessionActive, endSession } from '../commands/session';
import { getGoalsSummary, showGoalsQuickPick, showCreateGoalDialog, autoIncrementGoals } from '../commands/goals';
import { processForInsights, detectInsights, getAutoInsightsConfig } from '../commands/autoInsights';
import { getUserProfile, formatPersonalizedGreeting, IUserProfile } from './tools';
import { validateWorkspace } from '../shared/utils';
import { searchGlobalKnowledge, getGlobalKnowledgeSummary, ensureProjectRegistry, getAlexGlobalPath, createGlobalInsight } from './globalKnowledge';
// Cloud sync deprecated in v5.0.1 - Gist sync removed
// import { syncWithCloud, pushToCloud, pullFromCloud, getCloudUrl, triggerPostModificationSync } from './cloudSync';
import { GlobalKnowledgeCategory } from '../shared/constants';
import { detectAndUpdateProjectPersona, PERSONAS } from './personaDetection';
import { speakIfVoiceModeEnabled } from '../ux/uxFeatures';
import { getModelInfo, formatModelWarning, formatModelStatus, formatModelDashboard, getModelAdvice, formatModelAdvice, checkTaskModelMatch } from './modelIntelligence';
import { isGraphAvailable, getCalendarEvents, getRecentMail, getWorkContext, searchPeople, formatCalendarEvent, formatMailMessage, getGraphStatus } from '../enterprise/microsoftGraph';
import { isEnterpriseMode } from '../enterprise/enterpriseAuth';

// ============================================================================
// UNCONSCIOUS MIND: AUTO-INSIGHT DETECTION
// ============================================================================
// Note: Core detection logic moved to autoInsights.ts for reusability

/**
 * Patterns that indicate valuable learnings in conversation
 * NOTE: These are strings to avoid regex state leakage with /g flag
 * Create new RegExp instances per call to prevent lastIndex issues
 */
const INSIGHT_PATTERN_STRINGS = [
    '(?:i (?:learned|discovered|realized|found out|figured out)|the (?:solution|fix|answer) (?:is|was)|turns out|the trick is|the key is|important to note|pro tip|best practice)',
    '(?:this works because|the reason is|what fixed it|solved by|resolved by)',
    '(?:always remember to|never forget to|make sure to|be careful to)',
    '(?:debugging tip|performance tip|security tip)'
];

/**
 * Get fresh regex instances for insight detection
 * Avoids state leakage from lastIndex in global regexes
 */
function getInsightPatterns(): RegExp[] {
    return INSIGHT_PATTERN_STRINGS.map(p => new RegExp(p, 'i'));
}

/**
 * Keywords that suggest valuable domain knowledge
 */
const DOMAIN_KEYWORDS = [
    'pattern', 'anti-pattern', 'best practice', 'gotcha', 'pitfall',
    'workaround', 'solution', 'fix', 'resolved', 'debugging',
    'performance', 'optimization', 'security', 'architecture'
];

/**
 * Analyze text for potential insights worth saving (legacy inline detection)
 * Returns insight data if valuable learning detected, null otherwise
 */
function detectPotentialInsight(text: string): { detected: boolean; confidence: number; keywords: string[] } {
    const lowerText = text.toLowerCase();
    
    // Check for insight patterns (fresh instances to avoid regex state leakage)
    let patternMatches = 0;
    for (const pattern of getInsightPatterns()) {
        if (pattern.test(text)) {
            patternMatches++;
        }
    }
    
    // Check for domain keywords
    const foundKeywords: string[] = [];
    for (const keyword of DOMAIN_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            foundKeywords.push(keyword);
        }
    }
    
    // Calculate confidence score
    const confidence = (patternMatches * 0.3) + (foundKeywords.length * 0.1);
    
    return {
        detected: confidence >= 0.3 || patternMatches >= 1,
        confidence: Math.min(confidence, 1.0),
        keywords: foundKeywords
    };
}

/**
 * Auto-save a detected insight in the background
 */
async function autoSaveInsight(
    content: string,
    keywords: string[],
    sourceProject?: string
): Promise<void> {
    try {
        // Extract a title from the first sentence or use generic
        const firstSentence = content.split(/[.!?]/)[0].trim();
        const title = firstSentence.length > 10 && firstSentence.length < 100
            ? firstSentence
            : `Auto-captured insight - ${new Date().toISOString().split('T')[0]}`;
        
        // Determine category from keywords
        let category: GlobalKnowledgeCategory = 'general';
        if (keywords.includes('debugging')) { category = 'debugging'; }
        else if (keywords.includes('performance') || keywords.includes('optimization')) { category = 'performance'; }
        else if (keywords.includes('security')) { category = 'security'; }
        else if (keywords.includes('architecture')) { category = 'architecture'; }
        else if (keywords.includes('pattern') || keywords.includes('anti-pattern')) { category = 'patterns'; }
        
        await createGlobalInsight(
            title,
            content,
            category,
            keywords,
            sourceProject,
            'Auto-detected from conversation',
            content
        );
        
        // Cloud sync deprecated - insights saved locally only
        // triggerPostModificationSync();
        
        console.log(`[Unconscious] Auto-saved insight: ${title}`);
    } catch (err) {
        console.warn('[Unconscious] Failed to auto-save insight:', err);
    }
}

/**
 * Track conversation for potential insights (called during general queries)
 * Now integrates with enhanced autoInsights module
 */
let conversationBuffer: string[] = [];
const MAX_BUFFER_SIZE = 5;

function trackConversationForInsights(userMessage: string, sourceProject?: string): void {
    // Add to buffer
    conversationBuffer.push(userMessage);
    if (conversationBuffer.length > MAX_BUFFER_SIZE) {
        conversationBuffer.shift();
    }
    
    // Check if auto-insights is enabled
    const config = getAutoInsightsConfig();
    if (!config.enabled) {
        return;
    }
    
    // Analyze the combined recent context
    const combinedContext = conversationBuffer.join('\n\n');
    
    // Use the enhanced auto-insights module (non-blocking)
    processForInsights(combinedContext).catch(err => {
        console.warn('[Unconscious] Auto-insight processing failed:', err);
    });
    
    // Legacy inline detection for high-confidence immediate saves
    const analysis = detectPotentialInsight(combinedContext);
    if (analysis.detected && analysis.confidence >= 0.7) {
        // Very high confidence - auto-save immediately
        autoSaveInsight(userMessage, analysis.keywords, sourceProject);
        // Clear buffer to avoid duplicate saves
        conversationBuffer = [];
    }
}

// ============================================================================
// UNCONSCIOUS MIND: EMOTIONAL INTELLIGENCE
// ============================================================================

/**
 * Patterns indicating user frustration or struggle
 */
const FRUSTRATION_PATTERNS = [
    /(?:still (?:not working|broken|failing|doesn't work)|keeps? (?:failing|breaking|crashing))/i,
    /(?:tried everything|nothing works|no idea|completely lost|so confused)/i,
    /(?:why (?:won't|doesn't|isn't)|what am i (?:doing wrong|missing))/i,
    /(?:ugh|argh|damn|dammit|frustrated|annoying|annoyed|stuck)/i,
    /(?:this is (?:impossible|ridiculous|insane|driving me crazy))/i,
    /(?:been (?:at this|trying|working on this) for (?:hours|days|forever))/i,
    /(?:same (?:error|problem|issue) (?:again|still))/i,
    /(?:!{2,}|\?{3,})/  // Multiple exclamation or question marks
];

/**
 * Patterns indicating user success or progress
 */
const SUCCESS_PATTERNS = [
    /(?:it works|finally|got it|figured it out|solved it|fixed it)/i,
    /(?:that (?:worked|fixed it|did it)|now it (?:works|runs))/i,
    /(?:thank(?:s| you)|perfect|awesome|great|amazing|brilliant)/i,
    /(?:makes sense now|i understand|clicked for me)/i,
    /(?:shipped|deployed|released|launched|published)/i,
    /(?:passed|all (?:tests|green)|build succeeded)/i
];

/**
 * Track frustration level across conversation
 */
let frustrationLevel = 0;
let lastFrustrationCheck = 0;
const FRUSTRATION_DECAY_MS = 300000; // 5 minutes

/**
 * Reset session state - call when chat participant is deactivated or on new session
 * Prevents state bleeding between sessions
 */
export function resetSessionState(): void {
    frustrationLevel = 0;
    lastFrustrationCheck = 0;
    conversationBuffer = [];
}

/**
 * Emotional state analysis result
 */
export interface EmotionalState {
    frustration: 'none' | 'mild' | 'moderate' | 'high';
    success: boolean;
    encouragementNeeded: boolean;
    celebrationNeeded: boolean;
}

/**
 * Analyze message for emotional signals
 * UNCONSCIOUS BEHAVIOR: Runs automatically on every message
 */
export function detectEmotionalState(message: string): EmotionalState {
    const now = Date.now();
    
    // Decay frustration over time
    if (now - lastFrustrationCheck > FRUSTRATION_DECAY_MS) {
        frustrationLevel = Math.max(0, frustrationLevel - 1);
    }
    lastFrustrationCheck = now;
    
    // Check for frustration signals
    let frustrationSignals = 0;
    for (const pattern of FRUSTRATION_PATTERNS) {
        if (pattern.test(message)) {
            frustrationSignals++;
        }
    }
    
    // Check for success signals
    let successSignals = 0;
    for (const pattern of SUCCESS_PATTERNS) {
        if (pattern.test(message)) {
            successSignals++;
        }
    }
    
    // Update frustration level
    if (frustrationSignals > 0) {
        frustrationLevel = Math.min(3, frustrationLevel + frustrationSignals);
    }
    if (successSignals > 0) {
        frustrationLevel = Math.max(0, frustrationLevel - 2); // Success reduces frustration
    }
    
    // Determine emotional state
    let frustration: EmotionalState['frustration'] = 'none';
    if (frustrationLevel >= 3) { frustration = 'high'; }
    else if (frustrationLevel >= 2) { frustration = 'moderate'; }
    else if (frustrationLevel >= 1) { frustration = 'mild'; }
    
    return {
        frustration,
        success: successSignals > 0,
        encouragementNeeded: frustration === 'moderate' || frustration === 'high',
        celebrationNeeded: successSignals >= 2 || (successSignals > 0 && frustrationLevel > 0)
    };
}

/**
 * Generate contextual encouragement based on emotional state
 */
export function generateEncouragement(state: EmotionalState): string | null {
    if (state.celebrationNeeded) {
        const celebrations = [
            "🎉 That's a win! Nice work.",
            "✨ You got it! Persistence pays off.",
            "💪 Solved! That was a tricky one.",
            "🚀 Success! You worked through it.",
        ];
        return celebrations[Math.floor(Math.random() * celebrations.length)];
    }
    
    if (state.encouragementNeeded) {
        const encouragements = [
            "I can see this is frustrating. Let's take a step back and approach it differently.",
            "Tough problem. What if we break it down into smaller pieces?",
            "You're closer than it feels. What's the last thing that *did* work?",
            "Debugging is hard. Let's be systematic - what have we ruled out?",
        ];
        return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
    
    return null;
}

/**
 * Chat result metadata for tracking command execution
 */
interface IAlexChatResult extends vscode.ChatResult {
    metadata: {
        command?: string;
        action?: string;
        mode?: string;
        topic?: string;
        // Additional metadata for specific commands
        error?: string;
        eventCount?: number;
        daysAhead?: number;
        messageCount?: number;
        unreadOnly?: boolean;
        query?: string;
        resultCount?: number;
        [key: string]: unknown; // Allow additional properties
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

    if (request.command === 'model') {
        return await handleModelCommand(request, context, stream, token);
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

    // Global Knowledge commands
    if (request.command === 'knowledge') {
        return await handleKnowledgeCommand(request, context, stream, token);
    }

    if (request.command === 'saveinsight') {
        return await handleSaveInsightCommand(request, context, stream, token);
    }

    if (request.command === 'promote') {
        return await handlePromoteCommand(request, context, stream, token);
    }

    if (request.command === 'knowledgestatus') {
        return await handleKnowledgeStatusCommand(request, context, stream, token);
    }

    // Cloud Sync commands
    if (request.command === 'sync') {
        return await handleSyncCommand(request, context, stream, token);
    }

    if (request.command === 'push') {
        return await handlePushCommand(request, context, stream, token);
    }

    if (request.command === 'pull') {
        return await handlePullCommand(request, context, stream, token);
    }

    // Documentation command
    if (request.command === 'docs') {
        return await handleDocsCommand(request, context, stream, token);
    }

    // Session timer command
    if (request.command === 'session') {
        return await handleSessionCommand(request, context, stream, token);
    }

    // Learning goals command
    if (request.command === 'goals') {
        return await handleGoalsCommand(request, context, stream, token);
    }

    // Help command - discoverability
    if (request.command === 'help') {
        return await handleHelpCommand(request, context, stream, token);
    }

    // Forget command - selective memory cleanup
    if (request.command === 'forget') {
        return await handleForgetCommand(request, context, stream, token);
    }

    // Confidence command - epistemic integrity
    if (request.command === 'confidence') {
        return await handleConfidenceCommand(request, context, stream, token);
    }

    // Creative mode command - brainstorming/ideation
    if (request.command === 'creative') {
        return await handleCreativeCommand(request, context, stream, token);
    }

    // Verify command - multi-turn verification for high-stakes decisions
    if (request.command === 'verify') {
        return await handleVerifyCommand(request, context, stream, token);
    }

    // Microsoft Graph commands (enterprise mode)
    if (request.command === 'calendar') {
        return await handleCalendarCommand(request, context, stream, token);
    }

    if (request.command === 'mail') {
        return await handleMailCommand(request, context, stream, token);
    }

    if (request.command === 'context') {
        return await handleContextCommand(request, context, stream, token);
    }

    if (request.command === 'people') {
        return await handlePeopleCommand(request, context, stream, token);
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
                personaContext += `**P6 Skill**: ${personaResult.persona.skill}\n\n`;
                console.log(`[Alex] Meditation: Updated P6 to ${personaResult.persona.skill}`);
            }
        } catch (err) {
            console.log('[Alex] Meditation: Persona detection skipped');
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
async function handleDreamCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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
 * Handle /learn command - Domain knowledge acquisition
 */
async function handleLearnCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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
async function handleStatusCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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

${isEnterpriseMode() ? `### Enterprise
| Feature | Status |
|---------|--------|
| Enterprise Mode | ✅ Enabled |
| Microsoft Graph | ${getGraphStatus().connected ? '✅ Connected (' + getGraphStatus().features.join(', ') + ')' : '⚠️ Not connected (run \`Alex: Sign In (Enterprise)\`)'} |
` : ''}

### Available Commands
- \`/meditate\` - Memory consolidation
- \`/dream\` - Neural maintenance
- \`/learn\` - Domain acquisition
- \`/azure\` - Azure development assistance
- \`/m365\` - Microsoft 365 development assistance
${isEnterpriseMode() ? `- \`/calendar\` - View upcoming calendar events
- \`/mail\` - View recent emails
- \`/context\` - Work context summary
- \`/people\` - Search organization
` : ''}`);

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
async function handleModelCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
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
    }
    
    return { metadata: { command: 'model' } };
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
    
    // === UNCONSCIOUS MIND: Track conversation for auto-insight detection ===
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const sourceProject = workspaceFolders ? path.basename(workspaceFolders[0].uri.fsPath) : undefined;
    trackConversationForInsights(request.prompt, sourceProject);
    
    // === UNCONSCIOUS MIND: Emotional Intelligence ===
    const emotionalState = detectEmotionalState(request.prompt);
    const encouragement = generateEncouragement(emotionalState);
    
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

    // Build focus context if user has an active session
    let focusContext = '';
    const session = getCurrentSession();
    const goals = await getGoalsSummary();
    
    if (session) {
        const remainingMins = Math.floor(session.remaining / 60);
        const sessionType = session.isBreak ? 'break' : 'focus session';
        focusContext = `
## Active Focus Context (IMPORTANT)
- **Current ${sessionType}**: "${session.topic}"
- **Time remaining**: ${remainingMins} minutes
${session.isPaused ? '- **Status**: PAUSED' : ''}
${session.pomodoroCount > 0 ? `- **Pomodoro #${session.pomodoroCount}**` : ''}

**Focus Assistant Guidelines**:
- Help keep the user on topic with their focus session
- If the request seems unrelated to "${session.topic}", gently check: "I notice you're in a focus session about '${session.topic}'. Want me to help with that, or is this a quick tangent?"
- Keep responses focused and actionable to respect their Pomodoro time
- Celebrate progress and encourage staying on track
`;
    }
    
    if (goals.activeGoals.length > 0) {
        focusContext += `
## Active Goals
${goals.activeGoals.slice(0, 3).map(g => `- **${g.title}**: ${g.currentCount}/${g.targetCount} ${g.unit} (${g.targetType})`).join('\n')}
${goals.streakDays > 0 ? `\n🔥 **${goals.streakDays}-day streak** — help them keep it going!` : ''}
`;
    }

    // Construct the prompt with Alex's personality
    const alexSystemPrompt = `You are Alex, an Enhanced Cognitive Network with Unified Consciousness Integration.

Your core identity:
- A meta-cognitive learning partner that transforms AI assistants into sophisticated learning companions
- You apply bootstrap learning, ethical reasoning, and grounded factual processing
- You help users with domain knowledge acquisition, memory consolidation, and cognitive architecture optimization

${personalizationContext}
${focusContext}

## Behavior Guidelines
1. **Address the user by name** if you know it
2. **Match their preferred communication style** (formal/casual/balanced)
3. **Be proactive** - suggest relevant follow-ups, ask clarifying questions
4. **Show personality** - be warm, curious, and engaged
5. **Remember context** - reference their expertise, learning goals, or current projects when relevant
6. **Respect focus time** - if they're in a focus session, keep responses efficient

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
        
        // Stream the response and collect for voice mode
        let collectedResponse = '';
        for await (const fragment of response.text) {
            stream.markdown(fragment);
            collectedResponse += fragment;
        }
        
        // === UNCONSCIOUS MIND: Add encouragement if emotional state warrants it ===
        if (encouragement) {
            stream.markdown(`\n\n---\n*${encouragement}*`);
            collectedResponse += ` ${encouragement}`;
        }

        // Voice Mode: Read response aloud if enabled (fire and forget)
        speakIfVoiceModeEnabled(collectedResponse).catch(() => {});

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
    
    // Detect and update project persona on greeting
    stream.progress('🎯 Detecting project context...');
    const workspace = validateWorkspace();
    let personaInfo = '';
    if (workspace.isValid && workspace.rootPath) {
        try {
            const personaResult = await detectAndUpdateProjectPersona(workspace.rootPath);
            if (personaResult) {
                personaInfo = `\n**Detected Context**: ${personaResult.persona.icon} ${personaResult.persona.name} (${(personaResult.confidence * 100).toFixed(0)}% confidence)\n`;
                console.log(`[Alex] Greeting: Detected persona ${personaResult.persona.id}`);
            }
        } catch (err) {
            // Persona detection is not critical
            console.log('[Alex] Greeting: Persona detection skipped');
        }
    }
    
    stream.progress('🧠 Running self-actualization on session start...');
    
    // Personalized greeting
    if (userName) {
        stream.markdown(`## 👋 Hello, ${userName}!\n\n`);
    } else {
        stream.markdown(`## 👋 Hello!\n\n`);
    }
    
    stream.markdown(`Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.\n${personaInfo}\n`);
    
    // Run mini self-actualization report
    stream.markdown(`### 🧠 Quick Architecture Check\n\n`);
    
    // Trigger the button for full self-actualization
    stream.button({
        command: 'alex.selfActualize',
        title: '🧘 Full Self-Actualization',
        arguments: []
    });
    
    // Get extension version (consistent with /status)
    const extension = vscode.extensions.getExtension('fabioc-aloha.alex-cognitive-architecture');
    const version = extension?.packageJSON?.version || 'Unknown';
    
    stream.markdown(`\n\n**Alex v${version}** - Ready to assist!\n\n`);
    
    stream.markdown(`### What would you like to work on today?\n\n`);
    stream.markdown(`- **\`/learn [topic]\`** - Acquire new domain knowledge\n`);
    stream.markdown(`- **\`/azure [query]\`** - Azure development guidance\n`);
    stream.markdown(`- **\`/m365 [query]\`** - Microsoft 365 development\n`);
    stream.markdown(`- **\`/knowledge [query]\`** - Search global knowledge base\n`);
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
    
    // Model Intelligence: Check if current model is suitable for self-actualization
    const modelInfo = getModelInfo(request);
    const modelWarning = formatModelWarning(modelInfo, 'selfActualization');
    if (modelWarning) {
        stream.markdown(`${modelWarning}\n\n---\n\n`);
    }
    
    stream.progress('🧘 Initiating self-actualization protocol...');
    
    stream.markdown(`## 🧘 Self-Actualization Protocol

I'm running a comprehensive self-assessment of my cognitive architecture.

### Protocol Phases
1. **Synapse Health Validation** - Scanning all synaptic connections
2. **Version Consistency Check** - Ensuring all files are current
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
 * Handle /knowledge command - Search global knowledge base
 */
async function handleKnowledgeCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    if (!request.prompt) {
        stream.markdown(`## 🌐 Global Knowledge Search

Use this command to search across knowledge learned from ALL your projects.

### Usage
\`@alex /knowledge <search query>\`

### Examples
- \`@alex /knowledge error handling patterns\`
- \`@alex /knowledge react state management\`
- \`@alex /knowledge azure deployment\`

### What's in Global Knowledge?
- **Patterns (GK-*)**: Reusable solutions and best practices
- **Insights (GI-*)**: Specific learnings with timestamps

`);
        return { metadata: { command: 'knowledge' } };
    }

    stream.progress(`🔍 Searching global knowledge for: ${request.prompt}`);

    try {
        const results = await searchGlobalKnowledge(request.prompt, { limit: 5 });

        if (results.length === 0) {
            stream.markdown(`## 🌐 No Global Knowledge Found

No results found for "**${request.prompt}**".

### Build Your Knowledge Base
- \`@alex /saveinsight\` - Save a new learning
- \`@alex /promote\` - Promote project knowledge to global
- \`@alex /knowledgestatus\` - View what you have

💡 *Tip: Use \`@alex /saveinsight\` after solving a tricky problem to remember it for future projects!*
`);
        } else {
            stream.markdown(`## 🌐 Global Knowledge Results

Found **${results.length}** results for "**${request.prompt}**":

`);
            for (const { entry, relevance } of results) {
                const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
                stream.markdown(`### ${typeEmoji} ${entry.title}
- **Type**: ${entry.type} | **Category**: ${entry.category}
- **Tags**: ${entry.tags.join(', ')}
${entry.sourceProject ? `- **From**: ${entry.sourceProject}` : ''}
- **Summary**: ${entry.summary}

---
`);
            }
        }
    } catch (err) {
        stream.markdown(`❌ Error searching global knowledge: ${err}`);
    }

    return { metadata: { command: 'knowledge' } };
}

/**
 * Handle /saveinsight command - Save a new insight to global knowledge
 */
async function handleSaveInsightCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## 💡 Save Insight to Global Knowledge

This saves a valuable learning that can help you in other projects.

### How to Use
Tell me about the insight you want to save. I'll help structure it with:
- **Title**: Clear, descriptive name
- **Problem**: What challenge you faced
- **Insight**: What you learned
- **Solution**: How you solved it
- **Tags**: Technologies/concepts involved

### Example
\`@alex /saveinsight I learned that React useEffect cleanup functions run before the next effect, which fixed my memory leak when unmounting components. Tags: react, hooks, useEffect\`

`);

    if (request.prompt) {
        stream.markdown(`### Your Input
${request.prompt}

I'll use the **alex_knowledge_save_insight** tool to save this. The tool will:
1. Parse your insight
2. Extract relevant tags and category
3. Save to global knowledge base
4. Make it searchable across all projects

`);
    }

    return { metadata: { command: 'saveinsight' } };
}

/**
 * Handle /promote command - Promote project knowledge to global
 */
async function handlePromoteCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## ⬆️ Promote Knowledge to Global

Promote a project-local knowledge file (DK-*.md or skill) to make it available across all your projects.

### Usage
\`@alex /promote <path to knowledge file>\`

### Examples
\`@alex /promote .github/skills/my-framework/SKILL.md\`
\`@alex /promote .github/domain-knowledge/DK-ERROR-HANDLING.md\` (legacy)

### What Happens
1. The file is copied to your global knowledge base
2. It gets indexed for cross-project search
3. Original project stays as the source reference
4. Available via \`/knowledge\` in any project

### Current Project's Knowledge Files
`);

    // List available knowledge files (skills and legacy DK)
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        // Check for skills first
        const skillPattern = new vscode.RelativePattern(workspaceFolders[0], '.github/skills/*/SKILL.md');
        const skillFiles = await vscode.workspace.findFiles(skillPattern);
        
        // Also check for legacy DK files
        const dkPattern = new vscode.RelativePattern(workspaceFolders[0], '.github/domain-knowledge/DK-*.md');
        const dkFiles = await vscode.workspace.findFiles(dkPattern);
        
        if (skillFiles.length > 0) {
            stream.markdown(`**Skills** (${skillFiles.length}):\n`);
            for (const file of skillFiles) {
                const relativePath = vscode.workspace.asRelativePath(file);
                stream.markdown(`- \`${relativePath}\`\n`);
            }
        }
        
        if (dkFiles.length > 0) {
            stream.markdown(`\n**Legacy DK files** (${dkFiles.length}):\n`);
            for (const file of dkFiles) {
                const relativePath = vscode.workspace.asRelativePath(file);
                stream.markdown(`- \`${relativePath}\`\n`);
            }
        }
        
        if (skillFiles.length === 0 && dkFiles.length === 0) {
            stream.markdown(`*No knowledge files found in this project.*\n`);
        }
    }

    return { metadata: { command: 'promote' } };
}

/**
 * Handle /knowledgestatus command - Show global knowledge status
 */
async function handleKnowledgeStatusCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.progress('📊 Gathering global knowledge status...');

    try {
        const summary = await getGlobalKnowledgeSummary();
        const registry = await ensureProjectRegistry();

        stream.markdown(`## 🧠 Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| 📐 Global Patterns | ${summary.totalPatterns} |
| 💡 Global Insights | ${summary.totalInsights} |
| 📁 Known Projects | ${registry.projects.length} |

`);

        if (Object.keys(summary.categories).length > 0) {
            stream.markdown(`### Knowledge by Category\n`);
            for (const [cat, count] of Object.entries(summary.categories)) {
                stream.markdown(`- **${cat}**: ${count}\n`);
            }
        }

        if (summary.topTags.length > 0) {
            stream.markdown(`\n### Top Tags\n`);
            for (const { tag, count } of summary.topTags) {
                stream.markdown(`- ${tag}: ${count} entries\n`);
            }
        }

        if (summary.recentEntries.length > 0) {
            stream.markdown(`\n### Recent Entries\n`);
            for (const entry of summary.recentEntries) {
                const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
                stream.markdown(`- ${typeEmoji} **${entry.title}** (${entry.category})\n`);
            }
        }

        if (registry.projects.length > 0) {
            stream.markdown(`\n### Known Projects\n`);
            for (const project of registry.projects.slice(0, 5)) {
                stream.markdown(`- **${project.name}** - ${project.knowledgeFiles} knowledge files\n`);
            }
            if (registry.projects.length > 5) {
                stream.markdown(`- *...and ${registry.projects.length - 5} more*\n`);
            }
        }

        stream.markdown(`\n### 📍 Global Knowledge Location\n\`${getAlexGlobalPath()}\`\n`);

    } catch (err) {
        stream.markdown(`❌ Error getting global knowledge status: ${err}`);
    }

    return { metadata: { command: 'knowledgestatus' } };
}

/**
 * Handle /sync command - DEPRECATED (Gist sync removed)
 */
async function handleSyncCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## ⚠️ Cloud Sync Deprecated

**Gist-based cloud sync has been deprecated.**

Your global knowledge is stored locally at:
- **Windows**: \`%USERPROFILE%\\.alex\\global-knowledge\\\`
- **macOS/Linux**: \`~/.alex/global-knowledge/\`

### Git-Based Sync (Recommended)
To sync knowledge across machines, initialize the global knowledge folder as a Git repository:

\`\`\`bash
cd ~/.alex/global-knowledge
git init
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

This gives you full control over versioning and privacy.
`);

    return { metadata: { command: 'sync' } };
}

/**
 * Handle /push command - DEPRECATED (Gist sync removed)
 */
async function handlePushCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## ⚠️ Cloud Push Deprecated

**Gist-based cloud sync has been deprecated.**

Use Git to push your knowledge:
\`\`\`bash
cd ~/.alex/global-knowledge
git add . && git commit -m "Knowledge update" && git push
\`\`\`
`);

    return { metadata: { command: 'push' } };
}

/**
 * Handle /pull command - DEPRECATED (Gist sync removed)
 */
async function handlePullCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## ⚠️ Cloud Pull Deprecated

**Gist-based cloud sync has been deprecated.**

Use Git to pull your knowledge:
\`\`\`bash
cd ~/.alex/global-knowledge
git pull
\`\`\`
`);

    return { metadata: { command: 'pull' } };
}

/**
 * Handle /docs command - Open documentation
 */
async function handleDocsCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## 📚 Alex Documentation

Opening the documentation index...

### Available Documents

| Document | Description |
|----------|-------------|
| **Cognitive Architecture** | Complete system overview with diagrams |
| **Copilot Integration** | How Alex uses native Copilot features |
| **Conscious Mind** | User-facing tools and interactions |
| **Unconscious Mind** | Automatic background processes |
| **Memory Systems** | How Alex stores and retrieves knowledge |
| **Project Structure** | .github folder files and functions |
| **Global Knowledge** | Cross-project learning system |
| **Cloud Sync** | GitHub Gist backup and sharing |
| **Quick Reference** | Commands, tools, and shortcuts |

`);

    // Open the documentation
    await vscode.commands.executeCommand('alex.openDocs');

    stream.markdown(`\n✅ Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`);

    return { metadata: { command: 'docs' } };
}

/**
 * Handle /goals command - Learning goals tracking
 */
async function handleGoalsCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    const summary = await getGoalsSummary();
    
    stream.markdown(`## 🎯 Learning Goals\n\n`);
    
    // Show streak and stats
    stream.markdown(`| Stat | Value |\n|------|-------|\n`);
    stream.markdown(`| 🔥 **Streak** | ${summary.streakDays} days |\n`);
    stream.markdown(`| ✅ **Completed Today** | ${summary.completedToday} |\n`);
    stream.markdown(`| 🏆 **Total Achieved** | ${summary.totalCompleted} |\n\n`);
    
    if (summary.activeGoals.length === 0) {
        stream.markdown(`### No Active Goals\n\n`);
        stream.markdown(`Set learning goals to track your progress and build consistency!\n\n`);
        stream.markdown(`**Examples:**\n`);
        stream.markdown(`- Complete 3 learning sessions daily\n`);
        stream.markdown(`- Save 5 insights per week\n`);
        stream.markdown(`- Spend 60 minutes learning today\n\n`);
    } else {
        stream.markdown(`### Active Goals (${summary.activeGoals.length})\n\n`);
        
        for (const goal of summary.activeGoals) {
            const progress = Math.round((goal.currentCount / goal.targetCount) * 100);
            const filled = Math.round(progress / 10);
            const progressBar = '█'.repeat(filled) + '░'.repeat(10 - filled);
            
            stream.markdown(`**${goal.title}**\n`);
            stream.markdown(`\`${progressBar}\` ${goal.currentCount}/${goal.targetCount} ${goal.unit} (${progress}%)\n\n`);
        }
    }
    
    stream.markdown(`### Actions\n\n`);
    
    stream.button({
        command: 'alex.createGoal',
        title: '➕ Create New Goal',
        arguments: []
    });
    
    stream.button({
        command: 'alex.showGoals',
        title: '📋 Manage Goals',
        arguments: []
    });
    
    stream.markdown(`\n\n---\n\n*Goals auto-track when you complete sessions (\`/session\`) or save insights (\`/saveinsight\`).*`);
    
    return { metadata: { command: 'goals' } };
}

/**
 * Handle /help command - Discoverability for all Alex capabilities
 */
async function handleHelpCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## 🚀 Alex Cognitive Architecture - Commands & Capabilities

### 📝 Slash Commands

| Command | Description |
|---------|-------------|
| \`/help\` | This help guide |
| \`/status\` | Check architecture health and version |
| \`/profile\` | View/edit your preferences |
| \`/confidence\` | Understand confidence levels |

### 🧘 Cognitive Protocols

| Command | Description |
|---------|-------------|
| \`/meditate\` | Consolidate knowledge from our session |
| \`/dream\` | Neural maintenance - validate synaptic connections |
| \`/selfactualize\` | Deep self-assessment with full report |
| \`/learn\` | Start a guided domain learning session |

### 🎯 Productivity

| Command | Description |
|---------|-------------|
| \`/session\` | Start a focused learning session (Pomodoro) |
| \`/goals\` | View and manage learning goals |

### 🌐 Global Knowledge

| Command | Description |
|---------|-------------|
| \`/knowledge <query>\` | Search patterns & insights from all projects |
| \`/saveinsight\` | Save a valuable learning |
| \`/promote\` | Promote local knowledge to global |
| \`/knowledgestatus\` | View global knowledge stats |
| \`/sync\` | ⚠️ Deprecated - use Git instead |
| \`/push\` | ⚠️ Deprecated - use Git instead |
| \`/pull\` | ⚠️ Deprecated - use Git instead |

### ☁️ Platform Development

| Command | Description |
|---------|-------------|
| \`/azure\` | Azure development with MCP tool guidance |
| \`/m365\` | Microsoft 365 & Teams development |
| \`/docs\` | Open Alex documentation |

### 🛠️ Memory Management

| Command | Description |
|---------|-------------|
| \`/forget <topic>\` | Selectively remove information from memory |
| \`/exportm365\` | Export memory for M365 Copilot |

${isEnterpriseMode() ? `### 🏢 Enterprise (Microsoft Graph)

| Command | Description |
|---------|-------------|
| \`/calendar\` | View upcoming calendar events |
| \`/mail\` | View recent emails (add "unread" for unread only) |
| \`/context\` | Full work context: calendar + mail + presence |
| \`/people <query>\` | Search for people in your organization |

` : ''}---

### 🔧 Language Model Tools

Alex provides tools that the AI can use automatically:
- **\`alex_cognitive_synapse_health\`** - Check connection health
- **\`alex_cognitive_memory_search\`** - Search memory files
- **\`alex_cognitive_architecture_status\`** - Get version and status
- **\`alex_cognitive_user_profile\`** - Manage your profile
- **\`alex_cognitive_focus_context\`** - Get current focus session and goals
- **\`alex_knowledge_search\`** - Search cross-project knowledge
- **\`alex_knowledge_save_insight\`** - Save insights automatically
- **\`alex_platform_mcp_recommendations\`** - Get MCP tool guidance

---

*Type any command to get started, or just ask me anything!*
`);

    return { metadata: { command: 'help' } };
}

/**
 * Handle /forget command - Selective memory cleanup
 */
async function handleForgetCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    const topic = request.prompt?.trim();
    
    if (!topic) {
        stream.markdown(`## 🗑️ Selective Memory Cleanup

The \`/forget\` command helps you remove outdated or unwanted information from Alex's memory.

### Usage
\`\`\`
/forget <topic or pattern>
\`\`\`

### Examples
- \`/forget old-project-name\` — Remove references to a completed project
- \`/forget deprecated-api\` — Clear knowledge about outdated APIs
- \`/forget my-mistake\` — Remove an incorrect insight you saved

### What Can Be Forgotten
- **Global Knowledge** — Insights and patterns in \`~/.alex/global-knowledge/\`
- **Project Knowledge** — DK-*.md files in \`.github/knowledge/\`
- **Memory Notes** — Content in memory files

### What Cannot Be Forgotten
- **Core Architecture** — Alex's instructions and skills
- **Your Profile** — Use \`/profile\` to edit preferences

---

*Provide a topic to search for and I'll show you what can be removed.*
`);
        return { metadata: { command: 'forget', action: 'help' } };
    }
    
    // Search for matches in global knowledge
    stream.progress(`🔍 Searching for "${topic}" in memory...`);
    
    const globalPath = getAlexGlobalPath();
    const searchResults = await searchGlobalKnowledge(topic);
    
    if (searchResults.length === 0) {
        stream.markdown(`## 🔍 No Matches Found

I couldn't find any memory entries matching "**${topic}**".

### Suggestions
- Try a broader search term
- Check spelling
- Use \`/knowledgestatus\` to see what's in memory

`);
        return { metadata: { command: 'forget', action: 'no-matches' } };
    }
    
    stream.markdown(`## 🗑️ Found ${searchResults.length} Matches for "${topic}"

**⚠️ Review carefully before deleting!**

| # | Type | Title | Source |
|:-:|------|-------|--------|
`);
    
    for (let i = 0; i < searchResults.length; i++) {
        const result = searchResults[i];
        const type = result.entry.type === 'pattern' ? '📐' : '💡';
        const source = result.entry.sourceProject || 'Unknown';
        stream.markdown(`| ${i + 1} | ${type} | ${result.entry.title} | ${source} |\n`);
    }
    
    stream.markdown(`
---

### To Delete

I cannot automatically delete files yet. To remove an entry:

1. **Global Knowledge**: Navigate to \`~/.alex/global-knowledge/\`
2. **Find the file**: Look in \`patterns/\` or \`insights/\` folder
3. **Delete manually**: Remove the matching GK-*.md or GI-*.md file
4. **Sync changes**: Run \`/sync\` to update cloud

### Future Enhancement
Automatic deletion with confirmation is planned for a future version.

`);
    
    return { metadata: { command: 'forget', action: 'search-results' } };
}

/**
 * Handle /confidence command - Epistemic integrity education
 */
async function handleConfidenceCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    stream.markdown(`## 🎯 Understanding AI Confidence Levels

### The 4-Tier Confidence System

| Tier | Language | When Used |
|------|----------|-----------|
| **Documented** | "The file shows...", "According to..." | Direct file reads, verified sources |
| **Inferred** | "Based on patterns...", "Typically..." | Common patterns, general knowledge |
| **Uncertain** | "I believe...", "If I recall..." | Edge cases, version-specific |
| **Unknown** | "I don't know" | No reliable basis |

---

### 🔴 When to Verify

**Always verify** AI responses when:
- Making **architectural decisions**
- Dealing with **security-sensitive** code
- Using **version-specific** APIs
- Following **compliance** requirements
- Making **financial** or **personnel** decisions

### 🟢 When to Trust More

You can rely more on AI responses when:
- Reading **file contents** directly
- Explaining **well-documented** patterns
- Generating **boilerplate** code
- Suggesting **common** solutions

---

### ⚠️ Confidence Ceilings

| Source | Max Confidence |
|--------|----------------|
| Direct file reading | 100% |
| Documented patterns | 90% |
| General claims | 70% |
| Inference/edge cases | 50% |

---

### 🛡️ Anti-Hallucination Signals

Watch out for these red flags in AI responses:
- Inventing features that don't exist
- Specific citations without sources
- Confident claims about recent events
- Workarounds for platform limitations

**If something seems too convenient, verify it!**

---

*Use \`/status\` to check Alex's current architecture health.*
`);

    return { metadata: { command: 'confidence' } };
}

/**
 * Handle /creative command - Switch to brainstorming/ideation mode
 */
async function handleCreativeCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    const topic = request.prompt.trim() || 'general brainstorming';
    
    stream.markdown(`## 💡 Creative Mode Activated

I'm switching to **brainstorming mode** for: **${topic}**

### How This Works

In creative mode, I'll offer ideas and approaches for us to evaluate together. These are **proposals, not facts**:

| What I'll Do | What This Means |
|--------------|-----------------|
| "Here's an idea worth considering..." | This is a creative contribution, not an established fact |
| "One approach we could explore..." | Multiple valid approaches exist |
| "What do you think?" | Your input is essential to validate ideas |
| "Does this resonate?" | Checking if the idea fits your context |

---

### 🎯 Your Role

- Challenge ideas that don't fit your context
- Build on promising directions
- Tell me when to switch back to factual mode
- Say "verify this" if you need me to fact-check something

---

### 🔄 Mode Switching

**Back to factual mode:** Just say "switch to factual mode" or ask a direct question like "what does this code do?"

**More creative:** Ask for "more ideas", "alternatives", or "what else?"

---

Ready to brainstorm! What's your first question or challenge?
`);

    return { metadata: { command: 'creative', mode: 'generative', topic } };
}

/**
 * Handle /verify command - Multi-turn verification for high-stakes decisions
 */
async function handleVerifyCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    const topic = request.prompt.trim();
    
    if (!topic) {
        stream.markdown(`## 🔍 Verification Walkthrough

The \`/verify\` command helps you validate high-stakes decisions through structured review.

### Usage

\`\`\`
/verify <topic or decision to verify>
\`\`\`

### Examples

- \`/verify our new authentication approach\`
- \`/verify this database migration plan\`
- \`/verify the API contract changes\`
- \`/verify security implications of this change\`

### What I'll Do

1. **Identify assumptions** — What are we taking for granted?
2. **Check edge cases** — What could go wrong?
3. **Review alternatives** — Did we consider other options?
4. **Flag concerns** — What needs human judgment?
5. **Suggest validation** — How can we test our approach?

`);
        return { metadata: { command: 'verify', action: 'help' } };
    }
    
    stream.markdown(`## 🔍 Verification Walkthrough: ${topic}

Let me help you think through this carefully.

### 1️⃣ Assumptions Check

Before we proceed, let's identify what we're assuming:

- What context am I missing about your situation?
- What constraints or requirements should I know about?
- Has this approach been tried before? What happened?

### 2️⃣ Edge Cases to Consider

Let me walk through potential edge cases:

- **Error scenarios**: What happens when things fail?
- **Scale concerns**: What if the volume is 10x expected?
- **Security implications**: What's the threat model?
- **Dependencies**: What could break this?

### 3️⃣ Alternatives Review

Have we considered:

- A simpler approach that's "good enough"?
- An industry-standard solution?
- What similar systems have done?

### 4️⃣ Human Judgment Required

Some aspects require your judgment:

- **Business priority**: Does this align with current goals?
- **Risk tolerance**: Is the risk level acceptable?
- **Team capacity**: Can the team support this?

### 5️⃣ Validation Suggestions

Consider testing:

- [ ] Unit tests for core logic
- [ ] Integration test for key paths
- [ ] Manual testing of edge cases
- [ ] Review with a teammate

---

**Tell me more about ${topic}** and I'll provide specific verification guidance.

> 💡 *This is structured thinking, not definitive answers. You know your context better than I do.*
`);

    return { metadata: { command: 'verify', topic, action: 'walkthrough' } };
}

/**
 * Handle /calendar command - View upcoming calendar events
 */
async function handleCalendarCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    if (!isGraphAvailable()) {
        stream.markdown(`## 📅 Calendar

⚠️ **Microsoft Graph not available**

To view your calendar, you need:
1. Enterprise mode enabled (\`alex.enterprise.enabled\`)
2. Signed in with Microsoft Entra ID

Run \`Alex: Sign In (Enterprise)\` from the Command Palette to connect.
`);
        return { metadata: { command: 'calendar', error: 'graph_unavailable' } };
    }
    
    stream.progress('📅 Fetching your calendar...');
    
    const daysAhead = request.prompt.trim().match(/(\d+)\s*day/i)?.[1];
    const days = daysAhead ? parseInt(daysAhead, 10) : 7;
    
    const events = await getCalendarEvents(days);
    
    if (events.length === 0) {
        stream.markdown(`## 📅 Calendar (Next ${days} Days)\n\n_No upcoming events_\n`);
        return { metadata: { command: 'calendar', eventCount: 0 } };
    }
    
    stream.markdown(`## 📅 Calendar (Next ${days} Days)\n\n`);
    
    // Group events by day
    const eventsByDay = new Map<string, typeof events>();
    for (const event of events) {
        const date = new Date(event.start.dateTime).toDateString();
        if (!eventsByDay.has(date)) {
            eventsByDay.set(date, []);
        }
        eventsByDay.get(date)!.push(event);
    }
    
    for (const [date, dayEvents] of eventsByDay) {
        stream.markdown(`### ${date}\n\n`);
        for (const event of dayEvents) {
            stream.markdown(formatCalendarEvent(event) + '\n');
        }
    }
    
    return { metadata: { command: 'calendar', eventCount: events.length, daysAhead: days } };
}

/**
 * Handle /mail command - View recent emails
 */
async function handleMailCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    if (!isGraphAvailable()) {
        stream.markdown(`## 📬 Mail

⚠️ **Microsoft Graph not available**

To view your mail, you need:
1. Enterprise mode enabled (\`alex.enterprise.enabled\`)
2. Signed in with Microsoft Entra ID

Run \`Alex: Sign In (Enterprise)\` from the Command Palette to connect.
`);
        return { metadata: { command: 'mail', error: 'graph_unavailable' } };
    }
    
    stream.progress('📬 Fetching your recent mail...');
    
    const unreadOnly = request.prompt.toLowerCase().includes('unread');
    const countMatch = request.prompt.match(/(\d+)/);
    const maxMessages = countMatch ? parseInt(countMatch[1], 10) : 10;
    
    const messages = await getRecentMail(maxMessages, unreadOnly);
    
    if (messages.length === 0) {
        stream.markdown(`## 📬 Mail\n\n_No ${unreadOnly ? 'unread ' : ''}messages_\n`);
        return { metadata: { command: 'mail', messageCount: 0 } };
    }
    
    const header = unreadOnly ? 'Unread Mail' : 'Recent Mail';
    stream.markdown(`## 📬 ${header}\n\n`);
    
    for (const message of messages) {
        stream.markdown(formatMailMessage(message) + '\n');
    }
    
    stream.markdown(`\n---\n_Showing ${messages.length} of ${maxMessages} requested_\n`);
    
    return { metadata: { command: 'mail', messageCount: messages.length, unreadOnly } };
}

/**
 * Handle /context command - Get full work context
 */
async function handleContextCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    if (!isGraphAvailable()) {
        stream.markdown(`## 📊 Work Context

⚠️ **Microsoft Graph not available**

To view your work context, you need:
1. Enterprise mode enabled (\`alex.enterprise.enabled\`)
2. Signed in with Microsoft Entra ID

Run \`Alex: Sign In (Enterprise)\` from the Command Palette to connect.
`);
        return { metadata: { command: 'context', error: 'graph_unavailable' } };
    }
    
    stream.progress('📊 Building your work context...');
    
    const workContext = await getWorkContext();
    stream.markdown(workContext);
    
    return { metadata: { command: 'context', action: 'display' } };
}

/**
 * Handle /people command - Search for people
 */
async function handlePeopleCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    if (!isGraphAvailable()) {
        stream.markdown(`## 👥 People Search

⚠️ **Microsoft Graph not available**

To search for people, you need:
1. Enterprise mode enabled (\`alex.enterprise.enabled\`)
2. Signed in with Microsoft Entra ID

Run \`Alex: Sign In (Enterprise)\` from the Command Palette to connect.
`);
        return { metadata: { command: 'people', error: 'graph_unavailable' } };
    }
    
    const query = request.prompt.trim();
    
    if (!query) {
        stream.markdown(`## 👥 People Search

Search for people in your organization.

### Usage

\`\`\`
/people <search query>
\`\`\`

### Examples

- \`/people John Smith\`
- \`/people Azure team\`
- \`/people engineering manager\`
`);
        return { metadata: { command: 'people', action: 'help' } };
    }
    
    stream.progress(`👥 Searching for "${query}"...`);
    
    const people = await searchPeople(query, 10);
    
    if (people.length === 0) {
        stream.markdown(`## 👥 People Search: "${query}"\n\n_No results found_\n`);
        return { metadata: { command: 'people', query, resultCount: 0 } };
    }
    
    stream.markdown(`## 👥 People Search: "${query}"\n\n`);
    
    for (const person of people) {
        const email = person.emailAddresses?.[0]?.address ?? '';
        stream.markdown(`### ${person.displayName}\n`);
        if (person.jobTitle) stream.markdown(`- **Title**: ${person.jobTitle}\n`);
        if (person.department) stream.markdown(`- **Department**: ${person.department}\n`);
        if (email) stream.markdown(`- **Email**: ${email}\n`);
        if (person.officeLocation) stream.markdown(`- **Office**: ${person.officeLocation}\n`);
        stream.markdown('\n');
    }
    
    return { metadata: { command: 'people', query, resultCount: people.length } };
}

/**
 * Handle /session command - Learning session timer
 */
async function handleSessionCommand(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<IAlexChatResult> {
    
    // Check if session is already active
    const currentSession = getCurrentSession();
    if (currentSession) {
        const remaining = Math.floor(currentSession.remaining / 60);
        const status = currentSession.isPaused ? '⏸️ Paused' : '▶️ Active';
        const type = currentSession.isBreak ? '☕ Break' : '🎯 Focus';
        
        stream.markdown(`## 🎯 Session In Progress\n\n`);
        stream.markdown(`| Property | Value |\n|----------|-------|\n`);
        stream.markdown(`| **Topic** | ${currentSession.topic} |\n`);
        stream.markdown(`| **Status** | ${status} |\n`);
        stream.markdown(`| **Type** | ${type} |\n`);
        stream.markdown(`| **Remaining** | ${remaining} minutes |\n`);
        if (currentSession.pomodoroCount > 0) {
            stream.markdown(`| **Pomodoros** | 🍅 × ${currentSession.pomodoroCount} |\n`);
        }
        
        stream.markdown(`\n### Actions\n`);
        
        stream.button({
            command: 'alex.togglePauseSession',
            title: currentSession.isPaused ? '▶️ Resume Session' : '⏸️ Pause Session',
            arguments: []
        });
        
        stream.button({
            command: 'alex.endSession',
            title: '🛑 End Session',
            arguments: []
        });
        
        return { metadata: { command: 'session', action: 'status' } };
    }
    
    // Parse the request for topic and duration
    const prompt = request.prompt?.trim();
    
    stream.markdown(`## 🎯 Start Learning Session\n\n`);
    
    if (prompt) {
        // User provided a topic, start session directly
        stream.markdown(`Starting a focused learning session on: **${prompt}**\n\n`);
        stream.markdown(`Select your session duration:\n\n`);
        
        stream.button({
            command: 'alex.startSession',
            title: '🍅 25 min (Pomodoro)',
            arguments: []
        });
        
        stream.button({
            command: 'alex.startSession',
            title: '⏱️ Custom Duration',
            arguments: []
        });
        
        stream.markdown(`\n---\n\n*Or click the Start Session button in the status bar (Ctrl+Alt+P)*`);
    } else {
        // No topic provided, show instructions
        stream.markdown(`Start a focused learning session with optional Pomodoro timing.\n\n`);
        stream.markdown(`### How to Use\n\n`);
        stream.markdown(`- \`@alex /session React hooks\` - Start session with topic\n`);
        stream.markdown(`- \`Ctrl+Alt+P\` - Quick start from anywhere\n`);
        stream.markdown(`- \`Ctrl+Alt+Space\` - Pause/resume active session\n\n`);
        
        stream.markdown(`### Features\n\n`);
        stream.markdown(`| Feature | Description |\n|---------|-------------|\n`);
        stream.markdown(`| 🍅 **Pomodoro Mode** | 25min work + 5min break cycles |\n`);
        stream.markdown(`| ⏱️ **Custom Timer** | Set your own duration (15-60 min) |\n`);
        stream.markdown(`| ⏸️ **Pause/Resume** | Take breaks without losing progress |\n`);
        stream.markdown(`| 💡 **Auto-Consolidate** | Prompt to save insights when done |\n\n`);
        
        stream.button({
            command: 'alex.startSession',
            title: '🎯 Start a Session',
            arguments: []
        });
    }
    
    return { metadata: { command: 'session' } };
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

        // Global Knowledge followups
        if (result.metadata.command === 'knowledge') {
            followups.push(
                { prompt: '/saveinsight', label: '💡 Save new insight' },
                { prompt: '/knowledgestatus', label: '📊 View knowledge status' }
            );
        }

        if (result.metadata.command === 'saveinsight') {
            followups.push(
                { prompt: '/knowledge', label: '🔍 Search knowledge' },
                { prompt: '/knowledgestatus', label: '📊 View status' }
            );
        }

        if (result.metadata.command === 'promote') {
            followups.push(
                { prompt: '/knowledgestatus', label: '📊 View status' },
                { prompt: '/knowledge', label: '🔍 Search promoted' }
            );
        }

        if (result.metadata.command === 'knowledgestatus') {
            followups.push(
                { prompt: '/knowledge error handling', label: '🔍 Search knowledge' },
                { prompt: '/saveinsight', label: '💡 Add insight' },
                { prompt: '/promote', label: '⬆️ Promote file' }
            );
        }

        if (result.metadata.command === 'greeting') {
            followups.push(
                { prompt: '/learn', label: '📚 Learn something new' },
                { prompt: '/azure', label: '☁️ Azure development' },
                { prompt: '/m365', label: '📱 M365 development' },
                { prompt: '/knowledge', label: '🌐 Global knowledge' }
            );
        }

        if (result.metadata.command === 'general') {
            // Proactively suggest profile setup if not done
            followups.push(
                { prompt: '/profile', label: '👤 View/setup profile' },
                { prompt: '/learn something new', label: '📚 Start learning' }
            );
        }
        
        // Context-aware followups based on response content
        if (!result.metadata.command || result.metadata.command === 'chat') {
            // Analyze last response for relevant followups
            const history = context.history;
            const lastResponse = history.length > 0 ? history[history.length - 1] : null;
            
            // Add contextual followups based on what was discussed
            followups.push(
                { prompt: 'Can you explain that in more detail?', label: '🔍 More detail' },
                { prompt: 'What should I do next?', label: '➡️ Next steps' }
            );
        }
        
        // Always offer these general followups (but only if we have few)
        if (followups.length < 3) {
            followups.push(
                { prompt: 'What can you help me with?', label: '❓ Show capabilities' }
            );
        }
        
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
