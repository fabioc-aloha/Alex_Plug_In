---
description: "Safe refactoring procedure — same behavior, better structure"
applyTo: "**/*refactor*,**/*extract*,**/*rename*,**/*inline*,**/*monolith*"
---

# Refactoring Procedure

## Prerequisites

Before refactoring, confirm:
1. Tests exist for the code being changed (or write them first)
2. All tests pass in the current state
3. You have a clear goal: readability, testability, or reducing function/file size

## Safe Refactoring Workflow

### Step 1: Commit Current State

Create a clean checkpoint before any changes.

### Step 2: Identify the Smell

| Smell | Target Refactoring |
| ----- | ------------------ |
| Function >60 lines | Extract Function |
| File >1,500 lines | Extract Module |
| Long parameter list | Parameter Object |
| Duplicate code blocks | Extract shared function |
| Feature envy | Move Function to owning module |
| Deep nesting (>3 levels) | Early return / guard clauses |

### Step 3: Apply One Move at a Time

1. Make ONE structural change
2. Run tests — must pass
3. Commit with descriptive message (`refactor: extract X from Y`)
4. Repeat

### Step 4: Verify Behavior Preservation

- Run full test suite
- Manually spot-check affected functionality
- Compare exports: same public API before and after

## File Decomposition (for monoliths)

When breaking a large file (>1,500 lines):

1. Map the file's responsibilities (list distinct concerns)
2. Group related functions into candidate modules
3. Extract one module at a time:
   - Create new file with moved functions
   - Update imports in the original file
   - Re-export from original if needed for backward compatibility
   - Run tests after each extraction
4. Repeat until original file is under target size

## Decision: Refactor vs Rewrite

| Refactor | Rewrite |
| -------- | ------- |
| Core logic is sound | Fundamental design is wrong |
| Tests exist | Code is untestable |
| <30% of file changes | >70% of file changes |
| Incremental delivery possible | Clean break is cleaner |
