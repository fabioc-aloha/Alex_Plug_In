import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

/**
 * Export Alex memory for M365 Copilot integration
 * 
 * This command packages the user's global knowledge, profile, and notes
 * into a format ready for M365 Copilot declarative agent integration.
 * 
 * The export creates a package that can be:
 * 1. Uploaded to OneDrive as Alex-Memory folder
 * 2. Used with the M365 Copilot declarative agent
 * 3. Synced via the Azure Functions API
 * 4. Automatically synced to local OneDrive folder (if detected)
 */

interface ExportResult {
    success: boolean;
    outputPath?: string;
    oneDrivePath?: string;
    files: string[];
    message: string;
}

interface GlobalKnowledgeEntry {
    id: string;
    title: string;
    content: string;
    category?: string;
    tags?: string[];
}

/**
 * Detect the user's OneDrive folder path
 * Supports personal OneDrive, OneDrive for Business, and custom paths
 */
async function detectOneDrivePath(): Promise<string | null> {
    const homeDir = os.homedir();
    
    // Common OneDrive folder names (check in order of likelihood)
    const possiblePaths = [
        path.join(homeDir, 'OneDrive'),                           // Personal
        path.join(homeDir, 'OneDrive - Personal'),                // Personal (alt)
    ];
    
    // Check for OneDrive for Business folders (company names vary)
    try {
        const homeDirContents = await fs.readdir(homeDir);
        for (const folder of homeDirContents) {
            if (folder.startsWith('OneDrive -') && folder !== 'OneDrive - Personal') {
                possiblePaths.unshift(path.join(homeDir, folder)); // Prioritize business
            }
        }
    } catch { /* ignore */ }
    
    // Return first existing path
    for (const oneDrivePath of possiblePaths) {
        if (await fs.pathExists(oneDrivePath)) {
            return oneDrivePath;
        }
    }
    
    return null;
}

/**
 * Sync exported files to OneDrive Alex-Memory folder
 */
async function syncToOneDrive(exportDir: string): Promise<{ success: boolean; path?: string; message: string }> {
    const oneDriveRoot = await detectOneDrivePath();
    
    if (!oneDriveRoot) {
        return {
            success: false,
            message: 'OneDrive folder not detected. Upload manually or configure OneDrive sync.'
        };
    }
    
    const alexMemoryPath = path.join(oneDriveRoot, 'Alex-Memory');
    
    try {
        // Create Alex-Memory folder if it doesn't exist
        await fs.ensureDir(alexMemoryPath);
        
        // Copy all exported files to OneDrive
        await fs.copy(exportDir, alexMemoryPath, { overwrite: true });
        
        return {
            success: true,
            path: alexMemoryPath,
            message: `Synced to ${alexMemoryPath}`
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to sync to OneDrive: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

/**
 * Export Alex global knowledge for M365 Copilot
 */
export async function exportForM365(context: vscode.ExtensionContext): Promise<ExportResult> {
    const homeDir = os.homedir();
    const globalKnowledgePath = path.join(homeDir, '.alex', 'global-knowledge');
    const exportFiles: string[] = [];

    // Check if M365 export is enabled
    const config = vscode.workspace.getConfiguration('alex');
    const m365Enabled = config.get<boolean>('m365.enabled', true);
    
    if (!m365Enabled) {
        const enable = await vscode.window.showWarningMessage(
            'M365 Copilot integration is disabled. Enable it to export your Alex memory.',
            'Enable & Export',
            'Cancel'
        );
        
        if (enable !== 'Enable & Export') {
            return {
                success: false,
                files: [],
                message: 'Export cancelled - M365 integration is disabled'
            };
        }
        
        // Enable the setting
        await config.update('m365.enabled', true, vscode.ConfigurationTarget.Global);
    }

    // Show progress
    return await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Exporting Alex Memory for M365 Copilot...',
        cancellable: false
    }, async (progress) => {
        
        progress.report({ increment: 10, message: 'Checking global knowledge...' });

        // Check if global knowledge exists
        if (!await fs.pathExists(globalKnowledgePath)) {
            return {
                success: false,
                files: [],
                message: 'No global knowledge found. Run "Alex: Initialize" first and build some knowledge!'
            };
        }

        // Create export directory
        const exportDir = path.join(homeDir, 'Alex-Memory-Export');
        await fs.ensureDir(exportDir);

        progress.report({ increment: 20, message: 'Exporting profile...' });

        // Export profile
        const profilePath = path.join(globalKnowledgePath, 'profile.json');
        if (await fs.pathExists(profilePath)) {
            const profile = await fs.readJson(profilePath);
            const profileMd = generateProfileMarkdown(profile);
            await fs.writeFile(path.join(exportDir, 'profile.md'), profileMd);
            exportFiles.push('profile.md');
        } else {
            // Create a template profile
            const templateProfile = generateTemplateProfile();
            await fs.writeFile(path.join(exportDir, 'profile.md'), templateProfile);
            exportFiles.push('profile.md (template)');
        }

        progress.report({ increment: 20, message: 'Exporting patterns...' });

        // Export patterns (GK-*.md files)
        const patternsDir = path.join(globalKnowledgePath, 'patterns');
        const knowledgeDir = path.join(exportDir, 'knowledge');
        await fs.ensureDir(knowledgeDir);

        if (await fs.pathExists(patternsDir)) {
            const patterns = await fs.readdir(patternsDir);
            for (const pattern of patterns.filter(f => f.endsWith('.md'))) {
                const content = await fs.readFile(path.join(patternsDir, pattern), 'utf-8');
                // Convert GK- prefix to DK- for M365 compatibility
                const m365Name = pattern.replace(/^GK-/, 'DK-');
                await fs.writeFile(path.join(knowledgeDir, m365Name), content);
                exportFiles.push(`knowledge/${m365Name}`);
            }
        }

        progress.report({ increment: 20, message: 'Exporting insights...' });

        // Export insights (GI-*.md files)
        const insightsDir = path.join(globalKnowledgePath, 'insights');
        const exportInsightsDir = path.join(exportDir, 'insights');
        await fs.ensureDir(exportInsightsDir);

        if (await fs.pathExists(insightsDir)) {
            const insights = await fs.readdir(insightsDir);
            for (const insight of insights.filter(f => f.endsWith('.md'))) {
                const content = await fs.readFile(path.join(insightsDir, insight), 'utf-8');
                await fs.writeFile(path.join(exportInsightsDir, insight), content);
                exportFiles.push(`insights/${insight}`);
            }
        }

        progress.report({ increment: 10, message: 'Creating notes template...' });

        // Create notes template
        const notesMd = generateNotesTemplate();
        await fs.writeFile(path.join(exportDir, 'notes.md'), notesMd);
        exportFiles.push('notes.md');

        // Create learning goals template
        const goalsMd = generateLearningGoalsTemplate();
        await fs.writeFile(path.join(exportDir, 'learning-goals.md'), goalsMd);
        exportFiles.push('learning-goals.md');

        progress.report({ increment: 10, message: 'Creating README...' });

        // Create README with setup instructions
        const readmeMd = generateM365ReadMe(exportFiles.length);
        await fs.writeFile(path.join(exportDir, 'README.md'), readmeMd);
        exportFiles.push('README.md');

        progress.report({ increment: 5, message: 'Syncing to OneDrive...' });

        // Try to sync to OneDrive automatically
        const oneDriveResult = await syncToOneDrive(exportDir);
        
        progress.report({ increment: 5, message: 'Complete!' });

        if (oneDriveResult.success) {
            return {
                success: true,
                outputPath: exportDir,
                oneDrivePath: oneDriveResult.path,
                files: exportFiles,
                message: `Exported ${exportFiles.length} files and synced to OneDrive!`
            };
        } else {
            return {
                success: true,
                outputPath: exportDir,
                files: exportFiles,
                message: `Exported ${exportFiles.length} files to ${exportDir}. ${oneDriveResult.message}`
            };
        }
    });
}

/**
 * Generate profile markdown from JSON profile
 */
function generateProfileMarkdown(profile: Record<string, unknown>): string {
    return `# My Profile

## About Me
- Name: ${profile.name || '[Your name]'}
- Role: ${profile.role || '[Your role]'}
- Organization: ${profile.organization || '[Your organization]'}

## Preferences
- Communication style: ${profile.formality || 'balanced'}
- Detail level: ${profile.detailLevel || 'balanced'}
- Explanation style: ${profile.explanationStyle || 'mixed'}
- Use humor: ${profile.humor ?? true}
- Encouragement: ${profile.encouragement ?? true}

## Expertise Areas
${Array.isArray(profile.expertiseAreas) ? profile.expertiseAreas.map((e: string) => `- ${e}`).join('\n') : '- [List your skills]'}

## Learning Goals
${Array.isArray(profile.learningGoals) ? profile.learningGoals.map((g: string) => `- ${g}`).join('\n') : '- [What do you want to learn?]'}

## Primary Technologies
${Array.isArray(profile.primaryTechnologies) ? profile.primaryTechnologies.map((t: string) => `- ${t}`).join('\n') : '- [Your tech stack]'}

---
*Exported from Alex Cognitive Architecture for M365 Copilot*
`;
}

/**
 * Generate a template profile for new users
 */
function generateTemplateProfile(): string {
    return `# My Profile

## About Me
- Name: [Your name]
- Role: [Your role]
- Organization: [Your organization]

## Preferences
- Communication style: casual / formal / balanced
- Detail level: brief / detailed / balanced
- Explanation style: examples-first / theory-first / mixed
- Use humor: yes / no
- Encouragement: yes / no

## Expertise Areas
- [List your skills and areas of expertise]

## Learning Goals
- [What do you want to learn?]
- [Current focus areas]

## Primary Technologies
- [Your tech stack]
- [Languages, frameworks, tools]

---
*Edit this file to personalize your Alex M365 experience!*
`;
}

/**
 * Generate notes template
 */
function generateNotesTemplate(): string {
    return `# Session Notes

## Quick Notes
- 

## Reminders
- 

## Observations
- 

---
*Alex will help you maintain this file during conversations*
`;
}

/**
 * Generate learning goals template
 */
function generateLearningGoalsTemplate(): string {
    return `# Learning Goals

## Active Goals

### Goal 1: [Your first learning goal]
- **Status**: active
- **Progress**: Just started
- **Target**: [What success looks like]

### Goal 2: [Your second learning goal]
- **Status**: active
- **Progress**: 
- **Target**: 

## Achieved Goals
- 

## Paused Goals
- 

---
*Alex tracks your progress and suggests consolidation when topics are practiced 3+ times*
`;
}

/**
 * Generate README with M365 setup instructions
 */
function generateM365ReadMe(fileCount: number): string {
    return `# Alex Memory for M365 Copilot 🧠

This folder contains your exported Alex memory, ready for M365 Copilot integration!

## Exported Files (${fileCount})

| File | Purpose |
|------|---------|
| profile.md | Your identity, preferences, and goals |
| notes.md | Quick notes, reminders, observations |
| learning-goals.md | Active learning objectives |
| knowledge/ | Domain knowledge files (DK-*.md) |
| insights/ | Timestamped learnings (GI-*.md) |

## Setup Instructions

### 1. Upload to OneDrive

1. Open OneDrive in your browser
2. Create a folder called \`Alex-Memory\` in the root
3. Upload all contents of this export folder

### 2. Access via M365 Copilot

Once your files are in OneDrive, ask the Alex declarative agent:
- "Hi Alex, what do you know about me?"
- "@Alex search my knowledge for [topic]"
- "@Alex what are my learning goals?"

### 3. Keeping in Sync

Your VS Code Alex extension syncs to GitHub Gists. The M365 agent reads
from OneDrive. For bi-directional sync:

1. Export periodically using "Alex: Export for M365"
2. Or use the Azure Functions API (if deployed)

## Need Help?

- VS Code: Use \`@alex /status\` in Copilot Chat
- M365: Ask Alex "What can you help me with?"
- Docs: https://github.com/fabioc-aloha/Alex_Plug_In

---
*Exported by Alex Cognitive Architecture v4.2.3 🧠*
`;
}

/**
 * Run the export command with user interaction
 */
export async function runExportForM365(context: vscode.ExtensionContext): Promise<void> {
    const result = await exportForM365(context);
    
    if (result.success && result.outputPath) {
        // Different message based on whether OneDrive sync succeeded
        if (result.oneDrivePath) {
            // OneDrive sync worked - simpler success message
            const openOneDrive = 'Open OneDrive Folder';
            const tryM365 = 'Try in M365';
            
            const selection = await vscode.window.showInformationMessage(
                `✅ ${result.message}\n\n📁 ${result.oneDrivePath}\n\nYour M365 Alex agent can now access this knowledge!`,
                openOneDrive,
                tryM365
            );
            
            if (selection === openOneDrive) {
                const uri = vscode.Uri.file(result.oneDrivePath);
                await vscode.env.openExternal(uri);
            } else if (selection === tryM365) {
                // Open M365 Copilot in browser
                await vscode.env.openExternal(vscode.Uri.parse('https://m365.cloud.microsoft/chat'));
            }
        } else {
            // OneDrive not found - show manual upload instructions
            const openFolder = 'Open Export Folder';
            const copyPath = 'Copy Path';
            const howToUse = 'How to Use';
            
            const selection = await vscode.window.showInformationMessage(
                `✅ Exported ${result.files.length} files.\n\nOneDrive not detected - upload manually to OneDrive/Alex-Memory/`,
                openFolder,
                copyPath,
                howToUse
            );
            
            if (selection === openFolder) {
                const uri = vscode.Uri.file(result.outputPath);
                await vscode.env.openExternal(uri);
            } else if (selection === copyPath) {
                await vscode.env.clipboard.writeText(result.outputPath);
                vscode.window.showInformationMessage('Path copied to clipboard!');
            } else if (selection === howToUse) {
                const instructions = `## M365 Export Setup

**OneDrive was not detected on this machine.**

**Step 1:** Install OneDrive desktop app, or manually upload to onedrive.live.com

**Step 2:** Create folder: \`Alex-Memory\` in your OneDrive root

**Step 3:** Upload all files from:
\`${result.outputPath}\`

**Step 4:** In M365 Copilot, try:
- "@Alex what do you know about me?"
- "@Alex search my knowledge for [topic]"

**Exported files:** ${result.files.join(', ')}`;
                
                const doc = await vscode.workspace.openTextDocument({
                    content: instructions,
                    language: 'markdown'
                });
                await vscode.window.showTextDocument(doc, { preview: true });
            }
        }
    } else {
        vscode.window.showWarningMessage(`⚠️ ${result.message}`);
    }
}

/**
 * Silently sync to OneDrive (for auto-sync on dream/meditate)
 * Returns true if sync succeeded
 */
export async function silentSyncToOneDrive(): Promise<boolean> {
    const homeDir = os.homedir();
    const exportDir = path.join(homeDir, 'Alex-Memory-Export');
    
    // Check if export folder exists
    if (!await fs.pathExists(exportDir)) {
        return false;
    }
    
    const result = await syncToOneDrive(exportDir);
    return result.success;
}
