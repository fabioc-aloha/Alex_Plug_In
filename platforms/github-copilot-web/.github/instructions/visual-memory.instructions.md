---
description: "Self-sufficient skills with embedded reference media — visual, audio, and video memory management for face-consistent generation"
applyTo: "**/visual-memory*,**/reference-portrait*,**/face-consistent*"
---

# Visual Memory

## Activation Triggers

Activate this skill when the user mentions:

**Visual Memory:**
- "add reference photos", "add to visual memory", "add subject to visual memory"
- "face consistent generation", "face consistency with photos"
- "embed reference photos", "base64 reference", "convert to base64"
- "resize photos for AI", "prepare reference photos"
- "self-sufficient skill", "portable reference images"
- "visual-memory.json"

**Audio Memory:**
- "add voice sample", "clone voice", "add to audio memory"
- "voice reference", "TTS cloning", "chatterbox reference"

**Video Memory:**
- "video style template", "consistent motion", "add video style"

**Not this skill:**
- Generic image generation without likeness requirement
- SVG / diagram / infographic generation

---

## Quick Reference

### Critical API Parameters

| Model             | Parameter      | Max Refs |
| ----------------- | -------------- | -------- |
| `nano-banana-pro` | `image_input`  | 14       |
| `flux-2-pro`      | `input_images` | 8        |
| `ideogram-v2`     | ❌ None        | —        |

### Visual Memory Location

```

.github/skills/<skill-name>/visual-memory/
├── index.json ← Metadata (committed, no binary)
├── visual-memory.json ← Full base64 data URIs (⚠️ may contain PII)
└── <subject>-N.jpg ← Original photos (optional)

````

### Load Visual Memory (Node.js)

```javascript
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const SKILL_DIR = dirname(fileURLToPath(import.meta.url));
const vmData = JSON.parse(
  readFileSync(join(SKILL_DIR, ".github/skills/<skill>/visual-memory/visual-memory.json"), "utf8")
);

// Get data URIs for a subject
const subjectRefs = vmData.subjects["<name>"].images.map((i) => i.dataUri);
````

### Prompt Anchor (Required for Likeness)

```
Generate a photo of EXACTLY the person shown in the reference images.
[Scene]. Wearing [clothing]. [Expression]. [Background]. Professional photography.
```

**NEVER describe physical features** (hair color, eye color, skin tone, build) when using reference photos.

---

## Adding a New Subject (Quick Steps)

1. **Prepare**: Resize photos to `512px @ 85% JPEG` with ImageMagick:

   ```powershell
   magick input.jpg -resize "512x512>" -quality 85 output.jpg
   ```

2. **Encode**: Convert to base64 Node.js or PowerShell:

   ```powershell
   "data:image/jpeg;base64," + [Convert]::ToBase64String([IO.File]::ReadAllBytes("photo.jpg"))
   ```

3. **Add**: Insert into `visual-memory.json` under `subjects.<name>.images[]`

4. **Update**: Increment count in `index.json`

**Target**: 5-8 photos per subject — front, 3/4 left, 3/4 right, profile, varied lighting.

---

## Security

`visual-memory.json` may contain PII (photos of real people). Before publishing or syncing:

- ✅ Add to `.vscodeignore` or `.gitignore` if heir is public
- ✅ Run distribution security scan before packaging
- ✅ Never commit real people's photos to a public repository
