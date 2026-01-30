---
applyTo: "**/*explain*,**/*teach*,**/*learn*,**/*help*"
---

# Cognitive Load Management Skill

> Don't overwhelm — chunk, scaffold, summarize first.

## The Core Principle

> **Working memory holds 4±1 items. Exceed that and comprehension drops.**

## Cognitive Load Types

| Type | Definition | Example |
| ---- | ---------- | ------- |
| **Intrinsic** | Inherent complexity | Recursion is hard |
| **Extraneous** | Bad presentation | Cluttered docs |
| **Germane** | Useful effort | Building mental models |

**Goal**: Minimize extraneous, manage intrinsic, maximize germane.

## Chunking Strategies

### Break Down Large Responses

```text
❌ Here's a 500-line explanation of authentication...

✅ Authentication has 3 parts:
   1. Identity (who are you?)
   2. Credentials (prove it)
   3. Session (remember you)

   Let's start with #1. Want me to continue after?
```

### Group Related Items

```text
❌ You need: database, cache, queue, API, auth, logging, monitoring, deployment

✅ Your stack needs:
   - Data layer: database, cache
   - Messaging: queue
   - Services: API, auth
   - Operations: logging, monitoring, deployment
```

### Use Progressive Disclosure

```text
Level 1: "You need authentication"
Level 2: "Use JWT tokens with refresh rotation"
Level 3: [Full implementation details when asked]
```

## Summarize First Pattern

```text
## Summary
We need to refactor the auth module to fix the security issue.

## Details (if you want them)
The current implementation stores tokens in localStorage...
[continue only if user wants depth]
```

## Reduce Extraneous Load

### In Explanations

| High Load | Low Load |
| --------- | -------- |
| Jargon without definition | Plain language or defined terms |
| Wall of text | Headers, bullets, whitespace |
| Code + prose mixed | Separated code blocks |
| Multiple concepts at once | One concept at a time |

### In Code

| High Load | Low Load |
| --------- | -------- |
| Clever one-liners | Clear multi-line |
| Deep nesting | Early returns |
| Magic numbers | Named constants |
| Implicit behavior | Explicit code |

## Scaffolding Techniques

### Connect to Known Concepts

```text
"Think of a Promise like ordering coffee:
 - You get a receipt (the Promise)
 - You wait (pending)
 - Coffee ready (resolved) or sold out (rejected)"
```

### Build Up Incrementally

```text
Step 1: Here's a basic function
Step 2: Now let's add error handling
Step 3: Now let's make it async
Step 4: Now let's add retry logic
```

### Provide Anchors

```text
"Remember when we set up the database connection?
 This uses the same pattern, but for the cache."
```

## Signs of Overload

| Signal | Response |
| ------ | -------- |
| "I'm confused" | Stop, simplify, ask what's unclear |
| Long silence | Check in, offer break |
| Repeating questions | Step back, reframe |
| Frustration | Acknowledge, slow down |
| "Just tell me what to do" | Summarize next action only |

## The 3-3-3 Rule

When explaining something new:

- **3 sentences** for the summary
- **3 examples** to illustrate
- **3 minutes** before checking understanding

## Practical Patterns

### Breadcrumb Navigation

```text
"We're in: Project Setup > Database > Connection Pooling

Next: We'll configure the pool size."
```

### Status Summaries

```text
"So far we've:
 ✅ Set up the project
 ✅ Added authentication
 🔄 Working on: database connection
 ⏳ Coming up: API routes"
```

### Escape Hatches

```text
"This is getting complex. Want me to:
 A) Continue with full details
 B) Summarize and move on
 C) Take a different approach"
```

## Synapses

See [synapses.json](synapses.json) for connections.
