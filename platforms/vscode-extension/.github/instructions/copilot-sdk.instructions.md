---
description: "VS Code Copilot SDK patterns for building AI-powered extensions"
application: "When building extensions that use VS Code's Copilot APIs"
applyTo: "**/*copilot-sdk*,**/*language-model*,**/*chat-request*"
---

# Copilot SDK Patterns

## Language Model API

```typescript
// Request chat model
const model = await lm.selectChatModels({ family: 'gpt-4' })?.[0];
const messages = [
  LanguageModelChatMessage.User('Explain this code'),
];
const response = await model.sendRequest(messages, {}, token);

// Stream response
for await (const fragment of response.text) {
  stream.markdown(fragment);
}
```

## Tool Integration

```typescript
// Define tool
const tool = lm.registerTool('search', {
  inputSchema: { query: { type: 'string' } },
  async invoke(input) {
    return searchResults(input.query);
  }
});
```

## Error Handling

| Error | Handling |
|-------|----------|
| Rate limited | Backoff and retry |
| Model unavailable | Fallback or user message |
| Token exhausted | Truncate context |
| Cancelled | Check token.isCancellationRequested |

## Anti-Patterns

- Not streaming responses
- Ignoring cancellation tokens
- Hardcoding model names
- No fallback when model unavailable
