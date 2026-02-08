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

## Dialog Engineering: Beyond the Magic Prompt

**The biggest misconception** in prompt engineering is that one perfect prompt will solve everything. In reality, effective AI partnership is **dialog engineering** — a structured conversation that evolves toward the solution.

### Why Dialog Beats Single Prompts

| Single Prompt Approach | Dialog Approach |
|------------------------|-----------------|
| Front-load all requirements | Discover requirements together |
| Hope AI guesses right | Steer toward your vision |
| Restart when wrong | Refine incrementally |
| 1 attempt, pass/fail | Multiple iterations, continuous improvement |
| Cognitive overload (for AI) | Manageable chunks |

### The Dialog Flow Framework

Every effective AI session follows this pattern:

```
┌─────────────────────────────────────────────────────────┐
│  1. ORIENT → 2. EXPLORE → 3. BUILD → 4. REFINE → 5. ✓  │
└─────────────────────────────────────────────────────────┘
```

### Example: Building a Feature (Dialog Flow)

**❌ The "Magic Prompt" Attempt:**
```
Build me a complete user authentication system with login, 
registration, password reset, JWT tokens, refresh tokens, 
email verification, rate limiting, and tests.
```
*Result: Generic, doesn't fit your stack, missing context.*

**✅ The Dialog Engineering Approach:**

**Turn 1 - ORIENT:**
```
I need to add authentication to my Express/TypeScript API.
Current stack: Express 4, TypeScript, Prisma, PostgreSQL.
What approaches would you recommend? Keep it simple.
```
*→ Alex presents options, asks clarifying questions*

**Turn 2 - EXPLORE:**
```
I like the JWT + refresh token approach. 
One question: should refresh tokens be in DB or Redis?
We expect ~1000 daily active users.
```
*→ Alex explains tradeoffs, gives recommendation*

**Turn 3 - BUILD (incremental):**
```
Let's start with just the login endpoint. 
Show me the route, controller, and Prisma schema changes.
```
*→ Alex generates focused, reviewable code*

**Turn 4 - REFINE:**
```
Good. Now add:
- Input validation with Zod
- Rate limiting (5 attempts per minute)
- Proper error messages
```
*→ Alex adds layers incrementally*

**Turn 5 - EXTEND:**
```
Now the registration endpoint, same patterns.
Then we'll do password reset.
```
*→ Alex follows established patterns*

### Dialog Templates for Common Scenarios

#### 🏗️ Building a Feature
```
Turn 1: "I need to build [feature]. Here's my context: [tech stack, constraints]"
Turn 2: "I like approach X. What about [specific concern]?"
Turn 3: "Let's start with [smallest useful piece]"
Turn 4: "Now add [next layer]"
Turn 5: "Apply to [next component]"
```

#### 🐛 Debugging
```
Turn 1: "I'm seeing [symptom]. Here's the relevant code: [paste]"
Turn 2: "I tried [your attempts]. Still broken."
Turn 3: "Interesting theory. Let me check... [result]"
Turn 4: "That was it! Now help me prevent this in future."
```

#### 📚 Learning Something New
```
Turn 1: "Teach me [topic]. I already know [related things]"
Turn 2: "That mental model helps. Show me a minimal example"
Turn 3: "What if I wanted to [variation]?"
Turn 4: "What are the common mistakes beginners make?"
Turn 5: "Give me an exercise to practice"
```

#### 🔄 Refactoring
```
Turn 1: "This code works but feels messy. [paste code]"
Turn 2: "I want to focus on [specific aspect: readability/performance/tests]"
Turn 3: "Break it into steps. Show me step 1 first."
Turn 4: "Good, now step 2..."
Turn 5: "Did this change any behavior? How would I verify?"
```

### Dialog Anti-Patterns

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| **The Dump** | "Build everything at once" | Start small, iterate |
| **The Oracle** | Expecting perfect answers with zero context | Share context progressively |
| **The Ghost** | Accept any response without feedback | React: "close, but..." or "exactly" |
| **The Restart** | Start over instead of refining | "That's 80% there. Now adjust X" |
| **The Monologue** | Never asking Alex questions | "What would you suggest?" "What am I missing?" |

### Power Moves in Dialog Engineering

1. **The Checkpoint**: "Before we continue, let me summarize what we've decided..."
2. **The Pivot**: "Actually, let's try a different approach..."
3. **The Probe**: "Why did you choose X over Y?"
4. **The Constraint**: "Now make it work with [new limitation]"
5. **The Rubber Duck**: "Let me think out loud, tell me where I'm wrong..."
6. **The Handoff**: "I'll implement this part. You do the tests."

### Example: Real Dialog Flow (Condensed)

```
👤: I need a command that copies a formatted prompt to clipboard.
    Looking at debugThis in extension.ts for reference.

🤖: I see the pattern. Should it support file URIs (explorer context) 
    plus editor selection?

👤: Yes, same as debugThis. Also need a quick pick for options.

🤖: [generates code with quick pick]

👤: Good. The options need better icons. And add telemetry.

🤖: [refines with icons, adds telemetry.logTimed]

👤: Perfect. Now 4 more commands same pattern: explain, refactor, 
    security, document.

🤖: [generates batch, following established pattern]

👤: Add to context menus and package.json too.

🤖: [complete implementation]
```

**5 turns** to implement 5 production-ready commands. No "magic prompt" could do this.

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

## Right-Click Quick Actions (Context Menu)

Select code and right-click for instant access to these prompts:

| Command             | What It Does                                                          | Best For                      |
| ------------------- | --------------------------------------------------------------------- | ----------------------------- |
| **Explain This**    | Level-appropriate explanation (junior/senior/reviewer/teacher)        | Understanding unfamiliar code |
| **Code Review**     | Bugs, performance, security, maintainability analysis                 | Quality gates                 |
| **Debug This**      | Root cause analysis with fix suggestions                              | Stuck on a bug                |
| **Refactor This**   | Goal-oriented refactoring (readability/performance/testability/SOLID) | Code improvement              |
| **Simplify This**   | Reduce nesting, extract helpers, improve naming                       | Code cleanup                  |
| **Security Review** | OWASP Top 10 audit with severity ratings                              | Before deployment             |
| **Document This**   | Language-appropriate docs (JSDoc/docstrings/XML docs)                 | Missing documentation         |
| **Generate Tests**  | Framework-appropriate test generation                                 | Test coverage                 |

### Best Practice: The Right-Click Workflow

Instead of typing complex prompts, use the context menu:

1. **Select the code** you want to analyze
2. **Right-click** → Alex submenu
3. **Choose the action** (prompt is copied to clipboard)
4. **Paste in chat** (Ctrl+V) and send

This ensures consistent, well-structured prompts every time.

---

## Best Practices for AI Partnership

### 1. Start Sessions with Context

```
Good morning! Today I'm working on:
- Project: Alex Cognitive Architecture
- Focus: Adding new clipboard commands
- Constraints: Must follow existing patterns
```

### 2. Use Incremental Refinement

Don't try to get everything perfect in one prompt:

```
First: "Generate a basic implementation"
Then:  "Add error handling"
Then:  "Add TypeScript strict types"
Then:  "Add tests"
```

### 3. Leverage History

Alex remembers the session. Use references:

```
"Apply the same pattern we used for the user service"
"Use the error handling from the auth module"
"Similar to what we discussed earlier, but for products"
```

### 4. Give Feedback

Help Alex calibrate:

```
"That's exactly what I needed"
"Too verbose — keep it to the essentials"
"Good approach, but I prefer functional style"
```

### 5. Know When to Pause

If Alex seems stuck or outputs low quality:

```
"Let's step back. Here's the bigger picture..."
"I think we're overcomplicating this. The core need is..."
"Can we try a completely different approach?"
```

### 6. Document Your Partnership

Keep a log of effective prompts:

```
// Alex prompt that works well for API endpoints:
"Generate a REST endpoint for [resource] with:
- Input validation using Zod
- Error handling with proper HTTP codes
- TypeScript strict mode
- Unit test in same response"
```

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
│  RIGHT-CLICK ACTIONS (select code first):               │
│  • Explain This → Level-appropriate explanation         │
│  • Code Review → Quality analysis                       │
│  • Debug This → Root cause analysis                     │
│  • Refactor This → Goal-oriented improvement            │
│  • Simplify This → Clean code transformation            │
│  • Security Review → OWASP audit                        │
│  • Document This → Generate docs (JSDoc/docstring)      │
│  • Generate Tests → Framework-appropriate tests         │
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
│  • Working: Right-click actions + conversation         │
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
