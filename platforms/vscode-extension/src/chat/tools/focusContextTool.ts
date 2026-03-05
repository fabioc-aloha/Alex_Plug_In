import * as vscode from 'vscode';
import { getSessionState } from '../../commands/session';
import { getGoalsSummary } from '../../commands/goals';
import { IFocusContextParams, IFocusContextResponse } from './types';

/**
 * Focus Context Tool - Returns user's current focus session and goals
 * 
 * This provides Alex with awareness of what the user is currently working on,
 * enabling context-aware assistance and productivity support.
 */
export class FocusContextTool implements vscode.LanguageModelTool<IFocusContextParams> {
    
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IFocusContextParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation | undefined> {
        return {
            invocationMessage: 'Checking your focus context...',
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IFocusContextParams>,
        token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        
        // Update welcome view avatar — focus context = planning state
        vscode.commands.executeCommand('alex.setCognitiveState', 'planning');

        try {
            // Get current session state
            const session = getSessionState();
            
            // Get goals if requested
            let goals = undefined;
            if (options.input.includeGoals !== false) {
                goals = await getGoalsSummary();
            }
            
            // Generate human-readable summary
            let summary = '';
            
            if (session.active) {
                const timeRemaining = session.remaining ? Math.floor(session.remaining / 60) : 0;
                const sessionType = session.isBreak ? 'break' : 'focus session';
                const pauseStatus = session.isPaused ? ' (PAUSED)' : '';
                const pomodoroInfo = session.pomodoroCount ? ` - Pomodoro #${session.pomodoroCount}` : '';
                
                summary = `Active ${sessionType}: "${session.topic}"${pomodoroInfo}${pauseStatus}\n`;
                summary += `Time remaining: ${timeRemaining} minutes\n`;
            } else {
                summary = 'No active focus session.\n';
            }
            
            if (goals) {
                summary += `\nGoals: ${goals.activeGoals.length} active, ${goals.completedToday} completed today`;
                if (goals.streakDays > 0) {
                    summary += `, ${goals.streakDays}-day streak`;
                }
                summary += '\n';
                
                if (goals.activeGoals.length > 0) {
                    summary += '\nActive goals:\n';
                    for (const goal of goals.activeGoals.slice(0, 5)) {
                        const progress = Math.round((goal.currentCount / goal.targetCount) * 100);
                        summary += `- ${goal.title}: ${goal.currentCount}/${goal.targetCount} ${goal.unit} (${progress}%)\n`;
                    }
                }
            }
            
            const response: IFocusContextResponse = {
                session,
                goals,
                summary
            };
            
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(JSON.stringify(response, null, 2))
            ]);
            
        } catch (error: unknown) {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(`Error getting focus context: ${error instanceof Error ? error.message : String(error)}`)
            ]);
        }
    }
}
