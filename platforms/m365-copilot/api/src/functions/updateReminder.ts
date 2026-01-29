/**
 * Update Reminder Endpoint
 * 
 * Updates the status of a reminder (complete, snooze, reactivate).
 * Part of the Proactive Memory System.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { updateReminderStatus, deleteNote } from '../services/gistService';

interface UpdateReminderRequest {
    id: string;
    action: 'complete' | 'snooze' | 'reactivate' | 'delete';
}

interface UpdateReminderResponse {
    success: boolean;
    error?: string;
}

export async function updateReminderHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('updateReminder triggered');

    try {
        const body = await request.json() as UpdateReminderRequest;

        if (!body.id) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Reminder ID is required' } as UpdateReminderResponse
            };
        }

        if (!body.action) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Action is required (complete, snooze, reactivate, delete)' } as UpdateReminderResponse
            };
        }

        let success: boolean;

        if (body.action === 'delete') {
            success = await deleteNote(body.id, context);
        } else {
            const statusMap: Record<string, 'active' | 'completed' | 'snoozed'> = {
                'complete': 'completed',
                'snooze': 'snoozed',
                'reactivate': 'active'
            };
            success = await updateReminderStatus(body.id, statusMap[body.action], context);
        }

        if (!success) {
            return {
                status: 404,
                jsonBody: { success: false, error: 'Reminder not found or update failed' } as UpdateReminderResponse
            };
        }

        context.log(`Updated reminder ${body.id}: ${body.action}`);

        return {
            status: 200,
            jsonBody: { success: true } as UpdateReminderResponse
        };

    } catch (error) {
        context.error('Error updating reminder:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to update reminder' } as UpdateReminderResponse
        };
    }
}
