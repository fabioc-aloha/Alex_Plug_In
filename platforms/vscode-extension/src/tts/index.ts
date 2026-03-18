/**
 * TTS Module Index
 * 
 * Exports all TTS functionality for use in the extension.
 */

export {
    synthesize,
    listVoices,
    detectLanguage,
    getVoiceForLanguage,
    VOICE_PRESETS,
    LANGUAGE_VOICES,
    type VoicePreset,
    type TTSOptions,
    type TTSProgress,
    type TTSChunkedProgress
} from './ttsService';

export { prepareTextForSpeech } from './speechTextProcessor';

export {
    playWithWebview,
    playWithSystem,
    saveAudioToFile,
    stopPlayback,
    isPlaying,
    type PlaybackState
} from './audioPlayer';
