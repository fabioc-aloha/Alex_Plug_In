/**
 * Microsoft Graph Integration Module
 *
 * Provides access to Microsoft 365 services through the Graph API:
 * - Calendar: Read upcoming events, meeting context
 * - Mail: Recent emails for context awareness
 * - Presence: User availability status
 * - People: Frequent contacts and org hierarchy
 *
 * @module enterprise/microsoftGraph
 * @version 5.6.0
 */

import * as vscode from 'vscode';
import { getCurrentUser, isEnterpriseMode } from './enterpriseAuth';

// Graph API base URL
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

// Required scopes for Graph integration
export const GRAPH_SCOPES = [
  'Calendars.Read',
  'Mail.Read',
  'Presence.Read',
  'People.Read',
  'User.Read',
];

// Optional scopes for enhanced features
export const GRAPH_OPTIONAL_SCOPES = [
  'Tasks.ReadWrite', // For Planner/To-Do sync
  'Files.Read', // For OneDrive integration
];

/**
 * Graph API response types
 */
export interface GraphCalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: { displayName: string };
  organizer?: { emailAddress: { name: string; address: string } };
  attendees?: Array<{ emailAddress: { name: string; address: string } }>;
  isOnlineMeeting?: boolean;
  onlineMeetingUrl?: string;
  bodyPreview?: string;
}

export interface GraphMailMessage {
  id: string;
  subject: string;
  from: { emailAddress: { name: string; address: string } };
  receivedDateTime: string;
  bodyPreview: string;
  isRead: boolean;
  importance: 'low' | 'normal' | 'high';
  hasAttachments: boolean;
}

export interface GraphPresence {
  id: string;
  availability: 'Available' | 'Busy' | 'DoNotDisturb' | 'Away' | 'Offline' | 'PresenceUnknown';
  activity: string;
}

export interface GraphPerson {
  id: string;
  displayName: string;
  emailAddresses: Array<{ address: string }>;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
}

export interface GraphConfig {
  enabled: boolean;
  calendarEnabled: boolean;
  mailEnabled: boolean;
  presenceEnabled: boolean;
  peopleEnabled: boolean;
  calendarDaysAhead: number;
  mailMaxMessages: number;
}

/**
 * Get Microsoft Graph configuration
 */
export function getGraphConfig(): GraphConfig {
  const config = vscode.workspace.getConfiguration('alex.enterprise.graph');
  return {
    enabled: config.get<boolean>('enabled', true),
    calendarEnabled: config.get<boolean>('calendarEnabled', true),
    mailEnabled: config.get<boolean>('mailEnabled', true),
    presenceEnabled: config.get<boolean>('presenceEnabled', true),
    peopleEnabled: config.get<boolean>('peopleEnabled', true),
    calendarDaysAhead: config.get<number>('calendarDaysAhead', 7),
    mailMaxMessages: config.get<number>('mailMaxMessages', 10),
  };
}

/**
 * Check if Graph integration is available
 */
export function isGraphAvailable(): boolean {
  return isEnterpriseMode() && getGraphConfig().enabled && getCurrentUser() !== null;
}

/**
 * Make an authenticated Graph API request
 */
async function graphRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const user = getCurrentUser();
  if (!user) {
    console.warn('[Graph] No authenticated user');
    return null;
  }

  try {
    const response = await fetch(`${GRAPH_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`[Graph] API error: ${response.status} ${response.statusText}`);
      if (response.status === 401) {
        // Token expired - would trigger re-auth in production
        vscode.window.showWarningMessage('Microsoft Graph session expired. Please sign in again.');
      }
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('[Graph] Request failed:', error);
    return null;
  }
}

/**
 * Get upcoming calendar events
 */
export async function getCalendarEvents(
  daysAhead?: number
): Promise<GraphCalendarEvent[]> {
  const config = getGraphConfig();
  if (!config.calendarEnabled) return [];

  const days = daysAhead ?? config.calendarDaysAhead;
  const startDateTime = new Date().toISOString();
  const endDateTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const response = await graphRequest<{ value: GraphCalendarEvent[] }>(
    `/me/calendarView?startDateTime=${startDateTime}&endDateTime=${endDateTime}&$top=25&$orderby=start/dateTime&$select=id,subject,start,end,location,organizer,attendees,isOnlineMeeting,onlineMeetingUrl,bodyPreview`
  );

  return response?.value ?? [];
}

/**
 * Get next meeting (within 2 hours)
 */
export async function getNextMeeting(): Promise<GraphCalendarEvent | null> {
  const events = await getCalendarEvents(1);
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  return (
    events.find((event) => {
      const start = new Date(event.start.dateTime);
      return start >= now && start <= twoHoursLater;
    }) ?? null
  );
}

/**
 * Get recent emails
 */
export async function getRecentMail(
  maxMessages?: number,
  unreadOnly = false
): Promise<GraphMailMessage[]> {
  const config = getGraphConfig();
  if (!config.mailEnabled) return [];

  const count = maxMessages ?? config.mailMaxMessages;
  const filter = unreadOnly ? '&$filter=isRead eq false' : '';

  const response = await graphRequest<{ value: GraphMailMessage[] }>(
    `/me/messages?$top=${count}&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,bodyPreview,isRead,importance,hasAttachments${filter}`
  );

  return response?.value ?? [];
}

/**
 * Get user presence (online/offline/busy status)
 */
export async function getPresence(): Promise<GraphPresence | null> {
  const config = getGraphConfig();
  if (!config.presenceEnabled) return null;

  return graphRequest<GraphPresence>('/me/presence');
}

/**
 * Get presence for multiple users
 */
export async function getBatchPresence(userIds: string[]): Promise<Map<string, GraphPresence>> {
  const config = getGraphConfig();
  if (!config.presenceEnabled) return new Map();

  const response = await graphRequest<{ responses: Array<{ id: string; body: GraphPresence }> }>(
    '/communications/getPresencesByUserId',
    {
      method: 'POST',
      body: JSON.stringify({ ids: userIds }),
    }
  );

  const presenceMap = new Map<string, GraphPresence>();
  response?.responses?.forEach((r) => {
    presenceMap.set(r.id, r.body);
  });

  return presenceMap;
}

/**
 * Get frequent/relevant people
 */
export async function getRelevantPeople(
  count = 10
): Promise<GraphPerson[]> {
  const config = getGraphConfig();
  if (!config.peopleEnabled) return [];

  const response = await graphRequest<{ value: GraphPerson[] }>(
    `/me/people?$top=${count}&$select=id,displayName,emailAddresses,jobTitle,department,officeLocation`
  );

  return response?.value ?? [];
}

/**
 * Search for people
 */
export async function searchPeople(
  query: string,
  count = 5
): Promise<GraphPerson[]> {
  const config = getGraphConfig();
  if (!config.peopleEnabled) return [];

  const response = await graphRequest<{ value: GraphPerson[] }>(
    `/me/people?$search="${encodeURIComponent(query)}"&$top=${count}&$select=id,displayName,emailAddresses,jobTitle,department,officeLocation`
  );

  return response?.value ?? [];
}

/**
 * Format calendar event for display
 */
export function formatCalendarEvent(event: GraphCalendarEvent): string {
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const dateStr = start.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  let result = `📅 **${event.subject}**\n`;
  result += `   ${dateStr} ${timeStr}\n`;

  if (event.location?.displayName) {
    result += `   📍 ${event.location.displayName}\n`;
  }

  if (event.isOnlineMeeting) {
    result += `   🔗 Online meeting\n`;
  }

  if (event.organizer) {
    result += `   👤 ${event.organizer.emailAddress.name}\n`;
  }

  return result;
}

/**
 * Format mail message for display
 */
export function formatMailMessage(message: GraphMailMessage): string {
  const date = new Date(message.receivedDateTime);
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const readIcon = message.isRead ? '📧' : '📬';
  const importanceIcon = message.importance === 'high' ? '❗' : '';

  let result = `${readIcon}${importanceIcon} **${message.subject}**\n`;
  result += `   From: ${message.from.emailAddress.name} (${dateStr} ${timeStr})\n`;

  if (message.bodyPreview) {
    const preview = message.bodyPreview.substring(0, 100);
    result += `   ${preview}${message.bodyPreview.length > 100 ? '...' : ''}\n`;
  }

  return result;
}

/**
 * Format presence for display
 */
export function formatPresence(presence: GraphPresence): string {
  const icons: Record<string, string> = {
    Available: '🟢',
    Busy: '🔴',
    DoNotDisturb: '⛔',
    Away: '🟡',
    Offline: '⚫',
    PresenceUnknown: '⚪',
  };

  return `${icons[presence.availability] ?? '⚪'} ${presence.availability}${presence.activity ? ` (${presence.activity})` : ''}`;
}

/**
 * Get meeting context for current/upcoming meeting
 * Useful for preparing conversation context
 */
export async function getMeetingContext(): Promise<string | null> {
  const nextMeeting = await getNextMeeting();
  if (!nextMeeting) return null;

  const attendees = nextMeeting.attendees?.map((a) => a.emailAddress.name).join(', ') ?? 'None';
  const start = new Date(nextMeeting.start.dateTime);
  const minutesUntil = Math.round((start.getTime() - Date.now()) / 60000);

  let context = `## Upcoming Meeting Context\n\n`;
  context += `**${nextMeeting.subject}**\n`;
  context += `- Starts in: ${minutesUntil} minutes\n`;
  context += `- Attendees: ${attendees}\n`;

  if (nextMeeting.location?.displayName) {
    context += `- Location: ${nextMeeting.location.displayName}\n`;
  }

  if (nextMeeting.bodyPreview) {
    context += `\n### Meeting Description\n${nextMeeting.bodyPreview}\n`;
  }

  return context;
}

/**
 * Get work context summary (calendar + recent mail + presence)
 */
export async function getWorkContext(): Promise<string> {
  if (!isGraphAvailable()) {
    return '⚠️ Microsoft Graph not available. Enable enterprise mode and sign in to access your calendar, mail, and presence.';
  }

  const [events, messages, presence] = await Promise.all([
    getCalendarEvents(1),
    getRecentMail(5, true),
    getPresence(),
  ]);

  let context = '## 📊 Work Context\n\n';

  // Presence
  if (presence) {
    context += `**Status**: ${formatPresence(presence)}\n\n`;
  }

  // Today's calendar
  context += `### 📅 Today's Schedule\n\n`;
  const todayEvents = events.filter((e) => {
    const eventDate = new Date(e.start.dateTime).toDateString();
    return eventDate === new Date().toDateString();
  });

  if (todayEvents.length === 0) {
    context += '_No meetings today_\n\n';
  } else {
    todayEvents.forEach((event) => {
      context += formatCalendarEvent(event) + '\n';
    });
  }

  // Unread mail
  if (messages.length > 0) {
    context += `\n### 📬 Unread Mail (${messages.length})\n\n`;
    messages.slice(0, 3).forEach((msg) => {
      context += formatMailMessage(msg) + '\n';
    });
    if (messages.length > 3) {
      context += `_... and ${messages.length - 3} more_\n`;
    }
  }

  return context;
}

/**
 * Graph status for /status command
 */
export function getGraphStatus(): { enabled: boolean; connected: boolean; features: string[] } {
  const config = getGraphConfig();
  const connected = isGraphAvailable();

  const features: string[] = [];
  if (config.calendarEnabled) features.push('Calendar');
  if (config.mailEnabled) features.push('Mail');
  if (config.presenceEnabled) features.push('Presence');
  if (config.peopleEnabled) features.push('People');

  return { enabled: config.enabled, connected, features };
}
