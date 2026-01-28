"use strict";
/**
 * Get Learning Goals Endpoint
 *
 * Retrieves user's learning goals from their profile
 * along with tracked progress on skills they're developing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearningGoals = getLearningGoals;
async function getLearningGoals(request, context) {
    context.log('getLearningGoals triggered');
    try {
        // TODO: Implement actual learning goals retrieval
        // This will:
        // 1. Fetch user profile for stated learning goals
        // 2. Scan recent session activity for practiced topics
        // 3. Match practiced topics to learning goals
        // 4. Calculate whether to suggest consolidation (3+ sessions)
        // Placeholder response
        const response = {
            goals: [
                {
                    topic: 'Master Kubernetes',
                    status: 'active',
                    progress: 'Completed basic deployments, working on StatefulSets',
                    relatedPatterns: ['GK-CONTAINER-PATTERNS', 'DK-K8S-BASICS']
                },
                {
                    topic: 'Build resilient APIs',
                    status: 'active',
                    progress: 'Implemented retry patterns, exploring circuit breakers',
                    relatedPatterns: ['GK-API-RATE-LIMITING', 'GK-RESILIENT-APIS']
                }
            ],
            recentTopics: [
                {
                    topic: 'Azure Functions',
                    sessionCount: 4,
                    lastPracticed: '2026-01-28',
                    suggestConsolidation: true
                },
                {
                    topic: 'M365 Agents',
                    sessionCount: 2,
                    lastPracticed: '2026-01-28',
                    suggestConsolidation: false
                }
            ]
        };
        return {
            status: 200,
            jsonBody: response
        };
    }
    catch (error) {
        context.error('Error fetching learning goals:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch learning goals' }
        };
    }
}
//# sourceMappingURL=getLearningGoals.js.map