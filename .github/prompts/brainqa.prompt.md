---
description: "Run brain QA — structural script + semantic/logic/code/architectural review"
mode: agent
agent: Alex
---

# /brainqa - Cognitive Architecture QA

Run a full brain QA session: automated structural validation + manual semantic review.

## Procedure

### Step 1: Automated Validation
Run the brain-qa script and report results:

```powershell
.github/muscles/brain-qa.ps1 -Mode all
```

### Step 2: Semantic Review
After the script passes, check the four dimensions:

1. **Semantic**: Do all documents use the same terms for the same concepts?
2. **Logic**: Do documented processes work if followed step by step?
3. **Code**: Does TypeScript behavior match documentation claims?
4. **Architectural**: Is the memory model described consistently everywhere?

Use the checklist in the brain-qa skill (Semantic Review Checklist section).

### Step 3: Report
Present findings as a structured table with severity ratings (CRITICAL/WARNING/INFO).

## Modes

- `/brainqa` — Full audit (script + semantic review)
- `/brainqa quick` — Script quick mode + abbreviated semantic check
- `/brainqa semantic` — Skip script, semantic review only
- `/brainqa sync` — Sync validation + cross-heir meaning alignment

## Start

I'll run a full brain QA session. Which mode would you like?
