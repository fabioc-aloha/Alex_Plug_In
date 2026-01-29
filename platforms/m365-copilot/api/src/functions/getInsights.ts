/**
 * Get Insights Endpoint
 * 
 * Retrieves timestamped insights (GI-*) captured during 
 * meditation sessions and learning activities.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getInsightItems } from '../services/gistService';

interface Insight {
    id: string;
    title: string;
    content: string;
    date: string;
    project?: string;
    tags: string[];
}

interface InsightsResponse {
    insights: Insight[];
}

export async function getInsights(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('getInsights triggered');

    const days = parseInt(request.query.get('days') || '30');
    const project = request.query.get('project') || undefined;
    const limit = parseInt(request.query.get('limit') || '10');

    try {
        const items = await getInsightItems(days, project, limit, context);

        const response: InsightsResponse = {
            insights: items.map(item => ({
                id: item.id,
                title: item.title,
                content: item.content.substring(0, 1000) + (item.content.length > 1000 ? '...' : ''),
                date: item.date || new Date().toISOString(),
                project: item.project,
                tags: item.tags
            }))
        };

        context.log(`Returning ${response.insights.length} insights`);

        return {
            status: 200,
            jsonBody: response
        };

    } catch (error) {
        context.error('Error fetching insights:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch insights' }
        };
    }
}
