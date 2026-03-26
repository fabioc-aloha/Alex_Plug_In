---
description: "VS Code extension audit methodology for code quality reviews and technical debt cleanup"
inheritance: master-only
applyTo: "**/*audit*,**/scripts/audit*"
---

# Extension Audit Methodology — Auto-Loaded Rules

Dimensions 1-5 (debug/logging, dead code, performance, menus, dependencies), scan commands, report template → see extension-audit-methodology skill.

## Dimension 6: Configuration & Manifest Validation

Unique to this instruction — prevents silent runtime failures from unregistered configuration keys.

**Automated**: `.\scripts\validate-manifest.ps1`

**Manual cross-reference**:

```powershell
# Find all config.update() calls
Select-String -Path src -Pattern "getConfiguration.*\.update\(" -Recurse
# Find all registerCommand() calls
Select-String -Path src -Pattern "registerCommand\(['\"]alex\." -Recurse
```

Each updated key must exist in `package.json` `configuration.properties` OR be wrapped in try-catch.
Each `registerCommand()` must match `contributes.commands` and vice versa.

**Common failure patterns**:

| Pattern | Symptom | Fix |
|---------|---------|-----|
| Dynamic config keys (tracking) | Unable to write to User Settings | Wrap in try-catch |
| Command registered not declared | Hidden from Command Palette | Add to `package.json` |
| Command declared not implemented | Runtime error on invoke | Implement or remove |
| Config read without default | `undefined` value | Always provide fallback |

**Decision — Register or Try-Catch?**

- User-facing settings, critical config (paths, API keys) → Register in `package.json`
- Dynamic keys (analytics, counters, user tracking) → Try-catch with `console.log`
- If unsure → Register (better UX)

**Graceful degradation pattern** (non-critical features):

```typescript
try {
  await vscode.workspace.getConfiguration('alex.dynamic')
    .update(key, value, ConfigurationTarget.Global);
} catch (error) {
  console.log(`[Alex] Skipping feature tracking: ${error}`);
}
```

See also: vscode-configuration-validation skill for deeper coverage.

---

### 5. Dependencies

**Unused packages** (C found):
- `@azure/msal-node` — Zero imports, can remove
- `old-package` — Replaced by newer alternative

**Recommendation**: `npm uninstall` unused packages.

---

### 6. Configuration & Manifest

**Unregistered config updates** (D mismatches):
- `alex.skillRecommendations.*.accepted` — Dynamic key, needs try-catch
- `alex.custom.setting` — Used but not in package.json

**Unregistered commands**:
- `alex.hiddenCommand` — Registered but not declared (not discoverable)

**Recommendation**: Add to package.json or wrap in try-catch for dynamic keys. Run `scripts/validate-manifest.ps1`.

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

## Real-World Application: Alex v5.7.1 + v5.7.5

**v5.7.1 Audit results**:
- Console statements: 46 found → 27 removed (18 kept)
- Dead code: 3 deprecated Gist sync commands + `generateImageFromSelection` + 1 unused dep
- Performance: 16 blocking sync operations in `cognitiveDashboard.ts`
- Menu validation: 39/41 working (95%)

**v5.7.1 Remediation**:
1. Removed 27 console statements (kept error handling + diagnostics)
2. Deleted 3 deprecated commands from package.json + source
3. Removed `generateImageFromSelection` UI from 3 locations
4. Refactored dashboard to async I/O (`fs` → `fs-extra`)
5. Uninstalled `@azure/msal-node` (unused)
6. Deleted 477-line obsolete MS Graph docs

**v5.7.5 Configuration Validation** (New Dimension):
- Found: Skill recommendations tracking writing to unregistered `alex.skillRecommendations.*` keys
- Impact: Quick Actions buttons completely non-functional (silent failure)
- Root cause: Dynamic config keys for user preference tracking
- Fix: Wrapped in try-catch with graceful degradation
- Created: `validate-manifest.ps1` + `vscode-configuration-validation/SKILL.md`

**Cumulative Results**:
- Code quality: B+ → A+
- TypeScript errors: 0
- Extension size: 9.51 MB (optimized)
- Total console removed (2 releases): 61 statements
- Configuration errors: 1 critical → 0

**Effort**: 8 hours audit + remediation → A+ quality

---

## Integration with Release Process

**Pre-publish checklist**:
- [ ] Run 6-dimension audit (or use `scripts/validate-manifest.ps1`)
- [ ] Remediate all Critical + High priority issues
- [ ] Update audit report in docs/
- [ ] Verify post-remediation checklist (compile, activate, smoke test)
- [ ] Document changes in CHANGELOG.md
- [ ] Version bump if significant cleanup (consider patch release)

**Cadence**: Run full audit before every minor/major release, abbreviated audit + manifest validation before patches.

---

## Cross-Skill Synergies

**Integrates with**:
- [release-management](release-management.instructions.md) — Pre-publish quality gate
- [code-review](code-review-guidelines.instructions.md) — Code quality assessment criteria
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
