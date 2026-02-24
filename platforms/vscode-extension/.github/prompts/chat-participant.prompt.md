---
description: Scaffold a production-ready VS Code Chat Participant with streaming, error handling, and follow-up provider support
---

# Implement Chat Participant

> **Avatar**: Call `alex_cognitive_state_update` with `state: "building"`. This updates the welcome sidebar avatar.

**Purpose**: Scaffold a complete, production-ready VS Code Chat Participant with proper error handling, streaming, and follow-up support
**Domain**: VS Code extension development, AI extensibility

---

## Workflow

This prompt guides you through creating a VS Code Chat Participant in 5 steps:

1. **Architecture Decision** — confirm the right approach (participant vs tool vs skill vs MCP)
2. **Participant Registration** — `package.json` manifest declaration
3. **Handler Implementation** — streaming, cancellation, history
4. **Error Handling** — `LanguageModelError` variants, graceful degradation
5. **Follow-up Provider** — context-aware next steps

---

## Step 1: Architecture Decision

Before writing code, confirm with the user:

- Does this need a user-invokable `@mention`? → Chat Participant
- Is this a reusable domain capability for agent sessions? → LM Tool
- Is this domain knowledge with no runtime logic? → Agent Skill SKILL.md
- Does this need to work outside VS Code? → MCP Server

If Chat Participant is confirmed, proceed to Step 2.

---

## Step 2: Package.json Declaration

Generate the `chatParticipants` contribution point:

```json
"contributes": {
    "chatParticipants": [{
        "id": "{extensionId}.{participantName}",
        "name": "{participantName}",
        "fullName": "{Display Name}",
        "description": "{One-sentence description of what this participant does}",
        "isSticky": true,
        "commands": [
            { "name": "help", "description": "Get usage help" },
            { "name": "explain", "description": "Explain the selected code or topic" }
        ]
    }]
}
```

Fill in: extension ID suffix, participant name (lowercase, no spaces), display name, description, commands relevant to the domain.

---

## Step 3: Handler Implementation

Scaffold the handler in `src/participant.ts`:

```typescript
import * as vscode from 'vscode';

const SYSTEM_PROMPT = `You are {participantName}, a VS Code Copilot Chat participant.
{Domain-specific persona and capabilities}
Always be concise and provide actionable responses.`;

export function createParticipantHandler(context: vscode.ExtensionContext): vscode.ChatRequestHandler {
    return async (
        request: vscode.ChatRequest,
        chatContext: vscode.ChatContext,
        stream: vscode.ChatResponseStream,
        token: vscode.CancellationToken
    ): Promise<vscode.ChatResult> => {
        try {
            const model = await selectModel(request);
            const messages = buildMessages(chatContext, request.prompt);

            const response = await model.sendRequest(messages, {}, token);
            for await (const chunk of response.text) {
                if (token.isCancellationRequested) break;
                stream.markdown(chunk);
            }

            return { metadata: { command: request.command } };
        } catch (err) {
            return handleChatError(err, stream);
        }
    };
}

function buildMessages(context: vscode.ChatContext, userPrompt: string) {
    return [
        vscode.LanguageModelChatMessage.User(SYSTEM_PROMPT),
        ...context.history.flatMap(turn => {
            const messages = [];
            if (turn instanceof vscode.ChatRequestTurn) {
                messages.push(vscode.LanguageModelChatMessage.User(turn.prompt));
            } else if (turn instanceof vscode.ChatResponseTurn) {
                const text = turn.response
                    .filter(p => p instanceof vscode.ChatResponseMarkdownPart)
                    .map(p => (p as vscode.ChatResponseMarkdownPart).value.value)
                    .join('');
                messages.push(vscode.LanguageModelChatMessage.Assistant(text));
            }
            return messages;
        }),
        vscode.LanguageModelChatMessage.User(userPrompt)
    ];
}

async function selectModel(request: vscode.ChatRequest): Promise<vscode.LanguageModelChat> {
    const [model] = await vscode.lm.selectChatModels({
        vendor: 'copilot',
        family: request.model.family
    });
    if (!model) throw new Error('No language model available');
    return model;
}

function handleChatError(err: unknown, stream: vscode.ChatResponseStream): vscode.ChatResult {
    if (err instanceof vscode.LanguageModelError) {
        if (err.code === vscode.LanguageModelError.NotFound.name) {
            stream.markdown('The selected language model is not available. Please try a different model.');
        } else if (err.code === vscode.LanguageModelError.Blocked.name) {
            stream.markdown('This request was filtered. Please rephrase your question.');
        } else {
            stream.markdown(`Model error: ${err.message}`);
        }
        return { errorDetails: { message: err.message } };
    }
    throw err; // Unexpected errors bubble up for diagnostics
}
```

---

## Step 4: Registration in activate()

```typescript
export function activate(context: vscode.ExtensionContext) {
    const participant = vscode.chat.createChatParticipant(
        '{extensionId}.{participantName}',
        createParticipantHandler(context)
    );
    participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'icon.png');

    participant.followupProvider = {
        provideFollowups(result, ctx, token) {
            return [
                { prompt: '/help What can you help me with?', label: 'Help' }
            ];
        }
    };

    context.subscriptions.push(participant);
}
```

---

## Step 5: Validation Checklist

After implementing, verify:
- [ ] Handler returns `ChatResult`, never throws
- [ ] Cancellation token checked in streaming loop
- [ ] All history turns included in messages
- [ ] Follow-up provider registered
- [ ] `chatParticipants` declared in `package.json`
- [ ] Icon asset present at the declared path
- [ ] Error messages are user-readable (no stack traces in markdown)

---

## Sample

User: "/chatParticipant"

Alex:
1. Asks: Do you need an `@mention` participant, or would an LM Tool or Agent Skill be more appropriate?
2. [After confirmation: Chat Participant]
3. Shows `package.json` contribution snippet
4. Scaffolds `src/participant.ts` with handler, message builder, error handler
5. Shows `activate()` registration code
6. Runs through validation checklist

**Cross-reference**: `.github/instructions/chat-participant-patterns.instructions.md`


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.
