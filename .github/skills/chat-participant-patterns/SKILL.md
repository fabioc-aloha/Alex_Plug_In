---
applyTo: "**/*participant*,**/*chat*,**/*copilot*,**/lm/**"
---

# Chat Participant Patterns Skill

> VS Code Chat API patterns for building conversational AI experiences.

## ⚠️ Staleness Warning

VS Code Chat APIs are proposed/experimental and change frequently.

**Refresh triggers:**

- VS Code monthly releases
- Chat API graduating from proposed
- New language model APIs
- Tool calling API changes

**Last validated:** January 2026 (VS Code 1.96+)

**Check current state:** [Chat Extensions API](https://code.visualstudio.com/api/extension-guides/chat), [Language Model API](https://code.visualstudio.com/api/extension-guides/language-model)

---

## Chat Participant Basics

```typescript
const participant = vscode.chat.createChatParticipant(
    'alex.chat',
    async (request, context, response, token) => {
        // Handle the chat request
        response.markdown('Hello from Alex!');
    }
);

participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'icon.png');
```

## Streaming Responses

```typescript
async function handleRequest(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    response: vscode.ChatResponseStream,
    token: vscode.CancellationToken
) {
    // Stream markdown incrementally
    response.markdown('Processing...\n\n');

    const result = await longRunningOperation();

    response.markdown(`Result: ${result}`);
}
```

## Language Model Integration

```typescript
// Select a model
const models = await vscode.lm.selectChatModels({
    vendor: 'copilot',
    family: 'gpt-4'
});

if (models.length === 0) {
    response.markdown('No language model available');
    return;
}

const model = models[0];

// Send messages
const messages = [
    vscode.LanguageModelChatMessage.User('Explain this code'),
    vscode.LanguageModelChatMessage.User(codeSnippet)
];

const chatResponse = await model.sendRequest(messages, {}, token);

// Stream the response
for await (const chunk of chatResponse.text) {
    response.markdown(chunk);
}
```

## Tool Calling (LM Tools)

```typescript
// Register a tool
const tool = vscode.lm.registerTool('alex_search', {
    async invoke(options, token) {
        const query = options.input.query;
        const results = await searchWorkspace(query);
        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(JSON.stringify(results))
        ]);
    }
});

// Tool schema
tool.description = 'Search the workspace for code';
tool.inputSchema = {
    type: 'object',
    properties: {
        query: { type: 'string', description: 'Search query' }
    },
    required: ['query']
};
```

## Chat Context

```typescript
async function handleRequest(request, context, response, token) {
    // Access conversation history
    const history = context.history;

    for (const turn of history) {
        if (turn instanceof vscode.ChatRequestTurn) {
            console.log('User said:', turn.prompt);
        } else if (turn instanceof vscode.ChatResponseTurn) {
            console.log('Alex said:', turn.response);
        }
    }

    // Access referenced files
    const references = request.references;
    for (const ref of references) {
        if (ref.value instanceof vscode.Uri) {
            const content = await vscode.workspace.fs.readFile(ref.value);
        }
    }
}
```

## Commands from Chat

```typescript
// Participant can suggest commands
response.button({
    command: 'alex.openDashboard',
    title: 'Open Dashboard'
});

// Or run them directly
await vscode.commands.executeCommand('alex.meditate');
```

## Progress Indication

```typescript
response.progress('Analyzing codebase...');
await analyzeCode();

response.progress('Generating suggestions...');
const suggestions = await generateSuggestions();

response.markdown('## Suggestions\n' + suggestions);
```

## Error Handling

```typescript
try {
    const result = await riskyOperation();
    response.markdown(result);
} catch (error) {
    // Don't crash - show friendly error
    response.markdown(`⚠️ Something went wrong: ${error.message}`);

    // Log for debugging
    console.error('Chat error:', error);
}
```

## Slash Commands

```typescript
participant.commandProvider = {
    provideCommands(token) {
        return [
            { name: 'meditate', description: 'Start meditation session' },
            { name: 'status', description: 'Show architecture status' },
            { name: 'dream', description: 'Run neural maintenance' }
        ];
    }
};

// Handle in main handler
if (request.command === 'meditate') {
    return handleMeditate(request, context, response, token);
}
```

## Followup Provider

```typescript
participant.followupProvider = {
    provideFollowups(result, context, token) {
        return [
            {
                prompt: 'Tell me more about this',
                label: 'More details'
            },
            {
                prompt: 'Show me an example',
                label: 'Example'
            }
        ];
    }
};
```

## Best Practices

| Do | Don't |
| -- | ----- |
| Stream long responses | Block until complete |
| Handle cancellation | Ignore token |
| Provide progress | Leave user waiting |
| Catch errors gracefully | Let exceptions crash |
| Use followups | Dead-end conversations |

## Synapses

See [synapses.json](synapses.json) for connections.
