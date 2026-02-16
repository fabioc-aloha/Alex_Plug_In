# VS Code Configuration Validation Instructions

**Auto-loaded when**: Working with VS Code extension configuration, package.json manifest, or experiencing runtime configuration errors
**Domain**: VS Code extension development, configuration API, quality assurance
**Synapses**: [vscode-configuration-validation/SKILL.md](../skills/vscode-configuration-validation/SKILL.md)

---

## Purpose

Prevent runtime configuration errors by validating that all `workspace.getConfiguration().update()` calls reference properly registered configuration properties in `package.json`, or use graceful degradation patterns for dynamic keys.

---

## When This Applies

**File Patterns**:
- `**/package.json` — Extension manifest with configuration schema
- `**/src/**/*.ts` — TypeScript code using VS Code configuration API

**Contextual Triggers**:
- User reports "Unable to write to User Settings" errors
- Debugging non-functional features that silently fail
- Pre-release quality gate checks
- Adding new configuration-based features

**Error Signatures**:
```
ERR Unable to write to User Settings because <key> is not a registered configuration
```

---

## Validation Protocol

### 1. Automated Validation

**Run the validation script**:
```powershell
cd platforms/vscode-extension
.\scripts\validate-manifest.ps1
```

**Expected output**:
- ✅ All validations passed — No issues found
- ⚠️ Warnings — Unregistered keys with try-catch (verify intentional)
- ❌ Errors — Configuration updates missing both registration and error handling

### 2. Manual Cross-Reference

**Find all configuration updates**:
```powershell
Select-String -Path src -Pattern "getConfiguration.*\.update\(" -Recurse
```

**For each match**:
1. Extract configuration context: `getConfiguration('alex.feature')`
2. Extract key being updated: `.update('setting', value)`
3. Build full key: `alex.feature.setting`
4. Check if exists in `package.json` `configuration.properties`
5. If not registered, verify try-catch wrapper exists

### 3. Configuration Patterns

**Pattern A: Registered Configuration** (user-facing settings)
```typescript
// Code
const enabled = vscode.workspace.getConfiguration('alex.voice')
  .get('enabled', false);

await vscode.workspace.getConfiguration('alex.voice')
  .update('enabled', true, ConfigurationTarget.Global);

// package.json (REQUIRED)
{
  "contributes": {
    "configuration": {
      "properties": {
        "alex.voice.enabled": {
          "type": "boolean",
          "default": false,
          "scope": "machine",
          "description": "Enable automatic voice mode"
        }
      }
    }
  }
}
```

**Pattern B: Dynamic Configuration** (usage tracking, analytics)
```typescript
// Code with graceful degradation
async function trackSkillUsage(skillId: string) {
  try {
    const key = `${skillId}.uses`;
    const count = vscode.workspace.getConfiguration('alex.skillTracking')
      .get<number>(key, 0);
    
    await vscode.workspace.getConfiguration('alex.skillTracking')
      .update(key, count + 1, ConfigurationTarget.Global);
  } catch (error) {
    // Feature degrades gracefully - main functionality unaffected
    console.log(`[Alex] Skipping skill tracking: ${error}`);
  }
}

// package.json - NO registration needed (intentionally dynamic)
```

**Pattern C: Critical Configuration** (paths, API keys)
```typescript
// Code - NO try-catch, failure should bubble
await vscode.workspace.getConfiguration('alex.globalKnowledge')
  .update('remoteRepo', repo, ConfigurationTarget.Global);

// package.json (REQUIRED)
{
  "contributes": {
    "configuration": {
      "properties": {
        "alex.globalKnowledge.remoteRepo": {
          "type": "string",
          "default": "",
          "scope": "machine",
          "description": "GitHub repository for remote knowledge"
        }
      }
    }
  }
}
```

---

## Decision Tree: Register or Try-Catch?

```
Is this configuration update critical to feature functionality?
│
├─ YES → Register in package.json
│   └─ User-facing setting? Add UI description
│
└─ NO → Is it dynamic (user tracking, analytics)?
    │
    ├─ YES → Use try-catch pattern (no registration)
    │   └─ Log for debugging, but don't fail
    │
    └─ NO → Still register (better UX)
        └─ Users can inspect/modify in settings
```

---

## Common Mistakes

| Mistake | Symptoms | Fix |
|---------|----------|-----|
| Dynamic keys without try-catch | Runtime errors block feature | Wrap in try-catch |
| Registered key with wrong scope | Setting not persisted correctly | Use `machine` for global, `resource` for workspace |
| Configuration read without default | `undefined` causes crashes | Always provide fallback: `.get(key, defaultValue)` |
| Updating unregistered critical config | Silent failure, feature broken | Register in package.json |

---

## Real-World Example: Skill Recommendations (v5.7.5)

**Problem**:
- Quick Actions buttons in Welcome View not working
- Console error: `Unable to write to User Settings because alex.skillRecommendations.code-review.accepted is not a registered configuration`
- Many possible skill IDs (`code-review`, `testing-strategies`, etc.)
- Don't want hundreds of configuration properties

**Analysis**:
- Feature: Track which skill recommendations user accepts/dismisses
- Purpose: Analytics/personalization (non-critical)
- Keys: Dynamic based on skill ID
- Impact if tracking fails: None (recommendations still work)

**Solution**:
```typescript
async function trackRecommendationFeedback(skillId: string, accepted: boolean) {
  try {
    const context = 'alex.skillRecommendations';
    const key = `${skillId}.${accepted ? 'accepted' : 'dismissed'}`;
    const currentCount = vscode.workspace.getConfiguration(context)
      .get<number>(key, 0);
    
    await vscode.workspace.getConfiguration(context).update(
      key,
      currentCount + 1,
      vscode.ConfigurationTarget.Global
    );
  } catch (error) {
    // Graceful degradation - recommendations work without tracking
    console.log(`[Alex] Skipping recommendation tracking: ${error}`);
  }
}
```

**Result**:
- Quick Actions functional again
- No package.json bloat
- Clean error handling
- Feature works with or without tracking

---

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
    cd platforms/vscode-extension
    pwsh -File scripts/validate-manifest.ps1
  shell: pwsh
```

---

## Related Skills

- [extension-audit-methodology](extension-audit-methodology.instructions.md) — Dimension 6: Configuration validation
- [vscode-extension-patterns](../skills/vscode-extension-patterns/SKILL.md) — Extension development patterns
- [code-review](code-review.instructions.md) — Configuration API usage review

---

## Auto-Load Behavior

This instruction file auto-loads when:
- Working in VS Code extension projects
- Editing files that use `getConfiguration()` API
- User mentions configuration errors or Settings issues
- Running pre-release quality checks

**Purpose**: Prevent runtime configuration errors through systematic validation.
