# Bug Report: `alex_docs/` False Positive in Master Alex Auto-Detection

**Date:** 2026-03-04  
**Reported by:** AlexLearn heir project  
**Component:** `platforms/vscode-extension/src/shared/utils.ts` — `isWorkspaceProtected()`  
**Severity:** Medium — blocks legitimate upgrades on all heir projects that have `alex_docs/`  
**Status:** Fix implemented in `utils.ts`, pending build + release

---

## Summary

The `autoProtectMasterAlex` auto-detection logic in `isWorkspaceProtected()` (Layer 2) includes `alex_docs/` as a Master Alex identifier with the comment _"Unique to Master Alex"_. This assumption is false. Heir projects that reference `alex_docs/NORTH-STAR.md` from `copilot-instructions.md` create this folder locally, causing the upgrade command to falsely treat them as Master Alex and block the operation.

---

## Root Cause

**File:** `platforms/vscode-extension/src/shared/utils.ts`, Layer 2 auto-detection block (~line 499)

**Before (broken):**
```typescript
const masterAlexIndicators = [
    path.join(rootPath, 'platforms', 'vscode-extension'),
    path.join(rootPath, 'platforms', 'm365-copilot'),
    path.join(rootPath, 'alex_docs'),  // Unique to Master Alex  ← WRONG
];
```

`alex_docs/` is referenced in `copilot-instructions.md` (`Guidelines: Read alex_docs/NORTH-STAR.md`) and is populated automatically during heir sync. Any heir that has NORTH-STAR.md deployed to `alex_docs/` will have this folder.

The `alex_docs/` folder is **unique to the Master Alex monorepo only** when `alex_docs/` contains the full architecture documentation set (`architecture/`, `skills/SKILLS-CATALOG.md`, etc.). A single-file `alex_docs/NORTH-STAR.md` in a heir is legitimately different but structurally indistinguishable by a path-existence check.

---

## Affected Heirs

Any heir project where `alex_docs/NORTH-STAR.md` has been written to disk, including:

- `AlexLearn` (`c:\Development\AlexLearn\alex_docs\NORTH-STAR.md`) — confirmed false positive on `Alex: Upgrade`
- Any heir that followed the `copilot-instructions.md` `Guidelines:` directive and populated `alex_docs/`

Heirs that only have `platforms/vscode-extension/` or `platforms/m365-copilot/` subdirectories are already correctly protected by layers 0 and 0.5.

---

## Fix Applied

**File:** `platforms/vscode-extension/src/shared/utils.ts`

**After (fixed):**
```typescript
// Check for Master Alex indicators
// NOTE: alex_docs/ is NOT unique to Master Alex — heirs can also have it.
// Only the platforms/ structure reliably identifies the Master Alex monorepo.
const masterAlexIndicators = [
    path.join(rootPath, 'platforms', 'vscode-extension'),
    path.join(rootPath, 'platforms', 'm365-copilot'),
];
```

The `alex_docs` entry has been removed. The remaining two indicators (`platforms/vscode-extension/` and `platforms/m365-copilot/`) are structural hallmarks of the Master Alex monorepo that no heir would naturally acquire.

---

## Protection Layer Analysis — Before and After

| Layer | Check | Status |
|-------|-------|--------|
| 0 — Hardcoded failsafe | Path contains `alex_plug_in` | Correct — not affected |
| 0.5 — Marker file | `MASTER-ALEX-PROTECTED.json` exists | Correct — not affected |
| 1 — Explicit setting | `alex.workspace.protectedMode = true` | Correct — not affected |
| 2 — Auto-detect | `platforms/vscode-extension/` or `platforms/m365-copilot/` | **Fixed** — removed `alex_docs/` |

Master Alex remains protected by layers 0 and 0.5 independently. The removal of `alex_docs` from Layer 2 does not weaken Master Alex protection in any scenario.

---

## Recommended Follow-Up for Release

1. **Build** — rebuild the extension after applying this fix
2. **Test** on a heir project with `alex_docs/` present — confirm `Alex: Upgrade` proceeds without the protection warning
3. **Test** on `AlexMaster` repo — confirm upgrade is still correctly blocked by Layer 0 (path contains `alex_plug_in`)
4. **Consider** making the `alex_docs` auto-detect smarter if needed in the future: check for `alex_docs/architecture/` (a path only Master Alex has) rather than `alex_docs/` alone

---

## Detection Guidance for Future Indicators

When adding a new Master Alex auto-detect indicator, verify the candidate passes this test:

> "Can a standard heir project have this folder/file as a result of normal operation?"

- `platforms/vscode-extension/` — No heir would have this. **Safe.**
- `platforms/m365-copilot/` — No heir would have this. **Safe.**
- `alex_docs/` — Heir can have `alex_docs/NORTH-STAR.md`. **Not safe.**
- `alex_docs/architecture/` — No heir receives the full architecture docs. **Safe if needed.**
- `MASTER-ALEX-PROTECTED.json` — Already Layer 0.5, no heir should have this. **Safe.**
