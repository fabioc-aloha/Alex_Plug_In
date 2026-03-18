---
applyTo: "**/*.png,**/*.jpg,**/*.jpeg,**/*.webp,**/*.svg,**/*.ico,**/*image*,**/*banner*,**/*icon*,**/*avatar*,**/*photo*,**/generate-*.js,**/generate-*.ts"
description: "Image format selection, conversion rules, and Replicate model selection for AI image/video/audio generation"
---

# Image Handling Instructions

## Format Selection Rules

- Use **SVG** for icons, logos, and diagrams — never rasterize unnecessarily
- Use **PNG** for screenshots and images requiring transparency
- Use **JPEG** for photos and gradients where transparency isn't needed
- Use **WebP** for web images requiring best compression
- Always optimize: PNG → `pngquant`, JPEG → `jpegoptim`, SVG → `svgo`

## SVG to PNG Conversion

- Use `sharp-cli` with `--density 150+` for crisp text rendering
- Output path MUST be a directory, not a filename: `npx sharp-cli -i input.svg -o assets/ --density 150 -f png`
- Do NOT embed emojis in SVGs intended for rasterization — they don't convert reliably

## Replicate Model Selection

When a user asks to generate an image, video, or audio via Replicate, read `.github/skills/image-handling/SKILL.md` and select the appropriate model:

### Image Generation Priority

1. **Banner** → `recraft-ai/recraft-v4-svg` (SVG default — scalable, theme-aware, lightweight); fallback to Ideogram v3 Turbo for raster with text
2. **Micro-icon concepting / emoji-style icon ideation** → `miike-ai/flux-ico:<version>` or `appmeloncreator/platmoji-beta:<version>` for PNG concept passes only; use required trigger words from the model page (`ICO`, `emoji`)
2. **Has reference face images** → `google/nano-banana-pro` (`image_input` array, up to 14 refs)
3. **Fast face generation** → `google/nano-banana-2` (same `image_input` API, Gemini 3.1 Flash)
4. **Text must appear in image** → `ideogram-ai/ideogram-v3-turbo` ($0.03, 3:1 for banners)
5. **Edit an existing image** → `black-forest-labs/flux-kontext-pro` (text-prompted editing)
6. **Production image, no text** → `black-forest-labs/flux-1.1-pro` or `flux-2-pro` (multi-ref)
7. **Vector SVG output** → `recraft-ai/recraft-v4-svg` or `recraft-ai/recraft-v4-pro-svg`
8. **Fast prototype** → `black-forest-labs/flux-schnell` ($0.003)

For compact UI icons, do not assume SVG generation is the best fit. `recraft-ai/recraft-v4-svg` is strong for banners and larger vector compositions, but its prompt surface is too art-directed for deterministic sidebar micro-icons. Use raster concept models for ideation, then finalize approved iconography as clean SVG.

### Video Generation Priority

1. **Best audio + cinematic** → `google/veo-3.1-fast` (successor to Veo-3, built-in audio)
2. **Longer video (≤15s) + lip-sync** → `xai/grok-imagine-video` ($0.05/sec)
3. **Cinematic 1080p** → `kwaivgi/kling-v3-video` (multi-shot, native audio)
4. **Realistic home-video quality** → `openai/sora-2`
5. **Budget/open-source** → `wan-video/wan-2.5-t2v-fast`

### Audio / TTS Priority

1. **Voice cloning from sample** → `resemble-ai/chatterbox-turbo` ($0.025/1k chars)
2. **Voice design from description** → `qwen/qwen3-tts` (3 modes: Voice, Clone, Design)
3. **Many languages + emotion** → `minimax/speech-2.8-turbo` ($0.06/1k tokens, 40+ languages)

## Parameters to Always Verify

- `nano-banana-pro` / `nano-banana-2`: use `image_input` (array), NOT `image` (single)
- `flux-2-pro`: use `input_images` (array, up to 8), NOT `image_input`
- `ideogram-v2`: `magic_prompt_option` is case-sensitive (`'On'`, not `'ON'`)
- `ideogram-v3`: use `style_preset` instead of `style_type`; `aspect_ratio: '3:1'` for banners
- Veo-3 duration: **ONLY accepts 4, 6, or 8** — other values rejected with error
- Community Replicate models often require a versioned model ref (`owner/model:sha256...`), not just `owner/model`
- Community LoRA models may require a trigger word from the model README (`ICO`, `emoji`, `GENMOJI`, etc.); prompts can fail stylistically without it
- `recraft-ai/recraft-v4-svg` exposes a minimal control surface (`prompt`, `size`, `aspect_ratio`), so do not rely on it for literal micro-icon geometry

## Code Quality

- Always handle Ideogram URL getter function quirk: `typeof output.url === 'function' ? output.url().toString() : output`
- Add 2-second delay between Replicate API calls for rate limiting
- Use exponential backoff retry for 429 errors (2s, 4s, 8s)
- Prefer the model's `retry_after` hint when Replicate includes it in a 429 response
- Store generation reports as JSON alongside output files

## Post-Generation Verification (VS Code 1.112+)

After generating or converting images, use the built-in `view_image` tool to verify output quality:

- **SVG → PNG conversion**: Confirm text renders crisply, no missing elements
- **AI-generated images**: Check for artifacts, spelling errors in text, character drift
- **Optimized images**: Verify compression didn't introduce visible quality loss
- **Face-reference generation**: Confirm likeness matches reference photos

For batch operations, use VS Code 1.112+'s image carousel to compare multiple outputs side-by-side.
