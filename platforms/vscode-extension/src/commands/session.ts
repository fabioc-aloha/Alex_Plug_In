import * as vscode from 'vscode';
import { autoIncrementGoals } from './goals';

/**
 * Session Timer - Pomodoro-style learning session tracking
 * 
 * Features:
 * - Start timed learning sessions with optional topic
 * - Status bar countdown display
 * - Pause/resume functionality
 * - Pomodoro mode (25min work, 5min break)
 * - Auto-prompt to consolidate learnings at session end
 * - Auto-increment learning goals on session completion
 */

export interface Session {
    topic: string;
    startTime: Date;
    duration: number; // in minutes
    remaining: number; // in seconds
    isPaused: boolean;
    isBreak: boolean;
    pomodoroCount: number;
}

let currentSession: Session | null = null;
let sessionTimer: NodeJS.Timeout | null = null;
let sessionStatusBarItem: vscode.StatusBarItem | null = null;

/**
 * Initialize session status bar item
 */
export function initializeSessionStatusBar(context: vscode.ExtensionContext): void {
    sessionStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        99 // Just left of the main Alex status bar
    );
    sessionStatusBarItem.command = 'alex.sessionActions';
    context.subscriptions.push(sessionStatusBarItem);
}

/**
 * Start a new learning session
 */
export async function startSession(
    topic?: string,
    durationMinutes?: number,
    isPomodoroMode?: boolean
): Promise<void> {
    // If session already running, ask to end it first
    if (currentSession) {
        const action = await vscode.window.showWarningMessage(
            `A session is already in progress: "${currentSession.topic}"`,
            'End Current Session',
            'Cancel'
        );
        if (action === 'End Current Session') {
            await endSession(false);
        } else {
            return;
        }
    }

    // Get topic if not provided
    if (!topic) {
        topic = await vscode.window.showInputBox({
            prompt: 'What are you learning about?',
            placeHolder: 'e.g., React hooks, TypeScript generics, API design...',
            title: '🎯 Start Learning Session'
        });
        if (!topic) {
            return; // User cancelled
        }
    }

    // Get duration if not provided
    if (!durationMinutes) {
        const durationOptions: vscode.QuickPickItem[] = [
            { label: '🍅 25 minutes', description: 'Pomodoro focus session', detail: 'Recommended for deep work' },
            { label: '⏱️ 15 minutes', description: 'Quick learning burst' },
            { label: '⏱️ 45 minutes', description: 'Extended session' },
            { label: '⏱️ 60 minutes', description: 'Deep dive session' },
            { label: '⚙️ Custom...', description: 'Set your own duration' }
        ];

        const selected = await vscode.window.showQuickPick(durationOptions, {
            placeHolder: 'How long do you want to focus?',
            title: '⏱️ Session Duration'
        });

        if (!selected) {
            return; // User cancelled
        }

        if (selected.label.includes('Custom')) {
            const customDuration = await vscode.window.showInputBox({
                prompt: 'Enter duration in minutes',
                placeHolder: '30',
                validateInput: (value) => {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 1 || num > 180) {
                        return 'Please enter a number between 1 and 180';
                    }
                    return null;
                }
            });
            if (!customDuration) {
                return;
            }
            durationMinutes = parseInt(customDuration);
            isPomodoroMode = false;
        } else if (selected.label.includes('Pomodoro')) {
            durationMinutes = 25;
            isPomodoroMode = true;
        } else {
            durationMinutes = parseInt(selected.label.match(/\d+/)?.[0] || '25');
            isPomodoroMode = false;
        }
    }

    // Create session
    currentSession = {
        topic,
        startTime: new Date(),
        duration: durationMinutes,
        remaining: durationMinutes * 60,
        isPaused: false,
        isBreak: false,
        pomodoroCount: isPomodoroMode ? 1 : 0
    };

    // Start timer
    startTimer();

    // Show notification
    vscode.window.showInformationMessage(
        `🎯 Session started: "${topic}" (${durationMinutes} min)`,
        'End Session'
    ).then(action => {
        if (action === 'End Session') {
            endSession(true);
        }
    });

    // Update status bar
    updateSessionStatusBar();
}

/**
 * Start the countdown timer
 */
function startTimer(): void {
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }

    sessionTimer = setInterval(() => {
        if (!currentSession || currentSession.isPaused) {
            return;
        }

        currentSession.remaining--;
        updateSessionStatusBar();

        // Check for time milestones
        if (currentSession.remaining === 300) { // 5 minutes left
            vscode.window.showInformationMessage(
                `⏰ 5 minutes remaining in your "${currentSession.topic}" session`
            );
        } else if (currentSession.remaining === 60) { // 1 minute left
            vscode.window.showInformationMessage(
                `⏰ 1 minute remaining! Wrap up your "${currentSession.topic}" session`
            );
        } else if (currentSession.remaining <= 0) {
            handleSessionEnd();
        }
    }, 1000);
}

/**
 * Handle session end (timer expired)
 */
async function handleSessionEnd(): Promise<void> {
    if (!currentSession) {
        return;
    }

    // Stop timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }

    const topic = currentSession.topic;
    const isPomodoroMode = currentSession.pomodoroCount > 0;
    const isBreak = currentSession.isBreak;
    const pomodoroCount = currentSession.pomodoroCount;

    if (isBreak) {
        // Break ended, start new work session
        vscode.window.showInformationMessage(
            `☕ Break complete! Ready for Pomodoro #${pomodoroCount + 1}?`,
            'Start Next Session',
            'End'
        ).then(async action => {
            if (action === 'Start Next Session') {
                currentSession = {
                    topic,
                    startTime: new Date(),
                    duration: 25,
                    remaining: 25 * 60,
                    isPaused: false,
                    isBreak: false,
                    pomodoroCount: pomodoroCount + 1
                };
                startTimer();
                updateSessionStatusBar();
            } else {
                await promptConsolidation(topic, pomodoroCount);
                currentSession = null;
                hideSessionStatusBar();
            }
        });
    } else if (isPomodoroMode) {
        // Work session ended, offer break
        const breakDuration = pomodoroCount >= 4 ? 15 : 5; // Long break every 4 pomodoros
        
        vscode.window.showInformationMessage(
            `🍅 Pomodoro #${pomodoroCount} complete! Take a ${breakDuration}-minute break?`,
            `Start ${breakDuration}min Break`,
            'End Session'
        ).then(async action => {
            if (action?.includes('Break')) {
                currentSession = {
                    topic,
                    startTime: new Date(),
                    duration: breakDuration,
                    remaining: breakDuration * 60,
                    isPaused: false,
                    isBreak: true,
                    pomodoroCount
                };
                startTimer();
                updateSessionStatusBar();
            } else {
                await promptConsolidation(topic, pomodoroCount);
                currentSession = null;
                hideSessionStatusBar();
            }
        });
    } else {
        // Regular session ended
        await promptConsolidation(topic, 0);
        currentSession = null;
        hideSessionStatusBar();
    }
}

/**
 * Prompt user to consolidate learnings
 */
async function promptConsolidation(topic: string, pomodoroCount: number): Promise<void> {
    const pomodoroInfo = pomodoroCount > 0 ? ` (${pomodoroCount} 🍅)` : '';
    
    const action = await vscode.window.showInformationMessage(
        `✅ Session complete: "${topic}"${pomodoroInfo}. Consolidate your learnings?`,
        'Save Insight',
        'Chat with @alex',
        'Dismiss'
    );

    if (action === 'Save Insight') {
        // Open quick pick to save insight
        vscode.commands.executeCommand('alex.saveSelectionAsInsight');
    } else if (action === 'Chat with @alex') {
        // Open Copilot Chat with context
        vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
        // Could pre-populate with: `@alex I just finished learning about ${topic}. Help me consolidate...`
    }
}

/**
 * End the current session
 */
export async function endSession(promptConsolidate: boolean = true): Promise<void> {
    if (!currentSession) {
        vscode.window.showInformationMessage('No active session to end');
        return;
    }

    // Stop timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }

    const topic = currentSession.topic;
    const elapsed = Math.floor((currentSession.duration * 60 - currentSession.remaining) / 60);
    const pomodoroCount = currentSession.pomodoroCount;

    currentSession = null;
    hideSessionStatusBar();

    // Auto-increment session goals
    try {
        await autoIncrementGoals('session');
    } catch (err) {
        console.warn('Failed to auto-increment goals:', err);
    }

    if (promptConsolidate) {
        const pomodoroInfo = pomodoroCount > 0 ? ` (${pomodoroCount} 🍅)` : '';
        vscode.window.showInformationMessage(
            `🛑 Session ended: "${topic}" after ${elapsed} min${pomodoroInfo}`,
            'Save Insight',
            'Dismiss'
        ).then(action => {
            if (action === 'Save Insight') {
                vscode.commands.executeCommand('alex.saveSelectionAsInsight');
            }
        });
    }
}

/**
 * Pause or resume the current session
 */
export async function togglePauseSession(): Promise<void> {
    if (!currentSession) {
        vscode.window.showInformationMessage('No active session to pause');
        return;
    }

    currentSession.isPaused = !currentSession.isPaused;
    
    if (currentSession.isPaused) {
        vscode.window.showInformationMessage(
            `⏸️ Session paused: "${currentSession.topic}"`,
            'Resume'
        ).then(action => {
            if (action === 'Resume') {
                togglePauseSession();
            }
        });
    } else {
        vscode.window.showInformationMessage(`▶️ Session resumed: "${currentSession.topic}"`);
    }

    updateSessionStatusBar();
}

/**
 * Add time to the current session
 */
export async function addTimeToSession(minutes: number = 5): Promise<void> {
    if (!currentSession) {
        vscode.window.showInformationMessage('No active session');
        return;
    }

    currentSession.remaining += minutes * 60;
    currentSession.duration += minutes;
    
    vscode.window.showInformationMessage(`⏱️ Added ${minutes} minutes to session`);
    updateSessionStatusBar();
}

/**
 * Show session actions quick pick
 */
export async function showSessionActions(): Promise<void> {
    if (!currentSession) {
        // No session - offer to start one
        await startSession();
        return;
    }

    const pauseLabel = currentSession.isPaused ? '▶️ Resume Session' : '⏸️ Pause Session';
    const sessionType = currentSession.isBreak ? 'Break' : 'Session';
    
    const items: vscode.QuickPickItem[] = [
        { label: pauseLabel, description: currentSession.isPaused ? 'Continue your session' : 'Take a quick pause' },
        { label: '⏱️ Add 5 Minutes', description: 'Extend your session' },
        { label: '⏱️ Add 10 Minutes', description: 'Extend your session more' },
        { label: '🛑 End Session', description: `Stop the current ${sessionType.toLowerCase()}` }
    ];

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: `${sessionType}: "${currentSession.topic}" - ${formatTime(currentSession.remaining)} remaining`,
        title: `🎯 ${sessionType} Actions`
    });

    if (!selected) {
        return;
    }

    if (selected.label.includes('Pause') || selected.label.includes('Resume')) {
        await togglePauseSession();
    } else if (selected.label.includes('Add 5')) {
        await addTimeToSession(5);
    } else if (selected.label.includes('Add 10')) {
        await addTimeToSession(10);
    } else if (selected.label.includes('End')) {
        await endSession(true);
    }
}

/**
 * Format seconds as MM:SS
 */
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Update the session status bar
 */
function updateSessionStatusBar(): void {
    if (!sessionStatusBarItem || !currentSession) {
        return;
    }

    const timeStr = formatTime(currentSession.remaining);
    const pauseIcon = currentSession.isPaused ? '⏸️' : '';
    const typeIcon = currentSession.isBreak ? '☕' : '🎯';
    const pomodoroIcon = currentSession.pomodoroCount > 0 ? `🍅×${currentSession.pomodoroCount}` : '';

    sessionStatusBarItem.text = `${typeIcon} ${timeStr} ${pauseIcon}`.trim();
    sessionStatusBarItem.tooltip = `${currentSession.isBreak ? 'Break' : 'Learning'}: "${currentSession.topic}"\n${pomodoroIcon}\nClick for actions`;
    // Don't use background colors - the ⏸️ emoji is enough to indicate paused state
    sessionStatusBarItem.backgroundColor = undefined;
    sessionStatusBarItem.show();
}

/**
 * Hide the session status bar
 */
function hideSessionStatusBar(): void {
    if (sessionStatusBarItem) {
        sessionStatusBarItem.hide();
    }
}

/**
 * Get current session info (for other components)
 */
export function getCurrentSession(): Session | null {
    return currentSession;
}

/**
 * Check if a session is active
 */
export function isSessionActive(): boolean {
    return currentSession !== null;
}

/**
 * Clean up resources
 */
export function disposeSession(): void {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
    currentSession = null;
}
