# Chat Participant Patterns Instructions

**Auto-loaded when**: Writing VS Code extension code that uses Chat API, registers a chat participant, or routes requests to an LLM
**Domain**: VS Code extension development, AI extensibility, Chat API
**Synapses**: [chat-participant-patterns/SKILL.md](../skills/chat-participant-patterns/SKILL.md)

---

## Purpose

Guide correct use of the VS Code Chat API—choosing between Chat Participants, LM Tools, Agent Skills, and MCP Servers; structuring participant handlers; and integrating language model calls with proper error handling.

---

## When This Applies

**File Patterns**:
- `**/src/**/*.ts` — Extension TypeScript using `vscode.chat` or `vscode.lm` APIs
- `**/package.json` — Extension manifest declaring `chatParticipants` or `languageModelTools`

**Contextual Triggers**:
- Implementing a `@participant` command
- Registering an LM tool via `vscode.lm.registerTool`
- Structuring agent skill SKILL.md files
- Deciding between Chat Participant vs. LM Tool vs. MCP Server
- Handling `vscode.ChatResultFeedback` or streaming responses

---

## Architecture Decision: Which Approach?

**Use this table before writing any Chat API code:**

| Need | Approach | VS Code API |
| ---- | --------- | ----------- |
| Domain-specific `@mention`, full prompt control | **Chat Participant** | `vscode.chat.createChatParticipant` |
| Callable capability in agent sessions (no @mention required) | **LM Tool** | `vscode.lm.registerTool` |
| Domain knowledge embedded in any agent session (zero code) | **Agent Skill** (SKILL.md) | `chat.useAgentSkills` |
| Cross-platform tool for any MCP client | **MCP Server** | MCP SDK |

→ Prefer Agent Skills for domain knowledge (no maintenance overhead).
→ Reserve Chat Participants for cases requiring full prompt orchestration.

---

## Participant Handler Protocol

### Required Structure

```typescript
const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<vscode.ChatResult> => {
    // 1. Parse command/intent
    // 2. Build messages with history
    // 3. Invoke LLM with progress
    // 4. Stream response
    // 5. Return with metadata
};
```

### Message Building Pattern

Always include conversation history and system context:

```typescript
const messages = [
    vscode.LanguageModelChatMessage.User(systemPrompt),
    ...context.history.flatMap(turn => [
        vscode.LanguageModelChatMessage.User(turn.prompt),
        vscode.LanguageModelChatMessage.Assistant(turn.response)
    ]),
    vscode.LanguageModelChatMessage.User(request.prompt)
];
```

### Streaming with Cancellation

```typescript
const response = await model.sendRequest(messages, {}, token);
for await (const chunk of response.text) {
    if (token.isCancellationRequested) break;
    stream.markdown(chunk);
}
```

---

## Error Handling

Never let Chat Handler throw — always return a `ChatResult` with error metadata:

```typescript
try {
    // handler logic
    return { metadata: { command: request.command } };
} catch (err) {
    if (err instanceof vscode.LanguageModelError) {
        stream.markdown(`Model error: ${err.message}`);
        return { errorDetails: { message: err.message } };
    }
    // Unexpected error — rethrow for extension host diagnostics
    throw err;
}
```

**Distinguish error types**:
- `vscode.LanguageModelError.NotFound` → model unavailable (offer fallback)
- `vscode.LanguageModelError.Blocked` → content filtered (inform user gracefully)
- `vscode.LanguageModelError.NoPermissions` → user hasn't granted permission

---

## Follow-Up Providers

Provide context-aware suggestions after each response:

```typescript
participant.followupProvider = {
    provideFollowups(result, context, token) {
        if (result.metadata?.command === 'explain') {
            return [
                { prompt: '/refactor Apply the suggested changes', label: 'Refactor' },
                { prompt: '/test Generate tests for this code', label: 'Generate Tests' }
            ];
        }
        return [];
    }
};
```

---

## LM Tool Registration

```typescript
const tool = vscode.lm.registerTool<{ query: string }>('my-ext.search', {
    async invoke(options, token) {
        const result = await performSearch(options.input.query);
        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(JSON.stringify(result))
        ]);
    }
});
context.subscriptions.push(tool);
```

Declare in `package.json`:
```json
"languageModelTools": [{
    "name": "my-ext.search",
    "displayName": "Search",
    "description": "Search the workspace for relevant content",
    "parametersSchema": {
        "type": "object",
        "properties": { "query": { "type": "string" } },
        "required": ["query"]
    }
}]
```

---

## Quality Checklist

Before shipping Chat API code:
- [ ] Handler never throws uncaught exceptions
- [ ] Cancellation token checked in streaming loops
- [ ] Conversation history included in messages
- [ ] Follow-up provider registered for context continuity
- [ ] LM Tools declared in `package.json` and registered in `activate()`
- [ ] Error messages are user-friendly (no raw stack traces in `stream.markdown`)
- [ ] Appropriate approach chosen (Participant vs Tool vs Skill vs MCP)
