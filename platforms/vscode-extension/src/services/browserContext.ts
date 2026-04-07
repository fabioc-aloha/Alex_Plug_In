/**
 * Browser Context Service — v7.2.0
 *
 * Tracks URLs referenced during chat sessions so the Researcher agent
 * and other workflows can reference web pages opened mid-session.
 *
 * VS Code 1.115 unlocks:
 *   - Chat tracks and links browser tabs opened during a session
 *   - Agents can reference open web pages via chat context
 *
 * This service:
 *   - Captures URLs from chat references (browser tabs attached to context)
 *   - Captures URLs from fetch_webpage tool calls (detected in responses)
 *   - Stores them in the episodic draft via addReferencedUrl()
 *   - Provides prompt context for the Researcher agent
 *   - Persists URL references in episodic records for future recall
 *
 * @see ROADMAP.md — v7.2.0 #11 Research Browser Context Integration
 */

import * as vscode from "vscode";
import { addReferencedUrl } from "./episodicMemory";
import { sessionTrace } from "./sessionTrace";
import { logInfo } from "../shared/logger";

// ============================================================================
// Types
// ============================================================================

export interface BrowserReference {
  /** The URL of the page */
  url: string;
  /** Page title if available */
  title?: string;
  /** When the reference was captured */
  capturedAt: number;
  /** How the URL was captured: chat attachment, response link, or tool call */
  source: "chat-attachment" | "response-link" | "tool-call";
}

// ============================================================================
// Service
// ============================================================================

const MAX_REFERENCES = 30;

class BrowserContextService {
  private _references: BrowserReference[] = [];

  /**
   * Extract and track URLs from a chat request's references.
   * VS Code 1.115 attaches browser tabs as references with URI values.
   */
  captureFromChatRequest(request: vscode.ChatRequest): void {
    for (const ref of request.references) {
      if (ref.value instanceof vscode.Uri) {
        const uri = ref.value;
        // Only capture http(s) URIs (browser tabs), not file:// URIs
        if (uri.scheme === "http" || uri.scheme === "https") {
          this._addReference(uri.toString(), "chat-attachment");
        }
      }
    }
  }

  /**
   * Extract URLs from a model response text.
   * Catches URLs mentioned in responses (e.g., from fetch_webpage tool results).
   */
  captureFromResponse(responseText: string): void {
    // Match URLs in markdown links and plain URLs
    const urlPattern = /https?:\/\/[^\s)\]>"']+/g;
    const matches = responseText.match(urlPattern);
    if (!matches) {
      return;
    }

    // Deduplicate within this batch
    const seen = new Set<string>();
    for (const url of matches) {
      // Clean trailing punctuation
      const cleaned = url.replace(/[.,;:!?]+$/, "");
      if (!seen.has(cleaned)) {
        seen.add(cleaned);
        this._addReference(cleaned, "response-link");
      }
    }
  }

  /**
   * Explicitly track a URL (e.g., from a tool call).
   */
  trackUrl(url: string, title?: string): void {
    this._addReference(url, "tool-call", title);
  }

  /**
   * Get all references captured in the current session.
   */
  get references(): readonly BrowserReference[] {
    return this._references;
  }

  /**
   * Get unique URLs captured in the current session.
   */
  get urls(): string[] {
    return [...new Set(this._references.map((r) => r.url))];
  }

  /**
   * Build a prompt context section with referenced URLs.
   * Injected into the Researcher agent's system prompt.
   */
  buildPromptContext(): string {
    const urls = this.urls;
    if (urls.length === 0) {
      return "";
    }

    const lines = [
      "## Session Browser Context",
      "The following web pages were referenced during this session:",
      "",
    ];

    for (const ref of this._references) {
      const title = ref.title ? ` — ${ref.title}` : "";
      const source =
        ref.source === "chat-attachment"
          ? "📎"
          : ref.source === "tool-call"
            ? "🔧"
            : "🔗";
      lines.push(`- ${source} ${ref.url}${title}`);
    }

    lines.push(
      "",
      "You can reference these pages for context without re-fetching them.",
    );
    return lines.join("\n");
  }

  /**
   * Reset for a new session.
   */
  reset(): void {
    this._references = [];
  }

  // ========================================================================
  // Internal
  // ========================================================================

  private _addReference(
    url: string,
    source: BrowserReference["source"],
    title?: string,
  ): void {
    // Skip duplicates
    if (this._references.some((r) => r.url === url)) {
      return;
    }

    if (this._references.length >= MAX_REFERENCES) {
      this._references.shift();
    }

    const ref: BrowserReference = {
      url,
      title,
      capturedAt: Date.now(),
      source,
    };

    this._references.push(ref);

    // Also persist in episodic draft
    addReferencedUrl(url);

    sessionTrace.record("tool-result", "Researcher", `browser-ref: ${url}`, {
      source,
    });
    logInfo(`[BrowserContext] Captured URL (${source}): ${url}`);
  }
}

export const browserContext = new BrowserContextService();
