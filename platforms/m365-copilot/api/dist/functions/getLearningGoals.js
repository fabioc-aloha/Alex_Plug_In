"use strict";
/**
 * Get Learning Goals Endpoint
 *
 * Retrieves user's learning goals from their profile
 * along with tracked progress on skills they're developing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearningGoals = getLearningGoals;
const gistService_1 = require("../services/gistService");
async function getLearningGoals(request, context) {
    context.log('getLearningGoals triggered');
    const status = request.query.get('status') || undefined;
    try {
        // Get learning goals from Gist
        const goals = await (0, gistService_1.getLearningGoals)(status, context);
        // Get recent insights to derive practiced topics
        const recentInsights = await (0, gistService_1.getInsightItems)(14, undefined, 50, context);
        // Aggregate topics from recent insights
        const topicCounts = new Map();
        for (const insight of recentInsights) {
            for (const tag of insight.tags) {
                const existing = topicCounts.get(tag);
                if (existing) {
                    existing.count++;
                    if (insight.date && insight.date > existing.lastDate) {
                        existing.lastDate = insight.date;
                    }
                }
                else {
                    topicCounts.set(tag, {
                        count: 1,
                        lastDate: insight.date || new Date().toISOString()
                    });
                }
            }
        }
        // Convert to recent topics array
        const recentTopics = Array.from(topicCounts.entries())
            .map(([topic, data]) => ({
            topic,
            sessionCount: data.count,
            lastPracticed: data.lastDate.split('T')[0],
            suggestConsolidation: data.count >= 3 // Suggest if 3+ sessions
        }))
            .sort((a, b) => b.sessionCount - a.sessionCount)
            .slice(0, 10);
        const response = {
            goals,
            recentTopics
        };
        context.log(`Returning ${goals.length} goals and ${recentTopics.length} recent topics`);
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