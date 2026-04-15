---
description: "Craft effective prompts that get the best results from language models"
application: "When writing prompts, designing system instructions, or optimizing LLM interactions"
applyTo: "**/*prompt*,**/*system-message*,**/*instruction*"
---

# Prompt Engineering Principles

## Structure

1. **Role**: Who is the model? (expert, tutor, analyst)
2. **Context**: Background needed for task
3. **Task**: Clear, specific instruction
4. **Format**: Expected output structure
5. **Constraints**: Boundaries (length, tone, what to avoid)

## Key Techniques

| Technique | When |
|-----------|------|
| **Few-shot** | Show examples of desired output |
| **Chain-of-thought** | Complex reasoning ("think step by step") |
| **Decomposition** | Break complex tasks into steps |
| **Role-play** | Persona for tone/expertise |

## Quality Signals

- Consistent outputs across runs
- Follows format reliably
- Handles edge cases
- Minimal hallucination

## Anti-Patterns

- Vague instructions ("make it better")
- Conflicting constraints
- No examples for complex formats
- Ignoring model capabilities/limits
