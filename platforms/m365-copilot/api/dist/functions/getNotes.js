"use strict";
/**
 * Get Notes Endpoint
 *
 * Access user notes, reminders, and Alex's observations.
 * Supports filtering by type and status.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = getNotes;
const gistService_1 = require("../services/gistService");
async function getNotes(request, context) {
    context.log('getNotes triggered');
    const type = request.query.get('type') || 'all';
    const status = request.query.get('status') || 'active';
    const project = request.query.get('project') || undefined;
    try {
        const notes = await (0, gistService_1.getNotes)(type, status, project, context);
        const response = {
            notes
        };
        context.log(`Returning ${notes.length} notes`);
        return {
            status: 200,
            jsonBody: response
        };
    }
    catch (error) {
        context.error('Error fetching notes:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch notes' }
        };
    }
}
//# sourceMappingURL=getNotes.js.map