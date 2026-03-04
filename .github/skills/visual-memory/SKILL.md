---
name: "visual-memory"
description: "Embed reference media (photos, voice, video templates) as base64 data URIs in skills for self-sufficient, portable, consistent generation"
metadata:
  inheritance: inheritable
---

# Visual Memory

> Self-sufficient skills that carry their own reference media — no external folder dependencies.

**Pattern Origin**: AlexBooks (promoted 2026-03-01)
**Applies To**: Any skill needing consistent visual identity, voice, or motion style across multiple generation tasks.

---

## The Problem

Skills that depend on external reference files (photo folders, audio samples) break when:

- Skill is synced to a new machine without the original files
- Files are renamed, moved, or deleted
- A different project inherits the skill
- Version control doesn't track binary assets

## The Solution: Visual Memory

Embed optimized reference assets directly in the skill as base64 data URIs. The skill becomes **fully self-sufficient** — it works anywhere, exactly the same way, every time.

```
skill-folder/
├── SKILL.md
├── synapses.json
└── visual-memory/
    ├── index.json              ← Metadata only (no binary data)
    ├── visual-memory.json      ← Full base64 data URIs (~30-80KB per photo)
    └── subject-1.jpg           ← Optional: keep originals alongside
    └── subject-2.jpg
```

---

## Memory Types

### Visual Memory (Photos as Base64)

Reference photos for face-consistent portrait generation. Embedded to eliminate folder dependencies.

| Spec           | Value                                    |
| -------------- | ---------------------------------------- |
| Target size    | 512px longest edge                       |
| Quality        | 85% JPEG                                 |
| Per-photo size | ~40-80KB (vs ~2MB originals)             |
| Format         | `data:image/jpeg;base64,<encoded>`       |
| Quantity       | 5-8 photos per subject, varied angles    |

**When to use**: Face-consistent portrait generation, AI character references, persona avatars.

### Audio Memory (Voice Samples)

Short voice samples for TTS cloning. Referenced by path (audio files are too large to base64 inline sensibly).

| Spec        | Value                              |
| ----------- | ---------------------------------- |
| Duration    | 5-15 seconds of clear speech       |
| Format      | WAV or MP3                         |
| Sample rate | 16kHz+                             |
| Content     | Natural speech, no background noise|

**When to use**: Voice cloning with `chatterbox-turbo` or `qwen/qwen3-tts`.

### Video Memory (Style Templates)

Stored as JSON prompt templates — not actual video files.

**When to use**: Consistent motion patterns across video generation tasks.

---

## Implementing Visual Memory in a Skill

### Step 1: Prepare Photos

```powershell
# Install ImageMagick if needed: winget install ImageMagick.ImageMagick

# Resize single photo: 512px longest edge @ 85% JPEG quality
magick input.jpg -resize 512x512> -quality 85 output.jpg

# Batch resize folder
Get-ChildItem *.jpg | ForEach-Object {
    magick $_.Name -resize "512x512>" -quality 85 "resized/$($_.Name)"
}

# Convert PNG to optimized JPG
magick input.png -resize "512x512>" -quality 85 output.jpg
```

### Step 2: Convert to Base64 Data URIs

```javascript
import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";

function toDataUri(imagePath) {
  const buffer = readFileSync(imagePath);
  const ext = imagePath.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  return `data:image/${ext};base64,${buffer.toString("base64")}`;
}

// Batch convert and write to JSON
const photos = ["photo1.jpg", "photo2.jpg", "photo3.jpg"];
const images = photos.map((p) => ({
  filename: basename(p),
  dataUri: toDataUri(p),
  notes: "",
}));

writeFileSync("images.json", JSON.stringify({ images }, null, 2));
```

**Quick PowerShell (single file to clipboard):**

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("photo.jpg")) | Set-Clipboard
# Paste with prefix: "data:image/jpeg;base64,<paste>"
```

### Step 3: Build visual-memory.json

```json
{
  "schema": "visual-memory-v1",
  "generated": "2026-03-01",
  "subjects": {
    "person-name": {
      "description": "Brief visual description",
      "ageInfo": {
        "referenceAge": 30,
        "birthYear": 1990,
        "photoDate": "2026-03"
      },
      "images": [
        {
          "filename": "person-1.jpg",
          "dataUri": "data:image/jpeg;base64,<base64-encoded-image>",
          "notes": "Front-facing, natural lighting"
        },
        {
          "filename": "person-2.jpg",
          "dataUri": "data:image/jpeg;base64,<base64-encoded-image>",
          "notes": "3/4 profile, outdoor"
        }
      ]
    }
  }
}
```

### Step 4: Build index.json (No Binary Data)

```json
{
  "version": "1.0",
  "generated": "2026-03-01",
  "targetSize": 512,
  "subjects": {
    "person-name": {
      "count": 7,
      "files": ["person-1.jpg", "person-2.jpg", "person-3.jpg"]
    }
  }
}
```

### Step 5: Load Visual Memory at Runtime

```javascript
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VISUAL_MEMORY_PATH = join(
  __dirname,
  ".github/skills/<skill-name>/visual-memory/visual-memory.json"
);

function loadVisualMemory() {
  const data = JSON.parse(readFileSync(VISUAL_MEMORY_PATH, "utf8"));
  return Object.fromEntries(
    Object.entries(data.subjects).map(([name, subject]) => [
      name,
      subject.images.map((i) => i.dataUri),
    ])
  );
}

const visualMemory = loadVisualMemory();
// visualMemory.personName → array of data URIs
```

---

## Critical Generation Rules

### Do NOT Describe Physical Appearance When Using References

The reference photos speak for themselves. Only describe:

- Scene / setting
- Clothing (specific colors, styles)
- Expression (smile, serious, thoughtful)
- Lighting (natural, studio, dramatic)
- Background (office, outdoors, neutral)
- Action / pose

**NEVER** include:
- Hair color, style, or texture
- Eye color
- Skin tone or complexion
- Body type / build
- **Any** physical description of the person

### Model API Parameters for Reference Images

| Model              | Parameter      | Max Refs | Notes               |
| ------------------ | -------------- | -------- | ------------------- |
| `nano-banana-pro`  | `image_input`  | 14       | Array of data URIs, 4K output |
| `nano-banana-2`    | `image_input`  | 14       | Faster/cheaper alternative (Gemini 3.1 Flash) |
| `flux-2-pro`       | `input_images` | 8        | Array of data URIs  |
| `flux-2-flex`      | `input_images` | 10       | Max-quality editing |
| `ideogram-v2`      | ❌ None        | —        | No face reference   |

### Prompt Anchor Pattern

Always start the prompt with explicit reference instruction:

```
Generate a photo of EXACTLY the person shown in the reference images.
```

For multiple subjects at once:

```
Generate a photo with two people.
LEFT: EXACTLY the person from [Name A]'s reference images, wearing [clothing].
RIGHT: EXACTLY the person from [Name B]'s reference images, wearing [clothing].
[Scene description]. [Lighting]. Professional photography.
```

---

## Audio Memory

### Voice Cloning Setup

```json
{
  "voices": {
    "subject-voice": {
      "description": "Natural speaking voice",
      "audioFile": "visual-memory/voices/subject-sample.wav",
      "duration": "10s",
      "model": "chatterbox-turbo"
    }
  }
}
```

### Supported Cloning Models

| Model              | Cost             | Voice Cloning |
| ------------------ | ---------------- | ------------- |
| `chatterbox-turbo` | $0.025/1k chars  | ✅            |
| `qwen/qwen3-tts`   | $0.02/1k chars   | ✅ (3 modes: Voice, Clone, Design) |
| `minimax/speech-2.8-turbo` | $0.06/1k tokens | ❌ (40+ languages, emotion control) |

---

## Video Memory (Style Templates)

Store consistent motion style as JSON — not actual video files:

```json
{
  "videoStyles": {
    "portrait-animation": {
      "description": "Subtle head movements, natural breathing",
      "promptTemplate": "Head turns slowly, subtle smile, natural breathing, soft lighting",
      "model": "veo-3",
      "defaultDuration": 6
    }
  }
}
```

---

## Adding New Memories

### Adding a New Visual Subject

1. Collect 5-8 photos (varied angles: front, 3/4, profile, different lighting)
2. Resize to 512px longest edge @ 85% JPEG
3. Convert to base64 data URIs
4. Add to `visual-memory.json` under `subjects.<name>`
5. Update `index.json` with file count

**Target photo guidelines:**

| Element    | Recommendation                              |
| ---------- | ------------------------------------------- |
| Quantity   | 5-8 photos (more = better likeness)         |
| Angles     | Front, 3/4 left, 3/4 right, slight profile |
| Lighting   | Mixed (natural, indoor, flash, outdoor)     |
| Expression | Neutral, smiling, serious — varied          |
| File size  | 40-80KB each after 512px/85% optimization   |
| Total size | ~500KB for 8-10 photos — acceptable         |

### Adding a Voice Sample

1. Record 5-15 seconds of clear natural speech
2. Export as WAV 16kHz+ or MP3
3. Store in `visual-memory/voices/`
4. Register in `voices` section of `visual-memory.json`

---

## Benefits Summary

| Without Visual Memory     | With Visual Memory                    |
| ------------------------- | ------------------------------------- |
| External photo folder required | No external dependencies         |
| Breaks on different machines   | Works anywhere                    |
| Manual path management    | Always correct path                   |
| Version control nightmare  | JSON in version control              |
| Different results per machine  | Exact consistency everywhere      |
| ~2MB unoptimized originals | ~50MB → 500KB optimized               |
