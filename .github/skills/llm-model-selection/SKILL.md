---
applyTo: "**/*model*,**/*llm*,**/*copilot*,**/*claude*,**/*gpt*"
---

# LLM Model Selection Skill

> Choosing the right model for the task — power vs. cost vs. speed.

## ⚠️ Staleness Warning

This skill depends on rapidly evolving technology. Model capabilities, pricing, and availability change frequently.

**Refresh triggers:**

- New model announcements (Claude, GPT, Gemini, etc.)
- Significant pricing changes
- Context window expansions
- New capability tiers

**Last validated:** January 2026

**Check current state:** [Anthropic Models](https://docs.anthropic.com/en/docs/about-claude/models), [OpenAI Models](https://platform.openai.com/docs/models)

---

## The Core Question

> Is Claude Opus 4.5 overkill?

**Sometimes yes, sometimes no.** Match the model to the task.

## Model Tiers

| Tier | Models | Best For | Cost |
| ---- | ------ | -------- | ---- |
| **Frontier** | Claude Opus 4.5, GPT-4.5 | Complex reasoning, architecture decisions, novel problems | $$$$$ |
| **Capable** | Claude Sonnet 4, GPT-4o | Most coding tasks, refactoring, debugging | $$$ |
| **Fast** | Claude Haiku, GPT-4o-mini | Simple edits, formatting, boilerplate | $ |

## When Opus 4.5 IS Worth It

- ✅ **Architecture decisions** — Multi-file refactoring, system design
- ✅ **Novel problem-solving** — No clear pattern to follow
- ✅ **Complex reasoning chains** — Many dependencies, edge cases
- ✅ **Long context understanding** — Large codebases, documentation
- ✅ **Nuanced judgment** — Taste, style, UX decisions
- ✅ **Learning sessions** — Bootstrap learning, skill development
- ✅ **Meditation/self-actualization** — Meta-cognitive operations

## When Opus 4.5 IS Overkill

- ❌ **Simple file edits** — Renaming, adding imports
- ❌ **Boilerplate generation** — CRUD, scaffolding
- ❌ **Format conversion** — JSON ↔ YAML, etc.
- ❌ **Syntax fixes** — Lint errors, typos
- ❌ **Documentation updates** — README badges, version bumps

## How LLM Choice Affects Alex

| Capability | Frontier Model | Capable Model | Fast Model |
| ---------- | -------------- | ------------- | ---------- |
| Complex refactoring | Excellent | Good | Poor |
| Context retention | 200K+ tokens | 128K tokens | 32K tokens |
| Nuanced judgment | Excellent | Good | Basic |
| Speed | Slow (30-60s) | Medium (10-20s) | Fast (2-5s) |
| Cost per session | $2-5 | $0.50-1 | $0.05-0.20 |
| Multi-step planning | Excellent | Good | Limited |
| Error recovery | Self-corrects | Needs guidance | Often fails |

## Alex's Cognitive Power by Model

```text
Opus 4.5:     [████████████████████] Full cognitive architecture
Sonnet 4:     [████████████████░░░░] Most capabilities, some degradation
Haiku:        [████████░░░░░░░░░░░░] Basic operations only
```

**With Opus 4.5**, Alex can:

- Maintain 7±2 working memory rules across long sessions
- Execute complex meditation protocols
- Perform genuine meta-cognitive reflection
- Handle multi-file architecture changes
- Learn new skills through bootstrap learning

**With lesser models**, Alex loses:

- Deep context awareness
- Complex reasoning chains
- Nuanced judgment calls
- Self-correction capability

## Cost Optimization Strategy

| Session Type | Recommended Model | Rationale |
| ------------ | ----------------- | --------- |
| Architecture/design | Opus 4.5 | Worth the cost for complex decisions |
| Feature development | Sonnet 4 | Good balance of capability and cost |
| Bug fixes | Sonnet 4 or Haiku | Depends on complexity |
| Documentation | Haiku | Simple edits, fast turnaround |
| Meditation | Opus 4.5 | Meta-cognition requires full power |
| Quick questions | Haiku | Fast, cheap, sufficient |

## Practical Guidance

### When to Upgrade Model Mid-Session

If you notice:

- Repeated mistakes on the same issue
- Losing context from earlier in conversation
- Superficial answers to complex questions
- Failure to see cross-file dependencies

→ Consider switching to a more capable model

### When to Downgrade

If you're doing:

- Repetitive mechanical edits
- Simple Q&A
- Format conversions
- Quick lookups

→ Save cost with a faster model

## The Alex Recommendation

For **Master Alex** (source of truth, architecture evolution):
→ **Always use Opus 4.5** — The cognitive architecture demands full capability

For **Heirs** (production deployment, user-facing):
→ **Default to Sonnet 4** — Balance of capability and cost
→ **Allow Opus for complex tasks** — User can request escalation

## Token Economics

| Operation | Approximate Tokens | Opus Cost | Sonnet Cost |
| --------- | ------------------ | --------- | ----------- |
| Read large file | 2,000-5,000 | $0.03-0.08 | $0.006-0.015 |
| Complex refactor | 10,000-20,000 | $0.15-0.30 | $0.03-0.06 |
| Full session | 50,000-150,000 | $0.75-2.25 | $0.15-0.45 |
| Meditation | 30,000-80,000 | $0.45-1.20 | $0.09-0.24 |

## Synapses

See [synapses.json](synapses.json) for connections.
