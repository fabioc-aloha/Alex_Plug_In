/**
 * globalKnowledgePatterns.ts - Starter pattern templates for Global Knowledge repos
 *
 * Contains content templates for the 5 starter patterns (code quality, documentation,
 * error handling, problem solving, communication) included when scaffolding new GK repos.
 */
/**
 * Get starter patterns to include in new GK repos
 */
type StarterPattern = {
    id: string;
    filename: string;
    title: string;
    category: string;
    tags: string[];
    content: string;
};

export function getStarterPatterns(createdAt: string): StarterPattern[] {
    return [
        ...getCodeQualityPattern(createdAt),
        ...getDocumentationPattern(createdAt),
        ...getErrorHandlingPattern(createdAt),
        ...getProblemSolvingPattern(createdAt),
        ...getCommunicationPattern(createdAt),
    ];
}

function getCodeQualityPattern(createdAt: string): StarterPattern[] {
    return [{
        id: 'GK-starter-code-quality-principles',
        filename: 'GK-starter-code-quality-principles.md',
            title: 'Code Quality Principles',
            category: 'patterns',
            tags: ['dry', 'kiss', 'code-quality', 'refactoring', 'starter'],
            content: `# Code Quality Principles

**ID**: GK-starter-code-quality-principles
**Category**: patterns
**Tags**: dry, kiss, code-quality, refactoring, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## Core Principles

### DRY (Don't Repeat Yourself)

When you see the same code pattern 3+ times, extract it:

\`\`\`typescript
// Before: Repeated in 5 components
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// After: Single reusable hook
function useApi<T>() {
  const [state, setState] = useState<{data: T | null, loading: boolean, error: Error | null}>({
    data: null, loading: false, error: null
  });
  // ... fetch logic
  return state;
}
\`\`\`

**Key insight**: Repetition isn't always obvious until you actively scan for patterns using grep/search.

### KISS (Keep It Simple, Stupid)

One responsibility per abstraction:
- A hook should do ONE thing well
- A function should have ONE clear purpose
- A component should render ONE concept

**Anti-pattern**: Trying to make something "flexible" often makes it harder to understand and maintain.

## When to Refactor

1. **3+ repetitions** — Extract to shared function/hook
2. **100+ line function** — Split into smaller pieces
3. **5+ parameters** — Consider config object
4. **Nested ternaries** — Use early returns
5. **Mixed concerns** — Separate side effects from rendering

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
    }];
}

function getDocumentationPattern(createdAt: string): StarterPattern[] {
    return [{
        id: 'GK-starter-documentation-structure',
        filename: 'GK-starter-documentation-structure.md',
        title: 'Documentation Structure Pattern',
        category: 'documentation',
        tags: ['documentation', 'readme', 'structure', 'templates', 'starter'],
            content: `# Documentation Structure Pattern

**ID**: GK-starter-documentation-structure
**Category**: documentation
**Tags**: documentation, readme, structure, templates, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## Project README Template

Every project should have a README with these sections:

\`\`\`markdown
# Project Name

> One-line description of what this project does

## Quick Start

\\\`\\\`\\\`bash
npm install
npm run dev
\\\`\\\`\\\`

## What It Does

2-3 sentences explaining the project's purpose and key features.

## Project Structure

\\\`\\\`\\\`
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
└── types/          # TypeScript types
\\\`\\\`\\\`

## Development

Key commands for daily development work.

## Deployment

How to deploy to production.
\`\`\`

## Documentation Hierarchy

| Type | Location | Purpose |
|------|----------|---------|
| Quick reference | README.md | First thing users see |
| API docs | docs/api/ | Endpoint details |
| Architecture | docs/architecture/ | System design decisions |
| Runbooks | docs/operations/ | How to operate/maintain |

## Best Practices

1. **Write for future you** — You won't remember in 6 months
2. **Include examples** — Code samples beat prose
3. **Keep it updated** — Outdated docs are worse than none
4. **Link, don't duplicate** — Single source of truth

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
    }];
}

function getErrorHandlingPattern(createdAt: string): StarterPattern[] {
    return [{
        id: 'GK-starter-error-handling',
        filename: 'GK-starter-error-handling.md',
        title: 'Error Handling Patterns',
        category: 'error-handling',
        tags: ['error-handling', 'try-catch', 'async', 'typescript', 'starter'],
        content: `# Error Handling Patterns

**ID**: GK-starter-error-handling
**Category**: error-handling
**Tags**: error-handling, try-catch, async, typescript, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## Async/Await Error Handling

### Pattern: Wrapper Function

\`\`\`typescript
async function safeAsync<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Usage
const [data, error] = await safeAsync(fetchUser(id));
if (error) {
  console.error('Failed to fetch user:', error.message);
  return;
}
// data is now guaranteed to be non-null
\`\`\`

### Pattern: Error Boundaries (React)

\`\`\`typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorMessage />}>
  <RiskyComponent />
</ErrorBoundary>
\`\`\`

## API Error Responses

Standardize error responses across your API:

\`\`\`typescript
interface ApiError {
  code: string;        // Machine-readable: 'USER_NOT_FOUND'
  message: string;     // Human-readable: 'User not found'
  details?: unknown;   // Optional context
}

// Return consistent shape
return res.status(404).json({
  code: 'USER_NOT_FOUND',
  message: \`User with ID \${id} not found\`
});
\`\`\`

## Best Practices

1. **Fail fast** — Check preconditions early
2. **Log context** — Include relevant IDs in error messages
3. **Don't swallow errors** — At minimum, log them
4. **Graceful degradation** — Show users a fallback, not a blank screen
5. **Type your errors** — Use discriminated unions when possible

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
    }];
}

function getProblemSolvingPattern(createdAt: string): StarterPattern[] {
    return [{
        id: 'GK-starter-problem-solving',
        filename: 'GK-starter-problem-solving.md',
        title: 'Problem Solving Framework',
        category: 'debugging',
        tags: ['debugging', 'problem-solving', '5-whys', 'rubber-duck', 'root-cause', 'starter'],
        content: `# Problem Solving Framework

**ID**: GK-starter-problem-solving
**Category**: debugging
**Tags**: debugging, problem-solving, 5-whys, rubber-duck, root-cause, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## The Rubber Duck Method

When stuck, explain the problem out loud (or in writing):

1. **Describe what should happen**
2. **Describe what actually happens**
3. **Walk through the code step by step**
4. **The answer often emerges mid-explanation**

> The duck doesn't need to answer. The act of explaining reveals what you missed.

## 5 Whys Root Cause Analysis

Keep asking "Why?" until you reach the systemic issue:

| Level | Question | Example |
|-------|----------|---------|
| 1 | Why did the API fail? | Database timeout |
| 2 | Why did the database timeout? | Query took 30 seconds |
| 3 | Why did the query take 30 seconds? | No index on user_id |
| 4 | Why is there no index? | Not added during migration |
| 5 | Why wasn't it caught? | No query performance tests |

**Root cause**: Missing performance testing → Add query performance checks to CI.

## Problem-Solving Questions

### About the Symptom
- What exactly is happening vs. what should happen?
- When did this last work correctly?
- What changed since then?

### About the Context
- Can you reproduce it reliably?
- Does it happen in all environments?
- Does it affect all users or just some?

### About Assumptions
- Have you verified that value is what you expect?
- Are you sure that code path is being executed?
- What are you assuming that might not be true?

## Fix + Prevent Pattern

1. **Immediate**: Stop the bleeding (hotfix)
2. **Permanent**: Fix the root cause
3. **Prevention**: Add tests/alerts to prevent recurrence

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
    }];
}

function getCommunicationPattern(createdAt: string): StarterPattern[] {
    return [{
        id: 'GK-starter-cognitive-communication',
        filename: 'GK-starter-cognitive-communication.md',
        title: 'Cognitive Communication',
        category: 'communication',
        tags: ['cognitive-load', 'communication', 'summarize', 'chunking', 'teaching', 'starter'],
        content: `# Cognitive Communication

**ID**: GK-starter-cognitive-communication
**Category**: communication
**Tags**: cognitive-load, communication, summarize, chunking, teaching, starter
**Source**: Alex Starter Pack
**Created**: ${createdAt}

---

## The Cognitive Load Rule

**Working memory: 4±1 items.** Exceed this and comprehension drops.

| High Cognitive Load | Low Cognitive Load |
|---------------------|-------------------|
| Wall of text | Headers + bullets |
| Multiple concepts at once | One at a time |
| Technical jargon | Plain language first |
| Deep nesting | Flat structure |
| No context | Summary first |

## Summarize First Pattern

Always lead with the conclusion:

\`\`\`markdown
## Summary
[2-3 sentences answering the core question]

## Details
[Only if they ask for more]

## Implementation
[Only if they need specifics]
\`\`\`

**Anti-pattern**: Building up to the answer. Say the answer first, then explain.

## Chunking for Comprehension

Break large responses into digestible pieces:

1. **Group related items** (categories, themes)
2. **Limit to 3-5 chunks** per level
3. **Use visual hierarchy** (headers, bullets, tables)
4. **Pause between chunks** — check understanding

## The 3-3-3 Rule

- **3 sentences** for the summary
- **3 examples** to illustrate
- **3 minutes** before checking: "Does this make sense so far?"

## Progressive Disclosure

| Level | Contains | When to Use |
|-------|----------|-------------|
| 1. Summary | Core answer | Always first |
| 2. Details | How it works | If they ask "how?" |
| 3. Implementation | Code/steps | If they need to do it |

**Ask before going deeper**: "Want me to show you how this works?"

## Overload Signals & Responses

| Signal | What to Do |
|--------|------------|
| "I'm confused" | Stop, simplify, restart |
| Repeated questions | You skipped something |
| Frustration | Acknowledge, slow down |
| Silence | Check in: "Still with me?" |

---

> 💡 This is a **starter pattern** from Alex. Customize it based on your team's practices.
`
    }];
}
