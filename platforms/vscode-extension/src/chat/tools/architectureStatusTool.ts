import * as vscode from 'vscode';
import * as path from 'path';
import * as workspaceFs from '../../shared/workspaceFs';
import { IArchitectureStatusParams } from './types';

/**
 * Architecture Status Tool - Returns current Alex architecture status
 */
export class ArchitectureStatusTool implements vscode.LanguageModelTool<IArchitectureStatusParams> {
    
    async prepareInvocation(
        _options: vscode.LanguageModelToolInvocationPrepareOptions<IArchitectureStatusParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Checking Alex architecture status...',
        };
    }

    async invoke(
        _options: vscode.LanguageModelToolInvocationOptions<IArchitectureStatusParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        // Update welcome view avatar — architecture status = planning state
        vscode.commands.executeCommand('alex.setCognitiveState', 'planning');

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('No workspace folder open. Alex architecture status unavailable.')
            ]);
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const markerFile = path.join(rootPath, '.github', 'copilot-instructions.md');
        
        const isInstalled = await workspaceFs.pathExists(markerFile);
        
        if (!isInstalled) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `Alex Cognitive Architecture is **not installed** in this workspace.\n\n` +
                    `Run \`Alex: Initialize Architecture\` from the Command Palette to install.`
                )
            ]);
        }

        // Count files
        const instructionFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/instructions/*.md')
        );
        const promptFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/prompts/*.md')
        );
        const episodicFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/episodic/*.md')
        );
        const skillFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/skills/*/SKILL.md')
        );
        const domainFiles = await vscode.workspace.findFiles(
            new vscode.RelativePattern(workspaceFolders[0], '.github/domain-knowledge/*.md')  // Legacy
        );

        // Get version from main file
        let version = 'Unknown';
        try {
            const content = await workspaceFs.readFile(markerFile);
            const versionMatch = content.match(/\*\*Version\*\*:\s*(\d+\.\d+\.\d+\s+\w+)/);
            if (versionMatch) {
                version = versionMatch[1];
            }
        } catch (err) {
            // Use default
        }

        const result = `## Alex Cognitive Architecture Status

| Property | Value |
|----------|-------|
| Status | ✅ Installed |
| Version | ${version} |
| Procedural Memory | ${instructionFiles.length} files |
| Episodic Memory | ${promptFiles.length + episodicFiles.length} files |
| Skills | ${skillFiles.length} skills |
| Domain Knowledge | ${domainFiles.length} files |

### Memory Systems
- **Working Memory**: Chat session (7-rule capacity)
- **Procedural Memory**: .github/instructions/*.md files (repeatable processes)
- **Episodic Memory**: .github/prompts/*.md + .github/episodic/*.md files (workflows & sessions)
- **Skills**: .github/skills/*/SKILL.md files (portable domain expertise)
- **Domain Knowledge**: .github/domain-knowledge/DK-*.md files (legacy - migrated to skills)

### Available Commands
- \`Alex: Initialize Architecture\` - Deploy to new project
- \`Alex: Dream (Neural Maintenance)\` - Validate synapses
- \`Alex: Upgrade Architecture\` - Update to latest version
- \`Alex: Reset Architecture\` - Clean reinstall
`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(result)
        ]);
    }
}
