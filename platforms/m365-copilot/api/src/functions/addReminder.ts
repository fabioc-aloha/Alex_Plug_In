/**
 * Add Reminder Endpoint
 * 
 * Creates a new reminder with optional triggers (date, keywords, project).
 * Part of the Proactive Memory System.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { addReminder, Note } from '../services/gistService';

interface AddReminderRequest {
    content: string;
    triggerDate?: string;
    keywords?: string[];
    project?: string;
}

interface AddReminderResponse {
    success: boolean;
    reminder?: Note;
    error?: string;
}

export async function addReminderHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('addReminder triggered');

    try {
        const body = await request.json() as AddReminderRequest;

        if (!body.content) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Content is required' } as AddReminderResponse
            };
        }

        // Build triggers object
        const triggers: { date?: string; keywords?: string[]; project?: string } = {};
        if (body.triggerDate) triggers.date = body.triggerDate;
        if (body.keywords?.length) triggers.keywords = body.keywords;
        if (body.project) triggers.project = body.project;

        const reminder = await addReminder(
            body.content,
            Object.keys(triggers).length > 0 ? triggers : undefined,
            context
        );

        if (!reminder) {
            return {
                status: 500,
                jsonBody: { 
                    success: false, 
                    error: 'Failed to create reminder. Check GITHUB_TOKEN and GITHUB_GIST_ID configuration.' 
                } as AddReminderResponse
            };
        }

        context.log(`Created reminder: ${reminder.id}`);

        return {
            status: 201,
            jsonBody: { success: true, reminder } as AddReminderResponse
        };

    } catch (error) {
        context.error('Error adding reminder:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to create reminder' } as AddReminderResponse
        };
    }
}
