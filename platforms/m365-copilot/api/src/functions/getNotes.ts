/**
 * Get Notes Endpoint
 * 
 * Access user notes, reminders, and Alex's observations.
 * Supports filtering by type and status.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

interface Note {
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

interface NotesResponse {
    notes: Note[];
}

export async function getNotes(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('getNotes triggered');

    const type = request.query.get('type') || 'all';
    const status = request.query.get('status') || 'active';
    const project = request.query.get('project');

    try {
        // TODO: Implement actual notes retrieval
        // This will:
        // 1. Fetch notes from GitHub Gist (~/.alex/notes/)
        // 2. Filter by type (reminder, note, observation, all)
        // 3. Filter by status (active, completed, snoozed, all)
        // 4. Filter by project if provided

        // Placeholder response
        const response: NotesResponse = {
            notes: [
                {
                    id: 'note-001',
                    type: 'reminder',
                    content: 'Update changelog before release',
                    created: '2026-01-28T09:00:00Z',
                    status: 'active',
                    triggers: {
                        keywords: ['release', 'publish'],
                        project: 'Alex_Plug_In'
                    }
                },
                {
                    id: 'note-002',
                    type: 'observation',
                    content: 'User prefers detailed explanations with code examples',
                    created: '2026-01-25T14:30:00Z',
                    status: 'active'
                }
            ]
        };

        return {
            status: 200,
            jsonBody: response
        };

    } catch (error) {
        context.error('Error fetching notes:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch notes' }
        };
    }
}
