import * as vscode from 'vscode';

/**
 * Chat result metadata for tracking command execution.
 * Shared between participant.ts and handler files.
 */
export interface IAlexChatResult extends vscode.ChatResult {
    metadata: {
        command?: string;
        action?: string;
        mode?: string;
        topic?: string;
        // Additional metadata for specific commands
        error?: string;
        eventCount?: number;
        daysAhead?: number;
        messageCount?: number;
        unreadOnly?: boolean;
        query?: string;
        resultCount?: number;
        /** Coverage level at time of response — used by feedback handler to correlate 👍/👎 with epistemic accuracy */
        coverageLevel?: string;
        /** Topic summary for feedback correlation */
        coverageTopic?: string;
        [key: string]: unknown; // Allow additional properties
    };
}
