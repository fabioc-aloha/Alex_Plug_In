````instructions
# Copilot Chat Action Buttons Pattern

**Discovery Date**: February 4, 2026  
**VS Code Version**: 1.109+  
**Category**: UX Enhancement

## Official VS Code APIs

There are **two official ways** to create clickable buttons in chat:

### 1. Command Buttons (Inline)

Use `stream.button()` to add clickable buttons inline with the response:

```typescript
stream.button({
    command: 'alex.startSession',
    title: '🎯 Start a Session',
    arguments: []
});
```

**When to use**: After completing a task, to offer the next logical action.

### 2. Follow-up Provider (After Response)

Register a `ChatFollowupProvider` that returns suggested prompts:

```typescript
alex.followupProvider = {
    provideFollowups(result, context, token) {
        return [
            { prompt: '/meditate', label: '🧘 Meditate on insights' },
            { prompt: 'What should I focus on next?', label: '🎯 Next steps' }
        ];
    }
};
```

**When to use**: Suggest follow-up questions or commands after ANY response.

## ⚠️ Markdown Emoji Pattern (Unreliable)

The emoji-prefixed markdown pattern:

```markdown
🧠 Run Self-Actualization First
🌍 Global Knowledge Contribution
```

This is **NOT an official API** and may render inconsistently. Use `stream.button()` or `ChatFollowupProvider` for guaranteed clickable actions.

## Best Practices for Consistent Buttons

### In TypeScript Code

1. **End responses with stream.button()** for primary actions:
```typescript
stream.markdown('Task completed successfully!\n\n');
stream.button({ command: 'alex.nextStep', title: '➡️ Next Step' });
```

2. **Return metadata** so followupProvider knows context:
```typescript
return { metadata: { command: 'learn', topic: 'typescript' } };
```

3. **Context-aware followups** based on result metadata:
```typescript
if (result.metadata.command === 'learn') {
    return [{ prompt: 'Quiz me on this topic', label: '📝 Quiz' }];
}
```

### In Skills/Prompts (Markdown)

When writing skills or prompts, **instruct Alex to use stream.button()**:

```markdown
## Response Format

After completing this task, call:
- `stream.button({ command: 'alex.meditate', title: '🧘 Meditate' })`
- `stream.button({ command: 'alex.dream', title: '🌙 Dream' })`
```

## Synapses

- [platforms/vscode-extension/src/chat/participant.ts] (1.0, implementation, bidirectional) - "stream.button() and followupProvider implementation"
- [.github/prompts/unified-meditation-protocols.prompt.md] (0.9, enhancement, outgoing) - "action suggestions in meditation"

````
