"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGist = fetchGist;
exports.getKnowledge = getKnowledge;
exports.searchKnowledgeItems = searchKnowledgeItems;
exports.getInsightItems = getInsightItems;
exports.getUserProfile = getUserProfile;
exports.getNotes = getNotes;
exports.getLearningGoals = getLearningGoals;
exports.addReminder = addReminder;
exports.addNote = addNote;
exports.updateReminderStatus = updateReminderStatus;
exports.deleteNote = deleteNote;
exports.getDueReminders = getDueReminders;
exports.getCurrentSession = getCurrentSession;
exports.startSession = startSession;
exports.getSessionStatus = getSessionStatus;
exports.recordCheckIn = recordCheckIn;
exports.recordBreak = recordBreak;
exports.endSession = endSession;
// Environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_GIST_ID = process.env.GITHUB_GIST_ID;
/**
 * Fetch the Gist content from GitHub API
 */
async function fetchGist(context) {
    if (!GITHUB_GIST_ID) {
        context?.warn('GITHUB_GIST_ID not configured');
        return null;
    }
    const headers = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Alex-Cognitive-Architecture'
    };
    if (GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    try {
        const response = await fetch(`https://api.github.com/gists/${GITHUB_GIST_ID}`, { headers });
        if (!response.ok) {
            context?.error(`Failed to fetch Gist: ${response.status} ${response.statusText}`);
            return null;
        }
        return await response.json();
    }
    catch (error) {
        context?.error('Error fetching Gist:', error);
        return null;
    }
}
/**
 * Parse a markdown knowledge file into structured data
 */
function parseKnowledgeFile(filename, content) {
    // Extract frontmatter-style metadata if present
    const lines = content.split('\n');
    let title = filename.replace(/\.(md|json)$/, '').replace(/^(GK|GI|DK)-/, '');
    let category = 'general';
    let tags = [];
    let project;
    let date;
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
async function getKnowledge(context) {
    const gist = await fetchGist(context);
    if (!gist)
        return [];
    const items = [];
    for (const [filename, file] of Object.entries(gist.files)) {
        // Only process knowledge files
        if (!filename.match(/^(GK|DK|GI)-.*\.(md|json)$/))
            continue;
        const content = file.content;
        if (!content)
            continue;
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
async function searchKnowledgeItems(query, category, limit = 5, context) {
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
            if (titleLower.includes(term))
                score += 3;
            if (contentLower.includes(term))
                score += 1;
            if (item.tags.some(t => t.includes(term)))
                score += 2;
            if (item.category.includes(term))
                score += 2;
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
    return { results: results, totalCount };
}
/**
 * Get insights (GI-* files) filtered by date and project
 */
async function getInsightItems(days = 30, project, limit = 10, context) {
    const items = await getKnowledge(context);
    // Filter to insights only
    let insights = items.filter(item => item.source.startsWith('GI-'));
    // Filter by date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    insights = insights.filter(item => {
        if (!item.date)
            return true; // Include if no date
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
    });
    // Filter by project
    if (project) {
        insights = insights.filter(item => item.project?.toLowerCase().includes(project.toLowerCase()));
    }
    // Sort by date descending
    insights.sort((a, b) => {
        if (!a.date)
            return 1;
        if (!b.date)
            return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return insights.slice(0, limit);
}
/**
 * Get user profile from Gist
 */
async function getUserProfile(context) {
    const gist = await fetchGist(context);
    if (!gist)
        return null;
    // Look for user-profile.json or profile.json
    const profileFile = gist.files['user-profile.json'] || gist.files['profile.json'];
    if (profileFile?.content) {
        try {
            return JSON.parse(profileFile.content);
        }
        catch {
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
async function getNotes(type = 'all', status = 'active', project, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return [];
    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content) {
        return [];
    }
    try {
        let notes = JSON.parse(notesFile.content);
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
            notes = notes.filter(n => n.triggers?.project?.toLowerCase().includes(project.toLowerCase()));
        }
        return notes;
    }
    catch {
        context?.warn('Failed to parse notes JSON');
        return [];
    }
}
/**
 * Get learning goals from Gist
 */
async function getLearningGoals(status, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return [];
    const goalsFile = gist.files['learning-goals.json'];
    if (!goalsFile?.content) {
        return [];
    }
    try {
        let goals = JSON.parse(goalsFile.content);
        // Filter by status
        if (status && status !== 'all') {
            goals = goals.filter(g => g.status === status);
        }
        return goals;
    }
    catch {
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
async function updateGistFile(filename, content, context) {
    if (!GITHUB_GIST_ID || !GITHUB_TOKEN) {
        context?.warn('GITHUB_GIST_ID or GITHUB_TOKEN not configured for write operations');
        return false;
    }
    const headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Alex-Cognitive-Architecture',
        'Content-Type': 'application/json'
    };
    try {
        const response = await fetch(`https://api.github.com/gists/${GITHUB_GIST_ID}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                files: {
                    [filename]: { content }
                }
            })
        });
        if (!response.ok) {
            context?.error(`Failed to update Gist file ${filename}: ${response.status}`);
            return false;
        }
        context?.log(`Successfully updated ${filename} in Gist`);
        return true;
    }
    catch (error) {
        context?.error('Error updating Gist:', error);
        return false;
    }
}
/**
 * Generate a unique ID for notes/reminders
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
/**
 * Add a new reminder to the Gist
 */
async function addReminder(content, triggers, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return null;
    // Get existing notes
    const notesFile = gist.files['notes.json'];
    let notes = [];
    if (notesFile?.content) {
        try {
            notes = JSON.parse(notesFile.content);
        }
        catch {
            context?.warn('Failed to parse existing notes, starting fresh');
        }
    }
    // Create new reminder
    const newReminder = {
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
async function addNote(content, type, project, tags, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return null;
    const notesFile = gist.files['notes.json'];
    let notes = [];
    if (notesFile?.content) {
        try {
            notes = JSON.parse(notesFile.content);
        }
        catch {
            context?.warn('Failed to parse existing notes, starting fresh');
        }
    }
    const newNote = {
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
async function updateReminderStatus(id, status, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return false;
    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content) {
        context?.warn('No notes file found');
        return false;
    }
    try {
        const notes = JSON.parse(notesFile.content);
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex === -1) {
            context?.warn(`Note with id ${id} not found`);
            return false;
        }
        notes[noteIndex].status = status;
        return await updateGistFile('notes.json', JSON.stringify(notes, null, 2), context);
    }
    catch {
        context?.warn('Failed to update reminder status');
        return false;
    }
}
/**
 * Delete a note or reminder
 */
async function deleteNote(id, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return false;
    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content)
        return false;
    try {
        let notes = JSON.parse(notesFile.content);
        const originalLength = notes.length;
        notes = notes.filter(n => n.id !== id);
        if (notes.length === originalLength) {
            context?.warn(`Note with id ${id} not found`);
            return false;
        }
        return await updateGistFile('notes.json', JSON.stringify(notes, null, 2), context);
    }
    catch {
        return false;
    }
}
/**
 * Get due reminders (for proactive surfacing)
 */
async function getDueReminders(keywords, project, context) {
    const gist = await fetchGist(context);
    if (!gist)
        return [];
    const notesFile = gist.files['notes.json'];
    if (!notesFile?.content)
        return [];
    try {
        const notes = JSON.parse(notesFile.content);
        const now = new Date();
        return notes.filter(note => {
            if (note.type !== 'reminder' || note.status !== 'active')
                return false;
            // Check date trigger
            if (note.triggers?.date) {
                const triggerDate = new Date(note.triggers.date);
                if (triggerDate <= now)
                    return true;
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
    }
    catch {
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
async function getTimePreferences(context) {
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
async function getCurrentSession(context) {
    const gist = await fetchGist(context);
    if (!gist)
        return null;
    const sessionFile = gist.files['current-session.json'];
    if (!sessionFile?.content)
        return null;
    try {
        return JSON.parse(sessionFile.content);
    }
    catch {
        context?.warn('Failed to parse session JSON');
        return null;
    }
}
/**
 * Start or resume a session
 */
async function startSession(topic, project, context) {
    const existingSession = await getCurrentSession(context);
    if (existingSession) {
        // Update last activity on existing session
        existingSession.lastActivity = new Date().toISOString();
        if (topic)
            existingSession.topic = topic;
        if (project)
            existingSession.project = project;
        const success = await updateGistFile('current-session.json', JSON.stringify(existingSession, null, 2), context);
        return success ? existingSession : null;
    }
    // Create new session
    const newSession = {
        id: `session-${Date.now()}`,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        topic,
        project,
        checkIns: 0,
        breaksTaken: 0,
        totalFocusMinutes: 0
    };
    const success = await updateGistFile('current-session.json', JSON.stringify(newSession, null, 2), context);
    return success ? newSession : null;
}
/**
 * Calculate time-based suggestion
 */
function calculateSuggestion(durationMinutes, checkIns, breaksTaken, breakReminderMinutes) {
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
async function getSessionStatus(context) {
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
    const suggestion = calculateSuggestion(durationMinutes, session.checkIns, session.breaksTaken, preferences.breakReminderMinutes);
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
async function recordCheckIn(context) {
    const session = await getCurrentSession(context);
    if (!session)
        return false;
    session.checkIns++;
    session.lastActivity = new Date().toISOString();
    return await updateGistFile('current-session.json', JSON.stringify(session, null, 2), context);
}
/**
 * Record a break taken
 */
async function recordBreak(breakMinutes = 0, context) {
    const session = await getCurrentSession(context);
    if (!session)
        return false;
    // Add focus time up to this point
    const lastActivity = new Date(session.lastActivity);
    const now = new Date();
    const focusMinutes = Math.round((now.getTime() - lastActivity.getTime()) / 60000);
    session.totalFocusMinutes += focusMinutes;
    session.breaksTaken++;
    session.lastActivity = new Date().toISOString();
    return await updateGistFile('current-session.json', JSON.stringify(session, null, 2), context);
}
/**
 * End the current session
 */
async function endSession(context) {
    const session = await getCurrentSession(context);
    if (!session)
        return null;
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
//# sourceMappingURL=gistService.js.map