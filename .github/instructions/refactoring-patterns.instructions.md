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

## Webview Decomposition (proven March 2026)

When breaking a large webview HTML generator (e.g., `welcomeViewHtml.ts`):

### Tab Content Extraction

1. Create one module per tab: `{tabName}TabHtml.ts`
2. Each exports a single function returning an HTML string
3. The orchestrator calls all tab functions and assembles the shell
4. Tab-specific CSS and client JS move with the tab

### CSS-in-Template Extraction

When a webview has a large inline `<style>` block:

1. **Count interpolations** — scan for `${...}` inside the CSS. Fewer = cleaner extraction.
2. **Create `sharedStyles.ts`** — export a function that takes interpolation values as parameters and returns the CSS string
3. **Replace inline CSS** — `<style>${getSharedStyles(personaAccent)}</style>`
4. **Note**: The extracted file will be large (pure CSS) but has zero logic complexity. It's a stylesheet, not code — NASA R4 / function-length rules don't apply.

### Client-Side JS Extraction

Client-side `<script>` blocks can be extracted the same way if they grow large. The function takes `nonce` and any data parameters and returns the JS string.

### Priority Order for Monolithic Webviews

1. **Tab content** (highest leverage — each tab becomes independently maintainable)
2. **CSS** (highest line reduction — often 50%+ of file size)
3. **Client JS** (only if >200 lines)
4. **Shared utilities** (formatTime, escapeHtml, action helpers)

## Decision: Refactor vs Rewrite

| Refactor | Rewrite |
| -------- | ------- |
| Core logic is sound | Fundamental design is wrong |
| Tests exist | Code is untestable |
| <30% of file changes | >70% of file changes |
| Incremental delivery possible | Clean break is cleaner |
