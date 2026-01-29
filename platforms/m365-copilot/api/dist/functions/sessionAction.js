"use strict";
/**
 * End Session Endpoint
 *
 * Ends the current work session and returns summary statistics.
 * Part of the Time Awareness system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionActionHandler = sessionActionHandler;
const gistService_1 = require("../services/gistService");
async function sessionActionHandler(request, context) {
    context.log('sessionAction triggered');
    try {
        const body = await request.json();
        if (!body.action) {
            return {
                status: 400,
                jsonBody: { success: false, error: 'Action is required (end, break, checkin)' }
            };
        }
        switch (body.action) {
            case 'end': {
                const result = await (0, gistService_1.endSession)(context);
                if (!result) {
                    return {
                        status: 404,
                        jsonBody: { success: false, error: 'No active session to end' }
                    };
                }
                context.log(`Session ended: ${result.totalMinutes} total min, ${result.focusMinutes} focus min`);
                return {
                    status: 200,
                    jsonBody: {
                        success: true,
                        summary: {
                            totalMinutes: result.totalMinutes,
                            focusMinutes: result.focusMinutes,
                            breaks: result.session.breaksTaken,
                            topic: result.session.topic,
                            project: result.session.project
                        }
                    }
                };
            }
            case 'break': {
                const success = await (0, gistService_1.recordBreak)(body.breakMinutes || 0, context);
                return {
                    status: success ? 200 : 404,
                    jsonBody: {
                        success,
                        error: success ? undefined : 'No active session'
                    }
                };
            }
            case 'checkin': {
                const success = await (0, gistService_1.recordCheckIn)(context);
                return {
                    status: success ? 200 : 404,
                    jsonBody: {
                        success,
                        error: success ? undefined : 'No active session'
                    }
                };
            }
            default:
                return {
                    status: 400,
                    jsonBody: { success: false, error: 'Invalid action' }
                };
        }
    }
    catch (error) {
        context.error('Error with session action:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Failed to process session action' }
        };
    }
}
//# sourceMappingURL=sessionAction.js.map