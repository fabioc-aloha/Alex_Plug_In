/**
 * Get Learning Goals Endpoint
 * 
 * Retrieves user's learning goals from their profile
 * along with tracked progress on skills they're developing.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getLearningGoals as getGoalsFromGist, getInsightItems, LearningGoal } from '../services/gistService';

interface RecentTopic {
    topic: string;
    sessionCount: number;
    lastPracticed: string;
    suggestConsolidation: boolean;
}

interface LearningGoalsResponse {
    goals: LearningGoal[];
    recentTopics: RecentTopic[];
}

export async function getLearningGoals(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('getLearningGoals triggered');

    const status = request.query.get('status') || undefined;

    try {
        // Get learning goals from Gist
        const goals = await getGoalsFromGist(status, context);

        // Get recent insights to derive practiced topics
        const recentInsights = await getInsightItems(14, undefined, 50, context);
        
        // Aggregate topics from recent insights
        const topicCounts = new Map<string, { count: number; lastDate: string }>();
        
        for (const insight of recentInsights) {
            for (const tag of insight.tags) {
                const existing = topicCounts.get(tag);
                if (existing) {
                    existing.count++;
                    if (insight.date && insight.date > existing.lastDate) {
                        existing.lastDate = insight.date;
                    }
                } else {
                    topicCounts.set(tag, {
                        count: 1,
                        lastDate: insight.date || new Date().toISOString()
                    });
                }
            }
        }

        // Convert to recent topics array
        const recentTopics: RecentTopic[] = Array.from(topicCounts.entries())
            .map(([topic, data]) => ({
                topic,
                sessionCount: data.count,
                lastPracticed: data.lastDate.split('T')[0],
                suggestConsolidation: data.count >= 3 // Suggest if 3+ sessions
            }))
            .sort((a, b) => b.sessionCount - a.sessionCount)
            .slice(0, 10);

        const response: LearningGoalsResponse = {
            goals,
            recentTopics
        };

        context.log(`Returning ${goals.length} goals and ${recentTopics.length} recent topics`);

        return {
            status: 200,
            jsonBody: response
        };

    } catch (error) {
        context.error('Error fetching learning goals:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch learning goals' }
        };
    }
}
