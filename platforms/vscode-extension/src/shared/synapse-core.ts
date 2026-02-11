/**
 * Core synapse scanning and repair logic - platform-agnostic
 * Used by both VS Code dream command and CLI scripts
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { SYNAPSE_REGEX } from './constants';

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
    docCountValidation?: DocCountValidation;
    inheritanceLineage?: InheritanceLineage;
}

/**
 * Inheritance tracking for skills inherited from Global Knowledge
 */
export interface InheritanceLineage {
    inheritedSkills: InheritedSkillInfo[];
    localSkills: number;
    versionDriftWarnings: VersionDriftWarning[];
}

export interface InheritedSkillInfo {
    skillId: string;
    source: 'global-knowledge' | 'gk-pattern';
    registryId?: string;
    version: string;
    inheritedAt: string;
}

export interface VersionDriftWarning {
    skillId: string;
    inheritedVersion: string;
    currentGlobalVersion?: string;
    message: string;
}

/**
 * Documentation count validation results
 */
export interface DocCountValidation {
    isValid: boolean;
    checks: DocCountCheck[];
}

export interface DocCountCheck {
    name: string;
    pattern: string;
    documentedCount: number;
    actualCount: number;
    isValid: boolean;
    drift: number;
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
 * Documented counts for validation
 * These should match what's stated in copilot-instructions.md
 */
export interface DocCountConfig {
    name: string;
    path: string;
    pattern: string;      // Glob pattern for counting
    documentedCount: number;
}

/**
 * Default doc count configuration
 * Updated manually when architecture changes
 */
export const defaultDocCounts: DocCountConfig[] = [
    { name: 'Procedural', path: '.github/instructions/', pattern: '*.instructions.md', documentedCount: 24 },
    { name: 'Episodic', path: '.github/prompts/', pattern: '*.prompt.md', documentedCount: 13 },
    { name: 'Skills', path: '.github/skills/', pattern: '*/SKILL.md', documentedCount: 78 }
];

/**
 * Files to ignore when validating synapse targets
 */
export const ignoredTargetFiles = ['target-file.md', 'CHANGELOG.md'];

/**
 * Regex to match synapse notation:
 * [file.md] (strength, type, direction) - "condition"
 */
/**
 * Re-export the canonical synapse regex from constants.
 * Each usage should create a fresh instance via `new RegExp(synapseRegex.source, synapseRegex.flags)`
 * because the `g` flag makes RegExp stateful.
 */
export const synapseRegex = SYNAPSE_REGEX;

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
 * Validate documented counts against actual file counts
 */
export async function validateDocCounts(
    rootPath: string,
    docCounts: DocCountConfig[] = defaultDocCounts
): Promise<DocCountValidation> {
    const checks: DocCountCheck[] = [];
    
    for (const config of docCounts) {
        const dirPath = path.join(rootPath, config.path);
        let actualCount = 0;
        
        try {
            if (await fs.pathExists(dirPath)) {
                if (config.pattern.startsWith('*/')) {
                    // Skill pattern: count subdirectories with SKILL.md
                    const subPattern = config.pattern.slice(2);
                    const entries = await fs.readdir(dirPath, { withFileTypes: true });
                    for (const entry of entries) {
                        if (entry.isDirectory()) {
                            const skillFile = path.join(dirPath, entry.name, subPattern);
                            if (await fs.pathExists(skillFile)) {
                                actualCount++;
                            }
                        }
                    }
                } else {
                    // Simple file pattern
                    const entries = await fs.readdir(dirPath);
                    const patternRegex = new RegExp(
                        '^' + config.pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
                    );
                    actualCount = entries.filter(e => patternRegex.test(e)).length;
                }
            }
        } catch {
            // Directory doesn't exist or can't be read
            actualCount = 0;
        }
        
        const drift = actualCount - config.documentedCount;
        checks.push({
            name: config.name,
            pattern: config.path + config.pattern,
            documentedCount: config.documentedCount,
            actualCount,
            isValid: drift === 0,
            drift
        });
    }
    
    return {
        isValid: checks.every(c => c.isValid),
        checks
    };
}

/**
 * Scan skills for inheritance lineage from Global Knowledge
 */
export async function scanInheritanceLineage(rootPath: string): Promise<InheritanceLineage> {
    const skillsPath = path.join(rootPath, '.github', 'skills');
    const inheritedSkills: InheritedSkillInfo[] = [];
    let localSkills = 0;
    const versionDriftWarnings: VersionDriftWarning[] = [];
    
    if (!await fs.pathExists(skillsPath)) {
        return { inheritedSkills, localSkills, versionDriftWarnings };
    }
    
    try {
        const entries = await fs.readdir(skillsPath, { withFileTypes: true });
        
        for (const entry of entries) {
            if (!entry.isDirectory()) {continue;}
            
            const synapsesPath = path.join(skillsPath, entry.name, 'synapses.json');
            
            if (await fs.pathExists(synapsesPath)) {
                try {
                    const synapsesContent = await fs.readFile(synapsesPath, 'utf8');
                    const synapses = JSON.parse(synapsesContent);
                    
                    if (synapses.inheritedFrom) {
                        const inherited = synapses.inheritedFrom;
                        inheritedSkills.push({
                            skillId: synapses.skillId || entry.name,
                            source: inherited.source || 'global-knowledge',
                            registryId: inherited.registryId,
                            version: inherited.version || 'unknown',
                            inheritedAt: inherited.inheritedAt || 'unknown'
                        });
                        
                        // Check for version drift (placeholder - would need GK access)
                        // In future: compare inherited.version to current GK version
                    } else {
                        localSkills++;
                    }
                } catch {
                    // Invalid JSON or missing file
                    localSkills++;
                }
            } else {
                localSkills++;
            }
        }
    } catch {
        // Skills directory not readable
    }
    
    return { inheritedSkills, localSkills, versionDriftWarnings };
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
    
    // 6. Validate documentation counts
    progress('Validating documentation counts...');
    const docCountValidation = await validateDocCounts(rootPath);
    
    // 7. Scan for inherited skills
    progress('Checking inheritance lineage...');
    const inheritanceLineage = await scanInheritanceLineage(rootPath);
    
    // 8. Generate report
    const report: DreamReport = {
        timestamp: new Date().toISOString(),
        totalFiles: allFiles.length,
        totalSynapses: allSynapses.length,
        brokenSynapses,
        repairedSynapses,
        orphanedFiles: [],
        docCountValidation,
        inheritanceLineage
    };
    
    return { report, synapses: allSynapses };
}

/**
 * Generate doc count validation section for report
 */
function generateDocCountSection(validation: DocCountValidation): string {
    if (validation.isValid) {
        return `
## 📋 Documentation Count Validation

> ✅ All documented counts match actual file counts.

| Store | Documented | Actual | Status |
|-------|------------|--------|--------|
${validation.checks.map(c => 
`| ${c.name} | ${c.documentedCount} | ${c.actualCount} | ✅ |`
).join('\n')}

---

`;
    }
    
    return `
## 📋 Documentation Count Validation

> ⚠️ **Drift detected**: Documented counts don't match actual files.

| Store | Documented | Actual | Drift | Status |
|-------|------------|--------|-------|--------|
${validation.checks.map(c => {
    const drift = c.drift > 0 ? `+${c.drift}` : `${c.drift}`;
    const status = c.isValid ? '✅' : '⚠️';
    return `| ${c.name} | ${c.documentedCount} | ${c.actualCount} | ${drift} | ${status} |`;
}).join('\n')}

**Action Required**: Update \`copilot-instructions.md\` to match actual counts.

---

`;
}

/**
 * Generate inheritance lineage section for report
 */
function generateInheritanceSection(lineage: InheritanceLineage): string {
    const total = lineage.inheritedSkills.length + lineage.localSkills;
    
    if (lineage.inheritedSkills.length === 0 && lineage.versionDriftWarnings.length === 0) {
        return `
## 🧬 Skill Inheritance Lineage

> All ${total} skills were developed locally (no Global Knowledge inheritance).

---

`;
    }
    
    let section = `
## 🧬 Skill Inheritance Lineage

| Source | Count |
|--------|-------|
| 🌐 Inherited from Global Knowledge | ${lineage.inheritedSkills.length} |
| 📝 Developed Locally | ${lineage.localSkills} |
| **Total** | **${total}** |

`;

    if (lineage.inheritedSkills.length > 0) {
        section += `
### Inherited Skills

| Skill | Source | Version | Inherited |
|-------|--------|---------|-----------|
${lineage.inheritedSkills.map(s => {
    const date = s.inheritedAt !== 'unknown' 
        ? new Date(s.inheritedAt).toLocaleDateString() 
        : 'unknown';
    return `| ${s.skillId} | ${s.source} | v${s.version} | ${date} |`;
}).join('\n')}

`;
    }
    
    if (lineage.versionDriftWarnings.length > 0) {
        section += `
### ⚠️ Version Drift Warnings

> Some inherited skills may have newer versions in Global Knowledge.

| Skill | Inherited | Global | Action |
|-------|-----------|--------|--------|
${lineage.versionDriftWarnings.map(w => 
    `| ${w.skillId} | v${w.inheritedVersion} | v${w.currentGlobalVersion || '?'} | Consider re-inheriting |`
).join('\n')}

`;
    }
    
    section += `---

`;
    
    return section;
}

/**
 * Generate markdown report content with Alex branding
 */
export function generateReportMarkdown(report: DreamReport): string {
    const isHealthy = report.brokenSynapses.length === 0 && 
        (report.docCountValidation?.isValid ?? true);
    const healthPercent = report.totalSynapses > 0 
        ? Math.round(((report.totalSynapses - report.brokenSynapses.length) / report.totalSynapses) * 100)
        : 100;
    
    const statusEmoji = isHealthy ? '✅' : '⚠️';
    const statusText = isHealthy ? 'HEALTHY' : 'ATTENTION REQUIRED';
    
    // Generate doc count validation section
    const docCountSection = report.docCountValidation ? generateDocCountSection(report.docCountValidation) : '';
    
    // Generate inheritance lineage section
    const inheritanceSection = report.inheritanceLineage ? generateInheritanceSection(report.inheritanceLineage) : '';
    
    return `# 🧠 Alex Dream Protocol Report

> **Timestamp**: ${report.timestamp}  
> **Status**: ${statusEmoji} ${statusText}  
> **Health Score**: ${healthPercent}%

---

## 📊 Architecture Statistics

| Metric | Value |
|--------|-------|
| 📁 Memory Files | ${report.totalFiles} |
| 🔗 Total Synapses | ${report.totalSynapses} |
| ✅ Healthy Connections | ${report.totalSynapses - report.brokenSynapses.length} |
| ❌ Broken Connections | ${report.brokenSynapses.length} |
| 🔧 Auto-Repaired | ${report.repairedSynapses.length} |

---
${docCountSection}${inheritanceSection}## 🔧 Repaired Synapses

${report.repairedSynapses.length === 0 ? '> _No repairs needed. All synapses were healthy._' : 
`| Source | Old Target | New Target |
|--------|------------|------------|
${report.repairedSynapses.map(s => 
`| \`${path.basename(s.sourceFile)}:${s.line}\` | ~~${s.targetFile}~~ | ✅ ${s.newTarget} |`
).join('\n')}`}

---

## ❌ Broken Synapses

${report.brokenSynapses.length === 0 ? '> _None detected. Architecture is healthy!_' : 
`> **Action Required**: These connections need manual repair.

| Source | Target | Condition |
|--------|--------|-----------|
${report.brokenSynapses.map(s => 
`| \`${path.basename(s.sourceFile)}:${s.line}\` | ❌ ${s.targetFile} | "${s.condition}" |`
).join('\n')}`}

---

## 📋 Recommendations

${report.brokenSynapses.length > 0 ? `- [ ] Review and repair ${report.brokenSynapses.length} broken synapse${report.brokenSynapses.length > 1 ? 's' : ''}
- [ ] Check if target files were renamed or moved
- [ ] Consider running \`Alex: Self-Actualize\` for deeper analysis` : `- [x] Architecture is optimized
- [x] All synapses are connected
- Consider meditation to consolidate learnings`}

---

<div align="center">

**🚀 Alex Cognitive Architecture**  
*Take Your Code to New Heights*

</div>
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
