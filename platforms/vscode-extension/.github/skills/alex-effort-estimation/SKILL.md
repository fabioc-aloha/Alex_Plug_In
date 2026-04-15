---
name: alex-effort-estimation
description: Estimate task duration from an AI-assisted development perspective rather than traditional human developer estimates
tier: extended
applyTo: '**/*estimate*,**/*effort*,**/*planning*,**/*roadmap*,**/*tracker*'
---

# Alex Effort Estimation

> Convert human developer estimates to AI-assisted timelines.

**Last Updated**: April 2026

---

## Quick Reference: Effort Units

| Unit | Time | Use For |
|------|------|---------|
| **⚡ Instant** | < 5 min | Single edit, lookup, generation |
| **🔄 Short** | 5-30 min | Multi-file change, docs, skill |
| **⏱️ Medium** | 30-60 min | Feature, test suite, debugging |
| **📦 Session** | 1-2 hours | Major feature, release |
| **🗓️ Multi-session** | 2+ hours | Large refactor, new system |

---

## Conversion Table

| Task Type | Human → Alex | Multiplier |
|-----------|--------------|------------|
| **Research** | 8h → 45m | ×0.10 |
| **Code generation** | 4h → 35m | ×0.15 |
| **Documentation** | 4h → 25m | ×0.10 |
| **Skill creation** | 2h → 15m | ×0.12 |
| **Refactoring** | 4h → 1h | ×0.25 |
| **Bug fix (known cause)** | 2h → 35m | ×0.30 |
| **Bug fix (unknown)** | 4h → 2h | ×0.50 |
| **Architecture design** | 8h → 2h | ×0.25 |
| **Test writing** | 4h → 1.5h | ×0.40 |
| **New feature (S)** | 4h → 1h | ×0.25 |
| **New feature (M)** | 2d → 3h | ×0.20 |
| **New feature (L)** | 1w → 6h | ×0.15 |
| **Release process** | 4h → 1h | ×0.25 |

**Formula**: `Alex Time = Human Estimate × Multiplier + Bottlenecks`

---

## What Accelerates (4-10×)

| Activity | Why Fast |
|----------|----------|
| Research | Semantic search vs browsing |
| Boilerplate | Generated, not typed |
| Multi-file edits | Parallel in one pass |
| Code review | Instant pattern recognition |
| Learning new tech | Bootstrap learning skill |
| Documentation | Generated from code/context |

---

## Bottlenecks (Cannot Accelerate)

These take real time regardless of AI:

| Bottleneck | Impact | Mitigation |
|------------|--------|------------|
| **Test execution** | ×1.0 | Parallelize, fast feedback loops |
| **Build/compile** | ×1.0 | Incremental builds, caching |
| **Human approval** | Variable | Batch decisions, async review |
| **External APIs** | Variable | Mock for dev, timeout handling |
| **CI/CD pipeline** | ×1.0 | Optimize pipeline, parallel jobs |
| **Context loading** | ×0.8 | Pre-read relevant files |

---

## Estimation Template

```markdown
| Task | Human Est. | Alex Est. | Bottleneck |
|------|------------|-----------|------------|
| [Task] | [Xh/d] | [⚡🔄⏱️📦🗓️] | [None/Test/Approval/Build] |
```

**Example**:

| Task | Human | Alex | Bottleneck |
|------|-------|------|------------|
| Add new API endpoint | 4h | 🔄 30m | None |
| Write integration tests | 3h | ⏱️ 1.5h | Test execution |
| Deploy to staging | 2h | 📦 1.5h | CI pipeline |
| Code review cycle | 2h | ⏱️ 2h | Human approval |
| **Total** | **11h** | **📦 5.5h** | - |

---

## Planning Guidance

### When Estimating

1. **Apply multiplier** to core work
2. **Add bottleneck time** at ×1.0
3. **Factor approval cycles** (human response latency)
4. **Buffer 20%** for unexpected iteration

### Success Predictors

| Good Sign | Bad Sign |
|-----------|----------|
| Clear "done" definition | Vague scope |
| Quick win potential | External dependencies |
| Daily incremental work | Big-bang delivery |
| Defined acceptance criteria | "We'll know it when we see it" |

### Scope Guidance

| Alex Estimate | Scope Health |
|---------------|--------------|
| ⚡ Instant | Perfect — ship it |
| 🔄 Short | Good — single session |
| ⏱️ Medium | OK — plan breaks |
| 📦 Session | Consider splitting |
| 🗓️ Multi-session | **Split required** |

---

## Anti-Patterns

❌ **Instant everything** — Testing and approval take real time  
❌ **Skip review** — Speed without quality is waste  
❌ **Ignore iteration** — First attempt isn't always right  
❌ **Forget context** — Reading workspace takes time  
❌ **No buffer** — Edge cases and clarifications happen  