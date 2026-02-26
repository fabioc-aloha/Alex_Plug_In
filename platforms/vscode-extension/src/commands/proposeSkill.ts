import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { getAlexWorkspaceFolder } from '../shared/utils';

interface SkillMetadata {
    name?: string;
    applyTo?: string;
    description?: string;
}

interface GKYamlFrontmatter {
    gkId: string;
    gkCategory: string;
    gkTags: string[];
    gkSource: string;
    gkCreated: string;
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    score: number;
}

interface HeirSkill {
    folder: string;
    name: string;
    metadata: SkillMetadata;
    category: string;
    validationScore: number;
    inheritedFromGK: boolean;
    content: string;
}

const GLOBAL_KNOWLEDGE_PATH = path.join(os.homedir(), '.alex', 'global-knowledge');
const VALID_CATEGORIES = [
    'architecture', 'api-design', 'debugging', 'deployment', 'documentation',
    'error-handling', 'patterns', 'performance', 'refactoring', 'security',
    'testing', 'tooling', 'general'
];

/**
 * Command: Alex: Propose Skill to Global Knowledge
 * Lightweight workflow for heirs to contribute skills back to Global Knowledge
 */
export async function proposeSkillToGlobal(): Promise<void> {
    const outputChannel = vscode.window.createOutputChannel('Alex Skill Proposal');
    
    try {
        // Get workspace
        const workspaceResult = await getAlexWorkspaceFolder(true);
        
        if (!workspaceResult.found || !workspaceResult.workspaceFolder) {
            vscode.window.showErrorMessage('No workspace with Alex installed found.');
            return;
        }

        const workspacePath = workspaceResult.workspaceFolder.uri.fsPath;
        const projectSkillsPath = path.join(workspacePath, '.github', 'skills');

        // Check for Master Alex protection
        const masterProtectedPath = path.join(workspacePath, '.github', 'config', 'MASTER-ALEX-PROTECTED.json');
        if (await fs.pathExists(masterProtectedPath)) {
            vscode.window.showWarningMessage(
                '⚠️ This is Master Alex. Skill proposal is designed for heir projects. Use standard promotion workflow instead.'
            );
            return;
        }

        // Check Global Knowledge exists
        if (!await fs.pathExists(GLOBAL_KNOWLEDGE_PATH)) {
            const setup = await vscode.window.showErrorMessage(
                'Global Knowledge not found. Set it up first?',
                'Setup Now', 'Cancel'
            );
            if (setup === 'Setup Now') {
                await vscode.commands.executeCommand('alex.setupGlobalKnowledge');
            }
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Preparing Skill Proposal',
            cancellable: true
        }, async (progress, token) => {
            
            progress.report({ message: 'Scanning project skills...' });
            
            // Get heir skills
            const heirSkills = await getHeirSkills(projectSkillsPath);
            outputChannel.appendLine(`📁 Found ${heirSkills.length} skills in project`);
            
            if (heirSkills.length === 0) {
                vscode.window.showInformationMessage('No skills found in this project to propose.');
                return;
            }
            
            if (token.isCancellationRequested) { return; }
            
            progress.report({ message: 'Filtering proposable skills...', increment: 20 });
            
            // Filter out skills inherited from GK
            const proposableSkills = heirSkills.filter(skill => !skill.inheritedFromGK);
            
            if (proposableSkills.length === 0) {
                vscode.window.showInformationMessage(
                    'All skills in this project were inherited from Global Knowledge. Only heir-created skills can be proposed.'
                );
                return;
            }
            
            outputChannel.appendLine(`✅ ${proposableSkills.length} skills available for proposal`);
            
            progress.report({ message: 'Preparing selection...', increment: 20 });
            
            // Create QuickPick items with type-safe data association
            const skillMap = new Map<string, HeirSkill>();
            const items: vscode.QuickPickItem[] = proposableSkills.map(skill => {
                const label = `$(package) ${skill.name}`;
                skillMap.set(label, skill);
                return {
                    label,
                    description: skill.metadata?.description || skill.folder,
                    detail: `Category: ${skill.category || 'uncategorized'} · Score: ${skill.validationScore}/12`,
                    picked: false
                };
            });

            // Show single-select QuickPick
            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: `Select skill to propose (${proposableSkills.length} available)`,
                title: 'Propose Skill to Global Knowledge',
                matchOnDescription: true,
                matchOnDetail: true
            });

            if (!selected) {
                return;
            }

            const skill = skillMap.get(selected.label);
            if (!skill) {
                return;
            }
            
            progress.report({ message: `Validating ${skill.name}...`, increment: 20 });

            // Validate skill
            const validation = await validateSkill(skill, outputChannel);
            
            if (!validation.valid) {
                const proceed = await vscode.window.showWarningMessage(
                    `Skill "${skill.name}" has validation issues:\n\n${validation.errors.join('\n')}\n\nProceed anyway?`,
                    'Fix Issues', 'Proceed', 'Cancel'
                );
                if (proceed !== 'Proceed') {
                    if (proceed === 'Fix Issues') {
                        const skillPath = path.join(projectSkillsPath, skill.folder, 'SKILL.md');
                        vscode.window.showTextDocument(vscode.Uri.file(skillPath));
                    }
                    return;
                }
            }
            
            progress.report({ message: 'Collecting metadata...', increment: 20 });

            // Get proposal metadata from user
            const metadata = await collectProposalMetadata(skill, workspacePath);
            if (!metadata) {
                return; // User cancelled
            }

            progress.report({ message: 'Preparing skill package...', increment: 20 });

            // Package skill with GK metadata
            const packagePath = await packageSkillForProposal(
                skill,
                projectSkillsPath,
                metadata,
                outputChannel
            );

            progress.report({ message: 'Generating PR description...', increment: 10 });

            // Generate GitHub PR workflow
            const prDescription = generatePRDescription(skill, metadata, validation);
            
            // Copy PR description to clipboard
            await vscode.env.clipboard.writeText(prDescription);

            // Show success with next steps
            const action = await vscode.window.showInformationMessage(
                `✅ Skill "${skill.name}" packaged for proposal!\n\n` +
                `📦 Location: ${packagePath}\n` +
                `📋 PR description copied to clipboard\n\n` +
                `Next steps:\n` +
                `1. Copy skill folder to Global Knowledge patterns/\n` +
                `2. Create PR on GitHub\n` +
                `3. Paste PR description from clipboard`,
                'Open Package', 'Show Output', 'Open GK Repo'
            );

            if (action === 'Open Package') {
                vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(packagePath));
            } else if (action === 'Show Output') {
                outputChannel.show();
            } else if (action === 'Open GK Repo') {
                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(GLOBAL_KNOWLEDGE_PATH), true);
            }

            outputChannel.show();
        });

    } catch (error) {
        outputChannel.appendLine(`❌ Error: ${error}`);
        outputChannel.show();
        vscode.window.showErrorMessage(`Skill proposal failed: ${error}`);
    }
}

/**
 * Get heir skills (excluding inherited ones)
 */
async function getHeirSkills(skillsPath: string): Promise<HeirSkill[]> {
    const skills: HeirSkill[] = [];
    
    if (!await fs.pathExists(skillsPath)) {
        return skills;
    }

    const entries = await fs.readdir(skillsPath, { withFileTypes: true });
    
    for (const entry of entries) {
        if (!entry.isDirectory()) { continue; }
        
        const skillFolder = entry.name;
        const skillPath = path.join(skillsPath, skillFolder);
        const skillFile = path.join(skillPath, 'SKILL.md');
        
        if (!await fs.pathExists(skillFile)) { continue; }
        
        // Check if inherited from GK
        const synapsesPath = path.join(skillPath, 'synapses.json');
        let inheritedFromGK = false;
        
        if (await fs.pathExists(synapsesPath)) {
            const synapses = await fs.readJson(synapsesPath);
            inheritedFromGK = synapses.inheritedFrom?.source === 'global-knowledge';
        }
        
        // Parse skill metadata
        const content = await fs.readFile(skillFile, 'utf-8');
        const metadata = parseSkillMetadata(content);
        const category = detectCategory(content, metadata);
        const validationScore = calculateValidationScore(content, metadata);
        
        skills.push({
            folder: skillFolder,
            name: metadata.name || skillFolder,
            metadata,
            category,
            validationScore,
            inheritedFromGK,
            content
        });
    }
    
    return skills;
}

/**
 * Parse YAML frontmatter from skill
 */
function parseSkillMetadata(content: string): SkillMetadata {
    const metadata: SkillMetadata = {};
    
    // Match YAML frontmatter
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (yamlMatch) {
        const yaml = yamlMatch[1];
        
        // Parse simple YAML fields
        const nameMatch = yaml.match(/name:\s*["']?([^"'\n]+)["']?/);
        if (nameMatch) { metadata.name = nameMatch[1].trim(); }
        
        const applyToMatch = yaml.match(/applyTo:\s*["']?([^"'\n]+)["']?/);
        if (applyToMatch) { metadata.applyTo = applyToMatch[1].trim(); }
        
        const descMatch = yaml.match(/description:\s*["']?([^"'\n]+)["']?/);
        if (descMatch) { metadata.description = descMatch[1].trim(); }
    }
    
    // Fallback: extract title from first heading
    if (!metadata.name) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.name = titleMatch[1].replace(/\s+Skill$/i, '').trim();
        }
    }
    
    return metadata;
}

/**
 * Detect skill category from content
 */
function detectCategory(content: string, metadata: SkillMetadata): string {
    const contentLower = content.toLowerCase();
    
    // Check for category keywords
    if (contentLower.includes('test') || contentLower.includes('testing')) { return 'testing'; }
    if (contentLower.includes('deploy') || contentLower.includes('deployment')) { return 'deployment'; }
    if (contentLower.includes('security') || contentLower.includes('authentication')) { return 'security'; }
    if (contentLower.includes('performance') || contentLower.includes('optimization')) { return 'performance'; }
    if (contentLower.includes('debug') || contentLower.includes('troubleshoot')) { return 'debugging'; }
    if (contentLower.includes('document') || contentLower.includes('documentation')) { return 'documentation'; }
    if (contentLower.includes('refactor') || contentLower.includes('code quality')) { return 'refactoring'; }
    if (contentLower.includes('api') || contentLower.includes('rest')) { return 'api-design'; }
    if (contentLower.includes('architecture') || contentLower.includes('design pattern')) { return 'architecture'; }
    if (contentLower.includes('error') || contentLower.includes('exception')) { return 'error-handling'; }
    
    return 'general';
}

/**
 * Calculate promotion readiness score
 */
function calculateValidationScore(content: string, metadata: SkillMetadata): number {
    let score = 0;
    
    // Has applyTo frontmatter
    if (metadata.applyTo) { score += 2; }
    
    // Has Synapses section
    if (content.includes('## Synapses') || content.includes('**Synapse**:')) { score += 3; }
    
    // Has Troubleshooting section
    if (content.includes('## Troubleshooting') || content.includes('## Common Issues')) { score += 2; }
    
    // Has code examples
    if (content.includes('```')) { score += 2; }
    
    // Content length
    const lines = content.split('\n').length;
    if (lines > 200) { score += 2; }
    else if (lines > 100) { score += 1; }
    
    // Uses generic terms (not project-specific)
    const hasGenericTerms = !content.match(/\b(my-app|our-project|this-company)\b/i);
    if (hasGenericTerms) { score += 2; }
    
    // Has Activation Patterns
    if (content.includes('## Activation') || content.includes('## When to Use')) { score += 1; }
    
    return score;
}

/**
 * Validate skill for proposal
 */
async function validateSkill(skill: HeirSkill, outputChannel: vscode.OutputChannel): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check name
    if (!skill.name || skill.name.length < 3) {
        errors.push('Skill name too short (minimum 3 characters)');
    }
    
    // Check content length
    const lines = skill.content.split('\n').length;
    if (lines < 50) {
        warnings.push(`Content is short (${lines} lines). Consider adding more details.`);
    }
    
    // Check for project-specific terms
    const projectSpecific = skill.content.match(/\b(TODO|FIXME|my-app|our-project|this-company)\b/gi);
    if (projectSpecific && projectSpecific.length > 2) {
        warnings.push(`Found ${projectSpecific.length} project-specific terms. Consider generalizing.`);
    }
    
    // Check promotion readiness score
    if (skill.validationScore < 8) {
        warnings.push(`Promotion score is ${skill.validationScore}/12. Recommended minimum: 8. Consider adding missing sections.`);
    }
    
    // Check for synapses
    if (!skill.content.includes('Synapse')) {
        warnings.push('No synapses found. Consider adding connections to related skills.');
    }
    
    // Check for code examples
    if (!skill.content.includes('```')) {
        warnings.push('No code examples found. Consider adding practical examples.');
    }
    
    outputChannel.appendLine(`\n📊 Validation Results for "${skill.name}":`);
    outputChannel.appendLine(`  Score: ${skill.validationScore}/12`);
    if (errors.length > 0) {
        outputChannel.appendLine(`  ❌ Errors: ${errors.length}`);
        errors.forEach(e => outputChannel.appendLine(`     - ${e}`));
    }
    if (warnings.length > 0) {
        outputChannel.appendLine(`  ⚠️  Warnings: ${warnings.length}`);
        warnings.forEach(w => outputChannel.appendLine(`     - ${w}`));
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        score: skill.validationScore
    };
}

/**
 * Collect proposal metadata from user
 */
async function collectProposalMetadata(skill: HeirSkill, workspacePath: string): Promise<GKYamlFrontmatter | null> {
    // Detect project name from workspace
    const projectName = path.basename(workspacePath);
    
    // Ask for category
    const categoryItems = VALID_CATEGORIES.map(cat => ({
        label: cat,
        description: cat === skill.category ? '(detected)' : ''
    }));
    
    const selectedCategory = await vscode.window.showQuickPick(categoryItems, {
        placeHolder: `Select category for "${skill.name}"`,
        title: 'Skill Category'
    });
    
    if (!selectedCategory) { return null; }
    
    // Ask for tags
    const suggestedTags = detectTags(skill.content, skill.metadata);
    const tagsInput = await vscode.window.showInputBox({
        prompt: 'Enter tags (comma-separated)',
        placeHolder: 'e.g., testing, automation, ci-cd',
        value: suggestedTags.join(', '),
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'At least one tag is required';
            }
            return null;
        }
    });
    
    if (!tagsInput) { return null; }
    
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    // Generate GK ID
    const gkId = `GK-${skill.folder}`;
    
    return {
        gkId,
        gkCategory: selectedCategory.label,
        gkTags: tags,
        gkSource: projectName,
        gkCreated: new Date().toISOString()
    };
}

/**
 * Detect tags from content
 */
function detectTags(content: string, metadata: SkillMetadata): string[] {
    const tags: Set<string> = new Set();
    const contentLower = content.toLowerCase();
    
    // Technology-specific tags
    if (contentLower.includes('typescript')) { tags.add('typescript'); }
    if (contentLower.includes('javascript')) { tags.add('javascript'); }
    if (contentLower.includes('python')) { tags.add('python'); }
    if (contentLower.includes('react')) { tags.add('react'); }
    if (contentLower.includes('node')) { tags.add('nodejs'); }
    if (contentLower.includes('docker')) { tags.add('docker'); }
    if (contentLower.includes('kubernetes')) { tags.add('kubernetes'); }
    if (contentLower.includes('azure')) { tags.add('azure'); }
    if (contentLower.includes('github')) { tags.add('github'); }
    if (contentLower.includes('ci/cd')) { tags.add('ci-cd'); }
    
    // Domain tags
    if (contentLower.includes('testing')) { tags.add('testing'); }
    if (contentLower.includes('deployment')) { tags.add('deployment'); }
    if (contentLower.includes('security')) { tags.add('security'); }
    if (contentLower.includes('automation')) { tags.add('automation'); }
    if (contentLower.includes('performance')) { tags.add('performance'); }
    
    return Array.from(tags).slice(0, 6); // Max 6 tags
}

/**
 * Package skill for proposal with GK metadata
 */
async function packageSkillForProposal(
    skill: HeirSkill,
    projectSkillsPath: string,
    metadata: GKYamlFrontmatter,
    outputChannel: vscode.OutputChannel
): Promise<string> {
    const sourcePath = path.join(projectSkillsPath, skill.folder);
    const tempDir = path.join(os.tmpdir(), 'alex-skill-proposal', skill.folder);
    
    // Clean temp dir if exists
    if (await fs.pathExists(tempDir)) {
        await fs.remove(tempDir);
    }
    
    // Copy skill folder to temp
    await fs.copy(sourcePath, tempDir);
    outputChannel.appendLine(`📦 Copied skill to: ${tempDir}`);
    
    // Inject YAML v2 frontmatter into SKILL.md
    const skillMdPath = path.join(tempDir, 'SKILL.md');
    let content = await fs.readFile(skillMdPath, 'utf-8');
    
    // Remove existing YAML frontmatter if present
    content = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Inject new YAML v2 frontmatter with GK metadata
    const yamlFrontmatter = `---
# GK Metadata
gkId: ${metadata.gkId}
gkCategory: ${metadata.gkCategory}
gkTags: [${metadata.gkTags.join(', ')}]
gkSource: ${metadata.gkSource}
gkCreated: ${metadata.gkCreated}

# Skill Metadata (passed through on extraction)
${skill.metadata.name ? `name: "${skill.metadata.name}"` : ''}
${skill.metadata.applyTo ? `applyTo: "${skill.metadata.applyTo}"` : ''}
---

`;
    
    content = yamlFrontmatter + content;
    
    await fs.writeFile(skillMdPath, content, 'utf-8');
    outputChannel.appendLine(`✅ Injected YAML v2 frontmatter with GK metadata`);
    
    return tempDir;
}

/**
 * Generate GitHub PR description
 */
function generatePRDescription(skill: HeirSkill, metadata: GKYamlFrontmatter, validation: ValidationResult): string {
    return `## Propose Skill: ${skill.name}

**Category**: ${metadata.gkCategory}  
**Tags**: ${metadata.gkTags.join(', ')}  
**Source Project**: ${metadata.gkSource}  
**Promotion Score**: ${validation.score}/12

### Summary
${skill.metadata.description || `Skill from ${metadata.gkSource} project`}

### Validation
${validation.errors.length === 0 ? '✅ No errors' : `❌ Errors:\n${validation.errors.map(e => `- ${e}`).join('\n')}`}
${validation.warnings.length === 0 ? '✅ No warnings' : `⚠️ Warnings:\n${validation.warnings.map(w => `- ${w}`).join('\n')}`}

### Completeness Checklist
- ${metadata.gkId ? '[x]' : '[ ]'} GK ID assigned
- ${skill.metadata.applyTo ? '[x]' : '[ ]'} applyTo pattern
- ${skill.content.includes('Synapse') ? '[x]' : '[ ]'} Synapses section
- ${skill.content.includes('```') ? '[x]' : '[ ]'} Code examples
- ${skill.content.includes('Troubleshooting') || skill.content.includes('Common Issues') ? '[x]' : '[ ]'} Troubleshooting section

### Files
- \`patterns/${metadata.gkId}.md\` - Main skill file with YAML v2 frontmatter

### Review Checklist
- [ ] Content is generalizable (not project-specific)
- [ ] Synapses are accurate and bidirectional
- [ ] Examples are clear and complete
- [ ] YAML metadata is correct
- [ ] No sensitive information or PII
- [ ] Follows GK pattern format standard

---
*Proposed via Alex v5.7.7 Propose-to-Global workflow*
`;
}
