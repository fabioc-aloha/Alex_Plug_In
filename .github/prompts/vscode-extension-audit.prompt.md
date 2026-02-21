# VS Code Extension Audit

> **Avatar**: Call `alex_cognitive_state_update` with `state: "reviewing"`. This updates the welcome sidebar avatar.

**Purpose**: Systematic review of a VS Code extension for API correctness, security, resource management, and 1.109+ platform readiness
**Domain**: VS Code extension development, API patterns
**Duration**: 15-30 minutes depending on extension complexity
**Output**: Prioritized findings with file links and exact fixes

---

## Audit Workflow

5 phases:

1. **Activation & Disposal** — subscription hygiene, deactivation cleanup
2. **Configuration Safety** — registered keys, graceful defaults
3. **Webview Security** — CSP, nonce, localResourceRoots
4. **Agent Platform Readiness** — skills, hooks, Claude compat (1.109+)
5. **Issue Report** — prioritized findings with actionable fixes

---

## Phase 1: Activation & Disposal Audit

**Scan for unmanaged disposables:**

```powershell
Select-String -Path src -Pattern "register(Command|Event|Provider|WebviewPanel)" -Recurse |
  Select-String -NotMatch "context.subscriptions"
```

**Check for**:
- [ ] All `registerCommand()` calls pushed to `context.subscriptions`
- [ ] All event listeners (e.g., `onDidChangeConfiguration`) pushed to subscriptions
- [ ] `deactivate()` exported if any cleanup is needed
- [ ] No `new vscode.StatusBarItem()` without `.dispose()` or subscription

**Findings Template:**
```markdown
**P0 - Disposable Leak**
- File: [src/extension.ts](src/extension.ts#L42)
  - Issue: `registerCommand('cmd')` return value not added to subscriptions
  - Fix: `context.subscriptions.push(vscode.commands.registerCommand(...))`
  - Impact: Memory leak — disposable never freed on extension deactivation
```

---

## Phase 2: Configuration Safety Audit

**Find all configuration updates:**

```powershell
Select-String -Path src -Pattern "getConfiguration.*\.update\(" -Recurse
```

**For each match**:
1. Extract the config context: `getConfiguration('my-ext.feature')`
2. Extract the key: `.update('settingName', value)`
3. Build full key: `my-ext.feature.settingName`
4. Verify key exists in `package.json` `configuration.properties`

**Auto-validate** (if script available):
```powershell
.\scripts\validate-manifest.ps1
```

**Findings Template:**
```markdown
**P0 - Unregistered Config Key**
- File: [src/config.ts](src/config.ts#L88)
  - Key: `my-ext.feature.unregisteredKey`
  - Fix: Add to package.json configuration.properties OR wrap in try-catch for dynamic keys
  - Impact: Throws "Unable to write to User Settings" at runtime — silent failure
```

---

## Phase 3: Webview Security Audit

**Scan for webviews without CSP:**

```powershell
Select-String -Path src -Pattern "webview\.html\s*=" -Recurse
```

**For each webview, check**:
- [ ] `Content-Security-Policy` meta tag present
- [ ] `default-src 'none'` as baseline
- [ ] Nonce-based scripts (not `'unsafe-inline'` for scripts)
- [ ] `localResourceRoots` set to extension URI
- [ ] No `'unsafe-eval'`

**Findings Template:**
```markdown
**P1 - Missing CSP Nonce**
- File: [src/webview/panel.ts](src/webview/panel.ts#L156)
  - Issue: Script tag uses 'unsafe-inline' instead of nonce
  - Fix: Generate nonce, add to CSP and script tag
  - Impact: Security vulnerability — XSS attack vector
```

---

## Phase 4: Agent Platform Readiness (VS Code 1.109+)

**Check for skills distribution opportunity:**
- [ ] Does extension have domain knowledge that could benefit agent sessions?
- [ ] Is `chatSkills` contribution declared in `package.json`?
- [ ] Are SKILL.md files present in extension bundle?

**Check for hooks opportunity (1.109.3+):**
- [ ] Does extension operate on files or run commands?
- [ ] Are `.github/hooks/` files present for PreToolUse validation?
- [ ] Is `chat.hooks.enabled` in recommended settings?

**Check Claude compatibility (1.109.3+):**
- [ ] `.claude/CLAUDE.md` present if workspace has project-specific AI instructions?
- [ ] Claude settings not duplicating what VS Code already handles?

---

## Phase 5: Issue Report

Compile findings in prioritized order:

### Critical (P0) — Fix before release
- Resource leaks (disposables not managed)
- Unregistered configuration keys causing runtime failures

### High (P1) — Fix in current cycle
- Webview security policy gaps
- Missing error handling in LLM calls

### Medium (P2) — Plan for next cycle
- Missing Agent Skills distribution
- No follow-up provider for Chat Participants

### Low (P3) — Backlog
- Claude compatibility files missing
- Agent Hooks not leveraged

---

## Sample

User: "/vsCodeExtensionAudit"

Alex:
1. Runs automated scans for disposable leaks and unregistered config keys
2. Reviews all webview HTML for CSP compliance
3. Checks VS Code 1.109+ agent platform readiness
4. Produces prioritized finding list with file links and exact code fixes
5. Estimates effort for each severity tier

**Cross-reference**: `.github/instructions/vscode-extension-patterns.instructions.md`


> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` to reset to project-appropriate avatar.