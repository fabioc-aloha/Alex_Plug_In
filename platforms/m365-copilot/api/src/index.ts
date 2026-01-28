/**
 * Alex Knowledge API - Azure Functions Entry Point
 * 
 * This file registers all HTTP endpoints for the Alex M365 Agent.
 * Each function provides access to a different aspect of Alex's knowledge base.
 */

import { app } from '@azure/functions';
import { searchKnowledge } from './functions/searchKnowledge';
import { getInsights } from './functions/getInsights';
import { getProfile } from './functions/getProfile';
import { getNotes } from './functions/getNotes';
import { getLearningGoals } from './functions/getLearningGoals';

// Register HTTP triggers
app.http('searchKnowledge', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'searchKnowledge',
    handler: searchKnowledge
});

app.http('getInsights', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getInsights',
    handler: getInsights
});

app.http('getProfile', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getProfile',
    handler: getProfile
});

app.http('getNotes', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getNotes',
    handler: getNotes
});

app.http('getLearningGoals', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getLearningGoals',
    handler: getLearningGoals
});

console.log('🦖 Alex Knowledge API initialized');
