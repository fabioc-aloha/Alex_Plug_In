---
applyTo: "**/*participant*,**/*chat*,**/*copilot*,**/lm/**"
---

# Chat Participant Patterns Skill

> VS Code Chat API patterns.

## ⚠️ Staleness Warning

Chat APIs are proposed/experimental. **Last validated:** January 2026 (VS Code 1.96+)

**Check:** [Chat API](https://code.visualstudio.com/api/extension-guides/chat), [LM API](https://code.visualstudio.com/api/extension-guides/language-model)

---

## Create Participant

```typescript
vscode.chat.createChatParticipant('alex.chat', handler);
```

## Handler Signature

```typescript
async (request, context, response, token) => {
    response.markdown('Hello!');
}
```

## Key Operations

| Operation | Method |
| --------- | ------ |
| Stream text | `response.markdown()` |
| Show progress | `response.progress()` |
| Add button | `response.button()` |
| Access history | `context.history` |
| Get references | `request.references` |

## LM Integration

```typescript
const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
const response = await models[0].sendRequest(messages, {}, token);
for await (const chunk of response.text) {
    response.markdown(chunk);
}
```

## Tool Registration

```typescript
vscode.lm.registerTool('tool_name', {
    async invoke(options, token) {
        return new vscode.LanguageModelToolResult([...]);
    }
});
```

## Best Practices

| Do | Don't |
| -- | ----- |
| Stream responses | Block until complete |
| Handle cancellation | Ignore token |
| Catch errors | Let exceptions crash |

## Synapses

See [synapses.json](synapses.json) for connections.
