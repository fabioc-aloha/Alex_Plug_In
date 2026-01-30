# VS Code Extension Patterns Skill

> Reusable patterns for VS Code extension development.

## ⚠️ Staleness Warning

VS Code APIs evolve with each monthly release. Patterns may become outdated or better alternatives may emerge.

**Refresh triggers:**

- VS Code major/minor releases
- New proposed APIs becoming stable
- Extension API deprecations
- Webview security policy changes

**Last validated:** January 2026 (VS Code 1.96+)

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

## Safe Configuration Pattern

**Tiered settings**: Essential (🔴) → Recommended (🟡) → Nice-to-Have (🟢)

**Safety rules**:

- Additive only — never modify/remove existing
- Check `config.inspect(key)?.globalValue` before applying
- Preview JSON before changes
- User chooses categories

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

```powershell
# Load PAT from .env
$env:VSCE_PAT = (Get-Content .env | Select-String "VSCE_PAT" | ForEach-Object { $_.Line.Split("=",2)[1] })
vsce publish
```

**Version collision**: Increment patch → update package.json, README badge, CHANGELOG → retry.

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

## Synapses

See [synapses.json](synapses.json) for connections.
