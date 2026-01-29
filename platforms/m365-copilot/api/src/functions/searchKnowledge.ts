/**
 * Search Knowledge Endpoint
 * 
 * Searches the user's global knowledge base for patterns, 
 * domain knowledge, and insights from past projects.
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { searchKnowledgeItems } from '../services/gistService';

interface KnowledgeResult {
    title: string;
    category: string;
    content: string;
    source: string;
    relevance: number;
}

interface SearchResponse {
    results: KnowledgeResult[];
    totalCount: number;
}

export async function searchKnowledge(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('searchKnowledge triggered');

    const query = request.query.get('query');
    const category = request.query.get('category') || undefined;
    const limit = parseInt(request.query.get('limit') || '5');

    if (!query) {
        return {
            status: 400,
            jsonBody: { error: 'Query parameter is required' }
        };
    }

    try {
        const { results, totalCount } = await searchKnowledgeItems(
            query,
            category,
            limit,
            context
        );

        // Transform to API response format
        const response: SearchResponse = {
            results: results.map(item => ({
                title: item.title,
                category: item.category,
                content: item.content.substring(0, 500) + (item.content.length > 500 ? '...' : ''),
                source: item.source,
                relevance: (item as any).relevance || 0.5
            })),
            totalCount
        };

        context.log(`Found ${totalCount} results for query: ${query}`);

        return {
            status: 200,
            jsonBody: response
        };

    } catch (error) {
        context.error('Error searching knowledge:', error);
        return {
            status: 500,
            jsonBody: { error: 'Failed to search knowledge base' }
        };
    }
}
