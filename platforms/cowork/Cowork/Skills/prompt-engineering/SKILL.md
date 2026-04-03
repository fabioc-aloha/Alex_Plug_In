---
name: Prompt Engineering
description: Craft effective prompts that get the best results from AI assistants including Copilot itself.
---

## Purpose

Write better prompts to get better results. The quality of AI output depends directly on input quality. This skill teaches how to structure requests so that AI assistants produce accurate, relevant, and useful responses on the first attempt.

## Steps

1. Define the goal: what do you want the output to look like?
2. Apply the CRAFT framework to structure your prompt
3. Add constraints and examples
4. Review the output and refine the prompt if needed

## CRAFT Framework

| Element     | Description                         | Example                                                               |
| ----------- | ----------------------------------- | --------------------------------------------------------------------- |
| **C**ontext | Background information the AI needs | "I'm a project manager writing a status report for senior leadership" |
| **R**ole    | Who the AI should act as            | "Act as a financial analyst"                                          |
| **A**ction  | What specifically to do             | "Summarize the key risks from this document"                          |
| **F**ormat  | How to structure the output         | "Use a table with columns: Risk, Likelihood, Impact, Mitigation"      |
| **T**one    | Voice and style                     | "Professional but concise, suitable for C-suite audience"             |

## Prompt Patterns

### Pattern 1: Template fill

"Create a [document type] for [audience] that covers [topics]. Format as [structure]. Keep it [length/tone]."

Example: "Create a project status update for the steering committee that covers timeline, budget, and risks. Format as a one-page summary with RAG ratings. Keep it concise and action-oriented."

### Pattern 2: Example-based

"Here is an example of what I want: [paste example]. Now create a similar one for [new context]."

### Pattern 3: Step-by-step

"Walk me through [process] step by step. For each step, explain what to do and what to watch out for."

### Pattern 4: Critique and improve

"Here is my draft: [paste text]. Identify three weaknesses and rewrite to fix them."

### Pattern 5: Multi-perspective

"Analyze [topic] from three perspectives: [role 1], [role 2], [role 3]. For each, list top 3 concerns."

## What Makes Prompts Fail

| Problem              | Cause                                      | Fix                                                          |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| Too vague            | "Write something about our project"        | Specify: what document, for whom, covering what              |
| Too broad            | "Tell me everything about risk management" | Narrow: "List the top 5 risks for a cloud migration project" |
| No format specified  | AI chooses its own structure               | State: "as a table" or "as bullet points" or "max 200 words" |
| Missing context      | AI fills gaps with assumptions             | Provide: audience, purpose, constraints                      |
| One-shot expectation | Expecting perfection on first try          | Iterate: prompt, review, refine                              |

## Advanced Techniques

| Technique             | When to Use                | How                                                           |
| --------------------- | -------------------------- | ------------------------------------------------------------- |
| Chain of thought      | Complex analysis           | "Think through this step by step before giving your answer"   |
| Constraints           | Controlling scope          | "In under 200 words" / "Using only data from Q3"              |
| Negative instructions | Preventing unwanted output | "Do not include generic advice. Only cite specific data."     |
| Output seeding        | Controlling structure      | Start the output yourself: "The three key findings are: 1."   |
| Persona stacking      | Multiple viewpoints        | "First as a CFO, then as a customer. Compare their concerns." |

## Output Format

- Well-structured prompt ready to use
- Expected output description for validation

## Guidelines

- Be specific about what you want and how you want it formatted
- Provide examples when possible: one good example beats a paragraph of instructions
- If the first result is not right, refine the prompt rather than starting over
- Break complex requests into smaller prompts: one task per prompt works better than asking for everything at once
- State what you do NOT want as clearly as what you do want
