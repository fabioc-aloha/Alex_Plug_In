/**
 * Core synapse scanning and repair logic - platform-agnostic
 * Used by both VS Code dream command and CLI scripts
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface Synapse {
    sourceFile: string;
    targetFile: string;
    strength: string;
    type: string;
    direction: string;
    condition: string;
    line: number;
    isValid: boolean;
    repaired?: boolean;
    newTarget?: string;
}

export interface DreamReport {
    timestamp: string;
    totalFiles: number;
    totalSynapses: number;
    brokenSynapses: Synapse[];
    repairedSynapses: Synapse[];
    orphanedFiles: string[];
}

export interface DreamResult {
    success: boolean;
    totalFiles: number;
    totalSynapses: number;
    brokenCount: number;
    repairedCount: number;
    reportPath?: string;
}

export interface ProgressCallback {
    (message: string): void;
}

/* eslint-disable @typescript-eslint/naming-convention */
export const consolidatedMappings: { [key: string]: string } = {
    "enhanced-meditation-protocol.prompt.md": "unified-meditation-protocols.prompt.md",
    "meditation-consolidation.prompt.md": "unified-meditation-protocols.prompt.md",
    "dream-meditation-distinction.prompt.md": "unified-meditation-protocols.prompt.md",
    "alex-finch-integration.prompt.md": "alex-identity-integration.instructions.md",
    "self-identity-integration.prompt.md": "alex-identity-integration.instructions.md",
    "character-driven-development.instructions.md": "alex-identity-integration.instructions.md",
    "unified-consciousness.instructions.md": "alex-identity-integration.instructions.md",
    "dream-protocol-integration.prompt.md": "dream-state-automation.instructions.md",
    "dream-protocol-mastery-meditation.prompt.md": "dream-state-automation.instructions.md"
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Memory file patterns to scan for synapses
 */
export const memoryFilePatterns = [
    '.github/copilot-instructions.md',
    '.github/instructions/*.md',
    '.github/prompts/*.md',
    '.github/episodic/*.md',
    '.github/skills/*/SKILL.md',
    '.github/domain-knowledge/*.md'  // Legacy - kept for backward compatibility
];

/**
 * Files to ignore when validating synapse targets
 */
export const ignoredTargetFiles = ['target-file.md', 'CHANGELOG.md'];

/**
 * Regex to match synapse notation:
 * [file.md] (strength, type, direction) - "condition"
 */
export const synapseRegex = /\[([^\]]+\.md)\]\s*\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)\s*-\s*"([^"]*)"/g;

/**
 * Match a file against a glob-like pattern
 */
function matchPattern(filePath: string, pattern: string, rootPath: string): boolean {
    const relativePath = path.relative(rootPath, filePath).replace(/\\/g, '/');
    
    // Handle patterns like '.github/instructions/*.md'
    const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '{{GLOBSTAR}}')
        .replace(/\*/g, '[^/]*')
        .replace(/{{GLOBSTAR}}/g, '.*');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(relativePath);
}

/**
 * Recursively find all .md files in a directory
 */
async function findMdFilesRecursive(dir: string, rootPath: string): Promise<string[]> {
    const results: string[] = [];
    
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            // Skip node_modules and hidden directories (except .github)
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules') {
                    continue;
                }
                if (entry.name.startsWith('.') && entry.name !== '.github') {
                    continue;
                }
                
                const subResults = await findMdFilesRecursive(fullPath, rootPath);
                results.push(...subResults);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                results.push(fullPath);
            }
        }
    } catch {
        // Directory doesn't exist or can't be read
    }
    
    return results;
}

/**
 * Find all memory files in a workspace
 */
export async function findMemoryFiles(rootPath: string): Promise<string[]> {
    const allFiles: string[] = [];
    const githubPath = path.join(rootPath, '.github');
    
    if (!await fs.pathExists(githubPath)) {
        return allFiles;
    }
    
    // Get all .md files under .github
    const mdFiles = await findMdFilesRecursive(githubPath, rootPath);
    
    // Filter to only include files matching our patterns
    for (const file of mdFiles) {
        for (const pattern of memoryFilePatterns) {
            if (matchPattern(file, pattern, rootPath)) {
                allFiles.push(file);
                break;
            }
        }
    }
    
    // Remove duplicates
    return [...new Set(allFiles)];
}

/**
 * Build an index of all .md files for fast lookup
 */
export async function buildFileIndex(rootPath: string): Promise<Set<string>> {
    const mdFiles = await findMdFilesRecursive(rootPath, rootPath);
    return new Set(mdFiles.map(f => path.basename(f).toLowerCase()));
}

/**
 * Check if a synapse target file exists
 */
export async function validateSynapseTarget(
    targetName: string,
    sourceFile: string,
    rootPath: string,
    knownFileBasenames: Set<string>,
    memoryFileSet: Set<string>
): Promise<boolean> {
    // 1. Check ignored files first
    if (ignoredTargetFiles.includes(targetName)) {
        return true;
    }

    const targetBasename = path.basename(targetName).toLowerCase();
    
    // 2. Check if in memory files list
    const normalizedTarget = path.normalize(targetName).toLowerCase();
    if (Array.from(memoryFileSet).some(f => f.endsWith(normalizedTarget))) {
        return true;
    }
    
    // 3. Check pre-built index
    if (knownFileBasenames.has(targetBasename)) {
        return true;
    }
    
    // 4. Check direct path from root
    const absolutePath = path.join(rootPath, targetName);
    if (await fs.pathExists(absolutePath)) {
        return true;
    }
    
    // 5. Check relative to source file
    const sourceDir = path.dirname(sourceFile);
    const relativePath = path.join(sourceDir, targetName);
    if (await fs.pathExists(relativePath)) {
        return true;
    }
    
    return false;
}

/**
 * Parse synapses from a single file
 */
export async function parseSynapsesFromFile(
    filePath: string,
    rootPath: string,
    knownFileBasenames: Set<string>,
    memoryFileSet: Set<string>
): Promise<Synapse[]> {
    const synapses: Synapse[] = [];
    
    let content: string;
    try {
        content = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error(`Failed to read file ${filePath}:`, error);
        return synapses;
    }
    
    const lines = content.split('\n');
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Track code block state to skip false positives
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) {
            continue;
        }
        
        // Reset regex state
        const regex = new RegExp(synapseRegex.source, synapseRegex.flags);
        let match;
        
        while ((match = regex.exec(line)) !== null) {
            const targetName = match[1].trim();
            const isValid = await validateSynapseTarget(
                targetName,
                filePath,
                rootPath,
                knownFileBasenames,
                memoryFileSet
            );
            
            synapses.push({
                sourceFile: filePath,
                targetFile: targetName,
                strength: match[2].trim(),
                type: match[3]?.trim() || 'association',
                direction: match[4]?.trim() || 'unidirectional',
                condition: match[5]?.trim() || '',
                line: i + 1,
                isValid
            });
        }
    }
    
    return synapses;
}

/**
 * Attempt to repair a broken synapse using consolidated mappings
 */
export async function repairSynapse(synapse: Synapse): Promise<boolean> {
    const targetName = path.basename(synapse.targetFile);
    const newTarget = consolidatedMappings[targetName];
    
    if (!newTarget) {
        return false;
    }
    
    try {
        const fileContent = await fs.readFile(synapse.sourceFile, 'utf-8');
        const escapedTarget = synapse.targetFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\[${escapedTarget}\\]`, 'g');
        
        if (!regex.test(fileContent)) {
            return false;
        }
        
        const newContent = fileContent.replace(regex, `[${newTarget}]`);
        await fs.writeFile(synapse.sourceFile, newContent, 'utf-8');
        
        synapse.repaired = true;
        synapse.newTarget = newTarget;
        return true;
    } catch (error) {
        console.error(`Failed to repair synapse in ${synapse.sourceFile}:`, error);
        return false;
    }
}

/**
 * Run the full dream protocol - core logic
 */
export async function runDreamCore(
    rootPath: string,
    onProgress?: ProgressCallback
): Promise<{ report: DreamReport; synapses: Synapse[] }> {
    const progress = onProgress || (() => {});
    
    progress('Scanning neural network...');
    
    // 1. Find all memory files
    const allFiles = await findMemoryFiles(rootPath);
    
    if (allFiles.length === 0) {
        return {
            report: {
                timestamp: new Date().toISOString(),
                totalFiles: 0,
                totalSynapses: 0,
                brokenSynapses: [],
                repairedSynapses: [],
                orphanedFiles: []
            },
            synapses: []
        };
    }
    
    // 2. Build file index for fast lookups
    progress('Building file index...');
    const knownFileBasenames = await buildFileIndex(rootPath);
    const memoryFileSet = new Set(allFiles.map(f => path.normalize(f).toLowerCase()));
    
    // 3. Parse all synapses
    progress('Scanning synapses...');
    const allSynapses: Synapse[] = [];
    
    for (const file of allFiles) {
        const fileSynapses = await parseSynapsesFromFile(
            file,
            rootPath,
            knownFileBasenames,
            memoryFileSet
        );
        allSynapses.push(...fileSynapses);
    }
    
    // 4. Identify broken synapses
    let brokenSynapses = allSynapses.filter(s => !s.isValid);
    
    // 5. Attempt repairs
    progress('Repairing broken connections...');
    const repairedSynapses: Synapse[] = [];
    const remainingBrokenSynapses: Synapse[] = [];
    
    for (const synapse of brokenSynapses) {
        const repaired = await repairSynapse(synapse);
        if (repaired) {
            repairedSynapses.push(synapse);
        } else {
            remainingBrokenSynapses.push(synapse);
        }
    }
    
    brokenSynapses = remainingBrokenSynapses;
    
    // 6. Generate report
    const report: DreamReport = {
        timestamp: new Date().toISOString(),
        totalFiles: allFiles.length,
        totalSynapses: allSynapses.length,
        brokenSynapses,
        repairedSynapses,
        orphanedFiles: []
    };
    
    return { report, synapses: allSynapses };
}

/**
 * Generate markdown report content
 */
export function generateReportMarkdown(report: DreamReport): string {
    return `# Dream Protocol Report
**Timestamp**: ${report.timestamp}
**Status**: ${report.brokenSynapses.length === 0 ? 'HEALTHY' : 'ATTENTION REQUIRED'}

## Statistics
- **Total Memory Files**: ${report.totalFiles}
- **Total Synapses**: ${report.totalSynapses}
- **Broken Connections**: ${report.brokenSynapses.length}
- **Repaired Connections**: ${report.repairedSynapses.length}

## Repaired Synapses
${report.repairedSynapses.length === 0 ? '_None._' : report.repairedSynapses.map(s => 
`- **Source**: ${path.basename(s.sourceFile)}:${s.line}
  - **Old Target**: ${s.targetFile}
  - **New Target**: ${s.newTarget} (Auto-repaired)`
).join('\n')}

## Broken Synapses
${report.brokenSynapses.length === 0 ? '_None detected._' : report.brokenSynapses.map(s => 
`- **Source**: ${path.basename(s.sourceFile)}:${s.line}
  - **Target**: ${s.targetFile} (Not found)
  - **Condition**: "${s.condition}"`
).join('\n')}

## Recommendations
${report.brokenSynapses.length > 0 ? '- [ ] Repair remaining broken links manually.' : '- [x] System is optimized.'}
`;
}

/**
 * Save report to file
 */
export async function saveReport(rootPath: string, report: DreamReport): Promise<string> {
    const reportContent = generateReportMarkdown(report);
    const reportPath = path.join(rootPath, '.github', 'episodic', `dream-report-${Date.now()}.md`);
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, reportContent);
    return reportPath;
}
