/**
 * Session Trace Service - v7.1.0
 *
 * Lightweight session tracing inspired by Copilot Chat's 3-layer trajectory
 * architecture (RequestLogger -> TrajectoryLoggerAdapter -> TrajectoryLogger).
 *
 * This is a bounded, in-memory trace of the current session: model requests,
 * tool invocations, agent handoffs, and stream enrichment events. Designed for
 * meditation analysis and debugging, not for telemetry or persistence.
 *
 * Architecture: Single-layer (no OpenTelemetry, no ATIF), bounded to MAX_EVENTS.
 */

import { EventEmitter, Event } from "vscode";

// ============================================================================
// Types
// ============================================================================

export type TraceEventKind =
  | "model-request"
  | "model-response"
  | "tool-call"
  | "tool-result"
  | "agent-handoff"
  | "stream-enrichment"
  | "error";

export interface TraceEvent {
  readonly id: number;
  readonly kind: TraceEventKind;
  readonly timestamp: number;
  readonly agent: string;
  readonly detail: string;
  readonly meta?: Record<string, string | number | boolean>;
}

export interface SessionSummary {
  readonly sessionStart: number;
  readonly eventCount: number;
  readonly modelRequests: number;
  readonly toolCalls: number;
  readonly handoffs: number;
  readonly errors: number;
  readonly durationMs: number;
  readonly agentsUsed: string[];
}

// ============================================================================
// Service
// ============================================================================

const MAX_EVENTS = 200;

class SessionTraceService {
  private _events: TraceEvent[] = [];
  private _nextId = 1;
  private _sessionStart = Date.now();
  private _onDidChange = new EventEmitter<TraceEvent>();
  readonly onDidChange: Event<TraceEvent> = this._onDidChange.event;

  /** Record a trace event */
  record(
    kind: TraceEventKind,
    agent: string,
    detail: string,
    meta?: Record<string, string | number | boolean>,
  ): TraceEvent {
    const event: TraceEvent = {
      id: this._nextId++,
      kind,
      timestamp: Date.now(),
      agent,
      detail: detail.slice(0, 200),
      meta,
    };
    this._events.push(event);
    if (this._events.length > MAX_EVENTS) {
      this._events.shift();
    }
    this._onDidChange.fire(event);
    return event;
  }

  /** Shorthand: record a model request */
  modelRequest(
    agent: string,
    modelId: string,
    tokenEstimate?: number,
  ): TraceEvent {
    return this.record(
      "model-request",
      agent,
      modelId,
      tokenEstimate ? { tokens: tokenEstimate } : undefined,
    );
  }

  /** Shorthand: record a tool call */
  toolCall(agent: string, toolName: string, success: boolean): TraceEvent {
    return this.record(success ? "tool-call" : "error", agent, toolName, {
      success,
    });
  }

  /** Shorthand: record an agent handoff */
  handoff(fromAgent: string, toAgent: string): TraceEvent {
    return this.record("agent-handoff", fromAgent, `-> ${toAgent}`);
  }

  /** Get session summary for meditation export */
  getSummary(): SessionSummary {
    const agentSet = new Set<string>();
    let modelRequests = 0;
    let toolCalls = 0;
    let handoffs = 0;
    let errors = 0;

    for (const e of this._events) {
      agentSet.add(e.agent);
      switch (e.kind) {
        case "model-request":
          modelRequests++;
          break;
        case "tool-call":
          toolCalls++;
          break;
        case "agent-handoff":
          handoffs++;
          break;
        case "error":
          errors++;
          break;
      }
    }

    return {
      sessionStart: this._sessionStart,
      eventCount: this._events.length,
      modelRequests,
      toolCalls,
      handoffs,
      errors,
      durationMs: Date.now() - this._sessionStart,
      agentsUsed: Array.from(agentSet),
    };
  }

  /** Get recent events (newest first) */
  getRecent(count = 20): readonly TraceEvent[] {
    return this._events.slice(-count).reverse();
  }

  /** Get all events for a specific agent */
  getByAgent(agent: string): readonly TraceEvent[] {
    return this._events.filter((e) => e.agent === agent);
  }

  /** Format summary as markdown for /status or meditation */
  formatSummaryMarkdown(): string {
    const s = this.getSummary();
    const duration =
      s.durationMs < 60_000
        ? `${(s.durationMs / 1000).toFixed(0)}s`
        : `${(s.durationMs / 60_000).toFixed(1)}min`;

    return [
      "### Session Trace",
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Duration | ${duration} |`,
      `| Model Requests | ${s.modelRequests} |`,
      `| Tool Calls | ${s.toolCalls} |`,
      `| Agent Handoffs | ${s.handoffs} |`,
      `| Errors | ${s.errors} |`,
      `| Agents Used | ${s.agentsUsed.join(", ") || "none"} |`,
    ].join("\n");
  }

  /** Reset for a new session */
  reset(): void {
    this._events = [];
    this._nextId = 1;
    this._sessionStart = Date.now();
  }
}

export const sessionTrace = new SessionTraceService();
