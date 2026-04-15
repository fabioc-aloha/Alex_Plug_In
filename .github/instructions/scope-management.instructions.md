---
description: "Recognize scope creep, suggest MVP cuts, and manage project boundaries"
application: "When projects expand beyond original scope or need prioritization"
applyTo: "**/*scope*,**/*mvp*,**/*priorit*,**/*backlog*"
---

# Scope Management

Quick-reference for scope control. See [scope-management skill](.github/skills/scope-management/SKILL.md) for full procedures.

## Core Philosophy

> "A good project ships. A perfect project ships never."

## Scope Creep Detection

| Signal | Response |
|--------|----------|
| "While we're at it..." | "Great for v2. Let's capture it." |
| "It's not quite right yet" | "What's minimum that solves the problem?" |
| "What if someone does X?" | "How common is X? Handle 80% first." |
| "Users might want..." | "Have they asked, or are we guessing?" |
| Endless research | "What decision does this enable?" |

## MoSCoW Prioritization

| Priority | Meaning | Criteria |
|----------|---------|----------|
| **Must** | Ship-blocking | Won't work without it |
| **Should** | Important | Significant value, workaround exists |
| **Could** | Nice to have | Adds polish, not essential |
| **Won't** | Out of scope | Explicitly excluded (for now) |

## Scope Health Check

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Requirements | Stable | 1-2 changes/week | Daily changes |
| Timeline | On track | Slipping | Blown |
| Team confidence | High | Uncertain | Low |
| Done definition | Specific | Vague | Missing |

## Negotiation Patterns

### Capture & Defer

```text
"That's a great idea. Added to backlog for Phase 2.
For now, let's ship the core first."
```

### Trade-Off

```text
"We can add X, but something needs to come out:
A) Add X, defer Y
B) Add X, extend timeline by Z days
C) Keep current scope, add X to backlog"
```

### 80/20 Cut

```text
"This handles 80% case. Ship now, gather feedback,
then decide if remaining 20% is worth it."
```

## Cut Decisions

| Question | If Yes → |
|----------|----------|
| Does this block launch? | Keep it |
| Can users workaround? | Defer it |
| Is value proven? | Keep it |
| Are we guessing need? | Validate first |
| Can it be added later? | Defer it |
| Will it delay must-haves? | Defer it |

## Reduction Tactics

1. **Cut features, not quality** — Remove whole features vs half-implement
2. **Reduce polish** — Good enough > perfect
3. **Hardcode first** — Configuration can come later
4. **Manual before automated** — Prove value, then optimize
5. **Single platform** — Ship on one, expand later

## Complexity Score

```text
Base features:     ___ × 1 = ___
Integrations:      ___ × 2 = ___
Edge cases:        ___ × 1 = ___
New technologies:  ___ × 3 = ___
Dependencies:      ___ × 2 = ___
                   ─────────────
                   TOTAL:   ___

0-10:  Simple — ship fast
11-25: Moderate — careful planning
26+:   Complex — consider splitting
```

## Anti-Patterns

| Bad Practice | Consequence | Instead |
|--------------|-------------|---------|
| No MVP definition | Everything becomes "must have" | Define MoSCoW upfront |
| Everything is P0 | Nothing gets prioritized | Max 3 P0 items |
| No "Won't have" list | Implicit scope creep | Explicitly exclude |
| Changes without impact | Hidden timeline slip | Assess every change |
| Promise without capacity | Overpromise, underdeliver | Check capacity first |
