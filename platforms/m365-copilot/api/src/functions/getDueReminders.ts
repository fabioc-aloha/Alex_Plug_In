/**
 * Get Due Reminders Endpoint
 * 
 * Returns reminders that should be surfaced based on date, keywords, or project context.
 * Enables proactive reminder behavior.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getDueReminders, Note } from '../services/gistService';

interface DueRemindersResponse {
    reminders: Note[];
    count: number;
}

export async function getDueRemindersHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('getDueReminders triggered');

    // Parse query parameters
    const keywordsParam = request.query.get('keywords');
    const keywords = keywordsParam ? keywordsParam.split(',').map(k => k.trim()) : undefined;
    const project = request.query.get('project') || undefined;

    try {
        const reminders = await getDueReminders(keywords, project, context);

        const response: DueRemindersResponse = {
            reminders,
            count: reminders.length
        };

        context.log(`Found ${reminders.length} due reminders`);

        return {
            status: 200,
            jsonBody: response
        };

    } catch (error) {
        context.error('Error fetching due reminders:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch due reminders' }
        };
    }
}
