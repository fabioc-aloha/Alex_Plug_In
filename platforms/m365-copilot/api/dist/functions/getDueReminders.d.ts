/**
 * Get Due Reminders Endpoint
 *
 * Returns reminders that should be surfaced based on date, keywords, or project context.
 * Enables proactive reminder behavior.
 */
import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
export declare function getDueRemindersHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
//# sourceMappingURL=getDueReminders.d.ts.map