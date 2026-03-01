/**
 * Task Detector — v6.0.0
 *
 * Autonomous task detection: consumes Background File Watcher signals to
 * proactively surface pending work — stalled commits, TODO hotspots,
 * and large uncommitted diffs that should be reviewed.
 *
 * Design:
 *  - Runs a check 5 minutes after activation, then every 30 minutes
 *  - Non-intrusive: single toast notification with "Review with @alex" or "Dismiss (4h)"
 *  - 4-hour cooldown after dismiss to avoid nagging
 *  - Code review trigger: watches file saves, suggests review when diff > threshold
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';

// ============================================================================
// Types
// ============================================================================

export interface PendingTask {
    type: 'stalled-work' | 'todo-hotspot' | 'review-needed';
    title: string;
    detail: string;
    files: string[];
    priority: 'high' | 'medium' | 'low';
}

// ============================================================================
// Constants
// ============================================================================

const OBSERVATION_FILE = path.join('.github', 'episodic', 'peripheral', 'file-observations.json');
const CHECK_INTERVAL_MS = 30 * 60 * 1000;     // 30 min
const STARTUP_DELAY_MS = 5 * 60 * 1000;       // 5 min after activation
const DISMISS_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
const TODO_HOTSPOT_THRESHOLD = 3;              // TODOs to qualify as hotspot
const CODE_REVIEW_DIFF_LINES = 200;            // lines changed to trigger review suggestion
const CODE_REVIEW_DEBOUNCE_MS = 60 * 1000;    // 1 min debounce after save

const LAST_CHECK_KEY = 'alex.taskDetector.lastCheck';
const DISMISSED_KEY = 'alex.taskDetector.dismissed';
const LAST_COMMIT_KEY = 'alex.taskDetector.lastCommit';

// ============================================================================
// State
// ============================================================================

let _ctx: vscode.ExtensionContext | undefined;
let _workspaceRoot = '';
let _checkInterval: ReturnType<typeof setInterval> | null = null;
let _codeReviewDebounce: ReturnType<typeof setTimeout> | null = null;
let _codeReviewDisposable: vscode.Disposable | null = null;

// ============================================================================
// Initialization
// ============================================================================

export function initTaskDetector(
    context: vscode.ExtensionContext,
    workspaceRoot: string
): void {
    _ctx = context;
    _workspaceRoot = workspaceRoot;

    // Delayed startup check
    const startupTimer = setTimeout(() => checkTasks(false), STARTUP_DELAY_MS);
    context.subscriptions.push({ dispose: () => clearTimeout(startupTimer) });

    // Periodic checks
    _checkInterval = setInterval(() => checkTasks(false), CHECK_INTERVAL_MS);
    context.subscriptions.push({ dispose: () => { if (_checkInterval) { clearInterval(_checkInterval); } } });

    // Code review watcher — fires on every file save
    _codeReviewDisposable = vscode.workspace.onDidSaveTextDocument(doc => {
        if (!doc.uri.fsPath.startsWith(workspaceRoot)) { return; }
        scheduleCodeReviewCheck();
    });
    context.subscriptions.push(_codeReviewDisposable);
}

// ============================================================================
// Peripheral observation loading
// ============================================================================

async function loadObservations(): Promise<{
    stalledFiles: string[];
    todoHotspots: { file: string; todoCount: number }[];
    lastUpdated: number;
} | null> {
    if (!_workspaceRoot) { return null; }
    const p = path.join(_workspaceRoot, OBSERVATION_FILE);
    if (!await fs.pathExists(p)) { return null; }
    try {
        return await fs.readJson(p);
    } catch {
        return null;
    }
}

// ============================================================================
// Task Detection
// ============================================================================

export async function detectPendingTasks(): Promise<PendingTask[]> {
    const obs = await loadObservations();
    const tasks: PendingTask[] = [];

    if (obs) {
        if (obs.stalledFiles.length > 0) {
            const topFiles = obs.stalledFiles.slice(0, 5);
            const extra = obs.stalledFiles.length > 5 ? ` +${obs.stalledFiles.length - 5} more` : '';
            tasks.push({
                type: 'stalled-work',
                title: `${obs.stalledFiles.length} uncommitted file(s) detected`,
                detail: `Modified but not committed: ${topFiles.join(', ')}${extra}`,
                files: obs.stalledFiles,
                priority: obs.stalledFiles.length >= 5 ? 'high' : 'medium',
            });
        }

        const hotspots = obs.todoHotspots.filter(h => h.todoCount >= TODO_HOTSPOT_THRESHOLD);
        if (hotspots.length > 0) {
            tasks.push({
                type: 'todo-hotspot',
                title: `${hotspots.length} file(s) with TODO clusters`,
                detail: hotspots.map(h => `${h.file} (${h.todoCount} TODOs)`).join(', '),
                files: hotspots.map(h => h.file),
                priority: 'low',
            });
        }
    }

    return tasks;
}

async function checkTasks(force: boolean): Promise<void> {
    if (!_ctx || !_workspaceRoot) { return; }

    const now = Date.now();
    const lastCheck = _ctx.globalState.get<number>(LAST_CHECK_KEY, 0);
    if (!force && (now - lastCheck) < CHECK_INTERVAL_MS) { return; }
    await _ctx.globalState.update(LAST_CHECK_KEY, now);

    const tasks = await detectPendingTasks();
    const highPriority = tasks.filter(t => t.priority === 'high');
    if (highPriority.length === 0) { return; }

    const dismissed = _ctx.globalState.get<number>(DISMISSED_KEY, 0);
    if ((now - dismissed) < DISMISS_COOLDOWN_MS) { return; }

    const task = highPriority[0];
    const selection = await vscode.window.showInformationMessage(
        `🔍 Alex: ${task.title}`,
        { detail: task.detail, modal: false },
        'Review with @alex',
        'Dismiss (4h)',
    );

    if (selection === 'Review with @alex') {
        const q = `@alex I have ${task.files.length} uncommitted files. Help me review them and decide what to commit. Files: ${task.files.slice(0, 5).join(', ')}`;
        vscode.commands.executeCommand('workbench.action.chat.open', { query: q })
            .then(undefined, () => vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus'));
    } else if (selection === 'Dismiss (4h)') {
        await _ctx.globalState.update(DISMISSED_KEY, now);
    }
}

// ============================================================================
// Proactive Code Review Trigger
// ============================================================================

function getDiffLineCount(): number {
    if (!_workspaceRoot) { return 0; }
    try {
        const output = execSync('git diff --stat HEAD', {
            cwd: _workspaceRoot,
            timeout: 3000,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
        });
        // Last line: "X files changed, Y insertions(+), Z deletions(-)"
        const match = output.match(/(\d+) insertions?\(\+\).*?(\d+) deletions?\(-\)/);
        if (match) {
            return parseInt(match[1], 10) + parseInt(match[2], 10);
        }
        // Just insertions or deletions
        const ins = output.match(/(\d+) insertions?\(\+\)/);
        const del = output.match(/(\d+) deletions?\(-\)/);
        return (ins ? parseInt(ins[1], 10) : 0) + (del ? parseInt(del[1], 10) : 0);
    } catch {
        return 0;
    }
}

function scheduleCodeReviewCheck(): void {
    if (_codeReviewDebounce) { clearTimeout(_codeReviewDebounce); }
    _codeReviewDebounce = setTimeout(async () => {
        _codeReviewDebounce = null;
        if (!_ctx) { return; }

        const diffLines = getDiffLineCount();
        if (diffLines < CODE_REVIEW_DIFF_LINES) { return; }

        // Avoid repeating within 30 min
        const lastReviewNudge = _ctx.globalState.get<number>('alex.codeReviewNudge', 0);
        if ((Date.now() - lastReviewNudge) < 30 * 60 * 1000) { return; }
        await _ctx.globalState.update('alex.codeReviewNudge', Date.now());

        const selection = await vscode.window.showInformationMessage(
            `📋 Alex: ${diffLines} lines changed — want a code review before committing?`,
            'Review with @alex',
            'Not now',
        );

        if (selection === 'Review with @alex') {
            vscode.commands.executeCommand('alex.codeReview');
        }
    }, CODE_REVIEW_DEBOUNCE_MS);
}

// ============================================================================
// Commands
// ============================================================================

/** alex.showPendingTasks — open task picker */
export async function showPendingTasksCommand(): Promise<void> {
    const tasks = await detectPendingTasks();

    if (tasks.length === 0) {
        vscode.window.showInformationMessage('✅ No pending tasks detected. Workspace looks clean!');
        return;
    }

    const iconMap: Record<PendingTask['type'], string> = {
        'stalled-work': 'git-commit',
        'todo-hotspot': 'tasklist',
        'review-needed': 'code-review',
    };

    const items = tasks.map(t => ({
        label: `$(${iconMap[t.type]}) ${t.title}`,
        description: t.priority,
        detail: t.detail,
        task: t,
    }));

    const chosen = await vscode.window.showQuickPick(items, {
        title: `Alex Task Detector — ${tasks.length} task(s) pending`,
        placeHolder: 'Select to review with @alex',
    });

    if (!chosen) { return; }

    const q = `@alex Help me address: ${chosen.task.title}. ${chosen.task.detail}`;
    vscode.commands.executeCommand('workbench.action.chat.open', { query: q })
        .then(undefined, () => vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus'));
}

/** Force-run a task check immediately (for testing/manual trigger) */
export async function forceCheckTasksCommand(): Promise<void> {
    await checkTasks(true);
}
