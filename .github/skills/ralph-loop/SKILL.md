---
name: ralph-loop
description: Iterative quality improvement — generate, evaluate, feedback, re-generate until threshold met
applyTo: '**/*quality*,**/*eval*,**/*iterate*,**/*ralph*'
domain: Quality Engineering
category: Iterative Improvement
tier: advanced
dependencies:
  - testing-strategies
  - code-review
created: 2026-04-14
author: Alex
source: microsoft/skills (Sensei technique by Shayne Boyer)
---

# Ralph Loop — Iterative Quality Improvement

Generate → Evaluate → Feedback → Re-generate until quality threshold met.

## Pattern Origin

Inspired by the **Sensei iterative quality improvement** patterns from GitHub Copilot for Azure:

> "LLMs improve dramatically when given structured feedback about what went wrong and specific guidance on how to fix it."
>
> — Shayne Boyer (@spboyer), Microsoft

## Core Loop

```
┌─────────────────────────────────────────────────────────────┐
│                       RALPH LOOP                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐     ┌──────────┐     ┌──────────┐            │
│   │ Generate │────▶│ Evaluate │────▶│ Analyze  │            │
│   └─────────┘     └──────────┘     └──────────┘            │
│        ▲                                │                   │
│        │         ┌──────────────────────┘                   │
│        │         ▼                                          │
│        │    ┌──────────┐     ┌───────────┐                 │
│        └────│ Feedback │◀────│ Threshold │                 │
│             └──────────┘     │   Met?    │                 │
│                              └───────────┘                 │
│                                   │ Yes                    │
│                                   ▼                        │
│                              ┌────────┐                    │
│                              │  Done  │                    │
│                              └────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `maxIterations` | 5 | Maximum iterations before stopping |
| `qualityThreshold` | 80 | Score (0-100) to consider quality met |
| `improvementThreshold` | 5 | Minimum improvement required per iteration |
| `earlyStopOnPerfect` | true | Stop immediately when score reaches 100 |
| `includeFeedback` | true | Include feedback in re-generation prompts |

## Stop Conditions

1. **Perfect score** — Score reaches 100
2. **Quality threshold met** — Score ≥ `qualityThreshold`
3. **Improvement plateau** — Improvement < `improvementThreshold` for 2+ iterations
4. **Max iterations** — Reached `maxIterations`

## Acceptance Criteria

Criteria define what "good" looks like:

```json
{
  "skillName": "cosmos-db-patterns",
  "language": "typescript",
  "correctPatterns": [
    {
      "code": "container.items.query()",
      "description": "Use container.items.query() for parameterized queries",
      "section": "query-patterns"
    }
  ],
  "incorrectPatterns": [
    {
      "code": "SELECT * FROM c",
      "description": "Avoid SELECT * — specify required fields",
      "section": "query-patterns"
    }
  ],
  "rules": [
    {
      "name": "error-handling",
      "requiredPatterns": ["try {", "catch ("],
      "forbiddenPatterns": ["// eslint-disable"]
    }
  ]
}
```

## Feedback Builder

Transforms evaluation findings into LLM-actionable feedback:

### Input (Evaluation Result)
```json
{
  "score": 65,
  "passed": false,
  "findings": [
    {
      "severity": "error",
      "rule": "pattern:query-patterns",
      "message": "Incorrect pattern found: Avoid SELECT * — specify required fields"
    }
  ],
  "matchedIncorrect": ["query-patterns"]
}
```

### Output (Feedback)
```markdown
## Issues Found in Generated Content

### CRITICAL ERRORS (Must Fix)

- **pattern:query-patterns**: Incorrect pattern found: Avoid SELECT * — specify required fields
  - Suggestion: Review acceptance criteria for correct usage

### INCORRECT PATTERNS DETECTED

Found incorrect patterns in sections: **query-patterns**

Review the acceptance criteria for these sections and use correct patterns instead.

### SUGGESTED CORRECTIONS

Based on the acceptance criteria, consider:

- Use: Use container.items.query() for parameterized queries
```

## CLI Usage

```bash
# Evaluate content against criteria
node ralph-loop.cjs --evaluate --content "SELECT * FROM c" --criteria criteria.json

# Evaluate from file
node ralph-loop.cjs --evaluate --content-file output.ts --criteria criteria.json

# Extract criteria from SKILL.md
node ralph-loop.cjs --extract-criteria --skill .github/skills/cosmos-db/SKILL.md

# Build feedback from findings
node ralph-loop.cjs --feedback --findings '[{"severity":"error","rule":"syntax","message":"Missing semicolon"}]'

# Stdin mode (for extension integration)
echo '{"content":"...","criteria":{...}}' | node ralph-loop.cjs --stdin
```

## Integration Patterns

### VS Code Extension

```typescript
import { ContentEvaluator, FeedbackBuilder, RalphLoopController } from './ralph-loop';

// Create evaluator with criteria
const criteria = loadSkillCriteria('cosmos-db-patterns');
const controller = new RalphLoopController(criteria, {
  maxIterations: 3,
  qualityThreshold: 85,
});

// Run loop with Copilot LLM
const result = await controller.run(
  async (prompt) => await copilot.generate(prompt),
  "Write a Cosmos DB query for user lookup",
  "user-query-scenario"
);

console.log(`Final score: ${result.finalScore}`);
console.log(`Converged: ${result.converged}`);
console.log(`Iterations: ${result.iterations.length}`);
```

### Standalone Evaluation

```typescript
const evaluator = new ContentEvaluator(criteria);
const feedbackBuilder = new FeedbackBuilder();

const result = evaluator.evaluate(generatedCode, 'my-scenario');
const feedback = feedbackBuilder.buildFeedback(result, criteria);

if (!result.passed) {
  console.log(feedback); // Give to LLM for improvement
}
```

## Quality Metrics

Track these across iterations:

| Metric | Description |
|--------|-------------|
| `score` | Overall quality score (0-100) |
| `errorCount` | Number of critical errors |
| `warningCount` | Number of warnings |
| `matchedCorrect` | Correct patterns found |
| `matchedIncorrect` | Incorrect patterns found |
| `improvement` | Score change from first to last iteration |
| `converged` | Whether quality threshold was met |

## When to Use

- **Code generation** — Validate SDK usage, patterns, security
- **Documentation** — Check structure, completeness, accuracy
- **Configuration** — Validate schema compliance, best practices
- **Any LLM output** — Iteratively improve until quality threshold met

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Set `maxIterations` too high (>5) | Usually 3-5 iterations sufficient |
| Set `qualityThreshold` at 100 | 80-90 is realistic for most use cases |
| Include vague criteria | Be specific with patterns and rules |
| Skip feedback on failure | Always provide structured feedback |

## Related

- **testing-strategies** — Test design and coverage
- **code-review** — Manual review patterns
- **debugging-patterns** — Root cause analysis
- **skill-creator** — Creating acceptance criteria for skills
