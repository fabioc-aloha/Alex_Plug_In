/**
 * Start Session Endpoint
 * 
 * Starts or resumes a work session for time tracking.
 * Part of the Time Awareness system.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { startSession, Session } from '../services/gistService';

interface StartSessionRequest {
    topic?: string;
    project?: string;
}

interface StartSessionResponse {
    success: boolean;
    session?: Session;
    error?: string;
}

export async function startSessionHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('startSession triggered');

    try {
        let topic: string | undefined;
        let project: string | undefined;

        // Try to parse body if present
        try {
            const body = await request.json() as StartSessionRequest;
            topic = body.topic;
            project = body.project;
        } catch {
            // No body or invalid JSON - that's OK
        }

        const session = await startSession(topic, project, context);

        if (!session) {
            return {
                status: 500,
                jsonBody: { 
                    success: false, 
                    error: 'Failed to start session. Check GITHUB_TOKEN and GITHUB_GIST_ID configuration.' 
                } as StartSessionResponse
            };
        }

        context.log(`Session started/resumed: ${session.id}`);

        return {
            status: 200,
            jsonBody: { success: true, session } as StartSessionResponse
        };

    } catch (error) {
        context.error('Error starting session:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to start session' } as StartSessionResponse
        };
    }
}
