/**
 * Add Note Endpoint
 * 
 * Creates a new note or observation.
 * Part of the Proactive Memory System.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { addNote, Note } from '../services/gistService';

interface AddNoteRequest {
    content: string;
    type?: 'note' | 'observation';
    project?: string;
    tags?: string[];
}

interface AddNoteResponse {
    success: boolean;
    note?: Note;
    error?: string;
}

export async function addNoteHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('addNote triggered');

    try {
        const body = await request.json() as AddNoteRequest;

        if (!body.content) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Content is required' } as AddNoteResponse
            };
        }

        const noteType = body.type || 'note';

        const note = await addNote(
            body.content,
            noteType,
            body.project,
            body.tags,
            context
        );

        if (!note) {
            return {
                status: 500,
                jsonBody: { 
                    success: false, 
                    error: 'Failed to create note. Check GITHUB_TOKEN and GITHUB_GIST_ID configuration.' 
                } as AddNoteResponse
            };
        }

        context.log(`Created ${noteType}: ${note.id}`);

        return {
            status: 201,
            jsonBody: { success: true, note } as AddNoteResponse
        };

    } catch (error) {
        context.error('Error adding note:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to create note' } as AddNoteResponse
        };
    }
}
