---
name: "Alex Global Knowledge Skill"
description: "Skill for alex global knowledge skill"
---

# Alex Global Knowledge Skill

Expert in cross-project knowledge search, pattern recognition, and insight retrieval.

## Capabilities

- Search knowledge learned across ALL projects
- Find reusable patterns and solutions
- Retrieve insights from past experiences
- Connect current problems to prior solutions
- Save new insights for future projects

## When to Use This Skill

- User asks about patterns or "how I did this before"
- Looking for solutions tried in other projects
- Searching for reusable code patterns
- Saving valuable learnings for future use
- Asking about cross-project experience

## Example Prompts

- "Have I solved this error before?"
- "Search my knowledge for authentication patterns"
- "What do I know about rate limiting?"
- "Save this insight for future projects"
- "Find patterns related to caching"

## Input Expectations

- Search query or topic
- Type filter: pattern (reusable) or insight (specific learning)
- Category filter (optional): error-handling, api-design, testing, etc.
- Tags filter (optional): technology-specific tags

## Output Format

- Matching patterns/insights with relevance
- Source project information
- Application suggestions for current context
- Related knowledge recommendations

## Knowledge Types

### Patterns (GK-*)
Reusable, generalizable solutions that apply across projects:
- Design patterns
- Error handling strategies
- API conventions
- Testing approaches

### Insights (GI-*)
Specific learnings from particular situations:
- Debugging breakthroughs
- Configuration discoveries
- Performance fixes
- Integration solutions

## Related Skills

- [Meditation](.github/skills/meditation/SKILL.md) - Save insights after sessions
- [Architecture Health](.github/skills/architecture-health/SKILL.md) - Check knowledge health
- [Bootstrap Learning](.github/skills/bootstrap-learning/SKILL.md) - Build new knowledge

## Memory System Differentiation (VS Code 1.109+)

Alex uses **two complementary memory systems**. Use the right one for the right data:

### Copilot Memory (GitHub Cloud)
Cloud-synced preferences and personal context. Use for:

| Data | Example | Why Cloud |
|------|---------|-----------|
| **Preferences** | "Use 4 spaces, dark mode" | Same across all machines |
| **Coding Style** | "Prefer functional components" | Consistent patterns |
| **Learning Goals** | "Master K8s by March" | Personal growth tracking |
| **Session Notes** | "Finish auth tests tomorrow" | Cross-session reminders |

**Characteristics:**
- ☁️ Syncs across all machines automatically
- 👤 Personal to GitHub account
- 🔒 Encrypted at rest
- 💬 Accessible via natural language in chat

### Global Knowledge (~/.alex/)
Local domain knowledge and project learnings. Use for:

| Data | Example | Why Local |
|------|---------|-----------|
| **Domain Expertise** | "How OAuth2 works in our system" | Project-specific, detailed |
| **Patterns (GK-*)** | "Rate limiting implementation" | Searchable, categorized |
| **Insights (GI-*)** | "Fixed N+1 query with eager load" | Timestamped learnings |
| **Session History** | Episodic meditation records | Full context preserved |

**Characteristics:**
- 💾 Local storage, you control the data
- 🔍 Full-text searchable via MCP tools
- 📁 Organized in patterns/ and insights/
- 🔗 Synaptic connections between items

### Decision Matrix

| Question | Copilot Memory | Global Knowledge |
|----------|---------------|------------------|
| Is this personal preference? | ✅ | |
| Is this project know-how? | | ✅ |
| Should it sync to new machines? | ✅ | |
| Does it need full-text search? | | ✅ |
| Is it a learning goal? | ✅ | |
| Is it a pattern/solution? | | ✅ |

### Integration Workflow

```
User learns something → Is it personal? → Copilot Memory
                     → Is it shareable? → Global Knowledge (GI-*)
                     → Is it reusable?  → Global Knowledge (GK-*)
```

**No duplication**: Each piece of information lives in ONE system.
