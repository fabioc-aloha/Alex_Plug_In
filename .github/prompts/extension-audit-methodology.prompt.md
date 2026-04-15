---
sem: 1
description: Systematic 5-dimension quality audit for VS Code extensions: debug cleanliness, dead code, performance, menus, and dependencies
application: "When requesting architecture health checks, quality audits, or validation"
inheritance: master-only
---

# Extension Audit Workflow

**Invoke with**: `/extension-audit-methodology` or "audit extension quality"
**Domain**: Systematic 5-dimension quality assurance for VS Code extensions
**Synapses**: [extension-audit-methodology/SKILL.md](../skills/extension-audit-methodology/SKILL.md)

---

## Workflow Overview

This guided workflow executes a comprehensive quality audit across 5 critical dimensions: debug/logging cleanliness, dead code detection, performance optimization, menu validation, and dependency hygiene. Use before every release to ensure production-ready extension quality.

**Duration**: 2-3 hours (audit + remediation)
**Outcome**: Detailed audit report with prioritized remediation plan
**Grade improvement**: Typically B/B+ → A/A+

---

## Phase 1: Preparation

### Step 1: Baseline Assessment

**Gather current state**:

```
Extension Name: __________________
Current Version: __________________
Release Target: __________________ (e.g., v5.8.0)
Last Audit Date: __________________ (or "Never")
```

**Set expectations**:

- [ ] TypeScript compiles without errors (`npm run compile`)
- [ ] Extension activates in debug mode (F5)
- [ ] Basic functionality verified (smoke test 2-3 commands)

**If any baseline checks fail**: Fix compilation/activation errors BEFORE proceeding with audit.

### Step 2: Create Audit Context

**Set up audit workspace**:

```bash
# Create audit documentation folder (if doesn't exist)
mkdir -p .github/episodic/audits

# Create timestamped audit report
$date = Get-Date -Format "yyyy-MM-dd"
New-Item ".github/episodic/audits/audit-report-$date.md" -ItemType File
```

**Report template**: Use structure from [extension-audit-methodology/SKILL.md](../skills/extension-audit-methodology/SKILL.md)

---

## Phase 2: Dimension 1 — Debug & Logging Audit

### Step 3: Scan Console Statements

**Execute scan**:

```powershell
Select-String -Path src -Pattern "console\.(log|warn|error|debug)" -Recurse |
  Select-Object Path, LineNumber, Line
```

**Record findings**:

```
Total console statements found: ____

Categorized:
- Debug scaffolding (removable): ____
- Variable dumps (removable): ____
- Error handling (keep): ____
- User diagnostics (keep): ____
- Performance metrics (keep): ____
```

### Step 4: Categorize Each Statement

**For each console statement**:

| File:Line            | Statement                           | Category       | Action |
| -------------------- | ----------------------------------- | -------------- | ------ |
| src/extension.ts:123 | `console.log('activated')`          | Debug          | Remove |
| src/api.ts:456       | `console.error('API failed:', err)` | Error handling | Keep   |

**Decision criteria**:

- **Remove**: Development debugging, "checkpoint" logs, variable inspection
- **Keep**: Error reporting, user-facing warnings, performance telemetry

**Target**: <20 legitimate console statements remaining

---

## Phase 3: Dimension 2 — Dead Code Detection

### Step 5: Extract Registered Commands

**From package.json**:

```powershell
$packageJson = Get-Content package.json | ConvertFrom-Json
$commands = $packageJson.contributes.commands | ForEach-Object { $_.command }

Write-Output "Total commands in package.json: $($commands.Count)"
$commands
```

**List all commands**: ********\_\_\_\_********

### Step 6: Verify Command Handlers

**For each command, search for handler**:

```powershell
foreach ($cmd in $commands) {
    $found = Select-String -Path src -Pattern "registerCommand.*['`"]$cmd['`"]" -Recurse
    if (-not $found) {
        Write-Warning "⚠️ No handler found for: $cmd"
    }
}
```

**Dead commands** (in package.json without handlers):

- ***
- ***

**Ghost commands** (handlers without package.json entry):

```powershell
Select-String -Path src -Pattern "registerCommand\(" -Recurse |
  ForEach-Object { $_.Line -match "registerCommand\(['`"](.+?)['`"]" }
```

### Step 7: Identify Unused Features

**UI contributions without implementation**:

- Check `package.json` → `contributes.menus`
- Verify each `command` has a working handler
- Test buttons/context menus in VS Code

**Dead feature checklist**:

- [ ] Commands in manifest without handlers
- [ ] Handlers without manifest entries
- [ ] UI buttons with missing implementations
- [ ] Menu items that produce runtime errors

---

## Phase 4: Dimension 3 — Performance Profiling

### Step 8: Scan Blocking I/O

**Search for synchronous file operations**:

```powershell
$blockingOps = Select-String -Path src -Pattern "fs\.(readFileSync|writeFileSync|existsSync|readdirSync|statSync)" -Recurse
Write-Output "Blocking sync I/O operations found: $($blockingOps.Count)"
$blockingOps | Select-Object Path, LineNumber, Line
```

**Record findings**:

```
Total blocking operations: ____

By type:
- readFileSync: ____
- writeFileSync: ____
- existsSync: ____
- readdirSync: ____
- statSync: ____
```

### Step 9: Plan Async Refactoring

**For each blocking operation**:

| File:Line        | Current Code            | Async Replacement           | Effort |
| ---------------- | ----------------------- | --------------------------- | ------ |
| dashboard.ts:234 | `fs.readFileSync(path)` | `await fs.readFile(path)`   | 15m    |
| utils.ts:567     | `fs.existsSync(file)`   | `await fs.pathExists(file)` | 10m    |

**Refactoring pattern**:

```typescript
// ❌ Before (blocking)
import * as fs from "fs";
const data = fs.readFileSync(path, "utf-8");

// ✅ After (non-blocking)
import * as fs from "fs-extra";
const data = await fs.readFile(path, "utf-8");
```

**Total refactoring effort**: \_\_\_\_ hours

---

## Phase 5: Dimension 4 — Menu Validation

### Step 10: Test Command Palette

**Manual verification**:

1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Search for each extension command
3. Execute and verify behavior

**Test matrix**:

| Command         | Title                      | Discoverable? | Executes? | Notes         |
| --------------- | -------------------------- | ------------- | --------- | ------------- |
| alex.dreamState | Dream (Neural Maintenance) | ✅            | ✅        | Working       |
| alex.oldFeature | Old Feature                | ✅            | ❌        | Runtime error |

**Pass rate**: \_**\_ / \_\_** commands working (\_\_\_%)

### Step 11: Test Editor Buttons

**UI contributions in package.json**:

```json
"menus": {
  "editor/title": [
    {
      "command": "alex.generateDiagram",
      "when": "editorLangId == markdown",
      "group": "navigation"
    }
  ]
}
```

**Manual test**:

1. Open file matching `when` condition
2. Verify button appears in editor title bar
3. Click button
4. Verify expected behavior

**Button test checklist**:

- [ ] Button visible in expected context
- [ ] Icon renders correctly
- [ ] Command executes without error
- [ ] Action produces expected result

---

## Phase 6: Dimension 5 — Dependency Cleanup

### Step 12: List Installed Packages

**Execute**:

```powershell
npm ls --depth=0
```

**Record all dependencies**: ********\_\_\_\_********

### Step 13: Verify Package Usage

**For each dependency, search imports**:

```powershell
$packages = @('replicate', '@azure/msal-node', 'fs-extra', 'marked')

foreach ($pkg in $packages) {
    $imports = Select-String -Path src -Pattern "from ['`"]$pkg" -Recurse
    if ($imports.Count -eq 0) {
        Write-Warning "⚠️ Unused package: $pkg"
    } else {
        Write-Output "✅ $pkg used ($($imports.Count) imports)"
    }
}
```

**Unused packages found**:

- ***
- ***

### Step 14: Remove Unused Dependencies

**Uninstall workflow**:

```powershell
# Example: Remove unused package
npm uninstall @azure/msal-node

# Verify extension still compiles
npm run compile

# Test extension activation (F5 debug)
```

**Removal checklist**:

- [ ] Package removed from `package.json`
- [ ] `node_modules` updated
- [ ] Extension compiles without errors
- [ ] Extension activates without errors
- [ ] Basic functionality verified (smoke test)

---

## Phase 7: Remediation Planning

### Step 15: Prioritize Findings

**Create remediation plan**:

| Priority | Dimension    | Issue               | Action                   | Effort | Impact |
| -------- | ------------ | ------------------- | ------------------------ | ------ | ------ |
| Critical | Dead Code    | 3 orphaned commands | Remove from package.json | 30m    | High   |
| High     | Performance  | 16 blocking I/O ops | Async refactor           | 2h     | High   |
| High     | Logging      | 27 debug statements | Delete removable logs    | 1h     | Medium |
| Medium   | Dependencies | 2 unused packages   | Uninstall                | 15m    | Low    |

**Total estimated effort**: \_\_\_\_ hours

**Priority levels**:

- **Critical**: Broken functionality, runtime errors
- **High**: Performance issues, significant code smell
- **Medium**: Code cleanliness, optimization opportunities
- **Low**: Nice-to-have improvements

### Step 16: Create Audit Report

**Document findings** in `.github/episodic/audits/audit-report-YYYY-MM-DD.md`:

```markdown
# Extension Audit Report

**Extension**: [Name]
**Version**: [X.Y.Z]
**Date**: [YYYY-MM-DD]

## Executive Summary

| Dimension       | Current           | Target | Status |
| --------------- | ----------------- | ------ | ------ |
| Console         | 46 (27 removable) | <20    | 🟡     |
| Dead Code       | 4 items           | 0      | 🔴     |
| Performance     | 16 blocking ops   | 0      | 🟡     |
| Menu Validation | 39/41 (95%)       | 100%   | 🟢     |
| Dependencies    | 2 unused          | 0      | 🟢     |

**Overall Grade**: B+

[Detailed findings sections...]

## Remediation Plan

[Prioritized action table...]
```

---

## Phase 8: Remediation Execution

### Step 17: Execute High-Priority Items

**Work through remediation plan systematically**:

**Example: Remove dead commands**

1. Delete command from `package.json` → `contributes.commands`
2. Remove handler from source code (if exists)
3. Search for references: `Select-String -Pattern "alex.oldCommand"`
4. Delete all references (imports, calls, documentation)
5. Test: `npm run compile` → `F5` debug

**Example: Async refactor**

1. Replace `import * as fs from 'fs'` → `import * as fs from 'fs-extra'`
2. Change `fs.readFileSync()` → `await fs.readFile()`
3. Ensure function is `async`
4. Test functionality
5. Verify performance improvement

### Step 18: Post-Remediation Verification

**Verification checklist**:

- [ ] **TypeScript compiles**: `npm run compile` → 0 errors
- [ ] **Extension activates**: Install `.vsix` → No activation errors
- [ ] **Smoke test**: Execute 3-5 random commands → All working
- [ ] **Console clean**: Normal operation → Only legitimate logs
- [ ] **Performance**: Dashboard renders <500ms for typical data
- [ ] **No regressions**: Test critical workflows (meditation, dream state, etc.)

**If any verification fails**: Rollback change, investigate, fix, re-verify.

---

## Phase 9: Documentation

### Step 19: Update Changelog

**Add audit entry to CHANGELOG.md**:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Quality Improvements

- Removed 27 debug console statements (kept 18 legitimate logs)
- Deleted 3 deprecated Gist sync commands
- Removed `generateImageFromSelection` UI and implementation
- Refactored dashboard to async I/O (16 blocking operations → 0)
- Uninstalled 2 unused dependencies
- Code quality grade: B+ → A+

### Performance

- Dashboard render time improved ~30% (async file operations)
- Extension activation unchanged (clean activation already optimized)
```

### Step 20: Archive Audit Report

**Finalize documentation**:

1. Complete audit report with all findings
2. Save in `.github/episodic/audits/audit-report-YYYY-MM-DD.md`
3. Update `.github/episodic/audits/README.md` with audit summary
4. Commit audit report: `git commit -m "docs: extension audit YYYY-MM-DD — B+ to A+ quality improvement"`

**Audit archive structure**:

```
.github/episodic/audits/
  README.md                    (index of all audits)
  audit-report-2026-02-15.md   (detailed findings)
  audit-report-2026-01-10.md   (previous audit)
```

---

## Completion Checklist

- [ ] Baseline assessment passed (compiles, activates, basic function)
- [ ] Dimension 1: Console statements scanned and categorized
- [ ] Dimension 2: Dead code identified (commands, features, UI)
- [ ] Dimension 3: Blocking I/O profiled
- [ ] Dimension 4: Menu validation completed (Command Palette, buttons)
- [ ] Dimension 5: Dependency usage verified
- [ ] Audit report created with findings
- [ ] Remediation plan prioritized (Critical → High → Medium → Low)
- [ ] High-priority items remediated
- [ ] Post-remediation verification passed (all 6 checks)
- [ ] CHANGELOG.md updated
- [ ] Audit report archived in .github/episodic/audits/
- [ ] Changes committed to version control

**Extension quality grade post-audit**: \_\_\_\_

**Ready for release!** Your extension has been systematically audited and optimized for production quality.

---

## Success Metrics

**Typical improvements**:

- Console statements: 40-80 → 15-25 (50% reduction)
- Dead code: 3-8 items → 0 (100% removal)
- Blocking I/O: 10-30 ops → 0 (100% async)
- Menu coverage: 85-95% → 100% (fix broken commands)
- Code quality: B/B+ → A/A+

**Real-world validation** (Alex v5.7.1):

- 8 hours total effort (audit + remediation)
- B+ → A+ quality improvement
- 61 console statements removed (across 2 releases)
- 4 dead features removed
- 16 blocking operations refactored to async
- Extension size optimized to 9.45 MB

---

## Post-Audit Notes

**Audit cadence**:

- **Full 5-dimension audit**: Before every minor/major release
- **Abbreviated audit** (Dimensions 1-2): Before patch releases
- **Continuous monitoring**: Address findings incrementally during development

**Long-term benefits**:

- Cleaner codebase → easier maintenance
- Better performance → improved user experience
- No dead code → reduced confusion for contributors
- Dependency hygiene → smaller package size, fewer vulnerabilities
