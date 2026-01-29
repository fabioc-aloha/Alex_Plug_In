"use strict";
/**
 * Get Due Reminders Endpoint
 *
 * Returns reminders that should be surfaced based on date, keywords, or project context.
 * Enables proactive reminder behavior.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDueRemindersHandler = getDueRemindersHandler;
const gistService_1 = require("../services/gistService");
async function getDueRemindersHandler(request, context) {
    context.log('getDueReminders triggered');
    // Parse query parameters
    const keywordsParam = request.query.get('keywords');
    const keywords = keywordsParam ? keywordsParam.split(',').map(k => k.trim()) : undefined;
    const project = request.query.get('project') || undefined;
    try {
        const reminders = await (0, gistService_1.getDueReminders)(keywords, project, context);
        const response = {
            reminders,
            count: reminders.length
        };
        context.log(`Found ${reminders.length} due reminders`);
        return {
            status: 200,
            jsonBody: response
        };
    }
    catch (error) {
        context.error('Error fetching due reminders:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch due reminders' }
        };
    }
}
//# sourceMappingURL=getDueReminders.js.map