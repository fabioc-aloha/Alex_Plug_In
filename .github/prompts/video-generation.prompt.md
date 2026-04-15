---
sem: 1
description: "Generate AI videos with 17 models — text-to-video, image-to-video, editing, and talking-head workflows"
application: "When generating videos, animating images, or creating clips"
---

# Video Generation

**Skill**: [video-generation/SKILL.md](../skills/video-generation/SKILL.md)

---

## Commands

```bash
# Text-to-video
node scripts/generate-video.js "A person walking through a futuristic city" --model veo3fast --duration 6

# Image-to-video
node scripts/generate-video.js "Gentle breeze, subtle movement" --model kling --image hero.png --duration 5

# Talking-head workflow (4 steps)
node scripts/generate-video.js "Person speaking to camera" --model kling26 --image ref.png --duration 10
node scripts/generate-voice.js "[script]" --model mm28turbo
node scripts/generate-edit-video.js --model avmerge --video clip.mp4 --audio speech.mp3

# Video editing
node scripts/generate-edit-video.js --model reframe --video clip.mp4 --aspect 9:16
node scripts/generate-edit-video.js --model upscale --video clip.mp4 --resolution 4k
```

---

## Model Catalog (17 Models)

| Key | Model | Duration | Audio | Cost | Best For |
|-----|-------|----------|-------|------|----------|
| `veo3fast` | Veo 3.1 Fast | 4/6/8s | ✅ | $0.10–0.15/sec | **Default** |
| `veo3` | Veo 3.1 | 4/6/8s | ✅ | $0.20–0.40/sec | Premium |
| `grok` | Grok Video | 1–15s | ✅ | $0.05/sec | **Best lip-sync** |
| `gen45` | Gen-4.5 Runway | 5–10s | ❌ | $0.12/sec | Motion quality |
| `kling` | Kling v3 | 3–15s | Opt | $0.17–0.22/sec | Multi-shot |
| `kling26` | Kling v2.6 | 5–10s | ✅ | variable | **Best talking-head i2v** |
| `kling3omni` | Kling v3 Omni | 3–15s | ❌ | variable | Multimodal |
| `sora` | Sora-2 | 4–12s | ✅ | $0.10/sec | Realistic |
| `sora2pro` | Sora-2 Pro | 4/8/12s | ✅ | $0.30–0.50/sec | Highest quality |
| `seedance` | Seedance Lite | 2–12s | ❌ | $0.036/sec | **Budget** |
| `seedpro` | Seedance Pro | 2–12s | ❌ | $0.15/sec | 1080p |
| `pixverse` | PixVerse v5.6 | 5/10s | ✅ | variable | Physics, effects |
| `hailuo` | Hailuo-02 | 6/10s | ❌ | variable | Real-world physics |
| `hailuo23` | Hailuo-2.3 | 6/10s | ❌ | variable | Human motion |
| `ray2` | Ray 2 Luma | 5/9s | ❌ | $0.18/sec | Camera concepts |
| `rayflash` | Ray Flash 2 | 5/9s | ❌ | $0.06/sec | Fast + cheap |
| `wan` | WAN 2.5 Fast | 5–10s | ✅ | $0.068/sec | Budget + audio |

---

## Model Selection Guide

| Need | Model | Reason |
|------|-------|--------|
| **Default / Quick preview** | veo3fast | Best balance: speed, quality, cost |
| **Talking head / lip-sync** | grok, kling26 | Grok: best lip-sync; Kling26: best motion |
| **High quality cinematic** | sora2pro, veo3 | Premium quality, synced audio |
| **Image animation** | kling, gen45 | Strong image-to-video |
| **Budget production** | rayflash, seedance | Cheapest per-second |
| **Longest duration (15s)** | grok, kling | Only models supporting 15s |
| **Real-world physics** | hailuo, hailuo23 | Physics simulation, VFX |

---

## Talking-Head Workflow

Proven pipeline for generating a person speaking to camera:

```bash
# Step 1 — Age-progress reference photo (if needed)
node scripts/generate-image.js "A 26-year-old professional in studio" --model nanapro --image ref.png

# Step 2 — Generate video with Kling v2.6 (best talking-head i2v)
node scripts/generate-video.js "Person looking directly into camera, speaking confidently" --model kling26 --image aged.jpg --duration 10

# Step 3 — Generate speech
node scripts/generate-voice.js "[script]" --model mm28turbo

# Step 4 — Merge video + speech
node scripts/generate-edit-video.js --model avmerge --video clip.mp4 --audio speech.mp3
```

**Model notes:**
- `kling26` — Best overall motion quality for talking-head i2v
- `grok` — Best lip sync, but no native audio (requires `avmerge`)
- `veo3fast` / `sora` — May flag real-person reference photos

---

## Video Editing (10 Models)

| Key | Model | Purpose | Cost |
|-----|-------|---------|------|
| `modify` | Luma Modify | AI video style transfer | variable |
| `reframe` | Luma Reframe | AI crop to new aspect ratio | $0.06/sec |
| `trim` | Trim Video | Extract segment by time | <$0.001 |
| `merge` | Video Merge | Concatenate videos | variable |
| `avmerge` | ffmpeg-static | Combine audio + video | **free** (local) |
| `extract` | Extract Audio | Strip audio from video | variable |
| `frames` | Frame Extractor | Export frames as images | <$0.001 |
| `upscale` | Real-ESRGAN | AI upscale to 4K | ~$0.46 |
| `caption` | AutoCaption | Auto subtitles | ~$0.07 |
| `utils` | Video Utils | Convert, misc ops | <$0.002 |

---

## Prompt Engineering

### Camera Motion

```
slow dolly forward
tracking shot following subject
static shot
slow pan left to right
aerial drone shot
```

### Lighting

```
golden hour lighting
dramatic side lighting
soft diffused lighting
high contrast noir
natural daylight
```

### Style

```
cinematic 4K
documentary style
dream-like ethereal
realistic home video
professional commercial
```

---

## Cost Comparison (10s clip)

| Model | Cost | Quality |
|-------|------|---------|
| seedance | ~$0.36 | Good |
| rayflash | ~$0.60 | Good |
| wan | ~$0.68 | Good + audio |
| veo3fast | ~$1.00 | Great + audio |
| grok | ~$0.50 | Great + lip-sync |
| sora2pro | ~$3.00+ | Premium |

---

## See Also

- [text-to-speech](text-to-speech.prompt.md) — Voice generation for talking-head
- [music-generation](music-generation.prompt.md) — Background music
- [image-handling](image-handling.prompt.md) — Source images for i2v
