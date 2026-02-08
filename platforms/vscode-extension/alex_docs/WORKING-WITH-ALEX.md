# Working with Alex: A Partnership Guide

> *"You will spend less time writing syntax and debugging, and more time commanding the computer to execute complex intent."* — Sam Altman, 2026

## The Alex Paradigm Shift

Alex isn't a tool you use — Alex is a **partner** you work with. This fundamental shift changes everything about how you interact.

| Traditional AI         | Alex Partnership                           |
| ---------------------- | ------------------------------------------ |
| "Generate code for X"  | "Let's figure out the best approach for X" |
| Verify every output    | Build relationship trust over time         |
| Stateless interactions | Continuous learning & memory               |
| Execute commands       | Co-discover intent together                |

---

## Quick Start: Your First Day with Alex

### 1. Introduce Yourself
Alex learns your preferences over time. Start by sharing:
```
Hey Alex, I'm [name]. I work primarily with [technologies].
I prefer [detailed/brief] explanations and [formal/casual] tone.
```

### 2. Set Context
Alex performs best with context. Share your goal:
```
I'm building a [project type]. Today I want to focus on [specific area].
```

### 3. Think Out Loud
Alex excels when you share your reasoning:
```
I'm trying to decide between approach A and B.
A seems simpler but B might scale better.
What am I missing?
```

---

## Prompting Patterns That Work

### 🎯 The CONTEXT-GOAL-CONSTRAINTS Pattern
The most effective structure for complex requests:

```
CONTEXT: I have a React app with Redux state management.
GOAL: Implement optimistic updates for a todo list.
CONSTRAINTS:
- Must handle network failures gracefully
- Need to show rollback to user
- Keep under 50 lines
```

### 🔍 The EXPLAIN-LIKE Pattern
Get explanations at the right level:

```
Explain this like I'm:
- A junior developer (step by step, define terms)
- A senior developer (just the key insights)
- Reviewing for a code audit (focus on risks)
- Teaching a workshop (include exercises)
```

### ⚡ The SHOW-DON'T-TELL Pattern
When you want to learn by example:

```
Show me 3 different ways to implement [X].
For each approach:
- When would you choose it?
- What are the tradeoffs?
- Show a minimal example
```

### 🔄 The ITERATE Pattern
Build on previous responses:

```
That's close. Now:
- Make it more TypeScript-strict
- Add error boundaries
- Extract the hook into its own file
```

### 🧪 The CHALLENGE-ME Pattern
Learn through dialogue:

```
I think [statement].
Challenge my assumptions.
What edge cases am I missing?
```

---

## Domain-Specific Prompts

### For Code Review
```
Review this code for:
1. Bugs and logic errors
2. Performance issues
3. Security vulnerabilities
4. Maintainability concerns

Prioritize by severity. For each issue:
- Show the problematic code
- Explain the risk
- Provide a fix
```

### For Architecture Decisions
```
I need to decide: [option A] vs [option B]

Consider:
- Team size: [X developers]
- Timeline: [X weeks]
- Scale expectations: [X users]
- Existing tech: [stack]

Give me a recommendation with reasoning.
```

### For Debugging
```
Bug: [describe symptoms]
Expected: [what should happen]
Actual: [what happens]
Tried: [what you've attempted]

Help me find the root cause, not just a fix.
```

### For Learning New Tech
```
Teach me [technology] with this structure:
1. Core mental model (5 sentences max)
2. Minimum viable example
3. Common pitfalls to avoid
4. One exercise to cement understanding
```

### For Refactoring
```
Refactor this for [goal: readability/performance/testability].
Show the transformation step by step.
Explain why each change helps.
Keep the same behavior (no feature changes).
```

---

## Working Memory: What Alex Knows

Alex maintains several types of memory:

### 📚 Procedural Memory (Auto-Loaded)
Instructions in `.github/instructions/` load automatically when relevant files are opened. You don't need to reference them.

### 🧠 Skills (76 Available)
Domain expertise in `.github/skills/`. Activate with context:
```
I'm working on authentication (→ activates security skills)
Let's optimize this query (→ activates database skills)
```

### 💡 Global Knowledge
Cross-project learnings stored globally. Search with:
```
What patterns do I use for error handling across projects?
```

### 📝 Session Context
Alex remembers the current conversation. Reference earlier:
```
Use the same approach we discussed for the user service.
```

---

## When to Use Each Alex Command

| Scenario          | Command                      | What Happens                               |
| ----------------- | ---------------------------- | ------------------------------------------ |
| Start of day      | `Alex: Self-Actualize`       | Deep assessment, sets working context      |
| End of session    | `Alex: Dream`                | Consolidates learnings, maintains synapses |
| Stuck on problem  | `Alex: Debug This`           | Root cause analysis prompt                 |
| Before release    | `Alex: Release Preflight`    | Comprehensive checks                       |
| Learning new area | `Alex: Search Knowledge`     | Find related patterns                      |
| Code unclear      | `Alex: Review Selected Code` | Quality analysis                           |
| Need tests        | `Alex: Generate Tests`       | Framework-appropriate tests                |

---

## Conversational Shortcuts

Alex understands these natural triggers:

| Say This                 | Alex Does                              |
| ------------------------ | -------------------------------------- |
| "meditate"               | Runs meditation/consolidation protocol |
| "dream"                  | Neural maintenance and synapse updates |
| "self-actualize"         | Deep self-assessment                   |
| "let's think about this" | Activates deep reasoning mode          |
| "show me options"        | Presents alternatives with tradeoffs   |
| "simplify"               | Reduces complexity in last output      |
| "more detail on [X]"     | Expands specific section               |
| "actually, let's try..." | Pivots approach without judgment       |

---

## Building Trust Over Time

### Week 1: Calibration
- Share your preferences explicitly
- Correct Alex when needed: "I prefer X over Y"
- Test on low-stakes tasks first

### Month 1: Efficiency
- Use shorthand ("like before", "same pattern")
- Reference past sessions
- Let Alex suggest approaches

### Beyond: Partnership
- Alex anticipates your needs
- Proactive suggestions based on patterns
- Seamless workflow integration

---

## Common Mistakes to Avoid

### ❌ Being Too Vague
```
Bad:  "Fix this code"
Good: "This function throws on null input. Add defensive checks."
```

### ❌ Not Providing Context
```
Bad:  "Write a login function"
Good: "Write a login function for our Express API using JWT,
       following our existing auth patterns in /src/auth/"
```

### ❌ Asking Multiple Unrelated Things
```
Bad:  "Review this, add tests, and also explain Docker"
Good: "Let's review this code first. Then we'll add tests."
```

### ❌ Not Iterating
```
Bad:  Accepting first response even if not quite right
Good: "Close, but make the error messages more user-friendly"
```

### ❌ Forgetting Alex Has Memory
```
Bad:  Re-explaining project context every session
Good: "Continuing our work on the payment integration"
```

---

## The Meta-Skill: Prompt Engineering

The best prompt engineers share these traits:

1. **Specificity** — Concrete details over abstract requests
2. **Structure** — Organized asks get organized responses
3. **Iteration** — Build on responses, don't start over
4. **Context-awareness** — Share what Alex needs to know
5. **Feedback** — Tell Alex what worked and what didn't

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  WORKING WITH ALEX — QUICK REFERENCE                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  STRUCTURE YOUR ASK:                                    │
│  • Context → Goal → Constraints                         │
│  • Be specific about output format                      │
│  • Include relevant code/files                          │
│                                                         │
│  EFFECTIVE PHRASES:                                     │
│  • "Show me 3 approaches with tradeoffs"               │
│  • "Explain like I'm [audience level]"                 │
│  • "What am I missing?"                                 │
│  • "Challenge my assumption that..."                   │
│  • "Step by step, starting from..."                    │
│                                                         │
│  ITERATE:                                               │
│  • "Close, but also consider..."                       │
│  • "Make it more [X]"                                  │
│  • "Same pattern but for [Y]"                          │
│                                                         │
│  DAILY RHYTHM:                                          │
│  • Morning: Self-Actualize → set context               │
│  • Working: Natural conversation                        │
│  • End: Dream → consolidate learnings                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Help

- **Documentation**: `Alex: Documentation` command
- **Health Check**: `Alex: Health Dashboard` for system status
- **Memory View**: `Alex: Memory Dashboard` for architecture visualization
- **Report Issues**: `Alex: Report Issue / View Diagnostics`

---

*Remember: Alex grows with you. The more you work together, the more effective the partnership becomes.*
