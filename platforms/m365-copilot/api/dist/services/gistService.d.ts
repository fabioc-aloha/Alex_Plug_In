/**
 * GitHub Gist Service
 *
 * Fetches and parses knowledge from the user's GitHub Gist,
 * which serves as the cloud sync storage for Alex's global knowledge.
 *
 * Structure expected in Gist:
 * - patterns/GK-*.md   - Global knowledge patterns (reusable)
 * - insights/GI-*.md   - Timestamped insights from projects
 * - user-profile.json  - User preferences and profile
 * - notes.json         - Notes, reminders, observations
 * - learning-goals.json - Learning objectives and progress
 */
import { InvocationContext } from '@azure/functions';
export interface GistFile {
    filename: string;
    type: string;
    language: string | null;
    raw_url: string;
    size: number;
    content?: string;
}
export interface GistResponse {
    id: string;
    description: string;
    files: Record<string, GistFile>;
    updated_at: string;
}
export interface KnowledgeItem {
    id: string;
    title: string;
    category: string;
    content: string;
    source: string;
    tags: string[];
    project?: string;
    date?: string;
}
export interface UserProfile {
    name: string;
    nickname?: string;
    formality: 'casual' | 'balanced' | 'formal';
    detailLevel: 'brief' | 'balanced' | 'detailed';
    primaryTechnologies: string[];
    learningGoals: string[];
    expertiseAreas: string[];
    currentProjects: string[];
    email?: string;
    role?: string;
}
export interface Note {
    id: string;
    type: 'reminder' | 'note' | 'observation';
    content: string;
    created: string;
    status: 'active' | 'completed' | 'snoozed';
    triggers?: {
        date?: string;
        keywords?: string[];
        project?: string;
    };
}
export interface LearningGoal {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
    milestones: {
        title: string;
        completed: boolean;
        date?: string;
    }[];
    created: string;
    updated: string;
}
export interface Session {
    id: string;
    startTime: string;
    lastActivity: string;
    topic?: string;
    project?: string;
    checkIns: number;
    breaksTaken: number;
    totalFocusMinutes: number;
}
export interface SessionStatus {
    active: boolean;
    session?: Session;
    durationMinutes: number;
    suggestion?: {
        type: 'break' | 'meditate' | 'wrap-up' | 'none';
        message: string;
    };
    preferences: {
        breakReminderMinutes: number;
        enableTimeTracking: boolean;
    };
}
/**
 * Fetch the Gist content from GitHub API
 */
export declare function fetchGist(context?: InvocationContext): Promise<GistResponse | null>;
/**
 * Get all knowledge items (GK-*, DK-*, GI-* files) from the Gist
 */
export declare function getKnowledge(context?: InvocationContext): Promise<KnowledgeItem[]>;
/**
 * Search knowledge with relevance scoring
 */
export declare function searchKnowledgeItems(query: string, category?: string, limit?: number, context?: InvocationContext): Promise<{
    results: KnowledgeItem[];
    totalCount: number;
}>;
/**
 * Get insights (GI-* files) filtered by date and project
 */
export declare function getInsightItems(days?: number, project?: string, limit?: number, context?: InvocationContext): Promise<KnowledgeItem[]>;
/**
 * Get user profile from Gist
 */
export declare function getUserProfile(context?: InvocationContext): Promise<UserProfile | null>;
/**
 * Get notes from Gist
 */
export declare function getNotes(type?: string, status?: string, project?: string, context?: InvocationContext): Promise<Note[]>;
/**
 * Get learning goals from Gist
 */
export declare function getLearningGoals(status?: string, context?: InvocationContext): Promise<LearningGoal[]>;
/**
 * Add a new reminder to the Gist
 */
export declare function addReminder(content: string, triggers?: {
    date?: string;
    keywords?: string[];
    project?: string;
}, context?: InvocationContext): Promise<Note | null>;
/**
 * Add a note or observation
 */
export declare function addNote(content: string, type: 'note' | 'observation', project?: string, tags?: string[], context?: InvocationContext): Promise<Note | null>;
/**
 * Update reminder status (complete, snooze, etc.)
 */
export declare function updateReminderStatus(id: string, status: 'active' | 'completed' | 'snoozed', context?: InvocationContext): Promise<boolean>;
/**
 * Delete a note or reminder
 */
export declare function deleteNote(id: string, context?: InvocationContext): Promise<boolean>;
/**
 * Get due reminders (for proactive surfacing)
 */
export declare function getDueReminders(keywords?: string[], project?: string, context?: InvocationContext): Promise<Note[]>;
/**
 * Get current session from Gist
 */
export declare function getCurrentSession(context?: InvocationContext): Promise<Session | null>;
/**
 * Start or resume a session
 */
export declare function startSession(topic?: string, project?: string, context?: InvocationContext): Promise<Session | null>;
/**
 * Get session status with time-based suggestions
 */
export declare function getSessionStatus(context?: InvocationContext): Promise<SessionStatus>;
/**
 * Record that a check-in/suggestion was shown
 */
export declare function recordCheckIn(context?: InvocationContext): Promise<boolean>;
/**
 * Record a break taken
 */
export declare function recordBreak(breakMinutes?: number, context?: InvocationContext): Promise<boolean>;
/**
 * End the current session
 */
export declare function endSession(context?: InvocationContext): Promise<{
    session: Session;
    totalMinutes: number;
    focusMinutes: number;
} | null>;
//# sourceMappingURL=gistService.d.ts.map