# Extension Audit Methodology Instructions

**Auto-loaded when**: Working with VS Code extension development, code quality reviews, technical debt cleanup
**Domain**: 5-dimension audit framework for VS Code extension quality assurance
**Synapses**: [extension-audit-methodology/SKILL.md](..//skills/extension-audit-methodology/SKILL.md)

---

## Purpose

Auto-load systematic audit procedures for VS Code extensions across 5 critical quality dimensions: debug/logging cleanliness, dead code detection, performance optimization, menu validation, and dependency hygiene. Ensures production-ready extension quality before publication.

---

## When This Applies

**File Patterns**:
- `**/src/**/*.ts` — Extension source code
- `**/package.json` — Extension manifest and dependencies
- `**/*.vsix` — Extension packages

**Contextual Triggers**:
- User mentions "extension audit", "code cleanup", "pre-publish"
- Working on VS Code extension projects
- Pre-release quality gate workflows

---

## The 5-Dimension Framework

### Dimension 1: Debug & Logging Audit

**Purpose**: Remove development scaffolding, keep only legitimate logging

**Scan command**:
```powershell
Select-String -Path src -Pattern "console\.(log|warn|error|debug)" -Recurse
```

**Categorization**:

| Category | Keep? | Example |
|----------|-------|---------|
| Debug scaffolding | ❌ Remove | `console.log('hit this code path')` |
| Variable dumps | ❌ Remove | `console.log('userData:', userData)` |
| Error handling | ✅ Keep | `console.error('API failed:', err)` |
| User diagnostics | ✅ Keep | `console.warn('Config invalid, using defaults')` |
| Performance metrics | ✅ Keep | `console.log('Startup: ' + (Date.now() - start) + 'ms')` |

**Decision rule**:
- **Keep**: Error handling, user-facing warnings, performance telemetry
- **Remove**: Development debugging, variable inspection, code path verification

**Target**: <20 legitimate console statements in production code

---

### Dimension 2: Dead Code Detection

**Purpose**: Identify unused commands, features, and unreachable code

**Command extraction**:
```powershell
# Extract all registered commands from package.json
$packageJson = Get-Content package.json | ConvertFrom-Json
$commands = $packageJson.contributes.commands.command
```

**Handler verification**:
```powershell
# For each command, verify handler exists
foreach ($cmd in $commands) {
    Select-String -Path src -Pattern "registerCommand.*$cmd" -Recurse
}
```

**Dead code indicators**:
- Commands in `package.json` with no `registerCommand()` call
- Registered commands never invoked from menus/keybindings
- UI contributions (views, buttons) with missing implementations
- Imports with no references in codebase

**Removal workflow**:
1. Identify orphaned command/feature
2. Search codebase for all references
3. Remove from: `package.json`, source files, documentation
4. Test extension activation (ensure no runtime errors)

---

### Dimension 3: Performance Profiling

**Purpose**: Eliminate blocking synchronous I/O, optimize async operations

**Blocking I/O scan**:
```powershell
# Search for synchronous file system operations
Select-String -Path src -Pattern "fs\.(readFileSync|writeFileSync|existsSync|readdirSync)" -Recurse
```

**Common blocking patterns**:
- `fs.readFileSync()` in command handlers
- `fs.writeFileSync()` during activation
- `fs.existsSync()` in loops or hot paths
- Synchronous child process execution

**Async refactoring**:

```typescript
// ❌ Blocking
import * as fs from 'fs';
const content = fs.readFileSync(filePath, 'utf-8');

// ✅ Non-blocking
import * as fs from 'fs-extra';
const content = await fs.readFile(filePath, 'utf-8');
```

**Performance testing**:
- Measure extension activation time: `Startup: X ms` log
- Profile command latency: timestamp before/after execution
- Monitor dashboard render time for large data sets

**Target**: Zero blocking sync I/O in production paths

---

### Dimension 4: Menu Validation

**Purpose**: Ensure all UI contributions have working implementations

**Test matrix**:

| Contribution Type | Verification |
|-------------------|--------------|
| Commands | Command Palette search → Execute |
| Buttons (`editor/title`) | Open file → Click button → Verify action |
| Context menus | Right-click → Verify menu item → Execute |
| Views (`viewsContainers`) | Open view → Verify rendering |
| Keybindings | Press key combo → Verify command fires |

**Cross-reference workflow**:

1. **Extract commands from package.json**:
```json
"contributes": {
  "commands": [
    {
      "command": "alex.dreamState",
      "title": "Dream (Neural Maintenance)"
    }
  ]
}
```

2. **Verify handler registration**:
```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('alex.dreamState', async () => {
    // Implementation
  })
);
```

3. **Test in VS Code**:
- Command Palette: Search "Dream" → Execute
- Verify expected behavior (no errors)

**Failure modes**:
- Command registered but not in `package.json` → Not discoverable
- Command in `package.json` but not registered → Runtime error when invoked
- Button `when` clause prevents display in expected context

---

### Dimension 5: Dependency Cleanup

**Purpose**: Remove unused packages, reduce extension size

**Installed packages scan**:
```powershell
npm ls --depth=0
```

**Usage verification for każdej dependency**:

```powershell
# Example: Check if '@azure/msal-node' is imported anywhere
Select-String -Path src -Pattern "from '@azure/msal-node'" -Recurse
```

**Removal candidates**:
- Packages with zero import references
- Development dependencies in `dependencies` (should be in `devDependencies`)
- Duplicate packages with overlapping functionality
- Packages for deprecated features

**Removal workflow**:
1. Verify zero usage: `Select-String` across codebase
2. Remove from `package.json`: `npm uninstall <package>`
3. Test extension: `npm run compile` → `F5` debug
4. Verify no runtime errors

**Side benefit**: Reduced `.vsix` package size

---

## Audit Report Template

**Structure**:

```markdown
# Extension Audit Report

**Project**: [Extension Name]
**Version**: [X.Y.Z]
**Date**: [YYYY-MM-DD]
**Auditor**: [Name or "Alex"]

---

## Executive Summary

| Dimension | Current State | Target | Status |
|-----------|---------------|--------|--------|
| Console Statements | X found (Y removable) | <20 | 🟡 |
| Dead Code | Z features | 0 | 🔴 |
| Performance | W blocking ops | 0 | 🟡 |
| Menu Validation | A/B working | 100% | 🟢 |
| Dependencies | C unused | 0 | 🟢 |

**Overall Grade**: [A+/A/A-/B+/B/B-/C]

---

## Detailed Findings

### 1. Debug & Logging

**Total console statements**: X

**Removable** (Y items):
- `src/file.ts:123` — Debug scaffolding: `console.log('checkpoint A')`
- `src/other.ts:456` — Variable dump: `console.log('data:', data)`

**Legitimate** (Z items):
- `src/extension.ts:789` — Error handling: `console.error('Failed to load:', err)`

**Recommendation**: Remove Y debug statements, keep Z legitimate logs.

---

### 2. Dead Code

**Orphaned commands**:
- `alex.oldFeature` — Registered in package.json, no handler found
- `alex.deprecatedSync` — Handler exists, not in package.json (not discoverable)

**Unused features**:
- `generateImageFromSelection` UI button — Implementation removed but UI still in package.json

**Recommendation**: Remove from package.json and codebase.

---

### 3. Performance

**Blocking sync I/O** (W operations):
- `src/dashboard.ts:234` — `fs.readFileSync()` reading large file
- `src/dashboard.ts:567` — `fs.readdirSync()` in loop (10+ iterations)

**Recommendation**: Refactor to async `fs-extra` methods.

---

### 4. Menu Validation

**Command Palette**: A/B commands working (X% success)
- ✅ `alex.dreamState` — Working
- ❌ `alex.brokenCommand` — Runtime error: handler not found

**Editor Buttons**: C/D buttons functional
- ✅ Generate Diagram — Working
- ✅ TTS Read — Working

**Recommendation**: Fix broken commands or remove from package.json.

---

### 5. Dependencies

**Unused packages** (C found):
- `@azure/msal-node` — Zero imports, can remove
- `old-package` — Replaced by newer alternative

**Recommendation**: `npm uninstall` unused packages.

---

## Remediation Plan

| Priority | Dimension | Action | Effort | Impact |
|----------|-----------|--------|--------|--------|
| Critical | Dead Code | Remove 3 orphaned commands | 30m | High |
| High | Performance | Async refactor dashboard I/O | 2h | High |
| High | Logging | Delete 27 debug statements | 1h | Medium |
| Medium | Dependencies | Uninstall 2 unused packages | 15m | Low |

**Total remediation effort**: ~4 hours
**Expected quality improvement**: B+ → A+

---

## Post-Remediation Verification

- [ ] TypeScript compiles: `npm run compile` → 0 errors
- [ ] Extension activates: Install `.vsix` → No activation errors
- [ ] Smoke test: Execute 3 random commands → All working
- [ ] Console clean: Normal operation → Only legitimate logs
- [ ] Performance: Dashboard render <500ms for typical data

```

---

## Success Metrics

**Before Audit** (typical mature extension):
- Console statements: 40-80 (mix of debug + legitimate)
- Dead commands: 3-8 (from feature iterations)
- Blocking sync I/O: 10-30 operations
- Code quality grade: B/B+

**After Remediation**:
- Console statements: 15-25 (legitimate only)
- Dead commands: 0
- Blocking sync I/O: 0 (all async)
- Code quality grade: A/A+

**Improvement**: ~50% console reduction, 100% dead code removal, measurable performance gain

---

## Real-World Application: Alex v5.7.1

**Audit results**:
- Console statements: 46 found → 27 removed (18 kept)
- Dead code: 3 deprecated Gist sync commands + `generateImageFromSelection` + 1 unused dep
- Performance: 16 blocking sync operations in `cognitiveDashboard.ts`
- Menu validation: 39/41 working (95%)

**Remediation**:
1. Removed 27 console statements (kept error handling + diagnostics)
2. Deleted 3 deprecated commands from package.json + source
3. Removed `generateImageFromSelection` UI from 3 locations
4. Refactored dashboard to async I/O (`fs` → `fs-extra`)
5. Uninstalled `@azure/msal-node` (unused)
6. Deleted 477-line obsolete MS Graph docs

**Results**:
- Code quality: B+ → A+
- TypeScript errors: 0
- Extension size: 9.45 MB (optimized)
- Total console removed (2 releases): 61 statements

**Effort**: 8 hours audit + remediation → A+ quality

---

## Integration with Release Process

**Pre-publish checklist**:
- [ ] Run 5-dimension audit
- [ ] Remediate all Critical + High priority issues
- [ ] Update audit report in docs/
- [ ] Verify post-remediation checklist (compile, activate, smoke test)
- [ ] Document changes in CHANGELOG.md
- [ ] Version bump if significant cleanup (consider patch release)

**Cadence**: Run full audit before every minor/major release, abbreviated audit before patches.

---

## Cross-Skill Synergies

**Integrates with**:
- [release-management](release-management.instructions.md) — Pre-publish quality gate
- [code-review](code-review.instructions.md) — Code quality assessment criteria
- [technical-debt-tracking](technical-debt-tracking.instructions.md) — Audit findings become debt items
- [semantic-audit](semantic-audit.instructions.md) — Higher-level architectural consistency check

---

## Auto-Load Behavior

This instruction file auto-loads when:
- Working in VS Code extension projects (`package.json` with `vscode:*` engine)
- Editing source files in `src/**/*.ts`
- User mentions extension audit, code cleanup, or pre-publish workflows
- Pre-release context detected

**Purpose**: Provide systematic quality assurance procedures without manual skill activation.
