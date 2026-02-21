/**
 * Alex Emotional Memory — v5.9.3
 * 
 * Collaborative temperature tracking across sessions.
 * Persists emotional valence to episodic memory so Alex remembers
 * how sessions *felt*, not just what happened.
 * 
 * Architecture:
 *   - Per-message signal accumulation (frustration, success, flow, confusion)
 *   - Session-level emotional arc (how did the session evolve?)
 *   - Cross-session mood history (recent emotional trajectory)
 *   - Prompt injection (mood-aware responses based on recent history)
 * 
 * Privacy: All data stays in .github/episodic/emotional/. No telemetry.
 * 
 * @see ROADMAP-UNIFIED.md — Emotional Memory sub-section in v5.9.3
 */

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

/**
 * Emotional valence for a single message exchange.
 * Not sentiment analysis on words — a reading of the collaborative temperature.
 */
export interface EmotionalSignal {
    timestamp: string;
    /** Frustration level detected (0-3) */
    frustration: number;
    /** Success/breakthrough detected */
    success: boolean;
    /** Flow state indicators (rapid back-and-forth, building on ideas) */
    flow: boolean;
    /** Confusion indicators (repeated questions, contradictions) */
    confusion: boolean;
    /** Excitement indicators (exclamation, enthusiasm words) */
    excitement: boolean;
    /** The message that triggered this signal (first 80 chars, no PII) */
    trigger: string;
}

/**
 * Session emotional summary — the "how it felt" record.
 */
export interface SessionEmotionalArc {
    sessionId: string;
    startTime: string;
    endTime: string;
    /** Number of exchanges in this session */
    exchangeCount: number;
    /** Dominant emotional temperature */
    dominantMood: 'frustrated' | 'productive' | 'creative-flow' | 'struggling' | 'celebratory' | 'neutral';
    /** Emotional trajectory: did the mood improve, worsen, or stay stable? */
    trajectory: 'improving' | 'declining' | 'stable' | 'volatile';
    /** Peak moments */
    peaks: {
        highPoint?: string;  // Best moment description
        lowPoint?: string;   // Toughest moment description
    };
    /** Aggregate scores (0.0 - 1.0) */
    scores: {
        frustration: number;
        success: number;
        flow: number;
        confusion: number;
        excitement: number;
    };
    /** Human-readable summary */
    summary: string;
}

/**
 * Cross-session mood context injected into prompt engine.
 */
export interface MoodContext {
    /** Recent emotional trajectory (last N sessions) */
    recentMood: 'positive' | 'negative' | 'mixed' | 'neutral';
    /** Consecutive sessions with same dominant mood */
    streak: number;
    /** Suggested tone adjustment */
    toneGuidance: string;
    /** Recent session summaries for context */
    recentSessions: Array<{
        date: string;
        mood: string;
        summary: string;
    }>;
}

// ============================================================================
// Constants
// ============================================================================

const EMOTIONAL_DIR = 'emotional';
const SESSION_LOG_FILE = 'session-emotional-log.json';
const MAX_RECENT_SESSIONS = 10;
const FLOW_THRESHOLD_MS = 60000; // Messages within 60s suggest flow state

/**
 * Additional patterns beyond participant.ts frustration/success detection.
 * These detect subtler emotional signals.
 */
const FLOW_PATTERNS = [
    /(?:what if|building on that|and then|even better|actually, let's)/i,
    /(?:oh! |oh,? that|aha|eureka|wait,? i think|yes!|exactly!)/i,
    /(?:keep going|more|next|and also|plus|on top of that)/i,
];

const CONFUSION_PATTERNS = [
    /(?:i don't understand|what do you mean|can you explain|confused|unclear)/i,
    /(?:wait,? what|huh\??|that doesn't make sense|contradicts)/i,
    /(?:but earlier you said|you just said|didn't you say)/i,
    /(?:lost me|over my head|eli5|plain english)/i,
];

const EXCITEMENT_PATTERNS = [
    /(?:amazing!|incredible|brilliant|genius|love (?:it|this)|perfect!)/i,
    /(?:this is (?:so cool|awesome|great)|mind blown|game changer)/i,
    /(?:can't wait|excited|pumped|stoked|let's go!)/i,
    /!{1,}$/,   // Ends with exclamation
];

// ============================================================================
// Session State (in-memory, persisted on session end)
// ============================================================================

let currentSignals: EmotionalSignal[] = [];
let sessionStartTime: string | null = null;
let lastMessageTime: number = 0;

// ============================================================================
// Core API
// ============================================================================

/**
 * Record emotional signals from a chat message.
 * Called on every @alex message in participant.ts.
 * 
 * @param message - The user's message text
 * @param frustrationLevel - Current frustration level from detectEmotionalState (0-3)
 * @param success - Whether success was detected
 */
export function recordEmotionalSignal(
    message: string,
    frustrationLevel: number,
    success: boolean
): EmotionalSignal {
    if (!sessionStartTime) {
        sessionStartTime = new Date().toISOString();
    }

    const now = Date.now();
    const timeSinceLastMessage = lastMessageTime > 0 ? (now - lastMessageTime) : Infinity;
    lastMessageTime = now;

    // Detect additional signals
    const flow = timeSinceLastMessage < FLOW_THRESHOLD_MS && 
                 FLOW_PATTERNS.some(p => p.test(message));
    const confusion = CONFUSION_PATTERNS.some(p => p.test(message));
    const excitement = EXCITEMENT_PATTERNS.some(p => p.test(message));

    // Sanitize trigger (no PII, max 80 chars)
    const trigger = message
        .replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[name]')  // Rough name removal
        .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')   // Email removal
        .substring(0, 80);

    const signal: EmotionalSignal = {
        timestamp: new Date().toISOString(),
        frustration: frustrationLevel,
        success,
        flow,
        confusion,
        excitement,
        trigger
    };

    currentSignals.push(signal);
    return signal;
}

/**
 * Compute the emotional arc for the current session.
 * Call this when the session is ending (chat closes, user stops, timer ends).
 */
export function computeSessionArc(): SessionEmotionalArc | null {
    if (currentSignals.length === 0) {
        return null;
    }

    const exchangeCount = currentSignals.length;
    const endTime = new Date().toISOString();

    // Aggregate scores (normalize to 0-1)
    const scores = {
        frustration: currentSignals.reduce((s, sig) => s + sig.frustration, 0) / (exchangeCount * 3),
        success: currentSignals.filter(s => s.success).length / exchangeCount,
        flow: currentSignals.filter(s => s.flow).length / exchangeCount,
        confusion: currentSignals.filter(s => s.confusion).length / exchangeCount,
        excitement: currentSignals.filter(s => s.excitement).length / exchangeCount,
    };

    // Determine dominant mood
    const dominantMood = determineDominantMood(scores);

    // Determine trajectory
    const trajectory = determineTrajectory(currentSignals);

    // Find peak moments
    const peaks = findPeakMoments(currentSignals);

    // Generate human-readable summary
    const summary = generateArcSummary(dominantMood, trajectory, scores, exchangeCount);

    const arc: SessionEmotionalArc = {
        sessionId: `session-${sessionStartTime?.replace(/[:.]/g, '-') || Date.now()}`,
        startTime: sessionStartTime || endTime,
        endTime,
        exchangeCount,
        dominantMood,
        trajectory,
        peaks,
        scores,
        summary,
    };

    return arc;
}

/**
 * Save the current session's emotional arc to episodic memory.
 * Creates/appends to .github/episodic/emotional/session-emotional-log.json
 */
export async function saveSessionEmotion(workspaceRoot: string): Promise<string | null> {
    const arc = computeSessionArc();
    if (!arc || arc.exchangeCount < 2) {
        // Don't save trivial sessions (< 2 exchanges)
        return null;
    }

    const emotionalDir = path.join(workspaceRoot, '.github', 'episodic', EMOTIONAL_DIR);
    const logPath = path.join(emotionalDir, SESSION_LOG_FILE);

    try {
        await fs.ensureDir(emotionalDir);

        // Load existing log
        let sessions: SessionEmotionalArc[] = [];
        if (await fs.pathExists(logPath)) {
            try {
                sessions = await fs.readJson(logPath);
            } catch {
                sessions = [];
            }
        }

        // Append current arc
        sessions.push(arc);

        // Keep only recent sessions (prevent unbounded growth)
        if (sessions.length > MAX_RECENT_SESSIONS * 3) {
            sessions = sessions.slice(-MAX_RECENT_SESSIONS * 3);
        }

        await fs.writeJson(logPath, sessions, { spaces: 2 });

        // Reset in-memory state
        resetEmotionalState();

        return logPath;
    } catch (err) {
        console.warn('[EmotionalMemory] Failed to save session emotion:', err);
        return null;
    }
}

/**
 * Load recent mood context for prompt injection.
 * Returns guidance for the prompt engine based on emotional trajectory.
 */
export async function loadMoodContext(workspaceRoot: string): Promise<MoodContext | null> {
    const logPath = path.join(workspaceRoot, '.github', 'episodic', EMOTIONAL_DIR, SESSION_LOG_FILE);

    if (!await fs.pathExists(logPath)) {
        return null;
    }

    try {
        const sessions: SessionEmotionalArc[] = await fs.readJson(logPath);
        if (sessions.length === 0) {
            return null;
        }

        // Get recent sessions (last N)
        const recent = sessions.slice(-MAX_RECENT_SESSIONS);

        // Determine overall mood
        const moodCounts = { positive: 0, negative: 0, neutral: 0 };
        for (const s of recent) {
            if (['creative-flow', 'celebratory', 'productive'].includes(s.dominantMood)) {
                moodCounts.positive++;
            } else if (['frustrated', 'struggling'].includes(s.dominantMood)) {
                moodCounts.negative++;
            } else {
                moodCounts.neutral++;
            }
        }

        let recentMood: MoodContext['recentMood'];
        if (moodCounts.positive > moodCounts.negative * 2) {
            recentMood = 'positive';
        } else if (moodCounts.negative > moodCounts.positive * 2) {
            recentMood = 'negative';
        } else if (moodCounts.positive > 0 && moodCounts.negative > 0) {
            recentMood = 'mixed';
        } else {
            recentMood = 'neutral';
        }

        // Calculate streak
        let streak = 1;
        const lastMood = recent[recent.length - 1].dominantMood;
        for (let i = recent.length - 2; i >= 0; i--) {
            if (recent[i].dominantMood === lastMood) {
                streak++;
            } else {
                break;
            }
        }

        // Generate tone guidance
        const toneGuidance = generateToneGuidance(recentMood, streak, recent);

        // Build recent session summaries (last 3)
        const recentSessions = recent.slice(-3).map(s => ({
            date: s.startTime.split('T')[0],
            mood: s.dominantMood,
            summary: s.summary,
        }));

        return {
            recentMood,
            streak,
            toneGuidance,
            recentSessions,
        };
    } catch (err) {
        console.warn('[EmotionalMemory] Failed to load mood context:', err);
        return null;
    }
}

/**
 * Get a meditation-focused emotional review.
 * Surfaces patterns for self-improvement during meditation phases.
 */
export async function getMeditationEmotionalReview(workspaceRoot: string): Promise<string | null> {
    const logPath = path.join(workspaceRoot, '.github', 'episodic', EMOTIONAL_DIR, SESSION_LOG_FILE);

    if (!await fs.pathExists(logPath)) {
        return null;
    }

    try {
        const sessions: SessionEmotionalArc[] = await fs.readJson(logPath);
        if (sessions.length < 3) {
            return null; // Need at least 3 sessions for meaningful patterns
        }

        const recent = sessions.slice(-MAX_RECENT_SESSIONS);
        const lines: string[] = ['## Emotional Pattern Review'];

        // Overall trajectory
        const avgFrustration = recent.reduce((s, r) => s + r.scores.frustration, 0) / recent.length;
        const avgFlow = recent.reduce((s, r) => s + r.scores.flow, 0) / recent.length;
        const avgSuccess = recent.reduce((s, r) => s + r.scores.success, 0) / recent.length;

        lines.push('');
        lines.push(`**Across ${recent.length} recent sessions**:`);
        lines.push(`- Average frustration: ${(avgFrustration * 100).toFixed(0)}%`);
        lines.push(`- Flow state frequency: ${(avgFlow * 100).toFixed(0)}%`);
        lines.push(`- Success rate: ${(avgSuccess * 100).toFixed(0)}%`);

        // Frustration trend
        if (avgFrustration > 0.4) {
            lines.push('');
            lines.push(`⚠️ **High frustration detected** — Last ${recent.length} sessions averaged ${(avgFrustration * 100).toFixed(0)}% frustration. Consider:`);
            lines.push('  - Simplifying the current debugging workflow');
            lines.push('  - Breaking large tasks into smaller wins');
            lines.push('  - More frequent Pomodoro breaks');
        }

        // Flow trend
        if (avgFlow > 0.3) {
            lines.push('');
            lines.push(`🌊 **Good flow state engagement** — ${(avgFlow * 100).toFixed(0)}% of exchanges showed flow indicators. Keep doing what works.`);
        }

        // Session-by-session micro-review
        lines.push('');
        lines.push('**Session Timeline**:');
        for (const s of recent.slice(-5)) {
            const date = s.startTime.split('T')[0];
            const moodEmoji = getMoodEmoji(s.dominantMood);
            lines.push(`- ${date}: ${moodEmoji} ${s.dominantMood} (${s.exchangeCount} exchanges) — ${s.summary}`);
        }

        return lines.join('\n');
    } catch (err) {
        console.warn('[EmotionalMemory] Failed to generate meditation review:', err);
        return null;
    }
}

/**
 * Reset emotional tracking state.
 * Called at session end or on participant deactivation.
 */
export function resetEmotionalState(): void {
    currentSignals = [];
    sessionStartTime = null;
    lastMessageTime = 0;
}

/**
 * Get current signal count (for status display).
 */
export function getCurrentSignalCount(): number {
    return currentSignals.length;
}

// ============================================================================
// Siegel-Inspired Session Health (v5.9.3)
// Based on: Interpersonal Neurobiology (Siegel, 1999/2020)
// ============================================================================

export type RiverZone = 'chaos' | 'flow' | 'rigidity';
export type WindowZone = 'hyperarousal' | 'within' | 'hypoarousal';

export interface RiverAssessment {
    zone: RiverZone;
    /** Positive drifts toward chaos, negative toward rigidity */
    driftScore: number;
    /** Non-null when session needs course correction */
    warning?: string;
}

export interface WindowAssessment {
    zone: WindowZone;
    /** Tone/length adaptation guidance; empty string when within window */
    adaptation: string;
}

/**
 * River of Integration (Siegel, 2010a):
 * Assess whether the current session is drifting toward chaos or rigidity.
 *
 * Chaos    — High frustration rate, escalating signals, volatile swings.
 * Rigidity — Persistent confusion, no progress, repetitive stuckness.
 * Flow     — Balanced, progressing, mix of challenge and resolution.
 */
export function assessRiverOfIntegration(): RiverAssessment {
    if (currentSignals.length < 3) {
        return { zone: 'flow', driftScore: 0 };
    }

    const recent = currentSignals.slice(-10);
    const frustrationRate = recent.filter(s => s.frustration >= 2).length / recent.length;
    const confusionRate   = recent.filter(s => s.confusion).length / recent.length;
    const flowRate        = recent.filter(s => s.flow || s.success || s.excitement).length / recent.length;

    // Detect escalating frustration: last 3 vs prior 3
    const recentThree    = currentSignals.slice(-3);
    const priorThree     = currentSignals.slice(-6, -3);
    const recentFrustAvg = recentThree.reduce((s, sig) => s + sig.frustration, 0) / 3;
    const priorFrustAvg  = priorThree.length > 0
        ? priorThree.reduce((s, sig) => s + sig.frustration, 0) / priorThree.length
        : recentFrustAvg;
    const escalating = recentFrustAvg - priorFrustAvg > 0.5;

    // Drift score: positive = chaos side, negative = rigidity side
    const driftScore = (frustrationRate * 2 + (escalating ? 1 : 0)) - (confusionRate * 0.5 + flowRate * 1.5);

    if (driftScore > 1.0 || frustrationRate > 0.5) {
        return {
            zone: 'chaos',
            driftScore,
            warning: 'Session drifting toward chaos: slow down, validate first, one concrete step at a time.',
        };
    }

    if (driftScore < -0.8 || (confusionRate > 0.4 && flowRate < 0.2)) {
        return {
            zone: 'rigidity',
            driftScore,
            warning: 'Session may be stuck: offer a new angle, break the pattern, or suggest stepping back.',
        };
    }

    return { zone: 'flow', driftScore };
}

/**
 * Window of Tolerance (Siegel, 1999/2020):
 * Detect whether the user is operating within, above (hyperarousal),
 * or below (hypoarousal) their optimal zone.
 */
export function assessWindowOfTolerance(): WindowAssessment {
    if (currentSignals.length < 2) {
        return { zone: 'within', adaptation: '' };
    }

    const recent = currentSignals.slice(-5);

    // Hyperarousal: 3+ high-frustration signals in the last 5
    const highFrustrationCount = recent.filter(s => s.frustration >= 2).length;
    if (highFrustrationCount >= 3) {
        return {
            zone: 'hyperarousal',
            adaptation: 'Use shorter responses, validate the emotion before solutions, offer one grounding step at a time.',
        };
    }

    // Hypoarousal: no engagement markers, flat affect
    const engagedCount  = recent.filter(s => s.success || s.excitement || s.flow).length;
    const isDisengaged  = engagedCount === 0 && recent.length >= 3 && recent.every(s => s.frustration === 0);
    if (isDisengaged) {
        return {
            zone: 'hypoarousal',
            adaptation: 'User may be disengaged or low energy. Offer something interesting, celebrate a small win, reconnect with purpose.',
        };
    }

    return { zone: 'within', adaptation: '' };
}

/**
 * Lid-Flip Protocol (Siegel "Hand Model of the Brain"):
 * Returns true when the user has likely "flipped their lid" —
 * prefrontal regulation lost — triggered by 3+ high-frustration
 * signals within the last 5 messages.
 */
export function isLidFlipped(): boolean {
    if (currentSignals.length < 3) { return false; }
    const recentFive = currentSignals.slice(-5);
    return recentFive.filter(s => s.frustration >= 2).length >= 3;
}

// ============================================================================
// Internal Helpers
// ============================================================================

function determineDominantMood(scores: SessionEmotionalArc['scores']): SessionEmotionalArc['dominantMood'] {
    if (scores.flow > 0.3 && scores.excitement > 0.2) {
        return 'creative-flow';
    }
    if (scores.success > 0.4 && scores.excitement > 0.3) {
        return 'celebratory';
    }
    if (scores.frustration > 0.4) {
        return scores.success > 0.2 ? 'struggling' : 'frustrated';
    }
    if (scores.success > 0.3 || scores.flow > 0.2) {
        return 'productive';
    }
    return 'neutral';
}

function determineTrajectory(signals: EmotionalSignal[]): SessionEmotionalArc['trajectory'] {
    if (signals.length < 3) { return 'stable'; }

    // Split into first half and second half
    const mid = Math.floor(signals.length / 2);
    const firstHalf = signals.slice(0, mid);
    const secondHalf = signals.slice(mid);

    const firstFrustration = firstHalf.reduce((s, sig) => s + sig.frustration, 0) / firstHalf.length;
    const secondFrustration = secondHalf.reduce((s, sig) => s + sig.frustration, 0) / secondHalf.length;
    const firstSuccess = firstHalf.filter(s => s.success).length / firstHalf.length;
    const secondSuccess = secondHalf.filter(s => s.success).length / secondHalf.length;

    const frustrationDelta = secondFrustration - firstFrustration;
    const successDelta = secondSuccess - firstSuccess;

    // Check for volatility (both halves have high variance)
    const frustrationVariance = signals.reduce((s, sig) => s + Math.pow(sig.frustration - (firstFrustration + secondFrustration) / 2, 2), 0) / signals.length;
    if (frustrationVariance > 1.5) {
        return 'volatile';
    }

    // Improving: frustration went down OR success went up
    if (frustrationDelta < -0.5 || successDelta > 0.3) {
        return 'improving';
    }

    // Declining: frustration went up OR success went down
    if (frustrationDelta > 0.5 || successDelta < -0.3) {
        return 'declining';
    }

    return 'stable';
}

function findPeakMoments(signals: EmotionalSignal[]): SessionEmotionalArc['peaks'] {
    let highPoint: string | undefined;
    let lowPoint: string | undefined;

    // High point: first success or flow moment
    const firstSuccess = signals.find(s => s.success || s.flow);
    if (firstSuccess) {
        highPoint = firstSuccess.trigger;
    }

    // Low point: highest frustration moment
    const maxFrustration = Math.max(...signals.map(s => s.frustration));
    if (maxFrustration >= 2) {
        const frustratedSignal = signals.find(s => s.frustration === maxFrustration);
        if (frustratedSignal) {
            lowPoint = frustratedSignal.trigger;
        }
    }

    return { highPoint, lowPoint };
}

function generateArcSummary(
    mood: SessionEmotionalArc['dominantMood'],
    trajectory: SessionEmotionalArc['trajectory'],
    scores: SessionEmotionalArc['scores'],
    exchangeCount: number
): string {
    const parts: string[] = [];

    // Mood description
    switch (mood) {
        case 'creative-flow':
            parts.push('Creative flow session — ideas built on each other');
            break;
        case 'celebratory':
            parts.push('Breakthrough session — problems solved, wins celebrated');
            break;
        case 'productive':
            parts.push('Productive session — steady progress');
            break;
        case 'struggling':
            parts.push('Challenging session — obstacles encountered but progress made');
            break;
        case 'frustrated':
            parts.push('Difficult session — significant obstacles');
            break;
        case 'neutral':
            parts.push('Standard session');
            break;
    }

    // Trajectory
    switch (trajectory) {
        case 'improving':
            parts.push('mood improved over time');
            break;
        case 'declining':
            parts.push('energy declined toward the end');
            break;
        case 'volatile':
            parts.push('emotional ups and downs throughout');
            break;
        case 'stable':
            // Don't add noise for stable trajectory
            break;
    }

    return `${parts.join(', ')} (${exchangeCount} exchanges)`;
}

function generateToneGuidance(
    recentMood: MoodContext['recentMood'],
    streak: number,
    sessions: SessionEmotionalArc[]
): string {
    if (recentMood === 'negative' && streak >= 3) {
        return 'User has had multiple frustrating sessions. Lead with patience and encouragement. Acknowledge difficulty before diving into solutions. Suggest smaller, achievable wins.';
    }

    if (recentMood === 'negative' && streak >= 2) {
        return 'Recent sessions have been challenging. Be extra supportive and break problems into smaller steps. Celebrate any progress.';
    }

    if (recentMood === 'positive' && streak >= 3) {
        return 'User is on a creative roll. Match their energy, build on momentum, suggest ambitious next steps. They\'re in a great headspace for challenging work.';
    }

    if (recentMood === 'positive') {
        return 'Recent sessions have been productive. Maintain the positive energy and suggest interesting extensions to what they\'ve built.';
    }

    if (recentMood === 'mixed') {
        return 'Mixed emotional trajectory. Be attentive to mood shifts and adapt. Start supportive, then escalate ambition if things go well.';
    }

    return 'Neutral recent history. Be warm and responsive, matching the user\'s energy.';
}

function getMoodEmoji(mood: SessionEmotionalArc['dominantMood']): string {
    switch (mood) {
        case 'creative-flow': return '🌊';
        case 'celebratory': return '🎉';
        case 'productive': return '✅';
        case 'struggling': return '💪';
        case 'frustrated': return '😤';
        case 'neutral': return '😐';
        default: return '📝';
    }
}
