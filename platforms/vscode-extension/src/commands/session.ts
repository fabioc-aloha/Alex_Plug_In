import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { autoIncrementGoals, getGoalsSummary } from './goals';
import { getAlexGlobalPath } from '../chat/globalKnowledge';

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
let focusTrackingStatusBarItem: vscode.StatusBarItem | null = null;
let fileActivityListener: vscode.Disposable | null = null;
let recentFiles: string[] = [];
let isOnTopic: boolean = true;

const SESSION_STATE_FILE = 'session-state.json';

/**
 * Persisted session state interface for Alex visibility
 */
export interface PersistedSessionState {
    active: boolean;
    topic?: string;
    startTime?: string;
    duration?: number;
    remaining?: number;
    isPaused?: boolean;
    isBreak?: boolean;
    pomodoroCount?: number;
    lastUpdated: string;
}

/**
 * Get the path to the session state file
 */
function getSessionStateFilePath(): string {
    const globalPath = getAlexGlobalPath();
    return path.join(globalPath, SESSION_STATE_FILE);
}

/**
 * Save current session state to disk for Alex visibility
 */
async function saveSessionState(): Promise<void> {
    try {
        const filePath = getSessionStateFilePath();
        await fs.ensureDir(path.dirname(filePath));
        
        const state: PersistedSessionState = currentSession ? {
            active: true,
            topic: currentSession.topic,
            startTime: currentSession.startTime.toISOString(),
            duration: currentSession.duration,
            remaining: currentSession.remaining,
            isPaused: currentSession.isPaused,
            isBreak: currentSession.isBreak,
            pomodoroCount: currentSession.pomodoroCount,
            lastUpdated: new Date().toISOString()
        } : {
            active: false,
            lastUpdated: new Date().toISOString()
        };
        
        await fs.writeJson(filePath, state, { spaces: 2 });
    } catch (err) {
        console.warn('Failed to save session state:', err);
    }
}

/**
 * Load persisted session state (for recovery on startup)
 */
export async function loadSessionState(): Promise<PersistedSessionState | null> {
    try {
        const filePath = getSessionStateFilePath();
        if (await fs.pathExists(filePath)) {
            return await fs.readJson(filePath);
        }
    } catch (err) {
        console.warn('Failed to load session state:', err);
    }
    return null;
}

/**
 * Restore session from disk on startup if it hasn't expired
 * Calculates remaining time based on startTime + duration vs current time
 */
export async function restoreSessionOnStartup(): Promise<boolean> {
    try {
        const state = await loadSessionState();
        if (!state || !state.active || !state.startTime || !state.duration) {
            return false;
        }

        const startTime = new Date(state.startTime);
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const totalDurationSeconds = state.duration * 60;
        const remainingSeconds = totalDurationSeconds - elapsedSeconds;

        // If session was paused, use the stored remaining time
        // Otherwise calculate based on elapsed time
        const effectiveRemaining = state.isPaused 
            ? (state.remaining || 0) 
            : remainingSeconds;

        // Session has expired
        if (effectiveRemaining <= 0) {
            // Clear the persisted state
            await saveSessionState();
            return false;
        }

        // Restore the session
        currentSession = {
            topic: state.topic || 'Resumed Session',
            startTime: startTime,
            duration: state.duration,
            remaining: effectiveRemaining,
            isPaused: state.isPaused || false,
            isBreak: state.isBreak || false,
            pomodoroCount: state.pomodoroCount || 0
        };

        // Start timer and update UI
        startTimer();
        updateSessionStatusBar();

        // Get goals summary for notification
        const goals = await getGoalsSummary();
        const goalsInfo = goals.activeGoals.length > 0
            ? ` | 🎯 ${goals.activeGoals.length} active goal${goals.activeGoals.length > 1 ? 's' : ''}`
            : '';

        // Notify user with session and goals context
        const mins = Math.floor(effectiveRemaining / 60);
        vscode.window.showInformationMessage(
            `🔄 Restored: "${currentSession.topic}" (${mins} min)${goalsInfo}`,
            'End Session',
            'View Goals'
        ).then(action => {
            if (action === 'End Session') {
                endSession(true);
            } else if (action === 'View Goals') {
                vscode.commands.executeCommand('alex.showGoals');
            }
        });

        return true;
    } catch (err) {
        console.warn('Failed to restore session:', err);
        return false;
    }
}

/**
 * Get current session state for Alex tools
 */
export function getSessionState(): PersistedSessionState {
    return currentSession ? {
        active: true,
        topic: currentSession.topic,
        startTime: currentSession.startTime.toISOString(),
        duration: currentSession.duration,
        remaining: currentSession.remaining,
        isPaused: currentSession.isPaused,
        isBreak: currentSession.isBreak,
        pomodoroCount: currentSession.pomodoroCount,
        lastUpdated: new Date().toISOString()
    } : {
        active: false,
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Initialize session status bar item and restore any persisted session
 */
export function initializeSessionStatusBar(context: vscode.ExtensionContext): void {
    sessionStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        99 // Just left of the main Alex status bar
    );
    sessionStatusBarItem.command = 'alex.sessionActions';
    context.subscriptions.push(sessionStatusBarItem);

    // Initialize focus tracking status bar (shows when off-topic)
    focusTrackingStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        98 // Next to session timer
    );
    focusTrackingStatusBarItem.command = 'alex.acknowledgeTangent';
    context.subscriptions.push(focusTrackingStatusBarItem);

    // Register tangent acknowledgment command
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.acknowledgeTangent', acknowledgeTangent)
    );

    // Track file activity when session is active
    fileActivityListener = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (currentSession && !currentSession.isPaused && !currentSession.isBreak && editor) {
            trackFileActivity(editor.document.fileName);
        }
    });
    context.subscriptions.push(fileActivityListener);

    // Restore session from disk if it hasn't expired
    restoreSessionOnStartup().catch(err => {
        console.warn('Session restore failed:', err);
    });
}

/**
 * Track file activity and check if it's related to the focus topic
 */
function trackFileActivity(fileName: string): void {
    if (!currentSession) {return;}

    // Add to recent files (keep last 5)
    recentFiles.unshift(fileName);
    if (recentFiles.length > 5) {
        recentFiles.pop();
    }

    // Check if file seems related to focus topic
    const topicKeywords = extractKeywords(currentSession.topic);
    const fileKeywords = extractKeywords(path.basename(fileName));
    
    // Check for keyword overlap or common development patterns
    const hasOverlap = topicKeywords.some(tk => 
        fileKeywords.some(fk => fk.includes(tk) || tk.includes(fk))
    );

    // Also consider: if it's a common config file or test file, probably on-topic
    const commonPatterns = [
        /package\.json$/i,
        /tsconfig/i,
        /\.test\./i,
        /\.spec\./i,
        /\.md$/i,
        /\.json$/i,
        /\.gitignore$/i,
        /changelog/i,
    ];
    const isCommonFile = commonPatterns.some(p => p.test(fileName));

    // Update on-topic status
    if (hasOverlap || isCommonFile) {
        setOnTopic(true);
    } else {
        // After 3 unrelated files, show off-topic indicator
        const unrelatedCount = recentFiles.filter(f => {
            const fk = extractKeywords(path.basename(f));
            const overlap = topicKeywords.some(tk => 
                fk.some(k => k.includes(tk) || tk.includes(k))
            );
            const common = commonPatterns.some(p => p.test(f));
            return !overlap && !common;
        }).length;

        if (unrelatedCount >= 3) {
            setOnTopic(false);
        }
    }
}

/**
 * Extract keywords from a string for topic matching
 */
function extractKeywords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .filter(w => !['the', 'and', 'for', 'with', 'this', 'that', 'from'].includes(w));
}

/**
 * Set on-topic status and update status bar
 */
function setOnTopic(onTopic: boolean): void {
    if (isOnTopic === onTopic) {return;}
    
    isOnTopic = onTopic;
    updateFocusTrackingStatusBar();
}

/**
 * Update the focus tracking status bar
 */
function updateFocusTrackingStatusBar(): void {
    if (!focusTrackingStatusBarItem || !currentSession) {
        focusTrackingStatusBarItem?.hide();
        return;
    }

    if (currentSession.isPaused || currentSession.isBreak) {
        focusTrackingStatusBarItem.hide();
        return;
    }

    if (isOnTopic) {
        focusTrackingStatusBarItem.hide();
    } else {
        focusTrackingStatusBarItem.text = '$(warning) Off-topic?';
        focusTrackingStatusBarItem.tooltip = `You seem to have wandered from "${currentSession.topic}"\nClick to acknowledge this tangent`;
        focusTrackingStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        focusTrackingStatusBarItem.show();
    }
}

/**
 * Acknowledge a tangent and reset the off-topic indicator
 */
async function acknowledgeTangent(): Promise<void> {
    if (!currentSession) {return;}

    const action = await vscode.window.showQuickPick([
        { label: '$(check) This is related', description: 'Continue with current focus' },
        { label: '$(debug-pause) Quick tangent', description: 'I\'ll get back on track' },
        { label: '$(edit) Change focus topic', description: 'Update what I\'m working on' },
        { label: '$(debug-stop) End session', description: 'Stop the focus session' }
    ], {
        placeHolder: `Currently focusing on: "${currentSession.topic}"`
    });

    if (!action) {return;}

    if (action.label.includes('related') || action.label.includes('tangent')) {
        // Reset tracking
        recentFiles = [];
        isOnTopic = true;
        updateFocusTrackingStatusBar();
        
        if (action.label.includes('tangent')) {
            vscode.window.showInformationMessage(`👍 Quick tangent noted. Stay focused on "${currentSession.topic}"!`);
        }
    } else if (action.label.includes('Change focus')) {
        const newTopic = await vscode.window.showInputBox({
            prompt: 'What are you focusing on now?',
            value: currentSession.topic
        });
        if (newTopic) {
            currentSession.topic = newTopic;
            recentFiles = [];
            isOnTopic = true;
            updateSessionStatusBar();
            updateFocusTrackingStatusBar();
            saveSessionState();
            vscode.window.showInformationMessage(`🎯 Focus updated to: "${newTopic}"`);
        }
    } else if (action.label.includes('End')) {
        await endSession(true);
    }
}

/**
 * Save a session insight to episodic memory
 */
async function saveSessionInsightToEpisodic(
    topic: string,
    insight: string,
    durationMinutes: number,
    pomodoroCount: number
): Promise<string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return null;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    const sanitizedTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const fileName = `session-insight-${dateStr}-${timeStr}-${sanitizedTopic}.md`;
    
    const episodicPath = path.join(workspaceFolders[0].uri.fsPath, '.github', 'episodic');
    const filePath = path.join(episodicPath, fileName);

    const pomodoroInfo = pomodoroCount > 0 ? `\n**Pomodoros Completed**: ${pomodoroCount} 🍅` : '';
    const content = `# Session Insight: ${topic}

**Date**: ${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**Time**: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
**Duration**: ${durationMinutes} minutes${pomodoroInfo}
**Type**: Focus Session Consolidation

---

## Key Insight

${insight}

---

## Session Context

This insight was captured at the end of a focus session on "${topic}". The learning has been consolidated into episodic memory for future reference.

## Related

- Topic: \`${topic}\`
- Saved via: Alex Session Timer
- Project: ${workspaceFolders[0].name}
`;

    try {
        await fs.ensureDir(episodicPath);
        await fs.writeFile(filePath, content, 'utf8');
        return filePath;
    } catch (err) {
        console.error('Failed to save session insight:', err);
        return null;
    }
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

    // Reset focus tracking
    recentFiles = [];
    isOnTopic = true;
    updateFocusTrackingStatusBar();

    // Persist state for Alex visibility
    saveSessionState();

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
                saveSessionState();
            } else {
                await promptConsolidation(topic, pomodoroCount);
                currentSession = null;
                hideSessionStatusBar();
                saveSessionState();
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
                saveSessionState();
            } else {
                await promptConsolidation(topic, pomodoroCount);
                currentSession = null;
                hideSessionStatusBar();
                saveSessionState();
            }
        });
    } else {
        // Regular session ended
        await promptConsolidation(topic, 0);
        currentSession = null;
        hideSessionStatusBar();
        saveSessionState();
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
        // Prompt for insight directly
        const insight = await vscode.window.showInputBox({
            prompt: `What did you learn during "${topic}"?`,
            placeHolder: 'e.g., Discovered that async/await handles errors better than callbacks',
            ignoreFocusOut: true
        });
        
        if (insight) {
            // Save to episodic memory
            const savedPath = await saveSessionInsightToEpisodic(topic, insight, 0, pomodoroCount);
            if (savedPath) {
                const relativePath = vscode.workspace.asRelativePath(savedPath);
                vscode.window.showInformationMessage(
                    `✅ Insight saved to episodic memory: ${relativePath}`,
                    'Open File'
                ).then(action => {
                    if (action === 'Open File') {
                        vscode.workspace.openTextDocument(savedPath).then(doc => {
                            vscode.window.showTextDocument(doc);
                        });
                    }
                });
            } else {
                vscode.window.showWarningMessage('Could not save insight - no workspace folder found');
            }
        }
    } else if (action === 'Chat with @alex') {
        // Open Copilot Chat with context
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `@alex I just finished learning about ${topic}. Help me consolidate my insights.`,
            isPartialQuery: false
        });
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

    // Persist state for Alex visibility
    saveSessionState();

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
            'Open Chat',
            'Dismiss'
        ).then(async action => {
            if (action === 'Save Insight') {
                // Prompt for insight directly
                const insight = await vscode.window.showInputBox({
                    prompt: `What did you learn during "${topic}"?`,
                    placeHolder: 'e.g., Discovered that async/await handles errors better than callbacks',
                    ignoreFocusOut: true
                });
                
                if (insight) {
                    // Save to episodic memory
                    const savedPath = await saveSessionInsightToEpisodic(topic, insight, elapsed, pomodoroCount);
                    if (savedPath) {
                        const relativePath = vscode.workspace.asRelativePath(savedPath);
                        vscode.window.showInformationMessage(
                            `✅ Insight saved to episodic memory: ${relativePath}`,
                            'Open File'
                        ).then(openAction => {
                            if (openAction === 'Open File') {
                                vscode.workspace.openTextDocument(savedPath).then(doc => {
                                    vscode.window.showTextDocument(doc);
                                });
                            }
                        });
                    } else {
                        vscode.window.showWarningMessage('Could not save insight - no workspace folder found');
                    }
                }
            } else if (action === 'Open Chat') {
                vscode.commands.executeCommand('workbench.action.chat.open', {
                    query: '@alex What insights should I consolidate from my session?',
                    isPartialQuery: false
                });
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
    saveSessionState();
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
    saveSessionState();
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
    // Also hide focus tracking and reset state
    if (focusTrackingStatusBarItem) {
        focusTrackingStatusBarItem.hide();
    }
    recentFiles = [];
    isOnTopic = true;
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
