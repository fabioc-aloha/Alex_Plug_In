---
title: "RCA: Code-Fence Wrapping Bug in Trifecta Files"
status: "Resolved (symptom) | Open (root cause)"
date: "2026-03-02"
author: "@Alex"
incident: "visual-memory trifecta creation — commit bab0a5f"
severity: "High — SKILL.md, .instructions.md, .prompt.md all non-functional until manually fixed"
effort: "~30 min manual repair + re-sync to 5 heirs per incident"
---

# RCA: Code-Fence Wrapping Bug in Trifecta Files

> **If you fixed it but it came back, you fixed a symptom.**

## Incident Summary

When creating the `visual-memory` trifecta on 2026-03-01, all three core files —
`SKILL.md`, `visual-memory.instructions.md`, and `visual-memory.prompt.md` — were
committed with their entire content wrapped in a code fence:

```
```skill          ← wrapping fence (wrong)
---
name: "visual-memory"
...
```              ← closing fence (wrong)
```

VS Code could not parse the frontmatter, instructions files would not load, and the
prompt command would not register. The fix required a second commit + re-sync to all
5 heirs.

This is a **recurring incident** — the GI insight
`GI-skill-md-fence-bug-files-start-with-yaml-2026-02-15.md` documents an earlier
occurrence on 2026-02-15. A repair muscle (`fix-fence-bug.ps1`) was written but
never wired into automated enforcement.

---

## Timeline

| Time       | Event                                                                     |
| ---------- | ------------------------------------------------------------------------- |
| 2026-02-15 | First occurrence. GI insight created. `fix-fence-bug.ps1` muscle written  |
| 2026-03-01 | Visual-memory trifecta created via `create_file`. All 3 files fenced      |
| 2026-03-01 | Files committed as `bab0a5f` (29 files). Bug deployed to all 5 heirs      |
| 2026-03-02 | User spotted the bug. Manual fence stripping + re-sync + commit `c530b1a` |
| 2026-03-02 | **This RCA created**                                                      |

---

## 5 Whys

| #   | Question                                         | Answer                                                                                          |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | Why were the files non-functional?               | Their content was wrapped in a ` ```type ` code fence, so frontmatter could not be parsed       |
| 2   | Why were the files wrapped in a fence?           | The LLM generating the trifecta files treated them as "code to display" rather than raw content |
| 3   | Why did the LLM add the fence?                   | No active instruction at generation time prohibited wrapping `.md` file content in code fences  |
| 4   | Why was there no prevention instruction?         | The GI insight encoding this rule was never promoted into an auto-loaded `.instructions.md`     |
| 5   | Why wasn't the repair muscle triggered?          | `fix-fence-bug.ps1` is a manual-only tool — no hook automatically runs it after `create_file`   |
| 5b  | Why didn't the pre-commit hook block the commit? | The hook only checks `SKILL.md` frontmatter — `.instructions.md` and `.prompt.md` have no check |

**Root Cause**: Process gap — the knowledge about this bug (GI insight) and the
repair tooling (`fix-fence-bug.ps1`) both exist, but neither is connected to an
automated enforcement path. The fence can be written, committed, and deployed to
all heirs before anyone notices.

---

## Cause Category

| Category    | Factor                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| **Process** | GI insight → muscle written → enforcement never wired in (gap)                     |
| **Process** | Pre-commit hook only covers SKILL.md frontmatter, not the other two trifecta files |
| **Process** | No PostToolUse auto-fix for `create_file` targeting `.md` trifecta files           |

---

## Impact

| Dimension       | Detail                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| Files affected  | 3 per incident (SKILL.md, .instructions.md, .prompt.md)                 |
| Heirs affected  | 5 repos synced with broken files before detection                       |
| VS Code impact  | Instruction not loaded, prompt command missing, skill broken            |
| Repair time     | ~30 min manual fix + re-sync + 3 commits (Master, AlexLearn, AlexBooks) |
| Detection point | Human review (post-commit) — no automated detection caught it           |

---

## Fix the Symptom (Done)

Strip the wrapping fence from all three files using the existing muscle:

```powershell
pwsh -File .github/muscles/fix-fence-bug.ps1 -Fix
```

Then re-sync to all heirs and commit.

---

## Fix the Root Cause (Required)

Three complementary layers — in order of proximity to the problem:

### Layer 1 — Prevent: LLM Instruction (Highest Impact)

Add an explicit prohibition to the skill-building instructions so the LLM never
generates fenced content when writing trifecta files.

**File**: `.github/instructions/skill-building.instructions.md`

Add to the "File Creation Rules" section:

```markdown
## CRITICAL: Never Wrap Trifecta File Content in Code Fences

When creating or editing SKILL.md, .instructions.md, .prompt.md, or synapses.json:

- ❌ NEVER wrap the file content in a code fence (```skill, ```instructions, etc.)
- ✅ The file must start directly with `---` (YAML frontmatter) or `{` (JSON)
- The file content IS the code — not a code block to display

If you use `create_file` with content that starts with `---`, do NOT add a
wrapping ` ``` ` around it. The tool writes raw bytes to disk.
```

### Layer 2 — Detect Early: PostToolUse Hook Auto-Fix

Wire `fix-fence-bug.ps1` into the PostToolUse hook so that any `.md` file written
by `create_file` is scanned and auto-corrected immediately, before the session ends.

**File**: `.github/muscles/hooks/post-tool-use.js`

Add after the existing telemetry logging:

```javascript
// ── Auto-fix fence bug on create_file ─────────────────────────────────────
const isCreateFile = toolName === 'create_file';
if (isCreateFile && toolSuccess) {
  const filePath = process.env.VSCODE_TOOL_ARG_FILEPATH || '';
  if (/\.(md)$/.test(filePath)) {
    const { execSync } = require('child_process');
    try {
      execSync(
        `pwsh -NoProfile -File "${workspaceRoot}/.github/muscles/fix-fence-bug.ps1" -Fix -Path "${filePath}"`,
        { cwd: workspaceRoot, stdio: 'ignore' }
      );
    } catch {
      // Silent — PostToolUse must never fail the tool call
    }
  }
}
```

> **Note**: Verify the env var name for the file path against the VS Code 1.109+
> PostToolUse hook specification. `VSCODE_TOOL_ARG_FILEPATH` is likely but may
> need adjustment.

### Layer 3 — Fail-Safe: Pre-Commit Hook Coverage

Extend the existing pre-commit check to cover all three trifecta file types, not
just SKILL.md.

**File**: `.github/hooks/pre-commit.ps1`

After the existing SKILL.md frontmatter check, add:

```powershell
# ============================================================
# CHECK 1b: .instructions.md and .prompt.md frontmatter
# ============================================================
$changedInstructionFiles = $stagedFiles | Where-Object { $_ -match '\.instructions\.md$' }
$changedPromptFiles       = $stagedFiles | Where-Object { $_ -match '\.prompt\.md$' }

foreach ($file in ($changedInstructionFiles + $changedPromptFiles)) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match '^```') {
            $errors += "${file}: Wrapped in code fence — run fix-fence-bug.ps1 -Fix -Path ${file}"
        }
        elseif ($content -notmatch '^---\s*\r?\n') {
            $errors += "${file}: Missing YAML frontmatter (must start with ---)"
        }
    }
}
```

---

## Prioritization

| Layer   | Effort | Coverage                        | Recommended? |
| ------- | ------ | ------------------------------- | ------------ |
| Layer 1 | 5 min  | Prevents generation entirely    | ✅ Do first   |
| Layer 2 | 30 min | Auto-corrects at creation time  | ✅ Do second  |
| Layer 3 | 10 min | Blocks commit if bug slips past | ✅ Do third   |

All three layers together create defense-in-depth: **prevent → auto-correct → block**.

---

## Verification

After implementing, test each layer:

```powershell
# Layer 3 — trigger pre-commit with a fenced instructions file
echo '```instructions`n---`ndescription: test`n---`n```' > test-fence.instructions.md
git add test-fence.instructions.md
git commit -m "test"
# Expected: BLOCKED with "Wrapped in code fence" error
git rm --cached test-fence.instructions.md; Remove-Item test-fence.instructions.md
```

For Layer 2, create a file via `create_file` tool and verify the resulting file
starts with `---`, not ` ``` `.

---

## Related

- `.github/muscles/fix-fence-bug.ps1` — repair tool (manual)
- `~/.alex/global-knowledge/insights/GI-skill-md-fence-bug-files-start-with-yaml-2026-02-15.md` — GI insight
- `.github/hooks/pre-commit.ps1` — current quality gate (SKILL.md only)
- `.github/muscles/hooks/post-tool-use.js` — PostToolUse hook (telemetry only)
- `.github/instructions/skill-building.instructions.md` — LLM skill creation rules
