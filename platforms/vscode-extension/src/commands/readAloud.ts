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
    detectLanguage,
    getVoiceForLanguage,
    VOICE_PRESETS,
    LANGUAGE_VOICES,
    type VoicePreset,
    type TTSProgress,
    type TTSChunkedProgress
} from '../tts';

// Confidence threshold below which we ask user to confirm language
const LANGUAGE_CONFIDENCE_THRESHOLD = 0.15;

// Duration estimation constants
const WORDS_PER_MINUTE = 150;          // Average TTS speaking rate
const LONG_CONTENT_THRESHOLD_MINUTES = 5; // Offer summarization above this
const LONG_CONTENT_WORD_THRESHOLD = WORDS_PER_MINUTE * LONG_CONTENT_THRESHOLD_MINUTES; // 750 words

/**
 * Estimate audio duration from word count
 */
function estimateDuration(wordCount: number): { minutes: number; formatted: string } {
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    if (minutes < 1) {
        return { minutes: 0, formatted: 'less than 1 minute' };
    } else if (minutes === 1) {
        return { minutes: 1, formatted: '~1 minute' };
    } else {
        return { minutes, formatted: `~${minutes} minutes` };
    }
}

/**
 * Summarize content using VS Code's Language Model API
 * Returns a concise summary suitable for reading aloud
 */
async function summarizeForSpeech(text: string, targetMinutes: number = 3): Promise<string | undefined> {
    try {
        // Get available chat models
        const models = await vscode.lm.selectChatModels({ family: 'gpt-4o' });
        if (models.length === 0) {
            // Fall back to any available model
            const allModels = await vscode.lm.selectChatModels();
            if (allModels.length === 0) {
                vscode.window.showWarningMessage('No language model available for summarization. Reading full content.');
                return undefined;
            }
            models.push(allModels[0]);
        }
        
        const model = models[0];
        const targetWords = targetMinutes * WORDS_PER_MINUTE;
        
        const messages = [
            vscode.LanguageModelChatMessage.User(`You are summarizing a document for text-to-speech. Create a clear, spoken-word summary that captures the key points.

Requirements:
- Target length: approximately ${targetWords} words (${targetMinutes} minutes when read aloud)
- Write in complete sentences suitable for listening
- Preserve the document's main arguments, findings, and conclusions
- Maintain the original tone and voice
- Do NOT use markdown formatting - plain text only
- Do NOT say "This document..." or "The author..." - speak as if presenting the content directly

Document to summarize:
${text}`)
        ];
        
        const response = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
        
        let summary = '';
        for await (const chunk of response.text) {
            summary += chunk;
        }
        
        return summary.trim();
    } catch (error) {
        console.error('Summarization failed:', error);
        vscode.window.showWarningMessage('Failed to summarize. Reading full content.');
        return undefined;
    }
}

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
 * @param context Extension context
 * @param voicePreset Voice preset to use
 * @param uri Optional file URI (from explorer context menu)
 */
export async function readAloud(
    context: vscode.ExtensionContext,
    voicePreset: VoicePreset = 'default',
    uri?: vscode.Uri
): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    let rawText: string;
    let isMarkdown = false;
    
    // If URI provided (from explorer context menu), read from file
    if (uri) {
        try {
            const content = await vscode.workspace.fs.readFile(uri);
            rawText = new TextDecoder().decode(content);
            isMarkdown = uri.fsPath.endsWith('.md');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
    } else if (!editor) {
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
    let textToSpeak = isMarkdown ? prepareTextForSpeech(rawText) : rawText;
    
    // Check length and offer summarization for long documents
    const wordCount = textToSpeak.split(/\s+/).length;
    const duration = estimateDuration(wordCount);
    
    if (wordCount > LONG_CONTENT_WORD_THRESHOLD) {
        const summaryDuration = estimateDuration(WORDS_PER_MINUTE * 3); // ~3 minute summary
        
        const choice = await vscode.window.showWarningMessage(
            `This content is ${duration.formatted} long (~${wordCount} words). Would you like a summary instead?`,
            { modal: false },
            'Read Summary (~3 min)',
            'Read Full Content',
            'Cancel'
        );
        
        if (choice === 'Cancel' || !choice) {
            return;
        }
        
        if (choice === 'Read Summary (~3 min)') {
            showTTSStatus('Summarizing...', true);
            
            const summary = await summarizeForSpeech(rawText, 3);
            if (summary) {
                textToSpeak = summary;
                vscode.window.showInformationMessage(
                    `Reading summarized version (${estimateDuration(summary.split(/\s+/).length).formatted})`
                );
            }
            // If summarization fails, we continue with full text
        }
    }
    
    // Detect language
    const detected = detectLanguage(textToSpeak);
    let selectedVoice: string;
    let selectedLang: string;
    
    if (detected.confidence >= LANGUAGE_CONFIDENCE_THRESHOLD) {
        // High confidence - use detected language
        selectedVoice = getVoiceForLanguage(detected.lang);
        selectedLang = detected.lang;
        
        // For non-English, show brief notification
        if (!detected.lang.startsWith('en-')) {
            vscode.window.showInformationMessage(`Detected ${detected.name} - using ${selectedVoice.split('-')[2]}`);
        }
    } else {
        // Low confidence - ask user
        const languageItems = Object.entries(LANGUAGE_VOICES).map(([code, info]) => ({
            label: info.name,
            description: code,
            detail: info.voice,
            code
        }));
        
        // Put detected language first, then English
        languageItems.sort((a, b) => {
            if (a.code === detected.lang) {return -1;}
            if (b.code === detected.lang) {return 1;}
            if (a.code === 'en-US') {return -1;}
            if (b.code === 'en-US') {return 1;}
            return a.label.localeCompare(b.label);
        });
        
        const selected = await vscode.window.showQuickPick(languageItems, {
            title: 'Select Language',
            placeHolder: `Could not auto-detect language (best guess: ${detected.name}). Please select:`,
            matchOnDescription: true
        });
        
        if (!selected) {
            return; // User cancelled
        }
        
        selectedVoice = LANGUAGE_VOICES[selected.code].voice;
        selectedLang = selected.code;
    }
    
    // Override with English preset if user explicitly selected one and text is English
    if (voicePreset !== 'default' && selectedLang.startsWith('en-')) {
        selectedVoice = VOICE_PRESETS[voicePreset];
    }
    
    try {
        showTTSStatus('Synthesizing...', true);
        
        // Synthesize audio
        const voice = selectedVoice;
        const audioBuffer = await synthesize(
            textToSpeak,
            { voice, lang: selectedLang },
            (progress: TTSChunkedProgress) => {
                // Build chunk indicator for long documents
                const chunkInfo = progress.totalChunks && progress.totalChunks > 1
                    ? ` [${progress.currentChunk}/${progress.totalChunks}]`
                    : '';
                
                switch (progress.state) {
                    case 'connecting':
                        showTTSStatus(`Connecting...${chunkInfo}`, true);
                        break;
                    case 'synthesizing':
                        showTTSStatus(`Synthesizing...${chunkInfo}`, true);
                        break;
                    case 'streaming':
                        const kb = Math.round((progress.totalBytesReceived || progress.bytesReceived || 0) / 1024);
                        showTTSStatus(`Receiving... ${kb}KB${chunkInfo}`, true);
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
 * @param context Extension context
 * @param voicePreset Voice preset to use
 * @param uri Optional file URI (from explorer context menu)
 */
export async function saveAsAudio(
    context: vscode.ExtensionContext,
    voicePreset: VoicePreset = 'default',
    uri?: vscode.Uri
): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    let rawText: string;
    let defaultName: string;
    let isMarkdown = false;
    
    // If URI provided (from explorer context menu), read from file
    if (uri) {
        try {
            const content = await vscode.workspace.fs.readFile(uri);
            rawText = new TextDecoder().decode(content);
            defaultName = path.basename(uri.fsPath, path.extname(uri.fsPath)) + '.mp3';
            isMarkdown = uri.fsPath.endsWith('.md');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
    } else if (!editor) {
        // No active editor - offer options to get text
        const choice = await vscode.window.showQuickPick([
            { label: '$(clippy) Paste from Clipboard', value: 'clipboard' },
            { label: '$(edit) Type Text', value: 'type' }
        ], {
            title: 'Alex: Save as Audio',
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
                title: 'Alex: Save as Audio',
                prompt: 'Enter text to save as audio',
                placeHolder: 'Type text here...',
                ignoreFocusOut: true
            });
            
            if (!input?.trim()) {
                return; // User cancelled or empty input
            }
            rawText = input;
        }
        defaultName = 'audio.mp3';
    } else {
        // Get text to save from editor
        rawText = getTextToRead(editor);
        defaultName = path.basename(
            editor.document.fileName,
            path.extname(editor.document.fileName)
        ) + '.mp3';
        isMarkdown = editor.document.languageId === 'markdown';
    }
    
    if (!rawText.trim()) {
        vscode.window.showWarningMessage('No text to convert. Select text or open a document with content.');
        return;
    }
    
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
    let textToSpeak = isMarkdown ? prepareTextForSpeech(rawText) : rawText;
    
    // Check length and offer summarization for long documents
    const wordCount = textToSpeak.split(/\s+/).length;
    const duration = estimateDuration(wordCount);
    
    if (wordCount > LONG_CONTENT_WORD_THRESHOLD) {
        const choice = await vscode.window.showWarningMessage(
            `This content is ${duration.formatted} long (~${wordCount} words). Would you like a summary instead?`,
            { modal: false },
            'Save Summary (~3 min)',
            'Save Full Content',
            'Cancel'
        );
        
        if (choice === 'Cancel' || !choice) {
            return;
        }
        
        if (choice === 'Save Summary (~3 min)') {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Summarizing content...',
                    cancellable: false
                },
                async () => {
                    const summary = await summarizeForSpeech(rawText, 3);
                    if (summary) {
                        textToSpeak = summary;
                    }
                }
            );
        }
    }
    
    // Detect language
    const detected = detectLanguage(textToSpeak);
    let selectedVoice: string;
    let selectedLang: string;
    
    if (detected.confidence >= LANGUAGE_CONFIDENCE_THRESHOLD) {
        selectedVoice = getVoiceForLanguage(detected.lang);
        selectedLang = detected.lang;
    } else {
        // Ask user for language for save operation
        const languageItems = Object.entries(LANGUAGE_VOICES).map(([code, info]) => ({
            label: info.name,
            description: code,
            code
        }));
        
        languageItems.sort((a, b) => {
            if (a.code === detected.lang) {return -1;}
            if (b.code === detected.lang) {return 1;}
            if (a.code === 'en-US') {return -1;}
            if (b.code === 'en-US') {return 1;}
            return a.label.localeCompare(b.label);
        });
        
        const selected = await vscode.window.showQuickPick(languageItems, {
            title: 'Select Language for Audio',
            placeHolder: `Best guess: ${detected.name}. Please confirm:`,
            matchOnDescription: true
        });
        
        if (!selected) {
            return; // User cancelled
        }
        
        selectedVoice = LANGUAGE_VOICES[selected.code].voice;
        selectedLang = selected.code;
    }
    
    // Override with English preset if user explicitly selected one
    if (voicePreset !== 'default' && selectedLang.startsWith('en-')) {
        selectedVoice = VOICE_PRESETS[voicePreset];
    }
    
    try {
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Generating audio...',
                cancellable: false
            },
            async (progress) => {
                progress.report({ message: 'Connecting to TTS service...' });
                
                const audioBuffer = await synthesize(
                    textToSpeak,
                    { voice: selectedVoice, lang: selectedLang },
                    (ttsProgress: TTSChunkedProgress) => {
                        if (ttsProgress.state === 'streaming') {
                            const kb = Math.round((ttsProgress.totalBytesReceived || ttsProgress.bytesReceived || 0) / 1024);
                            const chunkInfo = ttsProgress.totalChunks && ttsProgress.totalChunks > 1
                                ? ` [${ttsProgress.currentChunk}/${ttsProgress.totalChunks}]`
                                : '';
                            progress.report({ message: `Receiving audio... ${kb}KB${chunkInfo}` });
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
    // Main read aloud command (accepts optional URI from explorer context menu)
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.readAloud', (uri?: vscode.Uri) => readAloud(context, 'default', uri))
    );
    
    // Read with voice selection
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.readWithVoice', () => readWithVoice(context))
    );
    
    // Save as audio command (accepts optional URI from explorer context menu)
    context.subscriptions.push(
        vscode.commands.registerCommand('alex.saveAsAudio', (uri?: vscode.Uri) => saveAsAudio(context, 'default', uri))
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
