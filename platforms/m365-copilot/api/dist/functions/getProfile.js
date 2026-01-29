"use strict";
/**
 * Get Profile Endpoint
 *
 * Retrieves the user's profile including preferences,
 * expertise, and communication style settings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
const gistService_1 = require("../services/gistService");
async function getProfile(request, context) {
    context.log('getProfile triggered');
    try {
        const profile = await (0, gistService_1.getUserProfile)(context);
        if (!profile) {
            return {
                status: 200,
                jsonBody: {
                    profile: {
                        name: 'User',
                        formality: 'balanced',
                        detailLevel: 'balanced',
                        primaryTechnologies: [],
                        learningGoals: [],
                        expertiseAreas: [],
                        currentProjects: []
                    },
                    found: false
                }
            };
        }
        const response = {
            profile,
            found: true
        };
        context.log(`Profile found for: ${profile.name}`);
        return {
            status: 200,
            jsonBody: response
        };
    }
    catch (error) {
        context.error('Error fetching profile:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch profile' }
        };
    }
}
//# sourceMappingURL=getProfile.js.map