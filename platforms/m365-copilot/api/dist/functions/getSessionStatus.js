"use strict";
/**
 * Get Session Status Endpoint
 *
 * Returns current session status with time-based suggestions.
 * Part of the Time Awareness system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionStatusHandler = getSessionStatusHandler;
const gistService_1 = require("../services/gistService");
async function getSessionStatusHandler(request, context) {
    context.log('getSessionStatus triggered');
    try {
        const status = await (0, gistService_1.getSessionStatus)(context);
        context.log(`Session active: ${status.active}, duration: ${status.durationMinutes} min`);
        return {
            status: 200,
            jsonBody: status
        };
    }
    catch (error) {
        context.error('Error getting session status:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to get session status' }
        };
    }
}
//# sourceMappingURL=getSessionStatus.js.map