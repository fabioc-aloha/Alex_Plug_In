/**
 * Get Profile Endpoint
 * 
 * Retrieves the user's profile including preferences,
 * expertise, and communication style settings.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getUserProfile, UserProfile } from '../services/gistService';

interface ProfileResponse {
    profile: UserProfile;
    found: boolean;
}

export async function getProfile(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('getProfile triggered');

    try {
        const profile = await getUserProfile(context);

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
                } as ProfileResponse
            };
        }

        const response: ProfileResponse = {
            profile,
            found: true
        };

        context.log(`Profile found for: ${profile.name}`);

        return {
            status: 200,
            jsonBody: response
        };

    } catch (error) {
        context.error('Error fetching profile:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch profile' }
        };
    }
}
