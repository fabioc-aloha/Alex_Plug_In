/**
 * Text-to-Speech Service v2
 * 
 * Native TypeScript implementation using Microsoft Edge TTS WebSocket API.
 * No external dependencies - direct WebSocket communication with Edge TTS service.
 * 
 * Architecture:
 * - Connects directly to Edge TTS WebSocket endpoint
 * - Streams audio chunks for efficient memory usage
 * - Supports all Edge neural voices (400+ voices, 90+ languages)
 * - Provides progress callbacks for UI feedback
 */

import * as crypto from 'crypto';
import WebSocket from 'ws';
import * as vscode from 'vscode';

// Edge TTS constants (from edge-tts Python library)
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_FULL_VERSION = '143.0.3650.75';
const CHROMIUM_MAJOR_VERSION = CHROMIUM_FULL_VERSION.split('.')[0];
const SEC_MS_GEC_VERSION = `1-${CHROMIUM_FULL_VERSION}`;
const EDGE_TTS_ENDPOINT = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`;

// Windows epoch offset (1601-01-01 to 1970-01-01 in seconds)
const WIN_EPOCH = 11644473600;

// Default voice presets (Alex's voice)
export const VOICE_PRESETS = {
    default: 'en-US-GuyNeural',      // Professional male, clear articulation
    warm: 'en-US-ChristopherNeural', // Friendly, conversational
    british: 'en-GB-RyanNeural',     // British accent, authoritative
    friendly: 'en-US-DavisNeural',   // Casual, approachable
    aria: 'en-US-AriaNeural',        // News anchor style (female)
    jenny: 'en-US-JennyNeural',      // Professional female
} as const;

export type VoicePreset = keyof typeof VOICE_PRESETS;

export interface TTSOptions {
    voice?: string;
    rate?: string;       // e.g., '+10%', '-20%'
    pitch?: string;      // e.g., '+5Hz', '-10Hz'
    volume?: string;     // e.g., '+50%', '-25%'
}

export interface TTSProgress {
    state: 'connecting' | 'synthesizing' | 'streaming' | 'complete' | 'error';
    bytesReceived?: number;
    error?: string;
}

type ProgressCallback = (progress: TTSProgress) => void;

/**
 * Generate a unique request ID for Edge TTS
 */
function generateRequestId(): string {
    return crypto.randomUUID().replace(/-/g, '');
}

/**
 * Generate Sec-MS-GEC token for DRM authentication
 * Based on edge-tts Python library: https://github.com/rany2/edge-tts
 */
function generateSecMsGec(): string {
    // Get current timestamp in seconds
    const now = Date.now() / 1000;
    
    // Round down to nearest 5 minutes (300 seconds) FIRST
    const roundedTime = now - (now % 300);
    
    // THEN add Windows file time epoch (1601-01-01 00:00:00 UTC)
    let ticks = roundedTime + WIN_EPOCH;
    
    // Convert to 100-nanosecond intervals (Windows file time format: 1e7)
    ticks *= 1e7;
    
    // Create string to hash: ticks + trusted client token
    const strToHash = `${Math.floor(ticks)}${TRUSTED_CLIENT_TOKEN}`;
    
    // Compute SHA256 hash and return uppercase hex
    return crypto.createHash('sha256').update(strToHash, 'ascii').digest('hex').toUpperCase();
}

/**
 * Generate random MUID (Machine Unique ID) for cookie
 */
function generateMuid(): string {
    return crypto.randomBytes(16).toString('hex').toUpperCase();
}

/**
 * Generate timestamp for Edge TTS headers
 */
function generateTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Build SSML (Speech Synthesis Markup Language) for the text
 */
function buildSSML(text: string, options: TTSOptions = {}): string {
    const voice = options.voice || VOICE_PRESETS.default;
    const rate = options.rate || '+0%';
    const pitch = options.pitch || '+0Hz';
    const volume = options.volume || '+0%';

    // Escape XML special characters
    const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="${voice}">
        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
            ${escapedText}
        </prosody>
    </voice>
</speak>`;
}

/**
 * Build the configuration message for Edge TTS
 */
function buildConfigMessage(requestId: string): string {
    const timestamp = generateTimestamp();
    return `X-Timestamp:${timestamp}\r\n` +
        'Content-Type:application/json; charset=utf-8\r\n' +
        `Path:speech.config\r\n\r\n` +
        JSON.stringify({
            context: {
                synthesis: {
                    audio: {
                        metadataoptions: {
                            sentenceBoundaryEnabled: 'false',
                            wordBoundaryEnabled: 'true'
                        },
                        outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
                    }
                }
            }
        });
}

/**
 * Build the SSML request message
 */
function buildSSMLMessage(requestId: string, ssml: string): string {
    const timestamp = generateTimestamp();
    return `X-RequestId:${requestId}\r\n` +
        `Content-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${timestamp}\r\n` +
        `Path:ssml\r\n\r\n` +
        ssml;
}

/**
 * Extract audio data from Edge TTS binary message
 */
function extractAudioData(data: Buffer): Buffer | null {
    // Edge TTS binary messages have a header ending with "Path:audio\r\n"
    const marker = '\r\nPath:audio\r\n';
    const dataStr = data.toString('binary');
    const headerEnd = dataStr.indexOf(marker);
    if (headerEnd === -1) {
        return null;
    }
    
    // Audio data starts after the header
    const audioStart = headerEnd + marker.length;
    return data.subarray(audioStart);
}

/**
 * Synthesize text to audio using Microsoft Edge TTS
 * 
 * @param text - The text to synthesize
 * @param options - TTS options (voice, rate, pitch, volume)
 * @param onProgress - Progress callback for UI feedback
 * @returns Buffer containing MP3 audio data
 */
export async function synthesize(
    text: string,
    options: TTSOptions = {},
    onProgress?: ProgressCallback
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const requestId = generateRequestId();
        const audioChunks: Buffer[] = [];
        let bytesReceived = 0;

        onProgress?.({ state: 'connecting' });

        // Generate connection URL with DRM authentication parameters
        const connectionId = generateRequestId();
        const secMsGec = generateSecMsGec();
        const muid = generateMuid();
        const url = `${EDGE_TTS_ENDPOINT}&ConnectionId=${connectionId}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;

        const ws = new WebSocket(url, {
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
                'Cookie': `muid=${muid};`,
                'Sec-WebSocket-Version': '13'
            }
        });

        ws.on('open', () => {
            onProgress?.({ state: 'synthesizing' });

            // Send configuration message
            ws.send(buildConfigMessage(requestId));

            // Build and send SSML message
            const ssml = buildSSML(text, options);
            ws.send(buildSSMLMessage(requestId, ssml));
        });

        ws.on('message', (data: WebSocket.RawData) => {
            // Handle Buffer data
            const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
            
            // Check if this is a text message (turn.end notification)
            const messageStr = buffer.toString('utf8');
            if (messageStr.includes('Path:turn.end')) {
                onProgress?.({ state: 'complete', bytesReceived });
                ws.close();
                resolve(Buffer.concat(audioChunks as Uint8Array[]));
                return;
            }
            
            // Binary message - extract audio data
            const audioData = extractAudioData(buffer);
            if (audioData && audioData.length > 0) {
                audioChunks.push(audioData);
                bytesReceived += audioData.length;
                onProgress?.({ state: 'streaming', bytesReceived });
            }
        });

        ws.on('error', (error: Error) => {
            onProgress?.({ state: 'error', error: error.message });
            reject(new Error(`TTS WebSocket error: ${error.message}`));
        });

        ws.on('close', (code: number, reason: Buffer) => {
            const reasonStr = reason?.toString() || 'unknown';
            if (audioChunks.length === 0 && code !== 1000) {
                onProgress?.({ state: 'error', error: `Connection closed: ${reasonStr}` });
                reject(new Error(`TTS connection closed unexpectedly: ${reasonStr}`));
            }
        });
    });
}

/**
 * Get list of available voices for a language
 */
export async function listVoices(language: string = 'en'): Promise<string[]> {
    // Common voices for quick access
    const voices = [
        'en-US-GuyNeural',
        'en-US-JennyNeural',
        'en-US-AriaNeural',
        'en-US-ChristopherNeural',
        'en-US-DavisNeural',
        'en-GB-RyanNeural',
        'en-GB-SoniaNeural',
        'en-AU-WilliamNeural',
        'en-IN-NeerjaNeural',
        'es-ES-AlvaroNeural',
        'es-MX-DaliaNeural',
        'fr-FR-HenriNeural',
        'de-DE-ConradNeural',
        'pt-BR-AntonioNeural',
        'zh-CN-YunxiNeural',
        'ja-JP-KeitaNeural',
    ].filter(v => v.startsWith(`${language}-`) || language === 'all');

    return voices;
}

/**
 * Convert a markdown table to spoken format
 * Reads as: "Table with columns: A, B, C. Row 1: A is X, B is Y, C is Z. Row 2: ..."
 */
function tableToSpeech(tableMatch: string): string {
    const lines = tableMatch.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return '';
    
    // Parse header row
    const headers = lines[0]
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell && !cell.match(/^[-:]+$/));
    
    if (headers.length === 0) return '';
    
    // Skip separator row (line with dashes)
    const dataRows = lines.slice(2);
    
    let speech = `Table with ${headers.length} columns: ${headers.join(', ')}. `;
    
    // Parse data rows (limit to 10 for speech)
    const maxRows = Math.min(dataRows.length, 10);
    for (let i = 0; i < maxRows; i++) {
        const cells = dataRows[i]
            .split('|')
            .map(cell => cell.trim())
            .filter(cell => cell);
        
        if (cells.length === 0) continue;
        
        // Read each cell with its column header
        const rowParts: string[] = [];
        for (let j = 0; j < Math.min(cells.length, headers.length); j++) {
            const value = cells[j]
                .replace(/\*\*/g, '') // Remove bold
                .replace(/\*/g, '')   // Remove italic
                .replace(/`/g, '')    // Remove code
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links to text
                .trim();
            
            if (value && value !== '—' && value !== '-') {
                rowParts.push(`${headers[j]}: ${value}`);
            }
        }
        
        if (rowParts.length > 0) {
            speech += `Row ${i + 1}: ${rowParts.join(', ')}. `;
        }
    }
    
    if (dataRows.length > maxRows) {
        speech += `Plus ${dataRows.length - maxRows} more rows. `;
    }
    
    return speech;
}

/**
 * Strip markdown formatting for natural speech
 * Enhanced for tables, mermaid diagrams, task lists, and common symbols
 */
export function prepareTextForSpeech(markdown: string): string {
    let text = markdown;
    
    // === BLOCK ELEMENTS (process first) ===
    
    // Mermaid diagrams - summarize
    text = text.replace(/```mermaid[\s\S]*?```/g, ' diagram shown here ');
    
    // Code blocks - summarize
    text = text.replace(/```(\w+)?[\s\S]*?```/g, (match, lang) => {
        return lang ? ` ${lang} code block omitted ` : ' code block omitted ';
    });
    
    // Tables - convert to spoken format
    text = text.replace(/^\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]?)+)/gm, tableToSpeech);
    
    // Also catch simple info tables (key-value style)
    text = text.replace(/^\|[^|]+\|[^|]+\|[\r\n]+\|[-:\s|]+\|[\r\n]*((?:\|[^|]+\|[^|]+\|[\r\n]?)*)/gm, tableToSpeech);
    
    // HTML comments
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    
    // Details/summary blocks
    text = text.replace(/<details>[\s\S]*?<summary>(.*?)<\/summary>[\s\S]*?<\/details>/g, 
        'Collapsed section: $1. ');
    
    // === TASK LISTS ===
    text = text.replace(/^[-*]\s*\[x\]\s+(.+)$/gim, 'Completed: $1. ');
    text = text.replace(/^[-*]\s*\[\s\]\s+(.+)$/gim, 'To do: $1. ');
    
    // === INLINE ELEMENTS ===
    
    // Inline code
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // Links - keep text, mention if external
    text = text.replace(/\[([^\]]+)\]\(https?:[^)]+\)/g, '$1 (link)');
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Images
    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, 'image: $1');
    
    // Bold/italic (order matters - bold first)
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');  // Bold italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');       // Bold
    text = text.replace(/\*([^*]+)\*/g, '$1');           // Italic
    text = text.replace(/___([^_]+)___/g, '$1');
    text = text.replace(/__([^_]+)__/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');
    
    // Strikethrough
    text = text.replace(/~~([^~]+)~~/g, '$1');
    
    // === HEADERS & STRUCTURE ===
    
    // Headers - announce level for navigation
    text = text.replace(/^######\s+(.+)$/gm, 'Sub-section: $1. ');
    text = text.replace(/^#####\s+(.+)$/gm, 'Sub-section: $1. ');
    text = text.replace(/^####\s+(.+)$/gm, 'Section: $1. ');
    text = text.replace(/^###\s+(.+)$/gm, 'Section: $1. ');
    text = text.replace(/^##\s+(.+)$/gm, 'Heading: $1. ');
    text = text.replace(/^#\s+(.+)$/gm, 'Title: $1. ');
    
    // Horizontal rules
    text = text.replace(/^[-*_]{3,}$/gm, ' ');
    
    // Blockquotes
    text = text.replace(/^>\s+(.+)$/gm, 'Quote: $1. ');
    
    // List markers (after task lists)
    text = text.replace(/^[-*+]\s+/gm, '');
    text = text.replace(/^\d+\.\s+/gm, '');
    
    // === EMOJI + REDUNDANT TEXT COMBOS (process BEFORE generic emoji) ===
    // Prevents "completed Complete", "planned Planned", etc.
    text = text.replace(/✅\s*\**Completed?\**/gi, 'completed');
    text = text.replace(/✅\s*\**Done\**/gi, 'completed');
    text = text.replace(/📋\s*\**Planned?\**/gi, 'planned');
    text = text.replace(/🔄\s*\**In\s*Progress\**/gi, 'in progress');
    text = text.replace(/⏳\s*\**Waiting\**/gi, 'waiting');
    text = text.replace(/🆕\s*\**New\**/gi, 'new');
    text = text.replace(/⚠️\s*\**Warning\**/gi, 'warning');
    text = text.replace(/❌\s*\**(Not\s*Done|Failed?|Broken)\**/gi, 'not done');
    text = text.replace(/🔓\s*\**UNLOCKED\**/gi, 'unlocked');
    text = text.replace(/🔥\s*High/gi, 'high priority');  // 🔥 High → high priority
    text = text.replace(/⭐+\s*(High|Medium|Low)/gi, '$1');  // ⭐⭐ High → High
    
    // === COMMON EMOJI (pronounce meaningfully - for standalone emoji) ===
    text = text.replace(/✅/g, 'completed');
    text = text.replace(/❌/g, 'not done');
    text = text.replace(/⚠️/g, 'warning');
    text = text.replace(/🔥/g, 'hot');
    text = text.replace(/📋/g, 'planned');
    text = text.replace(/🆕/g, 'new');
    text = text.replace(/🔄/g, 'in progress');
    text = text.replace(/⏳/g, 'waiting');
    text = text.replace(/🧠/g, '');  // Skip brain (contextual)
    text = text.replace(/👶/g, '');  // Skip baby (Alex heir reference)
    text = text.replace(/💡/g, 'idea');
    text = text.replace(/🎨/g, '');  // Skip art palette
    text = text.replace(/🔗/g, '');  // Skip link emoji
    text = text.replace(/📊/g, '');  // Skip chart
    text = text.replace(/📦/g, '');  // Skip package
    text = text.replace(/🚀/g, '');  // Skip rocket
    text = text.replace(/⭐/g, 'star');
    text = text.replace(/🔓/g, 'unlocked');
    text = text.replace(/🔬/g, 'research');
    text = text.replace(/🎯/g, '');  // Skip target
    text = text.replace(/📜/g, '');  // Skip scroll
    text = text.replace(/🚫/g, 'avoid');
    
    // === SYMBOLS & ABBREVIATIONS ===
    
    // Common symbols
    text = text.replace(/→/g, ' leads to ');
    text = text.replace(/←/g, ' from ');
    text = text.replace(/↔/g, ' both ways ');
    text = text.replace(/⇒/g, ' implies ');
    text = text.replace(/≈/g, ' approximately ');
    text = text.replace(/≠/g, ' not equal to ');
    text = text.replace(/≥/g, ' greater than or equal to ');
    text = text.replace(/≤/g, ' less than or equal to ');
    text = text.replace(/±/g, ' plus or minus ');
    text = text.replace(/°/g, ' degrees ');
    text = text.replace(/×/g, ' times ');
    text = text.replace(/÷/g, ' divided by ');
    text = text.replace(/√/g, ' square root of ');
    text = text.replace(/∞/g, ' infinity ');
    text = text.replace(/•/g, ', ');  // Bullet to comma
    text = text.replace(/—/g, ', ');  // Em dash to comma
    text = text.replace(/–/g, ' to '); // En dash (ranges)
    text = text.replace(/…/g, '...');
    
    // Tech abbreviations (expand for clarity)
    text = text.replace(/\bAPI\b/g, 'A P I');
    text = text.replace(/\bUI\b/g, 'U I');
    text = text.replace(/\bUX\b/g, 'U X');
    text = text.replace(/\bGA\b/g, 'general availability');
    text = text.replace(/\bM365\b/g, 'Microsoft 365');
    text = text.replace(/\bVS Code\b/gi, 'VS Code');
    text = text.replace(/\bTTS\b/g, 'text to speech');
    text = text.replace(/\bDRM\b/g, 'D R M');
    text = text.replace(/\bJSON\b/g, 'JSON');
    text = text.replace(/\bSSML\b/g, 'S S M L');
    text = text.replace(/\bMCP\b/g, 'M C P');
    text = text.replace(/\bADR\b/g, 'architecture decision record');
    text = text.replace(/\bCAIR\b/g, 'C A I R');
    text = text.replace(/\bCSR\b/g, 'C S R');
    
    // Version patterns (skip when already preceded by "Version:" from table headers)
    text = text.replace(/(?<!Version:\s*)v(\d+\.\d+\.\d+)/gi, 'version $1');
    text = text.replace(/(?<!Version:\s*)v(\d+\.\d+)/gi, 'version $1');
    
    // Time duration patterns (must be before file extensions)
    text = text.replace(/(\d+)h\b/g, '$1 hours');
    text = text.replace(/(\d+)m\b/g, '$1 minutes');
    text = text.replace(/(\d+)s\b/g, '$1 seconds');
    text = text.replace(/(\d+)d\b/g, '$1 days');
    text = text.replace(/(\d+)w\b/g, '$1 weeks');
    text = text.replace(/(\d+)min\b/g, '$1 minutes');
    text = text.replace(/(\d+)hr\b/g, '$1 hours');
    text = text.replace(/(\d+)sec\b/g, '$1 seconds');
    
    // File extensions
    text = text.replace(/\.md\b/g, ' markdown file');
    text = text.replace(/\.ts\b/g, ' TypeScript file');
    text = text.replace(/\.js\b/g, ' JavaScript file');
    text = text.replace(/\.json\b/g, ' JSON file');
    
    // Common operators in prose
    text = text.replace(/\s+\+\s+/g, ' plus ');
    text = text.replace(/\s+-\s+/g, ' minus ');
    text = text.replace(/\s+&\s+/g, ' and ');
    text = text.replace(/\s+@\s+/g, ' at ');
    text = text.replace(/(\d+)%/g, '$1 percent');
    text = text.replace(/~(\d+)/g, 'approximately $1');
    
    // Less than / greater than (only when not in table remnants)
    text = text.replace(/\s+<\s+/g, ' less than ');
    text = text.replace(/\s+>\s+/g, ' greater than ');
    
    // === CLEANUP ===
    
    // Multiple newlines to pause
    text = text.replace(/\n\n+/g, '. ');
    
    // Single newlines to space
    text = text.replace(/\n/g, ' ');
    
    // Pipe remnants from tables
    text = text.replace(/\|/g, ', ');
    
    // Multiple spaces
    text = text.replace(/\s+/g, ' ');
    
    // Multiple periods/commas
    text = text.replace(/[.,]\s*[.,]+/g, '. ');
    text = text.replace(/,\s*\./g, '.');
    
    // Colon followed by comma
    text = text.replace(/:\s*,/g, ': ');
    
    return text.trim();
}
