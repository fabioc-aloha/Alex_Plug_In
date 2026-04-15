---
description: "Portable memory export for porting Alex context to other AI work surfaces"
application: "When managing cognitive memory or porting context to other surfaces"
---

# Memory Export Instructions

## Core Rules

1. **Collect all sources**: User profile, user memory files, session memory, repository memories, Copilot Memory cognitive tools — check every layer
2. **Verbatim preservation**: For instructions and preferences the user set, use their exact words. Do not rephrase, summarize, or "clean up" their language
3. **Date everything**: Every entry gets a date prefix. Use `[unknown]` when undated
4. **Deduplicate across sources**: Same fact in user-profile.json and repository memories → emit once with best date
5. **Security**: Never include secrets, tokens, passwords, or API keys in the export
6. **Size target**: Keep under 10KB — this is context for an LLM, not a data dump
7. **Completeness statement**: Always end with whether this is the complete set or if sources were inaccessible

## Section Order

Instructions → Identity → Career → Projects → Preferences → Architecture Context

## Portability

Strip Alex-specific concepts (synapses, trifectas, muscles, hooks) from the export body. The goal is a document any AI can consume to know who the user is and how they want to work.
