---
description: "VS Code extension audit methodology for code quality reviews and technical debt cleanup"
application: "During code reviews, quality audits, or when assessing extension audit methodology"
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

Dimensions 1-5, remediation templates, success metrics, historical audit results → see extension-audit-methodology skill.
