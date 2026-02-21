/**
 * Background File Watcher — v5.9.8
 *
 * Low-priority ambient workspace observer. Silently tracks:
 *   - Files opened repeatedly (>5x in the last 7 days) — "hot files"
 *   - Files modified but not yet committed — "stalled work"
 *   - TODO/FIXME density in recently-touched files — "todo hotspots"
 *
 * Observations are stored in `.github/episodic/peripheral/file-observations.json`
 * and loaded into PeripheralContext on every @alex request to give Alex
 * ambient awareness without the user having to explain their focus.
 *
 * Design principles:
 *   - Zero notifications — never interrupts the user
 *   - Low I/O overhead — write-debounced (2s), reads only on chat activation
 *   - Respects SKIP_DIRS — never watches node_modules / .git / build output
 *   - 7-day rolling window — stale observations are automatically pruned
 *   - TODO scan is limited to the 15 most-recently opened files
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';

// ============================================================================
// Types
// ============================================================================

export interface FileOpenRecord {
    /** Workspace-relative path (forward slashes) */
    file: string;
    /** Open timestamps in the last 7 days (unix ms) */
    openTimestamps: number[];
}

export interface TodoHotspot {
    file: string;
    /** Number of TODO / FIXME / HACK / XXX comments found */
    todoCount: number;
    /** Unix ms of last scan */
    scannedAt: number;
}

export interface PeripheralObservations {
    /** Files opened ≥ HOT_FILE_THRESHOLD times in the rolling 7-day window */
    hotFiles: string[];
    /** Files modified on disk but not yet committed (git status --porcelain) */
    stalledFiles: string[];
    /** Top todo hotspots — files with highest TODO/FIXME density */
    todoHotspots: TodoHotspot[];
    /** Unix ms when this snapshot was last persisted */
    lastUpdated: number;
}

// ============================================================================
// Constants
// ============================================================================

const HOT_FILE_THRESHOLD = 5;        // opens in 7 days to qualify as "hot"
const ROLLING_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_TODO_FILES = 15;           // how many recently-opened files to scan for TODOs
const MAX_STALLED_FILES = 10;        // cap on stalled file list
const MAX_HOT_FILES = 8;             // cap on hot file list
const MAX_HOTSPOTS = 5;              // top N todo-dense files to surface
const OBSERVATION_FILE = path.join('.github', 'episodic', 'peripheral', 'file-observations.json');
const SKIP_DIRS = new Set([
    'node_modules', '.git', 'out', 'dist', 'build',
    '.venv', '__pycache__', '.cache', '.next', 'coverage', 'archive',
]);

// Regex for TODO / FIXME / HACK / XXX comments
const TODO_PATTERN = /\b(TODO|FIXME|HACK|XXX)\b/gi;

// ============================================================================
// In-memory state (flushed to disk with debounce)
// ============================================================================

/** Map from workspace-relative path → open timestamps */
const _openLog = new Map<string, number[]>();

let _workspaceRoot = '';
let _flushTimer: ReturnType<typeof setTimeout> | null = null;

// ============================================================================
// Helpers
// ============================================================================

function toRelative(absPath: string): string {
    if (!_workspaceRoot) { return absPath; }
    return path.relative(_workspaceRoot, absPath).replace(/\\/g, '/');
}

function isIgnored(relPath: string): boolean {
    const parts = relPath.split('/');
    return parts.some(p => SKIP_DIRS.has(p) || p.startsWith('.'));
}

/** Run a git command in the workspace root; returns '' on failure. */
function runGit(args: string): string {
    if (!_workspaceRoot) { return ''; }
    try {
        return execSync(`git ${args}`, {
            cwd: _workspaceRoot,
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 3000,
            encoding: 'utf-8',
        }).trim();
    } catch {
        return '';
    }
}

/** Return the set of files that are untracked or modified (not committed). */
function getStalledFiles(): string[] {
    const out = runGit('status --porcelain');
    if (!out) { return []; }
    return out
        .split('\n')
        .filter(Boolean)
        .map(line => line.slice(3).trim())   // "M  src/foo.ts" → "src/foo.ts"
        .filter(f => !isIgnored(f))
        .slice(0, MAX_STALLED_FILES);
}

/** Count TODO/FIXME/HACK/XXX in a file. Returns 0 on read error. */
function countTodos(absPath: string): number {
    try {
        const content = fs.readFileSync(absPath, 'utf-8');
        return (content.match(TODO_PATTERN) || []).length;
    } catch {
        return 0;
    }
}

// ============================================================================
// Persistence
// ============================================================================

async function loadObservations(): Promise<PeripheralObservations | null> {
    if (!_workspaceRoot) { return null; }
    try {
        const filePath = path.join(_workspaceRoot, OBSERVATION_FILE);
        if (!await fs.pathExists(filePath)) { return null; }
        return await fs.readJson(filePath) as PeripheralObservations;
    } catch {
        return null;
    }
}

async function persist(): Promise<void> {
    if (!_workspaceRoot) { return; }

    const now = Date.now();
    const cutoff = now - ROLLING_WINDOW_MS;

    // Prune and compute hot files from in-memory log
    const hotFiles: string[] = [];
    for (const [file, timestamps] of _openLog) {
        const recent = timestamps.filter(t => t > cutoff);
        if (recent.length === 0) {
            _openLog.delete(file);
        } else {
            _openLog.set(file, recent);
            if (recent.length >= HOT_FILE_THRESHOLD) {
                hotFiles.push(file);
            }
        }
    }

    // Sort hot files by open count descending, cap list
    const sortedHot = hotFiles
        .sort((a, b) => (_openLog.get(b)?.length ?? 0) - (_openLog.get(a)?.length ?? 0))
        .slice(0, MAX_HOT_FILES);

    // Git stalled files
    const stalledFiles = getStalledFiles();

    // TODO scan: top MAX_TODO_FILES most-recently-opened files
    const recentlyOpened = [..._openLog.entries()]
        .sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]))
        .slice(0, MAX_TODO_FILES)
        .map(([file]) => file);

    const todoHotspots: TodoHotspot[] = recentlyOpened
        .map(file => ({
            file,
            todoCount: countTodos(path.join(_workspaceRoot, file)),
            scannedAt: now,
        }))
        .filter(h => h.todoCount > 0)
        .sort((a, b) => b.todoCount - a.todoCount)
        .slice(0, MAX_HOTSPOTS);

    const observations: PeripheralObservations = {
        hotFiles: sortedHot,
        stalledFiles,
        todoHotspots,
        lastUpdated: now,
    };

    try {
        const filePath = path.join(_workspaceRoot, OBSERVATION_FILE);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeJson(filePath, observations, { spaces: 2 });
    } catch (err) {
        console.warn('[FileWatcher] Failed to persist observations:', err);
    }
}

/** Debounced persist — coalesces rapid file-open events into one write. */
function schedulePersist(): void {
    if (_flushTimer) { clearTimeout(_flushTimer); }
    _flushTimer = setTimeout(() => {
        _flushTimer = null;
        persist().catch(() => {});
    }, 2000);
}

// ============================================================================
// Event handlers
// ============================================================================

function onEditorChanged(editor: vscode.TextEditor | undefined): void {
    if (!editor || !_workspaceRoot) { return; }
    const absPath = editor.document.uri.fsPath;

    // Only track files inside the workspace
    if (!absPath.startsWith(_workspaceRoot)) { return; }

    const rel = toRelative(absPath);
    if (isIgnored(rel)) { return; }

    const timestamps = _openLog.get(rel) ?? [];
    timestamps.push(Date.now());
    _openLog.set(rel, timestamps);

    schedulePersist();
}

function onFileSaved(uri: vscode.Uri): void {
    if (!_workspaceRoot) { return; }
    if (!uri.fsPath.startsWith(_workspaceRoot)) { return; }

    const rel = toRelative(uri.fsPath);
    if (isIgnored(rel)) { return; }

    // Ensure the file is in our open log so it gets TODO-scanned
    if (!_openLog.has(rel)) {
        _openLog.set(rel, [Date.now()]);
    }

    schedulePersist();
}

// ============================================================================
// Bootstrap: load persisted open log into in-memory state
// ============================================================================

async function loadOpenLogFromDisk(): Promise<void> {
    const obs = await loadObservations();
    if (!obs) { return; }

    // Reconstruct approximate timestamps from hot files — we don't store raw
    // timestamps per file in the JSON, just the hot list. So seed each hot
    // file with HOT_FILE_THRESHOLD synthetic timestamps near lastUpdated.
    const base = obs.lastUpdated || Date.now();
    for (const file of obs.hotFiles) {
        if (!_openLog.has(file)) {
            const synthetic = Array.from({ length: HOT_FILE_THRESHOLD }, (_, i) => base - i * 3600_000);
            _openLog.set(file, synthetic);
        }
    }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Register the background file watcher.
 * Call once from `activate()`. Returns a Disposable.
 */
export function registerFileWatcher(
    context: vscode.ExtensionContext,
    workspaceRoot: string
): vscode.Disposable {
    if (!workspaceRoot) {
        return { dispose: () => {} };
    }

    _workspaceRoot = workspaceRoot;

    // Load existing observations from disk into memory (non-blocking)
    loadOpenLogFromDisk().catch(() => {});

    const disposables: vscode.Disposable[] = [];

    // Track active editor changes (file open/switch events)
    disposables.push(
        vscode.window.onDidChangeActiveTextEditor(onEditorChanged)
    );

    // Track file saves via FileSystemWatcher for broader coverage
    const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(workspaceRoot, '**/*'),
        true,   // ignoreCreateEvents
        false,  // ignoreChangeEvents — we want saves
        true    // ignoreDeleteEvents
    );
    watcher.onDidChange(onFileSaved, undefined, disposables);
    disposables.push(watcher);

    // Seed initial state from current editor
    if (vscode.window.activeTextEditor) {
        onEditorChanged(vscode.window.activeTextEditor);
    }

    console.log('[FileWatcher] Background file observer registered');

    return vscode.Disposable.from(...disposables);
}

/**
 * Load persisted peripheral observations for injection into PeripheralContext.
 * Called from `gatherPeripheralContext()` — reads from disk, never blocks.
 */
export async function loadPeripheralObservations(
    workspaceRoot: string
): Promise<PeripheralObservations | null> {
    if (!workspaceRoot) { return null; }
    const savedRoot = _workspaceRoot;
    _workspaceRoot = workspaceRoot;
    const result = await loadObservations();
    _workspaceRoot = savedRoot;
    return result;
}
