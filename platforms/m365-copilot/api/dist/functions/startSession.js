"use strict";
/**
 * Start Session Endpoint
 *
 * Starts or resumes a work session for time tracking.
 * Part of the Time Awareness system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSessionHandler = startSessionHandler;
const gistService_1 = require("../services/gistService");
async function startSessionHandler(request, context) {
    context.log('startSession triggered');
    try {
        let topic;
        let project;
        // Try to parse body if present
        try {
            const body = await request.json();
            topic = body.topic;
            project = body.project;
        }
        catch {
            // No body or invalid JSON - that's OK
        }
        const session = await (0, gistService_1.startSession)(topic, project, context);
        if (!session) {
            return {
                status: 500,
                jsonBody: {
                    success: false,
                    error: 'Failed to start session. Check GITHUB_TOKEN and GITHUB_GIST_ID configuration.'
                }
            };
        }
        context.log(`Session started/resumed: ${session.id}`);
        return {
            status: 200,
            jsonBody: { success: true, session }
        };
    }
    catch (error) {
        context.error('Error starting session:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to start session' }
        };
    }
}
//# sourceMappingURL=startSession.js.map