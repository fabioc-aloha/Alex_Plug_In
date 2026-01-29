"use strict";
/**
 * Get Insights Endpoint
 *
 * Retrieves timestamped insights (GI-*) captured during
 * meditation sessions and learning activities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsights = getInsights;
const gistService_1 = require("../services/gistService");
async function getInsights(request, context) {
    context.log('getInsights triggered');
    const days = parseInt(request.query.get('days') || '30');
    const project = request.query.get('project') || undefined;
    const limit = parseInt(request.query.get('limit') || '10');
    try {
        const items = await (0, gistService_1.getInsightItems)(days, project, limit, context);
        const response = {
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
    }
    catch (error) {
        context.error('Error fetching insights:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to fetch insights' }
        };
    }
}
//# sourceMappingURL=getInsights.js.map