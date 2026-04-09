---
name: "text-to-speech"
description: "Cloud TTS via Replicate for narration, audiobooks, voice cloning, and content creation"
tier: extended
$schema: ../SKILL-SCHEMA.json
---

# Text-to-Speech Skill

> **Domain**: AI Audio Generation  
> **Version**: 3.0.0  
> **Last Updated**: 2026-04-09  
> **Author**: Alex (Master Alex)  
> **Staleness Watch**: See [EXTERNAL-API-REGISTRY.md](../../EXTERNAL-API-REGISTRY.md) for source URLs and recheck cadence

## Overview

Cloud-based speech synthesis via Replicate for narration, audiobooks, voice cloning, and content creation. Uses paid Replicate TTS models (MiniMax Speech, Chatterbox, Qwen TTS) for high-quality output.

**Note**: The VS Code extension's built-in Edge TTS feature was removed in v7.4.0. This skill now focuses exclusively on Replicate cloud TTS for script-based audio generation.

## Model Catalog

| Model                | Replicate ID                   | Cost            | Voice Cloning   | Languages | Best For                      |
| -------------------- | ------------------------------ | --------------- | --------------- | --------- | ----------------------------- |
| **Speech 2.8 Turbo** | `minimax/speech-2.8-turbo`     | $0.06/1k tokens | No              | 40+       | Fast, expressive, many voices |
| **Speech 2.8 HD**    | `minimax/speech-2.8-hd`        | higher          | No              | 40+       | Studio-grade high-fidelity    |
| **Chatterbox Turbo** | `resemble-ai/chatterbox-turbo` | $0.025/1k chars | Yes (5s sample) | English   | Voice cloning, natural pauses |
| **Qwen TTS**         | `qwen/qwen3-tts`               | $0.02/1k chars  | Yes             | 10        | Voice design from description |

## Voice Presets

**Speech Turbo**: `Wise_Woman`, `Deep_Voice_Man`, `Casual_Guy`, `Lively_Girl`, `Young_Knight`, `Abbess`, + 6 more
**Chatterbox**: `Andy`, `Luna`, `Ember`, `Aurora`, `Cliff`, `Josh`, `William`, `Orion`, `Ken`
**Qwen TTS**: `Aiden`, `Dylan`, `Eric`, `Serena`, `Vivian`, + 4 more

## Emotion Control (Speech Turbo)

Supported emotions: `auto`, `happy`, `sad`, `angry`, `fearful`, `disgusted`, `surprised`

## Voice Cloning (Chatterbox / Qwen)

Provide a 5+ second audio sample to clone a voice:

```javascript
const output = await replicate.run("resemble-ai/chatterbox-turbo", {
  input: {
    text: "Content to speak in the cloned voice",
    audio_prompt: referenceAudioDataURI, // 5+ seconds WAV/MP3
  },
});
```

## Voice Design (Qwen TTS)

Create a voice from a natural language description:

```javascript
const output = await replicate.run("qwen/qwen3-tts", {
  input: {
    text: "Content to speak",
    tts_mode: "voice_design",
    voice_description:
      "A warm, friendly female voice with a slight British accent",
  },
});
```

## When to Use Each Model

| Scenario                | Recommended         | Why                                  |
| ----------------------- | ------------------- | ------------------------------------ |
| Narration, audiobooks   | Speech 2.8 HD       | Studio-grade quality, 40+ languages  |
| Quick drafts, iteration | Speech 2.8 Turbo    | Fast, cheapest per-token             |
| Clone a specific voice  | Chatterbox Turbo    | 5-second sample, natural pauses      |
| Voice from description  | Qwen TTS            | No sample needed, describe the voice |
| Non-English content     | Speech 2.8 Turbo/HD | Broadest language support (40+)      |

## macOS Offline Fallback: `say`

macOS ships 30+ built-in neural voices via the `say` command. Instant, offline, zero-cost. Useful for quick reads and completion notifications.

```bash
say "Hello from Alex"
say -f document.txt
say -o output.m4a --data-format=aac "Dream state finished"
say -v Alex "I am Alex, reading your documentation"
```

**Completion notifications** for long operations:

```bash
node .github/muscles/brain-qa.cjs --mode quick && say "Brain QA complete"
```

## Accessibility Benefits

| Use Case             | Benefit                                 |
| -------------------- | --------------------------------------- |
| **Vision impaired**  | Full document access via audio          |
| **Multitasking**     | Review code while walking/driving       |
| **Learning**         | Auditory reinforcement of reading       |
| **Proofreading**     | Catch errors by hearing text            |
| **Content creation** | Generate narration for videos, podcasts |

## Synapses

- [.github/skills/image-handling/SKILL.md] (High, Complements, Bidirectional) - "Shared Replicate TTS model catalog"
- [.github/instructions/language-detection-patterns.instructions.md] (Medium, Enables, Forward) - "Language detection for multi-language TTS"

## Version History

### v3.0.0 (2026-04-09)

- Rewritten: removed all Edge TTS references (feature removed in v7.4.0)
- Focus on Replicate cloud TTS models (MiniMax, Chatterbox, Qwen)
- Added staleness watch URLs for 30-day re-check cadence

### v2.5.0 (2026-02-09)

- Speak Prompt command, Voice Mode summarization, keyboard shortcuts (Edge TTS era)

### v1.0.0 (2026-02-04)

- Initial implementation via MCP server
