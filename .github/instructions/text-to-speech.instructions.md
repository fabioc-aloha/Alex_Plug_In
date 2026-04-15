---
description: "Cloud TTS via Replicate — 15 models, emotion control, and voice cloning"
application: "When generating speech from text or selecting TTS models"
applyTo: '**/*tts*,**/*speech*,**/*narrat*,**/*audiobook*'
---

# Text-to-Speech

Generate speech using 15 TTS models on Replicate.

## Model Quick Reference

| Model | Cost | Clone | Emotion | Languages |
|-------|------|-------|---------|-----------|
| `mm28turbo` | $0.06/1k tok | ❌ | ✅ | 40+ |
| `mm28hd` | higher | ❌ | ✅ | 40+ |
| `chatterbox` | $0.025/1k | ✅ 5s | ❌ | EN |
| `chatturbo` | $0.02/1k | ✅ 5s | ❌ | EN |
| `chatpro` | $0.05/1k | ✅ 15s | ❌ | EN |
| `chatmlang` | $0.035/1k | ✅ 5s | ❌ | 29 |
| `qwentts` | $0.02/1k | ✅ | ❌ | 10 |
| `kokoro` | Free tier | ❌ | ❌ | EN |

## Model Selection

| Need | Model | Why |
|------|-------|-----|
| Fast narration | mm28turbo | Fast, 40 lang, emotion |
| Studio quality | mm28hd | Highest fidelity |
| Clone a voice | chatterbox | 5s sample, natural |
| Clone + multilingual | chatmlang | 29 languages |
| Describe voice (no sample) | qwentts | Text description → voice |
| Budget | kokoro | Free tier |

## Emotion / Prosody Control (MiniMax)

```javascript
{
  emotion: "happy",     // happy, sad, angry, fearful, disgusted, surprised
  pitch: 1.1,           // 0.5–2.0, 1.0 = normal
  volume: 1.0,          // 0.5–2.0
  speed: 1.2            // 0.5–2.0
}
```

## Voice Presets (MiniMax)

`Wise_Woman`, `Deep_Voice_Man`, `Casual_Guy`, `Lively_Girl`, `Young_Knight`, `Abbess`

## Chatterbox Voices

`Andy`, `Luna`, `Ember`, `Aurora`, `Cliff`, `Josh`, `William`, `Orion`, `Ken`

## Skill Reference

Full documentation: [text-to-speech/SKILL.md](../skills/text-to-speech/SKILL.md)

For voice sample storage: [audio-memory/SKILL.md](../skills/audio-memory/SKILL.md)
