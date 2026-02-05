# Copilot Chat Action Buttons Pattern

**Discovery Date**: February 4, 2026  
**VS Code Version**: 1.109+  
**Category**: UX Enhancement

## Discovery

VS Code 1.109 Copilot Chat automatically renders certain markdown patterns as **clickable action buttons** that execute when clicked.

## Working Pattern

When a response includes emoji-prefixed action suggestions, VS Code renders them as buttons:

```markdown
🧠 Run Self-Actualization First
🌍 Global Knowledge Contribution
🌙 Run Dream Protocol After
☁️ Sync Global Knowledge
```

**Result**: Each line becomes a clickable button that sends the text as a new prompt.

## Recommended Format

For action suggestions in skills and prompts:

```markdown
## Next Steps
🎯 Start Learning Session
🧘 Meditate on Insights  
🔧 Run Dream Maintenance
📊 Check Architecture Health
```

## Design Guidelines

| Element | Recommendation |
|---------|---------------|
| Emoji | Use meaningful emoji prefix |
| Text | Action-oriented, 3-5 words |
| Grouping | Related actions together |
| Context | Place after completing a task |

## Anti-Patterns

- ❌ Long sentences (button text truncates)
- ❌ Questions (buttons should be actions)
- ❌ Generic text without emoji (may not render as button)

## Skills Using This Pattern

- `meditation/SKILL.md` - Post-meditation actions
- `self-actualization/SKILL.md` - Assessment follow-ups
- `global-knowledge/SKILL.md` - Sync and save actions

## Synapses

- [unified-meditation-protocols.prompt.md] (0.9, enhancement, bidirectional) - "action suggestions in meditation"
- [alex.agent.md] (0.8, integration, outgoing) - "agent command suggestions"
