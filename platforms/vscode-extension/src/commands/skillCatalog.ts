import * as vscode from 'vscode';
import * as path from 'path';
import { getAlexWorkspaceFolder } from '../shared/utils';
import * as workspaceFs from '../shared/workspaceFs';

interface SkillInfo {
    name: string;
    description: string;
    tier: string;
    applyTo: string;
    inheritance: string;
}

// Centralized exclusions — mirrors SKILL_EXCLUSIONS in sync-architecture.cjs
const SKILL_EXCLUSIONS: Record<string, string> = {
    'heir-sync-management': 'master-only',
    'm365-agent-debugging': 'heir:m365',
    'teams-app-patterns': 'heir:m365',
    'azure-devops-automation': 'heir:vscode',
    'chat-participant-patterns': 'heir:vscode',
    'vscode-configuration-validation': 'heir:vscode',
    'vscode-extension-patterns': 'heir:vscode',
    'azure-architecture-patterns': 'heir:vscode',
    'enterprise-integration': 'heir:vscode',
    'persona-detection': 'heir:vscode',
};

/**
 * Generate a skill catalog listing all skills from SKILL.md frontmatter
 */
export async function generateSkillCatalog(): Promise<void> {
    const workspaceResult = await getAlexWorkspaceFolder(true);
    
    if (!workspaceResult.found || !workspaceResult.workspaceFolder) {
        vscode.window.showErrorMessage('No workspace with Alex installed found.');
        return;
    }

    const skillsPath = path.join(workspaceResult.workspaceFolder.uri.fsPath, '.github', 'skills');
    
    if (!await workspaceFs.pathExists(skillsPath)) {
        vscode.window.showErrorMessage('Skills folder not found. Run Alex: Initialize first.');
        return;
    }

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating Skill Catalog',
        cancellable: false
    }, async (progress) => {
        progress.report({ message: 'Scanning skills...' });
        
        // Scan all skills from SKILL.md frontmatter
        const skills = await scanSkills(skillsPath);
        
        progress.report({ message: 'Generating catalog...', increment: 50 });
        
        // Generate catalog markdown
        const catalog = generateCatalogMarkdown(skills);
        
        progress.report({ message: 'Saving catalog...', increment: 40 });
        
        // Save to file
        const catalogPath = path.join(workspaceResult.workspaceFolder!.uri.fsPath, 'SKILL-CATALOG-GENERATED.md');
        await workspaceFs.writeFile(catalogPath, catalog);
        
        progress.report({ increment: 10 });
        
        // Open the catalog
        const doc = await vscode.workspace.openTextDocument(catalogPath);
        await vscode.window.showTextDocument(doc);
        
        // Show preview option
        const choice = await vscode.window.showInformationMessage(
            `🧠 Skill Catalog: ${skills.length} skills`,
            'Show Preview'
        );
        
        if (choice === 'Show Preview') {
            await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(catalogPath));
        }
    });
}

/**
 * Parse YAML frontmatter from SKILL.md content
 */
function parseFrontmatter(content: string): Record<string, string> {
    const result: Record<string, string> = {};
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
        return result;
    }
    
    const lines = fmMatch[1].split(/\r?\n/);
    for (const line of lines) {
        const match = line.match(/^(\w+):\s*["']?(.+?)["']?\s*$/);
        if (match) {
            result[match[1]] = match[2];
        }
    }
    return result;
}

async function scanSkills(skillsPath: string): Promise<SkillInfo[]> {
    const skills: SkillInfo[] = [];
    const entries = await workspaceFs.readDirectory(skillsPath);

    for (const [folder, fileType] of entries) {
        if (fileType !== vscode.FileType.Directory) { continue; }
        
        const skillMdPath = path.join(skillsPath, folder, 'SKILL.md');
        if (!await workspaceFs.pathExists(skillMdPath)) { continue; }

        try {
            const content = await workspaceFs.readFile(skillMdPath);
            const fm = parseFrontmatter(content);
            
            skills.push({
                name: folder,
                description: fm.description || '',
                tier: fm.tier || 'general',
                applyTo: fm.applyTo || '**',
                inheritance: SKILL_EXCLUSIONS[folder] || 'inheritable',
            });
        } catch (err) {
            console.warn('[Alex Catalog] Skipping invalid skill:', folder, err instanceof Error ? err.message : String(err));
        }
    }

    return skills.sort((a, b) => a.name.localeCompare(b.name));
}

function generateCatalogMarkdown(skills: SkillInfo[]): string {
    const byInheritance = {
        inheritable: skills.filter(s => s.inheritance === 'inheritable').length,
        'master-only': skills.filter(s => s.inheritance === 'master-only').length,
        'heir:vscode': skills.filter(s => s.inheritance === 'heir:vscode').length,
        'heir:m365': skills.filter(s => s.inheritance === 'heir:m365').length,
    };

    const byTier: Record<string, SkillInfo[]> = {};
    for (const skill of skills) {
        const tier = skill.tier || 'general';
        if (!byTier[tier]) { byTier[tier] = []; }
        byTier[tier].push(skill);
    }

    let md = `# 🧠 Alex Skills Catalog

> **Generated**: ${new Date().toISOString().split('T')[0]}  
> **Total Skills**: \`${skills.length}\` — ${byInheritance.inheritable} inheritable · ${byInheritance['master-only']} master-only · ${byInheritance['heir:vscode']} VS Code · ${byInheritance['heir:m365']} M365

---

## 📦 Skills by Tier

`;

    const tierOrder = ['foundational', 'core', 'specialized', 'experimental', 'general'];
    const tierEmoji: Record<string, string> = {
        foundational: '🏛️',
        core: '⚙️',
        specialized: '🎯',
        experimental: '🧪',
        general: '📁',
    };

    for (const tier of tierOrder) {
        const tierSkills = byTier[tier];
        if (!tierSkills || tierSkills.length === 0) { continue; }
        
        md += `### ${tierEmoji[tier] || '📁'} ${tier.charAt(0).toUpperCase() + tier.slice(1)} (${tierSkills.length})

| Skill | Description | Inheritance |
| ----- | ----------- | ----------- |
${tierSkills.map(s => `| \`${s.name}\` | ${s.description.substring(0, 60)}${s.description.length > 60 ? '...' : ''} | ${s.inheritance} |`).join('\n')}

`;
    }

    // Handle any tiers not in the order list
    for (const [tier, tierSkills] of Object.entries(byTier)) {
        if (tierOrder.includes(tier)) { continue; }
        
        md += `### 📁 ${tier.charAt(0).toUpperCase() + tier.slice(1)} (${tierSkills.length})

| Skill | Description | Inheritance |
| ----- | ----------- | ----------- |
${tierSkills.map(s => `| \`${s.name}\` | ${s.description.substring(0, 60)}${s.description.length > 60 ? '...' : ''} | ${s.inheritance} |`).join('\n')}

`;
    }

    md += `---

## 📑 Legend

| Inheritance | Meaning |
| ----------- | ------- |
| inheritable | Available to all heir projects |
| master-only | Only in Master Alex workspace |
| heir:vscode | Only in VS Code extension heir |
| heir:m365 | Only in M365 Copilot heir |

---

<div align="center">

**🚀 Alex Cognitive Architecture**  
*Take Your Code to New Heights*

</div>
`;

    return md;
}
