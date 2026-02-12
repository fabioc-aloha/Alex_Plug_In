/**
 * Microsoft Graph Integration Module
 *
 * Provides access to Microsoft 365 services through the Graph API:
 * - Calendar: Read upcoming events, meeting context
 * - Mail: Recent emails for context awareness
 * - Presence: User availability status
 * - People: Frequent contacts and org hierarchy
 *
 * Enhanced with FishbowlGovernance heir patterns:
 * - Custom error types (GraphApiError, GraphRateLimitError)
 * - Automatic retry with exponential backoff on 429/5xx
 * - Configurable timeouts via AbortController
 * - JSON batching with auto-chunking for unlimited requests
 * - Structured logging for audit trail
 *
 * Rate Limits (per app + tenant):
 *   - Most endpoints: 10,000 requests / 10 minutes
 *   - Mail send: 10,000 / 10 minutes
 *   - Reports: 200 / 10 minutes
 *   - Security: 150 / 10 minutes
 *
 * @module enterprise/microsoftGraph
 * @version 5.6.5
 */

import * as vscode from 'vscode';
import { getCurrentUser, isEnterpriseMode } from './enterpriseAuth';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const GRAPH_API_BETA = 'https://graph.microsoft.com/beta';
const MAX_BATCH_SIZE = 20;
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_MAX_RETRIES = 3;

// ---------------------------------------------------------------------------
// Custom Error Types (FishbowlGovernance pattern)
// ---------------------------------------------------------------------------

/**
 * Error thrown when Graph API returns 429 Too Many Requests
 */
export class GraphRateLimitError extends Error {
  public readonly retryAfter: number;

  constructor(retryAfter: number, message = '') {
    super(`Rate limited. Retry after ${retryAfter}s. ${message}`);
    this.name = 'GraphRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when Graph API returns an error response
 */
export class GraphApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(`Graph API ${statusCode} (${errorCode}): ${message}`);
    this.name = 'GraphApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

// ---------------------------------------------------------------------------
// Request Configuration
// ---------------------------------------------------------------------------

export interface GraphRequestConfig {
  /** Request timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
  /** Maximum retry attempts (default: 3) */
  maxRetries?: number;
  /** Use beta API endpoint (default: false) */
  useBeta?: boolean;
  /** Throw errors instead of returning null (default: false) */
  throwOnError?: boolean;
}

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

// ---------------------------------------------------------------------------
// Core Request Function (FishbowlGovernance pattern)
// ---------------------------------------------------------------------------

/**
 * Make an authenticated Graph API request with comprehensive error handling.
 *
 * Features:
 * - Automatic retry with exponential backoff on 429/5xx
 * - Configurable timeout via AbortController
 * - Structured error types for catch handling
 * - Audit logging for all operations
 *
 * @param method - HTTP method
 * @param endpoint - Graph endpoint (e.g., "/me") or full URL for pagination
 * @param options - Fetch options (body, headers, etc.)
 * @param config - Request configuration (timeout, retries, etc.)
 */
async function graphRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  options: RequestInit = {},
  config: GraphRequestConfig = {}
): Promise<T | null> {
  const user = getCurrentUser();
  if (!user) {
    console.warn('[Graph] No authenticated user');
    return null;
  }

  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    useBeta = false,
    throwOnError = false,
  } = config;

  // Build full URL if relative path given
  const baseUrl = useBeta ? GRAPH_API_BETA : GRAPH_API_BASE;
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        ...options,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ConsistencyLevel: 'eventual',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '10');
        if (attempt < maxRetries) {
          console.warn(
            `[Graph] Rate limited (attempt ${attempt + 1}/${maxRetries + 1}), waiting ${retryAfter}s`
          );
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          continue;
        }
        if (throwOnError) {
          throw new GraphRateLimitError(retryAfter);
        }
        return null;
      }

      // Handle server errors (5xx) with exponential backoff
      if (response.status >= 500) {
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.warn(
            `[Graph] Server error ${response.status} (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${backoffMs}ms`
          );
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Handle client errors (4xx)
      if (!response.ok) {
        console.error(`[Graph] API error: ${response.status} ${response.statusText}`);

        if (response.status === 401) {
          vscode.window.showWarningMessage('Microsoft Graph session expired. Please sign in again.');
        }

        if (throwOnError) {
          let errorCode = 'Unknown';
          let errorMessage = response.statusText;
          try {
            const errorData = await response.json() as { error?: { code?: string; message?: string } };
            errorCode = errorData?.error?.code || 'Unknown';
            errorMessage = errorData?.error?.message || response.statusText;
          } catch {
            // Ignore JSON parse errors
          }
          throw new GraphApiError(response.status, errorCode, errorMessage);
        }
        return null;
      }

      // Success - parse JSON response
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }
      return (await response.text()) as unknown as T;

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout (AbortError)
      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          console.warn(
            `[Graph] Request timeout (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${backoffMs}ms`
          );
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        console.error('[Graph] Request timed out after all retries');
      }

      // Re-throw custom errors
      if (error instanceof GraphApiError || error instanceof GraphRateLimitError) {
        throw error;
      }

      console.error('[Graph] Request failed:', error);
      if (attempt === maxRetries) {
        if (throwOnError) {
          throw new GraphApiError(0, 'NetworkError', String(error));
        }
        return null;
      }
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Convenience Methods (FishbowlGovernance pattern)
// ---------------------------------------------------------------------------

/** GET request to Graph API */
export async function graphGet<T>(
  endpoint: string,
  config?: GraphRequestConfig
): Promise<T | null> {
  return graphRequest<T>('GET', endpoint, {}, config);
}

/** POST request to Graph API */
export async function graphPost<T>(
  endpoint: string,
  body?: unknown,
  config?: GraphRequestConfig
): Promise<T | null> {
  return graphRequest<T>('POST', endpoint, { body: JSON.stringify(body) }, config);
}

/** PATCH request to Graph API */
export async function graphPatch<T>(
  endpoint: string,
  body?: unknown,
  config?: GraphRequestConfig
): Promise<T | null> {
  return graphRequest<T>('PATCH', endpoint, { body: JSON.stringify(body) }, config);
}

/** DELETE request to Graph API */
export async function graphDelete<T>(
  endpoint: string,
  config?: GraphRequestConfig
): Promise<T | null> {
  return graphRequest<T>('DELETE', endpoint, {}, config);
}

// ---------------------------------------------------------------------------
// Pagination (FishbowlGovernance pattern)
// ---------------------------------------------------------------------------

/**
 * Fetch all pages of a paginated Graph API response.
 * Uses @odata.nextLink for automatic pagination with rate limit handling.
 *
 * @param endpoint - Graph endpoint (e.g., "/users")
 * @param maxItems - Maximum items to return (default: unlimited)
 * @param config - Request configuration
 */
async function graphGetAll<T>(
  endpoint: string,
  maxItems?: number,
  config?: GraphRequestConfig
): Promise<T[]> {
  const results: T[] = [];
  let url: string | null = endpoint;

  while (url) {
    type PageResponse = { value?: T[]; '@odata.nextLink'?: string };
    const data: PageResponse | null = await graphGet<PageResponse>(url, config);

    if (!data) {
      break;
    }

    results.push(...(data.value || []));

    // Check max items limit
    if (maxItems && results.length >= maxItems) {
      return results.slice(0, maxItems);
    }

    // Get next page URL (can be full URL)
    url = data['@odata.nextLink'] || null;
  }

  return results;
}

// ---------------------------------------------------------------------------
// Batching (FishbowlGovernance pattern)
// ---------------------------------------------------------------------------

/**
 * Batch request interface for JSON batching
 */
export interface GraphBatchRequest {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface GraphBatchResponse<T> {
  id: string;
  status: number;
  body: T;
  headers?: Record<string, string>;
}

/**
 * Execute up to 20 Graph API requests in a single $batch call.
 *
 * @param requests - List of batch requests (max 20)
 * @param config - Request configuration
 * @returns Map of request ID to response body
 * @throws GraphApiError if throwOnError is true and batch fails
 */
async function graphBatch<T>(
  requests: GraphBatchRequest[],
  config?: GraphRequestConfig
): Promise<Map<string, T>> {
  if (requests.length === 0) {
    return new Map();
  }

  if (requests.length > MAX_BATCH_SIZE) {
    console.warn(
      `[Graph] Batch limit is ${MAX_BATCH_SIZE} requests, got ${requests.length}. Use graphBatchAll() for unlimited.`
    );
    requests = requests.slice(0, MAX_BATCH_SIZE);
  }

  const batchPayload = {
    requests: requests.map((req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      ...(req.body ? { body: req.body } : {}),
      ...(req.headers ? { headers: req.headers } : {}),
    })),
  };

  const response = await graphPost<{ responses: Array<GraphBatchResponse<T>> }>(
    '/$batch',
    batchPayload,
    config
  );

  if (!response) {
    return new Map();
  }

  const results = new Map<string, T>();

  // Sort responses by original request order
  const idOrder = new Map(requests.map((req, i) => [req.id, i]));
  const sortedResponses = [...(response.responses || [])].sort(
    (a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0)
  );

  for (const resp of sortedResponses) {
    if (resp.status >= 200 && resp.status < 300) {
      results.set(resp.id, resp.body);
    } else {
      console.warn(`[Graph] Batch request ${resp.id} failed: ${resp.status}`);
    }
  }

  return results;
}

/**
 * Execute any number of requests via batching (auto-chunks to 20).
 * FishbowlGovernance heir pattern for unlimited batch operations.
 *
 * @param requests - List of batch requests (any size)
 * @param config - Request configuration
 * @returns Map of request ID to response body
 */
async function graphBatchAll<T>(
  requests: GraphBatchRequest[],
  config?: GraphRequestConfig
): Promise<Map<string, T>> {
  const allResults = new Map<string, T>();

  for (let i = 0; i < requests.length; i += MAX_BATCH_SIZE) {
    const chunk = requests.slice(i, i + MAX_BATCH_SIZE);
    const chunkResults = await graphBatch<T>(chunk, config);

    for (const [id, body] of chunkResults) {
      allResults.set(id, body);
    }
  }

  return allResults;
}

/**
 * Helper to build a batch request with auto-generated ID
 */
export function buildBatchRequest(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body?: unknown,
  requestId?: string
): GraphBatchRequest {
  return {
    id: requestId || Math.random().toString(36).substring(2, 10),
    method,
    url,
    body,
  };
}

/**
 * Get upcoming calendar events
 */
export async function getCalendarEvents(
  daysAhead?: number
): Promise<GraphCalendarEvent[]> {
  const config = getGraphConfig();
  if (!config.calendarEnabled) {return [];}

  const days = daysAhead ?? config.calendarDaysAhead;
  const startDateTime = new Date().toISOString();
  const endDateTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const response = await graphGet<{ value: GraphCalendarEvent[] }>(
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
  if (!config.mailEnabled) {return [];}

  const count = maxMessages ?? config.mailMaxMessages;
  const filter = unreadOnly ? '&$filter=isRead eq false' : '';

  const response = await graphGet<{ value: GraphMailMessage[] }>(
    `/me/messages?$top=${count}&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,bodyPreview,isRead,importance,hasAttachments${filter}`
  );

  return response?.value ?? [];
}

/**
 * Get user presence (online/offline/busy status)
 */
export async function getPresence(): Promise<GraphPresence | null> {
  const config = getGraphConfig();
  if (!config.presenceEnabled) {return null;}

  return graphGet<GraphPresence>('/me/presence');
}

/**
 * Get presence for multiple users
 */
export async function getBatchPresence(userIds: string[]): Promise<Map<string, GraphPresence>> {
  const config = getGraphConfig();
  if (!config.presenceEnabled) {return new Map();}

  const response = await graphPost<{ responses: Array<{ id: string; body: GraphPresence }> }>(
    '/communications/getPresencesByUserId',
    { ids: userIds }
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
  if (!config.peopleEnabled) {return [];}

  const response = await graphGet<{ value: GraphPerson[] }>(
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
  if (!config.peopleEnabled) {return [];}

  const response = await graphGet<{ value: GraphPerson[] }>(
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
  if (!nextMeeting) {return null;}

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
  if (config.calendarEnabled) {features.push('Calendar');}
  if (config.mailEnabled) {features.push('Mail');}
  if (config.presenceEnabled) {features.push('Presence');}
  if (config.peopleEnabled) {features.push('People');}

  return { enabled: config.enabled, connected, features };
}

// ===========================================================================
// Service Health Module (FishbowlGovernance heir pattern)
// ===========================================================================

/**
 * M365 Service health status
 */
export interface ServiceHealthStatus {
  service: string;
  status: 'serviceOperational' | 'investigating' | 'restoringService' | 'extendedRecovery' | 'serviceDegradation' | 'serviceInterruption';
  isActive: boolean;
}

/**
 * Service health issue/incident
 */
export interface ServiceHealthIssue {
  id: string;
  title: string;
  service: string;
  status: string;
  classification: 'advisory' | 'incident';
  impactDescription: string;
  isResolved: boolean;
  startDateTime?: string;
  lastModifiedDateTime?: string;
}

// Services relevant to Alex/enterprise integration
const ALEX_RELATED_SERVICES = new Set([
  'Microsoft 365 suite',
  'Power BI',
  'Microsoft Fabric',
  'SharePoint Online',
  'Exchange Online',
  'Microsoft Teams',
  'OneDrive for Business',
  'Microsoft Entra',
]);

/**
 * Get M365 service health overview
 * Requires: ServiceHealth.Read.All scope
 */
export async function getServiceHealth(): Promise<ServiceHealthStatus[]> {
  const response = await graphGet<{ value: ServiceHealthStatus[] }>(
    '/admin/serviceAnnouncement/healthOverviews'
  );
  return response?.value ?? [];
}

/**
 * Get active service health issues (incidents and advisories)
 * Requires: ServiceHealth.Read.All scope
 */
export async function getActiveServiceIssues(): Promise<ServiceHealthIssue[]> {
  const response = await graphGet<{ value: ServiceHealthIssue[] }>(
    '/admin/serviceAnnouncement/issues?$filter=isResolved eq false&$orderby=lastModifiedDateTime desc'
  );
  return response?.value ?? [];
}

/**
 * Get service health issues affecting Alex-related services
 */
export async function getAlexRelatedIssues(): Promise<ServiceHealthIssue[]> {
  const issues = await getActiveServiceIssues();
  return issues.filter((i) => ALEX_RELATED_SERVICES.has(i.service));
}

/**
 * Format service health for display
 */
export function formatServiceHealth(services: ServiceHealthStatus[]): string {
  const unhealthy = services.filter((s) => s.status !== 'serviceOperational');

  if (unhealthy.length === 0) {
    return '🟢 All services operational';
  }

  const lines = unhealthy.map((s) => {
    const icon = s.status === 'serviceInterruption' ? '🔴' : '🟡';
    return `${icon} **${s.service}**: ${s.status}`;
  });

  return lines.join('\n');
}

// ===========================================================================
// SharePoint/OneDrive Module (FishbowlGovernance heir pattern)
// ===========================================================================

/**
 * Drive item (file or folder) from SharePoint/OneDrive
 */
export interface DriveItem {
  id: string;
  name: string;
  webUrl: string;
  size?: number;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  mimeType?: string;
}

// Simple upload limit: 4 MB
const SIMPLE_UPLOAD_LIMIT = 4 * 1024 * 1024;

/**
 * Upload a file to OneDrive (current user's drive)
 * Uses simple upload for files < 4 MB
 * Requires: Files.ReadWrite scope
 *
 * @param content - File content as Uint8Array
 * @param remotePath - Path in OneDrive (e.g., "Alex-Memory/reports/weekly.json")
 * @param conflictBehavior - 'replace' | 'rename' | 'fail'
 */
export async function uploadToOneDrive(
  content: Uint8Array,
  remotePath: string,
  conflictBehavior: 'replace' | 'rename' | 'fail' = 'replace'
): Promise<DriveItem | null> {
  if (content.length > SIMPLE_UPLOAD_LIMIT) {
    console.warn('[Graph] File > 4MB, use upload session for large files');
    return null;
  }

  const user = getCurrentUser();
  if (!user) {return null;}

  // Simple upload via PUT
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(
      `${GRAPH_API_BASE}/me/drive/root:/${remotePath}:/content?@microsoft.graph.conflictBehavior=${conflictBehavior}`,
      {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: content,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Graph] OneDrive upload error: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as DriveItem;
    console.log(`[Graph] Uploaded ${remotePath} (${content.length} bytes)`);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[Graph] OneDrive upload failed:', error);
    return null;
  }
}

/**
 * List files in a OneDrive folder
 * Requires: Files.Read scope
 */
export async function listOneDriveFolder(folderPath: string): Promise<DriveItem[]> {
  const response = await graphGet<{ value: DriveItem[] }>(
    `/me/drive/root:/${folderPath}:/children`
  );
  return response?.value ?? [];
}

/**
 * Download a file from OneDrive
 * Requires: Files.Read scope
 */
export async function downloadFromOneDrive(filePath: string): Promise<ArrayBuffer | null> {
  const user = getCurrentUser();
  if (!user) {return null;}

  try {
    const response = await fetch(
      `${GRAPH_API_BASE}/me/drive/root:/${filePath}:/content`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    if (!response.ok) {
      console.error(`[Graph] OneDrive download error: ${response.status}`);
      return null;
    }

    return response.arrayBuffer();
  } catch (error) {
    console.error('[Graph] OneDrive download failed:', error);
    return null;
  }
}

/**
 * Create a folder in OneDrive
 * Requires: Files.ReadWrite scope
 */
export async function createOneDriveFolder(
  folderPath: string,
  parentPath = ''
): Promise<DriveItem | null> {
  const basePath = parentPath ? `/me/drive/root:/${parentPath}:/children` : '/me/drive/root/children';

  const result = await graphPost<DriveItem>(basePath, {
    name: folderPath,
    folder: {},
    '@microsoft.graph.conflictBehavior': 'fail',
  });

  return result;
}

/**
 * Search files in OneDrive
 * Requires: Files.Read scope
 */
export async function searchOneDrive(query: string, maxResults = 25): Promise<DriveItem[]> {
  const response = await graphGet<{ value: DriveItem[] }>(
    `/me/drive/root/search(q='${encodeURIComponent(query)}')?$top=${maxResults}`
  );
  return response?.value ?? [];
}

// ---------------------------------------------------------------------------
// Test Command (for integration testing)
// ---------------------------------------------------------------------------

/**
 * Test Microsoft Graph integration
 * Run various API calls to verify connectivity and new features
 */
export async function testGraphIntegration(): Promise<void> {
  const output = vscode.window.createOutputChannel('Alex Graph Test');
  output.show();

  output.appendLine('='.repeat(60));
  output.appendLine('Microsoft Graph Integration Test');
  output.appendLine('='.repeat(60));
  output.appendLine('');

  // Test 1: Check Graph availability
  output.appendLine('1. Checking Graph availability...');
  const available = isGraphAvailable();
  output.appendLine(`   Available: ${available}`);
  if (!available) {
    output.appendLine('   ⚠️ Graph not available. Enable enterprise mode in settings.');
    return;
  }
  output.appendLine('   ✅ Graph is available');
  output.appendLine('');

  // Test 2: Basic GET - user profile
  output.appendLine('2. Testing basic GET (/me)...');
  try {
    const me = await graphGet<{ displayName: string; mail: string; id: string }>('/me');
    if (me) {
      output.appendLine(`   ✅ User: ${me.displayName} (${me.mail})`);
    } else {
      output.appendLine('   ❌ Failed to get user profile');
    }
  } catch (err) {
    output.appendLine(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  output.appendLine('');

  // Test 3: Presence
  output.appendLine('3. Testing presence API...');
  try {
    const presence = await getPresence();
    if (presence) {
      output.appendLine(`   ✅ Presence: ${presence.availability} (${presence.activity})`);
    } else {
      output.appendLine('   ⚠️ Presence not available (need Presence.Read scope)');
    }
  } catch (err) {
    output.appendLine(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  output.appendLine('');

  // Test 4: Calendar
  output.appendLine('4. Testing calendar API...');
  try {
    const events = await getCalendarEvents(1);
    output.appendLine(`   ✅ Found ${events.length} upcoming events`);
    if (events.length > 0) {
      output.appendLine(`   Next: ${events[0].subject}`);
    }
  } catch (err) {
    output.appendLine(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  output.appendLine('');

  // Test 5: Service Health (admin scope)
  output.appendLine('5. Testing Service Health API...');
  try {
    const health = await getServiceHealth();
    if (health.length > 0) {
      output.appendLine(`   ✅ Retrieved health for ${health.length} services`);
      const healthy = health.filter(h => h.status === 'serviceDegradation' || h.status === 'serviceInterruption');
      if (healthy.length > 0) {
        output.appendLine(`   ⚠️ ${healthy.length} services have issues`);
      } else {
        output.appendLine('   All services operational');
      }
    } else {
      output.appendLine('   ⚠️ No health data (need ServiceHealth.Read.All scope)');
    }
  } catch (err) {
    if (err instanceof GraphApiError && err.errorCode === 'Authorization_RequestDenied') {
      output.appendLine('   ⚠️ Service Health requires admin consent (ServiceHealth.Read.All)');
    } else {
      output.appendLine(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  output.appendLine('');

  // Test 6: Batching
  output.appendLine('6. Testing batch API...');
  try {
    const requests = [
      buildBatchRequest('GET', '/me', undefined, '1'),
      buildBatchRequest('GET', '/me/presence', undefined, '2'),
      buildBatchRequest('GET', '/me/calendar/events?$top=1', undefined, '3'),
    ];
    const results = await graphBatch<unknown>(requests);
    output.appendLine(`   ✅ Batch: ${results.size}/3 responses received`);
  } catch (err) {
    output.appendLine(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  output.appendLine('');

  // Test 7: OneDrive
  output.appendLine('7. Testing OneDrive API...');
  try {
    const items = await listOneDriveFolder('');
    if (items.length > 0) {
      output.appendLine(`   ✅ OneDrive root has ${items.length} items`);
    } else {
      output.appendLine('   ⚠️ OneDrive root is empty or not accessible');
    }
  } catch (err) {
    output.appendLine(`   ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  output.appendLine('');

  output.appendLine('='.repeat(60));
  output.appendLine('Test complete');
  output.appendLine('='.repeat(60));
}

/**
 * Register the Graph test command
 */
export function registerGraphTestCommand(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('alex.testGraph', testGraphIntegration)
  );
}
