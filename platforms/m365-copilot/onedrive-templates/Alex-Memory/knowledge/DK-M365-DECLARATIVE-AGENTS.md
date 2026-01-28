# Domain Knowledge: M365 Declarative Agents

## Overview
Declarative agents are M365 Copilot extensions defined by manifest files rather than code.

## Key Learnings

### Schema Versions (as of 2026-01)
| Schema | Working Version | Notes |
|--------|-----------------|-------|
| Declarative Agent | v1.3 | More compatible with Developer Portal |
| App Manifest | v1.19 | Simpler, works with copilotAgents |

### Critical Requirements
1. **Application (client) ID** - Must be set in Developer Portal or agent spins forever
2. **Transparent outline icon** - Alpha=0 background required
3. **No template variables** - Replace all template vars with actual values

## Patterns
- Inline instructions work better than file references
- Conversation starters improve discoverability
- M365 Graph provides free user context (name, title, files)

---
*Created: 2026-01-28 | Source: v4.0.0 QUADRUNIUM deployment*
