---
sem: 1
description: "Generate speech with 15 TTS models — voice presets, cloning, emotion control"
application: "When generating narration, audiobooks, or voice content"
---

# Text-to-Speech

**Skill**: [text-to-speech/SKILL.md](../skills/text-to-speech/SKILL.md)

---

## Commands

```bash
# Basic generation
node scripts/generate-voice.js "Hello, welcome to the documentation." --model mm28turbo

# With voice preset
node scripts/generate-voice.js "Chapter one begins here." --model mm28hd --voice Deep_Voice_Man

# With emotion and prosody
node scripts/generate-voice.js "I am so excited!" --model mm28turbo --emotion happy --pitch 1.1 --speed 1.1

# Voice cloning
node scripts/generate-voice.js "Testing cloned voice." --model chatterbox --audio sample.mp3

# ElevenLabs with parameters
node scripts/generate-voice.js "Stable voice output." --model elevenv3 --stability 0.5 --similarity 0.75
```

---

## Model Catalog (15 Models)

| Key | Model | Cost | Clone | Emotion | Languages |
|-----|-------|------|-------|---------|-----------|
| `mm28turbo` | MiniMax 2.8 Turbo | $0.06/1k tok | ❌ | ✅ | 40+ |
| `mm28hd` | MiniMax 2.8 HD | higher | ❌ | ✅ | 40+ |
| `mm02turbo` | MiniMax 0.2 Turbo | $0.05/1k | ❌ | ✅ | 40+ |
| `mm02hd` | MiniMax 0.2 HD | higher | ❌ | ✅ | 40+ |
| `mm26turbo` | MiniMax 2.6 Turbo | $0.04/1k | ❌ | ✅ | 40+ |
| `mm26hd` | MiniMax 2.6 HD | higher | ❌ | ✅ | 40+ |
| `mmclone` | MiniMax Clone | $0.08/1k | ✅ 10s | ✅ | 40+ |
| `chatterbox` | Resemble Chatterbox | $0.025/1k | ✅ 5s | ❌ | EN |
| `chatturbo` | Resemble Turbo | $0.02/1k | ✅ 5s | ❌ | EN |
| `chatpro` | Resemble Pro | $0.05/1k | ✅ 15s | ❌ | EN |
| `chatmlang` | Resemble Multilang | $0.035/1k | ✅ 5s | ❌ | 29 |
| `qwentts` | Qwen3 TTS | $0.02/1k | ✅ | ❌ | 10 |
| `elevenv3` | ElevenLabs v3 | $0.30/1k | ✅ | ❌ | 29 |
| `eleventurbo` | ElevenLabs Turbo | $0.18/1k | ✅ | ❌ | 29 |
| `kokoro` | Kokoro | Free tier | ❌ | ❌ | EN |

---

## Model Selection

| Need | Model | Why |
|------|-------|-----|
| **Default / narration** | mm28turbo | Fast, 40 lang, emotion |
| **Studio quality** | mm28hd | Highest fidelity |
| **Clone a voice** | chatterbox | 5s sample, natural |
| **Clone + multilingual** | chatmlang | 29 languages |
| **Describe voice (no sample)** | qwentts | Text → voice |
| **Budget** | kokoro | Free tier |
| **Highest clone fidelity** | elevenv3 | 29 lang, best similarity |

---

## Emotion & Prosody Control (MiniMax)

```javascript
{
  emotion: "happy",     // happy, sad, angry, fearful, disgusted, surprised, auto
  pitch: 1.1,           // 0.5–2.0 (1.0 = normal)
  volume: 1.0,          // 0.5–2.0
  speed: 1.2            // 0.5–2.0
}
```

---

## ElevenLabs Parameters

```javascript
{
  stability: 0.5,          // 0.0–1.0 (lower = more expressive)
  similarity_boost: 0.75,  // 0.0–1.0 (higher = closer to original)
  style: 0.0,              // 0.0–1.0 (style exaggeration)
  use_speaker_boost: true  // Enhanced similarity
}
```

---

## Voice Presets

**MiniMax**: `Wise_Woman`, `Deep_Voice_Man`, `Casual_Guy`, `Lively_Girl`, `Young_Knight`, `Abbess`

**Chatterbox**: `Andy`, `Luna`, `Ember`, `Aurora`, `Cliff`, `Josh`, `William`, `Orion`, `Ken`

**Qwen**: `Aiden`, `Dylan`, `Eric`, `Serena`, `Vivian`

---

## Cost Comparison (1000 words)

| Model | Cost |
|-------|------|
| kokoro | Free |
| chatturbo | ~$0.10 |
| qwentts | ~$0.10 |
| chatterbox | ~$0.13 |
| mm28turbo | ~$0.30 |
| eleventurbo | ~$0.90 |
| elevenv3 | ~$1.50 |

---

## See Also

- [video-generation](video-generation.prompt.md) — Talking-head workflow
- [music-generation](music-generation.prompt.md) — Background music
- [audio-memory](../instructions/audio-memory.instructions.md) — Voice sample storage
