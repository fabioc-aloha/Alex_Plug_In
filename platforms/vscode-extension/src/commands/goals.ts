import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getAlexGlobalPath } from '../chat/globalKnowledge';

/**
 * Learning Goals - Track daily/weekly learning goals with visual progress
 * 
 * Features:
 * - Set daily/weekly learning goals
 * - Track progress with visual indicators
 * - Persist goals across sessions
 * - Auto-celebrate goal completion
 */

export interface LearningGoal {
    id: string;
    title: string;
    description?: string;
    targetType: 'daily' | 'weekly' | 'custom';
    targetCount: number;
    currentCount: number;
    unit: string; // e.g., "sessions", "insights", "minutes"
    createdAt: string;
    dueAt?: string;
    completedAt?: string;
    tags?: string[];
}

export interface GoalsData {
    version: string;
    goals: LearningGoal[];
    history: CompletedGoal[];
    streakDays: number;
    lastActiveDate?: string;
}

export interface CompletedGoal {
    id: string;
    title: string;
    completedAt: string;
    targetCount: number;
    actualCount: number;
}

const GOALS_FILE = 'learning-goals.json';
const DEFAULT_GOALS_DATA: GoalsData = {
    version: '1.0.0',
    goals: [],
    history: [],
    streakDays: 0
};

/**
 * Get the path to the goals file
 */
async function getGoalsFilePath(): Promise<string> {
    const globalPath = await getAlexGlobalPath();
    return path.join(globalPath, GOALS_FILE);
}

/**
 * Load goals from disk
 */
async function loadGoals(): Promise<GoalsData> {
    try {
        const filePath = await getGoalsFilePath();
        if (await fs.pathExists(filePath)) {
            const data = await fs.readJson(filePath);
            return { ...DEFAULT_GOALS_DATA, ...data };
        }
    } catch (err) {
        console.warn('Failed to load learning goals:', err);
    }
    return { ...DEFAULT_GOALS_DATA };
}

/**
 * Save goals to disk
 */
async function saveGoals(data: GoalsData): Promise<void> {
    try {
        const filePath = await getGoalsFilePath();
        await fs.writeJson(filePath, data, { spaces: 2 });
    } catch (err) {
        console.error('Failed to save learning goals:', err);
        throw err;
    }
}

/**
 * Update streak tracking
 */
function updateStreak(data: GoalsData): GoalsData {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (!data.lastActiveDate) {
        data.streakDays = 1;
    } else if (data.lastActiveDate === today) {
        // Same day, no change
    } else if (data.lastActiveDate === yesterday) {
        data.streakDays++;
    } else {
        // Streak broken
        data.streakDays = 1;
    }
    
    data.lastActiveDate = today;
    return data;
}

/**
 * Create a new learning goal
 */
export async function createGoal(
    title: string,
    targetType: 'daily' | 'weekly' | 'custom' = 'daily',
    targetCount: number = 1,
    unit: string = 'sessions',
    description?: string,
    tags?: string[]
): Promise<LearningGoal> {
    const data = await loadGoals();
    
    const goal: LearningGoal = {
        id: `goal-${Date.now()}`,
        title,
        description,
        targetType,
        targetCount,
        currentCount: 0,
        unit,
        createdAt: new Date().toISOString(),
        dueAt: calculateDueDate(targetType),
        tags
    };
    
    data.goals.push(goal);
    await saveGoals(updateStreak(data));
    
    return goal;
}

/**
 * Calculate due date based on goal type
 */
function calculateDueDate(targetType: 'daily' | 'weekly' | 'custom'): string | undefined {
    const now = new Date();
    
    if (targetType === 'daily') {
        // End of today
        const eod = new Date(now);
        eod.setHours(23, 59, 59, 999);
        return eod.toISOString();
    } else if (targetType === 'weekly') {
        // End of week (Sunday)
        const eow = new Date(now);
        const daysUntilSunday = 7 - eow.getDay();
        eow.setDate(eow.getDate() + daysUntilSunday);
        eow.setHours(23, 59, 59, 999);
        return eow.toISOString();
    }
    
    return undefined;
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
    goalId: string,
    increment: number = 1
): Promise<LearningGoal | null> {
    const data = await loadGoals();
    const goal = data.goals.find(g => g.id === goalId);
    
    if (!goal) {
        return null;
    }
    
    goal.currentCount += increment;
    
    // Check for completion
    if (goal.currentCount >= goal.targetCount && !goal.completedAt) {
        goal.completedAt = new Date().toISOString();
        
        // Move to history
        data.history.unshift({
            id: goal.id,
            title: goal.title,
            completedAt: goal.completedAt,
            targetCount: goal.targetCount,
            actualCount: goal.currentCount
        });
        
        // Keep only last 100 completed goals in history
        if (data.history.length > 100) {
            data.history = data.history.slice(0, 100);
        }
        
        // Show celebration
        vscode.window.showInformationMessage(
            `🎉 Goal achieved: "${goal.title}"! You've completed ${goal.currentCount}/${goal.targetCount} ${goal.unit}.`,
            'Set New Goal'
        ).then(action => {
            if (action === 'Set New Goal') {
                vscode.commands.executeCommand('alex.createGoal');
            }
        });
    }
    
    await saveGoals(updateStreak(data));
    return goal;
}

/**
 * Get all active goals
 */
export async function getActiveGoals(): Promise<LearningGoal[]> {
    const data = await loadGoals();
    const now = new Date();
    
    // Filter active (not completed and not expired) goals
    return data.goals.filter(goal => {
        if (goal.completedAt) {
            return false;
        }
        if (goal.dueAt && new Date(goal.dueAt) < now) {
            return false; // Expired
        }
        return true;
    });
}

/**
 * Get goals summary for display
 */
export async function getGoalsSummary(): Promise<{
    activeGoals: LearningGoal[];
    completedToday: number;
    streakDays: number;
    totalCompleted: number;
}> {
    const data = await loadGoals();
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const activeGoals = data.goals.filter(goal => {
        if (goal.completedAt) {
            return false;
        }
        if (goal.dueAt && new Date(goal.dueAt) < now) {
            return false;
        }
        return true;
    });
    
    const completedToday = data.history.filter(goal => {
        const completedDate = new Date(goal.completedAt);
        return completedDate >= todayStart;
    }).length;
    
    return {
        activeGoals,
        completedToday,
        streakDays: data.streakDays,
        totalCompleted: data.history.length
    };
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string): Promise<boolean> {
    const data = await loadGoals();
    const index = data.goals.findIndex(g => g.id === goalId);
    
    if (index === -1) {
        return false;
    }
    
    data.goals.splice(index, 1);
    await saveGoals(data);
    return true;
}

/**
 * Clean up expired daily/weekly goals
 */
export async function cleanupExpiredGoals(): Promise<number> {
    const data = await loadGoals();
    const now = new Date();
    let removed = 0;
    
    data.goals = data.goals.filter(goal => {
        if (goal.completedAt) {
            return false; // Remove completed goals from active list
        }
        if (goal.dueAt && new Date(goal.dueAt) < now) {
            removed++;
            return false; // Remove expired goals
        }
        return true;
    });
    
    if (removed > 0) {
        await saveGoals(data);
    }
    
    return removed;
}

/**
 * Show goal creation dialog
 */
export async function showCreateGoalDialog(): Promise<LearningGoal | null> {
    // Get goal title
    const title = await vscode.window.showInputBox({
        prompt: 'What do you want to achieve?',
        placeHolder: 'e.g., Complete 3 learning sessions, Save 5 insights',
        title: '🎯 Create Learning Goal'
    });
    
    if (!title) {
        return null;
    }
    
    // Get goal type
    const typeOptions: vscode.QuickPickItem[] = [
        { label: '📅 Daily Goal', description: 'Resets at end of day', detail: 'Best for building daily habits' },
        { label: '📆 Weekly Goal', description: 'Resets at end of week', detail: 'Best for larger achievements' },
        { label: '🎯 Custom Goal', description: 'No automatic reset', detail: 'Best for specific milestones' }
    ];
    
    const typeSelection = await vscode.window.showQuickPick(typeOptions, {
        placeHolder: 'Select goal duration',
        title: '⏱️ Goal Type'
    });
    
    if (!typeSelection) {
        return null;
    }
    
    const targetType: 'daily' | 'weekly' | 'custom' = 
        typeSelection.label.includes('Daily') ? 'daily' :
        typeSelection.label.includes('Weekly') ? 'weekly' : 'custom';
    
    // Get target count
    const countStr = await vscode.window.showInputBox({
        prompt: 'How many times?',
        placeHolder: '3',
        value: '1',
        validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 100) {
                return 'Enter a number between 1 and 100';
            }
            return null;
        },
        title: '🔢 Target Count'
    });
    
    if (!countStr) {
        return null;
    }
    
    const targetCount = parseInt(countStr);
    
    // Get unit
    const unitOptions: vscode.QuickPickItem[] = [
        { label: '🎯 sessions', description: 'Learning sessions completed' },
        { label: '💡 insights', description: 'Insights saved to knowledge base' },
        { label: '⏱️ minutes', description: 'Minutes of focused learning' },
        { label: '📚 topics', description: 'Topics learned or reviewed' },
        { label: '✏️ Other...', description: 'Custom unit' }
    ];
    
    const unitSelection = await vscode.window.showQuickPick(unitOptions, {
        placeHolder: 'What are you counting?',
        title: '📊 Goal Unit'
    });
    
    if (!unitSelection) {
        return null;
    }
    
    let unit: string;
    if (unitSelection.label.includes('Other')) {
        const customUnit = await vscode.window.showInputBox({
            prompt: 'Enter custom unit',
            placeHolder: 'e.g., commits, reviews, exercises'
        });
        if (!customUnit) {
            return null;
        }
        unit = customUnit;
    } else {
        unit = unitSelection.label.split(' ')[1]; // Extract unit from "🎯 sessions"
    }
    
    // Create the goal
    const goal = await createGoal(title, targetType, targetCount, unit);
    
    vscode.window.showInformationMessage(
        `🎯 Goal created: "${title}" - ${targetCount} ${unit}`,
        'View Goals'
    ).then(action => {
        if (action === 'View Goals') {
            vscode.commands.executeCommand('alex.showGoals');
        }
    });
    
    return goal;
}

/**
 * Show goals quick pick with actions
 */
export async function showGoalsQuickPick(): Promise<void> {
    const summary = await getGoalsSummary();
    
    if (summary.activeGoals.length === 0) {
        const action = await vscode.window.showInformationMessage(
            '📋 No active goals. Would you like to create one?',
            'Create Goal',
            'Dismiss'
        );
        
        if (action === 'Create Goal') {
            await showCreateGoalDialog();
        }
        return;
    }
    
    const items: (vscode.QuickPickItem & { goal?: LearningGoal })[] = [
        { label: '➕ Create New Goal', description: 'Set a new learning goal' },
        { label: '', kind: vscode.QuickPickItemKind.Separator },
        ...summary.activeGoals.map(goal => {
            const progress = Math.round((goal.currentCount / goal.targetCount) * 100);
            const progressBar = getProgressBar(progress);
            const dueText = goal.dueAt ? ` • Due ${formatRelativeTime(new Date(goal.dueAt))}` : '';
            
            return {
                label: `${goal.title}`,
                description: `${progressBar} ${goal.currentCount}/${goal.targetCount} ${goal.unit}${dueText}`,
                detail: goal.description,
                goal
            };
        })
    ];
    
    // Add stats footer
    items.push(
        { label: '', kind: vscode.QuickPickItemKind.Separator },
        { label: `🔥 ${summary.streakDays} day streak • ✅ ${summary.completedToday} completed today`, description: `${summary.totalCompleted} total goals achieved` }
    );
    
    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: '🎯 Learning Goals',
        title: `Learning Goals (${summary.activeGoals.length} active)`
    });
    
    if (!selected) {
        return;
    }
    
    if (selected.label.includes('Create New Goal')) {
        await showCreateGoalDialog();
        return;
    }
    
    if (selected.goal) {
        // Show goal actions
        const actions: vscode.QuickPickItem[] = [
            { label: '➕ Increment Progress', description: 'Add 1 to progress count' },
            { label: '✏️ Set Progress', description: 'Manually set progress count' },
            { label: '🗑️ Delete Goal', description: 'Remove this goal' }
        ];
        
        const action = await vscode.window.showQuickPick(actions, {
            placeHolder: `Actions for "${selected.goal.title}"`,
            title: '🎯 Goal Actions'
        });
        
        if (action?.label.includes('Increment')) {
            await updateGoalProgress(selected.goal.id, 1);
            vscode.window.showInformationMessage(
                `✓ Progress updated: ${selected.goal.currentCount + 1}/${selected.goal.targetCount} ${selected.goal.unit}`
            );
        } else if (action?.label.includes('Set Progress')) {
            const newProgress = await vscode.window.showInputBox({
                prompt: 'Enter new progress count',
                value: String(selected.goal.currentCount),
                validateInput: (value) => {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 0) {
                        return 'Enter a valid number';
                    }
                    return null;
                }
            });
            if (newProgress !== undefined) {
                const diff = parseInt(newProgress) - selected.goal.currentCount;
                await updateGoalProgress(selected.goal.id, diff);
            }
        } else if (action?.label.includes('Delete')) {
            const confirm = await vscode.window.showWarningMessage(
                `Delete goal "${selected.goal.title}"?`,
                { modal: true },
                'Delete'
            );
            if (confirm === 'Delete') {
                await deleteGoal(selected.goal.id);
                vscode.window.showInformationMessage('Goal deleted');
            }
        }
    }
}

/**
 * Generate ASCII progress bar
 */
function getProgressBar(percent: number): string {
    const filled = Math.round(percent / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Format relative time
 */
function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 0) {
        return 'overdue';
    }
    if (diffMins < 60) {
        return `${diffMins}m`;
    }
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) {
        return `${diffHours}h`;
    }
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d`;
}

/**
 * Auto-increment goal progress based on activity
 */
export async function autoIncrementGoals(activityType: 'session' | 'insight' | 'minute'): Promise<void> {
    const goals = await getActiveGoals();
    
    for (const goal of goals) {
        // Match activity type to goal unit
        if (
            (activityType === 'session' && goal.unit === 'sessions') ||
            (activityType === 'insight' && goal.unit === 'insights') ||
            (activityType === 'minute' && goal.unit === 'minutes')
        ) {
            await updateGoalProgress(goal.id, 1);
        }
    }
}

/**
 * Register goals commands
 */
export function registerGoalsCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.createGoal', async () => {
            await showCreateGoalDialog();
        }),
        
        vscode.commands.registerCommand('alex.showGoals', async () => {
            await showGoalsQuickPick();
        }),
        
        vscode.commands.registerCommand('alex.incrementGoal', async () => {
            const goals = await getActiveGoals();
            if (goals.length === 0) {
                vscode.window.showInformationMessage('No active goals to increment');
                return;
            }
            
            if (goals.length === 1) {
                await updateGoalProgress(goals[0].id, 1);
                vscode.window.showInformationMessage(
                    `✓ Progress: ${goals[0].currentCount + 1}/${goals[0].targetCount} ${goals[0].unit}`
                );
            } else {
                await showGoalsQuickPick();
            }
        })
    );
    
    // Run cleanup on activation
    cleanupExpiredGoals();
}
