---
description: "Store and manage voice samples for TTS cloning — portable, version-controlled audio references"
application: "When storing voice samples for TTS cloning or managing audio memory"
applyTo: '**/*voice*,**/*audio*memory*,**/*clone*voice*'
---

# Audio Memory

Store voice samples for TTS voice cloning in a portable, version-controlled format.

## Activation

This instruction activates when:
- User wants to store a voice sample for cloning
- User asks about audio memory management
- User wants to set up voice cloning references

## Quick Reference

### Storage Location

```
.github/skills/<skill>/audio-memory/
├── index.json              # Metadata registry
└── voices/
    └── <name>-sample.wav   # Voice samples
```

### Voice Sample Requirements

| Spec       | Value                    |
| ---------- | ------------------------ |
| Duration   | 5-15 seconds             |
| Format     | WAV or MP3               |
| Sample rate| 16kHz+ (22kHz+ better)   |
| Content    | Natural speech, no noise |

### index.json Entry

```json
{
  "voices": {
    "<name>": {
      "description": "Voice character description",
      "audioFile": "voices/<name>-sample.wav",
      "duration": "10s",
      "preferredModel": "chatterbox-turbo"
    }
  }
}
```

## Compatible Models

| Model              | Clone Support | Notes                    |
| ------------------ | ------------- | ------------------------ |
| chatterbox-turbo   | ✅ 5s sample  | Best for English         |
| qwen/qwen3-tts     | ✅ 3 modes    | Multi-language           |
| minimax/speech-2.8 | ❌ Presets    | 40+ built-in voices      |

## Skill Reference

Full documentation: [audio-memory/SKILL.md](../skills/audio-memory/SKILL.md)
