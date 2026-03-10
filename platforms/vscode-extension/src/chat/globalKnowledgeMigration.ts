/**
 * globalKnowledgeMigration.ts - Knowledge migration, normalization, and data quality
 *
 * Contains migration operations, tag generation, category inference,
 * and source normalization for global knowledge entries.
 */
import {
    GlobalKnowledgeCategory,
    IGlobalKnowledgeEntry,
} from '../shared/constants';
import {
    ensureGlobalKnowledgeIndex,
    updateGlobalKnowledgeIndex,
} from './globalKnowledge';

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
 * Ensures data quality and backward compatibility.
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
