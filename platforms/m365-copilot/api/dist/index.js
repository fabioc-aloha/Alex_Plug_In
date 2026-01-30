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
const addReminder_1 = require("./functions/addReminder");
const addNote_1 = require("./functions/addNote");
const updateReminder_1 = require("./functions/updateReminder");
const getDueReminders_1 = require("./functions/getDueReminders");
const getSessionStatus_1 = require("./functions/getSessionStatus");
const startSession_1 = require("./functions/startSession");
const sessionAction_1 = require("./functions/sessionAction");
// ============================================================================
// READ OPERATIONS
// ============================================================================
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
functions_1.app.http('getDueReminders', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getDueReminders',
    handler: getDueReminders_1.getDueRemindersHandler
});
functions_1.app.http('getSessionStatus', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getSessionStatus',
    handler: getSessionStatus_1.getSessionStatusHandler
});
// ============================================================================
// WRITE OPERATIONS - Proactive Memory System
// ============================================================================
functions_1.app.http('addReminder', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'addReminder',
    handler: addReminder_1.addReminderHandler
});
functions_1.app.http('addNote', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'addNote',
    handler: addNote_1.addNoteHandler
});
functions_1.app.http('updateReminder', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'updateReminder',
    handler: updateReminder_1.updateReminderHandler
});
// ============================================================================
// TIME AWARENESS - Session Tracking
// ============================================================================
functions_1.app.http('startSession', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'startSession',
    handler: startSession_1.startSessionHandler
});
functions_1.app.http('sessionAction', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'sessionAction',
    handler: sessionAction_1.sessionActionHandler
});
console.log('Alex Knowledge API initialized with Proactive Memory & Time Awareness');
//# sourceMappingURL=index.js.map
