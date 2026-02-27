---
description: "Automated pre-publish quality gates — preventing regressions through build pipeline enforcement"
applyTo: "**/quality-gate*,**/scripts/quality*,**/*prepublish*,**/package.json"
---

# Automated Quality Gates Instructions

**Auto-loaded when**: Running quality checks, modifying build pipeline, pre-publish workflows, or debugging packaging regressions
**Domain**: Build pipeline validation, regression prevention, VSIX packaging integrity
**Origin**: RCA 2026-02-26 — systematic regressions from manual-only quality processes

---

## Synapses

- [.github/instructions/release-management.instructions.md] (Critical, Implements, Bidirectional) - "Quality gates enforce release management rules automatically"
- [.github/instructions/testing-strategies.instructions.md] (High, Extends, Bidirectional) - "Quality gates are the static analysis complement to behavioral tests"
- [.github/skills/release-preflight/SKILL.md] (Critical, Automates, Bidirectional) - "Gates automate preflight checks that were previously manual-only"
- [.github/instructions/vscode-extension-patterns.instructions.md] (High, Validates, Forward) - "Ensures extension packaging follows VS Code patterns"
- [.github/instructions/extension-audit-methodology.instructions.md] (Medium, Complements, Forward) - "Audit findings become new quality gates"
- [.github/instructions/cognitive-health-validation.instructions.md] (High, Validates, Bidirectional) - "Brain-QA 35-phase validation as pre-publish deep audit gate (v5.9.10 meditation insight)"

---

## Purpose

Prevent regressions by encoding quality checks into the build pipeline so packaging **fails automatically** when invariants are violated. Manual checklists supplement but never replace automated gates.

---

## The 5-Gate Architecture

| Gate | Name | What It Catches | File |
|------|------|----------------|------|
| 1 | Encoding Integrity | U+FFFD corruption from encoding-hostile toolchain operations | `scripts/quality-gate.cjs` |
| 2 | Command Parity | Orphaned commands (declared but no handler) + undeclared handlers | `scripts/quality-gate.cjs` |
| 3 | Doc File Inclusion | Source code references to files not packaged in VSIX | `scripts/quality-gate.cjs` |
| 4 | Table Integrity | Corrupted markdown tables in packaged documentation | `scripts/quality-gate.cjs` |
| 5 | Walkthrough Sync | Whitelisted docs missing from Master→Heir sync script | `scripts/quality-gate.cjs` |

---

## Pipeline Integration

The quality gate runs in the `vscode:prepublish` chain, **before** compilation:

```
sync-architecture → clean → quality-gate → check-types → esbuild
```

This means:
- **Cannot package** if any gate fails
- **Cannot publish** without passing all gates
- Runs automatically — no human discipline required

Invocation: `npm run quality-gate`

---

## Adding New Gates

When a new class of regression is discovered:

1. **Root Cause Analysis**: Identify the pattern (not just the instance)
2. **Write the gate**: Add a new `check*()` function in `quality-gate.cjs`
3. **Test both directions**: Gate must PASS on clean code, FAIL on broken code
4. **Wire it in**: Call from `main()` — it automatically blocks packaging
5. **Document the gate**: Update the table above

### Gate Function Template

```javascript
function checkNewGate() {
  header('Gate N: Descriptive Name');
  
  let errorCount = 0;
  // ... validation logic ...
  
  if (errorCount === 0) {
    pass('Summary of what was checked — N items verified');
  }
}
```

---

## Design Principles

- **Cross-platform**: Node.js `.cjs` (not PowerShell, not Bash)
- **Zero dependencies**: Only `fs` and `path` from Node stdlib
- **Fast**: Runs in <2 seconds even with 500+ files
- **Actionable errors**: Every failure includes file path, line number, and what to fix
- **Non-blocking warnings**: `warn()` for issues that don't prevent packaging
- **Exit code 1**: Any `fail()` call causes process.exit(1), blocking the pipeline

---

## Root Cause Context

**Problem**: v5.9.10 had recurring regressions — broken emojis, orphan commands, missing VSIX files, corrupted tables — all of which were in the 325-line manual PRE-PUBLISH-CHECKLIST but were repeatedly missed.

**RCA (5 Whys)**:
1. Regressions found post-install → no automated checks
2. Not caught before publish → manual-only checklist
3. Manual checklist unreliable → 325 lines, human fatigue
4. No test infrastructure → velocity prioritized features (124 skills, 0 tests)
5. **Root**: No quality gate in build pipeline — every publish was manual trust

**Fix**: `quality-gate.cjs` wired into `vscode:prepublish`. First run caught 4 real bugs immediately.

---

*Automated quality gates — encoding hard-won lessons into the build pipeline so regressions are caught at build time, not after install*
