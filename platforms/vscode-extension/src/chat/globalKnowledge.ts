import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as https from 'https';
import * as lockfile from 'proper-lockfile';
import { logInfo } from '../shared/logger';
import {
    ALEX_GLOBAL_HOME,
    GLOBAL_KNOWLEDGE_PATHS,
    GLOBAL_KNOWLEDGE_PREFIXES,
    GLOBAL_KNOWLEDGE_CATEGORIES,
    GlobalKnowledgeCategory,
    IGlobalKnowledgeEntry,
    IGlobalKnowledgeIndex,
    IProjectRegistry,
    IProjectRegistryEntry
} from '../shared/constants';
// v5.9.6: Forgetting Curve reference counting (lazy import to avoid circular dependency checks)
import { queueReferenceTouch } from './forgettingCurve';

// ============================================================================
// GLOBAL KNOWLEDGE BASE UTILITIES
// ============================================================================

/**
 * Lock file options for concurrent access safety
 * Reduced timeouts to prevent freezes when locks are held by other processes
 */
const LOCK_OPTIONS = {
    stale: 5000,       // Consider lock stale after 5 seconds (reduced from 10)
    retries: {
        retries: 3,    // Reduced from 5 to fail faster
        factor: 2,
        minTimeout: 100,
        maxTimeout: 500  // Reduced from 1000
    }
};

// ============================================================================
// REMOTE GITHUB ACCESS (Read-only, no clone required)
// ============================================================================

/**
 * In-memory cache for remote GitHub content
 */
interface IRemoteCache {
    content: string;
    fetchedAt: number;
    etag?: string;
}

const remoteCache = new Map<string, IRemoteCache>();

/**
 * Track remote access status for error feedback
 */
interface IRemoteAccessStatus {
    lastAttempt: number;
    lastSuccess: boolean;
    lastError?: string;
    authMethod?: 'vscode-sso' | 'pat' | 'none';
}

let remoteAccessStatus: IRemoteAccessStatus | null = null;

/**
 * Get the current remote access status
 */
export function getRemoteAccessStatus(): IRemoteAccessStatus | null {
    return remoteAccessStatus;
}

// ============================================================================
// SECURE TOKEN STORAGE (SecretStorage API)
// ============================================================================

/** Secret storage key for GitHub token */
const GITHUB_TOKEN_SECRET_KEY = 'alex.globalKnowledge.githubToken';

/** Module-level reference to VS Code SecretStorage */
let secretStorage: vscode.SecretStorage | null = null;

/** Cached token (loaded async at activation, refreshed on config change) */
let cachedGithubToken: string | null = null;

/**
 * Initialize secure storage for Global Knowledge.
 * Migrates token from settings to SecretStorage on first run.
 * @param context Extension context with secrets API
 */
export async function initGlobalKnowledgeSecrets(context: vscode.ExtensionContext): Promise<void> {
    secretStorage = context.secrets;
    
    // Try to load token from SecretStorage
    try {
        cachedGithubToken = await secretStorage.get(GITHUB_TOKEN_SECRET_KEY) || null;
    } catch {
        cachedGithubToken = null;
    }
    
    // Migration: If token exists in settings but not in secrets, migrate it
    const config = vscode.workspace.getConfiguration('alex.globalKnowledge');
    const settingsToken = config.get<string>('githubToken')?.trim();
    
    if (settingsToken && !cachedGithubToken) {
        // Migrate token to SecretStorage
        try {
            await secretStorage.store(GITHUB_TOKEN_SECRET_KEY, settingsToken);
            cachedGithubToken = settingsToken;
            
            // Clear token from settings (it's now in secure storage)
            await config.update('githubToken', undefined, vscode.ConfigurationTarget.Global);
            
            vscode.window.showInformationMessage(
                'Alex: GitHub token migrated to secure storage.'
            );
        } catch (error) {
            // Migration failed, keep using settings token
            cachedGithubToken = settingsToken;
        }
    } else if (settingsToken && cachedGithubToken) {
        // Token exists in both places - clear settings copy
        try {
            await config.update('githubToken', undefined, vscode.ConfigurationTarget.Global);
        } catch {
            // Ignore cleanup failure
        }
    }
}

/**
 * Store a GitHub token securely
 * @param token The token to store, or empty string to clear
 */
export async function setGitHubToken(token: string): Promise<void> {
    if (!secretStorage) {
        throw new Error('Secret storage not initialized. Call initGlobalKnowledgeSecrets first.');
    }
    
    if (token) {
        await secretStorage.store(GITHUB_TOKEN_SECRET_KEY, token);
        cachedGithubToken = token;
    } else {
        await secretStorage.delete(GITHUB_TOKEN_SECRET_KEY);
        cachedGithubToken = null;
    }
}

/**
 * Get the cached GitHub token (synchronous, uses cached value)
 */
function getCachedGithubToken(): string | null {
    return cachedGithubToken;
}

/**
 * Standard repository name for Global Knowledge
 */
const STANDARD_GK_REPO_NAME = 'Alex-Global-Knowledge';

/**
 * Get remote repo configuration
 * Accepts: "owner" (appends standard repo name) or "owner/repo" (custom repo name)
 */
export function getRemoteRepoConfig(): { repo: string; ttl: number; useAuth: boolean; token: string | null } | null {
    const config = vscode.workspace.getConfiguration('alex.globalKnowledge');
    const repoInput = config.get<string>('remoteRepo')?.trim();
    const ttl = config.get<number>('remoteCacheTTL') || 300;
    const useAuth = config.get<boolean>('useGitHubAuth') ?? true;
    // Use token from SecretStorage (cached), fallback to settings for backwards compatibility
    const token = getCachedGithubToken() || config.get<string>('githubToken')?.trim() || null;
    
    if (!repoInput) {
        return null;
    }
    
    let repo: string;
    
    // Check if it's a full URL first
    const urlMatch = repoInput.match(/github\.com\/([^\/]+\/[^\/]+?)(?:\.git)?$/);
    if (urlMatch) {
        repo = urlMatch[1];
    }
    // Check if it's "owner/repo" format
    else if (repoInput.includes('/')) {
        repo = repoInput;
    }
    // Just owner name - append standard repo name
    else {
        repo = `${repoInput}/${STANDARD_GK_REPO_NAME}`;
    }
    
    return { repo, ttl, useAuth, token };
}

/**
 * Get GitHub authentication token using VS Code's built-in GitHub auth or PAT fallback
 */
async function getGitHubAuthToken(): Promise<{ token: string | null; method: 'vscode-sso' | 'pat' | 'none' }> {
    const config = getRemoteRepoConfig();
    if (!config) {
        return { token: null, method: 'none' };
    }
    
    // Try VS Code GitHub authentication first (if enabled)
    if (config.useAuth) {
        try {
            const session = await vscode.authentication.getSession('github', ['repo'], { createIfNone: false });
            if (session) {
                return { token: session.accessToken, method: 'vscode-sso' };
            }
        } catch (err) {
            logInfo('[Alex] VS Code GitHub auth not available: ' + String(err));
        }
    }
    
    // Fall back to PAT token
    if (config.token) {
        return { token: config.token, method: 'pat' };
    }
    
    return { token: null, method: 'none' };
}

/**
 * Request GitHub authentication from VS Code (prompts user to sign in)
 */
export async function requestGitHubAuth(): Promise<boolean> {
    try {
        const session = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
        return session !== undefined;
    } catch {
        return false;
    }
}

/**
 * Fetch a file from GitHub raw content
 * Authentication priority: VS Code SSO > PAT token > unauthenticated (public repos only)
 */
async function fetchFromGitHub(
    repoPath: string, 
    filePath: string,
    branch: string = 'main'
): Promise<string | null> {
    const cacheKey = `${repoPath}/${branch}/${filePath}`;
    const config = getRemoteRepoConfig();
    const ttl = config?.ttl || 300;
    
    // Check cache first
    const cached = remoteCache.get(cacheKey);
    if (cached && (Date.now() - cached.fetchedAt) < ttl * 1000) {
        return cached.content;
    }
    
    // Get authentication token
    const auth = await getGitHubAuthToken();
    
    // Try raw.githubusercontent.com (works for public repos, or private with auth)
    const rawUrl = `https://raw.githubusercontent.com/${repoPath}/${branch}/${filePath}`;
    
    return new Promise<string | null>((resolve) => {
        const headers: Record<string, string> = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'User-Agent': 'Alex-Cognitive-Architecture-VSCode'
        };
        
        // Add authorization header if we have a token
        if (auth.token) {
            headers['Authorization'] = `Bearer ${auth.token}`;
        }
        
        const req = https.get(rawUrl, {
            headers,
            timeout: 10000
        }, (res) => {
            // Handle redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                const redirectUrl = res.headers.location;
                if (redirectUrl) {
                    https.get(redirectUrl, { headers, timeout: 10000 }, (redirectRes) => {
                        handleResponse(redirectRes);
                    }).on('error', () => {
                        updateAccessStatus(false, 'Network error during redirect', auth.method);
                        resolve(null);
                    });
                    return;
                }
            }
            handleResponse(res);
            
            function handleResponse(response: typeof res) {
                if (response.statusCode === 401 || response.statusCode === 403) {
                    // Authentication required or insufficient permissions
                    const errorMsg = response.statusCode === 401 
                        ? 'Authentication required - private repository'
                        : 'Access forbidden - check repository permissions';
                    updateAccessStatus(false, errorMsg, auth.method);
                    resolve(null);
                    return;
                }
                
                if (response.statusCode === 404) {
                    // Could be wrong branch, try 'master'
                    if (branch === 'main') {
                        fetchFromGitHub(repoPath, filePath, 'master')
                            .then(resolve)
                            .catch(() => {
                                updateAccessStatus(false, 'Repository or file not found', auth.method);
                                resolve(null);
                            });
                        return;
                    }
                    updateAccessStatus(false, 'Repository or file not found', auth.method);
                    resolve(null);
                    return;
                }
                
                if (response.statusCode !== 200) {
                    updateAccessStatus(false, `HTTP ${response.statusCode}`, auth.method);
                    resolve(null);
                    return;
                }
                
                let data = '';
                response.on('data', (chunk) => { data += chunk; });
                response.on('end', () => {
                    // Cache the result
                    remoteCache.set(cacheKey, {
                        content: data,
                        fetchedAt: Date.now(),
                        etag: response.headers.etag as string | undefined
                    });
                    updateAccessStatus(true, undefined, auth.method);
                    resolve(data);
                });
            }
        });
        
        req.on('error', (err) => {
            updateAccessStatus(false, `Network error: ${err.message}`, auth.method);
            resolve(null);
        });
        req.on('timeout', () => {
            req.destroy();
            updateAccessStatus(false, 'Request timeout', auth.method);
            resolve(null);
        });
    });
}

/**
 * Update the remote access status for error feedback
 */
function updateAccessStatus(success: boolean, error?: string, authMethod?: 'vscode-sso' | 'pat' | 'none'): void {
    remoteAccessStatus = {
        lastAttempt: Date.now(),
        lastSuccess: success,
        lastError: error,
        authMethod
    };
}

/**
 * Show remote access error to user with actionable guidance
 */
export async function showRemoteAccessError(): Promise<void> {
    const status = remoteAccessStatus;
    const config = getRemoteRepoConfig();
    
    if (!status || status.lastSuccess || !config) {
        return;
    }
    
    let message = `Failed to access Global Knowledge from GitHub: ${status.lastError}`;
    let actions: string[] = [];
    
    if (status.lastError?.includes('Authentication required') || status.lastError?.includes('Access forbidden')) {
        message += '\n\nThis appears to be a private repository.';
        actions = ['Sign in with GitHub', 'Configure PAT Token', 'Cancel'];
    } else if (status.lastError?.includes('not found')) {
        message += '\n\nCheck that the repository exists and the path is correct.';
        actions = ['Open Settings', 'Cancel'];
    } else {
        actions = ['Retry', 'Open Settings', 'Cancel'];
    }
    
    const choice = await vscode.window.showWarningMessage(message, ...actions);
    
    if (choice === 'Sign in with GitHub') {
        const success = await requestGitHubAuth();
        if (success) {
            clearRemoteCache();
            vscode.window.showInformationMessage('GitHub authentication successful. Retrying...');
        }
    } else if (choice === 'Configure PAT Token') {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'alex.globalKnowledge.githubToken');
    } else if (choice === 'Open Settings') {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'alex.globalKnowledge.remoteRepo');
    } else if (choice === 'Retry') {
        clearRemoteCache();
    }
}

/**
 * Get remote Global Knowledge index
 */
async function getRemoteIndex(): Promise<IGlobalKnowledgeIndex | null> {
    const config = getRemoteRepoConfig();
    if (!config) {
        return null;
    }
    
    const content = await fetchFromGitHub(config.repo, 'index.json');
    if (!content) {
        return null;
    }
    
    try {
        return JSON.parse(content) as IGlobalKnowledgeIndex;
    } catch {
        console.warn('[Alex] Failed to parse remote index.json');
        return null;
    }
}

/**
 * Get a specific knowledge file from remote
 */
async function getRemoteKnowledgeFile(relativePath: string): Promise<string | null> {
    const config = getRemoteRepoConfig();
    if (!config) {
        return null;
    }
    
    return await fetchFromGitHub(config.repo, relativePath);
}

/**
 * Check if remote GK is configured and available
 */
export async function isRemoteGlobalKnowledgeAvailable(): Promise<boolean> {
    const config = getRemoteRepoConfig();
    if (!config) {
        return false;
    }
    
    const index = await getRemoteIndex();
    return index !== null;
}

/**
 * Read knowledge file content from local or remote source
 * Handles both absolute paths (local) and relative paths (remote)
 */
export async function readKnowledgeFileContent(
    filePath: string,
    entry?: IGlobalKnowledgeEntry
): Promise<string | null> {
    // Try local first if path is absolute and exists
    if (path.isAbsolute(filePath)) {
        try {
            if (await fs.pathExists(filePath)) {
                return await fs.readFile(filePath, 'utf-8');
            }
        } catch {
            // Fall through to remote
        }
    }
    
    // If in remote-only mode or local read failed, try remote
    if (isRemoteOnlyMode || !path.isAbsolute(filePath)) {
        const config = getRemoteRepoConfig();
        if (config) {
            // Determine relative path for remote fetch
            let relativePath = filePath;
            if (path.isAbsolute(filePath)) {
                // Extract relative path from entry or guess based on type
                if (entry) {
                    relativePath = entry.type === 'pattern' 
                        ? `patterns/${entry.id}.md`
                        : `insights/${entry.id}.md`;
                } else {
                    // Try to extract from absolute path
                    const match = filePath.match(/(?:patterns|insights)[\/\\].+\.md$/);
                    relativePath = match ? match[0].replace(/\\/g, '/') : filePath;
                }
            }
            
            const content = await getRemoteKnowledgeFile(relativePath);
            if (content) {
                return content;
            }
        }
    }
    
    return null;
}

/**
 * Clear the remote cache (useful for forcing refresh)
 */
export function clearRemoteCache(): void {
    remoteCache.clear();
}

/**
 * Get the full path to the Alex global home directory
 */
export function getAlexGlobalPath(): string {
    return path.join(os.homedir(), ALEX_GLOBAL_HOME);
}

/**
 * Get the full path to a global knowledge subdirectory
 */
export function getGlobalKnowledgePath(subpath: keyof typeof GLOBAL_KNOWLEDGE_PATHS): string {
    return path.join(os.homedir(), GLOBAL_KNOWLEDGE_PATHS[subpath]);
}

/**
 * Ensure all global knowledge directories exist
 */
export async function ensureGlobalKnowledgeDirectories(): Promise<void> {
    const paths = [
        getGlobalKnowledgePath('root'),
        getGlobalKnowledgePath('knowledge'),
        getGlobalKnowledgePath('patterns'),
        getGlobalKnowledgePath('insights')
    ];

    for (const dirPath of paths) {
        await fs.ensureDir(dirPath);
    }
}

/**
 * Common names for Global Knowledge repositories
 */
const GK_REPO_NAMES = [
    'Alex-Global-Knowledge',
    'My-Global-Knowledge',
    'Global-Knowledge',
    'alex-global-knowledge',
    'my-global-knowledge',
    'global-knowledge'
];

/**
 * Detect an existing Global Knowledge repository.
 * Returns the path if found, null otherwise.
 * 
 * Priority:
 * 1. User-configured path via `alex.globalKnowledge.repoPath` setting
 * 2. Workspace folder that IS a GK repo (multi-root workspace support)
 * 3. Walk up directory tree (max 3 levels) looking for GK repo
 *    - Handles nested projects like C:\Dev\Sandbox\project when GK is at C:\Dev\Alex-Global-Knowledge
 */
export async function detectGlobalKnowledgeRepo(): Promise<string | null> {
    // First check user-configured path
    const configuredPath = vscode.workspace.getConfiguration('alex.globalKnowledge').get<string>('repoPath');
    if (configuredPath && configuredPath.trim() !== '') {
        const indexPath = path.join(configuredPath, 'index.json');
        if (await fs.pathExists(indexPath)) {
            return configuredPath;
        }
        // If configured path doesn't exist or isn't a valid GK repo, log warning but continue
        console.warn(`Configured GK repo path ${configuredPath} is not a valid Global Knowledge repository`);
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }
    
    // Priority 2: Check if any workspace folder IS a GK repo (multi-root workspace)
    for (const folder of workspaceFolders) {
        const folderPath = folder.uri.fsPath;
        const folderName = path.basename(folderPath);
        
        // Quick check by name first
        if (GK_REPO_NAMES.includes(folderName)) {
            const indexPath = path.join(folderPath, 'index.json');
            if (await fs.pathExists(indexPath)) {
                return folderPath;
            }
        }
        
        // Also check by structure (index.json + patterns + insights)
        const indexPath = path.join(folderPath, 'index.json');
        const patternsPath = path.join(folderPath, 'patterns');
        const insightsPath = path.join(folderPath, 'insights');
        
        if (await fs.pathExists(indexPath) && 
            await fs.pathExists(patternsPath) && 
            await fs.pathExists(insightsPath)) {
            return folderPath;
        }
    }
    
    // Priority 3: Walk up directory tree looking for GK repo (max 3 levels)
    // Handles nested projects like C:\Dev\Sandbox\project when GK is at C:\Dev\Alex-Global-Knowledge
    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    let currentDir = workspaceRoot;
    const MAX_TREE_DEPTH = 3;
    
    for (let depth = 0; depth < MAX_TREE_DEPTH; depth++) {
        const parentDir = path.dirname(currentDir);
        
        // Stop if we've reached the root
        if (parentDir === currentDir) {
            break;
        }
        
        // Check for common GK repo names at this level
        for (const repoName of GK_REPO_NAMES) {
            const gkPath = path.join(parentDir, repoName);
            const indexPath = path.join(gkPath, 'index.json');
            
            if (await fs.pathExists(indexPath)) {
                return gkPath;
            }
        }
        
        // Also check for any folder with GK structure at this level
        try {
            const siblings = await fs.readdir(parentDir);
            for (const sibling of siblings) {
                const siblingPath = path.join(parentDir, sibling);
                const stat = await fs.stat(siblingPath);
                if (stat.isDirectory()) {
                    const indexPath = path.join(siblingPath, 'index.json');
                    const patternsPath = path.join(siblingPath, 'patterns');
                    const insightsPath = path.join(siblingPath, 'insights');
                    
                    // If it has index.json + patterns/ + insights/, it's likely a GK repo
                    if (await fs.pathExists(indexPath) && 
                        await fs.pathExists(patternsPath) && 
                        await fs.pathExists(insightsPath)) {
                        return siblingPath;
                    }
                }
            }
        } catch {
            // Directory not readable, continue walking up
        }
        
        currentDir = parentDir;
    }
    
    return null;
}

/**
 * Initialize the Global Knowledge repository structure.
 * This is called when the user opts to create a new GK repo.
 * 
 * @param repoPath - Path where the GK repo should be scaffolded
 */
export async function getGlobalKnowledgeRepoPath(): Promise<string | null> {
    return await detectGlobalKnowledgeRepo();
}

/**
 * Execute a function with file locking for safe concurrent access.
 * This ensures only one Alex instance can modify a file at a time.
 * Now includes better error handling and timeout protection.
 */
async function withFileLock<T>(
    filePath: string,
    operation: () => Promise<T>
): Promise<T> {
    // Ensure the file exists before locking (lockfile requires existing file)
    if (!await fs.pathExists(filePath)) {
        // Create empty file to lock against
        await fs.ensureFile(filePath);
    }
    
    let release: (() => Promise<void>) | undefined;
    try {
        release = await lockfile.lock(filePath, LOCK_OPTIONS);
        return await operation();
    } catch (lockError: any) {
        // If lock fails (e.g., another process holds it), run without lock
        // This is safer than hanging indefinitely
        console.warn(`File lock failed for ${filePath}, proceeding without lock:`, lockError?.message || lockError);
        return await operation();
    } finally {
        if (release) {
            try {
                await release();
            } catch (releaseError) {
                // Ignore release errors - file may have been deleted or lock already released
                console.warn(`Failed to release lock for ${filePath}:`, releaseError);
            }
        }
    }
}

/**
 * Safely update the global knowledge index with locking.
 * This prevents race conditions when multiple Alex instances are running.
 */
export async function updateGlobalKnowledgeIndex(
    updater: (index: IGlobalKnowledgeIndex) => IGlobalKnowledgeIndex | Promise<IGlobalKnowledgeIndex>
): Promise<IGlobalKnowledgeIndex> {
    const indexPath = getGlobalKnowledgePath('index');
    await ensureGlobalKnowledgeDirectories();
    
    return await withFileLock(indexPath, async () => {
        // Read current index (or create new one)
        let index: IGlobalKnowledgeIndex;
        try {
            if (await fs.pathExists(indexPath)) {
                const content = await fs.readFile(indexPath, 'utf-8');
                if (content.trim()) {
                    index = JSON.parse(content);
                } else {
                    index = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
                }
            } else {
                index = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
            }
        } catch (err) {
            // Corrupted, create new
            index = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
        }
        
        // Apply the update
        index = await updater(index);
        index.lastUpdated = new Date().toISOString();
        
        // Write back atomically
        await fs.writeJson(indexPath, index, { spaces: 2 });
        
        return index;
    });
}

/**
 * Safely update the project registry with locking.
 */
export async function updateProjectRegistry(
    updater: (registry: IProjectRegistry) => IProjectRegistry | Promise<IProjectRegistry>
): Promise<IProjectRegistry> {
    const registryPath = getGlobalKnowledgePath('projectRegistry');
    await ensureGlobalKnowledgeDirectories();
    
    return await withFileLock(registryPath, async () => {
        // Read current registry (or create new one)
        let registry: IProjectRegistry;
        try {
            if (await fs.pathExists(registryPath)) {
                const content = await fs.readFile(registryPath, 'utf-8');
                if (content.trim()) {
                    registry = JSON.parse(content);
                } else {
                    registry = { version: '1.0.0', lastUpdated: new Date().toISOString(), projects: [] };
                }
            } else {
                registry = { version: '1.0.0', lastUpdated: new Date().toISOString(), projects: [] };
            }
        } catch (err) {
            registry = { version: '1.0.0', lastUpdated: new Date().toISOString(), projects: [] };
        }
        
        // Apply the update
        registry = await updater(registry);
        registry.lastUpdated = new Date().toISOString();
        
        // Write back
        await fs.writeJson(registryPath, registry, { spaces: 2 });
        
        return registry;
    });
}

/**
 * Track whether we're operating in remote-only mode (no local GK repo)
 */
let isRemoteOnlyMode = false;

/**
 * Check if we're in remote-only mode (no local GK, reading from GitHub)
 */
export function isRemoteOnly(): boolean {
    return isRemoteOnlyMode;
}

/**
 * Initialize the global knowledge index, with fallback to remote GitHub
 * 
 * Priority:
 * 1. Local GK repo (if exists)
 * 2. Remote GitHub repo (if configured)
 * 3. Create empty local index (fallback)
 */
export async function ensureGlobalKnowledgeIndex(): Promise<IGlobalKnowledgeIndex> {
    // First, check for local GK repo
    const gkRepo = await detectGlobalKnowledgeRepo();
    
    if (gkRepo) {
        // Local GK repo exists - use it
        isRemoteOnlyMode = false;
        const indexPath = path.join(gkRepo, 'index.json');
        
        try {
            if (await fs.pathExists(indexPath)) {
                const content = await fs.readFile(indexPath, 'utf-8');
                if (content.trim()) {
                    const index = JSON.parse(content) as IGlobalKnowledgeIndex;
                    // Normalize file paths to use repo path
                    for (const entry of index.entries) {
                        if (!path.isAbsolute(entry.filePath)) {
                            entry.filePath = path.join(gkRepo, entry.filePath);
                        }
                    }
                    return index;
                }
            }
        } catch (err) {
            console.warn('[Alex] Failed to read local GK index:', err);
        }
    }
    
    // No local GK repo - try remote GitHub
    const config = getRemoteRepoConfig();
    const remoteIndex = await getRemoteIndex();
    if (remoteIndex) {
        isRemoteOnlyMode = true;
        return remoteIndex;
    }
    
    // If remote was configured but failed, show error feedback
    if (config && remoteAccessStatus && !remoteAccessStatus.lastSuccess) {
        // Show error asynchronously (don't block)
        showRemoteAccessError().catch(() => {});
    }
    
    // Fallback: create local empty index in ~/.alex
    isRemoteOnlyMode = false;
    const indexPath = getGlobalKnowledgePath('index');
    await ensureGlobalKnowledgeDirectories();
    
    return await withFileLock(indexPath, async () => {
        try {
            if (await fs.pathExists(indexPath)) {
                const content = await fs.readFile(indexPath, 'utf-8');
                if (content.trim()) {
                    return JSON.parse(content);
                }
            }
        } catch (err) {
            // Index corrupted, recreate
        }

        const newIndex: IGlobalKnowledgeIndex = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            entries: []
        };

        await fs.writeJson(indexPath, newIndex, { spaces: 2 });
        return newIndex;
    });
}

/**
 * Save the global knowledge index (with locking for concurrent safety)
 */
export async function saveGlobalKnowledgeIndex(index: IGlobalKnowledgeIndex): Promise<void> {
    await updateGlobalKnowledgeIndex(() => index);
}

/**
 * Get or initialize the project registry (with locking)
 */
export async function ensureProjectRegistry(): Promise<IProjectRegistry> {
    const registryPath = getGlobalKnowledgePath('projectRegistry');
    await ensureGlobalKnowledgeDirectories();
    
    return await updateProjectRegistry((registry) => registry);
}

/**
 * Save the project registry (with locking for concurrent safety)
 */
export async function saveProjectRegistry(registry: IProjectRegistry): Promise<void> {
    await updateProjectRegistry(() => registry);
}

/**
 * Register or update the current project in the registry
 */
export async function registerCurrentProject(): Promise<IProjectRegistryEntry | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return undefined;
    }

    const projectPath = workspaceFolders[0].uri.fsPath;
    const projectName = path.basename(projectPath);
    
    // Count knowledge files
    let knowledgeFileCount = 0;
    const dkPattern = new vscode.RelativePattern(workspaceFolders[0], '.github/domain-knowledge/*.md');
    const dkFiles = await vscode.workspace.findFiles(dkPattern);
    knowledgeFileCount = dkFiles.length;

    // Use atomic update with locking
    let savedEntry: IProjectRegistryEntry | undefined;
    await updateProjectRegistry((registry) => {
        // Find existing entry or create new one
        const existingIndex = registry.projects.findIndex(p => p.path === projectPath);
        const entry: IProjectRegistryEntry = {
            path: projectPath,
            name: projectName,
            lastAccessed: new Date().toISOString(),
            knowledgeFiles: knowledgeFileCount
        };

        if (existingIndex >= 0) {
            // Preserve existing data, update access time and file count
            registry.projects[existingIndex] = {
                ...registry.projects[existingIndex],
                ...entry
            };
            savedEntry = registry.projects[existingIndex];
        } else {
            registry.projects.push(entry);
            savedEntry = entry;
        }

        return registry;
    });

    return savedEntry;
}

/**
 * Generate a unique ID for a knowledge entry
 */

// Re-export from extracted modules for backward compatibility
export { scaffoldGlobalKnowledgeRepo } from './globalKnowledgeContent';
export {
    generateKnowledgeId,
    createGlobalPattern,
    updateGlobalPattern,
    createGlobalInsight,
    searchGlobalKnowledge,
    promoteToGlobalKnowledge,
    findRelevantKnowledge,
    DKFileEvaluation,
    AutoPromotionResult,
    evaluateDKFile,
    autoPromoteDuringMeditation,
    getGlobalKnowledgeSummary,
} from './globalKnowledgeOps';
export {
    IMigrationResult,
    normalizeGlobalKnowledge,
    needsMigration,
} from './globalKnowledgeMigration';
export {
    IGlobalKnowledgeSearchParams,
    GlobalKnowledgeSearchTool,
    ISaveInsightParams,
    SaveInsightTool,
    IPromoteKnowledgeParams,
    PromoteKnowledgeTool,
    GlobalKnowledgeStatusTool,
    registerGlobalKnowledgeTools,
} from './globalKnowledgeTools';
