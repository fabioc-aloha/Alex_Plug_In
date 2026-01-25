# Alex for VS Code: How We Built an AI Assistant That Actually Remembers Your Code

**Fabio Correa**
*For Visual Studio Magazine / The New Stack*

---

Every developer who's used GitHub Copilot has had this experience: you spend 20 minutes explaining your project's architecture, get great help solving a problem, then come back the next day and... it's forgotten everything. You're back to square one.

After experiencing this frustration one too many times, I built Alex—a VS Code extension that gives Copilot a memory. Here's the technical story of how it works.

---

## The Problem: Copilot Has No Long-Term Memory

GitHub Copilot Chat is remarkably capable. It can explain complex code, suggest implementations, debug tricky issues. But it operates in what I call "amnesia mode"—every conversation starts fresh, with no knowledge of previous interactions.

This creates real friction:

- **Context re-establishment**: Spending minutes re-explaining your project every session
- **Lost insights**: That clever debugging technique you figured out yesterday? Gone.
- **No personalization**: Copilot doesn't learn that you prefer TypeScript, hate tabs, or want terse explanations

---

## The Solution: A Memory Layer for AI

Alex adds persistent memory to GitHub Copilot through VS Code's extension APIs. The architecture is straightforward:

```
┌──────────────────────────────────────────────────┐
│                 Alex Extension                    │
├──────────────────────────────────────────────────┤
│  Chat Participant (@alex)                        │
│  Language Model Tools (alex_memory_search, etc.) │
├──────────────────────────────────────────────────┤
│  Memory Management Layer                         │
│  - File loader    - Semantic search             │
│  - Cloud sync     - Health checker               │
├──────────────────────────────────────────────────┤
│  File System (Human-readable markdown)           │
│  .github/instructions/  .github/prompts/         │
│  ~/.alex/global-knowledge/                       │
└──────────────────────────────────────────────────┘
```

**Figure 1:** *Alex extension architecture showing layered design with memory management*

---

## Key Technical Decisions

### 1. Markdown Files, Not a Database

Early versions used SQLite for memory storage. It worked, but debugging was painful—you couldn't easily see what the AI "knew" about your project.

We switched to plain markdown files:

```markdown
# release-management.instructions.md

## When to Use
- User mentions "release", "deploy", "ship"

## Steps
1. Run tests: `npm test`
2. Update version: `npm version patch`
3. Build: `npm run build`
4. Publish: `vsce publish`

## Connections
- [dependency-management.instructions.md] → Check deps first
```

**Figure 2:** *Example procedural memory file with trigger conditions and synaptic connections*

Benefits:
- **Debuggable**: Just open the file to see what Alex knows
- **Editable**: Fix mistakes by editing markdown
- **Versionable**: Memory changes show up in git diffs
- **Trustworthy**: Users can verify what's stored about them

### 2. Chat Participant API

VS Code's Chat Participant API lets us register `@alex` as a chat participant:

```typescript
const participant = vscode.chat.createChatParticipant(
  'alex-cognitive-architecture.alex',
  async (request, context, stream, token) => {
    // Load relevant memories based on user's question
    const memories = await loadRelevantMemories(request.prompt);

    // Build system prompt with memory context
    const systemPrompt = buildSystemPromptWithMemories(memories);

    // Get response from language model
    const messages = [
      vscode.LanguageModelChatMessage.User(systemPrompt),
      vscode.LanguageModelChatMessage.User(request.prompt)
    ];

    const response = await request.model.sendRequest(messages, {}, token);

    // Stream the response
    for await (const chunk of response.text) {
      stream.markdown(chunk);
    }
  }
);
```

**Figure 3:** *Chat participant registration with memory-augmented response generation*

Users type `@alex how do I release this project?` and get a response informed by their project-specific release process.

### 3. Language Model Tools

The Language Model Tools API exposes memory capabilities to the AI itself:

```typescript
vscode.lm.registerTool('alex_memory_search', {
  description: 'Search Alex memory for relevant knowledge',
  parametersSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      memoryType: {
        type: 'string',
        enum: ['procedural', 'episodic', 'domain', 'all']
      }
    }
  },
  async invoke(params) {
    const results = await searchMemories(params.query, params.memoryType);
    return JSON.stringify(results);
  }
});
```

**Figure 4:** *Language Model Tool registration exposing memory search to Copilot*

Now Copilot can search Alex's memory proactively—if it's asked about authentication and doesn't know the answer, it can search memories for relevant context.

### 4. Global Knowledge with Cloud Sync

Project-specific memory is great, but some knowledge transfers across projects. React patterns. TypeScript idioms. Debugging strategies.

Alex maintains a global knowledge base in the user's home directory:

```
~/.alex/
├── global-knowledge/
│   ├── patterns/
│   │   └── GK-react-hooks-cleanup.md
│   ├── insights/
│   │   └── GI-typescript-strict-mode-2026-01-24.md
│   └── index.json
└── project-registry.json
```

**Figure 5:** *Global knowledge directory structure with patterns and insights folders*

Cloud sync uses GitHub Gist:

```typescript
async function syncWithCloud() {
  const session = await vscode.authentication.getSession('github', ['gist']);

  const localIndex = await loadLocalIndex();
  const cloudIndex = await fetchFromGist(localIndex.gistId);

  // Three-way merge: newer timestamp wins
  const merged = mergeKnowledge(localIndex, cloudIndex);

  await writeLocalIndex(merged);
  await updateGist(merged);
}
```

**Figure 6:** *Cloud synchronization with GitHub Gist using timestamp-based merge strategy*

Start using Alex on your laptop, continue on your desktop—your AI remembers you on both.

---

## The "Dream State" Feature

Here's a fun one: Alex has a "dream" command that performs self-maintenance.

```typescript
async function dream(): Promise<HealthReport> {
  const report: HealthReport = {
    synapsesValidated: 0,
    brokenLinksFound: 0,
    repairsAttempted: 0,
    timestamp: new Date().toISOString()
  };

  // Scan all memory files
  const memories = await loadAllMemories();

  for (const memory of memories) {
    // Check each synapse (connection to other files)
    for (const synapse of memory.synapses) {
      report.synapsesValidated++;

      if (!await fileExists(synapse.target)) {
        report.brokenLinksFound++;
        // Attempt repair or flag for user attention
      }
    }
  }

  // Generate health report
  await saveHealthReport(report);

  return report;
}
```

**Figure 7:** *Dream state implementation performing synaptic validation and health reporting*

The metaphor comes from cognitive science: just like human brains consolidate memories during sleep, Alex consolidates and validates knowledge during "dreams."

---

## Lessons Learned

### What Worked

**Human-readable files**: Can't overstate how valuable this is for debugging. When users report issues, we can just ask them to share the memory file.

**Graceful degradation**: If memory loading fails, Alex falls back to stateless Copilot behavior. Users never lose core functionality.

**Explicit triggers**: Procedural memories include trigger conditions (`User mentions "release"`). This enables automatic context loading without user prompting.

### What Didn't Work

**Automatic memory capture**: Early versions tried to save insights from every conversation. Result: lots of low-quality, redundant memories. Explicit consolidation ("meditation") produces better results.

**Complex memory formats**: We tried JSON schemas, YAML frontmatter, custom DSLs. Plain markdown with conventions won.

**Aggressive cloud sync**: Syncing every change caused conflicts. Periodic sync (every 5 minutes) with newer-wins merge works better.

---

## Try It Yourself

Alex is available on the VS Code Marketplace: [Alex Cognitive Architecture](https://marketplace.visualstudio.com/items?itemName=CorrreaX.alex-cognitive-architecture)

The code is open source (Apache 2.0): [github.com/fabioc-aloha/Alex_Plug_In](https://github.com/fabioc-aloha/Alex_Plug_In)

Key commands to try:
- `@alex` - Chat with memory context
- `Alex: Initialize Architecture` - Set up memory files in your project
- `Alex: Dream (Neural Maintenance)` - Run health checks
- `/meditate` - Consolidate session learnings

---

## What's Next

Current priorities:

1. **Forgetting mechanisms**: Memory only grows; we need principled deprecation
2. **Team memory sharing**: How can teams share AI knowledge while preserving individual privacy?
3. **Better insight detection**: Current pattern matching is basic; exploring more sophisticated approaches

The bigger vision: AI assistants that genuinely learn over time, accumulating expertise alongside their users rather than starting fresh every conversation.

---

*Fabio Correa is the creator of Alex Cognitive Architecture. Find him on GitHub: @fabioc-aloha*

---

*Word count: ~1,300 (within trade publication guidelines)*
