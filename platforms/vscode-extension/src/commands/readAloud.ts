/**
 * Read Aloud Command v2
 * 
 * Provides the "Alex: Read Aloud" command for text-to-speech functionality.
 * Uses native TypeScript TTS implementation with webview audio player.
 * 
 * Features:
 * - Read current selection or entire document
 * - Multiple voice presets (Alex's voices)
 * - Speech rate/pitch adjustments
 * - Save to MP3 file
 * - Status bar feedback during synthesis
 */

import * as vscode from 'vscode';
import * as path from 'path';
import {
    synthesize,
    prepareTextForSpeech,
    playWithWebview,
    saveAudioToFile,
    stopPlayback,
    isPlaying,
    VOICE_PRESETS,
    type VoicePreset,
    type TTSProgress
} from '../tts';

// Status bar item for TTS progress
let ttsStatusBar: vscode.StatusBarItem | undefined;

/**
 * Get text to read - selection or full document
 */
function getTextToRead(editor: vscode.TextEditor): string {
    const selection = editor.selection;
    
    if (!selection.isEmpty) {
        return editor.document.getText(selection);
    }
    
    return editor.document.getText();
}

/**
 * Show TTS status in status bar
 */
function showTTSStatus(message: string, isSpinning: boolean = false): void {
    if (!ttsStatusBar) {
        ttsStatusBar = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
    }
    
    const icon = isSpinning ? '$(loading~spin)' : '$(unmute)';
    ttsStatusBar.text = `${icon} ${message}`;
    ttsStatusBar.tooltip = 'Alex Text-to-Speech';
    ttsStatusBar.command = 'alex.stopReading';
    ttsStatusBar.show();
}

/**
 * Hide TTS status bar
 */
function hideTTSStatus(): void {
    ttsStatusBar?.hide();
}

/**
 * Main command: Read current document/selection aloud
 */
export async function readAloud(
    context: vscode.ExtensionContext,
    voicePreset: VoicePreset = 'default'
): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    let rawText: string;
    let isMarkdown = false;
    
    if (!editor) {
        // No active editor - offer options to get text
        const choice = await vscode.window.showQuickPick([
            { label: '$(clippy) Paste from Clipboard', value: 'clipboard' },
            { label: '$(edit) Type Text', value: 'type' }
        ], {
            title: 'Alex: Read Aloud',
            placeHolder: 'No document open. How would you like to provide text?'
        });
        
        if (!choice) {
            return; // User cancelled
        }
        
        if (choice.value === 'clipboard') {
            rawText = await vscode.env.clipboard.readText();
            if (!rawText.trim()) {
                vscode.window.showWarningMessage('Clipboard is empty. Copy some text first.');
                return;
            }
        } else {
            const input = await vscode.window.showInputBox({
                title: 'Alex: Read Aloud',
                prompt: 'Enter text to read aloud',
                placeHolder: 'Type text here...',
                ignoreFocusOut: true
            });
            
            if (!input?.trim()) {
                return; // User cancelled or empty input
            }
            rawText = input;
        }
    } else {
        // Get text from editor (selection or full document)
        rawText = getTextToRead(editor);
        isMarkdown = editor.document.languageId === 'markdown';
    }
    
    if (!rawText.trim()) {
        vscode.window.showWarningMessage('No text to read. Select text or open a document with content.');
        return;
    }
    
    // Detect markdown in pasted/typed text (heuristics)
    if (!isMarkdown) {
        const markdownPatterns = /^#+\s|^\|.*\|$|\*\*.*\*\*|__.*__|```|\[.*\]\(.*\)|^[-*]\s/m;
        if (markdownPatterns.test(rawText)) {
            isMarkdown = true;
        }
    }
    
    // Prepare text for speech (strip markdown, etc.)
    const textToSpeak = isMarkdown ? prepareTextForSpeech(rawText) : rawText;
    
    // Check length and warn for very long documents
    const wordCount = textToSpeak.split(/\s+/).length;
    
    if (wordCount > 5000) {
        const proceed = await vscode.window.showWarningMessage(
            `This document has ~${wordCount} words and may take a while to synthesize. Continue?`,
            'Yes, read it',
            'Cancel'
        );
        
        if (proceed !== 'Yes, read it') {
            return;
        }
    }
    
    try {
        showTTSStatus('Synthesizing...', true);
        
        // Synthesize audio
        const voice = VOICE_PRESETS[voicePreset];
        const audioBuffer = await synthesize(
            textToSpeak,
            { voice },
            (progress: TTSProgress) => {
                switch (progress.state) {
                    case 'connecting':
                        showTTSStatus('Connecting...', true);
                        break;
                    case 'synthesizing':
                        showTTSStatus('Synthesizing...', true);
                        break;
                    case 'streaming':
                        const kb = Math.round((progress.bytesReceived || 0) / 1024);
                        showTTSStatus(`Receiving... ${kb}KB`, true);
                        break;
                    case 'complete':
                        showTTSStatus('Preparing playback...', true);
                        break;
                    case 'error':
                        showTTSStatus('Error', false);
                        vscode.window.showErrorMessage(`TTS Error: ${progress.error}`);
                        break;
                }
            }
        );
        
        showTTSStatus('Playing', false);
        
        // Play audio in webview
        await playWithWebview(audioBuffer, context, (state) => {
            switch (state.state) {
                case 'playing':
                    const percent = state.progress ? Math.round(state.progress) : 0;
                    showTTSStatus(`Playing ${percent}%`, false);
                    break;
                case 'paused':
                    showTTSStatus('Paused', false);
                    break;
                case 'ended':
                case 'stopped':
                    hideTTSStatus();
                    break;
                case 'error':
                    hideTTSStatus();
                    vscode.window.showErrorMessage(`Playback error: ${state.error}`);
                    break;
            }
        });
        
    } catch (error) {
        hideTTSStatus();
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to read aloud: ${message}`);
    }
}

/**
 * Save current document/selection as MP3
 */
export async function saveAsAudio(
    context: vscode.ExtensionContext,
    voicePreset: VoicePreset = 'default'
): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showWarningMessage('No active editor. Open a document to save as audio.');
        return;
    }
    
    // Get text to save
    const rawText = getTextToRead(editor);
    
    if (!rawText.trim()) {
        vscode.window.showWarningMessage('No text to convert. Select text or open a document with content.');
        return;
    }
    
    // Ask for output file location
    const defaultName = path.basename(
        editor.document.fileName,
        path.extname(editor.document.fileName)
    ) + '.mp3';
    
    const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(
            path.join(
                vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
                defaultName
            )
        ),
        filters: {
            'MP3 Audio': ['mp3']
        },
        title: 'Save Speech as MP3'
    });
    
    if (!saveUri) {
        return; // User cancelled
    }
    
    // Prepare text for speech
    const isMarkdown = editor.document.languageId === 'markdown';
    const textToSpeak = isMarkdown ? prepareTextForSpeech(rawText) : rawText;
    
    try {
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Generating audio...',
                cancellable: false
            },
            async (progress) => {
                progress.report({ message: 'Connecting to TTS service...' });
                
                const voice = VOICE_PRESETS[voicePreset];
                const audioBuffer = await synthesize(
                    textToSpeak,
                    { voice },
                    (ttsProgress) => {
                        if (ttsProgress.state === 'streaming') {
                            const kb = Math.round((ttsProgress.bytesReceived || 0) / 1024);
                            progress.report({ message: `Receiving audio... ${kb}KB` });
                        }
                    }
                );
                
                progress.report({ message: 'Saving file...' });
                await saveAudioToFile(audioBuffer, saveUri.fsPath);
            }
        );
        
        const openFile = await vscode.window.showInformationMessage(
            `Audio saved to ${path.basename(saveUri.fsPath)}`,
            'Open File',
            'Open Folder'
        );
        
        if (openFile === 'Open File') {
            vscode.env.openExternal(saveUri);
        } else if (openFile === 'Open Folder') {
            vscode.env.openExternal(vscode.Uri.file(path.dirname(saveUri.fsPath)));
        }
        
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to save audio: ${message}`);
    }
}

/**
 * Stop current TTS playback
 */
export function stopReading(): void {
    stopPlayback();
    hideTTSStatus();
}

/**
 * Quick voice selection and read
 */
export async function readWithVoice(context: vscode.ExtensionContext): Promise<void> {
    const voiceItems = Object.entries(VOICE_PRESETS).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        description: value,
        preset: key as VoicePreset
    }));
    
    const selected = await vscode.window.showQuickPick(voiceItems, {
        placeHolder: 'Select Alex voice preset',
        title: 'Read Aloud with Voice'
    });
    
    if (selected) {
        await readAloud(context, selected.preset);
    }
}

/**
 * Register all TTS commands
 */
export function registerTTSCommands(context: vscode.ExtensionContext): void {
    // Main read aloud command
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.readAloud', () => readAloud(context))
    );
    
    // Read with voice selection
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.readWithVoice', () => readWithVoice(context))
    );
    
    // Save as audio command
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.saveAsAudio', () => saveAsAudio(context))
    );
    
    // Stop reading command
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.stopReading', () => stopReading())
    );
    
    // Create status bar item (disposed with extension)
    ttsStatusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    context.subscriptions.push(ttsStatusBar);
}
