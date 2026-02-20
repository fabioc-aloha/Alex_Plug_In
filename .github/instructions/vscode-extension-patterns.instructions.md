# VS Code Extension Patterns Instructions

**Auto-loaded when**: Writing VS Code extension code — activation, commands, webviews, configuration, TreeView, or Agent Platform features
**Domain**: VS Code extension development, API patterns, agent platform
**Synapses**: [vscode-extension-patterns/SKILL.md](../skills/vscode-extension-patterns/SKILL.md)

---

## Purpose

Apply correct VS Code extension API patterns: proper resource disposal, configuration validation, webview security, agent hooks, and Claude compatibility — preventing runtime failures and security issues.

---

## When This Applies

**File Patterns**:
- `**/src/**/*.ts` — Extension TypeScript source
- `**/package.json` — Extension manifest
- `**/src/**/*.html` — Webview HTML templates

**Contextual Triggers**:
- Implementing commands, webviews, or TreeViews
- Adding configuration-dependent features
- Using VS Code 1.109+ Agent Platform features (hooks, skills, Claude compatibility)
- Debugging silent failures in extension functionality
- Pre-release quality gate review

---

## Activation Patterns

### Standard activate()

```typescript
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    // 1. Register all disposables into context.subscriptions
    context.subscriptions.push(
        vscode.commands.registerCommand('my-ext.command', handler),
        vscode.workspace.onDidChangeConfiguration(onConfigChange)
    );
    // 2. Defer non-critical initialization (no await for slow ops)
}
export function deactivate(): void { /* cleanup if needed */ }
```

**Rule**: Every disposable goes into `context.subscriptions`. Never store disposables in globals without cleanup.

---

## Configuration Rules

**Always validate keys before use:**

```typescript
// ✅ Correct — read with default
const value = vscode.workspace.getConfiguration('my-ext').get<string>('key', 'default');

// ✅ Correct — update with registered key
await vscode.workspace.getConfiguration('my-ext').update('key', value, vscode.ConfigurationTarget.Global);

// ❌ Never update unregistered keys — throws "Unable to write to User Settings"
```

**Required**: Every key in `.update()` must be declared in `package.json` `configuration.properties`.

---

## Webview Security

All webviews must set a Content Security Policy and use the webview URI:

```typescript
webview.options = { enableScripts: true, localResourceRoots: [context.extensionUri] };
const nonce = generateNonce();
const html = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        style-src ${webview.cspSource} 'unsafe-inline';
        script-src 'nonce-${nonce}';
    ">
</head>
<body>
    <script nonce="${nonce}">/* safe inline scripts here */</script>
</body>
</html>`;
```

**Rule**: Never use `'unsafe-eval'` or wildcard `*` in CSP.

---

## VS Code 1.109+ Agent Platform

### Agent Hooks (Preview, 1.109.3+)

Hooks execute custom logic around tool calls. Enable with `chat.hooks.enabled: true`.

**Available hook events**: `PreToolUse`, `PostToolUse`, `PreChatRequest`, `PostChatRequest`, `OnError`, `OnStart`, `OnStop`, `OnUserMessage`

Register in `.github/hooks/validate.md`:
```markdown
---
events: [PreToolUse]
tools: [editFile, runInTerminal]
---
# Validate Before Edit
Before editing production files, verify the target is not in /dist or /build.
```

### Claude Compatibility (1.109.3+)

VS Code reads these files from the workspace root:
- `.claude/CLAUDE.md` — project instructions (same as AGENTS.md)
- `.claude/agents/` — custom agent definitions
- `.claude/skills/` — skill files loaded into context
- `.claude/rules/` — reusable rules
- `.claude/settings.json` — Claude-specific settings

### Skills Distribution (GA in 1.109)

Distribute Skills with your extension via `chatSkills` contribution:
```json
"contributes": {
    "chatSkills": [{
        "id": "my-ext.domainKnowledge",
        "label": "Domain Knowledge",
        "description": "Domain expert knowledge for this workspace",
        "when": "workspaceHasMyExtConfig",
        "files": ["./skills/domain.md"]
    }]
}
```

Skills appear as slash commands when `chat.useAgentSkills` is enabled.

---

## TreeView / WebviewView Patterns

```typescript
class MyViewProvider implements vscode.WebviewViewProvider {
    resolveWebviewView(view: vscode.WebviewView) {
        view.webview.options = { enableScripts: true };
        view.webview.html = this.getHtml(view.webview);
        view.webview.onDidReceiveMessage(async (msg) => {
            switch (msg.command) {
                case 'refresh': await this.refresh(); break;
            }
        });
    }
}
// Register:
context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('my-ext.view', new MyViewProvider(context))
);
```

---

## Status Bar

```typescript
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
statusBar.command = 'my-ext.openPanel';
statusBar.tooltip = 'Click to open panel';
context.subscriptions.push(statusBar);
statusBar.show();
```

---

## Quality Gates

Before shipping any VS Code extension code:
- [ ] All disposables in `context.subscriptions`
- [ ] Configuration keys registered in `package.json` before calling `.update()`
- [ ] Webview HTML includes CSP with nonce
- [ ] No `'unsafe-eval'` in Content Security Policy
- [ ] Agent Hooks declared in `.github/hooks/` (if using 1.109.3+)
- [ ] `chatSkills` contribution declared if distributing skill files
- [ ] Extension activates without slow blocking operations in `activate()`
