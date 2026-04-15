---
description: "VS Code extension development patterns — activation, commands, webviews, configuration, TreeView, Agent Platform"
application: "When implementing vscode extension patterns or reviewing code that uses these patterns"
applyTo: "**/src/**/*.ts,**/extension.ts,**/*.vsix"
---

# VS Code Extension Patterns — Enforcement Rules

Deep reference: `.github/skills/vscode-extension-patterns/SKILL.md`

## Hard Rules

- **Disposables**: every disposable into `context.subscriptions` — no globals without cleanup
- **Configuration**: every key in `.update()` must be declared in `package.json` `configuration.properties`
- **Webview CSP**: always set Content Security Policy with nonce — never `'unsafe-eval'` or wildcard `*`
- **Webview resources**: use `localResourceRoots` restricted to extension URI, not workspace root
- **Activation**: no slow blocking operations in `activate()` — defer non-critical init
- **Agent Hooks**: declare in `.github/hooks/` (1.109.3+)
- **chatSkills**: declare in `contributes.chatSkills` if distributing skill files

## Webview CSP Template

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}';
">
```

## Key Patterns

- **Singleton webview**: static `currentPanel` field, `createOrShow()` reveals if exists, `dispose()` clears static + all disposables
- **Message passing**: extension uses `panel.webview.postMessage()`, webview uses `vscode.postMessage()` via `acquireVsCodeApi()`
- **State persistence**: `vscode.setState()`/`getState()` in webview; `retainContextWhenHidden: true` for complex panels
- **Theme**: use `var(--vscode-editor-background)`, `var(--vscode-button-background)`, etc. — no hardcoded colors
- **WebviewViewProvider**: sidebar views via `resolveWebviewView()`, register with `registerWebviewViewProvider()`

## Quality Gate Checklist

- [ ] All disposables in `context.subscriptions`
- [ ] Config keys registered before `.update()`
- [ ] Webview CSP with nonce, no `unsafe-eval`
- [ ] Agent Hooks declared if using 1.109.3+
- [ ] `chatSkills` declared if distributing skills
- [ ] No blocking await in `activate()`
