---
description: "Run Master Alex audit — 22 automated sections + semantic/logic/code/architectural review"
mode: agent
agent: Alex
---

# /masteraudit - Master Alex Project Audit

> **Avatar**: Call `alex_cognitive_state_update` with `state: "reviewing"`. This updates the welcome sidebar avatar.

Run a comprehensive Master Alex audit: automated 22-section checks + semantic consistency review.

## Procedure

### Step 1: Automated Audit
Run the master audit script:

```powershell
.github/muscles/audit-master-alex.ps1
```

### Step 2: Semantic Review
After the script passes, review the four dimensions:

1. **Semantic**: Do copilot-instructions, M365 system prompt, and README all describe Alex the same way?
2. **Logic**: Are documented workflows (heir evolution, meditation, dream) internally consistent?
3. **Code**: Do package.json commands map to real handlers? Do documented tools match MCP identifiers?
4. **Architectural**: Is the memory model (trifecta, working memory, neuroanatomical mapping) consistent across all files?

Use the checklist in the master-alex-audit skill (Semantic Review Checklist section).

### Step 3: Report
Present findings as a structured table with severity ratings (CRITICAL/WARNING/INFO).

## Modes

- `/masteraudit` — Full audit (all 22 sections + semantic review)
- `/masteraudit quick` — Sections 1-9 + abbreviated semantic check
- `/masteraudit semantic` — Skip script, semantic review only

## Start

I'll run a comprehensive Master Alex audit. Which mode would you like?


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: null` to restore default avatar.