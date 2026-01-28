"use strict";
/**
 * Alex Knowledge API - Azure Functions Entry Point
 *
 * This file registers all HTTP endpoints for the Alex M365 Agent.
 * Each function provides access to a different aspect of Alex's knowledge base.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const searchKnowledge_1 = require("./functions/searchKnowledge");
const getInsights_1 = require("./functions/getInsights");
const getProfile_1 = require("./functions/getProfile");
const getNotes_1 = require("./functions/getNotes");
const getLearningGoals_1 = require("./functions/getLearningGoals");
// Register HTTP triggers
functions_1.app.http('searchKnowledge', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'searchKnowledge',
    handler: searchKnowledge_1.searchKnowledge
});
functions_1.app.http('getInsights', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getInsights',
    handler: getInsights_1.getInsights
});
functions_1.app.http('getProfile', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getProfile',
    handler: getProfile_1.getProfile
});
functions_1.app.http('getNotes', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getNotes',
    handler: getNotes_1.getNotes
});
functions_1.app.http('getLearningGoals', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getLearningGoals',
    handler: getLearningGoals_1.getLearningGoals
});
console.log('🦖 Alex Knowledge API initialized');
//# sourceMappingURL=index.js.map