/**
 * Get Session Status Endpoint
 * 
 * Returns current session status with time-based suggestions.
 * Part of the Time Awareness system.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getSessionStatus, SessionStatus } from '../services/gistService';

export async function getSessionStatusHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('getSessionStatus triggered');

    try {
        const status = await getSessionStatus(context);

        context.log(`Session active: ${status.active}, duration: ${status.durationMinutes} min`);

        return {
            status: 200,
            jsonBody: status
        };

    } catch (error) {
        context.error('Error getting session status:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to get session status' }
        };
    }
}
