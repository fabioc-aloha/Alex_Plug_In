---
name: "audio-memory"
description: "Store and manage voice samples for TTS cloning — portable, version-controlled audio references"
tier: standard
applyTo: '**/*voice*,**/*audio*memory*,**/*clone*voice*'
$schema: ../SKILL-SCHEMA.json
---

# Audio Memory Skill

> **Domain**: AI Audio / Voice Cloning  
> **Version**: 1.0.0  
> **Last Updated**: 2026-04-15  
> **Author**: Alex (Master Alex)  
> **Related**: [text-to-speech](../text-to-speech/SKILL.md) (generation), [visual-memory](../visual-memory/SKILL.md) (photos)

## Overview

Store voice samples for TTS voice cloning in a portable, version-controlled format. Unlike visual memory (base64 inline), audio files are stored as files with JSON metadata — audio is too large to embed sensibly.

## Voice Sample Specifications

| Spec           | Value                                    |
| -------------- | ---------------------------------------- |
| Duration       | 5-15 seconds of clear speech             |
| Format         | WAV (preferred) or MP3                   |
| Sample rate    | 16kHz+ (22kHz+ recommended)              |
| Content        | Natural speech, varied intonation        |
| Background     | No music, no background noise            |
| File size      | ~100KB-500KB per sample                  |

## Storage Structure

```
.github/skills/<skill-name>/audio-memory/
├── index.json              # Metadata registry
├── voices/
│   ├── alex-sample.wav     # Voice sample files
│   ├── narrator-sample.wav
│   └── ...
└── README.md               # Usage notes (optional)
```

## index.json Schema

```json
{
  "version": "1.0",
  "updated": "2026-04-15",
  "voices": {
    "alex": {
      "description": "Natural conversational voice, warm and friendly",
      "audioFile": "voices/alex-sample.wav",
      "duration": "10s",
      "sampleRate": "22050",
      "language": "en-US",
      "preferredModel": "chatterbox-turbo",
      "notes": "Best for narration and documentation reads"
    },
    "narrator": {
      "description": "Professional narration voice",
      "audioFile": "voices/narrator-sample.wav",
      "duration": "12s",
      "sampleRate": "44100",
      "language": "en-US",
      "preferredModel": "qwen/qwen3-tts"
    }
  }
}
```

## Compatible TTS Models

| Model              | Replicate ID                   | Voice Cloning | Cost             |
| ------------------ | ------------------------------ | ------------- | ---------------- |
| **Chatterbox Turbo** | `resemble-ai/chatterbox-turbo` | ✅ 5s sample  | $0.025/1k chars  |
| **Qwen TTS**       | `qwen/qwen3-tts`               | ✅ 3 modes    | $0.02/1k chars   |
| **MiniMax Speech** | `minimax/speech-2.8-turbo`     | ❌ Presets    | $0.06/1k tokens  |

**Note**: MiniMax doesn't support cloning but has 40+ voice presets.

---

## Recording Voice Samples

### Requirements

- **Duration**: 5-15 seconds (longer = better quality cloning)
- **Content**: Natural speech with varied intonation (not monotone reading)
- **Quality**: Clear audio, no background noise, no music
- **Format**: WAV 16kHz+ or MP3

### Recording Tips

1. Use a quiet room with minimal echo
2. Speak naturally — include some pauses, varied pitch
3. Avoid reading monotonously — conversational tone works best
4. Keep microphone at consistent distance (~6-12 inches)
5. Include a variety of sounds (different vowels, consonants)

### Example Recording Script

> "Hello, I'm [Name]. Today I want to share some thoughts about technology and how it shapes our daily lives. The key is finding balance — embracing innovation while staying grounded in what matters most."

---

## Adding a Voice Sample

### Step 1: Record the Sample

```powershell
# Recommended: Use Audacity, Voice Memos (macOS), or Windows Voice Recorder
# Export as WAV, 22kHz or 44.1kHz, mono
```

### Step 2: Place in Audio Memory

```powershell
# Create directory structure
New-Item -ItemType Directory -Path ".github/skills/<skill>/audio-memory/voices" -Force

# Copy voice sample
Copy-Item "my-recording.wav" ".github/skills/<skill>/audio-memory/voices/<name>-sample.wav"
```

### Step 3: Update index.json

```json
{
  "voices": {
    "<name>": {
      "description": "Brief description of the voice character",
      "audioFile": "voices/<name>-sample.wav",
      "duration": "10s",
      "sampleRate": "22050",
      "language": "en-US",
      "preferredModel": "chatterbox-turbo"
    }
  }
}
```

### Step 4: Test the Clone

```javascript
import Replicate from "replicate";

const replicate = new Replicate();

const output = await replicate.run("resemble-ai/chatterbox-turbo", {
  input: {
    text: "Testing the voice clone. This should sound like the reference sample.",
    audio_prompt: fs.readFileSync("voices/<name>-sample.wav"),
  },
});

console.log("Generated audio:", output);
```

---

## Using Audio Memory in Generation

### With Chatterbox Turbo

```javascript
import { readFileSync } from "fs";
import Replicate from "replicate";

// Load audio memory
const audioMemory = JSON.parse(
  readFileSync(".github/skills/<skill>/audio-memory/index.json", "utf8")
);
const voice = audioMemory.voices["alex"];

// Generate speech with cloned voice
const replicate = new Replicate();
const output = await replicate.run("resemble-ai/chatterbox-turbo", {
  input: {
    text: "Content to speak in the cloned voice",
    audio_prompt: readFileSync(
      `.github/skills/<skill>/audio-memory/${voice.audioFile}`
    ),
  },
});
```

### With Qwen TTS (Clone Mode)

```javascript
const output = await replicate.run("qwen/qwen3-tts", {
  input: {
    text: "Content to speak",
    tts_mode: "voice_clone",
    audio_input: readFileSync(
      `.github/skills/<skill>/audio-memory/${voice.audioFile}`
    ),
  },
});
```

---

## Quality Guidelines

| Element         | Recommendation                                  |
| --------------- | ----------------------------------------------- |
| Sample duration | 10s optimal (5s minimum, 15s maximum)           |
| Varied speech   | Include questions, statements, exclamations     |
| Distinct voice  | Clear enunciation, consistent microphone setup  |
| File format     | WAV preferred (lossless), MP3 acceptable        |
| Sample rate     | 22kHz+ (44.1kHz for premium)                    |

---

## Benefits vs External Storage

| Without Audio Memory        | With Audio Memory                |
| --------------------------- | -------------------------------- |
| External folder required    | Version-controlled with code     |
| Breaks on different machines| Works anywhere                   |
| Manual path management      | Structured JSON metadata         |
| No documentation            | Self-describing with index.json  |
| Ad-hoc organization         | Consistent skill-scoped storage  |

---

## Integration with text-to-speech Skill

This skill stores voice samples. Use the [text-to-speech](../text-to-speech/SKILL.md) skill for:

- Generating speech from text
- Model selection (MiniMax, Chatterbox, Qwen)
- Emotion control
- Voice design from descriptions (no sample needed)

**Workflow**:
1. **audio-memory**: Store and manage voice samples
2. **text-to-speech**: Generate speech using those samples
