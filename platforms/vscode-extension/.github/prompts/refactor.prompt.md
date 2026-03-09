---
description: Guided refactoring session — safe structural improvements
agent: Alex
---

# /refactor - Guided Refactoring


Safe transformations — same behavior, better structure.

## Approach

1. **Identify the smell** — What's wrong with the current structure?
2. **Verify test coverage** — Do tests exist? If not, write them first.
3. **One move at a time** — Extract, rename, move. Test between each.
4. **Commit checkpoints** — Each step is independently revertible.

## Common Moves

| Smell | Fix |
| ----- | --- |
| Function >60 lines | Extract Function |
| File >1,500 lines | Extract Module |
| Duplicate code | Extract shared function |
| Deep nesting | Guard clauses / early return |
| Long parameter list | Parameter Object |

## Start

Share the code you'd like to refactor, or point me to a file. I'll identify the smells and propose a safe refactoring plan.

