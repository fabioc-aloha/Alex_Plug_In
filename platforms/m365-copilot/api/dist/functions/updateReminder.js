"use strict";
/**
 * Update Reminder Endpoint
 *
 * Updates the status of a reminder (complete, snooze, reactivate).
 * Part of the Proactive Memory System.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReminderHandler = updateReminderHandler;
const gistService_1 = require("../services/gistService");
async function updateReminderHandler(request, context) {
    context.log('updateReminder triggered');
    try {
        const body = await request.json();
        if (!body.id) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Reminder ID is required' }
            };
        }
        if (!body.action) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Action is required (complete, snooze, reactivate, delete)' }
            };
        }
        let success;
        if (body.action === 'delete') {
            success = await (0, gistService_1.deleteNote)(body.id, context);
        }
        else {
            const statusMap = {
                'complete': 'completed',
                'snooze': 'snoozed',
                'reactivate': 'active'
            };
            success = await (0, gistService_1.updateReminderStatus)(body.id, statusMap[body.action], context);
        }
        if (!success) {
            return {
                status: 404,
                jsonBody: { success: false, error: 'Reminder not found or update failed' }
            };
        }
        context.log(`Updated reminder ${body.id}: ${body.action}`);
        return {
            status: 200,
            jsonBody: { success: true }
        };
    }
    catch (error) {
        context.error('Error updating reminder:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to update reminder' }
        };
    }
}
//# sourceMappingURL=updateReminder.js.map