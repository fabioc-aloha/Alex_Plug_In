/**
 * Get Notes Endpoint
 * 
 * Access user notes, reminders, and Alex's observations.
 * Supports filtering by type and status.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getNotes as getNotesFromGist, Note } from '../services/gistService';

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
    const project = request.query.get('project') || undefined;

    try {
        const notes = await getNotesFromGist(type, status, project, context);

        const response: NotesResponse = {
            notes
        };

        context.log(`Returning ${notes.length} notes`);

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
