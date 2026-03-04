---
name: "generate-image"
description: "Generate an image, video, or audio using Replicate AI models"
---

# Generate Image / Video / Audio with Replicate

Use this prompt to generate AI media content via the Replicate API.

## Steps

### 1. Identify the Media Type

Ask (or infer from context):
- **Image** — static image generation or editing
- **Video** — animated clip from text or image
- **Audio/TTS** — voice narration, voice cloning

### 2. Select the Right Model

**Image with text (banner, poster, sign):**
```
Model: ideogram-ai/ideogram-v3-turbo ($0.03)
Params: aspect_ratio='3:1' (banners), magic_prompt_option='Auto', output_format='png'
```

**Image with face consistency (portrait, avatar):**
```
Model: google/nano-banana-pro ($0.025/image)  
Params: image_input=[<dataURI array>], aspect_ratio='1:1', output_format='png'
Fast alt: google/nano-banana-2 ($0.067/1K, same API, faster)
```

**Edit an existing image:**
```
Model: black-forest-labs/flux-kontext-pro ($0.04)
Params: prompt='describe the edit', image=<input URL>
```

**Clean production image (no text, no face refs):**
```
Model: black-forest-labs/flux-1.1-pro ($0.04)
Params: aspect_ratio='21:9' (banners) or '1:1' (square), output_format='png'
```

**Fast prototype:**
```
Model: black-forest-labs/flux-schnell ($0.003)
Params: aspect_ratio='21:9', output_format='png'
```

**SVG vector graphic:**
```
Model: recraft-ai/recraft-v4-svg (clean) or recraft-ai/recraft-v4-pro-svg ($0.30, detailed)
```

**Short video (≤8s, with audio):**
```
Model: google/veo-3.1-fast
Params: duration=6 (ONLY 4/6/8 accepted), prompt='...'
```

**Longer video (≤15s) or lip-sync:**
```
Model: xai/grok-imagine-video ($0.05/sec)
Params: prompt='...', duration=10
```

**Voice narration (TTS):**
```
Model: resemble-ai/chatterbox-turbo (voice cloning, $0.025/1k chars)
      qwen/qwen3-tts (voice design from description)
      minimax/speech-2.8-turbo (40+ languages, emotion control)
```

### 3. Write the Generation Script

```javascript
import Replicate from 'replicate';
import fs from 'fs-extra';
import https from 'https';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const output = await replicate.run('<model-id>', {
  input: {
    prompt: '<your prompt>',
    // model-specific params
  }
});

// Handle output (may be URL, array, or getter function)
let url;
if (output && typeof output.url === 'function') { url = output.url().toString(); }
else if (Array.isArray(output)) { url = output[0]; }
else { url = String(output); }

// Download result
const response = await fetch(url);
const buffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync('output.png', buffer);
console.log('✅ Saved: output.png');
```

### 4. Run and Review

```bash
node generate.js
# Check output quality
# Adjust prompt if needed
# Iterate with Schnell first, then upgrade to Pro/Quality tier
```

### 5. Save to Assets

- Place output in `assets/` folder
- Name clearly: `banner-main.png`, `avatar-age-21.png`
- Save generation report: `{ model, prompt, cost, timestamp }` to `assets/generation-report.json`

## Common Mistakes to Avoid

- ❌ `ideogram v2 aspect_ratio: '21:9'` → Use `'3:1'`
- ❌ `magic_prompt_option: 'ON'` → Must be `'On'` (case-sensitive)
- ❌ `nano-banana-pro image: dataURI` (single) → Use `image_input: [dataURI]` (array)
- ❌ `veo-3 duration: 5` → ONLY `4`, `6`, or `8` accepted
- ❌ Skipping rate limiting → Add `await new Promise(r => setTimeout(r, 2000))` between calls

## Reference

Read `.github/skills/image-handling/SKILL.md` for complete model tables, pricing, and code templates.
