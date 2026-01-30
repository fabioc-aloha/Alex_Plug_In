# VS Code Extension Development Patterns

**Domain**: VS Code Extension Architecture
**Created**: 2026-01-29
**Source**: v3.4.2 Focus Implementation Session

---

## Webview Dashboard Pattern

### Async Data Gathering
When building rich webviews that need data from multiple sources:

```typescript
async function refreshDashboard(): Promise<void> {
    // Gather all data in parallel
    const [health, knowledge, sync, goals, version] = await Promise.all([
        checkHealth(true),
        getKnowledgeSummary(),
        getSyncStatus(),
        getGoalsSummary(),
        getVersion()
    ]);

    // Build HTML with awaited async functions
    panel.webview.html = await getWebviewContent(health, knowledge, sync, goals, version);
}
```

**Key Insight**: When webview content generation needs async operations (like directory scanning), make `getWebviewContent` async and await it in the refresh function.

---

## Learning Goals with Streak Tracking

### Data Structure
```typescript
interface LearningGoal {
    id: string;
    title: string;
    category: 'coding' | 'reading' | 'practice' | 'review' | 'other';
    targetCount: number;
    currentCount: number;
    type: 'daily' | 'weekly';
    createdAt: string;
    expiresAt: string;
}

interface GoalsData {
    goals: LearningGoal[];
    streakDays: number;
    lastCompletedDate: string | null;
    totalCompleted: number;
}
```

### Auto-Increment Pattern
Goals auto-increment when specific activities complete:
- Session completion → increment 'session' category goals
- Insight saved → increment 'insight' category goals

```typescript
export async function autoIncrementGoals(activityType: 'session' | 'insight'): Promise<void> {
    const data = await loadGoalsData();
    const today = new Date().toISOString().split('T')[0];

    for (const goal of data.goals) {
        if (shouldIncrement(goal, activityType) && !isExpired(goal)) {
            goal.currentCount = Math.min(goal.currentCount + 1, goal.targetCount);
        }
    }

    await saveGoalsData(data);
}
```

---

## Auto-Insight Detection Pattern

### Pattern Matching with Confidence
```typescript
const INSIGHT_PATTERNS = [
    { pattern: /(?:learned|discovered|realized|found out)\s+(?:that\s+)?(.+)/i, confidence: 0.8 },
    { pattern: /(?:key insight|important|the trick is|the solution is)\s*[:\-]?\s*(.+)/i, confidence: 0.85 },
    { pattern: /(?:best practice|pattern|approach)\s*[:\-]?\s*(.+)/i, confidence: 0.75 },
];
```

### Duplicate Detection
```typescript
function isDuplicateInsight(newInsight: string, existingInsights: string[]): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '');
    const newNorm = normalize(newInsight);

    return existingInsights.some(existing => {
        const existNorm = normalize(existing);
        // Check for high similarity (>80% overlap)
        return calculateSimilarity(newNorm, existNorm) > 0.8;
    });
}
```

---

## Publishing Workflow

### PAT from .env Pattern
```powershell
$env:VSCE_PAT = (Get-Content .env | Select-String "VSCE_PAT" | ForEach-Object { $_.Line.Split("=",2)[1] })
vsce publish
```

### Version Collision Handling
If `vsce publish` returns "version already exists":
1. Increment patch version in package.json
2. Update version in copilot-instructions.md header
3. Update version badge in README.md
4. Update CHANGELOG.md entry
5. Retry publish

---

## Activity Bar Welcome View

### TreeDataProvider Pattern
```typescript
class WelcomeViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtmlContent();

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'refresh': await this.refresh(); break;
                case 'action': await this.handleAction(message.action); break;
            }
        });
    }
}
```

### Registration
```typescript
// In package.json contributes.views
"alex-sidebar": [
    { "id": "alex.welcomeView", "name": "Alex", "type": "webview" }
]

// In extension.ts
context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('alex.welcomeView', new WelcomeViewProvider())
);
```

---

## Safe Configuration Pattern

### Tiered Settings Architecture
When allowing users to configure settings programmatically:

```typescript
interface SettingCategory {
    name: string;
    description: string;
    settings: Record<string, unknown>;
    icon: string;
}

const SETTING_CATEGORIES: SettingCategory[] = [
    {
        name: 'Essential',
        description: 'Required for functionality',
        settings: ESSENTIAL_SETTINGS,
        icon: '🔴'
    },
    {
        name: 'Recommended',
        description: 'Improves experience',
        settings: RECOMMENDED_SETTINGS,
        icon: '🟡'
    },
    {
        name: 'Nice-to-Have',
        description: 'Quality of life',
        settings: NICE_TO_HAVE_SETTINGS,
        icon: '🟢'
    }
];
```

### Safety Guarantees
1. **Additive only** - Never modify or remove existing settings
2. **Skip existing** - Check `config.inspect(key)?.globalValue` before applying
3. **Preview first** - Show exact JSON before applying
4. **User choice** - Multi-select for category approval
5. **Lifecycle hooks** - Offer at init/upgrade, not randomly

### Application Pattern
```typescript
async function applySettings(settings: Record<string, unknown>): Promise<{ applied: string[], skipped: string[] }> {
    const config = vscode.workspace.getConfiguration();
    for (const [key, value] of Object.entries(settings)) {
        if (config.inspect(key)?.globalValue === undefined) {
            await config.update(key, value, vscode.ConfigurationTarget.Global);
        }
    }
}
```

**Key Insight**: Proactive features should always preserve user autonomy. Offer, don't impose.

---

## Synapses

### Connection Mapping

- [release-management.instructions.md] (High, Enables, Forward) - "Publishing workflow patterns"
- [DK-DOCUMENTATION-EXCELLENCE.md] (Medium, Enhances, Bidirectional) - "README badge patterns"
- [bootstrap-learning.instructions.md] (High, Integrates, Bidirectional) - "Goal tracking for learning"
- [DK-RECOMMENDED-ENVIRONMENT.md] (High, Implements, Bidirectional) - "Safe configuration pattern in action"
- [alex-initialization.prompt.md] (Medium, Triggers, Forward) - "Environment setup during initialization"

### Activation Patterns
- VS Code extension development → Reference webview patterns
- Publishing extension → Follow PAT workflow
- Adding learning features → Use goals/streak pattern
- Auto-detection features → Apply confidence-based matching
- Settings configuration → Use safe tiered settings pattern
- Proactive features → Apply additive-only approach
