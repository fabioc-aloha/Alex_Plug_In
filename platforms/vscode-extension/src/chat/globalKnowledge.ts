import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as lockfile from 'proper-lockfile';
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

// Import cloud sync status for auto-sync suggestions
import { getSyncStatus, triggerPostModificationSync } from './cloudSync';

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
 * Initialize the global knowledge index if it doesn't exist
 */
export async function ensureGlobalKnowledgeIndex(): Promise<IGlobalKnowledgeIndex> {
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
function generateKnowledgeId(type: 'pattern' | 'insight', title: string): string {
    const prefix = type === 'pattern' ? GLOBAL_KNOWLEDGE_PREFIXES.pattern : GLOBAL_KNOWLEDGE_PREFIXES.insight;
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 40);
    const timestamp = type === 'insight' ? `-${new Date().toISOString().split('T')[0]}` : '';
    return `${prefix}${slug}${timestamp}`;
}

/**
 * Create a new global knowledge pattern file (with concurrent-safe index update)
 */
export async function createGlobalPattern(
    title: string,
    content: string,
    category: GlobalKnowledgeCategory,
    tags: string[],
    sourceProject?: string
): Promise<IGlobalKnowledgeEntry> {
    await ensureGlobalKnowledgeDirectories();
    
    const id = generateKnowledgeId('pattern', title);
    const filename = `${id}.md`;
    const filePath = path.join(getGlobalKnowledgePath('patterns'), filename);
    
    // Create the markdown file with frontmatter-style header
    const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(', ')}  
**Source**: ${sourceProject || 'Manual entry'}  
**Created**: ${new Date().toISOString()}  

---

${content}

---

## Synapses

*Add cross-references to related knowledge files here*

`;

    await fs.writeFile(filePath, fileContent, 'utf-8');

    // Update the index atomically with locking
    const entry: IGlobalKnowledgeEntry = {
        id,
        title,
        type: 'pattern',
        category,
        tags,
        sourceProject,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        filePath
    };

    await updateGlobalKnowledgeIndex((index) => {
        index.entries.push(entry);
        return index;
    });

    return entry;
}

/**
 * Update an existing global knowledge pattern file with new content.
 * Preserves the original creation date and ID, updates modified timestamp.
 */
export async function updateGlobalPattern(
    existingEntry: IGlobalKnowledgeEntry,
    newContent: string,
    category: GlobalKnowledgeCategory,
    tags: string[],
    sourceProject?: string
): Promise<IGlobalKnowledgeEntry> {
    const filePath = existingEntry.filePath;
    
    if (!filePath || !await fs.pathExists(filePath)) {
        throw new Error(`Global pattern file not found: ${filePath}`);
    }
    
    // Merge tags (keep existing, add new)
    const allTags = [...new Set([...(existingEntry.tags || []), ...tags])];
    
    // Create updated markdown file preserving original metadata
    const fileContent = `# ${existingEntry.title}

**ID**: ${existingEntry.id}  
**Category**: ${category}  
**Tags**: ${allTags.join(', ')}  
**Source**: ${sourceProject || existingEntry.sourceProject || 'Manual entry'}  
**Created**: ${existingEntry.created}  
**Modified**: ${new Date().toISOString()}  

---

${newContent}

---

## Synapses

*Add cross-references to related knowledge files here*

`;

    await fs.writeFile(filePath, fileContent, 'utf-8');

    // Update the index entry
    const updatedEntry: IGlobalKnowledgeEntry = {
        ...existingEntry,
        category,
        tags: allTags,
        modified: new Date().toISOString(),
        summary: newContent.substring(0, 200) + (newContent.length > 200 ? '...' : '')
    };

    await updateGlobalKnowledgeIndex((index) => {
        const entryIndex = index.entries.findIndex(e => e.id === existingEntry.id);
        if (entryIndex >= 0) {
            index.entries[entryIndex] = updatedEntry;
        }
        return index;
    });

    return updatedEntry;
}

/**
 * Create a new global insight (timestamped learning) - with concurrent-safe index update
 */
export async function createGlobalInsight(
    title: string,
    content: string,
    category: GlobalKnowledgeCategory,
    tags: string[],
    sourceProject?: string,
    problemContext?: string,
    solution?: string
): Promise<IGlobalKnowledgeEntry> {
    await ensureGlobalKnowledgeDirectories();
    
    const id = generateKnowledgeId('insight', title);
    const filename = `${id}.md`;
    const filePath = path.join(getGlobalKnowledgePath('insights'), filename);
    
    // Create the markdown file
    const fileContent = `# ${title}

**ID**: ${id}  
**Category**: ${category}  
**Tags**: ${tags.join(', ')}  
**Source Project**: ${sourceProject || 'Unknown'}  
**Date**: ${new Date().toISOString()}  

---

## Context

${problemContext || 'No problem context provided.'}

## Insight

${content}

## Solution

${solution || 'See insight above.'}

---

## Applicability

*When would this insight be useful again?*

- Similar error messages
- Same technology stack: ${tags.join(', ')}
- Related patterns

## Related Projects

- ${sourceProject || 'Origin project'}

`;

    await fs.writeFile(filePath, fileContent, 'utf-8');

    // Update the index atomically with locking
    const entry: IGlobalKnowledgeEntry = {
        id,
        title,
        type: 'insight',
        category,
        tags,
        sourceProject,
        relatedProjects: sourceProject ? [sourceProject] : [],
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        filePath
    };

    await updateGlobalKnowledgeIndex((index) => {
        index.entries.push(entry);
        return index;
    });

    return entry;
}

/**
 * Search global knowledge by query
 */
export async function searchGlobalKnowledge(
    query: string,
    options: {
        type?: 'pattern' | 'insight' | 'all';
        category?: GlobalKnowledgeCategory;
        tags?: string[];
        limit?: number;
    } = {}
): Promise<{ entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[]> {
    const index = await ensureGlobalKnowledgeIndex();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    const results: { entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[] = [];

    for (const entry of index.entries) {
        // Filter by type
        if (options.type && options.type !== 'all' && entry.type !== options.type) {
            continue;
        }
        
        // Filter by category
        if (options.category && entry.category !== options.category) {
            continue;
        }
        
        // Filter by tags
        if (options.tags && options.tags.length > 0) {
            const hasMatchingTag = options.tags.some(tag => 
                entry.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
            );
            if (!hasMatchingTag) {
                continue;
            }
        }

        // Calculate relevance score
        let relevance = 0;
        
        // Title match (highest weight)
        if (entry.title.toLowerCase().includes(queryLower)) {
            relevance += 10;
        }
        for (const word of queryWords) {
            if (entry.title.toLowerCase().includes(word)) {
                relevance += 3;
            }
        }

        // Tag match
        for (const tag of entry.tags) {
            if (tag.toLowerCase().includes(queryLower) || queryLower.includes(tag.toLowerCase())) {
                relevance += 5;
            }
            for (const word of queryWords) {
                if (tag.toLowerCase().includes(word)) {
                    relevance += 2;
                }
            }
        }

        // Summary match
        if (entry.summary.toLowerCase().includes(queryLower)) {
            relevance += 3;
        }
        for (const word of queryWords) {
            if (entry.summary.toLowerCase().includes(word)) {
                relevance += 1;
            }
        }

        // Category match
        if (entry.category.toLowerCase().includes(queryLower)) {
            relevance += 2;
        }

        if (relevance > 0) {
            // Read full content for top results
            let content: string | undefined;
            if (await fs.pathExists(entry.filePath)) {
                try {
                    content = await fs.readFile(entry.filePath, 'utf-8');
                    // Additional relevance from content
                    for (const word of queryWords) {
                        const matches = (content.toLowerCase().match(new RegExp(word, 'g')) || []).length;
                        relevance += Math.min(matches, 5) * 0.5;
                    }
                } catch (err) {
                    // File read error, skip content
                }
            }
            
            results.push({ entry, relevance, content });
        }
    }

    // Sort by relevance and apply limit
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, options.limit || 10);
}

/**
 * Promote a project-local DK file to global knowledge
 */
export async function promoteToGlobalKnowledge(
    localFilePath: string,
    category: GlobalKnowledgeCategory,
    additionalTags: string[] = []
): Promise<IGlobalKnowledgeEntry | null> {
    try {
        const content = await fs.readFile(localFilePath, 'utf-8');
        const filename = path.basename(localFilePath, '.md');
        
        // Extract title from content (first H1) or use filename
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename.replace(/^DK-/, '').replace(/-/g, ' ');
        
        // Extract existing tags if any
        const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)$/m);
        const existingTags = tagsMatch 
            ? tagsMatch[1].split(',').map(t => t.trim())
            : [];
        
        const allTags = [...new Set([...existingTags, ...additionalTags])];
        
        // Get source project name
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const sourceProject = workspaceFolders 
            ? path.basename(workspaceFolders[0].uri.fsPath)
            : undefined;

        return await createGlobalPattern(title, content, category, allTags, sourceProject);
    } catch (err) {
        console.error('Failed to promote file to global knowledge:', err);
        return null;
    }
}

/**
 * Find relevant global knowledge for the current project context
 */
export async function findRelevantKnowledge(
    context: string,
    technologies?: string[]
): Promise<{ entry: IGlobalKnowledgeEntry; relevance: number; content?: string }[]> {
    // Build search query from context and technologies
    const searchTerms = [context];
    if (technologies) {
        searchTerms.push(...technologies);
    }
    
    return searchGlobalKnowledge(searchTerms.join(' '), { limit: 5 });
}

// ============================================================================
// AUTO-PROMOTION DURING MEDITATION (UNCONSCIOUS MIND)
// ============================================================================

/**
 * Evaluation criteria for DK files
 */
export interface DKFileEvaluation {
    filePath: string;
    filename: string;
    title: string;
    score: number;
    reasons: string[];
    category: GlobalKnowledgeCategory;
    tags: string[];
    isPromotionCandidate: boolean;
    alreadyPromoted: boolean;
    /** The existing global entry if already promoted */
    existingEntry?: IGlobalKnowledgeEntry;
    /** True if local file has been modified since promotion */
    hasLocalChanges: boolean;
}

/**
 * Result of auto-promotion during meditation
 */
export interface AutoPromotionResult {
    evaluated: number;
    promoted: IGlobalKnowledgeEntry[];
    /** Files that were updated (already existed in global but had local changes) */
    updated: IGlobalKnowledgeEntry[];
    skipped: { filename: string; reason: string }[];
    alreadyGlobal: string[];
}

/**
 * Files that should NOT be auto-promoted (meta-files, skill lists, etc.)
 */
const EXCLUDED_FROM_PROMOTION = [
    'DK-SKILL-WISHLIST',
    'DK-GENERIC-FRAMEWORK',
    'VERSION-NAMING-CONVENTION'
];

/**
 * Evaluate a single DK file for promotion candidacy.
 * Scores based on:
 * - Has synapses (3 points)
 * - Has clear structure with sections (2 points)
 * - Has tags defined (1 point)
 * - File size > 1KB (1 point) 
 * - File size > 5KB (2 additional points)
 * - Has examples or code blocks (2 points)
 * - General applicability heuristics (1-3 points)
 */
export async function evaluateDKFile(filePath: string): Promise<DKFileEvaluation> {
    const filename = path.basename(filePath, '.md');
    const content = await fs.readFile(filePath, 'utf-8');
    
    let score = 0;
    const reasons: string[] = [];
    
    // Extract title
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace(/^DK-/, '').replace(/-/g, ' ');
    
    // Check for synapses section with actual connections
    const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;
    const synapseMatches = content.match(synapseRegex);
    if (synapseMatches && synapseMatches.length > 0) {
        score += 3;
        reasons.push(`Has ${synapseMatches.length} synapse connection(s)`);
    }
    
    // Check for clear structure (multiple H2 sections)
    const h2Sections = content.match(/^##\s+.+$/gm);
    if (h2Sections && h2Sections.length >= 3) {
        score += 2;
        reasons.push(`Well-structured with ${h2Sections.length} sections`);
    }
    
    // Check for tags
    const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)$/m);
    let tags: string[] = [];
    if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(t => t.trim()).filter(t => t.length > 0);
        if (tags.length > 0) {
            score += 1;
            reasons.push(`Has ${tags.length} tag(s)`);
        }
    }
    
    // Check file size (content richness indicator)
    if (content.length > 1000) {
        score += 1;
        reasons.push('Substantial content (>1KB)');
    }
    if (content.length > 5000) {
        score += 2;
        reasons.push('Rich content (>5KB)');
    }
    
    // Check for examples or code blocks
    const codeBlocks = content.match(/```[\s\S]*?```/g);
    if (codeBlocks && codeBlocks.length > 0) {
        score += 2;
        reasons.push(`Contains ${codeBlocks.length} code example(s)`);
    }
    
    // General applicability heuristics
    const generalTerms = [
        /pattern/i, /best practice/i, /guideline/i, /framework/i,
        /principle/i, /architecture/i, /design/i, /approach/i
    ];
    const generalMatchCount = generalTerms.filter(re => re.test(content)).length;
    if (generalMatchCount >= 2) {
        score += Math.min(generalMatchCount, 3);
        reasons.push(`Contains general/reusable concepts`);
    }
    
    // Determine category from content
    const category = inferCategoryFromContent(content, filename);
    
    // Check if already promoted and detect local changes
    const index = await ensureGlobalKnowledgeIndex();
    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const existingEntry = index.entries.find(e => 
        e.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalizedTitle ||
        e.id.includes(normalizedTitle)
    );
    const alreadyPromoted = !!existingEntry;
    
    // Check if local file has changes since last promotion
    let hasLocalChanges = false;
    if (alreadyPromoted && existingEntry) {
        try {
            const localStats = await fs.stat(filePath);
            const localModified = localStats.mtime;
            const globalModified = new Date(existingEntry.modified);
            // Local file modified after global entry was last updated
            hasLocalChanges = localModified > globalModified;
        } catch {
            // If we can't check, assume no changes
            hasLocalChanges = false;
        }
    }
    
    return {
        filePath,
        filename,
        title,
        score,
        reasons,
        category,
        tags,
        isPromotionCandidate: score >= 5 && !alreadyPromoted,
        alreadyPromoted,
        existingEntry,
        hasLocalChanges
    };
}

/**
 * Infer category from file content and name
 */
function inferCategoryFromContent(content: string, filename: string): GlobalKnowledgeCategory {
    const contentLower = content.toLowerCase();
    const filenameLower = filename.toLowerCase();
    
    const categoryPatterns: [RegExp, GlobalKnowledgeCategory][] = [
        [/error|exception|fault|handling/i, 'error-handling'],
        [/api|rest|graphql|endpoint/i, 'api-design'],
        [/test|spec|jest|mocha|assertion/i, 'testing'],
        [/debug|troubleshoot|diagnos/i, 'debugging'],
        [/performance|optimi|cache|speed/i, 'performance'],
        [/architecture|design|pattern|structure/i, 'architecture'],
        [/security|auth|encrypt|vulnerab/i, 'security'],
        [/deploy|ci\/cd|pipeline|docker|kubernetes/i, 'deployment'],
        [/document|readme|comment|diagram/i, 'documentation'],
        [/refactor|clean|improve|modernize/i, 'refactoring'],
        [/tool|config|setup|environment/i, 'tooling'],
    ];
    
    for (const [pattern, category] of categoryPatterns) {
        if (pattern.test(contentLower) || pattern.test(filenameLower)) {
            return category;
        }
    }
    
    return 'general';
}

/**
 * UNCONSCIOUS MIND: Auto-promote valuable DK files during meditation.
 * This runs during self-actualization and meditation sessions.
 * 
 * Criteria for auto-promotion (minimum score of 5):
 * - Has synapses (+3)
 * - Well-structured (+2)
 * - Has tags (+1)
 * - Substantial content (+1 to +3)
 * - Has examples (+2)
 * - General applicability (+1 to +3)
 */
export async function autoPromoteDuringMeditation(
    workspacePath: string,
    options: { dryRun?: boolean; minScore?: number } = {}
): Promise<AutoPromotionResult> {
    const { dryRun = false, minScore = 5 } = options;
    
    await ensureGlobalKnowledgeDirectories();
    
    const result: AutoPromotionResult = {
        evaluated: 0,
        promoted: [],
        updated: [],
        skipped: [],
        alreadyGlobal: []
    };
    
    // Find all DK files in the workspace
    const dkPath = path.join(workspacePath, '.github', 'domain-knowledge');
    if (!await fs.pathExists(dkPath)) {
        return result;
    }
    
    const files = await fs.readdir(dkPath);
    const dkFiles = files.filter(f => f.startsWith('DK-') && f.endsWith('.md'));
    
    for (const file of dkFiles) {
        const filePath = path.join(dkPath, file);
        const filenameWithoutExt = file.replace('.md', '');
        
        // Skip excluded files
        if (EXCLUDED_FROM_PROMOTION.some(excluded => filenameWithoutExt.includes(excluded))) {
            result.skipped.push({ filename: file, reason: 'Excluded meta-file' });
            continue;
        }
        
        result.evaluated++;
        
        try {
            const evaluation = await evaluateDKFile(filePath);
            
            // Handle already promoted files - check for updates
            if (evaluation.alreadyPromoted) {
                if (evaluation.hasLocalChanges && evaluation.existingEntry) {
                    // Local file has been modified - update the global version
                    if (!dryRun) {
                        const content = await fs.readFile(filePath, 'utf-8');
                        const workspaceFolders = vscode.workspace.workspaceFolders;
                        const sourceProject = workspaceFolders 
                            ? path.basename(workspaceFolders[0].uri.fsPath)
                            : undefined;
                        
                        const updatedEntry = await updateGlobalPattern(
                            evaluation.existingEntry,
                            content,
                            evaluation.category,
                            evaluation.tags,
                            sourceProject
                        );
                        result.updated.push(updatedEntry);
                    } else {
                        // Dry run - mock update entry
                        result.updated.push({
                            ...evaluation.existingEntry,
                            modified: new Date().toISOString(),
                            summary: `[DRY-RUN] Would be updated from local changes`
                        });
                    }
                } else {
                    // No changes - skip
                    result.alreadyGlobal.push(file);
                }
                continue;
            }
            
            if (!evaluation.isPromotionCandidate || evaluation.score < minScore) {
                result.skipped.push({ 
                    filename: file, 
                    reason: `Score ${evaluation.score}/${minScore} - ${evaluation.reasons.join(', ') || 'Needs more structure/content'}`
                });
                continue;
            }
            
            // Promote the file
            if (!dryRun) {
                const entry = await promoteToGlobalKnowledge(
                    filePath,
                    evaluation.category,
                    evaluation.tags
                );
                
                if (entry) {
                    result.promoted.push(entry);
                }
            } else {
                // In dry run, create a mock entry for reporting
                result.promoted.push({
                    id: `[DRY-RUN] ${filenameWithoutExt}`,
                    title: evaluation.title,
                    type: 'pattern',
                    category: evaluation.category,
                    tags: evaluation.tags,
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    summary: `Would be promoted with score ${evaluation.score}`,
                    filePath
                });
            }
        } catch (err) {
            result.skipped.push({ filename: file, reason: `Error: ${err}` });
        }
    }
    
    // Trigger cloud sync if we promoted or updated anything
    if (!dryRun && (result.promoted.length > 0 || result.updated.length > 0)) {
        triggerPostModificationSync();
    }
    
    return result;
}

/**
 * Get summary of global knowledge base
 */
export async function getGlobalKnowledgeSummary(): Promise<{
    totalPatterns: number;
    totalInsights: number;
    categories: Record<string, number>;
    recentEntries: IGlobalKnowledgeEntry[];
    topTags: { tag: string; count: number }[];
}> {
    const index = await ensureGlobalKnowledgeIndex();
    
    const categories: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    
    for (const entry of index.entries) {
        // Count by category
        categories[entry.category] = (categories[entry.category] || 0) + 1;
        
        // Count tags
        for (const tag of entry.tags) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
    }

    // Get top tags
    const topTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Get recent entries
    const recentEntries = [...index.entries]
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .slice(0, 5);

    return {
        totalPatterns: index.entries.filter(e => e.type === 'pattern').length,
        totalInsights: index.entries.filter(e => e.type === 'insight').length,
        categories,
        recentEntries,
        topTags
    };
}

// ============================================================================
// GLOBAL KNOWLEDGE MIGRATION & NORMALIZATION
// ============================================================================

/**
 * Common words to exclude from tag generation
 */
const TAG_EXCLUSION_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
    'that', 'these', 'those', 'it', 'its', 'domain', 'knowledge', 'about',
    'how', 'what', 'when', 'where', 'why', 'which', 'who', 'file', 'files'
]);

/**
 * Category keyword mapping for inferring correct category from title/summary
 */
const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
    'documentation': ['writing', 'publication', 'ascii', 'art', 'diagram', 'markdown', 'lint', 'document', 'docs', 'readme', 'mermaid'],
    'tooling': ['tool', 'build', 'script', 'automation', 'vscode', 'extension', 'plugin', 'cli'],
    'debugging': ['debug', 'error', 'fix', 'troubleshoot', 'issue', 'bug', 'trace', 'log'],
    'testing': ['test', 'spec', 'unit', 'integration', 'mock', 'jest', 'mocha', 'cypress'],
    'architecture': ['architecture', 'design', 'structure', 'system', 'cognitive', 'synapse', 'memory'],
    'performance': ['performance', 'optimization', 'speed', 'cache', 'memory', 'profiling', 'benchmark'],
    'security': ['security', 'auth', 'permission', 'token', 'credential', 'encrypt', 'ssl', 'tls'],
    'api-design': ['api', 'endpoint', 'rest', 'graphql', 'schema', 'http', 'request', 'response'],
    'deployment': ['deploy', 'release', 'publish', 'ci', 'cd', 'pipeline', 'docker', 'kubernetes'],
    'refactoring': ['refactor', 'migration', 'upgrade', 'modernize', 'cleanup', 'consolidate'],
    'patterns': ['pattern', 'practice', 'convention', 'standard', 'idiom', 'best', 'practices'],
    'error-handling': ['exception', 'catch', 'throw', 'recovery', 'fallback', 'retry'],
};

/**
 * Result of migration operation
 */
export interface IMigrationResult {
    entriesProcessed: number;
    entriesNormalized: number;
    tagsGenerated: number;
    categoriesFixed: number;
    sourcesFixed: number;
    skipped: number;
    details: string[];
}

/**
 * Generate tags from title string
 */
function generateTagsFromTitle(title: string): string[] {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/[\s-]+/)
        .filter(word => word.length > 2 && !TAG_EXCLUSION_WORDS.has(word))
        .slice(0, 5);  // Max 5 auto-generated tags
}

/**
 * Infer the correct category based on title and summary keywords
 */
function inferCategory(title: string, summary: string, currentCategory: GlobalKnowledgeCategory): GlobalKnowledgeCategory {
    const combined = `${title} ${summary}`.toLowerCase();
    
    // Score each category by matching keywords
    let bestCategory = currentCategory;
    let bestScore = 0;
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORD_MAP)) {
        const score = keywords.filter(kw => combined.includes(kw)).length;
        if (score > bestScore) {
            bestScore = score;
            bestCategory = category as GlobalKnowledgeCategory;
        }
    }
    
    // Only change if we have at least 2 keyword matches (more confident)
    return bestScore >= 2 ? bestCategory : currentCategory;
}

/**
 * Normalize source project attribution
 */
function normalizeSource(entry: IGlobalKnowledgeEntry): string | undefined {
    // Map bulk-promoted sandbox entries to their true origin
    if (entry.sourceProject === 'Alex_Sandbox') {
        // Entries with "domain-knowledge" or "GK-domain-knowledge" IDs are from skill promotion
        if (entry.id.includes('domain-knowledge') || entry.type === 'pattern') {
            return 'Master Alex (promoted skill)';
        }
    }
    
    // Keep original source for actual project insights
    return entry.sourceProject;
}

/**
 * Normalize a single entry, returning whether it was modified
 */
function normalizeEntry(entry: IGlobalKnowledgeEntry, details: string[]): boolean {
    let modified = false;
    
    // 1. Fix empty tags
    if (!entry.tags || entry.tags.length === 0) {
        const generatedTags = generateTagsFromTitle(entry.title);
        if (generatedTags.length > 0) {
            entry.tags = generatedTags;
            details.push(`Generated tags for "${entry.title}": ${generatedTags.join(', ')}`);
            modified = true;
        }
    }
    
    // 2. Fix category if appears miscategorized
    const inferredCategory = inferCategory(entry.title, entry.summary || '', entry.category);
    if (inferredCategory !== entry.category) {
        details.push(`Fixed category for "${entry.title}": ${entry.category} → ${inferredCategory}`);
        entry.category = inferredCategory;
        modified = true;
    }
    
    // 3. Normalize source attribution
    const normalizedSource = normalizeSource(entry);
    if (normalizedSource !== entry.sourceProject) {
        details.push(`Normalized source for "${entry.title}": ${entry.sourceProject} → ${normalizedSource}`);
        entry.sourceProject = normalizedSource;
        modified = true;
    }
    
    return modified;
}

/**
 * Normalize all global knowledge entries.
 * Called during cloud sync to ensure data quality.
 * Backward compatible - older versions can still read the format.
 */
export async function normalizeGlobalKnowledge(): Promise<IMigrationResult> {
    const result: IMigrationResult = {
        entriesProcessed: 0,
        entriesNormalized: 0,
        tagsGenerated: 0,
        categoriesFixed: 0,
        sourcesFixed: 0,
        skipped: 0,
        details: []
    };
    
    try {
        const index = await ensureGlobalKnowledgeIndex();
        let indexModified = false;
        
        for (const entry of index.entries) {
            result.entriesProcessed++;
            
            const originalTags = entry.tags?.length || 0;
            const originalCategory = entry.category;
            const originalSource = entry.sourceProject;
            
            const modified = normalizeEntry(entry, result.details);
            
            if (modified) {
                result.entriesNormalized++;
                indexModified = true;
                
                // Track specific changes
                if ((entry.tags?.length || 0) > originalTags) {
                    result.tagsGenerated++;
                }
                if (entry.category !== originalCategory) {
                    result.categoriesFixed++;
                }
                if (entry.sourceProject !== originalSource) {
                    result.sourcesFixed++;
                }
                
                // Update modified timestamp
                entry.modified = new Date().toISOString();
            } else {
                result.skipped++;
            }
        }
        
        // Save the index if any changes were made
        if (indexModified) {
            // Bump schema version to indicate normalized data
            index.version = '1.0.1';
            await updateGlobalKnowledgeIndex(() => index);
            result.details.push(`Index updated: ${result.entriesNormalized} entries normalized`);
        }
        
        return result;
        
    } catch (err) {
        result.details.push(`Migration error: ${err}`);
        return result;
    }
}

/**
 * Check if migration is needed (any entries with empty tags or miscategorized)
 */
export async function needsMigration(): Promise<boolean> {
    try {
        const index = await ensureGlobalKnowledgeIndex();
        
        for (const entry of index.entries) {
            // Check for empty tags
            if (!entry.tags || entry.tags.length === 0) {
                return true;
            }
            
            // Check for likely miscategorization
            const inferredCategory = inferCategory(entry.title, entry.summary || '', entry.category);
            if (inferredCategory !== entry.category) {
                return true;
            }
            
            // Check for sandbox source that should be normalized
            if (entry.sourceProject === 'Alex_Sandbox' && 
                (entry.id.includes('domain-knowledge') || entry.type === 'pattern')) {
                return true;
            }
        }
        
        return false;
    } catch {
        return false;
    }
}

// ============================================================================
// VS CODE LANGUAGE MODEL TOOLS
// ============================================================================

/**
 * Input parameters for Global Knowledge Search tool
 */
export interface IGlobalKnowledgeSearchParams {
    query: string;
    type?: 'pattern' | 'insight' | 'all';
    category?: string;
    tags?: string;
}

/**
 * Global Knowledge Search Tool - Search across all projects' accumulated wisdom
 */
export class GlobalKnowledgeSearchTool implements vscode.LanguageModelTool<IGlobalKnowledgeSearchParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IGlobalKnowledgeSearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Searching global knowledge for: ${options.input.query}`,
            confirmationMessages: {
                title: 'Search Global Knowledge',
                message: new vscode.MarkdownString(
                    `Search Alex's global knowledge base across all projects for: **${options.input.query}**?\n\n` +
                    `This searches patterns and insights learned from all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IGlobalKnowledgeSearchParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const { query, type, category, tags } = options.input;
        
        const results = await searchGlobalKnowledge(query, {
            type: type as 'pattern' | 'insight' | 'all' | undefined,
            category: category as GlobalKnowledgeCategory | undefined,
            tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
            limit: 10
        });

        if (results.length === 0) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `No global knowledge found matching "${query}".\n\n` +
                    `You can save new knowledge using:\n` +
                    `- \`@alex /saveinsight\` to save a learning from the current project\n` +
                    `- \`@alex /promote\` to promote project-local knowledge to global`
                )
            ]);
        }

        let result = `## Global Knowledge Search Results\n\n`;
        result += `Found **${results.length}** relevant entries for "${query}":\n\n`;

        for (const { entry, relevance } of results) {
            const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
            result += `### ${typeEmoji} ${entry.title}\n`;
            result += `- **Type**: ${entry.type} | **Category**: ${entry.category}\n`;
            result += `- **Tags**: ${entry.tags.join(', ')}\n`;
            if (entry.sourceProject) {
                result += `- **Source**: ${entry.sourceProject}\n`;
            }
            result += `- **Summary**: ${entry.summary}\n`;
            result += `- **File**: \`${entry.filePath}\`\n\n`;
        }

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Input parameters for Save Insight tool
 */
export interface ISaveInsightParams {
    title: string;
    insight: string;
    category?: string;
    tags?: string;
    problem?: string;
    solution?: string;
}

/**
 * Save Insight Tool - Save a new learning to global knowledge base
 */
export class SaveInsightTool implements vscode.LanguageModelTool<ISaveInsightParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ISaveInsightParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Saving insight: ${options.input.title}`,
            confirmationMessages: {
                title: 'Save Global Insight',
                message: new vscode.MarkdownString(
                    `Save this insight to Alex's global knowledge base?\n\n` +
                    `**Title**: ${options.input.title}\n\n` +
                    `This will be available across all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ISaveInsightParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const { title, insight, category, tags, problem, solution } = options.input;
        
        // Get current project name
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const sourceProject = workspaceFolders 
            ? path.basename(workspaceFolders[0].uri.fsPath)
            : undefined;

        const entry = await createGlobalInsight(
            title,
            insight,
            (category || 'general') as GlobalKnowledgeCategory,
            tags ? tags.split(',').map(t => t.trim()) : [],
            sourceProject,
            problem,
            solution
        );

        // === UNCONSCIOUS MIND: Trigger automatic background sync ===
        triggerPostModificationSync();

        const result = `## ✅ Insight Saved to Global Knowledge

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(', ')}  
**Source Project**: ${entry.sourceProject || 'Unknown'}  
**File**: \`${entry.filePath}\`

This insight is now available across all your projects.
*🧠 Unconscious sync triggered - backing up to cloud automatically.*
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Input parameters for Promote Knowledge tool
 */
export interface IPromoteKnowledgeParams {
    filePath: string;
    category?: string;
    additionalTags?: string;
}

/**
 * Promote Knowledge Tool - Promote project-local DK file to global knowledge
 */
export class PromoteKnowledgeTool implements vscode.LanguageModelTool<IPromoteKnowledgeParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IPromoteKnowledgeParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: `Promoting ${path.basename(options.input.filePath)} to global knowledge`,
            confirmationMessages: {
                title: 'Promote to Global Knowledge',
                message: new vscode.MarkdownString(
                    `Promote this project-local knowledge file to global knowledge?\n\n` +
                    `**File**: ${options.input.filePath}\n\n` +
                    `This will make it searchable and available across all your projects.`
                )
            }
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IPromoteKnowledgeParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        const { filePath, category, additionalTags } = options.input;
        
        // Verify file exists
        if (!await fs.pathExists(filePath)) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`❌ File not found: ${filePath}`)
            ]);
        }

        const entry = await promoteToGlobalKnowledge(
            filePath,
            (category || 'general') as GlobalKnowledgeCategory,
            additionalTags ? additionalTags.split(',').map(t => t.trim()) : []
        );

        if (!entry) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`❌ Failed to promote file to global knowledge.`)
            ]);
        }

        // === UNCONSCIOUS MIND: Trigger automatic background sync ===
        triggerPostModificationSync();

        const result = `## ✅ Knowledge Promoted to Global

**ID**: ${entry.id}  
**Title**: ${entry.title}  
**Category**: ${entry.category}  
**Tags**: ${entry.tags.join(', ')}  
**Global File**: \`${entry.filePath}\`

This knowledge is now available across all your projects!
*🧠 Unconscious sync triggered - backing up to cloud automatically.*
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Global Knowledge Status Tool - Show summary of the global knowledge base
 */
export class GlobalKnowledgeStatusTool implements vscode.LanguageModelTool<Record<string, never>> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<Record<string, never>>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Retrieving global knowledge status...'
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<Record<string, never>>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        await ensureGlobalKnowledgeDirectories();
        
        const summary = await getGlobalKnowledgeSummary();
        const registry = await ensureProjectRegistry();

        // Get cloud sync status
        let syncStatusStr = '';
        try {
            const syncStatus = await getSyncStatus();
            const statusEmoji = syncStatus.status === 'up-to-date' ? '✅' :
                               syncStatus.status === 'needs-push' ? '📤' :
                               syncStatus.status === 'needs-pull' ? '📥' :
                               syncStatus.status === 'error' ? '❌' : '⚪';
            syncStatusStr = `| Cloud Sync | ${statusEmoji} ${syncStatus.status} |\n`;
        } catch {
            syncStatusStr = `| Cloud Sync | ⚪ Not configured |\n`;
        }

        let result = `## 🧠 Global Knowledge Base Status

### Overview
| Metric | Count |
|--------|-------|
| Global Patterns | ${summary.totalPatterns} |
| Global Insights | ${summary.totalInsights} |
| Known Projects | ${registry.projects.length} |
${syncStatusStr}
### Knowledge by Category
`;
        
        for (const [cat, count] of Object.entries(summary.categories)) {
            result += `- **${cat}**: ${count}\n`;
        }

        if (summary.topTags.length > 0) {
            result += `\n### Top Tags\n`;
            for (const { tag, count } of summary.topTags) {
                result += `- ${tag}: ${count}\n`;
            }
        }

        if (summary.recentEntries.length > 0) {
            result += `\n### Recent Entries\n`;
            for (const entry of summary.recentEntries) {
                const typeEmoji = entry.type === 'pattern' ? '📐' : '💡';
                result += `- ${typeEmoji} **${entry.title}** (${entry.category})\n`;
            }
        }

        if (registry.projects.length > 0) {
            result += `\n### Known Projects\n`;
            for (const project of registry.projects.slice(0, 5)) {
                result += `- **${project.name}** - ${project.knowledgeFiles} knowledge files\n`;
            }
        }

        result += `\n### Global Knowledge Location\n\`${getAlexGlobalPath()}\`\n`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}

/**
 * Register all global knowledge tools
 */
export function registerGlobalKnowledgeTools(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.lm.registerTool('alex_global_knowledge_search', new GlobalKnowledgeSearchTool()),
        vscode.lm.registerTool('alex_save_insight', new SaveInsightTool()),
        vscode.lm.registerTool('alex_promote_knowledge', new PromoteKnowledgeTool()),
        vscode.lm.registerTool('alex_global_knowledge_status', new GlobalKnowledgeStatusTool())
    );
}
