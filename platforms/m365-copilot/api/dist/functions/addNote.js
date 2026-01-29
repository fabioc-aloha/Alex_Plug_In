"use strict";
/**
 * Add Note Endpoint
 *
 * Creates a new note or observation.
 * Part of the Proactive Memory System.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteHandler = addNoteHandler;
const gistService_1 = require("../services/gistService");
async function addNoteHandler(request, context) {
    context.log('addNote triggered');
    try {
        const body = await request.json();
        if (!body.content) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Content is required' }
            };
        }
        const noteType = body.type || 'note';
        const note = await (0, gistService_1.addNote)(body.content, noteType, body.project, body.tags, context);
        if (!note) {
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Failed to create note. Check GITHUB_TOKEN and GITHUB_GIST_ID configuration.'
                }
            };
        }
        context.log(`Created ${noteType}: ${note.id}`);
        return {
            status: 201,
            jsonBody: { success: true, note }
        };
    }
    catch (error) {
        context.error('Error adding note:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to create note' }
        };
    }
}
//# sourceMappingURL=addNote.js.map