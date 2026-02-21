/**
 * Peripheral Vision - v5.9.7
 *
 * Gives Alex ambient workspace awareness beyond the currently open file.
 * Scans: git status, recently modified files, dependency manifests,
 * test framework detection, dependency freshness, test runner results,
 * and sibling (peer) projects in the parent folder.
 *
 * The parent folder expansion is intentional: knowing that AlexPapers, 
 * Alex-Global-Knowledge, and other sibling repos exist — and their git state —
 * helps Alex give context-aware cross-project guidance.
 *
 * Design principles:
 *  - All I/O wrapped in try/catch (never throws, never blocks)
 *  - 60-second cache to avoid repeated filesystem hits per session
 *  - Git commands have 3s timeout and silently fail on non-git folders
 *  - Peer project scan uses technology markers; skips non-code directories
 *  - npm outdated uses 10s timeout; silently skips on failure
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';
import { loadPeripheralObservations, PeripheralObservations } from './fileWatcher';

// ============================================================================
// Types
// ============================================================================

export interface PeerProject {
    /** Directory name (e.g., "Alex-Global-Knowledge") */
    name: string;
    /** Absolute path on disk */
    path: string;
    /** Detected technology stack (e.g., ["TypeScript/Node.js", "Python"]) */
    tech: string[];
    /** Current git branch, if the folder is a git repo */
    branch?: string;
    /** Most recent commit message (truncated to 60 chars) */
    lastCommit?: string;
    /** Number of uncommitted files */
    uncommittedCount?: number;
}

export interface GitSummary {
    branch: string;
    uncommittedCount: number;
    /** Last 3 commit subject lines (50-char truncated) */
    lastCommits: string[];
    isClean: boolean;
}

export interface RecentChange {
    /** Workspace-relative path with forward slashes */
    file: string;
    /** Minutes since last modification */
    minsAgo: number;
}

export interface PeripheralContext {
    /** Parent folder that contains the workspace and its sibling projects */
    parentFolder: string;
    /** Sibling projects discovered in parentFolder */
    peerProjects: PeerProject[];
    /** Git summary for the current workspace root */
    git?: GitSummary;
    /** Files modified within the last 24 hours in the workspace */
    recentChanges: RecentChange[];
    /** Package manager / manifest files detected (e.g., "npm", "pip", "cargo") */
    detectedManifests: string[];
    /** Test framework detected from package.json / config files */
    testFramework?: string;
    /** v5.9.7: Outdated npm packages (null = not scanned or no package.json) */
    dependencyFreshness?: DependencyFreshnessResult;
    /** v5.9.7: Test runner results from last known run */
    testRunnerStatus?: TestRunnerStatus;
    /** v5.9.8: Background file watcher observations (hot files, stalled work, TODO hotspots) */
    fileWatcherObservations?: PeripheralObservations;
    /** Unix timestamp when this snapshot was taken (used for cache TTL) */
    scannedAt: number;
}

/** A single outdated npm package entry. */
export interface OutdatedPackage {
    name: string;
    current: string;
    wanted: string;
    latest: string;
    /** Upgrade severity derived from semver diff */
    severity: 'major' | 'minor' | 'patch';
}

/** Result of scanning npm for outdated dependencies. */
export interface DependencyFreshnessResult {
    outdated: OutdatedPackage[];
    /** Unix timestamp of the scan */
    scannedAt: number;
    /** Non-empty if the scan failed */
    error?: string;
}

/** Summary of the last known test run. */
export interface TestRunnerStatus {
    framework: string;
    /** Unix timestamp of the last recorded test run (null = unknown) */
    lastRunAt: number | null;
    daysSinceLastRun: number | null;
    lastRunPassed: boolean | null;
    totalTests: number;
    failedTests: number;
    passRate: number | null;
}

// ============================================================================
// Cache (60-second TTL so repeated messages within a session reuse the scan)
// ============================================================================

interface CacheEntry {
    context: PeripheralContext;
    expires: number;
}

const _cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

// ============================================================================
// Git helpers
// ============================================================================

/**
 * Run a git command in `cwd`, returning trimmed stdout or '' on any failure.
 * The 3s timeout prevents hanging on slow/network-backed filesystems.
 */
function runGit(cwd: string, args: string): string {
    try {
        return execSync(`git ${args}`, {
            cwd,
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 3000,
            encoding: 'utf-8',
        }).trim();
    } catch {
        return '';
    }
}

/** Full git summary for the current workspace. Returns undefined if not a git repo. */
function getGitSummary(projectPath: string): GitSummary | undefined {
    const topLevel = runGit(projectPath, 'rev-parse --show-toplevel');
    if (!topLevel) { return undefined; }

    const branch = runGit(projectPath, 'branch --show-current') || 'detached';
    const statusOut = runGit(projectPath, 'status --porcelain');
    const uncommittedCount = statusOut
        ? statusOut.split('\n').filter(Boolean).length
        : 0;

    // --no-merges keeps the log focused on real work commits
    const logOut = runGit(projectPath, 'log --oneline --no-merges -5 --pretty=format:"%s"');
    const lastCommits = logOut
        ? logOut.split('\n').filter(Boolean).slice(0, 3)
            .map(msg => msg.replace(/^"|"$/g, '').substring(0, 60))
        : [];

    return { branch, uncommittedCount, lastCommits, isClean: uncommittedCount === 0 };
}

/** Lightweight git probe for peer projects (avoids full log scan). */
function getShallowGitStatus(projectPath: string): {
    branch?: string;
    uncommittedCount?: number;
    lastCommit?: string;
} {
    const topLevel = runGit(projectPath, 'rev-parse --show-toplevel');
    if (!topLevel) { return {}; }

    const branch = runGit(projectPath, 'branch --show-current') || undefined;
    const statusOut = runGit(projectPath, 'status --porcelain');
    const uncommittedCount = statusOut
        ? statusOut.split('\n').filter(Boolean).length
        : 0;
    const lastCommit = runGit(projectPath,
        'log --oneline --no-merges -1 --pretty=format:"%s"')
        .replace(/^"|"$/g, '')
        .substring(0, 60) || undefined;

    return { branch, uncommittedCount, lastCommit };
}

// ============================================================================
// Technology detection
// ============================================================================

const TECH_MARKERS: Array<{ file: string; label: string; wildcard?: boolean }> = [
    { file: 'package.json',     label: 'TypeScript/Node.js' },
    { file: 'tsconfig.json',    label: 'TypeScript' },
    { file: 'requirements.txt', label: 'Python' },
    { file: 'pyproject.toml',   label: 'Python' },
    { file: 'Cargo.toml',       label: 'Rust' },
    { file: 'go.mod',           label: 'Go' },
    { file: 'pom.xml',          label: 'Java/Maven' },
    { file: 'build.gradle',     label: 'Java/Gradle' },
    { file: 'Gemfile',          label: 'Ruby' },
    { file: 'composer.json',    label: 'PHP' },
    { file: 'CMakeLists.txt',   label: 'C/C++' },
    { file: '.tex',             label: 'LaTeX', wildcard: true },
    { file: '.bicep',           label: 'Bicep/Azure', wildcard: true },
    { file: '.md',              label: 'Markdown', wildcard: true },
];

function detectTech(projectPath: string): string[] {
    const found = new Set<string>();
    try {
        const entries = fs.readdirSync(projectPath, { withFileTypes: true });
        for (const marker of TECH_MARKERS) {
            if (marker.wildcard) {
                if (entries.some(e => e.isFile() && e.name.endsWith(marker.file))) {
                    found.add(marker.label);
                }
            } else {
                if (entries.some(e => e.name === marker.file)) {
                    found.add(marker.label);
                }
            }
        }
    } catch { /* ignore unreadable dirs */ }
    return [...found];
}

const MANIFEST_CHECKS: Array<{ file: string; label: string }> = [
    { file: 'package.json',     label: 'npm' },
    { file: 'yarn.lock',        label: 'yarn' },
    { file: 'pnpm-lock.yaml',   label: 'pnpm' },
    { file: 'requirements.txt', label: 'pip' },
    { file: 'pyproject.toml',   label: 'poetry/pyproject' },
    { file: 'Cargo.toml',       label: 'cargo' },
    { file: 'go.mod',           label: 'go modules' },
];

function detectManifests(projectPath: string): string[] {
    return MANIFEST_CHECKS
        .filter(check => fs.existsSync(path.join(projectPath, check.file)))
        .map(check => check.label);
}

function detectTestFramework(projectPath: string): string | undefined {
    try {
        const pkgPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = fs.readJsonSync(pkgPath) as Record<string, Record<string, string>>;
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps['jest'] || deps['@jest/core'])  { return 'jest'; }
            if (deps['vitest'])                      { return 'vitest'; }
            if (deps['mocha'])                       { return 'mocha'; }
            if (deps['jasmine'])                     { return 'jasmine'; }
        }
    } catch { /* ignore */ }

    if (fs.existsSync(path.join(projectPath, 'pytest.ini')) ||
        fs.existsSync(path.join(projectPath, 'setup.cfg'))) {
        return 'pytest';
    }
    return undefined;
}

// ============================================================================
// Dependency freshness (npm outdated)
// ============================================================================

/**
 * A longer separate cache for dependency freshness — npm outdated is slow (network).
 * 5 minutes TTL so repeated questions don't trigger repeated npm calls.
 */
const _depCache = new Map<string, { result: DependencyFreshnessResult; expires: number }>();
const DEP_CACHE_TTL_MS = 5 * 60_000;

/** Parse semver major version number from a string like "1.2.3". */
function parseMajor(v: string): number {
    return parseInt(v.split('.')[0] ?? '0', 10) || 0;
}

/** Classify the severity of an upgrade from `current` to `latest`. */
function classifySeverity(current: string, latest: string): OutdatedPackage['severity'] {
    const cMajor = parseMajor(current);
    const lMajor = parseMajor(latest);
    if (lMajor > cMajor) { return 'major'; }

    const cParts = current.split('.');
    const lParts = latest.split('.');
    if ((parseInt(lParts[1] ?? '0', 10) || 0) > (parseInt(cParts[1] ?? '0', 10) || 0)) {
        return 'minor';
    }
    return 'patch';
}

/**
 * Run `npm outdated --json` in the workspace root and return structured results.
 * `npm outdated` exits with code 1 when packages ARE outdated, so we must
 * catch the spawn error and still parse stdout.
 */
export function getDependencyFreshness(workspaceRoot: string): DependencyFreshnessResult {
    const cached = _depCache.get(workspaceRoot);
    if (cached && cached.expires > Date.now()) { return cached.result; }

    // Skip if no package.json
    if (!fs.existsSync(path.join(workspaceRoot, 'package.json'))) {
        return { outdated: [], scannedAt: Date.now() };
    }

    let stdout = '';
    try {
        stdout = execSync('npm outdated --json', {
            cwd: workspaceRoot,
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 10_000,
            encoding: 'utf-8',
        });
    } catch (err: unknown) {
        // npm exits with code 1 when packages are outdated — stdout still has valid JSON
        // Access stdout from the error object that execSync throws
        const spawnErr = err as { stdout?: string; status?: number };
        if (typeof spawnErr.stdout === 'string') {
            stdout = spawnErr.stdout;
        } else {
            const result: DependencyFreshnessResult = {
                outdated: [], scannedAt: Date.now(), error: String(err),
            };
            _depCache.set(workspaceRoot, { result, expires: Date.now() + DEP_CACHE_TTL_MS });
            return result;
        }
    }

    try {
        const raw = JSON.parse(stdout || '{}') as Record<string, {
            current?: string; wanted?: string; latest?: string;
        }>;

        const outdated: OutdatedPackage[] = Object.entries(raw)
            .filter(([, v]) => v.current && v.latest && v.current !== v.latest)
            .map(([name, v]) => ({
                name,
                current: v.current ?? '?',
                wanted: v.wanted ?? v.latest ?? '?',
                latest: v.latest ?? '?',
                severity: classifySeverity(v.current ?? '0.0.0', v.latest ?? '0.0.0'),
            }))
            // Show most breaking first
            .sort((a, b) => {
                const rank = { major: 0, minor: 1, patch: 2 };
                return rank[a.severity] - rank[b.severity];
            });

        const result: DependencyFreshnessResult = { outdated, scannedAt: Date.now() };
        _depCache.set(workspaceRoot, { result, expires: Date.now() + DEP_CACHE_TTL_MS });
        return result;
    } catch {
        const result: DependencyFreshnessResult = {
            outdated: [], scannedAt: Date.now(), error: 'Failed to parse npm outdated output',
        };
        _depCache.set(workspaceRoot, { result, expires: Date.now() + DEP_CACHE_TTL_MS });
        return result;
    }
}

// ============================================================================
// Test runner awareness (file-based heuristics)
// ============================================================================

/** Jest coverage-summary.json shape (subset we care about). */
interface JestCoverageSummary {
    total?: { statements?: { pct?: number } };
}

/** Jest/Vitest JSON reporter shape. */
interface JestJsonResult {
    numTotalTests?: number;
    numFailedTests?: number;
    numPassedTests?: number;
    success?: boolean;
    testResults?: Array<{ status?: string }>;
}

/**
 * Try to read test runner status from well-known output files.
 * Supports:
 *  - jest --json    → jest-test-results.json
 *  - jest coverage  → coverage/coverage-summary.json (pass/fail not in here, but timestamp is)
 *  - vitest --reporter=json → test-results.json
 * Falls back to just reporting the detected framework with no run data.
 */
export function getTestRunnerStatus(workspaceRoot: string, framework?: string): TestRunnerStatus | undefined {
    if (!framework) { return undefined; }

    const candidates = [
        path.join(workspaceRoot, '.jest-test-results.json'),
        path.join(workspaceRoot, 'jest-test-results.json'),
        path.join(workspaceRoot, 'test-results.json'),
    ];

    for (const candidate of candidates) {
        try {
            if (!fs.existsSync(candidate)) { continue; }
            const stat = fs.statSync(candidate);
            const lastRunAt = stat.mtimeMs;
            const daysSinceLastRun = (Date.now() - lastRunAt) / 86_400_000;

            const raw = fs.readJsonSync(candidate) as JestJsonResult;
            const total = raw.numTotalTests ?? 0;
            const failed = raw.numFailedTests ?? 0;
            const passed = raw.numPassedTests ?? (total - failed);
            const passRate = total > 0 ? +(passed / total * 100).toFixed(1) : null;
            const lastRunPassed = raw.success !== undefined
                ? raw.success
                : (failed === 0 && total > 0);

            return {
                framework,
                lastRunAt,
                daysSinceLastRun: +daysSinceLastRun.toFixed(1),
                lastRunPassed,
                totalTests: total,
                failedTests: failed,
                passRate,
            };
        } catch { /* try next candidate */ }
    }

    // Fallback: coverage summary gives us a timestamp signal even without pass/fail
    const coverageSummary = path.join(workspaceRoot, 'coverage', 'coverage-summary.json');
    try {
        if (fs.existsSync(coverageSummary)) {
            const stat = fs.statSync(coverageSummary);
            const lastRunAt = stat.mtimeMs;
            const daysSinceLastRun = (Date.now() - lastRunAt) / 86_400_000;
            // coverage-summary.json doesn't have pass/fail; just surface the timestamp
            return {
                framework,
                lastRunAt,
                daysSinceLastRun: +daysSinceLastRun.toFixed(1),
                lastRunPassed: null,
                totalTests: 0,
                failedTests: 0,
                passRate: null,
            };
        }
    } catch { /* skip */ }

    // No result file found — surface framework name only
    return {
        framework,
        lastRunAt: null,
        daysSinceLastRun: null,
        lastRunPassed: null,
        totalTests: 0,
        failedTests: 0,
        passRate: null,
    };
}

// ============================================================================
// Recent file changes (last 24 hours, workspace only)
// ============================================================================

const SKIP_DIRS = new Set([
    'node_modules', '.git', 'out', 'dist', 'build',
    '.venv', '__pycache__', '.cache', '.next', 'coverage',
]);

function getRecentChanges(projectPath: string, maxFiles = 8): RecentChange[] {
    const now = Date.now();
    const cutoffMs = 24 * 60 * 60 * 1000;
    const results: RecentChange[] = [];

    function walkDir(dir: string, depth: number) {
        if (depth > 4 || results.length >= maxFiles * 2) { return; }
        let entries: fs.Dirent[];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

        for (const entry of entries) {
            if (results.length >= maxFiles * 2) { break; }
            if (entry.isDirectory()) {
                if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
                    walkDir(path.join(dir, entry.name), depth + 1);
                }
            } else if (entry.isFile()) {
                try {
                    const fullPath = path.join(dir, entry.name);
                    const stat = fs.statSync(fullPath);
                    const ageMs = now - stat.mtimeMs;
                    if (ageMs < cutoffMs) {
                        const relPath = path.relative(projectPath, fullPath).replace(/\\/g, '/');
                        results.push({ file: relPath, minsAgo: Math.round(ageMs / 60_000) });
                    }
                } catch { /* skip locked/unreadable files */ }
            }
        }
    }

    walkDir(projectPath, 0);
    return results
        .sort((a, b) => a.minsAgo - b.minsAgo)
        .slice(0, maxFiles);
}

// ============================================================================
// Peer project discovery
// ============================================================================

const MAX_PEER_PROJECTS = 8;

async function discoverPeerProjects(workspaceRoot: string): Promise<PeerProject[]> {
    const parentFolder = path.dirname(workspaceRoot);
    const currentName = path.basename(workspaceRoot);
    const peers: PeerProject[] = [];

    let entries: fs.Dirent[];
    try {
        entries = await fs.readdir(parentFolder, { withFileTypes: true });
    } catch (err) {
        console.warn('[PeripheralVision] Cannot read parent folder:', err);
        return peers;
    }

    for (const entry of entries) {
        if (peers.length >= MAX_PEER_PROJECTS) { break; }
        if (!entry.isDirectory()) { continue; }
        if (entry.name === currentName) { continue; }
        if (entry.name.startsWith('.')) { continue; }

        const peerPath = path.join(parentFolder, entry.name);
        const tech = detectTech(peerPath);

        // Skip folders with no recognisable tech markers (non-code dirs)
        if (tech.length === 0) { continue; }

        const gitStatus = getShallowGitStatus(peerPath);
        peers.push({
            name: entry.name,
            path: peerPath,
            tech,
            branch: gitStatus.branch,
            lastCommit: gitStatus.lastCommit,
            uncommittedCount: gitStatus.uncommittedCount,
        });
    }

    return peers;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Gather a complete peripheral context snapshot for the given workspace root.
 * Results are cached for 60 seconds to avoid repeated I/O on every message.
 */
export async function gatherPeripheralContext(workspaceRoot: string): Promise<PeripheralContext> {
    if (!workspaceRoot) {
        return {
            parentFolder: '',
            peerProjects: [],
            recentChanges: [],
            detectedManifests: [],
            scannedAt: Date.now(),
        };
    }

    const cached = _cache.get(workspaceRoot);
    if (cached && cached.expires > Date.now()) {
        return cached.context;
    }

    const parentFolder = path.dirname(workspaceRoot);

    // Run I/O-bound operations concurrently
    const [peerProjects, recentChanges, fileWatcherObservations] = await Promise.all([
        discoverPeerProjects(workspaceRoot),
        Promise.resolve(getRecentChanges(workspaceRoot)),
        loadPeripheralObservations(workspaceRoot),
    ]);

    const git = getGitSummary(workspaceRoot);
    const detectedManifests = detectManifests(workspaceRoot);
    const testFramework = detectTestFramework(workspaceRoot);

    // v5.9.7: Dependency freshness + test runner status (lazy — only when package.json present)
    const hasPackageJson = fs.existsSync(path.join(workspaceRoot, 'package.json'));
    const dependencyFreshness = hasPackageJson ? getDependencyFreshness(workspaceRoot) : undefined;
    const testRunnerStatus = getTestRunnerStatus(workspaceRoot, testFramework);

    const context: PeripheralContext = {
        parentFolder,
        peerProjects,
        git,
        recentChanges,
        detectedManifests,
        testFramework,
        dependencyFreshness,
        testRunnerStatus,
        fileWatcherObservations: fileWatcherObservations ?? undefined,
        scannedAt: Date.now(),
    };

    _cache.set(workspaceRoot, { context, expires: Date.now() + CACHE_TTL_MS });
    return context;
}

/**
 * Invalidate the cached peripheral context for a workspace.
 * Call this after major operations (git commit, dependency install, etc.)
 * to ensure the next request gets a fresh snapshot.
 */
export function invalidatePeripheralCache(workspaceRoot: string): void {
    _cache.delete(workspaceRoot);
}
