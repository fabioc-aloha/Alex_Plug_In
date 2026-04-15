---
description: "AI music generation via Replicate — model selection, lyrics format, and production patterns"
application: "When generating AI music, soundtracks, or background audio"
applyTo: "**/*music*,**/*soundtrack*,**/*score*"
---

# Music Generation

## Model Selection

| Need | Model | Cost |
|------|-------|------|
| Song with lyrics | `minimax/music-1.5` | $0.03/file |
| Match existing style | `minimax/music-01` | $0.035/file |
| Budget instrumental | `stability-ai/stable-audio-2.5` | $0.20/file |
| Premium quality | `elevenlabs/music` | $8.30/1k sec |
| Exclude elements | `google/lyria-2` | $2/1k sec |

## Lyrics Format (MiniMax)

```text
[verse]
First verse lyrics here...

[chorus]
Catchy chorus lyrics...

[bridge]
Transitional section...
```

## Quick Examples

```javascript
// Song with lyrics
await replicate.run("minimax/music-1.5", {
  input: { prompt: "Uplifting pop rock", lyrics: "[verse]..." },
});

// Instrumental with negative prompt
await replicate.run("stability-ai/stable-audio-2.5", {
  input: {
    prompt: "Cinematic orchestral",
    duration: 60,
    negative_prompt: "vocals, drums",
  },
});
```

## See Also

- [Music Generation SKILL](../skills/music-generation/SKILL.md) — Full model catalog
- [text-to-speech](text-to-speech.instructions.md) — Combine with narration
- [video-generation](video-generation.instructions.md) — Background music for videos
