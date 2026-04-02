---
name: "vscode-extension-patterns"
description: "Reusable patterns for VS Code extension development."
tier: core
---

# VS Code Extension Patterns Skill

> Reusable patterns for VS Code extension development.

## ⚠️ Staleness Warning

VS Code APIs evolve with each monthly release. Patterns may become outdated or better alternatives may emerge.

**Refresh triggers:**

- VS Code major/minor releases
- New proposed APIs becoming stable
- Extension API deprecations
- Webview security policy changes

**Last validated:** March 2026 (VS Code 1.111+)

**Check current state:** [VS Code API](https://code.visualstudio.com/api), [Release Notes](https://code.visualstudio.com/updates)

---

## Webview Dashboard

```typescript
// Gather data in parallel, build HTML with async
const [health, knowledge, sync] = await Promise.all([
    checkHealth(true), getKnowledgeSummary(), getSyncStatus()
]);
panel.webview.html = await getWebviewContent(health, knowledge, sync);
```

**Key**: Make `getWebviewContent` async if it needs directory scanning or other async ops.

## TreeDataProvider for Sidebar

```typescript
class WelcomeViewProvider implements vscode.WebviewViewProvider {
    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtmlContent();
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'refresh': await this.refresh(); break;
            }
        });
    }
}

// Register in extension.ts
vscode.window.registerWebviewViewProvider('alex.welcomeView', new WelcomeViewProvider());
```

## CSP-Compliant Webview Event Handling

**Problem**: Inline event handlers (`onclick="..."`) violate Content Security Policy and can be blocked.

**Solution**: Use `data-cmd` attributes with delegated event listeners:

```html
<!-- ❌ WRONG: Inline handlers (CSP violation) -->
<button onclick="handleClick()">Click</button>

<!-- ✅ CORRECT: data-cmd pattern -->
<button data-cmd="play">Play</button>
<button data-cmd="stop">Stop</button>
```

```javascript
// Single delegated listener for all commands
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-cmd]');
    if (!target) return;
    
    const cmd = target.getAttribute('data-cmd');
    switch (cmd) {
        case 'play': audio.play(); break;
        case 'stop': audio.pause(); audio.currentTime = 0; break;
    }
});
```

**Benefits**:
- CSP-compliant (no inline scripts)
- Single event listener (better performance)
- Easy to add new commands
- Consistent pattern across webviews

## Agent Hooks (VS Code 1.111+)

Hooks are shell scripts that run at defined points in the agent lifecycle. Configured in `.github/hooks.json`.

### Hook Events

| Event | When It Fires | Use Cases |
| --- | --- | --- |
| `SessionStart` | Chat session begins | Load context, set persona, inject goals |
| `UserPromptSubmit` | User sends a message | Secret scanning, safety gates |
| `PreToolUse` | Before any tool call | Safety blocks (deny), input sanitization |
| `PostToolUse` | After tool completes | Logging, compile reminders, test suggestions |
| `SubagentStart` | Subagent spawned | Inject Active Context for subagents |
| `Stop` | Session ends | Metrics, commit reminders, decision journal |
| `PreCompact` | Before context compaction | Save session state |

### Config Format (3-Level Nesting)

```json
{
  "hooks": {
    "SessionStart": [{
      "steps": [{
        "hooks": [{
          "type": "command",
          "command": ".github/muscles/hooks/session-start.cjs",
          "timeout": 10
        }]
      }]
    }]
  }
}
```

**Key rules**:
- Timeout in **seconds** (not milliseconds)
- Scripts read structured **JSON from stdin** (`tool_name`, `tool_input`, `session_id`, `cwd`, `hook_event_name`)
- Scripts output structured **JSON to stdout** (`hookSpecificOutput`, `decision`, `additionalContext`)
- Exit code **2** = blocking error (denies tool call or prevents stopping). Non-zero (not 2) = warning
- Use `.cjs` extension for CommonJS compatibility with ESM workspaces

### PreToolUse Decisions

```javascript
// Allow (default)
process.stdout.write(JSON.stringify({ hookSpecificOutput: { permissionDecision: 'allow' } }));

// Deny — blocks the tool call
process.stdout.write(JSON.stringify({
  hookSpecificOutput: { permissionDecision: 'deny' },
  additionalContext: 'Safety: This operation is blocked because...'
}));
process.exit(2);

// Modify input — rewrite tool parameters
process.stdout.write(JSON.stringify({
  hookSpecificOutput: { permissionDecision: 'allow', updatedInput: { /* modified params */ } }
}));
```

### Agent-Scoped Hooks

Declare hooks in `.agent.md` YAML frontmatter:

```yaml
---
agent: Validator
hooks:
  PreToolUse:
    - type: command
      command: .github/muscles/hooks/validator-pre-tool-use.cjs
      timeout: 5
---
```

### Autopilot Mode

`chat.autopilot.enabled` allows the agent to execute tool calls without manual approval. Safety hooks using `deny` decisions remain active — they block dangerous operations even in non-interactive mode.

Recommended for: Dream, Meditation, Brain QA, routine maintenance.
Requires supervision: Code generation, file deletion, publishing.

### Debug Events Snapshot

Type `#debugEventsSnapshot` in chat to attach a snapshot of agent debug events. Shows loaded customizations, token consumption, hook execution, and agent behavior. Use with the Agent Debug Panel (`Developer: Open Agent Debug Panel`) for full visibility.

---

## Safe Configuration Pattern

**Tiered settings**: Essential (🔴) → Recommended (🟡) → Auto-Approval (🟠) → Extended Thinking (🧠) → Enterprise (🔵)

**Safety rules**:

- Additive only — never modify/remove existing
- Check `config.inspect(key)?.globalValue` before applying
- Preview JSON before changes
- User chooses categories
- Preserve higher user values when applying recommendations

```typescript
async function applySettings(settings: Record<string, unknown>) {
    const config = vscode.workspace.getConfiguration();
    for (const [key, value] of Object.entries(settings)) {
        if (config.inspect(key)?.globalValue === undefined) {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        }
    }
}
```

## Comprehensive Settings Management Pattern

**Pattern**: Documentation-first approach for complex settings ecosystems (VS Code 1.109+ chat settings).

**Steps**:

1. **Research Phase** — Comprehensive discovery
   - Grep search for all related settings in codebase
   - Read MS documentation for official settings
   - Identify experimental/unstable features
   - Document current user configuration

2. **Documentation Phase** — Create reference materials before implementation
   - **GUIDE**: Comprehensive reference (all settings, categories, use cases, warnings)
   - **SUMMARY**: Current state snapshot (what user has, what's missing, recommendations)
   - **APPLIED**: Change log document (what was applied, why, how to rollback)
   - **JSON Template**: Copy-paste ready configuration file

3. **Implementation Phase** — Safe automated application
   - Create PowerShell/shell script for automation (platform-specific)
   - **Always backup** before modifications (`settings.json.backup-{timestamp}`)
   - Compare new vs existing, report changes (new, updated, skipped, preserved)
   - **Preserve higher values** (user has 150, recommending 100? Keep 150)
   - **Exclude unstable features** explicitly documented

4. **Extension Integration** — Make it permanent
   - Update `setupEnvironment.ts` ESSENTIAL_SETTINGS, RECOMMENDED_SETTINGS, etc.
   - Add new categories if pattern discovered (e.g., AUTO_APPROVAL_SETTINGS)
   - Integrate into Initialize/Upgrade commands (`offerEnvironmentSetup()`)
   - Update Welcome sidebar with accurate counts

5. **Validation Phase**
   - Test script execution (fix syntax errors iteratively)
   - Verify settings applied (check VS Code settings.json)
   - Document excluded settings with reasons (hooks not stable, platform-specific)
   - Commit documentation files to git

**Key insights from Feb 2026 implementation**:

- VS Code 1.109+ has 47+ chat-related settings across 6 categories
- Hooks (`chat.hooks.enabled`) marked experimental but not stable yet
- Auto-approval settings reduce friction (5 settings: autoRun, fileSystem.autoApprove, terminal.*)
- Initialize/Upgrade should apply Essential + Recommended + Auto-Approval (36 total)
- PowerShell inline commands unreliable — use `.ps1` file for complex scripts
- Settings categories prevent overwhelming users (show 5 categories vs 47 individual settings)

**When to use this pattern**:

- Complex settings ecosystems (10+ related settings)
- Rapidly evolving features (experimental → stable transitions)
- User education needed (settings have non-obvious interdependencies)
- Safety-critical configuration (wrong settings break functionality)

**Template structure**:

```
docs/guides/
├── FEATURE-SETTINGS-GUIDE.md         # Comprehensive reference
├── FEATURE-SETTINGS-SUMMARY.md       # Current state snapshot  
└── FEATURE-SETTINGS-APPLIED.md       # Change log (gitignore if sensitive)

.vscode/
└── recommended-feature-settings.jsonc # Template (gitignore)

src/commands/
└── setupEnvironment.ts                # Settings constants + apply logic
```

**Benefits**:

- Users understand full capability before committing
- Documentation serves as reference post-application
- Safe rollback via timestamped backups
- Extension automatically applies for new users
- Audit trail of what was applied and why

## Auto-Detection with Confidence

```typescript
const PATTERNS = [
    { pattern: /learned|discovered|realized/i, confidence: 0.8 },
    { pattern: /key insight|the trick is/i, confidence: 0.85 },
];
```

Use confidence thresholds for auto-actions. Higher threshold = fewer false positives.

## Duplicate Detection

```typescript
function isDuplicate(newText: string, existing: string[]): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '');
    return existing.some(e => calculateSimilarity(normalize(newText), normalize(e)) > 0.8);
}
```

## Portability Rules

Extensions must work on any machine:

```typescript
// ✅ CORRECT: Dynamic paths
const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const globalPath = path.join(os.homedir(), '.alex');

// ❌ WRONG: Hardcoded paths
const rootPath = 'c:\\Development\\MyProject';  // Never!
```

**Key utilities**:

- `vscode.workspace.workspaceFolders` — Current workspace
- `os.homedir()` — Platform-independent home
- `path.join()` — Cross-platform path building

## Publishing Workflow

```bash
# Load PAT from .env and publish
# Ensure VSCE_PAT is set in your environment or .env file
npx vsce publish
```

**Version collision**: Increment patch → update package.json, README badge, CHANGELOG → retry.

## Testing Extension Changes: Debug vs Rebuild

**Key difference**: F5 debug mode vs installed extension workflow

| Change Type | F5 Debug | Rebuild + Reinstall | Why |
|------------|----------|---------------------|-----|
| Code logic | ✅ Works | ✅ Works | Hot reload or restart debug session |
| Webview HTML/CSS | ❌ Cached | ✅ Works | Installed extensions cache webview assets |
| package.json changes | ❌ Ignored | ✅ Works | Debug uses launch.json config, not package.json |
| New commands | ❌ Not registered | ✅ Works | Command palette populated from installed version |

**Full rebuild workflow** (for UI/config changes):

```bash
# 1. Build production bundle
npm run package

# 2. Create VSIX
npx @vscode/vsce package

# 3. Reinstall (--force replaces existing)
code --install-extension path/to/extension.vsix --force

# 4. Reload window (Ctrl+R or Developer: Reload Window)
```

**Quick test cycle**: For webview styling changes, use Developer Tools to live-edit CSS first, then apply changes to source and rebuild.

**Best practice**: Always test production builds before releasing — minification can expose issues (TDZ violations, missing imports) that don't appear in development.

## Asset Optimization for Extension Size

**Problem**: Large image assets dominate extension package size. Avatar/icon images generated at 2048×2048 can bloat extensions to 500+ MB.

**Solution**: Resize images to display-appropriate dimensions:

| Display Context | Recommended Size | Rationale |
|-----------------|------------------|-----------|
| Sidebar views | 768×768 | 300px display × 2 (retina) + headroom |
| Status bar icons | 32×32 | 16px display × 2 (retina) |
| Activity bar | 48×48 | 24px display × 2 (retina) |
| Marketplace icon | 256×256 | 128px min + retina |

**Bulk resize with sharp**:

```javascript
const sharp = require('sharp');
const fs = require('fs');

async function optimizeImages(dir, targetSize = 768) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    for (const file of files) {
        const buffer = await sharp(`${dir}/${file}`)
            .resize(targetSize, targetSize, { fit: 'cover' })
            .png({ compressionLevel: 9 })
            .toBuffer();
        fs.writeFileSync(`${dir}/${file}`, buffer);
    }
}
```

**Real impact**: Alex extension 553 MB → 33 MB (94% reduction) by resizing avatars from 2048×2048 to 768×768.

## Goals with Streak Tracking

```typescript
interface LearningGoal {
    id: string;
    title: string;
    category: 'coding' | 'reading' | 'practice' | 'review';
    targetCount: number;
    currentCount: number;
    type: 'daily' | 'weekly';
    expiresAt: string;
}

// Auto-increment on activity
async function autoIncrementGoals(activityType: 'session' | 'insight') {
    const data = await loadGoalsData();
    for (const goal of data.goals) {
        if (shouldIncrement(goal, activityType) && !isExpired(goal)) {
            goal.currentCount = Math.min(goal.currentCount + 1, goal.targetCount);
        }
    }
    await saveGoalsData(data);
}
```

## SecretStorage for Sensitive Tokens

**Never store secrets in settings** — use VS Code's SecretStorage API:

```typescript
// Module-level cache
let secretStorage: vscode.SecretStorage | null = null;
let cachedToken: string | null = null;

// Initialize during activation
export async function initSecrets(context: vscode.ExtensionContext): Promise<void> {
    secretStorage = context.secrets;
    cachedToken = await secretStorage.get('myExtension.apiToken') || null;
    
    // Migration: Move token from settings to secrets
    const config = vscode.workspace.getConfiguration('myExtension');
    const settingsToken = config.get<string>('apiToken')?.trim();
    if (settingsToken && !cachedToken) {
        await secretStorage.store('myExtension.apiToken', settingsToken);
        cachedToken = settingsToken;
        await config.update('apiToken', undefined, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('Token migrated to secure storage.');
    }
}

// Synchronous access to cached value
function getToken(): string | null {
    return cachedToken;
}
```

**Key points:**
- `context.secrets.get()` / `store()` / `delete()` are async
- Cache at module level for sync access
- Migrate existing settings tokens on first run
- Mark old setting as deprecated in package.json
- **External tool access**: SecretStorage is inaccessible to CLI/scripts — provide export-to-.env command for bridging (see `secrets-management` skill)

## Webview CSP Security

**Always add Content-Security-Policy** when `enableScripts: true`:

```typescript
import { getNonce } from './sanitize';

function getWebviewHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        style-src ${webview.cspSource} 'unsafe-inline';
        script-src 'nonce-${nonce}';
        img-src ${webview.cspSource} https: data:;
        font-src ${webview.cspSource};
    ">
</head>
<body>
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        // ... your code
    </script>
</body>
</html>`;
}

// Nonce generator
function getNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 32 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
}
```

## CSP Event Delegation (onclick → data-cmd)

**Problem**: After adding CSP with `script-src 'nonce-${nonce}'`, all inline event handlers (`onclick`, `onchange`) stop working because CSP blocks inline JavaScript.

**Solution**: Replace inline handlers with data attributes and event delegation:

```html
<!-- ❌ BLOCKED BY CSP -->
<button onclick="cmd('upgrade')">Upgrade</button>
<button onclick="cmd('launchSkill', {skill: 'code-review'})">Review</button>

<!-- ✅ CSP-COMPLIANT -->
<button data-cmd="upgrade">Upgrade</button>
<button data-cmd="launchSkill" data-skill="code-review">Review</button>

<script nonce="${nonce}">
    document.addEventListener('click', function(e) {
        const el = e.target.closest('[data-cmd]');
        if (el) {
            e.preventDefault();
            const command = el.getAttribute('data-cmd');
            const skill = el.getAttribute('data-skill');
            vscode.postMessage(skill ? { command, skill } : { command });
        }
    });
</script>
```

**Benefits**:
- Security — CSP blocks all inline scripts
- Performance — Single event listener vs many handlers
- Maintainability — Commands defined as data, not code

## Webview Sandbox: postMessage Required

**Problem**: `window.open()`, `location.reload()`, and direct external links silently fail in sandboxed webviews.

**Solution**: WebView sends message to extension host; extension performs privileged action:

```typescript
// In webview HTML
vscode.postMessage({ type: 'openExternal', url: 'https://example.com' });

// In extension host
panel.webview.onDidReceiveMessage(async (message) => {
    if (message.type === 'openExternal') {
        await vscode.env.openExternal(vscode.Uri.parse(message.url));
    }
});
```

**Key insight**: WebView ↔ Extension Host communication mirrors browser Content Script ↔ Background Script patterns.

## Telemetry Opt-Out Compliance

**Always respect VS Code's telemetry settings:**

```typescript
function isTelemetryEnabled(): boolean {
    // Check VS Code global setting first
    if (!vscode.env.isTelemetryEnabled) {
        return false;
    }
    // Then check extension-specific setting
    const config = vscode.workspace.getConfiguration('myExtension');
    return config.get<boolean>('telemetry.enabled', true);
}

function log(event: string, data?: Record<string, unknown>): void {
    if (!isTelemetryEnabled()) {
        return;
    }
    // Send telemetry...
}
```

## Configuration Change Listeners

**React to settings changes at runtime:**

```typescript
export function activate(context: vscode.ExtensionContext) {
    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('myExtension.featureA')) {
                // Refresh feature A
                refreshFeatureA();
            }
            if (e.affectsConfiguration('myExtension.telemetry')) {
                // Update telemetry state
            }
        })
    );
}
```

**Key points:**
- Use `affectsConfiguration()` to filter relevant changes
- Push listener to `context.subscriptions` for cleanup
- Re-read config values, don't cache indefinitely

## Temporal Dead Zone (TDZ) in Production Builds

**Problem**: Code works in development but crashes in production with "Cannot access 'X' before initialization" — the minifier exposes variable hoisting issues.

**Root Cause**: Using `const`/`let` variables before they're declared in the same scope. Development transpilation may mask this; production minifiers reveal it.

**Example Bug** (from real debugging session, Feb 14, 2026):

```typescript
// ❌ WRONG: TDZ violation (hidden until minified)
const trifectaTagsHtml = trifectaTags.map(tag => {
    return `<span class="tag">${skillNameMap[tag] || tag}</span>`;
}).join('');

// ... 30+ lines of other code ...

const skillNameMap: Record<string, string> = {
    'meditation': 'Meditation',
    'brain-qa': 'Brain QA',
    // ... more mappings
};
```

**Error at runtime**: `ReferenceError: Cannot access 'ft' before initialization` (where `ft` is minified name for `skillNameMap`).

**Why development didn't catch it**:
- TypeScript compiles successfully (no compiler error)
- esbuild development mode didn't reveal the issue
- Production minification changed evaluation order

**Solution**: Move variable declarations before first use:

```typescript
// ✅ CORRECT: Declare before use
const skillNameMap: Record<string, string> = {
    'meditation': 'Meditation',
    'brain-qa': 'Brain QA',
};

const trifectaTagsHtml = trifectaTagsArray.map(tag => {
    return `<span class="tag">${skillNameMap[tag] || tag}</span>`;
}).join('');
```

**Prevention strategies**:
1. **Test production builds locally** — always install packaged VSIX before releasing
2. **Declare dependencies at top of scope** — don't scatter `const` declarations
3. **Watch for callback references** — `.map()`, `.filter()` callbacks can't see later declarations
4. **ESLint rule**: Enable `no-use-before-define` to catch in development

**Debugging tip**: If production error shows "Cannot access 'X'" where X is a 2-letter variable like `ft`, `ab`, `xr` — look for TDZ issues with object literals or complex constants referenced in callbacks.

## VS Code 1.109+ Agent Platform Capabilities

VS Code 1.109 (January 2026) introduces a native agent platform that extensions can leverage:

### Agent Files (`AGENTS.md`)

Extensions can ship agent definitions that VS Code auto-discovers:

```markdown
<!-- .github/agents/my-agent.agent.md -->
---
name: "MyAgent"
description: "Specialized agent for domain X"
user-invokable: true         # Show in agents dropdown (default: true)
disable-model-invocation: false  # Allow model to invoke as subagent
agents: ['Validator', 'Builder'] # Limit which subagents this agent can use
---

# MyAgent Instructions

Agent-specific instructions and knowledge go here.
```

**Setting**: `chat.useAgentsMdFile: true` enables automatic loading.
**Custom locations**: `chat.agentFilesLocations: { "~/.vscode/agents": true }`.

### Skills Loading (GA in 1.109)

Extensions can define skills in `.github/skills/` that are auto-loaded into chat:

**Setting**: `chat.agentSkillsLocations: [".github/skills"]`

Each skill folder contains a `SKILL.md` (knowledge) and optional `synapses.json` (connections).

**Distribute skills with your extension** (new in 1.109):

```json
// package.json
{
  "contributes": {
    "chatSkills": [
      { "path": "./skills/my-skill" }
    ]
  }
}
```

The `path` must point to a directory containing a `SKILL.md` with `name:` in its frontmatter matching the parent directory name.

**Skills as slash commands**: Users can type `/` in chat to see and invoke skills directly.

### Agent Hooks (Preview, 1.109.3+)

Run custom shell commands at key lifecycle points in agent sessions:

```json
// .vscode/settings.json — configure hooks
{
  "chat.hooks.enabled": true
}
```

Hook events: `PreToolUse`, `PostToolUse`, `SessionStart`, `Stop`, `SubagentStart`, `SubagentStop`.

Users trigger with `/hooks` command in chat. Same format as Claude Code hooks — reuse configurations.

```bash
# Example: Run linter on every file edit (PreToolUse hook)
# Hook output can block the tool call if exit code > 0
```

### Agent-Scoped Hooks (Preview, 1.111+)

**Setting**: `chat.useCustomAgentHooks: true`

Hooks can be defined in `.agent.md` YAML frontmatter. They fire **only** when that specific agent is active or invoked via `runSubagent`. Global hooks still fire alongside scoped hooks.

```yaml
# In .agent.md frontmatter
hooks:
  PreToolUse:
    command: "node .github/muscles/hooks/validator-pre-tool.js"
    description: "Read-only validation mode"
    timeout: 2000
  SessionStart:
    command: "node .github/muscles/hooks/agent-session-start.js"
    description: "Load agent-specific context"
    timeout: 3000
```

Use cases: read-only mode for validator agents, auto-compile for builder agents, specialized context loading per agent.

### Autopilot and Agent Permissions (Preview, 1.111+)

**Setting**: `chat.autopilot.enabled: true`

Three permission tiers (session-scoped, changeable any time):

| Level | Behavior |
|-------|----------|
| Default Approvals | Normal tool confirmation dialogs |
| Bypass Approvals | Auto-approves all tool calls, retries on errors |
| Autopilot | Auto-approves + auto-responds + continues until `task_complete` |

**Warning**: Bypass and Autopilot skip ALL manual approvals including destructive operations. PreToolUse hooks still fire but user doesn't see interactive confirmations.

### Debug Events Snapshot (1.111+)

Attach `#debugEventsSnapshot` in chat to inspect loaded customizations, token consumption, and agent behavior. Sparkle icon in Agent Debug panel attaches automatically.

### Claude Compatibility (1.109.3+)

VS Code now reads Claude configuration files directly:

| File | Purpose |
| ---- | ------- |
| `CLAUDE.md`, `.claude/CLAUDE.md`, `~/.claude/CLAUDE.md` | Instructions |
| `.claude/rules/*.md` | Additional instruction files |
| `.claude/agents/*.md` | Agent definitions |
| `.claude/skills/` | Skill definitions |
| `.claude/settings.json`, `~/.claude/settings.json` | Hook configurations |

Teams using both VS Code + Claude Code can share a single configuration tree.

### Chat Participant API

Register custom chat participants that users can `@mention`:

```typescript
const participant = vscode.chat.createChatParticipant('myext.agent', async (request, context, stream, token) => {
  // Access to request.prompt, request.command
  // Stream responses with stream.markdown(), stream.button(), stream.reference()
  stream.markdown('Hello from my agent!');
});

participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'icon.png');
context.subscriptions.push(participant);
```

### Tool Registration

Register tools that any chat participant can invoke:

```typescript
const tool = vscode.lm.registerTool('myext-searchDocs', {
  async invoke(options, token) {
    const query = options.input.query;
    // Perform tool action
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(results))
    ]);
  }
});
context.subscriptions.push(tool);
```

**Declare in package.json**:

```json
{
  "contributes": {
    "languageModelTools": [{
      "name": "myext-searchDocs",
      "displayName": "Search Documentation",
      "modelDescription": "Searches project documentation for relevant content",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "Search query" }
        },
        "required": ["query"]
      }
    }]
  }
}
```

### QuickInput Button Finalized APIs (1.109)

Two new finalized APIs for `QuickPick` and `InputBox`:

```typescript
// Button location control
buttons: [{
  iconPath: new vscode.ThemeIcon('gear'),
  tooltip: 'Settings',
  location: vscode.QuickInputButtonLocation.Inline  // or .Title, .Input
}]

// Toggle button (on/off state)
buttons: [{
  iconPath: new vscode.ThemeIcon('eye'),
  toggle: { checked: false }  // tracks state
}]
```

### Extended Thinking

Models supporting extended thinking can be configured per-model:

```json
{
  "claude-opus-4-*.extendedThinkingEnabled": true,
  "claude-opus-4-*.thinkingBudget": 16384
}
```

### MCP Integration

VS Code 1.109+ supports Model Context Protocol servers:

**Setting**: `chat.mcp.gallery.enabled: true`

MCP servers extend AI capabilities with external tools (Azure, GitHub, databases).

### Key Settings Summary (1.111+)

| Setting | Value | Purpose | Since |
|---------|-------|---------|-------|
| `chat.agent.enabled` | `true` | Enable custom agents | 1.109 |
| `chat.agentSkillsLocations` | `[".github/skills"]` | Auto-load skills | 1.109 |
| `chat.useAgentsMdFile` | `true` | Use AGENTS.md | 1.109 |
| `chat.mcp.gallery.enabled` | `true` | MCP tool access | 1.109 |
| `chat.hooks.enabled` | `true` | Lifecycle hooks (Preview) | 1.109 |
| `chat.useCustomAgentHooks` | `true` | Agent-scoped hooks (Preview) | 1.111 |
| `chat.autopilot.enabled` | `true` | Autopilot mode (Preview) | 1.111 |

## Integration Audit Checklist

**10-category audit scoring system** (5 points each, 50 total):

| # | Category | What to Check |
|---|----------|---------------|
| 1 | Activation Events | package.json activationEvents match actual needs |
| 2 | Extension Context | context.subscriptions, secrets, globalState usage |
| 3 | Disposable Management | All disposables pushed to subscriptions |
| 4 | Command Registration | Commands in package.json match registerCommand |
| 5 | Configuration Access | getConfiguration usage, onDidChangeConfiguration |
| 6 | Webview Security | CSP policies, nonce usage, enableScripts |
| 7 | Language Model/Chat | vscode.lm patterns, tool registration |
| 8 | Telemetry | vscode.env.isTelemetryEnabled respected |
| 9 | Error Handling | try/catch patterns, error type handling |
| 10 | File System | vscode.workspace.fs vs Node.js fs |

**Quick wins** (high impact, low effort):
- Telemetry opt-out: Check `vscode.env.isTelemetryEnabled`
- CSP on webviews: Add Content-Security-Policy with nonce
- Config listeners: Add `onDidChangeConfiguration` for runtime updates
- Secret storage: Use `context.secrets` instead of settings for tokens

**Scoring**:
- 45-50: Excellent — Ready for publish
- 40-44: Good — Minor fixes
- 35-39: Fair — Address before publish
- <35: Needs Work — Major refactoring

**When to apply**: Before marketplace publishing, after major features, quarterly reviews.
