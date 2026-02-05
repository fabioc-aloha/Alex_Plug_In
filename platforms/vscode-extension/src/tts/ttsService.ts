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

// Supported languages with their default neural voices
export const LANGUAGE_VOICES: Record<string, { voice: string; name: string }> = {
    'en-US': { voice: 'en-US-GuyNeural', name: 'English (US)' },
    'en-GB': { voice: 'en-GB-RyanNeural', name: 'English (UK)' },
    'es-ES': { voice: 'es-ES-AlvaroNeural', name: 'Spanish (Spain)' },
    'es-MX': { voice: 'es-MX-JorgeNeural', name: 'Spanish (Mexico)' },
    'fr-FR': { voice: 'fr-FR-HenriNeural', name: 'French' },
    'de-DE': { voice: 'de-DE-ConradNeural', name: 'German' },
    'it-IT': { voice: 'it-IT-DiegoNeural', name: 'Italian' },
    'pt-BR': { voice: 'pt-BR-AntonioNeural', name: 'Portuguese (Brazil)' },
    'pt-PT': { voice: 'pt-PT-DuarteNeural', name: 'Portuguese (Portugal)' },
    'nl-NL': { voice: 'nl-NL-MaartenNeural', name: 'Dutch' },
    'pl-PL': { voice: 'pl-PL-MarekNeural', name: 'Polish' },
    'ru-RU': { voice: 'ru-RU-DmitryNeural', name: 'Russian' },
    'zh-CN': { voice: 'zh-CN-YunxiNeural', name: 'Chinese (Mandarin)' },
    'ja-JP': { voice: 'ja-JP-KeitaNeural', name: 'Japanese' },
    'ko-KR': { voice: 'ko-KR-InJoonNeural', name: 'Korean' },
    'ar-SA': { voice: 'ar-SA-HamedNeural', name: 'Arabic' },
    'hi-IN': { voice: 'hi-IN-MadhurNeural', name: 'Hindi' },
    'tr-TR': { voice: 'tr-TR-AhmetNeural', name: 'Turkish' },
    'vi-VN': { voice: 'vi-VN-NamMinhNeural', name: 'Vietnamese' },
    'th-TH': { voice: 'th-TH-NiwatNeural', name: 'Thai' },
    'sv-SE': { voice: 'sv-SE-MattiasNeural', name: 'Swedish' },
    'da-DK': { voice: 'da-DK-JeppeNeural', name: 'Danish' },
    'fi-FI': { voice: 'fi-FI-HarriNeural', name: 'Finnish' },
    'nb-NO': { voice: 'nb-NO-FinnNeural', name: 'Norwegian' },
    'he-IL': { voice: 'he-IL-AvriNeural', name: 'Hebrew' },
    'uk-UA': { voice: 'uk-UA-OstapNeural', name: 'Ukrainian' },
    'cs-CZ': { voice: 'cs-CZ-AntoninNeural', name: 'Czech' },
    'el-GR': { voice: 'el-GR-NestorasNeural', name: 'Greek' },
    'ro-RO': { voice: 'ro-RO-EmilNeural', name: 'Romanian' },
    'hu-HU': { voice: 'hu-HU-TamasNeural', name: 'Hungarian' },
    'id-ID': { voice: 'id-ID-ArdiNeural', name: 'Indonesian' },
    'ms-MY': { voice: 'ms-MY-OsmanNeural', name: 'Malay' },
};

// Language detection patterns (character ranges and common words)
const LANGUAGE_PATTERNS: Array<{ lang: string; test: (text: string) => number }> = [
    // CJK and special scripts (check first - distinctive characters)
    { lang: 'zh-CN', test: (t) => (t.match(/[\u4e00-\u9fff]/g)?.length || 0) / t.length },
    { lang: 'ja-JP', test: (t) => (t.match(/[\u3040-\u309f\u30a0-\u30ff]/g)?.length || 0) / t.length },
    { lang: 'ko-KR', test: (t) => (t.match(/[\uac00-\ud7af\u1100-\u11ff]/g)?.length || 0) / t.length },
    { lang: 'ar-SA', test: (t) => (t.match(/[\u0600-\u06ff]/g)?.length || 0) / t.length },
    { lang: 'he-IL', test: (t) => (t.match(/[\u0590-\u05ff]/g)?.length || 0) / t.length },
    { lang: 'hi-IN', test: (t) => (t.match(/[\u0900-\u097f]/g)?.length || 0) / t.length },
    { lang: 'th-TH', test: (t) => (t.match(/[\u0e00-\u0e7f]/g)?.length || 0) / t.length },
    { lang: 'ru-RU', test: (t) => (t.match(/[\u0400-\u04ff]/g)?.length || 0) / t.length },
    { lang: 'uk-UA', test: (t) => (t.match(/[іїєґ]/gi)?.length || 0) / Math.max(1, (t.match(/[\u0400-\u04ff]/g)?.length || 0)) * 0.3 },
    { lang: 'el-GR', test: (t) => (t.match(/[\u0370-\u03ff]/g)?.length || 0) / t.length },
    
    // Latin script languages (use common word patterns)
    { lang: 'es-ES', test: (t) => (t.match(/\b(el|la|los|las|de|que|en|un|una|es|por|con|para|como|más|pero|sus|le|ya|muy|sin|sobre|ser|tiene|también|fue|siendo|está|había|han|hemos|esto|entre|cuando|todo|esta|desde|son|del|al)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'fr-FR', test: (t) => (t.match(/\b(le|la|les|de|du|des|un|une|et|est|en|que|qui|dans|ce|il|elle|pas|pour|sur|avec|sont|au|aux|ont|été|être|fait|vous|nous|mais|ou|son|sa|ses|leur|même|tout|tous|cette|ces|plus|par|comme|très|bien|aussi|peut|faire)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'de-DE', test: (t) => (t.match(/\b(der|die|das|und|in|von|ist|den|mit|für|auf|dem|ein|eine|zu|sich|nicht|als|auch|es|an|wurde|werden|werden|aus|bei|hat|nach|sind|zur|einer|eines|kann|haben|war|im|noch|wie|oder|vom|zum|über|nur|vor|aber|sein|mehr|durch|wird|bis|unter|wir|diese|wenn|so|einem)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'it-IT', test: (t) => (t.match(/\b(il|la|di|che|è|e|un|una|in|per|non|sono|da|del|della|con|si|le|dei|delle|ha|gli|al|alla|come|su|lo|più|ma|anche|era|ho|cui|questo|questa|ci|essere|ne|se|dal|hanno|tutto|fra|suo|sua|suoi|sue|nel|nella|molto|perché|così|quale|stato|stati)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'pt-BR', test: (t) => (t.match(/\b(o|a|de|que|e|do|da|em|um|uma|para|é|com|não|os|as|dos|das|no|na|se|por|mais|ao|à|foi|são|tem|como|mas|pelo|pela|nos|nas|seu|sua|seus|suas|ele|ela|isso|quando|muito|já|também|só|bem|está|esse|essa|tinha|ter|eram|foram|pode|fazer|mesmo|sobre|entre|depois|até)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'nl-NL', test: (t) => (t.match(/\b(de|het|een|van|en|in|is|op|te|dat|die|voor|met|zijn|aan|hij|niet|werd|door|maar|ook|als|naar|om|bij|tot|uit|dan|nog|was|worden|heeft|hebben|er|geen|meer|zou|ze|kan|moet|dit|wel|al|zo|nu|jaar|waren|over|alle|na|kunnen|zelf|waar|deze|tegen|onder|daar|twee|mijn)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'pl-PL', test: (t) => (t.match(/\b(i|w|z|na|do|nie|to|się|że|jest|o|co|jak|od|za|po|ale|tak|już|tylko|ten|tym|był|być|ma|są|ich|jego|jej|tego|która|który|które|przez|bardzo|może|aby|też|ani|lub|czy|ze|jako|przed|bez|dla|jeszcze|więc|kiedy|tam|tu|teraz)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'tr-TR', test: (t) => (t.match(/\b(bir|ve|bu|için|de|da|ile|o|ne|var|gibi|daha|çok|olarak|ki|ama|ben|sen|biz|siz|onlar|olan|oldu|olur|olmak|değil|mi|mı|mu|mü|kadar|sonra|önce|şey|ise|en|göre|ya|veya|hem|ancak|yani|yer|zaman|tarafından|aynı|büyük|iyi)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'sv-SE', test: (t) => (t.match(/\b(och|i|att|det|som|en|på|är|av|för|med|till|den|har|de|om|inte|ett|var|jag|han|hon|vi|ni|dom|från|eller|men|så|nu|kan|ska|vill|här|där|mycket|bara|efter|vid|under|över|sin|sitt|sina|denna|detta|dessa|vårt|våra|ert|era)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'da-DK', test: (t) => (t.match(/\b(og|i|at|det|er|en|af|på|til|med|som|den|har|de|for|ikke|var|et|han|hun|vi|jeg|kan|skal|vil|her|der|men|så|nu|eller|efter|ved|fra|om|over|under|sig|sin|sit|sine|denne|dette|disse|vores|jeres|min|mit|mine|din|dit|dine)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'fi-FI', test: (t) => (t.match(/\b(ja|on|ei|että|se|hän|oli|olla|kun|niin|mutta|tai|jos|vain|kuin|myös|jo|joka|tämä|sitä|hänen|minä|sinä|me|te|he|ovat|olisi|voi|kanssa|sitten|nyt|tässä|mikä|mitä|kaikki|yli|alle|ennen|jälkeen|missä|miksi|miten)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'nb-NO', test: (t) => (t.match(/\b(og|i|er|det|en|at|på|til|som|av|for|med|den|har|de|om|ikke|var|et|han|hun|vi|jeg|kan|skal|vil|her|der|men|så|nå|eller|etter|ved|fra|over|under|seg|sin|sitt|sine|denne|dette|disse|vår|vårt|våre|min|mitt|mine|din|ditt|dine)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'cs-CZ', test: (t) => (t.match(/\b(a|je|v|na|se|že|s|z|do|to|i|o|jako|pro|ale|by|jeho|jsou|byl|být|nebo|po|tak|jsem|jen|jej|ho|má|při|podle|co|které|který|která|tento|tato|toto|tyto|roku|si|ve|ze|mezi|pod|nad|před|za|ke|od|než)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'ro-RO', test: (t) => (t.match(/\b(și|în|de|la|a|cu|ce|pe|un|o|nu|este|se|că|mai|din|au|fost|sunt|care|fi|pentru|al|să|era|lui|lor|le|ei|ea|el|noi|voi|despre|astfel|foarte|poate|după|sau|când|avea|fără|prin|până|încă|însă|totuși|acestă|acest|această|aceasta)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'hu-HU', test: (t) => (t.match(/\b(a|az|és|hogy|nem|is|van|volt|egy|meg|ez|de|csak|már|én|te|ő|mi|ti|ők|lett|lesz|vagy|mint|még|fel|ki|be|el|át|rá|le|vissza|után|előtt|között|alatt|felett|mellett|mögött|szerint|miatt|nélkül|ellen|iránt)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'id-ID', test: (t) => (t.match(/\b(dan|di|yang|untuk|dengan|ini|itu|dari|ke|pada|adalah|tidak|akan|juga|atau|ada|mereka|saya|kami|kita|anda|ia|dalam|oleh|sebagai|dapat|telah|sudah|bisa|harus|serta|bahwa|seperti|karena|ketika|setelah|sebelum|antara|tentang)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'ms-MY', test: (t) => (t.match(/\b(dan|di|yang|untuk|dengan|ini|itu|dari|ke|pada|adalah|tidak|akan|juga|atau|ada|mereka|saya|kami|kita|anda|beliau|dalam|oleh|sebagai|dapat|telah|sudah|boleh|perlu|serta|bahawa|seperti|kerana|apabila|selepas|sebelum|antara|tentang)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    { lang: 'vi-VN', test: (t) => (t.match(/\b(và|của|là|trong|có|được|cho|với|không|này|đã|những|một|các|người|để|tôi|bạn|anh|chị|ông|bà|họ|chúng|ta|nó|cũng|như|khi|sau|trước|trên|dưới|giữa|ngoài|bên|đến|từ|về|hơn|rất|nhiều|ít|mỗi|nào)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
    
    // English as fallback (check last)
    { lang: 'en-US', test: (t) => (t.match(/\b(the|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|shall|can|need|dare|ought|used|to|of|in|for|on|with|at|by|from|as|into|through|during|before|after|above|below|between|under|again|further|then|once|here|there|when|where|why|how|all|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|just|also|now|about|after|before|because|if|or|and|but|although|however|therefore|thus|yet|since|while|whereas|whether|either|neither)\b/gi)?.length || 0) / (t.split(/\s+/).length || 1) },
];

/**
 * Detect the language of the given text
 * Returns the detected language code and confidence (0-1)
 */
export function detectLanguage(text: string): { lang: string; confidence: number; name: string } {
    if (!text || text.trim().length < 10) {
        return { lang: 'en-US', confidence: 0, name: 'English (US)' };
    }
    
    // Normalize text for analysis
    const normalizedText = text.toLowerCase();
    
    let bestMatch = { lang: 'en-US', score: 0 };
    
    for (const pattern of LANGUAGE_PATTERNS) {
        const score = pattern.test(normalizedText);
        if (score > bestMatch.score) {
            bestMatch = { lang: pattern.lang, score };
        }
    }
    
    // Convert score to confidence (0-1)
    // Script-based detection (CJK, Arabic, etc.) typically scores 0.1-0.5
    // Word-based detection typically scores 0.05-0.3
    const confidence = Math.min(1, bestMatch.score * 3);
    
    const langInfo = LANGUAGE_VOICES[bestMatch.lang] || LANGUAGE_VOICES['en-US'];
    
    return {
        lang: bestMatch.lang,
        confidence,
        name: langInfo.name
    };
}

/**
 * Get the default voice for a language
 */
export function getVoiceForLanguage(lang: string): string {
    return LANGUAGE_VOICES[lang]?.voice || LANGUAGE_VOICES['en-US'].voice;
}

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
    lang?: string;       // Language code, e.g., 'en-US', 'es-ES'
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
    
    // Extract language from voice name (e.g., 'en-US-GuyNeural' → 'en-US')
    // Or use explicit lang option, or default to en-US
    const lang = options.lang || voice.match(/^([a-z]{2}-[A-Z]{2})/)?.[1] || 'en-US';

    // Escape XML special characters
    const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">
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

// === CHUNKING & RETRY CONFIGURATION ===
const MAX_CHUNK_CHARS = 3000;        // Max characters per chunk (~500 words)
const CHUNK_TIMEOUT_MS = 60000;       // 60 second timeout per chunk
const MAX_RETRIES = 3;                // Max retry attempts per chunk
const INITIAL_BACKOFF_MS = 1000;      // Start with 1 second backoff
const MAX_BACKOFF_MS = 16000;         // Cap backoff at 16 seconds

/**
 * Split text into chunks for reliable synthesis
 * Splits on paragraph/sentence boundaries when possible
 */
function splitTextIntoChunks(text: string): string[] {
    if (text.length <= MAX_CHUNK_CHARS) {
        return [text];
    }
    
    const chunks: string[] = [];
    let remaining = text;
    
    while (remaining.length > 0) {
        if (remaining.length <= MAX_CHUNK_CHARS) {
            chunks.push(remaining);
            break;
        }
        
        // Find a good split point within the limit
        let splitIndex = MAX_CHUNK_CHARS;
        
        // Try to split on paragraph boundary first
        const paragraphBreak = remaining.lastIndexOf('\n\n', MAX_CHUNK_CHARS);
        if (paragraphBreak > MAX_CHUNK_CHARS * 0.4) {
            splitIndex = paragraphBreak + 2; // Include the newlines
        } else {
            // Try sentence boundary (. ! ?)
            const sentenceMatch = remaining.substring(0, MAX_CHUNK_CHARS).match(/[.!?]\s+(?=[A-Z])/g);
            if (sentenceMatch && sentenceMatch.length > 0) {
                // Find the last sentence end
                const lastSentenceEnd = remaining.substring(0, MAX_CHUNK_CHARS).lastIndexOf(sentenceMatch[sentenceMatch.length - 1]);
                if (lastSentenceEnd > MAX_CHUNK_CHARS * 0.4) {
                    splitIndex = lastSentenceEnd + sentenceMatch[sentenceMatch.length - 1].length;
                }
            }
        }
        
        chunks.push(remaining.substring(0, splitIndex).trim());
        remaining = remaining.substring(splitIndex).trim();
    }
    
    return chunks.filter(c => c.length > 0);
}

/**
 * Calculate backoff delay with exponential backoff
 */
function calculateBackoff(attempt: number): number {
    const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
    // Add jitter (±25%)
    const jitter = backoff * (0.75 + Math.random() * 0.5);
    return Math.min(jitter, MAX_BACKOFF_MS);
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
 * Synthesize a single chunk of text with timeout protection
 * Internal function - use synthesize() for public API
 */
function synthesizeChunk(
    text: string,
    options: TTSOptions = {},
    onProgress?: ProgressCallback,
    timeoutMs: number = CHUNK_TIMEOUT_MS
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const requestId = generateRequestId();
        const audioChunks: Buffer[] = [];
        let bytesReceived = 0;
        let isCompleted = false;
        let timeoutHandle: NodeJS.Timeout | undefined;

        // Timeout protection
        timeoutHandle = setTimeout(() => {
            if (!isCompleted) {
                isCompleted = true;
                ws.close();
                reject(new Error(`TTS timeout: no response after ${timeoutMs / 1000}s`));
            }
        }, timeoutMs);

        const cleanup = () => {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = undefined;
            }
        };

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
                if (!isCompleted) {
                    isCompleted = true;
                    cleanup();
                    onProgress?.({ state: 'complete', bytesReceived });
                    ws.close();
                    resolve(Buffer.concat(audioChunks as Uint8Array[]));
                }
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
            if (!isCompleted) {
                isCompleted = true;
                cleanup();
                onProgress?.({ state: 'error', error: error.message });
                reject(new Error(`TTS WebSocket error: ${error.message}`));
            }
        });

        ws.on('close', (code: number, reason: Buffer) => {
            cleanup();
            const reasonStr = reason?.toString() || 'unknown';
            if (!isCompleted && audioChunks.length === 0 && code !== 1000) {
                isCompleted = true;
                onProgress?.({ state: 'error', error: `Connection closed: ${reasonStr}` });
                reject(new Error(`TTS connection closed unexpectedly: ${reasonStr}`));
            }
        });
    });
}

/**
 * Synthesize a chunk with retry and exponential backoff
 */
async function synthesizeChunkWithRetry(
    text: string,
    options: TTSOptions,
    onProgress?: ProgressCallback
): Promise<Buffer> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            return await synthesizeChunk(text, options, onProgress);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            // Don't retry on the last attempt
            if (attempt < MAX_RETRIES - 1) {
                const backoffMs = calculateBackoff(attempt);
                console.log(`TTS retry ${attempt + 1}/${MAX_RETRIES} after ${Math.round(backoffMs)}ms: ${lastError.message}`);
                await sleep(backoffMs);
            }
        }
    }
    
    throw lastError || new Error('TTS synthesis failed after retries');
}

// Extended progress interface for chunked synthesis
export interface TTSChunkedProgress extends TTSProgress {
    currentChunk?: number;
    totalChunks?: number;
    totalBytesReceived?: number;
}

type ChunkedProgressCallback = (progress: TTSChunkedProgress) => void;

/**
 * Synthesize text to audio using Microsoft Edge TTS
 * 
 * For long documents, automatically splits into chunks and concatenates audio.
 * Includes timeout protection and retry with exponential backoff.
 * 
 * @param text - The text to synthesize
 * @param options - TTS options (voice, rate, pitch, volume)
 * @param onProgress - Progress callback for UI feedback
 * @returns Buffer containing MP3 audio data
 */
export async function synthesize(
    text: string,
    options: TTSOptions = {},
    onProgress?: ProgressCallback | ChunkedProgressCallback
): Promise<Buffer> {
    const chunks = splitTextIntoChunks(text);
    
    // Simple case: single chunk
    if (chunks.length === 1) {
        return synthesizeChunkWithRetry(chunks[0], options, onProgress);
    }
    
    // Multi-chunk: synthesize each and concatenate
    const audioBuffers: Buffer[] = [];
    let totalBytesReceived = 0;
    
    console.log(`TTS: Processing ${chunks.length} chunks for long document`);
    
    for (let i = 0; i < chunks.length; i++) {
        const chunkProgress: ChunkedProgressCallback = (progress) => {
            // Forward progress with chunk info
            (onProgress as ChunkedProgressCallback)?.({
                ...progress,
                currentChunk: i + 1,
                totalChunks: chunks.length,
                totalBytesReceived: totalBytesReceived + (progress.bytesReceived || 0)
            });
        };
        
        try {
            const audioBuffer = await synthesizeChunkWithRetry(chunks[i], options, chunkProgress);
            audioBuffers.push(audioBuffer);
            totalBytesReceived += audioBuffer.length;
            
            // Small delay between chunks to avoid rate limiting
            if (i < chunks.length - 1) {
                await sleep(200);
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`TTS chunk ${i + 1}/${chunks.length} failed: ${errorMsg}`);
            throw new Error(`TTS failed on chunk ${i + 1}/${chunks.length}: ${errorMsg}`);
        }
    }
    
    // Concatenate all audio buffers
    const finalAudio = Buffer.concat(audioBuffers as Uint8Array[]);
    
    (onProgress as ChunkedProgressCallback)?.({
        state: 'complete',
        bytesReceived: finalAudio.length,
        totalBytesReceived: finalAudio.length,
        currentChunk: chunks.length,
        totalChunks: chunks.length
    });
    
    return finalAudio;
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
