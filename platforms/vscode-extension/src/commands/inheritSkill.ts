import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { getAlexWorkspaceFolder } from '../shared/utils';

interface SkillRegistryEntry {
    id: string;
    name: string;
    version: string;
    inheritance: string;
    category: string;
    description: string;
    folder: string;
    projectSignals: string[];
    priority: 'critical' | 'high' | 'standard' | 'low';
    tags: string[];
    addedDate: string;
}

interface SkillRegistry {
    version: string;
    lastUpdated: string;
    description: string;
    skills: SkillRegistryEntry[];
}

interface InheritedFromMetadata {
    source: 'global-knowledge' | 'gk-pattern';
    registryId?: string;
    patternFile?: string;
    version: string;
    inheritedAt: string;
}

interface SynapsesJson {
    skillId: string;
    inheritedFrom?: InheritedFromMetadata;
    connections: unknown[];
    metadata?: Record<string, unknown>;
}

const GLOBAL_KNOWLEDGE_PATH = path.join(os.homedir(), '.alex', 'global-knowledge');
const SKILL_REGISTRY_PATH = path.join(GLOBAL_KNOWLEDGE_PATH, 'skills', 'skill-registry.json');

/**
 * Command: Alex: Inherit Skill from Global
 * Allows heirs to pull skills from the Global Knowledge repository
 */
export async function inheritSkillFromGlobal(): Promise<void> {
    const outputChannel = vscode.window.createOutputChannel('Alex Skill Inheritance');
    
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
            const proceed = await vscode.window.showWarningMessage(
                '⚠️ This appears to be Master Alex. Skill inheritance is designed for heir projects. Continue anyway?',
                'Continue', 'Cancel'
            );
            if (proceed !== 'Continue') {
                return;
            }
        }

        // Check Global Knowledge exists
        if (!await fs.pathExists(SKILL_REGISTRY_PATH)) {
            vscode.window.showErrorMessage(
                'Global Knowledge not found. Expected at: ' + GLOBAL_KNOWLEDGE_PATH
            );
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Loading Global Knowledge Skills',
            cancellable: true
        }, async (progress, token) => {
            
            progress.report({ message: 'Reading skill registry...' });
            
            // Load registry
            const registry: SkillRegistry = await fs.readJson(SKILL_REGISTRY_PATH);
            outputChannel.appendLine(`📚 Loaded ${registry.skills.length} skills from Global Knowledge`);
            
            if (token.isCancellationRequested) { return; }
            
            progress.report({ message: 'Scanning project skills...', increment: 20 });
            
            // Get existing project skills
            const existingSkills = await getExistingSkills(projectSkillsPath);
            outputChannel.appendLine(`📁 Found ${existingSkills.size} existing skills in project`);
            
            // Filter available skills
            const availableSkills = registry.skills.filter(
                skill => skill.inheritance === 'inheritable' && !existingSkills.has(skill.id)
            );
            
            if (availableSkills.length === 0) {
                vscode.window.showInformationMessage('All inheritable skills are already in this project.');
                return;
            }
            
            outputChannel.appendLine(`✅ ${availableSkills.length} skills available for inheritance`);
            
            progress.report({ message: 'Preparing selection...', increment: 20 });
            
            // Create QuickPick items
            const items: vscode.QuickPickItem[] = availableSkills.map(skill => ({
                label: `$(package) ${skill.name}`,
                description: `v${skill.version} · ${skill.category}`,
                detail: skill.description || `Tags: ${skill.tags.join(', ')}`,
                picked: false,
                // Store skill data for later
                // @ts-ignore - custom property
                skillData: skill
            }));

            // Show multi-select QuickPick
            const selected = await vscode.window.showQuickPick(items, {
                canPickMany: true,
                placeHolder: `Select skills to inherit (${availableSkills.length} available)`,
                title: 'Inherit Skills from Global Knowledge',
                matchOnDescription: true,
                matchOnDetail: true
            });

            if (!selected || selected.length === 0) {
                return;
            }

            progress.report({ message: `Inheriting ${selected.length} skill(s)...`, increment: 20 });

            // Inherit each selected skill
            let successCount = 0;
            let failCount = 0;

            for (const item of selected) {
                // @ts-ignore - custom property
                const skill: SkillRegistryEntry = item.skillData;
                
                try {
                    await inheritSkill(skill, projectSkillsPath, outputChannel);
                    successCount++;
                    outputChannel.appendLine(`✅ Inherited: ${skill.name}`);
                } catch (error) {
                    failCount++;
                    outputChannel.appendLine(`❌ Failed to inherit ${skill.name}: ${error}`);
                }
            }

            progress.report({ message: 'Finalizing...', increment: 30 });

            // Show results
            if (failCount === 0) {
                vscode.window.showInformationMessage(
                    `🎉 Successfully inherited ${successCount} skill(s) from Global Knowledge`,
                    'Show Output'
                ).then(choice => {
                    if (choice === 'Show Output') {
                        outputChannel.show();
                    }
                });
            } else {
                vscode.window.showWarningMessage(
                    `Inherited ${successCount} skill(s), ${failCount} failed. See output for details.`,
                    'Show Output'
                ).then(choice => {
                    if (choice === 'Show Output') {
                        outputChannel.show();
                    }
                });
            }

            // Offer to regenerate catalog
            if (successCount > 0) {
                const regenerate = await vscode.window.showInformationMessage(
                    'Regenerate skill catalog?',
                    'Yes', 'No'
                );
                if (regenerate === 'Yes') {
                    await vscode.commands.executeCommand('alex.generateSkillCatalog');
                }
            }
        });

    } catch (error) {
        outputChannel.appendLine(`❌ Error: ${error}`);
        outputChannel.show();
        vscode.window.showErrorMessage(`Skill inheritance failed: ${error}`);
    }
}

/**
 * Get set of existing skill IDs in the project
 */
async function getExistingSkills(skillsPath: string): Promise<Set<string>> {
    const existing = new Set<string>();
    
    if (!await fs.pathExists(skillsPath)) {
        return existing;
    }

    const entries = await fs.readdir(skillsPath, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            existing.add(entry.name);
        }
    }
    
    return existing;
}

/**
 * Inherit a single skill from Global Knowledge
 */
async function inheritSkill(
    skill: SkillRegistryEntry, 
    projectSkillsPath: string,
    outputChannel: vscode.OutputChannel
): Promise<void> {
    const sourcePath = path.join(GLOBAL_KNOWLEDGE_PATH, 'skills', skill.folder);
    const destPath = path.join(projectSkillsPath, skill.folder);

    // Verify source exists
    if (!await fs.pathExists(sourcePath)) {
        throw new Error(`Source skill folder not found: ${sourcePath}`);
    }

    // Copy skill folder
    await fs.copy(sourcePath, destPath, { overwrite: false });
    outputChannel.appendLine(`  📋 Copied ${skill.folder}/`);

    // Add inheritance tracking to synapses.json
    const synapsesPath = path.join(destPath, 'synapses.json');
    
    if (await fs.pathExists(synapsesPath)) {
        const synapses: SynapsesJson = await fs.readJson(synapsesPath);
        
        // Add inheritedFrom metadata
        synapses.inheritedFrom = {
            source: 'global-knowledge',
            registryId: skill.id,
            version: skill.version,
            inheritedAt: new Date().toISOString()
        };
        
        await fs.writeJson(synapsesPath, synapses, { spaces: 2 });
        outputChannel.appendLine(`  🔗 Added inheritance tracking`);
    } else {
        // Create minimal synapses.json with inheritance info
        const synapses: SynapsesJson = {
            skillId: skill.id,
            inheritedFrom: {
                source: 'global-knowledge',
                registryId: skill.id,
                version: skill.version,
                inheritedAt: new Date().toISOString()
            },
            connections: []
        };
        
        await fs.writeJson(synapsesPath, synapses, { spaces: 2 });
        outputChannel.appendLine(`  🔗 Created synapses.json with inheritance tracking`);
    }
}

/**
 * Register the command
 */
export function registerInheritSkillCommand(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand('alex.inheritSkillFromGlobal', inheritSkillFromGlobal);
}
