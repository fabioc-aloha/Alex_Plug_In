import * as vscode from 'vscode';
import { ICognitiveStateParams } from './types';

/**
 * Cognitive State Update Tool - Allows the LLM to update Alex's visual state in the welcome view.
 * This is the primary mechanism for avatar switching in agent mode, where alexChatHandler never fires.
 * The LLM detects the cognitive context (debugging, building, planning, etc.) and calls this tool
 * to update the welcome sidebar avatar accordingly.
 * 
 * Also supports agent mode avatars (builder, researcher, validator, documentarian, azure, m365)
 * which show agent-specific banners instead of cognitive state portraits.
 */
export class CognitiveStateUpdateTool implements vscode.LanguageModelTool<ICognitiveStateParams> {

    private static readonly validStates = new Set([
        'debugging', 'planning', 'building', 'reviewing', 'learning',
        'teaching', 'meditation', 'dream', 'discovery'
    ]);

    private static readonly validAgentModes = new Set([
        'builder', 'researcher', 'validator', 'documentarian', 'azure', 'm365'
    ]);

    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<ICognitiveStateParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        // No confirmation needed — this is a lightweight visual update
        const state = options.input.state;
        return {
            invocationMessage: state === 'persona' ? 'Detecting project persona...' : `Switching to ${state} mode...`
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<ICognitiveStateParams>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {

        const state = options.input.state?.toLowerCase();

        // Special "persona" state: clear cognitive state and re-detect project persona
        if (state === 'persona') {
            await vscode.commands.executeCommand('alex.setCognitiveState', null);
            await vscode.commands.executeCommand('alex.setAgentMode', null);
            await vscode.commands.executeCommand('alex.refreshWelcomeView');
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('Avatar reset to project persona')
            ]);
        }

        // Check if it's an agent mode
        if (state && CognitiveStateUpdateTool.validAgentModes.has(state)) {
            await vscode.commands.executeCommand('alex.setAgentMode', state);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`Agent mode avatar updated to: ${state}`)
            ]);
        }

        // Check if it's a cognitive state
        if (!state || !CognitiveStateUpdateTool.validStates.has(state)) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    `Invalid state "${state}". Valid cognitive states: ${[...CognitiveStateUpdateTool.validStates].join(', ')}. Valid agent modes: ${[...CognitiveStateUpdateTool.validAgentModes].join(', ')}. Use "persona" to reset to project-appropriate avatar.`
                )
            ]);
        }

        // Update the welcome view avatar via the registered command
        await vscode.commands.executeCommand('alex.setCognitiveState', state);

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(`Cognitive state updated to: ${state}`)
        ]);
    }
}
