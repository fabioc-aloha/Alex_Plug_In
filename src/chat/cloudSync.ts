import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as https from 'https';
import {
    getGlobalKnowledgePath,
    ensureGlobalKnowledgeDirectories,
    updateGlobalKnowledgeIndex
} from './globalKnowledge';
import {
    IGlobalKnowledgeIndex,
    IGlobalKnowledgeEntry
} from '../shared/constants';

// ============================================================================
// CLOUD SYNC CONFIGURATION
// ============================================================================

/**
 * Gist filename for the knowledge index
 */
const GIST_INDEX_FILENAME = 'alex-knowledge-index.json';

/**
 * Gist description for identification
 */
const GIST_DESCRIPTION = 'Alex Cognitive Architecture - Global Knowledge Base';

/**
 * Sync metadata stored locally
 */
interface ISyncMetadata {
    gistId?: string;
    lastSyncedAt?: string;
    lastLocalHash?: string;
    lastRemoteHash?: string;
}

/**
 * Sync status for UI feedback
 */
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'up-to-date' | 'needs-push' | 'needs-pull' | 'conflict';

/**
 * Sync result with detailed information
 */
export interface ISyncResult {
    success: boolean;
    status: SyncStatus;
    message: string;
    entriesPushed?: number;
    entriesPulled?: number;
    conflicts?: string[];
}

// ============================================================================
// GITHUB AUTHENTICATION
// ============================================================================

/**
 * Get GitHub authentication session using VS Code's built-in auth
 */
async function getGitHubSession(): Promise<vscode.AuthenticationSession | undefined> {
    try {
        // Request GitHub auth with gist scope
        const session = await vscode.authentication.getSession('github', ['gist'], { createIfNone: true });
        return session;
    } catch (err) {
        console.error('Failed to get GitHub session:', err);
        return undefined;
    }
}

/**
 * Make authenticated request to GitHub API using Node https
 */
async function githubRequest<T>(
    endpoint: string,
    options: {
        method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
        body?: unknown;
    } = {}
): Promise<T | null> {
    const session = await getGitHubSession();
    if (!session) {
        throw new Error('GitHub authentication required. Please sign in.');
    }

    return new Promise<T | null>((resolve, reject) => {
        const url = new URL(`https://api.github.com${endpoint}`);
        
        const reqOptions: https.RequestOptions = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Authorization': `Bearer ${session.accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept': 'application/vnd.github.v3+json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'User-Agent': 'Alex-Cognitive-Architecture-VSCode'
            }
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    if (res.statusCode === 204 || !data) {
                        resolve(null);
                    } else {
                        try {
                            resolve(JSON.parse(data) as T);
                        } catch (err) {
                            reject(new Error(`Failed to parse GitHub response: ${err}`));
                        }
                    }
                } else {
                    reject(new Error(`GitHub API error (${res.statusCode}): ${data}`));
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

// ============================================================================
// SYNC METADATA MANAGEMENT
// ============================================================================

/**
 * Get path to sync metadata file
 */
function getSyncMetadataPath(): string {
    return path.join(getGlobalKnowledgePath('root'), 'sync-metadata.json');
}

/**
 * Load sync metadata
 */
async function loadSyncMetadata(): Promise<ISyncMetadata> {
    const metaPath = getSyncMetadataPath();
    try {
        if (await fs.pathExists(metaPath)) {
            return await fs.readJson(metaPath);
        }
    } catch (err) {
        // Corrupted, return empty
    }
    return {};
}

/**
 * Save sync metadata
 */
async function saveSyncMetadata(metadata: ISyncMetadata): Promise<void> {
    const metaPath = getSyncMetadataPath();
    await fs.writeJson(metaPath, metadata, { spaces: 2 });
}

// ============================================================================
// GIST OPERATIONS
// ============================================================================

interface IGistFile {
    filename: string;
    content: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
// GitHub API response types - use snake_case to match API
interface IGist {
    id: string;
    description: string;
    files: Record<string, { filename: string; content: string; raw_url?: string }>;
    updated_at: string;
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Find existing Alex knowledge gist
 * Checks in order: local metadata, local index file, then searches user's gists
 */
async function findKnowledgeGist(): Promise<IGist | null> {
    const metadata = await loadSyncMetadata();
    
    // Priority 1: Check local sync metadata
    if (metadata.gistId) {
        try {
            const gist = await githubRequest<IGist>(`/gists/${metadata.gistId}`);
            if (gist) {
                return gist;
            }
        } catch (err) {
            // Gist might have been deleted, continue searching
        }
    }

    // Priority 2: Check local index file for embedded gist ID
    const indexPath = getGlobalKnowledgePath('index');
    if (await fs.pathExists(indexPath)) {
        try {
            const localIndex = await fs.readJson(indexPath) as IGlobalKnowledgeIndex;
            if (localIndex.cloudGistId) {
                const gist = await githubRequest<IGist>(`/gists/${localIndex.cloudGistId}`);
                if (gist) {
                    // Save to metadata for faster future lookups
                    await saveSyncMetadata({ ...metadata, gistId: gist.id });
                    return gist;
                }
            }
        } catch (err) {
            // Continue searching
        }
    }

    // Priority 3: Search user's gists by description
    const gists = await githubRequest<IGist[]>('/gists?per_page=100');
    if (!gists) {
        return null;
    }

    // Find by description or index filename
    const knowledgeGist = gists.find(g => 
        g.description === GIST_DESCRIPTION || 
        g.files[GIST_INDEX_FILENAME]
    );

    if (knowledgeGist) {
        // Save the ID for faster future lookups
        await saveSyncMetadata({ ...metadata, gistId: knowledgeGist.id });
    }

    return knowledgeGist || null;
}

/**
 * Create a new knowledge gist
 */
async function createKnowledgeGist(files: Record<string, string>): Promise<IGist> {
    const gistFiles: Record<string, { content: string }> = {};
    for (const [filename, content] of Object.entries(files)) {
        gistFiles[filename] = { content };
    }

    const gist = await githubRequest<IGist>('/gists', {
        method: 'POST',
        body: {
            description: GIST_DESCRIPTION,
            public: false,
            files: gistFiles
        }
    });

    if (!gist) {
        throw new Error('Failed to create gist');
    }

    // Save the gist ID
    const metadata = await loadSyncMetadata();
    await saveSyncMetadata({ ...metadata, gistId: gist.id });

    return gist;
}

/**
 * Update existing knowledge gist
 */
async function updateKnowledgeGist(gistId: string, files: Record<string, string | null>): Promise<IGist> {
    const gistFiles: Record<string, { content: string } | null> = {};
    for (const [filename, content] of Object.entries(files)) {
        gistFiles[filename] = content === null ? null : { content };
    }

    const gist = await githubRequest<IGist>(`/gists/${gistId}`, {
        method: 'PATCH',
        body: { files: gistFiles }
    });

    if (!gist) {
        throw new Error('Failed to update gist');
    }

    return gist;
}

// ============================================================================
// SYNC OPERATIONS
// ============================================================================

/**
 * Compute a simple hash of the index for change detection
 */
function computeIndexHash(index: IGlobalKnowledgeIndex): string {
    const content = JSON.stringify(index.entries.map(e => e.id).sort());
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

/**
 * Get current sync status without making changes
 */
export async function getSyncStatus(): Promise<{ status: SyncStatus; message: string }> {
    try {
        const metadata = await loadSyncMetadata();
        
        if (!metadata.gistId) {
            return { status: 'needs-push', message: 'Not yet synced to cloud' };
        }

        // Load local index
        const indexPath = getGlobalKnowledgePath('index');
        if (!await fs.pathExists(indexPath)) {
            return { status: 'needs-pull', message: 'No local knowledge, pull from cloud' };
        }

        const localIndex = await fs.readJson(indexPath) as IGlobalKnowledgeIndex;
        const localHash = computeIndexHash(localIndex);

        // Check if local has changed since last sync
        if (metadata.lastLocalHash && localHash !== metadata.lastLocalHash) {
            return { status: 'needs-push', message: 'Local changes not yet synced' };
        }

        return { status: 'up-to-date', message: 'Synced' };
    } catch (err) {
        return { status: 'error', message: `Error: ${err}` };
    }
}

/**
 * Push local knowledge to GitHub Gist
 */
export async function pushToCloud(): Promise<ISyncResult> {
    try {
        await ensureGlobalKnowledgeDirectories();
        
        // Load local index
        const indexPath = getGlobalKnowledgePath('index');
        if (!await fs.pathExists(indexPath)) {
            return {
                success: false,
                status: 'error',
                message: 'No local knowledge to push. Use /saveinsight first.'
            };
        }

        const localIndex = await fs.readJson(indexPath) as IGlobalKnowledgeIndex;
        
        // Find or create gist first to get the ID
        let gist = await findKnowledgeGist();
        const isNewGist = !gist;
        
        if (!gist) {
            // Create empty gist first to get the ID
            gist = await createKnowledgeGist({ [GIST_INDEX_FILENAME]: '{}' });
        }
        
        // Update the index with gist info so other machines can find it
        localIndex.cloudGistId = gist.id;
        localIndex.cloudGistUrl = `https://gist.github.com/${gist.id}`;
        
        // Prepare files to upload
        const files: Record<string, string> = {
            [GIST_INDEX_FILENAME]: JSON.stringify(localIndex, null, 2)
        };

        // Add all knowledge files
        for (const entry of localIndex.entries) {
            if (await fs.pathExists(entry.filePath)) {
                const content = await fs.readFile(entry.filePath, 'utf-8');
                const filename = path.basename(entry.filePath);
                files[filename] = content;
            }
        }

        // Update the gist with all files
        gist = await updateKnowledgeGist(gist.id, files);

        // Save the updated index locally (with gist info embedded)
        await updateGlobalKnowledgeIndex(() => localIndex);

        // Update metadata
        const localHash = computeIndexHash(localIndex);
        await saveSyncMetadata({
            gistId: gist.id,
            lastSyncedAt: new Date().toISOString(),
            lastLocalHash: localHash,
            lastRemoteHash: localHash
        });

        return {
            success: true,
            status: 'up-to-date',
            message: `Pushed ${localIndex.entries.length} entries to cloud`,
            entriesPushed: localIndex.entries.length
        };
    } catch (err) {
        return {
            success: false,
            status: 'error',
            message: `Push failed: ${err}`
        };
    }
}

/**
 * Pull knowledge from GitHub Gist to local
 */
export async function pullFromCloud(): Promise<ISyncResult> {
    try {
        await ensureGlobalKnowledgeDirectories();
        
        const gist = await findKnowledgeGist();
        
        if (!gist) {
            return {
                success: false,
                status: 'error',
                message: 'No cloud knowledge found. Use /push first.'
            };
        }

        // Get the index from gist
        const indexFile = gist.files[GIST_INDEX_FILENAME];
        if (!indexFile) {
            return {
                success: false,
                status: 'error',
                message: 'Cloud gist is missing index file'
            };
        }

        const remoteIndex = JSON.parse(indexFile.content) as IGlobalKnowledgeIndex;
        
        // Ensure the gist info is captured in the index
        remoteIndex.cloudGistId = gist.id;
        remoteIndex.cloudGistUrl = `https://gist.github.com/${gist.id}`;
        
        // Download all knowledge files
        let downloadedCount = 0;
        for (const entry of remoteIndex.entries) {
            const filename = path.basename(entry.filePath);
            const gistFile = gist.files[filename];
            
            if (gistFile) {
                // Determine local path based on type
                const subdir = entry.type === 'pattern' ? 'patterns' : 'insights';
                const localPath = path.join(getGlobalKnowledgePath(subdir), filename);
                
                // Update entry's filePath to local path
                entry.filePath = localPath;
                
                await fs.writeFile(localPath, gistFile.content, 'utf-8');
                downloadedCount++;
            }
        }

        // Save the index locally (with locking)
        await updateGlobalKnowledgeIndex(() => remoteIndex);

        // Update metadata
        const localHash = computeIndexHash(remoteIndex);
        await saveSyncMetadata({
            gistId: gist.id,
            lastSyncedAt: new Date().toISOString(),
            lastLocalHash: localHash,
            lastRemoteHash: localHash
        });

        return {
            success: true,
            status: 'up-to-date',
            message: `Pulled ${downloadedCount} entries from cloud`,
            entriesPulled: downloadedCount
        };
    } catch (err) {
        return {
            success: false,
            status: 'error',
            message: `Pull failed: ${err}`
        };
    }
}

/**
 * Sync local and cloud (bidirectional merge)
 */
export async function syncWithCloud(): Promise<ISyncResult> {
    try {
        await ensureGlobalKnowledgeDirectories();
        
        // Load local index
        const indexPath = getGlobalKnowledgePath('index');
        let localIndex: IGlobalKnowledgeIndex;
        
        if (await fs.pathExists(indexPath)) {
            localIndex = await fs.readJson(indexPath);
        } else {
            localIndex = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
        }

        // Find or create cloud gist
        let gist = await findKnowledgeGist();
        let remoteIndex: IGlobalKnowledgeIndex;

        if (gist && gist.files[GIST_INDEX_FILENAME]) {
            remoteIndex = JSON.parse(gist.files[GIST_INDEX_FILENAME].content);
        } else {
            remoteIndex = { version: '1.0.0', lastUpdated: new Date().toISOString(), entries: [] };
        }

        // Merge: combine entries, newer wins for duplicates
        const mergedEntries = new Map<string, IGlobalKnowledgeEntry>();
        
        // Add remote entries first
        for (const entry of remoteIndex.entries) {
            mergedEntries.set(entry.id, entry);
        }

        // Add/override with local entries
        for (const entry of localIndex.entries) {
            const existing = mergedEntries.get(entry.id);
            if (!existing || new Date(entry.modified) > new Date(existing.modified)) {
                mergedEntries.set(entry.id, entry);
            }
        }

        const mergedIndex: IGlobalKnowledgeIndex = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            cloudGistId: gist?.id || localIndex.cloudGistId,
            cloudGistUrl: gist ? `https://gist.github.com/${gist.id}` : localIndex.cloudGistUrl,
            entries: Array.from(mergedEntries.values())
        };

        // Prepare files for upload
        const files: Record<string, string> = {
            [GIST_INDEX_FILENAME]: JSON.stringify(mergedIndex, null, 2)
        };

        // Include all local files
        for (const entry of mergedIndex.entries) {
            if (await fs.pathExists(entry.filePath)) {
                const content = await fs.readFile(entry.filePath, 'utf-8');
                const filename = path.basename(entry.filePath);
                files[filename] = content;
            }
        }

        // Download remote files we don't have locally
        let downloaded = 0;
        if (gist) {
            for (const entry of remoteIndex.entries) {
                const filename = path.basename(entry.filePath);
                const gistFile = gist.files[filename];
                const subdir = entry.type === 'pattern' ? 'patterns' : 'insights';
                const localPath = path.join(getGlobalKnowledgePath(subdir), filename);
                
                if (gistFile && !await fs.pathExists(localPath)) {
                    await fs.writeFile(localPath, gistFile.content, 'utf-8');
                    // Update file reference in merged index
                    const mergedEntry = mergedEntries.get(entry.id);
                    if (mergedEntry) {
                        mergedEntry.filePath = localPath;
                    }
                    downloaded++;
                }
            }
        }

        // Update/create gist
        if (gist) {
            await updateKnowledgeGist(gist.id, files);
        } else {
            gist = await createKnowledgeGist(files);
        }

        // Save merged index locally
        await updateGlobalKnowledgeIndex(() => mergedIndex);

        // Update metadata
        const localHash = computeIndexHash(mergedIndex);
        await saveSyncMetadata({
            gistId: gist.id,
            lastSyncedAt: new Date().toISOString(),
            lastLocalHash: localHash,
            lastRemoteHash: localHash
        });

        const localNew = localIndex.entries.filter(e => !remoteIndex.entries.find(r => r.id === e.id)).length;
        const remoteNew = downloaded;

        return {
            success: true,
            status: 'up-to-date',
            message: `Synced! ${localNew} pushed, ${remoteNew} pulled. Total: ${mergedIndex.entries.length} entries.`,
            entriesPushed: localNew,
            entriesPulled: remoteNew
        };
    } catch (err) {
        return {
            success: false,
            status: 'error',
            message: `Sync failed: ${err}`
        };
    }
}

/**
 * Get the URL to the cloud gist (for sharing/viewing)
 */
export async function getCloudUrl(): Promise<string | null> {
    const metadata = await loadSyncMetadata();
    if (metadata.gistId) {
        return `https://gist.github.com/${metadata.gistId}`;
    }
    return null;
}

// ============================================================================
// VS CODE LANGUAGE MODEL TOOLS
// ============================================================================

/**
 * Cloud Sync Tool - Sync global knowledge with GitHub
 */
export class CloudSyncTool implements vscode.LanguageModelTool<{ action: string }> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<{ action: string }>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        const action = options.input.action || 'sync';
        return {
            invocationMessage: `${action === 'push' ? 'Pushing' : action === 'pull' ? 'Pulling' : 'Syncing'} knowledge with cloud...`,
            confirmationMessages: {
                title: 'Cloud Sync',
                message: new vscode.MarkdownString(
                    `**${action.toUpperCase()}** global knowledge ${action === 'push' ? 'to' : action === 'pull' ? 'from' : 'with'} GitHub?\n\n` +
                    `This will ${action === 'push' ? 'upload local changes' : action === 'pull' ? 'download cloud changes' : 'merge local and cloud'}.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<{ action: string }>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const action = options.input.action || 'sync';
        let result: ISyncResult;

        switch (action) {
            case 'push':
                result = await pushToCloud();
                break;
            case 'pull':
                result = await pullFromCloud();
                break;
            default:
                result = await syncWithCloud();
        }

        const emoji = result.success ? '✅' : '❌';
        let response = `## ${emoji} Cloud Sync ${result.success ? 'Complete' : 'Failed'}\n\n`;
        response += `**Status**: ${result.status}\n`;
        response += `**Message**: ${result.message}\n`;

        if (result.entriesPushed !== undefined) {
            response += `**Pushed**: ${result.entriesPushed} entries\n`;
        }
        if (result.entriesPulled !== undefined) {
            response += `**Pulled**: ${result.entriesPulled} entries\n`;
        }

        const cloudUrl = await getCloudUrl();
        if (cloudUrl) {
            response += `\n**Cloud URL**: ${cloudUrl}\n`;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(response)
        ]);
    }
}

/**
 * Register cloud sync tools
 */
export function registerCloudSyncTools(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.lm.registerTool('alex_cloud_sync', new CloudSyncTool())
    );
}
