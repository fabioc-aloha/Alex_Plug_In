import * as vscode from 'vscode';
import { IAlexChatResult } from '../participantTypes';
import { getUserProfile } from '../tools';
import { validateWorkspace } from '../../shared/utils';
import { detectAndUpdateProjectPersona } from '../personaDetection';
import { getModelInfo, formatModelWarning } from '../modelIntelligence';
import { searchGlobalKnowledge, getGlobalKnowledgeSummary, ensureProjectRegistry, getAlexGlobalPath } from '../globalKnowledge';

/**
 * Check if the user's prompt is a greeting
 */
export function isGreeting(prompt: string): boolean {
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
export function isStartOfSession(context: vscode.ChatContext): boolean {
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
export async function handleGreetingWithSelfActualization(
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
            }
        } catch (err) {
            // Persona detection is not critical
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
export async function handleSelfActualizeCommand(
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
export async function handleKnowledgeCommand(
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
export async function handleSaveInsightCommand(
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
export async function handlePromoteCommand(
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
export async function handleKnowledgeStatusCommand(
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
 * Handle /docs command - Open documentation
 */
export async function handleDocsCommand(
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
| **Quick Reference** | Commands, tools, and shortcuts |

`);

    // Open the documentation
    await vscode.commands.executeCommand('alex.openDocs');

    stream.markdown(`\n✅ Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`);

    return { metadata: { command: 'docs' } };
}

/**
 * Handle /help command - Discoverability for all Alex capabilities
 */
export async function handleHelpCommand(
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

###  Global Knowledge

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

---

### 🔧 Language Model Tools

Alex provides tools that the AI can use automatically:
- **\`alex_cognitive_synapse_health\`** - Check connection health
- **\`alex_cognitive_memory_search\`** - Search memory files
- **\`alex_cognitive_architecture_status\`** - Get version and status
- **\`alex_cognitive_user_profile\`** - Manage your profile
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
export async function handleForgetCommand(
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
export async function handleConfidenceCommand(
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
export async function handleCreativeCommand(
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
export async function handleVerifyCommand(
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
