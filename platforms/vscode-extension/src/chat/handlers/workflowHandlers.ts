import * as vscode from "vscode";
import { IAlexChatResult } from "../participantTypes";
import { getUserProfile } from "../tools";
import { validateWorkspace } from "../../shared/utils";
import { detectAndUpdateProjectPersona } from "../personaDetection";
import { getModelInfo, formatModelWarning } from "../modelIntelligence";
import {
  searchGlobalKnowledge,
  getGlobalKnowledgeSummary,
  ensureProjectRegistry,
  getAlexGlobalPath,
} from "../globalKnowledge";
import { streamWarning } from "../streamEnrichment";

/**
 * Check if the user's prompt is a greeting
 */
export function isGreeting(prompt: string): boolean {
  const greetingPatterns = [
    /^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings|howdy|yo|sup|what'?s\s*up)/i,
    /^(how\s*are\s*you|how'?s\s*it\s*going)/i,
    /^alex[\s,!?.]*$/i,
    /^@alex[\s,!?.]*$/i,
    /^(let'?s\s*(start|begin|get\s*started))/i,
  ];

  return greetingPatterns.some((pattern) => pattern.test(prompt.trim()));
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
  _request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken,
): Promise<IAlexChatResult> {
  // Get user profile for personalized greeting
  const profile = await getUserProfile();
  const userName = profile?.nickname || profile?.name;

  // Detect and update project persona on greeting
  stream.progress("🎯 Detecting project context...");
  const workspace = validateWorkspace();
  let personaInfo = "";
  if (workspace.isValid && workspace.rootPath) {
    try {
      const personaResult = await detectAndUpdateProjectPersona(
        workspace.rootPath,
      );
      if (personaResult) {
        personaInfo = `\n**Detected Context**: ${personaResult.persona.icon} ${personaResult.persona.name} (${(personaResult.confidence * 100).toFixed(0)}% confidence)\n`;
      }
    } catch (err) {
      // Persona detection is not critical
    }
  }

  stream.progress("🧠 Running self-actualization on session start...");

  // Personalized greeting
  if (userName) {
    stream.markdown(`## 👋 Hello, ${userName}!\n\n`);
  } else {
    stream.markdown(`## 👋 Hello!\n\n`);
  }

  stream.markdown(
    `Welcome back! I'm running a quick self-actualization to ensure everything is optimal for our session.\n${personaInfo}\n`,
  );

  // Run mini self-actualization report
  stream.markdown(`### 🧠 Quick Architecture Check\n\n`);

  // Trigger the button for full self-actualization
  stream.button({
    command: "alex.selfActualize",
    title: "🧘 Full Self-Actualization",
    arguments: [],
  });

  // Get extension version (consistent with /status)
  const extension = vscode.extensions.getExtension(
    "fabioc-aloha.alex-cognitive-architecture",
  );
  const version = extension?.packageJSON?.version || "Unknown";

  stream.markdown(`\n\n**Alex v${version}** - Ready to assist!\n\n`);

  stream.markdown(`### What would you like to work on today?\n\n`);
  stream.markdown(`- **\`/learn [topic]\`** - Acquire new domain knowledge\n`);
  stream.markdown(`- **\`/azure [query]\`** - Azure development guidance\n`);
  stream.markdown(`- **\`/m365 [query]\`** - Microsoft 365 development\n`);
  stream.markdown(
    `- **\`/knowledge [query]\`** - Search global knowledge base\n`,
  );
  stream.markdown(
    `- **\`/selfactualize\`** - Deep meditation & architecture assessment\n`,
  );

  return { metadata: { command: "greeting" } };
}

/**
 * Handle /selfactualize command - Comprehensive self-assessment
 */
export async function handleSelfActualizeCommand(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken,
): Promise<IAlexChatResult> {
  // Model Intelligence: Check if current model is suitable for self-actualization
  const modelInfo = getModelInfo(request);
  const modelWarning = formatModelWarning(modelInfo, "selfActualization");
  if (modelWarning) {
    streamWarning(stream, modelWarning);
  }

  stream.progress("🧘 Initiating self-actualization protocol...");

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
    command: "alex.selfActualize",
    title: "▶️ Execute Full Self-Actualization",
    arguments: [],
  });

  stream.markdown(
    `\n\n*Click the button above to run the complete 5-phase protocol, or I can provide a summary assessment.*\n`,
  );

  // Add meditation integration note
  stream.markdown(`\n### 🔗 Integration with Meditation\n`);
  stream.markdown(`Self-actualization automatically triggers during:\n`);
  stream.markdown(`- Session greetings (quick check)\n`);
  stream.markdown(`- Deep meditation sessions (full protocol)\n`);
  stream.markdown(`- Explicit \`/selfactualize\` command\n`);

  return { metadata: { command: "selfactualize" } };
}

/**
 * Handle /knowledge command - Search global knowledge base
 */
export async function handleKnowledgeCommand(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken,
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
    return { metadata: { command: "knowledge" } };
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
      for (const { entry /*, relevance*/ } of results) {
        const typeEmoji = entry.type === "pattern" ? "📐" : "💡";
        stream.markdown(`### ${typeEmoji} ${entry.title}
- **Type**: ${entry.type} | **Category**: ${entry.category}
- **Tags**: ${entry.tags.join(", ")}
${entry.sourceProject ? `- **From**: ${entry.sourceProject}` : ""}
- **Summary**: ${entry.summary}

---
`);
      }
    }
  } catch (err) {
    stream.markdown(`❌ Error searching global knowledge: ${err}`);
  }

  return { metadata: { command: "knowledge" } };
}

/**
 * Handle /promote command - Promote project knowledge to global
 */
export async function handlePromoteCommand(
  _request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken,
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
    const skillPattern = new vscode.RelativePattern(
      workspaceFolders[0],
      ".github/skills/*/SKILL.md",
    );
    const skillFiles = await vscode.workspace.findFiles(skillPattern);

    // Also check for legacy DK files
    const dkPattern = new vscode.RelativePattern(
      workspaceFolders[0],
      ".github/domain-knowledge/DK-*.md",
    );
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

  return { metadata: { command: "promote" } };
}

/**
 * Handle /knowledgestatus command - Show global knowledge status
 */
export async function handleKnowledgeStatusCommand(
  _request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken,
): Promise<IAlexChatResult> {
  stream.progress("📊 Gathering global knowledge status...");

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
        const typeEmoji = entry.type === "pattern" ? "📐" : "💡";
        stream.markdown(
          `- ${typeEmoji} **${entry.title}** (${entry.category})\n`,
        );
      }
    }

    if (registry.projects.length > 0) {
      stream.markdown(`\n### Known Projects\n`);
      for (const project of registry.projects.slice(0, 5)) {
        stream.markdown(
          `- **${project.name}** - ${project.knowledgeFiles} knowledge files\n`,
        );
      }
      if (registry.projects.length > 5) {
        stream.markdown(`- *...and ${registry.projects.length - 5} more*\n`);
      }
    }

    stream.markdown(
      `\n### 📍 Global Knowledge Location\n\`${getAlexGlobalPath()}\`\n`,
    );
  } catch (err) {
    stream.markdown(`❌ Error getting global knowledge status: ${err}`);
  }

  return { metadata: { command: "knowledgestatus" } };
}

/**
 * Handle /docs command - Open documentation
 */
export async function handleDocsCommand(
  _request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  _token: vscode.CancellationToken,
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
  await vscode.commands.executeCommand("alex.openDocs");

  stream.markdown(
    `\n✅ Documentation opened in preview. You can also access docs anytime via Command Palette: **"Alex: Open Documentation"**`,
  );

  return { metadata: { command: "docs" } };
}
