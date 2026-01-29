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

// Types
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
    progress: number; // 0-100
    milestones: {
        title: string;
        completed: boolean;
        date?: string;
    }[];
    created: string;
    updated: string;
}

// Session/Time Awareness Types
export interface Session {
    id: string;
    startTime: string;
    lastActivity: string;
    topic?: string;
    project?: string;
    checkIns: number;          // How many times user has been reminded
    breaksTaken: number;
    totalFocusMinutes: number; // Accumulated across breaks
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
        breakReminderMinutes: number;  // Default: 90
        enableTimeTracking: boolean;   // Default: true
    };
}

// Environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_GIST_ID = process.env.GITHUB_GIST_ID;

/**
 * Fetch the Gist content from GitHub API
 */
export async function fetchGist(context?: InvocationContext): Promise<GistResponse | null> {
    if (!GITHUB_GIST_ID) {
        context?.warn('GITHUB_GIST_ID not configured');
        return null;
    }

    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Alex-Cognitive-Architecture'
    };

    if (GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    try {
        const response = await fetch(
            `https://api.github.com/gists/${GITHUB_GIST_ID}`,
            { headers }
        );

        if (!response.ok) {
            context?.error(`Failed to fetch Gist: ${response.status} ${response.statusText}`);
            return null;
        }

        return await response.json() as GistResponse;
    } catch (error) {
        context?.error('Error fetching Gist:', error);
        return null;
    }
}

/**
 * Parse a markdown knowledge file into structured data
 */
function parseKnowledgeFile(filename: string, content: string): KnowledgeItem | null {
    // Extract frontmatter-style metadata if present
    const lines = content.split('\n');
    let title = filename.replace(/\.(md|json)$/, '').replace(/^(GK|GI|DK)-/, '');
    let category = 'general';
    let tags: string[] = [];
    let project: string | undefined;
    let date: string | undefined;

    // Look for title in first H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
        title = h1Match[1];
    }

    // Look for metadata in format: **Category**: value
    const categoryMatch = content.match(/\*\*Category\*\*:\s*(.+)/i);
    if (categoryMatch) {
        category = categoryMatch[1].toLowerCase().trim();
    }

    // Look for tags
    const tagsMatch = content.match(/\*\*Tags\*\*:\s*(.+)/i);
    if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(t => t.trim().toLowerCase());
    }

    // Look for project
    const projectMatch = content.match(/\*\*Project\*\*:\s*(.+)/i);
    if (projectMatch) {
        project = projectMatch[1].trim();
    }

    // Look for date (for insights)
    const dateMatch = content.match(/\*\*Date\*\*:\s*(.+)/i) || 
                      content.match(/\*\*Created\*\*:\s*(.+)/i);
    if (dateMatch) {
        date = dateMatch[1].trim();
    }

    // Extract date from GI filename (GI-2026-01-28-title.md)
    const filenameDate = filename.match(/GI-(\d{4}-\d{2}-\d{2})/);
    if (filenameDate) {
        date = filenameDate[1];
    }

    return {
        id: filename,
        title,
        category,
        content,
        source: filename,
        tags,
        project,
        date
    };
}

/**
 * Get all knowledge items (GK-*, DK-*, GI-* files) from the Gist
 */
export async function getKnowledge(context?: InvocationContext): Promise<KnowledgeItem[]> {
    const gist = await fetchGist(context);
    if (!gist) return [];

    const items: KnowledgeItem[] = [];
    
    for (const [filename, file] of Object.entries(gist.files)) {
        // Only process knowledge files
        if (!filename.match(/^(GK|DK|GI)-.*\.(md|json)$/)) continue;
        
        const content = file.content;
        if (!content) continue;

        const item = parseKnowledgeFile(filename, content);
        if (item) {
            items.push(item);
        }
    }

    return items;
}

/**
 * Search knowledge with relevance scoring
 */
export async function searchKnowledgeItems(
    query: string,
    category?: string,
    limit: number = 5,
    context?: InvocationContext
): Promise<{ results: KnowledgeItem[]; totalCount: number }> {
    const items = await getKnowledge(context);
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/);

    // Score each item
    const scored = items.map(item => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();

        // Exact title match (highest weight)
        if (titleLower.includes(queryLower)) {
            score += 10;
        }

        // Title word matches
        for (const term of queryTerms) {
            if (titleLower.includes(term)) score += 3;
            if (contentLower.includes(term)) score += 1;
            if (item.tags.some(t => t.includes(term))) score += 2;
            if (item.category.includes(term)) score += 2;
        }

        return { item, score };
    });

    // Filter by category if provided
    let filtered = scored;
    if (category) {
        filtered = scored.filter(s => s.item.category === category);
    }

    // Filter out zero scores
    filtered = filtered.filter(s => s.score > 0);

    // Sort by score descending
    filtered.sort((a, b) => b.score - a.score);

    const totalCount = filtered.length;
    const results = filtered.slice(0, limit).map(s => ({
        ...s.item,
        relevance: Math.min(s.score / 15, 1) // Normalize to 0-1
    }));

    return { results: results as any, totalCount };
}

/**
 * Get insights (GI-* files) filtered by date and project
 */
export async function getInsightItems(
    days: number = 30,
    project?: string,
    limit: number = 10,
    context?: InvocationContext
): Promise<KnowledgeItem[]> {
    const items = await getKnowledge(context);
    
    // Filter to insights only
    let insights = items.filter(item => item.source.startsWith('GI-'));

    // Filter by date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    insights = insights.filter(item => {
        if (!item.date) return true; // Include if no date
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
    });

    // Filter by project
    if (project) {
        insights = insights.filter(item => 
            item.project?.toLowerCase().includes(project.toLowerCase())
        );
    }

    // Sort by date descending
    insights.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return insights.slice(0, limit);
}

/**
 * Get user profile from Gist
 */
export async function getUserProfile(context?: InvocationContext): Promise<UserProfile | null> {
    const gist = await fetchGist(context);
    if (!gist) return null;

    // Look for user-profile.json or profile.json
    const profileFile = gist.files['user-profile.json'] || gist.files['profile.json'];
    
    if (profileFile?.content) {
        try {
            return JSON.parse(profileFile.content) as UserProfile;
        } catch {
            context?.warn('Failed to parse profile JSON');
        }
    }

    // Return default profile if not found
    return {
        name: 'User',
        formality: 'balanced',
        detailLevel: 'balanced',
        primaryTechnologies: [],
        learningGoals: [],
        expertiseAreas: [],
        currentProjects: []
    };
}

/**
 * Get notes from Gist
 */
export async function getNotes(
    type: string = 'all',
    status: string = 'active',
    project?: string,
    context?: InvocationContext
): Promise<Note[]> {
    const gist = await fetchGist(context);
    if (!gist) return [];

    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content) {
        return [];
    }

    try {
        let notes: Note[] = JSON.parse(notesFile.content);

        // Filter by type
        if (type !== 'all') {
            notes = notes.filter(n => n.type === type);
        }

        // Filter by status
        if (status !== 'all') {
            notes = notes.filter(n => n.status === status);
        }

        // Filter by project
        if (project) {
            notes = notes.filter(n => 
                n.triggers?.project?.toLowerCase().includes(project.toLowerCase())
            );
        }

        return notes;
    } catch {
        context?.warn('Failed to parse notes JSON');
        return [];
    }
}

/**
 * Get learning goals from Gist
 */
export async function getLearningGoals(
    status?: string,
    context?: InvocationContext
): Promise<LearningGoal[]> {
    const gist = await fetchGist(context);
    if (!gist) return [];

    const goalsFile = gist.files['learning-goals.json'];
    if (!goalsFile?.content) {
        return [];
    }

    try {
        let goals: LearningGoal[] = JSON.parse(goalsFile.content);

        // Filter by status
        if (status && status !== 'all') {
            goals = goals.filter(g => g.status === status);
        }

        return goals;
    } catch {
        context?.warn('Failed to parse learning goals JSON');
        return [];
    }
}

// ============================================================================
// WRITE OPERATIONS - Proactive Memory System
// ============================================================================

/**
 * Update a file in the Gist
 */
async function updateGistFile(
    filename: string,
    content: string,
    context?: InvocationContext
): Promise<boolean> {
    if (!GITHUB_GIST_ID || !GITHUB_TOKEN) {
        context?.warn('GITHUB_GIST_ID or GITHUB_TOKEN not configured for write operations');
        return false;
    }

    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Alex-Cognitive-Architecture',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(
            `https://api.github.com/gists/${GITHUB_GIST_ID}`,
            {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    files: {
                        [filename]: { content }
                    }
                })
            }
        );

        if (!response.ok) {
            context?.error(`Failed to update Gist file ${filename}: ${response.status}`);
            return false;
        }

        context?.log(`Successfully updated ${filename} in Gist`);
        return true;
    } catch (error) {
        context?.error('Error updating Gist:', error);
        return false;
    }
}

/**
 * Generate a unique ID for notes/reminders
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Add a new reminder to the Gist
 */
export async function addReminder(
    content: string,
    triggers?: {
        date?: string;
        keywords?: string[];
        project?: string;
    },
    context?: InvocationContext
): Promise<Note | null> {
    const gist = await fetchGist(context);
    if (!gist) return null;

    // Get existing notes
    const notesFile = gist.files['notes.json'];
    let notes: Note[] = [];
    
    if (notesFile?.content) {
        try {
            notes = JSON.parse(notesFile.content);
        } catch {
            context?.warn('Failed to parse existing notes, starting fresh');
        }
    }

    // Create new reminder
    const newReminder: Note = {
        id: generateId(),
        type: 'reminder',
        content,
        created: new Date().toISOString(),
        status: 'active',
        triggers
    };

    notes.push(newReminder);

    // Save back to Gist
    const success = await updateGistFile('notes.json', JSON.stringify(notes, null, 2), context);
    
    return success ? newReminder : null;
}

/**
 * Add a note or observation
 */
export async function addNote(
    content: string,
    type: 'note' | 'observation',
    project?: string,
    tags?: string[],
    context?: InvocationContext
): Promise<Note | null> {
    const gist = await fetchGist(context);
    if (!gist) return null;

    const notesFile = gist.files['notes.json'];
    let notes: Note[] = [];
    
    if (notesFile?.content) {
        try {
            notes = JSON.parse(notesFile.content);
        } catch {
            context?.warn('Failed to parse existing notes, starting fresh');
        }
    }

    const newNote: Note = {
        id: generateId(),
        type,
        content,
        created: new Date().toISOString(),
        status: 'active',
        triggers: project || tags ? {
            project,
            keywords: tags
        } : undefined
    };

    notes.push(newNote);

    const success = await updateGistFile('notes.json', JSON.stringify(notes, null, 2), context);
    
    return success ? newNote : null;
}

/**
 * Update reminder status (complete, snooze, etc.)
 */
export async function updateReminderStatus(
    id: string,
    status: 'active' | 'completed' | 'snoozed',
    context?: InvocationContext
): Promise<boolean> {
    const gist = await fetchGist(context);
    if (!gist) return false;

    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content) {
        context?.warn('No notes file found');
        return false;
    }

    try {
        const notes: Note[] = JSON.parse(notesFile.content);
        const noteIndex = notes.findIndex(n => n.id === id);
        
        if (noteIndex === -1) {
            context?.warn(`Note with id ${id} not found`);
            return false;
        }

        notes[noteIndex].status = status;

        return await updateGistFile('notes.json', JSON.stringify(notes, null, 2), context);
    } catch {
        context?.warn('Failed to update reminder status');
        return false;
    }
}

/**
 * Delete a note or reminder
 */
export async function deleteNote(
    id: string,
    context?: InvocationContext
): Promise<boolean> {
    const gist = await fetchGist(context);
    if (!gist) return false;

    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content) return false;

    try {
        let notes: Note[] = JSON.parse(notesFile.content);
        const originalLength = notes.length;
        notes = notes.filter(n => n.id !== id);

        if (notes.length === originalLength) {
            context?.warn(`Note with id ${id} not found`);
            return false;
        }

        return await updateGistFile('notes.json', JSON.stringify(notes, null, 2), context);
    } catch {
        return false;
    }
}

/**
 * Get due reminders (for proactive surfacing)
 */
export async function getDueReminders(
    keywords?: string[],
    project?: string,
    context?: InvocationContext
): Promise<Note[]> {
    const gist = await fetchGist(context);
    if (!gist) return [];

    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content) return [];

    try {
        const notes: Note[] = JSON.parse(notesFile.content);
        const now = new Date();

        return notes.filter(note => {
            if (note.type !== 'reminder' || note.status !== 'active') return false;

            // Check date trigger
            if (note.triggers?.date) {
                const triggerDate = new Date(note.triggers.date);
                if (triggerDate <= now) return true;
            }

            // Check keyword triggers
            if (note.triggers?.keywords && keywords) {
                const noteKeywords = note.triggers.keywords.map(k => k.toLowerCase());
                if (keywords.some(k => noteKeywords.includes(k.toLowerCase()))) {
                    return true;
                }
            }

            // Check project trigger
            if (note.triggers?.project && project) {
                if (note.triggers.project.toLowerCase() === project.toLowerCase()) {
                    return true;
                }
            }

            return false;
        });
    } catch {
        return [];
    }
}

// ============================================================================
// TIME AWARENESS - Session Tracking
// ============================================================================

const DEFAULT_BREAK_REMINDER_MINUTES = 90;
const MEDITATE_SUGGESTION_MINUTES = 120;
const WRAP_UP_SUGGESTION_MINUTES = 180;

/**
 * Get user's time awareness preferences
 */
async function getTimePreferences(context?: InvocationContext): Promise<{
    breakReminderMinutes: number;
    enableTimeTracking: boolean;
}> {
    const profile = await getUserProfile(context);
    
    // Could extend UserProfile to include these preferences
    // For now, use defaults
    return {
        breakReminderMinutes: DEFAULT_BREAK_REMINDER_MINUTES,
        enableTimeTracking: true
    };
}

/**
 * Get current session from Gist
 */
export async function getCurrentSession(context?: InvocationContext): Promise<Session | null> {
    const gist = await fetchGist(context);
    if (!gist) return null;

    const sessionFile = gist.files['current-session.json'];
    if (!sessionFile?.content) return null;

    try {
        return JSON.parse(sessionFile.content) as Session;
    } catch {
        context?.warn('Failed to parse session JSON');
        return null;
    }
}

/**
 * Start or resume a session
 */
export async function startSession(
    topic?: string,
    project?: string,
    context?: InvocationContext
): Promise<Session | null> {
    const existingSession = await getCurrentSession(context);
    
    if (existingSession) {
        // Update last activity on existing session
        existingSession.lastActivity = new Date().toISOString();
        if (topic) existingSession.topic = topic;
        if (project) existingSession.project = project;
        
        const success = await updateGistFile(
            'current-session.json',
            JSON.stringify(existingSession, null, 2),
            context
        );
        return success ? existingSession : null;
    }

    // Create new session
    const newSession: Session = {
        id: `session-${Date.now()}`,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        topic,
        project,
        checkIns: 0,
        breaksTaken: 0,
        totalFocusMinutes: 0
    };

    const success = await updateGistFile(
        'current-session.json',
        JSON.stringify(newSession, null, 2),
        context
    );

    return success ? newSession : null;
}

/**
 * Calculate time-based suggestion
 */
function calculateSuggestion(
    durationMinutes: number,
    checkIns: number,
    breaksTaken: number,
    breakReminderMinutes: number
): { type: 'break' | 'meditate' | 'wrap-up' | 'none'; message: string } {
    // Don't nag - check if we've already suggested recently
    const timeSinceLastCheckIn = durationMinutes / (checkIns + 1);
    
    if (durationMinutes >= WRAP_UP_SUGGESTION_MINUTES && checkIns < 3) {
        return {
            type: 'wrap-up',
            message: `We've been working for ${Math.round(durationMinutes / 60)} hours! This might be a good time to wrap up, or would you like to do a quick meditation to consolidate what we've learned?`
        };
    }

    if (durationMinutes >= MEDITATE_SUGGESTION_MINUTES && checkIns < 2) {
        return {
            type: 'meditate',
            message: `We've been at this for ${Math.round(durationMinutes)} minutes. Want to take a moment to meditate and consolidate our learnings before continuing?`
        };
    }

    if (durationMinutes >= breakReminderMinutes && timeSinceLastCheckIn >= breakReminderMinutes * 0.8) {
        return {
            type: 'break',
            message: `You've been focused for ${Math.round(durationMinutes)} minutes. A short break might help you stay sharp! ☕`
        };
    }

    return { type: 'none', message: '' };
}

/**
 * Get session status with time-based suggestions
 */
export async function getSessionStatus(context?: InvocationContext): Promise<SessionStatus> {
    const preferences = await getTimePreferences(context);
    
    if (!preferences.enableTimeTracking) {
        return {
            active: false,
            durationMinutes: 0,
            preferences
        };
    }

    const session = await getCurrentSession(context);
    
    if (!session) {
        return {
            active: false,
            durationMinutes: 0,
            preferences
        };
    }

    const startTime = new Date(session.startTime);
    const now = new Date();
    const durationMinutes = Math.round((now.getTime() - startTime.getTime()) / 60000);

    const suggestion = calculateSuggestion(
        durationMinutes,
        session.checkIns,
        session.breaksTaken,
        preferences.breakReminderMinutes
    );

    return {
        active: true,
        session,
        durationMinutes,
        suggestion: suggestion.type !== 'none' ? suggestion : undefined,
        preferences
    };
}

/**
 * Record that a check-in/suggestion was shown
 */
export async function recordCheckIn(context?: InvocationContext): Promise<boolean> {
    const session = await getCurrentSession(context);
    if (!session) return false;

    session.checkIns++;
    session.lastActivity = new Date().toISOString();

    return await updateGistFile(
        'current-session.json',
        JSON.stringify(session, null, 2),
        context
    );
}

/**
 * Record a break taken
 */
export async function recordBreak(
    breakMinutes: number = 0,
    context?: InvocationContext
): Promise<boolean> {
    const session = await getCurrentSession(context);
    if (!session) return false;

    // Add focus time up to this point
    const lastActivity = new Date(session.lastActivity);
    const now = new Date();
    const focusMinutes = Math.round((now.getTime() - lastActivity.getTime()) / 60000);
    
    session.totalFocusMinutes += focusMinutes;
    session.breaksTaken++;
    session.lastActivity = new Date().toISOString();

    return await updateGistFile(
        'current-session.json',
        JSON.stringify(session, null, 2),
        context
    );
}

/**
 * End the current session
 */
export async function endSession(context?: InvocationContext): Promise<{
    session: Session;
    totalMinutes: number;
    focusMinutes: number;
} | null> {
    const session = await getCurrentSession(context);
    if (!session) return null;

    const startTime = new Date(session.startTime);
    const now = new Date();
    const totalMinutes = Math.round((now.getTime() - startTime.getTime()) / 60000);
    
    // Calculate final focus time
    const lastActivity = new Date(session.lastActivity);
    const finalFocusMinutes = Math.round((now.getTime() - lastActivity.getTime()) / 60000);
    const focusMinutes = session.totalFocusMinutes + finalFocusMinutes;

    // Archive session to history (optional - could store in sessions-history.json)
    // For now, just clear the current session
    await updateGistFile('current-session.json', '{}', context);

    return {
        session,
        totalMinutes,
        focusMinutes
    };
}
