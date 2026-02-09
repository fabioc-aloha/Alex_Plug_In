/**
 * Audio Player v2
 * 
 * Handles audio playback in VS Code environment.
 * Uses a webview panel for browser-based audio playback (cross-platform).
 * Falls back to system player on Windows/macOS/Linux.
 * 
 * Benefits of webview approach:
 * - Cross-platform without external dependencies
 * - Native HTML5 Audio API support
 * - Progress feedback and controls
 * - Integrates with VS Code UI
 */

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { getNonce } from '../shared/sanitize';

// Singleton webview panel for audio playback
let audioPanel: vscode.WebviewPanel | undefined;
let currentPlaybackId: string | undefined;
let currentMediaFile: string | undefined;

export interface PlaybackState {
    state: 'loading' | 'playing' | 'paused' | 'stopped' | 'ended' | 'error';
    progress?: number;    // 0-100 percentage
    duration?: number;    // seconds
    currentTime?: number; // seconds
    error?: string;
}

type PlaybackCallback = (state: PlaybackState) => void;

// Media directory for audio files (set during playWithWebview)
let mediaDir: string | undefined;

/**
 * Save audio buffer to media file and return path
 * Uses extension's globalStorageUri/media for reliable webview access
 */
async function saveToMediaFile(audioBuffer: Buffer, storageUri: vscode.Uri, extension: string = '.mp3'): Promise<string> {
    mediaDir = path.join(storageUri.fsPath, 'media');
    await fs.ensureDir(mediaDir);
    
    const filename = `alex-speech-${Date.now()}${extension}`;
    const filepath = path.join(mediaDir, filename);
    await fs.writeFile(filepath, new Uint8Array(audioBuffer));
    
    console.log('[AlexTTS] Saved audio to:', filepath);
    return filepath;
}

/**
 * Clean up old media files (older than 1 hour)
 */
async function cleanupMediaFiles(): Promise<void> {
    if (!mediaDir) {
        return;
    }
    
    try {
        if (!await fs.pathExists(mediaDir)) {
            return;
        }
        
        const files = await fs.readdir(mediaDir);
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const file of files) {
            const filepath = path.join(mediaDir, file);
            const stats = await fs.stat(filepath);
            
            if (stats.mtimeMs < oneHourAgo) {
                await fs.unlink(filepath).catch(() => {});
            }
        }
    } catch (error) {
        // Ignore cleanup errors
        console.warn('TTS media cleanup error:', error);
    }
}

/**
 * Get HTML content for the audio player webview
 * Uses webview URI for reliable audio playback (not data URIs or blob URLs)
 */
function getAudioPlayerHtml(audioUri: string, playbackId: string, voiceName: string = 'en-US-GuyNeural'): string {
    const nonce = getNonce();
    // VS Code webview URIs use https://*.vscode-resource.vscode-cdn.net or vscode-webview-resource:
    // CSP must allow these schemes for audio playback
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; media-src https: vscode-resource: vscode-webview-resource:;">
    <title>Alex TTS Player</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }
        .player-container {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 8px;
            padding: 24px;
            width: 100%;
            max-width: 500px;
        }
        .title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }
        .title h2 {
            margin: 0;
            font-size: 16px;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: var(--vscode-progressBar-background);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        .progress-fill {
            height: 100%;
            background: var(--vscode-button-background);
            width: 0%;
            transition: width 0.1s;
        }
        .time-display {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 16px;
        }
        .controls {
            display: flex;
            justify-content: center;
            gap: 12px;
        }
        button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        button.secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .status {
            text-align: center;
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
        }
        .voice-info {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
        }
        .icon {
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="player-container">
        <div class="title">
            <span class="icon">🔊</span>
            <h2>Alex Speaking</h2>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" id="progress"></div>
        </div>
        
        <div class="time-display">
            <span id="currentTime">0:00</span>
            <span id="duration">0:00</span>
        </div>
        
        <div class="controls">
            <button id="playPauseBtn" data-cmd="togglePlayPause">
                <span class="icon" id="playPauseIcon">⏸</span>
                <span id="playPauseText">Pause</span>
            </button>
            <button class="secondary" data-cmd="stopAndClose">
                <span class="icon">⏹</span>
                Stop
            </button>
        </div>
        
        <p class="status" id="status">Playing...</p>
        <p class="voice-info">Voice: ${voiceName}</p>
    </div>

    <audio id="audio" preload="auto"></audio>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const audio = document.getElementById('audio');
        const progress = document.getElementById('progress');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const statusEl = document.getElementById('status');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playPauseIcon = document.getElementById('playPauseIcon');
        const playPauseText = document.getElementById('playPauseText');
        
        // Audio URI from VS Code webview (uses asWebviewUri for local file access)
        const audioUri = '${audioUri}';
        
        function formatTime(seconds) {
            if (!isFinite(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + secs.toString().padStart(2, '0');
        }
        
        function sendState(state, extra = {}) {
            vscode.postMessage({
                type: 'playbackState',
                playbackId: '${playbackId}',
                state: state,
                ...extra
            });
        }
        
        function log(msg) {
            console.log('[AlexTTS] ' + msg);
            // Also send to extension for debugging
            vscode.postMessage({ type: 'debug', message: msg });
        }
        
        function initAudio() {
            log('Initializing audio with URI: ' + audioUri.substring(0, 80) + '...');
            statusEl.textContent = 'Loading audio...';
            
            try {
                audio.src = audioUri;
                audio.load();
                log('Audio load() called');
            } catch (err) {
                log('Error loading audio: ' + err.message);
                statusEl.textContent = 'Error: ' + err.message;
                sendState('error', { error: err.message });
            }
        }
        
        audio.addEventListener('loadedmetadata', () => {
            log('loadedmetadata: duration=' + audio.duration);
            durationEl.textContent = formatTime(audio.duration);
        });
        
        audio.addEventListener('loadeddata', () => {
            log('loadeddata event fired');
        });
        
        audio.addEventListener('canplay', () => {
            log('canplay event fired');
        });
        
        audio.addEventListener('canplaythrough', () => {
            log('canplaythrough event fired');
            statusEl.textContent = 'Ready to play...';
            sendState('ready');
            
            // Try to play immediately
            audio.play().then(() => {
                log('play() succeeded');
                statusEl.textContent = 'Playing...';
                sendState('playing', { duration: audio.duration });
            }).catch(err => {
                log('play() failed: ' + err.message);
                statusEl.textContent = 'Click Play to start';
                playPauseIcon.textContent = '▶';
                playPauseText.textContent = 'Play';
                sendState('paused');
            });
        });
        
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            sendState('playing', { 
                progress: percent, 
                currentTime: audio.currentTime,
                duration: audio.duration 
            });
        });
        
        audio.addEventListener('ended', () => {
            log('Audio ended');
            statusEl.textContent = 'Finished';
            playPauseIcon.textContent = '▶';
            playPauseText.textContent = 'Replay';
            sendState('ended');
        });
        
        audio.addEventListener('error', (e) => {
            const errorCode = audio.error ? audio.error.code : 'unknown';
            const errorMsg = audio.error ? audio.error.message : 'Unknown error';
            log('Audio error: code=' + errorCode + ', msg=' + errorMsg);
            statusEl.textContent = 'Error: ' + errorMsg;
            sendState('error', { error: 'Audio error code ' + errorCode + ': ' + errorMsg });
        });
        
        audio.addEventListener('stalled', () => {
            log('Audio stalled');
        });
        
        audio.addEventListener('waiting', () => {
            log('Audio waiting for data');
        });
        
        function togglePlayPause() {
            log('togglePlayPause called, paused=' + audio.paused + ', ended=' + audio.ended);
            if (audio.ended) {
                audio.currentTime = 0;
                audio.play();
            } else if (audio.paused) {
                audio.play().then(() => {
                    log('Manual play succeeded');
                }).catch(err => {
                    log('Manual play failed: ' + err.message);
                });
            } else {
                audio.pause();
            }
            
            if (audio.paused) {
                playPauseIcon.textContent = '▶';
                playPauseText.textContent = 'Play';
                statusEl.textContent = 'Paused';
                sendState('paused');
            } else {
                playPauseIcon.textContent = '⏸';
                playPauseText.textContent = 'Pause';
                statusEl.textContent = 'Playing...';
                sendState('playing');
            }
        }
        
        function stopAndClose() {
            audio.pause();
            sendState('stopped');
            vscode.postMessage({ type: 'close' });
        }
                // CSP-compliant event handlers (no inline onclick)
        document.querySelectorAll('[data-cmd]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.getAttribute('data-cmd');
                if (cmd === 'togglePlayPause') togglePlayPause();
                else if (cmd === 'stopAndClose') stopAndClose();
            });
        });
                // Initialize audio on load
        log('Script loaded, initializing...');
        sendState('loading');
        initAudio();
    </script>
</body>
</html>`;
}

/**
 * Play audio using webview panel (cross-platform, integrated UI)
 */
export async function playWithWebview(
    audioBuffer: Buffer,
    context: vscode.ExtensionContext,
    onState?: PlaybackCallback,
    voiceName?: string
): Promise<void> {
    // Clean up previous panel if exists
    if (audioPanel) {
        audioPanel.dispose();
    }
    
    const playbackId = `playback-${Date.now()}`;
    currentPlaybackId = playbackId;
    
    // Save audio to extension's media folder (reliable webview access)
    const mediaFile = await saveToMediaFile(audioBuffer, context.globalStorageUri, '.mp3');
    currentMediaFile = mediaFile;
    const audioFileUri = vscode.Uri.file(mediaFile);
    const mediaFolderUri = vscode.Uri.file(path.dirname(mediaFile));
    
    console.log('[AlexTTS] Media folder:', mediaFolderUri.fsPath);
    
    // Create webview panel
    audioPanel = vscode.window.createWebviewPanel(
        'alexTtsPlayer',
        'Alex Speaking',
        {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: true
        },
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [mediaFolderUri]
        }
    );
    
    // Convert file path to webview URI
    const audioUri = audioPanel.webview.asWebviewUri(audioFileUri).toString();
    console.log('[AlexTTS] Audio file URI:', audioUri);
    
    // Set webview content
    audioPanel.webview.html = getAudioPlayerHtml(audioUri, playbackId, voiceName);
    
    // Handle messages from webview
    audioPanel.webview.onDidReceiveMessage(
        message => {
            // Handle debug messages from any playback
            if (message.type === 'debug') {
                console.log('[AlexTTS WebView]', message.message);
                return;
            }
            
            if (message.playbackId !== playbackId) {
                return; // Ignore messages from old playbacks
            }
            
            switch (message.type) {
                case 'playbackState':
                    console.log('[AlexTTS] State:', message.state);
                    
                    // Set context for keyboard shortcut (Escape to stop)
                    const isPlaying = message.state === 'playing' || message.state === 'loading';
                    vscode.commands.executeCommand('setContext', 'alex.ttsPlaying', isPlaying);
                    
                    onState?.({
                        state: message.state,
                        progress: message.progress,
                        duration: message.duration,
                        currentTime: message.currentTime,
                        error: message.error
                    });
                    break;
                    
                case 'close':
                    audioPanel?.dispose();
                    audioPanel = undefined;
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
    
    // Handle panel disposal
    audioPanel.onDidDispose(() => {
        if (currentPlaybackId === playbackId) {
            audioPanel = undefined;
            currentPlaybackId = undefined;
            vscode.commands.executeCommand('setContext', 'alex.ttsPlaying', false);
            onState?.({ state: 'stopped' });
        }
    });
    
    // Cleanup old media files in background
    cleanupMediaFiles().catch(() => {});
}

/**
 * Save audio buffer to OS temp file (for system player)
 */
async function saveToTempFile(audioBuffer: Buffer, extension: string = '.mp3'): Promise<string> {
    const tempDir = path.join(os.tmpdir(), 'alex-tts');
    await fs.ensureDir(tempDir);
    
    const filename = `alex-speech-${Date.now()}${extension}`;
    const filepath = path.join(tempDir, filename);
    await fs.writeFile(filepath, new Uint8Array(audioBuffer));
    
    return filepath;
}

/**
 * Play audio using system player (fallback for headless scenarios)
 */
export async function playWithSystem(audioBuffer: Buffer): Promise<void> {
    const tempFile = await saveToTempFile(audioBuffer);
    
    return new Promise((resolve, reject) => {
        let command: string;
        
        switch (process.platform) {
            case 'win32':
                command = `start "" "${tempFile}"`;
                break;
            case 'darwin':
                command = `afplay "${tempFile}"`;
                break;
            case 'linux':
                command = `mpv "${tempFile}" || mplayer "${tempFile}" || aplay "${tempFile}"`;
                break;
            default:
                reject(new Error(`Unsupported platform: ${process.platform}`));
                return;
        }
        
        exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Save audio buffer to file
 */
export async function saveAudioToFile(
    audioBuffer: Buffer,
    outputPath: string
): Promise<string> {
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, new Uint8Array(audioBuffer));
    return outputPath;
}

/**
 * Stop current playback
 */
export function stopPlayback(): void {
    if (audioPanel) {
        audioPanel.dispose();
        audioPanel = undefined;
        currentPlaybackId = undefined;
    }
}

/**
 * Check if audio is currently playing
 */
export function isPlaying(): boolean {
    return audioPanel !== undefined;
}
