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

export interface PlaybackState {
    state: 'loading' | 'playing' | 'paused' | 'stopped' | 'ended' | 'error';
    progress?: number;    // 0-100 percentage
    duration?: number;    // seconds
    currentTime?: number; // seconds
    error?: string;
}

type PlaybackCallback = (state: PlaybackState) => void;

/**
 * Save audio buffer to temp file and return path
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
 * Clean up old temp files (older than 1 hour)
 */
async function cleanupTempFiles(): Promise<void> {
    const tempDir = path.join(os.tmpdir(), 'alex-tts');
    
    try {
        if (!await fs.pathExists(tempDir)) {
            return;
        }
        
        const files = await fs.readdir(tempDir);
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const file of files) {
            const filepath = path.join(tempDir, file);
            const stats = await fs.stat(filepath);
            
            if (stats.mtimeMs < oneHourAgo) {
                await fs.unlink(filepath).catch(() => {});
            }
        }
    } catch (error) {
        // Ignore cleanup errors
        console.warn('TTS temp cleanup error:', error);
    }
}

/**
 * Get HTML content for the audio player webview
 */
function getAudioPlayerHtml(audioBase64: string, playbackId: string): string {
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; media-src data:;">
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
            <button id="playPauseBtn" onclick="togglePlayPause()">
                <span class="icon" id="playPauseIcon">⏸</span>
                <span id="playPauseText">Pause</span>
            </button>
            <button class="secondary" onclick="stopAndClose()">
                <span class="icon">⏹</span>
                Stop
            </button>
        </div>
        
        <p class="status" id="status">Playing...</p>
        <p class="voice-info">Voice: Alex (en-US-GuyNeural)</p>
    </div>

    <audio id="audio">
        <source src="data:audio/mp3;base64,${audioBase64}" type="audio/mp3">
    </audio>

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
        
        // Speaker activation delay (helps wake up Bluetooth/USB speakers)
        const SPEAKER_WARMUP_MS = 2000;
        
        function formatTime(seconds) {
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
        
        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });
        
        audio.addEventListener('canplaythrough', () => {
            // Add a brief delay to wake up speakers (Bluetooth/USB often need time)
            statusEl.textContent = 'Preparing speakers...';
            sendState('preparing');
            
            setTimeout(() => {
                audio.play().then(() => {
                    statusEl.textContent = 'Playing...';
                    sendState('playing', { duration: audio.duration });
                }).catch(err => {
                    statusEl.textContent = 'Click Play to start';
                    playPauseIcon.textContent = '▶';
                    playPauseText.textContent = 'Play';
                    sendState('paused');
                });
            }, SPEAKER_WARMUP_MS);
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
            statusEl.textContent = 'Finished';
            playPauseIcon.textContent = '▶';
            playPauseText.textContent = 'Replay';
            sendState('ended');
        });
        
        audio.addEventListener('error', (e) => {
            statusEl.textContent = 'Error playing audio';
            sendState('error', { error: 'Audio playback failed' });
        });
        
        function togglePlayPause() {
            if (audio.ended) {
                audio.currentTime = 0;
                audio.play();
            } else if (audio.paused) {
                audio.play();
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
        
        // Start playing notification
        sendState('loading');
        
        // Ensure audio starts (backup for canplaythrough)
        audio.addEventListener('loadstart', () => {
            statusEl.textContent = 'Loading audio...';
        });
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
    onState?: PlaybackCallback
): Promise<void> {
    // Clean up previous panel if exists
    if (audioPanel) {
        audioPanel.dispose();
    }
    
    const playbackId = `playback-${Date.now()}`;
    currentPlaybackId = playbackId;
    
    // Convert buffer to base64
    const audioBase64 = audioBuffer.toString('base64');
    
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
            retainContextWhenHidden: true
        }
    );
    
    // Set webview content
    audioPanel.webview.html = getAudioPlayerHtml(audioBase64, playbackId);
    
    // Handle messages from webview
    audioPanel.webview.onDidReceiveMessage(
        message => {
            if (message.playbackId !== playbackId) {
                return; // Ignore messages from old playbacks
            }
            
            switch (message.type) {
                case 'playbackState':
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
            onState?.({ state: 'stopped' });
        }
    });
    
    // Cleanup old temp files in background
    cleanupTempFiles().catch(() => {});
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
