---
name: "Image Handling Skill"
description: "Right format, right size, right quality — plus AI image generation via Replicate"
applyTo: "**/*.png,**/*.jpg,**/*.jpeg,**/*.webp,**/*.svg,**/*.ico,**/*image*,**/*banner*,**/*icon*,**/*avatar*,**/*photo*"
triggers:
  - "convert svg"
  - "convert png"
  - "convert to png"
  - "convert to jpg"
  - "convert logo"
  - "logo to png"
  - "svg to png"
  - "png to jpg"
  - "image conversion"
  - "resize image"
  - "optimize image"
  - "banner"
  - "screenshot"
  - "rasterize"
  - "make png"
  - "export as png"
  - "export png"
  - "marketplace logo"
  - "marketplace icon"
  - "favicon"
  - "sharp-cli"
  - "generate image"
  - "create image"
  - "make image"
  - "replicate"
  - "flux"
  - "ai image"
  - "edit image"
  - "transform image"
  - "upscale"
  - "enhance image"
  - "flux schnell"
  - "flux dev"
  - "flux pro"
  - "flux 1.1"
  - "ideogram"
  - "ideogram v2"
  - "stable diffusion"
  - "sdxl"
  - "seedream"
  - "which model"
  - "best model for image"
  - "choose model"
  - "text in image"
  - "image with text"
  - "replicate model"
  - "run model"
  - "generate with replicate"
  - "generate video"
  - "create video"
  - "video from image"
  - "animate image"
  - "veo"
  - "kling"
  - "grok video"
  - "generate svg"
  - "vector graphic"
  - "recraft"
  - "nano-banana"
  - "face consistency"
  - "reference photo"
  - "voice clone"
  - "text to speech replicate"
---

# Image Handling Skill

> Right format, right size, right quality.

## Format Selection

| Format | Best For | Supports |
| ------ | -------- | -------- |
| SVG | Icons, logos, diagrams | Infinite scale, animation |
| PNG | Screenshots, transparency | Lossless, alpha channel |
| JPEG | Photos, gradients | Small size, no transparency |
| WebP | Web images | Best compression, both |
| ICO | Favicons | Multi-resolution |

## Conversion Commands

```powershell
# SVG to PNG using sharp-cli (recommended)
# --density sets DPI for vector rendering (150 = crisp text)
npx sharp-cli -i input.svg -o output-folder/ --density 150 -f png

# Note: output must be a directory, filename preserved from input
npx sharp-cli -i banner.svg -o assets/ --density 150 -f png
# Creates: assets/banner.png

# ImageMagick (if installed)
magick input.svg -resize 512x512 output.png
magick input.png -quality 85 output.jpg

# Multiple sizes
foreach ($size in 16,32,64,128,256,512) {
  magick input.svg -resize ${size}x${size} "icon-$size.png"
}
```

## SVG to PNG Tips

- **Emojis don't convert well** - Use text-only or SVG icons
- **Use `--density 150+`** for crisp text rendering
- **Check file size** - README banners should be < 500KB

## GitHub README Images

```markdown
<!-- Absolute URL (always works) -->
![Banner](https://raw.githubusercontent.com/user/repo/main/assets/banner.svg)

<!-- Relative (works in repo) -->
![Banner](./assets/banner.png)

<!-- With dark/light variants -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="banner-dark.svg">
  <img src="banner-light.svg" alt="Banner">
</picture>
```

## Size Guidelines

| Use Case | Max Size | Recommended |
| -------- | -------- | ----------- |
| README banner | 500KB | < 100KB |
| Documentation | 200KB | < 50KB |
| Icons | 50KB | < 10KB |
| Favicon | 10KB | < 5KB |

## Optimization

```powershell
# PNG optimization
pngquant --quality=65-80 input.png -o output.png

# JPEG optimization
jpegoptim --max=85 input.jpg

# SVG optimization
npx svgo input.svg -o output.svg
```

## Batch Processing

```powershell
# Convert all SVGs to PNGs
Get-ChildItem *.svg | ForEach-Object {
  $out = $_.BaseName + ".png"
  magick $_.Name -resize 256x256 $out
}
```

## Replicate Model Selection

Match user intent to the right model. When a user names a specific model or describes a need, use this table.

| Model | Replicate ID | Cost | Best For | Trigger Words |
|-------|-------------|------|----------|---------------|
| **Flux Schnell** | `black-forest-labs/flux-schnell` | $0.003 | Fast iteration, prototyping | "flux schnell", "quick image", "fast generation" |
| **Flux Dev** | `black-forest-labs/flux-dev` | $0.025 | High quality no-text images | "flux dev", "high quality image" |
| **Flux 1.1 Pro** | `black-forest-labs/flux-1.1-pro` | $0.04 | Production, photorealistic | "flux pro", "flux 1.1", "production image" |
| **Ideogram v2** | `ideogram-ai/ideogram-v2` | $0.08 | Text in images, typography banners | "ideogram", "text in image", "image with text", "banner" |
| **Ideogram v2 Turbo** | `ideogram-ai/ideogram-v2-turbo` | $0.05 | Fast typography | "ideogram turbo", "fast text image" |
| **SDXL** | `stability-ai/sdxl` | $0.009 | Classic diffusion, LoRA styles | "sdxl", "stable diffusion", "stable diffusion xl" |
| **Seedream 5 Lite** | `bytedance/seedream-5-lite` | varies | 2K/3K with built-in reasoning | "seedream", "bytedance", "high resolution" |
| **Nano-Banana Pro** | `google/nano-banana-pro` | $0.025 | Face-consistent portraits with reference photos (up to 14 refs) | "nano-banana", "face consistency", "portrait", "reference photo" |
| **Flux 2 Pro** | `black-forest-labs/flux-2-pro` | $0.045 | High quality with reference images (up to 8 refs) | "flux 2", "flux-2-pro", "high quality refs" |
| **Recraft v4 SVG** | `recraft-ai/recraft-v4-pro-svg` | $0.30 | Native SVG vector output, editable paths | "recraft", "svg", "vector", "generate svg" |

### Model Selection Guide

- **"quick" / "test" / "prototype"** → Flux Schnell ($0.003, 4 steps)
- **"high quality" / "production"** → Flux 1.1 Pro ($0.04)
- **Text must appear in the image** → Ideogram v2 (only model with crystal-clear typography)
- **Painting style / custom LoRA** → SDXL or Flux Dev with LoRA weights
- **Largest / highest resolution output** → Seedream 5 Lite (2K or 3K)
- **README banner with text** → Ideogram v2 with `3:1` ratio; see `ai-generated-readme-banners` skill
- **README banner without text** → Flux 1.1 Pro with `21:9` ratio
- **Face-consistent portraits** → Nano-Banana Pro ($0.025, pass reference photos via `image_input` array)
- **Multi-reference high quality** → Flux 2 Pro ($0.045, `input_images` up to 8 refs)
- **Vector/SVG logo or graphic** → Recraft v4 SVG ($0.30, native SVG output)
- **Short video clip (≤8s)** → Veo-3 ($0.50/video, auto audio)
- **Longer video (≤15s)** → Grok Video ($0.05/sec, auto audio + lip-sync)
- **Cinematic video** → Kling v3 ($0.22/sec, 1080p, multi-shot)

### LoRA Support (Flux Dev / SDXL)

Both Flux Dev and SDXL accept LoRA weights:

```javascript
// Replicate format
extra_lora: "fofr/flux-pixar-cars"
// HuggingFace format
extra_lora: "huggingface.co/owner/model-name"
// CivitAI format
extra_lora: "civitai.com/models/<id>"
// Direct URL
extra_lora: "https://example.com/weights.safetensors"
```

### Aspect Ratio Reference

| Ratio | Models | Use Case |
|-------|--------|----------|
| `21:9` | Flux (all) | Ultra-wide README banner |
| `3:1` | Ideogram | Wide banner with typography |
| `16:9` | All | Standard widescreen |
| `1:1` | All | Square, avatar, icon |
| `9:16` | All | Mobile, portrait |

## Face Reference Models

For character/portrait consistency across multiple generations, use models that accept reference images:

### Nano-Banana Pro (Recommended for Portraits)

```javascript
const output = await replicate.run("google/nano-banana-pro", {
  input: {
    prompt: "Description of desired scene",
    image_input: referenceImageURIs,  // Array of data URIs (up to 14)
    aspect_ratio: "3:4",
    output_format: "png",
  }
});
```

**Key**: `image_input` accepts an **array** of data URIs. More references = better face consistency.

### Flux 2 Pro (Higher Quality Alternative)

```javascript
const output = await replicate.run("black-forest-labs/flux-2-pro", {
  input: {
    prompt: "Description of desired scene",
    input_images: referenceImageURIs,  // Array of data URIs (up to 8)
    aspect_ratio: "3:4",
    output_format: "png",
  }
});
```

**Key**: `input_images` (not `image_input`) — different parameter name from nano-banana.

### Preparing Reference Photos

```powershell
# Resize to 512px @ 85% quality for optimal API performance
magick input.jpg -resize 512x512 -quality 85 output.jpg

# Convert to base64 data URI (for embedding in visual memory)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("photo.jpg")) | Set-Clipboard
```

Optimal reference specs: 512px longest edge, 85% JPEG quality, ~40-80KB per photo.

---

## Video Generation Models

Generate video from a still image or text prompt via Replicate. All video models support image-to-video workflows.

| Model | Replicate ID | Cost | Duration | Audio | Best For |
|-------|-------------|------|----------|-------|----------|
| **Veo-3** | `google/veo-3` | $0.50/video | 4, 6, or 8s only | ✅ Auto | Short clips with synced audio |
| **Grok Video** | `xai/grok-imagine-video` | $0.05/sec | 1-15s | ✅ Auto (music, SFX, lip-sync) | Longer videos, best audio |
| **Kling v3** | `kwaivgi/kling-v3-video` | $0.22/sec | 3-15s | ✅ Optional (pass `--audio`) | Cinematic quality, 1080p |

### Duration Constraints

| Model | Min | Max | Notes |
|-------|-----|-----|-------|
| Veo-3 | 4s | 8s | **Only accepts 4, 6, or 8** — other values rejected |
| Grok Video | 1s | 15s | Flexible, any integer |
| Kling v3 | 3s | 15s | Modes: `standard` (720p), `pro` (1080p) |

### Video Generation Pattern

Typical workflow: generate a still image first, then animate it:

```javascript
// Step 1: Generate still image
const image = await replicate.run("google/nano-banana-pro", {
  input: { prompt: "Person smiling at camera", image_input: refs }
});

// Step 2: Animate to video
const video = await replicate.run("google/veo-3", {
  input: {
    prompt: "Head turns slowly, smile widens, warm natural lighting",
    image: imageUrl,
    duration: 6
  }
});
```

---

## Cloud TTS Models (Replicate)

For content creation (audiobooks, narration, voice cloning), Replicate offers paid TTS models that complement the free Edge TTS in the extension.

| Model | Replicate ID | Cost | Voice Cloning | Languages | Best For |
|-------|-------------|------|---------------|-----------|----------|
| **Speech Turbo** | `minimax/speech-2.8-turbo` | $0.06/1k tokens | ❌ | 40+ | Fast, expressive, many voices |
| **Chatterbox Turbo** | `resemble-ai/chatterbox-turbo` | $0.025/1k chars | ✅ (5s sample) | English | Voice cloning, natural pauses |
| **Qwen TTS** | `qwen/qwen3-tts` | $0.02/1k chars | ✅ | 10 | Voice design from description |

### Voice Presets

**Speech Turbo**: `Wise_Woman`, `Deep_Voice_Man`, `Casual_Guy`, `Lively_Girl`, `Young_Knight`, `Abbess`, + 6 more
**Chatterbox**: `Andy`, `Luna`, `Ember`, `Aurora`, `Cliff`, `Josh`, `William`, `Orion`, `Ken`
**Qwen TTS**: `Aiden`, `Dylan`, `Eric`, `Serena`, `Vivian`, + 4 more

### Emotion Control (Speech Turbo)

Supported emotions: `auto`, `happy`, `sad`, `angry`, `fearful`, `disgusted`, `surprised`

### Voice Cloning (Chatterbox / Qwen)

Provide a 5+ second audio sample to clone a voice:

```javascript
const output = await replicate.run("resemble-ai/chatterbox-turbo", {
  input: {
    text: "Content to speak in the cloned voice",
    audio_prompt: referenceAudioDataURI  // 5+ seconds WAV/MP3
  }
});
```

### Voice Design (Qwen TTS)

Create a voice from a natural language description:

```javascript
const output = await replicate.run("qwen/qwen3-tts", {
  input: {
    text: "Content to speak",
    tts_mode: "voice_design",
    voice_description: "A warm, friendly female voice with a slight British accent"
  }
});
```

### When to Use Cloud TTS vs Edge TTS

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Read document in VS Code | Edge TTS (extension) | Free, instant, integrated |
| Create audiobook narration | Replicate TTS | Higher quality, voice cloning |
| Generate voice for video | Replicate TTS | Emotion control, design voices |
| Multi-language content creation | Either | Edge has 32 languages; Speech Turbo has 40+ |

---

## Synapses

See [synapses.json](synapses.json) for connections.
