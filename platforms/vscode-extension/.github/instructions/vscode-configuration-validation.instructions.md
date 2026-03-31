---
description: "VS Code extension configuration validation — package.json manifest and runtime config error diagnosis"
---

# VS Code Configuration Validation — Auto-Loaded Rules

Full validation protocol, audit script, pattern examples, real-world case studies → see vscode-configuration-validation skill.

## Quick Diagnosis

Error: `Unable to write to User Settings because <key> is not a registered configuration`
→ Key not in `package.json` `configuration.properties` AND no try-catch wrapper.

## Decision Tree: Register or Try-Catch?

- **Critical to feature** (paths, API keys)? → Register in `package.json`, NO try-catch (let it fail)
- **User-facing setting** (preferences, toggles)? → Register + add UI description
- **Dynamic/analytics** (tracking, counters)? → Try-catch with `console.log`, no registration
- **If unsure** → Register (better UX)

## Pattern Vocabulary

- **Pattern A (Registered)**: user-facing settings → must be in `package.json`
- **Pattern B (Dynamic)**: tracking/analytics → try-catch, no registration
- **Pattern C (Critical)**: paths, API keys → must be registered, NO try-catch

## Windows Path Rule

Always normalize before `config.update()`:

```typescript
const normalizedPath = filePath.replace(/\\/g, '/');
await config.update('path', normalizedPath, ConfigurationTarget.Global);
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Dynamic keys without try-catch | Wrap in try-catch |
| Registered key with wrong scope | `machine` for global, `resource` for workspace |
| Config read without default | Always `.get(key, defaultValue)` |
| Windows backslash paths | Normalize with `.replace(/\\/g, '/')` |

## Integration with QA Processes

### Pre-Release Checks

Add to release checklist:
```markdown
- [ ] Run `scripts/validate-manifest.ps1`
- [ ] Review any warnings for try-catch usage
- [ ] Test configuration updates in clean VS Code instance
- [ ] Verify Settings UI shows all user-facing configuration
```

### Code Review Guidelines

When reviewing code that uses `getConfiguration()`:
1. Check if configuration is registered in `package.json`
2. If not registered, verify try-catch exists
3. Verify default values provided in `.get()` calls
4. Test error paths (what happens if config write fails?)

### CI/CD Integration

Add to build pipeline:
```yaml
- name: Validate Extension Manifest
  run: |
    # Navigate to extension directory if in multi-platform workspace
    pwsh -File scripts/validate-manifest.ps1
  shell: pwsh
```

---

## Related Skills

- [vscode-extension-patterns](../skills/vscode-extension-patterns/SKILL.md) — Extension development patterns
- [code-review-guidelines](code-review-guidelines.instructions.md) — Configuration API usage review

---

## Auto-Load Behavior

This instruction file auto-loads when:
- Working in VS Code extension projects
- Editing files that use `getConfiguration()` API
- User mentions configuration errors or Settings issues
- Running pre-release quality checks

**Purpose**: Prevent runtime configuration errors through systematic validation.
