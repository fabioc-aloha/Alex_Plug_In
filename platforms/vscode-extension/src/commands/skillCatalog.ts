import * as vscode from 'vscode';
import * as path from 'path';
import { getAlexWorkspaceFolder } from '../shared/utils';
import * as workspaceFs from '../shared/workspaceFs';

interface Connection {
    target: string;
    type: string;
    strength: number;
    bidirectional?: boolean;
    weak?: boolean;
}

interface SkillInfo {
    name: string;
    inheritance: string;
    temporary: boolean;
    removeAfter?: string;
    connectionCount: number;
    connections: Connection[];
}

interface SynapsesJson {
    skillId?: string;
    skill?: string;
    inheritance?: string;
    temporary?: boolean;
    removeAfter?: string;
    connections?: Record<string, { weight?: number; relationship?: string; bidirectional?: boolean; weak?: boolean }> | Connection[];
}

// Category definitions
const CATEGORIES: Record<string, { emoji: string; skills: string[] }> = {
    'cognitive': { emoji: '🧠', skills: ['cognitive-load', 'learning-psychology', 'appropriate-reliance', 'bootstrap-learning', 'meditation', 'meditation-facilitation', 'knowledge-synthesis', 'global-knowledge'] },
    'engineering': { emoji: '🔧', skills: ['testing-strategies', 'refactoring-patterns', 'debugging-patterns', 'code-review', 'git-workflow', 'project-scaffolding', 'vscode-environment'] },
    'operations': { emoji: '🚨', skills: ['error-recovery-patterns', 'root-cause-analysis', 'incident-response', 'release-preflight'] },
    'security': { emoji: '🔐', skills: ['privacy-responsible-ai', 'microsoft-sfi'] },
    'documentation': { emoji: '📝', skills: ['writing-publication', 'markdown-mermaid', 'lint-clean-markdown', 'ascii-art-alignment', 'llm-model-selection'] },
    'visual': { emoji: '🎨', skills: ['svg-graphics', 'image-handling'] },
    'architecture': { emoji: '🏗️', skills: ['architecture-refinement', 'architecture-health', 'self-actualization', 'heir-curation', 'skill-catalog-generator'] },
    'vscode': { emoji: '💻', skills: ['vscode-extension-patterns', 'chat-participant-patterns'] },
    'm365': { emoji: '☁️', skills: ['m365-agent-debugging', 'teams-app-patterns'] },
    'temporary': { emoji: '🧪', skills: [] }, // Dynamically populated
};

// Staleness-prone skills
const STALE_PRONE = ['vscode-extension-patterns', 'chat-participant-patterns', 'm365-agent-debugging', 'teams-app-patterns', 'llm-model-selection', 'git-workflow', 'privacy-responsible-ai', 'microsoft-sfi'];

/**
 * Generate a skill catalog with network diagram
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
        
        // Scan all skills
        const skills = await scanSkills(skillsPath);
        
        progress.report({ message: 'Generating diagram...', increment: 50 });
        
        // Generate catalog markdown
        const catalog = generateCatalogMarkdown(skills);
        
        progress.report({ message: 'Saving catalog...', increment: 40 });
        
        // Save to file (v5.9.10: using workspace.fs per ADR-008)
        const catalogPath = path.join(workspaceResult.workspaceFolder!.uri.fsPath, 'SKILL-CATALOG-GENERATED.md');
        await workspaceFs.writeFile(catalogPath, catalog);
        
        progress.report({ increment: 10 });
        
        // Open the catalog
        const doc = await vscode.workspace.openTextDocument(catalogPath);
        await vscode.window.showTextDocument(doc);
        
        // Show preview option
        const choice = await vscode.window.showInformationMessage(
            `🧠 Skill Catalog: ${skills.length} skills · ${countConnections(skills)} connections`,
            'Show Preview'
        );
        
        if (choice === 'Show Preview') {
            await vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(catalogPath));
        }
    });
}

async function scanSkills(skillsPath: string): Promise<SkillInfo[]> {
    const skills: SkillInfo[] = [];
    const entries = await workspaceFs.readDirectory(skillsPath);

    for (const [folder, fileType] of entries) {
        if (fileType !== vscode.FileType.Directory) { continue; }
        const skillPath = path.join(skillsPath, folder);
        
        const synapsesPath = path.join(skillPath, 'synapses.json');
        
        if (!await workspaceFs.pathExists(synapsesPath)) {continue;}

        try {
            const synapses: SynapsesJson = await workspaceFs.readJson(synapsesPath);
            const connections = normalizeConnections(synapses.connections);
            
            skills.push({
                name: folder,
                inheritance: synapses.inheritance || 'inheritable',
                temporary: synapses.temporary || false,
                removeAfter: synapses.removeAfter,
                connectionCount: connections.length,
                connections
            });
        } catch {
            // Skip invalid synapses files
        }
    }

    return skills;
}

function normalizeConnections(connections: SynapsesJson['connections']): Connection[] {
    if (!connections) {return [];}
    
    if (Array.isArray(connections)) {
        return connections.map(c => ({
            target: c.target,
            type: c.type || 'enables',
            strength: c.strength || 0.5,
            bidirectional: c.bidirectional || false,
            weak: c.weak || false
        }));
    }
    
    // Object format: { "target-name": { weight, relationship } }
    return Object.entries(connections).map(([target, data]) => ({
        target,
        type: data.relationship || 'enables',
        strength: data.weight || 0.5,
        bidirectional: data.bidirectional || false,
        weak: data.weak || false
    }));
}

function countConnections(skills: SkillInfo[]): number {
    return skills.reduce((sum, s) => sum + s.connectionCount, 0);
}

function toAbbreviation(name: string): string {
    // Convert skill-name to abbreviation (e.g., "skill-catalog-generator" -> "SCG")
    return name.split('-').map(w => w[0]?.toUpperCase() || '').join('');
}

function getCategory(skillName: string, isTemp: boolean): string {
    if (isTemp) {return 'temporary';}
    for (const [cat, config] of Object.entries(CATEGORIES)) {
        if (config.skills.includes(skillName)) {return cat;}
    }
    return 'other';
}

function generateCatalogMarkdown(skills: SkillInfo[]): string {
    const totalConnections = countConnections(skills);
    const bidirectionalCount = skills.reduce((sum, s) => 
        sum + s.connections.filter(c => c.bidirectional).length, 0);
    const weakCount = skills.reduce((sum, s) => 
        sum + s.connections.filter(c => c.weak || c.strength < 0.7).length, 0);
    
    const byInheritance = {
        inheritable: skills.filter(s => s.inheritance === 'inheritable' && !s.temporary).length,
        'master-only': skills.filter(s => s.inheritance === 'master-only').length,
        'heir:vscode': skills.filter(s => s.inheritance === 'heir:vscode').length,
        'heir:m365': skills.filter(s => s.inheritance === 'heir:m365').length,
        temporary: skills.filter(s => s.temporary).length
    };

    let md = `# 🧠 Alex Skills Catalog

> **Generated**: ${new Date().toISOString().split('T')[0]}  
> **Total Skills**: \`${skills.length}\` — ${byInheritance.inheritable} inheritable · ${byInheritance['master-only']} master-only · ${byInheritance['heir:vscode']} VS Code · ${byInheritance['heir:m365']} M365 · ${byInheritance.temporary} temporary  
> **Total Connections**: \`${totalConnections}\` — ${bidirectionalCount} bidirectional · ${weakCount} weak

---

## 🕸️ Network Diagram

${generateMermaidDiagram(skills)}

---

## 📑 Legend

| Color | Inheritance |
| ----- | ----------- |
| 🟨 Yellow | Master-only |
| 🟦 Blue | VS Code heir |
| 🟩 Green | M365 heir |
| 🟪 Purple (dashed) | Temporary |
| 🧊 Cyan | Inheritable |

| Arrow | Meaning |
| ----- | ------- |
| \`<-->\` | Bidirectional (mutual) |
| \`-->\` | Strong connection (≥0.7) |
| \`-.->\` | Weak connection (<0.7) |

---

## 📦 Skills by Inheritance

### 🧊 Inheritable (${byInheritance.inheritable})

| Skill | Connections |
| ----- | ----------- |
${skills.filter(s => s.inheritance === 'inheritable' && !s.temporary).map(s => `| \`${s.name}\` | ${s.connectionCount} |`).join('\n')}

### 🟨 Master-Only (${byInheritance['master-only']})

| Skill | Connections |
| ----- | ----------- |
${skills.filter(s => s.inheritance === 'master-only').map(s => `| \`${s.name}\` | ${s.connectionCount} |`).join('\n')}

### 🟦 VS Code Heir (${byInheritance['heir:vscode']})

| Skill | Connections |
| ----- | ----------- |
${skills.filter(s => s.inheritance === 'heir:vscode').map(s => `| \`${s.name}\` | ${s.connectionCount} |`).join('\n')}

### 🟩 M365 Heir (${byInheritance['heir:m365']})

| Skill | Connections |
| ----- | ----------- |
${skills.filter(s => s.inheritance === 'heir:m365').map(s => `| \`${s.name}\` | ${s.connectionCount} |`).join('\n')}

### 🟪 Temporary (${byInheritance.temporary})

| Skill | Connections | Remove After |
| ----- | ----------- | ------------ |
${skills.filter(s => s.temporary).map(s => `| \`${s.name}\` | ${s.connectionCount} | ${s.removeAfter || 'TBD'} |`).join('\n')}

---

## ⚠️ Staleness-Prone Skills

> These skills depend on external APIs or platforms that change frequently.

| Skill | Reason |
| ----- | ------ |
${STALE_PRONE.map(s => `| \`${s}\` | Platform/API changes frequently |`).join('\n')}

---

<div align="center">

**🚀 Alex Cognitive Architecture**  
*Take Your Code to New Heights*

</div>
`;

    return md;
}

function generateMermaidDiagram(skills: SkillInfo[]): string {
    const lines: string[] = [
        '```mermaid',
        "%%{init: {'theme': 'base', 'themeVariables': { 'edgeLabelBackground': '#ffffff', 'lineColor': '#656d76', 'primaryTextColor': '#1f2328', 'primaryColor': '#f6f8fa', 'primaryBorderColor': '#d1d9e0'}}}%%",
        'flowchart LR'
    ];

    // Group skills by category
    const categoryGroups: Record<string, SkillInfo[]> = {};
    for (const skill of skills) {
        const cat = getCategory(skill.name, skill.temporary);
        if (!categoryGroups[cat]) {categoryGroups[cat] = [];}
        categoryGroups[cat].push(skill);
    }

    // Generate subgraphs with TB direction for vertical stacking
    const categoryNames: string[] = [];
    for (const [category, catSkills] of Object.entries(categoryGroups)) {
        if (catSkills.length === 0) {continue;}
        const config = CATEGORIES[category] || { emoji: '📦' };
        const title = category.charAt(0).toUpperCase() + category.slice(1);
        categoryNames.push(title);
        
        lines.push(`    subgraph ${title}["${config.emoji} ${title}"]`);
        lines.push(`        direction TB`);
        for (const skill of catSkills) {
            const abbrev = toAbbreviation(skill.name);
            lines.push(`        ${abbrev}[${skill.name}]`);
        }
        lines.push('    end');
    }

    // Add invisible links between subgraphs to force LR layout
    if (categoryNames.length > 1) {
        lines.push('');
        lines.push('    %% Invisible links for LR layout');
        lines.push(`    ${categoryNames.join(' ~~~ ')}`);
    }

    // Group connections by source+arrow for multi-target syntax
    const connectionGroups = new Map<string, { targets: string[]; arrow: string }>();
    const processedBidirectional = new Set<string>();

    for (const skill of skills) {
        const sourceAbbrev = toAbbreviation(skill.name);
        
        for (const conn of skill.connections) {
            // Skip non-skill targets (instructions, prompts, etc.)
            const targetSkill = skills.find(s => s.name === conn.target);
            if (!targetSkill) {continue;}
            
            const targetAbbrev = toAbbreviation(conn.target);
            
            // Handle bidirectional - only output once
            if (conn.bidirectional) {
                const pairKey = [skill.name, conn.target].sort().join('|');
                if (processedBidirectional.has(pairKey)) {continue;}
                processedBidirectional.add(pairKey);
                
                const key = `${sourceAbbrev}|<-->`;
                if (!connectionGroups.has(key)) {
                    connectionGroups.set(key, { targets: [], arrow: '<-->' });
                }
                connectionGroups.get(key)!.targets.push(targetAbbrev);
                continue;
            }
            
            // Determine arrow type
            const isWeak = conn.weak || conn.strength < 0.7;
            const arrow = isWeak ? '-.->' : '-->';
            
            const key = `${sourceAbbrev}|${arrow}`;
            if (!connectionGroups.has(key)) {
                connectionGroups.set(key, { targets: [], arrow });
            }
            connectionGroups.get(key)!.targets.push(targetAbbrev);
        }
    }

    // Output connections using multi-target syntax
    lines.push('');
    lines.push('    %% Connections');
    for (const [key, group] of connectionGroups) {
        const source = key.split('|')[0];
        if (group.targets.length === 1) {
            lines.push(`    ${source} ${group.arrow} ${group.targets[0]}`);
        } else {
            lines.push(`    ${source} ${group.arrow} ${group.targets.join(' & ')}`);
        }
    }

    // Add styling with GitHub-compatible colors
    lines.push('');
    lines.push('    %% Styling');
    lines.push('    classDef master fill:#fff3e0,stroke:#ef6c00');
    lines.push('    classDef vscode fill:#e3f2fd,stroke:#1565c0');
    lines.push('    classDef m365 fill:#e8f5e9,stroke:#2e7d32');
    lines.push('    classDef inheritable fill:#f6f8fa,stroke:#656d76');
    lines.push('    classDef temp fill:#f3e5f5,stroke:#7b1fa2,stroke-dasharray:5 5');
    lines.push('    classDef stale fill:#ffebee,stroke:#c62828,stroke-dasharray:5 5,stroke-width:2px');

    // Apply classes
    const masterSkills = skills.filter(s => s.inheritance === 'master-only').map(s => toAbbreviation(s.name));
    const vscodeSkills = skills.filter(s => s.inheritance === 'heir:vscode').map(s => toAbbreviation(s.name));
    const m365Skills = skills.filter(s => s.inheritance === 'heir:m365').map(s => toAbbreviation(s.name));
    const inheritableSkills = skills.filter(s => s.inheritance === 'inheritable' && !s.temporary).map(s => toAbbreviation(s.name));
    const tempSkills = skills.filter(s => s.temporary).map(s => toAbbreviation(s.name));
    const staleSkills = skills.filter(s => STALE_PRONE.includes(s.name)).map(s => toAbbreviation(s.name));

    lines.push('');
    if (masterSkills.length > 0) {lines.push(`    class ${masterSkills.join(',')} master`);}
    if (vscodeSkills.length > 0) {lines.push(`    class ${vscodeSkills.join(',')} vscode`);}
    if (m365Skills.length > 0) {lines.push(`    class ${m365Skills.join(',')} m365`);}
    if (inheritableSkills.length > 0) {lines.push(`    class ${inheritableSkills.join(',')} inheritable`);}
    if (tempSkills.length > 0) {lines.push(`    class ${tempSkills.join(',')} temp`);}
    if (staleSkills.length > 0) {lines.push(`    class ${staleSkills.join(',')} stale`);}

    lines.push('```');

    return lines.join('\n');
}
