/**
 * TTS Module Index
 * 
 * Exports all TTS functionality for use in the extension.
 */

export {
    synthesize,
    listVoices,
    prepareTextForSpeech,
    VOICE_PRESETS,
    type VoicePreset,
    type TTSOptions,
    type TTSProgress
} from './ttsService';

export {
    playWithWebview,
    playWithSystem,
    saveAudioToFile,
    stopPlayback,
    isPlaying,
    type PlaybackState
} from './audioPlayer';
