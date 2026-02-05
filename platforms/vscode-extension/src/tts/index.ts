/**
 * TTS Module Index
 * 
 * Exports all TTS functionality for use in the extension.
 */

export {
    synthesize,
    listVoices,
    prepareTextForSpeech,
    detectLanguage,
    getVoiceForLanguage,
    VOICE_PRESETS,
    LANGUAGE_VOICES,
    type VoicePreset,
    type TTSOptions,
    type TTSProgress,
    type TTSChunkedProgress
} from './ttsService';

export {
    playWithWebview,
    playWithSystem,
    saveAudioToFile,
    stopPlayback,
    isPlaying,
    type PlaybackState
} from './audioPlayer';
