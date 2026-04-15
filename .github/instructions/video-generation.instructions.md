---
description: "AI video generation via Replicate — 17 models, editing, and production workflows"
application: "When generating videos from text or images using AI models"
applyTo: '**/*video*,**/*animate*,**/*clip*'
---

# Video Generation

Generate AI videos using 17 cloud models on Replicate.

## Model Quick Reference

| Model | Duration | Audio | Best For | Cost |
|-------|----------|-------|----------|------|
| `veo3fast` | 4/6/8s | ✅ Auto | **Default** | $0.10–0.15/sec |
| `grok` | 1–15s | ✅ Lip-sync | **Best lip-sync** | $0.05/sec |
| `kling26` | 5–10s | ✅ Auto | **Best talking-head i2v** | variable |
| `kling` | 3–15s | Optional | Multi-shot | $0.17–0.22/sec |
| `sora2pro` | 4/8/12s | ✅ Auto | Premium quality | $0.30–0.50/sec |
| `rayflash` | 5/9s | ❌ | **Budget** | $0.06/sec |
| `seedance` | 2–12s | ❌ | Budget | $0.036/sec |

## Model Selection

| Need | Model | Why |
|------|-------|-----|
| Quick preview | veo3fast | Fast, auto audio |
| Talking head | kling26, grok | Best motion/lip-sync |
| Budget production | rayflash, seedance | Cheapest per-second |
| Premium quality | sora2pro, veo3 | Highest fidelity |
| Longest (15s) | grok, kling | Only models supporting 15s |

## Talking-Head Workflow

```bash
# 1. Generate video with kling26 (best talking-head)
node scripts/generate-video.js "Person speaking to camera" --model kling26 --image ref.png --duration 10

# 2. Generate speech
node scripts/generate-voice.js "[script]" --model mm28turbo

# 3. Merge video + speech
node scripts/generate-edit-video.js --model avmerge --video clip.mp4 --audio speech.mp3
```

## Video Editing Models

| Model | Purpose | Cost |
|-------|---------|------|
| `avmerge` | Combine audio + video | **free** (local) |
| `reframe` | AI crop to aspect ratio | $0.06/sec |
| `upscale` | AI upscale to 4K | ~$0.46 |
| `caption` | Auto subtitles | ~$0.07 |

## Skill Reference

Full documentation: [video-generation/SKILL.md](../skills/video-generation/SKILL.md)
