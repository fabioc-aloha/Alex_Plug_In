---
applyTo: "**/*refactor*,**/*extract*,**/*rename*,**/*inline*"
---

# Refactoring Patterns Skill

> Safe transformations — same behavior, better structure.

## Golden Rule

Tests pass before AND after.

## When to Refactor

| Trigger | Action |
| ------- | ------ |
| Feature is hard to add | Refactor first |
| Same bug twice | Refactor to prevent |
| "I don't understand" | Refactor for clarity |

## When NOT to Refactor

- No tests + time pressure
- Code won't change
- Right before release
- Should rewrite instead

## Core Moves

| Move | When |
| ---- | ---- |
| Extract Function | Does too many things |
| Inline Function | Body clear as name |
| Extract Variable | Complex expression |
| Rename | Name doesn't reveal intent |
| Move Function | Uses other class's data |

## Code Smells → Fix

| Smell | Refactoring |
| ----- | ----------- |
| Long function | Extract Function |
| Long param list | Parameter Object |
| Duplicate code | Extract Function |
| Feature envy | Move Function |
| Large class | Extract Class |

## Refactor vs Rewrite

| Refactor | Rewrite |
| -------- | ------- |
| Core logic sound | Design is wrong |
| Tests exist | Untestable |
| <30% changes | >70% changes |

## Safe Workflow

Commit → Test → Small change → Test → Commit → Repeat

## Synapses

See [synapses.json](synapses.json) for connections.
