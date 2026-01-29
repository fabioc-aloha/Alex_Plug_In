"use strict";
/**
 * Add Reminder Endpoint
 *
 * Creates a new reminder with optional triggers (date, keywords, project).
 * Part of the Proactive Memory System.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReminderHandler = addReminderHandler;
const gistService_1 = require("../services/gistService");
async function addReminderHandler(request, context) {
    context.log('addReminder triggered');
    try {
        const body = await request.json();
        if (!body.content) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Content is required' }
            };
        }
        // Build triggers object
        const triggers = {};
        if (body.triggerDate)
            triggers.date = body.triggerDate;
        if (body.keywords?.length)
            triggers.keywords = body.keywords;
        if (body.project)
            triggers.project = body.project;
        const reminder = await (0, gistService_1.addReminder)(body.content, Object.keys(triggers).length > 0 ? triggers : undefined, context);
        if (!reminder) {
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Failed to create reminder. Check GITHUB_TOKEN and GITHUB_GIST_ID configuration.'
                }
            };
        }
        context.log(`Created reminder: ${reminder.id}`);
        return {
            status: 201,
            jsonBody: { success: true, reminder }
        };
    }
    catch (error) {
        context.error('Error adding reminder:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to create reminder' }
        };
    }
}
//# sourceMappingURL=addReminder.js.map