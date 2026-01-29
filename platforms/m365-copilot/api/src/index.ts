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
import { addReminderHandler } from './functions/addReminder';
import { addNoteHandler } from './functions/addNote';
import { updateReminderHandler } from './functions/updateReminder';
import { getDueRemindersHandler } from './functions/getDueReminders';
import { getSessionStatusHandler } from './functions/getSessionStatus';
import { startSessionHandler } from './functions/startSession';
import { sessionActionHandler } from './functions/sessionAction';

// ============================================================================
// READ OPERATIONS
// ============================================================================

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

app.http('getDueReminders', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getDueReminders',
    handler: getDueRemindersHandler
});

app.http('getSessionStatus', {
    methods: ['GET'],
    authLevel: 'function',
    route: 'getSessionStatus',
    handler: getSessionStatusHandler
});

// ============================================================================
// WRITE OPERATIONS - Proactive Memory System
// ============================================================================

app.http('addReminder', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'addReminder',
    handler: addReminderHandler
});

app.http('addNote', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'addNote',
    handler: addNoteHandler
});

app.http('updateReminder', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'updateReminder',
    handler: updateReminderHandler
});

// ============================================================================
// TIME AWARENESS - Session Tracking
// ============================================================================

app.http('startSession', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'startSession',
    handler: startSessionHandler
});

app.http('sessionAction', {
    methods: ['POST'],
    authLevel: 'function',
    route: 'sessionAction',
    handler: sessionActionHandler
});

console.log('🦖 Alex Knowledge API initialized with Proactive Memory & Time Awareness');
